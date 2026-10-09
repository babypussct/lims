import assert from 'node:assert/strict';
import test from 'node:test';
import { PRESET_CHEMICALS } from './prep-calculation.engine';
import { formulaSpeciesFactor, parseChemicalFormula } from './chemical-formula';
import { LAB_REAGENTS } from './prep-substance-data';
import { PREP_SUBSTANCE_GROUPS, PREP_SUBSTANCE_LIBRARY, formulaSubstanceOption, matchesSubstanceSearch } from './prep-substance-catalog';

test('offline library and formula parser fill physical constants without inventing certified purity', () => {
  assert.ok(PREP_SUBSTANCE_LIBRARY.length >= 330);
  for (const preset of PRESET_CHEMICALS) {
    const option = PREP_SUBSTANCE_LIBRARY.find(item => item.id === preset.id);
    assert.equal(option?.sourceType, 'concentrate');
    assert.equal(option?.concentration?.value, preset.massPercent);
    assert.equal(option?.densityGPerMl, preset.densityGPerMl);
  }
  assert.ok(PREP_SUBSTANCE_LIBRARY.filter(item => item.sourceType === 'concentrate').length > PRESET_CHEMICALS.length);
  assert.ok(PREP_SUBSTANCE_GROUPS.length >= 6);
  const salt = PREP_SUBSTANCE_LIBRARY.find(item => item.formula === 'CuSO4.5H2O');
  assert.ok(salt);
  assert.equal(salt.name, 'CuSO4.5H2O · Đồng(II) sulfat pentahydrat');
  assert.equal(salt.potencyPercent, null);
  assert.deepEqual(salt.species, ['Cu', 'CuSO4']);
  for (const chemical of PREP_SUBSTANCE_LIBRARY.filter(item => !PRESET_CHEMICALS.some(p => p.id === item.id))) {
    assert.equal(chemical.potencyPercent, null, chemical.name);
    assert.equal(chemical.concentration, null, chemical.name);
    assert.equal(chemical.densityGPerMl, null, chemical.name);
  }
  const parsed = formulaSubstanceOption('MgSO4.7H2O');
  assert.equal(parsed?.species[0], 'MgSO4');
  assert.equal(parsed?.concentration, null);
  assert.equal(formulaSubstanceOption('Chì'), null);
});

test('every curated formula and analyte species can be calculated, with distinct catalog identities', () => {
  assert.equal(new Set(PREP_SUBSTANCE_LIBRARY.map(item => item.id)).size, PREP_SUBSTANCE_LIBRARY.length);
  assert.equal(new Set(LAB_REAGENTS.map(item => item.group + ':' + item.name)).size, LAB_REAGENTS.length);
  for (const item of PREP_SUBSTANCE_LIBRARY) {
    assert.ok(item.formula && parseChemicalFormula(item.formula), item.name);
    for (const species of item.species) {
      assert.ok(formulaSpeciesFactor(item.formula!, species), `${item.name}: ${species}`);
    }
  }
  assert.ok(Math.abs(parseChemicalFormula('C4H6O3')!.molarMass - 102.089) < 0.02);
  assert.ok(Math.abs(parseChemicalFormula('C13H14N4O')!.molarMass - 242.282) < 0.02);
});

test('curated CAS identifiers have valid check digits and never map to conflicting molecular compositions', () => {
  const casToAtoms = new Map<string, Readonly<Record<string, number>>>();
  let casCount = 0;
  for (const substance of PREP_SUBSTANCE_LIBRARY) {
    const cas = substance.detail.match(/CAS (\d{2,7}-\d{2}-\d)/)?.[1];
    if (!cas) continue;
    casCount++;
    const digits = cas.replace(/-/g, '');
    const checkDigit = [...digits.slice(0, -1)].reverse()
      .reduce((sum, digit, index) => sum + Number(digit) * (index + 1), 0) % 10;
    assert.equal(checkDigit, Number(digits.at(-1)), `CAS không hợp lệ: ${cas}`);
    const atoms = parseChemicalFormula(substance.formula!)!.atoms;
    const previous = casToAtoms.get(cas);
    if (previous) assert.deepEqual(atoms, previous, `CAS bị gán sai công thức: ${cas}`);
    else casToAtoms.set(cas, atoms);
  }
  assert.ok(casCount >= 170);
});

test('Vietnamese, English, CAS and formula searches work offline without mixing isomers or hydrates', () => {
  const find = (query: string) => PREP_SUBSTANCE_LIBRARY.filter(item => matchesSubstanceSearch(item, query));
  assert.ok(find('dong sulfat').some(item => item.formula === 'CuSO4.5H2O'));
  assert.ok(find('đồng sulfat').some(item => item.formula === 'CuSO4.5H2O'));
  assert.ok(find('copper sulfate').some(item => item.formula === 'CuSO4.5H2O'));
  assert.ok(find('67-56-1').some(item => item.name.includes('Methanol')));
  assert.ok(find('7758-99-8').some(item => item.formula === 'CuSO4.5H2O'));
  assert.ok(find('CuSO₄·5H₂O').some(item => item.formula === 'CuSO4.5H2O'));
  const isomers = find('C4H8O2');
  assert.ok(isomers.some(item => item.name.includes('Etyl acetat')));
  assert.ok(isomers.some(item => item.name.includes('1,4-Dioxan')));
  assert.ok(isomers.some(item => item.name.includes('Axit butyric')));
  assert.notEqual(isomers.find(item => item.name.includes('Etyl acetat'))?.id, isomers.find(item => item.name.includes('1,4-Dioxan'))?.id);
  assert.ok(find('MgSO4.7H2O').some(item => item.formula === 'MgSO4.7H2O'));
  assert.ok(find('MgSO4').some(item => item.formula === 'MgSO4'));
  assert.ok(find('lithium hydroxide').some(item => item.formula === 'LiOH.H2O'));
  assert.ok(find('methylene blue').some(item => item.formula === 'C16H18ClN3S'));
  assert.ok(find('saccharin').some(item => item.formula === 'C7H4NNaO3S.2H2O'));
  assert.ok(find('isooctane').some(item => item.name.includes('Isooctan')));
});

test('liquid reagents and organic acids use liquid preparation inputs without inventing a stock concentration', () => {
  for (const name of ['Axit acetic', 'Axit propionic', 'Axit butyric', 'Metyl etyl keton', 'Propylen carbonat']) {
    const item = PREP_SUBSTANCE_LIBRARY.find(option => option.name.endsWith('· ' + name));
    assert.ok(item, name);
    assert.equal(item.sourceType, 'concentrate', name);
    assert.equal(item.concentration, null, name);
    assert.equal(item.densityGPerMl, null, name);
  }
  assert.equal(PREP_SUBSTANCE_LIBRARY.find(item => item.name.includes('Axit citric khan'))?.sourceType, 'solid');
});
