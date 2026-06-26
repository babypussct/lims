import { Component, inject, signal, computed, OnInit, OnDestroy, ElementRef, viewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

declare let QRious: any;
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StateService } from '../../core/services/state.service';
import { AuthService } from '../../core/services/auth.service';
import { ResultService } from '../results/services/result.service';
import { PrintService } from '../../core/services/print.service';
import { ToastService } from '../../core/services/toast.service';
import { AnalysisResultDraft } from '../../core/models/analysis-result.model';
import { resolveConfigKey, ANGULAR_SOP_CONFIG } from '../results/config/sop-configs';
import { getSafeGoogleUrl, formatSampleList } from '../../shared/utils/utils';
import { resolveCompoundDisplayName, isCompoundAssigned } from '../results/shared/compound-id-resolver';
import { MasterTargetService } from '../targets/master-target.service';

@Component({
  selector: 'app-batch-detail-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="h-full flex flex-col animate-fade-in bg-slate-50/60 dark:bg-slate-900 p-4 lg:p-6 space-y-4 lg:space-y-5">
      
      <!-- TOP HEADER & BREADCRUMBS -->
      <div class="flex flex-col gap-4 shrink-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-4 lg:p-5 rounded-3xl shadow-sm">
        <!-- Title and actions row -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div class="flex items-center gap-3.5">
            <button (click)="goBack()" 
                    class="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all duration-200 active:scale-95 border border-slate-200/50 dark:border-slate-700">
              <i class="fa-solid fa-arrow-left text-xs"></i>
            </button>
            <div>
              <div class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
                <span>Kết quả phân tích</span>
                <i class="fa-solid fa-chevron-right text-[8px] text-slate-300 dark:text-slate-600"></i>
                <span class="text-indigo-600 dark:text-indigo-400">{{ run() ? run().sopName : 'Đang tải...' }}</span>
              </div>
              <h3 class="text-lg font-extrabold text-slate-800 dark:text-slate-100 flex flex-wrap items-center gap-2 m-0 tracking-tight">
                Chi Tiết Kết Quả Mẻ Phân Tích
                
                @if (run() && draft() && config()) {
                  <span [class]="getStatusClass()" class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border shadow-xs">
                    <span class="w-1.5 h-1.5 rounded-full" [ngClass]="{
                      'bg-emerald-500': draft()?.status === 'completed',
                      'bg-indigo-500': draft()?.status === 'draft',
                      'bg-amber-500': $any(draft()?.status) === 'pending' || !draft()?.status
                    }"></span>
                    {{ getStatusText() }}
                  </span>
                }

                @if (run()?.parentMasterId) {
                  <a [routerLink]="['/results', run().parentMasterId]" class="px-2 py-0.5 rounded-full bg-fuchsia-50 dark:bg-fuchsia-955/20 border border-fuchsia-200 dark:border-fuchsia-900/40 text-fuchsia-600 dark:text-fuchsia-400 text-[9px] font-extrabold uppercase hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/30 transition-colors flex items-center gap-1 cursor-pointer shadow-xs" title="Mẻ chạy này đã được gộp số liệu. Nhấn để đi tới Master Ảo.">
                    <i class="fa-solid fa-link text-[8px] animate-pulse"></i> Đã gộp Master Ảo
                  </a>
                }
              </h3>
            </div>
          </div>

          <!-- Action Buttons -->
          @if (run() && draft() && config()) {
            <div class="flex items-center gap-2 shrink-0">
              <button (click)="openQrModal()"
                      class="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700 rounded-xl transition duration-200 active:scale-95 flex items-center gap-2">
                <i class="fa-solid fa-qrcode text-indigo-500"></i>
                <span>Mã QR</span>
              </button>

              <button (click)="goToEditMode()"
                      [class]="lockedByOthers() 
                        ? 'px-4 py-2 text-xs font-black text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-all duration-200 active:scale-95 flex items-center gap-2 cursor-pointer'
                        : 'px-4 py-2 text-xs font-black text-white bg-indigo-650 hover:bg-indigo-755 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-xl shadow-xs transition-all duration-200 active:scale-95 flex items-center gap-2 cursor-pointer'"
                      [title]="lockedByOthers() ? 'Mẻ này đang bị sửa bởi ' + run()?.lockedByName + '. Nhấp để xem chi tiết hoặc Giành quyền.' : 'Nhấp để chỉnh sửa số liệu'">
                <i class="fa-solid" [class.fa-lock]="lockedByOthers()" [class.fa-pen-to-square]="!lockedByOthers()"></i>
                <span>{{ lockedByOthers() ? 'Mẻ đang khóa' : 'Chỉnh sửa số liệu' }}</span>
              </button>
            </div>
          }
        </div>

        <!-- Metadata row -->
        @if (run() && draft() && config()) {
          <div class="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
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
          </div>
        }
      </div>

      <!-- MAIN SPLIT SCREEN LAYOUT -->
      @if (isLoading()) {
        <div class="flex-1 flex items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 p-12">
          <div class="text-center space-y-4">
            <i class="fa-solid fa-circle-notch fa-spin text-3xl text-indigo-600 dark:text-indigo-400"></i>
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
                <h4 class="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-400">Mẻ chạy đang được chỉnh sửa</h4>
                <p class="text-[11px] text-amber-650 dark:text-amber-300 font-semibold mt-0.5">
                  KTV <strong>{{ run()?.lockedByName }}</strong> đang chỉnh sửa mẻ này từ lúc <strong>{{ convertToDate(run()?.lockedAt) | date: 'HH:mm dd/MM/yyyy' }}</strong>. Số liệu hiển thị có thể thay đổi liên tục.
                </p>
              </div>
            </div>
            <button (click)="takeOverLock()"
                    class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-xl transition flex items-center gap-2 shrink-0 active:scale-95 shadow-md shadow-amber-500/10 cursor-pointer">
              <i class="fa-solid fa-unlock-keyhole"></i>
              <span>Giành quyền chỉnh sửa</span>
            </button>
          </div>
        }

        <!-- MOBILE TAB SWITCHER (lg:hidden) -->
        <div class="lg:hidden flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shrink-0 mb-1">
          <button (click)="mobileActiveTab.set('grid')"
                  [class]="mobileActiveTab() === 'grid'
                    ? 'flex-1 py-2.5 text-xs font-black bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 rounded-xl shadow-xs border border-slate-200/20 dark:border-slate-700/30'
                    : 'flex-1 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
                  class="transition-all duration-200 flex items-center justify-center gap-2">
            <i class="fa-solid fa-table-cells text-sm"></i>
            <span>Bảng kết quả</span>
          </button>
          <button (click)="mobileActiveTab.set('pdf')"
                  [class]="mobileActiveTab() === 'pdf'
                    ? 'flex-1 py-2.5 text-xs font-black bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 rounded-xl shadow-xs border border-slate-200/20 dark:border-slate-700/30'
                    : 'flex-1 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
                  class="transition-all duration-200 flex items-center justify-center gap-2">
            <i class="fa-solid fa-file-pdf text-sm text-red-500"></i>
            <span>PDF Preview</span>
          </button>
        </div>

        <div class="flex-1 min-h-0 flex flex-col lg:flex-row gap-5 overflow-hidden lg:h-[calc(100vh-220px)] lg:min-h-[600px]">
          
          <!-- LEFT PANE: CHROMATOGRAPHY GRID (approx 55-60%) -->
          <div [class.hidden]="mobileActiveTab() !== 'grid'" class="lg:!flex lg:flex-[6] flex flex-col min-h-0 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
            
            <!-- Header of Grid -->
            <div class="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 shrink-0">
              <div class="flex items-center gap-3 min-w-0">
                <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center m-0 shrink-0">
                  <i class="fa-solid fa-table-cells mr-2.5 text-indigo-500"></i> Bảng kết quả chạy
                </h4>
                
                <!-- Prefix filter tabs -->
                @if (detectedPrefixes().length > 1) {
                  <div class="flex items-center bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg border border-slate-200/60 dark:border-slate-800/80 ml-2 overflow-x-auto max-w-[200px] sm:max-w-none custom-scrollbar shrink-0">
                    <button (click)="activeFilter.set('ALL')"
                            [class]="activeFilter() === 'ALL'
                              ? 'px-2 py-1 text-[9px] font-black bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 rounded shadow-xs'
                              : 'px-2 py-1 text-[9px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
                            class="transition duration-150 shrink-0">
                      Tất cả
                    </button>
                    @for (prefix of detectedPrefixes(); track prefix) {
                      <button (click)="activeFilter.set(prefix)"
                              [class]="activeFilter() === prefix
                                ? 'px-2 py-1 text-[9px] font-black bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 rounded shadow-xs'
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
                              ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20 border-transparent'
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
                    @for (comp of config()?.compounds; track comp; let idx = $index) {
                      <tr [ngClass]="{ 'opacity-50 bg-slate-50/30 dark:bg-slate-900/30': !isTargetAssigned(activeSampleCode(), comp) }" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td class="py-3 px-4 text-center font-mono text-sm text-slate-400">
                          @if (isTargetAssigned(activeSampleCode(), comp)) { {{ idx + 1 }} } @else { <i class="fa-solid fa-lock text-[10px]"></i> }
                        </td>
                        <td class="py-3 px-4 font-bold text-sm text-slate-700 dark:text-slate-200">
                          {{ getCompoundDisplayName(comp) }}
                        </td>
                        <td class="py-3 px-4 text-center">
                          @if (isTargetAssigned(activeSampleCode(), comp)) {
                            <span [class.text-amber-500]="(draft()?.resultData?.[activeSampleCode()] || {})[comp + '_nd']" class="text-sm">
                              <i class="fa-regular" [class.fa-square-check]="(draft()?.resultData?.[activeSampleCode()] || {})[comp + '_nd']" [class.fa-square]="!(draft()?.resultData?.[activeSampleCode()] || {})[comp + '_nd']"></i>
                            </span>
                          } @else {
                            <span class="text-slate-300 dark:text-slate-600">—</span>
                          }
                        </td>
                        <td class="py-3 px-4 text-center font-mono font-semibold text-sm text-slate-800 dark:text-slate-200">
                          @if (isTargetAssigned(activeSampleCode(), comp)) {
                            {{ (draft()?.resultData?.[activeSampleCode()] || {})[comp] !== undefined && (draft()?.resultData?.[activeSampleCode()] || {})[comp] !== null ? ((draft()?.resultData?.[activeSampleCode()] || {})[comp] === 'N/A' ? '—' : (draft()?.resultData?.[activeSampleCode()] || {})[comp]) : '—' }}
                          } @else {
                            <span class="text-slate-300 dark:text-slate-600 font-normal select-none">—</span>
                          }
                        </td>
                        <!-- QC statuses badges -->
                        @for (qcNum of ['1', '2', '3']; track qcNum) {
                          <td class="py-3 px-4 text-center">
                            @if (isTargetAssigned(activeSampleCode(), comp)) {
                              @if ((draft()?.resultData?.[activeSampleCode()] || {})[comp + '_qc' + qcNum] === 'Đạt') {
                                <span class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">Đạt</span>
                              } @else if ((draft()?.resultData?.[activeSampleCode()] || {})[comp + '_qc' + qcNum] === 'Không đạt') {
                                <span class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-100/50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400">K.Đạt</span>
                              } @else {
                                <span class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 select-none">—</span>
                              }
                            } @else {
                              <span class="text-slate-300 dark:text-slate-600 select-none">—</span>
                            }
                          </td>
                        }
                      </tr>
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

                      @for (col of activeColumns(); track col) {
                        <th class="py-3.5 px-5 text-center font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider min-w-[140px]">
                          {{ columnDisplayNames()[col] || col }}
                        </th>
                      }
                      
                      <th class="py-3.5 px-5 font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider min-w-[180px]">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                    @for (row of getType2DisplayRows(); track row.key) {
                      <tr [ngClass]="{
                        'bg-indigo-50/30 dark:bg-indigo-900/10 font-semibold text-slate-900 dark:text-slate-100': row.isQC,
                        'bg-white dark:bg-slate-900': !row.isQC
                      }" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors bg-white dark:bg-slate-900">
                        
                        <td class="py-3 px-5 font-mono text-sm text-slate-500 dark:text-slate-400 w-24 min-w-[96px] max-w-[96px] sticky left-0 bg-inherit z-10 border-r border-slate-100 dark:border-slate-800/80">
                          {{ getRowDataValue(row.key, 'loSo') || '—' }}
                        </td>
                        
                        <td class="py-3 px-5 sticky left-24 bg-inherit z-10 border-r border-slate-100 dark:border-slate-800/80 shadow-[4px_0_8px_-3px_rgba(0,0,0,0.08)] dark:shadow-[4px_0_8px_-3px_rgba(0,0,0,0.3)]">
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

                        @for (col of activeColumns(); track col) {
                          <td class="py-3 px-5 text-center font-mono font-semibold text-sm text-slate-700 dark:text-slate-200">
                            @if (isTargetAssigned(row.key, col)) {
                              {{ getRowDataValue(row.key, col) !== '' ? (getRowDataValue(row.key, col) === 'N/A' ? '—' : getRowDataValue(row.key, col)) : '—' }}
                            } @else {
                              <span class="text-slate-300 dark:text-slate-600 font-normal select-none">—</span>
                            }
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
          <div [class.hidden]="mobileActiveTab() !== 'pdf'" class="lg:!flex lg:flex-[4] flex flex-col min-h-[300px] lg:min-h-[600px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden relative">
            
            <div class="px-5 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 shrink-0 relative z-10">
              <div class="flex items-center gap-3">
                <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center m-0">
                  <i class="fa-solid fa-file-pdf mr-2.5 text-red-500"></i> PDF PREVIEW
                </h4>
                
                @if (availableReports().length > 1 && activeFilter() === 'ALL') {
                  <select [ngModel]="selectedPdfPrefix()" 
                          (ngModelChange)="selectedPdfPrefix.set($event)"
                          class="bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-750 rounded-lg px-2 py-1 text-[11px] font-bold outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm">
                    @for (report of availableReports(); track report.key) {
                      <option [value]="report.key">{{ report.label }}</option>
                    }
                  </select>
                }
              </div>
              
              <div class="flex items-center gap-3">
                @if (getCurrentDocsUrl()) {
                  <a [href]="getCurrentDocsUrl()" target="_blank" rel="noopener noreferrer"
                     class="px-2.5 py-1 text-[10px] font-bold text-slate-650 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 rounded-lg border border-slate-200/60 dark:border-slate-700/80 transition flex items-center gap-1.5 no-underline shadow-xs cursor-pointer"
                     title="Mở Google Docs gốc để xem/chỉnh sửa ở cửa sổ mới">
                    <i class="fa-solid fa-file-word text-blue-500"></i>
                    <span>Google Docs</span>
                  </a>
                }

                @if (safePdfIframeUrl()) {
                  <button (click)="openPdfInModal(getCurrentPdfUrl()!)" 
                          class="p-2 -mr-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition active:scale-90" title="Mở PDF toàn màn hình (Modal hệ thống)">
                    <i class="fa-solid fa-expand text-sm lg:text-base"></i>
                  </button>
                }
              </div>
            </div>

            <div class="flex-1 bg-slate-100/50 dark:bg-slate-950/50 flex flex-col relative">
              @if (safePdfIframeUrl()) {
                <iframe [src]="safePdfIframeUrl()" class="w-full h-full border-none absolute inset-0 z-0" allow="autoplay"></iframe>
              } @else {
                <div class="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 p-8 text-center space-y-3 relative z-10">
                  <i class="fa-regular fa-file-pdf text-4xl"></i>
                  <p class="text-sm font-medium">Chưa có PDF Preview nào cho tùy chọn này.</p>
                </div>
              }
            </div>
          </div>
        </div>
      } @else if (run() && !draft()) {
        <!-- PENDING STATE: No results entered yet -->
        <div class="flex-1 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed p-12 animate-fade-in shadow-sm">
          <div class="w-20 h-20 bg-indigo-50 dark:bg-indigo-955/30 border border-indigo-100 dark:border-indigo-900/50 rounded-full flex items-center justify-center text-indigo-500 text-3xl mb-5 shadow-inner">
            <i class="fa-solid fa-file-pen"></i>
          </div>
          <h4 class="text-xl font-black text-slate-800 dark:text-slate-100 mb-2 tracking-tight">Chưa có kết quả phân tích</h4>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8 text-center max-w-md leading-relaxed font-medium">
            Mẻ chạy <span class="font-bold text-slate-700 dark:text-slate-300">[{{ run()?.inputs?.['batchCode'] || run()?.id }}]</span> hiện chưa được nhập số liệu và đánh giá QC. Nhấn nút bên dưới để bắt đầu điền kết quả.
          </p>
          <div class="flex items-center gap-3">
            <button (click)="goBack()" class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-bold transition active:scale-95 shadow-sm">
              Quay lại
            </button>
            <button (click)="goToEditMode()" class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-black transition shadow-md shadow-indigo-500/20 active:scale-95 flex items-center gap-2">
              <i class="fa-solid fa-play text-xs"></i>
              Truy cập UI Nhập Kết Quả
            </button>
          </div>
        </div>
      } @else {
        <!-- ERROR STATE: Batch not found -->
        <div class="flex-1 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed p-12">
          <div class="w-16 h-16 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 rounded-full flex items-center justify-center text-red-500 text-2xl mb-4">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <h4 class="text-base font-extrabold text-slate-800 dark:text-slate-200 mb-1">Không tìm thấy mẻ phân tích</h4>
          <p class="text-xs text-slate-400 dark:text-slate-500 mb-4 text-center max-w-sm">
            Không tìm thấy thông tin chi tiết hoặc cấu hình SOP tương ứng của mẻ chạy phân tích này.
          </p>
          <button (click)="goBack()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition">
            Quay lại danh sách
          </button>
        </div>
      }

      <!-- QR Interactive Modal -->
      @if (isQrModalOpen()) {
        <div class="fixed inset-0 z-[100] flex items-center justify-center fade-in backdrop-blur-md bg-slate-900/60" (click)="isQrModalOpen.set(false)">
          <div class="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-2xl scale-in border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-6 max-w-[calc(100vw-2rem)]" (click)="$event.stopPropagation()">
            <div class="text-center space-y-2">
              <h3 class="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">Xác Minh Mẻ Chạy</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 max-w-[280px] mx-auto leading-relaxed">Sử dụng điện thoại để quét hoặc truy cập vào liên kết đối chiếu độc lập của hệ thống LIMS.</p>
            </div>
            
            <div class="bg-white p-4 rounded-2xl shadow-inner border border-slate-200/60 max-w-full flex items-center justify-center">
              <canvas #qrModalCanvas class="w-[240px] h-[240px] max-w-full aspect-square object-contain"></canvas>
            </div>
            
            <div class="flex items-center gap-3 w-full justify-center">
              <button (click)="viewTraceability()" 
                      class="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-755 text-white rounded-xl text-xs font-black shadow-sm active:scale-95 transition flex items-center gap-2">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                <span>Mở trang</span>
              </button>
              <button (click)="copyTraceabilityLink()" 
                      class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-655 dark:text-slate-355 rounded-xl text-xs font-bold active:scale-95 transition border border-slate-200/50">
                <i class="fa-solid fa-copy"></i>
                <span>Copy Link</span>
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
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private state = inject(StateService);
  private resultService = inject(ResultService);
  private printService = inject(PrintService);
  private toast = inject(ToastService);
  private sanitizer = inject(DomSanitizer);
  private masterTargetService = inject(MasterTargetService);
  private auth = inject(AuthService);

  requestId = '';
  isLoading = signal(true);

  qrCanvas = viewChild<ElementRef<HTMLCanvasElement>>('qrCanvas');
  qrModalCanvas = viewChild<ElementRef<HTMLCanvasElement>>('qrModalCanvas');
  isQrModalOpen = signal(false);

  constructor() {
    effect(() => {
      const canvas = this.qrCanvas();
      if (canvas) {
        this.generateQrCode();
      }
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

  // Safe Docs Iframe url calculated from current filter
  safeDocsIframeUrl = computed<SafeResourceUrl | null>(() => {
    const url = this.getCurrentDocsUrl();
    if (!url) return null;

    // Convert to Google Drive preview embed format
    const previewUrl = this.getGoogleDrivePreviewUrl(url);
    return this.sanitizer.bypassSecurityTrustResourceUrl(previewUrl);
  });

  // Safe PDF Iframe url calculated from current filter
  safePdfIframeUrl = computed<SafeResourceUrl | null>(() => {
    const url = this.getCurrentPdfUrl();
    if (!url) return null;

    // Convert to Google Drive preview embed format
    const previewUrl = this.getGoogleDrivePreviewUrl(url);
    return this.sanitizer.bypassSecurityTrustResourceUrl(previewUrl);
  });

  // Extract compounds columns
  activeColumns = computed<string[]>(() => {
    const conf = this.config();
    if (!conf || !conf.columns) return [];
    return Object.keys(conf.columns).filter(
      (c: string) => c !== 'loSo' && c !== 'maSoMau' && c !== 'ghiChu' && c !== 'khoiLuong' && c !== 'heSoPhaLoang'
    );
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
            
            // Set initial selected PDF prefix
            if (this.detectedPrefixes().length > 0) {
               this.selectedPdfPrefix.set(this.detectedPrefixes()[0]);
            }

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

  availableReports = computed(() => {
    const d = this.draft();
    if (!d || !d.reports) return [];
    return Object.entries(d.reports).map(([key, value]: [string, any]) => {
      const displayLabel = key === '_NO_PREFIX_' ? 'Không tiền tố' : `Tiền tố ${key}`;
      return {
        key: key === '_NO_PREFIX_' ? '' : key,
        label: displayLabel,
        fileName: value.fileName,
        url: value.pdfViewUrl || value.pdfUrl || null,
        docsUrl: value.docsUrl || null
      };
    });
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
    const activeFilter = this.activeFilter();
    let url: string | null = null;
    const d = this.draft();
    const r = this.run();
    if (!d) return null;

    if (activeFilter === 'ALL') {
      const selected = this.selectedPdfPrefix();
      if (selected !== null && selected !== undefined && d.reports) {
         const reportKey = selected === '' ? '_NO_PREFIX_' : selected;
         if (d.reports[reportKey]) {
           url = d.reports[reportKey].pdfViewUrl || d.reports[reportKey].pdfUrl || null;
         }
      }
      if (!url) {
        // Fallback 1: lấy từ draft gốc
        url = d.pdfViewUrl || (d as any).pdfUrl || null;
        // Fallback 2: lấy từ run.analysisResultSummary (nơi lưu bản PDF mới nhất)
        if (!url && r) {
          url = r.analysisResultSummary?.pdfViewUrl || r.analysisResultSummary?.pdfUrl
             || r.analysisResult?.pdfViewUrl || r.analysisResult?.pdfUrl || null;
        }
        if (!url && d.reports) {
          const prefixes = this.detectedPrefixes();
          if (prefixes.length > 0) {
            const firstReportKey = prefixes[0] === '' ? '_NO_PREFIX_' : prefixes[0];
            if (d.reports[firstReportKey]) {
              url = d.reports[firstReportKey].pdfViewUrl || d.reports[firstReportKey].pdfUrl || null;
            }
          }
        }
      }
    } else {
      const reports = d.reports || {};
      const reportKey = activeFilter === '' ? '_NO_PREFIX_' : activeFilter;
      const reportForFilter = reports[reportKey] || {};
      url = reportForFilter.pdfViewUrl || reportForFilter.pdfUrl || null;
      // Fallback từ run nếu draft.reports chưa được sync
      if (!url && r) {
        const runReports = r.analysisResultSummary?.reports || r.analysisResult?.reports;
        if (runReports && runReports[reportKey]) {
          url = runReports[reportKey].pdfViewUrl || runReports[reportKey].pdfUrl || null;
        }
      }
    }
    return url;
  }


  getCurrentDocsUrl(): string | null {
    const activeFilter = this.activeFilter();
    let url: string | null = null;
    const d = this.draft();
    const r = this.run();
    if (!d) return null;

    if (activeFilter === 'ALL') {
      const selected = this.selectedPdfPrefix();
      if (selected !== null && selected !== undefined && d.reports) {
         const reportKey = selected === '' ? '_NO_PREFIX_' : selected;
         if (d.reports[reportKey]) {
           url = d.reports[reportKey].docsUrl || null;
         }
      }
      if (!url) {
        url = d.docsUrl || null;
        // Fallback từ run.analysisResultSummary
        if (!url && r) {
          url = r.analysisResultSummary?.docsUrl || r.analysisResult?.docsUrl || null;
        }
        if (!url && d.reports) {
          const prefixes = this.detectedPrefixes();
          if (prefixes.length > 0) {
            const firstReportKey = prefixes[0] === '' ? '_NO_PREFIX_' : prefixes[0];
            if (d.reports[firstReportKey]) {
              url = d.reports[firstReportKey].docsUrl || null;
            }
          }
        }
      }
    } else {
      const reports = d.reports || {};
      const reportKey = activeFilter === '' ? '_NO_PREFIX_' : activeFilter;
      const reportForFilter = reports[reportKey] || {};
      url = reportForFilter.docsUrl || null;
      // Fallback từ run nếu draft.reports chưa được sync
      if (!url && r) {
        const runReports = r.analysisResultSummary?.reports || r.analysisResult?.reports;
        if (runReports && runReports[reportKey]) {
          url = runReports[reportKey].docsUrl || null;
        }
      }
    }
    return url ? getSafeGoogleUrl(url, 'doc') : null;
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
      return 'bg-indigo-50 dark:bg-indigo-955/20 text-indigo-700 dark:text-indigo-400 border-indigo-200/40 dark:border-indigo-900/30';
    }
    return 'bg-amber-50 dark:bg-amber-955/20 text-amber-700 dark:text-amber-400 border-amber-200/40 dark:border-amber-900/30';
  }

  convertToDate(timestamp: any): Date | null {
    if (!timestamp) return null;
    if (timestamp instanceof Date) return timestamp;
    if (typeof timestamp.toDate === 'function') return timestamp.toDate();
    if (timestamp.seconds !== undefined) return new Date(timestamp.seconds * 1000);
    if (typeof timestamp === 'string' || typeof timestamp === 'number') return new Date(timestamp);
    return null;
  }

  async takeOverLock() {
    const user = this.auth.currentUser();
    const run = this.run();
    if (!user || !run) return;
    
    const confirmed = confirm(
      `Bạn có chắc chắn muốn giành quyền chỉnh sửa mẻ này?\nThao tác này sẽ chuyển sang màn hình Nhập kết quả. Thao tác này sẽ chuyển màn hình của ${run.lockedByName || 'người khác'} về chế độ Chỉ xem.`
    );
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
      queryParams: this.activeFilter() !== 'ALL' ? { prefix: this.activeFilter() } : {}
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

  generateQrCode() {
    if (typeof QRious === 'undefined' || !this.qrCanvas()) return;
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
    setTimeout(() => {
      if (typeof QRious !== 'undefined' && this.qrModalCanvas()) {
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


