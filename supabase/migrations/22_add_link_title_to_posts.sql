-- 22_add_link_title_to_posts.sql: Bổ sung cột tiêu đề liên kết (link_title) cho bài viết
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS link_title text;
