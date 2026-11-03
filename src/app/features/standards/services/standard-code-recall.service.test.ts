import '@angular/compiler';
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildStandardCodeEvent,
  normalizeStandardCodeOperationId,
} from './standard-code-registry.service';

test('recall operation ids are stable document-safe keys', () => {
  assert.equal(normalizeStandardCodeOperationId('recall/run:AA01/std-1'), 'recall_run_AA01_std-1');
  assert.match(normalizeStandardCodeOperationId(''), /^code_operation_/);
});

test('code events retain immutable ownership snapshots and idempotency identity', () => {
  const event = buildStandardCodeEvent({
    operationId: 'recall_run_AA01_std-1',
    internalId: ' aa01 ',
    standardId: 'std-1',
    assignmentSequence: 2,
    type: 'RELEASED',
    source: 'RECALL',
    reason: '  Đã ẩn  ',
    actorUid: 'user-1',
    actorName: 'Người dùng',
    before: { standardId: 'std-1', internalId: 'AA01', lifecycleStatus: 'ACTIVE', registryStatus: 'ASSIGNED', registryStandardId: 'std-1' },
    after: { standardId: 'std-1', internalId: 'AA01', lifecycleStatus: 'RELEASED', registryStatus: 'AVAILABLE', registryStandardId: null },
    runId: 'recall-run',
  });
  assert.equal(event.id, 'recall_run_AA01_std-1');
  assert.equal(event.eventId, event.operationId);
  assert.equal(event.internalId, 'AA01');
  assert.equal(event.type, 'RELEASED');
  assert.equal(event.source, 'RECALL');
  assert.deepEqual(event.before, { standardId: 'std-1', internalId: 'AA01', lifecycleStatus: 'ACTIVE', registryStatus: 'ASSIGNED', registryStandardId: 'std-1' });
  assert.equal(event.runId, 'recall-run');
});
