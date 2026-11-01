-- =========================================================================
-- DORABOX v2.2.1: KHẮC PHỤC TRIỆT ĐỂ LỖI CẬP NHẬT HUY HIỆU & QUẢN TRỊ TRÊN PROFILES
-- Chạy file này trên Supabase SQL Editor để kích hoạt quyền quản trị tối cao
-- =========================================================================

-- 1. Cập nhật Check Constraint trên profiles để hỗ trợ 'dev' và 'cyan'
alter table public.profiles drop constraint if exists profiles_verification_badge_check;
alter table public.profiles add constraint profiles_verification_badge_check
  check (verification_badge in ('none', 'blue', 'gold', 'dev', 'cyan', 'orange', 'green'));

-- 2. HÀM RPC QUẢN TRỊ: Cấp / Đổi Huy Hiệu Xác Minh (Bỏ qua RLS với SECURITY DEFINER)
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

-- 3. HÀM RPC QUẢN TRỊ: Đình Chỉ / Mở Khóa Tài Khoản
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

-- 4. HÀM RPC QUẢN TRỊ: Ẩn / Hiện Tài Khoản Khỏi Toàn Hệ Thống
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

-- 5. HÀM RPC QUẢN TRỊ: Phân Quyền Vai Trò (Admin / Moderator / User)
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
