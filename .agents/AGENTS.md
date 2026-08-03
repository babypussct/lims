# Quy Trình Chuẩn Bị Deploy

Khi người dùng yêu cầu "chuẩn bị deploy", "deploy", "commit" hoặc "cập nhật changelog", thực hiện tự động:

1. Phân tích tất cả thay đổi trong session hiện tại.
2. Viết hoặc cập nhật `release-notes.json` với nội dung phù hợp.
3. Chạy `npm run sync-version`.
4. Chạy `npm run validate:release-notes`.
5. Báo cáo kết quả cho người dùng.

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
