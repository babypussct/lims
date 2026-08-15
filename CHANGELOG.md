# 📢 Nhật Ký Cập Nhật — LIMS Cloud

Lịch sử phiên bản đầy đủ được hiển thị tại mục [/changelog trên ứng dụng](/changelog), với nội dung tập trung vào những thay đổi hữu ích cho công việc kiểm nghiệm.

## Phiên bản hiện tại: v26.08.15-b02

### v26.08.15-b02

#### 🚀 Tính năng nổi bật

- Tự động phân chia thông minh các đợt đồng bộ lớn để bảo đảm an toàn tuyệt đối và không gây nghẽn thao tác.
- Hiển thị thanh tiến độ thời gian thực giúp theo dõi chính xác từng giai đoạn và số lượng hồ sơ được ghi nhận.
- Bổ sung cơ chế bảo vệ và xử lý gián đoạn rõ ràng, dễ dàng tiếp tục phần còn lại chỉ với một lần bấm.

#### ✨ Tính năng mới

- Thêm thanh tiến độ trực quan trong hộp thoại Đồng bộ Mã quản lý nội bộ, hiển thị phần trăm và số lượng hồ sơ đang thực hiện.
- Bổ sung cảnh báo thông minh khi quá trình đồng bộ bị gián đoạn mạng, cho phép kiểm tra ngay các mục đã hoàn tất và quét tiếp phần còn lại.

#### ⚡ Tối ưu & cải tiến

- Gom nhóm chặt chẽ hồ sơ chất chuẩn và ngân hàng mã tương ứng để luôn được cập nhật đồng thời, tránh sai lệch trạng thái.
- Tính toán và hiển thị chính xác số đợt xử lý dự kiến ngay trên màn hình trước khi người dùng bấm xác nhận.
- Chủ động kiểm tra thay đổi đồng thời trên dữ liệu trước từng đợt ghi để ngăn chặn việc ghi đè ngoài ý muốn.

#### 🐛 Sửa lỗi

- Khắc phục tình trạng không thể thực hiện đồng bộ khi số lượng thay đổi vượt quá giới hạn an toàn.
- Đảm bảo thông tin tóm tắt và số lượng đợt đồng bộ luôn hiển thị chuẩn xác và khớp với kết quả thực tế.

### v26.08.07-b02

#### ⚡ Tối ưu & cải tiến

- Tự động điều chỉnh khoảng cách, kích thước chữ và ô tìm kiếm của Nhật Ký Cập Nhật để hiển thị rõ ràng hơn trên các cỡ màn hình khác nhau.
- Các cửa sổ chức năng và lớp phủ mở lên mượt mà và hoạt động ổn định hơn sau khi chuyển trang.

#### 🐛 Sửa lỗi

- Khắc phục lỗi màn hình xem tài liệu bị thanh điều hướng và menu che mất một phần nội dung.
- Sửa lỗi biểu tượng và đường thời gian trong Nhật Ký Cập Nhật không thẳng hàng với nội dung.
- Khắc phục sự cố khiến hệ thống không thể tự động phát hành phiên bản mới.

### v26.08.06-b03

#### 🚀 Tính năng nổi bật

- Tên phương pháp và nhãn được hiển thị rõ ràng, đầy đủ và đồng bộ hơn trên toàn hệ thống.
- Chỉ hiển thị các mã phương pháp hóa học đã được duyệt; loại bỏ các nhóm hoặc chỉ tiêu không phù hợp khỏi bộ chọn.

#### ✨ Tính năng mới

- Mỗi mã phương pháp có mô tả tiếng Việt rõ ràng trong danh mục, bộ lọc và xuất file.
- Hệ thống cho phép gắn và lưu nhiều nhãn phương pháp cùng lúc cho một chất chuẩn hoặc báo cáo.

#### ⚡ Tối ưu & cải tiến

- Thẻ nhãn đã chọn và bộ lọc hiển thị gọn hơn bằng cách kết hợp mã phương pháp và kỹ thuật phân tích, thay vì hiển thị tên quá dài.
- Vẫn có thể xem tên phép thử đầy đủ bằng cách rê chuột vào thẻ hoặc bộ lọc.
- Thẻ nhãn được tối ưu hiển thị trên màn hình nhỏ, tự động xuống dòng và không làm tràn khu vực nhập liệu.

#### 🐛 Sửa lỗi

- Đảm bảo cửa sổ xem trước tài liệu luôn hiển thị nổi lên toàn màn hình, không bị các thanh công cụ che khuất.
- Loại bỏ các thiết bị bị trùng lặp khi tạo nhãn rút gọn và sử dụng cơ chế an toàn để dự phòng.
- Bổ sung các bước kiểm tra tự động để đảm bảo nhãn luôn hiển thị ngắn gọn nhưng giữ đúng mã thiết bị.

### v26.08.06-b01

#### 🚀 Tính năng nổi bật

- Bổ sung 119 phương pháp hóa học mới: chỉ hiển thị các mã đã được duyệt, loại bỏ mục không hợp lệ khỏi bộ chọn.
- Gắn mô tả tiếng Việt chi tiết cho từng mã trong danh mục, bộ lọc và khi xuất báo cáo.

#### ✨ Tính năng mới

- Cho phép một chất chuẩn và một báo cáo được gắn cùng lúc nhiều phương pháp.

#### ⚡ Tối ưu & cải tiến

- Sắp xếp các mã phương pháp theo thứ tự tự nhiên (ví dụ: H-1.2, H-1.3, H-1.10) để dễ tra cứu.
- Hỗ trợ danh mục tĩnh dự phòng để hiển thị phương pháp trước khi người quản trị cập nhật dữ liệu chính thức.
- Giữ lại dữ liệu phương pháp cũ để đọc, nhưng chỉ cho phép gắn mới phương pháp hóa học.

#### 🐛 Sửa lỗi

