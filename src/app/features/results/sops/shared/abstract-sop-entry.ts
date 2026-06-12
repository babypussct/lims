/**
 * AbstractSopEntry — Base class cho tất cả SOP Entry Components dạng type-3b
 * (Lân hữu cơ, Chlor hữu cơ, Nhóm Cúc, Nhóm I, v.v.)
 *
 * Tập trung toàn bộ logic chung vào một chỗ, thay thế ~400 dòng code trùng lặp
 * trong mỗi SOP component. Mỗi SOP component chỉ cần extend class này và
 * override `onSopSpecificInit()` nếu có logic đặc thù.
 */
import {
  Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges,
  signal, computed, inject, Directive
} from '@angular/core';
import { AnalysisResultDraft } from '../../../../core/models/analysis-result.model';
import { MasterTargetService } from '../../../targets/master-target.service';
import { resolveCompoundDisplayName, COMPOUND_TO_FIRESTORE_ID } from '../../shared/compound-id-resolver';

/**
 * Bản đồ ngược: canonical id → các display string cũ có thể xuất hiện trong draft data.
 * Dùng để migrate key cũ (display string) sang canonical id khi đọc draft lưu trước migration.
 */
const LEGACY_DISPLAY_TO_CANONICAL: Record<string, string> = {};
for (const [display, canonical] of Object.entries(COMPOUND_TO_FIRESTORE_ID)) {
  // Lưu lowercase display → canonical để so khớp case-insensitive
  LEGACY_DISPLAY_TO_CANONICAL[display.toLowerCase()] = canonical;
}

/** Kiểu dữ liệu một hàng trong bảng sắc ký */
export interface ChromatographyRow {
  key: string;
  label: string;
  type: 'QC' | 'REGULAR';
}

/** Cấu hình điểm chuẩn */
export interface CalibPoint {
  loSo: string;
  hamLuong: string;
}

/** Tuỳ chọn khởi tạo calibration points */
export interface CalibConfig {
  count: 5 | 6;
  defaultPoints?: CalibPoint[];
}

// @Directive() decorator bắt buộc để Angular nhận biết class này là một Angular class
// (dù nó không phải Component), cho phép inject dependencies trong constructor
@Directive()
export abstract class AbstractSopEntry implements OnInit, OnChanges {
  // ── Angular Inputs / Outputs ──────────────────────────────────────────────
  @Input() run!: any;
  @Input() draft!: AnalysisResultDraft;
  @Input() config!: any;
  @Output() draftChanged = new EventEmitter<AnalysisResultDraft>();

  // ── Dependencies ──────────────────────────────────────────────────────────
  protected masterTargetService = inject(MasterTargetService);

  // ── Reactive State ────────────────────────────────────────────────────────
  masterTargets = signal<any[]>([]);
  compoundDisplayNames = signal<Record<string, string>>({});
  activeSampleCode = signal<string>('');
  checkboxList: { key: string; label: string }[] = [];

  // ── Computed ──────────────────────────────────────────────────────────────
  /** Danh sách hoạt chất được giao cho ít nhất 1 mẫu (dùng cho Form Đơn) */
  assignedCompoundsForFormDon = computed(() => {
    const compounds: string[] = this.config?.compounds || [];
    const sampleList: string[] = this.run?.sampleList || [];
    if (!sampleList.length) return compounds;
    const targetMap = this.run?.sampleTargetMap ?? this.run?.inputs?.sampleTargetMap;
    if (!targetMap) return compounds;
    return compounds.filter((c: string) =>
      sampleList.some((s: string) => this.isTargetAssigned(s, c))
    );
  });

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnChanges(changes: SimpleChanges) {
    if (changes['run'] && !changes['run'].firstChange) {
      const newRun = changes['run'].currentValue;
      if (newRun?.sampleList?.length > 0) {
        const currentActive = this.activeSampleCode();
        if (!newRun.sampleList.includes(currentActive)) {
          this.activeSampleCode.set(newRun.sampleList[0]);
        }
      }
    }
  }

