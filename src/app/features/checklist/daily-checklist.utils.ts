import { Request } from '../../core/models/request.model';
import { DailyChecklistAssignment } from './daily-checklist.model';

export const UNASSIGNED_TARGET_ID = '__unassigned__';

export function toLocalDateInputValue(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function toLocalDaySuffix(date = new Date()): string {
  return String(date.getDate()).padStart(2, '0');
}

export function isValidDateInput(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function getSelectedDay(value: string): string {
  return isValidDateInput(value) ? value.slice(-2) : '';
}

export function getDaySuffix(sampleId: string): string {
  const match = sampleId.trim().match(/(\d{2})$/);
  return match?.[1] ?? '';
}

export function buildAssignmentKey(requestId: string, sampleId: string, targetId: string): string {
  return `${requestId}\u0000${sampleId}\u0000${targetId}`;
}

export function buildDailyCheckId(requestId: string, sampleId: string, targetId: string): string {
  return [requestId, sampleId, targetId]
    .map(part => encodeURIComponent(part).replace(/%/g, '_'))
    .join('__');
}

export function uniqueSampleKey(requestId: string, sampleId: string): string {
  return `${requestId}\u0000${sampleId}`;
}

export function buildAssignments(
  requests: Request[],
  selectedDay: string,
  resolveTargetName: (sopId: string, targetId: string) => string
): DailyChecklistAssignment[] {
  if (!/^\d{2}$/.test(selectedDay)) return [];

  const result: DailyChecklistAssignment[] = [];
  const seen = new Set<string>();

  for (const request of requests) {
    if (!request.sampleList?.length) continue;

    const isLegacyDate = !isValidDateInput(request.analysisDate || '');

    const sampleTargetMap: Record<string, string[]> =
      request.sampleTargetMap ?? request.inputs?.sampleTargetMap ?? {};

    for (const rawSampleId of request.sampleList) {
      const sampleId = rawSampleId.trim();
      if (!sampleId) continue;

      const suffix = getDaySuffix(sampleId);
      if (suffix !== selectedDay) continue;

      const assignedTargets = sampleTargetMap[sampleId]?.length
        ? sampleTargetMap[sampleId]
        : [UNASSIGNED_TARGET_ID];

      for (const targetId of assignedTargets) {
        const key = buildAssignmentKey(request.id, sampleId, targetId);
        if (seen.has(key)) continue;
        seen.add(key);

        result.push({
          key,
          requestId: request.id,
          sopId: request.sopId,
          sopName: request.sopName,
          sampleId,
          targetId,
          targetName: targetId === UNASSIGNED_TARGET_ID
            ? 'Chưa gán chỉ tiêu'
            : resolveTargetName(request.sopId, targetId),
          status: request.status,
          analysisDate: request.analysisDate,
          daySuffix: selectedDay,
          isLegacyDate,
          hasDayMismatch: false
        });
      }
    }
  }

  return result;
}
