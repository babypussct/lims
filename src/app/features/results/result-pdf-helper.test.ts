import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildFipronilPdfPayload,
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