  async ngOnInit() {
    // 1. Set active sample
    if (this.run?.sampleList?.length > 0) {
      this.activeSampleCode.set(this.run.sampleList[0]);
    }

    // 2. Build checkbox list from config
    if (this.config?.checkboxLines) {
      this.checkboxList = Object.entries(this.config.checkboxLines)
        .map(([label, key]) => ({ key: key as string, label }));
    }

    // 3. Ensure draft data structures exist
    if (!this.draft.page1Data) this.draft.page1Data = {};
    if (!this.draft.resultData) this.draft.resultData = {};

    // 4. [DATA_VERSION 2] Migrate result key từ display string cũ → canonical id mới
    //    Chỉ chạy khi phát hiện draft cũ (trước khi config.compounds[] đổi sang canonical id).
    this.migrateResultDataKeys();

    // 5. Shared default initializations (page1Data)
    this.initSharedPage1Defaults();

    // 6. Khởi tạo dữ liệu cho từng mẫu
    this.initSampleResultDefaults();

    // 7. Cập nhật trạng thái Gộp In Chung
    this.updateGopInChungState();

    // 8. Khởi tạo giá trị mặc định cho checkboxes chất lượng
    this.initCheckboxDefaults();

    // 9. Hook cho SOP đặc thù (override trong subclass nếu cần)
    this.onSopSpecificInit?.();

    // 10. Load master analytes từ Firestore (async — thực hiện sau các init đồng bộ)
    await this.loadMasterAnalytes();

    // 11. Sau khi có master analytes, làm sạch và điền N/A
    this.cleanUpPooledSampleResults();
    this.prefillUnassignedTargets();
  }

  // ── Hook cho SOP đặc thù ─────────────────────────────────────────────────
  /**
   * Override trong subclass để thực hiện các khởi tạo đặc thù của SOP:
   * - Số điểm calibration khác (5 vs 6)
   * - Giá trị mặc định đặc thù
   * - Migration data cũ
   */
  protected onSopSpecificInit?(): void;

  // ── Shared Initializations ────────────────────────────────────────────────

  protected initSharedPage1Defaults() {
    const p = this.draft.page1Data;

    if (p['printFormType'] === undefined)
      p['printFormType'] = 'formCheck';

    if (!p['khoiLuong'])
      p['khoiLuong'] = '10.0';

    if (p['r2'] === undefined)
      p['r2'] = '';

    if (p['blankName'] === undefined)
      p['blankName'] = '';

    if (p['spikeName'] === undefined)
      p['spikeName'] = '';

    if (p['hasFinal'] === undefined)
      p['hasFinal'] = false;

    if (!p['loaiMau'])
      p['loaiMau'] = 'Thủy sản';

    if (!p['tinhTrangMau'])
      p['tinhTrangMau'] = 'Bình thường';
  }

  protected initSampleResultDefaults() {
    (this.run?.sampleList || []).forEach((sampleCode: string, idx: number) => {
      if (!this.draft.resultData[sampleCode]) {
        this.draft.resultData[sampleCode] = {};
      }
      const sRes = this.draft.resultData[sampleCode];

      if (sRes['selected'] === undefined) sRes['selected'] = true;
      if (!sRes['khoiLuong']) sRes['khoiLuong'] = '10.0';
      if (!sRes['heSoPhaLoang']) sRes['heSoPhaLoang'] = '1';
      if (!sRes['hSoPhaLoang']) sRes['hSoPhaLoang'] = '1';
      if (!sRes['loSo']) sRes['loSo'] = (9 + idx).toString();
      if (sRes['checkBoSungNuoc'] === undefined) sRes['checkBoSungNuoc'] = 'không';
      if (sRes['checkHonHopLamSach'] === undefined) sRes['checkHonHopLamSach'] = 'B1';
    });
  }

  protected initCheckboxDefaults() {
    const p = this.draft.page1Data;
    const SKIP_KEYS = new Set(['checkTatCaND', 'checkCoMauPhatHien', 'qcNhanDang', 'checkGopInChung']);

    this.checkboxList.forEach(cb => {
      if (!SKIP_KEYS.has(cb.key)) {
        if (p[cb.key] === undefined || p[cb.key] === null) {
          p[cb.key] = true;
        }
      }
    });
  }

  /**
   * Khởi tạo điểm chuẩn đường hiệu chuẩn
   * @param count số điểm (5 hoặc 6)
   * @param defaults danh sách điểm mặc định (nếu không cung cấp, tự động tạo)
   */
  protected initCalibrationPoints(count: 5 | 6, defaults?: CalibPoint[]) {
    const defaultCalib5: CalibPoint[] = [
      { loSo: '1', hamLuong: '0' },
      { loSo: '2', hamLuong: '5' },
      { loSo: '3', hamLuong: '10' },
      { loSo: '4', hamLuong: '20' },
      { loSo: '5', hamLuong: '50' }
    ];
    const defaultCalib6: CalibPoint[] = [
      ...defaultCalib5,
      { loSo: '6', hamLuong: '100' }
    ];

    const defaultCalib = defaults ?? (count === 6 ? defaultCalib6 : defaultCalib5);
    const calibPoints = this.draft.page1Data['calibPoints'];

    if (!calibPoints || calibPoints.length !== count) {
      this.draft.page1Data['calibPoints'] = defaultCalib;
    } else {
      calibPoints.forEach((pt: any, idx: number) => {
        if (!pt.hamLuong) pt.hamLuong = defaultCalib[idx].hamLuong;
        if (!pt.loSo) pt.loSo = defaultCalib[idx].loSo;
      });
    }
  }

