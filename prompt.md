# MASTER PROMPT — XÂY DỰNG CHECH FASHION MVP
## Website bán quần áo — Next.js + TypeScript + Supabase PostgreSQL + Prisma

## 1. VAI TRÒ VÀ NHIỆM VỤ

Bạn là Senior Full-stack Developer, có kinh nghiệm thực tế với Next.js, TypeScript, PostgreSQL, Supabase, Prisma ORM và thiết kế hệ thống thương mại điện tử.

Nhiệm vụ của bạn là trực tiếp xây dựng một dự án MVP cho website bán quần áo có tên tạm thời là CHECH FASHION.

Mục tiêu giai đoạn đầu không phải là tạo một website thương mại điện tử phức tạp, mà là tạo một website nhỏ, dễ sử dụng, chạy được thực tế và có thể xác minh rằng dữ liệu được lưu trong database trực tuyến.

Ưu tiên cao nhất:

1. Kết nối thành công Supabase PostgreSQL.
2. Thêm, xem, sửa, xóa sản phẩm bằng database thật.
3. Nhập dữ liệu từ CSV vào database.
4. Xuất dữ liệu từ database ra CSV.
5. Dữ liệu vẫn còn sau khi tắt và khởi động lại website.
6. Có hướng dẫn cài đặt và triển khai rõ ràng trên Windows.
7. Có nền tảng đủ tốt để phát triển thành website bán hàng hoàn chỉnh trong tương lai.

Không chỉ đưa ra kế hoạch hoặc đoạn code minh họa. Hãy tạo và chỉnh sửa trực tiếp các file trong workspace nếu môi trường cho phép, cài đặt dependency, chạy kiểm thử và sửa lỗi.

Nếu không thể trực tiếp thao tác file hoặc kết nối tài khoản, hãy cung cấp chính xác các file cần tạo, nội dung code, lệnh chạy và các bước mà người dùng cần thực hiện.

Không tuyên bố đã kết nối database hoặc kiểm thử thành công khi chưa có bằng chứng thực tế.

---

## 2. PHẠM VI GIAI ĐOẠN MVP

### Các chức năng bắt buộc

- Trang quản lý sản phẩm.
- Hiển thị dữ liệu từ Supabase PostgreSQL.
- Thêm sản phẩm.
- Xem chi tiết sản phẩm.
- Chỉnh sửa sản phẩm.
- Xóa sản phẩm sau khi xác nhận.
- Tìm kiếm theo tên hoặc SKU.
- Lọc theo danh mục và trạng thái.
- Phân trang dữ liệu.
- Nhập dữ liệu sản phẩm từ CSV.
- Xuất toàn bộ dữ liệu sản phẩm ra CSV.
- Xuất dữ liệu sau khi lọc ra CSV.
- Tải file CSV mẫu.
- Thống kê tổng sản phẩm, sản phẩm đang hoạt động, sản phẩm hết hàng và tổng tồn kho.
- Hiển thị thông báo thành công, lỗi và trạng thái đang xử lý.
- Kiểm tra kết nối database.
- Seed một số sản phẩm mẫu vào database để kiểm thử.
- Có tài liệu README hướng dẫn cài đặt, chạy và khắc phục lỗi.

### Chưa triển khai trong giai đoạn đầu

- Giỏ hàng.
- Checkout.
- Thanh toán trực tuyến.
- Tích hợp COD hoàn chỉnh.
- Quản lý vận chuyển.
- Tài khoản khách hàng.
- Hệ thống khuyến mãi.
- Đa ngôn ngữ.
- Đa tiền tệ.
- AI chatbot.
- Báo cáo doanh thu nâng cao.
- Hiệu ứng giao diện phức tạp.

Không phát triển những chức năng trên trước khi các chức năng database, CRUD và CSV được kiểm thử thành công.

---

## 3. CÔNG NGHỆ BẮT BUỘC

Sử dụng bộ công nghệ sau:

- Next.js App Router.
- TypeScript với strict mode.
- React.
- Tailwind CSS.
- Supabase PostgreSQL làm database chính.
- Prisma ORM để quản lý schema, truy vấn database và migration.
- Zod để kiểm tra dữ liệu.
- Papa Parse hoặc thư viện CSV tương đương.
- Lucide React cho icon.
- Git và GitHub để quản lý mã nguồn.
- Node.js LTS.
- npm để quản lý dependency.

Ưu tiên phiên bản ổn định, tương thích tại thời điểm phát triển.