- Tăng cường kiểm tra và bảo mật tên phương pháp trên hệ thống để đảm bảo tính toàn vẹn dữ liệu.
- Bổ sung tự động kiểm tra cho toàn bộ mã phương pháp, tính năng sắp xếp và lựa chọn nhiều nhãn.

### v26.08.05-b03

#### 🚀 Tính năng nổi bật

- Bổ sung 119 mã phương pháp từ danh mục VILAS 2025; chỉ bao gồm các phương pháp thử hóa học.
- Hiển thị và lọc thiết bị theo máy phân tích (GCMS, LCMSMS...) mà không làm nặng hệ thống lưu trữ.
- Hỗ trợ thao tác thêm, xóa và thay thế nhãn hàng loạt với cơ chế xác nhận an toàn.

#### ⚡ Tối ưu & cải tiến

- Đồng bộ quy trình báo trả chất chuẩn: nhân viên có thể thêm hoặc làm mới nhãn, quản lý quyết định nhãn cuối cùng.
- Quản lý tồn kho theo đơn vị: phân loại rõ (mg, ml, lọ...) và hiển thị tổng số lọ để tránh nhầm lẫn.
- Tối ưu danh mục nhãn: hỗ trợ nhãn tự tạo, giữ nguyên chữ viết hoa/thường và tương thích ngược với nhãn cũ.

#### 🐛 Sửa lỗi

- Cảnh báo rõ ràng và ngăn chặn mất dữ liệu âm thầm khi thao tác vượt giới hạn số lượng nhãn cho phép.
- Tăng cường bảo mật và kiểm tra định dạng nhãn, ngăn chặn xóa nhãn sai quy định.
- Đảm bảo dữ liệu không bị ghi đè nhầm khi nhiều người cùng thao tác cập nhật nhãn hàng loạt.

### v26.08.04-b10

#### ⚡ Tối ưu & cải tiến

- Cải thiện giao diện Giao Nhận Mẫu để cửa sổ xem tài liệu không bị thanh bên cạnh hoặc thanh công cụ che khuất.
- Khu vực chuyển trang bảng tính trên điện thoại được tối ưu: luôn hiển thị rõ, có cuộn ngang và không bị che ở mép dưới.
- Tăng cường khả năng xem PDF trên thiết bị di động; tài liệu vẫn hiển thị ngay cả khi công cụ sao chép chữ gặp sự cố.
- Lưu tạm trình xem tài liệu để mở file nhanh và ổn định hơn ngay cả khi mạng yếu hoặc bị ngắt kết nối.

### v26.08.04-b09

#### ⚡ Tối ưu & cải tiến

- Bỏ 4 thẻ số liệu tổng quan không cần thiết ở đầu trang Yêu Cầu Chất Chuẩn để giao diện gọn hơn.
- Đưa trọng tâm về danh sách yêu cầu; các bộ lọc trạng thái vẫn hiển thị ngay phía trên để dễ thao tác.
- Giữ nguyên các cải tiến về tìm kiếm, tải thêm dữ liệu và cửa sổ thao tác nổi cho danh sách dài.

### v26.08.04-b08

#### ⚡ Tối ưu & cải tiến

- Cửa sổ thao tác luôn hiển thị nổi bật ở giữa màn hình, kể cả khi đang cuộn xem danh sách rất dài.
- Bảng yêu cầu luôn hiển thị số lượng mục đang xem và nút tải thêm dữ liệu ngay tại khu vực thao tác.
- Giao diện tạo yêu cầu mới được chia thành các phần nhỏ giúp dễ theo dõi và chọn chất chuẩn hơn.
- Thanh tìm kiếm, bộ lọc và cách hiển thị danh sách được sắp xếp gọn hơn trên điện thoại.

#### 🐛 Sửa lỗi

- Sửa lỗi cửa sổ xác nhận đôi khi bị lệch vị trí, bị che khuất hoặc gây khó hiểu khi thao tác từ danh sách dài.

### v26.08.04-b07

#### ⚡ Tối ưu & cải tiến

- Tối ưu tải nhật ký cá nhân: hệ thống chỉ tải phần dữ liệu mới nhất, giúp giao diện phản hồi tức thì và cập nhật trực tiếp.
- Giới hạn số lượng hoạt động tải về ban đầu để tiết kiệm dung lượng mạng và tăng tốc ứng dụng.

#### 🐛 Sửa lỗi

- Khắc phục sự cố không tải được nhật ký do thiếu chỉ mục tìm kiếm trong cơ sở dữ liệu.

### v26.08.04-b06

#### ⚡ Tối ưu & cải tiến

- Lịch sử sử dụng chuẩn được phân trang, có nút tải thêm và vẫn giữ tính năng tìm bản ghi cũ nhất tự động.
- Lưu tạm dữ liệu danh mục phụ trợ trong 5 phút để chuyển qua lại các trang nhanh hơn, không phải tải lại.
- Thống kê lượng dữ liệu ứng dụng tải về để làm cơ sở tối ưu hóa lâu dài.

### v26.08.04-b05

#### ⚡ Tối ưu & cải tiến

- Giới hạn số lượng yêu cầu chờ và thông báo để ngăn ứng dụng tải một lượng lớn lịch sử không cần thiết.
- Tối ưu đồng bộ và khôi phục dữ liệu chuẩn giới hạn trong vòng 14 ngày khi thiết bị mất mạng lâu.
- Lưu tạm công thức phân tích để không phải tải lại mỗi khi mở lại màn hình.

### v26.08.04-b04

#### ⚡ Tối ưu & cải tiến

- Bổ sung đo lường lượng dữ liệu ứng dụng tải về theo từng hạng mục để tối ưu lâu dài.
- Tránh tải lại những dữ liệu thống kê hoặc danh sách chuẩn đã có sẵn khi làm việc liên tục.
- Hạn chế dữ liệu tự động tải từ lịch sử thông báo hệ thống và yêu cầu mua hàng.
- Theo dõi hoạt động tải dữ liệu của quá trình đồng bộ hóa, tồn kho và thao tác của người quản trị.

