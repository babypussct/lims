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

test('usage logs use tombstones instead of client-side physical deletes', () => {
  const usageBlock = rules.slice(
    rules.indexOf('match /artifacts/{appId}/standard_usages/{useId}'),
    rules.indexOf('// MODULE QUY TRÌNH SOP')
  );
  assert.match(usageBlock, /allow update: if canRollbackStandardLogs/);
  assert.match(usageBlock, /allow delete: if false/);
});
