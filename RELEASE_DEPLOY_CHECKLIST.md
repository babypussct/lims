# Checklist tổng kết và phát hành `v26.08.11-b03` trên `main`

> **Hồ sơ lịch sử, không phải quy trình hiện hành.** Bản này từng deploy thủ công trước khi project `nafiqpm6` áp dụng Git Integration + Deployment Check. Mọi release mới phải theo `DEPLOYMENT.md`; không lặp lại lệnh Vercel CLI được ghi trong bằng chứng bên dưới.

> Mục tiêu: tổng hợp toàn bộ thay đổi đang có trên `main`, kiểm chứng gate phát hành, đồng bộ version/changelog, triển khai đúng `DEPLOYMENT.md`, rồi commit và push toàn bộ phạm vi đã xác nhận.
> Phạm vi business/runtime chưa nghiệm thu được giữ mở; phát hành kỹ thuật không tự biến thành nghiệm thu nghiệp vụ.

## 1. Snapshot trước phát hành

- [x] Checkout đang ở `main`.
- [x] `HEAD` trước phát hành: `40b21e2` (`docs(release): close v26.08.11-b02 checklist`).
- [x] `HEAD` và `origin/main` trước phát hành đồng bộ, chưa có commit local phía trước remote.
- [x] Dirty worktree đã được kiểm tra; phạm vi gồm thay đổi Trạm Pha Chế, vòng đời Mã quản lý nội bộ, hỗ trợ SDHET, cảnh báo rà soát và Firestore Rules.
- [x] Không phát hiện credential hoặc artifact build cần đưa vào commit.

## 2. Tổng kết thay đổi

### Trạm Pha Chế

- [x] Chuẩn hoá UI theo công việc KNV, loại bỏ mô tả kỹ thuật về phạm vi cục bộ khỏi giao diện.
- [x] Bổ sung ppm, ppb và ppt theo đúng cơ sở `/L` hoặc `/kg` của bối cảnh mẫu.
- [x] Ưu tiên đơn vị thao tác µL (uL), mL, mg và g; tự sửa lựa chọn khi đổi giữa khối lượng và thể tích.
- [x] Giữ hỗ trợ mẫu rắn/lỏng, spike, nhiều chuẩn trung gian, nội chuẩn/surrogate và quy đổi chuỗi xử lý mẫu.
- [x] Bổ sung regression cho engine và boundary UI.

### Mã quản lý nội bộ và Chất chuẩn

- [x] Chấp nhận mã nghiệp vụ riêng `SDHET` trong biểu mẫu, import, engine đồng bộ và Rules.
- [x] Bổ sung chi tiết vấn đề, gợi ý xử lý, tìm kiếm và bộ lọc nhóm cảnh báo trong modal rà soát.
- [x] Giữ kiểm tra trùng chủ sở hữu, registry, snapshot lịch sử và tham chiếu request/usage.
- [x] Bổ sung regression cho SDHET, import, modal và Rules emulator.

### Firestore Rules

- [x] Mở rộng `validInternalId` để công nhận `SDHET` như ngoại lệ nghiệp vụ được xác nhận.
- [ ] Deploy Rules production và lưu bằng chứng CLI thành công.

## 3. Gate kiểm chứng trước release

- [x] `npm.cmd ci` — pass; npm báo 67 cảnh báo dependency (4 low, 31 moderate, 30 high, 2 critical) và một số package deprecated, không tự động sửa trong release này.
- [x] `npm.cmd run test:prep` — 29/29 pass trước bước release metadata.
- [x] `npm.cmd test` — full repository suite pass: standards 104, inventory 3, notifications 13, documents 4, Excel 13, Smart Batch 33, Rules emulator 19, daily checklist 11, GAS 65, prep 29.
- [x] `npx.cmd tsc -p tsconfig.app.json --noEmit --pretty false` — pass.
- [x] `npm.cmd run typecheck:api` — pass.
- [x] `git diff --check` — pass.
- [x] `npm.cmd run build` — pass; tạo `dist/lims-cloud-pro`.

## 4. Đồng bộ version/changelog

- [x] Cập nhật `release-notes.json` theo toàn bộ phạm vi v26.08.11-b03.
- [x] Chạy `npm.cmd run sync-version` — phát sinh `v26.08.11-b03`.
- [x] Chạy `npm.cmd run validate:release-notes` — pass.
- [x] `CHANGELOG.md`, package, app data, metadata và Service Worker cùng trỏ tới `v26.08.11-b03`.

## 5. Triển khai production theo `DEPLOYMENT.md`

- [ ] Kiểm tra Firebase CLI account/project trước deploy — `firebase-tools login:list` báo chưa có tài khoản được ủy quyền; lệnh deploy Rules đã thử nhưng dừng ở xác thực.
- [ ] Deploy `firestore:rules` lên project `lims-cloud-by-otada` — chưa thực hiện được vì Firebase CLI chưa đăng nhập.
- [x] Deploy frontend production bằng `npx vercel --prod` — READY, deployment `dpl_FrsrMRbnL1QKySv7RriGNwUPyFH9`, alias [nafiqpm6.vercel.app](https://nafiqpm6.vercel.app).
- [x] Basic HTTP smoke — `/` và `/ngsw.json` trả `200`; `appData.version = v26.08.11-b03`, title đúng, manifest có 175 hash entries.
- [ ] Authenticated/business smoke cho route `/prep`, đơn vị ppm/ppb/ppt, copy/print/export và các ca nghiệp vụ đại diện.
- [ ] KNV review/acceptance các ví dụ, thuật ngữ, minimum weight, vial, rounding, blank/QC và stage semantics.
- [x] Không chạy backfill Daily Checklist vì release này không thay đổi projection và chưa có yêu cầu data migration.

## 6. Tích hợp Git

- [x] Review toàn bộ `git diff`/`git status` trước commit; không có secret pattern hoặc artifact ngoài phạm vi.
- [x] Stage toàn bộ 27 file thay đổi đã xác nhận; staged `git diff --check` pass.
- [x] Commit release trên `main` với version v26.08.11-b03: `6f86c5b`.
- [x] Push release `main` lên `origin` thành công: `40b21e2..6f86c5b`.
- [x] Sau push release, xác nhận `HEAD`/`origin/main` cùng trỏ `6f86c5b` và worktree sạch.

## 7. Bằng chứng và giới hạn kết luận

- Test local/emulator chỉ chứng minh code và boundary ở môi trường kiểm tra; không thay thế authenticated production smoke hoặc KNV acceptance.
- Chỉ coi Firestore Rules hoặc Vercel là thành công khi CLI trả exit code 0 và có output deployment tương ứng.
- Không đưa credential, token hoặc dữ liệu production vào checklist, changelog, commit hay log phát hành.
