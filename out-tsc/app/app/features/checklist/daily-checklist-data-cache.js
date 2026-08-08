import { isValidDailyChecklistDate } from '../../core/utils/daily-checklist-projection';
export function shouldFallbackToLegacyRequests(analysisDate, dailyDocumentExists) {
    return isValidDailyChecklistDate(analysisDate) && !dailyDocumentExists;
}
export class DailyChecklistResultCache {
    constructor(ttlMs) {
        this.ttlMs = ttlMs;
        this.values = new Map();
        this.generations = new Map();
    }
    get(analysisDate, now = Date.now()) {
        const cached = this.values.get(analysisDate);
        if (!cached || now - cached.cachedAt >= this.ttlMs)
            return undefined;
        return cached.result;
    }
    generation(analysisDate) {
        return this.generations.get(analysisDate) || 0;
    }
    setIfCurrent(analysisDate, result, expectedGeneration, now = Date.now()) {
        if (this.generation(analysisDate) !== expectedGeneration)
            return;
        this.values.set(analysisDate, { result, cachedAt: now });
    }
    invalidate(analysisDate) {
        this.values.delete(analysisDate);
        this.generations.set(analysisDate, this.generation(analysisDate) + 1);
    }
}
//# sourceMappingURL=daily-checklist-data-cache.js.map