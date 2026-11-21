/**
 * Dorabox Social - Privacy Policy & Terms of Service Pages
 * Thiết kế chuẩn mực, hiện đại phục vụ Google Play Console, Apple App Store và người dùng.
 * Phối màu đồng bộ: Nền sáng trang nhã, điểm nhấn Royal Blue (#0066FF).
 */

export function renderPrivacyPolicyPage(): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chính sách Quyền riêng tư - Dorabox</title>
  <link rel="icon" href="https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Quicksand:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #0066FF;
      --bg-page: #F8FAFC;
      --bg-surface: #FFFFFF;
      --text-main: #0F172A;
      --text-sub: #475569;
      --border: #E2E8F0;
    }
    * { margin:0; padding:0; box-sizing:border-box; font-family:'Plus Jakarta Sans', sans-serif; }
    h1, h2, .logo-text { font-family:'Quicksand', sans-serif; }
    body { background:var(--bg-page); color:var(--text-main); line-height:1.7; padding:48px 20px 80px 20px; display:flex; justify-content:center; }
    .container { max-width:760px; width:100%; background:var(--bg-surface); border:1px solid var(--border); border-radius:24px; padding:48px 40px; box-shadow:0 4px 20px rgba(0,0,0,0.03); }
    .header { text-align:center; margin-bottom:36px; padding-bottom:24px; border-bottom:1px solid var(--border); }
    .logo-img { width:48px; height:48px; border-radius:14px; margin-bottom:12px; }
    h1 { font-size:26px; font-weight:800; color:var(--text-main); margin-bottom:8px; }
    .date { font-size:13px; color:#94A3B8; }
    h2 { font-size:18px; font-weight:700; color:var(--primary); margin:28px 0 12px 0; }
    p, li { font-size:14.5px; color:var(--text-sub); margin-bottom:12px; }
    ul { padding-left:20px; margin-bottom:16px; }
    .highlight { color:var(--primary); font-weight:600; }
    .footer-link { text-align:center; margin-top:36px; padding-top:20px; border-top:1px solid var(--border); }
    .btn-back { display:inline-block; background:var(--bg-page); color:var(--primary); padding:10px 20px; border-radius:12px; text-decoration:none; font-weight:600; font-size:13.5px; border:1px solid var(--border); transition:0.2s; }
    .btn-back:hover { border-color:var(--primary); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png" alt="Dorabox" class="logo-img">
      <h1>Chính sách Quyền riêng tư</h1>
      <div class="date">Cập nhật: Tháng 11/2026 • Áp dụng cho nền tảng Dorabox</div>
    </div>

    <h2>1. Cam kết về Quyền riêng tư</h2>
    <p>Dorabox tôn trọng và bảo vệ tối đa quyền riêng tư của người dùng. Chúng tôi cam kết không kinh doanh, buôn bán hoặc chia sẻ dữ liệu cá nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích quảng cáo rác.</p>

    <h2>2. Dữ liệu chúng tôi thu thập</h2>
    <ul>
      <li><strong>Thông tin tài khoản:</strong> Tên hiển thị, tên định danh (@username), ảnh đại diện, tiểu sử, địa chỉ email dùng để xác thực và khôi phục tài khoản.</li>
      <li><strong>Nội dung đăng tải:</strong> Bài viết, bình luận, hình ảnh, video, ghi chú D-Notes 24h và tin nhắn thoại/văn bản.</li>
      <li><strong>Dữ liệu thiết bị:</strong> Mã nhận dạng thiết bị để phục vụ thông báo tức thì khi bạn bè gửi tin nhắn hoặc tương tác mới.</li>
    </ul>

    <h2>3. Bảo vệ Bản quyền Tác giả</h2>
    <p>Dorabox áp dụng công nghệ <span class="highlight">Bảo vệ quyền tác giả độc lập cho ảnh & video</span>. Khi bạn tắt quyền lưu nội dung trong cài đặt hoặc khi tạo bài viết:</p>
    <ul>
      <li>Ứng dụng sẽ kích hoạt cơ chế khóa lưu tự động, ngăn chặn các hành vi tải lại hình ảnh hoặc video trái phép.</li>
      <li>Nội dung của bạn được giữ gìn nguyên vẹn theo đúng mong muốn của bạn.</li>
    </ul>

    <h2>4. Kiểm soát Chia sẻ & Bạn bè</h2>
    <p>Bạn luôn toàn quyền quyết định ai được xem bài viết của mình (Công khai, Chỉ bạn bè, hoặc Chỉ người được chọn). Đối với tài khoản Doanh nghiệp (Official Account), bài viết luôn mang tính chất mở để tối ưu hóa sự tiếp cận đối tác và khách hàng.</p>

    <h2>5. Xóa tài khoản & Dữ liệu</h2>
    <p>Người dùng có quyền yêu cầu xóa vĩnh viễn tài khoản và toàn bộ dữ liệu kèm theo bất kỳ lúc nào trực tiếp trong mục Cài đặt của ứng dụng.</p>

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
  <link rel="icon" href="https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Quicksand:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #0066FF;
      --bg-page: #F8FAFC;
      --bg-surface: #FFFFFF;
      --text-main: #0F172A;
      --text-sub: #475569;
      --border: #E2E8F0;
    }
    * { margin:0; padding:0; box-sizing:border-box; font-family:'Plus Jakarta Sans', sans-serif; }
    h1, h2, .logo-text { font-family:'Quicksand', sans-serif; }
    body { background:var(--bg-page); color:var(--text-main); line-height:1.7; padding:48px 20px 80px 20px; display:flex; justify-content:center; }
    .container { max-width:760px; width:100%; background:var(--bg-surface); border:1px solid var(--border); border-radius:24px; padding:48px 40px; box-shadow:0 4px 20px rgba(0,0,0,0.03); }
    .header { text-align:center; margin-bottom:36px; padding-bottom:24px; border-bottom:1px solid var(--border); }
    .logo-img { width:48px; height:48px; border-radius:14px; margin-bottom:12px; }
    h1 { font-size:26px; font-weight:800; color:var(--text-main); margin-bottom:8px; }
    .date { font-size:13px; color:#94A3B8; }
    h2 { font-size:18px; font-weight:700; color:var(--primary); margin:28px 0 12px 0; }
    p, li { font-size:14.5px; color:var(--text-sub); margin-bottom:12px; }
    ul { padding-left:20px; margin-bottom:16px; }
    .footer-link { text-align:center; margin-top:36px; padding-top:20px; border-top:1px solid var(--border); }
    .btn-back { display:inline-block; background:var(--bg-page); color:var(--primary); padding:10px 20px; border-radius:12px; text-decoration:none; font-weight:600; font-size:13.5px; border:1px solid var(--border); transition:0.2s; }
    .btn-back:hover { border-color:var(--primary); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png" alt="Dorabox" class="logo-img">
      <h1>Điều khoản Dịch vụ</h1>
      <div class="date">Cập nhật: Tháng 11/2026 • Áp dụng cho nền tảng Dorabox</div>
    </div>

    <h2>1. Chấp thuận Điều khoản</h2>
    <p>Bằng việc đăng ký tài khoản hoặc sử dụng ứng dụng Dorabox, bạn đồng ý tuân thủ toàn bộ các điều khoản và quy chuẩn cộng đồng dưới đây.</p>

    <h2>2. Tiêu chuẩn Nội dung & Ứng xử Văn minh</h2>
    <p>Dorabox hướng đến một môi trường mạng xã hội văn minh, tích cực. Nghiêm cấm các hành vi:</p>
    <ul>
      <li>Đăng tải nội dung khiêu dâm, bạo lực, kích động thù hằn hoặc vi phạm quy định pháp luật.</li>
      <li>Quấy rối, xúc phạm danh dự, mạo danh người khác hoặc phát tán tin rác gây phiền hà.</li>
      <li>Cố tình can thiệp vào máy chủ hoặc tìm cách vượt qua các rào cản bảo vệ quyền tác giả của người khác.</li>
    </ul>

    <h2>3. Quyền Sở hữu Nội dung</h2>
    <p>Bạn luôn giữ quyền sở hữu đối với các nội dung do chính mình sáng tạo và đăng tải. Bằng việc đăng lên Dorabox, bạn cấp quyền cho chúng tôi hiển thị nội dung đó trên hệ thống theo đúng cấu hình quyền riêng tư bạn đã chọn.</p>

    <h2>4. Xử lý Vi phạm</h2>
    <p>Dorabox có quyền tạm khóa hoặc đình chỉ vĩnh viễn các tài khoản vi phạm nghiêm trọng tiêu chuẩn cộng đồng để bảo vệ an toàn cho toàn thể người dùng.</p>

    <div class="footer-link">
      <a href="/" class="btn-back">← Quay lại Trang Chủ Dorabox</a>
    </div>
  </div>
</body>
</html>`;
}
