import '@angular/compiler';
import assert from 'node:assert/strict';
import test from 'node:test';
import { signal } from '@angular/core';
import type { Request } from '../models/request.model';
import { StateService } from './state.service';
import { buildRequestHistoryConstraints, RequestHistoryPageService } from './request-history-page.service';
import { initializeApp, deleteApp } from 'firebase/app';
import { collection, getFirestore, limit, orderBy, query, queryEqual, where } from 'firebase/firestore';

const row = (id: string, analysisDate = '2026-10-02', change: Partial<Request> = {}): Request => ({
  id, analysisDate, status: 'approved', timestamp: new Date(), sopId: 'sop', sopName: 'SOP', items: [], ...change,
});

test('open date boundaries build valid Firestore queries without out-of-range timestamps', async () => {
  const app = initializeApp({ projectId: 'demo-results-history' }, 'results-history-boundaries');
  try {
    const source = collection(getFirestore(app), 'requests');
    const actual = query(source, ...buildRequestHistoryConstraints('approvedAt', '0001-01-01', '2026-10-02', 24));
    const expected = query(source, where('approvedAt', '<=', new Date(2026, 9, 2, 23, 59, 59, 999)), orderBy('approvedAt', 'desc'), limit(24));
    assert.ok(queryEqual(actual, expected));
    assert.ok(queryEqual(query(source, ...buildRequestHistoryConstraints('timestamp', '2026-10-02', '9999-12-31', 24)),
      query(source, where('timestamp', '>=', new Date(2026, 9, 2)), orderBy('timestamp', 'desc'), limit(24))));
    assert.ok(queryEqual(query(source, ...buildRequestHistoryConstraints('approvedAt', '0001-01-01', '9999-12-31', 24)),
      query(source, orderBy('approvedAt', 'desc'), limit(24))));
  } finally { await deleteApp(app); }
});

test('analysis and approval history for the same range have separate cached pages', async () => {
  const history = Object.create(RequestHistoryPageService.prototype) as RequestHistoryPageService;
  const calls: string[] = [];
  const batch = row('batch', '2026-10-02', { approvedAt: new Date(2026, 8, 30) });
  Object.assign(history, {
    fb: { APP_ID: 'fixture' },
    auth: { currentUser: () => ({ uid: 'test' }), getDeltaCacheScope: () => 'test', isStandardAuditMode: () => false },
    scope: '', ranges: new Map(),
    read: async (field: string) => { calls.push(field); return { items: [batch], complete: true }; },
  });
  assert.equal((await history.load('2026-10-02', '2026-10-02')).items.length, 1);
  assert.equal((await history.load('2026-10-02', '2026-10-02', false, false, 'approvedAt')).items.length, 0);
  assert.deepEqual(calls, ['analysisDate', 'approvedAt', 'timestamp', 'approvedAt', 'timestamp']);
  await history.load('2026-10-02', '2026-10-02', false, false, 'approvedAt');
  assert.equal(calls.length, 5);
});

test('refreshing approval history removes stale rows by approval date even when analysis date differs', () => {
  const state = Object.create(StateService.prototype) as StateService;
  const removed = row('removed', '2026-09-30', { approvedAt: new Date(2026, 9, 2) });
  const outside = row('outside', '2026-10-02', { approvedAt: new Date(2026, 8, 30) });
  Object.assign(state, {
    approvedHistoryRequests: new Map([removed, outside].map(request => [request.id, request])),
    approvedRecentRequests: new Map(), approvedHistoryRangeCache: new Map(),
    approvedHistoryCacheRevision: 0, approvedRequests: signal<Request[]>([]),
  });
  state.mergeApprovedHistoryPage([], '2026-10-02', '2026-10-02', 'approvedAt');
  assert.deepEqual(state.approvedRequests().map(request => request.id), ['outside']);
});

test('reloading a bounded range replaces stale history, preserves other ranges and live rows, and invalidates complete report caches', () => {
  const state = Object.create(StateService.prototype) as StateService;
  const stale = row('removed'); const moved = row('moved'); const outside = row('outside', '2026-09-01');
  const recent = row('live', '2026-10-02', { currentPrintJobId: 'new' });
  Object.assign(state, {
    approvedHistoryRequests: new Map([stale, moved, outside].map(request => [request.id, request])),
    approvedRecentRequests: new Map([[recent.id, recent], ['deleted', row('deleted', '2026-10-02', { _isDeleted: true })]]),
    approvedHistoryRangeCache: new Map([['complete-report', {}]]), approvedHistoryCacheRevision: 0, approvedRequests: signal<Request[]>([]),
  });
  state.mergeApprovedHistoryPage([row('fresh'), row('live', '2026-10-02', { currentPrintJobId: 'old' })], '2026-10-02', '2026-10-02');
  assert.deepEqual(state.approvedRequests().map(request => request.id).sort(), ['fresh', 'live', 'outside']);
  assert.equal(state.approvedRequests().find(request => request.id === 'live')?.currentPrintJobId, 'new');
  assert.equal((state as any).approvedHistoryRangeCache.size, 0);
  state.mergeApprovedHistoryPage([row('fresh'), row('next-page')], '2026-10-02', '2026-10-02');
  assert.deepEqual(state.approvedRequests().map(request => request.id).sort(), ['fresh', 'live', 'next-page', 'outside']);
});
