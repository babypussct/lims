import { sanitizeForFirebase } from '../../shared/utils/utils';
import { DAILY_CHECKLIST_SCHEMA_VERSION, buildDailyChecklistEntry } from './daily-checklist-projection';
export function groupDailyChecklistEntriesByDate(requests) {
    const entriesByDate = new Map();
    requests.forEach(request => {
        const entry = buildDailyChecklistEntry(request);
        if (!entry || !request.analysisDate)
            return;
        const entries = entriesByDate.get(request.analysisDate) || [];
        entries.push(entry);
        entriesByDate.set(request.analysisDate, entries);
    });
    return entriesByDate;
}
export function buildDailyChecklistSetPayload(analysisDate, entries, updatedAt) {
    return sanitizeForFirebase({
        schemaVersion: DAILY_CHECKLIST_SCHEMA_VERSION,
        analysisDate,
        updatedAt,
        entries: Object.fromEntries(entries.map(entry => [entry.requestId, entry]))
    });
}
export async function runDailyChecklistProjectionBestEffort(operation, context) {
    try {
        await operation();
        return true;
    }
    catch (error) {
        console.error(`[DailyChecklist] Projection failed after source commit (${context}).`, error);
        return false;
    }
}
//# sourceMappingURL=daily-checklist-materialization.js.map