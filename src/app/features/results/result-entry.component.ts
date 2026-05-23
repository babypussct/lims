import { Component, inject, signal, OnInit, OnDestroy, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import { ResultService } from './services/result.service';
import { AnalysisResultDraft } from '../../core/models/analysis-result.model';
import { ResultEntryType2Component } from './result-entry-type2.component';
import { ResultEntryType3bComponent } from './result-entry-type3b.component';
import { ToastService } from '../../core/services/toast.service';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { resolveConfigKey, ANGULAR_SOP_CONFIG } from './config/sop-configs';
import { getSafeGoogleUrl, formatSampleList } from '../../shared/utils/utils';

// Isolated SOP presentational components
import { Sop01EntryComponent } from './sops/sop-01/sop-01-entry.component';
import { Sop03EntryComponent } from './sops/sop-03/sop-03-entry.component';
import { SopDefaultType2EntryComponent } from './sops/sop-default-type2/sop-default-type2-entry.component';

@Component({
  selector: 'app-result-entry',
  standalone: true,
  imports: [
    CommonModule, 
    ResultEntryType2Component, 
    ResultEntryType3bComponent, 
    SkeletonComponent,
    Sop01EntryComponent,
    Sop03EntryComponent,
    SopDefaultType2EntryComponent
  ],
  template: `
    <div class="h-full flex flex-col fade-in">
      <!-- Dynamic Sticky Header (Glassmorphism design) -->
      <div class="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 px-6 py-4 flex items-center justify-between shrink-0 z-40 transition-colors duration-300">
        <div class="flex items-center gap-3.5">
          <button (click)="goBack()" 
                  class="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center transition active:scale-95 duration-150 border border-slate-200/10 dark:border-slate-700/20">
            <i class="fa-solid fa-arrow-left text-sm"></i>
          </button>
          <div>
            <span class="text-[10px] font-black uppercase text-fuchsia-600 dark:text-fuchsia-450 tracking-wider block mb-0.5">
              {{ run() ? run()?.sopName : 'Đang tải...' }}
            </span>
            <h3 class="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 m-0 tracking-tight">
              Nhập Dữ Liệu Phân Tích — Mẻ Chạy
            </h3>
          </div>
        </div>

        <!-- Toolbar Buttons -->
        @if (run() && draft()) {
          <div class="flex items-center gap-2">
            <!-- Revert/Restore Version (Dropdown menu) -->
            @if (historyList().length > 0) {
              <div class="relative group">
                <button [disabled]="isProcessing()"
                        class="px-4 py-2 text-xs font-bold text-slate-650 dark:text-slate-355 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200/40 dark:border-slate-700/40 rounded-xl transition flex items-center gap-1.5 disabled:opacity-50 active:scale-95 shadow-sm hover:shadow"
                        title="Khôi phục số liệu từ các bản in cũ">
                  <i class="fa-solid fa-clock-rotate-left"></i>
                  <span class="hidden md:inline">Khôi phục bản cũ</span>
                  <i class="fa-solid fa-chevron-down text-[9px] opacity-70"></i>
                </button>
                <!-- Tooltip/Dropdown list -->
                <div class="absolute right-0 top-full mt-1.5 w-64 bg-white dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-1.5 max-h-60 overflow-y-auto">
                  <div class="px-3 py-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 mb-1">Chọn phiên bản khôi phục</div>
                  
                  <!-- Bản hiện tại vừa in gần nhất -->
                  @if (draft()?.version) {
                    <button (click)="restoreFromVersion(draft()!.version!)"
                            class="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 flex flex-col gap-0.5 text-slate-700 dark:text-slate-200">
                      <span class="font-bold text-indigo-600 dark:text-indigo-400">Bản hiện tại (v{{ draft()?.version }})</span>
                      <span class="text-[10px] text-slate-400 dark:text-slate-500">Người in gần nhất: {{ draft()?.updatedBy }}</span>
                    </button>
                  }
                  
                  <!-- Các bản cũ trong lịch sử -->
                  @for (hist of historyList(); track hist.version) {
                    @if (hist.version !== draft()?.version) {
                      <button (click)="restoreFromVersion(hist.version, hist.prefix)"
                              class="w-full text-left px-4 py-2 text-xs border-t border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex flex-col gap-0.5 text-slate-700 dark:text-slate-200">
                        <span class="font-bold">Phiên bản v{{ hist.version }} {{ hist.prefix ? (hist.prefix === '_NO_PREFIX_' ? '(Không tiền tố)' : '(' + hist.prefix + ')') : '' }} {{ hist.status === 'archived' ? '(Đã hủy)' : '' }}</span>
                        <span class="text-[10px] text-slate-400 dark:text-slate-500">Người in: {{ hist.publishedBy }}</span>
                      </button>
                    }
                  }
                </div>
              </div>
            }

            <!-- Save Draft Button -->
            <button (click)="triggerSaveDraft()" 
                    [disabled]="isProcessing()"
                    class="px-4 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100/50 dark:border-indigo-800/30 hover:bg-indigo-100 dark:hover:bg-indigo-950/30 rounded-xl transition flex items-center gap-2 disabled:opacity-50 shadow-sm hover:shadow active:scale-95 duration-150">
              <i class="fa-solid" [class.fa-floppy-disk]="!isSavingDraft()" [class.fa-spinner]="isSavingDraft()" [class.fa-spin]="isSavingDraft()"></i>
              <span>Lưu nháp</span>
            </button>

            <!-- View PDF / Open Docs if available for the active tab -->
            @if (getCurrentPdfUrl()) {
              <a [href]="getCurrentPdfUrl()" target="_blank" rel="noopener noreferrer"
                 class="px-4 py-2 text-xs font-bold text-red-650 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-100/50 dark:border-red-800/30 hover:bg-red-100 dark:hover:bg-red-950/30 rounded-xl transition flex items-center gap-1.5 cursor-pointer no-underline shadow-sm hover:shadow active:scale-95 duration-150">
                <i class="fa-solid fa-file-pdf"></i>
                <span>Xem PDF</span>
              </a>
            }
            @if (getCurrentDocsUrl()) {
              <a [href]="getCurrentDocsUrl()" target="_blank" rel="noopener noreferrer"
                 class="px-4 py-2 text-xs font-bold text-blue-605 dark:text-blue-405 bg-blue-50 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-800/30 hover:bg-blue-100 dark:hover:bg-blue-950/30 rounded-xl transition flex items-center gap-1.5 cursor-pointer no-underline shadow-sm hover:shadow active:scale-95 duration-150">
                <i class="fa-brands fa-google-drive"></i>
                <span>Mở Docs</span>
              </a>
            }

            <!-- Publish / Generate PDF -->
            <button (click)="triggerPublishReport()" 
                    [disabled]="isProcessing()"
                    class="px-5 py-2.5 text-xs font-black text-white bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-650 hover:from-violet-750 hover:via-fuchsia-750 hover:to-indigo-750 rounded-xl shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-95 transition-all duration-150 flex items-center gap-2 disabled:opacity-50"
                    [title]="getPrintButtonLabel()">
              <i class="fa-solid" [class.fa-circle-check]="!isPublishing()" [class.fa-spinner]="isPublishing()" [class.fa-spin]="isPublishing()"></i>
              <span>{{ getPrintButtonLabel() }}</span>
            </button>

            <!-- Thao tác khác Dropdown (Premium SaaS Dropdown) -->
            <div class="relative group/actions">
              <button [disabled]="isProcessing()"
                      class="px-3.5 py-2 text-xs font-black text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-750 rounded-xl transition flex items-center gap-1.5 active:scale-95 disabled:opacity-50 duration-150">
                <i class="fa-solid fa-gear"></i>
                <span>THAO TÁC</span>
                <i class="fa-solid fa-chevron-down text-[8px] opacity-60"></i>
              </button>
              
              <div class="absolute right-0 top-full mt-2 w-64 bg-white/98 dark:bg-slate-900/98 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-2xl p-2 opacity-0 invisible group-hover/actions:opacity-100 group-hover/actions:visible transition-all duration-200 z-50 flex flex-col gap-1">
                
                <!-- Section 1: Tài liệu & Báo cáo -->
                @if (getCurrentPdfUrl() || getCurrentDocsUrl()) {
                  <div class="px-2.5 py-1 text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Báo cáo & Tài liệu
                  </div>
                  @if (getCurrentPdfUrl()) {
                    <a [href]="getCurrentPdfUrl()" target="_blank" rel="noopener noreferrer"
                       class="px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition flex items-center gap-2.5 no-underline">
                      <i class="fa-solid fa-file-pdf"></i>
                      <span>Xem PDF phiên bản này</span>
                    </a>
                  }
                  @if (getCurrentDocsUrl()) {
                    <a [href]="getCurrentDocsUrl()" target="_blank" rel="noopener noreferrer"
                       class="px-3 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-xl transition flex items-center gap-2.5 no-underline">
                      <i class="fa-brands fa-google-drive"></i>
                      <span>Mở Docs phiên bản này</span>
                    </a>
                  }
                  <div class="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                }

                <!-- Section 2: Quản lý mẻ chạy -->
                <div class="px-2.5 py-1 text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Quản trị mẻ chạy
                </div>
                @if (draft()?.status === 'completed') {
                  <button (click)="triggerRevertToDraft()" 
                          [disabled]="isProcessing()"
                          class="w-full text-left px-3 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-xl transition flex items-center gap-2.5 border-0 bg-transparent cursor-pointer">
                    <i class="fa-solid fa-unlock"></i>
                    <span>Hủy xuất bản kết quả</span>
                  </button>
                }
                <button (click)="openResetModal()"
                        [disabled]="isProcessing()"
                        class="w-full text-left px-3 py-2 text-xs font-bold text-red-600 dark:text-red-450 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition flex items-center gap-2.5 border-0 bg-transparent cursor-pointer">
                  <i class="fa-solid fa-trash-can"></i>
                  <span>Xóa hoàn toàn kết quả</span>
                </button>

              </div>
            </div>
          </div>
        }
      </div>

      <!-- Main Form Area -->
      <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-6 bg-slate-50/50 dark:bg-slate-950/20">
        @if (isLoading()) {
          <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-6">
            <div class="flex justify-between items-center">
              <app-skeleton width="180px" height="24px"></app-skeleton>
              <app-skeleton width="120px" height="36px"></app-skeleton>
            </div>
            <div class="space-y-3">
              <app-skeleton width="100%" height="40px"></app-skeleton>
              <app-skeleton width="100%" height="40px"></app-skeleton>
              <app-skeleton width="100%" height="40px"></app-skeleton>
            </div>
          </div>
        } @else if (run() && draft() && config()) {
          <!-- Run Metadata Info Banner -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm mb-6 overflow-hidden transition-all duration-300">
            <!-- Header Section (Clickable to Toggle) -->
            <div (click)="isMetadataExpanded.set(!isMetadataExpanded())" 
                 class="px-5 py-4 bg-slate-50/50 dark:bg-slate-850/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 cursor-pointer flex items-center justify-between transition-colors border-b border-slate-100 dark:border-slate-800/50">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500/10 to-fuchsia-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100/50 dark:border-indigo-900/30">
                  <i class="fa-solid fa-circle-info text-sm"></i>
                </div>
                <div>
                  <h4 class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-355">Thông tin chi tiết mẻ phân tích</h4>
                  <p class="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                    Mã mẻ: <span class="font-mono font-bold text-slate-650 dark:text-slate-400 select-all">{{ run()?.inputs?.['batchCode'] || run()?.id }}</span>
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-[10px] font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 max-w-[200px] sm:max-w-xs md:max-w-md lg:max-w-lg truncate border border-slate-200/40 dark:border-slate-700/30" title="{{ run()?.sampleList ? formatSampleList(run()!.sampleList!) : '' }}">
                  {{ run()?.sampleList?.length || 0 }} mẫu ({{ run()?.sampleList ? formatSampleList(run()!.sampleList!) : 'Trống' }})
                </span>
                <div class="w-7 h-7 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 flex items-center justify-center transition">
                  <i class="fa-solid fa-chevron-down text-xs text-slate-400 dark:text-slate-500 transition-transform duration-300"
                     [class.rotate-180]="isMetadataExpanded()"></i>
                </div>
              </div>
            </div>

            <!-- Body Section (Collapsible) -->
            @if (isMetadataExpanded()) {
              <div class="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-xs bg-slate-50/20 dark:bg-slate-900/10 animate-fade-in">
                <div class="p-3 bg-white dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-xs">
                  <span class="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Mã mẻ chạy (Batch)</span>
                  <span class="font-mono font-extrabold text-slate-800 dark:text-slate-200 break-all select-all flex items-center gap-1.5">
                    <i class="fa-solid fa-barcode text-indigo-500 opacity-60"></i>
                    {{ run()?.inputs?.['batchCode'] || run()?.id }}
                  </span>
                </div>
                <div class="p-3 bg-white dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-xs">
                  <span class="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Thiết bị phân tích</span>
                  <span class="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <i class="fa-solid fa-microscope text-fuchsia-500 opacity-60"></i>
                    {{ run()?.inputs?.['device'] || run()?.inputs?.['instrument'] || 'GC-MS/MS / LC-MS/MS' }}
                  </span>
                </div>
                <div class="p-3 bg-white dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-xs">
                  <span class="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Ngày phân tích</span>
                  <span class="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <i class="fa-regular fa-calendar text-emerald-500 opacity-60"></i>
                    {{ run()?.analysisDate ? formatAnalysisDate(run()!.analysisDate!) : 'Chưa thiết lập' }}
                  </span>
                </div>
                <div class="p-3 bg-white dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-xs">
                  <span class="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Người thực hiện (Analyst)</span>
                  <span class="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <i class="fa-solid fa-user text-amber-500 opacity-60"></i>
                    {{ run()?.user || 'Chưa thiết lập' }}
                  </span>
                </div>
              </div>
            }
          </div>

          <!-- Render Type 3B Component (Vertical Lists per sample) -->
          @if (config()?.formType === 'type3b') {
            <app-result-entry-type3b 
              [run]="run()!" 
              [draft]="draft()!" 
              [config]="config()!" 
              (draftChanged)="onDraftChanged($event)">
            </app-result-entry-type3b>
          } 
          <!-- Render Type 2 / 3A Component (Grid spreadsheet) -->
          @else {
            @if (ENABLE_MODULAR_SOPS) {
              <!-- New Modular Strategy Pattern rendering -->
              @switch (configKey()) {
                @case ('fipronil-chlorpyrifos') {
                  <app-sop-01-entry
                    [run]="run()!"
                    [draft]="draft()!"
                    [config]="config()!"
                    (draftChanged)="onDraftChanged($event)">
                  </app-sop-01-entry>
                }
                @case ('trifluralin-gcms') {
                  <app-sop-03-entry
                    #sop03Grid
                    [run]="run()!"
                    [draft]="draft()!"
                    [config]="config()!"
                    (draftChanged)="onDraftChanged($event)">
                  </app-sop-03-entry>
                }
                @default {
                  <app-sop-default-type2-entry
                    [run]="run()!"
                    [draft]="draft()!"
                    [config]="config()!"
                    (draftChanged)="onDraftChanged($event)">
                  </app-sop-default-type2-entry>
                }
              }
            } @else {
              <!-- Fallback to Legacy Monolithic Type 2 Grid -->
              <app-result-entry-type2 
                #type2Grid
                [run]="run()!" 
                [draft]="draft()!" 
                [config]="config()!" 
                (draftChanged)="onDraftChanged($event)">
              </app-result-entry-type2>
            }
          }
        } @else {
          <div class="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 border-dashed">
            <div class="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-500">
              <i class="fa-solid fa-triangle-exclamation text-3xl text-red-500"></i>
            </div>
            <p class="text-slate-500 dark:text-slate-400 font-medium text-sm">
              Không thể tìm thấy mẻ chạy hoặc cấu hình tương ứng của chỉ tiêu này!
            </p>
            <button (click)="goBack()" class="mt-4 px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-xl text-xs font-bold">
              Quay lại danh sách
            </button>
          </div>
        }
      </div>

      <!-- Reset Confirmation Modal -->
      @if (showResetModal()) {
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div class="flex items-center gap-3 text-red-600 dark:text-red-400 mb-4">
              <div class="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-lg">
                <i class="fa-solid fa-triangle-exclamation"></i>
              </div>
              <h3 class="text-base font-bold">Xác nhận xóa hoàn toàn kết quả</h3>
            </div>
            
            <p class="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              Hành động này sẽ <strong class="text-red-600 dark:text-red-400">xóa sạch toàn bộ số liệu nhập liệu</strong> của mẻ chạy này và di chuyển các báo cáo PDF đã in trên Drive vào thư mục lưu trữ (Archived). Bạn không thể hoàn tác hành động này.
            </p>
            
            <div class="mb-5">
              <label class="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
                Để xác nhận, vui lòng nhập chữ <span class="text-red-600 dark:text-red-400 font-bold">XÓA</span> vào ô dưới đây:
              </label>
              <input type="text" 
                     [value]="resetConfirmText()"
                     (input)="onResetConfirmInput($event)"
                     placeholder="Nhập XÓA để xác nhận"
                     class="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-red-500 text-center font-bold uppercase tracking-wider" />
            </div>
            
            <div class="flex gap-3">
              <button (click)="closeResetModal()" 
                      class="flex-1 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-650 rounded-xl transition">
                Hủy bỏ
              </button>
              <button (click)="triggerResetResults()" 
                      [disabled]="resetConfirmText() !== 'XÓA' || isProcessing()"
                      class="flex-1 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition disabled:opacity-40">
                Xác nhận Xóa
              </button>
            </div>
          </div>
        </div>
      }

    </div>

  `
})
export class ResultEntryComponent implements OnInit, OnDestroy {
  @ViewChild('type2Grid') type2Grid?: ResultEntryType2Component;
  @ViewChild('sop03Grid') sop03Grid?: Sop03EntryComponent;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private state = inject(StateService);
  private resultService = inject(ResultService);
  private toast = inject(ToastService);

  requestId = '';
  
  isLoading = signal(true);
  isSavingDraft = signal(false);
  isPublishing = signal(false);
  isProcessing = computed(() => this.isSavingDraft() || this.isPublishing());

  // Emergency feature toggle for the new modular strategy architecture
  readonly ENABLE_MODULAR_SOPS = true;

  // Approved request (run)
  run = signal<any | null>(null);
  
  // Draft data matching AnalysisResultDraft model
  draft = signal<AnalysisResultDraft | null>(null);

  // SOP configuration matching ANGULAR_SOP_CONFIG keys
  config = signal<any | null>(null);

  // Resolved config key (vd: 'trifluralin-gcms') — dùng để gửi sang GAS
  configKey = signal<string | null>(null);

  // Sub-collection history signal
  historyList = signal<any[]>([]);
  showResetModal = signal(false);
  resetConfirmText = signal('');
  isMetadataExpanded = signal(false);

  unsubscribeFromDraft?: () => void;

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.requestId) {
      this.toast.show('Không tìm thấy ID mẻ chạy!', 'error');
      this.router.navigate(['/results']);
      return;
    }
    
    this.isLoading.set(true);

    // Subscribe to real-time changes of the request document
    this.unsubscribeFromDraft = this.resultService.subscribeToDraft(this.requestId, async (draftDoc: any, runDoc: any) => {
      if (runDoc) {
        this.run.set(runDoc);
        
        const sopObj = this.state.sops().find((s: any) => s.id === runDoc.sopId) || null;
        const resolvedKey = resolveConfigKey(runDoc.sopId, runDoc.sopName || '', sopObj);
        const sopConf = resolvedKey ? ANGULAR_SOP_CONFIG[resolvedKey] : null;

        if (sopConf && resolvedKey) {
          this.config.set(sopConf);
          this.configKey.set(resolvedKey);

          if (!draftDoc) {
            // Nếu chưa có nháp, tạo bản nháp mặc định ban đầu
            draftDoc = this.createDefaultDraft(runDoc, sopConf);
          } else {
            // Đảm bảo các trường dữ liệu cần thiết của Trifluralin luôn được khởi tạo
            const isTrifluralin = resolvedKey === 'trifluralin-gcms';
            if (isTrifluralin) {
              if (!draftDoc.page1Data) draftDoc.page1Data = {};
              if (!draftDoc.page1Data['calibPoints'] || draftDoc.page1Data['calibPoints'].length === 0) {
                draftDoc.page1Data['calibPoints'] = [
                  { loSo: '41', hamLuong: '0' },
                  { loSo: '42', hamLuong: '0.5' },
                  { loSo: '43', hamLuong: '1.0' },
                  { loSo: '44', hamLuong: '5.0' },
                  { loSo: '45', hamLuong: '10.0' },
                  { loSo: '46', hamLuong: '30.0' }
                ];
              }
              if (draftDoc.page1Data['r2'] === undefined || draftDoc.page1Data['r2'] === '') {
                draftDoc.page1Data['r2'] = '0.999';
              }
              if (draftDoc.page1Data['blankName'] === undefined) {
                draftDoc.page1Data['blankName'] = 'Blank';
              }
              if (draftDoc.page1Data['spikeName'] === undefined) {
                draftDoc.page1Data['spikeName'] = 'Spike';
              }

              if (!draftDoc.resultData) draftDoc.resultData = {};
              if (!draftDoc.resultData['QC_BLANK']) {
                draftDoc.resultData['QC_BLANK'] = { loSo: '47', kqTrifluralin: 'ND', ghiChu: '', selected: true };
              } else {
                if (!draftDoc.resultData['QC_BLANK']['loSo']) draftDoc.resultData['QC_BLANK']['loSo'] = '47';
                if (!draftDoc.resultData['QC_BLANK']['kqTrifluralin']) draftDoc.resultData['QC_BLANK']['kqTrifluralin'] = 'ND';
              }
              if (!draftDoc.resultData['QC_SPIKE']) {
                draftDoc.resultData['QC_SPIKE'] = { loSo: '48', kqTrifluralin: '', ghiChu: '', selected: true };
              } else {
                if (!draftDoc.resultData['QC_SPIKE']['loSo']) draftDoc.resultData['QC_SPIKE']['loSo'] = '48';
              }
            }
          }

          // Cập nhật draft signal thời gian thực
          this.draft.set(draftDoc);
        }
      }
      this.isLoading.set(false);
    });

    // Tải lịch sử in
    this.loadHistory();
  }

  async loadHistory() {
    const hist = await this.resultService.getHistory(this.requestId);
    this.historyList.set(hist);
  }

  ngOnDestroy() {
    if (this.unsubscribeFromDraft) {
      this.unsubscribeFromDraft();
    }
  }

  private createDefaultDraft(runDoc: any, sopConf: any): AnalysisResultDraft {
    const isTrifluralin = runDoc.sopId === 'SOP-03' || (sopConf.columns && sopConf.columns.kqTrifluralin !== undefined);
    const isFipronil = runDoc.sopId === 'SOP-01' || (sopConf.columns && sopConf.columns.kqFip !== undefined);

    const defaultPage1: Record<string, any> = {
      ngayNguoiPhanTich: new Date().toISOString().split('T')[0],
      ngayNguoiThamTra: new Date().toISOString().split('T')[0],
      checkTatCaND: true,
      checkCoMauPhatHien: false
    };

    if (isTrifluralin) {
      defaultPage1['r2'] = '0.999';
      defaultPage1['blankName'] = 'Blank';
      defaultPage1['spikeName'] = 'Spike';
      defaultPage1['calibPoints'] = [
        { loSo: '41', hamLuong: '0' },
        { loSo: '42', hamLuong: '0.5' },
        { loSo: '43', hamLuong: '1.0' },
        { loSo: '44', hamLuong: '5.0' },
        { loSo: '45', hamLuong: '10.0' },
        { loSo: '46', hamLuong: '30.0' }
      ];
    } else if (isFipronil) {
      defaultPage1['hasCheckSample'] = false;
      defaultPage1['maHoSo'] = '';
      defaultPage1['heSoPhaLoang'] = '1';
      defaultPage1['loaiMau'] = 'Thủy sản';
      defaultPage1['tinhTrangMau'] = 'Bình thường';
      defaultPage1['calibPoints'] = [
        { loSo: '1.1', vialNo: '1.1' },
        { loSo: '1.2', vialNo: '1.2' },
        { loSo: '1.3', vialNo: '1.3' },
        { loSo: '1.4', vialNo: '1.4' },
        { loSo: '1.5', vialNo: '1.5' }
      ];
    } else if (sopConf.checkboxLines) {
      // Tự động gán các checkbox phụ từ cấu hình SOP_CONFIG bằng false
      Object.values(sopConf.checkboxLines).forEach((field: any) => {
        if (field !== 'checkTatCaND' && field !== 'checkCoMauPhatHien') {
          defaultPage1[field] = false;
        }
      });
    }

    const defaultResultData: Record<string, any> = {};
    const sampleList = runDoc.sampleList || [];
    
    if (isTrifluralin) {
      defaultResultData['QC_BLANK'] = { loSo: '47', kqTrifluralin: 'ND', ghiChu: '', selected: true };
      defaultResultData['QC_SPIKE'] = { loSo: '48', kqTrifluralin: '', ghiChu: '', selected: true };
      
      sampleList.forEach((sampleCode: string, idx: number) => {
        defaultResultData[sampleCode] = {
          loSo: String(idx + 1),
          kqTrifluralin: '',
          ghiChu: '',
          selected: true
        };
      });
    } else if (isFipronil) {
      const activeCols = Object.keys(sopConf.columns || {}).filter(c => c !== 'loSo' && c !== 'maSoMau' && c !== 'ghiChu');
      
      // 1. BLANK (vial 1.7)
      defaultResultData['QC_BLANK'] = { loSo: '1.7', selected: true };
      activeCols.forEach(col => defaultResultData['QC_BLANK'][col] = '');
      defaultResultData['QC_BLANK']['ghiChu'] = '';

      // 2. SPIKE (vial 1.8)
      defaultResultData['QC_SPIKE'] = { loSo: '1.8', selected: true };
      activeCols.forEach(col => defaultResultData['QC_SPIKE'][col] = '');
      defaultResultData['QC_SPIKE']['ghiChu'] = '';

      // 3. Optional CHECK_SAMPLE (vial 1.9)
      defaultResultData['QC_CHECK_SAMPLE'] = { loSo: '1.9', selected: true };
      activeCols.forEach(col => defaultResultData['QC_CHECK_SAMPLE'][col] = '');
      defaultResultData['QC_CHECK_SAMPLE']['ghiChu'] = '';

      // 4. Regular samples starting at vial 1.10
      sampleList.forEach((sampleCode: string, idx: number) => {
        const currentVial = 10 + idx;
        const rack = 1 + Math.floor((currentVial - 1) / 54);
        const vial = ((currentVial - 1) % 54) + 1;
        
        defaultResultData[sampleCode] = {
          loSo: `${rack}.${vial}`,
          selected: true
        };
        activeCols.forEach(col => defaultResultData[sampleCode][col] = '');
        defaultResultData[sampleCode]['ghiChu'] = '';
      });

      // 5. FINAL (vial 1.8)
      defaultResultData['QC_FINAL'] = { loSo: '1.8', selected: true };
      activeCols.forEach(col => defaultResultData['QC_FINAL'][col] = '');
      defaultResultData['QC_FINAL']['ghiChu'] = '';
    } else {
      sampleList.forEach((sampleCode: string) => {
        defaultResultData[sampleCode] = {};
        
        if (sopConf.formType === 'type3b') {
          // Cho dạng 3B (Chlor/Lân hữu cơ): Điền mặc định ND và QC đạt
          sopConf.compounds.forEach((c: string) => {
            defaultResultData[sampleCode][c] = 'KPH';
            defaultResultData[sampleCode][`${c}_nd`] = true;
            defaultResultData[sampleCode][`${c}_qc1`] = 'Đạt';
            defaultResultData[sampleCode][`${c}_qc2`] = 'Đạt';
            defaultResultData[sampleCode][`${c}_qc3`] = 'Đạt';
          });
        } else {
          // Cho dạng 2 / 3A: Cột hoạt chất rỗng
          Object.keys(sopConf.columns).forEach((col: string) => {
            if (col !== 'loSo' && col !== 'maSoMau' && col !== 'ghiChu') {
              defaultResultData[sampleCode][col] = '';
            }
          });
        }
      });
    }

    return {
      id: this.requestId,
      requestId: this.requestId,
      sopId: runDoc.sopId,
      sopName: runDoc.sopName,
      status: 'draft',
      page1Data: defaultPage1,
      resultData: defaultResultData,
      updatedAt: new Date(),
      updatedBy: 'System'
    };
  }

  onDraftChanged(updatedDraft: AnalysisResultDraft) {
    this.draft.set(updatedDraft);
  }

  /**
   * Lưu nháp thủ công
   */
  async triggerSaveDraft() {
    if (!this.draft()) return;
    this.isSavingDraft.set(true);
    const success = await this.resultService.saveDraft(this.requestId, this.draft()!);
    if (success) {
      this.toast.show('Đã lưu bản nháp kết quả phân tích thành công!', 'success');
    }
    this.isSavingDraft.set(false);
  }

  /**
   * Phục hồi bản in trước đó (Fallback backup)
   */
  async restoreBackup() {
    this.isSavingDraft.set(true);
    const restored = await this.resultService.restoreFromBackup(this.requestId);
    if (restored) {
      this.draft.set(restored);
    }
    this.isSavingDraft.set(false);
  }

  /**
   * Khôi phục số liệu từ một phiên bản cụ thể
   */
  async restoreFromVersion(version: number, prefix?: string) {
    if (this.isProcessing()) return;
    
    const displayName = prefix ? (prefix === '_NO_PREFIX_' ? ' (Không tiền tố)' : ` (${prefix})`) : '';
    const confirmed = confirm(`Bạn có chắc chắn muốn khôi phục số liệu nhập liệu của bản v${version}${displayName}? Dữ liệu chưa lưu hiện tại sẽ bị ghi đè.`);
    if (!confirmed) return;

    this.isSavingDraft.set(true);
    const restored = await this.resultService.restoreFromVersion(this.requestId, version, prefix);
    if (restored) {
      this.draft.set(restored);
      // Reload lịch sử
      const hist = await this.resultService.getHistory(this.requestId);
      this.historyList.set(hist);
    }
    this.isSavingDraft.set(false);
  }

  /**
   * Xuất bản kết quả -> Tạo tệp PDF
   */
  async triggerPublishReport() {
    const currentDraft = this.draft();
    const currentRun = this.run();
    const currentConf = this.config();
    if (!currentDraft || !currentRun || !currentConf) return;

    // ── Mở cửa sổ trống NGAY LẬP TỨC (trước async) để tránh popup blocker ──
    const pdfWindow = window.open('', '_blank');
    if (pdfWindow) {
      pdfWindow.document.write(`
        <html><head><title>Đang tạo PDF...</title></head>
        <body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#f8fafc;">
          <div style="text-align:center;color:#64748b;">
            <div style="font-size:48px;margin-bottom:16px">⏳</div>
            <div style="font-size:18px;font-weight:bold;margin-bottom:8px">Đang tạo báo cáo PDF...</div>
            <div style="font-size:14px">Vui lòng đợi, trang sẽ tự chuyển sang PDF sau vài giây.</div>
          </div>
        </body></html>`);
    }

    this.isPublishing.set(true);

    try {
      const isTrifluralin = this.configKey() === 'trifluralin-gcms';

      if (isTrifluralin) {
        const activeFilter = this.getSelectedPrefixFilter() !== undefined ? this.getSelectedPrefixFilter() : 'ALL';
        const sampleList = currentRun.sampleList || [];
        const checkedSamples = sampleList.filter((s: string) => {
          const resObj = currentDraft.resultData[s] || {};
          const startsWithLetter = /^[a-zA-Z]/.test(s);
          const prefix = startsWithLetter ? s.charAt(0).toUpperCase() : '';
          const isSelected = resObj['selected'] !== false;
          const matchesFilter = activeFilter === 'ALL' || prefix === activeFilter;
          return isSelected && matchesFilter;
        });

        if (checkedSamples.length === 0) {
          this.toast.show('Vui lòng chọn ít nhất một mẫu để tạo báo cáo!', 'info');
          if (pdfWindow && !pdfWindow.closed) pdfWindow.close();
          this.isPublishing.set(false);
          return;
        }

        const prefixForReport = activeFilter === 'ALL' ? '' : activeFilter;
        const prefixSamples = checkedSamples;

        const samplesPayload: any[] = [];

        // 1. Thêm Blank vào đầu danh sách
        const blankObj = currentDraft.resultData['QC_BLANK'] || {};
        samplesPayload.push({
          loSo: blankObj['loSo'] || '1',
          maSoMau: currentDraft.page1Data['blankName'] || 'Blank',
          kqTrifluralin: blankObj['kqTrifluralin'] || '',
          ghiChu: blankObj['ghiChu'] || ''
        });

        // 2. Thêm Spike vào vị trí thứ 2
        const spikeObj = currentDraft.resultData['QC_SPIKE'] || {};
        samplesPayload.push({
          loSo: spikeObj['loSo'] || '2',
          maSoMau: currentDraft.page1Data['spikeName'] || 'Spike',
          kqTrifluralin: spikeObj['kqTrifluralin'] || '',
          ghiChu: spikeObj['ghiChu'] || ''
        });

        // 3. Thêm các mẫu và các mẫu SPIKE_N xen kẽ
        let selectedCount = 0;
        prefixSamples.forEach((sampleCode: string) => {
          const resObj = currentDraft.resultData[sampleCode] || {};
          samplesPayload.push({
            loSo: resObj['loSo'] || '',
            maSoMau: sampleCode,
            kqTrifluralin: resObj['kqTrifluralin'] || '',
            ghiChu: resObj['ghiChu'] || ''
          });

          selectedCount++;
          if (selectedCount % 10 === 0) {
            const n = selectedCount / 10;
            const spikeNKey = `QC_SPIKE_${n}_QC_${prefixForReport}`;
            const spikeNObj = currentDraft.resultData[spikeNKey] || {};
            samplesPayload.push({
              loSo: spikeNObj['loSo'] || spikeObj['loSo'] || '2',
              maSoMau: `SPIKE_${n}`,
              kqTrifluralin: spikeNObj['kqTrifluralin'] || '',
              ghiChu: spikeNObj['ghiChu'] || ''
            });
          }
        });

        // 4. FINAL row
        if (selectedCount > 0) {
          const finalKey = `QC_FINAL_QC_${prefixForReport}`;
          const finalObj = currentDraft.resultData[finalKey] || {};
          samplesPayload.push({
            loSo: finalObj['loSo'] || spikeObj['loSo'] || '2',
            maSoMau: 'FINAL',
            kqTrifluralin: finalObj['kqTrifluralin'] || '',
            ghiChu: finalObj['ghiChu'] || ''
          });
        }

        const reportPayload: any = {
          action: 'generate_pdf',
          sopId: this.configKey(),
          metadata: {
            ...currentDraft.page1Data,
            prefix: prefixForReport,
            ngayNguoiPhanTich: this.formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || this.getRunDate()),
            ngayNguoiThamTra: this.formatAnalysisDate(currentDraft.page1Data['ngayNguoiThamTra'] || new Date().toISOString().split('T')[0]),
            ngayBaoCao: this.formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || this.getRunDate())
          },
          samples: samplesPayload
        };

        const result = await this.resultService.publishReport(this.requestId, currentDraft, reportPayload, prefixForReport);
        let success = false;
        if (result.success) {
          success = true;
          const url = result.pdfViewUrl || result.pdfUrl;
          if (url) {
            if (pdfWindow && !pdfWindow.closed) {
              pdfWindow.location.href = url;
            } else {
              window.open(url, '_blank');
            }
          }
        }

        if (success) {
          const latestDraft = await this.resultService.getDraft(this.requestId);
          if (latestDraft) {
            this.draft.set(latestDraft);
          }
          const hist = await this.resultService.getHistory(this.requestId);
          this.historyList.set(hist);
        } else {
          if (pdfWindow && !pdfWindow.closed) pdfWindow.close();
        }
      } else if (this.configKey() === 'fipronil-chlorpyrifos') {
        // Luồng tạo báo cáo chuyên biệt cho Fipronil (SOP-01) có kèm theo mẫu QC (BLANK, SPIKE, CHECK_SAMPLE, FINAL)
        const samplesPayload: any[] = [];
        
        const ensureKeyAndGet = (key: string, defaultVial: string, label: string) => {
          const resObj = currentDraft.resultData[key] || {};
          const rowData: Record<string, any> = {
            loSo: resObj['loSo'] || defaultVial,
            maSoMau: label,
            ghiChu: resObj['ghiChu'] || ''
          };
          Object.keys(currentConf.columns).forEach(col => {
            if (col !== 'loSo' && col !== 'maSoMau' && col !== 'ghiChu') {
              rowData[col] = resObj[col] !== undefined ? resObj[col] : '';
            }
          });
          return rowData;
        };

        // 1. BLANK (vial 1.7)
        const blankName = currentDraft.page1Data['blankName'] || 'BLANK';
        samplesPayload.push(ensureKeyAndGet('QC_BLANK', '1.7', blankName));

        // 2. SPIKE (vial 1.8)
        const spikeName = currentDraft.page1Data['spikeName'] || 'SPIKE';
        samplesPayload.push(ensureKeyAndGet('QC_SPIKE', '1.8', spikeName));

        // 3. CHECK_SAMPLE (vial 1.9, optional)
        if (currentDraft.page1Data['hasCheckSample']) {
          const checkSampleName = currentDraft.page1Data['checkSampleName'] || 'CHECK_SAMPLE';
          samplesPayload.push(ensureKeyAndGet('QC_CHECK_SAMPLE', '1.9', checkSampleName));
        }

        // 4. Regular samples & dynamic SP_N every 10 samples
        const sampleList = currentRun.sampleList || [];
        let regularCount = 0;
        sampleList.forEach((sampleCode: string) => {
          const resObj = currentDraft.resultData[sampleCode] || {};
          const rowData: Record<string, any> = {
            loSo: resObj['loSo'] || '',
            maSoMau: sampleCode,
            ghiChu: resObj['ghiChu'] || ''
          };
          Object.keys(currentConf.columns).forEach(col => {
            if (col !== 'loSo' && col !== 'maSoMau' && col !== 'ghiChu') {
              rowData[col] = resObj[col] !== undefined ? resObj[col] : '';
            }
          });
          samplesPayload.push(rowData);

          regularCount++;
          if (regularCount % 10 === 0) {
            const n = regularCount / 10;
            const spikeNKey = `QC_SPIKE_${n}`;
            const spikeNObj = currentDraft.resultData[spikeNKey] || {};
            const spikeVial = currentDraft.resultData['QC_SPIKE']?.['loSo'] || '1.8';
            
            const spRowData: Record<string, any> = {
              loSo: spikeNObj['loSo'] || spikeVial,
              maSoMau: `SP_${n}`,
              ghiChu: spikeNObj['ghiChu'] || ''
            };
            Object.keys(currentConf.columns).forEach(col => {
              if (col !== 'loSo' && col !== 'maSoMau' && col !== 'ghiChu') {
                spRowData[col] = spikeNObj[col] !== undefined ? spikeNObj[col] : '';
              }
            });
            samplesPayload.push(spRowData);
          }
        });

        // 5. FINAL (vial 1.8)
        samplesPayload.push(ensureKeyAndGet('QC_FINAL', '1.8', 'FINAL'));

        const reportPayload: any = {
          action: 'generate_pdf',
          sopId: this.configKey(),
          metadata: {
            ...currentDraft.page1Data,
            ngayNguoiPhanTich: this.formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || this.getRunDate()),
            ngayNguoiThamTra: this.formatAnalysisDate(currentDraft.page1Data['ngayNguoiThamTra'] || new Date().toISOString().split('T')[0]),
            ngayBaoCao: this.formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || this.getRunDate())
          },
          samples: samplesPayload
        };

        const result = await this.resultService.publishReport(this.requestId, currentDraft, reportPayload);
        if (result.success) {
          this.draft.update((d: any) => d ? { ...d, status: 'completed', version: (d.version || 0) + 1 } as any : null);

          const hist = await this.resultService.getHistory(this.requestId);
          this.historyList.set(hist);

          const url = result.pdfViewUrl || result.pdfUrl;
          if (url && pdfWindow && !pdfWindow.closed) {
            pdfWindow.location.href = url;
          } else if (pdfWindow && !pdfWindow.closed) {
            pdfWindow.close();
            this.toast.show('PDF đã lưu trên Drive nhưng không nhận được liên kết trực tiếp.', 'info');
          }
        } else {
          if (pdfWindow && !pdfWindow.closed) pdfWindow.close();
        }
      } else {
        // Luồng tạo báo cáo tiêu chuẩn cho các SOP khác
        const samplesPayload: any[] = [];
        const sampleList = currentRun.sampleList || [];

        sampleList.forEach((sampleCode: string, idx: number) => {
          const resObj = currentDraft.resultData[sampleCode] || {};
          
          if (currentConf.formType === 'type3b') {
            const activeCompounds: Record<string, { kq: string; nd: boolean; qc: string[] }> = {};
            currentConf.compounds.forEach((c: string) => {
              activeCompounds[c] = {
                kq: resObj[c] || 'KPH',
                nd: resObj[`${c}_nd`] === true,
                qc: [
                  resObj[`${c}_qc1`] || 'Đạt',
                  resObj[`${c}_qc2`] || 'Đạt',
                  resObj[`${c}_qc3`] || 'Đạt'
                ]
              };
            });
            samplesPayload.push({ maSoMau: sampleCode, activeCompounds });
          } else {
            const rowData: Record<string, any> = {
              loSo: String(idx + 1),
              maSoMau: sampleCode,
              ghiChu: resObj['ghiChu'] || ''
            };
            Object.keys(currentConf.columns).forEach(col => {
              if (col !== 'loSo' && col !== 'maSoMau' && col !== 'ghiChu') {
                rowData[col] = resObj[col] !== undefined ? resObj[col] : '';
              }
            });
            samplesPayload.push(rowData);
          }
        });

        const reportPayload: any = {
          action: 'generate_pdf',
          sopId: this.configKey(),
          metadata: {
            ...currentDraft.page1Data,
            ngayNguoiPhanTich: this.formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || this.getRunDate()),
            ngayNguoiThamTra: this.formatAnalysisDate(currentDraft.page1Data['ngayNguoiThamTra'] || new Date().toISOString().split('T')[0]),
            ngayBaoCao: this.formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || this.getRunDate())
          },
          samples: samplesPayload
        };

        const result = await this.resultService.publishReport(this.requestId, currentDraft, reportPayload);
        if (result.success) {
          this.draft.update((d: any) => d ? { ...d, status: 'completed', version: (d.version || 0) + 1 } as any : null);

          const hist = await this.resultService.getHistory(this.requestId);
          this.historyList.set(hist);

          const url = result.pdfViewUrl || result.pdfUrl;
          if (url && pdfWindow && !pdfWindow.closed) {
            pdfWindow.location.href = url;
          } else if (pdfWindow && !pdfWindow.closed) {
            pdfWindow.close();
            this.toast.show('PDF đã lưu trên Drive nhưng không nhận được liên kết trực tiếp.', 'info');
          }
        } else {
          if (pdfWindow && !pdfWindow.closed) pdfWindow.close();
        }
      }
    } finally {
      this.isPublishing.set(false);
    }
  }

  /**
   * Hủy xuất bản kết quả (Mở khóa chỉnh sửa)
   */
  async triggerRevertToDraft() {
    if (this.isProcessing()) return;
    const confirmed = confirm('Bạn có chắc chắn muốn hủy xuất bản mẻ này? Bản in hiện tại sẽ được lưu trữ (Archived) và mẻ chạy sẽ quay về trạng thái bản nháp.');
    if (!confirmed) return;

    this.isSavingDraft.set(true);
    try {
      const updated = await this.resultService.revertToDraft(this.requestId);
      if (updated) {
        this.draft.set(updated);
        // Reload lịch sử
        const hist = await this.resultService.getHistory(this.requestId);
        this.historyList.set(hist);
      }
    } finally {
      this.isSavingDraft.set(false);
    }
  }

  // Reset results modal actions
  openResetModal() {
    this.resetConfirmText.set('');
    this.showResetModal.set(true);
  }

  closeResetModal() {
    this.showResetModal.set(false);
    this.resetConfirmText.set('');
  }

  onResetConfirmInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.resetConfirmText.set(val);
  }

  async triggerResetResults() {
    if (this.resetConfirmText() !== 'XÓA' || this.isProcessing()) return;
    this.showResetModal.set(false);
    this.isSavingDraft.set(true);

    try {
      const updated = await this.resultService.resetResults(this.requestId);
      if (updated) {
        this.draft.set(updated);
        // Reload lịch sử
        const hist = await this.resultService.getHistory(this.requestId);
        this.historyList.set(hist);
      }
    } finally {
      this.isSavingDraft.set(false);
      this.resetConfirmText.set('');
    }
  }

  getSelectedPrefixFilter(): string | undefined {
    if (this.configKey() === 'trifluralin-gcms') {
      return this.sop03Grid?.selectedPrefixFilter();
    }
    return this.type2Grid?.selectedPrefixFilter();
  }

  getPrintButtonLabel(): string {
    const activeFilter = this.getSelectedPrefixFilter();
    if (activeFilter === undefined || activeFilter === 'ALL' || this.configKey() !== 'trifluralin-gcms') {
      const v = (this.draft()?.version || 0) + 1;
      return `Tạo & In bản v${v} (Tất cả mẫu)`;
    }
    const reports = this.draft()?.reports || {};
    const reportKey = activeFilter === '' ? '_NO_PREFIX_' : activeFilter;
    const reportForFilter = reports[reportKey] || {};
    const v = (reportForFilter.version || 0) + 1;
    const filterName = activeFilter === '' ? 'Không tiền tố' : `Nhóm ${activeFilter}`;
    return `Tạo & In bản v${v} (${filterName})`;
  }

  getCurrentPdfUrl(): string | null {
    const activeFilter = this.getSelectedPrefixFilter();
    let url: string | null = null;
    if (activeFilter === undefined || activeFilter === 'ALL' || this.configKey() !== 'trifluralin-gcms') {
      url = this.draft()?.pdfViewUrl || this.draft()?.pdfUrl || null;
    } else {
      const reports = this.draft()?.reports || {};
      const reportKey = activeFilter === '' ? '_NO_PREFIX_' : activeFilter;
      const reportForFilter = reports[reportKey] || {};
      url = reportForFilter.pdfViewUrl || reportForFilter.pdfUrl || null;
    }
    return getSafeGoogleUrl(url, 'pdf');
  }

  formatSampleList = formatSampleList;

  getRunDate(): string {
    const run = this.run();
    if (!run) return new Date().toISOString().split('T')[0];
    if (run.analysisDate) return run.analysisDate;
    if (run.approvedAt?.toDate) {
      const d = run.approvedAt.toDate();
      const offset = d.getTimezoneOffset();
      return new Date(d.getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];
    }
    if (run.timestamp?.toDate) {
      const d = run.timestamp.toDate();
      const offset = d.getTimezoneOffset();
      return new Date(d.getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  }

  getCurrentDocsUrl(): string | null {
    const activeFilter = this.getSelectedPrefixFilter();
    let url: string | null = null;
    if (activeFilter === undefined || activeFilter === 'ALL' || this.configKey() !== 'trifluralin-gcms') {
      url = this.draft()?.docsUrl || null;
    } else {
      const reports = this.draft()?.reports || {};
      const reportKey = activeFilter === '' ? '_NO_PREFIX_' : activeFilter;
      const reportForFilter = reports[reportKey] || {};
      url = reportForFilter.docsUrl || null;
    }
    return getSafeGoogleUrl(url, 'doc');
  }

  openUrl(url: string | null) {
    if (url) window.open(url, '_blank');
  }

  formatAnalysisDate(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  }

  goBack() {
    this.router.navigate(['/results']);
  }
}

