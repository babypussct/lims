import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-report-hub-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen && run) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-sm animate-fade-in">
        <div class="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">

          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-100/50 dark:border-red-900/20 shrink-0">
                <i class="fa-solid fa-file-pdf text-sm"></i>
              </div>
              <div>
                <h3 class="text-xs font-black text-slate-850 dark:text-slate-100 uppercase tracking-tight">Trung Tâm Báo Cáo</h3>
                <p class="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">{{ run?.sopName }}</p>
              </div>
            </div>
            <button (click)="closeModal()" class="w-8 h-8 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 flex items-center justify-center transition active:scale-90 cursor-pointer border-0">
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>

          <!-- Tabs Segmented Control -->
          <div class="px-6 pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div class="inline-flex bg-slate-100/80 dark:bg-slate-800/80 rounded-xl p-1 shadow-inner border border-slate-200/50 dark:border-slate-700/50 w-full sm:w-auto">
              <button (click)="activeTab.set('general')"
                      class="flex-1 sm:flex-none relative px-6 py-2 text-xs font-bold rounded-lg transition-all duration-300 z-10 text-center cursor-pointer border-0"
                      [class.text-indigo-700]="activeTab() === 'general'"
                      [class.dark:text-indigo-300]="activeTab() === 'general'"
                      [class.text-slate-500]="activeTab() !== 'general'"
                      [class.dark:text-slate-400]="activeTab() !== 'general'"
                      [class.hover:text-slate-700]="activeTab() !== 'general'"
                      [class.dark:hover:text-slate-300]="activeTab() !== 'general'"
                      [class.bg-transparent]="true">
                @if (activeTab() === 'general') {
                  <div class="absolute inset-0 bg-white dark:bg-slate-950 rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-700/50 -z-10 animate-fade-in"></div>
                }
                <span class="relative z-20">Báo cáo chung</span>
              </button>
              <button (click)="activeTab.set('prefix')"
                      class="flex-1 sm:flex-none relative px-6 py-2 text-xs font-bold rounded-lg transition-all duration-300 z-10 text-center cursor-pointer border-0"
                      [class.text-indigo-700]="activeTab() === 'prefix'"
                      [class.dark:text-indigo-300]="activeTab() === 'prefix'"
                      [class.text-slate-500]="activeTab() !== 'prefix'"
                      [class.dark:text-slate-400]="activeTab() !== 'prefix'"
                      [class.hover:text-slate-700]="activeTab() !== 'prefix'"
                      [class.dark:hover:text-slate-300]="activeTab() !== 'prefix'"
                      [class.bg-transparent]="true">
                @if (activeTab() === 'prefix') {
                  <div class="absolute inset-0 bg-white dark:bg-slate-950 rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-700/50 -z-10 animate-fade-in"></div>
                }
                <span class="relative z-20">Báo cáo theo nhóm</span>
              </button>
            </div>
          </div>

          <div class="p-5 overflow-y-auto space-y-5 flex-1 custom-scrollbar bg-slate-50/30 dark:bg-slate-950/10">

            <div class="space-y-2.5">

              @if (activeTab() === 'general' && unifiedAllSamplesReport()) {
                <div class="flex flex-col gap-3 mb-6 last:mb-0">
                  
                  <!-- HEADER -->
                  <div class="flex items-center justify-between border-b border-indigo-100/80 dark:border-indigo-900/40 pb-2.5">
                    <div class="flex items-center gap-2.5">
                      <span class="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 text-white font-black text-[10px] shadow-sm shadow-indigo-500/20">
                        <i class="fa-solid fa-layer-group"></i>
                      </span>
                      <span class="font-black text-slate-800 dark:text-slate-150 uppercase tracking-widest text-[11px]">
                        BÁO CÁO CHUNG
                      </span>
                    </div>
                    <button (click)="triggerCreateReport(undefined)"
                            class="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl text-[10px] font-black transition active:scale-95 shadow-sm shadow-indigo-500/5 cursor-pointer">
                       <i class="fa-solid fa-plus text-[9px]"></i> TẠO LẠI BẢN IN
                    </button>
                  </div>

                  <!-- GRID CÁC BẢN IN -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="relative overflow-hidden bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/80 border border-indigo-200/50 dark:border-indigo-900/40 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800 transition-all group flex flex-col justify-between h-full">
                      
                      <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-blue-400/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none transition-all group-hover:from-indigo-400/20"></div>

                      <div class="relative z-10 flex flex-col gap-3 flex-1">
                        <div class="flex justify-between items-start">
                          <div class="flex flex-col">
                            <div class="flex items-center gap-1.5 mb-1">
                              <span class="px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-extrabold uppercase border border-indigo-200/50 dark:border-indigo-800/50 shadow-xs">v{{ unifiedAllSamplesReport().version || 1 }}</span>
                              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
                            </div>
                            <div class="text-[9px] font-semibold text-slate-400 flex items-center gap-1">
                              <i class="fa-regular fa-clock text-[8px]"></i> {{ unifiedAllSamplesReport().updatedAt | date:'HH:mm dd/MM/yy' }}
                            </div>
                          </div>
                          
                          <div class="flex items-center gap-1.5">
                            @if (unifiedAllSamplesReport().pdfViewUrl || unifiedAllSamplesReport().pdfUrl) {
                              <button (click)="triggerPreviewPdf(unifiedAllSamplesReport().pdfViewUrl || unifiedAllSamplesReport().pdfUrl, unifiedAllSamplesReport().docsUrl, 'ALL', unifiedAllSamplesReport().version, undefined, unifiedAllSamplesReport().updatedAt)"
                                 class="w-8 h-8 rounded-xl bg-white hover:bg-red-50 text-red-500 dark:bg-slate-800 dark:hover:bg-red-900/30 flex items-center justify-center transition active:scale-90 border border-slate-200 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-800 shadow-sm cursor-pointer" title="Xem PDF">
                                <i class="fa-solid fa-file-pdf text-xs"></i>
                              </button>
                            }
                            @if (unifiedAllSamplesReport().docsUrl) {
                              <a [href]="getSafeGoogleUrl(unifiedAllSamplesReport().docsUrl)" target="_blank" rel="noopener noreferrer"
                                 class="w-8 h-8 rounded-xl bg-white hover:bg-blue-50 text-blue-500 dark:bg-slate-800 dark:hover:bg-blue-900/30 flex items-center justify-center transition active:scale-90 border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 shadow-sm" title="Mở Docs">
                                <i class="fa-solid fa-file-word text-xs"></i>
                              </a>
                            }
                          </div>
                        </div>

                        @let allChips = getSampleChipsForReport(unifiedAllSamplesReport());
                        @if (allChips.length > 0) {
                          <div class="mt-auto pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
                            <div class="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                              <i class="fa-solid fa-vials text-[8px] text-indigo-400"></i> {{ allChips.length }} mẫu được chọn
                            </div>
                            <div class="flex flex-wrap gap-1">
                              @if (expandedChipKeys()['unified']) {
                                @for (s of allChips; track s) {
                                  <span class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[9px] font-mono font-bold border border-slate-200/50 dark:border-slate-700/50">{{ s }}</span>
                                }
                                <button (click)="toggleChipExpand('unified')" class="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[9px] font-bold border border-indigo-200/50 dark:border-indigo-800/30 hover:bg-indigo-100 transition active:scale-95 border-0 cursor-pointer">
                                  Thu gọn ▲
                                </button>
                              } @else {
                                @let shortChips = getShortenedSampleChips(allChips);
                                @for (s of shortChips.slice(0, 5); track s) {
                                  <span class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[9px] font-mono font-bold border border-slate-200/50 dark:border-slate-700/50">{{ s }}</span>
                                }
                                @if (shortChips.length > 5) {
                                  <button (click)="toggleChipExpand('unified')" class="px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[9px] font-bold border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100 transition active:scale-95 border-0 cursor-pointer" [title]="shortChips.slice(5).join('; ')">
                                    +{{ shortChips.length - 5 }} ▼
                                  </button>
                                } @else if (allChips.length > shortChips.length) {
                                  <button (click)="toggleChipExpand('unified')" class="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[9px] font-bold border border-indigo-200/50 dark:border-indigo-800/30 hover:bg-indigo-100 transition active:scale-95 border-0 cursor-pointer">
                                    Chi tiết ▼
                                  </button>
                                }
                              }
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              }

              @if (activeTab() === 'prefix' && shouldShowPrefixLoop()) {
                @for (pref of getSelectedRunPrefixes(); track pref) {
                  @let prefReports = getReportsForPrefix(pref);
                  <div class="flex flex-col gap-3 mb-6 last:mb-0">
                    
                    <div class="flex items-center justify-between border-b border-fuchsia-100/80 dark:border-fuchsia-900/40 pb-2.5">
                      <div class="flex items-center gap-2.5">
                        <span class="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white font-black text-[10px] shadow-sm shadow-fuchsia-500/20">
                          <i class="fa-solid fa-layer-group"></i>
                        </span>
                        <span class="font-black text-slate-800 dark:text-slate-150 uppercase tracking-widest text-[11px]">
                          {{ pref === '' ? 'KHÔNG TIỀN TỐ' : 'TIỀN TỐ ' + pref }}
                        </span>
                      </div>
                      <button (click)="triggerCreateReport(pref)"
                              class="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-200 dark:border-fuchsia-900/50 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/30 rounded-xl text-[10px] font-black transition active:scale-95 shadow-sm shadow-fuchsia-500/5 cursor-pointer">
                         <i class="fa-solid fa-plus text-[9px]"></i> TẠO BẢN IN
                      </button>
                    </div>

                    @if (prefReports.length > 0) {
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        @for (rep of prefReports; track rep._id) {
                          <div class="relative overflow-hidden bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/80 border border-fuchsia-200/50 dark:border-fuchsia-900/40 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-fuchsia-300 dark:hover:border-fuchsia-800 transition-all group flex flex-col justify-between h-full">
                            
                            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-fuchsia-400/10 to-pink-400/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none transition-all group-hover:from-fuchsia-400/20"></div>

                            <div class="relative z-10 flex flex-col gap-3 flex-1">
                              <div class="flex justify-between items-start">
                                <div class="flex flex-col">
                                  <div class="flex items-center gap-1.5 mb-1">
                                    <span class="px-1.5 py-0.5 rounded-md bg-fuchsia-100 dark:bg-fuchsia-900/60 text-fuchsia-700 dark:text-fuchsia-300 text-[10px] font-extrabold uppercase border border-fuchsia-200/50 dark:border-fuchsia-800/50 shadow-xs">v{{ rep.version || 1 }}</span>
                                    @if (rep.status === 'completed') {
                                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
                                    }
                                  </div>
                                  <div class="text-[9px] font-semibold text-slate-400 flex items-center gap-1">
                                    <i class="fa-regular fa-clock text-[8px]"></i> {{ rep.pdfCreatedAt | date:'HH:mm dd/MM/yy' }}
                                  </div>
                                </div>
                                
                                <div class="flex items-center gap-1.5">
                                  @if (rep.pdfViewUrl || rep.pdfUrl) {
                                    <button (click)="triggerPreviewPdf(rep.pdfViewUrl || rep.pdfUrl, rep.docsUrl, pref, rep.version, undefined, rep.pdfCreatedAt)"
                                       class="w-8 h-8 rounded-xl bg-white hover:bg-red-50 text-red-500 dark:bg-slate-800 dark:hover:bg-red-900/30 flex items-center justify-center transition active:scale-90 border border-slate-200 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-800 shadow-sm cursor-pointer" title="Xem PDF">
                                      <i class="fa-solid fa-file-pdf text-xs"></i>
                                    </button>
                                  }
                                  @if (rep.docsUrl) {
                                    <a [href]="getSafeGoogleUrl(rep.docsUrl)" target="_blank" rel="noopener noreferrer"
                                       class="w-8 h-8 rounded-xl bg-white hover:bg-blue-50 text-blue-500 dark:bg-slate-800 dark:hover:bg-blue-900/30 flex items-center justify-center transition active:scale-90 border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 shadow-sm" title="Mở Docs">
                                      <i class="fa-solid fa-file-word text-xs"></i>
                                    </a>
                                  }
                                </div>
                              </div>

                              @let prefChips = getSampleChipsForReport(rep, pref === '' ? '_NO_PREFIX_' : pref);
                              @if (prefChips.length > 0) {
                                <div class="mt-auto pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
                                  <div class="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                    <i class="fa-solid fa-vials text-[8px] text-fuchsia-400"></i> {{ prefChips.length }} mẫu được chọn
                                  </div>
                                  <div class="flex flex-wrap gap-1">
                                    @let histKey = 'rep_' + rep._id;
                                    @if (expandedChipKeys()[histKey]) {
                                      @for (s of prefChips; track s) {
                                        <span class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[9px] font-mono font-bold border border-slate-200/50 dark:border-slate-700/50">{{ s }}</span>
                                      }
                                      <button (click)="toggleChipExpand(histKey)" class="px-1.5 py-0.5 rounded bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 text-[9px] font-bold border border-fuchsia-200/50 dark:border-fuchsia-800/30 hover:bg-fuchsia-100 transition active:scale-95 border-0 cursor-pointer">
                                        Thu gọn ▲
                                      </button>
                                    } @else {
                                      @let shortPrefChips = getShortenedSampleChips(prefChips);
                                      @for (s of shortPrefChips.slice(0, 5); track s) {
                                        <span class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[9px] font-mono font-bold border border-slate-200/50 dark:border-slate-700/50">{{ s }}</span>
                                      }
                                      @if (shortPrefChips.length > 5) {
                                        <button (click)="toggleChipExpand(histKey)" class="px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[9px] font-bold border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100 transition active:scale-95 border-0 cursor-pointer" [title]="shortPrefChips.slice(5).join('; ')">
                                          +{{ shortPrefChips.length - 5 }} ▼
                                        </button>
                                      } @else if (prefChips.length > shortPrefChips.length) {
                                        <button (click)="toggleChipExpand(histKey)" class="px-1.5 py-0.5 rounded bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 text-[9px] font-bold border border-fuchsia-200/50 dark:border-fuchsia-800/30 hover:bg-fuchsia-100 transition active:scale-95 border-0 cursor-pointer">
                                          Chi tiết ▼
                                        </button>
                                      }
                                    }
                                  </div>
                                </div>
                              }
                            </div>
                          </div>
                        }
                      </div>
                    } @else {
                      <div class="text-center py-5 text-slate-400 dark:text-slate-500 text-[10px] font-semibold italic border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20">
                        Chưa có bản in nào được tạo.
                      </div>
                    }
                  </div>
                }
              }

              @if (!shouldShowPrefixLoop() && !unifiedAllSamplesReport()) {
                @if (runStatus === 'completed') {
                  <div class="bg-amber-50/30 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/30 rounded-2xl p-4 flex items-center justify-between gap-3">
                    <div>
                      <div class="text-xs font-bold text-slate-700 dark:text-slate-300">Mẻ hoàn thành nhưng chưa có file in</div>
                      <div class="text-[10px] text-slate-400 mt-0.5">Bản in chưa được tạo hoặc bị lỗi khi xuất.</div>
                    </div>
                    <button (click)="triggerCreateReport(undefined)"
                            class="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black transition shadow-sm active:scale-95 shrink-0 cursor-pointer border-0">
                      <i class="fa-solid fa-file-invoice text-[11px]"></i> TẠO FILE IN
                    </button>
                  </div>
                } @else {
                  <div class="text-center py-6 text-slate-400 dark:text-slate-500 font-semibold text-xs">
                    <i class="fa-solid fa-file-circle-xmark text-xl block mb-2 opacity-40"></i>
                    Mẻ chạy này chưa có báo cáo nào.
                  </div>
                }
              }
            </div>

            <div class="space-y-2.5">
              <h4 class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                <i class="fa-solid fa-clock-rotate-left text-slate-400"></i> Lịch sử phiên bản
              </h4>
              
              @if (isLoadingHistory) {
                <div class="flex items-center justify-center py-6 gap-2 text-slate-400">
                  <i class="fa-solid fa-spinner fa-spin"></i>
                  <span class="text-xs font-semibold">Đang tải lịch sử...</span>
                </div>
              } @else {
                @if (historyList.length > 0) {
                <div class="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                  @for (hist of historyList; track hist.version + '_' + hist.prefix) {
                    <div class="flex flex-col gap-1.5 bg-slate-50/60 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/60 rounded-xl px-3 py-2.5 text-xs">
                      <div class="flex items-center justify-between gap-3">
                        <div>
                          <div class="flex items-center gap-1.5">
                            <span class="font-extrabold text-slate-700 dark:text-slate-300">v{{ hist.version }}</span>
                            @if (hist.prefix) {
                              <span class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 text-[8px] font-bold uppercase">
                                {{ hist.prefix === '_NO_PREFIX_' ? 'No prefix' : hist.prefix }}
                              </span>
                            }
                            @if (hist.status === 'archived') {
                              <span class="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-[8px] font-black uppercase">Lưu trữ</span>
                            }
                            @if (hist.includedSamples?.length > 0) {
                              <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500">
                                <i class="fa-solid fa-vials text-[8px]"></i> {{ hist.includedSamples.length }} mẫu
                              </span>
                            }
                          </div>
                          <div class="text-[9px] text-slate-400 mt-0.5">{{ hist.publishedBy }} — {{ hist.publishedAt | date:'HH:mm dd/MM/yy' }}</div>
                        </div>
                        <div class="flex items-center gap-1.5 shrink-0">
                          @if (hist.pdfViewUrl || hist.pdfUrl) {
                            <button (click)="triggerPreviewPdf(hist.pdfViewUrl || hist.pdfUrl, hist.docsUrl, hist.prefix === '_NO_PREFIX_' ? '' : hist.prefix, hist.version, hist.publishedBy, hist.publishedAt)"
                               class="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-655 dark:bg-red-950/30 dark:hover:bg-red-900/40 dark:text-red-400 flex items-center justify-center transition active:scale-90 border-0 cursor-pointer" title="Mở PDF bản này">
                              <i class="fa-solid fa-file-pdf text-[10px]"></i>
                            </button>
                          }
                          @if (hist.docsUrl) {
                            <a [href]="getSafeGoogleUrl(hist.docsUrl)" target="_blank" rel="noopener noreferrer"
                               class="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 hover:text-blue-600 flex items-center justify-center text-slate-500 transition active:scale-90" title="Mở Docs bản này (Xem)">
                              <i class="fa-solid fa-file-word text-[10px]"></i>
                            </a>
                          }
                        </div>
                      </div>
                      @if (hist.includedSamples?.length > 0) {
                        <div class="border-t border-slate-200/40 dark:border-slate-800/40 pt-1.5">
                          <div class="flex flex-wrap gap-1 items-center">
                            @let histKey = 'hist_' + hist.version + '_' + (hist.prefix || 'all');
                            @if (expandedChipKeys()[histKey]) {
                              @for (s of hist.includedSamples; track s) {
                                <span class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[8px] font-mono font-bold border border-slate-200/20 dark:border-slate-700/20">{{ s }}</span>
                              }
                              <button (click)="toggleChipExpand(histKey)" class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[8px] font-bold border border-slate-300/35 cursor-pointer hover:bg-slate-350 dark:hover:bg-slate-600 transition active:scale-95 border-0">
                                Thu gọn ▲
                              </button>
                            } @else {
                              @let shortHist = getShortenedSampleChips(hist.includedSamples);
                              @for (s of shortHist.slice(0, 8); track s) {
                                <span class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[8px] font-mono font-bold border border-slate-200/20 dark:border-slate-700/20">{{ s }}</span>
                              }
                              @if (shortHist.length > 8) {
                                <button (click)="toggleChipExpand(histKey)" class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[8px] font-bold border border-slate-200/30 dark:border-slate-700/30 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition active:scale-95 border-0" [title]="shortHist.slice(8).join('; ')">
                                  +{{ shortHist.length - 8 }} nhóm nữa ▼
                                </button>
                              } @else if (hist.includedSamples.length > shortHist.length) {
                                <button (click)="toggleChipExpand(histKey)" class="px-1.5 py-0.5 rounded bg-slate-150 dark:bg-slate-800/40 text-slate-500 dark:text-slate-450 text-[8px] font-semibold border border-slate-200/25 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition active:scale-95 border-0">
                                  Chi tiết ▼
                                </button>
                              }
                            }
                          </div>
                        </div>
                      }
                    </div>
                  }
                </div>
              } @else {
                <div class="text-center py-4 text-slate-400 dark:text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
                  Không có bản in cũ trong lịch sử.
                </div>
              }
            }
            </div>

          </div>

          <div class="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0 bg-slate-50/30 dark:bg-slate-950/10">
            <button (click)="triggerCreateReport(undefined)"
                    class="flex items-center gap-1.5 px-4 py-2 text-xs font-black text-fuchsia-600 dark:text-fuchsia-400 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/20 rounded-xl transition active:scale-95 cursor-pointer border-0 bg-transparent">
              <i class="fa-solid fa-pen-to-square text-[11px]"></i> Mở để chỉnh sửa
            </button>
            <button (click)="closeModal()"
                    class="px-5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-250 rounded-xl text-xs font-black transition active:scale-95 cursor-pointer border-0">
              Đóng
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class ReportHubModalComponent {
  @Input() isOpen = false;
  @Input() run: any = null;
  @Input() historyList: any[] = [];
  @Input() isLoadingHistory: boolean = false;
  @Input() runStatus: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() createReport = new EventEmitter<{requestId: string, prefix?: string}>();
  @Output() previewPdf = new EventEmitter<{pdfUrl: string, docsUrl?: string, prefix: string, version?: number, publishedBy?: string, publishedAt?: string}>();

  private sanitizer = inject(DomSanitizer);
  activeTab = signal<'general' | 'prefix'>('general');
  expandedChipKeys = signal<Record<string, boolean>>({});

  closeModal() {
    this.close.emit();
  }

  triggerCreateReport(prefix?: string) {
    if (this.run) {
      this.createReport.emit({ requestId: this.run.id, prefix });
    }
  }

  triggerPreviewPdf(pdfUrl: string, docsUrl: string | undefined, prefix: string, version?: number, publishedBy?: string, publishedAt?: string) {
    this.previewPdf.emit({ pdfUrl, docsUrl, prefix, version, publishedBy, publishedAt });
  }

  getSafeGoogleUrl(docsUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(docsUrl);
  }

  toggleChipExpand(key: string) {
    this.expandedChipKeys.update(keys => ({
      ...keys,
      [key]: !keys[key]
    }));
  }

  // Chỉ hiển thị vòng lặp prefix nếu có NHIỀU HƠN 1 tiền tố
  // VÀ không có unified report ở root level (tránh hiển thị trùng lặp)
  shouldShowPrefixLoop(): boolean {
    if (!this.run) return false;
    // Nếu đã có BÁO CÁO CHUNG (unified), không cần show prefix loop nữa
    if (this.unifiedAllSamplesReport()) return false;
    const prefixes = this.getSelectedRunPrefixes();
    return prefixes.length > 1;
  }

  getSelectedRunPrefixes(): string[] {
    if (!this.run) return [];
    const reports = this.run.analysisResultSummary?.reports || this.run.analysisResult?.reports;
    if (!reports) return [];
    
    const prefixes = new Set<string>();
    for (const key of Object.keys(reports)) {
      if (key === '_NO_PREFIX_') {
        prefixes.add('');
      } else {
        const p = (reports[key] as any).prefix;
        if (p) prefixes.add(p);
        else prefixes.add(key); // Fallback
      }
    }
    return Array.from(prefixes).sort();
  }

  getReportsForPrefix(prefix: string): any[] {
    if (!this.run) return [];
    const reports = this.run.analysisResultSummary?.reports || this.run.analysisResult?.reports;
    if (!reports) return [];
    
    const prefixKey = prefix === '' ? '_NO_PREFIX_' : prefix;
    const result: any[] = [];
    
    for (const [key, rep] of Object.entries(reports)) {
      const repPrefix = (rep as any).prefix || key;
      if (repPrefix === prefixKey && ((rep as any).pdfUrl || (rep as any).pdfViewUrl)) {
        result.push({ ...(rep as any), _id: key });
      }
    }
    
    return result.sort((a, b) => (b.version || 0) - (a.version || 0));
  }

  unifiedAllSamplesReport(): any {
    if (!this.run) return null;
    
    if (this.run.analysisResultSummary?.pdfUrl || this.run.analysisResultSummary?.pdfViewUrl || this.run.analysisResult?.pdfUrl || this.run.analysisResult?.pdfViewUrl) {
      return {
        version: this.run.analysisResultSummary?.version || this.run.analysisResult?.version || 1,
        updatedAt: this.run.analysisResultSummary?.pdfCreatedAt || this.run.analysisResult?.pdfCreatedAt || this.run.updatedAt,
        pdfUrl: this.run.analysisResultSummary?.pdfUrl || this.run.analysisResult?.pdfUrl,
        pdfViewUrl: this.run.analysisResultSummary?.pdfViewUrl || this.run.analysisResult?.pdfViewUrl,
        docsUrl: this.run.analysisResultSummary?.docsUrl || this.run.analysisResult?.docsUrl,
        includedSamples: this.run.analysisResultSummary?.includedSamples || this.run.analysisResult?.includedSamples
      };
    }
    
    const prefixes = this.getSelectedRunPrefixes();
    if (prefixes.length === 1) {
      const singlePrefixReports = this.getReportsForPrefix(prefixes[0]);
      if (singlePrefixReports.length === 1) {
        const singlePrefixReport = singlePrefixReports[0];
        return {
          version: singlePrefixReport.version || 1,
          updatedAt: singlePrefixReport.pdfCreatedAt,
          pdfUrl: singlePrefixReport.pdfUrl,
          pdfViewUrl: singlePrefixReport.pdfViewUrl,
          docsUrl: singlePrefixReport.docsUrl,
          includedSamples: singlePrefixReport.includedSamples
        };
      }
    }
    return null;
  }

  getSampleChipsForReport(reportObj: any, prefixKey?: string): string[] {
    if (!reportObj) return [];
    
    if (reportObj.includedSamples && Array.isArray(reportObj.includedSamples)) {
      return reportObj.includedSamples;
    }

    if (prefixKey && reportObj.samples && typeof reportObj.samples === 'object') {
      const samples = Object.keys(reportObj.samples).filter(k => reportObj.samples[k]?.included !== false);
      if (samples.length > 0) return samples.sort();
    }
    
    // Fallback cho dữ liệu cũ chưa có includedSamples
    if (this.run?.sampleList) {
      return (this.run.sampleList as string[]).filter((s: string) => {
        if (!prefixKey || prefixKey === 'ALL') return true;
        const startsWithLetter = /^[a-zA-Z]/.test(s);
        const sPrefix = startsWithLetter ? s.charAt(0).toUpperCase() : '';
        const pKey = prefixKey === '_NO_PREFIX_' ? '' : prefixKey;
        return sPrefix === pKey;
      });
    }
    
    return [];
  }

  getShortenedSampleChips(samples: string[]): string[] {
    if (!samples || samples.length === 0) return [];
    const result: string[] = [];
    let i = 0;
    while (i < samples.length) {
      const start = samples[i];
      let j = i;
      while (j + 1 < samples.length && this.isSequential(samples[j], samples[j+1])) {
        j++;
      }
      if (j > i) {
        result.push(`${start} ⭢ ${samples[j]}`);
      } else {
        result.push(start);
      }
      i = j + 1;
    }
    return result;
  }

  private isSequential(s1: string, s2: string): boolean {
    const p1 = this.parseSample(s1);
    const p2 = this.parseSample(s2);
    if (!p1 || !p2) return false;
    if (p1.prefix !== p2.prefix) return false;
    if (p1.suffix !== p2.suffix) return false;
    return p1.num + 1 === p2.num;
  }

  private parseSample(s: string) {
    const match = s.match(/^([A-Za-z]+)(\d+)(.*)$/);
    if (!match) return null;
    return {
      prefix: match[1],
      num: parseInt(match[2], 10),
      suffix: match[3]
    };
  }
}
