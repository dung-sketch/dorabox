-- =========================================================================
-- DORABOX - MIGRATION 04: QUYỀN XÓA BÌNH LUẬN & HỖ TRỢ TÀI KHOẢN OA
-- =========================================================================

-- 1. Cho phép tác giả bình luận hoặc chủ bài viết xóa bình luận
drop policy if exists "Allow users to delete own comments or post owners" on public.comments;
create policy "Allow users to delete own comments or post owners" on public.comments
  for delete to authenticated
  using (
    auth.uid() = user_id 
    or auth.uid() in (select author_id from public.posts where id = comments.post_id)
  );

-- 2. Bổ sung cột account_type ('personal' | 'oa') và is_oa cho profiles
alter table public.profiles add column if not exists account_type text default 'personal';
alter table public.profiles add column if not exists is_oa boolean default false;

-- Cập nhật policy cho phép người dùng cập nhật account_type nếu cần
comment on column public.profiles.account_type is 'Loại tài khoản: personal (cá nhân), oa (Official Account - Doanh nghiệp/Tổ chức)';
comment on column public.profiles.is_oa is 'true nếu là tài khoản OA chính thức (sở hữu Tích Vàng)';
