-- =========================================================================
-- DORABOX - MIGRATION 19: NHÓM TRÒ CHUYỆN TOÀN DIỆN & ĐỒNG BỘ ĐÃ XEM TIN NHẮN
-- =========================================================================

-- 1. Bổ sung các cột cho bảng conversations phục vụ quản lý nhóm & biệt danh
alter table if exists public.conversations 
  add column if not exists is_group boolean default false,
  add column if not exists name text,
  add column if not exists avatar_url text,
  add column if not exists created_by uuid references public.profiles(id) on delete set null,
  add column if not exists member_ids jsonb default '[]'::jsonb,
  add column if not exists nicknames jsonb default '{}'::jsonb;

-- 2. Đảm bảo quyền riêng tư trong bảng profiles (biên nhận đã xem & đang soạn tin)
alter table if exists public.profiles
  add column if not exists read_receipts_enabled boolean default true,
  add column if not exists show_typing_status boolean default true;

-- 3. Tạo chỉ mục tối ưu tìm kiếm nhóm
create index if not exists idx_conversations_is_group on public.conversations (is_group);
create index if not exists idx_conversations_created_by on public.conversations (created_by);

-- 4. Bật RLS cho conversations
alter table public.conversations enable row level security;

-- 5. Policy SELECT: Cho phép thành viên hoặc người tạo đọc hội thoại (cả 1-1 và nhóm)
drop policy if exists "Allow members to read group conversations" on public.conversations;
drop policy if exists "Allow authenticated users to read conversations" on public.conversations;
create policy "Allow authenticated users to read conversations" on public.conversations
  for select to authenticated
  using (
    auth.uid() = user_a or 
    auth.uid() = user_b or 
    auth.uid() = created_by or
    (is_group = true and member_ids ? auth.uid()::text)
  );

-- 6. Policy INSERT: Cho phép tạo cuộc trò chuyện cá nhân hoặc tạo nhóm
drop policy if exists "Allow authenticated users to insert conversations" on public.conversations;
create policy "Allow authenticated users to insert conversations" on public.conversations
  for insert to authenticated
  with check (
    auth.uid() = user_a or 
    auth.uid() = user_b or 
    auth.uid() = created_by or
    is_group = true
  );

-- 7. Policy UPDATE: Cho phép cập nhật tên nhóm, ảnh nhóm, biệt danh, thành viên và last_message
drop policy if exists "Allow authenticated users to update conversations" on public.conversations;
create policy "Allow authenticated users to update conversations" on public.conversations
  for update to authenticated
  using (
    auth.uid() = user_a or 
    auth.uid() = user_b or 
    auth.uid() = created_by or
    (is_group = true and member_ids ? auth.uid()::text)
  )
  with check (
    auth.uid() = user_a or 
    auth.uid() = user_b or 
    auth.uid() = created_by or
    (is_group = true and member_ids ? auth.uid()::text)
  );

-- 8. Policy DELETE: Cho phép người tạo nhóm giải tán nhóm, hoặc thành viên rời/xóa
drop policy if exists "Allow authenticated users to delete conversations" on public.conversations;
create policy "Allow authenticated users to delete conversations" on public.conversations
  for delete to authenticated
  using (
    auth.uid() = user_a or 
    auth.uid() = user_b or 
    auth.uid() = created_by or
    (is_group = true and member_ids ? auth.uid()::text)
  );

-- 9. Policy INSERT cho messages trong nhóm
drop policy if exists "Allow members to send messages in group" on public.messages;
drop policy if exists "Allow authenticated users to insert messages" on public.messages;
create policy "Allow authenticated users to insert messages" on public.messages
  for insert to authenticated
  with check (
    auth.uid() = sender_id and (
      exists (
        select 1 from public.conversations c 
        where c.id = conversation_id and (
          c.user_a = auth.uid() or 
          c.user_b = auth.uid() or 
          c.created_by = auth.uid() or
          (c.is_group = true and c.member_ids ? auth.uid()::text)
        )
      )
    )
  );

-- 10. Policy DELETE cho messages (Người gửi được xóa tin của mình, hoặc Trưởng nhóm được xóa tin trong nhóm)
drop policy if exists "Allow authenticated users to delete messages" on public.messages;
create policy "Allow authenticated users to delete messages" on public.messages
  for delete to authenticated
  using (
    auth.uid() = sender_id or exists (
      select 1 from public.conversations c 
      where c.id = messages.conversation_id and (
        c.user_a = auth.uid() or 
        c.user_b = auth.uid() or
        c.created_by = auth.uid()
      )
    )
  );
