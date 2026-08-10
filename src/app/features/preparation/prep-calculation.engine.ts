import {
  CalculationIssue,
  CalculationTraceStep,
  ConcentrationDraft,
  DilutionDraft,
  MixDraft,
  MixDraftRow,
  MolarDraft,
  PrepCalculationResult,
  PrepDraft,
  PrepOutput,
  QuantityDraft,
  SamplePrepDraft,
  SerialDraft,
  SpikingDraft
} from './prep-domain.types';

const MASS_TO_G: Record<string, number> = {
  g: 1, gram: 1, mg: 0.001, milligram: 0.001, kg: 1000, kilogram: 1000,
  ug: 0.000001, µg: 0.000001, mcg: 0.000001
};

const VOLUME_TO_ML: Record<string, number> = {
  ml: 1, milliliter: 1, l: 1000, liter: 1000,
  ul: 0.001, µl: 0.001, microliter: 0.001
};

const MOLAR_TO_M: Record<string, number> = {
  m: 1, mm: 0.001, um: 0.000001, µm: 0.000001
};

const MASS_VOLUME_TO_G_PER_L: Record<string, number> = {
  'g/l': 1, 'g/ml': 1000, 'mg/ml': 1, 'mg/l': 0.001,
  'ug/ml': 0.001, 'µg/ml': 0.001, 'ug/l': 0.000001, 'µg/l': 0.000001,
  ppm: 0.001, ppb: 0.000001
};

const MASS_FRACTION_TO_FRACTION: Record<string, number> = {
  '%': 0.01, percent: 0.01, 'g/g': 1, 'mg/mg': 1
};

const MASS_MASS_TO_FRACTION: Record<string, number> = {
  'g/g': 1, 'mg/mg': 1, 'mg/kg': 0.000001, ppm: 0.000001, ppb: 0.000000001
};

function cleanUnit(unit: string): string {
  return (unit || '').trim().toLowerCase().replace(/μ/g, 'µ');
}

function addIssue(
  issues: CalculationIssue[],
  code: string,
  path: string,
  message: string,
  severity: 'error' | 'warning' = 'error'
): void {
  issues.push({ code, path, message, severity });
}

function requiredNumber(
  value: number | null | undefined,
  path: string,
  label: string,
  issues: CalculationIssue[]
): number | null {
  if (value === null || value === undefined || Number.isNaN(value)) {
    addIssue(issues, 'MISSING_INPUT', path, 'Nhập ' + label + '.');
    return null;
  }
  if (!Number.isFinite(value)) {
    addIssue(issues, 'INVALID_NUMBER', path, label + ' phải là một số hữu hạn.');
    return null;
  }
  if (value < 0) {
    addIssue(issues, 'NEGATIVE_VALUE', path, label + ' không được âm.');
    return null;
  }
  if (value === 0) {
    addIssue(issues, 'MISSING_INPUT', path, label + ' phải lớn hơn 0.');
    return null;
  }
  return value;
}

function optionalNumber(
  value: number | null | undefined,
  path: string,
  label: string,
  issues: CalculationIssue[]
): number | null {
  if (value === null || value === undefined || value === 0) return null;
  if (!Number.isFinite(value) || value < 0) {
    addIssue(issues, 'INVALID_NUMBER', path, label + ' phải là số không âm hữu hạn.');
    return null;
  }
  return value;
}

function requiredQuantity(
  quantity: QuantityDraft,
  path: string,
  label: string,
  expectedDimension: QuantityDraft['dimension'],
  factors: Record<string, number>,
  issues: CalculationIssue[]
): number | null {
  if (quantity.dimension !== expectedDimension) {
    addIssue(issues, 'DIMENSION_MISMATCH', path, label + ' phải có dimension ' + expectedDimension + '.');
    return null;
  }
  const value = requiredNumber(quantity.value, path + '.value', label, issues);
  if (value === null) return null;
  const factor = factors[cleanUnit(quantity.unit)];
  if (factor === undefined) {
    addIssue(issues, 'UNKNOWN_UNIT', path + '.unit', 'Không nhận diện được đơn vị ' + (quantity.unit || '(trống)') + ' của ' + label + '.');
    return null;
  }
  return value * factor;
}

