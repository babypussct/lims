# Checklist: UX chuông và màn hình thông báo trên mobile

## Phạm vi

- [x] Xác định nguyên nhân tràn ngang/giật lag trên chuông và panel thông báo mobile bằng code evidence.
- [x] Chuẩn hóa số hiển thị cạnh filter, không để số lớn làm thay đổi kích thước tab.
- [x] Khóa overflow của hàng filter trong viewport mobile; giữ nhãn dễ đọc và không làm vỡ layout.
- [x] Giảm hiệu ứng gây tốn chi phí render trên mobile nhưng không làm mất trạng thái tương tác.
- [x] Bổ sung regression test cho formatter số filter và chạy test/typecheck liên quan.
- [x] Kiểm tra diff, xác nhận không đụng các thay đổi GAS/report có sẵn.

## Tiêu chí chấp nhận

- Không có horizontal overflow do số đếm filter; số từ 100 trở lên hiển thị dạng `99+`.
- Các tab `Tất cả`, `Chưa đọc`, `Cần xử lý`, `Hệ thống` vẫn nằm trong chiều rộng panel ở viewport mobile.
- Panel mở/đóng không tạo thêm listener hoặc render toàn bộ lịch sử vượt giới hạn hiện tại.
- Test và typecheck liên quan chạy thành công; mục kiểm tra thiết bị thật sẽ chỉ đánh dấu sau khi có bằng chứng runtime.

## Bằng chứng kiểm tra

- Code evidence: các file notification bell/panel/service.
- Test command: `npm.cmd run test:notifications` pass 13/13; `npx.cmd ngc -p tsconfig.app.json --noEmit` pass; `npm.cmd run build` pass; `git diff --check` pass.
- Runtime mobile check: viewport 360x800 trên local pass ở màn hình đăng nhập (`scrollWidth = 360`); panel notification chưa thể mở vì chưa có phiên đăng nhập.
