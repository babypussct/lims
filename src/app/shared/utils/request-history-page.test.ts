import assert from 'node:assert/strict';
import test from 'node:test';
import type { Request } from '../../core/models/request.model';
import { RequestHistoryPager, RequestHistoryChunk, RequestDateField } from './request-history-page';

const row = (id: string, fields: Partial<Request> = {}): Request => ({ id, sopId: 'sop', sopName: 'SOP',
  items: [], status: 'approved', timestamp: new Date(2026, 9, 1), ...fields });

test('approval history ignores analysis date and only reads approval and legacy timestamp sources', async () => {
  const calls: RequestDateField[] = [];
  const pager = new RequestHistoryPager('2026-10-02', '2026-10-02', async field => {
    calls.push(field);
    return { items: [row('approved', { analysisDate: '2026-09-30', approvedAt: new Date(2026, 9, 2, 23, 59) }),
      row('legacy', { analysisDate: '2026-09-30', timestamp: new Date(2026, 9, 2) }),
      row('analysis-only', { analysisDate: '2026-10-02', approvedAt: new Date(2026, 8, 30) })], complete: true };
  }, 24, 'approvedAt');
  const page = await pager.load();
  assert.deepEqual(calls, ['approvedAt', 'timestamp']);
  assert.deepEqual(page.items.map(item => item.id), ['legacy', 'approved']);
  assert.equal(page.complete, true);
});

test('each click reads one bounded chunk per active date shape, even when no rows qualify', async () => {
  const calls: { field: RequestDateField; size: number; cursor: unknown }[] = [];
  const pager = new RequestHistoryPager('2026-10-01', '2026-10-02', async (field, cursor, size) => {
    calls.push({ field, size, cursor });
    return { items: Array.from({ length: size }, (_, i) => row(`${field}-${i}`, { status: 'pending' })), cursor: field, complete: false };
  });
  const first = await pager.load(); assert.equal(first.reads, 72); assert.equal(first.complete, false); assert.equal(first.items.length, 0);
  assert.equal(calls.length, 3); assert.ok(calls.every(call => call.size === 24 && call.cursor === undefined));
  await pager.load(); assert.equal(calls.length, 6); assert.ok(calls.slice(3).every(call => call.cursor === call.field));
});

test('date precedence removes duplicate shape matches and excludes pending, deleted and out-of-range records', async () => {
  const primary = row('primary', { analysisDate: '2026-10-02', approvedAt: new Date(2026, 9, 1) });
  const approved = row('approved', { approvedAt: new Date(2026, 9, 1), status: 'completed' });
  const timestamp = row('timestamp', { status: 'draft' });
  const pager = new RequestHistoryPager('2026-10-01', '2026-10-02', async field => ({
    items: [primary, approved, timestamp, row('pending', { status: 'pending' }), row('deleted', { _isDeleted: true }),
      row('outside', { analysisDate: '2026-09-01' })], complete: true,
  }));
  const page = await pager.load(); assert.deepEqual(page.items.map(item => item.id), ['primary', 'timestamp', 'approved']);
  assert.equal(page.complete, true); assert.equal(page.reads, 18);
  assert.equal((await pager.load()).reads, 0);
});

test('load more accumulates legacy records and advances only non-exhausted sources', async () => {
  const calls: RequestDateField[] = [];
  const pager = new RequestHistoryPager('2026-10-01', '2026-10-02', async (field, cursor) => {
    calls.push(field);
    if (field !== 'timestamp') return { items: [], complete: true };
    return { items: [row(cursor ? 'older' : 'newer')], cursor: 'page-two', complete: !!cursor };
  });
  assert.equal((await pager.load()).complete, false);
  assert.equal((await pager.load()).items.length, 2);
  assert.deepEqual(calls, ['analysisDate', 'approvedAt', 'timestamp', 'timestamp']);
});

test('simultaneous consumers share pending reads', async () => {
  let resolve!: (value: RequestHistoryChunk) => void; let calls = 0;
  const pending = new Promise<RequestHistoryChunk>(yes => resolve = yes);
  const pager = new RequestHistoryPager('2026-10-01', '2026-10-02', async () => { calls++; return pending; });
  const first = pager.load(); const second = pager.load(); assert.equal(first, second);
  resolve({ items: [], complete: true }); await first; assert.equal(calls, 3);
});

test('failed source can retry while already-read records and exhausted sources are preserved', async () => {
  let failures = 0; const calls: RequestDateField[] = [];
  const pager = new RequestHistoryPager('2026-10-01', '2026-10-02', async field => {
    calls.push(field); if (field === 'timestamp' && !failures++) throw new Error('offline');
    return { items: field === 'analysisDate' ? [row('kept', { analysisDate: '2026-10-02' })] : [row('legacy')], complete: true };
  });
  await assert.rejects(pager.load(), /offline/);
  assert.deepEqual((await pager.load()).items.map(item => item.id), ['kept', 'legacy']);
  assert.deepEqual(calls, ['analysisDate', 'approvedAt', 'timestamp', 'timestamp']);
});
