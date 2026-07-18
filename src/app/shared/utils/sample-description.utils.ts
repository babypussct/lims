import {
  SampleDescriptionMap,
  SampleDescriptionSnapshot
} from '../../core/models/sample-description.model';
import { normalizeSampleCode } from '../../features/results/shared/compound-id-resolver';

export function getSampleDescriptionSnapshot(
  map: SampleDescriptionMap | Record<string, unknown> | null | undefined,
  sampleCode: string
): SampleDescriptionSnapshot | undefined {
  if (!map) return undefined;
  const key = normalizeSampleCode(sampleCode);
  if (!key) return undefined;
  const entry = Object.entries(map).find(([storedCode]) => normalizeSampleCode(storedCode) === key)?.[1];
  if (typeof entry === 'string') {
    const nameSnapshot = entry.trim();
    return nameSnapshot ? { nameSnapshot } : undefined;
  }
  if (!entry || typeof entry !== 'object') return undefined;
  const value = entry as Partial<SampleDescriptionSnapshot>;
  const nameSnapshot = String(value.nameSnapshot || '').trim();
  return nameSnapshot ? { masterId: value.masterId || undefined, nameSnapshot } : undefined;
}

export function setSampleDescriptionSnapshot(
  current: SampleDescriptionMap,
  sampleCode: string,
  snapshot?: SampleDescriptionSnapshot
): SampleDescriptionMap {
  const normalized = normalizeSampleCode(sampleCode);
  const next = Object.fromEntries(
    Object.entries(current || {}).filter(([storedCode]) => normalizeSampleCode(storedCode) !== normalized)
  ) as SampleDescriptionMap;
  const displayCode = sampleCode.trim();
  const nameSnapshot = snapshot?.nameSnapshot?.trim();
  if (normalized && displayCode && nameSnapshot) {
    next[displayCode] = { masterId: snapshot?.masterId || undefined, nameSnapshot };
  }
  return next;
}

export function subsetSampleDescriptionMap(
  current: SampleDescriptionMap | null | undefined,
  sampleCodes: Iterable<string>
): SampleDescriptionMap {
  const result: SampleDescriptionMap = {};
  Array.from(sampleCodes).forEach(sampleCode => {
    const snapshot = getSampleDescriptionSnapshot(current, sampleCode);
    if (snapshot) result[sampleCode.trim()] = snapshot;
  });
  return result;
}

export function formatSampleDescriptions(
  sampleCodes: Iterable<string>,
  current: SampleDescriptionMap | null | undefined
): string {
  return Array.from(sampleCodes)
    .map(sampleCode => {
      const snapshot = getSampleDescriptionSnapshot(current, sampleCode);
      return snapshot ? `${sampleCode.trim()} (${snapshot.nameSnapshot})` : '';
    })
    .filter(Boolean)
    .join(' · ');
}
