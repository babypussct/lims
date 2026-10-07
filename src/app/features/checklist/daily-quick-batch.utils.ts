export interface DailyQuickBatchList {
  lines: string[];
  invalidSampleIds: string[];
}

export function normalizeQuickBatchMethod(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, '_');
}

/** Use actual samples, never expand the board's condensed ranges. */
export function buildDailyQuickBatchList(method: string, sampleIds: readonly string[]): DailyQuickBatchList {
  const methodName = normalizeQuickBatchMethod(method);
  const samples = [...new Set(sampleIds.map(value => value.trim().toUpperCase()).filter(Boolean))];
  const parsed = samples.map(sampleId => ({
    sampleId,
    parts: sampleId.match(/^([A-Z]*)(\d+)(\d{2})$/)
  }));
  const invalidSampleIds = parsed.filter(sample => !sample.parts).map(sample => sample.sampleId);
  const validSamples = parsed.filter((sample): sample is typeof sample & { parts: RegExpMatchArray } => !!sample.parts);
  validSamples.sort((a, b) =>
    a.parts[1].localeCompare(b.parts[1])
    || a.parts[3].localeCompare(b.parts[3])
    || Number(a.parts[2]) - Number(b.parts[2])
    || a.sampleId.localeCompare(b.sampleId)
  );

  return {
    // Keep letter prefixes so L0306 and U0306 remain distinct in the run list.
    lines: methodName ? validSamples.map(({ parts }) => `${methodName}_${parts[3]}_${parts[1]}${parts[2]}`) : [],
    invalidSampleIds
  };
}
