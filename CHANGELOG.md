# 📢 Nhật Ký Cập Nhật — LIMS Cloud

Lịch sử phiên bản đầy đủ được hiển thị tại mục [/changelog trên ứng dụng](/changelog), với nội dung tập trung vào những thay đổi hữu ích cho công việc kiểm nghiệm.

## Phiên bản hiện tại: v26.08.06-b04

### v26.08.06-b04

#### ⚡ Tối ưu & cải tiến

- **Trình xem Phiếu Giao Nhận Mẫu:** Loại bỏ stacking context tồn tại sau hiệu ứng chuyển trang và nâng lớp chứa tài liệu khi modal mở, giúp PDF/Excel luôn phủ đúng toàn bộ vùng ứng dụng.
- **Nhật Ký Cập Nhật responsive:** Điều chỉnh khoảng cách, tiêu đề, ô tìm kiếm và thẻ nội dung để trang lẫn modal hiển thị cân đối hơn trên desktop và điện thoại.

#### 🐛 Sửa lỗi

- Sửa trình xem PDF/Excel bị `AppHeaderComponent`, sidebar hoặc thanh điều hướng đè lên nội dung.
- Sửa đường timeline và dấu mốc trong **Nhật Ký Cập Nhật** bị lệch so với phần nội dung.
- Sửa `release-notes.json` thiếu dấu đóng chuỗi làm bước kiểm tra release và build thất bại.

### v26.08.06-b03

#### 🚀 Tính năng mới

- **Tối ưu nhãn phương pháp:** Tên phương pháp và nhãn được hiển thị rõ ràng, đầy đủ và đồng bộ hơn trên toàn hệ thống.
- **Catalog 119 phương pháp hóa học:** Chỉ hiển thị các mã NAFI6/H-* được duyệt; loại bỏ mục nhóm/chỉ tiêu không phải nhãn phương pháp khỏi bộ chọn vận hành.
- **Tên phép thử đi kèm mã:** Mỗi mã có mô tả tiếng Việt dạng "Xác định ..." trong catalog, chip, bộ lọc và export.
- **Gán nhiều phương pháp:** Một chuẩn và một lần báo trả có thể lưu nhiều method tag trong cùng một mảng.

#### ⚡ Tối ưu & cải tiến

- **Nhãn phương pháp gọn hơn:** Bộ lọc và thẻ đã chọn hiển thị mã phương pháp kèm kỹ thuật phân tích, ví dụ `NAFI6/H-9.4 · GC-MS/MS`, thay cho toàn bộ tên phép thử dài.
- **Giữ đầy đủ thông tin:** Tên phép thử đầy đủ vẫn được hiển thị qua tooltip khi rê chuột vào bộ lọc hoặc thẻ phương pháp.
- **Tương thích màn hình nhỏ:** Thẻ đã chọn hỗ trợ xuống tối đa hai dòng, không làm tràn hoặc kéo giãn khu vực nhập liệu.

#### 🐛 Sửa lỗi & kiểm thử

- **Lớp phủ xem tài liệu:** Tách modal xem trước khỏi stacking context của hiệu ứng chuyển trang, bảo đảm cửa sổ PDF/Excel luôn phủ đúng lên Header và Sidebar.
- Loại bỏ thiết bị trùng lặp khi tạo nhãn ngắn và dùng kỹ thuật trích từ tên phương pháp làm phương án dự phòng.
- Bổ sung kiểm thử định dạng nhãn rút gọn để bảo đảm nội dung ngắn hơn nhãn đầy đủ và giữ đúng mã thiết bị.

### v26.08.06-b01

#### 🚀 Tính năng mới

- **Catalog 119 phương pháp hóa học:** Chỉ hiển thị các mã NAFI6/H-* được duyệt; loại bỏ mục nhóm/chỉ tiêu không phải nhãn phương pháp khỏi bộ chọn vận hành.
- **Tên phép thử đi kèm mã:** Mỗi mã có mô tả tiếng Việt dạng “Xác định ...” trong catalog, chip, bộ lọc và export.
- **Gán nhiều phương pháp:** Một chuẩn và một lần báo trả có thể lưu nhiều method tag trong cùng một mảng.