  /**
   * Khởi tạo activeCompound (ưu tiên hoạt chất đầu tiên được giao cho ít nhất 1 mẫu)
   */
  protected initActiveCompound() {
    if (this.draft.page1Data['activeCompound']) return;

    const compounds: string[] = this.config?.compounds || [];
    const sampleList: string[] = this.run?.sampleList || [];
    const targetMap = this.run?.sampleTargetMap ?? this.run?.inputs?.sampleTargetMap;

    let firstAssigned = targetMap
      ? compounds.find((c: string) => sampleList.some((s: string) => this.isTargetAssigned(s, c)))
      : compounds[0];

    if (!firstAssigned && compounds.length > 0) firstAssigned = compounds[0];
    if (firstAssigned) this.draft.page1Data['activeCompound'] = firstAssigned;
  }

  // ── DATA MIGRATION (v1 display string → v2 canonical id) ─────────────────

  /**
   * Tự động phát hiện và migrate các key cũ trong `draft.resultData`.
   *
   * Khi `compounds[]` trong config còn là display string (v1), dữ liệu lưu trong
   * Firestore dùng display string làm key (VD: 'BHC-alpha (benzene hexachloride)').
   * Sau khi migrate config sang canonical id (v2), cần đổi key cũ thành id mới
   * (VD: 'bhc-alpha_benzene_hexachloride') để dữ liệu cũ vẫn hiển thị đúng.
   *
   * Logic:
   * 1. Lấy danh sách compounds[] mới (canonical id)
   * 2. Với mỗi row trong resultData, với mỗi canonical id:
   *    - Nếu key đã tồn tại → bỏ qua (data mới, không cần migrate)
   *    - Nếu không tồn tại → tìm key cũ tương ứng trong LEGACY_DISPLAY_TO_CANONICAL
   *    - Nếu tìm thấy key cũ → đổi tên key → xóa key cũ
   */
  protected migrateResultDataKeys(): void {
    if (!this.config?.compounds || !this.draft.resultData) return;

    const canonicalIds: string[] = this.config.compounds;
    if (canonicalIds.length === 0) return;

    // Build reverse map: lowercase legacy display → canonical id (cho lần này)
    // Bao gồm cả short names từ COMPOUND_TO_FIRESTORE_ID
    const reverseMap = new Map<string, string>();
    for (const canonicalId of canonicalIds) {
      // The canonical id might itself be used as a key (already migrated)
      reverseMap.set(canonicalId.toLowerCase(), canonicalId);
      // Find all legacy display strings that map to this canonical id
      for (const [display, canonical] of Object.entries(COMPOUND_TO_FIRESTORE_ID)) {
        if (canonical === canonicalId) {
          reverseMap.set(display.toLowerCase(), canonicalId);
        }
      }
    }

    let didMigrate = false;
    const allRowKeys = Object.keys(this.draft.resultData);

    for (const rowKey of allRowKeys) {
      const row = this.draft.resultData[rowKey];
      if (!row || typeof row !== 'object') continue;

      for (const canonicalId of canonicalIds) {
        // Nếu key canonical đã có → không cần migrate row này cho compound này
        if (row[canonicalId] !== undefined) continue;

        // Tìm legacy key trong row
        const rowDataKeys = Object.keys(row);
        for (const rowDataKey of rowDataKeys) {
          const lowerDataKey = rowDataKey.toLowerCase();
          const mappedCanonical = reverseMap.get(lowerDataKey);
          if (mappedCanonical !== canonicalId) continue;

          // Tìm thấy legacy key → migrate
          // Di chuyển tất cả key có prefix này: value, _nd, _qc1, _qc2, _qc3, _ghiChu
          const suffixes = ['', '_nd', '_qc1', '_qc2', '_qc3', '_ghiChu'];
          for (const suffix of suffixes) {
            const oldKey = `${rowDataKey}${suffix}`;
            const newKey = `${canonicalId}${suffix}`;
            if (row[oldKey] !== undefined && row[newKey] === undefined) {
              row[newKey] = row[oldKey];
              delete row[oldKey];
              didMigrate = true;
            }
          }
          break; // Chỉ migrate 1 legacy key per compound per row
        }
      }
    }

    if (didMigrate) {
      console.info('[AbstractSopEntry] Migrated legacy display-string keys → canonical ids in draft.resultData');
      // Trigger save để persist migration
      this.draftChanged.emit(this.draft);
    }
  }

  // ── Master Analyte Loading ────────────────────────────────────────────────

  private async loadMasterAnalytes() {
    try {
      const analytes = await this.masterTargetService.getAll();
      this.masterTargets.set(analytes);
      this.buildDisplayNameMap();
    } catch (e) {
      console.warn('[AbstractSopEntry] Failed to load master analytes', e);
    }
  }

