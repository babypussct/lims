import {
  canBePublicTraceableActivityAction,
  getActivityActionDefinition,
  isRegisteredActivityAction,
  resolveDefaultActivityActionUrl
} from '../src/app/core/activity/activity-event-registry';
import type { ActivityEvent } from '../src/app/core/activity/activity-event.model';

export interface LegacyUserProfile {
  uid: string;
  displayName?: string;
  email?: string;
}

export interface ActorIndex {
  byUid: Map<string, LegacyUserProfile>;
  byEmail: Map<string, LegacyUserProfile[]>;
  byDisplayName: Map<string, LegacyUserProfile[]>;
}

export type ActorResolution =
  | { status: 'RESOLVED'; uid: string; actorName: string; matchedBy: 'uid' | 'email' | 'displayName' | 'legacyAlias' }
  | { status: 'UNRESOLVED'; legacyUser: string; reason: 'empty' | 'not-found' | 'ambiguous' };

export type LegacyActorAliasMap = ReadonlyMap<string, string>;

export interface ActivityBackfillResult {
  status: 'ALREADY_V2' | 'MIGRATABLE' | 'INVALID_V2' | 'UNKNOWN_ACTION' | 'UNRESOLVED_ACTOR';
  patch?: Record<string, unknown>;
  action?: string;
  actor?: ActorResolution;
  reason?: string;
  missingTarget?: boolean;
  publicTraceableCandidate?: boolean;
}

export function buildActorIndex(users: readonly LegacyUserProfile[]): ActorIndex {
  const byUid = new Map<string, LegacyUserProfile>();
  const byEmail = new Map<string, LegacyUserProfile[]>();
  const byDisplayName = new Map<string, LegacyUserProfile[]>();
  for (const user of users) {
    if (!user.uid) continue;
    byUid.set(user.uid, user);
    addIndexValue(byEmail, normalizeIdentity(user.email), user);
    addIndexValue(byDisplayName, normalizeIdentity(user.displayName), user);
  }
  return { byUid, byEmail, byDisplayName };
}

export function buildLegacyActorAliasMap(entries: Record<string, unknown>): Map<string, string> {
  const aliases = new Map<string, string>();
  for (const [legacyIdentity, targetIdentity] of Object.entries(entries)) {
    const legacyKey = normalizeIdentity(legacyIdentity);
    const target = asOptionalString(targetIdentity);
    if (!legacyKey || !target) {
      throw new Error('Legacy actor alias entries require non-empty legacy and target identities.');
    }
    const previousTarget = aliases.get(legacyKey);
    if (previousTarget && previousTarget !== target) {
      throw new Error(`Conflicting legacy actor aliases for ${legacyIdentity}.`);
    }
    aliases.set(legacyKey, target);
  }
  return aliases;
}

export function resolveLegacyActor(
  legacyUser: unknown,
  index: ActorIndex,
  aliases: LegacyActorAliasMap = new Map()
): ActorResolution {
  const raw = String(legacyUser ?? '').trim();
  if (!raw) return { status: 'UNRESOLVED', legacyUser: '', reason: 'empty' };

  const aliasTarget = aliases.get(normalizeIdentity(raw));
  if (aliasTarget) {
    const aliasMatch = resolveLegacyActor(aliasTarget, index);
    if (aliasMatch.status === 'RESOLVED') {
      return { ...aliasMatch, matchedBy: 'legacyAlias' };
    }
    return { status: 'UNRESOLVED', legacyUser: raw, reason: aliasMatch.reason };
  }

  const uidMatch = index.byUid.get(raw);
  if (uidMatch) return resolved(uidMatch, 'uid', raw);

  const normalized = normalizeIdentity(raw);
  const emailMatches = normalized ? index.byEmail.get(normalized) || [] : [];
  if (emailMatches.length === 1) return resolved(emailMatches[0], 'email', raw);
  if (emailMatches.length > 1) return { status: 'UNRESOLVED', legacyUser: raw, reason: 'ambiguous' };

  const displayMatches = normalized ? index.byDisplayName.get(normalized) || [] : [];
  if (displayMatches.length === 1) return resolved(displayMatches[0], 'displayName', raw);
  if (displayMatches.length > 1) return { status: 'UNRESOLVED', legacyUser: raw, reason: 'ambiguous' };
  return { status: 'UNRESOLVED', legacyUser: raw, reason: 'not-found' };
}

