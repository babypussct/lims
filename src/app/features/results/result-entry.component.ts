import { Component, inject, signal, OnInit, OnDestroy, computed, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StateService } from '../../core/services/state.service';
import { ResultService } from './services/result.service';
import { AnalysisResultDraft } from '../../core/models/analysis-result.model';
import { ResultEntryType2Component } from './result-entry-type2.component';
import { ResultEntryType3bComponent } from './result-entry-type3b.component';
import { ToastService } from '../../core/services/toast.service';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { resolveConfigKey, ANGULAR_SOP_CONFIG } from './config/sop-configs';
import { getSafeGoogleUrl, formatSampleList } from '../../shared/utils/utils';
import { PrintService } from '../../core/services/print.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

// Isolated SOP presentational components
import { Sop01EntryComponent } from './sops/sop-01/sop-01-entry.component';
import { Sop1767857760184EntryComponent } from './sops/sop-1767857760184/sop-1767857760184-entry.component';
import { Sop03EntryComponent } from './sops/sop-03/sop-03-entry.component';
import { SopDefaultType2EntryComponent } from './sops/sop-default-type2/sop-default-type2-entry.component';
import { SopNhomLanHuuCoGcMsmsCopy1768036876719EntryComponent } from './sops/sop-nhom-lan-huu-co-gc-msms-copy-1768036876719/sop-nhom-lan-huu-co-gc-msms-copy-1768036876719-entry.component';
import { SopLanHuuCoEntryComponent } from './sops/sop-lan-huu-co/sop-lan-huu-co-entry.component';
import { isCompoundAssigned } from './shared/compound-id-resolver';
import { 
  buildTrifluralinPdfPayload, 
  buildFipronilPdfPayload, 
  buildDichlorvosPdfPayload, 
  buildDefaultSopPdfPayload,
  buildLanHuuCoPdfPayload,
  buildChlorHuuCoPdfPayload
} from './result-pdf-helper';

@Component({
  selector: 'app-result-entry',
  standalone: true,
  imports: [
    CommonModule, 
    ResultEntryType2Component, 
    ResultEntryType3bComponent, 
    SkeletonComponent,
    Sop01EntryComponent,
    Sop1767857760184EntryComponent,
    Sop03EntryComponent,
    SopDefaultType2EntryComponent,
    SopNhomLanHuuCoGcMsmsCopy1768036876719EntryComponent,
    SopLanHuuCoEntryComponent
  ],
  templateUrl: './result-entry.component.html'
})
export class ResultEntryComponent implements OnInit, OnDestroy {
  @ViewChild('type2Grid') type2Grid?: ResultEntryType2Component;
  @ViewChild('sop03Grid') sop03Grid?: Sop03EntryComponent;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private state = inject(StateService);
  private resultService = inject(ResultService);
  private toast = inject(ToastService);
  private sanitizer = inject(DomSanitizer);
  printService = inject(PrintService);

  requestId = '';
  
  isLoading = signal(true);
  isSavingDraft = signal(false);
  isPublishing = signal(false);
  isProcessing = computed(() => this.isSavingDraft() || this.isPublishing());

  // Auto-save state
  autoSaveStatus = signal<'synced' | 'modified' | 'saving'>('synced');
  private draftChangeSubject = new Subject<AnalysisResultDraft>();
  private autoSaveSub?: Subscription;

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

  // Global Prefix Filtering
  activeFilter = signal<string>('ALL');
  
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

  unsubscribeFromDraft?: () => void;

  constructor() {
    effect(() => {
      const prefixes = this.detectedPrefixes();
      if (prefixes.length === 1) {
        this.activeFilter.set(prefixes[0]);
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.requestId) {
      this.toast.show('Không tìm thấy ID mẻ chạy!', 'error');
      this.router.navigate(['/results']);
      return;
    }

    // Initialize auto-save subscription with 10s debounce
    this.autoSaveSub = this.draftChangeSubject.pipe(
      debounceTime(10000)
    ).subscribe(async (updatedDraft) => {
      this.autoSaveStatus.set('saving');
      const success = await this.resultService.saveDraft(this.requestId, updatedDraft, false);
      if (success) {
        this.autoSaveStatus.set('synced');
      } else {
        this.autoSaveStatus.set('modified');
      }
    });
    
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
          this.draft.set(draftDoc);
        }
      }
      this.isLoading.set(false);
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
  }

