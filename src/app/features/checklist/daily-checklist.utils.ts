import { Request } from '../../core/models/request.model';
import {
  ApprovedBatchOverview,
  ApprovedBatchSample,
  ApprovedBatchStatus,
  DailySampleOverview,
  SampleBatchReference
} from './daily-checklist.model';

const APPROVED_BATCH_STATUSES = new Set<Request['status']>(['approved', 'draft', 'completed']);

export function toLocalDateInputValue(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isValidDateInput(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function toDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  const timestamp = value as { toDate?: () => Date };
  const candidate = typeof timestamp.toDate === 'function'
    ? timestamp.toDate()
    : value instanceof Date
      ? value
      : new Date(value as string | number);
  return Number.isNaN(candidate.getTime()) ? undefined : candidate;
}

export function getRequestDateValue(request: Request): string {
  if (isValidDateInput(request.analysisDate || '')) return request.analysisDate!;
  const fallback = toDate(request.approvedAt || request.timestamp);
  return fallback ? toLocalDateInputValue(fallback) : '';
}

export function getAvailableApprovedDates(requests: Request[]): string[] {
  return Array.from(new Set(
    requests
      .filter(isApprovedPhysicalBatch)
      .map(getRequestDateValue)
      .filter(Boolean)
  )).sort((a, b) => b.localeCompare(a));
}

export function buildApprovedBatchOverviews(
  requests: Request[],
  selectedDate: string,
  resolveTargetName: (sopId: string, targetId: string) => string
): ApprovedBatchOverview[] {
  if (!isValidDateInput(selectedDate)) return [];

  const uniqueRequests = new Map<string, Request>();
  requests.forEach(request => uniqueRequests.set(request.id, request));

  return Array.from(uniqueRequests.values())
    .filter(request => isApprovedPhysicalBatch(request) && getRequestDateValue(request) === selectedDate)
    .map(request => {
      const sampleTargetMap: Record<string, string[]> =
        request.sampleTargetMap ?? request.inputs?.sampleTargetMap ?? {};
      const fallbackTargets = uniqueStrings(request.targetIds || request.inputs?.targetIds || []);
      const samples = uniqueStrings(request.sampleList || []).map<ApprovedBatchSample>(sampleId => {
        const targetIds = uniqueStrings(sampleTargetMap[sampleId]?.length
          ? sampleTargetMap[sampleId]
          : fallbackTargets);
        return {
          sampleId,
          targetIds,
          targetNames: targetIds.map(targetId => resolveTargetName(request.sopId, targetId))
        };
      });
      const uniqueTargetNames = uniqueStrings(samples.flatMap(sample => sample.targetNames));

      return {
        requestId: request.id,
        sopId: request.sopId,
        sopName: request.sopName,
        status: request.status as ApprovedBatchStatus,
        analysisDate: selectedDate,
        approvedAt: toDate(request.approvedAt || request.timestamp),
        ownerName: request.user,
        samples,
        uniqueTargetNames,
        targetAssignments: samples.reduce((total, sample) => total + sample.targetIds.length, 0)
      };
    })
    .sort((a, b) => {
      const timeDifference = (b.approvedAt?.getTime() || 0) - (a.approvedAt?.getTime() || 0);
      return timeDifference || a.sopName.localeCompare(b.sopName, 'vi');
    });
}

export function buildDailySampleOverviews(batches: ApprovedBatchOverview[]): DailySampleOverview[] {
  const sampleMap = new Map<string, DailySampleOverview>();

  batches.forEach(batch => {
    batch.samples.forEach(sample => {
      let overview = sampleMap.get(sample.sampleId);
      if (!overview) {
        overview = {
          sampleId: sample.sampleId,
          batches: [],
          sopNames: [],
          targetNames: [],
          targetAssignments: 0
        };
        sampleMap.set(sample.sampleId, overview);
      }

      const reference: SampleBatchReference = {
        requestId: batch.requestId,
        sopId: batch.sopId,
        sopName: batch.sopName,
        status: batch.status,
        targetIds: sample.targetIds,
        targetNames: sample.targetNames
      };
      overview.batches.push(reference);
      overview.sopNames = uniqueStrings([...overview.sopNames, batch.sopName]);
      overview.targetNames = uniqueStrings([...overview.targetNames, ...sample.targetNames]);
      overview.targetAssignments += sample.targetIds.length;
    });
  });

  return Array.from(sampleMap.values()).sort((a, b) =>
    a.sampleId.localeCompare(b.sampleId, 'vi', { numeric: true })
  );
}

function isApprovedPhysicalBatch(request: Request): boolean {
  return APPROVED_BATCH_STATUSES.has(request.status) && !request.isVirtualMaster;
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values.map(value => String(value).trim()).filter(Boolean)));
}
