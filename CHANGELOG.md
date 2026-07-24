# 📢 NHẬT KÝ CẬP NHẬT HỆ THỐNG — LIMS CLOUD

## [v26.07.24-b02] - 24/07/2026

### 🧭 Mở Khóa Trạm Pha Chế, Chuẩn Hóa Cảnh Báo & Đếm Ngược Cập Nhật

#### 🔓 Mở Khóa Trạm Pha Chế Cho Nhân Viên Thông Thường
- **Khả dụng cho mọi người:** Trạm Pha Chế giờ đây cho phép toàn bộ nhân viên truy cập để sử dụng công cụ tính toán (Sandbox) mà không bị chặn ở menu.
- **Vẫn bảo mật kho:** Chế độ Thực (có trừ kho và in tem) vẫn yêu cầu người dùng phải có quyền Sửa Kho mới có thể thao tác. Hệ thống tự động từ chối nếu không đủ quyền.

#### 🔔 Chuẩn Hóa Thông Báo Cảnh Báo Phân Quyền
- **Đồng bộ tiếng Việt:** Các thông báo lỗi rải rác trên toàn hệ thống (bị chặn ở trang, bị chặn ở menu, hoặc khi bấm nút) đã được đồng bộ về một định dạng thống nhất: `Cần quyền "[Tên Quyền]" · Liên hệ quản trị viên để được cấp`.
- **Dễ hiểu hơn:** Dịch mã quyền nội bộ sang ngôn ngữ người dùng để thông báo lỗi rõ ràng và thân thiện.

#### ⏳ Đếm Ngược Tự Động Thông Minh & Nút Để Sau
- **Tạm dừng khi không có tương tác:** Bộ đếm 30s đếm ngược tới 10s sẽ tự động tạm dừng nếu máy tính không có hoạt động (di chuột, chạm màn hình, gõ phím).
- **Tiếp tục khi có người quay lại:** Khi người dùng quay lại thao tác với máy, đếm ngược sẽ tiếp tục nốt 10s còn lại để đảm bảo người dùng kịp đọc nội dung cập nhật.
- **Nút Để Sau & Banner cố định:** Cho phép đóng popup để tiếp tục công việc và hiển thị banner nhỏ ở góc dưới màn hình có nút "Cập nhật" nhanh.

---

## [v26.07.24-b25] - 24/07/2026

### 🧭 Daily Checklist Dễ Xem Hơn, Dashboard Có Nhật Ký Hơn

#### 📋 Theo Dõi Mẫu Gọn Hơn
- **Mẫu có tiền tố hiển thị trước:** Trong “Mẫu thực hiện”, các mã như `U0108` được xếp trước mã không tiền tố như `0108`.
- **Bỏ QR khỏi Daily Checklist:** Nút in không còn tạo QR, bản in nhẹ hơn và không còn lỗi tạo QR.
- **In bảng nhanh hơn:** Bỏ bước chờ ảnh QR trước khi mở in.

#### 👤 Hoạt Động Gần Đây Cho Nhân Viên
- **Không còn trắng dữ liệu:** Nhân viên thấy được hoạt động phù hợp với quyền và hoạt động do chính mình tạo.
- **Tải nhật ký đúng thời điểm:** Dashboard mở luồng nhật ký sau khi quyền người dùng đã sẵn sàng.
- **Giữ lọc quyền an toàn:** Nhật ký của người khác vẫn chỉ hiện khi người dùng có quyền xem module tương ứng.

---

## [v26.07.23-b24] - 23/07/2026

### ✅ Sửa Lỗi Lưu Mẻ Sau Khi Chỉnh Sửa

#### 🧾 Ghi Nhật Ký Ổn Định Hơn
- **Sửa lỗi Firestore báo `undefined`:** Khi SOP thiếu thông tin phụ như mã tham chiếu, hệ thống vẫn lưu chỉnh sửa mẻ bình thường.
- **Tự làm sạch dữ liệu trước khi ghi log:** Nhật ký duyệt, hoàn tác và sửa mẻ không còn gửi giá trị rỗng không hợp lệ lên Firestore.
- **Giữ nguyên luồng in mới:** Sau khi sửa mẻ, phiếu in cũ vẫn được thay bằng phiếu in mới như thiết kế.

---

## [v26.07.23-b23] - 23/07/2026

