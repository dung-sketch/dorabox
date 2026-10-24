import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateUploadUrl } from './services/r2.service.js';
import { supabaseAdmin } from './services/supabase.service.js';
import adminRouter, { wipeUserAccountCompletely } from './routes/admin.routes.js';
import { renderAdminPage } from './views/admin_page.js';
import { renderArtPlayerPage } from './views/artplayer_page.js';
import { sendFcmHttpV1Message } from './services/firebase.service.js';
import pkgAgora from 'agora-token';
const { RtcTokenBuilder, RtcRole } = pkgAgora;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const ADMIN_PORTAL_PATH = (process.env.ADMIN_PORTAL_PATH || '/dorabox@dungkito.com').trim();

// Giao diện Web Admin Portal bí mật (Hỗ trợ chuẩn xác 100% trên cả Vercel Serverless và Local)
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  const rawPath = (req.path || req.url || '').split('?')[0];
  const lowerPath = rawPath.toLowerCase();
  const targetLower = ADMIN_PORTAL_PATH.toLowerCase();

  if (
    lowerPath === targetLower ||
    lowerPath === '/dorabox@dungkito.com' ||
    lowerPath === '/dorabox%40dungkito.com' ||
    lowerPath === '/api/dorabox@dungkito.com' ||
    lowerPath === '/api/dorabox%40dungkito.com'
  ) {
    return res.send(renderAdminPage());
  }
  next();
});

// Chặn tuyệt đối đường dẫn /admin cũ (Trả về 404 Not Found như không hề tồn tại)
app.get('/admin', (req, res) => {
  res.status(404).send('Cannot GET /admin');
});

// Trình phát video ArtPlayer bảo mật và tự động co giãn theo kích thước
app.get('/watch', (req, res) => {
  const videoUrl = req.query.url ? String(req.query.url) : '';
  const title = req.query.title ? String(req.query.title) : 'Dorabox Video';
  res.send(renderArtPlayerPage(videoUrl, title));
});

// Admin REST APIs
app.use('/api/admin', adminRouter);

// Ẩn hoàn toàn máy chủ tại trang chủ (Giả chết 404 Not Found chuẩn Express)
app.get('/', (req, res) => {
  res.status(404).send('Cannot GET /');
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    platform: 'Dorabox API',
    status: 'online',
    timestamp: new Date().toISOString(),
  });
});

// App Version & OTA Update Check
app.get('/api/app-version', (req, res) => {
  res.json({
    latest_version: '1.4.2',
    build_number: 15,
    apk_url: 'https://doraboxcdn.zpiltk.io.vn/apk/Dorabox-arm64-v8a.apk',
    ios_url: 'https://dorabox.app/ios',
    force_update: false,
    changelog: [
      'Tối ưu bảng màu Sáng / Tối dịu mắt, độ tương phản chuẩn xác.',
      'Nâng cấp tính năng nhóm chat & trang cá nhân OA.',
      'Cải tiến hệ thống bảo mật & tối ưu hiệu năng toàn diện.',
    ]
  });
});

/**
 * Endpoint sinh Agora RTC Token cho tính năng gọi thoại & video trên Dorabox
 * GET /api/agora/token?channel=...&uid=...
 */
