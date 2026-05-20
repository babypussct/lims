import { Component, inject, signal, OnInit, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import { ResultService } from './services/result.service';
import { AnalysisResultDraft } from '../../core/models/analysis-result.model';
import { ResultEntryType2Component } from './result-entry-type2.component';
import { ResultEntryType3bComponent } from './result-entry-type3b.component';
import { ToastService } from '../../core/services/toast.service';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

// Copy đồng bộ cấu hình SOP_CONFIG từ GAS để xử lý ở Angular Client

// ── Bảng ánh xạ sopId (Firestore document ID) → config key ──────────────────
// Anh chỉ cần điền đúng ID thực tế tương ứng với từng SOP trong Firestore tại đây
export const SOP_ID_MAP: Record<string, string> = {
  // Ví dụ — bỏ dấu comment và điền đúng ID thực tế:
  // 'SOP-01': 'trifluralin-gcms',
  // 'SOP-02': 'fipronil-chlorpyrifos',
  // 'SOP-03': 'dichlorvos-gcms',
  // 'SOP-04': 'chlor-huu-co',
  // 'SOP-05': 'lan-huu-co',
};

// ── Bảng fuzzy match: từ khóa trong sopName → config key ────────────────────
export const SOP_NAME_MAP: { keywords: string[]; configKey: string }[] = [
  { keywords: ['trifluralin'],                              configKey: 'trifluralin-gcms' },
  { keywords: ['fipronil', 'chlorpyrifos'],                 configKey: 'fipronil-chlorpyrifos' },
  { keywords: ['dichlorvos'],                               configKey: 'dichlorvos-gcms' },
  { keywords: ['chlor hữu cơ', 'clo hữu cơ', 'chlor hc'], configKey: 'chlor-huu-co' },
  { keywords: ['lân hữu cơ', 'lan hữu cơ', 'lan hc'],     configKey: 'lan-huu-co' },
];

/**
 * Tra cứu config key theo 4 ưu tiên:
 * 1. Khớp trực tiếp sopId với ANGULAR_SOP_CONFIG (nếu SOP được đặt tên theo slug)
 * 2. Khớp qua bảng SOP_ID_MAP (alias Firestore document ID → config key)
 * 3. Fuzzy match theo từ khóa trong sopName / sop.category / targets
 * 4. Dùng SOP object thực tế (tên, category, targets) từ StateService — chính xác nhất
 */
export function resolveConfigKey(
  sopId: string,
  sopName: string,
  sopObj?: { name?: string; category?: string; targets?: { name: string }[] } | null
): string | null {
  // 1. Khớp trực tiếp sopId với ANGULAR_SOP_CONFIG
  if (ANGULAR_SOP_CONFIG[sopId]) return sopId;

  // 2. Khớp qua bảng alias
  if (SOP_ID_MAP[sopId]) return SOP_ID_MAP[sopId];

  // Xây dựng chuỗi tìm kiếm kết hợp từ tất cả nguồn thông tin
  const searchTexts = [
    sopName,
    sopObj?.name,
    sopObj?.category,
    ...(sopObj?.targets || []).map(t => t.name)
  ].filter(Boolean).map(s => s!.toLowerCase());

  const combinedText = searchTexts.join(' ');

  // 3+4. Fuzzy match theo từ khóa trong tất cả nguồn
  for (const entry of SOP_NAME_MAP) {
    if (entry.keywords.some(kw => combinedText.includes(kw.toLowerCase()))) {
      return entry.configKey;
    }
  }

  return null;
}

export const ANGULAR_SOP_CONFIG: Record<string, {
  formType: 'type2' | 'type3a' | 'type3b';
  columns: Record<string, number>;
  checkboxLines: Record<string, string>;
  signaturePlaceholders: Record<string, string>;
  maSoMauChunkSize?: number;
  compounds?: string[]; // Dành riêng cho Dạng 3B
}> = {
  'trifluralin-gcms': {
    formType: 'type2',
    columns: { loSo: 0, maSoMau: 1, kqTrifluralin: 2, ghiChu: 3 },
    maSoMauChunkSize: 7,
    checkboxLines: {
      'Các mẫu thử không phát hiện Trifluralin': 'checkTatCaND',
      'Có mẫu thử phát hiện Trifluralin': 'checkCoMauPhatHien'
    },
    signaturePlaceholders: { 'date1': 'ngayNguoiPhanTich', 'date2': 'ngayNguoiThamTra' }
  },
  'fipronil-chlorpyrifos': {
    formType: 'type2',
    columns: {
      loSo: 0, maSoMau: 1, kqFip: 2, kqFipDesl: 3, kqFipSulf: 4,
      kqFipSulf2: 5, kqClp: 6, kqClpMe: 7, kqClpMeDes: 8, ghiChu: 9
    },
    checkboxLines: {
      'Các mẫu thử không phát hiện nhóm Fipronil và Chlorpyrifos': 'checkTatCaND',
      'Có mẫu thử phát hiện nhóm Fipronil và Chlorpyrifos': 'checkCoMauPhatHien',
      'Mẫu kiểm tra nội bộ': 'qcKiemTraNoiBo',
      'R2 >= 0.99': 'qcR2',
      'Độ lệch thời gian lưu': 'qcThoiGianLuu',
      'Nhận dạng mẫu nhiễm': 'qcNhanDang',
      'Nhận dạng mẫu thêm chuẩn': 'qcThemChuan',
      'Độ thu hồi IS': 'qcThuHoi',
      'Đánh giá chung': 'qcDanhGiaChung'
    },
    signaturePlaceholders: { 'date1': 'ngayNguoiPhanTich', 'date2': 'ngayNguoiThamTra' }
  },
  'dichlorvos-gcms': {
    formType: 'type3a',
    columns: { maSoMau: 0, khoiLuong: 1, heSoPhaLoang: 2, soVial: 3, kqDichlorvos: 4 },
    checkboxLines: {
      'Các mẫu thử không phát hiện Dichlorvos': 'checkTatCaND',
      'Có mẫu thử phát hiện Dichlorvos': 'checkCoMauPhatHien'
    },
    signaturePlaceholders: { 'date1': 'ngayNguoiPhanTich', 'date2': 'ngayNguoiThamTra' }
  },
  'chlor-huu-co': {
    formType: 'type3b',
    columns: {},
    checkboxLines: {
      'Các mẫu thử không phát hiện': 'checkTatCaND',
      'Có mẫu thử phát hiện': 'checkCoMauPhatHien'
    },
    signaturePlaceholders: { 'date1': 'ngayNguoiPhanTich', 'date2': 'ngayNguoiThamTra' },
    compounds: [
      'Aldrin', 'BHC-alpha', 'BHC-beta', 'BHC-delta', 'BHC-gamma',
      'Chlordane-cis', 'Chlordane-trans', 'DDD-o,p', 'DDD-p,p',
      'DDE-o,p', 'DDE-p,p', 'DDT-o,p', 'DDT-p,p', 'Dieldrin',
      'Endosulfan-I', 'Endosulfan-II', 'Endosulfan-sulfate', 'Endrin',
      'Endrin-aldehyde', 'Endrin-ketone', 'Heptachlor', 'Heptachlor-epoxide-cis',
      'Heptachlor-epoxide-trans', 'Hexachlorobenzene', 'Isodrin',
      'Methoxychlor', 'Mirex', 'Pendimethalin'
    ]
  },
  'lan-huu-co': {
    formType: 'type3b',
    columns: {},
    checkboxLines: {
      'Các mẫu thử không phát hiện': 'checkTatCaND',
      'Có mẫu thử phát hiện': 'checkCoMauPhatHien'
    },
    signaturePlaceholders: { 'date1': 'ngayNguoiPhanTich', 'date2': 'ngayNguoiThamTra' },
    compounds: [
      'Acephate', 'Anilofos', 'Cadusafos', 'Chlorfenvinphos', 'Chlorfenvinphos-methyl',
      'Chlorpyrifos', 'Chlorpyrifos-methyl', 'Demeton-S-methyl', 'Diazinon',
      'Dichlorvos', 'Dimethoate', 'Disulfoton', 'Edifenphos', 'Ethion',
      'Ethoprophos', 'Etrimfos', 'Fenamiphos', 'Fenitrothion', 'Fenthion',
      'Fenthion-sulfone', 'Fenthion-sulfoxide', 'Fonofos', 'Ipobenfos',
      'Isazofos', 'Malathion', 'Methacrifos', 'Methamidophos', 'Methidathion',
      'Monocrotophos', 'Omethoate', 'Parathion-ethyl', 'Parathion-methyl',
      'Phenthoate', 'Phorate', 'Phosalone', 'Phosphamidon', 'Prothiofos',
      'Quinalphos', 'Sulfotep', 'Terbufos', 'Tetrachlorvinphos', 'Triazophos',
      'Isofenphos-methyl'
    ]
  }
};

@Component({
  selector: 'app-result-entry',
  standalone: true,
  imports: [CommonModule, ResultEntryType2Component, ResultEntryType3bComponent, SkeletonComponent],
  template: `
    <div class="h-full flex flex-col fade-in">
      <!-- Dynamic Sticky Header -->
      <div class="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between shrink-0 z-40">
        <div class="flex items-center gap-3">
          <button (click)="goBack()" 
                  class="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center transition">
            <i class="fa-solid fa-arrow-left text-sm"></i>
          </button>
          <div>
            <span class="text-[10px] font-black uppercase text-fuchsia-600 dark:text-fuchsia-500 tracking-wider">
              {{ run() ? run()?.sopName : 'Đang tải...' }}
            </span>
            <h3 class="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              Nhập Dữ Liệu Phân Tích — Mẻ Chạy
            </h3>
          </div>
        </div>

        <!-- Toolbar Buttons -->
        @if (run() && draft()) {
          <div class="flex items-center gap-2">
            <!-- Revert/Restore Last Published (Fallback mechanism) -->
            @if (draft()?.publishedBackup) {
              <button (click)="restoreBackup()" 
                      [disabled]="isProcessing()"
                      class="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition flex items-center gap-2 disabled:opacity-50"
                      title="Khôi phục dữ liệu từ bản in PDF trước đó">
                <i class="fa-solid fa-arrow-rotate-left"></i>
                <span class="hidden md:inline">Khôi phục bản cũ</span>
              </button>
            }

            <!-- Save Draft Button -->
            <button (click)="triggerSaveDraft()" 
                    [disabled]="isProcessing()"
                    class="px-4 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 hover:bg-indigo-100 dark:hover:bg-indigo-950/30 rounded-xl transition flex items-center gap-2 disabled:opacity-50">
              <i class="fa-solid" [class.fa-floppy-disk]="!isSavingDraft()" [class.fa-spinner]="isSavingDraft()" [class.fa-spin]="isSavingDraft()"></i>
              <span>Lưu nháp</span>
            </button>

            <!-- Publish / Generate PDF -->
            <button (click)="triggerPublishReport()" 
                    [disabled]="isProcessing()"
                    class="px-4 py-2 text-xs font-black text-white bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-700 hover:to-indigo-700 rounded-xl shadow-sm transition flex items-center gap-2 disabled:opacity-50">
              <i class="fa-solid" [class.fa-circle-check]="!isPublishing()" [class.fa-spinner]="isPublishing()" [class.fa-spin]="isPublishing()"></i>
              <span>Tạo & In PDF</span>
            </button>
          </div>
        }
      </div>

      <!-- Main Form Area -->
      <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-6 bg-slate-50/50 dark:bg-slate-950/20">
        @if (isLoading()) {
          <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-6">
            <div class="flex justify-between items-center">
              <app-skeleton width="180px" height="24px"></app-skeleton>
              <app-skeleton width="120px" height="36px"></app-skeleton>
            </div>
            <div class="space-y-3">
              <app-skeleton width="100%" height="40px"></app-skeleton>
              <app-skeleton width="100%" height="40px"></app-skeleton>
              <app-skeleton width="100%" height="40px"></app-skeleton>
            </div>
          </div>
        } @else if (run() && draft() && config()) {
          <!-- Render Type 3B Component (Vertical Lists per sample) -->
          @if (config()?.formType === 'type3b') {
            <app-result-entry-type3b 
              [run]="run()!" 
              [draft]="draft()!" 
              [config]="config()!" 
              (draftChanged)="onDraftChanged($event)">
            </app-result-entry-type3b>
          } 
          <!-- Render Type 2 / 3A Component (Grid spreadsheet) -->
          @else {
            <app-result-entry-type2 
              [run]="run()!" 
              [draft]="draft()!" 
              [config]="config()!" 
              (draftChanged)="onDraftChanged($event)">
            </app-result-entry-type2>
          }
        } @else {
          <div class="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 border-dashed">
            <div class="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-500">
              <i class="fa-solid fa-triangle-exclamation text-3xl text-red-500"></i>
            </div>
            <p class="text-slate-500 dark:text-slate-400 font-medium text-sm">
              Không thể tìm thấy mẻ chạy hoặc cấu hình tương ứng của chỉ tiêu này!
            </p>
            <button (click)="goBack()" class="mt-4 px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-xl text-xs font-bold">
              Quay lại danh sách
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class ResultEntryComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private state = inject(StateService);
  private resultService = inject(ResultService);
  private toast = inject(ToastService);

  requestId = '';
  
  isLoading = signal(true);
  isSavingDraft = signal(false);
  isPublishing = signal(false);
  isProcessing = computed(() => this.isSavingDraft() || this.isPublishing());

  // Approved request (run)
  run = signal<any | null>(null);
  
  // Draft data matching AnalysisResultDraft model
  draft = signal<AnalysisResultDraft | null>(null);

  // SOP configuration matching ANGULAR_SOP_CONFIG keys
  config = signal<any | null>(null);

  // Resolved config key (vd: 'trifluralin-gcms') — dùng để gửi sang GAS
  configKey = signal<string | null>(null);

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.requestId) {
      this.toast.show('Không tìm thấy ID mẻ chạy!', 'error');
      this.router.navigate(['/results']);
      return;
    }
    this.loadData();
  }

  ngOnDestroy() {}

  async loadData() {
    this.isLoading.set(true);

    // 1. Fetch Approved request details
    const approvedList = this.state.approvedRequests();
    const runDoc = approvedList.find(r => r.id === this.requestId);
    
    if (!runDoc) {
      // Đợi thêm một chút phòng trường hợp data chưa load kịp
      setTimeout(async () => {
        const retryRunDoc = this.state.approvedRequests().find(r => r.id === this.requestId);
        if (!retryRunDoc) {
          this.isLoading.set(false);
          return;
        }
        this.run.set(retryRunDoc);
        await this.loadDraftAndConfig(retryRunDoc);
      }, 800);
      return;
    }

    this.run.set(runDoc);
    await this.loadDraftAndConfig(runDoc);
  }

  private async loadDraftAndConfig(runDoc: any) {
    // 2. Fetch SOP configurations — tra cứu thông minh: sopId → alias → SOP object thực tế từ Firestore
    //    Tra cứu SOP object từ StateService để dùng tên, category và danh sách targets thực tế
    const sopObj = this.state.sops().find(s => s.id === runDoc.sopId) || null;
    const resolvedKey = resolveConfigKey(runDoc.sopId, runDoc.sopName || '', sopObj);
    const sopConf = resolvedKey ? ANGULAR_SOP_CONFIG[resolvedKey] : null;
    if (!sopConf || !resolvedKey) {
      const displayName = sopObj?.name || runDoc.sopName || runDoc.sopId;
      this.toast.show(
        `Chưa có cấu hình nhập liệu cho chỉ tiêu "${displayName}". ` +
        `Vui lòng thêm từ khóa tương ứng vào SOP_NAME_MAP trong result-entry.component.ts.`,
        'info'
      );
      this.isLoading.set(false);
      return;
    }
    this.config.set(sopConf);
    // Lưu resolved config key để dùng khi gửi payload sang GAS
    this.configKey.set(resolvedKey);


    // 3. Fetch Draft document from Firestore
    let draftDoc = await this.resultService.getDraft(this.requestId);
    
    // Nếu chưa có nháp, tạo bản nháp mặc định ban đầu
    if (!draftDoc) {
      draftDoc = this.createDefaultDraft(runDoc, sopConf);
    }
    
    this.draft.set(draftDoc);
    this.isLoading.set(false);
  }

  private createDefaultDraft(runDoc: any, sopConf: any): AnalysisResultDraft {
    const defaultPage1: Record<string, any> = {
      ngayNguoiPhanTich: new Date().toISOString().split('T')[0],
      ngayNguoiThamTra: new Date().toISOString().split('T')[0],
      checkTatCaND: true,
      checkCoMauPhatHien: false
    };

    // Tự động gán các checkbox phụ từ cấu hình SOP_CONFIG bằng false
    if (sopConf.checkboxLines) {
      Object.values(sopConf.checkboxLines).forEach((field: any) => {
        if (field !== 'checkTatCaND' && field !== 'checkCoMauPhatHien') {
          defaultPage1[field] = false;
        }
      });
    }

    const defaultResultData: Record<string, any> = {};
    const sampleList = runDoc.sampleList || [];
    
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
   * Xuất bản kết quả -> Tạo tệp PDF
   */
  async triggerPublishReport() {
    const currentDraft = this.draft();
    const currentRun = this.run();
    const currentConf = this.config();
    if (!currentDraft || !currentRun || !currentConf) return;

    this.isPublishing.set(true);

    try {
      // Tạo payload định dạng chuẩn đồng bộ gửi sang GAS Web App
      const samplesPayload: any[] = [];
      const sampleList = currentRun.sampleList || [];

      sampleList.forEach((sampleCode: string, idx: number) => {
        const resObj = currentDraft.resultData[sampleCode] || {};
        
        if (currentConf.formType === 'type3b') {
          // Tạo payload Dạng 3B
          const activeCompounds: Record<string, { kq: string; nd: boolean; qc: string[] }> = {};
          
          currentConf.compounds.forEach((c: string) => {
            activeCompounds[c] = {
              kq: resObj[c] || 'KPH',
              nd: resObj[`${c}_nd`] === true,
              qc: [
                resObj[`${c}_qc1`] || 'Đạt',
                resObj[`${c}_qc2`] || 'Đạt',
                resObj[`${c}_qc3`] || 'Đạt'
              ]
            };
          });

          samplesPayload.push({
            maSoMau: sampleCode,
            activeCompounds
          });
        } else {
          // Tạo payload Dạng 2 hoặc 3A
          const rowData: Record<string, any> = {
            loSo: String(idx + 1),
            maSoMau: sampleCode,
            ghiChu: resObj['ghiChu'] || ''
          };

          // Ánh xạ dữ liệu các cột kết quả hoạt chất
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
        sopId: this.configKey(),    // ← Dùng resolved config key (vd: 'trifluralin-gcms'), KHÔNG dùng Firestore doc ID
        metadata: {
          ...currentDraft.page1Data,
          ngayBaoCao: currentDraft.page1Data?.ngayNguoiPhanTich || new Date().toISOString().split('T')[0]
        },
        samples: samplesPayload
      };

      // Kích hoạt tiến trình xuất bản & in PDF
      const success = await this.resultService.publishReport(this.requestId, currentDraft, reportPayload);
      if (success) {
        // Cập nhật trạng thái hiển thị
        this.draft.update(d => d ? { ...d, status: 'completed' } as any : null);
      }
    } finally {
      this.isPublishing.set(false);
    }
  }

  goBack() {
    this.router.navigate(['/results']);
  }
}
