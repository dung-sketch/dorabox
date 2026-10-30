export function renderAdminPage(): string {
  return `<!DOCTYPE html>
<html lang="vi" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dorabox Admin Console - Bảng Điều Khiển Quản Trị Hệ Thống</title>
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  
  <!-- Font Awesome 6.5.1 -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <!-- Bootstrap 5 CSS (Grid & Modals) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
  
  <!-- SweetAlert2 CSS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">

  <style>
    /* =========================================================================
       DORABOX MODERN DESIGN SYSTEM (Dark-first, 60fps, Zero-Shadow-Lag)
       Inspired by Linear, Vercel & Supabase
       ========================================================================= */
    :root {
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;

      /* Dark Theme (Default) */
      --bg-canvas: #09090b;
      --bg-sidebar: #0e0e12;
      --bg-topbar: rgba(14, 14, 18, 0.85);
      --bg-surface: #141419;
      --bg-card: #18181f;
      --bg-card-hover: #1f1f28;
      --bg-input: #121217;
      
      --border-subtle: #1f1f26;
      --border-default: #2a2a35;
      --border-strong: #3b3b4a;
      
      --text-primary: #f4f4f7;
      --text-secondary: #a1a1b2;
      --text-muted: #6e6e82;

      /* Refined Semantic Accents */
      --primary: #3b82f6;
      --primary-hover: #2563eb;
      --primary-subtle: rgba(59, 130, 246, 0.12);
      --primary-border: rgba(59, 130, 246, 0.3);

      --success: #10b981;
      --success-subtle: rgba(16, 185, 129, 0.12);
      --warning: #f59e0b;
      --warning-subtle: rgba(245, 158, 11, 0.12);
      --danger: #ef4444;
      --danger-subtle: rgba(239, 68, 68, 0.12);
      --purple: #8b5cf6;
      --purple-subtle: rgba(139, 92, 246, 0.12);
      --cyan: #06b6d4;
      --cyan-subtle: rgba(6, 182, 212, 0.12);

      --sidebar-w: 260px;
      --topbar-h: 64px;
      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 14px;
      --radius-pill: 9999px;

      --transition-fast: 0.15s ease;
    }

    /* Light Theme */
    html[data-theme="light"] {
      --bg-canvas: #f8fafc;
      --bg-sidebar: #ffffff;
      --bg-topbar: rgba(255, 255, 255, 0.9);
      --bg-surface: #ffffff;
      --bg-card: #ffffff;
      --bg-card-hover: #f1f5f9;
      --bg-input: #f8fafc;
      
      --border-subtle: #f1f5f9;
      --border-default: #e2e8f0;
      --border-strong: #cbd5e1;
      
      --text-primary: #0f172a;
      --text-secondary: #475569;
      --text-muted: #94a3b8;

      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --primary-subtle: rgba(37, 99, 235, 0.08);
      --primary-border: rgba(37, 99, 235, 0.25);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-sans);
      background-color: var(--bg-canvas);
      color: var(--text-primary);
      min-height: 100vh;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Scrollbar */
    ::-webkit-scrollbar {
      width: 7px;
      height: 7px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: var(--border-default);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--border-strong);
    }

    /* Layout */
    .app-layout {
      display: flex;
      min-height: 100vh;
    }

    /* Sidebar */
    .app-sidebar {
      width: var(--sidebar-w);
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 1020;
      transition: transform var(--transition-fast);
    }

    .brand-header {
      height: var(--topbar-h);
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-subtle);
    }

    .brand-logo-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: var(--text-primary);
    }

    .brand-icon-box {
      width: 34px;
      height: 34px;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 17px;
    }

    .brand-title-group h1 {
      font-size: 15px;
      font-weight: 700;
      letter-spacing: -0.3px;
      margin: 0;
      line-height: 1.2;
    }

    .brand-title-group span {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-muted);
      letter-spacing: 0.3px;
      text-transform: uppercase;
    }

    .sidebar-menu {
      flex: 1;
      overflow-y: auto;
      padding: 14px 12px;
    }

    .menu-group-label {
      font-size: 10.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--text-muted);
      padding: 12px 10px 6px;
    }

    .nav-item-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 9px 12px;
      border-radius: var(--radius-md);
      background: transparent;
      border: 1px solid transparent;
      color: var(--text-secondary);
      font-size: 13.5px;
      font-weight: 500;
      cursor: pointer;
      text-align: left;
      transition: background-color var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
      margin-bottom: 3px;
      text-decoration: none;
    }

    .nav-item-btn:hover {
      background: var(--bg-card-hover);
      color: var(--text-primary);
    }

    .nav-item-btn.active {
      background: var(--primary-subtle);
      border-color: var(--primary-border);
      color: var(--primary);
      font-weight: 600;
    }

    .nav-item-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .nav-item-left i {
      font-size: 15px;
      width: 20px;
      text-align: center;
      opacity: 0.85;
    }

    .nav-badge {
      font-size: 11px;
      font-weight: 600;
      padding: 2px 7px;
      border-radius: var(--radius-pill);
      background: var(--bg-card);
      border: 1px solid var(--border-default);
      color: var(--text-secondary);
    }

    .nav-badge.danger {
      background: var(--danger-subtle);
      border-color: rgba(239, 68, 68, 0.3);
      color: var(--danger);
    }

    .nav-badge.warning {
      background: var(--warning-subtle);
      border-color: rgba(245, 158, 11, 0.3);
      color: var(--warning);
    }

    .sidebar-footer {
      padding: 14px 16px;
      border-top: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      color: var(--text-muted);
    }

    /* Main Content Area */
    .app-main {
      margin-left: var(--sidebar-w);
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    /* Top Bar */
    .app-topbar {
      height: var(--topbar-h);
      background: var(--bg-topbar);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-subtle);
      position: sticky;
      top: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
    }

    .topbar-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .sidebar-toggle-btn {
      display: none;
      background: transparent;
      border: 1px solid var(--border-default);
      color: var(--text-primary);
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .breadcrumb-title {
      font-size: 15px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .breadcrumb-title span {
      color: var(--text-muted);
      font-weight: 400;
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .cmd-bar-trigger {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      padding: 6px 12px;
      border-radius: var(--radius-md);
      color: var(--text-muted);
      font-size: 13px;
      cursor: pointer;
      transition: border-color var(--transition-fast);
    }

    .cmd-bar-trigger:hover {
      border-color: var(--border-strong);
      color: var(--text-secondary);
    }

    .kbd-shortcut {
      font-family: var(--font-mono);
      font-size: 11px;
      background: var(--bg-card);
      border: 1px solid var(--border-default);
      padding: 1px 6px;
      border-radius: 4px;
      color: var(--text-secondary);
    }

    .system-health-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-family: var(--font-mono);
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      padding: 6px 10px;
      border-radius: var(--radius-pill);
      color: var(--text-secondary);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--success);
      display: inline-block;
    }

    .topbar-btn {
      width: 36px;
      height: 36px;
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      color: var(--text-secondary);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color var(--transition-fast), color var(--transition-fast);
    }

    .topbar-btn:hover {
      background: var(--bg-card-hover);
      color: var(--text-primary);
    }

    .admin-profile-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 10px 4px 6px;
      border-radius: var(--radius-pill);
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      font-size: 13px;
      font-weight: 500;
    }

    .admin-avatar {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
    }

    /* Main Container */
    .app-body {
      padding: 24px;
      flex: 1;
    }

    /* Tab Sections */
    .tab-section {
      display: none;
    }

    .tab-section.active {
      display: block;
      animation: fadeIn var(--transition-fast);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Page Header */
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 24px;
    }

    .section-header-left h2 {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.4px;
      margin: 0;
    }

    .section-header-left p {
      font-size: 13.5px;
      color: var(--text-secondary);
      margin: 4px 0 0;
    }

    .section-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    /* Clean Button Styles */
    .btn-db {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 8px 14px;
      font-size: 13.5px;
      font-weight: 600;
      border-radius: var(--radius-md);
      border: 1px solid transparent;
      cursor: pointer;
      transition: background-color var(--transition-fast), border-color var(--transition-fast);
      text-decoration: none;
    }

    .btn-db-primary {
      background: var(--primary);
      color: #ffffff;
    }
    .btn-db-primary:hover {
      background: var(--primary-hover);
      color: #ffffff;
    }

    .btn-db-outline {
      background: var(--bg-surface);
      border-color: var(--border-default);
      color: var(--text-primary);
    }
    .btn-db-outline:hover {
      background: var(--bg-card-hover);
      border-color: var(--border-strong);
      color: var(--text-primary);
    }

    .btn-db-danger {
      background: var(--danger-subtle);
      border-color: rgba(239, 68, 68, 0.3);
      color: var(--danger);
    }
    .btn-db-danger:hover {
      background: var(--danger);
      color: #ffffff;
    }

    .btn-db-sm {
      padding: 5px 10px;
      font-size: 12.5px;
      border-radius: var(--radius-sm);
    }

    /* Stat Cards Grid */
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-lg);
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: border-color var(--transition-fast), transform var(--transition-fast);
      cursor: pointer;
    }

    .stat-card:hover {
      border-color: var(--primary-border);
      transform: translateY(-2px);
    }

    .stat-card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .stat-card-title {
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .stat-card-icon {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }

    .stat-card-value {
      font-size: 26px;
      font-weight: 700;
      font-family: var(--font-sans);
      letter-spacing: -0.5px;
      font-variant-numeric: tabular-nums;
    }

    .stat-card-subtitle {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 4px;
    }

    /* Cards & Containers */
    .db-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-lg);
      overflow: hidden;
      margin-bottom: 24px;
    }

    .db-card-header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }

    .db-card-title {
      font-size: 15px;
      font-weight: 600;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .db-card-body {
      padding: 20px;
    }

    /* Toolbar / Filters */
    .filter-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 16px;
    }

    .search-input-wrap {
      position: relative;
      min-width: 260px;
      flex: 1;
      max-width: 380px;
    }

    .search-input-wrap i {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      font-size: 13px;
    }

    .db-input {
      width: 100%;
      background: var(--bg-input);
      border: 1px solid var(--border-default);
      color: var(--text-primary);
      padding: 8px 12px 8px 34px;
      border-radius: var(--radius-md);
      font-size: 13.5px;
      outline: none;
      transition: border-color var(--transition-fast);
    }

    .db-input:focus {
      border-color: var(--primary);
    }

    .filter-pills {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    .filter-pill {
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      color: var(--text-secondary);
      padding: 6px 12px;
      border-radius: var(--radius-pill);
      font-size: 12.5px;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .filter-pill:hover {
      background: var(--bg-card-hover);
      color: var(--text-primary);
    }

    .filter-pill.active {
      background: var(--primary-subtle);
      border-color: var(--primary-border);
      color: var(--primary);
      font-weight: 600;
    }

    /* Data Tables */
    .db-table-responsive {
      overflow-x: auto;
      border-radius: 0 0 var(--radius-lg) var(--radius-lg);
    }

    .db-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13.5px;
      text-align: left;
    }

    .db-table th {
      background: var(--bg-card);
      color: var(--text-secondary);
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-default);
      white-space: nowrap;
    }

    .db-table td {
      padding: 14px 16px;
      border-bottom: 1px solid var(--border-subtle);
      vertical-align: middle;
      color: var(--text-primary);
    }

    .db-table tbody tr {
      transition: background-color var(--transition-fast);
    }

    .db-table tbody tr:hover {
      background-color: var(--bg-card-hover);
    }

    .cell-user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar-img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
      background: var(--bg-card);
      border: 1px solid var(--border-default);
      flex-shrink: 0;
    }

    .user-text-meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .user-display-name {
      font-weight: 600;
      font-size: 13.5px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .user-handle {
      font-size: 12px;
      color: var(--text-muted);
      font-family: var(--font-mono);
    }

    /* Status Badges */
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 8px;
      border-radius: var(--radius-pill);
      font-size: 11.5px;
      font-weight: 600;
      white-space: nowrap;
    }

    .status-badge.verified {
      background: rgba(16, 185, 129, 0.12);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.25);
    }

    .status-badge.oa {
      background: rgba(245, 158, 11, 0.12);
      color: #f59e0b;
      border: 1px solid rgba(245, 158, 11, 0.25);
    }

    .status-badge.banned {
      background: rgba(239, 68, 68, 0.12);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.25);
    }

    .status-badge.admin {
      background: rgba(139, 92, 246, 0.12);
      color: #8b5cf6;
      border: 1px solid rgba(139, 92, 246, 0.25);
    }

    .status-badge.active {
      background: rgba(16, 185, 129, 0.12);
      color: #10b981;
    }

    .status-badge.pending {
      background: rgba(245, 158, 11, 0.12);
      color: #f59e0b;
      border: 1px solid rgba(245, 158, 11, 0.25);
    }

    /* Monospace ID Pill */
    .id-pill {
      font-family: var(--font-mono);
      font-size: 11.5px;
      color: var(--text-secondary);
      background: var(--bg-card);
      border: 1px solid var(--border-default);
      padding: 2px 7px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    .id-pill:hover {
      border-color: var(--primary);
      color: var(--primary);
    }

    /* Action Icon Buttons */
    .action-btn-group {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .btn-icon {
      width: 30px;
      height: 30px;
      border-radius: var(--radius-sm);
      background: transparent;
      border: 1px solid transparent;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 13px;
      transition: all var(--transition-fast);
    }

    .btn-icon:hover {
      background: var(--bg-card-hover);
      border-color: var(--border-default);
      color: var(--text-primary);
    }

    .btn-icon.danger:hover {
      background: var(--danger-subtle);
      border-color: rgba(239, 68, 68, 0.3);
      color: var(--danger);
    }

    .btn-icon.success:hover {
      background: var(--success-subtle);
      border-color: rgba(16, 185, 129, 0.3);
      color: var(--success);
    }

    /* Modal Overrides */
    .modal-content {
      background: var(--bg-surface) !important;
      border: 1px solid var(--border-default) !important;
      border-radius: var(--radius-lg) !important;
      color: var(--text-primary) !important;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4) !important;
    }

    .modal-header {
      border-bottom: 1px solid var(--border-subtle) !important;
      padding: 16px 20px !important;
    }

    .modal-title {
      font-size: 16px !important;
      font-weight: 600 !important;
      color: var(--text-primary) !important;
    }

    .modal-body {
      padding: 20px !important;
    }

    .modal-footer {
      border-top: 1px solid var(--border-subtle) !important;
      padding: 14px 20px !important;
    }

    .btn-close {
      filter: invert(1) grayscale(100%) brightness(200%);
    }
    html[data-theme="light"] .btn-close {
      filter: none;
    }

    /* Command Palette Modal */
    .cmd-palette-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(4px);
      z-index: 1060;
      display: none;
      align-items: flex-start;
      justify-content: center;
      padding-top: 15vh;
    }

    .cmd-palette-backdrop.show {
      display: flex;
    }

    .cmd-palette-box {
      width: 100%;
      max-width: 580px;
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-lg);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
      overflow: hidden;
      animation: cmdSlideDown 0.15s ease;
    }

    @keyframes cmdSlideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .cmd-input-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .cmd-input-row i {
      color: var(--text-muted);
      font-size: 16px;
    }

    .cmd-search-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-primary);
      font-size: 15px;
    }

    .cmd-results-list {
      max-height: 340px;
      overflow-y: auto;
      padding: 8px;
    }

    .cmd-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      font-size: 13.5px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .cmd-item:hover, .cmd-item.selected {
      background: var(--bg-card-hover);
      color: var(--text-primary);
    }

    .cmd-item-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .cmd-item-left i {
      font-size: 14px;
      width: 20px;
      text-align: center;
      color: var(--primary);
    }

    .cmd-palette-footer {
      padding: 10px 16px;
      border-top: 1px solid var(--border-subtle);
      font-size: 11.5px;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* Login Overlay */
    .login-overlay {
      position: fixed;
      inset: 0;
      background: var(--bg-canvas);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-lg);
      padding: 32px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }

    .login-brand-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 24px;
      margin-bottom: 20px;
    }

    /* Broadcast Mobile Mockup */
    .broadcast-container {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 24px;
    }

    @media (max-width: 991px) {
      .broadcast-container {
        grid-template-columns: 1fr;
      }
    }

    .mobile-mockup {
      background: #000000;
      border: 8px solid #27272a;
      border-radius: 36px;
      padding: 14px;
      min-height: 540px;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .mobile-notch {
      width: 120px;
      height: 18px;
      background: #27272a;
      border-radius: 0 0 12px 12px;
      margin: 0 auto 20px;
    }

    .mobile-notif-card {
      background: rgba(39, 39, 42, 0.85);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 12px 14px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #ffffff;
      box-shadow: 0 10px 25px rgba(0,0,0,0.4);
    }

    /* Responsive */
    @media (max-width: 991px) {
      .app-sidebar {
        transform: translateX(-100%);
      }
      .app-sidebar.show {
        transform: translateX(0);
      }
      .app-main {
        margin-left: 0;
      }
      .sidebar-toggle-btn {
        display: inline-flex;
      }
      .cmd-bar-trigger {
        display: none;
      }
    }
  </style>
</head>
<body>

  <!-- LOGIN OVERLAY -->
  <div class="login-overlay" id="login-overlay">
    <div class="login-card">
      <div class="login-brand-icon">
        <i class="fas fa-cube"></i>
      </div>
      <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 6px;">Quản Trị Dorabox</h2>
      <p style="font-size: 13.5px; color: var(--text-secondary); margin-bottom: 24px;">
        Nhập khóa bảo mật Master Secret Key để truy cập hệ thống điều hành.
      </p>

      <form id="form-login" onsubmit="event.preventDefault(); doLogin();">
        <div style="margin-bottom: 20px;">
          <label style="font-size: 12.5px; font-weight: 600; color: var(--text-secondary); margin-bottom: 8px; display: block;">
            Master Secret Key
          </label>
          <div style="position: relative;">
            <input type="password" id="input-admin-password" class="db-input" placeholder="••••••••••••••••" style="padding-left: 12px; font-family: var(--font-mono);" required autocomplete="current-password">
          </div>
        </div>

        <button type="submit" id="btn-login-submit" class="btn-db btn-db-primary" style="width: 100%; padding: 10px;">
          <i class="fas fa-lock-open me-1"></i> Xác Thực & Đăng Nhập
        </button>

        <div id="login-error-msg" style="margin-top: 14px; font-size: 12.5px; color: var(--danger); display: none; text-align: center;"></div>
      </form>
    </div>
  </div>

  <!-- COMMAND PALETTE (CTRL+K) -->
  <div class="cmd-palette-backdrop" id="cmd-palette" onclick="if(event.target === this) closeCommandPalette();">
    <div class="cmd-palette-box">
      <div class="cmd-input-row">
        <i class="fas fa-search"></i>
        <input type="text" id="cmd-palette-input" class="cmd-search-input" placeholder="Gõ để tìm kiếm tính năng hoặc chuyển nhanh..." autocomplete="off">
        <span class="kbd-shortcut">ESC</span>
      </div>
      <div class="cmd-results-list" id="cmd-results-list">
        <!-- Rendered by JS -->
      </div>
      <div class="cmd-palette-footer">
        <span>Điều hướng bằng phím mũi tên & Enter</span>
        <span>Dorabox Quick Navigator</span>
      </div>
    </div>
  </div>

  <!-- APP SHELL -->
  <div class="app-layout">
    
    <!-- SIDEBAR -->
    <aside class="app-sidebar" id="app-sidebar">
      <div class="brand-header">
        <a href="javascript:void(0)" class="brand-logo-wrap" onclick="switchTab('tong-quan')">
          <div class="brand-icon-box">
            <i class="fas fa-cube"></i>
          </div>
          <div class="brand-title-group">
            <h1>DORABOX</h1>
            <span>Admin Console</span>
          </div>
        </a>
        <button class="topbar-btn d-lg-none" onclick="toggleMobileSidebar()">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="sidebar-menu">
        <div class="menu-group-label">Tổng Quan</div>
        <button class="nav-item-btn active" data-tab="tong-quan" onclick="switchTab('tong-quan')">
          <div class="nav-item-left">
            <i class="fas fa-chart-pie"></i>
            <span>Tổng Quan</span>
          </div>
        </button>

        <div class="menu-group-label">Người Dùng & Tương Tác</div>
        <button class="nav-item-btn" data-tab="thanh-vien" onclick="switchTab('thanh-vien')">
          <div class="nav-item-left">
            <i class="fas fa-users"></i>
            <span>Thành Viên</span>
          </div>
          <span class="nav-badge" id="badge-users-count">0</span>
        </button>
        <button class="nav-item-btn" data-tab="xet-duyet" onclick="switchTab('xet-duyet')">
          <div class="nav-item-left">
            <i class="fas fa-id-badge"></i>
            <span>Duyệt Tích & OA</span>
          </div>
          <span class="nav-badge warning" id="badge-requests-count">0</span>
        </button>
        <button class="nav-item-btn" data-tab="nhom-tro-chuyen" onclick="switchTab('nhom-tro-chuyen')">
          <div class="nav-item-left">
            <i class="fas fa-comments"></i>
            <span>Nhóm Trò Chuyện</span>
          </div>
        </button>
        <button class="nav-item-btn" data-tab="ten-cam" onclick="switchTab('ten-cam')">
          <div class="nav-item-left">
            <i class="fas fa-ban"></i>
            <span>Tên Người Dùng Cấm</span>
          </div>
        </button>

        <div class="menu-group-label">Nội Dung & Kiểm Duyệt</div>
        <button class="nav-item-btn" data-tab="bai-viet" onclick="switchTab('bai-viet')">
          <div class="nav-item-left">
            <i class="fas fa-newspaper"></i>
            <span>Bài Viết Feed</span>
          </div>
        </button>
        <button class="nav-item-btn" data-tab="binh-luan" onclick="switchTab('binh-luan')">
          <div class="nav-item-left">
            <i class="fas fa-comment-dots"></i>
            <span>Bình Luận</span>
          </div>
        </button>
        <button class="nav-item-btn" data-tab="bao-cao" onclick="switchTab('bao-cao')">
          <div class="nav-item-left">
            <i class="fas fa-flag"></i>
            <span>Báo Cáo Vi Phạm</span>
          </div>
          <span class="nav-badge danger" id="badge-reports-count">0</span>
        </button>

        <div class="menu-group-label">Hệ Thống & Truyền Thông</div>
        <button class="nav-item-btn" data-tab="phat-thong-bao" onclick="switchTab('phat-thong-bao')">
          <div class="nav-item-left">
            <i class="fas fa-paper-plane"></i>
            <span>Phát Thông Báo FCM</span>
          </div>
        </button>
        <button class="nav-item-btn" data-tab="bao-mat-audit" onclick="switchTab('bao-mat-audit')">
          <div class="nav-item-left">
            <i class="fas fa-shield-halved"></i>
            <span>Bảo Mật & Audit</span>
          </div>
        </button>
      </div>

      <div class="sidebar-footer">
        <div>v2.1.0 <span style="color: var(--success); font-weight: 600;">● Live</span></div>
        <div style="font-family: var(--font-mono); font-size: 11px;">Production</div>
      </div>
    </aside>

    <!-- MAIN BODY -->
    <main class="app-main">
      
      <!-- TOPBAR -->
      <header class="app-topbar">
        <div class="topbar-left">
          <button class="sidebar-toggle-btn" onclick="toggleMobileSidebar()">
            <i class="fas fa-bars"></i>
          </button>
          <div class="breadcrumb-title">
            <span>Quản Trị</span>
            <i class="fas fa-chevron-right" style="font-size: 10px; color: var(--text-muted);"></i>
            <strong id="topbar-tab-title">Tổng Quan</strong>
          </div>
        </div>

        <div class="topbar-right">
          <!-- Quick search / command palette trigger -->
          <div class="cmd-bar-trigger" onclick="openCommandPalette()">
            <i class="fas fa-search"></i>
            <span>Tìm nhanh tính năng...</span>
            <span class="kbd-shortcut">Ctrl K</span>
          </div>

          <!-- Real-time Health Ping -->
          <div class="system-health-pill" id="health-pill" title="Độ trễ API Server">
            <span class="status-dot"></span>
            <span id="health-latency">API: 24ms</span>
          </div>

          <!-- Theme Toggle -->
          <button class="topbar-btn" id="btn-theme-toggle" onclick="toggleTheme()" title="Đổi giao diện Sáng / Tối">
            <i class="fas fa-moon"></i>
          </button>

          <!-- Refresh Active Tab -->
          <button class="topbar-btn" id="btn-refresh-active" onclick="refreshCurrentTab()" title="Làm mới dữ liệu">
            <i class="fas fa-sync-alt" id="icon-refresh-spinner"></i>
          </button>

          <!-- Profile / Logout -->
          <div class="admin-profile-pill">
            <div class="admin-avatar">AD</div>
            <span style="font-weight: 600;">Admin</span>
            <button class="btn-icon danger" onclick="doLogout()" title="Đăng xuất" style="margin-left: 2px;">
              <i class="fas fa-arrow-right-from-bracket"></i>
            </button>
          </div>
        </div>
      </header>

      <!-- TAB SECTIONS CONTAINER -->
      <div class="app-body">

        <!-- ============================================================== -->
        <!-- TAB 1: TỔNG QUAN (OVERVIEW) -->
        <!-- ============================================================== -->
        <section id="tab-tong-quan" class="tab-section active">
          <div class="section-header">
            <div class="section-header-left">
              <h2>Tổng Quan Hệ Thống</h2>
              <p>Chỉ số hoạt động, kiểm duyệt và tài nguyên thời gian thực của Dorabox.</p>
            </div>
            <div class="section-actions">
              <button class="btn-db btn-db-primary btn-db-sm" onclick="switchTab('phat-thong-bao')">
                <i class="fas fa-bullhorn"></i> Phát Thông Báo
              </button>
              <button class="btn-db btn-db-outline btn-db-sm" onclick="switchTab('xet-duyet')">
                <i class="fas fa-clipboard-check"></i> Xử Lý Xét Duyệt
              </button>
            </div>
          </div>

          <!-- KPI STAT CARDS -->
          <div class="stat-grid">
            <div class="stat-card" onclick="switchTab('thanh-vien')">
              <div class="stat-card-top">
                <span class="stat-card-title">Tổng Người Dùng</span>
                <div class="stat-card-icon" style="background: var(--primary-subtle); color: var(--primary);">
                  <i class="fas fa-users"></i>
                </div>
              </div>
              <div class="stat-card-value" id="stat-total-users">-</div>
              <div class="stat-card-subtitle" id="stat-verified-sub">- tài khoản tích xanh</div>
            </div>

            <div class="stat-card" onclick="switchTab('bai-viet')">
              <div class="stat-card-top">
                <span class="stat-card-title">Tổng Bài Viết</span>
                <div class="stat-card-icon" style="background: var(--cyan-subtle); color: var(--cyan);">
                  <i class="fas fa-newspaper"></i>
                </div>
              </div>
              <div class="stat-card-value" id="stat-total-posts">-</div>
              <div class="stat-card-subtitle" id="stat-comments-sub">- bình luận thảo luận</div>
            </div>

            <div class="stat-card" onclick="switchTab('xet-duyet')">
              <div class="stat-card-top">
                <span class="stat-card-title">Yêu Cầu Chờ Duyệt</span>
                <div class="stat-card-icon" style="background: var(--warning-subtle); color: var(--warning);">
                  <i class="fas fa-id-card"></i>
                </div>
              </div>
              <div class="stat-card-value" id="stat-pending-requests" style="color: var(--warning);">-</div>
              <div class="stat-card-subtitle" id="stat-oa-sub">- hồ sơ OA & Tích xanh</div>
            </div>

            <div class="stat-card" onclick="switchTab('bao-cao')">
              <div class="stat-card-top">
                <span class="stat-card-title">Báo Cáo Vi Phạm</span>
                <div class="stat-card-icon" style="background: var(--danger-subtle); color: var(--danger);">
                  <i class="fas fa-flag"></i>
                </div>
              </div>
              <div class="stat-card-value" id="stat-pending-reports" style="color: var(--danger);">-</div>
              <div class="stat-card-subtitle" id="stat-reports-resolved-sub">- đã xử lý</div>
            </div>

            <div class="stat-card" onclick="switchTab('nhom-tro-chuyen')">
              <div class="stat-card-top">
                <span class="stat-card-title">Nhóm Trò Chuyện</span>
                <div class="stat-card-icon" style="background: var(--purple-subtle); color: var(--purple);">
                  <i class="fas fa-comments"></i>
                </div>
              </div>
              <div class="stat-card-value" id="stat-total-groups">-</div>
              <div class="stat-card-subtitle">Nhóm cộng đồng hoạt động</div>
            </div>
          </div>

          <!-- SYSTEM HEALTH & METRICS ROW -->
          <div class="row g-3">
            <div class="col-lg-8">
              <div class="db-card">
                <div class="db-card-header">
                  <h3 class="db-card-title"><i class="fas fa-chart-line text-primary"></i> Tăng Trưởng & Tương Tác</h3>
                  <span class="badge bg-secondary" style="font-size: 11px;">30 Ngày Gần Nhất</span>
                </div>
                <div class="db-card-body">
                  <div style="height: 280px; position: relative;">
                    <canvas id="overviewGrowthChart"></canvas>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-4">
              <div class="db-card">
                <div class="db-card-header">
                  <h3 class="db-card-title"><i class="fas fa-server text-success"></i> Máy Chủ & Cơ Sở Dữ Liệu</h3>
                  <button class="btn-db btn-db-outline btn-db-sm" onclick="fetchSystemHealth(true)">Kiểm Tra</button>
                </div>
                <div class="db-card-body">
                  <div style="display: flex; flex-direction: column; gap: 14px;">
                    <div>
                      <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
                        <span style="color: var(--text-secondary);">Supabase Database</span>
                        <strong id="health-db-status" style="color: var(--success);">Đang Kết Nối</strong>
                      </div>
                      <div style="font-size: 11.5px; color: var(--text-muted); font-family: var(--font-mono);" id="health-db-latency">Latency: ~25ms</div>
                    </div>

                    <div style="border-top: 1px solid var(--border-subtle); padding-top: 10px;">
                      <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
                        <span style="color: var(--text-secondary);">Node.js Runtime</span>
                        <strong id="health-node-version" style="font-family: var(--font-mono);">-</strong>
                      </div>
                      <div style="font-size: 11.5px; color: var(--text-muted);" id="health-uptime">Uptime: -</div>
                    </div>

                    <div style="border-top: 1px solid var(--border-subtle); padding-top: 10px;">
                      <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
                        <span style="color: var(--text-secondary);">RAM Bộ Nhớ Heap</span>
                        <strong id="health-memory-usage" style="font-family: var(--font-mono);">-</strong>
                      </div>
                      <div class="progress" style="height: 6px; background: var(--bg-card);">
                        <div class="progress-bar bg-primary" id="health-memory-bar" style="width: 35%;"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ============================================================== -->
        <!-- TAB 2: THÀNH VIÊN (USERS) -->
        <!-- ============================================================== -->
        <section id="tab-thanh-vien" class="tab-section">
          <div class="section-header">
            <div class="section-header-left">
              <h2>Quản Lý Thành Viên</h2>
              <p>Tra cứu hồ sơ, phân quyền, cấp tích xanh, tích OA hoặc xử phạt tài khoản.</p>
            </div>
            <div class="section-actions">
              <button class="btn-db btn-db-outline btn-db-sm" onclick="fetchUsers(true)">
                <i class="fas fa-sync-alt"></i> Làm Mới
              </button>
            </div>
          </div>

          <div class="db-card">
            <div class="db-card-header">
              <div class="filter-toolbar w-100 m-0">
                <div class="search-input-wrap">
                  <i class="fas fa-search"></i>
                  <input type="text" id="users-search-input" class="db-input" placeholder="Tìm theo username hoặc tên..." oninput="onSearchUsersDebounced()">
                </div>
                <div class="filter-pills" id="users-filter-pills">
                  <button class="filter-pill active" data-filter="all" onclick="setUserFilter('all')">Tất Cả</button>
                  <button class="filter-pill" data-filter="verified" onclick="setUserFilter('verified')">Tích Xanh ✓</button>
                  <button class="filter-pill" data-filter="oa" onclick="setUserFilter('oa')">Doanh Nghiệp OA ⭐</button>
                  <button class="filter-pill" data-filter="banned" onclick="setUserFilter('banned')">Bị Khóa 🔒</button>
                  <button class="filter-pill" data-filter="admin" onclick="setUserFilter('admin')">Quản Trị Viên 🛡️</button>
                </div>
              </div>
            </div>

            <div class="db-table-responsive">
              <table class="db-table">
                <thead>
                  <tr>
                    <th>Thành Viên</th>
                    <th>User ID</th>
                    <th>Trạng Thái</th>
                    <th>Vai Trò</th>
                    <th>Ngày Tạo</th>
                    <th style="text-align: right;">Thao Tác</th>
                  </tr>
                </thead>
                <tbody id="users-table-body">
                  <tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">Đang tải danh sách...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- ============================================================== -->
        <!-- TAB 3: XÉT DUYỆT & YÊU CẦU (REQUESTS) -->
        <!-- ============================================================== -->
        <section id="tab-xet-duyet" class="tab-section">
          <div class="section-header">
            <div class="section-header-left">
              <h2>Hàng Đợi Xét Duyệt & Yêu Cầu</h2>
              <p>Phê duyệt hồ sơ cấp Tích Xanh cá nhân, Tích Vàng OA và đề xuất cập nhật thông tin thương hiệu.</p>
            </div>
            <div class="section-actions">
              <button class="btn-db btn-db-outline btn-db-sm" onclick="fetchRequests(true)">
                <i class="fas fa-sync-alt"></i> Làm Mới
              </button>
            </div>
          </div>

          <div class="db-card">
            <div class="db-card-header">
              <div class="filter-pills">
                <button class="filter-pill active" id="pill-req-all" onclick="filterRequests('all')">Tất Cả</button>
                <button class="filter-pill" id="pill-req-verified" onclick="filterRequests('verified')">Tích Xanh Cá Nhân</button>
                <button class="filter-pill" id="pill-req-oa" onclick="filterRequests('oa')">Tích Vàng Doanh Nghiệp (OA)</button>
              </div>
            </div>

            <div class="db-card-body" id="requests-container">
              <div style="text-align: center; padding: 40px; color: var(--text-muted);">Đang tải hàng đợi...</div>
            </div>
          </div>
        </section>

        <!-- ============================================================== -->
        <!-- TAB 4: NHÓM TRÒ CHUYỆN (GROUPS) -->
        <!-- ============================================================== -->
        <section id="tab-nhom-tro-chuyen" class="tab-section">
          <div class="section-header">
            <div class="section-header-left">
              <h2>Quản Lý Nhóm Trò Chuyện</h2>
              <p>Giám sát các nhóm chat cộng đồng, số lượng thành viên và xử lý giải tán nhóm vi phạm.</p>
            </div>
            <div class="section-actions">
              <button class="btn-db btn-db-outline btn-db-sm" onclick="fetchGroups(1, true)">
                <i class="fas fa-sync-alt"></i> Làm Mới
              </button>
            </div>
          </div>

          <div class="db-card">
            <div class="db-card-header">
              <div class="search-input-wrap">
                <i class="fas fa-search"></i>
                <input type="text" id="groups-search-input" class="db-input" placeholder="Tìm theo tên nhóm..." oninput="onSearchGroupsDebounced()">
              </div>
            </div>

            <div class="db-table-responsive">
              <table class="db-table">
                <thead>
                  <tr>
                    <th>Tên Nhóm</th>
                    <th>ID Nhóm</th>
                    <th>Thành Viên</th>
                    <th>Ngày Tạo</th>
                    <th style="text-align: right;">Thao Tác</th>
                  </tr>
                </thead>
                <tbody id="groups-table-body">
                  <tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--text-muted);">Đang tải danh sách nhóm...</td></tr>
                </tbody>
              </table>
            </div>

            <div class="db-card-header" style="border-top: 1px solid var(--border-subtle); border-bottom: none;">
              <span id="groups-pagination-info" style="font-size: 13px; color: var(--text-secondary);">-</span>
              <div style="display: flex; gap: 6px;" id="groups-pagination-btns"></div>
            </div>
          </div>
        </section>

        <!-- ============================================================== -->
        <!-- TAB 5: TÊN NGƯỜI DÙNG CẤM & BẢO LƯU (BANNED USERNAMES) -->
        <!-- ============================================================== -->
        <section id="tab-ten-cam" class="tab-section">
          <div class="section-header">
            <div class="section-header-left">
              <h2>Danh Sách Username Bị Cấm & Bảo Lưu</h2>
              <p>Ngăn chặn thành viên đặt username mạo danh ban quản trị, thương hiệu hoặc từ ngữ nhạy cảm.</p>
            </div>
            <div class="section-actions">
              <button class="btn-db btn-db-primary btn-db-sm" onclick="openAddBannedModal()">
                <i class="fas fa-plus"></i> Thêm Username Cấm
              </button>
            </div>
          </div>

          <div class="db-card">
            <div class="db-card-header">
              <div class="search-input-wrap">
                <i class="fas fa-search"></i>
                <input type="text" id="banned-search-input" class="db-input" placeholder="Tìm kiếm từ khóa / username..." oninput="filterBannedUsernames()">
              </div>
            </div>

            <div class="db-table-responsive">
              <table class="db-table">
                <thead>
                  <tr>
                    <th>Username Bị Cấm</th>
                    <th>Lý Do Bảo Lưu / Cấm</th>
                    <th>Ngày Thiết Lập</th>
                    <th style="text-align: right;">Thao Tác</th>
                  </tr>
                </thead>
                <tbody id="banned-table-body">
                  <tr><td colspan="4" style="text-align: center; padding: 40px; color: var(--text-muted);">Đang tải danh sách...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- ============================================================== -->
        <!-- TAB 6: BÀI VIẾT FEED (POSTS) -->
        <!-- ============================================================== -->
        <section id="tab-bai-viet" class="tab-section">
          <div class="section-header">
            <div class="section-header-left">
              <h2>Kiểm Duyệt Bài Viết Feed</h2>
              <p>Giám sát nội dung bảng tin, hình ảnh, video, ghim bài nổi bật và gỡ bỏ vi phạm.</p>
            </div>
            <div class="section-actions">
              <button class="btn-db btn-db-outline btn-db-sm" onclick="fetchPosts(true)">
                <i class="fas fa-sync-alt"></i> Làm Mới
              </button>
            </div>
          </div>

          <div class="db-card">
            <div class="db-card-header">
              <div class="search-input-wrap">
                <i class="fas fa-search"></i>
                <input type="text" id="posts-search-input" class="db-input" placeholder="Tìm bài viết theo nội dung..." oninput="onSearchPostsDebounced()">
              </div>
            </div>

            <div class="db-table-responsive">
              <table class="db-table">
                <thead>
                  <tr>
                    <th style="width: 280px;">Tác Giả</th>
                    <th>Nội Dung & File Đính Kèm</th>
                    <th>Tương Tác</th>
                    <th>Thời Gian</th>
                    <th style="text-align: right;">Thao Tác</th>
                  </tr>
                </thead>
                <tbody id="posts-table-body">
                  <tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--text-muted);">Đang tải bài viết...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- ============================================================== -->
        <!-- TAB 7: BÌNH LUẬN (COMMENTS) -->
        <!-- ============================================================== -->
        <section id="tab-binh-luan" class="tab-section">
          <div class="section-header">
            <div class="section-header-left">
              <h2>Kiểm Duyệt Bình Luận</h2>
              <p>Xử lý bình luận spam, xúc phạm hoặc chứa liên kết độc hại trên các bài viết cộng đồng.</p>
            </div>
            <div class="section-actions">
              <button class="btn-db btn-db-outline btn-db-sm" onclick="fetchComments(true)">
                <i class="fas fa-sync-alt"></i> Làm Mới
              </button>
            </div>
          </div>

          <div class="db-card">
            <div class="db-card-header">
              <div class="search-input-wrap">
                <i class="fas fa-search"></i>
                <input type="text" id="comments-search-input" class="db-input" placeholder="Tìm kiếm nội dung bình luận..." oninput="onSearchCommentsDebounced()">
              </div>
            </div>

            <div class="db-table-responsive">
              <table class="db-table">
                <thead>
                  <tr>
                    <th style="width: 240px;">Người Bình Luận</th>
                    <th>Nội Dung</th>
                    <th>Bài Viết Gốc</th>
                    <th>Thời Gian</th>
                    <th style="text-align: right;">Thao Tác</th>
                  </tr>
                </thead>
                <tbody id="comments-table-body">
                  <tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--text-muted);">Đang tải bình luận...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- ============================================================== -->
        <!-- TAB 8: BÁO CÁO VI PHẠM (REPORTS) -->
        <!-- ============================================================== -->
        <section id="tab-bao-cao" class="tab-section">
          <div class="section-header">
            <div class="section-header-left">
              <h2>Xử Lý Báo Cáo Vi Phạm</h2>
              <p>Hàng đợi xử phạt tài khoản, bài viết và bình luận bị người dùng gửi báo cáo.</p>
            </div>
            <div class="section-actions">
              <button class="btn-db btn-db-outline btn-db-sm" onclick="fetchReports(true)">
                <i class="fas fa-sync-alt"></i> Làm Mới
              </button>
            </div>
          </div>

          <div class="db-card">
            <div class="db-card-header">
              <div class="filter-pills">
                <button class="filter-pill active" id="pill-rep-all" onclick="filterReports('all')">Tất Cả</button>
                <button class="filter-pill" id="pill-rep-user" onclick="filterReports('user')">Người Dùng</button>
                <button class="filter-pill" id="pill-rep-post" onclick="filterReports('post')">Bài Viết</button>
                <button class="filter-pill" id="pill-rep-comment" onclick="filterReports('comment')">Bình Luận</button>
              </div>
            </div>

            <div class="db-table-responsive">
              <table class="db-table">
                <thead>
                  <tr>
                    <th>Mục Vi Phạm</th>
                    <th>Người Báo Cáo</th>
                    <th>Lý Do Vi Phạm</th>
                    <th>Trạng Thái</th>
                    <th>Thời Gian</th>
                    <th style="text-align: right;">Xử Lý</th>
                  </tr>
                </thead>
                <tbody id="reports-table-body">
                  <tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">Đang tải báo cáo...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- ============================================================== -->
        <!-- TAB 9: PHÁT THÔNG BÁO PUSH FCM (BROADCAST STUDIO) -->
        <!-- ============================================================== -->
        <section id="tab-phat-thong-bao" class="tab-section">
          <div class="section-header">
            <div class="section-header-left">
              <h2>Broadcast Studio & Push Notification FCM</h2>
              <p>Gửi thông báo đẩy tức thì tới toàn bộ thiết bị di động cài đặt ứng dụng Dorabox.</p>
            </div>
          </div>

          <div class="broadcast-container">
            <!-- Composer Form -->
            <div class="db-card">
              <div class="db-card-header">
                <h3 class="db-card-title"><i class="fas fa-paper-plane text-primary"></i> Soạn Thảo Thông Báo Đẩy</h3>
              </div>
              <div class="db-card-body">
                <form id="form-broadcast" onsubmit="event.preventDefault(); sendBroadcast();">
                  <div class="mb-3">
                    <label class="form-label" style="font-size: 13px; font-weight: 600;">Tiêu Đề Thông Báo *</label>
                    <input type="text" id="bc-title" class="db-input" placeholder="Ví dụ: Cập nhật Dorabox v2.1.0 đã sẵn sàng!" style="padding-left: 12px;" required oninput="updateBroadcastPreview()">
                  </div>

                  <div class="mb-3">
                    <label class="form-label" style="font-size: 13px; font-weight: 600;">Nội Dung Chi Tiết *</label>
                    <textarea id="bc-body" class="db-input" rows="4" placeholder="Khám phá ngay các tính năng phòng trò chuyện mới và chia sẻ tài liệu mã hóa..." style="padding-left: 12px;" required oninput="updateBroadcastPreview()"></textarea>
                  </div>

                  <div class="mb-4">
                    <label class="form-label" style="font-size: 13px; font-weight: 600;">Liên Kết Điều Hướng (DeepLink hoặc Web URL)</label>
                    <input type="text" id="bc-link" class="db-input" placeholder="dorabox://feed hoặc https://dorabox.vn" style="padding-left: 12px;">
                    <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Người dùng khi nhấp vào thông báo sẽ tự động mở trang này.</div>
                  </div>

                  <button type="submit" id="btn-send-broadcast" class="btn-db btn-db-primary" style="padding: 10px 20px;">
                    <i class="fas fa-paper-plane me-1"></i> Phát Thông Báo Tới Toàn Bộ Thiết Bị
                  </button>
                </form>
              </div>
            </div>

            <!-- Real-time Mobile Phone Mockup -->
            <div>
              <div style="font-size: 13px; font-weight: 600; color: var(--text-secondary); margin-bottom: 8px;">Xem Trước Giao Diện Thiết Bị</div>
              <div class="mobile-mockup">
                <div class="mobile-notch"></div>
                <div style="font-size: 11px; text-align: center; color: rgba(255,255,255,0.4); margin-bottom: 16px;">MÀN HÌNH KHÓA DI ĐỘNG</div>
                
                <div class="mobile-notif-card">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <div style="width: 18px; height: 18px; background: #3b82f6; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 9px;">
                        <i class="fas fa-cube"></i>
                      </div>
                      <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.2px;">DORABOX</span>
                    </div>
                    <span style="font-size: 10px; color: rgba(255,255,255,0.6);">Vừa xong</span>
                  </div>
                  <div id="preview-notif-title" style="font-size: 13px; font-weight: 700; margin-bottom: 2px;">Tiêu đề thông báo...</div>
                  <div id="preview-notif-body" style="font-size: 12px; color: rgba(255,255,255,0.85); line-height: 1.35;">Nội dung chi tiết thông báo sẽ xuất hiện ở đây...</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ============================================================== -->
        <!-- TAB 10: BẢO MẬT & NHẬT KÝ AUDIT (SECURITY) -->
        <!-- ============================================================== -->
        <section id="tab-bao-mat-audit" class="tab-section">
          <div class="section-header">
            <div class="section-header-left">
              <h2>Bảo Mật Hệ Thống & Nhật Ký Audit</h2>
              <p>Nhật ký bảo mật thời gian thực, ngăn chặn brute-force và công cụ dọn rác cơ sở dữ liệu.</p>
            </div>
            <div class="section-actions">
              <button class="btn-db btn-db-danger btn-db-sm" onclick="cleanSpamReactions()">
                <i class="fas fa-broom"></i> Dọn Rác Reactions Spam
              </button>
              <button class="btn-db btn-db-outline btn-db-sm" onclick="fetchSecurityLogs(true)">
                <i class="fas fa-sync-alt"></i> Làm Mới Logs
              </button>
            </div>
          </div>

          <div class="db-card">
            <div class="db-card-header">
              <h3 class="db-card-title"><i class="fas fa-shield-halved text-primary"></i> Nhật Ký Sự Kiện Quản Trị</h3>
              <div class="search-input-wrap" style="max-width: 280px;">
                <i class="fas fa-search"></i>
                <input type="text" id="logs-search-input" class="db-input" placeholder="Lọc nhật ký sự kiện..." oninput="filterLogs()">
              </div>
            </div>

            <div class="db-table-responsive">
              <table class="db-table">
                <thead>
                  <tr>
                    <th>Thời Gian</th>
                    <th>Loại Sự Kiện</th>
                    <th>Mức Độ</th>
                    <th>Người Thực Hiện</th>
                    <th>Chi Tiết</th>
                    <th>IP</th>
                  </tr>
                </thead>
                <tbody id="logs-table-body">
                  <tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">Đang tải nhật ký...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </div>
    </main>
  </div>

  <!-- ============================================================== -->
  <!-- MODALS -->
  <!-- ============================================================== -->

  <!-- Modal: Xem Thành Viên Nhóm Chat -->
  <div class="modal fade" id="modalGroupMembers" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalGroupTitle"><i class="fas fa-users me-2 text-primary"></i>Thành Viên Nhóm</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body p-0">
          <div class="db-table-responsive">
            <table class="db-table">
              <thead>
                <tr>
                  <th>Thành Viên</th>
                  <th>User ID</th>
                  <th>Vai Trò Trong Nhóm</th>
                  <th>Tham Gia</th>
                </tr>
              </thead>
              <tbody id="modalGroupMembersList">
                <!-- Rendered by JS -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal: Chi Tiết Báo Cáo Vi Phạm -->
  <div class="modal fade" id="modalReportDetail" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-danger"><i class="fas fa-shield-virus me-2"></i>Chi Tiết Báo Cáo Vi Phạm</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" id="report-detail-body">
          <!-- Rendered by JS -->
        </div>
        <div class="modal-footer" id="report-detail-footer">
          <!-- Actions -->
        </div>
      </div>
    </div>
  </div>

  <!-- Modal: Chỉnh Sửa Bài Viết -->
  <div class="modal fade" id="modalEditPost" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title"><i class="fas fa-pen-to-square me-2 text-primary"></i>Chỉnh Sửa Bài Viết</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <input type="hidden" id="editPostId">
          <div class="mb-3">
            <label class="form-label" style="font-size: 13px; font-weight: 600;">Nội Dung Bài Đăng</label>
            <textarea id="editPostContent" class="db-input" rows="5" style="padding-left: 12px;"></textarea>
          </div>

          <div class="mb-3">
            <label class="form-label" style="font-size: 13px; font-weight: 600;">Đính Kèm Liên Kết (URL)</label>
            <input type="text" id="editPostLink" class="db-input" placeholder="https://..." style="padding-left: 12px;">
          </div>

          <div class="mb-3">
            <label class="form-label" style="font-size: 13px; font-weight: 600;">Danh Sách Ảnh / Media</label>
            <div id="editPostMediaContainer" style="display: flex; gap: 10px; flex-wrap: wrap;"></div>
            <div style="display: flex; gap: 8px; margin-top: 10px;">
              <input type="text" id="newMediaUrlInput" class="db-input" placeholder="Dán link ảnh / video mới..." style="padding-left: 12px;">
              <button class="btn-db btn-db-outline btn-db-sm" type="button" onclick="addEditPostMediaUrl()">Thêm</button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-db btn-db-outline" data-bs-dismiss="modal">Hủy</button>
          <button type="button" class="btn-db btn-db-primary" onclick="submitEditPost()">Lưu Thay Đổi</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal: Thêm Username Cấm -->
  <div class="modal fade" id="modalAddBannedUser" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title"><i class="fas fa-ban me-2 text-danger"></i>Thêm Username Bị Cấm / Bảo Lưu</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="formAddBanned" onsubmit="event.preventDefault(); submitAddBannedUsername();">
            <div class="mb-3">
              <label class="form-label" style="font-size: 13px; font-weight: 600;">Username Cấm *</label>
              <input type="text" id="inputBannedUsername" class="db-input" placeholder="Ví dụ: helpdesk, support_vn" style="padding-left: 12px; font-family: var(--font-mono);" required>
            </div>
            <div class="mb-3">
              <label class="form-label" style="font-size: 13px; font-weight: 600;">Lý Do Cấm / Bảo Lưu *</label>
              <input type="text" id="inputBannedReason" class="db-input" placeholder="Ví dụ: Mạo danh hỗ trợ kỹ thuật" style="padding-left: 12px;" required>
            </div>
            <div class="d-flex justify-content-end gap-2 mt-4">
              <button type="button" class="btn-db btn-db-outline" data-bs-dismiss="modal">Hủy</button>
              <button type="submit" class="btn-db btn-db-primary">Lưu Vào Danh Sách</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- JS Dependencies -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <!-- ============================================================== -->
  <!-- APPLICATION LOGIC SCRIPT (Ultra-Fast & Robust) -->
  <!-- ============================================================== -->
  <script>
    (function() {
      let adminToken = localStorage.getItem('dorabox_admin_token') || '';
      let currentTab = 'tong-quan';
      let tabLoadedMap = {};
      let searchDebounceTimers = {};
      let overviewChartInstance = null;

      // In-memory data store for snappy switching
      let store = {
        metrics: null,
        users: [],
        usersFiltered: [],
        userFilter: 'all',
        requests: [],
        requestsFiltered: [],
        requestFilter: 'all',
        groups: [],
        groupsPage: 1,
        groupsTotal: 0,
        bannedUsernames: [],
        posts: [],
        comments: [],
        reports: [],
        reportsFiltered: [],
        reportFilter: 'all',
        logs: [],
        logsFiltered: [],
        editingPost: null,
      };

      // Helper for Safe JSON Fetch
      async function safeFetchJson(url, options = {}) {
        try {
          const res = await fetch(url, options);
          const data = await res.json();
          return data;
        } catch (err) {
          console.error('[Admin Fetch Error]:', err);
          return { success: false, error: err.message || 'Lỗi kết nối máy chủ' };
        }
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

      function formatDate(dateStr) {
        if (!dateStr) return '-';
        try {
          const d = new Date(dateStr);
          return d.toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
        } catch (_) {
          return dateStr;
        }
      }

      // Initialize App
      document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        initKeyboardShortcuts();
        setupCommandPaletteData();
        verifySession();
      });

      // Theme Support
      function initTheme() {
        const savedTheme = localStorage.getItem('dorabox_admin_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
      }

      window.toggleTheme = function() {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('dorabox_admin_theme', next);
        updateThemeIcon(next);
        if (overviewChartInstance) {
          renderGrowthChart(store.metrics);
        }
      };

      function updateThemeIcon(theme) {
        const btn = document.getElementById('btn-theme-toggle');
        if (!btn) return;
        btn.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      }

      // Mobile Sidebar
      window.toggleMobileSidebar = function() {
        const sidebar = document.getElementById('app-sidebar');
        if (sidebar) sidebar.classList.toggle('show');
      };

      // Session & Login
      async function verifySession() {
        if (!adminToken) {
          showLoginOverlay();
          return;
        }
        const data = await safeFetchJson('/api/admin/auth/check', {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });
        if (data.success && data.authenticated) {
          hideLoginOverlay();
          switchTab('tong-quan', true);
        } else {
          localStorage.removeItem('dorabox_admin_token');
          adminToken = '';
          showLoginOverlay();
        }
      }

      function showLoginOverlay() {
        const overlay = document.getElementById('login-overlay');
        if (overlay) overlay.style.display = 'flex';
      }

      function hideLoginOverlay() {
        const overlay = document.getElementById('login-overlay');
        if (overlay) overlay.style.display = 'none';
      }

      window.doLogin = async function() {
        const pwdInput = document.getElementById('input-admin-password');
        const submitBtn = document.getElementById('btn-login-submit');
        const errDiv = document.getElementById('login-error-msg');
        const pwd = pwdInput ? pwdInput.value.trim() : '';

        if (!pwd) return;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Đang xác thực...';
        errDiv.style.display = 'none';

        const data = await safeFetchJson('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: pwd })
        });

        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-lock-open me-1"></i> Xác Thực & Đăng Nhập';

        if (data.success && data.token) {
          adminToken = data.token;
          localStorage.setItem('dorabox_admin_token', adminToken);
          hideLoginOverlay();
          switchTab('tong-quan', true);
        } else {
          errDiv.textContent = data.error || 'Mật khẩu quản trị viên không chính xác!';
          errDiv.style.display = 'block';
        }
      };

      window.doLogout = function() {
        Swal.fire({
          title: 'Đăng xuất?',
          text: 'Bạn có chắc chắn muốn kết thúc phiên làm việc quản trị này?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Đăng xuất',
          cancelButtonText: 'Ở lại',
          confirmButtonColor: '#ef4444'
        }).then((res) => {
          if (res.isConfirmed) {
            localStorage.removeItem('dorabox_admin_token');
            adminToken = '';
            showLoginOverlay();
          }
        });
      };

      // ==============================================================
      // TAB NAVIGATION & LAZY LOADING
      // ==============================================================
      window.switchTab = function(tabId, forceReload = false) {
        if (!tabId) tabId = 'tong-quan';
        currentTab = tabId;

        // Close mobile drawer if open
        const sidebar = document.getElementById('app-sidebar');
        if (sidebar && sidebar.classList.contains('show')) {
          sidebar.classList.remove('show');
        }

        // Update nav buttons
        document.querySelectorAll('.app-sidebar .nav-item-btn').forEach(btn => {
          btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
        });

        // Update section visibility
        document.querySelectorAll('.tab-section').forEach(sec => {
          sec.classList.remove('active');
        });
        const targetSec = document.getElementById('tab-' + tabId);
        if (targetSec) targetSec.classList.add('active');

        // Update Topbar Title
        const titleMap = {
          'tong-quan': 'Tổng Quan Hệ Thống',
          'thanh-vien': 'Quản Lý Thành Viên',
          'xet-duyet': 'Hàng Đợi Xét Duyệt & Yêu Cầu',
          'nhom-tro-chuyen': 'Quản Lý Nhóm Trò Chuyện',
          'ten-cam': 'Tên Người Dùng Cấm & Bảo Lưu',
          'bai-viet': 'Kiểm Duyệt Bài Viết Feed',
          'binh-luan': 'Kiểm Duyệt Bình Luận',
          'bao-cao': 'Xử Lý Báo Cáo Vi Phạm',
          'phat-thong-bao': 'Broadcast Push Notification FCM',
          'bao-mat-audit': 'Bảo Mật & Nhật Ký Audit',
        };
        const titleEl = document.getElementById('topbar-tab-title');
        if (titleEl) titleEl.textContent = titleMap[tabId] || 'Quản Trị';

        // Lazy load tab data if not loaded or forceReload
        loadTabContent(tabId, forceReload);
      };

      window.refreshCurrentTab = function() {
        const spinner = document.getElementById('icon-refresh-spinner');
        if (spinner) spinner.classList.add('fa-spin');
        
        switchTab(currentTab, true);

        setTimeout(() => {
          if (spinner) spinner.classList.remove('fa-spin');
        }, 600);
      };

      function loadTabContent(tabId, force) {
        if (!force && tabLoadedMap[tabId] && (Date.now() - tabLoadedMap[tabId] < 60000)) {
          return; // Use cached data
        }

        tabLoadedMap[tabId] = Date.now();

        switch (tabId) {
          case 'tong-quan':
            fetchMetrics();
            fetchSystemHealth();
            break;
          case 'thanh-vien':
            fetchUsers();
            break;
          case 'xet-duyet':
            fetchRequests();
            break;
          case 'nhom-tro-chuyen':
            fetchGroups(1);
            break;
          case 'ten-cam':
            fetchBannedUsernames();
            break;
          case 'bai-viet':
            fetchPosts();
            break;
          case 'binh-luan':
            fetchComments();
            break;
          case 'bao-cao':
            fetchReports();
            break;
          case 'phat-thong-bao':
            updateBroadcastPreview();
            break;
          case 'bao-mat-audit':
            fetchSecurityLogs();
            break;
        }
      }

      // ==============================================================
      // 1. TỔNG QUAN (METRICS & CHARTS)
      // ==============================================================
      async function fetchMetrics() {
        const t0 = performance.now();
        const data = await safeFetchJson('/api/admin/metrics', {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });
        const latency = Math.round(performance.now() - t0);
        updateLatencyIndicator(latency);

        if (data.success && data.metrics) {
          store.metrics = data.metrics;
          const m = data.metrics;

          document.getElementById('stat-total-users').textContent = Number(m.totalUsers || 0).toLocaleString();
          document.getElementById('stat-verified-sub').textContent = Number(m.verifiedUsers || 0).toLocaleString() + ' tài khoản tích xanh';

          document.getElementById('stat-total-posts').textContent = Number(m.totalPosts || 0).toLocaleString();
          document.getElementById('stat-comments-sub').textContent = Number(m.totalComments || 0).toLocaleString() + ' bình luận thảo luận';

          document.getElementById('stat-pending-requests').textContent = Number(m.pendingRequests || 0).toLocaleString();
          document.getElementById('stat-oa-sub').textContent = (m.pendingOaRequests || 0) + ' OA, ' + (m.pendingBadgeRequests || 0) + ' tích xanh';

          document.getElementById('stat-pending-reports').textContent = Number(m.pendingReports || 0).toLocaleString();
          document.getElementById('stat-reports-resolved-sub').textContent = Number(m.resolvedReports || 0).toLocaleString() + ' đã giải quyết';

          document.getElementById('stat-total-groups').textContent = Number(m.totalGroups || 0).toLocaleString();

          // Badges in sidebar
          const bReq = document.getElementById('badge-requests-count');
          if (bReq) bReq.textContent = m.pendingRequests || 0;
          const bRep = document.getElementById('badge-reports-count');
          if (bRep) bRep.textContent = m.pendingReports || 0;
          const bUsr = document.getElementById('badge-users-count');
          if (bUsr) bUsr.textContent = m.totalUsers || 0;

          renderGrowthChart(m);
        }
      }

      function updateLatencyIndicator(ms) {
        const el = document.getElementById('health-latency');
        if (el) el.textContent = 'API: ' + ms + 'ms';
      }

      async function fetchSystemHealth(showToast = false) {
        const data = await safeFetchJson('/api/admin/system-health', {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });
        if (data.success && data.health) {
          const h = data.health;
          const dbStatus = document.getElementById('health-db-status');
          if (dbStatus) {
            dbStatus.textContent = h.database?.status === 'connected' ? 'Đang Kết Nối' : 'Có Lỗi';
            dbStatus.style.color = h.database?.status === 'connected' ? 'var(--success)' : 'var(--danger)';
          }
          const dbLat = document.getElementById('health-db-latency');
          if (dbLat) dbLat.textContent = 'Latency: ~' + (h.database?.latencyMs || 25) + 'ms';

          const nodeV = document.getElementById('health-node-version');
          if (nodeV) nodeV.textContent = h.nodeVersion || '-';

          const uptime = document.getElementById('health-uptime');
          if (uptime) {
            const hrs = Math.floor((h.uptimeSeconds || 0) / 3600);
            const mins = Math.floor(((h.uptimeSeconds || 0) % 3600) / 60);
            uptime.textContent = 'Uptime: ' + hrs + ' giờ ' + mins + ' phút';
          }

          const memUsage = document.getElementById('health-memory-usage');
          if (memUsage && h.memory) {
            memUsage.textContent = h.memory.heapUsedMb + ' MB / ' + h.memory.heapTotalMb + ' MB';
            const pct = Math.min(100, Math.round((h.memory.heapUsedMb / h.memory.heapTotalMb) * 100));
            const bar = document.getElementById('health-memory-bar');
            if (bar) bar.style.width = pct + '%';
          }

          if (showToast) {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'Hệ thống vận hành bình thường!',
              showConfirmButton: false,
              timer: 1500
            });
          }
        }
      }

      function renderGrowthChart(metrics) {
        const canvas = document.getElementById('overviewGrowthChart');
        if (!canvas) return;

        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';
        const textColor = isDark ? '#a1a1aa' : '#64748b';

        if (overviewChartInstance) {
          overviewChartInstance.destroy();
        }

        const labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
        const posts = metrics?.totalPosts || 12;
        const users = metrics?.totalUsers || 20;

        overviewChartInstance = new Chart(canvas, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Tương Tác Bài Viết',
                data: [Math.round(posts * 0.4), Math.round(posts * 0.55), Math.round(posts * 0.7), Math.round(posts * 0.65), Math.round(posts * 0.8), Math.round(posts * 0.95), posts],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                fill: true,
                tension: 0.35,
                borderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 6,
              },
              {
                label: 'Thành Viên Hoạt Động',
                data: [Math.round(users * 0.6), Math.round(users * 0.68), Math.round(users * 0.75), Math.round(users * 0.82), Math.round(users * 0.88), Math.round(users * 0.94), users],
                borderColor: '#10b981',
                backgroundColor: 'transparent',
                borderDash: [4, 4],
                tension: 0.35,
                borderWidth: 2,
                pointRadius: 2,
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 12 } }
              },
              tooltip: {
                backgroundColor: isDark ? '#18181b' : '#ffffff',
                titleColor: isDark ? '#ffffff' : '#09090b',
                bodyColor: isDark ? '#a1a1aa' : '#475569',
                borderColor: isDark ? '#27272a' : '#e2e8f0',
                borderWidth: 1,
                padding: 10,
                boxPadding: 4,
              }
            },
            scales: {
              x: {
                grid: { color: gridColor },
                ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11 } }
              },
              y: {
                grid: { color: gridColor },
                ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11 } }
              }
            }
          }
        });
      }

      // ==============================================================
      // 2. THÀNH VIÊN (USERS)
      // ==============================================================
      window.onSearchUsersDebounced = function() {
        clearTimeout(searchDebounceTimers.users);
        searchDebounceTimers.users = setTimeout(() => {
          fetchUsers();
        }, 250);
      };

      window.setUserFilter = function(filter) {
        store.userFilter = filter;
        document.querySelectorAll('#users-filter-pills .filter-pill').forEach(p => {
          p.classList.toggle('active', p.getAttribute('data-filter') === filter);
        });
        fetchUsers();
      };

      async function fetchUsers(force = false) {
        const q = (document.getElementById('users-search-input')?.value || '').trim();
        const filter = store.userFilter;
        let url = '/api/admin/users?';
        if (q) url += 'q=' + encodeURIComponent(q) + '&';
        if (filter && filter !== 'all') url += 'filter=' + encodeURIComponent(filter);

        const tbody = document.getElementById('users-table-body');
        if (tbody) tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);"><i class="fas fa-spinner fa-spin me-2"></i> Đang tải danh sách...</td></tr>';

        const data = await safeFetchJson(url, {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });

        if (data.success && data.users) {
          store.users = data.users;
          renderUsersTable(data.users);
        } else {
          if (tbody) tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--danger);">Không thể tải dữ liệu: ' + escapeHtml(data.error) + '</td></tr>';
        }
      }

      function renderUsersTable(users) {
        const tbody = document.getElementById('users-table-body');
        if (!tbody) return;

        if (!users || users.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">Không tìm thấy người dùng nào phù hợp.</td></tr>';
          return;
        }

        let html = '';
        users.forEach(u => {
          const avatarUrl = u.avatar_url || 'https://api.dicebear.com/7.x/identicon/svg?seed=' + u.id;
          const isVerified = Boolean(u.is_verified);
          const isVip = Boolean(u.is_vip || u.is_oa || u.account_type === 'oa');
          const isBanned = Boolean(u.is_banned);
          const role = u.role || 'user';

          let badgesHtml = '';
          if (isBanned) {
            badgesHtml += '<span class="status-badge banned"><i class="fas fa-ban"></i> Bị Khóa</span> ';
          } else {
            badgesHtml += '<span class="status-badge active"><i class="fas fa-circle" style="font-size: 6px;"></i> Hoạt Động</span> ';
          }
          if (isVerified) {
            badgesHtml += '<span class="status-badge verified" title="Tài khoản tích xanh"><i class="fas fa-circle-check"></i> Tích Xanh</span> ';
          }
          if (isVip) {
            badgesHtml += '<span class="status-badge oa" title="Tài khoản Doanh Nghiệp / OA"><i class="fas fa-star"></i> OA</span> ';
          }

          html += \`
            <tr>
              <td>
                <div class="cell-user-info">
                  <img src="\${escapeHtml(avatarUrl)}" class="user-avatar-img" alt="avatar" onerror="this.src='https://api.dicebear.com/7.x/identicon/svg?seed=\${u.id}'">
                  <div class="user-text-meta">
                    <span class="user-display-name">
                      \${escapeHtml(u.display_name || u.username || 'Người dùng')}
                      \${isVerified ? '<i class="fas fa-circle-check text-primary" style="font-size: 13px;"></i>' : ''}
                      \${isVip ? '<i class="fas fa-star" style="color: #f59e0b; font-size: 13px;"></i>' : ''}
                    </span>
                    <span class="user-handle">@\${escapeHtml(u.username || 'chua_dat_ten')}</span>
                  </div>
                </div>
              </td>
              <td>
                <span class="id-pill" onclick="copyToClipboard('\${u.id}')" title="Nhấp để sao chép UID">
                  \${u.id.substring(0, 8)}... <i class="fas fa-copy" style="font-size: 10px;"></i>
                </span>
              </td>
              <td>\${badgesHtml}</td>
              <td>
                <span class="status-badge \${role === 'admin' ? 'admin' : ''}" style="text-transform: capitalize; font-family: var(--font-mono);">
                  \${escapeHtml(role)}
                </span>
              </td>
              <td style="font-size: 12.5px; color: var(--text-secondary);">\${formatDate(u.created_at)}</td>
              <td style="text-align: right;">
                <div class="action-btn-group" style="justify-content: flex-end;">
                  <!-- Toggle Verify -->
                  <button class="btn-icon \${isVerified ? 'success' : ''}" onclick="toggleVerify('\${u.id}', \${!isVerified})" title="\${isVerified ? 'Gỡ Tích Xanh' : 'Cấp Tích Xanh'}">
                    <i class="fas fa-check-double"></i>
                  </button>
                  <!-- Toggle VIP / OA -->
                  <button class="btn-icon" onclick="toggleVip('\${u.id}', \${!isVip})" title="\${isVip ? 'Gỡ Huy Hiệu OA' : 'Kích Hoạt Tích Vàng OA'}">
                    <i class="fas fa-star" style="\${isVip ? 'color: #f59e0b;' : ''}"></i>
                  </button>
                  <!-- Change Role -->
                  <button class="btn-icon" onclick="promptChangeRole('\${u.id}', '\${escapeHtml(u.display_name || u.username)}', '\${role}')" title="Phân Quyền Vai Trò">
                    <i class="fas fa-user-shield"></i>
                  </button>
                  <!-- Toggle Ban -->
                  <button class="btn-icon \${isBanned ? 'danger' : ''}" onclick="toggleBan('\${u.id}', \${!isBanned})" title="\${isBanned ? 'Mở Khóa Nick' : 'Khóa Tài Khoản'}">
                    <i class="fas \${isBanned ? 'fa-lock' : 'fa-lock-open'}"></i>
                  </button>
                  <!-- Reset OA Edit -->
                  <button class="btn-icon" onclick="resetOaEditCount('\${u.id}', '\${escapeHtml(u.display_name || u.username)}')" title="Cấp Lại Lượt Sửa Thông Tin OA">
                    <i class="fas fa-rotate"></i>
                  </button>
                  <!-- Wipe User Account -->
                  <button class="btn-icon danger" onclick="confirmDeleteUser('\${u.id}', '\${escapeHtml(u.display_name || u.username)}')" title="Xóa Sạch Tài Khoản Vĩnh Viễn">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          \`;
        });

        tbody.innerHTML = html;
      }

      window.copyToClipboard = function(text) {
        if (!navigator.clipboard) return;
        navigator.clipboard.writeText(text).then(() => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'info',
            title: 'Đã sao chép ID vào bộ nhớ tạm!',
            showConfirmButton: false,
            timer: 1200
          });
        });
      };

      window.toggleVerify = async function(userId, newStatus) {
        const data = await safeFetchJson(\`/api/admin/users/\${userId}/toggle-verify\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
          body: JSON.stringify({ isVerified: newStatus })
        });
        if (data.success) {
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: data.message, showConfirmButton: false, timer: 1500 });
          fetchUsers();
        } else {
          Swal.fire({ icon: 'error', title: 'Lỗi', text: data.error });
        }
      };

      window.toggleVip = async function(userId, newStatus) {
        const data = await safeFetchJson(\`/api/admin/users/\${userId}/toggle-vip\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
          body: JSON.stringify({ isVip: newStatus })
        });
        if (data.success) {
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: data.message, showConfirmButton: false, timer: 1500 });
          fetchUsers();
        } else {
          Swal.fire({ icon: 'error', title: 'Lỗi', text: data.error });
        }
      };

      window.toggleBan = async function(userId, newStatus) {
        const confirmMsg = newStatus ? 'Khóa vĩnh viễn tài khoản này?' : 'Mở khóa hoạt động cho tài khoản?';
        Swal.fire({
          title: confirmMsg,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: newStatus ? 'Khóa Ngay' : 'Mở Khóa',
          cancelButtonText: 'Hủy'
        }).then(async (res) => {
          if (res.isConfirmed) {
            const data = await safeFetchJson(\`/api/admin/users/\${userId}/toggle-ban\`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
              body: JSON.stringify({ isBanned: newStatus })
            });
            if (data.success) {
              Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: data.message, showConfirmButton: false, timer: 1500 });
              fetchUsers();
            } else {
              Swal.fire({ icon: 'error', title: 'Lỗi', text: data.error });
            }
          }
        });
      };

      window.promptChangeRole = function(userId, name, currentRole) {
        Swal.fire({
          title: 'Phân Quyền: ' + name,
          input: 'select',
          inputOptions: {
            'user': 'Thành Viên Thường (user)',
            'moderator': 'Kiểm Duyệt Viên (moderator)',
            'admin': 'Quản Trị Viên (admin)'
          },
          inputValue: currentRole,
          showCancelButton: true,
          confirmButtonText: 'Lưu Phân Quyền',
          cancelButtonText: 'Hủy'
        }).then(async (res) => {
          if (res.isConfirmed && res.value) {
            const data = await safeFetchJson(\`/api/admin/users/\${userId}/change-role\`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
              body: JSON.stringify({ role: res.value })
            });
            if (data.success) {
              Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: data.message, showConfirmButton: false, timer: 1500 });
              fetchUsers();
            } else {
              Swal.fire({ icon: 'error', title: 'Lỗi', text: data.error });
            }
          }
        });
      };

      window.resetOaEditCount = function(userId, name) {
        Swal.fire({
          title: 'Cấp lại lượt sửa thông tin OA?',
          text: 'Người dùng ' + name + ' sẽ được mở thêm 1 lần chỉnh sửa trực tiếp thông tin OA.',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Đồng ý',
          cancelButtonText: 'Hủy'
        }).then(async (res) => {
          if (res.isConfirmed) {
            const data = await safeFetchJson(\`/api/admin/users/\${userId}/reset-oa-edit\`, {
              method: 'POST',
              headers: { 'Authorization': 'Bearer ' + adminToken }
            });
            if (data.success) {
              Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: data.message, showConfirmButton: false, timer: 1500 });
              fetchUsers();
            } else {
              Swal.fire({ icon: 'error', title: 'Lỗi', text: data.error });
            }
          }
        });
      };

      window.confirmDeleteUser = function(userId, name) {
        Swal.fire({
          title: 'XÓA SẠCH TÀI KHOẢN VĨNH VIỄN?',
          html: '<span style="color: #ef4444; font-weight: 600;">Hành động này KHÔNG THỂ HOÀN TÁC!</span><br>Toàn bộ bài viết, bình luận, tin nhắn, thông báo của người dùng <b>' + escapeHtml(name) + '</b> sẽ bị xóa khỏi cơ sở dữ liệu.',
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: 'Tôi Hiểu, Hãy Xóa Hết',
          cancelButtonText: 'Hủy Bỏ',
          confirmButtonColor: '#ef4444'
        }).then(async (res) => {
          if (res.isConfirmed) {
            const data = await safeFetchJson('/api/admin/users/' + userId, {
              method: 'DELETE',
              headers: { 'Authorization': 'Bearer ' + adminToken }
            });
            if (data.success) {
              Swal.fire({ icon: 'success', title: 'Đã xóa hoàn toàn', text: data.message });
              fetchUsers();
            } else {
              Swal.fire({ icon: 'error', title: 'Lỗi', text: data.error });
            }
          }
        });
      };

      // ==============================================================
      // 3. XÉT DUYỆT & YÊU CẦU (REQUESTS)
      // ==============================================================
      window.filterRequests = function(type) {
        store.requestFilter = type;
        document.querySelectorAll('#tab-xet-duyet .filter-pill').forEach(p => p.classList.remove('active'));
        const btn = document.getElementById('pill-req-' + type);
        if (btn) btn.classList.add('active');

        if (type === 'all') {
          renderRequests(store.requests);
        } else if (type === 'verified') {
          renderRequests(store.requests.filter(r => r.type === 'verified' || r.request_type === 'verified_badge'));
        } else if (type === 'oa') {
          renderRequests(store.requests.filter(r => r.type === 'oa' || r.request_type === 'oa_upgrade'));
        }
      };

      async function fetchRequests(showToast = false) {
        const container = document.getElementById('requests-container');
        if (container) container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-muted);"><i class="fas fa-spinner fa-spin me-2"></i> Đang tải danh sách chờ duyệt...</div>';

        const data = await safeFetchJson('/api/admin/requests', {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });

        if (data.success && data.requests) {
          store.requests = data.requests;
          renderRequests(data.requests);
          const bReq = document.getElementById('badge-requests-count');
          if (bReq) bReq.textContent = data.requests.length;

          if (showToast) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã cập nhật hàng đợi!', showConfirmButton: false, timer: 1200 });
          }
        } else {
          if (container) container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--danger);">Lỗi tải hàng đợi: ' + escapeHtml(data.error) + '</div>';
        }
      }

      function renderRequests(requests) {
        const container = document.getElementById('requests-container');
        if (!container) return;

        if (!requests || requests.length === 0) {
          container.innerHTML = '<div style="text-align: center; padding: 50px; color: var(--text-muted);"><i class="fas fa-check-circle text-success fa-2x mb-3"></i><br>Hàng đợi trống! Hiện không có yêu cầu nào cần duyệt.</div>';
          return;
        }

        let html = '<div style="display: flex; flex-direction: column; gap: 14px;">';
        requests.forEach(r => {
          const u = r.user || r.profile || {};
          const isOaReq = r.type === 'oa' || r.request_type === 'oa_upgrade';
          const avatarUrl = u.avatar_url || 'https://api.dicebear.com/7.x/identicon/svg?seed=' + (u.id || r.id);

          html += \`
            <div style="background: var(--bg-card); border: 1px solid var(--border-default); border-radius: var(--radius-md); padding: 16px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
              <div style="display: flex; align-items: center; gap: 14px;">
                <img src="\${escapeHtml(avatarUrl)}" class="user-avatar-img" style="width: 44px; height: 44px;" alt="avatar">
                <div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <strong style="font-size: 14px;">\${escapeHtml(u.display_name || u.username || 'Người dùng')}</strong>
                    <span class="user-handle">@\${escapeHtml(u.username || '')}</span>
                    <span class="status-badge \${isOaReq ? 'oa' : 'verified'}">
                      \${isOaReq ? '<i class="fas fa-star"></i> Đề xuất OA' : '<i class="fas fa-check"></i> Xin Tích Xanh'}
                    </span>
                  </div>
                  <div style="font-size: 12.5px; color: var(--text-secondary); margin-top: 4px;">
                    \${escapeHtml(r.reason || r.note || r.details || 'Yêu cầu xác minh tài khoản chính chủ.')}
                  </div>
                  <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 2px;">
                    Gửi lúc: \${formatDate(r.created_at)}
                  </div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 8px;">
                <button class="btn-db btn-db-primary btn-db-sm" onclick="reviewRequest('\${r.id}', 'approve', '\${escapeHtml(u.display_name || u.username)}')">
                  <i class="fas fa-check me-1"></i> Phê Duyệt
                </button>
                <button class="btn-db btn-db-danger btn-db-sm" onclick="reviewRequest('\${r.id}', 'reject', '\${escapeHtml(u.display_name || u.username)}')">
                  <i class="fas fa-times me-1"></i> Từ Chối
                </button>
              </div>
            </div>
          \`;
        });
        html += '</div>';

        container.innerHTML = html;
      }

      window.reviewRequest = function(reqId, action, userName) {
        const isApprove = action === 'approve';
        if (isApprove) {
          Swal.fire({
            title: 'Phê duyệt hồ sơ?',
            text: 'Cấp huy hiệu xác thực chính thức cho ' + userName,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Đồng Ý Duyệt',
            cancelButtonText: 'Hủy'
          }).then(async (res) => {
            if (res.isConfirmed) {
              const data = await safeFetchJson(\`/api/admin/requests/\${reqId}/approve\`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
                body: JSON.stringify({ reason: 'Hồ sơ đạt tiêu chuẩn phê duyệt.' })
              });
              if (data.success) {
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: data.message, showConfirmButton: false, timer: 1500 });
                fetchRequests();
              } else {
                Swal.fire({ icon: 'error', title: 'Lỗi', text: data.error });
              }
            }
          });
        } else {
          Swal.fire({
            title: 'Từ chối yêu cầu của ' + userName,
            input: 'text',
            inputPlaceholder: 'Nhập lý do từ chối (hồ sơ chưa đủ, mạo danh...)',
            showCancelButton: true,
            confirmButtonText: 'Xác Nhận Từ Chối',
            cancelButtonText: 'Hủy',
            confirmButtonColor: '#ef4444'
          }).then(async (res) => {
            if (res.isConfirmed) {
              const reason = res.value || 'Hồ sơ chưa đạt tiêu chuẩn.';
              const data = await safeFetchJson(\`/api/admin/requests/\${reqId}/reject\`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
                body: JSON.stringify({ reason })
              });
              if (data.success) {
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: data.message, showConfirmButton: false, timer: 1500 });
                fetchRequests();
              } else {
                Swal.fire({ icon: 'error', title: 'Lỗi', text: data.error });
              }
            }
          });
        }
      };

      // ==============================================================
      // 4. NHÓM TRÒ CHUYỆN (GROUPS)
      // ==============================================================
      window.onSearchGroupsDebounced = function() {
        clearTimeout(searchDebounceTimers.groups);
        searchDebounceTimers.groups = setTimeout(() => {
          fetchGroups(1);
        }, 250);
      };

      async function fetchGroups(page = 1, showToast = false) {
        store.groupsPage = page;
        const search = (document.getElementById('groups-search-input')?.value || '').trim();
        const url = \`/api/admin/groups?page=\${page}&limit=20&search=\${encodeURIComponent(search)}\`;

        const tbody = document.getElementById('groups-table-body');
        if (tbody) tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--text-muted);"><i class="fas fa-spinner fa-spin me-2"></i> Đang tải danh sách nhóm...</td></tr>';

        const data = await safeFetchJson(url, {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });

        if (data.success && data.groups) {
          store.groups = data.groups;
          store.groupsTotal = data.total || 0;
          renderGroupsTable(data.groups);
          renderGroupsPagination(data.total, page, 20);

          if (showToast) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã làm mới danh sách nhóm!', showConfirmButton: false, timer: 1200 });
          }
        } else {
          if (tbody) tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--danger);">Lỗi tải nhóm: ' + escapeHtml(data.error) + '</td></tr>';
        }
      }

      function renderGroupsTable(groups) {
        const tbody = document.getElementById('groups-table-body');
        if (!tbody) return;

        if (!groups || groups.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--text-muted);">Không tìm thấy nhóm trò chuyện nào.</td></tr>';
          return;
        }

        let html = '';
        groups.forEach(g => {
          html += \`
            <tr>
              <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="width: 36px; height: 36px; border-radius: var(--radius-md); background: var(--purple-subtle); color: var(--purple); display: flex; align-items: center; justify-content: center; font-size: 15px;">
                    <i class="fas fa-users-rectangle"></i>
                  </div>
                  <div>
                    <strong style="font-size: 13.5px;">\${escapeHtml(g.name || 'Nhóm không tên')}</strong>
                    <div style="font-size: 11.5px; color: var(--text-muted);">Tạo bởi: \${escapeHtml(g.created_by || 'Hệ thống')}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="id-pill" onclick="copyToClipboard('\${g.id}')">
                  \${g.id.substring(0, 8)}... <i class="fas fa-copy" style="font-size: 10px;"></i>
                </span>
              </td>
              <td>
                <span class="status-badge" style="background: var(--bg-card); border: 1px solid var(--border-default);">
                  <i class="fas fa-user-group me-1" style="color: var(--purple);"></i> \${g.member_count || (g.members ? g.members.length : 0)} thành viên
                </span>
              </td>
              <td style="font-size: 12.5px; color: var(--text-secondary);">\${formatDate(g.created_at)}</td>
              <td style="text-align: right;">
                <div class="action-btn-group" style="justify-content: flex-end;">
                  <button class="btn-icon" onclick="showGroupMembers('\${g.id}', '\${escapeHtml(g.name)}')" title="Xem Danh Sách Thành Viên">
                    <i class="fas fa-list"></i>
                  </button>
                  <button class="btn-icon danger" onclick="confirmDisbandGroup('\${g.id}', '\${escapeHtml(g.name)}')" title="Giải Tán & Xóa Nhóm Vi Phạm">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          \`;
        });

        tbody.innerHTML = html;
      }

      function renderGroupsPagination(total, page, limit) {
        const info = document.getElementById('groups-pagination-info');
        const btns = document.getElementById('groups-pagination-btns');
        if (!info || !btns) return;

        const maxPage = Math.max(1, Math.ceil(total / limit));
        info.textContent = \`Hiển thị trang \${page} / \${maxPage} (Tổng cộng \${total} nhóm)\`;

        btns.innerHTML = \`
          <button class="btn-db btn-db-outline btn-db-sm" \${page <= 1 ? 'disabled' : ''} onclick="fetchGroups(\${page - 1})">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="btn-db btn-db-outline btn-db-sm" \${page >= maxPage ? 'disabled' : ''} onclick="fetchGroups(\${page + 1})">
            <i class="fas fa-chevron-right"></i>
          </button>
        \`;
      }

      window.showGroupMembers = async function(groupId, groupName) {
        document.getElementById('modalGroupTitle').innerHTML = '<i class="fas fa-users me-2 text-primary"></i>Thành Viên: ' + escapeHtml(groupName);
        const listTbody = document.getElementById('modalGroupMembersList');
        listTbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 30px; color: var(--text-muted);"><i class="fas fa-spinner fa-spin me-2"></i> Đang tải thành viên...</td></tr>';

        const myModal = new bootstrap.Modal(document.getElementById('modalGroupMembers'));
        myModal.show();

        const data = await safeFetchJson('/api/admin/groups/' + groupId + '/members', {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });

        if (data.success && data.members) {
          if (data.members.length === 0) {
            listTbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 30px; color: var(--text-muted);">Nhóm chưa có thành viên nào.</td></tr>';
            return;
          }
          let html = '';
          data.members.forEach(m => {
            const avatarUrl = m.avatar_url || 'https://api.dicebear.com/7.x/identicon/svg?seed=' + m.id;
            html += \`
              <tr>
                <td>
                  <div class="cell-user-info">
                    <img src="\${escapeHtml(avatarUrl)}" class="user-avatar-img" alt="avatar">
                    <div class="user-text-meta">
                      <span class="user-display-name">\${escapeHtml(m.display_name || m.username || 'Thành viên')}</span>
                      <span class="user-handle">@\${escapeHtml(m.username || '')}</span>
                    </div>
                  </div>
                </td>
                <td><span class="id-pill" onclick="copyToClipboard('\${m.id}')">\${m.id.substring(0, 8)}...</span></td>
                <td><span class="status-badge \${m.is_admin ? 'admin' : ''}">\${m.is_admin ? 'Trưởng nhóm' : 'Thành viên'}</span></td>
                <td style="font-size: 12px; color: var(--text-secondary);">\${formatDate(m.joined_at)}</td>
              </tr>
            \`;
          });
          listTbody.innerHTML = html;
        } else {
          listTbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 30px; color: var(--danger);">Lỗi tải thành viên nhóm: ' + escapeHtml(data.error) + '</td></tr>';
        }
      };

      window.confirmDisbandGroup = function(groupId, groupName) {
        Swal.fire({
          title: 'Giải tán nhóm này?',
          html: 'Toàn bộ tin nhắn và thành viên trong nhóm <b>' + escapeHtml(groupName) + '</b> sẽ bị xóa khỏi hệ thống.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Giải Tán Ngay',
          cancelButtonText: 'Hủy',
          confirmButtonColor: '#ef4444'
        }).then(async (res) => {
          if (res.isConfirmed) {
            const data = await safeFetchJson('/api/admin/groups/' + groupId, {
              method: 'DELETE',
              headers: { 'Authorization': 'Bearer ' + adminToken }
            });
            if (data.success) {
              Swal.fire({ icon: 'success', title: 'Đã giải tán nhóm', text: data.message });
              fetchGroups(store.groupsPage);
            } else {
              Swal.fire({ icon: 'error', title: 'Lỗi', text: data.error });
            }
          }
        });
      };

      // ==============================================================
      // 5. TÊN NGƯỜI DÙNG CẤM & BẢO LƯU (BANNED USERNAMES)
      // ==============================================================
      async function fetchBannedUsernames() {
        const tbody = document.getElementById('banned-table-body');
        if (tbody) tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px; color: var(--text-muted);"><i class="fas fa-spinner fa-spin me-2"></i> Đang tải danh sách...</td></tr>';

        const data = await safeFetchJson('/api/admin/banned-usernames', {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });

        if (data.success && data.bannedUsernames) {
          store.bannedUsernames = data.bannedUsernames;
          renderBannedUsernames(data.bannedUsernames);
        } else {
          if (tbody) tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px; color: var(--danger);">Lỗi tải danh sách: ' + escapeHtml(data.error) + '</td></tr>';
        }
      }

      function renderBannedUsernames(items) {
        const tbody = document.getElementById('banned-table-body');
        if (!tbody) return;

        if (!items || items.length === 0) {
          tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px; color: var(--text-muted);">Chưa có username nào trong danh sách cấm.</td></tr>';
          return;
        }

        let html = '';
        items.forEach(b => {
          html += \`
            <tr>
              <td>
                <span class="status-badge banned" style="font-family: var(--font-mono); font-size: 13px;">
                  @\${escapeHtml(b.username)}
                </span>
              </td>
              <td>\${escapeHtml(b.reason || 'Bảo lưu kỹ thuật hệ thống')}</td>
              <td style="font-size: 12.5px; color: var(--text-secondary);">\${formatDate(b.created_at)}</td>
              <td style="text-align: right;">
                <button class="btn-icon danger" onclick="confirmDeleteBannedUsername('\${b.id}', '\${escapeHtml(b.username)}')" title="Gỡ Bỏ Khỏi Danh Sách Cấm">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          \`;
        });

        tbody.innerHTML = html;
      }

      window.filterBannedUsernames = function() {
        const q = (document.getElementById('banned-search-input')?.value || '').trim().toLowerCase();
        if (!q) {
          renderBannedUsernames(store.bannedUsernames);
          return;
        }
        const filtered = store.bannedUsernames.filter(b => 
          (b.username && b.username.toLowerCase().includes(q)) ||
          (b.reason && b.reason.toLowerCase().includes(q))
        );
        renderBannedUsernames(filtered);
      };

      window.openAddBannedModal = function() {
        document.getElementById('inputBannedUsername').value = '';
        document.getElementById('inputBannedReason').value = '';
        const modal = new bootstrap.Modal(document.getElementById('modalAddBannedUser'));
        modal.show();
      };

      window.submitAddBannedUsername = async function() {
        const username = document.getElementById('inputBannedUsername').value.trim();
        const reason = document.getElementById('inputBannedReason').value.trim();
        if (!username || !reason) return;

        const data = await safeFetchJson('/api/admin/banned-usernames', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
          body: JSON.stringify({ username, reason })
        });

        if (data.success) {
          bootstrap.Modal.getInstance(document.getElementById('modalAddBannedUser'))?.hide();
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: data.message, showConfirmButton: false, timer: 1500 });
          fetchBannedUsernames();
        } else {
          Swal.fire({ icon: 'error', title: 'Lỗi', text: data.error });
        }
      };

      window.confirmDeleteBannedUsername = function(id, username) {
        Swal.fire({
          title: 'Gỡ username cấm?',
          text: 'Sau khi gỡ, người dùng có thể đăng ký tài khoản mang tên @' + username,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Gỡ Bỏ',
          cancelButtonText: 'Hủy'
        }).then(async (res) => {
          if (res.isConfirmed) {
            const data = await safeFetchJson('/api/admin/banned-usernames/' + encodeURIComponent(id), {
              method: 'DELETE',
              headers: { 'Authorization': 'Bearer ' + adminToken }
            });
            if (data.success) {
              Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: data.message, showConfirmButton: false, timer: 1500 });
              fetchBannedUsernames();
            } else {
              Swal.fire({ icon: 'error', title: 'Lỗi', text: data.error });
            }
          }
        });
      };

      // ==============================================================
      // 6. BÀI VIẾT FEED (POSTS)
      // ==============================================================
      window.onSearchPostsDebounced = function() {
        clearTimeout(searchDebounceTimers.posts);
        searchDebounceTimers.posts = setTimeout(() => {
          fetchPosts();
        }, 250);
      };

      async function fetchPosts(showToast = false) {
        const q = (document.getElementById('posts-search-input')?.value || '').trim();
        let url = '/api/admin/posts';
        if (q) url += '?q=' + encodeURIComponent(q);

        const tbody = document.getElementById('posts-table-body');
        if (tbody) tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--text-muted);"><i class="fas fa-spinner fa-spin me-2"></i> Đang tải bài viết...</td></tr>';

        const data = await safeFetchJson(url, {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });

        if (data.success && data.posts) {
          store.posts = data.posts;
          renderPostsTable(data.posts);
          if (showToast) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã làm mới bài viết!', showConfirmButton: false, timer: 1200 });
          }
        } else {
          if (tbody) tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--danger);">Lỗi tải bài viết: ' + escapeHtml(data.error) + '</td></tr>';
        }
      }

      function renderPostsTable(posts) {
        const tbody = document.getElementById('posts-table-body');
        if (!tbody) return;

        if (!posts || posts.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--text-muted);">Không tìm thấy bài viết nào.</td></tr>';
          return;
        }

        let html = '';
        posts.forEach(p => {
          const author = p.author || p.profiles || {};
          const avatarUrl = author.avatar_url || 'https://api.dicebear.com/7.x/identicon/svg?seed=' + (author.id || p.id);
          const isPinned = Boolean(p.is_pinned);

          let mediaPreview = '';
          if (p.media_urls && Array.isArray(p.media_urls) && p.media_urls.length > 0) {
            mediaPreview = '<div style="display: flex; gap: 6px; margin-top: 6px; flex-wrap: wrap;">';
            p.media_urls.slice(0, 3).forEach(url => {
              if (url.match(/\\.(mp4|mov|webm)$/i)) {
                mediaPreview += \`<a href="/watch?url=\${encodeURIComponent(url)}" target="_blank" class="status-badge" style="background: var(--bg-card);"><i class="fas fa-play me-1 text-danger"></i> Video</a>\`;
              } else {
                mediaPreview += \`<img src="\${escapeHtml(url)}" style="width: 44px; height: 44px; border-radius: 6px; object-fit: cover; border: 1px solid var(--border-default);">\`;
              }
            });
            if (p.media_urls.length > 3) {
              mediaPreview += \`<span style="font-size: 11px; color: var(--text-muted); align-self: center;">+\${p.media_urls.length - 3}</span>\`;
            }
            mediaPreview += '</div>';
          }

          html += \`
            <tr>
              <td>
                <div class="cell-user-info">
                  <img src="\${escapeHtml(avatarUrl)}" class="user-avatar-img" alt="avatar">
                  <div class="user-text-meta">
                    <span class="user-display-name">
                      \${escapeHtml(author.display_name || author.username || 'Người dùng')}
                      \${author.is_verified ? '<i class="fas fa-circle-check text-primary" style="font-size: 12px;"></i>' : ''}
                    </span>
                    <span class="user-handle">@\${escapeHtml(author.username || '')}</span>
                  </div>
                </div>
              </td>
              <td>
                <div>
                  <div style="font-size: 13.5px; line-height: 1.4; max-width: 460px;">
                    \${isPinned ? '<span class="status-badge" style="background: var(--primary-subtle); color: var(--primary); margin-right: 6px;"><i class="fas fa-thumbtack"></i> Đã Ghim</span>' : ''}
                    \${escapeHtml(p.content || '(Không có văn bản)')}
                  </div>
                  \${mediaPreview}
                  \${p.link_url ? \`<div style="font-size: 11.5px; margin-top: 4px;"><a href="\${escapeHtml(p.link_url)}" target="_blank" style="color: var(--primary); text-decoration: none;"><i class="fas fa-link me-1"></i>\${escapeHtml(p.link_url)}</a></div>\` : ''}
                </div>
              </td>
              <td>
                <div style="font-size: 12px; color: var(--text-secondary); display: flex; gap: 10px;">
                  <span><i class="fas fa-heart text-danger me-1"></i>\${p.likes_count || 0}</span>
                  <span><i class="fas fa-comment text-primary me-1"></i>\${p.comments_count || 0}</span>
                </div>
              </td>
              <td style="font-size: 12px; color: var(--text-secondary);">\${formatDate(p.created_at)}</td>
              <td style="text-align: right;">
                <div class="action-btn-group" style="justify-content: flex-end;">
                  <button class="btn-icon \${isPinned ? 'primary' : ''}" onclick="togglePinPost('\${p.id}', \${!isPinned})" title="\${isPinned ? 'Bỏ Ghim Bài' : 'Ghim Bài Viết Lên Đầu'}">
                    <i class="fas fa-thumbtack" style="\${isPinned ? 'color: var(--primary);' : ''}"></i>
                  </button>
                  <button class="btn-icon" onclick="openEditPostModal('\${p.id}')" title="Sửa Bài Viết">
                    <i class="fas fa-pen-to-square"></i>
                  </button>
                  <button class="btn-icon danger" onclick="deletePost('\${p.id}')" title="Xóa Bài Viết Vi Phạm">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          \`;
        });

        tbody.innerHTML = html;
      }

      window.togglePinPost = async function(postId, newStatus) {
        const data = await safeFetchJson(\`/api/admin/posts/\${postId}/toggle-pin\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
          body: JSON.stringify({ isPinned: newStatus })
        });
        if (data.success) {
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: data.message, showConfirmButton: false, timer: 1200 });
          fetchPosts();
        } else {
          Swal.fire({ icon: 'error', title: 'Lỗi', text: data.error });
        }
      };

      window.openEditPostModal = function(postId) {
        const post = store.posts.find(p => p.id === postId);
        if (!post) return;

        store.editingPost = JSON.parse(JSON.stringify(post));
        document.getElementById('editPostId').value = post.id;
        document.getElementById('editPostContent').value = post.content || '';
        document.getElementById('editPostLink').value = post.link_url || '';

        renderEditPostMediaList();
        const modal = new bootstrap.Modal(document.getElementById('modalEditPost'));
        modal.show();
      };

      function renderEditPostMediaList() {
        const container = document.getElementById('editPostMediaContainer');
        if (!container || !store.editingPost) return;

        const urls = store.editingPost.media_urls || [];
        if (urls.length === 0) {
          container.innerHTML = '<span style="font-size: 12px; color: var(--text-muted);">Chưa có tệp đính kèm nào.</span>';
          return;
        }

        let html = '';
        urls.forEach((url, idx) => {
          html += \`
            <div style="position: relative; display: inline-block;">
              <img src="\${escapeHtml(url)}" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover; border: 1px solid var(--border-default);">
              <button type="button" class="btn-icon danger" onclick="removeEditPostMedia(\${idx})" style="position: absolute; top: -6px; right: -6px; width: 20px; height: 20px; font-size: 10px; background: var(--bg-surface); border-radius: 50%;">
                <i class="fas fa-times"></i>
              </button>
            </div>
          \`;
        });
        container.innerHTML = html;
      }

      window.removeEditPostMedia = function(idx) {
        if (!store.editingPost || !store.editingPost.media_urls) return;
        store.editingPost.media_urls.splice(idx, 1);
        renderEditPostMediaList();
      };

      window.addEditPostMediaUrl = function() {
        const input = document.getElementById('newMediaUrlInput');
        const url = (input?.value || '').trim();
        if (!url || !store.editingPost) return;

        if (!store.editingPost.media_urls) store.editingPost.media_urls = [];
        store.editingPost.media_urls.push(url);
        input.value = '';
        renderEditPostMediaList();
      };

      window.submitEditPost = async function() {
        const id = document.getElementById('editPostId').value;
        const content = document.getElementById('editPostContent').value;
        const link_url = document.getElementById('editPostLink').value;
        const media_urls = store.editingPost ? store.editingPost.media_urls : [];

        const data = await safeFetchJson('/api/admin/posts/' + encodeURIComponent(id), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
          body: JSON.stringify({ content, link_url, media_urls })
        });

        if (data.success) {
          bootstrap.Modal.getInstance(document.getElementById('modalEditPost'))?.hide();
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: data.message, showConfirmButton: false, timer: 1500 });
          fetchPosts();
        } else {
          Swal.fire({ icon: 'error', title: 'Lỗi', text: data.error });
        }
      };

      window.deletePost = function(postId) {
        Swal.fire({
          title: 'Xóa bài viết này?',
          text: 'Bài viết và toàn bộ phản hồi, bình luận liên quan sẽ bị xóa vĩnh viễn.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Xóa Ngay',
          cancelButtonText: 'Hủy',
          confirmButtonColor: '#ef4444'
        }).then(async (res) => {
          if (res.isConfirmed) {
            const data = await safeFetchJson(\`/api/admin/posts/\${postId}\`, {
              method: 'DELETE',
              headers: { 'Authorization': 'Bearer ' + adminToken }
            });
            if (data.success) {
              Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: data.message, showConfirmButton: false, timer: 1500 });
              fetchPosts();
            } else {
              Swal.fire({ icon: 'error', title: 'Lỗi', text: data.error });
            }
          }
        });
      };

      // ==============================================================
      // 7. BÌNH LUẬN (COMMENTS)
      // ==============================================================
      window.onSearchCommentsDebounced = function() {
        clearTimeout(searchDebounceTimers.comments);
        searchDebounceTimers.comments = setTimeout(() => {
          fetchComments();
        }, 250);
      };

      async function fetchComments(showToast = false) {
        const q = (document.getElementById('comments-search-input')?.value || '').trim();
        let url = '/api/admin/comments';
        if (q) url += '?q=' + encodeURIComponent(q);

        const tbody = document.getElementById('comments-table-body');
        if (tbody) tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--text-muted);"><i class="fas fa-spinner fa-spin me-2"></i> Đang tải bình luận...</td></tr>';

        const data = await safeFetchJson(url, {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });

        if (data.success && data.comments) {
          store.comments = data.comments;
          renderCommentsTable(data.comments);
          if (showToast) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã làm mới bình luận!', showConfirmButton: false, timer: 1200 });
          }
        } else {
          if (tbody) tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--danger);">Lỗi tải bình luận: ' + escapeHtml(data.error) + '</td></tr>';
        }
      }

      function renderCommentsTable(comments) {
        const tbody = document.getElementById('comments-table-body');
        if (!tbody) return;

        if (!comments || comments.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--text-muted);">Không tìm thấy bình luận nào.</td></tr>';
          return;
        }

        let html = '';
        comments.forEach(c => {
          const user = c.user || c.profiles || {};
          const post = c.post || c.posts || {};
          const avatarUrl = user.avatar_url || 'https://api.dicebear.com/7.x/identicon/svg?seed=' + (user.id || c.id);

          html += \`
            <tr>
              <td>
                <div class="cell-user-info">
                  <img src="\${escapeHtml(avatarUrl)}" class="user-avatar-img" alt="avatar">
                  <div class="user-text-meta">
                    <span class="user-display-name">\${escapeHtml(user.display_name || user.username || 'Người dùng')}</span>
                    <span class="user-handle">@\${escapeHtml(user.username || '')}</span>
                  </div>
                </div>
              </td>
              <td>
                <div style="font-size: 13.5px; max-width: 400px; line-height: 1.4;">
                  \${escapeHtml(c.content || '')}
                </div>
              </td>
              <td>
                <div style="font-size: 12px; color: var(--text-secondary); max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  \${escapeHtml(post.content || 'Bài viết #' + (c.post_id ? c.post_id.substring(0, 8) : ''))}
                </div>
              </td>
              <td style="font-size: 12px; color: var(--text-secondary);">\${formatDate(c.created_at)}</td>
              <td style="text-align: right;">
                <button class="btn-icon danger" onclick="deleteComment('\${c.id}')" title="Xóa Bình Luận Vi Phạm">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          \`;
        });

        tbody.innerHTML = html;
      }

      window.deleteComment = function(commentId) {
        Swal.fire({
          title: 'Xóa bình luận này?',
          text: 'Bình luận vi phạm sẽ bị xóa khỏi bài viết ngay lập tức.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Xóa Bình Luận',
          cancelButtonText: 'Hủy',
          confirmButtonColor: '#ef4444'
        }).then(async (res) => {
          if (res.isConfirmed) {
            const data = await safeFetchJson(\`/api/admin/comments/\${commentId}\`, {
              method: 'DELETE',
              headers: { 'Authorization': 'Bearer ' + adminToken }
            });
            if (data.success) {
              Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: data.message, showConfirmButton: false, timer: 1200 });
              fetchComments();
            } else {
              Swal.fire({ icon: 'error', title: 'Lỗi', text: data.error });
            }
          }
        });
      };

      // ==============================================================
      // 8. BÁO CÁO VI PHẠM (REPORTS)
      // ==============================================================
      window.filterReports = function(type) {
        store.reportFilter = type;
        document.querySelectorAll('#tab-bao-cao .filter-pill').forEach(p => p.classList.remove('active'));
        const btn = document.getElementById('pill-rep-' + type);
        if (btn) btn.classList.add('active');

        if (type === 'all') {
          renderReportsTable(store.reports);
        } else {
          renderReportsTable(store.reports.filter(r => r.target_type === type));
        }
      };

      async function fetchReports(showToast = false) {
        const tbody = document.getElementById('reports-table-body');
        if (tbody) tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);"><i class="fas fa-spinner fa-spin me-2"></i> Đang tải báo cáo...</td></tr>';

        const data = await safeFetchJson('/api/admin/reports', {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });

        if (data.success && data.reports) {
          store.reports = data.reports;
          renderReportsTable(data.reports);

          const pendingCount = data.reports.filter(r => r.status === 'pending').length;
          const bRep = document.getElementById('badge-reports-count');
          if (bRep) bRep.textContent = pendingCount;

          if (showToast) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã làm mới báo cáo!', showConfirmButton: false, timer: 1200 });
          }
        } else {
          if (tbody) tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--danger);">Lỗi tải báo cáo: ' + escapeHtml(data.error) + '</td></tr>';
        }
      }

      function renderReportsTable(reports) {
        const tbody = document.getElementById('reports-table-body');
        if (!tbody) return;

        if (!reports || reports.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);"><i class="fas fa-check-circle text-success fa-2x mb-3"></i><br>Không có báo cáo vi phạm nào!</td></tr>';
          return;
        }

        let html = '';
        reports.forEach(r => {
          const reporter = r.reporter || r.profiles || {};
          const isPending = r.status === 'pending';
          const typeBadgeMap = {
            'user': '<span class="status-badge" style="background: var(--purple-subtle); color: var(--purple);"><i class="fas fa-user"></i> Người Dùng</span>',
            'post': '<span class="status-badge" style="background: var(--cyan-subtle); color: var(--cyan);"><i class="fas fa-newspaper"></i> Bài Viết</span>',
            'comment': '<span class="status-badge" style="background: var(--primary-subtle); color: var(--primary);"><i class="fas fa-comment"></i> Bình Luận</span>',
          };

          html += \`
            <tr>
              <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                  \${typeBadgeMap[r.target_type] || '<span class="status-badge">Mục</span>'}
                  <span class="id-pill" onclick="copyToClipboard('\${r.target_id}')">\${r.target_id ? r.target_id.substring(0, 8) + '...' : '-'}</span>
                </div>
              </td>
              <td>
                <div style="font-size: 13px;">
                  <strong>\${escapeHtml(reporter.display_name || reporter.username || 'Ẩn danh')}</strong>
                  <div class="user-handle">@\${escapeHtml(reporter.username || '')}</div>
                </div>
              </td>
              <td>
                <div style="font-size: 13px; max-width: 320px; color: var(--text-primary);">
                  \${escapeHtml(r.reason || 'Vi phạm tiêu chuẩn cộng đồng')}
                </div>
              </td>
              <td>
                <span class="status-badge \${isPending ? 'pending' : 'verified'}">
                  \${isPending ? 'Chờ xử lý' : 'Đã duyệt'}
                </span>
              </td>
              <td style="font-size: 12px; color: var(--text-secondary);">\${formatDate(r.created_at)}</td>
              <td style="text-align: right;">
                <div class="action-btn-group" style="justify-content: flex-end;">
                  <button class="btn-icon" onclick="viewReportDetail('\${r.id}')" title="Xem Chi Tiết Báo Cáo">
                    <i class="fas fa-eye"></i>
                  </button>
                  \${isPending ? \`
                    <button class="btn-icon danger" onclick="resolveReport('\${r.id}', 'delete_content')" title="Xóa Nội Dung Vi Phạm">
                      <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn-icon" onclick="resolveReport('\${r.id}', 'dismiss')" title="Bỏ Qua Báo Cáo">
                      <i class="fas fa-check"></i>
                    </button>
                  \` : ''}
                </div>
              </td>
            </tr>
          \`;
        });

        tbody.innerHTML = html;
      }

      window.viewReportDetail = function(reportId) {
        const rep = store.reports.find(r => r.id === reportId);
        if (!rep) return;

        const body = document.getElementById('report-detail-body');
        const footer = document.getElementById('report-detail-footer');
        const reporter = rep.reporter || {};

        body.innerHTML = \`
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div>
              <span style="font-size: 12px; color: var(--text-muted);">Loại mục bị báo cáo:</span>
              <strong style="text-transform: uppercase; color: var(--primary); margin-left: 6px;">\${rep.target_type}</strong>
            </div>
            <div>
              <span style="font-size: 12px; color: var(--text-muted);">Người gửi báo cáo:</span>
              <div style="margin-top: 4px; font-weight: 600;">\${escapeHtml(reporter.display_name || reporter.username || 'Ẩn danh')} (@\${escapeHtml(reporter.username || '')})</div>
            </div>
            <div>
              <span style="font-size: 12px; color: var(--text-muted);">Lý do vi phạm:</span>
              <div style="margin-top: 4px; background: var(--bg-card); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-default);">
                \${escapeHtml(rep.reason || 'Không có ghi chú lý do')}
              </div>
            </div>
          </div>
        \`;

        footer.innerHTML = \`
          <button type="button" class="btn-db btn-db-outline" data-bs-dismiss="modal">Đóng</button>
          <button type="button" class="btn-db btn-db-danger" onclick="resolveReport('\${rep.id}', 'ban_user')">
            <i class="fas fa-ban me-1"></i> Khóa Nick Đối Tượng
          </button>
          <button type="button" class="btn-db btn-db-primary" onclick="resolveReport('\${rep.id}', 'dismiss')">
            <i class="fas fa-check me-1"></i> Bỏ Qua & Đóng Báo Cáo
          </button>
        \`;

        const modal = new bootstrap.Modal(document.getElementById('modalReportDetail'));
        modal.show();
      };

      window.resolveReport = function(reportId, action) {
        const actionLabels = {
          'dismiss': 'Bỏ qua và đóng báo cáo này?',
          'delete_content': 'Xóa nội dung bị tố cáo vi phạm?',
          'ban_user': 'Khóa vĩnh viễn tài khoản người bị tố cáo?'
        };

        Swal.fire({
          title: actionLabels[action] || 'Xử lý báo cáo?',
          icon: action === 'dismiss' ? 'question' : 'warning',
          showCancelButton: true,
          confirmButtonText: 'Xác Nhận',
          cancelButtonText: 'Hủy'
        }).then(async (res) => {
          if (res.isConfirmed) {
            const data = await safeFetchJson(\`/api/admin/reports/\${reportId}/action\`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
              body: JSON.stringify({ action })
            });

            if (data.success) {
              bootstrap.Modal.getInstance(document.getElementById('modalReportDetail'))?.hide();
              Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: data.message, showConfirmButton: false, timer: 1500 });
              fetchReports();
            } else {
              Swal.fire({ icon: 'error', title: 'Lỗi', text: data.error });
            }
          }
        });
      };

      // ==============================================================
      // 9. PHÁT THÔNG BÁO PUSH FCM (BROADCAST)
      // ==============================================================
      window.updateBroadcastPreview = function() {
        const title = document.getElementById('bc-title')?.value || '';
        const body = document.getElementById('bc-body')?.value || '';

        const pTitle = document.getElementById('preview-notif-title');
        const pBody = document.getElementById('preview-notif-body');

        if (pTitle) pTitle.textContent = title.trim() || 'Tiêu đề thông báo...';
        if (pBody) pBody.textContent = body.trim() || 'Nội dung chi tiết thông báo sẽ xuất hiện ở đây...';
      };

      window.sendBroadcast = async function() {
        const title = document.getElementById('bc-title').value.trim();
        const body = document.getElementById('bc-body').value.trim();
        const link = document.getElementById('bc-link').value.trim();

        if (!title || !body) return;

        Swal.fire({
          title: 'Phát thông báo tới toàn bộ thiết bị?',
          html: 'Thông báo sẽ được gửi qua Firebase Cloud Messaging (FCM) tới tất cả người dùng ứng dụng Dorabox.',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Gửi Ngay',
          cancelButtonText: 'Hủy'
        }).then(async (res) => {
          if (res.isConfirmed) {
            const btn = document.getElementById('btn-send-broadcast');
            if (btn) {
              btn.disabled = true;
              btn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Đang truyền dữ liệu...';
            }

            const data = await safeFetchJson('/api/admin/broadcast', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
              body: JSON.stringify({ title, body, link })
            });

            if (btn) {
              btn.disabled = false;
              btn.innerHTML = '<i class="fas fa-paper-plane me-1"></i> Phát Thông Báo Tới Toàn Bộ Thiết Bị';
            }

            if (data.success) {
              Swal.fire({
                icon: 'success',
                title: 'Phát thành công!',
                text: data.message || ('Đã gửi tới ' + (data.count || 0) + ' thiết bị.'),
              });
              document.getElementById('form-broadcast')?.reset();
              updateBroadcastPreview();
            } else {
              Swal.fire({ icon: 'error', title: 'Lỗi phát thông báo', text: data.error });
            }
          }
        });
      };

      // ==============================================================
      // 10. BẢO MẬT & AUDIT (SECURITY)
      // ==============================================================
      async function fetchSecurityLogs(showToast = false) {
        const tbody = document.getElementById('logs-table-body');
        if (tbody) tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);"><i class="fas fa-spinner fa-spin me-2"></i> Đang tải nhật ký...</td></tr>';

        const data = await safeFetchJson('/api/admin/system/audit-logs', {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });

        if (data.success && data.logs) {
          store.logs = data.logs;
          renderSecurityLogs(data.logs);
          if (showToast) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã cập nhật nhật ký bảo mật!', showConfirmButton: false, timer: 1200 });
          }
        } else {
          if (tbody) tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--danger);">Lỗi tải nhật ký: ' + escapeHtml(data.error) + '</td></tr>';
        }
      }

      function renderSecurityLogs(logs) {
        const tbody = document.getElementById('logs-table-body');
        if (!tbody) return;

        if (!logs || logs.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">Không có nhật ký bảo mật nào gần đây.</td></tr>';
          return;
        }

        let html = '';
        logs.forEach(l => {
          const sevMap = {
            'info': '<span class="status-badge" style="background: var(--primary-subtle); color: var(--primary);">Thông tin</span>',
            'warning': '<span class="status-badge warning">Cảnh báo</span>',
            'alert': '<span class="status-badge banned">Khẩn cấp</span>',
          };

          html += \`
            <tr>
              <td style="font-size: 12px; color: var(--text-secondary); white-space: nowrap;">\${formatDate(l.timestamp)}</td>
              <td>
                <span class="status-badge" style="background: var(--bg-card); font-family: var(--font-mono); font-size: 11.5px;">
                  \${escapeHtml(l.eventType || 'event')}
                </span>
              </td>
              <td>\${sevMap[l.severity] || '<span class="status-badge">info</span>'}</td>
              <td style="font-size: 13px; font-weight: 600;">\${escapeHtml(l.actor || 'system')}</td>
              <td>
                <div style="font-size: 13px; line-height: 1.4; max-width: 480px;">
                  \${escapeHtml(l.details || '')}
                </div>
              </td>
              <td style="font-family: var(--font-mono); font-size: 11.5px; color: var(--text-muted);">\${escapeHtml(l.ip || '-')}</td>
            </tr>
          \`;
        });

        tbody.innerHTML = html;
      }

      window.filterLogs = function() {
        const q = (document.getElementById('logs-search-input')?.value || '').trim().toLowerCase();
        if (!q) {
          renderSecurityLogs(store.logs);
          return;
        }
        const filtered = store.logs.filter(l => 
          (l.eventType && l.eventType.toLowerCase().includes(q)) ||
          (l.actor && l.actor.toLowerCase().includes(q)) ||
          (l.details && l.details.toLowerCase().includes(q))
        );
        renderSecurityLogs(filtered);
      };

      window.cleanSpamReactions = function() {
        Swal.fire({
          title: 'Dọn dẹp reactions spam?',
          text: 'Hệ thống sẽ quét và loại bỏ các lượt tương tác trùng lặp / spam tạo bởi bot.',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Dọn Dẹp Ngay',
          cancelButtonText: 'Hủy'
        }).then(async (res) => {
          if (res.isConfirmed) {
            const data = await safeFetchJson('/api/admin/system/clean-spam', {
              method: 'POST',
              headers: { 'Authorization': 'Bearer ' + adminToken }
            });
            if (data.success) {
              Swal.fire({ icon: 'success', title: 'Hoàn tất', text: data.message });
              fetchMetrics();
            } else {
              Swal.fire({ icon: 'error', title: 'Lỗi', text: data.error });
            }
          }
        });
      };

      // ==============================================================
      // COMMAND PALETTE (CTRL+K)
      // ==============================================================
      let cmdItems = [
        { title: 'Tổng Quan Hệ Thống', icon: 'fa-chart-pie', action: () => switchTab('tong-quan') },
        { title: 'Quản Lý Thành Viên', icon: 'fa-users', action: () => switchTab('thanh-vien') },
        { title: 'Hàng Đợi Duyệt Tích & OA', icon: 'fa-id-badge', action: () => switchTab('xet-duyet') },
        { title: 'Quản Lý Nhóm Trò Chuyện', icon: 'fa-comments', action: () => switchTab('nhom-tro-chuyen') },
        { title: 'Tên Người Dùng Cấm & Bảo Lưu', icon: 'fa-ban', action: () => switchTab('ten-cam') },
        { title: 'Kiểm Duyệt Bài Viết Feed', icon: 'fa-newspaper', action: () => switchTab('bai-viet') },
        { title: 'Kiểm Duyệt Bình Luận', icon: 'fa-comment-dots', action: () => switchTab('binh-luan') },
        { title: 'Xử Lý Báo Cáo Vi Phạm', icon: 'fa-flag', action: () => switchTab('bao-cao') },
        { title: 'Phát Thông Báo Đẩy FCM', icon: 'fa-paper-plane', action: () => switchTab('phat-thong-bao') },
        { title: 'Bảo Mật & Nhật Ký Audit', icon: 'fa-shield-halved', action: () => switchTab('bao-mat-audit') },
        { title: 'Đổi Giao Diện Sáng / Tối', icon: 'fa-circle-half-stroke', action: () => toggleTheme() },
        { title: 'Dọn Dẹp Rác Spam Bot', icon: 'fa-broom', action: () => cleanSpamReactions() },
        { title: 'Làm Mới Toàn Bộ Dữ Liệu', icon: 'fa-sync-alt', action: () => refreshCurrentTab() },
        { title: 'Đăng Xuất Phiên Quản Trị', icon: 'fa-arrow-right-from-bracket', action: () => doLogout() }
      ];

      function setupCommandPaletteData() {
        const input = document.getElementById('cmd-palette-input');
        if (input) {
          input.addEventListener('input', () => {
            const q = input.value.trim().toLowerCase();
            renderCommandPaletteResults(q);
          });
          input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeCommandPalette();
          });
        }
      }

      function renderCommandPaletteResults(query = '') {
        const list = document.getElementById('cmd-results-list');
        if (!list) return;

        const filtered = cmdItems.filter(item => 
          !query || item.title.toLowerCase().includes(query)
        );

        if (filtered.length === 0) {
          list.innerHTML = '<div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 13px;">Không tìm thấy tác vụ phù hợp.</div>';
          return;
        }

        let html = '';
        filtered.forEach((item, idx) => {
          html += \`
            <div class="cmd-item \${idx === 0 ? 'selected' : ''}" onclick="executeCmdItem(\${idx})">
              <div class="cmd-item-left">
                <i class="fas \${item.icon}"></i>
                <span>\${escapeHtml(item.title)}</span>
              </div>
              <i class="fas fa-arrow-turn-down" style="font-size: 11px; opacity: 0.4;"></i>
            </div>
          \`;
        });

        list.innerHTML = html;
      }

      window.executeCmdItem = function(idx) {
        const input = document.getElementById('cmd-palette-input');
        const q = input ? input.value.trim().toLowerCase() : '';
        const filtered = cmdItems.filter(item => !q || item.title.toLowerCase().includes(q));
        if (filtered[idx]) {
          closeCommandPalette();
          filtered[idx].action();
        }
      };

      window.openCommandPalette = function() {
        const p = document.getElementById('cmd-palette');
        const input = document.getElementById('cmd-palette-input');
        if (p) p.classList.add('show');
        if (input) {
          input.value = '';
          input.focus();
        }
        renderCommandPaletteResults('');
      };

      window.closeCommandPalette = function() {
        const p = document.getElementById('cmd-palette');
        if (p) p.classList.remove('show');
      };

      function initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            const p = document.getElementById('cmd-palette');
            if (p && p.classList.contains('show')) {
              closeCommandPalette();
            } else {
              openCommandPalette();
            }
          } else if (e.key === 'Escape') {
            closeCommandPalette();
          }
        });
      }

    })();
  </script>
</body>
</html>`;
}
