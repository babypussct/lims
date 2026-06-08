import { Component, inject, signal, computed, OnInit, OnDestroy, ElementRef, viewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

declare let QRious: any;
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
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="h-full flex flex-col animate-fade-in bg-slate-50/60 dark:bg-slate-900 p-4 lg:p-6 space-y-4 lg:space-y-5">
      
      <!-- TOP HEADER & METADATA RIBBON -->
      <div class="flex flex-col gap-4 shrink-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-4 lg:px-5 rounded-3xl shadow-sm">
        <!-- Header Row -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <button (click)="goBack()" 
                    class="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all duration-200 active:scale-95 border border-slate-200/50 dark:border-slate-700">
              <i class="fa-solid fa-arrow-left text-sm"></i>
            </button>
            <div>
              <span class="text-[11px] font-bold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider mb-0.5 flex items-center gap-2">
                {{ run() ? run().sopName : 'Đang tải...' }}
                @if (run()?.parentMasterId) {
                  <a [routerLink]="['/results', run().parentMasterId]" class="px-1.5 py-0.5 rounded bg-fuchsia-50 dark:bg-fuchsia-955/20 border border-fuchsia-200 dark:border-fuchsia-900/40 text-fuchsia-600 dark:text-fuchsia-400 text-[9px] font-bold uppercase hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/30 transition-colors flex items-center gap-1 cursor-pointer shadow-sm" title="Mẻ chạy này đã được gộp số liệu. Nhấn để đi tới Master Ảo.">
                    <i class="fa-solid fa-link text-[8px] animate-pulse"></i> Đã gộp Master Ảo
                  </a>
                }
              </span>
              <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 m-0 tracking-tight">
                Chi Tiết Kết Quả Mẻ Phân Tích
              </h3>
            </div>
          </div>

          <!-- Action Buttons -->
          @if (run() && draft()) {
            <div class="flex flex-wrap items-center gap-2">
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

              @if (getCurrentDocsUrl()) {
                <a [href]="getCurrentDocsUrl()" target="_blank" rel="noopener noreferrer"
                   class="px-3 py-2 text-xs font-bold text-blue-655 dark:text-blue-400 bg-blue-50 dark:bg-blue-955/20 border border-blue-100/50 dark:border-blue-800/30 hover:bg-blue-100 dark:hover:bg-blue-950/30 rounded-xl transition flex items-center gap-1.5 no-underline active:scale-95 shadow-sm">
                  <i class="fa-brands fa-google-drive"></i>
                  <span class="hidden md:inline">Mở Docs</span>
                </a>
              }

              @if (getCurrentPdfUrl()) {
                <button (click)="openPdfInModal(getCurrentPdfUrl()!)"
                        class="px-3 py-2 text-xs font-bold text-rose-655 dark:text-rose-455 bg-rose-50 dark:bg-rose-955/20 border border-rose-100/50 dark:border-rose-800/30 hover:bg-rose-100 dark:hover:bg-rose-950/30 rounded-xl transition flex items-center gap-1.5 active:scale-95 shadow-sm" title="Mở modal xem PDF của hệ thống">
                  <i class="fa-solid fa-expand"></i>
                  <span class="hidden md:inline">PDF Toàn màn hình</span>
                </button>
              }

              <button (click)="openQrModal()"
                      class="px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition flex items-center gap-1.5 active:scale-95 shadow-sm">
                <i class="fa-solid fa-qrcode"></i>
                <span class="hidden md:inline">Mã QR</span>
              </button>

              <button (click)="goToEditMode()"
                      class="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-xl shadow-sm transition-all duration-200 active:scale-95 flex items-center gap-2">
                <i class="fa-solid fa-pen-to-square"></i>
                <span>Chỉnh sửa số liệu</span>
              </button>
            </div>
          }
        </div>

        <!-- Metadata Ribbon (Horizontal Data) -->
        @if (run() && draft() && config()) {
          <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-nowrap overflow-x-auto custom-scrollbar gap-4 pb-2">
            
            <!-- Info Cards -->
            <div class="flex items-center gap-2 bg-slate-50/50 dark:bg-slate-800/30 px-3 py-2 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shrink-0">
              <i class="fa-solid fa-barcode text-slate-400"></i>
              <div>
                <span class="block text-[9px] font-semibold text-slate-500 uppercase">Mã mẻ</span>
                <span class="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">{{ run()?.inputs?.['batchCode'] || run()?.id }}</span>
              </div>
            </div>

            <div class="flex items-center gap-2 bg-slate-50/50 dark:bg-slate-800/30 px-3 py-2 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shrink-0">
              <i class="fa-solid fa-microscope text-slate-400"></i>
              <div>
                <span class="block text-[9px] font-semibold text-slate-500 uppercase">Thiết bị</span>
                <span class="font-bold text-xs text-slate-800 dark:text-slate-200">{{ run()?.inputs?.['device'] || run()?.inputs?.['instrument'] || '—' }}</span>
              </div>
            </div>

            <div class="flex items-center gap-2 bg-slate-50/50 dark:bg-slate-800/30 px-3 py-2 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shrink-0">
              <i class="fa-solid fa-user-astronaut text-slate-400"></i>
              <div>
                <span class="block text-[9px] font-semibold text-slate-500 uppercase">Phân tích viên</span>
                <span class="font-bold text-xs text-slate-800 dark:text-slate-200">{{ run()?.user || '—' }}</span>
              </div>
            </div>

            <div class="flex items-center gap-2 bg-slate-50/50 dark:bg-slate-800/30 px-3 py-2 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shrink-0">
              <i class="fa-regular fa-calendar text-slate-400"></i>
              <div>
                <span class="block text-[9px] font-semibold text-slate-500 uppercase">Ngày PT</span>
                <span class="font-bold text-xs text-slate-800 dark:text-slate-200">{{ run()?.analysisDate ? (run()!.analysisDate | date:'dd/MM/yyyy') : '—' }}</span>
              </div>
            </div>

            <!-- Status -->
            <div class="flex items-center gap-2 bg-slate-50/50 dark:bg-slate-800/30 px-3 py-2 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shrink-0">
              <span [class]="getStatusClass()" class="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border">
                <span class="w-1.5 h-1.5 rounded-full" [ngClass]="{
                  'bg-emerald-500': draft()?.status === 'completed',
                  'bg-indigo-500': draft()?.status === 'draft',
                  'bg-amber-500': $any(draft()?.status) === 'pending' || !draft()?.status
                }"></span>
                {{ getStatusText() }}
              </span>
            </div>

            <!-- Horizontal Divider -->
            <div class="w-px bg-slate-200 dark:bg-slate-700 mx-1 shrink-0"></div>

            <!-- QC Flags Horizontal -->
            @if (checkboxList().length > 0) {
              <div class="flex items-center gap-2 shrink-0">
                @for (qc of checkboxList(); track qc.key) {
                  @if (isQcField(qc.key)) {
                    @if (draft()?.page1Data?.[qc.key] === true || draft()?.page1Data?.[qc.key] === 'true') {
                      <div class="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-800/50 rounded-xl" title="{{ qc.label }}">
                        <i class="fa-solid fa-check-circle text-emerald-500 text-xs"></i>
                        <span class="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 max-w-[120px] truncate">{{ qc.label }}</span>
                      </div>
                    } @else if (draft()?.page1Data?.[qc.key] === false || draft()?.page1Data?.[qc.key] === 'false') {
                      <div class="flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-50/80 dark:bg-rose-900/20 border border-rose-200/60 dark:border-rose-800/50 rounded-xl" title="{{ qc.label }}">
                        <i class="fa-solid fa-xmark-circle text-rose-500 text-xs"></i>
                        <span class="text-[10px] font-bold text-rose-700 dark:text-rose-400 max-w-[120px] truncate">{{ qc.label }}</span>
                      </div>
                    }
                  }
                }
              </div>
            }
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
        <div class="flex-1 min-h-0 flex flex-col lg:flex-row gap-5 overflow-hidden">
          
          <!-- LEFT PANE: CHROMATOGRAPHY GRID (approx 55-60%) -->
          <div class="lg:flex-[6] flex flex-col min-h-0 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
            
            <!-- Header of Grid -->
            <div class="px-5 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 shrink-0">
              <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center">
                <i class="fa-solid fa-table-cells mr-2.5 text-indigo-500"></i> Bảng kết quả chạy
              </h4>
              
              <!-- Sample tabs for 3b -->
              @if (config()?.formType === 'type3b') {
                <div class="flex items-center gap-2 overflow-x-auto max-w-[60%] custom-scrollbar">
                  @for (sample of run()?.sampleList; track sample; let idx = $index) {
                    <button (click)="activeSampleCode.set(sample)"
                            [class]="activeSampleCode() === sample
                              ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20 border-transparent'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'"
                            class="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shrink-0 transition-all duration-200">
                      <span class="font-mono">{{ sample }}</span>
                    </button>
                  }
                </div>
              }
            </div>

            <!-- Grid Content -->
            <div class="flex-1 overflow-auto custom-scrollbar p-1">
              @if (config()?.formType === 'type3b') {
                <!-- TYPE 3B Grid -->
                <table class="w-full text-sm border-collapse text-left whitespace-nowrap">
                  <thead>
                    <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/60 sticky top-0 z-10 shadow-sm">
                      <th class="py-3 px-4 text-center font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-16">STT</th>
                      <th class="py-3 px-4 font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">Hoạt chất</th>
                      <th class="py-3 px-4 text-center font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-24">ND (N/A)</th>
                      <th class="py-3 px-4 text-center font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-36">Kết quả (µg/kg)</th>
                      <th class="py-3 px-4 text-center font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-28">QC1</th>
                      <th class="py-3 px-4 text-center font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-28">QC2</th>
                      <th class="py-3 px-4 text-center font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-28">QC3</th>
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
              } @else {
                <!-- TYPE 2 / 3A Grid -->
                <table class="w-full text-sm border-collapse text-left whitespace-nowrap">
                  <thead>
                    <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/60 sticky top-0 z-10 shadow-sm">
                      <th class="py-3.5 px-5 font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-24">Vial No.</th>
                      <th class="py-3.5 px-5 font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider min-w-[160px]">Mẫu thử</th>
                      
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
                        'bg-indigo-50/30 dark:bg-indigo-900/10 font-semibold text-slate-900 dark:text-slate-100': row.isQC
                      }" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        
                        <td class="py-3 px-5 font-mono text-sm text-slate-500 dark:text-slate-400">
                          {{ getRowDataValue(row.key, 'loSo') || '—' }}
                        </td>
                        
                        <td class="py-3 px-5">
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
              }
            </div>
          </div>

          <!-- RIGHT PANE: PDF PREVIEW (approx 40-45%) -->
          <div class="lg:flex-[4] flex flex-col min-h-[400px] lg:min-h-0 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden relative">
            
            <div class="px-5 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 shrink-0 relative z-10">
              <div class="flex items-center gap-3">
                <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center">
                  <i class="fa-solid fa-file-pdf mr-2.5 text-rose-500"></i> Báo cáo PDF
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
              
              @if (safePdfUrl()) {
                <button (click)="openPdfInModal(getCurrentPdfUrl()!)" 
                        class="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition" title="Mở PDF toàn màn hình (Modal hệ thống)">
                  <i class="fa-solid fa-expand"></i>
                </button>
              }
            </div>

            <div class="flex-1 bg-slate-100/50 dark:bg-slate-950/50 flex flex-col relative">
              @if (safePdfUrl()) {
                <iframe [src]="safePdfUrl()" class="w-full h-full border-none absolute inset-0 z-0" allow="autoplay"></iframe>
              } @else {
                <div class="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 p-8 text-center space-y-3 relative z-10">
                  <i class="fa-regular fa-file-pdf text-4xl"></i>
                  <p class="text-sm font-medium">Chưa có báo cáo PDF nào cho tùy chọn này.</p>
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
          <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl scale-in border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-6" (click)="$event.stopPropagation()">
            <div class="text-center space-y-2">
              <h3 class="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">Xác Minh Mẻ Chạy</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 max-w-[280px] mx-auto leading-relaxed">Sử dụng điện thoại để quét hoặc truy cập vào liên kết đối chiếu độc lập của hệ thống LIMS.</p>
            </div>
            
            <div class="bg-white p-4 rounded-2xl shadow-inner border border-slate-200/60">
              <canvas #qrModalCanvas class="w-[240px] h-[240px]"></canvas>
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
      const selected = this.selectedPdfPrefix();
      if (selected && d.reports) {
         const reportKey = selected === '' ? '_NO_PREFIX_' : selected;
         if (d.reports[reportKey]) {
           url = d.reports[reportKey].pdfViewUrl || d.reports[reportKey].pdfUrl || null;
         }
      }
      if (!url) {
        url = d.pdfViewUrl || d.pdfUrl || null;
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

    return list;
  }

  getCurrentPdfUrl(): string | null {
    const activeFilter = this.activeFilter();
    let url: string | null = null;
    const d = this.draft();
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
        url = d.pdfViewUrl || d.pdfUrl || null;
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
    }
    return url;
  }

  getCurrentDocsUrl(): string | null {
    const activeFilter = this.activeFilter();
    let url: string | null = null;
    const d = this.draft();
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


