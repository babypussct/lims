import { CommonModule } from '@angular/common';
import { Component, WritableSignal, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';
import { AppButtonComponent } from '../../shared/components/ui/button/button.component';
import { AppPageHeaderComponent } from '../../shared/components/ui/page-header/page-header.component';
import { PREP_SUBSTANCE_GROUPS, PREP_SUBSTANCE_LIBRARY, PrepSubstanceOption, formulaSubstanceOption, matchesSubstanceSearch } from './prep-substance-catalog';
import type { LabReagentGroupId } from './prep-substance-data';
import { formulaSpeciesFactor, parseChemicalFormula } from './chemical-formula';
import { PRESET_CHEMICALS, calculatePrep, calculateSaltHydrateFactor as calculateSaltHydrateFactorEngine, concentrationToGPerL } from './prep-calculation.engine';
import {
  AdditionDraft,
  ConcentrationDraft,
  ConcentrationSnapshot,
  CalculationIssue,
  PrepCalculationResult,
  PrepDraft,
  PrepMode,
  PrepOutput,
  PrepSourceType,
  PipetteSuggestion,
  QuickChemicalPreset,
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
type ConcentrationContext = 'solution' | 'sample_mass' | 'sample_volume' | 'all';
type QuickSeriesApplyMode = 'append' | 'replace';

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

interface ConcentrationEquivalenceGroup {
  tokens: readonly string[];
  message: string;
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
  dosing: 'volume' | 'concentration';
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
  { key: 'ppt_ng_l', unit: 'ppt', basis: 'mass_per_volume', label: 'ppt (ng/L)' },
  { key: 'mg_ml', unit: 'mg/mL', basis: 'mass_per_volume', label: 'mg/mL' },
  { key: 'mg_l', unit: 'mg/L', basis: 'mass_per_volume', label: 'mg/L' },
  { key: 'ug_ml', unit: 'µg/mL', basis: 'mass_per_volume', label: 'µg/mL' },
  { key: 'ug_l', unit: 'µg/L', basis: 'mass_per_volume', label: 'µg/L' },
  { key: 'ng_ml', unit: 'ng/mL', basis: 'mass_per_volume', label: 'ng/mL' },
  { key: 'ng_l', unit: 'ng/L', basis: 'mass_per_volume', label: 'ng/L' },
  { key: 'ppm_mg_kg', unit: 'ppm', basis: 'mass_per_mass', label: 'ppm (mg/kg)' },
  { key: 'ppb_ug_kg', unit: 'ppb', basis: 'mass_per_mass', label: 'ppb (µg/kg)' },
  { key: 'ppt_ng_kg', unit: 'ppt', basis: 'mass_per_mass', label: 'ppt (ng/kg)' },
  { key: 'mg_kg', unit: 'mg/kg', basis: 'mass_per_mass', label: 'mg/kg' },
  { key: 'ug_kg', unit: 'µg/kg', basis: 'mass_per_mass', label: 'µg/kg' },
  { key: 'ng_kg', unit: 'ng/kg', basis: 'mass_per_mass', label: 'ng/kg' },
  { key: 'g_l', unit: 'g/L', basis: 'mass_per_volume', label: 'g/L' },
  { key: 'molar_m', unit: 'M', basis: 'molar', label: 'M (mol/L)' },
  { key: 'molar_mm', unit: 'mM', basis: 'molar', label: 'mM (mmol/L)' },
  { key: 'molar_um', unit: 'µM', basis: 'molar', label: 'µM (µmol/L)' },
  { key: 'percent_ww', unit: '% w/w', basis: 'mass_fraction', label: '% w/w' },
  { key: 'percent_wv', unit: '% w/v', basis: 'mass_per_volume', label: '% w/v' },
  { key: 'percent_vv', unit: '% v/v', basis: 'volume_per_volume', label: '% v/v' }
];

const CONCENTRATION_EQUIVALENCE_GROUPS: readonly ConcentrationEquivalenceGroup[] = [
  {
    tokens: ['g_l', 'g/L', 'mg_ml', 'mg/mL'],
    message: 'Nhắc: g/L và mg/mL là hai cách ghi có cùng giá trị số trong cơ sở khối lượng/thể tích; chọn theo cách ghi của SOP.'
  },
  {
    tokens: ['ppm_mg_l', 'ppm (mg/L)', 'mg_l', 'mg/L', 'ug_ml', 'µg/mL'],
    message: 'Nhắc: ppm (mg/L), mg/L và µg/mL là các cách ghi có cùng giá trị số trong cơ sở khối lượng/thể tích; ppm không mặc định bằng mg/L ở mọi cơ sở.'
  },
  {
    tokens: ['ppb_ug_l', 'ppb (µg/L)', 'ug_l', 'µg/L', 'ng_ml', 'ng/mL'],
    message: 'Nhắc: ppb (µg/L), µg/L và ng/mL là các cách ghi có cùng giá trị số trong cơ sở khối lượng/thể tích; ppb cần giữ đúng cơ sở /L.'
  },
  {
    tokens: ['ppt_ng_l', 'ppt (ng/L)', 'ng_l', 'ng/L'],
    message: 'Nhắc: ppt (ng/L) và ng/L là hai cách ghi có cùng giá trị số trong cơ sở khối lượng/thể tích; cơ sở vẫn là /L.'
  },
  {
    tokens: ['ppm_mg_kg', 'ppm (mg/kg)', 'mg_kg', 'mg/kg'],
    message: 'Nhắc: ppm (mg/kg) và mg/kg là hai cách ghi có cùng giá trị số trong cơ sở khối lượng/khối lượng; không tự đổi sang mg/L.'
  },
  {
    tokens: ['ppb_ug_kg', 'ppb (µg/kg)', 'ug_kg', 'µg/kg'],
    message: 'Nhắc: ppb (µg/kg) và µg/kg là hai cách ghi có cùng giá trị số trong cơ sở khối lượng/khối lượng; giữ đúng cơ sở /kg.'
  },
  {
    tokens: ['ppt_ng_kg', 'ppt (ng/kg)', 'ng_kg', 'ng/kg'],
    message: 'Nhắc: ppt (ng/kg) và ng/kg là hai cách ghi có cùng giá trị số trong cơ sở khối lượng/khối lượng; giữ đúng cơ sở /kg.'
  }
];

const VOLUME_OPTIONS = [
  { unit: 'µL', label: 'µL' },
  { unit: 'mL', label: 'mL' }
];

const MASS_OPTIONS = [
  { unit: 'mg', label: 'mg' },
  { unit: 'g', label: 'g' }
];

const TASKS: readonly TaskDefinition[] = [
  {
    id: 'target',
    label: 'Pha nồng độ đích',
    question: 'Cần cân hoặc hút lượng bao nhiêu để chuẩn bị dung dịch?',
    description: 'Xác định lượng chất rắn, dung dịch nguồn hoặc hóa chất đậm đặc cần sử dụng.',
    icon: 'fa-bullseye',
    activeClass: 'border-cyan-500 bg-cyan-600 text-white shadow-lg shadow-cyan-200 dark:shadow-none'
  },
  {
    id: 'concentration',
    label: 'Nồng độ thực tế',
    question: 'Dung dịch cần xác định có nồng độ bao nhiêu?',
    description: 'Từ lượng chất hoặc dung dịch đã sử dụng, độ tinh khiết/hàm lượng công bố và thể tích định mức.',
    icon: 'fa-flask-vial',
    activeClass: 'border-fuchsia-500 bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-200 dark:shadow-none'
  },
  {
    id: 'series',
    label: 'Dãy chuẩn & QC',
    question: 'Cần chuẩn bị dung dịch nguồn, điểm chuẩn, QC và nội chuẩn theo trình tự nào?',
    description: 'Chọn chuẩn gốc, nhập dãy nồng độ và thể tích bình để tính lượng hút từng điểm.',
    icon: 'fa-diagram-project',
    activeClass: 'border-violet-500 bg-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-none'
  },
  {
    id: 'spike',
    label: 'Thêm chuẩn',
    question: 'Cần thêm bao nhiêu dung dịch chuẩn vào mẫu?',
    description: 'Xác định lượng dung dịch chuẩn và vị trí áp dụng trên mẫu ban đầu hoặc thể tích cuối.',
    icon: 'fa-vial',
    activeClass: 'border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-200 dark:shadow-none'
  },
  {
    id: 'result_conversion',
    label: 'Quy đổi kết quả',
    question: 'Kết quả đo được quy đổi về mẫu ban đầu như thế nào?',
    description: 'Quy về mẫu ban đầu từ kết quả máy, thể tích định mức, hệ số pha loãng và độ thu hồi.',
    icon: 'fa-route',
    activeClass: 'border-rose-500 bg-rose-600 text-white shadow-lg shadow-rose-200 dark:shadow-none'
  }
];

@Component({
  selector: 'app-smart-prep',
  standalone: true,
  imports: [CommonModule, FormsModule, AppButtonComponent, AppPageHeaderComponent],
  templateUrl: './smart-prep.component.html',
  styles: [
    ".field-label{display:block;margin-bottom:.45rem;font-size:.8rem;font-weight:600;color:#64748b}.field-input{width:100%;min-width:0;border:1px solid #cbd5e1;border-radius:.75rem;background:#fff;padding:.62rem .72rem;font-size:.875rem;outline:0;transition:border-color .15s,box-shadow .15s}.field-input.unit-input{width:9rem;flex-shrink:0}details>summary{cursor:pointer;font-weight:600;font-size:.875rem}details[open]>summary{margin-bottom:1rem}details:focus-within{border-color:#94a3b8}.field-input:focus{border-color:#cb0c9f;box-shadow:0 0 0 3px rgba(203,12,159,.12)}.field-help{display:block;margin-top:.35rem;font-size:.75rem;line-height:1.5;color:#64748b}.result-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.5rem}.result-grid>div{border-radius:.75rem;background:#f8fafc;padding:.75rem}.result-grid>div>span:first-child{display:block;font-size:.625rem;font-weight:700;color:#94a3b8}.result-grid strong{display:block;margin-top:.25rem;font-size:.8rem;line-height:1.35}:host-context(.dark) .field-label{color:#94a3b8}:host-context(.dark) .field-input{border-color:#334155;background:#0f172a;color:#e2e8f0}:host-context(.dark) .field-help{color:#94a3b8}:host-context(.dark) .result-grid>div{background:rgba(30,41,59,.7)}"
  ]
})
export class SmartPrepComponent {
  private readonly toast = inject(ToastService);
  readonly substanceQuery = signal('');
  readonly substanceGroup = signal<LabReagentGroupId | 'all'>('all');
  readonly substanceGroups = PREP_SUBSTANCE_GROUPS;
  readonly substanceLibraryCount = PREP_SUBSTANCE_LIBRARY.length;
  readonly sourceParametersOpen = signal(false);
  readonly targetFormula = signal('');
  readonly concentrationFormula = signal('');
  readonly targetSpecies = signal('');
  readonly concentrationSpecies = signal('');
  readonly targetSourceNote = signal('');
  readonly concentrationSourceNote = signal('');
  readonly spikeSourceNote = signal('');
  readonly seriesSourceNote = signal('');
  readonly substanceOptions = computed(() => {
    const query = this.substanceQuery();
    const group = this.substanceGroup();
    const library = PREP_SUBSTANCE_LIBRARY.filter(item =>
      (group === 'all' || item.group === group) && matchesSubstanceSearch(item, query));
    const parsed = formulaSubstanceOption(this.substanceQuery());
    const options = [...library, ...(group === 'all' && parsed && !library.some(item => item.formula === parsed.formula) ? [parsed] : [])];
    return this.calcMode() === 'spike' || this.calcMode() === 'series' ? options.filter(option => option.sourceType !== 'solid') : options;
  });

  readonly tasks = TASKS;
  private readonly allConcentrationOptions = CONCENTRATION_OPTIONS;
  readonly concentrationOptions = CONCENTRATION_OPTIONS.filter(option => option.basis === 'mass_per_volume');
  readonly seriesConcentrationOptions = CONCENTRATION_OPTIONS.filter(option => option.basis !== 'mass_per_mass');
  readonly presetChemicals: readonly QuickChemicalPreset[] = PRESET_CHEMICALS;
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

  readonly calcMode = signal<PrepMode>('target');
  readonly showTrace = signal(false);
  readonly spikeStandardDensity = signal<number | null>(null);
  readonly concentrationTargetDensity = signal<number | null>(null);
  readonly targetSourceDensity = signal<number | null>(null);

  readonly concentrationSourceType = signal<PrepSourceType>('solid');
  readonly concentrationResultChoice = signal('mg_l');
  readonly concentrationResultOptions = CONCENTRATION_OPTIONS.filter(option => option.basis === 'mass_per_volume' || option.basis === 'molar');
  readonly concentrationName = signal('');
  readonly concentrationActualValue = signal<number | null>(null);
  readonly concentrationQuantityUnit = signal('mg');
  readonly concentrationPotency = signal<number | null>(null);
  readonly concentrationConversionFactor = signal<number | null>(1);
  readonly concentrationFinalVolume = signal<number | null>(null);
  readonly concentrationFinalVolumeUnit = signal('mL');
  readonly concentrationSourceValue = signal<number | null>(null);
  readonly concentrationSourceChoice = signal('mg_l');
  readonly concentrationTargetValue = signal<number | null>(null);
  readonly concentrationTargetChoice = signal('mg_l');
  readonly concentrationMolecularWeight = signal<number | null>(null);
  readonly concentrationDensity = signal<number | null>(null);
  readonly concentrationSaltBaseMolarMass = signal<number | null>(null);
  readonly concentrationSaltMolarMass = signal<number | null>(null);
  readonly concentrationSaltStoichiometricCount = signal<number | null>(1);

  readonly targetSourceType = signal<PrepSourceType>('solution');
  readonly targetName = signal('');
  readonly targetValue = signal<number | null>(null);
  readonly targetChoice = signal('mg_l');
  readonly targetFinalVolume = signal<number | null>(null);
  readonly targetFinalVolumeUnit = signal('mL');
  readonly targetPotency = signal<number | null>(null);
  readonly targetConversionFactor = signal<number | null>(1);
  readonly targetMolecularWeight = signal<number | null>(null);
  readonly targetDensity = signal<number | null>(null);
  readonly targetSourceValue = signal<number | null>(null);
  readonly targetSourceChoice = signal('mg_l');
  readonly targetActualValue = signal<number | null>(null);
  readonly targetQuantityUnit = signal('µL');
  readonly targetSaltBaseMolarMass = signal<number | null>(null);
  readonly targetSaltMolarMass = signal<number | null>(null);
  readonly targetSaltStoichiometricCount = signal<number | null>(1);

  readonly spikeMatrix = signal<SpikeMatrix>('solid');
  readonly spikeLocation = signal<SpikeLocation>('sample_initial');
  readonly spikeSemantic = signal<SpikeSemantic>('added_on_initial');
  readonly spikeStandardName = signal('');
  readonly spikeSampleName = signal('');
  readonly spikeSampleValue = signal<number | null>(null);
  readonly spikeSampleUnit = signal('g');
  readonly spikeStandardValue = signal<number | null>(null);
  readonly spikeStandardChoice = signal('mg_l');
  readonly spikeTargetValue = signal<number | null>(null);
  readonly spikeTargetChoice = signal('mg_kg');
  readonly spikeInitialValue = signal<number | null>(null);
  readonly spikeInitialChoice = signal('mg_kg');
  readonly spikeMolecularWeight = signal<number | null>(null);
  readonly spikeDensity = signal<number | null>(null);

  readonly seriesStrategy = signal<SeriesStrategy>('direct');
  readonly seriesFinalVolume = signal<number | null>(null);
  readonly seriesFinalVolumeUnit = signal('mL');
  readonly seriesResidualPercent = signal<number | null>(0);
  readonly seriesSources = signal<UiSeriesSource[]>([
    { id: 'source-root', name: 'Chuẩn gốc', concentration: null, concentrationChoice: 'mg_l', preparedVolume: null, preparedVolumeUnit: 'mL', sourceId: '', actualSourceVolume: null }
  ]);
  readonly seriesPoints = signal<UiSeriesPoint[]>([
    { id: 'point-1', label: 'Chuẩn 1', objectType: 'standard', targetConcentration: null, targetChoice: 'mg_l', finalVolume: null, finalVolumeUnit: 'mL', sourceId: 'source-root', actualSourceVolume: null }
  ]);
  readonly seriesComponents = signal<UiSeriesComponent[]>([
    { id: 'component-1', name: '', sourceId: 'source-root', targetConcentration: null, targetChoice: 'mg_l' }
  ]);
  readonly seriesAdditions = signal<UiAddition[]>([]);
  readonly quickSeriesOpen = signal(true);
  readonly quickSeriesText = signal('');
  readonly quickSeriesVolume = signal<number | null>(10);
  readonly quickSeriesVolumeUnit = signal('mL');
  readonly quickSeriesChoice = signal('mg_l');
  readonly quickSeriesSourceId = signal('source-root');
  readonly quickSeriesApplyMode = signal<QuickSeriesApplyMode>('replace');
  readonly quickSeriesError = signal<string | null>(null);

  readonly resultSampleName = signal('');
  readonly resultSampleBase = signal<SampleBase>('mass');
  readonly resultSampleValue = signal<number | null>(null);
  readonly resultSampleUnit = signal('g');
  readonly resultInstrumentValue = signal<number | null>(null);
  readonly resultInstrumentChoice = signal('mg_l');
  readonly resultUnit = signal<ResultConcentrationUnit>('mg/kg');
  readonly advancedResultSteps = signal(false);
  readonly resultFinalVolume = signal<number | null>(null);
  readonly resultDilutionFactor = signal<number | null>(1);
  readonly resultRecoveryPercent = signal<number | null>(null);
  readonly resultSteps = signal<UiStep[]>([
    { id: 'step-extract', label: 'Chiết và định mức', type: 'extract', volume: null, volumeUnit: 'mL', fraction: null, recoveryPercent: null }
  ]);

  readonly useConcentrationComparison = signal(false);
  readonly useTargetConversion = signal(false);
  readonly useConcentrationConversion = signal(false);
  readonly showSeriesActual = signal(false);

  constructor() {
    this.clearLegacyDraft();
  }

  searchSubstance(raw: string): void {
    this.substanceQuery.set(raw);
  }

  currentSubstanceName(): string {
    switch (this.calcMode()) {
      case 'target': return this.targetName();
      case 'concentration': return this.concentrationName();
      case 'spike': return this.spikeStandardName();
      case 'series': return this.seriesSources()[0]?.name ?? '';
      default: return '';
    }
  }

  currentSourceNote(): string {
    switch (this.calcMode()) {
      case 'target': return this.targetSourceNote();
      case 'concentration': return this.concentrationSourceNote();
      case 'spike': return this.spikeSourceNote();
      case 'series': return this.seriesSourceNote();
      default: return '';
    }
  }

  parameterBadges(): string[] {
    const badges: string[] = [];
    const mode = this.calcMode();
    const mass = mode === 'target' ? this.targetMolecularWeight() : mode === 'concentration' ? this.concentrationMolecularWeight() : mode === 'spike' ? this.spikeMolecularWeight() : null;
    const density = mode === 'target' ? this.targetSourceDensity() : mode === 'concentration' ? this.concentrationDensity() : mode === 'spike' ? this.spikeStandardDensity() : null;
    const purity = mode === 'target' ? this.targetPotency() : mode === 'concentration' ? this.concentrationPotency() : null;
    const source = mode === 'target' ? this.targetSourceValue() : mode === 'concentration' ? this.concentrationSourceValue() : mode === 'spike' ? this.spikeStandardValue() : this.seriesSources()[0]?.concentration ?? null;
    const choice = mode === 'target' ? this.targetSourceChoice() : mode === 'concentration' ? this.concentrationSourceChoice() : mode === 'spike' ? this.spikeStandardChoice() : this.seriesSources()[0]?.concentrationChoice ?? 'mg_l';
    if (mass !== null) badges.push('M = ' + this.formatNum(mass, 3) + ' g/mol');
    if (density !== null) badges.push('d = ' + this.formatNum(density, 3) + ' g/mL');
    if (purity !== null) badges.push('P = ' + this.formatNum(purity, 3) + '%');
    if (source !== null) badges.push('C nguồn = ' + this.formatNum(source, 6) + ' ' + this.concentrationOption(choice).label);
    if ((mode === 'target' && this.targetSourceType() === 'solid') || (mode === 'concentration' && this.concentrationSourceType() === 'solid')) {
      if (purity === null) badges.push('Nhập P% theo CoA');
      const factor = mode === 'target' ? this.useTargetConversion() ? this.targetConversionFactor() : 1 : this.useConcentrationConversion() ? this.concentrationConversionFactor() : 1;
      badges.push('f = ' + this.formatNum(factor, 6));
    }
    if (!badges.length) badges.push('Nhập thông số nguồn');
    return badges;
  }

  private optionChoice(value: ConcentrationDraft | null): string {
    if (!value) return 'mg_l';
    const aliases: Record<string, string> = { 'mol/L': 'M', 'mmol/L': 'mM', 'µmol/L': 'µM' };
    return this.allConcentrationOptions.find(option => option.unit === (aliases[value.unit] ?? value.unit) && option.basis === value.basis)?.key ?? 'mg_l';
  }

  selectSubstance(option: PrepSubstanceOption): void {
    const mode = this.calcMode();
    if ((mode === 'spike' || mode === 'series') && option.sourceType === 'solid') {
      this.toast.show('Chọn dung dịch chuẩn hoặc nhập nồng độ dung dịch đã pha từ chất rắn.', 'warning');
      return;
    }
    this.substanceQuery.set('');
    this.sourceParametersOpen.set(option.sourceType === 'solid' ? option.potencyPercent === null : option.concentration === null);
    const sourceChoice = this.optionChoice(option.concentration);
    if (mode === 'target' || mode === 'concentration') {
      const target = mode === 'target';
      if (target) this.setTargetSourceType(option.sourceType); else this.setConcentrationSourceType(option.sourceType);
      (target ? this.targetName : this.concentrationName).set(option.name);
      (target ? this.targetFormula : this.concentrationFormula).set(option.formula ?? '');
      (target ? this.targetSpecies : this.concentrationSpecies).set('');
      (target ? this.targetSourceNote : this.concentrationSourceNote).set(option.detail);
      (target ? this.targetMolecularWeight : this.concentrationMolecularWeight).set(option.molarMass);
      (target ? this.targetPotency : this.concentrationPotency).set(option.potencyPercent);
      (target ? this.targetSourceValue : this.concentrationSourceValue).set(option.concentration?.value ?? null);
      (target ? this.targetSourceChoice : this.concentrationSourceChoice).set(sourceChoice);
      (target ? this.targetSourceDensity : this.concentrationDensity).set(option.densityGPerMl);
      if (target) this.targetDensity.set(null); else this.concentrationTargetDensity.set(null);
      (target ? this.useTargetConversion : this.useConcentrationConversion).set(false);
      (target ? this.targetConversionFactor : this.concentrationConversionFactor).set(1);
      (target ? this.targetActualValue : this.concentrationActualValue).set(null);
      (target ? this.targetSaltBaseMolarMass : this.concentrationSaltBaseMolarMass).set(null);
      (target ? this.targetSaltMolarMass : this.concentrationSaltMolarMass).set(option.molarMass);
      (target ? this.targetSaltStoichiometricCount : this.concentrationSaltStoichiometricCount).set(1);
    } else if (mode === 'spike') {
      this.spikeStandardName.set(option.name);
      this.spikeSourceNote.set(option.detail);
      this.spikeStandardValue.set(option.concentration?.value ?? null);
      this.spikeStandardChoice.set(sourceChoice);
      this.spikeMolecularWeight.set(option.molarMass);
      this.spikeStandardDensity.set(option.densityGPerMl);
    } else if (mode === 'series') {
      // Series sources use mass/volume units: normalize molar/fraction stocks once at selection.
      const normalized = option.concentration ? concentrationToGPerL({ ...option.concentration, molecularWeight: option.molarMass, densityGPerMl: option.densityGPerMl }, 'source', 'nồng độ nguồn', []) : null;
      this.seriesSources.update(rows => rows.map((row, i) => i === 0 ? { ...row, name: option.name, concentration: normalized !== null ? normalized * 1000 : null, concentrationChoice: 'mg_l', sourceId: '', actualSourceVolume: null } : { ...row, actualSourceVolume: null }));
      this.seriesPoints.update(rows => rows.map(row => ({ ...row, actualSourceVolume: null })));
      this.seriesSourceNote.set(option.detail);
      if (normalized === null) this.sourceParametersOpen.set(true);
    }
  }

  speciesOptions(): string[] {
    const formula = this.calcMode() === 'concentration' ? this.concentrationFormula() : this.targetFormula();
    const parsed = parseChemicalFormula(formula);
    const builtIn = PREP_SUBSTANCE_LIBRARY.find(item => item.formula === formula)?.species ?? [];
    return [...new Set([...builtIn, ...(parsed?.anhydrousFormula ? [parsed.anhydrousFormula] : [])])];
  }

  selectSpecies(species: string): void {
    const target = this.calcMode() === 'target';
    const formula = target ? this.targetFormula() : this.concentrationFormula();
    const salt = parseChemicalFormula(formula);
    const conversion = species ? formulaSpeciesFactor(formula, species) : null;
    if (!salt || (species && !conversion)) return;
    (target ? this.targetSpecies : this.concentrationSpecies).set(species);
    (target ? this.targetConversionFactor : this.concentrationConversionFactor).set(conversion?.factor ?? 1);
    (target ? this.useTargetConversion : this.useConcentrationConversion).set(!!species);
    (target ? this.targetMolecularWeight : this.concentrationMolecularWeight).set(conversion?.molarMass ?? salt.molarMass);
    (target ? this.targetSaltBaseMolarMass : this.concentrationSaltBaseMolarMass).set(conversion?.molarMass ?? null);
    (target ? this.targetSaltMolarMass : this.concentrationSaltMolarMass).set(salt.molarMass);
    (target ? this.targetSaltStoichiometricCount : this.concentrationSaltStoichiometricCount).set(conversion?.count ?? 1);
  }

  needsMolar(...choices: string[]): boolean {
    return choices.some(choice => this.concentrationOption(choice).basis === 'molar');
  }

  needsDensity(...choices: string[]): boolean {
    return choices.some(choice => ['mass_fraction', 'mass_per_mass', 'volume_per_volume'].includes(this.concentrationOption(choice).basis));
  }

  readonly missingInputs = computed(() => this.calculation().issues.filter(issue => issue.code.startsWith('MISSING_')));
  readonly reviewIssues = computed(() => this.calculation().issues.filter(issue => !issue.code.startsWith('MISSING_')));

  readonly canExport = computed(() => this.calculation().status === 'valid' && !!this.calculation().output);

  readonly calculation = computed<PrepCalculationResult<PrepOutput>>(() => {
    const result = calculatePrep(this.buildDraft());
    const required: CalculationIssue[] = [];
    if (this.calcMode() === 'result_conversion' && !this.advancedResultSteps() && !(this.resultDilutionFactor()! >= 1)) {
      required.push({ code: 'INVALID_DILUTION_FACTOR', path: 'dilutionFactor', severity: 'error', message: 'Hệ số pha loãng F phải lớn hơn hoặc bằng 1.' });
    }
    if (this.calcMode() === 'result_conversion' && !this.resultUnit().endsWith(this.resultSampleBase() === 'mass' ? '/kg' : '/L')) {
      required.push({ code: 'INVALID_RESULT_UNIT', path: 'resultUnit', severity: 'error', message: 'Chọn đơn vị /kg cho mẫu rắn hoặc /L cho mẫu lỏng.' });
    }
    if (this.calcMode() === 'spike' && this.spikeSemantic() === 'final_total' && this.spikeInitialValue() === null) {
      required.push({ code: 'MISSING_BACKGROUND', path: 'initialConcentration', severity: 'error', message: 'Nhập nồng độ có sẵn trong mẫu; nhập 0 nếu đã xác định mẫu không có chất phân tích.' });
    }
    if (this.calcMode() === 'concentration' && this.useConcentrationComparison() && this.concentrationTargetValue() === null) {
      required.push({ code: 'MISSING_COMPARISON', path: 'targetConcentration', severity: 'error', message: 'Nhập nồng độ yêu cầu để so sánh.' });
    }
    if (this.calcMode() === 'concentration' && this.needsMolar(this.concentrationResultChoice()) && !(this.concentrationMolecularWeight()! > 0)) {
      required.push({ code: 'MISSING_MOLAR_MASS', path: 'substance.molecularWeight', severity: 'error', message: 'Nhập khối lượng mol lớn hơn 0 để tính nồng độ mol/L.' });
    }
    return required.length ? { ...result, status: required.some(issue => issue.code.startsWith('INVALID_')) ? 'invalid' : 'incomplete', output: null, issues: [...result.issues, ...required] } : result;
  });

  getTask(id: PrepMode): TaskDefinition {
    return TASKS.find(task => task.id === id) ?? this.tasks[0];
  }

  setCalcMode(mode: PrepMode): void {
    this.substanceQuery.set('');
    this.substanceGroup.set('all');
    this.sourceParametersOpen.set(false);
    this.calcMode.set(mode);
    this.showTrace.set(false);
  }

  setConcentrationSourceType(raw: unknown): void {
    const sourceType = this.validSourceType(raw);
    if (sourceType !== this.concentrationSourceType()) {
      this.concentrationActualValue.set(null);
      this.concentrationSourceValue.set(null);
      this.concentrationDensity.set(null);
      this.concentrationFormula.set('');
      this.concentrationSpecies.set('');
      this.concentrationSourceNote.set('');
      this.concentrationMolecularWeight.set(null);
      this.concentrationPotency.set(null);
      this.useConcentrationConversion.set(false);
      this.concentrationConversionFactor.set(1);
    }
    this.concentrationSourceType.set(sourceType);
    this.keepDimensionUnit(this.concentrationQuantityUnit, sourceType === 'solid' ? 'mass' : 'volume', sourceType === 'solid' ? 'mg' : 'µL');
  }

  setTargetSourceType(raw: unknown): void {
    const sourceType = this.validSourceType(raw);
    if (sourceType !== this.targetSourceType()) {
      this.targetActualValue.set(null);
      this.targetSourceValue.set(null);
      this.targetDensity.set(null);
      this.targetSourceDensity.set(null);
      this.targetFormula.set('');
      this.targetSpecies.set('');
      this.targetSourceNote.set('');
      this.targetMolecularWeight.set(null);
      this.targetPotency.set(null);
      this.useTargetConversion.set(false);
      this.targetConversionFactor.set(1);
    }
    this.targetSourceType.set(sourceType);
    this.keepDimensionUnit(this.targetQuantityUnit, sourceType === 'solid' ? 'mass' : 'volume', sourceType === 'solid' ? 'mg' : 'µL');
  }

  setResultSampleBase(raw: unknown): void {
    const sampleBase: SampleBase = raw === 'volume' ? 'volume' : 'mass';
    this.resultSampleBase.set(sampleBase);
    this.keepDimensionUnit(this.resultSampleUnit, sampleBase === 'mass' ? 'mass' : 'volume', sampleBase === 'mass' ? 'g' : 'mL');
    this.resultUnit.set(this.resultUnit().startsWith('µg') ? sampleBase === 'mass' ? 'µg/kg' : 'µg/L' : sampleBase === 'mass' ? 'mg/kg' : 'mg/L');
  }

  concentrationOption(key: string): ConcentrationOption {
    return this.allConcentrationOptions.find(option => option.key === key) ?? this.allConcentrationOptions[0];
  }

  concentrationTooltip(token: string): string | null {
    return CONCENTRATION_EQUIVALENCE_GROUPS.find(group => group.tokens.includes(token))?.message ?? null;
  }

  sourceDisplayName(id: string | null | undefined): string {
    const token = String(id ?? '').trim();
    if (!token) return 'Nguồn do người thực hiện khai báo';
    const source = this.seriesSources().find(row => row.id === token);
    if (source) return source.name.trim() || 'Nguồn chưa có tên';
    const point = this.seriesPoints().find(row => row.id === token);
    return point ? point.label.trim() || 'Điểm chuẩn chưa có tên' : 'Nguồn chưa xác định';
  }

  sourceTooltip(id: string | null | undefined): string {
    const token = String(id ?? '').trim();
    if (!token) return 'Nguồn khai báo trực tiếp; chưa gắn mã nguồn.';
    const label = this.sourceDisplayName(token);
    return 'Nguồn sử dụng: ' + label;
  }

  concentrationOptionsFor(context: ConcentrationContext): readonly ConcentrationOption[] {
    if (context === 'all') return this.allConcentrationOptions;
    const options = this.allConcentrationOptions;
    if (context === 'sample_mass') {
      return options.filter(option => option.basis === 'mass_per_mass');
    }
    if (context === 'sample_volume') {
      return options.filter(option => option.basis === 'mass_per_volume' || option.basis === 'molar' || option.basis === 'volume_per_volume');
    }
    return options.filter(option => option.basis !== 'mass_per_mass');
  }

  sampleConcentrationOptions(): readonly ConcentrationOption[] {
    return this.spikeMatrix() === 'solid'
      ? this.concentrationOptionsFor('sample_mass')
      : this.concentrationOptionsFor('sample_volume');
  }

  setSpikeMatrix(raw: unknown): void {
    const matrix = (['solid', 'liquid', 'extract', 'vial'] as SpikeMatrix[]).includes(raw as SpikeMatrix)
      ? raw as SpikeMatrix
      : 'solid';
    this.spikeMatrix.set(matrix);
    this.keepDimensionUnit(this.spikeSampleUnit, matrix === 'solid' ? 'mass' : 'volume', matrix === 'solid' ? 'g' : 'mL');
    const context: ConcentrationContext = matrix === 'solid' ? 'sample_mass' : 'sample_volume';
    this.spikeTargetChoice.set(this.compatibleChoice(this.spikeTargetChoice(), context));
    this.spikeInitialChoice.set(this.compatibleChoice(this.spikeInitialChoice(), context));
  }

  private compatibleChoice(choice: string, context: ConcentrationContext): string {
    const options = this.concentrationOptionsFor(context);
    if (options.some(option => option.key === choice)) return choice;
    const pairedChoices: Record<string, string> = {
      ppm_mg_l: 'ppm_mg_kg',
      ppb_ug_l: 'ppb_ug_kg',
      ppt_ng_l: 'ppt_ng_kg',
      mg_l: 'mg_kg',
      ug_l: 'ug_kg',
      ng_l: 'ng_kg',
      ppm_mg_kg: 'ppm_mg_l',
      ppb_ug_kg: 'ppb_ug_l',
      ppt_ng_kg: 'ppt_ng_l',
      mg_kg: 'mg_l',
      ug_kg: 'ug_l',
      ng_kg: 'ng_l'
    };
    const paired = pairedChoices[choice];
    if (paired && options.some(option => option.key === paired)) return paired;
    return options.find(option => option.key === (context === 'sample_mass' ? 'ppm_mg_kg' : 'ppm_mg_l'))?.key
      ?? options[0]?.key
      ?? 'ppm_mg_l';
  }

  private validSourceType(raw: unknown): PrepSourceType {
    return (['solid', 'solution', 'concentrate'] as PrepSourceType[]).includes(raw as PrepSourceType)
      ? raw as PrepSourceType
      : 'solid';
  }

  private keepDimensionUnit(target: WritableSignal<string>, dimension: 'mass' | 'volume', preferredUnit: string): void {
    const options = dimension === 'mass' ? this.massOptions : this.volumeOptions;
    if (!options.some(option => option.unit === target())) target.set(preferredUnit);
  }

  makeConcentration(value: number | null, choiceKey: string, molecularWeight: number | null = null, densityGPerMl: number | null = null): ConcentrationDraft {
    const option = this.concentrationOption(choiceKey);
    return { value, unit: option.unit, basis: option.basis, molecularWeight: this.needsMolar(choiceKey) ? molecularWeight : null, densityGPerMl: this.needsDensity(choiceKey) ? densityGPerMl : null };
  }

  makeQuantity(value: number | null, unit: string, dimension: QuantityDraft['dimension']): QuantityDraft {
    return { value, unit, dimension };
  }

  setNumeric(target: NumericSignal, raw: unknown): void {
    target.set(this.parseNumber(raw));
  }

  applyPresetChemical(presetId: string, mode: 'target' | 'concentration' = this.calcMode() === 'concentration' ? 'concentration' : 'target'): void {
    const option = PREP_SUBSTANCE_LIBRARY.find(item => item.id === presetId);
    if (!option) return;
    this.calcMode.set(mode);
    this.selectSubstance(option);
  }

  saltHydrateFactor(baseMolarMass: number | null, saltMolarMass: number | null, stoichiometricCount: number | null): number | null {
    if (baseMolarMass === null || saltMolarMass === null || stoichiometricCount === null) return null;
    return calculateSaltHydrateFactorEngine(baseMolarMass, saltMolarMass, stoichiometricCount);
  }

  targetSaltFactor(): number | null {
    return this.saltHydrateFactor(this.targetSaltBaseMolarMass(), this.targetSaltMolarMass(), this.targetSaltStoichiometricCount());
  }

  concentrationSaltFactor(): number | null {
    return this.saltHydrateFactor(this.concentrationSaltBaseMolarMass(), this.concentrationSaltMolarMass(), this.concentrationSaltStoichiometricCount());
  }

  saltFactorStatus(baseMolarMass: number | null, saltMolarMass: number | null, stoichiometricCount: number | null): string {
    if (baseMolarMass === null || saltMolarMass === null || stoichiometricCount === null) return 'Nhập M hoạt chất, M muối và số đơn vị hoạt chất trong công thức.';
    if (!Number.isInteger(stoichiometricCount) || stoichiometricCount <= 0) return 'Số đơn vị hoạt chất phải là số nguyên dương.';
    if (!(baseMolarMass > 0) || !(saltMolarMass > 0)) return 'M hoạt chất và M muối phải lớn hơn 0.';
    const factor = this.saltHydrateFactor(baseMolarMass, saltMolarMass, stoichiometricCount);
    return factor === null ? 'Hệ số phải lớn hơn 0 và không vượt quá 1; kiểm tra lại công thức muối/ngậm nước.' : 'Hệ số hoạt chất = ' + this.formatNum(factor, 8) + '. Khi chọn đơn vị mol/L, M hoạt chất phải khớp lượng hoạt chất sau hiệu chỉnh.';
  }

  applyTargetSaltFactor(): void {
    const factor = this.targetSaltFactor();
    if (factor === null) {
      this.toast.show(this.saltFactorStatus(this.targetSaltBaseMolarMass(), this.targetSaltMolarMass(), this.targetSaltStoichiometricCount()), 'warning');
      return;
    }
    this.targetConversionFactor.set(factor);
    this.useTargetConversion.set(true);
    this.toast.show('Đã áp dụng hệ số muối/ngậm nước cho phép tính.', 'success');
  }

  applyConcentrationSaltFactor(): void {
    const factor = this.concentrationSaltFactor();
    if (factor === null) {
      this.toast.show(this.saltFactorStatus(this.concentrationSaltBaseMolarMass(), this.concentrationSaltMolarMass(), this.concentrationSaltStoichiometricCount()), 'warning');
      return;
    }
    this.concentrationConversionFactor.set(factor);
    this.useConcentrationConversion.set(true);
    this.toast.show('Đã áp dụng hệ số muối/ngậm nước cho phép tính.', 'success');
  }

  pipetteLabel(pipette: PipetteSuggestion | null | undefined): string | null {
    return pipette ? 'Hút ' + this.formatNum(pipette.volumeUl, 2) + ' µL [' + pipette.id + ']' : null;
  }

  pipetteWarning(pipette: PipetteSuggestion | null | undefined): string | null {
    if (!pipette || pipette.volumeUl >= 10) return null;
    return 'Thể tích hút ' + this.formatNum(pipette.volumeUl, 2) + ' µL nhỏ; xem xét pha chuẩn trung gian 1/10 để tăng thể tích. Gợi ý pipet; đối chiếu dải hiệu chuẩn và SOP.';
  }

  parseQuickSeries(raw = this.quickSeriesText()): number[] | null {
    const tokens = String(raw ?? '').split(/[,;\n]+/).map(token => token.trim()).filter(Boolean);
    if (!tokens.length) {
      this.quickSeriesError.set('Nhập ít nhất một nồng độ, phân cách bằng dấu phẩy.');
      return null;
    }
    const values = tokens.map(token => Number(token));
    const invalidIndex = values.findIndex(value => !Number.isFinite(value) || value <= 0);
    if (invalidIndex >= 0) {
      this.quickSeriesError.set('Nồng độ thứ ' + (invalidIndex + 1) + ' không phải số dương hợp lệ; dãy cũ chưa thay đổi.');
      return null;
    }
    this.quickSeriesError.set(null);
    return values;
  }

  applyQuickSeries(mode: QuickSeriesApplyMode = this.quickSeriesApplyMode()): boolean {
    const values = this.parseQuickSeries();
    const volume = this.quickSeriesVolume();
    const volumeUnit = this.quickSeriesVolumeUnit();
    const choice = this.quickSeriesChoice();
    const sourceId = this.quickSeriesSourceId();
    if (!values) return false;
    if (volume === null || !Number.isFinite(volume) || volume <= 0) {
      this.quickSeriesError.set('Thể tích định mức chung phải là số dương; dãy cũ chưa thay đổi.');
      return false;
    }
    if (!this.volumeOptions.some(option => option.unit === volumeUnit)) {
      this.quickSeriesError.set('Đơn vị thể tích chung không hợp lệ; dãy cũ chưa thay đổi.');
      return false;
    }
    if (!this.seriesConcentrationOptions.some(option => option.key === choice)) {
      this.quickSeriesError.set('Đơn vị nồng độ chung không hợp lệ; dãy cũ chưa thay đổi.');
      return false;
    }
    if (!this.seriesSources().some(source => source.id === sourceId)) {
      this.quickSeriesError.set('Nguồn chung không còn tồn tại; chọn lại nguồn trước khi tạo dãy.');
      return false;
    }

    const existing = this.seriesPoints();
    const appendBase = mode === 'append' && existing.length === 1 && this.isBlankSeriesPlaceholder(existing[0]) ? [] : existing;
    const startIndex = mode === 'append' ? appendBase.length : 0;
    const rows: UiSeriesPoint[] = values.map((value, index) => ({
      id: this.nextId('point-quick'),
      label: 'Chuẩn ' + (startIndex + index + 1),
      objectType: 'standard',
      targetConcentration: value,
      targetChoice: choice,
      finalVolume: volume,
      finalVolumeUnit: volumeUnit,
      sourceId,
      actualSourceVolume: null
    }));
    this.seriesPoints.set(mode === 'replace' ? rows : [...appendBase, ...rows]);
    this.quickSeriesError.set(null);
    this.quickSeriesOpen.set(true);
    this.toast.show((mode === 'replace' ? 'Đã thay thế dãy bằng ' : 'Đã thêm ') + rows.length + ' điểm chuẩn.', 'success');
    return true;
  }

  private nextId(prefix: string): string {
    return prefix + '-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
  }

  private isBlankSeriesPlaceholder(point: UiSeriesPoint): boolean {
    return point.objectType === 'standard'
      && (point.label.trim() === '' || point.label.trim() === 'Chuẩn 1')
      && point.targetConcentration === null
      && point.finalVolume === null
      && point.actualSourceVolume === null
      && point.sourceId === 'source-root';
  }

  setCalcModeFromTask(id: string): void {
    if (this.tasks.some(task => task.id === id)) this.setCalcMode(id as PrepMode);
  }

  sourceTypeLabel(sourceType: PrepSourceType): string {
    return sourceType === 'solid' ? 'Chất rắn/chất chuẩn rắn' : sourceType === 'solution' ? 'Dung dịch nguồn' : 'Hóa chất lỏng đậm đặc';
  }

  spikeMatrixLabel(matrix: SpikeMatrix): string {
    return matrix === 'solid' ? 'Mẫu rắn theo khối lượng' : matrix === 'liquid' ? 'Mẫu lỏng theo thể tích' : matrix === 'extract' ? 'Dịch chiết theo thể tích' : 'Lọ/dung dịch cuối';
  }

  spikeLocationLabel(location: SpikeLocation): string {
    return location === 'sample_initial' ? 'Mẫu ban đầu trước xử lý' : location === 'extract' ? 'Dịch chiết' : location === 'after_cleanup' ? 'Sau làm sạch' : 'Lọ hoặc dung dịch cuối';
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
      aliquot: 'Lấy một phần dịch',
      transfer_all: 'Chuyển toàn lượng',
      dilution: 'Pha loãng',
      concentration: 'Cô',
      reconstitution: 'Hoàn nguyên',
      split: 'Chia dòng',
      recovery: 'Điều chỉnh độ thu hồi (recovery)'
    };
    return labels[type];
  }

  objectTypeLabel(type: SeriesObjectType): string {
    return type === 'standard' ? 'Chuẩn' : type === 'blank' ? 'Mẫu trắng (blank)' : type === 'qc' ? 'Mẫu kiểm soát (QC)' : 'Mẫu thử';
  }

  additionTypeLabel(type: AdditionDraft['type']): string {
    return type === 'internal_standard' ? 'Nội chuẩn' : type === 'surrogate' ? 'Chuẩn đồng hành (surrogate)' : 'Chất phân tích';
  }

  sourceOptions(includePoints = true): { id: string; label: string }[] {
    const sources = this.seriesSources().map(source => ({ id: source.id, label: this.sourceDisplayName(source.id) }));
    if (!includePoints) return sources;
    return [...sources, ...this.seriesPoints().map(point => ({ id: point.id, label: this.sourceDisplayName(point.id) }))];
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
    this.seriesAdditions.update(rows => rows.map(row => row.id === id ? { ...row, [field]: field === 'dosing' || field === 'type' || field === 'name' || field === 'sourceId' || field === 'sourceChoice' || field === 'fixedVolumeUnit' || field === 'targetChoice' ? String(raw ?? '') : field === 'standard' || field === 'blank' || field === 'qc' || field === 'sample' || field === 'exceptionStandard' || field === 'exceptionBlank' || field === 'exceptionQc' || field === 'exceptionSample' || field === 'includeInFinalVolume' ? Boolean(raw) : this.parseNumber(raw) } : row));
  }

  toggleAdditionScope(id: string, scope: SeriesObjectType, checked: boolean, exception = false): void {
    const field: keyof UiAddition = exception
      ? scope === 'standard' ? 'exceptionStandard' : scope === 'blank' ? 'exceptionBlank' : scope === 'qc' ? 'exceptionQc' : 'exceptionSample'
      : scope === 'standard' ? 'standard' : scope === 'blank' ? 'blank' : scope === 'qc' ? 'qc' : 'sample';
    this.seriesAdditions.update(rows => rows.map(row => row.id === id ? { ...row, [field]: checked } : row));
  }

  addSeriesSource(): void {
    const index = this.seriesSources().length + 1;
    this.seriesSources.update(rows => [...rows, { id: 'source-' + Date.now(), name: 'Dung dịch trung gian ' + index, concentration: null, concentrationChoice: 'ppm_mg_l', preparedVolume: null, preparedVolumeUnit: 'mL', sourceId: rows[0]?.id ?? '', actualSourceVolume: null }]);
  }

  removeSeriesSource(id: string): void {
    this.seriesSources.update(rows => rows.length <= 1 ? rows : rows.filter(row => row.id !== id));
  }

  addSeriesPoint(): void {
    const index = this.seriesPoints().length + 1;
    this.seriesPoints.update(rows => [...rows, { id: 'point-' + Date.now(), label: 'Điểm ' + index, objectType: 'standard', targetConcentration: null, targetChoice: 'ppm_mg_l', finalVolume: null, finalVolumeUnit: 'mL', sourceId: this.seriesSources()[0]?.id ?? '', actualSourceVolume: null }]);
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
    this.seriesAdditions.update(rows => [...rows, { id: 'addition-' + Date.now(), type: 'internal_standard', dosing: 'volume', name: '', sourceId: '', sourceConcentration: null, sourceChoice: 'ppm_mg_l', fixedVolume: null, fixedVolumeUnit: 'mL', targetLevel: null, targetChoice: 'ppm_mg_l', standard: true, blank: false, qc: true, sample: true, exceptionStandard: false, exceptionBlank: false, exceptionQc: false, exceptionSample: false, includeInFinalVolume: true }]);
  }

  removeAddition(id: string): void {
    this.seriesAdditions.update(rows => rows.filter(row => row.id !== id));
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

  displaySnapshot(snapshot: ConcentrationSnapshot, choice: string): string {
    const option = this.concentrationOption(choice);
    if (option.basis === 'molar' && snapshot.molarM !== null) {
      const factor = option.unit === 'M' ? 1 : option.unit === 'mM' ? 1000 : 1000000;
      return this.formatNum(snapshot.molarM * factor, 8) + ' ' + option.label;
    }
    const unitFactor = concentrationToGPerL(this.makeConcentration(1, choice), 'display', 'đơn vị hiển thị', []);
    return unitFactor !== null && unitFactor > 0
      ? this.formatNum(snapshot.massPerVolumeGPerL / unitFactor, 8) + ' ' + option.label
      : this.displayConcentration(snapshot.massPerVolumeGPerL);
  }

  displayConcentration(valueGPerL: number, unit = 'mg/L'): string {
    const lower = unit.toLowerCase();
    if (lower.includes('ppm')) return this.formatNum(valueGPerL * 1000, 6) + ' ppm';
    if (lower.includes('ppb')) return this.formatNum(valueGPerL * 1000000, 6) + ' ppb';
    if (lower.includes('ppt')) return this.formatNum(valueGPerL * 1000000000, 6) + ' ppt';
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

  deviationPercent(actual: number, target: number): string {
    return target > 0 ? this.formatNum((actual - target) / target * 100, 4) + ' %' : 'Không tính tỷ lệ khi nồng độ yêu cầu bằng 0';
  }

  statusLabel(): string {
    const status = this.calculation().status;
    return status === 'valid' ? 'Đã tính được kết quả' : status === 'invalid' ? 'Cần kiểm tra số liệu' : 'Nhập số liệu để tính';
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
    this.substanceQuery.set('');
    this.substanceGroup.set('all');
    this.sourceParametersOpen.set(false);
    this.targetFormula.set('');
    this.concentrationFormula.set('');
    this.targetSpecies.set('');
    this.concentrationSpecies.set('');
    this.targetSourceNote.set('');
    this.concentrationSourceNote.set('');
    this.spikeSourceNote.set('');
    this.seriesSourceNote.set('');
    this.advancedResultSteps.set(false);
    this.resultFinalVolume.set(null);
    this.resultDilutionFactor.set(1);
    this.resultRecoveryPercent.set(null);
    this.concentrationResultChoice.set('mg_l');
    this.spikeStandardDensity.set(null);
    this.concentrationTargetDensity.set(null);
    this.targetSourceDensity.set(null);
    this.calcMode.set('target');
    this.showTrace.set(false);
    this.concentrationSourceType.set('solid');
    this.concentrationName.set('');
    this.concentrationActualValue.set(null);
    this.concentrationQuantityUnit.set('mg');
    this.concentrationPotency.set(null);
    this.concentrationConversionFactor.set(1);
    this.concentrationFinalVolume.set(null);
    this.concentrationFinalVolumeUnit.set('mL');
    this.concentrationSourceValue.set(null);
    this.concentrationSourceChoice.set('mg_l');
    this.concentrationTargetValue.set(null);
    this.concentrationTargetChoice.set('mg_l');
    this.concentrationMolecularWeight.set(null);
    this.concentrationDensity.set(null);
    this.concentrationSaltBaseMolarMass.set(null);
    this.concentrationSaltMolarMass.set(null);
    this.concentrationSaltStoichiometricCount.set(1);
    this.targetSourceType.set('solution');
    this.targetName.set('');
    this.targetValue.set(null);
    this.targetChoice.set('mg_l');
    this.targetFinalVolume.set(null);
    this.targetFinalVolumeUnit.set('mL');
    this.targetPotency.set(null);
    this.targetConversionFactor.set(1);
    this.targetMolecularWeight.set(null);
    this.targetDensity.set(null);
    this.targetSourceValue.set(null);
    this.targetSourceChoice.set('mg_l');
    this.targetActualValue.set(null);
    this.targetQuantityUnit.set('µL');
    this.targetSaltBaseMolarMass.set(null);
    this.targetSaltMolarMass.set(null);
    this.targetSaltStoichiometricCount.set(1);
    this.spikeMatrix.set('solid');
    this.spikeLocation.set('sample_initial');
    this.spikeSemantic.set('added_on_initial');
    this.spikeStandardName.set('');
    this.spikeSampleName.set('');
    this.spikeSampleValue.set(null);
    this.spikeSampleUnit.set('g');
    this.spikeStandardValue.set(null);
    this.spikeStandardChoice.set('mg_l');
    this.spikeTargetValue.set(null);
    this.spikeTargetChoice.set('mg_kg');
    this.spikeInitialValue.set(null);
    this.spikeInitialChoice.set('mg_kg');
    this.spikeMolecularWeight.set(null);
    this.spikeDensity.set(null);
    this.seriesStrategy.set('direct');
    this.seriesFinalVolume.set(null);
    this.seriesFinalVolumeUnit.set('mL');
    this.seriesResidualPercent.set(0);
    this.seriesSources.set([
    { id: 'source-root', name: 'Chuẩn gốc', concentration: null, concentrationChoice: 'mg_l', preparedVolume: null, preparedVolumeUnit: 'mL', sourceId: '', actualSourceVolume: null }
  ]);
    this.seriesPoints.set([
    { id: 'point-1', label: 'Chuẩn 1', objectType: 'standard', targetConcentration: null, targetChoice: 'mg_l', finalVolume: null, finalVolumeUnit: 'mL', sourceId: 'source-root', actualSourceVolume: null }
  ]);
    this.seriesComponents.set([
    { id: 'component-1', name: '', sourceId: 'source-root', targetConcentration: null, targetChoice: 'mg_l' }
  ]);
    this.seriesAdditions.set([]);
    this.quickSeriesOpen.set(false);
    this.quickSeriesText.set('');
    this.quickSeriesVolume.set(10);
    this.quickSeriesVolumeUnit.set('mL');
    this.quickSeriesChoice.set('mg_l');
    this.quickSeriesSourceId.set('source-root');
    this.quickSeriesApplyMode.set('replace');
    this.quickSeriesError.set(null);
    this.resultSampleName.set('');
    this.resultSampleBase.set('mass');
    this.resultSampleValue.set(null);
    this.resultSampleUnit.set('g');
    this.resultInstrumentValue.set(null);
    this.resultInstrumentChoice.set('mg_l');
    this.resultUnit.set('mg/kg');
    this.resultSteps.set([
    { id: 'step-extract', label: 'Chiết và định mức', type: 'extract', volume: null, volumeUnit: 'mL', fraction: null, recoveryPercent: null }
  ]);
    this.useConcentrationComparison.set(false);
    this.useTargetConversion.set(false);
    this.useConcentrationConversion.set(false);
    this.showSeriesActual.set(false);
    this.clearLegacyDraft();
    this.toast.show('Đã bắt đầu phép tính mới.', 'success');
  }

  resultText(): string {
    const result = this.calculation();
    if (result.status !== 'valid' || !result.output) return '';
    const output = result.output;
    const lines: string[] = [];
    if (output.kind === 'target') {
      const verb = output.sourceType === 'solid' ? 'Cân' : 'Hút';
      lines.push('Pha ' + this.displayVolume(output.finalVolumeMl) + ' ' + output.name + ' ' + this.formatNum(this.targetValue(), 8) + ' ' + this.concentrationOption(this.targetChoice()).label
        + ' → ' + verb + ' ' + this.displayQuantity(output.plannedQuantity) + (output.pipette ? ' (' + output.pipette.id + ')' : '') + '; định mức đến vạch.');
      if (output.actualConcentration) lines.push('Lượng đã cân / hút: ' + this.displayQuantity(output.actualQuantity!) + '; nồng độ thực tế: ' + this.displaySnapshot(output.actualConcentration, this.targetChoice()) + '; độ lệch ' + this.deviationPercent(output.actualConcentration.massPerVolumeGPerL, output.plannedConcentration.massPerVolumeGPerL));
    } else {
      lines.push(this.outputText(output));
    }
    if (this.showTrace()) lines.push(...result.trace.map(step => step.label + ': ' + (step.substitution || step.expression) + (step.value !== undefined ? ' = ' + this.formatNum(step.value, 8) + ' ' + (step.unit || '') : '')));
    lines.push(...result.issues.filter(issue => issue.severity === 'warning').map(issue => 'Lưu ý: ' + issue.message));
    return lines.join('\n');
  }

  async copyResult(): Promise<void> {
    if (!this.canExport()) { this.toast.show('Nhập đủ và kiểm tra số liệu trước khi sao chép.', 'warning'); return; }
    try {
      await navigator.clipboard.writeText(this.resultText());
      this.toast.show('Đã sao chép kết quả.', 'success');
    } catch {
      this.toast.show('Không thể sao chép kết quả.', 'error');
    }
  }

  private buildDraft(): PrepDraft {
    switch (this.calcMode()) {
      case 'concentration':
        return {
          mode: 'concentration',
          sourceType: this.concentrationSourceType(),
          substance: {
            name: this.concentrationName() + (this.useConcentrationConversion() && this.concentrationSpecies() ? ' (tính theo ' + this.concentrationSpecies() + ')' : ''),
            potencyPercent: this.concentrationPotency(),
            conversionFactor: this.concentrationSourceType() === 'solid' && this.useConcentrationConversion() ? this.concentrationConversionFactor() : 1,
            molecularWeight: this.needsMolar(this.concentrationResultChoice(), this.concentrationSourceType() === 'solid' ? '' : this.concentrationSourceChoice(), this.useConcentrationComparison() ? this.concentrationTargetChoice() : '') || this.concentrationMolecularWeight()! > 0 ? this.concentrationMolecularWeight() : null,
            densityGPerMl: this.concentrationDensity()
          },
          plannedQuantity: this.makeQuantity(this.concentrationActualValue(), this.concentrationQuantityUnit(), this.concentrationSourceType() === 'solid' ? 'mass' : 'volume'),
          actualQuantity: this.makeQuantity(this.concentrationActualValue(), this.concentrationQuantityUnit(), this.concentrationSourceType() === 'solid' ? 'mass' : 'volume'),
          finalVolume: this.makeQuantity(this.concentrationFinalVolume(), this.concentrationFinalVolumeUnit(), 'volume'),
          sourceConcentration: this.concentrationSourceType() === 'solid' ? null : this.makeConcentration(this.concentrationSourceValue(), this.concentrationSourceChoice(), this.concentrationMolecularWeight(), this.concentrationDensity()),
          targetConcentration: !this.useConcentrationComparison() || this.concentrationTargetValue() === null ? null : this.makeConcentration(this.concentrationTargetValue(), this.concentrationTargetChoice(), this.concentrationMolecularWeight(), this.concentrationTargetDensity())
        };
      case 'target':
        return {
          mode: 'target',
          sourceType: this.targetSourceType(),
          substance: {
            name: this.targetName() + (this.useTargetConversion() && this.targetSpecies() ? ' (tính theo ' + this.targetSpecies() + ')' : ''),
            potencyPercent: this.targetPotency(),
            conversionFactor: this.targetSourceType() === 'solid' && this.useTargetConversion() ? this.targetConversionFactor() : 1,
            molecularWeight: this.needsMolar(this.targetChoice(), this.targetSourceType() === 'solid' ? '' : this.targetSourceChoice()) || this.targetMolecularWeight()! > 0 ? this.targetMolecularWeight() : null,
            densityGPerMl: this.targetDensity()
          },
          targetConcentration: this.makeConcentration(this.targetValue(), this.targetChoice(), this.targetMolecularWeight(), this.targetDensity()),
          finalVolume: this.makeQuantity(this.targetFinalVolume(), this.targetFinalVolumeUnit(), 'volume'),
          sourceConcentration: this.targetSourceType() === 'solid' ? null : this.makeConcentration(this.targetSourceValue(), this.targetSourceChoice(), this.targetMolecularWeight(), this.targetSourceDensity()),
          actualQuantity: this.makeQuantity(this.targetActualValue(), this.targetQuantityUnit(), this.targetSourceType() === 'solid' ? 'mass' : 'volume')
        };
      case 'spike':
        return {
          mode: 'spike',
          matrix: this.spikeMatrix(),
          location: this.spikeLocation(),
          semantic: this.spikeSemantic(),
          standardName: this.spikeStandardName(),
          sampleName: this.spikeSampleName().trim() || 'Mẫu',
          standard: this.makeConcentration(this.spikeStandardValue(), this.spikeStandardChoice(), this.spikeMolecularWeight(), this.spikeStandardDensity()),
          target: this.makeConcentration(this.spikeTargetValue(), this.spikeTargetChoice(), this.spikeMolecularWeight(), this.spikeDensity()),
          sampleQuantity: this.makeQuantity(this.spikeSampleValue(), this.spikeSampleUnit(), this.spikeMatrix() === 'solid' ? 'mass' : 'volume'),
          initialConcentration: this.spikeSemantic() !== 'final_total' || this.spikeInitialValue() === null ? null : this.makeConcentration(this.spikeInitialValue(), this.spikeInitialChoice(), this.spikeMolecularWeight(), this.spikeDensity())
        };
      case 'series':
        return {
          mode: 'series',
          strategy: this.seriesStrategy(),
          finalVolume: this.makeQuantity(this.seriesFinalVolume(), this.seriesFinalVolumeUnit(), 'volume'),
          residualPercent: this.seriesResidualPercent(),
          sources: this.seriesSources().map(source => ({ id: source.id, name: source.name, concentration: this.makeConcentration(source.concentration, source.concentrationChoice), preparedVolume: source.sourceId ? this.makeQuantity(source.preparedVolume, source.preparedVolumeUnit, 'volume') : null, sourceId: source.sourceId || null, actualSourceQuantity: this.makeQuantity(this.showSeriesActual() && source.sourceId ? source.actualSourceVolume : null, source.preparedVolumeUnit, 'volume') })),
          points: this.seriesPoints().map(point => ({ id: point.id, label: point.label, objectType: point.objectType, targetConcentration: this.makeConcentration(point.targetConcentration, point.targetChoice), finalVolume: this.makeQuantity(point.finalVolume, point.finalVolumeUnit, 'volume'), sourceId: point.sourceId, actualSourceQuantity: this.makeQuantity(this.showSeriesActual() ? point.actualSourceVolume : null, point.finalVolumeUnit, 'volume') })),
          components: this.seriesComponents().map(component => ({ id: component.id, name: component.name, sourceId: component.sourceId, targetConcentration: this.makeConcentration(component.targetConcentration, component.targetChoice) })),
          additions: this.seriesAdditions().map(addition => this.toAdditionDraft(addition))
        };
      case 'result_conversion':
        return {
          mode: 'result_conversion',
          sampleName: this.resultSampleName().trim() || 'Mẫu',
          sampleBase: this.resultSampleBase(),
          sampleAmount: this.makeQuantity(this.resultSampleValue(), this.resultSampleUnit(), this.resultSampleBase() === 'mass' ? 'mass' : 'volume'),
          instrument: this.makeConcentration(this.resultInstrumentValue(), this.resultInstrumentChoice()),
          resultUnit: this.resultUnit(),
          steps: this.advancedResultSteps() ? this.resultSteps().map(step => ({ id: step.id, label: step.label, type: step.type, volume: ['split', 'recovery', 'transfer_all'].includes(step.type) ? null : this.makeQuantity(step.volume, step.volumeUnit, 'volume'), fraction: step.type === 'split' ? step.fraction : null, recoveryPercent: step.type === 'recovery' ? step.recoveryPercent : null })) : this.simpleResultSteps()
        };
    }
  }

  private simpleResultSteps(): SampleProcessingStepDraft[] {
    const steps: SampleProcessingStepDraft[] = [{ id: 'final-volume', label: 'Thể tích định mức cuối', type: 'extract', volume: this.makeQuantity(this.resultFinalVolume(), 'mL', 'volume') }];
    const factor = this.resultDilutionFactor();
    if (factor !== null && factor > 1) steps.push({ id: 'dilution-factor', label: 'Hệ số pha loãng F = ' + factor, type: 'split', fraction: 1 / factor });
    // The split represents only analytical retention; restore the declared measured volume.
    if (factor !== null && factor > 1) steps.push({ id: 'measured-volume', label: 'Thể tích dung dịch đo', type: 'dilution', volume: this.makeQuantity(this.resultFinalVolume(), 'mL', 'volume') });
    if (this.resultRecoveryPercent() !== null) steps.push({ id: 'recovery', label: 'Hiệu chỉnh độ thu hồi', type: 'recovery', recoveryPercent: this.resultRecoveryPercent() });
    return steps;
  }

  private toAdditionDraft(addition: UiAddition): AdditionDraft {
    const linkedSource = this.seriesSources().find(source => source.id === addition.sourceId);
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
      source: linkedSource ? this.makeConcentration(linkedSource.concentration, linkedSource.concentrationChoice) : this.makeConcentration(addition.sourceConcentration, addition.sourceChoice),
      applicationScope,
      exceptions,
      fixedVolume: addition.dosing === 'volume' ? this.makeQuantity(addition.fixedVolume, addition.fixedVolumeUnit, 'volume') : null,
      targetLevel: addition.dosing !== 'concentration' || addition.targetLevel === null ? null : this.makeConcentration(addition.targetLevel, addition.targetChoice),
      includeInFinalVolume: addition.includeInFinalVolume
    };
  }

  private outputText(output: PrepOutput | null): string {
    if (!output) return 'Chưa có kết quả. Vui lòng kiểm tra đầu vào và cảnh báo.';
    switch (output.kind) {
      case 'concentration':
        return ['Nồng độ đã pha', 'Tên chất/dung dịch: ' + output.name, 'Nồng độ xác định: ' + this.displaySnapshot(output.actualConcentration, this.concentrationResultChoice()), ...output.actualConcentration.alternatives.map(item => this.formatNum(item.value, 8) + ' ' + item.unit), 'Hướng dẫn thao tác: ' + output.operation, output.targetConcentration ? 'Độ lệch so với yêu cầu: ' + this.deviationPercent(output.actualConcentration.massPerVolumeGPerL, output.targetConcentration.massPerVolumeGPerL) : ''].filter(Boolean).join('\n');
      case 'target':
        return ['Nội dung: Pha dung dịch', 'Nồng độ cần pha: ' + this.formatNum(this.targetValue(), 8) + ' ' + this.concentrationOption(this.targetChoice()).label, 'Tên chất/dung dịch: ' + output.name, 'Lượng dự kiến: ' + this.displayQuantity(output.plannedQuantity), 'Hướng dẫn thao tác: ' + output.operation, output.actualConcentration ? 'Nồng độ xác định theo lượng thực tế: ' + this.displayConcentration(output.actualConcentration.massPerVolumeGPerL) + '\nĐộ lệch so với yêu cầu: ' + this.deviationPercent(output.actualConcentration.massPerVolumeGPerL, output.plannedConcentration.massPerVolumeGPerL) : ''].filter(Boolean).join('\n');
      case 'spike':
        return ['Nội dung: Thêm chuẩn vào mẫu', 'Tên mẫu: ' + output.sampleName, 'Thể tích dung dịch chuẩn: ' + this.displayVolume(output.spikeVolumeMl), 'Hướng dẫn thao tác: ' + output.operation].join('\n');
      case 'series':
        return ['Nội dung: Pha dãy chuẩn và QC', ...output.intermediateRows.map(row => row.name + ': ' + this.displayConcentration(row.concentrationGPerL) + (row.sourceId ? ' · thể tích pha ' + this.displayVolume(row.preparedVolumeMl) : ' · dung dịch có sẵn')), ...output.pointRows.map(row => row.label + ': từ ' + this.sourceDisplayName(row.sourceId) + ' · hút ' + this.displayVolume(row.sourceVolumeMl) + '; định mức đến ' + this.displayVolume(row.finalVolumeMl) + (row.actualConcentrationGPerL !== null ? '; nồng độ từ thể tích đã hút: ' + this.displayConcentration(row.actualConcentrationGPerL) + ' (theo nguồn khai báo)' : '')), ...output.additionRows.map(row => row.pointLabel + ': thêm ' + this.displayVolume(row.volumeMl) + ' ' + row.name), ...output.sourceDemand.map(row => 'Nhu cầu chuẩn bị ' + row.name + ': ' + this.displayVolume(row.requiredWithResidualMl))].join('\n');
      case 'result_conversion':
        if (!this.advancedResultSteps()) return output.sampleName + ': C máy = ' + this.formatNum(this.resultInstrumentValue(), 8) + ' ' + this.concentrationOption(this.resultInstrumentChoice()).label
          + '; V = ' + this.displayVolume(output.finalVolumeMl) + '; lượng mẫu = ' + this.displayQuantity(output.sampleAmount)
          + '; F = ' + this.formatNum(this.resultDilutionFactor(), 8) + (this.resultRecoveryPercent() !== null ? '; R = ' + this.formatNum(this.resultRecoveryPercent(), 8) + '%' : '')
          + ' → X = ' + this.formatNum(output.resultValue, 8) + ' ' + output.resultUnit;
        return output.sampleName + ': ' + this.formatNum(output.resultValue, 8) + ' ' + output.resultUnit + '; ' + output.operation;
    }
  }

  private clearLegacyDraft(): void {
    // Previous versions used a browser-wide draft. Never read or restore it:
    // its contents can belong to another signed-in user on a shared device.
    try {
      (globalThis as typeof globalThis & { localStorage?: Storage }).localStorage?.removeItem('lims.smart-prep.draft.v1');
    } catch {
      // Storage access can be denied; the calculator still works in memory.
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

}
