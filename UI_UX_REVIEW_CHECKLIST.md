# LIMS UI/UX Review Checklist

## Scope

- Repository: `C:\Users\GC02\Documents\GitHub\lims`
- Review date: 2026-08-10
- Review mode: source audit + automated checks + runtime/visual verification where available
- Evidence rule: check an item only after the source/runtime evidence has been inspected and recorded below.

## Progress

- [x] Inventory routes, screens, shared components, tokens, responsive rules, and assets.
- [x] Review information architecture and task flows from route/source structure.
- [x] Review visual consistency and design-system reuse from source heuristics.
- [x] Review forms, validation, error prevention, and feedback states from source.
- [x] Review loading, empty, offline, permission, and destructive-action states from source.
- [x] Review responsive/mobile behavior and touch ergonomics from source plus login runtime.
- [x] Review accessibility semantics, keyboard navigation, focus, contrast, and motion from source plus login runtime.
- [x] Review tables, filters, pagination, search, and dense laboratory data presentation from source.
- [x] Review performance-related UX risks and perceived performance from production build output.
- [x] Run typecheck/build/tests/lint and record the lint boundary below.
- [x] Perform runtime visual smoke review at desktop and mobile widths where possible.
- [x] Finalize findings with priority, evidence, remediation, acceptance criteria, and rollout checklist.

## Review boundary and method

The repository is an Angular standalone application with Tailwind utilities and lazy-loaded feature routes. The review covered `src/app`, `src/styles.css`, route/layout configuration, shared interaction primitives, and the main laboratory workflows: results/SOP entry, requests, standards, inventory, batch/preparation, documents, labels, checklist, dashboard, and configuration.

Runtime smoke testing was performed against the existing local dev server at `http://127.0.0.1:4200` for the unauthenticated login surface at 1280x720 and 390x844. Authenticated routes were not opened because no test session was available; all findings tied to those routes are explicitly marked static/source evidence and still need an authenticated runtime pass.

Validation evidence collected on 2026-08-10:

- `npm.cmd run build`: passed; release notes synchronized at `v26.08.08-b05`.
- `npx.cmd ngc -p tsconfig.app.json --noEmit`: passed.
- `npm.cmd run test:notifications`: passed, 13/13.
- `git diff --check`: passed; Git emitted only existing LF-to-CRLF warnings for dirty files.
- `npm.cmd run lint`: failed on one existing non-UI rule violation at `src/app/core/services/smart-batch-firestore-rules.emulator.test.ts:503:23` (`Array<T>` must be `T[]`). No UI/UX code was changed to hide or reinterpret that failure.
- Runtime login: no horizontal overflow at 1280x720 or 390x844; browser console showed only the expected development Service Worker warning.

Build output also shows an initial bundle of about 1.40 MB raw / 329.43 kB estimated transfer, with heavy functionality lazy-loaded (for example documents 1.29 MB and ExcelJS 945.71 kB raw). This is a performance recommendation, not by itself a release blocker.

## Priority definitions

- P0: blocks a core workflow, causes data loss, or makes the UI unusable for a critical user group.
- P1: materially harms a frequent/critical workflow, accessibility, or mobile use.
- P2: recurring usability, consistency, or maintainability issue with a practical workaround.
- P3: polish, optimization, or recommendation that does not currently block work.

## Findings summary

| ID | Priority | Area | Status | Short conclusion |
|---|---:|---|---|---|
| UX-01 | P1 | Authentication / accessibility | Verified static + runtime DOM | Help tooltip is hover-only and its icon-only button has no accessible name. |
| UX-02 | P1 | Authentication / keyboard | Verified static | Expired QR retry is a clickable `div`, so keyboard users cannot activate it. |
| UX-03 | P2 | Authentication / responsive | Verified runtime | At 390px, essential session-toggle text truncates and footer/legal copy becomes too small/dense. |
| UX-04 | P1 | Inventory / laboratory safety | Verified static | GHS hazard icons expose only `title`, not meaningful alternative text. |
| UX-05 | P1 | Inventory / keyboard | Verified static | Mobile inventory cards and capacity selectors use click handlers on non-interactive `div`s. |
| UX-06 | P1 | Notifications / keyboard | Verified static | Notification rows are clickable `div`s without focus/keyboard semantics. |
| UX-07 | P1 | Dialog accessibility | Verified static | Notification, confirmation, result, and several feature modals lack a consistent focus/semantics contract. |
| UX-08 | P2 | Destructive actions | Verified static | Core workflows still mix the custom confirmation modal with native `alert/confirm` dialogs. |
| UX-09 | P2 | Forms / accessibility | Verified static | Several visible labels are not programmatically associated with their controls. |
| UX-10 | P2 | Focus visibility | Verified static | Many controls remove the outline without a consistent replacement focus token. |
| UX-11 | P2 | Data-dense workflows | Verified static / authenticated runtime pending | Standards, Excel import, and result tables rely on very wide dense layouts; mobile parity needs authenticated validation. |
| UX-12 | P2 | Progress feedback | Verified static | Global progress overlay has no dialog/status/progress semantics for assistive technology. |

