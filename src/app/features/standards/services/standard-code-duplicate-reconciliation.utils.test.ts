import assert from 'node:assert/strict';
import test from 'node:test';
import { ReferenceStandard, StandardCodeRegistry } from '../../../core/models/standard.model';
import { assessHiddenDuplicateCode, listHiddenDuplicateCodeCases } from './standard-code-duplicate-reconciliation.utils';

const code = 'AA01';
const oldStandard = {
  id: 'old', name: 'Chất chuẩn lô cũ', internal_id: code, lot_number: '2024',
  _isDeleted: true, status: 'DELETED', lifecycle_status: 'ACTIVE',
} as ReferenceStandard;
const newStandard = {
  id: 'new', name: 'Chất chuẩn lô mới', internal_id: code, lot_number: '2026',
  _isDeleted: false, status: 'AVAILABLE', lifecycle_status: 'ACTIVE',
} as ReferenceStandard;
const registry: StandardCodeRegistry = {
  id: code, internal_id: code, status: 'ASSIGNED', currentStandardId: 'old', assignmentCount: 1,
};

test('hidden old and visible new form one reconcilable code with either registered holder', () => {
  for (const holder of ['old', 'new']) {
    const result = assessHiddenDuplicateCode(code, [oldStandard, newStandard], {
      ...registry, currentStandardId: holder,
    });
    assert.equal(result.status, 'READY');
    assert.equal(result.oldStandard?.id, 'old');
    assert.equal(result.newStandard?.id, 'new');
    assert.equal(result.unreleasedCount, 2);
  }
});

test('three unreleased holders or two visible records cannot be auto-reconciled', () => {
  const third = { ...newStandard, id: 'third' };
  assert.equal(assessHiddenDuplicateCode(code, [oldStandard, newStandard, third], registry).status, 'BLOCKED');
  assert.equal(assessHiddenDuplicateCode(code, [newStandard, third], registry).status, 'BLOCKED');
  const cases = listHiddenDuplicateCodeCases([oldStandard, newStandard, third], [registry], new Set());
  assert.equal(cases.length, 1, 'three conflict issue rows still represent one physical code');
  assert.equal(cases[0].unreleasedCount, 3);
});

test('hidden holder with active workflow is blocked even when registry matches', () => {
  for (const flagged of [
    { current_holder: 'someone' }, { current_holder_uid: 'uid' },
    { current_request_id: 'request' }, { has_pending_request: true },
    { status: 'IN_USE' },
  ]) {
    assert.equal(assessHiddenDuplicateCode(code, [{ ...oldStandard, ...flagged }, newStandard], registry).status, 'BLOCKED');
  }
  assert.equal(assessHiddenDuplicateCode(code, [oldStandard, newStandard], registry, new Set(['old'])).status, 'BLOCKED');
});

test('untrusted registry and noncanonical records fail closed', () => {
  const badRegistries: (StandardCodeRegistry | undefined)[] = [
    undefined, { ...registry, id: 'aa01' }, { ...registry, internal_id: 'aa01' },
    { ...registry, status: 'AVAILABLE' }, { ...registry, currentStandardId: 'third' },
  ];
  for (const entry of badRegistries) {
    assert.equal(assessHiddenDuplicateCode(code, [oldStandard, newStandard], entry).status, 'BLOCKED');
  }
  assert.equal(assessHiddenDuplicateCode(code, [{ ...oldStandard, internal_id: 'aa01' }, newStandard], registry).status, 'BLOCKED');
  assert.equal(assessHiddenDuplicateCode(code, [oldStandard, { ...newStandard, lifecycle_status: 'CLOSED' }], registry).status, 'BLOCKED');
  assert.equal(assessHiddenDuplicateCode('SDHET', [
    { ...oldStandard, internal_id: 'SDHET' }, { ...newStandard, internal_id: 'SDHET' },
  ], registry).status, 'BLOCKED');
});

test('canonical registry is required and migrated aliases are ignored', () => {
  const alias = { ...registry, id: 'aa01', internal_id: 'aa01' };
  const standards = [oldStandard, newStandard];
  assert.equal(listHiddenDuplicateCodeCases(standards, [registry, alias], new Set())[0].status, 'BLOCKED');
  assert.equal(listHiddenDuplicateCodeCases(standards, [registry, {
    ...alias, migrationStatus: 'MIGRATED', migratedTo: code,
  }], new Set())[0].status, 'READY');
  assert.equal(listHiddenDuplicateCodeCases(standards, [alias], new Set())[0].status, 'BLOCKED');
  assert.equal(listHiddenDuplicateCodeCases([oldStandard, { ...newStandard, lifecycle_status: 'RELEASED' }], [registry], new Set()).length, 0);
});
