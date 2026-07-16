import assert from 'node:assert/strict';
import test from 'node:test';
import { TargetGroup } from '../../core/models/sop.model';
import {
  buildTargetScopePresentation,
  buildTargetScopeSnapshots,
  classifyTargetScope,
  computeTargetSignature
} from './target-scope-classifier';

const group = (id: string, name: string, ids: string[]): TargetGroup => ({
  id,
  name,
  targets: ids.map(targetId => ({ id: targetId, name: targetId }))
});

test('signature is order independent, canonical and collision free for separators', () => {
  assert.equal(computeTargetSignature([' Target A ', 'target-b']), computeTargetSignature(['target-b', 'target_a']));
  assert.notEqual(computeTargetSignature(['a', 'bc']), computeTargetSignature(['ab', 'c']));
});

test('exact full SOP selection is compacted but a partial selection remains manual', () => {
  const common = { sopId: 'SOP-1', sopVersion: 3, sopTargetSnapshot: { a: 'A', b: 'B' } };
  assert.equal(classifyTargetScope({ ...common, assignedTargetIds: ['B', 'A'] }).kind, 'sop-all');
  assert.equal(classifyTargetScope({ ...common, assignedTargetIds: ['a'] }).kind, 'manual');
});

test('unique exact group match is compact and duplicate matches are ambiguous', () => {
  const first = group('G1', 'Nhóm 1', ['a', 'b']);
  const second = group('G2', 'Nhóm 2', ['b', 'a']);
  assert.equal(classifyTargetScope({ assignedTargetIds: ['a', 'b'], sopId: 'S', availableGroups: [first] }).kind, 'target-group');
  const ambiguous = classifyTargetScope({ assignedTargetIds: ['a', 'b'], sopId: 'S', availableGroups: [first, second] });
  assert.equal(ambiguous.kind, 'ambiguous');
  assert.equal(buildTargetScopePresentation(['A', 'B'], ambiguous).compact, false);
});

test('stored snapshot wins over changed current configuration', () => {
  const snapshots = buildTargetScopeSnapshots({
    sampleTargetMap: { M1: ['a', 'b'] },
    sopId: 'S',
    availableGroups: [group('G1', 'Tên tại lúc tạo', ['a', 'b'])],
    capturedAt: '2026-07-16T00:00:00.000Z'
  });
  const result = classifyTargetScope({
    assignedTargetIds: ['a', 'b'],
    sopId: 'S',
    storedSnapshots: snapshots,
    availableGroups: [group('G1', 'Tên đã đổi', ['a'])]
  });
  assert.equal(result.kind, 'target-group');
  assert.equal(result.sourceName, 'Tên tại lúc tạo');
  assert.equal(result.traceability, 'snapshot');
});

test('explicit group provenance is accepted only for an exact target set', () => {
  const targetGroup = group('G1', 'Bộ thuốc trừ sâu', ['a', 'b']);
  const exact = buildTargetScopeSnapshots({
    sampleTargetMap: { M1: ['a', 'b'] }, sopId: 'S', availableGroups: [targetGroup], explicitGroupId: 'G1'
  });
  const changed = buildTargetScopeSnapshots({
    sampleTargetMap: { M1: ['a'] }, sopId: 'S', availableGroups: [targetGroup], explicitGroupId: 'G1'
  });
  assert.equal(exact[0].kind, 'target-group');
  assert.equal(changed[0].kind, 'manual');
});

test('all 38 SOP targets are classified as sop-all', () => {
  const ids = Array.from({ length: 38 }, (_, index) => `target-${index + 1}`);
  const snapshot = Object.fromEntries(ids.map(id => [id, id]));
  assert.equal(classifyTargetScope({ assignedTargetIds: ids, sopId: 'S', sopTargetSnapshot: snapshot }).kind, 'sop-all');
});

test('an extra target prevents sop-all classification', () => {
  assert.equal(classifyTargetScope({
    assignedTargetIds: ['a', 'b', 'extra'], sopId: 'S', sopTargetSnapshot: { a: 'A', b: 'B' }
  }).kind, 'manual');
});

test('SOP classification is case insensitive', () => {
  assert.equal(classifyTargetScope({
    assignedTargetIds: ['TARGET A'], sopId: 'S', sopTargetSnapshot: { target_a: 'Target A' }
  }).kind, 'sop-all');
});

test('SOP classification ignores assignment order', () => {
  assert.equal(classifyTargetScope({
    assignedTargetIds: ['c', 'a', 'b'], sopId: 'S', sopTargetSnapshot: { a: 'A', b: 'B', c: 'C' }
  }).kind, 'sop-all');
});

test('duplicate assigned IDs are removed before classification', () => {
  assert.equal(classifyTargetScope({
    assignedTargetIds: ['a', 'A', 'a'], sopId: 'S', sopTargetSnapshot: { a: 'A' }
  }).kind, 'sop-all');
});

test('legacy request without scope snapshots uses derived classification', () => {
  const result = classifyTargetScope({
    assignedTargetIds: ['a'], sopId: 'S', sopTargetSnapshot: { a: 'Tên lịch sử' }
  });
  assert.equal(result.kind, 'sop-all');
  assert.equal(result.traceability, 'legacy-derived');
});
