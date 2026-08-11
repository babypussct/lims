export type PrepMode = 'concentration' | 'target' | 'spike' | 'series' | 'result_conversion';

export type QuantityDimension = 'mass' | 'volume' | 'amount';

export type ConcentrationBasis =
  | 'molar'
  | 'mass_per_volume'
  | 'mass_per_mass'
  | 'volume_per_volume'
  | 'mass_fraction';

export interface QuantityDraft {
  value: number | null;
  unit: string;
  dimension: QuantityDimension;
}

/** A displayed unit is never enough to identify a concentration. The basis is mandatory. */
export interface ConcentrationDraft {
  value: number | null;
  unit: string;
  basis: ConcentrationBasis;
  molecularWeight?: number | null;
  densityGPerMl?: number | null;
}

export type PrepSourceType = 'solid' | 'solution' | 'concentrate';

export interface ManualSubstance {
  name: string;
  molecularWeight?: number | null;
  potencyPercent?: number | null;
  densityGPerMl?: number | null;
  conversionFactor?: number | null;
}

export interface ConcentrationTaskDraft {
  mode: 'concentration';
  sourceType: PrepSourceType;
  substance: ManualSubstance;
  plannedQuantity: QuantityDraft;
  actualQuantity?: QuantityDraft | null;
  finalVolume: QuantityDraft;
  sourceConcentration?: ConcentrationDraft | null;
  targetConcentration?: ConcentrationDraft | null;
}

export interface TargetTaskDraft {
  mode: 'target';
  sourceType: PrepSourceType;
  substance: ManualSubstance;
  targetConcentration: ConcentrationDraft;
  finalVolume: QuantityDraft;
  sourceConcentration?: ConcentrationDraft | null;
  actualQuantity?: QuantityDraft | null;
}

export type SpikeMatrix = 'solid' | 'liquid' | 'extract' | 'vial';
export type SpikeSemantic = 'added_on_initial' | 'final_total';
export type SpikeLocation = 'sample_initial' | 'extract' | 'after_cleanup' | 'final_vial';

export interface SpikeTaskDraft {
  mode: 'spike';
  matrix: SpikeMatrix;
  location: SpikeLocation;
  semantic: SpikeSemantic;
  standardName: string;
  sampleName: string;
  standard: ConcentrationDraft;
  target: ConcentrationDraft;
  sampleQuantity: QuantityDraft;
  initialConcentration?: ConcentrationDraft | null;
}

export type SeriesStrategy = 'direct' | 'multi_intermediate' | 'serial_dilution' | 'multi_component';
export type SeriesObjectType = 'standard' | 'blank' | 'qc' | 'sample';
export type AdditionType = 'analyte' | 'internal_standard' | 'surrogate';

export interface SeriesSourceDraft {
  id: string;
  name: string;
  /** Root source concentration, or the target concentration when sourceId is set. */
  concentration: ConcentrationDraft;
  preparedVolume?: QuantityDraft | null;
  sourceId?: string | null;
  actualSourceQuantity?: QuantityDraft | null;
}

export interface SeriesPointDraft {
  id: string;
  label: string;
  objectType: SeriesObjectType;
  targetConcentration: ConcentrationDraft;
  finalVolume: QuantityDraft;
  sourceId: string;
  actualSourceQuantity?: QuantityDraft | null;
}

export interface SeriesComponentDraft {
  id: string;
  name: string;
  sourceId: string;
  targetConcentration: ConcentrationDraft;
}

export interface AdditionDraft {
  id: string;
  type: AdditionType;
  name: string;
  sourceId?: string | null;
  source: ConcentrationDraft;
  applicationScope: SeriesObjectType[];
  targetLevel?: ConcentrationDraft | null;
  fixedVolume?: QuantityDraft | null;
  exceptions?: SeriesObjectType[];
  includeInFinalVolume?: boolean;
}

export interface SeriesTaskDraft {
  mode: 'series';
  strategy: SeriesStrategy;
  sources: SeriesSourceDraft[];
  points: SeriesPointDraft[];
  components: SeriesComponentDraft[];
  finalVolume?: QuantityDraft | null;
  additions: AdditionDraft[];
  residualPercent?: number | null;
}

export type SampleBase = 'mass' | 'volume';
export type SampleProcessingStepType =
  | 'extract'
  | 'aliquot'
  | 'transfer_all'
  | 'dilution'
  | 'concentration'
  | 'reconstitution'
  | 'split'
  | 'recovery';

export interface SampleProcessingStepDraft {
  id: string;
  label: string;
  type: SampleProcessingStepType;
  volume?: QuantityDraft | null;
  fraction?: number | null;
  recoveryPercent?: number | null;
}

export type ResultConcentrationUnit = 'mg/kg' | 'µg/kg' | 'mg/L' | 'µg/L';

export interface ResultConversionTaskDraft {
  mode: 'result_conversion';
  sampleName: string;
  sampleBase: SampleBase;
  sampleAmount: QuantityDraft;
  instrument: ConcentrationDraft;
  resultUnit: ResultConcentrationUnit;
  steps: SampleProcessingStepDraft[];
}

export type PrepDraft =
  | ConcentrationTaskDraft
  | TargetTaskDraft
  | SpikeTaskDraft
  | SeriesTaskDraft
  | ResultConversionTaskDraft;

export interface CalculationIssue {
  code: string;
  severity: 'error' | 'warning' | 'information';
  path: string;
  message: string;
  suggestedAction?: string;
}

