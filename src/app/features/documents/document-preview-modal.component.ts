import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GoogleDriveService } from '../../core/services/google-drive.service';
import { openInNewTab } from '../../shared/utils/browser-navigation';
import { DocumentPreviewKind, DriveItem } from './document-viewer.models';
import { ExcelDocumentViewerComponent } from './excel-document-viewer.component';
import { PdfDocumentViewerComponent } from './pdf-document-viewer.component';

@Component({
  selector: 'app-document-preview-modal',
  standalone: true,
  imports: [CommonModule, ExcelDocumentViewerComponent, PdfDocumentViewerComponent],
  template: `
    <div class="document-preview-overlay fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm p-0 md:p-2 lg:p-3 animate-fade-in"
         (mousedown)="closeMenus()">
      <section #dialog
               class="document-preview-dialog w-full h-full min-h-0 bg-white dark:bg-slate-900 md:rounded-2xl shadow-2xl ring-1 ring-white/10 overflow-hidden flex flex-col"
               role="dialog"
               aria-modal="true"
               aria-labelledby="document-preview-title"
               tabindex="-1"
               (mousedown)="$event.stopPropagation()">
        <header class="document-preview-header min-h-14 md:h-14 shrink-0 flex items-center gap-2 px-2.5 md:px-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <div class="document-preview-file-icon w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
               [class.bg-red-50]="kind() === 'pdf'" [class.dark:bg-red-950]="kind() === 'pdf'"
               [class.text-red-600]="kind() === 'pdf'"
               [class.bg-emerald-50]="kind() === 'excel'" [class.dark:bg-emerald-950]="kind() === 'excel'"
               [class.text-emerald-600]="kind() === 'excel'"
               [class.bg-fuchsia-50]="kind() !== 'pdf' && kind() !== 'excel'"
               [class.dark:bg-fuchsia-950]="kind() !== 'pdf' && kind() !== 'excel'"
               [class.text-fuchsia-600]="kind() !== 'pdf' && kind() !== 'excel'">
            <i class="fa-solid" [class]="fileIcon()"></i>
          </div>

          <div class="min-w-0 flex-1">
            <h2 id="document-preview-title"
                class="text-sm md:text-[15px] font-black text-slate-800 dark:text-white truncate leading-tight"
                [title]="item.name">{{ item.name }}</h2>
            <div class="document-preview-meta mt-0.5 flex items-center gap-1.5 text-[10px] md:text-[11px] font-semibold text-slate-400 whitespace-nowrap overflow-hidden">
              <span class="uppercase">{{ typeLabel() }}</span>
              <span>•</span>
              <span>{{ formatSize(item.size) }}</span>
              <span class="hidden sm:inline">•</span>
              <span class="hidden sm:inline">{{ formatDate(item.modifiedTime) }}</span>
              <span class="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300">
                <i class="fa-solid fa-lock mr-1 text-[8px]"></i>Chỉ đọc
              </span>
            </div>
          </div>

          <div class="hidden sm:flex items-center gap-1.5 shrink-0">
            @if (kind() === 'pdf') {
              <button type="button" (click)="printDocument()" [disabled]="loading() || !!error()"
                      class="preview-action-button" title="In PDF">
                <i class="fa-solid fa-print"></i><span class="hidden lg:inline">In</span>
              </button>
            }
            <button type="button" (click)="downloadOriginal()" [disabled]="loading() && !previewBlob()"
                    class="preview-action-button preview-action-primary" title="Tải bản gốc">
              <i class="fa-solid fa-download"></i><span class="hidden lg:inline">Tải xuống</span>
            </button>
            <button type="button" (click)="openOriginal()" class="preview-action-button" title="Mở trong Google Drive">
              <i class="fa-solid fa-arrow-up-right-from-square"></i><span class="hidden xl:inline">Mở Drive</span>
            </button>
            <button type="button" (click)="toggleFullscreen()" class="preview-icon-button" title="Toàn màn hình" aria-label="Toàn màn hình">
              <i class="fa-solid" [class.fa-expand]="!fullscreen()" [class.fa-compress]="fullscreen()"></i>
            </button>
          </div>

          <div class="sm:hidden flex items-center gap-1 shrink-0">
            <button type="button" (click)="downloadOriginal()" [disabled]="loading() && !previewBlob()"
                    class="preview-icon-button text-fuchsia-600 dark:text-fuchsia-300" aria-label="Tải bản gốc">
              <i class="fa-solid fa-download"></i>
            </button>
            <div class="relative">
              <button type="button" (click)="toggleMobileMenu($event)" class="preview-icon-button" aria-label="Thêm hành động">
                <i class="fa-solid fa-ellipsis-vertical"></i>
              </button>
              @if (mobileMenuOpen()) {
                <div class="absolute right-0 top-11 z-50 w-48 p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl">
                  @if (kind() === 'pdf') {
                    <button type="button" (click)="printDocument()" class="preview-menu-item">
                      <i class="fa-solid fa-print"></i><span>In PDF</span>
                    </button>
                  }
                  <button type="button" (click)="openOriginal()" class="preview-menu-item">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i><span>Mở Google Drive</span>
                  </button>
                  <button type="button" (click)="toggleFullscreen()" class="preview-menu-item">
                    <i class="fa-solid" [class.fa-expand]="!fullscreen()" [class.fa-compress]="fullscreen()"></i>
                    <span>{{ fullscreen() ? 'Thoát toàn màn hình' : 'Toàn màn hình' }}</span>
                  </button>
                </div>
              }
            </div>
          </div>

          <button #closeButton type="button" (click)="requestClose()"
                  class="preview-icon-button hover:!bg-slate-100 dark:hover:!bg-slate-800"
                  title="Đóng (Esc)" aria-label="Đóng xem trước">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </header>

        <main class="flex-1 min-h-0 relative bg-slate-100 dark:bg-slate-950">
          @if (loading()) {
            <div class="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white dark:bg-slate-900">
              <div class="w-11 h-11 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-950/50 flex items-center justify-center">
                <i class="fa-solid fa-circle-notch fa-spin text-2xl text-fuchsia-600"></i>
              </div>
              <h3 class="mt-3 text-sm font-black text-slate-700 dark:text-slate-200">
                {{ loadingLabel() }}
              </h3>
              <p class="mt-1 text-xs text-slate-400">Tệp lớn có thể cần thêm vài giây</p>
              <button type="button" (click)="requestClose()" class="mt-4 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                Hủy
              </button>
            </div>
          }

          @if (error()) {
            <div class="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
              <div class="w-full max-w-md p-5 md:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl text-center">
                <div class="mx-auto w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-500 flex items-center justify-center">
                  <i class="fa-solid fa-triangle-exclamation text-xl"></i>
                </div>
                <h3 class="mt-3 text-base font-black text-slate-800 dark:text-white">Không thể xem trước tài liệu</h3>
                <p class="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{{ error() }}</p>
                <div class="mt-4 flex flex-col sm:flex-row justify-center gap-2">
                  <button type="button" (click)="retry()" class="px-4 py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-bold">
                    <i class="fa-solid fa-rotate-right mr-1.5"></i>Thử lại
                  </button>
                  <button type="button" (click)="downloadOriginal()" class="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold">
                    <i class="fa-solid fa-download mr-1.5"></i>Tải bản gốc
                  </button>
                  <button type="button" (click)="openOriginal()" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold">
                    Mở Drive
                  </button>
                </div>
              </div>
            </div>
          }

          @if (!error() && previewBlob()) {
            @switch (kind()) {
              @case ('pdf') {
                <app-pdf-document-viewer class="block h-full"
                  [blob]="previewBlob()!"
                  (ready)="onViewerReady()"
                  (failed)="onViewerError($event)">
                </app-pdf-document-viewer>
              }
              @case ('excel') {
                <app-excel-document-viewer class="block h-full"
                  [blob]="previewBlob()!"
                  [fileName]="item.name"
                  (ready)="onViewerReady()"
                  (failed)="onViewerError($event)">
                </app-excel-document-viewer>
              }
              @case ('image') {
                <div class="w-full h-full overflow-auto p-3 md:p-6 flex items-center justify-center">
                  <img [src]="objectUrl()" [alt]="item.name" (load)="onViewerReady()" (error)="onViewerError('Không thể hiển thị ảnh.')"
                       class="max-w-full max-h-full object-contain rounded-lg shadow-xl bg-white">
                </div>
              }
              @case ('video') {
                <div class="w-full h-full p-3 md:p-6 flex items-center justify-center bg-black">
                  <video [src]="objectUrl()" controls playsinline (loadedmetadata)="onViewerReady()"
                         class="max-w-full max-h-full rounded-lg shadow-xl"></video>
                </div>
              }
              @case ('audio') {
                <div class="w-full h-full p-5 flex flex-col items-center justify-center">
                  <div class="w-24 h-24 rounded-3xl bg-fuchsia-100 dark:bg-fuchsia-950 text-fuchsia-600 flex items-center justify-center shadow-inner">
                    <i class="fa-solid fa-wave-square text-4xl"></i>
                  </div>
                  <audio [src]="objectUrl()" controls (loadedmetadata)="onViewerReady()" class="mt-6 w-full max-w-xl"></audio>
                </div>
              }
              @case ('text') {
                <div class="w-full h-full overflow-auto p-3 md:p-6">
                  <pre class="min-h-full max-w-6xl mx-auto p-4 md:p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs md:text-sm leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-wrap break-words">{{ previewText() }}</pre>
                </div>
              }
            }
          } @else if (!error() && kind() === 'drive' && safeUrl()) {
            <iframe [src]="safeUrl()" (load)="onViewerReady()" [title]="'Xem trước ' + item.name"
                    class="w-full h-full border-0 bg-white"></iframe>
          }
        </main>
      </section>
    </div>
  `,
  styles: [`
    .document-preview-overlay {
      height: 100dvh;
      min-height: 100dvh;
      max-height: 100dvh;
      overflow: hidden;
      padding-top: max(0px, env(safe-area-inset-top));
      padding-bottom: max(0px, env(safe-area-inset-bottom));
    }
    .document-preview-dialog {
      height: 100%;
      max-height: 100%;
      min-height: 0;
    }
    .preview-action-button {
      height: 2.25rem;
      padding-inline: .7rem;
      border-radius: .6rem;
      border: 1px solid #e2e8f0;
      color: #475569;
      display: inline-flex;
      align-items: center;
      gap: .4rem;
      font-size: .72rem;
      font-weight: 800;
      transition: color .15s, background-color .15s, border-color .15s;
    }
    .preview-action-button:hover:not(:disabled) { color: #c026d3; background: #fdf4ff; border-color: #f0abfc; }
    .preview-action-button:disabled { opacity: .4; cursor: not-allowed; }
    .preview-action-primary { color: white; background: #c026d3; border-color: #c026d3; }
    .preview-action-primary:hover:not(:disabled) { color: white; background: #a21caf; border-color: #a21caf; }
    .preview-icon-button {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: .6rem;
      color: #64748b;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: color .15s, background-color .15s;
    }
    .preview-icon-button:hover { color: #c026d3; background: #fdf4ff; }
    .preview-menu-item {
      width: 100%;
      min-height: 2.5rem;
      padding-inline: .65rem;
      border-radius: .55rem;
      color: #475569;
      display: flex;
      align-items: center;
      gap: .65rem;
      font-size: .75rem;
      font-weight: 700;
      text-align: left;
    }
    .preview-menu-item i { width: 1rem; color: #a21caf; }
    .preview-menu-item:hover { background: #f8fafc; }
    :host-context(.dark) .preview-action-button { color: #cbd5e1; border-color: #334155; }
    :host-context(.dark) .preview-action-button:hover:not(:disabled) { color: #f0abfc; background: rgba(112,26,117,.3); border-color: #86198f; }
    :host-context(.dark) .preview-action-primary { color: white; background: #a21caf; border-color: #a21caf; }
    :host-context(.dark) .preview-icon-button { color: #cbd5e1; }
    :host-context(.dark) .preview-icon-button:hover { color: #f0abfc; background: rgba(112,26,117,.3); }
    :host-context(.dark) .preview-menu-item { color: #e2e8f0; }
    :host-context(.dark) .preview-menu-item:hover { background: #334155; }
    @media (max-width: 640px), (max-height: 640px) {
      .document-preview-header {
        min-height: 3rem;
        height: 3rem;
      }
      .document-preview-file-icon {
        width: 2rem;
        height: 2rem;
      }
      .document-preview-meta {
        display: none;
      }
    }
  `],
})
export class DocumentPreviewModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input({ required: true }) item!: DriveItem;
  @Output() closed = new EventEmitter<void>();

  @ViewChild('dialog') dialog?: ElementRef<HTMLElement>;
  @ViewChild('closeButton') closeButton?: ElementRef<HTMLButtonElement>;
  @ViewChild(ExcelDocumentViewerComponent) excelViewer?: ExcelDocumentViewerComponent;

  private readonly driveService = inject(GoogleDriveService);
  private readonly sanitizer = inject(DomSanitizer);

  kind = signal<DocumentPreviewKind>('drive');
  previewBlob = signal<Blob | null>(null);
  objectUrl = signal('');
  safeUrl = signal<SafeResourceUrl | null>(null);
  previewText = signal('');
  loading = signal(true);
  error = signal<string | null>(null);
  mobileMenuOpen = signal(false);
  fullscreen = signal(false);
  loadingLabel = computed(() => {
    if (this.kind() === 'pdf') return 'Đang chuẩn bị PDF...';
    if (this.kind() === 'excel') return 'Đang đọc workbook...';
    return 'Đang tải bản xem trước...';
  });
  typeLabel = computed(() => {
    const labels: Record<DocumentPreviewKind, string> = {
      pdf: 'PDF',
      excel: this.item?.name.toLowerCase().endsWith('.csv') ? 'CSV' : 'Excel',
      image: 'Hình ảnh',
      video: 'Video',
      audio: 'Âm thanh',
      text: 'Văn bản',
      drive: 'Google Drive',
    };
    return labels[this.kind()];
  });
  fileIcon = computed(() => {
    const icons: Record<DocumentPreviewKind, string> = {
      pdf: 'fa-file-pdf',
      excel: 'fa-file-excel',
      image: 'fa-file-image',
      video: 'fa-file-video',
      audio: 'fa-file-audio',
      text: 'fa-file-lines',
      drive: 'fa-file',
    };
    return icons[this.kind()];
  });

  private abortController?: AbortController;
  private previousFocus?: HTMLElement | null;
  private previousBodyOverflow = '';

  ngOnInit(): void {
    this.kind.set(this.detectKind(this.item));
    this.previousFocus = document.activeElement as HTMLElement | null;
    this.previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    void this.loadPreview();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.dialog?.nativeElement.focus());
  }

  ngOnDestroy(): void {
    this.abortController?.abort();
    this.releaseObjectUrl();
    document.body.style.overflow = this.previousBodyOverflow;
    if (document.fullscreenElement === this.dialog?.nativeElement) {
      void document.exitFullscreen().catch(() => undefined);
    }
    setTimeout(() => this.previousFocus?.focus());
  }

  @HostListener('document:fullscreenchange')
  onFullscreenChange(): void {
    this.fullscreen.set(document.fullscreenElement === this.dialog?.nativeElement);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      if (this.kind() === 'excel' && this.excelViewer?.handleEscape()) {
        event.preventDefault();
        return;
      }
      if (this.mobileMenuOpen()) {
        this.mobileMenuOpen.set(false);
      } else if (document.fullscreenElement) {
        void document.exitFullscreen();
      } else {
        this.requestClose();
      }
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'p' && this.kind() === 'pdf') {
      event.preventDefault();
      this.printDocument();
      return;
    }

    if (event.key !== 'Tab') return;
    const container = this.dialog?.nativeElement;
    if (!container) return;
    const focusable = Array.from(container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), video[controls], audio[controls], [tabindex]:not([tabindex="-1"])'
    )).filter(element => !element.hasAttribute('hidden') && element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  requestClose(): void {
    this.closed.emit();
  }

  closeMenus(): void {
    this.mobileMenuOpen.set(false);
  }

  toggleMobileMenu(event: Event): void {
    event.stopPropagation();
    this.mobileMenuOpen.update(value => !value);
  }

  retry(): void {
    void this.loadPreview();
  }

  onViewerReady(): void {
    this.loading.set(false);
  }

  onViewerError(message: string): void {
    this.loading.set(false);
    this.error.set(message || 'Không thể hiển thị tài liệu.');
  }

  openOriginal(): void {
    const link = this.item.webViewLink || `https://drive.google.com/file/d/${this.item.id}/view`;
    openInNewTab(link);
    this.mobileMenuOpen.set(false);
  }

  downloadOriginal(): void {
    const blob = this.previewBlob();
    if (blob) {
      const url = this.objectUrl() || URL.createObjectURL(blob);
      const temporary = !this.objectUrl();
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = this.exportFileName();
      anchor.click();
      if (temporary) setTimeout(() => URL.revokeObjectURL(url), 1000);
    } else if (this.item.webContentLink) {
      openInNewTab(this.item.webContentLink);
    } else {
      this.openOriginal();
    }
    this.mobileMenuOpen.set(false);
  }

  printDocument(): void {
    const url = this.objectUrl();
    if (url) openInNewTab(url);
    else this.openOriginal();
    this.mobileMenuOpen.set(false);
  }

  async toggleFullscreen(): Promise<void> {
    const container = this.dialog?.nativeElement;
    if (!container) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await container.requestFullscreen();
    } catch {
      // Fullscreen may be blocked by managed mobile browsers.
    }
    this.mobileMenuOpen.set(false);
  }

  formatSize(bytes?: string): string {
    if (!bytes) return 'Không rõ dung lượng';
    const value = Number(bytes);
    if (!Number.isFinite(value)) return 'Không rõ dung lượng';
    if (value < 1024) return `${value} B`;
    if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
    return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  }

  formatDate(value?: string): string {
    if (!value) return 'Không rõ ngày cập nhật';
    return new Date(value).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private async loadPreview(): Promise<void> {
    this.abortController?.abort();
    this.releaseObjectUrl();
    const controller = new AbortController();
    this.abortController = controller;
    this.previewBlob.set(null);
    this.safeUrl.set(null);
    this.previewText.set('');
    this.loading.set(true);
    this.error.set(null);

    try {
      const kind = this.kind();
      if (kind === 'drive') {
        const previewLink = this.item.mimeType.startsWith('application/vnd.google-apps.')
          ? (this.item.webViewLink || `https://drive.google.com/open?id=${this.item.id}`).replace(/\/edit.*$/, '/preview')
          : `https://drive.google.com/file/d/${this.item.id}/preview`;
        this.safeUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(previewLink));
        return;
      }

      const blob = this.item.mimeType === 'application/vnd.google-apps.spreadsheet'
        ? await this.driveService.exportPublicFile(
            this.item.id,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            controller.signal
          )
        : await this.driveService.downloadPublicFile(this.item.id, controller.signal);
      if (controller.signal.aborted) return;
      this.previewBlob.set(blob);

      const url = URL.createObjectURL(blob);
      this.objectUrl.set(url);
      if (kind === 'text') {
        this.previewText.set(await blob.text());
        this.loading.set(false);
      }
    } catch (error: any) {
      if (error?.name === 'AbortError') return;
      this.loading.set(false);
      this.error.set(error instanceof Error ? error.message : 'Không thể tải bản xem trước tài liệu.');
    }
  }

  private detectKind(item: DriveItem): DocumentPreviewKind {
    const name = item.name.toLowerCase();
    const mime = item.mimeType.toLowerCase();
    if (name.endsWith('.pdf') || mime === 'application/pdf') return 'pdf';
    if (
      /\.(xlsx|xls|xlsm|csv)$/.test(name) ||
      mime === 'application/vnd.google-apps.spreadsheet' ||
      mime.includes('spreadsheet') ||
      mime.includes('excel') ||
      mime === 'text/csv'
    ) return 'excel';
    if (mime.startsWith('image/') || /\.(png|jpe?g|gif|webp|bmp|svg)$/.test(name)) return 'image';
    if (mime.startsWith('video/')) return 'video';
    if (mime.startsWith('audio/')) return 'audio';
    if (mime.startsWith('text/') || /\.(txt|log|md|json|xml|csv)$/.test(name)) return 'text';
    return 'drive';
  }

  private exportFileName(): string {
    if (this.item.mimeType === 'application/vnd.google-apps.spreadsheet' && !/\.xlsx$/i.test(this.item.name)) {
      return `${this.item.name}.xlsx`;
    }
    return this.item.name || 'tai-lieu';
  }

  private releaseObjectUrl(): void {
    const url = this.objectUrl();
    if (url) URL.revokeObjectURL(url);
    this.objectUrl.set('');
  }
}
