use crate::config::AppConfig;
use chrono::{DateTime, Utc};
use hmac::{Hmac, Mac};
use rand::Rng;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::time::{SystemTime, UNIX_EPOCH};

type HmacSha256 = Hmac<Sha256>;

#[derive(Debug, Serialize, Deserialize)]
pub struct PresignedUrlResult {
    #[serde(rename = "uploadUrl")]
    pub upload_url: String,
    #[serde(rename = "publicUrl")]
    pub public_url: String,
    pub key: String,
}

#[allow(dead_code)]
#[derive(Debug, Serialize, Deserialize)]
pub struct DeleteBatchResult {
    pub success: bool,
    pub deleted: Vec<String>,
    pub errors: Vec<String>,
    pub count: usize,
}

pub fn extract_r2_key(url_or_key: &str, bucket_name: &str) -> Option<String> {
    if url_or_key.trim().is_empty() {
        return None;
    }

    let clean = url_or_key.split('?').next()?.split('#').next()?.trim();
    if clean.is_empty() {
        return None;
    }

    let clean_lower = clean.to_lowercase();
    for prefix in &["posts/", "chat/", "avatars/", "covers/"] {
        if clean_lower.starts_with(prefix) {
            return Some(clean.to_string());
        }
    }

    if let Ok(url) = reqwest::Url::parse(clean) {
        let mut path = url.path().trim_start_matches('/').to_string();
        if !bucket_name.is_empty() {
            let bucket_prefix = format!("{}/", bucket_name.to_lowercase());
            if path.to_lowercase().starts_with(&bucket_prefix) {
                path = path[bucket_prefix.len()..].to_string();
            }
        }
        let path_lower = path.to_lowercase();
        for prefix in &["posts/", "chat/", "avatars/", "covers/"] {
            if path_lower.starts_with(prefix) {
                return Some(path);
            }
        }
    }

    None
}

fn hmac_sha256(key: &[u8], data: &[u8]) -> Vec<u8> {
    let mut mac = HmacSha256::new_from_slice(key).expect("HMAC can take key of any size");
    mac.update(data);
    mac.finalize().into_bytes().to_vec()
}

fn sha256_hex(data: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(data);
    hex::encode(hasher.finalize())
}

/// Generates AWS SigV4 Presigned PUT URL for Cloudflare R2
pub fn generate_upload_url(
    config: &AppConfig,
    user_id: &str,
    folder: &str,
    content_type: &str,
    file_ext: Option<&str>,
) -> PresignedUrlResult {
    let mut rng = rand::thread_rng();
    let random_bytes: [u8; 16] = rng.gen();
    let file_hash = hex::encode(random_bytes);

    let ext = match file_ext {
        Some(e) if !e.trim().is_empty() => e.trim().trim_start_matches('.').to_lowercase(),
        _ => {
            if content_type.contains("webp") {
                "webp".to_string()
            } else if content_type.contains("png") {
                "png".to_string()
            } else if content_type.contains("gif") {
                "gif".to_string()
            } else if content_type.contains("mp4") || content_type.contains("video") {
                "mp4".to_string()
            } else if content_type.contains("quicktime") || content_type.contains("mov") {
                "mov".to_string()
            } else if content_type.contains("webm") {
                "webm".to_string()
            } else if content_type.contains("m4a") || content_type.contains("audio") {
                "m4a".to_string()
            } else {
                "jpg".to_string()
            }
        }
    };

    let now_millis = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis();

    let valid_folder = match folder {
        "avatars" | "covers" | "chat" => folder,
        _ => "posts",
    };

    let key = if valid_folder == "avatars" {
        format!("{}/{}/avatar_{}.{}", valid_folder, user_id, now_millis, ext)
    } else if valid_folder == "covers" {
        format!("{}/{}/cover_{}.{}", valid_folder, user_id, now_millis, ext)
    } else {
        format!("{}/{}/{}-{}.{}", valid_folder, user_id, now_millis, file_hash, ext)
    };

    let now: DateTime<Utc> = Utc::now();
    let amz_date = now.format("%Y%m%dT%H%M%SZ").to_string();
    let date_stamp = now.format("%Y%m%d").to_string();
    let region = "auto";
    let service = "s3";

    let host = format!("{}.r2.cloudflarestorage.com", config.r2_account_id);
    let credential = format!(
        "{}/{}/{}/{}/aws4_request",
        config.r2_access_key_id, date_stamp, region, service
    );

    let expires = "300";
    let signed_headers = "host";

    // Query parameters in alphabetical order
    let query_params = format!(
        "X-Amz-Algorithm=AWS4-HMAC-SHA256\
        &X-Amz-Credential={}\
        &X-Amz-Date={}\
        &X-Amz-Expires={}\
        &X-Amz-SignedHeaders={}",
        urlencoding_encode(&credential),
        amz_date,
        expires,
        signed_headers
    );

    let canonical_uri = format!("/{}/{}", config.r2_bucket_name, key);
    let canonical_headers = format!("host:{}\n", host);
    let payload_hash = "UNSIGNED-PAYLOAD";

    let canonical_request = format!(
        "PUT\n{}\n{}\n{}\n{}\n{}",
        canonical_uri, query_params, canonical_headers, signed_headers, payload_hash
    );

    let string_to_sign = format!(
        "AWS4-HMAC-SHA256\n{}\n{}/{}/{}/aws4_request\n{}",
        amz_date,
        date_stamp,
        region,
        service,
        sha256_hex(canonical_request.as_bytes())
    );

    // Calculate signature
    let k_secret = format!("AWS4{}", config.r2_secret_access_key);
    let k_date = hmac_sha256(k_secret.as_bytes(), date_stamp.as_bytes());
    let k_region = hmac_sha256(&k_date, region.as_bytes());
    let k_service = hmac_sha256(&k_region, service.as_bytes());
    let k_signing = hmac_sha256(&k_service, b"aws4_request");
    let signature = hex::encode(hmac_sha256(&k_signing, string_to_sign.as_bytes()));

    let upload_url = format!(
        "https://{}{}?{}&X-Amz-Signature={}",
        host, canonical_uri, query_params, signature
    );

    let public_url = format!(
        "{}/{}",
        config.r2_public_url.trim_end_matches('/'),
        key
    );

    PresignedUrlResult {
        upload_url,
        public_url,
        key,
    }
}