### v26.08.03-b01

#### 🚀 Tính năng nổi bật

- Người dùng Google mới không còn bị kẹt mãi ở thông báo yêu cầu nhập mật khẩu dù đã nhập và lưu thành công.
- Ba lớp bảo vệ chống xung đột dữ liệu đồng thời giữa hệ thống đồng bộ dữ liệu và dự đoán trước state update.

#### ⚡ Tối ưu & cải tiến

- Thêm trạng thái isSettingPassword làm guard tạm thời ngăn isPasswordSetupOpen đánh giá lại trong lúc đang lưu.
- Bảo vệ localPasswordConfigured trong đồng bộ dữ liệu: khi đã được set true, bản sao dữ liệu từ bộ nhớ tạm cũ không được ghi đè.

#### 🐛 Sửa lỗi

- Sửa lỗi hệ thống local bộ nhớ tạm bản sao dữ liệu ghi đè trạng thái localPasswordConfigured vừa xác nhận, khiến modal hiện lại.
- Sửa lỗi dùng stale firebaseUser object sau reload() khiến thông tin xác thực thiếu password phương thức đăng nhập và needsPasswordSetup() vẫn true.

### v26.08.02-b01

#### 🚀 Tính năng nổi bật

- Gửi liên kết khôi phục mật khẩu ngay từ màn hình đăng nhập, có giới hạn gửi lại.
- Quản lý liên kết Google và mật khẩu trên cùng một tài khoản, không cho xóa phương thức cuối cùng.

#### ✨ Tính năng mới

- Cho phép tạo, đổi và khôi phục mật khẩu LIMS ngay trong ứng dụng.
- Hỗ trợ liên kết hoặc hủy liên kết phương thức đăng nhập với cơ chế bảo vệ tài khoản.

#### ⚡ Tối ưu & cải tiến

- Yêu cầu xác nhận mật khẩu hiện tại trước khi đổi mật khẩu đã có.
- Bổ sung tự động điền, nhãn biểu mẫu và nút hiện/ẩn mật khẩu rõ ràng hơn.

#### 🐛 Sửa lỗi

- Ghi thời điểm thay đổi mật khẩu bằng thời gian máy chủ và không tiết lộ email có tồn tại khi khôi phục.

### v26.08.01-b08

#### 🚀 Tính năng nổi bật

- Ngay sau Google redirect thành công, dashboard tự mở form để người dùng tạo mật khẩu LIMS.
- Lưu trạng thái thiết lập ban đầu trên cùng hệ thống profile để đồng bộ khi đăng nhập Google hoặc Gmail.

#### ✨ Tính năng mới

- Tài khoản cũ đã có phương thức đăng nhập nhưng thiếu cờ hoàn tất cũng được đưa vào thiết lập ban đầu.
- Không cần vào menu Cấu hình để tìm form tạo mật khẩu.

#### ⚡ Tối ưu & cải tiến

- hệ thống Rules chỉ cho phép chính người dùng cập nhật hai trường trạng thái thiết lập ban đầu.

#### 🐛 Sửa lỗi

- Không còn bỏ qua bước thiết lập chỉ vì hệ thống thông tin xác thực đã chứa password.

### v26.08.01-b07

#### 🚀 Tính năng nổi bật

- Cho phép tạo hoặc đổi mật khẩu LIMS trực tiếp từ khu vực Cấu hình / Hồ sơ cá nhân.
- Linh hoạt cho phép hủy/đóng modal đổi mật khẩu khi tài khoản đã có mật khẩu.

#### ✨ Tính năng mới

- Bổ sung nút Thiết lập / Đổi mật khẩu trong mục Quản lý phương thức xác thực.
- Tự động hiển thị và điều khiển modal tạo/đổi mật khẩu phù hợp với loại tài khoản.

#### ⚡ Tối ưu & cải tiến

- Cập nhật giao diện Hồ sơ cá nhân với chỉ báo trạng thái phương thức xác thực rõ ràng.

### v26.08.01-b06

#### 🚀 Tính năng nổi bật

- Người dùng Google có thể thiết lập mật khẩu LIMS để đăng nhập bằng Gmail/email hoặc Google.
- Liên kết Google và mật khẩu trên cùng một hệ thống định danh người dùng, giữ nguyên hồ sơ, quyền và dữ liệu.

#### ✨ Tính năng mới

- Bổ sung màn hình thiết lập mật khẩu bắt buộc cho tài khoản Google mới.
- Cho phép tài khoản email/mật khẩu liên kết Google từ hồ sơ tài khoản.

#### ⚡ Tối ưu & cải tiến

- Hiển thị trạng thái các phương thức xác thực và hỗ trợ gửi lại email đặt lại mật khẩu.
- Thông báo redirect môi trường thử nghiệm nêu rõ nguyên nhân và hướng mở bằng trình duyệt ngoài khi cần.

#### 🐛 Sửa lỗi

- Khắc phục lỗi hệ thống gọi đường dẫn kết nối đường dẫn kết nối hệ thống 404 khi đăng nhập Google trên môi trường thử nghiệm.
- Từ chối liên kết Google khác email tài khoản hiện tại để tránh gắn nhầm người dùng.

### v26.08.01-b05

#### 🚀 Tính năng nổi bật

- Cung cấp đúng cấu hình web cho thành phần hỗ trợ đăng nhập Google trên môi trường thực tế.
- Đăng nhập chuyển hướng có đủ đường dẫn kết nối để hệ thống khởi tạo và trả kết quả xác thực.

#### ⚡ Tối ưu & cải tiến

- Cập nhật file cấu hình hệ thống dùng chung cho đường dẫn kết nối hỗ trợ đăng nhập.

