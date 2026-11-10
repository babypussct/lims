import '@angular/compiler';
import assert from 'node:assert/strict';
import test from 'node:test';
import { StandardCodeRegistryService } from './standard-code-registry.service';

interface Ref { id: string; path: string }

function makeHarness(holder: 'old' | 'new' = 'old') {
  const service = Object.create(StandardCodeRegistryService.prototype) as any;
  const documents = new Map<string, Record<string, any>>([
    ['standards/old', { internal_id: 'AA01', name: 'Old', _isDeleted: true, status: 'DELETED', lifecycle_status: 'ACTIVE' }],
    ['standards/new', { internal_id: 'AA01', name: 'New', _isDeleted: false, status: 'AVAILABLE', lifecycle_status: 'ACTIVE' }],
    ['registry/AA01', { id: 'AA01', internal_id: 'AA01', currentStandardId: holder, status: 'ASSIGNED', assignmentCount: 3 }],
  ]);
  service.auth = {
    currentUser: () => ({ uid: 'admin', displayName: 'Lab Admin' }), canEditStandards: () => true,
  };
  service.fb = { APP_ID: 'test', db: {} };
  service.getCodeEventRef = (id: string): Ref => ({ id, path: `events/${id}` });
  service.getStandardRef = (id: string): Ref => ({ id, path: `standards/${id}` });
  service.getRegistryRef = (id: string): Ref => ({ id, path: `registry/${id}` });
  service.hasOpenStandardRequests = async () => false;
  service.findSameCodeCandidateIds = async () => ['old', 'new'];
  const readDocument = (ref: Ref) => {
    const data = documents.get(ref.path);
    return { id: ref.id, exists: () => Boolean(data), data: () => data };
  };
  service.readDocument = async (ref: Ref) => readDocument(ref);
  let transactions = 0;
  service.runInTransaction = async (callback: (tx: any) => Promise<void>) => {
    transactions += 1;
    const writes = new Map<string, Record<string, any>>();
    const transaction = {
      get: async (ref: Ref) => readDocument(ref),
      update: (ref: Ref, patch: Record<string, any>) => {
        writes.set(ref.path, { ...(writes.get(ref.path) ?? documents.get(ref.path)), ...patch });
      },
      set: (ref: Ref, value: Record<string, any>, options?: { merge: boolean }) => {
        writes.set(ref.path, { ...(options?.merge ? documents.get(ref.path) : {}), ...value });
      },
    };
    await callback(transaction);
    for (const [path, data] of writes) documents.set(path, data);
  };
  return { service, documents, get transactions() { return transactions; } };
}

test('atomic reconciliation releases hidden old record, retains visible new record and logs ownership', async () => {
  for (const holder of ['old', 'new'] as const) {
    const ctx = makeHarness(holder);
    const response = await ctx.service.reconcileHiddenDuplicateCode('old', 'new', 'AA01', 'Confirmed replacement lot', 'reconcile-AA01');
    assert.equal(response.status, 'RECONCILED');
    assert.equal(ctx.documents.get('standards/old')?.['lifecycle_status'], 'RELEASED');
    assert.equal(ctx.documents.get('standards/old')?.['_isDeleted'], true);
    assert.equal(ctx.documents.get('standards/new')?.['lifecycle_status'], 'ACTIVE');
    assert.equal(ctx.documents.get('registry/AA01')?.['currentStandardId'], 'new');
    assert.equal(ctx.documents.get('registry/AA01')?.['status'], 'ASSIGNED');
    assert.equal(ctx.documents.get('registry/AA01')?.['assignmentCount'], 3);
    assert.equal(ctx.documents.get('registry/AA01')?.['lastReleasedStandardId'], 'old');
    const event = ctx.documents.get('events/reconcile-AA01');
    assert.equal(event?.['type'], 'RECONCILED');
    assert.equal(event?.['source'], 'RECONCILIATION');
    assert.equal(event?.['before'].registryStandardId, holder);
    assert.equal(event?.['after'].registryStandardId, 'new');
    assert.equal(event?.['standardId'], 'old');
    assert.equal(ctx.transactions, 1);

    const replay = await ctx.service.reconcileHiddenDuplicateCode('old', 'new', 'AA01', 'Confirmed replacement lot', 'reconcile-AA01');
    assert.equal(replay.status, 'RECONCILED');
    assert.equal(ctx.transactions, 1, 'idempotent replay must not create a second transaction');
  }
});

test('changed candidates or registry abort transaction with no partial writes', async () => {
  const ctx = makeHarness();
  const stateBefore = [...ctx.documents.entries()].map(([key, value]) => [key, { ...value }]);
  ctx.service.findSameCodeCandidateIds = async () => ['old', 'new', 'third'];
  ctx.documents.set('standards/third', { internal_id: 'AA01', _isDeleted: false, status: 'AVAILABLE', lifecycle_status: 'ACTIVE' });
  await assert.rejects(ctx.service.reconcileHiddenDuplicateCode('old', 'new', 'AA01', 'Confirmed replacement lot', 'op-triple'), /Không thể đối soát/);
  assert.equal(ctx.documents.has('events/op-triple'), false);
  assert.equal(ctx.documents.get('standards/old')?.['lifecycle_status'], 'ACTIVE');
  assert.equal(ctx.documents.get('registry/AA01')?.['currentStandardId'], 'old');

  ctx.documents.delete('standards/third');
  ctx.documents.set('registry/AA01', { ...stateBefore.find(row => row[0] === 'registry/AA01')?.[1], currentStandardId: 'unknown' });
  await assert.rejects(ctx.service.reconcileHiddenDuplicateCode('old', 'new', 'AA01', 'Confirmed replacement lot', 'op-bad-registry'), /Không thể đối soát/);
  assert.equal(ctx.documents.has('events/op-bad-registry'), false);
});

test('open requests and operation ID reuse fail before mutation', async () => {
  const ctx = makeHarness();
  ctx.service.hasOpenStandardRequests = async () => true;
  await assert.rejects(ctx.service.reconcileHiddenDuplicateCode('old', 'new', 'AA01', 'Confirmed replacement lot', 'op-open'), /yêu cầu mượn/);
  assert.equal(ctx.transactions, 0);

  ctx.service.hasOpenStandardRequests = async () => false;
  ctx.documents.set('events/reconcile-used', { type: 'RELEASED', source: 'RECALL', internalId: 'AA01', standardId: 'old' });
  await assert.rejects(ctx.service.reconcileHiddenDuplicateCode('old', 'new', 'AA01', 'Confirmed replacement lot', 'reconcile-used'), /đã được dùng/);
  assert.equal(ctx.transactions, 0);
});
