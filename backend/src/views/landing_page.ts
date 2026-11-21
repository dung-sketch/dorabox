/**
 * Dorabox Social - Official Landing & Showcase Portal
 * Thiết kế giao diện Glassmorphism đỉnh cao, responsive mượt mà trên Mobile & Desktop.
 * Tích hợp tải APK trực tiếp từ Cloudflare R2 CDN, QR Code và hướng dẫn cài đặt.
 */

export interface LandingPageConfig {
  latestVersion: string;
  buildNumber: number;
  apkUrl: string;
  changelog?: string[];
}

export function renderLandingPage(config: LandingPageConfig): string {
  const version = config.latestVersion || '3.0.0';
  const apkUrl = config.apkUrl || 'https://doraboxcdn.zpiltk.io.vn/apk/Dorabox-v3.0.0.apk';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(apkUrl)}&color=0284C7&bgcolor=0F172A`;

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Dorabox Social - Kết nối diệu kỳ, sẻ chia niềm vui! ✨</title>
  
  <meta name="description" content="Khám phá Dorabox - Mạng xã hội thế hệ mới với bản quyền độc lập cho ảnh & video, ghi chú D-Notes 24h bồng bềnh, bảng tin 120 FPS và không gian kết nối chân thực.">
  <meta property="og:site_name" content="Dorabox Social ✨">
  <meta property="og:title" content="Dorabox Social - Kết nối diệu kỳ, sẻ chia niềm vui!">
  <meta property="og:description" content="Tải ngay Dorabox v${version} APK. Trải nghiệm mạng xã hội hiện đại với D-Notes 24h, bảo vệ bản quyền ảnh/video và hệ sinh thái OA Doanh nghiệp.">
  <meta property="og:image" content="https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png">
  <meta property="og:type" content="website">

  <link rel="icon" href="https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700;800&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg-dark: #070B14;
      --card-bg: rgba(20, 27, 45, 0.7);
      --card-border: rgba(255, 255, 255, 0.08);
      --primary: #0284C7;
      --primary-light: #38BDF8;
      --accent: #F59E0B;
      --accent-light: #FBBF24;
      --text-main: #F8FAFC;
      --text-sub: #94A3B8;
    }

    * { margin:0; padding:0; box-sizing:border-box; font-family:'Quicksand', -apple-system, sans-serif; }
    body { background: var(--bg-dark); color: var(--text-main); line-height:1.6; overflow-x:hidden; }

    /* Animated Ambient Glow Background */
    .ambient-glow {
      position:fixed; top:0; left:50%; transform:translateX(-50%); width:100vw; height:100vh;
      background: radial-gradient(circle at 50% 15%, rgba(2, 132, 199, 0.15) 0%, rgba(245, 158, 11, 0.05) 45%, transparent 70%);
      pointer-events:none; z-index:0;
    }

    /* Container */
    .wrap { position:relative; z-index:1; max-width:1140px; margin:0 auto; padding:0 24px; }

    /* Header / Navbar */
    header {
      width:100%; border-bottom:1px solid rgba(255,255,255,0.06);
      background:rgba(7, 11, 20, 0.8); backdrop-filter:blur(20px); position:sticky; top:0; z-index:100;
    }
    .nav-inner {
      height:76px; display:flex; align-items:center; justify-content:space-between;
    }
    .logo-group { display:flex; align-items:center; gap:12px; text-decoration:none; color:#fff; }
    .logo-badge {
      width:42px; height:42px; border-radius:14px; background:linear-gradient(135deg, #0284C7, #0369A1);
      display:flex; align-items:center; justify-content:center; font-size:22px; box-shadow:0 0 20px rgba(2,132,199,0.5);
    }
    .logo-text { font-size:21px; font-weight:800; letter-spacing:-0.5px; }
    .logo-text span { color: var(--primary-light); }
    .nav-links { display:flex; gap:28px; align-items:center; }
    .nav-link { color: var(--text-sub); text-decoration:none; font-size:14.5px; font-weight:600; transition:0.2s; }
    .nav-link:hover { color: var(--primary-light); }
    .btn-nav-download {
      background:linear-gradient(135deg, var(--primary), #0369A1); color:#fff; padding:10px 22px;
      border-radius:24px; font-size:14px; font-weight:700; text-decoration:none; box-shadow:0 4px 16px rgba(2,132,199,0.4); transition:0.2s;
    }
    .btn-nav-download:hover { transform:translateY(-1px); box-shadow:0 6px 22px rgba(2,132,199,0.6); }

    /* Hero Section */
    .hero { padding:80px 0 60px 0; text-align:center; }
    .release-tag {
      display:inline-flex; align-items:center; gap:8px; background:rgba(2,132,199,0.12);
      border:1px solid rgba(56,189,248,0.3); padding:8px 20px; border-radius:30px; font-size:13.5px;
      font-weight:700; color:var(--primary-light); margin-bottom:28px; box-shadow:0 0 20px rgba(2,132,199,0.15);
    }
    .hero h1 {
      font-size:48px; font-weight:800; line-height:1.2; letter-spacing:-1px; margin-bottom:20px;
      background:linear-gradient(180deg, #FFFFFF 30%, #94A3B8 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    }
    .hero p {
      max-width:640px; margin:0 auto 36px auto; font-size:17px; color: var(--text-sub); line-height:1.65;
    }
    .cta-group {
      display:flex; justify-content:center; align-items:center; gap:16px; flex-wrap:wrap; margin-bottom:48px;
    }
    .btn-hero-primary {
      display:inline-flex; align-items:center; gap:10px; background:linear-gradient(135deg, #0284C7, #0369A1);
      color:#fff; padding:16px 34px; border-radius:20px; font-size:16px; font-weight:800; text-decoration:none;
      box-shadow:0 12px 28px rgba(2,132,199,0.45); transition:0.2s;
    }
    .btn-hero-primary:hover { transform:translateY(-2px); box-shadow:0 16px 36px rgba(2,132,199,0.6); }
    .btn-hero-secondary {
      display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,0.06);
      color:#E2E8F0; border:1px solid rgba(255,255,255,0.12); padding:16px 28px; border-radius:20px;
      font-size:15px; font-weight:700; text-decoration:none; transition:0.2s; cursor:pointer;
    }
    .btn-hero-secondary:hover { background:rgba(255,255,255,0.12); color:#fff; }

    /* QR Code Card */
    .qr-banner {
      display:inline-flex; align-items:center; gap:20px; background: var(--card-bg);
      border:1px solid var(--card-border); border-radius:24px; padding:18px 24px;
      box-shadow:0 20px 40px rgba(0,0,0,0.4); backdrop-filter:blur(24px); text-align:left;
    }
    .qr-img { width:96px; height:96px; border-radius:14px; border:2px solid rgba(2,132,199,0.4); background:#0F172A; }
    .qr-info h4 { font-size:15px; font-weight:800; color:#F8FAFC; margin-bottom:4px; }
    .qr-info p { font-size:12.5px; color: var(--text-sub); margin-bottom:8px; }
    .qr-badge {
      display:inline-block; font-size:11px; font-weight:700; background:rgba(245,158,11,0.15);
      color:var(--accent-light); border:1px solid rgba(245,158,11,0.3); padding:2px 8px; border-radius:10px;
    }

    /* Core Features Grid */
    .section-title-wrap { text-align:center; margin:100px 0 50px 0; }
    .section-tag { font-size:13px; font-weight:800; color:var(--primary-light); text-transform:uppercase; letter-spacing:1px; margin-bottom:10px; }
    .section-title { font-size:34px; font-weight:800; letter-spacing:-0.5px; }

    .features-grid {
      display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:24px; margin-bottom:80px;
    }
    .feature-card {
      background: var(--card-bg); border:1px solid var(--card-border); border-radius:24px;
      padding:32px 24px; backdrop-filter:blur(24px); transition:0.3s;
    }
    .feature-card:hover { transform:translateY(-4px); border-color:rgba(2,132,199,0.3); box-shadow:0 20px 40px rgba(0,0,0,0.5); }
    .feat-icon {
      width:54px; height:54px; border-radius:18px; display:flex; align-items:center; justify-content:center;
      font-size:26px; margin-bottom:20px;
    }
    .feat-blue { background:rgba(2,132,199,0.15); border:1px solid rgba(2,132,199,0.3); color:#38BDF8; }
    .feat-amber { background:rgba(245,158,11,0.15); border:1px solid rgba(245,158,11,0.3); color:#FBBF24; }
    .feat-purple { background:rgba(168,85,247,0.15); border:1px solid rgba(168,85,247,0.3); color:#C084FC; }
    .feat-emerald { background:rgba(16,185,129,0.15); border:1px solid rgba(16,185,129,0.3); color:#34D399; }
    .feature-card h3 { font-size:18px; font-weight:800; margin-bottom:10px; color:#F8FAFC; }
    .feature-card p { font-size:14px; color: var(--text-sub); line-height:1.6; }

    /* Install Steps Section */
    .steps-card {
      background:linear-gradient(135deg, rgba(20,27,45,0.9), rgba(15,23,42,0.9));
      border:1px solid rgba(56,189,248,0.25); border-radius:28px; padding:44px 36px;
      margin-bottom:90px; backdrop-filter:blur(24px);
    }
    .steps-card h2 { font-size:26px; font-weight:800; text-align:center; margin-bottom:32px; }
    .steps-list { display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:24px; }
    .step-item { background:rgba(255,255,255,0.03); border-radius:18px; padding:24px; border:1px solid rgba(255,255,255,0.05); }
    .step-num {
      width:32px; height:32px; border-radius:10px; background:var(--primary); color:#fff;
      display:flex; align-items:center; justify-content:center; font-weight:800; font-size:14px; margin-bottom:14px;
    }
    .step-item h4 { font-size:16px; font-weight:800; margin-bottom:6px; }
    .step-item p { font-size:13.5px; color:var(--text-sub); line-height:1.55; }

    /* Footer */
    footer {
      border-top:1px solid rgba(255,255,255,0.06); padding:40px 0; background:rgba(7,11,20,0.95); text-align:center;
    }
    .footer-links { display:flex; justify-content:center; gap:24px; margin-bottom:16px; flex-wrap:wrap; }
    .footer-links a { color:var(--text-sub); text-decoration:none; font-size:13.5px; font-weight:600; transition:0.2s; }
    .footer-links a:hover { color:var(--primary-light); }
    .footer-copy { font-size:12.5px; color:#64748B; }

    /* iOS Modal */
    .modal-overlay {
      position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.7);
      display:none; align-items:center; justify-content:center; z-index:999; padding:20px; backdrop-filter:blur(10px);
    }
    .modal-box {
      background:#0F172A; border:1px solid rgba(255,255,255,0.12); border-radius:24px;
      max-width:440px; width:100%; padding:32px 24px; text-align:center; box-shadow:0 25px 50px rgba(0,0,0,0.7);
    }
    .modal-box h3 { font-size:20px; font-weight:800; margin-bottom:12px; color:#F8FAFC; }
    .modal-box p { font-size:14px; color:var(--text-sub); line-height:1.6; margin-bottom:24px; }
    .btn-close-modal {
      display:inline-block; background:rgba(255,255,255,0.08); color:#E2E8F0; padding:10px 24px;
      border-radius:14px; font-size:14px; font-weight:700; text-decoration:none; cursor:pointer;
    }

    @media (max-width: 768px) {
      .hero h1 { font-size:32px; }
      .hero p { font-size:15px; }
      .nav-links { display:none; }
      .qr-banner { flex-direction:column; text-align:center; }
    }
  </style>
</head>
<body>
  <div class="ambient-glow"></div>

  <!-- Header -->
  <header>
    <div class="wrap">
      <div class="nav-inner">
        <a href="/" class="logo-group">
          <div class="logo-badge">✨</div>
          <div class="logo-text">Dorabox<span>Social</span></div>
        </a>
        <nav class="nav-links">
          <a href="#features" class="nav-link">Tính năng nổi bật</a>
          <a href="#installation" class="nav-link">Hướng dẫn cài đặt</a>
          <a href="/privacy" class="nav-link">Chính sách bảo mật</a>
          <a href="/terms" class="nav-link">Điều khoản dịch vụ</a>
        </nav>
        <a href="${apkUrl}" class="btn-nav-download">Tải v${version} APK</a>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="hero">
    <div class="wrap">
      <div class="release-tag">
        <span>🚀</span>
        <span>Phiên bản v${version} (Build ${config.buildNumber}) đã sẵn sàng</span>
      </div>

      <h1>Kết Nối Diệu Kỳ,<br>Sẻ Chia Niềm Vui Không Giới Hạn! ✨</h1>
      
      <p>
        Mạng xã hội thế hệ mới bảo vệ tối đa bản quyền tác giả với công nghệ tách biệt lưu ảnh & video,
        ghi chú D-Notes 24h bồng bềnh, và trải nghiệm cuộn lướt 120 FPS không giật lag.
      </p>

      <div class="cta-group">
        <a href="${apkUrl}" class="btn-hero-primary">
          <span>⬇️</span>
          <span>Tải APK Trực Tiếp (v${version})</span>
        </a>
        <button class="btn-hero-secondary" onclick="openIosModal()">
          <span>🍏</span>
          <span>Dành cho iOS (iPhone/iPad)</span>
        </button>
      </div>

      <!-- QR Code Banner -->
      <div>
        <div class="qr-banner">
          <img src="${qrCodeUrl}" alt="QR Tải Dorabox" class="qr-img">
          <div class="qr-info">
            <span class="qr-badge">QUÉT CAMERA ĐỂ CÀI ĐẶT</span>
            <h4>Tải về điện thoại tức thì</h4>
            <p>Mở camera điện thoại quét mã QR để bắt đầu tải file APK tốc độ cao qua Cloudflare R2 CDN.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Core Features -->
  <section id="features" class="wrap">
    <div class="section-title-wrap">
      <div class="section-tag">Đột phá công nghệ</div>
      <h2 class="section-title">4 Tính Năng Độc Quyền Trên Dorabox</h2>
    </div>

    <div class="features-grid">
      <div class="feature-card">
        <div class="feat-icon feat-blue">🛡️</div>
        <h3>Bản Quyền Tách Biệt</h3>
        <p>Lần đầu tiên trên mạng xã hội: tác giả có quyền cho phép lưu ảnh nhưng khóa video (hoặc ngược lại). Bảo vệ tài sản sáng tạo 100%.</p>
      </div>

      <div class="feature-card">
        <div class="feat-icon feat-amber">🎵</div>
        <h3>D-Notes 24h & Giai Điệu</h3>
        <p>Bong bóng suy nghĩ bồng bềnh ngay đầu trang kèm bài hát yêu thích. Bạn bè tương tác thả tim và phản hồi tin nhắn chỉ với 1 chạm.</p>
      </div>

      <div class="feature-card">
        <div class="feat-icon feat-purple">🏢</div>
        <h3>Doanh Nghiệp (Tích Vàng OA)</h3>
        <p>Trang hồ sơ chuyên nghiệp dành cho doanh nghiệp và nhà sáng tạo. Nhận tin nhắn từ khách hàng mà không giới hạn danh sách bạn bè.</p>
      </div>

      <div class="feature-card">
        <div class="feat-icon feat-emerald">⚡</div>
        <h3>Hiệu Năng 120 FPS Siêu Mượt</h3>
        <p>Tối ưu hóa bộ nhớ RAM, chống rung giật khi tương tác và mã hóa dữ liệu an toàn qua hạ tầng Supabase & Cloudflare Edge CDN.</p>
      </div>
    </div>
  </section>

  <!-- Installation Steps -->
  <section id="installation" class="wrap">
    <div class="steps-card">
      <h2>3 Bước Cài Đặt Dorabox APK Đơn Giản</h2>
      <div class="steps-list">
        <div class="step-item">
          <div class="step-num">1</div>
          <h4>Tải tệp tin APK</h4>
          <p>Bấm nút "Tải APK" để tải bộ cài đặt chính thức <code>Dorabox-v${version}.apk</code> trực tiếp từ Cloudflare R2 CDN siêu tốc.</p>
        </div>
        <div class="step-item">
          <div class="step-num">2</div>
          <h4>Cấp quyền cài đặt</h4>
          <p>Khi điện thoại hiển thị cảnh báo tệp APK, chọn <em>"Cài đặt nguồn này"</em> trong phần Cài đặt trình duyệt để cho phép cài đặt an toàn.</p>
        </div>
        <div class="step-item">
          <div class="step-num">3</div>
          <h4>Đăng ký & Khám phá</h4>
          <p>Mở ứng dụng Dorabox từ màn hình chính, tạo tài khoản cá nhân hoặc OA doanh nghiệp và bắt đầu kết nối cùng bạn bè!</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer>
    <div class="wrap">
      <div class="footer-links">
        <a href="#features">Tính năng</a>
        <a href="${apkUrl}">Tải APK</a>
        <a href="/privacy">Chính sách Quyền riêng tư</a>
        <a href="/terms">Điều khoản Dịch vụ</a>
      </div>
      <div class="footer-copy">
        © 2026 Tinelfi • Dorabox Social Platform. Bản quyền phần mềm đã được đăng ký bảo hộ.
      </div>
    </div>
  </footer>

  <!-- iOS Modal -->
  <div id="iosModal" class="modal-overlay" onclick="closeIosModal(event)">
    <div class="modal-box">
      <div style="font-size:36px; margin-bottom:12px;">🍏</div>
      <h3>Trải Nghiệm Dorabox Trên iOS</h3>
      <p>
        Phiên bản App Store đang trong quá trình xét duyệt hoàn thiện. Hiện tại bạn có thể mở trang web trên Safari của iPhone và chọn <strong>"Thêm vào Màn hình chính" (Add to Home Screen)</strong> để sử dụng như một ứng dụng native.
      </p>
      <button class="btn-close-modal" onclick="closeIosModalDirect()">Đã hiểu</button>
    </div>
  </div>

  <script>
    function openIosModal() {
      document.getElementById('iosModal').style.display = 'flex';
    }
    function closeIosModal(e) {
      if (e.target.id === 'iosModal') {
        document.getElementById('iosModal').style.display = 'none';
      }
    }
    function closeIosModalDirect() {
      document.getElementById('iosModal').style.display = 'none';
    }
  </script>
</body>
</html>`;
}
