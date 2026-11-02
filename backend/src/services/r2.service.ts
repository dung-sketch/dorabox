import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'node:crypto';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'dorabox-media';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || '';

// Cloudflare R2 sử dụng giao diện chuẩn S3 API
export const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export interface PresignedUrlResult {
  uploadUrl: string;
  publicUrl: string;
  key: string;
}

/**
 * Tạo URL upload tạm thời có chữ ký (Presigned URL)
 * Cho phép Android Client upload trực tiếp ảnh WebP lên R2 mà không tốn băng thông máy chủ Node.js.
 */
export async function generateUploadUrl(
  userId: string,
  folder: 'posts' | 'avatars' | 'chat' | 'covers' = 'posts',
  contentType: string = 'image/webp',
  fileExt?: string
): Promise<PresignedUrlResult> {
  const fileHash = crypto.randomBytes(16).toString('hex');
  let extension = fileExt ? fileExt.toLowerCase().replace('.', '') : '';
  if (!extension) {
    if (contentType.includes('webp')) extension = 'webp';
    else if (contentType.includes('png')) extension = 'png';
    else if (contentType.includes('gif')) extension = 'gif';
    else if (contentType.includes('mp4') || contentType.includes('video')) extension = 'mp4';
    else if (contentType.includes('quicktime') || contentType.includes('mov')) extension = 'mov';
    else if (contentType.includes('webm')) extension = 'webm';
    else if (contentType.includes('m4a') || contentType.includes('audio')) extension = 'm4a';
    else extension = 'jpg';
  }
  // Đối với avatar/cover, lưu trực tiếp ghi đè vào key duy nhất của user để không lưu trùng ảnh
  let key: string;
  if (folder === 'avatars') {
    key = `${folder}/${userId}/avatar.${extension}`;
  } else if (folder === 'covers') {
    key = `${folder}/${userId}/cover.${extension}`;
  } else {
    key = `${folder}/${userId}/${Date.now()}-${fileHash}.${extension}`;
  }

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  // URL có hiệu lực trong 5 phút
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
  const publicUrl = folder === 'avatars'
    ? `${R2_PUBLIC_URL.replace(/\/$/, '')}/${key}?t=${Date.now()}`
    : `${R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`;

  return { uploadUrl, publicUrl, key };
}
