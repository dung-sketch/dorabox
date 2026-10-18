-- 11_add_allow_friend_requests.sql: Thêm tùy chọn cho phép hoặc chặn nhận lời mời kết bạn cho profiles
alter table public.profiles add column if not exists allow_friend_requests boolean default true;
