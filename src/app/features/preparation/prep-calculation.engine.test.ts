import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculatePrep,
  concentrationToGPerL,
  suggestPipette,
  suggestVolumetricFlask
} from './prep-calculation.engine';
import {
  CalculationIssue,
  ConcentrationDraft,
  QuantityDraft,
  ResultConversionTaskDraft,
  SeriesTaskDraft,
  SpikeTaskDraft,
  TargetTaskDraft
} from './prep-domain.types';

const mass = (value: number | null, unit = 'g'): QuantityDraft => ({ value, unit, dimension: 'mass' });
const volume = (value: number | null, unit = 'mL'): QuantityDraft => ({ value, unit, dimension: 'volume' });
const c = (value: number | null, unit: string, basis: ConcentrationDraft['basis'], extras: Partial<ConcentrationDraft> = {}): ConcentrationDraft => ({ value, unit, basis, ...extras });
const ppm = (value: number | null): ConcentrationDraft => c(value, 'ppm', 'mass_per_volume');
const ppb = (value: number | null): ConcentrationDraft => c(value, 'ppb', 'mass_per_volume');
const ppt = (value: number | null): ConcentrationDraft => c(value, 'ppt', 'mass_per_volume');
const ppmKg = (value: number | null): ConcentrationDraft => c(value, 'ppm', 'mass_per_mass');
const ppbKg = (value: number | null): ConcentrationDraft => c(value, 'ppb', 'mass_per_mass');
const pptKg = (value: number | null): ConcentrationDraft => c(value, 'ppt', 'mass_per_mass');

function solidSubstance(overrides: Partial<TargetTaskDraft['substance']> = {}) {
  return { name: 'Chất thủ công', potencyPercent: 100, conversionFactor: 1, molecularWeight: null, densityGPerMl: null, ...overrides };
}

test('A: 10.2 mg at 98.5% in 10 mL gives 1004.7 mg/L', () => {
  const result = calculatePrep({
    mode: 'concentration',
    sourceType: 'solid',
    substance: solidSubstance({ name: 'Chất chuẩn A', potencyPercent: 98.5 }),
    plannedQuantity: mass(10.2, 'mg'),
    actualQuantity: null,
    finalVolume: volume(10)
  });
  assert.equal(result.status, 'valid');
  assert.ok(result.output?.kind === 'concentration');
  if (result.output?.kind === 'concentration') {
    assert.ok(Math.abs(result.output.actualConcentration.massPerVolumeGPerL - 1.0047) < 1e-12);
    assert.ok(Math.abs((result.output.activeMassG ?? 0) - 0.010047) < 1e-15);
    assert.ok(result.output.actualConcentration.alternatives.some(item => item.unit === 'mg/L' && Math.abs(item.value - 1004.7) < 1e-9));
  }
});

test('A: molar output is conditional on molecular weight', () => {
  const withoutMw = calculatePrep({
    mode: 'concentration',
    sourceType: 'solid',
    substance: solidSubstance({ molecularWeight: null }),
    plannedQuantity: mass(10, 'mg'),
    finalVolume: volume(10)
  });
  assert.equal(withoutMw.status, 'valid');
  assert.ok(withoutMw.output?.kind === 'concentration');
  if (withoutMw.output?.kind === 'concentration') assert.equal(withoutMw.output.actualConcentration.molarM, null);

  const withMw = calculatePrep({
    mode: 'concentration',
    sourceType: 'solid',
    substance: solidSubstance({ molecularWeight: 100 }),
    plannedQuantity: mass(10, 'mg'),
    finalVolume: volume(10)
  });
  assert.ok(withMw.output?.kind === 'concentration');
  if (withMw.output?.kind === 'concentration') assert.ok(Math.abs((withMw.output.actualConcentration.molarM ?? 0) - 0.01) < 1e-12);
});

