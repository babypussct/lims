/**
 * Resolve a fail-closed feature rollout for the current authenticated user.
 *
 * The global switch is intentionally still the primary control. A canary UID
 * is only an additive opt-in while the global switch remains false, so a
 * malformed or missing config can never enable the feature accidentally.
 */
export function normalizeFeatureCanaryUids(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  const unique = new Set<string>();
  for (const candidate of value) {
    if (typeof candidate !== 'string') continue;
    const uid = candidate.trim();
    if (uid) unique.add(uid);
  }
  return Array.from(unique);
}

export function isFeatureEnabledForUser(
  globallyEnabled: boolean,
  canaryUids: readonly string[],
  currentUid: string | null | undefined,
): boolean {
  const uid = typeof currentUid === 'string' ? currentUid.trim() : '';
  if (!uid) return false;
  return globallyEnabled || canaryUids.includes(uid);
}