#### 🐛 Sửa lỗi

- Khắc phục trường hợp đường dẫn kết nối đường dẫn kết nối hệ thống trả về 404 khi bắt đầu đăng nhập Google.

### v26.08.01-b04

#### 🚀 Tính năng nổi bật

- Đồng bộ đầy đủ các đường dẫn kết nối hỗ trợ xác thực hệ thống trên môi trường triển khai thực tế.
- Đăng nhập Google chuyển hướng hoạt động ổn định hơn trên môi trường thực tế.

#### ⚡ Tối ưu & cải tiến

- Giữ bảo vệ chống nhúng cho các màn hình chính của ứng dụng.

#### 🐛 Sửa lỗi

- Không còn trả nhầm trang ứng dụng thay cho cấu hình hệ thống khi trình duyệt khởi tạo luồng đăng nhập.

### v26.08.01-b03

#### 🚀 Tính năng nổi bật

- Đăng nhập Google ổn định hơn trên môi trường môi trường thực tế và môi trường triển khai thực tế.
- Ứng dụng vẫn được bảo vệ chống nhúng trái phép trong khi luồng xác thực hoạt động bình thường.

#### ⚡ Tối ưu & cải tiến

- Cho phép thành phần xác thực hệ thống hoạt động đúng trong quá trình đăng nhập chuyển hướng.
- Làm sạch toàn bộ lỗi kiểm tra mã nguồn còn lại ở dịch vụ thống kê và dashboard.

#### 🐛 Sửa lỗi

- Khắc phục trường hợp Google chuyển về ứng dụng nhưng không nhận được kết quả đăng nhập.

### v26.08.01-b02

#### 🚀 Tính năng nổi bật

- Đăng nhập Google ổn định hơn trên trình duyệt Safari, thiết bị di động và trình duyệt trong ứng dụng.
- Sau khi đăng nhập, hệ thống đưa người dùng trở lại đúng màn hình đang làm việc.

#### ⚡ Tối ưu & cải tiến

- Luồng đăng nhập không còn phụ thuộc vào cửa sổ bật lên.
- Quyền Google Google Drive chỉ được yêu cầu khi người dùng sử dụng tính năng Drive.

#### 🐛 Sửa lỗi

- Hiển thị thông báo và hướng dẫn rõ ràng hơn khi đăng nhập bị gián đoạn do trình duyệt, tên miền hoặc mạng.

### v26.08.01-b01

#### ⚡ Tối ưu & cải tiến

- Tự động nhận diện nếu trình duyệt (trình duyệt Safari, trình duyệt Brave) hoặc trình duyệt nhúng (ứng dụng chat) chặn cửa sổ bật lên đăng nhập Google. Khi lỗi cửa sổ bật lên-closed-by-user xảy ra dưới 2.5 giây, hệ thống chủ động chuyển sang luồng chuyển hướng (chuyển hướng).

#### 🐛 Sửa lỗi

- Xử lý lỗi không tương thích mảng tương thích định dạng dữ liệu của Map.entries() trên các trình duyệt cũ, giúp chức năng xem tài liệu PDF hoạt động ổn định và mượt mà hơn.

### v26.07.31-b01

#### 🚀 Tính năng nổi bật

- Toàn bộ phần Hiệu Suất Phân Tích (KPI, biểu đồ, so sánh trendInfo, tần suất phương pháp) chuyển sang 100% hệ thống tổng hợp sẵn.
- Đã sửa triệt để lỗi lỗi tính toán thời gian và lệch một đơn vị giúp phép so sánh giữa các tháng luôn chính xác.
- Khắc phục lỗi hệ thống truy vấn chỉ mục tìm kiếm cho phép bổ sung dữ liệu dữ liệu từ 01/01/2026 mượt mà.
- Nâng cấp bộ nhớ tạm tín hiệu trạng thái statsData.update giúp duy trì dữ liệu các tháng đã tải khi chuyển đổi bộ lọc.

### v26.07.29-b03

#### 🚀 Tính năng nổi bật

- Hệ thống nhận đúng mẫu, chỉ tiêu, nền mẫu và phương pháp phù hợp; các dòng nhập trùng được tự động bỏ qua.
- Cảnh báo rõ khi thiếu phương pháp, sai đơn vị, thiếu hóa chất, nhập số lượng không hợp lệ hoặc một mẫu bị xếp trùng.
- Kế hoạch chỉ được duyệt khi tất cả mẻ đều hợp lệ; nếu có lỗi, dữ liệu vẫn được giữ nguyên để sửa và thử lại.
- Lượng hóa chất được tính theo toàn bộ kế hoạch và kiểm tra lại ngay lúc duyệt, giúp hạn chế trừ tồn sai.
- Người thao tác chỉ nhận một thông báo; những người dùng khác nhận đúng nội dung thay đổi mới nhất.

### v26.07.29-b02

#### 🚀 Tính năng nổi bật

- Luồng nhập chất chuẩn đọc toàn bộ tệp Excel, xem trước từng dòng và lưu đồng bộ nguyên tử để không còn ghi dở dữ liệu.
- Mã quản lý được xem là mã quản lý có thể cấp lại sau khi chuẩn cũ bị xóa mềm; chuẩn mới luôn có ID lịch sử riêng.
- tệp Excel mẫu được nhận đủ 45 dòng: 44 chuẩn tạo mới và Bicozamycin/AB47 cập nhật an toàn.

#### ✨ Tính năng mới

- Modal import riêng hiển thị sheet, dòng hợp lệ, cảnh báo, xung đột, chế độ tạo mới/cập nhật và thay đổi metadata.
- Web Worker đọc XLSX ngoài luồng giao diện; kiểm tra kích thước, định dạng, header, ngày, đơn vị và tồn kho trước khi ghi.
- Restore kiểm tra mã quản lý đang được sử dụng và chặn khôi phục nếu mã đã cấp cho chuẩn hoạt động khác.