#### ⚡ Tối ưu & cải tiến

- Sắp xếp numeric tự nhiên: `H-1.2`, `H-1.3`, `H-1.10`, `H-1.11`.
- Có catalog tĩnh dự phòng để 119 phương pháp hiển thị trước khi Admin seed Firestore.
- Giữ key lịch sử SOP/nhóm cũ để đọc lại nhưng chỉ cho gán mới phương pháp hóa học.

#### 🐛 Sửa lỗi & an toàn dữ liệu

- Bổ sung và kiểm tra `methodName` trong seed catalog và Firestore Rules.
- Bổ sung test tên phép thử đủ 119 mã, natural sort và chọn nhiều nhãn.

### v26.08.05-b03

#### 🚀 Tính năng mới

- **Catalog phương pháp hóa học VILAS:** Bổ sung 119 mã NAFI6/H-* từ danh mục VILAS 2025; chỉ bao gồm phương pháp thử hóa học.
- **Nhãn thiết bị phụ:** Hiển thị và lọc thiết bị suy dẫn như GCMS, GCMSMS, GCHRMS, LCMSMS, ICPMS và HPLC mà không làm tăng số nhãn lưu trữ.
- **Gán nhãn hàng loạt:** Hỗ trợ ADD, REMOVE và REPLACE với xác nhận mạnh cho thao tác thay thế toàn bộ.

#### ⚡ Tối ưu & cải tiến

- **Đồng bộ luồng trả chất chuẩn:** KNV có thể thêm hoặc reset `sopTags`; Admin quyết định `finalSopTags` khi nhận trả và hệ thống ghi nhất quán vào request lẫn standard.
- **Tồn kho theo đơn vị:** Tổng hợp riêng mg, ml, tube... và hiển thị kèm tổng số lọ để tránh cộng sai đơn vị.
- **Catalog nhãn trung tâm:** Nạp trực tiếp Target Groups, hỗ trợ custom tag, fallback rõ ràng cho SOP/Group đã lưu trữ và bảo toàn casing của ID gốc.

#### 🐛 Sửa lỗi & an toàn dữ liệu

- Giới hạn 10 nhãn khi báo trả, 100 nhãn trên chất chuẩn và 400 ghi mỗi batch; vượt giới hạn báo lỗi rõ ràng thay vì mất nhãn âm thầm.
- Firestore Rules kiểm tra mảng và độ dài `sopTags`/`sop_tags`, đồng thời cấm hard-delete `standard_tags`.
- Dùng `arrayUnion`/`arrayRemove` cho bulk ADD/REMOVE để không ghi đè nhãn do thao tác đồng thời.

### v26.08.04-b10

- Cải thiện giao diện **Giao Nhận Mẫu** để cửa sổ xem tài liệu không bị sidebar mở rộng hoặc topbar che mất.
- Khu vực chuyển sheet Excel trên PWA luôn nổi rõ, có thể cuộn ngang và không bị che ở mép dưới màn hình.
- Tăng khả năng tương thích khi đọc PDF trên PWA; nếu lớp chọn văn bản gặp lỗi, nội dung PDF vẫn được hiển thị để xem.
- Cache PDF worker trong PWA để việc mở tài liệu ổn định hơn khi mạng chập chờn hoặc ứng dụng hoạt động ngoại tuyến.

### v26.08.04-b09

- Bỏ 4 thẻ số liệu tổng quan không cần thiết ở đầu trang Yêu Cầu Chất Chuẩn để màn hình gọn hơn.
- Đưa trọng tâm về danh sách yêu cầu; các bộ lọc trạng thái vẫn có sẵn ngay bên trên danh sách.
- Giữ nguyên các cải thiện về tìm kiếm, xem thêm và cửa sổ thao tác cho danh sách dài.

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
