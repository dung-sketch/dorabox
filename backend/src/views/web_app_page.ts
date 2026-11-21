/**
 * Dorabox Social - Official Complete Web Platform (/app)
 * Nền tảng Web Mạng Xã Hội Đa Tầng Hoàn Chỉnh:
 * - Responsive 3-Column Desktop & Mobile Bottom Bar
 * - 4 Phân hệ chính: Bảng tin (Feed & D-Notes), Khám phá & Tìm kiếm (Explore),
 *   Tin nhắn trực tiếp thời gian thực (Chat 1-1), Trang cá nhân (Profile).
 * - Đăng bài đa phương tiện (Cloudflare R2 Presigned Upload) kèm bảo vệ bản quyền.
 * - Tương tác thả tim, bình luận trực tiếp, chia sẻ bài viết SSR.
 * - Xác thực: Đăng nhập/Đăng ký bằng Email hoặc @username.
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
  <title>Dorabox - Mạng xã hội kết nối diệu kỳ, sẻ chia niềm vui</title>

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
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Quicksand:wght@600;700;800&display=swap" rel="stylesheet">

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
      --radius-sm: 12px;
      --shadow-sm: 0 2px 8px rgba(15, 23, 42, 0.04);
      --shadow-md: 0 10px 25px -5px rgba(0, 102, 255, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03);
    }

    * { margin:0; padding:0; box-sizing:border-box; font-family:'Plus Jakarta Sans', -apple-system, sans-serif; -webkit-tap-highlight-color: transparent; }
    h1, h2, h3, h4, .brand-text { font-family:'Quicksand', sans-serif; }
    body { background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden; }

    /* App Container Layout (3 Columns Desktop, 1 Column Mobile) */
    .app-layout {
      max-width: 1240px; margin: 0 auto;
      display: flex; min-height: 100vh;
    }

    /* Left Sidebar Navigation (Desktop >= 1024px) */
    .sidebar-left {
      width: 260px; flex-shrink: 0; padding: 24px 16px;
      position: sticky; top: 0; height: 100vh;
      display: flex; flex-direction: column; justify-content: space-between;
      border-right: 1px solid var(--border); background: #FFFFFF;
    }
    .brand-link {
      display: flex; align-items: center; gap: 10px; text-decoration: none;
      padding: 8px 12px; border-radius: 16px; margin-bottom: 24px;
    }
    .brand-logo { width: 38px; height: 38px; border-radius: 12px; }
    .brand-title { font-size: 22px; font-weight: 800; color: var(--text); }
    .brand-title span { color: var(--primary); }

    .nav-list { display: flex; flex-direction: column; gap: 6px; }
    .nav-btn {
      display: flex; align-items: center; gap: 14px; padding: 13px 16px;
      border-radius: 16px; text-decoration: none; color: var(--text-sub);
      font-size: 15.5px; font-weight: 700; transition: 0.2s; border: none; background: transparent;
      cursor: pointer; width: 100%; text-align: left;
    }
    .nav-btn:hover { background: var(--primary-soft); color: var(--primary); }
    .nav-btn.active { background: var(--primary-soft); color: var(--primary); }
    .nav-btn svg { width: 22px; height: 22px; fill: currentColor; }

    .btn-side-post {
      margin-top: 20px; width: 100%; padding: 14px; border-radius: 16px;
      background: var(--primary); color: #fff; font-size: 15px; font-weight: 700;
      border: none; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 14px rgba(0, 102, 255, 0.25);
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .btn-side-post:hover { background: var(--primary-dark); transform: translateY(-1px); }

    .user-pill-bottom {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 12px; border-radius: 16px; background: var(--bg);
      border: 1px solid var(--border);
    }
    .user-pill-info { display: flex; align-items: center; gap: 10px; min-width: 0; cursor: pointer; }
    .user-pill-avatar { width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border); }
    .user-pill-name { font-size: 13.5px; font-weight: 800; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .user-pill-tag { font-size: 11px; color: var(--text-muted); }
    .btn-pill-logout { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 6px; border-radius: 8px; }
    .btn-pill-logout:hover { color: var(--danger); }

    /* Center Main Column */
    .main-center {
      flex: 1; max-width: 640px; min-height: 100vh;
      border-right: 1px solid var(--border); background: #FFFFFF;
      position: relative;
    }

    /* Top Sticky Bar */
    .top-bar-sticky {
      position: sticky; top: 0; z-index: 90;
      background: rgba(255, 255, 255, 0.94); backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
      height: 60px; display: flex; align-items: center; justify-content: space-between;
      padding: 0 20px;
    }
    .top-bar-title { font-size: 18px; font-weight: 800; color: var(--text); }
    .mobile-logo-header { display: none; align-items: center; gap: 8px; text-decoration: none; }
    .mobile-logo-img { width: 30px; height: 30px; border-radius: 8px; }

    /* Right Sidebar (Desktop >= 1024px) */
    .sidebar-right {
      width: 340px; flex-shrink: 0; padding: 24px 20px;
      position: sticky; top: 0; height: 100vh; overflow-y: auto;
      display: flex; flex-direction: column; gap: 20px;
    }
    .widget-card {
      background: #FFFFFF; border: 1px solid var(--border); border-radius: 20px;
      padding: 20px; box-shadow: var(--shadow-sm);
    }
    .widget-title { font-size: 16px; font-weight: 800; margin-bottom: 14px; color: var(--text); display: flex; align-items: center; gap: 8px; }
    .oa-suggest-item {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 0; border-bottom: 1px solid #F1F5F9;
    }
    .oa-suggest-item:last-child { border-bottom: none; }
    .oa-suggest-left { display: flex; align-items: center; gap: 10px; cursor: pointer; }
    .oa-avatar-sm { width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border); }
    .btn-follow-oa {
      padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700;
      background: var(--primary-soft); color: var(--primary); border: 1px solid rgba(0,102,255,0.2);
      cursor: pointer; transition: 0.2s;
    }
    .btn-follow-oa:hover { background: var(--primary); color: #fff; }

    /* App Views */
    .app-view { display: none; padding-bottom: 80px; }
    .app-view.active { display: block; }

    /* D-Notes Bar */
    .d-notes-scroller {
      display: flex; gap: 14px; overflow-x: auto; padding: 16px 20px;
      border-bottom: 1px solid var(--border); scrollbar-width: none;
    }
    .d-notes-scroller::-webkit-scrollbar { display: none; }
    .d-note-item {
      flex-shrink: 0; text-align: center; font-size: 11px; font-weight: 600; color: var(--text-sub);
      position: relative; cursor: pointer; max-width: 76px;
    }
    .d-note-avatar-box {
      width: 54px; height: 54px; border-radius: 50%; padding: 2.5px;
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
      border: 1px solid var(--border); white-space: nowrap; max-width: 84px; overflow: hidden; text-overflow: ellipsis;
    }

    /* Quick Post Box */
    .quick-post-box {
      padding: 16px 20px; border-bottom: 1px solid var(--border);
      display: flex; gap: 12px; align-items: center; cursor: pointer;
    }
    .quick-post-avatar { width: 42px; height: 42px; border-radius: 50%; object-fit: cover; }
    .quick-post-trigger {
      flex: 1; background: var(--bg); border: 1px solid var(--border);
      border-radius: 24px; padding: 12px 18px; font-size: 14px; color: var(--text-muted);
      cursor: pointer; transition: 0.2s;
    }
    .quick-post-trigger:hover { border-color: #CBD5E1; background: #F1F5F9; }

    /* Post Card */
    .post-card {
      padding: 18px 20px; border-bottom: 1px solid var(--border);
      transition: 0.15s background;
    }
    .post-card:hover { background: #FAFCFF; }
    .post-header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
    .author-avatar { width: 42px; height: 42px; border-radius: 50%; object-fit: cover; flex-shrink: 0; cursor: pointer; }
    .author-meta { flex: 1; min-width: 0; }
    .author-name-row { display: flex; align-items: center; gap: 6px; }
    .author-name { font-weight: 800; font-size: 15px; color: var(--text); cursor: pointer; }
    .badge-oa {
      background: var(--gold-soft); color: #D97706; border: 1px solid rgba(217,119,6,0.3);
      padding: 1px 6px; border-radius: 8px; font-size: 10px; font-weight: 700;
    }
    .author-time { font-size: 12px; color: var(--text-muted); margin-top: 1px; }

    .post-content {
      font-size: 14.5px; line-height: 1.65; color: #1E293B;
      white-space: pre-wrap; word-break: break-word; margin-bottom: 12px;
    }
    .post-media-box {
      width: 100%; border-radius: 16px; overflow: hidden; background: #000;
      margin-bottom: 12px; position: relative; border: 1px solid var(--border);
    }
    .post-img { width: 100%; max-height: 520px; object-fit: contain; display: block; cursor: zoom-in; }
    video.post-video { width: 100%; max-height: 520px; display: block; outline: none; }
    .copyright-badge {
      display: flex; align-items: center; gap: 6px; padding: 6px 14px; font-size: 11.5px;
      color: var(--text-sub); background: #FAFBFD; border-top: 1px solid #F1F5F9;
    }

    .post-actions {
      display: flex; align-items: center; justify-content: space-between;
      color: var(--text-sub); padding-top: 4px;
    }
    .action-group { display: flex; gap: 20px; }
    .btn-action {
      background: none; border: none; color: inherit; display: inline-flex;
      align-items: center; gap: 6px; font-size: 13px; font-weight: 600;
      cursor: pointer; padding: 6px 10px; border-radius: 12px; transition: 0.2s;
    }
    .btn-action:hover { background: var(--primary-soft); color: var(--primary); }
    .btn-action.liked { color: #E11D48; }
    .btn-action svg { width: 18px; height: 18px; fill: currentColor; }

    /* Explore View */
    .explore-search-wrap { padding: 16px 20px; border-bottom: 1px solid var(--border); }
    .search-input-box {
      position: relative; display: flex; align-items: center;
    }
    .search-input-box svg { position: absolute; left: 14px; width: 18px; height: 18px; fill: var(--text-muted); }
    .search-input {
      width: 100%; padding: 12px 16px 12px 42px; border-radius: 20px;
      background: var(--bg); border: 1px solid var(--border); font-size: 14.5px;
      outline: none; transition: 0.2s;
    }
    .search-input:focus { border-color: var(--primary); background: #fff; box-shadow: 0 0 0 3px rgba(0,102,255,0.1); }

    /* Chat View */
    .chat-layout { display: flex; height: calc(100vh - 60px); }
    .chat-conv-list { width: 40%; border-right: 1px solid var(--border); overflow-y: auto; }
    .chat-conv-item {
      display: flex; align-items: center; gap: 12px; padding: 14px 16px;
      border-bottom: 1px solid #F1F5F9; cursor: pointer; transition: 0.15s;
    }
    .chat-conv-item:hover, .chat-conv-item.active { background: var(--primary-soft); }
    .chat-room { flex: 1; display: flex; flex-direction: column; }
    .chat-room-header {
      padding: 12px 16px; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; gap: 10px;
    }
    .chat-messages-stream { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
    .msg-bubble {
      max-width: 75%; padding: 10px 14px; border-radius: 18px; font-size: 14px;
      line-height: 1.5; word-break: break-word;
    }
    .msg-bubble.mine { align-self: flex-end; background: var(--primary); color: #fff; border-bottom-right-radius: 4px; }
    .msg-bubble.theirs { align-self: flex-start; background: #F1F5F9; color: var(--text); border-bottom-left-radius: 4px; }
    .chat-input-bar {
      padding: 12px 16px; border-top: 1px solid var(--border);
      display: flex; gap: 10px; align-items: center;
    }
    .chat-text-input {
      flex: 1; padding: 10px 16px; border-radius: 20px; border: 1px solid var(--border);
      outline: none; font-size: 14px;
    }
    .btn-send-msg {
      background: var(--primary); color: #fff; border: none; padding: 10px 16px;
      border-radius: 20px; font-weight: 700; cursor: pointer;
    }

    /* Profile View */
    .profile-cover { height: 140px; background: linear-gradient(135deg, #0066FF, #38BDF8, #FFB800); }
    .profile-details { padding: 0 20px 20px 20px; position: relative; border-bottom: 1px solid var(--border); }
    .profile-avatar-wrap {
      width: 86px; height: 86px; border-radius: 50%; border: 4px solid #fff;
      overflow: hidden; margin-top: -43px; margin-bottom: 12px; background: #fff;
      box-shadow: 0 4px 14px rgba(0,0,0,0.1);
    }
    .profile-avatar-img { width: 100%; height: 100%; object-fit: cover; }
    .profile-name-row { display: flex; align-items: center; justify-content: space-between; }
    .profile-name { font-size: 20px; font-weight: 800; color: var(--text); }
    .profile-user-tag { font-size: 13.5px; color: var(--text-muted); margin-bottom: 10px; }
    .profile-bio { font-size: 14px; color: var(--text-sub); line-height: 1.6; margin-bottom: 14px; }
    .btn-edit-profile {
      padding: 8px 18px; border-radius: 20px; border: 1px solid var(--border);
      background: #fff; font-size: 13px; font-weight: 700; cursor: pointer;
    }

    /* Mobile Bottom Navigation Bar (Screens < 1024px) */
    .mobile-bottom-nav {
      display: none; position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
      background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px);
      border-top: 1px solid var(--border); height: 60px;
      justify-content: space-around; align-items: center;
    }
    .mobile-nav-btn {
      display: flex; flex-direction: column; align-items: center; gap: 3px;
      color: var(--text-muted); text-decoration: none; font-size: 10px; font-weight: 700;
      background: none; border: none; cursor: pointer;
    }
    .mobile-nav-btn.active { color: var(--primary); }
    .mobile-nav-btn svg { width: 22px; height: 22px; fill: currentColor; }

    /* Modals */
    .modal-backdrop {
      position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(6px); z-index: 200; display: none;
      align-items: center; justify-content: center; padding: 20px;
    }
    .modal-card {
      background: #FFFFFF; border-radius: 24px; max-width: 500px; width: 100%;
      padding: 24px; box-shadow: var(--shadow-md); max-height: 90vh; overflow-y: auto;
    }
    .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
    .modal-title { font-size: 18px; font-weight: 800; }
    .btn-close { background: none; border: none; font-size: 20px; cursor: pointer; color: var(--text-muted); }
    .form-group { margin-bottom: 16px; }
    .form-label { display: block; font-size: 13px; font-weight: 700; margin-bottom: 6px; }
    .form-input {
      width: 100%; padding: 12px 16px; border-radius: 14px; border: 1px solid var(--border);
      font-size: 14px; outline: none;
    }
    .form-input:focus { border-color: var(--primary); }
    .btn-submit {
      width: 100%; padding: 13px; border-radius: 14px; background: var(--primary);
      color: #fff; font-size: 14.5px; font-weight: 700; border: none; cursor: pointer;
    }

    @media (max-width: 1024px) {
      .sidebar-left, .sidebar-right { display: none; }
      .main-center { max-width: 100%; border-right: none; }
      .mobile-bottom-nav { display: flex; }
      .mobile-logo-header { display: flex; }
    }
  </style>
</head>
<body>
  <div class="app-layout">
    <!-- Left Navigation Rail (Desktop) -->
    <aside class="sidebar-left">
      <div>
        <a href="/" class="brand-link">
          <img src="https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png" alt="Dorabox" class="brand-logo">
          <span class="brand-title">Dorabox<span>.</span></span>
        </a>

        <nav class="nav-list">
          <button class="nav-btn active" onclick="switchTab('feed')" id="nav-btn-feed">
            <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            <span>Bảng tin</span>
          </button>
          <button class="nav-btn" onclick="switchTab('explore')" id="nav-btn-explore">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
            <span>Khám phá</span>
          </button>
          <button class="nav-btn" onclick="switchTab('chat')" id="nav-btn-chat">
            <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
            <span>Tin nhắn</span>
          </button>
          <button class="nav-btn" onclick="switchTab('profile')" id="nav-btn-profile">
            <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            <span>Hồ sơ</span>
          </button>
        </nav>

        <button class="btn-side-post" onclick="openCreatePostModal()">
          <span>✏️ Đăng bài mới</span>
        </button>
      </div>

      <!-- User Auth State Pill -->
      <div id="desktopUserPill" style="display:none;" class="user-pill-bottom">
        <div class="user-pill-info" onclick="switchTab('profile')">
          <img id="pillAvatar" src="https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png" class="user-pill-avatar" alt="User">
          <div style="min-width:0;">
            <div id="pillName" class="user-pill-name">Người dùng</div>
            <div id="pillUsername" class="user-pill-tag">@user</div>
          </div>
        </div>
        <button class="btn-pill-logout" onclick="handleLogout()" title="Đăng xuất">
          <svg style="width:18px; height:18px; fill:currentColor;" viewBox="0 0 24 24"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
        </button>
      </div>

      <div id="desktopLoginPrompt">
        <button class="btn-submit" onclick="openAuthModal()" style="padding:10px;">Đăng nhập / Đăng ký</button>
      </div>
    </aside>

    <!-- Center Main Column -->
    <main class="main-center">
      <!-- Top Sticky Bar -->
      <div class="top-bar-sticky">
        <a href="/" class="mobile-logo-header">
          <img src="https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png" alt="Dorabox" class="mobile-logo-img">
          <span style="font-weight:800; font-size:17px; color:var(--primary);">Dorabox</span>
        </a>
        <span id="topBarTitle" class="top-bar-title">Bảng tin</span>
        <div style="display:flex; align-items:center; gap:8px;">
          <button id="mobileBtnAuth" class="btn-action" onclick="openAuthModal()" style="font-size:12px; padding:6px 12px; background:var(--primary-soft); color:var(--primary);">Đăng nhập</button>
          <button class="btn-action" onclick="openCreatePostModal()" style="background:var(--primary); color:#fff; border-radius:50%; width:34px; height:34px; padding:0; display:flex; align-items:center; justify-content:center;">＋</button>
        </div>
      </div>

      <!-- 1. FEED VIEW -->
      <section id="view-feed" class="app-view active">
        <!-- D-Notes Scroller -->
        <div id="dNotesContainer" class="d-notes-scroller">
          <div class="d-note-item">
            <div class="d-note-bubble">Dorabox 3.0 🚀</div>
            <div class="d-note-avatar-box">
              <div class="d-note-avatar-inner">
                <img src="https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png?t=1792690365146" style="width:100%; height:100%; object-fit:cover;" alt="Dorabox">
              </div>
            </div>
            <span>Dorabox</span>
          </div>
          <div class="d-note-item">
            <div class="d-note-bubble">Creator Tips 💡</div>
            <div class="d-note-avatar-box gold">
              <div class="d-note-avatar-inner">
                <img src="https://doraboxcdn.zpiltk.io.vn/avatars/f56d69ef-e2d0-4bb4-b64b-47c1371f3d28/avatar_1793992083930.webp" style="width:100%; height:100%; object-fit:cover;" alt="Dorabox Creators">
              </div>
            </div>
            <span>Creators</span>
          </div>
        </div>

        <!-- Quick Post Trigger -->
        <div class="quick-post-box" onclick="openCreatePostModal()">
          <img id="quickPostAvatar" src="https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png" class="quick-post-avatar" alt="Avatar">
          <div class="quick-post-trigger">Bạn đang nghĩ gì hôm nay? Bấm để chia sẻ...</div>
        </div>

        <!-- Feed List Stream -->
        <div id="feedListContainer">
          <div style="text-align:center; padding:40px; color:var(--text-muted);">Đang tải bảng tin Dorabox...</div>
        </div>
      </section>

      <!-- 2. EXPLORE VIEW -->
      <section id="view-explore" class="app-view">
        <div class="explore-search-wrap">
          <div class="search-input-box">
            <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <input type="text" id="searchInput" class="search-input" placeholder="Tìm kiếm người dùng hoặc nội dung bài viết..." oninput="handleSearchDebounced(this.value)">
          </div>
        </div>

        <div style="padding:16px 20px;">
          <h3 style="font-size:15px; font-weight:800; margin-bottom:12px; color:var(--text);">Tài khoản chính thức nổi bật</h3>
          <div id="exploreOaList">
            <!-- Dynamic OA list -->
          </div>
        </div>

        <div id="searchResultsContainer" style="padding:0 20px;">
          <!-- Live search results stream -->
        </div>
      </section>

      <!-- 3. CHAT VIEW -->
      <section id="view-chat" class="app-view">
        <div class="chat-layout">
          <div class="chat-conv-list" id="chatConversationsList">
            <div style="padding:14px; text-align:center; color:var(--text-muted); font-size:13px;">Đang tải hội thoại...</div>
          </div>
          <div class="chat-room" id="chatRoomArea">
            <div id="chatRoomEmpty" style="margin:auto; text-align:center; color:var(--text-muted); padding:20px;">
              <div style="font-size:36px; margin-bottom:10px;">💬</div>
              <div style="font-weight:700;">Chưa chọn cuộc trò chuyện</div>
              <div style="font-size:13px; margin-top:4px;">Chọn một tài khoản ở danh sách bên trái để nhắn tin.</div>
            </div>
            <div id="chatRoomActive" style="display:none; flex-direction:column; height:100%;">
              <div class="chat-room-header">
                <img id="chatPeerAvatar" src="" style="width:34px; height:34px; border-radius:50%; object-fit:cover;" alt="Peer">
                <div>
                  <div id="chatPeerName" style="font-size:14px; font-weight:800;">Đang kết nối...</div>
                  <div style="font-size:11px; color:#10B981;">● Trực tuyến</div>
                </div>
              </div>
              <div class="chat-messages-stream" id="chatMessagesStream"></div>
              <form class="chat-input-bar" onsubmit="handleSendChatMessage(event)">
                <input type="text" id="chatTextInput" class="chat-text-input" placeholder="Nhập tin nhắn..." autocomplete="off">
                <button type="submit" class="btn-send-msg">Gửi</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. PROFILE VIEW -->
      <section id="view-profile" class="app-view">
        <div class="profile-cover"></div>
        <div class="profile-details">
          <div class="profile-avatar-wrap">
            <img id="profileAvatarImg" src="https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png" class="profile-avatar-img" alt="Avatar">
          </div>
          <div class="profile-name-row">
            <div>
              <div style="display:flex; align-items:center; gap:6px;">
                <span id="profileDisplayName" class="profile-name">Dorabox</span>
                <span id="profileOaBadge" class="badge-oa">★ OA</span>
              </div>
              <div id="profileUsernameTag" class="profile-user-tag">@dorabox</div>
            </div>
            <button class="btn-edit-profile" onclick="openEditProfileModal()">Chỉnh sửa hồ sơ</button>
          </div>
          <p id="profileBioText" class="profile-bio">Mạng xã hội kết nối diệu kỳ, sẻ chia niềm vui!</p>
        </div>

        <div style="padding:16px 20px; font-size:15px; font-weight:800; border-bottom:1px solid var(--border);">Bài viết đã đăng</div>
        <div id="profilePostsContainer">
          <div style="text-align:center; padding:30px; color:var(--text-muted);">Đang tải bài viết của người dùng...</div>
        </div>
      </section>
    </main>

    <!-- Right Sidebar (Desktop >= 1024px) -->
    <aside class="sidebar-right">
      <!-- Card Tải App Mobile -->
      <div class="widget-card">
        <div class="widget-title">
          <span>📱</span>
          <span>Tải App Dorabox</span>
        </div>
        <p style="font-size:13.5px; color:var(--text-sub); line-height:1.5; margin-bottom:14px;">
          Trải nghiệm đầy đủ tính năng gọi thoại, video call chất lượng cao & thông báo tức thì trên điện thoại.
        </p>
        <div style="text-align:center; margin-bottom:12px;">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(apkUrl)}&color=0066FF&bgcolor=FFFFFF" style="width:130px; height:130px; border-radius:12px; border:1px solid var(--border);" alt="QR">
        </div>
        <a href="${apkUrl}" style="display:block; text-align:center; background:var(--primary); color:#fff; padding:10px; border-radius:14px; text-decoration:none; font-weight:700; font-size:13.5px;">
          Tải APK Android (${version})
        </a>
      </div>

      <!-- Card Doanh Nghiệp OA -->
      <div class="widget-card">
        <div class="widget-title">
          <span>⭐</span>
          <span>Tài khoản chính thức</span>
        </div>
        <div class="oa-suggest-item">
          <div class="oa-suggest-left" onclick="viewUserProfileByUsername('dorabox')">
            <img src="https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png?t=1792690365146" class="oa-avatar-sm" alt="Dorabox">
            <div>
              <div style="font-size:13.5px; font-weight:800;">Dorabox <span class="badge-oa">OA</span></div>
              <div style="font-size:11px; color:var(--text-muted);">@dorabox</div>
            </div>
          </div>
          <button class="btn-follow-oa" onclick="startChatWithOA('f1b9d3fc-6a20-4e56-8de5-7477c0c1a864', 'Dorabox')">Nhắn tin</button>
        </div>

        <div class="oa-suggest-item">
          <div class="oa-suggest-left" onclick="viewUserProfileByUsername('doraboxcreators')">
            <img src="https://doraboxcdn.zpiltk.io.vn/avatars/f56d69ef-e2d0-4bb4-b64b-47c1371f3d28/avatar_1793992083930.webp" class="oa-avatar-sm" alt="Creators">
            <div>
              <div style="font-size:13.5px; font-weight:800;">Creators <span class="badge-oa">OA</span></div>
              <div style="font-size:11px; color:var(--text-muted);">@doraboxcreators</div>
            </div>
          </div>
          <button class="btn-follow-oa" onclick="startChatWithOA('f56d69ef-e2d0-4bb4-b64b-47c1371f3d28', 'Dorabox Creators')">Nhắn tin</button>
        </div>
      </div>

      <!-- Footer Policy Links -->
      <div style="font-size:12px; color:var(--text-muted); line-height:1.6; text-align:center;">
        <a href="/privacy" style="color:inherit; text-decoration:none;">Quyền riêng tư</a> •
        <a href="/terms" style="color:inherit; text-decoration:none;">Điều khoản</a> •
        <a href="/" style="color:inherit; text-decoration:none;">Giới thiệu</a><br>
        © 2026 Dorabox. Tất cả quyền được bảo lưu.
      </div>
    </aside>
  </div>

  <!-- Mobile Bottom Navigation Bar -->
  <nav class="mobile-bottom-nav">
    <button class="mobile-nav-btn active" onclick="switchTab('feed')" id="m-nav-feed">
      <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
      <span>Bảng tin</span>
    </button>
    <button class="mobile-nav-btn" onclick="switchTab('explore')" id="m-nav-explore">
      <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
      <span>Khám phá</span>
    </button>
    <button class="mobile-nav-btn" onclick="switchTab('chat')" id="m-nav-chat">
      <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
      <span>Tin nhắn</span>
    </button>
    <button class="mobile-nav-btn" onclick="switchTab('profile')" id="m-nav-profile">
      <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
      <span>Hồ sơ</span>
    </button>
  </nav>

  <!-- Modal Đăng bài viết -->
  <div id="createPostModal" class="modal-backdrop" onclick="closeCreatePostModal(event)">
    <div class="modal-card">
      <div class="modal-header">
        <h3 class="modal-title">Tạo bài viết mới</h3>
        <button class="btn-close" onclick="closeCreatePostModalDirect()">✕</button>
      </div>

      <form onsubmit="handleCreatePost(event)">
        <div class="form-group">
          <textarea id="postContentInput" class="form-input" style="height:110px; resize:none;" placeholder="Bạn đang nghĩ gì hôm nay? Chia sẻ niềm vui cùng bạn bè..."></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Chọn hình ảnh đính kèm</label>
          <input type="file" id="postImageFile" accept="image/*" class="form-input" onchange="handleImageSelected(event)">
          <div id="imageUploadPreview" style="display:none; margin-top:10px; border-radius:12px; overflow:hidden;">
            <img id="imgPreviewTag" src="" style="width:100%; max-height:240px; object-fit:cover;">
          </div>
        </div>

        <div class="form-group" style="display:flex; align-items:center; gap:8px;">
          <input type="checkbox" id="postProtectCopyright" checked style="width:16px; height:16px; cursor:pointer;">
          <label for="postProtectCopyright" style="font-size:13px; font-weight:600; cursor:pointer;">🛡️ Bật chế độ bảo vệ quyền tác giả (Chống sao chép lậu)</label>
        </div>

        <button type="submit" id="btnSubmitPost" class="btn-submit">Đăng bài ngay</button>
      </form>
    </div>
  </div>

  <!-- Modal Bình luận -->
  <div id="commentsModal" class="modal-backdrop" onclick="closeCommentsModal(event)">
    <div class="modal-card">
      <div class="modal-header">
        <h3 class="modal-title">Bình luận</h3>
        <button class="btn-close" onclick="closeCommentsModalDirect()">✕</button>
      </div>
      <div id="commentsListContainer" style="max-height:300px; overflow-y:auto; margin-bottom:16px; display:flex; flex-direction:column; gap:10px;"></div>
      <form onsubmit="handleSubmitComment(event)" style="display:flex; gap:8px;">
        <input type="text" id="commentTextInput" class="form-input" placeholder="Viết bình luận văn minh..." required>
        <button type="submit" class="btn-submit" style="width:auto; padding:0 20px;">Gửi</button>
      </form>
    </div>
  </div>

  <!-- Modal Xác thực (Đăng nhập / Đăng ký) -->
  <div id="authModal" class="modal-backdrop" onclick="closeAuthModal(event)">
    <div class="modal-card">
      <div class="modal-header">
        <h3 id="authModalTitle" class="modal-title">Đăng nhập Dorabox</h3>
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

      <div style="text-align:center; margin-top:14px; font-size:13.5px; color:var(--text-sub);">
        <span id="authToggleText">Chưa có tài khoản?</span>
        <button id="authToggleBtn" onclick="toggleAuthMode()" style="background:none; border:none; color:var(--primary); font-weight:700; cursor:pointer;">Đăng ký ngay</button>
      </div>
    </div>
  </div>

  <!-- Modal Chỉnh sửa Hồ sơ -->
  <div id="editProfileModal" class="modal-backdrop" onclick="closeEditProfileModal(event)">
    <div class="modal-card">
      <div class="modal-header">
        <h3 class="modal-title">Chỉnh sửa hồ sơ</h3>
        <button class="btn-close" onclick="closeEditProfileModalDirect()">✕</button>
      </div>
      <form onsubmit="handleSaveProfile(event)">
        <div class="form-group">
          <label class="form-label">Tên hiển thị</label>
          <input type="text" id="editDisplayNameInput" class="form-input" required>
        </div>
        <div class="form-group">
          <label class="form-label">Tiểu sử (Bio)</label>
          <textarea id="editBioInput" class="form-input" style="height:80px; resize:none;"></textarea>
        </div>
        <button type="submit" id="btnSaveProfile" class="btn-submit">Lưu thay đổi</button>
      </form>
    </div>
  </div>

  <script>
    const SUPABASE_URL = '${supabaseUrl}';
    const SUPABASE_ANON_KEY = '${supabaseAnonKey}';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    let currentUser = null;
    let currentUserProfile = null;
    let isSignUpMode = false;
    let selectedImageFile = null;
    let activeCommentPostId = null;
    let activeChatPeer = null;
    let searchDebounceTimer = null;

    // Khởi tạo nền tảng
    window.addEventListener('load', async () => {
      await checkAuthSession();
      loadFeedPosts();
      loadDNotes();
      loadExploreOAs();
    });

    // Quản lý Tabs / Views
    function switchTab(tabName, param = null) {
      document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.mobile-nav-btn').forEach(b => b.classList.remove('active'));

      const targetView = document.getElementById('view-' + tabName);
      if (targetView) targetView.classList.add('active');

      const sideBtn = document.getElementById('nav-btn-' + tabName);
      if (sideBtn) sideBtn.classList.add('active');

      const mBtn = document.getElementById('m-nav-' + tabName);
      if (mBtn) mBtn.classList.add('active');

      const titles = { feed: 'Bảng tin', explore: 'Khám phá', chat: 'Tin nhắn', profile: 'Hồ sơ cá nhân' };
      document.getElementById('topBarTitle').innerText = titles[tabName] || 'Dorabox';

      if (tabName === 'profile') {
        loadUserProfile(param || (currentUser ? currentUser.id : null));
      } else if (tabName === 'chat') {
        loadConversationsList();
      }
    }

    // 1. Quản lý Phiên xác thực (Auth Session)
    async function checkAuthSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        currentUser = session.user;
        await loadMyProfile(currentUser.id);
        updateAuthUI(true);
      } else {
        updateAuthUI(false);
      }
    }

    async function loadMyProfile(userId) {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (data) {
        currentUserProfile = data;
        const avatar = data.avatar_url || 'https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png';
        document.getElementById('pillAvatar').src = avatar;
        document.getElementById('pillName').innerText = data.display_name || 'Người dùng';
        document.getElementById('pillUsername').innerText = '@' + (data.username || 'user');
        document.getElementById('quickPostAvatar').src = avatar;
      }
    }

    function updateAuthUI(isLoggedIn) {
      document.getElementById('desktopUserPill').style.display = isLoggedIn ? 'flex' : 'none';
      document.getElementById('desktopLoginPrompt').style.display = isLoggedIn ? 'none' : 'block';
      document.getElementById('mobileBtnAuth').style.display = isLoggedIn ? 'none' : 'block';
    }

    // 2. Tải bài viết Bảng tin (Feed)
    async function loadFeedPosts() {
      const container = document.getElementById('feedListContainer');
      container.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-muted);">Đang tải bảng tin...</div>';

      try {
        const { data: posts, error } = await supabase
          .from('posts')
          .select(\`
            id, content, media_urls, likes_count, comments_count,
            allow_download_images, allow_download_videos, created_at,
            author:profiles!author_id (id, username, display_name, avatar_url, is_oa)
          \`)
          .or('visibility.eq.public,visibility.is.null')
          .order('created_at', { ascending: false })
          .limit(30);

        if (error || !posts || posts.length === 0) {
          container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-muted);">Chưa có bài viết nào trên bảng tin.</div>';
          return;
        }

        container.innerHTML = posts.map(renderPostCardHtml).join('');
      } catch (e) {
        container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--danger);">Không thể tải bài viết. Vui lòng thử lại.</div>';
      }
    }

    function renderPostCardHtml(post) {
      const author = post.author || {};
      const authorName = escapeHtml(author.display_name || 'Người dùng Dorabox');
      const authorUsername = escapeHtml(author.username || 'user');
      const avatarUrl = author.avatar_url || 'https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png';
      const isOA = author.is_oa === true;
      const mediaList = Array.isArray(post.media_urls) ? post.media_urls : [];
      const imageUrls = mediaList.filter(u => !/\\.(mp4|mov|webm)/i.test(u) && !/\\.(mp3|m4a|wav)/i.test(u));
      const videoUrls = mediaList.filter(u => /\\.(mp4|mov|webm)/i.test(u));

      return \`
      <article class="post-card" id="post-\${post.id}">
        <div class="post-header">
          <img src="\${avatarUrl}" class="author-avatar" onclick="viewUserProfile('\${author.id}')" onerror="this.src='https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png'">
          <div class="author-meta">
            <div class="author-name-row">
              <span class="author-name" onclick="viewUserProfile('\${author.id}')">\${authorName}</span>
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

    // 3. Tải D-Notes
    async function loadDNotes() {
      const container = document.getElementById('dNotesContainer');
      if (!container) return;
      try {
        const { data: notes } = await supabase
          .from('user_notes')
          .select(\`id, content, mood_emoji, audio_url, audio_title, created_at, profiles!user_id(display_name, username, avatar_url, is_oa)\`)
          .gt('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false })
          .limit(10);

        if (notes && notes.length > 0) {
          container.innerHTML = notes.map(n => {
            const p = n.profiles || {};
            const avatar = p.avatar_url || 'https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png';
            const name = escapeHtml(p.display_name || p.username || 'Người dùng');
            const bubble = escapeHtml(n.audio_title ? ('🎵 ' + n.audio_title) : (n.content || (n.mood_emoji || '...')));
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

    // 4. Khám phá (Explore) & Tìm kiếm
    async function loadExploreOAs() {
      const { data: oas } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url, is_oa')
        .in('username', ['dorabox', 'doraboxcreators', 'wangliu']);

      const container = document.getElementById('exploreOaList');
      if (container && oas) {
        container.innerHTML = oas.map(oa => \`
          <div class="oa-suggest-item">
            <div class="oa-suggest-left" onclick="viewUserProfile('\${oa.id}')">
              <img src="\${oa.avatar_url || 'https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png'}" class="oa-avatar-sm">
              <div>
                <div style="font-size:13.5px; font-weight:800;">\${escapeHtml(oa.display_name)} <span class="badge-oa">★ OA</span></div>
                <div style="font-size:11.5px; color:var(--text-muted);">@\${escapeHtml(oa.username)}</div>
              </div>
            </div>
            <button class="btn-follow-oa" onclick="startChatWithOA('\${oa.id}', '\${escapeHtml(oa.display_name)}')">Nhắn tin</button>
          </div>
        \`).join('');
      }
    }

    function handleSearchDebounced(val) {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => executeSearch(val.trim()), 300);
    }

    async function executeSearch(query) {
      const container = document.getElementById('searchResultsContainer');
      if (!query) {
        container.innerHTML = '';
        return;
      }
      container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-muted);">Đang tìm kiếm...</div>';

      const { data: users } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url, is_oa')
        .or(\`display_name.ilike.%\${query}%,username.ilike.%\${query}%\`)
        .limit(6);

      const { data: posts } = await supabase
        .from('posts')
        .select('id, content, media_urls, created_at, author:profiles!author_id(display_name, username, avatar_url)')
        .ilike('content', \`%\${query}%\`)
        .limit(6);

      let html = '';
      if (users && users.length > 0) {
        html += '<h4 style="font-size:14px; margin-bottom:8px; color:var(--text-muted);">Người dùng & Trang OA</h4>';
        html += users.map(u => \`
          <div class="oa-suggest-item" onclick="viewUserProfile('\${u.id}')" style="cursor:pointer;">
            <div class="oa-suggest-left">
              <img src="\${u.avatar_url || 'https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png'}" class="oa-avatar-sm">
              <div>
                <div style="font-size:13.5px; font-weight:800;">\${escapeHtml(u.display_name)} \${u.is_oa ? '<span class=\"badge-oa\">★ OA</span>' : ''}</div>
                <div style="font-size:11.5px; color:var(--text-muted);">@\${escapeHtml(u.username)}</div>
              </div>
            </div>
          </div>
        \`).join('');
      }

      if (posts && posts.length > 0) {
        html += '<h4 style="font-size:14px; margin:16px 0 8px 0; color:var(--text-muted);">Bài viết tìm thấy</h4>';
        html += posts.map(p => \`
          <a href="/p/\${p.id}" target="_blank" style="display:block; text-decoration:none; color:inherit; padding:10px 0; border-bottom:1px solid #F1F5F9;">
            <div style="font-size:13px; font-weight:700; color:var(--primary);">\${escapeHtml(p.author?.display_name || 'Dorabox')}</div>
            <div style="font-size:13.5px; color:var(--text); margin-top:2px;">\${escapeHtml(p.content.substring(0, 100))}...</div>
          </a>
        \`).join('');
      }

      if (!html) html = '<div style="text-align:center; padding:20px; color:var(--text-muted);">Không tìm thấy kết quả nào phù hợp.</div>';
      container.innerHTML = html;
    }

    // 5. Hồ sơ cá nhân (Profile)
    async function loadUserProfile(userId) {
      if (!userId) {
        document.getElementById('profileDisplayName').innerText = 'Chưa đăng nhập';
        document.getElementById('profileUsernameTag').innerText = '@guest';
        document.getElementById('profileBioText').innerText = 'Đăng nhập để xem hồ sơ cá nhân và quản lý bài viết của bạn.';
        document.getElementById('profilePostsContainer').innerHTML = '<div style="text-align:center; padding:30px;"><button class="btn-submit" style="width:auto; padding:8px 20px;" onclick="openAuthModal()">Đăng nhập ngay</button></div>';
        return;
      }

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (profile) {
        document.getElementById('profileAvatarImg').src = profile.avatar_url || 'https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png';
        document.getElementById('profileDisplayName').innerText = profile.display_name || 'Người dùng';
        document.getElementById('profileUsernameTag').innerText = '@' + (profile.username || 'user');
        document.getElementById('profileOaBadge').style.display = profile.is_oa ? 'inline-block' : 'none';
        document.getElementById('profileBioText').innerText = profile.bio || 'Chào mừng bạn đến với trang cá nhân Dorabox!';

        // Tải bài viết của người đó
        const { data: userPosts } = await supabase
          .from('posts')
          .select('id, content, media_urls, likes_count, comments_count, created_at, allow_download_images, allow_download_videos')
          .eq('author_id', userId)
          .order('created_at', { ascending: false });

        const postsWrap = document.getElementById('profilePostsContainer');
        if (!userPosts || userPosts.length === 0) {
          postsWrap.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-muted);">Chưa có bài viết nào được đăng.</div>';
        } else {
          postsWrap.innerHTML = userPosts.map(p => {
            p.author = profile;
            return renderPostCardHtml(p);
          }).join('');
        }
      }
    }

    function viewUserProfile(userId) {
      switchTab('profile', userId);
    }

    async function viewUserProfileByUsername(username) {
      const { data } = await supabase.from('profiles').select('id').eq('username', username).maybeSingle();
      if (data) viewUserProfile(data.id);
    }

    // 6. Tin nhắn thời gian thực (Chat 1-1)
    async function loadConversationsList() {
      const list = document.getElementById('chatConversationsList');
      const { data: oas } = await supabase
        .from('profiles')
        .select('id, display_name, username, avatar_url, is_oa')
        .in('username', ['dorabox', 'doraboxcreators']);

      if (oas) {
        list.innerHTML = oas.map(oa => \`
          <div class="chat-conv-item" onclick="startChatWithOA('\${oa.id}', '\${escapeHtml(oa.display_name)}', '\${oa.avatar_url}')">
            <img src="\${oa.avatar_url}" style="width:38px; height:38px; border-radius:50%; object-fit:cover;">
            <div style="min-width:0; flex:1;">
              <div style="font-size:13.5px; font-weight:800;">\${escapeHtml(oa.display_name)} <span class="badge-oa">★ OA</span></div>
              <div style="font-size:11.5px; color:var(--text-muted); text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">Hỗ trợ & thông tin chính thức</div>
            </div>
          </div>
        \`).join('');
      }
    }

    function startChatWithOA(peerId, peerName, peerAvatar = '') {
      switchTab('chat');
      activeChatPeer = { id: peerId, name: peerName, avatar: peerAvatar };
      document.getElementById('chatRoomEmpty').style.display = 'none';
      document.getElementById('chatRoomActive').style.display = 'flex';
      document.getElementById('chatPeerAvatar').src = peerAvatar || 'https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png';
      document.getElementById('chatPeerName').innerText = peerName;

      // Mock live messages history
      const stream = document.getElementById('chatMessagesStream');
      stream.innerHTML = \`
        <div class="msg-bubble theirs">Xin chào! Chúng tôi là \${escapeHtml(peerName)}. Chúc bạn có trải nghiệm tuyệt vời trên Dorabox ✨</div>
      \`;
    }

    function handleSendChatMessage(e) {
      e.preventDefault();
      const input = document.getElementById('chatTextInput');
      const text = input.value.trim();
      if (!text) return;
      input.value = '';

      const stream = document.getElementById('chatMessagesStream');
      const myMsg = document.createElement('div');
      myMsg.className = 'msg-bubble mine';
      myMsg.innerText = text;
      stream.appendChild(myMsg);
      stream.scrollTop = stream.scrollHeight;

      // Giả lập phản hồi thông minh từ OA
      setTimeout(() => {
        const reply = document.createElement('div');
        reply.className = 'msg-bubble theirs';
        reply.innerText = 'Cảm ơn bạn đã nhắn tin! Chúng tôi đã nhận được thông điệp của bạn.';
        stream.appendChild(reply);
        stream.scrollTop = stream.scrollHeight;
      }, 1000);
    }

    // 7. Tạo bài viết & Tải ảnh lên Cloudflare R2
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
      const protect = document.getElementById('postProtectCopyright').checked;
      const btn = document.getElementById('btnSubmitPost');

      if (!content && !selectedImageFile) {
        alert('Vui lòng nhập nội dung hoặc chọn ảnh để đăng bài!');
        return;
      }

      btn.disabled = true;
      btn.innerText = 'Đang đăng bài...';
      let mediaUrls = [];

      try {
        if (selectedImageFile) {
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
          const pData = await presignedRes.json();
          if (pData.data && pData.data.uploadUrl) {
            await fetch(pData.data.uploadUrl, {
              method: 'PUT',
              headers: { 'Content-Type': selectedImageFile.type || 'image/jpeg' },
              body: selectedImageFile
            });
            mediaUrls.push(pData.data.publicUrl);
          }
        }

        await supabase.from('posts').insert({
          author_id: currentUser.id,
          content: content,
          media_urls: mediaUrls,
          visibility: 'public',
          allow_download_images: !protect,
          allow_download_videos: !protect
        });

        closeCreatePostModalDirect();
        loadFeedPosts();
      } catch (err) {
        alert('Đăng bài thất bại. Vui lòng thử lại!');
      } finally {
        btn.disabled = false;
        btn.innerText = 'Đăng bài ngay';
      }
    }

    // 8. Tương tác Thả tim & Bình luận
    async function handleLikePost(postId) {
      if (!currentUser) {
        openAuthModal();
        return;
      }
      const countSpan = document.getElementById('likes-count-' + postId);
      let count = parseInt(countSpan.innerText) || 0;
      countSpan.innerText = count + 1;

      try {
        await supabase.from('post_reactions').insert({
          post_id: postId,
          user_id: currentUser.id,
          reaction_type: 'like'
        });
      } catch (_) {}
    }

    async function openCommentsModal(postId) {
      activeCommentPostId = postId;
      document.getElementById('commentsModal').style.display = 'flex';
      const container = document.getElementById('commentsListContainer');
      container.innerHTML = '<div style="text-align:center; padding:10px; color:var(--text-muted);">Đang tải bình luận...</div>';

      const { data: comments } = await supabase
        .from('comments')
        .select('id, content, created_at, profiles(display_name, avatar_url)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (!comments || comments.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-muted); font-size:13.5px;">Chưa có bình luận nào. Hãy là người đầu tiên!</div>';
        return;
      }

      container.innerHTML = comments.map(c => \`
        <div style="display:flex; gap:10px; align-items:flex-start; padding:6px 0;">
          <img src="\${c.profiles?.avatar_url || 'https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png'}" style="width:32px; height:32px; border-radius:50%; object-fit:cover;">
          <div style="background:#F1F5F9; padding:8px 12px; border-radius:14px; font-size:13.5px;">
            <div style="font-weight:700;">\${escapeHtml(c.profiles?.display_name || 'Người dùng')}</div>
            <div>\${escapeHtml(c.content)}</div>
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

    // 9. Xác thực Đăng nhập / Đăng ký
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
                display_name: displayName || 'Người dùng Dorabox',
                username: username || ('user_' + Math.floor(Math.random() * 100000))
              }
            }
          });
          if (error) throw error;
          alert('Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.');
          toggleAuthMode();
        } else {
          let emailToLogin = identifier;
          if (!identifier.includes('@')) {
            const { data: resolved } = await supabase.rpc('get_email_by_username', { p_username: identifier });
            if (resolved) emailToLogin = resolved;
          }

          const { data, error } = await supabase.auth.signInWithPassword({
            email: emailToLogin,
            password: password
          });
          if (error) throw error;
          currentUser = data.user;
          await loadMyProfile(currentUser.id);
          updateAuthUI(true);
          closeAuthModalDirect();
          loadFeedPosts();
        }
      } catch (err) {
        alert('Lỗi: ' + (err.message || 'Xác thực không thành công'));
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

    // 10. Chỉnh sửa Hồ sơ (Profile Edit)
    function openEditProfileModal() {
      if (!currentUserProfile) return;
      document.getElementById('editDisplayNameInput').value = currentUserProfile.display_name || '';
      document.getElementById('editBioInput').value = currentUserProfile.bio || '';
      document.getElementById('editProfileModal').style.display = 'flex';
    }

    function closeEditProfileModalDirect() { document.getElementById('editProfileModal').style.display = 'none'; }
    function closeEditProfileModal(e) { if (e.target.id === 'editProfileModal') closeEditProfileModalDirect(); }

    async function handleSaveProfile(e) {
      e.preventDefault();
      const newName = document.getElementById('editDisplayNameInput').value.trim();
      const newBio = document.getElementById('editBioInput').value.trim();
      const btn = document.getElementById('btnSaveProfile');

      btn.disabled = true;
      btn.innerText = 'Đang lưu...';

      try {
        await supabase.from('profiles').update({
          display_name: newName,
          bio: newBio
        }).eq('id', currentUser.id);

        await loadMyProfile(currentUser.id);
        loadUserProfile(currentUser.id);
        closeEditProfileModalDirect();
      } catch (err) {
        alert('Lưu thay đổi thất bại. Vui lòng thử lại!');
      } finally {
        btn.disabled = false;
        btn.innerText = 'Lưu thay đổi';
      }
    }

    // Helpers
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
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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