Kiểm tra phiên bản Prisma và Next.js thực tế trước khi cấu hình. Tuân theo hướng dẫn chính thức của phiên bản đã chọn, không sao chép máy móc cấu hình từ phiên bản cũ.

Không cần Docker, Redis, microservices, message queue hoặc cơ sở dữ liệu thứ hai trong MVP.

Không sử dụng mock database, localStorage hoặc file JSON để thay thế Supabase PostgreSQL.

Có thể dùng dữ liệu mẫu để seed, nhưng mọi dữ liệu sau khi tạo phải được đọc và ghi từ database thật.

---

## 4. THIẾT KẾ GIAO DIỆN

Tạo giao diện quản trị sản phẩm đơn giản, hiện đại, chuyên nghiệp và dễ sử dụng.

Phong cách:
- Nền trắng hoặc xám nhạt.
- Chữ đen và xám đậm.
- Điểm nhấn tối giản.
- Bo góc nhẹ.
- Khoảng cách hợp lý.
- Bảng dữ liệu rõ ràng.
- Responsive cho máy tính và điện thoại.
- Không lạm dụng animation hoặc hiệu ứng.
- Không yêu cầu logo hay ảnh thương hiệu thật ở giai đoạn này.

Tên thương hiệu tạm thời: CHECH FASHION.

Ngôn ngữ giao diện: tiếng Việt.

### 4.1. Header

Hiển thị:
- CHECH FASHION.
- Tiêu đề Quản lý sản phẩm.
- Nút Thêm sản phẩm.
- Nút Nhập CSV.
- Nút Xuất CSV.
- Trạng thái kết nối database nếu kiểm tra được.

### 4.2. Thống kê

Hiển thị bốn chỉ số:

- Tổng số sản phẩm.
- Sản phẩm đang hoạt động.
- Sản phẩm hết hàng.
- Tổng số lượng tồn kho.

Tính toán từ dữ liệu thực tế trong database, không viết số cố định.

### 4.3. Tìm kiếm và bộ lọc

Cung cấp:

- Tìm theo tên sản phẩm.
- Tìm theo SKU.
- Lọc theo danh mục.
- Lọc theo trạng thái.
- Phân trang.
- Chọn số dòng mỗi trang nếu phù hợp.

Tìm kiếm, lọc và phân trang phải thực hiện ở backend. Không tải toàn bộ database về trình duyệt chỉ để lọc.

### 4.4. Bảng sản phẩm

Các cột:

- Ảnh.
- SKU.
- Tên sản phẩm.
- Danh mục.
- Đối tượng sử dụng.
- Size.
- Màu sắc.
- Giá bán.
- Giá vốn.
- Tồn kho.
- Trạng thái.
- Ngày cập nhật.
- Thao tác.

Thao tác:
- Xem.
- Sửa.
- Xóa.

Nếu chưa có ảnh, hiển thị placeholder. Không để URL ảnh không hợp lệ làm hỏng giao diện.

### 4.5. Form sản phẩm

Tạo form dùng chung cho chức năng thêm và sửa.

Các trường:
- SKU.
- Tên sản phẩm.
- Mô tả.
- Danh mục.
- Đối tượng sử dụng.
- Giá bán.
- Giá vốn.
- Số lượng tồn kho.
- Size.
- Màu sắc.
- URL ảnh.
- Trạng thái.

Yêu cầu:
- Kiểm tra dữ liệu phía client để cải thiện trải nghiệm.
- Bắt buộc kiểm tra lại dữ liệu ở backend.
- Hiển thị lỗi bằng tiếng Việt.
- Hiển thị trạng thái đang lưu.
- Ngăn gửi form nhiều lần liên tiếp.
- Đóng form sau khi lưu thành công.
- Cập nhật danh sách sau khi thêm hoặc sửa.
- Giá tiền phải hiển thị rõ ràng và không bị sai do chuyển đổi kiểu số.

### 4.6. Xóa sản phẩm

Khi nhấn Xóa, phải yêu cầu xác nhận.

Nếu xóa thất bại, hiển thị lỗi thực tế.

Không xóa dữ liệu chỉ bằng cách loại bỏ dòng khỏi giao diện.

---

## 5. THIẾT KẾ SUPABASE POSTGRESQL

Supabase là nơi lưu dữ liệu chính thức của dự án.

Website phải có khả năng truy cập database từ các môi trường khác nhau mà không phụ thuộc vào máy tính đang chạy code.

### 5.1. Tạo project Supabase

