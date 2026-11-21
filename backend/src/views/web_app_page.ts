/**
 * Dorabox Social - Official Web App Client (/app)
 * Giao diện Bảng tin (Feed), Đăng nhập, Đăng bài & Bình luận chuẩn Web App / PWA.
 * Tương thích mượt mà trên iPhone (Safari standalone), Android và Desktop.
 * Sử dụng Supabase JS Client & Cloudflare R2 presigned upload.
 */

export interface WebAppConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apkUrl: string;
  version: string;
}

export function renderWebAppPage(config: WebAppConfig): string {
  const supabaseUrl = config.supabaseUrl;
  const supabaseAnonKey = config.supabaseAnonKey;
  const apkUrl = config.apkUrl;
  const version = config.version || '3.0.0';

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Dorabox - Mạng xã hội kết nối diệu kỳ</title>

  <!-- PWA & Apple Web App Meta Tags -->
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#FFFFFF">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="Dorabox">
  <link rel="apple-touch-icon" href="https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png">
  <link rel="icon" href="https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Quicksand:wght@600;700;800&display=swap" rel="stylesheet">

  <!-- Supabase JS Client v2 CDN -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

  <style>
    :root {
      --primary: #0066FF;
      --primary-dark: #0052CC;
      --primary-soft: #EFF6FF;
      --gold: #FFB800;
      --gold-soft: #FFFBEB;
      --bg: #F8FAFC;
      --surface: #FFFFFF;
      --text: #0F172A;
      --text-sub: #475569;
      --text-muted: #94A3B8;
      --border: #E2E8F0;
      --danger: #EF4444;
      --radius: 20px;
    }

    * { margin:0; padding:0; box-sizing:border-box; font-family:'Plus Jakarta Sans', -apple-system, sans-serif; -webkit-tap-highlight-color: transparent; }
    h1, h2, h3, h4, .brand-text { font-family:'Quicksand', sans-serif; }
    body { background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden; padding-bottom: 80px; }

    /* Top App Bar */
    .app-header {
      position: sticky; top: 0; z-index: 100;
      background: rgba(255, 255, 255, 0.94); backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
    }
    .header-wrap {
      max-width: 640px; margin: 0 auto; padding: 0 16px;
      height: 64px; display: flex; align-items: center; justify-content: space-between;
    }
    .brand-wrap { display: flex; align-items: center; gap: 8px; text-decoration: none; }
    .brand-logo { width: 34px; height: 34px; border-radius: 10px; }
    .brand-text { font-size: 19px; font-weight: 800; color: var(--text); }
    .brand-text span { color: var(--primary); }

    .header-actions { display: flex; align-items: center; gap: 10px; }
    .btn-create-post {
      background: var(--primary); color: #fff; border: none; padding: 8px 16px;
      border-radius: 20px; font-size: 13.5px; font-weight: 700; cursor: pointer;
      display: inline-flex; align-items: center; gap: 6px; transition: 0.2s;
    }
    .btn-create-post:hover { background: var(--primary-dark); }
    .btn-auth-trigger {
      background: var(--primary-soft); color: var(--primary); border: 1px solid rgba(0,102,255,0.2);
      padding: 8px 16px; border-radius: 20px; font-size: 13.5px; font-weight: 700; cursor: pointer;
    }
    .user-avatar-btn {
      width: 36px; height: 36px; border-radius: 50%; border: 2px solid var(--primary);
      cursor: pointer; object-fit: cover; background: #E2E8F0;
    }

    /* Container */
    .app-main { max-width: 600px; margin: 0 auto; padding: 16px 12px; }

    /* D-Notes Bar */
    .d-notes-scroller {
      display: flex; gap: 14px; overflow-x: auto; padding: 12px 6px 16px 6px;
      margin-bottom: 12px; scrollbar-width: none;
    }
    .d-notes-scroller::-webkit-scrollbar { display: none; }
    .d-note-item {
      flex-shrink: 0; text-align: center; font-size: 11px; font-weight: 600; color: var(--text-sub);
      position: relative; cursor: pointer; max-width: 76px;
    }
    .d-note-avatar-box {
      width: 52px; height: 52px; border-radius: 50%; padding: 2.5px;
      background: linear-gradient(135deg, #0066FF, #38BDF8); margin: 0 auto 6px auto;
    }
    .d-note-avatar-box.gold { background: linear-gradient(135deg, #FFB800, #F59E0B); }
    .d-note-avatar-inner {
      width: 100%; height: 100%; border-radius: 50%; background: #fff;
      display: flex; align-items: center; justify-content: center; overflow: hidden;
    }
    .d-note-bubble {
      position: absolute; top: -8px; left: 50%; transform: translateX(-50%);
      background: #FFFFFF; color: var(--text); font-size: 9px; font-weight: 700;
      padding: 2px 7px; border-radius: 12px; box-shadow: 0 3px 10px rgba(0,0,0,0.12);
      border: 1px solid var(--border); white-space: nowrap; max-width: 80px; overflow: hidden; text-overflow: ellipsis;
    }

    /* Post Card */
    .post-card {
      background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
      margin-bottom: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.02);
      transition: 0.2s;
    }
    .post-header {
      display: flex; align-items: center; padding: 14px 16px 10px 16px; gap: 12px;
    }
    .author-avatar {
      width: 42px; height: 42px; border-radius: 50%; object-fit: cover; background: #F1F5F9;
      border: 1px solid var(--border); flex-shrink: 0;
    }
    .author-meta { flex: 1; min-width: 0; }
    .author-name-row { display: flex; align-items: center; gap: 6px; }
    .author-name { font-weight: 800; font-size: 15px; color: var(--text); }
    .badge-oa {
      background: var(--gold-soft); color: #D97706; border: 1px solid rgba(217,119,6,0.3);
      padding: 1px 6px; border-radius: 8px; font-size: 10px; font-weight: 700;
    }
    .author-time { font-size: 12px; color: var(--text-muted); margin-top: 1px; }

    .post-content {
      padding: 0 16px 14px 16px; font-size: 14.5px; line-height: 1.65; color: #1E293B;
      white-space: pre-wrap; word-break: break-word;
    }

    /* Media Box */
    .post-media-box { width: 100%; position: relative; background: #000; overflow: hidden; }
    .post-img { width: 100%; max-height: 520px; object-fit: contain; display: block; background: #0F172A; }
    video.post-video { width: 100%; max-height: 520px; background: #000; display: block; outline: none; }
    .copyright-badge {
      display: flex; align-items: center; gap: 6px; padding: 8px 16px; font-size: 11.5px;
      color: var(--text-muted); background: #FAFBFD; border-top: 1px solid #F1F5F9;
    }

    /* Actions Bar */
    .post-actions {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 16px; border-top: 1px solid #F1F5F9;
    }
    .action-group { display: flex; align-items: center; gap: 18px; }
    .btn-action {
      background: none; border: none; display: flex; align-items: center; gap: 6px;
      font-size: 13px; font-weight: 600; color: var(--text-sub); cursor: pointer; padding: 6px 4px;
      transition: 0.15s;
    }
    .btn-action:hover { color: var(--primary); }
    .btn-action.liked { color: var(--danger); font-weight: 700; }
    .btn-action svg { width: 18px; height: 18px; fill: currentColor; }

    /* Empty & Loading States */
    .loading-spinner { text-align: center; padding: 40px; color: var(--text-muted); font-size: 14px; }

    /* Modals */
    .modal-backdrop {
      position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(8px); display: none; align-items: center; justify-content: center;
      z-index: 1000; padding: 16px;
    }
    .modal-card {
      background: var(--surface); border-radius: 24px; max-width: 440px; width: 100%;
      padding: 28px 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); max-height: 90vh; overflow-y: auto;
    }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .modal-header h3 { font-size: 19px; font-weight: 800; }
    .btn-close { background: none; border: none; font-size: 20px; color: var(--text-muted); cursor: pointer; }

    /* Forms */
    .form-group { margin-bottom: 16px; }
    .form-label { display: block; font-size: 13px; font-weight: 700; margin-bottom: 6px; color: var(--text); }
    .form-input, .form-textarea {
      width: 100%; padding: 12px 14px; border: 1px solid var(--border); border-radius: 14px;
      font-size: 14px; outline: none; transition: 0.2s; background: var(--bg);
    }
    .form-input:focus, .form-textarea:focus { border-color: var(--primary); background: #fff; }
    .form-textarea { min-height: 100px; resize: vertical; line-height: 1.5; }
    .btn-submit {
      width: 100%; background: var(--primary); color: #fff; padding: 14px;
      border: none; border-radius: 14px; font-size: 15px; font-weight: 700; cursor: pointer;
      box-shadow: 0 6px 18px rgba(0,102,255,0.25); transition: 0.2s; margin-top: 10px;
    }
    .btn-submit:hover { background: var(--primary-dark); }
    .auth-toggle { text-align: center; margin-top: 14px; font-size: 13.5px; color: var(--text-sub); }
    .auth-toggle a { color: var(--primary); text-decoration: none; font-weight: 700; cursor: pointer; }

    /* Comments Drawer */
    .comments-list { max-height: 300px; overflow-y: auto; margin-bottom: 16px; }
    .comment-item { display: flex; gap: 10px; margin-bottom: 12px; }
    .comment-avatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
    .comment-body { background: var(--bg); padding: 8px 12px; border-radius: 14px; flex: 1; }
    .comment-author { font-size: 12.5px; font-weight: 700; color: var(--text); margin-bottom: 2px; }
    .comment-text { font-size: 13.5px; color: #334155; line-height: 1.45; }
    .comment-input-row { display: flex; gap: 8px; }
  </style>
</head>
<body>
  <!-- Header -->
  <header class="app-header">
    <div class="header-wrap">
      <a href="/app" class="brand-wrap">
        <img src="https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png" alt="Dorabox" class="brand-logo">
        <span class="brand-text">Dorabox<span>.</span></span>
      </a>

      <div class="header-actions">
        <button id="btnCreatePost" class="btn-create-post" style="display:none;" onclick="openCreatePostModal()">
          <span>✏️</span>
          <span>Đăng bài</span>
        </button>

        <button id="btnAuthTrigger" class="btn-auth-trigger" onclick="openAuthModal()">Đăng nhập</button>

        <div id="userProfileMenu" style="display:none; align-items:center; gap:8px;">
          <img id="userAvatarImg" src="https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png" class="user-avatar-btn" onclick="toggleUserDropdown()" alt="Hồ sơ">
          <button onclick="handleLogout()" class="btn-auth-trigger" style="padding:6px 12px; font-size:12px;">Thoát</button>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Feed Area -->
  <main class="app-main">
    <!-- D-Notes Scroller -->
    <div id="dNotesContainer" class="d-notes-scroller">
      <!-- 1. Dorabox Official -->
      <div class="d-note-item">
        <div class="d-note-bubble">Dorabox 3.0 🚀</div>
        <div class="d-note-avatar-box">
          <div class="d-note-avatar-inner">
            <img src="https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png?t=1792690365146" style="width:100%; height:100%; object-fit:cover;" alt="Dorabox" onerror="this.src='https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png'">
          </div>
        </div>
        <span>Dorabox</span>
      </div>

      <!-- 2. Dorabox Creators Official -->
      <div class="d-note-item">
        <div class="d-note-bubble">Creator Tips 💡</div>
        <div class="d-note-avatar-box gold">
          <div class="d-note-avatar-inner">
            <img src="https://doraboxcdn.zpiltk.io.vn/avatars/f56d69ef-e2d0-4bb4-b64b-47c1371f3d28/avatar_1793992083930.webp" style="width:100%; height:100%; object-fit:cover;" alt="Dorabox Creators" onerror="this.src='https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png'">
          </div>
        </div>
        <span>Creators</span>
      </div>
    </div>

    <!-- Feed List Container -->
    <div id="feedList">
      <div class="loading-spinner">Đang tải bảng tin Dorabox...</div>
    </div>
  </main>

  <!-- Modal Đăng Nhập / Đăng Ký -->
  <div id="authModal" class="modal-backdrop" onclick="closeAuthModal(event)">
    <div class="modal-card">
      <div class="modal-header">
        <h3 id="authModalTitle">Đăng nhập Dorabox</h3>
        <button class="btn-close" onclick="closeAuthModalDirect()">✕</button>
      </div>

      <form id="authForm" onsubmit="handleAuthSubmit(event)">
        <div id="signupFields" style="display:none;">
          <div class="form-group">
            <label class="form-label">Tên hiển thị</label>
            <input type="text" id="authDisplayName" class="form-input" placeholder="Ví dụ: Hoàng Long">
          </div>
          <div class="form-group">
            <label class="form-label">Tên người dùng (@username)</label>
            <input type="text" id="authUsername" class="form-input" placeholder="Ví dụ: hoanglong">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Email hoặc @username</label>
          <input type="text" id="authIdentifier" class="form-input" placeholder="name@example.com hoặc username" required>
        </div>

        <div class="form-group">
          <label class="form-label">Mật khẩu</label>
          <input type="password" id="authPassword" class="form-input" placeholder="••••••••" required>
        </div>

        <button type="submit" id="btnAuthSubmit" class="btn-submit">Đăng nhập</button>
      </form>

      <div class="auth-toggle">
        <span id="authToggleText">Chưa có tài khoản?</span>
        <a id="authToggleBtn" onclick="toggleAuthMode()">Đăng ký ngay</a>
      </div>
    </div>
  </div>

  <!-- Modal Đăng Bài Viết Mới -->
  <div id="createPostModal" class="modal-backdrop" onclick="closeCreatePostModal(event)">
    <div class="modal-card">
      <div class="modal-header">
        <h3>Tạo bài viết mới</h3>
        <button class="btn-close" onclick="closeCreatePostModalDirect()">✕</button>
      </div>

      <form onsubmit="handleCreatePost(event)">
        <div class="form-group">
          <textarea id="postContentInput" class="form-textarea" placeholder="Bạn đang nghĩ gì hôm nay? Chia sẻ cùng Dorabox..."></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Đính kèm hình ảnh</label>
          <input type="file" id="postImageFile" accept="image/*" class="form-input" onchange="handleImageSelected(event)">
          <div id="imageUploadPreview" style="margin-top:10px; display:none;">
            <img id="imgPreviewTag" src="" style="width:100%; max-height:180px; object-fit:cover; border-radius:12px;">
          </div>
        </div>

        <div class="form-group" style="display:flex; align-items:center; gap:8px;">
          <input type="checkbox" id="postProtectCopyright" checked style="width:16px; height:16px;">
          <label for="postProtectCopyright" style="font-size:13px; color:var(--text-sub); cursor:pointer;">
            Bảo vệ quyền tác giả: Khóa lưu ảnh/video
          </label>
        </div>

        <button type="submit" id="btnSubmitPost" class="btn-submit">Đăng bài ngay</button>
      </form>
    </div>
  </div>

  <!-- Modal Bình Luận -->
  <div id="commentsModal" class="modal-backdrop" onclick="closeCommentsModal(event)">
    <div class="modal-card">
      <div class="modal-header">
        <h3>Bình luận</h3>
        <button class="btn-close" onclick="closeCommentsModalDirect()">✕</button>
      </div>

      <div id="commentsListContainer" class="comments-list">
        <div class="loading-spinner">Đang tải bình luận...</div>
      </div>

      <form onsubmit="handleSubmitComment(event)" class="comment-input-row">
        <input type="text" id="commentTextInput" class="form-input" placeholder="Viết bình luận..." required>
        <button type="submit" class="btn-create-post" style="padding:0 18px;">Gửi</button>
      </form>
    </div>
  </div>

  <script>
    const SUPABASE_URL = "${supabaseUrl}";
    const SUPABASE_ANON_KEY = "${supabaseAnonKey}";
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    let currentUser = null;
    let currentUserProfile = null;
    let isSignUpMode = false;
    let selectedImageFile = null;
    let activeCommentPostId = null;

    // Khởi tạo ứng dụng
    window.addEventListener('load', async () => {
      await checkAuthSession();
      loadFeedPosts();
      loadDNotes();
    });

    async function loadDNotes() {
      const container = document.getElementById('dNotesContainer');
      if (!container) return;
      try {
        const { data: notes } = await supabase
          .from('user_notes')
          .select(\`
            id, content, song_title, song_artist, created_at,
            profiles!user_id (
              display_name, username, avatar_url, is_oa
            )
          \`)
          .gt('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false })
          .limit(10);

        if (notes && notes.length > 0) {
          container.innerHTML = notes.map(n => {
            const p = n.profiles || {};
            const avatar = p.avatar_url || 'https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png';
            const name = escapeHtml(p.display_name || p.username || 'Người dùng');
            const bubble = escapeHtml(n.song_title ? ('🎵 ' + n.song_title) : (n.content || '...'));
            return \`
              <div class="d-note-item">
                <div class="d-note-bubble">\${bubble}</div>
                <div class="d-note-avatar-box \${p.is_oa ? 'gold' : ''}">
                  <div class="d-note-avatar-inner">
                    <img src="\${avatar}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png'">
                  </div>
                </div>
                <span>\${name}</span>
              </div>
            \`;
          }).join('');
        }
      } catch (e) {
        console.error('Error loading D-Notes:', e);
      }
    }

    async function checkAuthSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        currentUser = session.user;
        await loadUserProfile(currentUser.id);
        updateAuthUI(true);
      } else {
        updateAuthUI(false);
      }
    }

    async function loadUserProfile(userId) {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      currentUserProfile = data;
      if (currentUserProfile && currentUserProfile.avatar_url) {
        document.getElementById('userAvatarImg').src = currentUserProfile.avatar_url;
      }
    }

    function updateAuthUI(isLoggedIn) {
      document.getElementById('btnAuthTrigger').style.display = isLoggedIn ? 'none' : 'block';
      document.getElementById('btnCreatePost').style.display = isLoggedIn ? 'inline-flex' : 'none';
      document.getElementById('userProfileMenu').style.display = isLoggedIn ? 'inline-flex' : 'none';
    }

    // Tải danh sách bài viết bảng tin
    async function loadFeedPosts() {
      const feedContainer = document.getElementById('feedList');
      feedContainer.innerHTML = '<div class="loading-spinner">Đang tải bài viết...</div>';

      try {
        const { data: posts, error } = await supabase
          .from('posts')
          .select(\`
            id,
            content,
            media_urls,
            likes_count,
            comments_count,
            allow_download_images,
            allow_download_videos,
            created_at,
            profiles!author_id (
              id,
              username,
              display_name,
              avatar_url,
              is_oa,
              is_verified
            )
          \`)
          .or('visibility.eq.public,visibility.is.null')
          .order('created_at', { ascending: false })
          .limit(30);

        if (error || !posts || posts.length === 0) {
          feedContainer.innerHTML = '<div class="loading-spinner">Chưa có bài viết nào trên bảng tin.</div>';
          return;
        }

        feedContainer.innerHTML = posts.map(renderPostCardHtml).join('');
      } catch (e) {
        feedContainer.innerHTML = '<div class="loading-spinner">Không thể tải bài viết. Vui lòng thử lại.</div>';
      }
    }

    function renderPostCardHtml(post) {
      const author = post.profiles || {};
      const authorName = escapeHtml(author.display_name || 'Người dùng Dorabox');
      const authorUsername = escapeHtml(author.username || 'user');
      const avatarUrl = author.avatar_url || 'https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png';
      const isOA = author.is_oa === true;
      const mediaList = Array.isArray(post.media_urls) ? post.media_urls : [];
      const imageUrls = mediaList.filter(u => !/\.(mp4|mov|webm)/i.test(u) && !/\.(mp3|m4a|wav)/i.test(u));
      const videoUrls = mediaList.filter(u => /\.(mp4|mov|webm)/i.test(u));

      return \`
      <article class="post-card" id="post-\${post.id}">
        <div class="post-header">
          <img src="\${avatarUrl}" class="author-avatar" onerror="this.src='https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png'">
          <div class="author-meta">
            <div class="author-name-row">
              <span class="author-name">\${authorName}</span>
              \${isOA ? '<span class="badge-oa">★ OA</span>' : ''}
            </div>
            <div class="author-time">@\${authorUsername} • \${formatTimeAgo(post.created_at)}</div>
          </div>
        </div>

        \${post.content ? \`<div class="post-content">\${escapeHtml(post.content)}</div>\` : ''}

        \${videoUrls.length > 0 ? \`
          <div class="post-media-box">
            <video src="\${videoUrls[0]}" controls playsinline class="post-video"></video>
          </div>
        \` : (imageUrls.length > 0 ? \`
          <div class="post-media-box">
            <img src="\${imageUrls[0]}" class="post-img" \${post.allow_download_images === false ? 'oncontextmenu="return false;" draggable="false"' : ''}>
          </div>
        \` : '')}

        \${post.allow_download_images === false || post.allow_download_videos === false ? \`
          <div class="copyright-badge">
            <span>🛡️</span>
            <span>Nội dung bật chế độ bảo vệ quyền tác giả</span>
          </div>
        \` : ''}

        <div class="post-actions">
          <div class="action-group">
            <button class="btn-action" onclick="handleLikePost('\${post.id}')">
              <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              <span id="likes-count-\${post.id}">\${post.likes_count || 0}</span>
            </button>

            <button class="btn-action" onclick="openCommentsModal('\${post.id}')">
              <svg viewBox="0 0 24 24"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
              <span>\${post.comments_count || 0}</span>
            </button>
          </div>

          <button class="btn-action" onclick="sharePostLink('\${post.id}')">
            <span>↗️ Chia sẻ</span>
          </button>
        </div>
      </article>
      \`;
    }

    // Xử lý Thả tim bài viết
    async function handleLikePost(postId) {
      if (!currentUser) {
        openAuthModal();
        return;
      }
      const countSpan = document.getElementById('likes-count-' + postId);
      let currentCount = parseInt(countSpan.innerText) || 0;
      countSpan.innerText = currentCount + 1;

      try {
        await supabase.from('post_reactions').insert({
          post_id: postId,
          user_id: currentUser.id,
          reaction_type: 'like'
        });
      } catch (_) {}
    }

    // Xử lý Chia sẻ bài viết
    function sharePostLink(postId) {
      const url = window.location.origin + '/p/' + postId;
      if (navigator.share) {
        navigator.share({ title: 'Dorabox', url: url }).catch(() => {});
      } else {
        navigator.clipboard.writeText(url).then(() => {
          alert('Đã sao chép liên kết bài viết vào bộ nhớ tạm!');
        });
      }
    }

    // Modal Bình Luận
    async function openCommentsModal(postId) {
      activeCommentPostId = postId;
      document.getElementById('commentsModal').style.display = 'flex';
      const listContainer = document.getElementById('commentsListContainer');
      listContainer.innerHTML = '<div class="loading-spinner">Đang tải bình luận...</div>';

      const { data: comments } = await supabase
        .from('comments')
        .select('id, content, created_at, profiles(display_name, avatar_url)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (!comments || comments.length === 0) {
        listContainer.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-muted); font-size:13.5px;">Chưa có bình luận nào. Hãy là người đầu tiên!</div>';
        return;
      }

      listContainer.innerHTML = comments.map(c => \`
        <div class="comment-item">
          <img src="\${c.profiles?.avatar_url || 'https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png'}" class="comment-avatar">
          <div class="comment-body">
            <div class="comment-author">\${escapeHtml(c.profiles?.display_name || 'Người dùng')}</div>
            <div class="comment-text">\${escapeHtml(c.content)}</div>
          </div>
        </div>
      \`).join('');
    }

    async function handleSubmitComment(e) {
      e.preventDefault();
      if (!currentUser) {
        openAuthModal();
        return;
      }
      const input = document.getElementById('commentTextInput');
      const text = input.value.trim();
      if (!text || !activeCommentPostId) return;

      input.value = '';
      await supabase.from('comments').insert({
        post_id: activeCommentPostId,
        user_id: currentUser.id,
        content: text
      });
      openCommentsModal(activeCommentPostId);
    }

    // Đăng bài viết mới
    function openCreatePostModal() {
      if (!currentUser) {
        openAuthModal();
        return;
      }
      document.getElementById('createPostModal').style.display = 'flex';
    }

    function handleImageSelected(e) {
      const file = e.target.files[0];
      if (file) {
        selectedImageFile = file;
        const reader = new FileReader();
        reader.onload = function(evt) {
          document.getElementById('imgPreviewTag').src = evt.target.result;
          document.getElementById('imageUploadPreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    }

    async function handleCreatePost(e) {
      e.preventDefault();
      const content = document.getElementById('postContentInput').value.trim();
      const protectCopyright = document.getElementById('postProtectCopyright').checked;
      const btn = document.getElementById('btnSubmitPost');

      if (!content && !selectedImageFile) {
        alert('Vui lòng nhập nội dung hoặc chọn ảnh để đăng bài!');
        return;
      }

      btn.disabled = true;
      btn.innerText = 'Đang đăng...';

      let mediaUrls = [];

      try {
        if (selectedImageFile) {
          // Lấy Presigned URL từ backend
          const ext = selectedImageFile.name.split('.').pop() || 'jpg';
          const presignedRes = await fetch('/api/upload/presigned-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: currentUser.id,
              folder: 'posts',
              contentType: selectedImageFile.type || 'image/jpeg',
              fileExt: ext
            })
          });
          const presignedData = await presignedRes.json();
          if (presignedData.data && presignedData.data.uploadUrl) {
            await fetch(presignedData.data.uploadUrl, {
              method: 'PUT',
              headers: { 'Content-Type': selectedImageFile.type || 'image/jpeg' },
              body: selectedImageFile
            });
            mediaUrls.push(presignedData.data.publicUrl);
          }
        }

        // Tạo bài viết trên Supabase
        await supabase.from('posts').insert({
          author_id: currentUser.id,
          content: content,
          media_urls: mediaUrls,
          visibility: 'public',
          allow_download_images: !protectCopyright,
          allow_download_videos: !protectCopyright
        });

        closeCreatePostModalDirect();
        loadFeedPosts();
      } catch (err) {
        alert('Có lỗi xảy ra khi đăng bài. Vui lòng thử lại!');
      } finally {
        btn.disabled = false;
        btn.innerText = 'Đăng bài ngay';
      }
    }

    // Xử lý Đăng Nhập / Đăng Ký
    async function handleAuthSubmit(e) {
      e.preventDefault();
      const identifier = document.getElementById('authIdentifier').value.trim();
      const password = document.getElementById('authPassword').value;
      const btn = document.getElementById('btnAuthSubmit');

      btn.disabled = true;
      btn.innerText = 'Đang xử lý...';

      try {
        if (isSignUpMode) {
          const displayName = document.getElementById('authDisplayName').value.trim();
          const username = document.getElementById('authUsername').value.trim().toLowerCase();

          const { data, error } = await supabase.auth.signUp({
            email: identifier,
            password: password,
            options: {
              data: {
                display_name: displayName || 'Người dùng',
                username: username || ('user_' + Math.floor(Math.random() * 10000))
              }
            }
          });
          if (error) throw error;
          alert('Đăng ký thành công! Bạn có thể đăng nhập ngay.');
          toggleAuthMode();
        } else {
          let emailToLogin = identifier;
          if (!identifier.includes('@')) {
            const { data: resolvedEmail } = await supabase.rpc('get_email_by_username', { p_username: identifier });
            if (resolvedEmail) emailToLogin = resolvedEmail;
          }

          const { data, error } = await supabase.auth.signInWithPassword({
            email: emailToLogin,
            password: password
          });
          if (error) throw error;
          currentUser = data.user;
          await loadUserProfile(currentUser.id);
          updateAuthUI(true);
          closeAuthModalDirect();
          loadFeedPosts();
        }
      } catch (err) {
        alert('Lỗi: ' + (err.message || 'Đăng nhập không thành công'));
      } finally {
        btn.disabled = false;
        btn.innerText = isSignUpMode ? 'Đăng ký ngay' : 'Đăng nhập';
      }
    }

    async function handleLogout() {
      await supabase.auth.signOut();
      currentUser = null;
      currentUserProfile = null;
      updateAuthUI(false);
      loadFeedPosts();
    }

    // Modal UI Helpers
    function openAuthModal() { document.getElementById('authModal').style.display = 'flex'; }
    function closeAuthModalDirect() { document.getElementById('authModal').style.display = 'none'; }
    function closeAuthModal(e) { if (e.target.id === 'authModal') closeAuthModalDirect(); }
    
    function closeCreatePostModalDirect() {
      document.getElementById('createPostModal').style.display = 'none';
      document.getElementById('postContentInput').value = '';
      document.getElementById('postImageFile').value = '';
      document.getElementById('imageUploadPreview').style.display = 'none';
      selectedImageFile = null;
    }
    function closeCreatePostModal(e) { if (e.target.id === 'createPostModal') closeCreatePostModalDirect(); }

    function closeCommentsModalDirect() { document.getElementById('commentsModal').style.display = 'none'; }
    function closeCommentsModal(e) { if (e.target.id === 'commentsModal') closeCommentsModalDirect(); }

    function toggleAuthMode() {
      isSignUpMode = !isSignUpMode;
      document.getElementById('authModalTitle').innerText = isSignUpMode ? 'Tạo tài khoản Dorabox' : 'Đăng nhập Dorabox';
      document.getElementById('signupFields').style.display = isSignUpMode ? 'block' : 'none';
      document.getElementById('btnAuthSubmit').innerText = isSignUpMode ? 'Đăng ký ngay' : 'Đăng nhập';
      document.getElementById('authToggleText').innerText = isSignUpMode ? 'Đã có tài khoản?' : 'Chưa có tài khoản?';
      document.getElementById('authToggleBtn').innerText = isSignUpMode ? 'Đăng nhập' : 'Đăng ký ngay';
    }

    function escapeHtml(str = '') {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function formatTimeAgo(dateStr) {
      if (!dateStr) return 'Gần đây';
      const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
      if (diff < 60) return 'Vừa xong';
      if (diff < 3600) return Math.floor(diff / 60) + ' phút trước';
      if (diff < 86400) return Math.floor(diff / 3600) + ' giờ trước';
      return new Date(dateStr).toLocaleDateString('vi-VN');
    }
  </script>
</body>
</html>`;
}
