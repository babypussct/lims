import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StateService } from '../../../core/services/state.service';
import { StandardService } from '../standard.service';
import { StandardRequest, StandardRequestStatus, ReferenceStandard, PurchaseRequest } from '../../../core/models/standard.model';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { AuthService } from '../../../core/services/auth.service';
import { Unsubscribe } from 'firebase/firestore';

function removeAccents(str: string): string {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

import { RequestsKanbanComponent } from './components/requests-kanban.component';
import { RequestsTableComponent } from './components/requests-table.component';
import { CreateRequestDrawerComponent } from './components/create-request-drawer.component';
import { RequestsActionModalsComponent, ActionModalMode } from './components/requests-action-modals.component';

@Component({
  selector: 'app-standard-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RequestsKanbanComponent, RequestsTableComponent, CreateRequestDrawerComponent, RequestsActionModalsComponent],
  template: `
    <div class="flex flex-col space-y-4 fade-in h-full relative p-1 pb-6 overflow-hidden">
      <!-- Header Area -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 px-2 mt-2">
        <div>
            <h1 class="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none transition-transform hover:scale-110">
                    <i class="fa-solid fa-clipboard-list text-lg"></i>
                </div>
                Quản lý Yêu cầu Chuẩn
            </h1>
            <p class="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1 ml-1">Theo dõi, cấp phát và thu hồi chuẩn đối chiếu</p>
        </div>
        
        <div class="flex gap-3 items-center">
             @if (auth.canApproveStandards() && pendingPurchaseRequestsCount() > 0) {
                 <button (click)="openAdminPurchaseRequests()" class="group relative px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl shadow-lg shadow-amber-200 dark:shadow-none transition-all font-black text-xs flex items-center gap-2 active:scale-95">
                     <i class="fa-solid fa-cart-shopping animate-bounce"></i> Yêu cầu Mua sắm
                     <div class="absolute -top-2 -right-2 px-2 py-0.5 min-w-[24px] h-6 flex items-center justify-center bg-red-600 text-white rounded-full text-[10px] font-black border-2 border-white dark:border-slate-900 shadow-md">{{pendingPurchaseRequestsCount()}}</div>
                 </button>
             }
             <button (click)="openRequestModal()" class="group px-5 py-2.5 bg-slate-900 dark:bg-indigo-600 text-white hover:bg-slate-800 dark:hover:bg-indigo-500 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none transition-all font-black text-xs flex items-center gap-2 active:scale-95">
                <i class="fa-solid fa-plus-circle text-sm group-hover:rotate-90 transition-transform"></i> Tạo Yêu cầu Mới
             </button>
        </div>
      </div>


      <!-- Main Section: List & Filter -->
      <div class="flex flex-col flex-1 bg-white dark:bg-slate-800 mx-2 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700 overflow-hidden min-h-0">
          
          <!-- Modern Tab Filters & Search -->
          <div class="p-4 border-b border-slate-50 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md sticky top-0 z-40">
              <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <!-- Segmented Tabs -->
                  <div class="flex items-center gap-1 p-1 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar max-w-full">
                      <button (click)="statusFilter.set('ALL')" 
                              [class]="statusFilter() === 'ALL' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50'"
                              class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap">
                          Tất cả <span class="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded-md text-[10px] opacity-70">{{statusCounts().ALL}}</span>
                      </button>
                      <button (click)="statusFilter.set('PENDING_APPROVAL')" 
                              [class]="statusFilter() === 'PENDING_APPROVAL' ? 'bg-white dark:bg-slate-800 shadow-sm text-amber-600 dark:text-amber-400' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50'"
                              class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap">
                          Chờ duyệt <span class="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 rounded-md text-[10px] opacity-70 text-amber-600">{{statusCounts().PENDING_APPROVAL}}</span>
                      </button>
                      <button (click)="statusFilter.set('IN_PROGRESS')" 
                              [class]="statusFilter() === 'IN_PROGRESS' ? 'bg-white dark:bg-slate-800 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50'"
                              class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap">
                          Đang dùng <span class="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md text-[10px] opacity-70 text-emerald-600">{{statusCounts().IN_PROGRESS}}</span>
                      </button>
                      <button (click)="statusFilter.set('PENDING_RETURN')" 
                              [class]="statusFilter() === 'PENDING_RETURN' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50'"
                              class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap">
                          Chờ trả <span class="px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-md text-[10px] opacity-70 text-indigo-600">{{statusCounts().PENDING_RETURN}}</span>
                      </button>
                      <button (click)="statusFilter.set('COMPLETED')" 
                              [class]="statusFilter() === 'COMPLETED' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-600 dark:text-slate-300' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50'"
                              class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap">
                          Hoàn thành <span class="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded-md text-[10px] opacity-70">{{statusCounts().COMPLETED}}</span>
                      </button>
                  </div>

                  <!-- Search & View Toggle -->
                  <div class="flex items-center gap-2">
                       <div class="flex items-center bg-slate-100/50 dark:bg-slate-900/50 rounded-xl p-1 border border-slate-100 dark:border-slate-800">
                           <button (click)="viewMode.set('kanban')" [class]="viewMode() === 'kanban' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'" class="w-8 h-8 rounded-lg flex items-center justify-center transition-all text-sm" title="Giao diện Thẻ (Kanban)">
                               <i class="fa-solid fa-columns"></i>
                           </button>
                           <button (click)="viewMode.set('table')" [class]="viewMode() === 'table' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'" class="w-8 h-8 rounded-lg flex items-center justify-center transition-all text-sm" title="Giao diện Bảng (Table)">
                               <i class="fa-solid fa-list"></i>
                           </button>
                       </div>
                      <div class="relative min-w-[250px]">
                          <i class="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                          <input type="text" [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)" 
                                 class="w-full pl-11 pr-4 py-2 bg-slate-100/50 dark:bg-slate-900/50 border border-transparent rounded-xl text-[13px] font-bold text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder-slate-400"
                                 placeholder="Tìm tên chuẩn, người mượn, số lô...">
                      </div>
                  </div>
              </div>
          </div>

          <!-- Content Area based on View Mode -->
          @if(viewMode() === 'kanban') {
              <app-requests-kanban 
                  [requests]="filteredRequests()"
                  (actionApprove)="approveRequest($event)"
                  (actionReject)="openRejectModal($event)"
                  (actionLogUsage)="openLogUsageModal($event)"
                  (actionReturn)="openReturnModal($event.req, $event.isForce)"
                  (actionAdminReceive)="openAdminReceiveModal($event)"
                  (actionDelete)="hardDeleteHistory($event)">
              </app-requests-kanban>
          } @else {
              <app-requests-table
                  [requests]="filteredRequests()"
                  [isLoading]="isLoading()"
                  (actionApprove)="approveRequest($event)"
                  (actionReject)="openRejectModal($event)"
                  (actionLogUsage)="openLogUsageModal($event)"
                  (actionReturn)="openReturnModal($event.req, $event.isForce)"
                  (actionAdminReceive)="openAdminReceiveModal($event)"
                  (actionDelete)="hardDeleteHistory($event)">
              </app-requests-table>
          }
      </div>

      <app-requests-action-modals
          [activeModal]="activeModal()"
          [request]="selectedRequest()"
          [standard]="currentStandard()"
          [isForceReturn]="isForceReturn()"
          [isProcessing]="isProcessing()"
          (close)="closeActionModal()"
          (approveAction)="confirmApprove($event)"
          (rejectAction)="confirmReject($event)"
          (logUsageAction)="confirmLogUsage($event)"
          (returnAction)="confirmReturn($event)"
          (adminReceiveAction)="confirmAdminReceive($event)">
      </app-requests-action-modals>

      <!-- ADMIN PURCHASE REQUESTS MODAL -->
      @if (showPurchaseRequestsAdminModal()) {
         <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
             <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                 <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex justify-between items-center shrink-0">
                     <h3 class="font-black text-slate-800 dark:text-slate-100 text-lg flex items-center gap-2">
                         <div class="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                             <i class="fa-solid fa-cart-shopping"></i>
                         </div>
                         Duyệt Yêu cầu Mua sắm (Hết chuẩn)
                     </h3>
                     <button (click)="closeAdminPurchaseRequests()" class="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-500 transition active:scale-95"><i class="fa-solid fa-times"></i></button>
                 </div>
                 <div class="flex-1 overflow-auto p-6 bg-slate-50 dark:bg-slate-900">
                     @if(loadingAdminRequests()) {
                         <div class="py-12 flex justify-center"><i class="fa-solid fa-spinner fa-spin text-2xl text-indigo-500"></i></div>
                     } @else {
                         @if(adminPurchaseRequests().length === 0) {
                             <div class="py-12 text-center text-slate-500 dark:text-slate-400 font-medium">Không có yêu cầu mua sắm nào chờ xử lý.</div>
                         } @else {
                             <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                                 <table class="w-full text-left text-sm whitespace-nowrap">
                                     <thead class="bg-slate-50 dark:bg-slate-800/80 text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                                         <tr>
                                             <th class="px-4 py-3">Chuẩn đối chiếu</th>
                                             <th class="px-4 py-3">Phân loại & Mục đích</th>
                                             <th class="px-4 py-3">Yêu cầu mua sắm</th>
                                             <th class="px-4 py-3">Người đề nghị</th>
                                             <th class="px-4 py-3 text-center">Tác vụ</th>
                                         </tr>
                                     </thead>
                                     <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                                         @for(r of adminPurchaseRequests(); track r.id) {
                                             <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                                 <td class="px-4 py-3 align-top">
                                                     <div class="font-bold text-slate-800 dark:text-slate-200 whitespace-normal line-clamp-2 max-w-[200px]" [title]="r.standardName">{{r.standardName}}</div>
                                                     <div class="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mt-1"><i class="fa-solid fa-barcode mr-1"></i> {{r.product_code}}</div>
                                                 </td>
                                                 <td class="px-4 py-3 align-top">
                                                     <div class="flex flex-col gap-1.5 text-[11px]">
                                                         @if(r.required_level) {
                                                            <div class="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded w-max">
                                                                <i class="fa-solid fa-shield-halved"></i> {{r.required_level}}
                                                            </div>
                                                         }
                                                         @if(r.required_purity) {
                                                            <div class="flex items-center gap-1.5 font-bold text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 px-2 py-0.5 rounded w-max">
                                                                <i class="fa-solid fa-droplet"></i> ĐTK: {{r.required_purity}}
                                                            </div>
                                                         }
                                                         @if(r.notes) {
                                                            <div class="text-slate-600 dark:text-slate-400 mt-1 max-w-[250px] whitespace-normal italic bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded" [title]="r.notes">
                                                                <i class="fa-regular fa-comment text-slate-400"></i> {{r.notes}}
                                                            </div>
                                                         }
                                                     </div>
                                                 </td>
                                                 <td class="px-4 py-3 align-top">
                                                     <div class="flex flex-col gap-1 text-[11px] text-slate-600 dark:text-slate-300">
                                                         @if(r.preferred_manufacturer) { 
                                                            <div class="flex gap-2">
                                                                <span class="w-16 text-slate-400 font-medium">Hãng CC:</span>
                                                                <span class="font-black text-slate-800 dark:text-slate-100 uppercase">{{r.preferred_manufacturer}}</span>
                                                            </div> 
                                                         }
                                                         @if(r.expectedAmount) { 
                                                            <div class="flex gap-2">
                                                                <span class="w-16 text-slate-400 font-medium">Lượng cần:</span>
                                                                <span class="font-bold text-indigo-600 dark:text-indigo-400">{{r.expectedAmount}}</span>
                                                            </div>
                                                         }
                                                     </div>
                                                 </td>
                                                 <td class="px-4 py-3 align-top">
                                                     <div class="flex flex-col gap-1">
                                                         <div class="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                                             <div class="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] text-slate-500"><i class="fa-solid fa-user"></i></div>
                                                             {{r.requestedByName}}
                                                         </div>
                                                         <div class="text-[11px] text-slate-500 ml-6"><i class="fa-regular fa-clock mr-1"></i> {{r.requestDate | date:'dd/MM/yyyy HH:mm'}}</div>
                                                         @if(r.priority === 'HIGH') {
                                                             <div class="ml-6 mt-1">
                                                                 <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50 uppercase tracking-widest"><i class="fa-solid fa-bolt mr-1"></i> GẤP</span>
                                                             </div>
                                                         }
                                                     </div>
                                                 </td>
                                                 <td class="px-4 py-3 text-center align-top">
                                                     <button (click)="markPurchaseRequestCompleted(r)" [disabled]="isProcessing()" class="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-emerald-200 dark:shadow-none transition disabled:opacity-50 active:scale-95 flex items-center gap-1.5 mx-auto">
                                                         <i class="fa-solid fa-check"></i> Đã nhận hàng
                                                     </button>
                                                 </td>
                                             </tr>
                                         }
                                     </tbody>
                                 </table>
                             </div>
                         }
                     }
                 </div>
             </div>
         </div>
      }

    </div>
  `
})
export class StandardRequestsComponent implements OnInit, OnDestroy {
  stdService = inject(StandardService);
  state = inject(StateService);
  toast = inject(ToastService);
  confirmationService = inject(ConfirmationService);
  auth = inject(AuthService);
  fb = inject(FormBuilder);

  requests = signal<StandardRequest[]>([]);
  availableStandards = signal<ReferenceStandard[]>([]);
  allStandards = signal<ReferenceStandard[]>([]);
  
  searchTerm = signal('');
  statusFilter = signal<string>('ALL');
  viewMode = signal<'kanban' | 'table'>('kanban');
  
  isLoading = signal(true);
  isProcessing = signal(false);
  showModal = signal(false);
  
  selectedRequest = signal<StandardRequest | null>(null);
  activeModal = signal<ActionModalMode>(null);
  isForceReturn = signal(false);

  currentStandard = computed(() => {
      const req = this.selectedRequest();
      if (!req) return null;
      return this.allStandards().find(s => s.id === req.standardId) || null;
  });

  // Admin Purchase Requests
  showPurchaseRequestsAdminModal = signal(false);
  loadingAdminRequests = signal(false);
  adminPurchaseRequests = signal<PurchaseRequest[]>([]);
  pendingPurchaseRequestsCount = signal(0);
  private purchaseReqUnsub?: Unsubscribe;
  
  private unsubRequests: Unsubscribe | null = null;
  /** Hàm bỏ đăng ký khỏi live listener singleton — KHÔNG hủy listener */
  private unregisterLiveListener?: () => void;

  filteredRequests = computed(() => {
    let reqs = this.requests();
    const term = removeAccents(this.searchTerm().toLowerCase());
    const status = this.statusFilter();
    const stdsMap = new Map(this.allStandards().map(s => [s.id, s]));
    const currentUser = this.auth.currentUser();
    const isAdmin = this.auth.canApproveStandards();

    // Filter for non-admins to only see their own requests (for the main list)
    let displayReqs = [...reqs];
    if (!isAdmin && currentUser) {
        displayReqs = displayReqs.filter(r => r.requestedBy === currentUser.uid);
    }

    if (status !== 'ALL') {
        displayReqs = displayReqs.filter(r => r.status === status);
    }

    if (term) {
        displayReqs = displayReqs.filter(r => 
            removeAccents(r.standardName.toLowerCase()).includes(term) || 
            removeAccents(r.requestedByName.toLowerCase()).includes(term) ||
            (r.lotNumber && removeAccents(r.lotNumber.toLowerCase()).includes(term))
        );
    }
    
    return displayReqs.map(r => ({
        ...r,
        standardDetails: stdsMap.get(r.standardId)
    }));
  });

  // Status Counts for Tabs (Admin views all, Users view theirs)
  statusCounts = computed(() => {
      const reqs = this.requests();
      const currentUser = this.auth.currentUser();
      const isAdmin = this.auth.canApproveStandards();
      
      const filtered = isAdmin ? reqs : reqs.filter(r => r.requestedBy === currentUser?.uid);
      
      return {
          ALL: filtered.length,
          PENDING_APPROVAL: filtered.filter(r => r.status === 'PENDING_APPROVAL').length,
          IN_PROGRESS: filtered.filter(r => r.status === 'IN_PROGRESS').length,
          PENDING_RETURN: filtered.filter(r => r.status === 'PENDING_RETURN').length,
          COMPLETED: filtered.filter(r => r.status === 'COMPLETED').length,
          REJECTED: filtered.filter(r => r.status === 'REJECTED').length
      };
  });

  ngOnInit() {
    // Requests listener (bounded query limit 300, giữ nguyên)
    this.unsubRequests = this.stdService.listenToRequests((reqs) => {
        this.requests.set(reqs);
        this.isLoading.set(false);
    });

    // Pha 1: Delta Load — apply localStorage ngay + sync chỉ docs thay đổi
    this.stdService.loadStandardsWithDeltaSync().then((stds: ReferenceStandard[]) => {
        this.allStandards.set(stds);
        this.availableStandards.set(stds.filter(s => s.status !== 'IN_USE'));
    });

    // Pha 2: Live Listener Singleton — chia sẻ với StandardsComponent nếu đã mở
    this.unregisterLiveListener = this.stdService.startRealtimeDeltaListener(() => {
        const mem = this.stdService['_memStandards'];
        if (mem) {
            this.allStandards.set([...mem]);
            this.availableStandards.set(mem.filter((s: ReferenceStandard) => s.status !== 'IN_USE'));
        }
    });

    // Admin: lắng nghe purchase requests (bounded by where status==PENDING)
    if (this.auth.canApproveStandards()) {
        this.purchaseReqUnsub = this.stdService.listenToPendingPurchaseRequests((reqs) => {
            this.adminPurchaseRequests.set(reqs);
            this.pendingPurchaseRequestsCount.set(reqs.length);
            this.loadingAdminRequests.set(false);
        });
    }
  }

  ngOnDestroy() {
    if (this.unsubRequests) this.unsubRequests();
    // Chỉ remove callback khỏi singleton listener — KHÔNG dừng listener
    if (this.unregisterLiveListener) this.unregisterLiveListener();
    if (this.purchaseReqUnsub) this.purchaseReqUnsub();
  }

  // --- Purchase Requests Logic (Admin) ---
  openAdminPurchaseRequests() {
      if (!this.auth.canApproveStandards()) return;
      this.loadingAdminRequests.set(true);
      this.showPurchaseRequestsAdminModal.set(true);
      setTimeout(() => this.loadingAdminRequests.set(false), 300);
  }

  closeAdminPurchaseRequests() {
      this.showPurchaseRequestsAdminModal.set(false);
  }

  async markPurchaseRequestCompleted(req: PurchaseRequest) {
      if (!req.id) return;
      this.confirmationService.confirm({
          message: `Xác nhận bạn đã MUA và NHẬN ĐƯỢC chuẩn "${req.standardName}"? Cần cập nhật số lượng tồn kho theo số liệu thực tế sau khi nhận.`,
          confirmText: 'Đã nhận',
          cancelText: 'Hủy'
      }).then(async (confirmed) => {
          if (confirmed) {
              this.isProcessing.set(true);
              try {
                  const uid = this.auth.currentUser()?.uid || '';
                  const uname = this.auth.currentUser()?.displayName || this.auth.currentUser()?.email || 'Admin';
                  const reqId = req.id as string;
                  await this.stdService.completePurchaseRequest(reqId, req.standardId, uid, uname);
                  this.toast.show('Đã hoàn thành yêu cầu mua sắm. Vui lòng cập nhật số lượng tồn kho của chuẩn!', 'success');
              } catch (e: any) {
                  this.toast.show('Lỗi: ' + e.message, 'error');
              } finally {
                  this.isProcessing.set(false);
              }
          }
      });
  }

  openRequestModal() {
      this.showModal.set(true);
  }

  closeModal() {
      this.showModal.set(false);
  }

  async submitRequest(event: { standardIds: string[], purpose: string, expectedReturnDate?: number }) {
      if (event.standardIds.length === 0 || this.isProcessing()) return;
      
      const user = this.auth.currentUser();
      if (!user) {
          this.toast.show('Bạn cần đăng nhập để thực hiện', 'error');
          return;
      }
      
      this.isProcessing.set(true);
      let createdCount = 0;
      let skippedCount = 0;
      try {
          for (const stdId of event.standardIds) {
              const std = this.availableStandards().find(s => s.id === stdId);
              if (!std) continue;

              // [BUG-4] Kiểm tra request trùng lặp: người dùng đã có yêu cầu đang hoạt động cho chuẩn này chưa
              const hasActiveRequest = this.requests().some(r =>
                  r.standardId === stdId &&
                  r.requestedBy === user.uid &&
                  ['PENDING_APPROVAL', 'IN_PROGRESS', 'PENDING_RETURN'].includes(r.status)
              );
              if (hasActiveRequest) {
                  this.toast.show(`"​${std.name}" đã có yêu cầu của bạn đang hoạt động, bỏ qua.`, 'info');
                  skippedCount++;
                  continue;
              }
              
              const req: StandardRequest = {
                  standardId: std.id,
                  standardName: std.name,
                  lotNumber: std.lot_number,
                  requestedBy: user.uid,
                  requestedByName: user.displayName || user.email || 'Unknown',
                  requestDate: Date.now(),
                  purpose: event.purpose,
                  status: 'PENDING_APPROVAL',
                  totalAmountUsed: 0
              };
              
              req.expectedReturnDate = event.expectedReturnDate ?? null;
              
              await this.stdService.createRequest(req);
              createdCount++;
          }
          
          if (createdCount > 0) {
              this.toast.show(`Đã gửi ${createdCount} yêu cầu thành công${skippedCount > 0 ? ` (bỏ qua ${skippedCount} trùng lặp)` : ''}`, 'success');
          } else if (skippedCount > 0) {
              this.toast.show('Tất cả chuẩn đã chọn đều đã có yêu cầu đang hoạt động.', 'info');
          }
          this.closeModal();
      } catch (e: any) {
          this.toast.show('Lỗi: ' + (e.message || e), 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }

  async hardDeleteHistory(req: StandardRequest) {
      this.confirmationService.confirm({
          message: `XÓA YÊU CẦU: Thao tác này sẽ dọn dẹp các bản ghi nhật ký tự động và HOÀN TÁC dư lượng của chuẩn "${req.standardName}". Dữ liệu bị xóa không thể khôi phục!`,
          confirmText: 'Đồng ý xóa & Fallback',
          cancelText: 'Hủy',
          isDangerous: true
      }).then(async (confirmed) => {
          if (confirmed) {
              this.isProcessing.set(true);
              try {
                  await this.stdService.hardDeleteRequest(req);
                  this.toast.show('Đã xóa vĩnh viễn lịch sử và hoàn tác dữ liệu thành công', 'success');
              } catch (e: any) {
                  this.toast.show('Lỗi khi xóa: ' + (e.message || e), 'error');
              } finally {
                  this.isProcessing.set(false);
              }
          }
      });
  }

  closeActionModal() {
      this.activeModal.set(null);
      this.selectedRequest.set(null);
  }

  approveRequest(req: StandardRequest) {
      if (this.isProcessing()) return;
      this.selectedRequest.set(req);
      this.activeModal.set('approve');
  }

  async confirmApprove(data: { expectedDate: string, expectedAmount: number | null, purpose: string }) {
      const req = this.selectedRequest();
      if (!req || !req.id || this.isProcessing()) return;
      const user = this.auth.currentUser();
      if (!user) return;

      this.isProcessing.set(true);
      try {
          let updatedExpectedDate = req.expectedReturnDate;
          if (data.expectedDate) {
              updatedExpectedDate = new Date(data.expectedDate).getTime();
          } else if (data.expectedDate === '') {
              updatedExpectedDate = undefined;
          }

          // Dispense
          await this.stdService.dispenseStandard(req.id, req.standardId, user.uid, user.displayName || user.email || 'Unknown');
          
          if (data.purpose !== req.purpose || updatedExpectedDate !== req.expectedReturnDate || data.expectedAmount !== req.expectedAmount) {
              const updates: any = {
                  purpose: data.purpose,
                  expectedReturnDate: updatedExpectedDate ?? null,
                  expectedAmount: data.expectedAmount ?? null
              };
              await this.stdService.updateRequestStatus(req.id, 'IN_PROGRESS', updates);
          }
          
          this.toast.show('Đã duyệt và giao chuẩn thành công', 'success');
          this.closeActionModal();
      } catch (e: any) {
          this.toast.show('Lỗi: ' + e.message, 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }

  openRejectModal(req: StandardRequest) {
      if (this.isProcessing()) return;
      this.selectedRequest.set(req);
      this.activeModal.set('reject');
  }

  async confirmReject(data: { reason: string }) {
      const req = this.selectedRequest();
      if (!req || !req.id || this.isProcessing()) return;

      this.isProcessing.set(true);
      try {
          await this.stdService.updateRequestStatus(req.id, 'REJECTED', { rejectionReason: data.reason });
          this.toast.show('Đã từ chối yêu cầu', 'success');
          this.closeActionModal();
      } catch (e: any) {
          this.toast.show('Lỗi: ' + e.message, 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }

  openReturnModal(req: StandardRequest, isForce: boolean) {
      if (this.isProcessing()) return;
      this.selectedRequest.set(req);
      this.isForceReturn.set(isForce);
      this.activeModal.set('return');
  }

  async confirmReturn(data: { amount: number, isDepleted: boolean }) {
      const req = this.selectedRequest();
      if (!req || !req.id || this.isProcessing()) return;
      
      const isForce = this.isForceReturn();

      this.isProcessing.set(true);
      try {
          if (isForce) {
              const user = this.auth.currentUser();
              await this.stdService.returnStandard(
                  req.id, 
                  req.standardId, 
                  user?.uid || '', 
                  user?.displayName || user?.email || 'Unknown', 
                  data.isDepleted, 
                  data.amount, 
                  req.standardDetails?.unit || 'mg'
              );
              this.toast.show('Đã thu hồi chuẩn thành công', 'success');
          } else {
              // Employee -> Pending Admin Receive
              await this.stdService.updateRequestStatus(req.id, 'PENDING_RETURN', { 
                  totalAmountUsed: data.amount,
                  reportedDepleted: data.isDepleted
              });
              this.toast.show('Đã báo cáo trả chuẩn', 'success');
          }
          this.closeActionModal();
      } catch (e: any) {
          this.toast.show('Lỗi: ' + e.message, 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }

  openLogUsageModal(req: StandardRequest) {
      if (this.isProcessing()) return;
      this.selectedRequest.set(req);
      this.activeModal.set('logUsage');
  }

  async confirmLogUsage(data: { amount: number, purpose: string }) {
      const req = this.selectedRequest();
      if (!req || !req.id || this.isProcessing()) return;

      this.isProcessing.set(true);
      try {
          const user = this.auth.currentUser();
          await this.stdService.logUsageForRequest(
              req.id, 
              req.standardId, 
              data.amount, 
              req.standardDetails?.unit || 'mg', 
              data.purpose.trim(), 
              user?.uid || '', 
              user?.displayName || user?.email || 'Unknown'
          );
          
          this.toast.show('Đã ghi nhận sử dụng (Dùng dần) thành công', 'success');
          this.closeActionModal();
      } catch (e: any) {
          this.toast.show('Lỗi: ' + e.message, 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }

  openAdminReceiveModal(req: StandardRequest) {
      if (this.isProcessing()) return;
      this.selectedRequest.set(req);
      this.activeModal.set('adminReceive');
  }

  async confirmAdminReceive(data: { amount: number, isDepleted: boolean, disposalReason: string }) {
      const req = this.selectedRequest();
      if (!req || !req.id || this.isProcessing()) return;
      const user = this.auth.currentUser();
      if (!user) return;

      this.isProcessing.set(true);
      try {
          const reason = data.disposalReason.trim();
          await this.stdService.returnStandard(
              req.id,
              req.standardId,
              user.uid,
              user.displayName || user.email || 'Unknown',
              data.isDepleted,
              data.amount,
              req.standardDetails?.unit || 'mg',
              data.isDepleted && reason ? reason : undefined
          );
          this.toast.show('Đã xác nhận nhận lại chuẩn thành công', 'success');
          this.closeActionModal();
      } catch (e: any) {
          this.toast.show('Lỗi: ' + e.message, 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }

  getStatusLabel(status: StandardRequestStatus): string {
      switch(status) {
          case 'PENDING_APPROVAL': return 'Chờ duyệt';
          case 'IN_PROGRESS': return 'Đang sử dụng';
          case 'PENDING_RETURN': return 'Chờ trả';
          case 'COMPLETED': return 'Hoàn thành';
          case 'REJECTED': return 'Từ chối';
          default: return status;
      }
  }
}
