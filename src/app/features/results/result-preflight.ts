import { AnalysisResultDraft } from '../../core/models/analysis-result.model';
import {
  getAssignedTargetsForSample,
  isCompoundAssigned,
  SOP01_COLUMN_TO_CANONICAL
} from './shared/compound-id-resolver';

export interface PublishPreflightSummary {
  activeFilter: string;
  includedSamples: string[];
  chunks: string[][];
  blockers: string[];
  warnings: string[];
  info: string[];
}

export interface PublishPreflightArgs {
  run: any;
  draft: AnalysisResultDraft;
  config: any;
  configKey?: string | null;
  activeFilter: string;
  samplesPerReport?: number | null;
  unpublishedSamples?: string[];
  masterTargets?: any[];
}

export function buildPublishPreflightSummary(args: PublishPreflightArgs): PublishPreflightSummary {
  const {
    run,
    draft,
    config,
    configKey,
    activeFilter,
    samplesPerReport,
    unpublishedSamples = [],
    masterTargets = []
  } = args;

  const includedSamples = (run.sampleList || []).filter((sample: string) => {
    const resObj = draft.resultData?.[sample] || {};
    const startsWithLetter = /^[a-zA-Z]/.test(sample);
    const prefix = startsWithLetter ? sample.charAt(0).toUpperCase() : '';
    const isSelected = resObj['selected'] !== false;
    const matchesFilter = activeFilter === 'ALL' || prefix === activeFilter;
    return isSelected && matchesFilter && !sample.startsWith('QC_');
  });

  const chunkSize = samplesPerReport || includedSamples.length || 1;
  const chunks: string[][] = [];
  for (let i = 0; i < includedSamples.length; i += chunkSize) {
    chunks.push(includedSamples.slice(i, i + chunkSize));
  }

  const blockers: string[] = [];
  const warnings: string[] = [];
  const info: string[] = [];

  if (includedSamples.length === 0) {
    blockers.push('Chưa có mẫu nào được chọn trong phạm vi in hiện tại.');
  }
  if (!draft.page1Data?.ngayNguoiPhanTich) {
    blockers.push('Thiếu ngày ký Người phân tích.');
  }
  if (!draft.page1Data?.ngayNguoiThamTra) {
    blockers.push('Thiếu ngày ký Người thẩm tra.');
  }

  const needsR2 = config.formType === 'type3a'
    || config.formType === 'type3b'
    || ['trifluralin-gcms', 'dichlorvos-gcms', 'chloroform-gcms'].includes(configKey || '');
  const printFormType = String(draft.page1Data?.['printFormType'] || '');
  const formExposesR2 = doesPrintFormExposeR2(configKey, printFormType);
  if (formExposesR2 && needsR2 && !String(draft.page1Data?.['r2'] || '').trim()) {
    warnings.push('Chưa nhập hệ số xác định R².');
  }

  const activeColumns = Object.keys(config.columns || {})
    .filter(col => !['loSo', 'maSoMau', 'ghiChu', 'khoiLuong', 'heSoPhaLoang'].includes(col));
  const blankResultsMeanNd = configKey === 'fipronil-chlorpyrifos'
    || configKey === 'trifluralin-gcms'
    || run.sopId === 'SOP-01'
    || run.sopId === 'SOP-03';
  const isSop914 = configKey === 'tbvtv-thuc-pham-gcmsms'
    || configKey === 'tbvtv-thuc-pham-gcmsms-rut-gon'
    || run.sopId === '9.14-tbvtv-gcmsms';
  const sampleTargetMap = run.sampleTargetMap ?? run.inputs?.sampleTargetMap;

  const requiredResultKeysForSample = (sample: string): string[] => {
    const assigned = getAssignedTargetsForSample(sample, sampleTargetMap);

    if (config.formType === 'type3b' && Array.isArray(config.compounds)) {
      if (!assigned) return [...config.compounds];
      return config.compounds.filter((compound: string) =>
        isCompoundAssigned(assigned, compound, masterTargets)
      );
    }

    if (!assigned) return [...activeColumns];
    return activeColumns.filter((column: string) => {
      const canonical = SOP01_COLUMN_TO_CANONICAL[column] || column;
      return isCompoundAssigned(assigned, canonical, masterTargets);
    });
  };

  const missingResultSamples = includedSamples.filter((sample: string) => {
    // Một số SOP dạng type2 quy ước ô kết quả trống là ND hợp lệ.
    // Preflight không tự ghi "ND" vào draft; chỉ không chặn publish.
    if (blankResultsMeanNd) return false;

    const row = draft.resultData?.[sample] || {};
    const requiredKeys = requiredResultKeysForSample(sample);
    if (requiredKeys.length === 0) return false;

    if (isSop914) {
      return requiredKeys.some((key: string) => !hasExplicitResultState(row, key));
    }

    if (config.formType === 'type3b' && Array.isArray(config.compounds)) {
      return !config.compounds.some((compound: string) => hasExplicitResultState(row, compound));
    }
    return !activeColumns.some(col => hasReportableValue(row[col]));
  });
  if (missingResultSamples.length > 0) {
    blockers.push(`Có ${missingResultSamples.length} mẫu chưa có kết quả hoặc ND: ${missingResultSamples.slice(0, 8).join(', ')}${missingResultSamples.length > 8 ? '...' : ''}`);
  }

  if (isSop914) {
    const invalidResultSamples = includedSamples.filter((sample: string) => {
      const row = draft.resultData?.[sample] || {};
      return requiredResultKeysForSample(sample).some((key: string) =>
        hasExplicitResultState(row, key) && !hasValidSop914ResultState(row, key)
      );
    });
    if (invalidResultSamples.length > 0) {
      blockers.push(`Có ${invalidResultSamples.length} mẫu chứa giá trị kết quả không hợp lệ (chỉ chấp nhận số, ND/KPH hoặc <LOQ): ${invalidResultSamples.slice(0, 8).join(', ')}${invalidResultSamples.length > 8 ? '...' : ''}`);
    }
  }

  const alreadyPublished = includedSamples.filter((sample: string) => !unpublishedSamples.includes(sample));
  if (alreadyPublished.length > 0) {
    warnings.push(`${alreadyPublished.length} mẫu trong phạm vi này đã từng có báo cáo. Lần in mới sẽ tạo phiên bản mới/phiếu mới.`);
  }
  if (chunks.length > 1) {
    info.push(`Sẽ tách thành ${chunks.length} phiếu, mỗi phiếu tối đa ${chunkSize} mẫu.`);
  }
  if (activeFilter !== 'ALL') {
    info.push(`Phạm vi in hiện tại: ${activeFilter === '' ? 'Không tiền tố' : 'Nhóm ' + activeFilter}.`);
  }
  if (draft.page1Data?.['printFormType']) {
    info.push(`Kiểu form: ${draft.page1Data['printFormType']}.`);
  }

  return { activeFilter, includedSamples, chunks, blockers, warnings, info };
}

