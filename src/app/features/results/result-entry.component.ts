import { Component, inject, signal, OnInit, OnDestroy, computed, effect, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StateService } from '../../core/services/state.service';
import { ResultService } from './services/result.service';
import { MasterTargetService } from '../targets/master-target.service';
import { AnalysisResultDraft } from '../../core/models/analysis-result.model';
import { ToastService } from '../../core/services/toast.service';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import {
  resolveConfigKey,
  ANGULAR_SOP_CONFIG,
  SOP914_TBVTV_THUC_PHAM_TEMPLATE_DOC_IDS,
  SOP914_TBVTV_THUC_PHAM_TEMPLATE_URLS
} from './config/sop-configs';
import { getSafeGoogleUrl, formatSampleList } from '../../shared/utils/utils';
import { PrintService } from '../../core/services/print.service';
import { openInNewTab } from '../../shared/utils/browser-navigation';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { SopDraftFactoryService } from './services/sop-draft-factory.service';
import { 
  buildTrifluralinPdfPayload, 
  buildFipronilPdfPayload, 
  buildDichlorvosPdfPayload, 
  buildDefaultSopPdfPayload,
  buildUnifiedType3bPdfPayload,
  buildChloroformPdfPayload
} from './result-pdf-helper';

// Refactored sub-components
import { ResultPrefixTabsComponent } from './components/result-prefix-tabs.component';
import { ResultRunMetadataComponent } from './components/result-run-metadata.component';
import { ResultEntryStatusBannerComponent } from './components/result-entry-status-banner.component';
import { ResultActiveReportsPanelComponent } from './components/result-active-reports-panel.component';
import { ResultEntryHeaderComponent } from './components/result-entry-header.component';
import { SopEntryOutletComponent } from './components/sop-entry-outlet.component';

type AutoSaveStatus = 'synced' | 'modified' | 'saving' | 'error';

interface AutoSaveEnvelope {
  draft: AnalysisResultDraft;
  generation: number;
  revision: number;
}