  buildDisplayNameMap() {
    if (!this.config?.compounds) return;
    const map: Record<string, string> = {};
    for (const compound of this.config.compounds) {
      map[compound] = this.getCompoundDisplayName(compound);
    }
    this.compoundDisplayNames.set(map);
  }

  getCompoundDisplayName(compound: string): string {
    return resolveCompoundDisplayName(compound, this.masterTargets());
  }

  // ── Target Assignment ─────────────────────────────────────────────────────

  /**
   * Xác định một hoạt chất (canonical id) có được giao cho một mẫu không.
   *
   * Sau khi migrate sang DATA_VERSION 2:
   * - compounds[] dùng canonical id (VD: 'chlorpyrifos')
   * - sampleTargetMap[sampleCode] cũng dùng canonical id
   * → So sánh trực tiếp, không cần qua getCanonicalId() shim
   *
   * Vẫn giữ fallback qua isCompoundAssigned() cho backward compat.
   */
  isTargetAssigned(sampleCode: string, compound: string): boolean {
    if (!this.run) return true;
    if (this.run.isVirtualMaster) return true;

    const targetMap = this.run.sampleTargetMap ?? this.run.inputs?.sampleTargetMap;
    if (!targetMap) return true;

    // Hỗ trợ pooled samples (ví dụ: 'A001;A002')
    const subCodes = sampleCode.split(';').map((s: string) => s.trim()).filter(Boolean);
    if (subCodes.length > 1) {
      return subCodes.some((sc: string) => {
        const matchKey = Object.keys(targetMap)
          .find(k => k.toLowerCase().trim() === sc.toLowerCase().trim());
        const assigned: string[] | null = matchKey ? targetMap[matchKey] : null;
        if (!assigned || assigned.length === 0) return true;
        // Direct canonical id match (fast path — v2)
        if (assigned.includes(compound)) return true;
        // Fallback shim (v1 legacy data)
        return assigned.some(tid => tid.toLowerCase() === compound.toLowerCase());
      });
    }

    const matchKey = Object.keys(targetMap)
      .find(k => k.toLowerCase().trim() === sampleCode.toLowerCase().trim());
    const assigned: string[] | null = matchKey ? targetMap[matchKey] : null;
    if (!assigned || assigned.length === 0) return true;

    // Direct canonical id match (fast path — v2)
    if (assigned.includes(compound)) return true;
    // Fallback shim: lowercase compare for any remaining v1 data
    return assigned.some(tid => tid.toLowerCase() === compound.toLowerCase());
  }

  /**
   * Tự động điền 'N/A' cho các hoạt chất không được giao cho từng mẫu.
   * Gọi sau khi masterTargets đã được load.
   */
  prefillUnassignedTargets() {
    const targetMap = this.run?.sampleTargetMap ?? this.run?.inputs?.sampleTargetMap;
    if (!this.run || !targetMap || !this.config?.compounds) return;

    let changed = false;
    (this.run.sampleList || []).forEach((sampleCode: string) => {
      if (!this.draft.resultData[sampleCode]) {
        this.draft.resultData[sampleCode] = {};
      }
      const row = this.draft.resultData[sampleCode];
      (this.config.compounds as string[]).forEach((c: string) => {
        if (!this.isTargetAssigned(sampleCode, c)) {
          if (row[c] !== 'N/A' && row[c] !== '—') {
            row[c] = 'N/A';
            row[`${c}_nd`] = false;
            row[`${c}_qc1`] = 'N/A';
            row[`${c}_qc2`] = 'N/A';
            row[`${c}_qc3`] = 'N/A';
            changed = true;
          }
        }
      });
    });

    if (changed) this.onDataChanged();
  }

  /**
   * Làm sạch kết quả của pooled samples dạng "A001: KPH; A002: KPH".
   * Nếu tất cả sub-samples đều âm tính, chuyển về trạng thái _nd = true.
   */
  cleanUpPooledSampleResults() {
    if (!this.run?.sampleList || !this.config?.compounds) return;

    const NEGATIVE_VALUES = new Set(['KPH', 'ND', 'N/A', '—', '']);
    let changed = false;

    (this.run.sampleList as string[]).forEach((sampleCode: string) => {
      if (!sampleCode.includes(';')) return;
      const row = this.draft.resultData[sampleCode];
      if (!row) return;

      (this.config.compounds as string[]).forEach((c: string) => {
        const val = row[c];
        if (typeof val !== 'string' || !val.includes(':')) return;

        const parts = val.split(';');
        let hasColon = false;
        let allNegative = true;

        for (const part of parts) {
          if (part.includes(':')) {
            hasColon = true;
            const res = part.split(':')[1].trim().toUpperCase();
            if (!NEGATIVE_VALUES.has(res)) { allNegative = false; break; }
          } else {
            const res = part.trim().toUpperCase();
            if (!NEGATIVE_VALUES.has(res)) { allNegative = false; break; }
          }
        }

        if (hasColon && allNegative) {
          row[c] = '';
          row[`${c}_nd`] = true;
          row[`${c}_qc1`] = 'Đạt';
          row[`${c}_qc2`] = 'Đạt';
          row[`${c}_qc3`] = 'Đạt';
          changed = true;
        }
      });
    });

    if (changed) this.onDataChanged();
  }

