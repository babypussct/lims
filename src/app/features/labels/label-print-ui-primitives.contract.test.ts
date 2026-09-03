import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function read(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('label print shared UI primitive integration', () => {
  it('uses the shared page header and workflow-level buttons', () => {
    const component = read('./label-print.component.ts');
    const template = read('./label-print.component.html');

    assert.match(component, /AppButtonComponent/);
    assert.match(component, /AppPageHeaderComponent/);
    assert.match(template, /<app-page-header\b/);
    assert.match(template, /variant="workspace"/);
    assert.match(template, /\[sticky\]="true"/);
    assert.match(template, /title="In tem & nhãn"/);
    assert.doesNotMatch(template, /icon="fa-print"/);
    assert.match(template, /<app-button\b[^>]*\(click\)="fetchFromRequests\(\)"/);
    assert.match(template, /<app-button\b[^>]*\(click\)="printBrother\(\)"/);
    assert.match(template, /<app-button\b[^>]*\(click\)="printA4\(\)"/);
    assert.doesNotMatch(component, /outline:\s*none/);
    assert.doesNotMatch(template, /\boutline-none\b/);
  });

  it('keeps printer mode, calibration, zoom and paper preview as print-workstation boundaries', () => {
    const template = read('./label-print.component.html');

    assert.match(template, /setMode\('brother'\)/);
    assert.match(template, /setMode\('tomy_a4'\)/);
    assert.match(template, /setMode\('plain_a4'\)/);
    assert.match(template, /showAdvanced\.set\(!showAdvanced\(\)\)/);
    assert.match(template, /adjustZoom\(0\.1\)/);
    assert.match(template, /id="brother-preview-strip" class="bg-white/);
    assert.match(template, /class="bg-white shadow-2xl relative transition-all/);
    assert.doesNotMatch(template, /<app-toolbar\b/);
    assert.doesNotMatch(template, /<app-modal-shell\b/);
    assert.doesNotMatch(template, /<app-empty-state\b/);
  });
});