export function concentrationToGPerL(
  concentration: ConcentrationDraft,
  path: string,
  label: string,
  issues: CalculationIssue[]
): number | null {
  const value = requiredNumber(concentration.value, path + '.value', label, issues);
  if (value === null) return null;
  const unit = cleanUnit(concentration.unit);

  if (concentration.basis === 'mass_per_volume') {
    const factor = MASS_VOLUME_TO_G_PER_L[unit];
    if (factor === undefined) {
      addIssue(issues, 'UNKNOWN_CONCENTRATION_UNIT', path + '.unit', 'Không nhận diện được đơn vị nồng độ ' + concentration.unit + '.');
      return null;
    }
    return value * factor;
  }

  if (concentration.basis === 'molar') {
    const molarFactor = MOLAR_TO_M[unit];
    if (molarFactor === undefined) {
      addIssue(issues, 'UNKNOWN_CONCENTRATION_UNIT', path + '.unit', 'Đơn vị ' + concentration.unit + ' không phải đơn vị molar hợp lệ.');
      return null;
    }
    const molecularWeight = requiredNumber(
      concentration.molecularWeight,
      path + '.molecularWeight',
      'phân tử lượng để đổi nồng độ molar',
      issues
    );
    return molecularWeight === null ? null : value * molarFactor * molecularWeight;
  }

  if (concentration.basis === 'mass_fraction') {
    const fractionFactor = MASS_FRACTION_TO_FRACTION[unit];
    if (fractionFactor === undefined) {
      addIssue(issues, 'UNKNOWN_CONCENTRATION_UNIT', path + '.unit', 'Không nhận diện được đơn vị phần khối lượng ' + concentration.unit + '.');
      return null;
    }
    const density = requiredNumber(
      concentration.densityGPerMl,
      path + '.densityGPerMl',
      'khối lượng riêng để đổi phần khối lượng',
      issues
    );
    return density === null ? null : value * fractionFactor * density * 1000;
  }

  const fractionFactor = MASS_MASS_TO_FRACTION[unit];
  if (fractionFactor === undefined) {
    addIssue(issues, 'UNKNOWN_CONCENTRATION_UNIT', path + '.unit', 'Không nhận diện được đơn vị phần khối lượng trên khối lượng ' + concentration.unit + '.');
    return null;
  }
  const density = requiredNumber(
    concentration.densityGPerMl,
    path + '.densityGPerMl',
    'khối lượng riêng để đổi khối lượng trên khối lượng',
    issues
  );
  return density === null ? null : value * fractionFactor * density * 1000;
}

function calculated<T extends PrepOutput>(
  output: T | null,
  issues: CalculationIssue[],
  normalizedInputs: Record<string, number | string>,
  trace: CalculationTraceStep[]
): PrepCalculationResult<T> {
  const hasError = issues.some(item => item.severity === 'error');
  const incomplete = issues.some(item => item.code === 'MISSING_INPUT');
  return {
    status: hasError ? (incomplete ? 'incomplete' : 'invalid') : 'valid',
    output: hasError ? null : output,
    issues,
    normalizedInputs,
    trace
  };
}