  // ── Data Change Handlers ──────────────────────────────────────────────────

  onDataChanged() {
    // Đồng bộ QC_FINAL theo QC_SPIKE (nếu cả 2 tồn tại)
    this.syncFinalFromSpike();
    // Tính % thu hồi cho QC mẫu thêm chuẩn
    this.updateAllRecoveries();
    this.draftChanged.emit(this.draft);
  }

  protected syncFinalFromSpike() {
    const spike = this.draft.resultData['QC_SPIKE'];
    const final = this.draft.resultData['QC_FINAL'];
    if (!spike || !final) return;
    final['loSo'] = spike['loSo'] || '';
    final['khoiLuong'] = spike['khoiLuong'] || '';
    final['heSoPhaLoang'] = spike['heSoPhaLoang'] || '';
    final['checkBoSungNuoc'] = spike['checkBoSungNuoc'] || 'không';
    final['checkHonHopLamSach'] = spike['checkHonHopLamSach'] || 'B1';
  }

  protected updateAllRecoveries() {
    if (!this.config?.compounds) return;
    (this.config.compounds as string[]).forEach((c: string) => {
      this.updateRecovery('QC_SPIKE', c);
      this.updateRecovery('QC_FINAL', c);
    });
  }

  updateRecovery(key: string, compound: string) {
    const row = this.draft.resultData[key];
    if (!row) return;
    const val = parseFloat(row[compound] || '');
    if (!isNaN(val)) {
      const rec = ((val / 10.0) * 100).toFixed(1);
      row[`${compound}_ghiChu`] = `${rec}%`;
    } else {
      row[`${compound}_ghiChu`] = '';
    }
  }

  onChromResultChanged(key: string) {
    if (key === 'QC_SPIKE' || key === 'QC_FINAL') {
      this.updateRecovery(key, this.draft.page1Data['activeCompound']);
    }
    this.onDataChanged();
  }

  // ── User Interactions ─────────────────────────────────────────────────────

  selectSample(sampleCode: string) {
    this.activeSampleCode.set(sampleCode);
  }

  syncDilution(sampleCode: string) {
    const val = this.draft.resultData[sampleCode]['heSoPhaLoang'] || '1';
    this.draft.resultData[sampleCode]['hSoPhaLoang'] = val;
    this.onDataChanged();
  }

  on10gCheckChange(event: any) {
    this.draft.page1Data['is10gChecked'] = event.target.checked;
    if (this.draft.page1Data['is10gChecked']) {
      this.draft.page1Data['khoiLuongKhac'] = '';
      this.draft.page1Data['khoiLuong'] = '10.0';
    } else {
      this.draft.page1Data['khoiLuong'] = this.draft.page1Data['khoiLuongKhac'] || '';
    }
    this.onDataChanged();
  }

  onKhoiLuongKhacChange() {
    if (this.draft.page1Data['khoiLuongKhac']) {
      this.draft.page1Data['is10gChecked'] = false;
      this.draft.page1Data['khoiLuong'] = this.draft.page1Data['khoiLuongKhac'];
    } else {
      this.draft.page1Data['is10gChecked'] = true;
      this.draft.page1Data['khoiLuong'] = '10.0';
    }
    this.onDataChanged();
  }

  /** Ngẫu nhiên hoá khối lượng mẫu (dùng cho formDon thực tế) */
  bulkRandomizeMasses() {
    (this.run?.sampleList || []).forEach((sampleCode: string) => {
      if (this.draft.resultData[sampleCode]) {
        this.draft.resultData[sampleCode]['khoiLuong'] = (10.01 + Math.random() * 0.08).toFixed(3);
      }
    });
    if (this.draft.resultData['QC_SPIKE']) {
      this.draft.resultData['QC_SPIKE']['khoiLuong'] = (10.01 + Math.random() * 0.08).toFixed(3);
    }
    this.onDataChanged();
  }

  // ── Compound QC Actions ───────────────────────────────────────────────────

  /** Khi checkbox KPH/ND thay đổi: làm sạch ô kết quả và tự động đánh Đạt */
  onNdCheckboxChanged(compound: string) {
    const active = this.activeSampleCode();
    const row = this.draft.resultData[active];
    if (row && this.isTargetAssigned(active, compound)) {
      if (row[`${compound}_nd`]) {
        row[compound] = '';
        row[`${compound}_qc1`] = 'Đạt';
        row[`${compound}_qc2`] = 'Đạt';
        row[`${compound}_qc3`] = 'Đạt';
      } else {
        row[compound] = '';
      }
    }
    this.onDataChanged();
  }

