import assert from 'node:assert/strict';
import test from 'node:test';
import { parseChemicalFormula, formulaSpeciesFactor } from './chemical-formula';

test('formula mass handles common salts, nested groups and unicode/dot hydrates', () => {
  for (const [formula, mass] of [['NaCl', 58.44], ['Ca(NO3)2', 164.086], ['CuSO4.5H2O', 249.677], ['CuSO₄·5H₂O', 249.677], ['FeSO4.7H2O', 278.006], ['Na2S2O3.5H2O', 248.175], ['K4[Fe(CN)6]', 368.341], ['C10H14N2Na2O8.2H2O', 372.236]] as const) {
    const result = parseChemicalFormula(formula);
    assert.ok(result, formula);
    assert.ok(Math.abs(result.molarMass - mass) < 0.02, formula + ': ' + result.molarMass);
  }
  assert.deepEqual(parseChemicalFormula('CuSO4.5H2O')?.atoms, { Cu: 1, S: 1, O: 9, H: 10 });
  assert.equal(parseChemicalFormula('CuSO4.5H2O')?.anhydrousFormula, 'CuSO4');
});

test('unsupported notation and incomplete formulas cannot silently produce a mass', () => {
  for (const formula of ['', 'nacl', 'NaCl garbage', 'Na0Cl', 'Xx2O', 'Ca(NO3', 'Ca()2', 'NaCl)', '.H2O', 'CuSO4.', 'CuSO4..5H2O', 'CuSO4.0H2O', '13CH4', 'Na+', 'SO4-2', 'H2O1.5', 'EDTA-2Na']) {
    assert.equal(parseChemicalFormula(formula), null, formula);
  }
});

test('species conversion requires an explicit species and respects stoichiometry', () => {
  const copper = formulaSpeciesFactor('CuSO4.5H2O', 'Cu');
  assert.ok(copper);
  assert.ok(Math.abs(copper.factor - 0.254506) < 0.00001);
  assert.equal(copper.molarMass, 63.546);
  assert.equal(formulaSpeciesFactor('K2Cr2O7', 'Cr')?.count, 2);
  assert.equal(formulaSpeciesFactor('CuSO4.5H2O', 'Pb'), null);
  assert.equal(formulaSpeciesFactor('CuSO4.5H2O', 'Cu2'), null);
  assert.equal(formulaSpeciesFactor('CuSO4.5H2O', 'CuSO4.5H2O')?.factor, 1);
});
