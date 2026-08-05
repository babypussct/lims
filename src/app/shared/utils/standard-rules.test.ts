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
  assert.match(requestsBlock, /request\.resource\.data\.requestedBy == request\.auth\.uid/);
  assert.match(requestsBlock, /allow delete: if false/);
});

test('requester stock writes can only reduce non-negative stock', () => {
  assert.match(rules, /request\.resource\.data\.current_amount >= 0/);
  assert.match(rules, /request\.resource\.data\.current_amount <= resource\.data\.current_amount/);
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
  assert.match(usageBlock, /allow update: if canRollbackStandardLogs/);
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
});
