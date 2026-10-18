-- =========================================================================
-- DORABOX - MIGRATION 14: OA FOLLOWS, POST COMMENTS TOGGLE & REALTIME NOTIFICATIONS
-- =========================================================================

-- 1. Bổ sung cột cho phép bật/tắt bình luận đối với bài viết
alter table if exists public.posts
add column if not exists allow_comments boolean default true;

-- 2. Bổ sung cột số lượng người quan tâm vào bảng profiles
alter table if exists public.profiles
add column if not exists followers_count integer default 0;

-- 3. Tạo bảng user_follows quản lý danh sách người quan tâm (dành cho tài khoản OA)
create table if not exists public.user_follows (
  id uuid default gen_random_uuid() primary key,
  follower_id uuid references public.profiles(id) on delete cascade not null,
  target_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_follower_target unique (follower_id, target_id)
);

-- Index tăng tốc tra cứu quan tâm
create index if not exists idx_user_follows_follower on public.user_follows (follower_id);
create index if not exists idx_user_follows_target on public.user_follows (target_id);

-- Kích hoạt Row Level Security (RLS) cho user_follows
alter table public.user_follows enable row level security;

drop policy if exists "Anyone can view follows" on public.user_follows;
create policy "Anyone can view follows" on public.user_follows
  for select using (true);

drop policy if exists "Authenticated users can follow" on public.user_follows;
create policy "Authenticated users can follow" on public.user_follows
  for insert with check (auth.uid() = follower_id);

drop policy if exists "Authenticated users can unfollow" on public.user_follows;
create policy "Authenticated users can unfollow" on public.user_follows
  for delete using (auth.uid() = follower_id);

grant select, insert, delete on public.user_follows to authenticated;
grant all on public.user_follows to service_role;

-- 4. Đặt replica identity full cho notifications & user_follows
alter table if exists public.notifications replica identity full;
alter table if exists public.user_follows replica identity full;

-- 5. Kích hoạt Supabase Realtime cho bảng notifications và user_follows
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and tablename = 'notifications'
  ) then
    alter publication supabase_realtime add table public.notifications;
  end if;

  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and tablename = 'user_follows'
  ) then
    alter publication supabase_realtime add table public.user_follows;
  end if;
end;
$$;