fn urlencoding_encode(s: &str) -> String {
    let mut result = String::new();
    for b in s.bytes() {
        match b {
            b'a'..=b'z' | b'A'..=b'Z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => {
                result.push(b as char);
            }
            _ => {
                result.push_str(&format!("%{:02X}", b));
            }
        }
    }
    result
}

/// Deletes files from Cloudflare R2 bucket using S3 DeleteObjects API
pub async fn delete_files_from_r2(
    client: &Client,
    config: &AppConfig,
    urls_or_keys: &[String],
) -> (Vec<String>, Vec<String>) {
    let mut keys = Vec::new();
    for u in urls_or_keys {
        if let Some(key) = extract_r2_key(u, &config.r2_bucket_name) {
            if !keys.contains(&key) {
                keys.push(key);
            }
        }
    }

    if keys.is_empty() {
        return (Vec::new(), Vec::new());
    }

    let mut deleted = Vec::new();
    let mut errors = Vec::new();

    // S3 DeleteObjects chunk size: 1000
    for chunk in keys.chunks(1000) {
        let mut xml = String::from("<?xml version=\"1.0\" encoding=\"UTF-8\"?><Delete><Quiet>false</Quiet>");
        for key in chunk {
            xml.push_str(&format!("<Object><Key>{}</Key></Object>", key));
        }
        xml.push_str("</Delete>");

        let now: DateTime<Utc> = Utc::now();
        let amz_date = now.format("%Y%m%dT%H%M%SZ").to_string();
        let date_stamp = now.format("%Y%m%d").to_string();
        let region = "auto";
        let service = "s3";
        let host = format!("{}.r2.cloudflarestorage.com", config.r2_account_id);
        let canonical_uri = format!("/{}/", config.r2_bucket_name);
        let canonical_query = "delete=";
        let payload_hash = sha256_hex(xml.as_bytes());

        let canonical_headers = format!(
            "content-type:application/xml\nhost:{}\nx-amz-content-sha256:{}\nx-amz-date:{}\n",
            host, payload_hash, amz_date
        );
        let signed_headers = "content-type;host;x-amz-content-sha256;x-amz-date";

        let canonical_request = format!(
            "POST\n{}\n{}\n{}\n{}\n{}",
            canonical_uri, canonical_query, canonical_headers, signed_headers, payload_hash
        );

        let string_to_sign = format!(
            "AWS4-HMAC-SHA256\n{}\n{}/{}/{}/aws4_request\n{}",
            amz_date,
            date_stamp,
            region,
            service,
            sha256_hex(canonical_request.as_bytes())
        );

        let k_secret = format!("AWS4{}", config.r2_secret_access_key);
        let k_date = hmac_sha256(k_secret.as_bytes(), date_stamp.as_bytes());
        let k_region = hmac_sha256(&k_date, region.as_bytes());
        let k_service = hmac_sha256(&k_region, service.as_bytes());
        let k_signing = hmac_sha256(&k_service, b"aws4_request");
        let signature = hex::encode(hmac_sha256(&k_signing, string_to_sign.as_bytes()));

        let auth_header = format!(
            "AWS4-HMAC-SHA256 Credential={}/{}/{}/{}/aws4_request, SignedHeaders={}, Signature={}",
            config.r2_access_key_id, date_stamp, region, service, signed_headers, signature
        );

        let url = format!("https://{}{}?delete", host, canonical_uri);

        match client
            .post(&url)
            .header("Content-Type", "application/xml")
            .header("x-amz-date", &amz_date)
            .header("x-amz-content-sha256", &payload_hash)
            .header("Authorization", &auth_header)
            .body(xml)
            .send()
            .await
        {
            Ok(res) => {
                if res.status().is_success() {
                    for key in chunk {
                        deleted.push(key.clone());
                    }
                } else {
                    let err_text = res.text().await.unwrap_or_default();
                    errors.push(err_text);
                }
            }
            Err(e) => {
                errors.push(e.to_string());
            }
        }
    }

    (deleted, errors)
}
