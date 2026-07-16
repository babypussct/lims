import { TargetScopeKind, TargetScopeSnapshot, TargetScopeTraceability } from '../../core/models/request.model';
import { SopTarget, TargetGroup } from '../../core/models/sop.model';
import { getCanonicalId } from '../results/shared/compound-id-resolver';

export interface TargetScopeClassification {
  signature: string;
  kind: TargetScopeKind;
  assignedTargetIds: string[];
  sourceId?: string;
  sourceName?: string;
  sourceRevision?: string;
  sourceTargetIds?: string[];
  sopId: string;
  sopVersion?: number;
  capturedAt?: string;
  traceability: TargetScopeTraceability;
}

export interface TargetScopePresentation {
  kind: TargetScopeKind;
  compact: boolean;
  headline: string;
  detailLabel: string;
  targetCount: number;
  targetNames: string[];
  traceability: TargetScopeTraceability;
}

export interface ClassifyTargetScopeOptions {
  assignedTargetIds: readonly string[];
  sopId: string;
  sopVersion?: number;
  sopTargetSnapshot?: Readonly<Record<string, string>> | readonly SopTarget[];
  storedSnapshots?: readonly TargetScopeSnapshot[];
  availableGroups?: readonly TargetGroup[];
}

export interface BuildTargetScopeSnapshotsOptions {
  sampleTargetMap?: Readonly<Record<string, readonly string[]>>;
  fallbackTargetIds?: readonly string[];
  sopId: string;
  sopVersion?: number;
  sopTargetSnapshot?: Readonly<Record<string, string>> | readonly SopTarget[];
  availableGroups?: readonly TargetGroup[];
  explicitGroupId?: string;
  capturedAt?: string;
}

export function canonicalizeTargetIds(targetIds: readonly string[] | undefined): string[] {
  return [...new Set((targetIds || []).map(id => getCanonicalId(id)).filter(Boolean))].sort();
}

/** Collision-free, deterministic signature for an unordered target set. */
export function computeTargetSignature(targetIds: readonly string[] | undefined): string {
  const ids = canonicalizeTargetIds(targetIds);
  return `v1:${ids.map(id => `${id.length}:${id}`).join('')}`;
}

export function computeTargetGroupRevision(group: TargetGroup): string {
  return `v1:${group.id.length}:${group.id}:${computeTargetSignature(group.targets.map(target => target.id || target.name))}`;
}

function snapshotTargetIds(snapshot?: Readonly<Record<string, string>> | readonly SopTarget[]): string[] {
  if (!snapshot) return [];
  if (Array.isArray(snapshot)) {
    return canonicalizeTargetIds(snapshot.map(target => target.id || target.name));
  }
  return canonicalizeTargetIds(Object.keys(snapshot));
}

function groupTargetIds(group: TargetGroup): string[] {
  return canonicalizeTargetIds(group.targets.map(target => target.id || target.name));
}

function sameTargetSet(left: readonly string[], right: readonly string[]): boolean {
  return computeTargetSignature(left) === computeTargetSignature(right);
}

function fromStoredSnapshot(snapshot: TargetScopeSnapshot): TargetScopeClassification {
  return {
    ...snapshot,
    assignedTargetIds: canonicalizeTargetIds(snapshot.assignedTargetIds),
    sourceTargetIds: snapshot.sourceTargetIds ? canonicalizeTargetIds(snapshot.sourceTargetIds) : undefined,
    traceability: 'snapshot'
  };
}

