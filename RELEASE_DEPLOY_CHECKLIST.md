# Checklist tổng kết và phát hành `v26.08.11-b01` trên `main`

> Mục tiêu: tổng hợp toàn bộ thay đổi đang có trên `main`, kiểm chứng các gate phát hành, đồng bộ version/changelog, triển khai theo `DEPLOYMENT.md`, rồi commit và push toàn bộ phạm vi đã xác nhận.

## 1. Snapshot trước phát hành

- [x] Checkout đang ở `main`.
- [x] `HEAD` trước phát hành: `030cedb` (`fix(inventory): remove chemical expiry workflow`).
- [x] `HEAD` và `origin/main` trước phát hành đồng bộ, chưa có commit local phía trước remote.
- [x] Đã kiểm tra dirty worktree trước khi chỉnh sửa; giữ nguyên các thay đổi có sẵn của người dùng.
- [x] Phạm vi hiện tại gồm thay đổi tracked ở Firestore Rules, trạng thái/đọc dữ liệu, Chất chuẩn, Trạm Pha Chế, cấu hình môi trường và test; cùng các file mới về checklist, engine tính và đồng bộ Mã quản lý nội bộ.

## 2. Phạm vi thay đổi đã tổng hợp

### Trạm Pha Chế — helper mô phỏng độc lập

- [x] Tách route thành helper mô phỏng, không liên kết Kho, Chất chuẩn, tồn kho, yêu cầu mượn hoặc giao dịch ghi dữ liệu.
- [x] Bổ sung engine thuần và test cho pha dung dịch, pha loãng, thêm chuẩn, dãy chuẩn, pha hỗn hợp và xử lý mẫu.
- [x] Giữ các thao tác sao chép, in, xuất và reset ở phạm vi cục bộ trên trình duyệt.

### Chất chuẩn — Mã quản lý nội bộ và vòng đời hồ sơ

- [x] Chuẩn hóa và kiểm tra Mã quản lý nội bộ 4 ký tự, bắt đầu bằng `A`, `B` hoặc `C`.
- [x] Bảo vệ quyền sở hữu mã hiện tại, không cho sửa trực tiếp mã đang hoạt động hoặc cấp trùng.
- [x] Bổ sung trả mã có lý do, tái cấp có điều kiện và giữ hồ sơ vật lý cũ độc lập với hồ sơ mới.
- [x] Lưu snapshot mã trong yêu cầu mượn, nhật ký sử dụng, nhãn và các luồng nhập/xuất liên quan.
- [x] Bổ sung công cụ quét, dry-run, nhập sửa thủ công, áp dụng có xác nhận và audit before/after cho dữ liệu cũ.

### Bảo mật, độ tin cậy và chi phí đọc

- [x] Siết Firestore Rules cho mã, registry, snapshot lịch sử và các giao dịch vòng đời liên quan.
- [x] Bổ sung regression emulator cho trường hợp cố ý đổi chủ sở hữu mã và giao dịch tái cấp hợp lệ.
- [x] Bounded/paginated các luồng lịch sử theo khoảng ngày; hiển thị rõ giới hạn 300 mẻ gần nhất khi chưa chọn ngày.
- [x] Lazy-load dữ liệu Chất chuẩn/yêu cầu trong Thống kê theo tab hoặc thao tác thực tế.
- [x] Gom đọc `results_details` theo batch tối đa 30 mã và ghi nhận metric đọc.
- [x] Loại bỏ đường tải Firebase Storage không còn dùng; giữ ước lượng dữ liệu Firestore với tên gọi đúng nghĩa.

## 3. Kiểm chứng trước release

- [x] `npm.cmd test` — pass; 100 + 3 + 13 + 4 + 13 + 33 + 18 + 11 + 65 test pass, 0 fail.
- [x] `npx.cmd tsc -p tsconfig.app.json --noEmit --pretty false` — pass.
- [x] `npm.cmd run typecheck:api` — pass.
- [x] `git diff --check` — pass.
- [x] `npm.cmd ci` — pass; cài lại 1.955 package. npm báo 67 vulnerability hiện hữu, chưa tự động sửa trong release này.
- [x] `npm.cmd run build` — pass; tạo `dist/lims-cloud-pro/browser` và `ngsw.json` mang version `v26.08.11-b01`.
- [x] Kiểm tra lại trạng thái emulator và port `8080` sau gate rules — `PORT_8080_FREE`.

## 4. Đồng bộ version/changelog

- [x] Cập nhật `release-notes.json` bằng tiếng Việt hướng tới kiểm nghiệm viên/người dùng.
- [x] Chạy `npm.cmd run sync-version` — phát sinh `v26.08.11-b01`.
- [x] Chạy `npm.cmd run validate:release-notes` — pass.
- [x] Đọc lại diff version; package, app data, metadata và version hiển thị đều là `v26.08.11-b01`.

## 5. Triển khai production theo `DEPLOYMENT.md`

- [ ] Firebase CLI đã đăng nhập project `lims-cloud-by-otada` — đang mở: `projects:list` báo chưa đăng nhập; không có `FIREBASE_SERVICE_ACCOUNT`, ADC hoặc `LIMS_APP_ID` trong môi trường. Lệnh `firebase login --no-localhost` đã tạo phiên tạm, nhưng trình duyệt bị chặn tại trang xác thực.
- [ ] Deploy Firestore Rules trước frontend — chưa chạy vì gate Firebase authentication chưa đạt:
      `npx.cmd firebase-tools deploy --only firestore:rules --project lims-cloud-by-otada`
- [x] Vercel CLI đã đăng nhập với tài khoản `babypussct`.
- [ ] Deploy Vercel production sau khi Rules thành công — đang giữ theo đúng thứ tự rollout:
      `npx.cmd vercel --prod`
- [ ] Smoke test Daily Checklist, fallback request, quyền `batch_run` và các luồng Chất chuẩn/Trạm Pha Chế.
- [ ] Chỉ chạy backfill khi có credential hợp lệ và đã đạt smoke test hotfix:
      `npm.cmd run backfill:daily-checklists -- --app-id=lims-cloud-fixed`
- [ ] Xác minh độc lập sau backfill:
      `npm.cmd run verify:daily-checklists -- --app-id=lims-cloud-fixed`
- [ ] Gỡ biến môi trường credential tạm thời sau khi hoàn tất.

## 6. Tích hợp Git

- [ ] Review `git diff` và `git status` lần cuối; không có secret hoặc artifact ngoài phạm vi.
- [ ] Stage toàn bộ thay đổi đã xác nhận.
- [ ] Commit release trên `main`.
- [ ] Push `main` lên `origin`.
- [ ] Xác nhận `HEAD`, `origin/main`, worktree sạch và ghi lại mã commit/deployment.

## 7. Bằng chứng và giới hạn kết luận

- Test emulator chứng minh Rules và giao dịch tương quan ở môi trường local; không thay thế production smoke test.
- Chưa coi deploy/backfill là thành công nếu CLI chưa trả exit code `0` và chưa có output xác nhận.
- Không ghi credential, token hoặc dữ liệu production vào checklist, changelog, commit hay log phát hành.
