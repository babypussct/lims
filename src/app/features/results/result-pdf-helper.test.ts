import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildChloroformPdfPayload,
  buildDichlorvosPdfPayload,
  buildFipronilPdfPayload,
  buildTrifluralinPdfPayload,
  buildUnifiedType3bPdfPayload
} from './result-pdf-helper';

const formatDate = (value: string) => value;
const getRunDate = () => '2026-07-28';

function buildPayload(sampleList: string[]) {
  const resultData = Object.fromEntries(sampleList.map((sample, index) => [
    sample,
    {
      selected: true,
      etofenprox: index === 0 ? '8.565' : '7.210',
      etofenprox_nd: false,
      etofenprox_qc1: 'Đạt',
      etofenprox_qc2: 'Đạt',
      etofenprox_qc3: 'Đạt'
    }
  ]));

  return buildUnifiedType3bPdfPayload(
    {
      page1Data: {
        printFormType: 'formCheck',
        checkGopInChung: true,
        ngayNguoiPhanTich: '2026-07-28',
        ngayNguoiThamTra: '2026-07-28'
      },
      resultData
    },
    {
      sampleList,
      sampleTargetMap: Object.fromEntries(sampleList.map(sample => [sample, ['etofenprox']]))
    },
    'ALL',
    {
      id: 'nhom-cuc',
      formType: 'type3b',
      compounds: ['etofenprox']
    },
    formatDate,
    getRunDate
  );
}

function buildSemanticPayload(resultData: Record<string, Record<string, unknown>>) {
  const sampleList = Object.keys(resultData);
  return buildUnifiedType3bPdfPayload(
    {
      page1Data: {
        printFormType: 'formCheck',
        checkGopInChung: sampleList.length > 1,
        ngayNguoiPhanTich: '2026-08-09',
        ngayNguoiThamTra: '2026-08-09'
      },
      resultData
    },
    {
      sampleList,
      sampleTargetMap: Object.fromEntries(sampleList.map(sample => [sample, ['etofenprox']]))
    },
    'ALL',
    {
      id: 'nhom-cuc',
      formType: 'type3b',
      compounds: ['etofenprox']
    },
    formatDate,
    getRunDate
  );
}

test('Form Check single-sample PDF contains only the result value', () => {
  const payload = buildPayload(['DAT_SP01']);

  assert.equal(payload.samples.length, 1);
  assert.equal(payload.samples[0].maSoMau, 'DAT_SP01');
  assert.equal(payload.samples[0].etofenprox, '8.565');
});

test('Form Check grouped PDF keeps sample labels when values belong to multiple samples', () => {
  const payload = buildPayload(['DAT_SP01', 'DAT_SP02']);

  assert.equal(payload.samples.length, 1);
  assert.equal(payload.samples[0].maSoMau, 'DAT_SP01; DAT_SP02');
  assert.equal(
    payload.samples[0].etofenprox,
    'DAT_SP01: 8.565; DAT_SP02: 7.210'
  );
});

test('SOP 9.14 unified PDF payload preserves all shared QC selections', () => {
  const payload = buildUnifiedType3bPdfPayload(
    {
      page1Data: {
        printFormType: 'formCheck',
        qcThoiGianLuu: true,
        qcThemChuan: true,
        qcThuHoi: true,
        qcDanhGiaChung: true,
        ngayNguoiPhanTich: '2026-08-26',
        ngayNguoiThamTra: '2026-08-26'
      },
      resultData: {
        A001: { selected: true, etofenprox: 'ND', etofenprox_nd: true }
      }
    },
    {
      sampleList: ['A001'],
      sampleTargetMap: { A001: ['etofenprox'] }
    },
    'ALL',
    {
      id: 'tbvtv-thuc-pham-gcmsms',
      formType: 'type3b',
      compounds: ['etofenprox']
    },
    formatDate,
    getRunDate
  );

  assert.equal(payload.metadata.qcThoiGianLuu, true);
  assert.equal(payload.metadata.qcThemChuan, true);
  assert.equal(payload.metadata.qcThuHoi, true);
  assert.equal(payload.metadata.qcDanhGiaChung, true);
});

