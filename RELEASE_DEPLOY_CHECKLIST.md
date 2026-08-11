# Checklist tổng kết và phát hành `v26.08.11-b02` trên `main`

> Mục tiêu: tổng hợp thay đổi đã có trên `main`, kiểm chứng gate phát hành, đồng bộ version/changelog, triển khai đúng `DEPLOYMENT.md`, rồi commit và push toàn bộ phạm vi đã xác nhận.
> Phạm vi business/runtime chưa nghiệm thu được giữ mở; phát hành kỹ thuật không tự biến thành nghiệm thu nghiệp vụ.

## 1. Snapshot trước phát hành

- [x] Checkout đang ở `main`.
- [x] `HEAD` trước phát hành: `86d6c79` (`fix(standards): stop internal-id sync rescan loop`).
- [x] `HEAD` và `origin/main` trước phát hành đồng bộ, chưa có commit local phía trước remote.
- [x] Dirty worktree đã được kiểm tra; phạm vi chờ release gồm `package.json`, sáu file Prep Station và hai tài liệu Prep Station.
- [x] Không có thay đổi `firestore.rules`, credential hoặc artifact ngoài phạm vi trong diff hiện tại.

## 2. Tổng hợp thay đổi

### Trạm Pha Chế

- [x] Tổ chức lại route `prep` theo năm tác vụ nghiệp vụ thay cho sáu mode kỹ thuật.
- [x] Mở rộng domain/engine cho nồng độ, lượng cần lấy, spike rắn/lỏng, dãy chuẩn/QC, nội chuẩn/surrogate và quy đổi chuỗi xử lý mẫu.
- [x] Giữ draft và calculation chạy cục bộ; không đọc/ghi Kho, Chất chuẩn, Firestore, audit log hoặc transaction.
- [x] Thêm cảnh báo thiếu MW/density, khác basis, ngoài dải pipet/bình, khối lượng dưới độ đọc và chuỗi xử lý chưa đủ dữ liệu.
- [x] Thêm boundary/test contract và đưa `test:prep` vào `npm test`.

### Các thay đổi đã có trên `main` sau `v26.08.11-b01`

- [x] Loại bỏ workflow hạn dùng hóa chất không còn sử dụng (`030cedb`).
- [x] Ghi nhận/finalize bằng chứng deploy và công bố Firebase Rules trong các commit tài liệu `5a184de`, `8e846cb`, `b6f6165`.
- [x] Sửa vòng quét lại của Đồng bộ Mã quản lý nội bộ, kèm regression (`86d6c79`).

## 3. Gate kiểm chứng trước release

- [x] `npm.cmd run test:prep` — `23/23` pass.
- [x] `npm.cmd test` — full repository suite pass: standards `102`, inventory `3`, notifications `13`, documents `4`, Excel `13`, Smart Batch/security `33` + Firestore emulator `18`, Daily Checklist `11`, GAS `65`, Prep `23`.
- [x] `npx.cmd tsc -p tsconfig.app.json --noEmit --pretty false` — pass.
- [x] `npm.cmd run typecheck:api` — pass.
- [x] `git diff --check` — pass.
- [x] `npm.cmd ci` — pass; npm báo `67` vulnerability hiện hữu và package deprecated, không tự sửa trong release này.
- [x] `npm.cmd run build` — pass; tạo `dist/lims-cloud-pro/browser`, `ngsw.json` mang `v26.08.11-b02`; port emulator `8080` đã được dọn và xác nhận rảnh.

## 4. Đồng bộ version/changelog

- [x] Cập nhật `release-notes.json` theo phạm vi v26.08.11-b02.
- [x] Chạy `npm.cmd run sync-version` — phát sinh `v26.08.11-b02`.
- [x] Chạy `npm.cmd run validate:release-notes` — pass.
- [x] `CHANGELOG.md`, package, app data, metadata và version hiển thị cùng trỏ tới `v26.08.11-b02`.

## 5. Triển khai production theo `DEPLOYMENT.md`

- [x] Kiểm tra `firestore.rules`: không có diff trong release này nên không deploy lại Rules.
- [x] Firebase CLI read-back hiện không có authorized account; không ghi nhận giả đã deploy/backfill Firebase.
- [x] Vercel production deploy qua Git Integration sau push commit `d6597d3`; GitHub status `Vercel: success — Deployment has completed`.
- [x] Basic HTTP smoke trên cả ba alias (`nafiqpm6.vercel.app`, Git-main alias và project alias): `/` và `/ngsw.json` đều trả `200`, `ngsw.json.appData.version = v26.08.11-b02`, title đúng release và manifest có `Cache-Control: no-cache`.
- [ ] Authenticated/business smoke cho route `/prep`, copy/print/export và các ca nghiệp vụ đại diện.
- [ ] KNV review/acceptance các ví dụ, thuật ngữ, minimum weight, vial, rounding, blank/QC và stage semantics.
- [x] Không chạy backfill Daily Checklist trong release này khi chưa có credential/ADC và chưa có yêu cầu data migration tương ứng.

## 6. Tích hợp Git

- [x] Review `git diff`/`git status` trước commit; không có secret pattern hoặc artifact ngoài phạm vi.
- [x] Stage toàn bộ thay đổi đã xác nhận.
- [x] Commit release trên `main`: `d6597d3 release: v26.08.11-b02 prep station and lifecycle fixes`.
- [x] Push `main` lên `origin` thành công.
- [ ] Ghi nhận commit tài liệu post-deploy và xác nhận lại `HEAD`/`origin/main` đồng bộ, worktree sạch.

## 7. Bằng chứng và giới hạn kết luận

- Test local/emulator chỉ chứng minh code và boundary ở môi trường kiểm tra; không thay thế authenticated production smoke hoặc KNV acceptance.
- Không coi Firebase Rules, backfill hoặc release Firestore là thành công nếu CLI không trả bằng chứng tương ứng.
- Không đưa credential, token hoặc dữ liệu production vào checklist, changelog, commit hay log phát hành.
