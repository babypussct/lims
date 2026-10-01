import { Component, Injector, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DOCUMENT, Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StandardService } from './standard.service';
import { AuthService, UserProfile } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { StateService } from '../../core/services/state.service';
import { ReferenceStandard, UsageLog, StandardRequest } from '../../core/models/standard.model';
import { formatNum, getAvatarUrl, getStorageInfo, getExpiryClass, getExpiryTimeLeft } from '../../shared/utils/utils';
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
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { AppButtonComponent } from '../../shared/components/ui/button/button.component';
import { AppEmptyStateComponent } from '../../shared/components/ui/empty-state/empty-state.component';
import { AppPageHeaderComponent } from '../../shared/components/ui/page-header/page-header.component';
import { AppUiTimelineComponent } from '../../shared/components/ui/timeline/timeline.component';
import { TimelineItem } from '../../shared/components/ui/timeline/timeline.model';
import { AppUiAvatarGroupComponent } from '../../shared/components/ui/avatar-group/avatar-group.component';
import { AvatarGroupItem } from '../../shared/components/ui/avatar-group/avatar-group.model';
import { StandardQrSrcDirective } from '../../shared/directives/standard-qr-src.directive';
import { buildStandardQrPayload } from '../../shared/utils/standard-qr';
import { AppModalShellComponent } from '../../shared/components/ui/modal-shell/modal-shell.component';
import { StandardTagCatalogService } from './services/standard-tag-catalog.service';
import { formatMethodOptionLabel } from './services/standard-tag.utils';
import {
    canAssignDetailStandard, canPurchaseDetailStandard, detailStandardStatus, hasStandardAmount,
    readStandardText, standardAmountText, standardDataIssues, standardDateState, standardDateText,
    standardStockPercentage, standardText, standardTextList,
} from './standard-detail.utils';

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
      AppButtonComponent,
      AppEmptyStateComponent,
      AppPageHeaderComponent,
      AppUiTimelineComponent,
      AppUiAvatarGroupComponent,
      StandardQrSrcDirective,
      AppModalShellComponent
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
    private readonly injector = inject(Injector);
    private readonly document = inject(DOCUMENT);

    formatNum = formatNum;
    getAvatarUrl = getAvatarUrl;
    getStandardStatus = detailStandardStatus;
    getStorageInfo = getStorageInfo;
    getExpiryClass = (date: unknown) => standardDateState(date).kind === 'invalid' ? 'text-rose-600' : getExpiryClass(readStandardText(date));
    canAssign = canAssignDetailStandard;
    canPurchase = canPurchaseDetailStandard;
    readStandardText = readStandardText;
    standardText = standardText;
    standardAmountText = standardAmountText;
    standardDateText = standardDateText;
    hasStandardAmount = hasStandardAmount;

    currentUserUid = computed(() => this.auth.currentUser()?.uid || '');
    currentUserName = computed(() => this.auth.currentUser()?.displayName || '');
    /** Audit accounts reuse this detail surface with non-approved fields/actions hidden. */
    isAuditMode = computed(() => this.auth.isStandardAuditMode());

    standardId = signal<string>('');
    standard = signal<ReferenceStandard | null>(null);
    isLoading = signal(true);
    notFound = signal(false);

    usageLogs = signal<UsageLog[]>([]);
    historyOpenDate = signal<string | null>(null);
    loadingHistory = signal(false);
    loadingMoreHistory = signal(false);
    hasMoreHistory = signal(false);
    isProcessing = signal(false);
    allStandardsCache = signal<ReferenceStandard[]>([]);

    private readonly usageHistoryPageSize = 100;
    private historyLastDoc: QueryDocumentSnapshot | null = null;

    activeTab = signal<'usage' | 'related' | 'specs'>('usage');

    readonly standardFormLabels: Record<string, string> = {
        neat: 'Chất nguyên chất',
        solution: 'Dung dịch',
        mixture: 'Hỗn hợp',
        isotope: 'Đồng vị',
        salt_or_hydrate: 'Muối / hydrat',
    };

    deviceCodes = computed(() => {
        const std = this.standard();
        if (!std || this.isAuditMode()) return [];
        const derived = standardTextList(std.derivedDeviceCodes);
        if (derived.length) return derived;
        const keys = standardTextList(std.sop_tags);
        return keys.length ? this.injector.get(StandardTagCatalogService).deriveDeviceCodes(keys) : [];
    });

    methodLabels = computed(() => {
        const std = this.standard();
        if (!std || this.isAuditMode()) return [];
        const derived = standardTextList(std.derivedMethodLabels);
        if (derived.length) return derived;
        const keys = standardTextList(std.sop_tags);
        if (!keys.length) return [];
        const catalog = this.injector.get(StandardTagCatalogService);
        return keys
            .map(key => formatMethodOptionLabel(catalog.resolveTag(key)))
            .filter(Boolean);
    });

    usageTimelineItems = computed<TimelineItem[]>(() => {
        const std = this.standard();
        return this.usageLogs().map((log, index) => {
            const unit = log.unit || log.normalized_unit || std?.unit || '';
            const metadata = [
                std?.internal_id ? { label: 'Mã chuẩn', value: std.internal_id } : null,
                log.requestId ? { label: 'Phiếu', value: log.requestId } : null,
                log.isBackfill ? { label: 'Nguồn', value: 'Nhập bù' } : null,
            ].filter((item): item is { label: string; value: string } => item !== null);

            return {
                id: log.id || `${log.timestamp || log.date}-${index}`,
                title: `Đã sử dụng ${this.formatNum(log.amount_used)} ${unit}`.trim(),
                description: log.purpose || 'Ghi nhận sử dụng chất chuẩn.',
                timestamp: log.timestamp || log.date,
                actorName: log.user,
                actorRole: log.isBackfill ? 'Nhật ký nhập bù' : 'Người sử dụng chuẩn',
                icon: log.isDepleted ? 'fa-flask-vial' : 'fa-vial',
                status: log.isDepleted ? 'warning' : (log.isBackfill ? 'primary' : 'info'),
                metadata,
                action: this.canDeleteStandardLogs() && log.id && std?.id ? {
                    label: 'Hoàn tác & hoàn kho',
                    icon: 'fa-trash-can',
                    callback: () => { void this.deleteLog(log, std.id); },
                } : undefined,
                isCurrent: index === 0,
            } satisfies TimelineItem;
        });
    });

    usageActors = computed<AvatarGroupItem[]>(() => {
        const seen = new Set<string>();
        const actors: AvatarGroupItem[] = [];
        for (const log of this.usageLogs()) {
            const name = log.user?.trim() || 'Hệ thống LIMS';
            const key = (log.userId || name).toLocaleLowerCase('vi-VN');
            if (seen.has(key)) continue;
            seen.add(key);
            const avatarOptions = this.state.getUserAvatarOptions(name);
            actors.push({
                id: log.userId || key,
                name,
                imageUrl: this.getAvatarUrl(name, avatarOptions.style, avatarOptions.photoURL),
                subtitle: 'Đã thao tác chất chuẩn',
            });
        }
        return actors;
    });

    // Modals state
    showEditModal = signal(false);
    showPrintModal = signal(false);
    showPurchaseModal = signal(false);
    showAssignModal = signal(false);
    showQrModal = signal(false);
    isSharing = signal(false);
    manualCopyRequired = signal(false);
    standardShareUrl = computed(() => {
        const std = this.standard();
        const origin = this.document.defaultView?.location.origin;
        const id = typeof std?.id === 'string' && std.id.trim() ? std.id : '';
        return !this.isAuditMode() && id && origin ? buildStandardQrPayload(origin, id) : '';
    });

    isAssignMode = signal(true);
    userList = signal<UserProfile[]>([]);



    isUploadingCoa = signal(false);

    private liveUnsub?: () => void;
    private routeSub: any;
    private isDestroyed = false;

    // Computed Properties
    effectiveOpenDate = computed(() => {
        const std = this.standard();
        if (!std) return null;
        if (readStandardText(std.date_opened)) return std.date_opened;
        if (this.historyOpenDate()) return this.historyOpenDate();
        return this.usageLogs()
            .filter(log => standardDateState(log.date).kind === 'valid')
            .sort((a, b) => standardDateState(a.date).timestamp! - standardDateState(b.date).timestamp!)[0]?.date || null;
    });
    openedDateFromHistory = computed(() => !readStandardText(this.standard()?.date_opened) && !!this.effectiveOpenDate());
    standardName = computed(() => standardText(this.standard()?.name, 'Chưa ghi nhận tên chất chuẩn'));
    stockPercentage = computed(() => this.standard() ? standardStockPercentage(this.standard()!) : null);
    displayedAmountIsValid = computed(() => {
        const std = this.standard();
        return !!std && hasStandardAmount(this.isAuditMode() ? std.initial_amount : std.current_amount) && !!readStandardText(std.unit);
    });
    dataIssues = computed(() => !this.isAuditMode() && this.standard() ? standardDataIssues(this.standard()!) : []);
    currentHolderName = computed(() => {
        const std = this.standard();
        if (!std || this.isAuditMode()) return '';
        const uid = readStandardText(std.current_holder_uid);
        const cached = uid ? this.state.usersInfoByUidCache().get(uid)?.displayName : '';
        const currentName = uid && uid === this.currentUserUid() ? this.currentUserName() : '';
        const stored = readStandardText(std.current_holder);
        return readStandardText(cached) || readStandardText(currentName) || (stored !== uid ? stored : '');
    });
    standardFormLabel = computed(() => {
        const form = readStandardText(this.standard()?.standard_form);
        return form ? this.standardFormLabels[form] || 'Dạng chuẩn chưa được nhận diện' : 'Chưa ghi nhận';
    });

    statusInfo = computed(() => {
        const std = this.standard();
        if (!std) return { label: '', class: '' };
        return this.getStandardStatus(std);
    });

    storageInfo = computed(() => {
        const std = this.standard();
        if (!std) return [];
        return this.getStorageInfo(readStandardText(std.storage_condition));
    });

    expiryInfo = computed(() => {
        const std = this.standard();
        if (!std) return { timeLeftText: '', colorClass: '' };
        return {
            timeLeftText: getExpiryTimeLeft(readStandardText(std.expiry_date)),
            colorClass: this.getExpiryClass(std.expiry_date)
        };
    });

    canReturnStandard = computed(() => {
        const std = this.standard();
        if (!std || this.isAuditMode()) return false;
        const isEditor = this.auth.canAssignStandards();
        const isHolder = std.current_holder_uid === this.auth.currentUser()?.uid;
        return isEditor || isHolder;
    });

    canRequestCoa = computed(() => {
        const std = this.standard();
        if (!std || this.isAuditMode()) return false;
        return !readStandardText(std.certificate_ref) &&
          this.auth.hasPermission('standard_request') &&
          !this.auth.canAssignStandards();
    });

    canAssignStandards = computed(() => !this.isAuditMode() && this.auth.canAssignStandards());
    canRequestStandards = computed(() => !this.isAuditMode() && this.auth.hasPermission('standard_request'));
    canRequestPurchase = computed(() => this.canRequestStandards() || this.canAssignStandards());
    canDeleteStandardLogs = computed(() => !this.isAuditMode() && this.auth.canDeleteStandardLogs());
    canEditStandard = computed(() => !this.isAuditMode() && !!this.standard() && this.auth.hasPermission('standard_edit'));
    canReleaseInternalId = computed(() => {
        const std = this.standard();
        return !!std && !this.isAuditMode() && this.auth.canEditStandards() && !!readStandardText(std.internal_id)
            && std.lifecycle_status !== 'RELEASED' && std.lifecycle_status !== 'CLOSED';
    });

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
        if (!this.canAssign(std)) return null;
        return getFefoPredecessor({ ...std, expiry_date: readStandardText(std.expiry_date) }, this.detailFefoCandidates());
    });

    fefoPriorityStandard = computed(() => {
        const std = this.standard();
        if (!std) return null;
        const candidate = { ...std, expiry_date: readStandardText(std.expiry_date), current_amount: this.canAssign(std) ? std.current_amount : Number.NaN };
        return getFefoPriorityStandard(candidate, this.detailFefoCandidates());
    });

    private detailFefoCandidates = computed(() => this.allStandardsCache()
        .filter(canAssignDetailStandard)
        .map(std => ({ ...std, expiry_date: readStandardText(std.expiry_date) })));

    isFefoPriority(std: ReferenceStandard): boolean {
        return this.fefoPriorityStandard()?.id === std.id;
    }

    ngOnInit() {
        this.state.ensureUserInfoCacheListener();
        // Subscribe to route params to handle navigation between related standards
        this.routeSub = this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.standardId.set(id);
                this.historyOpenDate.set(null);
                this.usageLogs.set([]);
                this.loadStandardData(id);
                // Active usage tab by default on navigation
                this.activeTab.set('usage');
                this.closeQrModal();
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
        this.isDestroyed = true;
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
                if (this.isAuditMode()) {
                    this.usageLogs.set([]);
                } else {
                    this.loadHistory(id);
                }
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
        if (this.isAuditMode()) {
            this.usageLogs.set([]);
            this.loadingHistory.set(false);
            this.hasMoreHistory.set(false);
            return;
        }
        this.loadingHistory.set(true);
        this.historyOpenDate.set(null);
        this.historyLastDoc = null;
        this.hasMoreHistory.set(false);
        try {
            const page = await this.stdService.getUsageHistoryPage(id, this.usageHistoryPageSize);
            if (id !== this.standardId() || this.isAuditMode()) return;
            this.usageLogs.set(page.items);
            this.historyLastDoc = page.lastDoc;
            this.hasMoreHistory.set(page.hasMore);

            // Usage history is a source for comparison, not a confirmed opening date.
            const std = this.standard();
            if (std && !readStandardText(std.date_opened) && page.items.length > 0) {
                const earliestLog = page.hasMore
                    ? await this.stdService.getEarliestUsageLog(id)
                    : page.items.filter(log => standardDateState(log.date).kind === 'valid')
                        .sort((a, b) => standardDateState(a.date).timestamp! - standardDateState(b.date).timestamp!)[0];
                if (id === this.standardId() && !this.isAuditMode() && standardDateState(earliestLog?.date).kind === 'valid') {
                    this.historyOpenDate.set(earliestLog!.date);
                }
            }
        } catch (error) {
            console.error('Failed to load history:', error);
        } finally {
            this.loadingHistory.set(false);
        }
    }

    async loadMoreHistory() {
        const id = this.standardId();
        if (this.isAuditMode() || !id || !this.hasMoreHistory() || !this.historyLastDoc || this.loadingMoreHistory()) return;

        this.loadingMoreHistory.set(true);
        try {
            const page = await this.stdService.getUsageHistoryPage(
                id,
                this.usageHistoryPageSize,
                this.historyLastDoc
            );
            if (id !== this.standardId()) return;

            const existingIds = new Set(this.usageLogs().map(log => log.id));
            this.usageLogs.update(logs => [
                ...logs,
                ...page.items.filter(log => !existingIds.has(log.id))
            ]);
            this.historyLastDoc = page.lastDoc;
            this.hasMoreHistory.set(page.hasMore);
        } catch (error) {
            console.error('Failed to load more history:', error);
        } finally {
            this.loadingMoreHistory.set(false);
        }
    }

    // --- NAVIGATION & ACTIONS ---

    goBack() {
        this.router.navigate(['/standards']);
    }

    navigateToRelated(id: string) {
        if (this.isAuditMode()) return;
        this.router.navigate(['/standards', id]);
    }

    async openAssignModal(isAssign = true) {
        const std = this.standard();
        if (this.isAuditMode() || this.isProcessing() || !std || !this.canAssign(std) || std.has_pending_request) return;
        if (isAssign ? !this.canAssignStandards() : !this.canRequestStandards()) return;
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
        if (this.isAuditMode() || this.isProcessing()) return;
        if (this.isAssignMode() ? !this.canAssignStandards() : !this.canRequestStandards()) return;

        if (!std || !data.userId || !data.purpose) {
            this.toast.show('Vui lòng điền đầy đủ thông tin bắt buộc (*)', 'error');
            return;
        }
        if (!this.canAssign(std) || !isFefoCandidate({ ...std, expiry_date: readStandardText(std.expiry_date) })) {
            this.toast.show('Lô chuẩn không còn sẵn sàng để cấp. Vui lòng tải lại và chọn lô khác.', 'error');
            return;
        }

        this.isProcessing.set(true);
        try {
            const request: StandardRequest = {
              standardId: std.id,
              internalId: std.internal_id,
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

            this.toast.show(this.isAssignMode() ? 'Đã gán chuẩn thành công' : 'Đã gửi yêu cầu mượn chuẩn', 'success');
            this.showAssignModal.set(false);

            // Xử lý reload trạng thái
            if (this.standardId()) {
                this.loadStandardData(this.standardId());
            }
        } catch (error: any) {
            console.error('[StandardDetail] Không thể xử lý dữ liệu:', error);
            this.toast.show('Đã xảy ra lỗi. Vui lòng thử lại hoặc liên hệ quản trị viên.', 'error');
        } finally {
            this.isProcessing.set(false);
        }
    }

    goToReturn() {
        if (this.standard()?.status !== 'IN_USE' || !this.canReturnStandard()) return;
        this.router.navigate(['/standard-requests']);
        this.toast.show('Chuyển đến trang Yêu cầu chất chuẩn để hoàn trả', 'info');
    }

    openEditModal() {
        if (!this.isAuditMode() && this.auth.hasPermission('standard_edit') && this.standard()) {
            this.showEditModal.set(true);
        }
    }

    async releaseInternalId() {
        const std = this.standard();
        if (this.isAuditMode() || !std || !std.internal_id || this.isProcessing() || !this.auth.canEditStandards()) return;
        if (std.lifecycle_status === 'RELEASED' || std.lifecycle_status === 'CLOSED') {
            this.toast.show('Mã này đã được trả về sổ mã.', 'info');
            return;
        }
        const reason = window.prompt('Ghi rõ lý do trả Mã quản lý nội bộ về sổ mã:')?.trim();
        if (!reason) return;
        const confirmed = await this.confirmation.confirm({
            message: `Trả mã ${std.internal_id} về sổ mã? Hồ sơ cũ vẫn giữ nguyên để tra cứu lịch sử; mã chỉ được cấp lại sau thao tác này.`,
            confirmText: 'Trả mã về sổ mã',
            cancelText: 'Hủy',
            isDangerous: true,
        });
        if (!confirmed) return;

        this.isProcessing.set(true);
        try {
            await this.stdService.releaseInternalId(std.id!, reason);
            this.standard.update(current => current ? {
                ...current,
                lifecycle_status: 'RELEASED',
                internal_id_release_reason: reason,
            } : current);
            this.toast.show(`Đã trả mã ${std.internal_id} về sổ mã.`, 'success');
            await this.loadStandardData(this.standardId());
        } catch (error: any) {
            console.error('[StandardDetail] Không thể trả Mã quản lý nội bộ:', error);
            this.toast.show('Không thể lưu thay đổi. Vui lòng thử lại.', 'error');
        } finally {
            this.isProcessing.set(false);
        }
    }

    openPrintModal() {
        if (!this.isAuditMode() && this.standard()) {
            this.closeQrModal();
            this.showPrintModal.set(true);
        }
    }

    openQrModal() {
        if (!this.isAuditMode() && this.standard()) this.showQrModal.set(true);
    }

    closeQrModal() {
        this.showQrModal.set(false);
        this.manualCopyRequired.set(false);
    }

    shareStandard() {
        return this.runStandardShare(false);
    }

    copyStandardLink() {
        return this.runStandardShare(true);
    }

    private async runStandardShare(copyOnly: boolean) {
        const std = this.standard();
        const url = this.standardShareUrl();
        if (!std || !url || this.isSharing() || !this.isCurrentShare(std.id)) return;
        const browserNavigator = this.document.defaultView?.navigator;
        const shareData: ShareData = {
            title: `${this.standardName()} (${readStandardText(std.internal_id) || readStandardText(std.lot_number) || 'Chất chuẩn'})`,
            text: `Chất chuẩn đối chiếu: ${this.standardName()} - Lô: ${standardText(std.lot_number)}`,
            url,
        };
        this.isSharing.set(true);
        try {
            if (!copyOnly && browserNavigator?.share) {
                try {
                    if (!browserNavigator.canShare || browserNavigator.canShare(shareData)) {
                        // Invoke before any other await to preserve the button's user activation.
                        await browserNavigator.share(shareData);
                        return;
                    }
                } catch (error: unknown) {
                    if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') return;
                }
            }
            if (!this.isCurrentShare(std.id)) return;
            try {
                if (!browserNavigator?.clipboard?.writeText) {
                    this.showManualLinkCopy(std.id);
                    return;
                }
                await browserNavigator.clipboard.writeText(url);
                if (this.isCurrentShare(std.id)) {
                    this.manualCopyRequired.set(false);
                    this.toast.show('Đã sao chép liên kết chất chuẩn!', 'success');
                }
            } catch {
                this.showManualLinkCopy(std.id);
            }
        } finally {
            this.isSharing.set(false);
        }
    }

    private isCurrentShare(standardId: string) {
        return !this.isDestroyed && !this.isAuditMode() && !this.isLoading() && !this.notFound()
            && this.standard()?.id === standardId;
    }

    private showManualLinkCopy(standardId: string) {
        if (!this.isCurrentShare(standardId)) return;
        this.openQrModal();
        this.manualCopyRequired.set(true);
        this.toast.show('Hãy chọn liên kết trong hộp mã QR và sao chép thủ công.', 'info');
    }

    openPurchaseModal() {
        const std = this.standard();
        if (!std || this.isProcessing() || !this.canRequestPurchase() || std.restock_requested) return;
        if (this.canPurchase(std)) this.showPurchaseModal.set(true);
    }

    async requestCoa(std: ReferenceStandard) {
        if (this.isAuditMode() || this.isProcessing() || readStandardText(std.coa_requested_by) || !this.canRequestCoa()) return;

        this.confirmation.confirm({
            message: `Bạn đang gửi thông báo yêu cầu Quản trị viên bổ sung chứng nhận phân tích (CoA) cho chuẩn "${this.standardName()}". Bạn có chắc chắn không?`,
            confirmText: 'Gửi yêu cầu',
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
        navigator.clipboard.writeText(text).then(() => this.toast.show('Đã sao chép: ' + text));
    }

    openCoaPreview(url: string) {
        if (readStandardText(url)) this.printService.openCoaPreview(url.trim(), 'Chứng chỉ chất lượng (CoA)');
    }



    async deleteLog(log: UsageLog, stdId: string) {
        if (this.isAuditMode() || !log.id) return;
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
        if (!this.canEditStandard() || this.isUploadingCoa() || this.isProcessing()) return;
        if (this.googleDriveService.hasValidToken) {
            const input = document.querySelector('#quickDriveInput') as HTMLInputElement;
            if (input) {
                input.click();
            } else {
                this.toast.show('Không tìm thấy ô chọn tệp.', 'error');
            }
        } else {
            // XÁC THỰC TRƯỚC: Nếu chưa có token, xác thực xong yêu cầu user nhấn lại để có user activation
            this.googleDriveService.authenticateSync(
                () => {
                    this.toast.show('Đã kết nối Google Drive! Vui lòng nhấn lại nút Tải lên để chọn tệp.', 'success');
                },
                (err) => {
                    this.toast.show('Lỗi đăng nhập Google: ' + err, 'error');
                }
            );
        }
    }

    async handleQuickDriveUpload(event: any) {
        if (!this.canEditStandard() || this.isUploadingCoa() || this.isProcessing()) return;
        const file = event.target.files[0];
        if (!file) return;

        const std = this.standard();
        if (!std) return;

        try {
            this.isUploadingCoa.set(true);
            const fileName = GoogleDriveService.generateFileName(this.standardName(), readStandardText(std.lot_number), file.name);
            this.toast.show(`Đang tải CoA lên cho "${this.standardName()}"...`);

            const previewUrl = await this.googleDriveService.uploadFile(file, fileName);

            // Tìm tất cả các chuẩn cùng Tên và Số Lô từ Delta Sync cache
            const allStds = this.stdService.getAllStandardsFromCache();
            const name = readStandardText(std.name).toLowerCase();
            const lot = readStandardText(std.lot_number).toLowerCase();
            const siblings = name && lot
                ? allStds.filter(s =>
                    readStandardText(s.name).toLowerCase() === name &&
                    readStandardText(s.lot_number).toLowerCase() === lot &&
                    !s._isDeleted
                )
                : [std];
            await this.stdService.completeCoaUpload(siblings.length ? siblings : [std], previewUrl);

            // Cập nhật local signal cho view hiện tại
            this.standard.update(current => current ? { ...current, certificate_ref: previewUrl, coa_requested_by: undefined } : current);

            if (siblings.length > 1) {
                this.toast.show(`Tải lên thành công! Đã áp dụng CoA cho ${siblings.length} lọ chuẩn cùng lô.`);
            } else {
                this.toast.show(`Tải CoA lên thành công!`);
            }
        } catch (e: any) {
            console.error('Quick Drive upload error:', e);
            this.toast.show('Không thể tải CoA lên: ' + (e.message || 'Không xác định'), 'error');
        } finally {
            this.isUploadingCoa.set(false);
            event.target.value = '';
        }
    }
}
