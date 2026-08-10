import assert from 'node:assert/strict';
import test from 'node:test';
import { calculatePrep, concentrationToGPerL } from './prep-calculation.engine';
import {
  CalculationIssue,
  ConcentrationDraft,
  MolarDraft,
  QuantityDraft
} from './prep-domain.types';

const mass = (value: number | null, unit = 'g'): QuantityDraft => ({ value, unit, dimension: 'mass' });
const volume = (value: number | null, unit = 'ml'): QuantityDraft => ({ value, unit, dimension: 'volume' });
const ppm = (value: number | null): ConcentrationDraft => ({ value, unit: 'ppm', basis: 'mass_per_volume' });

test('molar helper returns molar and mass concentration alternatives', () => {
  const draft: MolarDraft = {
    mode: 'molar',
    name: 'NaCl mô phỏng',
    mass: mass(10, 'mg'),
    purity: 100,
    finalVolume: volume(10),
    molecularWeight: 58.44
  };
  const result = calculatePrep(draft);
  assert.equal(result.status, 'valid');
  assert.ok(result.output);
  assert.equal(result.output.kind, 'molar');
  if (result.output.kind === 'molar') {
    assert.ok(Math.abs(result.output.massConcentrationGPerL - 1) < 1e-12);
    assert.ok(Math.abs((result.output.molarConcentrationM || 0) - 0.0171115674) < 1e-8);
  }
});

test('molar helper does not invent molar output without molecular weight', () => {
  const result = calculatePrep({
    mode: 'molar',
    name: 'Chất chưa biết MW',
    mass: mass(10, 'mg'),
    purity: 100,
    finalVolume: volume(10),
    molecularWeight: null
  });
  assert.equal(result.status, 'valid');
  assert.ok(result.output);
  if (result.output?.kind === 'molar') {
    assert.equal(result.output.molarConcentrationM, null);
    assert.equal(result.output.molarAlternatives.length, 0);
  }
});

test('dilution helper calculates stock and solvent in canonical ml', () => {
  const result = calculatePrep({
    mode: 'dilution',
    stockName: 'Stock mô phỏng',
    stock: ppm(1000),
    target: ppm(10),
    finalVolume: volume(10)
  });
  assert.equal(result.status, 'valid');
  assert.ok(result.output);
  if (result.output?.kind === 'dilution') {
    assert.ok(Math.abs(result.output.stockVolumeMl - 0.1) < 1e-12);
    assert.ok(Math.abs(result.output.solventVolumeMl - 9.9) < 1e-12);
  }
});

test('dilution blocks a target concentration above stock', () => {
  const result = calculatePrep({
    mode: 'dilution',
    stockName: '',
    stock: ppm(10),
    target: ppm(100),
    finalVolume: volume(10)
  });
  assert.equal(result.status, 'invalid');
  assert.equal(result.output, null);
  assert.ok(result.issues.some(item => item.code === 'TARGET_EXCEEDS_STOCK'));
});

test('spiking helper uses volume only and does not assume mass equals volume', () => {
  const result = calculatePrep({
    mode: 'spiking',
    stockName: 'Chuẩn spike',
    sampleName: 'Nền mẫu',
    stock: ppm(1000),
    added: ppm(10),
    sampleVolume: volume(10)
  });
  assert.equal(result.status, 'valid');
  assert.ok(result.output);
  if (result.output?.kind === 'spiking') {
    assert.ok(Math.abs(result.output.spikeVolumeMl - 0.1) < 1e-12);
  }
});

test('serial helper sums raw canonical volumes instead of mixed display units', () => {
  const result = calculatePrep({
    mode: 'serial',
    stockName: 'Stock dãy chuẩn',
    stock: ppm(1000),
    pointVolume: volume(10),
    targets: [ppm(1), ppm(10), ppm(100)]
  });
  assert.equal(result.status, 'valid');
  assert.ok(result.output);
  if (result.output?.kind === 'serial') {
    assert.equal(result.output.rows.length, 3);
    assert.ok(Math.abs(result.output.totalStockVolumeMl - 1.11) < 1e-12);
    assert.ok(Math.abs(result.output.rows[0].stockVolumeMl - 0.01) < 1e-12);
  }

  const mixedDisplayUnits = calculatePrep({
    mode: 'serial',
    stockName: 'Stock dãy chuẩn',
    stock: ppm(1000),
    pointVolume: volume(10000, 'ul'),
    targets: [ppm(1), ppm(10), ppm(100)]
  });
  assert.equal(mixedDisplayUnits.status, 'valid');
  if (mixedDisplayUnits.output?.kind === 'serial') {
    assert.ok(Math.abs(mixedDisplayUnits.output.totalStockVolumeMl - 1.11) < 1e-12);
  }
});

