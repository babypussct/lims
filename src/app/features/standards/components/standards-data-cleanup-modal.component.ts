import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReferenceStandard, StandardCleanupBatch } from '../../../core/models/standard.model';
import { ProgressService } from '../../../core/services/progress.service';
import { PubchemService } from '../../../core/services/pubchem.service';
import { ToastService } from '../../../core/services/toast.service';
import {
  normalizeChemicalNames,
  parseChemicalNames,
  serializeChemicalNames,
} from '../../../shared/utils/chemical-name';
import {
  assessCasNumber,
  assessCleanupGroup,
  CleanupRiskAssessment,
  detectStandardForm,
  formatStandardProductName,
} from '../../../shared/utils/standard-cleanup';
import { StandardService } from '../standard.service';

type CleanupStatus = 'pending' | 'loading' | 'ready' | 'review' | 'success' | 'error';
type CleanupFilter = 'all' | 'safe' | 'review' | 'blocked' | 'success';

interface CleanupRecord {
  standard: ReferenceStandard;
  originalName: string;
  suggestedName: string;
  selected: boolean;
  saved: boolean;
}

interface CleanupGroup {
  id: string;
  cas: string;
  records: CleanupRecord[];
  originalNames: string[];
  canonicalName: string;
  canonicalSource: 'existing' | 'pubchem' | 'manual';
  suggestedSynonyms: string;
  risk: CleanupRiskAssessment;
  status: CleanupStatus;
  errorMsg?: string;
}