@Component({
  selector: 'app-result-entry',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    SkeletonComponent,
    // Refactored sub-components
    ResultPrefixTabsComponent,
    ResultRunMetadataComponent,
    ResultEntryStatusBannerComponent,
    ResultActiveReportsPanelComponent,
    ResultEntryHeaderComponent,
    SopEntryOutletComponent
  ],
  templateUrl: './result-entry.component.html'
})
export class ResultEntryComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private state = inject(StateService);
  private resultService = inject(ResultService);
  private toast = inject(ToastService);
  private sanitizer = inject(DomSanitizer);
  private masterService = inject(MasterTargetService);
  private auth = inject(AuthService);
  private draftFactory = inject(SopDraftFactoryService);
  printService = inject(PrintService);

  // Locking mechanism variables
  private heartbeatInterval: any;
  private hasUnsavedChangesActivity = false;
  private previousLockedBy: string | null = null;

  isReadOnly = computed(() => {
    const d = this.draft();
    const r = this.run();
    const user = this.auth.currentUser();
    
    if (d?.status === 'completed') return true;
    if (r?.lockedBy && user && r.lockedBy.toLowerCase() !== user.email.toLowerCase()) {
      if (r.lastActiveAt) {
        const lastActive = this.convertToDate(r.lastActiveAt);
        if (lastActive && (new Date().getTime() - lastActive.getTime()) > 3 * 60 * 1000) {
          return false;
        }
      }
      return true;
    }
    return false;
  });

  lockedByOthers = computed(() => {
    const r = this.run();
    const user = this.auth.currentUser();
    if (!r?.lockedBy || !user || r.lockedBy.toLowerCase() === user.email.toLowerCase()) return false;
    
    if (r.lastActiveAt) {
      const lastActive = this.convertToDate(r.lastActiveAt);
      if (lastActive && (new Date().getTime() - lastActive.getTime()) > 3 * 60 * 1000) {
        return false;
      }
    }
    return true;
  });

  convertToDate(timestamp: any): Date | null {
    if (!timestamp) return null;
    if (timestamp instanceof Date) return timestamp;
    if (typeof timestamp.toDate === 'function') return timestamp.toDate();
    if (timestamp.seconds !== undefined) return new Date(timestamp.seconds * 1000);
    if (typeof timestamp === 'string' || typeof timestamp === 'number') return new Date(timestamp);
    return null;
  }

  @HostListener('document:keyup')
  @HostListener('document:click')
  onUserActivity() {
    this.hasUnsavedChangesActivity = true;
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.autoSaveStatus() !== 'synced') {
      $event.returnValue = true;
    }
    this.releaseLockIfNeeded();
  }

  @HostListener('window:unload')
  onUnload() {
    this.releaseLockIfNeeded();
  }

  private releaseLockIfNeeded() {
    const r = this.run();
    const user = this.auth.currentUser();
    if (r && user && r.lockedBy === user.email) {
      this.resultService.releaseLock(this.requestId);
    }
  }

  masterTargets = signal<any[]>([]);

  requestId = '';
  
  isLoading = signal(true);
  isSavingDraft = signal(false);
  isPublishing = signal(false);
  isProcessing = computed(() => this.isSavingDraft() || this.isPublishing());
  formIsReadOnly = computed(() => this.isReadOnly() || this.isProcessing());

  // Auto-save state
  autoSaveStatus = signal<AutoSaveStatus>('synced');
  lastSavedAt = signal<Date | null>(null);
  renderDraftForm = signal(true);
  private draftChangeSubject = new Subject<AutoSaveEnvelope>();
  private autoSaveSub?: Subscription;
  private autoSaveGeneration = 0;
  private autoSaveRevision = 0;
  private lastSavedRevision = 0;
  private autoSavePaused = false;
  private autoSaveQueue: Promise<void> = Promise.resolve();
  private completionReconcileChecked = false;

  // Emergency feature toggle for the new modular strategy architecture
  readonly ENABLE_MODULAR_SOPS = true;

  // Approved request (run)
  run = signal<any | null>(null);
  
  // Draft data matching AnalysisResultDraft model
  draft = signal<AnalysisResultDraft | null>(null);

  // SOP configuration matching ANGULAR_SOP_CONFIG keys
  config = signal<any | null>(null);

  // Resolved config key (vd: 'trifluralin-gcms') — dùng để gửi sang GAS
  configKey = signal<string | null>(null);

  // Sub-collection history signal
  historyList = signal<any[]>([]);
  showResetModal = signal(false);
  resetConfirmText = signal('');
  isMetadataExpanded = signal(false);

  // Actions dropdown toggle (click-based instead of hover)
  showActionsMenu = signal(false);

  toggleActionsMenu() {
    this.showActionsMenu.update(v => !v);
  }

  closeActionsMenu() {
    this.showActionsMenu.set(false);
  }

  // Restore Version dropdown toggle (click-based instead of hover)
  showRestoreMenu = signal(false);

  toggleRestoreMenu() {
    this.showRestoreMenu.update(v => !v);
  }

  closeRestoreMenu() {
    this.showRestoreMenu.set(false);
  }

  // Global Prefix Filtering
  activeFilter = signal<string>('ALL');
  samplesPerReport = signal<number | null>(null);
  
  detectedPrefixes = computed(() => {
    const r = this.run();
    if (!r) return [];
    const prefixes = new Set<string>();
    
    // 1. Scan from actual sample list
    (r.sampleList || []).forEach((sample: string) => {
      const startsWithLetter = /^[a-zA-Z]/.test(sample);
      const prefix = startsWithLetter ? sample.charAt(0).toUpperCase() : '';
      prefixes.add(prefix);
    });
    
    return Array.from(prefixes).sort();
  });

  filteredRun = computed(() => {
    const r = this.run();
    if (!r) return null;
    const filter = this.activeFilter();
    if (filter === 'ALL') return r;
    
    return {
      ...r,
      sampleList: (r.sampleList || []).filter((sample: string) => {
        const startsWithLetter = /^[a-zA-Z]/.test(sample);
        const prefix = startsWithLetter ? sample.charAt(0).toUpperCase() : '';
        return prefix === filter;
      })
    };
  });

  samplePublishProgress = computed(() => {
    const r = this.run();
    const d = this.draft();
    if (!r || !d) return { published: 0, total: 0, percent: 0, unpublishedSamples: [] as string[] };

    // Tổng mẫu = TẤT CẢ mẫu thực trong mẻ (loại trừ QC nội bộ như QC_SPIKE, QC_FINAL…)
    // Không lọc theo `selected` để tránh hiển thị sai tiến độ khi đang filter prefix
    const allSamples = (r.sampleList || []).filter((s: string) => !s.startsWith('QC_'));

    const publishedSamples = new Set<string>();
    const reports = d.reports || {};
    for (const rep of Object.values(reports)) {
      if (rep && ((rep as any).status === 'completed' || (rep as any).pdfUrl)) {
        ((rep as any).includedSamples || []).forEach((s: string) => publishedSamples.add(s));
      }
    }
    // Báo cáo chung (non-prefix)
    if (d.pdfUrl) {
      allSamples.forEach((s: string) => publishedSamples.add(s));
    }

    const publishedCount = allSamples.filter((s: string) => publishedSamples.has(s)).length;
    const unpublishedSamples = allSamples.filter((s: string) => !publishedSamples.has(s));

    return {
      published: publishedCount,
      total: allSamples.length,
      percent: allSamples.length > 0 ? Math.round(publishedCount / allSamples.length * 100) : 0,
      unpublishedSamples
    };
  });

  publishedSampleSet = computed(() => {
    const progress = this.samplePublishProgress();
    const allSamples = (this.run()?.sampleList || []).filter((s: string) => !s.startsWith('QC_'));
    const published = new Set<string>(allSamples.filter((s: string) => !progress.unpublishedSamples.includes(s)));
    return published;
  });

  getDisplayDevice(): string {
    const r = this.run();
    if (!r) return 'GC-MS/MS / LC-MS/MS';
    
    // Tier 1 & 2: Explicitly passed from smart batch or legacy input
    if (r.inputs?.device) return r.inputs.device;
    if (r.inputs?.instrument) return r.inputs.instrument;

    // Tier 3: Custom entry field (e.g. dichlorvosMethod for Trichlorfon/Dichlorvos)
    const d = this.draft();
    if (d?.page1Data?.['dichlorvosMethod']) return d.page1Data['dichlorvosMethod'];

    // Tier 4: Default from SOP metadata
    const sopList = this.state.sops();
    const sopObj = sopList.find(s => s.id === r.sopId);
    if (sopObj?.device) return sopObj.device;

    // Tier 5: System fallback based on configKey or generic
    const key = this.configKey();
    if (key && key.includes('gcms')) return 'GC-MS/MS';
    if (key && key.includes('lcms')) return 'LC-MS/MS';
    
    return 'GC-MS/MS / LC-MS/MS';
  }

  unsubscribeFromDraft?: () => void;
  private previousDraftStatus: string | null = null;

  constructor() {
    effect(() => {
      const prefixes = this.detectedPrefixes();
      if (prefixes.length === 1) {
        this.activeFilter.set(prefixes[0]);
      }
    }, { allowSignalWrites: true });

    effect(() => {
      const status = this.draft()?.status;
      if (status === 'completed' && this.previousDraftStatus === 'draft') {
        this.toast.show(
          '🔒 Mẻ đã được khoá — Toàn bộ mẫu đã có báo cáo PDF. Dùng "Mở khóa & chỉnh sửa" nếu cần sửa.',
          'success'
        );
      }
      this.previousDraftStatus = status || null;
    }, { allowSignalWrites: false });

    // Tự động giành khóa một cách phản ứng (Reactive Lock Acquisition)
    effect(() => {
      const user = this.auth.currentUser();
      const runDoc = this.run();
      if (user && runDoc && runDoc.status !== 'completed') {
        const isLockedByMe = runDoc.lockedBy?.toLowerCase() === user.email.toLowerCase();
        let isStale = false;
        if (runDoc.lockedBy && !isLockedByMe && runDoc.lastActiveAt) {
          const lastActive = this.convertToDate(runDoc.lastActiveAt);
          if (lastActive && (new Date().getTime() - lastActive.getTime()) > 3 * 60 * 1000) {
            isStale = true;
          }
        }
        if (!runDoc.lockedBy || isStale) {
          this.resultService.acquireLock(this.requestId, user.email, user.displayName);
        }
      }
    });
  }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.requestId) {
      this.toast.show('Không tìm thấy ID mẻ chạy!', 'error');
      this.router.navigate(['/results']);
      return;
    }

    // Gom thao tác nhập nhanh, sau đó xếp hàng tuần tự để không có request cũ
    // hoàn tất sau request mới và ghi đè dữ liệu/trạng thái.
    this.autoSaveSub = this.draftChangeSubject.pipe(
      debounceTime(1500)
    ).subscribe((envelope) => {
      this.autoSaveQueue = this.autoSaveQueue.then(() => this.performAutoSave(envelope));
    });

    // Cập nhật heartbeat định kỳ để cập nhật lastActiveAt (Optimized 1 - Throttled)
    this.heartbeatInterval = setInterval(async () => {
      const r = this.run();
      const user = this.auth.currentUser();
      if (r && user && r.lockedBy === user.email && this.hasUnsavedChangesActivity) {
        this.hasUnsavedChangesActivity = false;
        await this.resultService.updateHeartbeat(this.requestId);
      }
    }, 60000);
    
    // Read prefix from route query params
    this.route.queryParams.subscribe(params => {
      if (params['prefix'] !== undefined) {
        this.activeFilter.set(params['prefix']);
      }
    });

    this.isLoading.set(true);

    // Subscribe to real-time changes of the request document
    this.unsubscribeFromDraft = this.resultService.subscribeToDraft(this.requestId, async (draftDoc: any, runDoc: any) => {
      if (runDoc) {
        const user = this.auth.currentUser();

        // Phát hiện bị giành khóa chỉnh sửa (Take Over - Optimized 2)
        if (this.previousLockedBy && user && this.previousLockedBy === user.email && runDoc.lockedBy && runDoc.lockedBy !== user.email) {
          this.toast.show(`Quyền chỉnh sửa mẻ này đã bị giành bởi ${runDoc.lockedByName || 'người dùng khác'}. Trạng thái của bạn chuyển về Chỉ xem.`, 'warning');
          
          // Lưu backup cục bộ phần thay đổi chưa kịp lưu
          if (this.draft()) {
            try {
              localStorage.setItem(`backup_draft_${user.email}_${this.requestId}`, JSON.stringify(this.draft()));
              console.log('[Locking] Unsaved changes backed up to localStorage');
            } catch (e) {
              console.warn('[Locking] Local backup write failed', e);
            }
          }
        }

        this.previousLockedBy = runDoc.lockedBy || null;
        this.run.set(runDoc);
        
        const sopObj = this.state.sops().find((s: any) => s.id === runDoc.sopId) || null;
        const resolvedKey = resolveConfigKey(runDoc.sopId, runDoc.sopName || '', sopObj);
        const sopConf = resolvedKey ? ANGULAR_SOP_CONFIG[resolvedKey] : null;

        if (sopConf && resolvedKey) {
          this.config.set({ ...sopConf, id: resolvedKey });
          this.configKey.set(resolvedKey);

          if (!draftDoc) {
            // Nếu chưa có nháp, tạo bản nháp mặc định ban đầu
            draftDoc = this.createDefaultDraft(runDoc, sopConf);
          }

          // Cập nhật draft signal thời gian thực
          // Chỉ cập nhật nếu đang loading lần đầu hoặc không có thay đổi chưa lưu
          // để tránh overwrite các giá trị đã được onSopSpecificInit() khởi tạo
          // nhưng chưa kịp auto-save vào Firestore
          if (this.isLoading() || this.autoSaveStatus() === 'synced') {
            this.draft.set(draftDoc);
          }

          // Tự chữa các mẻ cũ đã in đủ 100% nhưng bị autosave kéo ngược về draft.
          if (!this.completionReconcileChecked && draftDoc.status !== 'completed') {
            this.completionReconcileChecked = true;
            void this.resultService.reconcileCompletionStatus(
              this.requestId,
              draftDoc,
              runDoc.sampleList || [],
              runDoc.resultStatusReason
            );
          }
        }
      }
      this.isLoading.set(false);
    });

    // Load Master Targets
    this.masterService.getAll().then(targets => {
      this.masterTargets.set(targets);
    });

    // Tải lịch sử in
    this.loadHistory();
  }

  async loadHistory() {
    const hist = await this.resultService.getHistory(this.requestId);
    this.historyList.set(hist);
  }

  ngOnDestroy() {
    if (this.unsubscribeFromDraft) {
      this.unsubscribeFromDraft();
    }
    if (this.autoSaveSub) {
      this.autoSaveSub.unsubscribe();
    }
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    // Giải phóng khóa khi thoát trang nếu mình là người giữ khóa
    const r = this.run();
    const user = this.auth.currentUser();
    if (r && user && r.lockedBy === user.email) {
      this.resultService.releaseLock(this.requestId);
    }
  }

  onDraftChanged(updatedDraft: AnalysisResultDraft) {
    // Tạo shallow copy để Angular signal luôn nhận new reference,
    // đảm bảo signal trigger change detection ngay cả khi child emit
    // cùng object reference (e.g., sau onSopSpecificInit trong ngOnInit).
    this.draft.set({ ...updatedDraft });
    if (this.autoSavePaused) return;

    const revision = ++this.autoSaveRevision;
    this.autoSaveStatus.set('modified');
    this.draftChangeSubject.next({
      draft: this.cloneDraft(updatedDraft),
      generation: this.autoSaveGeneration,
      revision
    });
  }

  /**
   * Lưu nháp thủ công (Force manual save)
   */
  async triggerSaveDraft() {
    if (!this.draft() || this.isProcessing()) return;
    this.isSavingDraft.set(true);
    try {
      const success = await this.flushCurrentDraft(true);
      if (success) {
        this.toast.show('Đã lưu bản nháp kết quả phân tích thành công!', 'success');
      }
    } finally {
      this.resumeAutoSave();
      this.isSavingDraft.set(false);
    }
  }

  /**
   * Giành quyền chỉnh sửa mẻ chạy (Take Over)
   */
  async takeOverLock() {
    const user = this.auth.currentUser();
    const run = this.run();
    if (!user || !run) return;
    
    const confirmed = confirm(
      `Bạn có chắc chắn muốn giành quyền chỉnh sửa mẻ này?\nThao tác này sẽ chuyển màn hình của ${run.lockedByName || 'người khác'} về chế độ Chỉ xem. Dữ liệu chưa lưu của họ có thể bị mất.`
    );
    if (confirmed) {
      this.isLoading.set(true);
      await this.resultService.acquireLock(this.requestId, user.email, user.displayName);
      this.isLoading.set(false);
      this.toast.show('Bạn đã giành quyền chỉnh sửa mẻ này thành công!', 'success');
    }
  }

  /**
   * Phục hồi bản in trước đó (Fallback backup)
   */
  async restoreBackup() {
    this.isSavingDraft.set(true);
    const restored = await this.resultService.restoreFromBackup(this.requestId);
    if (restored) {
      this.draft.set(restored);
    }
    this.isSavingDraft.set(false);
  }

  /**
   * Khôi phục số liệu từ một phiên bản cụ thể
   */
  async restoreFromVersion(version: number, prefix?: string) {
    if (this.isProcessing()) return;
    
    const displayName = prefix ? (prefix === '_NO_PREFIX_' ? ' (Không tiền tố)' : ` (${prefix})`) : '';
    const confirmed = confirm(`Bạn có chắc chắn muốn khôi phục số liệu nhập liệu của bản v${version}${displayName}? Dữ liệu chưa lưu hiện tại sẽ bị ghi đè.`);
    if (!confirmed) return;

    this.closeRestoreMenu();
    this.isSavingDraft.set(true);
    const restored = await this.resultService.restoreFromVersion(this.requestId, version, prefix);
    if (restored) {
      this.draft.set(restored);
      // Reload lịch sử
      const hist = await this.resultService.getHistory(this.requestId);
      this.historyList.set(hist);
    }
    this.isSavingDraft.set(false);
  }

  /**
   * Xuất bản kết quả -> Tạo tệp PDF
   */
  async triggerPublishReport() {
    if (this.isPublishing()) return;
    
    const currentRun = this.run();
    const currentDraft = this.draft();
    const currentConf = this.config();
    if (!currentRun || !currentDraft || !currentConf) return;

    if (this.isReadOnly()) {
      if (currentDraft.status !== 'completed') {
        this.toast.show('Mẻ chạy đang bị khóa bởi người khác, không thể xuất báo cáo mới!', 'error');
        return;
      }
    }

    this.isPublishing.set(true);

    try {
      // Chờ mọi autosave cũ kết thúc và lưu snapshot mới nhất trước khi tạo PDF.
      // Autosave tiếp tục bị tạm dừng cho đến khi publish hoàn tất.
      const flushed = await this.flushCurrentDraft(false);
      if (!flushed) {
        this.toast.show('Không thể lưu dữ liệu mới nhất. Đã dừng xuất báo cáo để tránh tạo PDF sai.', 'error');
        return;
      }

      const activeFilter = this.activeFilter();
      const key = this.configKey();
      
      // 1. Get all included samples based on activeFilter
      const allIncludedSamples = (currentRun.sampleList || []).filter((s: string) => {
        const resObj = currentDraft.resultData[s] || {};
        const startsWithLetter = /^[a-zA-Z]/.test(s);
        const prefix = startsWithLetter ? s.charAt(0).toUpperCase() : '';
        const isSelected = resObj['selected'] !== false;
        const matchesFilter = activeFilter === 'ALL' || prefix === activeFilter;
        return isSelected && matchesFilter;
      });

      if (allIncludedSamples.length === 0) {
        this.toast.show('Vui lòng chọn ít nhất một mẫu để tạo báo cáo!', 'info');
        this.isPublishing.set(false);
        return;
      }

      // 2. Chunking
      const chunkSize = this.samplesPerReport() || allIncludedSamples.length;
      const chunks = [];
      for (let i = 0; i < allIncludedSamples.length; i += chunkSize) {
        chunks.push(allIncludedSamples.slice(i, i + chunkSize));
      }

      let lastResult = null;

      // 3. Process each chunk
      for (const chunk of chunks) {
        // Clone draft and set selected=false for non-chunk samples
        const chunkDraft = JSON.parse(JSON.stringify(currentDraft));
        (currentRun.sampleList || []).forEach((s: string) => {
          if (!chunk.includes(s)) {
            if (!chunkDraft.resultData[s]) chunkDraft.resultData[s] = {};
            chunkDraft.resultData[s].selected = false;
          }
        });

        // SOP TBVTV Thực Phẩm: maHoSo = danh sách mẫu trong chunk
        // Nếu user chưa nhập (trống) → tự động điền; nếu đã nhập → giữ nguyên khi 1 chunk
        // Khi có nhiều chunk (tách phiếu) → luôn override để đúng với mỗi phiếu
        if (key === 'tbvtv-thuc-pham-gcmsms' && chunk.length > 0) {
          if (!chunkDraft.page1Data) chunkDraft.page1Data = {};
          const currentMaHoSo = chunkDraft.page1Data['maHoSo'] || '';
          if (chunks.length > 1 || !currentMaHoSo.trim()) {
            chunkDraft.page1Data['maHoSo'] = chunk.join(', ');
          }
        }


        let prefixForReport = activeFilter === 'ALL' ? 'ALL' : activeFilter;
        if (activeFilter === 'ALL' && chunk.length > 0) {
          const detectedPrefixes = new Set<string>();
          chunk.forEach((s: string) => {
            const startsWithLetter = /^[a-zA-Z]/.test(s);
            detectedPrefixes.add(startsWithLetter ? s.charAt(0).toUpperCase() : '');
          });
          if (detectedPrefixes.size === 1) {
            prefixForReport = Array.from(detectedPrefixes)[0];
          }
        }

        let reportPayload = null;

        if (key === 'trifluralin-gcms') {
          reportPayload = buildTrifluralinPdfPayload(chunkDraft, currentRun, activeFilter, this.formatAnalysisDate.bind(this), this.getRunDate.bind(this));
        } else if (key === 'tbvtv-thuc-pham-gcmsms') {
          const isRutGon = chunkDraft.page1Data['printFormType'] === 'formRutGon';
          if (isRutGon) {
            const shortConf = { ...ANGULAR_SOP_CONFIG['tbvtv-thuc-pham-gcmsms-rut-gon'], id: 'tbvtv-thuc-pham-gcmsms-rut-gon' };
            reportPayload = buildFipronilPdfPayload(chunkDraft, currentRun, activeFilter, shortConf, this.formatAnalysisDate.bind(this), this.getRunDate.bind(this), this.masterTargets());
            reportPayload.sopId = 'tbvtv-thuc-pham-gcmsms-rut-gon';
            reportPayload.metadata = { ...reportPayload.metadata, printFormType: 'formRutGon', sourceSopId: chunkDraft.sopId || currentRun.sopId, templateDocId: SOP914_TBVTV_THUC_PHAM_TEMPLATE_DOC_IDS.formRutGon, templateDocUrl: SOP914_TBVTV_THUC_PHAM_TEMPLATE_URLS.formRutGon };
          } else {
            reportPayload = buildUnifiedType3bPdfPayload(chunkDraft, currentRun, activeFilter, currentConf, this.formatAnalysisDate.bind(this), this.getRunDate.bind(this), this.masterTargets());
            reportPayload.metadata = { ...reportPayload.metadata, printFormType: 'formDayDu', templateDocId: SOP914_TBVTV_THUC_PHAM_TEMPLATE_DOC_IDS.formDayDu, templateDocUrl: SOP914_TBVTV_THUC_PHAM_TEMPLATE_URLS.formDayDu };
          }
        } else if (key === 'lan-huu-co' || key === 'chlor-huu-co' || key === 'nhom-cuc' || key === 'nhom-i' || currentConf.formType === 'type3b') {
          reportPayload = buildUnifiedType3bPdfPayload(chunkDraft, currentRun, activeFilter, currentConf, this.formatAnalysisDate.bind(this), this.getRunDate.bind(this), this.masterTargets());
        } else if (key === 'fipronil-chlorpyrifos') {
          reportPayload = buildFipronilPdfPayload(chunkDraft, currentRun, activeFilter, currentConf, this.formatAnalysisDate.bind(this), this.getRunDate.bind(this), this.masterTargets());
        } else if (key === 'dichlorvos-gcms') {
          reportPayload = buildDichlorvosPdfPayload(chunkDraft, currentRun, activeFilter, currentConf, this.formatAnalysisDate.bind(this), this.getRunDate.bind(this));
        } else if (key === 'chloroform-gcms') {
          reportPayload = buildChloroformPdfPayload(chunkDraft, currentRun, activeFilter, currentConf, this.formatAnalysisDate.bind(this), this.getRunDate.bind(this));
        } else {
          reportPayload = buildDefaultSopPdfPayload(chunkDraft, currentRun, activeFilter, currentConf, this.formatAnalysisDate.bind(this), this.getRunDate.bind(this), this.masterTargets());
        }

        // Tách dữ liệu dùng để build PDF (chunkDraft, có selected=false cho các mẫu ngoài chunk)
        // khỏi dữ liệu lưu xuống Firestore (draftForSave, giữ nguyên selected gốc của mọi mẫu).
        // Chỉ kế thừa page1Data từ chunkDraft (có thể đã sửa maHoSo) để phản ánh đúng tên hồ sơ.
        const draftForSave = {
          ...currentDraft,
          page1Data: { ...(chunkDraft.page1Data || currentDraft.page1Data) }
        };
        const result = await this.resultService.publishReport(this.requestId, draftForSave, reportPayload, prefixForReport, chunk);
        lastResult = result;
      }

      if (lastResult && lastResult.success) {
        this.draft.update((d: any) => d ? { ...d, status: lastResult.newStatus || 'completed', version: (d.version || 0) + 1 } as any : null);
        this.lastSavedAt.set(new Date());
        this.autoSaveStatus.set('synced');
        const hist = await this.resultService.getHistory(this.requestId);
        this.historyList.set(hist);
        const url = lastResult.pdfViewUrl || lastResult.pdfUrl;
        if (url) {
          this.openPdfPreview(url);
        } else {
          this.toast.show('PDF đã lưu trên Drive nhưng không nhận được liên kết trực tiếp.', 'info');
        }
      }
    } finally {
      this.resumeAutoSave();
      this.isPublishing.set(false);
    }
  }

  /**
   * Hủy xuất bản kết quả (Mở khóa chỉnh sửa)
   */
  async triggerUnlockToEdit() {
    if (this.isProcessing()) return;
    const confirmed = confirm('Bạn có chắc chắn muốn mở khóa mẻ chạy này để chỉnh sửa?\nSau khi chỉnh sửa xong, lần xuất bản tiếp theo sẽ tạo ra một bản báo cáo phiên bản mới (tăng 1 version) mà không xóa bản cũ.');
    if (!confirmed) return;

    this.isSavingDraft.set(true);
    try {
      const updated = await this.resultService.unlockToEdit(this.requestId);
      if (updated) {
        this.draft.set(updated);
        // Reload lịch sử
        const hist = await this.resultService.getHistory(this.requestId);
        this.historyList.set(hist);
      }
    } finally {
      this.isSavingDraft.set(false);
    }
  }

  // Reset results modal actions
  openResetModal() {
    this.resetConfirmText.set('');
    this.showResetModal.set(true);
  }

  closeResetModal() {
    this.showResetModal.set(false);
    this.resetConfirmText.set('');
  }

  onResetConfirmInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.resetConfirmText.set(val);
  }

  async triggerResetResults() {
    if (this.resetConfirmText() !== 'XÓA' || this.isProcessing()) return;
    const run = this.run();
    const config = this.config();
    if (!run || !config) return;

    this.showResetModal.set(false);
    this.isSavingDraft.set(true);

    try {
      // Chặn mọi request autosave cũ trước khi reset. Nếu không, một request chậm
      // có thể merge ngược số liệu vừa xóa vào document mới.
      await this.pauseAutoSave();
      const freshDraft = this.createDefaultDraft(run, config);
      const updated = await this.resultService.resetResults(this.requestId, freshDraft);
      if (updated) {
        // Remount component SOP để các hook khởi tạo chuyên biệt chạy đúng như
        // lần đầu mở mẻ (loại mẫu, khối lượng, form in, vial, QC...).
        this.renderDraftForm.set(false);
        this.draft.set(updated);
        this.autoSaveRevision = 0;
        this.lastSavedRevision = 0;
        this.lastSavedAt.set(new Date());
        this.autoSaveStatus.set('synced');
        await Promise.resolve();
        // Mở autosave trước khi remount để mọi mặc định bổ sung từ hook ngOnInit
        // của SOP cũng được ghi lại, không chỉ tồn tại tạm thời trên giao diện.
        this.resumeAutoSave();
        this.renderDraftForm.set(true);
        // Reload lịch sử
        const hist = await this.resultService.getHistory(this.requestId);
        this.historyList.set(hist);
      }
    } finally {
      this.resumeAutoSave();
      this.isSavingDraft.set(false);
      this.resetConfirmText.set('');
    }
  }

  async triggerDeleteVirtualMaster() {
    if (!this.run()?.isVirtualMaster || this.isProcessing()) return;
    
    // Yêu cầu confirm
    if (!confirm('Bạn có chắc chắn muốn gỡ gộp và xóa mẻ tổng hợp này không?\nDữ liệu kết quả mẫu đã nhập sẽ vẫn được giữ nguyên ở các mẻ con.')) {
      return;
    }

    this.isSavingDraft.set(true);
    try {
      const success = await this.resultService.deleteVirtualMaster(this.requestId);
      if (success) {
        // Điều hướng về dashboard kết quả
        this.router.navigate(['/results']);
      }
    } finally {
      this.isSavingDraft.set(false);
    }
  }

  findReportForFilter(activeFilter: string): any | null {
    const d = this.draft();
    const r = this.run();
    if (!d || activeFilter === 'ALL') return null;
    const prefixKey = activeFilter === '' ? '_NO_PREFIX_' : activeFilter;

    // Compute current included samples for this filter to match exactly if possible
    const currentRun = r;
    const currentDraft = d;
    const includedSamples = (currentRun?.sampleList || []).filter((s: string) => {
      const resObj = currentDraft?.resultData?.[s] || {};
      const startsWithLetter = /^[a-zA-Z]/.test(s);
      const prefix = startsWithLetter ? s.charAt(0).toUpperCase() : '';
      const isSelected = resObj['selected'] !== false;
      return isSelected && prefix === activeFilter;
    });
    const sortedCurrent = [...includedSamples].sort().join(',');

    const findInReports = (reportsObj: any) => {
      if (!reportsObj) return null;
      const candidates = Object.entries(reportsObj).map(([key, rep]: [string, any]) => {
        if (!rep) return null;
        const repPrefix = rep.prefix || key;
        return { ...rep, repPrefix, originalKey: key };
      }).filter((rep: any) => {
        return rep && rep.repPrefix === prefixKey;
      });
      if (candidates.length === 0) return null;

      // 1. Try to find exact match on includedSamples
      const exactMatch = candidates.find((rep: any) => {
        const repSamples = [...(rep.includedSamples || [])].sort().join(',');
        return repSamples === sortedCurrent;
      });
      if (exactMatch) return exactMatch;

      // 2. Fallback to the latest report for this prefix
      candidates.sort((a: any, b: any) => {
        const valA = a.version || 0;
        const valB = b.version || 0;
        return valB - valA;
      });
      return candidates[0];
    };

    const draftReport = findInReports(d.reports);
    if (draftReport && (draftReport.pdfUrl || draftReport.pdfViewUrl || draftReport.docsUrl)) {
      return draftReport;
    }

    const runReports = r?.analysisResultSummary?.reports || r?.analysisResult?.reports;
    const runReport = findInReports(runReports);
    if (runReport && (runReport.pdfUrl || runReport.pdfViewUrl || runReport.docsUrl)) {
      return runReport;
    }

    return null;
  }

  getPrintButtonLabel(): string {
    const activeFilter = this.activeFilter();
    if (activeFilter === 'ALL') {
      const v = (this.draft()?.version || 0) + 1;
      return `Tạo & In bản v${v} (Tất cả mẫu)`;
    }
    const reportForFilter = this.findReportForFilter(activeFilter) || {};
    const v = (reportForFilter.version || 0) + 1;
    const filterName = activeFilter === '' ? 'Không tiền tố' : `Nhóm ${activeFilter}`;
    return `Tạo & In bản v${v} (${filterName})`;
  }

  getCurrentPdfUrl(): string | null {
    const activeFilter = this.activeFilter();
    let url: string | null = null;
    const d = this.draft();
    const r = this.run();
    if (!d) return null;

    if (activeFilter === 'ALL') {
      url = d.pdfViewUrl || (d as any).pdfUrl || null;
      if (!url && r) {
        url = r.analysisResultSummary?.pdfViewUrl || r.analysisResultSummary?.pdfUrl || r.analysisResult?.pdfViewUrl || r.analysisResult?.pdfUrl || null;
      }
    } else {
      const reportForFilter = this.findReportForFilter(activeFilter) || {};
      url = reportForFilter.pdfViewUrl || reportForFilter.pdfUrl || null;
    }
    return getSafeGoogleUrl(url, 'pdf');
  }

  formatSampleList = formatSampleList;

  getRunDate(): string {
    const run = this.run();
    if (!run) return new Date().toISOString().split('T')[0];
    if (run.analysisDate) return run.analysisDate;
    if (run.approvedAt?.toDate) {
      const d = run.approvedAt.toDate();
      const offset = d.getTimezoneOffset();
      return new Date(d.getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];
    }
    if (run.timestamp?.toDate) {
      const d = run.timestamp.toDate();
      const offset = d.getTimezoneOffset();
      return new Date(d.getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  }

  getCurrentDocsUrl(): string | null {
    const activeFilter = this.activeFilter();
    let url: string | null = null;
    const d = this.draft();
    const r = this.run();
    if (!d) return null;

    if (activeFilter === 'ALL') {
      url = d.docsUrl || null;
      if (!url && r) {
        url = r.analysisResultSummary?.docsUrl || r.analysisResult?.docsUrl || null;
      }
    } else {
      const reportForFilter = this.findReportForFilter(activeFilter) || {};
      url = reportForFilter.docsUrl || null;
    }
    return getSafeGoogleUrl(url, 'doc');
  }

  hasAnyActiveReports(): boolean {
    const d = this.draft();
    const r = this.run();
    if (!d || !r) return false;
    if (d.pdfUrl || d.pdfViewUrl || (d as any).docsUrl || r.analysisResultSummary?.pdfUrl || r.analysisResultSummary?.pdfViewUrl || r.analysisResult?.pdfUrl || r.analysisResult?.pdfViewUrl) return true;
    const reports = d.reports || {};
    if (Object.values(reports).some((rep: any) => rep && (rep.pdfUrl || rep.pdfViewUrl || rep.docsUrl))) return true;
    const runReports = r.analysisResultSummary?.reports || r.analysisResult?.reports || {};
    return Object.values(runReports).some((rep: any) => rep && (rep.pdfUrl || rep.pdfViewUrl || rep.docsUrl));
  }

  getPrefixReport(prefix: string): any | null {
    return this.findReportForFilter(prefix);
  }

  /**
   * Trả về TẤT CẢ các báo cáo (chunks) thuộc một prefix,
   * bao gồm cả trường hợp tách phiếu nhiều chunk cùng tiền tố.
   * Sắp xếp theo thời gian tạo (cũ → mới).
   */
  getAllReportsForPrefix(prefix: string): any[] {
    const d = this.draft();
    const r = this.run();
    const prefixKey = prefix === '' ? '_NO_PREFIX_' : prefix;

    const extractFromReports = (reportsObj: any): any[] => {
      if (!reportsObj) return [];
      return Object.values(reportsObj)
        .filter((rep: any) => rep && (rep.prefix || '') === prefixKey && (rep.pdfUrl || rep.pdfViewUrl || rep.docsUrl))
        .sort((a: any, b: any) => {
          // Sort by creation time ascending
          const ta = a.pdfCreatedAt || '';
          const tb = b.pdfCreatedAt || '';
          return ta.localeCompare(tb);
        });
    };

    const draftReports = extractFromReports(d?.reports);
    if (draftReports.length > 0) return draftReports;

    const runReports = r?.analysisResultSummary?.reports || r?.analysisResult?.reports;
    return extractFromReports(runReports);
  }

  getGeneralReport(): any | null {
    const d = this.draft();
    const r = this.run();
    
    // Ưu tiên draft nếu có
    if (d && (d.pdfUrl || d.pdfViewUrl || (d as any).docsUrl)) {
      return {
        version: d.version,
        publishedBy: d.updatedBy,
        pdfUrl: d.pdfUrl,
        pdfViewUrl: d.pdfViewUrl,
        docsUrl: (d as any).docsUrl
      };
    }
    
    // Lấy từ run
    if (r) {
       const sum = r.analysisResultSummary || r.analysisResult;
       if (sum && (sum.pdfUrl || sum.pdfViewUrl || sum.docsUrl)) {
         return {
           version: sum.version || d?.version || 1,
           publishedBy: sum.updatedBy || sum.publishedBy || 'System',
           pdfUrl: sum.pdfUrl,
           pdfViewUrl: sum.pdfViewUrl,
           docsUrl: sum.docsUrl
         };
       }
    }
    return null;
  }

  getSafeGoogleUrl = getSafeGoogleUrl;

  openUrl(url: string | null) {
    if (url) openInNewTab(url);
  }

  private cloneDraft(draft: AnalysisResultDraft): AnalysisResultDraft {
    return JSON.parse(JSON.stringify(draft));
  }

  private createDefaultDraft(runDoc: any, sopConf: any): AnalysisResultDraft {
    return this.draftFactory.createInitialDraft(runDoc, sopConf, {
      requestId: this.requestId,
      updatedBy: this.auth.currentUser()?.displayName || 'System',
      masterTargets: this.masterTargets()
    });
  }

  private async performAutoSave(envelope: AutoSaveEnvelope): Promise<void> {
    if (this.autoSavePaused
      || envelope.generation !== this.autoSaveGeneration
      || envelope.revision <= this.lastSavedRevision) {
      return;
    }

    const run = this.run();
    const user = this.auth.currentUser();
    const isLockedByOthers = run?.lockedBy && user
      && run.lockedBy.toLowerCase() !== user.email.toLowerCase();
    if (isLockedByOthers) return;

    this.autoSaveStatus.set('saving');
    const success = await this.resultService.saveDraft(
      this.requestId,
      envelope.draft,
      false,
      false
    );

    // Một thao tác reset/publish có thể đã bắt đầu trong lúc request đang chạy.
    if (envelope.generation !== this.autoSaveGeneration) return;

    if (success) {
      this.lastSavedRevision = Math.max(this.lastSavedRevision, envelope.revision);
      this.lastSavedAt.set(new Date());
      this.autoSaveStatus.set(
        this.autoSaveRevision <= this.lastSavedRevision ? 'synced' : 'modified'
      );
    } else {
      this.autoSaveStatus.set('error');
    }
  }

  private async pauseAutoSave(): Promise<void> {
    this.autoSavePaused = true;
    this.autoSaveGeneration++;
    await this.autoSaveQueue;
  }

  private resumeAutoSave(): void {
    this.autoSavePaused = false;
  }

  private async flushCurrentDraft(isManualSave: boolean): Promise<boolean> {
    const currentDraft = this.draft();
    if (!currentDraft) return false;

    await this.pauseAutoSave();
    this.autoSaveStatus.set('saving');
    const success = await this.resultService.saveDraft(
      this.requestId,
      this.cloneDraft(currentDraft),
      isManualSave,
      false
    );

    if (success) {
      this.lastSavedRevision = this.autoSaveRevision;
      this.lastSavedAt.set(new Date());
      this.autoSaveStatus.set('synced');
    } else {
      this.autoSaveStatus.set('error');
    }
    return success;
  }

  formatAnalysisDate(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  }

  goBack() {
    this.router.navigate(['/results']);
  }

  openPdfPreview(pdfUrl: string | null | undefined, docsUrl?: string | null | undefined) {
    if (!pdfUrl) return;
    const activeFilter = this.activeFilter();
    const filterName = activeFilter === 'ALL' ? 'Tất cả mẫu' : (activeFilter === '' ? 'Không tiền tố' : `Nhóm ${activeFilter}`);
    const previewUrl = getGoogleDrivePreviewUrl(pdfUrl);
    const docPreviewUrl = docsUrl ? getGoogleDrivePreviewUrl(docsUrl) : undefined;

    this.printService.openPdfPreview(
      previewUrl,
      `Báo cáo kết quả — ${this.run()?.sopName || ''} (${filterName})`,
      this.draft()?.version || 1,
      this.draft()?.updatedBy || 'Chưa rõ',
      this.draft()?.updatedAt,
      async () => {
        await this.triggerPublishReport();
      },
      'iframe',
      docPreviewUrl
    );
  }
}

/**
 * Trích xuất Google Drive File ID và chuyển đổi sang dạng URL preview an toàn cho iframe nhúng
 */
function getGoogleDrivePreviewUrl(url: string | null | undefined): string {
  if (!url) return '';
  const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return `https://drive.google.com/file/d/${fileDMatch[1]}/preview`;
  }
  const docDMatch = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (docDMatch && docDMatch[1]) {
    return `https://docs.google.com/document/d/${docDMatch[1]}/preview`;
  }
  try {
    const urlObj = new URL(url);
    const id = urlObj.searchParams.get('id');
    if (id) {
      return `https://drive.google.com/file/d/${id}/preview`;
    }
  } catch (e) {
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
    }
  }
  return url;
}

