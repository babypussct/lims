import assert from 'node:assert/strict';
import test from 'node:test';
import { formatNum } from './utils';

test('formatNum formats numbers to exactly 2 decimal places by default (Phương án A)', () => {
  assert.equal(formatNum(12.5), '12.50');
  assert.equal(formatNum(10), '10.00');
  assert.equal(formatNum(0), '0.00');
  assert.equal(formatNum(12.3456), '12.35');
  assert.equal(formatNum('100.5'), '100.50');
  assert.equal(formatNum(null), '0.00');
  assert.equal(formatNum(undefined), '0.00');
  assert.equal(formatNum('invalid'), '0.00');
});

test('formatNum respects custom decimals parameter', () => {
  assert.equal(formatNum(12.3456, 3), '12.346');
  assert.equal(formatNum(12.3456, 4), '12.3456');
  assert.equal(formatNum(12, 0), '12');
});
