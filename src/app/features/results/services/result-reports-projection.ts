import { formatSampleList } from '../../../shared/utils/utils';
import {
  buildReportCoverage,
  getReportableSamples,
  ReportCoverage,
} from '../report-completion.utils';

export type ReportKind = 'all' | 'group';

export interface ReportCardProjection {
  id: string;
  kind: ReportKind;
  prefix: string;
  title: string;
  subtitle: string;
  samples: string[];
  version: number;
  pdfUrl?: string | null;
  pdfViewUrl?: string | null;
  docsUrl?: string | null;
  publishedAt?: any;
  publishedBy?: string;
  status?: string;
  isStale: boolean;
}

export interface BatchReportsProjection {
  reportableSamples: string[];
  cards: ReportCardProjection[];
  coverage: ReportCoverage;
  coverageKnown: boolean;
  hasAnyReport: boolean;
  hasStaleReport: boolean;
  activeCount: number;
}

function sortSamplesNatural(samples: readonly string[]): string[] {
  return [...(samples || [])].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
  );
}

function samplePrefix(sample: string): string {
  return /^[a-zA-Z]/.test(sample) ? sample.charAt(0).toUpperCase() : '';
}

function extractReportSamples(
  reportObj: any,
  allReportableSamples: string[],
  prefixKey?: string
): string[] {
  if (!reportObj) return [];

  if (Array.isArray(reportObj.includedSamples) && reportObj.includedSamples.length > 0) {
    return sortSamplesNatural(reportObj.includedSamples.filter((s: string) => !s.startsWith('QC_')));
  }

  if (reportObj.samples && typeof reportObj.samples === 'object') {
    const samples = Object.keys(reportObj.samples).filter(
      key => !key.startsWith('QC_') && reportObj.samples[key]?.included !== false
    );
    if (samples.length > 0) return sortSamplesNatural(samples);
  }

  if (!prefixKey || prefixKey === 'ALL') {
    return allReportableSamples;
  }

  const normalizedPrefix = prefixKey === '_NO_PREFIX_' ? '' : prefixKey;
  return allReportableSamples.filter(sample => samplePrefix(sample) === normalizedPrefix);
}

/**
 * Shared read-only projection for report cards, active/stale state, and real PDF coverage.
 * Uses `buildReportCoverage()` rules including legacy ALL reports missing `includedSamples`.
 */
export function buildBatchReportsProjection(run: any, draft?: any): BatchReportsProjection {
  const sampleList: string[] = Array.isArray(run?.sampleList) ? run.sampleList : [];
  const reportableSamples = sortSamplesNatural(getReportableSamples(sampleList));
  const summary = draft || run?.analysisResultSummary || run?.analysisResult || null;

  const reportsMap = summary?.reports || run?.analysisResultSummary?.reports || run?.analysisResult?.reports;
  const allPdfUrl = summary?.pdfUrl || run?.analysisResultSummary?.pdfUrl || run?.analysisResult?.pdfUrl || null;
  const allPdfViewUrl = summary?.pdfViewUrl || run?.analysisResultSummary?.pdfViewUrl || run?.analysisResult?.pdfViewUrl || null;
  const allDocsUrl = summary?.docsUrl || run?.analysisResultSummary?.docsUrl || run?.analysisResult?.docsUrl || null;
  const allReportStatus = summary?.allReportStatus ?? run?.analysisResultSummary?.allReportStatus ?? run?.analysisResult?.allReportStatus ?? null;
  const allIncluded = summary?.includedSamples ?? run?.analysisResultSummary?.includedSamples ?? run?.analysisResult?.includedSamples;

  const cards: ReportCardProjection[] = [];

  if (allPdfUrl || allPdfViewUrl || allDocsUrl) {
    const samples = extractReportSamples(
      {
        includedSamples: allIncluded,
        samples: summary?.samples || run?.analysisResultSummary?.samples || run?.analysisResult?.samples,
      },
      reportableSamples,
      'ALL'
    );
    const isStale = allReportStatus === 'stale';
    cards.push({
      id: 'current_all',
      kind: 'all',
      prefix: 'ALL',
      title: formatSampleList(samples) || 'Chưa rõ mẫu',
      subtitle: `Toàn mẻ · ${samples.length} mẫu`,
      samples,
      version: summary?.version || run?.analysisResultSummary?.version || run?.analysisResult?.version || 1,
      pdfUrl: allPdfUrl,
      pdfViewUrl: allPdfViewUrl,
      docsUrl: allDocsUrl,
      publishedAt: summary?.pdfCreatedAt || summary?.updatedAt || run?.analysisResultSummary?.pdfCreatedAt || run?.updatedAt,
      publishedBy: summary?.updatedBy || run?.analysisResultSummary?.updatedBy || run?.user,
      status: allReportStatus || 'completed',
      isStale,
    });
  }

  for (const [key, rawReport] of Object.entries(reportsMap || {})) {
    const report = rawReport as any;
    if (!report || !(report.pdfUrl || report.pdfViewUrl || report.docsUrl)) continue;
    const prefixKey = report.prefix || key;
    const normalizedPrefix = prefixKey === '_NO_PREFIX_' ? '' : prefixKey;
    const samples = extractReportSamples(report, reportableSamples, prefixKey);
    const isStale = report.status === 'stale';

    cards.push({
      id: report.id || key,
      kind: 'group',
      prefix: normalizedPrefix,
      title: formatSampleList(samples) || 'Chưa rõ mẫu',
      subtitle: `${normalizedPrefix === '' ? 'Không tiền tố' : 'Nhóm ' + normalizedPrefix} · ${samples.length} mẫu`,
      samples,
      version: report.version || 1,
      pdfUrl: report.pdfUrl,
      pdfViewUrl: report.pdfViewUrl,
      docsUrl: report.docsUrl,
      publishedAt: report.pdfCreatedAt || report.publishedAt,
      publishedBy: report.publishedBy,
      status: report.status,
      isStale,
    });
  }

  cards.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === 'all' ? -1 : 1;
    const aFirst = a.samples[0] || '';
    const bFirst = b.samples[0] || '';
    const sampleOrder = aFirst.localeCompare(bFirst, undefined, { numeric: true, sensitivity: 'base' });
    if (sampleOrder !== 0) return sampleOrder;
    return (b.version || 0) - (a.version || 0);
  });

  const coverage = buildReportCoverage({
    sampleList,
    reports: reportsMap,
    allReportPdfUrl: allPdfUrl,
    allReportStatus,
    allReportIncludedSamples: allIncluded,
  });

  // Metadata is present enough to compute coverage if run has sampleList (even 0 samples)
  // AND either run has no pending loading state or summary/status is explicitly known.
  const coverageKnown = Array.isArray(run?.sampleList);
  const hasStaleReport = cards.some(card => card.isStale) || allReportStatus === 'stale';
  const activeCount = cards.filter(card => !card.isStale).length;

  return {
    reportableSamples,
    cards,
    coverage,
    coverageKnown,
    hasAnyReport: cards.length > 0,
    hasStaleReport,
    activeCount,
  };
}
