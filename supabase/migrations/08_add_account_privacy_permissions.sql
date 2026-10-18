-- Bổ sung các cột tùy chọn quyền cuộc gọi, nhắn tin và quyền riêng tư nâng cao cho profiles
alter table public.profiles add column if not exists allow_voice_calls boolean default true;
alter table public.profiles add column if not exists allow_video_calls boolean default true;
alter table public.profiles add column if not exists allow_messages boolean default true;
alter table public.profiles add column if not exists only_friends_contact boolean default false;
alter table public.profiles add column if not exists secure_screen_protection boolean default true;
alter table public.profiles add column if not exists read_receipts_enabled boolean default true;
