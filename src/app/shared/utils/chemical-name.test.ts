import assert from 'node:assert/strict';
import test from 'node:test';
import {
  formatChemicalName,
  normalizeCasNumber,
  normalizeChemicalNames,
  parseChemicalNames,
  serializeChemicalNames,
} from './chemical-name';

test('formats chemical names using sentence case', () => {
  assert.equal(formatChemicalName('acetaminophen'), 'Acetaminophen');
  assert.equal(formatChemicalName('SODIUM CHLORIDE'), 'Sodium chloride');
  assert.equal(formatChemicalName('UREA'), 'Urea');
  assert.equal(formatChemicalName('Sodium Chloride'), 'Sodium chloride');
  assert.equal(formatChemicalName('1-propanol'), '1-Propanol');
  assert.equal(formatChemicalName('Bis(2-Ethylhexyl) Phthalate'), 'Bis(2-ethylhexyl) phthalate');
  assert.equal(formatChemicalName('cis-Nonachlor'), 'cis-Nonachlor');
  assert.equal(formatChemicalName('gamma-HCH'), 'gamma-HCH');
  assert.equal(formatChemicalName('tert-Butyl-4-hydroxyanisole'), 'tert-Butyl-4-hydroxyanisole');
  assert.equal(formatChemicalName('6a-Chloro Testosterone'), '6a-Chloro testosterone');
  assert.equal(
    formatChemicalName('CERTIFIED REFERENCE MATERIAL FOR ICP-MS'),
    'Certified reference material for ICP-MS'
  );
});

test('preserves meaningful scientific casing', () => {
  assert.equal(formatChemicalName('DDT'), 'DDT');
  assert.equal(formatChemicalName('NaCl'), 'NaCl');
  assert.equal(formatChemicalName('N-Acetyl-L-Cysteine'), 'N-acetyl-L-cysteine');
  assert.equal(formatChemicalName('(2R)-2-Hydroxypropanoic Acid'), '(2R)-2-hydroxypropanoic acid');
});

test('keeps commas inside chemical nomenclature', () => {
  assert.deepEqual(parseChemicalNames('2,4-Dichlorophenoxyacetic acid\nAcetic acid; 2,4-D'), [
    '2,4-Dichlorophenoxyacetic acid',
    'Acetic acid',
    '2,4-D',
  ]);
  assert.equal(
    serializeChemicalNames(['2,4-dichlorophenoxyacetic acid', 'Acetic Acid']),
    '2,4-Dichlorophenoxyacetic acid; Acetic acid'
  );
});

test('deduplicates aliases case-insensitively and honors exclusions', () => {
  assert.deepEqual(
    normalizeChemicalNames(['BENZENE', 'Benzene', 'Benzol'], ['benzene']),
    ['Benzol']
  );
});

test('normalizes and validates CAS Registry Numbers', () => {
  assert.equal(normalizeCasNumber('7732-18-5'), '7732-18-5');
  assert.equal(normalizeCasNumber(' 7732 18 5 '), '7732-18-5');
  assert.equal(normalizeCasNumber('7732185'), '7732-18-5');
  assert.equal(normalizeCasNumber('7732-18-4'), null);
  assert.equal(normalizeCasNumber('N/A'), null);
});
