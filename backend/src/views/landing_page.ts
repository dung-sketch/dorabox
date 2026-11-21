/**
 * Dorabox Social - Official Website & Product Landing Page
 * Human-Crafted UI/UX: Tinh tế, hiện đại, thân thiện chuẩn mạng xã hội quốc tế.
 * Tông màu nhận diện: Royal Blue (#0066FF) & Bell Gold (#FFB800).
 * Loại bỏ 100% thuật ngữ kỹ thuật nội bộ, tập trung vào trải nghiệm người dùng.
 */

export interface LandingPageConfig {
  latestVersion: string;
  buildNumber: number;
  apkUrl: string;
  changelog?: string[];
  realPosts?: any[];
  oaProfiles?: any[];
}

function escapeHtml(str: string = ''): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatMockTime(dateStr?: string): string {
  if (!dateStr) return 'Gần đây';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(1, mins)} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngày trước`;
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

export function renderLandingPage(config: LandingPageConfig): string {
  const version = config.latestVersion || '3.0.0';
  const apkUrl = config.apkUrl || 'https://doraboxcdn.zpiltk.io.vn/apk/Dorabox-v3.0.0.apk';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(apkUrl)}&color=0066FF&bgcolor=FFFFFF`;

  const doraboxProfile = (config.oaProfiles || []).find((p: any) => p.username === 'dorabox');
  const creatorsProfile = (config.oaProfiles || []).find((p: any) => p.username === 'doraboxcreators');

  const doraboxAvatar = doraboxProfile?.avatar_url || 'https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png?t=1792690365146';
  const creatorsAvatar = creatorsProfile?.avatar_url || 'https://doraboxcdn.zpiltk.io.vn/avatars/f56d69ef-e2d0-4bb4-b64b-47c1371f3d28/avatar_1793992083930.webp';

  function renderMockPost(post: any): string {
    const author = post.author || {};
    const authorName = escapeHtml(author.display_name || 'Dorabox');
    const authorUsername = escapeHtml(author.username || 'dorabox');
    const avatarUrl = author.avatar_url || (authorUsername === 'doraboxcreators' ? creatorsAvatar : doraboxAvatar);
    const isOA = author.is_oa !== false;
    const timeAgo = formatMockTime(post.created_at);
    const rawContent = (post.content || '').trim();
    const contentPreview = escapeHtml(rawContent.length > 130 ? rawContent.substring(0, 130) + '...' : rawContent);
    const mediaList = Array.isArray(post.media_urls) ? post.media_urls : [];
    const imageUrls = mediaList.filter((u: string) => !/\.(mp4|mov|webm)/i.test(u) && !/\.(mp3|m4a|wav)/i.test(u));
    const videoUrls = mediaList.filter((u: string) => /\.(mp4|mov|webm)/i.test(u));

    let mediaHtml = '';
    if (videoUrls.length > 0) {
      mediaHtml = `
        <div class="mock-post-media">
          <video src="${videoUrls[0]}" muted loop autoplay playsinline class="mock-post-video"></video>
          <div class="mock-media-tag">
            <span>🎬</span>
            <span>Video bản quyền</span>
          </div>
        </div>
      `;
    } else if (imageUrls.length > 0) {
      mediaHtml = `
        <div class="mock-post-media">
          <img src="${imageUrls[0]}" alt="${authorName}" class="mock-post-img" loading="lazy">
          <div class="mock-media-tag">
            <span>🛡️</span>
            <span>Bảo vệ quyền tác giả</span>
          </div>
        </div>
      `;
    }

    return `
      <a href="/p/${post.id}" target="_blank" class="mock-post-card">
        <div class="mock-post-author">
          <div class="mock-avatar ${isOA ? 'gold' : ''}">
            <img src="${avatarUrl}" style="width:100%; height:100%; object-fit:cover;" alt="${authorName}" onerror="this.src='https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png'">
          </div>
          <div style="min-width:0; flex:1;">
            <div style="display:flex; align-items:center; gap:4px;">
              <span class="mock-author-name">${authorName}</span>
              ${isOA ? '<span class="mock-badge-oa">★ OA</span>' : ''}
            </div>
            <span class="mock-author-tag">@${authorUsername} • ${timeAgo}</span>
          </div>
        </div>

        ${contentPreview ? `<div class="mock-post-text">${contentPreview}</div>` : ''}
        ${mediaHtml}

        <div class="mock-actions">
          <span>❤️ ${post.likes_count || 0} thích</span>
          <span>💬 ${post.comments_count || 0} bình luận</span>
          <span style="margin-left:auto; color:#0066FF; font-weight:700;">Xem chi tiết →</span>
        </div>
      </a>
    `;
  }

  const postsHtml = (config.realPosts && config.realPosts.length > 0)
    ? config.realPosts.slice(0, 2).map(renderMockPost).join('')
    : `
      ${renderMockPost({
        id: '56f5fdaf-6241-469f-a975-314387db03a1',
        content: 'Phiên bản Dorabox 3.0.0 đã sẵn sàng, chúng tôi đã cập nhật cân bằng tải hiệu xuất vượt trội với tốc độ cực nhanh cùng hiệu xuất cực mượt mà.',
        likes_count: 0,
        comments_count: 0,
        created_at: '2026-11-11T08:47:45.081111+00:00',
        author: {
          username: 'dorabox',
          display_name: 'Dorabox',
          avatar_url: doraboxAvatar,
          is_oa: true
        }
      })}
      ${renderMockPost({
        id: 'be67d217-1177-46fc-89d4-6dcddd1e9606',
        content: 'CREATOR TIPS | 4:3 – Tỷ lệ khung hình được khuyến nghị trên Dorabox mang đến không gian hiển thị rộng rãi và hài hòa nhất.',
        media_urls: ['https://doraboxcdn.zpiltk.io.vn/posts/f56d69ef-e2d0-4bb4-b64b-47c1371f3d28/1793993711519-489ea1ba7d46dac9febbb49e77e87f1b.webp'],
        likes_count: 0,
        comments_count: 0,
        created_at: '2026-11-06T19:35:15.621239+00:00',
        author: {
          username: 'doraboxcreators',
          display_name: 'Dorabox Creators',
          avatar_url: creatorsAvatar,
          is_oa: true
        }
      })}
    `;

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Dorabox - Mạng xã hội kết nối diệu kỳ, sẻ chia niềm vui</title>
  
  <meta name="description" content="Khám phá Dorabox - Không gian chia sẻ khoảnh khắc với ghi chú D-Notes 24h, bảo vệ bản quyền ảnh & video, cùng trải nghiệm kết nối bạn bè mượt mà.">
  <meta property="og:site_name" content="Dorabox">
  <meta property="og:title" content="Dorabox - Kết nối diệu kỳ, sẻ chia niềm vui!">
  <meta property="og:description" content="Tải ngay ứng dụng Dorabox phiên bản ${version} chính thức. Không gian kết nối chân thực cho bạn và bạn bè.">
  <meta property="og:image" content="https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png">
  <meta property="og:type" content="website">
  <link rel="canonical" href="https://www.zpiltk.io.vn/">

  <!-- PWA & Apple Web App Meta Tags -->
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#0066FF">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="Dorabox">
  <link rel="apple-touch-icon" href="https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png">

  <!-- Schema.org JSON-LD Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Dorabox",
    "operatingSystem": "Android, iOS, Web",
    "applicationCategory": "SocialNetworkingApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "VND"
    },
    "description": "Dorabox - Mạng xã hội kết nối diệu kỳ, sẻ chia niềm vui!",
    "downloadUrl": "${apkUrl}",
    "softwareVersion": "${version}",
    "author": {
      "@type": "Organization",
      "name": "Dorabox",
      "url": "https://www.zpiltk.io.vn"
    }
  }
  </script>

  <link rel="icon" href="https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

  <script>
    // Tự động chuyển thẳng vào Bảng tin (/app) nếu người dùng mở từ icon màn hình chính (PWA)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      window.location.replace('/app');
    }
  </script>

  <style>
    :root {
      --primary: #0066FF;
      --primary-dark: #0052CC;
      --primary-soft: #EFF6FF;
      --gold: #FFB800;
      --gold-soft: #FFFBEB;
      --bg-page: #F8FAFC;
      --bg-surface: #FFFFFF;
      --text-main: #0F172A;
      --text-sub: #475569;
      --text-muted: #94A3B8;
      --border: #E2E8F0;
      --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.04);
      --shadow-md: 0 12px 32px rgba(0, 102, 255, 0.08);
      --shadow-lg: 0 24px 60px rgba(15, 23, 42, 0.12);
    }

    * { margin:0; padding:0; box-sizing:border-box; font-family:'Plus Jakarta Sans', sans-serif; }
    h1, h2, h3, h4, .brand-text, .tag, .stat-num { font-family:'Quicksand', sans-serif; }
    
    body {
      background: var(--bg-page);
      color: var(--text-main);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    /* Top Navigation */
    header {
      position: sticky; top: 0; z-index: 100;
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
    }
    .nav-wrap {
      max-width: 1120px; margin: 0 auto; padding: 0 24px;
      height: 72px; display: flex; align-items: center; justify-content: space-between;
    }
    .brand-link { display: flex; align-items: center; gap: 12px; text-decoration: none; }
    .brand-avatar {
      width: 40px; height: 40px; border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 102, 255, 0.25);
    }
    .brand-text { font-size: 20px; font-weight: 800; color: var(--text-main); letter-spacing: -0.4px; }
    .brand-text span { color: var(--primary); }
    
    .nav-menu { display: flex; align-items: center; gap: 32px; }
    .nav-item { color: var(--text-sub); text-decoration: none; font-size: 14.5px; font-weight: 600; transition: 0.2s; }
    .nav-item:hover { color: var(--primary); }
    
    .btn-top-download {
      background: var(--primary); color: #fff; padding: 10px 22px; border-radius: 24px;
      font-size: 14px; font-weight: 700; text-decoration: none; transition: 0.2s;
      box-shadow: 0 4px 16px rgba(0, 102, 255, 0.25);
    }
    .btn-top-download:hover { background: var(--primary-dark); transform: translateY(-1px); }

    /* Hero Section */
    .hero {
      padding: 70px 24px 60px 24px;
      max-width: 1120px; margin: 0 auto;
      display: grid; grid-template-columns: 1.15fr 0.85fr;
      align-items: center; gap: 60px;
    }
    .hero-content { max-width: 580px; }
    .pill-badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: var(--primary-soft); color: var(--primary);
      padding: 6px 16px; border-radius: 30px; font-size: 13px; font-weight: 700;
      margin-bottom: 24px; border: 1px solid rgba(0, 102, 255, 0.15);
    }
    .pill-badge .dot {
      width: 8px; height: 8px; border-radius: 50%; background: var(--primary);
      box-shadow: 0 0 8px var(--primary);
    }
    
    .hero h1 {
      font-size: 46px; font-weight: 800; line-height: 1.22;
      color: var(--text-main); margin-bottom: 20px; letter-spacing: -0.8px;
    }
    .hero h1 em {
      font-style: normal; color: var(--primary);
      position: relative; display: inline-block;
    }
    .hero p {
      font-size: 17px; color: var(--text-sub); line-height: 1.65; margin-bottom: 36px;
    }

    .cta-row {
      display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 40px;
    }
    .btn-main-download {
      display: inline-flex; align-items: center; gap: 10px;
      background: var(--primary); color: #fff; padding: 15px 30px; border-radius: 18px;
      font-size: 15.5px; font-weight: 700; text-decoration: none;
      box-shadow: 0 10px 26px rgba(0, 102, 255, 0.3); transition: 0.25s;
    }
    .btn-main-download:hover { background: var(--primary-dark); transform: translateY(-2px); }
    .btn-main-download svg { width: 20px; height: 20px; fill: currentColor; }

    .btn-ios-guide {
      display: inline-flex; align-items: center; gap: 8px;
      background: var(--bg-surface); color: var(--text-main); border: 1px solid var(--border);
      padding: 15px 24px; border-radius: 18px; font-size: 15px; font-weight: 600;
      cursor: pointer; transition: 0.2s; box-shadow: var(--shadow-sm);
    }
    .btn-ios-guide:hover { border-color: var(--primary); color: var(--primary); }
    .btn-ios-guide svg { width: 18px; height: 18px; fill: currentColor; }

    /* QR Scan Card */
    .qr-card {
      display: inline-flex; align-items: center; gap: 18px;
      background: var(--bg-surface); border: 1px solid var(--border);
      border-radius: 20px; padding: 16px 20px; box-shadow: var(--shadow-sm);
    }
    .qr-code-img { width: 84px; height: 84px; border-radius: 10px; background: #fff; }
    .qr-text h4 { font-size: 14.5px; font-weight: 700; color: var(--text-main); margin-bottom: 3px; }
    .qr-text p { font-size: 12.5px; color: var(--text-muted); margin: 0; line-height: 1.4; }

    /* Phone Device Mockup - Light Mode Premium */
    .mockup-wrap { position: relative; display: flex; justify-content: center; }
    .phone-frame {
      width: 326px; background: #FFFFFF;
      border: 6px solid #CBD5E1; border-radius: 48px; padding: 6px;
      box-shadow: 0 30px 70px -10px rgba(0, 102, 255, 0.15), 0 15px 35px rgba(15, 23, 42, 0.08);
      position: relative;
    }
    .phone-screen {
      background: #F8FAFC; border-radius: 40px; overflow: hidden;
      display: flex; flex-direction: column; color: #0F172A; position: relative;
      border: 1px solid rgba(0, 0, 0, 0.05);
    }
    .phone-status-bar {
      height: 38px; padding: 10px 20px 0 20px; display: flex; justify-content: space-between; align-items: center;
      font-size: 11px; font-weight: 700; color: #0F172A;
    }
    .dynamic-island {
      width: 86px; height: 18px; background: #0F172A; border-radius: 12px; margin: 0 auto;
    }
    .phone-app-content { padding: 8px 14px 18px 14px; }
    .app-top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; padding: 0 4px; }
    .app-logo { font-size: 17px; font-weight: 800; color: #0066FF; font-family:'Quicksand'; letter-spacing: -0.3px; }
    .app-icons { display: flex; gap: 10px; color: #64748B; font-size: 13px; }

    /* D-Notes (Light Mode) */
    .d-notes-preview {
      display: flex; gap: 18px; margin-bottom: 16px; padding: 0 6px;
    }
    .note-avatar-item { text-align: center; font-size: 11px; font-weight: 700; color: #475569; position: relative; }
    .note-avatar-box {
      width: 48px; height: 48px; border-radius: 50%; padding: 2px;
      background: linear-gradient(135deg, #0066FF, #38BDF8);
      display: flex; align-items: center; justify-content: center; margin: 0 auto 4px auto;
    }
    .note-avatar-box.gold {
      background: linear-gradient(135deg, #FFB800, #F59E0B);
    }
    .note-avatar-inner {
      width: 100%; height: 100%; border-radius: 50%; background: #FFFFFF;
      display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 15px; color: #0066FF;
      overflow: hidden;
    }
    .note-avatar-inner.gold { color: #D97706; }
    .note-bubble {
      position: absolute; top: -11px; left: 50%; transform: translateX(-50%);
      background: #FFFFFF; color: #0F172A; font-size: 9px; font-weight: 700; padding: 3px 8px; border-radius: 12px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.1); border: 1px solid #E2E8F0; white-space: nowrap; z-index: 5;
    }

    /* Mock Post Cards (Light Mode) */
    .mock-post-card {
      background: #FFFFFF; border-radius: 18px; padding: 13px; border: 1px solid #E2E8F0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.03); margin-bottom: 10px; text-align: left;
      text-decoration: none; color: inherit; display: block; transition: transform 0.2s, box-shadow 0.2s;
    }
    .mock-post-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 18px rgba(0, 102, 255, 0.08);
    }
    .mock-post-author { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .mock-avatar { width: 34px; height: 34px; border-radius: 50%; background: #EFF6FF; border: 1px solid #BFDBFE; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; color: #0066FF; overflow:hidden; flex-shrink:0; }
    .mock-avatar.gold { background: #FFFBEB; border-color: #FDE68A; color: #D97706; }
    .mock-author-name { font-size: 12.5px; font-weight: 800; color: #0F172A; }
    .mock-author-tag { font-size: 10px; color: #94A3B8; }
    .mock-badge-oa { font-size: 9px; font-weight: 700; background: #FFFBEB; color: #D97706; border: 1px solid rgba(217,119,6,0.25); padding: 1px 6px; border-radius: 8px; margin-left: 4px; }
    .mock-post-text { font-size: 11.5px; color: #334155; margin-bottom: 9px; line-height: 1.5; word-break: break-word; }
    .mock-post-media {
      width: 100%; height: 135px; border-radius: 12px;
      position: relative; overflow: hidden; margin-bottom: 9px; background: #0F172A;
    }
    .mock-post-img, .mock-post-video {
      width: 100%; height: 100%; object-fit: cover; display: block;
    }
    .mock-media-tag {
      position: absolute; bottom: 8px; left: 8px;
      background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(8px);
      padding: 3px 8px; border-radius: 8px; font-size: 9px; font-weight: 600;
      display: flex; align-items: center; gap: 4px; color: #FFFFFF;
    }
    .mock-actions { display: flex; align-items: center; gap: 14px; font-size: 10.5px; color: #64748B; font-weight: 600; }

    /* Features Section */
    .section-features {
      padding: 90px 24px; background: #FFFFFF; border-top: 1px solid var(--border);
    }
    .max-wrap { max-width: 1120px; margin: 0 auto; }
    .section-header { text-align: center; max-width: 600px; margin: 0 auto 60px auto; }
    .section-tag { font-size: 13px; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
    .section-title { font-size: 34px; font-weight: 800; color: var(--text-main); margin-bottom: 14px; letter-spacing: -0.5px; }
    .section-desc { font-size: 16px; color: var(--text-sub); }

    .grid-features {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 28px;
    }
    .card-feature {
      background: var(--bg-page); border: 1px solid var(--border); border-radius: 22px;
      padding: 32px 24px; transition: 0.3s;
    }
    .card-feature:hover {
      background: #FFFFFF; transform: translateY(-4px); box-shadow: var(--shadow-md);
      border-color: rgba(0, 102, 255, 0.2);
    }
    .icon-box {
      width: 52px; height: 52px; border-radius: 16px;
      display: flex; align-items: center; justify-content: center; margin-bottom: 20px;
    }
    .icon-blue { background: #EFF6FF; color: var(--primary); }
    .icon-gold { background: #FFFBEB; color: var(--gold); }
    .icon-emerald { background: #ECFDF5; color: #10B981; }
    .icon-purple { background: #FAF5FF; color: #8B5CF6; }
    .icon-box svg { width: 24px; height: 24px; fill: currentColor; }

    .card-feature h3 { font-size: 18px; font-weight: 800; color: var(--text-main); margin-bottom: 10px; }
    .card-feature p { font-size: 14.5px; color: var(--text-sub); line-height: 1.6; }

    /* Simple Install Steps */
    .section-steps { padding: 90px 24px; max-width: 1120px; margin: 0 auto; }
    .steps-wrap {
      background: var(--bg-surface); border: 1px solid var(--border); border-radius: 28px;
      padding: 50px 40px; box-shadow: var(--shadow-sm);
    }
    .steps-title { text-align: center; font-size: 28px; font-weight: 800; margin-bottom: 40px; }
    .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
    .step-item { position: relative; }
    .step-num {
      width: 36px; height: 36px; border-radius: 12px; background: var(--primary); color: #fff;
      font-size: 15px; font-weight: 800; display: flex; align-items: center; justify-content: center;
      margin-bottom: 16px;
    }
    .step-item h4 { font-size: 17px; font-weight: 800; color: var(--text-main); margin-bottom: 8px; }
    .step-item p { font-size: 14px; color: var(--text-sub); line-height: 1.6; }

    /* Footer */
    footer {
      background: #FFFFFF; border-top: 1px solid var(--border);
      padding: 48px 24px 36px 24px;
    }
    .footer-inner {
      max-width: 1120px; margin: 0 auto;
      display: flex; flex-direction: column; align-items: center; gap: 20px;
    }
    .footer-links { display: flex; gap: 28px; flex-wrap: wrap; justify-content: center; }
    .footer-links a { color: var(--text-sub); text-decoration: none; font-size: 14px; font-weight: 600; transition: 0.2s; }
    .footer-links a:hover { color: var(--primary); }
    .footer-copy { font-size: 13px; color: var(--text-muted); text-align: center; }

    /* iOS Modal */
    .modal-backdrop {
      position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(8px); display: none; align-items: center; justify-content: center;
      z-index: 1000; padding: 20px;
    }
    .modal-card {
      background: #FFFFFF; border-radius: 24px; max-width: 440px; width: 100%;
      padding: 32px 28px; text-align: center; box-shadow: var(--shadow-lg);
    }
    .modal-icon {
      width: 54px; height: 54px; border-radius: 50%; background: #F1F5F9;
      display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto;
    }
    .modal-icon svg { width: 28px; height: 28px; fill: #0F172A; }
    .modal-card h3 { font-size: 20px; font-weight: 800; color: var(--text-main); margin-bottom: 10px; }
    .modal-card p { font-size: 14.5px; color: var(--text-sub); line-height: 1.6; margin-bottom: 24px; }
    .btn-modal-close {
      background: var(--primary); color: #fff; border: none; padding: 12px 28px;
      border-radius: 14px; font-size: 14px; font-weight: 700; cursor: pointer; transition: 0.2s;
    }
    .btn-modal-close:hover { background: var(--primary-dark); }

    @media (max-width: 900px) {
      .hero { grid-template-columns: 1fr; text-align: center; padding: 50px 20px; }
      .hero-content { max-width: 100%; }
      .cta-row { justify-content: center; }
      .qr-card { margin: 0 auto; }
      .mockup-wrap { margin-top: 20px; }
      .steps-grid { grid-template-columns: 1fr; gap: 24px; }
      .nav-menu { display: none; }
    }
  </style>
</head>
<body>
  <!-- Navigation -->
  <header>
    <div class="nav-wrap">
      <a href="/" class="brand-link">
        <img src="https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png" alt="Dorabox" class="brand-avatar">
        <span class="brand-text">Dorabox<span>.</span></span>
      </a>

      <nav class="nav-menu">
        <a href="#features" class="nav-item">Khám phá</a>
        <a href="#installation" class="nav-item">Cài đặt</a>
        <a href="/privacy" class="nav-item">Bảo mật</a>
        <a href="/terms" class="nav-item">Điều khoản</a>
      </nav>

      <div style="display:flex; align-items:center; gap:12px;">
        <a href="/app" class="nav-item" style="color:var(--primary); font-weight:700; text-decoration:none;">Lướt Web App</a>
        <a href="${apkUrl}" class="btn-top-download">Tải ứng dụng</a>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <main>
    <section class="hero">
      <div class="hero-content">
        <div class="pill-badge">
          <span class="dot"></span>
          <span>Phiên bản ${version} chính thức</span>
        </div>

        <h1>Kết nối diệu kỳ,<br>sẻ chia niềm vui <em>cùng bạn bè</em></h1>
        
        <p>
          Dorabox là mạng xã hội thế hệ mới mang đến không gian kết nối chân thực:
          ghi chú suy nghĩ D-Notes 24h, bảo vệ trọn vẹn bản quyền hình ảnh & video,
          và trải nghiệm mượt mà không quảng cáo rác.
        </p>

        <div class="cta-row">
          <a href="${apkUrl}" class="btn-main-download">
            <svg viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>
            <span>Tải về cho Android (.APK)</span>
          </a>

          <button class="btn-ios-guide" onclick="openIosModal()">
            <svg viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.72-.93 2.74 1.01.08 2.03-.49 2.64-1.24z"/></svg>
            <span>Dành cho iOS (iPhone)</span>
          </button>
        </div>

        <div class="qr-card">
          <img src="${qrCodeUrl}" alt="Quét mã QR để tải ứng dụng" class="qr-code-img">
          <div class="qr-text">
            <h4>Quét mã tải nhanh</h4>
            <p>Mở camera điện thoại quét mã để tải tệp cài đặt trực tiếp về máy.</p>
          </div>
        </div>
      </div>

      <!-- Smartphone Mockup - Light Mode Demo -->
      <div class="mockup-wrap">
        <div class="phone-frame">
          <div class="phone-screen">
            <!-- Dynamic Island & Status Bar -->
            <div class="phone-status-bar">
              <span>9:41</span>
              <div class="dynamic-island"></div>
              <span>5G</span>
            </div>
            
            <div class="phone-app-content">
              <!-- App Bar -->
              <div class="app-top-bar">
                <span class="app-logo">Dorabox ✨</span>
                <div class="app-icons">
                  <span>🔍</span>
                  <span>🔔</span>
                </div>
              </div>

              <!-- D-Notes Preview (Chỉ 2 tài khoản: Dorabox & Dorabox Creators) -->
              <div class="d-notes-preview">
                <!-- 1. Dorabox -->
                <div class="note-avatar-item">
                  <div class="note-bubble">Dorabox 3.0 🚀</div>
                  <div class="note-avatar-box">
                    <div class="note-avatar-inner">
                      <img src="${doraboxAvatar}" style="width:100%; height:100%; object-fit:cover;" alt="Dorabox" onerror="this.src='https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png'">
                    </div>
                  </div>
                  <span>Dorabox</span>
                </div>

                <!-- 2. Dorabox Creators -->
                <div class="note-avatar-item">
                  <div class="note-bubble">Creator Tips 💡</div>
                  <div class="note-avatar-box gold">
                    <div class="note-avatar-inner gold">
                      <img src="${creatorsAvatar}" style="width:100%; height:100%; object-fit:cover;" alt="Dorabox Creators" onerror="this.src='https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png'">
                    </div>
                  </div>
                  <span>Creators</span>
                </div>
              </div>

              <!-- Real Live Posts Showcase -->
              <div class="mock-posts-container">
                ${postsHtml}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Core Features Section -->
    <section id="features" class="section-features">
      <div class="max-wrap">
        <div class="section-header">
          <div class="section-tag">Trải nghiệm khác biệt</div>
          <h2 class="section-title">Những tính năng tạo nên Dorabox</h2>
          <p class="section-desc">Được thiết kế tinh tế nhằm mang đến không gian kết nối chân thành, văn minh và an toàn.</p>
        </div>

        <div class="grid-features">
          <div class="card-feature">
            <div class="icon-box icon-blue">
              <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
            </div>
            <h3>Quyền Tác Giả Độc Quyền</h3>
            <p>Bạn hoàn toàn làm chủ nội dung của mình. Linh hoạt cho phép lưu ảnh nhưng bảo vệ video không bị tải lậu.</p>
          </div>

          <div class="card-feature">
            <div class="icon-box icon-gold">
              <svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
            </div>
            <h3>D-Notes 24 Giờ & Âm Nhạc</h3>
            <p>Bong bóng suy nghĩ bồng bềnh cùng giai điệu yêu thích giúp bạn dễ dàng mở đầu câu chuyện với bạn bè.</p>
          </div>

          <div class="card-feature">
            <div class="icon-box icon-emerald">
              <svg viewBox="0 0 24 24"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>
            </div>
            <h3>Trang Doanh Nghiệp (OA)</h3>
            <p>Hồ sơ uy tín dành riêng cho tổ chức và nhà sáng tạo nội dung, giúp tiếp cận cộng đồng không giới hạn.</p>
          </div>

          <div class="card-feature">
            <div class="icon-box icon-purple">
              <svg viewBox="0 0 24 24"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>
            </div>
            <h3>Mượt Mà & Riêng Tư</h3>
            <p>Cuộn lướt nhẹ nhàng với tốc độ khung hình 120 FPS. Dữ liệu được mã hóa an toàn, tôn trọng tối đa quyền riêng tư.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Installation Steps -->
    <section id="installation" class="section-steps">
      <div class="steps-wrap">
        <h3 class="steps-title">Cài đặt ứng dụng chỉ trong 3 bước</h3>
        <div class="steps-grid">
          <div class="step-item">
            <div class="step-num">1</div>
            <h4>Tải tệp cài đặt</h4>
            <p>Nhấn nút "Tải về cho Android" để tải tệp cài đặt chính thức <code>Dorabox.apk</code>.</p>
          </div>
          <div class="step-item">
            <div class="step-num">2</div>
            <h4>Xác nhận cài đặt</h4>
            <p>Chọn <em>"Cho phép từ nguồn này"</em> nếu trình duyệt của bạn hiển thị lời nhắc cài đặt.</p>
          </div>
          <div class="step-item">
            <div class="step-num">3</div>
            <h4>Mở và kết nối</h4>
            <p>Mở ứng dụng Dorabox, đăng nhập tài khoản và bắt đầu kết nối cùng bạn bè.</p>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer>
    <div class="footer-inner">
      <div class="footer-links">
        <a href="#features">Khám phá</a>
        <a href="${apkUrl}">Tải ứng dụng</a>
        <a href="/privacy">Chính sách Quyền riêng tư</a>
        <a href="/terms">Điều khoản Dịch vụ</a>
      </div>
      <div class="footer-copy">
        © 2026 Dorabox Social Platform. Kết nối diệu kỳ, sẻ chia niềm vui.
      </div>
    </div>
  </footer>

  <!-- iOS Modal Guide -->
  <div id="iosModal" class="modal-backdrop" onclick="closeIosModal(event)">
    <div class="modal-card">
      <div class="modal-icon">
        <svg viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.72-.93 2.74 1.01.08 2.03-.49 2.64-1.24z"/></svg>
      </div>
      <h3>Trải nghiệm Dorabox trên iOS</h3>
      <p>
        Trong khi bản cập nhật App Store đang được hoàn thiện, bạn có thể mở trang web bằng Safari trên iPhone và chọn <strong>"Thêm vào Màn hình chính" (Add to Home Screen)</strong> để sử dụng thuận tiện như ứng dụng cài đặt.
      </p>
      <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
        <a href="/app" class="btn-modal-close" style="display:inline-block; text-decoration:none;">Vào lướt Web App ngay</a>
        <button class="btn-modal-close" onclick="closeIosModalDirect()" style="background:#F1F5F9; color:#0F172A;">Đóng</button>
      </div>
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

    // Register PWA Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').catch(function() {});
      });
    }
  </script>
</body>
</html>`;
}
