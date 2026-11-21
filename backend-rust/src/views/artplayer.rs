use super::escape_html;

pub fn render_artplayer(video_url: &str, title: &str) -> String {
    let safe_title = escape_html(title);
    let safe_url = escape_html(video_url);

    format!(
        r#"<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>{} - Dorabox ArtPlayer</title>
  <link rel="icon" href="https://doraboxcdn.zpiltk.io.vn/favicon.ico">
  <script src="https://cdn.jsdelivr.net/npm/artplayer/dist/artplayer.js"></script>
  <style>
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body, html {{ width: 100%; height: 100%; background: #070B14; color: #fff; overflow: hidden; display: flex; flex-direction: column; justify-content: center; align-items: center; }}
    .artplayer-app {{ width: 100vw; height: 100vh; max-width: 100%; max-height: 100%; background: #000; position: relative; }}
    video {{ -webkit-user-select: none; -webkit-touch-callout: none; }}
  </style>
</head>
<body>
  <div class="artplayer-app"></div>
  <script>
    const art = new Artplayer({{
      container: '.artplayer-app',
      url: "{}",
      title: "{}",
      volume: 0.8,
      pip: true,
      autoSize: true,
      screenshot: false,
      setting: true,
      loop: false,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: true,
      playsInline: true,
      theme: '#0066FF',
      lang: 'vi',
      moreVideoAttr: {{
        'playsinline': '',
        'webkit-playsinline': '',
        'controlsList': 'nodownload noplaybackrate',
      }}
    }});
  </script>
</body>
</html>"#,
        safe_title, safe_url, safe_title
    )
}
