# 📢 NHẬT KÝ CẬP NHẬT HỆ THỐNG — LIMS CLOUD

## [v26.07.22-b04] - 22/07/2026

### ⚗️ Quy tắc FEFO Chuẩn Đối Chiếu: Gợi Ý Thay Vì Bắt Buộc

#### ✨ Thay đổi hành vi
- **FEFO là gợi ý, không còn là rào cản:**
  Hệ thống không còn từ chối yêu cầu mượn hoặc cấp phát chuẩn khi người dùng chọn lô không nằm đầu thứ tự FEFO. Kiểm nghiệm viên và quản trị viên hoàn toàn có thể chọn bất kỳ lô nào còn sẵn sàng (chưa hết hạn, còn tồn kho, không đang được sử dụng).
- **Cảnh báo FEFO thông minh trong giao diện:**
  Khi chọn lô chuẩn không phải ưu tiên FEFO top-1 trong nhóm cùng tên, hệ thống hiển thị banner cảnh báo màu vàng nêu rõ lô nào nên được dùng trước và hạn sử dụng của lô đó — giúp ra quyết định có căn cứ mà không bị chặn thao tác.
- **Thứ tự sắp xếp danh sách và badge "Ưu tiên" vẫn giữ nguyên:**
  Danh sách chuẩn trong màn hình đăng ký mượn vẫn hiển thị các lô theo thứ tự FEFO và đánh dấu badge `⭐ Ưu tiên` cho lô nên dùng đầu tiên.

#### 🛠️ Cải tiến kỹ thuật
- Bỏ kiểm tra `FEFO hard block` trong `StandardRequestService.createRequest()` và `dispenseStandard()` tại tầng Firestore Transaction.
- Loại bỏ 2 lượt tải toàn bộ cache chuẩn (`fetchAllAndCache`) không còn cần thiết khi tạo yêu cầu và khi cấp phát — giảm số lần đọc Firestore mỗi thao tác.
- Thêm computed signal `fefoWarnings()` trong `CreateRequestDrawerComponent` để hiển thị cảnh báo đa lô một cách phản ứng.

---

## [v26.07.22-b03] - 22/07/2026

### 🔔 Cập nhật Hộp thư Thông báo & Chuông Báo

#### ✨ Tính năng & Trải nghiệm mới
- **Menu Dọn dẹp Hộp thư (`[···]`)**:
  - Thêm nút tùy chọn ở góc phải trên cùng của Hộp thư thông báo.
  - Hỗ trợ tính năng **"Xóa các thông báo đã đọc"** hoặc **"Xóa toàn bộ thông báo"** với hộp thoại xác nhận an toàn, giúp bạn dễ dàng làm sạch hộp thư.
- **Xem lịch sử thông báo dài ("Xem thêm thông báo")**:
  - Nút **"Xem thêm thông báo"** ở cuối danh sách giúp bạn xem lại các thông báo cũ hơn bất cứ lúc nào.
- **Nhận biết Thông báo Cần xử lý nhanh**:
  - Nút **Chuông thông báo** sẽ tự động chuyển sang **Màu Cam** nổi bật khi có **Yêu cầu mượn chuẩn** hoặc **Yêu cầu cập nhật CoA** đang chờ bạn duyệt/xử lý.
- **Giao diện Hộp thư rỗng thân thiện**:
  - Hiển thị hình ảnh và lời nhắn phù hợp cho từng tab (*Tất cả*, *Chưa đọc*, *Hệ thống*). Tab *Chưa đọc* sẽ chúc mừng 🎉 khi bạn đã đọc và xử lý hết tất cả thông báo!

#### 🛠️ Cải tiến & Sửa lỗi
- **Hiển thị chính xác 100% số lượng thông báo**:
  - Khắc phục hoàn toàn lỗi hiển thị sai số lượng thông báo chưa đọc trên biểu tượng Chuông khi bạn có nhiều thông báo.
- **Mở đúng nội dung khi bấm vào Thông báo đẩy (Push Notification)**:
  - Khi bấm vào thông báo nhận được trên màn hình, hệ thống sẽ mở ngay lập tức đến đúng trang chi tiết chuẩn/yêu cầu liên quan thay vì quay về trang chủ.
- **Duy trì kết nối thông báo ổn định**:
  - Tự động làm mới kết nối khi bạn để treo tab máy tính lâu, đảm bảo thông báo mới luôn được gửi tới bạn kịp thời.
- **Hiển thị đúng Tên người gửi**:
  - Các thông báo cảnh báo tự động (như cảnh báo tồn kho sắp hết) sẽ hiển thị rõ ràng tên người gửi là **"Hệ thống LIMS"**.

---

## [v26.07.22-b02] - 26/07/2026
- Tối ưu hóa tốc độ nạp dữ liệu và bảo vệ tiến trình lưu tự động trên hệ thống.
- Khắc phục sự cố gián đoạn kết nối khi phát thông báo đồng thời cho nhiều người dùng.

---

## [v26.07.22-b01] - 26/07/2026
- Nâng cấp **Công cụ Chuẩn hóa Dữ liệu**: Tự động nhận diện và phân nhóm chất hóa học theo mã CAS.
- Tích hợp bộ lọc tìm kiếm nhanh theo trạng thái và tên thương mại.
- Tự động viết hoa chuẩn danh pháp hóa học theo tiêu chuẩn quốc tế PubChem.
