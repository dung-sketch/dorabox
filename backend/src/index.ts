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

    const result = await generateUploadUrl(
      String(userId),
      (folder === 'avatars' || folder === 'chat') ? folder : 'posts',
      String(contentType)
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

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Dorabox Backend API running at http://localhost:${PORT}`);
  });
}

export default app;
