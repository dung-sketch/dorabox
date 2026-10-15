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
  folder: 'posts' | 'avatars' | 'chat' = 'posts',
  contentType: string = 'image/webp'
): Promise<PresignedUrlResult> {
  const fileHash = crypto.randomBytes(16).toString('hex');
  const extension = contentType.includes('webp') ? 'webp' : (contentType.includes('png') ? 'png' : 'jpg');
  // Đối với avatar, lưu trực tiếp ghi đè vào key duy nhất của user để không lưu trùng ảnh
  const key = folder === 'avatars'
    ? `${folder}/${userId}/avatar.${extension}`
    : `${folder}/${userId}/${Date.now()}-${fileHash}.${extension}`;

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
