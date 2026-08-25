import assert from 'node:assert/strict';
import test from 'node:test';
import type { ActivityEvent } from './activity-event.model';
import {
  aggregateActivityFeedEvents,
  buildActivityFeedScopeKey,
  filterActivityFeedEvents,
  getActivityAuditActionLabel,
  getActivityAggregationLabel,
  isActivityEventNewSince,
  mergeActivityFeedEvents,
  parseActivityFeedEvent,
  resolveActivityFeedScope,
  resolveActivityTraceabilityUrl
} from './activity-feed.utils';

function event(overrides: Partial<ActivityEvent> = {}): ActivityEvent {
  return {
    id: 'evt-1', eventId: 'evt-1', schemaVersion: 2,
    action: 'PUBLISH_RESULT_REPORT', module: 'RESULT', audience: 'RESULT_VIEW',
    importance: 'IMPORTANT', auditClass: 'BUSINESS', activityVisible: true,
    actorUid: 'uid-1', actorName: 'Nguyễn A', targetId: 'TARGET-1', targetName: 'SOP Alpha',
    requestId: 'REQ-1', details: 'Xuất bản báo cáo', timestamp: { seconds: 100 }, user: 'Nguyễn A',
    ...overrides
  };
}

test('scope key is stable across audience ordering and changes with uid/audience', () => {
  assert.equal(
    buildActivityFeedScopeKey('uid-1', ['STANDARD_VIEW', 'RESULT_VIEW']),
    buildActivityFeedScopeKey('uid-1', ['RESULT_VIEW', 'STANDARD_VIEW'])
  );
  assert.notEqual(
    buildActivityFeedScopeKey('uid-1', ['RESULT_VIEW']),
    buildActivityFeedScopeKey('uid-2', ['RESULT_VIEW'])
  );
  assert.notEqual(
    buildActivityFeedScopeKey('uid-1', ['RESULT_VIEW']),
    buildActivityFeedScopeKey('uid-1', ['RESULT_OPERATOR'])
  );
});

test('realtime permission changes resolve to a new or denied Activity scope', () => {
  const initial = resolveActivityFeedScope(true, 'uid-1', 'staff', ['sop_view', 'inventory_view']);
  const reduced = resolveActivityFeedScope(true, 'uid-1', 'staff', ['sop_view']);
  const downgraded = resolveActivityFeedScope(true, 'uid-1', 'viewer', ['sop_view', 'inventory_view']);

  assert.ok(initial.audiences.includes('INVENTORY_VIEW'));
  assert.ok(reduced.audiences.includes('RESULT_VIEW'));
  assert.equal(reduced.audiences.includes('INVENTORY_VIEW'), false);
  assert.notEqual(initial.scopeKey, reduced.scopeKey);
  assert.deepEqual(downgraded, { audiences: [], scopeKey: null });
});

test('reader parser fails closed when stored classification disagrees with registry', () => {
  const valid = event();
  assert.ok(parseActivityFeedEvent(valid.id, { ...valid }));
  assert.equal(parseActivityFeedEvent(valid.id, { ...valid, eventId: 'other-event' }), null);
  assert.equal(parseActivityFeedEvent(valid.id, { ...valid, audience: 'SYSTEM_ADMIN' }), null);
  assert.equal(parseActivityFeedEvent(valid.id, { ...valid, action: 'UNKNOWN_ACTION' }), null);
  assert.equal(parseActivityFeedEvent(valid.id, { ...valid, schemaVersion: 1 }), null);
});

test('reader parser rejects external actionUrl and falls back to canonical registry route', () => {
  const parsed = parseActivityFeedEvent('evt-1', { ...event(), actionUrl: 'https://example.com/phish' });
  assert.equal(parsed?.actionUrl, '/results/REQ-1');
});

test('registry labels drive standalone audit labels without duplicating action dictionaries', () => {
  assert.equal(getActivityAuditActionLabel('PUBLISH_RESULT_REPORT'), 'Xuất bản báo cáo');
  assert.equal(getActivityAuditActionLabel('INVENTORY_LOW_STOCK'), 'Có vật tư sắp hết');
  assert.equal(getActivityAuditActionLabel('UNKNOWN_ACTION'), 'Cập nhật');
});

test('traceability route is emitted only for explicitly public request events and encodes IDs', () => {
  assert.equal(
    resolveActivityTraceabilityUrl(event({ publicTraceable: true, requestId: 'REQ/01' })),
    '/traceability/REQ%2F01'
  );
  assert.equal(resolveActivityTraceabilityUrl(event({ publicTraceable: false })), undefined);
  assert.equal(resolveActivityTraceabilityUrl(event({ publicTraceable: true, requestId: '   ' })), undefined);
});

test('merge deduplicates by eventId and keeps newest event before bounding', () => {
  const older = event({ id: 'doc-a', eventId: 'shared', timestamp: { seconds: 10 } });
  const newer = event({ id: 'doc-b', eventId: 'shared', timestamp: { seconds: 20 }, details: 'newer' });
  const other = event({ id: 'doc-c', eventId: 'other', timestamp: { seconds: 15 } });
  const merged = mergeActivityFeedEvents([[older, other], [newer]], 10);
  assert.deepEqual(merged.map(item => item.eventId), ['shared', 'other']);
  assert.equal(merged[0].details, 'newer');
});

