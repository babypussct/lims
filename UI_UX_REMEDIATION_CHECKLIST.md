# UI/UX remediation checklist

Phạm vi nguồn: audit giao diện toàn bộ `src/app` ngày 2026-08-13. Checklist này theo dõi remediation, không thay thế kiểm tra nghiệp vụ hoặc kiểm tra production.

Nguyên tắc: chỉ đánh dấu sau khi có thay đổi mã nguồn và bằng chứng kiểm tra tương ứng. Kiểm tra light/dark trên trình duyệt, keyboard-only, authenticated runtime và production vẫn để mở nếu chưa có bằng chứng đúng môi trường.

## Phase 0 — Nền tảng và quy ước

- [x] Ghi nhận palette xám chính là `slate`, primary action là `indigo`, thang radius/shadow/khoảng cách và nhãn nút trong [UI_CONVENTIONS.md](UI_CONVENTIONS.md).
- [x] Ghi rõ nguyên tắc không thêm shade Tailwind chưa khai báo và dùng `fa-xmark` cho nút đóng.
- [ ] Quyết định cuối cùng về việc xóa hoặc áp dụng đồng bộ các token Soft UI còn ít consumer (`gradient-soft`, `shadow-soft-*`, palette `gray`). Cần rà consumer và quyết định sản phẩm riêng.

## Phase 1 — Quick wins

- [x] Thay toàn bộ `slate-105`, `slate-205`, `slate-555`, `slate-855` trong `src/app` bằng shade chuẩn theo ngữ nghĩa vị trí.
- [x] Thay toàn bộ `fa-times` trong `src/app` bằng `fa-xmark`.
- [x] Bổ sung biến thể dark mode cho shell, header, danh sách, form, input, modal và footer của `target-group-manager`.
- [x] Bổ sung biến thể dark mode cho shell, header, bảng, form, import preview và modal của `master-target-manager`.
- [x] Bổ sung biến thể dark mode cho danh sách công thức, form, search result, modal và footer của `recipe-manager`.
- [x] Đổi primary action của phần đã chạm trong Targets/Recipes sang indigo; giữ màu ngữ nghĩa teal/purple chỉ ở trạng thái hoặc chi tiết phụ.
- [ ] Xác nhận chủ ý sản phẩm cho `mobile-qr-login` trước khi thêm dark mode; chưa tự thay đổi màn QR login.

## Phase 2 — UI primitives

- [x] Tạo và test `<app-button variant="primary|secondary|danger|ghost" size="sm|md">`.
- [x] Tạo và test `<app-page-header>` với heading, icon, subtitle, action slot và tùy chọn sticky.
- [x] Tạo và test `<app-modal-shell>` tích hợp `appModalA11y`, Escape, focus, footer và animation chuẩn.
- [x] Tạo và test `<app-empty-state>`.
- [x] Tạo và test `<app-toolbar>`.
- [x] Tạo route demo nội bộ cho primitives với light/dark và các biến thể chính.

## Phase 3 — Di trú theo module

Mỗi dòng chỉ được đánh dấu khi module đã dùng primitive tương ứng và đã chạy kiểm tra riêng.

| Module | Page header | Toolbar | Modal shell | Button/footer | Empty/skeleton |
|---|---:|---:|---:|---:|---:|
| dashboard | [x] | [x] | [ ] | [x] | [x] |
| inventory | [x] | [x] | [ ] | [x] | [x] |
| standards (+ requests) | [x] | [x] | [ ] | [ ] | [ ] |
| results / SOP entry | [ ] | [ ] | [ ] | [ ] | [ ] |
| batch | [x] | [x] | [x] | [x] | [x] |
| preparation | [x] | [ ] | [ ] | [x] | [ ] |
| targets | [x] | [x] | [x] | [x] | [x] |
| recipes | [ ] | [ ] | [x] | [x] | [x] |
| documents | [ ] | [ ] | [ ] | [ ] | [ ] |
| checklist | [ ] | [ ] | [ ] | [ ] | [ ] |
| labels | [ ] | [ ] | [ ] | [ ] | [ ] |
| config | [ ] | [ ] | [ ] | [ ] | [ ] |
| SOP editor/calculator | [ ] | [ ] | [ ] | [ ] | [ ] |
| traceability | [ ] | [ ] | [ ] | [ ] | [ ] |
| auth/public | [ ] | [ ] | [ ] | [ ] | [ ] |