Hướng dẫn người dùng:

1. Truy cập https://supabase.com/
2. Đăng ký hoặc đăng nhập.
3. Tạo project mới.
4. Đặt tên project phù hợp.
5. Đặt mật khẩu database mạnh.
6. Chọn khu vực phù hợp với khách hàng mục tiêu.
7. Mở mục Connect hoặc Database.
8. Lấy connection string phù hợp.
9. Cấu hình connection string trong file `.env`.
10. Chạy migration và kiểm tra database.

Không yêu cầu người dùng cung cấp mật khẩu database, token hoặc API key bí mật trong hội thoại.

Gói Free được ưu tiên cho thử nghiệm. Kiểm tra hạn mức và điều khoản hiện hành trước khi triển khai kinh doanh chính thức.

### 5.2. Cấu hình kết nối

Tạo `.env.example`:

    DATABASE_URL="YOUR_SUPABASE_POSTGRES_CONNECTION_STRING"
    DIRECT_URL="YOUR_SUPABASE_DIRECT_CONNECTION_STRING"

Các giá trị trên chỉ là placeholder.

Cấu hình Prisma phù hợp với phiên bản được cài đặt và phương thức kết nối Supabase thực tế.

Nếu sử dụng connection pooling cho runtime và kết nối direct cho migration, hãy cấu hình đúng theo tài liệu của phiên bản Prisma và Supabase. Nếu cấu hình hiện tại không cần `DIRECT_URL`, bỏ biến đó và giải thích rõ.

Không tự động giả định rằng tất cả dự án đều phải sử dụng hai connection string.

Không commit file `.env` thật lên GitHub.

Không đưa connection string database, mật khẩu, secret key hoặc service role key vào mã JavaScript gửi tới trình duyệt.

### 5.3. Prisma client

Tạo Prisma client dùng chung tại `src/lib/prisma.ts` hoặc vị trí phù hợp với cấu trúc dự án.

Tránh khởi tạo quá nhiều Prisma client trong quá trình hot reload ở môi trường development.

Xử lý lỗi kết nối database rõ ràng. Không tự động chuyển sang mock data nếu database bị lỗi.

### 5.4. Prisma migration

- Tạo schema.
- Tạo migration đầu tiên.
- Chạy migration để tạo bảng.
- Kiểm tra bảng xuất hiện trong Supabase Table Editor.
- Có seed script.
- Không dùng `prisma migrate reset` trên database đang có dữ liệu.
- Không xóa hoặc ghi đè dữ liệu cũ trong quá trình khởi động thông thường.

Nếu phiên bản Prisma yêu cầu cấu hình adapter hoặc cách khai báo connection string khác, hãy sử dụng cấu hình chính thức phù hợp với phiên bản đó.

---

## 6. DATABASE SCHEMA

Tạo model `Product` với các trường:

- `id`: UUID, khóa chính.
- `sku`: mã sản phẩm, bắt buộc và duy nhất.
- `name`: tên sản phẩm, bắt buộc.
- `description`: mô tả, có thể null.
- `category`: danh mục.
- `gender`: đối tượng sử dụng, ví dụ Men, Women, Unisex.
- `price`: Decimal, không âm.
- `costPrice`: Decimal, có thể null và không âm.
- `stockQuantity`: số nguyên không âm.
- `size`: kích cỡ, ví dụ S, M, L, XL.
- `color`: màu sắc.
- `imageUrl`: URL ảnh, có thể null.
- `status`: ACTIVE hoặc INACTIVE.
- `createdAt`: thời gian tạo.
- `updatedAt`: thời gian cập nhật tự động.

Yêu cầu database:

1. UUID làm khóa chính.
2. SKU duy nhất, không phân biệt chữ hoa và chữ thường.
3. Tạo unique constraint hoặc index phù hợp để ngăn SKU trùng ngay ở database.
4. Giá tiền dùng Decimal, không dùng Float để lưu tiền.
5. Tồn kho phải là số nguyên không âm.
6. Tạo index phù hợp cho tìm kiếm, lọc và sắp xếp.
7. Có ràng buộc database cho các điều kiện quan trọng nếu phù hợp.
8. Không lưu ảnh nhị phân trong bảng sản phẩm.
9. Không tự động xóa bản ghi không liên quan.
10. Không sử dụng `any` nếu có thể định nghĩa kiểu TypeScript chính xác.

Trong giai đoạn đầu, mỗi biến thể size/màu được xem như một SKU riêng.

Ví dụ:

