import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function read(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('recipe shared UI primitive integration', () => {
  it('uses shared buttons, empty state and modal shell without changing specialized icon controls', () => {
    const component = read('./recipe-manager.component.ts');

    assert.match(component, /AppButtonComponent/);
    assert.match(component, /AppEmptyStateComponent/);
    assert.match(component, /AppModalShellComponent/);
    assert.match(component, /<app-button\b/);
    assert.match(component, /<app-empty-state\b/);
    assert.match(component, /<app-modal-shell\b/);
    assert.match(component, /modalBody/);
    assert.match(component, /modalFooter/);
    assert.match(component, /'Tạo công thức mới'/);
    assert.doesNotMatch(component, /fixed inset-0 z-\[60\]/);
    assert.doesNotMatch(component, /Tạo Công Thức/);
    assert.doesNotMatch(component, /Thêm Dòng/);
  });
});
