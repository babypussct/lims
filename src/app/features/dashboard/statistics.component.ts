
import { Component, inject, signal, computed, effect, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../core/services/state.service';
import { AuthService } from '../../core/services/auth.service';
import { InventoryService } from '../../features/inventory/inventory.service';
import { formatDate, formatNum, cleanName, getAvatarUrl } from '../../shared/utils/utils';
import { Log } from '../../core/models/log.model';
import { DateRangeFilterComponent } from '../../shared/components/date-range-filter/date-range-filter.component';
import Chart from 'chart.js/auto'; // STANDARD IMPORT

interface NxtReportItem {
  id: string;
  name: string;
  unit: string;
  category: string;
  startStock: number;
  importQty: number;
  exportQty: number;
  endStock: number;
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, FormsModule, DateRangeFilterComponent],
  template: `
    @if (auth.canViewReports()) {
        <div class="h-full flex flex-col space-y-5 pb-6 fade-in overflow-hidden relative font-sans text-slate-800 dark:text-slate-200">
            
            <!-- 1. Header with Filters -->
            <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4 shrink-0 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-[0_4px_20px_rgba(0,0,0,0.03)] z-20">
                <div>
                    <h2 class="text-xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-2 tracking-tight">
                        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
                            <i class="fa-solid fa-chart-pie text-sm"></i>
                        </div>
                        Báo cáo Quản trị
                    </h2>
                    <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 ml-1">Phân tích hiệu suất & tiêu hao theo thời gian thực.</p>
                </div>

                <!-- Filters Area -->
                <div class="flex flex-col md:flex-row gap-3 items-end md:items-center flex-wrap">
                    
                    <!-- SOP Filter -->
                    <div class="relative group min-w-[200px]">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i class="fa-solid fa-filter text-slate-400 dark:text-slate-500 text-xs"></i>
                        </div>
                        <select [ngModel]="selectedSopId()" (ngModelChange)="selectedSopId.set($event)" 
                                class="w-full pl-8 pr-8 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition shadow-sm appearance-none cursor-pointer hover:bg-white dark:hover:bg-slate-800 h-[42px]">
                            <option value="all">Tất cả Quy trình (SOP)</option>
                            @for (sop of state.sops(); track sop.id) {
                                <option [value]="sop.id">{{sop.name}}</option>
                            }
                        </select>
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <i class="fa-solid fa-chevron-down text-slate-400 dark:text-slate-500 text-[10px]"></i>
                        </div>
                    </div>

                    <!-- REPLACED: Date Range Filter Component -->
                    <app-date-range-filter 
                        [initStart]="startDate()" 
                        [initEnd]="endDate()"
                        (dateChange)="onDateRangeChange($event)">
                    </app-date-range-filter>

                </div>
            </div>

            <!-- 2. Detailed Data Tabs -->
            <div class="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div class="flex border-b border-slate-100 dark:border-slate-700 px-6 pt-4 shrink-0 gap-8 bg-white dark:bg-slate-800 overflow-x-auto">
                <button (click)="activeTab.set('logs')" 
                    class="pb-3 text-xs font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide whitespace-nowrap active:scale-95"
                    [class]="activeTab() === 'logs' ? 'border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'">
                    <i class="fa-solid fa-clock-rotate-left"></i> 1. Nhật ký Hoạt động
                </button>
                <button (click)="activeTab.set('nxt')" 
                    class="pb-3 text-xs font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide whitespace-nowrap active:scale-95"
                    [class]="activeTab() === 'nxt' ? 'border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'">
                    @if (selectedSopId() === 'all') {
                        <i class="fa-solid fa-boxes-packing"></i> 2. Báo cáo NXT (Kho)
                    } @else {
                        <i class="fa-solid fa-list-check"></i> 2. Chi tiết Xuất kho
                    }
                </button>
                <button (click)="activeTab.set('consumption')"
                    class="pb-3 text-xs font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide whitespace-nowrap active:scale-95"
                    [class]="activeTab() === 'consumption' ? 'border-orange-600 dark:border-orange-500 text-orange-700 dark:text-orange-400' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'">
                    <i class="fa-solid fa-flask"></i> 3. Tiêu hao & Biểu đồ
                </button>
                <button (click)="activeTab.set('sops')"
                    class="pb-3 text-xs font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide whitespace-nowrap active:scale-95"
                    [class]="activeTab() === 'sops' ? 'border-purple-600 dark:border-purple-500 text-purple-700 dark:text-purple-400' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'">
                    <i class="fa-solid fa-list-ol"></i> 4. Tần suất SOP
                </button>
                <button (click)="activeTab.set('standards')"
                    class="pb-3 text-xs font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide whitespace-nowrap active:scale-95"
                    [class]="activeTab() === 'standards' ? 'border-pink-600 dark:border-pink-500 text-pink-700 dark:text-pink-400' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'">
                        <i class="fa-solid fa-heart-pulse"></i> 5. Sức khỏe & Truy xuất
                    </button>
                    <div class="ml-auto pr-6 flex items-center gap-2">
                         <button (click)="openGlobalExport()" 
                                 class="px-4 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-wider transition shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center gap-2">
                            <i class="fa-solid fa-file-export"></i> Xuất Báo cáo Tổng hợp
                        </button>
                    </div>
                </div>

                <div class="flex-1 overflow-y-auto p-0 relative bg-white dark:bg-slate-800 custom-scrollbar h-full">
                    
                    <!-- TAB 1: LOGS -->
                    @if (activeTab() === 'logs') {
                        <table class="w-full text-sm text-left">
                            <thead class="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50/50 dark:bg-slate-800/50 sticky top-0 backdrop-blur-sm z-10 border-b border-slate-100 dark:border-slate-700">
                                <tr>
                                    <th class="px-6 py-3 font-bold">Ngày/Giờ</th>
                                    <th class="px-6 py-3 font-bold">Hoạt động</th>
                                    <th class="px-6 py-3 font-bold">Chi tiết</th>
                                    <th class="px-6 py-3 font-bold">Người thực hiện</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-50 dark:divide-slate-700/50">
                                @for (log of filteredLogs(); track log.id) {
                                    <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition group">
                                        <td class="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-xs whitespace-nowrap">
                                            {{formatDate(log.timestamp)}}
                                        </td>
                                        <td class="px-6 py-4">
                                            <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border"
                                                [ngClass]="{
                                                    'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800': log.action.includes('APPROVE'),
                                                    'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800': log.action.includes('STOCK_IN') || log.action.includes('UPDATE') || log.action.includes('CREATE') || log.action.includes('RETURN_STANDARD'),
                                                    'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800': log.action.includes('STOCK_OUT') || log.action.includes('REQUEST_STANDARD') || log.action.includes('ASSIGN_STANDARD'),
                                                    'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800': log.action.includes('DELETE') || log.action.includes('REVOKE') || log.action.includes('REJECT')
                                                }">
                                                {{getLogActionText(log.action)}}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 text-slate-700 dark:text-slate-300 text-xs font-medium max-w-xs truncate" [title]="log.details">
                                            {{log.details}}
                                        </td>
                                        <td class="px-6 py-4">
                                            <div class="flex items-center gap-2">
                                                <img [src]="getAvatarUrl(log.user)" class="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 object-cover">
                                                <span class="text-slate-600 dark:text-slate-300 font-medium text-xs">{{log.user}}</span>
                                            </div>
                                        </td>
                                    </tr>
                                } @empty {
                                    <tr><td colspan="4" class="p-12 text-center text-slate-400 dark:text-slate-500 italic">Không có dữ liệu trong khoảng thời gian này.</td></tr>
                                }
                            </tbody>
                        </table>
                    }

                    <!-- TAB 2: NXT / SOP EXPORT DETAIL -->
                    @if (activeTab() === 'nxt') {
                        <div class="flex flex-col h-full">
                            <div class="p-4 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center shrink-0">
                                <div>
                                    @if (selectedSopId() === 'all') {
                                        <h3 class="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                            <i class="fa-solid fa-table"></i> Bảng Kê Nhập - Xuất - Tồn
                                        </h3>
                                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Dữ liệu toàn cục của kho (theo ngày thực tế).</p>
                                    } @else {
                                        <h3 class="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                            <i class="fa-solid fa-list-check"></i> Chi tiết Xuất kho theo Quy trình
                                        </h3>
                                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Chỉ hiển thị lượng hóa chất đã xuất cho SOP: <span class="font-bold text-blue-600 dark:text-blue-400">{{getSelectedSopName()}}</span></p>
                                    }
                                </div>
                                <div class="flex gap-2">
                                    <button (click)="generateNxtReport()" [disabled]="isLoading()" 
                                            class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-bold transition shadow-sm flex items-center gap-2 disabled:opacity-50 active:scale-95">
                                        <i class="fa-solid fa-calculator" [class.fa-spin]="isLoading()"></i> Tính Toán
                                    </button>
                                    <button (click)="exportNxtExcel()" [disabled]="nxtData().length === 0"
                                            class="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-bold transition shadow-sm flex items-center gap-2 disabled:opacity-50 active:scale-95">
                                        <i class="fa-solid fa-file-excel"></i> Xuất Excel
                                    </button>
                                </div>
                            </div>

                            <div class="flex-1 overflow-auto relative">
                                @if(isLoading()) {
                                    <div class="absolute inset-0 bg-white/80 dark:bg-slate-900/80 z-10 flex items-center justify-center flex-col gap-3">
                                        <div class="w-10 h-10 border-4 border-slate-200 dark:border-slate-700 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
                                        <span class="text-sm font-bold text-slate-600 dark:text-slate-300">Đang tải và tổng hợp dữ liệu...</span>
                                    </div>
                                }

                                <table class="w-full text-sm text-left border-collapse">
                                    <thead class="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800 sticky top-0 z-10 shadow-sm">
                                        <tr>
                                            <th class="px-4 py-3 border-b dark:border-slate-700 text-center w-10">#</th>
                                            <th class="px-4 py-3 border-b dark:border-slate-700">Tên Hóa chất / Vật tư</th>
                                            <th class="px-4 py-3 border-b dark:border-slate-700 w-24 text-center">ĐVT</th>
                                            @if (selectedSopId() === 'all') {
                                                <th class="px-4 py-3 border-b dark:border-slate-700 text-right bg-blue-50/30 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">Tồn Đầu</th>
                                                <th class="px-4 py-3 border-b dark:border-slate-700 text-right text-emerald-700 dark:text-emerald-400">Nhập</th>
                                                <th class="px-4 py-3 border-b dark:border-slate-700 text-right text-orange-700 dark:text-orange-400">Xuất</th>
                                                <th class="px-4 py-3 border-b dark:border-slate-700 text-right bg-purple-50/30 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 font-bold border-l border-slate-100 dark:border-slate-700">Tồn Cuối</th>
                                            } @else {
                                                <th class="px-4 py-3 border-b dark:border-slate-700 text-right text-orange-700 dark:text-orange-400 font-bold bg-orange-50/20 dark:bg-orange-900/20">Tổng Xuất ({{getSelectedSopName()}})</th>
                                            }
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                                        @for (row of nxtData(); track row.id; let i = $index) {
                                            <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                                                <td class="px-4 py-3 text-center text-xs text-slate-400 dark:text-slate-500">{{i+1}}</td>
                                                <td class="px-4 py-3">
                                                    <div class="font-bold text-slate-700 dark:text-slate-300 text-xs">{{row.name}}</div>
                                                    <div class="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{{row.id}}</div>
                                                </td>
                                                <td class="px-4 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400">{{row.unit}}</td>
                                                
                                                @if (selectedSopId() === 'all') {
                                                    <td class="px-4 py-3 text-right bg-blue-50/10 dark:bg-blue-900/10 font-mono text-slate-600 dark:text-slate-300">{{formatNum(row.startStock)}}</td>
                                                    <td class="px-4 py-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">{{row.importQty > 0 ? '+' : ''}}{{formatNum(row.importQty)}}</td>
                                                    <td class="px-4 py-3 text-right font-mono text-orange-600 dark:text-orange-400 font-bold">{{row.exportQty > 0 ? '-' : ''}}{{formatNum(row.exportQty)}}</td>
                                                    <td class="px-4 py-3 text-right bg-purple-50/10 dark:bg-purple-900/10 font-mono font-black text-slate-800 dark:text-slate-200 border-l border-slate-100 dark:border-slate-700">{{formatNum(row.endStock)}}</td>
                                                } @else {
                                                    <td class="px-4 py-3 text-right font-mono text-orange-600 dark:text-orange-400 font-bold text-base">{{formatNum(row.exportQty)}}</td>
                                                }
                                            </tr>
                                        } @empty {
                                            <tr><td [attr.colspan]="selectedSopId() === 'all' ? 7 : 4" class="p-16 text-center text-slate-400 dark:text-slate-500 italic">
                                                @if(!hasGenerated()) { Nhấn "Tính Toán" để xem báo cáo. } 
                                                @else { Không có dữ liệu. }
                                            </td></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }

                    <!-- TAB 3: CONSUMPTION DASHBOARD -->
                    @if (activeTab() === 'consumption') {
                        <div class="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 gap-4 p-5 overflow-y-auto custom-scrollbar">
                            <!-- Chart Grid -->
                            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 shrink-0 h-[300px]">
                                <!-- Chart 1: Top 15 (Bar) -->
                                <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm flex flex-col">
                                    <div class="flex justify-between items-center mb-4">
                                        <h4 class="text-[10px] uppercase font-black text-slate-400 tracking-widest"><i class="fa-solid fa-ranking-star mr-2"></i>Top 15 Tiêu hao</h4>
                                    </div>
                                    <div class="flex-1 relative min-h-0">
                                        <canvas #barChartCanvas></canvas>
                                    </div>
                                </div>
                                <!-- Chart 2: Category Dist (Pie) -->
                                <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm flex flex-col">
                                    <div class="flex justify-between items-center mb-4">
                                        <h4 class="text-[10px] uppercase font-black text-slate-400 tracking-widest"><i class="fa-solid fa-chart-pie mr-2"></i>Phân loại</h4>
                                    </div>
                                    <div class="flex-1 relative min-h-0">
                                        <canvas #pieChartCanvas></canvas>
                                    </div>
                                </div>
                                <!-- Chart 3: Trend (Line) -->
                                <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm flex flex-col">
                                    <div class="flex justify-between items-center mb-4">
                                        <h4 class="text-[10px] uppercase font-black text-slate-400 tracking-widest"><i class="fa-solid fa-arrow-trend-up mr-2"></i>Xu thế Tiêu hao</h4>
                                    </div>
                                    <div class="flex-1 relative min-h-0">
                                        <canvas #lineChartCanvas></canvas>
                                    </div>
                                </div>
                            </div> <!-- Close Grid (Line 249) -->
                            
                            <!-- Detailed Table -->
                            <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col shrink-0">
                                <div class="px-6 py-4 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center shrink-0">
                                    <h4 class="text-xs font-black text-slate-700 dark:text-slate-200">Chi tiết Lượng sử dụng</h4>
                                    <button (click)="exportConsumptionExcel()" 
                                            class="px-4 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2">
                                        <i class="fa-solid fa-file-excel"></i> Xuất Dữ liệu này
                                    </button>
                                </div>
                                <div class="overflow-x-auto">
                                <table class="w-full text-sm text-left">
                                    <thead class="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50/80 dark:bg-slate-800/80 sticky top-0 backdrop-blur-sm z-10">
                                        <tr>
                                            <th class="px-6 py-3 border-b dark:border-slate-700 w-12 text-center">#</th>
                                            <th class="px-6 py-3 border-b dark:border-slate-700">Tên Hóa chất / Vật tư</th>
                                            <th class="px-6 py-3 border-b dark:border-slate-700 text-right">Tổng lượng dùng</th>
                                            <th class="px-6 py-3 border-b dark:border-slate-700 text-center w-32">Đơn vị</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-50 dark:divide-slate-700/50">
                                        @for (item of consumptionData(); track item.name; let i = $index) {
                                            <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                                                <td class="px-6 py-3 text-center text-xs font-bold text-slate-400 dark:text-slate-500">{{i+1}}</td>
                                                <td class="px-6 py-3 font-semibold text-slate-700 dark:text-slate-300">
                                                    {{item.displayName}}
                                                    @if(item.name !== item.displayName) {
                                                        <span class="text-[10px] text-slate-400 dark:text-slate-500 font-mono ml-1">({{item.name}})</span>
                                                    }
                                                </td>
                                                <td class="px-6 py-3 text-right font-bold text-slate-800 dark:text-slate-200 font-mono text-base">{{formatNum(item.amount)}}</td>
                                                <td class="px-6 py-3 text-center">
                                                    <span [class]="getUnitClass(item.unit)" class="px-3 py-1 rounded-full text-[10px] font-bold border uppercase inline-block shadow-sm">{{item.unit}}</span>
                                                </td>
                                            </tr>
                                        } @empty {
                                            <tr><td colspan="4" class="p-12 text-center text-slate-400 dark:text-slate-500 italic">Chưa có dữ liệu tiêu hao cho tiêu chí lọc này.</td></tr>
                                        }
                                    </tbody>
                                </table>
                                </div> <!-- Close horizontal scroll (Line 288) -->
                            </div> <!-- Close Table container (Line 280) -->
                        </div> <!-- Close Tab container (Line 247) -->
                    }

                    <!-- TAB 4: SOP FREQUENCY -->
                    @if (activeTab() === 'sops') {
                        <div class="flex flex-col h-full">
                            <div class="p-4 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center shrink-0">
                                <h3 class="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                    <i class="fa-solid fa-list-ol"></i> Thống kê Tần suất Quy trình
                                </h3>
                                <button (click)="exportSopFrequencyExcel()" [disabled]="sopFrequencyData().length === 0"
                                        class="px-4 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2">
                                    <i class="fa-solid fa-file-excel"></i> Xuất Excel
                                </button>
                            </div>
                            <div class="flex-1 overflow-y-auto custom-scrollbar">
                                <table class="w-full text-sm text-left">
                                    <thead class="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50/80 dark:bg-slate-800/80 sticky top-0 backdrop-blur-sm z-10 border-b border-slate-100 dark:border-slate-700">
                                <tr>
                                    <th class="px-6 py-3">Quy trình (SOP)</th>
                                    <th class="px-6 py-3 text-center">Số lần chạy (Runs)</th>
                                    <th class="px-6 py-3 text-center text-blue-700 dark:text-blue-400">Tổng Mẫu</th>
                                    <th class="px-6 py-3 text-center text-purple-700 dark:text-purple-400">Tổng QC</th>
                                    <th class="px-6 py-3 text-right w-48">Tỷ trọng</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-50 dark:divide-slate-700/50">
                                @for (item of sopFrequencyData(); track item.name) {
                                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                                        <td class="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">{{item.name}}</td>
                                        <td class="px-6 py-4 text-center font-bold text-slate-800 dark:text-slate-200 text-lg">{{item.count}}</td>
                                        <td class="px-6 py-4 text-center"><span class="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">{{item.samples}}</span></td>
                                        <td class="px-6 py-4 text-center"><span class="font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-md">{{item.qcs}}</span></td>
                                        <td class="px-6 py-4 text-right align-middle">
                                        <div class="flex items-center gap-3 justify-end w-full">
                                            <div class="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden shadow-inner max-w-[100px]">
                                                <div class="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full" [style.width.%]="item.percent"></div>
                                            </div>
                                            <span class="text-xs font-bold text-slate-500 dark:text-slate-400 w-10 text-right">{{formatNum(item.percent)}}%</span>
                                        </div>
                                        </td>
                                    </tr>
                                } @empty {
                                    <tr><td colspan="5" class="p-12 text-center text-slate-400 dark:text-slate-500 italic">Chưa chạy quy trình nào trong thời gian này.</td></tr>
                                }
                                </table>
                            </div>
                        </div>
                    }

                    <!-- TAB 5: TRACEABILITY & HEALTH DASHBOARD -->
                    @if (activeTab() === 'standards') {
                        <div class="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 gap-4 p-5 overflow-y-auto custom-scrollbar">
                            <!-- Health Status Cards -->
                            <!-- Health Status Cards -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
                                <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
                                    <div>
                                        <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Đang mượn / Sử dụng</div>
                                        <div class="text-3xl font-black text-blue-600 dark:text-blue-400">{{healthStats().borrowing}}</div>
                                        <p class="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tight">Chuẩn đang lưu động ngoài kho</p>
                                    </div>
                                    <div class="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center text-3xl shadow-inner"><i class="fa-solid fa-flask-vial"></i></div>
                                </div>
                                <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
                                    <div>
                                        <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cảnh báo Quá hạn trả</div>
                                        <div class="text-3xl font-black text-red-600 dark:text-red-400">{{healthStats().overdue}}</div>
                                        <p class="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-tight">Cần thu hồi ngay lập tức</p>
                                    </div>
                                    <div class="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center text-3xl shadow-inner animate-pulse"><i class="fa-solid fa-clock-rotate-left"></i></div>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
                                <!-- Recent Critical Events (Traceability Trail) -->
                                <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col min-h-0">
                                    <div class="px-6 py-4 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center shrink-0">
                                        <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Truy xuất Hoạt động Trọng yếu</h4>
                                    </div>
                                    <div class="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                        <div class="space-y-3">
                                            @for(log of criticalLogs(); track log.id) {
                                                <div class="flex gap-4 p-3 rounded-2xl border border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                                                    <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-indigo-500 shrink-0">
                                                        <i [class]="getLogActionIcon(log.action)"></i>
                                                    </div>
                                                    <div>
                                                        <div class="text-xs font-black text-slate-700 dark:text-slate-200">{{log.details}}</div>
                                                        <div class="flex items-center gap-2 mt-1">
                                                            <span class="text-[10px] font-bold text-slate-400">{{formatDate(log.timestamp)}}</span>
                                                            <span class="text-slate-300">•</span>
                                                            <span class="text-[10px] font-black text-indigo-500">{{log.user}}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>

                                <!-- Overdue Return List -->
                                <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col min-h-0">
                                    <div class="px-6 py-4 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center shrink-0">
                                        <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cảnh báo Quá hạn mượn chuẩn</h4>
                                    </div>
                                    <div class="flex-1 overflow-y-auto p-0">
                                        <table class="w-full text-left text-xs">
                                            <thead class="bg-slate-50/50 dark:bg-slate-900/50 text-[10px] font-black text-slate-400 uppercase tracking-widest sticky top-0 border-b border-slate-50 dark:border-slate-800">
                                                <tr>
                                                    <th class="px-4 py-3">Người mượn</th>
                                                    <th class="px-4 py-3">Chuẩn / Tên</th>
                                                    <th class="px-4 py-3 text-right">Ngày trả</th>
                                                </tr>
                                            </thead>
                                            <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
                                                @for (req of overdueRequests(); track req.id) {
                                                    <tr class="hover:bg-red-50/20 dark:hover:bg-red-900/10 transition">
                                                        <td class="px-4 py-3 font-black text-slate-700 dark:text-slate-300">{{req.requestedByName}}</td>
                                                        <td class="px-4 py-3">
                                                            <div class="font-bold truncate max-w-[150px]">{{req.standardName}}</div>
                                                            <div class="text-[9px] text-slate-400">LOT: {{req.lotNumber}}</div>
                                                        </td>
                                                        <td class="px-4 py-3 text-right text-red-600 font-black">{{req.expectedReturnDate | date:'dd/MM/yyyy'}}</td>
                                                    </tr>
                                                } @empty {
                                                    <tr><td colspan="3" class="px-4 py-12 text-center text-slate-400 italic">Không có cảnh báo quá hạn.</td></tr>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>

        <!-- EXPORT MODAL -->
        @if (showExportModal()) {
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
                    <div class="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                        <h3 class="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <i class="fa-solid fa-file-export text-emerald-500"></i> Tùy chọn Xuất Dữ liệu
                        </h3>
                        <button (click)="showExportModal.set(false)" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition">
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </div>
                    <div class="p-6 space-y-4">
                        <div class="space-y-3">
                            <label class="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                                   [ngClass]="{'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800': exportType() === 'summary'}">
                                <input type="radio" name="exportType" value="summary" [ngModel]="exportType()" (ngModelChange)="exportType.set($event)" class="w-4 h-4 text-emerald-600 focus:ring-emerald-500">
                                <div>
                                    <div class="text-sm font-bold text-slate-700 dark:text-slate-200">Tổng hợp (Mặc định)</div>
                                    <div class="text-xs text-slate-500 dark:text-slate-400">Tổng lượng tiêu hao trong khoảng thời gian đã chọn.</div>
                                </div>
                            </label>
                            
                            <label class="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                                   [ngClass]="{'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800': exportType() === 'daily'}">
                                <input type="radio" name="exportType" value="daily" [ngModel]="exportType()" (ngModelChange)="exportType.set($event)" class="w-4 h-4 text-emerald-600 focus:ring-emerald-500">
                                <div>
                                    <div class="text-sm font-bold text-slate-700 dark:text-slate-200">Phân bổ theo từng ngày</div>
                                    <div class="text-xs text-slate-500 dark:text-slate-400">Chi tiết lượng dùng mỗi ngày (Cột là các ngày).</div>
                                </div>
                            </label>

                            <label class="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                                   [ngClass]="{'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800': exportType() === 'monthly'}">
                                <input type="radio" name="exportType" value="monthly" [ngModel]="exportType()" (ngModelChange)="exportType.set($event)" class="w-4 h-4 text-emerald-600 focus:ring-emerald-500">
                                <div>
                                    <div class="text-sm font-bold text-slate-700 dark:text-slate-200">Phân bổ theo từng tháng</div>
                                    <div class="text-xs text-slate-500 dark:text-slate-400">Chi tiết lượng dùng mỗi tháng (Cột là các tháng).</div>
                                </div>
                            </label>

                            <label class="flex flex-col gap-2 p-3 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                                   [ngClass]="{'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800': exportType() === 'specific_day'}">
                                <div class="flex items-center gap-3">
                                    <input type="radio" name="exportType" value="specific_day" [ngModel]="exportType()" (ngModelChange)="exportType.set($event)" class="w-4 h-4 text-emerald-600 focus:ring-emerald-500">
                                    <div>
                                        <div class="text-sm font-bold text-slate-700 dark:text-slate-200">Lọc theo ngày cụ thể trong tháng</div>
                                        <div class="text-xs text-slate-500 dark:text-slate-400">Chỉ tính tổng các ngày được chọn (VD: Ngày 1 hàng tháng).</div>
                                    </div>
                                </div>
                                @if (exportType() === 'specific_day') {
                                    <div class="ml-7 mt-2 flex items-center gap-2 animate-slide-up">
                                        <span class="text-xs font-bold text-slate-600 dark:text-slate-300">Chọn ngày:</span>
                                        <input type="number" min="1" max="31" [ngModel]="specificDay()" (ngModelChange)="specificDay.set($event)" class="w-16 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm text-center outline-none focus:border-emerald-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                                    </div>
                                }
                            </label>
                            
                            <hr class="border-slate-200 dark:border-slate-700 my-2">
                            
                            <label class="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                                   [ngClass]="{'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800': excludeMargin()}">
                                <input type="checkbox" [ngModel]="excludeMargin()" (ngModelChange)="excludeMargin.set($event)" class="w-4 h-4 text-amber-600 focus:ring-amber-500 rounded">
                                <div>
                                    <div class="text-sm font-bold text-slate-700 dark:text-slate-200">Bỏ qua Quy định Hao hụt (Safety Margin)</div>
                                    <div class="text-xs text-slate-500 dark:text-slate-400">Xuất số liệu gốc theo SOP, không cộng thêm phần hao hụt.</div>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div class="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex gap-3 justify-end">
                        <button (click)="showExportModal.set(false)" class="px-4 py-2 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition">Hủy</button>
                        <button (click)="exportConsumptionExcel()" class="px-6 py-2 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200 dark:shadow-none transition flex items-center gap-2">
                            <i class="fa-solid fa-download"></i> Tải xuống
                        </button>
                    </div>
                </div>
            </div>
        }
    } @else {
        <div class="h-full flex items-center justify-center fade-in">
            <div class="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-red-100 dark:border-red-900/30 max-w-md text-center">
                <div class="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    <i class="fa-solid fa-lock"></i>
                </div>
                <h3 class="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Quyền truy cập bị từ chối</h3>
                <p class="text-slate-500 dark:text-slate-400 text-sm mb-6">Bạn không có quyền xem Báo cáo Quản trị. Vui lòng liên hệ Quản lý (Manager) để được cấp quyền.</p>
                <div class="text-xs font-mono bg-slate-100 dark:bg-slate-700 p-2 rounded text-slate-600 dark:text-slate-300">
                    Required Permission: <b>REPORT_VIEW</b>
                </div>
            </div>
        </div>
    }

    <!-- GLOBAL EXPORT MODAL -->
    @if (showGlobalExportModal()) {
        <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in border border-slate-200 dark:border-slate-700">
                <div class="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-indigo-50/30 dark:bg-indigo-900/10">
                    <div>
                        <h3 class="font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 text-lg">
                            <i class="fa-solid fa-file-export text-indigo-600"></i> Xuất Báo cáo Tổng hợp
                        </h3>
                        <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Thời gian: {{startDate()}} -> {{endDate()}}</p>
                    </div>
                    <button (click)="showGlobalExportModal.set(false)" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition">
                        <i class="fa-solid fa-times"></i>
                    </button>
                </div>
                
                <div class="p-8 space-y-6">
                    <p class="text-sm text-slate-600 dark:text-slate-400 font-medium">Chọn các loại dữ liệu bạn muốn xuất vào bộ báo cáo:</p>
                    
                    <div class="grid grid-cols-1 gap-3">
                        <label class="flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition group"
                               [class]="exportInventory() ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-indigo-300'">
                            <input type="checkbox" [ngModel]="exportInventory()" (ngModelChange)="exportInventory.set($event)" class="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500">
                            <div class="flex-1">
                                <div class="text-sm font-black text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 transition">1. Báo cáo Nhập - Xuất - Tồn (NXT)</div>
                                <div class="text-[11px] text-slate-500">Dữ liệu biến động kho chi tiết từng mặt hàng.</div>
                            </div>
                        </label>

                        <label class="flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition group"
                               [class]="exportConsumption() ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-indigo-300'">
                            <input type="checkbox" [ngModel]="exportConsumption()" (ngModelChange)="exportConsumption.set($event)" class="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500">
                            <div class="flex-1">
                                <div class="text-sm font-black text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 transition">2. Dữ liệu Tiêu hao Hóa chất</div>
                                <div class="text-[11px] text-slate-500">Tổng hợp lượng dùng dựa trên phiếu đã duyệt.</div>
                            </div>
                        </label>

                        <label class="flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition group"
                               [class]="exportSop() ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-indigo-300'">
                            <input type="checkbox" [ngModel]="exportSop()" (ngModelChange)="exportSop.set($event)" class="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500">
                            <div class="flex-1">
                                <div class="text-sm font-black text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 transition">3. Tần suất Quy trình (SOP)</div>
                                <div class="text-[11px] text-slate-500">Thống kê số lần chạy, mẫu và QC của từng SOP.</div>
                            </div>
                        </label>

                        <label class="flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition group"
                               [class]="exportLogs() ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-indigo-300'">
                            <input type="checkbox" [ngModel]="exportLogs()" (ngModelChange)="exportLogs.set($event)" class="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500">
                            <div class="flex-1">
                                <div class="text-sm font-black text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 transition">4. Nhật ký Hoạt động (Audit Log)</div>
                                <div class="text-[11px] text-slate-500">Danh sách toàn bộ thao tác trong khoảng thời gian.</div>
                            </div>
                        </label>
                    </div>
                </div>

                <div class="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex gap-3 justify-end">
                    <button (click)="showGlobalExportModal.set(false)" class="px-5 py-2.5 rounded-2xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition">Đóng</button>
                    <button (click)="runGlobalExport()" 
                            [disabled]="isLoading() || (!exportInventory() && !exportConsumption() && !exportSop() && !exportLogs())"
                            class="px-8 py-2.5 rounded-2xl font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none transition flex items-center gap-2 disabled:opacity-50 active:scale-95">
                        @if (isLoading()) {
                            <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        } @else {
                            <i class="fa-solid fa-cloud-arrow-down"></i>
                        } 
                        Bắt đầu Xuất File
                    </button>
                </div>
            </div>
        </div>
    }
  `
})
export class StatisticsComponent {
  state = inject(StateService);
  auth = inject(AuthService); 
  invService = inject(InventoryService);
  formatDate = formatDate;
  formatNum = formatNum;
  cleanName = cleanName;
  getAvatarUrl = getAvatarUrl;
  
