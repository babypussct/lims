import {
  AdditionDraft,
  CalculationIssue,
  CalculationTraceStep,
  ConcentrationAlternative,
  ConcentrationDraft,
  ConcentrationOutput,
  ConcentrationSnapshot,
  ConcentrationTaskDraft,
  PrepCalculationResult,
  PrepDraft,
  PrepOutput,
  PrepSourceType,
  QuantityDraft,
  QuantityResult,
  ResultConversionOutput,
  ResultConversionTaskDraft,
  SampleProcessingStepDraft,
  SeriesComponentOutput,
  SeriesPointDraft,
  SeriesPointOutput,
  SeriesSourceDraft,
  SeriesTaskDraft,
  SpikeTaskDraft,
  TargetOutput,
  TargetTaskDraft,
  VolumetricFlaskSuggestion,
  PipetteSuggestion
} from './prep-domain.types';

export const PIPETTE_RANGES: readonly PipetteSuggestion[] = [
  { id: 'P20', minUl: 2, maxUl: 20, volumeUl: 0 },
  { id: 'P100', minUl: 10, maxUl: 100, volumeUl: 0 },
  { id: 'P200', minUl: 20, maxUl: 200, volumeUl: 0 },
  { id: 'P1000', minUl: 100, maxUl: 1000, volumeUl: 0 },
  { id: 'P5000', minUl: 500, maxUl: 5000, volumeUl: 0 },
  { id: 'P10000', minUl: 1000, maxUl: 10000, volumeUl: 0 }
];

export const VOLUMETRIC_FLASKS_ML: readonly number[] = [2, 5, 10, 20, 50, 100, 1000];

const MASS_TO_G: Record<string, number> = {
  kg: 1000,
  kilogram: 1000,
  g: 1,
  gram: 1,
  mg: 0.001,
  milligram: 0.001,
  ug: 0.000001,
  µg: 0.000001,
  mcg: 0.000001,
  ng: 0.000000001
};

const VOLUME_TO_ML: Record<string, number> = {
  l: 1000,
  liter: 1000,
  litre: 1000,
  ml: 1,
  milliliter: 1,
  millilitre: 1,
  ul: 0.001,
  µl: 0.001,
  microliter: 0.001,
  microlitre: 0.001
};

const MOLAR_TO_M: Record<string, number> = {
  m: 1,
  'mol/l': 1,
  mm: 0.001,
  'mmol/l': 0.001,
  um: 0.000001,
  'µm': 0.000001,
  'µmol/l': 0.000001,
  'umol/l': 0.000001
};

const MASS_VOLUME_TO_G_PER_L: Record<string, number> = {
  'g/l': 1,
  'g/ml': 1000,
  'mg/ml': 1,
  'mg/l': 0.001,
  'ug/ml': 0.001,
  'µg/ml': 0.001,
  'ug/l': 0.000001,
  'µg/l': 0.000001,
  'ng/ml': 0.000001,
  'ng/l': 0.000000001,
  ppm: 0.001,
  ppb: 0.000001,
  ppt: 0.000000001,
  '% w/v': 10
};

const MASS_MASS_TO_G_PER_KG: Record<string, number> = {
  'g/kg': 1,
  'mg/kg': 0.001,
  'ug/kg': 0.000001,
  'µg/kg': 0.000001,
  'ng/kg': 0.000000001,
  ppm: 0.001,
  ppb: 0.000001,
  ppt: 0.000000001
};

const VOLUME_VOLUME_TO_RATIO: Record<string, number> = {
  'ml/l': 0.001,
  'ul/ml': 0.001,
  'µl/ml': 0.001,
  '% v/v': 0.01
};

const MASS_FRACTION_TO_RATIO: Record<string, number> = {
  '%': 0.01,
  '% w/w': 0.01,
  percent: 0.01,
  'g/g': 1,
  'mg/mg': 1
};

function cleanUnit(unit: string): string {
  return (unit || '').trim().toLowerCase().replace(/μ/g, 'µ');
}

function addIssue(
  issues: CalculationIssue[],
  code: string,
  path: string,
  message: string,
  severity: CalculationIssue['severity'] = 'error',
  suggestedAction?: string
): void {
  issues.push({ code, path, message, severity, ...(suggestedAction ? { suggestedAction } : {}) });
}

