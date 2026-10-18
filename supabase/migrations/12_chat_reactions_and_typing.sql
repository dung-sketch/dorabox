-- Migration 12: Thêm reactions cho tin nhắn và trạng thái đang soạn tin cho profiles
alter table public.messages add column if not exists reactions jsonb default '{}'::jsonb;
alter table public.profiles add column if not exists show_typing_status boolean default true;
alter table public.profiles add column if not exists read_receipts_enabled boolean default true;
