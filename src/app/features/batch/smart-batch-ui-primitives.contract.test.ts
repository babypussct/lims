import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const component = readFileSync(new URL('./smart-batch.component.ts', import.meta.url), 'utf8');
const template = readFileSync(new URL('./smart-batch.component.html', import.meta.url), 'utf8');

describe('smart batch focused workspace header', () => {
  it('uses the shared workspace header and keeps step navigation on the leading slot', () => {
    assert.match(component, /AppPageHeaderComponent/);
    assert.match(component, /AppButtonComponent/);
    assert.match(template, /<app-page-header\b/);
    assert.match(template, /variant="workspace"/);
    assert.match(template, /\[sticky\]="true"/);
    assert.match(template, /pageHeaderLeading/);
    assert.match(template, /pageHeaderActions/);
    assert.match(template, /pageHeaderLeading[\s\S]*?\(click\)="goBackToStep0\(\)"/);
    assert.match(template, /pageHeaderLeading[\s\S]*?\(click\)="goBackFromStep2\(\)"/);
    assert.match(template, /pageHeaderActions[\s\S]*?Ghép nhiều mẫu/);
    assert.match(template, /pageHeaderActions[\s\S]*?Một mẫu duy nhất/);
    assert.match(template, /pageHeaderActions[\s\S]*?\(click\)="openSopCalculator\(\)"/);
    assert.doesNotMatch(template, /app-page-header[\s\S]{0,180}border border-slate-100/);
  });
});
