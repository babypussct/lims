import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StandardService } from '../standard.service';
import { UsageLog } from '../../../core/models/standard.model';
import { Unsubscribe } from 'firebase/firestore';

@Component({
  selector: 'app-standard-usage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],
  template: `
    <div class="flex flex-col space-y-4 fade-in h-full relative p-1 pb-6 custom-scrollbar overflow-y-auto overflow-x-hidden">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 px-2 mt-2">
        <div>
            <h1 class="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-fuchsia-600 text-white flex items-center justify-center shadow-lg shadow-fuchsia-200 dark:shadow-none transition-transform hover:scale-110">
                    <i class="fa-solid fa-clock-rotate-left text-lg"></i>
                </div>
                Nhật ký dùng chuẩn
            </h1>
            <p class="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1 ml-1">Lịch sử tiêu thụ và sử dụng hóa chất chuẩn toàn hệ thống</p>
        </div>
        <div class="flex gap-3 items-center">
             <button (click)="exportExcel()" class="group px-5 py-2.5 bg-green-600 text-white hover:bg-green-700 rounded-2xl shadow-xl shadow-green-100 dark:shadow-none transition-all font-black text-xs flex items-center gap-2 active:scale-95">
                <i class="fa-solid fa-file-excel text-sm transition-transform"></i> Xuất Excel
             </button>
        </div>
      </div>

      <!-- Filters Row -->
      <div class="bg-white dark:bg-slate-800 mx-2 p-4 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 flex flex-wrap gap-4 items-end">
          <div class="flex-1 min-w-[200px]">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Tìm kiếm</label>
              <div class="relative">
                  <i class="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input type="text" [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)" 
                         class="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-fuchsia-500 outline-none"
                         placeholder="Tên, lô, người dùng, ID...">
              </div>
          </div>
          
          <div class="w-40 min-w-[150px]">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Từ ngày</label>
              <input type="date" [ngModel]="fromDate()" (ngModelChange)="fromDate.set($event)"
                     class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-fuchsia-500 outline-none [color-scheme:light] dark:[color-scheme:dark]">
          </div>

          <div class="w-40 min-w-[150px]">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Đến ngày</label>
              <input type="date" [ngModel]="toDate()" (ngModelChange)="toDate.set($event)"
                     class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-fuchsia-500 outline-none [color-scheme:light] dark:[color-scheme:dark]">
          </div>
          
          <button (click)="clearFilters()" *ngIf="searchTerm() || fromDate() || toDate()" class="px-4 py-2.5 text-slate-400 hover:text-red-500 font-bold text-sm transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20">
              Xóa lọc
          </button>
      </div>

      <!-- Data Table -->
      <div class="flex flex-col bg-white dark:bg-slate-800 mx-2 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700 overflow-hidden flex-1">
          <div class="flex-1 overflow-x-auto custom-scrollbar">
              <table class="w-full text-left border-separate border-spacing-0">
                  <thead class="bg-slate-50/50 dark:bg-slate-800/80 sticky top-0 z-30">
                      <tr>
                          <th class="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700">Ngày lưu / NV dùng</th>
                          <th class="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700">Thông tin chuẩn</th>
                          <th class="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700 text-right">Lượng tiêu hao</th>
                          <th class="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700">Mục đích</th>
                      </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100/50 dark:divide-slate-800/50">
                      @if (isLoading()) {
                          @for(i of [1,2,3,4,5,6]; track i) {
                              <tr class="animate-pulse">
                                  <td colspan="4" class="px-6 py-4"><div class="h-10 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl w-full"></div></td>
                              </tr>
                          }
                      } @else {
                          @for (log of filteredLogs(); track log.id) {
                              <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                                  <td class="px-6 py-4">
                                      <div class="flex items-center gap-3">
                                          <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center font-black text-xs border border-indigo-100/50 dark:border-indigo-800/30">
                                              {{log.user.charAt(0).toUpperCase()}}
                                          </div>
                                          <div>
                                              <div class="text-[13px] font-black text-slate-800 dark:text-slate-200">{{log.user}}</div>
                                              <div class="text-[10px] font-bold text-slate-400">{{log.timestamp | date:'dd/MM/yyyy HH:mm'}}</div>
                                          </div>
                                      </div>
                                  </td>
                                  <td class="px-6 py-4">
                                      <div class="flex flex-col gap-0.5 max-w-[300px]">
                                          <span class="text-sm font-black text-slate-700 dark:text-slate-300 truncate" [title]="log.standardName || 'Không có tên'">
                                              {{log.standardName || '(Nhật ký cũ)'}}
                                          </span>
                                          <div class="flex flex-wrap gap-1.5 mt-1">
                                              @if(log.lotNumber) {
                                                  <span class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[9px] font-bold text-slate-500">Lot: {{log.lotNumber}}</span>
                                              }
                                              @if(log.internalId) {
                                                  <span class="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded text-[9px] font-bold text-blue-600 dark:text-blue-400">{{log.internalId}}</span>
                                              }
                                              @if(log.manufacturer) {
                                                  <span class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[9px] font-bold text-slate-500 truncate max-w-[80px]">{{log.manufacturer}}</span>
                                              }
                                          </div>
                                      </div>
                                  </td>
                                  <td class="px-6 py-4 text-right">
                                      <div class="text-sm font-black text-fuchsia-600 dark:text-fuchsia-400 flex flex-col items-end">
                                        -{{log.amount_used}} {{log.unit || 'mg'}}
                                      </div>
                                  </td>
                                  <td class="px-6 py-4">
                                      <span class="text-xs font-medium text-slate-600 dark:text-slate-400 italic line-clamp-2 max-w-[250px]" [title]="log.purpose || ''">
                                          {{log.purpose || 'Không ghi chú'}}
                                      </span>
                                  </td>
                              </tr>
                          }
                          @if (filteredLogs().length === 0) {
                              <tr>
                                  <td colspan="4" class="px-6 py-16 text-center">
                                      <div class="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300 dark:text-slate-600">
                                          <i class="fa-solid fa-clock-rotate-left text-2xl"></i>
                                      </div>
                                      <div class="text-sm font-bold text-slate-400">Không có dữ liệu sử dụng nào phù hợp</div>
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
export class StandardUsageComponent implements OnInit, OnDestroy {
  stdService = inject(StandardService);
  datePipe = inject(DatePipe);

  logs = signal<UsageLog[]>([]);
  isLoading = signal(true);
  
  searchTerm = signal('');
  fromDate = signal('');
  toDate = signal('');

  private sub!: Unsubscribe;

  filteredLogs = computed(() => {
     let result = this.logs();
     const search = this.searchTerm().trim().toLowerCase();
     const from = this.fromDate();
     const to = this.toDate();

     if (search) {
         result = result.filter(l => 
             (l.standardName && l.standardName.toLowerCase().includes(search)) ||
             (l.user && l.user.toLowerCase().includes(search)) ||
             (l.lotNumber && l.lotNumber.toLowerCase().includes(search)) ||
             (l.purpose && l.purpose.toLowerCase().includes(search)) ||
             (l.internalId && l.internalId.toLowerCase().includes(search)) ||
             (l.manufacturer && l.manufacturer.toLowerCase().includes(search)) ||
             (l.cas_number && l.cas_number.toLowerCase().includes(search))
         );
     }

     if (from) {
         const fromTime = new Date(from).getTime();
         result = result.filter(l => (l.timestamp || 0) >= fromTime);
     }

     if (to) {
         const toTime = new Date(to).setHours(23, 59, 59, 999);
         result = result.filter(l => (l.timestamp || 0) <= toTime);
     }

     return result;
  });

  ngOnInit() {
      this.sub = this.stdService.listenToGlobalUsageLogs((data) => {
          this.logs.set(data);
          this.isLoading.set(false);
      });
  }

  ngOnDestroy() {
      if (this.sub) this.sub();
  }

  clearFilters() {
      this.searchTerm.set('');
      this.fromDate.set('');
      this.toDate.set('');
  }

  async exportExcel() {
      if (this.filteredLogs().length === 0) return;
      
      try {
          const XLSX = await import('xlsx');
          const exportData = this.filteredLogs().map((log, index) => ({
              'STT': index + 1,
              'Ngày sử dụng': this.datePipe.transform(log.timestamp, 'dd/MM/yyyy HH:mm'),
              'Nhân viên': log.user,
              'Tên chất chuẩn': log.standardName || 'N/A',
              'Lot Number': log.lotNumber || '',
              'Mã phòng Lab': log.internalId || '',
              'Số CAS': log.cas_number || '',
              'Hãng sản xuất': log.manufacturer || '',
              'Lượng dùng': log.amount_used,
              'Đơn vị': log.unit || 'mg',
              'Mục đích / Ghi chú': log.purpose || ''
          }));

          const ws = XLSX.utils.json_to_sheet(exportData);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'NhatKySuDung');
          
          XLSX.writeFile(wb, `Nhat_Ky_Chuan_${this.datePipe.transform(Date.now(), 'yyyyMMdd_HHmm')}.xlsx`);
      } catch (err) {
          console.error('Lỗi khi xuất Excel:', err);
      }
  }
}
