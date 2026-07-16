import assert from 'node:assert/strict';
import test from 'node:test';
import { Request } from '../../core/models/request.model';
import { getAssignedTargetsForSample } from '../results/shared/compound-id-resolver';
import {
  buildApprovedBatchOverviews,
  buildDailyPrintSopGroups,
  getRequestDateValue,
  isValidDateInput,
  toDate
} from './daily-checklist.utils';

function request(overrides: Partial<Request> = {}): Request {
  return {
    id: 'REQ-1',
    sopId: 'SOP-1',
    sopName: 'SOP kiểm thử',
    items: [],
    status: 'approved',
    timestamp: new Date('2026-07-16T00:00:00Z'),
    analysisDate: '2026-07-16',
    sampleList: ['A001'],
    targetIds: ['target-fallback'],
    ...overrides
  };
}

test('canonical sample lookup handles case, whitespace and pooled samples', () => {
  const map = {
    ' a001 ': ['target-1'],
    A002: ['target-2']
  };

  assert.deepEqual(getAssignedTargetsForSample('A001', map), ['target-1']);
  assert.deepEqual(getAssignedTargetsForSample('a001; a002', map), ['target-1', 'target-2']);
  assert.equal(getAssignedTargetsForSample('A001;missing', map), null);
});

test('daily overview uses canonical assignments and immutable target-name snapshots', () => {
  const batches = buildApprovedBatchOverviews([
    request({
      sampleList: [' A001 '],
      sampleTargetMap: { a001: ['target-1'] },
      targetNames: { 'target-1': 'Tên tại thời điểm tạo mẻ' }
    })
  ], '2026-07-16', (item, targetId) => item.targetNames?.[targetId] || targetId);

  assert.equal(batches.length, 1);
  assert.deepEqual(batches[0].samples[0].targetIds, ['target-1']);
  assert.deepEqual(batches[0].samples[0].targetNames, ['Tên tại thời điểm tạo mẻ']);
});

test('SOP sample count is unique while groups remain separated by request', () => {
  const batches = buildApprovedBatchOverviews([
    request({ id: 'REQ-1' }),
    request({ id: 'REQ-2' })
  ], '2026-07-16', (_item, targetId) => targetId);

  const groups = buildDailyPrintSopGroups(batches);
  assert.equal(groups[0].uniqueSamples, 1);
  assert.equal(groups[0].groups.length, 2);
});

test('missing analysisDate is not silently replaced by approval date', () => {
  assert.equal(getRequestDateValue(request({ analysisDate: undefined })), '');
  assert.equal(toDate({ seconds: 1_752_624_000 })?.getTime(), 1_752_624_000_000);
  assert.equal(isValidDateInput('2026-02-30'), false);
});