export function classifyTargetScope(options: ClassifyTargetScopeOptions): TargetScopeClassification {
  const assignedTargetIds = canonicalizeTargetIds(options.assignedTargetIds);
  const signature = computeTargetSignature(assignedTargetIds);
  const stored = options.storedSnapshots?.find(item => item.signature === signature);
  if (stored) return fromStoredSnapshot(stored);

  const base = {
    signature,
    assignedTargetIds,
    sopId: options.sopId,
    sopVersion: options.sopVersion
  };
  if (!assignedTargetIds.length) {
    return { ...base, kind: 'unassigned', traceability: 'legacy-derived' };
  }

  const sopTargetIds = snapshotTargetIds(options.sopTargetSnapshot);
  if (sopTargetIds.length && sameTargetSet(assignedTargetIds, sopTargetIds)) {
    return {
      ...base,
      kind: 'sop-all',
      sourceId: options.sopId,
      sourceName: `SOP${options.sopVersion ? ` v${options.sopVersion}` : ''}`,
      sourceTargetIds: sopTargetIds,
      traceability: 'legacy-derived'
    };
  }

  const matchingGroups = (options.availableGroups || []).filter(group => {
    const ids = groupTargetIds(group);
    return ids.length > 0 && sameTargetSet(assignedTargetIds, ids);
  });
  if (matchingGroups.length === 1) {
    const group = matchingGroups[0];
    return {
      ...base,
      kind: 'target-group',
      sourceId: group.id,
      sourceName: group.name,
      sourceRevision: computeTargetGroupRevision(group),
      sourceTargetIds: groupTargetIds(group),
      traceability: 'current-config'
    };
  }
  if (matchingGroups.length > 1) {
    return { ...base, kind: 'ambiguous', traceability: 'current-config' };
  }
  return { ...base, kind: 'manual', traceability: 'legacy-derived' };
}

export function buildTargetScopeSnapshots(options: BuildTargetScopeSnapshotsOptions): TargetScopeSnapshot[] {
  const sets = Object.values(options.sampleTargetMap || {});
  if (!sets.length && options.fallbackTargetIds) sets.push(options.fallbackTargetIds);

  const uniqueSets = new Map<string, string[]>();
  for (const targetIds of sets) {
    const canonicalIds = canonicalizeTargetIds(targetIds);
    uniqueSets.set(computeTargetSignature(canonicalIds), canonicalIds);
  }

  const explicitGroup = options.explicitGroupId
    ? options.availableGroups?.find(group => group.id === options.explicitGroupId)
    : undefined;
  const capturedAt = options.capturedAt || new Date().toISOString();

  return [...uniqueSets.values()].map(assignedTargetIds => {
    let classification: TargetScopeClassification;
    const explicitIds = explicitGroup ? groupTargetIds(explicitGroup) : [];
    if (explicitGroup && explicitIds.length && sameTargetSet(assignedTargetIds, explicitIds)) {
      classification = {
        signature: computeTargetSignature(assignedTargetIds),
        kind: 'target-group',
        assignedTargetIds,
        sourceId: explicitGroup.id,
        sourceName: explicitGroup.name,
        sourceRevision: computeTargetGroupRevision(explicitGroup),
        sourceTargetIds: explicitIds,
        sopId: options.sopId,
        sopVersion: options.sopVersion,
        traceability: 'snapshot'
      };
    } else {
      classification = classifyTargetScope({
        assignedTargetIds,
        sopId: options.sopId,
        sopVersion: options.sopVersion,
        sopTargetSnapshot: options.sopTargetSnapshot,
        availableGroups: options.availableGroups
      });
    }
    return { ...classification, capturedAt, traceability: 'snapshot' };
  });
}

export function buildTargetScopePresentation(
  targetNames: readonly string[],
  scope: Pick<TargetScopeClassification, 'kind' | 'sourceName' | 'sopVersion' | 'traceability'>
): TargetScopePresentation {
  const targetCount = targetNames.length;
  const compact = scope.kind === 'sop-all' || scope.kind === 'target-group';
  let headline = 'Chỉ tiêu tùy chọn';
  if (scope.kind === 'sop-all') headline = `Toàn bộ chỉ tiêu SOP${scope.sopVersion ? ` v${scope.sopVersion}` : ''}`;
  if (scope.kind === 'target-group') headline = `Bộ chỉ tiêu: ${scope.sourceName || 'Không xác định'}`;
  if (scope.kind === 'unassigned') headline = 'Chưa xác định chỉ tiêu';
  return {
    kind: scope.kind,
    compact,
    headline,
    detailLabel: `${targetCount} chỉ tiêu`,
    targetCount,
    targetNames: [...targetNames],
    traceability: scope.traceability
  };
}

export function getTargetScopeDisplayText(presentation: TargetScopePresentation): string {
  return presentation.compact
    ? `${presentation.headline} (${presentation.detailLabel})`
    : presentation.targetNames.join('; ');
}