#### ⚡ Tối ưu & cải tiến

- đồng bộ gia tăng hợp nhất thay đổi tối ưu mà không hủy kết nối theo dõi của màn hình hiện tại.
- Import lại chuẩn hiện hữu chỉ cập nhật metadata an toàn, không ghi đè tồn kho, workflow hoặc nhập trùng nhật ký.
- Toast trùng được gom theo nội dung/sự kiện, giới hạn số thông báo đồng thời và duy trì thời gian hiển thị hợp lý.

#### 🐛 Sửa lỗi

- Khắc phục chỉ thấy Bicozamycin sau khi chọn tệp Excel mẫu trong phiên ứng dụng cũ.
- Khắc phục chuẩn đã xóa mềm bị nhận nhầm thành RESTORE khi mã quản lý được dùng cho chuẩn mới.
- Khắc phục Restore có thể làm hai chuẩn hoạt động cùng chiếm một mã quản lý.

### v26.07.29-b01

#### 🚀 Tính năng nổi bật

- Import Excel chạy trong Web Worker để file chứa nhiều hình sắc ký không còn khóa giao diện.
- Chỉ các sheet hoạt chất thuộc phương pháp được phân tích; hình, chart, style và dữ liệu phụ được bỏ qua.
- Mọi phương pháp nhận quy tắc tên sequence xxx_ngày_mã-mẫu, ví dụ FIPRONIL_27_U01.D ghép với U0127.

#### ✨ Tính năng mới

- Modal hiển thị tiến trình nạp file, đọc sheet, trích xuất report và ghép mẫu; hỗ trợ hủy an toàn trước khi áp dụng.
- Fallback tự động về chế độ tương thích khi Worker không khả dụng hoặc đọc toàn bộ sheet khi chưa nhận diện được tên sheet phương pháp.
- Service Worker lưu bộ nhớ tạm riêng cho bundle Excel Worker để luồng import tiếp tục dùng được khi kết nối mạng không ổn định.

#### ⚡ Tối ưu & cải tiến

- ArrayBuffer được chuyển sang Worker theo cơ chế transfer, tránh sao chép thêm file lớn trong bộ nhớ.
- Tắt đọc công thức, rich text, styles, calculation chain, VBA và raw ZIP files nhưng vẫn giữ nguyên text hiển thị của Final-Conc.
- phương pháp-01 nhận đầy đủ BLANK, SPIKE và SPIKE_N động; quy tắc ghép ngày/mã mẫu được mở rộng làm fallback chung cho phương pháp mới.

#### 🐛 Sửa lỗi

- Khắc phục giao diện có thể treo lâu khi XLSX.read chạy đồng bộ trên main thread với tệp Excel nhiều sắc ký đồ.
- Khắc phục U0127 không ghép với FIPRONIL_27_U01.D sau khi hợp nhất các module import.
- Khắc phục Pirimiphos methyl bị báo không được phân khi mẻ đang lưu ID Master Analyte lịch sử.

### v26.07.28-b06

#### 🚀 Tính năng nổi bật

- Mọi phương pháp dùng chung một modal Import Excel cho Form Check và Form Đơn, từ xem trước đến chọn và áp dụng dữ liệu.
- Alias chỉ tiêu được quản lý tại Master Analyte; hỗ trợ Etofenprox/Ethofenprox và giữ bảng alias cũ làm phương án dự phòng.
- Người dùng có thể chọn lưu tệp Excel gốc lên Google Drive với modal tiến trình và liên kết mở lại ngay trên header mẻ.

#### ✨ Tính năng mới

- Checkbox lưu tệp nguồn chỉ mã hóa và upload khi được bật; lựa chọn gần nhất được ghi nhớ theo mẻ.
- Master Analyte hỗ trợ nhập, sửa, tìm kiếm, import và export danh sách tên khác.
- Liên kết Excel gốc dùng chung cho mọi phương pháp và vẫn đọc được dữ liệu MassHunter lịch sử.

#### ⚡ Tối ưu & cải tiến

- Modal PDF mở thủ công và tự bật sau khi xuất dùng chung metadata phiên bản, người phát hành, thời gian và Google Docs.
- Command Palette hỗ trợ tìm kiếm tiếng Việt không dấu và phản hồi ngay khi nhập.
- Loại bỏ parser và handler MassHunter riêng bị trùng, giữ một luồng import chung để các phương pháp mới tự thừa hưởng.

#### 🐛 Sửa lỗi

- Giá trị Final-Conc. bằng 0 được nhập thành ND đúng theo Form Check và Form Đơn.
- PDF Form Check một mẫu chỉ in giá trị kết quả, không lặp mã mẫu trước giá trị.
- Form Check không còn cảnh báo thiếu R² vì loại form này không có trường R².
- Upload lỗi không làm thay đổi kết quả; modal được giữ lại để thử lại hoặc bỏ chọn lưu tệp.

### v26.07.28-b05

#### 🚀 Tính năng nổi bật

- Một nút Import Excel dùng chung cho Form Check, Form Đơn và các phương pháp mới.
- Modal xem trước cho phép chọn hoặc bỏ chọn từng thông tin trước khi ghi vào giao diện.
- Ghép tên mẫu linh hoạt giữa tiền tố Excel và mã mẫu trong mẻ.

#### ✨ Tính năng mới

- Chỉ nhập Final-Conc. và không đổi đơn vị; mục được chọn ghi đè, mục bỏ chọn giữ nguyên.
- ND được đánh dấu checkbox ở Form Check hoặc điền trực tiếp ở Form Đơn.
- R² và số điểm đường chuẩn chỉ nhập cho Form Đơn, giữ nguyên nồng độ danh định.
- Cho phép giữ nguyên Excel hoặc chọn từ 0 đến 6 chữ số thập phân.

