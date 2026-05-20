import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../core/services/state.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { FirebaseService } from '../../core/services/firebase.service';
import { formatSampleList } from '../../shared/utils/utils';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-result-list',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  template: `
    <div class="h-full flex flex-col fade-in relative p-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 mb-6">
        <div>
          <h2 class="text-2xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <i class="fa-solid fa-square-poll-vertical text-fuchsia-600 dark:text-fuchsia-500"></i> Nhập Kết Quả Phân Tích
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Nhập kết quả, điền thông tin kiểm soát chất lượng (QC) và tạo phiếu kết quả tự động.
          </p>
        </div>

        <!-- Filter Tab -->
        <div class="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl self-start border border-slate-200 dark:border-slate-700">
          <button (click)="filterStatus.set('all')" 
                  class="px-4 py-2 text-xs font-bold rounded-lg transition" 
                  [class]="filterStatus() === 'all' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-sm ring-1 ring-black/5 dark:ring-white/5' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
            Tất cả @if(filteredCount('all') > 0) { <span class="ml-1 bg-slate-200 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-md text-[9px]">{{filteredCount('all')}}</span> }
          </button>
          <button (click)="filterStatus.set('pending')" 
                  class="px-4 py-2 text-xs font-bold rounded-lg transition" 
                  [class]="filterStatus() === 'pending' ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm ring-1 ring-black/5 dark:ring-white/5' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
            Chờ nhập @if(filteredCount('pending') > 0) { <span class="ml-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-md text-[9px]">{{filteredCount('pending')}}</span> }
          </button>
          <button (click)="filterStatus.set('draft')" 
                  class="px-4 py-2 text-xs font-bold rounded-lg transition" 
                  [class]="filterStatus() === 'draft' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-black/5 dark:ring-white/5' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
            Đang nháp @if(filteredCount('draft') > 0) { <span class="ml-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-1.5 py-0.5 rounded-md text-[9px]">{{filteredCount('draft')}}</span> }
          </button>
          <button (click)="filterStatus.set('completed')" 
                  class="px-4 py-2 text-xs font-bold rounded-lg transition" 
                  [class]="filterStatus() === 'completed' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm ring-1 ring-black/5 dark:ring-white/5' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
            Đã hoàn thành @if(filteredCount('completed') > 0) { <span class="ml-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-md text-[9px]">{{filteredCount('completed')}}</span> }
          </button>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar pb-20">
        @if (isLoading()) {
          <div class="grid md:grid-cols-2 gap-4">
            @for (i of [1,2,3,4]; track i) {
              <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-3">
                <app-skeleton width="80px" height="14px"></app-skeleton>
                <app-skeleton width="200px" height="20px"></app-skeleton>
                <app-skeleton width="140px" height="14px"></app-skeleton>
                <app-skeleton width="100%" height="32px"></app-skeleton>
              </div>
            }
          </div>
        } @else {
          <div class="grid md:grid-cols-2 gap-4">
            @for (run of displayedRuns(); track run.id) {
              <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition flex flex-col justify-between relative overflow-hidden group">
                <!-- Top Header Card -->
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <span [class]="getStatusClass(run.id)" class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border">
                      {{ getStatusText(run.id) }}
                    </span>
                    <span class="text-xs text-slate-400 dark:text-slate-500 font-medium">
                      <i class="fa-regular fa-calendar mr-1"></i>
                      {{ run.analysisDate ? formatAnalysisDate(run.analysisDate) : 'Không có ngày' }}
                    </span>
                  </div>

                  <!-- SOP Title -->
                  <h3 class="font-bold text-slate-800 dark:text-slate-200 text-lg mb-1 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors">
                    {{ run.sopName }}
                  </h3>
                  <div class="text-xs text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
                    <div class="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500">
                      <i class="fa-solid fa-user text-[9px]"></i>
                    </div>
                    <span class="font-bold text-slate-600 dark:text-slate-300">{{ run.user || 'Unknown' }}</span>
                  </div>

                  <!-- Sample Codes -->
                  @if (run.sampleList && run.sampleList.length > 0) {
                    <div class="mb-5 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 flex items-start gap-2">
                      <i class="fa-solid fa-vials text-slate-400 dark:text-slate-500 mt-0.5 shrink-0"></i>
                      <span class="break-all font-mono font-medium leading-relaxed">{{ formatSampleList(run.sampleList) }}</span>
                    </div>
                  }
                </div>

                <!-- Action Button -->
                <div class="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-4">
                  <span class="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                    {{ run.sampleList?.length || 0 }} mẫu phân tích
                  </span>
                  
                  <button (click)="enterResults(run.id)"
                          [class]="runStatusMap()[run.id] === 'completed' 
                            ? 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/20 hover:border-fuchsia-200 dark:hover:border-fuchsia-800/30'
                            : 'bg-fuchsia-600 dark:bg-fuchsia-500 text-white hover:bg-fuchsia-700 dark:hover:bg-fuchsia-600 shadow-sm'"
                          class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2">
                    <i class="fa-solid" [class.fa-pen-to-square]="runStatusMap()[run.id] !== 'completed'" [class.fa-arrows-rotate]="runStatusMap()[run.id] === 'completed'"></i>
                    {{ runStatusMap()[run.id] === 'completed' ? 'Chỉnh sửa / Re-print' : 'Nhập Kết quả' }}
                  </button>
                </div>
              </div>
            } @empty {
              <div class="col-span-full text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 border-dashed">
                <div class="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-500">
                  <i class="fa-solid fa-square-poll-vertical text-3xl"></i>
                </div>
                <p class="text-slate-500 dark:text-slate-400 font-medium text-sm">
                  Không tìm thấy mẻ nào phù hợp với bộ lọc hiện tại.
                </p>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class ResultListComponent implements OnInit, OnDestroy {
  private state = inject(StateService);
  private fb = inject(FirebaseService);
  private router = inject(Router);

  formatSampleList = formatSampleList;

  isLoading = signal(true);
  filterStatus = signal<'all' | 'pending' | 'draft' | 'completed'>('all');

  // Map lưu trữ trạng thái của từng requestId từ collection analysis_results
  runStatusMap = signal<Record<string, 'pending' | 'draft' | 'completed'>>({});
  private unsubscribes: (() => void)[] = [];

  ngOnInit() {
    this.listenToAnalysisResults();
  }

  ngOnDestroy() {
    this.unsubscribes.forEach(unsub => unsub());
  }

  private listenToAnalysisResults() {
    const q = query(collection(this.fb.db, 'artifacts', this.fb.APP_ID, 'analysis_results'));
    const unsub = onSnapshot(q, (snapshot) => {
      const statusMap: Record<string, 'pending' | 'draft' | 'completed'> = {};
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        statusMap[docSnap.id] = data['status'] || 'draft';
      });
      
      this.runStatusMap.set(statusMap);
      this.isLoading.set(false);
    }, (error) => {
      console.error('Error listening to analysis results:', error);
      this.isLoading.set(false);
    });
    
    this.unsubscribes.push(unsub);
  }

  // Danh sách các mẻ đã duyệt thành công
  allApprovedRuns = computed(() => {
    return this.state.approvedRequests() || [];
  });

  // Lọc danh sách mẻ hiển thị theo bộ lọc
  displayedRuns = computed(() => {
    const all = this.allApprovedRuns();
    const statusFilter = this.filterStatus();
    const statusMap = this.runStatusMap();

    return all.filter(run => {
      const status = statusMap[run.id] || 'pending';
      if (statusFilter === 'all') return true;
      return status === statusFilter;
    });
  });

  // Đếm số lượng mẻ theo bộ lọc để hiển thị badge số lượng
  filteredCount(status: 'all' | 'pending' | 'draft' | 'completed'): number {
    const all = this.allApprovedRuns();
    const statusMap = this.runStatusMap();
    if (status === 'all') return all.length;
    return all.filter(run => (statusMap[run.id] || 'pending') === status).length;
  }

  getStatusText(requestId: string): string {
    const status = this.runStatusMap()[requestId] || 'pending';
    switch (status) {
      case 'completed': return 'Đã hoàn thành';
      case 'draft': return 'Đang nháp';
      default: return 'Chờ nhập';
    }
  }

  getStatusClass(requestId: string): string {
    const status = this.runStatusMap()[requestId] || 'pending';
    switch (status) {
      case 'completed': 
        return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
      case 'draft': 
        return 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30';
      default: 
        return 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30';
    }
  }

  formatAnalysisDate(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  }

  enterResults(requestId: string) {
    this.router.navigate(['/results', requestId]);
  }
}
