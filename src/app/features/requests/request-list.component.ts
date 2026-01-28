
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../core/services/state.service';
import { AuthService } from '../../core/services/auth.service';
import { cleanName, formatNum, formatDate, formatSampleList } from '../../shared/utils/utils';
import { Request, RequestItem } from '../../core/models/request.model';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { PrintQueueComponent } from './print-queue.component';
import { DateRangeFilterComponent } from '../../shared/components/date-range-filter/date-range-filter.component';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [CommonModule, SkeletonComponent, PrintQueueComponent, DateRangeFilterComponent],
  template: `
    <div class="h-full flex flex-col fade-in relative">
        <!-- Header & Tabs -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 mb-6">
            <div>
                <h2 class="text-2xl font-black text-slate-800 flex items-center gap-2">
                    <i class="fa-solid fa-list-check text-blue-600"></i> Quản lý Yêu cầu
                </h2>
                <p class="text-xs text-slate-500 mt-1">Phê duyệt yêu cầu và in phiếu pha chế.</p>
            </div>
            
            <div class="flex bg-slate-100 p-1.5 rounded-xl self-start border border-slate-200">
               <button (click)="currentTab.set('pending')" 
                       class="px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-2" 
                       [class]="currentTab() === 'pending' ? 'bg-white text-orange-600 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'">
                   <i class="fa-solid fa-clock"></i> Chờ duyệt 
                   @if(state.requests().length > 0) { <span class="bg-orange-100 text-orange-700 px-1.5 rounded-md text-[10px]">{{state.requests().length}}</span> }
               </button>
               
               <button (click)="currentTab.set('approved')" 
                       class="px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-2" 
                       [class]="currentTab() === 'approved' ? 'bg-white text-green-600 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'">
                   <i class="fa-solid fa-check-double"></i> Lịch sử
               </button>

               <button (click)="currentTab.set('printing')" 
                       class="px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-2" 
                       [class]="currentTab() === 'printing' ? 'bg-white text-purple-600 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'">
                   <i class="fa-solid fa-print"></i> Hàng đợi In
                   @if(state.printableLogs().length > 0) { <span class="bg-purple-100 text-purple-700 px-1.5 rounded-md text-[10px]">{{state.printableLogs().length}}</span> }
               </button>
            </div>
        </div>

        <!-- DATE FILTER (Only for History Tab) -->
        @if (currentTab() === 'approved') {
            <div class="mb-4 flex justify-end">
                <app-date-range-filter 
                    [initStart]="startDate()" 
                    [initEnd]="endDate()" 
                    (dateChange)="onDateRangeChange($event)">
                </app-date-range-filter>
            </div>
        }

        <!-- CONTENT AREA -->
        <div class="flex-1 min-h-0 relative">
            
            <!-- TAB: PRINT QUEUE -->
            @if (currentTab() === 'printing') {
                <app-print-queue class="h-full block"></app-print-queue>
            } 
            
            <!-- TAB: LISTS (Pending / Approved) -->
            @else {
                <div class="h-full overflow-y-auto custom-scrollbar pb-20 pr-2">
                    <div class="grid gap-4 max-w-5xl mx-auto">
                        @if(isLoading()) {
                            @for(i of [1,2,3]; track i) {
                                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex gap-4">
                                    <div class="flex-1 space-y-2">
                                        <app-skeleton width="120px" height="16px"></app-skeleton>
                                        <app-skeleton width="250px" height="24px"></app-skeleton>
                                        <app-skeleton width="150px" height="14px"></app-skeleton>
                                    </div>
                                </div>
                            }
                        } @else {
                            @for (req of displayRequests(); track req.id) {
                                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 transition hover:shadow-md relative overflow-hidden group">
                                    
                                    @if(processingId() === req.id) {
                                        <div class="absolute inset-0 bg-white/80 z-20 flex items-center justify-center backdrop-blur-sm">
                                            <div class="bg-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 border border-slate-100">
                                                <i class="fa-solid fa-circle-notch fa-spin text-blue-600"></i> 
                                                <span class="text-sm font-bold text-slate-600">Đang xử lý...</span>
                                            </div>
                                        </div>
                                    }

                                    <div class="flex-1">
                                        <div class="flex items-center gap-3 mb-2">
                                             @if (req.status === 'pending') {
                                                <span class="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-wider border border-orange-100">Chờ duyệt</span>
                                             } @else {
                                                <span class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider border border-emerald-100">Đã duyệt</span>
                                             }
                                             <span class="text-xs text-slate-400 font-medium flex items-center gap-1">
                                                <i class="fa-regular fa-calendar"></i>
                                                {{ getAnalysisDate(req) }}
                                             </span>
                                        </div>
                                        
                                        <h3 class="font-bold text-slate-800 text-lg mb-1 group-hover:text-blue-600 transition-colors">{{req.sopName}}</h3>
                                        <div class="text-xs text-slate-500 mb-4 flex items-center gap-2">
                                            <div class="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"><i class="fa-solid fa-user text-[10px]"></i></div>
                                            <span class="font-bold text-slate-600">{{req.user || 'Unknown'}}</span>
                                        </div>

                                        <!-- Sample List Summary -->
                                        @if(req.sampleList && req.sampleList.length > 0) {
                                            <div class="mb-3 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-start gap-2">
                                                <i class="fa-solid fa-vial text-slate-400 mt-0.5"></i>
                                                <span class="break-words font-mono font-medium">{{ formatSampleList(req.sampleList) }}</span>
                                            </div>
                                        }

                                        <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                             <table class="w-full text-sm">
                                                <thead>
                                                    <tr class="text-[10px] text-slate-400 uppercase text-left font-bold tracking-wider">
                                                        <th class="pb-2">Hóa chất</th>
                                                        <th class="pb-2 text-right">Lượng dùng</th>
                                                    </tr>
                                                </thead>
                                                <tbody class="divide-y divide-slate-100">
                                                    @for (item of req.items; track item.name) {
                                                        <tr>
                                                            <td class="py-2 font-medium text-slate-600 text-xs">{{getItemName(item)}}</td>
                                                            <td class="py-2 text-right font-bold text-slate-700 font-mono text-xs">
                                                                {{formatNum(item.displayAmount)}} <span class="text-[10px] text-slate-400 font-normal">{{item.unit}}</span>
                                                            </td>
                                                        </tr>
                                                    }
                                                </tbody>
                                             </table>
                                        </div>
                                    </div>

                                    @if(state.isAdmin()) {
                                        <div class="flex flex-row md:flex-col gap-2 shrink-0 md:w-36 mt-2 md:mt-0">
                                            @if (currentTab() === 'pending') {
                                                <button (click)="approve(req)" [disabled]="!!processingId()" 
                                                        class="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm hover:shadow-md transition text-xs uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                                    <i class="fa-solid fa-check"></i> Duyệt
                                                </button>
                                                <button (click)="reject(req)" [disabled]="!!processingId()" 
                                                        class="flex-1 px-4 py-2.5 bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-slate-600 rounded-xl font-bold transition text-xs uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                                    <i class="fa-solid fa-xmark"></i> Từ chối
                                                </button>
                                            } @else {
                                                <button (click)="revoke(req)" [disabled]="!!processingId()" 
                                                        class="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-500 hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50 rounded-xl font-bold shadow-sm transition text-xs uppercase tracking-wide flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed">
                                                    <i class="fa-solid fa-rotate-left group-hover:-rotate-90 transition-transform duration-300"></i> Hoàn tác
                                                </button>
                                            }
                                        </div>
                                    } @else {
                                        @if(currentTab() === 'pending') {
                                            <div class="flex flex-col items-center justify-center md:w-32 shrink-0 text-slate-300 gap-2 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                                <i class="fa-solid fa-hourglass-half text-2xl animate-pulse"></i>
                                                <span class="text-[10px] uppercase font-bold text-center">Đang chờ<br>quản lý duyệt</span>
                                            </div>
                                        } @else {
                                            <div class="flex flex-col items-center justify-center md:w-32 shrink-0 text-emerald-500 gap-2 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                                                <i class="fa-solid fa-circle-check text-2xl"></i>
                                                <span class="text-[10px] uppercase font-bold text-center">Hoàn thành</span>
                                            </div>
                                        }
                                    }
                                </div>
                            } @empty {
                                <div class="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
                                    <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                        <i class="fa-solid fa-inbox text-3xl"></i>
                                    </div>
                                    <p class="text-slate-500 font-medium text-sm">
                                        {{ currentTab() === 'pending' ? 'Không có yêu cầu nào đang chờ.' : 'Không có dữ liệu lịch sử trong khoảng thời gian này.' }}
                                    </p>
                                </div>
                            }
                        }
                    </div>
                </div>
            }
        </div>
    </div>
  `
})
export class RequestListComponent implements OnInit {
  state = inject(StateService);
  auth = inject(AuthService);
  cleanName = cleanName; formatNum = formatNum; formatDate = formatDate; formatSampleList = formatSampleList;
  