test('units: ppm, ppb and ppt normalize correctly for volume basis', () => {
  const ppmIssues: CalculationIssue[] = [];
  const ppbIssues: CalculationIssue[] = [];
  const pptIssues: CalculationIssue[] = [];
  assert.equal(concentrationToGPerL(ppm(1), 'ppm', 'ppm', ppmIssues), 0.001);
  assert.equal(concentrationToGPerL(ppb(1), 'ppb', 'ppb', ppbIssues), 0.000001);
  assert.equal(concentrationToGPerL(ppt(1), 'ppt', 'ppt', pptIssues), 0.000000001);
  assert.deepEqual(ppmIssues, []);
  assert.deepEqual(ppbIssues, []);
  assert.deepEqual(pptIssues, []);
});

test('units: ppm, ppb and ppt normalize correctly for mass basis with density', () => {
  const ppmIssues: CalculationIssue[] = [];
  const ppbIssues: CalculationIssue[] = [];
  const pptIssues: CalculationIssue[] = [];
  assert.equal(concentrationToGPerL({ ...ppmKg(1), densityGPerMl: 1 }, 'ppm', 'ppm', ppmIssues), 0.001);
  assert.equal(concentrationToGPerL({ ...ppbKg(1), densityGPerMl: 1 }, 'ppb', 'ppb', ppbIssues), 0.000001);
  assert.equal(concentrationToGPerL({ ...pptKg(1), densityGPerMl: 1 }, 'ppt', 'ppt', pptIssues), 0.000000001);
  assert.deepEqual(ppmIssues, []);
  assert.deepEqual(ppbIssues, []);
  assert.deepEqual(pptIssues, []);
});

test('operation quantities stay in the KNV working units', () => {
  const liquid = calculatePrep({
    mode: 'target',
    sourceType: 'solution',
    substance: solidSubstance({ name: 'Dung dịch nguồn' }),
    targetConcentration: ppm(1000),
    sourceConcentration: ppm(1000),
    finalVolume: volume(1000)
  });
  assert.equal(liquid.status, 'valid');
  assert.ok(liquid.output?.kind === 'target');
  if (liquid.output?.kind === 'target') {
    assert.equal(liquid.output.plannedQuantity.displayValue, 1000);
    assert.equal(liquid.output.plannedQuantity.displayUnit, 'mL');
  }

  const milligrams = calculatePrep({
    mode: 'target',
    sourceType: 'solid',
    substance: solidSubstance({ name: 'Chất rắn' }),
    targetConcentration: c(1, 'g/L', 'mass_per_volume'),
    finalVolume: volume(10)
  });
  assert.equal(milligrams.status, 'valid');
  assert.ok(milligrams.output?.kind === 'target');
  if (milligrams.output?.kind === 'target') assert.equal(milligrams.output.plannedQuantity.displayUnit, 'mg');

  const grams = calculatePrep({
    mode: 'target',
    sourceType: 'solid',
    substance: solidSubstance({ name: 'Chất rắn nhiều' }),
    targetConcentration: c(100, 'g/L', 'mass_per_volume'),
    finalVolume: volume(10)
  });
  assert.equal(grams.status, 'valid');
  assert.ok(grams.output?.kind === 'target');
  if (grams.output?.kind === 'target') assert.equal(grams.output.plannedQuantity.displayUnit, 'g');
});

test('A: planned and actual quantities produce an actual concentration and deviation', () => {
  const result = calculatePrep({
    mode: 'concentration',
    sourceType: 'solution',
    substance: solidSubstance({ name: 'Stock 1000 ppm' }),
    plannedQuantity: volume(100, 'µL'),
    actualQuantity: volume(98, 'µL'),
    sourceConcentration: ppm(1000),
    targetConcentration: ppm(10),
    finalVolume: volume(10)
  });
  assert.equal(result.status, 'valid');
  assert.ok(result.output?.kind === 'concentration');
  if (result.output?.kind === 'concentration') {
    assert.ok(Math.abs(result.output.plannedConcentration!.massPerVolumeGPerL - 0.01) < 1e-12);
    assert.ok(Math.abs(result.output.actualConcentration.massPerVolumeGPerL - 0.0098) < 1e-12);
    assert.ok(Math.abs((result.output.deviationGPerL ?? 0) + 0.0002) < 1e-12);
  }
});

