export interface RequestStatsCountSource {
  sampleList?: unknown;
  inputs?: Record<string, unknown> | null;
}

const COUNTED_REQUEST_STATUSES = new Set(['approved', 'completed']);

export function isRequestCountedInStats(status: unknown): boolean {
  return typeof status === 'string' && COUNTED_REQUEST_STATUSES.has(status);
}

function finiteNonNegative(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return parsed;
}

/**
 * Canonical request counters used by live stats projection and backfill.
 * Explicit sample rows are the source of truth when present; otherwise use
 * n_sample, then the historical single-sample default. QC is independent.
 */
export function resolveRequestStatsCounts(source: RequestStatsCountSource): { samples: number; qcs: number } {
  const inputs = source.inputs || {};
  const topLevelSamples = Array.isArray(source.sampleList) ? source.sampleList : null;
  const inputSamples = Array.isArray(inputs['sampleList']) ? inputs['sampleList'] : null;
  const sampleList = topLevelSamples && topLevelSamples.length > 0
    ? topLevelSamples
    : inputSamples && inputSamples.length > 0
      ? inputSamples
      : null;

  const configuredSamples = finiteNonNegative(inputs['n_sample']);
  const configuredQcs = finiteNonNegative(inputs['n_qc']);

  return {
    samples: sampleList ? sampleList.length : (configuredSamples ?? 1),
    qcs: configuredQcs ?? 0,
  };
}
