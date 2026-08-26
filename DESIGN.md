# LIMS NAFIQPM6 — Design System & Stitch Brief

Tài liệu này là nguồn định hướng thiết kế cho giao diện LIMS mới và là brief dùng khi tạo concept bằng Google Stitch. `UI_CONVENTIONS.md` vẫn là nguồn quy ước kỹ thuật khi triển khai Angular/Tailwind; tài liệu này bổ sung ngôn ngữ sản phẩm, nguyên tắc thị giác và đặc tả theo màn hình.

Mục tiêu của redesign là hiện đại hóa giao diện nhưng giữ nguyên nghiệp vụ, quyền truy cập, dữ liệu và event contract hiện có.

## 1. Product identity

LIMS NAFIQPM6 là hệ thống quản lý thông tin phòng thí nghiệm dùng nội bộ. Giao diện phải tạo cảm giác của một công cụ vận hành kỹ thuật đáng tin cậy, phù hợp môi trường phòng thí nghiệm và công việc có kiểm soát.

Tính cách sản phẩm:

- Chính xác, đáng tin cậy và có tính hệ thống.
- Nhanh cho người dùng làm việc lặp lại hằng ngày.
- Dense but scannable: chứa đủ thông tin nhưng có phân cấp rõ ràng.
- Trạng thái bất thường, lỗi, cảnh báo và việc cần xử lý phải nổi bật hơn trang trí.
- Quyền hạn, trạng thái bảo mật và các hành động quan trọng phải dễ hiểu.
- Mang cảm giác "laboratory workstation / secure internal system", không mang cảm giác landing page SaaS hoặc ứng dụng consumer.

## 2. Core visual principles

### 2.1 Operational clarity first

Mỗi màn hình phải trả lời nhanh ba câu hỏi:

1. Tôi đang ở đâu?
2. Trạng thái hiện tại là gì?
3. Hành động chính tiếp theo là gì?

Không hy sinh khả năng đọc, scan hoặc thao tác để đổi lấy hiệu ứng trang trí.

### 2.2 Calm by default, loud by exception

Phần lớn giao diện dùng slate trung tính. Indigo dành cho hành động chính, focus và trạng thái được chọn. Màu semantic chỉ dùng khi truyền đạt trạng thái thật sự.

### 2.3 Technical, not sterile

Có thể dùng các chi tiết rất nhẹ gợi môi trường phòng thí nghiệm như grid, line, module, chip trạng thái hoặc icon kỹ thuật, nhưng không biến màn hình thành dashboard sci-fi.

### 2.4 Consistency over novelty

Ưu tiên primitive, token và pattern đã có. Một pattern mới chỉ nên được thêm khi giải quyết một nhu cầu thực sự mà pattern hiện tại không giải quyết tốt.

## 3. Color system

### Neutral foundation

- Primary neutral palette: `slate`.
- Light app background: ưu tiên `slate-50` hoặc tương đương.
- Light surfaces: `white`, `slate-50`, `slate-100` theo cấp độ.
- Light borders: ưu tiên `slate-200`.
- Primary text: `slate-900` / `slate-800`.
- Secondary text: `slate-600` / `slate-500`.
- Dark app background: `slate-950`.
- Dark surfaces: `slate-900` / `slate-850` khi token đã tồn tại.
- Dark borders: `slate-800` / `slate-700`.
- Dark primary text: `slate-100` / `slate-200`.
- Dark secondary text: `slate-400`.

`gray` chỉ tiếp tục tồn tại cho các consumer Soft UI cũ. Giao diện mới không mở rộng việc dùng `gray` nếu `slate` phù hợp.

### Primary

- Primary action: `indigo-600`.
- Primary hover: `indigo-700`.
- Selected/focus accents: indigo ở cường độ phù hợp.
- Không dùng fuchsia/pink làm màu điều hướng hoặc CTA chính cho UI mới.

### Semantic colors

- Success: `emerald`.
- Warning: `amber`.
- Danger/destructive/error: `red` hoặc `rose`.
- Information: `blue`.

Semantic colors không thay thế màu primary. Ví dụ nút "Đăng nhập" vẫn là indigo; màu red chỉ dùng cho lỗi đăng nhập.

### Tailwind token rule

