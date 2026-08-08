import { getSampleDescriptionSnapshot } from '../../shared/utils/sample-description.utils';
import { normalizeSampleCode } from '../../features/results/shared/compound-id-resolver';
export const DAILY_CHECKLIST_SCHEMA_VERSION = 1;
const TRACKED_STATUSES = new Set(['approved', 'draft', 'completed']);
export function isValidDailyChecklistDate(value) {
    if (typeof value !== 'string')
        return false;
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match)
        return false;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const candidate = new Date(year, month - 1, day);
    return candidate.getFullYear() === year
        && candidate.getMonth() === month - 1
        && candidate.getDate() === day;
}
export function isDailyChecklistRequest(request) {
    return TRACKED_STATUSES.has(request.status)
        && !request.isVirtualMaster
        && isValidDailyChecklistDate(request.analysisDate);
}
export function buildDailyChecklistEntry(request) {
    if (!isDailyChecklistRequest(request))
        return null;
    const sampleTargetMap = request.sampleTargetMap ?? request.inputs?.sampleTargetMap ?? {};
    const fallbackTargets = uniqueStrings(request.targetIds || request.inputs?.targetIds || []);
    const sampleList = uniqueSampleCodes(request.sampleList || request.inputs?.sampleList || []);
    const targetNamesSnapshot = request.targetNames || {};
    return compactObject({
        requestId: request.id,
        sopId: request.sopId,
        sopName: request.sopName,
        sopVersion: request.sopVersion,
        sopRef: request.sopRef,
        status: request.status,
        approvedAt: request.approvedAt || request.timestamp,
        ownerName: request.user,
        samples: sampleList.map(sampleId => {
            const assignedTargets = findAssignedTargets(sampleId, sampleTargetMap);
            const targetIds = uniqueStrings(assignedTargets.length > 0 ? assignedTargets : fallbackTargets);
            return compactObject({
                sampleId,
                targetIds,
                targetNames: targetIds.map(targetId => resolveTargetName(targetNamesSnapshot, targetId)),
                description: getSampleDescriptionSnapshot(request.sampleDescriptionMap ?? request.inputs?.sampleDescriptionMap, sampleId)
            });
        }),
        fallbackTargetIds: fallbackTargets.length > 0 ? fallbackTargets : undefined,
        targetNamesSnapshot: Object.keys(targetNamesSnapshot).length > 0 ? targetNamesSnapshot : undefined,
        targetScopeSnapshots: request.targetScopeSnapshots?.length ? request.targetScopeSnapshots : undefined
    });
}
export function dailyChecklistDocumentToRequests(document, fallbackAnalysisDate) {
    const analysisDate = isValidDailyChecklistDate(document?.analysisDate)
        ? document.analysisDate
        : fallbackAnalysisDate;
    const entries = document?.entries && typeof document.entries === 'object' ? document.entries : {};
    return Object.entries(entries)
        .map(([entryKey, entry]) => dailyChecklistEntryToRequest(entryKey, entry, analysisDate))
        .filter((request) => request !== null);
}
function dailyChecklistEntryToRequest(entryKey, entry, analysisDate) {
    if (!entry || !TRACKED_STATUSES.has(entry.status))
        return null;
    const requestId = String(entry.requestId || entryKey).trim();
    if (!requestId || !entry.sopId || !entry.sopName || !isValidDailyChecklistDate(analysisDate))
        return null;
    const samples = Array.isArray(entry.samples) ? entry.samples : [];
    const sampleList = samples.map(sample => String(sample.sampleId || '').trim()).filter(Boolean);
    const sampleTargetMap = {};
    const sampleDescriptionMap = {};
    const targetNames = { ...(entry.targetNamesSnapshot || {}) };
    samples.forEach(sample => {
        const sampleId = String(sample.sampleId || '').trim();
        if (!sampleId)
            return;
        const targetIds = uniqueStrings(Array.isArray(sample.targetIds) ? sample.targetIds : []);
        sampleTargetMap[sampleId] = targetIds;
        targetIds.forEach((targetId, index) => {
            if (!targetNames[targetId])
                targetNames[targetId] = sample.targetNames?.[index] || targetId;
        });
        if (sample.description?.nameSnapshot)
            sampleDescriptionMap[sampleId] = sample.description;
    });
    const targetIds = uniqueStrings([
        ...Object.values(sampleTargetMap).flat(),
        ...(entry.fallbackTargetIds || [])
    ]);
    return compactObject({
        id: requestId,
        sopId: entry.sopId,
        sopName: entry.sopName,
        sopVersion: entry.sopVersion,
        sopRef: entry.sopRef,
        items: [],
        status: entry.status,
        timestamp: entry.approvedAt || null,
        approvedAt: entry.approvedAt,
        user: entry.ownerName,
        analysisDate,
        sampleList,
        targetIds,
        sampleTargetMap,
        sampleDescriptionMap: Object.keys(sampleDescriptionMap).length > 0 ? sampleDescriptionMap : undefined,
        targetNames: Object.keys(targetNames).length > 0 ? targetNames : undefined,
        targetScopeSnapshots: entry.targetScopeSnapshots
    });
}
function findAssignedTargets(sampleId, map) {
    const key = normalizeSampleCode(sampleId);
    if (!key)
        return [];
    const match = Object.entries(map).find(([storedSample]) => normalizeSampleCode(storedSample) === key)?.[1];
    return Array.isArray(match) ? uniqueStrings(match.map(String)) : [];
}
function resolveTargetName(targetNames, targetId) {
    if (targetNames[targetId])
        return targetNames[targetId];
    const normalized = targetId.trim().toLocaleLowerCase();
    return Object.entries(targetNames).find(([id]) => id.trim().toLocaleLowerCase() === normalized)?.[1] || targetId;
}
function uniqueStrings(values) {
    return Array.from(new Set(values.map(value => String(value).trim()).filter(Boolean)));
}
function uniqueSampleCodes(values) {
    const unique = new Map();
    values.forEach(value => {
        const display = String(value).trim();
        const key = normalizeSampleCode(display);
        if (key && !unique.has(key))
            unique.set(key, display);
    });
    return Array.from(unique.values());
}
function compactObject(value) {
    return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined));
}
//# sourceMappingURL=daily-checklist-projection.js.map