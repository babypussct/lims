import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnalysisResultDraft } from '../../../core/models/analysis-result.model';
import { ProgressService } from '../../../core/services/progress.service';
import { ReportService } from '../../../core/services/report.service';
import {
  applyExcelImportCandidates,
  buildExcelImportCandidates,
  formatImportedFinalConc,
  updateCandidateSample
} from '../import/excel-result-import';
import { readExcelResultFile } from '../import/excel-result-import-reader';
import {
  ExcelImportCandidate,
  ExcelImportCandidateKind,
  ExcelImportContext
} from '../import/excel-result-import.models';
import { ModalA11yDirective } from '../../../shared/directives/modal-a11y.directive';

@Component({
  selector: 'app-excel-result-import-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalA11yDirective],
  templateUrl: './excel-result-import-modal.component.html'
})
export class ExcelResultImportModalComponent implements OnChanges, OnDestroy {
  private progressService = inject(ProgressService);
  private reportService = inject(ReportService);
  private loadAbortController?: AbortController;

  @Input() file: File | null = null;
  @Input() run: any = null;
  @Input() draft!: AnalysisResultDraft;
  @Input() config: any = null;
  @Input() configKey: string | null = null;
  @Input() masterTargets: any[] = [];
  @Input() isReadOnly = false;

  @Output() cancelled = new EventEmitter<void>();
  @Output() applied = new EventEmitter<{
    draft: AnalysisResultDraft;
    appliedCount: number;
    originalFileSaved: boolean;
    originalFileName?: string;
  }>();