  getLogActionText(action: string): string {
      if (action === 'REQUEST_STANDARD' || action === 'CREATE_STANDARD_REQUEST') return 'Yêu cầu mượn chuẩn';
      if (action === 'APPROVE_STANDARD_REQUEST') return 'Duyệt mượn chuẩn';
      if (action === 'REJECT_STANDARD_REQUEST') return 'Từ chối mượn chuẩn';
      if (action === 'REPORT_RETURN_STANDARD') return 'Báo cáo trả chuẩn';
      if (action === 'RETURN_STANDARD') return 'Nhận lại chuẩn';
      if (action === 'ASSIGN_STANDARD') return 'Gán chuẩn cho mượn';
      
      if (action.includes('APPROVE')) return 'Duyệt yêu cầu'; 
      if (action.includes('STOCK_IN')) return 'Nhập kho';
      if (action.includes('STOCK_OUT')) return 'Xuất kho'; 
      if (action.includes('CREATE')) return 'Tạo mới';
      if (action.includes('DELETE')) return 'Xóa'; 
      return 'Cập nhật';
  }

  activeTab = signal<'logs' | 'consumption' | 'sops' | 'nxt' | 'standards'>('logs');
  
  startDate = signal<string>(this.getFirstDayOfMonth());
  endDate = signal<string>(this.getToday());
  selectedSopId = signal<string>('all'); 

  barChartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('barChartCanvas');
  pieChartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('pieChartCanvas');
  lineChartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('lineChartCanvas');
  private barChart: any = null;
  private pieChart: any = null;
  private lineChart: any = null;

  isLoading = signal(false);
  hasGenerated = signal(false);
  nxtData = signal<NxtReportItem[]>([]);

  showGlobalExportModal = signal(false);
  exportInventory = signal(true);
  exportConsumption = signal(true);
  exportSop = signal(true);
  exportLogs = signal(false);

  openGlobalExport() {
      this.showGlobalExportModal.set(true);
  }

  async runGlobalExport() {
      this.isLoading.set(true);
      try {
          const XLSX = await import('xlsx');
          const wb = XLSX.utils.book_new();
          const start = this.startDate();
          const end = this.endDate();
          const currentUser = this.auth.currentUser();
          const exportInfo = [
            ["BÁO CÁO TỔNG HỢP HỆ THỐNG LIMS"],
            [`Thời gian: ${start} đến ${end}`],
            [`Người xuất: ${currentUser?.displayName || currentUser?.email || 'Admin'}`],
            [`Ngày xuất: ${new Date().toLocaleString('vi-VN')}`],
            []
          ];

          // 1. NXT
          if (this.exportInventory()) {
              await this.generateNxtReport();
              const nxtData = this.nxtData().map((row: any, index: number) => ({
                'STT': index + 1, 'Mã ID': row.id, 'Tên Hàng': row.name, 'ĐVT': row.unit, 'Phân Loại': row.category,
                'Tồn Đầu': row.startStock, 'Nhập Trong Kỳ': row.importQty, 'Xuất Trong Kỳ': row.exportQty, 'Tồn Cuối': row.endStock
              }));
              const ws = XLSX.utils.json_to_sheet([]);
              XLSX.utils.sheet_add_aoa(ws, [...exportInfo, ["BÁO CÁO NHẬP - XUẤT - TỒN (KHO)"]], { origin: "A1" });
              XLSX.utils.sheet_add_json(ws, nxtData, { origin: "A7", skipHeader: false });
              XLSX.utils.book_append_sheet(wb, ws, "NXT");
          }

          // 2. Consumption
          if (this.exportConsumption()) {
              const cons = this.consumptionData();
              const consData = cons.map((row, index) => ({
                'STT': index + 1, 'Mã': row.name, 'Tên Hóa chất/Vật tư': row.displayName, 'Tổng Tiêu Hao': row.amount, 'ĐVT': row.unit
              }));
              const ws = XLSX.utils.json_to_sheet([]);
              XLSX.utils.sheet_add_aoa(ws, [...exportInfo, ["DỮ LIỆU TIÊU HAO HÓA CHẤT"]], { origin: "A1" });
              XLSX.utils.sheet_add_json(ws, consData, { origin: "A7", skipHeader: false });
              XLSX.utils.book_append_sheet(wb, ws, "Consumption");
          }

          // 3. SOP
          if (this.exportSop()) {
              const sops = this.sopFrequencyData();
              const sopRows = sops.map((d, index) => ({
                'STT': index + 1, 'Quy trình (SOP)': d.name, 'Số lần chạy': d.count, 'Tổng Mẫu': d.samples, 'Tổng QC': d.qcs, 'Tỷ trọng (%)': formatNum(d.percent)
              }));
              const ws = XLSX.utils.json_to_sheet([]);
              XLSX.utils.sheet_add_aoa(ws, [...exportInfo, ["BÁO CÁO TẦN SUẤT QUY TRÌNH (SOP)"]], { origin: "A1" });
              XLSX.utils.sheet_add_json(ws, sopRows, { origin: "A7", skipHeader: false });
              XLSX.utils.book_append_sheet(wb, ws, "SOP Frequency");
          }

          // 4. Logs
          if (this.exportLogs()) {
              const logs = this.filteredLogs();
              const logRows = logs.map((l, index) => ({
                'STT': index + 1, 'Thời gian': formatDate(l.timestamp), 'Hoạt động': this.getLogActionText(l.action), 'Chi tiết': l.details, 'Người thực hiện': l.user
              }));
              const ws = XLSX.utils.json_to_sheet([]);
              XLSX.utils.sheet_add_aoa(ws, [...exportInfo, ["NHẬT KÝ HOẠT ĐỘNG CHI TIẾT"]], { origin: "A1" });
              XLSX.utils.sheet_add_json(ws, logRows, { origin: "A7", skipHeader: false });
              XLSX.utils.book_append_sheet(wb, ws, "Audit Logs");
          }

          XLSX.writeFile(wb, `BaoCao_TongHop_${start}_den_${end}.xlsx`);
          this.showGlobalExportModal.set(false);
      } catch (e) {
          console.error(e);
      } finally {
          this.isLoading.set(false);
      }
  }

