import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function read(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('inventory shared UI primitive integration', () => {
  it('uses shared page, toolbar, button and empty-state primitives without changing inventory logic', () => {
    const component = read('./inventory.component.ts');
    const template = read('./inventory.component.html');

    assert.match(component, /AppButtonComponent/);
    assert.match(component, /AppEmptyStateComponent/);
    assert.match(component, /AppPageHeaderComponent/);
    assert.match(component, /AppToolbarComponent/);
    assert.match(template, /<app-page-header\b/);
    assert.match(template, /<app-toolbar\b/);
    assert.match(template, /toolbarSearch/);
    assert.match(template, /<app-button\b/);
    assert.match(template, /<app-empty-state\b/);
    assert.match(template, /<app-skeleton\b/);
    assert.match(template, /title="Quản lý kho hóa chất"/);
    assert.match(template, />\s*Danh sách\s*</);
    assert.match(template, />\s*Năng lực\s*</);
    assert.match(template, /Xem thêm\.\.\./);
    assert.match(template, />\s*Chọn quy trình\s*</);
    assert.match(template, />\s*Một mẫu\s*</);
    assert.match(template, /Cảnh báo hóa học/);
    assert.match(template, /Cảnh báo nguy hiểm \(H\):/);

    // Spatial anchor and borderless page header contracts
    assert.match(template, /class="[^"]*p-4 md:p-6[^"]*"/);
    assert.doesNotMatch(template, /<app-page-header[^>]*border/);
    assert.doesNotMatch(template, /<app-page-header[^>]*shadow/);
  });

  it('keeps the responsive inventory bottom sheet on the existing accessible modal boundary', () => {
    const component = read('./inventory.component.ts');
    const template = read('./inventory.component.html');

    assert.match(component, /ModalA11yDirective/);
    assert.match(template, /appModalA11y/);
    assert.match(template, /items-end md:items-center/);
    assert.match(template, /rounded-t-2xl md:rounded-2xl/);
    assert.doesNotMatch(template, /<app-modal-shell\b/);
  });
});
