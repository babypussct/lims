# 📢 Nhật Ký Cập Nhật — LIMS Cloud

Lịch sử phiên bản đầy đủ được hiển thị tại mục [/changelog trên ứng dụng](/changelog), với nội dung tập trung vào những thay đổi hữu ích cho công việc kiểm nghiệm.

## Phiên bản hiện tại: v26.09.03-b05

### v26.09.03-b05

#### 🚀 Điểm Nổi Bật Bản Này

- Gộp trải nghiệm cấu hình cá nhân về một thanh điều hướng ngang thống nhất, loại bỏ khu điều khiển bên trái bị trùng trên các trang tài khoản.
- Bổ sung header hồ sơ dùng chung với avatar, vai trò, trạng thái phiên và các tab Hồ sơ, Bảo mật, Thông báo, Quyền riêng tư.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Chuẩn hóa phần Thông tin cơ bản theo bố cục field-card rõ ràng hơn, đồng thời giữ nguyên dữ liệu định danh và audit hiện có.
- Bổ sung khối hướng dẫn yêu cầu mật khẩu ngay trong trang Bảo mật để người dùng nắm rõ điều kiện trước khi thiết lập hoặc đổi mật khẩu.
- Giữ nguyên sidebar và tìm kiếm cho các trang cấu hình quản trị, tránh làm mất đường dẫn vận hành hệ thống khi tối giản khu vực tài khoản cá nhân.
- Cải thiện khả năng sử dụng trên màn hình nhỏ với thanh tab ngang có cuộn và tự đưa mục đang hoạt động vào vùng nhìn thấy.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục tình trạng trang cấu hình cá nhân đồng thời hiển thị nhiều khu điều hướng gây trùng lặp và chiếm không gian nội dung.

### v26.09.03-b04

#### 🚀 Điểm Nổi Bật Bản Này

- Tinh gọn cây phụ thuộc UniverJS và Vercel để giảm mạnh dung lượng cài đặt cục bộ mà vẫn giữ đầy đủ luồng xem Excel chỉ đọc.
- Tối ưu pipeline Vercel để commit chỉ thay đổi tài liệu, CI hoặc test có thể được bỏ qua đúng cách thay vì luôn kích hoạt full build.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Khởi tạo UniverJS bằng các plugin runtime cần thiết thay cho gói preset tổng hợp, đồng thời loại các preset UI và CSS không sử dụng.
- Giữ Filter, Find, hyperlink, note, number format và các bảo vệ read-only của Excel viewer trong khi giảm kích thước lazy bundle chính.
- Chuyển Vercel CLI sang lệnh npx có phiên bản cố định để không lưu toàn bộ CLI và các adapter framework trong node_modules của dự án.
- Giữ Git metadata trên máy build Vercel để bước kiểm tra phạm vi thay đổi có thể so sánh commit trước khi quyết định build.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục tình trạng ignored build step luôn fail-open do .vercelignore xóa .git trước khi script kiểm tra thay đổi chạy.

### v26.09.03-b03

#### 🚀 Điểm Nổi Bật Bản Này

- Thống nhất thanh điều hướng trên di động vào phần đầu ứng dụng để truy cập tìm kiếm, thông báo và menu thuận tiện hơn.
- Tinh gọn Dashboard về một khu vực chào mừng duy nhất, giảm các khối điều khiển lặp lại và giữ thao tác Quét mã ngay tại tiêu đề trang.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Ẩn thanh điều hướng cố định ở cạnh dưới trên di động và chuyển nút mở menu lên thanh đầu trang.
- Đưa chuông thông báo lên thanh đầu trang di động và bổ sung mục Nhật ký cập nhật vào menu điều hướng.
- Giảm khoảng đệm đáy của nội dung sau khi bỏ thanh điều hướng dưới, giúp không gian hiển thị gọn hơn.
- Đồng nhất tiêu đề Dashboard giữa desktop và di động, đồng thời loại bỏ toolbar Tổng quan vận hành bị trùng chức năng.

#### 🐛 Sửa Lỗi Hệ Thống

- Giữ thao tác mở menu di động hoạt động qua cùng thành phần điều hướng sau khi thay đổi vị trí hiển thị.

### v26.09.03-b02

#### 🚀 Điểm Nổi Bật Bản Này

- Sắp xếp lại thanh điều hướng và khu vực đầu trang để tập trung hơn vào các chức năng sử dụng thường xuyên trong vận hành phòng kiểm nghiệm.
- Chuyển bộ lọc thời gian vào đúng khối Hiệu Suất Phân Tích và cho phép người dùng có quyền Vận hành SOP xem dữ liệu phân tích trên Dashboard.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Đưa ô Tìm chức năng vào chính giữa thanh đầu trang và chuyển nút thu gọn thanh điều hướng về vị trí riêng ở cuối sidebar.
- Ẩn Vận Hành SOP và Theo Dõi Mẫu Ngày khỏi sidebar để giảm trùng lặp, trong khi vẫn giữ khả năng truy cập chức năng từ Dashboard hoặc tìm kiếm.
- Chuyển Quản Lý Yêu Cầu sang nhóm Quản trị để phản ánh đúng cấu trúc nghiệp vụ.
- Loại bỏ các mục Nhật ký thay đổi và Giao diện Sáng/Tối bị lặp trong menu tài khoản.

#### 🐛 Sửa Lỗi Hệ Thống

- Đồng bộ quyền đọc monthly_stats giữa giao diện, dịch vụ thống kê và Firestore Rules để người có SOP_VIEW xem được Hiệu Suất Phân Tích mà không cần REPORT_VIEW.
- Giữ trang Báo Cáo chuyên sâu tiếp tục yêu cầu REPORT_VIEW, tránh mở rộng quyền ngoài phạm vi Dashboard.

### v26.09.03-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Chuẩn hóa toàn bộ khu vực đầu trang trên tất cả các màn hình nghiệp vụ (Kho, Chất chuẩn, Yêu cầu, Kết quả, Báo cáo...), giữ vị trí ổn định và không còn hiện tượng nhảy giật khi chuyển trang.
- Tăng kích thước các nút chuyển tab lựa chọn trên di động, giúp kiểm nghiệm viên thao tác bằng ngón tay nhanh và chính xác hơn.
- Cải thiện tốc độ tải và đảm bảo phiếu in Bảng theo dõi mẫu ngày luôn chuẩn nét, không bị tràn trang khi in ấn.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Đồng bộ vị trí biểu tượng, tiêu đề và dòng mô tả của tất cả các trang làm việc, mang lại trải nghiệm liền mạch và tập trung khi tra cứu hoặc nhập liệu liên tục giữa các phân hệ.
- Cải thiện các thanh lựa chọn chế độ hiển thị tại trang Kết quả và Yêu cầu với nút bấm êm và rõ nét hơn trên cả màn hình cảm ứng lẫn máy tính để bàn.
- Tối ưu hóa Bảng theo dõi mẫu ngày, hiển thị thông báo tải mẻ phân tích rõ ràng và duy trì định dạng xem trước khi in ổn định.
- Đảm bảo bố cục giao diện giữ nguyên vị trí hoàn hảo khi kiểm nghiệm viên bật hoặc tắt chế độ nền tối (Dark mode).

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục hiện tượng xê dịch nhẹ của đầu trang giữa các danh mục cài đặt và nghiệp vụ kiểm nghiệm khi đóng/mở thanh điều hướng.
- Sửa lỗi ẩn các nút chuyển đổi chế độ xem không cần thiết trên màn hình điện thoại nhỏ để dành trọn không gian cho dữ liệu mẫu.

### v26.09.02-b05

#### 🚀 Điểm Nổi Bật Bản Này

- Tinh chỉnh Dashboard, hồ sơ tài khoản và khu vực Cài đặt sát hơn với bố cục, mật độ và bề mặt của Creative Tim Soft UI Dashboard PRO, đồng thời giữ nguyên dữ liệu và nghiệp vụ LIMS.
- Chuẩn hóa sidebar, navbar, card, điều hướng cài đặt và thông tin hồ sơ theo cùng một ngôn ngữ Soft UI nhẹ, nổi khối và nhất quán hơn.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Tinh chỉnh app header và sidenav theo tỷ lệ Soft UI, đưa nút thu gọn về khu vực utility và giảm các border, shadow nặng không cần thiết.
- Điều chỉnh Dashboard để thông tin phạm vi thời gian nằm đúng ngữ cảnh khối phân tích và giữ bố cục tổng quan gọn hơn.
- Thiết kế lại Settings shell với điều hướng dạng Soft UI, card không viền và mật độ nội dung gần live demo hơn trên cả desktop lẫn mobile.
- Tổ chức lại trang hồ sơ tài khoản thành các card thông tin, cá nhân hóa và quyền truy cập rõ ràng hơn, đồng thời giữ nguyên các thao tác sao chép UID và chọn avatar.

#### 🐛 Sửa Lỗi Hệ Thống

- Cập nhật regression contracts để bảo vệ cấu trúc desktop chrome theo tham chiếu Soft UI và tránh sai lệch bố cục ở các lần chỉnh giao diện tiếp theo.

### v26.09.02-b04

#### 🚀 Điểm Nổi Bật Bản Này

- Tinh chỉnh Dashboard desktop sát hơn với bố cục, mật độ và bề mặt của Creative Tim Soft UI Dashboard PRO, đồng thời giữ nguyên dữ liệu và nghiệp vụ LIMS.
- Chuẩn hóa sidebar, navbar, KPI, khối phân tích và bảng hoạt động theo cùng một ngôn ngữ Soft UI nhẹ, nổi khối và nhất quán hơn.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Đưa logo vào sidenav nổi, thu gọn header và utility controls, đồng thời loại bỏ phần chào desktop để Dashboard bắt đầu trực tiếp từ tổng quan vận hành.
- Thu gọn bốn KPI card, đa dạng gradient icon và chuyển các chỉ số phụ sang bố cục divider nhẹ hơn theo tỷ lệ Soft UI.
- Giảm chiều cao các panel phân tích/hoạt động, bỏ border cứng và nền lồng không cần thiết, đồng thời đồng bộ toolbar và ô tìm kiếm với shared Soft UI controls.

#### 🐛 Sửa Lỗi Hệ Thống

- Cập nhật regression contracts để bảo vệ cấu trúc desktop chrome theo tham chiếu Soft UI và tránh lặp changelog trong Dashboard.

### v26.09.02-b03

#### 🚀 Điểm Nổi Bật Bản Này

- Đồng bộ ngôn ngữ thiết kế Soft UI PRO trên toàn bộ các khu vực nghiệp vụ hiện có của LIMS, giữ nguyên luồng xử lý và phân quyền.
- Tăng khả năng sử dụng trên desktop, tablet và mobile với vùng bấm rõ hơn, thao tác bàn phím tốt hơn và hành động không còn phụ thuộc vào hover.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Chuẩn hóa shell, sidebar, header, trang cài đặt, bảng dữ liệu, modal và các primitive dùng chung theo hệ thống màu, bo góc, bóng đổ và khoảng cách Soft UI.
- Cải thiện độ dễ đọc và kích thước control tại Results, Standards, SOP, Recipes, Targets, Config, Inventory, Documents và các màn hình xác thực.
- Tối ưu trạng thái focus, selected, responsive action và các control sao chép, in nhãn, chọn dữ liệu, lịch sử phiên bản để thao tác nhất quán hơn.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục nhiều vùng tương tác chỉ dùng div/span hoặc chỉ hiện khi hover bằng control semantic, trạng thái ARIA và hỗ trợ bàn phím phù hợp.
- Loại bỏ các token màu giao diện cũ còn sót và thống nhất các trạng thái tương tác chính về palette Soft UI của hệ thống.

### v26.09.02-b02

#### 🚀 Điểm Nổi Bật Bản Này

- Vercel CLI được khóa theo phiên bản của dự án để các lần triển khai dùng cùng một công cụ ổn định.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Bổ sung các lệnh kiểm tra trạng thái Vercel, đồng bộ cấu hình, kéo biến môi trường và deploy preview trực tiếp từ npm scripts.
- Luồng deploy production tiếp tục đi qua release gate và dùng Vercel CLI cài trong dự án thay vì tải CLI phát sinh trong lúc triển khai.

#### 🐛 Sửa Lỗi Hệ Thống

- Không có thay đổi trong nhóm này.

### v26.09.02-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Bản cập nhật hệ thống nay đếm liên tục đến khi áp dụng, loại bỏ trạng thái dừng cố định ở mốc 10 giây.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Bổ sung cơ chế Reload Safety dùng chung để chỉ tải lại ứng dụng khi các tác vụ lưu dữ liệu quan trọng đã hoàn tất.
- Màn hình nhập kết quả tự báo trạng thái modified, saving và error cho luồng cập nhật để tránh tải lại khi autosave chưa an toàn.

#### 🐛 Sửa Lỗi Hệ Thống

- Loại bỏ yêu cầu di chuột, nhấn phím hoặc chạm màn hình để tiếp tục countdown cập nhật ở mốc 10 giây.
- Khi countdown về 0 trong lúc dữ liệu đang lưu, hệ thống chờ đến trạng thái synced rồi áp dụng phiên bản mới ngay thay vì ép reload hoặc thêm delay cố định.

### v26.09.01-b04

#### 🚀 Điểm Nổi Bật Bản Này

- Cơ chế cập nhật PWA nay version hóa đồng bộ index.html cùng JavaScript và CSS, giảm nguy cơ lệch phiên bản trong lúc deploy.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Bổ sung regression test cho manifest Service Worker và hợp đồng VERSION_READY để các release sau tiếp tục phát hiện, hiển thị và kích hoạt bản cập nhật đúng luồng.

#### 🐛 Sửa Lỗi Hệ Thống

- Stale-chunk recovery nay fail-closed khi sessionStorage không khả dụng, tránh nguy cơ tạo vòng lặp tải lại khi trình duyệt chặn storage.

### v26.09.01-b03

#### 🚀 Điểm Nổi Bật Bản Này

- Import Chất chuẩn đối chiếu nay nhận diện đúng từng hồ sơ theo Mã quản lý nội bộ, tránh cập nhật nhầm chuẩn cũ khi tên hoặc số lô trùng nhau.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Không có thay đổi trong nhóm này.

#### 🐛 Sửa Lỗi Hệ Thống

- Khi một dòng import có Mã quản lý khác hồ sơ đang có, hệ thống tạo hồ sơ chất chuẩn mới thay vì fallback theo Tên chuẩn + Số lô và ghi đè hồ sơ cũ.

### v26.09.01-b02

#### 🚀 Điểm Nổi Bật Bản Này

- Gia cố các luồng quản trị nhạy cảm trong Cài đặt để tránh ghi đè vai trò, mất quyền âm thầm và trạng thái lưu thành công giả khi backend gặp lỗi.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Phân biệt rõ trạng thái tải lỗi và danh sách người dùng thực sự trống, đồng thời giữ các tài khoản lưu batch thất bại ở trạng thái được chọn để quản trị viên thử lại.
- Bổ sung validation danh mục dữ liệu và định mức hao hụt: không bỏ qua dòng nhập dở, chặn mã trùng và giới hạn phần trăm trong khoảng 0–100%.
- Bổ sung loading/error feedback cho vai trò, tài nguyên chẩn đoán và các thao tác lưu cấu hình hệ thống.

#### 🐛 Sửa Lỗi Hệ Thống

- Chặn tạo vai trò có ID hoặc tên trùng để không ghi đè cấu hình hiện có; chặn xóa vai trò còn nhân viên đang sử dụng.
- Sửa lưu phân quyền để tài khoản Manager/Viewer/Pending không bị gán nhầm roleId mặc định của Staff.
- Sửa modal phân quyền chỉ đóng sau khi lưu thành công và bổ sung xử lý lỗi cho avatar, maintenance, locked features, broadcast và clipboard.

### v26.09.01-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Làm mới toàn diện khu vực Cài đặt với điều hướng responsive, nhãn vai trò rõ ràng và bố cục cấu hình nhất quán trên desktop lẫn mobile.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Chuẩn hóa giao diện các trang Cài đặt, loại bỏ header trùng lặp và bổ sung các biến thể hiển thị theo ngữ cảnh.
- Tối ưu bảng quy tắc hao hụt trên màn hình nhỏ bằng thẻ xếp chồng và chuẩn hóa các utility class Tailwind.
- Hiển thị chính xác nhãn cho đầy đủ các vai trò quản trị, nhân viên, chỉ xem và chờ phê duyệt.

#### 🐛 Sửa Lỗi Hệ Thống

- Sửa auto-scroll điều hướng Cài đặt để tính theo geometry thực của container, tránh cuộn lệch khi deep-link trên desktop và mobile.
- Bổ sung kiểm thử hành vi cho phép tính auto-scroll và giới hạn cuộn ở hai đầu container.

### v26.08.31-b05

#### 🚀 Điểm Nổi Bật Bản Này

- Quy trình kiểm tra trước khi phát hành nay hoàn tất rõ ràng hơn, không còn các cảnh báo lặp lại từ những thành phần đã được xác minh.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Chuẩn hóa cách hệ thống nhận diện các thành phần hỗ trợ xem tài liệu và bảng tính.
- Giữ nguyên chức năng hiện có trong khi giúp việc kiểm tra bản cập nhật dễ theo dõi hơn.

#### 🐛 Sửa Lỗi Hệ Thống

- Loại bỏ các cảnh báo không cần thiết từng xuất hiện trong bước chuẩn bị bản cập nhật.

### v26.08.31-b04

#### 🚀 Điểm Nổi Bật Bản Này

- Nền tảng ứng dụng được tinh gọn để giảm rủi ro xung đột từ các thành phần cũ không còn sử dụng.
- Quy trình kiểm tra và vận hành được thống nhất để các bản cập nhật tiếp theo dễ xác minh và an toàn hơn.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Loại bỏ các thành phần cũ không còn tham gia vào các màn hình và nghiệp vụ hiện tại.
- Cập nhật hướng dẫn cài đặt, kiểm tra và phát hành để người phụ trách hệ thống thao tác theo một quy trình duy nhất.
- Giữ nguyên các chức năng nghiệp vụ hiện có trong khi giảm phần dư thừa cần bảo trì.

#### 🐛 Sửa Lỗi Hệ Thống

- Sửa hướng dẫn chạy thử cũ không còn phù hợp, tránh người phụ trách hệ thống sử dụng nhầm lệnh hoặc cấu hình không cần thiết.

### v26.08.31-b03

#### 🚀 Điểm Nổi Bật Bản Này

- Settings Center được hoàn thiện cho các luồng tài khoản, hệ thống, dữ liệu, phân quyền, chính sách và chẩn đoán theo từng route rõ ràng.
- Luồng ẩn danh hóa tài khoản nay bảo đảm tính nhất quán giữa Firebase Auth và hồ sơ Firestore, có rollback khi cập nhật một phía thất bại.
- Người dùng có thể quản lý đăng ký thông báo đẩy của thiết bị hiện tại và chủ động tắt đăng ký mà không bị tự bật lại ngoài ý muốn.

#### ✨ Tính Năng Mới

- Bổ sung trạng thái bật/tắt và nút gỡ đăng ký FCM cho thiết bị hiện tại trong Cài đặt → Thông báo.
- Bổ sung opt-out push theo từng tài khoản trên trình duyệt để lần mở lại ứng dụng không tự đăng ký lại thiết bị đã tắt.
- Bổ sung kiểm thử route Settings, manager guard, redirect tương thích /config và các contract kiểm tra lỗi một phần của ẩn danh hóa; giữ contract test ngoài thư mục API để không phát sinh Serverless Function ngoài hạn mức.

#### ⚡ Cải Tiến & Tối Ưu

- Giữ các workflow backup/restore hiện hành và bổ sung release verification cho thay đổi Settings mà không thay đổi chính sách dữ liệu backup.
- Chuẩn hóa namespace mặc định của endpoint ẩn danh hóa về artifacts/lims-cloud-fixed, đồng bộ với client và các API khác.
- Cải thiện thông báo trạng thái và lỗi trên giao diện Thông báo để phân biệt thiết bị đã đăng ký, chưa đăng ký và thao tác thất bại.

#### 🐛 Sửa Lỗi Hệ Thống

- Sửa lỗi mở trực tiếp deep-link Settings trong môi trường phát triển gây resolve sai đường dẫn bundle và màn hình trắng bằng cách khai báo base path chuẩn.
- Ngăn endpoint privacy trả thành công khi Firebase Auth hoặc Firestore chưa được cập nhật nhất quán.
- Ngăn thiết bị đã tắt thông báo bị tự động đăng ký FCM lại trong lần khởi động hoặc đăng nhập tiếp theo.

### v26.08.31-b02

#### 🚀 Điểm Nổi Bật Bản Này

- Settings Center được hoàn thiện cho các luồng tài khoản, hệ thống, dữ liệu, phân quyền, chính sách và chẩn đoán theo từng route rõ ràng.
- Luồng ẩn danh hóa tài khoản nay bảo đảm tính nhất quán giữa Firebase Auth và hồ sơ Firestore, có rollback khi cập nhật một phía thất bại.
- Người dùng có thể quản lý đăng ký thông báo đẩy của thiết bị hiện tại và chủ động tắt đăng ký mà không bị tự bật lại ngoài ý muốn.

#### ✨ Tính Năng Mới

- Bổ sung trạng thái bật/tắt và nút gỡ đăng ký FCM cho thiết bị hiện tại trong Cài đặt → Thông báo.
- Bổ sung opt-out push theo từng tài khoản trên trình duyệt để lần mở lại ứng dụng không tự đăng ký lại thiết bị đã tắt.
- Bổ sung kiểm thử route Settings, manager guard, redirect tương thích /config và các contract kiểm tra lỗi một phần của ẩn danh hóa.

#### ⚡ Cải Tiến & Tối Ưu

- Giữ các workflow backup/restore hiện hành và bổ sung release verification cho thay đổi Settings mà không thay đổi chính sách dữ liệu backup.
- Chuẩn hóa namespace mặc định của endpoint ẩn danh hóa về artifacts/lims-cloud-fixed, đồng bộ với client và các API khác.
- Cải thiện thông báo trạng thái và lỗi trên giao diện Thông báo để phân biệt thiết bị đã đăng ký, chưa đăng ký và thao tác thất bại.