  private createDefaultDraft(runDoc: any, sopConf: any): AnalysisResultDraft {
    const isTrifluralin = runDoc.sopId === 'SOP-03' || (sopConf.columns && sopConf.columns.kqTrifluralin !== undefined);
    const isFipronil = runDoc.sopId === 'SOP-01' || (sopConf.columns && sopConf.columns.kqFip !== undefined);
    const isDichlorvos = runDoc.sopId === 'sop_1767857760184' || (sopConf.columns && sopConf.columns.kqDichlorvos !== undefined);

    const defaultPage1: Record<string, any> = {
      ngayNguoiPhanTich: new Date().toISOString().split('T')[0],
      ngayNguoiThamTra: new Date().toISOString().split('T')[0],
      checkTatCaND: true,
      checkCoMauPhatHien: false
    };

    if (isTrifluralin) {
      defaultPage1['r2'] = '0.999';
      defaultPage1['hasFinal'] = true;
      defaultPage1['blankName'] = '';
      defaultPage1['spikeName'] = '';
      defaultPage1['calibPoints'] = [
        { loSo: '41', hamLuong: '0' },
        { loSo: '42', hamLuong: '0.5' },
        { loSo: '43', hamLuong: '1.0' },
        { loSo: '44', hamLuong: '5.0' },
        { loSo: '45', hamLuong: '10.0' },
        { loSo: '46', hamLuong: '30.0' }
      ];
    } else if (isDichlorvos) {
      defaultPage1['r2'] = '0.999';
      defaultPage1['dichlorvosMethod'] = 'GC/MS';
      defaultPage1['hasFinal'] = false;
      defaultPage1['blankName'] = '';
      defaultPage1['spikeName'] = '';
      defaultPage1['calibPoints'] = [
        { loSo: '51', hamLuong: '0' },
        { loSo: '52', hamLuong: '5' },
        { loSo: '53', hamLuong: '10' },
        { loSo: '54', hamLuong: '20' },
        { loSo: '55', hamLuong: '30' },
        { loSo: '56', hamLuong: '40' }
      ];
    } else if (isFipronil) {
      defaultPage1['hasCheckSample'] = false;
      defaultPage1['maHoSo'] = '';
      defaultPage1['heSoPhaLoang'] = '1';
      defaultPage1['loaiMau'] = 'Thủy sản';
      defaultPage1['tinhTrangMau'] = 'Bình thường';
      defaultPage1['calibPoints'] = [
        { loSo: '1.1', vialNo: '1.1' },
        { loSo: '1.2', vialNo: '1.2' },
        { loSo: '1.3', vialNo: '1.3' },
        { loSo: '1.4', vialNo: '1.4' },
        { loSo: '1.5', vialNo: '1.5' }
      ];
      // Explicitly set dynamic QC checklist defaults to true
      defaultPage1['qcR2'] = true;
      defaultPage1['qcThoiGianLuu'] = true;
      defaultPage1['qcThemChuan'] = true;
      defaultPage1['qcThuHoi'] = true;
      defaultPage1['qcDanhGiaChung'] = true;
      defaultPage1['qcKiemTraNoiBo'] = defaultPage1['hasCheckSample'] ? true : null;
      defaultPage1['qcNhanDang'] = null; // Exception: qcNhanDang starts as N/A
    } else if (sopConf.checkboxLines) {
      // Tự động gán các checkbox phụ từ cấu hình SOP_CONFIG bằng false
      Object.values(sopConf.checkboxLines).forEach((field: any) => {
        if (field !== 'checkTatCaND' && field !== 'checkCoMauPhatHien') {
          defaultPage1[field] = false;
        }
      });
    }

    if (sopConf.formType === 'type3b') {
      defaultPage1['checkGopInChung'] = true;
      defaultPage1['printFormType'] = 'formCheck';
    }

    const defaultResultData: Record<string, any> = {};
    const sampleList = runDoc.sampleList || [];
    
    if (isTrifluralin) {
      defaultResultData['QC_BLANK'] = { loSo: '47', kqTrifluralin: 'ND', ghiChu: '', selected: true };
      defaultResultData['QC_SPIKE'] = { loSo: '48', kqTrifluralin: '', ghiChu: '', selected: true };
      
      sampleList.forEach((sampleCode: string, idx: number) => {
        defaultResultData[sampleCode] = {
          loSo: String(idx + 1),
          kqTrifluralin: '',
          ghiChu: '',
          selected: true
        };
      });
    } else if (isDichlorvos) {
      sampleList.forEach((sampleCode: string, idx: number) => {
        const randW = (10.01 + Math.random() * 0.09).toFixed(2);
        defaultResultData[sampleCode] = {
          loSo: String(idx + 1),
          selected: true,
          khoiLuong: randW,
          heSoPhaLoang: '1'
        };
        Object.keys(sopConf.columns || {}).forEach((col: string) => {
          if (col !== 'loSo' && col !== 'maSoMau' && col !== 'ghiChu' && col !== 'khoiLuong' && col !== 'heSoPhaLoang') {
            defaultResultData[sampleCode][col] = '';
          }
        });
        defaultResultData[sampleCode]['ghiChu'] = '';
      });
    } else if (isFipronil) {
      const activeCols = Object.keys(sopConf.columns || {}).filter(c => c !== 'loSo' && c !== 'maSoMau' && c !== 'ghiChu');
      
      // 1. BLANK (vial 1.7)
      defaultResultData['QC_BLANK'] = { loSo: '1.7', selected: true };
      activeCols.forEach(col => defaultResultData['QC_BLANK'][col] = '');
      defaultResultData['QC_BLANK']['ghiChu'] = '';

      // 2. SPIKE (vial 1.8)
      defaultResultData['QC_SPIKE'] = { loSo: '1.8', selected: true };
      activeCols.forEach(col => defaultResultData['QC_SPIKE'][col] = '');
      defaultResultData['QC_SPIKE']['ghiChu'] = '';

      // 3. Optional CHECK_SAMPLE (vial 1.9)
      defaultResultData['QC_CHECK_SAMPLE'] = { loSo: '1.9', selected: true };
      activeCols.forEach(col => defaultResultData['QC_CHECK_SAMPLE'][col] = '');
      defaultResultData['QC_CHECK_SAMPLE']['ghiChu'] = '';

      // 4. Regular samples starting at vial 1.10
      sampleList.forEach((sampleCode: string, idx: number) => {
        const currentVial = 10 + idx;
        const rack = 1 + Math.floor((currentVial - 1) / 54);
        const vial = ((currentVial - 1) % 54) + 1;
        
        defaultResultData[sampleCode] = {
          loSo: `${rack}.${vial}`,
          selected: true
        };
        activeCols.forEach(col => defaultResultData[sampleCode][col] = '');
        defaultResultData[sampleCode]['ghiChu'] = '';
      });

      // 5. FINAL (vial 1.8)
      defaultResultData['QC_FINAL'] = { loSo: '1.8', selected: true };
      activeCols.forEach(col => defaultResultData['QC_FINAL'][col] = '');
      defaultResultData['QC_FINAL']['ghiChu'] = '';
    } else {
      sampleList.forEach((sampleCode: string) => {
        defaultResultData[sampleCode] = {};
        
        if (sopConf.formType === 'type3b') {
          // Cho dạng 3B (Chlor/Lân hữu cơ): Điền mặc định ND và QC đạt chỉ cho các hoạt chất được phân công
          const sampleTargetMap = runDoc.sampleTargetMap || (runDoc.inputs && runDoc.inputs.sampleTargetMap) || {};
          const isAssigned = (sCode: string, compound: string): boolean => {
            const assigned = sampleTargetMap[sCode];
            if (!assigned) return true;
            return isCompoundAssigned(assigned, compound);
          };

          sopConf.compounds.forEach((c: string) => {
            if (isAssigned(sampleCode, c)) {
              defaultResultData[sampleCode][c] = '';
              defaultResultData[sampleCode][`${c}_nd`] = true;
              defaultResultData[sampleCode][`${c}_qc1`] = 'Đạt';
              defaultResultData[sampleCode][`${c}_qc2`] = 'Đạt';
              defaultResultData[sampleCode][`${c}_qc3`] = 'Đạt';
            } else {
              defaultResultData[sampleCode][c] = 'N/A';
              defaultResultData[sampleCode][`${c}_nd`] = false;
              defaultResultData[sampleCode][`${c}_qc1`] = 'N/A';
              defaultResultData[sampleCode][`${c}_qc2`] = 'N/A';
              defaultResultData[sampleCode][`${c}_qc3`] = 'N/A';
            }
          });
        } else {
          // Cho dạng 2 / 3A: Cột hoạt chất rỗng
          Object.keys(sopConf.columns).forEach((col: string) => {
            if (col !== 'loSo' && col !== 'maSoMau' && col !== 'ghiChu') {
              defaultResultData[sampleCode][col] = '';
            }
          });
        }
      });
    }

    return {
      id: this.requestId,
      requestId: this.requestId,
      sopId: runDoc.sopId,
      sopName: runDoc.sopName,
      status: 'draft',
      page1Data: defaultPage1,
      resultData: defaultResultData,
      updatedAt: new Date(),
      updatedBy: 'System'
    };
  }