- TS001-M-BLACK: áo thun size M, màu đen.
- TS001-L-BLACK: áo thun size L, màu đen.

Mỗi biến thể có giá và tồn kho riêng.

Có thể chuẩn hóa danh mục hoặc biến thể thành bảng riêng ở giai đoạn sau, nhưng không làm kiến trúc MVP phức tạp không cần thiết.

---

## 7. NHẬP DỮ LIỆU CSV

Đây là chức năng bắt buộc.

### 7.1. Định dạng CSV

Sử dụng các cột:

    sku,name,description,category,gender,price,costPrice,stockQuantity,size,color,imageUrl,status

Dữ liệu mẫu:

    TS001,Classic T-Shirt,Simple cotton shirt,T-Shirts,Unisex,15.00,7.00,50,M,Black,,ACTIVE
    TS002,Premium Shirt,Premium cotton shirt,Shirts,Men,25.00,12.00,20,L,White,,ACTIVE

Đây chỉ là dữ liệu minh họa để seed hoặc tải template. Không được coi các dòng trên là dữ liệu đã được lưu nếu chưa ghi vào Supabase thành công.

### 7.2. Quy trình import

1. Người dùng chọn file CSV từ máy tính.
2. Hiển thị tên file và số dòng dự kiến.
3. Đọc file ở backend hoặc truyền file lên endpoint backend.
4. Parse CSV đúng chuẩn.
5. Kiểm tra header.
6. Chuẩn hóa khoảng trắng.
7. Validate dữ liệu bằng Zod.
8. Kiểm tra SKU trùng trong file.
9. Kiểm tra SKU đã tồn tại trong database.
10. Ghi dữ liệu hợp lệ vào Supabase.
11. Trả về báo cáo chi tiết.

Mặc định sử dụng chế độ Add New Only.

Không tự động ghi đè sản phẩm đang có.

Nếu có chế độ Update Existing, phải để riêng, yêu cầu người dùng chủ động chọn và kiểm tra kỹ các trường được phép cập nhật.

### 7.3. Báo cáo import

Hiển thị:

- Tổng số dòng.
- Số dòng hợp lệ.
- Số dòng thành công.
- Số dòng thất bại.
- SKU bị trùng.
- Các dòng sai giá.
- Các dòng sai tồn kho.
- Các lỗi dữ liệu khác.

Mỗi lỗi cần có số dòng và nguyên nhân dễ hiểu.

Một dòng lỗi không được khiến người dùng mất toàn bộ dữ liệu đã nhập thành công trước đó.

Có thể xử lý từng dòng hợp lệ trong transaction riêng hoặc theo các batch có giới hạn. Chọn cách phù hợp với số lượng dữ liệu và hạn mức Supabase.

Không xử lý hàng trăm nghìn dòng trong một request đồng bộ. Đặt giới hạn kích thước file và số dòng import ở mức hợp lý.

Không cho phép file upload truy cập tùy ý vào hệ thống file server.

### 7.4. CSV tiếng Việt

Hỗ trợ:
- UTF-8.
- UTF-8 có BOM.
- Tên sản phẩm có dấu tiếng Việt.
- Nội dung có dấu phẩy trong trường được đặt trong dấu ngoặc kép.
- Dòng dữ liệu rỗng.
- Header không hợp lệ.
- Giá trị số không hợp lệ.

Tạo nút Download CSV Template để người dùng tải file mẫu đúng định dạng.

---

## 8. XUẤT DỮ LIỆU CSV

Tạo hai lựa chọn:

1. Xuất toàn bộ sản phẩm.
2. Xuất sản phẩm theo bộ lọc hiện tại.

Yêu cầu:

- Đọc dữ liệu từ Supabase PostgreSQL.
- Không sử dụng dữ liệu hardcode.
- Xuất header rõ ràng.
- UTF-8 có BOM để Excel hỗ trợ tiếng Việt.
- Giá tiền không bị sai định dạng.
- Tên file dạng `products_YYYY-MM-DD.csv`.
- Xử lý đúng nội dung có dấu phẩy, dấu ngoặc kép và xuống dòng.
- Không xuất các trường bí mật hoặc trường nội bộ không cần thiết.
- Bảo vệ chống CSV formula injection với các ô bắt đầu bằng ký tự nguy hiểm như `=`, `+`, `-`, `@`, tab hoặc carriage return theo cách phù hợp.
- Nếu database lỗi, trả lỗi HTTP phù hợp và không tạo file giả.
- Không xuất dữ liệu mà người dùng không có quyền truy cập.

