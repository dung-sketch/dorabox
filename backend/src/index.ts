import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateUploadUrl } from './services/r2.service.js';
import { supabaseAdmin } from './services/supabase.service.js';
import adminRouter from './routes/admin.routes.js';
import { renderAdminPage } from './views/admin_page.js';
import { sendFcmHttpV1Message } from './services/firebase.service.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Giao diện Web Admin Portal trực quan
app.get('/admin', (req, res) => {
  res.send(renderAdminPage());
});

// Admin REST APIs
app.use('/api/admin', adminRouter);

// Root endpoint kiểm tra trạng thái
app.get('/', (req, res) => {
  res.json({
    platform: 'Dorabox Mini Social Network API',
    status: 'online',
    version: '1.0.0',
    adminPortal: '/admin',
    supabaseConfigured: Boolean(process.env.SUPABASE_URL),
    r2Configured: Boolean(process.env.R2_ACCOUNT_ID),
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    platform: 'Dorabox API',
    status: 'online',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Endpoint cấp Presigned URL upload ảnh lên Cloudflare R2
 * Android client gọi endpoint này lấy link rồi đẩy file trực tiếp lên R2
 */
app.all('/api/upload/presigned-url', async (req, res) => {
  try {
    const userId = req.body?.userId || req.query.userId;
    const folder = req.body?.folder || req.query.folder || 'posts';
    const contentType = req.body?.contentType || req.query.contentType || 'image/webp';

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const fileExt = req.body?.fileExt || req.query?.fileExt;

    const result = await generateUploadUrl(
      String(userId),
      (folder === 'avatars' || folder === 'chat') ? folder : 'posts',
      String(contentType),
      fileExt ? String(fileExt) : undefined
    );

    return res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error generating presigned URL:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

/**
 * Endpoint tra cứu Email tương ứng với Username
 * Hỗ trợ tính năng đăng nhập bằng Email hoặc Username trên Dorabox
 */
app.post('/api/auth/resolve-username', async (req, res) => {
  try {
    let { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
    username = String(username).replace(/^@/, '').trim().toLowerCase();

    // 1. Tìm profile theo username
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from('profiles')
      .select('id, username')
      .ilike('username', username)
      .maybeSingle();

    if (!profile) {
      return res.status(404).json({ error: 'Username không tồn tại' });
    }

    // 2. Tra cứu email của user thông qua Supabase Admin Auth
    const { data: userData, error: userErr } = await supabaseAdmin.auth.admin.getUserById(profile.id);
    if (!userData?.user?.email) {
      return res.status(404).json({ error: 'Không tìm thấy email liên kết' });
    }

    return res.json({
      success: true,
      email: userData.user.email,
    });
  } catch (err: any) {
    console.error('Error resolving username:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

/**
 * Endpoint gửi Push Notification qua FCM (Hỗ trợ chuẩn HTTP v1 mới nhất)
 */
app.post('/api/fcm/send', async (req, res) => {
  try {
    const { fcmToken, title, body, data } = req.body;
    if (!fcmToken || !title) {
      return res.status(400).json({ error: 'fcmToken and title are required' });
    }

    // 1. Thử gửi qua Firebase Admin SDK chuẩn HTTP v1 mới nhất (Service Account)
    const v1Result = await sendFcmHttpV1Message({
      token: fcmToken,
      title,
      body,
      data,
    });

    if (v1Result.success) {
      return res.json({ success: true, messageId: v1Result.messageId });
    }

    // 2. Dự phòng: Legacy Server Key (nếu có cấu hình)
    const fcmServerKey = process.env.FCM_SERVER_KEY;
    if (fcmServerKey) {
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `key=${fcmServerKey}`,
        },
        body: JSON.stringify({
          to: fcmToken,
          notification: {
            title,
            body,
            sound: 'default',
            android_channel_id: 'dorabox_channel',
          },
          android: {
            priority: 'high',
            notification: {
              channel_id: 'dorabox_channel',
            },
          },
          data: data || {},
        }),
      });

      const resData = await response.json();
      return res.json({ success: true, result: resData });
    }

    console.log(`[FCM Mock Log] To: ${fcmToken.slice(0, 10)}... | Title: "${title}" | Body: "${body}"`);
    return res.json({
      success: true,
      message: 'FCM push request processed',
      payload: { fcmToken, title, body, data },
    });
  } catch (error: any) {
    console.error('Error in /api/fcm/send:', error);
    return res.status(500).json({ error: error.message || 'FCM send failed' });
  }
});

/**
 * Endpoint xóa bình luận an toàn cho User (Kiểm tra token & quyền tác giả/chủ bài viết)
 */
app.delete('/api/user/comments/:id', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace(/^Bearer\s+/i, '');
    if (!token) {
      return res.status(401).json({ error: 'Missing Bearer token' });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn' });
    }

    const commentId = req.params.id;
    const { data: comment, error: fetchErr } = await supabaseAdmin
      .from('comments')
      .select('id, user_id, post_id')
      .eq('id', commentId)
      .maybeSingle();

    if (fetchErr || !comment) {
      return res.status(404).json({ error: 'Không tìm thấy bình luận' });
    }

    let isAuthorized = comment.user_id === user.id;
    if (!isAuthorized) {
      const { data: post } = await supabaseAdmin
        .from('posts')
        .select('author_id')
        .eq('id', comment.post_id)
        .maybeSingle();
      if (post && post.author_id === user.id) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return res.status(403).json({ error: 'Bạn không có quyền xóa bình luận này' });
    }

    const { error: delErr } = await supabaseAdmin.from('comments').delete().eq('id', commentId);
    if (delErr) {
      return res.status(500).json({ error: delErr.message });
    }

    return res.json({ success: true, message: 'Đã xóa bình luận thành công' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * Endpoint xóa cuộc trò chuyện an toàn cho User (Xóa tin nhắn + cuộc trò chuyện)
 */
app.delete('/api/user/conversations/:id', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace(/^Bearer\s+/i, '');
    if (!token) {
      return res.status(401).json({ error: 'Missing Bearer token' });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn' });
    }

    const convId = req.params.id;
    const { data: conv, error: fetchErr } = await supabaseAdmin
      .from('conversations')
      .select('id, user_a, user_b')
      .eq('id', convId)
      .maybeSingle();

    if (fetchErr || !conv) {
      return res.status(404).json({ error: 'Không tìm thấy cuộc trò chuyện' });
    }

    if (conv.user_a !== user.id && conv.user_b !== user.id) {
      return res.status(403).json({ error: 'Bạn không có quyền xóa cuộc trò chuyện này' });
    }

    // Xóa messages trước, sau đó xóa conversation
    await supabaseAdmin.from('messages').delete().eq('conversation_id', convId);
    const { error: delErr } = await supabaseAdmin.from('conversations').delete().eq('id', convId);
    if (delErr) {
      return res.status(500).json({ error: delErr.message });
    }

    return res.json({ success: true, message: 'Đã xóa cuộc trò chuyện thành công' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Dorabox Backend API running at http://localhost:${PORT}`);
  });
}

export default app;
