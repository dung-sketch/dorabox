use crate::config::AppConfig;
use crate::services::agora::build_rtc_token_uid;
use crate::services::fcm::{FcmService, SendFcmRequest};
use crate::services::r2::{delete_files_from_r2, generate_upload_url, extract_r2_key};
use crate::services::supabase::SupabaseService;
use crate::views::artplayer::render_artplayer;
use crate::views::landing::render_landing_page;
use crate::views::legal::{render_privacy_policy, render_terms_of_service};
use crate::views::post_preview::render_post_preview;
use axum::extract::{Path, Query, State};
use axum::http::{header, HeaderMap, StatusCode};
use axum::response::{Html, IntoResponse};
use axum::Json;
use reqwest::Client;
use serde::Deserialize;
use serde_json::{json, Value};
use std::sync::Arc;

#[derive(Clone)]
pub struct AppState {
    pub config: AppConfig,
    pub http_client: Client,
    pub supabase: SupabaseService,
    pub fcm: FcmService,
}

// ----------------- Public Landing, Legal & Media Views -----------------

pub async fn landing_handler(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    let (posts, profiles) = state.supabase.get_landing_showcase().await;
    let html = render_landing_page(
        "https://doraboxcdn.zpiltk.io.vn/apk/Dorabox-v3.0.0.apk",
        "3.0.0",
        &posts,
        &profiles,
    );

    (
        [
            (header::CONTENT_TYPE, "text/html; charset=utf-8"),
            (header::CACHE_CONTROL, "public, s-maxage=30, stale-while-revalidate=120"),
        ],
        Html(html),
    )
}

pub async fn post_preview_handler(
    State(state): State<Arc<AppState>>,
    Path(post_id): Path<String>,
    headers: HeaderMap,
) -> impl IntoResponse {
    let host = headers
        .get(header::HOST)
        .and_then(|h| h.to_str().ok())
        .unwrap_or("www.zpiltk.io.vn");

    match state.supabase.get_post_by_id(&post_id).await {
        Ok(Some(post)) => {
            let author_obj = post.author.as_ref();
            let is_oa = author_obj
                .and_then(|a| a.get("is_oa"))
                .and_then(|v| v.as_bool())
                .unwrap_or(false);
            let is_public = post.visibility.as_deref().unwrap_or("public") == "public" || is_oa;

            let html = render_post_preview(Some(&post), host, !is_public);
            (
                StatusCode::OK,
                [
                    (header::CONTENT_TYPE, "text/html; charset=utf-8"),
                    (
                        header::CACHE_CONTROL,
                        if is_public {
                            "public, s-maxage=30, stale-while-revalidate=120"
                        } else {
                            "private, no-cache"
                        },
                    ),
                ],
                Html(html),
            )
        }
        _ => {
            let html = render_post_preview(None, host, false);
            (
                StatusCode::NOT_FOUND,
                [
                    (header::CONTENT_TYPE, "text/html; charset=utf-8"),
                    (header::CACHE_CONTROL, "no-cache"),
                ],
                Html(html),
            )
        }
    }
}

pub async fn watch_handler(Query(params): Query<Value>) -> impl IntoResponse {
    let url = params.get("url").and_then(|v| v.as_str()).unwrap_or("");
    let title = params.get("title").and_then(|v| v.as_str()).unwrap_or("Dorabox Video");
    Html(render_artplayer(url, title))
}

pub async fn privacy_handler() -> impl IntoResponse {
    (
        [
            (header::CONTENT_TYPE, "text/html; charset=utf-8"),
            (header::CACHE_CONTROL, "public, s-maxage=3600, stale-while-revalidate=86400"),
        ],
        Html(render_privacy_policy()),
    )
}

pub async fn terms_handler() -> impl IntoResponse {
    (
        [
            (header::CONTENT_TYPE, "text/html; charset=utf-8"),
            (header::CACHE_CONTROL, "public, s-maxage=3600, stale-while-revalidate=86400"),
        ],
        Html(render_terms_of_service()),
    )
}

