import assert from 'node:assert/strict';
import test from 'node:test';
import { PREP_SUBSTANCE_LIBRARY, formulaSubstanceOption } from './prep-substance-catalog';

test('offline library and formula parser fill physical constants without inventing certified purity', () => {
  assert.equal(PREP_SUBSTANCE_LIBRARY.filter(item => item.sourceType === 'concentrate').length, 9);
  const salt = PREP_SUBSTANCE_LIBRARY.find(item => item.formula === 'CuSO4.5H2O');
  assert.ok(salt);
  assert.equal(salt.potencyPercent, null);
  assert.deepEqual(salt.species, ['Cu', 'CuSO4']);
  const parsed = formulaSubstanceOption('MgSO4.7H2O');
  assert.equal(parsed?.species[0], 'MgSO4');
  assert.equal(parsed?.concentration, null);
  assert.equal(formulaSubstanceOption('Chì'), null);
});
