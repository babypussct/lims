import {
  isRequestCountedInStats,
  resolveRequestStatsCounts,
  type RequestStatsCountSource,
} from './request-stats.utils';

export interface StatsProjectionRow extends RequestStatsCountSource {
  dateKey: string;
  status?: unknown;
  isVirtualMaster?: unknown;
  sopId?: unknown;
  sopName?: unknown;
}

export interface StatsDailyProjection {
  totalSamples: number;
  totalBatches: number;
  totalQcs: number;
  sops: Record<string, { samples: number; batches: number; qcs: number }>;
}

export interface PendingStatsReconciliation {
  id: string;
  statsDate?: unknown;
}

export function collectReconciliationDays(items: readonly PendingStatsReconciliation[]): string[] {
  return Array.from(new Set(
    items
      .map(item => typeof item.statsDate === 'string' ? item.statsDate : '')
      .filter(day => /^\d{4}-\d{2}-\d{2}$/.test(day))
  )).sort();
}

export function buildStatsProjectionForDays(
  rows: readonly StatsProjectionRow[],
  targetDays: readonly string[]
): Record<string, StatsDailyProjection> {
  const targets = new Set(targetDays);
  const result: Record<string, StatsDailyProjection> = {};

  for (const row of rows) {
    if (!targets.has(row.dateKey) || row.isVirtualMaster === true || !isRequestCountedInStats(row.status)) {
      continue;
    }

    const { samples, qcs } = resolveRequestStatsCounts(row);
    const day = result[row.dateKey] ||= { totalSamples: 0, totalBatches: 0, totalQcs: 0, sops: {} };
    day.totalSamples += samples;
    day.totalBatches += 1;
    day.totalQcs += qcs;

    const sopKey = String(row.sopName || row.sopId || 'Unknown');
    const sop = day.sops[sopKey] ||= { samples: 0, batches: 0, qcs: 0 };
    sop.samples += samples;
    sop.batches += 1;
    sop.qcs += qcs;
  }

  return result;
}