Chỉ sử dụng shade có thật trong `tailwind.config.js`. Không tự tạo class shade không tồn tại. Đặc biệt không thêm `slate-105`, `slate-205`, `slate-555`, `slate-855`.

## 4. Typography

- UI/body font: Open Sans (`font-sans`).
- Display/headings: Inter (`font-display`) khi cần nhấn phân cấp.
- Heading dùng sentence case tiếng Việt.
- Tránh quá nhiều ALL CAPS; chỉ dùng cho eyebrow, nhãn metadata rất ngắn hoặc ngữ cảnh kỹ thuật thực sự phù hợp.
- Body text ưu tiên 13–15px ở desktop tùy mật độ; không giảm chữ quan trọng xuống quá nhỏ chỉ để vừa layout.
- Label form phải rõ, có độ tương phản đủ và không phụ thuộc placeholder để truyền đạt ý nghĩa trường.

## 5. Shape, spacing and elevation

### Radius

- Card/panel: `rounded-2xl`.
- Button/input/select: `rounded-xl`.
- Pill/avatar/status dot: `rounded-full`.
- Modal: `rounded-2xl`.

Không dùng radius phô trương như `rounded-[2rem]` hoặc `rounded-[2.5rem]` cho container thông thường nếu không có lý do sản phẩm rõ ràng.

### Shadow

- Card/panel mặc định: `shadow-sm`.
- Modal: `shadow-2xl`.
- Không tạo glow màu quanh control chính.
- Không dùng shadow để thay thế border/hierarchy.

### Spacing

- Khoảng cách giữa control cùng nhóm: `gap-2` hoặc `gap-3`.
- Padding thường dùng: `px-4`, `px-6`, `py-3`, `py-4`.
- Form authentication nên thoáng hơn màn hình dữ liệu, nhưng vẫn phải gọn và tập trung.

## 6. Components and interaction language

### Buttons

- Primary: nền indigo, chữ trắng, radius `rounded-xl`.
- Secondary: surface trung tính + border slate.
- Destructive: chỉ dùng red/rose khi hành động thực sự destructive.
- Mọi button phải có hover, disabled và loading rõ ràng.
- Không dùng gradient CTA cho UI mới.

### Inputs

- Nền surface rõ ràng, border slate, radius `rounded-xl`.
- Focus dùng ring/focus treatment indigo và phải nhìn thấy bằng keyboard.
- Error dùng border/message semantic red, không làm mất focus indicator.
- Không dùng glass blur cho field mặc định.

### Tabs / segmented controls

- Selected state phải được nhận ra không chỉ bằng màu chữ.
- Có thể dùng selected surface, border hoặc indicator indigo.
- Tránh animation trượt cầu kỳ nếu không giúp nhận biết trạng thái.

### Status and alerts

- Alert phải có icon + heading/message khi cần.
- Màu trạng thái chỉ phủ mức vừa đủ; tránh full-saturation block lớn.
- Các trạng thái hệ thống và bảo mật phải dùng ngôn ngữ ngắn, cụ thể, hành động được.

### Icons

- Giữ hệ Font Awesome hiện tại khi triển khai.
- Nút đóng dùng `fa-xmark`; không thêm `fa-times` mới.
- Icon bổ trợ cho label, không thay label ở hành động quan trọng trừ khi pattern đã quá quen thuộc và có `aria-label`.

## 7. Accessibility and focus

- Giữ focus ring dùng chung từ `src/styles.css`.
- Không dùng `outline-none` nếu không cung cấp focus state tương đương hoặc tốt hơn.
- Tương phản chữ, border và trạng thái phải sử dụng được ở light và dark mode.
- Không truyền đạt trạng thái chỉ bằng màu.
- Loading state phải ngăn thao tác lặp khi nghiệp vụ yêu cầu.
- Các control icon-only phải có accessible name.
- Tooltip/help có thể mở bằng click/keyboard và đóng bằng Escape khi pattern hiện tại hỗ trợ.
- Motion chỉ dùng để giải thích thay đổi trạng thái; tránh animation nền liên tục gây phân tâm.

## 8. Light and dark mode

Mỗi surface tương tác mới phải có light/dark mapping rõ ràng.

Light mode:

- Background sáng, ít tint.
- Card trắng hoặc slate rất nhạt.
- Border slate rõ nhưng nhẹ.
- Indigo làm accent chính.