function calculateMolar(draft: MolarDraft): PrepCalculationResult<PrepOutput> {
  const issues: CalculationIssue[] = [];
  const trace: CalculationTraceStep[] = [];
  const massG = requiredQuantity(draft.mass, 'mass', 'khối lượng cân', 'mass', MASS_TO_G, issues);
  const volumeMl = requiredQuantity(draft.finalVolume, 'finalVolume', 'thể tích định mức', 'volume', VOLUME_TO_ML, issues);
  const purity = requiredNumber(draft.purity, 'purity', 'độ tinh khiết', issues);
  const molecularWeight = optionalNumber(draft.molecularWeight, 'molecularWeight', 'phân tử lượng', issues);

  if (purity !== null && (purity <= 0 || purity > 100)) {
    addIssue(issues, 'PURITY_OUT_OF_RANGE', 'purity', 'Độ tinh khiết phải lớn hơn 0 và không vượt quá 100%.');
  }
  if (massG === null || volumeMl === null || purity === null) {
    return calculated(null, issues, {}, trace);
  }

  const activeMassG = massG * purity / 100;
  const volumeL = volumeMl / 1000;
  const massConcentrationGPerL = activeMassG / volumeL;
  const molarConcentrationM = molecularWeight === null ? null : (activeMassG / molecularWeight) / volumeL;

  trace.push(
    { label: 'Khối lượng hoạt chất', expression: 'm × purity / 100', value: activeMassG, unit: 'g' },
    { label: 'Nồng độ khối lượng', expression: 'm_active / V_final', value: massConcentrationGPerL, unit: 'g/L' }
  );
  if (molarConcentrationM !== null) {
    trace.push({ label: 'Nồng độ molar', expression: '(m_active / MW) / V_final', value: molarConcentrationM, unit: 'M' });
  }

  return calculated({
    kind: 'molar',
    name: draft.name.trim() || 'Chất mô phỏng',
    activeMassG,
    massConcentrationGPerL,
    molarConcentrationM,
    massAlternatives: [
      { value: massConcentrationGPerL, unit: 'g/L' },
      { value: massConcentrationGPerL, unit: 'mg/mL' },
      { value: massConcentrationGPerL * 1000, unit: 'mg/L' },
      { value: massConcentrationGPerL / 10, unit: '% w/v' }
    ],
    molarAlternatives: molarConcentrationM === null ? [] : [
      { value: molarConcentrationM, unit: 'M' },
      { value: molarConcentrationM * 1000, unit: 'mM' },
      { value: molarConcentrationM * 1000000, unit: 'µM' }
    ]
  }, issues, {
    massG,
    volumeMl,
    purity,
    ...(molecularWeight === null ? {} : { molecularWeight })
  }, trace);
}

function calculateDilution(draft: DilutionDraft): PrepCalculationResult<PrepOutput> {
  const issues: CalculationIssue[] = [];
  const trace: CalculationTraceStep[] = [];
  const stock = concentrationToGPerL(draft.stock, 'stock', 'nồng độ stock', issues);
  const target = concentrationToGPerL(draft.target, 'target', 'nồng độ đích', issues);
  const finalVolumeMl = requiredQuantity(draft.finalVolume, 'finalVolume', 'thể tích cuối', 'volume', VOLUME_TO_ML, issues);
  if (stock !== null && stock <= 0) addIssue(issues, 'STOCK_NOT_POSITIVE', 'stock.value', 'Nồng độ stock phải lớn hơn 0.');
  if (target !== null && stock !== null && target > stock) {
    addIssue(issues, 'TARGET_EXCEEDS_STOCK', 'target.value', 'Nồng độ đích không được lớn hơn stock trong flow pha loãng.');
  }
  if (stock === null || target === null || finalVolumeMl === null) {
    return calculated(null, issues, {}, trace);
  }
  const stockVolumeMl = target * finalVolumeMl / stock;
  const solventVolumeMl = finalVolumeMl - stockVolumeMl;
  if (solventVolumeMl < 0) addIssue(issues, 'NEGATIVE_SOLVENT', 'finalVolume', 'Thể tích dung môi không thể âm.');
  trace.push(
    { label: 'Thể tích stock', expression: 'C_target × V_final / C_stock', value: stockVolumeMl, unit: 'mL' },
    { label: 'Dung môi bù đủ', expression: 'V_final - V_stock', value: solventVolumeMl, unit: 'mL' }
  );
  return calculated({
    kind: 'dilution',
    stockName: draft.stockName.trim() || 'Stock mô phỏng',
    stockVolumeMl,
    solventVolumeMl,
    finalVolumeMl,
    stockConcentrationGPerL: stock,
    targetConcentrationGPerL: target
  }, issues, { stockGPerL: stock, targetGPerL: target, finalVolumeMl }, trace);
}

