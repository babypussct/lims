import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function read(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('targets shared UI primitive integration', () => {
  it('migrates target-group standard actions, empty states and library modal', () => {
    const component = read('./target-group-manager.component.ts');

    assert.match(component, /AppButtonComponent/);
    assert.match(component, /AppEmptyStateComponent/);
    assert.match(component, /AppModalShellComponent/);
    assert.match(component, /AppPageHeaderComponent/);
    assert.match(component, /<app-page-header\b/);
    assert.match(component, /pageHeaderActions/);
    assert.match(component, /<app-button\b/);
    assert.match(component, /<app-empty-state\b/);
    assert.match(component, /<app-modal-shell\b/);
    assert.match(component, /title="Quản lý nhóm chỉ tiêu"/);
    assert.doesNotMatch(component, /fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900\/50/);
    assert.match(component, /class="[^"]*p-4 md:p-6[^"]*"/);
    assert.doesNotMatch(component, /<app-page-header[^>]*border/);
    assert.doesNotMatch(component, /<app-page-header[^>]*shadow/);
    assert.doesNotMatch(component, /Tạo Mới/);
    assert.doesNotMatch(component, /Chọn Hết/);
    assert.doesNotMatch(component, /Thay thế Chỉ tiêu/);
  });

  it('migrates master-target standard actions, empty state and both modals', () => {
    const component = read('./master-target-manager.component.ts');

    assert.match(component, /AppButtonComponent/);
    assert.match(component, /AppEmptyStateComponent/);
    assert.match(component, /AppModalShellComponent/);
    assert.match(component, /AppPageHeaderComponent/);
    assert.match(component, /AppToolbarComponent/);
    assert.match(component, /<app-page-header\b/);
    assert.match(component, /pageHeaderActions/);
    assert.match(component, /<app-toolbar\b/);
    assert.match(component, /toolbarSearch/);
    assert.match(component, /<app-button\b/);
    assert.match(component, /<app-empty-state\b/);
    assert.equal(component.match(/<app-modal-shell\b/g)?.length, 2);
    assert.match(component, /title="Thư viện chỉ tiêu gốc"/);
    assert.doesNotMatch(component, /fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900\/50/);
    assert.doesNotMatch(component, /fixed inset-0 z-\[60\] flex items-center justify-center p-4 bg-slate-900\/50/);
    assert.doesNotMatch(component, /Migrate Data \(- To _\)/);
    assert.doesNotMatch(component, /Thêm Chỉ Tiêu/);
    assert.doesNotMatch(component, /Xem Trước Import/);
    assert.doesNotMatch(component, /Xác nhận Import/);
  });
});
