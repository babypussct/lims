# Quy ước UI

Tài liệu này là nguồn tham chiếu cho các thay đổi giao diện mới trong `src/app`. Việc di trú các màn hình hiện có được thực hiện theo từng module, có kiểm tra riêng để tránh làm thay đổi hành vi nghiệp vụ.

## Phạm vi áp dụng

- Dùng các primitive và token đã có trong Tailwind trước khi thêm class hoặc màu tùy biến.
- Khi một vùng giao diện được dùng lại ở từ hai module trở lên, ưu tiên đưa quy ước vào component dùng chung thay vì sao chép markup.
- Không đánh dấu mục migration hoàn thành chỉ dựa trên việc biên dịch; cần kiểm tra template, light/dark và hành vi tương tác của vùng đã sửa.

## Màu sắc

| Vai trò | Quy ước |
|---|---|
| Palette xám chính | `slate` |
| Primary action | `indigo-600` / `indigo-700` khi hover |
| Thành công / lưu | `emerald` |
| Nguy hiểm / xóa | `red` hoặc `rose` |
| Thông tin | `blue` |
| Chế độ tối | Mọi nền, viền và chữ của bề mặt tương tác phải có biến thể `dark:` tương ứng |

`gray` vẫn được giữ trong cấu hình vì còn được dùng bởi layout và nền tương thích Soft UI; không thêm cách dùng mới nếu một token `slate` phù hợp đã tồn tại.

Không dùng shade chưa được khai báo trong `tailwind.config.js`, ví dụ `slate-105`, `slate-205`, `slate-555` hoặc `slate-855`. Dùng shade chuẩn gần nhất sau khi kiểm tra ngữ nghĩa của vị trí đó.

## Radius, shadow và khoảng cách

| Thành phần | Quy ước mặc định |
|---|---|
| Card / panel | `rounded-2xl` + `shadow-sm` |
| Button / input | `rounded-xl` |
| Pill / avatar / trạng thái tròn | `rounded-full` |
| Modal | `rounded-2xl` + `shadow-2xl` |
| Khoảng cách nhóm điều khiển | `gap-2` hoặc `gap-3` |
| Padding vùng thao tác | `px-4` / `px-6`, `py-3` / `py-4` tùy mật độ |

Các ngoại lệ chỉ nên dùng khi có lý do responsive, mật độ dữ liệu hoặc yêu cầu trực quan được ghi nhận trong review.

## Tiêu đề và nhãn nút

- Tiêu đề tiếng Việt dùng sentence case; chỉ dùng chữ hoa toàn bộ cho eyebrow hoặc nhãn ngắn có chủ ý.
- Mỗi trang có một heading chính duy nhất, ưu tiên `<h1>` ở page header dùng chung.
- Nhãn thao tác chuẩn: `Hủy`, `Đóng`, `Lưu`, `Xác nhận`, `Xóa`.
- Dùng `fa-xmark` cho nút đóng; không thêm alias `fa-times` mới.

## Focus và trạng thái

- Giữ focus ring dùng chung từ `src/styles.css`; không dùng `outline-none` để vô hiệu hóa focus mà không cung cấp trạng thái thay thế.
- Nút primary phải thể hiện rõ hover, disabled và loading; không dùng màu ngữ nghĩa của trạng thái cho thao tác chính.
- Modal phải có tên accessible, `aria-modal`, đóng bằng Escape và quản lý focus theo directive dùng chung khi primitive modal shell được áp dụng.

## Quy trình review

Trước khi merge thay đổi UI, kiểm tra:

1. Token màu/radius/shadow có nằm trong quy ước và cấu hình không.
2. Light mode, dark mode, keyboard focus và kích thước màn hình hẹp của vùng đã sửa.
3. Không có `slate-105`, `slate-205`, `slate-555`, `slate-855` hoặc `fa-times` mới trong `src/app`.
4. Typecheck/build và test liên quan đã chạy; các kiểm tra runtime cần fixture đăng nhập phải được ghi rõ là chưa thực hiện.
5. Chạy `npm.cmd run test:ui-guardrails`; không tăng số overlay fullscreen tự dựng ngoài `app-modal-shell` so với baseline đã ghi nhận.

## Trạng thái áp dụng hiện tại

- Phase 0: token và quy ước được ghi nhận; việc xóa token Soft UI chưa dùng vẫn để mở vì cần rà toàn bộ consumer và quyết định sản phẩm riêng.
- Phase 1: các shade slate chưa khai báo đã được thay bằng shade chuẩn; icon đóng được thống nhất; ba manager Targets/Recipes có biến thể dark mode.
- Phase 2: button/page header/modal/empty state/toolbar dùng chung và route demo dev-only đã có contract test, typecheck/build và browser smoke light/dark + modal interaction.
- Phase 3: Dashboard, Inventory, Standards, Recipes, Targets, Preparation và Batch/SmartBatch đã bắt đầu dùng primitive chung. Batch/SmartBatch hiện dùng `app-page-header`, `app-toolbar`, `app-button`, `app-empty-state` và `app-modal-shell` cho workflow-level CTA cùng các pattern layout/state chung; các control chuyên biệt của wizard như group card, delete/preview, target-group picker, checkbox, SOP card và SOP `<select>` tiếp tục giữ native/custom khi semantics phụ thuộc nghiệp vụ. Targets hiện đã có đủ năm primitive trên. Preparation đã chuyển page header và các action/footer chuẩn sang `app-page-header`/`app-button`, đồng thời giữ native cho nút xóa icon-only và control tính toán chuyên biệt; các primitive toolbar/modal/empty state chưa được đánh dấu cho module này khi chưa có migration tương ứng.
- Phase 4: guardrail đã được thêm vào `npm test` qua `test:ui-guardrails` và checklist review PR đã yêu cầu đối chiếu tài liệu này. Guardrail chặn shade Tailwind không tồn tại, `fa-times` và việc tăng overlay fullscreen tự dựng ngoài `app-modal-shell`; 68 overlay legacy hiện tại được khóa bằng baseline để tránh phát sinh mới trong khi tiếp tục di trú theo module.
