import { normalizeSampleCode } from '../../features/results/shared/compound-id-resolver';
export function getSampleDescriptionSnapshot(map, sampleCode) {
    if (!map)
        return undefined;
    const key = normalizeSampleCode(sampleCode);
    if (!key)
        return undefined;
    const entry = Object.entries(map).find(([storedCode]) => normalizeSampleCode(storedCode) === key)?.[1];
    if (typeof entry === 'string') {
        const nameSnapshot = entry.trim();
        return nameSnapshot ? { nameSnapshot } : undefined;
    }
    if (!entry || typeof entry !== 'object')
        return undefined;
    const value = entry;
    const nameSnapshot = String(value.nameSnapshot || '').trim();
    if (!nameSnapshot)
        return undefined;
    const masterId = String(value.masterId || '').trim();
    return masterId ? { masterId, nameSnapshot } : { nameSnapshot };
}
export function setSampleDescriptionSnapshot(current, sampleCode, snapshot) {
    const normalized = normalizeSampleCode(sampleCode);
    const next = Object.fromEntries(Object.entries(current || {}).filter(([storedCode]) => normalizeSampleCode(storedCode) !== normalized));
    const displayCode = sampleCode.trim();
    const nameSnapshot = snapshot?.nameSnapshot?.trim();
    if (normalized && displayCode && nameSnapshot) {
        const masterId = snapshot?.masterId?.trim();
        next[displayCode] = masterId ? { masterId, nameSnapshot } : { nameSnapshot };
    }
    return next;
}
export function subsetSampleDescriptionMap(current, sampleCodes) {
    const result = {};
    Array.from(sampleCodes).forEach(sampleCode => {
        const snapshot = getSampleDescriptionSnapshot(current, sampleCode);
        if (snapshot)
            result[sampleCode.trim()] = snapshot;
    });
    return result;
}
export function formatSampleDescriptions(sampleCodes, current) {
    return Array.from(sampleCodes)
        .map(sampleCode => {
        const snapshot = getSampleDescriptionSnapshot(current, sampleCode);
        return snapshot ? `${sampleCode.trim()} (${snapshot.nameSnapshot})` : '';
    })
        .filter(Boolean)
        .join(' · ');
}
//# sourceMappingURL=sample-description.utils.js.map