function calculateSpiking(draft: SpikingDraft): PrepCalculationResult<PrepOutput> {
  const issues: CalculationIssue[] = [];
  const trace: CalculationTraceStep[] = [];
  const stock = concentrationToGPerL(draft.stock, 'stock', 'nồng độ stock', issues);
  const added = concentrationToGPerL(draft.added, 'added', 'nồng độ thêm vào', issues);
  const sampleVolumeMl = requiredQuantity(draft.sampleVolume, 'sampleVolume', 'thể tích nền mẫu', 'volume', VOLUME_TO_ML, issues);
  if (stock !== null && stock <= 0) addIssue(issues, 'STOCK_NOT_POSITIVE', 'stock.value', 'Nồng độ stock phải lớn hơn 0.');
  if (stock === null || added === null || sampleVolumeMl === null) {
    return calculated(null, issues, {}, trace);
  }
  const spikeVolumeMl = added * sampleVolumeMl / stock;
  trace.push({ label: 'Thể tích thêm chuẩn', expression: 'C_added × V_sample / C_stock', value: spikeVolumeMl, unit: 'mL' });
  return calculated({
    kind: 'spiking',
    stockName: draft.stockName.trim() || 'Stock mô phỏng',
    sampleName: draft.sampleName.trim() || 'Nền mẫu mô phỏng',
    spikeVolumeMl,
    sampleVolumeMl,
    stockConcentrationGPerL: stock,
    addedConcentrationGPerL: added
  }, issues, { stockGPerL: stock, addedGPerL: added, sampleVolumeMl }, trace);
}

function calculateSerial(draft: SerialDraft): PrepCalculationResult<PrepOutput> {
  const issues: CalculationIssue[] = [];
  const trace: CalculationTraceStep[] = [];
  const stock = concentrationToGPerL(draft.stock, 'stock', 'nồng độ stock', issues);
  const pointVolumeMl = requiredQuantity(draft.pointVolume, 'pointVolume', 'thể tích mỗi điểm', 'volume', VOLUME_TO_ML, issues);
  if (!draft.targets.length) addIssue(issues, 'MISSING_TARGETS', 'targets', 'Thêm ít nhất một điểm chuẩn.');
  if (stock !== null && stock <= 0) addIssue(issues, 'STOCK_NOT_POSITIVE', 'stock.value', 'Nồng độ stock phải lớn hơn 0.');
  if (stock === null || pointVolumeMl === null || issues.some(item => item.code === 'MISSING_TARGETS')) {
    return calculated(null, issues, {}, trace);
  }

  const rows = draft.targets.map((target, index) => {
    const targetPath = 'targets[' + index + ']';
    const targetGPerL = concentrationToGPerL(target, targetPath, 'nồng độ điểm ' + (index + 1), issues);
    if (targetGPerL === null) return null;
    if (targetGPerL > stock) {
      addIssue(issues, 'TARGET_EXCEEDS_STOCK', targetPath, 'Điểm chuẩn ' + (index + 1) + ' không được lớn hơn stock.');
      return null;
    }
    const stockVolumeMl = targetGPerL * pointVolumeMl / stock;
    const solventVolumeMl = pointVolumeMl - stockVolumeMl;
    if (solventVolumeMl < 0) {
      addIssue(issues, 'NEGATIVE_SOLVENT', targetPath, 'Dung môi của điểm ' + (index + 1) + ' không thể âm.');
      return null;
    }
    return {
      index: index + 1,
      targetConcentrationGPerL: targetGPerL,
      targetDisplayValue: target.value || 0,
      targetDisplayUnit: target.unit,
      stockVolumeMl,
      solventVolumeMl
    };
  }).filter((row): row is NonNullable<typeof row> => row !== null);

  if (issues.some(item => item.severity === 'error')) return calculated(null, issues, {}, trace);
  const totalStockVolumeMl = rows.reduce((sum, row) => sum + row.stockVolumeMl, 0);
  const totalSolventVolumeMl = rows.reduce((sum, row) => sum + row.solventVolumeMl, 0);
  trace.push(
    { label: 'Tổng stock', expression: 'sum(V_stock_i)', value: totalStockVolumeMl, unit: 'mL' },
    { label: 'Tổng dung môi', expression: 'sum(V_solvent_i)', value: totalSolventVolumeMl, unit: 'mL' }
  );
  return calculated({
    kind: 'serial',
    stockName: draft.stockName.trim() || 'Stock mô phỏng',
    pointVolumeMl,
    rows,
    totalStockVolumeMl,
    totalSolventVolumeMl
  }, issues, { stockGPerL: stock, pointVolumeMl, pointCount: rows.length }, trace);
}