Các lựa chọn lọc khi xuất phải sử dụng cùng điều kiện tìm kiếm, danh mục và trạng thái đang áp dụng trên bảng.

---

## 9. BACKEND API

Sử dụng Next.js Route Handlers.

Thiết kế API:

- `GET /api/products`: tìm kiếm, lọc và phân trang.
- `POST /api/products`: tạo sản phẩm.
- `GET /api/products/[id]`: xem chi tiết.
- `PATCH /api/products/[id]`: cập nhật.
- `DELETE /api/products/[id]`: xóa.
- `POST /api/products/import`: nhập CSV.
- `GET /api/products/export`: xuất CSV.
- `GET /api/health`: kiểm tra trạng thái ứng dụng và database.

### Yêu cầu backend

- Validate request bằng Zod.
- Kiểm tra kiểu dữ liệu.
- Trả status code HTTP hợp lý.
- Chuẩn hóa JSON response.
- Không trả stack trace ra frontend.
- Không để lộ connection string hoặc secret.
- Xử lý lỗi SKU trùng.
- Xử lý ID không tồn tại.
- Giới hạn page size.
- Giới hạn số dòng import.
- Kiểm tra quyền trước mọi thao tác quản trị.
- Không tin giá tiền hoặc số lượng do frontend gửi mà chưa xác thực.
- Không cho phép người lạ tạo, sửa, xóa sản phẩm.
- Không truy vấn toàn bộ bảng khi chỉ cần một trang dữ liệu.

Endpoint health chỉ được trả về trạng thái như `ok`, `degraded` hoặc `error`. Không trả password, connection string hoặc thông tin nhạy cảm.

---

## 10. BẢO MẬT VÀ PHÂN QUYỀN

Website quản trị phải có cơ chế bảo vệ trước khi triển khai công khai.

Ở giai đoạn local, có thể thử nghiệm không cần đăng nhập. Tuy nhiên, không được công khai endpoint quản trị không xác thực trên Internet.

Yêu cầu:

1. Không đưa `DATABASE_URL` vào client bundle.
2. Không đưa service role key hoặc secret key vào frontend.
3. Không commit `.env` thật lên GitHub.
4. Thêm `.env` vào `.gitignore`.
5. Validate dữ liệu ở server.
6. Giới hạn kích thước file CSV.
7. Không render mô tả sản phẩm dưới dạng HTML tùy ý.
8. Thêm xác thực quản trị trước khi public.
9. Kiểm tra quyền trong backend cho từng thao tác.
10. Chỉ cấp quyền cần thiết.
11. Không coi việc ẩn nút quản trị là bảo mật.
12. Không coi CORS là biện pháp xác thực.
13. Không cho phép trình duyệt truy cập database bằng quyền quản trị.
14. Không lưu thông tin thẻ thanh toán.
15. Không yêu cầu khách hàng cung cấp dữ liệu cá nhân không cần thiết trong MVP.

Nếu sử dụng Supabase Auth, phải kiểm tra role ở server và bảo vệ mọi API quản trị.

Nếu trình duyệt truy cập trực tiếp Supabase Data API trong tương lai, phải cấu hình RLS đúng với từng bảng. Không bật quyền ghi công khai.

Nếu chỉ truy cập database qua Prisma ở backend, vẫn phải bảo vệ backend bằng xác thực và phân quyền thích hợp.

---

## 11. CẤU TRÚC THƯ MỤC

Tạo cấu trúc đơn giản, dễ hiểu:

    fashion-store/
    ├── prisma/
    │   ├── schema.prisma
    │   ├── migrations/
    │   └── seed.ts
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx
    │   │   ├── layout.tsx
    │   │   ├── globals.css
    │   │   └── api/
    │   │       ├── health/
    │   │       │   └── route.ts
    │   │       └── products/
    │   │           ├── route.ts
    │   │           ├── [id]/
    │   │           │   └── route.ts
    │   │           ├── import/
    │   │           │   └── route.ts
    │   │           └── export/
    │   │               └── route.ts
    │   ├── components/
    │   │   ├── ProductTable.tsx
    │   │   ├── ProductForm.tsx
    │   │   ├── ProductFilters.tsx
    │   │   ├── ImportDialog.tsx
    │   │   └── ConfirmDialog.tsx
    │   ├── lib/
    │   │   ├── prisma.ts
    │   │   ├── validations.ts
    │   │   ├── csv-import.ts
    │   │   └── csv-export.ts
    │   └── types/
    │       └── product.ts
    ├── .env.example
    ├── .gitignore
    ├── package.json
    └── README.md

