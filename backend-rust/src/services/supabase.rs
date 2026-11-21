use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Clone)]
pub struct SupabaseService {
    client: Client,
    base_url: String,
    service_role_key: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuthUser {
    pub id: String,
    pub email: Option<String>,
}

#[allow(dead_code)]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Profile {
    pub id: String,
    pub username: Option<String>,
    pub display_name: Option<String>,
    pub avatar_url: Option<String>,
    pub bio: Option<String>,
    pub is_verified: Option<bool>,
    pub is_vip: Option<bool>,
    pub is_oa: Option<bool>,
    pub account_type: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Post {
    pub id: String,
    pub content: Option<String>,
    pub media_urls: Option<Vec<String>>,
    pub link_url: Option<String>,
    pub link_title: Option<String>,
    pub likes_count: Option<i64>,
    pub comments_count: Option<i64>,
    pub visibility: Option<String>,
    pub allow_download_images: Option<bool>,
    pub allow_download_videos: Option<bool>,
    pub created_at: Option<String>,
    pub author: Option<Value>,
}

impl SupabaseService {
    pub fn new(base_url: &str, service_role_key: &str) -> Self {
        let mut headers = HeaderMap::new();
        if let Ok(key_val) = HeaderValue::from_str(service_role_key) {
            headers.insert("apikey", key_val.clone());
            if let Ok(auth_val) = HeaderValue::from_str(&format!("Bearer {}", service_role_key)) {
                headers.insert(AUTHORIZATION, auth_val);
            }
        }

        let client = Client::builder()
            .default_headers(headers)
            .build()
            .unwrap_or_default();

        Self {
            client,
            base_url: base_url.trim_end_matches('/').to_string(),
            service_role_key: service_role_key.to_string(),
        }
    }

    /// Verifies Bearer JWT and retrieves Supabase Auth user
    pub async fn get_user_from_token(&self, token: &str) -> Result<AuthUser, String> {
        let url = format!("{}/auth/v1/user", self.base_url);
        let res = self
            .client
            .get(&url)
            .header("Authorization", format!("Bearer {}", token))
            .header("apikey", &self.service_role_key)
            .send()
            .await
            .map_err(|e| e.to_string())?;

        if !res.status().is_success() {
            return Err("Invalid or expired session token".to_string());
        }

        let val: Value = res.json().await.map_err(|e| e.to_string())?;
        let id = val.get("id").and_then(|v| v.as_str()).unwrap_or_default().to_string();
        let email = val.get("email").and_then(|v| v.as_str()).map(|s| s.to_string());

        if id.is_empty() {
            return Err("No user id returned".to_string());
        }

        Ok(AuthUser { id, email })
    }

    /// Retrieves post by ID for OpenGraph SSR
    pub async fn get_post_by_id(&self, post_id: &str) -> Result<Option<Post>, String> {
        let url = format!(
            "{}/rest/v1/posts?id=eq.{}&select=id,content,media_urls,link_url,link_title,likes_count,comments_count,visibility,allow_download_images,allow_download_videos,created_at,author:profiles!author_id(id,username,display_name,avatar_url,bio,is_verified,is_vip,is_oa,account_type)",
            self.base_url, post_id
        );

        let res = self.client.get(&url).send().await.map_err(|e| e.to_string())?;
        if !res.status().is_success() {
            return Ok(None);
        }

        let posts: Vec<Post> = res.json().await.unwrap_or_default();
        Ok(posts.into_iter().next())
    }

    /// Resolves email for username lookup
    pub async fn resolve_username(&self, username: &str) -> Result<Option<String>, String> {
        let clean = username.trim().trim_start_matches('@').to_lowercase();
        let url = format!(
            "{}/rest/v1/profiles?username=ilike.{}&select=id",
            self.base_url, clean
        );

        let res = self.client.get(&url).send().await.map_err(|e| e.to_string())?;
        if !res.status().is_success() {
            return Ok(None);
        }

        let profiles: Vec<Value> = res.json().await.unwrap_or_default();
        let user_id = match profiles.first().and_then(|p| p.get("id")).and_then(|id| id.as_str()) {
            Some(id) => id,
            None => return Ok(None),
        };

        // Query Supabase Admin Auth user by id
        let auth_url = format!("{}/auth/v1/admin/users/{}", self.base_url, user_id);
        let auth_res = self
            .client
            .get(&auth_url)
            .header("Authorization", format!("Bearer {}", self.service_role_key))
            .send()
            .await
            .map_err(|e| e.to_string())?;

        if !auth_res.status().is_success() {
            return Ok(None);
        }

        let user_val: Value = auth_res.json().await.unwrap_or_default();
        let email = user_val.get("email").and_then(|e| e.as_str()).map(|s| s.to_string());
        Ok(email)
    }

