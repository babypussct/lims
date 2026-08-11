# Checklist triển khai mã quản lý nội bộ tái cấp

## Phạm vi nghiệp vụ

- [x] `internal_id` là mã nghiệp vụ duy nhất của phòng.
- [x] Mã hợp lệ có đúng 4 ký tự, bắt đầu bằng `A`, `B` hoặc `C`.
- [x] Không tạo thêm mã nghiệp vụ thứ hai cho người dùng.
- [x] Một mã chỉ có một chuẩn vật lý đang sở hữu tại một thời điểm.
- [x] Sau khi chuẩn vật lý cũ được đóng vòng đời, mã được trả về ngân hàng và có thể cấp lại.
- [x] Khi thêm chuẩn mới dùng mã thuộc hồ sơ đã hết HSD và không còn mượn/giữ mở, transaction tự đóng hồ sơ cũ và cấp mã cho hồ sơ mới.
- [x] Chuẩn vật lý cũ và mới giữ hồ sơ, tồn kho, request, nhật ký và QR độc lập.

## Luồng ghi mới

- [x] Form thêm/cập nhật kiểm tra chặt định dạng `internal_id`.
- [x] Thêm chuẩn mới khóa việc chiếm mã đang được cấp.
- [x] Cập nhật chuẩn hiện hữu không được âm thầm đổi mã đang hoạt động.
- [x] Import chuẩn áp dụng cùng quy tắc mã và tái cấp.
- [x] Request mượn lưu snapshot `internal_id` tại thời điểm tạo.
- [x] Usage log và QR tiếp tục trỏ đúng bản ghi vật lý, không trỏ theo mã tái cấp.

## Trả mã và tái cấp

- [x] Có thao tác đóng vòng đời và trả `internal_id` về ngân hàng.
- [x] Không trả mã khi chuẩn còn request, người giữ hoặc thao tác đang mở.
- [x] Registry kỹ thuật chỉ bảo vệ quyền sở hữu hiện tại của mã; không phải mã nghiệp vụ thứ hai.
- [x] Chuẩn mới nhận cùng mã nhưng nhận bản ghi vật lý mới.
- [x] Mã đã trả không còn là lựa chọn mượn/cấp hiện tại.

## Công cụ đồng bộ dữ liệu cũ

- [x] Quét toàn bộ `reference_standards` và phân loại thiếu/sai/chuẩn hóa được/trùng mã.
- [x] Đối chiếu `standard_requests`, `purchase_requests` và `standard_usages` với chuẩn vật lý được tham chiếu.
- [x] Chỉ tự sửa thay đổi an toàn: trim/uppercase hợp lệ, snapshot còn thiếu, `search_key`.
- [x] Không tự đoán mã đúng cho dữ liệu thiếu hoặc sai định dạng.
- [x] Cho phép người quản lý nhập mã sửa thủ công sau khi xem tên/lot/hạn dùng.
- [x] Dùng dry-run trước khi ghi.
- [x] Ghi batch thay đổi trước/sau và audit log.
- [x] Có báo cáo xung đột để xử lý thủ công trước khi tái cấp.

## Kiểm soát dữ liệu và kiểm thử

- [x] Firestore Rules kiểm soát định dạng mã, registry, request snapshot và log snapshot.
- [x] Regression test cho mã hợp lệ/không hợp lệ/chuẩn hóa/trùng vòng đời.
- [x] Regression test khóa vòng lặp tự quét khi modal đổi trạng thái `isScanning`/`isApplying`.
- [ ] Regression test cho add/release/reuse và lịch sử không bị trộn.
- [ ] Regression test cho đồng bộ dry-run/apply/idempotency/conflict.
- [x] Chạy typecheck, test standards, rules emulator và build.
- [ ] Xác minh production audit sau khi có phiên đăng nhập/quyền được phê duyệt.

## Ghi chú vận hành

- `ReferenceStandard.id` tiếp tục là khóa kỹ thuật của bản ghi vật lý hiện tại.
- `internal_id` là mã duy nhất người dùng nhìn thấy và có thể được cấp lại theo thời gian.
- Không được ghi đè bản ghi chuẩn cũ để tạo chuẩn vật lý mới.

## Trạng thái kiểm chứng (2026-08-11)

- [x] Đã triển khai quy tắc duy nhất `internal_id`: chuẩn hóa trim/uppercase, đúng 4 ký tự, bắt đầu bằng `A`, `B` hoặc `C`.
- [x] Đã triển khai registry nội bộ để khóa quyền sở hữu hiện tại; registry không phải mã thứ hai cho người dùng.
- [x] Đã triển khai trả mã thủ công và tái cấp an toàn; tự tái cấp chỉ khi hồ sơ cũ hết HSD và không còn holder/request/workflow mở.
- [x] Đã triển khai công cụ dry-run/apply đồng bộ dữ liệu cũ cho `reference_standards`, `standard_requests`, `purchase_requests`, `standard_usages` và log lồng.
- [x] Đã thêm batch audit trước/sau, xử lý xung đột, nhập sửa thủ công có kiểm tra và không đoán mã cho bản ghi thiếu/sai.
- [x] `npm run test:standards`: **102/102**; `npm run test:firestore-rules`: **18/18**; `git diff --check`: không có whitespace error.
- [x] Typecheck/build production: `npm.cmd run build` pass, gồm validate release notes và Angular production build.
- [ ] Production audit: chưa chạy trên dữ liệu production vì chưa có phiên đăng nhập/quyền được phê duyệt; không suy đoán số lượng mã hiện có từ fixture hoặc cache.

## Sự cố modal đồng bộ (2026-08-11)

- [x] Xác định nguyên nhân: `effect()` theo dõi gián tiếp các signal bận vì gọi `scan()` trực tiếp trong reactive context; khi scan kết thúc, effect tự khởi động lại.
- [x] Dùng `untracked()` cho lời gọi tự quét; effect chỉ còn phụ thuộc vào trạng thái mở modal.
- [x] Thêm regression test kiểm tra lời gọi scan nằm ngoài dependency tracking của effect.
- [ ] Xác minh trực tiếp trên dữ liệu production sau khi có phiên đăng nhập/quyền `standard_edit` được phê duyệt.

## Cập nhật modal lọc cảnh báo và ngoại lệ SDHET (2026-08-11)

- [x] Modal có bộ lọc chọn được theo nhóm: cần nhập mã, thay đổi an toàn, trùng mã, registry và tham chiếu; có tìm kiếm để xử lý từng nhóm.
- [x] Cảnh báo có trường chi tiết vấn đề và gợi ý xử lý; các thay đổi an toàn hiển thị lý do before/after.
- [x] `SDHET` được coi là mã nghiệp vụ riêng hợp lệ, không phát cảnh báo sai định dạng; các kiểm tra trùng chủ sở hữu/registry/snapshot vẫn được giữ.
- [x] Regression bao phủ mã `SDHET`, filter modal, nội dung cảnh báo chi tiết và Rules.
- [x] Chạy test/build cục bộ: `test:standards` 104/104, Rules emulator 19/19 và production build pass.
- [ ] Xác minh UI có xác thực trên dữ liệu thật; để mở nếu chưa có phiên/quyền được phê duyệt.
