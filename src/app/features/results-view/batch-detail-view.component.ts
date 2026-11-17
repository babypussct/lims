import { Component, inject, signal, computed, OnInit, OnDestroy, ElementRef, viewChild, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { StateService } from '../../core/services/state.service';
import { AuthService } from '../../core/services/auth.service';
import { ResultService } from '../results/services/result.service';
import { PrintService } from '../../core/services/print.service';
import { BatchWorksheetService } from '../../core/services/batch-worksheet.service';
import { worksheetReference } from '../../shared/utils/batch-worksheet';
import { ToastService } from '../../core/services/toast.service';
import { AnalysisResultDraft } from '../../core/models/analysis-result.model';
import { resolveConfigKey, ANGULAR_SOP_CONFIG } from '../results/config/sop-configs';
import { getSafeGooglePreviewUrl } from '../../shared/utils/utils';
import { ensureQrious } from '../../shared/utils/external-script-loader';
import { resolveCompoundDisplayName, isCompoundAssigned } from '../results/shared/compound-id-resolver';
import { MasterTargetService } from '../targets/master-target.service';
import { timestampToDate } from '../../shared/utils/timestamp';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { AppPageHeaderComponent } from '../../shared/components/ui/page-header/page-header.component';
import { AppButtonComponent } from '../../shared/components/ui/button/button.component';
import { AppModalShellComponent } from '../../shared/components/ui/modal-shell/modal-shell.component';
import { ResultPdfReportPaneComponent, PdfPaneModalEvent } from '../results/components/result-pdf-report-pane.component';
import { canUserEditResults, isRunActivelyLockedByOthers } from '../results/services/result-write-guard';

@Component({
  selector: 'app-batch-detail-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AppPageHeaderComponent, AppButtonComponent, AppModalShellComponent, ResultPdfReportPaneComponent],
  template: `
    <div class="min-h-full lg:h-full flex flex-col animate-fade-in p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-5">
      
      <!-- ENTITY DETAIL HEADER -->
      <app-page-header
        variant="detail"
        [sticky]="true"
        title="Chi tiết kết quả mẻ phân tích"
        [subtitle]="run() ? run().sopName : 'Đang tải thông tin mẻ chạy...'">
        <button
          pageHeaderLeading
          type="button"
          (click)="goBack()"
          aria-label="Quay lại danh sách kết quả"
          title="Quay lại danh sách kết quả"
          class="group flex h-10 w-10 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 shadow-soft-sm transition hover:bg-slate-50 hover:text-indigo-600 active:scale-95 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-indigo-400">
          <i class="fa-solid fa-arrow-left text-xs transition-transform group-hover:-translate-x-0.5" aria-hidden="true"></i>
        </button>

        @if (run() && !run().isVirtualMaster && worksheets.canRead()) {
          <app-button pageHeaderActions variant="secondary" size="sm" [loading]="worksheets.loading()" (click)="printWorksheet()"><i class="fa-solid fa-print" aria-hidden="true"></i> Phiếu phân tích</app-button>
        }
        @if (run() && draft() && config()) {
          <div pageHeaderActions class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              (click)="toggleFocusMode()"
              [attr.aria-pressed]="isFocusMode()"
              [class]="isFocusMode()
                ? 'border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300'
                : 'border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'"
              class="hidden lg:inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold shadow-soft-sm transition active:scale-95"
              [title]="isFocusMode() ? 'Thoát chế độ tập trung' : 'Chế độ tập trung (ẩn thanh điều hướng)'">
              <i class="fa-solid text-xs" [class.fa-compress]="isFocusMode()" [class.fa-expand]="!isFocusMode()" aria-hidden="true"></i>
              <span>{{ isFocusMode() ? 'Thu gọn' : 'Mở rộng' }}</span>
            </button>

            <button
              type="button"
              (click)="openQrModal()"
              class="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3 text-xs font-bold text-slate-700 shadow-soft-sm transition hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
              <i class="fa-solid fa-qrcode text-indigo-500" aria-hidden="true"></i>
              <span>Mã QR</span>
            </button>

            @if (canEditResults()) {
              <button
                type="button"
                (click)="goToEditMode()"
                [class]="lockedByOthers()
                  ? 'inline-flex h-9 items-center gap-2 rounded-xl bg-amber-600 px-4 text-xs font-bold text-white shadow-soft-md transition hover:bg-amber-700 active:scale-95'
                  : 'inline-flex h-9 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white shadow-soft-md transition hover:bg-indigo-700 active:scale-95'"
                [title]="lockedByOthers() ? 'Mẻ này đang bị sửa bởi ' + run()?.lockedByName + '. Nhấp để xem chi tiết hoặc Giành quyền.' : 'Nhấp để chỉnh sửa số liệu'">
                <i class="fa-solid" [class.fa-lock]="lockedByOthers()" [class.fa-pen-to-square]="!lockedByOthers()" aria-hidden="true"></i>
                <span>{{ lockedByOthers() ? 'Mẻ đang khóa' : 'Chỉnh sửa số liệu' }}</span>
              </button>
            }
          </div>
        }

        @if (run() && draft() && config()) {
          <div pageHeaderMeta class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <span [class]="getStatusClass()" class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide shadow-xs">
              <span class="h-1.5 w-1.5 rounded-full" [ngClass]="{
                'bg-emerald-500': draft()?.status === 'completed',
                'bg-indigo-500': draft()?.status === 'draft',
                'bg-amber-500': $any(draft()?.status) === 'pending' || !draft()?.status
              }"></span>
              {{ getStatusText() }}
            </span>
            <div class="flex items-center gap-1.5">
              <i class="fa-solid fa-barcode text-slate-400 dark:text-slate-600 text-[11px]"></i>
              <span>Mã mẻ:</span>
              <span class="font-mono font-bold text-slate-700 dark:text-slate-300 select-all">{{ run()?.inputs?.['batchCode'] || run()?.id || 'Chưa có mã mẻ' }}</span>
            </div>
            
            <div class="text-slate-300 dark:text-slate-700 select-none">•</div>

            <div class="flex items-center gap-1.5">
              <i class="fa-solid fa-user-astronaut text-slate-400 dark:text-slate-600 text-[11px]"></i>
              <span>Phân tích viên:</span>
              <span class="font-bold text-slate-700 dark:text-slate-300">{{ run()?.user || '—' }}</span>
            </div>

            <div class="text-slate-300 dark:text-slate-700 select-none">•</div>

            <div class="flex items-center gap-1.5">
              <i class="fa-regular fa-calendar text-slate-400 dark:text-slate-600 text-[11px]"></i>
              <span>Ngày phân tích:</span>
              <span class="font-bold text-slate-700 dark:text-slate-300">{{ run()?.analysisDate ? (run()!.analysisDate | date:'dd/MM/yyyy') : '—' }}</span>
            </div>

            @if (run()?.parentMasterId) {
              <a [routerLink]="['/results-view', run().parentMasterId]" class="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[9px] font-extrabold uppercase text-indigo-600 shadow-xs transition hover:bg-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-400 dark:hover:bg-indigo-900/30" title="Mẻ chạy này đã được gộp số liệu. Nhấn để đi tới mẻ tổng hợp.">
                <i class="fa-solid fa-link text-[8px]" aria-hidden="true"></i>
                Đã gộp mẻ tổng hợp
              </a>
            }
          </div>
        }
      </app-page-header>

      <!-- MAIN SPLIT SCREEN LAYOUT -->
      @if (isLoading()) {
        <div class="flex-1 flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 p-12">
          <div class="text-center space-y-4">
            <i class="fa-solid fa-circle-notch fa-spin text-3xl text-indigo-600 dark:text-indigo-400"></i>
            <p class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Đang tải chi tiết mẻ chạy...</p>
          </div>
        </div>
      } @else if (run() && draft() && config()) {
        <!-- Locking warning banner for View-Only Details -->
        @if (lockedByOthers()) {
          <div class="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300 shrink-0">
            <div class="flex items-start gap-3.5">
              <div class="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200/40 shrink-0">
                <i class="fa-solid fa-lock text-sm animate-pulse"></i>
              </div>
              <div>
                <h4 class="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-400">Mẻ Chạy Đang Được Chỉnh Sửa</h4>
                <p class="text-[11px] text-amber-700 dark:text-amber-300 font-semibold mt-0.5">
                  KTV <strong>{{ run()?.lockedByName }}</strong> đang chỉnh sửa mẻ này từ lúc <strong>{{ convertToDate(run()?.lockedAt) | date: 'HH:mm dd/MM/yyyy' }}</strong>. Số liệu hiển thị có thể thay đổi liên tục.
                </p>
              </div>
            </div>
            @if (canEditResults()) {
              <button (click)="takeOverLock()"
                      class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-xl transition flex items-center gap-2 shrink-0 active:scale-95 shadow-md shadow-amber-500/10 cursor-pointer">
                <i class="fa-solid fa-unlock-keyhole"></i>
                <span>Giành Quyền Chỉnh Sửa</span>
              </button>
            }
          </div>
        }

        <!-- MOBILE TAB SWITCHER (lg:hidden) -->
        <div class="lg:hidden flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shrink-0 mb-1">
          <button (click)="mobileActiveTab.set('grid')"
                  [class]="mobileActiveTab() === 'grid'
                    ? 'flex-1 min-h-[44px] py-2.5 text-xs font-black bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-xl shadow-xs border border-slate-200/40 dark:border-slate-700/40'
                    : 'flex-1 min-h-[44px] py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
                  class="transition-all duration-200 flex items-center justify-center gap-2">
            <i class="fa-solid fa-table-cells text-sm"></i>
            <span>Bảng Kết Quả</span>
          </button>
          <button (click)="mobileActiveTab.set('pdf')"
                  [class]="mobileActiveTab() === 'pdf'
                    ? 'flex-1 min-h-[44px] py-2.5 text-xs font-black bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-xl shadow-xs border border-slate-200/40 dark:border-slate-700/40'
                    : 'flex-1 min-h-[44px] py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
                  class="transition-all duration-200 flex items-center justify-center gap-2">
            <i class="fa-solid fa-file-pdf text-sm text-rose-500"></i>
            <span>Báo Cáo &amp; PDF</span>
          </button>
        </div>

        <div class="flex-1 min-h-0 flex flex-col lg:flex-row gap-5 lg:overflow-hidden lg:h-[calc(100vh-220px)] lg:min-h-[580px]">
          
          <!-- LEFT PANE: CHROMATOGRAPHY GRID (58%) -->
          <div [class.hidden]="mobileActiveTab() !== 'grid'" class="lg:!flex lg:flex-[58] flex flex-col min-h-0 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            
            <!-- Header of Grid -->
            <div class="px-3.5 sm:px-5 py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 shrink-0">
              <div class="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
                <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center m-0 shrink-0">
                  <i class="fa-solid fa-table-cells mr-2.5 text-indigo-500"></i> Bảng Kết Quả Chạy
                </h4>
                
                <!-- Prefix filter tabs -->
                @if (detectedPrefixes().length > 1) {
                  <div class="flex items-center bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg border border-slate-200/60 dark:border-slate-800/80 sm:ml-2 overflow-x-auto max-w-full sm:max-w-none custom-scrollbar shrink-0">
                    <button (click)="changeActiveFilter('ALL')"
                            [class]="activeFilter() === 'ALL'
                              ? 'px-2.5 sm:px-2 py-1.5 sm:py-1 text-[10px] sm:text-[9px] font-black bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded shadow-xs'
                              : 'px-2.5 sm:px-2 py-1.5 sm:py-1 text-[10px] sm:text-[9px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
                            class="min-h-[36px] sm:min-h-0 transition duration-150 shrink-0">
                      Tất Cả
                    </button>
                    @for (prefix of detectedPrefixes(); track prefix) {
                      <button (click)="changeActiveFilter(prefix)"
                              [class]="activeFilter() === prefix
                                ? 'px-2.5 sm:px-2 py-1.5 sm:py-1 text-[10px] sm:text-[9px] font-black bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded shadow-xs'
                                : 'px-2.5 sm:px-2 py-1.5 sm:py-1 text-[10px] sm:text-[9px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
                              class="min-h-[36px] sm:min-h-0 transition duration-150 shrink-0">
                        {{ prefix === '' ? 'Không' : prefix }}
                      </button>
                    }
                  </div>
                }
              </div>
              
              <!-- Sample tabs for 3b -->
              @if (config()?.formType === 'type3b') {
                <div class="flex items-center gap-1.5 overflow-x-auto max-w-full sm:max-w-[60%] custom-scrollbar pb-1 sm:pb-0">
                  @for (sample of run()?.sampleList; track sample; let idx = $index) {
                    <button (click)="activeSampleCode.set(sample)"
                            [class]="activeSampleCode() === sample
                              ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20 border-transparent'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'"
                            class="min-h-[40px] sm:min-h-0 px-3 sm:px-2.5 py-2 sm:py-1.5 rounded-lg text-xs sm:text-[11px] flex items-center gap-1.5 shrink-0 transition-all duration-200">
                      <span class="font-mono">{{ sample }}</span>
                    </button>
                  }
                </div>
              }
            </div>

            <!-- Grid Content -->
            <div class="flex-1 overflow-y-auto custom-scrollbar p-1">
              @if (config()?.formType === 'type3b') {
                <!-- TYPE 3B Grid -->
                <div class="overflow-x-auto custom-scrollbar">
                  <table class="w-full text-sm border-collapse text-left whitespace-nowrap min-w-[700px]">
                  <thead>
                    <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/60 sticky top-0 z-10 shadow-sm">
                      <th class="py-3 px-4 text-center font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-16">STT</th>
                      <th class="py-3 px-4 font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">Hoạt chất</th>
                      <th class="py-3 px-4 text-center font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-24">ND (N/A)</th>
                      <th class="py-3 px-4 text-center font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-36">Kết quả (µg/kg)</th>
                      <th class="py-3 px-4 text-center font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-36">Độ thu hồi R%</th>
                      <th class="py-3 px-4 text-center font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-36">Hệ số tuyến tính R2</th>
                      <th class="py-3 px-4 text-center font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-36">Kết luận</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                    @for (comp of assignedCompounds(); track comp; let idx = $index) {
                      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td class="py-3 px-4 text-center font-mono text-sm text-slate-400">
                          {{ idx + 1 }}
                        </td>
                        <td class="py-3 px-4 font-bold text-sm text-slate-700 dark:text-slate-200">
                          {{ getCompoundDisplayName(comp) }}
                        </td>
                        <td class="py-3 px-4 text-center">
                          <span [class.text-amber-500]="(draft()?.resultData?.[activeSampleCode()] || {})[comp + '_nd']" class="text-sm">
                            <i class="fa-regular" [class.fa-square-check]="(draft()?.resultData?.[activeSampleCode()] || {})[comp + '_nd']" [class.fa-square]="!(draft()?.resultData?.[activeSampleCode()] || {})[comp + '_nd']"></i>
                          </span>
                        </td>
                        <td class="py-3 px-4 text-center font-mono font-semibold text-sm text-slate-800 dark:text-slate-200">
                          {{ (draft()?.resultData?.[activeSampleCode()] || {})[comp] !== undefined && (draft()?.resultData?.[activeSampleCode()] || {})[comp] !== null ? ((draft()?.resultData?.[activeSampleCode()] || {})[comp] === 'N/A' ? '—' : (draft()?.resultData?.[activeSampleCode()] || {})[comp]) : '—' }}
                        </td>
                        <!-- QC statuses badges -->
                        @for (qcNum of ['1', '2', '3']; track qcNum) {
                          <td class="py-3 px-4 text-center">
                            @if ((draft()?.resultData?.[activeSampleCode()] || {})[comp + '_qc' + qcNum] === 'Đạt') {
                              <span class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">Đạt</span>
                            } @else if ((draft()?.resultData?.[activeSampleCode()] || {})[comp + '_qc' + qcNum] === 'Không đạt') {
                              <span class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-100/50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400">K.Đạt</span>
                            } @else {
                              <span class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 select-none">—</span>
                            }
                          </td>
                        }
                      </tr>
                    }
                    @if (unassignedCompounds().length > 0) {
                      <tr class="border-t-2 border-dashed border-slate-200 dark:border-slate-700">
                        <td [attr.colspan]="7" class="py-2.5 px-4 bg-slate-50/60 dark:bg-slate-900/40">
                          <button (click)="showAllTargets.set(!showAllTargets())"
                                  class="w-full flex items-center justify-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            <i class="fa-solid text-[9px] transition-transform duration-200"
                               [class.fa-chevron-down]="!showAllTargets()"
                               [class.fa-chevron-up]="showAllTargets()"></i>
                            <span>{{ showAllTargets() ? 'Ẩn bớt chỉ tiêu không chỉ định' : 'Hiện thêm ' + unassignedCompounds().length + ' chỉ tiêu không chỉ định' }}</span>
                            <span class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded text-[9px] font-mono">
                              {{ unassignedCompounds().length }}
                            </span>
                          </button>
                        </td>
                      </tr>
                    }
                    @if (showAllTargets()) {
                      @for (comp of unassignedCompounds(); track comp) {
                        <tr class="opacity-45 bg-slate-50/30 dark:bg-slate-900/30 hover:opacity-75 transition-opacity">
                          <td class="py-3 px-4 text-center font-mono text-sm text-slate-400">
                            <i class="fa-solid fa-lock text-[10px]"></i>
                          </td>
                          <td class="py-3 px-4 font-bold text-sm text-slate-700 dark:text-slate-200">
                            {{ getCompoundDisplayName(comp) }}
                          </td>
                          <td class="py-3 px-4 text-center"><span class="text-slate-300 dark:text-slate-600">—</span></td>
                          <td class="py-3 px-4 text-center font-mono font-semibold text-sm text-slate-800 dark:text-slate-200">
                            <span class="text-slate-300 dark:text-slate-600 font-normal select-none">—</span>
                          </td>
                          @for (qcNum of ['1', '2', '3']; track qcNum) {
                            <td class="py-3 px-4 text-center">
                              <span class="text-slate-300 dark:text-slate-600 select-none">—</span>
                            </td>
                          }
                        </tr>
                      }
                    }
                  </tbody>
                </table>
                </div>
              } @else {
                <!-- TYPE 2 / 3A Grid -->
                <div class="overflow-x-auto custom-scrollbar">
                  <table class="w-full text-sm border-collapse text-left whitespace-nowrap min-w-[850px]">
                  <thead>
                    <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/60 sticky top-0 z-10 shadow-sm">
                      <th class="py-3.5 px-3 sm:px-5 font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-20 md:w-24 md:min-w-[96px] md:max-w-[96px] md:sticky md:left-0 bg-slate-50 dark:bg-slate-800 md:z-30 border-r border-slate-200/60 dark:border-slate-700">Số lọ</th>
                      <th class="py-3.5 px-3 sm:px-5 font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider min-w-[115px] md:min-w-[160px] sticky left-0 md:left-24 bg-slate-50 dark:bg-slate-800 z-30 border-r border-slate-200/60 dark:border-slate-700 shadow-[4px_0_8px_-3px_rgba(0,0,0,0.08)] dark:shadow-[4px_0_8px_-3px_rgba(0,0,0,0.3)]">Mẫu thử</th>
                      
                      @if (hasColumn('khoiLuong')) {
                        <th class="py-3.5 px-5 text-center font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-28">Khối lượng</th>
                      }
                      @if (hasColumn('heSoPhaLoang')) {
                        <th class="py-3.5 px-5 text-center font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-28">HS Pha loãng</th>
                      }

                      @for (col of visibleColumns(); track col) {
                        <th class="py-3.5 px-5 text-center font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider min-w-[140px]">
                          {{ columnDisplayNames()[col] || col }}
                        </th>
                      }
                      @if (hiddenColumns().length > 0) {
                        <th class="py-3.5 px-3 text-center font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-24">
                          <button (click)="showAllTargets.set(!showAllTargets())"
                                  class="inline-flex items-center justify-center gap-1 text-[9px] font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition whitespace-nowrap">
                            <i class="fa-solid"
                               [class.fa-plus-circle]="!showAllTargets()"
                               [class.fa-minus-circle]="showAllTargets()"></i>
                            <span>{{ showAllTargets() ? 'Thu gọn' : '+' + hiddenColumns().length + ' cột' }}</span>
                          </button>
                        </th>
                      }
                      
                      <th class="py-3.5 px-5 font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider min-w-[180px]">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                    @for (row of getType2DisplayRows(); track row.key) {
                      <tr [ngClass]="{
                        'bg-indigo-50/40 dark:bg-indigo-900/15 font-semibold text-slate-900 dark:text-slate-100': row.isQC,
                        'bg-white dark:bg-slate-900': !row.isQC
                      }" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors bg-white dark:bg-slate-900">
                        
                        <td class="py-3 px-3 sm:px-5 font-mono text-sm text-slate-500 dark:text-slate-400 w-20 md:w-24 md:min-w-[96px] md:max-w-[96px] md:sticky md:left-0 bg-inherit md:z-10 border-r border-slate-100 dark:border-slate-800/80">
                          {{ getRowDataValue(row.key, 'loSo') || '—' }}
                        </td>
                        
                        <td class="py-3 px-3 sm:px-5 min-w-[115px] md:min-w-[160px] sticky left-0 md:left-24 bg-inherit z-10 border-r border-slate-100 dark:border-slate-800/80 shadow-[4px_0_8px_-3px_rgba(0,0,0,0.08)] dark:shadow-[4px_0_8px_-3px_rgba(0,0,0,0.3)]">
                          @if (row.isQC) {
                            <span class="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wide">
                              <i class="fa-solid fa-flask text-xs"></i> {{ row.label }}
                            </span>
                          } @else {
                            <span class="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200 select-all">{{ row.label }}</span>
                          }
                        </td>

                        @if (hasColumn('khoiLuong')) {
                          <td class="py-3 px-5 text-center font-mono text-sm text-slate-700 dark:text-slate-300">
                            {{ getRowDataValue(row.key, 'khoiLuong') !== '' ? getRowDataValue(row.key, 'khoiLuong') : '—' }}
                          </td>
                        }
                        @if (hasColumn('heSoPhaLoang')) {
                          <td class="py-3 px-5 text-center font-mono text-sm text-slate-700 dark:text-slate-300">
                            {{ getRowDataValue(row.key, 'heSoPhaLoang') !== '' ? getRowDataValue(row.key, 'heSoPhaLoang') : '—' }}
                          </td>
                        }

                        @for (col of visibleColumns(); track col) {
                          <td class="py-3 px-5 text-center font-mono font-semibold text-sm text-slate-700 dark:text-slate-200">
                            @if (isTargetAssigned(row.key, col)) {
                              {{ getRowDataValue(row.key, col) !== '' ? (getRowDataValue(row.key, col) === 'N/A' ? '—' : getRowDataValue(row.key, col)) : '—' }}
                            } @else {
                              <span class="text-slate-300 dark:text-slate-600 font-normal select-none">—</span>
                            }
                          </td>
                        }
                        @if (hiddenColumns().length > 0) {
                          <td class="py-3 px-3 text-center text-[10px] text-slate-300 dark:text-slate-600 select-none">
                            {{ showAllTargets() ? '' : '...' }}
                          </td>
                        }

                        <td class="py-3 px-5 text-slate-500 dark:text-slate-400 text-sm italic">
                          {{ getRowDataValue(row.key, 'ghiChu') }}
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
                </div>
              }
            </div>
          </div>

          <!-- RIGHT PANE: REPORTS & PDF PREVIEW (42%) -->
          <div [class.hidden]="mobileActiveTab() !== 'pdf'" class="lg:!flex lg:flex-[42] flex flex-col min-h-[360px] lg:min-h-[580px]">
            <app-result-pdf-report-pane
              class="flex-1 min-h-0 flex flex-col"
              [run]="run()"
              [draft]="draft()"
              [historyList]="historyList()"
              [activeFilter]="activeFilter()"
              [selectedReportId]="selectedPdfPrefix()"
              [canRestore]="false"
              [isReadOnly]="true"
              [initialTab]="'preview'"
              [showCloseButton]="false"
              (selectedReportIdChange)="selectedPdfPrefix.set($event)"
              (filterSyncRequested)="changeActiveFilter($event)"
              (openModalPreview)="openPdfFromPane($event)" />
          </div>
        </div>
      } @else if (run() && !draft()) {
        <!-- PENDING STATE: No results entered yet -->
        <div class="flex-1 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed p-12 animate-fade-in shadow-sm">
          <div class="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-full flex items-center justify-center text-indigo-500 text-3xl mb-5 shadow-inner">
            <i class="fa-solid fa-file-pen"></i>
          </div>
          <h4 class="text-xl font-black text-slate-800 dark:text-slate-100 mb-2 tracking-tight">Chưa Có Kết Quả Phân Tích</h4>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8 text-center max-w-md leading-relaxed font-medium">
            Mẻ chạy <span class="font-bold text-slate-700 dark:text-slate-300">[{{ run()?.inputs?.['batchCode'] || run()?.id || 'Chưa có mã mẻ' }}]</span> hiện chưa được nhập số liệu và đánh giá QC. Nhấn nút bên dưới để bắt đầu điền kết quả.
          </p>
          <div class="flex items-center gap-3">
            <button (click)="goBack()" class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-bold transition active:scale-95 shadow-sm">
              Quay Lại
            </button>
            @if (canEditResults()) {
              <button (click)="goToEditMode()" class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-black transition shadow-md shadow-indigo-500/20 active:scale-95 flex items-center gap-2">
                <i class="fa-solid fa-play text-xs"></i>
                Mở Màn Hình Nhập Kết Quả
              </button>
            }
          </div>
        </div>
      } @else {
        <!-- ERROR STATE: Batch not found -->
        <div class="flex-1 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed p-12">
          <div class="w-16 h-16 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 rounded-full flex items-center justify-center text-red-500 text-2xl mb-4">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <h4 class="text-base font-extrabold text-slate-800 dark:text-slate-200 mb-1">Không Tìm Thấy Mẻ Phân Tích</h4>
          <p class="text-xs text-slate-400 dark:text-slate-500 mb-4 text-center max-w-sm">
            Không tìm thấy thông tin chi tiết hoặc cấu hình SOP tương ứng của mẻ chạy phân tích này.
          </p>
          <button (click)="goBack()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition">
            Quay Lại Danh Sách
          </button>
        </div>
      }

      <!-- QR Interactive Modal -->
      @if (isQrModalOpen()) {
        <app-modal-shell
          size="sm"
          title="Xác minh mẻ chạy"
          description="Sử dụng điện thoại để quét hoặc truy cập liên kết đối chiếu độc lập của hệ thống LIMS."
          [showFooter]="false"
          (closed)="isQrModalOpen.set(false)">
          <div modalBody class="flex flex-col items-center gap-5">
            <div class="bg-white p-4 rounded-2xl shadow-inner border border-slate-200/70 max-w-full flex items-center justify-center">
              <canvas #qrModalCanvas class="w-[240px] h-[240px] max-w-full aspect-square object-contain"></canvas>
            </div>

            <div class="flex flex-wrap items-center gap-2.5 w-full justify-center">
              <button type="button" (click)="viewTraceability()"
                      class="min-h-[44px] sm:min-h-0 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition flex items-center gap-2">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                <span>Mở trang</span>
              </button>
              <app-button variant="secondary" size="sm" (click)="copyTraceabilityLink()">
                <i class="fa-solid fa-copy"></i>
                <span>Sao chép liên kết</span>
              </app-button>
            </div>
          </div>
        </app-modal-shell>
      }
    </div>

  `,
  styles: []
})
export class BatchDetailViewComponent implements OnInit, OnDestroy {
  confirmation = inject(ConfirmationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private state = inject(StateService);
  private resultService = inject(ResultService);
  private printService = inject(PrintService);
  readonly worksheets = inject(BatchWorksheetService);
  printWorksheet(): void { const run = this.run(); if (run) void this.worksheets.open([worksheetReference(run)]); }
  private toast = inject(ToastService);
  private masterTargetService = inject(MasterTargetService);
  private auth = inject(AuthService);

  requestId = '';
  isLoading = signal(true);
  isFocusMode = this.state.focusMode;

  qrCanvas = viewChild<ElementRef<HTMLCanvasElement>>('qrCanvas');
  qrModalCanvas = viewChild<ElementRef<HTMLCanvasElement>>('qrModalCanvas');
  isQrModalOpen = signal(false);

  canEditResults = computed(() => canUserEditResults({
    isManager: this.auth.isManager(),
    canRunBatch: this.auth.canRunBatch(),
    canApprove: this.auth.canApprove(),
    permissions: this.auth.userPermissions()
  }));

  toggleFocusMode() {
    this.state.toggleFocusMode();
  }

  constructor() {
    effect(() => {
      const canvas = this.qrCanvas();
      if (canvas) {
        void this.generateQrCode();
      }
    });

    effect(() => {
      this.activeSampleCode();
      this.activeFilter();
      untracked(() => this.showAllTargets.set(false));
    });
  }

  // App models signals
  run = signal<any | null>(null);
  draft = signal<AnalysisResultDraft | null>(null);
  config = signal<any | null>(null);
  configKey = signal<string | null>(null);
  historyList = signal<any[]>([]);

  // Master analyte DB signals
  masterTargets = signal<any[]>([]);
  columnDisplayNames = signal<Record<string, string>>({});

  // Active filters and tabs
  activeFilter = signal<string>('ALL');
  activeSampleCode = signal<string>('');
  selectedPdfPrefix = signal<string>('');
  activeViewTab = signal<'grid' | 'qr'>('grid');
  mobileActiveTab = signal<'grid' | 'pdf'>('grid');
  showAllTargets = signal(false);

  private unsubscribeFromDraft?: () => void;

  // Detected prefixes list
  detectedPrefixes = computed(() => {
    const r = this.run();
    if (!r) return [];
    const prefixes = new Set<string>();
    
    (r.sampleList || []).forEach((sample: string) => {
      const startsWithLetter = /^[a-zA-Z]/.test(sample);
      const prefix = startsWithLetter ? sample.charAt(0).toUpperCase() : '';
      prefixes.add(prefix);
    });
    
    return Array.from(prefixes).sort();
  });

  lockedByOthers = computed(() => isRunActivelyLockedByOthers(this.run(), this.auth.currentUser()?.email));

  // Extract compounds columns
  activeColumns = computed<string[]>(() => {
    const conf = this.config();
    if (!conf || !conf.columns) return [];
    return Object.keys(conf.columns).filter(
      (c: string) => c !== 'loSo' && c !== 'maSoMau' && c !== 'ghiChu' && c !== 'khoiLuong' && c !== 'heSoPhaLoang'
    );
  });

  assignedCompounds = computed<string[]>(() => {
    const conf = this.config();
    if (!conf?.compounds || conf.formType !== 'type3b') return [];
    return conf.compounds.filter((comp: string) => this.isTargetAssigned(this.activeSampleCode(), comp));
  });

  unassignedCompounds = computed<string[]>(() => {
    const conf = this.config();
    if (!conf?.compounds || conf.formType !== 'type3b') return [];
    return conf.compounds.filter((comp: string) => !this.isTargetAssigned(this.activeSampleCode(), comp));
  });

  assignedColumns = computed<string[]>(() => {
    const cols = this.activeColumns();
    if (!cols.length) return [];

    const realSamples = this.getType2DisplayRows().filter(row => !row.isQC);
    if (realSamples.length === 0) return cols;

    return cols.filter(col => realSamples.some(row => this.isTargetAssigned(row.key, col)));
  });

  hiddenColumns = computed<string[]>(() => {
    const assigned = new Set(this.assignedColumns());
    return this.activeColumns().filter(col => !assigned.has(col));
  });

  visibleColumns = computed<string[]>(() => {
    return this.showAllTargets() ? this.activeColumns() : this.assignedColumns();
  });

  // Dynamic checkbox checklist
  checkboxList = computed<{ key: string; label: string }[]>(() => {
    const conf = this.config();
    if (!conf || !conf.checkboxLines) return [];
    return Object.entries(conf.checkboxLines).map(([label, key]) => ({
      key: key as string,
      label
    }));
  });

  async ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.requestId) {
      this.toast.show('Không tìm thấy mã mẻ chạy!', 'error');
      this.router.navigate(['/results-view']);
      return;
    }

    const initialPrefix = this.route.snapshot.queryParamMap.get('prefix');
    if (initialPrefix !== null) {
      this.activeFilter.set(initialPrefix);
    }
    const initialSample = this.route.snapshot.queryParamMap.get('sample');
    if (initialSample) {
      this.activeSampleCode.set(initialSample);
    }

    // Load master Targets/Analytes
    try {
      const analytes = await this.masterTargetService.getAll();
      this.masterTargets.set(analytes);
    } catch (e) {
      console.warn('Failed to load master analytes in Viewer', e);
    }

    void this.loadHistory();
    this.isLoading.set(true);

    // Subscribe to Firebase real-time updates
    this.unsubscribeFromDraft = this.resultService.subscribeToDraft(
      this.requestId,
      async (draftDoc: any, runDoc: any) => {
        if (runDoc) {
          this.run.set(runDoc);

          // Auto-select sample for 3B accordion (preserve requested sample if present)
          if (runDoc.sampleList && runDoc.sampleList.length > 0) {
            const current = this.activeSampleCode();
            if (!current || !runDoc.sampleList.includes(current)) {
              this.activeSampleCode.set(runDoc.sampleList[0]);
            }
          }

          const sopObj = this.state.sops().find((s: any) => s.id === runDoc.sopId) || null;
          const resolvedKey = resolveConfigKey(runDoc.sopId, runDoc.sopName || '', sopObj);
          const sopConf = resolvedKey ? ANGULAR_SOP_CONFIG[resolvedKey] : null;

          if (sopConf && resolvedKey) {
            this.config.set({ ...sopConf, id: resolvedKey });
            this.configKey.set(resolvedKey);
            this.draft.set(draftDoc);

            // Build custom columns labels map
            this.buildColumnDisplayNames();
          }
        }
        this.isLoading.set(false);
      }
    );
  }

  async loadHistory() {
    try {
      const hist = await this.resultService.getHistory(this.requestId);
      this.historyList.set(hist);
    } catch (e) {
      console.warn('Failed to load batch report history', e);
    }
  }

  ngOnDestroy() {
    this.state.focusMode.set(false);
    if (this.unsubscribeFromDraft) {
      this.unsubscribeFromDraft();
    }
  }

  buildColumnDisplayNames() {
    const conf = this.config();
    if (!conf || !conf.columns) return;
    const map: Record<string, string> = {};
    
    // Filter active column names
    const cols = Object.keys(conf.columns).filter(
      (c: string) => c !== 'loSo' && c !== 'maSoMau' && c !== 'ghiChu' && c !== 'khoiLuong' && c !== 'heSoPhaLoang'
    );

    cols.forEach(col => {
      // Custom labels based on config mapping
      if (col === 'kqTrifluralin') map[col] = 'Trifluralin';
      else if (col === 'kqFip') map[col] = 'Fipronil';
      else if (col === 'kqFipDesl') map[col] = 'Fipronil-desulfinyl';
      else if (col === 'kqFipSulf') map[col] = 'Fipronil sulfide';
      else if (col === 'kqFipSulf2') map[col] = 'Fipronil sulfone';
      else if (col === 'kqClp') map[col] = 'Chlorpyrifos';
      else if (col === 'kqClpMe') map[col] = 'Chlorpyrifos methyl';
      else if (col === 'kqClpMeDes') map[col] = 'Chlorpyriphos-methyl-desmethyl';
      else if (col === 'kqDichlorvos') map[col] = 'Dichlorvos';
      else {
        // Fallback display format clean
        let name = col.replace(/^kq/, '');
        name = name.replace(/([A-Z])/g, ' $1').trim();
        map[col] = name.charAt(0).toUpperCase() + name.slice(1);
      }

      // Translate display name through master Analytes DB
      map[col] = resolveCompoundDisplayName(map[col], this.masterTargets(), this.configKey() || this.run()?.sopId) + ' (µg/kg)';
    });

    this.columnDisplayNames.set(map);
  }

  private _displayNameCache = new Map<string, string>();

  getCompoundDisplayName(compound: string): string {
    if (this._displayNameCache.has(compound)) {
      return this._displayNameCache.get(compound)!;
    }
    const name = resolveCompoundDisplayName(compound, this.masterTargets(), this.configKey() || this.run()?.sopId);
    this._displayNameCache.set(compound, name);
    return name;
  }

  private _assignedCache = new Map<string, boolean>();
  private _lastTargetMapRef: any = null;

  isTargetAssigned(sampleCode: string, compound: string): boolean {
    if (!this.run()) return true;
    const targetMap = this.run().sampleTargetMap || (this.run().inputs && this.run().inputs.sampleTargetMap);
    if (!targetMap) return true;

    if (this._lastTargetMapRef !== targetMap) {
      this._assignedCache.clear();
      this._lastTargetMapRef = targetMap;
    }

    const cacheKey = `${sampleCode}_${compound}`;
    if (this._assignedCache.has(cacheKey)) {
      return this._assignedCache.get(cacheKey)!;
    }

    const assigned = targetMap[sampleCode];
    if (!assigned || assigned.length === 0) {
      this._assignedCache.set(cacheKey, true);
      return true;
    }
    
    const result = isCompoundAssigned(assigned, compound, this.masterTargets());
    this._assignedCache.set(cacheKey, result);
    return result;
  }

  getRowDataValue(rowKey: string, field: string): string {
    const d = this.draft();
    if (!d || !d.resultData) return '';
    const resObj = d.resultData[rowKey];
    if (resObj && resObj[field] !== undefined && resObj[field] !== null && resObj[field] !== '') {
      return String(resObj[field]);
    }
    // Fallback logic for prefix-specific final keys (e.g. QC_FINAL_QC_A) to main final key
    if (rowKey.startsWith('QC_FINAL_QC_')) {
      const mainFinal = d.resultData['QC_FINAL_QC_'];
      if (mainFinal && mainFinal[field] !== undefined && mainFinal[field] !== null && mainFinal[field] !== '') {
        return String(mainFinal[field]);
      }
    }
    return '';
  }

  hasColumn(colKey: string): boolean {
    const conf = this.config();
    return !!(conf && conf.columns && conf.columns[colKey] !== undefined);
  }

  hasCalibPoints(): boolean {
    const d = this.draft();
    return !!(d && d.page1Data && d.page1Data['calibPoints'] && d.page1Data['calibPoints'].length > 0);
  }

  isQcField(key: string): boolean {
    return key.startsWith('qc');
  }

  changeActiveFilter(prefix: string) {
    this.activeFilter.set(prefix);
    this.showAllTargets.set(false);
  }

  getType2DisplayRows(): any[] {
    const d = this.draft();
    const r = this.run();
    const conf = this.config();
    if (!d || !r || !conf) return [];

    const activeFilter = this.activeFilter();
    const isTrifluralin = conf.id === 'trifluralin-gcms';
    const isFipronil = conf.id === 'fipronil-chlorpyrifos';
    const isDichlorvos = conf.id === 'dichlorvos-gcms';
    const isChloroform = conf.id === 'chloroform-gcms';

    const list: any[] = [];

    if (isFipronil) {
      // BLANK (vial 1.7)
      const blankName = d.page1Data?.['blankName'] || 'BLANK';
      list.push({ key: 'QC_BLANK', label: blankName, isQC: true });

      // SPIKE (vial 1.8)
      const spikeName = d.page1Data?.['spikeName'] || 'SPIKE';
      list.push({ key: 'QC_SPIKE', label: spikeName, isQC: true });

      // CHECK_SAMPLE (vial 1.9, optional)
      if (d.page1Data?.['hasCheckSample']) {
        const checkSampleName = d.page1Data?.['checkSampleName'] || 'CHECK_SAMPLE';
        list.push({ key: 'QC_CHECK_SAMPLE', label: checkSampleName, isQC: true });
      }

      // Regular samples & dynamic SP_N every 10 samples
      const sampleList = r.sampleList || [];
      let regularCount = 0;
      sampleList.forEach((sampleCode: string) => {
        list.push({ key: sampleCode, label: sampleCode, isQC: false });

        regularCount++;
        if (regularCount % 10 === 0) {
          const isLastSample = regularCount === sampleList.length;
          if (!isLastSample) {
            const n = regularCount / 10;
            list.push({
              key: `QC_SPIKE_${n}`,
              label: `SP_${n}`,
              isQC: true
            });
          }
        }
      });

      // FINAL (vial 1.8)
      list.push({ key: 'QC_FINAL', label: 'FINAL', isQC: true });
    } 
    else if (isDichlorvos) {
      // Blank
      const blankName = d.page1Data?.['blankName'] || 'Blank';
      list.push({ key: 'QC_BLANK', label: blankName, isQC: true });

      // Spike
      const spikeName = d.page1Data?.['spikeName'] || 'Spike';
      list.push({ key: 'QC_SPIKE', label: spikeName, isQC: true });

      // Regular samples (filtered by activeFilter)
      const sampleList = r.sampleList || [];
      const filteredSamples = sampleList.filter((s: string) => {
        const startsWithLetter = /^[a-zA-Z]/.test(s);
        const prefix = startsWithLetter ? s.charAt(0).toUpperCase() : '';
        return activeFilter === 'ALL' || prefix === activeFilter;
      });

      filteredSamples.forEach((sampleCode: string) => {
        list.push({ key: sampleCode, label: sampleCode, isQC: false });
      });

      // FINAL (optional)
      if (d.page1Data?.['hasFinal']) {
        list.push({ key: 'QC_FINAL', label: 'FINAL', isQC: true });
      }
    }
    else if (isChloroform) {
      // Blank
      const blankName = d.page1Data?.['blankName'] || 'Blank';
      list.push({ key: 'QC_BLANK', label: blankName, isQC: true });

      // Spike
      const spikeName = d.page1Data?.['spikeName'] || 'Spike';
      list.push({ key: 'QC_SPIKE', label: spikeName, isQC: true });

      // Regular samples (filtered by activeFilter)
      const sampleList = r.sampleList || [];
      const filteredSamples = sampleList.filter((s: string) => {
        const startsWithLetter = /^[a-zA-Z]/.test(s);
        const prefix = startsWithLetter ? s.charAt(0).toUpperCase() : '';
        return activeFilter === 'ALL' || prefix === activeFilter;
      });

      filteredSamples.forEach((sampleCode: string) => {
        list.push({ key: sampleCode, label: sampleCode, isQC: false });
      });

      // FINAL (optional)
      if (d.page1Data?.['hasFinal']) {
        list.push({ key: 'QC_FINAL', label: 'FINAL', isQC: true });
      }
    }
    else if (isTrifluralin) {
      const blankName = d.page1Data?.['blankName'] || 'Blank';
      const spikeName = d.page1Data?.['spikeName'] || 'Spike';

      const prefixes = activeFilter === 'ALL' ? (this.detectedPrefixes() || ['']) : [activeFilter];

      prefixes.forEach((prefix) => {
        const prefixSamples = (r.sampleList || []).filter((s: string) => {
          const startsWithLetter = /^[a-zA-Z]/.test(s);
          const p = startsWithLetter ? s.charAt(0).toUpperCase() : '';
          return p === prefix;
        });

        if (prefixSamples.length === 0) return;

        const labelPrefix = prefix ? ` (Tiền tố ${prefix})` : '';

        list.push({
          key: 'QC_BLANK',
          label: `${blankName}${labelPrefix}`,
          isQC: true
        });
        list.push({
          key: 'QC_SPIKE',
          label: `${spikeName}${labelPrefix}`,
          isQC: true
        });

        let selectedCount = 0;
        prefixSamples.forEach((sampleCode: string) => {
          const resObj = d.resultData[sampleCode] || {};
          const isSelected = resObj['selected'] !== false;

          list.push({
            key: sampleCode,
            label: sampleCode,
            isQC: false
          });

          if (isSelected) {
            selectedCount++;
            if (selectedCount % 10 === 0) {
              const totalSelected = prefixSamples.filter((s: string) => d.resultData[s]?.['selected'] !== false).length;
              const isLastSelected = selectedCount === totalSelected;
              if (!isLastSelected) {
                const n = selectedCount / 10;
                list.push({
                  key: `QC_SPIKE_${n}_QC_${prefix}`,
                  label: `SPIKE_${n}${labelPrefix}`,
                  isQC: true
                });
              }
            }
          }
        });

        if (selectedCount > 0) {
          const finalKey = `QC_FINAL_QC_${prefix}`;
          list.push({
            key: finalKey,
            label: `FINAL${labelPrefix}`,
            isQC: true
          });
        }
      });
    }
    else {
      // General fallback for default Type 2 SOPs: list all regular samples
      const sampleList = r.sampleList || [];
      const filteredSamples = sampleList.filter((s: string) => {
        const startsWithLetter = /^[a-zA-Z]/.test(s);
        const prefix = startsWithLetter ? s.charAt(0).toUpperCase() : '';
        return activeFilter === 'ALL' || prefix === activeFilter;
      });
      filteredSamples.forEach((sampleCode: string) => {
        list.push({ key: sampleCode, label: sampleCode, isQC: false });
      });
    }

    return list;
  }

  openPdfFromPane(ev: PdfPaneModalEvent) {
    const activeFilter = ev.prefix === 'ALL' || ev.prefix === undefined
      ? this.activeFilter()
      : (ev.prefix === '_NO_PREFIX_' ? '' : ev.prefix);
    const filterName = activeFilter === 'ALL' ? 'Tất cả mẫu' : (activeFilter === '' ? 'Không tiền tố' : `Nhóm ${activeFilter}`);
    const previewUrl = this.getGoogleDrivePreviewUrl(ev.pdfUrl);
    const docPreviewUrl = ev.docsUrl ? this.getGoogleDrivePreviewUrl(ev.docsUrl) : undefined;

    this.printService.openPdfPreview(
      previewUrl,
      `Báo cáo kết quả — ${this.run()?.sopName || ''} (${filterName})`,
      ev.version ?? this.draft()?.version ?? 1,
      ev.publishedBy ?? this.draft()?.updatedBy ?? 'Chưa rõ',
      ev.publishedAt ?? this.draft()?.updatedAt,
      'iframe',
      docPreviewUrl
    );
  }

  getStatusText(): string {
    const status = this.draft()?.status || 'pending';
    if (status === 'completed') return 'Đã duyệt';
    if (status === 'draft') return 'Đang nháp';
    return 'Chờ nhập';
  }

  getStatusClass(): string {
    const status = this.draft()?.status || 'pending';
    if (status === 'completed') {
      return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/40 dark:border-emerald-900/30';
    }
    if (status === 'draft') {
      return 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-900/40';
    }
    return 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200/40 dark:border-amber-900/30';
  }

  convertToDate(timestamp: any): Date | null {
    return timestampToDate(timestamp);
  }

  async takeOverLock() {
    if (!this.canEditResults()) return;
    const user = this.auth.currentUser();
    const run = this.run();
    if (!user || !run) return;
    
    const confirmed = await this.confirmation.confirm({
      message: `Bạn có chắc chắn muốn giành quyền chỉnh sửa mẻ này?\nThao tác này sẽ chuyển sang màn hình Nhập kết quả. Thao tác này sẽ chuyển màn hình của ${run.lockedByName || 'người khác'} về chế độ Chỉ xem.`,
      confirmText: 'Giành quyền chỉnh sửa',
      isDangerous: true
    });
    if (confirmed) {
      this.isLoading.set(true);
      try {
        const result = await this.resultService.acquireLock(
          this.requestId,
          user.email,
          user.displayName,
          { mode: 'takeover', expectedLockerEmail: run.lockedBy }
        );
        if (result.acquired) {
          this.toast.show('Bạn đã giành quyền chỉnh sửa mẻ này thành công!', 'success');
          this.goToEditMode();
        } else if (result.reason === 'completed') {
          this.toast.show('Mẻ đã hoàn thành, hãy mở khóa chỉnh sửa khi vào biểu mẫu.', 'warning');
        } else if (result.reason === 'conflict' || result.reason === 'locked_by_others') {
          this.toast.show(
            `Trạng thái khóa đã thay đổi (${result.lockedByName || 'người dùng khác'}). Vui lòng thử lại.`,
            'warning'
          );
        } else {
          this.toast.show('Không thể giành quyền chỉnh sửa mẻ này. Vui lòng thử lại.', 'error');
        }
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  goToEditMode() {
    if (!this.canEditResults()) return;
    const queryParams: Record<string, string> = { edit: '1' };
    if (this.activeFilter() !== 'ALL') {
      queryParams['prefix'] = this.activeFilter();
    }
    if (this.activeSampleCode()) {
      queryParams['sample'] = this.activeSampleCode();
    }
    this.router.navigate(['/results', this.requestId], { queryParams });
  }

  goBack() {
    this.router.navigate(['/results']);
  }

  viewTraceability() {
    this.router.navigate(['/traceability', this.requestId]);
  }

  copyTraceabilityLink() {
    const baseUrl = window.location.origin + window.location.pathname + '#/traceability/';
    const link = baseUrl + this.requestId;
    navigator.clipboard.writeText(link).then(() => {
      this.toast.show('Đã sao chép liên kết truy xuất nguồn gốc!', 'success');
    }).catch(err => {
      this.toast.show('Không thể sao chép liên kết: ' + err, 'error');
    });
  }

  async generateQrCode() {
    if (!this.qrCanvas()) return;
    let QRious: any;
    try {
      QRious = await ensureQrious();
    } catch (e) {
      console.warn('QR library load error:', e);
      return;
    }
    if (!QRious || !this.qrCanvas()) return;
    const baseUrl = window.location.origin + window.location.pathname + '#/traceability/';
    new QRious({
      element: this.qrCanvas()!.nativeElement,
      value: baseUrl + this.requestId,
      size: 160,
      level: 'M'
    });
  }

  openQrModal() {
    this.isQrModalOpen.set(true);
    setTimeout(async () => {
      let QRious: any;
      try {
        QRious = await ensureQrious();
      } catch (e) {
        console.warn('QR library load error:', e);
        return;
      }
      if (QRious && this.qrModalCanvas()) {
        const baseUrl = window.location.origin + window.location.pathname + '#/traceability/';
        new QRious({
          element: this.qrModalCanvas()!.nativeElement,
          value: baseUrl + this.requestId,
          size: 240,
          level: 'M'
        });
      }
    }, 50);
  }

  private getGoogleDrivePreviewUrl(url: string | null | undefined): string {
    return getSafeGooglePreviewUrl(url);
  }
}
