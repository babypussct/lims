import assert from 'node:assert/strict';
import test from 'node:test';
import {
  assessInternalId,
  isCurrentStandardLifecycle,
  isValidInternalId,
  normalizeInternalId,
} from './standard-internal-id';

test('accepts exactly four-character A/B/C internal IDs', () => {
  assert.equal(isValidInternalId('AA01'), true);
  assert.equal(isValidInternalId('BA99'), true);
  assert.equal(isValidInternalId('CZ48'), true);
  assert.equal(isValidInternalId('DA01'), false);
  assert.equal(isValidInternalId('A0010'), false);
  assert.equal(isValidInternalId('A-01'), false);
});

test('normalizes only safe case and surrounding whitespace', () => {
  assert.equal(normalizeInternalId(' aa01 '), 'AA01');
  assert.equal(assessInternalId(' aa01 ').kind, 'NORMALIZABLE');
  assert.equal(assessInternalId('AA01').kind, 'VALID');
  assert.equal(assessInternalId('A001').kind, 'VALID');
});

test('does not guess missing or malformed codes', () => {
  assert.equal(assessInternalId('').kind, 'MISSING');
  assert.equal(assessInternalId('SDHET').kind, 'INVALID_FORMAT');
  assert.equal(assessInternalId('A 01').kind, 'INVALID_FORMAT');
});

test('released physical records are not current borrow candidates', () => {
  const base = { id: 'std-1', name: 'A', initial_amount: 1, current_amount: 1, unit: 'mg' };
  assert.equal(isCurrentStandardLifecycle(base), true);
  assert.equal(isCurrentStandardLifecycle({ ...base, lifecycle_status: 'RELEASED' }), false);
  assert.equal(isCurrentStandardLifecycle({ ...base, _isDeleted: true }), false);
});
