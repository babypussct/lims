import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function read(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('requests list shared UI primitive integration', () => {
  it('uses shared page header, spatial shell, and soft-ui-segmented control for request tabs', () => {
    const component = read('./request-list.component.ts');

    assert.match(component, /AppPageHeaderComponent/);
    assert.match(component, /<app-page-header\b/);
    assert.match(component, /title="Quản lý yêu cầu"/);
    assert.match(component, /subtitle="Phê duyệt yêu cầu, tra cứu mẻ và mở phiếu phân tích\."/);
    assert.match(component, /icon="fa-list-check"/);

    // Spatial anchor and borderless header contract
    assert.match(component, /class="[^"]*p-4 md:p-6[^"]*"/);
    assert.doesNotMatch(component, /<app-page-header[^>]*border/);
    assert.doesNotMatch(component, /<app-page-header[^>]*shadow/);

    // Soft UI Segmented Control contract
    assert.match(component, /class="[^"]*\bsoft-ui-segmented\b[^"]*"/);
    assert.match(component, /class="[^"]*\binline-flex\b[^"]*"/);
    assert.match(component, /role="group"/);
    assert.match(component, /aria-label="Trạng thái yêu cầu"/);
    assert.match(component, /type="button"[\s\S]*?\(click\)="setCurrentTab\('pending'\)"/);
    assert.match(component, /type="button"[\s\S]*?\(click\)="setCurrentTab\('approved'\)"/);
    assert.doesNotMatch(component, /setCurrentTab\('printing'\)/);
    assert.match(component, /soft-ui-segmented__item--active/);
    assert.match(component, /\[attr\.aria-pressed\]="currentTab\(\) === 'pending'"/);
  });

  it('selects worksheets in a shared modal with touch-friendly controls and both projection slots', () => {
    const component = read('../../shared/components/batch-worksheet-picker/batch-worksheet-picker.component.ts');
    assert.match(component, /<app-modal-shell/);
    assert.match(component, /modalBody/);
    assert.match(component, /modalFooter/);
    assert.match(component, /min-h-11/);
    assert.match(component, /min-h-12/);
    assert.match(component, /worksheetReference/);
    assert.doesNotMatch(component, /Xóa phiếu|đã in|chưa in/i);
  });
});
