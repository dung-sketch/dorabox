/**
 * Dorabox Social - Smart Post Preview Page
 * Hỗ trợ OpenGraph SSR cho Zalo, Facebook, Messenger, Telegram, Twitter.
 * Tích hợp kiểm tra bảo mật quyền riêng tư (Public vs Friends/Custom)
 * và kế thừa cơ chế chống tải lậu ảnh/video độc quyền của Dorabox.
 */

export interface PostPreviewData {
  id: string;
  content: string;
  media_urls?: string[];
  link_url?: string;
  link_title?: string;
  likes_count?: number;
  comments_count?: number;
  visibility?: string;
  allow_download_images?: boolean;
  allow_download_videos?: boolean;
  created_at?: string;
  author?: {
    id?: string;
    username?: string;
    display_name?: string;
    avatar_url?: string;
    bio?: string;
    is_verified?: boolean;
    is_vip?: boolean;
    is_oa?: boolean;
    account_type?: string;
  };
}

function escapeHtml(str: string = ''): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isVideoUrl(url: string): boolean {
  return /\.(mp4|m4v|mov|webm|mkv|avi|m3u8)(\?.*)?$/i.test(url);
}

function isAudioUrl(url: string): boolean {
  return /\.(mp3|m4a|aac|wav|ogg|flac)(\?.*)?$/i.test(url);
}

function extractAudioTitle(url: string): string {
  try {
    const parsed = new URL(url);
    const queryTitle = parsed.searchParams.get('title');
    if (queryTitle && queryTitle.trim().length > 0) {
      const decoded = decodeURIComponent(queryTitle).trim();
      if (decoded.toLowerCase() !== 'bản nhạc' && decoded.toLowerCase() !== 'mặc định') {
        return decoded;
      }
    }
    const pathname = parsed.pathname;
    const rawName = pathname.split('/').pop() || '';
    const decoded = decodeURIComponent(rawName)
      .replace(/\.[a-zA-Z0-9]+$/, '')
      .replace(/[_-]/g, ' ')
      .trim();
    if (!decoded || /^[0-9]+$/.test(decoded) || decoded.toLowerCase().startsWith('dorabox post audio')) {
      return '';
    }
    return decoded;
  } catch {
    return '';
  }
}

function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return 'Gần đây';
  try {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
    return new Date(dateStr).toLocaleDateString('vi-VN');
  } catch {
    return 'Gần đây';
  }
}

