import assert from 'node:assert/strict';
import test from 'node:test';
import { Request } from '../models/request.model';
import {
  buildDailyChecklistEntry,
  dailyChecklistDocumentToRequests
} from './daily-checklist-projection';

function request(overrides: Partial<Request> = {}): Request {
  return {
    id: 'REQ-1',
    sopId: 'SOP-1',
    sopName: 'SOP kiểm nghiệm',
    items: [{ name: 'CHEM-1', amount: 10, displayAmount: 10, unit: 'g', stockUnit: 'g' }],
    status: 'approved',
    timestamp: { seconds: 1 },
    approvedAt: { seconds: 2 },
    analysisDate: '2026-08-06',
    user: 'KNV A',
    sampleList: ['M1', 'M2'],
    targetIds: ['T1'],
    sampleTargetMap: { M1: ['T1'], M2: ['T2'] },
    sampleDescriptionMap: { M1: { masterId: 'D1', nameSnapshot: 'Nước' } },
    targetNames: { T1: 'Chỉ tiêu 1', T2: 'Chỉ tiêu 2' },
    targetScopeSnapshots: [{
      signature: 't1',
      kind: 'manual',
      assignedTargetIds: ['T1'],
      sopId: 'SOP-1',
      traceability: 'snapshot'
    }],
    inputs: { largePayload: 'must-not-be-copied' },
    ...overrides
  };
}

test('builds a compact request projection keyed by samples and targets', () => {
  const entry = buildDailyChecklistEntry(request());
  assert.ok(entry);
  assert.equal(entry.requestId, 'REQ-1');
  assert.deepEqual(entry.samples, [
    {
      sampleId: 'M1',
      targetIds: ['T1'],
      targetNames: ['Chỉ tiêu 1'],
      description: { masterId: 'D1', nameSnapshot: 'Nước' }
    },
    {
      sampleId: 'M2',
      targetIds: ['T2'],
      targetNames: ['Chỉ tiêu 2']
    }
  ]);
  assert.equal('items' in entry, false);
  assert.equal('inputs' in entry, false);
});

test('round-trips a daily document into lightweight Request objects', () => {
  const entry = buildDailyChecklistEntry(request())!;
  const [restored] = dailyChecklistDocumentToRequests({
    schemaVersion: 1,
    analysisDate: '2026-08-06',
    entries: { 'REQ-1': entry }
  }, '2026-08-06');
  assert.equal(restored.id, 'REQ-1');
  assert.equal(restored.status, 'approved');
  assert.deepEqual(restored.sampleList, ['M1', 'M2']);
  assert.deepEqual(restored.sampleTargetMap, { M1: ['T1'], M2: ['T2'] });
  assert.deepEqual(restored.targetNames, { T1: 'Chỉ tiêu 1', T2: 'Chỉ tiêu 2' });
});

test('excludes pending requests and virtual master runs', () => {
  assert.equal(buildDailyChecklistEntry(request({ status: 'pending' })), null);
  assert.equal(buildDailyChecklistEntry(request({ isVirtualMaster: true })), null);
});

test('preserves fallback targets for requests without a sample list', () => {
  const entry = buildDailyChecklistEntry(request({
    sampleList: [],
    sampleTargetMap: {},
    targetIds: ['T1', 'T2']
  }))!;
  assert.deepEqual(entry.fallbackTargetIds, ['T1', 'T2']);

  const [restored] = dailyChecklistDocumentToRequests({
    schemaVersion: 1,
    analysisDate: '2026-08-06',
    entries: { 'REQ-1': entry }
  }, '2026-08-06');
  assert.deepEqual(restored.targetIds, ['T1', 'T2']);
});
