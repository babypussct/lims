import { DailyBatchView } from './daily-checklist.model';
import { getTargetScopeDisplayText } from '../targets/target-scope-classifier';

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
    (max, group) => Math.max(max, group.formattedSamples.length + group.formattedDescriptions.length),
    0
  );
  const maxTargetTextLength = batch.groups.reduce(
    (max, group) => Math.max(
      max,
      group.targetScope.compact
        ? getTargetScopeDisplayText(group.targetScope).length
        : group.targetNames.slice(0, 6).reduce((sum, name) => sum + name.length, 0)
    ),
    0
  );

  if (groupCount >= 3 || maxSampleTextLength > 55 || maxTargetTextLength > 80) return 'wide';
  if (groupCount === 2 || maxSampleTextLength > 25 || maxTargetTextLength > 50) return 'standard';
  return 'compact';
}