test('mix helper requires explicit stock units and rejects overfilled final volume', () => {
  const valid = calculatePrep({
    mode: 'mix',
    finalVolume: volume(100),
    rows: [{
      id: 'a',
      name: 'A',
      stock: { value: 1, unit: 'mg/ml', basis: 'mass_per_volume' },
      target: ppm(1)
    }]
  });
  assert.equal(valid.status, 'valid');
  assert.ok(valid.output);
  if (valid.output?.kind === 'mix') {
    assert.ok(Math.abs(valid.output.rows[0].stockVolumeMl - 0.1) < 1e-12);
  }

  const invalid = calculatePrep({
    mode: 'mix',
    finalVolume: volume(1),
    rows: [
      { id: 'a', name: 'A', stock: ppm(1000), target: ppm(1000) },
      { id: 'b', name: 'B', stock: ppm(1000), target: ppm(1000) }
    ]
  });
  assert.equal(invalid.status, 'invalid');
  assert.equal(invalid.output, null);
  assert.ok(invalid.issues.some(item => item.code === 'COMPONENTS_EXCEED_FINAL_VOLUME'));
});

test('sample prep validates stage order and recovery', () => {
  const result = calculatePrep({
    mode: 'sample_prep',
    sampleName: 'Mẫu mô phỏng',
    sampleMass: mass(10),
    extractVolume: volume(10),
    cleanupAliquot: volume(6),
    concentrationAliquot: volume(5),
    finalVolume: volume(1),
    recovery: 80,
    instrument: ppm(1)
  });
  assert.equal(result.status, 'valid');
  assert.ok(result.output);
  if (result.output?.kind === 'sample_prep') {
    assert.ok(Math.abs(result.output.factor - 0.2) < 1e-12);
    assert.ok(Math.abs(result.output.sampleConcentrationGPerL - 0.00025) < 1e-12);
  }

  const invalid = calculatePrep({
    mode: 'sample_prep',
    sampleName: '',
    sampleMass: mass(10),
    extractVolume: volume(10),
    cleanupAliquot: volume(11),
    concentrationAliquot: volume(5),
    finalVolume: volume(1),
    recovery: 80,
    instrument: ppm(1)
  });
  assert.equal(invalid.status, 'invalid');
  assert.equal(invalid.output, null);
  assert.ok(invalid.issues.some(item => item.code === 'STAGE_ORDER_INVALID'));
});

test('engine rejects incompatible quantity dimensions and incomplete input', () => {
  const invalid = calculatePrep({
    mode: 'molar',
    name: '',
    mass: volume(10) as QuantityDraft,
    purity: 100,
    finalVolume: volume(10),
    molecularWeight: 10
  });
  assert.equal(invalid.status, 'invalid');
  assert.equal(invalid.output, null);
  assert.ok(invalid.issues.some(item => item.code === 'DIMENSION_MISMATCH'));

  const incomplete = calculatePrep({
    mode: 'dilution',
    stockName: '',
    stock: ppm(null),
    target: ppm(10),
    finalVolume: volume(10)
  });
  assert.equal(incomplete.status, 'incomplete');
  assert.equal(incomplete.output, null);
});

test('concentration basis remains explicit for ppm and mass-over-mass units', () => {
  const ppmIssues: CalculationIssue[] = [];
  assert.equal(
    concentrationToGPerL({ value: 1, unit: 'ppm', basis: 'mass_per_volume' }, 'ppm', 'ppm', ppmIssues),
    0.001
  );
  assert.deepEqual(ppmIssues, []);

  const massMassIssues: CalculationIssue[] = [];
  const massMassValue = concentrationToGPerL({
      value: 1,
      unit: 'mg/kg',
      basis: 'mass_per_mass',
      densityGPerMl: 0.8
    }, 'concentration', 'mg/kg', massMassIssues);
  assert.ok(massMassValue !== null && Math.abs(massMassValue - 0.0008) < 1e-15);
  assert.deepEqual(massMassIssues, []);

  const missingDensityIssues: CalculationIssue[] = [];
  assert.equal(
    concentrationToGPerL({ value: 1, unit: 'mg/kg', basis: 'mass_per_mass' }, 'concentration', 'mg/kg', missingDensityIssues),
    null
  );
  assert.ok(missingDensityIssues.some(issue => issue.code === 'MISSING_INPUT'));

  const missingFractionDensityIssues: CalculationIssue[] = [];
  assert.equal(
    concentrationToGPerL({ value: 1, unit: '%', basis: 'mass_fraction' }, 'concentration', '%', missingFractionDensityIssues),
    null
  );
  assert.ok(missingFractionDensityIssues.some(issue => issue.code === 'MISSING_INPUT'));
});

test('engine blocks negative values and zero denominators', () => {
  const negativeResult = calculatePrep({
    mode: 'dilution',
    stockName: '',
    stock: ppm(-1),
    target: ppm(1),
    finalVolume: volume(1)
  });
  assert.equal(negativeResult.status, 'invalid');
  assert.equal(negativeResult.output, null);
  assert.ok(negativeResult.issues.some(issue => issue.code === 'NEGATIVE_VALUE'));

  const zeroResult = calculatePrep({
    mode: 'dilution',
    stockName: '',
    stock: ppm(1),
    target: ppm(1),
    finalVolume: volume(0)
  });
  assert.equal(zeroResult.status, 'incomplete');
  assert.equal(zeroResult.output, null);
  assert.ok(zeroResult.issues.some(issue => issue.code === 'MISSING_INPUT'));

  const emptyMix = calculatePrep({
    mode: 'mix',
    finalVolume: volume(10),
    rows: []
  });
  assert.equal(emptyMix.status, 'invalid');
  assert.ok(emptyMix.issues.some(issue => issue.code === 'MISSING_ROWS'));
});
