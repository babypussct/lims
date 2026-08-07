import assert from 'node:assert/strict';
import test from 'node:test';
import { Request } from '../models/request.model';
import {
  buildDailyChecklistSetPayload,
  groupDailyChecklistEntriesByDate,
  runDailyChecklistProjectionBestEffort
} from './daily-checklist-materialization';
import {
  DailyChecklistResultCache,
  shouldFallbackToLegacyRequests
} from '../../features/checklist/daily-checklist-data-cache';
import {
  buildDailyChecklistEntry,
  dailyChecklistDocumentToRequests
} from './daily-checklist-projection';
import {
  getSampleDescriptionSnapshot,
  setSampleDescriptionSnapshot
} from '../../shared/utils/sample-description.utils';

function request(id: string, analysisDate: string, overrides: Partial<Request> = {}): Request {
  return {
    id,
    sopId: 'SOP-1',
    sopName: 'SOP kiểm nghiệm',
    items: [],
    status: 'approved',
    timestamp: { seconds: 1 },
    approvedAt: { seconds: 2 },
    analysisDate,
    user: 'KNV A',
    sampleList: ['M1'],
    targetIds: ['T1'],
    sampleTargetMap: { M1: ['T1'] },
    targetNames: { T1: 'Chỉ tiêu 1' },
    ...overrides
  };
}

function containsUndefined(value: unknown): boolean {
  if (value === undefined) return true;
  if (Array.isArray(value)) return value.some(containsUndefined);
  if (!value || typeof value !== 'object') return false;
  return Object.values(value as Record<string, unknown>).some(containsUndefined);
}

test('missing daily documents fall back before and after the rollout date', () => {
  assert.equal(shouldFallbackToLegacyRequests('2026-08-05', false), true);
  assert.equal(shouldFallbackToLegacyRequests('2026-08-06', false), true);
  assert.equal(shouldFallbackToLegacyRequests('2026-08-07', false), true);
});

test('an existing daily document is authoritative, including a truly empty day', () => {
  assert.equal(shouldFallbackToLegacyRequests('2026-08-07', true), false);
  assert.deepEqual(dailyChecklistDocumentToRequests({
    schemaVersion: 1,
    analysisDate: '2026-08-07',
    entries: {}
  }, '2026-08-07'), []);
});

test('cache invalidation prevents an empty result from being re-cached after refresh', () => {
  const cache = new DailyChecklistResultCache(5 * 60 * 1000);
  const emptyResult = { requests: [], source: 'server' as const, materialized: false };
  const initialGeneration = cache.generation('2026-08-07');
  cache.setIfCurrent('2026-08-07', emptyResult, initialGeneration, 1000);
  assert.deepEqual(cache.get('2026-08-07', 1001), emptyResult);

  cache.invalidate('2026-08-07');
  assert.equal(cache.get('2026-08-07', 1002), undefined);

  cache.setIfCurrent('2026-08-07', emptyResult, initialGeneration, 1003);
  assert.equal(cache.get('2026-08-07', 1004), undefined);
});

test('sample description utilities omit masterId when it has no value', () => {
  const snapshot = getSampleDescriptionSnapshot({
    M1: { masterId: undefined, nameSnapshot: 'Nước' }
  }, 'M1');
  assert.deepEqual(snapshot, { nameSnapshot: 'Nước' });

  const updated = setSampleDescriptionSnapshot({}, 'M1', { nameSnapshot: 'Nước' });
  assert.deepEqual(updated, { M1: { nameSnapshot: 'Nước' } });
});

test('materialized payloads contain no undefined values at the Firestore boundary', () => {
  const entry = buildDailyChecklistEntry(request('REQ-1', '2026-08-07', {
    sampleDescriptionMap: {
      M1: { masterId: undefined, nameSnapshot: 'Nước' }
    }
  }));
  assert.ok(entry);
  const payload = buildDailyChecklistSetPayload('2026-08-07', [entry], 'timestamp');
  assert.equal(containsUndefined(payload), false);
});

test('multiple requests are grouped into one projection write per analysis date', () => {
  const grouped = groupDailyChecklistEntriesByDate([
    request('REQ-1', '2026-08-07'),
    request('REQ-2', '2026-08-07'),
    request('REQ-3', '2026-08-08')
  ]);
  assert.equal(grouped.size, 2);
  assert.deepEqual(grouped.get('2026-08-07')?.map(entry => entry.requestId), ['REQ-1', 'REQ-2']);
  assert.deepEqual(grouped.get('2026-08-08')?.map(entry => entry.requestId), ['REQ-3']);
});

test('projection failure is isolated and does not propagate to the source workflow', async () => {
  const originalError = console.error;
  console.error = () => undefined;
  try {
    const success = await runDailyChecklistProjectionBestEffort(async () => {
      throw new Error('projection unavailable');
    }, 'regression-test');
    assert.equal(success, false);
  } finally {
    console.error = originalError;
  }
});
