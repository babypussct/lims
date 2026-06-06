import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StateService } from '../../core/services/state.service';
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
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col fade-in bg-slate-50/30 dark:bg-slate-950/10 p-6 space-y-6">
      
      <!-- STICKY TOP HEADER -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 p-4 rounded-2xl shadow-xs">
        <div class="flex items-center gap-3.5">
          <button (click)="goBack()" 
                  class="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-655 dark:text-slate-400 flex items-center justify-center transition active:scale-95 border border-slate-200/20 dark:border-slate-700/20">
            <i class="fa-solid fa-arrow-left text-sm"></i>
          </button>
          <div>
            <span class="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider block mb-0.5">
              {{ run() ? run().sopName : 'Đang tải...' }}
            </span>
            <h3 class="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 m-0 tracking-tight">
              Chi Tiết Kết Quả Mẻ Phân Tích
            </h3>
          </div>
        </div>

        <!-- ACTION BUTTONS -->
        @if (run() && draft()) {
          <div class="flex flex-wrap items-center gap-2">
            <!-- Filter Prefix selector if multi prefix -->
            @if (detectedPrefixes().length > 1) {
              <div class="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800">
                <button (click)="activeFilter.set('ALL')"
                        [class]="activeFilter() === 'ALL' ? 'px-3 py-1.5 text-[10px] font-black bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-lg shadow-xs' : 'px-3 py-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
                        class="transition duration-150">
                  Tất cả
                </button>
                @for (prefix of detectedPrefixes(); track prefix) {
                  <button (click)="activeFilter.set(prefix)"
                          [class]="activeFilter() === prefix ? 'px-3 py-1.5 text-[10px] font-black bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-lg shadow-xs' : 'px-3 py-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
                          class="transition duration-150">
                    {{ prefix === '' ? 'Không tiền tố' : 'Tiền tố ' + prefix }}
                  </button>
                }
              </div>
            }

            <!-- View raw file or open docs -->
            @if (getCurrentDocsUrl()) {
              <a [href]="getCurrentDocsUrl()" target="_blank" rel="noopener noreferrer"
                 class="px-3.5 py-2 text-xs font-bold text-blue-650 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-800/30 hover:bg-blue-100 dark:hover:bg-blue-950/30 rounded-xl transition flex items-center gap-1.5 no-underline active:scale-95 shadow-3xs">
                <i class="fa-brands fa-google-drive"></i>
                <span class="hidden md:inline">Mở Docs</span>
              </a>
            }

            <!-- PDF Viewer Modal Trigger -->
            @if (getCurrentPdfUrl()) {
              <button (click)="openPdfInModal(getCurrentPdfUrl()!)"
                      class="px-3.5 py-2 text-xs font-bold text-rose-655 dark:text-rose-455 bg-rose-50 dark:bg-rose-955/20 border border-rose-100/50 dark:border-rose-800/30 hover:bg-rose-100 dark:hover:bg-rose-950/30 rounded-xl transition flex items-center gap-1.5 active:scale-95 shadow-3xs">
                <i class="fa-solid fa-file-pdf"></i>
                <span>Xem PDF</span>
              </button>
            }

            <!-- Switch to Edit Mode (If allowed or draft) -->
            <button (click)="goToEditMode()"
                    class="px-4 py-2 text-xs font-black text-white bg-indigo-650 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-xl shadow-xs transition duration-150 active:scale-95 flex items-center gap-1.5">
              <i class="fa-solid fa-pen-to-square"></i>
              <span>Chỉnh sửa số liệu</span>
            </button>
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
        <div class="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
          
          <!-- LEFT PANEL: STATIC DATA VIEW (Scrollable) -->
          <div class="lg:col-span-7 flex flex-col space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            
            <!-- General metadata & status card -->
            <div class="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-xs p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
              <div class="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <span class="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Mã mẻ chạy</span>
                <span class="font-mono font-extrabold text-xs text-slate-800 dark:text-slate-200 select-all block">{{ run()?.inputs?.['batchCode'] || run()?.id }}</span>
              </div>
              <div class="p-3 bg-slate-50 dark:bg-slate-955 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <span class="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Thiết bị đo</span>
                <span class="font-bold text-xs text-slate-700 dark:text-slate-300 block">{{ run()?.inputs?.['device'] || run()?.inputs?.['instrument'] || 'GC-MS/MS / LC-MS/MS' }}</span>
              </div>
              <div class="p-3 bg-slate-50 dark:bg-slate-955 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <span class="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Người phân tích</span>
                <span class="font-bold text-xs text-slate-700 dark:text-slate-300 block">{{ run()?.user || '—' }}</span>
              </div>
              <div class="p-3 bg-slate-50 dark:bg-slate-955 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <span class="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Trạng thái</span>
                <span [class]="getStatusClass()" class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide border mt-0.5">
                  <span class="w-1 h-1 rounded-full" [ngClass]="{
                    'bg-emerald-500': draft()?.status === 'completed',
                    'bg-indigo-500': draft()?.status === 'draft',
                    'bg-amber-500': $any(draft()?.status) === 'pending' || !draft()?.status
                  }"></span>
                  {{ getStatusText() }}
                </span>
              </div>
            </div>

            <!-- QC Checklist Results -->
            @if (checkboxList().length > 0) {
              <div class="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-xs p-5 space-y-4 shrink-0">
                <h4 class="text-xs font-black text-slate-850 dark:text-slate-200 uppercase tracking-wider flex items-center border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <i class="fa-solid fa-square-check mr-2 text-indigo-500"></i> Đánh giá chất lượng mẻ (QC Flags)
                </h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  @for (qc of checkboxList(); track qc.key) {
                    <div class="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-955/20 shadow-2xs">
                      <span class="text-xs font-bold text-slate-700 dark:text-slate-300 pr-2 leading-snug">{{ qc.label }}</span>
                      
                      <!-- Badge representing boolean, string or null status -->
                      @if (draft()?.page1Data?.[qc.key] === true || draft()?.page1Data?.[qc.key] === 'true') {
                        <span class="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/30 rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0">
                          <i class="fa-solid fa-check text-[8px]"></i> Đạt
                        </span>
                      } @else if (draft()?.page1Data?.[qc.key] === false || draft()?.page1Data?.[qc.key] === 'false') {
                        <span class="px-2.5 py-0.5 bg-rose-50 dark:bg-rose-955/20 text-rose-600 dark:text-rose-400 border border-rose-200/30 rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0">
                          <i class="fa-solid fa-xmark text-[8px]"></i> Không đạt
                        </span>
                      } @else {
                        <span class="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200/20 rounded text-[10px] font-bold uppercase tracking-wider shrink-0">
                          N/A
                        </span>
                      }
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Calibration Curve configuration -->
            @if (hasCalibPoints()) {
              <div class="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-xs p-5 space-y-4 shrink-0">
                <h4 class="text-xs font-black text-slate-850 dark:text-slate-200 uppercase tracking-wider flex items-center border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <i class="fa-solid fa-chart-line mr-2 text-indigo-500"></i> Các điểm hiệu chuẩn (Calibration curve points)
                </h4>
                
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  @for (pt of draft()?.page1Data?.['calibPoints']; track $index) {
                    <div class="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-800/80 text-center space-y-1">
                      <span class="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Điểm {{ $index + 1 }}</span>
                      <span class="block font-mono text-xs font-black text-slate-800 dark:text-slate-100">Lọ: {{ pt['loSo'] || '—' }}</span>
                      <span class="block text-[10px] font-bold text-slate-500 dark:text-slate-400">{{ pt['hamLuong'] !== undefined ? pt['hamLuong'] + ' ppb' : (pt['vialNo'] ? 'Vial ' + pt['vialNo'] : '') }}</span>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- CHROMATOGRAPHY DATA SECTION (DYNAMIC ACCORDION FOR TYPE3B OR SPREADSHEET TABLE FOR TYPE2/3A) -->
            @if (config()?.formType === 'type3b') {
              <!-- 3B STYLE: Sample tabs and compounds list -->
              <div class="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-xs p-5 flex-1 min-h-[400px] flex flex-col space-y-4">
                
                <!-- Sample selection horizontal lists -->
                <div class="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-3 border-b border-slate-150 dark:border-slate-800 shrink-0">
                  <span class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest shrink-0">Chọn mẫu:</span>
                  @for (sample of run()?.sampleList; track sample; let idx = $index) {
                    <button (click)="activeSampleCode.set(sample)"
                            [class]="activeSampleCode() === sample
                              ? 'bg-indigo-600 text-white font-extrabold shadow-sm border border-indigo-650'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 hover:bg-slate-100'"
                            class="px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shrink-0 active:scale-95 transition duration-150">
                      <span class="w-3.5 h-3.5 rounded-full bg-white/20 text-[9px] font-black flex items-center justify-center text-white">{{ idx + 1 }}</span>
                      <span class="font-mono font-bold">{{ sample }}</span>
                    </button>
                  }
                </div>

                <!-- Compounds Table for selected sample -->
                <div class="flex-1 overflow-auto custom-scrollbar max-h-[500px]">
                  <table class="w-full text-sm border-collapse text-left">
                    <thead>
                      <tr class="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 shadow-3xs">
                        <th class="py-2.5 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider w-16">STT</th>
                        <th class="py-2.5 px-4 font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">Hoạt chất</th>
                        <th class="py-2.5 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider w-24">ND (KPH)</th>
                        <th class="py-2.5 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider w-36">Kết quả (µg/kg)</th>
                        <th class="py-2.5 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider w-28">QC1</th>
                        <th class="py-2.5 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider w-28">QC2</th>
                        <th class="py-2.5 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider w-28">QC3</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                      @for (comp of config()?.compounds; track comp; let idx = $index) {
                        <tr [ngClass]="{ 'opacity-60 bg-slate-50/20': !isTargetAssigned(activeSampleCode(), comp) }" class="hover:bg-slate-50/40 dark:hover:bg-slate-850/10">
                          <td class="py-2.5 px-4 text-center font-mono text-xs text-slate-400">
                            @if (isTargetAssigned(activeSampleCode(), comp)) { {{ idx + 1 }} } @else { <i class="fa-solid fa-lock text-[9px]"></i> }
                          </td>
                          <td class="py-2.5 px-4 font-extrabold text-xs text-slate-750 dark:text-slate-200">
                            {{ getCompoundDisplayName(comp) }}
                          </td>
                          <td class="py-2.5 px-4 text-center">
                            @if (isTargetAssigned(activeSampleCode(), comp)) {
                              <span [class.text-amber-600]="(draft()?.resultData?.[activeSampleCode()] || {})[comp + '_nd']" class="text-xs">
                                <i class="fa-regular text-sm" [class.fa-square-check]="(draft()?.resultData?.[activeSampleCode()] || {})[comp + '_nd']" [class.fa-square]="!(draft()?.resultData?.[activeSampleCode()] || {})[comp + '_nd']"></i>
                              </span>
                            } @else {
                              <span class="text-slate-300 dark:text-slate-700">—</span>
                            }
                          </td>
                          <td class="py-2.5 px-4 text-center font-mono font-black text-xs text-slate-800 dark:text-slate-200">
                            @if (isTargetAssigned(activeSampleCode(), comp)) {
                              {{ (draft()?.resultData?.[activeSampleCode()] || {})[comp] !== undefined && (draft()?.resultData?.[activeSampleCode()] || {})[comp] !== null ? ((draft()?.resultData?.[activeSampleCode()] || {})[comp] === 'N/A' ? '' : (draft()?.resultData?.[activeSampleCode()] || {})[comp]) : '—' }}
                            } @else {
                              <span class="text-slate-350 dark:text-slate-750 font-normal">N/A</span>
                            }
                          </td>
                          
                          <!-- QC statuses badges -->
                          @for (qcNum of ['1', '2', '3']; track qcNum) {
                            <td class="py-2 px-3 text-center">
                              @if (isTargetAssigned(activeSampleCode(), comp)) {
                                @if ((draft()?.resultData?.[activeSampleCode()] || {})[comp + '_qc' + qcNum] === 'Đạt') {
                                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-250/25">Đạt</span>
                                } @else if ((draft()?.resultData?.[activeSampleCode()] || {})[comp + '_qc' + qcNum] === 'Không đạt') {
                                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-50 dark:bg-rose-955/20 text-rose-600 dark:text-rose-400 border border-rose-250/25">K.Đạt</span>
                                } @else {
                                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-400 border border-slate-200/20">N/A</span>
                                }
                              } @else {
                                <span class="text-slate-300 dark:text-slate-700">—</span>
                              }
                            </td>
                          }
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            } @else {
              <!-- TYPE 2 / 3A STYLE: Spreadsheet static grid -->
              <div class="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-xs p-5 flex-1 min-h-[400px] flex flex-col space-y-4">
                <h4 class="text-xs font-black text-slate-850 dark:text-slate-200 uppercase tracking-wider flex items-center border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <i class="fa-solid fa-table-cells mr-2 text-indigo-500"></i> Bảng kết quả mẻ chạy (Chromatography grid)
                </h4>
                
                <div class="flex-1 overflow-auto custom-scrollbar max-h-[500px]">
                  <table class="w-full text-sm border-collapse text-left">
                    <thead>
                      <tr class="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 shadow-3xs">
                        <th class="py-3 px-4 font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider w-24">Vial No.</th>
                        <th class="py-3 px-4 font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider min-w-[140px]">Mẫu thử</th>
                        
                        <!-- Weight column if present -->
                        @if (hasColumn('khoiLuong')) {
                          <th class="py-3 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider w-24">Khối lượng</th>
                        }
                        <!-- Dilution column if present -->
                        @if (hasColumn('heSoPhaLoang')) {
                          <th class="py-3 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider w-24">Hệ số pha loãng</th>
                        }

                        <!-- Dynamic compounds columns -->
                        @for (col of activeColumns(); track col) {
                          <th class="py-3 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider min-w-[120px]">
                            {{ columnDisplayNames()[col] || col }}
                          </th>
                        }
                        
                        <th class="py-3 px-4 font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider min-w-[160px]">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                      @for (row of getType2DisplayRows(); track row.key) {
                        <tr [ngClass]="{
                          'bg-indigo-50/10 dark:bg-indigo-955/5 font-semibold text-slate-900 dark:text-slate-100': row.isQC
                        }" class="hover:bg-slate-50/40 dark:hover:bg-slate-850/10">
                          
                          <!-- Vial No -->
                          <td class="py-2.5 px-4 font-mono text-xs text-slate-655 dark:text-slate-400">
                            {{ (draft()?.resultData?.[row.key])?.['loSo'] || '—' }}
                          </td>
                          
                          <!-- Sample name -->
                          <td class="py-2.5 px-4">
                            @if (row.isQC) {
                              <span class="inline-flex items-center gap-1.5 text-xs text-indigo-650 dark:text-indigo-400 font-extrabold uppercase tracking-wide">
                                <i class="fa-solid fa-flask text-[10px]"></i> {{ row.label }}
                              </span>
                            } @else {
                              <span class="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 select-all">{{ row.label }}</span>
                            }
                          </td>

                          <!-- Weight -->
                          @if (hasColumn('khoiLuong')) {
                            <td class="py-2.5 px-4 text-center font-mono text-xs text-slate-700 dark:text-slate-300">
                              {{ (draft()?.resultData?.[row.key])?.['khoiLuong'] !== undefined && (draft()?.resultData?.[row.key])?.['khoiLuong'] !== null ? (draft()?.resultData?.[row.key])?.['khoiLuong'] : '—' }}
                            </td>
                          }
                          <!-- Dilution -->
                          @if (hasColumn('heSoPhaLoang')) {
                            <td class="py-2.5 px-4 text-center font-mono text-xs text-slate-700 dark:text-slate-300">
                              {{ (draft()?.resultData?.[row.key])?.['heSoPhaLoang'] !== undefined && (draft()?.resultData?.[row.key])?.['heSoPhaLoang'] !== null ? (draft()?.resultData?.[row.key])?.['heSoPhaLoang'] : '—' }}
                            </td>
                          }

                          <!-- Dynamic values -->
                          @for (col of activeColumns(); track col) {
                            <td class="py-2.5 px-4 text-center font-mono font-black text-xs text-slate-800 dark:text-slate-200">
                              @if (isTargetAssigned(row.key, col)) {
                                {{ (draft()?.resultData?.[row.key])?.[col] !== undefined && (draft()?.resultData?.[row.key])?.[col] !== null ? ((draft()?.resultData?.[row.key])?.[col] === 'N/A' ? '' : (draft()?.resultData?.[row.key])?.[col]) : '—' }}
                              } @else {
                                <span class="text-slate-350 dark:text-slate-750 font-normal">N/A</span>
                              }
                            </td>
                          }

                          <!-- Note -->
                          <td class="py-2.5 px-4 text-slate-500 dark:text-slate-400 text-xs italic">
                            {{ (draft()?.resultData?.[row.key])?.['ghiChu'] || '' }}
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }
          </div>

          <!-- RIGHT PANEL: PDF EMBED PREVIEW -->
          <div class="lg:col-span-5 flex flex-col bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
            <!-- Preview header bar -->
            <div class="px-4 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-800 flex items-center justify-between shrink-0">
              <span class="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <i class="fa-solid fa-file-invoice-dollar text-rose-500"></i> Bản PDF báo cáo chính thức
              </span>
              
              @if (getCurrentPdfUrl()) {
                <a [href]="getCurrentPdfUrl()" target="_blank"
                   class="px-2.5 py-1 text-[10px] font-black text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs transition active:scale-95 flex items-center gap-1 no-underline">
                  <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i> Mở Drive
                </a>
              }
            </div>

            <!-- Embedded iframe container -->
            <div class="flex-1 relative">
              @if (safePdfUrl()) {
                <iframe [src]="safePdfUrl()!" class="absolute inset-0 w-full h-full border-none bg-slate-50 dark:bg-slate-950 shadow-inner"></iframe>
              } @else {
                <!-- EMPTY STATE: Report not printed yet -->
                <div class="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div class="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200/10 flex items-center justify-center text-slate-300 dark:text-slate-655 text-2xl">
                    <i class="fa-solid fa-file-pdf"></i>
                  </div>
                  <div class="max-w-xs space-y-2">
                    <h5 class="text-sm font-extrabold text-slate-800 dark:text-slate-200">Báo cáo chưa được tạo</h5>
                    <p class="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                      Mẻ phân tích này chưa được tạo báo cáo PDF hoàn chỉnh. Vui lòng bấm vào nút dưới đây để chỉnh sửa số liệu và bấm "Tạo & In".
                    </p>
                  </div>
                  <button (click)="goToEditMode()"
                          class="px-4 py-2 bg-indigo-50 hover:bg-indigo-150 text-indigo-650 dark:bg-indigo-955/20 dark:hover:bg-indigo-900/30 dark:text-indigo-400 rounded-xl text-xs font-black transition active:scale-95 duration-100 flex items-center gap-1">
                    <i class="fa-solid fa-pen-to-square text-[10px]"></i>
                    <span>Vào Nhập liệu & Tạo PDF</span>
                  </button>
                </div>
              }
            </div>
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

  requestId = '';
  isLoading = signal(true);

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

  // Safe PDF url calculated from current filter
  safePdfUrl = computed<SafeResourceUrl | null>(() => {
    const activeFilter = this.activeFilter();
    let url: string | null = null;
    const d = this.draft();
    if (!d) return null;

    if (activeFilter === 'ALL') {
      url = d.pdfViewUrl || d.pdfUrl || null;
    } else {
      const reports = d.reports || {};
      const reportKey = activeFilter === '' ? '_NO_PREFIX_' : activeFilter;
      const reportForFilter = reports[reportKey] || {};
      url = reportForFilter.pdfViewUrl || reportForFilter.pdfUrl || null;
    }

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
      map[col] = resolveCompoundDisplayName(map[col], this.masterTargets()) + ' (µg/kg)';
    });

    this.columnDisplayNames.set(map);
  }

  getCompoundDisplayName(compound: string): string {
    return resolveCompoundDisplayName(compound, this.masterTargets());
  }

  isTargetAssigned(sampleCode: string, compound: string): boolean {
    if (!this.run()) return true;
    const targetMap = this.run().sampleTargetMap || (this.run().inputs && this.run().inputs.sampleTargetMap);
    if (!targetMap) return true;
    const assigned = targetMap[sampleCode];
    if (!assigned || assigned.length === 0) return true;
    return isCompoundAssigned(assigned, compound);
  }

  hasColumn(colKey: string): boolean {
    const conf = this.config();
    return !!(conf && conf.columns && conf.columns[colKey] !== undefined);
  }

  hasCalibPoints(): boolean {
    const d = this.draft();
    return !!(d && d.page1Data && d.page1Data['calibPoints'] && d.page1Data['calibPoints'].length > 0);
  }

  getType2DisplayRows(): any[] {
    const d = this.draft();
    const r = this.run();
    const conf = this.config();
    if (!d || !r || !conf) return [];

    const list: any[] = [];
    const activeFilter = this.activeFilter();

    // 1. BLANK QC
    if (d.resultData['QC_BLANK']) {
      list.push({
        key: 'QC_BLANK',
        label: d.page1Data['blankName'] || 'Blank (QC)',
        isQC: true
      });
    }

    // 2. SPIKE QC
    if (d.resultData['QC_SPIKE']) {
      list.push({
        key: 'QC_SPIKE',
        label: d.page1Data['spikeName'] || 'Spike (QC)',
        isQC: true
      });
    }

    // 3. CHECK_SAMPLE QC
    if (d.resultData['QC_CHECK_SAMPLE'] && d.page1Data['hasCheckSample']) {
      list.push({
        key: 'QC_CHECK_SAMPLE',
        label: d.page1Data['checkSampleName'] || 'Check Sample (QC)',
        isQC: true
      });
    }

    // 4. Regular samples (with filtering)
    (r.sampleList || []).forEach((sampleCode: string) => {
      const startsWithLetter = /^[a-zA-Z]/.test(sampleCode);
      const prefix = startsWithLetter ? sampleCode.charAt(0).toUpperCase() : '';
      
      if (activeFilter === 'ALL' || prefix === activeFilter) {
        list.push({
          key: sampleCode,
          label: sampleCode,
          isQC: false
        });
      }
    });

    // 5. FINAL QC
    if (d.resultData['QC_FINAL'] && (d.page1Data['hasFinal'] || conf.id === 'fipronil-chlorpyrifos')) {
      list.push({
        key: 'QC_FINAL',
        label: 'FINAL (QC)',
        isQC: true
      });
    }

    return list;
  }

  getCurrentPdfUrl(): string | null {
    const activeFilter = this.activeFilter();
    let url: string | null = null;
    const d = this.draft();
    if (!d) return null;

    if (activeFilter === 'ALL') {
      url = d.pdfViewUrl || d.pdfUrl || null;
    } else {
      const reports = d.reports || {};
      const reportKey = activeFilter === '' ? '_NO_PREFIX_' : activeFilter;
      const reportForFilter = reports[reportKey] || {};
      url = reportForFilter.pdfViewUrl || reportForFilter.pdfUrl || null;
    }
    return url;
  }

  getCurrentDocsUrl(): string | null {
    const activeFilter = this.activeFilter();
    let url: string | null = null;
    const d = this.draft();
    if (!d) return null;

    if (activeFilter === 'ALL') {
      url = d.docsUrl || null;
    } else {
      const reports = d.reports || {};
      const reportKey = activeFilter === '' ? '_NO_PREFIX_' : activeFilter;
      const reportForFilter = reports[reportKey] || {};
      url = reportForFilter.docsUrl || null;
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

  goToEditMode() {
    this.router.navigate(['/results', this.requestId], {
      queryParams: this.activeFilter() !== 'ALL' ? { prefix: this.activeFilter() } : {}
    });
  }

  goBack() {
    this.router.navigate(['/results-view']);
  }

  private getGoogleDrivePreviewUrl(url: string | null | undefined): string {
    if (!url) return '';
    const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileDMatch && fileDMatch[1]) {
      return `https://drive.google.com/file/d/${fileDMatch[1]}/preview`;
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