  /** Khi nhập giá trị kết quả: tự bỏ check KPH/ND */
  onResultInputChanged(compound: string) {
    const active = this.activeSampleCode();
    const row = this.draft.resultData[active];
    if (row && this.isTargetAssigned(active, compound)) {
      const val = String(row[compound] ?? '').trim();
      if (val !== '') {
        row[`${compound}_nd`] = false;
      }
    }
    this.onDataChanged();
  }

  /** Bulk: Đặt tất cả hoạt chất của mẫu đang chọn là KPH */
  sampleBulkFillND() {
    const active = this.activeSampleCode();
    const row = this.draft.resultData[active];
    if (row && this.config?.compounds) {
      (this.config.compounds as string[]).forEach((c: string) => {
        if (this.isTargetAssigned(active, c)) {
          row[c] = '';
          row[`${c}_nd`] = true;
          row[`${c}_qc1`] = 'Đạt';
          row[`${c}_qc2`] = 'Đạt';
          row[`${c}_qc3`] = 'Đạt';
        }
      });
    }
    this.onDataChanged();
  }

  /** Bulk: Đặt tất cả QC (qc1, qc2, qc3) của mẫu đang chọn là "Đạt" */
  sampleBulkQC() {
    const active = this.activeSampleCode();
    const row = this.draft.resultData[active];
    if (row && this.config?.compounds) {
      (this.config.compounds as string[]).forEach((c: string) => {
        if (this.isTargetAssigned(active, c)) {
          row[`${c}_qc1`] = 'Đạt';
          row[`${c}_qc2`] = 'Đạt';
          row[`${c}_qc3`] = 'Đạt';
        }
      });
    }
    this.onDataChanged();
  }

  /** Bulk: Sao chép kết quả mẫu đang chọn sang tất cả mẫu khác */
  copyActiveSampleToAll() {
    const sourceSample = this.activeSampleCode();
    const sourceData = this.draft.resultData[sourceSample];
    if (!sourceData || !this.config?.compounds) return;

    (this.run?.sampleList || []).forEach((sampleCode: string) => {
      if (sampleCode === sourceSample) return;
      const destRow = this.draft.resultData[sampleCode];
      if (!destRow) return;

      (this.config.compounds as string[]).forEach((c: string) => {
        if (!this.isTargetAssigned(sampleCode, c)) return;
        const srcAssigned = this.isTargetAssigned(sourceSample, c);
        destRow[c] = srcAssigned ? (sourceData[c] || '') : '';
        destRow[`${c}_nd`] = srcAssigned ? (sourceData[`${c}_nd`] !== false) : true;
        destRow[`${c}_qc1`] = srcAssigned ? (sourceData[`${c}_qc1`] || 'Đạt') : 'Đạt';
        destRow[`${c}_qc2`] = srcAssigned ? (sourceData[`${c}_qc2`] || 'Đạt') : 'Đạt';
        destRow[`${c}_qc3`] = srcAssigned ? (sourceData[`${c}_qc3`] || 'Đạt') : 'Đạt';
      });
      // Sync sample metadata
      destRow['khoiLuong'] = sourceData['khoiLuong'] || '10.0';
      destRow['heSoPhaLoang'] = sourceData['heSoPhaLoang'] || '1';
      destRow['hSoPhaLoang'] = sourceData['hSoPhaLoang'] || '1';
      destRow['checkBoSungNuoc'] = sourceData['checkBoSungNuoc'] || 'không';
      destRow['checkHonHopLamSach'] = sourceData['checkHonHopLamSach'] || 'B1';
    });

    this.onDataChanged();
  }

  /** Đặt trạng thái QC cho một hoạt chất cụ thể */
  setCompoundQc(compound: string, qcKey: 'qc1' | 'qc2' | 'qc3', status: 'Đạt' | 'Không đạt' | 'N/A') {
    const active = this.activeSampleCode();
    const row = this.draft.resultData[active];
    if (row && this.isTargetAssigned(active, compound)) {
      row[`${compound}_${qcKey}`] = status;
      this.onDataChanged();
    }
  }

  // ── Sample Selection ──────────────────────────────────────────────────────

  getSelectedSampleCount(): number {
    return (this.run?.sampleList || [])
      .filter((s: string) => this.draft.resultData[s]?.['selected'] !== false).length;
  }

  updateGopInChungState() {
    const shouldGop = this.getSelectedSampleCount() > 1;
    if (this.draft.page1Data['checkGopInChung'] !== shouldGop) {
      this.draft.page1Data['checkGopInChung'] = shouldGop;
    }
  }

