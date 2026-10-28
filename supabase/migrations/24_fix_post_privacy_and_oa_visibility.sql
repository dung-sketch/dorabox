-- 24_fix_post_privacy_and_oa_visibility.sql
-- Tối ưu triệt để quyền riêng tư bài viết: Bạn bè, Chỉ người được xem, và hiển thị bài viết Official Account (OA)

-- 1. Đảm bảo các cột và kiểu dữ liệu posts chuẩn xác
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS visibility text DEFAULT 'public';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS allowed_user_ids uuid[] DEFAULT ARRAY[]::uuid[];
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS allow_comments boolean DEFAULT true;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS allow_download boolean DEFAULT true;

-- 2. Tối ưu index tìm kiếm và lọc quyền riêng tư
CREATE INDEX IF NOT EXISTS idx_posts_visibility_filter ON public.posts(visibility, author_id);
CREATE INDEX IF NOT EXISTS idx_posts_allowed_users ON public.posts USING GIN (allowed_user_ids);
CREATE INDEX IF NOT EXISTS idx_user_follows_follower_target ON public.user_follows(follower_id, target_id);

-- 3. Cập nhật lại toàn bộ Row Level Security (RLS) cho bài viết (posts)
DROP POLICY IF EXISTS "Allow public read posts" ON public.posts;
DROP POLICY IF EXISTS "Allow read posts with privacy" ON public.posts;

CREATE POLICY "Allow read posts with privacy" ON public.posts FOR SELECT USING (
  -- 1. Bài viết công khai: Mọi người đều có thể đọc
  visibility IS NULL OR
  visibility = 'public' OR
  
  -- 2. Chính tác giả bài viết luôn luôn đọc được bài của mình
  author_id = auth.uid() OR
  
  -- 3. Tài khoản OA: Mặc định tất cả bài viết của Official Account đều hiển thị công khai / cho người quan tâm
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = posts.author_id 
      AND (profiles.is_oa = true OR profiles.account_type = 'oa' OR profiles.is_vip = true)
  ) OR
  
  -- 4. Chế độ bạn bè (friends):
  -- Người xem là bạn bè chính thức (đối với tài khoản cá nhân) HOẶC là người đã bấm quan tâm (đối với tài khoản OA)
  (visibility = 'friends' AND (
    EXISTS (
      SELECT 1 FROM public.friendships 
      WHERE status = 'accepted' AND (
        (sender_id = auth.uid() AND receiver_id = posts.author_id) OR
        (receiver_id = auth.uid() AND sender_id = posts.author_id)
      )
    ) OR
    EXISTS (
      SELECT 1 FROM public.user_follows
      WHERE follower_id = auth.uid() AND target_id = posts.author_id
    )
  )) OR
  
  -- 5. Chế độ chỉ người được xem (custom):
  -- Khớp ID người xem trong danh sách allowed_user_ids (hỗ trợ cả uuid và text ép kiểu an toàn)
  (visibility = 'custom' AND (
    auth.uid() = ANY(allowed_user_ids) OR
    auth.uid()::text = ANY(allowed_user_ids::text[])
  ))
);

-- 4. Kích hoạt Realtime đầy đủ cho các bảng liên quan đến quan tâm và quyền riêng tư
ALTER TABLE if exists public.user_follows REPLICA IDENTITY FULL;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'user_follows'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_follows;
  END IF;
END;
$$;

