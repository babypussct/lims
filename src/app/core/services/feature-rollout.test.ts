import assert from 'node:assert/strict';
import test from 'node:test';
import {
  isFeatureEnabledForUser,
  normalizeFeatureCanaryUids,
} from './feature-rollout';

test('feature rollout is fail-closed without an authenticated UID', () => {
  assert.equal(isFeatureEnabledForUser(true, [], null), false);
  assert.equal(isFeatureEnabledForUser(false, ['uid-manager'], undefined), false);
  assert.equal(isFeatureEnabledForUser(false, ['uid-manager'], '   '), false);
});

test('global feature switch enables the feature for an authenticated user', () => {
  assert.equal(isFeatureEnabledForUser(true, [], 'uid-manager'), true);
});

test('canary rollout enables only the explicitly listed UID', () => {
  assert.equal(isFeatureEnabledForUser(false, ['uid-manager'], 'uid-manager'), true);
  assert.equal(isFeatureEnabledForUser(false, ['uid-manager'], 'uid-qc'), false);
});

test('canary UID config is normalized without accepting malformed values', () => {
  assert.deepEqual(
    normalizeFeatureCanaryUids([' uid-manager ', 'uid-manager', 42, null, '']),
    ['uid-manager'],
  );
  assert.deepEqual(normalizeFeatureCanaryUids('uid-manager'), []);
});
