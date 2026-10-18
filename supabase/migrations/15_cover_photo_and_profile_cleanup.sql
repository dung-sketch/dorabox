-- =========================================================================
-- DORABOX - MIGRATION 15: COVER PHOTO SUPPORT
-- =========================================================================

-- Bổ sung cột cover_url lưu trữ ảnh bìa tùy chỉnh cho tài khoản người dùng và OA
alter table if exists public.profiles
add column if not exists cover_url text;