  healthStats = computed(() => {
    const reqs = this.state.allStandardRequests();
    const stds = this.state.standards();
    const now = Date.now();
    return {
        borrowing: reqs.filter(r => r.status === 'IN_PROGRESS').length,
        overdue: reqs.filter(r => r.status === 'IN_PROGRESS' && r.expectedReturnDate && r.expectedReturnDate < now).length,
        expired: stds.filter((s: any) => s.expiry_date && new Date(s.expiry_date).getTime() < now).length,
        lowStock: stds.filter((s: any) => (s.current_amount ?? 0) < 5).length
    };
  });

  overdueRequests = computed(() => {
    const now = Date.now();
    return this.state.allStandardRequests().filter(r => r.status === 'IN_PROGRESS' && r.expectedReturnDate && r.expectedReturnDate < now);
  });

  criticalLogs = computed(() => {
    return this.state.logs().filter(l => 
        l.action.includes('DELETE') || 
        l.action.includes('HARD_DELETE') || 
        l.action.includes('REJECT') || 
        l.action.includes('REVOKE')
    ).slice(0, 20);
  });

  getLogActionIcon(action: string): string {
    if (action.includes('DELETE')) return 'fa-solid fa-trash-can text-red-500';
    if (action.includes('REJECT')) return 'fa-solid fa-circle-xmark text-rose-500';
    if (action.includes('REVOKE')) return 'fa-solid fa-hand-holding-hand text-amber-500';
    return 'fa-solid fa-bolt text-indigo-500';
  }

