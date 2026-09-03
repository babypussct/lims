import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const source = readFileSync(new URL('./traceability.component.ts', import.meta.url), 'utf8');

describe('traceability shared UI primitive integration', () => {
  it('uses shared page header, action buttons and empty state while retaining QR lookup semantics', () => {
    assert.match(source, /AppButtonComponent/);
    assert.match(source, /AppEmptyStateComponent/);
    assert.match(source, /AppPageHeaderComponent/);
    assert.match(source, /<app-page-header\b/);
    assert.match(source, /\[variant\]="id \? 'detail' : 'page'"/);
    assert.match(source, /pageHeaderLeading/);
    assert.match(source, /pageHeaderActions/);
    assert.match(source, /pageHeaderMeta/);
    assert.match(source, /openLookup\(\)/);
    assert.match(source, /<app-button\b[^>]*type="submit"/);
    assert.match(source, /<app-button\b[^>]*variant="secondary"[^>]*\(click\)="startQrScan\(\)"/);
    assert.match(source, /<app-empty-state\b/);
    assert.match(source, /\(ngSubmit\)="submitLookup\(\)"/);
    assert.match(source, /#lookupInput/);
    assert.match(source, /max-w-7xl/);
    assert.match(source, /p-4 md:p-6/);
    assert.doesNotMatch(source, /<app-page-header[^>]*border/);
    assert.doesNotMatch(source, /<app-page-header[^>]*shadow/);
    assert.doesNotMatch(source, /slate-350|slate-850/);
  });
});