### ⚡ SmartBatch Nhanh Hơn, Sửa Mẻ Dễ Hơn

#### 🚀 Tối Ưu Tốc Độ Mở Ứng Dụng
- **Tải nhẹ hơn lúc đăng nhập:** Nhiều thư viện nặng chỉ được tải khi người dùng thật sự dùng tới.
- **Giảm lắng nghe dữ liệu không cần thiết:** Hệ thống chỉ mở một số luồng dữ liệu khi vào đúng màn hình.
- **Các màn hình lớn mượt hơn:** SmartBatch, kết quả, kho, chất chuẩn và báo cáo được tối ưu lại để giảm giật lag.

#### 🧪 SmartBatch Là Luồng Chính
- **Ẩn SOP Calculator khỏi thanh điều hướng:** SmartBatch là nơi lập mẻ chính; Calculator vẫn còn để tính nhanh khi cần.
- **Thêm nút “Tính nhanh SOP” trong SmartBatch:** Người dùng vẫn mở Calculator nhanh mà không làm rối menu chính.
- **Sau duyệt chỉ đưa vào Hàng đợi In:** Không còn tự bật hộp thoại in ngay sau khi duyệt mẻ.

#### ✏️ Sửa Mẻ Sai Thông Tin Nhanh Hơn
- **Sửa từ nhiều nơi:** Có thể sửa mẻ từ Quản lý Yêu cầu, Hàng đợi In và Daily Checklist trên Dashboard.
- **Xem trước thay đổi trước khi lưu:** Hiển thị thông tin đổi và chênh lệch tồn kho để tránh nhầm.
- **Không cần nhập lý do hay tick xác nhận:** Flow gọn hơn, phù hợp thao tác sửa nhanh trước khi in.
- **Tự thay phiếu in cũ:** Khi lưu bản sửa, phiếu in cũ rời khỏi hàng đợi và phiếu mới được tạo lại.

#### 🏷️ Bổ Sung Mô Tả Mẫu
- **SOP Calculator có trường mô tả mẫu:** Nhập mô tả cho từng mẫu và áp dụng nhanh cho toàn bộ danh sách.
- **Mô tả được giữ theo mẻ:** Thông tin mô tả đi cùng request, phiếu in và luồng sửa mẻ.

---

## [v26.07.23-b22] - 23/07/2026

### 📣 Đồng Bộ “Nội Dung Nâng Cấp” Trên UI

#### 🖥️ Khôi Phục Nội Dung Release Trên Popup Cập Nhật
- **Sửa metadata bị giữ từ b17:** Popup cập nhật nay hiển thị đúng tiêu đề và các nâng cấp Data Cleanup của b20–b22 thay vì nội dung chuẩn hóa tiếng Việt cũ.
- **Tóm tắt đầy đủ cho người dùng:** Bao gồm phân trang nhóm CAS, điều chỉnh trực tiếp 128 nhãn giữ chỗ/32 CAS dạng ngày/3 CAS lỗi khác, kiểm tra checksum–PubChem và hoàn tác theo phiên.

#### 🛡️ Bổ Sung Cổng Kiểm Tra Quy Trình Changelog
- **Gắn phiên bản cho nội dung UI:** `notesVersion` phải trùng phiên bản ứng dụng và `appData.version`.
- **Build sẽ dừng nếu thiếu nội dung:** Trình kiểm tra bắt buộc tiêu đề, danh sách tính năng và mục phiên bản tương ứng trong `CHANGELOG.md`.
- **Ngăn tái diễn nội dung cũ:** Khi tăng phiên bản mà chưa cập nhật “Nội Dung Nâng Cấp”, quy trình build phát hiện sai lệch trước khi phát hành.

---

## [v26.07.23-b21] - 23/07/2026

### 🧹 Điều Chỉnh CAS Lỗi Trực Tiếp Trong Data Cleanup

#### 🗂️ Ba Danh Sách Lỗi Có Thể Xử Lý
- **Không còn chỉ hiển thị số lượng:** Các thống kê `128 nhãn CAS giữ chỗ`, `32 CAS dạng ngày` và `3 CAS lỗi khác` trở thành tab mở trực tiếp danh sách hồ sơ tương ứng.
- **Một hồ sơ trên mỗi trang:** Có nút Hồ sơ trước/Hồ sơ sau, thanh tiến độ và tìm kiếm theo CAS, tên, mã quản lý, catalog hoặc lot để tránh quá tải và chọn nhầm.
- **Hướng dẫn theo nguyên nhân:** Nhãn giữ chỗ và CAS dạng ngày yêu cầu đối chiếu CoA/nhãn gốc; CAS chứa chú thích chỉ được đề xuất khi tìm thấy đúng một CAS hợp lệ.

