-- =========================================================================
-- DORABOX - MIGRATION 21: BẢNG TÊN NGƯỜI DÙNG BỊ CẤM / BẢO LƯU (BANNED USERNAMES)
-- =========================================================================

create table if not exists public.banned_usernames (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  reason text default 'Tên người dùng không được phép sử dụng',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Chỉ mục tìm kiếm nhanh
create index if not exists idx_banned_usernames_username on public.banned_usernames (username);

-- Bật Row Level Security (RLS)
alter table public.banned_usernames enable row level security;

-- Cho phép mọi người (kể cả chưa đăng nhập) đọc danh sách tên cấm để app kiểm tra khi đăng ký/đổi tên
drop policy if exists "Allow public read banned_usernames" on public.banned_usernames;
create policy "Allow public read banned_usernames" on public.banned_usernames
  for select to public
  using (true);

-- Cho phép service_role toàn quyền thêm/xóa/sửa
drop policy if exists "Allow service role all on banned_usernames" on public.banned_usernames;
create policy "Allow service role all on banned_usernames" on public.banned_usernames
  for all to service_role
  using (true)
  with check (true);

-- Khởi tạo danh sách các tên bảo lưu mặc định của hệ thống Dorabox
insert into public.banned_usernames (username, reason) values
  ('admin', 'Bảo lưu tài khoản quản trị hệ thống'),
  ('administrator', 'Bảo lưu tài khoản quản trị hệ thống'),
  ('superadmin', 'Bảo lưu siêu quản trị viên'),
  ('dorabox', 'Tên thương hiệu chính thức Dorabox'),
  ('dorabox_admin', 'Bảo lưu ban quản trị Dorabox'),
  ('official', 'Bảo lưu tài khoản chính thức'),
  ('support', 'Bảo lưu bộ phận hỗ trợ khách hàng'),
  ('help', 'Bảo lưu trung tâm trợ giúp'),
  ('moderator', 'Bảo lưu kiểm duyệt viên'),
  ('system', 'Bảo lưu tiến trình hệ thống'),
  ('root', 'Bảo lưu tài khoản quản trị gốc'),
  ('security', 'Bảo lưu an ninh bảo mật'),
  ('api', 'Bảo lưu cổng kết nối hệ thống'),
  ('null', 'Từ khóa bảo lưu kỹ thuật'),
  ('undefined', 'Từ khóa bảo lưu kỹ thuật'),
  ('doraemon', 'Tên nhân vật bảo lưu bản quyền')
on conflict (username) do nothing;
