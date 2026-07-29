import assert from 'node:assert/strict';
import test from 'node:test';
import * as XLSX from 'xlsx';
import {
  applyExcelImportCandidates,
  buildExcelImportCandidates,
  formatImportedFinalConc,
  getRelevantExcelImportSheetNames,
  parseMassHunterResultWorkbook
} from './excel-result-import';

function makeWorkbook(sheetName = 'Bifenthrin') {
  const rows: any[][] = Array.from({ length: 18 }, () => []);
  rows[7][13] = 0.9997;
  rows[9][5] = 'Type';
  rows[9][8] = 'Sample name';
  rows[9][23] = 'Final-Conc.';

  ['C0', 'C1', 'C2', 'C3'].forEach((name, index) => {
    rows[10 + index][5] = 'Calibration';
    rows[10 + index][8] = `TT_${name}`;
    rows[10 + index][23] = index * 5;
  });
  rows[14][5] = 'Sample';
  rows[14][8] = 'TT_TBVTV_MINH_BL01';
  rows[14][23] = 1.234567;
  rows[15][5] = 'Sample';
  rows[15][8] = 'TT_TBVTV_MINH_SP01';
  rows[15][23] = 'N.D';
  rows[16][5] = 'Sample';
  rows[16][8] = 'TT_TBVTV_BL';
  rows[16][23] = 'N.D';
  rows[17][5] = 'Sample';
  rows[17][8] = 'TT_TBVTV_SP';
  rows[17][23] = 4.98;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rows), sheetName);
  return workbook;
}

function makeContext(printFormType: 'formCheck' | 'formDon') {
  return {
    run: {
      sampleList: ['BL01', 'MINH_BL01', 'MINH_SP01'],
      sampleTargetMap: {
        BL01: ['bifenthrin'],
        MINH_BL01: ['bifenthrin'],
        MINH_SP01: ['bifenthrin']
      }
    },
    draft: {
      page1Data: {
        printFormType,
        activeCompound: 'bifenthrin',
        r2: '',
        r2ByCompound: {},
        calibPoints: [
          { loSo: 'C0', vialNo: '1', hamLuong: '0' },
          { loSo: 'C1', vialNo: '2', hamLuong: '5' },
          { loSo: 'C2', vialNo: '3', hamLuong: '10' },
          { loSo: 'C3', vialNo: '4', hamLuong: '20' },
          { loSo: 'C4', vialNo: '5', hamLuong: '50' },
          { loSo: 'C5', vialNo: '6', hamLuong: '100' }
        ]
      },
      resultData: {
        BL01: { bifenthrin: '', selected: true },
        MINH_BL01: { bifenthrin: 'old', selected: true },
        MINH_SP01: { bifenthrin: 'old-nd', selected: true }
      }
    },
    config: {
      formType: 'type3b',
      compounds: ['bifenthrin']
    },
    configKey: 'nhom-cuc',
    masterTargets: [] as any[]
  };
}

function makeSop01Workbook() {
  const rows: any[][] = Array.from({ length: 17 }, () => []);
  rows[9][5] = 'Type';
  rows[9][8] = 'Sample name';
  rows[9][23] = 'Final-Conc.';

  [
    ['FIPRONIL_BL0107F', 0.004468],
    ['FIPRONIL_SP0107F', 9.93477],
    ['FIPRONIL_27_U01.D', 8.15939],
    ['FIPRONIL_SP_1', 9.1],
    ['FIPRONIL_27_U11.D', 8.50969],
    ['FIPRONIL_SP_2', 9.2],
    ['FIPRONIL_27_U21.D', 8.04967]
  ].forEach(([sampleName, finalConc], index) => {
    rows[10 + index][5] = 'Sample';
    rows[10 + index][8] = sampleName;
    rows[10 + index][23] = finalConc;
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rows), 'FIPRONIL');
  return workbook;
}

