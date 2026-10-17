-- Bổ sung các cột tùy chọn hiển thị và quyền lưu media cho profiles & posts
alter table public.profiles add column if not exists show_email boolean default true;
alter table public.profiles add column if not exists show_active_status boolean default true;
alter table public.profiles add column if not exists allow_save_media boolean default true;
alter table public.profiles add column if not exists last_seen_at timestamp with time zone default timezone('utc'::text, now());
alter table public.posts add column if not exists allow_download boolean default true;

