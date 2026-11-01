-- =========================================================================
-- DORABOX v2.2.1: HỆ THỐNG THEO DÕI (FOLLOWS), ĐÌNH CHỈ / ẨN TÀI KHOẢN,
-- VÀ ĐA DẠNG HÓA HUY HIỆU XÁC MINH (CAM, XANH LÁ, CYAN, VÀNG, XANH DƯƠNG)
-- =========================================================================

-- 1. Mở rộng bảng profiles với các trạng thái quản trị, bảo mật & huy hiệu
alter table public.profiles
  add column if not exists verification_badge text default 'none' check (verification_badge in ('none', 'blue', 'gold', 'orange', 'green', 'cyan')),
  add column if not exists is_banned boolean default false,
  add column if not exists ban_type text default 'none' check (ban_type in ('none', 'temporary', 'permanent')),
  add column if not exists banned_until timestamp with time zone,
  add column if not exists ban_reason text,
  add column if not exists is_hidden boolean default false,
  add column if not exists oa_always_public boolean default true;

-- Đồng bộ dữ liệu huy hiệu cũ sang hệ thống mới
update public.profiles
set verification_badge = case
  when is_oa = true or account_type = 'oa' then 'gold'
  when is_verified = true then 'blue'
  else 'none'
end
where verification_badge = 'none' or verification_badge is null;

-- Tạo index tìm kiếm & quản trị tối ưu hiệu năng
create index if not exists idx_profiles_banned on public.profiles(is_banned, is_hidden);
create index if not exists idx_profiles_badge on public.profiles(verification_badge);

-- 2. Tạo bảng follows (Thay thế hoàn toàn mô hình kết bạn bằng theo dõi chuẩn Fanpage)
create table if not exists public.follows (
  id uuid default uuid_generate_v4() primary key,
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_follower_following unique (follower_id, following_id)
);

create index if not exists idx_follows_follower on public.follows(follower_id);
create index if not exists idx_follows_following on public.follows(following_id);

-- RLS cho bảng follows
alter table public.follows enable row level security;

drop policy if exists "Mọi người đều có thể xem danh sách theo dõi" on public.follows;
create policy "Mọi người đều có thể xem danh sách theo dõi"
  on public.follows for select using (true);

drop policy if exists "Người dùng có thể bấm theo dõi" on public.follows;
create policy "Người dùng có thể bấm theo dõi"
  on public.follows for insert
  with check (auth.uid() = follower_id);

drop policy if exists "Người dùng có thể hủy theo dõi" on public.follows;
create policy "Người dùng có thể hủy theo dõi"
  on public.follows for delete
  using (auth.uid() = follower_id);

grant select, insert, delete on public.follows to authenticated;
grant all on public.follows to service_role;

-- Kích hoạt Realtime cho follows
alter table if exists public.follows replica identity full;
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and tablename = 'follows'
  ) then
    alter publication supabase_realtime add table public.follows;
  end if;
end;
$$;

-- 3. Di chuyển dữ liệu bạn bè cũ sang hệ thống theo dõi 2 chiều
do $$
begin
  if exists (select 1 from information_schema.tables where table_name = 'friendships') then
    insert into public.follows (follower_id, following_id)
    select sender_id, receiver_id from public.friendships where status = 'accepted'
    on conflict do nothing;

    insert into public.follows (follower_id, following_id)
    select receiver_id, sender_id from public.friendships where status = 'accepted'
    on conflict do nothing;
  end if;
end;
$$;

