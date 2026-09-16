import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function read(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('Soft UI progress primitive', () => {
  it('keeps five semantic statuses and clamps values through one normalized contract', () => {
    const model = read('./progress.model.ts');
    const source = read('./progress.component.ts');

    assert.match(model, /'primary' \| 'success' \| 'info' \| 'warning' \| 'danger'/);
    assert.match(source, /selector: 'app-ui-progress'/);
    assert.match(source, /normalizedMax = computed/);
    assert.match(source, /normalizedValue = computed/);
    assert.match(source, /Math\.min\(this\.normalizedMax\(\), Math\.max\(0, value\)\)/);
  });

  it('renders an accessible ultra-thin progressbar backed by global Soft UI tokens', () => {
    const source = read('./progress.component.ts');
    const styles = read('../../../../../styles.css');

    assert.match(source, /role="progressbar"/);
    assert.match(source, /aria-valuemin/);
    assert.match(source, /aria-valuemax/);
    assert.match(source, /aria-valuenow/);
    assert.match(source, /soft-ui-progress__track/);
    assert.match(source, /soft-ui-progress__bar/);
    assert.doesNotMatch(source, /#[0-9a-fA-F]{3,8}/);
    assert.match(styles, /--soft-ui-progress-track:/);
    assert.match(styles, /--soft-ui-progress-primary:/);
    assert.match(styles, /\.soft-ui-progress__track\s*\{[\s\S]*?height: 0\.25rem;/);
    assert.match(styles, /\.soft-ui-progress__bar\[data-status='success'\]/);
  });
});
