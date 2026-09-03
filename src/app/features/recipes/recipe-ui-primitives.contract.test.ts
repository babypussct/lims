import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function read(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('recipe shared UI primitive integration', () => {
  it('uses shared page header, toolbar, buttons, empty state and modal shell without changing specialized icon controls', () => {
    const component = read('./recipe-manager.component.ts');

    assert.match(component, /AppPageHeaderComponent/);
    assert.match(component, /AppToolbarComponent/);
    assert.match(component, /AppButtonComponent/);
    assert.match(component, /AppEmptyStateComponent/);
    assert.match(component, /AppModalShellComponent/);
    assert.match(component, /<app-page-header\b/);
    assert.match(component, /pageHeaderActions/);
    assert.match(component, /<app-toolbar\b/);
    assert.match(component, /toolbarSearch/);
    assert.match(component, /<app-button\b/);
    assert.match(component, /<app-empty-state\b/);
    assert.match(component, /<app-modal-shell\b/);
    assert.match(component, /modalBody/);
    assert.match(component, /'Tạo công thức mới'/);
    assert.match(component, /class="[^"]*p-4 md:p-6[^"]*"/);
    assert.doesNotMatch(component, /<app-page-header[^>]*border/);
    assert.doesNotMatch(component, /<app-page-header[^>]*shadow/);
    assert.doesNotMatch(component, /fixed inset-0 z-\[60\]/);
    assert.doesNotMatch(component, /Tạo Công Thức/);
    assert.doesNotMatch(component, /Thêm Dòng/);
    assert.doesNotMatch(component, /Không Có Quyền Truy Cập/);
    assert.match(component, /aria-label="Sửa công thức"/);
    assert.match(component, /aria-label="Xóa công thức"/);
    assert.match(component, /filteredRecipes = computed/);
    assert.match(component, /Không tìm thấy công thức/);
    assert.match(component, /emptyStateActions/);
  });
});
