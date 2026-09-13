import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ACTIVE_STANDARD_STATUSES,
  isActiveStandardStatus
} from './standard-query';

test('defines the operational standard statuses without including soft-deleted records', () => {
  assert.deepEqual(ACTIVE_STANDARD_STATUSES, [
    'AVAILABLE',
    'IN_USE',
    'DEPLETED',
    'ACTIVE'
  ]);
  assert.equal(isActiveStandardStatus('DELETED'), false);
  assert.equal(isActiveStandardStatus(undefined), false);
});

test('accepts every status used by current operational standard workflows', () => {
  for (const status of ACTIVE_STANDARD_STATUSES) {
    assert.equal(isActiveStandardStatus(status), true);
  }
});
