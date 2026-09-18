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
    assert.match(component, /subtitle="Phê duyệt yêu cầu, theo dõi lịch sử và quản lý hàng đợi in\."/);
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
    assert.match(component, /type="button"[\s\S]*?\(click\)="setCurrentTab\('printing'\)"/);
    assert.match(component, /soft-ui-segmented__item--active/);
    assert.match(component, /\[attr\.aria-pressed\]="currentTab\(\) === 'pending'"/);
  });

  it('keeps the print queue readable on phones with cards and preserves the desktop table', () => {
    const component = read('./print-queue.component.ts');

    assert.match(component, /flex-1 overflow-y-auto p-2 md:hidden/);
    assert.match(component, /hidden flex-1 overflow-y-auto md:block/);
    assert.match(component, /<article class="rounded-xl border border-slate-200 p-3 transition/);
    assert.match(component, /aria-label="In phiếu này"/);
    assert.match(component, /aria-label="Sửa mẻ trước khi in"/);
    assert.match(component, /aria-label="Xóa phiếu này"/);
    assert.match(component, /flex h-10 w-10 items-center justify-center/);
  });
});
