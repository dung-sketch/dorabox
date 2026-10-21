import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { supabaseAdmin } from '../services/supabase.service.js';
import { sendFcmHttpV1Message, getFirebaseProjectId } from '../services/firebase.service.js';

const router = Router();

// Khóa bảo mật Admin - được nạp trực tiếp từ biến môi trường (không dùng fallback mặc định để tránh lỗ hổng bảo mật)
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY ? process.env.ADMIN_SECRET_KEY.trim() : '';

// Hàm so sánh chuỗi bảo mật chống tấn công Timing Attack bằng SHA-256 Digest và crypto.timingSafeEqual
function secureCompare(a: string, b: string): boolean {
  if (!a || !b) return false;
  try {
    const hashA = crypto.createHash('sha256').update(String(a)).digest();
    const hashB = crypto.createHash('sha256').update(String(b)).digest();
    return crypto.timingSafeEqual(hashA, hashB);
  } catch (_) {
    return false;
  }
}

// Bộ lưu trữ IP chống Brute-Force đăng nhập Admin (Tối đa 5 lần thử sai, khóa 15 phút)
interface LoginAttemptRecord {
  failures: number;
  lockedUntil: number;
}
const loginAttemptsMap = new Map<string, LoginAttemptRecord>();
const MAX_LOGIN_FAILURES = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 phút

