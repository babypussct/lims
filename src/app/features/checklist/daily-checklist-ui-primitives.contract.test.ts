import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function read(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('daily checklist shared UI primitive integration', () => {
  it('uses shared page, toolbar, button and empty-state primitives for generic chrome', () => {
    const component = read('./daily-checklist.component.ts');
    const template = read('./daily-checklist.component.html');

    assert.match(component, /AppButtonComponent/);
    assert.match(component, /AppEmptyStateComponent/);
    assert.match(component, /AppPageHeaderComponent/);
    assert.match(component, /AppToolbarComponent/);
    assert.match(template, /<app-page-header\b/);
    assert.match(template, /title="Bảng theo dõi mẫu ngày"/);
    assert.match(template, /pageHeaderActions/);
    assert.match(template, /<app-toolbar\b/);
    assert.match(template, /toolbarSearch/);
    assert.match(template, /toolbarFilters/);
    assert.match(template, /toolbarActions/);
    assert.match(template, /<app-button\b[^>]*\(click\)="refreshData\(\)"/);
    assert.match(template, /<app-empty-state\b[\s\S]*title="Chưa có mẻ theo ngày phân tích này"/);
    assert.match(template, /<app-button\b[^>]*emptyStateActions[^>]*\(click\)="clearFilters\(\)"/);
  });

  it('keeps embedded, date/view controls, progressive loading and print layout as domain-specific boundaries', () => {
    const template = read('./daily-checklist.component.html');
    const component = read('./daily-checklist.component.ts');

    assert.match(template, /@if \(!embedded\)/);
    assert.match(template, /Theo Dõi Mẫu & Kết Quả Ngày/);
    assert.match(template, /moveAvailableDate\('older'\)/);
    assert.match(template, /moveAvailableDate\('newer'\)/);
    assert.match(template, /type="date"/);
    assert.match(template, /role="group" aria-label="Chế độ hiển thị card"/);
    assert.match(template, /setViewMode\(option\.value\)/);
    assert.match(template, /Đã nhận \{\{loadedBatchCount\(\)\}\} mẻ phù hợp\./);
    assert.match(template, /class="cl-print-document cl-print-only"/);
    assert.match(component, /printDocument\(\)/);
    assert.match(component, /#print-container/);
  });
});
