import { Request } from '../../core/models/request.model';
import { formatSampleList, naturalCompare } from '../../shared/utils/utils';
import { getAssignedTargetsForSample } from '../results/shared/compound-id-resolver';
import {
  ApprovedBatchOverview,
  ApprovedBatchSample,
  ApprovedBatchStatus,
  DailyPrintSopGroup,
  DailyPrintTargetSetGroup
} from './daily-checklist.model';

const APPROVED_BATCH_STATUSES = new Set<Request['status']>(['approved', 'draft', 'completed']);

export function toLocalDateInputValue(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isValidDateInput(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const candidate = new Date(year, month - 1, day);
  return candidate.getFullYear() === year
    && candidate.getMonth() === month - 1
    && candidate.getDate() === day;
}

export function toDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  const timestamp = value as { toDate?: () => Date; seconds?: number };
  const candidate = typeof timestamp.toDate === 'function'
    ? timestamp.toDate()
    : typeof timestamp.seconds === 'number'
      ? new Date(timestamp.seconds * 1000)
    : value instanceof Date
      ? value
      : new Date(value as string | number);
  return Number.isNaN(candidate.getTime()) ? undefined : candidate;
}

export function getRequestDateValue(request: Request): string {
  return isValidDateInput(request.analysisDate || '') ? request.analysisDate! : '';
}

export function buildApprovedBatchOverviews(
  requests: Request[],
  selectedDate: string,
  resolveTargetName: (request: Request, targetId: string) => string
): ApprovedBatchOverview[] {
  if (!isValidDateInput(selectedDate)) return [];

  const uniqueRequests = new Map<string, Request>();
  requests.forEach(request => uniqueRequests.set(request.id, request));

  return Array.from(uniqueRequests.values())
    .filter(request => isTrackablePhysicalBatch(request) && getRequestDateValue(request) === selectedDate)
    .map(request => {
      const sampleTargetMap: Record<string, string[]> =
        request.sampleTargetMap ?? request.inputs?.sampleTargetMap ?? {};
      const fallbackTargets = uniqueStrings(request.targetIds || request.inputs?.targetIds || []);
      const samples = uniqueStrings(request.sampleList || []).map<ApprovedBatchSample>(sampleId => {
        const assignedTargets = getAssignedTargetsForSample(sampleId, sampleTargetMap);
        const targetIds = uniqueStrings(assignedTargets?.length ? assignedTargets : fallbackTargets);
        return {
          sampleId,
          targetIds,
          targetNames: targetIds.map(targetId => resolveTargetName(request, targetId))
        };
      });
      const uniqueTargetNames = uniqueStrings(samples.flatMap(sample => sample.targetNames));

      return {
        requestId: request.id,
        sopId: request.sopId,
        sopName: request.sopName,
        sopVersion: request.sopVersion,
        sopRef: request.sopRef,
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

export function buildDailyPrintSopGroups(batches: ApprovedBatchOverview[]): DailyPrintSopGroup[] {
  const sopMap = new Map<string, {
    sopName: string;
    // Map requestId -> Map<sampleId, Map<targetId, targetName>>
    batchesData: Map<string, {
      status: ApprovedBatchStatus;
      sopVersion?: number;
      sopRef?: string;
      samples: Map<string, Map<string, string>>;
    }>;
  }>();

  batches.forEach(batch => {
    let sop = sopMap.get(batch.sopId);
    if (!sop) {
      sop = { sopName: batch.sopName, batchesData: new Map() };
      sopMap.set(batch.sopId, sop);
    }
    
    let batchData = sop.batchesData.get(batch.requestId);
    if (!batchData) {
      batchData = {
        status: batch.status,
        sopVersion: batch.sopVersion,
        sopRef: batch.sopRef,
        samples: new Map<string, Map<string, string>>()
      };
      sop.batchesData.set(batch.requestId, batchData);
    }

    batch.samples.forEach(sample => {
      let targets = batchData!.samples.get(sample.sampleId);
      if (!targets) {
        targets = new Map<string, string>();
        batchData!.samples.set(sample.sampleId, targets);
      }
      sample.targetIds.forEach((targetId, index) => {
        targets!.set(targetId, sample.targetNames[index] || targetId);
      });
    });
  });

  return Array.from(sopMap, ([sopId, sop]) => {
    const targetSetMap = new Map<string, DailyPrintTargetSetGroup>();
    const allTargetIds = new Set<string>();
    const allSampleIds = new Set<string>();

    sop.batchesData.forEach((batchData, requestId) => {
      batchData.samples.forEach((targets, sampleId) => {
        allSampleIds.add(sampleId);
        const targetEntries = Array.from(targets.entries()).sort((a, b) => naturalCompare(a[0], b[0]));
        targetEntries.forEach(([targetId]) => allTargetIds.add(targetId));
        const targetIds = targetEntries.map(([targetId]) => targetId);
        
        // Bổ sung requestId vào signature để không trộn lẫn mẫu của 2 mẻ khác nhau
        const signature = (targetIds.length ? targetIds.join('\u0000') : '__unassigned__') + '##' + requestId;
        let group = targetSetMap.get(signature);
        if (!group) {
          group = {
            signature,
            requestId,
            status: batchData.status,
            sopVersion: batchData.sopVersion,
            sopRef: batchData.sopRef,
            targetIds,
            targetNames: targetEntries.map(([, targetName]) => targetName),
            sampleIds: [],
            formattedSamples: ''
          };
          targetSetMap.set(signature, group);
        }
        group.sampleIds.push(sampleId);
      });
    });

    const groups = Array.from(targetSetMap.values())
      .map(group => {
        const sampleIds = Array.from(new Set(group.sampleIds)).sort(naturalCompare);
        return { ...group, sampleIds, formattedSamples: formatSampleList(new Set(sampleIds)) };
      })
      .sort((a, b) => {
        if (a.signature.startsWith('__unassigned__')) return 1;
        if (b.signature.startsWith('__unassigned__')) return -1;
        return naturalCompare(a.targetNames.join(' '), b.targetNames.join(' '));
      });

    return {
      sopId,
      sopName: sop.sopName,
      groups,
      uniqueSamples: allSampleIds.size,
      uniqueTargets: allTargetIds.size
    };
  }).sort((a, b) => a.sopName.localeCompare(b.sopName, 'vi'));
}

export function isTrackablePhysicalBatch(request: Request): boolean {
  return APPROVED_BATCH_STATUSES.has(request.status) && !request.isVirtualMaster;
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values.map(value => String(value).trim()).filter(Boolean)));
}
