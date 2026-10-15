import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateUploadUrl } from './services/r2.service.js';
import { supabaseAdmin } from './services/supabase.service.js';
import adminRouter from './routes/admin.routes.js';
import { renderAdminPage } from './views/admin_page.js';

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
 * Android client gọi endpoint này lấy link rồi đẩy file WebP trực tiếp lên R2
 */
app.post('/api/upload/presigned-url', async (req, res) => {
  try {
    const { userId, folder, contentType } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const result = await generateUploadUrl(
      userId,
      folder || 'posts',
      contentType || 'image/webp'
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
 * Quản trị viên Dashboard API: Lấy thống kê tổng quan (Metrics)
 */
app.get('/api/admin/metrics', async (req, res) => {
  try {
    const [postsRes, usersRes] = await Promise.all([
      supabaseAdmin.from('posts').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),
    ]);

    return res.json({
      totalPosts: postsRes.count || 0,
      totalUsers: usersRes.count || 0,
    });
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