function makeSop01Context() {
  const sampleList = ['U0127', 'U1127', 'U2127'];
  const resultData: Record<string, any> = {
    QC_BLANK: {},
    QC_SPIKE: {},
    QC_SPIKE_1: {},
    QC_SPIKE_2: {}
  };
  const sampleTargetMap: Record<string, string[]> = {};

  sampleList.forEach(sample => {
    resultData[sample] = { kqFip: '', selected: true };
    sampleTargetMap[sample] = ['fipronil'];
  });

  return {
    run: {
      sopId: 'SOP-01',
      sampleList,
      sampleTargetMap
    },
    draft: {
      page1Data: {},
      resultData
    },
    config: {
      formType: 'type2',
      columns: {
        kqFip: 'Fipronil'
      }
    },
    configKey: 'fipronil-chlorpyrifos',
    masterTargets: [] as any[]
  };
}

test('SOP-01 maps dated samples and recognizes BLANK, SPIKE and SPIKE_N rows', () => {
  const parsed = parseMassHunterResultWorkbook(XLSX, makeSop01Workbook());
  const candidates = buildExcelImportCandidates(parsed, makeSop01Context())
    .filter(candidate => candidate.kind === 'result');
  const targetFor = (sourceSample: string) =>
    candidates.find(candidate => candidate.sourceSample === sourceSample);

  assert.equal(targetFor('FIPRONIL_27_U01.D')?.targetSample, 'U0127');
  assert.equal(targetFor('FIPRONIL_27_U11.D')?.targetSample, 'U1127');
  assert.equal(targetFor('FIPRONIL_27_U21.D')?.targetSample, 'U2127');
  assert.equal(targetFor('FIPRONIL_BL0107F')?.targetSample, 'QC_BLANK');
  assert.equal(targetFor('FIPRONIL_SP0107F')?.targetSample, 'QC_SPIKE');
  assert.equal(targetFor('FIPRONIL_SP_1')?.targetSample, 'QC_SPIKE_1');
  assert.equal(targetFor('FIPRONIL_SP_2')?.targetSample, 'QC_SPIKE_2');
  assert.equal(candidates.every(candidate => candidate.selectable), true);
  assert.equal(candidates.every(candidate => candidate.selected), true);
});

test('maps sequence names in xxx_day_sample format for SOPs other than SOP-01', () => {
  const workbook = makeWorkbook();
  workbook.Sheets.Bifenthrin['I15'] = {
    t: 's',
    v: 'TT_TBVTV_27_U01.D'
  };
  const context = makeContext('formCheck');
  context.run.sampleList.push('U0127');
  context.run.sampleTargetMap.U0127 = ['bifenthrin'];
  context.draft.resultData.U0127 = { bifenthrin: '', selected: true };

  const candidates = buildExcelImportCandidates(
    parseMassHunterResultWorkbook(XLSX, workbook),
    context
  );
  const datedSample = candidates.find(
    candidate => candidate.sourceSample === 'TT_TBVTV_27_U01.D'
  );

  assert.equal(context.configKey, 'nhom-cuc');
  assert.equal(datedSample?.targetSample, 'U0127');
  assert.equal(datedSample?.status, 'ready');
  assert.equal(datedSample?.selectable, true);
});

test('selects only compound sheets relevant to the current SOP', () => {
  const sop01Sheets = getRelevantExcelImportSheetNames(
    [
      'Options',
      'Compound',
      'FIPRONIL',
      'FIPRONIL DESULFINYL',
      'FIPRONIL_SULFIDE',
      'Design-Compound'
    ],
    makeSop01Context()
  );

  assert.deepEqual(sop01Sheets, [
    'FIPRONIL',
    'FIPRONIL DESULFINYL',
    'FIPRONIL_SULFIDE'
  ]);

  const aliasContext = makeContext('formCheck');
  aliasContext.masterTargets = [{
    id: 'bifenthrin',
    name: 'Bifenthrin',
    aliases: ['Bifenthrin instrument alias']
  }];
  assert.deepEqual(
    getRelevantExcelImportSheetNames(
      ['Options', 'Bifenthrin instrument alias', 'Pirimiphos methyl'],
      aliasContext
    ),
    ['Bifenthrin instrument alias']
  );
});