app.get('/api/agora/token', (req, res) => {
  try {
    const channelName = req.query.channel ? String(req.query.channel).trim() : '';
    const uid = req.query.uid ? Number(req.query.uid) : 0;

    if (!channelName) {
      return res.status(400).json({ success: false, error: 'Thiếu tham số channel' });
    }

    const appId = process.env.AGORA_APP_ID || 'a1f29a9e08154229931541308c4e4d29';
    const appCertificate = process.env.AGORA_APP_CERTIFICATE || '4534665a8c094e6588faf3766ac12cc2';

    if (!appCertificate) {
      return res.status(500).json({ success: false, error: 'AGORA_APP_CERTIFICATE chưa được cấu hình' });
    }

    const role = RtcRole.PUBLISHER;
    const expireTimeInSeconds = 86400; // 24 giờ

    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      role,
      expireTimeInSeconds,
      expireTimeInSeconds
    );

    return res.json({
      success: true,
      token,
      appId,
      channelName,
      uid,
      expiresIn: expireTimeInSeconds,
    });
  } catch (error: any) {
    console.error('Error generating Agora token:', error);
    return res.status(500).json({ success: false, error: error.message || 'Lỗi sinh token Agora' });
  }
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
    const { fcmToken, title, body, data, channelId } = req.body;
    if (!fcmToken || !title) {
      return res.status(400).json({ error: 'fcmToken and title are required' });
    }

    // 1. Thử gửi qua Firebase Admin SDK chuẩn HTTP v1 mới nhất (Service Account)
    const v1Result = await sendFcmHttpV1Message({
      token: fcmToken,
      title,
      body,
      channelId,
      data,
    });

    if (v1Result.success) {
      return res.json({ success: true, messageId: v1Result.messageId });
    }

    // 2. Dự phòng: Legacy Server Key (nếu có cấu hình)
    const fcmServerKey = process.env.FCM_SERVER_KEY;
    if (fcmServerKey) {
      const targetChannel = channelId || 'dorabox_general_v3';
      let soundName = 'ting';
      if (targetChannel.includes('messages')) {
        soundName = 'tingtingmes';
      } else if (targetChannel.includes('calls')) {
        soundName = 'goiden';
      }

      const isCall = targetChannel.includes('calls') || (data && data.type === 'call');
      const legacyPayload: any = {
        to: fcmToken,
        priority: 'high',
        data: {
          ...(data || {}),
          title,
          body,
        },
        android: {
          priority: 'high',
        },
      };

      legacyPayload.notification = {
        title,
        body,
        sound: soundName,
        android_channel_id: targetChannel,
      };
      legacyPayload.android.notification = {
        channel_id: targetChannel,
        sound: soundName,
      };

      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `key=${fcmServerKey}`,
        },
        body: JSON.stringify(legacyPayload),
      });

      const resData = await response.json();
      return res.json({ success: true, result: resData });
    }

    console.error(`❌ [FCM Error] Không thể gửi thông báo: ${v1Result.error}`);
    return res.status(500).json({
      success: false,
      error: v1Result.error || 'Firebase Admin SDK chưa được cấu hình Service Account (HTTP v1)',
      hint: 'Hãy cấu hình biến môi trường FIREBASE_SERVICE_ACCOUNT_KEY trên Vercel hoặc file JSON Service Account ở Backend',
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
 * Lấy danh sách tên người dùng bị cấm / bảo lưu (Công khai cho Mobile Client)
 */
app.get('/api/auth/banned-usernames', async (req, res) => {
  try {
    const { data } = await supabaseAdmin.from('banned_usernames').select('username');
    if (data && data.length > 0) {
      return res.json({ success: true, usernames: data.map((d: any) => d.username) });
    }
  } catch (_) {}

  const defaultList = [
    'admin', 'administrator', 'superadmin', 'dorabox', 'dorabox_admin',
    'official', 'support', 'help', 'moderator', 'system', 'root',
    'security', 'api', 'null', 'undefined', 'doraemon'
  ];
  return res.json({ success: true, usernames: defaultList });
});

/**
 * Lấy danh sách cuộc trò chuyện của người dùng hiện tại (Hỗ trợ cả 1-1 và Nhóm)
 */
app.get('/api/user/conversations', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ error: 'Missing Bearer token' });

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: 'Phiên đăng nhập không hợp lệ' });
    }

    // 1. Lấy hội thoại cá nhân hoặc nhóm mà user tạo
    const { data: convs, error } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .or(`user_a.eq.${user.id},user_b.eq.${user.id},created_by.eq.${user.id}`)
      .order('last_message_at', { ascending: false });

    if (error) throw error;

    const map = new Map<string, any>();
    for (const c of (convs || [])) map.set(c.id, c);

    // 2. Lấy thêm các nhóm mà user là thành viên trong member_ids (thử cả string và array JSON)
    try {
      const { data: groupConvs } = await supabaseAdmin
        .from('conversations')
        .select('*')
        .eq('is_group', true)
        .contains('member_ids', JSON.stringify([user.id]))
        .order('last_message_at', { ascending: false });

      for (const g of (groupConvs || [])) map.set(g.id, g);
    } catch (_) {}

    try {
      const { data: groupConvsArr } = await supabaseAdmin
        .from('conversations')
        .select('*')
        .eq('is_group', true)
        .contains('member_ids', [user.id])
        .order('last_message_at', { ascending: false });

      for (const g of (groupConvsArr || [])) map.set(g.id, g);
    } catch (_) {}

    const combined = Array.from(map.values()).sort((a, b) => {
      const timeA = new Date(a.last_message_at || a.created_at || 0).getTime();
      const timeB = new Date(b.last_message_at || b.created_at || 0).getTime();
      return timeB - timeA;
    });

    return res.json({ success: true, conversations: combined });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * Tìm hoặc tạo cuộc trò chuyện giữa 2 người dùng
 */