function validateMixRow(row: MixDraftRow, index: number, issues: CalculationIssue[]) {
  if (!row.name.trim()) addIssue(issues, 'MISSING_INPUT', 'rows[' + index + '].name', 'Nhập tên thành phần ' + (index + 1) + '.');
  const stock = concentrationToGPerL(row.stock, 'rows[' + index + '].stock', 'nồng độ stock dòng ' + (index + 1), issues);
  const target = concentrationToGPerL(row.target, 'rows[' + index + '].target', 'nồng độ đích dòng ' + (index + 1), issues);
  if (stock !== null && stock <= 0) addIssue(issues, 'STOCK_NOT_POSITIVE', 'rows[' + index + '].stock', 'Nồng độ stock dòng ' + (index + 1) + ' phải lớn hơn 0.');
  if (stock === null || target === null) return null;
  return {
    id: row.id,
    name: row.name.trim(),
    stockVolumeMl: 0,
    targetConcentrationGPerL: target,
    stockConcentrationGPerL: stock
  };
}

function calculateMix(draft: MixDraft): PrepCalculationResult<PrepOutput> {
  const issues: CalculationIssue[] = [];
  const trace: CalculationTraceStep[] = [];
  const finalVolumeMl = requiredQuantity(draft.finalVolume, 'finalVolume', 'thể tích cuối của hỗn hợp', 'volume', VOLUME_TO_ML, issues);
  if (!draft.rows.length) addIssue(issues, 'MISSING_ROWS', 'rows', 'Thêm ít nhất một thành phần mô phỏng.');
  if (finalVolumeMl === null || !draft.rows.length) return calculated(null, issues, {}, trace);

  const rows = draft.rows
    .map((row, index) => validateMixRow(row, index, issues))
    .filter((row): row is NonNullable<typeof row> => row !== null)
    .map(row => ({
      ...row,
      stockVolumeMl: row.targetConcentrationGPerL * finalVolumeMl / row.stockConcentrationGPerL
    }));

  if (issues.some(item => item.severity === 'error')) return calculated(null, issues, {}, trace);
  const componentVolumeMl = rows.reduce((sum, row) => sum + row.stockVolumeMl, 0);
  const solventVolumeMl = finalVolumeMl - componentVolumeMl;
  if (solventVolumeMl < 0) addIssue(issues, 'COMPONENTS_EXCEED_FINAL_VOLUME', 'rows', 'Tổng thể tích thành phần lớn hơn thể tích cuối.');
  trace.push(
    { label: 'Tổng thành phần', expression: 'sum(V_i)', value: componentVolumeMl, unit: 'mL' },
    { label: 'Dung môi bù đủ', expression: 'V_final - sum(V_i)', value: solventVolumeMl, unit: 'mL' }
  );
  return calculated({
    kind: 'mix',
    finalVolumeMl,
    rows,
    componentVolumeMl,
    solventVolumeMl
  }, issues, { finalVolumeMl, rowCount: rows.length }, trace);
}