#### 🐛 Sửa Lỗi Hệ Thống

- Sửa lỗi mở trực tiếp deep-link Settings trong môi trường phát triển gây resolve sai đường dẫn bundle và màn hình trắng bằng cách khai báo base path chuẩn.
- Ngăn endpoint privacy trả thành công khi Firebase Auth hoặc Firestore chưa được cập nhật nhất quán.
- Ngăn thiết bị đã tắt thông báo bị tự động đăng ký FCM lại trong lần khởi động hoặc đăng nhập tiếp theo.

### v26.08.31-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Thay trang Config dạng tab bằng Settings Center theo route, tách Hồ sơ, Bảo mật, Thông báo, Hệ thống, Dữ liệu, Phân quyền, Chính sách và Chẩn đoán thành các khu vực rõ ràng.
- Backup/restore nay có checkpoint resumable cho bước verify và restore lớn, có thể tiếp tục an toàn qua nhiều lượt xử lý thay vì phụ thuộc một invocation dài.
- Sau khi backup mới verify đạt, hệ thống tự giữ bản hợp lệ mới nhất và đưa các backup cũ vào Thùng rác Google Drive để vẫn có khả năng phục hồi khi cần.

#### ✨ Tính Năng Mới

- Bổ sung Settings Center responsive với tìm kiếm cài đặt, deep-link theo từng domain và route guard cho các khu vực quản trị.
- Bổ sung cơ chế retention cho backup đã verify cùng thông tin retention trong giao diện Backup & Recovery.
- Bổ sung khả năng repair payload Firestore và tiếp tục verify/restore từ checkpoint đã lưu khi phiên serverless bị ngắt.

#### ⚡ Cải Tiến & Tối Ưu

- Các luồng từ header, bottom navigation, QR, activity, notification và master-data đều điều hướng trực tiếp tới route Settings phù hợp; /config chỉ còn redirect tương thích ngược.
- Loại bỏ state, method và nhánh giao diện Config cũ không còn consumer, đồng thời bỏ chế độ monolithic view=all của ConfigGeneralComponent.
- Backup bỏ qua collection runtime backup_locks, theo dõi tiến độ verify chi tiết hơn và xử lý các backup cũ có lỗi policy/catalog theo hướng resumable repair.

#### 🐛 Sửa Lỗi Hệ Thống

- Ngăn command palette tạo mục Config legacy trùng với Settings mới và loại các direct navigation còn sót về /config.
- Sửa các trường hợp backup bị kẹt ở trạng thái FAILED do collection runtime hoặc manifest cũ dù dữ liệu chính vẫn có thể repair và verify lại.
- Giữ fail-closed cho integrity/restore thật sự lỗi, đồng thời phân biệt lỗi transport tạm thời với kết quả verify thất bại cuối cùng.

### v26.08.29-b04

#### 🚀 Điểm Nổi Bật Bản Này

- Khi một tệp Drive không thể backup, thông báo lỗi giờ cho biết các đường dẫn dữ liệu đang tham chiếu tới tệp đó để quản trị viên xác định đúng nguồn cần xử lý.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Danh sách đường dẫn tham chiếu được sắp xếp ổn định và giữ đồng nhất giữa manifest backup và thông báo lỗi.

#### 🐛 Sửa Lỗi Hệ Thống

- Giữ nguyên cơ chế fail-closed cho tài nguyên Drive không truy cập được; hệ thống chỉ bổ sung thông tin chẩn đoán, không tự bỏ qua hoặc sửa tham chiếu dữ liệu.

### v26.08.29-b03

#### 🚀 Điểm Nổi Bật Bản Này

- Backup FAILED do live Apps Script giờ có thể tiếp tục tại chỗ: hệ thống retry Apps Script trước, cập nhật deployment part hiện có và sau đó quay lại đúng checkpoint Drive/repair thay vì tạo snapshot trùng.
- Ba collection lịch sử daily_checks, public và stats_aggregates được backup/restore như retained legacy nhưng vẫn tách khỏi catalog 32 collection active; collection drift khác tiếp tục fail-closed.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Trạng thái backup hiển thị riêng số collection active và retained legacy để quản trị viên thấy rõ phạm vi coverage mà không làm thay đổi contract schema active của manifest.
- Tài liệu vận hành ghi rõ cơ chế resume Apps Script/Drive in-place và policy retained legacy sau audit production ngày 29/08/2026.

#### 🐛 Sửa Lỗi Hệ Thống

- Session FAILED có liveCapture Apps Script lỗi được reopen về APPS_SCRIPT, xóa trạng thái lỗi/verification cũ nhưng giữ deployment part để retry update in-place.
- Sau retry Apps Script, phase transition tôn trọng Drive plan/progress hiện có và tự chuyển sang DRIVE_REPAIR nếu còn asset lỗi.
- Loại stale unknownCollections ở đúng top-level path của retained legacy khỏi manifest failure; nested drift hoặc collection chưa audit vẫn tiếp tục làm backup FAILED.

### v26.08.29-b02

#### 🚀 Điểm Nổi Bật Bản Này

- Khi tiếp tục một backup đã kết thúc FAILED, client nhận đúng trạng thái cuối từ API và dừng vòng retry thay vì lặp lại DRIVE_REPAIR/FINALIZE vô hạn.
- Màn hình cấu hình hiển thị trạng thái backup gần nhất cùng lỗi manifest để quản trị viên có thể chẩn đoán nguyên nhân thất bại ngay tại UI.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Toast sau khi tạo hoặc tiếp tục backup dùng mức error cho trạng thái FAILED và kèm lỗi đầu tiên nếu manifest trả về chi tiết chẩn đoán.
- Card backup gần nhất phân biệt trực quan FAILED với trạng thái hợp lệ và hiển thị tối đa ba lỗi manifest để tránh phải suy đoán từ trạng thái tổng quát.

#### 🐛 Sửa Lỗi Hệ Thống

- HTTP 422 kèm done=true từ /api/backup/create được coi là kết quả terminal của session đang resume thay vì lỗi transient cần retry.
- Ngăn vòng lặp FAILED → DRIVE_REPAIR → FINALIZE → FAILED khi backup không thể được hoàn tất sau bước repair.

### v26.08.29-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Bổ sung cơ chế backup tùy chỉnh mã hóa lên Google Drive cho Firestore, Firebase Auth, tệp CoA/PDF/Google Docs/Excel, mẫu báo cáo và cấu hình Apps Script.
- Mỗi backup được kiểm tra đọc ngược, checksum, cấu trúc catalog và quyền truy cập trước khi được công nhận hoàn tất; không sử dụng Firestore managed export cần gói thanh toán.
- Có thể tiếp tục đúng backup đã chọn và sửa lại riêng các tệp Drive lỗi mà không chạy lại snapshot Firestore/Auth đã hoàn tất.

#### ✨ Tính Năng Mới

- Thu thập đệ quy toàn bộ catalog Firestore hiện tại, các subcollection/collection group, hồ sơ người dùng và đối soát UID giữa Auth với hồ sơ Firestore.
- Quét cây Drive nguồn, các ID tệp được tham chiếu trong dữ liệu, toàn bộ template cấu hình và native copy cho tệp Workspace để phục hồi tốt hơn.
- Chụp source/config Apps Script trong repository và kiểm chứng thêm project, content, deployments đang sống qua Apps Script API với quyền chỉ đọc.
- Thêm màn hình quản trị, quyền BACKUP_CREATE/BACKUP_VERIFY/BACKUP_RESTORE, audit log token-free và hướng dẫn cấu hình OAuth/quota/restore.

#### ⚡ Cải Tiến & Tối Ưu

- Bổ sung guard dung lượng Drive trước và sau backup, giới hạn đọc/ghi Firestore, manifest minh bạch về consistency boundary và cảnh báo khi dữ liệu nguồn có vấn đề.
- Khôi phục Drive theo quan hệ parent trước, tự remap link Firestore khi tệp bị tạo lại bằng ID mới, đồng thời bảo vệ thay đổi nghiệp vụ hiện có trong RECOVER_MISSING.
- Thêm retry/backoff có giới hạn cho lỗi đọc/export Drive 429 và 5xx, đồng thời giữ lỗi 404/không hỗ trợ ở trạng thái chặn để không chứng nhận backup thiếu dữ liệu.

#### 🐛 Sửa Lỗi Hệ Thống

- Không còn coi backup chỉ gồm hai collection sops và inventory là backup toàn hệ thống.
- Sửa các trường hợp restore batch/JSON cũ có thể gây lỗi hoặc ghi đè không kiểm soát; bổ sung kiểm tra kiểu dữ liệu Firestore, catalog và Drive ACL.
- Ngăn việc công nhận backup hoàn tất nếu thiếu live Apps Script snapshot, thiếu payload/tệp, checksum sai, quyền chia sẻ không an toàn hoặc không đọc lại được manifest.
- Sửa cấu hình đóng gói function Vercel để deployment production có thể trace source Apps Script và khởi chạy đúng schema.
- Gom router backup và OAuth vào các function dùng chung, giữ tổng số Serverless Functions trong giới hạn Hobby miễn phí mà không đổi các URL API hiện hữu.
- Sửa trường hợp backup đã đi hết Drive nhưng fail ở finalize: session FAILED có thể repair các asset chưa BACKED_UP và cập nhật manifest cũ tại chỗ thay vì tạo manifest hoặc snapshot mới.

### v26.08.28-b03

#### 🚀 Điểm Nổi Bật Bản Này

- Bổ sung cơ chế backup tùy chỉnh mã hóa lên Google Drive cho Firestore, Firebase Auth, tệp CoA/PDF/Google Docs/Excel, mẫu báo cáo và cấu hình Apps Script.
- Mỗi backup được kiểm tra đọc ngược, checksum, cấu trúc catalog và quyền truy cập trước khi được công nhận hoàn tất; không sử dụng Firestore managed export cần gói thanh toán.
- Có dry-run, khôi phục an toàn phần còn thiếu, restore chọn lọc, full replace có xác nhận riêng và checkpoint mã hóa để tiếp tục khi restore bị gián đoạn.

#### ✨ Tính Năng Mới

- Thu thập đệ quy toàn bộ catalog Firestore hiện tại, các subcollection/collection group, hồ sơ người dùng và đối soát UID giữa Auth với hồ sơ Firestore.
- Quét cây Drive nguồn, các ID tệp được tham chiếu trong dữ liệu, toàn bộ template cấu hình và native copy cho tệp Workspace để phục hồi tốt hơn.
- Chụp source/config Apps Script trong repository và kiểm chứng thêm project, content, deployments đang sống qua Apps Script API với quyền chỉ đọc.
- Thêm màn hình quản trị, quyền BACKUP_CREATE/BACKUP_VERIFY/BACKUP_RESTORE, audit log token-free và hướng dẫn cấu hình OAuth/quota/restore.

#### ⚡ Cải Tiến & Tối Ưu

- Bổ sung guard dung lượng Drive trước và sau backup, giới hạn đọc/ghi Firestore, manifest minh bạch về consistency boundary và cảnh báo khi dữ liệu nguồn có vấn đề.
- Khôi phục Drive theo quan hệ parent trước, tự remap link Firestore khi tệp bị tạo lại bằng ID mới, đồng thời bảo vệ thay đổi nghiệp vụ hiện có trong RECOVER_MISSING.
- Loại bỏ đường export/import JSON cũ có nguy cơ khôi phục không an toàn; mọi thao tác restore mới đều đi qua kiểm tra integrity và xác thực quyền quản trị.

#### 🐛 Sửa Lỗi Hệ Thống

- Không còn coi backup chỉ gồm hai collection sops và inventory là backup toàn hệ thống.
- Sửa các trường hợp restore batch/JSON cũ có thể gây lỗi hoặc ghi đè không kiểm soát; bổ sung kiểm tra kiểu dữ liệu Firestore, catalog và Drive ACL.
- Ngăn việc công nhận backup hoàn tất nếu thiếu live Apps Script snapshot, thiếu payload/tệp, checksum sai, quyền chia sẻ không an toàn hoặc không đọc lại được manifest.
- Sửa cấu hình đóng gói function Vercel để deployment production có thể trace source Apps Script và khởi chạy đúng schema.
- Gom router backup và OAuth vào các function dùng chung, giữ tổng số Serverless Functions trong giới hạn Hobby miễn phí mà không đổi các URL API hiện hữu.

### v26.08.28-b02

#### 🚀 Điểm Nổi Bật Bản Này

- Bổ sung cơ chế backup tùy chỉnh mã hóa lên Google Drive cho Firestore, Firebase Auth, tệp CoA/PDF/Google Docs/Excel, mẫu báo cáo và cấu hình Apps Script.
- Mỗi backup được kiểm tra đọc ngược, checksum, cấu trúc catalog và quyền truy cập trước khi được công nhận hoàn tất; không sử dụng Firestore managed export cần gói thanh toán.
- Có dry-run, khôi phục an toàn phần còn thiếu, restore chọn lọc, full replace có xác nhận riêng và checkpoint mã hóa để tiếp tục khi restore bị gián đoạn.

#### ✨ Tính Năng Mới

- Thu thập đệ quy toàn bộ catalog Firestore hiện tại, các subcollection/collection group, hồ sơ người dùng và đối soát UID giữa Auth với hồ sơ Firestore.
- Quét cây Drive nguồn, các ID tệp được tham chiếu trong dữ liệu, toàn bộ template cấu hình và native copy cho tệp Workspace để phục hồi tốt hơn.
- Chụp source/config Apps Script trong repository và kiểm chứng thêm project, content, deployments đang sống qua Apps Script API với quyền chỉ đọc.
- Thêm màn hình quản trị, quyền BACKUP_CREATE/BACKUP_VERIFY/BACKUP_RESTORE, audit log token-free và hướng dẫn cấu hình OAuth/quota/restore.

#### ⚡ Cải Tiến & Tối Ưu

- Bổ sung guard dung lượng Drive trước và sau backup, giới hạn đọc/ghi Firestore, manifest minh bạch về consistency boundary và cảnh báo khi dữ liệu nguồn có vấn đề.
- Khôi phục Drive theo quan hệ parent trước, tự remap link Firestore khi tệp bị tạo lại bằng ID mới, đồng thời bảo vệ thay đổi nghiệp vụ hiện có trong RECOVER_MISSING.
- Loại bỏ đường export/import JSON cũ có nguy cơ khôi phục không an toàn; mọi thao tác restore mới đều đi qua kiểm tra integrity và xác thực quyền quản trị.

#### 🐛 Sửa Lỗi Hệ Thống

- Không còn coi backup chỉ gồm hai collection sops và inventory là backup toàn hệ thống.
- Sửa các trường hợp restore batch/JSON cũ có thể gây lỗi hoặc ghi đè không kiểm soát; bổ sung kiểm tra kiểu dữ liệu Firestore, catalog và Drive ACL.
- Ngăn việc công nhận backup hoàn tất nếu thiếu live Apps Script snapshot, thiếu payload/tệp, checksum sai, quyền chia sẻ không an toàn hoặc không đọc lại được manifest.
- Sửa cấu hình đóng gói function Vercel để deployment production có thể trace source Apps Script và khởi chạy đúng schema.

### v26.08.28-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Bổ sung cơ chế backup tùy chỉnh mã hóa lên Google Drive cho Firestore, Firebase Auth, tệp CoA/PDF/Google Docs/Excel, mẫu báo cáo và cấu hình Apps Script.
- Mỗi backup được kiểm tra đọc ngược, checksum, cấu trúc catalog và quyền truy cập trước khi được công nhận hoàn tất; không sử dụng Firestore managed export cần gói thanh toán.
- Có dry-run, khôi phục an toàn phần còn thiếu, restore chọn lọc, full replace có xác nhận riêng và checkpoint mã hóa để tiếp tục khi restore bị gián đoạn.

#### ✨ Tính Năng Mới

- Thu thập đệ quy toàn bộ catalog Firestore hiện tại, các subcollection/collection group, hồ sơ người dùng và đối soát UID giữa Auth với hồ sơ Firestore.
- Quét cây Drive nguồn, các ID tệp được tham chiếu trong dữ liệu, toàn bộ template cấu hình và native copy cho tệp Workspace để phục hồi tốt hơn.
- Chụp source/config Apps Script trong repository và kiểm chứng thêm project, content, deployments đang sống qua Apps Script API với quyền chỉ đọc.
- Thêm màn hình quản trị, quyền BACKUP_CREATE/BACKUP_VERIFY/BACKUP_RESTORE, audit log token-free và hướng dẫn cấu hình OAuth/quota/restore.

#### ⚡ Cải Tiến & Tối Ưu

- Bổ sung guard dung lượng Drive trước và sau backup, giới hạn đọc/ghi Firestore, manifest minh bạch về consistency boundary và cảnh báo khi dữ liệu nguồn có vấn đề.
- Khôi phục Drive theo quan hệ parent trước, tự remap link Firestore khi tệp bị tạo lại bằng ID mới, đồng thời bảo vệ thay đổi nghiệp vụ hiện có trong RECOVER_MISSING.
- Loại bỏ đường export/import JSON cũ có nguy cơ khôi phục không an toàn; mọi thao tác restore mới đều đi qua kiểm tra integrity và xác thực quyền quản trị.

#### 🐛 Sửa Lỗi Hệ Thống

- Không còn coi backup chỉ gồm hai collection sops và inventory là backup toàn hệ thống.
- Sửa các trường hợp restore batch/JSON cũ có thể gây lỗi hoặc ghi đè không kiểm soát; bổ sung kiểm tra kiểu dữ liệu Firestore, catalog và Drive ACL.
- Ngăn việc công nhận backup hoàn tất nếu thiếu live Apps Script snapshot, thiếu payload/tệp, checksum sai, quyền chia sẻ không an toàn hoặc không đọc lại được manifest.

### v26.08.27-b03

#### 🚀 Điểm Nổi Bật Bản Này

- Mục “Mới kể từ lần truy cập trước” trên Dashboard được ghi nhận theo từng lần mở lại, phản ánh đúng các hoạt động phát sinh sau lần xem gần nhất.
- Hộp thông báo áp dụng vòng đời 7 ngày và tự dọn hằng ngày, giảm dữ liệu dư thừa nhưng không ảnh hưởng nhật ký nghiệp vụ.

#### ✨ Tính Năng Mới

- Bổ sung cleanup backend có xác thực CRON_SECRET, xử lý theo batch 400 bản ghi và giới hạn 2.000 bản ghi mỗi lần chạy để phù hợp quota Spark.
- Giữ Activity Feed, audit log và mốc lần xem cuối độc lập với retention của hộp thông báo.

#### ⚡ Cải Tiến & Tối Ưu

- Ẩn ngay thông báo quá hạn khỏi giao diện và badge, đồng thời dọn bù an toàn các bản ghi cũ đã được listener tải về trước lịch chạy nền.
- Dùng một cơ chế khởi tạo Firebase Admin dùng chung cho API thông báo và tác vụ dọn định kỳ, giảm cấu hình trùng lặp.

#### 🐛 Sửa Lỗi Hệ Thống

- Sửa lỗi Dashboard đánh dấu trạng thái đã xem ở phạm vi dùng chung, khiến lần truy cập sau không hiển thị đúng hoạt động mới.
- Sửa lỗi thông báo cũ hơn thời hạn vẫn có thể xuất hiện trong danh sách hoặc số đếm chưa đọc.
- Bổ sung kiểm tra không xóa các bản ghi thông báo thiếu hoặc có timestamp không hợp lệ để tránh dọn nhầm dữ liệu.

### v26.08.27-b02

#### 🚀 Điểm Nổi Bật Bản Này

- Nhật ký hoạt động không còn bị ẩn chỉ vì một số phiếu lịch sử thiếu dữ liệu phục vụ riêng cho báo cáo kho.
- Báo cáo nhập - xuất - tồn khôi phục được các biến động lịch sử khi phiếu gốc vẫn còn thông tin đầy đủ.

#### ✨ Tính Năng Mới

- Bổ sung khả năng đối chiếu phiếu gốc và lịch sử chỉnh sửa để tính lại số liệu kho trong các kỳ báo cáo cũ.
- Giữ nguyên trạng thái cảnh báo đối với những biến động không đủ căn cứ xác minh, tránh hiển thị số liệu phỏng đoán.

#### ⚡ Cải Tiến & Tối Ưu

- Tách điều kiện đầy đủ dữ liệu của Nhật ký hoạt động khỏi điều kiện tái dựng báo cáo nhập - xuất - tồn.
- Tiếp tục tải đầy đủ lịch sử báo cáo theo khoảng ngày, không phụ thuộc danh sách hoạt động gần đây.

#### 🐛 Sửa Lỗi Hệ Thống

- Sửa lỗi toàn bộ nhật ký nghiệp vụ bị biến mất khi dữ liệu phiếu in lịch sử không còn đầy đủ.
- Sửa lỗi báo cáo nhập - xuất - tồn bỏ sót lượng dùng và các lần điều chỉnh của một số phiếu SmartBatch cũ.
- Bổ sung kiểm tra an toàn để chỉ phục hồi số liệu khi lịch sử phiếu có đủ căn cứ đối chiếu.

### v26.08.27-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Báo cáo thống kê tải đầy đủ dữ liệu lịch sử theo từng trang và chỉ kết luận khi đã xác minh nguồn dữ liệu hoàn tất.
- Production chỉ được gán domain sau khi Release Gate thành công, đồng thời tự chặn thay đổi ứng dụng không có version và changelog mới.

#### ✨ Tính Năng Mới

- Bổ sung bộ kiểm tra release discipline cho code, API, GAS, Firestore và cấu hình production trước khi push hoặc promote deployment.
- Bổ sung dữ liệu biến động tồn kho trong lịch sử audit để báo cáo có thể tái dựng nhập, xuất và hoàn trả theo thời gian.

#### ⚡ Cải Tiến & Tối Ưu

