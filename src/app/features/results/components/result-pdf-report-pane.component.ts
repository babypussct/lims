import { ReportBulkPrintComponent } from './report-bulk-print.component';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AnalysisResultDraft } from '../../../core/models/analysis-result.model';
import { GoogleDriveService } from '../../../core/services/google-drive.service';
import { getSafeGoogleUrl } from '../../../shared/utils/report-url';
import { formatSampleList } from '../../../shared/utils/utils';
import { timestampToDate } from '../../../shared/utils/timestamp';
import { AppUiProgressComponent } from '../../../shared/components/ui/progress/progress.component';
import { AppUiTimelineComponent } from '../../../shared/components/ui/timeline/timeline.component';
import { TimelineItem } from '../../../shared/components/ui/timeline/timeline.model';
import {
  BatchReportsProjection,
  ReportCardProjection,
  buildBatchReportsProjection,
} from '../services/result-reports-projection';

export interface PdfPaneModalEvent {
  pdfUrl: string;
  docsUrl?: string;
  prefix?: string;
  version?: number;
  publishedBy?: string;
  publishedAt?: any;
}

@Component({
  selector: 'app-result-pdf-report-pane',
  standalone: true,
  imports: [ReportBulkPrintComponent,
    CommonModule,
    FormsModule,
    AppUiProgressComponent,
    AppUiTimelineComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let proj = projection();
    @let selectedCard = activeCard();
    <div class="flex flex-col h-full min-h-0 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      <div class="p-2"><app-report-bulk-print [cards]="proj.cards" [samples]="run?.sampleList || []" /></div>
      <!-- Top Pane Header & Tabs -->
      <div class="px-3 sm:px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/30 shrink-0 space-y-2.5">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="inline-flex max-w-full overflow-x-auto items-center gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            <button type="button"
                    (click)="activeTab.set('preview')"
                    [class]="activeTab() === 'preview'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 font-semibold'"
                    class="min-h-[38px] sm:min-h-0 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition inline-flex items-center gap-1.5">
              <i class="fa-solid fa-file-pdf text-rose-500 text-[11px]" aria-hidden="true"></i>
              <span>Xem trước PDF</span>
            </button>
            <button type="button"
                    (click)="activeTab.set('reports')"
                    [class]="activeTab() === 'reports'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 font-semibold'"
                    class="min-h-[38px] sm:min-h-0 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition inline-flex items-center gap-1.5">
              <i class="fa-solid fa-layer-group text-indigo-500 text-[11px]" aria-hidden="true"></i>
              <span>Báo cáo &amp; Lịch sử ({{ proj.cards.length }})</span>
              @if (proj.hasStaleReport) {
                <span class="w-2 h-2 rounded-full bg-amber-500" title="Có báo cáo cũ hơn số liệu hiện tại"></span>
              }
            </button>
          </div>

          <div class="flex items-center gap-1.5 shrink-0">
            @if (selectedCard?.docsUrl || overrideDocsUrl()) {
              <a [href]="safeDocsUrl(overrideDocsUrl() || selectedCard?.docsUrl || '')"
                 target="_blank"
                 rel="noopener noreferrer"
                 class="inline-flex min-h-[38px] sm:min-h-0 sm:h-8 items-center gap-1.5 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                 title="Mở Google Docs gốc">
                <i class="fa-solid fa-file-word text-blue-500" aria-hidden="true"></i>
                <span class="hidden sm:inline">Docs</span>
              </a>
            }
            @if (currentPdfUrl()) {
              <button type="button"
                      (click)="triggerModalPreview()"
                      aria-label="Mở PDF toàn màn hình"
                      title="Mở PDF toàn màn hình (Modal hệ thống)"
                      class="flex h-10 w-10 sm:h-8 sm:w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition">
                <i class="fa-solid fa-expand text-xs" aria-hidden="true"></i>
              </button>
            }
            @if (showCloseButton) {
              <button type="button"
                      (click)="closed.emit()"
                      aria-label="Đóng khung Báo cáo & PDF"
                      title="Đóng khung Báo cáo & PDF"
                      class="flex h-10 w-10 sm:h-8 sm:w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition">
                <i class="fa-solid fa-xmark text-xs" aria-hidden="true"></i>
              </button>
            }
          </div>
        </div>

        @if (activeTab() === 'preview' && proj.cards.length > 0) {
          <div class="flex flex-wrap items-center justify-between gap-2">
            @if (proj.cards.length > 1) {
              <select [ngModel]="selectedCardId()"
                      (ngModelChange)="onReportSelect($event)"
                      aria-label="Chọn phiên bản PDF xem trước"
                      class="flex-1 min-w-[180px] bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                @for (card of proj.cards; track card.id) {
                  <option [value]="card.id">
                    v{{ card.version }} · {{ card.subtitle }}{{ card.isStale ? ' (Cần xuất lại)' : '' }}
                  </option>
                }
              </select>
            } @else if (selectedCard) {
              <div class="flex items-center gap-2 min-w-0 text-xs">
                <span class="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold text-[10px]">
                  v{{ selectedCard.version }}
                </span>
                <span class="font-semibold text-slate-700 dark:text-slate-200 truncate">
                  {{ selectedCard.subtitle }} · {{ selectedCard.title }}
                </span>
              </div>
            }

            @if (selectedCard?.isStale) {
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 text-[10px] font-bold">
                <i class="fa-solid fa-rotate text-[9px]" aria-hidden="true"></i> Bản cũ sau khi sửa (Stale)
              </span>
            }
          </div>
        }
      </div>

      <!-- TAB 1: PDF PREVIEW -->
      @if (activeTab() === 'preview') {
        <div class="flex-1 min-h-0 bg-slate-100/60 dark:bg-slate-950/50 flex flex-col relative">
          @let pdfUrl = currentPdfUrl();
          @if (pdfUrl) {
            @if (isLoadingPdf()) {
              <div class="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center">
                <div class="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
                  <i class="fa-solid fa-circle-notch fa-spin text-lg text-indigo-600 dark:text-indigo-400" aria-hidden="true"></i>
                </div>
                <div>
                  <p class="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Đang tải PDF...</p>
                  <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Tải trực tiếp tệp từ Google Drive</p>
                </div>
              </div>
            } @else if (needsAuth()) {
              <div class="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-center">
                <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center border border-amber-200/70 dark:border-amber-900/40">
                  <i class="fa-solid fa-key text-xl text-amber-500" aria-hidden="true"></i>
                </div>
                <div>
                  <p class="text-sm font-bold text-slate-700 dark:text-slate-200">Cần xác thực Google Drive</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">Phiên xác thực đã hết hạn. Xác thực lại để xem PDF trực tiếp hoặc mở bằng modal hệ thống.</p>
                </div>
                <div class="flex items-center gap-2">
                  <button type="button" (click)="beginDriveAuth()"
                          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition active:scale-95">
                    <i class="fa-solid fa-rotate-right mr-1.5" aria-hidden="true"></i>Xác thực &amp; tải lại
                  </button>
                  <button type="button" (click)="triggerModalPreview()"
                          class="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 transition">
                    Mở modal
                  </button>
                </div>
              </div>
            } @else if (pdfError()) {
              <div class="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center">
                <i class="fa-solid fa-triangle-exclamation text-2xl text-amber-500" aria-hidden="true"></i>
                <div>
                  <p class="text-sm font-bold text-slate-700 dark:text-slate-200">Không thể tải PDF trực tiếp</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Bạn vẫn có thể mở bằng cửa sổ xem PDF của hệ thống.</p>
                </div>
                <button type="button" (click)="triggerModalPreview()"
                        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition active:scale-95">
                  <i class="fa-solid fa-expand mr-1.5" aria-hidden="true"></i>Mở qua hệ thống
                </button>
              </div>
            } @else if (safePdfUrl()) {
              <iframe [src]="safePdfUrl()!" title="Xem trước PDF báo cáo kết quả" class="w-full h-full min-h-[360px] border-none bg-white flex-1"></iframe>
            } @else {
              <div class="flex-1 flex flex-col items-center justify-center gap-2 p-6 text-center">
                <i class="fa-solid fa-file-pdf text-3xl text-rose-400 animate-pulse" aria-hidden="true"></i>
                <p class="text-xs text-slate-400">Đang chuẩn bị PDF...</p>
              </div>
            }
          } @else {
            <div class="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-8 text-center space-y-3">
              <i class="fa-regular fa-file-pdf text-4xl" aria-hidden="true"></i>
              <p class="text-xs sm:text-sm font-medium max-w-xs">{{ emptyPreviewMessage() }}</p>
            </div>
          }
        </div>
      }

      <!-- TAB 2: ACTIVE REPORTS & HISTORY -->
      @if (activeTab() === 'reports') {
        <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 space-y-4">
          <!-- Coverage Progress -->
          <div class="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/30 p-3.5 space-y-2">
            <div class="flex items-center justify-between text-xs font-bold">
              <span class="text-slate-600 dark:text-slate-300">Độ phủ báo cáo PDF</span>
              <span class="tabular-nums"
                    [class]="proj.coverage.percent === 100 && !proj.hasStaleReport ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'">
                {{ proj.coverage.published }}/{{ proj.coverage.total }} mẫu · {{ proj.coverage.percent }}%
              </span>
            </div>
            <app-ui-progress
              [value]="proj.coverage.published"
              [max]="proj.coverage.total || 1"
              [status]="proj.coverage.percent === 100 && !proj.hasStaleReport ? 'success' : 'primary'"
              ariaLabel="Tiến độ xuất báo cáo" />
          </div>

          <!-- Unpublished warning -->
          @if (proj.coverage.unpublishedSamples.length > 0 && draft?.status !== 'completed') {
            <div class="rounded-2xl border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/70 dark:bg-amber-950/20 px-3.5 py-2.5 text-xs">
              <div class="font-bold text-amber-800 dark:text-amber-300">Còn {{ proj.coverage.unpublishedSamples.length }} mẫu chưa có PDF hợp lệ</div>
              <div class="mt-1 font-mono text-[11px] text-amber-700/90 dark:text-amber-300/90 break-words">
                {{ proj.coverage.unpublishedSamples.join(', ') }}
              </div>
            </div>
          }

          <!-- Current Draft Restore Banner (when v > 1) -->
          @if (canRestore && !isReadOnly && (draft?.version || 0) >= 1 && (draft?.pdfViewUrl || draft?.pdfUrl)) {
            <div class="flex items-center justify-between gap-2 rounded-2xl border border-indigo-200/70 dark:border-indigo-900/40 bg-indigo-50/60 dark:bg-indigo-950/20 px-3.5 py-2.5 text-xs">
              <div class="min-w-0">
                <div class="font-bold text-indigo-800 dark:text-indigo-200">Phiên bản gần nhất đang lưu: v{{ draft?.version }}</div>
                <div class="text-[11px] text-indigo-600/80 dark:text-indigo-300/80 truncate">Cập nhật bởi {{ draft?.updatedBy || 'Hệ thống' }}</div>
              </div>
              <button type="button"
                      [disabled]="isProcessing"
                      (click)="restoreVersion.emit({ version: draft?.version ?? 1 })"
                      class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition disabled:opacity-50">
                <i class="fa-solid fa-clock-rotate-left text-[10px]" aria-hidden="true"></i>
                <span>Khôi phục v{{ draft?.version ?? 1 }}</span>
              </button>
            </div>
          }

          <!-- Active Reports List -->
          <div class="space-y-2.5">
            <h4 class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Báo cáo hiện hành ({{ proj.cards.length }})
            </h4>
            @for (card of proj.cards; track card.id) {
              <div class="rounded-2xl border p-3.5 space-y-2 transition-colors"
                   [class]="selectedCard?.id === card.id
                     ? 'border-indigo-400 bg-indigo-50/30 dark:bg-indigo-950/20 dark:border-indigo-700'
                     : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900'">
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <div class="flex items-center flex-wrap gap-1.5">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                            [class]="card.kind === 'all'
                              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'">
                        {{ card.kind === 'all' ? 'Toàn mẻ' : 'Theo nhóm' }}
                      </span>
                      <span class="text-xs font-bold text-slate-800 dark:text-slate-100">v{{ card.version }}</span>
                      @if (card.isStale) {
                        <span class="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-[10px] font-bold">Cần xuất lại</span>
                      } @else {
                        <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Hiệu lực
                        </span>
                      }
                    </div>
                    <div class="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 break-words">{{ card.title }}</div>
                    <div class="text-[10px] text-slate-400 mt-0.5">
                      {{ card.publishedBy || 'Hệ thống' }} · {{ toDate(card.publishedAt) ? (toDate(card.publishedAt) | date:'HH:mm dd/MM/yy') : '—' }}
                    </div>
                  </div>
                  <div class="flex items-center gap-1.5 shrink-0">
                    @if (card.pdfViewUrl || card.pdfUrl) {
                      <button type="button"
                              (click)="previewCard(card)"
                              class="inline-flex h-8 items-center gap-1.5 px-2.5 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 text-[11px] font-bold hover:bg-rose-50 transition">
                        <i class="fa-solid fa-eye text-[10px]" aria-hidden="true"></i>
                        <span>Xem PDF</span>
                      </button>
                    }
                    @if (card.docsUrl) {
                      <a [href]="safeDocsUrl(card.docsUrl)" target="_blank" rel="noopener noreferrer"
                         class="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-blue-200 dark:border-blue-900/40 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 transition"
                         title="Mở Google Docs">
                        <i class="fa-solid fa-file-word text-xs" aria-hidden="true"></i>
                      </a>
                    }
                  </div>
                </div>
              </div>
            } @empty {
              <div class="text-center py-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                Chưa có báo cáo PDF nào được phát hành.
              </div>
            }
          </div>

          <!-- History Timeline + Explicit Restore -->
          @if (visibleHistory().length > 0) {
            <div class="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div class="flex items-center justify-between">
                <h5 class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Lịch sử phiên bản ({{ visibleHistory().length }})
                </h5>
              </div>

              @if (canRestore && !isReadOnly) {
                <div class="space-y-2">
                  @for (hist of visibleHistory().slice(0, 8); track historyTrack(hist)) {
                    <div class="flex items-center justify-between gap-2 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/30 px-3 py-2 text-xs">
                      <div class="min-w-0">
                        <div class="flex items-center gap-1.5 flex-wrap">
                          <span class="font-bold text-slate-800 dark:text-slate-200">v{{ hist.version || '—' }}</span>
                          <span class="px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold">
                            {{ historyScopeLabel(hist) }}
                          </span>
                          @if (hist.status === 'archived') {
                            <span class="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-[10px] font-semibold">Lưu trữ</span>
                          }
                        </div>
                        <div class="text-[10px] text-slate-400 mt-0.5 truncate">
                          {{ hist.publishedBy || hist.updatedBy || 'Hệ thống' }} · {{ toDate(hist.publishedAt) ? (toDate(hist.publishedAt) | date:'HH:mm dd/MM/yy') : '—' }}
                        </div>
                      </div>
                      <div class="flex items-center gap-1 shrink-0">
                        @if (hist.pdfViewUrl || hist.pdfUrl) {
                          <button type="button"
                                  (click)="previewHistoryItem(hist)"
                                  title="Xem PDF bản này"
                                  class="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400 flex items-center justify-center hover:bg-rose-50 transition">
                            <i class="fa-solid fa-file-pdf text-[10px]" aria-hidden="true"></i>
                          </button>
                        }
                        <button type="button"
                                [disabled]="isProcessing"
                                (click)="restoreVersion.emit({ version: hist.version, prefix: hist.prefix, reportId: hist.reportId })"
                                title="Khôi phục số liệu từ bản in này"
                                class="inline-flex h-7 items-center gap-1 px-2.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold hover:bg-indigo-50 transition disabled:opacity-50">
                          <i class="fa-solid fa-clock-rotate-left text-[9px]" aria-hidden="true"></i>
                          <span>Khôi phục</span>
                        </button>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <app-ui-timeline [items]="getHistoryTimelineItems()" ariaLabel="Lịch sử phiên bản báo cáo" />
              }
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class ResultPdfReportPaneComponent implements OnChanges, OnDestroy {
  private googleDriveService = inject(GoogleDriveService);
  private sanitizer = inject(DomSanitizer);

  @Input() run: any = null;
  @Input() draft: AnalysisResultDraft | null = null;
  @Input() historyList: any[] = [];
  @Input() activeFilter = 'ALL';
  @Input() selectedReportId = '';
  @Input() canRestore = false;
  @Input() isReadOnly = true;
  @Input() isProcessing = false;
  @Input() initialTab: 'preview' | 'reports' = 'preview';
  @Input() showCloseButton = false;

  @Output() selectedReportIdChange = new EventEmitter<string>();
  @Output() filterSyncRequested = new EventEmitter<string>();
  @Output() openModalPreview = new EventEmitter<PdfPaneModalEvent>();
  @Output() restoreVersion = new EventEmitter<{ version: number; prefix?: string; reportId?: string }>();
  @Output() closed = new EventEmitter<void>();

  activeTab = signal<'preview' | 'reports'>('preview');
  selectedCardId = signal<string>('');
  overridePdfUrl = signal<string | null>(null);
  overrideDocsUrl = signal<string | null>(null);
  overrideMeta = signal<{ prefix?: string; version?: number; publishedBy?: string; publishedAt?: any } | null>(null);

  isLoadingPdf = signal(false);
  pdfError = signal(false);
  needsAuth = signal(false);
  private blobUrl = signal<string | null>(null);
  private loadSeq = 0;
  private lastLoadedPdfUrl: string | null = null;
  private tabInitialized = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.tabInitialized || changes['initialTab']) {
      this.activeTab.set(this.initialTab || 'preview');
      this.tabInitialized = true;
    }

    if (changes['selectedReportId'] && this.selectedReportId) {
      this.selectedCardId.set(this.selectedReportId);
      this.overridePdfUrl.set(null);
      this.overrideDocsUrl.set(null);
      this.overrideMeta.set(null);
    }

    if (changes['run'] || changes['draft'] || changes['activeFilter']) {
      this.syncSelectionWithFilter();
    }

    const nextPdfUrl = this.currentPdfUrl();
    if (nextPdfUrl !== this.lastLoadedPdfUrl) {
      this.lastLoadedPdfUrl = nextPdfUrl;
      void this.loadInlinePdf(nextPdfUrl);
    }
  }

  ngOnDestroy(): void {
    this.loadSeq++;
    this.cleanupBlobUrl();
  }

  projection(): BatchReportsProjection {
    return buildBatchReportsProjection(this.run, this.draft);
  }

  activeCard(): ReportCardProjection | null {
    const cards = this.projection().cards;
    if (cards.length === 0) return null;
    const picked = this.selectedCardId();
    if (picked) {
      const found = cards.find(c => c.id === picked);
      if (found) return found;
    }
    return this.findBestCardForFilter(cards, this.activeFilter) || cards[0] || null;
  }

  currentPdfUrl(): string | null {
    const custom = this.overridePdfUrl();
    if (custom) return custom;
    const card = this.activeCard();
    return card?.pdfViewUrl || card?.pdfUrl || null;
  }

  safePdfUrl(): SafeResourceUrl | null {
    const url = this.blobUrl();
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  }

  safeDocsUrl(url: string): string {
    return getSafeGoogleUrl(url, 'doc');
  }

  toDate(value: any): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;
    return timestampToDate(value);
  }

  emptyPreviewMessage(): string {
    if (this.activeFilter === 'ALL') {
      return 'Mẻ này chưa có bản PDF nào được xuất bản.';
    }
    const label = this.activeFilter === '' ? 'Không tiền tố' : `Nhóm ${this.activeFilter}`;
    return `Chưa có file PDF nào cho ${label}.`;
  }

  onReportSelect(cardId: string): void {
    this.selectedCardId.set(cardId);
    this.overridePdfUrl.set(null);
    this.overrideDocsUrl.set(null);
    this.overrideMeta.set(null);
    this.selectedReportIdChange.emit(cardId);
    const card = this.projection().cards.find(c => c.id === cardId);
    if (card) {
      this.filterSyncRequested.emit(card.kind === 'all' ? 'ALL' : card.prefix);
    }
    this.refreshLoadedPdf();
  }

  previewCard(card: ReportCardProjection): void {
    this.selectedCardId.set(card.id);
    this.overridePdfUrl.set(null);
    this.overrideDocsUrl.set(null);
    this.overrideMeta.set(null);
    this.activeTab.set('preview');
    this.selectedReportIdChange.emit(card.id);
    this.refreshLoadedPdf();
  }

  previewHistoryItem(hist: any): void {
    const url = hist?.pdfViewUrl || hist?.pdfUrl || null;
    if (!url) return;
    this.overridePdfUrl.set(url);
    this.overrideDocsUrl.set(hist?.docsUrl || null);
    this.overrideMeta.set({
      prefix: hist?.prefix,
      version: hist?.version,
      publishedBy: hist?.publishedBy,
      publishedAt: hist?.publishedAt,
    });
    this.activeTab.set('preview');
    this.refreshLoadedPdf();
  }

  triggerModalPreview(): void {
    const url = this.currentPdfUrl();
    if (!url) return;
    const card = this.activeCard();
    const meta = this.overrideMeta();
    this.openModalPreview.emit({
      pdfUrl: url,
      docsUrl: (this.overrideDocsUrl() || card?.docsUrl) ?? undefined,
      prefix: meta?.prefix ?? card?.prefix,
      version: meta?.version ?? card?.version,
      publishedBy: meta?.publishedBy ?? card?.publishedBy,
      publishedAt: meta?.publishedAt ?? card?.publishedAt,
    });
  }

  beginDriveAuth(): void {
    this.googleDriveService.beginRedirectAuth();
  }

  visibleHistory(): any[] {
    const activeUrls = new Set<string>();
    const activeVersionScopes = new Set<string>();
    for (const card of this.projection().cards) {
      [card.pdfViewUrl, card.pdfUrl, card.docsUrl]
        .filter((u): u is string => typeof u === 'string' && u.length > 0)
        .forEach(u => activeUrls.add(u));
      if (card.version) {
        const scope = card.kind === 'all' ? 'ALL' : (card.prefix === '' ? '_NO_PREFIX_' : card.prefix);
        activeVersionScopes.add(`${card.version}|${scope}`);
      }
    }

    return (this.historyList || []).filter(hist => {
      const historyUrls = [hist?.pdfViewUrl, hist?.pdfUrl, hist?.docsUrl]
        .filter((u): u is string => typeof u === 'string' && u.length > 0);
      if (historyUrls.some(u => activeUrls.has(u))) return false;
      const scope = !hist?.prefix || hist.prefix === 'ALL' ? 'ALL' : hist.prefix;
      if (hist?.version !== undefined && hist?.version !== null) {
        return !activeVersionScopes.has(`${hist.version}|${scope}`);
      }
      return true;
    });
  }

  historyScopeLabel(hist: any): string {
    const prefix = hist?.prefix;
    if (!prefix || prefix === 'ALL') return 'Toàn mẻ';
    if (prefix === '_NO_PREFIX_') return 'Không tiền tố';
    return `Nhóm ${prefix}`;
  }

  historyTrack(hist: any): string {
    return `${hist?.version || 'v'}_${hist?.reportId || hist?.prefix || 'all'}_${hist?.publishedAt || ''}`;
  }

  getHistoryTimelineItems(): TimelineItem[] {
    return this.visibleHistory().slice(0, 6).map((hist, index) => {
      const pdfUrl = hist?.pdfViewUrl || hist?.pdfUrl;
      const docsUrl = hist?.docsUrl ? this.safeDocsUrl(hist.docsUrl) : '';
      const includedSamples = Array.isArray(hist?.includedSamples) ? hist.includedSamples : [];
      const metadata = [
        { label: 'Phạm vi', value: this.historyScopeLabel(hist) },
        includedSamples.length > 0 ? { label: 'Mẫu', value: formatSampleList(includedSamples) } : null,
        hist?.status === 'archived' ? { label: 'Trạng thái', value: 'Lưu trữ' } : null,
      ].filter((item): item is { label: string; value: string } => item !== null);

      return {
        id: hist?._id || `${hist?.version || 'unknown'}-${hist?.reportId || hist?.prefix || index}`,
        title: `Phát hành báo cáo v${hist?.version || '—'}`,
        description: includedSamples.length > 0
          ? `Báo cáo gồm ${includedSamples.length} mẫu.`
          : 'Phiên bản báo cáo đã được lưu vào lịch sử.',
        timestamp: hist?.publishedAt,
        actorName: hist?.publishedBy,
        actorRole: hist?.isFromMaster ? 'Mẻ tổng hợp' : 'Báo cáo kết quả',
        icon: hist?.status === 'archived' ? 'fa-box-archive' : 'fa-file-circle-check',
        status: hist?.status === 'archived' ? 'warning' : 'success',
        metadata,
        action: pdfUrl ? {
          label: 'Mở PDF',
          icon: 'fa-file-pdf',
          callback: () => this.previewHistoryItem(hist),
        } : docsUrl ? {
          label: 'Mở Docs',
          icon: 'fa-arrow-up-right-from-square',
          href: docsUrl,
        } : undefined,
        isCurrent: false,
      } satisfies TimelineItem;
    });
  }

  private syncSelectionWithFilter(): void {
    const cards = this.projection().cards;
    if (cards.length === 0) {
      this.selectedCardId.set('');
      return;
    }
    const current = this.selectedCardId();
    const currentCard = current ? cards.find(c => c.id === current) : null;
    if (currentCard) {
      const currentScope = currentCard.kind === 'all' ? 'ALL' : currentCard.prefix;
      if (currentScope === this.activeFilter || this.overridePdfUrl()) return;
    }
    const match = this.findBestCardForFilter(cards, this.activeFilter);
    if (match) {
      this.selectedCardId.set(match.id);
    } else if (!currentCard) {
      this.selectedCardId.set(cards[0].id);
    }
  }

  private findBestCardForFilter(cards: ReportCardProjection[], filter: string): ReportCardProjection | null {
    if (filter === 'ALL') {
      return cards.find(c => c.kind === 'all') || cards[0] || null;
    }
    return cards.find(c => c.kind === 'group' && c.prefix === filter)
      || cards.find(c => c.kind === 'all')
      || null;
  }

  private refreshLoadedPdf(): void {
    const nextPdfUrl = this.currentPdfUrl();
    if (nextPdfUrl !== this.lastLoadedPdfUrl) {
      this.lastLoadedPdfUrl = nextPdfUrl;
      void this.loadInlinePdf(nextPdfUrl);
    }
  }

  private async loadInlinePdf(pdfUrl: string | null): Promise<void> {
    const seq = ++this.loadSeq;
    this.cleanupBlobUrl();
    if (!pdfUrl) {
      this.isLoadingPdf.set(false);
      return;
    }

    const fileId = this.extractFileId(pdfUrl);
    if (!fileId) {
      if (seq === this.loadSeq) {
        this.blobUrl.set(pdfUrl);
      }
      return;
    }

    this.isLoadingPdf.set(true);
    this.pdfError.set(false);
    this.needsAuth.set(false);
    try {
      const rawBlob = await this.googleDriveService.downloadFile(fileId);
      const blob = new Blob([rawBlob], { type: 'application/pdf' });
      const objectUrl = URL.createObjectURL(blob);
      if (seq === this.loadSeq && this.currentPdfUrl() === pdfUrl) {
        this.blobUrl.set(objectUrl);
      } else {
        URL.revokeObjectURL(objectUrl);
      }
    } catch (err: any) {
      if (seq !== this.loadSeq) return;
      if (err?.code === 'oauth_required') {
        this.needsAuth.set(true);
      } else {
        console.error('[ResultPdfReportPane] Failed to load PDF blob:', err);
        this.pdfError.set(true);
      }
    } finally {
      if (seq === this.loadSeq) {
        this.isLoadingPdf.set(false);
      }
    }
  }

  private extractFileId(url: string): string | null {
    const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileDMatch?.[1]) return fileDMatch[1];
    const genericDMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (genericDMatch?.[1]) return genericDMatch[1];
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('id');
    } catch {
      const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      return idMatch?.[1] || null;
    }
  }

  private cleanupBlobUrl(): void {
    const current = this.blobUrl();
    if (current?.startsWith('blob:')) {
      URL.revokeObjectURL(current);
    }
    this.blobUrl.set(null);
    this.pdfError.set(false);
    this.needsAuth.set(false);
  }
}
