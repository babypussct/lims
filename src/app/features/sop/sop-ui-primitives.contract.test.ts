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
    assert.match(template, /<app-button\b[^>]*\(click\)="save\(\)"/);
    assert.match(template, /<app-button\b[^>]*\(click\)="goBack\(\)"/);
    assert.equal((template.match(/<app-modal-shell\b/g) || []).length, 3);
    assert.doesNotMatch(template, /fa-times/);
  });
});
