import { Component, inject, signal, OnInit, OnDestroy, computed, ViewChild } from '@angular/core';
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

// Isolated SOP presentational components
import { Sop01EntryComponent } from './sops/sop-01/sop-01-entry.component';
import { Sop1767857760184EntryComponent } from './sops/sop-1767857760184/sop-1767857760184-entry.component';
import { Sop03EntryComponent } from './sops/sop-03/sop-03-entry.component';
import { SopDefaultType2EntryComponent } from './sops/sop-default-type2/sop-default-type2-entry.component';

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
    SopDefaultType2EntryComponent
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

  // Global Prefix Filtering
  activeFilter = signal<string>('ALL');
  
  detectedPrefixes = computed(() => {
    const r = this.run();
    if (!r) return [];
    const prefixes = new Set<string>();
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

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.requestId) {
      this.toast.show('Không tìm thấy ID mẻ chạy!', 'error');
      this.router.navigate(['/results']);
      return;
    }
    
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
          this.config.set(sopConf);
          this.configKey.set(resolvedKey);

          if (!draftDoc) {
            // Nếu chưa có nháp, tạo bản nháp mặc định ban đầu
            draftDoc = this.createDefaultDraft(runDoc, sopConf);
          } else {
            // Đảm bảo các trường dữ liệu cần thiết của Trifluralin luôn được khởi tạo
            const isTrifluralin = resolvedKey === 'trifluralin-gcms';
            if (isTrifluralin) {
              if (!draftDoc.page1Data) draftDoc.page1Data = {};
              if (!draftDoc.page1Data['calibPoints'] || draftDoc.page1Data['calibPoints'].length === 0) {
                draftDoc.page1Data['calibPoints'] = [
                  { loSo: '41', hamLuong: '0' },
                  { loSo: '42', hamLuong: '0.5' },
                  { loSo: '43', hamLuong: '1.0' },
                  { loSo: '44', hamLuong: '5.0' },
                  { loSo: '45', hamLuong: '10.0' },
                  { loSo: '46', hamLuong: '30.0' }
                ];
              }
              if (draftDoc.page1Data['r2'] === undefined || draftDoc.page1Data['r2'] === '') {
                draftDoc.page1Data['r2'] = '0.999';
              }
              if (draftDoc.page1Data['blankName'] === undefined) {
                draftDoc.page1Data['blankName'] = 'Blank';
              }
              if (draftDoc.page1Data['spikeName'] === undefined) {
                draftDoc.page1Data['spikeName'] = 'Spike';
              }

              if (!draftDoc.resultData) draftDoc.resultData = {};
              if (!draftDoc.resultData['QC_BLANK']) {
                draftDoc.resultData['QC_BLANK'] = { loSo: '47', kqTrifluralin: 'ND', ghiChu: '', selected: true };
              } else {
                if (!draftDoc.resultData['QC_BLANK']['loSo']) draftDoc.resultData['QC_BLANK']['loSo'] = '47';
                if (!draftDoc.resultData['QC_BLANK']['kqTrifluralin']) draftDoc.resultData['QC_BLANK']['kqTrifluralin'] = 'ND';
              }
              if (!draftDoc.resultData['QC_SPIKE']) {
                draftDoc.resultData['QC_SPIKE'] = { loSo: '48', kqTrifluralin: '', ghiChu: '', selected: true };
              } else {
                if (!draftDoc.resultData['QC_SPIKE']['loSo']) draftDoc.resultData['QC_SPIKE']['loSo'] = '48';
              }
            }
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
      defaultPage1['blankName'] = 'Blank';
      defaultPage1['spikeName'] = 'Spike';
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
      defaultPage1['blankName'] = 'Blank';
      defaultPage1['spikeName'] = 'Spike';
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
          // Cho dạng 3B (Chlor/Lân hữu cơ): Điền mặc định ND và QC đạt
          sopConf.compounds.forEach((c: string) => {
            defaultResultData[sampleCode][c] = 'KPH';
            defaultResultData[sampleCode][`${c}_nd`] = true;
            defaultResultData[sampleCode][`${c}_qc1`] = 'Đạt';
            defaultResultData[sampleCode][`${c}_qc2`] = 'Đạt';
            defaultResultData[sampleCode][`${c}_qc3`] = 'Đạt';
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
  }

  /**
   * Lưu nháp thủ công
   */
  async triggerSaveDraft() {
    if (!this.draft()) return;
    this.isSavingDraft.set(true);
    const success = await this.resultService.saveDraft(this.requestId, this.draft()!);
    if (success) {
      this.toast.show('Đã lưu bản nháp kết quả phân tích thành công!', 'success');
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

    this.isPublishing.set(true);

    try {
      const isTrifluralin = this.configKey() === 'trifluralin-gcms';

      if (isTrifluralin) {
        const activeFilter = this.activeFilter();
        const sampleList = currentRun.sampleList || [];
        const checkedSamples = sampleList.filter((s: string) => {
          const resObj = currentDraft.resultData[s] || {};
          const startsWithLetter = /^[a-zA-Z]/.test(s);
          const prefix = startsWithLetter ? s.charAt(0).toUpperCase() : '';
          const isSelected = resObj['selected'] !== false;
          const matchesFilter = activeFilter === 'ALL' || prefix === activeFilter;
          return isSelected && matchesFilter;
        });

        if (checkedSamples.length === 0) {
          this.toast.show('Vui lòng chọn ít nhất một mẫu để tạo báo cáo!', 'info');
          this.isPublishing.set(false);
          return;
        }

        const prefixForReport = activeFilter === 'ALL' ? '' : activeFilter;
        const prefixSamples = checkedSamples;

        const samplesPayload: any[] = [];

        // 1. Thêm Blank vào đầu danh sách
        const blankObj = currentDraft.resultData['QC_BLANK'] || {};
        samplesPayload.push({
          loSo: blankObj['loSo'] || '1',
          maSoMau: currentDraft.page1Data['blankName'] || 'Blank',
          kqTrifluralin: blankObj['kqTrifluralin'] || '',
          ghiChu: blankObj['ghiChu'] || ''
        });

        // 2. Thêm Spike vào vị trí thứ 2
        const spikeObj = currentDraft.resultData['QC_SPIKE'] || {};
        samplesPayload.push({
          loSo: spikeObj['loSo'] || '2',
          maSoMau: currentDraft.page1Data['spikeName'] || 'Spike',
          kqTrifluralin: spikeObj['kqTrifluralin'] || '',
          ghiChu: spikeObj['ghiChu'] || ''
        });

        // 3. Thêm các mẫu và các mẫu SPIKE_N xen kẽ
        let selectedCount = 0;
        prefixSamples.forEach((sampleCode: string) => {
          const resObj = currentDraft.resultData[sampleCode] || {};
          samplesPayload.push({
            loSo: resObj['loSo'] || '',
            maSoMau: sampleCode,
            kqTrifluralin: resObj['kqTrifluralin'] || '',
            ghiChu: resObj['ghiChu'] || ''
          });

          selectedCount++;
          if (selectedCount % 10 === 0) {
            const isLastSelected = selectedCount === prefixSamples.length;
            if (!isLastSelected) {
              const n = selectedCount / 10;
              const spikeNKey = `QC_SPIKE_${n}_QC_${prefixForReport}`;
              const spikeNObj = currentDraft.resultData[spikeNKey] || {};
              samplesPayload.push({
                loSo: spikeNObj['loSo'] || spikeObj['loSo'] || '2',
                maSoMau: `SPIKE_${n}`,
                kqTrifluralin: spikeNObj['kqTrifluralin'] || '',
                ghiChu: spikeNObj['ghiChu'] || ''
              });
            }
          }
        });

        // 4. FINAL row
        if (selectedCount > 0) {
          const finalKey = `QC_FINAL_QC_${prefixForReport}`;
          const finalObj = currentDraft.resultData[finalKey] || {};
          samplesPayload.push({
            loSo: finalObj['loSo'] || spikeObj['loSo'] || '2',
            maSoMau: 'FINAL',
            kqTrifluralin: finalObj['kqTrifluralin'] || '',
            ghiChu: finalObj['ghiChu'] || ''
          });
        }

        const reportPayload: any = {
          action: 'generate_pdf',
          sopId: this.configKey(),
          metadata: {
            ...currentDraft.page1Data,
            prefix: prefixForReport,
            ngayNguoiPhanTich: this.formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || this.getRunDate()),
            ngayNguoiThamTra: this.formatAnalysisDate(currentDraft.page1Data['ngayNguoiThamTra'] || new Date().toISOString().split('T')[0]),
            ngayBaoCao: this.formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || this.getRunDate())
          },
          samples: samplesPayload
        };

        const result = await this.resultService.publishReport(this.requestId, currentDraft, reportPayload, prefixForReport);
        let success = false;
        if (result.success) {
          success = true;
          const url = result.pdfViewUrl || result.pdfUrl;
          if (url) {
            this.openPdfPreview(url);
          }
        }

        if (success) {
          const latestDraft = await this.resultService.getDraft(this.requestId);
          if (latestDraft) {
            this.draft.set(latestDraft);
          }
          const hist = await this.resultService.getHistory(this.requestId);
          this.historyList.set(hist);
        }
      } else if (this.configKey() === 'fipronil-chlorpyrifos') {
        const activeFilter = this.activeFilter();
        const prefixForReport = activeFilter === 'ALL' ? '' : activeFilter;
        
        // Luồng tạo báo cáo chuyên biệt cho Fipronil (SOP-01) có kèm theo mẫu QC (BLANK, SPIKE, CHECK_SAMPLE, FINAL)
        const samplesPayload: any[] = [];
        
        const ensureKeyAndGet = (key: string, defaultVial: string, label: string) => {
          const resObj = currentDraft.resultData[key] || {};
          const rowData: Record<string, any> = {
            loSo: resObj['loSo'] || defaultVial,
            maSoMau: label,
            ghiChu: resObj['ghiChu'] || ''
          };
          Object.keys(currentConf.columns).forEach(col => {
            if (col !== 'loSo' && col !== 'maSoMau' && col !== 'ghiChu') {
              rowData[col] = resObj[col] !== undefined ? resObj[col] : '';
            }
          });
          return rowData;
        };

        // 1. BLANK (vial 1.7)
        const blankName = currentDraft.page1Data['blankName'] || 'BLANK';
        samplesPayload.push(ensureKeyAndGet('QC_BLANK', '1.7', blankName));

        // 2. SPIKE (vial 1.8)
        const spikeName = currentDraft.page1Data['spikeName'] || 'SPIKE';
        samplesPayload.push(ensureKeyAndGet('QC_SPIKE', '1.8', spikeName));

        // 3. CHECK_SAMPLE (vial 1.9, optional)
        if (currentDraft.page1Data['hasCheckSample']) {
          const checkSampleName = currentDraft.page1Data['checkSampleName'] || 'CHECK_SAMPLE';
          samplesPayload.push(ensureKeyAndGet('QC_CHECK_SAMPLE', '1.9', checkSampleName));
        }

        // 4. Regular samples & dynamic SP_N every 10 samples
        const sampleList = this.filteredRun()?.sampleList || [];
        let regularCount = 0;
        sampleList.forEach((sampleCode: string) => {
          const resObj = currentDraft.resultData[sampleCode] || {};
          const rowData: Record<string, any> = {
            loSo: resObj['loSo'] || '',
            maSoMau: sampleCode,
            ghiChu: resObj['ghiChu'] || ''
          };
          Object.keys(currentConf.columns).forEach(col => {
            if (col !== 'loSo' && col !== 'maSoMau' && col !== 'ghiChu') {
              rowData[col] = resObj[col] !== undefined ? resObj[col] : '';
            }
          });
          samplesPayload.push(rowData);

          regularCount++;
          if (regularCount % 10 === 0) {
            const isLastSample = regularCount === sampleList.length;
            if (!isLastSample) {
              const n = regularCount / 10;
              const spikeNKey = `QC_SPIKE_${n}`;
              const spikeNObj = currentDraft.resultData[spikeNKey] || {};
              const spikeVial = currentDraft.resultData['QC_SPIKE']?.['loSo'] || '1.8';
              
              const spRowData: Record<string, any> = {
                loSo: spikeNObj['loSo'] || spikeVial,
                maSoMau: `SP_${n}`,
                ghiChu: spikeNObj['ghiChu'] || ''
              };
              Object.keys(currentConf.columns).forEach(col => {
                if (col !== 'loSo' && col !== 'maSoMau' && col !== 'ghiChu') {
                  spRowData[col] = spikeNObj[col] !== undefined ? spikeNObj[col] : '';
                }
              });
              samplesPayload.push(spRowData);
            }
          }
        });

        // 5. FINAL (vial 1.8)
        samplesPayload.push(ensureKeyAndGet('QC_FINAL', '1.8', 'FINAL'));

        const reportPayload: any = {
          action: 'generate_pdf',
          sopId: this.configKey(),
          metadata: {
            ...currentDraft.page1Data,
            ngayNguoiPhanTich: this.formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || this.getRunDate()),
            ngayNguoiThamTra: this.formatAnalysisDate(currentDraft.page1Data['ngayNguoiThamTra'] || new Date().toISOString().split('T')[0]),
            ngayBaoCao: this.formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || this.getRunDate())
          },
          samples: samplesPayload
        };

        const result = await this.resultService.publishReport(this.requestId, currentDraft, reportPayload);
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
      } else if (this.configKey() === 'dichlorvos-gcms') {
        const activeFilter = this.activeFilter();
        const prefixForReport = activeFilter === 'ALL' ? '' : activeFilter;
        
        const samplesPayload: any[] = [];
        
        const getQcRow = (key: string, label: string) => {
          const resObj = currentDraft.resultData[key] || {};
          const rowData: Record<string, any> = {
            loSo: resObj['loSo'] || '',
            maSoMau: label,
            ghiChu: resObj['ghiChu'] || ''
          };
          Object.keys(currentConf.columns).forEach((col: string) => {
            if (col !== 'loSo' && col !== 'maSoMau' && col !== 'ghiChu') {
              if (col === 'kqDichlorvos') {
                let mergedVal = resObj['kqDichlorvos'] || '';
                let note = (resObj['ghiChu'] || '').trim();
                if (note) {
                  if (!note.startsWith('(') || !note.endsWith(')')) {
                    note = `(${note})`;
                  }
                  mergedVal = mergedVal ? `${mergedVal} ${note}` : note;
                }
                rowData[col] = mergedVal;
              } else {
                rowData[col] = resObj[col] !== undefined ? resObj[col] : '';
              }
            }
          });
          return rowData;
        };

        // 1. Blank
        const blankName = currentDraft.page1Data['blankName'] || 'Blank';
        samplesPayload.push(getQcRow('QC_BLANK', blankName));

        // 2. Spike
        const spikeName = currentDraft.page1Data['spikeName'] || 'Spike';
        samplesPayload.push(getQcRow('QC_SPIKE', spikeName));

        // 3. Regular samples
        const sampleList = this.filteredRun()?.sampleList || [];
        sampleList.forEach((sampleCode: string) => {
          const resObj = currentDraft.resultData[sampleCode] || {};
          const rowData: Record<string, any> = {
            loSo: resObj['loSo'] || '',
            maSoMau: sampleCode,
            ghiChu: resObj['ghiChu'] || ''
          };
          Object.keys(currentConf.columns).forEach((col: string) => {
            if (col !== 'loSo' && col !== 'maSoMau' && col !== 'ghiChu') {
              if (col === 'kqDichlorvos') {
                let mergedVal = resObj['kqDichlorvos'] || '';
                let note = (resObj['ghiChu'] || '').trim();
                if (note) {
                  if (!note.startsWith('(') || !note.endsWith(')')) {
                    note = `(${note})`;
                  }
                  mergedVal = mergedVal ? `${mergedVal} ${note}` : note;
                }
                rowData[col] = mergedVal;
              } else {
                rowData[col] = resObj[col] !== undefined ? resObj[col] : '';
              }
            }
          });
          samplesPayload.push(rowData);
        });

        // 4. FINAL (optional)
        if (currentDraft.page1Data['hasFinal']) {
          samplesPayload.push(getQcRow('QC_FINAL', 'FINAL'));
        }

        const reportPayload: any = {
          action: 'generate_pdf',
          sopId: this.configKey(),
          metadata: {
            ...currentDraft.page1Data,
            prefix: prefixForReport,
            ngayNguoiPhanTich: this.formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || this.getRunDate()),
            ngayNguoiThamTra: this.formatAnalysisDate(currentDraft.page1Data['ngayNguoiThamTra'] || new Date().toISOString().split('T')[0]),
            ngayBaoCao: this.formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || this.getRunDate())
          },
          samples: samplesPayload
        };

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
      } else {
        const activeFilter = this.activeFilter();
        const prefixForReport = activeFilter === 'ALL' ? '' : activeFilter;
        
        // Luồng tạo báo cáo tiêu chuẩn cho các SOP khác
        const samplesPayload: any[] = [];
        const sampleList = this.filteredRun()?.sampleList || [];

        sampleList.forEach((sampleCode: string, idx: number) => {
          const resObj = currentDraft.resultData[sampleCode] || {};
          
          if (currentConf.formType === 'type3b') {
            const rowData: Record<string, any> = {
              maSoMau: sampleCode
            };
            
            const chlorMap: Record<string, string> = {
              'BHC-alpha': 'BHCa',
              'BHC-beta': 'BHCb',
              'BHC-delta': 'BHCd',
              'BHC-epsilon': 'BHCe',
              'BHC-gamma': 'BHCg',
              'Chlordane-cis': 'Chlordane_cis',
              'Chlordane-oxy': 'Chlordane_oxy',
              'Chlordane-trans': 'Chlordane_trans',
              'DDD-o,p': 'DDD_op',
              'DDD-p,p': 'DDD_pp',
              'DDE-o,p': 'DDE_op',
              'DDE-p,p': 'DDE_pp',
              'DDT-o,p': 'DDT_op',
              'DDT-p,p': 'DDT_pp',
              'Endosulfan-I': 'Endosulfan1',
              'Endosulfan-II': 'Endosulfan2',
              'Endosulfan-sulfate': 'EndosulfanS',
              'Heptachlor-epoxide-trans': 'HeptachlorA',
              'Heptachlor-epoxide-cis': 'HeptachlorB',
              'Hexachlorobenzene': 'HCB'
            };
            
            const mapCompoundToKey = (c: string): string => {
              if (chlorMap[c]) return chlorMap[c];
              if (c === 'Parathion-ethyl') return 'Parathion';
              if (c === 'Ipobenfos') return 'Iprobenfos';
              return c.replace(/-([a-z])/gi, (_, letter) => letter.toUpperCase()).replace(/[-_,\s']/g, '');
            };

            currentConf.compounds.forEach((c: string) => {
              const backendKey = mapCompoundToKey(c);
              rowData[backendKey] = resObj[c] || 'KPH';
              rowData[`${backendKey}_nd`] = resObj[`${c}_nd`] === true;
              rowData[`${backendKey}_qc1`] = resObj[`${c}_qc1`] || 'Đạt';
              rowData[`${backendKey}_qc2`] = resObj[`${c}_qc2`] || 'Đạt';
              rowData[`${backendKey}_qc3`] = resObj[`${c}_qc3`] || 'Đạt';
            });
            
            samplesPayload.push(rowData);
          } else {
            const rowData: Record<string, any> = {
              loSo: String(idx + 1),
              maSoMau: sampleCode,
              ghiChu: resObj['ghiChu'] || ''
            };
            Object.keys(currentConf.columns).forEach(col => {
              if (col !== 'loSo' && col !== 'maSoMau' && col !== 'ghiChu') {
                rowData[col] = resObj[col] !== undefined ? resObj[col] : '';
              }
            });
            samplesPayload.push(rowData);
          }
        });

        const reportPayload: any = {
          action: 'generate_pdf',
          sopId: this.configKey(),
          metadata: {
            ...currentDraft.page1Data,
            prefix: prefixForReport,
            ngayNguoiPhanTich: this.formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || this.getRunDate()),
            ngayNguoiThamTra: this.formatAnalysisDate(currentDraft.page1Data['ngayNguoiThamTra'] || new Date().toISOString().split('T')[0]),
            ngayBaoCao: this.formatAnalysisDate(currentDraft.page1Data['ngayNguoiPhanTich'] || this.getRunDate())
          },
          samples: samplesPayload
        };

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