  currentTab = signal<'pending' | 'approved' | 'printing'>('pending');
  processingId = signal<string | null>(null);
  isLoading = signal(true);

  // Date Filters for History
  startDate = signal<string>(this.getFirstDayOfMonth());
  endDate = signal<string>(this.getToday());

  ngOnInit() {
      // Check data loaded
      if(this.state.requests().length > 0) {
          this.isLoading.set(false);
      } else {
          setTimeout(() => this.isLoading.set(false), 800);
      }
  }

  private getToday(): string { return new Date().toISOString().split('T')[0]; }
  private getFirstDayOfMonth(): string { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0]; }

  onDateRangeChange(range: { start: string, end: string, label: string }) {
      this.startDate.set(range.start);
      this.endDate.set(range.end);
  }

  filteredHistory = computed(() => {
      const all = this.state.approvedRequests();
      const user = this.auth.currentUser();
      
      const start = new Date(this.startDate()); start.setHours(0,0,0,0);
      const end = new Date(this.endDate()); end.setHours(23,59,59,999);

      return all.filter(req => {
          // Date Filter
          let d: Date;
          // Priority: Analysis Date (if exists) -> Approved At -> Timestamp
          if (req.analysisDate) {
              const parts = req.analysisDate.split('-');
              d = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
          } else {
              const ts = req.approvedAt || req.timestamp;
              d = (ts && typeof ts.toDate === 'function') ? ts.toDate() : new Date(ts);
          }
          
          if (d < start || d > end) return false;

          // User Filter
          if (user?.role === 'manager') return true;
          return req.user === user?.displayName;
      });
  });

  displayRequests = computed(() => this.currentTab() === 'pending' ? this.state.requests() : this.filteredHistory());
  
  getItemName(item: RequestItem): string { 
      if (item.displayName) return item.displayName;
      return item.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  getAnalysisDate(req: Request): string {
      if (req.analysisDate) {
          const [year, month, day] = req.analysisDate.split('-');
          return `${day}/${month}/${year}`;
      }
      const timestamp = req.timestamp;
      const d = (timestamp && typeof timestamp.toDate === 'function') ? timestamp.toDate() : new Date(timestamp);
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
  }

  async approve(req: Request) {
      if (this.processingId()) return;
      this.processingId.set(req.id);
      try { await this.state.approveRequest(req); } finally { this.processingId.set(null); }
  }

  async reject(req: Request) {
      if (this.processingId()) return;
      this.processingId.set(req.id);
      try { await this.state.rejectRequest(req); } finally { this.processingId.set(null); }
  }

  async revoke(req: Request) {
      if (this.processingId()) return;
      this.processingId.set(req.id);
      try { await this.state.revokeApproval(req); } finally { this.processingId.set(null); }
  }
}
