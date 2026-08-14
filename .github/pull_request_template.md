## Kiểm tra UI

- [ ] Thay đổi này không chạm UI, hoặc tôi đã đối chiếu các phần UI bị ảnh hưởng với `UI_CONVENTIONS.md`.
- [ ] Nếu có thay đổi UI: đã kiểm tra light/dark, keyboard focus và kích thước màn hình hẹp phù hợp với phạm vi thay đổi; các kiểm tra chưa thể chạy được ghi rõ trong PR.
- [ ] `npm.cmd run test:ui-guardrails` pass; không thêm shade Tailwind chưa khai báo, `fa-times` hoặc fullscreen overlay tự dựng mới ngoài `app-modal-shell`.

## Kiểm tra chung

- [ ] Đã chạy typecheck/build/test phù hợp với phạm vi thay đổi và ghi rõ các lỗi baseline hoặc kiểm tra runtime/production chưa thực hiện.