test('Form Check matches BL01/SP01 as regular samples and does not create QC rows', () => {
  const parsed = parseMassHunterResultWorkbook(XLSX, makeWorkbook());
  const context = makeContext('formCheck');
  const candidates = buildExcelImportCandidates(parsed, context);
  const results = candidates.filter(candidate => candidate.kind === 'result');

  const bl01 = results.find(candidate => candidate.sourceSample === 'TT_TBVTV_MINH_BL01')!;
  const sp01 = results.find(candidate => candidate.sourceSample === 'TT_TBVTV_MINH_SP01')!;
  const blank = results.find(candidate => candidate.sourceSample === 'TT_TBVTV_BL')!;

  assert.equal(bl01.targetSample, 'MINH_BL01');
  assert.equal(sp01.targetSample, 'MINH_SP01');
  assert.equal(blank.targetSample, undefined);
  assert.equal(blank.status, 'not-in-form');
  assert.equal(blank.selectable, false);
  assert.equal(blank.selected, false);
  assert.equal(bl01.importValue, '1.234567');
  assert.equal(candidates.some(candidate => candidate.kind === 'r2'), false);
});

test('Form Check applies ND checkbox, overwrites selected rows and preserves unchecked rows', () => {
  const parsed = parseMassHunterResultWorkbook(XLSX, makeWorkbook());
  const context = makeContext('formCheck');
  const candidates = buildExcelImportCandidates(parsed, context);

  const numeric = candidates.find(candidate => candidate.sourceSample === 'TT_TBVTV_MINH_BL01')!;
  const nd = candidates.find(candidate => candidate.sourceSample === 'TT_TBVTV_MINH_SP01')!;
  numeric.selected = false;
  candidates.forEach(candidate => {
    if (candidate.kind === 'result' && candidate !== nd) candidate.selected = false;
  });

  applyExcelImportCandidates(candidates, context, 'test.xlsx');

  assert.equal(context.draft.resultData.MINH_BL01.bifenthrin, 'old');
  assert.equal(context.draft.resultData.MINH_SP01.bifenthrin, '');
  assert.equal(context.draft.resultData.MINH_SP01.bifenthrin_nd, true);
});

test('Form Đơn writes ND text, imports per-compound R² and keeps nominal calibration concentrations', () => {
  const parsed = parseMassHunterResultWorkbook(XLSX, makeWorkbook());
  const context = makeContext('formDon');
  const candidates = buildExcelImportCandidates(parsed, context);

  candidates.forEach(candidate => {
    candidate.selected = candidate.kind !== 'result'
      || candidate.sourceSample === 'TT_TBVTV_MINH_SP01';
  });
  applyExcelImportCandidates(candidates, context, 'test.xlsx');

  assert.equal(context.draft.resultData.MINH_SP01.bifenthrin, 'ND');
  assert.equal(context.draft.page1Data.r2ByCompound.bifenthrin, '0.9997');
  assert.equal(context.draft.page1Data.r2, '0.9997');
  assert.equal(context.draft.page1Data.calibPoints.length, 4);
  assert.deepEqual(
    context.draft.page1Data.calibPoints.map((point: any) => point.hamLuong),
    ['0', '5', '10', '20']
  );
});

test('matches punctuation variants in compound sheet names', () => {
  const parsed = parseMassHunterResultWorkbook(XLSX, makeWorkbook('Ronnel _Fenchlorphos_'));
  const context = makeContext('formDon');
  context.config.compounds = ['ronnel_fenchlorphos'];
  context.run.sampleTargetMap = {
    MINH_BL01: ['ronnel_fenchlorphos'],
    MINH_SP01: ['ronnel_fenchlorphos']
  };

  const candidates = buildExcelImportCandidates(parsed, context);
  const sample = candidates.find(candidate => candidate.sourceSample === 'TT_TBVTV_MINH_BL01')!;
  assert.equal(sample.compoundId, 'ronnel_fenchlorphos');
  assert.equal(sample.selectable, true);
});

