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

test('worksheet printing has no listener or queue badge and does not consume Activity Feed state', () => {
  const requests = readFileSync('src/app/features/requests/request-list.component.ts', 'utf8');
  const service = readFileSync('src/app/core/services/batch-worksheet.service.ts', 'utf8');
  assert.match(requests, /BatchWorksheetPickerComponent/);
  assert.doesNotMatch(requests, /PrintQueue|printableLogs|setCurrentTab\('printing'\)/);
  assert.match(service, /where\(documentId\(\), 'in'/);
  assert.doesNotMatch(service, /onSnapshot|ensureActivityFeedListeners|updateDoc|writeBatch|addDoc/);
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

test('approved-request range reads reuse only fresh complete loads and invalidate on changes', () => {
  const state = readFileSync('src/app/core/services/state.service.ts', 'utf8');
  const rangeLoaderStart = state.indexOf('async loadApprovedRequestsForDateRange');
  const rangeLoaderEnd = state.indexOf('private isApprovedRequest', rangeLoaderStart);
  const rangeLoaderBody = state.slice(rangeLoaderStart, rangeLoaderEnd);

  assert.match(state, /APPROVED_REQUEST_HISTORY_CACHE_TTL_MS = 30_000/);
  assert.match(rangeLoaderBody, /approvedHistoryRangeCache\.get\(key\)/);
  assert.match(rangeLoaderBody, /Date\.now\(\) - cached\.loadedAt < this\.APPROVED_REQUEST_HISTORY_CACHE_TTL_MS/);
  assert.match(rangeLoaderBody, /return \{ \.\.\.cached\.result, reads: 0 \};/);
  assert.match(rangeLoaderBody, /result\.complete && cacheRevision === this\.approvedHistoryCacheRevision/);
  assert.match(state, /publishRequestChanges\(changed: Request\[\], deletedIds: string\[\] = \[\]\): void \{\r?\n\s*this\.invalidateApprovedHistoryRangeCache\(\);/);
  assert.match(state, /private invalidateApprovedHistoryRangeCache\(\): void/);
});

test('Dashboard consumes only the canonical ActivityFeedService after PR9 cleanup', () => {
  const dashboard = readFileSync('src/app/features/dashboard/dashboard.component.ts', 'utf8');
  assert.match(dashboard, /ActivityFeedService/);
  assert.doesNotMatch(dashboard, /this\.state\.logs\(\)/);
  assert.doesNotMatch(dashboard, /ensureActivityFeedListeners\(\)/);
  assert.doesNotMatch(dashboard, /filterDashboardActivityLogs\(/);
});
