# Settings restructuring checklist

Mục tiêu: thay trang `config` dạng tab lớn bằng Settings Center theo route, tách rõ tài khoản cá nhân, quản trị hệ thống, dữ liệu và kiểm soát truy cập. Checklist này là source of truth cho đợt refactor.

## Phase 1 — Foundation

- [x] Tạo `/settings` shell với sidebar responsive và tìm kiếm mục cài đặt.
- [x] Chuyển navigation chính từ `/config` sang `/settings/account/profile`.
- [x] Giữ `/config` làm redirect tương thích ngược.
- [x] Tách route theo nhóm Account / System / Data / Access / Policies / Diagnostics.
- [x] Gắn guard ở route quản trị thay vì chỉ ẩn UI trong component.

## Phase 2 — Account

- [x] Tách Hồ sơ & cá nhân hóa.
- [x] Tách Bảo mật và phương thức đăng nhập.
- [x] Tách Thông báo thiết bị.
- [x] Tách Quyền riêng tư / thao tác ẩn danh hóa.
- [x] Giữ permission summary cho người dùng thường.

## Phase 3 — System & data

- [x] Tách System settings khỏi Data settings ở mức route/UI.
- [x] Tách Master Data Hub.
- [x] Tách Backup & Recovery Center.
- [x] Tách Data lifecycle (archive, recycle, migration).
- [x] Tách Diagnostics / resource health.
- [x] Không ghi đè thay đổi backup/retention đang có trong working tree.

## Phase 4 — Access control

- [x] Tách Users thành route riêng.
- [x] Tách Roles thành route riêng.
- [x] Giữ permission matrix trong trình chỉnh sửa Role.
- [x] Route quản trị được bảo vệ bằng manager guard để giữ nguyên semantics hiện hành.

## Phase 5 — Policies

- [x] Tách Định mức & tiêu hao thành route riêng.

## Phase 6 — UX / quality

- [x] Sidebar desktop + selector/navigation mobile.
- [x] Search Settings theo tên và mô tả.
- [x] Chuẩn hóa page shell và section primitives cho Settings mới.
- [x] Loại tab navigation cũ khỏi entry point chính.
- [x] Bảo toàn deep-link và legacy link `/config`.
- [x] Typecheck Angular (`npx tsc -p tsconfig.app.json --noEmit`).
- [x] UI contract tests (`npm run test:ui-config`: 8/8 pass; UI guardrails pass trong full suite).
- [x] Full repository test suite (`npm test`) pass.
- [x] Build production (`npm run build`) pass.
- [x] `git diff --check` pass và đã rà working tree trước bàn giao.

## Phase 7 — Legacy / dead-code cleanup

- [x] Xóa state modal category cũ không còn consumer trong `ConfigGeneralComponent`.
- [x] Xóa `editingItem` thừa ở Matrix Type và Master Device; luồng edit thực tế dùng `isEditMode + formData`.
- [x] Giữ `filteredItems` của Sample Description vì template vẫn dùng trực tiếp.
- [x] Xóa `ConfigUsersComponent.hasPerm()` vì không còn call-site.
- [x] Xóa `AppComponent.pageTitle` cũ; Header và Bottom Nav đã sở hữu page title thực tế.
- [x] Loại key `config` khỏi route title/icon map để command palette không sinh mục Settings legacy trùng lặp.
- [x] Giữ `/config` duy nhất như redirect tương thích ngược; không còn direct navigation tới route này.
- [x] Xóa chế độ monolithic `ConfigGeneralComponent view="all"`; mọi consumer hiện phải truyền domain Settings cụ thể.
- [x] Xác minh các service Matrix Type / Master Device / Sample Description vẫn còn consumer thực và không xóa nhầm nghiệp vụ.
- [x] Quét method/property declaration-only trong `features/config` và `features/settings`; không còn suspect chưa xác minh.

## Verification note

- Browser automation không được expose trong phiên công cụ hiện tại, vì vậy không có click-through/screenshot QA tự động. Angular typecheck, template compilation, production build, UI contract tests, UI guardrails và full repository test suite đều đã pass.

## Acceptance criteria

- `/settings/account/*` truy cập được cho người dùng đã đăng nhập.
- `/settings/system`, `/settings/data/*`, `/settings/access/*`, `/settings/policies/*`, `/settings/diagnostics` chỉ manager truy cập được.
- `/config` redirect về hồ sơ tài khoản.
- Settings không còn phụ thuộc vào một active-tab signal để điều hướng.
- `ConfigGeneralComponent` có thể render theo domain thay vì luôn render toàn bộ màn hình.
- Các nghiệp vụ backup hiện hành vẫn được giữ nguyên.
- `npm run test:ui-config`, `npx tsc -p tsconfig.app.json --noEmit`, và `npm run build` đạt.
