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
  DailySampleDisplayRun,
  DailySampleView,
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
        // Daily checklist/print should reflect the current "Quản lý nhóm chỉ tiêu"
        // configuration whenever exactly one configured group matches this target set.
        // Resolve that match before falling back to immutable snapshots or full-SOP scope.
        const currentGroupMatch = classifyTargetScope({
          assignedTargetIds: targetIds,
          sopId: batch.sopId,
          sopVersion: batch.sopVersion,
          availableGroups
        });
        const classification = currentGroupMatch.kind === 'target-group'
          ? currentGroupMatch
          : classifyTargetScope({
          assignedTargetIds: targetIds,
          sopId: batch.sopId,
          sopVersion: batch.sopVersion,
          sopTargetSnapshot: batch.targetNamesSnapshot,
          storedSnapshots: batch.targetScopeSnapshots,
          availableGroups
        });
        const targetScope = buildTargetScopePresentation(targetNames, classification);
        // Even a one-target configured group should print by group name when it is
        // an exact match; this keeps the printed column aligned with group management.
        if (classification.kind === 'target-group') targetScope.compact = true;
        const printTargetScope = buildDailyPrintTargetScope(
          targetIds,
          targetNames,
          availableGroups,
          targetScope
        );
        group = {
          signature,
          targetIds,
          targetNames,
          sampleIds: [],
          formattedSamples: '',
          samples: [],
          formattedSampleDetails: '',
          sampleDisplayRuns: [],
          formattedSampleDisplay: '',
          hasSampleDescriptions: false,
          hasDescriptionConflict: false,
          targetScope,
          printTargetScope
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
        .sort((a, b) => compareDailySampleIds(a.sampleId, b.sampleId));
      const sampleIds = samples.map(sample => sample.sampleId);
      const describedSamples = samples.filter(sample => sample.description);
      const sampleDisplayRuns = buildSampleDisplayRuns(samples);
      return {
        ...group,
        samples,
        sampleIds,
        formattedSamples: formatSampleList(sampleIds, { prefixFirst: true }),
        formattedSampleDetails: formatDailySampleDetails(samples),
        sampleDisplayRuns,
        formattedSampleDisplay: formatSampleDisplayRuns(sampleDisplayRuns),
        hasSampleDescriptions: describedSamples.length > 0,
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
        sampleIds: batch.samples.map(sample => sample.sampleId).sort(compareDailySampleIds),
        formattedSamples: formatSampleList(batch.samples.map(sample => sample.sampleId), { prefixFirst: true })
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

function buildDailyPrintTargetScope(
  targetIds: string[],
  targetNames: string[],
  availableGroups: TargetGroup[],
  fallback: DailyBatchAssignmentGroup['targetScope']
): DailyBatchAssignmentGroup['printTargetScope'] {
  const partialGroupMinSize = 10;
  const partialGroupMaxMissing = 4; // "thiếu < 5 chỉ tiêu"
  const partialGroupMinCoverage = 0.8;
  const assignedIds = [...new Set(targetIds.map(getCanonicalId).filter(Boolean))];
  if (!assignedIds.length || !availableGroups.length) return fallback;

  const assignedSet = new Set(assignedIds);
  interface PrintGroupCandidate {
    name: string;
    ids: string[];
    presentIds: string[];
    missingNames: string[];
  }
  const candidateBuckets = new Map<string, PrintGroupCandidate[]>();

  for (const configuredGroup of availableGroups) {
    const displayNameById = new Map<string, string>();
    configuredGroup.targets.forEach(target => {
      const displayName = String(target.name || target.id || '').trim();
      const id = getCanonicalId(displayName);
      if (id && !displayNameById.has(id)) displayNameById.set(id, displayName);
    });
    const ids = [...displayNameById.keys()].sort();
    if (!ids.length) continue;

    const presentIds = ids.filter(id => assignedSet.has(id));
    const missingIds = ids.filter(id => !assignedSet.has(id));
    const exactMatch = missingIds.length === 0;
    const partialMatch = ids.length >= partialGroupMinSize
      && missingIds.length > 0
      && missingIds.length <= partialGroupMaxMissing
      && presentIds.length / ids.length >= partialGroupMinCoverage;
    if (!exactMatch && !partialMatch) continue;

    const signature = computeTargetSignature(ids);
    const bucket = candidateBuckets.get(signature) || [];
    bucket.push({
      name: configuredGroup.name,
      ids,
      presentIds,
      missingNames: missingIds.map(id => displayNameById.get(id) || id)
    });
    candidateBuckets.set(signature, bucket);
  }

  // If two configured groups represent the exact same target set, do not guess
  // which label should be printed. Keep only unambiguous configured sets.
  const uniqueCandidates = [...candidateBuckets.values()]
    .filter(bucket => bucket.length === 1)
    .map(bucket => bucket[0]);
  if (!uniqueCandidates.length) return fallback;

  // Remove redundant groups whose assigned portion is a strict subset of another
  // matched group. This also works for near-complete large groups.
  // Example: "10 chỉ tiêu TTS" is fully contained in "Nhóm Chlor" for L9308,
  // so printing both would duplicate the same assigned targets.
  const maximalCandidates = uniqueCandidates.filter(candidate =>
    !uniqueCandidates.some(other =>
      other !== candidate
      && other.presentIds.length > candidate.presentIds.length
      && candidate.presentIds.every(id => other.presentIds.includes(id))
    )
  ).sort((a, b) => b.presentIds.length - a.presentIds.length || naturalCompare(a.name, b.name));

  if (!maximalCandidates.length) return fallback;

  const coveredIds = new Set(maximalCandidates.flatMap(candidate => candidate.presentIds));
  const residualCount = assignedIds.filter(id => !coveredIds.has(id)).length;
  const matchedCount = assignedIds.length - residualCount;
  const headline = `Bộ chỉ tiêu: ${maximalCandidates.map(candidate =>
    candidate.missingNames.length
      ? `${candidate.name} ${candidate.presentIds.length}/${candidate.ids.length}`
      : candidate.name
  ).join(' · ')}`;
  const partialDetails = maximalCandidates
    .filter(candidate => candidate.missingNames.length > 0)
    .map(candidate => `Thiếu ${candidate.name}: ${candidate.missingNames.join(', ')}`);
  const detailParts = [
    ...partialDetails,
    residualCount > 0
      ? `${matchedCount} chỉ tiêu theo bộ · +${residualCount} chỉ tiêu khác`
      : `${assignedIds.length} chỉ tiêu`
  ];
  const detailLabel = detailParts.join(' · ');

  return {
    kind: 'target-group',
    compact: true,
    headline,
    detailLabel,
    targetCount: targetNames.length,
    targetNames: [...targetNames],
    traceability: 'current-config'
  };
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

function compareDailySampleIds(a: string, b: string): number {
  const aHasPrefix = /^[a-zA-Z]/.test(String(a || '').trim());
  const bHasPrefix = /^[a-zA-Z]/.test(String(b || '').trim());
  if (aHasPrefix !== bHasPrefix) return aHasPrefix ? -1 : 1;
  return naturalCompare(a, b);
}

function formatDailySampleDetails(samples: DailyBatchAssignmentGroup['samples']): string {
  return samples.map(sample => {
    const description = sample.descriptionAlternatives?.length
      ? sample.descriptionAlternatives.join(' / ')
      : sample.description?.nameSnapshot?.trim();
    return description ? `${sample.sampleId} (${description})` : sample.sampleId;
  }).join('; ');
}

function buildSampleDisplayRuns(samples: DailySampleView[]): DailySampleDisplayRun[] {
  const runs: DailySampleDisplayRun[] = [];

  samples.forEach(sample => {
    const hasDescriptionConflict = Boolean(sample.descriptionAlternatives?.length);
    const descriptionKey = normalizeDescription(sample.description?.nameSnapshot || '');
    const previousRun = runs[runs.length - 1];
    const previousDescriptionKey = normalizeDescription(previousRun?.description?.nameSnapshot || '');
    const canAppend = Boolean(previousRun)
      && !hasDescriptionConflict
      && !previousRun.hasDescriptionConflict
      && previousDescriptionKey === descriptionKey;

    if (canAppend) {
      previousRun.sampleIds.push(sample.sampleId);
      previousRun.formattedSamples = formatSampleList(previousRun.sampleIds, { prefixFirst: true });
      return;
    }

    runs.push({
      sampleIds: [sample.sampleId],
      formattedSamples: sample.sampleId,
      description: sample.description,
      descriptionAlternatives: sample.descriptionAlternatives,
      hasDescriptionConflict
    });
  });

  return runs;
}

function formatSampleDisplayRuns(runs: DailySampleDisplayRun[]): string {
  return runs.map(run => {
    const description = run.description?.nameSnapshot?.trim();
    return description ? `${run.formattedSamples} (${description})` : run.formattedSamples;
  }).join('; ');
}
