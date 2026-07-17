import {
  DailyBatchView,
  DailyPrintLayoutCandidate,
  DailyPrintLayoutPlan,
  DailyPrintMode,
  DailyPrintModePreference,
  DailyPrintOrientation,
  DailyPrintOrientationPreference
} from './daily-checklist.model';
import { getTargetScopeDisplayText } from '../targets/target-scope-classifier';

interface OrientationMetrics {
  usableHeightMm: number;
  batchCharsPerLine: number;
  sampleCharsPerLine: number;
  targetCharsPerLine: number;
  compactColumns: number;
  compactSampleCharsPerLine: number;
  compactTargetCharsPerLine: number;
}

const ORIENTATION_METRICS: Record<DailyPrintOrientation, OrientationMetrics> = {
  portrait: {
    usableHeightMm: 265,
    batchCharsPerLine: 25,
    sampleCharsPerLine: 45,
    targetCharsPerLine: 42,
    compactColumns: 2,
    compactSampleCharsPerLine: 28,
    compactTargetCharsPerLine: 34
  },
  landscape: {
    usableHeightMm: 178,
    batchCharsPerLine: 34,
    sampleCharsPerLine: 75,
    targetCharsPerLine: 68,
    compactColumns: 3,
    compactSampleCharsPerLine: 34,
    compactTargetCharsPerLine: 42
  }
};

const DOCUMENT_HEADER_MM = 14;
const TABLE_HEADER_MM = 8;
const ROW_BASE_MM = 4.5;
const LINE_HEIGHT_MM = 3.8;
const COMPACT_CARD_HEADER_MM = 20;
const COMPACT_GROUP_BASE_MM = 7;
const COMPACT_LINE_HEIGHT_MM = 3.2;
const COMPACT_CARD_GAP_MM = 4;

interface CompactCardEstimate {
  heightMm: number;
  wrappedLineCount: number;
}

interface CompactPlacement {
  pages: DailyBatchView[][][];
  overflowPageCount: number;
  estimatedBatchSplits: number;
  wrappedLineCount: number;
}

export function planDailyPrintLayout(
  batches: DailyBatchView[],
  groupSamples: boolean,
  orientationPreference: DailyPrintOrientationPreference = 'auto',
  modePreference: DailyPrintModePreference = 'auto'
): DailyPrintLayoutPlan {
  const candidates = (['compact', 'list'] as const).flatMap(mode =>
    (['portrait', 'landscape'] as const)
      .map(orientation => evaluateLayout(batches, groupSamples, mode, orientation))
  );
  const eligible = candidates.filter(candidate =>
    (orientationPreference === 'auto' || candidate.orientation === orientationPreference)
    && (modePreference === 'auto' || candidate.mode === modePreference)
  );
  const selected = [...eligible].sort((a, b) => a.score - b.score)[0] || candidates[0];

  return {
    ...selected,
    reason: buildReason(selected, orientationPreference, modePreference)
  };
}

function evaluateLayout(
  batches: DailyBatchView[],
  groupSamples: boolean,
  mode: DailyPrintMode,
  orientation: DailyPrintOrientation
): DailyPrintLayoutCandidate {
  return mode === 'compact'
    ? evaluateCompactLayout(batches, groupSamples, orientation)
    : evaluateListLayout(batches, groupSamples, orientation);
}

