-- =========================================================================
-- DORABOX - MIGRATION 08: KÍCH HOẠT REALTIME CHO TIN NHẮN & CUỘC TRÒ CHUYỆN
-- =========================================================================

-- 1. Đặt replica identity full để Realtime Supabase gửi đầy đủ dữ liệu khi UPDATE/DELETE
alter table if exists public.messages replica identity full;
alter table if exists public.conversations replica identity full;

-- 2. Thêm messages và conversations vào publication supabase_realtime
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;

  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and tablename = 'conversations'
  ) then
    alter publication supabase_realtime add table public.conversations;
  end if;
end;
$$;

-- 3. Cấp quyền đọc cho authenticated users phục vụ streaming Realtime
grant select on public.messages to authenticated;
grant select on public.conversations to authenticated;