export function classifyLegacyActivity(
  id: string,
  data: Record<string, unknown>,
  actorIndex: ActorIndex,
  aliases: LegacyActorAliasMap = new Map()
): ActivityBackfillResult {
  const action = String(data['action'] ?? '').trim();
  if (isCanonicalV2(id, data)) return { status: 'ALREADY_V2', action };
  if (hasV2Marker(id, data)) {
    return {
      status: 'INVALID_V2',
      action,
      reason: invalidCanonicalV2Reason(id, data)
    };
  }
  if (!isRegisteredActivityAction(action)) return { status: 'UNKNOWN_ACTION', action };

  const actor = resolveLegacyActor(data['actorUid'] || data['user'], actorIndex, aliases);
  if (actor.status !== 'RESOLVED') {
    return { status: 'UNRESOLVED_ACTOR', action, actor };
  }

  const definition = getActivityActionDefinition(action);
  const targetId = asOptionalString(data['targetId']);
  const requestId = asOptionalString(data['requestId']);
  const inferredTarget = inferLegacyTarget(definition.module, targetId, requestId);
  const publicTraceable = isPublicTraceableCandidate(id, action, data, requestId);
  // Normalize attribution to the resolved profile. Retaining a stale or
  // forged legacy display name would violate the canonical identity contract
  // and could reintroduce display-name ownership after migration.
  const actorName = actor.actorName;

  const eventForUrl = {
    id,
    eventId: id,
    schemaVersion: 2,
    action,
    module: definition.module,
    audience: definition.audience,
    importance: definition.importance,
    auditClass: definition.auditClass,
    activityVisible: definition.activityVisible,
    actorUid: actor.uid,
    actorName,
    targetType: asOptionalString(data['targetType']) || inferredTarget.targetType,
    targetId: inferredTarget.targetId,
    targetName: asOptionalString(data['targetName']),
    requestId,
    details: String(data['details'] ?? ''),
    timestamp: data['timestamp'],
    lastUpdated: data['lastUpdated'],
    publicTraceable,
    user: actorName,
    printable: data['printable'] === true,
    printJobId: asOptionalString(data['printJobId'])
  } satisfies ActivityEvent;

  const patch: Record<string, unknown> = {
    id,
    eventId: id,
    schemaVersion: 2,
    module: definition.module,
    audience: definition.audience,
    importance: definition.importance,
    auditClass: definition.auditClass,
    activityVisible: definition.activityVisible,
    actorUid: actor.uid,
    actorName,
    user: actorName,
    publicTraceable
  };
  if (!asOptionalString(data['targetType']) && inferredTarget.targetType) patch['targetType'] = inferredTarget.targetType;
  if (!targetId && inferredTarget.targetId) patch['targetId'] = inferredTarget.targetId;
  const legacyActionUrl = asOptionalString(data['actionUrl']);
  const actionUrl = isSafeInternalPath(legacyActionUrl)
    ? legacyActionUrl
    : resolveDefaultActivityActionUrl(eventForUrl);
  if (actionUrl && actionUrl !== legacyActionUrl) patch['actionUrl'] = actionUrl;

  return {
    status: 'MIGRATABLE',
    action,
    actor,
    patch,
    missingTarget: !inferredTarget.targetId && !requestId,
    publicTraceableCandidate: publicTraceable
  };
}