pub async fn sitemap_handler(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    let posts = state.supabase.get_sitemap_posts().await;
    let mut post_urls = String::new();
    for p in posts {
        if let Some(id) = p.get("id").and_then(|v| v.as_str()) {
            let created_at = p
                .get("created_at")
                .and_then(|v| v.as_str())
                .unwrap_or("2026-11-01")
                .split('T')
                .next()
                .unwrap_or("2026-11-01");
            post_urls.push_str(&format!(
                r#"
  <url>
    <loc>https://www.zpiltk.io.vn/p/{}</loc>
    <lastmod>{}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>"#,
                id, created_at
            ));
        }
    }

    let xml = format!(
        r#"<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.zpiltk.io.vn/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.zpiltk.io.vn/privacy</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://www.zpiltk.io.vn/terms</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>{}
</urlset>"#,
        post_urls
    );

    (
        [
            (header::CONTENT_TYPE, "application/xml; charset=utf-8"),
            (header::CACHE_CONTROL, "public, s-maxage=3600, stale-while-revalidate=86400"),
        ],
        xml,
    )
}

pub async fn robots_handler() -> impl IntoResponse {
    (
        [
            (header::CONTENT_TYPE, "text/plain; charset=utf-8"),
            (header::CACHE_CONTROL, "public, s-maxage=86400"),
        ],
        r#"User-agent: *
Allow: /
Allow: /p/
Allow: /post/
Allow: /privacy
Allow: /terms
Disallow: /api/
Disallow: /watch

Sitemap: https://www.zpiltk.io.vn/sitemap.xml
"#,
    )
}

pub async fn manifest_handler() -> impl IntoResponse {
    (
        [
            (header::CONTENT_TYPE, "application/manifest+json; charset=utf-8"),
            (header::CACHE_CONTROL, "public, s-maxage=86400"),
        ],
        Json(json!({
            "name": "Dorabox Social",
            "short_name": "Dorabox",
            "description": "Mạng xã hội kết nối diệu kỳ, sẻ chia niềm vui!",
            "start_url": "/",
            "id": "/",
            "display": "standalone",
            "orientation": "portrait",
            "background_color": "#FFFFFF",
            "theme_color": "#0066FF",
            "icons": [
                {
                    "src": "https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png",
                    "sizes": "192x192",
                    "type": "image/png",
                    "purpose": "any maskable"
                },
                {
                    "src": "https://doraboxcdn.zpiltk.io.vn/avatars/f1b9d3fc-6a20-4e56-8de5-7477c0c1a864/avatar.png",
                    "sizes": "512x512",
                    "type": "image/png",
                    "purpose": "any maskable"
                }
            ]
        })),
    )
}

// ----------------- Core API Endpoints -----------------

pub async fn health_handler() -> impl IntoResponse {
    Json(json!({
        "platform": "Dorabox Rust API",
        "status": "online",
        "version": "3.0.0",
        "engine": "Axum / Tokio / Rust 2024",
    }))
}

pub async fn app_version_handler() -> impl IntoResponse {
    (
        [(header::CACHE_CONTROL, "public, s-maxage=60, stale-while-revalidate=300")],
        Json(json!({
            "latest_version": "3.0.0",
            "build_number": 37,
            "feed_shuffle_enabled": false,
            "apk_url": "https://doraboxcdn.zpiltk.io.vn/apk/Dorabox-v3.0.0.apk",
            "ios_url": "https://dorabox.app/ios",
            "force_update": false,
            "changelog": [
                "🚀 Nâng cấp Dorabox lên thế hệ 3.0.0 với Package Name chính thức com.tinelfi.dorabox.",
                "⚡ Chuyển đổi toàn diện Backend sang Rust siêu tốc, an toàn bộ nhớ và chịu tải tối đa.",
                "🔔 Sửa triệt để lỗi thông báo đẩy FCM: Tự động phát chuông và hiển thị thông báo tức thì.",
                "✨ Giữ nguyên vị trí cuộn 120 FPS khi tương tác trên bảng tin.",
                "🌐 Đồng bộ toàn diện hệ thống máy chủ zpiltk.io.vn và Firebase mcn-tinelfi-dorabox."
            ]
        })),
    )
}

pub async fn maintenance_handler() -> impl IntoResponse {
    Json(json!({
        "success": true,
        "maintenance": {
            "is_maintenance": false,
            "message": ""
        }
    }))
}

pub async fn feed_config_handler() -> impl IntoResponse {
    Json(json!({
        "success": true,
        "shuffle_enabled": false
    }))
}

#[derive(Deserialize)]
pub struct AgoraTokenQuery {
    pub channel: Option<String>,
    pub uid: Option<u32>,
}

