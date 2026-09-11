import assert from 'node:assert/strict';
import test from 'node:test';
import {
  assessInternalId,
  isCurrentStandardLifecycle,
  isSpecialInternalId,
  isValidInternalId,
  normalizeInternalId,
  SPECIAL_INTERNAL_ID,
  validateInternalIdCorrections,
} from './standard-internal-id';

test('accepts exactly four-character A/B/C internal IDs and the SDHET business exception', () => {
  assert.equal(isValidInternalId('AA01'), true);
  assert.equal(isValidInternalId('BA99'), true);
  assert.equal(isValidInternalId('CZ48'), true);
  assert.equal(SPECIAL_INTERNAL_ID, 'SDHET');
  assert.equal(isValidInternalId('SDHET'), true);
  assert.equal(isValidInternalId('sdhet'), true);
  assert.equal(isSpecialInternalId(' sdhet '), true);
  assert.equal(isValidInternalId('DA01'), false);
  assert.equal(isValidInternalId('A0010'), false);
  assert.equal(isValidInternalId('A-01'), false);
});

test('normalizes only safe case and surrounding whitespace', () => {
  assert.equal(normalizeInternalId(' aa01 '), 'AA01');
  assert.equal(assessInternalId(' aa01 ').kind, 'NORMALIZABLE');
  assert.equal(assessInternalId('AA01').kind, 'VALID');
  assert.equal(assessInternalId('A001').kind, 'VALID');
  assert.equal(assessInternalId('SDHET').kind, 'VALID');
  assert.equal(assessInternalId(' sdhet ').kind, 'NORMALIZABLE');
  assert.match(assessInternalId('SDHET').reason, /nghiệp vụ riêng SDHET/);
});

test('does not guess missing or malformed codes', () => {
  assert.equal(assessInternalId('').kind, 'MISSING');
  assert.equal(assessInternalId('SDHET1').kind, 'INVALID_FORMAT');
  assert.equal(assessInternalId('A 01').kind, 'INVALID_FORMAT');
});

test('SDHET is exempt from exclusive-owner correction warnings', () => {
  const report = {
    conflicts: [
      {
        kind: 'DUPLICATE_ACTIVE',
        internalId: 'SDHET',
      },
      {
        kind: 'REGISTRY_MISMATCH',
        internalId: 'sdhet',
      },
    ],
  } as any;

  const validations = validateInternalIdCorrections({ first: 'SDHET', second: ' sdhet ' }, report);
  assert.equal(validations.get('first')?.level, 'valid');
  assert.equal(validations.get('second')?.level, 'valid');
  assert.equal(validations.get('first')?.valid, true);
  assert.equal(validations.get('second')?.valid, true);
});

test('released physical records are not current borrow candidates', () => {
  const base = { id: 'std-1', name: 'A', initial_amount: 1, current_amount: 1, unit: 'mg' };
  assert.equal(isCurrentStandardLifecycle(base), true);
  assert.equal(isCurrentStandardLifecycle({ ...base, lifecycle_status: 'RELEASED' }), false);
  assert.equal(isCurrentStandardLifecycle({ ...base, _isDeleted: true }), false);
});
