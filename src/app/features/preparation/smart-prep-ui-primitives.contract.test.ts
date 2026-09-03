import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function read(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('preparation shared UI primitive integration', () => {
  it('uses the shared page header and buttons for standard Smart Prep actions', () => {
    const component = read('./smart-prep.component.ts');
    const template = read('./smart-prep.component.html');

    assert.match(component, /AppButtonComponent/);
    assert.match(component, /AppPageHeaderComponent/);
    assert.match(template, /<app-page-header\b/);
    assert.match(template, /variant="workspace"/);
    assert.match(template, /\[sticky\]="true"/);
    assert.match(template, /pageHeaderActions/);
    assert.doesNotMatch(template, /pageHeaderActions class="contents"/);
    assert.match(template, /<app-button\b/);

    assert.match(template, /<app-button[^>]*\(click\)="addAddition\(\)"/);
    assert.match(template, /<app-button[^>]*\(click\)="addStep\(\)"/);
    assert.match(template, /<app-button[^>]*\(click\)="showTrace\.set\(!showTrace\(\)\)"/);
    assert.match(template, /<app-button[^>]*\[fullWidth\]="true"[^>]*\(click\)="copyResult\(\)"/);
    assert.match(template, /<app-button[^>]*variant="secondary"[^>]*\[fullWidth\]="true"[^>]*\(click\)="exportSimulation\(\)"/);

    assert.doesNotMatch(template, /<button[^>]*\(click\)="addAddition\(\)"/);
    assert.doesNotMatch(template, /<button[^>]*\(click\)="addStep\(\)"/);
    assert.doesNotMatch(template, /<button[^>]*\(click\)="showTrace\.set\(!showTrace\(\)\)"/);
    assert.doesNotMatch(template, /<button[^>]*\(click\)="copyResult\(\)"/);
    assert.doesNotMatch(template, /<button[^>]*\(click\)="exportSimulation\(\)"/);

    assert.match(template, /<button[^>]*\(click\)="removeSeriesSource\(source\.id\)"/);
    assert.match(template, /<button[^>]*\(click\)="removeStep\(step\.id\)"/);
  });
});
