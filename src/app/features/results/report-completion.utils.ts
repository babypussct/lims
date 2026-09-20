import { AnalysisResultDraft } from '../../core/models/analysis-result.model';

type ReportEntry = NonNullable<AnalysisResultDraft['reports']>[string];

export interface ReportCoverageInput {
  sampleList: readonly string[];
  reports?: AnalysisResultDraft['reports'];
  allReportPdfUrl?: string | null;
  allReportStatus?: string | null;
  allReportIncludedSamples?: readonly string[];
  additionalPublishedSamples?: readonly string[];
}

export interface ReportCoverage {
  samples: string[];
  publishedSamples: Set<string>;
  published: number;
  total: number;
  percent: number;
  unpublishedSamples: string[];
}

export function getReportableSamples(sampleList: readonly string[] = []): string[] {
  return sampleList.filter(sample => !sample.startsWith('QC_'));
}

export function isActivePublishedReport(report: ReportEntry | null | undefined): boolean {
  if (!report || report.status === 'stale') return false;
  return report.status === 'completed' || !!report.pdfUrl;
}

export function invalidatePublishedReports(
  reports: AnalysisResultDraft['reports'] | undefined
): AnalysisResultDraft['reports'] | undefined {
  if (!reports) return reports;

  return Object.fromEntries(
    Object.entries(reports).map(([id, report]) => [
      id,
      report ? { ...report, status: 'stale' } : report
    ])
  ) as AnalysisResultDraft['reports'];
}

function normalizeReportInput(value: any, key?: string): any {
  if (key === 'selected') return undefined;
  if (Array.isArray(value)) {
    return value.map(item => normalizeReportInput(item));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map(childKey => [childKey, normalizeReportInput(value[childKey], childKey)])
        .filter(([, childValue]) => childValue !== undefined)
    );
  }
  return value;
}

/**
 * So sánh phần dữ liệu có thể làm thay đổi nội dung báo cáo.
 * `selected` chỉ là trạng thái UI nên không làm báo cáo cũ mất hiệu lực.
 */
export function haveReportInputsChanged(
  previousPage1Data: AnalysisResultDraft['page1Data'] | undefined,
  previousResultData: AnalysisResultDraft['resultData'] | undefined,
  nextPage1Data: AnalysisResultDraft['page1Data'] | undefined,
  nextResultData: AnalysisResultDraft['resultData'] | undefined
): boolean {
  const previous = normalizeReportInput({
    page1Data: previousPage1Data || {},
    resultData: previousResultData || {}
  });
  const next = normalizeReportInput({
    page1Data: nextPage1Data || {},
    resultData: nextResultData || {}
  });
  return JSON.stringify(previous) !== JSON.stringify(next);
}

export function buildReportCoverage(input: ReportCoverageInput): ReportCoverage {
  const samples = getReportableSamples(input.sampleList);
  const publishedSamples = new Set<string>();

  for (const report of Object.values(input.reports || {})) {
    if (!isActivePublishedReport(report)) continue;
    (report.includedSamples || []).forEach(sample => publishedSamples.add(sample));
  }

  if (input.allReportPdfUrl && input.allReportStatus !== 'stale') {
    const included = input.allReportIncludedSamples || [];
    if (included.length > 0) {
      included.forEach(sample => publishedSamples.add(sample));
    } else {
      // Backward compatibility: older ALL reports did not persist includedSamples.
      samples.forEach(sample => publishedSamples.add(sample));
    }
  }

  (input.additionalPublishedSamples || []).forEach(sample => publishedSamples.add(sample));

  const unpublishedSamples = samples.filter(sample => !publishedSamples.has(sample));
  const published = samples.length - unpublishedSamples.length;
  return {
    samples,
    publishedSamples,
    published,
    total: samples.length,
    percent: samples.length > 0 ? Math.round((published / samples.length) * 100) : 0,
    unpublishedSamples
  };
}

export function hasResultForAllReportableSamples(
  sampleList: readonly string[],
  resultData: AnalysisResultDraft['resultData'] | undefined
): boolean {
  const samples = getReportableSamples(sampleList);
  if (samples.length === 0) return false;

  return samples.every(sample => {
    const row = resultData?.[sample];
    if (!row) return false;
    return Object.keys(row).some(key =>
      key !== 'selected'
      && row[key] !== null
      && row[key] !== undefined
      && row[key] !== ''
    );
  });
}

export function isBatchReportComplete(
  coverage: ReportCoverage,
  resultData: AnalysisResultDraft['resultData'] | undefined
): boolean {
  return coverage.total > 0
    && coverage.unpublishedSamples.length === 0
    && hasResultForAllReportableSamples(coverage.samples, resultData);
}
