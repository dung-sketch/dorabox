export function renderAdminPage(): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dorabox Admin Portal — Trung Tâm Điều Hành</title>
  
  <!-- Google Fonts: Plus Jakarta Sans & JetBrains Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  
  <!-- Font Awesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <!-- Bootstrap 5 CSS (Grid & Dropdowns & Modals only) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
  
  <!-- SweetAlert2 CSS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">

  <style>
    :root {
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
      --bg-body: #06080d;
      --bg-sidebar: #0a0e17;
      --bg-topbar: rgba(10, 14, 23, 0.82);
      --bg-surface: rgba(17, 24, 39, 0.7);
      --bg-surface-elevated: rgba(30, 41, 59, 0.65);
      --border-subtle: rgba(255, 255, 255, 0.07);
      --border-hover: rgba(255, 255, 255, 0.16);
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --text-subtle: #64748b;
      --accent-blue: #38bdf8;
      --accent-green: #22c55e;
      --accent-amber: #f59e0b;
      --accent-rose: #ef4444;
      --accent-purple: #a855f7;
      --sidebar-w: 260px;
      --topbar-h: 64px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-sans);
      background-color: var(--bg-body);
      background-image: 
        radial-gradient(at 0% 0%, rgba(56, 189, 248, 0.05) 0px, transparent 45%),
        radial-gradient(at 100% 0%, rgba(168, 85, 247, 0.05) 0px, transparent 45%),
        radial-gradient(at 50% 100%, rgba(34, 197, 94, 0.03) 0px, transparent 50%);
      background-attachment: fixed;
      color: var(--text-main);
      font-size: 14px;
      min-height: 100vh;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    /* Light mode support */
    body.light-mode {
      --bg-body: #f8fafc;
      --bg-sidebar: #ffffff;
      --bg-topbar: rgba(255, 255, 255, 0.85);
      --bg-surface: #ffffff;
      --bg-surface-elevated: #f1f5f9;
      --border-subtle: rgba(0, 0, 0, 0.08);
      --border-hover: rgba(0, 0, 0, 0.16);
      --text-main: #0f172a;
      --text-muted: #64748b;
      --text-subtle: #94a3b8;
      background-color: #f8fafc;
      background-image: none;
      color: #0f172a;
    }

    /* =========================================================================
       APP SHELL LAYOUT
       ========================================================================= */
    .app-shell {
      display: flex;
      min-height: 100vh;
      position: relative;
    }

    /* Sidebar */
    .app-sidebar {
      width: var(--sidebar-w);
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border-subtle);
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 1030;
      display: flex;
      flex-direction: column;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .sidebar-brand {
      height: var(--topbar-h);
      padding: 0 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid var(--border-subtle);
    }
    .brand-logo-badge {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, #0284c7, #3b82f6);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 16px;
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);
    }
    .brand-title {
      font-size: 15px;
      font-weight: 800;
      color: var(--text-main);
      letter-spacing: -0.02em;
      line-height: 1.2;
    }
    .brand-version {
      font-size: 10.5px;
      font-weight: 600;
      color: var(--accent-blue);
      letter-spacing: 0.02em;
    }

    /* Sidebar Navigation */
    .sidebar-menu {
      flex: 1;
      padding: 16px 12px;
      overflow-y: auto;
    }
    .menu-group-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--text-subtle);
      padding: 8px 12px 6px;
    }
    .nav-item-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 9px 12px;
      margin-bottom: 2px;
      border-radius: 9px;
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 13.5px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.15s ease;
      cursor: pointer;
    }
    .nav-item-btn .nav-left {
      display: flex;
      align-items: center;
      gap: 11px;
    }
    .nav-item-btn i {
      font-size: 14px;
      width: 18px;
      text-align: center;
      opacity: 0.85;
      transition: transform 0.15s ease;
    }
    .nav-item-btn:hover {
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-main);
    }
    .nav-item-btn:hover i {
      transform: scale(1.1);
    }
    .nav-item-btn.active {
      background: rgba(56, 189, 248, 0.12);
      color: var(--accent-blue);
      font-weight: 600;
      border: 1px solid rgba(56, 189, 248, 0.25);
    }
    .nav-item-btn.active i {
      opacity: 1;
      color: var(--accent-blue);
    }
    .nav-counter {
      font-size: 10.5px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.06);
      color: var(--text-muted);
    }
    .nav-item-btn.active .nav-counter {
      background: var(--accent-blue);
      color: #000;
    }
    .nav-counter.counter-danger {
      background: rgba(239, 68, 68, 0.2);
      color: #f87171;
    }

    /* Sidebar Footer Profile */
    .sidebar-footer {
      padding: 14px 16px;
      border-top: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
    .admin-profile-pill {
      display: flex;
      align-items: center;
      gap: 10px;
      overflow: hidden;
    }
    .admin-avatar {
      width: 32px;
      height: 32px;
      border-radius: 9px;
      background: linear-gradient(135deg, #38bdf8, #818cf8);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 12px;
      flex-shrink: 0;
    }
    .admin-name {
      font-size: 12.5px;
      font-weight: 700;
      color: var(--text-main);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .admin-status {
      font-size: 10.5px;
      color: var(--accent-green);
      display: flex;
      align-items: center;
      gap: 5px;
      font-weight: 600;
    }
    .status-dot-pulse {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent-green);
      box-shadow: 0 0 6px var(--accent-green);
    }

    /* Main View Area */
    .app-main {
      flex: 1;
      margin-left: var(--sidebar-w);
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    /* Topbar */
    .app-topbar {
      height: var(--topbar-h);
      background: var(--bg-topbar);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border-bottom: 1px solid var(--border-subtle);
      position: sticky;
      top: 0;
      z-index: 1020;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .topbar-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .mobile-menu-trigger {
      display: none;
      background: transparent;
      border: 1px solid var(--border-subtle);
      color: var(--text-main);
      width: 36px;
      height: 36px;
      border-radius: 8px;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .breadcrumb-trail {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
    }
    .breadcrumb-trail .crumb-root {
      color: var(--text-muted);
      font-weight: 500;
    }
    .breadcrumb-trail .crumb-sep {
      color: var(--text-subtle);
      opacity: 0.5;
    }
    .breadcrumb-trail .crumb-active {
      color: var(--text-main);
      font-weight: 700;
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .icon-action-btn {
      width: 36px;
      height: 36px;
      border-radius: 9px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-subtle);
      color: var(--text-muted);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
      text-decoration: none;
    }
    .icon-action-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: var(--text-main);
      border-color: var(--border-hover);
    }
    .icon-action-btn.btn-danger-action:hover {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
      border-color: rgba(239, 68, 68, 0.3);
    }

    /* Content Body */
    .app-content {
      flex: 1;
      padding: 24px 28px 40px;
      min-width: 0;
    }
    .tab-section {
      display: none;
      animation: fadeIn 0.2s ease-out forwards;
    }
    .tab-section.active {
      display: block;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Page Header */
    .page-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 22px;
    }
    .page-title {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--text-main);
      letter-spacing: -0.025em;
      margin: 0;
    }
    .page-subtitle {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 2px;
    }

    /* =========================================================================
       CUSTOM CARDS & WIDGETS
       ========================================================================= */
    .stat-card {
      background: var(--bg-surface);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      padding: 20px 22px;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .stat-card:hover {
      transform: translateY(-2px);
      border-color: var(--border-hover);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
    }
    .stat-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .stat-label {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-muted);
    }
    .stat-icon-wrap {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }
    .stat-number {
      font-size: 2.1rem;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.1;
      letter-spacing: -0.03em;
      margin-bottom: 6px;
    }
    .stat-footnote {
      font-size: 0.78rem;
      color: var(--text-muted);
    }

    /* Glass Panels */
    .glass-panel {
      background: var(--bg-surface);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--border-subtle);
      border-radius: 18px;
      overflow: hidden;
      margin-bottom: 24px;
    }
    .panel-header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }
    .panel-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-main);
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* =========================================================================
       FILTER BAR & SEARCH
       ========================================================================= */
    .filter-pills-bar {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .filter-pill {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-subtle);
      color: var(--text-muted);
      border-radius: 9999px;
      padding: 6px 14px;
      font-size: 0.82rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .filter-pill:hover {
      background: rgba(255, 255, 255, 0.07);
      color: var(--text-main);
    }
    .filter-pill.active {
      background: rgba(56, 189, 248, 0.14);
      color: var(--accent-blue);
      border-color: rgba(56, 189, 248, 0.35);
      box-shadow: 0 0 12px rgba(56, 189, 248, 0.15);
    }
    .filter-pill .pill-badge {
      font-size: 10px;
      padding: 1px 6px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.08);
      margin-left: 6px;
    }
    .filter-pill.active .pill-badge {
      background: var(--accent-blue);
      color: #000;
    }

    .search-input-wrap {
      position: relative;
      min-width: 250px;
    }
    .search-input-wrap i {
      position: absolute;
      top: 50%;
      left: 14px;
      transform: translateY(-50%);
      color: var(--text-subtle);
      font-size: 13px;
      pointer-events: none;
    }
    .search-input-wrap input {
      width: 100%;
      padding: 7px 14px 7px 38px;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      color: var(--text-main);
      font-size: 0.86rem;
      outline: none;
      transition: border-color 0.15s ease;
    }
    .search-input-wrap input:focus {
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
    }

    /* =========================================================================
       CLEAN BESPOKE TABLES
       ========================================================================= */
    .table-container {
      width: 100%;
      overflow-x: auto;
    }
    .custom-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      color: var(--text-main);
    }
    .custom-table th {
      padding: 12px 16px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-subtle);
      border-bottom: 1px solid var(--border-subtle);
      background: rgba(10, 14, 23, 0.4);
      white-space: nowrap;
    }
    .custom-table td {
      padding: 14px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      vertical-align: middle;
      font-size: 13.5px;
    }
    .custom-table tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }
    .custom-table tr:last-child td {
      border-bottom: none;
    }

    /* Avatars */
    .user-avatar-sm {
      width: 38px;
      height: 38px;
      border-radius: 11px;
      object-fit: cover;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
    }
    .user-avatar-fallback {
      width: 38px;
      height: 38px;
      border-radius: 11px;
      background: linear-gradient(135deg, #0284c7, #3b82f6);
      color: #fff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 13px;
      box-shadow: 0 4px 10px rgba(2, 132, 199, 0.25);
    }

    /* Badges & Indicators */
    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      display: inline-block;
    }
    .status-dot.dot-success {
      background: var(--accent-green);
      box-shadow: 0 0 8px rgba(34, 197, 94, 0.7);
    }
    .status-dot.dot-danger {
      background: var(--accent-rose);
      box-shadow: 0 0 8px rgba(239, 68, 68, 0.7);
    }

    .badge-soft {
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .badge-soft-admin {
      background: rgba(239, 68, 68, 0.12);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.25);
    }
    .badge-soft-mod {
      background: rgba(168, 85, 247, 0.12);
      color: #c084fc;
      border: 1px solid rgba(168, 85, 247, 0.25);
    }
    .badge-soft-oa {
      background: rgba(245, 158, 11, 0.12);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.25);
    }

    /* Action Ellipsis Button & Dropdown */
    .action-ellipsis-btn {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-subtle);
      color: var(--text-muted);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .action-ellipsis-btn:hover, .action-ellipsis-btn[aria-expanded="true"] {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
      border-color: var(--border-hover);
    }

    .modern-dropdown-menu {
      background: rgba(15, 23, 42, 0.96) !important;
      backdrop-filter: blur(24px) saturate(180%);
      -webkit-backdrop-filter: blur(24px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.12) !important;
      border-radius: 12px !important;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6) !important;
      min-width: 210px;
      padding: 6px;
      z-index: 1060;
    }
    .modern-dropdown-menu .dropdown-header {
      font-size: 10px;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      font-weight: 700;
      padding: 6px 12px 3px;
      color: var(--text-subtle) !important;
    }
    .modern-dropdown-menu .dropdown-item {
      color: #e2e8f0;
      font-size: 13px;
      font-weight: 500;
      border-radius: 7px;
      padding: 7px 12px;
      display: flex;
      align-items: center;
      transition: all 0.12s ease;
    }
    .modern-dropdown-menu .dropdown-item:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }
    .modern-dropdown-menu .dropdown-item.text-danger:hover {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171 !important;
    }

    /* Auth Gate Overlay */
    #auth-overlay {
      position: fixed;
      inset: 0;
      background: rgba(5, 7, 12, 0.94);
      backdrop-filter: blur(24px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      transition: opacity 0.3s ease, visibility 0.3s ease;
    }
    .login-box-card {
      width: 100%;
      max-width: 420px;
      background: linear-gradient(145deg, rgba(20, 28, 48, 0.9) 0%, rgba(12, 17, 30, 0.95) 100%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 22px;
      padding: 36px 30px;
      box-shadow: 0 24px 70px rgba(0, 0, 0, 0.7);
      text-align: center;
    }

    /* Mobile Mockup Preview */
    .phone-mockup {
      width: 300px;
      margin: 0 auto;
      background: #0d121f;
      border: 8px solid #1e293b;
      border-radius: 36px;
      padding: 16px 12px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
    }
    .phone-notch {
      width: 90px;
      height: 16px;
      background: #1e293b;
      border-radius: 0 0 10px 10px;
      margin: -16px auto 14px;
    }
    .phone-notif-bubble {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 14px;
      padding: 12px;
    }

    /* Sidebar Drawer on Mobile */
    .sidebar-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: 1025;
    }

    @media (max-width: 991px) {
      .app-sidebar {
        transform: translateX(-100%);
      }
      .app-sidebar.open {
        transform: translateX(0);
      }
      .sidebar-overlay.active {
        display: block;
      }
      .app-main {
        margin-left: 0;
      }
      .mobile-menu-trigger {
        display: inline-flex;
      }
      .app-content {
        padding: 16px;
      }
    }
  </style>
