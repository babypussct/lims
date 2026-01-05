import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../services/state.service';
import { formatDate, formatNum } from '../utils/utils';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto space-y-6 pb-20 fade-in">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <i class="fa-solid fa-chart-line text-blue-500"></i> Báo cáo & Thống kê
            </h2>
            <div class="flex items-center gap-2">
               <!-- Health Badge -->
               <div class="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200">
                  <span class="relative flex h-2.5 w-2.5">
                     <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" 
                           [class.bg-green-400]="state.isSystemHealthy()" [class.bg-red-400]="!state.isSystemHealthy()"></span>
                     <span class="relative inline-flex rounded-full h-2.5 w-2.5" 
                           [class.bg-green-500]="state.isSystemHealthy()" [class.bg-red-500]="!state.isSystemHealthy()"></span>
                  </span>
                  <span class="text-xs font-bold" [class.text-slate-600]="state.isSystemHealthy()" [class.text-red-500]="!state.isSystemHealthy()">
                     {{ state.isSystemHealthy() ? 'System Healthy' : 'Connection Error' }}
                  </span>
               </div>
               
               <!-- Admin Tool -->
               <button (click)="state.rebuildStats()" class="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2">
                  <i class="fa-solid fa-hammer"></i> Rebuild Stats
               </button>
            </div>
        </div>

        <!-- Dashboard Cards (Mode 2: Aggregates) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        <!-- Mode 1: Detailed Logs with Filter -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                <h3 class="font-bold text-slate-700">Nhật ký hoạt động (Logs)</h3>
                <div class="flex items-center gap-2">
                   <label class="text-xs font-bold text-slate-500">Filter:</label>
                   <select [(ngModel)]="filterType" class="text-xs border border-slate-300 rounded px-2 py-1 outline-none focus:border-blue-500">
                      <option value="all">Tất cả</option>
                      <option value="APPROVE">Phê duyệt</option>
                      <option value="UPDATE">Cập nhật</option>
                   </select>
                </div>
            </div>
            <div class="overflow-x-auto max-h-[500px]">
                <table class="w-full text-sm text-left">
                    <thead class="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 shadow-sm">
                        <tr>
                            <th class="px-5 py-3">Thời gian</th>
                            <th class="px-5 py-3">Hành động</th>
                            <th class="px-5 py-3">Chi tiết</th>
                            <th class="px-5 py-3">Người dùng</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        @for (log of filteredLogs(); track log.id) {
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
    </div>
  `
})
export class StatisticsComponent {
  state = inject(StateService);
  formatDate = formatDate;
  formatNum = formatNum;
  
  filterType = signal<string>('all');

  filteredLogs = computed(() => {
     const logs = this.state.logs();
     const type = this.filterType();
     
     if (type === 'all') return logs;
     return logs.filter(l => l.action.includes(type));
  });
}