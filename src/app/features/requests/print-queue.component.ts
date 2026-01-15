
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Removed Router import
import { StateService } from '../../core/services/state.service';
import { AuthService } from '../../core/services/auth.service';
import { PrintService, PrintJob } from '../../core/services/print.service';
import { Log } from '../../core/models/log.model';
import { cleanName, formatNum, formatDate } from '../../shared/utils/utils';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-print-queue',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  template: `
    <div class="max-w-5xl mx-auto space-y-6 pb-20 fade-in h-full flex flex-col">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
            <h2 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <i class="fa-solid fa-print text-purple-500"></i> Hàng đợi In
            </h2>
            
            <div class="flex gap-2">
               @if(state.isAdmin()) {
                 <button (click)="deleteSelected()" [disabled]="selectedLogIds().size === 0"
                    class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-sm transition text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <i class="fa-solid fa-trash-can"></i> Xóa đã chọn ({{selectedLogIds().size}})
                 </button>
               }
               <button (click)="printSelected()" [disabled]="selectedLogIds().size === 0"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm transition text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  <i class="fa-solid fa-print"></i> In mục đã chọn ({{selectedLogIds().size}})
               </button>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
            <div class="flex-1 overflow-y-auto">
                <table class="w-full text-sm text-left">
                    <thead class="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 shadow-sm">
                        <tr>
                            <th class="px-3 py-3 w-12 text-center">
                               <input type="checkbox" [checked]="areAllSelected()" (change)="toggleSelectAll()" class="w-4 h-4 accent-blue-600 cursor-pointer">
                            </th>
                            <th class="px-4 py-3">Quy trình (SOP)</th>
                            <th class="px-4 py-3">Người duyệt</th>
                            <th class="px-4 py-3">Thời gian duyệt</th>
                            <th class="px-4 py-3 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        @if(isLoading()) {
                            @for(i of [1,2,3,4,5]; track i) {
                                <tr>
                                    <td class="px-3 py-3 text-center"><app-skeleton shape="rect" width="16px" height="16px" class="mx-auto"></app-skeleton></td>
                                    <td class="px-4 py-3">
                                        <app-skeleton width="150px" height="14px" class="mb-1"></app-skeleton>
                                        <app-skeleton width="80px" height="10px"></app-skeleton>
                                    </td>
                                    <td class="px-4 py-3"><app-skeleton width="100px" height="12px"></app-skeleton></td>
                                    <td class="px-4 py-3"><app-skeleton width="120px" height="12px"></app-skeleton></td>
                                    <td class="px-4 py-3 text-center flex justify-center gap-2">
                                        <app-skeleton shape="rect" width="30px" height="30px"></app-skeleton>
                                        <app-skeleton shape="rect" width="30px" height="30px"></app-skeleton>
                                    </td>
                                </tr>
                            }
                        } @else {
                            @for (log of filteredLogs(); track log.id) {
                                <tr class="transition hover:bg-slate-50" [class.bg-blue-50]="selectedLogIds().has(log.id)">
                                    <td class="px-3 py-2 text-center">
                                    <input type="checkbox" [checked]="selectedLogIds().has(log.id)" (change)="toggleSelection(log.id)" class="w-4 h-4 accent-blue-600 cursor-pointer">
                                    </td>
                                    <td class="px-4 py-2">
                                        <div class="font-bold text-slate-700">{{log.printData?.sop?.name}}</div>
                                        <div class="text-xs text-slate-400">{{log.printData?.sop?.category}}</div>
                                    </td>
                                    <td class="px-4 py-2 text-slate-600 font-medium">{{log.user}}</td>
                                    <td class="px-4 py-2 text-slate-500 text-xs">{{formatDate(log.timestamp)}}</td>
                                    <td class="px-4 py-2 text-center">
                                        <button (click)="printSingle(log)" class="text-blue-600 hover:text-blue-800 p-2 rounded-md transition" title="In phiếu này">
                                            <i class="fa-solid fa-print"></i>
                                        </button>
                                        @if (state.isAdmin()) {
                                        <button (click)="deleteSingle(log)" class="text-red-500 hover:text-red-700 p-2 rounded-md transition" title="Xóa phiếu này">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                        }
                                    </td>
                                </tr>
                            } @empty {
                                <tr>
                                    <td colspan="5" class="text-center py-20 text-slate-400">
                                        <i class="fa-solid fa-box-open text-4xl mb-3 text-slate-300"></i>
                                        <p>Không có phiếu in nào trong hàng đợi.</p>
                                    </td>
                                </tr>
                            }
                        }
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  `
})
export class PrintQueueComponent implements OnInit {
  state = inject(StateService);
  auth = inject(AuthService); 
  printService = inject(PrintService);
  
  isLoading = signal(true);
  selectedLogIds = signal<Set<string>>(new Set());
  formatDate = formatDate;

  ngOnInit() {
      if (this.state.printableLogs().length > 0) {
          this.isLoading.set(false);
      } else {
          setTimeout(() => this.isLoading.set(false), 800);
      }
  }

  filteredLogs = computed(() => {
      const all = this.state.printableLogs();
      const user = this.auth.currentUser();
      if (!user) return [];
      if (user.role === 'manager') return all;
      return all.filter(log => log.user === user.displayName);
  });

  areAllSelected = computed(() => {
    const visibleLogs = this.filteredLogs();
    return visibleLogs.length > 0 && visibleLogs.every(log => this.selectedLogIds().has(log.id));
  });

  toggleSelection(logId: string) {
    this.selectedLogIds.update(currentSet => {
      const newSet = new Set(currentSet);
      if (newSet.has(logId)) newSet.delete(logId);
      else newSet.add(logId);
      return newSet;
    });
  }

  toggleSelectAll() {
    const visibleIds = this.filteredLogs().map(log => log.id);
    if (this.areAllSelected()) {
      this.selectedLogIds.set(new Set());
    } else {
      this.selectedLogIds.set(new Set(visibleIds));
    }
  }

  // --- NEW: DIRECT PRINT LOGIC ---

  async printSingle(log: Log) {
    if (!log.printData) return;
    
    const printJob: PrintJob = {
      ...log.printData,
      date: log.timestamp.toDate ? log.timestamp.toDate() : new Date(log.timestamp),
      user: log.user,
      requestId: log.id // Use Log ID for QR
    };
    
    // Call Direct Print
    await this.printService.printDocument([printJob]);
  }

  async printSelected() {
    const ids = this.selectedLogIds();
    if (ids.size === 0) return;

    const logsToPrint = this.filteredLogs().filter(log => ids.has(log.id));
    const jobs: PrintJob[] = logsToPrint.map(log => ({
        ...log.printData!,
        date: log.timestamp.toDate ? log.timestamp.toDate() : new Date(log.timestamp), 
        user: log.user,
        requestId: log.id
    }));
    
    // Call Direct Print
    await this.printService.printDocument(jobs);
  }

  async deleteSingle(log: Log) {
    const sopName = log.printData?.sop.name || 'không rõ';
    await this.state.deletePrintLog(log.id, sopName);
  }

  async deleteSelected() {
    const ids = Array.from(this.selectedLogIds());
    if (ids.length > 0) {
        await this.state.deleteSelectedPrintLogs(ids);
        this.selectedLogIds.set(new Set());
    }
  }
}
