import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getLocalTodayDate, isValidAnalysisDate } from './smart-batch.date.utils';

describe('smart-batch date utils', () => {
  it('formats local calendar date correctly', () => {
    const fixed = new Date(2026, 8, 14, 10, 30); // Sep 14, 2026
    assert.equal(getLocalTodayDate(fixed), '2026-09-14');
  });

  it('validates YYYY-MM-DD calendar dates', () => {
    assert.equal(isValidAnalysisDate('2026-09-14'), true);
    assert.equal(isValidAnalysisDate('2026-02-28'), true);
    assert.equal(isValidAnalysisDate('2026-02-29'), false); // 2026 is not a leap year
    assert.equal(isValidAnalysisDate('2026-13-01'), false);
    assert.equal(isValidAnalysisDate('invalid'), false);
    assert.equal(isValidAnalysisDate(null), false);
    assert.equal(isValidAnalysisDate(undefined), false);
  });
});
