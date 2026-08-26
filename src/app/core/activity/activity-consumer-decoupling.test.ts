import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('Statistics reads audit data independently from Activity Feed state', () => {
  const source = readFileSync('src/app/features/dashboard/statistics.component.ts', 'utf8');
  assert.match(source, /AuditLogService/);
  assert.match(source, /this\.audit\.getLogsByDateRange\(/);
  assert.match(source, /reportLogs = signal<Log\[\]>\(\[\]\)/);
  assert.doesNotMatch(source, /this\.audit\.logs\(\)/);
  assert.doesNotMatch(source, /this\.state\.logs\(\)/);
  assert.doesNotMatch(source, /ensureActivityFeedListeners\(\)/);
});

test('Print Queue and request badge use the canonical UID-owned read model', () => {
  const queue = readFileSync('src/app/features/requests/print-queue.component.ts', 'utf8');
  const requests = readFileSync('src/app/features/requests/request-list.component.ts', 'utf8');
  const service = readFileSync('src/app/core/services/print-queue.service.ts', 'utf8');

  assert.match(queue, /PrintQueueService/);
  assert.match(queue, /this\.queue\.printableLogs\(\)/);
  assert.doesNotMatch(queue, /state\.printableLogs\(\)/);
  assert.doesNotMatch(queue, /ensureActivityFeedListeners\(\)/);

  assert.match(requests, /PrintQueueService/);
  assert.match(requests, /printQueue\.printableLogs\(\)/);
  assert.doesNotMatch(requests, /state\.printableLogs\(\)/);

  assert.match(service, /where\('actorUid', '==', user\.uid\)/);
  assert.doesNotMatch(service, /where\('user', '==', displayName\)/);
});

test('InventoryService no longer owns audit date-range reads', () => {
  const inventory = readFileSync('src/app/features/inventory/inventory.service.ts', 'utf8');
  const audit = readFileSync('src/app/core/services/audit-log.service.ts', 'utf8');
  assert.doesNotMatch(inventory, /getLogsByDateRange\(/);
  assert.match(audit, /getLogsByDateRange\(/);
});

test('report-only approved-request history stays on the bounded range loader instead of the recent realtime listener', () => {
  const state = readFileSync('src/app/core/services/state.service.ts', 'utf8');
  const listenerStart = state.indexOf('ensureApprovedRequestsListener(): void');
  const rangeLoaderStart = state.indexOf('async loadApprovedRequestsForDateRange', listenerStart);
  const listenerBody = state.slice(listenerStart, rangeLoaderStart);

  assert.ok(listenerStart >= 0);
  assert.ok(rangeLoaderStart > listenerStart);
  assert.match(listenerBody, /hasPermission\('sop_view'\)/);
  assert.match(listenerBody, /hasPermission\('batch_run'\)/);
  assert.doesNotMatch(listenerBody, /canViewReports\(\)/);

  const rangeLoaderEnd = state.indexOf('private isApprovedRequest', rangeLoaderStart);
  const rangeLoaderBody = state.slice(rangeLoaderStart, rangeLoaderEnd);
  assert.match(rangeLoaderBody, /canViewReports\(\)/);
});

test('Dashboard consumes only the canonical ActivityFeedService after PR9 cleanup', () => {
  const dashboard = readFileSync('src/app/features/dashboard/dashboard.component.ts', 'utf8');
  assert.match(dashboard, /ActivityFeedService/);
  assert.doesNotMatch(dashboard, /this\.state\.logs\(\)/);
  assert.doesNotMatch(dashboard, /ensureActivityFeedListeners\(\)/);
  assert.doesNotMatch(dashboard, /filterDashboardActivityLogs\(/);
});
