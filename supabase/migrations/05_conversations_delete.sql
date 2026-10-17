-- =========================================================================
-- DORABOX - MIGRATION 05: QUYỀN XÓA CUỘC TRÒ CHUYỆN & TIN NHẮN
-- =========================================================================

-- 1. Cho phép thành viên trong cuộc trò chuyện (user_a hoặc user_b) xóa cuộc trò chuyện
drop policy if exists "Allow authenticated users to delete conversations" on public.conversations;
create policy "Allow authenticated users to delete conversations" on public.conversations
  for delete to authenticated
  using (auth.uid() = user_a or auth.uid() = user_b);

-- 2. Cho phép xóa tin nhắn thuộc cuộc trò chuyện của mình
drop policy if exists "Allow authenticated users to delete messages" on public.messages;
create policy "Allow authenticated users to delete messages" on public.messages
  for delete to authenticated
  using (
    auth.uid() = sender_id 
    or exists (
      select 1 from public.conversations c 
      where c.id = messages.conversation_id 
      and (c.user_a = auth.uid() or c.user_b = auth.uid())
    )
  );
