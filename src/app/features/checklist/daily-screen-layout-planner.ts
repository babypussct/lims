import { DailyBatchView } from './daily-checklist.model';

export type DailyBatchLayoutHint = 'compact' | 'standard' | 'wide';
export type DailyBatchViewMode = 'auto' | 'compact' | 'list';

const SINGLE_COLUMN_MAX_WIDTH = 759;

/**
 * Chọn độ rộng card từ độ phức tạp nội dung, không phụ thuộc số mẫu thô.
 * Một dải 50 mẫu đã gom vẫn có thể là card gọn nếu chuỗi hiển thị ngắn.
 */
export function computeDailyBatchLayoutHint(
  batch: DailyBatchView,
  containerWidth: number,
  expanded = false,
  viewMode: DailyBatchViewMode = 'auto'
): DailyBatchLayoutHint {
  if (expanded || viewMode === 'list') return 'wide';
  if (viewMode === 'compact') return 'compact';

  // Ở container hẹp chỉ có một cột khả dụng; dùng wide để tránh tạo implicit column.
  if (containerWidth > 0 && containerWidth <= SINGLE_COLUMN_MAX_WIDTH) return 'wide';

  const groupCount = batch.groups.length;
  const maxSampleTextLength = batch.groups.reduce(
    (max, group) => Math.max(max, group.formattedSamples.length),
    0
  );
  const maxTargetTextLength = batch.groups.reduce(
    (max, group) => Math.max(max, group.targetNames.reduce((sum, name) => sum + name.length, 0)),
    0
  );

  if (groupCount >= 3 || maxSampleTextLength > 80 || maxTargetTextLength > 120) return 'wide';
  if (groupCount === 2 || batch.uniqueTargets > 6 || maxSampleTextLength > 40) return 'standard';
  return 'compact';
}
