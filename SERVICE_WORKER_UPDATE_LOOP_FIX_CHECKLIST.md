# Service Worker Update Loop Fix Checklist

## Phạm vi

- [x] Kiểm tra dirty worktree và giữ nguyên các thay đổi UI/UX đang có ngoài phạm vi service worker.
- [x] Truy vết các nguồn reload/update trong `app.component.ts`, `app.config.ts`, `firebase.service.ts` và service-worker bootstrap.
- [x] Xác định nhánh `SwUpdate.unrecoverable` đang auto-reload không có guard và có thể tạo vòng lặp nếu lỗi vẫn tồn tại sau reload.

## Sửa lỗi

- [x] Giới hạn auto-reload phục hồi còn một lần cho mỗi app version trong mỗi tab bằng `sessionStorage`.
- [x] Nếu cùng version tiếp tục phát `UNRECOVERABLE_STATE`, dừng auto-reload và hiển thị cảnh báo phục hồi thủ công.
- [x] Nếu `sessionStorage` không khả dụng, không auto-reload vì không thể bảo đảm chặn lần reload kế tiếp.
- [x] Không thay đổi luồng `VERSION_READY`, polling update, FCM registration hoặc release metadata.

## Kiểm chứng local

- [x] Test guard service worker pass: `npm.cmd run test:service-worker` — 4/4.
- [x] Angular typecheck/build pass: `npx.cmd tsc -p tsconfig.app.json --noEmit` và `npm.cmd run build`.
- [x] `git diff --check` pass cho thay đổi hiện tại.

## Rà soát trước commit / deploy

- [x] Rà lại targeted diff của `package.json`, `app.component.ts`, helper/test recovery và checklist; logic service-worker vẫn giới hạn đúng một auto-reload cho mỗi app version trong mỗi tab.
- [x] Xác nhận `app.component.ts` còn chứa hunk UI dev-route `/__ui-primitives` không thuộc fix này; khi commit phải partial-stage chỉ import/helper + `SwUpdate.unrecoverable`, không gom hunk UI đó.
- [x] Rerun trên worktree hiện tại: `npm.cmd run test:service-worker` — 4/4, `npx.cmd tsc -p tsconfig.app.json --noEmit` pass, `git diff --check` pass.

## Kiểm chứng runtime / production

- [ ] Browser production tái hiện `UNRECOVERABLE_STATE`: lần đầu reload tối đa một lần, lần lặp cùng version không reload tiếp.
- [ ] Sau deploy version mới, update bình thường vẫn nhận `VERSION_READY` và tải version mới thành công.
- [ ] FCM push/background notification vẫn dùng registration `/firebase-messaging-sw.js` bình thường.

> Các mục runtime/production chỉ được check khi có bằng chứng từ môi trường thật; local unit/build không thay thế các mục này.
