-- Trigger tự động tạo hồ sơ profiles khi có người đăng ký tài khoản (auth.users)
create or replace function public.handle_new_user()
returns trigger as $$
declare
  base_username text;
  final_username text;
begin
  base_username := coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1), 'user');
  final_username := base_username;

  -- Đảm bảo username luôn duy nhất bằng cách thêm hậu tố nếu trùng
  if exists (select 1 from public.profiles where username = final_username and id != new.id) then
    final_username := base_username || '_' || substring(new.id::text, 1, 6);
  end if;

  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    final_username,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1), 'Thành viên Dorabox')
  )
  on conflict (id) do update set
    display_name = coalesce(excluded.display_name, public.profiles.display_name),
    updated_at = now();

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Đồng bộ toàn bộ tài khoản auth.users đã đăng ký trước đó vào bảng profiles (nếu chưa có)
insert into public.profiles (id, username, display_name)
select 
  id, 
  coalesce(raw_user_meta_data->>'username', split_part(email, '@', 1) || '_' || substring(id::text, 1, 4)),
  coalesce(raw_user_meta_data->>'display_name', split_part(email, '@', 1), 'Thành viên Dorabox')
from auth.users
where id not in (select id from public.profiles)
on conflict (id) do nothing;

-- Cấp quyền insert cho chính profile của user (phòng trường hợp trigger bị trễ)
drop policy if exists "Allow user to insert own profile" on public.profiles;
create policy "Allow user to insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Cấp quyền insert cho comments và reactions
drop policy if exists "Allow authenticated users to insert comments" on public.comments;
create policy "Allow authenticated users to insert comments" on public.comments
  for insert with check (auth.uid() = user_id);

drop policy if exists "Allow authenticated users to insert reactions" on public.post_reactions;
create policy "Allow authenticated users to insert reactions" on public.post_reactions
  for insert with check (auth.uid() = user_id);

drop policy if exists "Allow authenticated users to delete own reactions" on public.post_reactions;
create policy "Allow authenticated users to delete own reactions" on public.post_reactions
  for delete using (auth.uid() = user_id);

drop policy if exists "Allow public read comments" on public.comments;
create policy "Allow public read comments" on public.comments
  for select using (true);

drop policy if exists "Allow public read reactions" on public.post_reactions;
create policy "Allow public read reactions" on public.post_reactions
  for select using (true);

-- Cấp quyền xóa bài viết cho chính tác giả
drop policy if exists "Allow authors to delete own posts" on public.posts;
create policy "Allow authors to delete own posts" on public.posts
  for delete using (auth.uid() = author_id);

-- Cấp quyền cho conversations và messages (Tin nhắn)
drop policy if exists "Allow authenticated users to read conversations" on public.conversations;
create policy "Allow authenticated users to read conversations" on public.conversations
  for select using (auth.uid() = user_a or auth.uid() = user_b);

drop policy if exists "Allow authenticated users to insert conversations" on public.conversations;
create policy "Allow authenticated users to insert conversations" on public.conversations
  for insert with check (auth.uid() = user_a or auth.uid() = user_b);

drop policy if exists "Allow authenticated users to update conversations" on public.conversations;
create policy "Allow authenticated users to update conversations" on public.conversations
  for update using (auth.uid() = user_a or auth.uid() = user_b);

drop policy if exists "Allow authenticated users to read messages" on public.messages;
create policy "Allow authenticated users to read messages" on public.messages
  for select using (true);

drop policy if exists "Allow authenticated users to insert messages" on public.messages;
create policy "Allow authenticated users to insert messages" on public.messages
  for insert with check (auth.uid() = sender_id);

drop policy if exists "Allow authenticated users to update messages" on public.messages;
create policy "Allow authenticated users to update messages" on public.messages
  for update using (true);

-- =========================================================================
-- STORAGE BUCKETS (avatars & posts)
-- =========================================================================
insert into storage.buckets (id, name, public)
values 
  ('avatars', 'avatars', true),
  ('posts', 'posts', true)
on conflict (id) do update set public = true;

drop policy if exists "Allow public read storage objects" on storage.objects;
create policy "Allow public read storage objects" on storage.objects
  for select using (bucket_id in ('avatars', 'posts'));

drop policy if exists "Allow authenticated users to upload storage objects" on storage.objects;
create policy "Allow authenticated users to upload storage objects" on storage.objects
  for insert with check (bucket_id in ('avatars', 'posts') and auth.role() = 'authenticated');

drop policy if exists "Allow authenticated users to update storage objects" on storage.objects;
create policy "Allow authenticated users to update storage objects" on storage.objects
  for update using (bucket_id in ('avatars', 'posts') and auth.role() = 'authenticated');