#### ⚡ Tối ưu & cải tiến

- Mã mẫu chứa BL/SP vẫn được coi là mẫu thường; QC không tồn tại trên Form Check tự động bị bỏ qua.
- Chỉ lưu dữ liệu đã chọn và nhật ký import rút gọn, không giữ toàn bộ tệp Excel trên máy.

### v26.07.28-b04

#### 🚀 Tính năng nổi bật

- Tự AutoFit cột và hàng ngay khi mở tệp Excel hoặc chuyển sheet, không còn yêu cầu double-click từng tiêu đề.
- Tự tăng chiều cao và wrap nội dung dài trong giới hạn an toàn, có xử lý đúng tổng chiều rộng của ô gộp.

#### ✨ Tính năng mới

- Nút Vừa nội dung cho phép khôi phục AutoFit sau khi người dùng kéo chỉnh kích thước thủ công.

#### ⚡ Tối ưu & cải tiến

- Giới hạn chiều rộng riêng cho desktop/mobile để bảng vừa dễ đọc vừa không bị phình bởi một ô bất thường.
- Tối ưu hiệu năng bằng cách chỉ đo giá trị đại diện dài nhất của từng cột và lưu đệm kết quả đo.
- Toàn bộ AutoFit chạy cục bộ trong trình duyệt, không phát sinh dịch vụ hoặc chi phí mới.

#### 🐛 Sửa lỗi

- Khắc phục cột mặc định 96px và hàng 28px khiến nội dung bị cắt cho đến khi người dùng double-click thủ công.

### v26.07.28-b03

#### 🚀 Tính năng nổi bật

- Khắc phục lỗi Map.getOrInsertComputed khiến PDF không mở được trên Chrome/trình duyệt Safari mobile.
- Chuyển đồng bộ PDF.js viewer và worker sang legacy build chính thức có lớp tương thích Map/WeakMap.

#### ⚡ Tối ưu & cải tiến

- Giữ nguyên chế độ cuộn dọc nhiều trang, text layer chọn/copy và tìm kiếm highlight trên desktop lẫn mobile.
- Không sửa prototype thủ công, không thêm OCR/cloud và không phát sinh chi phí.

#### 🐛 Sửa lỗi

- Sửa lỗi Không thể xem trước tài liệu do trình duyệt mobile chưa hỗ trợ Map.getOrInsertComputed.

### v26.07.28-b02

#### 🚀 Tính năng nổi bật

- PDF hiển thị toàn bộ trang theo chiều dọc, tự đồng bộ số trang và render lười để tài liệu dài vẫn mượt trên desktop/mobile.
- Excel giữ cấu trúc tệp Excel, hỗ trợ chọn ô/dòng/cột/vùng, copy dạng bảng, tìm kiếm highlight và chuyển sheet như một bảng tính chỉ đọc.
- Bộ lọc/sắp xếp theo đúng tiêu đề nghiệp vụ, chỉ tác động vùng dữ liệu và luôn giữ nguyên tiêu đề cùng phần ký xác nhận.

#### ✨ Tính năng mới

- Lớp văn bản PDF cho phép tô chọn/copy, tìm toàn tài liệu, tô vàng mọi kết quả và tô cam kết quả đang tập trung.
- Excel hỗ trợ kéo chọn vùng, chọn cả dòng/cột, Ctrl/⌘ + A, Ctrl/⌘ + C, điều hướng bàn phím và thanh công thức.
- Bảng Lọc & sắp xếp riêng với điều kiện Có chứa, Bằng chính xác, Không trống và thứ tự tăng/giảm.
- Google Drive công khai tải đủ mọi trang dữ liệu, hỗ trợ hủy yêu cầu cũ và xuất Google Sheets sang XLSX.

#### ⚡ Tối ưu & cải tiến

- Modal xem tài liệu dùng tối đa diện tích, đồng bộ thanh công cụ PDF/Excel và tối ưu thao tác cảm ứng trên mobile.
- Ghi nhớ thư mục, chế độ xem, mật độ, sắp xếp và vị trí cuộn khi quay lại module Phiếu Giao Nhận Mẫu.
- PDF chỉ render các trang gần vùng nhìn; mọi xử lý PDF/Excel chạy cục bộ bằng thư viện mã nguồn mở, không phát sinh phí OCR/cloud.

#### 🐛 Sửa lỗi

- Khắc phục PDF chỉ hiển thị một trang khiến người dùng hiểu nhầm tài liệu đã kết thúc.
- Khắc phục Excel không thể chọn/copy vùng, dòng hoặc cột và giao diện khác xa cấu trúc tệp gốc.
- Khắc phục filter Excel bị kẹt, hiển thị nội dung vô nghĩa và kéo dòng trống/chữ ký vào vùng sắp xếp.
- Khắc phục tìm kiếm chỉ báo kết quả nhưng không làm nổi bật đúng nội dung vừa tìm thấy.

### v26.07.28-b01

#### 🚀 Tính năng nổi bật

- Loại bỏ Navigation Rail và đưa toàn bộ điều hướng Desktop lên Header, giúp giao diện gọn hơn và trả lại toàn bộ không gian nội dung khi đóng sidebar.
- Chuông thông báo có chế độ Header riêng; popover tự neo chính xác ngay dưới nút chuông và vẫn giữ bottom sheet trên mobile.
- Smart Batch cập nhật tồn kho tức thời sau khi bù hàng, tự kiểm tra lại mẻ và mở khóa thao tác ở Bước 2 khi đã đủ kho.

#### ✨ Tính năng mới

- Nút Trang Chủ thật trên breadcrumb Header và sidebar 256px nằm gọn dưới thanh điều hướng.
- Notification Bell 36px đồng bộ các action Header, hỗ trợ badge, trạng thái active và animation thông báo chưa đọc.

