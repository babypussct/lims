import assert from 'node:assert/strict';
import test from 'node:test';
import {
  assessCasNumber,
  assessCleanupGroup,
  detectStandardForm,
  formatStandardProductName,
} from './standard-cleanup';

test('classifies valid, placeholder, date-corrupted and annotated CAS values', () => {
  assert.deepEqual(assessCasNumber('108-95-2').quality, 'valid');
  assert.equal(assessCasNumber('CAS inside').quality, 'placeholder');
  assert.equal(assessCasNumber('5/7/80').quality, 'date_corrupted');
  assert.equal(assessCasNumber('441296-91-9 (anion)').quality, 'annotated');
  assert.equal(assessCasNumber('108-95-3').quality, 'invalid');
});

test('normalizes measurement typography while preserving product descriptors', () => {
  assert.equal(
    formatStandardProductName('PHENOL 100 ug/ml IN METHANOL'),
    'Phenol 100 µg/mL in methanol'
  );
  assert.equal(
    formatStandardProductName('Cloxacillin 1000 ìg/mL in Acetonitrile'),
    'Cloxacillin 1000 µg/mL in acetonitrile'
  );
});

test('detects product forms that must not be flattened into a canonical name', () => {
  assert.equal(detectStandardForm('Phenol 100 µg/mL in Methanol'), 'solution');
  assert.equal(detectStandardForm('Amino Acids Mix Solution'), 'mixture');
  assert.equal(detectStandardForm('Fipronil-13C2,15N2'), 'isotope');
  assert.equal(detectStandardForm('Cloxacillin sodium monohydrate'), 'salt_or_hydrate');
});

test('blocks a single group-wide name when the same CAS contains solid and solutions', () => {
  const assessment = assessCleanupGroup([
    { name: 'Phenol', unit: 'g' },
    { name: 'Phenol 100 µg/mL in Methanol', unit: 'mL' },
    { name: 'Phenol 100 µg/mL in Dichloromethane', unit: 'mL' },
  ]);
  assert.equal(assessment.level, 'high');
  assert.equal(assessment.canApplyCanonicalToAll, false);
  assert.match(assessment.reasons.join(' '), /đơn vị khác nhau/u);
});

test('allows a shared canonical name only for uniform neat standards', () => {
  const assessment = assessCleanupGroup([
    { name: 'Famphur', unit: 'mg', pack_size: '100 mg/Chai' },
    { name: 'FAMPHUR', unit: 'mg', pack_size: '100 mg/chai' },
  ]);
  assert.equal(assessment.level, 'low');
  assert.equal(assessment.canApplyCanonicalToAll, true);
});
