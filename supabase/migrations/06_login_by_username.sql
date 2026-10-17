-- =========================================================================
-- FUNCTION: get_email_by_username
-- Cho phép tra cứu Email từ Username để đăng nhập bằng Username
-- =========================================================================

create or replace function public.get_email_by_username(p_username text)
returns text as $$
declare
  clean_uname text;
  found_email text;
begin
  clean_uname := lower(trim(replace(p_username, '@', '')));
  
  select u.email into found_email
  from auth.users u
  join public.profiles p on p.id = u.id
  where lower(p.username) = clean_uname
  limit 1;
  
  return found_email;
end;
$$ language plpgsql security definer;

-- Cấp quyền gọi hàm cho client đã xác thực hoặc ẩn danh (anon)
grant execute on function public.get_email_by_username(text) to anon, authenticated, service_role;