- Phân trang toàn bộ yêu cầu chất chuẩn, chuẩn đối chiếu và yêu cầu đã duyệt thay vì dùng cache hoặc giới hạn bản ghi gần nhất cho báo cáo.
- Giữ lịch sử phiếu in phục vụ audit khi người dùng xóa mục khỏi hàng đợi và giảm các listener nền không cần thiết cho tài khoản chỉ xem báo cáo.
- Bỏ qua Vercel build đối với commit chỉ thay đổi tài liệu, CI hoặc kiểm thử để lịch sử production không còn nhiễu.

#### 🐛 Sửa Lỗi Hệ Thống

- Sửa báo cáo thiếu dữ liệu lịch sử do nhầm cache vận hành có giới hạn là dữ liệu hoàn chỉnh.
- Sửa cảnh báo báo cáo chưa hoàn tất xuất hiện sai sau khi các nguồn dữ liệu bắt buộc đã tải thành công.
- Đồng bộ quyền đọc Firestore tối thiểu cho tài khoản có quyền xem báo cáo mà không mở rộng quyền ghi, sửa hoặc xóa.

### v26.08.26-b04

#### 🚀 Điểm Nổi Bật Bản Này

- Đồng bộ mã nội bộ chất chuẩn theo từng batch an toàn, có quét lại trước và sau khi ghi để bảo vệ dữ liệu nghiệp vụ.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Tự chia nhỏ các thay đổi liên quan đến registry, yêu cầu và nhật ký theo ngân sách truy cập Firestore Rules, đồng thời lưu audit snapshot Before/After cho từng batch.
- Tăng thời gian chờ cho các lượt quét lớn và chỉ cho phép sửa tham chiếu nhật ký khi mã của chuẩn cha đã được xác minh hợp lệ.

#### 🐛 Sửa Lỗi Hệ Thống

- Sửa lỗi batch đồng bộ bị từ chối do các lượt tra cứu Security Rules trùng lặp trong cùng một ghi atomic.
- Không còn phân loại nhầm thay đổi nhật ký là an toàn khi hồ sơ chuẩn cha đang thiếu hoặc có mã không hợp lệ.

### v26.08.26-b03

#### 🚀 Điểm Nổi Bật Bản Này

- Các lần thử lại khi xuất báo cáo PDF được nhận diện đúng theo nội dung dữ liệu thực tế, tránh nhầm lẫn giữa các bản báo cáo khác nhau.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Giữ khả năng dùng lại bản PDF đã tạo khi người dùng gửi lại đúng cùng một nội dung sau sự cố mạng hoặc lưu nháp.
- Bổ sung kiểm thử hồi quy cho các trường hợp thay đổi kết quả, thông tin mẻ và thứ tự trường dữ liệu trước khi xuất bản lại.

#### 🐛 Sửa Lỗi Hệ Thống

- Sửa lỗi không thể xuất lại báo cáo sau khi dữ liệu kết quả hoặc metadata đã được chỉnh sửa trong khi vẫn ở cùng phiên bản hiển thị.
- Giữ nguyên cơ chế chống tạo PDF trùng của GAS trong khi phân biệt đúng các payload báo cáo khác nhau.

### v26.08.26-b02

#### 🚀 Điểm Nổi Bật Bản Này

- Quét và đồng bộ mã nội bộ Chất chuẩn phản hồi ổn định hơn khi dữ liệu lớn hoặc kết nối chậm, tránh cửa sổ bị giữ ở trạng thái đang xử lý quá lâu.
- Báo cáo GAS tiếp tục giữ đúng lựa chọn QC của người dùng ngay cả khi biểu mẫu thực tế có khác biệt nhỏ về khoảng trắng hoặc cách trình bày checkbox.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Tăng tốc bước rà soát nhật ký Chất chuẩn bằng cách xử lý nhiều nhóm dữ liệu đồng thời nhưng vẫn giới hạn tải an toàn.
- Cho phép người dùng Quét lại khi một lần quét mã nội bộ mất quá lâu thay vì phải đóng và mở lại cửa sổ.
- Bổ sung kiểm tra tự động để bảo đảm dữ liệu QC của SOP 9.14 được giữ nguyên khi tạo PDF.

#### 🐛 Sửa Lỗi Hệ Thống

- Đồng bộ mã nội bộ sẽ dừng an toàn trước khi ghi nếu lần kiểm tra dữ liệu mới nhất không hoàn tất kịp thời, tránh ghi từ trạng thái chưa được xác minh.
- Sửa nhận dạng các dòng QC trong biểu mẫu GAS khi nhãn có xuống dòng hoặc khoảng trắng khác với cấu hình.
- Biểu mẫu GAS không còn bắt buộc phải có lựa chọn N/A riêng nếu nghiệp vụ biểu diễn N/A bằng trạng thái bỏ chọn cả Đạt và Không đạt.

### v26.08.26-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Đồng bộ trạng thái đánh giá giữa giao diện LIMS và PDF kết quả cho SOP 9.14 cùng các biểu mẫu GAS dùng chung renderer.
- Loại bỏ các giá trị nghiệp vụ mặc định bị tự suy diễn khi payload không cung cấp dữ liệu, giúp PDF phản ánh đúng dữ liệu người dùng đã nhập.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Chuẩn hóa xử lý checkbox Unicode và ASCII để luôn ghi đè trạng thái tick có sẵn trong template theo dữ liệu hiện tại.
- Trạng thái phát hiện/không phát hiện được suy ra từ kết quả mẫu thực tế và bỏ qua các mẫu QC kiểm soát khi đánh giá toàn mẻ.
- Bổ sung regression test cho mapping QC SOP 9.14, Form Check/Form Đơn, pagination, nhận dạng mẫu và dữ liệu số 0.

#### 🐛 Sửa Lỗi Hệ Thống

- QC thiếu dữ liệu không còn bị đánh giá ngầm là Đạt; renderer chuyển về N/A hoặc bỏ chọn theo đúng ngữ cảnh.
- Không còn tự gán F=1, khối lượng 10 g, loại mẫu Thủy sản hoặc tình trạng Bình thường khi metadata tương ứng bị thiếu.
- Sửa mapping SOP 9.14 để các mục Mẫu kiểm tra nội bộ, Độ lệch thời gian lưu, yêu cầu nhận dạng, mẫu thêm chuẩn 5 ppb và độ thu hồi IS đồng bộ giữa UI và PDF.
- Template có checkbox tick sẵn như ☑, ☒, [x] hoặc (x) được xóa/ghi đè đúng thay vì giữ trạng thái cũ.

### v26.08.25-b05

#### 🚀 Điểm Nổi Bật Bản Này

- Activity Feed và chuông thông báo V2 đã được bật global sau migration, Rules cutover, role smoke và observation production.
- Đường đọc Dashboard legacy đã được loại bỏ; Activity Feed hiện dùng duy nhất canonical event theo audience và registry.
- Print Queue cá nhân đã chuyển hoàn toàn sang ownership bằng actorUid; Firestore Rules printable đã siết UID-only.
- Backfill production đã chuẩn hóa toàn bộ event hiện có và giữ các trường compatibility trong document để traceability/rollback dữ liệu.

#### ✨ Tính Năng Mới

- Dashboard, Statistics và Traceability lấy nhãn, icon, module và mức độ từ Activity Action Registry thay vì heuristic theo chuỗi action.
- Notification dispatch tiếp tục dùng eventId canonical, recipient resolution server-side, actor suppression và retry idempotence.
- Các role Manager, QC Lead, Lab Technician, Viewer, Pending và Staff default đã có smoke evidence tương ứng.
- Rules Emulator, Auth/Firestore notification workflow Emulator và production public/private boundary đã được kiểm tra trong release gate.

#### ⚡ Cải Tiến & Tối Ưu

- Dashboard chỉ khởi động ActivityFeedService khi rollout global/canary hợp lệ; scope thay đổi realtime sẽ clear listener trước khi publish.
- Các query printable cá nhân không còn phụ thuộc displayName, tránh nhầm quyền khi đổi tên hoặc trùng tên.
- Dữ liệu cũ vẫn giữ user, printable và printJobId để bảo toàn traceability; cleanup reader không xóa lịch sử.
- Feature flag và cấu hình rollback vẫn được giữ ở mức rollout để có thể tắt surface V2 nếu cần điều tra.

#### 🐛 Sửa Lỗi Hệ Thống

- Loại bỏ fallback Dashboard theo log global/personal và state Activity adapter không còn consumer.
- Loại bỏ các phân loại action bằng includes trong Dashboard, Statistics và Traceability; action không đăng ký không được suy đoán.
- Rules từ chối truy vấn printable theo user/displayName và chỉ cho phép actorUid của tài khoản hiện tại.
- Cập nhật contract/Rules Emulator tests để khóa UID-only ownership và ngăn legacy reader quay lại.

### v26.08.25-b04

#### 🚀 Điểm Nổi Bật Bản Này

- Bổ sung rollout canary theo UID đã xác minh để kiểm tra Activity Feed và chuông thông báo theo từng tài khoản trước khi mở rộng toàn hệ thống.
- Hoạt động trên phiếu, kết quả, kho và chất chuẩn được trình bày theo đúng phạm vi công việc người dùng được phân quyền.
- Thông báo chuông và hoạt động liên quan dùng cùng một nội dung, liên kết mở đúng hồ sơ và hạn chế gửi lặp.
- Lịch sử in, báo cáo và kiểm tra mẫu được giữ ổn định khi giao diện Hoạt động được nâng cấp; các bản ghi cũ được gắn đúng tài khoản đã xác minh.

#### ✨ Tính Năng Mới

- Bổ sung cách xem hoạt động theo nhóm nghiệp vụ, mức độ quan trọng, tìm kiếm theo thông tin có cấu trúc và mở nhanh hồ sơ liên quan.
- Bổ sung cảnh báo tồn kho sắp hết theo thời điểm chuyển ngưỡng để người dùng nhận đúng thông tin cần xử lý.
- Lịch sử đánh dấu và bỏ đánh dấu kiểm tra mẫu được hiển thị nhất quán trong hoạt động.
- Các bản ghi hoạt động trước đây được chuẩn hóa theo tài khoản đã xác minh để tra cứu đúng người thực hiện.

#### ⚡ Cải Tiến & Tối Ưu

- Feature flag V2 vẫn fail-closed cho người chưa đăng nhập; cấu hình sai hoặc thiếu UID không thể tự bật rollout.
- Người dùng có quyền phù hợp có thể xem hoạt động chung của workspace thay vì chỉ thấy thao tác do chính mình thực hiện.
- Hàng đợi in, thống kê và tra cứu nguồn gốc tiếp tục hoạt động độc lập, không bị ảnh hưởng khi bộ lọc Hoạt động thay đổi.
- Giao diện Dashboard và chuông thông báo được cải thiện cho màn hình nhỏ, thao tác bàn phím và trạng thái trống hoặc bị từ chối.

#### 🐛 Sửa Lỗi Hệ Thống

- Ngăn việc thử nghiệm canary làm thay đổi hành vi của toàn bộ người dùng khi công tắc global vẫn đang tắt.
- Ngăn phân loại sai hoạt động khi người thực hiện là quản lý, QC hoặc nhân viên phòng thí nghiệm; quyền hiển thị được xác định theo nghiệp vụ của hoạt động.
- Ngăn liên kết ngoài, dữ liệu nhạy cảm và nội dung không hợp lệ đi vào hoạt động hoặc thông báo.
- Giữ quyền sở hữu lịch sử theo tài khoản ngay cả khi người dùng đổi tên hiển thị hoặc bị giảm quyền.

### v26.08.25-b03

#### 🚀 Điểm Nổi Bật Bản Này

- Hoạt động trên phiếu, kết quả, kho và chất chuẩn được trình bày theo đúng phạm vi công việc người dùng được phân quyền.
- Thông báo chuông và hoạt động liên quan dùng cùng một nội dung, liên kết mở đúng hồ sơ và hạn chế gửi lặp.
- Lịch sử in, báo cáo và kiểm tra mẫu được giữ ổn định khi giao diện Hoạt động được nâng cấp; các bản ghi cũ được gắn đúng tài khoản đã xác minh.

#### ✨ Tính Năng Mới

- Bổ sung cách xem hoạt động theo nhóm nghiệp vụ, mức độ quan trọng, tìm kiếm theo thông tin có cấu trúc và mở nhanh hồ sơ liên quan.
- Bổ sung cảnh báo tồn kho sắp hết theo thời điểm chuyển ngưỡng để người dùng nhận đúng thông tin cần xử lý.
- Lịch sử đánh dấu và bỏ đánh dấu kiểm tra mẫu được hiển thị nhất quán trong hoạt động.
- Các bản ghi hoạt động trước đây được chuẩn hóa theo tài khoản đã xác minh để tra cứu đúng người thực hiện.

#### ⚡ Cải Tiến & Tối Ưu

- Người dùng có quyền phù hợp có thể xem hoạt động chung của workspace thay vì chỉ thấy thao tác do chính mình thực hiện.
- Hàng đợi in, thống kê và tra cứu nguồn gốc tiếp tục hoạt động độc lập, không bị ảnh hưởng khi bộ lọc Hoạt động thay đổi.
- Giao diện Dashboard và chuông thông báo được cải thiện cho màn hình nhỏ, thao tác bàn phím và trạng thái trống hoặc bị từ chối.

#### 🐛 Sửa Lỗi Hệ Thống

- Ngăn phân loại sai hoạt động khi người thực hiện là quản lý, QC hoặc nhân viên phòng thí nghiệm; quyền hiển thị được xác định theo nghiệp vụ của hoạt động.
- Ngăn liên kết ngoài, dữ liệu nhạy cảm và nội dung không hợp lệ đi vào hoạt động hoặc thông báo.
- Giữ quyền sở hữu lịch sử theo tài khoản ngay cả khi người dùng đổi tên hiển thị hoặc bị giảm quyền.

### v26.08.25-b02

#### 🚀 Điểm Nổi Bật Bản Này

- Hoạt động trên phiếu, kết quả, kho và chất chuẩn được trình bày theo đúng phạm vi công việc người dùng được phân quyền.
- Thông báo chuông và hoạt động liên quan dùng cùng một nội dung, liên kết mở đúng hồ sơ và hạn chế gửi lặp.
- Lịch sử in, báo cáo và kiểm tra mẫu được giữ ổn định khi giao diện Hoạt động được nâng cấp.

#### ✨ Tính Năng Mới

- Bổ sung cách xem hoạt động theo nhóm nghiệp vụ, mức độ quan trọng, tìm kiếm theo thông tin có cấu trúc và mở nhanh hồ sơ liên quan.
- Bổ sung cảnh báo tồn kho sắp hết theo thời điểm chuyển ngưỡng để người dùng nhận đúng thông tin cần xử lý.
- Lịch sử đánh dấu và bỏ đánh dấu kiểm tra mẫu được hiển thị nhất quán trong hoạt động.

#### ⚡ Cải Tiến & Tối Ưu

- Người dùng có quyền phù hợp có thể xem hoạt động chung của workspace thay vì chỉ thấy thao tác do chính mình thực hiện.
- Hàng đợi in, thống kê và tra cứu nguồn gốc tiếp tục hoạt động độc lập, không bị ảnh hưởng khi bộ lọc Hoạt động thay đổi.
- Giao diện Dashboard và chuông thông báo được cải thiện cho màn hình nhỏ, thao tác bàn phím và trạng thái trống hoặc bị từ chối.

#### 🐛 Sửa Lỗi Hệ Thống

- Ngăn phân loại sai hoạt động khi người thực hiện là quản lý, QC hoặc nhân viên phòng thí nghiệm; quyền hiển thị được xác định theo nghiệp vụ của hoạt động.
- Ngăn liên kết ngoài, dữ liệu nhạy cảm và nội dung không hợp lệ đi vào hoạt động hoặc thông báo.
- Giữ quyền sở hữu lịch sử theo tài khoản ngay cả khi người dùng đổi tên hiển thị hoặc bị giảm quyền.

### v26.08.25-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Hoạt động trên phiếu, kết quả, kho và chất chuẩn được trình bày theo đúng phạm vi công việc người dùng được phân quyền.
- Thông báo chuông và hoạt động liên quan dùng cùng một nội dung, liên kết mở đúng hồ sơ và hạn chế gửi lặp.
- Lịch sử in và báo cáo được giữ ổn định khi giao diện Hoạt động được nâng cấp.

#### ✨ Tính Năng Mới

- Bổ sung cách xem hoạt động theo nhóm nghiệp vụ, mức độ quan trọng, tìm kiếm theo thông tin có cấu trúc và mở nhanh hồ sơ liên quan.
- Bổ sung cảnh báo tồn kho sắp hết theo thời điểm chuyển ngưỡng để người dùng nhận đúng thông tin cần xử lý.

#### ⚡ Cải Tiến & Tối Ưu

- Người dùng có quyền phù hợp có thể xem hoạt động chung của workspace thay vì chỉ thấy thao tác do chính mình thực hiện.
- Hàng đợi in, thống kê và tra cứu nguồn gốc tiếp tục hoạt động độc lập, không bị ảnh hưởng khi bộ lọc Hoạt động thay đổi.
- Giao diện Dashboard và chuông thông báo được cải thiện cho màn hình nhỏ, thao tác bàn phím và trạng thái trống hoặc bị từ chối.

#### 🐛 Sửa Lỗi Hệ Thống

- Ngăn phân loại sai hoạt động khi người thực hiện là quản lý, QC hoặc nhân viên phòng thí nghiệm; quyền hiển thị được xác định theo nghiệp vụ của hoạt động.
- Ngăn liên kết ngoài, dữ liệu nhạy cảm và nội dung không hợp lệ đi vào hoạt động hoặc thông báo.
- Giữ quyền sở hữu lịch sử theo tài khoản ngay cả khi người dùng đổi tên hiển thị hoặc bị giảm quyền.

### v26.08.24-b07

#### 🚀 Điểm Nổi Bật Bản Này

- Ctrl+A trong Excel Viewer giờ chỉ chọn đúng vùng dữ liệu thực tế của sheet thay vì toàn bộ worksheet của Univer.
- Smart Fit tự tính độ rộng cột, wrap text và chiều cao hàng cho mọi sheet để nội dung dài luôn hiển thị đầy đủ.
- Chuyển sheet không còn xuất hiện hộp thoại quyền do các bước tinh chỉnh layout được hoàn tất trước khi khóa bản xem trước ở chế độ chỉ đọc.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Tinh gọn thanh công cụ Excel Viewer thành nhóm điều hướng và nhóm công cụ xem, giảm các thao tác định dạng không cần thiết trong bản xem trước chỉ đọc.
- Bổ sung Smart Fit deterministic làm fallback cho cả sheet chưa render, sau đó dùng cơ chế auto-resize của Univer để tinh chỉnh khi skeleton đã sẵn sàng.
- Cải thiện thao tác cảm ứng trên bảng tính và bổ sung regression tests cho used range, Smart Fit, shortcut ownership và hành vi chuyển sheet.

#### 🐛 Sửa Lỗi Hệ Thống

- Chặn command select-all gốc của Univer bằng CanceledError để Ctrl+A không thể ghi đè vùng dữ liệu đã chọn.
- Sửa lỗi wrap text và auto height không có hiệu lực ổn định trên các sheet chưa active bằng cách áp kích thước trực tiếp từ display values trước khi refine.
- Sửa regression bật popup 'phạm vi đã được bảo vệ' khi đổi sheet bằng cách hoàn tất toàn bộ thao tác format trước khi thiết lập quyền read-only.

### v26.08.24-b06

#### 🚀 Điểm Nổi Bật Bản Này

- Khắc phục lỗi Excel Viewer tạo được workbook nhưng vùng bảng trắng do canvas có chiều cao 0.
- Khôi phục layout đúng của thanh sheet và vùng bảng bằng cách nạp CSS preset Univer ở phạm vi global.
- Bổ sung regression guard và checklist QA để ngăn lỗi CSS Univer quay trở lại trong các lần phát hành sau.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Chuyển sáu stylesheet preset của Univer vào global styles của Angular để CSS utility áp dụng đầy đủ cho DOM động.
- Bổ sung kiểm thử xác nhận các stylesheet Univer luôn nằm trong angular.json và không bị import lại ở component scope.
- Ghi nhận checklist QA cho Excel Viewer với baseline production, kết quả xác nhận local và tiêu chí đóng defect EXCEL-VIEW-001.

#### 🐛 Sửa Lỗi Hệ Thống

- Sửa lỗi canvas Excel Viewer cao 0px khiến workbook một sheet hoặc nhiều sheet đều không hiển thị dữ liệu.
- Sửa lỗi các tab sheet bị xếp dọc và chiếm toàn bộ chiều rộng do utility flex/grid của Univer không được áp dụng đúng phạm vi.
- Giữ nguyên chế độ chỉ đọc và các công cụ tìm kiếm, đi tới ô, filter, sort, copy và reset sau khi sửa layout.

### v26.08.24-b05

#### 🚀 Điểm Nổi Bật Bản Này

- Ngăn việc chạy lại quy trình phát hành làm tăng thêm số build ngoài ý muốn: cùng một release được đồng bộ nhiều lần vẫn giữ nguyên phiên bản.
- Lịch sử cập nhật nay tự bảo toàn các release đã phát hành và có thể phục hồi release bị rơi từ lịch sử Git.
- Đồng bộ version thống nhất giữa package.json, package-lock.json, Service Worker, giao diện và metadata ứng dụng.

#### ✨ Tính Năng Mới

- Bổ sung cơ chế nhận biết release đã được chuẩn bị hoặc đã đồng bộ để tái sử dụng đúng version hiện tại thay vì tự động tăng build ở mỗi lần chạy.
- Bộ sinh release-history hợp nhất release hiện tại, lịch sử đang có, lịch sử trong HEAD, các snapshot Git trước đó và nguồn dữ liệu lịch sử đã khôi phục.
- Bổ sung release gate cho pre-push và pre-deploy: production chỉ được deploy từ main khi working tree sạch và HEAD đã trùng commit thực tế trên remote.

#### ⚡ Cải Tiến & Tối Ưu