pub async fn agora_token_handler(
    State(state): State<Arc<AppState>>,
    Query(query): Query<AgoraTokenQuery>,
) -> impl IntoResponse {
    let channel_name = query.channel.as_deref().unwrap_or("").trim();
    if channel_name.is_empty() {
        return (
            StatusCode::BAD_REQUEST,
            Json(json!({ "success": false, "error": "Thiếu tham số channel" })),
        );
    }

    let uid = query.uid.unwrap_or(0);
    let expire_seconds = 86400; // 24 hours

    match build_rtc_token_uid(
        &state.config.agora_app_id,
        &state.config.agora_app_certificate,
        channel_name,
        uid,
        expire_seconds,
    ) {
        Ok(token) => (
            StatusCode::OK,
            Json(json!({
                "success": true,
                "token": token,
                "appId": state.config.agora_app_id,
                "channelName": channel_name,
                "uid": uid,
                "expiresIn": expire_seconds
            })),
        ),
        Err(err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({ "success": false, "error": err })),
        ),
    }
}

#[derive(Deserialize)]
pub struct PresignedUrlRequest {
    #[serde(rename = "userId")]
    pub user_id: Option<String>,
    pub folder: Option<String>,
    #[serde(rename = "contentType")]
    pub content_type: Option<String>,
    #[serde(rename = "fileExt")]
    pub file_ext: Option<String>,
}

pub async fn presigned_url_handler(
    State(state): State<Arc<AppState>>,
    Json(body): Json<PresignedUrlRequest>,
) -> impl IntoResponse {
    let user_id = match body.user_id {
        Some(ref u) if !u.trim().is_empty() => u.trim(),
        _ => {
            return (
                StatusCode::BAD_REQUEST,
                Json(json!({ "error": "userId is required" })),
            );
        }
    };

    let folder = body.folder.as_deref().unwrap_or("posts");
    let content_type = body.content_type.as_deref().unwrap_or("image/webp");
    let file_ext = body.file_ext.as_deref();

    let res = generate_upload_url(&state.config, user_id, folder, content_type, file_ext);

    (
        StatusCode::OK,
        Json(json!({
            "success": true,
            "data": res
        })),
    )
}

#[derive(Deserialize)]
pub struct DeleteBatchRequest {
    pub urls: Option<Vec<String>>,
}

pub async fn delete_batch_handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Json(body): Json<DeleteBatchRequest>,
) -> impl IntoResponse {
    let auth_header = headers.get(header::AUTHORIZATION).and_then(|h| h.to_str().ok());
    let token = auth_header.and_then(|h| h.strip_prefix("Bearer ").or_else(|| h.strip_prefix("bearer "))).unwrap_or("");
    if token.is_empty() {
        return (StatusCode::UNAUTHORIZED, Json(json!({ "error": "Missing Bearer token" })));
    }

    let user = match state.supabase.get_user_from_token(token).await {
        Ok(u) => u,
        Err(_) => return (StatusCode::UNAUTHORIZED, Json(json!({ "error": "Phiên đăng nhập không hợp lệ" }))),
    };

    let urls = body.urls.unwrap_or_default();
    if urls.is_empty() {
        return (StatusCode::OK, Json(json!({ "success": true, "deleted": [], "count": 0 })));
    }

    // Security check: only allow user to delete files under their user_id
    let mut target_urls = Vec::new();
    for u in urls {
        if let Some(key) = extract_r2_key(&u, &state.config.r2_bucket_name) {
            if key.contains(&format!("/{}/", user.id)) || key.starts_with(&format!("{}/", user.id)) {
                target_urls.push(u);
            }
        }
    }

    if target_urls.is_empty() {
        return (
            StatusCode::OK,
            Json(json!({ "success": true, "deleted": [], "note": "Không có tệp hợp lệ thuộc quyền sở hữu" })),
        );
    }

    let (deleted, errors) = delete_files_from_r2(&state.http_client, &state.config, &target_urls).await;
    (
        StatusCode::OK,
        Json(json!({
            "success": true,
            "deleted": deleted,
            "errors": errors,
            "count": deleted.len()
        })),
    )
}