#### ✅ Xác Thực và Đối Chiếu Trước Khi Lưu
- **Kiểm tra tức thời:** CAS điều chỉnh phải đúng cấu trúc và chữ số checksum; hệ thống chuẩn hóa dấu gạch trước khi cho phép lưu.
- **Tra cứu PubChem riêng từng hồ sơ:** Hiển thị tên tìm thấy để người dùng so sánh với sản phẩm nhưng không tự động đổi tên chất chuẩn.
- **Không suy đoán danh sách đa CAS:** Dữ liệu chứa nhiều CAS không bị tự chọn CAS đầu tiên làm đại diện.

#### ↩️ Lưu và Hoàn Tác An Toàn
- **Mỗi lần sửa CAS là một phiên:** Chỉ hồ sơ đang hiển thị được cập nhật; khóa tìm kiếm và trạng thái CAS được đồng bộ trong cùng giao dịch.
- **Ảnh chụp trước/sau bao gồm CAS:** Lịch sử hiển thị CAS cũ và mới; hoàn tác nguyên tử khôi phục cả CAS, danh pháp và metadata.
- **Tương thích phiên cũ:** Các phiên b20 chưa chụp trường CAS vẫn hoàn tác bình thường và không thể xóa nhầm CAS hiện tại.

#### ✅ Kiểm Tra Chất Lượng
- **Production build và lint thành công.**
- **12 kiểm thử Data Cleanup đạt:** Bổ sung kiểm thử đề xuất CAS từ chú thích và chặn suy đoán khi dữ liệu chứa nhiều CAS.

---

## [v26.07.23-b20] - 23/07/2026

### 🧪 Chuẩn Hóa Danh Pháp Chất Chuẩn An Toàn Theo Từng Nhóm CAS

#### 📄 Phân Trang Một Nhóm CAS Mỗi Lần
- **Giảm quá tải thông tin và nguy cơ chọn nhầm:** Data Cleanup chỉ hiển thị một nhóm CAS trên mỗi trang, có nút Nhóm trước/Nhóm sau, thanh tiến độ, tìm kiếm theo CAS/tên/mã quản lý/catalog và bộ lọc theo mức rủi ro.
- **Duyệt riêng từng hồ sơ:** Mỗi lọ chất chuẩn có tên hiện tại, tên đề xuất, mã quản lý, catalog, đơn vị, quy cách và dạng sản phẩm để người dùng kiểm tra trước khi chọn lưu.
- **Chỉ lưu nhóm đang hiển thị:** Loại bỏ thao tác ghi đè hàng loạt nhiều nhóm trên một màn hình; hỗ trợ “Lưu nhóm hiện tại” và “Lưu & nhóm sau”.

#### 🛡️ Phân Tầng Rủi Ro và Bảo Toàn Danh Pháp
- **Ba mức An toàn/Cần duyệt/Rủi ro cao:** Tự động nhận diện khác biệt về tên, đơn vị, dung dịch, hỗn hợp, đồng vị, muối và hydrat.
- **Khóa áp dụng một tên chung khi không an toàn:** Nhóm có nhiều dạng sản phẩm, nồng độ, dung môi hoặc đơn vị khác nhau chỉ được chỉnh riêng từng hồ sơ, tránh làm mất thông tin sản phẩm.
- **Chuẩn hóa ký hiệu khoa học:** Bảo toàn tiền tố, chữ viết tắt và công thức; thống nhất các đơn vị như `µg/mL`, `mg/L`, `mL`, đồng thời sửa lỗi mã hóa phổ biến như `ìg/mL`.
- **Tách tên hóa chất và tên sản phẩm:** Tên PubChem được lưu làm tên hóa chất chuẩn hóa/tên đồng nghĩa, không tự động ghi đè nồng độ, dung môi hay dạng chuẩn trong tên sản phẩm.

