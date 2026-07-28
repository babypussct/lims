import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnalysisResultDraft } from '../../../core/models/analysis-result.model';
import {
  applyExcelImportCandidates,
  buildExcelImportCandidates,
  formatImportedFinalConc,
  parseMassHunterResultWorkbook,
  updateCandidateSample
} from '../import/excel-result-import';
import {
  ExcelImportCandidate,
  ExcelImportCandidateKind,
  ExcelImportContext
} from '../import/excel-result-import.models';

@Component({
  selector: 'app-excel-result-import-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './excel-result-import-modal.component.html'
})
export class ExcelResultImportModalComponent implements OnChanges {
  @Input() file: File | null = null;
  @Input() run: any = null;
  @Input() draft!: AnalysisResultDraft;
  @Input() config: any = null;
  @Input() configKey: string | null = null;
  @Input() isReadOnly = false;

  @Output() cancelled = new EventEmitter<void>();
  @Output() applied = new EventEmitter<{ draft: AnalysisResultDraft; appliedCount: number }>();

  candidates: ExcelImportCandidate[] = [];
  warnings: string[] = [];
  errorMessage = '';
  isLoading = false;
  isApplying = false;
  decimalMode = 'source';

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['file'] && this.file) {
      await this.loadFile(this.file);
    }
  }

  get selectedCount(): number {
    return this.candidates.filter(candidate => candidate.selected && candidate.selectable).length;
  }

  get resultCandidates(): ExcelImportCandidate[] {
    return this.candidates.filter(candidate => candidate.kind === 'result');
  }

  get metadataCandidates(): ExcelImportCandidate[] {
    return this.candidates.filter(candidate => candidate.kind !== 'result');
  }

  get hasSelectableCandidates(): boolean {
    return this.candidates.some(candidate => candidate.selectable);
  }

  get allSelectableSelected(): boolean {
    return this.areAllSelected(this.candidates);
  }

  get allResultCandidatesSelected(): boolean {
    return this.areAllSelected(this.resultCandidates);
  }

  get allMetadataCandidatesSelected(): boolean {
    return this.areAllSelected(this.metadataCandidates);
  }

  toggleAll(checked: boolean, kind?: ExcelImportCandidateKind) {
    this.candidates
      .filter(candidate => candidate.selectable && (!kind || candidate.kind === kind))
      .forEach(candidate => candidate.selected = checked);
  }

  toggleMetadata(checked: boolean) {
    this.metadataCandidates
      .filter(candidate => candidate.selectable)
      .forEach(candidate => candidate.selected = checked);
  }

  onTargetSampleChanged(candidate: ExcelImportCandidate, sample: string) {
    updateCandidateSample(candidate, sample, this.context());
  }

  onDecimalModeChanged(mode: string) {
    this.decimalMode = mode;
    const decimalPlaces = this.selectedDecimalPlaces();
    this.resultCandidates.forEach(candidate => {
      candidate.importValue = formatImportedFinalConc(
        candidate.sourceValue ?? candidate.importValue,
        candidate.isNd,
        decimalPlaces
      );
    });
  }

  manualSampleOptions(candidate: ExcelImportCandidate): string[] {
    return candidate.possibleSamples;
  }

  statusText(candidate: ExcelImportCandidate): string {
    const labels: Record<string, string> = {
      ready: 'Sẵn sàng',
      overwrite: 'Sẽ ghi đè',
      unmatched: 'Chưa ghép mẫu',
      ambiguous: 'Cần chọn mẫu',
      'not-in-sop': 'Ngoài SOP',
      'not-in-form': 'Không có trên form',
      unassigned: 'Không được phân',
      invalid: 'Không hợp lệ'
    };
    return labels[candidate.status] || candidate.status;
  }

  statusClass(candidate: ExcelImportCandidate): string {
    if (candidate.status === 'ready') {
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400';
    }
    if (candidate.status === 'overwrite') {
      return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400';
    }
    return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
  }

  async applySelected() {
    if (!this.file || this.selectedCount === 0 || this.isApplying || this.isReadOnly) return;
    this.isApplying = true;
    try {
      const appliedCount = applyExcelImportCandidates(
        this.candidates,
        this.context(),
        this.file.name,
        this.selectedDecimalPlaces()
      );
      this.applied.emit({ draft: this.draft, appliedCount });
    } finally {
      this.isApplying = false;
    }
  }

  private async loadFile(file: File) {
    this.isLoading = true;
    this.errorMessage = '';
    this.warnings = [];
    this.candidates = [];
    this.decimalMode = 'source';

    try {
      const XLSX = await import('xlsx');
      const workbook = XLSX.read(await file.arrayBuffer(), {
        type: 'array',
        cellDates: false,
        cellText: true
      });
      const parsed = parseMassHunterResultWorkbook(XLSX, workbook);
      this.warnings = parsed.warnings;
      this.candidates = buildExcelImportCandidates(parsed, this.context());

      if (this.candidates.length === 0 && this.warnings.length === 0) {
        this.errorMessage = 'File không có kết quả Final-Conc. phù hợp để nhập.';
      }
    } catch (error) {
      console.error('[Excel result import] Cannot parse workbook', error);
      this.errorMessage = 'Không đọc được file Excel. Vui lòng kiểm tra định dạng file MassHunter.';
    } finally {
      this.isLoading = false;
    }
  }

  private context(): ExcelImportContext {
    return {
      run: this.run,
      draft: this.draft,
      config: this.config,
      configKey: this.configKey
    };
  }

  private selectedDecimalPlaces(): number | null {
    if (this.decimalMode === 'source') return null;
    const parsed = Number(this.decimalMode);
    return Number.isInteger(parsed) && parsed >= 0 && parsed <= 6 ? parsed : null;
  }

  private areAllSelected(candidates: ExcelImportCandidate[]): boolean {
    const selectable = candidates.filter(candidate => candidate.selectable);
    return selectable.length > 0 && selectable.every(candidate => candidate.selected);
  }
}
