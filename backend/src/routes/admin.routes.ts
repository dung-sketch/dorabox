import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { supabaseAdmin } from '../services/supabase.service.js';
import { sendFcmHttpV1Message, getFirebaseProjectId } from '../services/firebase.service.js';

const router = Router();

// Khóa bảo mật Admin - được lấy từ biến môi trường hoặc fallback bảo mật
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'dorabox_admin_secret_2026';

// Tạo session token bảo mật dựa trên Secret Key và ngày hiện tại
function generateAdminToken(): string {
  return crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update('dorabox_admin_session_' + new Date().toDateString())
    .digest('hex');
}

// Cấu trúc Nhật ký Bảo mật & Audit Log hệ thống
export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  eventType: 'admin_login' | 'role_change' | 'user_ban' | 'user_unban' | 'verify_toggle' | 'spam_clean' | 'broadcast' | 'rate_limit' | 'account_wiped';
  severity: 'info' | 'warning' | 'alert';
  actor: string;
  details: string;
  ip?: string;
}

const auditLogsBuffer: SecurityAuditLog[] = [
  {
    id: 'log-boot-01',
    timestamp: new Date().toISOString(),
    eventType: 'admin_login',
    severity: 'info',
    actor: 'system',
    details: 'Hệ thống bảo vệ Dorabox Security Shield 2026 khởi động thành công.'
  }
];

export function logSecurityEvent(
  eventType: SecurityAuditLog['eventType'],
  details: string,
  severity: SecurityAuditLog['severity'] = 'info',
  actor = 'superadmin',
  ip?: string
) {
  const logItem: SecurityAuditLog = {
    id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
    eventType,
    severity,
    actor,
    details,
    ip
  };
  auditLogsBuffer.unshift(logItem);
  if (auditLogsBuffer.length > 200) {
    auditLogsBuffer.pop();
  }
}

/**
 * Middleware kiểm tra bảo mật nghiêm ngặt cho tất cả các API Quản trị
 */
export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const adminKeyHeader = req.headers['x-admin-key'];

  const token = authHeader?.replace(/^Bearer\s+/i, '') || (typeof adminKeyHeader === 'string' ? adminKeyHeader : '');

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Bảo mật: Yêu cầu đăng nhập Quản trị viên (Thiếu Admin Token/Key).'
    });
  }

  const validToken = generateAdminToken();
  if (token === ADMIN_SECRET || token === validToken) {
    return next();
  }

  return res.status(403).json({
    success: false,
    error: 'Bảo mật: Khóa bảo mật không chính xác hoặc phiên quản trị đã hết hạn.'
  });
}

// -------------------------------------------------------------
// 0. AUTHENTICATION & LOGIN (Không cần token để login)
// -------------------------------------------------------------

