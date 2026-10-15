import { Router } from 'express';
import { supabaseAdmin } from '../services/supabase.service.js';

const router = Router();

// 1. Lấy danh sách thành viên kèm trạng thái Verified
router.get('/users', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id, username, display_name, avatar_url, is_verified, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, users: data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Cấp / Hủy Tích Xanh (Toggle Verified Badge)
router.post('/users/:id/toggle-verify', async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ is_verified: isVerified })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, user: data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Lấy danh sách báo cáo vi phạm
router.get('/reports', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('reports')
      .select('*, profiles:reporter_id(display_name)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, reports: data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Xóa bài viết vi phạm (kèm cập nhật trạng thái report)
router.delete('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Đánh dấu report đã xử lý
    await supabaseAdmin
      .from('reports')
      .update({ status: 'reviewed' })
      .eq('target_id', id);

    res.json({ success: true, message: 'Đã xóa bài viết vi phạm' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
