/** Canonical account roles stored on `artifacts/{appId}/users/{uid}`. */
export type UserRole = 'manager' | 'staff' | 'viewer' | 'pending';

/**
 * Minimal profile shape needed for access-level checks.
 *
 * `protectedAdmin` is a trusted marker, not a fifth role. A Superadmin is
 * valid only when both invariants hold: `role === 'manager'` and
 * `protectedAdmin === true`.
 */
export interface AccessProfile {
  role?: UserRole | null;
  protectedAdmin?: boolean | null;
}

export function isManagerProfile(profile: AccessProfile | null | undefined): boolean {
  return profile?.role === 'manager';
}

export function isProtectedAdminProfile(profile: AccessProfile | null | undefined): boolean {
  return profile?.protectedAdmin === true;
}

export function isSuperAdminProfile(profile: AccessProfile | null | undefined): boolean {
  return isManagerProfile(profile) && isProtectedAdminProfile(profile);
}

export function hasInvalidProtectedAdminState(profile: AccessProfile | null | undefined): boolean {
  return isProtectedAdminProfile(profile) && !isManagerProfile(profile);
}
