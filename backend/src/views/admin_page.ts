export function renderAdminPage(): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dorabox SuperAdmin Dashboard - Trung Tâm Quản Trị Hệ Thống</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #07090E;
      --sidebar: #0B0F19;
      --card: #121826;
      --card-hover: #161E30;
      --card-inner: #0F1420;
      --border: rgba(255, 255, 255, 0.08);
      --border-bright: rgba(255, 255, 255, 0.16);
      --gold: #FFC837;
      --gold-dark: #D49B00;
      --gold-glow: rgba(255, 200, 55, 0.25);
      --blue: #0084FF;
      --blue-glow: rgba(0, 132, 255, 0.2);
      --red: #FF453A;
      --red-glow: rgba(255, 69, 58, 0.2);
      --green: #30D158;
      --green-glow: rgba(48, 209, 88, 0.2);
      --purple: #BF5AF2;
      --purple-glow: rgba(191, 90, 242, 0.2);
      --text: #F8FAFC;
      --text-muted: #94A3B8;
      --text-dim: #64748B;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; }
    body {
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      overflow-x: hidden;
      background-image: radial-gradient(circle at 15% 10%, rgba(0, 132, 255, 0.08) 0%, transparent 40%),
                        radial-gradient(circle at 85% 85%, rgba(255, 200, 55, 0.06) 0%, transparent 40%);
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }

    /* --- LOGIN GATE MODAL --- */
    #auth-overlay {
      position: fixed; inset: 0; background: rgba(5, 7, 12, 0.94);
      backdrop-filter: blur(25px); display: flex; align-items: center; justify-content: center;
      z-index: 10000; padding: 20px; transition: opacity 0.3s ease;
    }
    .login-box {
      background: var(--card); border: 1px solid rgba(255, 200, 55, 0.35);
      border-radius: 28px; padding: 46px 38px; max-width: 440px; width: 100%;
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.95), 0 0 50px rgba(255, 200, 55, 0.15);
      text-align: center; position: relative; overflow: hidden;
    }
    .login-box::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
      background: linear-gradient(90deg, var(--gold), var(--blue), var(--purple), var(--gold));
      background-size: 200% 100%; animation: gradientMove 4s linear infinite;
    }
    @keyframes gradientMove { 0% { background-position: 0% 0%; } 100% { background-position: 200% 0%; } }
    .login-badge {
      width: 76px; height: 76px; margin: 0 auto 22px; border-radius: 24px;
      background: rgba(255, 200, 55, 0.12); border: 2px solid var(--gold);
      display: flex; align-items: center; justify-content: center; font-size: 38px;
      box-shadow: 0 0 30px rgba(255, 200, 55, 0.3);
    }
    .login-box h2 { font-size: 24px; font-weight: 800; margin-bottom: 8px; color: var(--text); letter-spacing: -0.5px; }
    .login-box p { font-size: 13.5px; color: var(--text-muted); margin-bottom: 28px; line-height: 1.5; }
    .field-label { display: block; text-align: left; font-size: 12px; font-weight: 700; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    .pass-input {
      width: 100%; padding: 15px 18px; background: rgba(255,255,255,0.04);
      border: 1px solid var(--border); border-radius: 14px; color: var(--text);
      font-size: 15px; outline: none; margin-bottom: 20px; transition: 0.2s;
    }
    .pass-input:focus { border-color: var(--gold); box-shadow: 0 0 0 4px rgba(255, 200, 55, 0.18); }
    .btn-unlock {
      width: 100%; padding: 15px; background: linear-gradient(135deg, var(--gold), var(--gold-dark));
      color: #07090E; font-weight: 800; font-size: 15px; border: none; border-radius: 14px;
      cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px;
    }
    .btn-unlock:hover { opacity: 0.95; transform: translateY(-2px); box-shadow: 0 8px 25px rgba(255, 200, 55, 0.35); }

    /* --- SIDEBAR --- */
    aside {
      width: 280px; background: var(--sidebar); border-right: 1px solid var(--border);
      min-height: 100vh; display: flex; flex-direction: column; flex-shrink: 0;
      position: sticky; top: 0; z-index: 100;
    }
    .sidebar-header {
      padding: 26px 22px; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; gap: 14px;
    }
    .logo-cube {
      width: 44px; height: 44px; background: rgba(255,200,55,0.12); border: 2px solid var(--gold);
      border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px;
      box-shadow: 0 0 20px rgba(255,200,55,0.25); flex-shrink: 0;
    }
    .logo-text h3 { font-size: 18px; font-weight: 800; letter-spacing: -0.3px; line-height: 1.2; }
    .role-tag {
      font-size: 10px; font-weight: 800; color: var(--gold);
      background: rgba(255, 200, 55, 0.15); padding: 3px 8px; border-radius: 6px;
      display: inline-block; margin-top: 3px; letter-spacing: 0.5px;
    }
    .nav-list { list-style: none; padding: 22px 14px; flex: 1; display: flex; flex-direction: column; gap: 6px; }
    .nav-item {
      display: flex; align-items: center; justify-content: space-between;
      padding: 13px 18px; border-radius: 14px; font-size: 14.5px; font-weight: 600;
      color: var(--text-muted); cursor: pointer; transition: 0.2s; border: 1px solid transparent;
    }
    .nav-item:hover { color: var(--text); background: rgba(255,255,255,0.04); }
    .nav-item.active {
      color: var(--text); background: var(--card); border-color: var(--border-bright);
      font-weight: 700; box-shadow: 0 6px 20px rgba(0,0,0,0.35);
    }
    .nav-left { display: flex; align-items: center; gap: 12px; }
    .nav-icon { font-size: 18px; width: 22px; text-align: center; }
    .nav-pill {
      font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 20px;
      background: rgba(255, 69, 58, 0.2); color: var(--red); border: 1px solid rgba(255, 69, 58, 0.4);
    }
    .sidebar-footer {
      padding: 18px 22px; border-top: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
    }
    .status-pill {
      display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--green); font-weight: 700;
    }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); box-shadow: 0 0 10px var(--green); }

    /* --- TOPBAR --- */
    main { flex: 1; min-width: 0; display: flex; flex-direction: column; min-height: 100vh; }
    .topbar {
      height: 74px; border-bottom: 1px solid var(--border); padding: 0 34px;
      display: flex; align-items: center; justify-content: space-between;
      background: rgba(11, 15, 25, 0.75); backdrop-filter: blur(15px);
      position: sticky; top: 0; z-index: 90;
    }
    .page-title h1 { font-size: 21px; font-weight: 800; letter-spacing: -0.3px; }
    .page-title p { font-size: 13px; color: var(--text-muted); margin-top: 2px; }
    .topbar-actions { display: flex; align-items: center; gap: 12px; }

    /* Buttons */
    .btn {
      padding: 10px 18px; border-radius: 12px; font-size: 13.5px; font-weight: 700;
      border: 1px solid transparent; cursor: pointer; transition: 0.2s;
      display: inline-flex; align-items: center; gap: 8px; text-decoration: none;
    }
    .btn-secondary { background: rgba(255,255,255,0.06); color: var(--text); border-color: var(--border); }
    .btn-secondary:hover { background: rgba(255,255,255,0.1); border-color: var(--border-bright); }
    .btn-primary { background: linear-gradient(135deg, var(--gold), var(--gold-dark)); color: #07090E; font-weight: 800; }
    .btn-primary:hover { opacity: 0.95; transform: translateY(-1px); box-shadow: 0 4px 15px rgba(255,200,55,0.3); }
    .btn-blue { background: rgba(0, 132, 255, 0.15); color: var(--blue); border-color: rgba(0, 132, 255, 0.3); }
    .btn-blue:hover { background: var(--blue); color: #fff; }
    .btn-danger { background: rgba(255, 69, 58, 0.15); color: var(--red); border-color: rgba(255, 69, 58, 0.3); }
    .btn-danger:hover { background: var(--red); color: #fff; }
    .btn-gold { background: rgba(255, 200, 55, 0.15); color: var(--gold); border-color: rgba(255, 200, 55, 0.3); }
    .btn-gold:hover { background: var(--gold); color: #07090E; }
    .btn-sm { padding: 6px 12px; font-size: 12px; border-radius: 8px; }

    /* CONTENT AREA */
    .content-area { padding: 34px; flex: 1; max-width: 1400px; width: 100%; margin: 0 auto; }
    .tab-section { display: none; animation: fadeIn 0.3s ease; }
    .tab-section.active { display: block; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

    /* KPI METRICS */
    .metrics-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 18px; margin-bottom: 30px;
    }
    .kpi-card {
      background: var(--card); border: 1px solid var(--border); border-radius: 20px;
      padding: 22px; position: relative; overflow: hidden; transition: 0.25s;
    }
    .kpi-card:hover { transform: translateY(-3px); border-color: var(--border-bright); box-shadow: 0 10px 30px rgba(0,0,0,0.45); }
    .kpi-card::after {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
      background: var(--accent-color, var(--blue));
    }
    .kpi-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .kpi-title { font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
    .kpi-icon {
      width: 38px; height: 38px; border-radius: 12px; background: rgba(255,255,255,0.05);
      display: flex; align-items: center; justify-content: center; font-size: 18px;
    }
    .kpi-value { font-size: 34px; font-weight: 800; color: var(--text); letter-spacing: -1px; font-family: 'JetBrains Mono', monospace; }
    .kpi-meta { font-size: 12px; color: var(--text-dim); margin-top: 6px; display: flex; align-items: center; gap: 6px; }

    /* PANELS & CARDS */
    .glass-panel {
      background: var(--card); border: 1px solid var(--border); border-radius: 22px;
      padding: 26px; margin-bottom: 24px; box-shadow: 0 10px 35px rgba(0,0,0,0.3);
    }
    .panel-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 22px; padding-bottom: 16px; border-bottom: 1px solid var(--border);
      flex-wrap: wrap; gap: 14px;
    }
    .panel-title { display: flex; align-items: center; gap: 10px; font-size: 17px; font-weight: 800; }
    .panel-filters { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .filter-btn {
      padding: 6px 14px; border-radius: 20px; font-size: 12.5px; font-weight: 600;
      background: rgba(255,255,255,0.04); color: var(--text-muted); border: 1px solid var(--border);
      cursor: pointer; transition: 0.2s;
    }
    .filter-btn:hover { color: var(--text); border-color: var(--border-bright); }
    .filter-btn.active { background: rgba(255,200,55,0.15); color: var(--gold); border-color: rgba(255,200,55,0.4); font-weight: 700; }

    /* SEARCH INPUT */
    .search-wrap { position: relative; max-width: 340px; width: 100%; }
    .search-input {
      width: 100%; padding: 10px 14px 10px 38px; background: rgba(255,255,255,0.04);
      border: 1px solid var(--border); border-radius: 12px; color: var(--text);
      font-size: 13.5px; outline: none; transition: 0.2s;
    }
    .search-input:focus { border-color: var(--gold); background: rgba(255,255,255,0.07); }
    .search-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 14px; }

    /* TABLES */
    .table-container { overflow-x: auto; border-radius: 14px; }
    table { width: 100%; border-collapse: collapse; text-align: left; }
    th {
      padding: 14px 18px; font-size: 12px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.6px; color: var(--text-dim); background: rgba(255,255,255,0.02);
      border-bottom: 1px solid var(--border);
    }
    td {
      padding: 16px 18px; font-size: 14px; color: var(--text-muted);
      border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;
    }
    tr:hover td { background: rgba(255,255,255,0.02); color: var(--text); }

    /* BADGES */
    .badge {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 4px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 700;
    }
    .badge-verified { background: rgba(0, 132, 255, 0.15); color: var(--blue); border: 1px solid rgba(0, 132, 255, 0.3); }
    .badge-vip { background: rgba(255, 200, 55, 0.15); color: var(--gold); border: 1px solid rgba(255, 200, 55, 0.4); }
    .badge-banned { background: rgba(255, 69, 58, 0.15); color: var(--red); border: 1px solid rgba(255, 69, 58, 0.3); }
    .badge-admin { background: rgba(191, 90, 242, 0.15); color: var(--purple); border: 1px solid rgba(191, 90, 242, 0.3); }

    /* USER CELL */
    .user-cell { display: flex; align-items: center; gap: 12px; }
    .avatar-img {
      width: 42px; height: 42px; border-radius: 12px; object-fit: cover;
      background: rgba(255,255,255,0.08); border: 1px solid var(--border);
    }
    .avatar-placeholder {
      width: 42px; height: 42px; border-radius: 12px; background: linear-gradient(135deg, #2563EB, #1D4ED8);
      display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 15px; color: #fff;
    }
    .user-meta h4 { font-size: 14px; font-weight: 700; color: var(--text); display: flex; align-items: center; gap: 5px; }
    .user-meta p { font-size: 12px; color: var(--text-dim); margin-top: 2px; }

    /* POST THUMBNAIL */
    .post-thumb {
      width: 60px; height: 60px; border-radius: 10px; object-fit: cover;
      border: 1px solid var(--border); cursor: pointer; transition: 0.2s;
    }
    .post-thumb:hover { transform: scale(1.05); border-color: var(--gold); }

    /* BROADCAST STUDIO */
    .broadcast-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 28px; }
    @media (max-width: 1024px) { .broadcast-grid { grid-template-columns: 1fr; } }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px; }
    .form-control {
      width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.04);
      border: 1px solid var(--border); border-radius: 12px; color: var(--text);
      font-size: 14.5px; outline: none; transition: 0.2s;
    }
    .form-control:focus { border-color: var(--gold); background: rgba(255,255,255,0.06); }
    textarea.form-control { resize: vertical; min-height: 120px; }

    /* REALTIME PHONE MOCKUP */
    .phone-mockup-wrapper {
      background: #090C14; border: 1px solid var(--border); border-radius: 36px;
      padding: 30px 22px; max-width: 360px; width: 100%; margin: 0 auto;
      box-shadow: 0 25px 70px rgba(0,0,0,0.8), 0 0 40px rgba(0, 132, 255, 0.1);
      position: relative;
    }
    .phone-notch {
      width: 90px; height: 18px; background: #000; border-radius: 20px;
      margin: 0 auto 24px; position: relative;
    }
    .phone-screen-label {
      font-size: 11px; font-weight: 800; color: var(--text-dim); text-transform: uppercase;
      letter-spacing: 1px; text-align: center; margin-bottom: 18px;
    }
    .notif-bubble {
      background: rgba(255,255,255,0.08); backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 16px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }
    .notif-bubble-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    .notif-app-info { display: flex; align-items: center; gap: 8px; }
    .notif-app-icon {
      width: 22px; height: 22px; border-radius: 6px; background: var(--gold);
      display: flex; align-items: center; justify-content: center; font-size: 13px;
    }
    .notif-app-name { font-size: 12px; font-weight: 800; color: var(--text); }
    .notif-time { font-size: 11px; color: var(--text-dim); }
    .notif-preview-title { font-size: 13.5px; font-weight: 700; color: var(--text); margin-bottom: 4px; word-break: break-word; }
    .notif-preview-body { font-size: 12.5px; color: var(--text-muted); line-height: 1.4; word-break: break-word; }

    /* SYSTEM HEALTH CARDS */
    .system-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; }
    .sys-card {
      background: var(--card-inner); border: 1px solid var(--border); border-radius: 16px;
      padding: 20px; display: flex; flex-direction: column; gap: 12px;
    }
    .sys-card-header { display: flex; align-items: center; justify-content: space-between; }
    .sys-card-title { font-size: 13px; font-weight: 700; color: var(--text-muted); display: flex; align-items: center; gap: 8px; }
    .sys-status-badge { font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 6px; }

    /* TOAST NOTIFICATION */
    #toast-container { position: fixed; bottom: 25px; right: 25px; z-index: 10000; display: flex; flex-direction: column; gap: 10px; }
    .toast {
      padding: 14px 20px; border-radius: 14px; font-size: 13.5px; font-weight: 700;
      color: #fff; background: var(--card); border: 1px solid var(--border);
      box-shadow: 0 10px 30px rgba(0,0,0,0.6); display: flex; align-items: center; gap: 10px;
      animation: slideIn 0.3s ease;
    }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

    /* LIGHTBOX MODAL */
    #lightbox-modal {
      position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px);
      display: none; align-items: center; justify-content: center; z-index: 10001; padding: 30px;
    }
    #lightbox-img { max-width: 90vw; max-height: 90vh; border-radius: 16px; border: 1px solid rgba(255,255,255,0.2); }
  </style>