#### 🔎 Kiểm Tra CAS Trước Khi Tra PubChem
- **Xác thực cấu trúc và chữ số kiểm tra CAS:** Chỉ CAS hợp lệ mới được gom nhóm và đối chiếu PubChem.
- **Chặn dữ liệu không phải CAS:** `NA`, `N/A`, `CAS inside`, CAS dạng ngày và CAS có chú thích được tách khỏi quy trình để không gom nhầm các chất không liên quan.
- **Phân tích trên dữ liệu thực tế:** 643 nhóm CAS hợp lệ được phân thành 495 nhóm an toàn, 123 nhóm cần duyệt và 25 nhóm rủi ro cao.

#### ↩️ Hoàn Tác Theo Phiên
- **Mỗi lần lưu tạo một phiên độc lập:** Hệ thống ghi ảnh chụp trước/sau, CAS, danh sách hồ sơ, người thực hiện và thời gian.
- **Lịch sử trực quan:** Màn hình Hoàn tác cho phép xem tên trước/sau của từng hồ sơ và trạng thái phiên.
- **Hoàn tác nguyên tử:** Toàn bộ phiên được khôi phục cùng lúc hoặc không thay đổi gì; không xảy ra tình trạng hoàn tác dở dang.
- **Bảo vệ thay đổi mới:** Nếu bất kỳ hồ sơ nào đã được sửa sau phiên chuẩn hóa, hệ thống chặn hoàn tác để tránh ghi đè dữ liệu mới.
- **Nhật ký không thể xóa:** Phiên chỉ được chuyển từ `APPLIED` sang `UNDONE`, bảo đảm khả năng truy vết.

#### ✅ Kiểm Tra Chất Lượng
- **Production build và lint thành công.**
- **32 kiểm thử Standards và 11 kiểm thử Data Cleanup đạt:** Bao gồm quy tắc CAS, danh pháp hóa học, phân loại rủi ro và bảo vệ Firestore cho lịch sử hoàn tác.

---

## [v26.07.23-b17] - 23/07/2026

### 🌐 Chuẩn Hóa Nội Dung Tiếng Việt và Hệ Thống Biểu Tượng

#### ✍️ Văn Phong Giao Diện Nhất Quán
- **Biên tập lại toàn bộ nội dung hiển thị:** Điều chỉnh các bản dịch máy móc thành câu chữ tự nhiên, rõ nghĩa và phù hợp với ngữ cảnh vận hành phòng thí nghiệm.
- **Áp dụng Title Case có chọn lọc:** Menu, tiêu đề và nút chính dùng Title Case; phần mô tả, hướng dẫn và thông báo vẫn giữ văn phong câu tự nhiên để dễ đọc.
- **Chuẩn hóa thuật ngữ chuyên môn:** Thống nhất cách gọi trên toàn hệ thống; giữ nguyên các ký hiệu phổ biến như SOP, CoA, QC, GS1 và CAS.

#### 🎯 Biểu Tượng Đúng Ngữ Cảnh
- **Đồng bộ biểu tượng điều hướng và thao tác:** Chọn lại icon theo đúng chức năng để người dùng nhận biết nhanh hơn.
- **Khắc phục icon Font Awesome không hợp lệ:** Thay thế 6 tên icon không tồn tại và xác thực toàn bộ icon đang sử dụng với Font Awesome 6.4.0.

#### ✅ Kiểm Tra Chất Lượng
- **Build Angular thành công:** Xác nhận toàn bộ template và mã nguồn biên dịch bình thường.
- **32 kiểm thử đạt:** Gồm 25 kiểm thử Standards và 7 kiểm thử Notifications.

## [v26.07.23-b16] - 23/07/2026

### 🔒 Chuyển Chế Độ Giao Diện Từ Ẩn Sang Khóa (🔒) Kèm Cấu Hình Bật/Tắt Toàn Hệ Thống

#### 🎯 Chế độ Khóa Giao Diện (Lock Permission Directive)
- **Chuyển đổi các chức năng thiếu quyền từ "Ẩn" sang "Khóa" (🔒)**:
  Thay vì ẩn hoàn toàn làm người dùng hiểu lầm là hệ thống không có tính năng đó, giao diện nay hiển thị rõ các nút bấm/phân hệ bị hạn chế kèm icon 🔒, mờ nhẹ và tooltip giải thích chi tiết lý do thiếu quyền.
