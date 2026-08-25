import { getActivityActionDefinition, isRegisteredActivityAction, resolveDefaultActivityActionUrl } from './activity-event-registry';
import type { ActivityAudience, ActivityEvent, ActivityModule, ActivityViewerContext } from './activity-event.model';
import { resolveAllowedActivityAudiences } from './activity-visibility.policy';
import { timestampToMillis } from '../../shared/utils/timestamp';

export type ActivityFeedModuleFilter = 'ALL' | ActivityModule;

export interface ActivityFeedDisplayEvent extends ActivityEvent {
  aggregationCount?: number;
  aggregatedEventIds?: string[];
  aggregationFirstTimestamp?: unknown;
}

export interface ActivityFeedDocumentData {
  [key: string]: unknown;
}

export function buildActivityFeedScopeKey(uid: string, audiences: readonly ActivityAudience[]): string {
  return `${uid}|${[...audiences].sort().join(',')}`;
}

export function resolveActivityFeedScope(
  enabled: boolean,
  uid: string | undefined,
  role: ActivityViewerContext['role'] | undefined,
  permissions: readonly string[]
): { audiences: ActivityAudience[]; scopeKey: string | null } {
  const audiences = uid && role
    ? resolveAllowedActivityAudiences({ role, permissions })
    : [];
  return {
    audiences,
    scopeKey: enabled && uid && audiences.length > 0
      ? buildActivityFeedScopeKey(uid, audiences)
      : null
  };
}

/**
 * Reader-side validation is intentionally stricter than Firestore decoding.
 * Until Rules V2 is deployed, the Activity Feed must not trust a document whose
 * action classification disagrees with the canonical registry.
 */
export function parseActivityFeedEvent(id: string, data: ActivityFeedDocumentData): ActivityEvent | null {
  if (data['schemaVersion'] !== 2) return null;

  const eventId = asRequiredString(data['eventId']);
  const action = asRequiredString(data['action']);
  const actorUid = asRequiredString(data['actorUid']);
  const actorName = asRequiredString(data['actorName']);
  const details = asRequiredString(data['details']);
  if (!eventId || eventId !== id || !action || !actorUid || !actorName || !details || !isRegisteredActivityAction(action)) return null;

  const definition = getActivityActionDefinition(action);
  if (data['module'] !== definition.module
    || data['audience'] !== definition.audience
    || data['importance'] !== definition.importance
    || data['auditClass'] !== definition.auditClass
    || data['activityVisible'] !== definition.activityVisible) {
    return null;
  }

  const event: ActivityEvent = {
    id,
    eventId,
    schemaVersion: 2,
    action,
    module: definition.module,
    audience: definition.audience,
    importance: definition.importance,
    auditClass: definition.auditClass,
    activityVisible: definition.activityVisible,
    actorUid,
    actorName,
    targetType: asOptionalString(data['targetType']),
    targetId: asOptionalString(data['targetId']),
    targetName: asOptionalString(data['targetName']),
    requestId: asOptionalString(data['requestId']),
    actionUrl: safeInternalPath(data['actionUrl']),
    details,
    metadata: asMetadata(data['metadata']),
    timestamp: data['timestamp'],
    lastUpdated: data['lastUpdated'],
    publicTraceable: data['publicTraceable'] === true,
    user: asOptionalString(data['user']) || actorName,
    printable: data['printable'] === true,
    printJobId: asOptionalString(data['printJobId'])
  };

  event.actionUrl ||= safeInternalPath(resolveDefaultActivityActionUrl(event));
  return event;
}

export function mergeActivityFeedEvents(
  audienceEvents: Iterable<readonly ActivityEvent[]>,
  maxItems = 500
): ActivityEvent[] {
  const deduped = new Map<string, ActivityEvent>();
  for (const events of audienceEvents) {
    for (const event of events) {
      const key = event.eventId || event.id;
      const previous = deduped.get(key);
      if (!previous || eventTime(event) >= eventTime(previous)) deduped.set(key, event);
    }
  }

  return [...deduped.values()]
    .sort((a, b) => eventTime(b) - eventTime(a) || a.eventId.localeCompare(b.eventId))
    .slice(0, maxItems);
}

export function filterActivityFeedEvents(
  events: readonly ActivityEvent[],
  searchTerm: string,
  moduleFilter: ActivityFeedModuleFilter,
  importantOnly: boolean,
  maxItems = 50
): ActivityFeedDisplayEvent[] {
  const term = normalizeSearch(searchTerm);
  const filtered = events
    .filter(event => moduleFilter === 'ALL' || event.module === moduleFilter)
    .filter(event => !importantOnly || event.importance !== 'NORMAL')
    .filter(event => {
      if (!term) return true;
      const definition = getActivityActionDefinition(event.action);
      return [
        event.actorName,
        event.targetName,
        event.targetId,
        event.requestId,
        definition.label,
        event.details
      ].some(value => normalizeSearch(value).includes(term));
    });

  return aggregateActivityFeedEvents(filtered).slice(0, maxItems);
}