  candidates: ExcelImportCandidate[] = [];
  warnings: string[] = [];
  errorMessage = '';
  isLoading = false;
  loadingProgress = 0;
  loadingMessage = 'Đang chuẩn bị đọc dữ liệu Excel...';
  isApplying = false;
  decimalMode = 'source';
  writeNdToResult = false;
  saveOriginalFile = false;
  uploadErrorMessage = '';

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['file'] && this.file) {
      this.saveOriginalFile = this.draft?.page1Data?.['uploadMassHunterToDrive'] === true;
      this.writeNdToResult = this.defaultWriteNdToResult();
      await this.loadFile(this.file);
    }
  }

  ngOnDestroy(): void {
    this.loadAbortController?.abort();
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

  get fileSizeLabel(): string {
    const bytes = this.file?.size || 0;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  get hasStoredOriginalFile(): boolean {
    return Boolean(
      this.draft?.page1Data?.['sourceExcelUrl']
      || this.draft?.page1Data?.['massHunterExcelUrl']
    );
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

  displayImportValue(candidate: ExcelImportCandidate): string {
    if (candidate.kind === 'result' && candidate.isNd && !this.writeNdToResult) {
      return 'Để trống';
    }
    return candidate.importValue;
  }

  get ndResultHint(): string {
    if (this.isSop01()) {
      return 'Bỏ chọn: để trống ô kết quả; SOP-01 vẫn hiểu là ND.';
    }
    const usesSeparateNdCheckbox = this.config?.formType === 'type3b'
      && this.draft?.page1Data?.['printFormType'] === 'formCheck';
    return usesSeparateNdCheckbox
      ? 'Bỏ chọn: để trống ô kết quả, vẫn đánh dấu checkbox ND.'
      : 'Bỏ chọn: để trống ô kết quả.';
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
    this.uploadErrorMessage = '';
    try {
      let savedFileName: string | undefined;
      if (this.saveOriginalFile) {
        try {
          savedFileName = await this.uploadOriginalFile(this.file);
        } catch (error) {
          this.progressService.stop();
          const message = error instanceof Error ? error.message : String(error);
          this.uploadErrorMessage =
            `Không thể lưu tệp Excel gốc: ${message}. Bạn có thể thử lại hoặc bỏ chọn lưu tệp để chỉ nhập số liệu.`;
          return;
        }
      }

      const appliedCount = applyExcelImportCandidates(
        this.candidates,
        this.context(),
        this.file.name,
        this.selectedDecimalPlaces(),
        this.writeNdToResult
      );
      this.draft.page1Data['uploadMassHunterToDrive'] = this.saveOriginalFile;
      this.draft.page1Data['excelImportWriteNdToResult'] = this.writeNdToResult;
      this.applied.emit({
        draft: this.draft,
        appliedCount,
        originalFileSaved: this.saveOriginalFile,
        originalFileName: savedFileName
      });
    } finally {
      this.isApplying = false;
    }
  }

  requestCancel() {
    if (this.isApplying) return;
    this.loadAbortController?.abort();
    this.cancelled.emit();
  }

  private async loadFile(file: File) {
    this.loadAbortController?.abort();
    const controller = new AbortController();
    this.loadAbortController = controller;
    this.isLoading = true;
    this.loadingProgress = 0;
    this.loadingMessage = 'Đang chuẩn bị đọc dữ liệu Excel...';
    this.errorMessage = '';
    this.warnings = [];
    this.candidates = [];
    this.decimalMode = 'source';
    this.uploadErrorMessage = '';

    try {
      const parsed = await readExcelResultFile(
        file,
        this.context(),
        progress => {
          this.loadingProgress = progress.percent;
          this.loadingMessage = progress.message;
        },
        controller.signal
      );
      if (controller.signal.aborted) return;

      this.loadingProgress = 95;
      this.loadingMessage = 'Đang hoàn tất đối chiếu với dữ liệu trên form...';
      this.warnings = parsed.warnings;
      this.candidates = buildExcelImportCandidates(parsed, this.context());
      this.loadingProgress = 100;

      if (this.candidates.length === 0 && this.warnings.length === 0) {
        this.errorMessage = 'File không có kết quả Final-Conc. phù hợp để nhập.';
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      console.error('[Excel result import] Cannot parse workbook', error);
      this.errorMessage = 'Không đọc được file Excel. Vui lòng kiểm tra định dạng file MassHunter.';
    } finally {
      if (this.loadAbortController === controller) {
        this.loadAbortController = undefined;
        this.isLoading = false;
      }
    }
  }

  private context(): ExcelImportContext {
    return {
      run: this.run,
      draft: this.draft,
      config: this.config,
      configKey: this.configKey,
      masterTargets: this.masterTargets
    };
  }

  private selectedDecimalPlaces(): number | null {
    if (this.decimalMode === 'source') return null;
    const parsed = Number(this.decimalMode);
    return Number.isInteger(parsed) && parsed >= 0 && parsed <= 6 ? parsed : null;
  }

  private defaultWriteNdToResult(): boolean {
    const savedPreference = this.draft?.page1Data?.['excelImportWriteNdToResult'];
    if (typeof savedPreference === 'boolean') return savedPreference;
    if (this.isSop01()) return false;

    const usesSeparateNdCheckbox = this.config?.formType === 'type3b'
      && this.draft?.page1Data?.['printFormType'] === 'formCheck';
    return !usesSeparateNdCheckbox;
  }

  private isSop01(): boolean {
    return this.configKey === 'fipronil-chlorpyrifos'
      || this.run?.sopId === 'SOP-01';
  }

  private areAllSelected(candidates: ExcelImportCandidate[]): boolean {
    const selectable = candidates.filter(candidate => candidate.selectable);
    return selectable.length > 0 && selectable.every(candidate => candidate.selected);
  }

  private async uploadOriginalFile(file: File): Promise<string> {
    this.progressService.start(
      'Đang lưu tệp Excel gốc',
      'Đang chuẩn bị dữ liệu để tải lên Google Drive...',
      100
    );
    this.progressService.update(5);

    const fileData = await this.readFileAsDataUrl(file);
    this.progressService.update(25, 'Đang truyền tệp Excel lên Google Drive...');

    const normalizedFileName = this.buildStoredFileName(file);
    const response = await this.reportService.uploadExcelToDrive(
      this.draft.requestId,
      normalizedFileName,
      fileData,
      this.draft.sopId,
      percent => {
        const overallPercent = 25 + Math.round(percent * 0.65);
        this.progressService.update(overallPercent, 'Đang truyền tệp Excel lên Google Drive...');
      }
    );

    if (!response.success || !response.fileUrl) {
      throw new Error(response.error || 'Google Drive không trả về liên kết tệp.');
    }

    this.progressService.update(95, 'Đang liên kết tệp nguồn với mẻ chạy...');
    const storedFileName = response.fileName || normalizedFileName;
    this.draft.page1Data['sourceExcelUrl'] = response.fileUrl;
    this.draft.page1Data['sourceExcelName'] = storedFileName;
    this.draft.page1Data['sourceExcelOriginalName'] = file.name;
    this.draft.page1Data['sourceExcelSize'] = file.size;
    this.draft.page1Data['sourceExcelUploadedAt'] = new Date().toISOString();
    // Giữ các khóa cũ để dữ liệu và UI MassHunter trước đây tiếp tục tương thích.
    this.draft.page1Data['massHunterExcelUrl'] = response.fileUrl;
    this.draft.page1Data['massHunterExcelName'] = storedFileName;
    this.draft.page1Data['massHunterExcelOriginalName'] = file.name;
    this.draft.page1Data['massHunterExcelSize'] = file.size;
    this.draft.page1Data['massHunterExcelUploadedAt'] = this.draft.page1Data['sourceExcelUploadedAt'];
    this.progressService.update(100, 'Đã lưu tệp Excel gốc thành công.');
    this.progressService.complete();
    return storedFileName;
  }

  private readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Không đọc được nội dung tệp.'));
      reader.onprogress = event => {
        if (event.lengthComputable) {
          this.progressService.update(
            5 + Math.round((event.loaded / event.total) * 15),
            'Đang chuẩn bị dữ liệu để tải lên Google Drive...'
          );
        }
      };
      reader.onload = () => resolve(String(reader.result || ''));
      reader.readAsDataURL(file);
    });
  }

  private buildStoredFileName(file: File): string {
    const batchCode = this.run?.inputs?.['batchCode']
      || this.run?.id
      || this.draft.requestId
      || new Date().toISOString().slice(0, 10);
    const versionSuffix = this.draft.version ? `_v${this.draft.version}` : '';
    const extensionIndex = file.name.lastIndexOf('.');
    const extension = extensionIndex >= 0 ? file.name.slice(extensionIndex) : '.xlsx';
    const safePart = (value: unknown) => String(value || '')
      .trim()
      .replace(/[\\/:*?"<>|]+/g, '_')
      .replace(/\s+/g, '_');

    return `RAW_${safePart(this.draft.sopId)}_${safePart(batchCode)}${versionSuffix}${extension}`;
  }
}
