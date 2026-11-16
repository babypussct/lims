import assert from 'node:assert/strict';
import test from 'node:test';
import {
  canUserEditResults,
  evaluateResultWriteGuard,
  isRunActivelyLockedByOthers,
  RESULT_LOCK_LEASE_MS,
} from './result-write-guard';

test('denies write operations when user only has SOP_VIEW without batch_run or sop_approve', () => {
  const viewerCap = { permissions: ['sop_view'] };
  assert.equal(canUserEditResults(viewerCap), false);

  const ops = [
    'autosave',
    'manual_save',
    'import',
    'publish',
    'restore',
    'reset',
    'unlock',
    'delete_master',
    'merge',
    'acquire_lock',
  ] as const;

  for (const operation of ops) {
    const res = evaluateResultWriteGuard({
      capability: viewerCap,
      userEmail: 'viewer@lab.test',
      run: { id: 'r1', status: 'draft', isVirtualMaster: true },
      draftStatus: 'draft',
      operation,
    });
    assert.equal(res.allowed, false, `expected ${operation} to be denied`);
    assert.equal(res.code, 'no_permission');
  }
});

test('requires batch_run or manager capabilities and separates SOP approval', () => {
  assert.equal(canUserEditResults({ canRunBatch: true }), true);
  assert.equal(canUserEditResults({ canApprove: true }), false);
  assert.equal(canUserEditResults({ permissions: ['sop_approve'] }), false);
  assert.equal(canUserEditResults({ isManager: true }), true);
  assert.equal(canUserEditResults({ permissions: ['batch_run'] }), true);
});

test('blocks active locks held by other users within 3-minute lease and releases stale locks', () => {
  const nowMs = Date.UTC(2026, 10, 16, 10, 0, 0);
  const freshRun = {
    id: 'r1',
    status: 'draft',
    lockedBy: 'ktv.a@lab.test',
    lockedByName: 'KTV A',
    lastActiveAt: new Date(nowMs - 60_000),
  };

  assert.equal(isRunActivelyLockedByOthers(freshRun, 'ktv.b@lab.test', nowMs), true);
  assert.equal(isRunActivelyLockedByOthers(freshRun, 'KTV.A@LAB.TEST', nowMs), false);

  const guard = evaluateResultWriteGuard({
    capability: { canRunBatch: true },
    userEmail: 'ktv.b@lab.test',
    run: freshRun,
    draftStatus: 'draft',
    operation: 'autosave',
    nowMs,
  });
  assert.equal(guard.allowed, false);
  assert.equal(guard.code, 'locked_by_others');

  // Lease expired after 3 minutes
  const staleRun = {
    ...freshRun,
    lastActiveAt: new Date(nowMs - RESULT_LOCK_LEASE_MS - 1_000),
  };
  assert.equal(isRunActivelyLockedByOthers(staleRun, 'ktv.b@lab.test', nowMs), false);
  const staleGuard = evaluateResultWriteGuard({
    capability: { canRunBatch: true },
    userEmail: 'ktv.b@lab.test',
    run: staleRun,
    draftStatus: 'draft',
    operation: 'autosave',
    nowMs,
  });
  assert.equal(staleGuard.allowed, true);
});

test('blocks autosave, manual_save, import, and concurrent edits during publish or completed state', () => {
  const cap = { canRunBatch: true };
  const run = { id: 'r1', status: 'completed' };

  for (const op of ['autosave', 'manual_save', 'import', 'publish', 'acquire_lock'] as const) {
    const res = evaluateResultWriteGuard({
      capability: cap,
      userEmail: 'ktv@lab.test',
      run,
      draftStatus: 'completed',
      operation: op,
    });
    assert.equal(res.allowed, false);
    assert.equal(res.code, 'completed');
  }

  // Unlock is allowed on completed
  assert.equal(
    evaluateResultWriteGuard({
      capability: cap,
      userEmail: 'ktv@lab.test',
      run,
      draftStatus: 'completed',
      operation: 'unlock',
    }).allowed,
    true
  );

  // Publishing blocks concurrent edits
  const duringPublish = evaluateResultWriteGuard({
    capability: cap,
    userEmail: 'ktv@lab.test',
    run: { id: 'r1', status: 'draft' },
    draftStatus: 'draft',
    isPublishing: true,
    operation: 'autosave',
  });
  assert.equal(duringPublish.allowed, false);
  assert.equal(duringPublish.code, 'publishing');
});
