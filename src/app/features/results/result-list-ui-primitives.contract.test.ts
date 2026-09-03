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
    assert.match(component, /Chi tiết mẻ chạy/);

    // Spatial anchor, borderless page header, and soft-ui-segmented control
    assert.match(component, /class="[^"]*p-4 md:p-6[^"]*"/);
    assert.match(component, /class="[^"]*\bsoft-ui-segmented\b[^"]*"/);
    assert.match(component, /class="[^"]*\binline-flex\b[^"]*"/);
    assert.match(component, /aria-label="Lọc trạng thái mẻ phân tích"/);
    assert.doesNotMatch(component, /<app-page-header[^>]*border/);
    assert.doesNotMatch(component, /<app-page-header[^>]*shadow/);
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

describe('results entry shared UI primitive integration', () => {
  it('uses shared modal, button and empty-state primitives for generic entry chrome', () => {
    const component = read('./result-entry.component.ts');
    const template = read('./result-entry.component.html');

    assert.match(component, /AppButtonComponent/);
    assert.match(component, /AppEmptyStateComponent/);
    assert.match(component, /AppModalShellComponent/);
    assert.doesNotMatch(component, /ModalA11yDirective/);
    assert.match(template, /<app-empty-state\b/);
    assert.match(template, /<app-button\b/);
    assert.equal((template.match(/<app-modal-shell\b/g) ?? []).length, 2);
    assert.doesNotMatch(template, /fixed inset-0/);
    assert.match(template, />\s*Quay lại danh sách\s*</);
    assert.match(template, />\s*Hủy\s*</);
    assert.match(template, />\s*Xóa và khởi tạo lại\s*</);
  });

  it('keeps SOP-specific entry controls behind their existing specialized components', () => {
    const template = read('./result-entry.component.html');
    const header = read('./components/result-entry-header.component.html');

    assert.match(template, /<app-result-entry-header\b/);
    assert.match(template, /<app-result-prefix-tabs\b/);
    assert.match(template, /<app-sop-entry-outlet\b/);
    assert.match(template, /<app-excel-result-import-modal\b/);
    assert.match(template, /Tách phiếu in/);
    assert.match(template, /samplesPerReport\.set/);
    assert.doesNotMatch(header, /Tách phiếu in/);
  });

  it('uses the shared detail header contract on batch details', () => {
    const component = read('../results-view/batch-detail-view.component.ts');

    assert.match(component, /AppPageHeaderComponent/);
    assert.match(component, /<app-page-header\b/);
    assert.match(component, /variant="detail"/);
    assert.match(component, /pageHeaderLeading/);
    assert.match(component, /pageHeaderActions/);
    assert.match(component, /pageHeaderMeta/);
    assert.match(component, /title="Chi tiết kết quả mẻ phân tích"/);
  });
});
