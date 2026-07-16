import {
  DailyBatchView,
  DailyPrintLayoutCandidate,
  DailyPrintLayoutPlan,
  DailyPrintOrientation,
  DailyPrintOrientationPreference
} from './daily-checklist.model';

interface OrientationMetrics {
  usableHeightMm: number;
  batchCharsPerLine: number;
  sampleCharsPerLine: number;
  targetCharsPerLine: number;
}

const ORIENTATION_METRICS: Record<DailyPrintOrientation, OrientationMetrics> = {
  portrait: {
    usableHeightMm: 265,
    batchCharsPerLine: 25,
    sampleCharsPerLine: 45,
    targetCharsPerLine: 42
  },
  landscape: {
    usableHeightMm: 178,
    batchCharsPerLine: 34,
    sampleCharsPerLine: 75,
    targetCharsPerLine: 68
  }
};

const DOCUMENT_HEADER_MM = 14;
const TABLE_HEADER_MM = 8;
const ROW_BASE_MM = 4.5;
const LINE_HEIGHT_MM = 3.8;

export function planDailyPrintLayout(
  batches: DailyBatchView[],
  groupSamples: boolean,
  preference: DailyPrintOrientationPreference = 'auto'
): DailyPrintLayoutPlan {
  const candidates = (['portrait', 'landscape'] as const)
    .map(orientation => evaluateOrientation(batches, groupSamples, orientation));
  const eligible = preference === 'auto'
    ? candidates
    : candidates.filter(candidate => candidate.orientation === preference);
  const selected = [...eligible].sort((a, b) => a.score - b.score)[0] || candidates[0];

  return {
    ...selected,
    reason: buildReason(selected, preference)
  };
}

function evaluateOrientation(
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
      const batchText = `${batch.requestId} ${batch.sopName} ${batch.sopRef || ''} v${batch.sopVersion || ''}`;
      const sampleText = groupSamples ? group.formattedSamples : group.sampleIds.join(', ');
      const targetText = group.targetNames.length ? group.targetNames.join('; ') : 'Chưa xác định chỉ tiêu';
      const lines = Math.max(
        estimateLines(batchText, metrics.batchCharsPerLine),
        estimateLines(sampleText, metrics.sampleCharsPerLine),
        estimateLines(targetText, metrics.targetCharsPerLine),
        1
      );
      wrappedLineCount += Math.max(0, lines - 1);
      const rowHeight = ROW_BASE_MM + lines * LINE_HEIGHT_MM;

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
    orientation,
    estimatedPages,
    estimatedBatchSplits,
    wrappedLineCount,
    score
  };
}

function estimateLines(text: string, charsPerLine: number): number {
  const normalizedLength = String(text || '').trim().length;
  return Math.max(1, Math.ceil(normalizedLength / charsPerLine));
}

function buildReason(
  selected: DailyPrintLayoutCandidate,
  preference: DailyPrintOrientationPreference
): string {
  const orientationLabel = selected.orientation === 'portrait' ? 'A4 dọc' : 'A4 ngang';
  if (preference !== 'auto') return `Đã chọn thủ công ${orientationLabel}.`;
  if (selected.orientation === 'landscape') {
    return `Tự chọn ${orientationLabel} vì mã mẫu hoặc tên chỉ tiêu cần nhiều chiều ngang hơn.`;
  }
  return `Tự chọn ${orientationLabel} để giảm số trang và hạn chế chia mẻ.`;
}