Dark mode:

- Background `slate-950`.
- Surface tách lớp bằng `slate-900` / `slate-850`, border `slate-800` / `slate-700`.
- Không chỉ đảo màu; phải giữ hierarchy giữa app background, card, nested surface và input.
- Semantic colors giảm saturation khi cần để giữ khả năng đọc.

## 9. Responsive rules

Thiết kế concept tối thiểu phải kiểm tra hai viewport:

- Desktop: 1440px wide.
- Mobile: 390px wide.

Nguyên tắc:

- Không chỉ scale nhỏ desktop xuống mobile.
- Mobile ưu tiên một cột, touch target rõ, không bị overflow ngang.
- Action quan trọng không được đẩy xuống quá xa sau trang trí hoặc nội dung phụ.
- Các nhóm control có thể stack theo chiều dọc khi nhãn bị chật.
- Desktop có thể dùng split layout nếu phần phụ thực sự giúp định hướng/trust; không dùng split layout chỉ để lấp chỗ trống.

## 10. Reusable UI expectations

Khi triển khai từ Stitch về Angular/Tailwind:

- Dùng shared primitives hiện có trước khi tạo markup mới: button, empty-state, modal-shell, page-header, toolbar.
- Giữ `app-logo` làm nguồn logo chuẩn.
- Nếu một pattern xuất hiện ở từ hai module trở lên, cân nhắc component dùng chung.
- Không để concept Stitch kéo hệ thống sang một design language khác với phần còn lại của LIMS.
- Stitch là công cụ khám phá bố cục/thị giác; source code hiện tại vẫn là nguồn sự thật cho hành vi nghiệp vụ.

## 11. Explicitly avoid

Không đưa các pattern sau vào UI mới nếu không có lý do đặc biệt:

- Animated gradient blobs.
- Heavy glassmorphism / backdrop blur trên toàn bộ card hoặc form.
- Fuchsia/pink làm màu primary mới.
- Gradient CTA.
- Neon glow hoặc hover glow trang trí.
- Oversized custom radii cho card/form.
- Scanner laser hoặc animation trang trí liên tục.
- Marketing hero copy, testimonial, pricing-style layout hoặc các pattern landing page SaaS.
- Decorative illustration chiếm diện tích lớn hơn luồng công việc.
- Quá nhiều card lồng card làm loãng hierarchy.
- Thay đổi hoặc lược bỏ chức năng chỉ vì concept mới đơn giản hơn.

---

# Login page specification

Login là màn hình đầu tiên dùng để thiết lập ngôn ngữ thiết kế mới.

## 12. Login goals

Login phải truyền tải bốn cảm giác chính:

1. Đây là hệ thống nội bộ chính thức của phòng thí nghiệm.
2. Việc đăng nhập nhanh và không gây nhiễu.
3. Bảo mật/session policy được giải thích rõ khi người dùng cần.
4. Mọi phương thức đăng nhập hiện có vẫn dễ tìm và dễ chuyển đổi.

Visual direction mặc định: **Modern Laboratory Workstation** — slate trung tính, panel rõ ràng, indigo primary, typography kỹ thuật nhưng thân thiện, chi tiết lab rất nhẹ và tĩnh.

## 13. Login information architecture

### Header / identity

- Dùng logo LIMS hiện tại.
- Product name: `LIMS NAFIQPM6`.
- Descriptor: `Hệ thống quản lý thông tin phòng thí nghiệm`.
- Không cần marketing slogan.

### Authentication mode switcher

Phải giữ đủ ba mode:

- `Google`
- `Mã QR`
- `Tài khoản`

Switcher phải nhìn rõ mode đang active bằng selected surface/indicator và indigo accent.

### Session security controls

Phải giữ:

- `Duy trì đăng nhập`
- `Máy dùng chung`
- Hai lựa chọn loại trừ lẫn nhau như behavior hiện tại.
- Help/tooltip giải thích tác động của từng lựa chọn.

Không giấu các tùy chọn này vào một menu khó tìm trên desktop. Có thể làm chúng gọn hơn nhưng vẫn phải discoverable.

### Footer / public actions

Phải giữ:

- `Chính sách bảo mật`
- `Điều khoản sử dụng`
- `Nhật ký cập nhật`
- PWA install prompt hiện có.
- Thông tin version/internal-use hiện có nếu phù hợp với layout.

## 14. Functional states that Stitch must preserve

Stitch chỉ redesign phần trình bày. Không được xóa hoặc hợp nhất các state dưới đây.

### Global

- Light mode.
- Dark mode.
- Keyboard focus states.
- Disabled/loading states.
- Logout reason notification:
  - idle timeout;
  - permission denied;
  - normal logout.

### Google login

- Primary `Đăng nhập với Google` action.
- Google loading state.
- Google redirect/error state.
- Pending Google account linking state khi email Google đã tồn tại trong LIMS.
- Password field để xác thực tài khoản LIMS hiện tại.
- Link-account loading/error state.

### Account/password login

- Input `Gmail / Email hoặc username`.
- Khi username không chứa `@`, UI phải tiếp tục thể hiện logic/hint `@lims.com`.
- Password input.
- Show/hide password control.
- Enter-to-submit behavior không được bị phá khi implement.
- `Quên mật khẩu?` action.
- Login loading state.
- Authentication/network/permission error message.

### QR login

- QR generation/loading phase.
- QR canvas/code area.
- Status `waiting`.
- Status `scanned`.
- Status `approved`.
- Status `expired` với retry/reload affordance.
- QR connection/generation error với retry.
- Instruction: dùng ứng dụng LIMS trên điện thoại để quét mã.
- Live status text phải dễ đọc và không phụ thuộc chỉ vào animation.

## 15. Login layout guidance

### Desktop 1440px

Preferred concept:

- Centered authentication workspace khoảng 420–520px nếu dùng single-panel.
- Hoặc split layout nhẹ 40/60 hay 45/55 nếu phần phụ chỉ chứa identity, security context hoặc laboratory motif có ích.
- Form/auth panel phải luôn là focal point.
- Background có thể dùng subtle grid/dot/technical line motif với opacity thấp, nhưng không animation và không cạnh tranh với form.
- Footer/public links tách nhẹ khỏi auth controls.

### Mobile 390px

- Một cột.
- Card có thể gần full-width với margin 16px.
- Logo nhỏ hơn desktop để không đẩy form xuống quá sâu.
- Mode switcher giữ đủ ba lựa chọn; label không được truncate khó hiểu.
- Session controls có thể stack nếu ngang quá chật.
- QR area co theo viewport nhưng vẫn dễ quét.
- Footer wrap tự nhiên.

## 16. Login visual state rules

- Default card: white/slate surface + `rounded-2xl` + subtle border + `shadow-sm`.
- Primary CTA: indigo solid, không gradient.
- Active auth tab: indigo text + selected neutral/indigo-tinted surface.
- Inputs: slate border, indigo focus.
- Error: red/rose alert hoặc inline message.
- Logout timeout/system notice: amber.
- QR approved: emerald.
- QR waiting/scanned: indigo/blue informational treatment.
- QR expired: slate/amber tùy message; retry phải rõ.
- Dark mode giữ cấu trúc và hierarchy tương tự light mode.

## 17. Acceptance criteria for the Login redesign

Một concept chỉ được xem là phù hợp để triển khai khi:

- Nhìn giống LIMS nội bộ / laboratory workstation, không giống marketing SaaS.
- Ba phương thức đăng nhập đều xuất hiện rõ.
- CTA chính dễ nhận biết trong dưới 2 giây.
- Không cần animation nền để tạo cảm giác cao cấp.
- Session-security choices dễ hiểu.
- Error/logout/QR states có hierarchy rõ ràng.
- Có phiên bản desktop 1440px và mobile 390px.
- Có light và dark mode.
- Không yêu cầu xóa hành vi hiện có để đạt layout.
- Có thể triển khai bằng token Tailwind hiện tại và shared primitives hiện có.

---

# Stitch prompt — Login exploration

Copy prompt dưới đây vào Stitch để tạo concept Login đầu tiên.

