-- 13_post_privacy_visibility.sql: Cài đặt hiển thị và quyền riêng tư bài viết (Công khai, Bạn bè, Chỉ mình tôi, Người cho phép xem)

-- 1. Bổ sung cột visibility và allowed_user_ids vào bảng posts
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS visibility text DEFAULT 'public';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS allowed_user_ids uuid[] DEFAULT ARRAY[]::uuid[];

-- 2. Thêm ràng buộc kiểm tra giá trị hợp lệ cho visibility
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'posts_visibility_check'
  ) THEN
    ALTER TABLE public.posts ADD CONSTRAINT posts_visibility_check CHECK (visibility IN ('public', 'friends', 'only_me', 'custom'));
  END IF;
END $$;

-- 3. Tạo index tăng tốc truy vấn lọc theo quyền riêng tư
CREATE INDEX IF NOT EXISTS idx_posts_visibility ON public.posts(visibility);
CREATE INDEX IF NOT EXISTS idx_posts_author_visibility ON public.posts(author_id, visibility);

-- 4. Bổ sung cài đặt quyền riêng tư bài viết mặc định cho bảng profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS default_post_visibility text DEFAULT 'public';
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_default_post_visibility_check'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_default_post_visibility_check CHECK (default_post_visibility IN ('public', 'friends', 'only_me'));
  END IF;
END $$;

-- 5. Cập nhật Row Level Security (RLS) cho phép đọc bài viết theo quyền riêng tư
DROP POLICY IF EXISTS "Allow public read posts" ON public.posts;
DROP POLICY IF EXISTS "Allow read posts with privacy" ON public.posts;

CREATE POLICY "Allow read posts with privacy" ON public.posts FOR SELECT USING (
  visibility IS NULL OR
  visibility = 'public' OR
  author_id = auth.uid() OR
  (visibility = 'custom' AND auth.uid() = ANY(allowed_user_ids)) OR
  (visibility = 'friends' AND EXISTS (
    SELECT 1 FROM public.friendships 
    WHERE status = 'accepted' AND (
      (sender_id = auth.uid() AND receiver_id = posts.author_id) OR
      (receiver_id = auth.uid() AND sender_id = posts.author_id)
    )
  ))
);
