import type { ReleaseDoc } from './release.service';

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeItems(value: unknown): string[] {
  return Array.isArray(value)
    ? value
      .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      .map(item => item.trim())
    : [];
}

export function normalizeReleaseVersion(version: string): string {
  const value = version.trim();
  return value.startsWith('v') ? value : `v${value}`;
}

export function getReleaseOrder(version: string): number {
  const match = normalizeReleaseVersion(version).match(/^v(\d{2})\.(\d{2})\.(\d{2})-b(\d+)$/);
  if (!match) return 0;
  return Number(match[1]) * 1_000_000_000
    + Number(match[2]) * 10_000_000
    + Number(match[3]) * 100_000
    + Number(match[4]);
}

export function normalizeReleaseDoc(value: unknown): ReleaseDoc | null {
  if (!isRecord(value) || typeof value['version'] !== 'string' || !value['version'].trim()) return null;

  const version = normalizeReleaseVersion(value['version']);
  const releaseOrder = typeof value['releaseOrder'] === 'number' && Number.isFinite(value['releaseOrder'])
    ? value['releaseOrder']
    : getReleaseOrder(version);

  return {
    id: typeof value['id'] === 'string' ? value['id'] : undefined,
    version,
    date: typeof value['date'] === 'string' ? value['date'].trim() : '',
    title: typeof value['title'] === 'string' && value['title'].trim()
      ? value['title'].trim()
      : 'Cập nhật hệ thống',
    highlights: normalizeItems(value['highlights']),
    features: normalizeItems(value['features']),
    improvements: normalizeItems(value['improvements']),
    fixes: normalizeItems(value['fixes']),
    releaseOrder
  };
}

function releaseItemsFromPayload(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) return [];
  return Array.isArray(payload['releases']) ? payload['releases'] : [];
}

/**
 * Normalizes the public release-history payload, keeps the first copy of each
 * version, and returns newest releases first. The first copy wins so a newly
 * generated release can safely override a stale legacy duplicate.
 */
export function selectReleaseFallback(payload: unknown, limitCount = Number.POSITIVE_INFINITY): ReleaseDoc[] {
  const unique = new Map<string, ReleaseDoc>();
  for (const item of releaseItemsFromPayload(payload)) {
    const release = normalizeReleaseDoc(item);
    if (release && !unique.has(release.version)) unique.set(release.version, release);
  }

  const safeLimit = Number.isFinite(limitCount)
    ? Math.max(1, Math.min(Math.floor(limitCount), 100))
    : Number.POSITIVE_INFINITY;

  return [...unique.values()]
    .sort((a, b) => (b.releaseOrder || getReleaseOrder(b.version)) - (a.releaseOrder || getReleaseOrder(a.version)))
    .slice(0, safeLimit);
}

export function mergeReleaseDocs(
  primary: ReleaseDoc[],
  fallback: ReleaseDoc[],
  limitCount = Number.POSITIVE_INFINITY
): ReleaseDoc[] {
  return selectReleaseFallback([...primary, ...fallback], limitCount);
}
