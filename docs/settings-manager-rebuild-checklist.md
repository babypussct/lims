# Settings Manager Rebuild — Implementation & Acceptance Checklist

Date: 2026-09-04
Scope: Settings shell, Manager RBAC, Master Data, Backup/Recovery, Users/Roles, System settings, Consumption policy, Manager overview.

## Global constraints

- [x] Keep Settings navigation top-aligned; do not reintroduce an internal Settings sidebar.
- [x] Preserve existing working business modules; refactor routing/UX instead of deleting active capabilities.
- [x] Keep Manager as full-control override.
- [x] Allow delegated Staff access through granular permissions where the backend supports it.
- [x] Keep legacy URLs working through redirects.
- [x] Do not deploy destructive data migrations from runtime UI.
- [ ] Production deploy only after tests, typechecks, build, release discipline, clean commit and remote sync.

## Release A — RBAC & security

- [x] Create one shared permission catalog for labels, groups, descriptions and risk levels.
- [x] Add `system_manage`, `master_data_manage`, `policy_manage` permissions.
- [x] Expose `bypass_maintenance` in the permission UI.
- [x] Extend route guard to support `permissionsAny` for module-level delegated access.
- [x] Convert Manager Settings routes from role-only guards to granular permission policies.
- [x] Make Settings top navigation permission-aware for delegated Staff.
- [x] Keep unavailable actions visible-with-reason inside an accessible module.
- [x] Remove protected-admin email logic from client-side user management.
- [x] Enforce protected-account invariants in the trusted Firestore layer.
- [x] Add/update RBAC contract and emulator tests.

## Release B — Compact admin shell & Master Data

- [x] Use full profile hero only for account pages.
- [x] Use compact header/breadcrumb in administrative Settings pages.
- [x] Keep one admin top navigation row across all administrative pages.
- [x] Add lightweight segmented sub-navigation for Master Data.
- [x] Nest all Master Data editors under `/settings/data/master/*`.
- [x] Redirect `/master-targets`, `/target-groups`, `/matrix-types`, `/sample-description-master`, `/master-devices` to canonical Settings routes.
- [x] Update internal links/back buttons to canonical Settings URLs.
- [x] Preserve useful list/search state in URL where the editor already supports search/paging.
- [x] Remove runtime `Migrate data (- to _)` UI after a read-only production audit.
- [x] Audit `master_targets` versus `master_analytes` before any data-retirement decision.
- [x] Add navigation/deep-link regression tests.

## Release C — Backup, recovery, recycle bin & retention

- [x] Add permission-aware Backup actions for create / verify / restore.
- [x] Add human-readable backup health summary before technical details.
- [x] Separate Backup, Restore, Recycle Bin and Retention concepts in the UI.
- [x] Reclassify Excel archive as legacy reporting export rather than disaster recovery.
- [x] Remove Excel restore from production UI.
- [x] Retire the legacy runtime permanent-deletion path; destructive recycle-bin purge is handled by the guarded confirmation workflow.
- [x] Require explicit type-to-confirm for destructive retention/purge actions.
- [x] Preserve comprehensive backup create/resume/verify/dry-run/recover flows.
- [x] Add backup permission and safety contract tests.

## Release D — Users & roles

- [x] Present Users and Roles as one `Người dùng & quyền` module with two segmented views.
- [x] Make both editors consume the shared permission catalog.
- [x] Show inherited role permissions separately from per-user custom permissions.
- [x] Add permission search/filter for large catalogs.
- [x] Surface pending-user count/action prominently.
- [x] Keep last-manager protection.
- [x] Add inheritance and catalog single-source tests.

## Release E — System settings & consumption policy

- [x] Reorganize System into clear sections: Appearance, Print, Announcements, Maintenance, Advanced/Build info.
- [x] Treat version/build as read-only information, not an editable setting.
- [x] Use card-level save actions for forms and immediate-save semantics only where safe.
- [x] Verify global `showSignature` is wired into print defaults; otherwise remove the misleading switch.
- [x] Rename consumption page to `Chính sách hao hụt`.
- [x] Add impact preview and orphan/duplicate warnings to consumption policy.
- [x] Add relevant contract tests.

## Release F — Manager overview

- [x] Replace shortcut-only cards with action-driven operational status.
- [x] Show pending users, backup health, maintenance state and master-data counts when available.
- [x] Prioritize actionable warnings; show a healthy zero-inbox state when no action is needed.
- [x] Respect delegated-admin visibility and permissions.

## Acceptance matrix

- [x] Manager: full Settings access and all actions.
- [x] Staff normal: no administrative Settings modules.
- [x] Staff + `user_manage`: Users/Roles only.
- [x] Staff + `master_data_manage`: Master Data only.
- [x] Staff + `system_manage`: System only.
- [x] Staff + `policy_manage`: Consumption policy only.
- [x] Staff + `backup_create`: Backup visible; create enabled; verify/restore unavailable with reason.
- [x] Staff + `backup_verify`: Backup visible; verify enabled; create/restore unavailable with reason.
- [x] Staff + `backup_restore`: Backup visible; restore/dry-run enabled; create/verify unavailable with reason.
- [x] Viewer: no administrative Settings modules.
- [x] Pending: no administrative Settings modules.

Evidence: route/RBAC contracts pass in `test:settings`; delegated write boundaries and viewer/pending fail-closed behavior pass in the 42-case Firestore emulator suite; Backup action boundaries pass in `test:backup`; Manager authenticated UI passes the 6-state UI release audit. Production smoke verification remains a separate deploy gate below.

## Verification & deploy gates

- [x] `npm test`
- [x] `npx tsc -p tsconfig.app.json --noEmit`
- [x] `npm run typecheck:api`
- [x] `npm run build`
- [x] `npm run verify:ui-release`
- [x] Firestore emulator/rules tests after rules changes.
- [x] `git diff --check`
- [x] Release notes/version prepared (`v26.09.04-b02`).
- [x] `npm run release:verify`
- [ ] Commit on `main` and push so local HEAD matches upstream.
- [ ] `npm run release:predeploy`
- [ ] Deploy Firestore rules if changed.
- [ ] Deploy Vercel production.
- [ ] Verify production alias, deployed version and authenticated Settings navigation.
