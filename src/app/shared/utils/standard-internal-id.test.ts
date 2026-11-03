import assert from 'node:assert/strict';
import test from 'node:test';
import {
  assessInternalId,
  assessCodeOwnership,
  hasUnreleasedCodeLifecycle,
  isStandardVisibleInCatalogue,
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

test('keeps hidden active ownership separate from catalogue visibility', () => {
  const hidden = {
    id: 'std-hidden', name: 'A', internal_id: 'AA01', status: 'DELETED', _isDeleted: true,
  } as any;
  assert.equal(isStandardVisibleInCatalogue(hidden), false);
  assert.equal(hasUnreleasedCodeLifecycle(hidden), true);
  assert.equal(assessCodeOwnership(hidden, {
    id: 'AA01', internal_id: 'AA01', status: 'ASSIGNED', currentStandardId: 'std-hidden', assignmentCount: 1,
  }, [hidden], false).status, 'RELEASED');
});

test('blocks hidden-code recall when a different physical owner or workflow exists', () => {
  const hidden = { id: 'std-hidden', name: 'A', internal_id: 'AA01', status: 'DELETED', _isDeleted: true } as any;
  const other = { id: 'std-other', name: 'B', internal_id: 'AA01', status: 'AVAILABLE', lifecycle_status: 'ACTIVE' } as any;
  const registry = { id: 'AA01', internal_id: 'AA01', status: 'ASSIGNED', currentStandardId: 'std-hidden', assignmentCount: 1 } as any;
  assert.equal(assessCodeOwnership(hidden, registry, [hidden, other], false).status, 'BLOCKED');
  assert.equal(assessCodeOwnership(hidden, registry, [hidden], true).status, 'BLOCKED');
});

test('classifies an available registry as reconcile without increasing assignment count', () => {
  const hidden = { id: 'std-hidden', name: 'A', internal_id: 'AA01', status: 'DELETED', _isDeleted: true } as any;
  const assessment = assessCodeOwnership(hidden, {
    id: 'AA01', internal_id: 'AA01', status: 'AVAILABLE', assignmentCount: 3,
  } as any, [hidden], false);
  assert.equal(assessment.status, 'RECONCILED');
  assert.equal(assessment.blocking, false);
});

test('excludes SDHET from reusable-code recall', () => {
  const standard = { id: 'std-sdhet', name: 'SDHET', internal_id: 'SDHET', status: 'DELETED', _isDeleted: true } as any;
  assert.equal(assessCodeOwnership(standard, null, [standard], false).status, 'EXCLUDED_SPECIAL_CODE');
});
