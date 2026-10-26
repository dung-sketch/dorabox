-- 23_add_author_name_to_posts.sql: Bổ sung cột author_name tuỳ chọn cho bảng posts
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS author_name text;
