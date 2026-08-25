# Quy Trình Chuẩn Bị Deploy

Khi người dùng yêu cầu "chuẩn bị deploy", "deploy", "commit" hoặc "cập nhật changelog", thực hiện tự động:

1. Phân tích tất cả thay đổi trong session hiện tại.
2. Viết hoặc cập nhật `release-notes.json` với nội dung phù hợp.
3. Chạy `npm run release:prepare` khi đây là một release mới cần tăng version.
4. Chạy `npm run release:verify` và chỉ tiếp tục khi gate đạt.
5. Review diff, commit release, rồi chạy `npm run release:prepush` trên working tree sạch.
6. Push commit lên `main`.
7. Với frontend, dừng quy trình deploy thủ công tại đây: Vercel Git Integration tự động build và deploy production từ commit vừa push lên GitHub.
8. Theo dõi deployment gắn với đúng Git SHA và smoke test production khi deployment chuyển sang trạng thái sẵn sàng.
9. Chỉ chạy `npm run deploy:prod` hoặc Vercel CLI khi người dùng yêu cầu deploy thủ công/fallback một cách rõ ràng; đây không phải bước của quy trình frontend chuẩn.

`npm run release:predeploy` vẫn có thể được dùng bởi các tác vụ hạ tầng cần gate sau push, ví dụ `npm run deploy:rules`. Không chạy `release:predeploy` chỉ để chuẩn bị một frontend deployment mà Vercel đã tự tạo từ GitHub.

Không chỉnh sửa thủ công `ngsw-config.json`, `metadata.json` hoặc phiên bản trong `state.service.ts`; các file này được đồng bộ bởi script.

## Nguyên Tắc Ngôn Ngữ Changelog

Changelog dành cho kiểm nghiệm viên, quản lý phòng thí nghiệm và người sử dụng LIMS hằng ngày; không viết như tài liệu kỹ thuật cho lập trình viên.

### Cách viết bắt buộc

- Viết bằng tiếng Việt tự nhiên, ngắn gọn và tập trung vào lợi ích trong công việc.
- Trả lời được câu hỏi: người dùng làm được gì nhanh hơn, dễ hơn hoặc an toàn hơn sau thay đổi này?
- Dùng tên quen thuộc trên giao diện và trong nghiệp vụ: Kho, Mẫu, Mẻ phân tích, SOP, Chất chuẩn, Kết quả, Báo cáo, Cấu hình.
- Khi cần hướng dẫn, nêu đường dẫn và thao tác cụ thể, ví dụ: `Cấu hình → Quản lý người dùng → Phân quyền`.
- Mỗi ý nên là một câu dễ đọc; ưu tiên động từ hành động và kết quả quan sát được.
- Tiêu đề nên mô tả kết quả đối với người dùng, không mô tả tên module kỹ thuật.

### Những điều không đưa vào changelog người dùng

Không dùng hoặc không giải thích bằng các thuật ngữ nội bộ như Firestore, Service Worker, API, signal, cursor, cache, bundle, migration, script, commit, branch, validator, schema, function, file path hay tên biến.

Không ghi chi tiết triển khai, tên file, tên hàm, cấu trúc dữ liệu, số lần đọc cơ sở dữ liệu hoặc quy trình phát hành nội bộ. Nếu một thay đổi kỹ thuật có ích cho người dùng, chỉ viết kết quả thực tế mà họ nhận được.

Ví dụ:

- Không viết: `Chuyển onSnapshot sang DeltaSync cursor-based.`
- Nên viết: `Mở Kho và SOP nhanh hơn vì hệ thống chỉ tải phần dữ liệu mới thay đổi.`

### Quy ước theo từng mục

- `title`: một tiêu đề rõ nghĩa, thân thiện, không chứa tên công nghệ nội bộ.
- `highlights`: 1–3 lợi ích nổi bật nhất đối với công việc kiểm nghiệm.
- `features`: tính năng mới mà người dùng có thể sử dụng trực tiếp.
- `improvements`: thao tác, tốc độ, độ rõ ràng hoặc độ an toàn được cải thiện.
- `fixes`: lỗi người dùng từng gặp và kết quả sau khi khắc phục; không mô tả nguyên nhân bằng mã nguồn.

Trước khi hoàn tất, đọc lại như một kiểm nghiệm viên chưa xem code: nếu người đó không hiểu thay đổi giúp ích gì hoặc cần bấm ở đâu, phải viết lại cho đến khi rõ ràng.

## Kiểm Tra Web Thực Tế Có Đăng Nhập

Khi cần mở ứng dụng thực tế để kiểm tra và màn hình yêu cầu đăng nhập:

1. Ưu tiên tái sử dụng phiên đăng nhập hiện có nếu vẫn còn hợp lệ.
2. Nếu cần đăng nhập lại, sử dụng luồng **Đăng nhập quản trị** / đăng nhập bằng mật khẩu LIMS.
3. Tự động lấy thông tin xác thực từ file cục bộ `.env.test.local` ở thư mục gốc repository:
   - `LIMS_TEST_ADMIN_USERNAME`
   - `LIMS_TEST_ADMIN_PASSWORD`
4. Không hỏi người dùng cung cấp lại thông tin đăng nhập nếu hai biến trên đã tồn tại.
5. Không in, chép lại hoặc đưa mật khẩu vào nội dung trả lời, log, ảnh chụp, tài liệu, commit hay file được Git theo dõi.
6. Khi thao tác với terminal, không dùng lệnh làm lộ giá trị bí mật ra stdout/stderr. Chỉ đọc bí mật để phục vụ bước đăng nhập.
7. Nếu lần đăng nhập đầu không thành công, kiểm tra đúng chế độ đăng nhập bằng username/mật khẩu, trạng thái trang và lỗi giao diện rồi thử lại hợp lý trước khi kết luận không thể kiểm tra.

File `.env.test.local` là dữ liệu máy cục bộ và phải tiếp tục nằm ngoài Git.
