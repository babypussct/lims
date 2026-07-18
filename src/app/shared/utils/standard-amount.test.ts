import assert from 'node:assert/strict';
import test from 'node:test';
import {
  normalizeNonNegativeStandardAmount,
  normalizePositiveStandardAmount,
  parseStandardQuantity,
  reconcileStandardReturn
} from './standard-amount';

test('parses the raw amount and converts it exactly once', () => {
  assert.deepEqual(parseStandardQuantity('1 g', 'mg'), {
    amount: 1,
    unit: 'g',
    normalizedAmount: 1000,
    normalizedUnit: 'mg'
  });
});

test('normalizes micro symbols and decimal comma', () => {
  assert.deepEqual(parseStandardQuantity('1,5 μl', 'ml'), {
    amount: 1.5,
    unit: 'µl',
    normalizedAmount: 0.0015,
    normalizedUnit: 'ml'
  });
});

test('rejects incompatible and unknown units', () => {
  assert.equal(parseStandardQuantity('1 ml', 'mg'), null);
  assert.equal(parseStandardQuantity('1 mystery', 'mg'), null);
});

test('accepts zero only for non-negative confirmation values', () => {
  assert.equal(normalizeNonNegativeStandardAmount(0, 'mg', 'mg'), 0);
  assert.throws(() => normalizePositiveStandardAmount(0, 'mg', 'mg'), /lớn hơn 0/);
  assert.throws(() => normalizePositiveStandardAmount(Number.NaN, 'mg', 'mg'), /lớn hơn 0/);
});

test('reconciles only the unlogged delta on return', () => {
  assert.deepEqual(reconcileStandardReturn(900, [40, 60], 120, false), {
    previouslyLogged: 100,
    confirmedUsed: 120,
    adjustmentAmount: 20,
    disposalAmount: 0,
    remainingAmount: 880,
    accountedTotal: 120
  });
});

test('accounts for remaining stock as disposal when depleted', () => {
  const result = reconcileStandardReturn(900, [100], 120, true);
  assert.equal(result.adjustmentAmount, 20);
  assert.equal(result.disposalAmount, 880);
  assert.equal(result.remainingAmount, 0);
  assert.equal(result.accountedTotal, 1000);
});

test('rejects return totals below logs and deltas above stock', () => {
  assert.throws(() => reconcileStandardReturn(10, [5], 4, false), /không thể nhỏ hơn/);
  assert.throws(() => reconcileStandardReturn(10, [5], 20, false), /Không đủ lượng tồn kho/);
});