test('filter uses module, importance and structured searchable fields before display limit', () => {
  const result = event({ targetName: 'SOP Đặc biệt' });
  const inventory = event({
    id: 'evt-2', eventId: 'evt-2', action: 'STOCK_OUT', module: 'INVENTORY', audience: 'INVENTORY_VIEW',
    importance: 'NORMAL', targetName: 'Methanol', requestId: undefined, details: 'Xuất 2 L'
  });
  const warning = event({
    id: 'evt-3', eventId: 'evt-3', action: 'RESET_RESULT_DATA', audience: 'RESULT_OPERATOR',
    importance: 'WARNING', targetName: 'SOP Beta', details: 'Reset số liệu'
  });

  assert.deepEqual(filterActivityFeedEvents([result, inventory, warning], 'methanol', 'ALL', false).map(e => e.id), ['evt-2']);
  assert.deepEqual(filterActivityFeedEvents([result, inventory, warning], 'đặc biệt', 'RESULT', false).map(e => e.id), ['evt-1']);
  assert.deepEqual(filterActivityFeedEvents([result, inventory, warning], '', 'RESULT', true).map(e => e.id), ['evt-1', 'evt-3']);
});

test('repeated result drafts aggregate only within the configured actor/request window', () => {
  const draft = (id: string, seconds: number, actorUid = 'uid-1', requestId = 'REQ-1') => event({
    id,
    eventId: id,
    action: 'SAVE_RESULT_DRAFT',
    audience: 'RESULT_OPERATOR',
    importance: 'NORMAL',
    actorUid,
    requestId,
    timestamp: { seconds }
  });

  const aggregated = aggregateActivityFeedEvents([
    draft('draft-3', 1_000),
    draft('draft-2', 700),
    draft('draft-1', 500),
    draft('draft-other-user', 490, 'uid-2'),
    draft('draft-other-request', 480, 'uid-1', 'REQ-2')
  ]);

  assert.equal(aggregated.length, 3);
  assert.equal(aggregated[0].aggregationCount, 3);
  assert.deepEqual(aggregated[0].aggregatedEventIds, ['draft-3', 'draft-2', 'draft-1']);
  assert.equal(getActivityAggregationLabel(aggregated[0]), '3 lần');
});

test('aggregation window is anchored to the newest event and destructive events never merge', () => {
  const draft = (id: string, seconds: number) => event({
    id,
    eventId: id,
    action: 'SAVE_RESULT_DRAFT',
    audience: 'RESULT_OPERATOR',
    importance: 'NORMAL',
    timestamp: { seconds }
  });
  const reset = (id: string, seconds: number) => event({
    id,
    eventId: id,
    action: 'RESET_RESULT_DATA',
    audience: 'RESULT_OPERATOR',
    importance: 'WARNING',
    timestamp: { seconds }
  });

  const aggregated = aggregateActivityFeedEvents([
    draft('draft-newest', 1_000),
    draft('draft-within', 500),
    draft('draft-outside', 399),
    reset('reset-2', 300),
    reset('reset-1', 299)
  ]);

  assert.equal(aggregated.length, 4);
  assert.equal(aggregated[0].aggregationCount, 2);
  assert.equal(aggregated[1].aggregationCount, 1);
  assert.equal(aggregated.filter(item => item.action === 'RESET_RESULT_DATA').length, 2);
});

test('malformed timestamps do not crash or accidentally aggregate', () => {
  const malformed = event({
    id: 'draft-bad-1', eventId: 'draft-bad-1', action: 'SAVE_RESULT_DRAFT',
    audience: 'RESULT_OPERATOR', importance: 'NORMAL', timestamp: 'not-a-date'
  });
  const malformed2 = event({
    id: 'draft-bad-2', eventId: 'draft-bad-2', action: 'SAVE_RESULT_DRAFT',
    audience: 'RESULT_OPERATOR', importance: 'NORMAL', timestamp: null
  });

  assert.doesNotThrow(() => aggregateActivityFeedEvents([malformed, malformed2]));
  assert.equal(aggregateActivityFeedEvents([malformed, malformed2]).length, 2);
});

test('filter/search happen before aggregation and the final display limit', () => {
  const drafts = Array.from({ length: 60 }, (_, index) => event({
    id: `draft-${index}`,
    eventId: `draft-${index}`,
    action: 'SAVE_RESULT_DRAFT',
    audience: 'RESULT_OPERATOR',
    importance: 'NORMAL',
    details: index === 0 ? 'needle draft' : 'ordinary draft',
    timestamp: { seconds: 1_000 - index }
  }));

  const filtered = filterActivityFeedEvents(drafts, 'needle', 'RESULT', false, 1);
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, 'draft-0');
  assert.equal(filtered[0].aggregationCount, 1);

  const aggregated = filterActivityFeedEvents(drafts, '', 'RESULT', false, 1);
  assert.equal(aggregated.length, 1);
  assert.equal(aggregated[0].aggregationCount, 60);
});

test('last-seen comparison is independent from notification read state', () => {
  const current = event({ timestamp: { seconds: 200 } });
  assert.equal(isActivityEventNewSince(current, { seconds: 100 }), true);
  assert.equal(isActivityEventNewSince(current, { seconds: 200 }), false);
  assert.equal(isActivityEventNewSince(current, null), false);
  assert.equal(isActivityEventNewSince(event({ timestamp: 'bad' }), { seconds: 100 }), false);
});
