use std::env;

#[derive(Clone, Debug)]
pub struct AppConfig {
    pub port: u16,
    pub supabase_url: String,
    pub supabase_service_role_key: String,
    pub r2_account_id: String,
    pub r2_access_key_id: String,
    pub r2_secret_access_key: String,
    pub r2_bucket_name: String,
    pub r2_public_url: String,
    pub agora_app_id: String,
    pub agora_app_certificate: String,
    pub firebase_service_account_key: Option<String>,
    pub fcm_server_key: Option<String>,
}

impl AppConfig {
    pub fn from_env() -> Self {
        let _ = dotenvy::dotenv();

        let port = env::var("PORT")
            .ok()
            .and_then(|p| p.parse::<u16>().ok())
            .unwrap_or(4000);

        let supabase_url = env::var("SUPABASE_URL")
            .unwrap_or_else(|_| "https://vcmsmyaupsksbjusnzoy.supabase.co".to_string());

        let supabase_service_role_key = env::var("SUPABASE_SERVICE_ROLE_KEY").unwrap_or_default();
        let r2_account_id = env::var("R2_ACCOUNT_ID").unwrap_or_default();
        let r2_access_key_id = env::var("R2_ACCESS_KEY_ID").unwrap_or_default();
        let r2_secret_access_key = env::var("R2_SECRET_ACCESS_KEY").unwrap_or_default();
        let r2_bucket_name = env::var("R2_BUCKET_NAME")
            .unwrap_or_else(|_| "dung-sketch-team-dorabox".to_string());
        let r2_public_url = env::var("R2_PUBLIC_URL")
            .unwrap_or_else(|_| "https://doraboxcdn.zpiltk.io.vn".to_string());

        let agora_app_id = env::var("AGORA_APP_ID")
            .unwrap_or_else(|_| "a1f29a9e08154229931541308c4e4d29".to_string());
        let agora_app_certificate = env::var("AGORA_APP_CERTIFICATE")
            .unwrap_or_else(|_| "4534665a8c094e6588faf3766ac12cc2".to_string());

        let firebase_service_account_key = env::var("FIREBASE_SERVICE_ACCOUNT_KEY").ok();
        let fcm_server_key = env::var("FCM_SERVER_KEY").ok();

        Self {
            port,
            supabase_url,
            supabase_service_role_key,
            r2_account_id,
            r2_access_key_id,
            r2_secret_access_key,
            r2_bucket_name,
            r2_public_url,
            agora_app_id,
            agora_app_certificate,
            firebase_service_account_key,
            fcm_server_key,
        }
    }
}