Được phép điều chỉnh cấu trúc phù hợp với phiên bản Next.js đang sử dụng. Không bắt buộc tạo file không cần thiết. Tất cả import path phải đúng với file thực tế.

---

## 12. SEED VÀ QUẢN LÝ DỮ LIỆU MẪU

Tạo seed script có khả năng chạy an toàn nhiều lần.

Yêu cầu:

- Tạo khoảng 5–10 sản phẩm thử nghiệm.
- Dùng SKU cố định.
- Có tên sản phẩm tiếng Việt và tiếng Anh nếu phù hợp.
- Bao gồm nhiều danh mục, size, màu và mức giá.
- Không xóa toàn bộ dữ liệu trước khi seed.
- Không tạo bản ghi trùng khi chạy lại.
- Có thể sử dụng upsert theo SKU.
- Ghi rõ seed đã tạo mới hay cập nhật bao nhiêu bản ghi.

Không chạy seed tự động mỗi lần khởi động website production.

Phải phân biệt dữ liệu mẫu và dữ liệu thật.

---

## 13. HƯỚNG DẪN CHẠY TRÊN WINDOWS

Tạo README.md bằng tiếng Việt, hướng dẫn từng bước cho người mới.

### Bước 1: Cài công cụ

Cài:
- Node.js LTS.
- Git.
- Visual Studio Code.

### Bước 2: Tạo project

Nếu chưa có dự án:

    npx create-next-app@latest fashion-store
    cd fashion-store

Chọn TypeScript, App Router và Tailwind CSS theo cấu hình tương thích.

Nếu dự án đã tồn tại, không tạo dự án lồng bên trong hoặc ghi đè code của người dùng.

### Bước 3: Cài dependency

Cài Prisma, thư viện client phù hợp, Zod, thư viện CSV và các dependency cần thiết.

Tạo script npm đúng với lệnh thực tế của dự án.

### Bước 4: Tạo Supabase

Tạo project và lấy connection string từ Supabase Dashboard.

### Bước 5: Cấu hình `.env`

Tạo `.env` từ `.env.example`.

Điền connection string thật trên máy tính cá nhân.

Không commit file `.env`.

### Bước 6: Tạo bảng

Chạy lệnh migration phù hợp với phiên bản Prisma đã cài.

Ví dụ, nếu sử dụng Prisma Migrate:

    npx prisma migrate dev --name init

Không chạy lệnh trên nếu cấu hình Prisma hiện tại không hỗ trợ hoặc đang trỏ tới database production có dữ liệu quan trọng. Giải thích rõ sự khác biệt giữa môi trường development và production.

### Bước 7: Seed

Chạy seed bằng script đã định nghĩa trong `package.json` hoặc cấu hình Prisma tương ứng.

### Bước 8: Khởi động website

    npm run dev

Mở:

    http://localhost:3000

### Bước 9: Kiểm thử

- Thêm một sản phẩm.
- Sửa sản phẩm.
- Xóa sản phẩm.
- Nhập CSV.
- Xuất CSV.
- Mở Supabase Table Editor.
- Đối chiếu dữ liệu.

### Bước 10: Kiểm tra persistence

Dừng server Next.js rồi chạy lại.

Kiểm tra sản phẩm vẫn còn trong Supabase và website hiển thị dữ liệu đó sau khi khởi động lại.

Nếu Supabase không kết nối được, phải hiển thị lỗi rõ ràng và hướng dẫn kiểm tra connection string, quyền truy cập, trạng thái project và cấu hình mạng.

---

## 14. KIỂM THỬ BẮT BUỘC

Viết test cho các logic quan trọng.

Sử dụng database thử nghiệm riêng khi cần kiểm thử thao tác ghi hoặc xóa.

Không chạy test destructive trên database production.

Kiểm tra các tình huống:

1. Kết nối Supabase thành công.
2. Migration tạo bảng thành công.
3. Danh sách sản phẩm lấy từ database thật.
4. Tạo sản phẩm hợp lệ.
5. Tạo SKU trùng.
6. Giá âm.
7. Tồn kho âm.
8. Sửa sản phẩm.
9. Xóa sản phẩm.
10. Tìm kiếm theo tên.
11. Tìm kiếm theo SKU.
12. Lọc và phân trang.
13. Import CSV hợp lệ.
14. Import CSV có dòng lỗi.
15. Import CSV có SKU trùng.
16. Import CSV có tiếng Việt.
17. Export CSV và kiểm tra Excel.
18. Export theo bộ lọc.
19. Database mất kết nối.
20. Khởi động lại website và xác nhận dữ liệu tồn tại.
21. API quản trị bị từ chối khi chưa xác thực.
22. Không có secret trong client bundle hoặc Git.

