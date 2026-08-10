# GAS / SOP compatibility review

Review date: 2026-08-10
Scope: current `gas/` source, Angular SOP configuration, report payload callers, GAS router, and source-level regression tests.

## Verdict

**The GAS and Angular `nhom-i` lists are aligned after the business clarification that `silafluofen` belongs to nhóm I.** The previous apparent mismatch was not a GAS defect; it was a stale frontend configuration, which has now been synchronized to 51 canonical analytes.

- `nhom-i` has 51 business analytes; both GAS and Angular now include `silafluofen`.

There are also two release gates that cannot be closed from repository source alone:

- the policy for `missing` versus `ND` in Form Đơn is still unresolved;
- the real Google Docs templates and deployed Web App/Drive runtime have not been smoke-tested.

Therefore the current result is: **the source-level GAS ↔ Angular analyte contract is compatible with the confirmed SOP list for nhóm I. Full operational approval still requires the Form Đơn policy decision and real template/deployment smoke evidence.**

## 1. SOP coverage matrix

The audit compared the 11 keys in `ANGULAR_SOP_CONFIG` with `CONFIG.SOP_CONFIG`, form type, configured template, router path, and canonical result columns.

| SOP/config key | Form | GAS route/template path | Cross-source result contract | Status |
| --- | --- | --- | --- | --- |
| `trifluralin-gcms` | Type 2 | custom Trifluralin reporter | single-analyte payload/columns match | Source-level pass |
| `fipronil-chlorpyrifos` | Type 2 | custom Fipronil/Chlorpyrifos reporter | 9-column payload contract matches | Source-level pass |
| `tbvtv-thuc-pham-gcmsms-rut-gon` | Type 2 | custom compact TBVTV reporter | 9-column payload contract matches | Source-level pass |
| `dichlorvos-gcms` | Type 3A | shared single-analyte reporter | columns/form type match | Source-level pass |
| `chloroform-gcms` | Type 3A | shared single-analyte reporter | columns/form type match | Source-level pass |
| `chlor-huu-co` | Type 3B | generic Type 3B + Form Check/Form Đơn variants | 28/28 canonical analytes | Source-level pass |
| `lan-huu-co` | Type 3B | generic Type 3B + Form Check/Form Đơn variants | 38/38 canonical analytes | Source-level pass |
| `nhom-cuc` | Type 3B | generic Type 3B + Form Check/Form Đơn variants | 14/14 canonical analytes | Source-level pass |
| `nhom-i` | Type 3B | generic Type 3B + Form Check/Form Đơn variants | **Business 51; GAS 51; Angular 51 including confirmed `silafluofen`** | **Source-level pass** |
| `tbvtv-thuc-pham-gcmsms` | Type 3B | generic Type 3B, full template only | 67/67 canonical analytes | Source-level pass |
| `tbvtv-trong-nuoc-gcmsms` | Type 3B | generic Type 3B + Form Check/Form Đơn variants | 121/121 canonical analytes | Source-level pass |

Additional routing checks passed source-level:

- all 11 Angular SOP keys have a corresponding GAS `SOP_CONFIG` entry and configured template;
- all five generic Type 3B Form Check/Form Đơn pairs resolve through `CONFIG.TEMPLATE_VARIANTS`;
- SOP 9.14 full and compact forms remain outside the generic Form Check/Form Đơn variant map;
- all configured form types match between Angular and GAS;
- the five custom routes resolve to their exact specialized reporter without generic fallback.

## 2. Business clarification and synchronization item

### GAS-SOP-001 — `silafluofen` is confirmed and synchronized for `nhom-i` (closed 2026-08-10)

Business clarification received on 2026-08-10: **nhóm I includes `silafluofen`**.

Consequent interpretation:

- GAS declares `silafluofen` in the `nhom-i` `resultColumns` and `compounds` lists at `gas/SOP_Configs.gs:537` and `gas/SOP_Configs.gs:548`.
- The Angular `nhom-i` contract now contains 51 canonical analytes in `src/app/features/results/config/sop-configs.ts`, including `silafluofen`.
- `compound-id-resolver.ts` already contains the canonical mapping for `Silafluofen → silafluofen`; no additional payload alias was required.
- The GAS-side list is retained, and the repository regression now checks the canonical analyte set across GAS and Angular for all six generic Type 3B SOPs.

