-- =========================================================================
-- DORABOX - MIGRATION 18: FIX RLS CHO PHÉP TẠO & CẬP NHẬT CONVERSATIONS
-- =========================================================================

-- 1. Cho phép thành viên trong cuộc hội thoại tạo cuộc trò chuyện
drop policy if exists "Allow authenticated users to insert conversations" on public.conversations;
create policy "Allow authenticated users to insert conversations" on public.conversations
  for insert to authenticated
  with check (
    auth.uid() = user_a or 
    auth.uid() = user_b or 
    auth.uid() = created_by or
    (is_group = true and member_ids ? auth.uid()::text)
  );

-- 2. Cho phép cập nhật tin nhắn cuối cùng (last_message, last_message_at)
drop policy if exists "Allow authenticated users to update conversations" on public.conversations;
create policy "Allow authenticated users to update conversations" on public.conversations
  for update to authenticated
  using (
    auth.uid() = user_a or 
    auth.uid() = user_b or 
    (is_group = true and member_ids ? auth.uid()::text)
  );
