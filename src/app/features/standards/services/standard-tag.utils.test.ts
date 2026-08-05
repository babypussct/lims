import assert from 'node:assert/strict';
import test from 'node:test';
import {
  applyTagMode,
  assertTagLimit,
  buildAccreditationMethodTagId,
  buildTagKey,
  formatStockSummary,
  mergeUniqueTagKeys,
  normalizeNafi6ChemicalMethodCode,
  normalizeDeviceAlias,
  normalizeTagKey,
  normalizeTagKeysStrict,
  parseTagKeyStrict,
  resolveReturnTagMerge,
  summarizeStockByUnit,
} from './standard-tag.utils';
import {
  VLAT_11669_CHEMICAL_METHOD_TAGS,
  VLAT_11669_CHEMICAL_METHOD_CODES,
} from './vlat-1-1669-487-20251015-chemical-method-tags';

test('canonical tag parser preserves source ID casing', () => {
  assert.equal(parseTagKeyStrict('SOP:SOP-9.16').key, 'sop:SOP-9.16');
  assert.equal(normalizeTagKey('SOP:SOP-9.16'), 'sop:SOP-9.16');
  assert.equal(buildTagKey('SOP', 'SOP-9.16'), 'sop:SOP-9.16');
  assert.equal(parseTagKeyStrict('target-group:Group_A').id, 'Group_A');
  assert.throws(() => parseTagKeyStrict('device:gcms'));
});

test('strict normalization deduplicates canonical keys without lowercasing suffixes', () => {
  assert.deepEqual(normalizeTagKeysStrict(['SOP:SOP-9.16', 'sop:SOP-9.16', 'custom:ABC']), [
    'sop:SOP-9.16', 'custom:ABC'
  ]);
  assert.deepEqual(normalizeTagKeysStrict([]), []);
  assert.throws(() => normalizeTagKeysStrict(['not-a-key']));
});

test('tag limit reports overflow instead of silently dropping tags', () => {
  assert.throws(() => assertTagLimit(new Array(11).fill('custom:x'), 10, 'return'), /tối đa 10/);
});

test('return merge keeps standard tags on overflow and records warning', () => {
  const existing = Array.from({ length: 100 }, (_, i) => `custom:t${i}`);
  const result = resolveReturnTagMerge(existing, ['custom:new']);
  assert.equal(result.status, 'SKIPPED_LIMIT');
  assert.deepEqual(result.standardTags, existing);
  assert.match(result.warning || '', /vượt giới hạn/);
});

test('bulk ADD/REMOVE/REPLACE semantics are deterministic', () => {
  assert.deepEqual(applyTagMode(['custom:a'], ['custom:b'], 'ADD'), ['custom:a', 'custom:b']);
  assert.deepEqual(applyTagMode(['custom:a', 'custom:b'], ['custom:a'], 'REMOVE'), ['custom:b']);
  assert.deepEqual(applyTagMode(['custom:a'], [], 'REPLACE'), []);
});

test('stock summary never mixes units and reports container count', () => {
  const summary = summarizeStockByUnit([
    { current_amount: 1250, unit: 'mg' },
    { current_amount: 340, unit: 'ml' },
    { current_amount: 3, unit: 'tube' },
    { current_amount: 5, unit: 'µl' },
  ]);
  assert.equal(summary.totalContainers, 4);
  assert.deepEqual(summary.byUnit.map(item => item.unit), ['mg', 'ml', 'ul', 'tube']);
  assert.match(formatStockSummary(summary), /1\.250 mg/);
});

test('chemical manifest contains exactly the reviewed chemical method set', () => {
  assert.equal(VLAT_11669_CHEMICAL_METHOD_CODES.length, 119);
  assert.equal(new Set(VLAT_11669_CHEMICAL_METHOD_CODES).size, 119);
  assert.equal(VLAT_11669_CHEMICAL_METHOD_TAGS.length, 119);
  assert.equal(
    VLAT_11669_CHEMICAL_METHOD_TAGS.find(item => item.methodCode === 'NAFI6/H-8.41')?.id,
    'vlat-1-1669-487-20251015-method-nafi6-h-8.41'
  );
  assert.deepEqual(
    VLAT_11669_CHEMICAL_METHOD_TAGS.find(item => item.methodCode === 'NAFI6/H-8.41')?.deviceCodes,
    ['LCMSMS']
  );
  assert.deepEqual(
    VLAT_11669_CHEMICAL_METHOD_TAGS.find(item => item.methodCode === 'NAFI6/H-9.10')?.deviceCodes,
    ['GCHRMS']
  );
  assert.equal(normalizeNafi6ChemicalMethodCode(' nafi6 / h-9.21 '), 'NAFI6/H-9.21');
  assert.equal(buildAccreditationMethodTagId('NAFI6/H-9.21'), 'method-nafi6-h-9.21');
  assert.equal(VLAT_11669_CHEMICAL_METHOD_TAGS.some(item => item.methodCode?.includes('BIO')), false);
});

test('device aliases resolve to the specific read-only secondary label', () => {
  assert.equal(normalizeDeviceAlias('GC-MS/MS'), 'GCMSMS');
  assert.equal(normalizeDeviceAlias('GC-MS'), 'GCMS');
  assert.equal(normalizeDeviceAlias('LC-MS/MS'), 'LCMSMS');
  assert.equal(normalizeDeviceAlias('GC-HRMS'), 'GCHRMS');
  assert.equal(normalizeDeviceAlias('free text device'), null);
});