Impact:

- The source-level GAS renderer and Angular contract now agree on the confirmed 51-analyte list.
- The real `nhom-i` Google Docs template remains an operational verification item because repository source cannot prove template contents or permissions.
- GAS and Angular analyte order is not treated as a cross-source defect: GAS controls report render order, while the regression enforces exact canonical set/count parity and separately enforces GAS `compounds`/`resultColumns` consistency.

Remediation checklist:

- [x] Confirm with the SOP owner that `Silafluofen` is part of `nhom-i` (business clarification received 2026-08-10).
- [x] Add `silafluofen` deliberately to the Angular `nhom-i` config; the existing canonical payload mapping is retained.
- [x] Add a cross-source regression that canonicalizes GAS display compounds and asserts exact set/count parity with each Angular generic Type 3B SOP analyte list.
- [x] Retain `silafluofen` in the GAS `nhom-i.resultColumns` and `nhom-i.compounds` lists.

Acceptance criteria:

- every generic Type 3B SOP has exact canonical analyte set/count parity between frontend and GAS; GAS `compounds` and `resultColumns` retain exact render-order parity;
- `nhom-i` has 51 entries in Angular, GAS, and the real template, including `silafluofen`;
- the regression fails before merge when a list is added, removed, reordered, or aliased inconsistently.

## 3. Open release gates

### 3.1 `missing` versus `ND` policy

- [ ] Business owner confirms the intended Form Đơn behavior when a result key is absent from every payload source.
- [ ] Implement and test the chosen behavior without collapsing `missing`, `0`, `ND`, `N/A`, and empty string.

Current source behavior: `resolveFormDonResultValue()` preserves explicit `0`, `"0"`, `ND`, `N/A`, and explicit empty values, but falls back to `ND` when no result value exists at all. This is a business-dependent item, not something to mark correct from source inspection alone.

### 3.2 Real template and deployment smoke tests

- [ ] Run a Drive sandbox smoke test for all 16 configured Google Docs template IDs, including Type 2, Type 3A, Type 3B Form Check, Type 3B Form Đơn, and SOP 9.14 full/compact templates.
- [ ] Verify each generated Doc/PDF has the expected sample count, analyte sequence, QC state, signature fields, page count, and no unresolved required placeholders.
- [ ] Verify the deployed Web App uses the reviewed `appsscript.json`, Firebase project/app namespace, OAuth scopes, and the same template IDs as source.
- [ ] Store the runtime evidence and golden output references before marking the release gate complete.

Source-level preflight and in-memory mocks cannot prove merged-cell behavior, real placeholder placement, template drift, deployment access, or Drive permissions.

## 4. Verification evidence

- [x] `npm.cmd run test:gas` — 65/65 pass, including cross-source Type 3B analyte parity and the 51-entry `nhom-i` assertion.
- [x] `npm.cmd test` — exit 0; standards, notifications, documents, Excel import, Smart Batch/Firestore emulator (17/17), daily checklists, and GAS suites pass. The Firestore emulator cleanup left no listener on port 8080.
- [x] `npx.cmd tsc -p tsconfig.app.json --noEmit --pretty false` — pass.
- [x] `npm.cmd run typecheck:api` — pass.
- [x] `npm.cmd run build` — pass with release metadata `v26.08.10-b01`.
- [x] `git diff --check` — no whitespace error.
- [x] Source-level auth, authorization, archive ownership, upload validation/idempotency, report idempotency, rollback, pagination, header contract, QC-missing behavior, numeric-zero handling, and custom route tests pass.
- [x] Cross-source analyte parity — GAS and Angular both contain 51 canonical `nhom-i` analytes, including `silafluofen`; the regression passes.
- [ ] Real Google Docs/Drive and deployed Web App smoke test — not run in this repository-only review.

## 5. Release recommendation

The `silafluofen` concern is closed as a GAS defect based on the business clarification and the Angular synchronization is complete. The source-level release slice can proceed after the current full validation and metadata checks. Operational approval of the whole report flow still requires the Form Đơn `missing` policy and real template/deployment smoke tests, which must remain explicitly open until verified.
