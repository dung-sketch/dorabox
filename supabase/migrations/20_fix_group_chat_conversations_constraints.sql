-- =========================================================================
-- DORABOX - MIGRATION 20: FIX CONSTRAINTS TẠO NHÓM & BẢO MẬT TIN NHẮN
-- =========================================================================

-- 1. Cho phép user_a và user_b nhận NULL đối với các cuộc trò chuyện nhóm (group chat)
alter table public.conversations alter column user_a drop not null;
alter table public.conversations alter column user_b drop not null;

-- 2. Gỡ bỏ unique constraint cũ (user_a, user_b) vốn chỉ dành cho chat 1-1
alter table public.conversations drop constraint if exists unique_conversation;

-- 3. Tạo partial unique index chỉ áp dụng cho chat cá nhân 1-1 (is_group = false)
create unique index if not exists idx_unique_direct_conversation
  on public.conversations (user_a, user_b)
  where (is_group is null or is_group = false);

-- 4. BẢO MẬT TUYỆT ĐỐI TIN NHẮN: Khắc phục lỗ hổng RLS đọc trộm & sửa trộm tin nhắn (loại bỏ using(true))
drop policy if exists "Allow authenticated users to read messages" on public.messages;
create policy "Allow authenticated users to read messages" on public.messages
  for select to authenticated
  using (
    exists (
      select 1 from public.conversations c 
      where c.id = messages.conversation_id and (
        c.user_a = auth.uid() or 
        c.user_b = auth.uid() or 
        c.created_by = auth.uid() or
        (c.is_group = true and c.member_ids ? auth.uid()::text)
      )
    )
  );

drop policy if exists "Allow authenticated users to update messages" on public.messages;
create policy "Allow authenticated users to update messages" on public.messages
  for update to authenticated
  using (
    exists (
      select 1 from public.conversations c 
      where c.id = messages.conversation_id and (
        c.user_a = auth.uid() or 
        c.user_b = auth.uid() or 
        c.created_by = auth.uid() or
        (c.is_group = true and c.member_ids ? auth.uid()::text)
      )
    )
  );

-- 5. BẢO MẬT BÁO CÁO VI PHẠM (REPORTS): Chặn người dùng đọc/sửa báo cáo của nhau (chỉ service_role mới có quyền toàn quyền)
drop policy if exists "Allow service role full access on reports" on public.reports;
create policy "Allow service role full access on reports" on public.reports
  for all to service_role using (true) with check (true);