- Validator kiểm tra thêm package-lock.json và chặn trường hợp release-history làm mất một phiên bản đã tồn tại trong HEAD.
- Chuẩn hóa các lệnh release patch/minor/major về cùng pipeline CalVer để tránh một bước thay đổi version riêng trước khi đồng bộ.
- Bổ sung kiểm thử hồi quy cho trường hợp chạy sync nhiều lần, chạy lại sau một lần đồng bộ dở và bảo toàn release cũ qua nhiều nguồn lịch sử.
- Chuẩn hóa chuỗi release:prepare → release:verify → commit → release:prepush → push → release:predeploy → deploy, tránh deploy từ working tree chưa được commit/push.
- Pin Node.js 22 cho môi trường phát hành và bổ sung GitHub Release Gate chạy lại toàn bộ kiểm thử, typecheck và production build trên main/PR.
- Bổ sung runtime gate kiểm tra Node/npm trước verify, pre-push và pre-deploy; CI đọc trực tiếp phiên bản npm từ packageManager để loại bỏ cấu hình version trùng lặp.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục nguyên nhân làm build có thể nhảy b01 → b03 hoặc b02 → b04 khi bước đồng bộ version được gọi hai lần cho cùng một release.
- Khắc phục lỗi release hiện tại trước đó biến mất khỏi changelog sau khi phát hành bản mới vì bộ sinh lịch sử chỉ ghép current release với legacy snapshot.
- Khôi phục release v26.08.24-b02 đã bị mất khỏi public/release-history.json và CHANGELOG.md.
- Loại bỏ thứ tự deploy trước rồi mới commit/push vốn khiến production khó truy vết chính xác về một commit bất biến.

### v26.08.24-b04

#### 🚀 Điểm Nổi Bật Bản Này

- Nhật ký cập nhật ưu tiên đọc dữ liệu phát hành đầy đủ từ release-history.json đi kèm ứng dụng thay vì chỉ phụ thuộc vào Service Worker manifest.
- Tự phát hiện và sửa bản ghi phát hành trực tuyến bị rỗng bằng nội dung chi tiết đã đóng gói trong ứng dụng.
- Màn hình changelog tiếp tục hiển thị nội dung đầy đủ ngay cả khi dữ liệu trực tuyến cũ chỉ còn bản ghi giữ chỗ.

#### ✨ Tính Năng Mới

- Bổ sung cơ chế hợp nhất dữ liệu phát hành theo từng nhóm, lấy nội dung đóng gói làm fallback khi bản ghi trực tuyến thiếu chi tiết.

#### ⚡ Cải Tiến & Tối Ưu

- Khi đồng bộ Firestore, hệ thống giữ lại nội dung hợp lệ đã có và chỉ dùng dữ liệu fallback để bổ sung phần còn thiếu.
- Bổ sung kiểm thử hồi quy cho trường hợp bản ghi trực tuyến rỗng nhưng release-history.json có đầy đủ bốn nhóm nội dung.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục tình trạng changelog hiển thị bốn dòng 'Không có thay đổi trong nhóm này' do bản ghi rỗng trên Firestore lấn át dữ liệu đóng gói.
- Khắc phục việc tự tạo release rỗng khi không đọc được ngsw.json ở môi trường không có Service Worker manifest.

### v26.08.24-b02

#### 🚀 Điểm Nổi Bật Bản Này

- Xem bảng tính Excel trực tiếp trong mục Tài liệu với chế độ chỉ xem an toàn tuyệt đối, ngăn ngừa hoàn toàn nguy cơ vô tình chỉnh sửa biểu mẫu gốc.
- Bổ sung thanh công cụ và phím tắt tiện ích: tìm kiếm nhanh, đi tới ô dữ liệu, lọc và sắp xếp trực quan ngay trên bản xem trước.
- Khắc phục triệt để lỗi trang tính bị trắng khi mở các tập tin có cài đặt bộ lọc, tối ưu hiển thị mượt mà trên cả máy tính và điện thoại.

#### ✨ Tính Năng Mới

- Thanh công cụ xem bảng tính tiện lợi: hỗ trợ tìm kiếm nội dung (Ctrl+F), chọn nhanh vùng dữ liệu (Ctrl+A), đi tới ô hoặc phạm vi chỉ định (Ctrl+G), bật bộ lọc nhanh (Ctrl+Shift+L) và sắp xếp thứ tự dữ liệu.
- Menu thao tác nhanh qua chuột phải hoặc chạm giữ trên màn hình cảm ứng: cho phép sao chép dữ liệu linh hoạt, tra cứu nhanh giá trị ô, xem thông tin chi tiết và điều chỉnh căn lề hiển thị.
- Bảng trạng thái xem trực quan: tự động ghi nhận và hiển thị các bộ lọc, sắp xếp hoặc ẩn hiện hàng cột đang áp dụng trong phiên xem, cho phép đặt lại trạng thái ban đầu bất kỳ lúc nào.

#### ⚡ Cải Tiến & Tối Ưu

- Khóa an toàn chế độ chỉ xem toàn diện: vô hiệu hóa thanh nhập công thức và thao tác gõ nhầm vào ô dữ liệu, kèm thông báo bảo vệ rõ ràng khi thao tác.
- Bảo toàn trọn vẹn bố cục bảng tính: giữ nguyên công thức, ghi chú, liên kết an toàn, màu sắc ô và định dạng ngày giờ chuẩn xác theo biểu mẫu gốc.
- Tối ưu giao diện xem tài liệu trên thiết bị di động: tự động co giãn vừa màn hình, hỗ trợ vuốt cuộn mượt mà và thao tác menu chạm giữ thuận tiện.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục lỗi trang tính hiển thị trắng khi mở các tập tin Excel có thiết lập bộ lọc trên một hàng dữ liệu đơn lẻ.
- Khắc phục lỗi phím Escape đóng toàn bộ cửa sổ xem tài liệu khi đang sử dụng hộp thoại tìm kiếm hoặc điều hướng ô.

### v26.08.23-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Xem trực tiếp bảng tính Excel trong mục Tài liệu với giao diện đầy đủ trang tính, công thức và giữ nguyên định dạng gốc.
- Bảo toàn chính xác định dạng ngày giờ địa phương và bảo vệ nội dung biểu mẫu ở chế độ chỉ đọc an toàn.
- Nâng cao độ ổn định và an toàn phân quyền khi đồng bộ chuẩn hóa mã quản lý nội bộ cho danh mục chất chuẩn lớn.

#### ✨ Tính Năng Mới

- Bổ sung trình xem bảng tính Excel chuyên dụng trong mục Tài liệu, cho phép chuyển đổi qua lại giữa các sheet, tra cứu công thức và tải về file gốc nhanh chóng.

#### ⚡ Cải Tiến & Tối Ưu

- Hiển thị bảng tính chuẩn xác về màu sắc, căn lề ô, phông chữ và kích thước dòng cột tương tự ứng dụng văn phòng quen thuộc.
- Tối ưu tốc độ tải và khả năng hiển thị các bảng dữ liệu kiểm nghiệm và biểu mẫu có cấu trúc nhiều sheet.
- Tăng cường độ an toàn phân quyền và chia nhỏ đợt xử lý khi quản trị viên đồng bộ mã quản lý nội bộ chất chuẩn, tránh quá tải dữ liệu.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục hiện tượng ngày tháng và thời gian trong file Excel hiển thị lệch múi giờ khi mở xem trực tuyến.
- Khắc phục nguy cơ gián đoạn quyền hạn khi đồng bộ nhật ký hoạt động trên tập dữ liệu chất chuẩn có quy mô lớn.

### v26.08.22-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Quá trình đồng bộ mã nội bộ cho danh mục chất chuẩn số lượng lớn diễn ra an toàn, liền mạch và không bị gián đoạn quyền hạn giữa chừng.
- Cửa sổ đồng bộ mã nội bộ hiển thị trạng thái hoàn tất rõ ràng, tự động quét xác minh và làm mới dữ liệu ngay sau khi cập nhật.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Giao diện đồng bộ mã nội bộ phân định rõ giai đoạn cập nhật dữ liệu và giai đoạn quét xác minh, giúp người dùng dễ dàng theo dõi tiến trình thực tế.
- Nếu bước làm mới dữ liệu sau đồng bộ gặp sự cố mạng, hệ thống vẫn giữ kết quả thành công và cho phép nhấn Quét lại để xác nhận.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục lỗi gián đoạn do thiếu quyền khi đồng bộ chuẩn hóa danh mục mã chất chuẩn và các liên kết mã cũ trên tập dữ liệu lớn.
- Khắc phục hiện tượng thanh tiến độ đạt 100% nhưng giao diện chưa phản hồi trạng thái hoàn thành.

### v26.08.20-b03

#### 🚀 Điểm Nổi Bật Bản Này

- Thao tác in và xem trước tài liệu Phiếu giao nhận mẫu trên điện thoại và máy tính bảng diễn ra an toàn và ổn định hơn.
- Tự động tối ưu giao diện hiển thị cho các bảng tính dữ liệu khi xem trên thiết bị di động.

#### ✨ Tính Năng Mới

- Hỗ trợ xem trước mượt mà và đồng bộ các tài liệu giao nhận mẫu từ tệp PDF, bảng tính Excel đến các tệp hình ảnh và văn bản.

#### ⚡ Cải Tiến & Tối Ưu

- Trải nghiệm xem bảng tính trên màn hình nhỏ được tự động mở rộng tối đa vùng dữ liệu quan sát.
- Tính năng tìm kiếm tài liệu hỗ trợ nhận diện tiếng Việt không dấu chuẩn xác, giúp tra cứu nhanh chóng trong các thư mục.
- Sao chép vùng dữ liệu bảng tính đã chọn giữ đúng cấu trúc dòng cột khi dán sang các ứng dụng khác.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục hiện tượng nút In PDF trong menu thao tác trên điện thoại có thể nhấn khi tài liệu chưa tải xong.

### v26.08.20-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Mã số mẫu trong bảng theo dõi hàng ngày luôn giữ đúng thứ tự tăng dần chuẩn xác, giúp tra cứu nhanh chóng.
- Tự động gom gọn phần mô tả cho các mẫu liền kề cùng loại, tránh lặp lại thông tin và giúp bảng theo dõi trực quan hơn.
- Làm nổi bật rõ ràng phần mã số mẫu trên cả màn hình theo dõi và các bản in.

#### ✨ Tính Năng Mới

- Hiển thị danh sách mẫu theo từng đoạn liền kề thông minh trong mục Theo Dõi Mẫu & Kết Quả Ngày, tự động rút gọn dãy mã số liên tiếp cùng mô tả.
- Hỗ trợ định dạng làm đậm riêng cho mã số mẫu để dễ phân biệt với tên mô tả mẫu trong ngoặc đơn trên giao diện và bản in.

#### ⚡ Cải Tiến & Tối Ưu

- Thứ tự sắp xếp mã số mẫu được duy trì chuẩn xác và đồng nhất giữa thẻ theo dõi thu gọn, thẻ mở rộng và phiếu in.
- Bản in dạng danh sách và bản in thu gọn được căn chỉnh gọn gàng, tiết kiệm không gian khi có nhiều mẫu cùng loại.
- Tra cứu và tìm kiếm mẻ phân tích theo từng mã số mẫu hoặc tên mẫu vẫn hoạt động chính xác ngay cả khi mã đã được gom hiển thị rút gọn.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục hiện tượng mã số mẫu bị đổi vị trí khi các mẫu có cùng mô tả nằm xen kẽ nhau trong cùng một mẻ phân tích.
- Khắc phục tình trạng lặp lại mô tả mẫu nhiều lần trên các mẻ có số lượng lớn mẫu cùng loại.

### v26.08.17-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Bổ sung nút chọn nhanh từng đợt giúp người dùng dễ dàng chạy thử nghiệm từng phần nhỏ trước khi đồng bộ toàn bộ.
- Tự động phân chia thông minh các đợt đồng bộ lớn để bảo đảm an toàn tuyệt đối và không gây nghẽn thao tác.
- Hiển thị chi tiết đợt xử lý kế tiếp và tiến độ trực quan trong suốt quá trình thực hiện.

#### ✨ Tính Năng Mới

- Thêm nút Chọn nhanh đợt tiếp theo trong hộp thoại Đồng bộ Mã quản lý nội bộ, tự động chọn đúng số lượng hồ sơ an toàn cho từng lần chạy mà không cần tích chọn thủ công.
- Hiển thị thông tin trực quan về đợt xử lý kế tiếp và số lượng thay đổi hợp lệ tương ứng.

#### ⚡ Cải Tiến & Tối Ưu

- Tối ưu thao tác chạy thử nghiệm trên một vài hồ sơ mẫu trước khi áp dụng trên quy mô lớn.
- Duy trì tính nhất quán tuyệt đối giữa hồ sơ chất chuẩn và sổ ngân hàng mã trong từng đợt chạy.

#### 🐛 Sửa Lỗi Hệ Thống

- Đảm bảo phạm vi chọn đợt xử lý luôn khớp chính xác với kế hoạch phân chia hiển thị trên màn hình.

### v26.08.15-b02

#### 🚀 Điểm Nổi Bật Bản Này

- Tự động phân chia thông minh các đợt đồng bộ lớn để bảo đảm an toàn tuyệt đối và không gây nghẽn thao tác.
- Hiển thị thanh tiến độ thời gian thực giúp theo dõi chính xác từng giai đoạn và số lượng hồ sơ được ghi nhận.
- Bổ sung cơ chế bảo vệ và xử lý gián đoạn rõ ràng, dễ dàng tiếp tục phần còn lại chỉ với một lần bấm.

#### ✨ Tính Năng Mới

- Thêm thanh tiến độ trực quan trong hộp thoại Đồng bộ Mã quản lý nội bộ, hiển thị phần trăm và số lượng hồ sơ đang thực hiện.
- Bổ sung cảnh báo thông minh khi quá trình đồng bộ bị gián đoạn mạng, cho phép kiểm tra ngay các mục đã hoàn tất và quét tiếp phần còn lại.

#### ⚡ Cải Tiến & Tối Ưu

- Gom nhóm chặt chẽ hồ sơ chất chuẩn và ngân hàng mã tương ứng để luôn được cập nhật đồng thời, tránh sai lệch trạng thái.
- Tính toán và hiển thị chính xác số đợt xử lý dự kiến ngay trên màn hình trước khi người dùng bấm xác nhận.
- Chủ động kiểm tra thay đổi đồng thời trên dữ liệu trước từng đợt ghi để ngăn chặn việc ghi đè ngoài ý muốn.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục tình trạng không thể thực hiện đồng bộ khi số lượng thay đổi vượt quá giới hạn an toàn.
- Đảm bảo thông tin tóm tắt và số lượng đợt đồng bộ luôn hiển thị chuẩn xác và khớp với kết quả thực tế.

### v26.08.15-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Cung cấp công cụ Quét và Đối chiếu Mã quản lý nội bộ trên toàn bộ hồ sơ chất chuẩn, nhật ký sử dụng và yêu cầu mua sắm.
- Xem trước bảng tổng kết thay đổi chi tiết, phát hiện và ngăn chặn trùng lặp mã trước khi áp dụng.
- Theo dõi lịch sử từng đợt đồng bộ và xuất báo cáo đối chiếu phục vụ lưu trữ, kiểm toán phòng thí nghiệm.

#### ✨ Tính Năng Mới

- Thêm công cụ Đồng bộ Mã quản lý nội bộ trong mục Quản lý chất chuẩn, giúp rà soát và chuẩn hóa mã chất chuẩn A, B, C một cách nhanh chóng và an toàn.
- Bổ sung tính năng Xem lịch sử đồng bộ với chi tiết từng đợt thay đổi và hỗ trợ Xuất báo cáo đối chiếu ra tệp CSV, JSON.

#### ⚡ Cải Tiến & Tối Ưu

- Hộp thoại xác nhận thao tác được bố trí nổi bật, hiển thị đầy đủ tổng quan thay đổi và các lưu ý an toàn trước khi thực hiện.
- Kiểm tra và báo lỗi tức thì khi nhập mã thủ công nếu mã bị trùng lặp, sai quy ước hoặc đang thuộc về chất chuẩn khác.
- Thanh lọc danh mục và nút chuyển góc nhìn làm việc phản hồi nhanh, hỗ trợ đầy đủ thao tác bằng bàn phím.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục hiện tượng hộp thoại xác nhận bị hiển thị phía sau các cửa sổ tác vụ lớn.
- Đảm bảo nhật ký sử dụng và yêu cầu mua sắm luôn được liên kết chính xác với mã quản lý nội bộ sau khi đồng bộ.

### v26.08.14-b02

#### 🚀 Điểm Nổi Bật Bản Này

- Chuẩn hóa giao diện trên toàn bộ các màn hình Chất chuẩn, Cấu hình, phương pháp, Mẻ phân tích và Kết quả, đảm bảo hiển thị đồng nhất và rõ ràng ở cả chế độ sáng lẫn tối.
- Thao tác mở và làm việc với các cửa sổ tác vụ, biểu mẫu nhập liệu và thanh công cụ tìm kiếm diễn ra mượt mà và trực quan hơn.
- Tự động xử lý trạng thái cập nhật trang, giúp hệ thống luôn hoạt động ổn định và liền mạch trên mọi thiết bị.

#### ✨ Tính Năng Mới

- Bổ sung màn hình xem nhanh Chính sách bảo mật và Điều khoản sử dụng trực tiếp trên giao diện ứng dụng.
- Tối ưu hóa giao diện Đăng nhập bằng mã QR trên điện thoại di động, tăng độ tương phản và hiển thị trạng thái quét rõ ràng hơn.

#### ⚡ Cải Tiến & Tối Ưu

- Đồng bộ nút bấm, tiêu đề và thanh công cụ trên các màn hình Quản lý chất chuẩn, Quản lý thiết bị, Quản lý nền mẫu và Nhật ký công việc hằng ngày.
- Các cửa sổ tác vụ như duyệt yêu cầu mua sắm chất chuẩn, gán chất chuẩn, in nhãn và nhập dữ liệu mở nhanh hơn và bố cục thông tin dễ theo dõi hơn.
- Hỗ trợ điều hướng bằng phím Tab và phím Escape nhất quán trên tất cả các cửa sổ tác vụ trong hệ thống.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục hiện tượng một số trình duyệt tự tải lại trang liên tục khi nhận bản cập nhật mới.
- Sửa lỗi hiển thị màu sắc và biểu tượng nút đóng trên các danh mục thuộc phần Cấu hình.
- Đảm bảo số liệu thống kê hằng tháng luôn được cập nhật chính xác và an toàn khi có nhiều người cùng thao tác.

### v26.08.14-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Chuẩn hóa các primitive UI dùng chung cho page header, toolbar, button, empty state và modal shell; các module đã chạm giữ nguyên semantics nghiệp vụ.
- Tiếp tục hoàn thiện SmartBatch Step 2 theo workspace nhiều nhóm, wizard hai bước và action dock responsive dùng cùng contract UI.
- Giới hạn service-worker recovery còn một lần cho mỗi phiên bản trong mỗi tab để tránh vòng lặp auto-reload.

#### ✨ Tính Năng Mới

- Bổ sung route demo dev-only và contract tests cho primitive UI, guardrail token/icon/overlay, cùng checklist quy ước để người tiếp nhận tiếp tục migration theo module.
- Bổ sung regression cho Dashboard, Inventory, Standards, Results, Recipes, Preparation và Targets; các control chuyên biệt vẫn giữ native khi cần bảo toàn semantics.
- Tăng độ chịu lỗi của monthly stats bằng atomic increment cho đường tăng và giữ transaction clamp cho đường giảm, kèm Rules emulator coverage.

#### ⚡ Cải Tiến & Tối Ưu

- Các module Dashboard, Inventory, Standards, Results, Preparation, Batch/SmartBatch và Targets đã bắt đầu dùng primitive chung; không đánh dấu module chưa có runtime/visual evidence.
- Nối UI guardrail và service-worker recovery vào test suite chính, đồng thời khóa số overlay legacy bằng baseline để ngăn phát sinh mới ngoài modal shell.
- Giữ release/deploy boundary rõ ràng: test local/emulator không thay thế authenticated UI, hệ thống Rules môi trường thực tế hoặc business acceptance.

#### 🐛 Sửa Lỗi Hệ Thống

- Sửa nguy cơ service worker tự reload lặp vô hạn khi phát UNRECOVERABLE_STATE và dừng an toàn khi sessionStorage không khả dụng.
- Loại bỏ shade Tailwind không tồn tại và alias fa-times trong vùng source đã rà; giữ nguyên các overlay legacy đã được baseline.
- Bổ sung regression test cho UI migration, parser/matrix/JobBlock handoff SmartBatch và concurrent monthly-stats writers.

### v26.08.13-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Step 2 được tổ chức thành một workspace duy nhất, cho phép khai báo nhiều nhóm mẻ trên cùng một trang.
- Mỗi nhóm mẻ có wizard hai bước để lần lượt hoàn thiện mã mẫu, nền mẫu, mô tả, chỉ tiêu và phương pháp.
- SmartBatch tiếp tục tự quyết định gom hoặc tách batch vật lý sau khi các nhóm đã đủ thông tin.

#### ✨ Tính Năng Mới

- Hỗ trợ nhập mã mẫu theo dạng mã[TAB]mô tả và hiển thị ngay mô tả của từng mã để kiểm tra.
- Một bộ chỉ tiêu được áp dụng thống nhất cho toàn bộ mẫu trong cùng nhóm mẻ.
- Có tối đa năm phương pháp gợi ý; người dùng chỉ cần click trực tiếp vào thẻ phương pháp đủ điều kiện để chỉ định.

#### ⚡ Cải Tiến & Tối Ưu

- Gộp vùng phương pháp hiện tại thành một select duy nhất, đồng thời giữ lựa chọn tự phân phối và phương pháp thủ công.
- Tách rõ trạng thái hover và trạng thái phương pháp đã chọn bằng viền, ring, shadow và nhãn Đang chọn.
- Nút Chạy SmartBatch optimizer tự động được bật khi toàn bộ nhóm hoàn tất, không cần bước Hoàn tất nhóm mẻ trung gian.

#### 🐛 Sửa Lỗi Hệ Thống