test('A/B: percent w/w requires density and target calculation uses the selected basis', () => {
  const missingDensityIssues: CalculationIssue[] = [];
  assert.equal(concentrationToGPerL(c(10, '% w/w', 'mass_fraction'), 'source', 'nguồn', missingDensityIssues), null);
  assert.ok(missingDensityIssues.some(issue => issue.code === 'MISSING_INPUT'));

  const result = calculatePrep({
    mode: 'target',
    sourceType: 'concentrate',
    substance: solidSubstance({ name: 'Hóa chất 10% w/w', densityGPerMl: 0.8 }),
    targetConcentration: c(8, 'g/L', 'mass_per_volume'),
    sourceConcentration: c(10, '% w/w', 'mass_fraction', { densityGPerMl: 0.8 }),
    finalVolume: volume(10)
  });
  assert.equal(result.status, 'valid');
  assert.ok(result.output?.kind === 'target');
  if (result.output?.kind === 'target') assert.ok(Math.abs(result.output.plannedQuantity.canonicalValue - 1) < 1e-12);
});

test('B: 1000 ppm to 10 ppm in 10 mL requires 100 µL and actual 98 µL gives 9.8 ppm', () => {
  const result = calculatePrep({
    mode: 'target',
    sourceType: 'solution',
    substance: solidSubstance({ name: 'Dung dịch nguồn' }),
    targetConcentration: ppm(10),
    sourceConcentration: ppm(1000),
    finalVolume: volume(10),
    actualQuantity: volume(98, 'µL')
  });
  assert.equal(result.status, 'valid');
  assert.ok(result.output?.kind === 'target');
  if (result.output?.kind === 'target') {
    assert.ok(Math.abs(result.output.plannedQuantity.canonicalValue - 0.1) < 1e-12);
    assert.equal(result.output.plannedQuantity.displayUnit, 'µL');
    assert.ok(Math.abs((result.output.actualConcentration?.massPerVolumeGPerL ?? 0) - 0.0098) < 1e-12);
  }
});

test('B: target above source is invalid and not silently clamped', () => {
  const result = calculatePrep({
    mode: 'target',
    sourceType: 'solution',
    substance: solidSubstance(),
    targetConcentration: ppm(100),
    sourceConcentration: ppm(10),
    finalVolume: volume(10)
  });
  assert.equal(result.status, 'invalid');
  assert.equal(result.output, null);
  assert.ok(result.issues.some(issue => issue.code === 'TARGET_EXCEEDS_SOURCE'));
});

test('B: balance display rounds only for presentation and warns at 0.00 mg', () => {
  const result = calculatePrep({
    mode: 'target',
    sourceType: 'solid',
    substance: solidSubstance(),
    targetConcentration: c(0.000001, 'g/L', 'mass_per_volume'),
    finalVolume: volume(1)
  });
  assert.equal(result.status, 'valid');
  assert.ok(result.output?.kind === 'target');
  if (result.output?.kind === 'target') {
    assert.ok(result.output.plannedQuantity.canonicalValue > 0);
    assert.equal(result.output.balanceDisplayMg, 0);
  }
  assert.ok(result.issues.some(issue => issue.code === 'MASS_BELOW_READABILITY'));
});

