import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('Statistics reads audit data independently from Activity Feed state', () => {
  const source = readFileSync('src/app/features/dashboard/statistics.component.ts', 'utf8');
  assert.match(source, /AuditLogService/);
  assert.match(source, /this\.audit\.logs\(\)/);
  assert.match(source, /this\.audit\.getLogsByDateRange\(/);
  assert.doesNotMatch(source, /this\.state\.logs\(\)/);
  assert.doesNotMatch(source, /ensureActivityFeedListeners\(\)/);
});

test('Print Queue and request badge do not consume StateService printableLogs', () => {
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
  assert.match(service, /where\('user', '==', displayName\)/);
});

test('InventoryService no longer owns audit date-range reads', () => {
  const inventory = readFileSync('src/app/features/inventory/inventory.service.ts', 'utf8');
  const audit = readFileSync('src/app/core/services/audit-log.service.ts', 'utf8');
  assert.doesNotMatch(inventory, /getLogsByDateRange\(/);
  assert.match(audit, /getLogsByDateRange\(/);
});

test('Dashboard remains the only feature consumer of legacy StateService logs during PR3 compatibility', () => {
  const dashboard = readFileSync('src/app/features/dashboard/dashboard.component.ts', 'utf8');
  assert.match(dashboard, /this\.state\.logs\(\)/);
});