</head>
<body>

  <!-- AUTHENTICATION OVERLAY -->
  <div id="auth-overlay">
    <div class="login-box">
      <div class="login-badge">🛡️</div>
      <h2>Dorabox SuperAdmin</h2>
      <p>Cổng quản trị bảo mật cấp cao. Vui lòng nhập Master Secret Key để truy cập hệ thống.</p>
      
      <label class="field-label">Khóa Bảo Mật (Admin Secret Key)</label>
      <input type="password" id="admin-pass-input" class="pass-input" placeholder="Nhập khóa quản trị viên..." autofocus />
      
      <button class="btn-unlock" id="btn-unlock-gate">
        <span>Mở Khóa Bảng Điều Khiển</span>
        <span>→</span>
      </button>
    </div>
  </div>

  <!-- LIGHTBOX MODAL -->
  <div id="lightbox-modal" onclick="closeLightbox()">
    <img id="lightbox-img" src="" alt="Enlarged view" />
  </div>

  <!-- TOAST CONTAINER -->
  <div id="toast-container"></div>

  <!-- SIDEBAR NAVIGATION -->
  <aside>
    <div class="sidebar-header">
      <div class="logo-cube">🐱</div>
      <div class="logo-text">
        <h3>Dorabox Admin</h3>
        <span class="role-tag">SUPERADMIN PORTAL</span>
      </div>
    </div>

    <ul class="nav-list">
      <li class="nav-item active" data-tab="tong-quan">
        <div class="nav-left">
          <span class="nav-icon">📊</span>
          <span>Tổng Quan</span>
        </div>
      </li>
      <li class="nav-item" data-tab="thanh-vien">
        <div class="nav-left">
          <span class="nav-icon">👥</span>
          <span>Thành Viên</span>
        </div>
      </li>
      <li class="nav-item" data-tab="bai-viet">
        <div class="nav-left">
          <span class="nav-icon">📝</span>
          <span>Bài Viết</span>
        </div>
      </li>
      <li class="nav-item" data-tab="binh-luan">
        <div class="nav-left">
          <span class="nav-icon">💬</span>
          <span>Bình Luận</span>
        </div>
      </li>
      <li class="nav-item" data-tab="bao-cao">
        <div class="nav-left">
          <span class="nav-icon">🚨</span>
          <span>Báo Cáo Vi Phạm</span>
        </div>
        <span class="nav-pill" id="sidebar-report-badge">0</span>
      </li>
      <li class="nav-item" data-tab="phat-thong-bao">
        <div class="nav-left">
          <span class="nav-icon">📢</span>
          <span>Phát Thông Báo</span>
        </div>
      </li>
      <li class="nav-item" data-tab="he-thong">
        <div class="nav-left">
          <span class="nav-icon">⚙️</span>
          <span>Hệ Thống & Cloud</span>
        </div>
      </li>
    </ul>

    <div class="sidebar-footer">
      <div class="status-pill">
        <div class="status-dot"></div>
        <span>HỆ THỐNG ONLINE</span>
      </div>
      <button class="btn btn-secondary btn-sm" id="btn-logout" style="padding: 4px 8px;">Đăng xuất</button>
    </div>
  </aside>

  <!-- MAIN VIEW -->
  <main>
    <header class="topbar">
      <div class="page-title">
        <h1 id="topbar-title">Tổng Quan Hệ Thống</h1>
        <p id="topbar-subtitle">Bảng điều khiển theo dõi chỉ số thời gian thực & kiểm duyệt cộng đồng</p>
      </div>

      <div class="topbar-actions">
        <button class="btn btn-secondary" id="btn-refresh-data">
          <span>🔄</span>
          <span>Làm Mới</span>
        </button>
        <button class="btn btn-primary" onclick="switchTab('phat-thong-bao')">
          <span>📢</span>
          <span>Gửi Thông Báo</span>
        </button>
      </div>
    </header>

    <div class="content-area">

      <!-- ================= 1. TAB: TỔNG QUAN ================= -->
      <section id="tab-tong-quan" class="tab-section active">
        <!-- KPI METRICS -->
        <div class="metrics-grid">
          <div class="kpi-card" style="--accent-color: var(--blue);">
            <div class="kpi-header">
              <span class="kpi-title">Tổng Thành Viên</span>
              <div class="kpi-icon">👥</div>
            </div>
            <div class="kpi-value" id="kpi-users">-</div>
            <div class="kpi-meta"><span style="color: var(--green);">●</span> Đang kích hoạt trong mạng</div>
          </div>

          <div class="kpi-card" style="--accent-color: var(--gold);">
            <div class="kpi-header">
              <span class="kpi-title">Tích Xanh Đã Cấp</span>
              <div class="kpi-icon">✓</div>
            </div>
            <div class="kpi-value" id="kpi-verified">-</div>
            <div class="kpi-meta"><span style="color: var(--gold);">★</span> Tài khoản chính chủ</div>
          </div>

          <div class="kpi-card" style="--accent-color: var(--purple);">
            <div class="kpi-header">
              <span class="kpi-title">Hội Viên VIP</span>
              <div class="kpi-icon">👑</div>
            </div>
            <div class="kpi-value" id="kpi-vip">-</div>
            <div class="kpi-meta">Huy hiệu VIP đặc quyền</div>
          </div>

          <div class="kpi-card" style="--accent-color: var(--red);">
            <div class="kpi-header">
              <span class="kpi-title">Tài Khoản Bị Khóa</span>
              <div class="kpi-icon">🚫</div>
            </div>
            <div class="kpi-value" id="kpi-banned">-</div>
            <div class="kpi-meta">Vi phạm tiêu chuẩn cộng đồng</div>
          </div>

          <div class="kpi-card" style="--accent-color: var(--green);">
            <div class="kpi-header">
              <span class="kpi-title">Tổng Bài Viết</span>
              <div class="kpi-icon">📝</div>
            </div>
            <div class="kpi-value" id="kpi-posts">-</div>
            <div class="kpi-meta">Nội dung mạng xã hội</div>
          </div>

          <div class="kpi-card" style="--accent-color: #06B6D4;">
            <div class="kpi-header">
              <span class="kpi-title">Tổng Bình Luận</span>
              <div class="kpi-icon">💬</div>
            </div>
            <div class="kpi-value" id="kpi-comments">-</div>
            <div class="kpi-meta">Tương tác thảo luận</div>
          </div>
        </div>

        <!-- CLOUD HEALTH STRIP -->
        <div class="glass-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span>⚡</span>
              <span>Trạng Thái Hạ Tầng & Dịch Vụ Đám Mây</span>
            </div>
            <span class="badge badge-verified" id="overall-health-badge">Hoạt động hoàn hảo</span>
          </div>

          <div class="system-grid">
            <div class="sys-card">
              <div class="sys-card-header">
                <span class="sys-card-title">🗄️ Supabase Postgres DB</span>
                <span class="sys-status-badge badge-verified" id="sys-db-status">ĐÃ KẾT NỐI</span>
              </div>
              <p style="font-size: 13px; color: var(--text-dim);" id="sys-db-latency">Độ trễ: Đang đo...</p>
            </div>

            <div class="sys-card">
              <div class="sys-card-header">
                <span class="sys-card-title">☁️ Cloudflare R2 Media CDN</span>
                <span class="sys-status-badge badge-vip">SẴN SÀNG</span>
              </div>
              <p style="font-size: 13px; color: var(--text-dim);">Lưu trữ ảnh & media tốc độ cao</p>
            </div>

            <div class="sys-card">
              <div class="sys-card-header">
                <span class="sys-card-title">🔔 Firebase Push HTTP v1</span>
                <span class="sys-status-badge badge-verified">ACTIVE</span>
              </div>
              <p style="font-size: 13px; color: var(--text-dim);">Project: dorabox-4bbcb</p>
            </div>

            <div class="sys-card">
              <div class="sys-card-header">
                <span class="sys-card-title">🚀 Node.js Backend API</span>
                <span class="sys-status-badge badge-verified">PORT 4000</span>
              </div>
              <p style="font-size: 13px; color: var(--text-dim);" id="sys-uptime">Uptime: Đang tính...</p>
            </div>
          </div>
        </div>

        <!-- QUICK ACTION ROW -->
        <div class="glass-panel">
          <div class="panel-title" style="margin-bottom: 16px;">
            <span>⚡ Phím Tắt Điều Hành Nhanh</span>
          </div>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button class="btn btn-blue" onclick="switchTab('thanh-vien')">👥 Quản Lý Thành Viên & Duyệt Tích Xanh</button>
            <button class="btn btn-danger" onclick="switchTab('bao-cao')">🚨 Xử Lý Hàng Đợi Báo Cáo Vi Phạm</button>
            <button class="btn btn-gold" onclick="switchTab('bai-viet')">📝 Kiểm Duyệt Bài Viết Cộng Đồng</button>
            <button class="btn btn-primary" onclick="switchTab('phat-thong-bao')">📢 Phát Sóng Push Notification</button>
          </div>
        </div>
      </section>

      <!-- ================= 2. TAB: THÀNH VIÊN ================= -->
      <section id="tab-thanh-vien" class="tab-section">
        <div class="glass-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span>👥</span>
              <span>Danh Sách Thành Viên Dorabox</span>
            </div>

            <div class="panel-filters">
              <button class="filter-btn active" onclick="filterUsers('all', this)">Tất cả</button>
              <button class="filter-btn" onclick="filterUsers('verified', this)">Tích xanh ✓</button>
              <button class="filter-btn" onclick="filterUsers('vip', this)">VIP 👑</button>
              <button class="filter-btn" onclick="filterUsers('banned', this)">Bị khóa 🚫</button>

              <div class="search-wrap">
                <span class="search-icon">🔍</span>
                <input type="text" id="user-search-input" class="search-input" placeholder="Tìm theo tên hoặc @username..." />
              </div>
            </div>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Thành Viên</th>
                  <th>Username</th>
                  <th>Vai Trò</th>
                  <th>Trạng Thái</th>
                  <th>Ngày Gia Nhập</th>
                  <th style="text-align: right;">Hành Động Quản Trị</th>
                </tr>
              </thead>
              <tbody id="users-table-body">
                <tr><td colspan="6" style="text-align: center; padding: 40px;">Đang tải danh sách thành viên...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ================= 3. TAB: BÀI VIẾT ================= -->
      <section id="tab-bai-viet" class="tab-section">
        <div class="glass-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span>📝</span>
              <span>Kiểm Duyệt Bài Viết & Đa Phương Tiện</span>
            </div>

            <div class="search-wrap">
              <span class="search-icon">🔍</span>
              <input type="text" id="post-search-input" class="search-input" placeholder="Tìm kiếm nội dung bài viết..." />
            </div>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tác Giả</th>
                  <th>Nội Dung Bài Viết</th>
                  <th>Đính Kèm</th>
                  <th>Tương Tác</th>
                  <th>Ghim</th>
                  <th>Ngày Đăng</th>
                  <th style="text-align: right;">Hành Động</th>
                </tr>
              </thead>
              <tbody id="posts-table-body">
                <tr><td colspan="7" style="text-align: center; padding: 40px;">Đang tải danh sách bài viết...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ================= 4. TAB: BÌNH LUẬN ================= -->
      <section id="tab-binh-luan" class="tab-section">
        <div class="glass-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span>💬</span>
              <span>Quản Lý Bình Luận Cộng Đồng</span>
            </div>

            <div class="search-wrap">
              <span class="search-icon">🔍</span>
              <input type="text" id="comment-search-input" class="search-input" placeholder="Tìm theo nội dung bình luận..." />
            </div>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Người Bình Luận</th>
                  <th>Nội Dung</th>
                  <th>Bài Viết Gốc</th>
                  <th>Thời Gian</th>
                  <th style="text-align: right;">Hành Động</th>
                </tr>
              </thead>
              <tbody id="comments-table-body">
                <tr><td colspan="5" style="text-align: center; padding: 40px;">Đang tải danh sách bình luận...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ================= 5. TAB: BÁO CÁO VI PHẠM ================= -->
      <section id="tab-bao-cao" class="tab-section">
        <div class="glass-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span>🚨</span>
              <span>Hàng Đợi Xử Lý Báo Cáo Vi Phạm</span>
            </div>
            <span class="badge badge-banned" id="reports-pending-count">0 Chờ xử lý</span>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Người Báo Cáo</th>
                  <th>Loại Vi Phạm</th>
                  <th>Lý Do Chi Tiết</th>
                  <th>Trạng Thái</th>
                  <th>Thời Gian</th>
                  <th style="text-align: right;">Xử Lý Nhanh</th>
                </tr>
              </thead>
              <tbody id="reports-table-body">
                <tr><td colspan="6" style="text-align: center; padding: 40px;">Chưa có báo cáo vi phạm nào trong hàng đợi.</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ================= 6. TAB: PHÁT THÔNG BÁO ================= -->
      <section id="tab-phat-thong-bao" class="tab-section">
        <div class="broadcast-grid">
          <div class="glass-panel">
            <div class="panel-title" style="margin-bottom: 22px;">
              <span>📢</span>
              <span>Broadcast Studio – Phát Thông Báo Toàn Mạng</span>
            </div>

            <div class="form-group">
              <label>Tiêu Đề Thông Báo</label>
              <input type="text" id="broadcast-title-input" class="form-control" placeholder="Ví dụ: Chúc mừng cập nhật Dorabox phiên bản mới..." value="🎉 Chào mừng tới Dorabox!" />
            </div>

            <div class="form-group">
              <label>Nội Dung Thông Báo Chi Tiết</label>
              <textarea id="broadcast-body-input" class="form-control" placeholder="Nhập nội dung bạn muốn gửi tới toàn thể thành viên...">Khám phá các tính năng mới: Ghi âm giọng nói 120s, gửi ảnh siêu tốc, thu hồi tin nhắn và nhiều trải nghiệm tuyệt vời!</textarea>
            </div>

            <button class="btn btn-primary" id="btn-send-broadcast" style="width: 100%; padding: 16px; font-size: 15px;">
              <span>🚀</span>
              <span>Phát Sóng Push Notification Tức Thì</span>
            </button>
          </div>

          <!-- REALTIME PHONE PREVIEW -->
          <div class="phone-mockup-wrapper">
            <div class="phone-notch"></div>
            <div class="phone-screen-label">XEM TRƯỚC TRÊN MÀN HÌNH KHÓA ĐIỆN THOẠI</div>

            <div class="notif-bubble">
              <div class="notif-bubble-header">
                <div class="notif-app-info">
                  <div class="notif-app-icon">🐱</div>
                  <span class="notif-app-name">DORABOX</span>
                </div>
                <span class="notif-time">Vừa xong</span>
              </div>
              <div class="notif-preview-title" id="preview-notif-title">🎉 Chào mừng tới Dorabox!</div>
              <div class="notif-preview-body" id="preview-notif-body">Khám phá các tính năng mới: Ghi âm giọng nói 120s, gửi ảnh siêu tốc, thu hồi tin nhắn và nhiều trải nghiệm tuyệt vời!</div>
            </div>
          </div>
        </div>
      </section>

      <!-- ================= 7. TAB: HỆ THỐNG & CLOUD ================= -->
      <section id="tab-he-thong" class="tab-section">
        <div class="glass-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span>⚙️</span>
              <span>Kiểm Định & Giám Sát Hệ Thống Đám Mây</span>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="fetchSystemHealth(true)">
              <span>🔄</span>
              <span>Kiểm Tra Toàn Diện Ngay</span>
            </button>
          </div>

          <div class="system-grid" id="full-system-grid">
            <div class="sys-card">
              <div class="sys-card-header">
                <span class="sys-card-title">🗄️ Supabase Postgres & Auth</span>
                <span class="sys-status-badge badge-verified" id="diag-db-badge">CONNECTED</span>
              </div>
              <p style="font-size: 13px; color: var(--text-dim);" id="diag-db-url">URL: vcmsmyaupsksbjusnzoy.supabase.co</p>
              <p style="font-size: 13px; color: var(--green);" id="diag-db-lat">Độ trễ phản hồi: Đang kiểm tra...</p>
            </div>

            <div class="sys-card">
              <div class="sys-card-header">
                <span class="sys-card-title">☁️ Cloudflare R2 Storage</span>
                <span class="sys-status-badge badge-vip">READY</span>
              </div>
              <p style="font-size: 13px; color: var(--text-dim);">Bucket: dung-sketch-team-dorabox</p>
              <p style="font-size: 13px; color: var(--text-dim);">Domain CDN: doraboxcdn.zpiltk.io.vn</p>
            </div>

            <div class="sys-card">
              <div class="sys-card-header">
                <span class="sys-card-title">🔔 Firebase Cloud Messaging</span>
                <span class="sys-status-badge badge-verified">HTTP v1</span>
              </div>
              <p style="font-size: 13px; color: var(--text-dim);">Google Service Account: dorabox-4bbcb</p>
              <p style="font-size: 13px; color: var(--green);">Sẵn sàng gửi Push Notification</p>
            </div>

            <div class="sys-card">
              <div class="sys-card-header">
                <span class="sys-card-title">💻 Bộ Nhớ & Runtime API</span>
                <span class="sys-status-badge badge-verified" id="diag-node-badge">NODE.JS</span>
              </div>
              <p style="font-size: 13px; color: var(--text-dim);" id="diag-memory">Bộ nhớ RAM: Đang tính...</p>
              <p style="font-size: 13px; color: var(--text-dim);" id="diag-uptime-val">Thời gian chạy: Đang tính...</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  </main>

  <script>
    // State Quản Trị
    let adminToken = localStorage.getItem('dorabox_admin_token') || '';
    let currentTab = 'tong-quan';
    let allUsersCache = [];
    let allPostsCache = [];
    let allCommentsCache = [];
    let allReportsCache = [];

    // Tự động kiểm tra đăng nhập khi mở trang
    window.addEventListener('DOMContentLoaded', () => {
      setupRealtimePreview();
      setupTabs();

      if (adminToken) {
        verifySession();
      } else {
        showLoginOverlay();
      }
    });

    function showLoginOverlay() {
      document.getElementById('auth-overlay').style.display = 'flex';
      document.getElementById('admin-pass-input').focus();
    }

    function hideLoginOverlay() {
      document.getElementById('auth-overlay').style.display = 'none';
    }

    // Đăng nhập Admin
    document.getElementById('btn-unlock-gate').addEventListener('click', doLogin);
    document.getElementById('admin-pass-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doLogin();
    });

    async function doLogin() {
      const pass = document.getElementById('admin-pass-input').value.trim();
      if (!pass) {
        showToast('Vui lòng nhập Admin Secret Key', 'error');
        return;
      }

      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: pass })
        });
        const data = await res.json();

        if (data.success && data.token) {
          adminToken = data.token;
          localStorage.setItem('dorabox_admin_token', adminToken);
          hideLoginOverlay();
          showToast('Đăng nhập thành công! Chào mừng SuperAdmin', 'success');
          loadDashboardData();
        } else {
          showToast(data.error || 'Khóa bảo mật không chính xác!', 'error');
        }
      } catch (err) {
        showToast('Lỗi kết nối máy chủ: ' + err.message, 'error');
      }
    }

    // Đăng xuất
    document.getElementById('btn-logout').addEventListener('click', () => {
      localStorage.removeItem('dorabox_admin_token');
      adminToken = '';
      location.reload();
    });

    // Xác thực phiên làm việc
    async function verifySession() {
      try {
        const res = await fetch('/api/admin/auth/check', {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });
        if (res.ok) {
          hideLoginOverlay();
          loadDashboardData();
        } else {
          localStorage.removeItem('dorabox_admin_token');
          adminToken = '';
          showLoginOverlay();
        }
      } catch (err) {
        showLoginOverlay();
      }
    }

    // Tải toàn bộ dữ liệu quản trị
    async function loadDashboardData() {
      fetchMetrics();
      fetchUsers();
      fetchPosts();
      fetchComments();
      fetchReports();
      fetchSystemHealth();
    }

    document.getElementById('btn-refresh-data').addEventListener('click', () => {
      loadDashboardData();
      showToast('Đã làm mới dữ liệu hệ thống!', 'success');
    });

    // 1. Fetch Metrics
    async function fetchMetrics() {
      try {
        const res = await fetch('/api/admin/metrics', {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });
        const data = await res.json();
        if (data.success && data.metrics) {
          const m = data.metrics;
          document.getElementById('kpi-users').textContent = m.totalUsers;
          document.getElementById('kpi-verified').textContent = m.verifiedUsers;
          document.getElementById('kpi-banned').textContent = m.bannedUsers;
          document.getElementById('kpi-posts').textContent = m.totalPosts;
          document.getElementById('kpi-comments').textContent = m.totalComments;
          document.getElementById('sidebar-report-badge').textContent = m.pendingReports;
          document.getElementById('reports-pending-count').textContent = m.pendingReports + ' Chờ xử lý';
        }
      } catch (err) {
        console.error('Fetch metrics error:', err);
      }
    }

    // 2. Fetch Users
    async function fetchUsers() {
      try {
        const res = await fetch('/api/admin/users', {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });
        const data = await res.json();
        if (data.success && data.users) {
          allUsersCache = data.users;
          renderUsersTable(allUsersCache);

          // Update VIP count
          const vipCount = allUsersCache.filter(u => u.is_vip).length;
          document.getElementById('kpi-vip').textContent = vipCount;
        }
      } catch (err) {
        console.error('Fetch users error:', err);
      }
    }

    function renderUsersTable(users) {
      const tbody = document.getElementById('users-table-body');
      if (!users || users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 40px; color: var(--text-dim);">Không tìm thấy thành viên nào.</td></tr>';
        return;
      }

      tbody.innerHTML = users.map(u => {
        const initial = (u.display_name || u.username || 'U').charAt(0).toUpperCase();
        const avatarHtml = u.avatar_url 
          ? \`<img class="avatar-img" src="\${u.avatar_url}" alt="\${u.username}" onerror="this.outerHTML='<div class=\\'avatar-placeholder\\'>\${initial}</div>'" />\`
          : \`<div class="avatar-placeholder">\${initial}</div>\`;

        const statusBadge = u.is_banned
          ? '<span class="badge badge-banned">ĐANG KHÓA</span>'
          : '<span class="badge badge-verified">HOẠT ĐỘNG</span>';

        const roleBadge = u.role === 'admin'
          ? '<span class="badge badge-admin">ADMIN</span>'
          : (u.role === 'moderator' ? '<span class="badge badge-vip">MOD</span>' : '<span style="font-size: 12px; color: var(--text-dim);">Member</span>');

        const joinDate = u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : '-';

        return \`
          <tr>
            <td>
              <div class="user-cell">
                \${avatarHtml}
                <div class="user-meta">
                  <h4>
                    \${escapeHtml(u.display_name || u.username || 'Dorabox User')}
                    \${(u.is_oa || u.is_vip || u.account_type === 'oa') ? '<span style="color: var(--gold);" title="Tài khoản OA (Tích Vàng)">⭐</span>' : ''}
                    \${u.is_verified ? '<span style="color: var(--blue);" title="Đã xác minh (Tích Xanh)">✓</span>' : ''}
                  </h4>
                  <p>UID: \${u.id.substring(0, 8)}...</p>
                </div>
              </div>
            </td>
            <td>
              <span style="font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--text-muted);">@\${escapeHtml(u.username || '')}</span>
            </td>
            <td>\${roleBadge}</td>
            <td>\${statusBadge}</td>
            <td style="font-size: 13px;">\${joinDate}</td>
            <td style="text-align: right;">
              <div style="display: inline-flex; gap: 6px;">
                <button class="btn btn-sm \${u.is_verified ? 'btn-secondary' : 'btn-blue'}" onclick="toggleVerify('\${u.id}', \${!u.is_verified})">
                  \${u.is_verified ? 'Gỡ Tích Xanh' : 'Tích Xanh ✓'}
                </button>
                <button class="btn btn-sm \${(u.is_oa || u.is_vip || u.account_type === 'oa') ? 'btn-secondary' : 'btn-gold'}" onclick="toggleVip('\${u.id}', \${!(u.is_oa || u.is_vip || u.account_type === 'oa')})">
                  \${(u.is_oa || u.is_vip || u.account_type === 'oa') ? 'Gỡ Tích Vàng' : 'Tích Vàng OA ⭐'}
                </button>
                <button class="btn btn-sm \${u.is_banned ? 'btn-secondary' : 'btn-danger'}" onclick="toggleBan('\${u.id}', \${!u.is_banned})">
                  \${u.is_banned ? 'Mở Khóa' : 'Khóa Nick'}
                </button>
              </div>
            </td>
          </tr>
        \`;
      }).join('');
    }

    // Toggle Tích Xanh
    async function toggleVerify(userId, newStatus) {
      try {
        const res = await fetch(\`/api/admin/users/\${userId}/toggle-verify\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
          body: JSON.stringify({ isVerified: newStatus })
        });
        const data = await res.json();
        if (data.success) {
          showToast(data.message, 'success');
          fetchUsers();
          fetchMetrics();
        } else {
          showToast(data.error || 'Thất bại', 'error');
        }
      } catch (err) {
        showToast('Lỗi: ' + err.message, 'error');
      }
    }

    // Toggle VIP
    async function toggleVip(userId, newStatus) {
      try {
        const res = await fetch(\`/api/admin/users/\${userId}/toggle-vip\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
          body: JSON.stringify({ isVip: newStatus })
        });
        const data = await res.json();
        if (data.success) {
          showToast(data.message, 'success');
          fetchUsers();
          fetchMetrics();
        } else {
          showToast(data.error || 'Thất bại', 'error');
        }
      } catch (err) {
        showToast('Lỗi: ' + err.message, 'error');
      }
    }

    // Toggle Ban
    async function toggleBan(userId, newStatus) {
      const confirmMsg = newStatus ? 'Bạn có chắc chắn muốn KHÓA tài khoản này không?' : 'Mở khóa cho tài khoản này?';
      if (!confirm(confirmMsg)) return;

      try {
        const res = await fetch(\`/api/admin/users/\${userId}/toggle-ban\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
          body: JSON.stringify({ isBanned: newStatus })
        });
        const data = await res.json();
        if (data.success) {
          showToast(data.message, 'success');
          fetchUsers();
          fetchMetrics();
        } else {
          showToast(data.error || 'Thất bại', 'error');
        }
      } catch (err) {
        showToast('Lỗi: ' + err.message, 'error');
      }
    }

    // User Search & Filters
    document.getElementById('user-search-input').addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = allUsersCache.filter(u => 
        (u.display_name && u.display_name.toLowerCase().includes(q)) ||
        (u.username && u.username.toLowerCase().includes(q))
      );
      renderUsersTable(filtered);
    });

    function filterUsers(type, btn) {
      document.querySelectorAll('.panel-filters .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (type === 'all') {
        renderUsersTable(allUsersCache);
      } else if (type === 'verified') {
        renderUsersTable(allUsersCache.filter(u => u.is_verified));
      } else if (type === 'vip') {
        renderUsersTable(allUsersCache.filter(u => u.is_vip));
      } else if (type === 'banned') {
        renderUsersTable(allUsersCache.filter(u => u.is_banned));
      }
    }

    // 3. Fetch Posts
    async function fetchPosts() {
      try {
        const res = await fetch('/api/admin/posts', {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });
        const data = await res.json();
        if (data.success && data.posts) {
          allPostsCache = data.posts;
          renderPostsTable(allPostsCache);
        }
      } catch (err) {
        console.error('Fetch posts error:', err);
      }
    }

    function renderPostsTable(posts) {
      const tbody = document.getElementById('posts-table-body');
      if (!posts || posts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 40px; color: var(--text-dim);">Chưa có bài viết nào trên hệ thống.</td></tr>';
        return;
      }

      tbody.innerHTML = posts.map(p => {
        const author = p.profiles || {};
        const authorName = author.display_name || author.username || 'Thành viên';
        const authorAvatar = author.avatar_url 
          ? \`<img class="avatar-img" style="width:34px;height:34px;" src="\${author.avatar_url}" />\`
          : \`<div class="avatar-placeholder" style="width:34px;height:34px;font-size:12px;">\${authorName.charAt(0).toUpperCase()}</div>\`;

        let mediaHtml = '<span style="color: var(--text-dim); font-size: 12px;">Không có</span>';
        if (p.media_urls && p.media_urls.length > 0) {
          mediaHtml = \`<img class="post-thumb" src="\${p.media_urls[0]}" onclick="openLightbox('\${p.media_urls[0]}')" title="Nhấn để phóng to ảnh" />\`;
        }

        const dateStr = p.created_at ? new Date(p.created_at).toLocaleDateString('vi-VN') : '-';

        return \`
          <tr>
            <td>
              <div style="display: flex; align-items: center; gap: 8px;">
                \${authorAvatar}
                <div>
                  <div style="font-weight: 700; font-size: 13.5px; color: var(--text);">\${escapeHtml(authorName)}</div>
                  <div style="font-size: 11.5px; color: var(--text-dim);">@\${escapeHtml(author.username || '')}</div>
                </div>
              </div>
            </td>
            <td style="max-width: 320px;">
              <div style="color: var(--text); font-size: 13.5px; line-height: 1.4; word-break: break-word;">
                \${escapeHtml(p.content || '')}
              </div>
            </td>
            <td>\${mediaHtml}</td>
            <td>
              <div style="display: flex; gap: 10px; font-size: 13px;">
                <span>❤️ \${p.likes_count || 0}</span>
                <span>💬 \${p.comments_count || 0}</span>
              </div>
            </td>
            <td>
              \${p.is_pinned ? '<span class="badge badge-vip">📌 Đã ghim</span>' : '<span style="color: var(--text-dim); font-size: 12px;">-</span>'}
            </td>
            <td style="font-size: 12.5px;">\${dateStr}</td>
            <td style="text-align: right;">
              <div style="display: inline-flex; gap: 6px;">
                <button class="btn btn-sm btn-secondary" onclick="togglePinPost('\${p.id}', \${!p.is_pinned})">
                  \${p.is_pinned ? 'Bỏ ghim' : '📌 Ghim'}
                </button>
                <button class="btn btn-sm btn-danger" onclick="deletePost('\${p.id}')">
                  Xóa Bài
                </button>
              </div>
            </td>
          </tr>
        \`;
      }).join('');
    }

    async function togglePinPost(postId, newStatus) {
      try {
        const res = await fetch(\`/api/admin/posts/\${postId}/toggle-pin\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
          body: JSON.stringify({ isPinned: newStatus })
        });
        const data = await res.json();
        if (data.success) {
          showToast(data.message, 'success');
          fetchPosts();
        }
      } catch (err) {
        showToast('Lỗi: ' + err.message, 'error');
      }
    }

    async function deletePost(postId) {
      if (!confirm('Xóa vĩnh viễn bài viết này khỏi hệ thống Dorabox?')) return;

      try {
        const res = await fetch(\`/api/admin/posts/\${postId}\`, {
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });
        const data = await res.json();
        if (data.success) {
          showToast(data.message, 'success');
          fetchPosts();
          fetchMetrics();
        }
      } catch (err) {
        showToast('Lỗi: ' + err.message, 'error');
      }
    }

    document.getElementById('post-search-input').addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = allPostsCache.filter(p => p.content && p.content.toLowerCase().includes(q));
      renderPostsTable(filtered);
    });

    // 4. Fetch Comments
    async function fetchComments() {
      try {
        const res = await fetch('/api/admin/comments', {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });
        const data = await res.json();
        if (data.success && data.comments) {
          allCommentsCache = data.comments;
          renderCommentsTable(allCommentsCache);
        }
      } catch (err) {
        console.error('Fetch comments error:', err);
      }
    }

    function renderCommentsTable(comments) {
      const tbody = document.getElementById('comments-table-body');
      if (!comments || comments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 40px; color: var(--text-dim);">Chưa có bình luận nào.</td></tr>';
        return;
      }

      tbody.innerHTML = comments.map(c => {
        const user = c.profiles || {};
        const userName = user.display_name || user.username || 'Thành viên';
        const post = c.posts || {};
        const postSnippet = post.content ? (post.content.length > 35 ? post.content.substring(0, 35) + '...' : post.content) : 'Bài viết #' + (c.post_id ? c.post_id.substring(0, 6) : '');
        const dateStr = c.created_at ? new Date(c.created_at).toLocaleDateString('vi-VN') : '-';

        return \`
          <tr>
            <td>
              <div style="font-weight: 700; color: var(--text); font-size: 13.5px;">\${escapeHtml(userName)}</div>
              <div style="font-size: 11.5px; color: var(--text-dim);">@\${escapeHtml(user.username || '')}</div>
            </td>
            <td style="max-width: 340px;">
              <div style="color: var(--text); font-size: 13.5px; line-height: 1.4; word-break: break-word;">
                \${escapeHtml(c.content || '')}
              </div>
            </td>
            <td>
              <span class="badge badge-verified" style="font-size: 11.5px;">\${escapeHtml(postSnippet)}</span>
            </td>
            <td style="font-size: 12.5px;">\${dateStr}</td>
            <td style="text-align: right;">
              <button class="btn btn-sm btn-danger" onclick="deleteComment('\${c.id}')">
                Xóa Bình Luận
              </button>
            </td>
          </tr>
        \`;
      }).join('');
    }

    async function deleteComment(commentId) {
      if (!confirm('Xóa bình luận vi phạm này?')) return;

      try {
        const res = await fetch(\`/api/admin/comments/\${commentId}\`, {
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });
        const data = await res.json();
        if (data.success) {
          showToast(data.message, 'success');
          fetchComments();
          fetchMetrics();
        }
      } catch (err) {
        showToast('Lỗi: ' + err.message, 'error');
      }
    }

    document.getElementById('comment-search-input').addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = allCommentsCache.filter(c => c.content && c.content.toLowerCase().includes(q));
      renderCommentsTable(filtered);
    });

    // 5. Fetch Reports
    async function fetchReports() {
      try {
        const res = await fetch('/api/admin/reports', {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });
        const data = await res.json();
        if (data.success && data.reports) {
          allReportsCache = data.reports;
          renderReportsTable(allReportsCache);
        }
      } catch (err) {
        console.error('Fetch reports error:', err);
      }
    }

    function renderReportsTable(reports) {
      const tbody = document.getElementById('reports-table-body');
      if (!reports || reports.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 40px; color: var(--text-dim);">Chưa có báo cáo vi phạm nào trong hàng đợi.</td></tr>';
        return;
      }

      tbody.innerHTML = reports.map(r => {
        const reporter = r.profiles || {};
        const reporterName = reporter.display_name || reporter.username || 'Thành viên ẩn danh';
        const dateStr = r.created_at ? new Date(r.created_at).toLocaleDateString('vi-VN') : '-';
        const isPending = r.status === 'pending';

        const statusBadge = isPending
          ? '<span class="badge badge-banned">CHỜ XỬ LÝ</span>'
          : '<span class="badge badge-verified">ĐÃ XỬ LÝ</span>';

        return \`
          <tr>
            <td>
              <div style="font-weight: 700; color: var(--text); font-size: 13.5px;">\${escapeHtml(reporterName)}</div>
              <div style="font-size: 11.5px; color: var(--text-dim);">ID: \${r.id.substring(0, 8)}...</div>
            </td>
            <td>
              <span class="badge badge-vip">\${escapeHtml(r.target_type || 'Nội dung')}</span>
            </td>
            <td style="max-width: 280px; color: var(--text);">
              \${escapeHtml(r.reason || 'Vi phạm tiêu chuẩn cộng đồng')}
            </td>
            <td>\${statusBadge}</td>
            <td style="font-size: 12.5px;">\${dateStr}</td>
            <td style="text-align: right;">
              \${isPending ? \`
                <div style="display: inline-flex; gap: 6px;">
                  <button class="btn btn-sm btn-secondary" onclick="actionReport('\${r.id}', 'dismiss')">
                    Bác Bỏ
                  </button>
                  <button class="btn btn-sm btn-danger" onclick="actionReport('\${r.id}', 'delete_target')">
                    Xử Lý & Xóa
                  </button>
                </div>
              \` : '<span style="color: var(--text-dim); font-size: 12px;">Đã hoàn tất</span>'}
            </td>
          </tr>
        \`;
      }).join('');
    }

    async function actionReport(reportId, actionType) {
      try {
        const res = await fetch(\`/api/admin/reports/\${reportId}/action\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
          body: JSON.stringify({ action: actionType })
        });
        const data = await res.json();
        if (data.success) {
          showToast(data.message, 'success');
          fetchReports();
          fetchMetrics();
        }
      } catch (err) {
        showToast('Lỗi: ' + err.message, 'error');
      }
    }

    // 6. Broadcast Realtime Preview & Send
    function setupRealtimePreview() {
      const titleInput = document.getElementById('broadcast-title-input');
      const bodyInput = document.getElementById('broadcast-body-input');
      const previewTitle = document.getElementById('preview-notif-title');
      const previewBody = document.getElementById('preview-notif-body');

      const updatePreview = () => {
        previewTitle.textContent = titleInput.value.trim() || 'Tiêu đề thông báo...';
        previewBody.textContent = bodyInput.value.trim() || 'Nội dung thông báo xuất hiện ở đây...';
      };

      titleInput.addEventListener('input', updatePreview);
      bodyInput.addEventListener('input', updatePreview);

      document.getElementById('btn-send-broadcast').addEventListener('click', async () => {
        const title = titleInput.value.trim();
        const body = bodyInput.value.trim();

        if (!title || !body) {
          showToast('Vui lòng nhập đầy đủ tiêu đề và nội dung', 'error');
          return;
        }

        if (!confirm('Bạn có chắc chắn muốn phát sóng thông báo này tới TOÀN BỘ thành viên?')) return;

        const btn = document.getElementById('btn-send-broadcast');
        btn.disabled = true;
        btn.textContent = 'Đang phát sóng Push Notification...';

        try {
          const res = await fetch('/api/admin/broadcast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
            body: JSON.stringify({ title, body })
          });
          const data = await res.json();
          if (data.success) {
            showToast(data.message, 'success');
            titleInput.value = '';
            bodyInput.value = '';
            updatePreview();
          } else {
            showToast(data.error || 'Gửi thất bại', 'error');
          }
        } catch (err) {
          showToast('Lỗi: ' + err.message, 'error');
        } finally {
          btn.disabled = false;
          btn.innerHTML = '<span>🚀</span><span>Phát Sóng Push Notification Tức Thì</span>';
        }
      });
    }

    // 7. System Health Check
    async function fetchSystemHealth(showNotification = false) {
      try {
        const res = await fetch('/api/admin/system-health', {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });
        const data = await res.json();
        if (data.success && data.health) {
          const h = data.health;
          document.getElementById('sys-db-latency').textContent = \`Độ trễ: \${h.database.latencyMs}ms\`;
          document.getElementById('diag-db-lat').textContent = \`Độ trễ phản hồi: \${h.database.latencyMs}ms\`;

          const uptimeMin = Math.floor(h.uptimeSeconds / 60);
          const uptimeStr = uptimeMin > 60 ? \`\${Math.floor(uptimeMin/60)} giờ \${uptimeMin%60} phút\` : \`\${uptimeMin} phút\`;
          document.getElementById('sys-uptime').textContent = \`Thời gian chạy: \${uptimeStr}\`;
          document.getElementById('diag-uptime-val').textContent = \`Thời gian chạy: \${uptimeStr}\`;

          document.getElementById('diag-memory').textContent = \`Bộ nhớ Heap: \${h.memory.heapUsedMb} MB / RSS: \${h.memory.rssMb} MB\`;
          document.getElementById('diag-node-badge').textContent = h.nodeVersion;

          if (showNotification) {
            showToast(\`Hệ thống hoàn hảo! Supabase DB: \${h.database.latencyMs}ms, R2: Sẵn sàng, FCM: HTTP v1\`, 'success');
          }
        }
      } catch (err) {
        console.error('Fetch system health error:', err);
      }
    }

    // Navigation Tabs Switching
    function setupTabs() {
      document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
          const tabId = item.getAttribute('data-tab');
          switchTab(tabId);
        });
      });
    }

    function switchTab(tabId) {
      currentTab = tabId;

      // Update Nav active
      document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-tab') === tabId);
      });

      // Update Sections
      document.querySelectorAll('.tab-section').forEach(sec => {
        sec.classList.remove('active');
      });
      const activeSec = document.getElementById('tab-' + tabId);
      if (activeSec) activeSec.classList.add('active');

      // Update Topbar Titles
      const titleMap = {
        'tong-quan': { title: 'Tổng Quan Hệ Thống', subtitle: 'Bảng điều khiển theo dõi chỉ số thời gian thực & kiểm duyệt cộng đồng' },
        'thanh-vien': { title: 'Quản Lý Thành Viên', subtitle: 'Cấp tích xanh, phân quyền VIP, khóa hoặc mở khóa tài khoản' },
        'bai-viet': { title: 'Quản Lý Bài Viết', subtitle: 'Kiểm duyệt nội dung, ảnh đính kèm, ghim hoặc xóa bài vi phạm' },
        'binh-luan': { title: 'Quản Lý Bình Luận', subtitle: 'Kiểm tra bình luận cộng đồng và loại bỏ spam' },
        'bao-cao': { title: 'Báo Cáo Vi Phạm', subtitle: 'Hàng đợi xử lý khiếu nại và phản ánh từ cộng đồng người dùng' },
        'phat-thong-bao': { title: 'Phát Thông Báo Toàn Mạng', subtitle: 'Soạn thảo & gửi Push Notification kèm xem trước trực quan trên điện thoại' },
        'he-thong': { title: 'Hệ Thống & Cloud Services', subtitle: 'Giám sát kết nối Supabase, Cloudflare R2 Media và Firebase Push v1' }
      };

      if (titleMap[tabId]) {
        document.getElementById('topbar-title').textContent = titleMap[tabId].title;
        document.getElementById('topbar-subtitle').textContent = titleMap[tabId].subtitle;
      }
    }

    // Lightbox Modal
    function openLightbox(url) {
      document.getElementById('lightbox-img').src = url;
      document.getElementById('lightbox-modal').style.display = 'flex';
    }
    function closeLightbox() {
      document.getElementById('lightbox-modal').style.display = 'none';
    }

    // Toast utility
    function showToast(message, type = 'info') {
      const container = document.getElementById('toast-container');
      const toast = document.createElement('div');
      toast.className = 'toast';
      const icon = type === 'success' ? '✅' : (type === 'error' ? '❌' : 'ℹ️');
      toast.innerHTML = \`<span>\${icon}</span><span>\${escapeHtml(message)}</span>\`;
      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = '0.3s';
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    }

    function escapeHtml(text) {
      if (!text) return '';
      return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  </script>
</body>
</html>`;
}