- Bổ sung kiểm tra phương pháp chỉ định phải phủ đủ toàn bộ chỉ tiêu và tương thích với nền mẫu của nhóm.
- Giữ nguyên semantics hiện tại: nhóm chỉ đại diện cho cùng bộ chỉ tiêu; optimizer mới quyết định batch vật lý.
- Bổ sung regression test cho parser mã mẫu, ma trận mẫu–chỉ tiêu, handoff JobBlock và giao diện wizard Step 2.

### v26.08.11-b04

#### 🚀 Điểm Nổi Bật Bản Này

- Màn hình Chuẩn bị dung dịch dùng tên gọi gần với thao tác kiểm nghiệm và hướng dẫn rõ hơn ở từng bước.
- Nhật ký cập nhật có dữ liệu hiển thị ngay trên Dashboard, hộp thoại và cổng thông tin kể cả khi lịch sử trực tuyến chưa sẵn sàng.
- Tên nguồn, đơn vị và kết quả được trình bày nhất quán hơn để giảm nhầm lẫn khi lập dãy chuẩn hoặc pha dung dịch.

#### ✨ Tính Năng Mới

- Các nhóm đơn vị tương đương như g/L–mg/mL, mg/L–µg/mL và ng/L được nhắc ngay tại lựa chọn để người thực hiện giữ đúng cơ sở của phương pháp.
- Tên nguồn do người thực hiện nhập được dùng xuyên suốt trong danh sách, hướng dẫn, kết quả và phiếu sao chép; mã kỹ thuật chỉ hiện khi cần đối chiếu.
- Nhật ký cập nhật có sẵn lịch sử phát hành để xem từ màn hình đăng nhập, Dashboard, hộp thoại và trang toàn bộ lịch sử.

#### ⚡ Cải Tiến & Tối Ưu

- Các panel nhập liệu và kết quả trong Chuẩn bị dung dịch được cân đối chiều cao, giúp theo dõi Bước 2 và Bước 3–4 liền mạch hơn.
- Nội dung hướng dẫn, kết quả sao chép và tiêu đề in dùng cùng tên tác vụ, giúp giảm khoảng cách giữa màn hình và phiếu thao tác.
- Hộp thoại Nhật ký cập nhật vẫn ưu tiên dữ liệu mới nhất và tự sắp xếp lịch sử theo phiên bản.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục trường hợp Dashboard và hộp thoại Nhật ký cập nhật hiển thị trống khi dữ liệu phát hành trực tuyến chưa có bản ghi.
- Khắc phục trang Nhật ký cập nhật công khai không hiển thị nội dung trước khi người dùng đăng nhập.
- Khắc phục nhãn nguồn hiển thị mã kỹ thuật thay vì tên nguồn do người thực hiện khai báo trong một số kết quả pha dãy chuẩn.

### v26.08.11-b03

#### 🚀 Điểm Nổi Bật Bản Này

- KNV có thể tính pha theo các tác vụ quen thuộc, với đơn vị thao tác ưu tiên µL (uL), mL, mg và g.
- Các trường ppm, ppb và ppt tự chọn cơ sở phù hợp cho dung dịch hoặc mẫu rắn, giảm thao tác đổi đơn vị.
- Màn hình rà soát Mã quản lý nội bộ dễ xử lý hơn nhờ bộ lọc, tìm kiếm và hướng dẫn rõ cho từng cảnh báo.

#### ✨ Tính Năng Mới

- Trạm Pha Chế hỗ trợ nhanh ppm (mg/L hoặc mg/kg), ppb (µg/L hoặc µg/kg) và ppt (ng/L hoặc ng/kg) theo bối cảnh mẫu.
- Khi đổi nền mẫu hoặc loại nguồn, các lựa chọn lượng cân/hút và thể tích tự chuyển về đơn vị thao tác phù hợp.
- Màn hình đồng bộ Mã quản lý nội bộ có thể lọc theo nhóm cảnh báo, tìm theo hồ sơ hoặc nội dung xử lý và nhập mã SDHET cho nghiệp vụ riêng.
- Các cảnh báo về mã chuẩn hiển thị thêm chi tiết vấn đề và gợi ý bước xử lý để người quản lý đối chiếu hồ sơ vật lý.

#### ⚡ Cải Tiến & Tối Ưu

- Phiếu tính hiển thị lượng thao tác theo µL, mL, mg hoặc g thay vì tự đổi sang L hoặc kg.
- Giao diện Trạm Pha Chế tập trung vào công việc cần làm, không hiển thị các mô tả kỹ thuật về phạm vi hoặc giao dịch.
- Các quy tắc mã chuẩn và mã SDHET được kiểm tra đồng nhất giữa biểu mẫu, import và luồng rà soát, giúp hạn chế nhầm hồ sơ.

#### 🐛 Sửa Lỗi Hệ Thống

- Không còn báo mã SDHET là sai định dạng trong biểu mẫu, import hoặc kiểm tra vòng đời.
- Không còn để bộ chọn đơn vị bị rỗng khi KNV chuyển giữa thao tác theo khối lượng và theo thể tích.
- Bổ sung kiểm tra hồi quy cho đơn vị ppm/ppb/ppt, đơn vị thao tác và các nhóm cảnh báo mã chuẩn.

### v26.08.11-b02

#### 🚀 Điểm Nổi Bật Bản Này

- Trạm Pha Chế được tổ chức theo năm câu hỏi công việc của kiểm nghiệm viên: tính nồng độ, tính lượng cần lấy, thêm chuẩn, lập dãy chuẩn/QC và quy đổi kết quả xử lý mẫu.
- Các phép tính hỗ trợ mẫu rắn, mẫu lỏng, nhiều chuẩn trung gian, nội chuẩn/surrogate và chuỗi xử lý mẫu; mọi thông tin nguồn đều do kiểm nghiệm viên nhập trong bản nháp cục bộ.
- Luồng Chất chuẩn tiếp tục giữ mã quản lý nội bộ theo đúng hồ sơ vật lý và không lặp lại quét đồng bộ khi danh sách đã được xử lý.

#### ✨ Tính Năng Mới

- Trạm Pha Chế hiển thị công thức, phép thế số, kết quả trung gian, hướng dẫn thao tác và cảnh báo cho năm nhóm tác vụ; có thể thêm/xóa dòng, dán bảng điểm, sao chép, in và xuất phiếu tính cục bộ.
- Calculation engine phân biệt rõ planned/actual quantity, cơ sở nồng độ, cây dung dịch nguồn, nguồn riêng từng điểm, nội chuẩn/surrogate theo phạm vi và các stage extract, aliquot, cô, hoàn nguyên, pha loãng hoặc chuyển toàn lượng.
- Bộ chọn pipet và bình định mức dùng danh mục thao tác đã xác nhận, đồng thời cảnh báo thể tích/khối lượng ngoài khả năng thay vì âm thầm làm tròn hoặc suy đoán thông số.

#### ⚡ Cải Tiến & Tối Ưu

- Giao diện Trạm Pha Chế chuyển từ sáu mode kỹ thuật sang tác vụ nghiệp vụ, hiển thị đúng trường theo bối cảnh và giữ toàn bộ thay đổi trong draft của trình duyệt.
- Engine giữ giá trị canonical để tính toán và chỉ làm tròn ở lớp trình bày; thiếu MW hoặc density thì yêu cầu bổ sung, không tự tạo quy đổi hóa học.
- Bộ kiểm thử prep được tích hợp vào npm test để bao phủ calculation engine và boundary không đọc/ghi Kho hoặc Chất chuẩn.

#### 🐛 Sửa Lỗi Hệ Thống

- Loại bỏ luồng workflow hạn dùng hóa chất không còn được sử dụng.
- Ngăn vòng quét lại trong Đồng bộ Mã quản lý nội bộ và bổ sung regression cho trạng thái đã xử lý.
- Giữ Trạm Pha Chế ở ranh giới mô phỏng: không đọc tồn kho, không ghi hệ thống, không tạo giao dịch hoặc audit log nghiệp vụ.

### v26.08.11-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Trạm Pha Chế nay là trợ lý mô phỏng độc lập, giúp KNV tính nhanh các công thức pha mà không liên kết hoặc làm thay đổi Kho và Chất chuẩn.
- Chất chuẩn có Mã quản lý nội bộ thống nhất, giúp nhận đúng từng lọ vật lý và giữ nguyên lịch sử khi mã được trả và cấp lại.
- Các màn hình Lịch sử, Kết quả và Thống kê tải theo khoảng ngày đang xem, giúp mở trang nhanh hơn và dễ theo dõi dữ liệu liên quan.

#### ✨ Tính Năng Mới

- Trong Trạm Pha Chế, chọn Pha dung dịch, Pha loãng, Thêm chuẩn, Dãy chuẩn, Pha hỗn hợp hoặc Xử lý mẫu để nhận công thức, kết quả trung gian, cảnh báo và phiếu mô phỏng có thể sao chép, in hoặc tải xuống.
- Trong Chất chuẩn, nhập Mã quản lý nội bộ 4 ký tự, trả mã về ngân hàng kèm lý do, và dùng Đồng bộ Mã quản lý nội bộ để xem trước các chỉnh sửa an toàn trước khi áp dụng.
- Phiếu mượn, nhật ký sử dụng và nhãn hiển thị Mã quản lý nội bộ gắn với đúng hồ sơ vật lý.

#### ⚡ Cải Tiến & Tối Ưu

- Form nhập và nhập Excel chuẩn hóa khoảng trắng/chữ hoa và kiểm tra trùng mã trước khi ghi, tránh làm thay đổi nhầm hồ sơ đang dùng.
- Trạm Pha Chế hiển thị rõ đơn vị chuẩn hóa, công thức, kết quả trung gian và cảnh báo khi thiếu hoặc sai dữ liệu; không tự đoán quy đổi giữa khối lượng và thể tích.
- Khi chưa chọn khoảng ngày, các màn hình lịch sử nêu rõ đang hiển thị 300 mẻ gần nhất; chọn khoảng ngày để tải đúng dữ liệu cần tra cứu.

#### 🐛 Sửa Lỗi Hệ Thống

- Ngăn việc sửa hoặc cấp trùng Mã quản lý nội bộ đang thuộc một chuẩn vật lý khác.
- Giữ độc lập hồ sơ, tồn kho, yêu cầu mượn và nhật ký của chuẩn cũ khi mã được cấp lại cho chuẩn mới.
- Loại bỏ các nút và luồng khiến Trạm Pha Chế bị hiểu là thao tác trừ Kho; các phép tính mô phỏng không tạo giao dịch nghiệp vụ.

### v26.08.10-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Luồng báo cáo GAS được chuẩn hóa theo requestId, kiểm soát quyền truy cập, chống lặp và xác thực upload trước khi xử lý.
- Đồng bộ 51 chỉ tiêu nhóm I giữa GAS và Angular, bao gồm silafluofen, với regression kiểm tra parity canonical cho các phương pháp Type 3B.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Giữ nguyên các trạng thái dữ liệu phân biệt như 0, ND, N/A, chuỗi rỗng và missing trong dữ liệu gửi đi báo cáo.
- Bổ sung kiểm tra route, template, cột kết quả và mapping analyte giữa caller Angular với cấu hình GAS.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục các đường gọi báo cáo GAS chưa có xác thực/ủy quyền, xử lý lặp và kiểm soát archive/template/upload đầy đủ.
- Đồng bộ cấu hình nhom-i sau xác nhận nghiệp vụ; giữ silafluofen trong GAS và bổ sung vào contract Angular.

### v26.08.08-b05

#### 🚀 Điểm Nổi Bật Bản Này

- Quy trình nhập và xuất kết quả phương pháp 9.14 được kiểm tra chặt chẽ hơn cho cả Form Đầy Đủ và Form Rút Gọn, giúp hạn chế xuất báo cáo khi dữ liệu còn thiếu hoặc không hợp lệ.
- Form Rút Gọn chỉ đưa đúng các mẫu đang được chọn và đúng nhóm mẫu hiện tại vào báo cáo PDF.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Đồng bộ trạng thái phát hiện/không phát hiện và các đánh giá QC của phương pháp 9.14 với dữ liệu thực tế sau mỗi lần chỉnh sửa kết quả.
- Chuẩn hóa số lọ mặc định và thông tin mẫu biểu để Form Đầy Đủ và Form Rút Gọn luôn sử dụng đúng cấu hình báo cáo.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục lỗi kiểm tra trước khi xuất báo cáo Form Rút Gọn dùng sai cấu trúc kết quả và sai phạm vi chỉ tiêu được giao.
- Ngăn xuất báo cáo phương pháp 9.14 khi còn thiếu chỉ tiêu được giao hoặc khi kết quả chứa giá trị ngoài các định dạng hợp lệ như số, ND/KPH hoặc <LOQ>.

### v26.08.08-b04

#### 🚀 Điểm Nổi Bật Bản Này

- Hệ thống quản lý Kho và Chất chuẩn được thắt chặt quy trình mượn, trả và ghi nhận tiêu hao, đảm bảo lượng tồn kho luôn khớp hoàn toàn với lịch sử sử dụng thực tế.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Nâng cấp độ an toàn khi ghi nhận lượng tiêu hao chất chuẩn. Mọi thay đổi về tồn kho đều được hệ thống tự động đối chiếu và lưu vết chặt chẽ, ngăn chặn các sai sót khi thao tác.

#### 🐛 Sửa Lỗi Hệ Thống

- Ngăn chặn triệt để các trường hợp thông tin lượng tiêu hao hoặc lịch sử sử dụng chất chuẩn bị cập nhật sai lệch, giúp đảm bảo số liệu Kho luôn chính xác tuyệt đối.

### v26.08.08-b03

#### 🚀 Điểm Nổi Bật Bản Này

- Hệ thống bảo mật được thắt chặt: chỉ các nhân sự có thẩm quyền mới được thao tác trên Kết quả, Mẻ phân tích và phương pháp, đảm bảo an toàn dữ liệu tuyệt đối.
- Tính năng tạo mẻ (SmartBatch) nhận diện chỉ tiêu thông minh và chính xác hơn, tự động đối chiếu các chỉ tiêu cũ bị lệch tên gọi hoặc mã.
- Sửa lỗi tự động điền sai nền mẫu mặc định khi tạo nhóm mẫu mới, giúp kiểm nghiệm viên chủ động phân loại mẫu ngay từ đầu.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Giao diện Cấu hình được làm gọn gàng hơn, ẩn bớt các thông tin kỹ thuật không cần thiết đối với người sử dụng.
- Lịch sử hệ thống ghi nhận thời gian chuẩn xác hơn bằng đồng hồ máy chủ, loại bỏ tình trạng lỗi do sai lệch múi giờ trên thiết bị cá nhân.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục lỗi hệ thống không nhận diện được chỉ tiêu trong các Mẻ phân tích cũ, giúp các chức năng gợi ý phương pháp và kiểm tra độ phủ hoạt động trơn tru.
- Khắc phục triệt để lỗi từ chối quyền truy cập (Permission Denied) thỉnh thoảng xảy ra khi người dùng gộp các mẻ phân tích thành Mẻ tổng hợp.

### v26.08.08-b02

#### 🚀 Điểm Nổi Bật Bản Này

- Thanh điều hướng trên điện thoại hiển thị chính xác các chức năng theo quyền hạn thực tế và có thêm thông báo số lượng trên nút 'Quản Lý Yêu Cầu'.
- Giao diện và các cửa sổ thông tin tự động căn chỉnh vừa vặn với màn hình điện thoại, không còn bị che khuất bởi cạnh dưới màn hình.
- Lịch sử thao tác tự động bỏ qua các trang không hợp lệ, giúp người dùng luôn trở về đúng nơi an toàn khi sử dụng.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Gợi ý cài đặt ứng dụng vào điện thoại tự động ẩn đi sau khi người dùng đã cài đặt thành công, giảm thiểu các thông báo không cần thiết.
- Người dùng giờ đây có thể tự do phóng to nội dung trên thiết bị di động bằng thao tác vuốt hai ngón tay để dễ dàng xem các chữ nhỏ.
- Lịch sử 'Xem gần đây' tự động loại bỏ các lối tắt dẫn tới chức năng ngoài phân quyền, nâng cao độ an toàn và tránh gây nhầm lẫn.
- Cải thiện khả năng hỗ trợ các công cụ đọc màn hình, giúp thông báo rõ ràng hơn về tình trạng các cửa sổ bật lên và các nút biểu tượng.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục hiện tượng giao diện điện thoại hiển thị thanh menu không đồng bộ theo quyền hạn và loại bỏ các cửa sổ tự cuộn bị sai kích thước.

### v26.08.08-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Hỗ trợ xem toàn bộ dữ liệu thống kê từ trước đến nay trên Bảng điều khiển thay vì bị giới hạn trong 90 ngày.
- Các biểu đồ và thẻ KPI hiển thị số liệu thống nhất và chính xác hơn, không còn bị thiếu dữ liệu của ngày cuối cùng.
- Danh sách 'Hoạt động hôm nay' tự động làm mới khi qua ngày mới mà không cần tải lại trang.

#### ✨ Tính Năng Mới

- Bổ sung khả năng xem báo cáo và dữ liệu thống kê không giới hạn thời gian (chế độ Tất cả thời gian).

#### ⚡ Cải Tiến & Tối Ưu

- Hệ thống tự động điều chỉnh lại cho đúng nếu người dùng vô tình chọn ngày bắt đầu sau ngày kết thúc trên bộ lọc thời gian.
- Hỗ trợ thao tác bằng bàn phím (phím Tab, Enter, Space) tiện lợi hơn khi tương tác với các thẻ KPI.
- Nâng cao độ an toàn và tốc độ tải trang bằng cách tối ưu hóa quá trình xử lý quyền hạn của người dùng.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục lỗi biểu đồ và số liệu thống kê tính sai khoảng ngày, đảm bảo dữ liệu của ngày cuối cùng luôn được bao gồm đầy đủ.

### v26.08.07-b06

#### 🚀 Điểm Nổi Bật Bản Này

- Tìm kiếm phương pháp phân tích dễ dàng hơn: hỗ trợ gõ không dấu, tìm theo mã, tên hoặc mô tả.
- Lọc nhanh phương pháp theo nhóm Kỹ thuật (thiết bị) để không phải lướt qua danh sách dài.
- Giao diện bộ lọc gọn gàng hơn, tăng không gian hiển thị danh sách Chất chuẩn trên màn hình.

#### ✨ Tính Năng Mới

- Bộ lọc phương pháp mới cho phép tìm kiếm trực tiếp bằng văn bản (có hoặc không dấu).
- Bổ sung khả năng thu hẹp danh mục phương pháp dựa trên nhóm Kỹ thuật.

#### ⚡ Cải Tiến & Tối Ưu

- Loại bỏ tình trạng chọn sai tổ hợp Phương pháp và Kỹ thuật không tương thích, giúp hiển thị kết quả chính xác hơn.
- Thu gọn khu vực bộ lọc khi chưa cần tìm kiếm chi tiết để tiết kiệm không gian màn hình.

#### 🐛 Sửa Lỗi Hệ Thống

- Sửa lỗi bộ lọc 'Kỹ thuật / nhóm phương pháp' hiển thị sai số lượng, giúp nhóm các phương pháp lại chính xác hơn (ví dụ LC-MS/MS, GC-MS/MS) để dễ dàng thu hẹp kết quả.

### v26.08.07-b05

#### 🚀 Điểm Nổi Bật Bản Này

- Tìm kiếm phương pháp phân tích dễ dàng hơn: hỗ trợ gõ không dấu, tìm theo mã, tên hoặc mô tả.
- Lọc nhanh phương pháp theo nhóm Kỹ thuật (thiết bị) để không phải lướt qua danh sách dài.
- Giao diện bộ lọc gọn gàng hơn, tăng không gian hiển thị danh sách Chất chuẩn trên màn hình.

#### ✨ Tính Năng Mới

- Bộ lọc phương pháp mới cho phép tìm kiếm trực tiếp bằng văn bản (có hoặc không dấu).
- Bổ sung khả năng thu hẹp danh mục phương pháp dựa trên nhóm Kỹ thuật.

#### ⚡ Cải Tiến & Tối Ưu

- Loại bỏ tình trạng chọn sai tổ hợp Phương pháp và Kỹ thuật không tương thích, giúp hiển thị kết quả chính xác hơn.
- Thu gọn khu vực bộ lọc khi chưa cần tìm kiếm chi tiết để tiết kiệm không gian màn hình.

#### 🐛 Sửa Lỗi Hệ Thống

- Không có thay đổi trong nhóm này.

### v26.08.07-b04

#### 🚀 Điểm Nổi Bật Bản Này

- Đảm bảo thao tác lưu Kết quả và duyệt Mẻ phân tích luôn diễn ra nhanh chóng, an toàn, không bị ảnh hưởng bởi quá trình đồng bộ Danh sách công việc.
- Danh sách công việc hàng ngày luôn hiển thị chính xác kể cả trong những ngày không có dữ liệu mới.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Tối ưu hóa quá trình đồng bộ Danh sách công việc ngầm, tách biệt hoàn toàn khỏi thao tác duyệt để tăng độ tin cậy và tốc độ xử lý.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục sự cố gián đoạn khi duyệt hàng loạt Mẻ phân tích hoặc khi lưu Kết quả.
- Sửa lỗi không hiển thị đúng thông tin Danh sách công việc ở một số ngày nhất định.

### v26.08.07-b03

#### 🚀 Điểm Nổi Bật Bản Này

- Danh sách kiểm tra công việc hàng ngày (Daily Checklist) tự động cập nhật ngay khi bạn thay đổi trạng thái hoặc lưu kết quả của mẻ phân tích.
- Thanh chuyển trang tính trong trình xem Excel trên điện thoại rộng rãi hơn, hỗ trợ cuộn ngang và không bị che khuất ở mép dưới màn hình.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Giao diện ứng dụng hỗ trợ hiển thị tràn viền mượt mà hơn trên các thiết bị di động đời mới.
- Danh sách công việc hàng ngày đồng bộ ổn định và chính xác hơn với các mẻ phân tích ngay trong cùng một thao tác lưu dữ liệu.

#### 🐛 Sửa Lỗi Hệ Thống

- Không có thay đổi trong nhóm này.

