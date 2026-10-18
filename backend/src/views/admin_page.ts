export function renderAdminPage(): string {
  return `<!DOCTYPE html>
<html lang="vi" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dorabox Admin Console — Control Center</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-base: #080B11;
      --bg-sidebar: #0C101A;
      --bg-card: #121826;
      --bg-card-subtle: #161F32;
      --bg-card-hover: #192338;
      --bg-input: #0E1422;
      
      --border-subtle: rgba(255, 255, 255, 0.07);
      --border-focus: rgba(37, 99, 235, 0.6);
      --border-hover: rgba(255, 255, 255, 0.14);
      
      --brand-primary: #2563EB;
      --brand-primary-hover: #1D4ED8;
      --brand-glow: rgba(37, 99, 235, 0.25);
      
      --color-gold: #F59E0B;
      --color-gold-hover: #D97706;
      --color-gold-bg: rgba(245, 158, 11, 0.12);
      --color-gold-border: rgba(245, 158, 11, 0.3);
      
      --color-blue: #38BDF8;
      --color-blue-bg: rgba(56, 189, 248, 0.12);
      --color-blue-border: rgba(56, 189, 248, 0.3);
      
      --color-emerald: #10B981;
      --color-emerald-bg: rgba(16, 185, 129, 0.12);
      --color-emerald-border: rgba(16, 185, 129, 0.28);
      
      --color-rose: #F43F5E;
      --color-rose-bg: rgba(244, 63, 94, 0.12);
      --color-rose-border: rgba(244, 63, 94, 0.28);
      
      --color-violet: #A855F7;
      --color-violet-bg: rgba(168, 85, 247, 0.12);
      
      --text-main: #F8FAFC;
      --text-muted: #94A3B8;
      --text-dim: #64748B;
      
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 16px;
      --radius-xl: 22px;
      
      --shadow-soft: 0 4px 20px -2px rgba(0, 0, 0, 0.4);
      --shadow-elevated: 0 16px 40px -6px rgba(0, 0, 0, 0.7);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; }
    
    body {
      background-color: var(--bg-base);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      overflow-x: hidden;
      background-image: 
        radial-gradient(ellipse 60% 40% at 20% -10%, rgba(37, 99, 235, 0.12), transparent 50%),
        radial-gradient(ellipse 40% 30% at 80% 100%, rgba(245, 158, 11, 0.05), transparent 50%);
      -webkit-font-smoothing: antialiased;
    }

    /* Scrollbars */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.12); border-radius: 999px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.22); }

    /* Icons */
    .icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      stroke-width: 2;
      stroke: currentColor;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
      flex-shrink: 0;
    }
    .icon-sm { width: 14px; height: 14px; }
    .icon-lg { width: 22px; height: 22px; }

    /* AUTH OVERLAY (LOGIN GATE) */
    #auth-overlay {
      position: fixed;
      inset: 0;
      background: rgba(4, 6, 12, 0.88);
      backdrop-filter: blur(20px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 24px;
      transition: opacity 0.25s ease, visibility 0.25s;
    }
    .auth-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xl);
      padding: 44px 38px;
      max-width: 420px;
      width: 100%;
      box-shadow: var(--shadow-elevated), 0 0 0 1px rgba(255, 255, 255, 0.04);
      position: relative;
    }
    .auth-card::before {
      content: '';
      position: absolute;
      top: 0; left: 15%; right: 15%; height: 1px;
      background: linear-gradient(90deg, transparent, var(--brand-primary), transparent);
    }
    .auth-icon-wrap {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-md);
      background: rgba(37, 99, 235, 0.12);
      border: 1px solid rgba(37, 99, 235, 0.3);
      color: var(--brand-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 22px;
    }
    .auth-card h2 {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.4px;
      color: var(--text-main);
      margin-bottom: 6px;
    }
    .auth-card p {
      font-size: 13.5px;
      color: var(--text-muted);
      line-height: 1.5;
      margin-bottom: 28px;
    }
    .auth-input-group {
      margin-bottom: 20px;
      text-align: left;
    }
    .auth-label {
      display: block;
      font-size: 11.5px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: var(--text-muted);
      margin-bottom: 8px;
    }
    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .input-prefix-icon {
      position: absolute;
      left: 14px;
      color: var(--text-dim);
      pointer-events: none;
    }
    .auth-input {
      width: 100%;
      padding: 13px 14px 13px 42px;
      background: var(--bg-input);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      color: var(--text-main);
      font-size: 14px;
      outline: none;
      transition: all 0.2s ease;
      font-family: 'JetBrains Mono', monospace;
    }
    .auth-input:focus {
      border-color: var(--brand-primary);
      box-shadow: 0 0 0 3px var(--brand-glow);
    }

    /* SIDEBAR */
    aside {
      width: 270px;
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border-subtle);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .sidebar-brand {
      padding: 24px 22px;
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-logo {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: linear-gradient(135deg, #2563EB, #1D4ED8);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 800;
      font-size: 17px;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
      flex-shrink: 0;
    }
    .brand-meta h3 {
      font-size: 15px;
      font-weight: 700;
      letter-spacing: -0.3px;
      color: var(--text-main);
    }
    .brand-badge {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(37, 99, 235, 0.15);
      color: #60A5FA;
      display: inline-block;
      margin-top: 2px;
    }

    .nav-section-title {
      font-size: 10.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--text-dim);
      padding: 20px 22px 8px;
    }
    .nav-list {
      list-style: none;
      padding: 0 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
    }
    .nav-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      border-radius: var(--radius-md);
      font-size: 13.5px;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.18s ease;
      user-select: none;
    }
    .nav-item:hover {
      color: var(--text-main);
      background: rgba(255, 255, 255, 0.04);
    }
    .nav-item.active {
      color: #FFFFFF;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }
    .nav-item-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .nav-item.active .icon {
      color: var(--brand-primary);
    }
    .nav-count-badge {
      font-size: 11px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 999px;
      background: var(--color-rose-bg);
      color: var(--color-rose);
      border: 1px solid var(--color-rose-border);
      min-width: 20px;
      text-align: center;
    }

    .sidebar-footer {
      padding: 18px 20px;
      border-top: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(0, 0, 0, 0.15);
    }
    .pulse-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-emerald);
      position: relative;
    }
    .pulse-dot::after {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      background: var(--color-emerald);
      opacity: 0.4;
      animation: pulseAnimation 2s infinite;
    }
    @keyframes pulseAnimation {
      0% { transform: scale(0.9); opacity: 0.6; }
      50% { transform: scale(1.6); opacity: 0; }
      100% { transform: scale(0.9); opacity: 0; }
    }

    /* MAIN CONTENT */
    main {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .topbar {
      height: 68px;
      border-bottom: 1px solid var(--border-subtle);
      padding: 0 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(12, 16, 26, 0.7);
      backdrop-filter: blur(16px);
      position: sticky;
      top: 0;
      z-index: 90;
    }
    .breadcrumb-area h1 {
      font-size: 17px;
      font-weight: 700;
      color: var(--text-main);
      letter-spacing: -0.3px;
    }
    .breadcrumb-area p {
      font-size: 12px;
      color: var(--text-dim);
      margin-top: 1px;
    }
    .topbar-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    /* BUTTONS */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: var(--radius-md);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.16s ease;
      border: 1px solid transparent;
      text-decoration: none;
      white-space: nowrap;
      user-select: none;
    }
    .btn-primary {
      background: var(--brand-primary);
      color: #FFFFFF;
      box-shadow: 0 2px 10px rgba(37, 99, 235, 0.35);
    }
    .btn-primary:hover {
      background: var(--brand-primary-hover);
      transform: translateY(-1px);
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-main);
      border-color: var(--border-subtle);
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: var(--border-hover);
    }
    .btn-danger {
      background: var(--color-rose-bg);
      color: var(--color-rose);
      border-color: var(--color-rose-border);
    }
    .btn-danger:hover {
      background: var(--color-rose);
      color: #FFFFFF;
    }
    .btn-gold {
      background: var(--color-gold-bg);
      color: var(--color-gold);
      border-color: var(--color-gold-border);
    }
    .btn-gold:hover {
      background: var(--color-gold);
      color: #000000;
    }
    .btn-blue {
      background: var(--color-blue-bg);
      color: var(--color-blue);
      border-color: var(--color-blue-border);
    }
    .btn-blue:hover {
      background: var(--color-blue);
      color: #000000;
    }
    .btn-sm {
      padding: 5px 10px;
      font-size: 12px;
      border-radius: var(--radius-sm);
    }
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
    }

    /* CONTENT LAYOUT */
    .content-container {
      padding: 30px 32px;
      flex: 1;
      max-width: 1440px;
      width: 100%;
      margin: 0 auto;
    }
    .tab-section {
      display: none;
      animation: tabFadeIn 0.2s ease-out forwards;
    }
    .tab-section.active {
      display: block;
    }
    @keyframes tabFadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* KPI STATS GRID */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .kpi-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 20px;
      display: flex;
      flex-direction: column;
      position: relative;
      transition: all 0.2s ease;
      box-shadow: var(--shadow-soft);
    }
    .kpi-card:hover {
      border-color: var(--border-hover);
      transform: translateY(-2px);
    }
    .kpi-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
    }
    .kpi-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      letter-spacing: 0.3px;
    }
    .kpi-icon-box {
      width: 34px;
      height: 34px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .kpi-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 30px;
      font-weight: 700;
      color: var(--text-main);
      letter-spacing: -1px;
      line-height: 1;
      margin-bottom: 8px;
    }
    .kpi-desc {
      font-size: 11.5px;
      color: var(--text-dim);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* PANELS */
    .card-panel {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: var(--shadow-soft);
    }
    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      gap: 16px;
      flex-wrap: wrap;
    }
    .panel-heading {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .panel-heading h3 {
      font-size: 15.5px;
      font-weight: 700;
      color: var(--text-main);
      letter-spacing: -0.2px;
    }
    .panel-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    /* FILTER PILLS */
    .filter-group {
      display: flex;
      align-items: center;
      background: var(--bg-input);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 3px;
    }
    .filter-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 12px;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.16s ease;
    }
    .filter-btn:hover {
      color: var(--text-main);
    }
    .filter-btn.active {
      background: var(--bg-card-hover);
      color: #FFFFFF;
      box-shadow: 0 1px 4px rgba(0,0,0,0.3);
    }

    /* SEARCH INPUT */
    .search-box {
      position: relative;
      display: flex;
      align-items: center;
      min-width: 260px;
    }
    .search-icon {
      position: absolute;
      left: 12px;
      color: var(--text-dim);
      pointer-events: none;
    }
    .search-field {
      width: 100%;
      background: var(--bg-input);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 8px 12px 8px 36px;
      font-size: 13px;
      color: var(--text-main);
      outline: none;
      transition: all 0.16s ease;
    }
    .search-field:focus {
      border-color: var(--brand-primary);
      box-shadow: 0 0 0 2px var(--brand-glow);
    }

    /* NOTICE BANNER */
    .notice-banner {
      background: rgba(37, 99, 235, 0.06);
      border: 1px solid rgba(37, 99, 235, 0.18);
      border-radius: var(--radius-md);
      padding: 12px 16px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 20px;
    }
    .notice-icon {
      color: #60A5FA;
      margin-top: 1px;
    }
    .notice-text h4 {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-main);
      margin-bottom: 2px;
    }
    .notice-text p {
      font-size: 12px;
      color: var(--text-muted);
      line-height: 1.45;
    }

    /* DATA TABLES */
    .table-wrapper {
      overflow-x: auto;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      background: var(--bg-input);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    thead th {
      padding: 12px 16px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: var(--text-dim);
      background: rgba(255, 255, 255, 0.02);
      border-bottom: 1px solid var(--border-subtle);
      white-space: nowrap;
    }
    tbody td {
      padding: 14px 16px;
      font-size: 13.5px;
      color: var(--text-muted);
      border-bottom: 1px solid var(--border-subtle);
      vertical-align: middle;
    }
    tbody tr:last-child td {
      border-bottom: none;
    }
    tbody tr:hover td {
      background: rgba(255, 255, 255, 0.02);
      color: var(--text-main);
    }

    /* BADGES */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 8px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.3px;
      white-space: nowrap;
    }
    .badge-verified {
      background: var(--color-blue-bg);
      color: var(--color-blue);
      border: 1px solid var(--color-blue-border);
    }
    .badge-oa {
      background: var(--color-gold-bg);
      color: var(--color-gold);
      border: 1px solid var(--color-gold-border);
    }
    .badge-banned {
      background: var(--color-rose-bg);
      color: var(--color-rose);
      border: 1px solid var(--color-rose-border);
    }
    .badge-admin {
      background: var(--color-violet-bg);
      color: var(--color-violet);
      border: 1px solid rgba(168, 85, 247, 0.28);
    }
    .badge-neutral {
      background: rgba(255, 255, 255, 0.06);
      color: var(--text-dim);
      border: 1px solid var(--border-subtle);
    }

    /* USER TABLE CELL */
    .user-profile-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .user-avatar-img {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-sm);
      object-fit: cover;
      background: var(--bg-card-hover);
      border: 1px solid var(--border-subtle);
    }
    .user-avatar-fallback {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-sm);
      background: linear-gradient(135deg, #1E3A8A, #2563EB);
      color: #FFFFFF;
      font-weight: 700;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .user-name-title {
      font-size: 13.5px;
      font-weight: 600;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .user-uid-sub {
      font-size: 11px;
      font-family: 'JetBrains Mono', monospace;
      color: var(--text-dim);
      margin-top: 1px;
    }

    /* POST THUMBNAIL */
    .post-thumb {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-sm);
      object-fit: cover;
      border: 1px solid var(--border-subtle);
      cursor: pointer;
      transition: transform 0.16s ease;
    }
    .post-thumb:hover {
      transform: scale(1.06);
      border-color: var(--brand-primary);
    }

    /* BROADCAST STUDIO */
    .broadcast-container {
      display: grid;
      grid-template-columns: 1.25fr 0.75fr;
      gap: 24px;
    }
    @media (max-width: 1024px) {
      .broadcast-container { grid-template-columns: 1fr; }
    }
    .form-row {
      margin-bottom: 20px;
    }
    .form-row label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-muted);
      margin-bottom: 8px;
    }
    .form-input {
      width: 100%;
      background: var(--bg-input);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 12px 14px;
      font-size: 14px;
      color: var(--text-main);
      outline: none;
      transition: all 0.16s ease;
    }
    .form-input:focus {
      border-color: var(--brand-primary);
      box-shadow: 0 0 0 2px var(--brand-glow);
    }
    textarea.form-input {
      resize: vertical;
      min-height: 110px;
      line-height: 1.5;
    }

    /* DEVICE PREVIEW */
    .phone-preview-card {
      background: #090C14;
      border: 1px solid var(--border-subtle);
      border-radius: 28px;
      padding: 24px 20px;
      box-shadow: var(--shadow-elevated);
      max-width: 360px;
      margin: 0 auto;
      width: 100%;
    }
    .phone-speaker-bar {
      width: 60px;
      height: 4px;
      background: rgba(255, 255, 255, 0.12);
      border-radius: 999px;
      margin: 0 auto 20px;
    }
    .phone-preview-title {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-dim);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      text-align: center;
      margin-bottom: 18px;
    }
    .ios-notification {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 18px;
      padding: 14px 16px;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.5);
    }
    .ios-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
    }
    .ios-brand {
      display: flex;
      align-items: center;
      gap: 7px;
    }
    .ios-app-icon {
      width: 18px;
      height: 18px;
      border-radius: 4px;
      background: #2563EB;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 800;
      color: #fff;
    }
    .ios-app-name {
      font-size: 11.5px;
      font-weight: 700;
      color: var(--text-main);
      letter-spacing: 0.2px;
    }
    .ios-time {
      font-size: 10.5px;
      color: var(--text-dim);
    }
    .ios-content-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--text-main);
      margin-bottom: 3px;
      word-break: break-word;
    }
    .ios-content-body {
      font-size: 12px;
      color: var(--text-muted);
      line-height: 1.4;
      word-break: break-word;
    }

    /* SYSTEM DIAGNOSTICS GRID */
    .system-health-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
    }
    .service-card {
      background: var(--bg-card-subtle);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .service-card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .service-name {
      font-size: 13px;
      font-weight: 700;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* TOAST STACK */
    #toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
    }
    .toast {
      padding: 12px 18px;
      border-radius: var(--radius-md);
      background: var(--bg-card);
      border: 1px solid var(--border-hover);
      color: var(--text-main);
      font-size: 13px;
      font-weight: 600;
      box-shadow: var(--shadow-elevated);
      display: flex;
      align-items: center;
      gap: 10px;
      pointer-events: auto;
      animation: toastSlideIn 0.25s ease;
    }
    @keyframes toastSlideIn {
      from { transform: translateX(30px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    /* LIGHTBOX MODAL */
    #lightbox-modal {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.88);
      backdrop-filter: blur(12px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 10001;
      padding: 24px;
      cursor: zoom-out;
    }
    #lightbox-img {
      max-width: 90vw;
      max-height: 90vh;
      border-radius: var(--radius-md);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    /* OA REQUESTS CARD & DIFF */
    .oa-request-card {
      background: var(--bg-card-subtle);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 20px;
      margin-bottom: 16px;
      transition: all 0.2s ease;
    }
    .oa-request-card:hover {
      border-color: var(--border-hover);
      box-shadow: var(--shadow-soft);
    }
    .oa-request-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 16px;
      padding-bottom: 14px;
      border-bottom: 1px solid var(--border-subtle);
      flex-wrap: wrap;
    }
    .oa-diff-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      font-size: 13px;
    }
    .oa-diff-table th {
      text-align: left;
      padding: 8px 12px;
      background: rgba(0, 0, 0, 0.25);
      color: var(--text-muted);
      font-weight: 600;
      border-bottom: 1px solid var(--border-subtle);
    }
    .oa-diff-table td {
      padding: 10px 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      vertical-align: top;
    }
    .oa-val-old {
      color: var(--text-dim);
      text-decoration: line-through;
      margin-right: 8px;
    }
    .oa-val-new {
      color: #34D399;
      font-weight: 600;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.28);
      padding: 2px 8px;
      border-radius: 4px;
      display: inline-block;
    }
    .oa-val-same {
      color: var(--text-muted);
    }
  </style>
</head>
<body>

  <!-- 1. AUTHENTICATION MODAL -->
  <div id="auth-overlay">
    <div class="auth-card">
      <div class="auth-icon-wrap">
        <svg class="icon icon-lg" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </div>
      <h2>Dorabox SuperAdmin</h2>
      <p>Cổng điều hành bảo mật cấp cao. Xác thực khóa quản trị viên để mở khóa bảng điều khiển trung tâm.</p>
      
      <div class="auth-input-group">
        <label class="auth-label">Khóa Quản Trị Hệ Thống (Master Key)</label>
        <div class="input-wrapper">
          <svg class="icon icon-sm input-prefix-icon" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <input type="password" id="admin-pass-input" class="auth-input" placeholder="••••••••••••••••" autofocus autocomplete="current-password" />
        </div>
      </div>
      
      <button class="btn btn-primary" id="btn-unlock-gate" style="width: 100%; padding: 12px; font-size: 14px;">
        <span>Xác Thực Phiên Quản Trị</span>
        <svg class="icon icon-sm" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </button>
    </div>
  </div>

  <!-- 2. LIGHTBOX PREVIEW -->
  <div id="lightbox-modal" onclick="closeLightbox()">
    <img id="lightbox-img" src="" alt="Zoom preview" />
  </div>

  <!-- 3. TOAST CONTAINER -->
  <div id="toast-container"></div>

  <!-- 4. SIDEBAR NAVIGATION -->
  <aside>
    <div class="sidebar-brand">
      <div class="brand-logo">D</div>
      <div class="brand-meta">
        <h3>Dorabox Admin</h3>
        <span class="brand-badge">Control Center</span>
      </div>
    </div>

    <div class="nav-section-title">Quản Trị Mạng Xã Hội</div>
    <ul class="nav-list">
      <li class="nav-item active" data-tab="tong-quan">
        <div class="nav-item-left">
          <svg class="icon" viewBox="0 0 24 24"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
          <span>Tổng Quan</span>
        </div>
      </li>
      <li class="nav-item" data-tab="thanh-vien">
        <div class="nav-item-left">
          <svg class="icon" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span>Thành Viên</span>
        </div>
      </li>
      <li class="nav-item" data-tab="bai-viet">
        <div class="nav-item-left">
          <svg class="icon" viewBox="0 0 24 24"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
          <span>Bảng Tin</span>
        </div>
      </li>
      <li class="nav-item" data-tab="binh-luan">
        <div class="nav-item-left">
          <svg class="icon" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span>Bình Luận</span>
        </div>
      </li>
      <li class="nav-item" data-tab="bao-cao">
        <div class="nav-item-left">
          <svg class="icon" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <span>Kiểm Duyệt & Báo Cáo</span>
        </div>
        <span class="nav-count-badge" id="sidebar-report-badge">0</span>
      </li>
      <li class="nav-item" data-tab="duyet-oa">
        <div class="nav-item-left">
          <svg class="icon" viewBox="0 0 24 24" style="color: var(--color-gold);"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span>Duyệt Thông Tin OA</span>
        </div>
        <span class="nav-count-badge" id="sidebar-oa-badge" style="background: rgba(245, 158, 11, 0.2); color: #F59E0B; border: 1px solid rgba(245,158,11,0.3);">0</span>
      </li>
      <li class="nav-item" data-tab="phat-thong-bao">
        <div class="nav-item-left">
          <svg class="icon" viewBox="0 0 24 24"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
          <span>Broadcast Thông Báo</span>
        </div>
      </li>
      <li class="nav-item" data-tab="bao-mat-audit">
        <div class="nav-item-left">
          <svg class="icon" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
          <span>Bảo Mật & Anti-Spam</span>
        </div>
        <span class="nav-count-badge" id="sidebar-security-badge" style="background: rgba(16, 185, 129, 0.2); color: #10B981; border: 1px solid rgba(16,185,129,0.3);">SHIELD</span>
      </li>
      <li class="nav-item" data-tab="he-thong">
        <div class="nav-item-left">
          <svg class="icon" viewBox="0 0 24 24"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>
          <span>Hạ Tầng Cloud</span>
        </div>
      </li>
    </ul>

    <div class="sidebar-footer">
      <div class="pulse-wrapper">
        <div class="pulse-dot"></div>
        <span>Cụm Máy Chủ Online</span>
      </div>
      <button class="btn btn-secondary btn-sm" id="btn-logout" title="Đăng xuất khỏi phiên">
        <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
      </button>
    </div>
  </aside>

  <!-- 5. MAIN VIEWPORT -->
  <main>
    <header class="topbar">
      <div class="breadcrumb-area">
        <h1 id="topbar-title">Tổng Quan Hệ Thống</h1>
        <p id="topbar-subtitle">Chỉ số vận hành thời gian thực & trung tâm điều phối cộng đồng</p>
      </div>

      <div class="topbar-right">
        <button class="btn btn-secondary" id="btn-refresh-data" title="Tải lại toàn bộ dữ liệu">
          <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
          <span>Làm Mới</span>
        </button>
        <button class="btn btn-primary" onclick="switchTab('phat-thong-bao')">
          <svg class="icon icon-sm" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          <span>Soạn Broadcast</span>
        </button>
      </div>
    </header>

    <div class="content-container">

      <!-- ================= 1. TAB: TỔNG QUAN ================= -->
      <section id="tab-tong-quan" class="tab-section active">
        <!-- KPI METRICS -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-title">Tổng Thành Viên</span>
              <div class="kpi-icon-box" style="background: rgba(37,99,235,0.12); color: var(--brand-primary);">
                <svg class="icon" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
            </div>
            <div class="kpi-value" id="kpi-users">-</div>
            <div class="kpi-desc"><span style="color: var(--color-emerald);">●</span> Người dùng đã đăng ký</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-title">Tài Khoản Tích Xanh</span>
              <div class="kpi-icon-box" style="background: var(--color-blue-bg); color: var(--color-blue);">
                <svg class="icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
            </div>
            <div class="kpi-value" id="kpi-verified">-</div>
            <div class="kpi-desc"><span style="color: var(--color-blue);">✓</span> Cá nhân uy tín xác minh</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-title">Tổ Chức / Official OA</span>
              <div class="kpi-icon-box" style="background: var(--color-gold-bg); color: var(--color-gold);">
                <svg class="icon" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
            </div>
            <div class="kpi-value" id="kpi-vip">-</div>
            <div class="kpi-desc"><span style="color: var(--color-gold);">★</span> Huy hiệu Tích Vàng OA</div>
          </div>

          <div class="kpi-card" style="cursor: pointer;" onclick="switchTab('duyet-oa')">
            <div class="kpi-top">
              <span class="kpi-title">Yêu Cầu Duyệt OA</span>
              <div class="kpi-icon-box" style="background: rgba(245, 158, 11, 0.15); color: var(--color-gold);">
                <svg class="icon" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
            </div>
            <div class="kpi-value" id="kpi-oa-pending" style="color: var(--color-gold);">-</div>
            <div class="kpi-desc"><span style="color: var(--color-gold);">●</span> Chờ quản trị viên duyệt</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-title">Tài Khoản Bị Đình Chỉ</span>
              <div class="kpi-icon-box" style="background: var(--color-rose-bg); color: var(--color-rose);">
                <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
              </div>
            </div>
            <div class="kpi-value" id="kpi-banned">-</div>
            <div class="kpi-desc"><span style="color: var(--color-rose);">●</span> Vi phạm quy chuẩn</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-title">Tổng Bài Đăng</span>
              <div class="kpi-icon-box" style="background: rgba(16,185,129,0.12); color: var(--color-emerald);">
                <svg class="icon" viewBox="0 0 24 24"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
            </div>
            <div class="kpi-value" id="kpi-posts">-</div>
            <div class="kpi-desc">Nội dung đã chia sẻ</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-title">Tổng Bình Luận</span>
              <div class="kpi-icon-box" style="background: rgba(168,85,247,0.12); color: var(--color-violet);">
                <svg class="icon" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
            </div>
            <div class="kpi-value" id="kpi-comments">-</div>
            <div class="kpi-desc">Thảo luận tương tác</div>
          </div>
        </div>

        <!-- INFRASTRUCTURE STRIP -->
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-heading">
              <svg class="icon" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              <h3>Trạng Thái Hạ Tầng & Kết Nối Đám Mây</h3>
            </div>
            <span class="badge badge-verified" id="overall-health-badge">Hoạt động bình thường</span>
          </div>

          <div class="system-health-grid">
            <div class="service-card">
              <div class="service-card-top">
                <span class="service-name">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
                  Supabase Postgres DB
                </span>
                <span class="badge badge-verified" id="sys-db-status">CONNECTED</span>
              </div>
              <p style="font-size: 12.5px; color: var(--text-dim);" id="sys-db-latency">Đang kiểm tra độ trễ...</p>
            </div>

            <div class="service-card">
              <div class="service-card-top">
                <span class="service-name">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>
                  Cloudflare R2 Media CDN
                </span>
                <span class="badge badge-oa">READY</span>
              </div>
              <p style="font-size: 12.5px; color: var(--text-dim);">Lưu trữ media doraboxcdn.zpiltk.io.vn</p>
            </div>

            <div class="service-card">
              <div class="service-card-top">
                <span class="service-name">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                  Firebase Push Notification
                </span>
                <span class="badge badge-verified">HTTP v1</span>
              </div>
              <p style="font-size: 12.5px; color: var(--text-dim);">Project ID: dorabox-4bbcb</p>
            </div>

            <div class="service-card">
              <div class="service-card-top">
                <span class="service-name">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/></svg>
                  Node.js API Cluster
                </span>
                <span class="badge badge-verified">PORT 4000</span>
              </div>
              <p style="font-size: 12.5px; color: var(--text-dim);" id="sys-uptime">Thời gian chạy: Đang tính...</p>
            </div>
          </div>
        </div>

        <!-- QUICK ACCESS ROW -->
        <div class="card-panel">
          <div class="panel-heading" style="margin-bottom: 16px;">
            <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
            <h3>Tác Vụ Quản Trị Nhanh</h3>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="btn btn-gold" onclick="switchTab('thanh-vien')">
              <svg class="icon icon-sm" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span>Phân Cấp Tích Vàng OA / Tích Xanh</span>
            </button>
            <button class="btn btn-gold" onclick="switchTab('duyet-oa')">
              <svg class="icon icon-sm" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span>Duyệt Đề Xuất Thông Tin OA</span>
            </button>
            <button class="btn btn-secondary" onclick="switchTab('thanh-vien')">
              <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              <span>Tra Cứu Thành Viên</span>
            </button>
            <button class="btn btn-danger" onclick="switchTab('bao-cao')">
              <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>Hàng Đợi Duyệt Hồ Sơ & Báo Cáo</span>
            </button>
            <button class="btn btn-primary" onclick="switchTab('phat-thong-bao')">
              <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="m3 11 18-5v12L3 14v-3z"/></svg>
              <span>Phát Thông Báo Toàn Mạng</span>
            </button>
          </div>
        </div>
      </section>

      <!-- ================= 2. TAB: THÀNH VIÊN ================= -->
      <section id="tab-thanh-vien" class="tab-section">
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-heading">
              <svg class="icon" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              <h3>Danh Sách Thành Viên & Phân Quyền</h3>
            </div>

            <div class="panel-actions">
              <div class="filter-group">
                <button class="filter-btn active" onclick="filterUsers('all', this)">Tất cả</button>
                <button class="filter-btn" onclick="filterUsers('oa', this)">Tích Vàng OA</button>
                <button class="filter-btn" onclick="filterUsers('verified', this)">Tích Xanh</button>
                <button class="filter-btn" onclick="filterUsers('banned', this)">Bị Khóa</button>
                <button class="filter-btn" onclick="filterUsers('admin', this)">Quản Trị / Mod</button>
              </div>

              <div class="search-box">
                <svg class="icon icon-sm search-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" id="user-search-input" class="search-field" placeholder="Tìm theo tên hoặc @username..." />
              </div>
            </div>
          </div>

          <div class="notice-banner">
            <svg class="icon notice-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <div class="notice-text">
              <h4>Chính sách cấp huy hiệu chính chủ & tài khoản doanh nghiệp:</h4>
              <p>Nút <strong>Tích Vàng OA</strong> cấp quyền Official Account cho tổ chức, cơ quan và doanh nghiệp. Nút <strong>Tích Xanh</strong> xác thực cá nhân uy tín. Trạng thái có hiệu lực ngay lập tức trên app mobile.</p>
            </div>
          </div>

          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Thành Viên</th>
                  <th>Username</th>
                  <th>Vai Trò</th>
                  <th>Trạng Thái</th>
                  <th>Ngày Gia Nhập</th>
                  <th style="text-align: right;">Hành Động</th>
                </tr>
              </thead>
              <tbody id="users-table-body">
                <tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--text-dim);">Đang tải danh sách thành viên...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ================= 3. TAB: BÀI VIẾT ================= -->
      <section id="tab-bai-viet" class="tab-section">
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-heading">
              <svg class="icon" viewBox="0 0 24 24"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
              <h3>Kiểm Duyệt Bảng Tin & Bài Viết</h3>
            </div>

            <div class="search-box">
              <svg class="icon icon-sm search-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" id="post-search-input" class="search-field" placeholder="Tìm kiếm nội dung bài viết..." />
            </div>
          </div>

          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Tác Giả</th>
                  <th>Nội Dung Bài Viết</th>
                  <th>Ảnh Đính Kèm</th>
                  <th>Tương Tác</th>
                  <th>Trạng Thái Ghim</th>
                  <th>Ngày Đăng</th>
                  <th style="text-align: right;">Hành Động</th>
                </tr>
              </thead>
              <tbody id="posts-table-body">
                <tr><td colspan="7" style="text-align: center; padding: 40px; color: var(--text-dim);">Đang tải danh sách bài viết...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ================= 4. TAB: BÌNH LUẬN ================= -->
      <section id="tab-binh-luan" class="tab-section">
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-heading">
              <svg class="icon" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <h3>Quản Lý Bình Luận Cộng Đồng</h3>
            </div>

            <div class="search-box">
              <svg class="icon icon-sm search-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" id="comment-search-input" class="search-field" placeholder="Tìm theo nội dung bình luận..." />
            </div>
          </div>

          <div class="table-wrapper">
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
                <tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--text-dim);">Đang tải danh sách bình luận...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ================= 5. TAB: BÁO CÁO VI PHẠM ================= -->
      <section id="tab-bao-cao" class="tab-section">
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-heading">
              <svg class="icon" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <h3>Hàng Đợi Xử Lý Hồ Sơ Cấp Tích & Báo Cáo Vi Phạm</h3>
            </div>
            <span class="badge badge-banned" id="reports-pending-count">0 Chờ xử lý</span>
          </div>

          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Người Báo Cáo</th>
                  <th>Loại Yêu Cầu</th>
                  <th>Lý Do Chi Tiết</th>
                  <th>Trạng Thái</th>
                  <th>Thời Gian</th>
                  <th style="text-align: right;">Xử Lý</th>
                </tr>
              </thead>
              <tbody id="reports-table-body">
                <tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--text-dim);">Chưa có báo cáo vi phạm nào trong hàng đợi.</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ================= 6. TAB: PHÁT THÔNG BÁO ================= -->
      <section id="tab-phat-thong-bao" class="tab-section">
        <div class="broadcast-container">
          <div class="card-panel">
            <div class="panel-heading" style="margin-bottom: 22px;">
              <svg class="icon" viewBox="0 0 24 24"><path d="m3 11 18-5v12L3 14v-3z"/></svg>
              <h3>Broadcast Studio — Phát Tin Nhắn Toàn Hệ Thống</h3>
            </div>

            <div class="form-row">
              <label>Tiêu Đề Thông Báo (Notification Title)</label>
              <input type="text" id="broadcast-title-input" class="form-input" placeholder="Ví dụ: Chào mừng tới Dorabox phiên bản mới..." value="🎉 Chào mừng tới Dorabox!" />
            </div>

            <div class="form-row">
              <label>Nội Dung Thông Báo (Message Body)</label>
              <textarea id="broadcast-body-input" class="form-input" placeholder="Nhập nội dung gửi tới toàn thể người dùng app...">Khám phá các tính năng mới: Ghi âm giọng nói 120s, gửi ảnh siêu tốc, thu hồi tin nhắn và nhiều trải nghiệm tuyệt vời!</textarea>
            </div>

            <button class="btn btn-primary" id="btn-send-broadcast" style="width: 100%; padding: 14px; font-size: 14px;">
              <svg class="icon icon-sm" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              <span>Phát Sóng Push Notification Tức Thì</span>
            </button>
          </div>

          <!-- REALTIME PHONE PREVIEW -->
          <div class="phone-preview-card">
            <div class="phone-speaker-bar"></div>
            <div class="phone-preview-title">Xem trước màn hình khóa điện thoại</div>

            <div class="ios-notification">
              <div class="ios-header">
                <div class="ios-brand">
                  <div class="ios-app-icon">D</div>
                  <span class="ios-app-name">DORABOX</span>
                </div>
                <span class="ios-time">Vừa xong</span>
              </div>
              <div class="ios-content-title" id="preview-notif-title">🎉 Chào mừng tới Dorabox!</div>
              <div class="ios-content-body" id="preview-notif-body">Khám phá các tính năng mới: Ghi âm giọng nói 120s, gửi ảnh siêu tốc, thu hồi tin nhắn và nhiều trải nghiệm tuyệt vời!</div>
            </div>
          </div>
        </div>
      </section>

      <!-- ================= 7. TAB: HỆ THỐNG & CLOUD ================= -->
      <section id="tab-he-thong" class="tab-section">
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-heading">
              <svg class="icon" viewBox="0 0 24 24"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/></svg>
              <h3>Kiểm Định & Giám Sát Hạ Tầng Đám Mây</h3>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="fetchSystemHealth(true)">
              <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
              <span>Kiểm Tra Toàn Diện Ngay</span>
            </button>
          </div>

          <div class="system-health-grid" id="full-system-grid">
            <div class="service-card">
              <div class="service-card-top">
                <span class="service-name">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
                  Supabase Postgres & Auth
                </span>
                <span class="badge badge-verified" id="diag-db-badge">CONNECTED</span>
              </div>
              <p style="font-size: 12.5px; color: var(--text-dim);" id="diag-db-url">Endpoint: vcmsmyaupsksbjusnzoy.supabase.co</p>
              <p style="font-size: 12.5px; color: var(--color-emerald);" id="diag-db-lat">Độ trễ: Đang kiểm tra...</p>
            </div>

            <div class="service-card">
              <div class="service-card-top">
                <span class="service-name">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>
                  Cloudflare R2 Storage
                </span>
                <span class="badge badge-oa">READY</span>
              </div>
              <p style="font-size: 12.5px; color: var(--text-dim);">Bucket: dung-sketch-team-dorabox</p>
              <p style="font-size: 12.5px; color: var(--text-dim);">CDN Domain: doraboxcdn.zpiltk.io.vn</p>
            </div>

            <div class="service-card">
              <div class="service-card-top">
                <span class="service-name">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/></svg>
                  Firebase Cloud Messaging
                </span>
                <span class="badge badge-verified">HTTP v1</span>
              </div>
              <p style="font-size: 12.5px; color: var(--text-dim);">Google Service Account: dorabox-4bbcb</p>
              <p style="font-size: 12.5px; color: var(--color-emerald);">Kênh Push Notification hoạt động</p>
            </div>

            <div class="service-card">
              <div class="service-card-top">
                <span class="service-name">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/></svg>
                  Bộ Nhớ & Runtime API
                </span>
                <span class="badge badge-verified" id="diag-node-badge">NODE.JS</span>
              </div>
              <p style="font-size: 12.5px; color: var(--text-dim);" id="diag-memory">Bộ nhớ RAM: Đang tính...</p>
              <p style="font-size: 12.5px; color: var(--text-dim);" id="diag-uptime-val">Thời gian chạy: Đang tính...</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ================= 8. TAB: BẢO MẬT & AUDIT LOGS ================= -->
      <section id="tab-bao-mat-audit" class="tab-section">
        <!-- CARD 1: CƠ CHẾ CHỐNG SPAM PHẢN ỨNG -->
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-heading">
              <svg class="icon" viewBox="0 0 24 24" style="color: var(--color-emerald);"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
              <h3>Cơ Chế Chống Spam Phản Ứng (Reaction Anti-Spam Guard)</h3>
            </div>
            <button class="btn btn-primary" id="btn-clean-spam-reactions" onclick="cleanSpamReactions()">
              <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              <span>Quét & Dọn Phản Ứng Spam / Đồng Bộ Lượt Thích</span>
            </button>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-bottom: 16px;">
            <div class="service-card">
              <div class="service-card-top">
                <span class="service-name">
                  <svg class="icon icon-sm" style="color: var(--color-blue);" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
                  Debounce & Throttle
                </span>
                <span class="badge badge-verified">120Hz ULTRA</span>
              </div>
              <p style="font-size: 12.5px; color: var(--text-dim);">Chặn tap liên tục &lt; 250ms, Gom lệnh mạng 350ms phản hồi tức thì 120Hz mượt mà.</p>
            </div>

            <div class="service-card">
              <div class="service-card-top">
                <span class="service-name">
                  <svg class="icon icon-sm" style="color: var(--color-gold);" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/></svg>
                  Rate Limit Push FCM
                </span>
                <span class="badge badge-oa">2 PHÚT</span>
              </div>
              <p style="font-size: 12.5px; color: var(--text-dim);">Tối đa 1 thông báo đẩy/2 phút mỗi tác giả bài viết, chống spam rung chuông máy người dùng.</p>
            </div>

            <div class="service-card">
              <div class="service-card-top">
                <span class="service-name">
                  <svg class="icon icon-sm" style="color: var(--color-emerald);" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                  Atomic UPSERT RPC
                </span>
                <span class="badge badge-verified">POSTGRES</span>
              </div>
              <p style="font-size: 12.5px; color: var(--text-dim);">Xử lý nguyên tử toggle_post_reaction, khóa race-condition chống sai lệch số đếm.</p>
            </div>
          </div>
        </div>

        <!-- CARD 2: NHẬT KÝ BẢO MẬT AUDIT LOGS -->
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-heading">
              <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <h3>Nhật Ký Bảo Mật & Kiểm Toán Hệ Thống (Audit Logs)</h3>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="fetchSecurityLogs(true)">
              <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              <span>Làm Mới Nhật Ký</span>
            </button>
          </div>

          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th style="width: 170px;">Thời Gian</th>
                  <th>Loại Sự Kiện</th>
                  <th>Mức Độ</th>
                  <th>Tác Nhân</th>
                  <th>Chi Tiết Hoạt Động</th>
                </tr>
              </thead>
              <tbody id="audit-logs-table-body">
                <tr><td colspan="5" style="text-align: center; padding: 30px; color: var(--text-dim);">Đang tải nhật ký bảo mật...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ================= TAB: DUYỆT THÔNG TIN OA ================= -->
      <section id="tab-duyet-oa" class="tab-section">
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-heading">
              <svg class="icon" viewBox="0 0 24 24" style="color: var(--color-gold);"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <h3>Hàng Đợi Xét Duyệt Thông Tin Official Account</h3>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="fetchOaRequests(true)">
              <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              <span>Làm Mới Yêu Cầu</span>
            </button>
          </div>

          <div class="notice-banner">
            <svg class="icon notice-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <div class="notice-text">
              <h4>Quy trình kiểm duyệt thông tin Official Account:</h4>
              <p>Mỗi tài khoản OA được phép tự do chỉnh sửa <strong>1 lần duy nhất đầu tiên</strong>. Từ lần thứ 2 trở đi, mọi thay đổi (Tên OA, Lĩnh vực, Mã định danh, Bio và Trạng thái) đều phải gửi yêu cầu vào hàng đợi này. Khi Quản trị viên duyệt, thông tin mới sẽ được cập nhật công khai ngay lập tức lên ứng dụng di động.</p>
            </div>
          </div>

          <div id="oa-requests-container">
            <div style="text-align: center; padding: 40px; color: var(--text-dim);">Đang tải danh sách yêu cầu xét duyệt OA...</div>
          </div>
        </div>
      </section>

    </div>
  </main>

  <!-- JAVASCRIPT LOGIC & API INTEGRATIONS -->
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
      fetchOaRequests();
      fetchPosts();
      fetchComments();
      fetchReports();
      fetchSystemHealth();
      fetchSecurityLogs();
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
          document.getElementById('kpi-users').textContent = Number(m.totalUsers || 0).toLocaleString();
          document.getElementById('kpi-verified').textContent = Number(m.verifiedUsers || 0).toLocaleString();
          document.getElementById('kpi-banned').textContent = Number(m.bannedUsers || 0).toLocaleString();
          document.getElementById('kpi-posts').textContent = Number(m.totalPosts || 0).toLocaleString();
          document.getElementById('kpi-comments').textContent = Number(m.totalComments || 0).toLocaleString();
          document.getElementById('sidebar-report-badge').textContent = m.pendingReports;
          document.getElementById('reports-pending-count').textContent = m.pendingReports + ' Chờ xử lý';

          // Cập nhật số lượng đề xuất duyệt thông tin OA
          const pendingOa = Number(m.pendingOaRequests || 0);
          const kpiOa = document.getElementById('kpi-oa-pending');
          if (kpiOa) kpiOa.textContent = pendingOa.toLocaleString();
          const oaBadge = document.getElementById('sidebar-oa-badge');
          if (oaBadge) {
            oaBadge.textContent = pendingOa;
            oaBadge.style.display = pendingOa > 0 ? 'inline-block' : 'none';
          }
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

          // Update VIP / OA count
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
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 40px; color: var(--text-dim);">Không tìm thấy thành viên nào.</td></tr>';
        return;
      }

      tbody.innerHTML = users.map(u => {
        const initial = (u.display_name || u.username || 'U').charAt(0).toUpperCase();
        const avatarHtml = u.avatar_url 
          ? \`<img class="user-avatar-img" src="\${u.avatar_url}" alt="\${u.username}" onerror="this.outerHTML='<div class=\\'user-avatar-fallback\\'>\${initial}</div>'" />\`
          : \`<div class="user-avatar-fallback">\${initial}</div>\`;

        const statusBadge = u.is_banned
          ? '<span class="badge badge-banned"><svg class="icon icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> ĐÃ KHÓA</span>'
          : '<span class="badge badge-verified"><svg class="icon icon-sm" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> HOẠT ĐỘNG</span>';

        const roleBadge = u.role === 'admin'
          ? '<span class="badge badge-admin"><svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> ADMIN</span>'
          : (u.role === 'moderator' ? '<span class="badge badge-oa">MOD</span>' : '<span class="badge badge-neutral">MEMBER</span>');

        const joinDate = u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : '-';
        const isOA = (u.is_oa || u.is_vip || u.account_type === 'oa');

        return \`
          <tr>
            <td>
              <div class="user-profile-cell">
                \${avatarHtml}
                <div>
                  <div class="user-name-title">
                    \${escapeHtml(u.display_name || u.username || 'Dorabox User')}
                    \${isOA ? '<span style="color: var(--color-gold);" title="Tài khoản Doanh Nghiệp OA"><svg class="icon icon-sm" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>' : ''}
                    \${u.is_verified ? '<span style="color: var(--color-blue);" title="Đã xác thực"><svg class="icon icon-sm" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span>' : ''}
                  </div>
                  <div class="user-uid-sub">
                    UID: \${u.id.substring(0, 8)}...
                    \${isOA ? \`<span style="color: var(--color-gold); margin-left: 6px;">[OA: \${escapeHtml(u.oa_category || 'Dịch vụ')} · Đã sửa: \${u.oa_info_edited_count || 0}/1]</span>\` : ''}
                  </div>
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
                <button class="btn btn-sm btn-secondary" title="Đổi vai trò phân quyền: User, Mod, Admin" onclick="promptChangeRole('\${u.id}', '\${escapeHtml(u.display_name || u.username || 'User')}', '\${u.role || 'user'}')">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span>Vai Trò</span>
                </button>
                <button class="btn btn-sm \${u.is_verified ? 'btn-secondary' : 'btn-blue'}" onclick="toggleVerify('\${u.id}', \${!u.is_verified})">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>\${u.is_verified ? 'Gỡ Xanh' : 'Cấp Tích Xanh'}</span>
                </button>
                <button class="btn btn-sm \${isOA ? 'btn-secondary' : 'btn-gold'}" onclick="toggleVip('\${u.id}', \${!isOA})">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <span>\${isOA ? 'Gỡ OA' : 'Cấp Tích Vàng OA'}</span>
                </button>
                \${isOA ? \`
                <button class="btn btn-sm btn-gold" title="Cấp lại 1 lượt chỉnh sửa trực tiếp không cần duyệt cho OA" onclick="resetOaEditCount('\${u.id}', '\${escapeHtml(u.display_name || u.username || 'OA')}')">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                  <span>Cấp Sửa (\${u.oa_info_edited_count || 0}/1)</span>
                </button>
                \` : ''}
                <button class="btn btn-sm \${u.is_banned ? 'btn-secondary' : 'btn-danger'}" onclick="toggleBan('\${u.id}', \${!u.is_banned})">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                  <span>\${u.is_banned ? 'Mở Khóa' : 'Khóa Nick'}</span>
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
          showToast(data.error || 'Thao tác thất bại', 'error');
        }
      } catch (err) {
        showToast('Lỗi: ' + err.message, 'error');
      }
    }

    // Toggle VIP / OA
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
          showToast(data.error || 'Thao tác thất bại', 'error');
        }
      } catch (err) {
        showToast('Lỗi: ' + err.message, 'error');
      }
    }

    // Toggle Ban
    async function toggleBan(userId, newStatus) {
      const confirmMsg = newStatus ? 'Xác nhận KHÓA tài khoản này khỏi hệ thống?' : 'Xác nhận mở khóa hoạt động cho tài khoản này?';
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
          showToast(data.error || 'Thao tác thất bại', 'error');
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
      document.querySelectorAll('.filter-group .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (type === 'all') {
        renderUsersTable(allUsersCache);
      } else if (type === 'verified') {
        renderUsersTable(allUsersCache.filter(u => u.is_verified));
      } else if (type === 'oa' || type === 'vip') {
        renderUsersTable(allUsersCache.filter(u => u.is_oa || u.is_vip || u.account_type === 'oa'));
      } else if (type === 'banned') {
        renderUsersTable(allUsersCache.filter(u => u.is_banned));
      } else if (type === 'admin') {
        renderUsersTable(allUsersCache.filter(u => u.role === 'admin' || u.role === 'moderator'));
      }
    }

    // Đổi vai trò tài khoản (Role Promotion/Demotion)
    async function promptChangeRole(userId, name, currentRole) {
      const newRole = prompt('Phân quyền vai trò cho [' + name + ']: Nhập user, moderator hoặc admin:', currentRole);
      if (!newRole) return;
      const clean = newRole.trim().toLowerCase();
      if (!['user', 'moderator', 'admin'].includes(clean)) {
        showToast('Vai trò không hợp lệ! Phải là user, moderator hoặc admin', 'error');
        return;
      }

      try {
        const res = await fetch(\`/api/admin/users/\${userId}/change-role\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
          body: JSON.stringify({ role: clean })
        });
        const data = await res.json();
        if (data.success) {
          showToast(data.message, 'success');
          fetchUsers();
          fetchSecurityLogs();
        } else {
          showToast(data.error || 'Phân quyền thất bại', 'error');
        }
      } catch (err) {
        showToast('Lỗi: ' + err.message, 'error');
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
          ? \`<img class="user-avatar-img" style="width:32px;height:32px;" src="\${author.avatar_url}" />\`
          : \`<div class="user-avatar-fallback" style="width:32px;height:32px;font-size:12px;">\${authorName.charAt(0).toUpperCase()}</div>\`;

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
                  <div style="font-weight: 600; font-size: 13.5px; color: var(--text-main);">\${escapeHtml(authorName)}</div>
                  <div style="font-size: 11px; color: var(--text-dim);">@\${escapeHtml(author.username || '')}</div>
                </div>
              </div>
            </td>
            <td style="max-width: 300px;">
              <div style="color: var(--text-main); font-size: 13.5px; line-height: 1.45; word-break: break-word;">
                \${escapeHtml(p.content || '')}
              </div>
            </td>
            <td>\${mediaHtml}</td>
            <td>
              <div style="display: flex; gap: 10px; font-size: 12.5px; color: var(--text-muted);">
                <span>❤️ \${p.likes_count || 0}</span>
                <span>💬 \${p.comments_count || 0}</span>
              </div>
            </td>
            <td>
              \${p.is_pinned ? '<span class="badge badge-oa"><svg class="icon icon-sm" viewBox="0 0 24 24"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/></svg> Đã ghim</span>' : '<span style="color: var(--text-dim); font-size: 12px;">-</span>'}
            </td>
            <td style="font-size: 12.5px;">\${dateStr}</td>
            <td style="text-align: right;">
              <div style="display: inline-flex; gap: 6px;">
                <button class="btn btn-sm btn-secondary" onclick="togglePinPost('\${p.id}', \${!p.is_pinned})">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/></svg>
                  <span>\${p.is_pinned ? 'Bỏ Ghim' : 'Ghim'}</span>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deletePost('\${p.id}')">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  <span>Xóa</span>
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
      if (!confirm('Xác nhận xóa vĩnh viễn bài viết này khỏi hệ thống?')) return;

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
              <div style="font-weight: 600; color: var(--text-main); font-size: 13.5px;">\${escapeHtml(userName)}</div>
              <div style="font-size: 11px; color: var(--text-dim);">@\${escapeHtml(user.username || '')}</div>
            </td>
            <td style="max-width: 340px;">
              <div style="color: var(--text-main); font-size: 13.5px; line-height: 1.45; word-break: break-word;">
                \${escapeHtml(c.content || '')}
              </div>
            </td>
            <td>
              <span class="badge badge-neutral" style="font-size: 11px;">\${escapeHtml(postSnippet)}</span>
            </td>
            <td style="font-size: 12.5px;">\${dateStr}</td>
            <td style="text-align: right;">
              <button class="btn btn-sm btn-danger" onclick="deleteComment('\${c.id}')">
                <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>
                <span>Xóa</span>
              </button>
            </td>
          </tr>
        \`;
      }).join('');
    }

    async function deleteComment(commentId) {
      if (!confirm('Xác nhận xóa bình luận vi phạm này?')) return;

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
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 40px; color: var(--text-dim);">Chưa có báo cáo vi phạm hoặc hồ sơ nào trong hàng đợi.</td></tr>';
        return;
      }

      tbody.innerHTML = reports.map(r => {
        const reporter = r.profiles || {};
        const reporterName = reporter.display_name || reporter.username || 'Thành viên';
        const dateStr = r.created_at ? new Date(r.created_at).toLocaleDateString('vi-VN') : '-';
        const isPending = r.status === 'pending';
        const isUserTarget = r.target_type === 'user';

        const statusBadge = isPending
          ? '<span class="badge badge-banned">CHỜ XỬ LÝ</span>'
          : (r.status === 'dismissed' ? '<span class="badge badge-neutral">ĐÃ BÁC BỎ</span>' : '<span class="badge badge-verified">ĐÃ XỬ LÝ</span>');

        const typeBadge = isUserTarget
          ? '<span class="badge badge-oa">HỒ SƠ CẤP TÍCH</span>'
          : \`<span class="badge badge-neutral">\${escapeHtml(r.target_type || 'Nội dung')}</span>\`;

        let actionButtonsHtml = '<span style="color: var(--text-dim); font-size: 12px;">Hoàn tất</span>';
        if (isPending) {
          if (isUserTarget) {
            actionButtonsHtml = \`
              <div style="display: inline-flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end;">
                <button class="btn btn-sm btn-gold" onclick="actionReport('\${r.id}', 'approve_oa')" title="Duyệt cấp Tích Vàng OA">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <span>Duyệt OA</span>
                </button>
                <button class="btn btn-sm btn-blue" onclick="actionReport('\${r.id}', 'approve_verified')" title="Duyệt cấp Tích Xanh">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Duyệt Tích Xanh</span>
                </button>
                <button class="btn btn-sm btn-secondary" onclick="actionReport('\${r.id}', 'dismiss')">
                  Bác Bỏ
                </button>
              </div>
            \`;
          } else {
            actionButtonsHtml = \`
              <div style="display: inline-flex; gap: 6px;">
                <button class="btn btn-sm btn-secondary" onclick="actionReport('\${r.id}', 'dismiss')">
                  Bác Bỏ
                </button>
                <button class="btn btn-sm btn-danger" onclick="actionReport('\${r.id}', 'delete_target')">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>
                  <span>Xóa Vi Phạm</span>
                </button>
              </div>
            \`;
          }
        }

        return \`
          <tr>
            <td>
              <div style="font-weight: 600; color: var(--text-main); font-size: 13.5px;">\${escapeHtml(reporterName)}</div>
              <div style="font-size: 11px; color: var(--text-dim); font-family: 'JetBrains Mono', monospace;">UID: \${r.reporter_id ? r.reporter_id.substring(0, 8) + '...' : '-'}</div>
            </td>
            <td>\${typeBadge}</td>
            <td style="max-width: 300px; color: var(--text-main);">
              <div style="font-weight: 500;">\${escapeHtml(r.reason || 'Yêu cầu kiểm duyệt')}</div>
              \${isUserTarget ? \`<div style="font-size: 11px; color: var(--color-gold); margin-top: 4px; font-family: 'JetBrains Mono', monospace;">Mục tiêu UID: \${r.target_id}</div>\` : ''}
            </td>
            <td>\${statusBadge}</td>
            <td style="font-size: 12.5px;">\${dateStr}</td>
            <td style="text-align: right;">
              \${actionButtonsHtml}
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
        } else {
          showToast(data.error || 'Thao tác thất bại', 'error');
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

        if (!confirm('Xác nhận phát sóng thông báo này tới TOÀN BỘ thành viên ứng dụng?')) return;

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
          btn.innerHTML = \`<svg class="icon icon-sm" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg><span>Phát Sóng Push Notification Tức Thì</span>\`;
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

          document.getElementById('diag-memory').textContent = \`Heap RAM: \${h.memory.heapUsedMb} MB / RSS: \${h.memory.rssMb} MB\`;
          document.getElementById('diag-node-badge').textContent = h.nodeVersion;

          if (showNotification) {
            showToast(\`Hạ tầng hoạt động hoàn hảo! DB: \${h.database.latencyMs}ms | Cloudflare R2 | Firebase v1\`, 'success');
          }
        }
      } catch (err) {
        console.error('Fetch system health error:', err);
      }
    }

    // 8. Fetch Security Audit Logs
    async function fetchSecurityLogs(showNotification = false) {
      try {
        const res = await fetch('/api/admin/security-logs', {
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });
        const data = await res.json();
        if (data.success && data.logs) {
          renderAuditLogsTable(data.logs);
          if (showNotification) {
            showToast('Đã làm mới nhật ký kiểm toán bảo mật!', 'success');
          }
        }
      } catch (err) {
        console.error('Fetch security logs error:', err);
      }
    }

    function renderAuditLogsTable(logs) {
      const tbody = document.getElementById('audit-logs-table-body');
      if (!tbody) return;

      if (!logs || logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 30px; color: var(--text-dim);">Chưa có sự kiện an ninh nào được ghi nhận.</td></tr>';
        return;
      }

      tbody.innerHTML = logs.map(l => {
        let badgeClass = 'badge-verified';
        let badgeText = 'INFO';
        if (l.severity === 'warning') {
          badgeClass = 'badge-oa';
          badgeText = 'WARNING';
        } else if (l.severity === 'alert') {
          badgeClass = 'badge-banned';
          badgeText = 'ALERT';
        }

        const dateStr = l.timestamp ? new Date(l.timestamp).toLocaleString('vi-VN') : '-';

        return \`
          <tr>
            <td style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-muted);">\${dateStr}</td>
            <td>
              <span style="font-weight: 700; font-size: 12.5px; color: var(--text-main);">\${escapeHtml(l.eventType || 'system')}</span>
            </td>
            <td><span class="badge \${badgeClass}">\${badgeText}</span></td>
            <td>
              <span style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-muted);">\${escapeHtml(l.actor || 'system')}</span>
            </td>
            <td style="font-size: 13px; color: var(--text-main); word-break: break-word;">\${escapeHtml(l.details || '')}</td>
          </tr>
        \`;
      }).join('');
    }

    // Quét & Dọn Dẹp Phản Ứng Spam
    async function cleanSpamReactions() {
      const btn = document.getElementById('btn-clean-spam-reactions');
      if (!confirm('Khởi chạy quét toàn bộ cơ sở dữ liệu để tìm kiếm và xử lý các phản ứng spam/trùng lặp?')) return;

      try {
        if (btn) {
          btn.disabled = true;
          btn.innerHTML = '<span class="spinner"></span> <span>Đang rà soát và tối ưu dữ liệu...</span>';
        }

        const res = await fetch('/api/admin/clean-spam-reactions', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });
        const data = await res.json();

        if (data.success) {
          showToast(data.message, 'success');
          fetchSecurityLogs();
          fetchMetrics();
        } else {
          showToast(data.error || 'Quá trình bảo trì thất bại', 'error');
        }
      } catch (err) {
        showToast('Lỗi: ' + err.message, 'error');
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg><span>Quét & Dọn Phản Ứng Spam / Đồng Bộ Lượt Thích</span>';
        }
      }
    }

    // 9. Fetch & Render OA Requests
    let allOaRequestsCache = [];
    async function fetchOaRequests(showNotification = false) {
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
          if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-block' : 'none';
          }
          const kpi = document.getElementById('kpi-oa-pending');
          if (kpi) kpi.textContent = count;
          if (showNotification) {
            showToast('Đã làm mới danh sách yêu cầu duyệt OA!', 'success');
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
          <div style="text-align: center; padding: 48px 20px; color: var(--text-dim);">
            <svg class="icon" style="width: 44px; height: 44px; margin-bottom: 12px; color: var(--color-emerald);" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <div style="font-size: 15px; font-weight: 700; color: var(--text-main); margin-bottom: 4px;">Tất cả thông tin OA đã được xử lý</div>
            <div style="font-size: 13px;">Hiện tại không có yêu cầu thay đổi thông tin Official Account nào đang chờ xét duyệt.</div>
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

        const initial = (curName).charAt(0).toUpperCase();
        const avatarHtml = r.avatar_url 
          ? \`<img class="user-avatar-img" src="\${r.avatar_url}" alt="\${curName}" onerror="this.outerHTML='<div class=\\'user-avatar-fallback\\'>\${initial}</div>'" />\`
          : \`<div class="user-avatar-fallback">\${initial}</div>\`;

        return \`
          <div class="oa-request-card">
            <div class="oa-request-header">
              <div class="user-profile-cell">
                \${avatarHtml}
                <div>
                  <div class="user-name-title" style="font-size: 15px;">
                    \${escapeHtml(curName)}
                    <span style="color: var(--color-gold);"><svg class="icon icon-sm" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>
                  </div>
                  <div class="user-uid-sub">@\${escapeHtml(curUser)} · Yêu cầu lúc: \${reqDate}</div>
                </div>
              </div>
              <div style="display: flex; gap: 8px;">
                <button class="btn btn-sm btn-primary" style="background: #059669; border-color: #10B981;" onclick="approveOaRequest('\${r.id}', '\${escapeHtml(curName)}')">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Phê Duyệt Ngay</span>
                </button>
                <button class="btn btn-sm btn-danger" onclick="rejectOaRequest('\${r.id}', '\${escapeHtml(curName)}')">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  <span>Từ Chối</span>
                </button>
              </div>
            </div>

            <table class="oa-diff-table">
              <thead>
                <tr>
                  <th style="width: 22%;">Trường Thông Tin</th>
                  <th style="width: 38%;">Hiện Tại (Đang Công Khai)</th>
                  <th style="width: 40%;">Đề Xuất Mới (Chờ Duyệt)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Tên Official Account</strong></td>
                  <td>\${escapeHtml(curName)}</td>
                  <td>\${nameChanged ? \`<span class="oa-val-new">\${escapeHtml(newName)}</span>\` : \`<span class="oa-val-same">\${escapeHtml(curName)}</span>\`}</td>
                </tr>
                <tr>
                  <td><strong>Mã định danh (@handle)</strong></td>
                  <td>@\${escapeHtml(curUser)}</td>
                  <td>\${userChanged ? \`<span class="oa-val-new">@\${escapeHtml(newUser)}</span>\` : \`<span class="oa-val-same">@\${escapeHtml(curUser)}</span>\`}</td>
                </tr>
                <tr>
                  <td><strong>Lĩnh vực hoạt động</strong></td>
                  <td>\${escapeHtml(curCat)}</td>
                  <td>\${catChanged ? \`<span class="oa-val-new">\${escapeHtml(newCat)}</span>\` : \`<span class="oa-val-same">\${escapeHtml(curCat)}</span>\`}</td>
                </tr>
                <tr>
                  <td><strong>Trạng thái hiển thị</strong></td>
                  <td>\${escapeHtml(curStatus)}</td>
                  <td>\${statusChanged ? \`<span class="oa-val-new">\${escapeHtml(newStatus)}</span>\` : \`<span class="oa-val-same">\${escapeHtml(curStatus)}</span>\`}</td>
                </tr>
                <tr>
                  <td><strong>Tiểu sử / Giới thiệu</strong></td>
                  <td style="line-height: 1.4;">\${escapeHtml(curBio)}</td>
                  <td style="line-height: 1.4;">\${bioChanged ? \`<span class="oa-val-new">\${escapeHtml(newBio)}</span>\` : \`<span class="oa-val-same">\${escapeHtml(curBio)}</span>\`}</td>
                </tr>
              </tbody>
            </table>
          </div>
        \`;
      }).join('');
    }

    async function approveOaRequest(userId, name) {
      if (!confirm(\`Xác nhận phê duyệt các thay đổi thông tin cho Official Account "\${name}"? Thông tin mới sẽ cập nhật trực tiếp lên ứng dụng.\`)) return;

      try {
        const res = await fetch(\`/api/admin/oa-requests/\${userId}/approve\`, {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });
        const data = await res.json();
        if (data.success) {
          showToast(data.message || 'Đã phê duyệt thông tin OA thành công!', 'success');
          fetchOaRequests();
          fetchUsers();
          fetchMetrics();
        } else {
          showToast(data.error || 'Phê duyệt thất bại', 'error');
        }
      } catch (err) {
        showToast('Lỗi mạng: ' + err.message, 'error');
      }
    }

    async function rejectOaRequest(userId, name) {
      const reason = prompt(\`Lý do từ chối yêu cầu thay đổi thông tin của OA "\${name}":\`, 'Nội dung thông tin không phù hợp với quy chuẩn nhận diện thương hiệu');
      if (reason === null) return;

      try {
        const res = await fetch(\`/api/admin/oa-requests/\${userId}/reject\`, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + adminToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ reason })
        });
        const data = await res.json();
        if (data.success) {
          showToast(data.message || 'Đã từ chối yêu cầu đổi thông tin OA.', 'info');
          fetchOaRequests();
          fetchMetrics();
        } else {
          showToast(data.error || 'Từ chối thất bại', 'error');
        }
      } catch (err) {
        showToast('Lỗi mạng: ' + err.message, 'error');
      }
    }

    async function resetOaEditCount(userId, name) {
      if (!confirm(\`Cấp lại lượt chỉnh sửa trực tiếp (1/1) cho tài khoản OA "\${name}"? Chủ tài khoản sẽ có thể tự sửa đổi thông tin 1 lần mà không cần chờ duyệt.\`)) return;

      try {
        const res = await fetch(\`/api/admin/users/\${userId}/reset-oa-edit\`, {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + adminToken }
        });
        const data = await res.json();
        if (data.success) {
          showToast(data.message || 'Đã cấp lại lượt chỉnh sửa cho OA!', 'success');
          fetchUsers();
          fetchOaRequests();
        } else {
          showToast(data.error || 'Không thể cấp lại lượt sửa', 'error');
        }
      } catch (err) {
        showToast('Lỗi: ' + err.message, 'error');
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
        'tong-quan': { title: 'Tổng Quan Hệ Thống', subtitle: 'Chỉ số vận hành thời gian thực & trung tâm điều phối cộng đồng' },
        'thanh-vien': { title: 'Quản Lý Thành Viên', subtitle: 'Phân quyền, cấp tích xanh, xét duyệt Official Account & khóa tài khoản' },
        'duyet-oa': { title: 'Xét Duyệt Thông Tin OA', subtitle: 'Phê duyệt các thay đổi Tên, Lĩnh vực, Mã định danh, Tiểu sử và Trạng thái Official Account' },
        'bai-viet': { title: 'Quản Lý Bảng Tin & Bài Viết', subtitle: 'Kiểm duyệt nội dung bảng tin, hình ảnh đính kèm, ghim bài nổi bật & xóa vi phạm' },
        'binh-luan': { title: 'Quản Lý Bình Luận', subtitle: 'Giám sát tương tác thảo luận cộng đồng & ngăn chặn spam' },
        'bao-cao': { title: 'Kiểm Duyệt & Báo Cáo', subtitle: 'Hàng đợi xét duyệt hồ sơ cấp tích và xử lý vi phạm tiêu chuẩn cộng đồng' },
        'phat-thong-bao': { title: 'Broadcast Studio', subtitle: 'Soạn thảo và phát Push Notification tới ứng dụng kèm xem trước trên mobile' },
        'bao-mat-audit': { title: 'Bảo Mật Hệ Thống & Nhật Ký Audit', subtitle: 'Giám sát khiên chống spam 120Hz, bảo trì dọn dẹp phản ứng rác & theo dõi an ninh' },
        'he-thong': { title: 'Hạ Tầng Cloud & Services', subtitle: 'Giám sát dịch vụ Supabase Postgres, Cloudflare R2 CDN và Firebase v1' }
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
      
      let iconSvg = '<svg class="icon icon-sm" style="color:var(--brand-primary);" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
      if (type === 'success') {
        iconSvg = '<svg class="icon icon-sm" style="color:var(--color-emerald);" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>';
      } else if (type === 'error') {
        iconSvg = '<svg class="icon icon-sm" style="color:var(--color-rose);" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
      }

      toast.innerHTML = \`\${iconSvg}<span>\${escapeHtml(message)}</span>\`;
      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = '0.2s';
        setTimeout(() => toast.remove(), 250);
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
