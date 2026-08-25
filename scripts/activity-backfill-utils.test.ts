import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildActorIndex,
  buildLegacyActorAliasMap,
  classifyLegacyActivity,
  resolveLegacyActor
} from './activity-backfill-utils';

const users = buildActorIndex([
  { uid: 'uid-admin', displayName: 'Admin Lab', email: 'admin@example.com' },
  { uid: 'uid-lab', displayName: 'Lab A', email: 'lab@example.com' },
  { uid: 'uid-dup-1', displayName: 'Same Name', email: 'one@example.com' },
  { uid: 'uid-dup-2', displayName: 'Same Name', email: 'two@example.com' }
]);

test('actor mapping follows UID, email, then unique displayName and never guesses ambiguous names', () => {
  assert.equal(resolveLegacyActor('uid-admin', users).status, 'RESOLVED');
  assert.deepEqual(resolveLegacyActor('LAB@EXAMPLE.COM', users), {
    status: 'RESOLVED', uid: 'uid-lab', actorName: 'Lab A', matchedBy: 'email'
  });
  assert.deepEqual(resolveLegacyActor('Lab A', users), {
    status: 'RESOLVED', uid: 'uid-lab', actorName: 'Lab A', matchedBy: 'displayName'
  });
  assert.deepEqual(resolveLegacyActor('Same Name', users), {
    status: 'UNRESOLVED', legacyUser: 'Same Name', reason: 'ambiguous'
  });
});

test('explicit legacy actor aliases resolve to a canonical profile without changing normal precedence', () => {
  const aliases = buildLegacyActorAliasMap({ 'Quản trị viên': 'admin@example.com' });
  assert.deepEqual(resolveLegacyActor('Quản trị viên', users, aliases), {
    status: 'RESOLVED', uid: 'uid-admin', actorName: 'Admin Lab', matchedBy: 'legacyAlias'
  });

  const result = classifyLegacyActivity('legacy-admin', {
    action: 'SAVE_RESULT_DRAFT',
    user: 'Quản trị viên',
    requestId: 'REQ-ADMIN-01',
    details: 'Lưu nháp'
  }, users, aliases);
  assert.equal(result.status, 'MIGRATABLE');
  assert.equal(result.actor?.matchedBy, 'legacyAlias');
  assert.equal(result.patch?.['actorUid'], 'uid-admin');
});

test('known legacy actions receive deterministic V2 classification and traceability flag', () => {
  const result = classifyLegacyActivity('TRC-123', {
    action: 'APPROVE_REQUEST',
    user: 'Admin Lab',
    requestId: 'REQ-123',
    details: 'Duyệt yêu cầu',
    printable: true
  }, users);

  assert.equal(result.status, 'MIGRATABLE');
  assert.equal(result.patch?.['eventId'], 'TRC-123');
  assert.equal(result.patch?.['module'], 'RESULT');
  assert.equal(result.patch?.['audience'], 'RESULT_VIEW');
  assert.equal(result.patch?.['actorUid'], 'uid-admin');
  assert.equal(result.patch?.['publicTraceable'], true);
  assert.equal(result.patch?.['actionUrl'], '/requests');
});

test('historical daily checklist actions are classified as result-operator events', () => {
  const checked = classifyLegacyActivity('daily-check-01', {
    action: 'DAILY_CHECK_ITEM',
    user: 'Lab A',
    requestId: 'REQ-DAILY-01',
    targetId: 'sample-01',
    details: 'Check mẫu'
  }, users);
  assert.equal(checked.status, 'MIGRATABLE');
  assert.equal(checked.patch?.['module'], 'RESULT');
  assert.equal(checked.patch?.['audience'], 'RESULT_OPERATOR');
  assert.equal(checked.patch?.['importance'], 'NORMAL');
  assert.equal(checked.patch?.['targetType'], 'REQUEST');
  assert.equal(checked.patch?.['actionUrl'], '/results/REQ-DAILY-01');

  const unchecked = classifyLegacyActivity('daily-uncheck-01', {
    action: 'DAILY_UNCHECK_ITEM',
    user: 'Lab A',
    requestId: 'REQ-DAILY-01',
    details: 'Bỏ check mẫu'
  }, users);
  assert.equal(unchecked.status, 'MIGRATABLE');
  assert.equal(unchecked.patch?.['importance'], 'WARNING');
  assert.equal(unchecked.patch?.['activityVisible'], true);
});

test('backfill canonicalizes stale actor names and does not expose printable-only legacy logs', () => {
  const staleName = classifyLegacyActivity('legacy-result', {
    action: 'APPROVE_REQUEST',
    user: 'Lab A',
    actorName: 'Old Lab Name',
    requestId: 'REQ-01',
    details: 'Duyệt yêu cầu'
  }, users);
  assert.equal(staleName.status, 'MIGRATABLE');
  assert.equal(staleName.patch?.['actorUid'], 'uid-lab');
  assert.equal(staleName.patch?.['actorName'], 'Lab A');
  assert.equal(staleName.patch?.['user'], 'Lab A');
  assert.equal(staleName.patch?.['publicTraceable'], false);

  const printableOnly = classifyLegacyActivity('print-01', {
    action: 'APPROVE_REQUEST',
    user: 'Admin Lab',
    requestId: 'REQ-PRINT',
    details: 'Phiếu in cũ',
    printable: true,
    printJobId: 'job-01'
  }, users);
  assert.equal(printableOnly.status, 'MIGRATABLE');
  assert.equal(printableOnly.patch?.['publicTraceable'], false);
});

test('backfill reports malformed V2 markers instead of silently rewriting them', () => {
  const result = classifyLegacyActivity('evt-invalid', {
    schemaVersion: 2,
    eventId: 'evt-invalid',
    id: 'evt-invalid',
    action: 'SAVE_RESULT_DRAFT',
    actorUid: 'uid-lab',
    actorName: 'Lab A',
    user: 'Lab A',
    module: 'SYSTEM',
    audience: 'SYSTEM_ADMIN',
    importance: 'NORMAL',
    auditClass: 'SYSTEM',
    activityVisible: true,
    publicTraceable: false,
    details: 'Malformed classification',
    timestamp: new Date()
  }, users);
  assert.deepEqual(result, {
    status: 'INVALID_V2',
    action: 'SAVE_RESULT_DRAFT',
    reason: 'CLASSIFICATION_MISMATCH'
  });
});

test('unknown action and unresolved actor fail closed', () => {
  assert.equal(classifyLegacyActivity('x', { action: 'MYSTERY', user: 'Admin Lab' }, users).status, 'UNKNOWN_ACTION');
  assert.equal(classifyLegacyActivity('x', { action: 'SAVE_RESULT_DRAFT', user: 'Nobody' }, users).status, 'UNRESOLVED_ACTOR');
});

test('canonical V2 documents are idempotently classified as already migrated', () => {
  const result = classifyLegacyActivity('evt-1', {
    id: 'evt-1',
    schemaVersion: 2,
    eventId: 'evt-1',
    action: 'SAVE_RESULT_DRAFT',
    actorUid: 'uid-lab',
    actorName: 'Lab A',
    module: 'RESULT',
    audience: 'RESULT_OPERATOR',
    importance: 'NORMAL',
    auditClass: 'BUSINESS',
    activityVisible: true,
    publicTraceable: false,
    user: 'Lab A',
    details: 'Canonical event',
    timestamp: new Date()
  }, users);
  assert.equal(result.status, 'ALREADY_V2');
  assert.equal(result.patch, undefined);
});
