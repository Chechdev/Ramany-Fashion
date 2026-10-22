# CHECH FASHION — HỆ THỐNG QUẢN LÝ SẢN PHẨM (MVP)

Website quản lý sản phẩm thời trang MVP được xây dựng với **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Supabase PostgreSQL** và **Prisma ORM**.

---

## 📋 Mục lục
1. [Giới thiệu tính năng](#-tính-năng-mvp)
2. [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
3. [Hướng dẫn cài đặt trên Windows từng bước](#-hướng-dẫn-cài-đặt-từng-bước-trên-windows)
   - [Bước 1: Chuẩn bị môi trường](#bước-1-chuẩn-bị-môi-trường)
   - [Bước 2: Cài đặt thư viện](#bước-2-cài-đặt-thư-viện)
   - [Bước 3: Tạo Database trên Supabase](#bước-3-tạo-database-trên-supabase)
   - [Bước 4: Cấu hình file .env](#bước-4-cấu-hình-file-env)
   - [Bước 5: Chạy Migration tạo bảng](#bước-5-chạy-migration-tạo-bảng-database)
   - [Bước 6: Nạp dữ liệu mẫu (Seed)](#bước-6-nạp-dữ-liệu-mẫu-seed)
   - [Bước 7: Khởi chạy website](#bước-7-khởi-chạy-website)
4. [Hướng dẫn kiểm thử và sử dụng](#-hướng-dẫn-kiểm-thử-và-sử-dụng)
5. [Khắc phục sự cố thường gặp](#-khắc-phục-sự-cố-thường-gặp)

---

## 🚀 Tính năng MVP

- **Quản lý sản phẩm (CRUD đầy đủ)**:
  - Xem danh sách sản phẩm với phân trang, lọc theo danh mục, trạng thái và tìm kiếm tức thì theo Tên / SKU.
  - Xem chi tiết từng sản phẩm (ảnh, giá bán, giá vốn, biên lợi nhuận %, tồn kho).
  - Thêm sản phẩm mới với xác thực dữ liệu chặt chẽ bằng Zod.
  - Chỉnh sửa thông tin sản phẩm và cập nhật trực tiếp vào database.
  - Xóa sản phẩm với modal xác nhận an toàn.
- **Nhập / Xuất CSV chuẩn tiếng Việt**:
  - Tải file CSV template mẫu có sẵn cột và dữ liệu minh họa.
  - Nhập hàng loạt sản phẩm từ file CSV (báo cáo chi tiết từng dòng hợp lệ, dòng lỗi, kiểm tra SKU trùng).
  - Xuất dữ liệu ra file CSV chuẩn UTF-8 có BOM (tương thích 100% với Microsoft Excel, không lỗi dấu tiếng Việt).
  - Xuất toàn bộ hoặc xuất theo danh sách đã lọc.
- **Thống kê kho hàng**:
  - Tự động tính toán tổng sản phẩm, sản phẩm đang hoạt động, sản phẩm hết hàng và tổng số lượng tồn kho.
- **Trạng thái kết nối Supabase**:
  - Đèn trạng thái trực quan kiểm tra kết nối database trực tuyến qua `/api/health`.

---

## 💻 Yêu cầu hệ thống

- **Hệ điều hành**: Windows 10/11 (hỗ trợ cả macOS và Linux)
- **Node.js**: Phiên bản LTS (Khuyến nghị Node.js v20.x hoặc v22.x/v24.x)
- **npm**: v10 trở lên
- **Tài khoản Supabase**: Miễn phí tại [supabase.com](https://supabase.com)

---

## 🛠 Hướng dẫn cài đặt từng bước trên Windows

### Bước 1: Chuẩn bị môi trường
1. Cài đặt **Node.js LTS** từ trang chủ: [https://nodejs.org/](https://nodejs.org/)
2. Mở **PowerShell** hoặc **Terminal** trong thư mục dự án và kiểm tra:
   ```powershell
   node -v
   npm -v
   ```

### Bước 2: Cài đặt thư viện
Nếu bạn mới clone mã nguồn về máy:
```powershell
npm install
```

### Bước 3: Tạo Database trên Supabase
1. Truy cập [https://supabase.com](https://supabase.com) và đăng nhập (hoặc đăng ký tài khoản miễn phí).
2. Nhấn **New project**:
   - **Name**: `chech-fashion` (hoặc tên tùy chọn)
   - **Database Password**: Nhập mật khẩu an toàn (hãy lưu lại mật khẩu này!).
   - **Region**: Chọn khu vực gần bạn nhất (ví dụ: `Singapore - ap-southeast-1`).
3. Chờ 1–2 phút để Supabase tạo database.
4. Lấy Connection String:
   - Vào mục **Project Settings** (biểu tượng bánh răng góc dưới bên trái) -> **Database**.
   - Cuộn xuống phần **Connection string**:
     - **URI (Session mode - Transaction Pooler, Port 6543 hoặc 5432)** dùng làm `DATABASE_URL`.
     - **Direct Connection (Port 5432)** dùng làm `DIRECT_URL`.
   - *Lưu ý*: Thay thế `[YOUR-PASSWORD]` bằng mật khẩu database bạn đã đặt ở bước 2.

### Bước 4: Cấu hình file `.env`
Trong thư mục gốc của dự án, sao chép file `.env.example` thành `.env`:
```powershell
Copy-Item .env.example .env
```
Mở file `.env` và điền chuỗi kết nối Supabase của bạn:
```env
# Connection pooler cho runtime
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection cho Prisma migration
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

NODE_ENV="development"
```

> ⚠️ **Lưu ý bảo mật**: File `.env` chứa mật khẩu database thật, tuyệt đối không commit file này lên GitHub!

### Bước 5: Chạy Migration tạo bảng Database
Chạy lệnh Prisma migration để tự động tạo bảng `products` trên Supabase:
```powershell
npm run prisma:migrate
```
*Hệ thống sẽ hỏi đặt tên cho migration, bạn có thể nhập: `init`.*

Sau khi chạy xong, bạn có thể vào **Supabase Dashboard** -> **Table Editor** sẽ thấy bảng `products` đã được tạo với đầy đủ các cột và index!

### Bước 6: Nạp dữ liệu mẫu (Seed)
Nạp sẵn 8 sản phẩm thời trang mẫu (áo thun, sơ mi, quần jeans, đầm, áo khoác) để kiểm thử:
```powershell
npm run seed
```
Script seed sử dụng cơ chế `upsert` theo SKU an toàn, bạn có thể chạy lại nhiều lần mà không sợ bị trùng dữ liệu.

### Bước 7: Khởi chạy website
Chạy máy chủ phát triển Next.js:
```powershell
npm run dev
```
Mở trình duyệt web và truy cập:
👉 **[http://localhost:1809](http://localhost:1809)**

---

## 🧪 Hướng dẫn kiểm thử và sử dụng

1. **Kiểm tra trạng thái kết nối**: Nhìn góc trên bên trái Header, bạn sẽ thấy huy hiệu xanh lá `Supabase Online`.
2. **Thêm sản phẩm**:
   - Bấm **Thêm sản phẩm**.
   - Nhập SKU, Tên, Giá, Danh mục...
   - Nhấn **Thêm vào Database**. Sản phẩm sẽ xuất hiện ngay trên bảng và lưu vào Supabase.
3. **Tìm kiếm & Lọc**:
   - Gõ tên hoặc SKU vào ô tìm kiếm.
   - Chọn Danh mục hoặc Trạng thái để kiểm tra tính năng lọc backend.
4. **Chỉnh sửa / Xóa**:
   - Nhấn biểu tượng bút chì để sửa giá hoặc tồn kho.
   - Nhấn biểu tượng thùng rác để xác nhận xóa.
5. **Nhập CSV**:
   - Bấm **Nhập CSV** -> bấm **Tải file mẫu** để xem cấu trúc CSV.
   - Chọn file CSV và bấm **Bắt đầu nhập dữ liệu**.
   - Báo cáo kết quả sẽ hiển thị số dòng thành công hoặc lỗi chi tiết.
6. **Xuất CSV**:
   - Bấm **Xuất CSV** -> chọn **Xuất tất cả** hoặc **Xuất theo bộ lọc**.
   - Mở file `.csv` vừa tải về bằng Microsoft Excel để xác minh hiển thị chuẩn tiếng Việt có dấu.
7. **Kiểm tra tính bền vững (Persistence)**:
   - Tắt terminal (`Ctrl + C`) để dừng server.
   - Chạy lại `npm run dev`.
   - Toàn bộ dữ liệu sản phẩm vẫn giữ nguyên vẹn vì đã được lưu trên đám mây Supabase PostgreSQL.

---

## 🔧 Khắc phục sự cố thường gặp

### 1. Lỗi: `Environment variable not found: DATABASE_URL`
- **Nguyên nhân**: Chưa tạo file `.env` hoặc chưa điền `DATABASE_URL`.
- **Cách sửa**: Tạo file `.env` từ `.env.example` và điền connection string Supabase.

### 2. Lỗi kết nối Supabase: `P1001: Can't reach database server`
- **Nguyên nhân**: Mật khẩu database sai, project Supabase đang bị tạm dừng (paused), hoặc tường lửa/mạng chặn port 5432/6543.
- **Cách sửa**:
  1. Kiểm tra mật khẩu trong connection string đã thay thế đúng chưa (lưu ý các ký tự đặc biệt trong mật khẩu cần URL encode nếu có).
  2. Vào Supabase Dashboard kiểm tra trạng thái Project đang `Active`.
  3. Thử chuyển sang kết nối qua IPv4 / Pooler.

### 3. Cập nhật schema Prisma khi muốn thêm trường mới
Khi cần sửa đổi `prisma/schema.prisma`:
```powershell
npm run prisma:migrate
npm run prisma:generate
```

---

## 📦 Công nghệ sử dụng
- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **TypeScript** (Strict mode)
- **Tailwind CSS 4**
- **Prisma ORM 6**
- **Supabase PostgreSQL**
- **Zod 4**
- **PapaParse** & **Lucide React**
