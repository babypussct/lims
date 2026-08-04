# 📢 Nhật Ký Cập Nhật — LIMS Cloud

Lịch sử phiên bản đầy đủ được hiển thị tại mục [/changelog trên ứng dụng](/changelog), với nội dung tập trung vào những thay đổi hữu ích cho công việc kiểm nghiệm.

## Phiên bản hiện tại: v26.08.04-b05

### v26.08.04-b05

- Giới hạn listener pending requests và inbox notifications để tránh đọc lịch sử không giới hạn.
- Fallback standard requests/reference standards có trần đọc; DeltaSync dựng lại cache bounded sau 14 ngày offline.
- Cache recipes trong 2 phút và chống gọi đồng thời lặp lại khi chuyển màn hình.

### v26.08.04-b04

- Bổ sung đo lường read theo collection, listener, initial/delta và cache.
- Dedupe tải Dashboard/standard requests/reference standards trong cùng scope phiên.
- Giới hạn listener purchase requests và system updates để không đọc lịch sử không cần thiết.
- Ghi nhận read của DeltaSync, State, Inventory, Notification và các thao tác Firebase quản trị.
