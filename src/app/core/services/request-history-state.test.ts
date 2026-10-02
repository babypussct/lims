import '@angular/compiler';
import assert from 'node:assert/strict';
import test from 'node:test';
import { signal } from '@angular/core';
import type { Request } from '../models/request.model';
import { StateService } from './state.service';

const row = (id: string, analysisDate = '2026-10-02', change: Partial<Request> = {}): Request => ({
  id, analysisDate, status: 'approved', timestamp: new Date(), sopId: 'sop', sopName: 'SOP', items: [], ...change,
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