function hasReportableValue(value: any): boolean {
  return value !== null && value !== undefined && String(value).trim() !== '' && value !== 'N/A';
}

function hasExplicitResultState(row: Record<string, any>, key: string): boolean {
  return row[`${key}_nd`] === true || hasReportableValue(row[key]);
}

function hasValidSop914ResultState(row: Record<string, any>, key: string): boolean {
  if (row[`${key}_nd`] === true) return true;
  return isValidSop914ResultValue(row[key]);
}

function isValidSop914ResultValue(value: any): boolean {
  if (!hasReportableValue(value)) return false;
  if (typeof value === 'number') return Number.isFinite(value) && value >= 0;

  const normalized = String(value).trim().toUpperCase();
  if (normalized === 'ND' || normalized === 'KPH' || normalized === '<LOQ') return true;

  return /^\d+(?:[.,]\d+)?(?:E[+-]?\d+)?$/.test(normalized);
}

function doesPrintFormExposeR2(configKey: string | null | undefined, printFormType: string): boolean {
  if (printFormType === 'formCheck') return false;

  // SOP 9.14 dùng tên formDayDu/formRutGon thay cho hệ formCheck/formDon.
  // Cả hai giao diện 9.14 đều không có trường R² nên preflight không được
  // yêu cầu một dữ liệu mà người dùng không thể nhập trên UI.
  if (
    configKey === 'tbvtv-thuc-pham-gcmsms'
    && (printFormType === 'formDayDu' || printFormType === 'formRutGon')
  ) {
    return false;
  }

  return true;
}