## Phase 4 — Guardrails

- [x] Thêm `test:ui-guardrails` và nối vào `npm test` để chặn shade không có trong Tailwind config, `fa-times` và native fullscreen overlay mới ngoài primitive modal; overlay legacy hiện tại được khóa bằng baseline để không tăng thêm.
- [x] Thêm mục UI vào `.github/pull_request_template.md`, yêu cầu đối chiếu [UI_CONVENTIONS.md](UI_CONVENTIONS.md), chạy guardrail và ghi nhận light/dark, keyboard focus, narrow screen khi áp dụng.
- [x] Giữ route `__ui-primitives` dev-only làm nguồn tham chiếu trực quan; contract test xác nhận route không được mở trong production.

## Verification evidence — 2026-08-13

- [x] `rg` xác nhận không còn `slate-105|slate-205|slate-555|slate-855` trong `src/app`.
- [x] `rg` xác nhận không còn `fa-times` trong `src/app`.
- [x] `git diff --check` pass.
- [x] `npx.cmd ngc -p tsconfig.app.json --noEmit` pass.
- [x] `npm.cmd run build` pass; release notes validation xác nhận `v26.08.13-b01`.
- [x] ESLint phạm vi các file TypeScript đã chạm pass; `standards-internal-id-sync-modal.component.ts:211` được loại khỏi targeted run vì là lỗi baseline ngoài dòng icon đã đổi.
- [x] `npm.cmd run test:ui-primitives` pass 5/5 contract tests cho button, page header, modal shell, empty state, toolbar và route demo dev-only.
- [x] `npm.cmd run test:ui-dashboard` pass 2/2 contract tests: Dashboard dùng page header/button/empty state dùng chung; Statistics dùng page header/toolbar/button dùng chung; sweep cuối xác nhận các nhãn Statistics đã migrate tuân thủ sentence case.
- [x] Sau migration Dashboard/Statistics, `npx.cmd ngc -p tsconfig.app.json --noEmit`, ESLint targeted cho `dashboard.component.ts`, `statistics.component.ts`, `dashboard-ui-primitives.contract.test.ts` và `git diff --check` đều pass; scan không còn các chuỗi Title Case mục tiêu trong `statistics.component.html`.
- [x] `npm.cmd run build` được chạy lại sau sweep Dashboard/Statistics và trả `exit 0`; release notes validation xác nhận `v26.08.13-b01`, Angular bundle generation hoàn tất.
- [x] Inventory đã migrate sang `app-page-header`, `app-toolbar`, `app-button` và `app-empty-state`; `npm.cmd run test:ui-inventory` pass 2/2, `npx.cmd ngc -p tsconfig.app.json --noEmit`, ESLint targeted và `git diff --check` đều pass; `npm.cmd run build` trả `exit 0` và xác nhận `v26.08.13-b01`.
- [x] Standards, Standards Requests, Standard Detail và Standard Usage đã migrate page header sang `app-page-header`; vùng filter/search chính của Requests và Usage dùng `app-toolbar`; action thông thường dùng `app-button`; Detail/Usage dùng `app-empty-state`; các control chuyên biệt như menu trigger, segmented tabs, export option-card, filter-chip dismiss và icon-only delete vẫn giữ native để bảo toàn semantics/layout. Nhãn mục tiêu đã chuyển sang sentence case và Detail không còn page-level `<h1>` trùng với shared page header. `npm.cmd run test:ui-standards` pass 4/4; `npx.cmd ngc -p tsconfig.app.json --noEmit`, ESLint targeted cho các TypeScript đã chạm và `npm.cmd run build` đều trả `exit 0`; build xác nhận `v26.08.13-b01`.
- [x] Recipes đã migrate action thường sang `app-button`, trạng thái danh sách rỗng sang `app-empty-state` và modal tạo/cập nhật sang `app-modal-shell`; modal không còn overlay `fixed inset-0 z-[60]` tự dựng và tiêu đề/action mục tiêu dùng sentence case. Các nút icon-only sửa/xóa recipe và xóa dòng thành phần vẫn giữ native để bảo toàn layout chuyên biệt. `npm.cmd run test:ui-recipes` pass 1/1; `npx.cmd ngc -p tsconfig.app.json --noEmit`, ESLint targeted, `git diff --check` và `npm.cmd run build` đều pass; build xác nhận `v26.08.13-b01`.
- [x] Targets đã migrate hai manager sang `app-page-header`; action header dùng `pageHeaderActions`, ô tìm kiếm của Master Targets dùng `app-toolbar`/`toolbarSearch`, action thường dùng `app-button`, trạng thái rỗng/tìm kiếm rỗng dùng `app-empty-state` và ba modal hiện có dùng `app-modal-shell`. Tiêu đề header mục tiêu dùng sentence case. `npm.cmd run test:ui-targets` pass 2/2; `npx.cmd ngc -p tsconfig.app.json --noEmit`, ESLint targeted cho hai manager + contract test và `git diff --check` đều pass; `npm.cmd run build` trả `exit 0` và release notes validation xác nhận `v26.08.13-b01`.
- [x] 2026-08-14: `npm.cmd run test:ui-guardrails` pass trên 277 file production: 0 shade Tailwind không hợp lệ, 0 `fa-times`; 68 fullscreen overlay legacy đều nằm trong baseline và guardrail sẽ fail nếu số lượng theo file tăng hoặc xuất hiện overlay mới ngoài baseline/`app-modal-shell`.
- [x] 2026-08-14: `git diff --check` pass sau khi loại bỏ trailing whitespace ở 6 SOP entry template; cảnh báo LF→CRLF của Git không phải lỗi diff.
- [x] 2026-08-14: Preparation/Smart Prep đã dùng `app-page-header` + `pageHeaderActions`; các action chuẩn ở header, khu vực dãy chuẩn/QC, phần kết quả và footer dùng `app-button`. Nút xóa icon-only và control chọn tác vụ tính toán chuyên biệt vẫn giữ native có chủ ý để bảo toàn semantics/layout. `npm.cmd run test:ui-preparation` pass 1/1, `npm.cmd run test:prep` pass 33/33, `npm.cmd run test:ui-guardrails` pass, và `npm.cmd run build` trả `exit 0` với release notes `v26.08.13-b01`.
- [x] 2026-08-14: Batch/SmartBatch đã migrate workflow-level CTA và layout/state chung sang `app-button`, `app-page-header`, `app-toolbar`, `app-modal-shell` và `app-empty-state`; các control chuyên biệt như group card, delete/preview, target-group picker, checkbox, SOP card có `aria-pressed` và SOP `<select>` vẫn giữ native có chủ ý. CSS `smartbatch-primary-action*` đã được loại bỏ và contract test khóa ranh giới primitive này. `npm.cmd run test:smart-batch` pass 46 source/contract tests + 22 Firestore emulator tests, `npm.cmd run test:ui-primitives` pass 5/5, `npm.cmd run test:ui-guardrails` pass trên 277 file với 68 overlay legacy, `npx.cmd ngc -p tsconfig.app.json --noEmit`, ESLint targeted, `git diff --check` và `npm.cmd run build` đều pass; build xác nhận `v26.08.13-b01`.
- [ ] Standards visual/interaction smoke: kiểm tra light/dark, desktop/mobile; menu “Chức năng” (outside click + Escape + file picker), segmented status tabs, view toggle, search, badge mua sắm; Detail header actions/tabs/load-more/empty state; Usage toolbar/filter chips/load-more/empty-state clear-filter/export option cards trước khi đánh dấu thêm `Button/footer`, `Modal shell` hoặc `Empty/skeleton`.
- [ ] Inventory `Modal shell`: giữ bottom-sheet responsive hiện tại (`items-end md:items-center`, `rounded-t-2xl md:rounded-2xl`) trên boundary `appModalA11y`; chưa đánh dấu migrate sang `app-modal-shell` vì đây là ngoại lệ responsive có chủ ý cần giữ hành vi mobile hiện tại.
- [x] ESLint phạm vi Phase 2 (`src/app/shared/components/ui/**/*.ts`, `app.routes.ts`, `app.component.ts`) pass.
- [x] Browser smoke tại `http://127.0.0.1:4200/#/__ui-primitives`: light/dark toggle thêm class `dark`; modal có `role="dialog"`, title/body/footer; focus ban đầu vào nút `Đóng`; Escape và nút `Đóng` đều đóng modal và khôi phục focus về `Mở modal demo`.
- [x] Full `npm.cmd run lint` pass sau khi chuẩn hóa 4 annotation TypeScript baseline (`array-type`/`prefer-const`) ở `smart-batch-firestore-rules.emulator.test.ts`, `prep-calculation.engine.ts`, `smart-prep.component.ts` và `standards-internal-id-sync-modal.component.ts`.
- [ ] Visual smoke light/dark cho ba manager ở kích thước desktop/mobile.
- [ ] Keyboard-only smoke cho các control đã chạm.
- [x] Unauthenticated local login smoke ở `http://127.0.0.1:4200/` pass tại 1280×720; console chỉ có cảnh báo service worker do dev mode.
- [ ] Authenticated local runtime smoke; local app hiện trỏ `projectId: lims-cloud-by-otada` và không cấu hình Auth Emulator, nên không dùng credential local-only để chạm Firebase production/external service. Source/build không chứng minh quyền truy cập hoặc dữ liệu Firestore.
- [ ] Emulator/production verification; không thuộc bằng chứng của change set này.

