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
  it('uses the shared page header for the administrator configuration shell', () => {
    const source = read('./config.component.ts');

    assert.match(source, /AppPageHeaderComponent/);
    assert.match(source, /AppButtonComponent/);
    assert.match(source, /<app-page-header\b/);
    assert.match(source, /title="Cấu hình hệ thống"/);
    assert.match(source, /Bật thông báo/);
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
    assert.match(source, /\(click\)="saveRole\(\)" \[disabled\]="roleForm\.invalid"/);
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
    assert.match(source, /\(click\)="saveUser\(user\); closePermModal\(\)"/);
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
});