Báo cáo test phải phản ánh kết quả thực tế. Nếu chưa chạy được test, phải ghi rõ chưa chạy.

---

## 15. TRIỂN KHAI INTERNET VỚI NGÂN SÁCH 0 USD

Mục tiêu là ưu tiên các gói miễn phí cho quá trình thử nghiệm.

### Mã nguồn

Sử dụng GitHub repository để lưu code.

Không commit `.env`, mật khẩu database, secret key hoặc thông tin khách hàng.

### Database

Dùng Supabase Free để thử nghiệm PostgreSQL.

Lưu ý các giới hạn có thể bao gồm:
- Dung lượng database.
- Dung lượng file.
- Băng thông.
- Tài nguyên tính toán.
- Thời gian không hoạt động trước khi project bị tạm dừng.
- Khả năng backup và khôi phục.

Kiểm tra hạn mức mới nhất trên tài liệu chính thức trước khi triển khai.

### Hosting

Chọn nền tảng có gói miễn phí phù hợp với ứng dụng Next.js và mục đích sử dụng.

Có thể đánh giá Cloudflare Workers hoặc nền tảng tương đương, nhưng phải kiểm tra:
- Khả năng hỗ trợ Next.js App Router và server-side rendering.
- Khả năng tương thích runtime với Prisma.
- Cách kết nối PostgreSQL.
- Giới hạn request và CPU.
- Điều khoản thương mại.
- HTTPS và tên miền phụ.
- Cách cấu hình biến môi trường.

Không chọn hosting chỉ vì có gói Free nếu runtime không tương thích với dự án.

Không mặc định Vercel Hobby phù hợp với website thương mại vì gói này có điều kiện sử dụng riêng.

Nếu không thể triển khai Next.js hoàn chỉnh trên một gói miễn phí, hãy nêu rõ nguyên nhân và đề xuất phương án thay thế ít tốn kém nhất. Không thay đổi kiến trúc sang mock data để giả vờ triển khai thành công.

### Hình ảnh

Ở MVP, có thể dùng URL ảnh sản phẩm có sẵn hoặc để trống trường ảnh.

Nếu tích hợp Cloudinary, kiểm tra hạn mức gói Free hiện hành. Không bắt buộc tích hợp dịch vụ ảnh ngay nếu chưa cần thiết.

### Tên miền

Ban đầu dùng tên miền phụ do nền tảng hosting cung cấp nếu có.

Không bắt buộc mua tên miền riêng.

### Sao lưu

Tạo quy trình sao lưu database định kỳ bằng phương thức được hỗ trợ. Gói Free có thể không cung cấp tự động backup, vì vậy cần có phương án xuất dữ liệu và kiểm tra khả năng khôi phục.

---

## 16. ĐIỀU KIỆN NGHIỆM THU

Chỉ đánh dấu hoàn thành MVP khi:

- [ ] Next.js khởi động thành công.
- [ ] Supabase PostgreSQL kết nối thành công.
- [ ] Migration tạo bảng đúng.
- [ ] Seed tạo dữ liệu mẫu an toàn.
- [ ] Danh sách sản phẩm đọc từ database thật.
- [ ] Thêm sản phẩm hoạt động.
- [ ] Sửa sản phẩm hoạt động.
- [ ] Xóa sản phẩm hoạt động.
- [ ] Tìm kiếm và lọc hoạt động.
- [ ] Phân trang hoạt động.
- [ ] Import CSV ghi dữ liệu thật vào Supabase.
- [ ] Báo cáo dòng import lỗi chính xác.
- [ ] Export CSV lấy dữ liệu thật.
- [ ] CSV tiếng Việt tương thích Excel.
- [ ] Dữ liệu vẫn tồn tại sau khi restart.
- [ ] Lỗi database được xử lý rõ ràng.
- [ ] Có `.env.example` và `.gitignore`.
- [ ] Có README tiếng Việt.
- [ ] Có migration và seed script.
- [ ] Không lộ secret.
- [ ] API quản trị được bảo vệ trước khi triển khai công khai.
- [ ] Các test quan trọng có kết quả thực tế.