## Verified findings

### UX-01 — Authentication help is not keyboard/screen-reader discoverable — P1

Evidence:

- `src/app/features/auth/login.component.ts:264-277` renders the question-mark control without `aria-label`, `title`, or visible text.
- The explanation panel is `opacity-0 pointer-events-none` and only becomes visible through `group-hover/tooltip`, so keyboard focus does not reveal it.
- Runtime DOM at 1280x720 exposed the control as a button with an icon glyph but no accessible name; the login surface otherwise loaded successfully.

Impact: users who cannot hover, including keyboard and touch users, cannot discover the security meaning of “Duy trì đăng nhập” versus “Máy dùng chung”. This is security-related consent/context, not decorative help.

Remediation:

- Convert the help trigger into a named disclosure button with `[attr.aria-expanded]` and `[attr.aria-controls]`.
- Open on click/tap and keyboard focus; close on Escape or outside click.
- Render the explanation in a labelled region, and ensure the tooltip is not the only source of the information.

Acceptance criteria:

- [ ] Tab reaches the control with a Vietnamese accessible name.
- [ ] Enter/Space opens the explanation and announces it; Escape closes it.
- [ ] The explanation is usable at 320px–390px without clipping or relying on hover.

### UX-02 — Expired QR retry is a non-semantic clickable `div` — P1

Evidence: `src/app/features/auth/login.component.ts:326-331` binds `(click)="generateSession()"` to a `div` with `cursor-pointer`; there is no button role, `tabindex`, or keyboard handler.

Impact: the retry action is visible and touchable but unavailable to keyboard users and inconsistently exposed to assistive technology. Authentication recovery is a core entry path.

Remediation: use a real `<button type="button">` for the whole retry surface or provide a named button inside the overlay.

Acceptance criteria:

- [ ] The expired state is reachable and activatable with Tab + Enter/Space.
- [ ] The control has an explicit name such as “Tạo lại mã QR đăng nhập”.
- [ ] The retry state announces the new loading/error status without relying only on animation.

### UX-03 — Login mobile copy truncates essential choices — P2

Evidence:

- Source uses `truncate` for the session-toggle labels at `src/app/features/auth/login.component.ts:250` and `261`.
- Runtime at 390x844 had no horizontal overflow (`scrollWidth = 390`) but rendered “Duy trì đăng n...” in the session option row. Footer/legal/version text was visibly very small and wrapped into several dense lines.

Impact: the layout technically fits, but the user must infer a security setting from truncated text. The footer competes with the primary login task and is difficult to scan on a phone.

Remediation: reserve enough width for the two short labels, allow two-line wrapping, shorten the visible footer copy, and keep legal links accessible below the primary card.

Acceptance criteria:

- [ ] At 320px, 360px, and 390px both session labels are fully readable or have an adjacent full accessible name.
- [ ] Footer/legal links remain readable at the app’s minimum supported text size and do not dominate the login viewport.

### UX-04 — GHS hazard icons lack meaningful alternative text — P1

Evidence:

- `src/app/features/inventory/inventory.component.html:111-116` and `181-186` render GHS icons with `[title]` only and no `alt`.
- The same pattern appears in batch/calculator views (`src/app/features/batch/smart-batch.component.html:1101,1139` and `src/app/features/sop/calculator/calculator.component.html:418,461,500`).

Impact: a screen-reader or text-only user may receive no hazard information even though the visual icon communicates a safety warning. `title` is not a reliable accessible name and is poor on touch devices.

Remediation: give each meaningful icon an `alt` such as the localized GHS label, or expose a text list/accessible description beside the icon. Mark purely redundant icons `alt=""` only when the same warning is already present as text.

Acceptance criteria:

- [ ] Every non-decorative GHS warning is announced with its localized label.
- [ ] The warning remains understandable without color or image recognition.
- [ ] Automated accessibility scan reports no image-without-name for safety icons.

### UX-05 — Inventory touch surfaces use non-interactive elements — P1

Evidence:

- Mobile inventory cards use `(click)="openModal(item)"` on a `div` at `src/app/features/inventory/inventory.component.html:101-103`.
- Capacity SOP selection uses a clickable `div` at `:224-227`.
- The desktop table also attaches row activation directly to `<tr>` at `:170-172`.
- The mobile add FAB at `:305-309` is icon-only and has no `aria-label`.

Impact: touch users can operate the screen, but keyboard users cannot reach the same actions; the UI also has multiple nested actions that depend on `stopPropagation`, increasing accidental-open risk.

Remediation: use buttons/links for card and selector activation, keep secondary quick-update controls outside the primary button, and name the FAB.

Acceptance criteria:

- [ ] Inventory item open, capacity SOP selection, and add-item actions are keyboard reachable.
- [ ] Enter/Space behavior matches pointer behavior and does not trigger the parent when a secondary control is used.
- [ ] All icon-only inventory actions have accessible names.

### UX-06 — Notification rows are mouse/touch-only — P1

Evidence:

- `src/app/shared/components/notification-panel/notification-panel.component.ts:157-162` renders each notification as a `div` with `(click)="onNotificationClick(n)"` and no `role`, `tabindex`, or keyboard handler.
- The action chip is a visual `<span>` at `:196-201`, not a separately operable link/button.
- Hover action visibility is handled at `:563-568`; `:focus-within` cannot help if the row itself is not focusable.

Impact: keyboard users cannot open actionable notifications, and screen readers do not discover the row as an interactive item. This defeats the notification center’s primary purpose.

Remediation: model each item as a button/link or a focusable list item with a named action; keep mark-read/delete as separately labelled buttons and preserve event propagation boundaries.

Acceptance criteria:

- [ ] All actionable notification rows are in the tab order and open with Enter/Space.
- [ ] Actionable notification destination is announced; mark-read/delete remain separate controls.
- [ ] Hover-only actions have an equivalent keyboard/focus presentation.

### UX-07 — Dialog semantics and focus management are inconsistent — P1

Evidence:

- The notification panel has `role="dialog"` but no `aria-modal="true"` at `src/app/shared/components/notification-panel/notification-panel.component.ts:37-42`; its close icon-only button at `:102-108` has no accessible name.
- The shared confirmation modal at `src/app/shared/components/confirmation-modal/confirmation-modal.component.ts:11-36` has no dialog role, `aria-modal`, labelled heading linkage, initial focus, focus trap, or focus restoration.
- Result preflight/reset overlays at `src/app/features/results/result-entry.component.html:150-169` and `233-268` likewise lack dialog semantics; their close buttons are icon-only.
- The repo contains some local focus handling, but no shared focus-trap primitive was found for the global confirmation/notification flows.

Impact: users can tab into content behind an open modal, lose context after closing it, or receive an unlabeled close action. For result publishing/reset and notification actions, this is a high-risk workflow defect.

Remediation: introduce one modal primitive with labelled title/description, `aria-modal`, initial focus, Escape/outside-click policy, focus trap, and restoration to the opener. Migrate global and feature modals to it.

Acceptance criteria:

- [ ] Open modal announces as a dialog with its title/description.
- [ ] Focus enters the modal, cannot escape behind it, and returns to the trigger on close.
- [ ] Escape/outside-click behavior is explicit per destructive versus non-destructive modal.
- [ ] Close buttons have localized accessible names.

### UX-08 — Native `alert/confirm` is mixed with the custom confirmation experience — P2

Evidence:

- Dashboard statistics uses native `alert`/`confirm` at `src/app/features/dashboard/statistics.component.ts:569,629,641,662`.
- Result entry uses native `confirm` for lock takeover, restore, unlock, and virtual-master deletion at `src/app/features/results/result-entry.component.ts:572-574,602-603,818-819,895-897`.
- Other flows use `ConfirmationService`, which renders a different custom surface (`src/app/core/services/confirmation.service.ts` and `src/app/shared/components/confirmation-modal/confirmation-modal.component.ts`).

Impact: destructive and long-running actions have inconsistent copy, visual hierarchy, keyboard behavior, localization, and audit affordances. Native dialogs also interrupt the browser event loop and cannot show structured risk details.