  onDraftChanged(updatedDraft: AnalysisResultDraft) {
    this.draft.set(updatedDraft);
    if (this.autoSaveStatus() !== 'saving') {
      this.autoSaveStatus.set('modified');
    }
    this.draftChangeSubject.next(updatedDraft);
  }

  /**
   * Lưu nháp thủ công (Force manual save)
   */
  async triggerSaveDraft() {
    if (!this.draft() || this.isProcessing()) return;
    this.isSavingDraft.set(true);
    this.autoSaveStatus.set('saving'); // Kích hoạt trạng thái hiển thị "Đang lưu..."
    
    const success = await this.resultService.saveDraft(this.requestId, this.draft()!, true);
    
    if (success) {
      this.toast.show('Đã lưu bản nháp kết quả phân tích thành công!', 'success');
      this.autoSaveStatus.set('synced'); // Hiển thị "Đã lưu tự động"
    } else {
      this.autoSaveStatus.set('modified');
    }
    this.isSavingDraft.set(false);
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
    const currentDraft = this.draft();
    const currentRun = this.run();
    const currentConf = this.config();
    if (!currentDraft || !currentRun || !currentConf) return;

    // Bắt buộc điền Mã hồ sơ, Tên Blank, Tên Spike cho SOP-01 trước khi xuất bản PDF
    const key = this.configKey();
    if (key === 'fipronil-chlorpyrifos') {
      const maHoSo = String(currentDraft.page1Data['maHoSo'] || '').trim();
      const blankName = String(currentDraft.page1Data['blankName'] || '').trim();
      const spikeName = String(currentDraft.page1Data['spikeName'] || '').trim();

      const missingFields: string[] = [];
      if (!maHoSo) missingFields.push('1. Mã hồ sơ');
      if (!blankName) missingFields.push('Tên Blank');
      if (!spikeName) missingFields.push('Tên Spike');

      if (missingFields.length > 0) {
        this.toast.show(`Vui lòng điền đầy đủ thông tin bắt buộc: ${missingFields.join(', ')} trước khi xuất bản PDF!`, 'error');
        return;
      }
    }

    this.isPublishing.set(true);

    try {
      const activeFilter = this.activeFilter();
      const prefixForReport = activeFilter === 'ALL' ? 'ALL' : activeFilter;
      const key = this.configKey();
      let reportPayload: any;

      if (key === 'trifluralin-gcms') {
        const sampleList = currentRun.sampleList || [];
        const hasSelected = sampleList.some((s: string) => {
          const resObj = currentDraft.resultData[s] || {};
          const startsWithLetter = /^[a-zA-Z]/.test(s);
          const prefix = startsWithLetter ? s.charAt(0).toUpperCase() : '';
          const isSelected = resObj['selected'] !== false;
          return isSelected && (activeFilter === 'ALL' || prefix === activeFilter);
        });

        if (!hasSelected) {
          this.toast.show('Vui lòng chọn ít nhất một mẫu để tạo báo cáo!', 'info');
          this.isPublishing.set(false);
          return;
        }

        reportPayload = buildTrifluralinPdfPayload(
          currentDraft,
          currentRun,
          activeFilter,
          this.formatAnalysisDate.bind(this),
          this.getRunDate.bind(this)
        );
      } else if (key === 'lan-huu-co') {
        reportPayload = buildLanHuuCoPdfPayload(
          currentDraft,
          currentRun,
          activeFilter,
          currentConf,
          this.formatAnalysisDate.bind(this),
          this.getRunDate.bind(this)
        );
      } else if (key === 'chlor-huu-co') {
        reportPayload = buildChlorHuuCoPdfPayload(
          currentDraft,
          currentRun,
          activeFilter,
          currentConf,
          this.formatAnalysisDate.bind(this),
          this.getRunDate.bind(this)
        );
      } else if (key === 'fipronil-chlorpyrifos') {
        reportPayload = buildFipronilPdfPayload(
          currentDraft,
          currentRun,
          activeFilter,
          currentConf,
          this.formatAnalysisDate.bind(this),
          this.getRunDate.bind(this)
        );
      } else if (key === 'dichlorvos-gcms') {
        reportPayload = buildDichlorvosPdfPayload(
          currentDraft,
          currentRun,
          activeFilter,
          currentConf,
          this.formatAnalysisDate.bind(this),
          this.getRunDate.bind(this)
        );
      } else {
        reportPayload = buildDefaultSopPdfPayload(
          currentDraft,
          currentRun,
          activeFilter,
          currentConf,
          this.formatAnalysisDate.bind(this),
          this.getRunDate.bind(this)
        );
      }

      const result = await this.resultService.publishReport(this.requestId, currentDraft, reportPayload, prefixForReport);
      if (result.success) {
        this.draft.update((d: any) => d ? { ...d, status: 'completed', version: (d.version || 0) + 1 } as any : null);

        const hist = await this.resultService.getHistory(this.requestId);
        this.historyList.set(hist);

        const url = result.pdfViewUrl || result.pdfUrl;
        if (url) {
          this.openPdfPreview(url);
        } else {
          this.toast.show('PDF đã lưu trên Drive nhưng không nhận được liên kết trực tiếp.', 'info');
        }
      }
    } finally {
      this.isPublishing.set(false);
    }
  }

