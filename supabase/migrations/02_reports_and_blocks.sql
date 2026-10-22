-- Bổ sung bảng Báo cáo nội dung (Reports) và Chặn người dùng (Blocks)
create table if not exists public.reports (
  id uuid default uuid_generate_v4() primary key,
  reporter_id uuid references public.profiles(id) on delete cascade not null,
  target_type text not null check (target_type in ('post', 'comment', 'user')),
  target_id uuid not null,
  reason text not null,
  status text default 'pending' check (status in ('pending', 'reviewed', 'dismissed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.user_blocks (
  blocker_id uuid references public.profiles(id) on delete cascade not null,
  blocked_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (blocker_id, blocked_id)
);

create index if not exists idx_reports_status on public.reports (status, created_at desc);
create index if not exists idx_blocks_blocker on public.user_blocks (blocker_id);

-- -------------------------------------------------------------
-- RLS POLICIES FOR REPORTS & USER_BLOCKS
-- -------------------------------------------------------------
alter table public.reports enable row level security;

drop policy if exists "Allow authenticated users to insert reports" on public.reports;
create policy "Allow authenticated users to insert reports" on public.reports
  for insert with check (auth.uid() = reporter_id);

drop policy if exists "Allow users to read own reports" on public.reports;
create policy "Allow users to read own reports" on public.reports
  for select using (auth.uid() = reporter_id);

drop policy if exists "Allow service role full access on reports" on public.reports;
create policy "Allow service role full access on reports" on public.reports
  for all to service_role using (true) with check (true);

alter table public.user_blocks enable row level security;

drop policy if exists "Allow users to manage own blocks" on public.user_blocks;
create policy "Allow users to manage own blocks" on public.user_blocks
  for all using (auth.uid() = blocker_id) with check (auth.uid() = blocker_id);

