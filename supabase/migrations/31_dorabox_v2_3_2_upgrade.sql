-- =========================================================================
-- DORABOX v2.3.2: ĐẠI NÂNG CẤP KỶ NIỆM SINH NHẬT 23 TUỔI & HỆ THỐNG MỚI
-- Hỗ trợ:
--  1. Độ tuổi tối thiểu 18+ bắt buộc (birth_date & check_min_age_18)
--  2. Hệ thống xác minh danh tính tài khoản (system_verification_status / system_verification_key)
--  3. Sinh nhật & D-Memories (Kỷ niệm Dorabox & chúc mừng sinh nhật thành viên)
--  4. Toàn bộ hàm quản trị RPC (Admin Badges, Bans, Hide, Role) SECURITY DEFINER
-- =========================================================================

-- 1. Cột ngày sinh & Ràng buộc bắt buộc 18+ tuổi
alter table public.profiles
  add column if not exists birth_date date;

alter table public.profiles drop constraint if exists check_min_age_18;
alter table public.profiles add constraint check_min_age_18
  check (birth_date is null or birth_date <= (current_date - interval '18 years'));

-- 2. Cột xác minh danh tính hệ thống (System Identity Verification)
alter table public.profiles
  add column if not exists system_verification_status text default 'verified'
  check (system_verification_status in ('unverified', 'pending', 'verified', 'rejected'));

alter table public.profiles
  add column if not exists system_verification_key text;

-- 3. Cột hỗ trợ Sinh nhật & Kỷ niệm Dorabox
alter table public.profiles
  add column if not exists is_birthday_hidden boolean default false;

-- 4. Đảm bảo Check constraint của verification_badge hỗ trợ đầy đủ các huy hiệu
alter table public.profiles drop constraint if exists profiles_verification_badge_check;
alter table public.profiles add constraint profiles_verification_badge_check
  check (verification_badge in ('none', 'blue', 'gold', 'dev', 'cyan', 'orange', 'green'));

-- 5. HÀM RPC QUẢN TRỊ: Cấp / Đổi Huy Hiệu Xác Minh (Bỏ qua RLS với SECURITY DEFINER)
create or replace function public.admin_set_user_badge(
  p_user_id uuid,
  p_badge text,
  p_is_verified boolean default false,
  p_is_oa boolean default false
) returns jsonb
language plpgsql
security definer
as $$
declare
  v_badge text;
  v_verified boolean;
  v_oa boolean;
  updated_row jsonb;
begin
  v_badge := lower(trim(coalesce(p_badge, 'none')));
  if v_badge = 'developer' or v_badge = 'startup' then v_badge := 'dev'; end if;

  v_verified := coalesce(p_is_verified, v_badge = 'blue');
  v_oa := coalesce(p_is_oa, (v_badge = 'gold' or v_badge = 'orange' or v_badge = 'green'));

  update public.profiles
  set
    verification_badge = v_badge,
    is_verified = v_verified,
    is_oa = v_oa,
    updated_at = timezone('utc'::text, now())
  where id = p_user_id;

  select to_jsonb(p) into updated_row from public.profiles p where p.id = p_user_id;
  return updated_row;
end;
$$;

grant execute on function public.admin_set_user_badge(uuid, text, boolean, boolean) to anon, authenticated, service_role;

-- 6. HÀM RPC QUẢN TRỊ: Đình Chỉ / Mở Khóa Tài Khoản
create or replace function public.admin_set_user_ban(
  p_user_id uuid,
  p_is_banned boolean,
  p_ban_type text default 'none',
  p_banned_until timestamp with time zone default null,
  p_ban_reason text default null
) returns jsonb
language plpgsql
security definer
as $$
declare
  updated_row jsonb;
begin
  update public.profiles
  set
    is_banned = coalesce(p_is_banned, false),
    ban_type = coalesce(p_ban_type, 'none'),
    banned_until = p_banned_until,
    ban_reason = p_ban_reason,
    updated_at = timezone('utc'::text, now())
  where id = p_user_id;

  select to_jsonb(p) into updated_row from public.profiles p where p.id = p_user_id;
  return updated_row;
end;
$$;

grant execute on function public.admin_set_user_ban(uuid, boolean, text, timestamp with time zone, text) to anon, authenticated, service_role;

-- 7. HÀM RPC QUẢN TRỊ: Ẩn / Hiện Tài Khoản Khỏi Toàn Hệ Thống
create or replace function public.admin_set_user_hidden(
  p_user_id uuid,
  p_is_hidden boolean
) returns jsonb
language plpgsql
security definer
as $$
declare
  updated_row jsonb;
begin
  update public.profiles
  set
    is_hidden = coalesce(p_is_hidden, false),
    updated_at = timezone('utc'::text, now())
  where id = p_user_id;

  select to_jsonb(p) into updated_row from public.profiles p where p.id = p_user_id;
  return updated_row;
end;
$$;

grant execute on function public.admin_set_user_hidden(uuid, boolean) to anon, authenticated, service_role;

-- 8. HÀM RPC QUẢN TRỊ: Phân Quyền Vai Trò (Admin / Moderator / User)
create or replace function public.admin_set_user_role(
  p_user_id uuid,
  p_role text
) returns jsonb
language plpgsql
security definer
as $$
declare
  updated_row jsonb;
begin
  update public.profiles
  set
    role = coalesce(p_role, 'user'),
    updated_at = timezone('utc'::text, now())
  where id = p_user_id;

  select to_jsonb(p) into updated_row from public.profiles p where p.id = p_user_id;
  return updated_row;
end;
$$;

grant execute on function public.admin_set_user_role(uuid, text) to anon, authenticated, service_role;

-- 9. Function Lấy kỷ niệm D-Memories (Bài viết ngày này năm xưa)
create or replace function public.get_user_memories(
  p_user_id uuid
) returns setof public.posts
language sql
stable
as $$
  select * from public.posts
  where author_id = p_user_id
    and (
      -- 1 tháng trước (khoảng 30 ngày)
      (created_at::date = (current_date - interval '1 month')::date)
      -- Hoặc cùng ngày tháng của các năm trước
      or (
        extract(month from created_at) = extract(month from current_date)
        and extract(day from created_at) = extract(day from current_date)
        and extract(year from created_at) < extract(year from current_date)
      )
    )
  order by created_at desc;
$$;

grant execute on function public.get_user_memories(uuid) to anon, authenticated, service_role;