// Tạo session token bảo mật dựa trên Secret Key và ngày hiện tại
function generateAdminToken(): string {
  if (!ADMIN_SECRET) return '';
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
    details: 'Hệ thống bảo vệ Dorabox Security Shield 2026 khởi động thành công (Zero-Trust Key Protection).'
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
  if (!ADMIN_SECRET || ADMIN_SECRET.length < 24) {
    return res.status(500).json({
      success: false,
      error: 'Bảo mật máy chủ: ADMIN_SECRET_KEY chưa được thiết lập an toàn trên Server (Yêu cầu tối thiểu 24 ký tự mã hóa).'
    });
  }

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
  if (secureCompare(token, ADMIN_SECRET) || (validToken && secureCompare(token, validToken))) {
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
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
    const now = Date.now();

    // 1. Kiểm tra khóa Brute-Force đối với IP hiện tại
    const attempt = loginAttemptsMap.get(clientIp);
    if (attempt && attempt.lockedUntil > now) {
      const remainingSeconds = Math.ceil((attempt.lockedUntil - now) / 1000);
      logSecurityEvent(
        'rate_limit',
        `Chặn yêu cầu đăng nhập từ IP bị tạm khóa: ${clientIp} (Còn ${remainingSeconds}s)`,
        'alert',
        'security_shield',
        clientIp
      );
      return res.status(429).json({
        success: false,
        error: `Bảo mật: IP của bạn đã bị tạm khóa do nhập sai khóa quản trị quá 5 lần. Vui lòng thử lại sau ${remainingSeconds} giây.`
      });
    }

    // 2. Chống timing attack nhẹ bằng random jitter trễ
    const jitter = 150 + Math.floor(Math.random() * 150);
    await new Promise(resolve => setTimeout(resolve, jitter));

    // 3. Kiểm tra tính hợp lệ của ADMIN_SECRET cấu hình trên máy chủ
    if (!ADMIN_SECRET || ADMIN_SECRET.length < 24) {
      logSecurityEvent(
        'admin_login',
        'Cảnh báo nghiêm trọng: Máy chủ chưa cấu hình ADMIN_SECRET_KEY đủ an toàn (yêu cầu >= 24 ký tự)',
        'alert',
        'system'
      );
      return res.status(500).json({
        success: false,
        error: 'Cấu hình bảo mật máy chủ: ADMIN_SECRET_KEY chưa được cấu hình hoặc chưa đạt tiêu chuẩn mã hóa.'
      });
    }

    // 4. So sánh mật khẩu an toàn theo thời gian thực (Constant-Time Comparison)
    const isMatched = typeof password === 'string' && secureCompare(password.trim(), ADMIN_SECRET);

    if (!isMatched) {
      const currentFailures = (attempt ? attempt.failures : 0) + 1;
      const isLocking = currentFailures >= MAX_LOGIN_FAILURES;

      loginAttemptsMap.set(clientIp, {
        failures: isLocking ? 0 : currentFailures,
        lockedUntil: isLocking ? now + LOCKOUT_DURATION_MS : 0,
      });

      logSecurityEvent(
        'admin_login',
        `Nhập sai Master Key lần ${currentFailures}/${MAX_LOGIN_FAILURES} từ IP: ${clientIp}${isLocking ? ' -> KHÓA IP 15 PHÚT' : ''}`,
        isLocking ? 'alert' : 'warning',
        'unknown',
        clientIp
      );

      return res.status(401).json({
        success: false,
        error: isLocking
          ? 'Bạn đã nhập sai quá 5 lần. IP này đã bị khóa 15 phút vì lý do an toàn.'
          : `Khóa bảo mật không chính xác! Còn lại ${MAX_LOGIN_FAILURES - currentFailures} lần thử trước khi bị khóa tạm thời.`
      });
    }

    // 5. Đăng nhập thành công -> Xóa bộ nhớ đếm sai cho IP này
    loginAttemptsMap.delete(clientIp);

    const token = generateAdminToken();
    logSecurityEvent(
      'admin_login',
      'Quản trị viên đăng nhập thành công vào phiên điều hành Master Console',
      'info',
      'superadmin',
      clientIp
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
      resolvedReportsRes,
      pendingOaRes
    ] = await Promise.all([
      supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }).eq('is_verified', true),
      supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }).eq('is_banned', true),
      supabaseAdmin.from('posts').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('comments').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('reports').select('id, target_type, target_id, reporter_id, reason').eq('status', 'pending'),
      supabaseAdmin.from('reports').select('id', { count: 'exact', head: true }).neq('status', 'pending'),
      supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }).eq('oa_pending_status', 'pending_approval'),
    ]);

    let pendingViolationsCount = 0;
    let pendingBadgeRequestsCount = 0;

    const pendingReportRows = (pendingReportsRes.data || []) as any[];
    pendingReportRows.forEach(r => {
      const isReq = r.target_type === 'user' && (
        r.reporter_id === r.target_id ||
        (r.reason && (r.reason.includes('yêu cầu') || r.reason.includes('xét duyệt') || r.reason.includes('Tích') || r.reason.includes('tích')))
      );
      if (isReq) {
        pendingBadgeRequestsCount++;
      } else {
        pendingViolationsCount++;
      }
    });

    const pendingOaCount = pendingOaRes.count || 0;
    const totalPendingRequests = pendingBadgeRequestsCount + pendingOaCount;

    return res.json({
      success: true,
      metrics: {
        totalUsers: usersRes.count || 0,
        verifiedUsers: verifiedRes.count || 0,
        bannedUsers: bannedRes.count || 0,
        totalPosts: postsRes.count || 0,
        totalComments: commentsRes.count || 0,
        pendingReports: pendingViolationsCount,
        resolvedReports: resolvedReportsRes.count || 0,
        pendingOaRequests: pendingOaCount,
        pendingBadgeRequests: pendingBadgeRequestsCount,
        pendingRequests: totalPendingRequests,
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
      .select('id, username, display_name, avatar_url, bio, is_verified, is_vip, is_oa, account_type, is_banned, role, created_at, oa_category, oa_status, oa_info_edited_count, oa_pending_status, oa_pending_update')
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

    // Chạy song song tất cả các tác vụ dọn dẹp dữ liệu phụ thuộc để phản hồi nhanh chóng, không gây delay
    const deleteTasks = [
      Promise.resolve(supabaseAdmin.from('post_reactions').delete().eq('user_id', userId)),
      Promise.resolve(supabaseAdmin.from('comments').delete().eq('user_id', userId)),
      Promise.resolve(supabaseAdmin.from('posts').delete().eq('author_id', userId)),
      Promise.resolve(supabaseAdmin.from('messages').delete().eq('sender_id', userId)),
      Promise.resolve(supabaseAdmin.from('conversations').delete().or(`user_a.eq.${userId},user_b.eq.${userId}`)),
      Promise.resolve(supabaseAdmin.from('notifications').delete().or(`recipient_id.eq.${userId},actor_id.eq.${userId}`)),
      Promise.resolve(supabaseAdmin.from('reports').delete().or(`reporter_id.eq.${userId},target_id.eq.${userId}`)),
      Promise.resolve(supabaseAdmin.from('user_blocks').delete().or(`blocker_id.eq.${userId},blocked_id.eq.${userId}`)),
    ];

    await Promise.allSettled(deleteTasks);

    // Xóa hồ sơ trong bảng profiles
    try {
      await supabaseAdmin.from('profiles').delete().eq('id', userId);
    } catch (e: any) {
      console.warn('profiles delete warning:', e.message);
    }

    // Xóa tài khoản Supabase Auth (auth.users)
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
// 5. REPORTS MODERATION (Kiểm duyệt Báo cáo Vi phạm Tiêu chuẩn Cộng đồng)
// -------------------------------------------------------------

router.get('/reports', async (req, res) => {
  try {
    const { data: rawReports, error } = await supabaseAdmin
      .from('reports')
      .select('id, reporter_id, target_type, target_id, reason, status, created_at, profiles:reporter_id(id, display_name, username, avatar_url)')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    // LỌC BỎ các yêu cầu cấp tích hoặc yêu cầu người dùng (không phải vi phạm)
    const violationReports = (rawReports || []).filter(r => {
      const isReq = r.target_type === 'user' && (
        r.reporter_id === r.target_id ||
        (r.reason && (r.reason.includes('yêu cầu') || r.reason.includes('xét duyệt') || r.reason.includes('Tích') || r.reason.includes('tích')))
      );
      return !isReq;
    });

    // Gom target_id theo loại để truy vấn chi tiết nội dung bị tố cáo
    const postIds = violationReports.filter(r => r.target_type === 'post').map(r => r.target_id);
    const commentIds = violationReports.filter(r => r.target_type === 'comment').map(r => r.target_id);
    const userIds = violationReports.filter(r => r.target_type === 'user').map(r => r.target_id);

    const [postsMap, commentsMap, usersMap] = await Promise.all([
      postIds.length ? supabaseAdmin.from('posts').select('id, content, media_urls, author_id, profiles:author_id(display_name, username, avatar_url)').in('id', postIds) : { data: [] },
      commentIds.length ? supabaseAdmin.from('comments').select('id, content, user_id, post_id, profiles:user_id(display_name, username, avatar_url)').in('id', commentIds) : { data: [] },
      userIds.length ? supabaseAdmin.from('profiles').select('id, display_name, username, avatar_url, bio, is_banned').in('id', userIds) : { data: [] },
    ]);

    const postDict = new Map((postsMap.data || []).map((p: any) => [p.id, p]));
    const commentDict = new Map((commentsMap.data || []).map((c: any) => [c.id, c]));
    const userDict = new Map((usersMap.data || []).map((u: any) => [u.id, u]));

    const reports = violationReports.map((r: any) => {
      let target_data: any = null;
      if (r.target_type === 'post') {
        const post: any = postDict.get(r.target_id);
        if (post) {
          target_data = {
            content: post.content || '',
            media_urls: post.media_urls || [],
            author: post.profiles || null,
          };
        }
      } else if (r.target_type === 'comment') {
        const comment: any = commentDict.get(r.target_id);
        if (comment) {
          target_data = {
            content: comment.content || '',
            author: comment.profiles || null,
          };
        }
      } else if (r.target_type === 'user') {
        const usr: any = userDict.get(r.target_id);
        if (usr) {
          target_data = {
            display_name: usr.display_name,
            username: usr.username,
            avatar_url: usr.avatar_url,
            is_banned: usr.is_banned,
          };
        }
      }

      return {
        id: r.id,
        reporter_id: r.reporter_id,
        reporter: r.profiles || null,
        target_type: r.target_type,
        target_id: r.target_id,
        target_data,
        reason: r.reason,
        status: r.status,
        created_at: r.created_at,
      };
    });

    return res.json({ success: true, reports });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Xử lý báo cáo vi phạm
router.post(['/reports/:id/action', '/reports/:id/resolve'], async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'dismiss', 'delete_target', 'delete_content', 'ban_user'

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

      return res.json({ success: true, message: 'Đã bác bỏ báo cáo vi phạm.' });
    }

    if (action === 'delete_target' || action === 'delete_content') {
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

      return res.json({ success: true, message: 'Đã xóa nội dung vi phạm thành công.' });
    }

    if (action === 'ban_user') {
      const targetUserId = report.target_type === 'user' ? report.target_id : null;
      if (targetUserId) {
        await supabaseAdmin.from('profiles').update({ is_banned: true }).eq('id', targetUserId);
        try {
          await supabaseAdmin.auth.admin.updateUserById(targetUserId, { ban_duration: '876000h' });
        } catch (_) {}
      }

      await supabaseAdmin
        .from('reports')
        .update({ status: 'reviewed' })
        .eq('id', id);

      return res.json({ success: true, message: 'Đã khóa tài khoản người dùng vi phạm!' });
    }

    return res.status(400).json({ error: 'Hành động không hợp lệ.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 5.1. USER REQUESTS & VERIFICATIONS (Hàng đợi Xét duyệt Hồ sơ & Đề xuất OA)
// -------------------------------------------------------------

router.get('/requests', async (req, res) => {
  try {
    // 1. Lấy các yêu cầu cấp tích / xét duyệt lại từ bảng reports
    const { data: badgeReports, error: repErr } = await supabaseAdmin
      .from('reports')
      .select('id, reporter_id, target_type, target_id, reason, status, created_at, profiles:reporter_id(id, display_name, username, avatar_url, bio, is_verified, is_oa, account_type, created_at)')
      .order('created_at', { ascending: false });

    if (repErr) throw repErr;

    const badgeRequests = (badgeReports || []).filter(r => {
      return r.target_type === 'user' && (
        r.reporter_id === r.target_id ||
        (r.reason && (r.reason.includes('yêu cầu') || r.reason.includes('xét duyệt') || r.reason.includes('Tích') || r.reason.includes('tích')))
      );
    }).map((r: any) => {
      let request_type = 'verified_badge';
      let title = 'Hồ sơ xin cấp Tích Xanh ✓';
      let badge_type = 'verified';

      if (r.reason && (r.reason.includes('Tích Vàng') || r.reason.includes('OA') || r.reason.includes('oa'))) {
        request_type = 'oa_badge';
        title = 'Hồ sơ xin cấp Tích Vàng OA ⭐';
        badge_type = 'oa';
      } else if (r.reason && r.reason.includes('đổi tên')) {
        request_type = 'reverify_badge';
        title = 'Xét duyệt lại huy hiệu sau khi đổi tên';
        badge_type = 'reverify';
      }

      return {
        id: r.id,
        source: 'report',
        request_type,
        badge_type,
        title,
        applicant: r.profiles || { id: r.reporter_id, display_name: 'Người dùng', username: '' },
        reason: r.reason,
        status: r.status,
        created_at: r.created_at,
        current_info: r.profiles || {},
        proposed_changes: null,
      };
    });

    // 2. Lấy các đề xuất thay đổi thông tin OA từ bảng profiles
    const { data: oaProfiles, error: oaErr } = await supabaseAdmin
      .from('profiles')
      .select('id, username, display_name, avatar_url, bio, oa_category, oa_status, oa_info_edited_count, oa_pending_update, oa_pending_status, updated_at')
      .eq('oa_pending_status', 'pending_approval')
      .order('updated_at', { ascending: false });

    if (oaErr) throw oaErr;

    const oaUpdateRequests = (oaProfiles || []).map((p: any) => {
      return {
        id: p.id,
        source: 'profile_oa',
        request_type: 'oa_info_update',
        badge_type: 'oa_update',
        title: 'Đề xuất cập nhật thông tin Official Account',
        applicant: {
          id: p.id,
          display_name: p.display_name,
          username: p.username,
          avatar_url: p.avatar_url,
          bio: p.bio,
          oa_category: p.oa_category,
        },
        reason: 'Chủ sở hữu Official Account đề xuất thay đổi thông tin nhận diện thương hiệu.',
        status: 'pending',
        created_at: p.updated_at,
        current_info: {
          display_name: p.display_name,
          username: p.username,
          bio: p.bio,
          oa_category: p.oa_category,
        },
        proposed_changes: p.oa_pending_update || {},
      };
    });

    // Gom chung và sắp xếp thời gian mới nhất lên đầu
    const allRequests = [...badgeRequests, ...oaUpdateRequests].sort((a, b) => {
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });

    return res.json({ success: true, requests: allRequests });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Phê duyệt yêu cầu (Tích xanh / Tích vàng OA / Cập nhật OA)
router.post(['/requests/:id/approve', '/oa-requests/:id/approve'], async (req, res) => {
  try {
    const id = String(req.params.id);

    // 1. Kiểm tra đề xuất thay đổi thông tin OA trong profiles
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id, display_name, username, bio, oa_category, oa_status, oa_pending_update, oa_pending_status')
      .eq('id', id)
      .maybeSingle();

    if (profile && profile.oa_pending_status === 'pending_approval') {
      const pending = profile.oa_pending_update as any;
      const newDisplayName = pending?.display_name?.trim() || profile.display_name;
      const newUsername = pending?.username?.trim() || profile.username;
      const newBio = pending?.bio !== undefined ? pending.bio : profile.bio;
      const newCategory = pending?.oa_category?.trim() || profile.oa_category;
      const newStatus = pending?.oa_status?.trim() || profile.oa_status;

      await supabaseAdmin
        .from('profiles')
        .update({
          display_name: newDisplayName,
          username: newUsername,
          bio: newBio,
          oa_category: newCategory,
          oa_status: newStatus,
          oa_pending_status: 'approved',
          oa_pending_update: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      try {
        await supabaseAdmin.auth.admin.updateUserById(id, {
          user_metadata: {
            display_name: newDisplayName,
            username: newUsername,
          }
        });
      } catch (_) {}

      try {
        await supabaseAdmin.from('notifications').insert({
          recipient_id: id,
          actor_id: id,
          type: 'system',
          content: `🎉 Chúc mừng! Đề xuất thay đổi thông tin Official Account "${newDisplayName}" đã được phê duyệt!`,
        });
      } catch (_) {}

      logSecurityEvent(
        'verify_toggle',
        `Phê duyệt thay đổi thông tin Official Account: "${newDisplayName}" (@${newUsername})`,
        'info'
      );

      return res.json({
        success: true,
        message: `Đã phê duyệt cập nhật thông tin Official Account "${newDisplayName}"!`
      });
    }

    // 2. Kiểm tra yêu cầu cấp tích trong reports
    const { data: report } = await supabaseAdmin
      .from('reports')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (report) {
      const targetUserId = report.target_id || report.reporter_id;
      const isOA = report.reason && (report.reason.includes('Tích Vàng') || report.reason.includes('OA') || report.reason.includes('oa'));

      if (isOA) {
        await supabaseAdmin
          .from('profiles')
          .update({ is_oa: true, is_vip: true, account_type: 'oa', updated_at: new Date().toISOString() })
          .eq('id', targetUserId);

        await supabaseAdmin
          .from('reports')
          .update({ status: 'reviewed' })
          .eq('id', id);

        try {
          await supabaseAdmin.from('notifications').insert({
            recipient_id: targetUserId,
            actor_id: targetUserId,
            type: 'system',
            content: '⭐ Chúc mừng! Tài khoản của bạn đã được phê duyệt và trao tặng huy hiệu Tích Vàng Official Account!',
          });
        } catch (_) {}

        logSecurityEvent('verify_toggle', `Cấp Tích Vàng OA cho User ID ${targetUserId}`, 'info');

        return res.json({
          success: true,
          message: 'Đã phê duyệt và cấp Tích Vàng OA ⭐ cho người dùng thành công!'
        });
      } else {
        await supabaseAdmin
          .from('profiles')
          .update({ is_verified: true, updated_at: new Date().toISOString() })
          .eq('id', targetUserId);

        await supabaseAdmin
          .from('reports')
          .update({ status: 'reviewed' })
          .eq('id', id);

        try {
          await supabaseAdmin.from('notifications').insert({
            recipient_id: targetUserId,
            actor_id: targetUserId,
            type: 'system',
            content: '✓ Chúc mừng! Tài khoản của bạn đã được phê duyệt và trao tặng huy hiệu Tích Xanh chính thức!',
          });
        } catch (_) {}

        logSecurityEvent('verify_toggle', `Cấp Tích Xanh cho User ID ${targetUserId}`, 'info');

        return res.json({
          success: true,
          message: 'Đã phê duyệt và cấp Tích Xanh ✓ cho người dùng thành công!'
        });
      }
    }

    return res.status(404).json({ error: 'Không tìm thấy yêu cầu xét duyệt tương ứng.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Từ chối yêu cầu (Tích xanh / Tích vàng OA / Cập nhật OA)
router.post(['/requests/:id/reject', '/oa-requests/:id/reject'], async (req, res) => {
  try {
    const id = String(req.params.id);
    const { reason } = req.body;

    // 1. Kiểm tra OA profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id, oa_pending_status')
      .eq('id', id)
      .maybeSingle();

    if (profile && profile.oa_pending_status === 'pending_approval') {
      await supabaseAdmin
        .from('profiles')
        .update({
          oa_pending_status: 'rejected',
          oa_pending_update: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      try {
        await supabaseAdmin.from('notifications').insert({
          recipient_id: id,
          actor_id: id,
          type: 'system',
          content: `⚠️ Đề xuất thay đổi thông tin OA của bạn chưa được phê duyệt. Lý do: ${reason || 'Thông tin không đạt tiêu chuẩn xét duyệt.'}`,
        });
      } catch (_) {}

      return res.json({ success: true, message: 'Đã từ chối đề xuất cập nhật thông tin OA.' });
    }

    // 2. Kiểm tra report badge request
    const { data: report } = await supabaseAdmin
      .from('reports')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (report) {
      await supabaseAdmin
        .from('reports')
        .update({ status: 'dismissed' })
        .eq('id', id);

      const targetUserId = report.target_id || report.reporter_id;
      try {
        await supabaseAdmin.from('notifications').insert({
          recipient_id: targetUserId,
          actor_id: targetUserId,
          type: 'system',
          content: `⚠️ Yêu cầu xét duyệt cấp huy hiệu của bạn chưa được phê duyệt. Lý do: ${reason || 'Chưa đáp ứng đủ tiêu chuẩn cộng đồng.'}`,
        });
      } catch (_) {}

      return res.json({ success: true, message: 'Đã từ chối yêu cầu xét duyệt cấp huy hiệu.' });
    }

    return res.status(404).json({ error: 'Không tìm thấy yêu cầu xét duyệt.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Backward compatibility cho các route oa-requests cũ
router.get('/oa-requests', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id, username, display_name, avatar_url, bio, oa_category, oa_status, oa_info_edited_count, oa_pending_update, oa_pending_status, updated_at')
      .eq('oa_pending_status', 'pending_approval')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return res.json({ success: true, requests: data || [] });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});



// Cấp lại lượt chỉnh sửa trực tiếp (1 lần) cho tài khoản OA
router.post('/users/:id/reset-oa-edit', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: updated, error } = await supabaseAdmin
      .from('profiles')
      .update({
        oa_info_edited_count: 0,
        oa_pending_status: null,
        oa_pending_update: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    logSecurityEvent(
      'verify_toggle',
      `Cấp lại lượt chỉnh sửa thông tin trực tiếp (1/1) cho tài khoản OA (UID: ${id.substring(0, 8)}...)`,
      'info'
    );

    return res.json({
      success: true,
      user: updated,
      message: 'Đã cấp lại lượt chỉnh sửa trực tiếp cho tài khoản OA thành công!'
    });
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

router.get(['/security-logs', '/system/audit-logs'], async (req, res) => {
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
router.post(['/clean-spam-reactions', '/system/clean-spam'], async (req, res) => {
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

router.get(['/system-health', '/system/health'], async (req, res) => {
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

// Catch-all 404 cho API Admin: Đảm bảo LUÔN trả về JSON, không bao giờ trả về HTML
router.use((req, res) => {
  return res.status(404).json({
    success: false,
    error: `Admin endpoint không tồn tại: ${req.method} ${req.baseUrl}${req.path}`
  });
});

export default router;
