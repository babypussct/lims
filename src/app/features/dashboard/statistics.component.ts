
import { Component, inject, signal, computed, effect, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../core/services/state.service';
import { AuthService } from '../../core/services/auth.service';
import { InventoryService } from '../../features/inventory/inventory.service';
import { formatDate, formatNum, cleanName, getAvatarUrl } from '../../shared/utils/utils';
import { Log } from '../../core/models/log.model';
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
  imports: [CommonModule, FormsModule],
  template: `
    @if (auth.canViewReports()) {
        <div class="h-full flex flex-col space-y-5 pb-6 fade-in overflow-hidden relative font-sans text-slate-800">
            
            <!-- 1. Header with Filters -->
            <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4 shrink-0 bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] z-20">
                <div>
                    <h2 class="text-xl font-black text-slate-800 flex items-center gap-2 tracking-tight">
                        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <i class="fa-solid fa-chart-pie text-sm"></i>
                        </div>
                        Báo cáo Quản trị
                    </h2>
                    <p class="text-xs font-medium text-slate-500 mt-1 ml-1">Phân tích hiệu suất & tiêu hao theo thời gian thực.</p>
                </div>

                <!-- Filters Area -->
                <div class="flex flex-col md:flex-row gap-3 items-end md:items-center flex-wrap">
                    
                    <!-- SOP Filter (NEW) -->
                    <div class="relative group min-w-[200px]">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i class="fa-solid fa-filter text-slate-400 text-xs"></i>
                        </div>
                        <select [ngModel]="selectedSopId()" (ngModelChange)="selectedSopId.set($event)" 
                                class="w-full pl-8 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition shadow-sm appearance-none cursor-pointer hover:bg-white">
                            <option value="all">Tất cả Quy trình (SOP)</option>
                            @for (sop of state.sops(); track sop.id) {
                                <option [value]="sop.id">{{sop.name}}</option>
                            }
                        </select>
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <i class="fa-solid fa-chevron-down text-slate-400 text-[10px]"></i>
                        </div>
                    </div>

                    <!-- Range Presets -->
                    <div class="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                        <button (click)="setRange('today')" 
                                class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all active:scale-95"
                                [class]="currentRangeType() === 'today' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'">
                            Hôm nay
                        </button>
                        <button (click)="setRange('month')" 
                                class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all active:scale-95"
                                [class]="currentRangeType() === 'month' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'">
                            Tháng này
                        </button>
                        <button (click)="setRange('year')" 
                                class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all active:scale-95"
                                [class]="currentRangeType() === 'year' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'">
                            Năm nay
                        </button>
                    </div>

                    <!-- Date Pickers -->
                    <div class="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 py-1.5 shadow-sm hover:border-blue-400 transition-colors group focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                        <div class="flex flex-col">
                            <label class="text-[9px] font-bold text-slate-400 leading-none uppercase">Từ ngày</label>
                            <input type="date" [ngModel]="startDate()" (ngModelChange)="onDateChange('start', $event)" 
                                class="text-xs font-bold text-slate-700 outline-none border-none p-0 bg-transparent w-24 cursor-pointer">
                        </div>
                        <div class="text-slate-300"><i class="fa-solid fa-arrow-right text-xs"></i></div>
                        <div class="flex flex-col">
                            <label class="text-[9px] font-bold text-slate-400 leading-none uppercase">Đến ngày</label>
                            <input type="date" [ngModel]="endDate()" (ngModelChange)="onDateChange('end', $event)"
                                class="text-xs font-bold text-slate-700 outline-none border-none p-0 bg-transparent w-24 cursor-pointer">
                        </div>
                    </div>
                </div>
            </div>

            <!-- 2. Detailed Data Tabs -->
            <div class="flex-1 flex flex-col min-h-0 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div class="flex border-b border-slate-100 px-6 pt-4 shrink-0 gap-8 bg-white overflow-x-auto">
                <button (click)="activeTab.set('logs')" 
                    class="pb-3 text-xs font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide whitespace-nowrap active:scale-95"
                    [class]="activeTab() === 'logs' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-400 hover:text-slate-600'">
                    <i class="fa-solid fa-clock-rotate-left"></i> 1. Nhật ký Hoạt động
                </button>
                <button (click)="activeTab.set('nxt')" 
                    class="pb-3 text-xs font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide whitespace-nowrap active:scale-95"
                    [class]="activeTab() === 'nxt' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-400 hover:text-slate-600'">
                    @if (selectedSopId() === 'all') {
                        <i class="fa-solid fa-boxes-packing"></i> 2. Báo cáo NXT (Kho)
                    } @else {
                        <i class="fa-solid fa-list-check"></i> 2. Chi tiết Xuất kho
                    }
                </button>
                <button (click)="activeTab.set('consumption')"
                    class="pb-3 text-xs font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide whitespace-nowrap active:scale-95"
                    [class]="activeTab() === 'consumption' ? 'border-orange-600 text-orange-700' : 'border-transparent text-slate-400 hover:text-slate-600'">
                    <i class="fa-solid fa-flask"></i> 3. Tiêu hao & Biểu đồ
                </button>
                <button (click)="activeTab.set('sops')"
                    class="pb-3 text-xs font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide whitespace-nowrap active:scale-95"
                    [class]="activeTab() === 'sops' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-400 hover:text-slate-600'">
                    <i class="fa-solid fa-list-ol"></i> 4. Tần suất SOP
                </button>
                </div>

                <div class="flex-1 overflow-y-auto p-0 relative bg-white custom-scrollbar">
                    
                    <!-- TAB 1: LOGS -->
                    @if (activeTab() === 'logs') {
                        <table class="w-full text-sm text-left">
                            <thead class="text-xs text-slate-500 uppercase bg-slate-50/50 sticky top-0 backdrop-blur-sm z-10 border-b border-slate-100">
                                <tr>
                                    <th class="px-6 py-3 font-bold">Ngày/Giờ</th>
                                    <th class="px-6 py-3 font-bold">Hoạt động</th>
                                    <th class="px-6 py-3 font-bold">Chi tiết</th>
                                    <th class="px-6 py-3 font-bold">Người thực hiện</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-50">
                                @for (log of filteredLogs(); track log.id) {
                                    <tr class="hover:bg-slate-50/80 transition group">
                                        <td class="px-6 py-4 text-slate-500 font-mono text-xs whitespace-nowrap">
                                            {{formatDate(log.timestamp)}}
                                        </td>
                                        <td class="px-6 py-4">
                                            <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border"
                                                [class.bg-blue-50]="log.action.includes('APPROVE')" [class.text-blue-700]="log.action.includes('APPROVE')" [class.border-blue-200]="log.action.includes('APPROVE')"
                                                [class.bg-emerald-50]="log.action.includes('STOCK_IN') || log.action.includes('UPDATE')" [class.text-emerald-700]="log.action.includes('STOCK_IN') || log.action.includes('UPDATE')" [class.border-emerald-200]="log.action.includes('STOCK_IN') || log.action.includes('UPDATE')"
                                                [class.bg-orange-50]="log.action.includes('STOCK_OUT')" [class.text-orange-700]="log.action.includes('STOCK_OUT')" [class.border-orange-200]="log.action.includes('STOCK_OUT')"
                                                [class.bg-red-50]="log.action.includes('DELETE') || log.action.includes('REVOKE')" [class.text-red-700]="log.action.includes('DELETE') || log.action.includes('REVOKE')" [class.border-red-200]="log.action.includes('DELETE') || log.action.includes('REVOKE')">
                                                {{log.action}}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 text-slate-700 text-xs font-medium max-w-xs truncate" [title]="log.details">
                                            {{log.details}}
                                        </td>
                                        <td class="px-6 py-4">
                                            <div class="flex items-center gap-2">
                                                <img [src]="getAvatarUrl(log.user)" class="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 object-cover">
                                                <span class="text-slate-600 font-medium text-xs">{{log.user}}</span>
                                            </div>
                                        </td>
                                    </tr>
                                } @empty {
                                    <tr><td colspan="4" class="p-12 text-center text-slate-400 italic">Không có dữ liệu trong khoảng thời gian này.</td></tr>
                                }
                            </tbody>
                        </table>
                    }

                    <!-- TAB 2: NXT / SOP EXPORT DETAIL -->
                    @if (activeTab() === 'nxt') {
                        <div class="flex flex-col h-full">
                            <div class="p-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center shrink-0">
                                <div>
                                    @if (selectedSopId() === 'all') {
                                        <h3 class="font-bold text-slate-700 flex items-center gap-2">
                                            <i class="fa-solid fa-table"></i> Bảng Kê Nhập - Xuất - Tồn
                                        </h3>
                                        <p class="text-xs text-slate-500 mt-0.5">Dữ liệu toàn cục của kho (theo ngày thực tế).</p>
                                    } @else {
                                        <h3 class="font-bold text-slate-700 flex items-center gap-2">
                                            <i class="fa-solid fa-list-check"></i> Chi tiết Xuất kho theo Quy trình
                                        </h3>
                                        <p class="text-xs text-slate-500 mt-0.5">Chỉ hiển thị lượng hóa chất đã xuất cho SOP: <span class="font-bold text-blue-600">{{getSelectedSopName()}}</span></p>
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
                                    <div class="absolute inset-0 bg-white/80 z-10 flex items-center justify-center flex-col gap-3">
                                        <div class="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                                        <span class="text-sm font-bold text-slate-600">Đang tải và tổng hợp dữ liệu...</span>
                                    </div>
                                }

                                <table class="w-full text-sm text-left border-collapse">
                                    <thead class="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-10 shadow-sm">
                                        <tr>
                                            <th class="px-4 py-3 border-b text-center w-10">#</th>
                                            <th class="px-4 py-3 border-b">Tên Hóa chất / Vật tư</th>
                                            <th class="px-4 py-3 border-b w-24 text-center">ĐVT</th>
                                            @if (selectedSopId() === 'all') {
                                                <th class="px-4 py-3 border-b text-right bg-blue-50/30 text-blue-800">Tồn Đầu</th>
                                                <th class="px-4 py-3 border-b text-right text-emerald-700">Nhập</th>
                                                <th class="px-4 py-3 border-b text-right text-orange-700">Xuất</th>
                                                <th class="px-4 py-3 border-b text-right bg-purple-50/30 text-purple-800 font-bold border-l border-slate-100">Tồn Cuối</th>
                                            } @else {
                                                <th class="px-4 py-3 border-b text-right text-orange-700 font-bold bg-orange-50/20">Tổng Xuất ({{getSelectedSopName()}})</th>
                                            }
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100">
                                        @for (row of nxtData(); track row.id; let i = $index) {
                                            <tr class="hover:bg-slate-50 transition">
                                                <td class="px-4 py-3 text-center text-xs text-slate-400">{{i+1}}</td>
                                                <td class="px-4 py-3">
                                                    <div class="font-bold text-slate-700 text-xs">{{row.name}}</div>
                                                    <div class="text-[10px] text-slate-400 font-mono">{{row.id}}</div>
                                                </td>
                                                <td class="px-4 py-3 text-center text-xs font-medium text-slate-500">{{row.unit}}</td>
                                                
                                                @if (selectedSopId() === 'all') {
                                                    <td class="px-4 py-3 text-right bg-blue-50/10 font-mono text-slate-600">{{formatNum(row.startStock)}}</td>
                                                    <td class="px-4 py-3 text-right font-mono text-emerald-600 font-bold">{{row.importQty > 0 ? '+' : ''}}{{formatNum(row.importQty)}}</td>
                                                    <td class="px-4 py-3 text-right font-mono text-orange-600 font-bold">{{row.exportQty > 0 ? '-' : ''}}{{formatNum(row.exportQty)}}</td>
                                                    <td class="px-4 py-3 text-right bg-purple-50/10 font-mono font-black text-slate-800 border-l border-slate-100">{{formatNum(row.endStock)}}</td>
                                                } @else {
                                                    <td class="px-4 py-3 text-right font-mono text-orange-600 font-bold text-base">{{formatNum(row.exportQty)}}</td>
                                                }
                                            </tr>
                                        } @empty {
                                            <tr><td [attr.colspan]="selectedSopId() === 'all' ? 7 : 4" class="p-16 text-center text-slate-400 italic">
                                                @if(!hasGenerated()) { Nhấn "Tính Toán" để xem báo cáo. } 
                                                @else { Không có dữ liệu. }
                                            </td></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }

                    <!-- TAB 3: CONSUMPTION -->
                    @if (activeTab() === 'consumption') {
                        <div class="flex flex-col h-full">
                            <div class="h-64 shrink-0 px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex flex-col justify-center">
                                <div class="flex justify-between items-center mb-2">
                                    <h4 class="text-xs uppercase font-bold text-slate-500 flex items-center gap-2">
                                        <i class="fa-solid fa-chart-simple"></i> Top 10 Tiêu hao
                                        @if(selectedSopId() !== 'all') { <span class="text-blue-600">({{getSelectedSopName()}})</span> }
                                    </h4>
                                </div>
                                <div class="flex-1 relative w-full h-full min-h-0 bg-white rounded-xl border border-slate-100 p-2 shadow-sm">
                                    <!-- Lazy Load Canvas -->
                                    @defer (on viewport) {
                                      <canvas #barChartCanvas></canvas>
                                    } @placeholder {
                                      <div class="flex items-center justify-center h-full text-slate-400">Loading Chart...</div>
                                    }
                                </div>
                            </div>
                            
                            <div class="flex-1 overflow-auto">
                                <table class="w-full text-sm text-left">
                                    <thead class="text-xs text-slate-500 uppercase bg-slate-50/80 sticky top-0 backdrop-blur-sm z-10">
                                        <tr>
                                            <th class="px-6 py-3 border-b w-12 text-center">#</th>
                                            <th class="px-6 py-3 border-b">Tên Hóa chất / Vật tư</th>
                                            <th class="px-6 py-3 border-b text-right">Tổng lượng dùng</th>
                                            <th class="px-6 py-3 border-b text-center w-32">Đơn vị</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-50">
                                        @for (item of consumptionData(); track item.name; let i = $index) {
                                            <tr class="hover:bg-slate-50 transition">
                                                <td class="px-6 py-3 text-center text-xs font-bold text-slate-400">{{i+1}}</td>
                                                <td class="px-6 py-3 font-semibold text-slate-700">
                                                    {{item.displayName}}
                                                    @if(item.name !== item.displayName) {
                                                        <span class="text-[10px] text-slate-400 font-mono ml-1">({{item.name}})</span>
                                                    }
                                                </td>
                                                <td class="px-6 py-3 text-right font-bold text-slate-800 font-mono text-base">{{formatNum(item.amount)}}</td>
                                                <td class="px-6 py-3 text-center">
                                                    <span [class]="getUnitClass(item.unit)" class="px-3 py-1 rounded-full text-[10px] font-bold border uppercase inline-block shadow-sm">{{item.unit}}</span>
                                                </td>
                                            </tr>
                                        } @empty {
                                            <tr><td colspan="4" class="p-12 text-center text-slate-400 italic">Chưa có dữ liệu tiêu hao cho tiêu chí lọc này.</td></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }

                    <!-- TAB 4: SOP FREQUENCY -->
                    @if (activeTab() === 'sops') {
                        <table class="w-full text-sm text-left">
                            <thead class="text-xs text-slate-500 uppercase bg-slate-50/80 sticky top-0 backdrop-blur-sm z-10 border-b border-slate-100">
                                <tr>
                                    <th class="px-6 py-3">Quy trình (SOP)</th>
                                    <th class="px-6 py-3 text-center">Số lần chạy (Runs)</th>
                                    <th class="px-6 py-3 text-center text-blue-700">Tổng Mẫu</th>
                                    <th class="px-6 py-3 text-center text-purple-700">Tổng QC</th>
                                    <th class="px-6 py-3 text-right w-48">Tỷ trọng</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-50">
                                @for (item of sopFrequencyData(); track item.name) {
                                    <tr class="hover:bg-slate-50 transition">
                                        <td class="px-6 py-4 font-bold text-slate-700">{{item.name}}</td>
                                        <td class="px-6 py-4 text-center font-bold text-slate-800 text-lg">{{item.count}}</td>
                                        <td class="px-6 py-4 text-center"><span class="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{{item.samples}}</span></td>
                                        <td class="px-6 py-4 text-center"><span class="font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">{{item.qcs}}</span></td>
                                        <td class="px-6 py-4 text-right align-middle">
                                        <div class="flex items-center gap-3 justify-end w-full">
                                            <div class="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner max-w-[100px]">
                                                <div class="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full" [style.width.%]="item.percent"></div>
                                            </div>
                                            <span class="text-xs font-bold text-slate-500 w-10 text-right">{{formatNum(item.percent)}}%</span>
                                        </div>
                                        </td>
                                    </tr>
                                } @empty {
                                    <tr><td colspan="5" class="p-12 text-center text-slate-400 italic">Chưa chạy quy trình nào trong thời gian này.</td></tr>
                                }
                            </tbody>
                        </table>
                    }
                </div>
            </div>
        </div>
    } @else {
        <div class="h-full flex items-center justify-center fade-in">
            <div class="bg-white p-8 rounded-2xl shadow-xl border border-red-100 max-w-md text-center">
                <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    <i class="fa-solid fa-lock"></i>
                </div>
                <h3 class="text-xl font-bold text-slate-800 mb-2">Quyền truy cập bị từ chối</h3>
                <p class="text-slate-500 text-sm mb-6">Bạn không có quyền xem Báo cáo Quản trị. Vui lòng liên hệ Quản lý (Manager) để được cấp quyền.</p>
                <div class="text-xs font-mono bg-slate-100 p-2 rounded text-slate-600">
                    Required Permission: <b>REPORT_VIEW</b>
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
  
  activeTab = signal<'logs' | 'consumption' | 'sops' | 'nxt'>('logs');
  currentRangeType = signal<'today' | 'month' | 'year' | 'custom'>('month');
  startDate = signal<string>(this.getFirstDayOfMonth());
  endDate = signal<string>(this.getToday());
  selectedSopId = signal<string>('all'); // New Signal for SOP Filter

  barChartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('barChartCanvas');
  private barChart: any = null;

  isLoading = signal(false);
  hasGenerated = signal(false);
  nxtData = signal<NxtReportItem[]>([]);

  constructor() {
    effect(() => {
        if (this.activeTab() === 'consumption') {
            setTimeout(() => this.createConsumptionBarChart(), 100);
        }
    });
  }

  // --- Actions ---
  onDateChange(type: 'start'|'end', val: string) {
      if(type === 'start') this.startDate.set(val);
      else this.endDate.set(val);
      this.currentRangeType.set('custom');
  }

  setRange(type: 'today' | 'month' | 'year') {
      this.currentRangeType.set(type);
      if (type === 'today') {
          const today = this.getToday();
          this.startDate.set(today); this.endDate.set(today);
      } else if (type === 'month') {
          this.startDate.set(this.getFirstDayOfMonth()); this.endDate.set(this.getToday());
      } else if (type === 'year') {
          this.startDate.set(this.getFirstDayOfYear()); this.endDate.set(this.getToday());
      }
  }

  private getToday(): string { return new Date().toISOString().split('T')[0]; }
  private getFirstDayOfMonth(): string { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0]; }
  private getFirstDayOfYear(): string { return new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]; }

  getUnitClass(unit: string): string { return (unit.includes('ml') || unit.includes('l')) ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-600 border-slate-200'; }

  getSelectedSopName(): string {
      const id = this.selectedSopId();
      if (id === 'all') return 'Tất cả';
      const sop = this.state.sops().find(s => s.id === id);
      return sop ? sop.name : id;
  }

  // --- NXT / EXPORT DETAIL REPORT LOGIC ---
  // MAINTAINED LOGIC: Use system timestamp / logs for Inventory Accuracy
  async generateNxtReport() {
      this.isLoading.set(true);
      this.nxtData.set([]);
      
      const start = new Date(this.startDate());
      const end = new Date(this.endDate());
      const endTime = new Date(end); endTime.setHours(23,59,59,999);
      const sopId = this.selectedSopId();
      
      try {
          // 1. Fetch ALL Inventory (Single Read)
          const inventory = await this.invService.getAllInventory();
          
          // 2. Fetch logs from StartDate until Now
          const today = new Date();
          const logs = await this.invService.getLogsByDateRange(start, today);
          
          // Option 2: Separate logic based on Filter
          if (sopId === 'all') {
              // --- Logic NXT (Full Stock) ---
              const movements = new Map<string, { inPeriodImport: number, inPeriodExport: number, futureNetChange: number }>();
              inventory.forEach(item => movements.set(item.id, { inPeriodImport: 0, inPeriodExport: 0, futureNetChange: 0 }));

              const endFilterTime = endTime.getTime();

              logs.forEach(log => {
                  const logTime = (log.timestamp as any).toDate ? (log.timestamp as any).toDate().getTime() : new Date(log.timestamp).getTime();
                  
                  // Helper to parse log details
                  const result: { id: string, delta: number }[] = [];
                  if (log.action.includes('STOCK')) {
                      const match = log.details.match(/kho\s+([a-zA-Z0-9_-]+):\s*([+-]?\d+(?:\.\d+)?)/);
                      if (match) { result.push({ id: match[1], delta: parseFloat(match[2]) }); }
                  }
                  else if (log.action.includes('APPROVE') && log.printData?.items) {
                      log.printData.items.forEach(item => {
                          if (item.isComposite) item.breakdown.forEach(sub => result.push({ id: sub.name, delta: -sub.totalNeed }));
                          else result.push({ id: item.name, delta: -item.stockNeed });
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
              // --- Logic Specific SOP Consumption (System Time Based for Warehouse check) ---
              const consumptionMap = new Map<string, number>();
              
              logs.forEach(log => {
                  const logTime = (log.timestamp as any).toDate ? (log.timestamp as any).toDate().getTime() : new Date(log.timestamp).getTime();
                  
                  // Filter by time range strictly within selected period
                  if (logTime <= endTime.getTime()) {
                      if (log.action.includes('APPROVE') && log.printData?.sop?.id === sopId && log.printData?.items) {
                          log.printData.items.forEach(item => {
                              if (item.isComposite) {
                                  item.breakdown.forEach(sub => {
                                      const cur = consumptionMap.get(sub.name) || 0;
                                      consumptionMap.set(sub.name, cur + sub.totalNeed);
                                  });
                              } else {
                                  const cur = consumptionMap.get(item.name) || 0;
                                  consumptionMap.set(item.name, cur + item.stockNeed);
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
                      startStock: 0, // N/A
                      importQty: 0, // N/A
                      exportQty: parseFloat(qty.toFixed(3)),
                      endStock: 0 // N/A
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

  filteredLogs = computed(() => {
      const start = new Date(this.startDate()); start.setHours(0,0,0,0);
      const end = new Date(this.endDate()); end.setHours(23,59,59,999);
      const sopId = this.selectedSopId();

      return this.state.logs().filter(log => {
          const d = (log.timestamp as any).toDate ? (log.timestamp as any).toDate() : new Date(log.timestamp);
          const inDate = d >= start && d <= end;
          
          if (!inDate) return false;
          if (sopId === 'all') return true;
          
          // Advanced Filter: Only show logs related to this SOP
          return log.printData?.sop?.id === sopId;
      });
  });

  consumptionData = computed(() => {
    const history = this.state.approvedRequests();
    const map = new Map<string, {amount: number, unit: string, displayName: string}>();
    
    // UPDATED LOGIC: Use Analysis Date when available
    const start = new Date(this.startDate()); start.setHours(0,0,0,0);
    const end = new Date(this.endDate()); end.setHours(23,59,59,999);
    const sopId = this.selectedSopId();

    history.forEach(req => {
        // PRIORITY: Analysis Date -> Approved Date -> Timestamp
        let d: Date;
        if (req.analysisDate) {
            // YYYY-MM-DD string. To ensure it's treated as local date, we parse parts.
            // Or simpler: new Date(req.analysisDate) usually defaults to UTC in some browsers, 
            // but for comparison with 'start' and 'end' created from string inputs, standard comparison works best.
            // Let's ensure midnight alignment.
            d = new Date(req.analysisDate);
            // Fix timezone potential issues by using the string YYYY-MM-DD if possible, 
            // but here we are comparing Date objects. 
            // A safe way for comparison:
            const parts = req.analysisDate.split('-');
            d = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
        } else {
            const ts = req.approvedAt || req.timestamp;
            d = (ts && typeof ts.toDate === 'function') ? ts.toDate() : new Date(ts);
        }

        // Compare
        if (d < start || d > end) return;

        // Check SOP Filter
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
    
    // UPDATED LOGIC: Use Analysis Date when available
    const start = new Date(this.startDate()); start.setHours(0,0,0,0);
    const end = new Date(this.endDate()); end.setHours(23,59,59,999);
    const sopId = this.selectedSopId();

    // Filter First
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

        map.set(req.sopName, { 
            count: current.count + 1,
            samples: current.samples + s,
            qcs: current.qcs + q
        });
    });

    return Array.from(map.entries())
        .map(([name, val]) => ({ name, count: val.count, samples: val.samples, qcs: val.qcs, percent: (val.count/total)*100 }))
        .sort((a,b) => b.count - a.count);
  });

  async createConsumptionBarChart() {
      const canvas = this.barChartCanvas()?.nativeElement;
      if (!canvas) return;
      
      const existing = Chart.getChart(canvas);
      if (existing) existing.destroy();
      if (this.barChart) {
          this.barChart.destroy();
          this.barChart = null;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const data = this.consumptionData().slice(0, 10);
      const labels = data.map(d => d.displayName || d.name);
      const values = data.map(d => d.amount);
      
      this.barChart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: labels,
              datasets: [{ label: 'Tiêu thụ', data: values, backgroundColor: 'rgba(59, 130, 246, 0.5)', borderColor: 'rgba(59, 130, 246, 1)', borderWidth: 1 }]
          },
          options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
      });
  }
}
