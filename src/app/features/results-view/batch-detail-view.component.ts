import { Component, inject, signal, computed, OnInit, OnDestroy, ElementRef, viewChild, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { StateService } from '../../core/services/state.service';
import { AuthService } from '../../core/services/auth.service';
import { ResultService } from '../results/services/result.service';
import { PrintService } from '../../core/services/print.service';
import { ToastService } from '../../core/services/toast.service';
import { GoogleDriveService } from '../../core/services/google-drive.service';
import { AnalysisResultDraft } from '../../core/models/analysis-result.model';
import { resolveConfigKey, ANGULAR_SOP_CONFIG } from '../results/config/sop-configs';
import { getSafeGoogleUrl, formatSampleList } from '../../shared/utils/utils';
import { ensureQrious } from '../../shared/utils/external-script-loader';
import { resolveCompoundDisplayName, isCompoundAssigned } from '../results/shared/compound-id-resolver';
import { MasterTargetService } from '../targets/master-target.service';
import { timestampToDate } from '../../shared/utils/timestamp';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { AppPageHeaderComponent } from '../../shared/components/ui/page-header/page-header.component';

@Component({
  selector: 'app-batch-detail-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AppPageHeaderComponent],
  template: `
    <div class="h-full flex flex-col animate-fade-in bg-slate-50/60 dark:bg-slate-900 p-4 lg:p-6 space-y-4 lg:space-y-5">
      
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
          class="group flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 shadow-soft-sm transition hover:bg-slate-50 hover:text-fuchsia-600 active:scale-95 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-fuchsia-400">
          <i class="fa-solid fa-arrow-left text-xs transition-transform group-hover:-translate-x-0.5" aria-hidden="true"></i>
        </button>

        @if (run() && draft() && config()) {
          <div pageHeaderActions class="flex items-center gap-2">
            <button
              type="button"
              (click)="openQrModal()"
              class="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3 text-xs font-bold text-slate-700 shadow-soft-sm transition hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
              <i class="fa-solid fa-qrcode text-fuchsia-500" aria-hidden="true"></i>
              <span>Mã QR</span>
            </button>

            <button
              type="button"
              (click)="goToEditMode()"
              [class]="lockedByOthers()
                ? 'inline-flex h-9 items-center gap-2 rounded-xl bg-amber-600 px-4 text-xs font-bold text-white shadow-soft-md transition hover:bg-amber-700 active:scale-95'
                : 'inline-flex h-9 items-center gap-2 rounded-xl bg-gradient-soft px-4 text-xs font-bold text-white shadow-soft-md transition active:scale-95'"
              [title]="lockedByOthers() ? 'Mẻ này đang bị sửa bởi ' + run()?.lockedByName + '. Nhấp để xem chi tiết hoặc Giành quyền.' : 'Nhấp để chỉnh sửa số liệu'">
              <i class="fa-solid" [class.fa-lock]="lockedByOthers()" [class.fa-pen-to-square]="!lockedByOthers()" aria-hidden="true"></i>
              <span>{{ lockedByOthers() ? 'Mẻ đang khóa' : 'Chỉnh sửa số liệu' }}</span>
            </button>
          </div>
        }

        @if (run() && draft() && config()) {
          <div pageHeaderMeta class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <span [class]="getStatusClass()" class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide shadow-xs">
              <span class="h-1.5 w-1.5 rounded-full" [ngClass]="{
                'bg-emerald-500': draft()?.status === 'completed',
                'bg-fuchsia-500': draft()?.status === 'draft',
                'bg-amber-500': $any(draft()?.status) === 'pending' || !draft()?.status
              }"></span>
              {{ getStatusText() }}
            </span>
            <div class="flex items-center gap-1.5">
              <i class="fa-solid fa-barcode text-slate-400 dark:text-slate-600 text-[11px]"></i>
              <span>Mã mẻ:</span>
              <span class="font-mono font-bold text-slate-700 dark:text-slate-300 select-all">{{ run()?.inputs?.['batchCode'] || run()?.id }}</span>
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
              <a [routerLink]="['/results-view', run().parentMasterId]" class="inline-flex items-center gap-1 rounded-full bg-fuchsia-50 px-2.5 py-1 text-[9px] font-extrabold uppercase text-fuchsia-600 shadow-xs transition hover:bg-fuchsia-100 dark:bg-fuchsia-950/30 dark:text-fuchsia-400 dark:hover:bg-fuchsia-900/30" title="Mẻ chạy này đã được gộp số liệu. Nhấn để đi tới mẻ tổng hợp.">
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
            <i class="fa-solid fa-circle-notch fa-spin text-3xl text-fuchsia-600 dark:text-fuchsia-400"></i>
            <p class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Đang tải chi tiết mẻ chạy...</p>
          </div>
        </div>
      } @else if (run() && draft() && config()) {
        <!-- Locking warning banner for View-Only Details -->
        @if (lockedByOthers()) {
          <div class="bg-amber-50/50 dark:bg-amber-955/20 border border-amber-200/40 dark:border-amber-900/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300 shrink-0">
            <div class="flex items-start gap-3.5">
              <div class="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200/20 shrink-0">
                <i class="fa-solid fa-lock text-sm animate-pulse"></i>
              </div>
              <div>
                <h4 class="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-400">Mẻ Chạy Đang Được Chỉnh Sửa</h4>
                <p class="text-[11px] text-amber-650 dark:text-amber-300 font-semibold mt-0.5">
                  KTV <strong>{{ run()?.lockedByName }}</strong> đang chỉnh sửa mẻ này từ lúc <strong>{{ convertToDate(run()?.lockedAt) | date: 'HH:mm dd/MM/yyyy' }}</strong>. Số liệu hiển thị có thể thay đổi liên tục.
                </p>
              </div>
            </div>
            <button (click)="takeOverLock()"
                    class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-xl transition flex items-center gap-2 shrink-0 active:scale-95 shadow-md shadow-amber-500/10 cursor-pointer">
              <i class="fa-solid fa-unlock-keyhole"></i>
              <span>Giành Quyền Chỉnh Sửa</span>
            </button>
          </div>
        }

        <!-- MOBILE TAB SWITCHER (lg:hidden) -->
        <div class="lg:hidden flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shrink-0 mb-1">
          <button (click)="mobileActiveTab.set('grid')"
                  [class]="mobileActiveTab() === 'grid'
                    ? 'flex-1 py-2.5 text-xs font-black bg-white dark:bg-slate-800 text-fuchsia-650 dark:text-fuchsia-400 rounded-xl shadow-xs border border-slate-200/20 dark:border-slate-700/30'
                    : 'flex-1 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
                  class="transition-all duration-200 flex items-center justify-center gap-2">
            <i class="fa-solid fa-table-cells text-sm"></i>
            <span>Bảng Kết Quả</span>
          </button>
          <button (click)="mobileActiveTab.set('pdf')"
                  [class]="mobileActiveTab() === 'pdf'
                    ? 'flex-1 py-2.5 text-xs font-black bg-white dark:bg-slate-800 text-fuchsia-650 dark:text-fuchsia-400 rounded-xl shadow-xs border border-slate-200/20 dark:border-slate-700/30'
                    : 'flex-1 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
                  class="transition-all duration-200 flex items-center justify-center gap-2">
            <i class="fa-solid fa-file-pdf text-sm text-red-500"></i>
            <span>Xem Trước PDF</span>
          </button>
        </div>

        <div class="flex-1 min-h-0 flex flex-col lg:flex-row gap-5 overflow-hidden lg:h-[calc(100vh-220px)] lg:min-h-[600px]">
          
          <!-- LEFT PANE: CHROMATOGRAPHY GRID (approx 55-60%) -->
          <div [class.hidden]="mobileActiveTab() !== 'grid'" class="lg:!flex lg:flex-[6] flex flex-col min-h-0 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            
            <!-- Header of Grid -->
            <div class="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 shrink-0">
              <div class="flex items-center gap-3 min-w-0">
                <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center m-0 shrink-0">
                  <i class="fa-solid fa-table-cells mr-2.5 text-fuchsia-500"></i> Bảng Kết Quả Chạy
                </h4>
                
                <!-- Prefix filter tabs -->
                @if (detectedPrefixes().length > 1) {
                  <div class="flex items-center bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg border border-slate-200/60 dark:border-slate-800/80 ml-2 overflow-x-auto max-w-[200px] sm:max-w-none custom-scrollbar shrink-0">
                    <button (click)="changeActiveFilter('ALL')"
                            [class]="activeFilter() === 'ALL'
                              ? 'px-2 py-1 text-[9px] font-black bg-white dark:bg-slate-800 text-fuchsia-650 dark:text-fuchsia-400 rounded shadow-xs'
                              : 'px-2 py-1 text-[9px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
                            class="transition duration-150 shrink-0">
                      Tất Cả
                    </button>
                    @for (prefix of detectedPrefixes(); track prefix) {
                      <button (click)="changeActiveFilter(prefix)"
                              [class]="activeFilter() === prefix
                                ? 'px-2 py-1 text-[9px] font-black bg-white dark:bg-slate-800 text-fuchsia-650 dark:text-fuchsia-400 rounded shadow-xs'
                                : 'px-2 py-1 text-[9px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
                              class="transition duration-150 shrink-0">
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
                              ? 'bg-fuchsia-600 text-white font-bold shadow-md shadow-fuchsia-500/20 border-transparent'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'"
                            class="px-2.5 py-1.5 rounded-lg text-[11px] flex items-center gap-1.5 shrink-0 transition-all duration-200">
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
                                  class="w-full flex items-center justify-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors">
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
                      <th class="py-3.5 px-5 font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-24 min-w-[96px] max-w-[96px] sticky left-0 bg-slate-50 dark:bg-slate-800 z-30 border-r border-slate-200/60 dark:border-slate-700">Vial No.</th>
                      <th class="py-3.5 px-5 font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider min-w-[160px] sticky left-24 bg-slate-50 dark:bg-slate-800 z-30 border-r border-slate-200/60 dark:border-slate-700 shadow-[4px_0_8px_-3px_rgba(0,0,0,0.08)] dark:shadow-[4px_0_8px_-3px_rgba(0,0,0,0.3)]">Mẫu thử</th>
                      
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
                                  class="inline-flex items-center justify-center gap-1 text-[9px] font-bold text-slate-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition whitespace-nowrap">
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
                        'bg-fuchsia-50/30 dark:bg-fuchsia-900/10 font-semibold text-slate-900 dark:text-slate-100': row.isQC,
                        'bg-white dark:bg-slate-900': !row.isQC
                      }" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors bg-white dark:bg-slate-900">
                        
                        <td class="py-3 px-5 font-mono text-sm text-slate-500 dark:text-slate-400 w-24 min-w-[96px] max-w-[96px] sticky left-0 bg-inherit z-10 border-r border-slate-100 dark:border-slate-800/80">
                          {{ getRowDataValue(row.key, 'loSo') || '—' }}
                        </td>
                        
                        <td class="py-3 px-5 sticky left-24 bg-inherit z-10 border-r border-slate-100 dark:border-slate-800/80 shadow-[4px_0_8px_-3px_rgba(0,0,0,0.08)] dark:shadow-[4px_0_8px_-3px_rgba(0,0,0,0.3)]">
                          @if (row.isQC) {
                            <span class="inline-flex items-center gap-2 text-sm text-fuchsia-600 dark:text-fuchsia-400 font-bold uppercase tracking-wide">
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

          <!-- RIGHT PANE: PDF PREVIEW (approx 40-45%) -->
          <div [class.hidden]="mobileActiveTab() !== 'pdf'" class="lg:!flex lg:flex-[4] flex flex-col min-h-[300px] lg:min-h-[600px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden relative">
            
            <div class="px-5 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 shrink-0 relative z-10">
              <div class="flex items-center gap-3">
                <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center m-0">
                  <i class="fa-solid fa-file-pdf mr-2.5 text-red-500"></i> PDF PREVIEW
                </h4>
                
                @if (availableReports().length > 1) {
                  <select [ngModel]="selectedPdfPrefix()" 
                          (ngModelChange)="selectReport($event)"
                          class="bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-750 rounded-lg px-2 py-1 text-[11px] font-bold outline-none focus:ring-1 focus:ring-fuchsia-500 shadow-sm">
                    @for (report of availableReports(); track report.key) {
                      <option [value]="report.key">{{ report.label }}</option>
                    }
                  </select>
                }
              </div>
              
              <div class="flex items-center gap-3">
                @if (currentDocsUrl()) {
                  <a [href]="currentDocsUrl()" target="_blank" rel="noopener noreferrer"
                     class="px-2.5 py-1 text-[10px] font-bold text-slate-650 hover:text-fuchsia-600 dark:text-slate-300 dark:hover:text-fuchsia-400 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 rounded-lg border border-slate-200/60 dark:border-slate-700/80 transition flex items-center gap-1.5 no-underline shadow-xs cursor-pointer"
                     title="Mở Google Docs gốc để xem/chỉnh sửa ở cửa sổ mới">
                    <i class="fa-solid fa-file-word text-blue-500"></i>
                    <span>Google Docs</span>
                  </a>
                }

                @if (currentPdfUrl()) {
                  <button (click)="openPdfInModal(currentPdfUrl()!)" 
                          class="p-2 -mr-2 text-slate-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition active:scale-90" title="Mở PDF toàn màn hình (Modal hệ thống)">
                    <i class="fa-solid fa-expand text-sm lg:text-base"></i>
                  </button>
                }
              </div>
            </div>

            <div class="flex-1 bg-slate-100/50 dark:bg-slate-950/50 flex flex-col relative">
              @if (currentPdfUrl()) {
                @if (isInlinePdfLoading()) {
                  <div class="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
                    <div class="w-12 h-12 rounded-2xl bg-fuchsia-50 dark:bg-fuchsia-950/30 flex items-center justify-center border border-fuchsia-100 dark:border-fuchsia-900/40">
                      <i class="fa-solid fa-circle-notch fa-spin text-xl text-fuchsia-500"></i>
                    </div>
                    <div>
                      <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Đang tải PDF...</p>
                      <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Tải dữ liệu từ Google Drive qua proxy</p>
                    </div>
                  </div>
                } @else if (inlinePdfNeedsAuth()) {
                  <div class="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
                    <div class="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center border border-amber-100 dark:border-amber-900/40">
                      <i class="fa-solid fa-key text-2xl text-amber-500"></i>
                    </div>
                    <div>
                      <p class="text-sm font-bold text-slate-700 dark:text-slate-200">Cần xác thực Google Drive</p>
                      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">Phiên xác thực đã hết hạn. Xác thực lại để xem PDF trực tiếp trong trang.</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <button (click)="beginInlinePdfAuth()"
                              class="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl text-xs font-bold transition active:scale-95">
                        <i class="fa-solid fa-rotate-right mr-1.5"></i>Xác thực & tải lại
                      </button>
                      <button (click)="openPdfInModal(currentPdfUrl()!)"
                              class="px-4 py-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 transition active:scale-95">
                        Mở modal
                      </button>
                    </div>
                  </div>
                } @else if (inlinePdfError()) {
                  <div class="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
                    <i class="fa-solid fa-triangle-exclamation text-3xl text-amber-500"></i>
                    <div>
                      <p class="text-sm font-bold text-slate-700 dark:text-slate-200">Không thể tải PDF trực tiếp</p>
                      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Bạn vẫn có thể mở bằng modal hệ thống.</p>
                    </div>
                    <button (click)="openPdfInModal(currentPdfUrl()!)"
                            class="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl text-xs font-bold transition active:scale-95">
                      <i class="fa-solid fa-expand mr-1.5"></i>Mở qua hệ thống
                    </button>
                  </div>
                } @else if (inlinePdfSafeUrl()) {
                  <iframe [src]="inlinePdfSafeUrl()!" class="w-full h-full border-none bg-white flex-1"></iframe>
                } @else {
                  <div class="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
                    <i class="fa-solid fa-file-pdf text-4xl text-red-400 animate-pulse"></i>
                    <p class="text-xs text-slate-400">Đang chuẩn bị PDF...</p>
                  </div>
                }
              } @else {
                <div class="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 p-8 text-center space-y-3 relative z-10">
                  <i class="fa-regular fa-file-pdf text-4xl"></i>
                  <p class="text-sm font-medium">{{ pdfPreviewEmptyMessage() }}</p>
                </div>
              }
            </div>
          </div>
        </div>
      } @else if (run() && !draft()) {
        <!-- PENDING STATE: No results entered yet -->
        <div class="flex-1 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed p-12 animate-fade-in shadow-sm">
          <div class="w-20 h-20 bg-fuchsia-50 dark:bg-fuchsia-955/30 border border-fuchsia-100 dark:border-fuchsia-900/50 rounded-full flex items-center justify-center text-fuchsia-500 text-3xl mb-5 shadow-inner">
            <i class="fa-solid fa-file-pen"></i>
          </div>
          <h4 class="text-xl font-black text-slate-800 dark:text-slate-100 mb-2 tracking-tight">Chưa Có Kết Quả Phân Tích</h4>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8 text-center max-w-md leading-relaxed font-medium">
            Mẻ chạy <span class="font-bold text-slate-700 dark:text-slate-300">[{{ run()?.inputs?.['batchCode'] || run()?.id }}]</span> hiện chưa được nhập số liệu và đánh giá QC. Nhấn nút bên dưới để bắt đầu điền kết quả.
          </p>
          <div class="flex items-center gap-3">
            <button (click)="goBack()" class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-bold transition active:scale-95 shadow-sm">
              Quay Lại
            </button>
            <button (click)="goToEditMode()" class="px-6 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl text-sm font-black transition shadow-md shadow-fuchsia-500/20 active:scale-95 flex items-center gap-2">
              <i class="fa-solid fa-play text-xs"></i>
              Mở Màn Hình Nhập Kết Quả
            </button>
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
          <button (click)="goBack()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition">
            Quay Lại Danh Sách
          </button>
        </div>
      }

      <!-- QR Interactive Modal -->
      @if (isQrModalOpen()) {
        <div class="fixed inset-0 z-[100] flex items-center justify-center fade-in backdrop-blur-md bg-slate-900/60" (click)="isQrModalOpen.set(false)">
          <div class="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-2xl scale-in border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-6 max-w-[calc(100vw-2rem)]" (click)="$event.stopPropagation()">
            <div class="text-center space-y-2">
              <h3 class="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">Xác Minh Mẻ Chạy</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 max-w-[280px] mx-auto leading-relaxed">Sử dụng điện thoại để quét hoặc truy cập vào liên kết đối chiếu độc lập của hệ thống LIMS.</p>
            </div>
            
            <div class="bg-white p-4 rounded-2xl shadow-inner border border-slate-200/60 max-w-full flex items-center justify-center">
              <canvas #qrModalCanvas class="w-[240px] h-[240px] max-w-full aspect-square object-contain"></canvas>
            </div>
            
            <div class="flex items-center gap-3 w-full justify-center">
              <button (click)="viewTraceability()" 
                      class="px-5 py-2.5 bg-fuchsia-650 hover:bg-fuchsia-700 text-white rounded-xl text-xs font-black shadow-sm active:scale-95 transition flex items-center gap-2">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                <span>Mở Trang</span>
              </button>
              <button (click)="copyTraceabilityLink()" 
                      class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-655 dark:text-slate-355 rounded-xl text-xs font-bold active:scale-95 transition border border-slate-200/50">
                <i class="fa-solid fa-copy"></i>
                <span>Sao Chép Liên Kết</span>
              </button>
            </div>

            <button (click)="isQrModalOpen.set(false)" class="w-full px-8 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 text-slate-700 rounded-xl text-xs font-black active:scale-95 transition mt-2 border border-slate-200/60 dark:border-slate-700">
              Đóng
            </button>
          </div>
        </div>
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
  private toast = inject(ToastService);
  private masterTargetService = inject(MasterTargetService);
  private auth = inject(AuthService);
  private sanitizer = inject(DomSanitizer);
  private googleDriveService = inject(GoogleDriveService);

  requestId = '';
  isLoading = signal(true);

  qrCanvas = viewChild<ElementRef<HTMLCanvasElement>>('qrCanvas');
  qrModalCanvas = viewChild<ElementRef<HTMLCanvasElement>>('qrModalCanvas');
  isQrModalOpen = signal(false);

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

    effect(() => {
      const pdfUrl = this.currentPdfUrl();
      untracked(() => this.startInlinePdfLoad(pdfUrl));
    });
  }

  // App models signals
  run = signal<any | null>(null);
  draft = signal<AnalysisResultDraft | null>(null);
  config = signal<any | null>(null);
  configKey = signal<string | null>(null);

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

  inlinePdfBlobUrl = signal<string | null>(null);
  isInlinePdfLoading = signal(false);
  inlinePdfError = signal(false);
  inlinePdfNeedsAuth = signal(false);

  private unsubscribeFromDraft?: () => void;
  private hasInitializedReportSelection = false;
  private inlinePdfLoadSeq = 0;

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

  lockedByOthers = computed(() => {
    const r = this.run();
    const user = this.auth.currentUser();
    if (!r?.lockedBy || !user || r.lockedBy.toLowerCase() === user.email.toLowerCase()) return false;
    
    if (r.lastActiveAt) {
      const lastActive = this.convertToDate(r.lastActiveAt);
      if (lastActive && (new Date().getTime() - lastActive.getTime()) > 3 * 60 * 1000) {
        return false;
      }
    }
    return true;
  });

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

  inlinePdfSafeUrl = computed<SafeResourceUrl | null>(() => {
    const url = this.inlinePdfBlobUrl();
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
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
      this.toast.show('Không tìm thấy ID mẻ chạy!', 'error');
      this.router.navigate(['/results-view']);
      return;
    }

    const initialPrefix = this.route.snapshot.queryParamMap.get('prefix');
    if (initialPrefix !== null) {
      this.activeFilter.set(initialPrefix);
    }

    // Load master Targets/Analytes
    try {
      const analytes = await this.masterTargetService.getAll();
      this.masterTargets.set(analytes);
    } catch (e) {
      console.warn('Failed to load master analytes in Viewer', e);
    }

    this.isLoading.set(true);

    // Subscribe to Firebase real-time updates
    this.unsubscribeFromDraft = this.resultService.subscribeToDraft(
      this.requestId,
      async (draftDoc: any, runDoc: any) => {
        if (runDoc) {
          this.run.set(runDoc);

          // Auto-select first sample for 3B accordion
          if (runDoc.sampleList && runDoc.sampleList.length > 0 && !this.activeSampleCode()) {
            this.activeSampleCode.set(runDoc.sampleList[0]);
          }

          const sopObj = this.state.sops().find((s: any) => s.id === runDoc.sopId) || null;
          const resolvedKey = resolveConfigKey(runDoc.sopId, runDoc.sopName || '', sopObj);
          const sopConf = resolvedKey ? ANGULAR_SOP_CONFIG[resolvedKey] : null;

          if (sopConf && resolvedKey) {
            this.config.set({ ...sopConf, id: resolvedKey });
            this.configKey.set(resolvedKey);
            this.draft.set(draftDoc);
            
            this.ensureSelectedReport();

            // Build custom columns labels map
            this.buildColumnDisplayNames();
          }
        }
        this.isLoading.set(false);
      }
    );
  }

  ngOnDestroy() {
    if (this.unsubscribeFromDraft) {
      this.unsubscribeFromDraft();
    }
    this.cleanupInlinePdf();
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

  private collectReports(): Map<string, any> {
    const d = this.draft();
    const r = this.run();
    const reportsMap = new Map<string, any>();

    // Load reports from draft first
    if (d?.reports) {
      Object.entries(d.reports).forEach(([key, value]) => {
        const reportId = (value as any)?.id || key;
        reportsMap.set(reportId, { ...(value as any), id: reportId });
      });
    }

    // Merge reports from run to get the latest published PDFs
    if (r) {
       const runReports = r.analysisResultSummary?.reports || r.analysisResult?.reports;
       if (runReports) {
           Object.entries(runReports).forEach(([key, value]) => {
              const reportId = (value as any)?.id || key;
              if (!reportsMap.has(reportId)) {
                reportsMap.set(reportId, { ...(value as any), id: reportId });
              } else {
                const existing = reportsMap.get(reportId);
                reportsMap.set(reportId, {
                   ...existing, 
                   id: existing.id || reportId,
                   pdfViewUrl: existing.pdfViewUrl || (value as any).pdfViewUrl, 
                   pdfUrl: existing.pdfUrl || (value as any).pdfUrl,
                   docsUrl: existing.docsUrl || (value as any).docsUrl
                });
             }
          });
       }
    }

    return reportsMap;
  }

  availableReports = computed(() => {
    const reportsMap = this.collectReports();

    // Convert map to array for UI
    return Array.from(reportsMap.entries()).map(([key, value]: [string, any]) => {
      const prefixValue = value?.prefix || key;
      const normalizedPrefix = prefixValue === '_NO_PREFIX_' ? '' : prefixValue;
      return {
        key: value?.id || key,
        prefix: normalizedPrefix,
        label: this.getReportSampleLabel(value, normalizedPrefix),
        fileName: value.pdfFileName || value.fileName,
        url: value.pdfViewUrl || value.pdfUrl || null,
        docsUrl: value.docsUrl || null,
        version: value.version || 0
      };
    }).sort((a, b) => {
      if (a.prefix !== b.prefix) return a.prefix.localeCompare(b.prefix);
      return (b.version || 0) - (a.version || 0);
    });
  });

  private getReportSampleLabel(report: any, prefix: string): string {
    const samples = this.getReportSamples(report, prefix);
    return samples.length > 0 ? formatSampleList(samples) : 'Chưa rõ mẫu';
  }

  private getReportSamples(report: any, prefix: string): string[] {
    if (Array.isArray(report?.includedSamples) && report.includedSamples.length > 0) {
      return [...report.includedSamples].sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
    }

    if (report?.samples && typeof report.samples === 'object') {
      const samples = Object.keys(report.samples).filter(sample => report.samples[sample]?.included !== false);
      if (samples.length > 0) {
        return samples.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
      }
    }

    const r = this.run();
    const sampleList = r?.sampleList || [];
    if (prefix === 'ALL') return [...sampleList];

    return sampleList.filter((sample: string) => {
      const startsWithLetter = /^[a-zA-Z]/.test(sample);
      const samplePrefix = startsWithLetter ? sample.charAt(0).toUpperCase() : '';
      return samplePrefix === prefix;
    });
  }

  changeActiveFilter(prefix: string) {
    this.activeFilter.set(prefix);
    this.showAllTargets.set(false);

    if (prefix === 'ALL') {
      const overallReport = this.findOverallReportMeta();
      this.selectedPdfPrefix.set(overallReport?.key || '');
      this.hasInitializedReportSelection = true;
      return;
    }

    const matchingReport = this.findLatestReportMetaByPrefix(prefix);
    this.selectedPdfPrefix.set(matchingReport?.key || '');
    this.hasInitializedReportSelection = true;
  }

  selectReport(reportId: string) {
    this.selectedPdfPrefix.set(reportId);
    this.hasInitializedReportSelection = true;

    const selectedReport = this.findReportMetaById(reportId);
    if (selectedReport && selectedReport.prefix !== this.activeFilter()) {
      this.activeFilter.set(selectedReport.prefix);
      this.showAllTargets.set(false);
    }
  }

  private ensureSelectedReport() {
    const available = this.availableReports();
    if (available.length === 0) {
      if (this.activeFilter() === 'ALL' && this.getRootPdfUrl()) {
        this.selectedPdfPrefix.set('');
        this.hasInitializedReportSelection = true;
      }
      return;
    }

    const selected = this.selectedPdfPrefix();
    const activeFilter = this.activeFilter();
    const selectedMeta = selected ? this.findReportMetaById(selected) : null;
    const selectionMatchesFilter = selectedMeta
      ? selectedMeta.prefix === activeFilter
      : activeFilter === 'ALL' && !!this.getRootPdfUrl();

    if (this.hasInitializedReportSelection && selectionMatchesFilter) return;

    if (activeFilter !== 'ALL') {
      const preferred = this.findLatestReportMetaByPrefix(activeFilter);
      this.selectedPdfPrefix.set(preferred?.key || '');
      this.hasInitializedReportSelection = true;
      return;
    }

    const overallReport = this.findOverallReportMeta();
    if (overallReport || this.getRootPdfUrl()) {
      this.selectedPdfPrefix.set(overallReport?.key || '');
      this.hasInitializedReportSelection = true;
      return;
    }

    const firstPrefixReport = available.find(report => report.prefix !== 'ALL');
    if (firstPrefixReport) {
      this.activeFilter.set(firstPrefixReport.prefix);
      this.selectedPdfPrefix.set(firstPrefixReport.key);
      this.hasInitializedReportSelection = true;
      return;
    }

    this.selectedPdfPrefix.set('');
    this.hasInitializedReportSelection = true;
  }

  private findReportMetaById(reportId: string | null | undefined): any | null {
    if (!reportId) return null;
    return this.availableReports().find(report => report.key === reportId) || null;
  }

  private findReportById(reportId: string | null | undefined): any | null {
    if (!reportId) return null;
    return this.collectReports().get(reportId) || null;
  }

  private findLatestReportMetaByPrefix(prefix: string): any | null {
    return this.availableReports()
      .filter(report => report.prefix === prefix)
      .sort((a, b) => (b.version || 0) - (a.version || 0))[0] || null;
  }

  private findLatestReportByPrefix(prefix: string): any | null {
    const selected = this.findReportMetaById(this.selectedPdfPrefix());
    const reportMeta = selected?.prefix === prefix ? selected : this.findLatestReportMetaByPrefix(prefix);
    return reportMeta ? this.findReportById(reportMeta.key) : null;
  }

  private findOverallReportMeta(): any | null {
    return this.findLatestReportMetaByPrefix('ALL');
  }

  private getRootPdfUrl(): string | null {
    const d = this.draft();
    const r = this.run();
    if (!d) return null;

    return d.pdfViewUrl || (d as any).pdfUrl
      || r?.analysisResultSummary?.pdfViewUrl || r?.analysisResultSummary?.pdfUrl
      || r?.analysisResult?.pdfViewUrl || r?.analysisResult?.pdfUrl
      || null;
  }

  private getRootDocsUrl(): string | null {
    const d = this.draft();
    const r = this.run();
    if (!d) return null;

    return d.docsUrl
      || r?.analysisResultSummary?.docsUrl
      || r?.analysisResult?.docsUrl
      || null;
  }

  currentPdfUrl = computed<string | null>(() => {
    const activeFilter = this.activeFilter();
    if (!this.draft()) return null;

    if (activeFilter !== 'ALL') {
      const report = this.findLatestReportByPrefix(activeFilter);
      return report?.pdfViewUrl || report?.pdfUrl || null;
    }

    const selectedMeta = this.findReportMetaById(this.selectedPdfPrefix());
    const selectedReport = this.findReportById(this.selectedPdfPrefix());
    let url = selectedMeta?.prefix === 'ALL'
      ? selectedReport?.pdfViewUrl || selectedReport?.pdfUrl || null
      : null;
    if (url) return url;

    url = this.getRootPdfUrl();
    if (url) return url;

    return null;
  });

  currentDocsUrl = computed<string | null>(() => {
    const activeFilter = this.activeFilter();
    if (!this.draft()) return null;

    if (activeFilter !== 'ALL') {
      const report = this.findLatestReportByPrefix(activeFilter);
      return report?.docsUrl ? getSafeGoogleUrl(report.docsUrl, 'doc') : null;
    }

    const selectedMeta = this.findReportMetaById(this.selectedPdfPrefix());
    const selectedReport = this.findReportById(this.selectedPdfPrefix());
    let url = selectedMeta?.prefix === 'ALL' ? selectedReport?.docsUrl || null : null;
    if (!url) url = this.getRootDocsUrl();
    return url ? getSafeGoogleUrl(url, 'doc') : null;
  });

  pdfPreviewEmptyMessage = computed(() => {
    if (this.activeFilter() === 'ALL' && this.detectedPrefixes().length > 1) {
      return 'Chưa có PDF toàn mẻ. Chọn một tiền tố để xem PDF tương ứng.';
    }
    return 'Chưa có bản xem trước PDF cho phạm vi đang chọn.';
  });

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

  getCurrentPdfUrl(): string | null {
    return this.currentPdfUrl();
  }


  getCurrentDocsUrl(): string | null {
    return this.currentDocsUrl();
  }

  private startInlinePdfLoad(pdfUrl: string | null) {
    const seq = ++this.inlinePdfLoadSeq;
    this.cleanupInlinePdf();
    if (!pdfUrl) {
      this.isInlinePdfLoading.set(false);
      return;
    }

    void this.loadPdfBlob(pdfUrl, seq);
  }

  private async loadPdfBlob(pdfUrl: string, seq: number) {
    const fileId = this.extractFileId(pdfUrl);
    if (!fileId) {
      if (seq === this.inlinePdfLoadSeq) {
        this.inlinePdfBlobUrl.set(pdfUrl);
      }
      return;
    }

    this.isInlinePdfLoading.set(true);
    this.inlinePdfError.set(false);
    this.inlinePdfNeedsAuth.set(false);
    try {
      const rawBlob = await this.googleDriveService.downloadFile(fileId);
      const blob = new Blob([rawBlob], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      if (seq === this.inlinePdfLoadSeq && this.currentPdfUrl() === pdfUrl) {
        this.inlinePdfBlobUrl.set(blobUrl);
      } else {
        URL.revokeObjectURL(blobUrl);
      }
    } catch (err: any) {
      if (seq !== this.inlinePdfLoadSeq) return;
      if (err?.code === 'oauth_required') {
        this.inlinePdfNeedsAuth.set(true);
      } else {
        console.error('[InlinePDF] Failed to load PDF blob:', err);
        this.inlinePdfError.set(true);
      }
    } finally {
      if (seq === this.inlinePdfLoadSeq) {
        this.isInlinePdfLoading.set(false);
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

  private cleanupInlinePdf() {
    const current = this.inlinePdfBlobUrl();
    if (current?.startsWith('blob:')) {
      URL.revokeObjectURL(current);
    }
    this.inlinePdfBlobUrl.set(null);
    this.inlinePdfError.set(false);
    this.inlinePdfNeedsAuth.set(false);
  }

  beginInlinePdfAuth() {
    this.googleDriveService.beginRedirectAuth();
  }


  openPdfInModal(url: string) {
    const activeFilter = this.activeFilter();
    const filterName = activeFilter === 'ALL' ? 'Tất cả mẫu' : (activeFilter === '' ? 'Không tiền tố' : `Nhóm ${activeFilter}`);
    const previewUrl = this.getGoogleDrivePreviewUrl(url);

    this.printService.openPdfPreview(
      previewUrl,
      `Báo cáo kết quả — ${this.run()?.sopName || ''} (${filterName})`,
      this.draft()?.version || 1,
      this.draft()?.updatedBy || 'Chưa rõ',
      this.draft()?.updatedAt
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
      return 'bg-fuchsia-50 dark:bg-fuchsia-955/20 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-200/40 dark:border-fuchsia-900/30';
    }
    return 'bg-amber-50 dark:bg-amber-955/20 text-amber-700 dark:text-amber-400 border-amber-200/40 dark:border-amber-900/30';
  }

  convertToDate(timestamp: any): Date | null {
    return timestampToDate(timestamp);
  }

  async takeOverLock() {
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
      await this.resultService.acquireLock(this.requestId, user.email, user.displayName);
      this.isLoading.set(false);
      this.toast.show('Bạn đã giành quyền chỉnh sửa mẻ này thành công!', 'success');
      this.goToEditMode();
    }
  }

  goToEditMode() {
    this.router.navigate(['/results', this.requestId], {
      queryParams: this.activeFilter() !== 'ALL'
        ? { prefix: this.activeFilter(), edit: '1' }
        : { edit: '1' }
    });
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
    if (!url) return '';
    const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileDMatch && fileDMatch[1]) {
      return `https://drive.google.com/file/d/${fileDMatch[1]}/preview`;
    }
    const docDMatch = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
    if (docDMatch && docDMatch[1]) {
      return `https://docs.google.com/document/d/${docDMatch[1]}/preview`;
    }
    try {
      const urlObj = new URL(url);
      const id = urlObj.searchParams.get('id');
      if (id) {
        return `https://drive.google.com/file/d/${id}/preview`;
      }
    } catch (e) {
      const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) {
        return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
      }
    }
    return url;
  }
}
