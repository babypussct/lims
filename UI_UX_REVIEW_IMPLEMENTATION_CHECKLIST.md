# LIMS UI/UX Remediation Implementation Checklist

Parent review: [UI_UX_REVIEW_CHECKLIST.md](UI_UX_REVIEW_CHECKLIST.md)

Rule: check an item only after the code change and its targeted verification pass. Authenticated runtime items remain unchecked until a signed-in fixture/session is available.

## Phase 1 — Shared accessibility foundation

- [x] Add shared modal focus/keyboard directive and migrate confirmation, notification, inventory, result, Excel, progress, and bottom-nav modal surfaces. (Code + `npx ngc -p tsconfig.app.json --noEmit` pass)
- [x] Add global `:focus-visible` token and remove unsafe bare outline suppression from changed controls. (Code + `npx ngc -p tsconfig.app.json --noEmit` pass)
- [x] Add shared accessible progress/status semantics. (Code + `npx ngc -p tsconfig.app.json --noEmit` pass)

## Phase 2 — P1 authentication, safety, inventory, notifications

- [x] Make login security help a named disclosure usable by keyboard/touch. (Code + template/typecheck pass)
- [x] Make expired QR retry a real keyboard-operable button with status announcement. (Code + template/typecheck pass)
- [x] Add accessible GHS labels/alternative text across inventory, batch, and calculator. (Code + template/typecheck pass)
- [x] Convert inventory clickable cards/capacity selectors/FAB to semantic controls. (Code + template/typecheck pass)
- [x] Convert notification rows/action chips to semantic keyboard-operable actions. (Code + template/typecheck pass)

## Phase 3 — P2 dialogs, confirmations, forms, focus

- [x] Migrate core native `alert/confirm` calls to the shared confirmation/toast contract. (`rg` leaves only intentional `pending-changes.guard.ts` browser-native guard; typecheck pass)
- [x] Associate labels and controls in the touched authentication/inventory/target/config forms. (Shared `appFormLabelA11y` directive applied to dynamic forms + template/typecheck pass)
- [x] Add accessible names to touched notification/login/inventory icon-only buttons. (Code + template/typecheck pass)

## Phase 4 — P2 mobile/dense-data/progress

- [x] Fix mobile login truncation and footer density. (Code + template/typecheck pass; browser runtime still needs authenticated fixture only for other routes)
- [x] Add dense-table mobile affordances and preserve identity/status context. (Standards/Excel scroll hints + labelled regions; template/typecheck pass)
- [x] Expose progress overlay status and determinate progress semantics. (Code + `npx ngc -p tsconfig.app.json --noEmit` pass)

## Verification

- [x] Targeted unit tests pass. (`npm run test:notifications`: 13/13)
- [x] Angular template/typecheck passes. (`npx ngc -p tsconfig.app.json --noEmit`)
- [x] Production build passes. (`npm run build`; release notes v26.08.08-b05 synchronized; initial 1.41 MB raw / 330.51 kB estimated transfer)
- [x] Lint passes or the pre-existing non-UI lint defect is explicitly recorded. (Only pre-existing `smart-batch-firestore-rules.emulator.test.ts:503:23` remains)
- [ ] Keyboard-only smoke passes for changed controls. (Needs browser interaction pass)
- [ ] Authenticated runtime smoke passes at 320/360/390/768/1280px. (Unauthenticated login smoke passed at 390x844 and 1280x720; signed-in route fixture unavailable)
- [ ] Light/dark and reduced-motion states pass.
