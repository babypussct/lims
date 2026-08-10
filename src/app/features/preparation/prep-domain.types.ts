export type PrepMode = 'molar' | 'dilution' | 'spiking' | 'serial' | 'mix' | 'sample_prep';

export type QuantityDimension = 'mass' | 'volume' | 'amount' | 'count';

export type ConcentrationBasis =
  | 'molar'
  | 'mass_per_volume'
  | 'mass_fraction'
  | 'mass_per_mass';

export interface QuantityDraft {
  value: number | null;
  unit: string;
  dimension: QuantityDimension;
}

export interface ConcentrationDraft {
  value: number | null;
  unit: string;
  basis: ConcentrationBasis;
  molecularWeight?: number | null;
  densityGPerMl?: number | null;
}

export interface MolarDraft {
  mode: 'molar';
  name: string;
  mass: QuantityDraft;
  purity: number | null;
  finalVolume: QuantityDraft;
  molecularWeight: number | null;
}

export interface DilutionDraft {
  mode: 'dilution';
  stockName: string;
  stock: ConcentrationDraft;
  target: ConcentrationDraft;
  finalVolume: QuantityDraft;
}

export interface SpikingDraft {
  mode: 'spiking';
  stockName: string;
  sampleName: string;
  stock: ConcentrationDraft;
  added: ConcentrationDraft;
  sampleVolume: QuantityDraft;
}

export interface SerialDraft {
  mode: 'serial';
  stockName: string;
  stock: ConcentrationDraft;
  pointVolume: QuantityDraft;
  targets: ConcentrationDraft[];
}

export interface MixDraftRow {
  id: string;
  name: string;
  stock: ConcentrationDraft;
  target: ConcentrationDraft;
}

export interface MixDraft {
  mode: 'mix';
  finalVolume: QuantityDraft;
  rows: MixDraftRow[];
}

export interface SamplePrepDraft {
  mode: 'sample_prep';
  sampleName: string;
  sampleMass: QuantityDraft;
  extractVolume: QuantityDraft;
  cleanupAliquot: QuantityDraft;
  concentrationAliquot: QuantityDraft;
  finalVolume: QuantityDraft;
  recovery: number | null;
  instrument: ConcentrationDraft;
}

export type PrepDraft =
  | MolarDraft
  | DilutionDraft
  | SpikingDraft
  | SerialDraft
  | MixDraft
  | SamplePrepDraft;

export interface CalculationIssue {
  code: string;
  severity: 'error' | 'warning';
  path: string;
  message: string;
}

export interface CalculationTraceStep {
  label: string;
  expression: string;
  value?: number;
  unit?: string;
}

export interface PrepCalculationResult<TOutput> {
  status: 'incomplete' | 'invalid' | 'valid';
  output: TOutput | null;
  issues: CalculationIssue[];
  normalizedInputs: Record<string, number | string>;
  trace: CalculationTraceStep[];
}

export interface MolarOutput {
  kind: 'molar';
  name: string;
  activeMassG: number;
  massConcentrationGPerL: number;
  molarConcentrationM: number | null;
  massAlternatives: { value: number; unit: string }[];
  molarAlternatives: { value: number; unit: string }[];
}

export interface DilutionOutput {
  kind: 'dilution';
  stockName: string;
  stockVolumeMl: number;
  solventVolumeMl: number;
  finalVolumeMl: number;
  stockConcentrationGPerL: number;
  targetConcentrationGPerL: number;
}

export interface SpikingOutput {
  kind: 'spiking';
  stockName: string;
  sampleName: string;
  spikeVolumeMl: number;
  sampleVolumeMl: number;
  stockConcentrationGPerL: number;
  addedConcentrationGPerL: number;
}

export interface SerialCalculationRow {
  index: number;
  targetConcentrationGPerL: number;
  targetDisplayValue: number;
  targetDisplayUnit: string;
  stockVolumeMl: number;
  solventVolumeMl: number;
}

export interface SerialOutput {
  kind: 'serial';
  stockName: string;
  pointVolumeMl: number;
  rows: SerialCalculationRow[];
  totalStockVolumeMl: number;
  totalSolventVolumeMl: number;
}

export interface MixCalculationRow {
  id: string;
  name: string;
  stockVolumeMl: number;
  targetConcentrationGPerL: number;
  stockConcentrationGPerL: number;
}

export interface MixOutput {
  kind: 'mix';
  finalVolumeMl: number;
  rows: MixCalculationRow[];
  componentVolumeMl: number;
  solventVolumeMl: number;
}

export interface SamplePrepOutput {
  kind: 'sample_prep';
  factor: number;
  instrumentConcentrationGPerL: number;
  sampleConcentrationGPerL: number;
  extractVolumeMl: number;
  cleanupAliquotMl: number;
  concentrationAliquotMl: number;
  finalVolumeMl: number;
  recovery: number;
}

export type PrepOutput =
  | MolarOutput
  | DilutionOutput
  | SpikingOutput
  | SerialOutput
  | MixOutput
  | SamplePrepOutput;