Remediation: route all in-app confirmations and recoverable errors through the shared service; reserve native dialogs only for the browser-level unsaved-changes guard if unavoidable.

Acceptance criteria:

- [ ] Core result, statistics, config, and migration actions use the same modal contract.
- [ ] Dangerous actions show explicit consequence text and a destructive confirm label.
- [ ] Recoverable errors use toast/inline error with retry, not a blocking alert.

### UX-09 — Visible form labels are not consistently associated with controls — P2

Evidence:

- Login email label at `src/app/features/auth/login.component.ts:197` has no `for`, while the input at `:202` has `id="login-email"`; unlike the password label, the association is not explicit.
- Inventory modal labels and controls at `src/app/features/inventory/inventory.component.html:333-335` and the following fields are visually adjacent but generally lack `for`/`id` pairs.
- Similar patterns occur in target/config forms, for example `src/app/features/targets/master-target-manager.component.ts:141-175`.

Impact: assistive technology may announce only “edit field” without the field purpose, and clicking the visible label may not focus the intended control. This is especially costly in dense laboratory forms.

Remediation: use stable `id` + `for` pairs or wrap each control in its label; add `aria-describedby` for units, examples, and validation messages.

Acceptance criteria:

- [ ] Every visible form control has one programmatic accessible name.
- [ ] Unit/help/error text is associated and announced when relevant.
- [ ] Form scan finds no labelled input/select/textarea without a name.

### UX-10 — Focus visibility is not governed by a shared token — P2

Evidence:

- Source-wide scan found 462 `outline-none` occurrences, while only 6 `focus-visible` occurrences were found.
- Several high-use controls remove the outline and add only a color change or no focus replacement, for example inventory inputs/selects at `src/app/features/inventory/inventory.component.html:335,346,359,363,428,432,440,444,448` and target forms at `src/app/features/targets/target-group-manager.component.ts:90,147,151,155`.
- Other components use different `focus:ring`, `focus:border`, and `focus-visible:ring` conventions, so keyboard affordance is not uniform.

Impact: keyboard users may lose track of the active field in long forms and dense tables, especially in dark mode or when border color is subtle.

Remediation: define a global `focus-visible` ring token and forbid bare `outline-none` unless the same element declares a visible replacement; add component-level exceptions only for intentional composite controls.

Acceptance criteria:

- [ ] Every interactive element has a visible focus indicator at desktop and mobile widths.
- [ ] Focus indicator meets the project’s contrast/area target in light and dark themes.
- [ ] Lint or a static check prevents new bare `outline-none` on interactive controls.

### UX-11 — Data-dense screens need a deliberate mobile information architecture — P2

Evidence:

- Standards list sets a `min-w-[1000px]` table shell at `src/app/features/standards/components/standards-list-view.component.ts:15-25`.
- Excel result import uses a `min-w-[960px]` table at `src/app/features/results/components/excel-result-import-modal.component.html:185-188`.
- Result-view tables use minimum widths of 700–850px in `src/app/features/results-view/batch-detail-view.component.ts:221,307`.
- Source heuristics count 957 `text-[10px]`, 296 `text-[9px]`, 249 `text-[11px]`, 125 `min-w-[...]`, and 241 `w-[...]` utility usages across `src/app`.

Impact: horizontal scrolling is sometimes the correct choice for laboratory matrices, but the current pattern risks tiny text, hidden context, and excessive two-dimensional navigation on phones. Authenticated runtime confirmation is still pending.

Remediation: define per-screen mobile modes: card/row detail for standards and requests, sticky identity columns plus explicit horizontal-scroll affordance for result matrices, and progressive disclosure for low-frequency metadata.

Acceptance criteria:

- [ ] Each dense screen documents whether it uses card mode, controlled horizontal scroll, or a mobile-specific workflow.
- [ ] Primary identity/status/action columns remain visible or are summarized before scrolling.
- [ ] Text remains readable without requiring browser zoom.
- [ ] Authenticated runtime smoke passes at 320/360/390/768/1280 widths.

### UX-12 — Global progress overlay is not exposed as progress/status — P2

Evidence: `src/app/shared/components/progress-overlay/progress-overlay.component.ts:10-37` renders a full-screen spinner and percentage text but no `role="dialog"`, `aria-busy`, `role="progressbar"`, or `aria-valuenow/min/max`.