function evaluateListLayout(
  batches: DailyBatchView[],
  groupSamples: boolean,
  orientation: DailyPrintOrientation
): DailyPrintLayoutCandidate {
  const metrics = ORIENTATION_METRICS[orientation];
  const pageBodyHeight = metrics.usableHeightMm - DOCUMENT_HEADER_MM - TABLE_HEADER_MM;
  let currentPageHeight = 0;
  let estimatedPages = batches.length ? 1 : 0;
  let estimatedBatchSplits = 0;
  let wrappedLineCount = 0;

  batches.forEach(batch => {
    let batchStartedOnPage = false;
    let batchWasSplit = false;
    batch.groups.forEach(group => {
      const batchText = `${batch.sopName} v${batch.sopVersion || ''}`;
      const sampleText = groupSamples ? group.formattedSamples : group.sampleIds.join(', ');
      const targetText = getTargetScopeDisplayText(group.targetScope) || 'Chưa xác định chỉ tiêu';
      const lines = Math.max(
        estimateLines(batchText, metrics.batchCharsPerLine),
        estimateLines(sampleText, metrics.sampleCharsPerLine),
        estimateLines(targetText, metrics.targetCharsPerLine),
        1
      );
      wrappedLineCount += Math.max(0, lines - 1);
      const rowHeight = Math.max(21, ROW_BASE_MM + lines * LINE_HEIGHT_MM);

      if (rowHeight > pageBodyHeight) {
        if (currentPageHeight > 0) {
          estimatedPages += 1;
          currentPageHeight = 0;
          if (batchStartedOnPage) batchWasSplit = true;
        }
        const pagesForRow = Math.ceil(rowHeight / pageBodyHeight);
        estimatedPages += Math.max(0, pagesForRow - 1);
        currentPageHeight = rowHeight % pageBodyHeight;
        if (pagesForRow > 1) batchWasSplit = true;
        batchStartedOnPage = true;
        return;
      }

      if (currentPageHeight > 0 && currentPageHeight + rowHeight > pageBodyHeight) {
        estimatedPages += 1;
        currentPageHeight = 0;
        if (batchStartedOnPage) batchWasSplit = true;
      }
      currentPageHeight += rowHeight;
      batchStartedOnPage = true;
    });
    if (batchWasSplit) estimatedBatchSplits += 1;
  });

  const landscapePenalty = orientation === 'landscape' ? 4 : 0;
  const score = estimatedPages * 100
    + estimatedBatchSplits * 24
    + wrappedLineCount * 1.5
    + landscapePenalty;

  return {
    mode: 'list',
    orientation,
    estimatedPages,
    estimatedBatchSplits,
    wrappedLineCount,
    score
  };
}

function evaluateCompactLayout(
  batches: DailyBatchView[],
  groupSamples: boolean,
  orientation: DailyPrintOrientation
): DailyPrintLayoutCandidate {
  const placement = buildCompactPlacement(batches, groupSamples, orientation);
  const estimatedPages = placement.pages.length + placement.overflowPageCount;
  const { estimatedBatchSplits, wrappedLineCount } = placement;

  const landscapePenalty = orientation === 'landscape' ? 4 : 0;
  const complexityPenalty = batches.reduce((penalty, batch) => penalty
    + Number(batch.groups.length > 2) * 18
    + Number(batch.groups.some(group => !group.targetScope.compact && group.targetNames.length > 30)) * 12, 0);
  const score = estimatedPages * 100
    + estimatedBatchSplits * 30
    + wrappedLineCount
    + landscapePenalty
    + complexityPenalty;

  return {
    mode: 'compact',
    orientation,
    estimatedPages,
    estimatedBatchSplits,
    wrappedLineCount,
    score
  };
}

export function buildDailyCompactPrintPages(
  batches: DailyBatchView[],
  groupSamples: boolean,
  orientation: DailyPrintOrientation
): DailyBatchView[][][] {
  return buildCompactPlacement(batches, groupSamples, orientation).pages;
}

