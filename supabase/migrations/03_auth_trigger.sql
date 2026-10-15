-- Trigger tự động tạo hồ sơ profiles khi có người đăng ký tài khoản (auth.users)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Cấp quyền insert cho comments và reactions
create policy "Allow authenticated users to insert comments" on public.comments
  for insert with check (auth.uid() = user_id);

create policy "Allow authenticated users to insert reactions" on public.post_reactions
  for insert with check (auth.uid() = user_id);

create policy "Allow authenticated users to delete own reactions" on public.post_reactions
  for delete using (auth.uid() = user_id);

create policy "Allow public read comments" on public.comments
  for select using (true);

create policy "Allow public read reactions" on public.post_reactions
  for select using (true);
