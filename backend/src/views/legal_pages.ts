/**
 * Dorabox Social - Privacy Policy & Terms of Service Pages
 * Thiết kế chuẩn mực, hiện đại phục vụ Google Play Console, Apple App Store và người dùng.
 */

export function renderPrivacyPolicyPage(): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chính sách Quyền riêng tư - Dorabox</title>
  <link rel="icon" href="https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; font-family:'Quicksand', -apple-system, sans-serif; }
    body { background:#070B14; color:#E2E8F0; line-height:1.7; padding:40px 20px 80px 20px; display:flex; justify-content:center; }
    .container { max-width:760px; width:100%; background:rgba(20, 27, 45, 0.75); border:1px solid rgba(255,255,255,0.08); border-radius:24px; padding:40px 32px; backdrop-filter:blur(24px); box-shadow:0 25px 50px rgba(0,0,0,0.5); }
    .header { text-align:center; margin-bottom:36px; padding-bottom:24px; border-bottom:1px solid rgba(255,255,255,0.08); }
    .logo { width:48px; height:48px; border-radius:14px; background:#0284C7; display:inline-flex; align-items:center; justify-content:center; font-size:24px; margin-bottom:12px; }
    h1 { font-size:26px; font-weight:800; color:#F8FAFC; margin-bottom:8px; }
    .date { font-size:13px; color:#94A3B8; }
    h2 { font-size:18px; font-weight:700; color:#38BDF8; margin:28px 0 12px 0; }
    p, li { font-size:14.5px; color:#CBD5E1; margin-bottom:12px; }
    ul { padding-left:20px; margin-bottom:16px; }
    .highlight { color:#FBBF24; font-weight:600; }
    .footer-link { text-align:center; margin-top:36px; padding-top:20px; border-top:1px solid rgba(255,255,255,0.08); }
    .btn-back { display:inline-block; background:rgba(255,255,255,0.06); color:#38BDF8; padding:10px 20px; border-radius:12px; text-decoration:none; font-weight:600; font-size:13.5px; border:1px solid rgba(56,189,248,0.2); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">✨</div>
      <h1>Chính sách Quyền riêng tư</h1>
      <div class="date">Cập nhật lần cuối: Tháng 11/2026 • Áp dụng cho phiên bản Dorabox v3.0.0+</div>
    </div>

    <h2>1. Cam kết của Dorabox về Quyền riêng tư</h2>
    <p>Dorabox tôn trọng và bảo vệ tối đa dữ liệu riêng tư của người dùng. Chúng tôi cam kết không kinh doanh, bán hoặc cung cấp trái phép thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích quảng cáo rác.</p>

    <h2>2. Dữ liệu chúng tôi thu thập</h2>
    <ul>
      <li><strong>Thông tin tài khoản:</strong> Tên hiển thị, tên định danh (@username), ảnh đại diện, tiểu sử, địa chỉ email dùng để xác thực và khôi phục tài khoản.</li>
      <li><strong>Nội dung đăng tải:</strong> Bài viết, bình luận, hình ảnh, video, ghi chú D-Notes 24h và tin nhắn thoại/văn bản.</li>
      <li><strong>Dữ liệu thiết bị & Kỹ thuật:</strong> Mã nhận dạng thiết bị FCM (Firebase Cloud Messaging) để phục vụ thông báo đẩy thời gian thực khi có tương tác mới.</li>
    </ul>

    <h2>3. Kiến trúc Bản quyền Nội dung Độc quyền</h2>
    <p>Dorabox áp dụng công nghệ <span class="highlight">Bản quyền tải tách biệt (Ảnh & Video)</span>. Khi bạn tắt quyền tải nội dung trong cài đặt hoặc khi tạo bài viết:</p>
    <ul>
      <li>Hệ thống máy chủ và ứng dụng Dorabox sẽ kích hoạt cơ chế khóa lưu tự động, chặn hành vi tải lậu ảnh và video.</li>
      <li>Các nội dung này được mã hóa quyền truy cập, chỉ cho phép hiển thị trực quan mà không thể tải tệp gốc trái phép.</li>
    </ul>

    <h2>4. Kiểm soát Quyền riêng tư & Bạn bè</h2>
    <p>Bạn luôn toàn quyền quyết định ai được xem bài viết của mình (Công khai, Chỉ bạn bè, hoặc Chỉ người được chọn). Đối với tài khoản Doanh nghiệp (Official Account), bài viết luôn mang tính chất công chúng nhằm tối ưu hóa sự tiếp cận.</p>

    <h2>5. Xóa tài khoản & Quyền được lãng quên</h2>
    <p>Người dùng có quyền yêu cầu xóa vĩnh viễn tài khoản và toàn bộ dữ liệu kèm theo bất kỳ lúc nào trực tiếp trong mục Cài đặt của ứng dụng hoặc liên hệ qua bộ phận quản trị viên.</p>

    <div class="footer-link">
      <a href="/" class="btn-back">← Quay lại Trang Chủ Dorabox</a>
    </div>
  </div>
</body>
</html>`;
}

export function renderTermsOfServicePage(): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Điều khoản Dịch vụ - Dorabox</title>
  <link rel="icon" href="https://doraboxcdn.zpiltk.io.vn/apk/dorabox_logo.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; font-family:'Quicksand', -apple-system, sans-serif; }
    body { background:#070B14; color:#E2E8F0; line-height:1.7; padding:40px 20px 80px 20px; display:flex; justify-content:center; }
    .container { max-width:760px; width:100%; background:rgba(20, 27, 45, 0.75); border:1px solid rgba(255,255,255,0.08); border-radius:24px; padding:40px 32px; backdrop-filter:blur(24px); box-shadow:0 25px 50px rgba(0,0,0,0.5); }
    .header { text-align:center; margin-bottom:36px; padding-bottom:24px; border-bottom:1px solid rgba(255,255,255,0.08); }
    .logo { width:48px; height:48px; border-radius:14px; background:#0284C7; display:inline-flex; align-items:center; justify-content:center; font-size:24px; margin-bottom:12px; }
    h1 { font-size:26px; font-weight:800; color:#F8FAFC; margin-bottom:8px; }
    .date { font-size:13px; color:#94A3B8; }
    h2 { font-size:18px; font-weight:700; color:#38BDF8; margin:28px 0 12px 0; }
    p, li { font-size:14.5px; color:#CBD5E1; margin-bottom:12px; }
    ul { padding-left:20px; margin-bottom:16px; }
    .footer-link { text-align:center; margin-top:36px; padding-top:20px; border-top:1px solid rgba(255,255,255,0.08); }
    .btn-back { display:inline-block; background:rgba(255,255,255,0.06); color:#38BDF8; padding:10px 20px; border-radius:12px; text-decoration:none; font-weight:600; font-size:13.5px; border:1px solid rgba(56,189,248,0.2); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">✨</div>
      <h1>Điều khoản Dịch vụ</h1>
      <div class="date">Cập nhật lần cuối: Tháng 11/2026 • Áp dụng cho hệ thống Dorabox</div>
    </div>

    <h2>1. Chấp thuận Điều khoản</h2>
    <p>Bằng việc đăng ký tài khoản hoặc sử dụng ứng dụng Dorabox và trang web liên kết, bạn đồng ý tuân thủ toàn bộ các điều khoản và quy chuẩn cộng đồng dưới đây.</p>

    <h2>2. Tiêu chuẩn Nội dung & Ứng xử</h2>
    <p>Dorabox là môi trường văn minh, tích cực. Nghiêm cấm các hành vi:</p>
    <ul>
      <li>Đăng tải nội dung khiêu dâm, bạo lực, kích động thù địch hoặc vi phạm pháp luật hiện hành.</li>
      <li>Quấy rối, đe dọa, xúc phạm danh dự hoặc mạo danh cá nhân, tổ chức khác.</li>
      <li>Phát tán phần mềm độc hại, cố tình can thiệp vào máy chủ hoặc tìm cách vượt qua các rào cản bảo vệ bản quyền của Dorabox.</li>
    </ul>

    <h2>3. Sở hữu Trí tuệ</h2>
    <p>Người dùng giữ toàn quyền sở hữu đối với các nội dung do mình tạo ra và đăng tải. Bằng việc đăng tải lên Dorabox, bạn cấp cho chúng tôi quyền hiển thị nội dung đó trên hệ thống ứng dụng và trang xem trước liên kết theo đúng cấu hình quyền riêng tư bạn đã chọn.</p>

    <h2>4. Chấm dứt & Khóa tài khoản</h2>
    <p>Dorabox có quyền tạm khóa hoặc đình chỉ vĩnh viễn các tài khoản có hành vi gian lận, spam tin nhắn, phát tán nội dung phản cảm hoặc vi phạm nghiêm trọng tiêu chuẩn cộng đồng mà không cần báo trước.</p>

    <div class="footer-link">
      <a href="/" class="btn-back">← Quay lại Trang Chủ Dorabox</a>
    </div>
  </div>
</body>
</html>`;
}