- **Bảo tồn Tooltip gốc khi được cấp quyền**:
  Khi người dùng có đủ quyền truy cập, thuộc tính `title` nguyên bản của các nút bấm (như *"In nhãn"*, *"Sửa SOP"*, *"Xuất dữ liệu"*) sẽ được khôi phục tự động.

#### ⚙️ Cấu Hình Công Tắc Bật/Tắt Hiển Thị Khóa Toàn Hệ Thống & Quy Trình Phát Hành
- **Công tắc Admin chủ động (Show Locked Features)**:
  Bổ sung tùy chọn trong phần Cấu hình Chung giúp Quản trị viên (Manager) chủ động BẬT hoặc TẮT chế độ hiển thị tính năng khóa trên toàn hệ thống (BẬT: hiện icon 🔒; TẮT: quay về ẩn giao diện như cũ).
- **Bảo vệ dữ liệu đang nhập (Dirty Tracking)**:
  Toàn bộ Form Cấu hình được trang bị cơ chế theo dõi cờ Dirty. Các tín hiệu Realtime `onSnapshot` từ máy khác sẽ không bao giờ ghi đè lên nội dung đang nhập dở của Admin.
- **Bắt buộc Quy trình Đồng bộ Đủ 5 Tệp Phiên Bản (Mandatory 5-File Synchronization)**:
  Mọi thao tác Build/Release/Push code đều được tự động rà soát và đồng bộ đủ 5 tệp (`package.json`, `ngsw-config.json`, `state.service.ts`, `metadata.json`, `CHANGELOG.md`).

#### 🔔 Thu Hồi Broadcast Thông Báo An Toàn & Khắc Phục Lỗi
- **Thu hồi thông báo Hộp thư & Xử lý lỗi Fail-safe**:
  Khi Admin xóa tin tức hệ thống, API thu hồi sẽ xóa sạch bản ghi thông báo trong Hộp thư của người dùng trước khi dọn dẹp bài đăng. Nếu có lỗi mạng/API, bài đăng được giữ nguyên trong Firestore để Admin bấm thử lại.

---

## [v26.07.22-b10] - 22/07/2026

### 🎨 Tối Ưu Căn Chỉnh Giao Diện Header Sidebar Khi Thu Gọn

#### 🎯 Căn Giữa Logo & Thiết Kế Nút Mở Rộng Nổi Viền
- **Căn giữa Logo hoàn hảo khi Sidebar thu gọn (`w-20`)**:
  Khắc phục triệt để sự cố Logo và nút mở rộng bị ép sát chật chội vào lề trái. Ở trạng thái thu gọn, biểu tượng **Logo LIMS Cloud** được đặt thẳng hàng chính giữa cột 80px, tạo sự đồng bộ hoàn hảo với danh sách biểu tượng menu và ảnh đại diện phía dưới.
- **Nút mở rộng (>>) kiểu nút nổi tinh tế trên mép viền Sidebar**:
  Chuyển đổi nút mở rộng (`>>`) ở trạng thái thu gọn thành nút tròn nổi (`rounded-full shadow-md`) nằm ngay trên đường mép phân cách Sidebar và màn hình chính. Thiết kế này giúp tiết kiệm không gian, vô cùng dễ bấm và mang lại vẻ đẹp hiện đại chuẩn cao cấp.

---

## [v26.07.22-b09] - 22/07/2026

### 🎨 Tinh Giản Giao Diện Điều Hướng & Bảo Toàn Trạng Thái Xuất Báo Cáo

#### 🐛 Sửa Lỗi Trạng Thái Chọn Mẫu (Checkbox) Khi Xuất Kết Quả Theo Tiền Tố
- **Khắc phục triệt để lỗi uncheck mẫu khi chuyển tiền tố**:
  Trước đây, khi xuất kết quả cho một tiền tố (ví dụ: Tiền tố A), dữ liệu nháp tạm cho báo cáo PDF bị vô tình ghi đè xuống Firestore làm các mẫu thuộc tiền tố khác (Tiền tố B, C...) bị đổi sang `selected: false`.
- **Tách biệt dữ liệu xuất PDF & dữ liệu lưu nháp**:
  Tách riêng dữ liệu dùng để sinh PDF (`chunkDraft`) và dữ liệu lưu Firestore (`draftForSave`), đảm bảo duy trì đầy đủ thuộc tính `selected` thực tế của tất cả các mẫu thuộc mọi tiền tố sau khi hoàn tất xuất kết quả.

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