  toggleSampleSelected(sampleCode: string, checked: boolean) {
    if (!this.draft.resultData[sampleCode]) {
      this.draft.resultData[sampleCode] = {};
    }
    this.draft.resultData[sampleCode]['selected'] = checked;
    this.updateGopInChungState();
    this.onDataChanged();
  }

  isAllSamplesSelected(): boolean {
    const sampleList = this.run?.sampleList || [];
    if (sampleList.length === 0) return false;
    return sampleList.every((s: string) => this.draft.resultData[s]?.['selected'] !== false);
  }

  toggleSelectAllSamples() {
    const targetState = !this.isAllSamplesSelected();
    (this.run?.sampleList || []).forEach((s: string) => {
      if (!this.draft.resultData[s]) this.draft.resultData[s] = {};
      this.draft.resultData[s]['selected'] = targetState;
    });
    this.updateGopInChungState();
    this.onDataChanged();
  }

  // ── Form Type (formCheck / formDon) ──────────────────────────────────────

  setPrintFormType(type: 'formCheck' | 'formDon') {
    this.draft.page1Data['printFormType'] = type;

    // Gán vial mặc định cho QC samples
    const defaultBlankVial = '7';
    const defaultSpikeVial = '8';
    if (this.draft.resultData['QC_BLANK'])
      this.draft.resultData['QC_BLANK']['loSo'] = defaultBlankVial;
    if (this.draft.resultData['QC_SPIKE'])
      this.draft.resultData['QC_SPIKE']['loSo'] = defaultSpikeVial;
    if (this.draft.resultData['QC_FINAL'])
      this.draft.resultData['QC_FINAL']['loSo'] = defaultSpikeVial;

    if (type === 'formDon' && !this.draft.page1Data['r2']) {
      this.draft.page1Data['r2'] = '0.999';
    }

    this.onSetPrintFormType(type);
    this.updateGopInChungState();
    this.onDataChanged();
  }

  /** Hook để override trong subclass (ví dụ: switch active tab) */
  protected onSetPrintFormType(_type: 'formCheck' | 'formDon'): void {}

  onFinalToggled() {
    if (this.draft.page1Data['hasFinal']) {
      const spike = this.draft.resultData['QC_SPIKE'];
      this.draft.resultData['QC_FINAL'] = {
        loSo: spike?.['loSo'] || '8',
        selected: true,
        khoiLuong: spike?.['khoiLuong'] || '10.0',
        heSoPhaLoang: spike?.['heSoPhaLoang'] || '1',
        checkBoSungNuoc: spike?.['checkBoSungNuoc'] || 'không',
        checkHonHopLamSach: spike?.['checkHonHopLamSach'] || 'B1'
      };
    } else {
      delete this.draft.resultData['QC_FINAL'];
    }
    this.onDataChanged();
  }

  // ── Chromatography Rows (dùng cho formDon) ────────────────────────────────

