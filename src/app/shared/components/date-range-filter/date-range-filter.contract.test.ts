import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function readSource(): string {
  return readFileSync(new URL('./date-range-filter.component.ts', import.meta.url), 'utf8');
}

describe('DateRangeFilterComponent responsive date-picker contract', () => {
  it('uses full-width mobile fields and inward-facing popover alignment', () => {
    const source = readSource();

    assert.match(source, /flex w-full sm:w-auto/);
    assert.match(source, /w-full min-w-0 sm:min-w-\[136px\] sm:flex-1 sm:flex-none sm:w-36/);
    assert.match(source, /flex-col sm:flex-row/);
    assert.match(source, /align="left"/);
    assert.match(source, /align="right"/);
    assert.doesNotMatch(source, /w-28 sm:w-32/);
  });
});