test('instrument catalog selects stable pipettes at overlap boundaries', () => {
  const cases = [
    [0.002, 'P20'],
    [0.02, 'P20'],
    [0.1, 'P100'],
    [0.2, 'P200'],
    [1, 'P1000'],
    [5, 'P5000'],
    [10, 'P10000']
  ] as const;
  for (const [volumeMl, expected] of cases) {
    const issues: CalculationIssue[] = [];
    assert.equal(suggestPipette(volumeMl, 'test', issues)?.id, expected);
    assert.equal(issues.length, 0);
  }
  const underIssues: CalculationIssue[] = [];
  assert.equal(suggestPipette(0.0015, 'test', underIssues), null);
  assert.ok(underIssues.some(issue => issue.code === 'PIPET_UNDER_RANGE'));
  const overIssues: CalculationIssue[] = [];
  assert.equal(suggestPipette(12, 'test', overIssues), null);
  assert.ok(overIssues.some(issue => issue.code === 'PIPET_OVER_RANGE'));
});

test('volumetric flask catalog accepts exact volume and warns for 25 mL', () => {
  const exactIssues: CalculationIssue[] = [];
  assert.deepEqual(suggestVolumetricFlask(10, 'finalVolume', exactIssues), { volumeMl: 10, exact: true });
  assert.deepEqual(exactIssues, []);
  const warningIssues: CalculationIssue[] = [];
  assert.deepEqual(suggestVolumetricFlask(25, 'finalVolume', warningIssues), { volumeMl: 25, exact: false });
  assert.ok(warningIssues.some(issue => issue.code === 'FLASK_NOT_AVAILABLE'));
});

test('C: solid spike 5 g at 0.05 mg/kg from 10 mg/L requires 25 µL', () => {
  const draft: SpikeTaskDraft = {
    mode: 'spike',
    matrix: 'solid',
    location: 'sample_initial',
    semantic: 'added_on_initial',
    standardName: 'Chuẩn 10 mg/L',
    sampleName: 'Mẫu 5 g',
    standard: c(10, 'mg/L', 'mass_per_volume'),
    target: c(0.05, 'mg/kg', 'mass_per_mass'),
    sampleQuantity: mass(5, 'g')
  };
  const result = calculatePrep(draft);
  assert.equal(result.status, 'valid');
  assert.ok(result.output?.kind === 'spike');
  if (result.output?.kind === 'spike') assert.ok(Math.abs(result.output.spikeVolumeMl - 0.025) < 1e-12);
});

test('C: solid spike supports µg/kg and subtracts the background for total target', () => {
  const result = calculatePrep({
    mode: 'spike',
    matrix: 'solid',
    location: 'sample_initial',
    semantic: 'final_total',
    standardName: 'Chuẩn 10 µg/mL',
    sampleName: 'Mẫu',
    standard: c(10, 'µg/mL', 'mass_per_volume'),
    target: c(0.1, 'mg/kg', 'mass_per_mass'),
    initialConcentration: c(0.05, 'mg/kg', 'mass_per_mass'),
    sampleQuantity: mass(5, 'g')
  });
  assert.equal(result.status, 'valid');
  assert.ok(result.output?.kind === 'spike');
  if (result.output?.kind === 'spike') assert.ok(Math.abs(result.output.spikeVolumeMl - 0.025) < 1e-12);

  const ugResult = calculatePrep({
    mode: 'spike',
    matrix: 'solid',
    location: 'sample_initial',
    semantic: 'added_on_initial',
    standardName: 'Chuẩn 10 µg/mL',
    sampleName: 'Mẫu',
    standard: c(10, 'µg/mL', 'mass_per_volume'),
    target: c(50, 'µg/kg', 'mass_per_mass'),
    sampleQuantity: mass(5, 'g')
  });
  assert.ok(ugResult.output?.kind === 'spike');
  if (ugResult.output?.kind === 'spike') assert.ok(Math.abs(ugResult.output.spikeVolumeMl - 0.025) < 1e-12);
});

