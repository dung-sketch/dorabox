export function renderAdminPage(): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dorabox AdminLTE — Trung Tâm Quản Trị Hệ Thống</title>
  
  <!-- Google Fonts: Plus Jakarta Sans & JetBrains Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Font Awesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <!-- Bootstrap 5 CSS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
  
  <!-- AdminLTE 3.2 CSS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/css/adminlte.min.css">
  
  <!-- SweetAlert2 CSS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">

  <style>
    :root {
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
      --dora-blue: #38bdf8;
      --dora-blue-glow: rgba(56, 189, 248, 0.2);
      --dora-amber: #f59e0b;
      --dora-emerald: #10b981;
      --dora-rose: #f43f5e;
      --dora-purple: #8b5cf6;
      --dora-teal: #14b8a6;
      --dora-bg: #07090e;
      --dora-surface: rgba(17, 24, 39, 0.75);
      --dora-surface-hover: rgba(26, 36, 56, 0.85);
      --dora-border: rgba(255, 255, 255, 0.08);
      --dora-border-hover: rgba(255, 255, 255, 0.18);
    }

    * {
      box-sizing: border-box;
    }

    body, html {
      font-family: var(--font-sans);
      font-size: 14px;
      letter-spacing: -0.01em;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Modern Dark Canvas with Subtle Radial Mesh Lights */
    body.dark-mode {
      background-color: var(--dora-bg) !important;
      background-image: 
        radial-gradient(at 0% 0%, rgba(56, 189, 248, 0.08) 0px, transparent 40%),
        radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.08) 0px, transparent 45%),
        radial-gradient(at 50% 100%, rgba(16, 185, 129, 0.04) 0px, transparent 50%) !important;
      background-attachment: fixed !important;
      color: #e2e8f0;
    }

    body.dark-mode .content-wrapper {
      background: transparent !important;
    }

    /* Frosted Top Navbar */
    body.dark-mode .main-header.navbar {
      background: rgba(10, 14, 24, 0.78) !important;
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border-bottom: 1px solid var(--dora-border) !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      padding: 10px 18px;
    }

    .nav-link {
      font-weight: 600;
      font-size: 0.88rem;
      color: #94a3b8 !important;
      border-radius: 10px;
      padding: 8px 14px !important;
      transition: all 0.2s ease;
    }
    .nav-link:hover {
      color: #ffffff !important;
      background: rgba(255, 255, 255, 0.05);
    }

    .navbar-action-btn {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--dora-border);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #cbd5e1 !important;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .navbar-action-btn:hover {
      background: rgba(255, 255, 255, 0.09);
      color: #ffffff !important;
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
    }

    /* Live Radar Pulse Indicator */
    .live-radar-chip {
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.3);
      border-radius: 9999px;
      padding: 6px 14px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 0.78rem;
      font-weight: 700;
      color: #4ade80;
      box-shadow: 0 0 15px rgba(34, 197, 94, 0.15);
    }
    .live-radar-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22c55e;
      position: relative;
    }
    .live-radar-dot::after {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      background: rgba(34, 197, 94, 0.5);
      animation: radarPulse 1.8s infinite cubic-bezier(0, 0, 0.2, 1);
    }
    @keyframes radarPulse {
      0% { transform: scale(0.8); opacity: 1; }
      100% { transform: scale(2.4); opacity: 0; }
    }

    /* Frosted Sidebar */
    body.dark-mode .main-sidebar {
      background: rgba(9, 13, 22, 0.94) !important;
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-right: 1px solid var(--dora-border) !important;
      box-shadow: 4px 0 24px rgba(0, 0, 0, 0.4);
    }
    .brand-link {
      border-bottom: 1px solid var(--dora-border) !important;
      padding: 18px 20px !important;
    }
    .brand-icon-box {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: linear-gradient(135deg, #0284c7 0%, #3b82f6 50%, #8b5cf6 100%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 800;
      font-size: 18px;
      box-shadow: 0 4px 18px rgba(59, 130, 246, 0.45);
      margin-right: 12px;
      transition: transform 0.2s ease;
    }
    .brand-link:hover .brand-icon-box {
      transform: scale(1.05);
    }

    /* Sidebar User Info */
    .user-panel {
      padding: 12px 14px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 14px;
      border: 1px solid var(--dora-border);
      margin: 12px 14px !important;
    }

    /* Sidebar Nav Links */
    .nav-sidebar .nav-item {
      margin-bottom: 4px;
    }
    .nav-sidebar .nav-link {
      border-radius: 12px !important;
      padding: 10px 14px !important;
      font-weight: 600;
      color: #94a3b8 !important;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      align-items: center;
    }
    .nav-sidebar .nav-link .nav-icon {
      font-size: 1.05rem;
      margin-right: 12px;
      width: 22px;
      text-align: center;
      transition: transform 0.2s ease;
    }
    .nav-sidebar .nav-link:hover {
      background: rgba(255, 255, 255, 0.05) !important;
      color: #ffffff !important;
      transform: translateX(3px);
    }
    .nav-sidebar .nav-link:hover .nav-icon {
      transform: scale(1.15);
    }
    .nav-sidebar .nav-link.active {
      background: linear-gradient(90deg, rgba(56, 189, 248, 0.16) 0%, rgba(139, 92, 246, 0.08) 100%) !important;
      color: #ffffff !important;
      border: 1px solid rgba(56, 189, 248, 0.32) !important;
      box-shadow: 0 4px 18px rgba(56, 189, 248, 0.14) !important;
      position: relative;
    }
    .nav-sidebar .nav-link.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 15%;
      bottom: 15%;
      width: 3.5px;
      border-radius: 0 4px 4px 0;
      background: #38bdf8;
      box-shadow: 0 0 10px #38bdf8;
    }

    /* Cards - Executive Glassmorphism */
    body.dark-mode .card {
      background: linear-gradient(145deg, rgba(18, 25, 41, 0.72) 0%, rgba(12, 17, 29, 0.82) 100%) !important;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--dora-border) !important;
      border-radius: 20px !important;
      box-shadow: 0 12px 32px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06) !important;
      overflow: hidden;
      margin-bottom: 22px;
    }
    body.dark-mode .card-header {
      background: transparent !important;
      border-bottom: 1px solid var(--dora-border) !important;
      padding: 16px 22px !important;
    }
    body.dark-mode .card-body {
      padding: 22px !important;
    }

    /* =========================================================================
       MINIMAL EXECUTIVE STAT CARD (.stat-card)
       Clean, spacious, no-clutter KPI widgets
       ========================================================================= */
    .stat-card {
      background: rgba(15, 23, 42, 0.72);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--dora-border);
      border-radius: 16px;
      padding: 18px 20px;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: pointer;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
    }
    .stat-card:hover {
      background: rgba(22, 33, 58, 0.85);
      border-color: rgba(255, 255, 255, 0.16);
      transform: translateY(-2px);
      box-shadow: 0 10px 24px -6px rgba(0, 0, 0, 0.45);
    }
    .stat-card .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .stat-card .stat-label {
      font-size: 0.82rem;
      font-weight: 600;
      color: #94a3b8;
      letter-spacing: 0.01em;
    }
    .stat-card .stat-icon {
      font-size: 15px;
      opacity: 0.85;
    }
    .stat-card .stat-value {
      font-size: 2.2rem;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.1;
      margin-bottom: 6px;
      letter-spacing: -0.025em;
    }
    .stat-card .stat-subtext {
      font-size: 0.78rem;
      color: #94a3b8;
    }

    /* Tables Enhancement */
    body.dark-mode .table {
      --bs-table-bg: transparent !important;
      --bs-table-striped-bg: rgba(255, 255, 255, 0.015) !important;
      --bs-table-hover-bg: rgba(255, 255, 255, 0.04) !important;
      color: #cbd5e1 !important;
      border-color: rgba(255, 255, 255, 0.06) !important;
    }
    body.dark-mode .table thead th {
      background: rgba(15, 23, 42, 0.85) !important;
      color: #94a3b8 !important;
      font-size: 0.74rem !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.07em !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
      padding: 14px 16px !important;
    }
    body.dark-mode .table tbody td {
      padding: 14px 16px !important;
      border-color: rgba(255, 255, 255, 0.05) !important;
      vertical-align: middle;
    }

    /* Badges */
    .badge {
      border-radius: 9999px;
      padding: 5px 10px;
      font-weight: 700;
      font-size: 11px;
      letter-spacing: 0.02em;
    }
    .badge-oa {
      background: rgba(245, 158, 11, 0.16) !important;
      color: #fbbf24 !important;
      border: 1px solid rgba(245, 158, 11, 0.35) !important;
    }
    .badge-verified {
      background: rgba(56, 189, 248, 0.16) !important;
      color: #38bdf8 !important;
      border: 1px solid rgba(56, 189, 248, 0.35) !important;
    }

    /* Avatars */
    .avatar-img-sm {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      object-fit: cover;
      border: 1.5px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    .avatar-fallback-sm {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, #0284c7, #3b82f6);
      color: #fff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
    }

    /* Form Controls */
    .form-control, .form-select {
      background-color: rgba(15, 23, 42, 0.8) !important;
      border: 1px solid var(--dora-border) !important;
      color: #f1f5f9 !important;
      border-radius: 12px !important;
      font-size: 0.88rem;
    }
    .form-control:focus, .form-select:focus {
      background-color: rgba(15, 23, 42, 0.95) !important;
      border-color: #38bdf8 !important;
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2) !important;
      color: #ffffff !important;
    }

    /* Buttons */
    .btn {
      border-radius: 10px;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    /* Mobile Mockup Preview */
    .phone-mockup {
      width: 310px;
      margin: 0 auto;
      background: #0d121f;
      border: 9px solid #1e293b;
      border-radius: 38px;
      padding: 18px 14px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(59, 130, 246, 0.1);
    }
    .phone-notch {
      width: 100px;
      height: 18px;
      background: #1e293b;
      border-radius: 0 0 12px 12px;
      margin: -18px auto 16px;
    }
    .phone-notif-bubble {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      padding: 12px;
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
      max-width: 440px;
      background: linear-gradient(145deg, rgba(20, 28, 48, 0.85) 0%, rgba(12, 17, 30, 0.95) 100%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 26px;
      padding: 40px 34px;
      box-shadow: 0 24px 70px rgba(0, 0, 0, 0.7), 0 0 40px rgba(56, 189, 248, 0.15);
      text-align: center;
    }

    /* Monospace UID text */
    .font-mono {
      font-family: var(--font-mono) !important;
    }

    /* Nav Tab Sections */
    .tab-section {
      display: none;
    }
    .tab-section.active {
      display: block;
      animation: fadeIn 0.28s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body class="hold-transition sidebar-mini layout-fixed layout-navbar-fixed dark-mode">

  <!-- =========================================================================
       1. AUTHENTICATION OVERLAY GATE (Admin Secret Verification)
       ========================================================================= -->
  <div id="auth-overlay">
    <div class="login-box-card">
      <div class="mb-3">
        <div class="brand-icon-box" style="width: 58px; height: 58px; font-size: 26px; border-radius: 16px; margin: 0 auto;">
          <i class="fas fa-shield-halved"></i>
        </div>
      </div>
      <h3 class="fw-bold text-white mb-1">Dorabox Admin Portal</h3>
      <p class="text-muted small mb-4">Hệ thống điều hành Trung tâm Mạng xã hội Dorabox (AdminLTE v4)</p>

      <div class="text-start mb-3">
        <label class="form-label text-uppercase small text-muted fw-bold">Admin Secret Key</label>
        <div class="input-group">
          <span class="input-group-text bg-dark border-secondary text-secondary">
            <i class="fas fa-key"></i>
          </span>
          <input type="password" id="admin-pass-input" class="form-control bg-dark border-secondary text-white font-mono" placeholder="Nhập khóa bảo mật Quản trị..." autofocus autocomplete="off">
        </div>
      </div>

      <button id="btn-unlock-gate" class="btn btn-primary w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2">
        <i class="fas fa-unlock"></i>
        <span>Xác Thực & Đăng Nhập</span>
      </button>

      <div class="mt-4 pt-3 border-top border-secondary small text-muted d-flex justify-content-between align-items-center">
        <span><i class="fas fa-lock me-1"></i> Zero-Trust Security</span>
        <span class="badge bg-secondary">v1.1.2 Production</span>
      </div>
    </div>
  </div>

  <!-- =========================================================================
       2. ADMINLTE WRAPPER
       ========================================================================= -->
  <div class="wrapper">

    <!-- Top Navbar -->
    <nav class="main-header navbar navbar-expand navbar-dark">
      <!-- Left navbar links -->
      <ul class="navbar-nav align-items-center">
        <li class="nav-item">
          <a class="nav-link" data-widget="pushmenu" href="#" role="button" title="Thu gọn / Mở rộng Menu">
            <i class="fas fa-bars"></i>
          </a>
        </li>
        <li class="nav-item d-none d-md-inline-block">
          <a href="javascript:void(0)" onclick="switchTab('tong-quan')" class="nav-link">
            <i class="fas fa-gauge-high me-1 text-info"></i> Tổng Quan
          </a>
        </li>
        <li class="nav-item d-none d-md-inline-block">
          <a href="javascript:void(0)" onclick="switchTab('thanh-vien')" class="nav-link">
            <i class="fas fa-users me-1 text-primary"></i> Thành Viên
          </a>
        </li>
        <li class="nav-item d-none d-md-inline-block">
          <a href="javascript:void(0)" onclick="switchTab('duyet-oa')" class="nav-link">
            <i class="fas fa-certificate me-1 text-warning"></i> Xét Duyệt OA 
            <span id="nav-oa-badge" class="badge bg-warning text-dark ms-1" style="display:none;">0</span>
          </a>
        </li>
        <li class="nav-item d-none d-md-inline-block">
          <a href="javascript:void(0)" onclick="switchTab('he-thong')" class="nav-link">
            <i class="fas fa-server me-1 text-teal" style="color:#2dd4bf;"></i> Hạ Tầng Cloud
          </a>
        </li>
      </ul>

      <!-- Right navbar links -->
      <ul class="navbar-nav ms-auto align-items-center gap-2">
        <!-- Quick Refresh -->
        <li class="nav-item">
          <a class="navbar-action-btn" href="javascript:void(0)" id="btn-refresh-data" title="Làm mới toàn bộ dữ liệu">
            <i class="fas fa-arrows-rotate"></i>
          </a>
        </li>

        <!-- Notifications Dropdown -->
        <li class="nav-item dropdown">
          <a class="navbar-action-btn position-relative" data-bs-toggle="dropdown" href="#" role="button" title="Thông báo hệ thống">
            <i class="far fa-bell"></i>
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" id="top-report-badge" style="font-size: 10px;">0</span>
          </a>
          <div class="dropdown-menu dropdown-menu-lg dropdown-menu-end" style="background: rgba(17, 24, 39, 0.95); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; box-shadow: 0 16px 40px rgba(0,0,0,0.6);">
            <div class="px-3 py-2 border-bottom border-secondary text-white fw-bold d-flex align-items-center justify-content-between">
              <span id="dropdown-header-notif">0 Thông báo cần xử lý</span>
              <span class="badge bg-primary">Thời gian thực</span>
            </div>
            <a href="javascript:void(0)" onclick="switchTab('bao-cao')" class="dropdown-item py-2 px-3 text-white d-flex align-items-center justify-content-between">
              <div>
                <i class="fas fa-triangle-exclamation text-danger me-2"></i>
                <span id="dropdown-reports-text">0 Báo cáo vi phạm</span>
              </div>
              <span class="badge bg-danger rounded-pill">Xử lý</span>
            </a>
            <div class="dropdown-divider my-0 border-secondary"></div>
            <a href="javascript:void(0)" onclick="switchTab('duyet-oa')" class="dropdown-item py-2 px-3 text-white d-flex align-items-center justify-content-between">
              <div>
                <i class="fas fa-certificate text-warning me-2"></i>
                <span id="dropdown-oa-text">0 Yêu cầu cấp OA</span>
              </div>
              <span class="badge bg-warning text-dark rounded-pill">Duyệt ngay</span>
            </a>
          </div>
        </li>

        <!-- Dark / Light Mode Switch -->
        <li class="nav-item">
          <a class="navbar-action-btn" href="javascript:void(0)" id="btn-toggle-dark-mode" title="Đổi chế độ Sáng / Tối">
            <i class="fas fa-sun" id="theme-toggle-icon"></i>
          </a>
        </li>

        <!-- Fullscreen -->
        <li class="nav-item d-none d-sm-inline-flex">
          <a class="navbar-action-btn" data-widget="fullscreen" href="#" role="button" title="Toàn màn hình">
            <i class="fas fa-expand-arrows-alt"></i>
          </a>
        </li>

        <!-- Logout Button -->
        <li class="nav-item">
          <a class="navbar-action-btn text-danger border-danger-subtle" href="javascript:void(0)" id="btn-logout" title="Đăng xuất khỏi hệ thống">
            <i class="fas fa-arrow-right-from-bracket"></i>
          </a>
        </li>
      </ul>
    </nav>

    <!-- Main Sidebar Container -->
    <aside class="main-sidebar sidebar-dark-primary elevation-4">
      <!-- Brand Logo -->
      <a href="javascript:void(0)" onclick="switchTab('tong-quan')" class="brand-link d-flex align-items-center">
        <div class="brand-icon-box">
          <i class="fas fa-box-open"></i>
        </div>
        <div class="d-flex flex-column">
          <span class="brand-text fw-bold text-white fs-6" style="letter-spacing: -0.02em;">Dorabox Admin</span>
          <span class="text-info fw-semibold" style="font-size: 11px; opacity: 0.9;">Control Center v1.1.2</span>
        </div>
      </a>

      <!-- Sidebar -->
      <div class="sidebar">
        <!-- Sidebar user panel -->
        <div class="user-panel d-flex align-items-center">
          <div class="image">
            <div class="avatar-fallback-sm">AD</div>
          </div>
          <div class="info ms-2 overflow-hidden">
            <div class="fw-bold text-white text-truncate" style="font-size: 0.88rem; max-width: 145px;">SuperAdministrator</div>
            <div class="d-flex align-items-center gap-1 mt-1">
              <span style="width: 7px; height: 7px; border-radius: 50%; background: #22c55e; display: inline-block; box-shadow: 0 0 8px #22c55e;"></span>
              <span class="text-success small fw-semibold" style="font-size: 10.5px;">Trực Tuyến Root</span>
            </div>
          </div>
        </div>

        <!-- Sidebar Search -->
        <div class="px-3 mb-3">
          <div class="input-group">
            <input class="form-control form-control-sm bg-dark border-secondary text-white" type="search" id="sidebar-search-input" placeholder="Tìm tính năng..." aria-label="Search" style="border-radius: 10px 0 0 10px !important;">
            <button class="btn btn-sm btn-dark border-secondary text-secondary" style="border-radius: 0 10px 10px 0 !important;">
              <i class="fas fa-search fa-fw"></i>
            </button>
          </div>
        </div>

        <!-- Sidebar Menu -->
        <nav class="mt-2 px-2">
          <ul class="nav nav-pills nav-sidebar flex-column nav-child-indent" data-widget="treeview" role="menu" data-accordion="false">
            
            <li class="nav-header text-uppercase small text-muted fw-bold px-2 mb-1" style="font-size: 10px; letter-spacing: 0.08em;">QUẢN TRỊ NỘI DUNG</li>

            <li class="nav-item">
              <a href="javascript:void(0)" class="nav-link active" data-tab="tong-quan">
                <i class="nav-icon fas fa-gauge-high text-info"></i>
                <p>Tổng Quan Hệ Thống</p>
              </a>
            </li>

            <li class="nav-item">
              <a href="javascript:void(0)" class="nav-link" data-tab="thanh-vien">
                <i class="nav-icon fas fa-users text-primary"></i>
                <p>
                  Thành Viên
                  <span class="badge bg-primary float-end" id="sidebar-user-badge">0</span>
                </p>
              </a>
            </li>

            <li class="nav-item">
              <a href="javascript:void(0)" class="nav-link" data-tab="duyet-oa">
                <i class="nav-icon fas fa-certificate text-warning"></i>
                <p>
                  Xét Duyệt Tích & OA
                  <span class="badge bg-warning text-dark float-end" id="sidebar-oa-badge" style="display:none;">0</span>
                </p>
              </a>
            </li>

            <li class="nav-item">
              <a href="javascript:void(0)" class="nav-link" data-tab="bai-viet">
                <i class="nav-icon fas fa-newspaper text-success"></i>
                <p>Bài Viết & Bảng Tin</p>
              </a>
            </li>

            <li class="nav-item">
              <a href="javascript:void(0)" class="nav-link" data-tab="binh-luan">
                <i class="nav-icon fas fa-comments text-cyan"></i>
                <p>Bình Luận Thảo Luận</p>
              </a>
            </li>

            <li class="nav-item">
              <a href="javascript:void(0)" class="nav-link" data-tab="bao-cao">
                <i class="nav-icon fas fa-triangle-exclamation text-danger"></i>
                <p>
                  Báo Cáo Vi Phạm
                  <span class="badge bg-danger float-end" id="sidebar-report-badge">0</span>
                </p>
              </a>
            </li>

            <li class="nav-header text-uppercase small text-muted fw-bold px-2 mt-3 mb-1" style="font-size: 10px; letter-spacing: 0.08em;">ĐIỀU HÀNH & KỸ THUẬT</li>

            <li class="nav-item">
              <a href="javascript:void(0)" class="nav-link" data-tab="phat-thong-bao">
                <i class="nav-icon fas fa-bullhorn text-purple" style="color: #c084fc;"></i>
                <p>Phát Sóng Push FCM</p>
              </a>
            </li>

            <li class="nav-item">
              <a href="javascript:void(0)" class="nav-link" data-tab="bao-mat-audit">
                <i class="nav-icon fas fa-shield-virus text-indigo" style="color: #818cf8;"></i>
                <p>Audit Log & Bảo Mật</p>
              </a>
            </li>

            <li class="nav-item">
              <a href="javascript:void(0)" class="nav-link" data-tab="he-thong">
                <i class="nav-icon fas fa-server text-teal" style="color: #2dd4bf;"></i>
                <p>Hạ Tầng & Cloud R2</p>
              </a>
            </li>

          </ul>
        </nav>
      </div>
    </aside>

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper p-3 p-md-4">
      <!-- Content Header (Page header) -->
      <div class="content-header pb-2 mb-2">
        <div class="container-fluid">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h4 class="m-0 fw-bold text-white" id="topbar-title" style="letter-spacing: -0.02em;">Tổng Quan Hệ Thống</h4>
              <p class="text-muted small mb-0" id="topbar-subtitle">Chỉ số vận hành mạng xã hội Dorabox</p>
            </div>
            <div>
              <button class="btn btn-sm btn-outline-secondary text-light px-3 py-1 rounded-pill" onclick="loadDashboardData()" title="Làm mới dữ liệu">
                <i class="fas fa-rotate me-1 text-info"></i> Làm mới
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main content -->
      <section class="content">
        <div class="container-fluid">

          <!-- =========================================================================
               TAB 1: TỔNG QUAN (DASHBOARD) - CLEAN, MINIMAL & SPACIOUS
               ========================================================================= -->
          <div id="tab-tong-quan" class="tab-section active">
            
            <!-- 4 CLEAN KPI STAT CARDS (SINGLE ROW) -->
            <div class="row g-3 mb-3">
              <!-- KPI 1: Tổng Thành Viên -->
              <div class="col-xl-3 col-md-6 col-12">
                <div class="stat-card" onclick="switchTab('thanh-vien')">
                  <div class="stat-header">
                    <span class="stat-label">Tổng Thành Viên</span>
                    <i class="fas fa-users stat-icon text-info"></i>
                  </div>
                  <div class="stat-value" id="kpi-users">0</div>
                  <div class="stat-subtext">
                    <span class="text-info fw-semibold" id="kpi-verified">0</span> đã xác minh
                  </div>
                </div>
              </div>

              <!-- KPI 2: Bài Viết Bảng Tin -->
              <div class="col-xl-3 col-md-6 col-12">
                <div class="stat-card" onclick="switchTab('bai-viet')">
                  <div class="stat-header">
                    <span class="stat-label">Bài Viết Bảng Tin</span>
                    <i class="fas fa-newspaper stat-icon text-success"></i>
                  </div>
                  <div class="stat-value" id="kpi-posts">0</div>
                  <div class="stat-subtext">
                    <span class="text-success fw-semibold" id="kpi-comments">0</span> bình luận
                  </div>
                </div>
              </div>

              <!-- KPI 3: Tài Khoản Tích Vàng / OA -->
              <div class="col-xl-3 col-md-6 col-12">
                <div class="stat-card" onclick="switchTab('duyet-oa')">
                  <div class="stat-header">
                    <span class="stat-label">Tài Khoản Tích Vàng / OA</span>
                    <i class="fas fa-certificate stat-icon text-warning"></i>
                  </div>
                  <div class="stat-value" id="kpi-vip">0</div>
                  <div class="stat-subtext">
                    <span class="text-warning fw-semibold" id="kpi-oa-pending">0</span> yêu cầu chờ duyệt
                  </div>
                </div>
              </div>

              <!-- KPI 4: Báo Cáo Vi Phạm -->
              <div class="col-xl-3 col-md-6 col-12">
                <div class="stat-card" onclick="switchTab('bao-cao')">
                  <div class="stat-header">
                    <span class="stat-label">Báo Cáo Vi Phạm</span>
                    <i class="fas fa-shield-halved stat-icon text-danger"></i>
                  </div>
                  <div class="stat-value text-danger" id="kpi-banned">0</div>
                  <div class="stat-subtext">
                    <span class="text-danger fw-semibold" id="reports-pending-count">0</span> chờ xử lý
                  </div>
                </div>
              </div>
            </div>

            <!-- CHARTS SECTION - IMMEDIATELY VISIBLE & SPACIOUS -->
            <div class="row g-3">
              <div class="col-lg-8">
                <div class="card h-100">
                  <div class="card-header border-0 d-flex justify-content-between align-items-center">
                    <h6 class="fw-bold m-0 text-white">
                      <i class="fas fa-chart-line text-info me-2"></i> Xu Hướng Hoạt Động & Tăng Trưởng
                    </h6>
                    <span class="text-muted small">Thời gian thực</span>
                  </div>
                  <div class="card-body pt-0">
                    <canvas id="growthChart" style="min-height: 280px; height: 280px; max-height: 280px; max-width: 100%;"></canvas>
                  </div>
                </div>
              </div>

              <div class="col-lg-4">
                <div class="card h-100">
                  <div class="card-header border-0 d-flex justify-content-between align-items-center">
                    <h6 class="fw-bold m-0 text-white">
                      <i class="fas fa-chart-pie text-warning me-2"></i> Phân Bổ Dữ Liệu
                    </h6>
                  </div>
                  <div class="card-body pt-0 d-flex align-items-center justify-content-center">
                    <canvas id="distributionChart" style="min-height: 280px; height: 280px; max-height: 280px; max-width: 100%;"></canvas>
                  </div>
                </div>
              </div>
            </div>

            <!-- QUICK ACTION TOOLBAR - COMPACT & CLEAN -->
            <div class="card mt-3">
              <div class="card-body p-3">
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
                  <div class="text-muted small fw-semibold text-uppercase" style="letter-spacing: 0.05em;">
                    <i class="fas fa-bolt text-warning me-1"></i> Thao tác nhanh:
                  </div>
                  <div class="d-flex flex-wrap gap-2">
                    <button class="btn btn-sm btn-dark border-secondary text-light px-3 py-2" onclick="switchTab('phat-thong-bao')">
                      <i class="fas fa-bullhorn text-purple me-1" style="color: #c084fc;"></i> Phát Push FCM
                    </button>
                    <button class="btn btn-sm btn-dark border-secondary text-light px-3 py-2" onclick="cleanSpamReactions()">
                      <i class="fas fa-broom text-warning me-1"></i> Dọn Rác Spam
                    </button>
                    <button class="btn btn-sm btn-dark border-secondary text-light px-3 py-2" onclick="switchTab('duyet-oa')">
                      <i class="fas fa-certificate text-warning me-1"></i> Xét Duyệt OA
                    </button>
                    <button class="btn btn-sm btn-dark border-secondary text-light px-3 py-2" onclick="switchTab('he-thong')">
                      <i class="fas fa-server text-teal me-1" style="color: #2dd4bf;"></i> Kiểm Tra Máy Chủ
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- =========================================================================
               TAB 2: THÀNH VIÊN (USERS)
               ========================================================================= -->
          <div id="tab-thanh-vien" class="tab-section">
            <div class="card">
              <div class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
                <h5 class="card-title fw-bold m-0"><i class="fas fa-users text-info me-2"></i> Quản Lý Danh Sách Người Dùng</h5>
                <div class="d-flex gap-2">
                  <input type="text" id="user-search-input" class="form-control form-control-sm bg-dark border-secondary text-white" placeholder="Tìm theo tên, @username, UID..." style="width: 250px;">
                  <select id="user-role-filter" class="form-select form-select-sm bg-dark border-secondary text-white" style="width: 140px;">
                    <option value="all">Tất cả quyền</option>
                    <option value="oa">Tài khoản OA</option>
                    <option value="mod">Moderator</option>
                    <option value="admin">Admin</option>
                    <option value="banned">Bị khóa</option>
                  </select>
                </div>
              </div>
              <div class="card-body table-responsive p-0">
                <table class="table table-hover table-striped align-middle mb-0">
                  <thead class="table-dark">
                    <tr>
                      <th>Thành Viên</th>
                      <th>Mã Định Danh (@)</th>
                      <th>Cấp Bậc & Quyền</th>
                      <th>Huy Hiệu Tích</th>
                      <th>Trạng Thái</th>
                      <th>Ngày Tạo</th>
                      <th class="text-end">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody id="users-table-body">
                    <tr><td colspan="7" class="text-center py-4 text-muted">Đang tải danh sách thành viên...</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- =========================================================================
               TAB 3: XÉT DUYỆT TÍCH & OA (OA REQUESTS)
               ========================================================================= -->
          <div id="tab-duyet-oa" class="tab-section">
            <div class="card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="card-title fw-bold m-0"><i class="fas fa-certificate text-warning me-2"></i> Hàng Đợi Xét Duyệt Thông Tin Official Account</h5>
                <button class="btn btn-sm btn-outline-warning" onclick="fetchOaRequests(true)">
                  <i class="fas fa-arrows-rotate me-1"></i> Làm mới yêu cầu
                </button>
              </div>
              <div class="card-body">
                <div id="oa-requests-container">
                  <div class="text-center py-4 text-muted">Đang kiểm tra các đề xuất thay đổi OA...</div>
                </div>
              </div>
            </div>
          </div>

          <!-- =========================================================================
               TAB 4: BÀI VIẾT (POSTS)
               ========================================================================= -->
          <div id="tab-bai-viet" class="tab-section">
            <div class="card">
              <div class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
                <h5 class="card-title fw-bold m-0"><i class="fas fa-newspaper text-success me-2"></i> Quản Lý Bảng Tin & Bài Viết</h5>
                <input type="text" id="post-search-input" class="form-control form-control-sm bg-dark border-secondary text-white" placeholder="Tìm kiếm nội dung bài viết..." style="width: 260px;">
              </div>
              <div class="card-body table-responsive p-0">
                <table class="table table-hover table-striped align-middle mb-0">
                  <thead class="table-dark">
                    <tr>
                      <th>Tác Giả</th>
                      <th style="max-width: 320px;">Nội Dung</th>
                      <th>Hình Ảnh Đính Kèm</th>
                      <th>Tương Tác</th>
                      <th>Ghim</th>
                      <th>Thời Gian</th>
                      <th class="text-end">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody id="posts-table-body">
                    <tr><td colspan="7" class="text-center py-4 text-muted">Đang tải danh sách bài viết...</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- =========================================================================
               TAB 5: BÌNH LUẬN (COMMENTS)
               ========================================================================= -->
          <div id="tab-binh-luan" class="tab-section">
            <div class="card">
              <div class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
                <h5 class="card-title fw-bold m-0"><i class="fas fa-comments text-cyan me-2"></i> Quản Lý Thảo Luận & Bình Luận</h5>
                <input type="text" id="comment-search-input" class="form-control form-control-sm bg-dark border-secondary text-white" placeholder="Tìm nội dung bình luận..." style="width: 260px;">
              </div>
              <div class="card-body table-responsive p-0">
                <table class="table table-hover table-striped align-middle mb-0">
                  <thead class="table-dark">
                    <tr>
                      <th>Người Bình Luận</th>
                      <th>Nội Dung</th>
                      <th>Bài Viết Liên Quan</th>
                      <th>Thời Gian</th>
                      <th class="text-end">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody id="comments-table-body">
                    <tr><td colspan="5" class="text-center py-4 text-muted">Đang tải danh sách bình luận...</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- =========================================================================
               TAB 6: BÁO CÁO VI PHẠM (REPORTS)
               ========================================================================= -->
          <div id="tab-bao-cao" class="tab-section">
            <div class="card">
              <div class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
                <h5 class="card-title fw-bold m-0"><i class="fas fa-triangle-exclamation text-danger me-2"></i> Hàng Đợi Báo Cáo & Xử Lý Vi Phạm</h5>
                <span class="badge bg-danger" id="reports-pending-count">0 Chờ xử lý</span>
              </div>
              <div class="card-body table-responsive p-0">
                <table class="table table-hover table-striped align-middle mb-0">
                  <thead class="table-dark">
                    <tr>
                      <th>Người Báo Cáo</th>
                      <th>Mục Tiêu</th>
                      <th>Lý Do / Chi Tiết</th>
                      <th>Trạng Thái</th>
                      <th>Thời Gian</th>
                      <th class="text-end">Phán Quyết</th>
                    </tr>
                  </thead>
                  <tbody id="reports-table-body">
                    <tr><td colspan="6" class="text-center py-4 text-muted">Đang tải danh sách báo cáo...</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- =========================================================================
               TAB 7: PHÁT SÓNG THÔNG BÁO (BROADCAST STUDIO)
               ========================================================================= -->
          <div id="tab-phat-thong-bao" class="tab-section">
            <div class="row">
              <div class="col-lg-7">
                <div class="card">
                  <div class="card-header">
                    <h5 class="card-title fw-bold m-0"><i class="fas fa-bullhorn text-purple me-2"></i> Soạn Thảo Push Notification & Broadcast</h5>
                  </div>
                  <div class="card-body">
                    <div class="mb-3">
                      <label class="form-label fw-bold small text-uppercase">Tiêu đề thông báo <span class="text-danger">*</span></label>
                      <input type="text" id="broadcast-title-input" class="form-control bg-dark border-secondary text-white" placeholder="Ví dụ: 🚀 Dorabox Cập Nhật Phiên Bản 1.1.2!">
                    </div>

                    <div class="mb-3">
                      <label class="form-label fw-bold small text-uppercase">Nội dung chi tiết <span class="text-danger">*</span></label>
                      <textarea id="broadcast-body-input" rows="5" class="form-control bg-dark border-secondary text-white" placeholder="Nhập nội dung thông báo gửi tới tất cả người dùng ứng dụng..."></textarea>
                    </div>

                    <div class="mb-3">
                      <label class="form-label fw-bold small text-uppercase">Đường dẫn điều hướng (Deep-link tùy chọn)</label>
                      <input type="text" id="broadcast-link-input" class="form-control bg-dark border-secondary text-white font-mono" placeholder="https://doraboxcdn.zpiltk.io.vn/apk/Dorabox-arm64-v8a.apk hoặc dorabox://update">
                    </div>

                    <div class="alert alert-info py-2 small border-0">
                      <i class="fas fa-info-circle me-1"></i> Thông báo này sẽ được phát qua <strong>Firebase Cloud Messaging v1 (FCM)</strong> đồng thời ghi trực tiếp vào Hộp thông báo của tất cả thành viên.
                    </div>

                    <button id="btn-send-broadcast" class="btn btn-primary w-100 py-2 fw-bold">
                      <i class="fas fa-paper-plane me-1"></i> Bắt Đầu Phát Sóng Toàn Hệ Thống
                    </button>
                  </div>
                </div>
              </div>

              <!-- Phone Mockup Live Preview -->
              <div class="col-lg-5">
                <div class="card">
                  <div class="card-header">
                    <h5 class="card-title fw-bold m-0"><i class="fas fa-mobile-screen text-info me-2"></i> Xem Trước Giao Diện Điện Thoại</h5>
                  </div>
                  <div class="card-body text-center py-4">
                    <div class="phone-mockup text-start">
                      <div class="phone-notch"></div>
                      <div class="d-flex justify-content-between align-items-center text-muted small mb-3 px-1">
                        <span>09:41</span>
                        <span><i class="fas fa-wifi me-1"></i><i class="fas fa-battery-full"></i></span>
                      </div>
                      
                      <!-- Notification Preview Bubble -->
                      <div class="phone-notif-bubble">
                        <div class="d-flex align-items-center gap-2 mb-1">
                          <div class="brand-icon-box" style="width: 22px; height: 22px; font-size: 11px; border-radius: 6px; margin: 0;">
                            <i class="fas fa-bell"></i>
                          </div>
                          <span class="fw-bold text-white small">DORABOX</span>
                          <span class="text-muted" style="font-size: 10px;">· Vừa xong</span>
                        </div>
                        <div class="fw-bold text-white small" id="preview-notif-title">Tiêu đề thông báo...</div>
                        <div class="text-muted small mt-1" id="preview-notif-body" style="font-size: 11.5px; line-height: 1.35;">Nội dung thông báo xuất hiện ở đây...</div>
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
            <div class="card">
              <div class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
                <h5 class="card-title fw-bold m-0"><i class="fas fa-shield-halved text-indigo me-2"></i> Nhật Ký Audit An Ninh & Bảo Mật Hệ Thống</h5>
                <button class="btn btn-sm btn-outline-danger" onclick="cleanSpamReactions()">
                  <i class="fas fa-broom me-1"></i> Quét Sạch Phản Ứng Rác (Spam Clean)
                </button>
              </div>
              <div class="card-body table-responsive p-0">
                <table class="table table-hover table-striped align-middle mb-0">
                  <thead class="table-dark">
                    <tr>
                      <th>Thời Gian</th>
                      <th>Loại Sự Kiện</th>
                      <th>Cấp Độ</th>
                      <th>Tác Tử (Actor)</th>
                      <th>Địa Chỉ IP</th>
                      <th>Chi Tiết Nhật Ký</th>
                    </tr>
                  </thead>
                  <tbody id="audit-logs-body">
                    <tr><td colspan="6" class="text-center py-4 text-muted">Đang tải nhật ký bảo mật...</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- =========================================================================
               TAB 9: HẠ TẦNG CLOUD & SYSTEM HEALTH
               ========================================================================= -->
          <div id="tab-he-thong" class="tab-section">
            <div class="row">
              <div class="col-lg-6">
                <div class="card">
                  <div class="card-header">
                    <h5 class="card-title fw-bold m-0"><i class="fas fa-database text-primary me-2"></i> Kết Nối Cơ Sở Dữ Liệu & Storage</h5>
                  </div>
                  <div class="card-body">
                    <ul class="list-group list-group-flush bg-transparent">
                      <li class="list-group-item bg-transparent d-flex justify-content-between align-items-center border-secondary">
                        <div>
                          <div class="fw-bold">Supabase PostgreSQL</div>
                          <small class="text-muted">Lưu trữ người dùng, bài viết, quan hệ bạn bè, tin nhắn</small>
                        </div>
                        <span class="badge bg-success" id="health-supabase">ĐANG KẾT NỐI</span>
                      </li>
                      <li class="list-group-item bg-transparent d-flex justify-content-between align-items-center border-secondary">
                        <div>
                          <div class="fw-bold">Cloudflare R2 Storage CDN</div>
                          <small class="text-muted">Lưu trữ ảnh avatar, hình ảnh bảng tin, video HD</small>
                        </div>
                        <span class="badge bg-success" id="health-r2">SẴN SÀNG</span>
                      </li>
                      <li class="list-group-item bg-transparent d-flex justify-content-between align-items-center border-secondary">
                        <div>
                          <div class="fw-bold">Firebase Cloud Messaging (FCM v1)</div>
                          <small class="text-muted">Đẩy thông báo tức thì, chuông cuộc gọi đến</small>
                        </div>
                        <span class="badge bg-success" id="health-fcm">HOẠT ĐỘNG</span>
                      </li>
                      <li class="list-group-item bg-transparent d-flex justify-content-between align-items-center border-secondary">
                        <div>
                          <div class="fw-bold">Agora RTC Audio/Video Engine</div>
                          <small class="text-muted">Hạ tầng gọi thoại & video call mã hóa P2P</small>
                        </div>
                        <span class="badge bg-success" id="health-agora">ONLINE</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="col-lg-6">
                <div class="card">
                  <div class="card-header">
                    <h5 class="card-title fw-bold m-0"><i class="fas fa-microchip text-teal me-2"></i> Tài Nguyên & Thông Số Máy Chủ</h5>
                  </div>
                  <div class="card-body">
                    <div class="row g-3">
                      <div class="col-6">
                        <div class="p-3 bg-dark rounded-3 border border-secondary text-center">
                          <div class="text-muted small text-uppercase">Thời Gian Hoạt Động</div>
                          <div class="fs-4 fw-bold text-white mt-1" id="health-uptime">99.98%</div>
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="p-3 bg-dark rounded-3 border border-secondary text-center">
                          <div class="text-muted small text-uppercase">Node.js Runtime</div>
                          <div class="fs-4 fw-bold text-info mt-1" id="health-node">v22.x LTS</div>
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="p-3 bg-dark rounded-3 border border-secondary text-center">
                          <div class="text-muted small text-uppercase">Tải Bộ Nhớ (RAM)</div>
                          <div class="fs-4 fw-bold text-warning mt-1" id="health-memory">~145 MB</div>
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="p-3 bg-dark rounded-3 border border-secondary text-center">
                          <div class="text-muted small text-uppercase">Phiên Bản AdminLTE</div>
                          <div class="fs-4 fw-bold text-success mt-1">v4.0.0 Luxe</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div><!-- /.container-fluid -->
      </section>
      <!-- /.content -->
    </div>
    <!-- /.content-wrapper -->

    <footer class="main-footer bg-dark border-secondary small text-muted d-flex justify-content-between">
      <div>
        <strong>Copyright &copy; 2026 <a href="https://dorabox.app" class="text-primary text-decoration-none">Dorabox Social Network</a>.</strong> Toàn bộ quyền được bảo lưu.
      </div>
      <div>
        <b>AdminLTE Edition:</b> 3.2.0 / 4.0 Pro
      </div>
    </footer>
  </div>
  <!-- ./wrapper -->

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

  <!-- jQuery & Bootstrap 5 & AdminLTE JS -->
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/js/adminlte.min.js"></script>
  
  <!-- SweetAlert2 & Chart.js -->
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

    document.addEventListener('DOMContentLoaded', () => {
      initTheme();
      setupTabs();
      setupBroadcastPreview();
      setupSidebarFilter();

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
        document.body.classList.remove('dark-mode');
        document.getElementById('theme-toggle-icon').className = 'fas fa-moon';
      }

      document.getElementById('btn-toggle-dark-mode').addEventListener('click', () => {
        const currentlyDark = document.body.classList.contains('dark-mode');
        if (currentlyDark) {
          document.body.classList.remove('dark-mode');
          document.getElementById('theme-toggle-icon').className = 'fas fa-moon';
          localStorage.setItem('dorabox_admin_theme', 'light');
        } else {
          document.body.classList.add('dark-mode');
          document.getElementById('theme-toggle-icon').className = 'fas fa-sun';
          localStorage.setItem('dorabox_admin_theme', 'dark');
        }
      });
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
        confirmButtonText: 'Đăng xuất ngay'
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem('dorabox_admin_token');
          adminToken = '';
          location.reload();
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
          document.getElementById('top-report-badge').textContent = pendingRep;
          document.getElementById('reports-pending-count').textContent = pendingRep + ' Chờ xử lý';
          document.getElementById('dropdown-reports-text').textContent = pendingRep + ' Báo cáo vi phạm';

          const pendingOa = Number(m.pendingOaRequests || 0);
          document.getElementById('kpi-oa-pending').textContent = pendingOa;
          const oaBadge = document.getElementById('sidebar-oa-badge');
          const navOaBadge = document.getElementById('nav-oa-badge');
          if (oaBadge) {
            oaBadge.textContent = pendingOa;
            oaBadge.style.display = pendingOa > 0 ? 'inline-block' : 'none';
          }
          if (navOaBadge) {
            navOaBadge.textContent = pendingOa;
            navOaBadge.style.display = pendingOa > 0 ? 'inline-block' : 'none';
          }
          document.getElementById('dropdown-oa-text').textContent = pendingOa + ' Đề xuất OA';
          document.getElementById('dropdown-header-notif').textContent = (pendingRep + pendingOa) + ' Thông báo cần xử lý';

          renderCharts(m);
        }
      } catch (err) {
        console.error('Fetch metrics error:', err);
      }
    }

    function renderCharts(m) {
      // 1. Line Growth Chart
      const ctxGrowth = document.getElementById('growthChart');
      if (ctxGrowth) {
        if (growthChartInstance) growthChartInstance.destroy();

        // Create gradient fills
        const chartCtx = ctxGrowth.getContext('2d');
        const blueGrad = chartCtx.createLinearGradient(0, 0, 0, 260);
        blueGrad.addColorStop(0, 'rgba(56, 189, 248, 0.28)');
        blueGrad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

        const greenGrad = chartCtx.createLinearGradient(0, 0, 0, 260);
        greenGrad.addColorStop(0, 'rgba(52, 211, 153, 0.22)');
        greenGrad.addColorStop(1, 'rgba(52, 211, 153, 0.0)');

        growthChartInstance = new Chart(ctxGrowth, {
          type: 'line',
          data: {
            labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN (Hôm nay)'],
            datasets: [
              {
                label: 'Thành viên mới',
                data: [12, 19, 25, 32, 45, 58, Number(m.totalUsers || 70)],
                borderColor: '#38bdf8',
                backgroundColor: blueGrad,
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointBackgroundColor: '#38bdf8',
                pointBorderColor: '#0b101d',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 7
              },
              {
                label: 'Bài viết & Tương tác',
                data: [35, 48, 62, 85, 110, 145, Number(m.totalPosts || 160)],
                borderColor: '#34d399',
                backgroundColor: greenGrad,
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointBackgroundColor: '#34d399',
                pointBorderColor: '#0b101d',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 7
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { 
                labels: { 
                  color: '#cbd5e1', 
                  font: { family: 'Plus Jakarta Sans', weight: '600', size: 12 },
                  usePointStyle: true,
                  boxWidth: 8
                } 
              },
              tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.92)',
                titleColor: '#ffffff',
                bodyColor: '#e2e8f0',
                borderColor: 'rgba(255, 255, 255, 0.12)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 12,
                bodyFont: { family: 'Plus Jakarta Sans' },
                titleFont: { family: 'Plus Jakarta Sans', weight: '700' }
              }
            },
            scales: {
              x: { 
                ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans' } }, 
                grid: { color: 'rgba(255, 255, 255, 0.04)' } 
              },
              y: { 
                ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans' } }, 
                grid: { color: 'rgba(255, 255, 255, 0.04)' } 
              }
            }
          }
        });
      }

      // 2. Distribution Doughnut Chart
      const ctxDist = document.getElementById('distributionChart');
      if (ctxDist) {
        if (distributionChartInstance) distributionChartInstance.destroy();
        distributionChartInstance = new Chart(ctxDist, {
          type: 'doughnut',
          data: {
            labels: ['Người dùng', 'Bài viết', 'Bình luận', 'Báo cáo vi phạm'],
            datasets: [{
              data: [
                Number(m.totalUsers || 10),
                Number(m.totalPosts || 15),
                Number(m.totalComments || 25),
                Number(m.pendingReports || 2)
              ],
              backgroundColor: ['#38bdf8', '#34d399', '#fbbf24', '#f43f5e'],
              borderColor: '#0f172a',
              borderWidth: 3,
              hoverOffset: 8
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '72%',
            plugins: {
              legend: { 
                position: 'bottom', 
                labels: { 
                  color: '#cbd5e1', 
                  boxWidth: 10,
                  usePointStyle: true,
                  font: { family: 'Plus Jakarta Sans', weight: '600', size: 11 },
                  padding: 14
                } 
              },
              tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.92)',
                borderColor: 'rgba(255, 255, 255, 0.12)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 12,
                bodyFont: { family: 'Plus Jakarta Sans' }
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
          renderUsersTable(allUsersCache);

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
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">Không tìm thấy thành viên nào.</td></tr>';
        return;
      }

      tbody.innerHTML = users.map(u => {
        const initial = (u.display_name || u.username || 'U').charAt(0).toUpperCase();
        const avatarHtml = u.avatar_url 
          ? \`<img class="avatar-img-sm me-2" src="\${u.avatar_url}" alt="\${escapeHtml(u.display_name)}" onerror="this.outerHTML='<div class=\\'avatar-fallback-sm me-2\\'>\${initial}</div>'" />\`
          : \`<div class="avatar-fallback-sm me-2">\${initial}</div>\`;

        const roleBadge = u.role === 'admin'
          ? '<span class="badge bg-danger">ADMIN</span>'
          : (u.role === 'mod' ? '<span class="badge bg-purple" style="background:#a855f7;">MODERATOR</span>' : (u.is_oa ? '<span class="badge badge-oa">OFFICIAL ACCOUNT</span>' : '<span class="badge bg-secondary">MEMBER</span>'));

        let tickBadges = '';
        if (u.is_oa || u.account_type === 'oa') {
          tickBadges += '<span class="badge badge-oa me-1"><i class="fas fa-certificate me-1"></i>Tích Vàng OA</span>';
        } else if (u.is_verified) {
          tickBadges += '<span class="badge badge-verified me-1"><i class="fas fa-check-circle me-1"></i>Tích Xanh</span>';
        }
        if (u.is_vip) {
          tickBadges += '<span class="badge bg-warning text-dark me-1"><i class="fas fa-crown me-1"></i>VIP</span>';
        }
        if (!tickBadges) tickBadges = '<span class="text-muted small">-</span>';

        const statusBadge = u.is_banned
          ? '<span class="badge bg-danger"><i class="fas fa-ban me-1"></i>Bị Khóa</span>'
          : '<span class="badge bg-success"><i class="fas fa-check me-1"></i>Hoạt Động</span>';

        const joinDate = u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : '-';

        return \`
          <tr>
            <td>
              <div class="d-flex align-items-center">
                \${avatarHtml}
                <div>
                  <div class="fw-bold text-white">\${escapeHtml(u.display_name || 'Chưa đặt tên')}</div>
                  <div class="text-muted small font-mono" style="font-size: 11px;">UID: \${u.id.substring(0, 8)}...</div>
                </div>
              </div>
            </td>
            <td><span class="font-mono text-info">@\${escapeHtml(u.username || '')}</span></td>
            <td>\${roleBadge}</td>
            <td>\${tickBadges}</td>
            <td>\${statusBadge}</td>
            <td class="small">\${joinDate}</td>
            <td class="text-end">
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-info" title="Cấp / Hủy Tích Xanh" onclick="toggleVerify('\${u.id}', \${!u.is_verified})">
                  <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-outline-warning" title="Cấp / Hủy VIP" onclick="toggleVip('\${u.id}', \${!u.is_vip})">
                  <i class="fas fa-crown"></i>
                </button>
                <button class="btn btn-outline-primary" title="Đổi Quyền / Phân Loại" onclick="promptChangeRole('\${u.id}', '\${escapeHtml(u.display_name || u.username)}', '\${u.role || 'user'}')">
                  <i class="fas fa-user-gear"></i>
                </button>
                <button class="btn \${u.is_banned ? 'btn-success' : 'btn-outline-danger'}" title="\${u.is_banned ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}" onclick="toggleBan('\${u.id}', \${!u.is_banned})">
                  <i class="fas \${u.is_banned ? 'fa-lock-open' : 'fa-ban'}"></i>
                </button>
                <button class="btn btn-outline-secondary" title="Cấp lại 1 lượt sửa OA" onclick="resetOaEditCount('\${u.id}', '\${escapeHtml(u.display_name || u.username)}')">
                  <i class="fas fa-rotate-left"></i>
                </button>
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
        confirmButtonText: action
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
        confirmButtonText: 'Lưu quyền mới'
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

    // Filter Users
    document.getElementById('user-search-input').addEventListener('input', filterUsers);
    document.getElementById('user-role-filter').addEventListener('change', filterUsers);

    function filterUsers() {
      const q = document.getElementById('user-search-input').value.toLowerCase().trim();
      const role = document.getElementById('user-role-filter').value;

      let filtered = allUsersCache.filter(u => {
        const matchesQuery = !q || 
          (u.display_name && u.display_name.toLowerCase().includes(q)) || 
          (u.username && u.username.toLowerCase().includes(q)) ||
          (u.id && u.id.toLowerCase().includes(q));

        let matchesRole = true;
        if (role === 'banned') matchesRole = u.is_banned === true;
        else if (role === 'oa') matchesRole = u.is_oa === true || u.account_type === 'oa';
        else if (role === 'mod') matchesRole = u.role === 'mod';
        else if (role === 'admin') matchesRole = u.role === 'admin';

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
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">Chưa có bài viết nào trên hệ thống.</td></tr>';
        return;
      }

      tbody.innerHTML = posts.map(p => {
        const author = p.profiles || {};
        const authorName = author.display_name || author.username || 'Thành viên';
        const initial = authorName.charAt(0).toUpperCase();
        const authorAvatar = author.avatar_url 
          ? \`<img class="avatar-img-sm me-2" src="\${author.avatar_url}" />\`
          : \`<div class="avatar-fallback-sm me-2">\${initial}</div>\`;

        let mediaHtml = '<span class="text-muted small">Không đính kèm</span>';
        if (p.media_urls && p.media_urls.length > 0) {
          mediaHtml = \`<img src="\${p.media_urls[0]}" class="rounded-2 shadow-sm" style="width: 50px; height: 50px; object-fit: cover; cursor: pointer;" onclick="openLightbox('\${p.media_urls[0]}')" title="Nhấn để phóng to ảnh" />\`;
        }

        const dateStr = p.created_at ? new Date(p.created_at).toLocaleDateString('vi-VN') : '-';

        return \`
          <tr>
            <td>
              <div class="d-flex align-items-center">
                \${authorAvatar}
                <div>
                  <div class="fw-bold text-white">\${escapeHtml(authorName)}</div>
                  <div class="text-muted small">@\${escapeHtml(author.username || '')}</div>
                </div>
              </div>
            </td>
            <td style="max-width: 320px;">
              <div class="text-white small" style="line-height: 1.45; word-break: break-word;">
                \${escapeHtml(p.content || '')}
              </div>
            </td>
            <td>\${mediaHtml}</td>
            <td>
              <div class="small text-muted d-flex gap-2">
                <span><i class="fas fa-heart text-danger me-1"></i>\${p.likes_count || 0}</span>
                <span><i class="fas fa-comment text-info me-1"></i>\${p.comments_count || 0}</span>
              </div>
            </td>
            <td>
              \${p.is_pinned ? '<span class="badge badge-oa"><i class="fas fa-thumbtack me-1"></i>Đã ghim</span>' : '<span class="text-muted small">-</span>'}
            </td>
            <td class="small">\${dateStr}</td>
            <td class="text-end">
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-warning" title="\${p.is_pinned ? 'Bỏ ghim' : 'Ghim nổi bật'}" onclick="togglePinPost('\${p.id}', \${!p.is_pinned})">
                  <i class="fas fa-thumbtack"></i>
                </button>
                <button class="btn btn-outline-danger" title="Xóa bài viết vĩnh viễn" onclick="deletePost('\${p.id}')">
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
        confirmButtonText: 'Xóa vĩnh viễn'
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
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted">Chưa có bình luận nào.</td></tr>';
        return;
      }

      tbody.innerHTML = comments.map(c => {
        const user = c.profiles || {};
        const userName = user.display_name || user.username || 'Thành viên';
        const dateStr = c.created_at ? new Date(c.created_at).toLocaleString('vi-VN') : '-';

        return \`
          <tr>
            <td>
              <div class="fw-bold text-white">\${escapeHtml(userName)}</div>
              <div class="text-muted small">@\${escapeHtml(user.username || '')}</div>
            </td>
            <td style="max-width: 380px;">
              <div class="text-white small" style="line-height: 1.4;">\${escapeHtml(c.content || '')}</div>
            </td>
            <td>
              <span class="badge bg-secondary font-mono">Post: \${c.post_id ? c.post_id.substring(0, 8) + '...' : '-'}</span>
            </td>
            <td class="small text-muted">\${dateStr}</td>
            <td class="text-end">
              <button class="btn btn-sm btn-outline-danger" onclick="deleteComment('\${c.id}')" title="Xóa bình luận này">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        \`;
      }).join('');
    }

    async function deleteComment(commentId) {
      Swal.fire({
        title: 'Xóa bình luận?',
        text: 'Bình luận này sẽ bị xóa vĩnh viễn khỏi bài viết!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Xóa ngay'
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
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">Chưa có báo cáo vi phạm nào trong hàng đợi.</td></tr>';
        return;
      }

      tbody.innerHTML = reports.map(r => {
        const reporter = r.profiles || {};
        const reporterName = reporter.display_name || reporter.username || 'Thành viên';
        const dateStr = r.created_at ? new Date(r.created_at).toLocaleDateString('vi-VN') : '-';
        const isPending = r.status === 'pending';
        const isUserTarget = r.target_type === 'user';

        const statusBadge = isPending
          ? '<span class="badge bg-danger">CHỜ XỬ LÝ</span>'
          : (r.status === 'dismissed' ? '<span class="badge bg-secondary">ĐÃ BÁC BỎ</span>' : '<span class="badge bg-success">ĐÃ XỬ LÝ</span>');

        const typeBadge = isUserTarget
          ? '<span class="badge badge-oa">HỒ SƠ CẤP TÍCH</span>'
          : \`<span class="badge bg-secondary">\${escapeHtml(r.target_type || 'Nội dung')}</span>\`;

        let actionButtonsHtml = '<span class="text-muted small">Đã hoàn tất</span>';
        if (isPending) {
          if (isUserTarget) {
            actionButtonsHtml = \`
              <div class="btn-group btn-group-sm">
                <button class="btn btn-warning text-dark" onclick="actionReport('\${r.id}', 'approve_oa')" title="Duyệt cấp Tích Vàng OA">
                  <i class="fas fa-certificate me-1"></i> Duyệt OA
                </button>
                <button class="btn btn-info" onclick="actionReport('\${r.id}', 'approve_verified')" title="Duyệt cấp Tích Xanh">
                  <i class="fas fa-check-circle me-1"></i> Tích Xanh
                </button>
                <button class="btn btn-outline-secondary" onclick="actionReport('\${r.id}', 'dismiss')">
                  Bác Bỏ
                </button>
              </div>
            \`;
          } else {
            actionButtonsHtml = \`
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-secondary" onclick="actionReport('\${r.id}', 'dismiss')">
                  Bác Bỏ
                </button>
                <button class="btn btn-danger" onclick="actionReport('\${r.id}', 'delete_target')">
                  <i class="fas fa-trash me-1"></i> Xóa Vi Phạm
                </button>
              </div>
            \`;
          }
        }

        return \`
          <tr>
            <td>
              <div class="fw-bold text-white">\${escapeHtml(reporterName)}</div>
              <div class="text-muted small font-mono">UID: \${r.reporter_id ? r.reporter_id.substring(0, 8) + '...' : '-'}</div>
            </td>
            <td>\${typeBadge}</td>
            <td style="max-width: 300px;">
              <div class="fw-semibold text-white">\${escapeHtml(r.reason || 'Yêu cầu kiểm duyệt')}</div>
              \${isUserTarget ? \`<div class="text-warning small font-mono">Mục tiêu UID: \${r.target_id}</div>\` : ''}
            </td>
            <td>\${statusBadge}</td>
            <td class="small text-muted">\${dateStr}</td>
            <td class="text-end">\${actionButtonsHtml}</td>
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
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: data.message, showConfirmButton: false, timer: 1800 });
          fetchReports();
          fetchMetrics();
        } else {
          Swal.fire({ icon: 'error', title: 'Thất bại', text: data.error || 'Thao tác không thành công' });
        }
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Lỗi', text: err.message });
      }
    }

    // 6. Broadcast Realtime Preview & Send
    function setupBroadcastPreview() {
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
        const link = document.getElementById('broadcast-link-input').value.trim();

        if (!title || !body) {
          Swal.fire({ icon: 'warning', title: 'Chưa đủ thông tin', text: 'Vui lòng nhập cả tiêu đề và nội dung thông báo' });
          return;
        }

        Swal.fire({
          title: 'Phát sóng Push Notification?',
          text: 'Thông báo sẽ được gửi đồng thời tới TOÀN BỘ thành viên ứng dụng!',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#0084ff',
          confirmButtonText: 'Bắt đầu gửi ngay'
        }).then(async (result) => {
          if (result.isConfirmed) {
            const btn = document.getElementById('btn-send-broadcast');
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Đang phát sóng Push Notification...';

            try {
              const res = await fetch('/api/admin/broadcast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
                body: JSON.stringify({ title, body, link })
              });
              const data = await res.json();
              if (data.success) {
                Swal.fire({ icon: 'success', title: 'Thành công', text: data.message });
                titleInput.value = '';
                bodyInput.value = '';
                updatePreview();
              } else {
                Swal.fire({ icon: 'error', title: 'Thất bại', text: data.error });
              }
            } catch (err) {
              Swal.fire({ icon: 'error', title: 'Lỗi mạng', text: err.message });
            } finally {
              btn.disabled = false;
              btn.innerHTML = '<i class="fas fa-paper-plane me-1"></i> Bắt Đầu Phát Sóng Toàn Hệ Thống';
            }
          }
        });
      });
    }

    // 7. Fetch & Render OA Requests
    async function fetchOaRequests(showToast = false) {
      try {
        const res = await fetch('/api/admin/oa-requests', {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });
        const data = await res.json();
        if (data.success && data.requests) {
          allOaRequestsCache = data.requests;
          renderOaRequestsTable(allOaRequestsCache);
          const count = allOaRequestsCache.length;
          
          const badge = document.getElementById('sidebar-oa-badge');
          const navBadge = document.getElementById('nav-oa-badge');
          if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-block' : 'none';
          }
          if (navBadge) {
            navBadge.textContent = count;
            navBadge.style.display = count > 0 ? 'inline-block' : 'none';
          }
          const kpi = document.getElementById('kpi-oa-pending');
          if (kpi) kpi.textContent = count;

          if (showToast) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã làm mới yêu cầu duyệt OA', showConfirmButton: false, timer: 1500 });
          }
        }
      } catch (err) {
        console.error('Fetch OA requests error:', err);
      }
    }

    function renderOaRequestsTable(requests) {
      const container = document.getElementById('oa-requests-container');
      if (!container) return;

      if (!requests || requests.length === 0) {
        container.innerHTML = \`
          <div class="text-center py-5 text-muted">
            <i class="fas fa-circle-check text-success fs-1 mb-3"></i>
            <h5 class="fw-bold text-white mb-1">Tất cả thông tin OA đã được xử lý</h5>
            <p class="small text-muted mb-0">Hiện tại không có yêu cầu thay đổi thông tin Official Account nào đang chờ xét duyệt.</p>
          </div>
        \`;
        return;
      }

      container.innerHTML = requests.map(r => {
        const p = r.oa_pending_update || {};
        const reqDate = p.requested_at ? new Date(p.requested_at).toLocaleString('vi-VN') : (r.updated_at ? new Date(r.updated_at).toLocaleString('vi-VN') : '-');

        const curName = r.display_name || r.username || 'Chưa đặt';
        const newName = p.display_name || curName;
        const nameChanged = p.display_name && p.display_name !== curName;

        const curUser = r.username || '';
        const newUser = p.username || curUser;
        const userChanged = p.username && p.username !== curUser;

        const curCat = r.oa_category || 'Doanh nghiệp & Dịch vụ trực tuyến';
        const newCat = p.oa_category || curCat;
        const catChanged = p.oa_category && p.oa_category !== curCat;

        const curStatus = r.oa_status || 'Trực tuyến 24/7 · Sẵn sàng giải đáp';
        const newStatus = p.oa_status || curStatus;
        const statusChanged = p.oa_status && p.oa_status !== curStatus;

        const curBio = r.bio || '(Chưa có)';
        const newBio = p.bio !== undefined ? p.bio : curBio;
        const bioChanged = p.bio !== undefined && p.bio !== curBio;

        const initial = curName.charAt(0).toUpperCase();
        const avatarHtml = r.avatar_url 
          ? \`<img class="avatar-img-sm me-2" src="\${r.avatar_url}" alt="\${curName}" onerror="this.outerHTML='<div class=\\'avatar-fallback-sm me-2\\'>\${initial}</div>'" />\`
          : \`<div class="avatar-fallback-sm me-2">\${initial}</div>\`;

        return \`
          <div class="card bg-dark border-secondary mb-3 shadow-sm">
            <div class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div class="d-flex align-items-center">
                \${avatarHtml}
                <div>
                  <div class="fw-bold text-white fs-6">
                    \${escapeHtml(curName)} <span class="badge badge-oa"><i class="fas fa-certificate me-1"></i>OA</span>
                  </div>
                  <div class="text-muted small">@\${escapeHtml(curUser)} · Yêu cầu lúc: \${reqDate}</div>
                </div>
              </div>
              <div class="btn-group">
                <button class="btn btn-sm btn-success" onclick="approveOaRequest('\${r.id}', '\${escapeHtml(curName)}')">
                  <i class="fas fa-check me-1"></i> Phê Duyệt Ngay
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="rejectOaRequest('\${r.id}', '\${escapeHtml(curName)}')">
                  <i class="fas fa-times me-1"></i> Từ Chối
                </button>
              </div>
            </div>

            <div class="card-body p-0 table-responsive">
              <table class="table table-bordered table-sm align-middle mb-0">
                <thead class="table-dark">
                  <tr>
                    <th style="width: 25%;">Trường Thông Tin</th>
                    <th style="width: 37%;">Hiện Tại (Đang Công Khai)</th>
                    <th style="width: 38%;">Đề Xuất Mới (Chờ Duyệt)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Tên Official Account</strong></td>
                    <td>\${escapeHtml(curName)}</td>
                    <td>\${nameChanged ? \`<span class="badge bg-success fs-7">\${escapeHtml(newName)}</span>\` : \`<span class="text-muted">\${escapeHtml(curName)}</span>\`}</td>
                  </tr>
                  <tr>
                    <td><strong>Mã định danh (@handle)</strong></td>
                    <td>@\${escapeHtml(curUser)}</td>
                    <td>\${userChanged ? \`<span class="badge bg-success fs-7">@\${escapeHtml(newUser)}</span>\` : \`<span class="text-muted">@\${escapeHtml(curUser)}</span>\`}</td>
                  </tr>
                  <tr>
                    <td><strong>Lĩnh vực hoạt động</strong></td>
                    <td>\${escapeHtml(curCat)}</td>
                    <td>\${catChanged ? \`<span class="badge bg-info text-dark fs-7">\${escapeHtml(newCat)}</span>\` : \`<span class="text-muted">\${escapeHtml(curCat)}</span>\`}</td>
                  </tr>
                  <tr>
                    <td><strong>Trạng thái hiển thị</strong></td>
                    <td>\${escapeHtml(curStatus)}</td>
                    <td>\${statusChanged ? \`<span class="badge bg-info text-dark fs-7">\${escapeHtml(newStatus)}</span>\` : \`<span class="text-muted">\${escapeHtml(curStatus)}</span>\`}</td>
                  </tr>
                  <tr>
                    <td><strong>Tiểu sử / Giới thiệu</strong></td>
                    <td class="small">\${escapeHtml(curBio)}</td>
                    <td class="small">\${bioChanged ? \`<span class="text-warning fw-semibold">\${escapeHtml(newBio)}</span>\` : \`<span class="text-muted">\${escapeHtml(curBio)}</span>\`}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        \`;
      }).join('');
    }

    async function approveOaRequest(userId, name) {
      Swal.fire({
        title: 'Phê duyệt thay đổi OA?',
        text: \`Phê duyệt các thay đổi thông tin cho Official Account "\${name}"? Thông tin mới sẽ cập nhật trực tiếp lên ứng dụng.\`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        confirmButtonText: 'Phê duyệt ngay'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await fetch(\`/api/admin/oa-requests/\${userId}/approve\`, {
              method: 'POST',
              headers: { 'Authorization': 'Bearer ' + adminToken }
            });
            const data = await res.json();
            if (data.success) {
              Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: data.message || 'Đã phê duyệt thông tin OA!', showConfirmButton: false, timer: 1800 });
              fetchOaRequests();
              fetchUsers();
              fetchMetrics();
            }
          } catch (err) {
            Swal.fire({ icon: 'error', title: 'Lỗi', text: err.message });
          }
        }
      });
    }

    async function rejectOaRequest(userId, name) {
      const { value: reason } = await Swal.fire({
        title: \`Từ chối thay đổi của "\${name}"\`,
        input: 'textarea',
        inputLabel: 'Lý do từ chối gửi tới chủ tài khoản OA:',
        inputValue: 'Nội dung thông tin không phù hợp với quy chuẩn nhận diện thương hiệu.',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Gửi lý do & Từ chối'
      });

      if (reason) {
        try {
          const res = await fetch(\`/api/admin/oa-requests/\${userId}/reject\`, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + adminToken, 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason })
          });
          const data = await res.json();
          if (data.success) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'info', title: data.message || 'Đã từ chối yêu cầu đổi thông tin OA.', showConfirmButton: false, timer: 1800 });
            fetchOaRequests();
            fetchMetrics();
          }
        } catch (err) {
          Swal.fire({ icon: 'error', title: 'Lỗi', text: err.message });
        }
      }
    }

    async function resetOaEditCount(userId, name) {
      Swal.fire({
        title: 'Cấp lại lượt sửa thông tin?',
        text: \`Cấp lại lượt chỉnh sửa trực tiếp (1/1) cho tài khoản OA "\${name}"? Chủ tài khoản sẽ có thể tự sửa đổi thông tin 1 lần mà không cần chờ duyệt.\`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#f59e0b',
        confirmButtonText: 'Cấp lại lượt sửa'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await fetch(\`/api/admin/users/\${userId}/reset-oa-edit\`, {
              method: 'POST',
              headers: { 'Authorization': 'Bearer ' + adminToken }
            });
            const data = await res.json();
            if (data.success) {
              Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: data.message || 'Đã cấp lại lượt sửa cho OA!', showConfirmButton: false, timer: 1800 });
              fetchUsers();
              fetchOaRequests();
            }
          } catch (err) {
            Swal.fire({ icon: 'error', title: 'Lỗi', text: err.message });
          }
        }
      });
    }

    // 8. Security Audit Logs & Spam Clean
    async function fetchSecurityLogs() {
      try {
        const res = await fetch('/api/admin/security-logs', {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });
        const data = await res.json();
        if (data.success && data.logs) {
          renderAuditLogsTable(data.logs);
        }
      } catch (err) {
        console.error('Fetch security logs error:', err);
      }
    }

    function renderAuditLogsTable(logs) {
      const tbody = document.getElementById('audit-logs-body');
      if (!logs || logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">Chưa ghi nhận sự kiện an ninh nào.</td></tr>';
        return;
      }

      tbody.innerHTML = logs.map(l => {
        const dateStr = l.timestamp ? new Date(l.timestamp).toLocaleString('vi-VN') : '-';
        const sevBadge = l.severity === 'alert'
          ? '<span class="badge bg-danger">ALERT</span>'
          : (l.severity === 'warning' ? '<span class="badge bg-warning text-dark">WARNING</span>' : '<span class="badge bg-info">INFO</span>');

        return \`
          <tr>
            <td class="small text-muted font-mono">\${dateStr}</td>
            <td><span class="badge bg-secondary font-mono">\${l.eventType || 'event'}</span></td>
            <td>\${sevBadge}</td>
            <td class="fw-bold text-white font-mono small">\${escapeHtml(l.actor || 'system')}</td>
            <td class="font-mono text-muted small">\${escapeHtml(l.ip || 'internal')}</td>
            <td class="small text-white">\${escapeHtml(l.details || '')}</td>
          </tr>
        \`;
      }).join('');
    }

    async function cleanSpamReactions() {
      Swal.fire({
        title: 'Quét sạch phản ứng spam 120Hz?',
        text: 'Hệ thống sẽ rà soát và loại bỏ các lượt like/reaction trùng lặp do spam bot hoặc giật lag mạng gây ra.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f59e0b',
        confirmButtonText: 'Bắt đầu quét dọn'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await fetch('/api/admin/clean-spam-reactions', {
              method: 'POST',
              headers: { 'Authorization': 'Bearer ' + adminToken }
            });
            const data = await res.json();
            if (data.success) {
              Swal.fire({ icon: 'success', title: 'Hoàn tất quét dọn!', text: data.message });
              fetchSecurityLogs();
              fetchMetrics();
            }
          } catch (err) {
            Swal.fire({ icon: 'error', title: 'Lỗi', text: err.message });
          }
        }
      });
    }

    // 9. Fetch System Health
    async function fetchSystemHealth() {
      try {
        const res = await fetch('/api/admin/system-health', {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });
        const data = await res.json();
        if (data.success && data.health) {
          const h = data.health;
          if (h.uptime) document.getElementById('health-uptime').textContent = h.uptime;
          if (h.memory) document.getElementById('health-memory').textContent = h.memory;
          if (h.nodeVersion) document.getElementById('health-node').textContent = h.nodeVersion;
        }
      } catch (err) {
        console.error('Fetch system health error:', err);
      }
    }

    // Navigation Tabs Switching
    function setupTabs() {
      document.querySelectorAll('[data-tab]').forEach(el => {
        el.addEventListener('click', () => {
          const tabId = el.getAttribute('data-tab');
          if (tabId) switchTab(tabId);
        });
      });
    }

    function switchTab(tabId) {
      document.querySelectorAll('.nav-sidebar .nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-tab') === tabId);
      });

      document.querySelectorAll('.tab-section').forEach(sec => {
        sec.classList.remove('active');
      });
      const targetSec = document.getElementById('tab-' + tabId);
      if (targetSec) targetSec.classList.add('active');

      const titleMap = {
        'tong-quan': { title: 'Tổng Quan Hệ Thống', subtitle: 'Chỉ số vận hành thời gian thực & trung tâm điều phối cộng đồng Dorabox' },
        'thanh-vien': { title: 'Quản Lý Danh Sách Thành Viên', subtitle: 'Phân quyền, cấp tích xanh, xét duyệt Official Account & khóa tài khoản' },
        'duyet-oa': { title: 'Xét Duyệt Thông Tin OA', subtitle: 'Phê duyệt các thay đổi Tên, Lĩnh vực, Mã định danh, Tiểu sử và Trạng thái Official Account' },
        'bai-viet': { title: 'Quản Lý Bảng Tin & Bài Viết', subtitle: 'Kiểm duyệt nội dung bảng tin, hình ảnh đính kèm, ghim bài nổi bật & xóa vi phạm' },
        'binh-luan': { title: 'Quản Lý Bình Luận & Thảo Luận', subtitle: 'Giám sát tương tác thảo luận cộng đồng & ngăn chặn spam' },
        'bao-cao': { title: 'Kiểm Duyệt & Báo Cáo Vi Phạm', subtitle: 'Hàng đợi xét duyệt hồ sơ cấp tích và xử lý vi phạm tiêu chuẩn cộng đồng' },
        'phat-thong-bao': { title: 'Broadcast Studio & Push FCM', subtitle: 'Soạn thảo và phát Push Notification tới ứng dụng kèm xem trước trên mobile' },
        'bao-mat-audit': { title: 'Bảo Mật Hệ Thống & Nhật Ký Audit', subtitle: 'Giám sát khiên chống spam 120Hz, bảo trì dọn dẹp phản ứng rác & theo dõi an ninh' },
        'he-thong': { title: 'Hạ Tầng Cloud & Services', subtitle: 'Giám sát dịch vụ Supabase Postgres, Cloudflare R2 CDN và Firebase v1' }
      };

      if (titleMap[tabId]) {
        document.getElementById('topbar-title').textContent = titleMap[tabId].title;
        document.getElementById('topbar-subtitle').textContent = titleMap[tabId].subtitle;
      }

      // Close mobile sidebar if open
      if (window.innerWidth < 992 && document.body.classList.contains('sidebar-open')) {
        document.body.classList.remove('sidebar-open');
        document.body.classList.add('sidebar-collapse');
      }
    }

    // Sidebar Search Filter
    function setupSidebarFilter() {
      const input = document.getElementById('sidebar-search-input');
      if (!input) return;
      input.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        document.querySelectorAll('.nav-sidebar .nav-item').forEach(item => {
          const text = item.textContent.toLowerCase();
          item.style.display = (!q || text.includes(q)) ? '' : 'none';
        });
      });
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
