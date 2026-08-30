import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  ACTIVITY_ACTION_REGISTRY,
  canBePublicTraceableActivityAction,
  getActivityActionDefinition,
  isRegisteredActivityAction,
  resolveDefaultActivityActionUrl
} from './activity-event-registry';
import type { ActivityEvent } from './activity-event.model';

const writerFiles = [
  'src/app/core/services/state.service.ts',
  'src/app/features/inventory/inventory.service.ts',
  'src/app/features/results/result-list.component.ts',
  'src/app/features/results/services/result.service.ts',
  'src/app/features/standards/services/standard-crud.service.ts',
  'src/app/features/standards/services/standard-import.service.ts',
  'src/app/features/standards/services/standard-request.service.ts',
  'src/app/features/standards/services/standard-tag-catalog.service.ts',
  'src/app/features/standards/services/standard-usage.service.ts'
] as const;

const dynamicWriterActions = [
  'CREATE_ITEM', 'UPDATE_INFO', 'STOCK_IN', 'STOCK_OUT',
  'MAINTENANCE_ON', 'MAINTENANCE_OFF', 'SHOW_LOCKED_ON', 'SHOW_LOCKED_OFF'
] as const;

function extractWriterActionLiterals(source: string): string[] {
  const values = new Set<string>();
  const patterns = [
    /\b(?:logGlobalActivity|logActivity)\(\s*['"]([A-Z][A-Z0-9_]*)['"]/g,
    /\baction\s*:\s*['"]([A-Z][A-Z0-9_]*)['"]/g,
    /\b(?:const|let)\s+action\s*=\s*['"]([A-Z][A-Z0-9_]*)['"]/g
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) values.add(match[1]);
  }
  return [...values];
}

function event(action: string, overrides: Partial<ActivityEvent> = {}): ActivityEvent {
  return {
    id: 'event-1', eventId: 'event-1', schemaVersion: 2,
    action, module: 'RESULT', audience: 'RESULT_VIEW', importance: 'NORMAL', auditClass: 'BUSINESS',
    activityVisible: true, actorUid: 'actor-1', actorName: 'Actor', details: 'details',
    timestamp: 0, user: 'Actor', ...overrides
  };
}

test('every currently written activity action is registered', () => {
  const discovered = new Set<string>(dynamicWriterActions);
  for (const path of writerFiles) {
    for (const action of extractWriterActionLiterals(readFileSync(path, 'utf8'))) discovered.add(action);
  }

  const missing = [...discovered].filter(action => !isRegisteredActivityAction(action)).sort();
  assert.deepEqual(missing, []);
});

test('every action known by the legacy Dashboard formatter is registered', () => {
  const source = readFileSync('src/app/features/dashboard/dashboard.component.ts', 'utf8');
  const start = source.indexOf('getLogActionText(');
  const end = source.indexOf('\n  canViewActivityLog', start);
  const formatterSource = start >= 0 && end > start ? source.slice(start, end) : source;
  const actions = [...formatterSource.matchAll(/['"]([A-Z][A-Z0-9_]*)['"]\s*:/g)].map(match => match[1]);
  const missing = actions.filter(action => !isRegisteredActivityAction(action));
  assert.deepEqual(missing, []);
});

test('Dashboard and Statistics derive registered action labels from the central registry', () => {
  const dashboard = readFileSync('src/app/features/dashboard/dashboard.component.ts', 'utf8');
  const statistics = readFileSync('src/app/features/dashboard/statistics.component.ts', 'utf8');

  assert.doesNotMatch(dashboard, /_actionTextMap/);
  assert.match(dashboard, /isRegisteredActivityAction\(action\).*getActivityActionLabel\(action\)/s);
  assert.match(statistics, /isRegisteredActivityAction\(action\).*getActivityAuditActionLabel\(action\)/s);
  assert.doesNotMatch(statistics, /action === 'PUBLISH_RESULT_REPORT'\) return 'Xuất bản báo cáo'/);
});

test('registry definitions are self-consistent and fail closed for unknown actions', () => {
  for (const [key, definition] of Object.entries(ACTIVITY_ACTION_REGISTRY)) {
    assert.equal(definition.action, key);
    assert.ok(definition.module);
    assert.ok(definition.audience);
    assert.ok(definition.importance);
    assert.ok(definition.auditClass);
    if (definition.module === 'SYSTEM') assert.equal(definition.audience, 'SYSTEM_ADMIN');
    if (definition.notification?.mode === 'WORKFLOW') assert.ok(definition.notification.type);
    if (definition.notification?.mode === 'NONE') assert.equal(definition.notification.type, undefined);
    if (definition.aggregation?.enabled) {
      assert.equal(definition.importance, 'NORMAL', `aggregation must stay off warning/approval actions: ${key}`);
    }
  }

  assert.throws(() => getActivityActionDefinition('UNREGISTERED_ACTION'), /Unregistered activity action/);
  assert.deepEqual(ACTIVITY_ACTION_REGISTRY.SAVE_RESULT_DRAFT.aggregation, {
    enabled: true,
    windowMs: 10 * 60_000,
    keyParts: ['actorUid', 'requestId', 'action']
  });
});

test('classification never depends on actor role', () => {
  const definition = getActivityActionDefinition('PUBLISH_RESULT_REPORT');
  assert.equal(definition.module, 'RESULT');
  assert.equal(definition.audience, 'RESULT_VIEW');
});

test('default action URLs are deterministic and encode identifiers', () => {
  assert.equal(resolveDefaultActivityActionUrl(event('PUBLISH_RESULT_REPORT', { requestId: 'REQ/01' })), '/results/REQ%2F01');
  assert.equal(resolveDefaultActivityActionUrl(event('CREATE_STANDARD', { targetId: 'STD 01' })), '/standards/STD%2001');
  assert.equal(resolveDefaultActivityActionUrl(event('CREATE_ITEM', { targetId: 'CHEM-1' })), '/inventory');
  assert.equal(resolveDefaultActivityActionUrl(event('MAINTENANCE_ON')), '/settings/system');
});

test('public traceability is an explicit action allowlist, not a printable side effect', () => {
  assert.equal(canBePublicTraceableActivityAction('DIRECT_APPROVE'), true);
  assert.equal(canBePublicTraceableActivityAction('DIRECT_APPROVE_PLAN'), true);
  assert.equal(canBePublicTraceableActivityAction('APPROVE_REQUEST'), true);
  assert.equal(canBePublicTraceableActivityAction('EDIT_REQUEST'), true);
  assert.equal(canBePublicTraceableActivityAction('CREATE_VIRTUAL_MASTER'), true);
  assert.equal(canBePublicTraceableActivityAction('PRINT'), false);
  assert.equal(canBePublicTraceableActivityAction('UNKNOWN_ACTION'), false);
});
