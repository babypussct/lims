import { Request } from '../../core/models/request.model';
import { TargetGroup } from '../../core/models/sop.model';
import { formatSampleList, naturalCompare } from '../../shared/utils/utils';
import { getAssignedTargetsForSample, getCanonicalId, normalizeSampleCode } from '../results/shared/compound-id-resolver';
import { getSampleDescriptionSnapshot } from '../../shared/utils/sample-description.utils';
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
          targetNames: targetIds.map(targetId => resolveTargetName(request, targetId)),
          description: getSampleDescriptionSnapshot(
            request.sampleDescriptionMap ?? request.inputs?.sampleDescriptionMap,
            sampleId
          )
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
  const sopCards = new Map<string, ApprovedBatchOverview[]>();
  batches.forEach(batch => {
    const key = `${batch.sopId}\u0000${batch.sopVersion ?? 'legacy'}`;
    const current = sopCards.get(key) || [];
    current.push(batch);
    sopCards.set(key, current);
  });

  return Array.from(sopCards.entries()).map(([cardKey, sourceBatches]) => {
    const sortedSources = [...sourceBatches].sort((a, b) =>
      (b.approvedAt?.getTime() || 0) - (a.approvedAt?.getTime() || 0)
      || naturalCompare(a.requestId, b.requestId)
    );
    const representative = sortedSources[0];
    const targetSetMap = new Map<string, DailyBatchAssignmentGroup>();
    const groupSampleMaps = new Map<string, Map<string, {
      sampleId: string;
      descriptions: Map<string, { masterId?: string; nameSnapshot: string }>;
      sourceRequestIds: Set<string>;
    }>>();
    const allSampleKeys = new Set<string>();
    const allTargetIds = new Set<string>();

    const ensureTargetGroup = (
      batch: ApprovedBatchOverview,
      targetIds: string[],
      targetNames: string[]
    ): DailyBatchAssignmentGroup => {
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
          targetNames,
          sampleIds: [],
          formattedSamples: '',
          samples: [],
          formattedDescriptions: '',
          hasDescriptionConflict: false,
          targetScope: buildTargetScopePresentation(targetNames, classification)
        };
        targetSetMap.set(signature, group);
        groupSampleMaps.set(signature, new Map());
      }
      return group;
    };

    sortedSources.forEach(batch => {
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
        const targetNames = targetEntries.map(([, targetName]) => targetName);
        targetIds.forEach(targetId => allTargetIds.add(targetId));
        const group = ensureTargetGroup(batch, targetIds, targetNames);
        const sampleMap = groupSampleMaps.get(group.signature)!;
        const current = sampleMap.get(sampleKey) || {
          sampleId: sample.sampleId.trim(),
          descriptions: new Map<string, { masterId?: string; nameSnapshot: string }>(),
          sourceRequestIds: new Set<string>()
        };
        if (sample.description) {
          current.descriptions.set(normalizeDescription(sample.description.nameSnapshot), sample.description);
        }
        current.sourceRequestIds.add(batch.requestId);
        sampleMap.set(sampleKey, current);
      });

      if (batch.samples.length === 0) {
        const canonicalTargets = new Map<string, string>();
        batch.uniqueTargetIds.forEach((targetId, index) => {
          const canonicalId = getCanonicalId(targetId);
          if (canonicalId && !canonicalTargets.has(canonicalId)) {
            canonicalTargets.set(canonicalId, batch.uniqueTargetNames[index] || targetId);
          }
        });
        const targetEntries = Array.from(canonicalTargets.entries()).sort((a, b) => naturalCompare(a[0], b[0]));
        const targetIds = targetEntries.map(([targetId]) => targetId);
        targetIds.forEach(targetId => allTargetIds.add(targetId));
        ensureTargetGroup(batch, targetIds, targetEntries.map(([, targetName]) => targetName));
      }
    });

    const groups = Array.from(targetSetMap.values()).map(group => {
      const samples = Array.from(groupSampleMaps.get(group.signature)?.values() || [])
        .map(sample => {
          const descriptions = Array.from(sample.descriptions.values());
          return {
            sampleId: sample.sampleId,
            description: descriptions[0],
            descriptionAlternatives: descriptions.length > 1 ? descriptions.map(item => item.nameSnapshot) : undefined,
            sourceRequestIds: Array.from(sample.sourceRequestIds)
          };
        })
        .sort((a, b) => naturalCompare(a.sampleId, b.sampleId));
      const sampleIds = samples.map(sample => sample.sampleId);
      const describedSamples = samples.filter(sample => sample.description);
      return {
        ...group,
        samples,
        sampleIds,
        formattedSamples: formatSampleList(sampleIds),
        formattedDescriptions: describedSamples.map(sample =>
          sample.descriptionAlternatives?.length
            ? `${sample.sampleId} (${sample.descriptionAlternatives.join(' / ')})`
            : `${sample.sampleId} (${sample.description!.nameSnapshot})`
        ).join(' · '),
        hasDescriptionConflict: samples.some(sample => Boolean(sample.descriptionAlternatives?.length))
      };
    }).sort((a, b) => {
      if (a.targetScope.kind === 'unassigned') return 1;
      if (b.targetScope.kind === 'unassigned') return -1;
      return naturalCompare(a.targetNames.join(' '), b.targetNames.join(' '));
    });

    const statusCounts = sortedSources.reduce((counts, batch) => {
      counts[batch.status] += 1;
      return counts;
    }, { approved: 0, draft: 0, completed: 0 });

    return {
      cardKey,
      sopId: representative.sopId,
      sopName: representative.sopName,
      sopVersion: representative.sopVersion,
      sopRef: representative.sopRef,
      analysisDate: representative.analysisDate,
      approvedAt: representative.approvedAt,
      ownerName: representative.ownerName,
      groups,
      sourceBatches: sortedSources.map(batch => ({
        requestId: batch.requestId,
        status: batch.status,
        approvedAt: batch.approvedAt,
        ownerName: batch.ownerName,
        sampleIds: batch.samples.map(sample => sample.sampleId),
        formattedSamples: formatSampleList(batch.samples.map(sample => sample.sampleId))
      })),
      physicalBatchCount: sortedSources.length,
      statusCounts,
      uniqueSamples: allSampleKeys.size,
      uniqueTargets: allTargetIds.size,
      targetAssignments: sortedSources.reduce((total, batch) => total + batch.targetAssignments, 0)
    };
  }).sort((a, b) => {
    const timeDifference = (b.approvedAt?.getTime() || 0) - (a.approvedAt?.getTime() || 0);
    return timeDifference || naturalCompare(a.cardKey, b.cardKey);
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

function normalizeDescription(value: string): string {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}
