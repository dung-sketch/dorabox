# 🐱 DORABOX - Mạng Xã Hội Mini Đa Năng (Android-First)

Nền tảng mạng xã hội mini cao cấp được thiết kế riêng cho **Android**, lấy cảm hứng thiết kế tối giản, trực quan và phối màu **Doraemon Luxe Theme** (Midnight Navy + Dora Bell Gold + Doraemon Blue + Collar Red). Hệ thống tích hợp hiệu ứng **Liquid Glass (Kính lỏng)** siêu mượt 120Hz, tương tác thời gian thực với Supabase và lưu trữ tối ưu chi phí qua Cloudflare R2.

---

## 🏗️ Kiến Trúc Hệ Thống

* **Client**: **Flutter Android** (Tối ưu hóa Edge-to-Edge trong suốt, Liquid Glass, Haptic Feedback).
* **BFF & Storage Broker**: **Node.js + TypeScript** (Tạo Presigned URLs upload trực tiếp lên Cloudflare R2).
* **Database & Realtime Engine & Admin**: **Supabase** (PostgreSQL, Triggers đếm tương tác, RLS, Supabase Studio Web Dashboard).
* **Media Storage**: **Cloudflare R2** (Zero Egress Fees - Không tốn phí tải ảnh bài viết và avatar).

---

## 🎨 Bộ Nhận Diện Màu Sắc Doraemon Luxe

| Tên màu | Mã Hex | Ý nghĩa & Vị trí ứng dụng |
| :--- | :--- | :--- |
| **Midnight Navy** | `#0A0E17` | Nền chính đen ánh xanh sâu thẳm, dịu mắt, sang trọng. |
| **Dora Bell Gold** | `#FFC837` | Chuông vàng Doraemon: Nút FAB viết bài, active tab, icon nút tìm người. |
| **Doraemon Blue** | `#0084FF` | Xanh thương hiệu: Tích xanh xác minh, liên kết web, trạng thái. |
| **Collar Red** | `#FF3B30` | Đỏ vòng cổ: Viền avatar, tim yêu thích, badge thông báo chưa đọc. |
| **Liquid Glass Surface** | `Color(0xCC111827)` | Kính lỏng phủ mờ BackdropFilter cho Top Bar, FAB và Floating Dock. |

---

## 🚀 Hướng Dẫn Khởi Động

### 1. Cơ sở dữ liệu Supabase
1. Mở [Supabase Dashboard](https://supabase.com).
2. Vào mục **SQL Editor**, mở file [01_dorabox_init.sql](file:///d:/ApcSources/Dorabox/supabase/migrations/01_dorabox_init.sql).
3. Nhấn **Run** để khởi tạo bảng `profiles`, `posts`, `post_reactions`, `comments`, `conversations`, `messages`, `notifications` cùng các Trigger tự động đếm.

### 2. Backend Node.js
```bash
cd backend
npm install
cp .env.example .env # Điền SUPABASE_URL và Cloudflare R2 credentials
npm run dev
```

### 3. Flutter Android App
```bash
cd mobile
flutter pub get
flutter run -d <android-device-or-emulator>
```
