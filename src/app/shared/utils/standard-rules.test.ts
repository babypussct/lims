import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const rules = readFileSync(resolve(process.cwd(), 'firestore.rules'), 'utf8');

test('user profiles cannot self-assign roles or permissions', () => {
  const usersBlock = rules.slice(
    rules.indexOf('match /artifacts/{appId}/users/{uid}'),
    rules.indexOf('match /artifacts/{appId}/roles_config/{roleId}')
  );
  assert.match(usersBlock, /affectedKeys\(\)\.hasOnly/);
  assert.doesNotMatch(usersBlock, /allow write:/);
  assert.doesNotMatch(usersBlock, /'role'\s*,\s*'permissions'/);
});

test('standard requests are owner-scoped and physical deletes are denied', () => {
  const requestsBlock = rules.slice(
    rules.indexOf('match /artifacts/{appId}/standard_requests/{reqId}'),
    rules.indexOf('match /artifacts/{appId}/purchase_requests/{reqId}')
  );
  assert.match(requestsBlock, /resource\.data\.requestedBy == request\.auth\.uid/);
  assert.match(rules, /request\.resource\.data\.requestedBy == request\.auth\.uid/);
  assert.match(requestsBlock, /function validStandardRequestCreate\(appId\)/);
  assert.match(requestsBlock, /function validStandardRequestRollback\(appId\)/);
  assert.match(requestsBlock, /function validRequesterStandardRequestUpdate\(appId\)/);
  assert.match(requestsBlock, /function validStandardRequestUpdate\(appId\)/);
  assert.match(requestsBlock, /validStandardRequestCreate\(appId\)/);
  assert.match(requestsBlock, /validStandardRequestUpdate\(appId\)/);
  assert.match(requestsBlock, /allow delete: if false/);
});

test('reference standard update branches are named helpers instead of one compound rule', () => {
  const standardsBlock = rules.slice(
    rules.indexOf('match /artifacts/{appId}/reference_standards/{stdId}'),
    rules.indexOf('match /artifacts/{appId}/standard_cleanup_batches/{batchId}')
  );
  assert.match(standardsBlock, /allow update: if canUpdateReferenceStandard\(appId\)/);
  assert.match(standardsBlock, /function canApproveReferenceStandardUpdate\(appId\)/);
  assert.match(standardsBlock, /function canRequesterUpdateReferenceStandard\(appId\)/);
  assert.match(standardsBlock, /function canRollbackReferenceStandardUpdate\(appId\)/);
  assert.match(standardsBlock, /function canEditReferenceStandardMetadata\(appId\)/);
  assert.match(standardsBlock, /function canRepairReferenceStandardInternalId\(appId\)/);
  assert.match(standardsBlock, /function canReleaseReferenceStandardInternalId\(appId\)/);
  assert.match(standardsBlock, /function canUpdateReferenceStandard\(appId\)/);
});

test('internal-id lifecycle writes are bound to the canonical code and audited sync paths', () => {
  assert.match(rules, /function validInternalId\(value\)/);
  assert.match(rules, /match \/artifacts\/\{appId\}\/standard_code_registry\/\{code\}/);
  assert.match(rules, /validRegistryHolder\(appId\)/);
  assert.match(rules, /canReuseAssignedRegistrySlot\(appId\)/);
  assert.match(rules, /match \/artifacts\/\{appId\}\/standard_code_sync_batches\/\{batchId\}/);
  assert.match(rules, /canRepairStandardRequestSnapshot\(appId\)/);
  assert.match(rules, /canRepairStandardUsageSnapshot\(appId\)/);
  assert.match(rules, /canRepairNestedStandardUsageSnapshot\(appId, stdId\)/);
});

test('stats writes require an operational stats permission rather than any signed-in user', () => {
  const statsBlock = rules.slice(
    rules.indexOf('match /artifacts/{appId}/stats/{docId}'),
    rules.indexOf('match /artifacts/{appId}/monthly_stats/{docId}')
  );
  const monthlyStatsBlock = rules.slice(
    rules.indexOf('match /artifacts/{appId}/monthly_stats/{docId}'),
    rules.indexOf('match /artifacts/{appId}/notifications/{docId}')
  );
  assert.match(statsBlock, /allow write: if canUpdateStats\(appId\)/);
  assert.match(monthlyStatsBlock, /allow write: if canUpdateStats\(appId\)/);
  assert.doesNotMatch(statsBlock, /allow write: if isSignedIn\(\)/);
  assert.doesNotMatch(monthlyStatsBlock, /allow write: if isSignedIn\(\)/);
});

test('requester stock writes require the correlated secure usage protocol', () => {
  const standardsBlock = rules.slice(
    rules.indexOf('match /artifacts/{appId}/reference_standards/{stdId}'),
    rules.indexOf('match /artifacts/{appId}/standard_cleanup_batches/{batchId}')
  );
  assert.match(rules, /function validRequesterUsageStateTransition\(appId, stdId, logId\)/);
  assert.match(rules, /function validRequesterUsageJournalCreate\(appId, stdId, logId, data\)/);
  assert.match(standardsBlock, /function validRequesterUsageTransaction\(appId\)/);
  assert.match(standardsBlock, /validRequesterUsageStateTransition\(appId, stdId, usageLogId\)/);
  assert.match(rules, /getAfter\(\/databases\/\$\(database\)\/documents\/artifacts\/\$\(appId\)\/standard_usages\/\$\(logId\)\)/);
  assert.doesNotMatch(standardsBlock, /current_amount <= resource\.data\.current_amount/);
});

