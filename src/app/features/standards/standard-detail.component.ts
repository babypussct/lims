import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StandardService } from './standard.service';
import { AuthService, UserProfile } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { StateService } from '../../core/services/state.service';
import { ReferenceStandard, UsageLog, StandardRequest } from '../../core/models/standard.model';
import { formatNum, getAvatarUrl, getStandardStatus, getStorageInfo, getExpiryClass, getExpiryTimeLeft, canAssign } from '../../shared/utils/utils';
import {
    getFefoPredecessor,
    getFefoPriorityStandard,
    getSameStandardLots,
    isFefoCandidate,
    sortStandardsByFefo
} from '../../shared/utils/standard-fefo';

import { StandardsFormModalComponent } from './components/standards-form-modal.component';
import { StandardsPrintModalComponent } from './components/standards-print-modal.component';
import { StandardsPurchaseModalComponent } from './components/standards-purchase-modal.component';
import { StandardsAssignModalComponent } from './components/standards-assign-modal.component';
import { PrintService } from '../../core/services/print.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { GoogleDriveService } from '../../core/services/google-drive.service';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { LockPermissionDirective } from '../../shared/directives/lock-permission.directive';

@Component({
  selector: 'app-standard-detail',
  standalone: true,
  imports: [
      CommonModule,
      FormsModule,
      StandardsFormModalComponent,
      StandardsPrintModalComponent,
      StandardsPurchaseModalComponent,
      StandardsAssignModalComponent,
      LockPermissionDirective
  ],
  templateUrl: './standard-detail.component.html'
})
export class StandardDetailComponent implements OnInit, OnDestroy {
    route = inject(ActivatedRoute);
    router = inject(Router);
    stdService = inject(StandardService);
    firebaseService = inject(FirebaseService);
    private auth = inject(AuthService);
    toast = inject(ToastService);
    state = inject(StateService);
    confirmation = inject(ConfirmationService);
    location = inject(Location);
    confirmationService = inject(ConfirmationService);
    sanitizer = inject(DomSanitizer);
    printService = inject(PrintService);
    googleDriveService = inject(GoogleDriveService);

    Math = Math;
    formatNum = formatNum;
    getAvatarUrl = getAvatarUrl;
    getStandardStatus = getStandardStatus;
    getStorageInfo = getStorageInfo;
    getExpiryClass = getExpiryClass;
    getExpiryTimeLeft = getExpiryTimeLeft;
    canAssign = canAssign;

    currentUserUid = computed(() => this.auth.currentUser()?.uid || '');
    currentUserName = computed(() => this.auth.currentUser()?.displayName || '');

    standardId = signal<string>('');
    standard = signal<ReferenceStandard | null>(null);
    isLoading = signal(true);
    notFound = signal(false);

    usageLogs = signal<UsageLog[]>([]);
    loadingHistory = signal(false);
    isProcessing = signal(false);
    allStandardsCache = signal<ReferenceStandard[]>([]);

    activeTab = signal<'usage' | 'related'>('usage');

    // Modals state
    showEditModal = signal(false);
    showPrintModal = signal(false);
    showPurchaseModal = signal(false);
    showAssignModal = signal(false);

    isAssignMode = signal(true);
    userList = signal<UserProfile[]>([]);



    isUploadingCoa = signal(false);

    private liveUnsub?: () => void;
    private routeSub: any;

    // Computed Properties
    effectiveOpenDate = computed(() => {
        const std = this.standard();
        if (!std) return null;
        if (std.date_opened) return std.date_opened;

        const logs = this.usageLogs();
        if (logs && logs.length > 0) {
            const earliestLog = logs.reduce((min, log) => {
                const logTime = new Date(log.date).getTime();
                const minTime = new Date(min.date).getTime();
                return logTime < minTime ? log : min;
            }, logs[0]);
            return earliestLog.date;
        }
        return null;
    });

    statusInfo = computed(() => {
        const std = this.standard();
        if (!std) return { label: '', class: '' };
        return this.getStandardStatus(std);
    });

    storageInfo = computed(() => {
        const std = this.standard();
        if (!std) return [];
        return this.getStorageInfo(std.storage_condition);
    });