@Component({
  selector: 'app-standards-data-cleanup-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
        <div class="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col max-h-[94vh] border border-slate-200/80 dark:border-slate-800 animate-slide-up">
          <header class="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex justify-between items-start gap-4 shrink-0">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-shield-halved"></i>
              </div>
              <div class="min-w-0">
                <h3 class="font-black text-slate-800 dark:text-slate-100 text-lg">Chuẩn Hóa Danh Pháp Chất Chuẩn</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Mỗi trang chỉ hiển thị một nhóm CAS; tên sản phẩm được duyệt riêng cho từng hồ sơ.</p>
              </div>
            </div>
            <button (click)="onClose()" [disabled]="isProcessing()" class="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 transition disabled:opacity-50 shrink-0" aria-label="Đóng">
              <i class="fa-solid fa-times"></i>
            </button>
          </header>

          <section class="px-5 sm:px-6 py-2.5 bg-indigo-50/60 dark:bg-indigo-950/30 border-b border-indigo-100/60 dark:border-indigo-900/30 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold shrink-0">
            <span class="text-slate-700 dark:text-slate-200"><i class="fa-solid fa-boxes-stacked text-indigo-500 mr-1"></i>{{totalStandardsCount()}} hồ sơ</span>
            <span class="text-emerald-700 dark:text-emerald-400"><i class="fa-solid fa-object-group mr-1"></i>{{groups().length}} CAS hợp lệ</span>
            @if (placeholderCasCount() > 0) {
              <span class="text-amber-700 dark:text-amber-400" title="NA, N/A, CAS inside và nhãn giữ chỗ"><i class="fa-solid fa-ban mr-1"></i>{{placeholderCasCount()}} nhãn CAS giữ chỗ</span>
            }
            @if (dateCorruptedCasCount() > 0) {
              <span class="text-red-700 dark:text-red-400" title="CAS có dấu hiệu bị chuyển thành ngày"><i class="fa-solid fa-calendar-xmark mr-1"></i>{{dateCorruptedCasCount()}} CAS dạng ngày</span>
            }
            @if (invalidCasCount() > 0) {
              <span class="text-red-700 dark:text-red-400"><i class="fa-solid fa-circle-exclamation mr-1"></i>{{invalidCasCount()}} CAS lỗi khác</span>
            }
            @if (missingCasCount() > 0) {
              <span class="text-slate-500 dark:text-slate-400"><i class="fa-solid fa-circle-minus mr-1"></i>{{missingCasCount()}} chưa có CAS</span>
            }
          </section>

          <section class="px-4 sm:px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="relative flex-1 min-w-[240px] max-w-md">
                <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input type="text" [ngModel]="searchQuery()" (ngModelChange)="setSearchQuery($event)" placeholder="Tìm CAS, tên, mã quản lý hoặc catalog..." class="w-full pl-8 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/40">
                @if (searchQuery()) {
                  <button (click)="setSearchQuery('')" class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1" aria-label="Xóa tìm kiếm"><i class="fa-solid fa-xmark"></i></button>
                }
              </div>
              <div class="flex items-center gap-2">
                <button (click)="openHistory()" [disabled]="isProcessing()" class="px-3 py-2 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold text-xs rounded-lg hover:bg-amber-100 transition disabled:opacity-50">
                  <i class="fa-solid fa-clock-rotate-left mr-1"></i>Hoàn tác ({{activeBatchCount()}})
                </button>
                <button (click)="scanData()" [disabled]="isProcessing()" class="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition disabled:opacity-50">
                  <i class="fa-solid fa-rotate mr-1"></i>Quét lại
                </button>
              </div>
            </div>
            <div class="flex items-center gap-1 overflow-x-auto pb-0.5 text-[11px] font-bold">
              <button (click)="setFilter('all')" [class]="filterClass('all')">Tất cả ({{groups().length}})</button>
              <button (click)="setFilter('safe')" [class]="filterClass('safe')">An toàn ({{safeCount()}})</button>
              <button (click)="setFilter('review')" [class]="filterClass('review')">Cần duyệt ({{mediumRiskCount()}})</button>
              <button (click)="setFilter('blocked')" [class]="filterClass('blocked')">Rủi ro cao ({{highRiskCount()}})</button>
              <button (click)="setFilter('success')" [class]="filterClass('success')">Đã lưu ({{successCount()}})</button>
            </div>
          </section>

          @if (showHistory()) {
            <section class="absolute inset-0 z-30 bg-white dark:bg-slate-900 flex flex-col">
              <header class="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-amber-50/70 dark:bg-amber-950/20 flex items-start justify-between gap-4 shrink-0">
                <div>
                  <h3 class="font-black text-slate-800 dark:text-slate-100 text-lg"><i class="fa-solid fa-clock-rotate-left text-amber-500 mr-2"></i>Lịch Sử Chuẩn Hóa & Hoàn Tác</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Mỗi lần lưu là một phiên độc lập. Hoàn tác bị chặn nếu hồ sơ đã được sửa sau phiên đó.</p>
                </div>
                <button (click)="showHistory.set(false)" [disabled]="undoingBatchId() !== null" class="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 disabled:opacity-50" aria-label="Đóng lịch sử"><i class="fa-solid fa-times"></i></button>
              </header>
              <div class="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 bg-slate-50/60 dark:bg-slate-950/30">
                @if (isLoadingHistory()) {
                  <div class="py-20 text-center text-slate-400"><i class="fa-solid fa-spinner fa-spin text-3xl mb-3"></i><p class="text-xs font-bold">Đang tải lịch sử...</p></div>
                } @else if (cleanupHistory().length === 0) {
                  <div class="py-20 text-center text-slate-400"><i class="fa-solid fa-clock text-4xl mb-3 text-slate-300 dark:text-slate-700"></i><p class="text-sm font-bold">Chưa có phiên chuẩn hóa nào.</p></div>
                } @else {
                  <div class="space-y-3 max-w-4xl mx-auto">
                    @for (batch of cleanupHistory(); track batch.id) {
                      <article class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
                        <div class="flex flex-wrap items-start justify-between gap-3">
                          <div class="min-w-0">
                            <div class="flex flex-wrap items-center gap-2 mb-1.5">
                              <span class="font-mono text-xs font-black text-indigo-600 dark:text-indigo-400">CAS {{batch.cas}}</span>
                              <span class="px-2 py-0.5 rounded-full text-[10px] font-black" [ngClass]="batch.status === 'APPLIED' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'">{{batch.status === 'APPLIED' ? 'Có thể hoàn tác' : 'Đã hoàn tác'}}</span>
                            </div>
                            <p class="text-xs font-bold text-slate-700 dark:text-slate-200">{{batch.recordCount}} hồ sơ · {{batch.createdByName || 'Người dùng'}} · {{formatBatchDate(batch.createdAt)}}</p>
                            <p class="text-[10px] text-slate-400 mt-1 font-mono">Phiên {{batch.id}}</p>
                          </div>
                          <button (click)="undoBatch(batch)" [disabled]="batch.status !== 'APPLIED' || undoingBatchId() !== null" class="px-3 py-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-40 disabled:cursor-not-allowed">
                            @if (undoingBatchId() === batch.id) { <i class="fa-solid fa-spinner fa-spin mr-1"></i>Đang hoàn tác }
                            @else { <i class="fa-solid fa-rotate-left mr-1"></i>Hoàn tác phiên }
                          </button>
                        </div>
                        <details class="mt-3 border-t border-slate-100 dark:border-slate-800 pt-2">
                          <summary class="cursor-pointer text-[11px] font-bold text-slate-500 dark:text-slate-400">Xem thay đổi trước/sau</summary>
                          <div class="mt-2 space-y-2">
                            @for (change of batch.changes; track change.standardId) {
                              <div class="grid sm:grid-cols-[100px_1fr_24px_1fr] gap-2 items-start text-[11px] rounded-lg bg-slate-50 dark:bg-slate-800/60 p-2.5">
                                <strong class="text-slate-600 dark:text-slate-300">{{change.internalId || change.standardId}}</strong>
                                <span class="text-red-600 dark:text-red-400 break-words">{{change.before.name}}</span>
                                <i class="fa-solid fa-arrow-right text-slate-400 mt-0.5"></i>
                                <span class="text-emerald-700 dark:text-emerald-400 break-words">{{change.after.name}}</span>
                              </div>
                            }
                          </div>
                        </details>
                      </article>
                    }
                  </div>
                }
              </div>
              <footer class="px-5 sm:px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end">
                <button (click)="showHistory.set(false)" [disabled]="undoingBatchId() !== null" class="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold disabled:opacity-50">Quay lại chuẩn hóa</button>
              </footer>
            </section>
          }

          <main class="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-slate-950/30">
            @if (groups().length === 0) {
              <div class="py-20 text-center text-slate-400">
                <i class="fa-solid fa-clipboard-check text-5xl mb-3 text-slate-300 dark:text-slate-700"></i>
                <p class="font-bold text-sm">Chưa có hồ sơ với số CAS hợp lệ.</p>
                <p class="text-xs mt-1">Các nhãn giữ chỗ và CAS lỗi đã được chặn khỏi quy trình chuẩn hóa.</p>
              </div>
            } @else if (!currentGroup()) {
              <div class="py-16 text-center text-slate-400">
                <i class="fa-solid fa-filter text-4xl mb-2 text-slate-300 dark:text-slate-700"></i>
                <p class="font-bold text-sm">Không có nhóm CAS phù hợp bộ lọc.</p>
                <button (click)="clearFilters()" class="mt-3 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg">Xóa bộ lọc</button>
              </div>
            } @else {
              @let group = currentGroup()!;
              <div class="p-4 sm:p-6 space-y-4">
                <nav class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 shadow-sm" aria-label="Phân trang nhóm CAS">
                  <button (click)="previousPage()" [disabled]="currentPageIndex() === 0 || isProcessing()" class="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <i class="fa-solid fa-chevron-left mr-1"></i>Nhóm trước
                  </button>
                  <div class="text-center min-w-0">
                    <div class="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Nhóm {{currentPageIndex() + 1}} / {{filteredGroups().length}}</div>
                    <div class="text-sm font-black text-indigo-600 dark:text-indigo-400 font-mono truncate">CAS {{group.cas}}</div>
                  </div>
                  <button (click)="nextPage()" [disabled]="currentPageIndex() >= filteredGroups().length - 1 || isProcessing()" class="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800">
                    Nhóm sau<i class="fa-solid fa-chevron-right ml-1"></i>
                  </button>
                </nav>
                <div class="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div class="h-full bg-indigo-500 transition-all" [style.width.%]="pageProgress()"></div>
                </div>

                <section class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                  <div class="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-start justify-between gap-4">
                    <div class="min-w-0">
                      <div class="flex flex-wrap items-center gap-2 mb-2">
                        <span class="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-mono text-xs font-black">{{group.cas}}</span>
                        <span class="px-2 py-1 rounded-full text-[10px] font-black" [ngClass]="riskBadgeClass(group.risk.level)">{{riskLabel(group.risk.level)}}</span>
                        <span class="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold">{{group.records.length}} hồ sơ</span>
                        @if (group.status === 'success') {
                          <span class="px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold"><i class="fa-solid fa-check-double mr-1"></i>Đã lưu toàn nhóm</span>
                        }
                      </div>
                      <ul class="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                        @for (reason of group.risk.reasons; track reason) {
                          <li><i class="fa-solid fa-circle-info mr-1.5" [ngClass]="riskTextClass(group.risk.level)"></i>{{reason}}</li>
                        }
                      </ul>
                    </div>
                    <button (click)="fetchGroupInfo(group)" [disabled]="group.status === 'loading' || isProcessing()" class="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm disabled:opacity-50">
                      @if (group.status === 'loading') { <i class="fa-solid fa-spinner fa-spin mr-1"></i>Đang tra cứu }
                      @else { <i class="fa-solid fa-wand-magic-sparkles mr-1"></i>Tra PubChem nhóm này }
                    </button>
                  </div>

                  <div class="p-4 sm:p-5 grid lg:grid-cols-2 gap-4 bg-slate-50/60 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <label class="block text-[11px] font-black text-slate-600 dark:text-slate-300 mb-1.5">Tên hóa chất chuẩn hóa</label>
                      <input type="text" [ngModel]="group.canonicalName" (ngModelChange)="updateCanonicalName(group.id, $event)" placeholder="PubChem hoặc tên đã được chuyên gia duyệt" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50">
                      <p class="text-[10px] text-slate-400 mt-1">Trường này mô tả hóa chất; không thay thế nồng độ, dung môi hay dạng sản phẩm.</p>
                    </div>
                    <div class="flex flex-col justify-end gap-2">
                      <button (click)="applyCanonicalToCurrentGroup()" [disabled]="!group.risk.canApplyCanonicalToAll || !group.canonicalName.trim() || isProcessing()" class="w-full px-3 py-2.5 rounded-lg text-xs font-bold border transition disabled:opacity-45 disabled:cursor-not-allowed bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100">
                        <i class="fa-solid fa-arrow-down-wide-short mr-1"></i>Áp dụng tên chuẩn cho toàn nhóm an toàn
                      </button>
                      @if (!group.risk.canApplyCanonicalToAll) {
                        <p class="text-[10px] text-amber-600 dark:text-amber-400 font-semibold"><i class="fa-solid fa-lock mr-1"></i>Đã khóa áp dụng một tên chung vì nhóm có nguy cơ mất thông tin sản phẩm.</p>
                      }
                    </div>
                  </div>

                  <details class="border-b border-slate-100 dark:border-slate-800">
                    <summary class="px-4 sm:px-5 py-3 cursor-pointer text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <i class="fa-solid fa-tags mr-1.5 text-indigo-500"></i>Tên đồng nghĩa và tên tìm kiếm
                    </summary>
                    <div class="px-4 sm:px-5 pb-4">
                      <textarea [ngModel]="group.suggestedSynonyms" (ngModelChange)="updateSuggestedSynonyms(group.id, $event)" rows="3" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none" placeholder="Mỗi tên một dòng; không tách dấu phẩy trong danh pháp."></textarea>
                    </div>
                  </details>

                  <div class="p-4 sm:p-5">
                    <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div>
                        <h4 class="font-black text-sm text-slate-800 dark:text-slate-100">Duyệt từng hồ sơ trong nhóm</h4>
                        <p class="text-[10px] text-slate-400">Chỉ các hồ sơ được đánh dấu mới được lưu.</p>
                      </div>
                      <div class="flex items-center gap-2">
                        <button (click)="normalizeCurrentGroupTypography()" [disabled]="isProcessing()" class="px-3 py-1.5 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"><i class="fa-solid fa-text-height mr-1"></i>Chuẩn hóa kiểu chữ</button>
                        <button (click)="toggleAllCurrentRecords()" [disabled]="isProcessing()" class="px-3 py-1.5 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">{{allCurrentRecordsSelected() ? 'Bỏ chọn nhóm' : 'Chọn hồ sơ nhóm này'}}</button>
                      </div>
                    </div>

                    <div class="space-y-3">
                      @for (record of group.records; track record.standard.id) {
                        <article class="rounded-xl border p-3 sm:p-4 transition" [ngClass]="record.selected ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50/40 dark:bg-indigo-950/15' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'">
                          <div class="flex items-start gap-3">
                            <input type="checkbox" [ngModel]="record.selected" (ngModelChange)="toggleRecord(group.id, record.standard.id, $event)" class="w-4 h-4 accent-indigo-600 mt-1 shrink-0" [attr.aria-label]="'Chọn ' + record.originalName">
                            <div class="flex-1 min-w-0 grid lg:grid-cols-[minmax(190px,0.8fr)_minmax(260px,1.2fr)] gap-3">
                              <div class="min-w-0">
                                <div class="flex flex-wrap items-center gap-1.5 mb-1.5">
                                  <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-600 dark:text-slate-300">{{record.standard.internal_id || record.standard.id}}</span>
                                  @if (record.standard.product_code) { <span class="text-[10px] text-slate-400 font-mono">{{record.standard.product_code}}</span> }
                                  @if (record.saved) { <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold"><i class="fa-solid fa-check mr-0.5"></i>Đã lưu</span> }
                                </div>
                                <p class="text-[11px] text-slate-400 mb-0.5">Tên hiện tại</p>
                                <p class="text-xs font-bold text-slate-700 dark:text-slate-200 break-words">{{record.originalName}}</p>
                                <div class="mt-2 flex flex-wrap gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                                  <span><strong>Đơn vị:</strong> {{record.standard.unit || '—'}}</span>
                                  <span><strong>Quy cách:</strong> {{record.standard.pack_size || '—'}}</span>
                                  <span><strong>Dạng:</strong> {{formLabel(record.originalName)}}</span>
                                </div>
                              </div>
                              <div>
                                <label class="block text-[11px] font-black text-slate-600 dark:text-slate-300 mb-1.5">Tên sản phẩm sau chuẩn hóa</label>
                                <input type="text" [ngModel]="record.suggestedName" (ngModelChange)="updateRecordName(group.id, record.standard.id, $event)" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50" [class.border-amber-400]="!record.suggestedName.trim()">
                                @if (record.suggestedName.trim() !== record.originalName.trim()) {
                                  <p class="text-[10px] mt-1 text-indigo-600 dark:text-indigo-400"><i class="fa-solid fa-arrow-right mr-1"></i>Có thay đổi; kiểm tra nồng độ, dung môi và dạng chất trước khi chọn.</p>
                                }
                              </div>
                            </div>
                          </div>
                        </article>
                      }
                    </div>
                  </div>
                </section>
              </div>
            }
          </main>

          <footer class="px-4 sm:px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap justify-between gap-3 items-center shrink-0">
            <div class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <i class="fa-solid fa-shield-halved text-amber-500 mr-1"></i>Chỉ lưu nhóm CAS đang hiển thị · Đã chọn <strong class="text-indigo-600 dark:text-indigo-400">{{currentSelectedCount()}}</strong> hồ sơ
            </div>
            <div class="flex items-center gap-2">
              <button (click)="onClose()" [disabled]="isProcessing()" class="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-bold text-xs disabled:opacity-50">Đóng</button>
              <button (click)="applyCurrentGroup(false)" [disabled]="currentSelectedCount() === 0 || isProcessing()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-sm disabled:opacity-45 flex items-center gap-1.5">
                @if (isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i>Đang lưu }
                @else { <i class="fa-solid fa-floppy-disk"></i>Lưu nhóm hiện tại }
              </button>
              <button (click)="applyCurrentGroup(true)" [disabled]="currentSelectedCount() === 0 || isProcessing()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-sm disabled:opacity-45 hidden sm:flex items-center gap-1.5">
                Lưu & nhóm sau<i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </footer>
        </div>
      </div>
    }
  `,
})
export class StandardsDataCleanupModalComponent {
  isOpen = input<boolean>(false);
  allStandards = input<ReferenceStandard[]>([]);
  closeModal = output<void>();

  private pubchemService = inject(PubchemService);
  private standardService = inject(StandardService);
  private toast = inject(ToastService);
  private progressService = inject(ProgressService);

  groups = signal<CleanupGroup[]>([]);
  isProcessing = signal(false);
  searchQuery = signal('');
  statusFilter = signal<CleanupFilter>('all');
  pageIndex = signal(0);
  totalStandardsCount = signal(0);
  missingCasCount = signal(0);
  placeholderCasCount = signal(0);
  dateCorruptedCasCount = signal(0);
  invalidCasCount = signal(0);
  showHistory = signal(false);
  cleanupHistory = signal<StandardCleanupBatch[]>([]);
  isLoadingHistory = signal(false);
  undoingBatchId = signal<string | null>(null);

  filteredGroups = computed(() => {
    const query = this.searchQuery().trim().toLocaleLowerCase('vi-VN');
    const filter = this.statusFilter();
    return this.groups().filter(group => {
      const matchesFilter = filter === 'all'
        || (filter === 'safe' && group.risk.level === 'low' && group.status !== 'success')
        || (filter === 'review' && group.risk.level === 'medium' && group.status !== 'success')
        || (filter === 'blocked' && group.risk.level === 'high' && group.status !== 'success')
        || (filter === 'success' && group.status === 'success');
      if (!matchesFilter) return false;
      if (!query) return true;
      return group.cas.toLocaleLowerCase('vi-VN').includes(query)
        || group.canonicalName.toLocaleLowerCase('vi-VN').includes(query)
        || group.records.some(record => [
          record.originalName,
          record.suggestedName,
          record.standard.internal_id,
          record.standard.product_code,
        ].some(value => value?.toLocaleLowerCase('vi-VN').includes(query)));
    });
  });

  currentPageIndex = computed(() => Math.min(this.pageIndex(), Math.max(0, this.filteredGroups().length - 1)));
  currentGroup = computed(() => this.filteredGroups()[this.currentPageIndex()] ?? null);
  pageProgress = computed(() => this.filteredGroups().length === 0 ? 0 : ((this.currentPageIndex() + 1) / this.filteredGroups().length) * 100);
  safeCount = computed(() => this.groups().filter(group => group.risk.level === 'low').length);
  mediumRiskCount = computed(() => this.groups().filter(group => group.risk.level === 'medium').length);
  highRiskCount = computed(() => this.groups().filter(group => group.risk.level === 'high').length);
  successCount = computed(() => this.groups().filter(group => group.status === 'success').length);
  activeBatchCount = computed(() => this.cleanupHistory().filter(batch => batch.status === 'APPLIED').length);
  currentSelectedCount = computed(() => this.currentGroup()?.records.filter(record => record.selected && record.suggestedName.trim()).length ?? 0);
  allCurrentRecordsSelected = computed(() => {
    const records = this.currentGroup()?.records ?? [];
    return records.length > 0 && records.every(record => record.selected);
  });

  constructor() {
    effect(() => {
      const open = this.isOpen();
      const count = this.allStandards().length;
      if (open && count > 0) {
        untracked(() => {
          if (this.groups().length === 0) this.scanData();
          if (this.cleanupHistory().length === 0 && !this.isLoadingHistory()) void this.loadCleanupHistory();
        });
      }
    });
  }

  scanData(source: ReferenceStandard[] = this.allStandards()): void {
    const active = source.filter(standard => !standard._isDeleted);
    const grouped = new Map<string, ReferenceStandard[]>();
    const counts = { missing: 0, placeholder: 0, date_corrupted: 0, annotated: 0, invalid: 0 };

    active.forEach(standard => {
      const cas = assessCasNumber(standard.cas_number);
      if (cas.quality !== 'valid') {
        counts[cas.quality]++;
        return;
      }
      if (!cas.normalizedCas) return;
      const bucket = grouped.get(cas.normalizedCas) ?? [];
      bucket.push(standard);
      grouped.set(cas.normalizedCas, bucket);
    });

    const groups = [...grouped.entries()].map(([cas, standards]): CleanupGroup => {
      const originalNames = [...new Map(
        standards.map(item => item.name.trim()).filter(Boolean).map(name => [name.toLocaleLowerCase('en-US'), name])
      ).values()];
      const risk = assessCleanupGroup(standards);
      const canonicalName = standards.find(item => item.canonical_name?.trim())?.canonical_name?.trim()
        || (risk.level === 'low' ? formatStandardProductName(originalNames[0] ?? '') : '');
      const existingAliases = standards.flatMap(item => parseChemicalNames(item.chemical_name ?? ''));

      return {
        id: cas,
        cas,
        records: standards.map(standard => ({
          standard,
          originalName: standard.name.trim(),
          suggestedName: formatStandardProductName(standard.name),
          selected: false,
          saved: false,
        })),
        originalNames,
        canonicalName,
        canonicalSource: 'existing',
        suggestedSynonyms: normalizeChemicalNames(existingAliases, [canonicalName, cas]).join('\n'),
        risk,
        status: risk.level === 'low' ? 'ready' : 'review',
      };
    });

    groups.sort((a, b) => {
      const riskOrder = { high: 0, medium: 1, low: 2 };
      return riskOrder[a.risk.level] - riskOrder[b.risk.level]
        || b.records.length - a.records.length
        || a.cas.localeCompare(b.cas);
    });

    this.groups.set(groups);
    this.totalStandardsCount.set(active.length);
    this.missingCasCount.set(counts.missing);
    this.placeholderCasCount.set(counts.placeholder);
    this.dateCorruptedCasCount.set(counts.date_corrupted);
    this.invalidCasCount.set(counts.annotated + counts.invalid);
    this.pageIndex.set(0);
  }

  setSearchQuery(value: string): void {
    this.searchQuery.set(value);
    this.pageIndex.set(0);
  }

  setFilter(filter: CleanupFilter): void {
    this.statusFilter.set(filter);
    this.pageIndex.set(0);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.statusFilter.set('all');
    this.pageIndex.set(0);
  }

  async openHistory(): Promise<void> {
    this.showHistory.set(true);
    await this.loadCleanupHistory();
  }

  async loadCleanupHistory(): Promise<void> {
    this.isLoadingHistory.set(true);
    try {
      this.cleanupHistory.set(await this.standardService.getRecentStandardNameCleanupBatches(20));
    } catch (error) {
      console.error('Load cleanup history failed', error);
      this.toast.show('Không thể tải lịch sử chuẩn hóa.', 'error');
    } finally {
      this.isLoadingHistory.set(false);
    }
  }

  formatBatchDate(value: any): string {
    if (!value) return 'Đang đồng bộ';
    const date = typeof value.toDate === 'function' ? value.toDate() : new Date(value);
    return Number.isNaN(date.getTime()) ? 'Không rõ thời gian' : date.toLocaleString('vi-VN');
  }

  async undoBatch(batch: StandardCleanupBatch): Promise<void> {
    if (batch.status !== 'APPLIED' || this.undoingBatchId()) return;
    if (!confirm(`Hoàn tác phiên ${batch.id}?\n\n${batch.recordCount} hồ sơ CAS ${batch.cas} sẽ được khôi phục về tên và metadata trước khi chuẩn hóa.`)) return;

    this.undoingBatchId.set(batch.id);
    try {
      await this.standardService.undoStandardNameCleanupBatch(batch.id);
      const freshStandards = await this.standardService.fetchAllAndCache();
      this.scanData(freshStandards);
      await this.loadCleanupHistory();
      this.toast.show(`Đã hoàn tác phiên ${batch.id}.`, 'success');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Không thể hoàn tác phiên chuẩn hóa.';
      this.toast.show(message, 'error');
    } finally {
      this.undoingBatchId.set(null);
    }
  }

  filterClass(filter: CleanupFilter): string {
    const active = this.statusFilter() === filter;
    return `px-3 py-1.5 rounded-lg whitespace-nowrap transition ${active
      ? 'bg-indigo-600 text-white shadow-sm'
      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`;
  }

  previousPage(): void {
    this.pageIndex.update(index => Math.max(0, index - 1));
  }

  nextPage(): void {
    this.pageIndex.update(index => Math.min(this.filteredGroups().length - 1, index + 1));
  }

  riskLabel(level: CleanupRiskAssessment['level']): string {
    return level === 'low' ? 'An toàn' : level === 'medium' ? 'Cần duyệt' : 'Rủi ro cao';
  }

  riskBadgeClass(level: CleanupRiskAssessment['level']): string {
    if (level === 'low') return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300';
    if (level === 'medium') return 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300';
    return 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300';
  }

  riskTextClass(level: CleanupRiskAssessment['level']): string {
    return level === 'low' ? 'text-emerald-500' : level === 'medium' ? 'text-amber-500' : 'text-red-500';
  }

  formLabel(name: string): string {
    const labels = {
      neat: 'Chất riêng',
      solution: 'Dung dịch',
      mixture: 'Hỗn hợp',
      isotope: 'Đồng vị',
      salt_or_hydrate: 'Muối/Hydrat',
    };
    return labels[detectStandardForm(name)];
  }

  updateCanonicalName(groupId: string, value: string): void {
    this.updateGroup(groupId, group => ({ ...group, canonicalName: value, canonicalSource: 'manual' }));
  }

  updateSuggestedSynonyms(groupId: string, value: string): void {
    this.updateGroup(groupId, group => ({ ...group, suggestedSynonyms: value }));
  }

  updateRecordName(groupId: string, standardId: string, value: string): void {
    this.updateGroup(groupId, group => ({
      ...group,
      records: group.records.map(record => record.standard.id === standardId
        ? { ...record, suggestedName: value, selected: Boolean(value.trim()), saved: false }
        : record),
      status: group.risk.level === 'low' ? 'ready' : 'review',
    }));
  }

  toggleRecord(groupId: string, standardId: string, selected: boolean): void {
    this.updateGroup(groupId, group => ({
      ...group,
      records: group.records.map(record => record.standard.id === standardId ? { ...record, selected } : record),
    }));
  }

  toggleAllCurrentRecords(): void {
    const group = this.currentGroup();
    if (!group) return;
    const selected = !this.allCurrentRecordsSelected();
    this.updateGroup(group.id, current => ({
      ...current,
      records: current.records.map(record => ({ ...record, selected: selected && Boolean(record.suggestedName.trim()) })),
    }));
  }

  normalizeCurrentGroupTypography(): void {
    const group = this.currentGroup();
    if (!group) return;
    let changed = 0;
    this.updateGroup(group.id, current => ({
      ...current,
      records: current.records.map(record => {
        const suggestedName = formatStandardProductName(record.originalName);
        const hasChanged = suggestedName !== record.originalName;
        if (hasChanged) changed++;
        return { ...record, suggestedName, selected: hasChanged, saved: false };
      }),
    }));
    this.toast.show(changed > 0 ? `Đã chọn ${changed} hồ sơ có thay đổi kiểu chữ/ký hiệu.` : 'Nhóm này chưa có thay đổi kiểu chữ.', 'info');
  }

  applyCanonicalToCurrentGroup(): void {
    const group = this.currentGroup();
    if (!group?.risk.canApplyCanonicalToAll || !group.canonicalName.trim()) return;
    const canonicalName = formatStandardProductName(group.canonicalName);
    this.updateGroup(group.id, current => ({
      ...current,
      canonicalName,
      canonicalSource: 'manual',
      records: current.records.map(record => ({ ...record, suggestedName: canonicalName, selected: true, saved: false })),
      status: 'ready',
    }));
  }

  async fetchGroupInfo(group: CleanupGroup): Promise<void> {
    if (group.status === 'loading') return;
    this.updateGroup(group.id, current => ({ ...current, status: 'loading', errorMsg: undefined }));
    try {
      const info = await this.pubchemService.getChemicalInfo(group.cas);
      if (!info?.commercialName) {
        this.updateGroup(group.id, current => ({
          ...current,
          status: 'review',
          errorMsg: 'PubChem không tìm thấy tên; dữ liệu sản phẩm hiện tại được giữ nguyên.',
        }));
        this.toast.show(`PubChem không tìm thấy CAS ${group.cas}.`, 'info');
        return;
      }

      const canonicalName = formatStandardProductName(info.commercialName);
      this.updateGroup(group.id, current => ({
        ...current,
        canonicalName,
        canonicalSource: 'pubchem',
        suggestedSynonyms: normalizeChemicalNames([
          ...parseChemicalNames(current.suggestedSynonyms),
          ...info.synonyms.slice(0, 8),
        ], [canonicalName, current.cas]).join('\n'),
        status: current.risk.level === 'low' ? 'ready' : 'review',
      }));
      this.toast.show('Đã lấy tên hóa chất chuẩn. Tên sản phẩm chưa bị ghi đè.', 'success');
    } catch (error) {
      console.error('PubChem lookup failed', error);
      this.updateGroup(group.id, current => ({ ...current, status: 'error', errorMsg: 'Không thể kết nối PubChem.' }));
      this.toast.show('Không thể kết nối PubChem.', 'error');
    }
  }

  async applyCurrentGroup(goNext: boolean): Promise<void> {
    const group = this.currentGroup();
    if (!group) return;
    const selected = group.records.filter(record => record.selected && record.suggestedName.trim());
    if (selected.length === 0) return;

    const riskWarning = group.risk.level === 'high'
      ? '\nĐây là nhóm rủi ro cao; mỗi hồ sơ sẽ giữ đề xuất tên riêng.'
      : '';
    if (!confirm(`Lưu ${selected.length} hồ sơ trong nhóm CAS ${group.cas}?${riskWarning}\n\nChỉ trường danh pháp và metadata chuẩn hóa được cập nhật.`)) return;

    this.isProcessing.set(true);
    const pageBeforeSave = this.currentPageIndex();
    this.progressService.start('Đang lưu nhóm CAS', group.cas, selected.length);
    try {
      const batchId = await this.standardService.updateStandardNames(selected.map((record, index) => {
        this.progressService.update(index + 1, record.standard.internal_id || record.standard.id);
        const normalizedName = formatStandardProductName(record.suggestedName);
        const aliases = normalizeChemicalNames([
          ...parseChemicalNames(group.suggestedSynonyms),
          group.canonicalName,
          record.originalName,
        ], [normalizedName, group.cas]);
        return {
          standardId: record.standard.id,
          name: normalizedName,
          chemicalName: serializeChemicalNames(aliases),
          canonicalName: formatStandardProductName(group.canonicalName),
          originalName: record.originalName,
          nameSource: group.canonicalSource === 'pubchem'
            ? 'pubchem' as const
            : (group.canonicalSource === 'manual' ? 'manual' as const : 'cleanup' as const),
          casStatus: 'valid' as const,
          standardForm: detectStandardForm(normalizedName),
          normalizationVersion: '2026.07.1',
        };
      }));

      const savedIds = new Set(selected.map(record => record.standard.id));
      this.updateGroup(group.id, current => {
        const records = current.records.map(record => savedIds.has(record.standard.id)
          ? {
              ...record,
              originalName: formatStandardProductName(record.suggestedName),
              suggestedName: formatStandardProductName(record.suggestedName),
              selected: false,
              saved: true,
            }
          : record);
        return {
          ...current,
          records,
          status: records.every(record => record.saved) ? 'success' : (current.risk.level === 'low' ? 'ready' : 'review'),
          errorMsg: undefined,
        };
      });
      await this.loadCleanupHistory();
      this.toast.show(`Đã lưu ${selected.length} hồ sơ trong CAS ${group.cas} · phiên ${batchId}.`, 'success');
      if (goNext) {
        const stillVisible = this.filteredGroups().some(item => item.id === group.id);
        const targetPage = stillVisible ? pageBeforeSave + 1 : pageBeforeSave;
        this.pageIndex.set(Math.min(targetPage, Math.max(0, this.filteredGroups().length - 1)));
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Không thể lưu nhóm CAS.';
      this.updateGroup(group.id, current => ({ ...current, status: 'error', errorMsg: message }));
      this.toast.show(message, 'error');
    } finally {
      this.progressService.complete();
      this.isProcessing.set(false);
    }
  }

  onClose(): void {
    if (this.isProcessing()) return;
    this.closeModal.emit();
    this.groups.set([]);
    this.showHistory.set(false);
    this.clearFilters();
  }

  private updateGroup(groupId: string, updater: (group: CleanupGroup) => CleanupGroup): void {
    this.groups.update(groups => groups.map(group => group.id === groupId ? updater(group) : group));
  }
}
