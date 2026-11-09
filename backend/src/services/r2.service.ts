import { S3Client, PutObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'node:crypto';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'dung-sketch-team-dorabox';
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
 * Trích xuất S3 Object Key từ URL Cloudflare R2 hoặc URL CDN
 * Hỗ trợ các folder: posts, avatars, chat, covers
 */
export function extractR2Key(urlOrKey: string): string | null {
  if (!urlOrKey || typeof urlOrKey !== 'string') return null;
  const clean = urlOrKey.split('?')[0].split('#')[0].trim();
  if (!clean) return null;

  // Nếu đã là relative key chuẩn: posts/..., chat/..., avatars/..., covers/...
  if (/^(posts|chat|avatars|covers)\//i.test(clean)) {
    return clean;
  }

  try {
    const parsed = new URL(clean);
    let pathname = decodeURIComponent(parsed.pathname).replace(/^\/+/, '');

    // Nếu pathname có tiền tố tên bucket: e.g. dung-sketch-team-dorabox/posts/...
    if (R2_BUCKET_NAME && pathname.toLowerCase().startsWith(R2_BUCKET_NAME.toLowerCase() + '/')) {
      pathname = pathname.slice(R2_BUCKET_NAME.length + 1);
    }

    if (/^(posts|chat|avatars|covers)\//i.test(pathname)) {
      return pathname;
    }
  } catch (_) {
    // Regex fallback
    const match = clean.match(/(posts|chat|avatars|covers)\/.+$/i);
    if (match) return match[0];
  }

  return null;
}

/**
 * Xóa vĩnh viễn danh sách tệp trên Cloudflare R2 để giải phóng dung lượng lưu trữ
 * Sử dụng DeleteObjectsCommand theo từng chunk tối đa 1000 tệp (giới hạn AWS S3)
 */
export async function deleteFilesFromR2(urlsOrKeys: string[]): Promise<{ deleted: string[]; errors: any[] }> {
  if (!Array.isArray(urlsOrKeys) || urlsOrKeys.length === 0) {
    return { deleted: [], errors: [] };
  }

  const keys = urlsOrKeys
    .map(extractR2Key)
    .filter((k): k is string => Boolean(k));

  if (keys.length === 0) {
    return { deleted: [], errors: [] };
  }

  const uniqueKeys = Array.from(new Set(keys));
  const deleted: string[] = [];
  const errors: any[] = [];

  const chunkSize = 1000;
  for (let i = 0; i < uniqueKeys.length; i += chunkSize) {
    const chunk = uniqueKeys.slice(i, i + chunkSize);
    try {
      const command = new DeleteObjectsCommand({
        Bucket: R2_BUCKET_NAME,
        Delete: {
          Objects: chunk.map((Key) => ({ Key })),
          Quiet: false,
        },
      });

      const response = await s3Client.send(command);
      if (response.Deleted) {
        deleted.push(...response.Deleted.map((d) => d.Key || '').filter(Boolean));
      }
      if (response.Errors && response.Errors.length > 0) {
        errors.push(...response.Errors);
        console.error('Lỗi khi xóa một số tệp trên R2:', response.Errors);
      }
    } catch (err: any) {
      console.error('Lỗi DeleteObjectsCommand trên Cloudflare R2:', err);
      errors.push(err.message || String(err));
    }
  }

  return { deleted, errors };
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
  // Đặt key duy nhất kèm timestamp để vô hiệu hóa hoàn toàn lỗi cache CDN và hiển thị ảnh mới tức thì
  let key: string;
  if (folder === 'avatars') {
    key = `${folder}/${userId}/avatar_${Date.now()}.${extension}`;
  } else if (folder === 'covers') {
    key = `${folder}/${userId}/cover_${Date.now()}.${extension}`;
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
  const publicUrl = `${R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`;

  return { uploadUrl, publicUrl, key };
}