```text
Design a new Login page for an internal Laboratory Information Management System named “LIMS NAFIQPM6”.

This is a secure operational application used by laboratory staff, not a marketing SaaS website and not a consumer app. The visual language should feel like a modern laboratory workstation: precise, calm, trustworthy, technical, highly readable, and efficient.

Create 3 distinct visual directions for the same Login page:

1. Operational Secure Workstation
   - compact, direct, security-forward
   - strong hierarchy and minimal decoration

2. Modern Laboratory Workstation
   - balanced and polished
   - subtle static laboratory/grid motif
   - this should be the recommended/default direction

3. Minimal High-Scannability
   - extremely clear and quiet
   - fewer visual layers, maximum readability

Design system constraints:
- Neutral foundation: slate.
- Primary action/accent: indigo.
- Success: emerald.
- Warning: amber.
- Error/danger: red or rose.
- Information: blue.
- Light mode background: very light slate; dark mode background: deep slate.
- Cards/panels: medium rounded corners, subtle border, subtle shadow.
- Buttons and inputs: slightly smaller rounded corners than cards.
- Solid indigo primary buttons, no gradient CTA.
- Avoid fuchsia/pink as primary colors.
- Avoid glassmorphism, animated gradient blobs, neon glow, decorative scanner lasers, oversized pill cards, and excessive gradients.
- Use a professional internal-system aesthetic rather than a promotional login page.

Typography:
- Clear modern sans-serif UI typography.
- Vietnamese labels.
- Strong but restrained hierarchy.

Required product identity:
- Existing LIMS logo at the top or identity area.
- Product name: “LIMS NAFIQPM6”.
- Subtitle: “Hệ thống quản lý thông tin phòng thí nghiệm”.

The page MUST preserve all existing authentication features and states. Redesign the visual presentation only; do not remove or simplify away functionality.

Authentication mode switcher must contain exactly these 3 modes:
- “Google”
- “Mã QR”
- “Tài khoản”

Google mode must support:
- “Đăng nhập với Google” primary action
- loading state
- error state
- a pending account-link state where an existing LIMS account password must be entered to link Google
- link-account loading/error state

Account/password mode must support:
- field label “Gmail / Email hoặc username”
- username input with visible “@lims.com” suffix/hint when the user does not type an @ domain
- password input
- show/hide password
- “Quên mật khẩu?” action
- primary action “Đăng nhập LIMS”
- loading and authentication error states

QR mode must support:
- large scannable QR code area
- instruction: “Sử dụng ứng dụng LIMS trên điện thoại để quét mã này.”
- waiting state
- scanned state
- approved/success state
- expired state with retry/reload action
- connection/generation error state with retry
- clearly readable live status text

Session security controls must always remain available:
- “Duy trì đăng nhập”
- “Máy dùng chung”
- these two options are mutually exclusive
- a help/info affordance explains what each option means

The page must also support a system/logout notification area with these cases:
- idle timeout
- permission denied
- normal logout

Footer/public actions must remain available:
- “Chính sách bảo mật”
- “Điều khoản sử dụng”
- “Nhật ký cập nhật”
- room for an install-app / PWA prompt
- internal-use/version information

Responsive requirements:
- Provide desktop design at 1440px width.
- Provide mobile design at 390px width.
- Mobile should be a true single-column adaptation, not merely a scaled desktop layout.
- Ensure all three login modes remain easy to switch on mobile.

Theme requirements:
- Provide both light and dark modes.
- Maintain clear visual hierarchy in dark mode using layered slate surfaces.

Accessibility requirements:
- Visible keyboard focus states.
- Do not communicate status by color alone.
- Clear disabled/loading states.
- High text contrast.
- Important icon actions need understandable labels/tooltips.

For each of the 3 concepts, show the default Login screen and also demonstrate how error/system status messaging would fit without changing the page structure.

Prioritize trust, security, clarity, fast login, and implementation realism over visual spectacle.
```

## 18. Handoff from Stitch back to code

Sau khi chọn một concept từ Stitch:

1. Chốt bố cục, hierarchy, token và responsive behavior trước khi code.
2. Đối chiếu concept với toàn bộ state ở mục 14.
3. Implement trong `src/app/features/auth/login.component.ts` nhưng giữ nguyên method/event/business contract.
4. Ưu tiên thay đổi template/class; chỉ thay TypeScript khi thật sự cần cho presentation state.
5. Kiểm tra light/dark, 1440px, 390px, keyboard focus, Google/password/QR states và session controls.
6. Chạy test/guardrail liên quan trước khi coi migration hoàn thành.

