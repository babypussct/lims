import { Component, inject, signal, effect, computed, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { PrintService, PrintOptions } from '../../../core/services/print.service';
import { PrintLayoutComponent, PrintLayoutState } from '../print-layout/print-layout.component';
import { AppModalShellComponent } from '../ui/modal-shell/modal-shell.component';
import { AppButtonComponent } from '../ui/button/button.component';
import { ToastService } from '../../../core/services/toast.service';
import { timestampToDate } from '../../utils/timestamp';
import { downloadPreparedA4, printPreparedA4 } from '../../utils/a4-output';
import { openInNewTab } from '../../utils/browser-navigation';

@Component({
  selector: 'app-print-preview-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, PrintLayoutComponent, AppModalShellComponent, AppButtonComponent],
  template: `
    @if (printService.isPreviewOpen()) {
      <app-modal-shell title="Xem trước phiếu A4" size="xl"
        [description]="printService.previewJobs().length + ' phiếu · ' + layoutStatus().pageCount + ' trang A4'"
        [closeDisabled]="busy()" (closed)="close()">
        <div modalBody class="print-workspace flex min-h-0 flex-col gap-4 lg:flex-row" style="height:min(65vh,760px)">
          <details class="shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800 lg:w-56" open>
            <summary class="cursor-pointer text-sm font-bold text-slate-700 dark:text-slate-200">Tùy chọn bản in</summary>
            <div class="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-700 dark:text-slate-200 lg:grid-cols-1">
              @for (option of optionLabels; track option.key) {
                <label class="flex items-center gap-2">
                  <input type="checkbox" [ngModel]="options[option.key]" (ngModelChange)="setOption(option.key, $event)"
                    [disabled]="busy()" class="h-4 w-4 accent-indigo-600">
                  {{option.label}}
                </label>
              }
            </div>
            <p class="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">Phiếu ngắn ghép đôi. Phiếu dài được phân trang theo dòng của bảng.</p>
          </details>
          <div class="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span role="status" class="text-xs text-slate-600 dark:text-slate-300">
                {{layoutStatus().ready ? 'Bản in đã sẵn sàng' : layoutStatus().error ? 'Bản in chưa sẵn sàng' : 'Đang chuẩn bị bản in và mã QR…'}}
              </span>
              <div class="flex items-center gap-2">
                <app-button variant="ghost" size="sm" (click)="zoomOut()" [disabled]="busy()" title="Thu nhỏ">
                  <i class="fa-solid fa-minus" aria-hidden="true"></i><span class="sr-only">Thu nhỏ</span>
                </app-button>
                <span class="w-12 text-center text-xs text-slate-600 dark:text-slate-300">{{zoomLevel()}}%</span>
                <app-button variant="ghost" size="sm" (click)="zoomIn()" [disabled]="busy()" title="Phóng to">
                  <i class="fa-solid fa-plus" aria-hidden="true"></i><span class="sr-only">Phóng to</span>
                </app-button>
                <app-button variant="secondary" size="sm" (click)="fitWidth()" [disabled]="busy()">Vừa chiều rộng</app-button>
              </div>
            </div>
            @if (layoutStatus().error) {
              <div role="alert" class="rounded-xl bg-rose-50 p-3 text-sm text-rose-800 dark:bg-rose-950/40 dark:text-rose-200">
                {{layoutStatus().error}}
                <app-button variant="secondary" size="sm" (click)="layout?.retryLayout()" [disabled]="busy()">Thử lại</app-button>
              </div>
            }
            <div #previewViewport class="min-h-0 flex-1 overflow-auto rounded-xl bg-slate-200 p-3 dark:bg-slate-950">
              <div [style.width.px]="794 * zoomLevel()/100" [style.height.px]="(1123 + 16) * layoutStatus().pageCount * zoomLevel()/100" class="mx-auto">
                <div class="origin-top-left" [style.transform]="'scale(' + zoomLevel()/100 + ')'">
                  <app-print-layout [jobs]="printService.previewJobs()" [options]="options"
                    [preparedAt]="printService.previewPreparedAt()" (layoutState)="onLayoutState($event)"></app-print-layout>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div modalFooter class="print-workspace flex w-full flex-wrap justify-end gap-2">
          <app-button variant="secondary" (click)="close()" [disabled]="busy()">Đóng</app-button>
          <app-button variant="secondary" (click)="doPdf()" [loading]="isGeneratingPdf()" [disabled]="!layoutStatus().ready || printService.isPrinting()">
            <i class="fa-solid fa-file-pdf" aria-hidden="true"></i> Tải PDF
          </app-button>
          <app-button class="print-primary" (click)="doPrint()" [loading]="printService.isPrinting()" [disabled]="!layoutStatus().ready || isGeneratingPdf()">
            <i class="fa-solid fa-print" aria-hidden="true"></i> In
          </app-button>
        </div>
      </app-modal-shell>
    }

    @if (printService.isPreviewPdfOpen()) {
      <app-modal-shell [title]="printService.pdfTitle() || 'Xem tài liệu'" [size]="isFullscreen() ? '2xl' : 'xl'"
        [description]="pdfDescription()" [closeDisabled]="printService.isPrinting() || isPublishing()" (closed)="closePdfModal()">
        <div modalBody class="print-workspace flex min-h-0 flex-col gap-3" [style.height]="isFullscreen() ? '72vh' : '60vh'">
          <div class="flex flex-wrap items-center gap-2">
            @if (printService.docsUrl()) {
              <a [href]="printService.docsUrl()" target="_blank" rel="noopener noreferrer"
                class="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-indigo-600 dark:border-slate-700 dark:text-indigo-300">
                <i class="fa-solid fa-file-word" aria-hidden="true"></i> Google Docs
              </a>
            }
            <app-button variant="secondary" size="sm" (click)="copyPdfLink()">
              <i class="fa-solid fa-copy" aria-hidden="true"></i> {{isCopying() ? 'Đã sao chép' : 'Sao chép liên kết'}}
            </app-button>
            <app-button variant="ghost" size="sm" (click)="toggleFullscreen()">{{isFullscreen() ? 'Thu gọn' : 'Mở rộng'}}</app-button>
            @if (printService.onRepublishCallback()) {
              <app-button variant="secondary" size="sm" (click)="triggerRepublishFromModal()" [loading]="isPublishing()" [disabled]="printService.isPrinting()">
                <i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i> Tạo lại báo cáo
              </app-button>
            }
          </div>
          <div class="min-h-0 flex-1 overflow-auto rounded-xl bg-slate-100 dark:bg-slate-950">
            @if (printService.isPdfBlobLoading() || isPublishing()) {
              <div role="status" class="flex h-full items-center justify-center gap-3 p-6 text-slate-600 dark:text-slate-300">
                <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> {{isPublishing() ? 'Đang tạo báo cáo…' : 'Đang tải tài liệu…'}}
              </div>
            } @else if (pdfModalSafeUrl()) {
              @if (printService.pdfPreviewType() === 'image') {
                <img [src]="rawPdfUrl()" alt="Chứng chỉ phân tích" class="mx-auto max-h-full max-w-full object-contain">
              } @else {
                <iframe [src]="pdfModalSafeUrl()" title="Bản xem trước tài liệu PDF" class="h-full w-full border-0 bg-white"></iframe>
              }
            } @else {
              <div class="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                <p class="font-bold text-slate-700 dark:text-slate-200">Chưa tải được tài liệu</p>
                <p class="text-sm text-slate-500 dark:text-slate-400">Thử tải lại hoặc xác thực Google Drive để tiếp tục.</p>
                <app-button class="print-primary" (click)="retryLoadBlob()">Xác thực và tải lại</app-button>
              </div>
            }
          </div>
        </div>
        <div modalFooter class="print-workspace flex w-full flex-wrap justify-end gap-2">
          <app-button variant="secondary" (click)="closePdfModal()" [disabled]="printService.isPrinting() || isPublishing()">Đóng</app-button>
          <app-button variant="secondary" (click)="downloadPdf()" [loading]="printService.isDownloading()" [disabled]="printService.isPdfBlobLoading() || isPublishing()">
            <i class="fa-solid fa-download" aria-hidden="true"></i> Tải tài liệu
          </app-button>
          <app-button class="print-primary" (click)="printPdf()" [loading]="printService.isPrinting()"
            [disabled]="printService.isPdfBlobLoading() || isPublishing() || !pdfModalSafeUrl()">
            <i class="fa-solid fa-print" aria-hidden="true"></i> {{printService.pdfPreviewType() === 'image' ? 'Mở để in' : 'In PDF'}}
          </app-button>
        </div>
      </app-modal-shell>
    }
  `,
})
export class PrintPreviewModalComponent implements OnDestroy {
  printService = inject(PrintService);
  toast = inject(ToastService);
  private sanitizer = inject(DomSanitizer);
  @ViewChild(PrintLayoutComponent) layout?: PrintLayoutComponent;
  @ViewChild('previewViewport') viewport?: ElementRef<HTMLElement>;
  zoomLevel = signal(75);
  isGeneratingPdf = signal(false);
  layoutStatus = signal<PrintLayoutState>({ ready: false, pageCount: 0, error: null });
  options: PrintOptions = { ...this.printService.defaultOptions };
  optionLabels: { key: keyof PrintOptions; label: string }[] = [
    { key: 'showHeader', label: 'Tiêu đề' }, { key: 'showFooter', label: 'Chân trang' },
    { key: 'showSignature', label: 'Người duyệt' }, { key: 'showCutLine', label: 'Đường cắt' },
  ];
  isFullscreen = signal(false);
  isCopying = signal(false);
  isPublishing = signal(false);
  busy = computed(() => this.isGeneratingPdf() || this.printService.isPrinting());
  private printController?: AbortController;
  pdfModalSafeUrl = computed(() => {
    const url = this.printService.pdfBlobUrl();
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  });
  rawPdfUrl = computed(() => this.printService.pdfUrl() || '');
  pdfDescription = computed(() => this.printService.pdfVersion() > 0
    ? `Phiên bản ${this.printService.pdfVersion()} · ${this.printService.pdfAnalyst()} · ${this.formatPublishDate(this.printService.pdfPublishDate())}`
    : 'Chứng chỉ phân tích');

  constructor() {
    effect(() => {
      if (this.printService.isPreviewOpen()) {
        this.options = { ...this.printService.defaultOptions };
        this.layoutStatus.set({ ready: false, pageCount: 0, error: null });
        this.zoomLevel.set(75);
      }
    });
  }

  ngOnDestroy() { this.printController?.abort(); }
  close() { if (!this.busy()) this.printService.closePreview(); }
  zoomIn() { this.zoomLevel.update(value => Math.min(value + 10, 150)); }
  zoomOut() { this.zoomLevel.update(value => Math.max(value - 10, 25)); }
  fitWidth() {
    const width = this.viewport?.nativeElement.clientWidth;
    if (width) this.zoomLevel.set(Math.max(25, Math.min(100, Math.floor((width - 24) / 794 * 100))));
  }
  onLayoutState(state: PrintLayoutState) {
    this.layoutStatus.set(state);
    if (state.ready && window.innerWidth < 1024) this.fitWidth();
  }
  setOption(key: keyof PrintOptions, value: boolean) { this.options = { ...this.options, [key]: value }; }

  async doPrint(): Promise<void> {
    if (this.busy() || !this.layoutStatus().ready) return;
    this.printService.isPrinting.set(true);
    this.printController = new AbortController();
    try {
      await printPreparedA4(this.layout!.getPreparedContent(), this.printController.signal);
    } catch (error) {
      this.toast.show(error instanceof Error ? error.message : 'Không chuẩn bị được bản in.', 'error');
    } finally {
      this.printController = undefined;
      this.printService.isPrinting.set(false);
    }
  }

  async doPdf(): Promise<void> {
    if (this.busy() || !this.layoutStatus().ready) return;
    this.isGeneratingPdf.set(true);
    try {
      const date = this.printService.previewPreparedAt();
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      await downloadPreparedA4(this.layout!.getPreparedContent(), `LIMS_Phieu_${dateKey}.pdf`);
      this.toast.show('Đã tải PDF.', 'success');
    } catch (error) {
      this.toast.show(error instanceof Error ? error.message : 'Không tạo được PDF.', 'error');
    } finally {
      this.isGeneratingPdf.set(false);
    }
  }

  closePdfModal() { if (!this.printService.isPrinting() && !this.isPublishing()) { this.printService.closePdfPreview(); this.isFullscreen.set(false); } }
  toggleFullscreen() { this.isFullscreen.update(value => !value); }
  printPdf() {
    const url = this.printService.pdfUrl();
    if (!url) return;
    if (this.printService.pdfPreviewType() === 'image') openInNewTab(url);
    else void this.printService.quickPrint(url);
  }
  downloadPdf() {
    const url = this.printService.pdfUrl();
    if (url) void this.printService.quickDownload(url, `${this.printService.pdfTitle().replace(/[\/\\]/g, '_')}_v${this.printService.pdfVersion()}.pdf`);
  }
  retryLoadBlob() { void this.printService.retryLoadPdfBlob(); }
  async copyPdfLink() {
    const url = this.printService.pdfUrl();
    if (!url) return;
    try { await navigator.clipboard.writeText(url); this.isCopying.set(true); this.toast.show('Đã sao chép liên kết.', 'success'); }
    catch { this.toast.show('Không sao chép được liên kết.', 'error'); }
  }
  async triggerRepublishFromModal() {
    const callback = this.printService.onRepublishCallback();
    if (!callback || this.isPublishing() || this.printService.isPrinting()) return;
    this.isPublishing.set(true);
    try { await callback(); this.toast.show('Đã tạo lại báo cáo.', 'success'); }
    catch { this.toast.show('Không tạo lại được báo cáo.', 'error'); }
    finally { this.isPublishing.set(false); }
  }
  formatPublishDate(value: unknown): string { return timestampToDate(value)?.toLocaleString('vi-VN') || 'Chưa rõ ngày phát hành'; }
}
