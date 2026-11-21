use base64::engine::general_purpose::URL_SAFE_NO_PAD as B64_URL;
use base64::Engine;
use reqwest::Client;
use rsa::pkcs8::DecodePrivateKey;
use rsa::signature::{SignatureEncoding, Signer};
use rsa::RsaPrivateKey;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use sha2::Sha256;
use std::collections::HashMap;
use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};
use tokio::sync::RwLock;

#[derive(Debug, Deserialize)]
struct ServiceAccount {
    project_id: Option<String>,
    private_key: Option<String>,
    client_email: Option<String>,
}

#[derive(Clone)]
pub struct FcmService {
    client: Client,
    service_account: Option<Arc<ServiceAccount>>,
    cached_token: Arc<RwLock<Option<(String, u64)>>>, // (token, expire_timestamp)
    fcm_server_key: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SendFcmRequest {
    #[serde(rename = "fcmToken")]
    pub fcm_token: String,
    pub title: String,
    pub body: String,
    #[serde(rename = "channelId")]
    pub channel_id: Option<String>,
    pub data: Option<HashMap<String, Value>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SendFcmResponse {
    pub success: bool,
    #[serde(rename = "messageId", skip_serializing_if = "Option::is_none")]
    pub message_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

impl FcmService {
    pub fn new(service_account_raw: Option<&str>, fcm_server_key: Option<&str>) -> Self {
        let mut parsed_sa: Option<ServiceAccount> = None;

        if let Some(raw) = service_account_raw {
            let trimmed = raw.trim();
            if trimmed.starts_with('{') {
                parsed_sa = serde_json::from_str(trimmed).ok();
            } else if let Ok(decoded) = base64::engine::general_purpose::STANDARD.decode(trimmed) {
                if let Ok(s) = String::from_utf8(decoded) {
                    parsed_sa = serde_json::from_str(&s).ok();
                }
            }
        }

        Self {
            client: Client::new(),
            service_account: parsed_sa.map(Arc::new),
            cached_token: Arc::new(RwLock::new(None)),
            fcm_server_key: fcm_server_key.map(|s| s.to_string()),
        }
    }

    async fn get_access_token(&self) -> Result<String, String> {
        let sa = self
            .service_account
            .as_ref()
            .ok_or_else(|| "Firebase service account not configured".to_string())?;

        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_secs();

        {
            let cache = self.cached_token.read().await;
            if let Some((ref token, expire_at)) = *cache {
                if now + 120 < expire_at {
                    return Ok(token.clone());
                }
            }
        }

        let email = sa.client_email.as_deref().unwrap_or_default();
        let private_key_pem = sa.private_key.as_deref().unwrap_or_default();

        let header = serde_json::json!({
            "alg": "RS256",
            "typ": "JWT"
        });
        let claims = serde_json::json!({
            "iss": email,
            "scope": "https://www.googleapis.com/auth/firebase.messaging",
            "aud": "https://oauth2.googleapis.com/token",
            "exp": now + 3600,
            "iat": now
        });

        let header_b64 = B64_URL.encode(serde_json::to_vec(&header).map_err(|e| e.to_string())?);
        let claims_b64 = B64_URL.encode(serde_json::to_vec(&claims).map_err(|e| e.to_string())?);
        let unsigned = format!("{}.{}", header_b64, claims_b64);

        let priv_key = RsaPrivateKey::from_pkcs8_pem(private_key_pem)
            .map_err(|e| format!("Failed to parse RSA private key: {}", e))?;
        let signing_key = rsa::pkcs1v15::SigningKey::<Sha256>::new(priv_key);
        let signature = signing_key.sign(unsigned.as_bytes());
        let sig_b64 = B64_URL.encode(signature.to_vec());
        let jwt = format!("{}.{}", unsigned, sig_b64);

        let params = [
            ("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer"),
            ("assertion", &jwt),
        ];

        let res = self
            .client
            .post("https://oauth2.googleapis.com/token")
            .form(&params)
            .send()
            .await
            .map_err(|e| e.to_string())?;

        let res_json: Value = res.json().await.map_err(|e| e.to_string())?;
        if let Some(token) = res_json.get("access_token").and_then(|v| v.as_str()) {
            let mut cache = self.cached_token.write().await;
            *cache = Some((token.to_string(), now + 3500));
            Ok(token.to_string())
        } else {
            Err(format!("OAuth token error: {:?}", res_json))
        }
    }

    pub async fn send_notification(&self, req: SendFcmRequest) -> SendFcmResponse {
        let mut string_data: HashMap<String, String> = HashMap::new();
        if let Some(map) = req.data {
            for (k, v) in map {
                let val_str = match v {
                    Value::String(s) => s,
                    other => other.to_string(),
                };
                string_data.insert(k, val_str);
            }
        }
        string_data.insert("title".to_string(), req.title.clone());
        string_data.insert("body".to_string(), req.body.clone());

        let mut channel = req
            .channel_id
            .unwrap_or_else(|| "dorabox_general_v4".to_string());
        if channel.ends_with("_v3") {
            channel = channel.replace("_v3", "_v4");
        }

        let is_call = channel.contains("calls") || string_data.get("type").map(|s| s == "call").unwrap_or(false);
        let is_msg = channel.contains("messages") || string_data.get("type").map(|s| s == "message").unwrap_or(false);

        // Try HTTP v1 first
        if self.service_account.is_some() {
            if let Ok(access_token) = self.get_access_token().await {
                let project_id = self
                    .service_account
                    .as_ref()
                    .and_then(|sa| sa.project_id.clone())
                    .unwrap_or_else(|| "mcn-tinelfi-dorabox".to_string());

                let android_notif = serde_json::json!({
                    "channelId": if is_call { "dorabox_calls_v4" } else if is_msg { "dorabox_messages_v4" } else { "dorabox_general_v4" },
                    "sound": if is_call { "goiden" } else { "default" },
                    "defaultSound": !is_call,
                    "defaultVibrateTimings": true,
                    "priority": "max",
                    "visibility": "public",
                    "clickAction": "FLUTTER_NOTIFICATION_CLICK"
                });

                let mut android_config = serde_json::json!({
                    "priority": "high",
                    "notification": android_notif
                });
                if is_call {
                    android_config["ttl"] = serde_json::json!("60s");
                }

                let payload = serde_json::json!({
                    "message": {
                        "token": req.fcm_token,
                        "data": string_data,
                        "notification": {
                            "title": req.title,
                            "body": req.body
                        },
                        "android": android_config
                    }
                });

                let url = format!(
                    "https://fcm.googleapis.com/v1/projects/{}/messages:send",
                    project_id
                );

                if let Ok(res) = self
                    .client
                    .post(&url)
                    .bearer_auth(access_token)
                    .json(&payload)
                    .send()
                    .await
                {
                    if res.status().is_success() {
                        let json: Value = res.json().await.unwrap_or_default();
                        let message_id = json
                            .get("name")
                            .and_then(|n| n.as_str())
                            .map(|s| s.to_string());
                        return SendFcmResponse {
                            success: true,
                            message_id,
                            error: None,
                        };
                    }
                }
            }
        }

        // Fallback to legacy server key
        if let Some(ref server_key) = self.fcm_server_key {
            let sound = if is_call {
                "goiden"
            } else if is_msg {
                "tingtingmes"
            } else {
                "ting"
            };

            let legacy_payload = serde_json::json!({
                "to": req.fcm_token,
                "priority": "high",
                "data": string_data,
                "notification": {
                    "title": req.title,
                    "body": req.body,
                    "sound": sound,
                    "android_channel_id": channel
                }
            });

            if let Ok(res) = self
                .client
                .post("https://fcm.googleapis.com/fcm/send")
                .header("Authorization", format!("key={}", server_key))
                .json(&legacy_payload)
                .send()
                .await
            {
                if res.status().is_success() {
                    return SendFcmResponse {
                        success: true,
                        message_id: Some("legacy_sent".to_string()),
                        error: None,
                    };
                }
            }
        }

        SendFcmResponse {
            success: false,
            message_id: None,
            error: Some("Failed to send FCM notification".to_string()),
        }
    }
}
