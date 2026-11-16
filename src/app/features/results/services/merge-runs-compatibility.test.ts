import assert from 'node:assert/strict';
import test from 'node:test';
import {
  isRunCandidateCompatibleForMerge,
  validateMergeRuns,
} from './merge-runs-compatibility';

test('detects incompatible SOPs, units, locked runs, and duplicate sample codes during merge validation', () => {
  const run1 = {
    id: 'r1',
    sopId: 'SOP-02',
    sopName: 'Nhóm Lân hữu cơ',
    sampleList: ['A01', 'A02'],
    inputs: { unit: 'µg/kg', batchCode: 'B1' },
  };
  const run2 = {
    id: 'r2',
    sopId: 'SOP-02',
    sopName: 'Nhóm Lân hữu cơ',
    sampleList: ['A02', 'A03'],
    inputs: { unit: 'µg/kg', batchCode: 'B2' },
  };
  const diffSop = { id: 'r3', sopId: 'SOP-01', sopName: 'Fipronil', sampleList: ['B01'] };
  const diffUnit = { ...run2, id: 'r4', inputs: { unit: 'mg/kg', batchCode: 'B4' } };

  assert.equal(isRunCandidateCompatibleForMerge(run1, run2).compatible, true);
  assert.equal(isRunCandidateCompatibleForMerge(run1, diffSop).compatible, false);
  assert.equal(isRunCandidateCompatibleForMerge(run1, diffUnit).compatible, false);

  const validWithDupUnresolved = validateMergeRuns({
    selectedRuns: [run1, run2],
    capability: { canRunBatch: true },
    userEmail: 'ktv@lab.test',
  });
  assert.equal(validWithDupUnresolved.canMerge, false);
  assert.equal(validWithDupUnresolved.canOpenModal, true);
  assert.deepEqual(validWithDupUnresolved.duplicateSamples, ['A02']);
  assert.deepEqual(validWithDupUnresolved.unresolvedDuplicateSamples, ['A02']);
  assert.deepEqual(validWithDupUnresolved.mergedSamples, ['A01', 'A02', 'A03']);
  assert.ok(validWithDupUnresolved.blockers.some(b => b.includes('chọn mẻ nguồn')));

  const invalidSource = validateMergeRuns({
    selectedRuns: [run1, run2],
    capability: { canRunBatch: true },
    userEmail: 'ktv@lab.test',
    duplicateSampleSources: { A02: 'nonexistent-run' },
  });
  assert.equal(invalidSource.canMerge, false);
  assert.deepEqual(invalidSource.unresolvedDuplicateSamples, ['A02']);

  const validWithDupResolved = validateMergeRuns({
    selectedRuns: [run1, run2],
    capability: { canRunBatch: true },
    userEmail: 'ktv@lab.test',
    duplicateSampleSources: { A02: 'r1' },
  });
  assert.equal(validWithDupResolved.canMerge, true);
  assert.deepEqual(validWithDupResolved.unresolvedDuplicateSamples, []);
  assert.deepEqual(validWithDupResolved.blockers, []);
  assert.ok(validWithDupResolved.warnings.some(w => w.includes('Đã chỉ định nguồn kết quả')));

  const locked = validateMergeRuns({
    selectedRuns: [run1, { ...run2, lockedBy: 'other@lab.test', lastActiveAt: new Date() }],
    capability: { canRunBatch: true },
    userEmail: 'ktv@lab.test',
  });
  assert.equal(locked.canMerge, false);
  assert.ok(locked.blockers.some(b => b.includes('khóa sửa')));
});
