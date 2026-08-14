import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function read(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('documents shared UI primitive integration', () => {
  it('uses shared page, toolbar, button and empty/skeleton primitives on the documents browser', () => {
    const component = read('./documents.component.ts');

    assert.match(component, /AppButtonComponent/);
    assert.match(component, /AppEmptyStateComponent/);
    assert.match(component, /AppPageHeaderComponent/);
    assert.match(component, /AppToolbarComponent/);
    assert.match(component, /SkeletonComponent/);
    assert.match(component, /<app-page-header\b/);
    assert.match(component, /title="Phiếu giao nhận mẫu"/);
    assert.match(component, /<app-toolbar\b/);
    assert.match(component, /toolbarSearch/);
    assert.match(component, /toolbarActions/);
    assert.match(component, /<app-button\b[^>]*emptyStateActions/);
    assert.match(component, /<app-empty-state\b/);
    assert.match(component, /<app-skeleton\b/);
  });

  it('keeps document preview as an explicit fullscreen viewer boundary', () => {
    const preview = read('./document-preview-modal.component.ts');

    assert.match(preview, /document-preview-overlay fixed inset-0 z-\[100\]/);
    assert.match(preview, /role="dialog"/);
    assert.match(preview, /aria-modal="true"/);
    assert.match(preview, /aria-labelledby="document-preview-title"/);
    assert.match(preview, /@HostListener\('document:keydown'/);
    assert.match(preview, /event\.key === 'Escape'/);
    assert.match(preview, /event\.key !== 'Tab'/);
    assert.match(preview, /document\.fullscreenElement/);
    assert.match(preview, /this\.previousFocus\?\.focus\(\)/);
    assert.doesNotMatch(preview, /AppModalShellComponent/);
    assert.doesNotMatch(preview, /<app-modal-shell\b/);
  });
});
