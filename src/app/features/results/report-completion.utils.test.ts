import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildReportCoverage,
  haveReportInputsChanged,
  hasResultForAllReportableSamples,
  invalidatePublishedReports,
  isBatchReportComplete
} from './report-completion.utils';

test('manual edit only becomes dirty when report data really changes', () => {
  const previousPage1 = { analyst: 'A' };
  const previousResults = {
    '15418': { selected: true, result: 'ND' }
  };

  assert.equal(haveReportInputsChanged(
    previousPage1,
    previousResults,
    { analyst: 'A' },
    { '15418': { selected: false, result: 'ND' } }
  ), false);

  assert.equal(haveReportInputsChanged(
    previousPage1,
    previousResults,
    { analyst: 'A' },
    { '15418': { selected: true, result: '0.10' } }
  ), true);
});

test('coverage ignores QC samples and reaches 100% from completed reports', () => {
  const coverage = buildReportCoverage({
    sampleList: ['15418', '15518', 'QC_SPIKE'],
    reports: {
      r1: {
        pdfUrl: 'https://example.test/r1.pdf',
        pdfFileName: 'r1.pdf',
        version: 1,
        status: 'completed',
        includedSamples: ['15418']
      },
      r2: {
        pdfUrl: 'https://example.test/r2.pdf',
        pdfFileName: 'r2.pdf',
        version: 1,
        status: 'completed',
        includedSamples: ['15518']
      }
    }
  });

  assert.equal(coverage.total, 2);
  assert.equal(coverage.published, 2);
  assert.equal(coverage.percent, 100);
  assert.deepEqual(coverage.unpublishedSamples, []);
});

test('stale reports stop contributing coverage after manual edit', () => {
  const reports = invalidatePublishedReports({
    r1: {
      pdfUrl: 'https://example.test/r1.pdf',
      pdfFileName: 'r1.pdf',
      version: 1,
      status: 'completed',
      includedSamples: ['15418']
    },
    r2: {
      pdfUrl: 'https://example.test/r2.pdf',
      pdfFileName: 'r2.pdf',
      version: 1,
      status: 'completed',
      includedSamples: ['15518']
    }
  });

  const coverage = buildReportCoverage({
    sampleList: ['15418', '15518'],
    reports
  });

  assert.equal(coverage.percent, 0);
  assert.deepEqual(coverage.unpublishedSamples, ['15418', '15518']);
});

test('republishing stale chunks rebuilds coverage incrementally', () => {
  const reports = invalidatePublishedReports({
    r1: {
      pdfUrl: 'https://example.test/r1.pdf',
      pdfFileName: 'r1.pdf',
      version: 1,
      status: 'completed',
      includedSamples: ['15418']
    },
    r2: {
      pdfUrl: 'https://example.test/r2.pdf',
      pdfFileName: 'r2.pdf',
      version: 1,
      status: 'completed',
      includedSamples: ['15518']
    }
  })!;

  reports.r1 = { ...reports.r1, status: 'completed', version: 2 };
  const partial = buildReportCoverage({
    sampleList: ['15418', '15518'],
    reports
  });
  assert.equal(partial.percent, 50);
  assert.deepEqual(partial.unpublishedSamples, ['15518']);

  reports.r2 = { ...reports.r2, status: 'completed', version: 2 };
  const complete = buildReportCoverage({
    sampleList: ['15418', '15518'],
    reports
  });
  assert.equal(complete.percent, 100);
});

test('ALL report uses persisted includedSamples and legacy ALL report falls back to all samples', () => {
  const scoped = buildReportCoverage({
    sampleList: ['15418', '15518', '15618'],
    allReportPdfUrl: 'https://example.test/all.pdf',
    allReportStatus: 'completed',
    allReportIncludedSamples: ['15418', '15518']
  });
  assert.equal(scoped.percent, 67);
  assert.deepEqual(scoped.unpublishedSamples, ['15618']);

  const legacy = buildReportCoverage({
    sampleList: ['15418', '15518', '15618'],
    allReportPdfUrl: 'https://example.test/all.pdf'
  });
  assert.equal(legacy.percent, 100);
});

test('completion still requires actual result data for every reportable sample', () => {
  const coverage = buildReportCoverage({
    sampleList: ['15418', '15518'],
    additionalPublishedSamples: ['15418', '15518']
  });
  const resultData = {
    '15418': { selected: true, result: 'ND' },
    '15518': { selected: true, result: '' }
  };

  assert.equal(hasResultForAllReportableSamples(['15418', '15518'], resultData), false);
  assert.equal(isBatchReportComplete(coverage, resultData), false);

  resultData['15518'].result = '0.10';
  assert.equal(isBatchReportComplete(coverage, resultData), true);
});