test('C: liquid spike distinguishes initial-volume and final-total semantics', () => {
  const initial = calculatePrep({
    mode: 'spike', matrix: 'liquid', location: 'sample_initial', semantic: 'added_on_initial', standardName: 'S', sampleName: 'L',
    standard: ppm(1000), target: ppm(10), sampleQuantity: volume(10)
  });
  assert.ok(initial.output?.kind === 'spike');
  if (initial.output?.kind === 'spike') assert.ok(Math.abs(initial.output.spikeVolumeMl - 0.1) < 1e-12);

  const finalTotal = calculatePrep({
    mode: 'spike', matrix: 'liquid', location: 'final_vial', semantic: 'final_total', standardName: 'S', sampleName: 'L',
    standard: ppm(1000), target: ppm(100), sampleQuantity: volume(10)
  });
  assert.ok(finalTotal.output?.kind === 'spike');
  if (finalTotal.output?.kind === 'spike') assert.ok(Math.abs(finalTotal.output.spikeVolumeMl - 10 / 9) < 1e-12);

  const withBackground = calculatePrep({
    mode: 'spike', matrix: 'liquid', location: 'extract', semantic: 'final_total', standardName: 'S', sampleName: 'L',
    standard: ppm(1000), target: ppm(100), initialConcentration: ppm(20), sampleQuantity: volume(10)
  });
  assert.ok(withBackground.output?.kind === 'spike');
  if (withBackground.output?.kind === 'spike') assert.ok(Math.abs(withBackground.output.spikeVolumeMl - 80 / 90) < 1e-12);
});

test('C: large liquid spike volume is surfaced as a warning', () => {
  const result = calculatePrep({
    mode: 'spike', matrix: 'liquid', location: 'vial', semantic: 'final_total', standardName: 'S', sampleName: 'L',
    standard: ppm(101), target: ppm(100), sampleQuantity: volume(10)
  });
  assert.ok(result.issues.some(issue => issue.code === 'SPIKE_SIGNIFICANT_VOLUME'));
});

test('D: points can choose different intermediate sources and source demand remains local math', () => {
  const draft: SeriesTaskDraft = {
    mode: 'series', strategy: 'multi_intermediate', residualPercent: 10,
    sources: [
      { id: 'root', name: 'Root', concentration: ppm(1000), preparedVolume: volume(100) },
      { id: 'low', name: 'Low', concentration: ppm(10), preparedVolume: volume(10), sourceId: 'root' },
      { id: 'high', name: 'High', concentration: ppm(100), preparedVolume: volume(10), sourceId: 'root' }
    ],
    points: [
      { id: 'p1', label: '1 ppb', objectType: 'standard', targetConcentration: ppm(1), finalVolume: volume(10), sourceId: 'low' },
      { id: 'p2', label: '5 ppb', objectType: 'standard', targetConcentration: ppm(5), finalVolume: volume(10), sourceId: 'low' },
      { id: 'p3', label: '50 ppb', objectType: 'qc', targetConcentration: ppm(50), finalVolume: volume(10), sourceId: 'high' }
    ],
    components: [],
    additions: []
  };
  const result = calculatePrep(draft);
  assert.equal(result.status, 'valid');
  assert.ok(result.output?.kind === 'series');
  if (result.output?.kind === 'series') {
    assert.deepEqual(result.output.pointRows.map(row => row.sourceId), ['low', 'low', 'high']);
    assert.ok(Math.abs(result.output.pointRows[0].sourceVolumeMl - 1) < 1e-12);
    assert.ok(Math.abs(result.output.sourceDemand.find(row => row.sourceId === 'root')!.requiredVolumeMl - 1.1) < 1e-12);
    assert.ok(Math.abs(result.output.sourceDemand.find(row => row.sourceId === 'low')!.requiredVolumeMl - 6) < 1e-12);
  }
});

test('D: serial dilution records the previous point as the direct source', () => {
  const result = calculatePrep({
    mode: 'series', strategy: 'serial_dilution', residualPercent: 0,
    sources: [{ id: 'root', name: 'Root', concentration: ppm(1000), preparedVolume: volume(100) }],
    points: [
      { id: 'p1', label: 'P1', objectType: 'standard', targetConcentration: ppm(100), finalVolume: volume(10), sourceId: 'root' },
      { id: 'p2', label: 'P2', objectType: 'standard', targetConcentration: ppm(10), finalVolume: volume(10), sourceId: 'p1' }
    ], components: [], additions: []
  });
  assert.equal(result.status, 'valid');
  assert.ok(result.output?.kind === 'series');
  if (result.output?.kind === 'series') {
    assert.equal(result.output.pointRows[1].sourceId, 'p1');
    assert.equal(result.output.pointRows[1].sourceConcentrationGPerL, 0.1);
  }
});

