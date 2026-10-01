import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Log } from '../../core/models/log.model';
import { IncompletePrintDataError, loadOrderedPrintJobs } from './print-queue.utils';

const data = (name: string) => ({ sop: { name }, inputs: {}, items: [], margin: 0 });
const log = (id: string, fields: Partial<Log> = {}): Log => ({
  id, action: 'APPROVE', details: '', timestamp: new Date('2026-10-01T01:00:00Z'), user: id, ...fields,
});

test('mixed legacy and fetched slips keep display order despite unordered query results', async () => {
  const logs = [log('first', { printJobId: 'z' }), log('legacy', { printData: data('embedded') as any }),
    log('last', { printJobId: 'a' })];
  const jobs = await loadOrderedPrintJobs(logs, async () => new Map([['a', data('last')], ['z', data('first')]]));
  assert.deepEqual(jobs.map(job => job.sop.name), ['first', 'embedded', 'last']);
  assert.deepEqual(jobs.map(job => job.requestId), ['first', 'legacy', 'last']);
});

test('logs sharing a print job retain their own batch and owner metadata', async () => {
  let requested: readonly string[] = [];
  const jobs = await loadOrderedPrintJobs([
    log('one', { printJobId: 'shared', requestId: 'batch-one' }),
    log('two', { printJobId: 'shared', requestId: 'batch-two' }),
  ], async ids => { requested = ids; return new Map([['shared', data('shared')]]); });
  assert.deepEqual(requested, ['shared']);
  assert.deepEqual(jobs.map(job => [job.requestId, job.user]), [['batch-one', 'one'], ['batch-two', 'two']]);
});

test('chunk failure rejects the whole selection and identifies every affected log', async () => {
  const logs = Array.from({ length: 32 }, (_, index) => log(`log-${index}`, { printJobId: `job-${index}` }));
  let calls = 0;
  await assert.rejects(loadOrderedPrintJobs(logs, async ids => {
    if (++calls === 2) throw new Error('permission denied');
    return new Map(ids.map(id => [id, data(id)]));
  }), error => {
    assert.ok(error instanceof IncompletePrintDataError);
    assert.deepEqual(error.logIds, ['log-30', 'log-31']);
    return true;
  });
  assert.equal(calls, 2);
});

test('trace IDs and missing timestamps are not presented as known batch codes or analysis dates', async () => {
  const jobs = await loadOrderedPrintJobs([log('TRC-legacy', {
    timestamp: null, printData: data('legacy') as any,
  })], async () => new Map());
  assert.equal(jobs[0].requestId, 'TRC-legacy');
  assert.equal(jobs[0].batchCode, '');
  assert.equal(jobs[0].date, '');
});

test('missing and malformed data cannot silently disappear from a selection', async () => {
  await assert.rejects(loadOrderedPrintJobs([
    log('good', { printData: data('good') as any }), log('missing', { printJobId: 'gone' }),
    log('invalid', { printJobId: 'broken' }), log('unlinked'),
  ], async () => new Map([['broken', { sop: {}, items: 'invalid' }]])), error => {
    assert.ok(error instanceof IncompletePrintDataError);
    assert.deepEqual(error.logIds, ['missing', 'invalid', 'unlinked']);
    return true;
  });
});

test('invalid embedded data can recover from its linked snapshot; empty selections do not fetch', async () => {
  const jobs = await loadOrderedPrintJobs([log('recover', {
    printData: {} as any, printJobId: 'valid',
  })], async () => new Map([['valid', data('recovered')]]));
  assert.equal(jobs[0].sop.name, 'recovered');
  assert.deepEqual(await loadOrderedPrintJobs([], async () => { throw new Error('must not fetch'); }), []);
});