### v26.08.07-b02

#### 🚀 Điểm Nổi Bật Bản Này

- Không có thay đổi trong nhóm này.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Tự động điều chỉnh khoảng cách, kích thước chữ và ô tìm kiếm của Nhật Ký Cập Nhật để hiển thị rõ ràng hơn trên các cỡ màn hình khác nhau.
- Các cửa sổ chức năng và lớp phủ mở lên mượt mà và hoạt động ổn định hơn sau khi chuyển trang.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục lỗi màn hình xem tài liệu bị thanh điều hướng và menu che mất một phần nội dung.
- Sửa lỗi biểu tượng và đường thời gian trong Nhật Ký Cập Nhật không thẳng hàng với nội dung.
- Khắc phục sự cố khiến hệ thống không thể tự động phát hành phiên bản mới.

### v26.08.06-b04

#### 🚀 Điểm Nổi Bật Bản Này

- Cửa sổ xem trước PDF và Excel trong Phiếu Giao Nhận Mẫu phủ trọn màn hình, không còn bị Header hoặc Sidebar che nội dung.
- Nhật Ký Cập Nhật được căn lại theo một trục thời gian liên tục, dễ đọc hơn trên máy tính và điện thoại.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Tối ưu khoảng cách, kích thước tiêu đề, ô tìm kiếm và thẻ nội dung của Nhật Ký Cập Nhật theo từng kích thước màn hình.
- Loại bỏ trạng thái stacking context tồn tại sau hiệu ứng chuyển trang để các lớp phủ trong ứng dụng hoạt động nhất quán hơn.

#### 🐛 Sửa Lỗi Hệ Thống

- Nâng lớp chứa trình xem PDF/Excel lên trên AppHeaderComponent, Sidebar và thanh điều hướng khi tài liệu đang mở.
- Sửa dấu mốc và đường timeline trong trang lẫn modal Nhật Ký Cập Nhật bị lệch so với nội dung.
- Sửa release-notes.json bị thiếu dấu đóng chuỗi, vốn làm bước kiểm tra release và build bị lỗi.

### v26.08.06-b03

#### 🚀 Điểm Nổi Bật Bản Này

- Tên phương pháp và nhãn được hiển thị rõ ràng, đầy đủ và đồng bộ hơn trên toàn hệ thống.
- Chỉ hiển thị các mã phương pháp hóa học đã được duyệt; loại bỏ các nhóm hoặc chỉ tiêu không phù hợp khỏi bộ chọn.

#### ✨ Tính Năng Mới

- Mỗi mã phương pháp có mô tả tiếng Việt rõ ràng trong danh mục, bộ lọc và xuất file.
- Hệ thống cho phép gắn và lưu nhiều nhãn phương pháp cùng lúc cho một chất chuẩn hoặc báo cáo.

#### ⚡ Cải Tiến & Tối Ưu

- Thẻ nhãn đã chọn và bộ lọc hiển thị gọn hơn bằng cách kết hợp mã phương pháp và kỹ thuật phân tích, thay vì hiển thị tên quá dài.
- Vẫn có thể xem tên phép thử đầy đủ bằng cách rê chuột vào thẻ hoặc bộ lọc.
- Thẻ nhãn được tối ưu hiển thị trên màn hình nhỏ, tự động xuống dòng và không làm tràn khu vực nhập liệu.

#### 🐛 Sửa Lỗi Hệ Thống

- Đảm bảo cửa sổ xem trước tài liệu luôn hiển thị nổi lên toàn màn hình, không bị các thanh công cụ che khuất.
- Loại bỏ các thiết bị bị trùng lặp khi tạo nhãn rút gọn và sử dụng cơ chế an toàn để dự phòng.
- Bổ sung các bước kiểm tra tự động để đảm bảo nhãn luôn hiển thị ngắn gọn nhưng giữ đúng mã thiết bị.

### v26.08.06-b02

#### 🚀 Điểm Nổi Bật Bản Này

- Hệ thống tải dữ liệu mượt mà và nhanh hơn đáng kể khi mở Kho, tra cứu Lịch sử và xem Báo cáo.
- Màn hình Yêu cầu chất chuẩn được làm gọn, giúp thao tác chọn và gửi yêu cầu dễ nhìn và nhanh hơn.
- Bổ sung danh mục 119 phương pháp hóa học với tên phép thử tiếng Việt rõ ràng, được sắp xếp thông minh giúp tra cứu dễ dàng.

#### ✨ Tính Năng Mới

- Cho phép chọn và gắn nhiều phương pháp hóa học cùng lúc khi báo trả Kết quả hoặc quản lý Chất chuẩn.
- Hiển thị tên phép thử tiếng Việt đi kèm mã phương pháp trên các danh sách, bộ lọc và khi xuất dữ liệu ra Excel.
- Trình xem tài liệu PDF được nâng cấp, hoạt động ổn định trên nhiều thiết bị và tương thích tốt với chế độ ứng dụng điện thoại.

#### ⚡ Cải Tiến & Tối Ưu

- Bảng tin tự động tải dữ liệu nhanh hơn và chính xác theo quyền hạn của từng người dùng.
- Danh sách các phương pháp hóa học tự động sắp xếp theo thứ tự số tự nhiên (ví dụ H-1.2 đứng trước H-1.10), giúp tìm kiếm bằng mắt thuận tiện hơn.
- Giao diện màn hình Yêu cầu chất chuẩn được tinh chỉnh, giảm bớt các thao tác không cần thiết.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục tình trạng hiển thị lệch giao diện hoặc giật lag khi mở xem các tài liệu phương pháp.
- Xử lý dứt điểm hiện tượng tải trang chậm hoặc bị treo khi người dùng tra cứu lịch sử hoạt động cá nhân.

### v26.08.06-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Bổ sung 119 phương pháp hóa học mới: chỉ hiển thị các mã đã được duyệt, loại bỏ mục không hợp lệ khỏi bộ chọn.
- Gắn mô tả tiếng Việt chi tiết cho từng mã trong danh mục, bộ lọc và khi xuất báo cáo.

#### ✨ Tính Năng Mới

- Cho phép một chất chuẩn và một báo cáo được gắn cùng lúc nhiều phương pháp.

#### ⚡ Cải Tiến & Tối Ưu

- Sắp xếp các mã phương pháp theo thứ tự tự nhiên (ví dụ: H-1.2, H-1.3, H-1.10) để dễ tra cứu.
- Hỗ trợ danh mục tĩnh dự phòng để hiển thị phương pháp trước khi người quản trị cập nhật dữ liệu chính thức.
- Giữ lại dữ liệu phương pháp cũ để đọc, nhưng chỉ cho phép gắn mới phương pháp hóa học.

#### 🐛 Sửa Lỗi Hệ Thống

- Tăng cường kiểm tra và bảo mật tên phương pháp trên hệ thống để đảm bảo tính toàn vẹn dữ liệu.
- Bổ sung tự động kiểm tra cho toàn bộ mã phương pháp, tính năng sắp xếp và lựa chọn nhiều nhãn.

### v26.08.05-b03

#### 🚀 Điểm Nổi Bật Bản Này

- Bổ sung 119 mã phương pháp từ danh mục VILAS 2025; chỉ bao gồm các phương pháp thử hóa học.
- Hiển thị và lọc thiết bị theo máy phân tích (GCMS, LCMSMS...) mà không làm nặng hệ thống lưu trữ.
- Hỗ trợ thao tác thêm, xóa và thay thế nhãn hàng loạt với cơ chế xác nhận an toàn.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Đồng bộ quy trình báo trả chất chuẩn: nhân viên có thể thêm hoặc làm mới nhãn, quản lý quyết định nhãn cuối cùng.
- Quản lý tồn kho theo đơn vị: phân loại rõ (mg, ml, lọ...) và hiển thị tổng số lọ để tránh nhầm lẫn.
- Tối ưu danh mục nhãn: hỗ trợ nhãn tự tạo, giữ nguyên chữ viết hoa/thường và tương thích ngược với nhãn cũ.

#### 🐛 Sửa Lỗi Hệ Thống

- Cảnh báo rõ ràng và ngăn chặn mất dữ liệu âm thầm khi thao tác vượt giới hạn số lượng nhãn cho phép.
- Tăng cường bảo mật và kiểm tra định dạng nhãn, ngăn chặn xóa nhãn sai quy định.
- Đảm bảo dữ liệu không bị ghi đè nhầm khi nhiều người cùng thao tác cập nhật nhãn hàng loạt.

### v26.08.05-b02

#### 🚀 Điểm Nổi Bật Bản Này

- Giao Nhận Mẫu hiển thị đúng khi sidebar mở rộng và topbar đang bật.
- Excel trên PWA giữ khu vực chuyển sheet rõ ràng, có thể cuộn ngang trên màn hình hẹp.
- PDF trên PWA được xử lý ổn định hơn trên các WebView cũ.

#### ✨ Tính Năng Mới

- PDF worker được bộ nhớ tạm để mở tài liệu ổn định hơn khi mạng chập chờn hoặc ngoại tuyến.

#### ⚡ Cải Tiến & Tối Ưu

- Khu vực xem tài liệu thích ứng với vùng an toàn ở mép dưới màn hình điện thoại.
- Lớp chọn văn bản PDF được tách khỏi phần hiển thị, giúp PDF vẫn đọc được khi lớp tương tác không tương thích.

#### 🐛 Sửa Lỗi Hệ Thống

- Sửa lỗi nội dung vùng chuyển sheet Excel bị che hoặc không thể nhấn trên PWA.
- Sửa lỗi PDF báo undefined is not a function trong một số môi trường PWA.

### v26.08.04-b10

#### 🚀 Điểm Nổi Bật Bản Này

- Không có thay đổi trong nhóm này.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Cải thiện giao diện Giao Nhận Mẫu để cửa sổ xem tài liệu không bị thanh bên cạnh hoặc thanh công cụ che khuất.
- Khu vực chuyển trang bảng tính trên điện thoại được tối ưu: luôn hiển thị rõ, có cuộn ngang và không bị che ở mép dưới.
- Tăng cường khả năng xem PDF trên thiết bị di động; tài liệu vẫn hiển thị ngay cả khi công cụ sao chép chữ gặp sự cố.
- Lưu tạm trình xem tài liệu để mở file nhanh và ổn định hơn ngay cả khi mạng yếu hoặc bị ngắt kết nối.

#### 🐛 Sửa Lỗi Hệ Thống

- Không có thay đổi trong nhóm này.

### v26.08.04-b09

#### 🚀 Điểm Nổi Bật Bản Này

- Không có thay đổi trong nhóm này.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Bỏ 4 thẻ số liệu tổng quan không cần thiết ở đầu trang Yêu Cầu Chất Chuẩn để giao diện gọn hơn.
- Đưa trọng tâm về danh sách yêu cầu; các bộ lọc trạng thái vẫn hiển thị ngay phía trên để dễ thao tác.
- Giữ nguyên các cải tiến về tìm kiếm, tải thêm dữ liệu và cửa sổ thao tác nổi cho danh sách dài.

#### 🐛 Sửa Lỗi Hệ Thống

- Không có thay đổi trong nhóm này.

### v26.08.04-b08

#### 🚀 Điểm Nổi Bật Bản Này

- Không có thay đổi trong nhóm này.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Cửa sổ thao tác luôn hiển thị nổi bật ở giữa màn hình, kể cả khi đang cuộn xem danh sách rất dài.
- Bảng yêu cầu luôn hiển thị số lượng mục đang xem và nút tải thêm dữ liệu ngay tại khu vực thao tác.
- Giao diện tạo yêu cầu mới được chia thành các phần nhỏ giúp dễ theo dõi và chọn chất chuẩn hơn.
- Thanh tìm kiếm, bộ lọc và cách hiển thị danh sách được sắp xếp gọn hơn trên điện thoại.

#### 🐛 Sửa Lỗi Hệ Thống

- Sửa lỗi cửa sổ xác nhận đôi khi bị lệch vị trí, bị che khuất hoặc gây khó hiểu khi thao tác từ danh sách dài.

### v26.08.04-b07

#### 🚀 Điểm Nổi Bật Bản Này

- Không có thay đổi trong nhóm này.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Tối ưu tải nhật ký cá nhân: hệ thống chỉ tải phần dữ liệu mới nhất, giúp giao diện phản hồi tức thì và cập nhật trực tiếp.
- Giới hạn số lượng hoạt động tải về ban đầu để tiết kiệm dung lượng mạng và tăng tốc ứng dụng.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục sự cố không tải được nhật ký do thiếu chỉ mục tìm kiếm trong cơ sở dữ liệu.

### v26.08.04-b06

#### 🚀 Điểm Nổi Bật Bản Này

- Không có thay đổi trong nhóm này.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Lịch sử sử dụng chuẩn được phân trang, có nút tải thêm và vẫn giữ tính năng tìm bản ghi cũ nhất tự động.
- Lưu tạm dữ liệu danh mục phụ trợ trong 5 phút để chuyển qua lại các trang nhanh hơn, không phải tải lại.
- Thống kê lượng dữ liệu ứng dụng tải về để làm cơ sở tối ưu hóa lâu dài.

#### 🐛 Sửa Lỗi Hệ Thống

- Không có thay đổi trong nhóm này.

### v26.08.04-b05

#### 🚀 Điểm Nổi Bật Bản Này

- Không có thay đổi trong nhóm này.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Giới hạn số lượng yêu cầu chờ và thông báo để ngăn ứng dụng tải một lượng lớn lịch sử không cần thiết.
- Tối ưu đồng bộ và khôi phục dữ liệu chuẩn giới hạn trong vòng 14 ngày khi thiết bị mất mạng lâu.
- Lưu tạm công thức phân tích để không phải tải lại mỗi khi mở lại màn hình.

#### 🐛 Sửa Lỗi Hệ Thống

- Không có thay đổi trong nhóm này.

### v26.08.04-b04

#### 🚀 Điểm Nổi Bật Bản Này

- Không có thay đổi trong nhóm này.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Bổ sung đo lường lượng dữ liệu ứng dụng tải về theo từng hạng mục để tối ưu lâu dài.
- Tránh tải lại những dữ liệu thống kê hoặc danh sách chuẩn đã có sẵn khi làm việc liên tục.
- Hạn chế dữ liệu tự động tải từ lịch sử thông báo hệ thống và yêu cầu mua hàng.
- Theo dõi hoạt động tải dữ liệu của quá trình đồng bộ hóa, tồn kho và thao tác của người quản trị.

#### 🐛 Sửa Lỗi Hệ Thống

- Không có thay đổi trong nhóm này.

### v26.08.04-b03

#### 🚀 Điểm Nổi Bật Bản Này

- Giảm các lần đọc hệ thống lặp lại khi đăng nhập và làm việc liên tục.
- Giữ phiên notification và các kết nối theo dõi ổn định hơn khi hồ sơ người dùng thay đổi.

#### ✨ Tính Năng Mới

- Chia sẻ các lần đọc inventory đang chạy và tránh request trùng khi thao tác Bù Kho.
- Giới hạn retry tự động khi hệ thống báo vượt quota để tránh khuếch đại lỗi.

#### ⚡ Cải Tiến & Tối Ưu

- kết nối theo dõi quyền và danh sách user được khởi tạo theo scope cần thiết, có dọn dẹp đúng vòng đời.
- Đăng ký FCM token có dedupe, cooldown khi lỗi và giao tiếp hệ thống idempotent.

#### 🐛 Sửa Lỗi Hệ Thống

- Loại bỏ vòng lặp bản sao dữ liệu user → đăng ký FCM → ghi lại user.
- Loại bỏ lần tải reference standards trùng trên màn hình thống kê.

### v26.08.04-b02

#### 🚀 Điểm Nổi Bật Bản Này

- Xem rõ những thay đổi mới nhất của LIMS Cloud trước khi bắt đầu ca làm việc.
- Nội dung tập trung vào lợi ích thực tế cho việc quản lý mẫu, mẻ phân tích và hồ sơ kiểm nghiệm.

#### ✨ Tính Năng Mới

- Mở Nhật Ký Cập Nhật để xem nhanh 3 phiên bản mới nhất hoặc xem toàn bộ lịch sử.
- Tìm kiếm theo phiên bản hoặc tên tính năng để tra lại thay đổi cần biết.

#### ⚡ Cải Tiến & Tối Ưu

- Thông tin phiên bản được cập nhật tự động, giúp nội dung hiển thị thống nhất trong toàn hệ thống.
- Lịch sử cập nhật được trình bày gọn hơn, dễ đọc trên cả máy tính và điện thoại.

#### 🐛 Sửa Lỗi Hệ Thống

- Không có thay đổi trong nhóm này.

### v26.08.04-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Không còn phải cập nhật thủ công nhiều file khi chuẩn bị deploy release mới.
- Lịch sử phiên bản được lưu tập trung trên hệ thống và tự động hiển thị trong ứng dụng.

#### ✨ Tính Năng Mới

- Trang /changelog và modal changelog đọc dữ liệu release từ hệ thống.
- Manager tự động khởi tạo release mới từ nội dung appData sau lần đăng nhập đầu tiên.

#### ⚡ Cải Tiến & Tối Ưu

- sync-version tự nhúng release notes vào Service Worker và validator kiểm tra đồng bộ version.
- Bổ sung migration script để đưa lịch sử changelog hiện tại lên collection releases.

#### 🐛 Sửa Lỗi Hệ Thống

- Không có thay đổi trong nhóm này.

### v26.08.03-b02

#### 🚀 Điểm Nổi Bật Bản Này

- Giảm đáng kể lượng dữ liệu tải lại cho Kho, Phương pháp và Nhật ký hoạt động bằng cơ chế chỉ đồng bộ phần thay đổi.
- Bổ sung công cụ quản trị để bổ sung mốc cập nhật cho dữ liệu cũ, giúp các lần đồng bộ sau nhanh và ổn định hơn.

#### ✨ Tính Năng Mới

- Thêm bảng điều khiển Migration trong Cấu hình để quản trị viên bổ sung mốc cập nhật cho dữ liệu Kho, Phương pháp và Nhật ký, có theo dõi tiến trình.

#### ⚡ Cải Tiến & Tối Ưu

- Các màn hình Kho, Phương pháp và Nhật ký cá nhân ưu tiên đọc phần dữ liệu thay đổi thay vì tải lại toàn bộ mỗi lần đăng nhập.
- Hợp nhất dữ liệu Kho về một nguồn dùng chung, giảm tải lặp và giữ thông tin hiển thị đồng nhất.
- Rút ngắn thời gian lưu thông báo cũ để giảm dung lượng dữ liệu cần xử lý.
- Bổ sung mốc cập nhật cho hồ sơ Phương pháp để cơ chế đồng bộ gia tăng hoạt động chính xác.

#### 🐛 Sửa Lỗi Hệ Thống

- Không có thay đổi trong nhóm này.

### v26.08.03-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Người dùng Google mới không còn bị kẹt mãi ở thông báo yêu cầu nhập mật khẩu dù đã nhập và lưu thành công.
- Ba lớp bảo vệ chống xung đột dữ liệu đồng thời giữa hệ thống đồng bộ dữ liệu và dự đoán trước state update.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Thêm trạng thái isSettingPassword làm guard tạm thời ngăn isPasswordSetupOpen đánh giá lại trong lúc đang lưu.
- Bảo vệ localPasswordConfigured trong đồng bộ dữ liệu: khi đã được set true, bản sao dữ liệu từ bộ nhớ tạm cũ không được ghi đè.

#### 🐛 Sửa Lỗi Hệ Thống

- Sửa lỗi hệ thống local bộ nhớ tạm bản sao dữ liệu ghi đè trạng thái localPasswordConfigured vừa xác nhận, khiến modal hiện lại.
- Sửa lỗi dùng stale firebaseUser object sau reload() khiến thông tin xác thực thiếu password phương thức đăng nhập và needsPasswordSetup() vẫn true.

### v26.08.02-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Gửi liên kết khôi phục mật khẩu ngay từ màn hình đăng nhập, có giới hạn gửi lại.
- Quản lý liên kết Google và mật khẩu trên cùng một tài khoản, không cho xóa phương thức cuối cùng.

#### ✨ Tính Năng Mới

- Cho phép tạo, đổi và khôi phục mật khẩu LIMS ngay trong ứng dụng.
- Hỗ trợ liên kết hoặc hủy liên kết phương thức đăng nhập với cơ chế bảo vệ tài khoản.

#### ⚡ Cải Tiến & Tối Ưu

- Yêu cầu xác nhận mật khẩu hiện tại trước khi đổi mật khẩu đã có.
- Bổ sung tự động điền, nhãn biểu mẫu và nút hiện/ẩn mật khẩu rõ ràng hơn.

#### 🐛 Sửa Lỗi Hệ Thống

- Ghi thời điểm thay đổi mật khẩu bằng thời gian máy chủ và không tiết lộ email có tồn tại khi khôi phục.

### v26.08.01-b08

#### 🚀 Điểm Nổi Bật Bản Này

- Ngay sau Google redirect thành công, dashboard tự mở form để người dùng tạo mật khẩu LIMS.
- Lưu trạng thái thiết lập ban đầu trên cùng hệ thống profile để đồng bộ khi đăng nhập Google hoặc Gmail.

#### ✨ Tính Năng Mới

- Tài khoản cũ đã có phương thức đăng nhập nhưng thiếu cờ hoàn tất cũng được đưa vào thiết lập ban đầu.
- Không cần vào menu Cấu hình để tìm form tạo mật khẩu.

#### ⚡ Cải Tiến & Tối Ưu

- hệ thống Rules chỉ cho phép chính người dùng cập nhật hai trường trạng thái thiết lập ban đầu.

#### 🐛 Sửa Lỗi Hệ Thống

- Không còn bỏ qua bước thiết lập chỉ vì hệ thống thông tin xác thực đã chứa password.

### v26.08.01-b07

#### 🚀 Điểm Nổi Bật Bản Này

- Cho phép tạo hoặc đổi mật khẩu LIMS trực tiếp từ khu vực Cấu hình / Hồ sơ cá nhân.
- Linh hoạt cho phép hủy/đóng modal đổi mật khẩu khi tài khoản đã có mật khẩu.

