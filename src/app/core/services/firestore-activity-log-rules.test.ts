import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

test('global activity logs use V2 create validation and separated read policies', () => {
  const rules = readFileSync(resolve(process.cwd(), 'firestore.rules'), 'utf8');
  const marker = 'match /artifacts/{appId}/logs/{logId} {';
  const start = rules.indexOf(marker);
  assert.notEqual(start, -1, 'global activity-log rule block must exist');

  const block = rules.slice(start, rules.indexOf('\n    }', start) + 6);
  assert.match(block, /validCanonicalActivityCreate\(appId, logId, request\.resource\.data\)/);
  assert.match(block, /allow get:\s*if canGetGlobalLog\(appId, resource\.data\)/);
  assert.match(block, /allow list:\s*if canListGlobalLog\(appId, resource\.data\)/);
  assert.doesNotMatch(block, /allow get:\s*if true/);
  assert.match(rules, /data\.get\('actorUid', ''\) == request\.auth\.uid/);
  assert.match(rules, /validActivityClassification\(data\)/);
  assert.match(rules, /data\.get\('publicTraceable', false\) == true/);
  assert.match(rules, /data\.get\('auditClass', ''\) == 'BUSINESS'/);
  assert.match(rules, /audience == 'SYSTEM_ADMIN' && hasPermission\(appId, 'user_manage'\)/);
});

test('canonical Activity readers no longer depend on the legacy StateService log stream', () => {
  const auditSource = readFileSync(
    resolve(process.cwd(), 'src/app/core/services/audit-log.service.ts'),
    'utf8'
  );
  const stateSource = readFileSync(
    resolve(process.cwd(), 'src/app/core/services/state.service.ts'),
    'utf8'
  );

  assert.match(auditSource, /where\('auditClass', '==', 'BUSINESS'\)/);
  assert.doesNotMatch(stateSource, /ensureLogsListener\(\)/);
  assert.doesNotMatch(stateSource, /ensurePersonalLogsListener\(\)/);
  assert.doesNotMatch(stateSource, /where\('user', '==', displayName\)/);
  assert.doesNotMatch(stateSource, /globalLogsCache|personalLogsCache|printableLogs/);
  assert.match(readFileSync(resolve(process.cwd(), 'firestore.rules'), 'utf8'), /data\.get\('actorUid', ''\) == request\.auth\.uid/);
});

test('lastActivitySeenAt preference is owner-only and independent from notification read state', () => {
  const rules = readFileSync(resolve(process.cwd(), 'firestore.rules'), 'utf8');
  const marker = 'match /artifacts/{appId}/user_preferences/{uid} {';
  const start = rules.indexOf(marker);
  assert.notEqual(start, -1, 'user preference rule block must exist');
  const block = rules.slice(start, rules.indexOf('\n    }', start) + 6);

  assert.match(block, /request\.auth\.uid == uid/);
  assert.match(block, /keys\(\)\.hasOnly\(\['lastActivitySeenAt'\]\)/);
  assert.match(block, /affectedKeys\(\)\.hasOnly\(\['lastActivitySeenAt'\]\)/);
  assert.match(block, /lastActivitySeenAt == request\.time/);
  assert.doesNotMatch(block, /isManager\(/);
  assert.doesNotMatch(block, /isRead/);
});