#### ⚡ Tối ưu & cải tiến

- Main content và Header dùng chung mốc sidebar 256px, chuyển trạng thái mở/đóng mượt mà và nhất quán.
- Notification popover đo vị trí nút chuông bằng bounding rectangle thay vì phụ thuộc chiều rộng navigation cố định.
- Đồng bộ bộ nhớ tạm Smart Batch với state kho ngay sau giao dịch Nhập Kho Nhanh để bảng tổng hợp phản hồi tức thời.

#### 🐛 Sửa lỗi

- Khắc phục nút thao tác Smart Batch ở Bước 2 vẫn bị khóa sau khi người dùng đã bù đủ tồn kho.
- Khắc phục cảnh báo thiếu hàng và trạng thái mẻ cập nhật chậm trong thời gian chờ hệ thống kết nối theo dõi.

### v26.07.27-b04

#### 🚀 Tính năng nổi bật

- Thanh điều hướng Desktop mới (App Header): Breadcrumbs động, Tìm kiếm/Quét mã nhanh (Ctrl+K), Badge Online/Offline, Dark Mode toggle và Profile Pill.
- Nâng cấp Sidebar Navigation: Xóa nút floating toggle, thêm tooltip hover, active indicator phát sáng và Glassmorphism Rail.
- Tối ưu Mobile: Active tab pill rõ ràng hơn và đồng bộ tiêu đề trang với Desktop Header.

#### ✨ Tính năng mới

- Tạo component AppHeaderComponent hoàn toàn mới: Breadcrumbs, Search (⌘K), Online/Offline status, Dark Mode, Notification Bell, Profile dropdown.
- Bản đồ ROUTE_TITLES & ROUTE_ICONS dùng chung cho toàn hệ thống (25+ routes).
- Nút thu gọn sidebar tích hợp tại header Navigation Panel thay cho nút floating cũ.

#### ⚡ Tối ưu & cải tiến

- Tooltip popover cho mỗi shortcut icon khi Rail thu gọn, giúp nhận biết tính năng mà không cần đoán icon.
- Active pill indicator với glow effect trên Navigation Rail và Panel.
- Nâng cấp nền Rail sang backdrop-blur-xl glassmorphism tạo chiều sâu hiện đại.
- Bottom Nav active indicator chuyển từ chấm tròn sang pill ngang (w-4) rõ ràng hơn.

### v26.07.27-b03

#### 🚀 Tính năng nổi bật

- Xem trực tiếp file PDF báo cáo kết quả phân tích mượt mà trên giao diện, tự động hỗ trợ xác thực lại Google Google Drive khi hết hạn.
- Cập nhật ngay báo cáo tương ứng khi chuyển đổi bộ lọc nhóm mẫu hoặc chọn phiếu báo cáo.
- Khóa tự động chế độ Chỉ Xem cho các mẻ phân tích đã hoàn tất để bảo vệ dữ liệu và mở mặc định ở màn hình xem báo cáo.

#### ✨ Tính năng mới

- Xem báo cáo PDF trực tiếp & mượt mà với cơ chế nạp Blob và tự động thu hồi bộ nhớ sau khi đóng panel.
- Rà soát tự động trước khi xuất báo cáo (chữ ký, kết quả ND/số liệu, R²) và hỗ trợ xem/khôi phục 5 phiên bản báo cáo.
- Hiển thị lượng chất chuẩn với 2 chữ số thập phân chuẩn GLP (12.50 g), hỗ trợ nhập bù nhật ký & nút chọn nhanh Tối đa.

#### ⚡ Tối ưu & cải tiến

- Tối ưu bộ nhớ máy tính phòng thí nghiệm bằng cách giải phóng dữ liệu blob PDF khi người dùng chuyển trang hoặc đóng tab.
- Mẻ phân tích đã duyệt mở mặc định ở màn hình xem báo cáo PDF, giữ lối chỉnh sửa chủ động qua nút Chỉnh sửa.

#### 🐛 Sửa lỗi

- Khắc phục hiển thị sai nhãn tiền tố report và xử lý triệt để liên kết báo cáo khi xem mẻ phân tích theo từng nhóm mẫu.

### v26.07.27-b02

#### 🚀 Tính năng nổi bật

- Thêm bước kiểm tra trước khi tạo báo cáo PDF để phát hiện thiếu mẫu, thiếu ngày ký, thiếu kết quả/ND và cảnh báo mẫu đã từng in.
- Lưu lịch sử publish/restore đầy đủ hơn theo report ID, prefix, danh sách mẫu và backup dữ liệu nhập liệu.
- Tách mặc định mẻ hoàn tất sang màn xem báo cáo, đồng thời giữ lối chỉnh sửa chủ động bằng edit=1.

#### ✨ Tính năng mới

- Modal preflight hiển thị blockers, warnings, thông tin phạm vi in và các phiếu dự kiến khi chia report.
- Timeline phiên bản trong panel Các Báo Cáo với nút mở PDF/Google Docs từng bản.
- Module preflight riêng kèm test tự động cho chia phiếu, ND type3b, thiếu dữ liệu và cảnh báo mẫu đã publish.

#### ⚡ Tối ưu & cải tiến

- chỉ đọc được truyền sâu xuống các phương pháp Results và khóa native control cho phương pháp-01, phương pháp-03, Chloroform, Default Type2 và Type3B.
- Restore version dò theo reportId/prefix/bản chung để tránh nhầm phiếu khi cùng version có nhiều report.
- Màn xem chi tiết kết quả hiển thị nhãn report theo prefix thật thay vì key/timestamp kỹ thuật.

#### 🐛 Sửa lỗi

