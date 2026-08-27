# Checklist phát hành `v26.08.11-b04` trên `main`

> **Hồ sơ lịch sử, không phải quy trình hiện hành.** Bản này từng deploy thủ công trước khi project `nafiqpm6` áp dụng Git Integration + Deployment Check. Mọi release mới phải theo `DEPLOYMENT.md`; không lặp lại lệnh Vercel CLI được ghi trong bằng chứng bên dưới.

Mục tiêu: đưa toàn bộ thay đổi đang có trong checkout lên release mới, sửa lỗi Nhật ký cập nhật rỗng trên Dashboard/hộp thoại/trang công khai, rồi commit, push và xác minh deployment theo bằng chứng thực tế.

## 1. Snapshot và nguyên nhân

- [x] Checkout đang ở `main`, trước release `HEAD=0aad35f`, `origin/main` cùng SHA; worktree ban đầu có nhóm thay đổi Chuẩn bị dung dịch chưa commit.
- [x] Giữ nguyên và đưa toàn bộ thay đổi hiện có vào cùng release; không reset hoặc ghi đè thay đổi không liên quan.
- [x] Xác định `ChangelogService` trước đây chỉ đọc collection Firestore `releases`.
- [x] Xác định route `/changelog` được mở trước đăng nhập nhưng Rules cũ chỉ cho phép đọc khi đã đăng nhập.
- [x] Xác định `scripts/legacy-releases.json` có 40 release, mới nhất là `v26.08.07-b02`; migration production chưa có bằng chứng đã chạy.
- [x] Xác định việc tạo release hiện tại phụ thuộc vào lần đăng nhập của Manager, nên không đủ để bảo đảm Dashboard/modal của mọi người dùng có dữ liệu.
- [x] Production smoke trước sửa: `https://nafiqpm6.vercel.app/#/changelog` hiển thị “Không tìm thấy bản ghi phù hợp” khi chưa đăng nhập.

## 2. Sửa changelog và release history

- [x] Thêm fallback public `public/release-history.json`, gồm release hiện tại và 40 release lịch sử.
- [x] Changelog ghép dữ liệu Firestore với fallback, giữ release online làm bản ưu tiên khi trùng version và luôn bổ sung release hiện tại khi dữ liệu online cũ/rỗng.
- [x] Thêm fallback thứ hai từ `ngsw.json.appData` để vẫn có nội dung tối thiểu nếu file lịch sử tĩnh không tải được.
- [x] Mở quyền đọc công khai cho `/releases/{versionId}`; quyền tạo/cập nhật vẫn giới hạn Manager.
- [x] Sửa migration để luôn đưa `release-notes.json` của version hiện tại vào nguồn ghi, kể cả khi dùng `--source=scripts/legacy-releases.json`.
- [x] `npm.cmd run migrate:releases -- --source=scripts/legacy-releases.json --dry-run` đọc được **41 release**, không ghi Firestore.
- [x] Thêm regression cho chuẩn hóa/sắp xếp/dedupe/giới hạn/ghép fallback changelog: **4/4 pass**.
- [x] Thêm Rules emulator test: người chưa đăng nhập đọc được release history.

## 3. Version và nội dung changelog

- [x] Cập nhật `release-notes.json` cho toàn bộ thay đổi Chuẩn bị dung dịch + Nhật ký cập nhật.
- [x] Chạy `npm.cmd run sync-version`, sinh `v26.08.11-b04`.
- [x] Đồng bộ `package.json`, `ngsw-config.json`, `state.service.ts`, `metadata.json` và `public/release-history.json` về `v26.08.11-b04`.
- [x] `npm.cmd run validate:release-notes` pass.

## 4. Gate kiểm chứng local/emulator

- [x] `npm.cmd run test:changelog` — 4/4 pass.
- [x] `npx.cmd tsc -p tsconfig.app.json --noEmit --pretty false` — pass.
- [x] `npm.cmd run typecheck:api` — pass.
- [x] `npm.cmd run test:firestore-rules` — 20/20 pass.
- [x] `npm.cmd test` — full suite **303 test pass**; gồm Rules emulator 20 và changelog fallback 4.
- [x] `npm.cmd run build` — pass; `validate:release-notes` pass và Angular bundle sinh tại `dist/lims-cloud-pro/browser`.
- [x] `git diff --check` — pass trước bước commit cuối.

## 5. Deploy production

- [ ] Deploy Firestore Rules lên `lims-cloud-by-otada`; kiểm tra `npx.cmd firebase-tools login:list` cho thấy **No authorized accounts**, nên chưa thể ghi nhận deploy thành công.
- [ ] Chạy migration production `npm.cmd run migrate:releases -- --source=scripts/legacy-releases.json`; chưa chạy vì chưa có credential/service account hợp lệ trong runtime.
- [x] Deploy frontend production bằng `npx.cmd vercel --prod --yes`; READY deployment `dpl_Cm1L1cpTV8QWg3eK5aBaQoKkoXEu`, alias `https://nafiqpm6.vercel.app`.
- [x] HTTP smoke sau deploy: `/ngsw.json` và `/release-history.json` trả `200`; manifest là `v26.08.11-b04`, file lịch sử có 41 release và đứng đầu `v26.08.11-b04`.
- [x] Public smoke sau deploy: `/#/changelog` render release mới nhất, nội dung theo bốn nhóm và các bản lịch sử.
- [x] Modal smoke sau deploy trên màn hình đăng nhập: nút `Nhật ký cập nhật` mở modal Top 3, hiển thị `v26.08.11-b04` và nội dung chi tiết.
- [ ] Authenticated smoke Dashboard → nút Nhật ký cập nhật → modal Top 3; cần session tài khoản kiểm thử được cung cấp qua cơ chế secure local, không ghi credential vào repo/log.

## 6. Git integration

- [x] Review toàn bộ diff và secret pattern lần cuối.
- [x] Stage tất cả thay đổi thuộc release b04; `git diff --cached --check` pass.
- [x] Commit toàn bộ thay đổi trên `main`: `94c5b18 release: v26.08.11-b04 changelog and prep improvements`.
- [x] Push `main` lên `origin`: `0aad35f..94c5b18`.
- [x] Xác nhận sau push cuối: `HEAD` và `origin/main` cùng SHA; worktree sạch.

## 7. Giới hạn bằng chứng

- Kiểm thử local/emulator chứng minh code và Rules trong môi trường kiểm tra; không tự biến thành bằng chứng Firebase Rules production đã deploy.
- Fallback tĩnh bảo đảm UI có nội dung sau frontend deploy ngay cả khi migration Firestore chưa chạy; migration vẫn cần được thực hiện khi Firebase credential sẵn sàng để nguồn online đầy đủ.
- Không đưa credential, token hoặc dữ liệu production vào checklist, changelog, commit hay log phát hành.
