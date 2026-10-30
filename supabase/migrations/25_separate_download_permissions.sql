-- 25_separate_download_permissions.sql: Tách riêng quyền lưu ảnh và lưu video cho bài viết và người dùng
-- Đồng bộ thời gian thực (Realtime) và loại bỏ hoàn toàn các kẽ hở tải trái phép

-- 1. Bổ sung 2 cột riêng biệt cho bảng posts
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS allow_download_images boolean DEFAULT true;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS allow_download_videos boolean DEFAULT true;

-- 2. Đồng bộ dữ liệu hiện có từ cột allow_download cũ
UPDATE public.posts
SET allow_download_images = COALESCE(allow_download, true),
    allow_download_videos = COALESCE(allow_download, true)
WHERE allow_download_images IS NULL OR allow_download_videos IS NULL;

-- 3. Bổ sung cài đặt mặc định lưu ảnh & video trong hồ sơ người dùng (profiles)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS allow_download_images boolean DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS allow_download_videos boolean DEFAULT true;

-- 4. Đảm bảo bảng posts hỗ trợ đầy đủ Supabase Realtime với REPLICA IDENTITY FULL
ALTER TABLE public.posts REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'posts'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
  END IF;
END $$;