function requiredNumber(
  value: number | null | undefined,
  path: string,
  label: string,
  issues: CalculationIssue[]
): number | null {
  if (value === null || value === undefined || value === 0 || Number.isNaN(value)) {
    addIssue(issues, 'MISSING_INPUT', path, 'Nhập ' + label + ' lớn hơn 0.');
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
  return value;
}

function optionalNumber(
  value: number | null | undefined,
  path: string,
  label: string,
  issues: CalculationIssue[],
  allowZero = false
): number | null {
  if (value === null || value === undefined || (value === 0 && !allowZero)) return null;
  if (!Number.isFinite(value) || value < 0 || (!allowZero && value === 0)) {
    addIssue(issues, 'INVALID_NUMBER', path, label + ' phải là số dương hữu hạn.');
    return null;
  }
  return value;
}

function requiredQuantity(
  quantity: QuantityDraft | null | undefined,
  path: string,
  label: string,
  expectedDimension: QuantityDraft['dimension'],
  factors: Record<string, number>,
  issues: CalculationIssue[]
): number | null {
  if (!quantity) {
    addIssue(issues, 'MISSING_INPUT', path, 'Nhập ' + label + '.');
    return null;
  }
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

function optionalQuantity(
  quantity: QuantityDraft | null | undefined,
  path: string,
  label: string,
  expectedDimension: QuantityDraft['dimension'],
  factors: Record<string, number>,
  issues: CalculationIssue[]
): number | null {
  if (quantity === null || quantity === undefined || quantity.value === null || quantity.value === undefined) {
    return null;
  }
  if (quantity.dimension !== expectedDimension) {
    addIssue(issues, 'DIMENSION_MISMATCH', path, label + ' phải có dimension ' + expectedDimension + '.');
    return null;
  }
  if (!Number.isFinite(quantity.value) || quantity.value <= 0) {
    addIssue(issues, quantity.value !== null && quantity.value < 0 ? 'NEGATIVE_VALUE' : 'INVALID_NUMBER', path + '.value', label + ' phải là số dương hữu hạn.');
    return null;
  }
  const factor = factors[cleanUnit(quantity.unit)];
  if (factor === undefined) {
    addIssue(issues, 'UNKNOWN_UNIT', path + '.unit', 'Không nhận diện được đơn vị ' + (quantity.unit || '(trống)') + ' của ' + label + '.');
    return null;
  }
  return quantity.value * factor;
}

function requireName(value: string, path: string, label: string, issues: CalculationIssue[]): string {
  const name = (value || '').trim();
  if (!name) addIssue(issues, 'MISSING_INPUT', path, 'Nhập ' + label + '.');
  return name;
}

export interface NormalizedConcentration {
  basis: ConcentrationDraft['basis'];
  canonicalValue: number;
  canonicalUnit: string;
}

export function normalizeConcentration(
  concentration: ConcentrationDraft,
  path: string,
  label: string,
  issues: CalculationIssue[],
  allowZero = false
): NormalizedConcentration | null {
  const value = allowZero && concentration.value === 0
    ? 0
    : requiredNumber(concentration.value, path + '.value', label, issues);
  if (value === null) return null;
  const unit = cleanUnit(concentration.unit);

  switch (concentration.basis) {
    case 'mass_per_volume': {
      const factor = MASS_VOLUME_TO_G_PER_L[unit];
      if (factor === undefined) {
        addIssue(issues, 'UNKNOWN_CONCENTRATION_UNIT', path + '.unit', 'Đơn vị ' + concentration.unit + ' không thuộc cơ sở khối lượng/thể tích.');
        return null;
      }
      return { basis: concentration.basis, canonicalValue: value * factor, canonicalUnit: 'g/L' };
    }
    case 'mass_per_mass': {
      const factor = MASS_MASS_TO_G_PER_KG[unit];
      if (factor === undefined) {
        addIssue(issues, 'UNKNOWN_CONCENTRATION_UNIT', path + '.unit', 'Đơn vị ' + concentration.unit + ' không thuộc cơ sở khối lượng/khối lượng.');
        return null;
      }
      return { basis: concentration.basis, canonicalValue: value * factor, canonicalUnit: 'g/kg' };
    }
    case 'molar': {
      const factor = MOLAR_TO_M[unit];
      if (factor === undefined) {
        addIssue(issues, 'UNKNOWN_CONCENTRATION_UNIT', path + '.unit', 'Đơn vị ' + concentration.unit + ' không phải đơn vị mol/L hợp lệ.');
        return null;
      }
      return { basis: concentration.basis, canonicalValue: value * factor, canonicalUnit: 'mol/L' };
    }
    case 'volume_per_volume': {
      const factor = VOLUME_VOLUME_TO_RATIO[unit];
      if (factor === undefined) {
        addIssue(issues, 'UNKNOWN_CONCENTRATION_UNIT', path + '.unit', 'Đơn vị ' + concentration.unit + ' không thuộc cơ sở thể tích/thể tích.');
        return null;
      }
      return { basis: concentration.basis, canonicalValue: value * factor, canonicalUnit: 'L/L' };
    }
    case 'mass_fraction': {
      const factor = MASS_FRACTION_TO_RATIO[unit];
      if (factor === undefined) {
        addIssue(issues, 'UNKNOWN_CONCENTRATION_UNIT', path + '.unit', 'Đơn vị ' + concentration.unit + ' không thuộc cơ sở phần khối lượng.');
        return null;
      }
      return { basis: concentration.basis, canonicalValue: value * factor, canonicalUnit: 'g/g' };
    }
  }
}

export function concentrationToGPerL(
  concentration: ConcentrationDraft,
  path: string,
  label: string,
  issues: CalculationIssue[],
  allowZero = false
): number | null {
  const normalized = normalizeConcentration(concentration, path, label, issues, allowZero);
  if (normalized === null) return null;
  switch (normalized.basis) {
    case 'mass_per_volume':
      return normalized.canonicalValue;
    case 'molar': {
      const molecularWeight = requiredNumber(
        concentration.molecularWeight,
        path + '.molecularWeight',
        'phân tử lượng để đổi nồng độ molar',
        issues
      );
      return molecularWeight === null ? null : normalized.canonicalValue * molecularWeight;
    }
    case 'mass_per_mass': {
      const density = requiredNumber(
        concentration.densityGPerMl,
        path + '.densityGPerMl',
        'khối lượng riêng để đổi mass/mass sang mass/volume',
        issues
      );
      return density === null ? null : normalized.canonicalValue * density;
    }
    case 'mass_fraction': {
      const density = requiredNumber(
        concentration.densityGPerMl,
        path + '.densityGPerMl',
        'khối lượng riêng để đổi % w/w sang mass/volume',
        issues
      );
      return density === null ? null : normalized.canonicalValue * density * 1000;
    }
    case 'volume_per_volume': {
      const density = requiredNumber(
        concentration.densityGPerMl,
        path + '.densityGPerMl',
        'khối lượng riêng để đổi % v/v sang mass/volume',
        issues
      );
      return density === null ? null : normalized.canonicalValue * density * 1000;
    }
  }
}

function snapshot(gPerL: number, molecularWeight: number | null | undefined): ConcentrationSnapshot {
  const alternatives: ConcentrationAlternative[] = [
    { value: gPerL, unit: 'g/L', basis: 'mass_per_volume' },
    { value: gPerL, unit: 'mg/mL', basis: 'mass_per_volume' },
    { value: gPerL * 1000, unit: 'mg/L', basis: 'mass_per_volume' },
    { value: gPerL * 1000, unit: 'ppm (mg/L)', basis: 'mass_per_volume' },
    { value: gPerL * 1000000, unit: 'ppb (µg/L)', basis: 'mass_per_volume' },
    { value: gPerL * 1000000000, unit: 'ppt (ng/L)', basis: 'mass_per_volume' },
    { value: gPerL / 10, unit: '% w/v', basis: 'mass_per_volume' }
  ];
  const molarM = molecularWeight && molecularWeight > 0 ? gPerL / molecularWeight : null;
  if (molarM !== null) {
    alternatives.push(
      { value: molarM, unit: 'M', basis: 'molar' },
      { value: molarM * 1000, unit: 'mM', basis: 'molar' },
      { value: molarM * 1000000, unit: 'µM', basis: 'molar' }
    );
  }
  return { massPerVolumeGPerL: gPerL, molarM, alternatives };
}

function quantityResult(value: number, dimension: 'mass' | 'volume'): QuantityResult {
  if (dimension === 'mass') {
    if (Math.abs(value) < 1) return { canonicalValue: value, canonicalUnit: 'g', displayValue: value * 1000, displayUnit: 'mg' };
    return { canonicalValue: value, canonicalUnit: 'g', displayValue: value, displayUnit: 'g' };
  }
  if (Math.abs(value) < 1) return { canonicalValue: value, canonicalUnit: 'mL', displayValue: value * 1000, displayUnit: 'µL' };
  return { canonicalValue: value, canonicalUnit: 'mL', displayValue: value, displayUnit: 'mL' };
}

export function suggestPipette(volumeMl: number, path: string, issues: CalculationIssue[]): PipetteSuggestion | null {
  const volumeUl = volumeMl * 1000;
  if (volumeUl === 0) return null;
  if (volumeUl < 2) {
    addIssue(issues, 'PIPET_UNDER_RANGE', path, 'Thể tích cần hút nhỏ hơn dải làm việc nhỏ nhất 2 µL.', 'warning', 'Đề xuất pha dung dịch trung gian hoặc đổi quy mô pha.');
    return null;
  }
  if (volumeUl > 10000) {
    addIssue(issues, 'PIPET_OVER_RANGE', path, 'Thể tích cần hút lớn hơn dải đã khai báo 10.000 µL.', 'warning', 'Đề xuất đổi quy mô pha, dùng bình định mức phù hợp hoặc để KNV chọn phương án khác.');
    return null;
  }
  const range = PIPETTE_RANGES.find(item => volumeUl >= item.minUl && volumeUl <= item.maxUl);
  if (!range) return null;
  return { ...range, volumeUl };
}

export function suggestVolumetricFlask(volumeMl: number, path: string, issues: CalculationIssue[]): VolumetricFlaskSuggestion | null {
  const exact = VOLUMETRIC_FLASKS_ML.find(item => Math.abs(item - volumeMl) < 1e-9);
  if (exact !== undefined) return { volumeMl: exact, exact: true };
  addIssue(
    issues,
    'FLASK_NOT_AVAILABLE',
    path,
    'Không có bình định mức đúng dung tích ' + volumeMl + ' mL trong danh mục đã khai báo.',
    'warning',
    'Đề xuất đổi quy mô sang bình 2, 5, 10, 20, 50, 100 hoặc 1.000 mL và giữ nguyên nồng độ đích.'
  );
  return { volumeMl, exact: false };
}

function balanceDisplayMg(massG: number, path: string, issues: CalculationIssue[]): number {
  const display = Math.round(massG * 100) / 100;
  if (display === 0) {
    addIssue(issues, 'MASS_BELOW_READABILITY', path, 'Khối lượng sau biểu diễn theo độ đọc 0,01 mg trở thành 0,00 mg.', 'warning', 'Không cân trực tiếp theo độ đọc hiện có; đề xuất pha dung dịch trung gian.');
  }
  return display;
}

function checkPurityAndFactor(
  sourceType: PrepSourceType,
  potency: number | null | undefined,
  conversionFactor: number | null | undefined,
  path: string,
  issues: CalculationIssue[]
): { potency: number; conversionFactor: number } {
  const effectivePotency = sourceType === 'solid' ? (potency ?? 100) : 100;
  const effectiveFactor = conversionFactor ?? 1;
  if (effectivePotency <= 0 || effectivePotency > 100) addIssue(issues, 'POTENCY_OUT_OF_RANGE', path + '.potencyPercent', 'Potency/độ tinh khiết phải lớn hơn 0 và không vượt quá 100%.');
  if (effectiveFactor <= 0 || !Number.isFinite(effectiveFactor)) addIssue(issues, 'CONVERSION_FACTOR_INVALID', path + '.conversionFactor', 'Hệ số quy đổi phải là số dương hữu hạn.');
  return { potency: effectivePotency, conversionFactor: effectiveFactor };
}

function calculated<T extends PrepOutput>(
  output: T | null,
  issues: CalculationIssue[],
  normalizedInputs: Record<string, number | string>,
  trace: CalculationTraceStep[]
): PrepCalculationResult<T> {
  const hasError = issues.some(item => item.severity === 'error');
  const incomplete = issues.some(item => item.code.startsWith('MISSING_'));
  return {
    status: hasError ? (incomplete ? 'incomplete' : 'invalid') : 'valid',
    output: hasError ? null : output,
    issues,
    normalizedInputs,
    trace
  };
}

function concentrationForOutput(concentration: ConcentrationDraft, path: string, label: string, issues: CalculationIssue[], allowZero = false): { gPerL: number; snapshot: ConcentrationSnapshot } | null {
  const gPerL = concentrationToGPerL(concentration, path, label, issues, allowZero);
  if (gPerL === null) return null;
  return { gPerL, snapshot: snapshot(gPerL, concentration.molecularWeight) };
}

function calculateConcentration(draft: ConcentrationTaskDraft): PrepCalculationResult<PrepOutput> {
  const issues: CalculationIssue[] = [];
  const trace: CalculationTraceStep[] = [];
  const name = requireName(draft.substance.name, 'substance.name', 'tên chất/dung dịch', issues);
  const finalVolumeMl = requiredQuantity(draft.finalVolume, 'finalVolume', 'thể tích định mức', 'volume', VOLUME_TO_ML, issues);
  const expectedDimension = draft.sourceType === 'solid' ? 'mass' : 'volume';
  const planned = requiredQuantity(draft.plannedQuantity, 'plannedQuantity', 'lượng kế hoạch', expectedDimension, expectedDimension === 'mass' ? MASS_TO_G : VOLUME_TO_ML, issues);
  const actualProvided = optionalQuantity(draft.actualQuantity, 'actualQuantity', 'lượng thực tế', expectedDimension, expectedDimension === 'mass' ? MASS_TO_G : VOLUME_TO_ML, issues);
  const { potency, conversionFactor } = checkPurityAndFactor(draft.sourceType, draft.substance.potencyPercent, draft.substance.conversionFactor, 'substance', issues);
  const molecularWeight = optionalNumber(draft.substance.molecularWeight, 'substance.molecularWeight', 'phân tử lượng', issues);
  const actual = actualProvided ?? planned;

  if (finalVolumeMl === null || planned === null || actual === null || name === '') return calculated(null, issues, {}, trace);
  const flask = suggestVolumetricFlask(finalVolumeMl, 'finalVolume', issues);
  let plannedGPerL: number;
  let actualGPerL: number;
  let activeMassG: number | null = null;
  let actualActiveMassG: number | null = null;
  let pipette: PipetteSuggestion | null = null;

  if (draft.sourceType === 'solid') {
    activeMassG = planned * potency / 100 * conversionFactor;
    actualActiveMassG = actual * potency / 100 * conversionFactor;
    plannedGPerL = activeMassG / (finalVolumeMl / 1000);
    actualGPerL = actualActiveMassG / (finalVolumeMl / 1000);
    balanceDisplayMg(actualActiveMassG, 'actualQuantity', issues);
    trace.push(
      { label: 'Khối lượng hoạt chất kế hoạch', expression: 'm_planned × potency / 100 × conversion_factor', substitution: planned + ' g × ' + potency + ' / 100 × ' + conversionFactor, value: activeMassG, unit: 'g' },
      { label: 'Khối lượng hoạt chất thực tế', expression: 'm_actual × potency / 100 × conversion_factor', substitution: actual + ' g × ' + potency + ' / 100 × ' + conversionFactor, value: actualActiveMassG, unit: 'g' },
      { label: 'Nồng độ thực tế', expression: 'm_active_actual / V_final_L', substitution: actualActiveMassG + ' g / ' + finalVolumeMl / 1000 + ' L', value: actualGPerL, unit: 'g/L' }
    );
  } else {
    const source = draft.sourceConcentration ? concentrationForOutput(draft.sourceConcentration, 'sourceConcentration', 'nồng độ nguồn', issues) : null;
    if (!source) return calculated(null, issues, {}, trace);
    plannedGPerL = source.gPerL * planned / finalVolumeMl;
    actualGPerL = source.gPerL * actual / finalVolumeMl;
    pipette = suggestPipette(actual, 'actualQuantity', issues);
    trace.push(
      { label: 'Nồng độ kế hoạch', expression: 'C_source × V_planned / V_final', substitution: source.gPerL + ' g/L × ' + planned + ' mL / ' + finalVolumeMl + ' mL', value: plannedGPerL, unit: 'g/L' },
      { label: 'Nồng độ thực tế', expression: 'C_source × V_actual / V_final', substitution: source.gPerL + ' g/L × ' + actual + ' mL / ' + finalVolumeMl + ' mL', value: actualGPerL, unit: 'g/L' }
    );
  }

  const target = draft.targetConcentration ? concentrationForOutput(draft.targetConcentration, 'targetConcentration', 'nồng độ mục tiêu', issues, true) : null;
  if (draft.targetConcentration && !target) return calculated(null, issues, {}, trace);
  const actualSnapshot = snapshot(actualGPerL, molecularWeight);
  const plannedSnapshot = snapshot(plannedGPerL, molecularWeight);
  const deviationGPerL = target ? actualGPerL - target.gPerL : null;
  const quantityUnit = draft.sourceType === 'solid' ? 'g' : 'mL';
  const operation = draft.sourceType === 'solid'
    ? 'Cân ' + quantityResult(actual, 'mass').displayValue + ' ' + quantityResult(actual, 'mass').displayUnit + ' ' + name + '; hòa tan và định mức đến ' + finalVolumeMl + ' mL.'
    : 'Hút ' + quantityResult(actual, 'volume').displayValue + ' ' + quantityResult(actual, 'volume').displayUnit + ' ' + name + ' vào bình; thêm dung môi và định mức đến ' + finalVolumeMl + ' mL.';
  return calculated({
    kind: 'concentration',
    sourceType: draft.sourceType,
    name,
    finalVolumeMl,
    activeMassG: actualActiveMassG ?? activeMassG,
    plannedQuantity: quantityResult(planned, draft.sourceType === 'solid' ? 'mass' : 'volume'),
    actualQuantity: quantityResult(actual, draft.sourceType === 'solid' ? 'mass' : 'volume'),
    plannedConcentration: plannedSnapshot,
    actualConcentration: actualSnapshot,
    targetConcentration: target?.snapshot ?? null,
    deviationGPerL,
    operation,
    pipette,
    flask,
    balanceDisplayMg: draft.sourceType === 'solid' ? balanceDisplayMg(actual, 'actualQuantity', issues) : null
  } as ConcentrationOutput, issues, {
    finalVolumeMl,
    plannedQuantity: planned,
    actualQuantity: actual,
    plannedGPerL,
    actualGPerL,
    ...(target ? { targetGPerL: target.gPerL } : {}),
    quantityUnit
  }, trace);
}

function calculateTarget(draft: TargetTaskDraft): PrepCalculationResult<PrepOutput> {
  const issues: CalculationIssue[] = [];
  const trace: CalculationTraceStep[] = [];
  const name = requireName(draft.substance.name, 'substance.name', 'tên chất/dung dịch', issues);
  const finalVolumeMl = requiredQuantity(draft.finalVolume, 'finalVolume', 'thể tích định mức', 'volume', VOLUME_TO_ML, issues);
  const target = concentrationForOutput(draft.targetConcentration, 'targetConcentration', 'nồng độ đích', issues, true);
  const { potency, conversionFactor } = checkPurityAndFactor(draft.sourceType, draft.substance.potencyPercent, draft.substance.conversionFactor, 'substance', issues);
  const molecularWeight = optionalNumber(draft.substance.molecularWeight, 'substance.molecularWeight', 'phân tử lượng', issues);
  const actualProvided = optionalQuantity(draft.actualQuantity, 'actualQuantity', 'lượng thực tế', draft.sourceType === 'solid' ? 'mass' : 'volume', draft.sourceType === 'solid' ? MASS_TO_G : VOLUME_TO_ML, issues);
  if (finalVolumeMl === null || target === null || name === '') return calculated(null, issues, {}, trace);
  const flask = suggestVolumetricFlask(finalVolumeMl, 'finalVolume', issues);
  let plannedQuantity: number;
  let plannedGPerL = target.gPerL;
  let actualQuantity: QuantityResult | null = null;
  let actualConcentration: ConcentrationSnapshot | null = null;
  let pipette: PipetteSuggestion | null = null;
  let balanceDisplay: number | null = null;

  if (draft.sourceType === 'solid') {
    const activeMassG = target.gPerL * (finalVolumeMl / 1000);
    plannedQuantity = activeMassG / (potency / 100 * conversionFactor);
    balanceDisplay = balanceDisplayMg(plannedQuantity, 'plannedQuantity', issues);
    if (actualProvided !== null) {
      actualQuantity = quantityResult(actualProvided, 'mass');
      const actualActiveMassG = actualProvided * potency / 100 * conversionFactor;
      const actualGPerL = actualActiveMassG / (finalVolumeMl / 1000);
      actualConcentration = snapshot(actualGPerL, molecularWeight);
      trace.push({ label: 'Nồng độ thực tế', expression: 'm_actual × potency / 100 × conversion_factor / V_final_L', substitution: actualProvided + ' g × ' + potency + ' / 100 × ' + conversionFactor + ' / ' + finalVolumeMl / 1000 + ' L', value: actualGPerL, unit: 'g/L' });
    }
    trace.push({ label: 'Khối lượng cần cân', expression: '(C_target × V_final_L) / (potency / 100 × conversion_factor)', substitution: '(' + target.gPerL + ' g/L × ' + finalVolumeMl / 1000 + ' L) / (' + potency + ' / 100 × ' + conversionFactor + ')', value: plannedQuantity, unit: 'g' });
  } else {
    const sourceDraft = draft.sourceConcentration;
    const source = sourceDraft ? concentrationForOutput(sourceDraft, 'sourceConcentration', 'nồng độ nguồn', issues) : null;
    if (!source) return calculated(null, issues, {}, trace);
    if (target.gPerL > source.gPerL) addIssue(issues, 'TARGET_EXCEEDS_SOURCE', 'targetConcentration', 'Nồng độ đích lớn hơn nồng độ nguồn trong phép pha loãng.');
    plannedQuantity = target.gPerL * finalVolumeMl / source.gPerL;
    pipette = suggestPipette(plannedQuantity, 'plannedQuantity', issues);
    if (actualProvided !== null) {
      actualQuantity = quantityResult(actualProvided, 'volume');
      const actualGPerL = source.gPerL * actualProvided / finalVolumeMl;
      actualConcentration = snapshot(actualGPerL, molecularWeight);
      trace.push({ label: 'Nồng độ thực tế', expression: 'C_source × V_actual / V_final', substitution: source.gPerL + ' g/L × ' + actualProvided + ' mL / ' + finalVolumeMl + ' mL', value: actualGPerL, unit: 'g/L' });
    }
    trace.push({ label: 'Thể tích nguồn cần hút', expression: 'C_target × V_final / C_source', substitution: target.gPerL + ' g/L × ' + finalVolumeMl + ' mL / ' + source.gPerL + ' g/L', value: plannedQuantity, unit: 'mL' });
  }

  if (issues.some(item => item.severity === 'error')) return calculated(null, issues, {}, trace);
  const plannedQuantityResult = quantityResult(plannedQuantity, draft.sourceType === 'solid' ? 'mass' : 'volume');
  const operation = draft.sourceType === 'solid'
    ? 'Cân ' + plannedQuantityResult.displayValue + ' ' + plannedQuantityResult.displayUnit + ' ' + name + '; hòa tan và định mức đến ' + finalVolumeMl + ' mL.'
    : 'Hút ' + plannedQuantityResult.displayValue + ' ' + plannedQuantityResult.displayUnit + ' ' + name + ' vào bình; thêm dung môi và định mức đến ' + finalVolumeMl + ' mL.';
  return calculated({
    kind: 'target',
    sourceType: draft.sourceType,
    name,
    finalVolumeMl,
    plannedQuantity: plannedQuantityResult,
    actualQuantity,
    plannedConcentration: target.snapshot,
    actualConcentration,
    operation,
    pipette,
    flask,
    balanceDisplayMg: balanceDisplay
  } as TargetOutput, issues, { finalVolumeMl, plannedQuantity, targetGPerL: plannedGPerL }, trace);
}

function calculateSpike(draft: SpikeTaskDraft): PrepCalculationResult<PrepOutput> {
  const issues: CalculationIssue[] = [];
  const trace: CalculationTraceStep[] = [];
  const standardName = requireName(draft.standardName, 'standardName', 'tên dung dịch chuẩn', issues);
  const sampleName = requireName(draft.sampleName, 'sampleName', 'tên mẫu', issues);
  const expectedDimension = draft.matrix === 'solid' ? 'mass' : 'volume';
  const sampleCanonical = requiredQuantity(draft.sampleQuantity, 'sampleQuantity', 'lượng mẫu', expectedDimension, expectedDimension === 'mass' ? MASS_TO_G : VOLUME_TO_ML, issues);
  const standard = concentrationForOutput(draft.standard, 'standard', 'nồng độ dung dịch chuẩn', issues);
  if (!standard) return calculated(null, issues, {}, trace);
  const pipette: PipetteSuggestion | null = null;
  if (sampleCanonical === null || standardName === '' || sampleName === '') return calculated(null, issues, {}, trace);
  let spikeVolumeMl: number;
  let addedMassG: number;
  let targetSnapshot: ConcentrationSnapshot | null = null;
  let initialSnapshot: ConcentrationSnapshot | null = null;

  if (draft.matrix === 'solid') {
    const target = normalizeConcentration(draft.target, 'target', 'mức spike', issues);
    if (!target || target.basis !== 'mass_per_mass') {
      addIssue(issues, 'INCOMPATIBLE_BASIS', 'target', 'Mẫu rắn phải dùng cơ sở khối lượng/khối lượng, ví dụ mg/kg hoặc µg/kg.');
      return calculated(null, issues, {}, trace);
    }
    const initial = draft.initialConcentration ? normalizeConcentration(draft.initialConcentration, 'initialConcentration', 'nồng độ nền', issues) : null;
    if (draft.initialConcentration && !initial) return calculated(null, issues, {}, trace);
    if (initial && initial.basis !== 'mass_per_mass') addIssue(issues, 'INCOMPATIBLE_BASIS', 'initialConcentration', 'Nồng độ nền của mẫu rắn phải là mass/mass.');
    const addedGPerKg = draft.semantic === 'final_total' ? target.canonicalValue - (initial?.canonicalValue ?? 0) : target.canonicalValue;
    if (addedGPerKg < 0) addIssue(issues, 'BACKGROUND_EXCEEDS_TARGET', 'target', 'Nồng độ nền lớn hơn nồng độ tổng đích; không thể tính lượng thêm.');
    addedMassG = addedGPerKg * (sampleCanonical / 1000);
    spikeVolumeMl = addedMassG / standard.gPerL * 1000;
    trace.push({ label: 'Khối lượng chất thêm', expression: 'C_added(g/kg) × m_sample(kg)', substitution: addedGPerKg + ' g/kg × ' + sampleCanonical / 1000 + ' kg', value: addedMassG, unit: 'g' });
  } else {
    const target = concentrationForOutput(draft.target, 'target', 'mức spike', issues);
    if (!target) return calculated(null, issues, {}, trace);
    const initial = draft.initialConcentration ? concentrationForOutput(draft.initialConcentration, 'initialConcentration', 'nồng độ nền', issues) : null;
    if (draft.initialConcentration && !initial) return calculated(null, issues, {}, trace);
    targetSnapshot = target.snapshot;
    initialSnapshot = initial?.snapshot ?? null;
    const sampleVolumeMl = sampleCanonical;
    if (draft.semantic === 'added_on_initial') {
      spikeVolumeMl = target.gPerL * sampleVolumeMl / standard.gPerL;
      addedMassG = target.gPerL * sampleVolumeMl / 1000;
      trace.push({ label: 'Thể tích spike trên mẫu ban đầu', expression: 'C_added × V_sample / C_standard', substitution: target.gPerL + ' g/L × ' + sampleVolumeMl + ' mL / ' + standard.gPerL + ' g/L', value: spikeVolumeMl, unit: 'mL' });
    } else {
      const initialGPerL = initial?.gPerL ?? 0;
      if (target.gPerL <= initialGPerL) addIssue(issues, 'TARGET_NOT_ABOVE_BACKGROUND', 'target', 'Nồng độ tổng đích phải lớn hơn nồng độ nền để tính thể tích spike dương.');
      if (standard.gPerL <= target.gPerL) addIssue(issues, 'STANDARD_NOT_ABOVE_TARGET', 'standard', 'Nồng độ dung dịch chuẩn phải lớn hơn nồng độ tổng đích.');
      spikeVolumeMl = (target.gPerL - initialGPerL) * sampleVolumeMl / (standard.gPerL - target.gPerL);
      addedMassG = standard.gPerL * spikeVolumeMl / 1000;
      trace.push({ label: 'Thể tích spike trên thể tích cuối', expression: '(C_final - C_initial) × V_sample / (C_standard - C_final)', substitution: '(' + target.gPerL + ' - ' + initialGPerL + ') g/L × ' + sampleVolumeMl + ' mL / (' + standard.gPerL + ' - ' + target.gPerL + ') g/L', value: spikeVolumeMl, unit: 'mL' });
    }
  }

  if (!Number.isFinite(spikeVolumeMl) || spikeVolumeMl < 0) addIssue(issues, 'INVALID_RESULT', 'spikeVolume', 'Thể tích spike không thể tính thành số không âm hữu hạn.');
  const sampleVolumeMl = draft.matrix === 'solid' ? null : sampleCanonical;
  if (sampleVolumeMl !== null && sampleVolumeMl > 0 && spikeVolumeMl / sampleVolumeMl >= 0.1) {
    addIssue(issues, 'SPIKE_SIGNIFICANT_VOLUME', 'spikeVolume', 'Thể tích spike chiếm tỷ lệ đáng kể so với mẫu và có thể làm thay đổi nền hoặc thể tích.', 'warning', 'KNV cần xem lại semantic spike và thể tích cuối của phép thử.');
  }
  if (issues.some(item => item.severity === 'error')) return calculated(null, issues, {}, trace);
  const pipetteSuggestion = suggestPipette(spikeVolumeMl, 'spikeVolume', issues);
  const sampleResult = quantityResult(sampleCanonical, expectedDimension === 'mass' ? 'mass' : 'volume');
  const locationLabel: Record<SpikeTaskDraft['location'], string> = {
    sample_initial: 'mẫu ban đầu trước xử lý',
    extract: 'dịch chiết',
    after_cleanup: 'sau làm sạch',
    final_vial: 'vial/dung dịch cuối'
  };
  const operation = 'Hút ' + quantityResult(spikeVolumeMl, 'volume').displayValue + ' ' + quantityResult(spikeVolumeMl, 'volume').displayUnit + ' dung dịch chuẩn ' + standardName + '; thêm vào ' + sampleResult.displayValue + ' ' + sampleResult.displayUnit + ' ' + sampleName + ' tại công đoạn ' + locationLabel[draft.location] + '.';
  return calculated({
    kind: 'spike',
    matrix: draft.matrix,
    location: draft.location,
    semantic: draft.semantic,
    standardName,
    sampleName,
    sampleQuantity: sampleResult,
    spikeVolumeMl,
    addedMassG,
    standardConcentrationGPerL: standard.gPerL,
    targetConcentration: targetSnapshot,
    initialConcentration: initialSnapshot,
    operation,
    pipette: pipetteSuggestion
  }, issues, { sampleCanonical, spikeVolumeMl, addedMassG, standardGPerL: standard.gPerL }, trace);
}

function concentrationForSeries(
  source: SeriesSourceDraft,
  path: string,
  issues: CalculationIssue[]
): number | null {
  return concentrationToGPerL(source.concentration, path, source.name || 'nồng độ nguồn', issues);
}

function calculateSeries(draft: SeriesTaskDraft): PrepCalculationResult<PrepOutput> {
  const issues: CalculationIssue[] = [];
  const trace: CalculationTraceStep[] = [];
  if (!draft.sources.length) addIssue(issues, 'MISSING_SOURCES', 'sources', 'Thêm ít nhất một dung dịch nguồn thủ công.');
  if (draft.strategy !== 'multi_component' && !draft.points.length) addIssue(issues, 'MISSING_POINTS', 'points', 'Thêm ít nhất một điểm chuẩn, blank, QC hoặc mẫu.');
  if (draft.strategy === 'multi_component' && !draft.components.length) addIssue(issues, 'MISSING_COMPONENTS', 'components', 'Thêm ít nhất một thành phần hỗn hợp.');
  const residualPercent = optionalNumber(draft.residualPercent, 'residualPercent', 'phần dư', issues, true) ?? 0;
  if (residualPercent > 100) addIssue(issues, 'RESIDUAL_OUT_OF_RANGE', 'residualPercent', 'Phần dư không nên vượt quá 100%.');
  const sourceById = new Map<string, SeriesSourceDraft>();
  for (const [index, source] of draft.sources.entries()) {
    if (sourceById.has(source.id)) addIssue(issues, 'DUPLICATE_ID', 'sources[' + index + '].id', 'Mã nguồn bị trùng.');
    sourceById.set(source.id, source);
    requireName(source.name, 'sources[' + index + '].name', 'tên dung dịch nguồn ' + (index + 1), issues);
  }
  const sourceConcentrationById = new Map<string, number>();
  const sourceRows: SeriesSourceDraft[] = [];
  const sourceRowById = new Map<string, SeriesSourceDraft>();
  const resolving = new Set<string>();
  const resolveSource = (id: string): number | null => {
    const cached = sourceConcentrationById.get(id);
    if (cached !== undefined) return cached;
    const source = sourceById.get(id);
    if (!source) {
      addIssue(issues, 'UNKNOWN_SOURCE', 'sources', 'Không tìm thấy nguồn ' + id + '.');
      return null;
    }
    if (resolving.has(id)) {
      addIssue(issues, 'SOURCE_CYCLE', 'sources[' + id + ']', 'Cây dung dịch nguồn có vòng lặp.');
      return null;
    }
    resolving.add(id);
    let result: number | null;
    if (!source.sourceId) {
      result = concentrationForSeries(source, 'sources[' + id + '].concentration', issues);
    } else {
      const parent = resolveSource(source.sourceId);
      const target = concentrationForSeries(source, 'sources[' + id + '].concentration', issues);
      if (parent !== null && target !== null && target > parent) addIssue(issues, 'TARGET_EXCEEDS_SOURCE', 'sources[' + id + '].concentration', 'Nồng độ trung gian không được lớn hơn nguồn trực tiếp.');
      result = target;
    }
    resolving.delete(id);
    if (result !== null) sourceConcentrationById.set(id, result);
    return result;
  };
  for (const source of draft.sources) {
    const concentrationGPerL = resolveSource(source.id);
    const preparedVolumeMl = requiredQuantity(source.preparedVolume, 'sources[' + source.id + '].preparedVolume', 'thể tích pha của ' + source.name, 'volume', VOLUME_TO_ML, issues);
    const actualSourceVolumeMl = optionalQuantity(source.actualSourceQuantity, 'sources[' + source.id + '].actualSourceQuantity', 'thể tích nguồn thực tế', 'volume', VOLUME_TO_ML, issues);
    if (concentrationGPerL === null || preparedVolumeMl === null) continue;
    sourceRows.push(source);
    sourceRowById.set(source.id, source);
    const parentConcentration = source.sourceId ? sourceConcentrationById.get(source.sourceId) ?? null : null;
    const sourceVolumeMl = source.sourceId && parentConcentration !== null ? concentrationGPerL * preparedVolumeMl / parentConcentration : null;
    const actualConcentrationGPerL = source.sourceId && parentConcentration !== null && actualSourceVolumeMl !== null
      ? parentConcentration * actualSourceVolumeMl / preparedVolumeMl
      : null;
    if (sourceVolumeMl !== null) {
      suggestPipette(sourceVolumeMl, 'sources[' + source.id + '].sourceVolume', issues);
      trace.push({ label: 'Nguồn trực tiếp của ' + source.name, expression: 'C_target × V_prepared / C_source', substitution: concentrationGPerL + ' g/L × ' + preparedVolumeMl + ' mL / ' + parentConcentration + ' g/L', value: sourceVolumeMl, unit: 'mL' });
    }
    trace.push({ label: 'Chuẩn bị ' + source.name, expression: 'định mức đến V_prepared', substitution: preparedVolumeMl + ' mL', value: preparedVolumeMl, unit: 'mL' });
  }

  const pointRows: SeriesPointOutput[] = [];
  const pointDraftById = new Map<string, SeriesPointDraft>();
  const pointOutputById = new Map<string, SeriesPointOutput>();
  const pointConcentrationById = new Map<string, number>();
  const resolveReference = (id: string): number | null => sourceConcentrationById.get(id) ?? pointConcentrationById.get(id) ?? null;
  const addDemand = (referenceId: string, volumeMl: number, demand: Map<string, number>): void => {
    if (sourceById.has(referenceId)) {
      demand.set(referenceId, (demand.get(referenceId) ?? 0) + volumeMl);
      return;
    }
    const point = pointOutputById.get(referenceId);
    if (point) {
      const ratio = point.finalVolumeMl > 0 ? point.sourceVolumeMl / point.finalVolumeMl : 0;
      addDemand(point.sourceId, volumeMl * ratio, demand);
      return;
    }
    addIssue(issues, 'UNKNOWN_SOURCE', 'points', 'Không thể truy nguồn ' + referenceId + ' để tính tổng nhu cầu.');
  };
  const demand = new Map<string, number>();
  for (const source of sourceRows) {
    if (source.sourceId) {
      const prepared = requiredQuantity(source.preparedVolume, 'sources[' + source.id + '].preparedVolume', 'thể tích pha', 'volume', VOLUME_TO_ML, issues);
      const target = sourceConcentrationById.get(source.id);
      const parent = sourceConcentrationById.get(source.sourceId);
      if (prepared !== null && target !== undefined && parent !== undefined) addDemand(source.sourceId, target * prepared / parent, demand);
    }
  }
  for (const [index, point] of draft.points.entries()) {
    if (pointDraftById.has(point.id)) addIssue(issues, 'DUPLICATE_ID', 'points[' + index + '].id', 'Mã điểm bị trùng.');
    pointDraftById.set(point.id, point);
    const target = concentrationForOutput(point.targetConcentration, 'points[' + index + '].targetConcentration', 'nồng độ điểm ' + (index + 1), issues, true);
    const finalVolumeMl = requiredQuantity(point.finalVolume, 'points[' + index + '].finalVolume', 'thể tích điểm ' + (index + 1), 'volume', VOLUME_TO_ML, issues);
    const sourceGPerL = resolveReference(point.sourceId);
    if (draft.strategy === 'serial_dilution' && !pointConcentrationById.has(point.sourceId)) {
      if (!sourceById.has(point.sourceId)) addIssue(issues, 'SERIAL_SOURCE_NOT_PREVIOUS', 'points[' + index + '].sourceId', 'Pha loãng nối tiếp phải lấy nguồn từ một điểm trước đó.');
    }
    if (!target || finalVolumeMl === null || sourceGPerL === null) continue;
    if (target.gPerL > sourceGPerL) addIssue(issues, 'TARGET_EXCEEDS_SOURCE', 'points[' + index + '].targetConcentration', 'Nồng độ điểm không được lớn hơn nguồn trực tiếp.');
    const sourceVolumeMl = target.gPerL * finalVolumeMl / sourceGPerL;
    const actualSourceVolumeMl = optionalQuantity(point.actualSourceQuantity, 'points[' + index + '].actualSourceQuantity', 'thể tích nguồn thực tế', 'volume', VOLUME_TO_ML, issues);
    const actualConcentrationGPerL = actualSourceVolumeMl === null ? null : sourceGPerL * actualSourceVolumeMl / finalVolumeMl;
    const row: SeriesPointOutput = {
      id: point.id,
      label: point.label.trim() || 'Điểm ' + (index + 1),
      objectType: point.objectType,
      targetConcentrationGPerL: target.gPerL,
      finalVolumeMl,
      sourceId: point.sourceId,
      sourceConcentrationGPerL: sourceGPerL,
      sourceVolumeMl,
      actualSourceVolumeMl,
      actualConcentrationGPerL,
      solventVolumeMl: finalVolumeMl - sourceVolumeMl,
      additionsVolumeMl: 0,
      operation: 'Hút ' + quantityResult(sourceVolumeMl, 'volume').displayValue + ' ' + quantityResult(sourceVolumeMl, 'volume').displayUnit + ' từ nguồn ' + point.sourceId + '; định mức đến ' + finalVolumeMl + ' mL.',
      pipette: suggestPipette(sourceVolumeMl, 'points[' + index + '].sourceVolume', issues),
      flask: suggestVolumetricFlask(finalVolumeMl, 'points[' + index + '].finalVolume', issues)
    };
    if (row.solventVolumeMl < 0) addIssue(issues, 'NEGATIVE_SOLVENT', 'points[' + index + ']', 'Thể tích dung môi không thể âm.');
    pointRows.push(row);
    pointOutputById.set(point.id, row);
    pointConcentrationById.set(point.id, target.gPerL);
    addDemand(point.sourceId, sourceVolumeMl, demand);
    trace.push({ label: 'Điểm ' + row.label, expression: 'C_target × V_final / C_source', substitution: target.gPerL + ' g/L × ' + finalVolumeMl + ' mL / ' + sourceGPerL + ' g/L', value: sourceVolumeMl, unit: 'mL' });
  }

  const componentRows: SeriesComponentOutput[] = [];
  if (draft.strategy === 'multi_component') {
    const finalVolumeMl = requiredQuantity(draft.finalVolume, 'finalVolume', 'thể tích cuối của hỗn hợp', 'volume', VOLUME_TO_ML, issues);
    if (finalVolumeMl !== null) {
      let componentTotal = 0;
      for (const [index, component] of draft.components.entries()) {
        const target = concentrationForOutput(component.targetConcentration, 'components[' + index + '].targetConcentration', 'nồng độ thành phần ' + (index + 1), issues, true);
        const sourceGPerL = resolveReference(component.sourceId);
        if (!target || sourceGPerL === null) continue;
        const volumeMl = target.gPerL * finalVolumeMl / sourceGPerL;
        componentTotal += volumeMl;
        componentRows.push({ id: component.id, name: component.name.trim() || 'Thành phần ' + (index + 1), sourceId: component.sourceId, sourceConcentrationGPerL: sourceGPerL, targetConcentrationGPerL: target.gPerL, volumeMl, pipette: suggestPipette(volumeMl, 'components[' + index + '].volume', issues) });
        addDemand(component.sourceId, volumeMl, demand);
      }
      if (componentTotal > finalVolumeMl) addIssue(issues, 'COMPONENTS_EXCEED_FINAL_VOLUME', 'components', 'Tổng thể tích các thành phần lớn hơn thể tích định mức.');
      else if (componentTotal / finalVolumeMl >= 0.9) addIssue(issues, 'COMPONENTS_NEAR_FINAL_VOLUME', 'components', 'Tổng thể tích thành phần quá gần thể tích định mức.', 'warning', 'KNV cần kiểm tra phần dung môi và định mức đến vạch.');
      trace.push({ label: 'Tổng thành phần hỗn hợp', expression: 'sum(C_target_i × V_final / C_source_i)', value: componentTotal, unit: 'mL' });
    }
  }

  const additionRows: { id: string; name: string; type: AdditionDraft['type']; pointId: string; pointLabel: string; volumeMl: number; operation: string; pipette: PipetteSuggestion | null; includeInFinalVolume: boolean }[] = [];
  for (const [additionIndex, addition] of draft.additions.entries()) {
    requireName(addition.name, 'additions[' + additionIndex + '].name', 'tên nội chuẩn/surrogate', issues);
    const source = concentrationForOutput(addition.source, 'additions[' + additionIndex + '].source', 'nồng độ nguồn của ' + addition.name, issues);
    const fixedVolumeMl = optionalQuantity(addition.fixedVolume, 'additions[' + additionIndex + '].fixedVolume', 'thể tích cố định', 'volume', VOLUME_TO_ML, issues);
    const targetLevel = addition.targetLevel ? concentrationForOutput(addition.targetLevel, 'additions[' + additionIndex + '].targetLevel', 'nồng độ đích của ' + addition.name, issues, true) : null;
    if (!source || (fixedVolumeMl === null && !targetLevel)) {
      if (fixedVolumeMl === null && !targetLevel) addIssue(issues, 'MISSING_ADDITION_LEVEL', 'additions[' + additionIndex + ']', 'Nhập thể tích cố định hoặc nồng độ đích cho nội chuẩn/surrogate.');
      continue;
    }
    const scope = addition.applicationScope.length ? addition.applicationScope : ['standard', 'blank', 'qc', 'sample'];
    const exceptions = new Set(addition.exceptions ?? []);
    for (const point of pointRows) {
      if (!scope.includes(point.objectType) || exceptions.has(point.objectType)) continue;
      const volumeMl = fixedVolumeMl ?? ((targetLevel?.gPerL ?? 0) * point.finalVolumeMl / source.gPerL);
      point.additionsVolumeMl += volumeMl;
      additionRows.push({
        id: addition.id + '-' + point.id,
        name: addition.name.trim(),
        type: addition.type,
        pointId: point.id,
        pointLabel: point.label,
        volumeMl,
        operation: 'Thêm ' + quantityResult(volumeMl, 'volume').displayValue + ' ' + quantityResult(volumeMl, 'volume').displayUnit + ' ' + addition.name.trim() + ' vào ' + point.label + '.',
        pipette: suggestPipette(volumeMl, 'additions[' + additionIndex + '].' + point.id, issues),
        includeInFinalVolume: addition.includeInFinalVolume === true
      });
      if (addition.sourceId) addDemand(addition.sourceId, volumeMl, demand);
      if (addition.includeInFinalVolume) point.solventVolumeMl = point.finalVolumeMl - point.sourceVolumeMl - point.additionsVolumeMl;
    }
  }
  for (const point of pointRows) {
    if (point.solventVolumeMl < 0) addIssue(issues, 'COMPONENTS_EXCEED_FINAL_VOLUME', 'points.' + point.id, 'Nguồn và nội chuẩn/surrogate lớn hơn thể tích định mức.');
  }

  const sourceDemand = sourceRows.map(source => {
    const directRequiredVolumeMl = demand.get(source.id) ?? 0;
    const preparedVolumeMl = requiredQuantity(source.preparedVolume, 'sources[' + source.id + '].preparedVolume', 'thể tích pha', 'volume', VOLUME_TO_ML, issues);
    const requiredWithResidualMl = directRequiredVolumeMl * (1 + residualPercent / 100);
    if (preparedVolumeMl !== null && requiredWithResidualMl > preparedVolumeMl) addIssue(issues, 'SOURCE_VOLUME_INSUFFICIENT', 'sources[' + source.id + ']', 'Thể tích chuẩn bị của ' + source.name + ' không đủ sau khi cộng phần dư nhập tay.', 'warning', 'Tăng quy mô pha hoặc giảm phần dư sau khi KNV xem xét.');
    return { sourceId: source.id, name: source.name.trim(), directRequiredVolumeMl, requiredVolumeMl: directRequiredVolumeMl, residualPercent, requiredWithResidualMl, preparedVolumeMl };
  });
  if (draft.strategy === 'serial_dilution' && (draft.points.length > 5 || draft.points.some((point, index) => index > 0 && pointConcentrationById.has(point.sourceId) && (pointConcentrationById.get(point.sourceId) ?? 0) / Math.max(point.targetConcentration.value ?? 0, Number.MIN_VALUE) > 1000))) {
    addIssue(issues, 'SERIAL_DILUTION_RISK', 'points', 'Dãy pha loãng nối tiếp có nhiều bước hoặc hệ số pha loãng một bước quá lớn.', 'warning', 'Cân nhắc thêm dung dịch trung gian để giảm tích lũy sai số.');
  }
  const instructions = [
    ...sourceRows.map(source => 'Chuẩn bị ' + source.name.trim() + ' theo nguồn trực tiếp rồi định mức đến thể tích đã nhập.'),
    ...pointRows.map(point => point.operation),
    ...additionRows.map(addition => addition.operation)
  ];
  if (issues.some(item => item.severity === 'error')) return calculated(null, issues, {}, trace);
  return calculated({
    kind: 'series',
    strategy: draft.strategy,
    intermediateRows: sourceRows.map(source => {
      const concentrationGPerL = sourceConcentrationById.get(source.id) ?? 0;
      const preparedVolumeMl = requiredQuantity(source.preparedVolume, 'sources[' + source.id + '].preparedVolume', 'thể tích pha', 'volume', VOLUME_TO_ML, issues) ?? 0;
      const parent = source.sourceId ? sourceConcentrationById.get(source.sourceId) ?? null : null;
      const sourceVolumeMl = parent === null ? null : concentrationGPerL * preparedVolumeMl / parent;
      const actualSourceVolumeMl = optionalQuantity(source.actualSourceQuantity, 'sources[' + source.id + '].actualSourceQuantity', 'thể tích nguồn thực tế', 'volume', VOLUME_TO_ML, issues);
      return {
        id: source.id,
        name: source.name.trim(),
        concentrationGPerL,
        preparedVolumeMl,
        sourceId: source.sourceId ?? null,
        sourceVolumeMl,
        actualSourceVolumeMl,
        actualConcentrationGPerL: parent === null || actualSourceVolumeMl === null ? null : parent * actualSourceVolumeMl / preparedVolumeMl,
        operation: sourceVolumeMl === null ? 'Dùng ' + source.name.trim() + ' làm nguồn gốc do KNV nhập tay.' : 'Hút ' + quantityResult(sourceVolumeMl, 'volume').displayValue + ' ' + quantityResult(sourceVolumeMl, 'volume').displayUnit + ' từ nguồn trực tiếp; định mức đến ' + preparedVolumeMl + ' mL.',
        pipette: sourceVolumeMl === null ? null : suggestPipette(sourceVolumeMl, 'sources[' + source.id + '].sourceVolume', issues),
        flask: suggestVolumetricFlask(preparedVolumeMl, 'sources[' + source.id + '].preparedVolume', issues)
      };
    }),
    pointRows,
    componentRows,
    additionRows: additionRows.map(({ includeInFinalVolume: _includeInFinalVolume, ...addition }) => addition),
    sourceDemand,
    instructions
  }, issues, { sourceCount: draft.sources.length, pointCount: draft.points.length, componentCount: draft.components.length, residualPercent }, trace);
}

function calculateResultConversion(draft: ResultConversionTaskDraft): PrepCalculationResult<PrepOutput> {
  const issues: CalculationIssue[] = [];
  const trace: CalculationTraceStep[] = [];
  const sampleName = requireName(draft.sampleName, 'sampleName', 'tên mẫu', issues);
  const sampleAmount = requiredQuantity(draft.sampleAmount, 'sampleAmount', 'lượng mẫu ban đầu', draft.sampleBase, draft.sampleBase === 'mass' ? MASS_TO_G : VOLUME_TO_ML, issues);
  const instrument = concentrationForOutput(draft.instrument, 'instrument', 'kết quả máy', issues);
  if (!instrument || sampleAmount === null || sampleName === '') return calculated(null, issues, {}, trace);
  if (!draft.steps.length) addIssue(issues, 'MISSING_STEPS', 'steps', 'Thêm các bước xử lý mẫu trước khi quy đổi kết quả.');
  let currentVolumeMl: number | null = draft.sampleBase === 'volume' ? sampleAmount : null;
  let cumulativeFraction = 1;
  const stages: ResultConversionOutput['stages'] = [];
  for (const [index, step] of draft.steps.entries()) {
    const path = 'steps[' + index + ']';
    const volume = step.volume ? optionalQuantity(step.volume, path + '.volume', 'thể tích bước ' + (index + 1), 'volume', VOLUME_TO_ML, issues) : null;
    let retentionFraction = 1;
    let concentrationFactor: number | null = null;
    switch (step.type) {
      case 'extract':
      case 'dilution':
      case 'concentration':
      case 'reconstitution':
        if (volume === null) addIssue(issues, 'MISSING_INPUT', path + '.volume', 'Nhập thể tích đầu ra của bước ' + (index + 1) + '.');
        else {
          if (currentVolumeMl !== null && (step.type === 'concentration' || step.type === 'reconstitution') && volume > currentVolumeMl) addIssue(issues, 'STAGE_ORDER_INVALID', path + '.volume', 'Thể tích cô/hoàn nguyên không hợp lý so với công đoạn trước.', 'warning');
          currentVolumeMl = volume;
        }
        break;
      case 'aliquot':
        if (volume === null) addIssue(issues, 'MISSING_INPUT', path + '.volume', 'Nhập thể tích aliquot.');
        else if (currentVolumeMl === null) addIssue(issues, 'MISSING_STAGE_VOLUME', path, 'Không biết thể tích hiện tại để tính tỷ lệ aliquot.');
        else if (volume > currentVolumeMl) addIssue(issues, 'STAGE_ORDER_INVALID', path + '.volume', 'Aliquot không được lớn hơn thể tích hiện tại.');
        else {
          retentionFraction = volume / currentVolumeMl;
          concentrationFactor = 1 / retentionFraction;
          currentVolumeMl = volume;
        }
        break;
      case 'transfer_all':
        if (volume !== null) currentVolumeMl = volume;
        break;
      case 'split': {
        const fraction = requiredNumber(step.fraction, path + '.fraction', 'tỷ lệ phần dòng', issues);
        if (fraction !== null) {
          if (fraction > 1) addIssue(issues, 'FRACTION_OUT_OF_RANGE', path + '.fraction', 'Tỷ lệ phần dòng không được vượt quá 1.');
          else {
            retentionFraction = fraction;
            concentrationFactor = 1 / fraction;
            if (currentVolumeMl !== null) currentVolumeMl *= fraction;
          }
        }
        break;
      }
      case 'recovery': {
        const recovery = requiredNumber(step.recoveryPercent, path + '.recoveryPercent', 'hiệu suất thu hồi', issues);
        if (recovery !== null) {
          if (recovery > 100) addIssue(issues, 'RECOVERY_OUT_OF_RANGE', path + '.recoveryPercent', 'Hiệu suất thu hồi không được vượt quá 100%.');
          else {
            retentionFraction = recovery / 100;
            concentrationFactor = 1 / retentionFraction;
          }
        }
        break;
      }
    }
    cumulativeFraction *= retentionFraction;
    stages.push({ id: step.id, label: step.label.trim() || 'Bước ' + (index + 1), type: step.type, volumeMl: currentVolumeMl, retentionFraction, cumulativeFraction, concentrationFactor });
    trace.push({ label: step.label.trim() || 'Bước ' + (index + 1), expression: step.type === 'aliquot' ? 'f_step = V_aliquot / V_trước' : step.type === 'split' || step.type === 'recovery' ? 'f_step = tỷ lệ giữ lại' : 'f_step = 1 nếu chuyển toàn lượng/đổi thể tích', substitution: 'f_step = ' + retentionFraction, value: cumulativeFraction, unit: 'tỷ lệ giữ lại tích lũy' });
  }
  if (currentVolumeMl === null) addIssue(issues, 'MISSING_STAGE_VOLUME', 'steps', 'Chuỗi xử lý phải xác định được thể tích dung dịch cuối.');
  if (cumulativeFraction <= 0) addIssue(issues, 'INVALID_RETENTION', 'steps', 'Tỷ lệ giữ lại tổng phải lớn hơn 0.');
  if (issues.some(item => item.severity === 'error') || currentVolumeMl === null) return calculated(null, issues, {}, trace);
  const finalAnalyteMassG = instrument.gPerL * currentVolumeMl / 1000;
  const originalAnalyteMassG = finalAnalyteMassG / cumulativeFraction;
  let resultValue: number;
  if (draft.sampleBase === 'mass') {
    const fraction = originalAnalyteMassG / sampleAmount;
    resultValue = draft.resultUnit === 'mg/kg' ? fraction * 1000000 : fraction * 1000000000;
  } else {
    const gPerL = originalAnalyteMassG / (sampleAmount / 1000);
    resultValue = draft.resultUnit === 'mg/L' ? gPerL * 1000 : gPerL * 1000000;
  }
  const conversionFactor = resultValue / (instrument.gPerL || 1);
  trace.push({ label: 'Kết quả quy về mẫu ban đầu', expression: 'C_machine × V_final / f_retained / lượng mẫu ban đầu', substitution: instrument.gPerL + ' g/L × ' + currentVolumeMl + ' mL / ' + cumulativeFraction + ' / ' + sampleAmount, value: resultValue, unit: draft.resultUnit });
  return calculated({
    kind: 'result_conversion',
    sampleName,
    sampleBase: draft.sampleBase,
    sampleAmount: quantityResult(sampleAmount, draft.sampleBase === 'mass' ? 'mass' : 'volume'),
    instrumentConcentrationGPerL: instrument.gPerL,
    finalVolumeMl: currentVolumeMl,
    overallRetentionFraction: cumulativeFraction,
    conversionFactor,
    resultConcentrationGPerSampleUnit: resultValue,
    resultValue,
    resultUnit: draft.resultUnit,
    stages,
    operation: 'Truy ngược kết quả máy qua ' + stages.length + ' bước xử lý; không tạo hệ số aliquot cho bước chuyển toàn lượng.'
  }, issues, { sampleAmount, instrumentGPerL: instrument.gPerL, finalVolumeMl: currentVolumeMl, overallRetentionFraction: cumulativeFraction, resultValue }, trace);
}

export function calculatePrep(draft: PrepDraft): PrepCalculationResult<PrepOutput> {
  switch (draft.mode) {
    case 'concentration': return calculateConcentration(draft);
    case 'target': return calculateTarget(draft);
    case 'spike': return calculateSpike(draft);
    case 'series': return calculateSeries(draft);
    case 'result_conversion': return calculateResultConversion(draft);
  }
}