function calculateSamplePrep(draft: SamplePrepDraft): PrepCalculationResult<PrepOutput> {
  const issues: CalculationIssue[] = [];
  const trace: CalculationTraceStep[] = [];
  const sampleMassG = requiredQuantity(draft.sampleMass, 'sampleMass', 'khối lượng mẫu', 'mass', MASS_TO_G, issues);
  const extractVolumeMl = requiredQuantity(draft.extractVolume, 'extractVolume', 'thể tích dịch chiết', 'volume', VOLUME_TO_ML, issues);
  const cleanupAliquotMl = requiredQuantity(draft.cleanupAliquot, 'cleanupAliquot', 'thể tích V2', 'volume', VOLUME_TO_ML, issues);
  const concentrationAliquotMl = requiredQuantity(draft.concentrationAliquot, 'concentrationAliquot', 'thể tích V3', 'volume', VOLUME_TO_ML, issues);
  const finalVolumeMl = requiredQuantity(draft.finalVolume, 'finalVolume', 'thể tích V4', 'volume', VOLUME_TO_ML, issues);
  const recovery = requiredNumber(draft.recovery, 'recovery', 'hiệu suất thu hồi', issues);
  const instrumentGPerL = concentrationToGPerL(draft.instrument, 'instrument', 'kết quả máy', issues);

  if (recovery !== null && (recovery <= 0 || recovery > 100)) {
    addIssue(issues, 'RECOVERY_OUT_OF_RANGE', 'recovery', 'Hiệu suất thu hồi phải lớn hơn 0 và không vượt quá 100%.');
  }
  if (extractVolumeMl !== null && cleanupAliquotMl !== null && cleanupAliquotMl > extractVolumeMl) {
    addIssue(issues, 'STAGE_ORDER_INVALID', 'cleanupAliquot', 'V2 không được lớn hơn thể tích dịch chiết.');
  }
  if (cleanupAliquotMl !== null && concentrationAliquotMl !== null && concentrationAliquotMl > cleanupAliquotMl) {
    addIssue(issues, 'STAGE_ORDER_INVALID', 'concentrationAliquot', 'V3 không được lớn hơn V2.');
  }
  if (
    sampleMassG === null ||
    extractVolumeMl === null ||
    cleanupAliquotMl === null ||
    concentrationAliquotMl === null ||
    finalVolumeMl === null ||
    recovery === null ||
    instrumentGPerL === null
  ) {
    return calculated(null, issues, {}, trace);
  }

  const factor = (extractVolumeMl * finalVolumeMl) / (sampleMassG * concentrationAliquotMl);
  const sampleConcentrationGPerL = instrumentGPerL * factor * (100 / recovery);
  trace.push(
    { label: 'Hệ số chuẩn bị mẫu', expression: '(V_extract × V_final) / (m × V_aliquot)', value: factor },
    { label: 'Nồng độ mẫu', expression: 'C_instrument × factor × (100 / recovery)', value: sampleConcentrationGPerL, unit: 'g/L' }
  );
  return calculated({
    kind: 'sample_prep',
    factor,
    instrumentConcentrationGPerL: instrumentGPerL,
    sampleConcentrationGPerL,
    extractVolumeMl,
    cleanupAliquotMl,
    concentrationAliquotMl,
    finalVolumeMl,
    recovery
  }, issues, {
    sampleMassG,
    extractVolumeMl,
    cleanupAliquotMl,
    concentrationAliquotMl,
    finalVolumeMl,
    recovery,
    instrumentGPerL
  }, trace);
}

export function calculatePrep(draft: PrepDraft): PrepCalculationResult<PrepOutput> {
  switch (draft.mode) {
    case 'molar': return calculateMolar(draft);
    case 'dilution': return calculateDilution(draft);
    case 'spiking': return calculateSpiking(draft);
    case 'serial': return calculateSerial(draft);
    case 'mix': return calculateMix(draft);
    case 'sample_prep': return calculateSamplePrep(draft);
  }
}