test('matches built-in and Master Analyte aliases for compound sheets', () => {
  const builtInContext = makeContext('formCheck');
  builtInContext.config.compounds = ['ethofenprox'];
  builtInContext.run.sampleTargetMap = {
    MINH_BL01: ['ethofenprox'],
    MINH_SP01: ['ethofenprox']
  };
  const builtInCandidates = buildExcelImportCandidates(
    parseMassHunterResultWorkbook(XLSX, makeWorkbook('Etofenprox')),
    builtInContext
  );
  assert.equal(
    builtInCandidates.find(candidate => candidate.sourceSample === 'TT_TBVTV_MINH_BL01')?.compoundId,
    'ethofenprox'
  );

  const masterContext = makeContext('formCheck');
  masterContext.config.compounds = ['bifenthrin'];
  masterContext.masterTargets = [{
    id: 'bifenthrin',
    name: 'Bifenthrin',
    aliases: ['Bifenthrin instrument alias']
  }];
  const masterCandidates = buildExcelImportCandidates(
    parseMassHunterResultWorkbook(XLSX, makeWorkbook('Bifenthrin instrument alias')),
    masterContext
  );
  assert.equal(
    masterCandidates.find(candidate => candidate.sourceSample === 'TT_TBVTV_MINH_BL01')?.compoundId,
    'bifenthrin'
  );
});

test('uses Master Analyte when validating legacy target assignments', () => {
  const context = makeContext('formCheck');
  context.config.compounds = ['pirimiphos_methyl'];
  context.run.sampleTargetMap = {
    MINH_BL01: ['legacy-pirimiphos-target-id'],
    MINH_SP01: ['legacy-pirimiphos-target-id']
  };
  context.masterTargets = [{
    id: 'legacy-pirimiphos-target-id',
    name: 'Pirimiphos methyl'
  }];

  const candidates = buildExcelImportCandidates(
    parseMassHunterResultWorkbook(XLSX, makeWorkbook('Pirimiphos methyl')),
    context
  );
  const sample = candidates.find(
    candidate => candidate.sourceSample === 'TT_TBVTV_MINH_BL01'
  )!;

  assert.equal(sample.compoundId, 'pirimiphos_methyl');
  assert.equal(sample.targetSample, 'MINH_BL01');
  assert.equal(sample.status, 'ready');
  assert.equal(sample.selectable, true);
  assert.equal(sample.selected, true);
});

test('rounds only numeric Final-Conc. when the user selects decimal places', () => {
  assert.equal(formatImportedFinalConc('1.234567', false, null), '1.234567');
  assert.equal(formatImportedFinalConc('1.234567', false, 2), '1.23');
  assert.equal(formatImportedFinalConc('1.2', false, 4), '1.2000');
  assert.equal(formatImportedFinalConc('N.D', true, 2), 'ND');
  assert.equal(formatImportedFinalConc('0.000', false, null), 'ND');
  assert.equal(formatImportedFinalConc('0,000', false, 3), 'ND');
});

test('treats zero Final-Conc. as ND on both Form Check and Form Đơn', () => {
  const workbook = makeWorkbook();
  workbook.Sheets.Bifenthrin['X15'] = { t: 's', v: '0.000' };
  const parsed = parseMassHunterResultWorkbook(XLSX, workbook);

  const checkContext = makeContext('formCheck');
  const checkCandidates = buildExcelImportCandidates(parsed, checkContext);
  const checkZero = checkCandidates.find(
    candidate => candidate.sourceSample === 'TT_TBVTV_MINH_BL01'
  )!;
  checkCandidates.forEach(candidate => candidate.selected = candidate === checkZero);
  applyExcelImportCandidates(checkCandidates, checkContext, 'zero.xlsx');

  assert.equal(checkZero.isNd, true);
  assert.equal(checkZero.importValue, 'ND');
  assert.equal(checkContext.draft.resultData.MINH_BL01.bifenthrin, '');
  assert.equal(checkContext.draft.resultData.MINH_BL01.bifenthrin_nd, true);

  const singleContext = makeContext('formDon');
  const singleCandidates = buildExcelImportCandidates(parsed, singleContext);
  const singleZero = singleCandidates.find(
    candidate => candidate.sourceSample === 'TT_TBVTV_MINH_BL01'
  )!;
  singleCandidates.forEach(candidate => candidate.selected = candidate === singleZero);
  applyExcelImportCandidates(singleCandidates, singleContext, 'zero.xlsx');

  assert.equal(singleZero.isNd, true);
  assert.equal(singleContext.draft.resultData.MINH_BL01.bifenthrin, 'ND');
});