  /**
   * Hủy xuất bản kết quả (Mở khóa chỉnh sửa)
   */
  async triggerRevertToDraft() {
    if (this.isProcessing()) return;
    const confirmed = confirm('Bạn có chắc chắn muốn hủy xuất bản mẻ này? Bản in hiện tại sẽ được lưu trữ (Archived) và mẻ chạy sẽ quay về trạng thái bản nháp.');
    if (!confirmed) return;

    this.isSavingDraft.set(true);
    try {
      const updated = await this.resultService.revertToDraft(this.requestId);
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
    this.showResetModal.set(false);
    this.isSavingDraft.set(true);

    try {
      const updated = await this.resultService.resetResults(this.requestId);
      if (updated) {
        this.draft.set(updated);
        // Reload lịch sử
        const hist = await this.resultService.getHistory(this.requestId);
        this.historyList.set(hist);
      }
    } finally {
      this.isSavingDraft.set(false);
      this.resetConfirmText.set('');
    }
  }

  getPrintButtonLabel(): string {
    const activeFilter = this.activeFilter();
    if (activeFilter === 'ALL') {
      const v = (this.draft()?.version || 0) + 1;
      return `Tạo & In bản v${v} (Tất cả mẫu)`;
    }
    const reports = this.draft()?.reports || {};
    const reportKey = activeFilter === '' ? '_NO_PREFIX_' : activeFilter;
    const reportForFilter = reports[reportKey] || {};
    const v = (reportForFilter.version || 0) + 1;
    const filterName = activeFilter === '' ? 'Không tiền tố' : `Nhóm ${activeFilter}`;
    return `Tạo & In bản v${v} (${filterName})`;
  }

  getCurrentPdfUrl(): string | null {
    const activeFilter = this.activeFilter();
    let url: string | null = null;
    if (activeFilter === 'ALL') {
      url = this.draft()?.pdfViewUrl || this.draft()?.pdfUrl || null;
    } else {
      const reports = this.draft()?.reports || {};
      const reportKey = activeFilter === '' ? '_NO_PREFIX_' : activeFilter;
      const reportForFilter = reports[reportKey] || {};
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
    if (activeFilter === 'ALL') {
      url = this.draft()?.docsUrl || null;
    } else {
      const reports = this.draft()?.reports || {};
      const reportKey = activeFilter === '' ? '_NO_PREFIX_' : activeFilter;
      const reportForFilter = reports[reportKey] || {};
      url = reportForFilter.docsUrl || null;
    }
    return getSafeGoogleUrl(url, 'doc');
  }

  hasAnyActiveReports(): boolean {
    const d = this.draft();
    if (!d) return false;
    if (d.pdfUrl || d.pdfViewUrl) return true;
    const reports = d.reports || {};
    return Object.values(reports).some((r: any) => r && (r.pdfUrl || r.pdfViewUrl));
  }

  getPrefixReport(prefix: string): any | null {
    const reports = this.draft()?.reports || {};
    const reportKey = prefix === '' ? '_NO_PREFIX_' : prefix;
    const report = reports[reportKey];
    if (report && (report.pdfUrl || report.pdfViewUrl)) {
      return report;
    }
    return null;
  }

  getSafeGoogleUrl = getSafeGoogleUrl;

  openUrl(url: string | null) {
    if (url) window.open(url, '_blank');
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

  openPdfPreview(url: string | null | undefined) {
    if (!url) return;
    const activeFilter = this.activeFilter();
    const filterName = activeFilter === 'ALL' ? 'Tất cả mẫu' : (activeFilter === '' ? 'Không tiền tố' : `Nhóm ${activeFilter}`);
    const previewUrl = getGoogleDrivePreviewUrl(url);

    this.printService.openPdfPreview(
      previewUrl,
      `Báo cáo kết quả — ${this.run()?.sopName || ''} (${filterName})`,
      this.draft()?.version || 1,
      this.draft()?.updatedBy || 'Chưa rõ',
      this.draft()?.updatedAt,
      async () => {
        await this.triggerPublishReport();
      }
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

