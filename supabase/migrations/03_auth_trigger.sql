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