function buildCompactPlacement(
  batches: DailyBatchView[],
  groupSamples: boolean,
  orientation: DailyPrintOrientation
): CompactPlacement {
  if (batches.length === 0) {
    return { pages: [], overflowPageCount: 0, estimatedBatchSplits: 0, wrappedLineCount: 0 };
  }

  const metrics = ORIENTATION_METRICS[orientation];
  const pageBodyHeight = metrics.usableHeightMm - DOCUMENT_HEADER_MM;
  const pages: DailyBatchView[][][] = [];
  let currentColumns: DailyBatchView[][] = [];
  let columnHeights: number[] = [];
  let estimatedBatchSplits = 0;
  let overflowPageCount = 0;
  let wrappedLineCount = 0;

  const startPage = () => {
    currentColumns = Array.from({ length: metrics.compactColumns }, () => [] as DailyBatchView[]);
    columnHeights = Array.from({ length: metrics.compactColumns }, () => 0);
    pages.push(currentColumns);
  };

  startPage();
  batches.forEach(batch => {
    const estimate = estimateCompactCard(batch, groupSamples, metrics);
    wrappedLineCount += estimate.wrappedLineCount;
    if (estimate.heightMm > pageBodyHeight) {
      estimatedBatchSplits += 1;
      overflowPageCount += Math.ceil(estimate.heightMm / pageBodyHeight) - 1;
    }

    let targetColumn = indexOfSmallest(columnHeights);
    const pageHasCards = currentColumns.some(column => column.length > 0);
    if (pageHasCards && columnHeights[targetColumn] + estimate.heightMm + COMPACT_CARD_GAP_MM > pageBodyHeight) {
      startPage();
      targetColumn = 0;
    }

    currentColumns[targetColumn].push(batch);
    columnHeights[targetColumn] += estimate.heightMm + COMPACT_CARD_GAP_MM;
  });

  return { pages, overflowPageCount, estimatedBatchSplits, wrappedLineCount };
}

function estimateCompactCard(
  batch: DailyBatchView,
  groupSamples: boolean,
  metrics: OrientationMetrics
): CompactCardEstimate {
  let heightMm = COMPACT_CARD_HEADER_MM;
  let wrappedLineCount = 0;

  batch.groups.forEach(group => {
    const sampleText = groupSamples ? group.formattedSamples : group.sampleIds.join(', ');
    const targetText = getTargetScopeDisplayText(group.targetScope) || 'Chưa xác định chỉ tiêu';
    const sampleLines = estimateLines(sampleText, metrics.compactSampleCharsPerLine);
    const targetLines = estimateLines(targetText, metrics.compactTargetCharsPerLine);
    wrappedLineCount += Math.max(0, sampleLines - 1) + Math.max(0, targetLines - 1);
    heightMm += COMPACT_GROUP_BASE_MM + (sampleLines + targetLines) * COMPACT_LINE_HEIGHT_MM;
  });

  return { heightMm, wrappedLineCount };
}

function indexOfSmallest(values: number[]): number {
  return values.reduce((bestIndex, value, index) => value < values[bestIndex] ? index : bestIndex, 0);
}

function estimateLines(text: string, charsPerLine: number): number {
  const normalizedLength = String(text || '').trim().length;
  return Math.max(1, Math.ceil(normalizedLength / charsPerLine));
}

function buildReason(
  selected: DailyPrintLayoutCandidate,
  orientationPreference: DailyPrintOrientationPreference,
  modePreference: DailyPrintModePreference
): string {
  const orientationLabel = selected.orientation === 'portrait' ? 'A4 dọc' : 'A4 ngang';
  const modeLabel = selected.mode === 'compact' ? 'lưới gọn' : 'danh sách';
  if (orientationPreference !== 'auto' && modePreference !== 'auto') {
    return `Đã chọn ${modeLabel} trên ${orientationLabel}.`;
  }
  if (modePreference !== 'auto') {
    return `Tự chọn hướng ${orientationLabel} phù hợp nhất cho chế độ ${modeLabel}.`;
  }
  if (orientationPreference !== 'auto') {
    return `Tự chọn chế độ ${modeLabel} phù hợp nhất trên ${orientationLabel}.`;
  }
  return `Tự chọn ${modeLabel} · ${orientationLabel} để giảm số trang và hạn chế chia mẻ.`;
}
