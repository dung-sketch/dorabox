-- =========================================================================
-- DORABOX v2.1: DR, STORIES VAMP & D-NOTES (GHI CHÚ)
-- =========================================================================

-- 1. Thêm các cột hỗ trợ Dr vào bảng posts
alter table public.posts
  add column if not exists dr_parent_id uuid references public.posts(id) on delete set null,
  add column if not exists dr_prompt text,
  add column if not exists dr_voice_url text,
  add column if not exists dr_voice_duration integer default 0,
  add column if not exists dr_count integer default 0;

create index if not exists idx_posts_dr_parent on public.posts(dr_parent_id);

-- 2. Bảng D-Notes (Ghi chú trạng thái / âm nhạc / suy nghĩ tức thì 24h)
create table if not exists public.user_notes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null check (char_length(content) <= 120),
  mood_emoji text default '✨',
  audio_url text,
  audio_title text,
  expires_at timestamp with time zone default (now() + interval '24 hours') not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_user_active_note unique (user_id)
);

create index if not exists idx_user_notes_user on public.user_notes(user_id);
create index if not exists idx_user_notes_expires on public.user_notes(expires_at);

-- 3. Bảng Stories & Stories Vamp (Story bóng đêm & tự hủy)
create table if not exists public.stories (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  media_url text not null,
  media_type text default 'image' check (media_type in ('image', 'video')),
  caption text,
  is_vamp boolean default false,
  vamp_type text default 'night_only' check (vamp_type in ('night_only', 'vanish_peek', 'energy_heart')),
  energy_hearts integer default 0,
  expires_at timestamp with time zone default (now() + interval '24 hours') not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_stories_user on public.stories(user_id);
create index if not exists idx_stories_created on public.stories(created_at desc);
create index if not exists idx_stories_expires on public.stories(expires_at);

-- 4. Bảng Story Reactions (Thả tim & tương tác sinh mệnh Vamp)
create table if not exists public.story_reactions (
  id uuid default uuid_generate_v4() primary key,
  story_id uuid references public.stories(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  reaction_type text default 'heart',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_user_story_reaction unique (story_id, user_id)
);

create index if not exists idx_story_reactions_story on public.story_reactions(story_id);

-- 5. Bật Row Level Security (RLS)
alter table public.user_notes enable row level security;
alter table public.stories enable row level security;
alter table public.story_reactions enable row level security;

-- Policies cho user_notes
create policy "Mọi người đều có thể đọc notes còn hạn"
  on public.user_notes for select
  using (expires_at > now());

create policy "Người dùng có thể thêm hoặc sửa note của chính mình"
  on public.user_notes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Policies cho stories
create policy "Mọi người đều có thể xem stories còn hạn"
  on public.stories for select
  using (expires_at > now());

create policy "Người dùng có thể thêm story của mình"
  on public.stories for insert
  with check (auth.uid() = user_id);

create policy "Người dùng có thể xóa story của mình"
  on public.stories for delete
  using (auth.uid() = user_id);

create policy "Người dùng có thể cập nhật sinh mệnh story"
  on public.stories for update
  using (true)
  with check (true);

-- Policies cho story_reactions
create policy "Mọi người có thể đọc reactions story"
  on public.story_reactions for select
  using (true);

create policy "Người dùng có thể tương tác thả tim story"
  on public.story_reactions for insert
  with check (auth.uid() = user_id);