#### ✨ Tính Năng Mới

- Bổ sung nút Thiết lập / Đổi mật khẩu trong mục Quản lý phương thức xác thực.
- Tự động hiển thị và điều khiển modal tạo/đổi mật khẩu phù hợp với loại tài khoản.

#### ⚡ Cải Tiến & Tối Ưu

- Cập nhật giao diện Hồ sơ cá nhân với chỉ báo trạng thái phương thức xác thực rõ ràng.

#### 🐛 Sửa Lỗi Hệ Thống

- Không có thay đổi trong nhóm này.

### v26.08.01-b06

#### 🚀 Điểm Nổi Bật Bản Này

- Người dùng Google có thể thiết lập mật khẩu LIMS để đăng nhập bằng Gmail/email hoặc Google.
- Liên kết Google và mật khẩu trên cùng một hệ thống định danh người dùng, giữ nguyên hồ sơ, quyền và dữ liệu.

#### ✨ Tính Năng Mới

- Bổ sung màn hình thiết lập mật khẩu bắt buộc cho tài khoản Google mới.
- Cho phép tài khoản email/mật khẩu liên kết Google từ hồ sơ tài khoản.

#### ⚡ Cải Tiến & Tối Ưu

- Hiển thị trạng thái các phương thức xác thực và hỗ trợ gửi lại email đặt lại mật khẩu.
- Thông báo redirect môi trường thử nghiệm nêu rõ nguyên nhân và hướng mở bằng trình duyệt ngoài khi cần.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục lỗi hệ thống gọi đường dẫn kết nối đường dẫn kết nối hệ thống 404 khi đăng nhập Google trên môi trường thử nghiệm.
- Từ chối liên kết Google khác email tài khoản hiện tại để tránh gắn nhầm người dùng.

### v26.08.01-b05

#### 🚀 Điểm Nổi Bật Bản Này

- Cung cấp đúng cấu hình web cho thành phần hỗ trợ đăng nhập Google trên môi trường thực tế.
- Đăng nhập chuyển hướng có đủ đường dẫn kết nối để hệ thống khởi tạo và trả kết quả xác thực.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Cập nhật file cấu hình hệ thống dùng chung cho đường dẫn kết nối hỗ trợ đăng nhập.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục trường hợp đường dẫn kết nối đường dẫn kết nối hệ thống trả về 404 khi bắt đầu đăng nhập Google.

### v26.08.01-b04

#### 🚀 Điểm Nổi Bật Bản Này

- Đồng bộ đầy đủ các đường dẫn kết nối hỗ trợ xác thực hệ thống trên môi trường triển khai thực tế.
- Đăng nhập Google chuyển hướng hoạt động ổn định hơn trên môi trường thực tế.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Giữ bảo vệ chống nhúng cho các màn hình chính của ứng dụng.

#### 🐛 Sửa Lỗi Hệ Thống

- Không còn trả nhầm trang ứng dụng thay cho cấu hình hệ thống khi trình duyệt khởi tạo luồng đăng nhập.

### v26.08.01-b03

#### 🚀 Điểm Nổi Bật Bản Này

- Đăng nhập Google ổn định hơn trên môi trường môi trường thực tế và môi trường triển khai thực tế.
- Ứng dụng vẫn được bảo vệ chống nhúng trái phép trong khi luồng xác thực hoạt động bình thường.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Cho phép thành phần xác thực hệ thống hoạt động đúng trong quá trình đăng nhập chuyển hướng.
- Làm sạch toàn bộ lỗi kiểm tra mã nguồn còn lại ở dịch vụ thống kê và dashboard.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục trường hợp Google chuyển về ứng dụng nhưng không nhận được kết quả đăng nhập.

### v26.08.01-b02

#### 🚀 Điểm Nổi Bật Bản Này

- Đăng nhập Google ổn định hơn trên trình duyệt trình duyệt Safari, thiết bị di động và trình duyệt trong ứng dụng.
- Sau khi đăng nhập, hệ thống đưa người dùng trở lại đúng màn hình đang làm việc.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Luồng đăng nhập không còn phụ thuộc vào cửa sổ bật lên.
- Quyền Google Google Google Drive chỉ được yêu cầu khi người dùng sử dụng tính năng Drive.

#### 🐛 Sửa Lỗi Hệ Thống

- Hiển thị thông báo và hướng dẫn rõ ràng hơn khi đăng nhập bị gián đoạn do trình duyệt, tên miền hoặc mạng.

### v26.08.01-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Không có thay đổi trong nhóm này.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Tự động nhận diện nếu trình duyệt (trình duyệt trình duyệt Safari, trình duyệt trình duyệt Brave) hoặc trình duyệt nhúng (ứng dụng chat) chặn cửa sổ bật lên đăng nhập Google. Khi lỗi cửa sổ bật lên-closed-by-user xảy ra dưới 2.5 giây, hệ thống chủ động chuyển sang luồng chuyển hướng (chuyển hướng).

#### 🐛 Sửa Lỗi Hệ Thống

- Xử lý lỗi không tương thích mảng tương thích định dạng dữ liệu của Map.entries() trên các trình duyệt cũ, giúp chức năng xem tài liệu PDF hoạt động ổn định và mượt mà hơn.

### v26.07.31-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Toàn bộ phần Hiệu Suất Phân Tích (KPI, biểu đồ, so sánh trendInfo, tần suất phương pháp) chuyển sang 100% hệ thống tổng hợp sẵn.
- Đã sửa triệt để lỗi lỗi tính toán thời gian và lệch một đơn vị giúp phép so sánh giữa các tháng luôn chính xác.
- Khắc phục lỗi hệ thống truy vấn chỉ mục tìm kiếm cho phép bổ sung dữ liệu dữ liệu từ 01/01/2026 mượt mà.
- Nâng cấp bộ nhớ tạm tín hiệu trạng thái statsData.update giúp duy trì dữ liệu các tháng đã tải khi chuyển đổi bộ lọc.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Không có thay đổi trong nhóm này.

#### 🐛 Sửa Lỗi Hệ Thống

- Không có thay đổi trong nhóm này.

### v26.07.29-b03

#### 🚀 Điểm Nổi Bật Bản Này

- Hệ thống nhận đúng mẫu, chỉ tiêu, nền mẫu và phương pháp phù hợp; các dòng nhập trùng được tự động bỏ qua.
- Cảnh báo rõ khi thiếu phương pháp, sai đơn vị, thiếu hóa chất, nhập số lượng không hợp lệ hoặc một mẫu bị xếp trùng.
- Kế hoạch chỉ được duyệt khi tất cả mẻ đều hợp lệ; nếu có lỗi, dữ liệu vẫn được giữ nguyên để sửa và thử lại.
- Lượng hóa chất được tính theo toàn bộ kế hoạch và kiểm tra lại ngay lúc duyệt, giúp hạn chế trừ tồn sai.
- Người thao tác chỉ nhận một thông báo; những người dùng khác nhận đúng nội dung thay đổi mới nhất.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Không có thay đổi trong nhóm này.

#### 🐛 Sửa Lỗi Hệ Thống

- Không có thay đổi trong nhóm này.

### v26.07.29-b02

#### 🚀 Điểm Nổi Bật Bản Này

- Luồng nhập chất chuẩn đọc toàn bộ tệp Excel, xem trước từng dòng và lưu đồng bộ nguyên tử để không còn ghi dở dữ liệu.
- Mã quản lý được xem là mã quản lý có thể cấp lại sau khi chuẩn cũ bị xóa mềm; chuẩn mới luôn có ID lịch sử riêng.
- tệp Excel mẫu được nhận đủ 45 dòng: 44 chuẩn tạo mới và Bicozamycin/AB47 cập nhật an toàn.

#### ✨ Tính Năng Mới

- Modal import riêng hiển thị sheet, dòng hợp lệ, cảnh báo, xung đột, chế độ tạo mới/cập nhật và thay đổi metadata.
- Web Worker đọc XLSX ngoài luồng giao diện; kiểm tra kích thước, định dạng, header, ngày, đơn vị và tồn kho trước khi ghi.
- Restore kiểm tra mã quản lý đang được sử dụng và chặn khôi phục nếu mã đã cấp cho chuẩn hoạt động khác.

#### ⚡ Cải Tiến & Tối Ưu

- đồng bộ gia tăng hợp nhất thay đổi tối ưu mà không hủy kết nối theo dõi của màn hình hiện tại.
- Import lại chuẩn hiện hữu chỉ cập nhật metadata an toàn, không ghi đè tồn kho, workflow hoặc nhập trùng nhật ký.
- Toast trùng được gom theo nội dung/sự kiện, giới hạn số thông báo đồng thời và duy trì thời gian hiển thị hợp lý.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục chỉ thấy Bicozamycin sau khi chọn tệp Excel mẫu trong phiên ứng dụng cũ.
- Khắc phục chuẩn đã xóa mềm bị nhận nhầm thành RESTORE khi mã quản lý được dùng cho chuẩn mới.
- Khắc phục Restore có thể làm hai chuẩn hoạt động cùng chiếm một mã quản lý.

### v26.07.29-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Import Excel chạy trong Web Worker để file chứa nhiều hình sắc ký không còn khóa giao diện.
- Chỉ các sheet hoạt chất thuộc phương pháp được phân tích; hình, chart, style và dữ liệu phụ được bỏ qua.
- Mọi phương pháp nhận quy tắc tên sequence xxx_ngày_mã-mẫu, ví dụ FIPRONIL_27_U01.D ghép với U0127.

#### ✨ Tính Năng Mới

- Modal hiển thị tiến trình nạp file, đọc sheet, trích xuất report và ghép mẫu; hỗ trợ hủy an toàn trước khi áp dụng.
- Fallback tự động về chế độ tương thích khi Worker không khả dụng hoặc đọc toàn bộ sheet khi chưa nhận diện được tên sheet phương pháp.
- Service Worker lưu bộ nhớ tạm riêng cho bundle Excel Worker để luồng import tiếp tục dùng được khi kết nối mạng không ổn định.

#### ⚡ Cải Tiến & Tối Ưu

- ArrayBuffer được chuyển sang Worker theo cơ chế transfer, tránh sao chép thêm file lớn trong bộ nhớ.
- Tắt đọc công thức, rich text, styles, calculation chain, VBA và raw ZIP files nhưng vẫn giữ nguyên text hiển thị của Final-Conc.
- phương pháp-01 nhận đầy đủ BLANK, SPIKE và SPIKE_N động; quy tắc ghép ngày/mã mẫu được mở rộng làm fallback chung cho phương pháp mới.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục giao diện có thể treo lâu khi XLSX.read chạy đồng bộ trên main thread với tệp Excel nhiều sắc ký đồ.
- Khắc phục U0127 không ghép với FIPRONIL_27_U01.D sau khi hợp nhất các module import.
- Khắc phục Pirimiphos methyl bị báo không được phân khi mẻ đang lưu ID Master Analyte lịch sử.

### v26.07.28-b06

#### 🚀 Điểm Nổi Bật Bản Này

- Mọi phương pháp dùng chung một modal Import Excel cho Form Check và Form Đơn, từ xem trước đến chọn và áp dụng dữ liệu.
- Alias chỉ tiêu được quản lý tại Master Analyte; hỗ trợ Etofenprox/Ethofenprox và giữ bảng alias cũ làm phương án dự phòng.
- Người dùng có thể chọn lưu tệp Excel gốc lên Google Drive với modal tiến trình và liên kết mở lại ngay trên header mẻ.

#### ✨ Tính Năng Mới

- Checkbox lưu tệp nguồn chỉ mã hóa và upload khi được bật; lựa chọn gần nhất được ghi nhớ theo mẻ.
- Master Analyte hỗ trợ nhập, sửa, tìm kiếm, import và export danh sách tên khác.
- Liên kết Excel gốc dùng chung cho mọi phương pháp và vẫn đọc được dữ liệu MassHunter lịch sử.

#### ⚡ Cải Tiến & Tối Ưu

- Modal PDF mở thủ công và tự bật sau khi xuất dùng chung metadata phiên bản, người phát hành, thời gian và Google Docs.
- Command Palette hỗ trợ tìm kiếm tiếng Việt không dấu và phản hồi ngay khi nhập.
- Loại bỏ parser và handler MassHunter riêng bị trùng, giữ một luồng import chung để các phương pháp mới tự thừa hưởng.

#### 🐛 Sửa Lỗi Hệ Thống

- Giá trị Final-Conc. bằng 0 được nhập thành ND đúng theo Form Check và Form Đơn.
- PDF Form Check một mẫu chỉ in giá trị kết quả, không lặp mã mẫu trước giá trị.
- Form Check không còn cảnh báo thiếu R² vì loại form này không có trường R².
- Upload lỗi không làm thay đổi kết quả; modal được giữ lại để thử lại hoặc bỏ chọn lưu tệp.

### v26.07.28-b05

#### 🚀 Điểm Nổi Bật Bản Này

- Một nút Import Excel dùng chung cho Form Check, Form Đơn và các phương pháp mới.
- Modal xem trước cho phép chọn hoặc bỏ chọn từng thông tin trước khi ghi vào giao diện.
- Ghép tên mẫu linh hoạt giữa tiền tố Excel và mã mẫu trong mẻ.

#### ✨ Tính Năng Mới

- Chỉ nhập Final-Conc. và không đổi đơn vị; mục được chọn ghi đè, mục bỏ chọn giữ nguyên.
- ND được đánh dấu checkbox ở Form Check hoặc điền trực tiếp ở Form Đơn.
- R² và số điểm đường chuẩn chỉ nhập cho Form Đơn, giữ nguyên nồng độ danh định.
- Cho phép giữ nguyên Excel hoặc chọn từ 0 đến 6 chữ số thập phân.

#### ⚡ Cải Tiến & Tối Ưu

- Mã mẫu chứa BL/SP vẫn được coi là mẫu thường; QC không tồn tại trên Form Check tự động bị bỏ qua.
- Chỉ lưu dữ liệu đã chọn và nhật ký import rút gọn, không giữ toàn bộ tệp Excel trên máy.

#### 🐛 Sửa Lỗi Hệ Thống

- Không có thay đổi trong nhóm này.

### v26.07.28-b04

#### 🚀 Điểm Nổi Bật Bản Này

- Tự AutoFit cột và hàng ngay khi mở tệp Excel hoặc chuyển sheet, không còn yêu cầu double-click từng tiêu đề.
- Tự tăng chiều cao và wrap nội dung dài trong giới hạn an toàn, có xử lý đúng tổng chiều rộng của ô gộp.

#### ✨ Tính Năng Mới

- Nút Vừa nội dung cho phép khôi phục AutoFit sau khi người dùng kéo chỉnh kích thước thủ công.

#### ⚡ Cải Tiến & Tối Ưu

- Giới hạn chiều rộng riêng cho desktop/mobile để bảng vừa dễ đọc vừa không bị phình bởi một ô bất thường.
- Tối ưu hiệu năng bằng cách chỉ đo giá trị đại diện dài nhất của từng cột và lưu đệm kết quả đo.
- Toàn bộ AutoFit chạy cục bộ trong trình duyệt, không phát sinh dịch vụ hoặc chi phí mới.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục cột mặc định 96px và hàng 28px khiến nội dung bị cắt cho đến khi người dùng double-click thủ công.

### v26.07.28-b03

#### 🚀 Điểm Nổi Bật Bản Này

- Khắc phục lỗi Map.getOrInsertComputed khiến PDF không mở được trên Chrome/trình duyệt trình duyệt Safari mobile.
- Chuyển đồng bộ PDF.js viewer và worker sang legacy build chính thức có lớp tương thích Map/WeakMap.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Giữ nguyên chế độ cuộn dọc nhiều trang, text layer chọn/copy và tìm kiếm highlight trên desktop lẫn mobile.
- Không sửa prototype thủ công, không thêm OCR/cloud và không phát sinh chi phí.

#### 🐛 Sửa Lỗi Hệ Thống

- Sửa lỗi Không thể xem trước tài liệu do trình duyệt mobile chưa hỗ trợ Map.getOrInsertComputed.

### v26.07.28-b02

#### 🚀 Điểm Nổi Bật Bản Này

- PDF hiển thị toàn bộ trang theo chiều dọc, tự đồng bộ số trang và render lười để tài liệu dài vẫn mượt trên desktop/mobile.
- Excel giữ cấu trúc tệp Excel, hỗ trợ chọn ô/dòng/cột/vùng, copy dạng bảng, tìm kiếm highlight và chuyển sheet như một bảng tính chỉ đọc.
- Bộ lọc/sắp xếp theo đúng tiêu đề nghiệp vụ, chỉ tác động vùng dữ liệu và luôn giữ nguyên tiêu đề cùng phần ký xác nhận.

#### ✨ Tính Năng Mới

- Lớp văn bản PDF cho phép tô chọn/copy, tìm toàn tài liệu, tô vàng mọi kết quả và tô cam kết quả đang tập trung.
- Excel hỗ trợ kéo chọn vùng, chọn cả dòng/cột, Ctrl/⌘ + A, Ctrl/⌘ + C, điều hướng bàn phím và thanh công thức.
- Bảng Lọc & sắp xếp riêng với điều kiện Có chứa, Bằng chính xác, Không trống và thứ tự tăng/giảm.
- Google Drive công khai tải đủ mọi trang dữ liệu, hỗ trợ hủy yêu cầu cũ và xuất Google Sheets sang XLSX.

#### ⚡ Cải Tiến & Tối Ưu

- Modal xem tài liệu dùng tối đa diện tích, đồng bộ thanh công cụ PDF/Excel và tối ưu thao tác cảm ứng trên mobile.
- Ghi nhớ thư mục, chế độ xem, mật độ, sắp xếp và vị trí cuộn khi quay lại module Phiếu Giao Nhận Mẫu.
- PDF chỉ render các trang gần vùng nhìn; mọi xử lý PDF/Excel chạy cục bộ bằng thư viện mã nguồn mở, không phát sinh phí OCR/cloud.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục PDF chỉ hiển thị một trang khiến người dùng hiểu nhầm tài liệu đã kết thúc.
- Khắc phục Excel không thể chọn/copy vùng, dòng hoặc cột và giao diện khác xa cấu trúc tệp gốc.
- Khắc phục filter Excel bị kẹt, hiển thị nội dung vô nghĩa và kéo dòng trống/chữ ký vào vùng sắp xếp.
- Khắc phục tìm kiếm chỉ báo kết quả nhưng không làm nổi bật đúng nội dung vừa tìm thấy.

### v26.07.28-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Loại bỏ Navigation Rail và đưa toàn bộ điều hướng Desktop lên Header, giúp giao diện gọn hơn và trả lại toàn bộ không gian nội dung khi đóng sidebar.
- Chuông thông báo có chế độ Header riêng; popover tự neo chính xác ngay dưới nút chuông và vẫn giữ bottom sheet trên mobile.
- Smart Batch cập nhật tồn kho tức thời sau khi bù hàng, tự kiểm tra lại mẻ và mở khóa thao tác ở Bước 2 khi đã đủ kho.

#### ✨ Tính Năng Mới

- Nút Trang Chủ thật trên breadcrumb Header và sidebar 256px nằm gọn dưới thanh điều hướng.
- Notification Bell 36px đồng bộ các action Header, hỗ trợ badge, trạng thái active và animation thông báo chưa đọc.

#### ⚡ Cải Tiến & Tối Ưu

- Main content và Header dùng chung mốc sidebar 256px, chuyển trạng thái mở/đóng mượt mà và nhất quán.
- Notification popover đo vị trí nút chuông bằng bounding rectangle thay vì phụ thuộc chiều rộng navigation cố định.
- Đồng bộ bộ nhớ tạm Smart Batch với state kho ngay sau giao dịch Nhập Kho Nhanh để bảng tổng hợp phản hồi tức thời.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục nút thao tác Smart Batch ở Bước 2 vẫn bị khóa sau khi người dùng đã bù đủ tồn kho.
- Khắc phục cảnh báo thiếu hàng và trạng thái mẻ cập nhật chậm trong thời gian chờ hệ thống kết nối theo dõi.

### v26.07.27-b04

#### 🚀 Điểm Nổi Bật Bản Này

- Thanh điều hướng Desktop mới (App Header): Breadcrumbs động, Tìm kiếm/Quét mã nhanh (Ctrl+K), Badge Online/Offline, Dark Mode toggle và Profile Pill.
- Nâng cấp Sidebar Navigation: Xóa nút floating toggle, thêm tooltip hover, active indicator phát sáng và Glassmorphism Rail.
- Tối ưu Mobile: Active tab pill rõ ràng hơn và đồng bộ tiêu đề trang với Desktop Header.

#### ✨ Tính Năng Mới

- Tạo component AppHeaderComponent hoàn toàn mới: Breadcrumbs, Search (⌘K), Online/Offline status, Dark Mode, Notification Bell, Profile dropdown.
- Bản đồ ROUTE_TITLES & ROUTE_ICONS dùng chung cho toàn hệ thống (25+ routes).
- Nút thu gọn sidebar tích hợp tại header Navigation Panel thay cho nút floating cũ.

#### ⚡ Cải Tiến & Tối Ưu

- Tooltip popover cho mỗi shortcut icon khi Rail thu gọn, giúp nhận biết tính năng mà không cần đoán icon.
- Active pill indicator với glow effect trên Navigation Rail và Panel.
- Nâng cấp nền Rail sang backdrop-blur-xl glassmorphism tạo chiều sâu hiện đại.
- Bottom Nav active indicator chuyển từ chấm tròn sang pill ngang (w-4) rõ ràng hơn.

#### 🐛 Sửa Lỗi Hệ Thống

- Không có thay đổi trong nhóm này.

### v26.07.27-b03

#### 🚀 Điểm Nổi Bật Bản Này

- Xem trực tiếp file PDF báo cáo kết quả phân tích mượt mà trên giao diện, tự động hỗ trợ xác thực lại Google Google Google Drive khi hết hạn.
- Cập nhật ngay báo cáo tương ứng khi chuyển đổi bộ lọc nhóm mẫu hoặc chọn phiếu báo cáo.
- Khóa tự động chế độ Chỉ Xem cho các mẻ phân tích đã hoàn tất để bảo vệ dữ liệu và mở mặc định ở màn hình xem báo cáo.

