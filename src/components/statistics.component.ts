
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../services/state.service';
import { formatDate, formatNum, cleanName } from '../utils/utils';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto space-y-6 pb-20 fade-in h-full flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between shrink-0">
            <h2 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <i class="fa-solid fa-chart-line text-blue-500"></i> Báo cáo & Thống kê
            </h2>
            <div class="flex bg-slate-200 p-1 rounded-lg">
               <button (click)="activeTab.set('overview')" 
                  class="px-4 py-1.5 text-sm font-bold rounded-md transition"
                  [class]="activeTab() === 'overview' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'">
                  Tổng quan
               </button>
               <button (click)="activeTab.set('consumption')"
                  class="px-4 py-1.5 text-sm font-bold rounded-md transition"
                  [class]="activeTab() === 'consumption' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'">
                  Tiêu hao Hóa chất
               </button>
               <button (click)="activeTab.set('sops')"
                  class="px-4 py-1.5 text-sm font-bold rounded-md transition"
                  [class]="activeTab() === 'sops' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'">
                  Tần suất SOP
               </button>
            </div>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto">
            
            <!-- Tab: Overview (Original Logs) -->
            @if (activeTab() === 'overview') {
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                        <div class="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                            <i class="fa-solid fa-flask"></i>
                        </div>
                        <div>
                            <div class="text-slate-500 text-xs font-bold uppercase tracking-wider">SOP Đã Chạy</div>
                            <div class="text-2xl font-bold text-slate-800">{{formatNum(state.stats().totalSopsRun || 0)}}</div>
                        </div>
                    </div>
                    <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                        <div class="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
                            <i class="fa-solid fa-dolly"></i>
                        </div>
                        <div>
                            <div class="text-slate-500 text-xs font-bold uppercase tracking-wider">Hạng mục Tiêu thụ</div>
                            <div class="text-2xl font-bold text-slate-800">{{formatNum(state.stats().totalItemsUsed || 0)}}</div>
                        </div>
                    </div>
                    <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                        <div class="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                            <i class="fa-solid fa-clock-rotate-left"></i>
                        </div>
                        <div>
                            <div class="text-slate-500 text-xs font-bold uppercase tracking-wider">Cập nhật cuối</div>
                            <div class="text-sm font-bold text-slate-800">{{formatDate(state.stats().lastUpdated)}}</div>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div class="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                        <h3 class="font-bold text-slate-700">Nhật ký hoạt động (Logs)</h3>
                        @if(state.isAdmin()) {
                            <button (click)="clearLogs()" class="text-xs font-bold text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-100 transition flex items-center gap-2">
                                <i class="fa-solid fa-trash"></i> Xóa Nhật ký
                            </button>
                        }
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left">
                            <thead class="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
                                <tr>
                                    <th class="px-5 py-3">Thời gian</th>
                                    <th class="px-5 py-3">Hành động</th>
                                    <th class="px-5 py-3">Chi tiết</th>
                                    <th class="px-5 py-3">Người dùng</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                @for (log of state.logs(); track log.id) {
                                    <tr class="hover:bg-slate-50 transition">
                                        <td class="px-5 py-3 text-slate-500 whitespace-nowrap">{{formatDate(log.timestamp)}}</td>
                                        <td class="px-5 py-3">
                                            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                                                  [class.bg-blue-100]="log.action.includes('APPROVE')" [class.text-blue-800]="log.action.includes('APPROVE')"
                                                  [class.bg-green-100]="log.action.includes('UPDATE')" [class.text-green-800]="log.action.includes('UPDATE')"
                                                  [class.bg-red-100]="log.action.includes('DELETE')" [class.text-red-800]="log.action.includes('DELETE')">
                                                {{log.action}}
                                            </span>
                                        </td>
                                        <td class="px-5 py-3 text-slate-700 font-medium">{{log.details}}</td>
                                        <td class="px-5 py-3 text-slate-500">{{log.user}}</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            }

            <!-- Tab: Consumption (Aggregated) -->
            @if (activeTab() === 'consumption') {
                 <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div class="px-5 py-4 border-b border-slate-200 bg-slate-50/50">
                        <h3 class="font-bold text-slate-700">Tổng hợp Tiêu hao (100 giao dịch gần nhất)</h3>
                        <p class="text-xs text-slate-500">Số liệu được cộng dồn từ lịch sử phê duyệt.</p>
                    </div>
                    <table class="w-full text-sm text-left">
                        <thead class="text-xs text-slate-500 uppercase bg-slate-50">
                            <tr>
                                <th class="px-5 py-3">Tên Hóa chất / Vật tư</th>
                                <th class="px-5 py-3 text-right">Tổng Đã dùng</th>
                                <th class="px-5 py-3 text-center">Đơn vị</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            @for (item of consumptionData(); track item.name) {
                                <tr class="hover:bg-slate-50">
                                    <td class="px-5 py-3 font-medium text-slate-700">{{resolveName(item.name)}}</td>
                                    <td class="px-5 py-3 text-right font-bold text-blue-700">{{formatNum(item.amount)}}</td>
                                    <td class="px-5 py-3 text-center text-slate-500">{{item.unit}}</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                 </div>
            }

            <!-- Tab: SOPs (Aggregated) -->
            @if (activeTab() === 'sops') {
                 <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div class="px-5 py-4 border-b border-slate-200 bg-slate-50/50">
                        <h3 class="font-bold text-slate-700">Tần suất chạy SOP (100 giao dịch gần nhất)</h3>
                    </div>
                    <table class="w-full text-sm text-left">
                        <thead class="text-xs text-slate-500 uppercase bg-slate-50">
                            <tr>
                                <th class="px-5 py-3">Tên Quy trình (SOP)</th>
                                <th class="px-5 py-3 text-right">Số lần chạy</th>
                                <th class="px-5 py-3 text-right w-1/3">Tỷ lệ</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            @for (item of sopFrequencyData(); track item.name) {
                                <tr class="hover:bg-slate-50">
                                    <td class="px-5 py-3 font-medium text-slate-700">{{item.name}}</td>
                                    <td class="px-5 py-3 text-right font-bold text-purple-700">{{item.count}}</td>
                                    <td class="px-5 py-3 text-right">
                                       <div class="w-full bg-slate-100 rounded-full h-2 mb-1">
                                          <div class="bg-purple-500 h-2 rounded-full" [style.width.%]="item.percent"></div>
                                       </div>
                                       <span class="text-xs text-slate-400">{{formatNum(item.percent)}}%</span>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                 </div>
            }
        </div>
    </div>
  `
})
export class StatisticsComponent {
  state = inject(StateService);
  formatDate = formatDate;
  formatNum = formatNum;
  cleanName = cleanName;
  
  activeTab = signal<'overview' | 'consumption' | 'sops'>('overview');

  resolveName(id: string): string {
    return this.state.inventoryMap()[id]?.name || id;
  }
  
  clearLogs() {
    this.state.clearAllLogs();
  }

  consumptionData = computed(() => {
    const history = this.state.approvedRequests();
    const map = new Map<string, {amount: number, unit: string}>();

    history.forEach(req => {
        req.items.forEach(item => {
            const current = map.get(item.name) || { amount: 0, unit: item.stockUnit || item.unit };
            // Ensure we use the amount deducted from stock (item.amount) which is normalized
            map.set(item.name, { 
                amount: current.amount + item.amount, 
                unit: current.unit 
            });
        });
    });

    return Array.from(map.entries()).map(([name, val]) => ({ name, ...val })).sort((a,b) => b.amount - a.amount);
  });

  sopFrequencyData = computed(() => {
    const history = this.state.approvedRequests();
    const total = history.length;
    if (total === 0) return [];

    const map = new Map<string, number>();
    history.forEach(req => {
        const count = map.get(req.sopName) || 0;
        map.set(req.sopName, count + 1);
    });

    return Array.from(map.entries())
        .map(([name, count]) => ({ name, count, percent: (count/total)*100 }))
        .sort((a,b) => b.count - a.count);
  });
}