    /// Fetches official posts and profiles for Landing Page Showcase
    pub async fn get_landing_showcase(&self) -> (Vec<Value>, Vec<Value>) {
        let posts_url = format!(
            "{}/rest/v1/posts?author_id=in.(f1b9d3fc-6a20-4e56-8de5-7477c0c1a864,f56d69ef-e2d0-4bb4-b64b-47c1371f3d28)&order=created_at.desc&limit=6&select=id,content,media_urls,likes_count,comments_count,created_at,allow_download_images,allow_download_videos,author:profiles!author_id(id,username,display_name,avatar_url,is_oa)",
            self.base_url
        );
        let profiles_url = format!(
            "{}/rest/v1/profiles?username=in.(dorabox,doraboxcreators)&select=id,username,display_name,avatar_url,is_oa",
            self.base_url
        );

        let posts: Vec<Value> = match self.client.get(&posts_url).send().await {
            Ok(r) if r.status().is_success() => r.json().await.unwrap_or_default(),
            _ => Vec::new(),
        };

        let profiles: Vec<Value> = match self.client.get(&profiles_url).send().await {
            Ok(r) if r.status().is_success() => r.json().await.unwrap_or_default(),
            _ => Vec::new(),
        };

        (posts, profiles)
    }

    /// Fetches public posts for SEO sitemap
    pub async fn get_sitemap_posts(&self) -> Vec<Value> {
        let url = format!(
            "{}/rest/v1/posts?or=(visibility.eq.public,visibility.is.null)&order=created_at.desc&limit=60&select=id,created_at",
            self.base_url
        );

        match self.client.get(&url).send().await {
            Ok(r) if r.status().is_success() => r.json().await.unwrap_or_default(),
            _ => Vec::new(),
        }
    }

    /// Fetches banned usernames
    pub async fn get_banned_usernames(&self) -> Vec<String> {
        let url = format!("{}/rest/v1/banned_usernames?select=username", self.base_url);
        if let Ok(r) = self.client.get(&url).send().await {
            if r.status().is_success() {
                if let Ok(data) = r.json::<Vec<Value>>().await {
                    let mut list = Vec::new();
                    for item in data {
                        if let Some(u) = item.get("username").and_then(|v| v.as_str()) {
                            list.push(u.to_string());
                        }
                    }
                    if !list.is_empty() {
                        return list;
                    }
                }
            }
        }

        vec![
            "admin".to_string(), "administrator".to_string(), "superadmin".to_string(),
            "dorabox".to_string(), "dorabox_admin".to_string(), "official".to_string(),
            "support".to_string(), "help".to_string(), "moderator".to_string(),
            "system".to_string(), "root".to_string(), "security".to_string(),
            "api".to_string(), "null".to_string(), "undefined".to_string(),
            "doraemon".to_string(),
        ]
    }

    /// Deletes post by id
    pub async fn delete_post(&self, post_id: &str) -> Result<(), String> {
        let url = format!("{}/rest/v1/posts?id=eq.{}", self.base_url, post_id);
        let res = self.client.delete(&url).send().await.map_err(|e| e.to_string())?;
        if !res.status().is_success() {
            return Err("Failed to delete post from Supabase".to_string());
        }
        let rep_url = format!("{}/rest/v1/reports?target_id=eq.{}", self.base_url, post_id);
        let _ = self.client.delete(&rep_url).send().await;
        Ok(())
    }

    /// Deletes comment by id
    pub async fn delete_comment(&self, comment_id: &str) -> Result<(), String> {
        let url = format!("{}/rest/v1/comments?id=eq.{}", self.base_url, comment_id);
        let res = self.client.delete(&url).send().await.map_err(|e| e.to_string())?;
        if !res.status().is_success() {
            return Err("Failed to delete comment from Supabase".to_string());
        }
        Ok(())
    }
}
