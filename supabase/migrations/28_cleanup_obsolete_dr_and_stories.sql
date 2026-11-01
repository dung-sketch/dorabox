-- =========================================================================
-- DORABOX v2.1: LOẠI BỎ CSDL THỪA (DR, STORIES VAMP & MẬT KHẨU BÀI VIẾT)
-- Giữ nguyên: public.user_notes (D-Notes 24h)
-- =========================================================================

-- 1. Xóa các bảng Story Reactions & Stories (tự động xóa RLS policy và index đi kèm)
drop table if exists public.story_reactions cascade;
drop table if exists public.stories cascade;

-- 2. Xóa index hỗ trợ Dr trên bảng posts
drop index if exists public.idx_posts_dr_parent;

-- 3. Xóa các cột của tính năng Dr và Mật khẩu bài viết khỏi bảng posts
alter table public.posts
  drop column if exists dr_parent_id,
  drop column if exists dr_prompt,
  drop column if exists dr_voice_url,
  drop column if exists dr_voice_duration,
  drop column if exists dr_count,
  drop column if exists content_password;
