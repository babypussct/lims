import { Request } from '../../core/models/request.model';
import { TargetGroup } from '../../core/models/sop.model';
import { formatSampleList, naturalCompare } from '../../shared/utils/utils';
import { getAssignedTargetsForSample, getCanonicalId, normalizeSampleCode } from '../results/shared/compound-id-resolver';
import {
  buildTargetScopePresentation,
  classifyTargetScope,
  computeTargetSignature
} from '../targets/target-scope-classifier';
import {
  ApprovedBatchOverview,
  ApprovedBatchSample,
  ApprovedBatchStatus,
  DailyBatchAssignmentGroup,
  DailyBatchView
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
      const samples = uniqueSampleCodes(request.sampleList || []).map<ApprovedBatchSample>(sampleId => {
        const assignedTargets = getAssignedTargetsForSample(sampleId, sampleTargetMap);
        const targetIds = uniqueStrings(assignedTargets?.length ? assignedTargets : fallbackTargets);
        return {
          sampleId,
          targetIds,
          targetNames: targetIds.map(targetId => resolveTargetName(request, targetId))
        };
      });
      const uniqueTargetIds = uniqueStrings(samples.length
        ? samples.flatMap(sample => sample.targetIds)
        : fallbackTargets);
      const uniqueTargetNames = uniqueStrings(uniqueTargetIds.map(targetId => resolveTargetName(request, targetId)));

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
        uniqueTargetIds,
        uniqueTargetNames,
        targetAssignments: samples.reduce((total, sample) => total + sample.targetIds.length, 0),
        targetNamesSnapshot: request.targetNames,
        targetScopeSnapshots: request.targetScopeSnapshots
      };
    })
    .sort((a, b) => {
      const timeDifference = (b.approvedAt?.getTime() || 0) - (a.approvedAt?.getTime() || 0);
      return timeDifference || a.sopName.localeCompare(b.sopName, 'vi');
    });
}

export function buildDailyBatchViews(batches: ApprovedBatchOverview[], availableGroups: TargetGroup[] = []): DailyBatchView[] {
  return batches.map(batch => {
    const targetSetMap = new Map<string, DailyBatchAssignmentGroup>();
    const allSampleKeys = new Set<string>();
    const allTargetIds = new Set<string>();

    batch.samples.forEach(sample => {
      const sampleKey = normalizeSampleCode(sample.sampleId);
      if (!sampleKey) return;
      allSampleKeys.add(sampleKey);

      const canonicalTargets = new Map<string, string>();
      sample.targetIds.forEach((targetId, index) => {
        const canonicalId = getCanonicalId(targetId);
        if (canonicalId && !canonicalTargets.has(canonicalId)) {
          canonicalTargets.set(canonicalId, sample.targetNames[index] || targetId);
        }
      });
      const targetEntries = Array.from(canonicalTargets.entries()).sort((a, b) => naturalCompare(a[0], b[0]));
      const targetIds = targetEntries.map(([targetId]) => targetId);
      targetIds.forEach(targetId => allTargetIds.add(targetId));
      const signature = computeTargetSignature(targetIds);

      let group = targetSetMap.get(signature);
      if (!group) {
        const classification = classifyTargetScope({
          assignedTargetIds: targetIds,
          sopId: batch.sopId,
          sopVersion: batch.sopVersion,
          sopTargetSnapshot: batch.targetNamesSnapshot,
          storedSnapshots: batch.targetScopeSnapshots,
          availableGroups
        });
        group = {
          signature,
          targetIds,
          targetNames: targetEntries.map(([, targetName]) => targetName),
          sampleIds: [],
          formattedSamples: '',
          targetScope: buildTargetScopePresentation(targetEntries.map(([, targetName]) => targetName), classification)
        };
        targetSetMap.set(signature, group);
      }
      if (!group.sampleIds.some(existing => normalizeSampleCode(existing) === sampleKey)) {
        group.sampleIds.push(sample.sampleId.trim());
      }
    });

    if (targetSetMap.size === 0) {
      const canonicalTargets = new Map<string, string>();
      batch.uniqueTargetIds.forEach((targetId, index) => {
        const canonicalId = getCanonicalId(targetId);
        if (canonicalId && !canonicalTargets.has(canonicalId)) {
          canonicalTargets.set(canonicalId, batch.uniqueTargetNames[index] || targetId);
        }
      });
      const targetEntries = Array.from(canonicalTargets.entries()).sort((a, b) => naturalCompare(a[0], b[0]));
      targetEntries.forEach(([targetId]) => allTargetIds.add(targetId));
      const targetIds = targetEntries.map(([targetId]) => targetId);
      const targetNames = targetEntries.map(([, targetName]) => targetName);
      const signature = computeTargetSignature(targetIds);
      const classification = classifyTargetScope({
        assignedTargetIds: targetIds,
        sopId: batch.sopId,
        sopVersion: batch.sopVersion,
        sopTargetSnapshot: batch.targetNamesSnapshot,
        storedSnapshots: batch.targetScopeSnapshots,
        availableGroups
      });
      targetSetMap.set(signature, {
        signature,
        targetIds,
        targetNames,
        sampleIds: [],
        formattedSamples: '',
        targetScope: buildTargetScopePresentation(targetNames, classification)
      });
    }

    const groups = Array.from(targetSetMap.values())
      .map(group => {
        const sampleIds = [...group.sampleIds].sort(naturalCompare);
        return { ...group, sampleIds, formattedSamples: formatSampleList(sampleIds) };
      })
      .sort((a, b) => {
        if (a.targetScope.kind === 'unassigned') return 1;
        if (b.targetScope.kind === 'unassigned') return -1;
        return naturalCompare(a.targetNames.join(' '), b.targetNames.join(' '));
      });

    return {
      requestId: batch.requestId,
      sopId: batch.sopId,
      sopName: batch.sopName,
      sopVersion: batch.sopVersion,
      sopRef: batch.sopRef,
      status: batch.status,
      analysisDate: batch.analysisDate,
      approvedAt: batch.approvedAt,
      ownerName: batch.ownerName,
      groups,
      uniqueSamples: allSampleKeys.size,
      uniqueTargets: allTargetIds.size,
      targetAssignments: batch.targetAssignments
    };
  }).sort((a, b) => {
    const timeDifference = (b.approvedAt?.getTime() || 0) - (a.approvedAt?.getTime() || 0);
    return timeDifference || naturalCompare(a.requestId, b.requestId);
  });
}

export function isTrackablePhysicalBatch(request: Request): boolean {
  return APPROVED_BATCH_STATUSES.has(request.status) && !request.isVirtualMaster;
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values.map(value => String(value).trim()).filter(Boolean)));
}

function uniqueSampleCodes(values: string[]): string[] {
  const unique = new Map<string, string>();
  values.forEach(value => {
    const display = String(value).trim();
    const key = normalizeSampleCode(display);
    if (key && !unique.has(key)) unique.set(key, display);
  });
  return Array.from(unique.values());
}