- Chặn các thao tác có side-effect trong phương pháp-01 khi mẻ chỉ đọc hoặc đang xử lý, gồm import MassHunter, điền nhanh, copy dòng và đổi chọn mẫu.
- Pending guard cảnh báo cả khi autosave đang saving hoặc lỗi, không chỉ khi modified.
- Tiếp tục đồng bộ định dạng 2 chữ số thập phân cho module Chất Chuẩn và Yêu Cầu Chất Chuẩn.

### v26.07.27-b01

#### 🚀 Tính năng nổi bật

- Quy chuẩn tự động hiển thị các giá trị định lượng chất chuẩn với đúng 2 chữ số thập phân cố định (12.50, 10.00).
- Giữ nguyên độ chính xác tính toán tồn kho bằng cách phân tách dữ liệu lưu trữ float gốc và lớp hiển thị.
- Đồng bộ hiển thị 2 chữ số thập phân trên toàn bộ module Chất Chuẩn và trang Yêu Cầu Chất Chuẩn (/standard-requests).

#### ✨ Tính năng mới

- Nâng cấp hàm formatNum hỗ trợ quy chuẩn định dạng 2 chữ số thập phân linh hoạt (Phương án A).
- Đồng bộ chuẩn hóa hiển thị tồn kho và lượng sử dụng trên Bảng Yêu cầu, Card Kanban, Action Modals và Create Request Drawer.

#### ⚡ Tối ưu & cải tiến

- Giao diện gióng hàng các con số đẹp mắt, chuyên nghiệp theo chuẩn GLP.
- Loại bỏ hoàn toàn các binding hiển thị số lẻ trực tiếp trên UI.

### v26.07.25-b01

#### 🚀 Tính năng nổi bật

- Cho phép Quản lý nhập bù nhật ký sử dụng chất chuẩn trong quá khứ cho nhân viên.
- Bổ sung nút "Tối đa" tự động điền toàn bộ lượng tồn kho còn lại của lọ chuẩn.
- Tự động tích chọn và cập nhật trạng thái Hết Hàng khi dùng hết chuẩn.

#### ✨ Tính năng mới

- Nút "Nhập bù nhật ký" dành cho Quản lý trong danh sách chất chuẩn.
- Nút "Tối đa" và tùy chọn "Đánh dấu chuẩn đã sử dụng hết" trong cửa sổ nhập bù.

#### ⚡ Tối ưu & cải tiến

- Cho phép nhập bù hồi ký ngay cả khi lọ chuẩn đang được mượn.
- Thẻ chọn nhanh mục đích sử dụng giúp thao tác nhanh và đồng bộ.

#### 🐛 Sửa lỗi

- Xử lý tương thích định dạng kiểu dữ liệu trong khung nhập số lượng tối đa.

### v26.07.24-b25

#### 🚀 Tính năng nổi bật

- Sắp xếp mã mẫu thực hiện logic hơn (tiền tố hiển thị trước).
- Tải nhật ký hoạt động trên Dashboard đúng phân quyền của người dùng.

#### ✨ Tính năng mới

- Bổ sung bảng Nhật ký hoạt động gần đây phù hợp với từng vai trò.
- Tối ưu giao diện Daily Checklist gọn nhẹ trên thiết bị di động.

#### ⚡ Tối ưu & cải tiến

- Loại bỏ mã QR không cần thiết trong bản in Daily Checklist để tăng tốc độ in.
- Sắp xếp danh sách mẫu có tiền tố rõ ràng.

#### 🐛 Sửa lỗi

- Sửa lỗi trắng dữ liệu nhật ký khi mở Dashboard lần đầu.

### v26.07.24-b02

#### 🚀 Tính năng nổi bật

- Trạm Pha Chế cho phép toàn bộ nhân viên truy cập để sử dụng công cụ tính toán (Sandbox). Chế độ thực vẫn bảo vệ kho.
- Đồng bộ tiếng Việt các thông báo phân quyền trên toàn hệ thống.
- Bộ đếm ngược tự động thông minh 30s khi có phiên bản mới, tự tạm dừng khi rời máy và tiếp tục khi có tương tác.

#### ✨ Tính năng mới

- Trạm Pha Chế khả dụng cho mọi nhân viên ở chế độ Sandbox.
- Bổ sung nút "Nhật ký phiên bản" cố định ở Footer và Dashboard để tra cứu 24/7.

#### ⚡ Tối ưu & cải tiến

- Chuẩn hóa thông báo lỗi phân quyền tiếng Việt thân thiện.
- cửa sổ bật lên cập nhật tự động dừng đếm ngược khi người dùng không di chuột/chạm màn hình.

#### 🐛 Sửa lỗi

- Khắc phục hiển thị sai tên quyền nội bộ trong thông báo toast.
- Tối ưu Service Worker caching cho tệp xác minh Google.

### v26.07.23-b24

#### 🚀 Tính năng nổi bật

- Đảm bảo lưu mẻ phân tích ổn định ngay cả khi thiếu mã tham chiếu phụ.
- Tự động làm sạch dữ liệu trước khi gửi ghi log lên hệ thống.

#### ✨ Tính năng mới

- Nâng cấp luồng ghi log phê duyệt và sửa mẻ.

#### 🐛 Sửa lỗi

- Sửa lỗi hệ thống báo undefined khi phương pháp thiếu thông tin phụ.
- Cập nhật đúng phiếu in sau khi sửa đổi mẻ.

### v26.07.23-b23

#### 🚀 Tính năng nổi bật

- Tối ưu lazy-loading cho các thư viện nặng giúp app khởi động nhanh hơn 40%.
- Đưa SmartBatch làm luồng lập mẻ phân tích chính.

#### ✨ Tính năng mới

- Thêm nút "Tính nhanh phương pháp" trực tiếp bên trong màn hình SmartBatch.
- Tối ưu hóa các bảng lưu trữ hóa chất, chất chuẩn và báo cáo.

#### ⚡ Tối ưu & cải tiến

- Ẩn Calculator khỏi thanh menu chính để đơn giản hóa giao diện navigation.

