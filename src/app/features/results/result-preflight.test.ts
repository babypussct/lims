import assert from 'node:assert/strict';
import test from 'node:test';
import { AnalysisResultDraft } from '../../core/models/analysis-result.model';
import { buildPublishPreflightSummary } from './result-preflight';

function draft(overrides: Partial<AnalysisResultDraft> = {}): AnalysisResultDraft {
  return {
    id: 'run-1',
    requestId: 'run-1',
    sopId: 'sop-1',
    sopName: 'SOP test',
    status: 'draft',
    page1Data: {
      ngayNguoiPhanTich: '2026-07-27',
      ngayNguoiThamTra: '2026-07-27'
    },
    resultData: {},
    updatedAt: '2026-07-27T00:00:00.000Z',
    updatedBy: 'tester',
    ...overrides
  };
}

test('blocks publishing when dates or selected sample results are missing', () => {
  const summary = buildPublishPreflightSummary({
    run: { sampleList: ['A001'] },
    draft: draft({
      page1Data: {},
      resultData: { A001: { selected: true } }
    }),
    config: { formType: 'type2', columns: { loSo: {}, kq: {} } },
    activeFilter: 'ALL',
    unpublishedSamples: ['A001']
  });

  assert.equal(summary.includedSamples.length, 1);
  assert.ok(summary.blockers.some(message => message.includes('Người phân tích')));
  assert.ok(summary.blockers.some(message => message.includes('Người thẩm tra')));
  assert.ok(summary.blockers.some(message => message.includes('chưa có kết quả')));
});

test('chunks selected samples by the configured report size', () => {
  const summary = buildPublishPreflightSummary({
    run: { sampleList: ['A001', 'A002', 'A003'] },
    draft: draft({
      resultData: {
        A001: { kq: '1.0' },
        A002: { kq: 'ND' },
        A003: { kq: '2.0' }
      }
    }),
    config: { formType: 'type2', columns: { loSo: {}, kq: {} } },
    activeFilter: 'ALL',
    samplesPerReport: 2,
    unpublishedSamples: ['A001', 'A002', 'A003']
  });

  assert.deepEqual(summary.chunks, [['A001', 'A002'], ['A003']]);
  assert.equal(summary.blockers.length, 0);
  assert.ok(summary.info.some(message => message.includes('2 phiếu')));
});

test('accepts type3b ND checkboxes as reportable results', () => {
  const summary = buildPublishPreflightSummary({
    run: { sampleList: ['A001'] },
    draft: draft({
      page1Data: {
        ngayNguoiPhanTich: '2026-07-27',
        ngayNguoiThamTra: '2026-07-27',
        r2: '0.999'
      },
      resultData: { A001: { alpha_nd: true } }
    }),
    config: { formType: 'type3b', compounds: ['alpha'], columns: {} },
    configKey: 'tbvtv-thuc-pham-gcmsms',
    activeFilter: 'ALL',
    unpublishedSamples: ['A001']
  });

  assert.equal(summary.blockers.length, 0);
});

test('does not require R² on Form Check but still warns on Form Đơn', () => {
  const makeSummary = (printFormType: 'formCheck' | 'formDon') =>
    buildPublishPreflightSummary({
      run: { sampleList: ['A001'] },
      draft: draft({
        page1Data: {
          ngayNguoiPhanTich: '2026-07-27',
          ngayNguoiThamTra: '2026-07-27',
          printFormType,
          r2: ''
        },
        resultData: { A001: { alpha_nd: true } }
      }),
      config: { formType: 'type3b', compounds: ['alpha'], columns: {} },
      configKey: 'tbvtv-thuc-pham-gcmsms',
      activeFilter: 'ALL',
      unpublishedSamples: ['A001']
    });

  assert.equal(
    makeSummary('formCheck').warnings.some(message => message.includes('R²')),
    false
  );
  assert.equal(
    makeSummary('formDon').warnings.some(message => message.includes('R²')),
    true
  );
});

test('warns when included samples were already published', () => {
  const summary = buildPublishPreflightSummary({
    run: { sampleList: ['A001', 'A002'] },
    draft: draft({
      resultData: {
        A001: { kq: '1.0' },
        A002: { kq: '2.0' }
      }
    }),
    config: { formType: 'type2', columns: { loSo: {}, kq: {} } },
    activeFilter: 'ALL',
    unpublishedSamples: ['A002']
  });

  assert.equal(summary.blockers.length, 0);
  assert.ok(summary.warnings.some(message => message.includes('1 mẫu')));
});