pub async fn delete_post_handler(
    State(state): State<Arc<AppState>>,
    Path(post_id): Path<String>,
    headers: HeaderMap,
) -> impl IntoResponse {
    let auth_header = headers.get(header::AUTHORIZATION).and_then(|h| h.to_str().ok());
    let token = auth_header.and_then(|h| h.strip_prefix("Bearer ").or_else(|| h.strip_prefix("bearer "))).unwrap_or("");
    if token.is_empty() {
        return (StatusCode::UNAUTHORIZED, Json(json!({ "error": "Missing Bearer token" })));
    }

    let user = match state.supabase.get_user_from_token(token).await {
        Ok(u) => u,
        Err(_) => return (StatusCode::UNAUTHORIZED, Json(json!({ "error": "Phiên đăng nhập không hợp lệ" }))),
    };

    let post = match state.supabase.get_post_by_id(&post_id).await {
        Ok(Some(p)) => p,
        _ => return (StatusCode::NOT_FOUND, Json(json!({ "error": "Không tìm thấy bài viết" }))),
    };

    let author_id = post.author.as_ref().and_then(|a| a.get("id")).and_then(|v| v.as_str()).unwrap_or("");
    if author_id != user.id {
        return (
            StatusCode::FORBIDDEN,
            Json(json!({ "error": "Bạn không có quyền xóa bài viết của người khác" })),
        );
    }

    if let Err(e) = state.supabase.delete_post(&post_id).await {
        return (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({ "error": e })));
    }

    // Clean up R2 media
    let mut deleted_files = Vec::new();
    if let Some(media_urls) = post.media_urls {
        if !media_urls.is_empty() {
            let (d, _) = delete_files_from_r2(&state.http_client, &state.config, &media_urls).await;
            deleted_files = d;
        }
    }

    (
        StatusCode::OK,
        Json(json!({
            "success": true,
            "message": "Đã xóa bài viết và giải phóng dung lượng Cloudflare R2 thành công",
            "deletedFilesCount": deleted_files.len(),
            "deletedFiles": deleted_files
        })),
    )
}

#[derive(Deserialize)]
pub struct ResolveUsernameRequest {
    pub username: Option<String>,
}

pub async fn resolve_username_handler(
    State(state): State<Arc<AppState>>,
    Json(body): Json<ResolveUsernameRequest>,
) -> impl IntoResponse {
    let username = match body.username {
        Some(ref u) if !u.trim().is_empty() => u.trim(),
        _ => {
            return (
                StatusCode::BAD_REQUEST,
                Json(json!({ "error": "Username is required" })),
            );
        }
    };

    match state.supabase.resolve_username(username).await {
        Ok(Some(email)) => (
            StatusCode::OK,
            Json(json!({
                "success": true,
                "email": email
            })),
        ),
        _ => (
            StatusCode::NOT_FOUND,
            Json(json!({ "error": "Username không tồn tại hoặc không tìm thấy email" })),
        ),
    }
}

pub async fn banned_usernames_handler(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    let list = state.supabase.get_banned_usernames().await;
    Json(json!({
        "success": true,
        "usernames": list
    }))
}

pub async fn fcm_send_handler(
    State(state): State<Arc<AppState>>,
    Json(req): Json<SendFcmRequest>,
) -> impl IntoResponse {
    let res = state.fcm.send_notification(req).await;
    Json(res)
}

pub async fn delete_comment_handler(
    State(state): State<Arc<AppState>>,
    Path(comment_id): Path<String>,
    headers: HeaderMap,
) -> impl IntoResponse {
    let auth_header = headers.get(header::AUTHORIZATION).and_then(|h| h.to_str().ok());
    let token = auth_header.and_then(|h| h.strip_prefix("Bearer ").or_else(|| h.strip_prefix("bearer "))).unwrap_or("");
    if token.is_empty() {
        return (StatusCode::UNAUTHORIZED, Json(json!({ "error": "Missing Bearer token" })));
    }

    let _user = match state.supabase.get_user_from_token(token).await {
        Ok(u) => u,
        Err(_) => return (StatusCode::UNAUTHORIZED, Json(json!({ "error": "Phiên đăng nhập không hợp lệ" }))),
    };

    match state.supabase.delete_comment(&comment_id).await {
        Ok(_) => (
            StatusCode::OK,
            Json(json!({ "success": true, "message": "Đã xóa bình luận thành công" })),
        ),
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({ "error": e })),
        ),
    }
}
