# 📢 NHẬT KÝ CẬP NHẬT HỆ THỐNG — LIMS CLOUD

## [v26.07.22-b08] - 22/07/2026

### 🐛 Sửa Lỗi Trạng Thái Chọn Mẫu (Checkbox) Khi Xuất Kết Quả Theo Tiền Tố

#### 🔄 Bảo Toàn Trạng Thái Check Mẫu Giữa Các Tiền Tố
- **Khắc phục triệt để lỗi uncheck mẫu khi chuyển tiền tố**:
  Trước đây, khi xuất kết quả cho một tiền tố (ví dụ: Tiền tố A), dữ liệu nháp tạm cho báo cáo PDF bị vô tình ghi đè xuống Firestore làm các mẫu thuộc tiền tố khác (Tiền tố B, C...) bị đổi sang `selected: false`.
- **Tách biệt dữ liệu xuất PDF & dữ liệu lưu nháp**:
  Tách riêng dữ liệu dùng để sinh PDF (`chunkDraft`) và dữ liệu lưu Firestore (`draftForSave`), đảm bảo duy trì đầy đủ thuộc tính `selected` thực tế của tất cả các mẫu thuộc mọi tiền tố sau khi hoàn tất xuất kết quả.

---

## [v26.07.22-b07] - 22/07/2026

### 🎨 Tinh Giản Giao Diện Điều Hướng & Tối Ưu Màn Hình Làm Việc

#### 🧭 Điều Hướng Thông Minh & Bấm Logo Về Trang Chủ
- **Bấm vào Logo để về ngay Trang chủ**:
  Thao tác nhấp vào biểu tượng **Logo LIMS Cloud Pro** ở góc trên cùng thanh điều hướng giúp kiểm nghiệm viên quay về màn hình Trang chủ (Dashboard) nhanh chóng từ bất kỳ phân hệ nào.
- **Nút thu gọn/mở rộng thanh điều hướng riêng biệt**:
  Bổ sung nút thu gọn / mở rộng chuyên biệt ở góc phải thanh Sidebar giúp chủ động mở rộng không gian hiển thị danh sách mẫu và bảng số liệu khi phân tích.

#### 📊 Tối Ưu Bảng Theo Dõi Mẫu Ngày & Giao Diện Tinh Gọn
- **Tập trung bảng theo dõi mẫu tại Trang chủ**:
  Toàn bộ dữ liệu **Bảng theo dõi mẫu ngày** được tích hợp trực tiếp ngay tại khu vực trung tâm của Dashboard ("Theo dõi mẫu & kết quả ngày"). Kiểm nghiệm viên nắm bắt toàn bộ tiến độ xử lý mẻ phân tích và kết quả mẫu trong ngày ngay từ đầu ca làm việc.
- **Loại bỏ các mục menu trùng lặp**:
  Tối giản danh sách điều hướng ở Sidebar và thanh công cụ di động, mang lại trải nghiệm làm việc tập trung, thoáng đãng và không bị xao nhãng bởi các menu dư thừa.

---

## [v26.07.22-b06] - 22/07/2026

### 🔔 Nâng Cấp Toàn Diện Giao Diện Thông Báo Dành Cho Kiểm Nghiệm Viên

#### 🌟 Cửa sổ Thông báo Rộng rãi & Hiện đại (Máy tính)
- **Cửa sổ mở rộng thoáng đãng**:
  Khung thông báo nay được mở rộng kích thước gấp đôi, giúp kiểm nghiệm viên dễ dàng đọc toàn bộ nội dung thông báo dài (yêu cầu COA, thông tin lô chuẩn) mà không bị tù túng hay che mất vùng làm việc.
- **Tự động gắn theo vị trí nút Chuông**:
  Bật mở tự nhiên ngay góc bên trái màn hình cạnh ảnh đại diện cá nhân, tạo cảm giác thân thuộc và thuận tay thao tác.
- **Phông nền mờ cao cấp**:
  Tích hợp hiệu ứng mờ phông nền nhẹ nhàng giúp các thông báo hiển thị nổi bật, chuyên nghiệp và dễ quan sát.

#### 📱 Trải nghiệm Tiện lợi Trên Điện thoại & Máy tính bảng
- **Giao diện vuốt trượt kiểu ứng dụng di động**:
  Khi sử dụng trên điện thoại, bảng thông báo sẽ mở trượt mượt mà từ bên dưới lên với thanh kéo vuốt tay tiện lợi, giúp thao tác bằng một tay cực kỳ nhanh chóng.

#### 🎯 Phân Loại Thông báo Thông minh & Thao tác Nhanh
- **Thêm mục "Cần xử lý" riêng biệt**:
  Bổ sung danh mục tab **"Cần xử lý"** giúp kiểm nghiệm viên và quản trị viên lọc ngay lập tức các **Yêu cầu phê duyệt COA** và **Yêu cầu mượn trả chuẩn** đang chờ duyệt chỉ với 1 cú nhấp.
- **Nhận diện mức độ khẩn cấp bằng màu sắc**:
  - **Màu tím**: Yêu cầu cập nhật hoặc xem hồ sơ COA.
  - **Màu xanh dương**: Yêu cầu mượn/trả mẫu và thiết bị phòng lab.
  - **Màu hổ phách (cam)**: Cảnh báo tồn kho hóa chất/chuẩn sắp hết hoặc đã quá hạn trả.
  - **Màu xanh lá**: Thông báo yêu cầu đã được phê duyệt thành công.
- **Nút xử lý nhanh trực tiếp**:
  Kiểm nghiệm viên có thể bấm ngay các nút "Xem yêu cầu", "Xem kho", hoặc rê chuột để bấm "Đánh dấu đã đọc ✓" và "Xóa 🗑" trực tiếp mà không cần qua nhiều bước trung gian.

#### 🔔 Biểu tượng Chuông & Thẻ Báo Nhẹ nhàng
- **Biểu tượng nhã nhặn, không gây mất tập trung**:
  Thay thế hoàn toàn hiệu ứng rung lắc mạnh bằng nhịp chao chuông nhẹ nhàng và ánh hào quang tỏa êm dịu khi có tin mới, giúp kiểm nghiệm viên tập trung cao độ khi đang phân tích mẫu.
- **Đổi màu thông minh khi có việc khẩn**:
  Huy hiệu số đếm thông báo sẽ tự động chuyển sang màu Cam nổi bật khi có công việc cần bạn phê duyệt ngay và màu Đỏ cho các tin tức thông thường.

---

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