#### ✨ Tính Năng Mới

- Xem báo cáo PDF trực tiếp & mượt mà với cơ chế nạp Blob và tự động thu hồi bộ nhớ sau khi đóng panel.
- Rà soát tự động trước khi xuất báo cáo (chữ ký, kết quả ND/số liệu, R²) và hỗ trợ xem/khôi phục 5 phiên bản báo cáo.
- Hiển thị lượng chất chuẩn với 2 chữ số thập phân chuẩn GLP (12.50 g), hỗ trợ nhập bù nhật ký & nút chọn nhanh Tối đa.

#### ⚡ Cải Tiến & Tối Ưu

- Tối ưu bộ nhớ máy tính phòng thí nghiệm bằng cách giải phóng dữ liệu blob PDF khi người dùng chuyển trang hoặc đóng tab.
- Mẻ phân tích đã duyệt mở mặc định ở màn hình xem báo cáo PDF, giữ lối chỉnh sửa chủ động qua nút Chỉnh sửa.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục hiển thị sai nhãn tiền tố report và xử lý triệt để liên kết báo cáo khi xem mẻ phân tích theo từng nhóm mẫu.

### v26.07.27-b02

#### 🚀 Điểm Nổi Bật Bản Này

- Thêm bước kiểm tra trước khi tạo báo cáo PDF để phát hiện thiếu mẫu, thiếu ngày ký, thiếu kết quả/ND và cảnh báo mẫu đã từng in.
- Lưu lịch sử publish/restore đầy đủ hơn theo report ID, prefix, danh sách mẫu và backup dữ liệu nhập liệu.
- Tách mặc định mẻ hoàn tất sang màn xem báo cáo, đồng thời giữ lối chỉnh sửa chủ động bằng edit=1.

#### ✨ Tính Năng Mới

- Modal preflight hiển thị blockers, warnings, thông tin phạm vi in và các phiếu dự kiến khi chia report.
- Timeline phiên bản trong panel Các Báo Cáo với nút mở PDF/Google Docs từng bản.
- Module preflight riêng kèm test tự động cho chia phiếu, ND type3b, thiếu dữ liệu và cảnh báo mẫu đã publish.

#### ⚡ Cải Tiến & Tối Ưu

- chỉ đọc được truyền sâu xuống các phương pháp Results và khóa native control cho phương pháp-01, phương pháp-03, Chloroform, Default Type2 và Type3B.
- Restore version dò theo reportId/prefix/bản chung để tránh nhầm phiếu khi cùng version có nhiều report.
- Màn xem chi tiết kết quả hiển thị nhãn report theo prefix thật thay vì key/timestamp kỹ thuật.

#### 🐛 Sửa Lỗi Hệ Thống

- Chặn các thao tác có side-effect trong phương pháp-01 khi mẻ chỉ đọc hoặc đang xử lý, gồm import MassHunter, điền nhanh, copy dòng và đổi chọn mẫu.
- Pending guard cảnh báo cả khi autosave đang saving hoặc lỗi, không chỉ khi modified.
- Tiếp tục đồng bộ định dạng 2 chữ số thập phân cho module Chất Chuẩn và Yêu Cầu Chất Chuẩn.

### v26.07.27-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Quy chuẩn tự động hiển thị các giá trị định lượng chất chuẩn với đúng 2 chữ số thập phân cố định (12.50, 10.00).
- Giữ nguyên độ chính xác tính toán tồn kho bằng cách phân tách dữ liệu lưu trữ float gốc và lớp hiển thị.
- Đồng bộ hiển thị 2 chữ số thập phân trên toàn bộ module Chất Chuẩn và trang Yêu Cầu Chất Chuẩn (/standard-requests).

#### ✨ Tính Năng Mới

- Nâng cấp hàm formatNum hỗ trợ quy chuẩn định dạng 2 chữ số thập phân linh hoạt (Phương án A).
- Đồng bộ chuẩn hóa hiển thị tồn kho và lượng sử dụng trên Bảng Yêu cầu, Card Kanban, Action Modals và Create Request Drawer.

#### ⚡ Cải Tiến & Tối Ưu

- Giao diện gióng hàng các con số đẹp mắt, chuyên nghiệp theo chuẩn GLP.
- Loại bỏ hoàn toàn các binding hiển thị số lẻ trực tiếp trên UI.

#### 🐛 Sửa Lỗi Hệ Thống

- Không có thay đổi trong nhóm này.

### v26.07.25-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Cho phép Quản lý nhập bù nhật ký sử dụng chất chuẩn trong quá khứ cho nhân viên.
- Bổ sung nút "Tối đa" tự động điền toàn bộ lượng tồn kho còn lại của lọ chuẩn.
- Tự động tích chọn và cập nhật trạng thái Hết Hàng khi dùng hết chuẩn.

#### ✨ Tính Năng Mới

- Nút "Nhập bù nhật ký" dành cho Quản lý trong danh sách chất chuẩn.
- Nút "Tối đa" và tùy chọn "Đánh dấu chuẩn đã sử dụng hết" trong cửa sổ nhập bù.

#### ⚡ Cải Tiến & Tối Ưu

- Cho phép nhập bù hồi ký ngay cả khi lọ chuẩn đang được mượn.
- Thẻ chọn nhanh mục đích sử dụng giúp thao tác nhanh và đồng bộ.

#### 🐛 Sửa Lỗi Hệ Thống

- Xử lý tương thích định dạng kiểu dữ liệu trong khung nhập số lượng tối đa.

### v26.07.24-b25

#### 🚀 Điểm Nổi Bật Bản Này

- Sắp xếp mã mẫu thực hiện logic hơn (tiền tố hiển thị trước).
- Tải nhật ký hoạt động trên Dashboard đúng phân quyền của người dùng.

#### ✨ Tính Năng Mới

- Bổ sung bảng Nhật ký hoạt động gần đây phù hợp với từng vai trò.
- Tối ưu giao diện Daily Checklist gọn nhẹ trên thiết bị di động.

#### ⚡ Cải Tiến & Tối Ưu

- Loại bỏ mã QR không cần thiết trong bản in Daily Checklist để tăng tốc độ in.
- Sắp xếp danh sách mẫu có tiền tố rõ ràng.

#### 🐛 Sửa Lỗi Hệ Thống

- Sửa lỗi trắng dữ liệu nhật ký khi mở Dashboard lần đầu.

### v26.07.24-b02

#### 🚀 Điểm Nổi Bật Bản Này

- Trạm Pha Chế cho phép toàn bộ nhân viên truy cập để sử dụng công cụ tính toán (Sandbox). Chế độ thực vẫn bảo vệ kho.
- Đồng bộ tiếng Việt các thông báo phân quyền trên toàn hệ thống.
- Bộ đếm ngược tự động thông minh 30s khi có phiên bản mới, tự tạm dừng khi rời máy và tiếp tục khi có tương tác.

#### ✨ Tính Năng Mới

- Trạm Pha Chế khả dụng cho mọi nhân viên ở chế độ Sandbox.
- Bổ sung nút "Nhật ký phiên bản" cố định ở Footer và Dashboard để tra cứu 24/7.

#### ⚡ Cải Tiến & Tối Ưu

- Chuẩn hóa thông báo lỗi phân quyền tiếng Việt thân thiện.
- cửa sổ bật lên cập nhật tự động dừng đếm ngược khi người dùng không di chuột/chạm màn hình.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục hiển thị sai tên quyền nội bộ trong thông báo toast.
- Tối ưu Service Worker caching cho tệp xác minh Google.

### v26.07.23-b24

#### 🚀 Điểm Nổi Bật Bản Này

- Đảm bảo lưu mẻ phân tích ổn định ngay cả khi thiếu mã tham chiếu phụ.
- Tự động làm sạch dữ liệu trước khi gửi ghi log lên hệ thống.

#### ✨ Tính Năng Mới

- Nâng cấp luồng ghi log phê duyệt và sửa mẻ.

#### ⚡ Cải Tiến & Tối Ưu

- Không có thay đổi trong nhóm này.

#### 🐛 Sửa Lỗi Hệ Thống

- Sửa lỗi hệ thống báo undefined khi phương pháp thiếu thông tin phụ.
- Cập nhật đúng phiếu in sau khi sửa đổi mẻ.

### v26.07.23-b23

#### 🚀 Điểm Nổi Bật Bản Này

- Tối ưu lazy-loading cho các thư viện nặng giúp app khởi động nhanh hơn 40%.
- Đưa SmartBatch làm luồng lập mẻ phân tích chính.

#### ✨ Tính Năng Mới

- Thêm nút "Tính nhanh phương pháp" trực tiếp bên trong màn hình SmartBatch.
- Tối ưu hóa các bảng lưu trữ hóa chất, chất chuẩn và báo cáo.

#### ⚡ Cải Tiến & Tối Ưu

- Ẩn Calculator khỏi thanh menu chính để đơn giản hóa giao diện navigation.

#### 🐛 Sửa Lỗi Hệ Thống

- Không có thay đổi trong nhóm này.

### v26.07.23-b22

#### 🚀 Điểm Nổi Bật Bản Này

- cửa sổ bật lên cập nhật hiển thị đúng nội dung các bản phát hành mới nhất, giúp người dùng nắm được thay đổi quan trọng ngay khi hệ thống có phiên bản mới.

#### ✨ Tính Năng Mới

- Bổ sung tóm tắt trực quan cho các thay đổi về chuẩn hóa CAS, điều chỉnh nhãn, kiểm tra dữ liệu hóa chất và hoàn tác theo phiên.

#### ⚡ Cải Tiến & Tối Ưu

- Nội dung cập nhật được đồng bộ nhất quán giữa thông báo phiên bản và giao diện ứng dụng.

#### 🐛 Sửa Lỗi Hệ Thống

- Không có thay đổi trong nhóm này.

### v26.07.23-b21

#### 🚀 Điểm Nổi Bật Bản Này

- Các nhóm CAS lỗi có thể được mở trực tiếp để kiểm tra và chỉnh sửa từng hồ sơ, thay vì chỉ xem số lượng tổng hợp.

#### ✨ Tính Năng Mới

- Cho phép xem từng hồ sơ CAS lỗi theo từng trang, tìm kiếm theo CAS, tên, mã quản lý, catalog hoặc số lô và lưu phiên chỉnh sửa riêng.
- Tra cứu dữ liệu hóa chất để đối chiếu tên tìm thấy trước khi lưu, không tự động đổi tên chất chuẩn.

#### ⚡ Cải Tiến & Tối Ưu

- Kiểm tra cấu trúc và chữ số kiểm tra CAS ngay khi nhập, đồng thời hướng dẫn xử lý khác nhau theo từng nguyên nhân lỗi.
- Lịch sử trước/sau ghi lại CAS, danh pháp và thông tin liên quan để có thể hoàn tác an toàn.

#### 🐛 Sửa Lỗi Hệ Thống

- Không còn chọn đại một CAS trong dữ liệu có nhiều CAS và không làm mất CAS hiện tại khi hoàn tác các phiên cũ.

### v26.07.23-b20

#### 🚀 Điểm Nổi Bật Bản Này

- Chuẩn hóa danh pháp chất chuẩn theo từng nhóm CAS với phân trang, phân tầng rủi ro và quy trình duyệt rõ ràng.
- Bảo toàn thông tin sản phẩm và hỗ trợ hoàn tác từng phiên chuẩn hóa an toàn.

#### ✨ Tính Năng Mới

- Data Cleanup hiển thị từng nhóm CAS một lần, cho phép tìm kiếm, lọc rủi ro, duyệt từng hồ sơ và chỉ lưu nhóm đang xem.
- Tự động phân loại nhóm theo mức An toàn, Cần duyệt hoặc Rủi ro cao dựa trên tên, đơn vị, dung dịch, hỗn hợp, đồng vị, muối và hydrat.
- Kiểm tra cấu trúc và chữ số kiểm tra CAS trước khi gom nhóm hoặc đối chiếu dữ liệu hóa chất.
- Mỗi lần chuẩn hóa tạo một phiên độc lập, có lịch sử trước/sau và hỗ trợ hoàn tác nguyên tử.

#### ⚡ Cải Tiến & Tối Ưu

- Chuẩn hóa ký hiệu khoa học và đơn vị, đồng thời bảo toàn nồng độ, dung môi và dạng sản phẩm khi tách tên hóa chất khỏi tên thương mại.
- Báo cáo phân tích dữ liệu thực tế theo từng nhóm rủi ro để người quản lý có cơ sở duyệt thay đổi.

#### 🐛 Sửa Lỗi Hệ Thống

- Chặn áp dụng một tên chung khi nhóm có thông tin sản phẩm không đồng nhất, tránh làm mất dữ liệu quan trọng.
- Không cho hoàn tác nếu hồ sơ đã thay đổi sau phiên chuẩn hóa và giữ nhật ký phiên ở trạng thái không thể xóa.

### v26.07.23-b17

#### 🚀 Điểm Nổi Bật Bản Này

- Nội dung hiển thị và biểu tượng trên toàn hệ thống được chuẩn hóa để dễ hiểu, nhất quán và đúng ngữ cảnh hơn.

#### ✨ Tính Năng Mới

- Biên tập lại các bản dịch máy móc thành câu chữ tự nhiên, rõ nghĩa và phù hợp với ngữ cảnh vận hành phòng thí nghiệm.
- Đồng bộ biểu tượng điều hướng và thao tác theo đúng chức năng.

#### ⚡ Cải Tiến & Tối Ưu

- Áp dụng cách viết hoa nhất quán cho menu, tiêu đề và nút chính, đồng thời giữ văn phong tự nhiên cho mô tả và hướng dẫn.
- Chuẩn hóa các thuật ngữ chuyên môn và giữ nguyên những ký hiệu quen thuộc như phương pháp, CoA, QC, GS1 và CAS.

#### 🐛 Sửa Lỗi Hệ Thống

- Thay thế các tên biểu tượng Font Awesome không hợp lệ và rà soát lại biểu tượng đang sử dụng.

### v26.07.23-b16

#### 🚀 Điểm Nổi Bật Bản Này

- Các chức năng chưa có quyền nay có thể hiển thị rõ trạng thái bị khóa, giúp người dùng biết hệ thống có tính năng và lý do chưa thể thao tác.
- Quản trị viên có thể bật hoặc tắt cách hiển thị tính năng bị khóa cho toàn hệ thống.

#### ✨ Tính Năng Mới

- Bổ sung chế độ hiển thị nút và phân hệ bị hạn chế kèm biểu tượng khóa, trạng thái mờ và hướng dẫn quyền cần có.
- Thêm công tắc trong Cấu hình chung để quản trị viên bật hoặc tắt hiển thị tính năng bị khóa.

#### ⚡ Cải Tiến & Tối Ưu

- Giữ lại tooltip gốc khi người dùng có đủ quyền, đồng thời bảo vệ nội dung biểu mẫu đang nhập khỏi bị dữ liệu đồng bộ mới ghi đè.
- Chuẩn hóa quy trình phát hành để rà soát và đồng bộ đủ các tệp version trước khi build hoặc push.

#### 🐛 Sửa Lỗi Hệ Thống

- Thu hồi an toàn các thông báo liên quan khi quản trị viên xóa tin tức, và giữ bài đăng lại để thử lại nếu mạng hoặc giao tiếp hệ thống gặp lỗi.

### v26.07.22-b10

#### 🚀 Điểm Nổi Bật Bản Này

- Sidebar thu gọn hiển thị logo và nút mở rộng cân đối, dễ nhận biết và thuận tiện hơn.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Căn giữa logo trong Sidebar thu gọn và đưa nút mở rộng thành nút nổi trên đường viền để tiết kiệm không gian.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục tình trạng logo và nút mở rộng bị ép sát về mép trái khi Sidebar ở trạng thái thu gọn.

### v26.07.22-b09

#### 🚀 Điểm Nổi Bật Bản Này

- Bảng theo dõi mẫu ngày được đưa vào Dashboard, trong khi trạng thái chọn mẫu vẫn được giữ nguyên khi xuất kết quả theo từng tiền tố.

#### ✨ Tính Năng Mới

- Cho phép bấm logo để về Dashboard, thu gọn hoặc mở rộng Sidebar và xem bảng theo dõi mẫu ngày ngay trên trang chủ.

#### ⚡ Cải Tiến & Tối Ưu

- Loại bỏ menu trùng lặp để tăng không gian làm việc trên máy tính và điện thoại.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục lỗi các mẫu thuộc tiền tố khác bị bỏ chọn sau khi xuất kết quả cho một tiền tố.

### v26.07.22-b08

#### 🚀 Điểm Nổi Bật Bản Này

- Trạng thái chọn mẫu được giữ đúng khi xuất kết quả theo từng tiền tố, không làm ảnh hưởng các mẫu thuộc tiền tố khác.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Tách dữ liệu tạm dùng để tạo báo cáo khỏi dữ liệu lưu nháp để bảo toàn trạng thái chọn mẫu trong toàn bộ mẻ.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục lỗi các mẫu ở tiền tố khác bị bỏ chọn sau khi xuất kết quả cho một tiền tố.

### v26.07.22-b07

#### 🚀 Điểm Nổi Bật Bản Này

- Điều hướng trên hệ thống gọn hơn và bảng theo dõi mẫu ngày được đưa vào Dashboard để kiểm nghiệm viên nắm tiến độ ngay khi bắt đầu ca.

#### ✨ Tính Năng Mới

- Cho phép bấm logo để trở về Dashboard và bổ sung nút thu gọn/mở rộng Sidebar riêng biệt.
- Tích hợp Bảng theo dõi mẫu ngày trực tiếp trong khu vực trung tâm của Dashboard.

#### ⚡ Cải Tiến & Tối Ưu

- Loại bỏ các mục menu trùng lặp trên Sidebar và thanh công cụ di động để tăng không gian làm việc.

#### 🐛 Sửa Lỗi Hệ Thống

- Không có thay đổi trong nhóm này.

### v26.07.22-b06

#### 🚀 Điểm Nổi Bật Bản Này

- Hộp thư thông báo được thiết kế lại rộng rãi, dễ thao tác trên máy tính, điện thoại và máy tính bảng.
- Các thông báo cần xử lý được phân loại rõ hơn để người dùng nhận biết và xử lý nhanh.

#### ✨ Tính Năng Mới

- Bổ sung tab Cần xử lý, thao tác dọn dẹp hộp thư, xem thêm lịch sử và các nút xử lý nhanh ngay trong thông báo.
- Thông báo trên điện thoại mở theo dạng trượt từ dưới lên, phù hợp thao tác một tay.

#### ⚡ Cải Tiến & Tối Ưu

- Phân biệt mức độ khẩn cấp bằng màu sắc và hiển thị rõ loại yêu cầu, trạng thái đã đọc cùng người gửi.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục số lượng thông báo chưa đọc hiển thị sai, mở sai nội dung khi bấm thông báo đẩy và mất kết nối sau khi để tab lâu.

### v26.07.22-b04

#### 🚀 Điểm Nổi Bật Bản Này

- Người dùng có thể chọn lô chất chuẩn phù hợp khi cần, trong khi hệ thống vẫn hiển thị đúng lô được khuyến nghị theo FEFO.

#### ✨ Tính Năng Mới

- Hiển thị cảnh báo mềm khi người dùng chọn lô không phải ưu tiên FEFO, kèm lô nên dùng trước và hạn sử dụng.

#### ⚡ Cải Tiến & Tối Ưu

- Giữ thứ tự FEFO và nhãn Ưu tiên trong danh sách, đồng thời giảm các lượt tải dữ liệu không cần thiết khi tạo yêu cầu hoặc cấp phát.

#### 🐛 Sửa Lỗi Hệ Thống

- Loại bỏ việc chặn cứng yêu cầu mượn hoặc cấp phát chỉ vì người dùng không chọn đúng lô FEFO đầu tiên.

### v26.07.22-b03

#### 🚀 Điểm Nổi Bật Bản Này

- Hộp thư thông báo giúp người dùng dọn dẹp, xem lịch sử dài hơn và nhận biết nhanh các việc cần xử lý.

#### ✨ Tính Năng Mới

- Bổ sung menu xóa thông báo, nút Xem thêm thông báo, phân loại việc cần xử lý và trạng thái hộp thư rỗng thân thiện.
- Chuông thông báo đổi màu khi có yêu cầu mượn chuẩn hoặc cập nhật CoA cần xử lý.

#### ⚡ Cải Tiến & Tối Ưu

- Thông báo đẩy mở thẳng đến đúng trang chi tiết; kết nối được làm mới khi tab để lâu và tên người gửi hiển thị rõ ràng.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục số lượng thông báo chưa đọc hiển thị sai và lỗi thông báo không mở đúng nội dung liên quan.

### v26.07.22-b02

#### 🚀 Điểm Nổi Bật Bản Này

- Không có thay đổi trong nhóm này.

#### ✨ Tính Năng Mới

- Không có thay đổi trong nhóm này.

#### ⚡ Cải Tiến & Tối Ưu

- Tối ưu tốc độ nạp dữ liệu và bảo vệ tiến trình lưu tự động trên hệ thống.

#### 🐛 Sửa Lỗi Hệ Thống

- Khắc phục sự cố gián đoạn kết nối khi phát thông báo đồng thời cho nhiều người dùng.

### v26.07.22-b01

#### 🚀 Điểm Nổi Bật Bản Này

- Bổ sung công cụ chuẩn hóa dữ liệu hóa chất, giúp nhận diện và nhóm hồ sơ theo mã CAS nhanh hơn.

#### ✨ Tính Năng Mới

- Tự động nhận diện và phân nhóm chất hóa học theo mã CAS.
- Bổ sung bộ lọc tìm kiếm theo trạng thái và tên thương mại.
- Tự động chuẩn hóa cách viết tên hóa chất theo dữ liệu tham chiếu chuyên ngành.

#### ⚡ Cải Tiến & Tối Ưu

- Không có thay đổi trong nhóm này.

#### 🐛 Sửa Lỗi Hệ Thống

- Không có thay đổi trong nhóm này.

