import { Component, inject, signal, computed, OnInit, OnDestroy, effect } from '@angular/core';
import { Router } from '@angular/router';
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
import { StandardsPurchaseModalComponent } from '../components/standards-purchase-modal.component';

@Component({
  selector: 'app-standard-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RequestsKanbanComponent, RequestsTableComponent, CreateRequestDrawerComponent, RequestsActionModalsComponent, StandardsPurchaseModalComponent],
  templateUrl: './standard-requests.component.html'
})
export class StandardRequestsComponent implements OnInit, OnDestroy {
  stdService = inject(StandardService);
  state = inject(StateService);
  toast = inject(ToastService);
  confirmationService = inject(ConfirmationService);
  auth = inject(AuthService);
  fb = inject(FormBuilder);
  router = inject(Router);

  requests = signal<StandardRequest[]>([]);
  availableStandards = computed(() => {
      const activeRequestStdIds = new Set(
          this.requests()
              .filter(r => ['PENDING_APPROVAL', 'IN_PROGRESS', 'PENDING_RETURN'].includes(r.status))
              .map(r => r.standardId)
      );
      return this.allStandards().filter(s => s.status !== 'IN_USE' && !activeRequestStdIds.has(s.id));
  });
  allStandards = signal<ReferenceStandard[]>([]);
  
  searchTerm = signal('');
  statusFilter = signal<string>('ALL');
  viewMode = signal<'kanban' | 'table'>('kanban');
  
  isLoading = signal(true);
  isProcessing = signal(false);
  showModal = signal(false);
  
  showPurchaseModal = signal(false);
  selectedPurchaseStd = signal<ReferenceStandard | null>(null);
  
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
  private currentListenerRoleKey = '';

  constructor() {
      // Đảm bảo listener hoạt động đúng kể cả khi PWA tải siêu nhanh
      // và auth state chưa được nạp xong.
      effect(() => {
          const isAuthReady = this.auth.isAuthReady();
          const user = this.auth.currentUser();
          
          if (isAuthReady && user) {
              const isAdmin = this.auth.canApproveStandards();
              const roleKey = isAdmin ? 'admin' : user.uid;
              
              if (this.currentListenerRoleKey !== roleKey) {
                  this.currentListenerRoleKey = roleKey;
                  
                  // 1. Lắng nghe Standard Requests
                  if (this.unsubRequests) this.unsubRequests();
                  this.isLoading.set(true);
                  this.unsubRequests = this.stdService.listenToRequests((reqs) => {
                      this.requests.set(reqs.filter(r => !(r as any)._isDeleted));
                      this.isLoading.set(false);
                  });
                  
                  // 2. Lắng nghe Purchase Requests (chỉ dành cho Admin)
                  if (isAdmin) {
                      if (this.purchaseReqUnsub) this.purchaseReqUnsub();
                      this.purchaseReqUnsub = this.stdService.listenToPendingPurchaseRequests((reqs) => {
                          this.adminPurchaseRequests.set(reqs);
                          this.pendingPurchaseRequestsCount.set(reqs.length);
                          this.loadingAdminRequests.set(false);
                      });
                  } else {
                      if (this.purchaseReqUnsub) {
                          this.purchaseReqUnsub();
                          this.purchaseReqUnsub = undefined;
                      }
                  }
              }
          }
      }, { allowSignalWrites: true });
  }

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
      const now = Date.now();
      
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
    // Pha 1: Delta Load — apply localStorage ngay
    const stds = this.stdService.getAllStandardsFromCache();
    if (stds && stds.length > 0) {
        this.allStandards.set(stds);
    }

    // Pha 2: Live Listener Singleton — chia sẻ với StandardsComponent nếu đã mở
    this.unregisterLiveListener = this.stdService.listenToStandards((stds) => {
        if (stds) {
            this.allStandards.set([...stds]);
        }
    });
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

  openPurchaseModal(std: ReferenceStandard) {
      this.selectedPurchaseStd.set(std);
      this.showPurchaseModal.set(true);
  }

  closePurchaseModal() {
      this.showPurchaseModal.set(false);
      this.selectedPurchaseStd.set(null);
  }

  async submitRequest(event: { standardIds: string[], purpose: string }) {
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

              // Kiểm tra request trùng lặp: bất kỳ ai đã có yêu cầu đang hoạt động cho chuẩn này chưa
              const hasActiveRequest = this.requests().some(r =>
                  r.standardId === stdId &&
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

  async confirmApprove(data: { expectedAmount: number | null, purpose: string }) {
      const req = this.selectedRequest();
      if (!req || !req.id || this.isProcessing()) return;
      const user = this.auth.currentUser();
      if (!user) return;

      this.isProcessing.set(true);
      try {

          // Dispense
          await this.stdService.dispenseStandard(req.id, req.standardId, user.uid, user.displayName || user.email || 'Unknown');
          
          if (data.purpose !== req.purpose || data.expectedAmount !== req.expectedAmount) {
              const updates: any = {
                  purpose: data.purpose,
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