Impact: a screen-reader user receives no reliable signal that a blocking operation is running or how far it has progressed; the overlay also has no documented cancellation/timeout behavior.

Remediation: expose a labelled status region and a determinate progressbar when totals are known; announce phase changes through an `aria-live` node and document whether the operation is cancellable.

Acceptance criteria:

- [ ] Blocking progress announces title/message and busy state.
- [ ] Determinate progress exposes current/min/max values.
- [ ] Completion and failure are announced and leave a recoverable message/action.

## Recommendations (not classified as verified defects)

### Information architecture and task flow

- Keep the current role-aware navigation, but add a “work queue first” landing model for analysts: pending requests, assigned result entry, and recent batches should be the first actions before low-frequency configuration.
- For result entry, preserve the existing preflight and autosave concepts, but make the state machine visible as a compact step/status rail: `Draft → Validated → Ready to publish → Published`.
- Separate manager-only maintenance/configuration from daily laboratory work in navigation and search categories; this reduces menu scanning and accidental entry into destructive tools.

### Design system

- Introduce shared primitives for `IconButton`, `ModalFrame`, `Field`, `StatusBadge`, `EmptyState`, `LoadingState`, and `DataTableToolbar`.
- Define tokens for focus ring, minimum control height, body/metadata text sizes, status colors, surface elevations, and destructive action styling. The current Tailwind-first approach is visually coherent in the login screen but becomes inconsistent across feature-local templates.
- Use text + icon + shape for status; never rely on red/green alone for stock, expiry, result, or permission state.

### Forms and laboratory data

- Keep the explicit distinction among empty, `0`, `ND`, `N/A`, and missing values in result-entry UI. Add visible legend/help where users are asked to enter or import these values.
- Put unit, allowed values, and example input beside the field instead of relying on placeholder text; placeholders disappear during editing and are not a substitute for labels.
- For bulk imports, show a persistent summary of selected, skipped, ambiguous, and invalid rows with a direct “review only these rows” filter.

### Accessibility and testing

- Add axe-based checks for login, notification panel, confirmation modal, inventory form, standards list, result preflight, and Excel import fixtures.
- Add keyboard regression tests for every custom click surface and dialog open/close path.
- Add viewport snapshots or manual evidence at 320, 360, 390, 768, 1024, and 1280px; include dark mode and `prefers-reduced-motion`.

### Performance and perceived performance

- Keep heavy document/Excel/PDF libraries lazy-loaded and load them only after explicit intent. The build already shows that they are separated into lazy chunks; verify no eager prefetch defeats this on production.
- Add performance budgets for initial transfer, route transition, and time-to-first-interaction on low-memory mobile devices.
- Preserve the existing reduced-motion and `performance-lite` strategy, but verify loading indicators remain perceivable and do not become silent when animation is disabled.

### Operational and auditability

- Pair destructive UI actions with an inline result state containing the action, target, actor, timestamp, and retry/rollback affordance where business rules allow.
- Add a “last synced / offline cache” indicator to data-heavy screens with a consistent placement and explanation; the app already has offline banners, but each workflow should expose freshness close to its data.
- Keep the existing notification test suite and extend it with a11y contract tests for notification row semantics and action destinations.

## Remediation order

1. P1 keyboard/accessibility blockers: UX-01, UX-02, UX-04, UX-05, UX-06.
2. Shared dialog/focus infrastructure: UX-07, then migrate result and destructive flows.
3. Form naming and focus visibility: UX-09, UX-10.
4. Consistent feedback and progress semantics: UX-08, UX-12.
5. Mobile dense-data redesign and authenticated runtime pass: UX-03, UX-11.

## Verification / rollout checklist

- [ ] Re-run targeted tests for every implemented remediation.
- [x] Re-run typecheck and production build (baseline passed; repeat after changes).
- [ ] Verify desktop, tablet, and mobile viewport behavior for authenticated screens.
- [ ] Verify keyboard-only and screen-reader-relevant semantics for changed flows.
- [ ] Verify loading/error/empty/offline/permission/destructive states for changed flows.
- [ ] Capture runtime screenshots or equivalent evidence for changed screens.
- [ ] Run axe/a11y scan on authenticated fixtures.
- [ ] Re-run lint after the existing unrelated `Array<T>` violation is fixed or explicitly waived.
- [ ] Record remaining business-dependent or environment-dependent items as unchecked.
