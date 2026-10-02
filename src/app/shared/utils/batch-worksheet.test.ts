import assert from 'node:assert/strict';
import test from 'node:test';
import type { Request } from '../../core/models/request.model';
import { BatchWorksheetLoader, canEditWorksheet, WorksheetReader, WorksheetSnapshot } from './batch-worksheet';

const payload = (name: string, requestId?: string) => ({ sop: { name }, inputs: { batchCode: name }, items: [], margin: 0, requestId });
const snapshot = (id: string, requestId?: string): WorksheetSnapshot => ({ id, data: payload(id, requestId) });
const reader = (overrides: Partial<WorksheetReader> = {}): WorksheetReader => ({
  snapshots: async ids => ids.map(id => snapshot(id)), legacy: async () => [], ...overrides,
});
function deferred<T>() { let resolve!: (value: T) => void; const promise = new Promise<T>(yes => resolve = yes); return { promise, resolve }; }

test('mixed explicit and embedded snapshots preserve selection order despite unordered responses', async () => {
  const loader = new BatchWorksheetLoader(reader({ snapshots: async () => [snapshot('a'), snapshot('z')] }));
  const jobs = await loader.load([{ requestId: 'first', printJobId: 'z' },
    { requestId: 'old', printData: payload('embedded') }, { requestId: 'last', printJobId: 'a' }]);
  assert.deepEqual(jobs.map(job => [job.sop.name, job.requestId, job.printJobId]),
    [['z', 'first', 'z'], ['embedded', 'old', undefined], ['a', 'last', 'a']]);
});

test('overlapping simultaneous selections coalesce reads and session cache avoids repeat reads', async () => {
  const gate = deferred<WorksheetSnapshot[]>(); const calls: string[][] = [];
  const loader = new BatchWorksheetLoader(reader({ snapshots: async ids => { calls.push([...ids]); return gate.promise; } }));
  const first = loader.load([{ printJobId: 'a' }, { printJobId: 'b' }, { printJobId: 'a' }]);
  const second = loader.load([{ printJobId: 'a' }]);
  gate.resolve([snapshot('b'), snapshot('a')]);
  assert.equal((await first).length, 3); await second;
  await loader.load([{ printJobId: 'b' }]);
  assert.deepEqual(calls, [['a', 'b']]);
});

test('missing explicit snapshots fail the whole selection without using embedded or current fallback', async () => {
  let legacyCalls = 0;
  const loader = new BatchWorksheetLoader(reader({ snapshots: async () => [snapshot('good')],
    legacy: async () => { legacyCalls++; return [snapshot('current')]; } }));
  await assert.rejects(loader.load([{ printJobId: 'good' }, { requestId: 'batch', printJobId: 'gone', printData: payload('stale') }]), /snapshot.*batch/);
  assert.equal(legacyCalls, 0);
});

test('malformed latest legacy snapshot fails rather than silently printing an older revision', async () => {
  const loader = new BatchWorksheetLoader(reader({ legacy: async () => [
    { id: 'old', data: { ...payload('old'), createdAt: new Date(1) } },
    { id: 'new', data: { sop: {}, createdAt: new Date(2) } },
  ] }));
  await assert.rejects(loader.load([{ requestId: 'batch' }]), /snapshot/);
});

test('legacy lookup chooses latest snapshot and expires its request mapping after 30 seconds', async () => {
  let time = 0; let calls = 0;
  const loader = new BatchWorksheetLoader(reader({ legacy: async () => { calls++; return [
    { id: 'old', data: { ...payload('old'), createdAt: { seconds: 1 } } },
    { id: 'new', data: { ...payload('new'), createdAt: { seconds: 2 } } },
  ]; } }), 100, () => time);
  assert.equal((await loader.load([{ requestId: 'batch' }]))[0].printJobId, 'new');
  time = 29_999; await loader.load([{ requestId: 'batch' }]); assert.equal(calls, 1);
  time = 30_000; await loader.load([{ requestId: 'batch' }]); assert.equal(calls, 2);
});

test('failed and missing reads remain retryable', async () => {
  let calls = 0;
  const loader = new BatchWorksheetLoader(reader({ snapshots: async () => {
    if (++calls === 1) throw new Error('offline');
    return calls === 2 ? [] : [snapshot('a')];
  } }));
  await assert.rejects(loader.load([{ printJobId: 'a' }]), /offline/);
  await assert.rejects(loader.load([{ printJobId: 'a' }]), /snapshot/);
  assert.equal((await loader.load([{ printJobId: 'a' }]))[0].sop.name, 'a');
});

test('account scope reset rejects pending results and never seeds the next scope', async () => {
  const gate = deferred<WorksheetSnapshot[]>(); let calls = 0;
  const loader = new BatchWorksheetLoader(reader({ snapshots: async () => ++calls === 1 ? gate.promise : [snapshot('a')] }));
  const stale = loader.load([{ printJobId: 'a' }]);
  loader.clear(); gate.resolve([snapshot('a')]);
  await assert.rejects(stale, /Phiên truy cập/);
  await loader.load([{ printJobId: 'a' }]); assert.equal(calls, 2);
});

test('already hydrated snapshot can be reused but its identity must match the batch', async () => {
  let calls = 0; const loader = new BatchWorksheetLoader(reader({ snapshots: async () => { calls++; return []; } }));
  loader.seed(snapshot('a', 'batch'));
  await loader.load([{ printJobId: 'a', requestId: 'batch' }]); assert.equal(calls, 0);
  await assert.rejects(loader.load([{ printJobId: 'a', requestId: 'different' }]), /khớp/);
});

test('worksheet QR keeps the public audit identity of its revision and an explicit historical log takes precedence', async () => {
  const loader = new BatchWorksheetLoader(reader({ snapshots: async () => [
    { id: 'revision', data: { ...payload('batch'), traceLogId: 'TRC-original' } },
  ] }));
  assert.equal((await loader.load([{ printJobId: 'revision' }]))[0].traceLogId, 'TRC-original');
  assert.equal((await loader.load([{ printJobId: 'revision', traceLogId: 'TRC-selected' }]))[0].traceLogId, 'TRC-selected');
});

test('bounded cache and cloned job payloads preserve immutable snapshots', async () => {
  let calls = 0;
  const loader = new BatchWorksheetLoader(reader({ snapshots: async ids => { calls++; return ids.map(id => snapshot(id)); } }), 1);
  const jobs = await loader.load([{ printJobId: 'a' }]); jobs[0].inputs['batchCode'] = 'mutated';
  assert.equal((await loader.load([{ printJobId: 'a' }]))[0].inputs['batchCode'], 'a');
  await loader.load([{ printJobId: 'b' }]); await loader.load([{ printJobId: 'a' }]); assert.equal(calls, 3);
});

test('parameter editing only allows an approved standalone batch with no result and an available lock', () => {
  const request = { id: 'batch', status: 'approved' } as Request;
  assert.equal(canEditWorksheet(request, 'owner'), true);
  assert.equal(canEditWorksheet({ ...request, lockedBy: 'owner' }, 'owner'), true);
  for (const change of [{ status: 'draft' }, { status: 'completed' }, { isVirtualMaster: true },
    { parentMasterId: 'master' }, { _isDeleted: true }, { analysisResult: {} }, { analysisResultSummary: {} }, { lockedBy: 'other' }]) {
    assert.equal(canEditWorksheet({ ...request, ...change } as Request, 'owner'), false);
  }
});