---

## 17. GIAI ĐOẠN 2 — PHÁT TRIỂN SAU MVP

Không thực hiện giai đoạn này trước khi MVP được nghiệm thu.

Sau khi database và CRUD ổn định, phát triển thêm:

1. Đăng nhập quản trị và phân quyền.
2. Quản lý danh mục.
3. Quản lý biến thể size/màu nâng cao.
4. Tải nhiều ảnh cho mỗi sản phẩm.
5. Giỏ hàng.
6. Đặt hàng.
7. COD.
8. Thanh toán QR.
9. Tích hợp cổng thanh toán tự động.
10. Quản lý khách hàng.
11. Quản lý vận chuyển.
12. Báo cáo doanh thu.
13. Hỗ trợ tiếng Việt, Khmer và tiếng Anh.
14. Hỗ trợ VND, USD và KHR.
15. Giao diện Luxury.
16. SEO.
17. Tối ưu hiệu năng.
18. Backup và giám sát.
19. Kiểm soát tồn kho khi nhiều đơn hàng được tạo đồng thời.

Khi bổ sung đơn hàng, phải thiết kế database và transaction phù hợp để tránh bán vượt tồn kho hoặc tạo đơn trùng do người dùng gửi nhiều lần.

Khi tích hợp thanh toán, chỉ xác nhận `paid` sau khi backend xác minh giao dịch đáng tin cậy.

---

## 18. QUY TRÌNH LÀM VIỆC CỦA AI

Thực hiện lần lượt từng giai đoạn.

### Giai đoạn A: Kiểm tra môi trường

- Kiểm tra Node.js và npm.
- Kiểm tra thư mục dự án.
- Kiểm tra cấu trúc code hiện tại.
- Không ghi đè file hoặc xóa dữ liệu của người dùng.
- Tạo dự án nếu chưa có.

### Giai đoạn B: Kết nối Supabase

- Cấu hình biến môi trường.
- Cấu hình Prisma.
- Tạo schema.
- Tạo migration.
- Kiểm tra kết nối.
- Seed dữ liệu mẫu.
- Xác minh dữ liệu trong Supabase.

Không bắt đầu viết giao diện quản lý trước khi cấu hình database cơ bản hoạt động, trừ khi cần tạo trang khung để kiểm tra ứng dụng.

### Giai đoạn C: CRUD

- Xây dựng API.
- Xây dựng form.
- Xây dựng bảng.
- Thực hiện thêm, sửa, xóa.
- Kiểm tra dữ liệu thật trong Supabase.

### Giai đoạn D: CSV

- Tạo template.
- Tạo import.
- Tạo báo cáo lỗi.
- Tạo export.
- Kiểm tra bằng file CSV thật.

### Giai đoạn E: Kiểm thử và tài liệu

- Chạy test.
- Sửa lỗi.
- Kiểm tra persistence.
- Hoàn thiện README.
- Báo cáo các mục đạt và chưa đạt.

Sau mỗi giai đoạn, phải báo cáo:
1. File đã tạo hoặc sửa.
2. Lệnh cần chạy.
3. Kết quả thực tế.
4. Lỗi còn tồn tại.
5. Bước tiếp theo.
6. Các thao tác cần người dùng thực hiện trong Supabase Dashboard.

Không tuyên bố thành công nếu chưa xác minh.

Không tự tạo thông tin tài khoản, mật khẩu, API key hoặc connection string giả.

Nếu thiếu cấu hình Supabase, hãy tiếp tục hoàn thiện những phần có thể làm an toàn, sau đó hướng dẫn người dùng lấy connection string và kiểm tra lại.

## YÊU CẦU CUỐI CÙNG

Hãy bắt đầu triển khai CHECH FASHION MVP ngay.

Thứ tự ưu tiên bắt buộc:

1. Supabase PostgreSQL.
2. Prisma schema và migration.
3. CRUD sản phẩm.
4. Import CSV.
5. Export CSV.
6. Kiểm tra dữ liệu sau restart.
7. Test và README.
8. Triển khai khi các bước trước đạt yêu cầu.

Không xây dựng quá nhiều tính năng cùng lúc. Không tạo một giao diện đẹp nhưng không có backend thật. Không sử dụng mock data thay cho database thật.

Kết quả cần là một dự án nhỏ, dễ hiểu, chạy được trên Windows, kết nối Supabase thành công và có thể phát triển thành website bán quần áo hoàn chỉnh về sau.