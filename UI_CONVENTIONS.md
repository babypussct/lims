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
5. Chạy `npm.cmd run test:ui-guardrails`; số overlay fullscreen tự dựng ngoài `app-modal-shell` phải khớp baseline theo từng file. Khi migrate giảm overlay phải hạ baseline cùng change set, không để quota dư.

## Trạng thái áp dụng hiện tại

- Phase 0: token và quy ước được ghi nhận; các token Soft UI (`gradient-soft`, `shadow-soft-*`, palette `gray`) được giữ lại có chủ ý vì vẫn có consumer thực tế ở shell/dashboard/public/auth. Vùng UI mới tiếp tục ưu tiên `slate` và không mở rộng consumer Soft UI nếu không có lý do sản phẩm.
- Phase 1: các shade slate chưa khai báo đã được thay bằng shade chuẩn; icon đóng được thống nhất; ba manager Targets/Recipes có biến thể dark mode.
- Phase 2: button/page header/modal/empty state/toolbar dùng chung và route demo dev-only đã có contract test, typecheck/build và browser smoke light/dark + modal interaction.
- Phase 3: Dashboard, Inventory, Standards, Results/SOP entry, Recipes, Targets, Preparation, Batch/SmartBatch, Documents, Daily Checklist, Labels, Config, SOP editor/calculator, Traceability và auth/public đã bắt đầu dùng primitive chung. Results dùng `app-page-header`/`app-toolbar` ở danh sách và `app-modal-shell`/`app-button`/`app-empty-state` cho generic chrome của màn nhập kết quả; `result-entry-header`, prefix tabs, SOP outlet, Excel import và các control nhập liệu/bulk action chuyên biệt tiếp tục giữ boundary riêng vì semantics phụ thuộc nghiệp vụ. Batch/SmartBatch hiện dùng `app-page-header`, `app-toolbar`, `app-button`, `app-empty-state` và `app-modal-shell` cho workflow-level CTA cùng các pattern layout/state chung; các control chuyên biệt của wizard như group card, delete/preview, target-group picker, checkbox, SOP card và SOP `<select>` tiếp tục giữ native/custom khi semantics phụ thuộc nghiệp vụ. Targets hiện đã có đủ năm primitive trên. Preparation đã chuyển page header và các action/footer chuẩn sang `app-page-header`/`app-button`, đồng thời giữ native cho nút xóa icon-only và control tính toán chuyên biệt; các primitive toolbar/modal/empty state chưa được đánh dấu cho module này khi chưa có migration tương ứng. Documents đã dùng page header, toolbar, button retry, empty state và skeleton dùng chung; preview tài liệu vẫn là ngoại lệ fullscreen viewer có keyboard/focus/fullscreen contract riêng và chưa được tính là `app-modal-shell`. Daily Checklist dùng page header/toolbar/button/empty state chung cho generic chrome ở chế độ standalone; embedded header, date navigation/date picker, refresh/print, view-mode control, progressive loading và print markup vẫn là boundary native/custom có chủ ý. Labels dùng `app-page-header` và `app-button` cho generic page chrome/CTA; mode selector, calibration, zoom và paper preview giữ custom vì là print-workstation boundary, trong đó canvas giấy luôn sáng để phản ánh output in. Config hiện dùng `app-page-header` ở shell quản trị, `app-button` cho CTA chuẩn, `app-empty-state` cho Roles/Users/list manager và `app-modal-shell` cho các form/destructive workspace; filter chip, permission matrix, batch control và bảng restore vẫn giữ native/custom theo semantics hiện hữu. SOP calculator dùng page header/toolbar/button/empty state cho library và button/footer cho workflow; SOP editor dùng button cho back/save và modal shell cho ba selection workspace, còn tab/editor control chuyên biệt tiếp tục giữ native/custom. Traceability dùng page header/button/empty state, với lookup/QR/verification/data card là boundary chuyên biệt; public policy/terms/changelog dùng page header/button, changelog dùng thêm toolbar/empty/skeleton; mobile QR login dùng dark-mode cho post-scan states và shared CTA, còn scanner viewport/password setup giữ exception custom.
- Phase 4: guardrail đã được thêm vào `npm test` qua `test:ui-guardrails` và checklist review PR đã yêu cầu đối chiếu tài liệu này. Guardrail chặn shade Tailwind không tồn tại, `fa-times`, overlay fullscreen tự dựng mới ngoài `app-modal-shell` và baseline overlay bị dư sau migration; 35 overlay legacy hiện tại được khóa chính xác theo từng file để tránh phát sinh lại trong khi tiếp tục di trú theo module. Standards đã tiếp tục chuyển ba utility modal `history`, `bulk-tag`, `tag-manager`, modal đề nghị mua sắm, modal thêm/cập nhật chất chuẩn, modal gán/mượn chuẩn, modal nhập bù nhật ký, modal in nhãn, modal đồng bộ Mã quản lý nội bộ, modal ghép CoA hàng loạt, modal xác nhận import dữ liệu, hai preview import chuẩn/nhật ký, drawer tạo yêu cầu chất chuẩn và workspace chuẩn hóa danh pháp/CAS sang `app-modal-shell`; SOP editor đã loại bỏ thêm ba overlay selection. Các migration giữ nguyên business/event contract.
