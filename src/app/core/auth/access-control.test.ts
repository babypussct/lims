import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  hasInvalidProtectedAdminState,
  isManagerProfile,
  isProtectedAdminProfile,
  isSuperAdminProfile,
} from './access-control';

describe('access control profile invariants', () => {
  it('treats Manager as the canonical administrative role', () => {
    assert.equal(isManagerProfile({ role: 'manager' }), true);
    assert.equal(isManagerProfile({ role: 'staff' }), false);
    assert.equal(isManagerProfile(null), false);
  });

  it('requires both Manager role and protected marker for Superadmin', () => {
    assert.equal(isSuperAdminProfile({ role: 'manager', protectedAdmin: true }), true);
    assert.equal(isSuperAdminProfile({ role: 'manager', protectedAdmin: false }), false);
    assert.equal(isSuperAdminProfile({ role: 'staff', protectedAdmin: true }), false);
  });

  it('keeps the raw protection marker distinguishable from valid Superadmin state', () => {
    const malformed = { role: 'staff' as const, protectedAdmin: true };
    assert.equal(isProtectedAdminProfile(malformed), true);
    assert.equal(hasInvalidProtectedAdminState(malformed), true);
    assert.equal(hasInvalidProtectedAdminState({ role: 'manager', protectedAdmin: true }), false);
  });
});
