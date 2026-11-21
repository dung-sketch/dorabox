/**
 * Dorabox Social - Smart Post Preview Page
 * Hỗ trợ OpenGraph SSR cho Zalo, Facebook, Messenger, Telegram, Twitter.
 * Tích hợp kiểm tra bảo mật quyền riêng tư (Public vs Friends/Custom)
 * và kế thừa cơ chế bảo vệ quyền tác giả ảnh/video của Dorabox.
 * Thiết kế phong cách Human-Crafted: Sáng sủa, thanh lịch, tinh tế.
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
  <title>Bài viết không khả dụng - Dorabox</title>
  <link rel="icon" href="https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Quicksand:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; font-family:'Plus Jakarta Sans', sans-serif; }
    h1 { font-family:'Quicksand', sans-serif; }
    body { background:#F8FAFC; color:#0F172A; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:20px; }
    .card { background:#FFFFFF; border:1px solid #E2E8F0; border-radius:24px; padding:40px 28px; max-width:420px; width:100%; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,0.05); }
    h1 { font-size:20px; font-weight:800; margin-bottom:10px; color:#0F172A; }
    p { font-size:14.5px; color:#64748B; line-height:1.6; margin-bottom:28px; }
    .btn { display:inline-block; background:#0066FF; color:#fff; padding:12px 28px; border-radius:14px; text-decoration:none; font-weight:700; font-size:14px; transition:0.2s; }
    .btn:hover { background:#0052CC; }
  </style>
</head>
<body>
  <div class="card">
    <div style="font-size:44px; margin-bottom:16px;">🔍</div>
    <h1>Bài viết không khả dụng</h1>
    <p>Bài viết này có thể đã được gỡ xuống hoặc liên kết bạn mở không tồn tại.</p>
    <a href="/" class="btn">Khám phá Dorabox</a>
  </div>
</body>
</html>`;
  }

  const author = post.author || {};
  const authorName = escapeHtml(author.display_name || 'Người dùng Dorabox');
  const authorUsername = escapeHtml(author.username || 'user');
  const authorAvatar = author.avatar_url || 'https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png';
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
  let ogImage = 'https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png';
  if (!isRestricted && imageUrls.length > 0) {
    ogImage = imageUrls[0];
  } else if (authorAvatar) {
    ogImage = authorAvatar;
  }

  const pageTitle = isRestricted
    ? `Bài viết riêng tư - Dorabox`
    : `${authorName}: "${contentExcerpt.replace(/\n/g, ' ')}" - Dorabox`;

  const ogDesc = isRestricted
    ? `Bài viết này được chia sẻ ở chế độ bảo mật riêng tư trên Dorabox.`
    : contentExcerpt.replace(/\n/g, ' ') || `Khám phá bài viết của ${authorName} trên Dorabox.`;

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${escapeHtml(pageTitle)}</title>
  
  <!-- OpenGraph Meta Tags cho Zalo, Facebook, Messenger, Telegram -->
  <meta property="og:site_name" content="Dorabox">
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

  <link rel="canonical" href="https://${host}/p/${post.id}">

  <!-- PWA & Apple Web App Meta Tags -->
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#0066FF">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="Dorabox">
  <link rel="apple-touch-icon" href="https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png">

  <!-- Schema.org JSON-LD Structured Data -->
  ${
    !isRestricted
      ? `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SocialMediaPosting",
    "headline": "${escapeHtml(contentExcerpt.replace(/\n/g, ' '))}",
    "articleBody": "${escapeHtml(rawContent.replace(/\n/g, ' '))}",
    "datePublished": "${post.created_at || new Date().toISOString()}",
    "image": "${escapeHtml(ogImage)}",
    "author": {
      "@type": "Person",
      "name": "${authorName}",
      "url": "https://${host}/p/${post.id}"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Dorabox",
      "logo": {
        "@type": "ImageObject",
        "url": "https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png"
      }
    }
  }
  </script>`
      : ''
  }

  <link rel="icon" href="https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Quicksand:wght@600;700;800&display=swap" rel="stylesheet">

  <style>
    * { margin:0; padding:0; box-sizing:border-box; font-family:'Plus Jakarta Sans', sans-serif; }
    h1, h2, h3, .author-display-name, .brand-text { font-family:'Quicksand', sans-serif; }
    body { background:#F8FAFC; color:#0F172A; min-height:100vh; display:flex; flex-direction:column; align-items:center; }
    
    /* Top Bar */
    .top-nav {
      width:100%; max-width:640px; padding:14px 20px; display:flex; align-items:center; justify-content:space-between;
      border-bottom:1px solid #E2E8F0; background:rgba(255,255,255,0.92); backdrop-filter:blur(20px); position:sticky; top:0; z-index:50;
    }
    .brand { display:flex; align-items:center; gap:10px; text-decoration:none; }
    .brand-logo { width:34px; height:34px; border-radius:10px; }
    .brand-text { font-weight:800; font-size:18px; color:#0F172A; }
    .brand-text span { color:#0066FF; }
    .btn-top-get {
      background:#0066FF; color:#fff; font-size:13px; font-weight:700;
      padding:8px 18px; border-radius:20px; text-decoration:none; transition:0.2s;
    }
    .btn-top-get:hover { background:#0052CC; }

    /* Container */
    .container { width:100%; max-width:600px; padding:24px 16px 120px 16px; }

    /* Post Card */
    .post-card {
      background:#FFFFFF; border:1px solid #E2E8F0; border-radius:24px;
      overflow:hidden; box-shadow:0 8px 30px rgba(0,0,0,0.04);
    }
    .post-header { display:flex; align-items:center; padding:18px 20px; gap:12px; }
    .avatar-wrapper { width:46px; height:46px; border-radius:50%; flex-shrink:0; }
    .author-avatar { width:46px; height:46px; border-radius:50%; object-fit:cover; border:1px solid #E2E8F0; background:#F1F5F9; }
    .author-info { flex:1; min-width:0; }
    .author-name-row { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
    .author-display-name { font-weight:800; font-size:16px; color:#0F172A; }
    .badge-oa {
      display:inline-flex; align-items:center; background:#FFFBEB;
      color:#D97706; border:1px solid rgba(217,119,6,0.25); padding:1px 7px; border-radius:10px; font-size:11px; font-weight:700;
    }
    .badge-verified { color:#0066FF; font-size:14px; }
    .author-sub { font-size:12.5px; color:#64748B; margin-top:2px; }

    /* Post Content */
    .post-body { padding:0 20px 16px 20px; font-size:15px; line-height:1.65; color:#1E293B; white-space:pre-wrap; word-break:break-word; }
    
    /* Music Pill */
    .music-pill {
      display:inline-flex; align-items:center; gap:8px; margin:0 20px 16px 20px;
      background:#EFF6FF; border:1px solid rgba(0,102,255,0.15);
      padding:6px 14px; border-radius:20px; font-size:12.5px; color:#0066FF; font-weight:600;
    }

    /* Media */
    .media-box { width:100%; position:relative; background:#F1F5F9; overflow:hidden; }
    .single-image {
      width:100%; max-height:560px; object-fit:contain; display:block; background:#0F172A;
    }
    .no-download { -webkit-user-select:none; user-select:none; -webkit-touch-callout:none; pointer-events:auto; }

    /* Video Player */
    .video-container { width:100%; max-height:560px; background:#000; display:flex; align-items:center; justify-content:center; }
    video { width:100%; max-height:560px; background:#000; outline:none; }

    /* Restricted Box */
    .restricted-box {
      margin:20px; padding:36px 24px; text-align:center; background:#F8FAFC;
      border:1px dashed #CBD5E1; border-radius:20px;
    }
    .restricted-icon { font-size:36px; margin-bottom:12px; }
    .restricted-title { font-size:17px; font-weight:800; color:#0F172A; margin-bottom:8px; }
    .restricted-desc { font-size:14px; color:#64748B; line-height:1.6; max-width:380px; margin:0 auto 20px auto; }

    /* Post Stats */
    .post-stats {
      display:flex; align-items:center; justify-content:space-between; padding:14px 20px;
      border-top:1px solid #F1F5F9; font-size:13px; color:#64748B;
    }
    .stats-left { display:flex; gap:16px; }

    /* Copyright Notice */
    .copyright-tag {
      margin:12px 20px; font-size:12px; color:#64748B; display:flex; align-items:center; gap:6px;
    }

    /* Bottom Action Bar */
    .bottom-bar {
      position:fixed; bottom:0; left:0; right:0; z-index:100;
      background:rgba(255,255,255,0.92); border-top:1px solid #E2E8F0;
      backdrop-filter:blur(20px); padding:12px 20px; display:flex; justify-content:center;
    }
    .bottom-inner { width:100%; max-width:600px; display:flex; gap:12px; }
    .btn-app {
      flex:1; background:#0066FF; color:#fff; padding:13px 18px; border-radius:16px;
      font-size:14.5px; font-weight:700; text-align:center; text-decoration:none; transition:0.2s;
      box-shadow:0 6px 18px rgba(0,102,255,0.25);
    }
    .btn-app:hover { background:#0052CC; }
    .btn-apk {
      flex:1; background:#F1F5F9; color:#0F172A; border:1px solid #E2E8F0;
      padding:13px 18px; border-radius:16px; font-size:14px; font-weight:700;
      text-align:center; text-decoration:none; transition:0.2s;
    }
    .btn-apk:hover { background:#E2E8F0; }
  </style>

  <script>
    window.addEventListener('load', function() {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        const deeplinkUrl = "dorabox://post/${post.id}";
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
  <!-- Header -->
  <header class="top-nav">
    <a href="/" class="brand">
      <img src="https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png" alt="Dorabox" class="brand-logo">
      <span class="brand-text">Dorabox<span>.</span></span>
    </a>
    <a href="${apkUrl}" class="btn-top-get">Tải ứng dụng</a>
  </header>

  <main class="container">
    <article class="post-card">
      <div class="post-header">
        <div class="avatar-wrapper">
          <img src="${escapeHtml(authorAvatar)}" alt="${authorName}" class="author-avatar" onerror="this.src='https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png'">
        </div>
        <div class="author-info">
          <div class="author-name-row">
            <span class="author-display-name">${authorName}</span>
            ${isOA ? '<span class="badge-oa">★ OA</span>' : ''}
            ${!isOA && isVerified ? '<span class="badge-verified">✓</span>' : ''}
          </div>
          <div class="author-sub">@${authorUsername} • ${timeFormatted}</div>
        </div>
      </div>

      ${
        isRestricted
          ? `
      <div class="restricted-box">
        <div class="restricted-icon">🔒</div>
        <div class="restricted-title">Nội dung riêng tư</div>
        <div class="restricted-desc">
          Bài viết này được tác giả cài đặt quyền riêng tư trên Dorabox. Vui lòng mở ứng dụng để xác thực và xem toàn bộ nội dung.
        </div>
        <a href="dorabox://post/${post.id}" class="btn-app" style="display:inline-block; max-width:260px; margin:0 auto;">Mở trong ứng dụng</a>
      </div>
      `
          : `
      ${rawContent ? `<div class="post-body">${escapeHtml(rawContent)}</div>` : ''}

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
        <span>Nội dung đã được tác giả bật chế độ bảo vệ quyền sở hữu</span>
      </div>
      `
          : ''
      }

      <div class="post-stats">
        <div class="stats-left">
          <span>❤️ ${post.likes_count || 0} lượt thích</span>
          <span>💬 ${post.comments_count || 0} bình luận</span>
        </div>
        <div>Dorabox</div>
      </div>
      `
      }
    </article>
  </main>

  <!-- Sticky Bottom Action Bar -->
  <div class="bottom-bar">
    <div class="bottom-inner">
      <a href="dorabox://post/${post.id}" class="btn-app">Mở trong Dorabox</a>
      <a href="${apkUrl}" class="btn-apk">Tải ứng dụng</a>
    </div>
  </div>
</body>
</html>`;
}