test('requester request mutations keep admin fields and legacy accounting outside lifecycle allowlists', () => {
  const requestsBlock = rules.slice(
    rules.indexOf('match /artifacts/{appId}/standard_requests/{reqId}'),
    rules.indexOf('match /artifacts/{appId}/purchase_requests/{reqId}')
  );
  const requesterCreate = requestsBlock.slice(
    requestsBlock.indexOf('function validRequesterStandardRequestCreate(appId)'),
    requestsBlock.indexOf('function validStandardRequestCreate(appId)')
  );
  const requesterLifecycle = requestsBlock.slice(
    requestsBlock.indexOf('function validRequesterReturnSubmission(appId)'),
    requestsBlock.indexOf('function validRequesterStandardRequestUpdate(appId)')
  );
  assert.match(requesterCreate, /data\.keys\(\)\.hasOnly/);
  assert.doesNotMatch(requesterCreate, /finalSopTags/);
  assert.doesNotMatch(requesterCreate, /confirmedAmountUsed/);
  assert.doesNotMatch(requesterCreate, /receivedBy/);
  assert.doesNotMatch(requesterLifecycle, /usageLogs/);
  assert.doesNotMatch(requesterLifecycle, /totalAmountUsed/);
  assert.match(requestsBlock, /changed\.hasOnly\(\['totalAmountUsed', 'lastUsageLogId', 'updatedAt', 'lastUpdated'\]\)/);
});

test('batch operators can only deduct inventory stock through constrained updates', () => {
  const inventoryBlock = rules.slice(
    rules.indexOf('match /artifacts/{appId}/inventory/{itemId}'),
    rules.indexOf('// MODULE CHUAN DOI CHIEU')
  );
  const inventoryTopLevel = inventoryBlock.slice(0, inventoryBlock.indexOf('// Lich su tieu hao'));
  assert.match(inventoryTopLevel, /hasPermission\(appId, 'batch_run'\)/);
  assert.match(inventoryTopLevel, /affectedKeys\(\)\.hasOnly\(\['stock', 'lastUpdated'\]\)/);
  assert.match(inventoryTopLevel, /request\.resource\.data\.stock >= 0/);
  assert.match(inventoryTopLevel, /request\.resource\.data\.stock <= resource\.data\.stock/);
  assert.doesNotMatch(inventoryTopLevel, /allow write:/);
});

test('cleanup batches are immutable except for the applied-to-undone transition', () => {
  const cleanupBlock = rules.slice(
    rules.indexOf('match /artifacts/{appId}/standard_cleanup_batches/{batchId}'),
    rules.indexOf('// Yeu cau mua chuan')
  );
  assert.match(cleanupBlock, /resource\.data\.status == 'APPLIED'/);
  assert.match(cleanupBlock, /request\.resource\.data\.status == 'UNDONE'/);
  assert.match(cleanupBlock, /affectedKeys\(\)\.hasOnly/);
  assert.match(cleanupBlock, /allow delete: if false/);
});

test('usage logs use tombstones instead of client-side physical deletes', () => {
  const usageBlock = rules.slice(
    rules.indexOf('match /artifacts/{appId}/standard_usages/{useId}'),
    rules.indexOf('// MODULE QUY TRÌNH SOP')
  );
  assert.match(usageBlock, /canRepairStandardUsageSnapshot/);
  assert.match(usageBlock, /canRollbackStandardLogs/);
  assert.match(usageBlock, /allow delete: if false/);
});

test('notifications are recipient-scoped and client creation is denied', () => {
  const notificationsBlock = rules.slice(
    rules.indexOf('match /artifacts/{appId}/notifications/{docId}'),
    rules.indexOf('match /artifacts/{appId}/auth_sessions/{sessionId}')
  );
  assert.match(notificationsBlock, /resource\.data\.recipientUid == request\.auth\.uid/);
  assert.match(notificationsBlock, /allow create: if false/);
  assert.match(notificationsBlock, /affectedKeys\(\)\.hasOnly\(\['isRead'\]\)/);
});

test('standard tag arrays are bounded and custom catalog uses soft delete', () => {
  assert.match(rules, /validReturnTagArray/);
  assert.match(rules, /validStandardTagArray/);
  assert.match(rules, /sopTags is list && data\.sopTags\.size\(\) <= 10/);
  assert.match(rules, /sop_tags is list && data\.sop_tags\.size\(\) <= 100/);
  assert.match(rules, /device:gchrms/);
  const tagBlock = rules.slice(
    rules.indexOf('match /artifacts/{appId}/standard_tags/{tagId}'),
    rules.indexOf('match /artifacts/{appId}/purchase_requests/{reqId}')
  );
  assert.match(tagBlock, /allow delete: if false/);
  assert.match(tagBlock, /_isDeleted is bool/);
  assert.match(tagBlock, /resource\.data\.locked == true/);
  assert.match(tagBlock, /validManualCatalogItem/);
  assert.match(rules, /data\.methodName is string/);
});