export function isCanonicalV2(id: string, data: Record<string, unknown>): boolean {
  const action = asOptionalString(data['action']);
  if (!action || !isRegisteredActivityAction(action)) return false;
  const definition = getActivityActionDefinition(action);
  return data['schemaVersion'] === 2
    && data['id'] === id
    && data['eventId'] === id
    && typeof data['actorUid'] === 'string'
    && Boolean(String(data['actorUid']).trim())
    && typeof data['actorName'] === 'string' && Boolean(String(data['actorName']).trim())
    && data['user'] === data['actorName']
    && data['module'] === definition.module
    && data['audience'] === definition.audience
    && data['importance'] === definition.importance
    && data['auditClass'] === definition.auditClass
    && data['activityVisible'] === definition.activityVisible
    && typeof data['details'] === 'string' && Boolean(String(data['details']).trim())
    && Object.prototype.hasOwnProperty.call(data, 'timestamp')
    && typeof data['publicTraceable'] === 'boolean';
}

function hasV2Marker(id: string, data: Record<string, unknown>): boolean {
  return data['schemaVersion'] === 2 || data['eventId'] === id;
}

function invalidCanonicalV2Reason(id: string, data: Record<string, unknown>): string {
  const action = asOptionalString(data['action']);
  if (!action || !isRegisteredActivityAction(action)) return 'UNKNOWN_ACTION';
  const definition = getActivityActionDefinition(action);
  if (data['id'] !== id || data['eventId'] !== id) return 'EVENT_ID_MISMATCH';
  if (data['module'] !== definition.module || data['audience'] !== definition.audience
    || data['importance'] !== definition.importance || data['auditClass'] !== definition.auditClass
    || data['activityVisible'] !== definition.activityVisible) return 'CLASSIFICATION_MISMATCH';
  if (typeof data['actorUid'] !== 'string' || !String(data['actorUid']).trim()) return 'ACTOR_UID_MISSING';
  if (typeof data['actorName'] !== 'string' || !String(data['actorName']).trim()
    || data['user'] !== data['actorName']) return 'ACTOR_NAME_MISMATCH';
  if (typeof data['details'] !== 'string' || !String(data['details']).trim()) return 'DETAILS_MISSING';
  if (!Object.prototype.hasOwnProperty.call(data, 'timestamp')) return 'TIMESTAMP_MISSING';
  if (typeof data['publicTraceable'] !== 'boolean') return 'PUBLIC_TRACEABLE_MISSING';
  return 'INVALID_V2_SCHEMA';
}

function isPublicTraceableCandidate(
  id: string,
  action: string,
  data: Record<string, unknown>,
  requestId?: string
): boolean {
  if (!canBePublicTraceableActivityAction(action)) return false;
  if (!requestId) return false;
  return id.startsWith('TRC-') || data['publicTraceable'] === true;
}

function inferLegacyTarget(
  module: 'RESULT' | 'INVENTORY' | 'STANDARD' | 'SYSTEM',
  targetId?: string,
  requestId?: string
): { targetType?: string; targetId?: string } {
  if (module === 'RESULT') return { targetType: 'REQUEST', targetId: requestId || targetId };
  if (module === 'INVENTORY') return { targetType: 'INVENTORY_ITEM', targetId };
  if (module === 'STANDARD') return { targetType: 'STANDARD', targetId };
  if (module === 'SYSTEM') return { targetType: 'SYSTEM', targetId };
  return {};
}

function resolved(
  user: LegacyUserProfile,
  matchedBy: 'uid' | 'email' | 'displayName',
  fallbackName: string
): ActorResolution {
  return {
    status: 'RESOLVED',
    uid: user.uid,
    actorName: user.displayName?.trim() || user.email?.trim() || fallbackName || user.uid,
    matchedBy
  };
}

function normalizeIdentity(value: unknown): string {
  return String(value ?? '').trim().toLocaleLowerCase('vi-VN');
}

function addIndexValue(
  index: Map<string, LegacyUserProfile[]>,
  key: string,
  user: LegacyUserProfile
): void {
  if (!key) return;
  const values = index.get(key) || [];
  values.push(user);
  index.set(key, values);
}

function asOptionalString(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;
  const normalized = String(value).trim();
  return normalized || undefined;
}

function isSafeInternalPath(value: string | undefined): value is string {
  return Boolean(value && value.startsWith('/') && !value.startsWith('//'));
}
