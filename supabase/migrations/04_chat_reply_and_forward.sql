-- 04_chat_reply_and_forward.sql
-- Bổ sung trường hỗ trợ Trả lời (Reply) và Chuyển tiếp (Forward) tin nhắn

alter table public.messages add column if not exists reply_to jsonb;
alter table public.messages add column if not exists is_forwarded boolean default false;

-- Tạo index tăng tốc truy vấn nếu cần tìm tin nhắn được trả lời
create index if not exists idx_messages_reply_to on public.messages using gin (reply_to);
