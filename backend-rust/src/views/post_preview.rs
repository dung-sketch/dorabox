use super::escape_html;
use crate::services::supabase::Post;

pub fn render_post_preview(post_opt: Option<&Post>, host: &str, is_restricted: bool) -> String {
    let apk_url = "https://doraboxcdn.zpiltk.io.vn/apk/Dorabox-v3.0.0.apk";

    let post = match post_opt {
        Some(p) => p,
        None => {
            return format!(
                r#"<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bài viết không khả dụng - Dorabox</title>
  <link rel="icon" href="https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Quicksand:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    * {{ margin:0; padding:0; box-sizing:border-box; font-family:'Plus Jakarta Sans', sans-serif; }}
    h1 {{ font-family:'Quicksand', sans-serif; }}
    body {{ background:#F8FAFC; color:#0F172A; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:20px; }}
    .card {{ background:#FFFFFF; border:1px solid #E2E8F0; border-radius:24px; padding:40px 28px; max-width:420px; width:100%; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,0.05); }}
    h1 {{ font-size:20px; font-weight:800; margin-bottom:10px; color:#0F172A; }}
    p {{ font-size:14.5px; color:#64748B; line-height:1.6; margin-bottom:28px; }}
    .btn {{ display:inline-block; background:#0066FF; color:#fff; padding:12px 28px; border-radius:14px; text-decoration:none; font-weight:700; font-size:14px; transition:0.2s; }}
    .btn:hover {{ background:#0052CC; }}
  </style>
</head>
<body>
  <div class="card">
    <div style="font-size:44px; margin-bottom:16px;">🔍</div>
    <h1>Bài viết không khả dụng</h1>
    <p>Bài viết này có thể đã được gỡ xuống hoặc liên kết bạn mở không tồn tại.</p>
    <a href="/" class="btn">Khám phá Dorabox</a>
  </div>
</body>
</html>"#
            );
        }
    };

    let author_obj = post.author.as_ref();
    let author_name = author_obj
        .and_then(|a| a.get("display_name"))
        .and_then(|v| v.as_str())
        .unwrap_or("Người dùng Dorabox");
    let author_username = author_obj
        .and_then(|a| a.get("username"))
        .and_then(|v| v.as_str())
        .unwrap_or("user");
    let author_avatar = author_obj
        .and_then(|a| a.get("avatar_url"))
        .and_then(|v| v.as_str())
        .unwrap_or("https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png");

    let is_oa = author_obj
        .and_then(|a| a.get("is_oa"))
        .and_then(|v| v.as_bool())
        .unwrap_or(false);

    let raw_content = post.content.as_deref().unwrap_or("").trim();
    let content_excerpt = if raw_content.len() > 180 {
        format!("{}...", &raw_content[..180])
    } else {
        raw_content.to_string()
    };

    let media_list = post.media_urls.clone().unwrap_or_default();
    let mut image_urls = Vec::new();
    let mut video_urls = Vec::new();

    for u in &media_list {
        let u_lower = u.to_lowercase();
        if u_lower.ends_with(".mp4") || u_lower.ends_with(".mov") || u_lower.ends_with(".webm") {
            video_urls.push(u.as_str());
        } else if !u_lower.ends_with(".mp3") && !u_lower.ends_with(".m4a") && !u_lower.ends_with(".wav") {
            image_urls.push(u.as_str());
        }
    }

    let og_image = if !is_restricted && !image_urls.is_empty() {
        image_urls[0]
    } else {
        author_avatar
    };

    let page_title = if is_restricted {
        "Bài viết riêng tư - Dorabox".to_string()
    } else {
        format!("{}: \"{}\" - Dorabox", author_name, content_excerpt.replace('\n', " "))
    };

    let og_desc = if is_restricted {
        "Bài viết này được chia sẻ ở chế độ bảo mật riêng tư trên Dorabox.".to_string()
    } else if !content_excerpt.is_empty() {
        content_excerpt.replace('\n', " ")
    } else {
        format!("Khám phá bài viết của {} trên Dorabox.", author_name)
    };

    let safe_title = escape_html(&page_title);
    let safe_desc = escape_html(&og_desc);
    let safe_image = escape_html(og_image);
    let safe_author = escape_html(author_name);
    let safe_username = escape_html(author_username);
    let safe_content = escape_html(raw_content).replace('\n', "<br>");

    format!(
        r#"<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>{}</title>
  
  <meta property="og:site_name" content="Dorabox">
  <meta property="og:title" content="{}">
  <meta property="og:description" content="{}">
  <meta property="og:image" content="{}">
  <meta property="og:url" content="https://{}/p/{}">
  <meta property="og:type" content="{}">
  <meta property="al:android:url" content="dorabox://post/{}">
  <meta property="al:android:package" content="com.tinelfi.dorabox">
  <meta property="al:android:app_name" content="Dorabox">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{}">
  <meta name="twitter:description" content="{}">
  <meta name="twitter:image" content="{}">

  <link rel="icon" href="https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Quicksand:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {{
      --primary: #0066FF;
      --bg-page: #F8FAFC;
      --bg-surface: #FFFFFF;
      --text-main: #0F172A;
      --text-sub: #64748B;
      --border: #E2E8F0;
    }}
    * {{ margin:0; padding:0; box-sizing:border-box; font-family:'Plus Jakarta Sans', sans-serif; }}
    h1, .author-name {{ font-family:'Quicksand', sans-serif; }}
    body {{ background:var(--bg-page); color:var(--text-main); min-height:100vh; padding:24px 16px 80px 16px; display:flex; flex-direction:column; align-items:center; }}
    .container {{ max-width:580px; width:100%; }}
    .post-card {{ background:var(--bg-surface); border:1px solid var(--border); border-radius:24px; padding:24px; box-shadow:0 10px 30px rgba(0,0,0,0.04); margin-bottom:20px; }}
    .author-header {{ display:flex; align-items:center; gap:12px; margin-bottom:16px; }}
    .avatar {{ width:48px; height:48px; border-radius:50%; object-fit:cover; border:2px solid #E2E8F0; }}
    .author-name {{ font-size:16px; font-weight:700; color:var(--text-main); }}
    .author-user {{ font-size:13px; color:var(--text-sub); }}
    .post-content {{ font-size:15px; line-height:1.6; color:var(--text-main); margin-bottom:16px; }}
    .media-container {{ border-radius:16px; overflow:hidden; margin-bottom:16px; background:#000; }}
    .media-container img, .media-container video {{ width:100%; max-height:480px; object-fit:cover; display:block; }}
    .btn-app {{ display:flex; align-items:center; justify-content:center; gap:8px; width:100%; background:var(--primary); color:#fff; font-weight:700; font-size:15px; padding:14px; border-radius:16px; text-decoration:none; box-shadow:0 4px 14px rgba(0,102,255,0.3); transition:0.2s; }}
    .btn-app:hover {{ background:#0052CC; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="post-card">
      <div class="author-header">
        <img src="{}" class="avatar" alt="{}">
        <div>
          <div class="author-name">{} {}</div>
          <div class="author-user">@{}</div>
        </div>
      </div>
      <div class="post-content">{}</div>
      <div class="media-preview">
        {}
      </div>
      <a href="{}" class="btn-app">Mở trong ứng dụng Dorabox</a>
    </div>
  </div>
</body>
</html>"#,
        safe_title,
        safe_title,
        safe_desc,
        safe_image,
        host,
        post.id,
        if !video_urls.is_empty() && !is_restricted { "video.other" } else { "article" },
        post.id,
        safe_title,
        safe_desc,
        safe_image,
        author_avatar,
        safe_author,
        safe_author,
        if is_oa { "<span style='color:#FFB800;'>★ OA</span>" } else { "" },
        safe_username,
        safe_content,
        if !image_urls.is_empty() {
            format!("<div class='media-container'><img src='{}' alt='Media' style='-webkit-user-select:none; pointer-events:none;' oncontextmenu='return false;'></div>", image_urls[0])
        } else if !video_urls.is_empty() {
            format!("<div class='media-container'><video src='{}' controls controlsList='nodownload' playsinline></video></div>", video_urls[0])
        } else {
            String::new()
        },
        apk_url
    )
}
