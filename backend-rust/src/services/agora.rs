use base64::engine::general_purpose::STANDARD as BASE64;
use base64::Engine;
use crc32fast::Hasher;
use hmac::{Hmac, Mac};
use rand::Rng;
use sha2::Sha256;
use std::collections::BTreeMap;
use std::time::{SystemTime, UNIX_EPOCH};

type HmacSha256 = Hmac<Sha256>;

const VERSION: &str = "006";

pub const PRIVILEGE_JOIN_CHANNEL: u16 = 1;
pub const PRIVILEGE_PUBLISH_AUDIO: u16 = 2;
pub const PRIVILEGE_PUBLISH_VIDEO: u16 = 3;
pub const PRIVILEGE_PUBLISH_DATA: u16 = 4;

struct ByteBuf {
    buf: Vec<u8>,
}

impl ByteBuf {
    fn new() -> Self {
        Self { buf: Vec::with_capacity(128) }
    }

    fn put_u16(&mut self, val: u16) {
        self.buf.extend_from_slice(&val.to_le_bytes());
    }

    fn put_u32(&mut self, val: u32) {
        self.buf.extend_from_slice(&val.to_le_bytes());
    }

    fn put_bytes(&mut self, bytes: &[u8]) {
        self.put_u16(bytes.len() as u16);
        self.buf.extend_from_slice(bytes);
    }

    #[allow(dead_code)]
    fn put_string(&mut self, s: &str) {
        self.put_bytes(s.as_bytes());
    }

    fn put_tree_map_u32(&mut self, map: &BTreeMap<u16, u32>) {
        self.put_u16(map.len() as u16);
        for (&k, &v) in map.iter() {
            self.put_u16(k);
            self.put_u32(v);
        }
    }

    fn into_bytes(self) -> Vec<u8> {
        self.buf
    }
}

fn calc_crc32(data: &[u8]) -> u32 {
    let mut hasher = Hasher::new();
    hasher.update(data);
    hasher.finalize()
}

pub fn build_rtc_token_uid(
    app_id: &str,
    app_cert: &str,
    channel_name: &str,
    uid: u32,
    expire_seconds: u32,
) -> Result<String, String> {
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|e| e.to_string())?
        .as_secs() as u32;

    let expire_ts = now + expire_seconds;
    let uid_str = if uid == 0 {
        String::new()
    } else {
        uid.to_string()
    };

    let salt: u32 = rand::thread_rng().gen();
    let ts = now + 24 * 3600;

    let mut privileges = BTreeMap::new();
    privileges.insert(PRIVILEGE_JOIN_CHANNEL, expire_ts);
    privileges.insert(PRIVILEGE_PUBLISH_AUDIO, expire_ts);
    privileges.insert(PRIVILEGE_PUBLISH_VIDEO, expire_ts);
    privileges.insert(PRIVILEGE_PUBLISH_DATA, expire_ts);

    // Pack message: salt(u32) + ts(u32) + privileges(tree map)
    let mut msg_buf = ByteBuf::new();
    msg_buf.put_u32(salt);
    msg_buf.put_u32(ts);
    msg_buf.put_tree_map_u32(&privileges);
    let m = msg_buf.into_bytes();

    // To sign: app_id + channel_name + uid + m
    let mut to_sign = Vec::new();
    to_sign.extend_from_slice(app_id.as_bytes());
    to_sign.extend_from_slice(channel_name.as_bytes());
    to_sign.extend_from_slice(uid_str.as_bytes());
    to_sign.extend_from_slice(&m);

    let mut mac = HmacSha256::new_from_slice(app_cert.as_bytes())
        .map_err(|e| format!("Invalid certificate: {}", e))?;
    mac.update(&to_sign);
    let signature = mac.finalize().into_bytes();

    let crc_channel = calc_crc32(channel_name.as_bytes());
    let crc_uid = calc_crc32(uid_str.as_bytes());

    // AccessTokenContent pack:
    // putString(signature) + putUint32(crc_channel) + putUint32(crc_uid) + putString(m)
    let mut content_buf = ByteBuf::new();
    content_buf.put_bytes(&signature);
    content_buf.put_u32(crc_channel);
    content_buf.put_u32(crc_uid);
    content_buf.put_bytes(&m);

    let content_b64 = BASE64.encode(content_buf.into_bytes());

    Ok(format!("{}{}{}", VERSION, app_id, content_b64))
}
