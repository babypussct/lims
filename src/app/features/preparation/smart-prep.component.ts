import { CommonModule } from '@angular/common';
import { Component, WritableSignal, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';
import { calculatePrep } from './prep-calculation.engine';
import {
  ConcentrationBasis,
  ConcentrationDraft,
  CalculationIssue,
  MixDraftRow,
  PrepCalculationResult,
  PrepDraft,
  PrepMode,
  PrepOutput
} from './prep-domain.types';

type NumericSignal = WritableSignal<number | null>;

interface ModeDefinition {
  id: PrepMode;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
  activeClass: string;
}

interface ModeGroup {
  id: string;
  label: string;
  modeIds: PrepMode[];
}

interface MixUiRow {
  id: string;
  name: string;
  stockConc: number | null;
  stockUnit: string;
  targetConc: number | null;
  targetUnit: string;
}

const CONCENTRATION_OPTIONS = [
  { unit: 'ppm', label: 'ppm (mg/L)' },
  { unit: 'ppb', label: 'ppb (µg/L)' },
  { unit: 'mg/ml', label: 'mg/ml' },
  { unit: 'mg/l', label: 'mg/l' },
  { unit: 'mg/kg', label: 'mg/kg (w/w)' },
  { unit: 'g/l', label: 'g/l' },
  { unit: 'M', label: 'M' },
  { unit: 'mM', label: 'mM' },
  { unit: 'uM', label: 'µM' },
  { unit: '%', label: '% (w/w)' }
];

const VOLUME_OPTIONS = [
  { unit: 'ml', label: 'mL' },
  { unit: 'l', label: 'L' },
  { unit: 'ul', label: 'µL' }
];

const MASS_OPTIONS = [
  { unit: 'g', label: 'g' },
  { unit: 'mg', label: 'mg' },
  { unit: 'kg', label: 'kg' }
];

@Component({
  selector: 'app-smart-prep',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './smart-prep.component.html',
  styles: [
    ".field-label{display:block;margin-bottom:.5rem;font-size:.65rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#64748b}.field-input{width:100%;border:1px solid #cbd5e1;border-radius:.75rem;background:#fff;padding:.65rem .75rem;font-size:.875rem;outline:0;transition:border-color .15s,box-shadow .15s}.field-input:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.12)}.result-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.5rem}.result-grid>div{border-radius:.75rem;background:#f8fafc;padding:.75rem}.result-grid span{display:block;font-size:.625rem;font-weight:700;color:#94a3b8}.result-grid strong{display:block;margin-top:.25rem;font-size:.8rem;line-height:1.35}@media (prefers-color-scheme:dark){.field-label{color:#94a3b8}.field-input{border-color:#334155;background:#0f172a;color:#e2e8f0}.result-grid>div{background:rgba(30,41,59,.7)}}"
  ]
})
export class SmartPrepComponent {
  private readonly toast = inject(ToastService);

  readonly concentrationOptions = CONCENTRATION_OPTIONS;
  readonly volumeOptions = VOLUME_OPTIONS;
  readonly massOptions = MASS_OPTIONS;

  readonly modes: ModeDefinition[] = [
    {
      id: 'molar',
      label: 'Pha dung dịch mol',
      shortLabel: 'Molar',
      description: 'Từ khối lượng, độ tinh khiết và khối lượng phân tử.',
      icon: 'fa-flask',
      activeClass: 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
    },
    {
      id: 'dilution',
      label: 'Pha loãng',
      shortLabel: 'Pha loãng',
      description: 'Tính thể tích dung dịch gốc và dung môi.',
      icon: 'fa-droplet',
      activeClass: 'bg-cyan-600 text-white shadow-lg shadow-cyan-200 dark:shadow-none'
    },
    {
      id: 'spiking',
      label: 'Bổ sung chuẩn',
      shortLabel: 'Spiking',
      description: 'Tính thể tích chuẩn thêm vào mẫu.',
      icon: 'fa-vial',
      activeClass: 'bg-amber-500 text-white shadow-lg shadow-amber-200 dark:shadow-none'
    },
    {
      id: 'serial',
      label: 'Dãy chuẩn',
      shortLabel: 'Dãy chuẩn',
      description: 'Tính nhanh nhiều điểm từ một dung dịch gốc.',
      icon: 'fa-list-ol',
      activeClass: 'bg-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-none'
    },
    {
      id: 'mix',
      label: 'Pha hỗn hợp',
      shortLabel: 'Hỗn hợp',
      description: 'Tính thể tích từng thành phần trong một mẻ.',
      icon: 'fa-layer-group',
      activeClass: 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none'
    },
    {
      id: 'sample_prep',
      label: 'Xử lý mẫu',
      shortLabel: 'Xử lý mẫu',
      description: 'Quy đổi kết quả thiết bị về mẫu ban đầu.',
      icon: 'fa-filter',
      activeClass: 'bg-rose-600 text-white shadow-lg shadow-rose-200 dark:shadow-none'
    }
  ];

  readonly modeGroups: ModeGroup[] = [
    { id: 'solution', label: 'Dung dịch', modeIds: ['molar', 'dilution', 'spiking'] },
    { id: 'series', label: 'Chuỗi pha', modeIds: ['serial', 'mix'] },
    { id: 'sample', label: 'Mẫu thử', modeIds: ['sample_prep'] }
  ];

  readonly calcMode = signal<PrepMode>('molar');
  readonly showTrace = signal(false);

  readonly substanceName = signal('NaCl');
  readonly massValue = signal<number | null>(5);
  readonly massUnit = signal('g');
  readonly purity = signal<number | null>(99);
  readonly molarFinalVolume = signal<number | null>(1000);
  readonly molarFinalVolumeUnit = signal('ml');
  readonly molecularWeight = signal<number | null>(58.44);

  readonly concentrationMw = signal<number | null>(58.44);
  readonly densityGPerMl = signal<number | null>(1);

  readonly dilutionStockName = signal('Dung dịch gốc');
  readonly dilutionStockConc = signal<number | null>(1000);
  readonly dilutionStockUnit = signal('ppm');
  readonly dilutionTargetConc = signal<number | null>(10);
  readonly dilutionTargetUnit = signal('ppm');
  readonly dilutionFinalVolume = signal<number | null>(10);
  readonly dilutionFinalVolumeUnit = signal('ml');

  readonly spikingStockName = signal('Dung dịch chuẩn');
  readonly spikingSampleName = signal('Mẫu thử');
  readonly spikingStockConc = signal<number | null>(1000);
  readonly spikingStockUnit = signal('ppm');
  readonly spikingAddedConc = signal<number | null>(10);
  readonly spikingAddedUnit = signal('ppm');
  readonly spikingSampleVolume = signal<number | null>(10);
  readonly spikingSampleVolumeUnit = signal('ml');

  readonly serialStockName = signal('Dung dịch gốc');
  readonly serialStockConc = signal<number | null>(1000);
  readonly serialStockUnit = signal('ppm');
  readonly serialTargetUnit = signal('ppm');
  readonly serialPointVolume = signal<number | null>(10);
  readonly serialPointVolumeUnit = signal('ml');
  readonly serialTargets = signal<(number | null)[]>([100, 50, 10, 1]);

  readonly mixFinalVolume = signal<number | null>(100);
  readonly mixFinalVolumeUnit = signal('ml');
  readonly mixItems = signal<MixUiRow[]>([
    { id: 'mix-1', name: 'Thành phần A', stockConc: 1000, stockUnit: 'ppm', targetConc: 10, targetUnit: 'ppm' },
    { id: 'mix-2', name: 'Thành phần B', stockConc: 500, stockUnit: 'ppm', targetConc: 5, targetUnit: 'ppm' }
  ]);

  readonly sampleName = signal('Mẫu thử');
  readonly sampleMass = signal<number | null>(10);
  readonly sampleMassUnit = signal('g');
  readonly extractVolume = signal<number | null>(50);
  readonly extractVolumeUnit = signal('ml');
  readonly cleanupAliquot = signal<number | null>(5);
  readonly cleanupAliquotUnit = signal('ml');
  readonly concentrationAliquot = signal<number | null>(1);
  readonly concentrationAliquotUnit = signal('ml');
  readonly sampleFinalVolume = signal<number | null>(1);
  readonly sampleFinalVolumeUnit = signal('ml');
  readonly recovery = signal<number | null>(80);
  readonly instrumentConc = signal<number | null>(1);
  readonly instrumentConcUnit = signal('ppm');

  readonly calculation = computed<PrepCalculationResult<PrepOutput>>(() => calculatePrep(this.buildDraft()));

  getMode(id: PrepMode): ModeDefinition {
    return this.modes.find(mode => mode.id === id) ?? this.modes[0];
  }

  setCalcMode(mode: PrepMode): void {
    this.calcMode.set(mode);
    this.showTrace.set(false);
  }

  concentrationBasisForUnit(unit: string): ConcentrationBasis {
    const clean = (unit || '').trim().toLowerCase().replace('µ', 'u');
    if (['m', 'mm', 'um'].includes(clean)) return 'molar';
    if (['%', 'percent'].includes(clean)) return 'mass_fraction';
    if (['g/g', 'mg/mg'].includes(clean)) return 'mass_fraction';
    if (clean === 'mg/kg') return 'mass_per_mass';
    return 'mass_per_volume';
  }

  makeConcentration(value: number | null, unit: string): ConcentrationDraft {
    return {
      value,
      unit,
      basis: this.concentrationBasisForUnit(unit),
      molecularWeight: this.concentrationMw(),
      densityGPerMl: this.densityGPerMl()
    };
  }

  setNumeric(target: NumericSignal, raw: unknown): void {
    target.set(this.parseNumber(raw));
  }

  updateSerialPoint(index: number, raw: unknown): void {
    const value = this.parseNumber(raw);
    this.serialTargets.update(points => points.map((point, currentIndex) => currentIndex === index ? value : point));
  }

  addSerialPoint(): void {
    this.serialTargets.update(points => [...points, null]);
  }

  removeSerialPoint(index: number): void {
    this.serialTargets.update(points => points.length <= 1 ? points : points.filter((_, currentIndex) => currentIndex !== index));
  }

  addMixRow(): void {
    const nextNumber = this.mixItems().length + 1;
    this.mixItems.update(rows => [
      ...rows,
      {
        id: 'mix-' + Date.now(),
        name: 'Thành phần ' + String.fromCharCode(64 + nextNumber),
        stockConc: null,
        stockUnit: 'ppm',
        targetConc: null,
        targetUnit: 'ppm'
      }
    ]);
  }

  removeMixRow(id: string): void {
    this.mixItems.update(rows => rows.length <= 1 ? rows : rows.filter(row => row.id !== id));
  }

  updateMixText(id: string, field: 'name' | 'stockUnit' | 'targetUnit', raw: unknown): void {
    const value = String(raw ?? '');
    this.mixItems.update(rows => rows.map(row => row.id === id ? { ...row, [field]: value } : row));
  }

  updateMixNumber(id: string, field: 'stockConc' | 'targetConc', raw: unknown): void {
    const value = this.parseNumber(raw);
    this.mixItems.update(rows => rows.map(row => row.id === id ? { ...row, [field]: value } : row));
  }

  async pasteFromExcel(): Promise<void> {
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
      const imported = rows.map((row, index): MixUiRow => ({
        id: 'mix-paste-' + Date.now() + '-' + index,
        name: row[0]?.trim() || 'Thành phần ' + (index + 1),
        stockConc: this.parseClipboardNumber(row[1]),
        stockUnit: row[2]?.trim() || 'ppm',
        targetConc: this.parseClipboardNumber(row[3]),
        targetUnit: row[4]?.trim() || row[2]?.trim() || 'ppm'
      }));
      this.mixItems.set(imported);
      this.toast.show('Đã nạp ' + imported.length + ' dòng mô phỏng từ clipboard.', 'success');
    } catch {
      this.toast.show('Không đọc được clipboard.', 'error');
    }
  }

  formatNum(value: number | null | undefined, decimals = 4): string {
    if (value === null || value === undefined || !Number.isFinite(value)) return '—';
    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: decimals }).format(value);
  }

  displayVolume(valueMl: number): string {
    if (!Number.isFinite(valueMl)) return '—';
    if (Math.abs(valueMl) >= 1000) return this.formatNum(valueMl / 1000) + ' L';
    if (Math.abs(valueMl) < 0.01 && valueMl !== 0) return this.formatNum(valueMl * 1000, 3) + ' µL';
    return this.formatNum(valueMl, 4) + ' mL';
  }

  displayConcentration(valueGPerL: number, unit: string): string {
    const clean = (unit || '').trim().toLowerCase().replace('µ', 'u');
    if (clean === 'ppm') return this.formatNum(valueGPerL * 1000, 6) + ' ppm';
    if (clean === 'ppb') return this.formatNum(valueGPerL * 1000000, 6) + ' ppb';
    if (clean === 'mg/ml') return this.formatNum(valueGPerL, 6) + ' mg/mL';
    if (clean === 'mg/l') return this.formatNum(valueGPerL * 1000, 6) + ' mg/L';
    if (clean === 'g/ml') return this.formatNum(valueGPerL / 1000, 6) + ' g/mL';
    if (clean === 'mg/kg') {
      const density = this.densityGPerMl();
      return density ? this.formatNum(valueGPerL * 1000 / density, 6) + ' mg/kg' : this.formatNum(valueGPerL, 6) + ' g/L';
    }
    if (clean === '%') {
      const density = this.densityGPerMl();
      return density ? this.formatNum(valueGPerL / (density * 10), 6) + ' %' : this.formatNum(valueGPerL, 6) + ' g/L';
    }
    return this.formatNum(valueGPerL, 6) + ' g/L';
  }

  statusLabel(): string {
    const status = this.calculation().status;
    if (status === 'valid') return 'Kết quả hợp lệ';
    if (status === 'invalid') return 'Cần kiểm tra đầu vào';
    return 'Đang chờ dữ liệu';
  }

  statusClass(): string {
    const status = this.calculation().status;
    if (status === 'valid') return 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200';
    if (status === 'invalid') return 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200';
    return 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200';
  }

  issueClass(issue: CalculationIssue): string {
    return issue.severity === 'warning'
      ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200'
      : 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-200';
  }

  resetDraft(): void {
    this.calcMode.set('molar');
    this.showTrace.set(false);
    this.substanceName.set('NaCl');
    this.massValue.set(5);
    this.massUnit.set('g');
    this.purity.set(99);
    this.molarFinalVolume.set(1000);
    this.molarFinalVolumeUnit.set('ml');
    this.molecularWeight.set(58.44);
    this.concentrationMw.set(58.44);
    this.densityGPerMl.set(1);
    this.dilutionStockConc.set(1000);
    this.dilutionTargetConc.set(10);
    this.dilutionFinalVolume.set(10);
    this.spikingStockConc.set(1000);
    this.spikingAddedConc.set(10);
    this.spikingSampleVolume.set(10);
    this.serialTargets.set([100, 50, 10, 1]);
    this.mixFinalVolume.set(100);
    this.mixItems.set([
      { id: 'mix-1', name: 'Thành phần A', stockConc: 1000, stockUnit: 'ppm', targetConc: 10, targetUnit: 'ppm' },
      { id: 'mix-2', name: 'Thành phần B', stockConc: 500, stockUnit: 'ppm', targetConc: 5, targetUnit: 'ppm' }
    ]);
    this.sampleMass.set(10);
    this.extractVolume.set(50);
    this.cleanupAliquot.set(5);
    this.concentrationAliquot.set(1);
    this.sampleFinalVolume.set(1);
    this.recovery.set(80);
    this.instrumentConc.set(1);
    this.toast.show('Đã đặt lại bộ mô phỏng.', 'success');
  }

  resultText(): string {
    const result = this.calculation();
    if (!result.output) {
      return result.issues.map(issue => issue.message).join('\n') || 'Chưa có kết quả.';
    }
    return this.outputText(result.output);
  }

  async copyResult(): Promise<void> {
    const text = this.resultText();
    try {
      await navigator.clipboard.writeText(text);
      this.toast.show('Đã sao chép kết quả mô phỏng.', 'success');
    } catch {
      this.toast.show('Không thể sao chép kết quả.', 'error');
    }
  }

  exportSimulation(): void {
    const blob = new Blob([this.resultText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'prep-simulation.txt';
    link.click();
    URL.revokeObjectURL(url);
    this.toast.show('Đã xuất snapshot mô phỏng dạng TXT.', 'success');
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
    const mode = this.getMode(this.calcMode());
    printDocument.open();
    printDocument.write(
      '<!doctype html><html><head><title>Trạm Pha Chế - mô phỏng</title>' +
      '<style>body{font-family:Arial,sans-serif;padding:32px;color:#172033}h1{margin:0 0 4px}p{color:#64748b}.result{white-space:pre-wrap;border:1px solid #cbd5e1;border-radius:12px;padding:20px;line-height:1.6}small{color:#94a3b8}</style>' +
      '</head><body><h1>Trạm Pha Chế</h1><p>Helper mô phỏng · ' +
      this.escapeHtml(mode.label) +
      '</p><div class="result">' +
      this.escapeHtml(this.resultText()) +
      '</div><small>Không tạo giao dịch, không cập nhật kho, không ghi chất chuẩn.</small></body></html>'
    );
    printDocument.close();
    window.setTimeout(() => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
      frame.remove();
    }, 100);
  }

  private parseNumber(raw: unknown): number | null {
    if (raw === null || raw === undefined || String(raw).trim() === '') return null;
    const number = Number(String(raw).replace(',', '.'));
    return Number.isFinite(number) ? number : null;
  }

  private parseClipboardNumber(value: string | undefined): number | null {
    if (!value) return null;
    const number = Number(value.trim().replace(',', '.'));
    return Number.isFinite(number) ? number : null;
  }

  private buildDraft(): PrepDraft {
    switch (this.calcMode()) {
      case 'molar':
        return {
          mode: 'molar',
          name: this.substanceName(),
          mass: { value: this.massValue(), unit: this.massUnit(), dimension: 'mass' },
          purity: this.purity(),
          finalVolume: { value: this.molarFinalVolume(), unit: this.molarFinalVolumeUnit(), dimension: 'volume' },
          molecularWeight: this.molecularWeight()
        };
      case 'dilution':
        return {
          mode: 'dilution',
          stockName: this.dilutionStockName(),
          stock: this.makeConcentration(this.dilutionStockConc(), this.dilutionStockUnit()),
          target: this.makeConcentration(this.dilutionTargetConc(), this.dilutionTargetUnit()),
          finalVolume: { value: this.dilutionFinalVolume(), unit: this.dilutionFinalVolumeUnit(), dimension: 'volume' }
        };
      case 'spiking':
        return {
          mode: 'spiking',
          stockName: this.spikingStockName(),
          sampleName: this.spikingSampleName(),
          stock: this.makeConcentration(this.spikingStockConc(), this.spikingStockUnit()),
          added: this.makeConcentration(this.spikingAddedConc(), this.spikingAddedUnit()),
          sampleVolume: { value: this.spikingSampleVolume(), unit: this.spikingSampleVolumeUnit(), dimension: 'volume' }
        };
      case 'serial':
        return {
          mode: 'serial',
          stockName: this.serialStockName(),
          stock: this.makeConcentration(this.serialStockConc(), this.serialStockUnit()),
          pointVolume: { value: this.serialPointVolume(), unit: this.serialPointVolumeUnit(), dimension: 'volume' },
          targets: this.serialTargets().map(value => this.makeConcentration(value, this.serialTargetUnit()))
        };
      case 'mix':
        return {
          mode: 'mix',
          finalVolume: { value: this.mixFinalVolume(), unit: this.mixFinalVolumeUnit(), dimension: 'volume' },
          rows: this.mixItems().map((row): MixDraftRow => ({
            id: row.id,
            name: row.name,
            stock: this.makeConcentration(row.stockConc, row.stockUnit),
            target: this.makeConcentration(row.targetConc, row.targetUnit)
          }))
        };
      case 'sample_prep':
        return {
          mode: 'sample_prep',
          sampleName: this.sampleName(),
          sampleMass: { value: this.sampleMass(), unit: this.sampleMassUnit(), dimension: 'mass' },
          extractVolume: { value: this.extractVolume(), unit: this.extractVolumeUnit(), dimension: 'volume' },
          cleanupAliquot: { value: this.cleanupAliquot(), unit: this.cleanupAliquotUnit(), dimension: 'volume' },
          concentrationAliquot: { value: this.concentrationAliquot(), unit: this.concentrationAliquotUnit(), dimension: 'volume' },
          finalVolume: { value: this.sampleFinalVolume(), unit: this.sampleFinalVolumeUnit(), dimension: 'volume' },
          recovery: this.recovery(),
          instrument: this.makeConcentration(this.instrumentConc(), this.instrumentConcUnit())
        };
    }
  }

  private outputText(output: PrepOutput): string {
    switch (output.kind) {
      case 'molar':
        return [
          'Chất: ' + output.name,
          'Khối lượng hoạt chất: ' + this.formatNum(output.activeMassG, 6) + ' g',
          'Nồng độ khối lượng: ' + this.formatNum(output.massConcentrationGPerL, 6) + ' g/L',
          'Nồng độ mol: ' + (output.molarConcentrationM === null ? '—' : this.formatNum(output.molarConcentrationM, 8) + ' M')
        ].join('\n');
      case 'dilution':
        return [
          'Dung dịch gốc: ' + output.stockName,
          'Thể tích dung dịch gốc: ' + this.displayVolume(output.stockVolumeMl),
          'Thể tích dung môi: ' + this.displayVolume(output.solventVolumeMl),
          'Thể tích cuối: ' + this.displayVolume(output.finalVolumeMl)
        ].join('\n');
      case 'spiking':
        return [
          'Mẫu: ' + output.sampleName,
          'Thể tích chuẩn thêm: ' + this.displayVolume(output.spikeVolumeMl),
          'Thể tích mẫu tham chiếu: ' + this.displayVolume(output.sampleVolumeMl)
        ].join('\n');
      case 'serial':
        return [
          'Dung dịch gốc: ' + output.stockName,
          ...output.rows.map(row => 'Điểm ' + row.index + ': ' + row.targetDisplayValue + ' ' + row.targetDisplayUnit + ' → chuẩn ' + this.displayVolume(row.stockVolumeMl) + ', dung môi ' + this.displayVolume(row.solventVolumeMl)),
          'Tổng dung dịch gốc: ' + this.displayVolume(output.totalStockVolumeMl),
          'Tổng dung môi: ' + this.displayVolume(output.totalSolventVolumeMl)
        ].join('\n');
      case 'mix':
        return [
          'Thể tích cuối: ' + this.displayVolume(output.finalVolumeMl),
          ...output.rows.map(row => row.name + ': ' + this.displayVolume(row.stockVolumeMl)),
          'Tổng thành phần: ' + this.displayVolume(output.componentVolumeMl),
          'Dung môi bù: ' + this.displayVolume(output.solventVolumeMl)
        ].join('\n');
      case 'sample_prep':
        return [
          'Mẫu: ' + this.sampleName(),
          'Hệ số quy đổi: ' + this.formatNum(output.factor, 8),
          'Nồng độ mẫu ban đầu: ' + this.displayConcentration(output.sampleConcentrationGPerL, this.instrumentConcUnit())
        ].join('\n');
    }
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