/**
 * Dashboard-only noise reduction. Canonical events are never mutated or
 * deleted; Audit readers continue to consume every underlying document.
 */
export function aggregateActivityFeedEvents(events: readonly ActivityEvent[]): ActivityFeedDisplayEvent[] {
  const result: ActivityFeedDisplayEvent[] = [];
  const openGroups = new Map<string, { index: number; newestMs: number }>();

  for (const event of events) {
    const definition = getActivityActionDefinition(event.action);
    const aggregation = definition.aggregation;
    const timestampMs = eventTime(event);
    const groupKey = aggregation?.enabled
      ? buildAggregationKey(event, aggregation.keyParts || [])
      : null;
    const windowMs = aggregation?.windowMs ?? 0;

    if (!groupKey || timestampMs <= 0 || windowMs <= 0) {
      result.push({ ...event });
      continue;
    }

    const open = openGroups.get(groupKey);
    if (open && open.newestMs - timestampMs >= 0 && open.newestMs - timestampMs <= windowMs) {
      const aggregate = result[open.index];
      aggregate.aggregationCount = (aggregate.aggregationCount || 1) + 1;
      aggregate.aggregatedEventIds = [...(aggregate.aggregatedEventIds || [aggregate.eventId]), event.eventId];
      aggregate.aggregationFirstTimestamp = event.timestamp;
      continue;
    }

    const index = result.length;
    result.push({
      ...event,
      aggregationCount: 1,
      aggregatedEventIds: [event.eventId],
      aggregationFirstTimestamp: event.timestamp
    });
    openGroups.set(groupKey, { index, newestMs: timestampMs });
  }

  return result;
}

export function getActivityAggregationLabel(event: ActivityFeedDisplayEvent): string {
  const count = event.aggregationCount || 1;
  return count > 1 ? `${count} lần` : '';
}

export function isActivityEventNewSince(event: ActivityEvent, lastSeenAt: unknown): boolean {
  const lastSeenMs = timestampToMillis(lastSeenAt);
  const eventMs = eventTime(event);
  return lastSeenMs !== null && eventMs > 0 && eventMs > lastSeenMs;
}

export function getActivityModuleLabel(module: ActivityModule): string {
  if (module === 'RESULT') return 'Kết quả';
  if (module === 'INVENTORY') return 'Kho';
  if (module === 'STANDARD') return 'Chuẩn';
  return 'Hệ thống';
}

export function getActivityActionLabel(action: string): string {
  return isRegisteredActivityAction(action)
    ? getActivityActionDefinition(action).label
    : 'đã cập nhật';
}

/**
 * Audit/Statistics needs a compact standalone label rather than the
 * actor-relative sentence fragment used by the Activity Feed. Keep the source
 * wording in the registry and derive the presentation form here so surfaces do
 * not maintain duplicate action dictionaries.
 */
export function getActivityAuditActionLabel(action: string): string {
  const actorRelativeLabel = getActivityActionLabel(action).trim();
  const standaloneLabel = actorRelativeLabel.replace(/^đã\s+/iu, '').trim() || 'cập nhật';
  return standaloneLabel.charAt(0).toLocaleUpperCase('vi-VN') + standaloneLabel.slice(1);
}

/**
 * Public traceability is a separate navigation projection from the primary
 * actionUrl. Only events explicitly marked publicTraceable and tied to a
 * request may expose this route.
 */
export function resolveActivityTraceabilityUrl(
  event: Pick<ActivityEvent, 'publicTraceable' | 'requestId'>
): string | undefined {
  const requestId = typeof event.requestId === 'string' ? event.requestId.trim() : '';
  if (event.publicTraceable !== true || !requestId) return undefined;
  return `/traceability/${encodeURIComponent(requestId)}`;
}

function eventTime(event: ActivityEvent): number {
  return timestampToMillis(event.timestamp) ?? timestampToMillis(event.lastUpdated) ?? 0;
}

function buildAggregationKey(
  event: ActivityEvent,
  keyParts: readonly ('actorUid' | 'targetId' | 'requestId' | 'action')[]
): string | null {
  if (keyParts.length === 0) return null;
  const values = keyParts.map(part => event[part]);
  if (values.some(value => typeof value !== 'string' || value.length === 0)) return null;
  return values.map(value => String(value)).join('\u001f');
}

function normalizeSearch(value: unknown): string {
  return String(value ?? '').trim().toLocaleLowerCase('vi-VN');
}

function asRequiredString(value: unknown): string | undefined {
  return asOptionalString(value);
}

function asOptionalString(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;
  const normalized = String(value).trim();
  return normalized || undefined;
}

function safeInternalPath(value: unknown): string | undefined {
  const path = asOptionalString(value);
  if (!path || !path.startsWith('/') || path.startsWith('//')) return undefined;
  return path;
}

function asMetadata(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  return value as Record<string, unknown>;
}