test('Unified Type3B preserves blank, ND, N/A, and numeric zero for single samples', () => {
  const cases = [
    { code: 'BLANK01', input: { etofenprox: '' }, sampleValue: '', nd: false, runValue: '', summary: 'N/A' },
    { code: 'ND01', input: { etofenprox: 'ND' }, sampleValue: 'ND', nd: false, runValue: 'ND', summary: 'N/A' },
    { code: 'NDFLAG01', input: { etofenprox: '4.2', etofenprox_nd: true }, sampleValue: '', nd: true, runValue: 'ND', summary: 'N/A' },
    { code: 'NA01', input: { etofenprox: 'N/A' }, sampleValue: 'N/A', nd: false, runValue: 'N/A', summary: 'N/A' },
    { code: 'ZERO_NUM', input: { etofenprox: 0 }, sampleValue: '0', nd: false, runValue: '0', summary: 'etofenprox: 0' },
    { code: 'ZERO_STR', input: { etofenprox: '0' }, sampleValue: '0', nd: false, runValue: '0', summary: 'etofenprox: 0' },
    { code: 'ZERO_FLOAT', input: { etofenprox: 0.0 }, sampleValue: '0', nd: false, runValue: '0', summary: 'etofenprox: 0' }
  ];

  for (const testCase of cases) {
    const payload = buildSemanticPayload({ [testCase.code]: testCase.input });
    const sample = payload.samples[0];
    const runSample = payload.metadata.runSamplesList.find((row: any) => row.key === testCase.code);

    assert.equal(sample.etofenprox, testCase.sampleValue, testCase.code);
    assert.equal(sample.etofenprox_nd, testCase.nd, testCase.code);
    assert.equal(runSample.compoundResults.etofenprox, testCase.runValue, testCase.code);
    assert.equal(runSample.summaryResult, testCase.summary, testCase.code);
  }
});

test('Unified Type3B grouped results keep blank, ND, N/A, and zero distinct', () => {
  const payload = buildSemanticPayload({
    BLANK01: { etofenprox: '' },
    ND01: { etofenprox: 'ND' },
    NA01: { etofenprox: 'N/A' },
    ZERO01: { etofenprox: 0 }
  });

  assert.equal(payload.samples.length, 1);
  assert.equal(payload.samples[0].etofenprox_nd, false);
  assert.equal(
    payload.samples[0].etofenprox,
    'BLANK01: ; ND01: ND; NA01: N/A; ZERO01: 0'
  );

  const groupedRun = payload.metadata.runSamplesList.find((row: any) => row.key === 'GROUPED');
  assert.equal(
    groupedRun.compoundResults.etofenprox,
    'BLANK01: ; ND01: ND; NA01: N/A; ZERO01: 0'
  );
  assert.equal(groupedRun.summaryResult, 'etofenprox: ; ND; N/A; 0');
});

