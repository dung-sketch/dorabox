mod config;
mod routes;
mod services;
mod views;

use crate::config::AppConfig;
use crate::routes::api::{
    agora_token_handler, app_version_handler, banned_usernames_handler, delete_batch_handler,
    delete_comment_handler, delete_post_handler, fcm_send_handler, feed_config_handler,
    health_handler, landing_handler, maintenance_handler, manifest_handler, post_preview_handler,
    presigned_url_handler, privacy_handler, resolve_username_handler, robots_handler,
    sitemap_handler, terms_handler, watch_handler, AppState,
};
use crate::services::fcm::FcmService;
use crate::services::supabase::SupabaseService;
use axum::routing::{delete, get, post};
use axum::Router;
use reqwest::Client;
use std::sync::Arc;
use tower_http::cors::CorsLayer;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let config = AppConfig::from_env();
    let port = config.port;

    let http_client = Client::new();
    let supabase = SupabaseService::new(&config.supabase_url, &config.supabase_service_role_key);
    let fcm = FcmService::new(
        config.firebase_service_account_key.as_deref(),
        config.fcm_server_key.as_deref(),
    );

    let state = Arc::new(AppState {
        config,
        http_client,
        supabase,
        fcm,
    });

    let app = Router::new()
        // SSR Pages & Assets
        .route("/", get(landing_handler))
        .route("/p/:id", get(post_preview_handler))
        .route("/post/:id", get(post_preview_handler))
        .route("/watch", get(watch_handler))
        .route("/privacy", get(privacy_handler))
        .route("/privacy-policy", get(privacy_handler))
        .route("/terms", get(terms_handler))
        .route("/terms-of-service", get(terms_handler))
        .route("/sitemap.xml", get(sitemap_handler))
        .route("/robots.txt", get(robots_handler))
        .route("/manifest.json", get(manifest_handler))
        .route("/site.webmanifest", get(manifest_handler))
        // System & Version APIs
        .route("/api/health", get(health_handler))
        .route("/api/app-version", get(app_version_handler))
        .route("/api/system/maintenance", get(maintenance_handler))
        .route("/api/maintenance", get(maintenance_handler))
        .route("/api/feed-config", get(feed_config_handler))
        // Agora RTC Token API
        .route("/api/agora/token", get(agora_token_handler))
        // Cloudflare R2 Media APIs
        .route("/api/upload/presigned-url", post(presigned_url_handler))
        .route("/api/media/delete-batch", post(delete_batch_handler))
        .route("/api/posts/:id", delete(delete_post_handler))
        .route("/api/user/posts/:id", delete(delete_post_handler))
        // Auth & User Profile APIs
        .route("/api/auth/resolve-username", post(resolve_username_handler))
        .route("/api/auth/banned-usernames", get(banned_usernames_handler))
        // Push Notifications
        .route("/api/fcm/send", post(fcm_send_handler))
        // Comments
        .route("/api/user/comments/:id", delete(delete_comment_handler))
        .layer(CorsLayer::permissive())
        .with_state(state);

    let addr = format!("0.0.0.0:{}", port);
    println!("🦀 ===============================================");
    println!("🚀 Dorabox Rust Server running at http://{}", addr);
    println!("📦 Version: 3.0.0 | High Performance Async Axum");
    println!("🦀 ===============================================");

    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .unwrap_or_else(|e| panic!("Failed to bind to {}: {}", addr, e));

    axum::serve(listener, app)
        .await
        .expect("Server failed to run");
}