  showExportModal = signal(false);
  exportType = signal<'summary' | 'daily' | 'monthly' | 'specific_day'>('summary');
  specificDay = signal<number>(1);
  excludeMargin = signal<boolean>(false);

  constructor() {
    effect(() => {
        const active = this.activeTab();
        const consData = this.consumptionData();
        const inv = this.state.inventory();
        const stds = this.state.standards();

        if (active === 'consumption') {
            setTimeout(() => {
                this.createConsumptionBarChart();
                this.createCategoryPieChart();
                this.createConsumptionLineChart();
            }, 100);
        }
    });
  }

  // --- Actions ---
  onDateRangeChange(range: { start: string, end: string, label: string }) {
      this.startDate.set(range.start);
      this.endDate.set(range.end);
      this.hasGenerated.set(false); // Force recalculation if date changes
  }

  private getToday(): string { return new Date().toISOString().split('T')[0]; }
  private getFirstDayOfMonth(): string { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0]; }
  
  getUnitClass(unit: string): string { return (unit.includes('ml') || unit.includes('l')) ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-600 border-slate-200'; }

  getSelectedSopName(): string {
      const id = this.selectedSopId();
      if (id === 'all') return 'Tất cả';
      const sop = this.state.sops().find(s => s.id === id);
      return sop ? sop.name : id;
  }

  // --- NXT / EXPORT DETAIL REPORT LOGIC ---
  async generateNxtReport() {
      this.isLoading.set(true);
      this.nxtData.set([]);
      
      const startRaw = this.startDate();
      const endRaw = this.endDate();
      const start = new Date(startRaw);
      const end = new Date(endRaw);
      const endTime = new Date(end); endTime.setHours(23,59,59,999);
      const sopId = this.selectedSopId();
      
      try {
          const inventory = await this.invService.getAllInventory();
          const start = new Date(startRaw); start.setHours(0,0,0,0);
          const today = new Date();
          const logs = await this.invService.getLogsByDateRange(start, today);
          
          if (sopId === 'all') {
              const movements = new Map<string, { inPeriodImport: number, inPeriodExport: number, futureNetChange: number }>();
              inventory.forEach(item => movements.set(item.id, { inPeriodImport: 0, inPeriodExport: 0, futureNetChange: 0 }));

              const endFilterTime = endTime.getTime();

              logs.forEach(log => {
                  const logTime = (log.timestamp as any).toDate ? (log.timestamp as any).toDate().getTime() : new Date(log.timestamp).getTime();
                  
                  const result: { id: string, delta: number }[] = [];
                  const targetId = log.targetId;

                  if (log.action.includes('STOCK')) {
                      const match = log.details.match(/:\s*([+-]?\d+(?:\.\d+)?)/);
                      if (match && targetId) { result.push({ id: targetId, delta: parseFloat(match[1]) }); }
                  }
                  else if (log.action === 'CREATE_ITEM') {
                      const match = log.details.match(/\(([-+]?\d+(?:\.\d+)?)/);
                      if (match && targetId) { result.push({ id: targetId, delta: parseFloat(match[1]) }); }
                  }
                  else if (log.action === 'UPDATE_INFO') {
                      const match = log.details.match(/Tồn kho:\s*([-+]?\d+(?:\.\d+)?)\s*->\s*([-+]?\d+(?:\.\d+)?)/);
                      if (match && targetId) { 
                          const oldStock = parseFloat(match[1]);
                          const newStock = parseFloat(match[2]);
                          result.push({ id: targetId, delta: newStock - oldStock }); 
                      }
                  }
                  else if (log.action === 'DELETE_ITEM' || log.action === 'HARD_DELETE_STANDARD_REQUEST') {
                      // NEW: Use finalStock from log for absolute accuracy if available
                      if (log.finalStock !== undefined && targetId) {
                          // we don't know the stock before deletion, but we know it ended at finalStock
                          // To re-balance, we treat the deletion as a final movement out of that amount?
                          // Actually, we just need to know the stock at that time.
                      }
                  }
                  else if (log.action.includes('APPROVE') && log.printData?.items) {
                      log.printData.items.forEach(item => {
                          if (item.isComposite && item.breakdown) {
                              item.breakdown.forEach(sub => result.push({ id: sub.name, delta: -(sub.totalNeed || 0) }));
                          } else {
                              result.push({ id: item.name, delta: -(item.stockNeed || 0) });
                          }
                      });
                  }

                  result.forEach(change => {
                      if (!movements.has(change.id)) movements.set(change.id, { inPeriodImport: 0, inPeriodExport: 0, futureNetChange: 0 });
                      const entry = movements.get(change.id)!;
                      
                      if (logTime > endFilterTime) {
                          entry.futureNetChange += change.delta;
                      } else {
                          if (change.delta > 0) entry.inPeriodImport += change.delta;
                          else entry.inPeriodExport += Math.abs(change.delta);
                      }
                  });
              });

              const report: NxtReportItem[] = [];
              const allIds = new Set([...inventory.map(i => i.id), ...movements.keys()]);
              
              allIds.forEach(id => {
                  const item = inventory.find(i => i.id === id);
                  const m = movements.get(id) || { inPeriodImport: 0, inPeriodExport: 0, futureNetChange: 0 };
                  
                  const currentStock = item ? item.stock : 0;
                  const endStock = currentStock - m.futureNetChange;
                  const startStock = endStock - m.inPeriodImport + m.inPeriodExport;

                  if (startStock !== 0 || m.inPeriodImport !== 0 || m.inPeriodExport !== 0 || endStock !== 0 || item) {
                      report.push({
                          id: id,
                          name: item?.name || id,
                          unit: item?.unit || '?',
                          category: item?.category || 'Unknown',
                          startStock: parseFloat(startStock.toFixed(3)),
                          importQty: parseFloat(m.inPeriodImport.toFixed(3)),
                          exportQty: parseFloat(m.inPeriodExport.toFixed(3)),
                          endStock: parseFloat(endStock.toFixed(3))
                      });
                  }
              });
              this.nxtData.set(report.sort((a,b) => a.name.localeCompare(b.name)));

          } else {
              const consumptionMap = new Map<string, number>();
              logs.forEach(log => {
                  const logTime = (log.timestamp as any).toDate ? (log.timestamp as any).toDate().getTime() : new Date(log.timestamp).getTime();
                  
                  if (logTime <= endTime.getTime()) {
                      if (log.action.includes('APPROVE') && log.printData?.sop?.id === sopId && log.printData?.items) {
                          log.printData.items.forEach(item => {
                              if (item.isComposite && item.breakdown) {
                                  item.breakdown.forEach(sub => {
                                      const cur = consumptionMap.get(sub.name) || 0;
                                      consumptionMap.set(sub.name, cur + (sub.totalNeed || 0));
                                  });
                              } else {
                                  const cur = consumptionMap.get(item.name) || 0;
                                  consumptionMap.set(item.name, cur + (item.stockNeed || 0));
                              }
                          });
                      }
                  }
              });

              const report: NxtReportItem[] = [];
              consumptionMap.forEach((qty, id) => {
                  const item = inventory.find(i => i.id === id);
                  report.push({
                      id: id,
                      name: item?.name || id,
                      unit: item?.unit || '?',
                      category: item?.category || 'Unknown',
                      startStock: 0, 
                      importQty: 0, 
                      exportQty: parseFloat(qty.toFixed(3)),
                      endStock: 0 
                  });
              });
              this.nxtData.set(report.sort((a,b) => a.name.localeCompare(b.name)));
          }

          this.hasGenerated.set(true);

      } catch (e) { console.error(e); } finally { this.isLoading.set(false); }
  }

  async exportNxtExcel() {
      const XLSX = await import('xlsx');
      let data: any[] = [];
      let sheetName = 'Report';
      let fileName = '';

      if (this.selectedSopId() === 'all') {
          data = this.nxtData().map((row, index) => ({
              'STT': index + 1, 'Mã ID': row.id, 'Tên Hàng': row.name, 'ĐVT': row.unit, 'Phân Loại': row.category,
              'Tồn Đầu': row.startStock, 'Nhập Trong Kỳ': row.importQty, 'Xuất Trong Kỳ': row.exportQty, 'Tồn Cuối': row.endStock
          }));
          sheetName = 'Báo cáo NXT';
          fileName = `BaoCao_NXT_${this.startDate()}_${this.endDate()}.xlsx`;
      } else {
          data = this.nxtData().map((row, index) => ({
              'STT': index + 1, 'Mã ID': row.id, 'Tên Hàng': row.name, 'ĐVT': row.unit,
              'Tổng Lượng Xuất': row.exportQty
          }));
          sheetName = 'Chi tiết Xuất SOP';
          fileName = `ChiTiet_SOP_${this.selectedSopId()}_${this.startDate()}.xlsx`;
      }

      const ws: any = XLSX.utils.json_to_sheet(data);
      const wb: any = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      XLSX.writeFile(wb, fileName);
  }

  async exportConsumptionExcel() {
      const XLSX = await import('xlsx');
      const history = this.state.approvedRequests();
      
      const start = new Date(this.startDate()); start.setHours(0,0,0,0);
      const end = new Date(this.endDate()); end.setHours(23,59,59,999);
      const sopId = this.selectedSopId();
      const type = this.exportType();
      const specDay = this.specificDay();

      // 1. Filter raw data based on Date Range and SOP
      const filteredHistory = history.filter(req => {
          let d: Date;
          if (req.analysisDate) {
              const parts = req.analysisDate.split('-');
              d = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
          } else {
              const ts = req.approvedAt || req.timestamp;
              d = (ts && typeof ts.toDate === 'function') ? ts.toDate() : new Date(ts);
          }

          if (d < start || d > end) return false;
          if (sopId !== 'all' && req.sopId !== sopId) return false;
          
          // Additional filter for 'specific_day'
          if (type === 'specific_day' && d.getDate() !== specDay) return false;
          
          return true;
      });

      // 2. Process data based on export type
      let data: any[] = [];
      let sheetName = 'TieuHao';
      let fileName = `TieuHao_${this.startDate()}_${this.endDate()}.xlsx`;
      
      const useBaseAmount = this.excludeMargin();
      const safetyConfig = this.state.safetyConfig();
      const inventoryMap = new Map(this.state.inventory().map(i => [i.name, i]));

      const getCalculatedItemAmount = (item: any, reqMargin: number) => {
          if (!useBaseAmount) return item.amount;
          if (item.baseAmount !== undefined) return item.baseAmount;
          
          // Fallback for old data
          if (reqMargin > 0) {
              return item.amount / (1 + reqMargin / 100);
          } else if (reqMargin < 0) {
              const invItem = inventoryMap.get(item.name);
              let appliedMargin = 10;
              if (safetyConfig && invItem && invItem.category && safetyConfig.rules[invItem.category] !== undefined) {
                  appliedMargin = safetyConfig.rules[invItem.category];
              } else if (safetyConfig && safetyConfig.defaultMargin !== undefined) {
                  appliedMargin = safetyConfig.defaultMargin;
              }
              return item.amount / (1 + appliedMargin / 100);
          }
          return item.amount;
      };

      if (type === 'summary' || type === 'specific_day') {
          // SUMMARY MODE (or Specific Day Summary)
          const map = new Map<string, {amount: number, unit: string, displayName: string}>();
          
          filteredHistory.forEach(req => {
              const reqMargin: number = req.margin !== undefined ? req.margin : (req.inputs?.safetyMargin !== undefined ? req.inputs.safetyMargin : -1);
              req.items.forEach(item => {
                  const itemAmount = getCalculatedItemAmount(item, reqMargin);
                  const current = map.get(item.name) || { amount: 0, unit: item.stockUnit || item.unit, displayName: item.displayName || item.name };
                  map.set(item.name, { 
                      amount: current.amount + itemAmount, 
                      unit: current.unit,
                      displayName: item.displayName || current.displayName || item.name
                  });
              });
          });

          const sortedData = Array.from(map.entries())
              .map(([id, val]) => ({ name: id, displayName: val.displayName, amount: val.amount, unit: val.unit }))
              .sort((a,b) => b.amount - a.amount);

          data = sortedData.map((row, index) => ({
              'STT': index + 1,
              'Mã Hóa chất/Vật tư': row.name,
              'Tên Hóa chất/Vật tư': row.displayName,
              'Tổng Tiêu Hao': row.amount,
              'ĐVT': row.unit
          }));

          if (type === 'specific_day') {
              sheetName = `Ngay_${specDay}`;
              fileName = `TieuHao_Ngay${specDay}_${this.startDate()}_${this.endDate()}.xlsx`;
          } else {
              sheetName = 'TongHop';
          }

      } else if (type === 'daily' || type === 'monthly') {
          // PIVOT MODE (Daily or Monthly)
          const pivotMap = new Map<string, { displayName: string, unit: string, totals: Record<string, number>, grandTotal: number }>();
          const columnsSet = new Set<string>();

          filteredHistory.forEach(req => {
              let d: Date;
              if (req.analysisDate) {
                  const parts = req.analysisDate.split('-');
                  d = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
              } else {
                  const ts = req.approvedAt || req.timestamp;
                  d = (ts && typeof ts.toDate === 'function') ? ts.toDate() : new Date(ts);
              }

              // Format column key based on type
              let colKey = '';
              if (type === 'daily') {
                  const day = d.getDate().toString().padStart(2, '0');
                  const month = (d.getMonth() + 1).toString().padStart(2, '0');
                  colKey = `${day}/${month}`;
              } else {
                  const month = (d.getMonth() + 1).toString().padStart(2, '0');
                  const year = d.getFullYear();
                  colKey = `T${month}/${year}`;
              }
              columnsSet.add(colKey);

              const reqMargin: number = req.margin !== undefined ? req.margin : (req.inputs?.safetyMargin !== undefined ? req.inputs.safetyMargin : -1);
              req.items.forEach(item => {
                  const itemAmount = getCalculatedItemAmount(item, reqMargin);
                  if (!pivotMap.has(item.name)) {
                      pivotMap.set(item.name, { 
                          displayName: item.displayName || item.name, 
                          unit: item.stockUnit || item.unit, 
                          totals: {}, 
                          grandTotal: 0 
                      });
                  }
                  
                  const record = pivotMap.get(item.name)!;
                  record.totals[colKey] = (record.totals[colKey] || 0) + itemAmount;
                  record.grandTotal += itemAmount;
              });
          });

          // Sort columns chronologically (assuming format DD/MM or TMM/YYYY allows simple string sort for same year, 
          // but for robustness, we should sort by actual date. For simplicity here, we sort the Set as array)
          // A better sort for DD/MM and TMM/YYYY:
          const sortedColumns = Array.from(columnsSet).sort((a, b) => {
              if (type === 'daily') {
                  const [d1, m1] = a.split('/'); const [d2, m2] = b.split('/');
                  if (m1 !== m2) return parseInt(m1) - parseInt(m2);
                  return parseInt(d1) - parseInt(d2);
              } else {
                  const [m1, y1] = a.replace('T', '').split('/'); const [m2, y2] = b.replace('T', '').split('/');
                  if (y1 !== y2) return parseInt(y1) - parseInt(y2);
                  return parseInt(m1) - parseInt(m2);
              }
          });

          // Build final data array
          const sortedRows = Array.from(pivotMap.entries()).sort((a, b) => b[1].grandTotal - a[1].grandTotal);
          
          data = sortedRows.map(([id, val], index) => {
              const rowObj: any = {
                  'STT': index + 1,
                  'Mã Hóa chất/Vật tư': id,
                  'Tên Hóa chất/Vật tư': val.displayName,
                  'ĐVT': val.unit,
                  'Tổng Cộng': val.grandTotal
              };
              
              // Add dynamic columns
              sortedColumns.forEach(col => {
                  rowObj[col] = val.totals[col] || 0;
              });
              
              return rowObj;
          });

          sheetName = type === 'daily' ? 'TheoNgay' : 'TheoThang';
          fileName = `TieuHao_${sheetName}_${this.startDate()}_${this.endDate()}.xlsx`;
      }

      if (data.length === 0) {
          alert('Không có dữ liệu tiêu hao trong khoảng thời gian và điều kiện lọc này.');
          this.showExportModal.set(false);
          return;
      }

      // 3. Generate Excel File
      const ws: any = XLSX.utils.json_to_sheet(data);
      const wb: any = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      XLSX.writeFile(wb, fileName);
      
      this.showExportModal.set(false);
  }

  filteredLogs = computed(() => {
      const start = new Date(this.startDate()); start.setHours(0,0,0,0);
      const end = new Date(this.endDate()); end.setHours(23,59,59,999);
      const sopId = this.selectedSopId();

      return this.state.logs().filter(log => {
          const d = (log.timestamp as any).toDate ? (log.timestamp as any).toDate() : new Date(log.timestamp);
          const inDate = d >= start && d <= end;
          if (!inDate) return false;
          if (sopId === 'all') return true;
          return log.printData?.sop?.id === sopId;
      });
  });

  filteredStandardRequests = computed(() => {
      const start = new Date(this.startDate()); start.setHours(0,0,0,0);
      const end = new Date(this.endDate()); end.setHours(23,59,59,999);

      return this.state.allStandardRequests().filter(req => {
          const d = new Date(req.requestDate);
          return d >= start && d <= end;
      });
  });

  consumptionData = computed(() => {
    const history = this.state.approvedRequests();
    const map = new Map<string, {amount: number, unit: string, displayName: string}>();
    
    const start = new Date(this.startDate()); start.setHours(0,0,0,0);
    const end = new Date(this.endDate()); end.setHours(23,59,59,999);
    const sopId = this.selectedSopId();

    history.forEach(req => {
        let d: Date;
        if (req.analysisDate) {
            const parts = req.analysisDate.split('-');
            d = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
        } else {
            const ts = req.approvedAt || req.timestamp;
            d = (ts && typeof ts.toDate === 'function') ? ts.toDate() : new Date(ts);
        }

        if (d < start || d > end) return;
        if (sopId !== 'all' && req.sopId !== sopId) return;

        req.items.forEach(item => {
            const current = map.get(item.name) || { amount: 0, unit: item.stockUnit || item.unit, displayName: item.displayName || item.name };
            map.set(item.name, { 
                amount: current.amount + item.amount, 
                unit: current.unit,
                displayName: item.displayName || current.displayName || item.name
            });
        });
    });

    return Array.from(map.entries())
        .map(([id, val]) => ({ name: id, displayName: val.displayName, amount: val.amount, unit: val.unit }))
        .sort((a,b) => b.amount - a.amount);
  });

  sopFrequencyData = computed(() => {
    const history = this.state.approvedRequests();
    
    const start = new Date(this.startDate()); start.setHours(0,0,0,0);
    const end = new Date(this.endDate()); end.setHours(23,59,59,999);
    const sopId = this.selectedSopId();

    const filteredHistory = history.filter(req => {
        let d: Date;
        if (req.analysisDate) {
            const parts = req.analysisDate.split('-');
            d = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
        } else {
            const ts = req.approvedAt || req.timestamp;
            d = (ts && typeof ts.toDate === 'function') ? ts.toDate() : new Date(ts);
        }

        if (d < start || d > end) return false;
        if (sopId !== 'all' && req.sopId !== sopId) return false;
        return true;
    });

    const total = filteredHistory.length;
    if (total === 0) return [];

    const map = new Map<string, {count: number, samples: number, qcs: number}>();
    filteredHistory.forEach(req => {
        const current = map.get(req.sopName) || { count: 0, samples: 0, qcs: 0 };
        let s = 0; let q = 0;
        if (req.inputs) {
            if(req.inputs['n_sample']) s = Number(req.inputs['n_sample']);
            if(req.inputs['n_qc']) q = Number(req.inputs['n_qc']);
        }
        map.set(req.sopName, { count: current.count + 1, samples: current.samples + s, qcs: current.qcs + q });
    });

    return Array.from(map.entries())
        .map(([name, val]) => ({ name, count: val.count, samples: val.samples, qcs: val.qcs, percent: (val.count/total)*100 }))
        .sort((a,b) => b.count - a.count);
  });

  async createConsumptionBarChart() {
      const canvas = this.barChartCanvas()?.nativeElement;
      if (!canvas) return;
      if (this.barChart) this.barChart.destroy();
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const data = this.consumptionData().slice(0, 15);
      this.barChart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: data.map(d => d.displayName || d.name),
              datasets: [{ 
                  label: 'Lượng dùng', 
                  data: data.map(d => d.amount), 
                  backgroundColor: 'rgba(79, 70, 229, 0.6)', 
                  borderColor: 'rgba(79, 70, 229, 1)', 
                  borderWidth: 2,
                  borderRadius: 8
              }]
          },
          options: { 
              indexAxis: 'y',
              responsive: true, 
              maintainAspectRatio: false, 
              plugins: { 
                  legend: { display: false },
                  tooltip: {
                      callbacks: {
                          label: (context: any) => `Lượng dùng: ${formatNum(context.raw)}`
                      }
                  }
              },
              layout: { padding: { left: 40, right: 20 } },
              scales: { 
                  x: { grid: { display: false }, beginAtZero: true }, 
                  y: { 
                      grid: { display: false },
                      ticks: {
                          callback: function(value: any) {
                              const label = this.getLabelForValue(value);
                              return (label && label.length > 30) ? label.substring(0, 27) + '...' : label;
                          },
                          font: { size: 10, weight: 'bold' }
                      }
                  } 
              } 
          }
      });
  }

  async createCategoryPieChart() {
      const canvas = this.pieChartCanvas()?.nativeElement;
      if (!canvas) return;
      if (this.pieChart) this.pieChart.destroy();
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const data = this.consumptionData();
      const catMap = new Map<string, number>();
      
      // Combine Inventory and Standards categories
      const invMap = new Map(this.state.inventory().map(i => [i.name, i.category]));
      const stdMap = new Map(this.state.standards().map(s => [s.name, 'Chuẩn đối chiếu']));
      
      data.forEach(d => {
          const cat = invMap.get(d.name) || stdMap.get(d.name) || 'Chưa phân loại';
          catMap.set(cat, (catMap.get(cat) || 0) + 1);
      });

      this.pieChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
              labels: Array.from(catMap.keys()),
              datasets: [{
                  data: Array.from(catMap.values()),
                  backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'],
                  borderWidth: 0
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10, weight: 'bold' } } } },
              cutout: '70%'
          }
      });
  }

  async createConsumptionLineChart() {
      const canvas = this.lineChartCanvas()?.nativeElement;
      if (!canvas) return;
      if (this.lineChart) this.lineChart.destroy();
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Group consumption by date for trend
      const history = this.state.approvedRequests();
      const trendMap = new Map<string, number>();
      const start = new Date(this.startDate());
      const end = new Date(this.endDate());

      history.forEach(req => {
          const ts = req.approvedAt || req.timestamp;
          const d = (ts && typeof ts.toDate === 'function') ? ts.toDate() : new Date(ts);
          if (d >= start && d <= end) {
              const key = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
              let dayTotal = 0;
              req.items.forEach(i => dayTotal += i.amount);
              trendMap.set(key, (trendMap.get(key) || 0) + dayTotal);
          }
      });

      const sortedKeys = Array.from(trendMap.keys()).sort((a,b) => {
          const [d1, m1] = a.split('/'); const [d2, m2] = b.split('/');
          return new Date(2025, parseInt(m1)-1, parseInt(d1)).getTime() - new Date(2025, parseInt(m2)-1, parseInt(d2)).getTime();
      });

      this.lineChart = new Chart(ctx, {
          type: 'line',
          data: {
              labels: sortedKeys,
              datasets: [{
                  label: 'Tổng lượng dùng',
                  data: sortedKeys.map(k => trendMap.get(k)),
                  borderColor: '#4F46E5',
                  backgroundColor: 'rgba(79, 70, 229, 0.1)',
                  fill: true,
                  tension: 0.4,
                  pointRadius: 4,
                  pointBackgroundColor: '#4F46E5',
                  borderWidth: 3
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { 
                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                x: { grid: { display: false } }
              }
          }
      });
  }

  async exportSopFrequencyExcel() {
    const XLSX = await import('xlsx');
    const data = this.sopFrequencyData();
    if (data.length === 0) return;

    const exportRows = data.map((d, index) => ({
        'STT': index + 1,
        'Quy trình (SOP)': d.name,
        'Số lần chạy': d.count,
        'Tổng Mẫu': d.samples,
        'Tổng QC': d.qcs,
        'Tỷ trọng (%)': formatNum(d.percent)
    }));

    const ws = XLSX.utils.json_to_sheet([]);
    const currentUser = this.auth.currentUser();
    
    // Add compliance headers
    XLSX.utils.sheet_add_aoa(ws, [
        ["BÁO CÁO TẦN SUẤT QUY TRÌNH (SOP)"],
        [`Thời gian: ${this.startDate()} đến ${this.endDate()}`],
        [`Người xuất: ${currentUser?.displayName || currentUser?.email || 'Admin'}`],
        [`Ngày xuất: ${new Date().toLocaleString('vi-VN')}`],
        [], // empty row
    ], { origin: "A1" });

    XLSX.utils.sheet_add_json(ws, exportRows, { origin: "A6", skipHeader: false });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SOP Frequency");
    XLSX.writeFile(wb, `TanSuat_SOP_${this.startDate()}_${this.endDate()}.xlsx`);
  }
}
