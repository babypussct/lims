
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

                    <!-- Date Range Filter Component -->
                    <app-date-range-filter 
                        [initStart]="startDate()" 
                        [initEnd]="endDate()"
                        (dateChange)="onDateRangeChange($event)">
                    </app-date-range-filter>

                    <!-- Global Export Button (Moved here) -->
                    <button (click)="openGlobalExport()" 
                            class="h-[42px] px-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center gap-2 group">
                        <i class="fa-solid fa-file-export group-hover:rotate-12 transition-transform"></i> Xuất Báo cáo
                    </button>

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
                         <!-- Export button moved to filter header -->
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
        <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" (click)="$event.target === $event.currentTarget && !isExporting() && showGlobalExportModal.set(false)">
            <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in border border-slate-200 dark:border-slate-700 max-h-[90vh] flex flex-col">
                
                <!-- Header -->
                <div class="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/10 dark:to-purple-900/10 shrink-0">
                    <div>
                        <h3 class="font-black text-slate-800 dark:text-slate-100 flex items-center gap-2.5 text-lg">
                            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-300/30">
                                <i class="fa-solid fa-file-export text-sm"></i>
                            </div>
                            Xuất Báo cáo Tổng hợp
                        </h3>
                        <div class="flex items-center gap-2 mt-1 ml-[46px]">
                            <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{{startDate()}} → {{endDate()}}</span>
                            @if (selectedSopId() !== 'all') {
                                <span class="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">SOP: {{getSelectedSopName()}}</span>
                            }
                        </div>
                    </div>
                    <button (click)="showGlobalExportModal.set(false)" [disabled]="isExporting()" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition disabled:opacity-50">
                        <i class="fa-solid fa-times"></i>
                    </button>
                </div>
                
                <!-- Scrollable Content -->
                <div class="flex-1 overflow-y-auto custom-scrollbar">
                    
                    <!-- Quick Presets -->
                    @if (!isExporting()) {
                    <div class="px-5 pt-5 pb-3">
                        <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3"><i class="fa-solid fa-bolt mr-1"></i> Gợi ý Mẫu Khung Báo Cáo</div>
                        <div class="flex flex-wrap gap-2">
                            <button (click)="applyPreset('monthly')" class="px-3 py-1.5 rounded-xl text-[11px] font-bold border transition active:scale-95"
                                    [class]="activePreset() === 'monthly' ? 'bg-indigo-100 border-indigo-300 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-400' : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-300'"
                                    title="Chỉ tính toán và tóm tắt theo tháng">
                                <i class="fa-solid fa-calendar-days mr-1"></i> Báo cáo Kế hoạch (NXT + TH)
                            </button>
                            <button (click)="applyPreset('detailed')" class="px-3 py-1.5 rounded-xl text-[11px] font-bold border transition active:scale-95"
                                    [class]="activePreset() === 'detailed' ? 'bg-indigo-100 border-indigo-300 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-400' : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-300'"
                                    title="Tách bạch dữ liệu theo ngày và từng SOP để phân tích hiệu năng">
                                <i class="fa-solid fa-magnifying-glass-chart mr-1"></i> Phân tích Dữ liệu Chi tiết
                            </button>
                            <button (click)="applyPreset('accounting')" class="px-3 py-1.5 rounded-xl text-[11px] font-bold border transition active:scale-95"
                                    [class]="activePreset() === 'accounting' ? 'bg-indigo-100 border-indigo-300 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-400' : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-300'"
                                    title="Số liệu thuần thiết, loại trừ mọi mốc hao hụt">
                                <i class="fa-solid fa-receipt mr-1"></i> Chuẩn Kế toán / Mua hàng
                            </button>
                            <button (click)="applyPreset('all')" class="px-3 py-1.5 rounded-xl text-[11px] font-bold border transition active:scale-95"
                                    [class]="activePreset() === 'all' ? 'bg-indigo-100 border-indigo-300 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-400' : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-300'">
                                <i class="fa-solid fa-layer-group mr-1"></i> Xuất Tất Cả
                            </button>
                        </div>
                    </div>
                    }

                    <!-- Report Sections -->
                    <div class="px-5 pb-5 space-y-2">
                        @if (!isExporting()) {
                            <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 mt-2"><i class="fa-solid fa-list-check mr-1"></i> Chọn nội dung</div>
                        } @else {
                            <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 mt-2"><i class="fa-solid fa-gear fa-spin mr-1"></i> Đang xuất...</div>
                        }

                        <!-- 1. NXT -->
                        <div class="border rounded-2xl overflow-hidden transition-all" 
                             [class]="exportInventory() ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-900/10' : 'border-slate-100 dark:border-slate-700'">
                            <button (click)="!isExporting() && exportInventory.set(!exportInventory()); activePreset.set(null)" [disabled]="isExporting()"
                                    class="w-full flex items-center gap-3.5 p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition disabled:cursor-default">
                                <div class="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-sm"
                                     [class]="exportInventory() ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'">
                                    <i [class]="exportInventory() ? 'fa-solid fa-check' : 'fa-solid fa-boxes-packing'"></i>
                                </div>
                                <div class="flex-1 text-left">
                                    <div class="text-sm font-black" [class]="exportInventory() ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'">1. Báo cáo Nhập - Xuất - Tồn (NXT)</div>
                                    <div class="text-[11px] text-slate-500">Biến động kho chi tiết từng mặt hàng</div>
                                </div>
                                @if (exportInventory()) {
                                    <span class="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">{{nxtData().length || state.inventory().length}} items</span>
                                }
                                @if (isExporting()) {
                                    @if (exportProgress().nxt === 'done') { <i class="fa-solid fa-circle-check text-emerald-500 text-lg"></i> }
                                    @else if (exportProgress().nxt === 'working') { <span class="w-5 h-5 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></span> }
                                    @else { <i class="fa-regular fa-circle text-slate-300"></i> }
                                }
                            </button>
                        </div>

                        <!-- 2. Consumption -->
                        <div class="border rounded-2xl overflow-hidden transition-all"
                             [class]="exportConsumption() ? 'border-orange-200 dark:border-orange-800 bg-orange-50/30 dark:bg-orange-900/10' : 'border-slate-100 dark:border-slate-700'">
                            <button (click)="!isExporting() && toggleConsumption()" [disabled]="isExporting()"
                                    class="w-full flex items-center gap-3.5 p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition disabled:cursor-default">
                                <div class="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-sm"
                                     [class]="exportConsumption() ? 'bg-orange-500 text-white shadow-orange-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'">
                                    <i [class]="exportConsumption() ? 'fa-solid fa-check' : 'fa-solid fa-flask'"></i>
                                </div>
                                <div class="flex-1 text-left">
                                    <div class="text-sm font-black" [class]="exportConsumption() ? 'text-orange-700 dark:text-orange-400' : 'text-slate-600 dark:text-slate-300'">2. Dữ liệu Tiêu hao Hóa chất</div>
                                    <div class="text-[11px] text-slate-500">Tổng hợp lượng dùng dựa trên phiếu đã duyệt</div>
                                </div>
                                @if (exportConsumption()) {
                                    <span class="text-[10px] font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full">{{consumptionData().length}} items</span>
                                    <i class="fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform" [class.rotate-180]="showConsumptionOptions()"></i>
                                }
                                @if (isExporting()) {
                                    @if (exportProgress().consumption === 'done') { <i class="fa-solid fa-circle-check text-orange-500 text-lg"></i> }
                                    @else if (exportProgress().consumption === 'working') { <span class="w-5 h-5 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin"></span> }
                                    @else { <i class="fa-regular fa-circle text-slate-300"></i> }
                                }
                            </button>
                            <!-- Consumption Sub-options (Accordion) -->
                            @if (exportConsumption() && showConsumptionOptions() && !isExporting()) {
                                <div class="px-4 pb-4 space-y-2 border-t border-orange-100 dark:border-orange-900/30 bg-white/50 dark:bg-slate-800/50">
                                    <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-3 pb-1">Chế độ xuất</div>
                                    <div class="grid grid-cols-2 gap-2">
                                        <div (click)="exportType.set('summary'); activePreset.set(null)" class="flex items-center gap-2 p-2.5 border rounded-xl cursor-pointer transition text-xs font-bold"
                                             [class]="exportType() === 'summary' ? 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-orange-300'">
                                            @if (exportType() === 'summary') { <i class="fa-solid fa-circle-dot text-orange-600 text-sm"></i> }
                                            @else { <i class="fa-regular fa-circle text-slate-400 text-sm group-hover:text-orange-400"></i> }
                                            <span><i class="fa-solid fa-sigma mr-1"></i>Tổng hợp</span>
                                        </div>
                                        <div (click)="exportType.set('daily'); activePreset.set(null)" class="flex items-center gap-2 p-2.5 border rounded-xl cursor-pointer transition text-xs font-bold"
                                             [class]="exportType() === 'daily' ? 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-orange-300'">
                                            @if (exportType() === 'daily') { <i class="fa-solid fa-circle-dot text-orange-600 text-sm"></i> }
                                            @else { <i class="fa-regular fa-circle text-slate-400 text-sm group-hover:text-orange-400"></i> }
                                            <span><i class="fa-solid fa-calendar-day mr-1"></i>Theo ngày</span>
                                        </div>
                                        <div (click)="exportType.set('monthly'); activePreset.set(null)" class="flex items-center gap-2 p-2.5 border rounded-xl cursor-pointer transition text-xs font-bold"
                                             [class]="exportType() === 'monthly' ? 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-orange-300'">
                                            @if (exportType() === 'monthly') { <i class="fa-solid fa-circle-dot text-orange-600 text-sm"></i> }
                                            @else { <i class="fa-regular fa-circle text-slate-400 text-sm group-hover:text-orange-400"></i> }
                                            <span><i class="fa-solid fa-calendar-week mr-1"></i>Theo tháng</span>
                                        </div>
                                        <div (click)="exportType.set('specific_day'); activePreset.set(null)" class="flex items-center gap-2 p-2.5 border rounded-xl cursor-pointer transition text-xs font-bold"
                                             [class]="exportType() === 'specific_day' ? 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-orange-300'">
                                            @if (exportType() === 'specific_day') { <i class="fa-solid fa-circle-dot text-orange-600 text-sm"></i> }
                                            @else { <i class="fa-regular fa-circle text-slate-400 text-sm group-hover:text-orange-400"></i> }
                                            <span><i class="fa-solid fa-crosshairs mr-1"></i>Ngày cụ thể</span>
                                        </div>
                                    </div>
                                    @if (exportType() === 'specific_day') {
                                        <div class="flex items-center gap-2 mt-1">
                                            <span class="text-[11px] font-bold text-slate-500">Lọc ngày:</span>
                                            <input type="number" min="1" max="31" [value]="specificDay() || 1" (input)="onSpecificDayChange($event)" class="w-14 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded-lg text-xs text-center outline-none focus:border-orange-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                                            <span class="text-[10px] text-slate-400">hàng tháng</span>
                                        </div>
                                    }
                                    <div class="pt-1">
                                        <div (click)="excludeMargin.set(!excludeMargin()); activePreset.set(null)" class="flex items-center gap-2.5 p-2.5 border rounded-xl cursor-pointer transition group"
                                             [class]="excludeMargin() ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800' : 'border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700'">
                                            <div class="w-4 h-4 rounded border flex items-center justify-center transition shrink-0"
                                                 [class]="excludeMargin() ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-800 group-hover:border-amber-400'">
                                                @if (excludeMargin()) { <i class="fa-solid fa-check text-[10px]"></i> }
                                            </div>
                                            <div>
                                                <div class="text-xs font-bold" [class]="excludeMargin() ? 'text-amber-700 dark:text-amber-400' : 'text-slate-600 dark:text-slate-300'">Bỏ qua Hao hụt (Safety Margin)</div>
                                                <div class="text-[10px] text-slate-400">Xuất số liệu gốc, không cộng thêm phần hao hụt</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="pt-1">
                                        <div (click)="exportPerSop.set(!exportPerSop()); activePreset.set(null)" class="flex items-center gap-2.5 p-2.5 border rounded-xl cursor-pointer transition group"
                                             [class]="exportPerSop() ? 'bg-violet-50 border-violet-200 dark:bg-violet-900/20 dark:border-violet-800' : 'border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700'">
                                            <div class="w-4 h-4 rounded border flex items-center justify-center transition shrink-0"
                                                 [class]="exportPerSop() ? 'bg-violet-500 border-violet-500 text-white' : 'border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-800 group-hover:border-violet-400'">
                                                @if (exportPerSop()) { <i class="fa-solid fa-check text-[10px]"></i> }
                                            </div>
                                            <div>
                                                <div class="text-xs font-bold" [class]="exportPerSop() ? 'text-violet-700 dark:text-violet-400' : 'text-slate-600 dark:text-slate-300'">Tách riêng theo từng SOP</div>
                                                <div class="text-[10px] text-slate-400">Mỗi SOP = 1 sheet riêng biệt trong file Excel</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>

                        <!-- 3. SOP Frequency -->
                        <div class="border rounded-2xl overflow-hidden transition-all"
                             [class]="exportSop() ? 'border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-900/10' : 'border-slate-100 dark:border-slate-700'">
                            <button (click)="!isExporting() && exportSop.set(!exportSop()); activePreset.set(null)" [disabled]="isExporting()"
                                    class="w-full flex items-center gap-3.5 p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition disabled:cursor-default">
                                <div class="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-sm"
                                     [class]="exportSop() ? 'bg-purple-500 text-white shadow-purple-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'">
                                    <i [class]="exportSop() ? 'fa-solid fa-check' : 'fa-solid fa-list-ol'"></i>
                                </div>
                                <div class="flex-1 text-left">
                                    <div class="text-sm font-black" [class]="exportSop() ? 'text-purple-700 dark:text-purple-400' : 'text-slate-600 dark:text-slate-300'">3. Tần suất Quy trình (SOP)</div>
                                    <div class="text-[11px] text-slate-500">Thống kê số lần chạy, mẫu và QC</div>
                                </div>
                                @if (exportSop()) {
                                    <span class="text-[10px] font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full">{{sopFrequencyData().length}} SOPs</span>
                                }
                                @if (isExporting()) {
                                    @if (exportProgress().sop === 'done') { <i class="fa-solid fa-circle-check text-purple-500 text-lg"></i> }
                                    @else if (exportProgress().sop === 'working') { <span class="w-5 h-5 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></span> }
                                    @else { <i class="fa-regular fa-circle text-slate-300"></i> }
                                }
                            </button>
                        </div>

                        <!-- 4. Audit Logs -->
                        <div class="border rounded-2xl overflow-hidden transition-all"
                             [class]="exportLogs() ? 'border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10' : 'border-slate-100 dark:border-slate-700'">
                            <button (click)="!isExporting() && exportLogs.set(!exportLogs()); activePreset.set(null)" [disabled]="isExporting()"
                                    class="w-full flex items-center gap-3.5 p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition disabled:cursor-default">
                                <div class="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-sm"
                                     [class]="exportLogs() ? 'bg-blue-500 text-white shadow-blue-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'">
                                    <i [class]="exportLogs() ? 'fa-solid fa-check' : 'fa-solid fa-clock-rotate-left'"></i>
                                </div>
                                <div class="flex-1 text-left">
                                    <div class="text-sm font-black" [class]="exportLogs() ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'">4. Nhật ký Hoạt động (Audit Log)</div>
                                    <div class="text-[11px] text-slate-500">Toàn bộ thao tác trong khoảng thời gian</div>
                                </div>
                                @if (exportLogs()) {
                                    <span class="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">{{filteredLogs().length}} entries</span>
                                }
                                @if (isExporting()) {
                                    @if (exportProgress().logs === 'done') { <i class="fa-solid fa-circle-check text-blue-500 text-lg"></i> }
                                    @else if (exportProgress().logs === 'working') { <span class="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></span> }
                                    @else { <i class="fa-regular fa-circle text-slate-300"></i> }
                                }
                            </button>
                        </div>

                        <!-- 5. Standards Health -->
                        <div class="border rounded-2xl overflow-hidden transition-all"
                             [class]="exportStandards() ? 'border-pink-200 dark:border-pink-800 bg-pink-50/30 dark:bg-pink-900/10' : 'border-slate-100 dark:border-slate-700'">
                            <button (click)="!isExporting() && exportStandards.set(!exportStandards()); activePreset.set(null)" [disabled]="isExporting()"
                                    class="w-full flex items-center gap-3.5 p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition disabled:cursor-default">
                                <div class="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-sm"
                                     [class]="exportStandards() ? 'bg-pink-500 text-white shadow-pink-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'">
                                    <i [class]="exportStandards() ? 'fa-solid fa-check' : 'fa-solid fa-heart-pulse'"></i>
                                </div>
                                <div class="flex-1 text-left">
                                    <div class="text-sm font-black" [class]="exportStandards() ? 'text-pink-700 dark:text-pink-400' : 'text-slate-600 dark:text-slate-300'">5. Sức khỏe & Truy xuất Chuẩn</div>
                                    <div class="text-[11px] text-slate-500">Chuẩn đang mượn, quá hạn, hết hạn</div>
                                </div>
                                @if (exportStandards()) {
                                    <span class="text-[10px] font-bold bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 px-2 py-0.5 rounded-full">{{healthStats().borrowing + healthStats().overdue}} records</span>
                                }
                                @if (isExporting()) {
                                    @if (exportProgress().standards === 'done') { <i class="fa-solid fa-circle-check text-pink-500 text-lg"></i> }
                                    @else if (exportProgress().standards === 'working') { <span class="w-5 h-5 border-2 border-pink-200 border-t-pink-600 rounded-full animate-spin"></span> }
                                    @else { <i class="fa-regular fa-circle text-slate-300"></i> }
                                }
                            </button>
                        </div>

                        <!-- Cover sheet info -->
                        @if (!isExporting()) {
                            <div class="flex items-center gap-2 px-4 py-2 mt-1">
                                <i class="fa-solid fa-file-lines text-slate-300 text-xs"></i>
                                <span class="text-[10px] text-slate-400 font-medium">Sheet "Trang bìa" với KPIs tóm tắt sẽ tự động được thêm vào file</span>
                            </div>
                        }

                        <!-- Progress complete -->
                        @if (isExporting() && exportProgress().cover === 'done') {
                            <div class="mt-2 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-lg shadow-lg shadow-emerald-200">
                                    <i class="fa-solid fa-check-double"></i>
                                </div>
                                <div>
                                    <div class="text-sm font-black text-emerald-700 dark:text-emerald-400">Hoàn tất! File đã được tải xuống.</div>
                                    <div class="text-[11px] text-emerald-600 dark:text-emerald-500">Kiểm tra thư mục Downloads của bạn.</div>
                                </div>
                            </div>
                        }
                    </div>
                </div>

                <!-- Footer -->
                <div class="p-5 border-t border-slate-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/50 flex gap-3 justify-between items-center shrink-0">
                    <div class="text-[10px] text-slate-400 font-medium">
                        @if (!isExporting()) {
                            {{getSelectedSheetsCount()}} sheet(s) sẽ được xuất
                        }
                    </div>
                    <div class="flex gap-3">
                        <button (click)="showGlobalExportModal.set(false)" [disabled]="isExporting()" class="px-5 py-2.5 rounded-2xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition disabled:opacity-50">Đóng</button>
                        @if (!isExporting() || exportProgress().cover === 'done') {
                            <button (click)="runGlobalExport()" 
                                    [disabled]="isExporting() || getSelectedSheetsCount() === 0"
                                    class="px-8 py-2.5 rounded-2xl font-black text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-200/50 dark:shadow-none transition flex items-center gap-2 disabled:opacity-50 active:scale-95">
                                <i class="fa-solid fa-cloud-arrow-down"></i>
                                @if (exportProgress().cover === 'done') { Xuất lại } @else { Bắt đầu Xuất File }
                            </button>
                        }
                    </div>
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
  exportStandards = signal(false);
  exportPerSop = signal(false);
  showConsumptionOptions = signal(true);
  isExporting = signal(false);
  activePreset = signal<string | null>(null);
  exportProgress = signal<{nxt: string, consumption: string, sop: string, logs: string, standards: string, cover: string}>({
    nxt: 'pending', consumption: 'pending', sop: 'pending', logs: 'pending', standards: 'pending', cover: 'pending'
  });

  toggleConsumption() {
      if (this.exportConsumption()) {
          // If already on and options showing, toggle off
          if (this.showConsumptionOptions()) {
              this.exportConsumption.set(false);
              this.showConsumptionOptions.set(true);
          } else {
              this.showConsumptionOptions.set(true);
          }
      } else {
          this.exportConsumption.set(true);
          this.showConsumptionOptions.set(true);
      }
      this.activePreset.set(null);
  }

  getSelectedSheetsCount(): number {
      let count = 0;
      if (this.exportInventory()) count++;
      if (this.exportConsumption()) count++;
      if (this.exportSop()) count++;
      if (this.exportLogs()) count++;
      if (this.exportStandards()) count++;
      count++; // Cover sheet always included
      return count;
  }

  applyPreset(preset: string) {
      this.activePreset.set(preset);
      switch(preset) {
          case 'monthly':
              this.exportInventory.set(true);
              this.exportConsumption.set(true);
              this.exportSop.set(true);
              this.exportLogs.set(false);
              this.exportStandards.set(false);
              this.exportPerSop.set(false);
              this.exportType.set('summary');
              this.excludeMargin.set(false);
              break;
          case 'detailed':
              this.exportInventory.set(true);
              this.exportConsumption.set(true);
              this.exportSop.set(true);
              this.exportLogs.set(true);
              this.exportStandards.set(true);
              this.exportPerSop.set(false);
              this.exportType.set('daily');
              this.excludeMargin.set(false);
              break;
          case 'accounting':
              this.exportInventory.set(false);
              this.exportConsumption.set(true);
              this.exportSop.set(false);
              this.exportLogs.set(false);
              this.exportStandards.set(false);
              this.exportPerSop.set(false);
              this.exportType.set('summary');
              this.excludeMargin.set(true);
              break;
          case 'all':
              this.exportInventory.set(true);
              this.exportConsumption.set(true);
              this.exportSop.set(true);
              this.exportLogs.set(true);
              this.exportStandards.set(true);
              this.exportPerSop.set(true);
              this.exportType.set('daily');
              this.excludeMargin.set(false);
              break;
      }
  }

  openGlobalExport() {
      this.isExporting.set(false);
      this.exportProgress.set({ nxt: 'pending', consumption: 'pending', sop: 'pending', logs: 'pending', standards: 'pending', cover: 'pending' });
      this.showGlobalExportModal.set(true);
  }

  // --- Professional Excel Formatting Helper ---
  private formatSheet(ws: any, XLSX: any, headerRowIndex: number, dataLength: number, colWidths: number[]) {
      // Set column widths
      ws['!cols'] = colWidths.map(w => ({ wch: w }));
      // Set row heights for header area
      ws['!rows'] = [];
      for (let i = 0; i < headerRowIndex; i++) {
          ws['!rows'].push({ hpx: i === 0 ? 28 : 18 });
      }
      // Merge title cell across columns
      if (!ws['!merges']) ws['!merges'] = [];
      const maxCol = colWidths.length - 1;
      ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: Math.min(maxCol, 5) } });
  }

  async runGlobalExport() {
      this.isExporting.set(true);
      this.exportProgress.set({ nxt: 'pending', consumption: 'pending', sop: 'pending', logs: 'pending', standards: 'pending', cover: 'pending' });
      
      // Small delay to let Angular render the initial exporting state
      await new Promise(r => setTimeout(r, 100));
      
      try {
          const XLSX = await import('xlsx');
          const wb = XLSX.utils.book_new();
          const start = this.startDate();
          const end = this.endDate();
          const currentUser = this.auth.currentUser();
          const sopId = this.selectedSopId();
          
          const exportInfo = [
            ["BÁO CÁO TỔNG HỢP HỆ THỐNG LIMS"],
            [`Thời gian: ${start} đến ${end}`],
            [`Người xuất: ${currentUser?.displayName || currentUser?.email || 'Admin'}`],
            [`Ngày xuất: ${new Date().toLocaleString('vi-VN')}`],
            [`SOP: ${sopId === 'all' ? 'Tất cả quy trình' : this.getSelectedSopName()}`],
            []
          ];

          const sheetsAdded: string[] = [];

          // ===== 1. NXT =====
          if (this.exportInventory()) {
              this.exportProgress.update(p => ({ ...p, nxt: 'working' }));
              await new Promise(r => setTimeout(r, 50));
              
              await this.generateNxtReport();
              const nxtRows = this.nxtData();
              
              if (sopId === 'all') {
                  const data = nxtRows.map((row: any, index: number) => ({
                    'STT': index + 1, 'Mã ID': row.id, 'Tên Hàng': row.name, 'ĐVT': row.unit, 'Phân Loại': row.category,
                    'Tồn Đầu': row.startStock, 'Nhập Trong Kỳ': row.importQty, 'Xuất Trong Kỳ': row.exportQty, 'Tồn Cuối': row.endStock
                  }));
                  const ws = XLSX.utils.json_to_sheet([]);
                  XLSX.utils.sheet_add_aoa(ws, [...exportInfo, ["BÁO CÁO NHẬP - XUẤT - TỒN (KHO)"]], { origin: "A1" });
                  XLSX.utils.sheet_add_json(ws, data, { origin: "A8", skipHeader: false });
                  this.formatSheet(ws, XLSX, 8, data.length, [6, 20, 35, 10, 18, 14, 14, 14, 14]);
                  XLSX.utils.book_append_sheet(wb, ws, "NXT");
                  sheetsAdded.push("NXT");
              } else {
                  const data = nxtRows.map((row: any, index: number) => ({
                    'STT': index + 1, 'Mã ID': row.id, 'Tên Hàng': row.name, 'ĐVT': row.unit,
                    'Tổng Lượng Xuất': row.exportQty
                  }));
                  const ws = XLSX.utils.json_to_sheet([]);
                  XLSX.utils.sheet_add_aoa(ws, [...exportInfo, [`CHI TIẾT XUẤT KHO - ${this.getSelectedSopName()}`]], { origin: "A1" });
                  XLSX.utils.sheet_add_json(ws, data, { origin: "A8", skipHeader: false });
                  this.formatSheet(ws, XLSX, 8, data.length, [6, 20, 35, 10, 16]);
                  XLSX.utils.book_append_sheet(wb, ws, "Xuất SOP");
                  sheetsAdded.push("Xuất SOP");
              }
              this.exportProgress.update(p => ({ ...p, nxt: 'done' }));
              await new Promise(r => setTimeout(r, 200));
          }

          // ===== 2. CONSUMPTION (Full logic from exportConsumptionExcel) =====
          if (this.exportConsumption()) {
              this.exportProgress.update(p => ({ ...p, consumption: 'working' }));
              await new Promise(r => setTimeout(r, 50));
              
              const history = this.state.approvedRequests();
              const startD = new Date(start); startD.setHours(0,0,0,0);
              const endD = new Date(end); endD.setHours(23,59,59,999);
              const type = this.exportType();
              const specDay = this.specificDay();
              const useBaseAmount = this.excludeMargin();
              const safetyConfig = this.state.safetyConfig();
              const inventoryMap = new Map(this.state.inventory().map((i: any) => [i.name, i]));

              const getCalculatedItemAmount = (item: any, reqMargin: number) => {
                  if (!useBaseAmount) return item.amount;
                  if (item.baseAmount !== undefined) return item.baseAmount;
                  if (reqMargin > 0) {
                      return item.amount / (1 + reqMargin / 100);
                  } else if (reqMargin < 0) {
                      const invItem: any = inventoryMap.get(item.name);
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

              // Filter requests
              const filteredHistory = history.filter((req: any) => {
                  let d: Date;
                  if (req.analysisDate) {
                      const parts = req.analysisDate.split('-');
                      d = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
                  } else {
                      const ts = req.approvedAt || req.timestamp;
                      d = (ts && typeof ts.toDate === 'function') ? ts.toDate() : new Date(ts);
                  }
                  if (d < startD || d > endD) return false;
                  if (sopId !== 'all' && req.sopId !== sopId) return false;
                  if (type === 'specific_day' && d.getDate() !== specDay) return false;
                  return true;
              });

              // Build consumption data based on type
              if (type === 'summary' || type === 'specific_day') {
                  const map = new Map<string, {amount: number, unit: string, displayName: string}>();
                  filteredHistory.forEach((req: any) => {
                      const reqMargin: number = req.margin !== undefined ? req.margin : (req.inputs?.safetyMargin !== undefined ? req.inputs.safetyMargin : -1);
                      req.items.forEach((item: any) => {
                          const itemAmount = getCalculatedItemAmount(item, reqMargin);
                          const current = map.get(item.name) || { amount: 0, unit: item.stockUnit || item.unit, displayName: item.displayName || item.name };
                          map.set(item.name, { amount: current.amount + itemAmount, unit: current.unit, displayName: item.displayName || current.displayName || item.name });
                      });
                  });
                  const sortedData = Array.from(map.entries())
                      .map(([id, val]) => ({ name: id, displayName: val.displayName, amount: val.amount, unit: val.unit }))
                      .sort((a,b) => b.amount - a.amount);
                  const data = sortedData.map((row, i) => ({
                      'STT': i + 1, 'Mã Hóa chất/Vật tư': row.name, 'Tên Hóa chất/Vật tư': row.displayName,
                      'Tổng Tiêu Hao': parseFloat(row.amount.toFixed(3)), 'ĐVT': row.unit
                  }));
                  const sheetTitle = type === 'specific_day' ? `TIÊU HAO - LỌC NGÀY ${specDay}` : "DỮ LIỆU TIÊU HAO HÓA CHẤT (TỔNG HỢP)";
                  const ws = XLSX.utils.json_to_sheet([]);
                  XLSX.utils.sheet_add_aoa(ws, [...exportInfo, [sheetTitle]], { origin: "A1" });
                  XLSX.utils.sheet_add_json(ws, data, { origin: "A8", skipHeader: false });
                  this.formatSheet(ws, XLSX, 8, data.length, [6, 22, 35, 16, 10]);
                  XLSX.utils.book_append_sheet(wb, ws, type === 'specific_day' ? `Ngay_${specDay}` : "TieuHao_TongHop");
                  sheetsAdded.push("Tiêu hao");

              } else if (type === 'daily' || type === 'monthly') {
                  const pivotMap = new Map<string, { displayName: string, unit: string, totals: Record<string, number>, grandTotal: number }>();
                  const columnsSet = new Set<string>();

                  filteredHistory.forEach((req: any) => {
                      let d: Date;
                      if (req.analysisDate) {
                          const parts = req.analysisDate.split('-');
                          d = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
                      } else {
                          const ts = req.approvedAt || req.timestamp;
                          d = (ts && typeof ts.toDate === 'function') ? ts.toDate() : new Date(ts);
                      }
                      let colKey = '';
                      if (type === 'daily') {
                          colKey = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
                      } else {
                          colKey = `T${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
                      }
                      columnsSet.add(colKey);
                      const reqMargin: number = req.margin !== undefined ? req.margin : (req.inputs?.safetyMargin !== undefined ? req.inputs.safetyMargin : -1);
                      req.items.forEach((item: any) => {
                          const itemAmount = getCalculatedItemAmount(item, reqMargin);
                          if (!pivotMap.has(item.name)) {
                              pivotMap.set(item.name, { displayName: item.displayName || item.name, unit: item.stockUnit || item.unit, totals: {}, grandTotal: 0 });
                          }
                          const record = pivotMap.get(item.name)!;
                          record.totals[colKey] = (record.totals[colKey] || 0) + itemAmount;
                          record.grandTotal += itemAmount;
                      });
                  });

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

                  const sortedRows = Array.from(pivotMap.entries()).sort((a, b) => b[1].grandTotal - a[1].grandTotal);
                  const data = sortedRows.map(([id, val], i) => {
                      const rowObj: any = { 'STT': i + 1, 'Mã': id, 'Tên': val.displayName, 'ĐVT': val.unit, 'Tổng Cộng': parseFloat(val.grandTotal.toFixed(3)) };
                      sortedColumns.forEach(col => { rowObj[col] = parseFloat((val.totals[col] || 0).toFixed(3)); });
                      return rowObj;
                  });

                  const sheetName = type === 'daily' ? 'TheoNgay' : 'TheoThang';
                  const ws = XLSX.utils.json_to_sheet([]);
                  const title = type === 'daily' ? "TIÊU HAO PHÂN BỔ THEO NGÀY" : "TIÊU HAO PHÂN BỔ THEO THÁNG";
                  XLSX.utils.sheet_add_aoa(ws, [...exportInfo, [title]], { origin: "A1" });
                  XLSX.utils.sheet_add_json(ws, data, { origin: "A8", skipHeader: false });
                  const colWidths = [6, 18, 30, 8, 14, ...sortedColumns.map(() => 12)];
                  this.formatSheet(ws, XLSX, 8, data.length, colWidths);
                  XLSX.utils.book_append_sheet(wb, ws, sheetName);
                  sheetsAdded.push(sheetName);
              }

              // Per-SOP breakdown sheets
              if (this.exportPerSop() && sopId === 'all') {
                  const sopMap = new Map<string, { sopName: string, items: Map<string, {amount: number, unit: string, displayName: string}> }>();
                  filteredHistory.forEach((req: any) => {
                      const sName = req.sopName || req.sopId || 'Unknown';
                      if (!sopMap.has(sName)) sopMap.set(sName, { sopName: sName, items: new Map() });
                      const sopEntry = sopMap.get(sName)!;
                      const reqMargin: number = req.margin !== undefined ? req.margin : (req.inputs?.safetyMargin !== undefined ? req.inputs.safetyMargin : -1);
                      req.items.forEach((item: any) => {
                          const itemAmount = getCalculatedItemAmount(item, reqMargin);
                          const cur = sopEntry.items.get(item.name) || { amount: 0, unit: item.stockUnit || item.unit, displayName: item.displayName || item.name };
                          sopEntry.items.set(item.name, { amount: cur.amount + itemAmount, unit: cur.unit, displayName: item.displayName || cur.displayName });
                      });
                  });

                  sopMap.forEach((sopData, sopName) => {
                      const sorted = Array.from(sopData.items.entries())
                          .map(([id, val]) => ({ name: id, ...val }))
                          .sort((a, b) => b.amount - a.amount);
                      const data = sorted.map((r, i) => ({
                          'STT': i + 1, 'Mã': r.name, 'Tên': r.displayName, 'Lượng dùng': parseFloat(r.amount.toFixed(3)), 'ĐVT': r.unit
                      }));
                      if (data.length > 0) {
                          const ws = XLSX.utils.json_to_sheet([]);
                          XLSX.utils.sheet_add_aoa(ws, [...exportInfo, [`TIÊU HAO - ${sopName}`]], { origin: "A1" });
                          XLSX.utils.sheet_add_json(ws, data, { origin: "A8", skipHeader: false });
                          this.formatSheet(ws, XLSX, 8, data.length, [6, 22, 35, 14, 10]);
                          // Sanitize sheet name (max 31 chars, no special chars)
                          const safeName = sopName.replace(/[\\\/\?\*\[\]]/g, '').substring(0, 28);
                          XLSX.utils.book_append_sheet(wb, ws, `SOP_${safeName}`);
                          sheetsAdded.push(`SOP_${safeName}`);
                      }
                  });
              }

              this.exportProgress.update(p => ({ ...p, consumption: 'done' }));
              await new Promise(r => setTimeout(r, 200));
          }

          // ===== 3. SOP Frequency =====
          if (this.exportSop()) {
              this.exportProgress.update(p => ({ ...p, sop: 'working' }));
              await new Promise(r => setTimeout(r, 50));
              
              const sops = this.sopFrequencyData();
              const sopRows = sops.map((d: any, index: number) => ({
                'STT': index + 1, 'Quy trình (SOP)': d.name, 'Số lần chạy': d.count, 'Tổng Mẫu': d.samples, 'Tổng QC': d.qcs, 'Tỷ trọng (%)': formatNum(d.percent)
              }));
              const ws = XLSX.utils.json_to_sheet([]);
              XLSX.utils.sheet_add_aoa(ws, [...exportInfo, ["BÁO CÁO TẦN SUẤT QUY TRÌNH (SOP)"]], { origin: "A1" });
              XLSX.utils.sheet_add_json(ws, sopRows, { origin: "A8", skipHeader: false });
              this.formatSheet(ws, XLSX, 8, sopRows.length, [6, 35, 14, 12, 12, 14]);
              XLSX.utils.book_append_sheet(wb, ws, "SOP Frequency");
              sheetsAdded.push("SOP Frequency");
              
              this.exportProgress.update(p => ({ ...p, sop: 'done' }));
              await new Promise(r => setTimeout(r, 200));
          }

          // ===== 4. Audit Logs =====
          if (this.exportLogs()) {
              this.exportProgress.update(p => ({ ...p, logs: 'working' }));
              await new Promise(r => setTimeout(r, 50));
              
              const logs = this.filteredLogs();
              const logRows = logs.map((l: any, index: number) => ({
                'STT': index + 1, 'Thời gian': formatDate(l.timestamp), 'Hoạt động': this.getLogActionText(l.action), 'Chi tiết': l.details, 'Người thực hiện': l.user
              }));
              const ws = XLSX.utils.json_to_sheet([]);
              XLSX.utils.sheet_add_aoa(ws, [...exportInfo, ["NHẬT KÝ HOẠT ĐỘNG CHI TIẾT"]], { origin: "A1" });
              XLSX.utils.sheet_add_json(ws, logRows, { origin: "A8", skipHeader: false });
              this.formatSheet(ws, XLSX, 8, logRows.length, [6, 22, 20, 50, 20]);
              XLSX.utils.book_append_sheet(wb, ws, "Audit Logs");
              sheetsAdded.push("Audit Logs");
              
              this.exportProgress.update(p => ({ ...p, logs: 'done' }));
              await new Promise(r => setTimeout(r, 200));
          }

          // ===== 5. Standards Health =====
          if (this.exportStandards()) {
              this.exportProgress.update(p => ({ ...p, standards: 'working' }));
              await new Promise(r => setTimeout(r, 50));
              
              const ws = XLSX.utils.json_to_sheet([]);
              XLSX.utils.sheet_add_aoa(ws, [...exportInfo, ["SỨC KHỎE & TRUY XUẤT CHUẨN ĐỐI CHIẾU"]], { origin: "A1" });
              
              // Section A: Summary
              const stats = this.healthStats();
              XLSX.utils.sheet_add_aoa(ws, [
                  ["TỔNG QUAN"],
                  ["Đang mượn / Sử dụng:", stats.borrowing],
                  ["Quá hạn trả:", stats.overdue],
                  ["Chuẩn hết hạn:", stats.expired],
                  ["Tồn kho thấp:", stats.lowStock],
                  []
              ], { origin: "A8" });

              // Section B: Overdue detail
              const overdue = this.overdueRequests();
              if (overdue.length > 0) {
                  const startRow = 15;
                  XLSX.utils.sheet_add_aoa(ws, [["DANH SÁCH QUÁ HẠN MỰA CHUẨN"]], { origin: `A${startRow}` });
                  const overdueData = overdue.map((r: any, i: number) => ({
                      'STT': i + 1, 'Người mượn': r.requestedByName, 'Tên chuẩn': r.standardName,
                      'LOT': r.lotNumber, 'Hạn trả': r.expectedReturnDate ? new Date(r.expectedReturnDate).toLocaleDateString('vi-VN') : '',
                      'Trạng thái': 'QUÁ HẠN'
                  }));
                  XLSX.utils.sheet_add_json(ws, overdueData, { origin: `A${startRow + 1}`, skipHeader: false });
              }

              // Section C: All borrowed
              const borrowed = this.state.allStandardRequests().filter((r: any) => r.status === 'IN_PROGRESS');
              if (borrowed.length > 0) {
                  const startRow = 15 + (overdue.length > 0 ? overdue.length + 3 : 0);
                  XLSX.utils.sheet_add_aoa(ws, [["DANH SÁCH ĐANG MƯỢN"]], { origin: `A${startRow}` });
                  const borrowedData = borrowed.map((r: any, i: number) => ({
                      'STT': i + 1, 'Người mượn': r.requestedByName, 'Tên chuẩn': r.standardName,
                      'LOT': r.lotNumber, 'Ngày mượn': r.requestDate ? new Date(r.requestDate).toLocaleDateString('vi-VN') : '',
                      'Hạn trả': r.expectedReturnDate ? new Date(r.expectedReturnDate).toLocaleDateString('vi-VN') : ''
                  }));
                  XLSX.utils.sheet_add_json(ws, borrowedData, { origin: `A${startRow + 1}`, skipHeader: false });
              }

              this.formatSheet(ws, XLSX, 8, 20, [6, 22, 30, 18, 16, 16]);
              XLSX.utils.book_append_sheet(wb, ws, "Standards");
              sheetsAdded.push("Standards");
              
              this.exportProgress.update(p => ({ ...p, standards: 'done' }));
              await new Promise(r => setTimeout(r, 200));
          }

          // ===== COVER SHEET (Always first) =====
          {
              const coverWs = XLSX.utils.aoa_to_sheet([]);
              const approvedCount = this.state.approvedRequests().filter((req: any) => {
                  let d: Date;
                  if (req.analysisDate) {
                      const parts = req.analysisDate.split('-');
                      d = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
                  } else {
                      const ts = req.approvedAt || req.timestamp;
                      d = (ts && typeof ts.toDate === 'function') ? ts.toDate() : new Date(ts);
                  }
                  const s = new Date(start); s.setHours(0,0,0,0);
                  const e = new Date(end); e.setHours(23,59,59,999);
                  return d >= s && d <= e;
              }).length;

              const topSop = this.sopFrequencyData()[0];
              const stats = this.healthStats();

              XLSX.utils.sheet_add_aoa(coverWs, [
                  ["BÁO CÁO TỔNG HỢP HỆ THỐNG LIMS"],
                  [],
                  ["Đơn vị:", "Phòng thí nghiệm"],
                  ["Khoảng thời gian:", `${start}  đến  ${end}`],
                  ["SOP:", sopId === 'all' ? 'Tất cả quy trình' : this.getSelectedSopName()],
                  ["Người xuất báo cáo:", currentUser?.displayName || currentUser?.email || 'Admin'],
                  ["Ngày giờ xuất:", new Date().toLocaleString('vi-VN')],
                  [],
                  ["═══════════════════════════════════════════"],
                  ["CHỈ SỐ TỔNG QUAN (KPIs)"],
                  ["═══════════════════════════════════════════"],
                  [],
                  ["Tổng phiếu đã duyệt:", approvedCount],
                  ["Tổng mặt hàng tiêu hao:", this.consumptionData().length],
                  ["SOP chạy nhiều nhất:", topSop ? `${topSop.name} (${topSop.count} lần)` : 'N/A'],
                  ["Chuẩn đang mượn:", stats.borrowing],
                  ["Chuẩn quá hạn:", stats.overdue],
                  ["Chuẩn hết hạn:", stats.expired],
                  [],
                  ["═══════════════════════════════════════════"],
                  ["MỤC LỤC SHEETS"],
                  ["═══════════════════════════════════════════"],
                  [],
                  ...sheetsAdded.map((name, i) => [`${i + 1}. ${name}`])
              ], { origin: "A1" });

              this.formatSheet(coverWs, XLSX, 1, 25, [28, 40]);
              // Insert cover as first sheet
              XLSX.utils.book_append_sheet(wb, coverWs, "Trang Bìa");
              // Move cover to first position
              const sheetNames = wb.SheetNames;
              const coverIdx = sheetNames.indexOf("Trang Bìa");
              if (coverIdx > 0) {
                  sheetNames.splice(coverIdx, 1);
                  sheetNames.unshift("Trang Bìa");
              }
          }

          this.exportProgress.update(p => ({ ...p, cover: 'done' }));
          await new Promise(r => setTimeout(r, 300));

          XLSX.writeFile(wb, `BaoCao_TongHop_${start}_den_${end}.xlsx`);
          this.isExporting.set(false);

      } catch (e) {
          console.error(e);
          this.isExporting.set(false);
          alert('Đã xảy ra lỗi trong quá trình cấu trúc Báo cáo Excel. Vui lòng F5 và kiểm tra Logs.');
      }
  }

  // Handle native input event for specific day
  onSpecificDayChange(event: Event) {
      const val = parseInt((event.target as HTMLInputElement).value, 10);
      if (!isNaN(val)) this.specificDay.set(val);
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
      
      // Snapshot all filter values at the start to avoid race conditions
      // if the user changes a filter while the async operation is running.
      const startRaw = this.startDate();
      const endRaw = this.endDate();
      const sopId = this.selectedSopId();

      // Use local timezone perfectly without shifting 
      const start = new Date(startRaw + 'T00:00:00');
      const end = new Date(endRaw + 'T23:59:59.999');
      const startTime = start.getTime();
      const endTime = end.getTime();
      
      try {
          const inventory = await this.invService.getAllInventory();

          // Bug Fix: Fetch logs from 'start' up to 'today' (not just 'end') so we can
          // correctly calculate futureNetChange (movements AFTER the period end).
          // We need logs beyond 'end' to subtract from current stock to get end-of-period stock.
          const maxNow = new Date(); maxNow.setHours(23,59,59,999);
          const logs = await this.invService.getLogsByDateRange(start, maxNow);
          
          if (sopId === 'all') {
              const movements = new Map<string, { inPeriodImport: number, inPeriodExport: number, futureNetChange: number }>();
              inventory.forEach(item => movements.set(item.id, { inPeriodImport: 0, inPeriodExport: 0, futureNetChange: 0 }));

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
                      // finalStock can be used for absolute accuracy when available
                      if (log.finalStock !== undefined && targetId) {
                          // Stock was reduced to zero by deletion; handled via stock delta if logged
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
                      
                      if (logTime > endTime) {
                          // Movements AFTER the period: used to back-calculate end-of-period stock
                          entry.futureNetChange += change.delta;
                      } else {
                          // Movements WITHIN the period (start <= logTime <= end)
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
              // --- SOP-specific export detail mode ---
              const consumptionMap = new Map<string, number>();
              logs.forEach(log => {
                  const logTime = (log.timestamp as any).toDate ? (log.timestamp as any).toDate().getTime() : new Date(log.timestamp).getTime();
                  
                  // Bug Fix: filter by BOTH start and end date (was only checking <= end)
                  if (logTime >= startTime && logTime <= endTime) {
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
      
      // Build lookup maps by both ID and name for robust matching
      // consumptionData uses item.name which is the Firestore document ID (item ID)
      const invByIdMap = new Map(this.state.inventory().map(i => [i.id, i.category]));
      const invByNameMap = new Map(this.state.inventory().map(i => [i.name, i.category]));
      const stdByIdMap = new Map(this.state.standards().map((s: any) => [s.id, 'Chuẩn đối chiếu']));
      const stdByNameMap = new Map(this.state.standards().map((s: any) => [s.name, 'Chuẩn đối chiếu']));
      
      data.forEach(d => {
          // Priority: lookup by ID first (most reliable), then by display name as fallback
          let cat = invByIdMap.get(d.name) 
                 || invByNameMap.get(d.displayName) 
                 || stdByIdMap.get(d.name) 
                 || stdByNameMap.get(d.displayName) 
                 || 'Chưa phân loại';
          if (this.state.categoriesMap().has(cat)) {
              cat = this.state.categoriesMap().get(cat)!;
          }
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
}
