import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const rules = readFileSync(resolve(process.cwd(), 'firestore.rules'), 'utf8');
const smartBatchSource = readFileSync(
  resolve(process.cwd(), 'src/app/features/batch/smart-batch.component.ts'),
  'utf8'
);
const printQueueSource = readFileSync(
  resolve(process.cwd(), 'src/app/features/requests/print-queue.component.ts'),
  'utf8'
);
const configGeneralSource = readFileSync(
  resolve(process.cwd(), 'src/app/features/config/components/config-general.component.ts'),
  'utf8'
);
const configGeneralTemplate = readFileSync(
  resolve(process.cwd(), 'src/app/features/config/components/config-general.component.html'),
  'utf8'
);

function ruleBlock(startMarker: string, endMarker: string): string {
  const start = rules.indexOf(startMarker);
  const end = rules.indexOf(endMarker, start + startMarker.length);
  assert.notEqual(start, -1, `${startMarker} must exist`);
  assert.notEqual(end, -1, `${endMarker} must exist after ${startMarker}`);
  return rules.slice(start, end);
}

test('print jobs are not public and signed-in users do not receive blanket write access', () => {
  const block = ruleBlock(
    'match /artifacts/{appId}/print_jobs/{jobId}',
    '// Thu vien Target Master'
  );
  assert.doesNotMatch(block, /allow read:\s*if\s*true/);
  assert.doesNotMatch(block, /allow write:\s*if\s*isSignedIn\(\)/);
  assert.match(block, /allow get, list:\s*if canUseSopWorkspace\(appId\)/);
  assert.match(block, /createdByUid/);
  assert.match(block, /allow update:\s*if false/);
});

test('batch_run cannot approve or arbitrarily rewrite an existing request', () => {
  const block = ruleBlock(
    'match /artifacts/{appId}/requests/{reqId}',
    'match /artifacts/{appId}/daily_checklists/{analysisDate}'
  );
  assert.doesNotMatch(block, /allow write:\s*if[^;]*batch_run/);
  assert.match(block, /validBatchRequestUpdate\(appId\)/);
  assert.match(rules, /fromStatus == 'approved' && toStatus == 'draft'/);
  assert.doesNotMatch(rules, /fromStatus == 'pending' && toStatus == 'approved'/);
});

test('master data writes are manager-only', () => {
  for (const collectionName of ['master_targets', 'master_analytes', 'matrix_types', 'master_devices']) {
    const marker = `match /artifacts/{appId}/${collectionName}/{docId}`;
    const start = rules.indexOf(marker);
    assert.notEqual(start, -1, `${collectionName} rule must exist`);
    const block = rules.slice(start, rules.indexOf('\n    }', start) + 6);
    assert.match(block, /allow write:\s*if isManager\(appId\)/);
    assert.doesNotMatch(block, /allow read, write:\s*if isSignedIn\(\)/);
  }
});

test('result details require an operational role to write', () => {
  const block = ruleBlock(
    'match /artifacts/{appId}/results_details/{docId}',
    '// Yeu cau in an nhan / barcode'
  );
  assert.match(block, /allow create, update:\s*if canEditResults\(appId\)/);
  assert.doesNotMatch(block, /allow read, write:\s*if isSignedIn\(\)/);
});

test('audit log creation validates permission, actor identity and server timestamp', () => {
  const block = rules.slice(rules.indexOf('match /artifacts/{appId}/logs/{logId}'));
  assert.match(block, /allow create:\s*if canCreateAuditLog\(appId\) && validAuditLogCreate/);
  assert.match(rules, /isCurrentActorName\(appId, data\.get\('user', ''\)\)/);
  assert.match(rules, /data\.timestamp == request\.time/);
});

test('an unselected matrix remains any and the obsolete parent split filter stays removed', () => {
  assert.doesNotMatch(smartBatchSource, /find\([^\n]*isDefault/);
  assert.doesNotMatch(smartBatchSource, /filteredSopsForSplit\s*=/);
  assert.match(smartBatchSource, /createEmptyBlock\(`Nhóm mẫu #\$\{b\.length \+ 1\}`\)/);
});

test('print queue selects the global or personal log listener through the permission-aware state helper', () => {
  assert.match(printQueueSource, /this\.state\.ensureActivityFeedListeners\(\)/);
  assert.doesNotMatch(printQueueSource, /this\.state\.ensureLogsListener\(\)/);
});

test('config screen no longer embeds or copies a deployable Firestore ruleset', () => {
  assert.doesNotMatch(configGeneralSource, /firestoreRules\s*=\s*computed/);
  assert.doesNotMatch(configGeneralSource, /copyRules\s*\(/);
  assert.doesNotMatch(configGeneralTemplate, /copyRules\s*\(/);
  assert.doesNotMatch(configGeneralTemplate, /firestoreRules\(\)/);
  assert.match(configGeneralSource, /firestoreRulesNotice/);
});

test('SmartBatch canonicalizes imported target groups and Auto Fix target membership', () => {
  assert.match(smartBatchSource, /getCanonicalId\(target\.name \|\| target\.id\)/);
  assert.match(smartBatchSource, /selectedTargetSetHas\(b\.selectedTargets, task\.targetId\)/);
  assert.match(smartBatchSource, /selectedTargetSetWithout\(block\.selectedTargets, targetId\)/);
});