test('D: multi-component mixture rejects component volume overfill', () => {
  const valid = calculatePrep({
    mode: 'series', strategy: 'multi_component', finalVolume: volume(10), sources: [{ id: 'root', name: 'Root', concentration: ppm(100), preparedVolume: volume(100) }], points: [],
    components: [
      { id: 'a', name: 'A', sourceId: 'root', targetConcentration: ppm(10) },
      { id: 'b', name: 'B', sourceId: 'root', targetConcentration: ppm(5) }
    ], additions: []
  });
  assert.equal(valid.status, 'valid');
  assert.ok(valid.output?.kind === 'series');
  if (valid.output?.kind === 'series') assert.ok(Math.abs(valid.output.componentRows[0].volumeMl - 1) < 1e-12);

  const invalid = calculatePrep({
    mode: 'series', strategy: 'multi_component', finalVolume: volume(1), sources: [{ id: 'root', name: 'Root', concentration: ppm(1000), preparedVolume: volume(100) }], points: [],
    components: [
      { id: 'a', name: 'A', sourceId: 'root', targetConcentration: ppm(1000) },
      { id: 'b', name: 'B', sourceId: 'root', targetConcentration: ppm(1000) }
    ], additions: []
  });
  assert.equal(invalid.status, 'invalid');
  assert.ok(invalid.issues.some(issue => issue.code === 'COMPONENTS_EXCEED_FINAL_VOLUME'));
});

test('D: internal standards/surrogates expand into per-object operations and scope exceptions', () => {
  const result = calculatePrep({
    mode: 'series', strategy: 'direct', residualPercent: 0,
    sources: [{ id: 'root', name: 'Root', concentration: ppm(1000), preparedVolume: volume(100) }],
    points: [
      { id: 'std', label: 'STD', objectType: 'standard', targetConcentration: ppm(10), finalVolume: volume(10), sourceId: 'root' },
      { id: 'blank', label: 'Blank', objectType: 'blank', targetConcentration: ppm(0.1), finalVolume: volume(10), sourceId: 'root' },
      { id: 'qc', label: 'QC', objectType: 'qc', targetConcentration: ppm(5), finalVolume: volume(10), sourceId: 'root' }
    ], components: [], additions: [{ id: 'is', type: 'internal_standard', name: 'IS', sourceId: 'root', source: ppm(1000), fixedVolume: volume(0.1), applicationScope: ['standard', 'blank', 'qc'], exceptions: ['blank'] }]
  });
  assert.equal(result.status, 'valid');
  assert.ok(result.output?.kind === 'series');
  if (result.output?.kind === 'series') {
    assert.deepEqual(result.output.additionRows.map(row => row.pointId), ['std', 'qc']);
    assert.ok(Math.abs(result.output.sourceDemand[0].requiredVolumeMl - 0.351) < 1e-12);
  }
});

test('D: blank points can carry zero analyte without inventing a pipette operation', () => {
  const result = calculatePrep({
    mode: 'series', strategy: 'direct', residualPercent: 0,
    sources: [{ id: 'root', name: 'Root', concentration: ppm(1000), preparedVolume: volume(100) }],
    points: [{ id: 'blank', label: 'Blank', objectType: 'blank', targetConcentration: ppm(0), finalVolume: volume(10), sourceId: 'root' }],
    components: [], additions: []
  });
  assert.equal(result.status, 'valid');
  assert.ok(result.output?.kind === 'series');
  if (result.output?.kind === 'series') {
    assert.equal(result.output.pointRows[0].sourceVolumeMl, 0);
    assert.equal(result.output.pointRows[0].pipette, null);
  }
});

