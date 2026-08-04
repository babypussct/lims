# 📢 Nhật Ký Cập Nhật — LIMS Cloud

Lịch sử phiên bản đầy đủ được hiển thị tại mục [/changelog trên ứng dụng](/changelog), với nội dung tập trung vào những thay đổi hữu ích cho công việc kiểm nghiệm.

## Phiên bản hiện tại: v26.08.04-b08

### v26.08.04-b08

- Cửa sổ thao tác luôn xuất hiện rõ ràng ở giữa màn hình, kể cả khi đang xem danh sách dài.
- Bảng yêu cầu hiển thị số mục đang xem và nút “Xem thêm” ngay tại khu vực thao tác.
- Khi tạo yêu cầu mới, danh sách chất chuẩn được chia thành từng phần dễ theo dõi hơn.
- Thanh tìm kiếm, bộ lọc và cách hiển thị danh sách được sắp xếp gọn hơn trên điện thoại.
- Sửa các trường hợp cửa sổ xác nhận bị lệch vị trí, bị che hoặc gây khó hiểu khi thao tác từ danh sách dài.

### v26.08.04-b07

- Sửa lỗi Firestore `failed-precondition` tại activity logs do query cần composite index.
- Listener logs cá nhân dùng `where + limit(100)`, sắp xếp ở client và vẫn realtime.
- Giữ nguyên giới hạn read của activity feed, tránh retry vô ích.

### v26.08.04-b06

- Lịch sử sử dụng chuẩn tải theo trang 100 bản ghi, có nút tải thêm và vẫn giữ tự tìm bản ghi sớm nhất.
- Cache 5 phút và chống gọi đồng thời cho danh mục nền mẫu, thiết bị, mô tả mẫu và danh sách người dùng.
- Ghi nhận read monitor riêng cho các truy vấn lịch sử initial/page/earliest.

### v26.08.04-b05

- Giới hạn listener pending requests và inbox notifications để tránh đọc lịch sử không giới hạn.
- Fallback standard requests/reference standards có trần đọc; DeltaSync dựng lại cache bounded sau 14 ngày offline.
- Cache recipes trong 2 phút và chống gọi đồng thời lặp lại khi chuyển màn hình.

### v26.08.04-b04

- Bổ sung đo lường read theo collection, listener, initial/delta và cache.
- Dedupe tải Dashboard/standard requests/reference standards trong cùng scope phiên.
- Giới hạn listener purchase requests và system updates để không đọc lịch sử không cần thiết.
- Ghi nhận read của DeltaSync, State, Inventory, Notification và các thao tác Firebase quản trị.