-- Cập nhật ràng buộc cho bảng post_reactions hỗ trợ đủ ('like', 'love', 'wow', 'haha', 'sad', 'care')
alter table public.post_reactions drop constraint if exists post_reactions_reaction_type_check;
alter table public.post_reactions add constraint post_reactions_reaction_type_check 
  check (reaction_type in ('like', 'love', 'wow', 'haha', 'sad', 'care'));

-- Cấp quyền cập nhật cảm xúc cho chính chủ
drop policy if exists "Allow authenticated users to update own reactions" on public.post_reactions;
create policy "Allow authenticated users to update own reactions" on public.post_reactions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Bảng lưu cảm xúc cho bình luận (Comment Reactions)
create table if not exists public.comment_reactions (
  comment_id uuid references public.comments(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  reaction_type text default 'like' check (reaction_type in ('like', 'love', 'wow', 'haha', 'sad', 'care')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (comment_id, user_id)
);

alter table public.comment_reactions enable row level security;

drop policy if exists "Allow public read comment reactions" on public.comment_reactions;
create policy "Allow public read comment reactions" on public.comment_reactions
  for select using (true);

drop policy if exists "Allow authenticated users to insert comment reactions" on public.comment_reactions;
create policy "Allow authenticated users to insert comment reactions" on public.comment_reactions
  for insert with check (auth.uid() = user_id);

drop policy if exists "Allow authenticated users to delete own comment reactions" on public.comment_reactions;
create policy "Allow authenticated users to delete own comment reactions" on public.comment_reactions
  for delete using (auth.uid() = user_id);

drop policy if exists "Allow authenticated users to update own comment reactions" on public.comment_reactions;
create policy "Allow authenticated users to update own comment reactions" on public.comment_reactions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Thêm trường phục vụ quản trị viên kiểm duyệt
alter table public.profiles add column if not exists is_banned boolean default false;
alter table public.profiles add column if not exists role text default 'user';

-- Bổ sung tính năng chat: thu hồi, xóa phía tôi, ảnh và ghi âm, sửa tin nhắn
alter table public.messages add column if not exists is_recalled boolean default false;
alter table public.messages add column if not exists deleted_for uuid[] default array[]::uuid[];
alter table public.messages add column if not exists audio_url text;
alter table public.messages add column if not exists audio_duration integer default 0;
alter table public.messages add column if not exists is_edited boolean default false;
alter table public.messages add column if not exists edit_history jsonb default '[]'::jsonb;

-- RLS Policies cho bảng notifications
alter table public.notifications enable row level security;

drop policy if exists "Allow users to read own notifications" on public.notifications;
create policy "Allow users to read own notifications" on public.notifications
  for select using (auth.uid() = recipient_id);

drop policy if exists "Allow authenticated users to insert notifications" on public.notifications;
create policy "Allow authenticated users to insert notifications" on public.notifications
  for insert with check (auth.uid() = actor_id or recipient_id is not null);

drop policy if exists "Allow users to update own notifications" on public.notifications;
create policy "Allow users to update own notifications" on public.notifications
  for update using (auth.uid() = recipient_id);

drop policy if exists "Allow users to delete own notifications" on public.notifications;
create policy "Allow users to delete own notifications" on public.notifications
  for delete using (auth.uid() = recipient_id);

-- Thêm cột email vào profiles và hàm kiểm tra email tài khoản đã tồn tại hay chưa
alter table public.profiles add column if not exists email text;

create or replace function public.check_email_exists(lookup_email text)
returns boolean as $$
begin
  return exists (
    select 1 from auth.users where lower(email) = lower(trim(lookup_email))
  );
end;
$$ language plpgsql security definer;

grant execute on function public.check_email_exists(text) to anon, authenticated, service_role;

-- Đồng bộ email hiện có từ auth.users vào profiles
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id and p.email is null;

-- Phân quyền RLS cho bảng reports (Báo cáo vi phạm & Yêu cầu duyệt tích xanh)
alter table public.reports enable row level security;

drop policy if exists "Allow authenticated users to insert reports" on public.reports;
create policy "Allow authenticated users to insert reports" on public.reports
  for insert with check (auth.uid() = reporter_id);

drop policy if exists "Allow users to read own reports" on public.reports;
create policy "Allow users to read own reports" on public.reports
  for select using (auth.uid() = reporter_id);

drop policy if exists "Allow service role full access on reports" on public.reports;
create policy "Allow service role full access on reports" on public.reports
  for all using (true) with check (true);

-- Phân quyền RLS cho bảng user_blocks
alter table public.user_blocks enable row level security;

drop policy if exists "Allow users to manage own blocks" on public.user_blocks;
create policy "Allow users to manage own blocks" on public.user_blocks
  for all using (auth.uid() = blocker_id) with check (auth.uid() = blocker_id);

