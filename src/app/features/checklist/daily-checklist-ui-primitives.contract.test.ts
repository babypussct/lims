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

  it('renders sample codes in order with bold codes and normal-weight descriptions on screen and print', () => {
    const template = read('./daily-checklist.component.html');
    const component = read('./daily-checklist.component.ts');

    assert.match(template, /@for \(sample of group\.samples; track sample\.sampleId; let isLast = \$last\)/);
    assert.match(template, /class="font-mono font-black"[^>]*>\{\{sample\.sampleId\}\}<\/span>/);
    assert.match(template, /font-sans font-normal text-fuchsia-700[^>]*> \(\{\{sample\.description\.nameSnapshot\}\}\)<\/span>/);
    assert.doesNotMatch(template, /font-sans font-bold text-fuchsia-700/);
    assert.match(template, /class="cl-print-sample-code">\{\{sample\.sampleId\}\}<\/span>/);
    assert.match(template, /class="cl-print-sample-description"> \(\{\{sample\.description\.nameSnapshot\}\}\)<\/span>/);
    assert.match(template, /class="cl-print-sample-separator">; <\/span>/);
    assert.match(component, /\.cl-print-sample-code \{[\s\S]*?font-weight: 800 !important;/);
    assert.match(component, /\.cl-print-sample-description,[\s\S]*?\.cl-print-sample-separator \{[\s\S]*?font-weight: 400 !important;/);
  });
});