    expiryInfo = computed(() => {
        const std = this.standard();
        if (!std) return { timeLeftText: '', colorClass: '' };
        return {
            timeLeftText: this.getExpiryTimeLeft(std.expiry_date),
            colorClass: this.getExpiryClass(std.expiry_date)
        };
    });

    qrCodeUrl = computed(() => {
        const std = this.standard();
        if (!std) return '';
        const baseUrl = window.location.origin;
        return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(baseUrl + '/#/standards/' + std.id)}`;
    });

    canReturnStandard = computed(() => {
        const std = this.standard();
        if (!std) return false;
        const isEditor = this.auth.canAssignStandards();
        const isHolder = std.current_holder_uid === this.auth.currentUser()?.uid;
        return isEditor || isHolder;
    });

    canRequestCoa = computed(() => {
        const std = this.standard();
        if (!std) return false;
        return !std.certificate_ref &&
          this.auth.hasPermission('standard_request') &&
          !this.auth.canAssignStandards();
    });

    canAssignStandards = computed(() => this.auth.canAssignStandards());
    canRequestStandards = computed(() => this.auth.hasPermission('standard_request'));
    canRequestPurchase = computed(() => this.canRequestStandards() || this.canAssignStandards());
    canDeleteStandardLogs = computed(() => this.auth.canDeleteStandardLogs());

    relatedStandards = computed(() => {
        const std = this.standard();
        const all = this.allStandardsCache();
        if (!std || all.length === 0) return [];
        return sortStandardsByFefo(getSameStandardLots(std, all, false));
    });

    /**
     * Trả về lọ cùng tên nên dùng trước lọ hiện tại (theo FEFO).
     * Dùng để hiển thị cảnh báo trong Action Shortcuts.
     */
    fefoWarningSibling = computed(() => {
        const std = this.standard();
        if (!std) return null;
        return getFefoPredecessor(std, this.allStandardsCache());
    });

    fefoPriorityStandard = computed(() => {
        const std = this.standard();
        if (!std) return null;
        return getFefoPriorityStandard(std, this.allStandardsCache());
    });

    isFefoPriority(std: ReferenceStandard): boolean {
        return this.fefoPriorityStandard()?.id === std.id;
    }

    ngOnInit() {
        // Subscribe to route params to handle navigation between related standards
        this.routeSub = this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.standardId.set(id);
                this.loadStandardData(id);
                // Active usage tab by default on navigation
                this.activeTab.set('usage');
            }
        });

        // Register global listener to update if data changes in background
        this.liveUnsub = this.stdService.listenToStandards(() => {
            if (this.standardId()) {
                this.refreshStandardFromCache(this.standardId());
                this.refreshAllStandards();
            }
        });
    }

    ngOnDestroy() {
        if (this.routeSub) this.routeSub.unsubscribe();
        if (this.liveUnsub) this.liveUnsub();
    }

    async loadStandardData(id: string) {
        this.isLoading.set(true);
        this.notFound.set(false);
        try {
            const std = await this.stdService.getStandardById(id);
            if (std) {
                this.standard.set(std);
                this.loadHistory(id);
                this.refreshAllStandards();
            } else {
                this.notFound.set(true);
            }
        } catch (error) {
            console.error('Failed to load standard details:', error);
            this.notFound.set(true);
        } finally {
            this.isLoading.set(false);
        }
    }

    async refreshStandardFromCache(id: string) {
        // Soft refresh when delta listener triggers
        const std = await this.stdService.getStandardById(id);
        if (std) this.standard.set(std);
    }

    refreshAllStandards() {
        this.allStandardsCache.set(this.stdService.getAllStandardsFromCache());
    }

    async loadHistory(id: string) {
        this.loadingHistory.set(true);
        try {
            const logs = await this.stdService.getUsageHistory(id);
            this.usageLogs.set(logs);

            // SELF-HEALING (Cách 1): Cập nhật ngầm ngày mở nắp nếu chưa có
            const std = this.standard();
            if (std && !std.date_opened && logs.length > 0) {
                const earliestLog = logs.reduce((min, log) => {
                    const logTime = new Date(log.date).getTime();
                    const minTime = new Date(min.date).getTime();
                    return logTime < minTime ? log : min;
                }, logs[0]);

                this.autoHealDateOpened(std.id, earliestLog.date);
            }
        } catch (error) {
            console.error('Failed to load history:', error);
        } finally {
            this.loadingHistory.set(false);
        }
    }

    async autoHealDateOpened(id: string, date: string) {
        try {
            const ref = doc(this.firebaseService.db, `artifacts/${this.firebaseService.APP_ID}/reference_standards`, id);
            await updateDoc(ref, { date_opened: date, lastUpdated: serverTimestamp() });

            // Cập nhật lại UI local (dù delta sync cũng sẽ bắt được nhưng cập nhật luôn cho mượt)
            this.standard.update(s => s ? { ...s, date_opened: date } : s);
            console.log(`[Self-Heal] Đã cập nhật ngầm date_opened thành ${date} cho chuẩn ${id}`);
        } catch (e) {
            console.warn('Lỗi khi tự động cập nhật date_opened', e);
        }
    }

    // --- NAVIGATION & ACTIONS ---

    goBack() {
        this.router.navigate(['/standards']);
    }

    navigateToRelated(id: string) {
        this.router.navigate(['/standards', id]);
    }

    async openAssignModal(isAssign = true) {
        if (this.isProcessing() || !this.standard()) return;
        this.isAssignMode.set(isAssign);
        this.showAssignModal.set(true);

        if (isAssign && this.userList().length === 0) {
            try {
                const users = await this.firebaseService.getAllUsers();
                this.userList.set(users);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
    }

    async confirmAssign(data: {userId: string, userName: string, purpose: string, expectedAmount: number | null}) {
        const std = this.standard();

        if (!std || !data.userId || !data.purpose) {
            this.toast.show('Vui lòng điền đầy đủ thông tin bắt buộc (*)', 'error');
            return;
        }
        if (!isFefoCandidate(std)) {
            this.toast.show('Lô chuẩn không còn sẵn sàng để cấp. Vui lòng tải lại và chọn lô khác.', 'error');
            return;
        }

        this.isProcessing.set(true);
        try {
            const request: StandardRequest = {
                standardId: std.id,
                standardName: std.name,
                lotNumber: std.lot_number,
                requestedBy: data.userId,
                requestedByName: data.userName,
                requestDate: Date.now(),
                purpose: data.purpose.trim(),
                expectedAmount: data.expectedAmount || 0,
                status: 'PENDING_APPROVAL',
                totalAmountUsed: 0
            };

            await this.stdService.createRequest(request, this.isAssignMode());

            if (this.isAssignMode()) {
                await this.stdService.dispenseStandard(
                    request.id!,
                    std.id,
                    this.auth.currentUser()?.uid || '',
                    this.auth.currentUser()?.displayName || 'QTV',
                    true
                );
            }

            this.toast.show(this.isAssignMode() ? 'Đã gán chuẩn thành công' : 'Đã gửi yêu cầu mượn chuẩn', 'success');
            this.showAssignModal.set(false);

            // Xử lý reload trạng thái
            if (this.standardId()) {
                this.loadStandardData(this.standardId());
            }
        } catch (error: any) {
            this.toast.show(error.message || 'Lỗi khi xử lý', 'error');
        } finally {
            this.isProcessing.set(false);
        }
    }

    goToReturn() {
        this.router.navigate(['/standard-requests']);
        this.toast.show('Chuyển đến trang Yêu cầu để hoàn trả', 'info');
    }

    openEditModal() {
        if (this.auth.hasPermission('standard_edit') && this.standard()) {
            this.showEditModal.set(true);
        }
    }

    openPrintModal() {
        if (this.standard()) this.showPrintModal.set(true);
    }

    openPurchaseModal() {
        if (this.standard() && this.canRequestPurchase()) this.showPurchaseModal.set(true);
    }

    async requestCoa(std: ReferenceStandard) {
        if (this.isProcessing() || std.coa_requested_by || !this.canRequestCoa()) return;

        this.confirmation.confirm({
            message: `Bạn đang gửi thông báo yêu cầu Quản trị viên bổ sung chứng nhận phân tích (CoA) cho chuẩn "${std.name}". Bạn có chắc chắn không?`,
            confirmText: 'Gửi Yêu cầu',
            cancelText: 'Hủy'
        }).then(async (confirmed) => {
            if (!confirmed) return;

            this.isProcessing.set(true);
            try {
                // Optimistic UI update to prevent immediate double clicks
                const uid = this.auth.currentUser()?.uid;
                this.standard.update(s => s ? { ...s, coa_requested_by: uid } : s);

                await this.stdService.requestCoa(std);
                this.toast.show('Đã thông báo yêu cầu bổ sung CoA đến Quản trị viên.', 'success');
            } catch (e: any) {
                this.toast.show('Lỗi gửi yêu cầu: ' + e.message, 'error');
                // Revert on error
                this.standard.update(s => s ? { ...s, coa_requested_by: undefined } : s);
            } finally {
                this.isProcessing.set(false);
            }
        });
    }

    onModalSaved() {
        this.showEditModal.set(false);
        if (this.standardId()) {
            this.loadStandardData(this.standardId()); // Reload fresh data
        }
    }

    copyText(text: string | undefined) {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => this.toast.show('Đã copy: ' + text));
    }

    openCoaPreview(url: string) {
        this.printService.openCoaPreview(url, 'Chứng chỉ chất lượng (CoA)');
    }



    async deleteLog(log: UsageLog, stdId: string) {
        if (!log.id) return;
        if (await this.confirmationService.confirm({ message: `Xóa lịch sử dụng ngày ${log.date}?`, confirmText: 'Xóa & Hoàn kho', isDangerous: true })) {
            try {
                await this.stdService.deleteUsageLog(stdId, log.id);
                this.toast.show('Đã xóa', 'success');
                await this.loadHistory(stdId);
            } catch (e: any) {
                this.toast.show('Lỗi: ' + e.message, 'error');
            }
        }
    }
    // --- Quick Upload CoA ---
    triggerQuickDriveUpload() {
        if (this.googleDriveService.hasValidToken) {
            const input = document.querySelector('#quickDriveInput') as HTMLInputElement;
            if (input) {
                input.click();
            } else {
                this.toast.show('Không tìm thấy input upload', 'error');
            }
        } else {
            // XÁC THỰC TRƯỚC: Nếu chưa có token, xác thực xong yêu cầu user nhấn lại để có user activation
            this.googleDriveService.authenticateSync(
                () => {
                    this.toast.show('Đã kết nối Google Drive! Vui lòng nhấn lại nút Upload để chọn file.', 'success');
                },
                (err) => {
                    this.toast.show('Lỗi đăng nhập Google: ' + err, 'error');
                }
            );
        }
    }

    async handleQuickDriveUpload(event: any) {
        const file = event.target.files[0];
        if (!file) return;

        const std = this.standard();
        if (!std) return;

        try {
            this.isUploadingCoa.set(true);
            const fileName = GoogleDriveService.generateFileName(std.name, std.lot_number || '', file.name);
            this.toast.show(`Đang upload CoA cho "${std.name}"...`);

            const previewUrl = await this.googleDriveService.uploadFile(file, fileName);

            // Tìm tất cả các chuẩn cùng Tên và Số Lô từ Delta Sync cache
            const allStds = this.stdService.getAllStandardsFromCache();
            const lot = (std.lot_number || '').trim().toLowerCase();
            const siblings = lot
                ? allStds.filter(s =>
                    s.name.trim().toLowerCase() === std.name.trim().toLowerCase() &&
                    (s.lot_number || '').trim().toLowerCase() === lot &&
                    !s._isDeleted
                )
                : [std];
            await this.stdService.completeCoaUpload(siblings.length ? siblings : [std], previewUrl);

            // Cập nhật local signal cho view hiện tại
            this.standard.update(current => current ? { ...current, certificate_ref: previewUrl, coa_requested_by: undefined } : current);

            if (siblings.length > 1) {
                this.toast.show(`Upload thành công! Đã áp dụng CoA cho ${siblings.length} lọ chuẩn cùng lô.`);
            } else {
                this.toast.show(`Upload CoA thành công!`);
            }
        } catch (e: any) {
            console.error('Quick Drive upload error:', e);
            this.toast.show('Upload CoA lỗi: ' + (e.message || 'Không xác định'), 'error');
        } finally {
            this.isUploadingCoa.set(false);
            event.target.value = '';
        }
    }
}
