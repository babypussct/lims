import assert from 'node:assert/strict';
import test from 'node:test';
import { buildBatchReportsProjection } from './result-reports-projection';

test('projects real PDF coverage while excluding QC samples and marking stale reports', () => {
  const run = {
    id: 'B01',
    sampleList: ['A001', 'A002', 'B001', 'QC_SPIKE'],
    analysisResultSummary: {
      reports: {
        A_1: {
          id: 'A_1',
          prefix: 'A',
          version: 2,
          status: 'completed',
          pdfUrl: 'https://drive.google.com/file/d/abc/view',
          includedSamples: ['A001', 'A002'],
        },
        B_1: {
          id: 'B_1',
          prefix: 'B',
          version: 1,
          status: 'stale',
          pdfUrl: 'https://drive.google.com/file/d/def/view',
          includedSamples: ['B001'],
        },
      },
    },
  };

  const proj = buildBatchReportsProjection(run);
  assert.equal(proj.coverage.total, 3);
  assert.equal(proj.coverage.published, 2);
  assert.equal(proj.coverage.percent, 67);
  assert.deepEqual(proj.coverage.unpublishedSamples, ['B001']);
  assert.equal(proj.hasStaleReport, true);
  assert.equal(proj.activeCount, 1);
  assert.equal(proj.cards.length, 2);
});

test('supports legacy ALL report without includedSamples as covering all reportable samples', () => {
  const run = {
    id: 'B02',
    sampleList: ['S01', 'S02', 'QC_BLANK'],
    analysisResult: {
      pdfUrl: 'https://drive.google.com/file/d/legacy/view',
      version: 1,
    },
  };

  const proj = buildBatchReportsProjection(run);
  assert.equal(proj.coverage.total, 2);
  assert.equal(proj.coverage.published, 2);
  assert.equal(proj.coverage.percent, 100);
  assert.equal(proj.hasAnyReport, true);
  assert.equal(proj.hasStaleReport, false);
});

test('reports coverageKnown=false when run sampleList metadata is missing', () => {
  const proj = buildBatchReportsProjection({ id: 'B03' });
  assert.equal(proj.coverageKnown, false);
  assert.equal(proj.coverage.total, 0);
  assert.equal(proj.hasAnyReport, false);
});
