
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../core/services/state.service';
import { AuthService } from '../../core/services/auth.service';
import { cleanName, formatNum, formatDate } from '../../shared/utils/utils';
import { Request } from '../../core/models/request.model';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  template: `
    <div class="max-w-5xl mx-auto space-y-6 pb-20 fade-in">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <i class="fa-solid fa-list-check text-blue-500"></i> Quản lý Yêu cầu
            </h2>
            <div class="flex bg-slate-200 p-1 rounded-lg self-start">
               <button (click)="currentTab.set('pending')" class="px-4 py-1.5 text-sm font-bold rounded-md transition flex items-center gap-2" [class]="currentTab() === 'pending' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'"><i class="fa-solid fa-clock"></i> Chờ duyệt ({{state.requests().length}})</button>
               <button (click)="currentTab.set('approved')" class="px-4 py-1.5 text-sm font-bold rounded-md transition flex items-center gap-2" [class]="currentTab() === 'approved' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'"><i class="fa-solid fa-check-double"></i> Lịch sử ({{filteredHistory().length}})</button>
            </div>
        </div>
        <div class="grid gap-4">
            @if(isLoading()) {
                <!-- Skeleton Loading Cards -->
                @for(i of [1,2,3]; track i) {
                    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex gap-4">
                        <div class="flex-1 space-y-2">
                            <app-skeleton width="120px" height="16px"></app-skeleton>
                            <app-skeleton width="250px" height="24px"></app-skeleton>
                            <app-skeleton width="150px" height="14px"></app-skeleton>
                            <div class="mt-4 p-3 border border-slate-100 rounded-lg">
                                <app-skeleton width="100%" height="12px" class="mb-2 block"></app-skeleton>
                                <app-skeleton width="80%" height="12px"></app-skeleton>
                            </div>
                        </div>
                        <div class="w-32 hidden md:flex flex-col gap-2">
                            <app-skeleton width="100%" height="36px" shape="rect"></app-skeleton>
                            <app-skeleton width="100%" height="36px" shape="rect"></app-skeleton>
                        </div>
                    </div>
                }
            } @else {
                @for (req of displayRequests(); track req.id) {
                    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 transition hover:shadow-md relative overflow-hidden">
                        
                        <!-- Loading Overlay for Item -->
                        @if(processingId() === req.id) {
                            <div class="absolute inset-0 bg-white/60 z-20 flex items-center justify-center">
                                <div class="bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 border border-slate-100">
                                    <i class="fa-solid fa-spinner fa-spin text-blue-600"></i> <span class="text-xs font-bold text-slate-600">Đang xử lý...</span>
                                </div>
                            </div>
                        }

                        <div class="flex-1">
                            <div class="flex items-center gap-3 mb-2">
                                 @if (req.status === 'pending') {
                                    <span class="px-2 py-0.5 rounded bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider">Chờ duyệt</span>
                                 } @else {
                                    <span class="px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">Đã duyệt</span>
                                 }
                                 <span class="text-xs text-slate-500 font-medium flex items-center gap-1">
                                    <i class="fa-solid fa-calendar-check text-slate-400"></i>
                                    Ngày phân tích: 
                                    <span class="text-slate-700 font-bold">{{ getAnalysisDate(req) }}</span>
                                 </span>
                            </div>
                            <h3 class="font-bold text-slate-800 text-lg mb-1">{{req.sopName}}</h3>
                            <div class="text-sm text-slate-500 mb-3">Người yêu cầu: <span class="font-medium text-slate-700">{{req.user || 'Unknown'}}</span></div>
                            <div class="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                 <table class="w-full text-sm">
                                    <tr class="text-xs text-slate-400 uppercase text-left"><th class="pb-1">Hóa chất</th><th class="pb-1 text-right">Số lượng</th></tr>
                                    @for (item of req.items; track item.name) {
                                        <tr class="border-t border-slate-100"><td class="py-1.5 font-medium text-slate-700">{{resolveName(item.name)}}</td><td class="py-1.5 text-right font-bold text-slate-600">{{formatNum(item.displayAmount)}} <span class="text-[10px] text-slate-400 font-normal">{{item.unit}}</span></td></tr>
                                    }
                                 </table>
                            </div>
                        </div>
                        @if(state.isAdmin()) {
                            <div class="flex flex-row md:flex-col gap-2 shrink-0 md:w-32">
                                @if (currentTab() === 'pending') {
                                    <button (click)="approve(req)" [disabled]="!!processingId()" class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm transition text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                        <i class="fa-solid fa-check"></i> Duyệt
                                    </button>
                                    <button (click)="reject(req)" [disabled]="!!processingId()" class="flex-1 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg font-bold transition text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                        <i class="fa-solid fa-xmark"></i> Từ chối
                                    </button>
                                } @else {
                                    <button (click)="revoke(req)" [disabled]="!!processingId()" class="flex-1 px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-bold shadow-sm transition text-sm flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed">
                                        <i class="fa-solid fa-rotate-left group-hover:-rotate-90 transition"></i> Hoàn tác
                                    </button>
                                }
                            </div>
                        } @else {
                            @if(currentTab() === 'pending') {
                                <div class="flex flex-col items-center justify-center w-32 shrink-0 text-slate-400 gap-1 opacity-50"><i class="fa-solid fa-lock text-xl"></i><span class="text-[10px] uppercase font-bold text-center">Đang chờ<br>Duyệt</span></div>
                            } @else {
                                <!-- Approved Item for Staff (View Only) -->
                                <div class="flex flex-col items-center justify-center w-32 shrink-0 text-green-500 gap-1">
                                    <i class="fa-solid fa-circle-check text-2xl"></i>
                                    <span class="text-[10px] uppercase font-bold text-center">Hoàn thành</span>
                                </div>
                            }
                        }
                    </div>
                } @empty {
                    <div class="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed"><i class="fa-solid fa-clipboard-check text-4xl text-slate-300 mb-3"></i><p class="text-slate-500">{{ currentTab() === 'pending' ? 'Không có yêu cầu nào đang chờ.' : 'Chưa có lịch sử phê duyệt.' }}</p></div>
                }
            }
        </div>
    </div>
  `
})
export class RequestListComponent implements OnInit {
  state = inject(StateService);
  auth = inject(AuthService);
  cleanName = cleanName; formatNum = formatNum; formatDate = formatDate;
  currentTab = signal<'pending' | 'approved'>('pending');
  processingId = signal<string | null>(null);
  
  isLoading = signal(true);

  ngOnInit() {
      // Simulate fetch delay
      if(this.state.requests().length > 0) {
          this.isLoading.set(false);
      } else {
          setTimeout(() => this.isLoading.set(false), 800);
      }
  }

  // Filtered History based on User Role
  filteredHistory = computed(() => {
      const all = this.state.approvedRequests();
      const user = this.auth.currentUser();
      
      // If Manager, show all
      if (user?.role === 'manager') return all;
      
      // If Staff, show only requests where req.user matches display name
      return all.filter(r => r.user === user?.displayName);
  });

  displayRequests = computed(() => this.currentTab() === 'pending' ? this.state.requests() : this.filteredHistory());
  
  resolveName(id: string): string { return this.state.inventoryMap()[id]?.name || id; }

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
