-- =========================================================================
-- DORABOX SOCIAL NETWORK - DATABASE INITIALIZATION
-- =========================================================================

create extension if not exists "uuid-ossp";

-- 1. Profiles (Hồ sơ người dùng)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text not null,
  avatar_url text,
  bio text,
  is_verified boolean default false,
  is_vip boolean default false,
  fcm_token text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Posts (Bài viết cộng đồng)
create table if not exists public.posts (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  content text not null check (char_length(content) <= 5000),
  media_urls text[] default array[]::text[],
  link_url text,
  likes_count integer default 0,
  comments_count integer default 0,
  is_pinned boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Post Reactions (Cảm xúc: like, love, wow, haha, sad)
create table if not exists public.post_reactions (
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  reaction_type text default 'like' check (reaction_type in ('like', 'love', 'wow', 'haha', 'sad')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (post_id, user_id)
);

-- 4. Comments (Bình luận)
create table if not exists public.comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null check (char_length(content) <= 1000),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Conversations (Hộp thoại tin nhắn)
create table if not exists public.conversations (
  id uuid default uuid_generate_v4() primary key,
  user_a uuid references public.profiles(id) on delete cascade not null,
  user_b uuid references public.profiles(id) on delete cascade not null,
  last_message text,
  last_message_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_conversation unique (user_a, user_b)
);

-- 6. Messages (Nội dung chat realtime)
create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  media_url text,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Notifications (Thông báo)
create table if not exists public.notifications (
  id uuid default uuid_generate_v4() primary key,
  recipient_id uuid references public.profiles(id) on delete cascade not null,
  actor_id uuid references public.profiles(id) on delete cascade not null,
  action_type text not null, -- 'like', 'comment', 'message', 'vip'
  target_id uuid, -- post_id hoặc conversation_id
  content text,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- INDEXES CHO TRUY VẤN SIÊU NHANH
-- =========================================================================
create index if not exists idx_posts_created_at on public.posts (created_at desc);
create index if not exists idx_posts_author on public.posts (author_id);
create index if not exists idx_comments_post on public.comments (post_id, created_at asc);
create index if not exists idx_messages_conversation on public.messages (conversation_id, created_at asc);
create index if not exists idx_notifications_recipient on public.notifications (recipient_id, created_at desc);

-- =========================================================================
-- TRIGGERS CẬP NHẬT METRICS TỰ ĐỘNG
-- =========================================================================
create or replace function update_post_metrics()
returns trigger as $$
begin
  if (TG_OP = 'INSERT' and TG_TABLE_NAME = 'post_reactions') then
    update public.posts set likes_count = likes_count + 1 where id = NEW.post_id;
  elsif (TG_OP = 'DELETE' and TG_TABLE_NAME = 'post_reactions') then
    update public.posts set likes_count = greatest(0, likes_count - 1) where id = OLD.post_id;
  elsif (TG_OP = 'INSERT' and TG_TABLE_NAME = 'comments') then
    update public.posts set comments_count = comments_count + 1 where id = NEW.post_id;
  elsif (TG_OP = 'DELETE' and TG_TABLE_NAME = 'comments') then
    update public.posts set comments_count = greatest(0, comments_count - 1) where id = OLD.post_id;
  end if;
  return null;
end;
$$ language plpgsql;

drop trigger if exists tr_reactions_count on public.post_reactions;
create trigger tr_reactions_count
after insert or delete on public.post_reactions
for each row execute procedure update_post_metrics();

drop trigger if exists tr_comments_count on public.comments;
create trigger tr_comments_count
after insert or delete on public.comments
for each row execute procedure update_post_metrics();

-- Bật Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.post_reactions enable row level security;
alter table public.comments enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;

-- Policies cơ bản: Ai cũng có thể đọc bài viết & profile
create policy "Allow public read posts" on public.posts for select using (true);
create policy "Allow authenticated users to create posts" on public.posts for insert with check (auth.uid() = author_id);
create policy "Allow authors to update/delete posts" on public.posts for all using (auth.uid() = author_id);

create policy "Allow public read profiles" on public.profiles for select using (true);
create policy "Allow user to update own profile" on public.profiles for update using (auth.uid() = id);
