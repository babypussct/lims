import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function read(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('results list shared UI primitive integration', () => {
  it('uses shared page, toolbar, button and empty-state primitives for generic results chrome', () => {
    const component = read('./result-list.component.ts');

    assert.match(component, /AppButtonComponent/);
    assert.match(component, /AppEmptyStateComponent/);
    assert.match(component, /AppPageHeaderComponent/);
    assert.match(component, /AppToolbarComponent/);
    assert.match(component, /<app-page-header\b/);
    assert.match(component, /pageHeaderActions/);
    assert.match(component, /title="Tra cứu và quản lý kết quả mẻ chạy"/);
    assert.match(component, /<app-toolbar\b/);
    assert.match(component, /toolbarSearch/);
    assert.match(component, /toolbarFilters/);
    assert.match(component, /toolbarActions/);
    assert.match(component, /<app-button\b/);
    assert.match(component, /<app-empty-state\b/);
    assert.match(component, /Xóa bộ lọc/);
    assert.match(component, /Báo cáo PDF/);
    assert.match(component, /Chi tiết mẻ chạy/);
  });

  it('keeps results-specific stateful controls and complex modals on their existing boundaries', () => {
    const component = read('./result-list.component.ts');

    assert.match(component, /<button[^>]*\(click\)="setStatusFilter\('pending'\)"/);
    assert.match(component, /<button[^>]*\(click\)="viewMode\.set\('grid'\)"/);
    assert.match(component, /<button[^>]*\(click\)="toggleMergeMode\(\)"/);
    assert.match(component, /<button[^>]*\(click\)="previousPage\(\)"/);
    assert.match(component, /<app-merge-runs-modal\b/);
    assert.match(component, /<app-report-hub-modal\b/);
    assert.doesNotMatch(component, /<app-modal-shell\b/);
  });
});
