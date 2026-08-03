# Quy Trình Chuẩn Bị Deploy

Khi người dùng yêu cầu "chuẩn bị deploy", "deploy", "commit" hoặc "cập nhật changelog", thực hiện tự động:

1. Phân tích tất cả thay đổi trong session hiện tại.
2. Viết hoặc cập nhật `release-notes.json` với nội dung phù hợp.
3. Chạy `npm run sync-version`.
4. Chạy `npm run validate:release-notes`.
5. Báo cáo kết quả cho người dùng.

Không chỉnh sửa thủ công `ngsw-config.json`, `metadata.json` hoặc phiên bản trong `state.service.ts`; các file này được đồng bộ bởi script.
