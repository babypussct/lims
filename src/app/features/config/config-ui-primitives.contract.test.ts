import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function read(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

function assertManagerShell(source: string, template: string): void {
  assert.match(source, /AppButtonComponent/);
  assert.match(source, /AppEmptyStateComponent/);
  assert.match(source, /AppModalShellComponent/);
  assert.match(source, /AppPageHeaderComponent/);
  assert.match(template, /<app-page-header\b/);
  assert.match(template, /pageHeaderActions/);
  assert.match(template, /<app-button\b/);
  assert.match(template, /<app-empty-state\b/);
  assert.match(template, /<app-modal-shell\b/);
  assert.match(template, /\[closeOnBackdrop\]="false"/);
  assert.doesNotMatch(template, /class="[^"]*fixed inset-0/);
}

function assertInlineModalMigration(source: string): void {
  assert.match(source, /AppButtonComponent/);
  assert.match(source, /AppModalShellComponent/);
  assert.match(source, /<app-modal-shell\b/);
  assert.match(source, /\[closeOnBackdrop\]="false"/);
  assert.match(source, /<app-button\b/);
  assert.doesNotMatch(source, /class="[^"]*fixed inset-0/);
}

describe('config shared UI primitive integration', () => {
  it('uses the route-based Settings Center instead of the legacy tab shell', () => {
    const shell = read('../settings/settings-shell.component.ts');
    const routes = read('../../app.routes.ts');
    const navigation = read('../../core/layout/navigation.config.ts');

    assert.doesNotMatch(shell, /AppPageHeaderComponent/);
    assert.doesNotMatch(shell, /<app-page-header\b/);
    assert.match(shell, /getUserRoleLabel\(auth\.currentUser\(\)\?\.role\)/);
    assert.match(shell, /v\{\{ state\.systemVersion\(\) \}\}/);
    assert.match(shell, /<router-outlet\s*\/>/);
    assert.match(shell, /Tìm cài đặt/);
    assert.match(shell, /\/settings\/account\/profile/);
    assert.match(shell, /\/settings\/data\/backups/);
    assert.match(routes, /path: 'settings'/);
    assert.match(routes, /path: 'account\/security'/);
    assert.match(routes, /path: 'data\/master'/);
    assert.match(routes, /path: 'data\/backups'/);
    assert.match(routes, /path: 'access\/users'/);
    assert.match(routes, /path: 'access\/roles'/);
    assert.match(routes, /path: 'policies\/consumption'/);
    assert.match(routes, /path: 'config',[\s\S]*redirectTo: 'settings\/account\/profile'/);
    assert.match(navigation, /'settings': 'Cài Đặt'/);
    assert.doesNotMatch(navigation, /'config': 'Cài Đặt'/);
  });

  it('partitions the general settings surface by domain while preserving backup workflows', () => {
    const source = read('./components/config-general.component.ts');
    const template = read('./components/config-general.component.html');

    assert.match(source, /input\.required<'system' \| 'master' \| 'backup' \| 'data' \| 'diagnostics'>\(\)/);
    assert.doesNotMatch(source, /'all'/);
    assert.doesNotMatch(template, /view\(\) === 'all'/);
    assert.match(template, /view\(\) === 'master'/);
    assert.match(template, /view\(\) === 'backup'/);
    assert.match(template, /view\(\) === 'diagnostics'/);
    assert.match(template, /createComprehensiveBackup\(\)/);
    assert.match(template, /verifySelectedBackup\(\)/);
    assert.match(template, /recoverMissingFromSelectedBackup\(\)/);
  });

  it('migrates master-device generic chrome without changing modal close semantics', () => {
    const source = read('./master-device-manager.component.ts');
    const template = read('./master-device-manager.component.html');

    assertManagerShell(source, template);
    assert.equal(template.match(/<app-modal-shell\b/g)?.length, 1);
    assert.match(template, /title="Quản lý thiết bị phân tích"/);
    assert.match(template, />\s*Thêm thiết bị\s*</);
    assert.doesNotMatch(template, /Quản Lý Thiết Bị Phân Tích|Thêm Thiết Bị/);
  });

  it('migrates matrix-type generic chrome and normalizes visible labels', () => {
    const source = read('./matrix-type-manager.component.ts');
    const template = read('./matrix-type-manager.component.html');

    assertManagerShell(source, template);
    assert.equal(template.match(/<app-modal-shell\b/g)?.length, 1);
    assert.match(template, /title="Quản lý nền mẫu phân tích"/);
    assert.match(template, />Màu sắc</);
    assert.doesNotMatch(template, /Quản Lý Nền Mẫu Phân Tích|Thêm Nền Mẫu|Màu Sắc/);
  });

  it('migrates sample-description toolbar, empty state and both modals while preserving file import', () => {
    const source = read('./sample-description-master.component.ts');
    const template = read('./sample-description-master.component.html');

    assertManagerShell(source, template);
    assert.match(source, /AppToolbarComponent/);
    assert.match(template, /<app-toolbar\b/);
    assert.match(template, /toolbarSearch/);
    assert.match(template, /toolbarFilters/);
    assert.equal(template.match(/<app-modal-shell\b/g)?.length, 2);
    assert.equal(template.match(/\[closeOnBackdrop\]="false"/g)?.length, 2);
    assert.match(template, /type="file"[^>]*\(change\)="onFileSelected\(\$event\)"/);
    assert.match(template, />Xác nhận nhập dữ liệu</);
    assert.doesNotMatch(template, /Danh Mục Mô Tả Mẫu|Thêm Mô Tả|Xác Nhận Nhập Dữ Liệu/);
  });

  it('migrates config roles modal chrome while preserving the role form and permission matrix', () => {
    const source = read('./components/config-roles.component.ts');

    assertInlineModalMigration(source);
    assert.match(source, /AppEmptyStateComponent/);
    assert.match(source, /<app-empty-state\b/);
    assert.equal(source.match(/<app-modal-shell\b/g)?.length, 1);
    assert.match(source, /id="role-config-form" appFormLabelA11y \[formGroup\]="roleForm"/);
    assert.match(source, /\(change\)="togglePermSelected\(perm\.val\)"/);
    assert.match(source, /\(click\)="saveRole\(\)" \[disabled\]="roleForm\.invalid \|\| savingRole\(\)" \[loading\]="savingRole\(\)"/);
    assert.match(source, /\(closed\)="closeModal\(\)"/);
  });

  it('migrates config users permissions modal chrome without forcing specialized filters through primitives', () => {
    const source = read('./components/config-users.component.ts');

    assertInlineModalMigration(source);
    assert.match(source, /AppEmptyStateComponent/);
    assert.match(source, /<app-empty-state\b/);
    assert.equal(source.match(/<app-modal-shell\b/g)?.length, 1);
    assert.match(source, /roleFilter\.set\('pending'\)/);
    assert.match(source, /permStatusFilter\.set\(\$event\)/);
    assert.match(source, /\(change\)="togglePerm\(user, perm\.val\)"/);
    assert.match(source, /\(click\)="saveUserFromModal\(user\)"/);
    assert.match(source, /if \(await this\.saveUser\(u\)\) this\.closePermModal\(\)/);
    assert.match(source, /\(closed\)="closePermModal\(\)"/);
  });

  it('migrates config general recycle-bin modal chrome while preserving destructive workflow semantics', () => {
    const source = read('./components/config-general.component.ts');
    const template = read('./components/config-general.component.html');

    assert.match(source, /AppButtonComponent/);
    assert.match(source, /AppModalShellComponent/);
    assert.match(template, /<app-modal-shell\b/);
    assert.match(template, /\[closeOnBackdrop\]=\"false\"/);
    assert.match(template, /\(closed\)=\"showRecycleBin\.set\(false\)\"/);
    assert.match(template, /\(click\)=\"restoreRecycleItem\(item\)\"/);
    assert.match(template, /variant=\"danger\" \[disabled\]=\"recycleItems\(\)\.length === 0\" \(click\)=\"emptyRecycleBin\(\)\"/);
    assert.match(template, /@if\(isRecycling\(\)\)/);
    assert.doesNotMatch(template, /class=\"[^\"]*fixed inset-0/);
  });

  it('renders responsive safety rules with mobile stacked cards and valid utility classes', () => {
    const safetySource = read('./components/config-safety.component.ts');
    const generalTemplate = read('./components/config-general.component.html');

    // Mobile stacked cards and desktop table
    assert.match(safetySource, /block sm:hidden space-y-3/);
    assert.match(safetySource, /hidden sm:block/);
    assert.match(safetySource, /min-w-\[420px\]/);

    // CSS cleanliness
    assert.doesNotMatch(safetySource, /list-circle/);
    assert.doesNotMatch(safetySource, /\b[hw]-8\.5\b/);
    assert.doesNotMatch(generalTemplate, /active:scale-98(?![-\[])/);
  });
});