## Bàn giao cho người tiếp nhận — 2026-08-14

Phạm vi bàn giao của checkout này gồm toàn bộ thay đổi đang có trên `main`: shared UI primitives và guardrails, migration UI theo module, SmartBatch Step 2 follow-up, service-worker recovery guard, monthly-stats atomic increment/Rules test và các checklist liên quan. Không tách các file này thành một patch UI thuần vì các contract test và Rules coverage đi cùng để bảo vệ hành vi.

### Điểm vào chính

- Quy ước và ranh giới UI: [UI_CONVENTIONS.md](UI_CONVENTIONS.md).
- Trạng thái migration/open items: checklist này, đặc biệt bảng Phase 3 và các mục runtime ở phần Verification evidence.
- Primitive dùng chung: `src/app/shared/components/ui/`.
- Guardrail: `scripts/ui-guardrails.js`, `scripts/ui-overlay-baseline.json`, `package.json` (`test:ui-*`).
- SmartBatch: `src/app/features/batch/` và [SMART_BATCH_STEP2_SAMPLE_GROUP_WIZARD_CHECKLIST.md](SMART_BATCH_STEP2_SAMPLE_GROUP_WIZARD_CHECKLIST.md).
- Service worker: `src/app/core/utils/service-worker-recovery.ts` và [SERVICE_WORKER_UPDATE_LOOP_FIX_CHECKLIST.md](SERVICE_WORKER_UPDATE_LOOP_FIX_CHECKLIST.md).