app.post('/api/user/conversations', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ error: 'Missing Bearer token' });

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: 'Phiên đăng nhập không hợp lệ' });
    }

    const { peerId } = req.body;
    if (!peerId) return res.status(400).json({ error: 'Missing peerId' });

    const idA = user.id.localeCompare(peerId) < 0 ? user.id : peerId;
    const idB = user.id.localeCompare(peerId) < 0 ? peerId : user.id;

    const { data: existing } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .or(`and(user_a.eq.${idA},user_b.eq.${idB}),and(user_a.eq.${idB},user_b.eq.${idA})`)
      .maybeSingle();

    if (existing) {
      return res.json({ success: true, conversation: existing });
    }

    const { data: inserted, error: insErr } = await supabaseAdmin
      .from('conversations')
      .insert({
        user_a: idA,
        user_b: idB,
        last_message: 'Đã bắt đầu cuộc trò chuyện',
        last_message_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insErr) throw insErr;
    return res.json({ success: true, conversation: inserted });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * Tạo nhóm trò chuyện mới
 */
app.post('/api/user/groups', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ error: 'Missing Bearer token' });

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: 'Phiên đăng nhập không hợp lệ' });

    const { name, memberIds, avatarUrl } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Tên nhóm không được để trống' });
    }

    const initialMembers = Array.isArray(memberIds) ? memberIds : [];
    const membersSet = new Set<string>([user.id, ...initialMembers]);
    const finalMemberIds = Array.from(membersSet);

    const { data: inserted, error: insErr } = await supabaseAdmin
      .from('conversations')
      .insert({
        is_group: true,
        name: name.trim(),
        avatar_url: avatarUrl || null,
        created_by: user.id,
        user_a: user.id,
        member_ids: finalMemberIds,
        nicknames: {},
        last_message: `Đã tạo nhóm trò chuyện "${name.trim()}"`,
        last_message_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insErr) throw insErr;
    return res.json({ success: true, conversation: inserted });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * Cập nhật thông tin nhóm (Tên nhóm, Avatar nhóm, Thành viên, Biệt danh)
 */
app.put('/api/user/groups/:id', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ error: 'Missing Bearer token' });

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: 'Phiên đăng nhập không hợp lệ' });

    const groupId = req.params.id;
    const { data: conv, error: fetchErr } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .eq('id', groupId)
      .maybeSingle();

    if (fetchErr || !conv || !conv.is_group) {
      return res.status(404).json({ error: 'Không tìm thấy nhóm trò chuyện' });
    }

    const memberList: string[] = Array.isArray(conv.member_ids) ? conv.member_ids : [];
    const isMember = memberList.includes(user.id) || conv.created_by === user.id;
    if (!isMember) {
      return res.status(403).json({ error: 'Bạn không phải thành viên của nhóm này' });
    }

    const updateData: any = {};
    const { name, avatarUrl, memberIds, nicknames } = req.body;
    if (name !== undefined) updateData.name = name.trim();
    if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl;
    if (memberIds !== undefined && Array.isArray(memberIds)) {
      updateData.member_ids = memberIds;
    }
    if (nicknames !== undefined && typeof nicknames === 'object') {
      updateData.nicknames = nicknames;
    }

    const { data: updated, error: updateErr } = await supabaseAdmin
      .from('conversations')
      .update(updateData)
      .eq('id', groupId)
      .select()
      .single();

    if (updateErr) throw updateErr;
    return res.json({ success: true, conversation: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * Rời nhóm hoặc Giải tán / Xóa nhóm trò chuyện
 */
app.delete('/api/user/groups/:id', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ error: 'Missing Bearer token' });

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: 'Phiên đăng nhập không hợp lệ' });

    const groupId = req.params.id;
    const { data: conv, error: fetchErr } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .eq('id', groupId)
      .maybeSingle();

    if (fetchErr || !conv || !conv.is_group) {
      return res.status(404).json({ error: 'Không tìm thấy nhóm trò chuyện' });
    }

    // Nếu người dùng là người tạo nhóm: Xóa vĩnh viễn toàn bộ nhóm và tin nhắn
    if (conv.created_by === user.id) {
      await supabaseAdmin.from('messages').delete().eq('conversation_id', groupId);
      await supabaseAdmin.from('conversations').delete().eq('id', groupId);
      return res.json({ success: true, action: 'deleted', message: 'Đã xóa và giải tán nhóm trò chuyện thành công' });
    }

    // Nếu là thành viên: Rời nhóm (gỡ user.id ra khỏi member_ids)
    const memberList: string[] = Array.isArray(conv.member_ids) ? conv.member_ids : [];
    const newMembers = memberList.filter(id => id !== user.id);
    await supabaseAdmin.from('conversations').update({ member_ids: newMembers }).eq('id', groupId);
    return res.json({ success: true, action: 'left', message: 'Bạn đã rời khỏi nhóm trò chuyện thành công' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * Xóa cuộc trò chuyện cá nhân hoặc nhóm
 */
app.delete('/api/user/conversations/:id', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ error: 'Missing Bearer token' });

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn' });
    }

    const convId = req.params.id;
    const { data: conv, error: fetchErr } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .eq('id', convId)
      .maybeSingle();

    if (fetchErr || !conv) {
      return res.status(404).json({ error: 'Không tìm thấy cuộc trò chuyện' });
    }

    if (conv.is_group) {
      if (conv.created_by === user.id) {
        await supabaseAdmin.from('messages').delete().eq('conversation_id', convId);
        await supabaseAdmin.from('conversations').delete().eq('id', convId);
        return res.json({ success: true, message: 'Đã giải tán nhóm thành công' });
      } else {
        const memberList: string[] = Array.isArray(conv.member_ids) ? conv.member_ids : [];
        const newMembers = memberList.filter(id => id !== user.id);
        await supabaseAdmin.from('conversations').update({ member_ids: newMembers }).eq('id', convId);
        return res.json({ success: true, message: 'Đã rời khỏi nhóm thành công' });
      }
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

/**
 * Endpoint người dùng tự xóa tài khoản vĩnh viễn (Self-deletion)
 * Xác thực Bearer JWT token của Supabase Auth, sau đó xóa toàn bộ dữ liệu & auth user
 */
app.delete('/api/user/account', async (req, res) => {
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

    const result = await wipeUserAccountCompletely(user.id);
    if (!result.success) {
      return res.status(500).json({ error: result.error || 'Lỗi khi xóa sạch tài khoản' });
    }

    return res.json({ success: true, message: 'Đã xóa vĩnh viễn và quét sạch toàn bộ dữ liệu tài khoản người dùng thành công.' });
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
