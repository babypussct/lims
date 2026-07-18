import assert from 'node:assert/strict';
import test from 'node:test';
import {
  assertPurchaseRequestTransition,
  assertStandardRequestTransition,
  canCompleteStandardReturn,
  canTransitionStandardRequest,
  normalizeLegacyStandardRequestStatus
} from './standard-workflow';

test('allows only supported standard request transitions', () => {
  assert.equal(canTransitionStandardRequest('PENDING_APPROVAL', 'IN_PROGRESS'), true);
  assert.equal(canTransitionStandardRequest('IN_PROGRESS', 'COMPLETED'), false);
  assert.equal(canTransitionStandardRequest('COMPLETED', 'COMPLETED'), false);
  assert.throws(() => assertStandardRequestTransition('COMPLETED', 'IN_PROGRESS'), /không hợp lệ/);
});

test('maps the legacy depletion state into the return flow', () => {
  assert.equal(normalizeLegacyStandardRequestStatus('PENDING_DEPLETION'), 'PENDING_RETURN');
});

test('allows an approver to atomically force-return an in-progress request', () => {
  assert.equal(canCompleteStandardReturn('IN_PROGRESS'), true);
  assert.equal(canCompleteStandardReturn('PENDING_APPROVAL'), false);
  assert.equal(canCompleteStandardReturn('COMPLETED'), false);
});

test('enforces purchase request transitions', () => {
  assert.doesNotThrow(() => assertPurchaseRequestTransition('PENDING', 'ORDERED'));
  assert.throws(() => assertPurchaseRequestTransition('COMPLETED', 'PENDING'), /không hợp lệ/);
});
