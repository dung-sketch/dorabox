use super::escape_html;
use serde_json::Value;

pub fn render_landing_page(
    apk_url: &str,
    version: &str,
    posts: &[Value],
    _profiles: &[Value],
) -> String {
    let qr_url = format!(
        "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data={}&color=0066FF&bgcolor=FFFFFF",
        urlencoding_simple(apk_url)
    );

    let mut posts_html = String::new();
    for p in posts.iter().take(2) {
        let content = p.get("content").and_then(|c| c.as_str()).unwrap_or("");
        let author = p.get("author");
        let name = author.and_then(|a| a.get("display_name")).and_then(|v| v.as_str()).unwrap_or("Dorabox");
        let avatar = author.and_then(|a| a.get("avatar_url")).and_then(|v| v.as_str()).unwrap_or("https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png");
        let post_id = p.get("id").and_then(|i| i.as_str()).unwrap_or("");

        posts_html.push_str(&format!(
            r#"<a href="/p/{}" target="_blank" class="post-preview-item">
              <div class="item-header">
                <img src="{}" class="item-avatar" alt="{}">
                <div>
                  <div class="item-name">{}</div>
                  <div class="item-sub">Bài viết chính thức</div>
                </div>
              </div>
              <div class="item-body">{}</div>
            </a>"#,
            post_id, avatar, escape_html(name), escape_html(name), escape_html(content)
        ));
    }

    format!(
        r#"<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Dorabox - Mạng xã hội kết nối diệu kỳ</title>
  <meta name="description" content="Dorabox - Mạng xã hội Việt Nam với bảo vệ quyền tác giả độc lập cho ảnh & video, D-Notes 24h âm nhạc và nhắn tin, gọi video bảo mật.">
  <meta property="og:title" content="Dorabox - Mạng xã hội kết nối diệu kỳ">
  <meta property="og:description" content="Khám phá nền tảng mạng xã hội tôn trọng quyền riêng tư và quyền tác giả của bạn.">
  <meta property="og:image" content="https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png">
  <link rel="icon" href="https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png">
  <link rel="manifest" href="/manifest.json">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Quicksand:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {{
      --primary: #0066FF;
      --gold: #FFB800;
      --bg: #F8FAFC;
      --surface: #FFFFFF;
      --text: #0F172A;
      --sub: #475569;
      --border: #E2E8F0;
    }}
    * {{ margin:0; padding:0; box-sizing:border-box; font-family:'Plus Jakarta Sans', sans-serif; }}
    h1, h2, h3, .brand {{ font-family:'Quicksand', sans-serif; }}
    body {{ background:var(--bg); color:var(--text); line-height:1.6; }}
    .navbar {{ display:flex; justify-content:space-between; align-items:center; padding:16px 32px; background:rgba(255,255,255,0.9); backdrop-filter:blur(12px); border-bottom:1px solid var(--border); position:sticky; top:0; z-index:100; }}
    .brand {{ display:flex; align-items:center; gap:10px; font-size:22px; font-weight:800; color:var(--primary); text-decoration:none; }}
    .brand img {{ width:38px; height:38px; border-radius:12px; }}
    .nav-links {{ display:flex; gap:20px; align-items:center; }}
    .nav-link {{ color:var(--sub); text-decoration:none; font-weight:600; font-size:14px; transition:0.2s; }}
    .nav-link:hover {{ color:var(--primary); }}
    .btn-nav {{ background:var(--primary); color:#fff !important; padding:8px 18px; border-radius:12px; }}
    .hero {{ max-width:1100px; margin:60px auto 40px auto; padding:0 24px; text-align:center; }}
    .hero-badge {{ display:inline-flex; align-items:center; gap:8px; background:rgba(0,102,255,0.08); color:var(--primary); padding:6px 16px; border-radius:20px; font-size:13px; font-weight:700; margin-bottom:20px; }}
    .hero h1 {{ font-size:48px; font-weight:800; line-height:1.2; margin-bottom:18px; color:#0F172A; }}
    .hero h1 span {{ color:var(--primary); }}
    .hero p {{ font-size:18px; color:var(--sub); max-width:680px; margin:0 auto 36px auto; }}
    .download-box {{ display:inline-flex; flex-direction:column; align-items:center; background:var(--surface); border:1px solid var(--border); border-radius:28px; padding:32px; box-shadow:0 12px 40px rgba(0,0,0,0.06); }}
    .btn-download {{ display:flex; align-items:center; gap:12px; background:var(--primary); color:#fff; text-decoration:none; padding:16px 36px; border-radius:18px; font-size:17px; font-weight:700; box-shadow:0 8px 24px rgba(0,102,255,0.35); transition:0.2s; }}
    .btn-download:hover {{ background:#0052CC; transform:translateY(-2px); }}
    .qr-wrap {{ margin-top:20px; text-align:center; }}
    .qr-wrap img {{ border-radius:16px; border:1px solid var(--border); padding:8px; }}
    .qr-text {{ font-size:12px; color:var(--sub); margin-top:8px; font-weight:600; }}
    .features {{ max-width:1100px; margin:80px auto; padding:0 24px; display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:24px; }}
    .card {{ background:var(--surface); border:1px solid var(--border); border-radius:24px; padding:32px; box-shadow:0 4px 20px rgba(0,0,0,0.02); }}
    .card-icon {{ font-size:36px; margin-bottom:16px; }}
    .card h3 {{ font-size:20px; font-weight:700; margin-bottom:10px; }}
    .card p {{ font-size:14.5px; color:var(--sub); }}
    .showcase {{ max-width:1100px; margin:0 auto 80px auto; padding:0 24px; }}
    .showcase h2 {{ text-align:center; font-size:30px; font-weight:800; margin-bottom:32px; }}
    .posts-grid {{ display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:20px; }}
    .post-preview-item {{ background:var(--surface); border:1px solid var(--border); border-radius:20px; padding:20px; text-decoration:none; color:inherit; transition:0.2s; }}
    .post-preview-item:hover {{ border-color:var(--primary); transform:translateY(-2px); }}
    .item-header {{ display:flex; align-items:center; gap:12px; margin-bottom:12px; }}
    .item-avatar {{ width:40px; height:40px; border-radius:50%; object-fit:cover; }}
    .item-name {{ font-weight:700; font-size:15px; color:var(--text); }}
    .item-sub {{ font-size:12px; color:var(--sub); }}
    .item-body {{ font-size:14px; color:var(--sub); }}
    footer {{ background:#0F172A; color:#94A3B8; padding:48px 24px; text-align:center; font-size:13.5px; }}
    footer a {{ color:#fff; text-decoration:none; margin:0 12px; }}
  </style>
</head>
<body>
  <div class="navbar">
    <a href="/" class="brand">
      <img src="https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png" alt="Logo">
      Dorabox
    </a>
    <div class="nav-links">
      <a href="/privacy" class="nav-link">Quyền riêng tư</a>
      <a href="/terms" class="nav-link">Điều khoản</a>
      <a href="{}" class="nav-link btn-nav">Tải APK v{}</a>
    </div>
  </div>

  <div class="hero">
    <div class="hero-badge">✨ Nền tảng Thế hệ Mới v{}</div>
    <h1>Mạng xã hội diệu kỳ,<br><span>Bảo vệ quyền tác giả tối ưu</span></h1>
    <p>Kết nối bạn bè, sẻ chia cuộc sống với cơ chế chống tải ảnh/video độc lập, D-Notes 24 giờ cùng giai điệu âm nhạc và bảo mật vượt trội.</p>
    
    <div class="download-box">
      <a href="{}" class="btn-download">
        <span>📲 Tải Dorabox APK</span>
      </a>
      <div class="qr-wrap">
        <img src="{}" width="160" height="160" alt="QR Code Tải Dorabox">
        <div class="qr-text">Quét mã để tải về điện thoại</div>
      </div>
    </div>
  </div>

  <div class="features">
    <div class="card">
      <div class="card-icon">🛡️</div>
      <h3>Bảo vệ Quyền Tác giả Độc lập</h3>
      <p>Tùy chọn cho phép hoặc ngăn chặn tải ảnh và video cho từng bài đăng. Quyền riêng tư nội dung của bạn được tôn trọng tuyệt đối.</p>
    </div>
    <div class="card">
      <div class="card-icon">🎵</div>
      <h3>Ghi chú D-Notes 24 Giờ</h3>
      <p>Sẻ chia cảm xúc và giai điệu âm nhạc thịnh hành qua ghi chú 24 giờ tương tác sống động cùng bạn bè thân thiết.</p>
    </div>
    <div class="card">
      <div class="card-icon">⚡</div>
      <h3>Nhắn tin & Gọi Video Tức thì</h3>
      <p>Trò chuyện mã hóa, gọi thoại và video chuẩn HD mượt mà hỗ trợ hạ tầng máy chủ Rust siêu tốc.</p>
    </div>
  </div>

  <div class="showcase">
    <h2>Bài viết Nổi bật từ Official Account</h2>
    <div class="posts-grid">
      {}
    </div>
  </div>

  <footer>
    <div style="margin-bottom:16px;">
      <a href="/privacy">Chính sách Quyền riêng tư</a>
      <a href="/terms">Điều khoản Dịch vụ</a>
      <a href="/sitemap.xml">Sitemap</a>
    </div>
    <div>&copy; 2026 Dorabox Social Platform. Bản quyền thuộc về đội ngũ sáng lập Dorabox.</div>
  </footer>
</body>
</html>"#,
        apk_url, version, version, apk_url, qr_url, posts_html
    )
}

fn urlencoding_simple(s: &str) -> String {
    let mut out = String::new();
    for b in s.bytes() {
        match b {
            b'a'..=b'z' | b'A'..=b'Z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => {
                out.push(b as char);
            }
            _ => out.push_str(&format!("%{:02X}", b)),
        }
    }
    out
}