</head>
<body>

  <!-- =========================================================================
       1. AUTH GATE OVERLAY
       ========================================================================= -->
  <div id="auth-overlay">
    <div class="login-box-card">
      <div class="brand-logo-badge mx-auto mb-3" style="width: 52px; height: 52px; font-size: 22px;">
        <i class="fas fa-box-open"></i>
      </div>
      <h4 class="fw-bold text-white mb-1">Dorabox Admin</h4>
      <p class="text-muted small mb-4">Vui lòng nhập Admin Secret Key để mở khóa</p>
      
      <div class="mb-3 text-start">
        <label class="form-label text-muted small fw-semibold">SECRET KEY</label>
        <div class="input-group">
          <input type="password" id="admin-pass-input" class="form-control bg-dark border-secondary text-white" placeholder="••••••••••••" autofocus style="border-radius: 10px;">
        </div>
      </div>
      <button id="btn-unlock-gate" class="btn btn-primary w-100 py-2 fw-bold" style="border-radius: 10px;">
        <i class="fas fa-shield-halved me-1"></i> Mở Khóa Bảng Điều Khiển
      </button>
    </div>
  </div>

  <!-- =========================================================================
       2. APP SHELL
       ========================================================================= -->
  <div class="app-shell">
    <div class="sidebar-overlay" id="sidebar-overlay" onclick="toggleMobileSidebar()"></div>

    <!-- App Sidebar -->
    <aside class="app-sidebar" id="app-sidebar">
      <!-- Brand Logo -->
      <div class="sidebar-brand">
        <div class="brand-logo-badge">
          <i class="fas fa-box-open"></i>
        </div>
        <div>
          <div class="brand-title">Dorabox Admin</div>
          <div class="brand-version">Bảng Điều Khiển v1.2</div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-menu">
        <div class="menu-group-label">Quản Trị Nội Dung</div>
        <button class="nav-item-btn active" data-tab="tong-quan" onclick="switchTab('tong-quan')">
          <span class="nav-left"><i class="fas fa-chart-pie text-info"></i> Tổng Quan</span>
        </button>
        <button class="nav-item-btn" data-tab="thanh-vien" onclick="switchTab('thanh-vien')">
          <span class="nav-left"><i class="fas fa-users text-primary"></i> Thành Viên</span>
          <span class="nav-counter" id="sidebar-user-badge">0</span>
        </button>
        <button class="nav-item-btn" data-tab="duyet-oa" onclick="switchTab('duyet-oa')">
          <span class="nav-left"><i class="fas fa-certificate text-warning"></i> Xét Duyệt OA</span>
          <span class="nav-counter counter-danger" id="sidebar-oa-badge" style="display:none;">0</span>
        </button>
        <button class="nav-item-btn" data-tab="bai-viet" onclick="switchTab('bai-viet')">
          <span class="nav-left"><i class="fas fa-newspaper text-success"></i> Bài Viết & Tin</span>
        </button>
        <button class="nav-item-btn" data-tab="binh-luan" onclick="switchTab('binh-luan')">
          <span class="nav-left"><i class="fas fa-comments text-cyan" style="color:#06b6d4;"></i> Bình Luận</span>
        </button>
        <button class="nav-item-btn" data-tab="bao-cao" onclick="switchTab('bao-cao')">
          <span class="nav-left"><i class="fas fa-triangle-exclamation text-danger"></i> Báo Cáo Vi Phạm</span>
          <span class="nav-counter counter-danger" id="sidebar-report-badge">0</span>
        </button>

        <div class="menu-group-label mt-3">Điều Hành & Kỹ Thuật</div>
        <button class="nav-item-btn" data-tab="phat-thong-bao" onclick="switchTab('phat-thong-bao')">
          <span class="nav-left"><i class="fas fa-bullhorn text-purple" style="color:#c084fc;"></i> Phát Push FCM</span>
        </button>
        <button class="nav-item-btn" data-tab="bao-mat-audit" onclick="switchTab('bao-mat-audit')">
          <span class="nav-left"><i class="fas fa-shield-halved text-secondary"></i> Bảo Mật & Audit</span>
        </button>
        <button class="nav-item-btn" data-tab="he-thong" onclick="switchTab('he-thong')">
          <span class="nav-left"><i class="fas fa-server text-teal" style="color:#2dd4bf;"></i> Hạ Tầng Cloud</span>
        </button>
      </nav>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <div class="admin-profile-pill">
          <div class="admin-avatar">AD</div>
          <div>
            <div class="admin-name">SuperAdministrator</div>
            <div class="admin-status">
              <span class="status-dot-pulse"></span> Root Online
            </div>
          </div>
        </div>
        <button class="icon-action-btn btn-danger-action" id="btn-logout" title="Đăng xuất">
          <i class="fas fa-arrow-right-from-bracket"></i>
        </button>
      </div>
    </aside>

    <!-- App Main -->
    <div class="app-main">
      <!-- Topbar Header -->
      <header class="app-topbar">
        <div class="topbar-left">
          <button class="mobile-menu-trigger" onclick="toggleMobileSidebar()">
            <i class="fas fa-bars"></i>
          </button>
          <div class="breadcrumb-trail">
            <span class="crumb-root">Dorabox</span>
            <span class="crumb-sep">/</span>
            <span class="crumb-active" id="breadcrumb-title">Tổng Quan Hệ Thống</span>
          </div>
        </div>

        <div class="topbar-right">
          <!-- Refresh -->
          <button class="icon-action-btn" id="btn-refresh-data" title="Làm mới dữ liệu">
            <i class="fas fa-arrows-rotate"></i>
          </button>
          <!-- Dark / Light theme -->
          <button class="icon-action-btn" id="btn-toggle-dark-mode" title="Đổi chế độ sáng / tối">
            <i class="fas fa-sun" id="theme-toggle-icon"></i>
          </button>
          <!-- Fullscreen -->
          <button class="icon-action-btn d-none d-sm-inline-flex" id="btn-fullscreen" onclick="toggleFullscreen()" title="Toàn màn hình">
            <i class="fas fa-expand"></i>
          </button>
        </div>
      </header>

      <!-- Content Area -->
      <main class="app-content">
        <!-- Title & Subtitle Row -->
        <div class="page-header-row">
          <div>
            <h4 class="page-title" id="topbar-title">Tổng Quan Hệ Thống</h4>
            <div class="page-subtitle" id="topbar-subtitle">Chỉ số vận hành mạng xã hội Dorabox theo thời gian thực</div>
          </div>
          <div>
            <button class="btn btn-sm btn-outline-secondary text-light px-3 py-1 rounded-pill" onclick="loadDashboardData()">
              <i class="fas fa-rotate me-1 text-info"></i> Làm mới
            </button>
          </div>
        </div>

        <!-- =========================================================================
             TAB 1: TỔNG QUAN (DASHBOARD)
             ========================================================================= -->
        <div id="tab-tong-quan" class="tab-section active">
          <!-- 4 KPI Cards -->
          <div class="row g-3 mb-4">
            <div class="col-xl-3 col-md-6 col-12">
              <div class="stat-card" onclick="switchTab('thanh-vien')">
                <div class="stat-card-header">
                  <span class="stat-label">Tổng Thành Viên</span>
                  <div class="stat-icon-wrap" style="background: rgba(56, 189, 248, 0.12); color: #38bdf8;">
                    <i class="fas fa-users"></i>
                  </div>
                </div>
                <div class="stat-number" id="kpi-users">0</div>
                <div class="stat-footnote">
                  <span class="text-info fw-semibold" id="kpi-verified">0</span> đã cấp tích xanh
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 col-12">
              <div class="stat-card" onclick="switchTab('bai-viet')">
                <div class="stat-card-header">
                  <span class="stat-label">Bài Viết Bảng Tin</span>
                  <div class="stat-icon-wrap" style="background: rgba(34, 197, 94, 0.12); color: #22c55e;">
                    <i class="fas fa-newspaper"></i>
                  </div>
                </div>
                <div class="stat-number" id="kpi-posts">0</div>
                <div class="stat-footnote">
                  <span class="text-success fw-semibold" id="kpi-comments">0</span> bình luận thảo luận
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 col-12">
              <div class="stat-card" onclick="switchTab('duyet-oa')">
                <div class="stat-card-header">
                  <span class="stat-label">Official Account & VIP</span>
                  <div class="stat-icon-wrap" style="background: rgba(245, 158, 11, 0.12); color: #f59e0b;">
                    <i class="fas fa-certificate"></i>
                  </div>
                </div>
                <div class="stat-number" id="kpi-vip">0</div>
                <div class="stat-footnote">
                  <span class="text-warning fw-semibold" id="kpi-oa-pending">0</span> đề xuất chờ xét duyệt
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 col-12">
              <div class="stat-card" onclick="switchTab('bao-cao')">
                <div class="stat-card-header">
                  <span class="stat-label">Báo Cáo Vi Phạm</span>
                  <div class="stat-icon-wrap" style="background: rgba(239, 68, 68, 0.12); color: #ef4444;">
                    <i class="fas fa-shield-halved"></i>
                  </div>
                </div>
                <div class="stat-number" id="kpi-banned">0</div>
                <div class="stat-footnote">
                  <span class="text-danger fw-semibold" id="sidebar-report-badge-kpi">0</span> báo cáo cần xử lý
                </div>
              </div>
            </div>
          </div>

          <!-- Charts Row -->
          <div class="row g-3 mb-4">
            <div class="col-lg-8">
              <div class="glass-panel h-100 mb-0">
                <div class="panel-header">
                  <div class="panel-title"><i class="fas fa-chart-line text-info"></i> Tương Tác Bảng Tin & Hoạt Động</div>
                  <span class="badge bg-secondary">7 ngày qua</span>
                </div>
                <div class="p-3" style="height: 260px;">
                  <canvas id="growthChart"></canvas>
                </div>
              </div>
            </div>

            <div class="col-lg-4">
              <div class="glass-panel h-100 mb-0">
                <div class="panel-header">
                  <div class="panel-title"><i class="fas fa-chart-pie text-purple" style="color:#c084fc;"></i> Phân Bổ Thành Viên</div>
                  <span class="badge bg-secondary">Cơ cấu</span>
                </div>
                <div class="p-3" style="height: 260px;">
                  <canvas id="distributionChart"></canvas>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="glass-panel p-3">
            <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <div class="fw-bold text-white fs-6">Thao tác điều hành nhanh</div>
                <div class="text-muted small">Phím tắt cho các tác vụ quản trị thường nhật</div>
              </div>
              <div class="d-flex flex-wrap gap-2">
                <button class="btn btn-sm btn-dark border-secondary text-light px-3" onclick="switchTab('phat-thong-bao')">
                  <i class="fas fa-bullhorn text-purple me-1" style="color:#c084fc;"></i> Phát Push FCM
                </button>
                <button class="btn btn-sm btn-dark border-secondary text-light px-3" onclick="cleanSpamReactions()">
                  <i class="fas fa-broom text-warning me-1"></i> Dọn Rác Spam
                </button>
                <button class="btn btn-sm btn-dark border-secondary text-light px-3" onclick="switchTab('duyet-oa')">
                  <i class="fas fa-certificate text-warning me-1"></i> Xét Duyệt OA
                </button>
                <button class="btn btn-sm btn-dark border-secondary text-light px-3" onclick="switchTab('he-thong')">
                  <i class="fas fa-server text-teal me-1" style="color:#2dd4bf;"></i> Kiểm Tra Máy Chủ
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- =========================================================================
             TAB 2: THÀNH VIÊN (USERS)
             ========================================================================= -->
        <div id="tab-thanh-vien" class="tab-section">
          <div class="glass-panel">
            <!-- Filter Pills Bar & Search -->
            <div class="panel-header">
              <div class="filter-pills-bar" id="user-filter-pills">
                <button type="button" class="filter-pill active" data-filter="all">
                  Tất cả <span class="pill-badge" id="filter-count-all">0</span>
                </button>
                <button type="button" class="filter-pill" data-filter="oa">
                  <i class="fas fa-certificate text-warning me-1"></i> Official Account <span class="pill-badge" id="filter-count-oa">0</span>
                </button>
                <button type="button" class="filter-pill" data-filter="verified">
                  <i class="fas fa-circle-check text-info me-1"></i> Tích xanh <span class="pill-badge" id="filter-count-verified">0</span>
                </button>
                <button type="button" class="filter-pill" data-filter="admin">
                  <i class="fas fa-shield text-danger me-1"></i> Quản trị viên <span class="pill-badge" id="filter-count-admin">0</span>
                </button>
                <button type="button" class="filter-pill" data-filter="banned">
                  <i class="fas fa-ban text-danger me-1"></i> Đã khóa <span class="pill-badge" id="filter-count-banned">0</span>
                </button>
              </div>
              <div class="search-input-wrap">
                <i class="fas fa-search"></i>
                <input type="text" id="user-search-input" placeholder="Tìm theo tên, @username, UID...">
              </div>
            </div>

            <!-- Clean Bespoke 5-Column Table -->
            <div class="table-container" style="min-height: 280px;">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th style="padding-left: 20px;">Thành Viên</th>
                    <th>Vai Trò</th>
                    <th>Trạng Thái</th>
                    <th>Ngày Tham Gia</th>
                    <th style="text-align: right; padding-right: 20px;">Thao Tác</th>
                  </tr>
                </thead>
                <tbody id="users-table-body">
                  <tr><td colspan="5" class="text-center py-5 text-muted">Đang tải danh sách thành viên...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- =========================================================================
             TAB 3: XÉT DUYỆT TÍCH & OA
             ========================================================================= -->
        <div id="tab-duyet-oa" class="tab-section">
          <div class="glass-panel">
            <div class="panel-header">
              <div class="panel-title"><i class="fas fa-certificate text-warning"></i> Hàng Đợi Xét Duyệt Official Account</div>
              <button class="btn btn-sm btn-outline-warning" onclick="fetchOaRequests(true)">
                <i class="fas fa-arrows-rotate me-1"></i> Làm mới yêu cầu
              </button>
            </div>
            <div class="p-3">
              <div id="oa-requests-container">
                <div class="text-center py-5 text-muted">Đang kiểm tra đề xuất thay đổi OA...</div>
              </div>
            </div>
          </div>
        </div>

        <!-- =========================================================================
             TAB 4: BÀI VIẾT & TIN
             ========================================================================= -->
        <div id="tab-bai-viet" class="tab-section">
          <div class="glass-panel">
            <div class="panel-header">
              <div class="panel-title"><i class="fas fa-newspaper text-success"></i> Quản Lý Bảng Tin & Bài Viết</div>
              <div class="search-input-wrap">
                <i class="fas fa-search"></i>
                <input type="text" id="post-search-input" placeholder="Tìm kiếm nội dung bài viết...">
              </div>
            </div>
            <div class="table-container">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th style="padding-left: 20px;">Tác Giả</th>
                    <th style="max-width: 340px;">Nội Dung</th>
                    <th>Hình Ảnh</th>
                    <th>Tương Tác</th>
                    <th>Ghim</th>
                    <th>Thời Gian</th>
                    <th style="text-align: right; padding-right: 20px;">Hành Động</th>
                  </tr>
                </thead>
                <tbody id="posts-table-body">
                  <tr><td colspan="7" class="text-center py-5 text-muted">Đang tải danh sách bài viết...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- =========================================================================
             TAB 5: BÌNH LUẬN
             ========================================================================= -->
        <div id="tab-binh-luan" class="tab-section">
          <div class="glass-panel">
            <div class="panel-header">
              <div class="panel-title"><i class="fas fa-comments text-cyan" style="color:#06b6d4;"></i> Quản Lý Bình Luận Thảo Luận</div>
              <div class="search-input-wrap">
                <i class="fas fa-search"></i>
                <input type="text" id="comment-search-input" placeholder="Tìm nội dung bình luận...">
              </div>
            </div>
            <div class="table-container">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th style="padding-left: 20px;">Người Bình Luận</th>
                    <th>Nội Dung</th>
                    <th>Bài Viết Liên Quan</th>
                    <th>Thời Gian</th>
                    <th style="text-align: right; padding-right: 20px;">Thao Tác</th>
                  </tr>
                </thead>
                <tbody id="comments-table-body">
                  <tr><td colspan="5" class="text-center py-5 text-muted">Đang tải danh sách bình luận...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- =========================================================================
             TAB 6: BÁO CÁO VI PHẠM
             ========================================================================= -->
        <div id="tab-bao-cao" class="tab-section">
          <div class="glass-panel">
            <div class="panel-header">
              <div class="panel-title"><i class="fas fa-triangle-exclamation text-danger"></i> Hàng Đợi Báo Cáo Vi Phạm</div>
              <span class="badge bg-danger" id="reports-pending-count">0 Chờ xử lý</span>
            </div>
            <div class="table-container">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th style="padding-left: 20px;">Người Báo Cáo</th>
                    <th>Mục Tiêu</th>
                    <th>Lý Do / Chi Tiết</th>
                    <th>Trạng Thái</th>
                    <th>Thời Gian</th>
                    <th style="text-align: right; padding-right: 20px;">Phán Quyết</th>
                  </tr>
                </thead>
                <tbody id="reports-table-body">
                  <tr><td colspan="6" class="text-center py-5 text-muted">Đang tải danh sách báo cáo...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- =========================================================================
             TAB 7: PHÁT PUSH FCM
             ========================================================================= -->
        <div id="tab-phat-thong-bao" class="tab-section">
          <div class="row g-4">
            <div class="col-lg-7">
              <div class="glass-panel">
                <div class="panel-header">
                  <div class="panel-title"><i class="fas fa-bullhorn text-purple" style="color:#c084fc;"></i> Soạn Thảo Push Notification FCM</div>
                </div>
                <div class="p-4">
                  <div class="mb-3">
                    <label class="form-label fw-bold small text-uppercase">Tiêu đề thông báo <span class="text-danger">*</span></label>
                    <input type="text" id="broadcast-title-input" class="form-control bg-dark border-secondary text-white" placeholder="Ví dụ: 🚀 Dorabox Cập Nhật Phiên Bản 1.2!">
                  </div>

                  <div class="mb-3">
                    <label class="form-label fw-bold small text-uppercase">Nội dung chi tiết <span class="text-danger">*</span></label>
                    <textarea id="broadcast-body-input" rows="5" class="form-control bg-dark border-secondary text-white" placeholder="Nhập nội dung thông báo gửi tới tất cả người dùng ứng dụng..."></textarea>
                  </div>

                  <div class="mb-3">
                    <label class="form-label fw-bold small text-uppercase">Đường dẫn điều hướng (Deep-link tùy chọn)</label>
                    <input type="text" id="broadcast-link-input" class="form-control bg-dark border-secondary text-white font-mono" placeholder="https://dorabox.app hoặc dorabox://update">
                  </div>

                  <div class="alert alert-info py-2 small border-0 mb-4" style="background: rgba(56, 189, 248, 0.12); color: #38bdf8;">
                    <i class="fas fa-info-circle me-1"></i> Thông báo này sẽ được phát qua <strong>Firebase Cloud Messaging v1 (FCM)</strong> đồng thời ghi trực tiếp vào Hộp thông báo của tất cả thành viên.
                  </div>

                  <button id="btn-send-broadcast" class="btn btn-primary w-100 py-2.5 fw-bold" style="border-radius: 10px;">
                    <i class="fas fa-paper-plane me-1"></i> Bắt Đầu Phát Sóng Toàn Hệ Thống
                  </button>
                </div>
              </div>
            </div>

            <div class="col-lg-5">
              <div class="glass-panel text-center">
                <div class="panel-header justify-content-center">
                  <div class="panel-title"><i class="fas fa-mobile-screen text-info"></i> Mô Phỏng Hiển Thị Mobile</div>
                </div>
                <div class="p-4">
                  <div class="phone-mockup">
                    <div class="phone-notch"></div>
                    <div class="phone-notif-bubble text-start">
                      <div class="d-flex align-items-center justify-content-between mb-1">
                        <div class="d-flex align-items-center gap-1.5">
                          <div class="brand-logo-badge" style="width: 18px; height: 18px; font-size: 10px;">
                            <i class="fas fa-box-open"></i>
                          </div>
                          <span class="fw-bold text-white small" style="font-size: 11px;">DORABOX</span>
                        </div>
                        <span class="text-muted" id="preview-notif-time" style="font-size: 10px;">Vừa xong</span>
                      </div>
                      <div class="fw-bold text-white text-truncate" id="preview-notif-title" style="font-size: 13px;">Tiêu đề thông báo mẫu</div>
                      <div class="text-muted small text-break mt-1" id="preview-notif-body" style="font-size: 11.5px; line-height: 1.35;">Nội dung thông báo sẽ xuất hiện ở đây khi bạn nhập văn bản.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- =========================================================================
             TAB 8: BẢO MẬT & AUDIT LOGS
             ========================================================================= -->
        <div id="tab-bao-mat-audit" class="tab-section">
          <div class="glass-panel">
            <div class="panel-header">
              <div class="panel-title"><i class="fas fa-shield-halved text-primary"></i> Nhật Ký An Ninh & Khiên Chống Spam</div>
              <button class="btn btn-sm btn-outline-warning" onclick="cleanSpamReactions()">
                <i class="fas fa-broom me-1"></i> Dọn Rác Spam Phản Ứng
              </button>
            </div>
            <div class="table-container">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th style="padding-left: 20px;">Sự Kiện</th>
                    <th>Tác Nhân (Admin/User)</th>
                    <th>Chi Tiết & Tham Số</th>
                    <th>Địa Chỉ IP</th>
                    <th style="text-align: right; padding-right: 20px;">Thời Gian</th>
                  </tr>
                </thead>
                <tbody id="audit-table-body">
                  <tr><td colspan="5" class="text-center py-5 text-muted">Đang tải nhật ký kiểm toán...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- =========================================================================
             TAB 9: HẠ TẦNG CLOUD & SERVICES
             ========================================================================= -->
        <div id="tab-he-thong" class="tab-section">
          <div class="row g-4">
            <div class="col-lg-6">
              <div class="glass-panel">
                <div class="panel-header">
                  <div class="panel-title"><i class="fas fa-server text-teal" style="color:#2dd4bf;"></i> Trạng Thái Dịch Vụ Đám Mây</div>
                  <button class="btn btn-sm btn-outline-secondary" onclick="fetchSystemHealth()">
                    <i class="fas fa-arrows-rotate"></i>
                  </button>
                </div>
                <div class="p-3">
                  <div class="d-flex align-items-center justify-content-between p-3 border-bottom border-secondary border-opacity-10">
                    <div>
                      <div class="fw-bold text-white">Supabase PostgreSQL 15</div>
                      <div class="text-muted small">Cơ sở dữ liệu chính & Row Level Security</div>
                    </div>
                    <span class="badge bg-success" id="health-supabase">ONLINE</span>
                  </div>

                  <div class="d-flex align-items-center justify-content-between p-3 border-bottom border-secondary border-opacity-10">
                    <div>
                      <div class="fw-bold text-white">Cloudflare R2 Storage (S3 API)</div>
                      <div class="text-muted small">Lưu trữ hình ảnh, video & CDN phân phối</div>
                    </div>
                    <span class="badge bg-success" id="health-r2">ONLINE</span>
                  </div>

                  <div class="d-flex align-items-center justify-content-between p-3 border-bottom border-secondary border-opacity-10">
                    <div>
                      <div class="fw-bold text-white">Firebase Cloud Messaging (FCM v1)</div>
                      <div class="text-muted small">Hạ tầng phát sóng Push Notification</div>
                    </div>
                    <span class="badge bg-success" id="health-fcm">ONLINE</span>
                  </div>

                  <div class="d-flex align-items-center justify-content-between p-3">
                    <div>
                      <div class="fw-bold text-white">Agora RTC Audio/Video Engine</div>
                      <div class="text-muted small">Hạ tầng gọi thoại & video call mã hóa P2P</div>
                    </div>
                    <span class="badge bg-success" id="health-agora">ONLINE</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-6">
              <div class="glass-panel">
                <div class="panel-header">
                  <div class="panel-title"><i class="fas fa-microchip text-info"></i> Thông Số Máy Chủ Vận Hành</div>
                </div>
                <div class="p-4">
                  <div class="row g-3">
                    <div class="col-6">
                      <div class="p-3 rounded-3 text-center" style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle);">
                        <div class="text-muted small text-uppercase">Uptime</div>
                        <div class="fs-4 fw-bold text-white mt-1" id="health-uptime">99.98%</div>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="p-3 rounded-3 text-center" style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle);">
                        <div class="text-muted small text-uppercase">Node.js Runtime</div>
                        <div class="fs-4 fw-bold text-info mt-1" id="health-node">v22.x LTS</div>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="p-3 rounded-3 text-center" style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle);">
                        <div class="text-muted small text-uppercase">Database Latency</div>
                        <div class="fs-4 fw-bold text-success mt-1" id="health-latency">~18ms</div>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="p-3 rounded-3 text-center" style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle);">
                        <div class="text-muted small text-uppercase">Cơ Chế Bảo Mật</div>
                        <div class="fs-4 fw-bold text-warning mt-1">120Hz Guard</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  </div>

  <!-- Image Lightbox Modal -->
  <div class="modal fade" id="lightboxModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content bg-transparent border-0 text-center">
        <div class="modal-body p-0">
          <img id="lightbox-img" src="" class="img-fluid rounded-4 shadow-lg" style="max-height: 80vh;">
        </div>
      </div>
    </div>
  </div>

  <!-- Bootstrap 5 JS & SweetAlert2 & Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <script>
    let adminToken = localStorage.getItem('dorabox_admin_token') || '';
    let allUsersCache = [];
    let allPostsCache = [];
    let allCommentsCache = [];
    let allReportsCache = [];
    let allOaRequestsCache = [];
    let growthChartInstance = null;
    let distributionChartInstance = null;
    let currentUserFilter = 'all';

    document.addEventListener('DOMContentLoaded', () => {
      initTheme();
      setupUserFilterPills();
      setupBroadcastPreview();

      if (adminToken) {
        verifySession();
      } else {
        showLoginOverlay();
      }
    });

    // Theme Toggle (Dark / Light Mode)
    function initTheme() {
      const isLight = localStorage.getItem('dorabox_admin_theme') === 'light';
      if (isLight) {
        document.body.classList.add('light-mode');
        document.getElementById('theme-toggle-icon').className = 'fas fa-moon';
      }

      document.getElementById('btn-toggle-dark-mode').addEventListener('click', () => {
        const isCurrentlyLight = document.body.classList.contains('light-mode');
        if (isCurrentlyLight) {
          document.body.classList.remove('light-mode');
          document.getElementById('theme-toggle-icon').className = 'fas fa-sun';
          localStorage.setItem('dorabox_admin_theme', 'dark');
        } else {
          document.body.classList.add('light-mode');
          document.getElementById('theme-toggle-icon').className = 'fas fa-moon';
          localStorage.setItem('dorabox_admin_theme', 'light');
        }
      });
    }

    function toggleMobileSidebar() {
      const sidebar = document.getElementById('app-sidebar');
      const overlay = document.getElementById('sidebar-overlay');
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
    }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }

    // Login Overlay Handlers
    function showLoginOverlay() {
      const overlay = document.getElementById('auth-overlay');
      overlay.style.visibility = 'visible';
      overlay.style.opacity = '1';
      document.getElementById('admin-pass-input').focus();
    }

    function hideLoginOverlay() {
      const overlay = document.getElementById('auth-overlay');
      overlay.style.opacity = '0';
      overlay.style.visibility = 'hidden';
    }

    document.getElementById('btn-unlock-gate').addEventListener('click', doLogin);
    document.getElementById('admin-pass-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doLogin();
    });

    async function doLogin() {
      const pass = document.getElementById('admin-pass-input').value.trim();
      if (!pass) {
        Swal.fire({ icon: 'warning', title: 'Thông báo', text: 'Vui lòng nhập Admin Secret Key' });
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
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Chào mừng SuperAdministrator!',
            showConfirmButton: false,
            timer: 2000
          });
          loadDashboardData();
        } else {
          Swal.fire({ icon: 'error', title: 'Thất bại', text: data.error || 'Khóa bảo mật không chính xác!' });
        }
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Lỗi mạng', text: err.message });
      }
    }

    // Logout
    document.getElementById('btn-logout').addEventListener('click', () => {
      Swal.fire({
        title: 'Đăng xuất?',
        text: 'Bạn có chắc chắn muốn kết thúc phiên làm việc Quản trị?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Đăng xuất',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem('dorabox_admin_token');
          adminToken = '';
          showLoginOverlay();
        }
      });
    });

    // Verify Session
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
      } catch (_) {
        showLoginOverlay();
      }
    }

    // Load All Data
    async function loadDashboardData() {
      fetchMetrics();
      fetchUsers();
      fetchOaRequests();
      fetchPosts();
      fetchComments();
      fetchReports();
      fetchSystemHealth();
      fetchSecurityLogs();
    }

    document.getElementById('btn-refresh-data').addEventListener('click', () => {
      loadDashboardData();
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Đã cập nhật dữ liệu mới nhất!',
        showConfirmButton: false,
        timer: 1500
      });
    });

    // 1. Fetch Metrics & Render Charts
    async function fetchMetrics() {
      try {
        const res = await fetch('/api/admin/metrics', {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });
        const data = await res.json();
        if (data.success && data.metrics) {
          const m = data.metrics;
          document.getElementById('kpi-users').textContent = Number(m.totalUsers || 0).toLocaleString();
          document.getElementById('sidebar-user-badge').textContent = Number(m.totalUsers || 0).toLocaleString();
          document.getElementById('kpi-verified').textContent = Number(m.verifiedUsers || 0).toLocaleString();
          document.getElementById('kpi-banned').textContent = Number(m.bannedUsers || 0).toLocaleString();
          document.getElementById('kpi-posts').textContent = Number(m.totalPosts || 0).toLocaleString();
          document.getElementById('kpi-comments').textContent = Number(m.totalComments || 0).toLocaleString();
          
          const pendingRep = Number(m.pendingReports || 0);
          document.getElementById('sidebar-report-badge').textContent = pendingRep;
          document.getElementById('sidebar-report-badge-kpi').textContent = pendingRep;
          document.getElementById('reports-pending-count').textContent = pendingRep + ' Chờ xử lý';

          const pendingOa = Number(m.pendingOaRequests || 0);
          document.getElementById('kpi-oa-pending').textContent = pendingOa;
          const oaBadge = document.getElementById('sidebar-oa-badge');
          if (oaBadge) {
            oaBadge.textContent = pendingOa;
            oaBadge.style.display = pendingOa > 0 ? 'inline-block' : 'none';
          }

          renderCharts(m);
        }
      } catch (err) {
        console.error('Fetch metrics error:', err);
      }
    }

    function renderCharts(m) {
      const ctxGrowth = document.getElementById('growthChart');
      if (ctxGrowth) {
        if (growthChartInstance) growthChartInstance.destroy();
        growthChartInstance = new Chart(ctxGrowth, {
          type: 'line',
          data: {
            labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
            datasets: [
              {
                label: 'Bài viết',
                data: [Math.floor((m.totalPosts||10)*0.2), Math.floor((m.totalPosts||10)*0.35), Math.floor((m.totalPosts||10)*0.5), Math.floor((m.totalPosts||10)*0.6), Math.floor((m.totalPosts||10)*0.75), Math.floor((m.totalPosts||10)*0.9), m.totalPosts || 10],
                borderColor: '#38bdf8',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                borderWidth: 2,
                tension: 0.35,
                fill: true
              },
              {
                label: 'Bình luận',
                data: [Math.floor((m.totalComments||20)*0.15), Math.floor((m.totalComments||20)*0.3), Math.floor((m.totalComments||20)*0.45), Math.floor((m.totalComments||20)*0.6), Math.floor((m.totalComments||20)*0.7), Math.floor((m.totalComments||20)*0.85), m.totalComments || 20],
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.08)',
                borderWidth: 2,
                tension: 0.35,
                fill: true
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', weight: '600' } } }
            },
            scales: {
              x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
              y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
            }
          }
        });
      }

      const ctxDist = document.getElementById('distributionChart');
      if (ctxDist) {
        if (distributionChartInstance) distributionChartInstance.destroy();
        const total = m.totalUsers || 10;
        const ver = m.verifiedUsers || 2;
        const ban = m.bannedUsers || 0;
        const norm = Math.max(0, total - ver - ban);

        distributionChartInstance = new Chart(ctxDist, {
          type: 'doughnut',
          data: {
            labels: ['Tiêu chuẩn', 'Tích xanh & OA', 'Bị khóa'],
            datasets: [{
              data: [norm, ver, ban],
              backgroundColor: ['#38bdf8', '#f59e0b', '#ef4444'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '72%',
            plugins: {
              legend: { 
                position: 'bottom', 
                labels: { color: '#94a3b8', boxWidth: 10, usePointStyle: true, font: { family: 'Plus Jakarta Sans', weight: '600', size: 11 } } 
              }
            }
          }
        });
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
          updateUserFilterCounts();
          filterUsers();

          const vipCount = allUsersCache.filter(u => u.is_vip || u.is_oa || u.account_type === 'oa').length;
          document.getElementById('kpi-vip').textContent = Number(vipCount).toLocaleString();
        }
      } catch (err) {
        console.error('Fetch users error:', err);
      }
    }

    function renderUsersTable(users) {
      const tbody = document.getElementById('users-table-body');
      if (!users || users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-5 text-muted">Không tìm thấy thành viên phù hợp.</td></tr>';
        return;
      }

      tbody.innerHTML = users.map(u => {
        const initial = (u.display_name || u.username || 'U').charAt(0).toUpperCase();
        const avatarHtml = u.avatar_url 
          ? \`<img class="user-avatar-sm me-3" src="\${u.avatar_url}" alt="\${escapeHtml(u.display_name)}" onerror="this.outerHTML='<div class=\\'user-avatar-fallback me-3\\'>\${initial}</div>'" />\`
          : \`<div class="user-avatar-fallback me-3">\${initial}</div>\`;

        // Inline Badges next to name
        let inlineBadges = '';
        if (u.is_oa || u.account_type === 'oa') {
          inlineBadges += '<i class="fas fa-certificate text-warning ms-1" title="Official Account (Tích vàng)" style="font-size: 13px;"></i>';
        } else if (u.is_verified) {
          inlineBadges += '<i class="fas fa-circle-check text-info ms-1" title="Tài khoản đã xác thực" style="font-size: 13px;"></i>';
        }
        if (u.is_vip) {
          inlineBadges += '<i class="fas fa-crown text-warning ms-1" title="Thành viên VIP" style="font-size: 11px;"></i>';
        }

        // Role column
        let roleBadge = '<span class="text-muted small">Thành viên</span>';
        if (u.role === 'admin') {
          roleBadge = '<span class="badge-soft badge-soft-admin">Admin</span>';
        } else if (u.role === 'mod') {
          roleBadge = '<span class="badge-soft badge-soft-mod">Moderator</span>';
        } else if (u.is_oa || u.account_type === 'oa') {
          roleBadge = '<span class="badge-soft badge-soft-oa">Official Account</span>';
        }

        // Status column
        const statusHtml = u.is_banned
          ? '<span class="d-inline-flex align-items-center gap-2 small text-danger fw-semibold"><span class="status-dot dot-danger"></span> Bị khóa</span>'
          : '<span class="d-inline-flex align-items-center gap-2 small text-success fw-semibold"><span class="status-dot dot-success"></span> Hoạt động</span>';

        const joinDate = u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : '-';

        const isOa = (u.is_oa || u.account_type === 'oa');
        const oaResetAction = isOa 
          ? \`<li><a class="dropdown-item" href="javascript:void(0)" onclick="resetOaEditCount('\${u.id}', '\${escapeHtml(u.display_name || u.username)}')"><i class="fas fa-rotate-left text-info me-2 fa-fw"></i>Cấp 1 lượt sửa OA</a></li>\` 
          : '';

        return \`
          <tr>
            <td style="padding-left: 20px;">
              <div class="d-flex align-items-center">
                \${avatarHtml}
                <div>
                  <div class="d-flex align-items-center">
                    <span class="fw-semibold text-white fs-6">\${escapeHtml(u.display_name || 'Chưa đặt tên')}</span>
                    \${inlineBadges}
                  </div>
                  <div class="d-flex align-items-center gap-2 mt-0.5">
                    <span class="font-mono text-secondary small">@\${escapeHtml(u.username || '')}</span>
                    <span class="text-secondary opacity-25">•</span>
                    <span class="text-muted font-mono" style="font-size: 11px;">UID: \${u.id.substring(0, 8)}...</span>
                  </div>
                </div>
              </div>
            </td>
            <td>\${roleBadge}</td>
            <td>\${statusHtml}</td>
            <td class="text-secondary small">\${joinDate}</td>
            <td style="text-align: right; padding-right: 20px;">
              <div class="dropdown d-inline-block">
                <button class="action-ellipsis-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false" title="Thao tác với thành viên">
                  <i class="fas fa-ellipsis"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end modern-dropdown-menu shadow-lg">
                  <li class="dropdown-header">Danh hiệu & Xác thực</li>
                  <li>
                    <a class="dropdown-item" href="javascript:void(0)" onclick="toggleVerify('\${u.id}', \${!u.is_verified})">
                      <i class="fas \${u.is_verified ? 'fa-circle-xmark text-secondary' : 'fa-circle-check text-info'} me-2 fa-fw"></i>
                      \${u.is_verified ? 'Hủy tích xanh' : 'Cấp tích xanh xác thực'}
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="javascript:void(0)" onclick="toggleVip('\${u.id}', \${!u.is_vip})">
                      <i class="fas fa-crown text-warning me-2 fa-fw"></i>
                      \${u.is_vip ? 'Hủy quyền VIP' : 'Cấp huy hiệu VIP'}
                    </a>
                  </li>
                  <li><hr class="dropdown-divider border-secondary border-opacity-25 my-1"></li>
                  <li class="dropdown-header">Phân quyền tài khoản</li>
                  <li>
                    <a class="dropdown-item" href="javascript:void(0)" onclick="promptChangeRole('\${u.id}', '\${escapeHtml(u.display_name || u.username)}', '\${u.role || 'user'}')">
                      <i class="fas fa-user-shield text-primary me-2 fa-fw"></i>
                      Đổi vai trò (Role)
                    </a>
                  </li>
                  \${oaResetAction}
                  <li><hr class="dropdown-divider border-secondary border-opacity-25 my-1"></li>
                  <li class="dropdown-header">Kỷ luật</li>
                  <li>
                    <a class="dropdown-item \${u.is_banned ? 'text-success' : 'text-danger'}" href="javascript:void(0)" onclick="toggleBan('\${u.id}', \${!u.is_banned})">
                      <i class="fas \${u.is_banned ? 'fa-lock-open text-success' : 'fa-ban text-danger'} me-2 fa-fw"></i>
                      \${u.is_banned ? 'Mở khóa tài khoản' : 'Khóa tài khoản này'}
                    </a>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        \`;
      }).join('');
    }

    async function toggleVerify(userId, newStatus) {
      try {
        const res = await fetch(\`/api/admin/users/\${userId}/toggle-verify\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
          body: JSON.stringify({ isVerified: newStatus })
        });
        const data = await res.json();
        if (data.success) {
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: data.message, showConfirmButton: false, timer: 1800 });
          fetchUsers();
          fetchMetrics();
        }
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Lỗi', text: err.message });
      }
    }

    async function toggleVip(userId, newStatus) {
      try {
        const res = await fetch(\`/api/admin/users/\${userId}/toggle-vip\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
          body: JSON.stringify({ isVip: newStatus })
        });
        const data = await res.json();
        if (data.success) {
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: data.message, showConfirmButton: false, timer: 1800 });
          fetchUsers();
          fetchMetrics();
        }
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Lỗi', text: err.message });
      }
    }

    async function toggleBan(userId, newStatus) {
      const action = newStatus ? 'KHÓA' : 'MỞ KHÓA';
      Swal.fire({
        title: \`Xác nhận \${action} tài khoản?\`,
        text: newStatus ? 'Người dùng sẽ bị thu hồi toàn bộ quyền truy cập ứng dụng!' : 'Người dùng có thể đăng nhập và hoạt động bình thường.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: newStatus ? '#ef4444' : '#10b981',
        confirmButtonText: action,
        cancelButtonText: 'Hủy'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await fetch(\`/api/admin/users/\${userId}/toggle-ban\`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
              body: JSON.stringify({ isBanned: newStatus })
            });
            const data = await res.json();
            if (data.success) {
              Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: data.message, showConfirmButton: false, timer: 1800 });
              fetchUsers();
              fetchMetrics();
            }
          } catch (err) {
            Swal.fire({ icon: 'error', title: 'Lỗi', text: err.message });
          }
        }
      });
    }

    async function promptChangeRole(userId, name, currentRole) {
      const { value: newRole } = await Swal.fire({
        title: \`Phân quyền cho "\${name}"\`,
        input: 'select',
        inputOptions: {
          'user': 'Thành viên tiêu chuẩn (User)',
          'oa': 'Official Account Doanh Nghiệp (OA)',
          'mod': 'Điều phối viên kiểm duyệt (Moderator)',
          'admin': 'Quản trị viên cấp cao (Admin)'
        },
        inputValue: currentRole,
        showCancelButton: true,
        confirmButtonText: 'Lưu quyền mới',
        cancelButtonText: 'Hủy'
      });

      if (newRole) {
        try {
          const res = await fetch(\`/api/admin/users/\${userId}/change-role\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
            body: JSON.stringify({ role: newRole })
          });
          const data = await res.json();
          if (data.success) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: data.message, showConfirmButton: false, timer: 1800 });
            fetchUsers();
            fetchMetrics();
          }
        } catch (err) {
          Swal.fire({ icon: 'error', title: 'Lỗi', text: err.message });
        }
      }
    }

    async function resetOaEditCount(userId, name) {
      Swal.fire({
        title: 'Cấp lượt sửa OA?',
        text: \`Cấp lại 1 lượt cập nhật thông tin Official Account cho "\${name}"?\`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Cấp 1 lượt',
        cancelButtonText: 'Hủy'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await fetch(\`/api/admin/users/\${userId}/reset-oa-edit\`, {
              method: 'POST',
              headers: { 'Authorization': 'Bearer ' + adminToken }
            });
            const data = await res.json();
            if (data.success) {
              Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: data.message, showConfirmButton: false, timer: 1800 });
            }
          } catch (err) {
            Swal.fire({ icon: 'error', title: 'Lỗi', text: err.message });
          }
        }
      });
    }

    // Filter Users
    function setupUserFilterPills() {
      const pills = document.querySelectorAll('#user-filter-pills .filter-pill');
      pills.forEach(btn => {
        btn.addEventListener('click', () => {
          pills.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentUserFilter = btn.getAttribute('data-filter') || 'all';
          filterUsers();
        });
      });
    }

    function updateUserFilterCounts() {
      if (!allUsersCache) return;
      const countAll = allUsersCache.length;
      const countOa = allUsersCache.filter(u => u.is_oa || u.account_type === 'oa').length;
      const countVer = allUsersCache.filter(u => u.is_verified).length;
      const countAdm = allUsersCache.filter(u => u.role === 'admin' || u.role === 'mod').length;
      const countBan = allUsersCache.filter(u => u.is_banned).length;

      const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
      setTxt('filter-count-all', countAll);
      setTxt('filter-count-oa', countOa);
      setTxt('filter-count-verified', countVer);
      setTxt('filter-count-admin', countAdm);
      setTxt('filter-count-banned', countBan);
    }

    const userSearchEl = document.getElementById('user-search-input');
    if (userSearchEl) userSearchEl.addEventListener('input', filterUsers);

    function filterUsers() {
      const qInput = document.getElementById('user-search-input');
      const q = qInput ? qInput.value.toLowerCase().trim() : '';

      let filtered = allUsersCache.filter(u => {
        const matchesQuery = !q || 
          (u.display_name && u.display_name.toLowerCase().includes(q)) || 
          (u.username && u.username.toLowerCase().includes(q)) ||
          (u.id && u.id.toLowerCase().includes(q));

        let matchesRole = true;
        if (currentUserFilter === 'banned') matchesRole = u.is_banned === true;
        else if (currentUserFilter === 'oa') matchesRole = u.is_oa === true || u.account_type === 'oa';
        else if (currentUserFilter === 'verified') matchesRole = u.is_verified === true;
        else if (currentUserFilter === 'admin') matchesRole = u.role === 'admin' || u.role === 'mod';

        return matchesQuery && matchesRole;
      });

      renderUsersTable(filtered);
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
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-5 text-muted">Chưa có bài viết nào trên bảng tin.</td></tr>';
        return;
      }

      tbody.innerHTML = posts.map(p => {
        const author = p.author || {};
        const authorName = escapeHtml(author.display_name || author.username || 'Người dùng ẩn danh');
        const authorInitial = authorName.charAt(0).toUpperCase();
        const authorAvatar = author.avatar_url 
          ? \`<img class="user-avatar-sm me-2" src="\${author.avatar_url}" alt="\${authorName}" onerror="this.outerHTML='<div class=\\'user-avatar-fallback me-2\\'>\${authorInitial}</div>'" />\`
          : \`<div class="user-avatar-fallback me-2">\${authorInitial}</div>\`;

        const dateStr = p.created_at ? new Date(p.created_at).toLocaleString('vi-VN') : '-';
        
        let mediaHtml = '<span class="text-muted small">Không đính kèm</span>';
        if (p.media_urls && p.media_urls.length > 0) {
          mediaHtml = \`
            <div class="d-flex gap-1">
              <img src="\${p.media_urls[0]}" class="rounded-2" style="width: 44px; height: 44px; object-fit: cover; cursor: pointer;" onclick="openLightbox('\${p.media_urls[0]}')" />
              \${p.media_urls.length > 1 ? \`<span class="badge bg-dark border border-secondary align-self-center">+\${p.media_urls.length - 1}</span>\` : ''}
            </div>
          \`;
        }

        return \`
          <tr>
            <td style="padding-left: 20px;">
              <div class="d-flex align-items-center">
                \${authorAvatar}
                <div>
                  <div class="fw-bold text-white">\${authorName}</div>
                  <div class="text-muted font-mono" style="font-size: 11px;">@\${escapeHtml(author.username || '')}</div>
                </div>
              </div>
            </td>
            <td style="max-width: 340px;">
              <div class="text-truncate text-light small">\${escapeHtml(p.content || '')}</div>
            </td>
            <td>\${mediaHtml}</td>
            <td>
              <div class="small text-muted d-flex gap-3">
                <span><i class="fas fa-heart text-danger me-1"></i>\${p.likes_count || 0}</span>
                <span><i class="fas fa-comment text-info me-1"></i>\${p.comments_count || 0}</span>
              </div>
            </td>
            <td>
              \${p.is_pinned ? '<span class="badge-soft badge-soft-oa"><i class="fas fa-thumbtack me-1"></i>Đã ghim</span>' : '<span class="text-muted small">-</span>'}
            </td>
            <td class="text-secondary small">\${dateStr}</td>
            <td style="text-align: right; padding-right: 20px;">
              <div class="d-flex align-items-center justify-content-end gap-1.5">
                <button class="action-ellipsis-btn" title="\${p.is_pinned ? 'Bỏ ghim' : 'Ghim nổi bật'}" onclick="togglePinPost('\${p.id}', \${!p.is_pinned})">
                  <i class="fas fa-thumbtack \${p.is_pinned ? 'text-warning' : ''}"></i>
                </button>
                <button class="action-ellipsis-btn text-danger" title="Xóa bài viết vĩnh viễn" onclick="deletePost('\${p.id}')">
                  <i class="fas fa-trash"></i>
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
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: data.message, showConfirmButton: false, timer: 1800 });
          fetchPosts();
        }
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Lỗi', text: err.message });
      }
    }

    async function deletePost(postId) {
      Swal.fire({
        title: 'Xóa bài viết này?',
        text: 'Toàn bộ nội dung, hình ảnh và bình luận liên quan sẽ bị xóa vĩnh viễn!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Xóa vĩnh viễn',
        cancelButtonText: 'Hủy'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await fetch(\`/api/admin/posts/\${postId}\`, {
              method: 'DELETE',
              headers: { 'Authorization': 'Bearer ' + adminToken }
            });
            const data = await res.json();
            if (data.success) {
              Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: data.message, showConfirmButton: false, timer: 1800 });
              fetchPosts();
              fetchMetrics();
            }
          } catch (err) {
            Swal.fire({ icon: 'error', title: 'Lỗi', text: err.message });
          }
        }
      });
    }

    const postSearchEl = document.getElementById('post-search-input');
    if (postSearchEl) {
      postSearchEl.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        const filtered = allPostsCache.filter(p => p.content && p.content.toLowerCase().includes(q));
        renderPostsTable(filtered);
      });
    }

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
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-5 text-muted">Chưa có bình luận nào.</td></tr>';
        return;
      }

      tbody.innerHTML = comments.map(c => {
        const user = c.user || {};
        const userName = escapeHtml(user.display_name || user.username || 'Người dùng');
        const dateStr = c.created_at ? new Date(c.created_at).toLocaleString('vi-VN') : '-';

        return \`
          <tr>
            <td style="padding-left: 20px;">
              <div class="fw-bold text-white">\${userName}</div>
              <div class="text-muted font-mono" style="font-size: 11px;">@\${escapeHtml(user.username || '')}</div>
            </td>
            <td>
              <div class="text-light small text-break">\${escapeHtml(c.content || '')}</div>
            </td>
            <td>
              <span class="text-muted font-mono small">Post: \${c.post_id ? c.post_id.substring(0, 8) + '...' : '-'}</span>
            </td>
            <td class="text-secondary small">\${dateStr}</td>
            <td style="text-align: right; padding-right: 20px;">
              <button class="action-ellipsis-btn text-danger" title="Xóa bình luận" onclick="deleteComment('\${c.id}')">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        \`;
      }).join('');
    }

    async function deleteComment(commentId) {
      Swal.fire({
        title: 'Xóa bình luận này?',
        text: 'Hành động không thể hoàn tác!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await fetch(\`/api/admin/comments/\${commentId}\`, {
              method: 'DELETE',
              headers: { 'Authorization': 'Bearer ' + adminToken }
            });
            const data = await res.json();
            if (data.success) {
              Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: data.message, showConfirmButton: false, timer: 1800 });
              fetchComments();
              fetchMetrics();
            }
          } catch (err) {
            Swal.fire({ icon: 'error', title: 'Lỗi', text: err.message });
          }
        }
      });
    }

    const commentSearchEl = document.getElementById('comment-search-input');
    if (commentSearchEl) {
      commentSearchEl.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        const filtered = allCommentsCache.filter(c => c.content && c.content.toLowerCase().includes(q));
        renderCommentsTable(filtered);
      });
    }

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
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-5 text-muted">Không có báo cáo vi phạm nào cần xử lý.</td></tr>';
        return;
      }

      tbody.innerHTML = reports.map(r => {
        const reporterName = escapeHtml(r.reporter?.display_name || r.reporter?.username || 'Ẩn danh');
        const targetTypeBadge = r.target_type === 'post' 
          ? '<span class="badge bg-primary">BÀI VIẾT</span>' 
          : (r.target_type === 'comment' ? '<span class="badge bg-info">BÌNH LUẬN</span>' : '<span class="badge bg-secondary">NGƯỜI DÙNG</span>');

        const statusBadge = r.status === 'resolved' 
          ? '<span class="badge bg-success">Đã xử lý</span>' 
          : (r.status === 'rejected' ? '<span class="badge bg-secondary">Đã bác bỏ</span>' : '<span class="badge bg-danger">Chờ xử lý</span>');

        const dateStr = r.created_at ? new Date(r.created_at).toLocaleString('vi-VN') : '-';

        return \`
          <tr>
            <td style="padding-left: 20px;">
              <div class="fw-bold text-white">\${reporterName}</div>
              <div class="text-muted font-mono" style="font-size: 11px;">ID: \${r.reporter_id ? r.reporter_id.substring(0, 8) : '-'}</div>
            </td>
            <td>
              \${targetTypeBadge}
              <div class="font-mono text-muted small mt-1">#\${r.target_id ? r.target_id.substring(0, 8) : '-'}</div>
            </td>
            <td>
              <div class="fw-bold text-warning small">\${escapeHtml(r.reason || 'Không rõ lý do')}</div>
              <div class="text-muted small">\${escapeHtml(r.details || '')}</div>
            </td>
            <td>\${statusBadge}</td>
            <td class="text-secondary small">\${dateStr}</td>
            <td style="text-align: right; padding-right: 20px;">
              \${r.status === 'pending' ? \`
                <button class="btn btn-sm btn-outline-danger me-1" onclick="resolveReport('\${r.id}', 'delete_target')">Xử phạt</button>
                <button class="btn btn-sm btn-outline-secondary" onclick="resolveReport('\${r.id}', 'dismiss')">Bác bỏ</button>
              \` : '<span class="text-muted small">Hoàn tất</span>'}
            </td>
          </tr>
        \`;
      }).join('');
    }

    async function resolveReport(reportId, action) {
      try {
        const res = await fetch(\`/api/admin/reports/\${reportId}/resolve\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
          body: JSON.stringify({ action })
        });
        const data = await res.json();
        if (data.success) {
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: data.message, showConfirmButton: false, timer: 1800 });
          fetchReports();
          fetchMetrics();
        }
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Lỗi', text: err.message });
      }
    }

    // 6. Fetch OA Requests
    async function fetchOaRequests(showToast = false) {
      try {
        const res = await fetch('/api/admin/oa-requests', {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });
        const data = await res.json();
        if (data.success && data.requests) {
          allOaRequestsCache = data.requests;
          renderOaRequests(allOaRequestsCache);
          if (showToast) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã tải danh sách đề xuất OA', showConfirmButton: false, timer: 1500 });
          }
        }
      } catch (err) {
        console.error('Fetch OA requests error:', err);
      }
    }

    function renderOaRequests(requests) {
      const container = document.getElementById('oa-requests-container');
      if (!requests || requests.length === 0) {
        container.innerHTML = '<div class="text-center py-5 text-muted"><i class="fas fa-circle-check fs-2 text-success mb-2 d-block"></i>Không có đề xuất thay đổi OA nào đang chờ xét duyệt.</div>';
        return;
      }

      container.innerHTML = requests.map(req => {
        const changes = req.proposed_changes || {};
        const oldInfo = req.current_info || {};
        const dateStr = req.created_at ? new Date(req.created_at).toLocaleString('vi-VN') : '-';

        return \`
          <div class="glass-panel p-3 mb-3">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <div class="d-flex align-items-center gap-2">
                <span class="badge bg-warning text-dark fw-bold"><i class="fas fa-certificate me-1"></i>Official Account</span>
                <span class="text-white fw-bold">\${escapeHtml(req.user?.display_name || req.user?.username || 'Doanh nghiệp')}</span>
                <span class="font-mono text-muted small">@\${escapeHtml(req.user?.username || '')}</span>
              </div>
              <span class="text-secondary small">\${dateStr}</span>
            </div>

            <div class="row g-2 small p-2 rounded-2 mb-3" style="background: rgba(255,255,255,0.02);">
              <div class="col-md-6">
                <span class="text-muted">Tên đề xuất:</span> <strong class="text-info">\${escapeHtml(changes.display_name || oldInfo.display_name || '-')}</strong>
              </div>
              <div class="col-md-6">
                <span class="text-muted">Lĩnh vực:</span> <strong class="text-warning">\${escapeHtml(changes.category || oldInfo.category || '-')}</strong>
              </div>
              <div class="col-12 mt-1">
                <span class="text-muted">Tiểu sử:</span> <span class="text-light">\${escapeHtml(changes.bio || oldInfo.bio || '-')}</span>
              </div>
            </div>

            <div class="d-flex justify-content-end gap-2">
              <button class="btn btn-sm btn-outline-danger" onclick="reviewOaRequest('\${req.id}', 'reject')">
                <i class="fas fa-times me-1"></i> Bác bỏ
              </button>
              <button class="btn btn-sm btn-success" onclick="reviewOaRequest('\${req.id}', 'approve')">
                <i class="fas fa-check me-1"></i> Phê duyệt đề xuất
              </button>
            </div>
          </div>
        \`;
      }).join('');
    }

    async function reviewOaRequest(reqId, action) {
      let reason = '';
      if (action === 'reject') {
        const { value } = await Swal.fire({
          title: 'Lý do bác bỏ đề xuất OA?',
          input: 'text',
          inputPlaceholder: 'Nhập lý do gửi về cho chủ sở hữu OA...',
          showCancelButton: true,
          confirmButtonText: 'Bác bỏ',
          cancelButtonText: 'Hủy'
        });
        if (value === undefined) return;
        reason = value;
      }

      try {
        const endpoint = action === 'approve' 
          ? \`/api/admin/oa-requests/\${reqId}/approve\` 
          : \`/api/admin/oa-requests/\${reqId}/reject\`;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
          body: JSON.stringify({ reason })
        });
        const data = await res.json();
        if (data.success) {
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: data.message, showConfirmButton: false, timer: 1800 });
          fetchOaRequests();
          fetchUsers();
          fetchMetrics();
        }
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Lỗi', text: err.message });
      }
    }

    // 7. Broadcast Preview & Send
    function setupBroadcastPreview() {
      const titleInput = document.getElementById('broadcast-title-input');
      const bodyInput = document.getElementById('broadcast-body-input');
      const previewTitle = document.getElementById('preview-notif-title');
      const previewBody = document.getElementById('preview-notif-body');

      if (titleInput && previewTitle) {
        titleInput.addEventListener('input', (e) => {
          previewTitle.textContent = e.target.value || 'Tiêu đề thông báo mẫu';
        });
      }
      if (bodyInput && previewBody) {
        bodyInput.addEventListener('input', (e) => {
          previewBody.textContent = e.target.value || 'Nội dung thông báo sẽ xuất hiện ở đây khi bạn nhập văn bản.';
        });
      }

      const sendBtn = document.getElementById('btn-send-broadcast');
      if (sendBtn) {
        sendBtn.addEventListener('click', sendBroadcast);
      }
    }

    async function sendBroadcast() {
      const title = document.getElementById('broadcast-title-input').value.trim();
      const body = document.getElementById('broadcast-body-input').value.trim();
      const link = document.getElementById('broadcast-link-input').value.trim();

      if (!title || !body) {
        Swal.fire({ icon: 'warning', title: 'Thiếu thông tin', text: 'Vui lòng nhập Tiêu đề và Nội dung thông báo!' });
        return;
      }

      Swal.fire({
        title: 'Phát sóng Push FCM?',
        text: 'Thông báo sẽ được gửi tới TẤT CẢ người dùng ứng dụng Dorabox ngay lập tức!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        confirmButtonText: 'Phát sóng ngay',
        cancelButtonText: 'Hủy'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await fetch('/api/admin/broadcast', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
              body: JSON.stringify({ title, body, link })
            });
            const data = await res.json();
            if (data.success) {
              Swal.fire({ icon: 'success', title: 'Phát sóng thành công!', text: data.message });
              document.getElementById('broadcast-title-input').value = '';
              document.getElementById('broadcast-body-input').value = '';
              document.getElementById('broadcast-link-input').value = '';
            } else {
              Swal.fire({ icon: 'error', title: 'Lỗi phát sóng', text: data.error });
            }
          } catch (err) {
            Swal.fire({ icon: 'error', title: 'Lỗi mạng', text: err.message });
          }
        }
      });
    }

    // 8. Security Logs & Clean Spam
    async function fetchSecurityLogs() {
      try {
        const res = await fetch('/api/admin/system/audit-logs', {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });
        const data = await res.json();
        if (data.success && data.logs) {
          renderSecurityLogs(data.logs);
        }
      } catch (err) {
        console.error('Fetch security logs error:', err);
      }
    }

    function renderSecurityLogs(logs) {
      const tbody = document.getElementById('audit-table-body');
      if (!logs || logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-5 text-muted">Không có bản ghi kiểm toán nào gần đây.</td></tr>';
        return;
      }

      tbody.innerHTML = logs.map(l => {
        const dateStr = l.created_at ? new Date(l.created_at).toLocaleString('vi-VN') : '-';
        return \`
          <tr>
            <td style="padding-left: 20px;">
              <span class="badge bg-dark border border-secondary text-info fw-bold">\${escapeHtml(l.action || 'ACTION')}</span>
            </td>
            <td>
              <div class="fw-bold text-white small">\${escapeHtml(l.actor_name || 'System / Admin')}</div>
              <div class="text-muted font-mono" style="font-size: 11px;">UID: \${l.actor_id ? l.actor_id.substring(0, 8) : '-'}</div>
            </td>
            <td>
              <div class="font-mono text-muted small text-break">\${escapeHtml(JSON.stringify(l.details || {}))}</div>
            </td>
            <td class="font-mono text-secondary small">\${escapeHtml(l.ip_address || '-')}</td>
            <td style="text-align: right; padding-right: 20px;" class="text-secondary small">\${dateStr}</td>
          </tr>
        \`;
      }).join('');
    }

    async function cleanSpamReactions() {
      Swal.fire({
        title: 'Dọn rác phản ứng spam?',
        text: 'Hệ thống sẽ quét và loại bỏ các lượt tương tác trùng lặp / spam tạo bởi bot.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Dọn dẹp ngay',
        cancelButtonText: 'Hủy'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await fetch('/api/admin/system/clean-spam', {
              method: 'POST',
              headers: { 'Authorization': 'Bearer ' + adminToken }
            });
            const data = await res.json();
            if (data.success) {
              Swal.fire({ icon: 'success', title: 'Hoàn tất', text: data.message });
              fetchMetrics();
            }
          } catch (err) {
            Swal.fire({ icon: 'error', title: 'Lỗi', text: err.message });
          }
        }
      });
    }

    // 9. System Health
    async function fetchSystemHealth() {
      try {
        const res = await fetch('/api/admin/system/health', {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });
        const data = await res.json();
        if (data.success && data.health) {
          const h = data.health;
          document.getElementById('health-supabase').textContent = h.database || 'ONLINE';
          document.getElementById('health-r2').textContent = h.storage || 'ONLINE';
          document.getElementById('health-fcm').textContent = h.fcm || 'ONLINE';
          document.getElementById('health-agora').textContent = h.agora || 'ONLINE';
          if (h.uptime) document.getElementById('health-uptime').textContent = h.uptime;
          if (h.nodeVersion) document.getElementById('health-node').textContent = h.nodeVersion;
          if (h.latency) document.getElementById('health-latency').textContent = h.latency;
        }
      } catch (err) {
        console.error('Fetch system health error:', err);
      }
    }

    // Navigation Tab Switching
    function switchTab(tabId) {
      document.querySelectorAll('.app-sidebar .nav-item-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
      });

      document.querySelectorAll('.tab-section').forEach(sec => {
        sec.classList.remove('active');
      });
      const targetSec = document.getElementById('tab-' + tabId);
      if (targetSec) targetSec.classList.add('active');

      const titleMap = {
        'tong-quan': { short: 'Tổng Quan', title: 'Tổng Quan Hệ Thống', subtitle: 'Chỉ số vận hành mạng xã hội Dorabox theo thời gian thực' },
        'thanh-vien': { short: 'Thành Viên', title: 'Quản Lý Danh Sách Thành Viên', subtitle: 'Phân quyền, cấp tích xanh, xét duyệt Official Account & khóa tài khoản' },
        'duyet-oa': { short: 'Xét Duyệt OA', title: 'Xét Duyệt Thông Tin OA', subtitle: 'Phê duyệt các thay đổi Tên, Lĩnh vực, Mã định danh, Tiểu sử và Trạng thái Official Account' },
        'bai-viet': { short: 'Bài Viết', title: 'Quản Lý Bảng Tin & Bài Viết', subtitle: 'Kiểm duyệt nội dung bảng tin, hình ảnh đính kèm, ghim bài nổi bật & xóa vi phạm' },
        'binh-luan': { short: 'Bình Luận', title: 'Quản Lý Bình Luận & Thảo Luận', subtitle: 'Giám sát tương tác thảo luận cộng đồng & ngăn chặn spam' },
        'bao-cao': { short: 'Báo Cáo', title: 'Kiểm Duyệt & Báo Cáo Vi Phạm', subtitle: 'Hàng đợi xét duyệt hồ sơ cấp tích và xử lý vi phạm tiêu chuẩn cộng đồng' },
        'phat-thong-bao': { short: 'Push FCM', title: 'Broadcast Studio & Push FCM', subtitle: 'Soạn thảo và phát Push Notification tới ứng dụng kèm xem trước trên mobile' },
        'bao-mat-audit': { short: 'Bảo Mật & Audit', title: 'Bảo Mật Hệ Thống & Nhật Ký Audit', subtitle: 'Giám sát khiên chống spam 120Hz, bảo trì dọn dẹp phản ứng rác & theo dõi an ninh' },
        'he-thong': { short: 'Hạ Tầng Cloud', title: 'Hạ Tầng Cloud & Services', subtitle: 'Giám sát dịch vụ Supabase Postgres, Cloudflare R2 CDN và Firebase v1' }
      };

      if (titleMap[tabId]) {
        document.getElementById('topbar-title').textContent = titleMap[tabId].title;
        document.getElementById('topbar-subtitle').textContent = titleMap[tabId].subtitle;
        const breadcrumbEl = document.getElementById('breadcrumb-title');
        if (breadcrumbEl) breadcrumbEl.textContent = titleMap[tabId].short || titleMap[tabId].title;
      }

      // Close mobile sidebar if open
      const sidebar = document.getElementById('app-sidebar');
      const overlay = document.getElementById('sidebar-overlay');
      if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
      }
    }

    // Lightbox modal helper
    function openLightbox(url) {
      document.getElementById('lightbox-img').src = url;
      const modal = new bootstrap.Modal(document.getElementById('lightboxModal'));
      modal.show();
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
