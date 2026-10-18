-- 10_friendships.sql: Bảng quản lý bạn bè và lời mời kết bạn 2 chiều
create table if not exists public.friendships (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'blocked')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_friendship_pair unique (sender_id, receiver_id)
);

-- Index tra cứu tối ưu hiệu năng
create index if not exists idx_friendships_sender on public.friendships (sender_id, status);
create index if not exists idx_friendships_receiver on public.friendships (receiver_id, status);

-- Kích hoạt Row Level Security (RLS)
alter table public.friendships enable row level security;

-- Policies RLS
drop policy if exists "Users can view their own friendships" on public.friendships;
create policy "Users can view their own friendships" on public.friendships
  for select using (auth.uid() = sender_id or auth.uid() = receiver_id);

drop policy if exists "Users can send friend requests" on public.friendships;
create policy "Users can send friend requests" on public.friendships
  for insert with check (auth.uid() = sender_id);

drop policy if exists "Users can update friendships" on public.friendships;
create policy "Users can update friendships" on public.friendships
  for update using (auth.uid() = sender_id or auth.uid() = receiver_id);

drop policy if exists "Users can delete friendships" on public.friendships;
create policy "Users can delete friendships" on public.friendships
  for delete using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- Cấp quyền truy cập
grant select, insert, update, delete on public.friendships to authenticated;
grant all on public.friendships to service_role;

-- Kích hoạt Realtime cho friendships
alter table if exists public.friendships replica identity full;
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and tablename = 'friendships'
  ) then
    alter publication supabase_realtime add table public.friendships;
  end if;
end;
$$;
