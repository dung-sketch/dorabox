-- =========================================================================
-- DORABOX - MIGRATION 16: OA INFORMATION EDITING & APPROVAL SYSTEM
-- =========================================================================

-- Bổ sung các trường thông tin chi tiết và cơ chế xét duyệt thay đổi cho tài khoản OA
alter table if exists public.profiles
add column if not exists oa_category text default 'Doanh nghiệp & Dịch vụ trực tuyến',
add column if not exists oa_status text default 'Trực tuyến 24/7 · Sẵn sàng giải đáp',
add column if not exists oa_info_edited_count integer default 0,
add column if not exists oa_pending_update jsonb default null,
add column if not exists oa_pending_status text default null; -- 'pending_approval' | 'approved' | 'rejected'

comment on column public.profiles.oa_category is 'Lĩnh vực hoạt động của Official Account';
comment on column public.profiles.oa_status is 'Trạng thái hoạt động hiển thị của Official Account';
comment on column public.profiles.oa_info_edited_count is 'Số lần đã sửa thông tin trực tiếp (tối đa 1 lần trực tiếp, các lần sau phải chờ ban quản trị phê duyệt)';
comment on column public.profiles.oa_pending_update is 'Dữ liệu thay đổi thông tin OA đang chờ ban quản trị xét duyệt';
comment on column public.profiles.oa_pending_status is 'Trạng thái yêu cầu duyệt thông tin OA';
