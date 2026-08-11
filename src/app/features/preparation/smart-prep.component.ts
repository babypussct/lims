import { CommonModule } from '@angular/common';
import { Component, WritableSignal, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';
import { calculatePrep } from './prep-calculation.engine';
import {
  AdditionDraft,
  ConcentrationDraft,
  CalculationIssue,
  PrepCalculationResult,
  PrepDraft,
  PrepMode,
  PrepOutput,
  PrepSourceType,
  ResultConcentrationUnit,
  SampleBase,
  SampleProcessingStepDraft,
  SampleProcessingStepType,
  SeriesObjectType,
  SeriesStrategy,
  SpikeLocation,
  SpikeMatrix,
  SpikeSemantic,
  QuantityDraft,
  QuantityResult
} from './prep-domain.types';

type NumericSignal = WritableSignal<number | null>;

interface TaskDefinition {
  id: PrepMode;
  label: string;
  question: string;
  description: string;
  icon: string;
  activeClass: string;
}

interface ConcentrationOption {
  key: string;
  unit: string;
  basis: ConcentrationDraft['basis'];
  label: string;
}

interface UiSeriesSource {
  id: string;
  name: string;
  concentration: number | null;
  concentrationChoice: string;
  preparedVolume: number | null;
  preparedVolumeUnit: string;
  sourceId: string;
  actualSourceVolume: number | null;
}

interface UiSeriesPoint {
  id: string;
  label: string;
  objectType: SeriesObjectType;
  targetConcentration: number | null;
  targetChoice: string;
  finalVolume: number | null;
  finalVolumeUnit: string;
  sourceId: string;
  actualSourceVolume: number | null;
}

interface UiSeriesComponent {
  id: string;
  name: string;
  sourceId: string;
  targetConcentration: number | null;
  targetChoice: string;
}

interface UiAddition {
  id: string;
  type: AdditionDraft['type'];
  name: string;
  sourceId: string;
  sourceConcentration: number | null;
  sourceChoice: string;
  fixedVolume: number | null;
  fixedVolumeUnit: string;
  targetLevel: number | null;
  targetChoice: string;
  standard: boolean;
  blank: boolean;
  qc: boolean;
  sample: boolean;
  exceptionStandard: boolean;
  exceptionBlank: boolean;
  exceptionQc: boolean;
  exceptionSample: boolean;
  includeInFinalVolume: boolean;
}

interface UiStep {
  id: string;
  label: string;
  type: SampleProcessingStepType;
  volume: number | null;
  volumeUnit: string;
  fraction: number | null;
  recoveryPercent: number | null;
}

const CONCENTRATION_OPTIONS: readonly ConcentrationOption[] = [
  { key: 'ppm_mg_l', unit: 'ppm', basis: 'mass_per_volume', label: 'ppm (mg/L)' },
  { key: 'ppb_ug_l', unit: 'ppb', basis: 'mass_per_volume', label: 'ppb (µg/L)' },
  { key: 'mg_ml', unit: 'mg/mL', basis: 'mass_per_volume', label: 'mg/mL' },
  { key: 'mg_l', unit: 'mg/L', basis: 'mass_per_volume', label: 'mg/L' },
  { key: 'ug_ml', unit: 'µg/mL', basis: 'mass_per_volume', label: 'µg/mL' },
  { key: 'ug_l', unit: 'µg/L', basis: 'mass_per_volume', label: 'µg/L' },
  { key: 'ppm_mg_kg', unit: 'ppm', basis: 'mass_per_mass', label: 'ppm (mg/kg)' },
  { key: 'mg_kg', unit: 'mg/kg', basis: 'mass_per_mass', label: 'mg/kg' },
  { key: 'ug_kg', unit: 'µg/kg', basis: 'mass_per_mass', label: 'µg/kg' },
  { key: 'g_l', unit: 'g/L', basis: 'mass_per_volume', label: 'g/L' },
  { key: 'molar_m', unit: 'M', basis: 'molar', label: 'M (mol/L)' },
  { key: 'molar_mm', unit: 'mM', basis: 'molar', label: 'mM (mmol/L)' },
  { key: 'molar_um', unit: 'µM', basis: 'molar', label: 'µM (µmol/L)' },
  { key: 'percent_ww', unit: '% w/w', basis: 'mass_fraction', label: '% w/w' },
  { key: 'percent_wv', unit: '% w/v', basis: 'mass_per_volume', label: '% w/v' },
  { key: 'percent_vv', unit: '% v/v', basis: 'volume_per_volume', label: '% v/v' }
];

const VOLUME_OPTIONS = [
  { unit: 'µL', label: 'µL' },
  { unit: 'mL', label: 'mL' },
  { unit: 'L', label: 'L' }
];

const MASS_OPTIONS = [
  { unit: 'µg', label: 'µg' },
  { unit: 'mg', label: 'mg' },
  { unit: 'g', label: 'g' },
  { unit: 'kg', label: 'kg' }
];

const TASKS: readonly TaskDefinition[] = [
  {
    id: 'concentration',
    label: 'Tính nồng độ đã pha',
    question: 'Dung dịch vừa pha đạt nồng độ bao nhiêu?',
    description: 'Từ lượng cân/hút kế hoạch và thực tế, potency, nguồn và thể tích định mức.',
    icon: 'fa-flask-vial',
    activeClass: 'border-indigo-500 bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
  },
  {
    id: 'target',
    label: 'Tính lượng cần lấy',
    question: 'Cần cân hoặc hút bao nhiêu để pha dung dịch đích?',
    description: 'Giải biến cần tìm từ chất rắn, dung dịch nguồn hoặc hóa chất đậm đặc.',
    icon: 'fa-bullseye',
    activeClass: 'border-cyan-500 bg-cyan-600 text-white shadow-lg shadow-cyan-200 dark:shadow-none'
  },
  {
    id: 'spike',
    label: 'Tính chuẩn thêm vào mẫu',
    question: 'Cần hút bao nhiêu chuẩn cho mẫu rắn/lỏng?',
    description: 'Công bố rõ vị trí thêm và semantic trên mẫu ban đầu hay thể tích cuối.',
    icon: 'fa-vial',
    activeClass: 'border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-200 dark:shadow-none'
  },
  {
    id: 'series',
    label: 'Lập dãy chuẩn/QC',
    question: 'Cần pha nguồn, điểm chuẩn, QC và nội chuẩn theo thứ tự nào?',
    description: 'Hỗ trợ nhiều chuẩn trung gian, pha nối tiếp, hỗn hợp và scope nội chuẩn.',
    icon: 'fa-diagram-project',
    activeClass: 'border-violet-500 bg-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-none'
  },
  {
    id: 'result_conversion',
    label: 'Quy đổi kết quả xử lý mẫu',
    question: 'Kết quả máy quy về mẫu ban đầu như thế nào?',
    description: 'Mô hình hóa chuỗi chiết, aliquot, cô, hoàn nguyên, pha loãng và recovery.',
    icon: 'fa-route',
    activeClass: 'border-rose-500 bg-rose-600 text-white shadow-lg shadow-rose-200 dark:shadow-none'
  }
];

@Component({
  selector: 'app-smart-prep',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './smart-prep.component.html',
  styles: [
    ".field-label{display:block;margin-bottom:.45rem;font-size:.65rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#64748b}.field-input{width:100%;border:1px solid #cbd5e1;border-radius:.75rem;background:#fff;padding:.62rem .72rem;font-size:.875rem;outline:0;transition:border-color .15s,box-shadow .15s}.field-input:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.12)}.field-help{margin-top:.35rem;font-size:.68rem;line-height:1.45;color:#64748b}.result-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.5rem}.result-grid>div{border-radius:.75rem;background:#f8fafc;padding:.75rem}.result-grid span{display:block;font-size:.625rem;font-weight:700;color:#94a3b8}.result-grid strong{display:block;margin-top:.25rem;font-size:.8rem;line-height:1.35}@media (prefers-color-scheme:dark){.field-label{color:#94a3b8}.field-input{border-color:#334155;background:#0f172a;color:#e2e8f0}.field-help{color:#94a3b8}.result-grid>div{background:rgba(30,41,59,.7)}}"
  ]
})
export class SmartPrepComponent {
  private readonly toast = inject(ToastService);

  readonly tasks = TASKS;
  readonly concentrationOptions = CONCENTRATION_OPTIONS;
  readonly volumeOptions = VOLUME_OPTIONS;
  readonly massOptions = MASS_OPTIONS;
  readonly seriesObjectTypes: readonly SeriesObjectType[] = ['standard', 'blank', 'qc', 'sample'];
  readonly sampleBases: readonly SampleBase[] = ['mass', 'volume'];
  readonly resultUnits: readonly ResultConcentrationUnit[] = ['mg/kg', 'µg/kg', 'mg/L', 'µg/L'];
  readonly spikeMatrices: readonly SpikeMatrix[] = ['solid', 'liquid', 'extract', 'vial'];
  readonly spikeLocations: readonly SpikeLocation[] = ['sample_initial', 'extract', 'after_cleanup', 'final_vial'];
  readonly spikeSemantics: readonly SpikeSemantic[] = ['added_on_initial', 'final_total'];
  readonly seriesStrategies: readonly SeriesStrategy[] = ['direct', 'multi_intermediate', 'serial_dilution', 'multi_component'];
  readonly stepTypes: readonly SampleProcessingStepType[] = ['extract', 'aliquot', 'transfer_all', 'dilution', 'concentration', 'reconstitution', 'split', 'recovery'];

  readonly calcMode = signal<PrepMode>('concentration');
  readonly showTrace = signal(false);

  readonly concentrationSourceType = signal<PrepSourceType>('solid');
  readonly concentrationName = signal('Chất chuẩn thủ công');
  readonly concentrationPlannedValue = signal<number | null>(10.2);
  readonly concentrationActualValue = signal<number | null>(null);
  readonly concentrationQuantityUnit = signal('mg');
  readonly concentrationPotency = signal<number | null>(98.5);
  readonly concentrationConversionFactor = signal<number | null>(1);
  readonly concentrationFinalVolume = signal<number | null>(10);
  readonly concentrationFinalVolumeUnit = signal('mL');
  readonly concentrationSourceValue = signal<number | null>(1000);
  readonly concentrationSourceChoice = signal('ppm_mg_l');
  readonly concentrationTargetValue = signal<number | null>(null);
  readonly concentrationTargetChoice = signal('ppm_mg_l');
  readonly concentrationMolecularWeight = signal<number | null>(null);
  readonly concentrationDensity = signal<number | null>(null);

  readonly targetSourceType = signal<PrepSourceType>('solution');
  readonly targetName = signal('Dung dịch nguồn thủ công');
  readonly targetValue = signal<number | null>(10);
  readonly targetChoice = signal('ppm_mg_l');
  readonly targetFinalVolume = signal<number | null>(10);
  readonly targetFinalVolumeUnit = signal('mL');
  readonly targetPotency = signal<number | null>(100);
  readonly targetConversionFactor = signal<number | null>(1);
  readonly targetMolecularWeight = signal<number | null>(null);
  readonly targetDensity = signal<number | null>(null);
  readonly targetSourceValue = signal<number | null>(1000);
  readonly targetSourceChoice = signal('ppm_mg_l');
  readonly targetActualValue = signal<number | null>(null);
  readonly targetQuantityUnit = signal('µL');

  readonly spikeMatrix = signal<SpikeMatrix>('solid');
  readonly spikeLocation = signal<SpikeLocation>('sample_initial');
  readonly spikeSemantic = signal<SpikeSemantic>('added_on_initial');
  readonly spikeStandardName = signal('Dung dịch chuẩn spike');
  readonly spikeSampleName = signal('Mẫu thử');
  readonly spikeSampleValue = signal<number | null>(5);
  readonly spikeSampleUnit = signal('g');
  readonly spikeStandardValue = signal<number | null>(10);
  readonly spikeStandardChoice = signal('mg_l');
  readonly spikeTargetValue = signal<number | null>(0.05);
  readonly spikeTargetChoice = signal('mg_kg');
  readonly spikeInitialValue = signal<number | null>(null);
  readonly spikeInitialChoice = signal('mg_kg');
  readonly spikeMolecularWeight = signal<number | null>(null);
  readonly spikeDensity = signal<number | null>(null);

  readonly seriesStrategy = signal<SeriesStrategy>('multi_intermediate');
  readonly seriesFinalVolume = signal<number | null>(10);
  readonly seriesFinalVolumeUnit = signal('mL');
  readonly seriesResidualPercent = signal<number | null>(10);
  readonly seriesSources = signal<UiSeriesSource[]>([
    { id: 'source-root', name: 'Chuẩn gốc', concentration: 1000, concentrationChoice: 'ppm_mg_l', preparedVolume: 100, preparedVolumeUnit: 'mL', sourceId: '', actualSourceVolume: null },
    { id: 'source-low', name: 'Chuẩn trung gian thấp', concentration: 10, concentrationChoice: 'ppm_mg_l', preparedVolume: 10, preparedVolumeUnit: 'mL', sourceId: 'source-root', actualSourceVolume: null },
    { id: 'source-high', name: 'Chuẩn trung gian cao', concentration: 100, concentrationChoice: 'ppm_mg_l', preparedVolume: 10, preparedVolumeUnit: 'mL', sourceId: 'source-root', actualSourceVolume: null }
  ]);
  readonly seriesPoints = signal<UiSeriesPoint[]>([
    { id: 'point-1', label: 'STD 1', objectType: 'standard', targetConcentration: 1, targetChoice: 'ppm_mg_l', finalVolume: 10, finalVolumeUnit: 'mL', sourceId: 'source-low', actualSourceVolume: null },
    { id: 'point-2', label: 'STD 2', objectType: 'standard', targetConcentration: 5, targetChoice: 'ppm_mg_l', finalVolume: 10, finalVolumeUnit: 'mL', sourceId: 'source-low', actualSourceVolume: null },
    { id: 'point-3', label: 'STD 3', objectType: 'qc', targetConcentration: 50, targetChoice: 'ppm_mg_l', finalVolume: 10, finalVolumeUnit: 'mL', sourceId: 'source-high', actualSourceVolume: null }
  ]);
  readonly seriesComponents = signal<UiSeriesComponent[]>([
    { id: 'component-1', name: 'Chất A', sourceId: 'source-root', targetConcentration: 10, targetChoice: 'ppm_mg_l' },
    { id: 'component-2', name: 'Chất B', sourceId: 'source-root', targetConcentration: 5, targetChoice: 'ppm_mg_l' }
  ]);
  readonly seriesAdditions = signal<UiAddition[]>([
    { id: 'addition-is', type: 'internal_standard', name: 'Nội chuẩn', sourceId: 'source-root', sourceConcentration: 1000, sourceChoice: 'ppm_mg_l', fixedVolume: 0.1, fixedVolumeUnit: 'mL', targetLevel: null, targetChoice: 'ppm_mg_l', standard: true, blank: false, qc: true, sample: true, exceptionStandard: false, exceptionBlank: true, exceptionQc: false, exceptionSample: false, includeInFinalVolume: false }
  ]);

  readonly resultSampleName = signal('Mẫu thử');
  readonly resultSampleBase = signal<SampleBase>('mass');
  readonly resultSampleValue = signal<number | null>(10);
  readonly resultSampleUnit = signal('g');
  readonly resultInstrumentValue = signal<number | null>(1);
  readonly resultInstrumentChoice = signal('ppm_mg_l');
  readonly resultUnit = signal<ResultConcentrationUnit>('mg/kg');
  readonly resultSteps = signal<UiStep[]>([
    { id: 'step-extract', label: 'Chiết và định mức', type: 'extract', volume: 50, volumeUnit: 'mL', fraction: null, recoveryPercent: null },
    { id: 'step-aliquot', label: 'Lấy aliquot', type: 'aliquot', volume: 5, volumeUnit: 'mL', fraction: null, recoveryPercent: null },
    { id: 'step-concentrate', label: 'Cô', type: 'concentration', volume: 1, volumeUnit: 'mL', fraction: null, recoveryPercent: null },
    { id: 'step-reconstitute', label: 'Hoàn nguyên', type: 'reconstitution', volume: 1, volumeUnit: 'mL', fraction: null, recoveryPercent: null }
  ]);

  readonly calculation = computed<PrepCalculationResult<PrepOutput>>(() => calculatePrep(this.buildDraft()));

  getTask(id: PrepMode): TaskDefinition {
    return this.tasks.find(task => task.id === id) ?? this.tasks[0];
  }

  setCalcMode(mode: PrepMode): void {
    this.calcMode.set(mode);
    this.showTrace.set(false);
  }

  concentrationOption(key: string): ConcentrationOption {
    return this.concentrationOptions.find(option => option.key === key) ?? this.concentrationOptions[0];
  }

  makeConcentration(value: number | null, choiceKey: string, molecularWeight: number | null = null, densityGPerMl: number | null = null): ConcentrationDraft {
    const option = this.concentrationOption(choiceKey);
    return { value, unit: option.unit, basis: option.basis, molecularWeight, densityGPerMl };
  }

  makeQuantity(value: number | null, unit: string, dimension: QuantityDraft['dimension']): QuantityDraft {
    return { value, unit, dimension };
  }

  setNumeric(target: NumericSignal, raw: unknown): void {
    target.set(this.parseNumber(raw));
  }

  setCalcModeFromTask(id: string): void {
    if (this.tasks.some(task => task.id === id)) this.setCalcMode(id as PrepMode);
  }

  sourceTypeLabel(sourceType: PrepSourceType): string {
    return sourceType === 'solid' ? 'Chất rắn/chất chuẩn rắn' : sourceType === 'solution' ? 'Dung dịch nguồn' : 'Hóa chất lỏng đậm đặc';
  }

  spikeMatrixLabel(matrix: SpikeMatrix): string {
    return matrix === 'solid' ? 'Mẫu rắn theo khối lượng' : matrix === 'liquid' ? 'Mẫu lỏng theo thể tích' : matrix === 'extract' ? 'Dịch chiết theo thể tích' : 'Vial/dung dịch cuối';
  }

  spikeLocationLabel(location: SpikeLocation): string {
    return location === 'sample_initial' ? 'Mẫu ban đầu trước xử lý' : location === 'extract' ? 'Dịch chiết' : location === 'after_cleanup' ? 'Sau làm sạch' : 'Vial hoặc dung dịch cuối';
  }

  spikeSemanticLabel(semantic: SpikeSemantic): string {
    return semantic === 'added_on_initial' ? 'Mức thêm trên mẫu ban đầu' : 'Nồng độ tổng trên thể tích cuối';
  }

  seriesStrategyLabel(strategy: SeriesStrategy): string {
    return strategy === 'direct' ? 'Mỗi điểm từ một nguồn' : strategy === 'multi_intermediate' ? 'Nhiều chuẩn trung gian' : strategy === 'serial_dilution' ? 'Pha loãng nối tiếp' : 'Hỗn hợp nhiều chất';
  }

  stepTypeLabel(type: SampleProcessingStepType): string {
    const labels: Record<SampleProcessingStepType, string> = {
      extract: 'Chiết/định mức',
      aliquot: 'Lấy aliquot',
      transfer_all: 'Chuyển toàn lượng',
      dilution: 'Pha loãng',
      concentration: 'Cô',
      reconstitution: 'Hoàn nguyên',
      split: 'Chia dòng',
      recovery: 'Điều chỉnh recovery'
    };
    return labels[type];
  }

  objectTypeLabel(type: SeriesObjectType): string {
    return type === 'standard' ? 'Chuẩn' : type === 'blank' ? 'Blank' : type === 'qc' ? 'QC' : 'Mẫu';
  }

  additionTypeLabel(type: AdditionDraft['type']): string {
    return type === 'internal_standard' ? 'Nội chuẩn' : type === 'surrogate' ? 'Surrogate' : 'Chất phân tích';
  }

  sourceOptions(includePoints = true): Array<{ id: string; label: string }> {
    const sources = this.seriesSources().map(source => ({ id: source.id, label: source.name || source.id }));
    if (!includePoints) return sources;
    return [...sources, ...this.seriesPoints().map(point => ({ id: point.id, label: point.label || point.id }))];
  }

  updateSeriesSource(id: string, field: keyof UiSeriesSource, raw: unknown): void {
    this.seriesSources.update(rows => rows.map(row => row.id === id ? { ...row, [field]: field === 'name' || field === 'concentrationChoice' || field === 'preparedVolumeUnit' || field === 'sourceId' ? String(raw ?? '') : this.parseNumber(raw) } : row));
  }

  updateSeriesPoint(id: string, field: keyof UiSeriesPoint, raw: unknown): void {
    this.seriesPoints.update(rows => rows.map(row => row.id === id ? { ...row, [field]: field === 'label' || field === 'targetChoice' || field === 'finalVolumeUnit' || field === 'sourceId' || field === 'objectType' ? String(raw ?? '') : this.parseNumber(raw) } : row));
  }

  updateSeriesComponent(id: string, field: keyof UiSeriesComponent, raw: unknown): void {
    this.seriesComponents.update(rows => rows.map(row => row.id === id ? { ...row, [field]: field === 'name' || field === 'sourceId' || field === 'targetChoice' ? String(raw ?? '') : this.parseNumber(raw) } : row));
  }

  updateAddition(id: string, field: keyof UiAddition, raw: unknown): void {
    this.seriesAdditions.update(rows => rows.map(row => row.id === id ? { ...row, [field]: field === 'type' || field === 'name' || field === 'sourceId' || field === 'sourceChoice' || field === 'fixedVolumeUnit' || field === 'targetChoice' ? String(raw ?? '') : field === 'standard' || field === 'blank' || field === 'qc' || field === 'sample' || field === 'exceptionStandard' || field === 'exceptionBlank' || field === 'exceptionQc' || field === 'exceptionSample' || field === 'includeInFinalVolume' ? Boolean(raw) : this.parseNumber(raw) } : row));
  }

  toggleAdditionScope(id: string, scope: SeriesObjectType, checked: boolean, exception = false): void {
    const field: keyof UiAddition = exception
      ? scope === 'standard' ? 'exceptionStandard' : scope === 'blank' ? 'exceptionBlank' : scope === 'qc' ? 'exceptionQc' : 'exceptionSample'
      : scope === 'standard' ? 'standard' : scope === 'blank' ? 'blank' : scope === 'qc' ? 'qc' : 'sample';
    this.seriesAdditions.update(rows => rows.map(row => row.id === id ? { ...row, [field]: checked } : row));
  }

  addSeriesSource(): void {
    const index = this.seriesSources().length + 1;
    this.seriesSources.update(rows => [...rows, { id: 'source-' + Date.now(), name: 'Dung dịch trung gian ' + index, concentration: null, concentrationChoice: 'ppm_mg_l', preparedVolume: 10, preparedVolumeUnit: 'mL', sourceId: rows[0]?.id ?? '', actualSourceVolume: null }]);
  }

  removeSeriesSource(id: string): void {
    this.seriesSources.update(rows => rows.length <= 1 ? rows : rows.filter(row => row.id !== id));
  }

  addSeriesPoint(): void {
    const index = this.seriesPoints().length + 1;
    this.seriesPoints.update(rows => [...rows, { id: 'point-' + Date.now(), label: 'Điểm ' + index, objectType: 'standard', targetConcentration: null, targetChoice: 'ppm_mg_l', finalVolume: 10, finalVolumeUnit: 'mL', sourceId: this.seriesSources()[0]?.id ?? '', actualSourceVolume: null }]);
  }

  removeSeriesPoint(id: string): void {
    this.seriesPoints.update(rows => rows.length <= 1 ? rows : rows.filter(row => row.id !== id));
  }

  addSeriesComponent(): void {
    const index = this.seriesComponents().length + 1;
    this.seriesComponents.update(rows => [...rows, { id: 'component-' + Date.now(), name: 'Chất ' + index, sourceId: this.seriesSources()[0]?.id ?? '', targetConcentration: null, targetChoice: 'ppm_mg_l' }]);
  }

  removeSeriesComponent(id: string): void {
    this.seriesComponents.update(rows => rows.length <= 1 ? rows : rows.filter(row => row.id !== id));
  }

  addAddition(): void {
    this.seriesAdditions.update(rows => [...rows, { id: 'addition-' + Date.now(), type: 'surrogate', name: 'Surrogate mới', sourceId: this.seriesSources()[0]?.id ?? '', sourceConcentration: null, sourceChoice: 'ppm_mg_l', fixedVolume: null, fixedVolumeUnit: 'mL', targetLevel: null, targetChoice: 'ppm_mg_l', standard: true, blank: false, qc: true, sample: true, exceptionStandard: false, exceptionBlank: false, exceptionQc: false, exceptionSample: false, includeInFinalVolume: false }]);
  }

  removeAddition(id: string): void {
    this.seriesAdditions.update(rows => rows.length <= 1 ? rows : rows.filter(row => row.id !== id));
  }

  updateStep(id: string, field: keyof UiStep, raw: unknown): void {
    this.resultSteps.update(rows => rows.map(row => row.id === id ? { ...row, [field]: field === 'label' || field === 'type' || field === 'volumeUnit' ? String(raw ?? '') : this.parseNumber(raw) } : row));
  }

  addStep(): void {
    const index = this.resultSteps().length + 1;
    this.resultSteps.update(rows => [...rows, { id: 'step-' + Date.now(), label: 'Bước ' + index, type: 'transfer_all', volume: null, volumeUnit: 'mL', fraction: null, recoveryPercent: null }]);
  }

  removeStep(id: string): void {
    this.resultSteps.update(rows => rows.length <= 1 ? rows : rows.filter(row => row.id !== id));
  }

  async pasteSeriesPoints(): Promise<void> {
    if (!navigator.clipboard?.readText) {
      this.toast.show('Trình duyệt không cho phép đọc clipboard.', 'warning');
      return;
    }
    try {
      const text = await navigator.clipboard.readText();
      const rows = text.split(/\r?\n/).map(line => line.split('\t')).filter(row => row.some(cell => cell.trim()));
      if (!rows.length) {
        this.toast.show('Clipboard đang trống.', 'warning');
        return;
      }
      const defaultSource = this.seriesSources()[0]?.id ?? '';
      this.seriesPoints.set(rows.map((row, index) => ({
        id: 'point-paste-' + Date.now() + '-' + index,
        label: row[0]?.trim() || 'Điểm ' + (index + 1),
        objectType: (['standard', 'blank', 'qc', 'sample'] as string[]).includes(row[5]?.trim() ?? '') ? row[5].trim() as SeriesObjectType : 'standard',
        targetConcentration: this.parseClipboardNumber(row[1]),
        targetChoice: this.concentrationOptions.find(option => option.label.toLowerCase() === (row[2]?.trim() ?? '').toLowerCase() || option.key === row[2]?.trim())?.key ?? 'ppm_mg_l',
        finalVolume: this.parseClipboardNumber(row[3]) ?? 10,
        finalVolumeUnit: row[4]?.trim() || 'mL',
        sourceId: row[6]?.trim() || defaultSource,
        actualSourceVolume: null
      })));
      this.toast.show('Đã nạp ' + rows.length + ' dòng điểm từ clipboard.', 'success');
    } catch {
      this.toast.show('Không đọc được clipboard.', 'error');
    }
  }

  formatNum(value: number | null | undefined, decimals = 4): string {
    if (value === null || value === undefined || !Number.isFinite(value)) return '—';
    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: decimals }).format(value);
  }

  displayQuantity(quantity: QuantityResult): string {
    return this.formatNum(quantity.displayValue, quantity.displayUnit === 'mg' || quantity.displayUnit === 'µL' ? 2 : 4) + ' ' + quantity.displayUnit;
  }

  displayVolume(valueMl: number): string {
    return this.displayQuantity({ canonicalValue: valueMl, canonicalUnit: 'mL', displayValue: valueMl < 1 ? valueMl * 1000 : valueMl >= 1000 ? valueMl / 1000 : valueMl, displayUnit: valueMl < 1 ? 'µL' : valueMl >= 1000 ? 'L' : 'mL' });
  }

  displayConcentration(valueGPerL: number, unit = 'g/L'): string {
    const lower = unit.toLowerCase();
    if (lower.includes('ppm')) return this.formatNum(valueGPerL * 1000, 6) + ' ppm';
    if (lower.includes('ppb')) return this.formatNum(valueGPerL * 1000000, 6) + ' ppb';
    if (lower === 'mg/ml' || lower === 'mg/mL'.toLowerCase()) return this.formatNum(valueGPerL, 6) + ' mg/mL';
    if (lower === 'mg/l') return this.formatNum(valueGPerL * 1000, 6) + ' mg/L';
    return this.formatNum(valueGPerL, 6) + ' g/L';
  }

  issueClass(issue: CalculationIssue): string {
    return issue.severity === 'error'
      ? 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-200'
      : issue.severity === 'warning'
        ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200'
        : 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900/50 dark:bg-sky-950/30 dark:text-sky-200';
  }

  statusLabel(): string {
    const status = this.calculation().status;
    return status === 'valid' ? 'Kế hoạch có thể xem xét' : status === 'invalid' ? 'Cần kiểm tra đầu vào' : 'Đang chờ dữ liệu';
  }

  statusClass(): string {
    const status = this.calculation().status;
    return status === 'valid'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200'
      : status === 'invalid'
        ? 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200'
        : 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200';
  }

  resetDraft(): void {
    this.calcMode.set('concentration');
    this.showTrace.set(false);
    this.concentrationSourceType.set('solid');
    this.concentrationName.set('Chất chuẩn thủ công');
    this.concentrationPlannedValue.set(10.2);
    this.concentrationActualValue.set(null);
    this.concentrationQuantityUnit.set('mg');
    this.concentrationPotency.set(98.5);
    this.concentrationConversionFactor.set(1);
    this.concentrationFinalVolume.set(10);
    this.concentrationFinalVolumeUnit.set('mL');
    this.concentrationSourceValue.set(1000);
    this.concentrationSourceChoice.set('ppm_mg_l');
    this.concentrationTargetValue.set(null);
    this.concentrationMolecularWeight.set(null);
    this.concentrationDensity.set(null);
    this.targetSourceType.set('solution');
    this.targetValue.set(10);
    this.targetChoice.set('ppm_mg_l');
    this.targetFinalVolume.set(10);
    this.targetSourceValue.set(1000);
    this.targetActualValue.set(null);
    this.spikeMatrix.set('solid');
    this.spikeSemantic.set('added_on_initial');
    this.spikeSampleValue.set(5);
    this.spikeSampleUnit.set('g');
    this.spikeStandardValue.set(10);
    this.spikeStandardChoice.set('mg_l');
    this.spikeTargetValue.set(0.05);
    this.spikeTargetChoice.set('mg_kg');
    this.spikeInitialValue.set(null);
    this.seriesStrategy.set('multi_intermediate');
    this.seriesResidualPercent.set(10);
    this.resultSampleBase.set('mass');
    this.resultSampleValue.set(10);
    this.resultInstrumentValue.set(1);
    this.resultUnit.set('mg/kg');
    this.toast.show('Đã đặt lại bản nháp cục bộ.', 'success');
  }

  resultText(): string {
    const result = this.calculation();
    const lines = [this.outputText(result.output), '', 'CÔNG THỨC / PHÉP THẾ'];
    lines.push(...(result.trace.length ? result.trace.flatMap(step => [step.label + ': ' + step.expression, step.substitution ? '  Thế số: ' + step.substitution : '']) : ['Chưa có trace.']));
    if (result.issues.length) {
      lines.push('', 'CẢNH BÁO');
      lines.push(...result.issues.map(issue => '- ' + issue.message + (issue.suggestedAction ? ' ' + issue.suggestedAction : '')));
    }
    lines.push('', 'Bản nháp cục bộ; không đọc/ghi Kho hoặc Chất chuẩn; không tạo giao dịch.');
    return lines.filter(Boolean).join('\n');
  }

  async copyResult(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.resultText());
      this.toast.show('Đã sao chép phiếu tính cục bộ.', 'success');
    } catch {
      this.toast.show('Không thể sao chép kết quả.', 'error');
    }
  }

  exportSimulation(): void {
    const blob = new Blob([this.resultText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'prep-calculation.txt';
    link.click();
    URL.revokeObjectURL(url);
    this.toast.show('Đã xuất snapshot phiếu tính dạng TXT.', 'success');
  }

  printSimulation(): void {
    const frame = document.createElement('iframe');
    frame.style.position = 'fixed';
    frame.style.width = '0';
    frame.style.height = '0';
    frame.style.border = '0';
    document.body.appendChild(frame);
    const printDocument = frame.contentDocument;
    if (!printDocument) {
      frame.remove();
      this.toast.show('Không mở được bản in.', 'error');
      return;
    }
    printDocument.open();
    printDocument.write('<!doctype html><html><head><title>Trạm Pha Chế</title><style>body{font-family:Arial,sans-serif;padding:32px;color:#172033}h1{margin:0 0 4px}.result{white-space:pre-wrap;border:1px solid #cbd5e1;border-radius:12px;padding:20px;line-height:1.6}small{color:#64748b}</style></head><body><h1>Trạm Pha Chế</h1><div class="result">' + this.escapeHtml(this.resultText()) + '</div><small>Bản nháp cục bộ - không tạo giao dịch.</small></body></html>');
    printDocument.close();
    window.setTimeout(() => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
      frame.remove();
    }, 100);
  }

  private buildDraft(): PrepDraft {
    switch (this.calcMode()) {
      case 'concentration':
        return {
          mode: 'concentration',
          sourceType: this.concentrationSourceType(),
          substance: {
            name: this.concentrationName(),
            potencyPercent: this.concentrationPotency(),
            conversionFactor: this.concentrationConversionFactor(),
            molecularWeight: this.concentrationMolecularWeight(),
            densityGPerMl: this.concentrationDensity()
          },
          plannedQuantity: this.makeQuantity(this.concentrationPlannedValue(), this.concentrationQuantityUnit(), this.concentrationSourceType() === 'solid' ? 'mass' : 'volume'),
          actualQuantity: this.makeQuantity(this.concentrationActualValue(), this.concentrationQuantityUnit(), this.concentrationSourceType() === 'solid' ? 'mass' : 'volume'),
          finalVolume: this.makeQuantity(this.concentrationFinalVolume(), this.concentrationFinalVolumeUnit(), 'volume'),
          sourceConcentration: this.concentrationSourceType() === 'solid' ? null : this.makeConcentration(this.concentrationSourceValue(), this.concentrationSourceChoice(), this.concentrationMolecularWeight(), this.concentrationDensity()),
          targetConcentration: this.concentrationTargetValue() === null ? null : this.makeConcentration(this.concentrationTargetValue(), this.concentrationTargetChoice(), this.concentrationMolecularWeight(), this.concentrationDensity())
        };
      case 'target':
        return {
          mode: 'target',
          sourceType: this.targetSourceType(),
          substance: {
            name: this.targetName(),
            potencyPercent: this.targetPotency(),
            conversionFactor: this.targetConversionFactor(),
            molecularWeight: this.targetMolecularWeight(),
            densityGPerMl: this.targetDensity()
          },
          targetConcentration: this.makeConcentration(this.targetValue(), this.targetChoice(), this.targetMolecularWeight(), this.targetDensity()),
          finalVolume: this.makeQuantity(this.targetFinalVolume(), this.targetFinalVolumeUnit(), 'volume'),
          sourceConcentration: this.targetSourceType() === 'solid' ? null : this.makeConcentration(this.targetSourceValue(), this.targetSourceChoice(), this.targetMolecularWeight(), this.targetDensity()),
          actualQuantity: this.makeQuantity(this.targetActualValue(), this.targetQuantityUnit(), this.targetSourceType() === 'solid' ? 'mass' : 'volume')
        };
      case 'spike':
        return {
          mode: 'spike',
          matrix: this.spikeMatrix(),
          location: this.spikeLocation(),
          semantic: this.spikeSemantic(),
          standardName: this.spikeStandardName(),
          sampleName: this.spikeSampleName(),
          standard: this.makeConcentration(this.spikeStandardValue(), this.spikeStandardChoice(), this.spikeMolecularWeight(), this.spikeDensity()),
          target: this.makeConcentration(this.spikeTargetValue(), this.spikeTargetChoice(), this.spikeMolecularWeight(), this.spikeDensity()),
          sampleQuantity: this.makeQuantity(this.spikeSampleValue(), this.spikeSampleUnit(), this.spikeMatrix() === 'solid' ? 'mass' : 'volume'),
          initialConcentration: this.spikeInitialValue() === null ? null : this.makeConcentration(this.spikeInitialValue(), this.spikeInitialChoice(), this.spikeMolecularWeight(), this.spikeDensity())
        };
      case 'series':
        return {
          mode: 'series',
          strategy: this.seriesStrategy(),
          finalVolume: this.makeQuantity(this.seriesFinalVolume(), this.seriesFinalVolumeUnit(), 'volume'),
          residualPercent: this.seriesResidualPercent(),
          sources: this.seriesSources().map(source => ({ id: source.id, name: source.name, concentration: this.makeConcentration(source.concentration, source.concentrationChoice), preparedVolume: this.makeQuantity(source.preparedVolume, source.preparedVolumeUnit, 'volume'), sourceId: source.sourceId || null, actualSourceQuantity: this.makeQuantity(source.actualSourceVolume, source.preparedVolumeUnit, 'volume') })),
          points: this.seriesPoints().map(point => ({ id: point.id, label: point.label, objectType: point.objectType, targetConcentration: this.makeConcentration(point.targetConcentration, point.targetChoice), finalVolume: this.makeQuantity(point.finalVolume, point.finalVolumeUnit, 'volume'), sourceId: point.sourceId, actualSourceQuantity: this.makeQuantity(point.actualSourceVolume, point.finalVolumeUnit, 'volume') })),
          components: this.seriesComponents().map(component => ({ id: component.id, name: component.name, sourceId: component.sourceId, targetConcentration: this.makeConcentration(component.targetConcentration, component.targetChoice) })),
          additions: this.seriesAdditions().map(addition => this.toAdditionDraft(addition))
        };
      case 'result_conversion':
        return {
          mode: 'result_conversion',
          sampleName: this.resultSampleName(),
          sampleBase: this.resultSampleBase(),
          sampleAmount: this.makeQuantity(this.resultSampleValue(), this.resultSampleUnit(), this.resultSampleBase() === 'mass' ? 'mass' : 'volume'),
          instrument: this.makeConcentration(this.resultInstrumentValue(), this.resultInstrumentChoice()),
          resultUnit: this.resultUnit(),
          steps: this.resultSteps().map(step => ({ id: step.id, label: step.label, type: step.type, volume: this.makeQuantity(step.volume, step.volumeUnit, 'volume'), fraction: step.fraction, recoveryPercent: step.recoveryPercent }))
        };
    }
  }

  private toAdditionDraft(addition: UiAddition): AdditionDraft {
    const applicationScope: SeriesObjectType[] = [];
    const exceptions: SeriesObjectType[] = [];
    if (addition.standard) applicationScope.push('standard');
    if (addition.blank) applicationScope.push('blank');
    if (addition.qc) applicationScope.push('qc');
    if (addition.sample) applicationScope.push('sample');
    if (addition.exceptionStandard) exceptions.push('standard');
    if (addition.exceptionBlank) exceptions.push('blank');
    if (addition.exceptionQc) exceptions.push('qc');
    if (addition.exceptionSample) exceptions.push('sample');
    return {
      id: addition.id,
      type: addition.type,
      name: addition.name,
      sourceId: addition.sourceId || null,
      source: this.makeConcentration(addition.sourceConcentration, addition.sourceChoice),
      applicationScope,
      exceptions,
      fixedVolume: this.makeQuantity(addition.fixedVolume, addition.fixedVolumeUnit, 'volume'),
      targetLevel: addition.targetLevel === null ? null : this.makeConcentration(addition.targetLevel, addition.targetChoice),
      includeInFinalVolume: addition.includeInFinalVolume
    };
  }

  private outputText(output: PrepOutput | null): string {
    if (!output) return 'Chưa có kết quả. Vui lòng kiểm tra đầu vào và cảnh báo.';
    switch (output.kind) {
      case 'concentration':
        return ['Tác vụ: Tính nồng độ đã pha', 'Nguồn: ' + output.name, 'Nồng độ thực tế: ' + this.displayConcentration(output.actualConcentration.massPerVolumeGPerL), ...output.actualConcentration.alternatives.map(item => this.formatNum(item.value, 8) + ' ' + item.unit), 'Hướng dẫn: ' + output.operation].join('\n');
      case 'target':
        return ['Tác vụ: Tính lượng cần lấy', 'Nguồn: ' + output.name, 'Lượng kế hoạch: ' + this.displayQuantity(output.plannedQuantity), 'Hướng dẫn: ' + output.operation, output.actualConcentration ? 'Nồng độ thực tế: ' + this.displayConcentration(output.actualConcentration.massPerVolumeGPerL) : ''].filter(Boolean).join('\n');
      case 'spike':
        return ['Tác vụ: Tính chuẩn thêm vào mẫu', 'Mẫu: ' + output.sampleName, 'Thể tích chuẩn: ' + this.displayVolume(output.spikeVolumeMl), 'Hướng dẫn: ' + output.operation].join('\n');
      case 'series':
        return ['Tác vụ: Lập dãy chuẩn/QC', ...output.intermediateRows.map(row => row.name + ': ' + this.displayConcentration(row.concentrationGPerL) + ' · pha ' + this.displayVolume(row.preparedVolumeMl)), ...output.pointRows.map(row => row.label + ': từ ' + row.sourceId + ' · ' + this.displayVolume(row.sourceVolumeMl)), ...output.additionRows.map(row => row.pointLabel + ': thêm ' + this.displayVolume(row.volumeMl) + ' ' + row.name), ...output.sourceDemand.map(row => 'Nhu cầu ' + row.name + ': ' + this.displayVolume(row.requiredWithResidualMl))].join('\n');
      case 'result_conversion':
        return ['Tác vụ: Quy đổi kết quả xử lý mẫu', 'Mẫu: ' + output.sampleName, 'Hệ số giữ lại tích lũy: ' + this.formatNum(output.overallRetentionFraction, 8), 'Kết quả mẫu ban đầu: ' + this.formatNum(output.resultValue, 8) + ' ' + output.resultUnit, 'Hướng dẫn: ' + output.operation].join('\n');
    }
  }

  private parseNumber(raw: unknown): number | null {
    if (raw === null || raw === undefined || String(raw).trim() === '') return null;
    const value = Number(String(raw).replace(',', '.'));
    return Number.isFinite(value) ? value : null;
  }

  private parseClipboardNumber(value: string | undefined): number | null {
    return value ? this.parseNumber(value) : null;
  }

  private escapeHtml(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }
}
