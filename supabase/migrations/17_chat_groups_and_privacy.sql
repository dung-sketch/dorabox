-- Migration 17: Hỗ trợ Nhóm trò chuyện (Group Chat) và Quyền riêng tư tin nhắn
-- 1. Bổ sung các cột cho bảng conversations
alter table if exists public.conversations 
  add column if not exists is_group boolean default false,
  add column if not exists name text,
  add column if not exists avatar_url text,
  add column if not exists created_by uuid references public.profiles(id) on delete set null,
  add column if not exists member_ids jsonb default '[]'::jsonb;

-- 2. Bổ sung quyền riêng tư tin nhắn trong bảng profiles
alter table if exists public.profiles
  add column if not exists read_receipts_enabled boolean default true,
  add column if not exists show_typing_status boolean default true;

-- 3. Cập nhật RLS Policy để cho phép thành viên nhóm đọc cuộc hội thoại
drop policy if exists "Allow members to read group conversations" on public.conversations;
create policy "Allow members to read group conversations" on public.conversations
  for select using (
    auth.uid() = user_a or 
    auth.uid() = user_b or 
    (is_group = true and member_ids ? auth.uid()::text)
  );

-- 4. Cho phép thành viên nhóm gửi tin nhắn
drop policy if exists "Allow members to send messages in group" on public.messages;
create policy "Allow members to send messages in group" on public.messages
  for insert with check (
    auth.uid() = sender_id and (
      exists (
        select 1 from public.conversations c 
        where c.id = conversation_id and (
          c.user_a = auth.uid() or 
          c.user_b = auth.uid() or 
          (c.is_group = true and c.member_ids ? auth.uid()::text)
        )
      )
    )
  );