test('E: stage model traces extraction, aliquot, concentration and reconstitution', () => {
  const draft: ResultConversionTaskDraft = {
    mode: 'result_conversion', sampleName: 'Mẫu', sampleBase: 'mass', sampleAmount: mass(10, 'g'), instrument: ppm(1), resultUnit: 'mg/kg',
    steps: [
      { id: 'extract', label: 'Chiết', type: 'extract', volume: volume(50) },
      { id: 'aliquot', label: 'Aliquot', type: 'aliquot', volume: volume(5) },
      { id: 'concentrate', label: 'Cô', type: 'concentration', volume: volume(1) },
      { id: 'reconstitute', label: 'Hoàn nguyên', type: 'reconstitution', volume: volume(1) }
    ]
  };
  const result = calculatePrep(draft);
  assert.equal(result.status, 'valid');
  assert.ok(result.output?.kind === 'result_conversion');
  if (result.output?.kind === 'result_conversion') {
    assert.ok(Math.abs(result.output.resultValue - 1) < 1e-12);
    assert.ok(Math.abs(result.output.overallRetentionFraction - 0.1) < 1e-12);
    assert.equal(result.output.stages[1].concentrationFactor, 10);
  }
});

test('E: transfer-all does not invent an aliquot factor and missing stages do not return zero', () => {
  const result = calculatePrep({
    mode: 'result_conversion', sampleName: 'Mẫu', sampleBase: 'mass', sampleAmount: mass(10, 'g'), instrument: ppm(1), resultUnit: 'mg/kg',
    steps: [{ id: 'extract', label: 'Chiết', type: 'extract', volume: volume(10) }, { id: 'transfer', label: 'Chuyển toàn lượng', type: 'transfer_all' }, { id: 'final', label: 'Hoàn nguyên', type: 'reconstitution', volume: volume(1) }]
  });
  assert.equal(result.status, 'valid');
  assert.ok(result.output?.kind === 'result_conversion');
  if (result.output?.kind === 'result_conversion') assert.equal(result.output.overallRetentionFraction, 1);

  const incomplete = calculatePrep({ mode: 'result_conversion', sampleName: 'Mẫu', sampleBase: 'mass', sampleAmount: mass(10, 'g'), instrument: ppm(1), resultUnit: 'mg/kg', steps: [] });
  assert.equal(incomplete.status, 'incomplete');
  assert.equal(incomplete.output, null);
});

test('engine rejects incompatible bases, negative values and missing denominators', () => {
  const massMassIssues: CalculationIssue[] = [];
  assert.equal(concentrationToGPerL(ppmKg(1), 'concentration', 'mg/kg', massMassIssues), null);
  assert.ok(massMassIssues.some(issue => issue.code === 'MISSING_INPUT'));
  const convertedIssues: CalculationIssue[] = [];
  assert.ok(Math.abs((concentrationToGPerL(c(1, 'mg/kg', 'mass_per_mass', { densityGPerMl: 0.8 }), 'concentration', 'mg/kg', convertedIssues) ?? 0) - 0.0008) < 1e-15);
  assert.deepEqual(convertedIssues, []);

  const negative = calculatePrep({ mode: 'target', sourceType: 'solution', substance: solidSubstance(), targetConcentration: ppm(1), sourceConcentration: ppm(-1), finalVolume: volume(1) });
  assert.equal(negative.status, 'invalid');
  assert.ok(negative.issues.some(issue => issue.code === 'NEGATIVE_VALUE'));
  const zero = calculatePrep({ mode: 'target', sourceType: 'solution', substance: solidSubstance(), targetConcentration: ppm(1), sourceConcentration: ppm(1), finalVolume: volume(0) });
  assert.equal(zero.status, 'incomplete');
  assert.ok(zero.issues.some(issue => issue.code === 'MISSING_INPUT'));
});