export interface CalculationTraceStep {
  label: string;
  expression: string;
  substitution?: string;
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

export interface ConcentrationAlternative {
  value: number;
  unit: string;
  basis: ConcentrationBasis;
}

export interface ConcentrationSnapshot {
  massPerVolumeGPerL: number;
  molarM: number | null;
  alternatives: ConcentrationAlternative[];
}

export interface QuantityResult {
  canonicalValue: number;
  canonicalUnit: 'g' | 'mL' | 'mol';
  displayValue: number;
  displayUnit: string;
}

export interface PipetteSuggestion {
  id: string;
  minUl: number;
  maxUl: number;
  volumeUl: number;
}

export interface VolumetricFlaskSuggestion {
  volumeMl: number;
  exact: boolean;
}

export interface ConcentrationOutput {
  kind: 'concentration';
  sourceType: PrepSourceType;
  name: string;
  finalVolumeMl: number;
  activeMassG: number | null;
  plannedQuantity: QuantityResult;
  actualQuantity: QuantityResult;
  plannedConcentration: ConcentrationSnapshot | null;
  actualConcentration: ConcentrationSnapshot;
  targetConcentration: ConcentrationSnapshot | null;
  deviationGPerL: number | null;
  operation: string;
  pipette: PipetteSuggestion | null;
  flask: VolumetricFlaskSuggestion | null;
  balanceDisplayMg: number | null;
}

export interface TargetOutput {
  kind: 'target';
  sourceType: PrepSourceType;
  name: string;
  finalVolumeMl: number;
  plannedQuantity: QuantityResult;
  actualQuantity: QuantityResult | null;
  plannedConcentration: ConcentrationSnapshot;
  actualConcentration: ConcentrationSnapshot | null;
  operation: string;
  pipette: PipetteSuggestion | null;
  flask: VolumetricFlaskSuggestion | null;
  balanceDisplayMg: number | null;
}

export interface SpikeOutput {
  kind: 'spike';
  matrix: SpikeMatrix;
  location: SpikeLocation;
  semantic: SpikeSemantic;
  standardName: string;
  sampleName: string;
  sampleQuantity: QuantityResult;
  spikeVolumeMl: number;
  addedMassG: number;
  standardConcentrationGPerL: number;
  targetConcentration: ConcentrationSnapshot | null;
  initialConcentration: ConcentrationSnapshot | null;
  operation: string;
  pipette: PipetteSuggestion | null;
}

export interface SeriesIntermediateOutput {
  id: string;
  name: string;
  concentrationGPerL: number;
  preparedVolumeMl: number;
  sourceId: string | null;
  sourceVolumeMl: number | null;
  actualSourceVolumeMl: number | null;
  actualConcentrationGPerL: number | null;
  operation: string;
  pipette: PipetteSuggestion | null;
  flask: VolumetricFlaskSuggestion | null;
}

export interface SeriesPointOutput {
  id: string;
  label: string;
  objectType: SeriesObjectType;
  targetConcentrationGPerL: number;
  finalVolumeMl: number;
  sourceId: string;
  sourceConcentrationGPerL: number;
  sourceVolumeMl: number;
  actualSourceVolumeMl: number | null;
  actualConcentrationGPerL: number | null;
  solventVolumeMl: number;
  additionsVolumeMl: number;
  operation: string;
  pipette: PipetteSuggestion | null;
  flask: VolumetricFlaskSuggestion | null;
}

export interface SeriesComponentOutput {
  id: string;
  name: string;
  sourceId: string;
  sourceConcentrationGPerL: number;
  targetConcentrationGPerL: number;
  volumeMl: number;
  pipette: PipetteSuggestion | null;
}

export interface SeriesAdditionOutput {
  id: string;
  name: string;
  type: AdditionType;
  pointId: string;
  pointLabel: string;
  volumeMl: number;
  operation: string;
  pipette: PipetteSuggestion | null;
}

export interface SourceDemandOutput {
  sourceId: string;
  name: string;
  directRequiredVolumeMl: number;
  requiredVolumeMl: number;
  residualPercent: number;
  requiredWithResidualMl: number;
  preparedVolumeMl: number | null;
}

export interface SeriesOutput {
  kind: 'series';
  strategy: SeriesStrategy;
  intermediateRows: SeriesIntermediateOutput[];
  pointRows: SeriesPointOutput[];
  componentRows: SeriesComponentOutput[];
  additionRows: SeriesAdditionOutput[];
  sourceDemand: SourceDemandOutput[];
  instructions: string[];
}

export interface SampleStageOutput {
  id: string;
  label: string;
  type: SampleProcessingStepType;
  volumeMl: number | null;
  retentionFraction: number;
  cumulativeFraction: number;
  concentrationFactor: number | null;
}

export interface ResultConversionOutput {
  kind: 'result_conversion';
  sampleName: string;
  sampleBase: SampleBase;
  sampleAmount: QuantityResult;
  instrumentConcentrationGPerL: number;
  finalVolumeMl: number;
  overallRetentionFraction: number;
  conversionFactor: number;
  resultConcentrationGPerSampleUnit: number;
  resultValue: number;
  resultUnit: ResultConcentrationUnit;
  stages: SampleStageOutput[];
  operation: string;
}

export type PrepOutput =
  | ConcentrationOutput
  | TargetOutput
  | SpikeOutput
  | SeriesOutput
  | ResultConversionOutput;