export function renderPostPreviewPage(
  post: PostPreviewData | null,
  options: {
    host?: string;
    apkUrl?: string;
    version?: string;
    notFound?: boolean;
    isRestricted?: boolean;
  } = {}
): string {
  const host = options.host || 'www.zpiltk.io.vn';
  const apkUrl = options.apkUrl || 'https://doraboxcdn.zpiltk.io.vn/apk/Dorabox-v3.0.0.apk';
  const version = options.version || '3.0.0';

  // Trường hợp không tìm thấy bài viết
  if (!post || options.notFound) {
    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Không tìm thấy bài viết - Dorabox</title>
  <link rel="icon" href="https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; font-family:'Quicksand', -apple-system, sans-serif; }
    body { background:#070B14; color:#fff; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:20px; }
    .card { background:rgba(30,41,59,0.7); border:1px solid rgba(255,255,255,0.1); border-radius:24px; padding:36px 24px; max-width:420px; width:100%; text-align:center; backdrop-filter:blur(20px); }
    h1 { font-size:20px; font-weight:700; margin-bottom:10px; color:#F8FAFC; }
    p { font-size:14px; color:#94A3B8; line-height:1.6; margin-bottom:24px; }
    .btn { display:inline-block; background:linear-gradient(135deg, #0284C7, #0369A1); color:#fff; padding:12px 24px; border-radius:14px; text-decoration:none; font-weight:600; font-size:14px; }
  </style>
</head>
<body>
  <div class="card">
    <div style="font-size:48px; margin-bottom:16px;">🔍</div>
    <h1>Bài viết không khả dụng</h1>
    <p>Bài viết này có thể đã bị xóa, bị ẩn bởi người đăng hoặc liên kết không chính xác.</p>
    <a href="/" class="btn">Về Trang Chủ Dorabox</a>
  </div>
</body>
</html>`;
  }

  const author = post.author || {};
  const authorName = escapeHtml(author.display_name || 'Người dùng Dorabox');
  const authorUsername = escapeHtml(author.username || 'user');
  const authorAvatar = author.avatar_url || 'https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png';
  const isOA = author.is_oa === true || author.account_type === 'oa';
  const isVerified = author.is_verified === true || isOA || author.is_vip === true;
  const rawContent = (post.content || '').trim();
  const contentExcerpt = escapeHtml(rawContent.length > 180 ? rawContent.substring(0, 180) + '...' : rawContent);
  const timeFormatted = formatRelativeTime(post.created_at);

  const mediaList = Array.isArray(post.media_urls) ? post.media_urls : [];
  const audioUrls = mediaList.filter(isAudioUrl);
  const visualUrls = mediaList.filter((u) => !isAudioUrl(u));
  const videoUrls = visualUrls.filter(isVideoUrl);
  const imageUrls = visualUrls.filter((u) => !isVideoUrl(u));

  const allowDownloadImages = post.allow_download_images !== false;
  const allowDownloadVideos = post.allow_download_videos !== false;
  const isRestricted = options.isRestricted || (post.visibility && post.visibility !== 'public' && !isOA);

  // Chọn ảnh thumbnail tốt nhất cho OpenGraph
  let ogImage = 'https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png';
  if (!isRestricted && imageUrls.length > 0) {
    ogImage = imageUrls[0];
  } else if (authorAvatar) {
    ogImage = authorAvatar;
  }

  const pageTitle = isRestricted
    ? `Bài viết riêng tư của ${authorName} - Dorabox`
    : `${authorName}: "${contentExcerpt.replace(/\n/g, ' ')}" - Dorabox`;

  const ogDesc = isRestricted
    ? `Bài viết này được chia sẻ ở chế độ bảo mật riêng tư trên mạng xã hội Dorabox.`
    : contentExcerpt.replace(/\n/g, ' ') || `Khám phá bài viết của ${authorName} trên mạng xã hội Dorabox.`;

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${escapeHtml(pageTitle)}</title>
  
  <!-- OpenGraph Meta Tags cho Zalo, Facebook, Messenger, Telegram -->
  <meta property="og:site_name" content="Dorabox Social ✨">
  <meta property="og:title" content="${escapeHtml(pageTitle)}">
  <meta property="og:description" content="${escapeHtml(ogDesc)}">
  <meta property="og:image" content="${escapeHtml(ogImage)}">
  <meta property="og:url" content="https://${host}/p/${post.id}">
  <meta property="og:type" content="${videoUrls.length > 0 && !isRestricted ? 'video.other' : 'article'}">
  <meta property="al:android:url" content="dorabox://post/${post.id}">
  <meta property="al:android:package" content="com.tinelfi.dorabox">
  <meta property="al:android:app_name" content="Dorabox">

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}">
  <meta name="twitter:description" content="${escapeHtml(ogDesc)}">
  <meta name="twitter:image" content="${escapeHtml(ogImage)}">

  <link rel="icon" href="https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700;800&display=swap" rel="stylesheet">

  <style>
    * { margin:0; padding:0; box-sizing:border-box; font-family:'Quicksand', -apple-system, sans-serif; }
    body { background:#070B14; color:#F8FAFC; min-height:100vh; display:flex; flex-direction:column; align-items:center; }
    
    /* Top Bar */
    .top-nav {
      width:100%; max-width:680px; padding:16px 20px; display:flex; align-items:center; justify-content:space-between;
      border-bottom:1px solid rgba(255,255,255,0.06); background:rgba(7,11,20,0.85); backdrop-filter:blur(20px); position:sticky; top:0; z-index:50;
    }
    .brand { display:flex; align-items:center; gap:10px; text-decoration:none; color:#fff; }
    .brand-logo { width:36px; height:36px; border-radius:12px; background:#0284C7; display:flex; align-items:center; justify-content:center; font-size:20px; box-shadow:0 0 15px rgba(2,132,199,0.4); }
    .brand-name { font-weight:800; font-size:18px; letter-spacing:-0.3px; }
    .brand-name span { color:#38BDF8; }
    .btn-install-nav {
      background:linear-gradient(135deg, #0284C7, #0369A1); color:#fff; font-size:12.5px; font-weight:700;
      padding:8px 16px; border-radius:20px; text-decoration:none; box-shadow:0 4px 14px rgba(2,132,199,0.3); transition:0.2s;
    }
    .btn-install-nav:hover { transform:translateY(-1px); }

    /* Feed Container */
    .container { width:100%; max-width:640px; padding:20px 16px 120px 16px; }

    /* Post Card */
    .post-card {
      background:rgba(20, 27, 45, 0.75); border:1px solid rgba(255,255,255,0.08); border-radius:24px;
      overflow:hidden; box-shadow:0 20px 40px rgba(0,0,0,0.5); backdrop-filter:blur(24px);
    }
    .post-header { display:flex; align-items:center; padding:18px 20px; gap:14px; }
    .avatar-wrapper { position:relative; width:48px; height:48px; border-radius:50%; flex-shrink:0; }
    .author-avatar { width:48px; height:48px; border-radius:50%; object-fit:cover; border:2px solid rgba(2,132,199,0.5); background:#1E293B; }
    .author-info { flex:1; min-width:0; }
    .author-name-row { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
    .author-display-name { font-weight:800; font-size:16px; color:#F8FAFC; text-decoration:none; }
    .badge-oa {
      display:inline-flex; align-items:center; gap:3px; background:rgba(245,158,11,0.18);
      color:#FBBF24; border:1px solid rgba(245,158,11,0.4); padding:1px 8px; border-radius:12px; font-size:11px; font-weight:700;
    }
    .badge-verified { color:#38BDF8; font-size:15px; }
    .author-sub { font-size:12.5px; color:#94A3B8; margin-top:2px; }

    /* Post Content */
    .post-body { padding:0 20px 16px 20px; font-size:15px; line-height:1.65; color:#E2E8F0; white-space:pre-wrap; word-break:break-word; }
    
    /* Music Pill */
    .music-pill {
      display:inline-flex; align-items:center; gap:8px; margin:0 20px 16px 20px;
      background:rgba(2,132,199,0.12); border:1px solid rgba(56,189,248,0.25);
      padding:6px 14px; border-radius:20px; font-size:12.5px; color:#38BDF8; font-weight:600;
    }

    /* Media Showcase */
    .media-box { width:100%; position:relative; background:#000; overflow:hidden; }
    .single-image {
      width:100%; max-height:560px; object-fit:contain; display:block; background:#0F172A;
    }
    .no-download { -webkit-user-select:none; user-select:none; -webkit-touch-callout:none; pointer-events:auto; }

    /* Video Player Box */
    .video-container { width:100%; max-height:560px; background:#000; display:flex; align-items:center; justify-content:center; }
    video { width:100%; max-height:560px; background:#000; outline:none; }

    /* Privacy Frosted Box */
    .restricted-box {
      margin:20px; padding:32px 20px; text-align:center; background:rgba(15,23,42,0.8);
      border:1px dashed rgba(245,158,11,0.3); border-radius:20px;
    }
    .restricted-icon { font-size:40px; margin-bottom:12px; }
    .restricted-title { font-size:17px; font-weight:800; color:#FBBF24; margin-bottom:8px; }
    .restricted-desc { font-size:13.5px; color:#94A3B8; line-height:1.6; max-width:380px; margin:0 auto 20px auto; }

    /* Interaction Counters */
    .post-stats {
      display:flex; align-items:center; justify-content:space-between; padding:14px 20px;
      border-top:1px solid rgba(255,255,255,0.06); font-size:13px; color:#94A3B8;
    }
    .stats-left { display:flex; gap:16px; }
    .stat-item { display:inline-flex; align-items:center; gap:5px; }

    /* Copyright Notice Banner */
    .copyright-tag {
      margin:12px 20px; font-size:11.5px; color:#64748B; display:flex; align-items:center; gap:6px;
    }

    /* Bottom Sticky Action Bar */
    .bottom-bar {
      position:fixed; bottom:0; left:0; right:0; z-index:100;
      background:rgba(7,11,20,0.92); border-top:1px solid rgba(255,255,255,0.1);
      backdrop-filter:blur(24px); padding:12px 20px; display:flex; justify-content:center;
    }
    .bottom-inner { width:100%; max-width:640px; display:flex; gap:12px; }
    .btn-app {
      flex:1; background:linear-gradient(135deg, #0284C7, #0369A1); color:#fff;
      padding:13px 18px; border-radius:16px; font-size:14px; font-weight:800;
      text-align:center; text-decoration:none; box-shadow:0 8px 20px rgba(2,132,199,0.35); transition:0.2s;
    }
    .btn-app:hover { transform:translateY(-1px); }
    .btn-apk {
      flex:1; background:rgba(255,255,255,0.06); color:#E2E8F0; border:1px solid rgba(255,255,255,0.12);
      padding:13px 18px; border-radius:16px; font-size:13.5px; font-weight:700;
      text-align:center; text-decoration:none; transition:0.2s;
    }
    .btn-apk:hover { background:rgba(255,255,255,0.12); }
  </style>

  <script>
    // Tự động kích hoạt DeepLink mở ứng dụng trên điện thoại
    window.addEventListener('load', function() {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        const deeplinkUrl = "dorabox://post/${post.id}";
        // Dùng iframe ẩn để không hiện thông báo lỗi nếu app chưa cài
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = deeplinkUrl;
        document.body.appendChild(iframe);
        setTimeout(function() {
          document.body.removeChild(iframe);
        }, 2000);
      }
    });

    ${
      !allowDownloadImages
        ? `
    // Khóa chuột phải và cấm kéo thả ảnh theo bản quyền Dorabox
    document.addEventListener('contextmenu', function(e) {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
      }
    });
    `
        : ''
    }
  </script>
</head>
<body>
  <!-- Top Navigation -->
  <header class="top-nav">
    <a href="/" class="brand">
      <div class="brand-logo">✨</div>
      <div class="brand-name">Dorabox<span>Social</span></div>
    </a>
    <a href="${apkUrl}" class="btn-install-nav">Tải v${version} APK</a>
  </header>

  <main class="container">
    <article class="post-card">
      <!-- Post Header -->
      <div class="post-header">
        <div class="avatar-wrapper">
          <img src="${escapeHtml(authorAvatar)}" alt="${authorName}" class="author-avatar" onerror="this.src='https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png'">
        </div>
        <div class="author-info">
          <div class="author-name-row">
            <span class="author-display-name">${authorName}</span>
            ${isOA ? '<span class="badge-oa">★ Tích Vàng OA</span>' : ''}
            ${!isOA && isVerified ? '<span class="badge-verified">✓</span>' : ''}
          </div>
          <div class="author-sub">@${authorUsername} • ${timeFormatted}</div>
        </div>
      </div>

      ${
        isRestricted
          ? `
      <!-- Khung bảo mật bài viết riêng tư -->
      <div class="restricted-box">
        <div class="restricted-icon">🔒</div>
        <div class="restricted-title">Bài viết chia sẻ riêng tư</div>
        <div class="restricted-desc">
          Bài viết này được tác giả cài đặt quyền riêng tư (chỉ bạn bè hoặc nhóm giới hạn trên Dorabox). Vui lòng mở ứng dụng Dorabox để xác thực và xem toàn bộ nội dung.
        </div>
        <a href="dorabox://post/${post.id}" class="btn-app" style="display:inline-block; max-width:280px; margin:0 auto 10px auto;">Mở trên Ứng dụng Dorabox</a>
      </div>
      `
          : `
      <!-- Nội dung văn bản -->
      ${rawContent ? `<div class="post-body">${escapeHtml(rawContent)}</div>` : ''}

      <!-- Nhãn âm nhạc (nếu có) -->
      ${
        audioUrls.length > 0
          ? `
      <div class="music-pill">
        <span>🎵</span>
        <span>${escapeHtml(extractAudioTitle(audioUrls[0]) || 'Giai điệu đính kèm')}</span>
      </div>
      `
          : ''
      }

      <!-- Hiển thị phương tiện (Ảnh / Video) -->
      ${
        visualUrls.length > 0
          ? `
      <div class="media-box">
        ${
          videoUrls.length > 0
            ? `
        <div class="video-container">
          <video src="${escapeHtml(videoUrls[0])}" controls playsinline preload="metadata" ${!allowDownloadVideos ? 'controlsList="nodownload" oncontextmenu="return false;"' : ''}></video>
        </div>
        `
            : `
        <img src="${escapeHtml(imageUrls[0])}" alt="Dorabox Post Media" class="single-image ${!allowDownloadImages ? 'no-download' : ''}" ${!allowDownloadImages ? 'draggable="false"' : ''}>
        `
        }
      </div>
      `
          : ''
      }

      ${
        !allowDownloadImages || !allowDownloadVideos
          ? `
      <div class="copyright-tag">
        <span>🛡️</span>
        <span>Bài viết kích hoạt bản quyền Dorabox: ${!allowDownloadImages ? 'Khóa lưu ảnh • ' : ''}${!allowDownloadVideos ? 'Khóa tải video' : ''}</span>
      </div>
      `
          : ''
      }

      <!-- Lượt tương tác -->
      <div class="post-stats">
        <div class="stats-left">
          <div class="stat-item">❤️ ${post.likes_count || 0} lượt thích</div>
          <div class="stat-item">💬 ${post.comments_count || 0} bình luận</div>
        </div>
        <div>from Tinelfi</div>
      </div>
      `
      }
    </article>
  </main>

  <!-- Sticky Bottom Action Bar -->
  <div class="bottom-bar">
    <div class="bottom-inner">
      <a href="dorabox://post/${post.id}" class="btn-app">Mở bằng Dorabox</a>
      <a href="${apkUrl}" class="btn-apk">Tải APK v${version}</a>
    </div>
  </div>
</body>
</html>`;
}
