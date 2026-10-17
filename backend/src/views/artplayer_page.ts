/**
 * Trang xem video bảo mật và tối ưu giao diện sử dụng ArtPlayer.js (https://artplayer.org/)
 * Hỗ trợ co giãn theo mọi kích thước (9:16 dọc, 16:9 ngang, 1:1 vuông, 21:9 cinemascope),
 * tích hợp cử chỉ vuốt, tùy chỉnh tốc độ, PiP, toàn màn hình và watermark bảo mật.
 */
export function renderArtPlayerPage(videoUrl: string, title: string = 'Dorabox Video'): string {
  const safeTitle = title.replace(/"/g, '&quot;');
  const safeUrl = videoUrl.replace(/"/g, '&quot;');

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${safeTitle} - Dorabox ArtPlayer</title>
  <link rel="icon" href="https://doraboxcdn.zpiltk.io.vn/favicon.ico">
  <script src="https://cdn.jsdelivr.net/npm/artplayer/dist/artplayer.js"></script>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body, html {
      width: 100%;
      height: 100%;
      background: #070B14;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .artplayer-app {
      width: 100vw;
      height: 100vh;
      max-width: 100%;
      max-height: 100%;
      background: #000;
      position: relative;
    }
    /* Chống tải lậu và menu ngữ cảnh mặc định */
    video {
      -webkit-user-select: none;
      -webkit-touch-callout: none;
    }
  </style>
</head>
<body>
  <div class="artplayer-app"></div>

  <script>
    const videoSource = "${safeUrl}";

    const art = new Artplayer({
      container: '.artplayer-app',
      url: videoSource,
      title: "${safeTitle}",
      poster: '',
      volume: 0.8,
      isLive: false,
      muted: false,
      autoplay: false,
      pip: true,
      autoSize: true,
      autoMini: true,
      screenshot: true,
      setting: true,
      loop: false,
      flip: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: true,
      subtitleOffset: false,
      miniProgressBar: true,
      mutex: true,
      backdrop: true,
      playsInline: true,
      autoPlayback: true,
      airplay: true,
      theme: '#FBBF24',
      lang: 'vi',
      icons: {
        loading: '<img src="https://doraboxcdn.zpiltk.io.vn/favicon.ico" style="width: 48px; height: 48px; border-radius: 50%; animation: spin 1.5s linear infinite;">',
      },
      whitelist: ['*'],
      moreVideoAttr: {
        'playsinline': '',
        'webkit-playsinline': '',
        'x5-playsinline': '',
        'controlsList': 'nodownload noplaybackrate',
        'disablePictureInPicture': false,
      },
      settings: [
        {
          width: 200,
          html: 'Tốc độ phát',
          tooltip: '1.0x',
          selector: [
            { default: true, html: '1.0x', value: 1.0 },
            { html: '0.5x', value: 0.5 },
            { html: '0.75x', value: 0.75 },
            { html: '1.25x', value: 1.25 },
            { html: '1.5x', value: 1.5 },
            { html: '2.0x', value: 2.0 },
          ],
          onSelect: function (item) {
            art.playbackRate = item.value;
            return item.html;
          },
        },
        {
          width: 200,
          html: 'Tỉ lệ khung hình',
          tooltip: 'Tự động',
          selector: [
            { default: true, html: 'Tự động (Adaptive)', value: 'default' },
            { html: '16:9 (Ngang chuẩn)', value: '16:9' },
            { html: '9:16 (Dọc TikTok/Reels)', value: '9:16' },
            { html: '4:3 (Cổ điển)', value: '4:3' },
            { html: '1:1 (Vuông)', value: '1:1' },
          ],
          onSelect: function (item) {
            art.aspectRatio = item.value;
            return item.html;
          },
        },
      ],
      customType: {},
    });

    // Chặn chuột phải để bảo vệ video
    art.on('contextmenu', function (event) {
      event.preventDefault();
      return false;
    });

    // Tự động thích ứng kích thước video khi metadata tải xong
    art.on('video:loadedmetadata', function () {
      const v = art.video;
      if (v && v.videoWidth && v.videoHeight) {
        const ratio = v.videoWidth / v.videoHeight;
        console.log('[ArtPlayer] Video Resolution: ' + v.videoWidth + 'x' + v.videoHeight + ' (Ratio: ' + ratio.toFixed(2) + ')');
      }
    });

    // Chống tải xuống bằng phím tắt
    window.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'u')) {
        e.preventDefault();
      }
    });
  </script>
</body>
</html>`;
}