### Đã kiểm tra trên checkout hiện tại

- `npm.cmd test` — pass toàn bộ suite hiện tại; Rules emulator pass 22/22, nhưng log emulator vẫn có cảnh báo giới hạn expression evaluation trong một số phép deny dự kiến.
- Các contract UI — pass: primitive 5/5; Dashboard 2/2; Inventory 2/2; Results 2/2; Recipes 1/1; Preparation 1/1; Standards 4/4; Targets 2/2.
- `npm.cmd run test:ui-guardrails` — 277 file production, 0 shade không hợp lệ, 0 `fa-times`, 68 overlay legacy đúng baseline.
- `npx.cmd ngc -p tsconfig.app.json --noEmit --pretty false` và `npm.cmd run typecheck:api` — pass.
- `npm.cmd run build` và `git diff --check` — pass.
- Full `npm.cmd run lint` vẫn là mục mở do 4 lỗi baseline đã ghi ở dòng 84; không coi đây là lỗi mới của handoff nếu chưa có diff xác nhận.

### Việc người tiếp nhận cần làm tiếp

1. Chạy visual smoke light/dark, narrow screen và keyboard-only cho các module còn mở; ưu tiên Standards, Inventory modal boundary và ba manager.
2. Tiếp tục Phase 3 theo bảng module, chỉ đánh dấu sau khi có code + contract/regression + browser evidence; không gộp authenticated/production proof vào static proof.
3. Thực hiện authenticated local smoke bằng cơ chế credential được phê duyệt, sau đó ghi riêng kết quả UI nghiệp vụ, Firebase Rules và consumer (Daily Checklist/results/print).
4. Đối với service worker, xác nhận production `UNRECOVERABLE_STATE`/`VERSION_READY` và FCM sau deploy theo checklist riêng; các mục này vẫn để mở.
5. Khi mở PR tiếp theo, đối chiếu `UI_CONVENTIONS.md`, chạy `npm.cmd run test:ui-guardrails`, cập nhật checklist và ghi rõ runtime nào chưa chạy.