router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;

    // Chống brute-force timing attack nhẹ
    await new Promise(resolve => setTimeout(resolve, 250));

    if (!password || password !== ADMIN_SECRET) {
      logSecurityEvent(
        'admin_login',
        `Cố gắng xác thực Master Key không chính xác từ IP: ${req.ip || 'ẩn danh'}`,
        'warning',
        'unknown',
        req.ip
      );
      return res.status(401).json({
        success: false,
        error: 'Khóa bảo mật Quản trị viên không chính xác! Vui lòng thử lại.'
      });
    }

    const token = generateAdminToken();
    logSecurityEvent(
      'admin_login',
      'Quản trị viên đăng nhập thành công vào phiên điều hành Master Console',
      'info',
      'superadmin',
      req.ip
    );

    return res.json({
      success: true,
      message: 'Xác thực Quản trị viên thành công.',
      token,
      expiresIn: '24h'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Kiểm tra token còn hiệu lực không
router.get('/auth/check', requireAdminAuth, (req, res) => {
  res.json({ success: true, authenticated: true, role: 'superadmin' });
});

// TẤT CẢ CÁC ROUTE PHÍA DƯỚI ĐỀU PHẢI QUA BẢO MẬT REQUIRE ADMIN AUTH
router.use(requireAdminAuth);

// -------------------------------------------------------------
// 1. DASHBOARD METRICS (Thống kê thời gian thực)
// -------------------------------------------------------------

router.get('/metrics', async (req, res) => {
  try {
    const [
      usersRes,
      verifiedRes,
      bannedRes,
      postsRes,
      commentsRes,
      pendingReportsRes,
      resolvedReportsRes
    ] = await Promise.all([
      supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }).eq('is_verified', true),
      supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }).eq('is_banned', true),
      supabaseAdmin.from('posts').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('comments').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseAdmin.from('reports').select('id', { count: 'exact', head: true }).neq('status', 'pending'),
    ]);

    return res.json({
      success: true,
      metrics: {
        totalUsers: usersRes.count || 0,
        verifiedUsers: verifiedRes.count || 0,
        bannedUsers: bannedRes.count || 0,
        totalPosts: postsRes.count || 0,
        totalComments: commentsRes.count || 0,
        pendingReports: pendingReportsRes.count || 0,
        resolvedReports: resolvedReportsRes.count || 0,
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 2. USER MANAGEMENT (Quản lý Thành viên)
// -------------------------------------------------------------

router.get('/users', async (req, res) => {
  try {
    const { q, filter } = req.query;
    let query = supabaseAdmin
      .from('profiles')
      .select('id, username, display_name, avatar_url, bio, is_verified, is_vip, is_oa, account_type, is_banned, role, created_at')
      .order('created_at', { ascending: false });

    if (q && typeof q === 'string' && q.trim()) {
      const term = q.trim();
      query = query.or(`username.ilike.%${term}%,display_name.ilike.%${term}%`);
    }

    if (filter === 'verified') {
      query = query.eq('is_verified', true);
    } else if (filter === 'oa' || filter === 'vip') {
      query = query.or('is_oa.eq.true,is_vip.eq.true,account_type.eq.oa');
    } else if (filter === 'banned') {
      query = query.eq('is_banned', true);
    } else if (filter === 'admin') {
      query = query.or('role.eq.admin,role.eq.moderator');
    }

    const { data, error } = await query.limit(100);
    if (error) throw error;

    return res.json({ success: true, users: data || [] });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Cấp / Gỡ Tích Xanh
router.post('/users/:id/toggle-verify', async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ is_verified: Boolean(isVerified) })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    logSecurityEvent(
      'verify_toggle',
      `${isVerified ? 'Cấp' : 'Gỡ'} Tích Xanh ✓ cho tài khoản (UID: ${id.substring(0, 8)}...)`,
      'info'
    );

    return res.json({ success: true, user: data, message: isVerified ? 'Đã cấp tích xanh ✓' : 'Đã gỡ tích xanh' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Khóa / Mở Khóa Tài Khoản (Ban / Unban)
router.post('/users/:id/toggle-ban', async (req, res) => {
  try {
    const { id } = req.params;
    const { isBanned } = req.body;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ is_banned: Boolean(isBanned) })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Đồng bộ trạng thái khóa trực tiếp vào Supabase Auth
    try {
      await supabaseAdmin.auth.admin.updateUserById(id, {
        ban_duration: isBanned ? '876000h' : 'none'
      });
    } catch (authBanErr) {
      console.warn('👉 Notice on updateUserById ban_duration:', authBanErr);
    }

    logSecurityEvent(
      isBanned ? 'user_ban' : 'user_unban',
      `${isBanned ? 'KHÓA VĨNH VIỄN' : 'Mở khóa hoạt động'} cho tài khoản (UID: ${id.substring(0, 8)}...)`,
      isBanned ? 'alert' : 'info'
    );

    return res.json({
      success: true,
      user: data,
      message: isBanned ? 'Đã khóa tài khoản thành công.' : 'Đã mở khóa tài khoản.'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Cấp / Gỡ Huy hiệu VIP
router.post('/users/:id/toggle-vip', async (req, res) => {
  try {
    const { id } = req.params;
    const { isVip } = req.body;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ 
        is_vip: Boolean(isVip),
        is_oa: Boolean(isVip),
        account_type: Boolean(isVip) ? 'oa' : 'personal',
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    logSecurityEvent(
      'verify_toggle',
      `${isVip ? 'Cấp' : 'Gỡ'} Tích Vàng OA ⭐ cho tài khoản (UID: ${id.substring(0, 8)}...)`,
      'info'
    );

    return res.json({ success: true, user: data, message: isVip ? 'Đã kích hoạt Tích Vàng OA ⭐' : 'Đã hủy Tích Vàng OA' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Cập nhật vai trò (role: 'user' | 'moderator' | 'admin')
router.post('/users/:id/change-role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'moderator', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Vai trò không hợp lệ (phải là user, moderator hoặc admin)' });
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ role })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    logSecurityEvent(
      'role_change',
      `Phân quyền tài khoản (UID: ${id.substring(0, 8)}...) thành vai trò: [${role.toUpperCase()}]`,
      'alert'
    );

    return res.json({ success: true, user: data, message: `Đã phân quyền tài khoản thành: ${role}` });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Hàm dọn dẹp và xóa sạch 100% toàn bộ dữ liệu tài khoản
export async function wipeUserAccountCompletely(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`🧹 [Account Wipe] Bắt đầu xóa sạch toàn bộ dữ liệu người dùng: ${userId}`);

    // Lấy FCM token trước khi xóa để gửi thông báo đăng xuất khẩn cấp tới thiết bị
    try {
      const { data: prof } = await supabaseAdmin.from('profiles').select('fcm_token').eq('id', userId).maybeSingle();
      if (prof?.fcm_token) {
        await sendFcmHttpV1Message({
          token: prof.fcm_token,
          title: 'Tài khoản đã bị xóa',
          body: 'Tài khoản của bạn đã bị xóa khỏi hệ thống.',
          data: {
            type: 'FORCE_LOGOUT',
            reason: 'account_deleted',
          },
        }).catch(() => {});
      }
    } catch (_) {}

    // 1. Xóa tất cả reactions của user và reactions trên bài viết của user
    try {
      await supabaseAdmin.from('post_reactions').delete().eq('user_id', userId);
    } catch (e: any) {
      console.warn('post_reactions clean error:', e.message);
    }

    const { data: userPosts } = await supabaseAdmin.from('posts').select('id').eq('author_id', userId);
    if (userPosts && userPosts.length > 0) {
      const postIds = userPosts.map(p => p.id);
      try {
        await supabaseAdmin.from('post_reactions').delete().in('post_id', postIds);
        await supabaseAdmin.from('comments').delete().in('post_id', postIds);
      } catch (_) {}
    }

    // 2. Xóa các bình luận do user viết
    try {
      await supabaseAdmin.from('comments').delete().eq('user_id', userId);
    } catch (_) {}

    // 3. Xóa các bài viết do user đăng
    try {
      await supabaseAdmin.from('posts').delete().eq('author_id', userId);
    } catch (_) {}

    // 4. Xóa tin nhắn do user gửi
    try {
      await supabaseAdmin.from('messages').delete().eq('sender_id', userId);
    } catch (_) {}

    // 5. Xóa các cuộc trò chuyện của user
    try {
      await supabaseAdmin.from('conversations').delete().or(`user_a.eq.${userId},user_b.eq.${userId}`);
    } catch (_) {}

    // 6. Xóa thông báo liên quan
    try {
      await supabaseAdmin.from('notifications').delete().or(`recipient_id.eq.${userId},actor_id.eq.${userId}`);
    } catch (_) {}

    // 7. Xóa báo cáo và chặn liên quan
    try {
      await supabaseAdmin.from('reports').delete().or(`reporter_id.eq.${userId},target_id.eq.${userId}`);
      await supabaseAdmin.from('user_blocks').delete().or(`blocker_id.eq.${userId},blocked_id.eq.${userId}`);
    } catch (_) {}

    // 8. Xóa hồ sơ trong bảng profiles
    try {
      await supabaseAdmin.from('profiles').delete().eq('id', userId);
    } catch (e: any) {
      console.warn('profiles delete warning:', e.message);
    }

    // 9. Xóa tài khoản Supabase Auth (auth.users)
    try {
      await supabaseAdmin.auth.admin.deleteUser(userId);
    } catch (authErr: any) {
      console.warn('Supabase auth deleteUser warning:', authErr.message);
    }

    logSecurityEvent(
      'account_wiped',
      `XÓA SẠCH TOÀN BỘ dữ liệu tài khoản (UID: ${userId.substring(0, 8)}...)`,
      'alert'
    );

    console.log(`✅ [Account Wipe Success] Đã xóa sạch toàn bộ dữ liệu tài khoản: ${userId}`);
    return { success: true };
  } catch (err: any) {
    console.error('❌ Error in wipeUserAccountCompletely:', err);
    return { success: false, error: err.message };
  }
}

// Xóa tài khoản thành viên (Admin)
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await wipeUserAccountCompletely(id);
    if (!result.success) {
      return res.status(500).json({ error: result.error || 'Lỗi khi xóa tài khoản' });
    }

    return res.json({ success: true, message: 'Đã xóa vĩnh viễn và quét sạch toàn bộ dữ liệu tài khoản người dùng.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 3. POSTS MANAGEMENT (Quản lý Bài viết)
// -------------------------------------------------------------

router.get('/posts', async (req, res) => {
  try {
    const { q } = req.query;
    let query = supabaseAdmin
      .from('posts')
      .select('id, author_id, content, media_urls, link_url, likes_count, comments_count, is_pinned, created_at, profiles:author_id(id, username, display_name, avatar_url, is_verified)')
      .order('created_at', { ascending: false });

    if (q && typeof q === 'string' && q.trim()) {
      query = query.ilike('content', `%${q.trim()}%`);
    }

    const { data, error } = await query.limit(80);
    if (error) throw error;

    return res.json({ success: true, posts: data || [] });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Ghim / Bỏ ghim bài viết
router.post('/posts/:id/toggle-pin', async (req, res) => {
  try {
    const { id } = req.params;
    const { isPinned } = req.body;

    const { data, error } = await supabaseAdmin
      .from('posts')
      .update({ is_pinned: Boolean(isPinned) })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return res.json({ success: true, post: data, message: isPinned ? 'Đã ghim bài viết lên đầu' : 'Đã bỏ ghim bài viết' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Xóa bài viết vi phạm
router.delete('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Đánh dấu các báo cáo liên quan thành reviewed
    await supabaseAdmin
      .from('reports')
      .update({ status: 'reviewed' })
      .eq('target_id', id);

    return res.json({ success: true, message: 'Đã xóa bài viết vi phạm thành công.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 4. COMMENTS MANAGEMENT (Quản lý Bình luận)
// -------------------------------------------------------------

router.get('/comments', async (req, res) => {
  try {
    const { q } = req.query;
    let query = supabaseAdmin
      .from('comments')
      .select('id, post_id, user_id, content, created_at, profiles:user_id(id, username, display_name, avatar_url), posts:post_id(content)')
      .order('created_at', { ascending: false });

    if (q && typeof q === 'string' && q.trim()) {
      query = query.ilike('content', `%${q.trim()}%`);
    }

    const { data, error } = await query.limit(100);
    if (error) throw error;

    return res.json({ success: true, comments: data || [] });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Xóa bình luận vi phạm
router.delete('/comments/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Giảm comments_count của post tương ứng nếu cần
    const { data: comment } = await supabaseAdmin
      .from('comments')
      .select('post_id')
      .eq('id', id)
      .maybeSingle();

    const { error } = await supabaseAdmin
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) throw error;

    if (comment?.post_id) {
      // Đánh dấu báo cáo liên quan
      await supabaseAdmin
        .from('reports')
        .update({ status: 'reviewed' })
        .eq('target_id', id);
    }

    return res.json({ success: true, message: 'Đã xóa bình luận thành công.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 5. REPORTS MODERATION (Kiểm duyệt Báo cáo Vi phạm)
// -------------------------------------------------------------

router.get('/reports', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('reports')
      .select('id, reporter_id, target_type, target_id, reason, status, created_at, profiles:reporter_id(display_name, username, avatar_url)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json({ success: true, reports: data || [] });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Xử lý báo cáo vi phạm
router.post('/reports/:id/action', async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'dismiss' hoặc 'delete_target'

    const { data: report, error: repErr } = await supabaseAdmin
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (repErr || !report) {
      return res.status(404).json({ error: 'Không tìm thấy báo cáo vi phạm.' });
    }

    if (action === 'dismiss') {
      await supabaseAdmin
        .from('reports')
        .update({ status: 'dismissed' })
        .eq('id', id);

      return res.json({ success: true, message: 'Đã bác bỏ báo cáo.' });
    }

    if (action === 'delete_target') {
      if (report.target_type === 'post') {
        await supabaseAdmin.from('posts').delete().eq('id', report.target_id);
      } else if (report.target_type === 'comment') {
        await supabaseAdmin.from('comments').delete().eq('id', report.target_id);
      } else if (report.target_type === 'user') {
        await supabaseAdmin.from('profiles').update({ is_banned: true }).eq('id', report.target_id);
        try {
          await supabaseAdmin.auth.admin.updateUserById(report.target_id, { ban_duration: '876000h' });
        } catch (_) {}
      }

      await supabaseAdmin
        .from('reports')
        .update({ status: 'reviewed' })
        .eq('id', id);

      return res.json({ success: true, message: 'Đã xử lý và dọn dẹp nội dung vi phạm thành công.' });
    }

    if (action === 'approve_oa') {
      await supabaseAdmin
        .from('profiles')
        .update({ is_oa: true, is_vip: true, account_type: 'oa' })
        .eq('id', report.target_id);

      await supabaseAdmin
        .from('reports')
        .update({ status: 'reviewed' })
        .eq('id', id);

      return res.json({ success: true, message: 'Đã duyệt và cấp Tích Vàng OA ⭐ cho tài khoản!' });
    }

    if (action === 'approve_verified') {
      await supabaseAdmin
        .from('profiles')
        .update({ is_verified: true })
        .eq('id', report.target_id);

      await supabaseAdmin
        .from('reports')
        .update({ status: 'reviewed' })
        .eq('id', id);

      return res.json({ success: true, message: 'Đã duyệt và cấp Tích Xanh ✓ cho tài khoản!' });
    }

    return res.status(400).json({ error: 'Hành động không hợp lệ.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 6. SYSTEM BROADCAST (Phát thông báo toàn hệ thống)
// -------------------------------------------------------------

router.post('/broadcast', async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) {
      return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ Tiêu đề và Nội dung thông báo.' });
    }

    // Lấy danh sách tối đa 500 thành viên
    const { data: users, error: userErr } = await supabaseAdmin
      .from('profiles')
      .select('id, fcm_token')
      .limit(500);

    if (userErr) throw userErr;

    if (!users || users.length === 0) {
      return res.json({ success: true, count: 0, message: 'Chưa có thành viên nào trong hệ thống.' });
    }

    // 1. Tạo thông báo trong bảng notifications (In-app notifications)
    const systemActorId = users[0]?.id;
    const notifs = users.map(u => ({
      recipient_id: u.id,
      actor_id: systemActorId,
      action_type: 'admin_broadcast',
      target_id: null,
      content: `${title}: ${body}`,
      is_read: false,
    }));

    await supabaseAdmin.from('notifications').insert(notifs);

    // 2. Gửi Push Notification thời gian thực tới tất cả thiết bị có fcm_token
    const tokens = users.map(u => u.fcm_token).filter(t => Boolean(t) && typeof t === 'string' && t.trim().length > 10);
    let fcmSentCount = 0;

    for (const token of tokens) {
      try {
        await sendFcmHttpV1Message({
          token,
          title: title,
          body,
          data: {
            type: 'admin_broadcast',
            click_action: 'FLUTTER_NOTIFICATION_CLICK'
          }
        });
        fcmSentCount++;
      } catch (fcmErr) {
        console.warn(`[Admin Broadcast] Không gửi được FCM tới token:`, fcmErr);
      }
    }

    logSecurityEvent(
      'broadcast',
      `Phát thông báo toàn hệ thống: "${title}" tới ${users.length} tài khoản (${fcmSentCount} thiết bị nhận Push FCM)`,
      'info'
    );

    return res.json({
      success: true,
      count: users.length,
      fcmSent: fcmSentCount,
      message: `Đã phát thông báo thành công tới ${users.length} tài khoản (${fcmSentCount} thiết bị nhận Push FCM tức thì)!`
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 7. SECURITY AUDIT LOGS & ANTI-SPAM CLEANUP
// -------------------------------------------------------------

router.get('/security-logs', async (req, res) => {
  try {
    return res.json({
      success: true,
      logs: auditLogsBuffer,
      stats: {
        totalLogs: auditLogsBuffer.length,
        alerts: auditLogsBuffer.filter(l => l.severity === 'alert').length,
        warnings: auditLogsBuffer.filter(l => l.severity === 'warning').length,
        info: auditLogsBuffer.filter(l => l.severity === 'info').length,
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Quét & dọn sạch phản ứng spam trùng lặp, đồng bộ lượt thích chuẩn xác
router.post('/clean-spam-reactions', async (req, res) => {
  try {
    // 1. Quét bảng post_reactions
    const { data: reactions, error: rErr } = await supabaseAdmin
      .from('post_reactions')
      .select('id, post_id, user_id, reaction_type, created_at')
      .order('created_at', { ascending: false });

    if (rErr) throw rErr;

    // 2. Tìm duplicate reactions theo cặp (user_id, post_id)
    const seen = new Set<string>();
    const duplicateIds: string[] = [];
    const affectedPostIds = new Set<string>();

    for (const r of (reactions || [])) {
      const key = `${r.user_id}_${r.post_id}`;
      if (seen.has(key)) {
        duplicateIds.push(r.id);
        affectedPostIds.add(r.post_id);
      } else {
        seen.add(key);
        affectedPostIds.add(r.post_id);
      }
    }

    let deletedCount = 0;
    if (duplicateIds.length > 0) {
      const { error: delErr } = await supabaseAdmin
        .from('post_reactions')
        .delete()
        .in('id', duplicateIds);

      if (!delErr) {
        deletedCount = duplicateIds.length;
      }
    }

    // 3. Cập nhật lại số lượng likes_count chuẩn xác cho các bài viết bị ảnh hưởng
    let updatedPostsCount = 0;
    for (const postId of Array.from(affectedPostIds).slice(0, 60)) {
      try {
        const { count } = await supabaseAdmin
          .from('post_reactions')
          .select('id', { count: 'exact', head: true })
          .eq('post_id', postId);

        await supabaseAdmin
          .from('posts')
          .update({ likes_count: count || 0 })
          .eq('id', postId);
        updatedPostsCount++;
      } catch (_) {}
    }

    logSecurityEvent(
      'spam_clean',
      `Bảo trì hoàn tất: Quét ${reactions?.length || 0} lượt phản ứng, dọn sạch ${deletedCount} phản ứng rác trùng lặp, đồng bộ ${updatedPostsCount} bài viết.`,
      deletedCount > 0 ? 'warning' : 'info'
    );

    return res.json({
      success: true,
      scannedReactions: reactions?.length || 0,
      duplicatesCleaned: deletedCount,
      postsSynchronized: updatedPostsCount,
      message: `Đã hoàn tất bảo trì: Dọn sạch ${deletedCount} phản ứng spam và đồng bộ chính xác ${updatedPostsCount} bài viết.`
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 7. SYSTEM HEALTH & CLOUD SERVICES METRICS
// -------------------------------------------------------------

router.get('/system-health', async (req, res) => {
  try {
    const startTime = Date.now();
    const { error: dbErr } = await supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }).limit(1);
    const dbLatency = Date.now() - startTime;

    const memoryUsage = process.memoryUsage();

    return res.json({
      success: true,
      health: {
        status: dbErr ? 'degraded' : 'healthy',
        uptimeSeconds: Math.floor(process.uptime()),
        nodeVersion: process.version,
        database: {
          status: dbErr ? 'error' : 'connected',
          latencyMs: dbLatency,
          url: process.env.SUPABASE_URL || 'Configured',
        },
        cloudflareR2: {
          status: Boolean(process.env.R2_ACCOUNT_ID) ? 'ready' : 'not_configured',
          bucket: process.env.R2_BUCKET_NAME || 'Not set',
          cdnDomain: process.env.R2_PUBLIC_URL || 'Not set',
        },
        firebaseFcm: {
          status: 'ready_http_v1',
          projectId: getFirebaseProjectId(),
        },
        memory: {
          rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
          heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        }
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
