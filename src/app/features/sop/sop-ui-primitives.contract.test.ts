import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function read(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('SOP shared UI primitive integration', () => {
  it('keeps calculator library search/actions and empty state on shared primitives', () => {
    const source = read('./calculator/calculator.component.ts');
    const template = read('./calculator/calculator.component.html');

    assert.match(source, /AppButtonComponent/);
    assert.match(source, /AppEmptyStateComponent/);
    assert.match(source, /AppPageHeaderComponent/);
    assert.match(source, /AppToolbarComponent/);
    assert.match(template, /<app-page-header\b/);
    assert.match(template, /variant="workspace"/);
    assert.match(template, /pageHeaderLeading/);
    assert.match(template, /pageHeaderActions/);
    assert.match(template, /\[title\]="currentSop\.name"/);
    assert.match(template, /\(click\)="clearSelection\(\)"/);
    assert.match(template, /\(click\)="onPrintDraft\(currentSop\)"/);
    assert.match(template, /variant="page"/);
    assert.match(template, /<app-toolbar\b/);
    assert.match(template, /<app-button\b/);
    assert.match(template, /<app-empty-state\b/);
    assert.match(template, /<app-button\b[^>]*\[fullWidth\]="true"/);
  });

  it('uses shared buttons for editor save/back and modal shell for selection workspaces', () => {
    const source = read('./editor/sop-editor.component.ts');
    const template = read('./editor/sop-editor.component.html');

    assert.match(source, /AppButtonComponent/);
    assert.match(source, /AppModalShellComponent/);
    assert.match(source, /AppPageHeaderComponent/);
    assert.match(source, /:host\s*\{[\s\S]*height: 100%;[\s\S]*min-height: 0;/);
    assert.match(template, /<app-page-header\b/);
    assert.match(template, /variant="workspace"/);
    assert.match(template, /\[sticky\]="true"/);
    assert.match(template, /pageHeaderLeading/);
    assert.match(template, /pageHeaderActions/);
    assert.match(template, /\[formControl\]="form\.controls\.version"/);
    assert.match(template, /data-sop-editor-layout class="flex-1 flex flex-col overflow-hidden relative lg:flex-row"/);
    assert.match(template, /data-sop-editor-form-panel/);
    assert.match(template, /data-sop-editor-preview class="flex h-56 max-h-\[32dvh\] w-full[^\"]*lg:h-auto[^\"]*lg:w-96/);
    assert.match(template, /class="h-full w-10 bg-transparent/);
    assert.match(template, /\+ Thêm Trường Nhập<\/button>/);
    assert.match(template, /min-h-10 w-full border border-slate-300[^\"]*md:min-h-0/);
    assert.match(template, /<app-button\b[^>]*\(click\)="save\(\)"/);
    assert.match(template, /<app-button\b[^>]*\(click\)="goBack\(\)"/);
    assert.doesNotMatch(template, /class="h-14 bg-white/);
    assert.equal((template.match(/<app-modal-shell\b/g) || []).length, 3);
    assert.doesNotMatch(template, /fa-times/);
  });
});