test('numeric zero survives result, calibration, R2, LOD, and LOQ payload fallbacks', () => {
  const trifluralinPayload = buildTrifluralinPdfPayload(
    {
      page1Data: { r2: 0 },
      resultData: {
        A001: { selected: true, kqTrifluralin: 0 }
      }
    },
    { sampleList: ['A001'] },
    'ALL',
    formatDate,
    getRunDate
  );
  assert.equal(trifluralinPayload.samples.find((row: any) => row.maSoMau === 'A001').kqTrifluralin, 0);
  assert.equal(trifluralinPayload.metadata.R2, 0);

  const dichlorvosPayload = buildDichlorvosPdfPayload(
    {
      page1Data: { r2: 0, calibPoints: [{ loSo: 'STD0', hamLuong: 0 }] },
      resultData: {
        A001: { selected: true, kqDichlorvos: 0 }
      }
    },
    { sampleList: ['A001'] },
    'ALL',
    { columns: { loSo: {}, maSoMau: {}, kqDichlorvos: {}, ghiChu: {} } },
    formatDate,
    getRunDate
  );
  assert.equal(dichlorvosPayload.samples.find((row: any) => row.maSoMau === 'A001').kqDichlorvos, 0);
  assert.equal(dichlorvosPayload.metadata.calib_hamLuong_0, 0);
  assert.equal(dichlorvosPayload.metadata.R2, 0);

  const chloroformPayload = buildChloroformPdfPayload(
    {
      page1Data: { r2: 0, calibPoints: [{ loSo: 'STD0', hamLuong: 0 }] },
      resultData: {
        A001: { selected: true, kqChloroform: 0 }
      }
    },
    { sampleList: ['A001'] },
    'ALL',
    { columns: { loSo: {}, maSoMau: {}, kqChloroform: {}, ghiChu: {} } },
    formatDate,
    getRunDate
  );
  assert.equal(chloroformPayload.samples.find((row: any) => row.maSoMau === 'A001').kqChloroform, 0);
  assert.equal(chloroformPayload.metadata.calibPoints[0].hamLuong, 0);
  assert.equal(chloroformPayload.metadata.calib_hamLuong_0, 0);
  assert.equal(chloroformPayload.metadata.R2, 0);

  const unifiedPayload = buildUnifiedType3bPdfPayload(
    {
      page1Data: {
        printFormType: 'formCheck',
        calibPoints: [{ loSo: 'STD0', hamLuong: 0 }],
        r2: 0,
        ngayNguoiPhanTich: '2026-08-09',
        ngayNguoiThamTra: '2026-08-09'
      },
      resultData: {
        A001: { selected: true, etofenprox: 0 }
      }
    },
    { sampleList: ['A001'], sampleTargetMap: { A001: ['etofenprox'] } },
    'ALL',
    { id: 'nhom-cuc', formType: 'type3b', compounds: ['etofenprox'] },
    formatDate,
    getRunDate,
    [{ id: 'etofenprox', name: 'Etofenprox', default_lod: 0, default_loq: 0 }]
  );
  assert.equal(unifiedPayload.metadata.calibPoints[0].hamLuong, 0);
  assert.equal(unifiedPayload.metadata.calib_hamLuong_0, 0);
  assert.equal(unifiedPayload.metadata.r2, 0);
  assert.equal(unifiedPayload.metadata.targetInfo.etofenprox.lod, 0);
  assert.equal(unifiedPayload.metadata.targetInfo.etofenprox.loq, 0);
});

test('SOP-01 PDF keeps blank results blank and prints literal ND only when entered', () => {
  const payload = buildFipronilPdfPayload(
    {
      page1Data: {
        ngayNguoiPhanTich: '2026-07-29',
        ngayNguoiThamTra: '2026-07-29'
      },
      resultData: {
        U0127: {
          selected: true,
          kqFip: '',
          kqFipDesl: 'ND'
        }
      }
    },
    { sampleList: ['U0127'] },
    'ALL',
    {
      columns: {
        loSo: {},
        maSoMau: {},
        kqFip: {},
        kqFipDesl: {},
        ghiChu: {}
      }
    },
    formatDate,
    getRunDate
  );
  const sample = payload.samples.find((row: any) => row.maSoMau === 'U0127');

  assert.equal(sample.kqFip, '');
  assert.equal(sample.kqFipDesl, 'ND');
});

test('SOP 9.14 compact PDF excludes unselected samples from the current chunk', () => {
  const payload = buildFipronilPdfPayload(
    {
      page1Data: {
        ngayNguoiPhanTich: '2026-08-08',
        ngayNguoiThamTra: '2026-08-08'
      },
      resultData: {
        A001: { selected: true, kqFip: 'ND' },
        A002: { selected: false, kqFip: '1.2' },
        B001: { selected: true, kqFip: '2.3' }
      }
    },
    { sampleList: ['A001', 'A002', 'B001'] },
    'A',
    {
      columns: {
        maSoMau: 0,
        loSo: 1,
        kqFip: 2
      }
    },
    formatDate,
    getRunDate
  );

  const regularSamples = payload.samples
    .map((row: any) => row.maSoMau)
    .filter((code: string) => ['A001', 'A002', 'B001'].includes(code));

  assert.deepEqual(regularSamples, ['A001']);
});