  /**
   * Xây dựng danh sách hàng hiển thị trong bảng sắc ký:
   * QC_BLANK → QC_SPIKE → Mẫu thử → QC_FINAL (optional)
   */
  getChromatographyRows(): ChromatographyRow[] {
    const list: ChromatographyRow[] = [];
    const isDon = this.draft.page1Data['printFormType'] === 'formDon';
    const defaultBlankVial = '7';
    const defaultSpikeVial = '8';

    // 1. QC_BLANK
    const blankName = this.draft.page1Data['blankName'] || 'BLANK';
    if (!this.draft.resultData['QC_BLANK']) {
      this.draft.resultData['QC_BLANK'] = this.createQcRow(defaultBlankVial, isDon);
    } else {
      this.draft.resultData['QC_BLANK']['loSo'] ||= defaultBlankVial;
      if (isDon && (!this.draft.resultData['QC_BLANK']['khoiLuong'] || this.draft.resultData['QC_BLANK']['khoiLuong'] === '10.0')) {
        this.draft.resultData['QC_BLANK']['khoiLuong'] = (10.01 + Math.random() * 0.09).toFixed(2);
      }
    }
    list.push({ key: 'QC_BLANK', label: blankName, type: 'QC' });

    // 2. QC_SPIKE
    const spikeName = this.draft.page1Data['spikeName'] || 'SPIKE';
    if (!this.draft.resultData['QC_SPIKE']) {
      this.draft.resultData['QC_SPIKE'] = this.createQcRow(defaultSpikeVial, isDon);
    } else {
      this.draft.resultData['QC_SPIKE']['loSo'] ||= defaultSpikeVial;
      if (isDon && (!this.draft.resultData['QC_SPIKE']['khoiLuong'] || this.draft.resultData['QC_SPIKE']['khoiLuong'] === '10.0')) {
        this.draft.resultData['QC_SPIKE']['khoiLuong'] = (10.01 + Math.random() * 0.09).toFixed(2);
      }
    }
    list.push({ key: 'QC_SPIKE', label: spikeName, type: 'QC' });

    // 3. Regular samples
    (this.run?.sampleList || []).forEach((sampleCode: string, idx: number) => {
      if (!this.draft.resultData[sampleCode]) {
        this.draft.resultData[sampleCode] = {
          ...this.createQcRow((9 + idx).toString(), isDon),
          selected: true
        };
      } else {
        const sRow = this.draft.resultData[sampleCode];
        if (!sRow['loSo']) sRow['loSo'] = (9 + idx).toString();
        if (!sRow['heSoPhaLoang']) sRow['heSoPhaLoang'] = '1';
        if (!sRow['hSoPhaLoang']) sRow['hSoPhaLoang'] = '1';
        if (isDon && (!sRow['khoiLuong'] || sRow['khoiLuong'] === '10.0')) {
          sRow['khoiLuong'] = (10.01 + Math.random() * 0.09).toFixed(2);
        }
      }
      list.push({ key: sampleCode, label: sampleCode, type: 'REGULAR' });
    });

    // 4. QC_FINAL (optional)
    if (this.draft.page1Data['hasFinal']) {
      if (!this.draft.resultData['QC_FINAL']) {
        const spike = this.draft.resultData['QC_SPIKE'];
        this.draft.resultData['QC_FINAL'] = {
          loSo: spike?.['loSo'] || defaultSpikeVial,
          selected: true,
          khoiLuong: spike?.['khoiLuong'] || (isDon ? (10.01 + Math.random() * 0.09).toFixed(2) : '10.0'),
          heSoPhaLoang: spike?.['heSoPhaLoang'] || '1',
          checkBoSungNuoc: 'không',
          checkHonHopLamSach: 'B1'
        };
      } else {
        const spike = this.draft.resultData['QC_SPIKE'];
        if (spike) {
          this.draft.resultData['QC_FINAL']['loSo'] = spike['loSo'] || defaultSpikeVial;
          this.draft.resultData['QC_FINAL']['khoiLuong'] = spike['khoiLuong'] || '10.0';
          this.draft.resultData['QC_FINAL']['heSoPhaLoang'] = spike['heSoPhaLoang'] || '1';
        }
      }
      list.push({ key: 'QC_FINAL', label: 'FINAL', type: 'QC' });
    }

    return list;
  }

  /** Bulk: Điền ND cho formDon với hoạt chất đang active */
  bulkFillNDFormDon() {
    const active = this.draft.page1Data['activeCompound'];
    if (!active) return;
    this.getChromatographyRows().forEach((row: ChromatographyRow) => {
      const rowData = this.draft.resultData[row.key];
      if (rowData && rowData['selected'] !== false) {
        if (!rowData[active] || String(rowData[active]).trim() === '') {
          rowData[active] = 'ND';
        }
      }
    });
    this.onDataChanged();
  }

  /** Bulk: Xóa dữ liệu formDon của hoạt chất đang active */
  bulkClearAllFormDon() {
    const active = this.draft.page1Data['activeCompound'];
    if (!active) return;
    this.getChromatographyRows().forEach((row: ChromatographyRow) => {
      const rowData = this.draft.resultData[row.key];
      if (rowData) {
        rowData[active] = '';
        rowData[`${active}_ghiChu`] = '';
      }
    });
    this.onDataChanged();
  }

  // ── Checkbox QC Helpers ───────────────────────────────────────────────────

  /** Xử lý chuyển đổi giữa "Tất cả ND" và "Có mẫu phát hiện" */
  onCheckboxChange(changedKey: string) {
    const p = this.draft.page1Data;
    if (changedKey === 'checkTatCaND' && p['checkTatCaND']) {
      p['checkCoMauPhatHien'] = false;
      p['qcNhanDang'] = null;
    } else if (changedKey === 'checkCoMauPhatHien' && p['checkCoMauPhatHien']) {
      p['checkTatCaND'] = false;
      p['qcNhanDang'] = true;
    }
    this.onDataChanged();
  }

  isGeneralObservation(key: string): boolean {
    return key === 'checkTatCaND' || key === 'checkCoMauPhatHien' || key === 'checkGopInChung';
  }

  setQcStatus(key: string, value: boolean | null) {
    this.draft.page1Data[key] = value;
    this.onDataChanged();
  }

  // ── Private Helpers ───────────────────────────────────────────────────────

  private createQcRow(loSo: string, isDon: boolean): any {
    return {
      loSo,
      selected: true,
      khoiLuong: isDon ? (10.01 + Math.random() * 0.09).toFixed(2) : '10.0',
      heSoPhaLoang: '1',
      checkBoSungNuoc: 'không',
      checkHonHopLamSach: 'B1'
    };
  }
}
