import { Request } from '../../core/models/request.model';
import { isValidDailyChecklistDate } from '../../core/utils/daily-checklist-projection';

export interface DailyChecklistDateResult {
  requests: Request[];
  source: 'server' | 'cache';
  materialized: boolean;
}

export function shouldFallbackToLegacyRequests(
  analysisDate: string,
  dailyDocumentExists: boolean
): boolean {
  return isValidDailyChecklistDate(analysisDate) && !dailyDocumentExists;
}

export class DailyChecklistResultCache {
  private readonly values = new Map<string, { result: DailyChecklistDateResult; cachedAt: number }>();
  private readonly generations = new Map<string, number>();

  constructor(private readonly ttlMs: number) {}

  get(analysisDate: string, now = Date.now()): DailyChecklistDateResult | undefined {
    const cached = this.values.get(analysisDate);
    if (!cached || now - cached.cachedAt >= this.ttlMs) return undefined;
    return cached.result;
  }

  generation(analysisDate: string): number {
    return this.generations.get(analysisDate) || 0;
  }

  setIfCurrent(
    analysisDate: string,
    result: DailyChecklistDateResult,
    expectedGeneration: number,
    now = Date.now()
  ): void {
    if (this.generation(analysisDate) !== expectedGeneration) return;
    this.values.set(analysisDate, { result, cachedAt: now });
  }

  invalidate(analysisDate: string): void {
    this.values.delete(analysisDate);
    this.generations.set(analysisDate, this.generation(analysisDate) + 1);
  }
}
