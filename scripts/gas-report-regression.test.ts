import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { ANGULAR_SOP_CONFIG } from '../src/app/features/results/config/sop-configs';

const repoRoot = path.resolve(__dirname, '..');
const validSignatureMetadata = {
  ngayNguoiPhanTich: '2026-08-09',
  ngayNguoiThamTra: '2026-08-09',
};

test('Apps Script manifest pins runtime, scopes, URL allowlist, and web-app execution policy', () => {
  const manifestPath = path.join(repoRoot, 'gas/appsscript.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as {
    timeZone?: string;
    exceptionLogging?: string;
    runtimeVersion?: string;
    oauthScopes?: string[];
    urlFetchWhitelist?: string[];
    webapp?: { access?: string; executeAs?: string };
  };

  assert.equal(manifest.timeZone, 'Asia/Ho_Chi_Minh');
  assert.equal(manifest.exceptionLogging, 'STACKDRIVER');
  assert.equal(manifest.runtimeVersion, 'V8');
  assert.deepEqual(manifest.oauthScopes, [
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/script.external_request',
  ]);
  assert.deepEqual(manifest.urlFetchWhitelist, [
    'https://identitytoolkit.googleapis.com/',
    'https://firestore.googleapis.com/',
  ]);
  assert.deepEqual(manifest.webapp, {
    access: 'ANYONE_ANONYMOUS',
    executeAs: 'USER_DEPLOYING',
  });

  const generatorSource = fs.readFileSync(path.join(repoRoot, 'gas/LIMS_ReportGenerator.gs'), 'utf8');
  assert.match(generatorSource, /https:\/\/identitytoolkit\.googleapis\.com\//);
  assert.match(generatorSource, /https:\/\/firestore\.googleapis\.com\//);
});

function loadGasFile(relativePath: string): Record<string, unknown> {
  const code = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
  const context: Record<string, unknown> = {
    console,
    Logger: { log() {} },
  };
  vm.createContext(context);
  vm.runInContext(code, context, { filename: relativePath });
  return context;
}

function loadGasFiles(relativePaths: string[]): Record<string, unknown> {
  const context: Record<string, unknown> = {
    console,
    Logger: { log() {} },
  };
  vm.createContext(context);
  for (const relativePath of relativePaths) {
    const code = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
    vm.runInContext(code, context, { filename: relativePath });
  }
  return context;
}

test('Trifluralin parser preserves dd/MM/yyyy and separates analyst name', () => {
  const context = loadGasFile('gas/Report_Trifluralin.gs');
  const parse = context['parseDatedPersonValue'] as (value: unknown) => { date: string; name: string };

  assert.deepEqual(
    { ...parse('20/05/2026 / Ong Thanh Dat') },
    { date: '20/05/2026', name: 'Ong Thanh Dat' },
  );
  assert.deepEqual(
    { ...parse('20/05/2026 / Nguyen Van A / QA') },
    { date: '20/05/2026', name: 'Nguyen Van A / QA' },
  );
  assert.deepEqual(
    { ...parse('20/05/2026') },
    { date: '20/05/2026', name: '' },
  );
});

test('template variant routing is complete and resolves every configured Form Check/Form Don pair', () => {
  const context = loadGasFiles(['gas/SOP_Configs.gs', 'gas/LIMS_ReportGenerator.gs']);
  const resolveTemplate = context['resolveReportTemplateId'] as (sopId: string, metadata: unknown) => string;
  const configuredVariants = JSON.parse(vm.runInContext(
    'JSON.stringify(CONFIG.TEMPLATE_VARIANTS)',
    context as vm.Context,
  ) as string) as Record<string, { formCheck: string; formDon: string }>;
  const expectedVariants = {
    'lan-huu-co': { formCheck: 'lan-huu-co', formDon: 'lan-huu-co-don' },
    'chlor-huu-co': { formCheck: 'chlor-huu-co', formDon: 'chlor-huu-co-don' },
    'nhom-cuc': { formCheck: 'nhom-cuc', formDon: 'nhom-cuc-don' },
    'nhom-i': { formCheck: 'nhom-i', formDon: 'nhom-i-don' },
    'tbvtv-trong-nuoc-gcmsms': {
      formCheck: 'tbvtv-trong-nuoc-gcmsms',
      formDon: 'tbvtv-trong-nuoc-gcmsms-don',
    },
  };

  assert.deepEqual(configuredVariants, expectedVariants);

  for (const [sopId, variants] of Object.entries(expectedVariants)) {
    for (const formType of ['formCheck', 'formDon'] as const) {
      const expectedTemplate = vm.runInContext(
        `CONFIG.TEMPLATES[${JSON.stringify(variants[formType])}]`,
        context as vm.Context,
      ) as string;
      assert.equal(resolveTemplate(sopId, { printFormType: formType }), expectedTemplate);
    }
  }
});

test('template variant configuration fails fast for missing, dangling, or placeholder targets', () => {
  const invalidCases = [
    {
      mutate: "CONFIG.TEMPLATE_VARIANTS['lan-huu-co'].formDon = ''",
      expected: /lan-huu-co: formDon template key is missing/,
    },
    {
      mutate: "CONFIG.TEMPLATE_VARIANTS['lan-huu-co'].formDon = 'missing-template-key'",
      expected: /formDon target "missing-template-key" is not declared in CONFIG\.TEMPLATES/,
    },
    {
      mutate: "CONFIG.TEMPLATES['lan-huu-co-don'] = 'PASTE_GOOGLE_DOC_ID_HERE'",
      expected: /formDon target "lan-huu-co-don" has no configured template ID/,
    },
  ];

  for (const invalidCase of invalidCases) {
    const context = loadGasFiles(['gas/SOP_Configs.gs', 'gas/LIMS_ReportGenerator.gs']);
    const resolveTemplate = context['resolveReportTemplateId'] as (sopId: string, metadata: unknown) => string;
    vm.runInContext(invalidCase.mutate, context as vm.Context);
    assert.throws(
      () => resolveTemplate('lan-huu-co', { printFormType: 'formDon' }),
      invalidCase.expected,
    );
  }
});

test('SOP 9.14 full and compact templates stay outside generic Form Check/Form Don variants', () => {
  const context = loadGasFiles(['gas/SOP_Configs.gs', 'gas/LIMS_ReportGenerator.gs']);
  const resolveTemplate = context['resolveReportTemplateId'] as (sopId: string, metadata: unknown) => string;
  const variants = JSON.parse(vm.runInContext(
    'JSON.stringify(CONFIG.TEMPLATE_VARIANTS)',
    context as vm.Context,
  ) as string) as Record<string, unknown>;

  assert.equal(variants['tbvtv-thuc-pham-gcmsms'], undefined);
  assert.equal(variants['tbvtv-thuc-pham-gcmsms-rut-gon'], undefined);
  assert.equal(
    resolveTemplate('tbvtv-thuc-pham-gcmsms', { printFormType: 'formDayDu' }),
    vm.runInContext("CONFIG.TEMPLATES['tbvtv-thuc-pham-gcmsms']", context as vm.Context),
  );
  assert.equal(
    resolveTemplate('tbvtv-thuc-pham-gcmsms-rut-gon', { printFormType: 'formRutGon' }),
    vm.runInContext("CONFIG.TEMPLATES['tbvtv-thuc-pham-gcmsms-rut-gon']", context as vm.Context),
  );
});

function createTemplateTable(rows: string[][]) {
  return {
    getNumRows: () => rows.length,
    getRow: (rowIndex: number) => ({
      getNumCells: () => rows[rowIndex].length,
      getCell: (cellIndex: number) => ({ getText: () => rows[rowIndex][cellIndex] }),
      getText: () => rows[rowIndex].join(' '),
    }),
  };
}

function createTrifluralinCalibrationTemplateTable(marker = 'R2') {
  return createTemplateTable([
    ['P1', ''],
    ['P2', ''],
    ['P3', ''],
    ['P4', ''],
    ['P5', ''],
    ['P6', ''],
    ['P7', ''],
    [marker, ''],
  ]);
}

function createFipronilCalibrationTemplateTable(marker = 'Điểm chuẩn') {
  return createTemplateTable([
    [marker, '', '', 'Vial No'],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
  ]);
}

const FIPRONIL_QC_LABELS = [
  'Mẫu kiểm tra nội bộ',
  'Hệ số hồi quy tuyến tính',
  'Độ lệch thời gian lưu',
  'Các yêu cầu về nhận dạng khi phát hiện mẫu nhiễm',
  'Các yêu cầu về nhận dạng của mẫu thêm chuẩn tại 5ppb',
  'Độ thu hồi IS',
  'Đánh giá chung',
] as const;

function createFipronilQcTemplateTable(options: { omitLabel?: string; unwritableLabel?: string } = {}) {
  const rows = [['Thông số đánh giá', '', 'Đánh giá']];
  for (const label of FIPRONIL_QC_LABELS) {
    if (label === options.omitLabel) continue;
    rows.push([
      label,
      '',
      label === options.unwritableLabel ? 'Đạt / Không đạt / N/A' : '☐ Đạt; ☐ Không đạt; ☐ N/A',
    ]);
  }
  return createTemplateTable(rows);
}

function createFipronilSampleTemplateTable() {
  const row = () => Array.from({ length: 9 }, () => '');
  return createTemplateTable([
    row(),
    row(),
    row(),
  ]);
}

function assertCustomType2PreflightBlocksMutation(
  sopId: string,
  tables: unknown[],
  expectedError: RegExp,
) {
  const context = loadGasFiles(['gas/SOP_Configs.gs', 'gas/LIMS_ReportGenerator.gs']);
  let folderCalls = 0;
  let reporterCalls = 0;
  context['DocumentApp'] = {
    openById: () => ({
      getBody: () => ({
        getText: () => 'date1 date2',
        getTables: () => tables,
      }),
    }),
  };
  context['Utilities'] = { formatDate: () => '20260809_2200' };
  context['getOrCreateFolder'] = () => {
    folderCalls++;
    return { id: 'folder-must-not-exist' };
  };
  const reporterName = 'generateCustomReport_' + sopId.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  context[reporterName] = () => {
    reporterCalls++;
    throw new Error('reporter must not be reached');
  };

  const generateCore = context['generateReportCore'] as (
    sopId: string,
    metadata: Record<string, unknown>,
    samples: Record<string, unknown>[],
    version?: number,
  ) => unknown;

  assert.throws(
    () => generateCore(sopId, { batchCode: 'B-PREFLIGHT' }, [{ maSoMau: 'M01' }], 1),
    expectedError,
  );
  assert.equal(folderCalls, 0, `${sopId} must fail before folder creation`);
  assert.equal(reporterCalls, 0, `${sopId} must fail before custom reporter/Drive copy`);
}

function createType2RenderHarness(options: { maxAppendedTables?: number } = {}) {
  const elementType = {
    PARAGRAPH: 'PARAGRAPH',
    TABLE: 'TABLE',
    PAGE_BREAK: 'PAGE_BREAK',
    LIST_ITEM: 'LIST_ITEM',
  } as const;
  const pageBreakBefore = 'PAGE_BREAK_BEFORE';
  const maxAppendedTables = options.maxAppendedTables ?? Number.POSITIVE_INFINITY;
  let appendedTables = 0;

  const makeCell = (initialText = '') => {
    let text = initialText;
    const cell: any = {};
    cell.getText = () => text;
    cell.setText = (value: unknown) => {
      text = value === undefined || value === null ? '' : String(value);
      return cell;
    };
    cell.replaceText = (pattern: string, replacement: string) => {
      text = text.replace(new RegExp(pattern, 'g'), replacement);
      return cell;
    };
    cell.clear = () => {
      text = '';
      return cell;
    };
    return cell;
  };

  const makeRow = (values: string[]) => {
    const cells = values.map((value) => makeCell(value));
    return {
      getNumCells: () => cells.length,
      getCell: (cellIndex: number) => cells[cellIndex],
      getText: () => cells.map((cell) => cell.getText()).join(' '),
      snapshot: () => cells.map((cell) => cell.getText()),
    };
  };

  const makeTable = (values: string[][]) => {
    const rows = values.map((row) => makeRow(row));
    const table: any = {};
    table.getType = () => elementType.TABLE;
    table.asTable = () => table;
    table.getNumRows = () => rows.length;
    table.getRow = (rowIndex: number) => rows[rowIndex];
    table.copy = () => makeTable(rows.map((row) => row.snapshot()));
    return table;
  };

  const makeParagraph = (initialText: string, initialAttributes: Record<string, unknown> = {}) => {
    let text = initialText;
    const attributes = { ...initialAttributes };
    const paragraph: any = {};
    paragraph.getType = () => elementType.PARAGRAPH;
    paragraph.asParagraph = () => paragraph;
    paragraph.getText = () => text;
    paragraph.getAttributes = () => attributes;
    paragraph.getNumChildren = () => 0;
    paragraph.getChild = () => {
      throw new Error('mock paragraph has no children');
    };
    paragraph.copy = () => makeParagraph(text, attributes);
    paragraph.replaceText = (pattern: string, replacement: string) => {
      text = text.replace(new RegExp(pattern, 'g'), replacement);
      return paragraph;
    };
    paragraph.setAttributes = (nextAttributes: Record<string, unknown>) => {
      Object.assign(attributes, nextAttributes);
      return paragraph;
    };
    paragraph.setSpacingBefore = () => paragraph;
    paragraph.setSpacingAfter = () => paragraph;
    paragraph.setLineSpacing = () => paragraph;
    paragraph.setFontSize = () => paragraph;
    paragraph.clear = () => {
      text = '';
      return paragraph;
    };
    paragraph.removeChild = () => paragraph;
    return paragraph;
  };

  const makePageBreak = () => ({
    getType: () => elementType.PAGE_BREAK,
  });

  const sampleRows = [
    ['Mã số mẫu'],
    [''],
    [''],
    [''],
    [''],
    [''],
  ];
  const children: any[] = [makeTable(sampleRows), makeParagraph('Trang: 1/1')];
  const body: any = {};
  body.getTables = () => children.filter((child) => child.getType() === elementType.TABLE);
  body.getChildIndex = (child: unknown) => children.indexOf(child);
  body.getNumChildren = () => children.length;
  body.getChild = (childIndex: number) => children[childIndex];
  body.appendPageBreak = () => {
    const pageBreak = makePageBreak();
    children.push(pageBreak);
    return pageBreak;
  };
  body.appendTable = (table: unknown) => {
    if (appendedTables < maxAppendedTables) {
      children.push(table);
    }
    appendedTables++;
    return table;
  };
  body.appendParagraph = (paragraph: unknown) => {
    children.push(paragraph);
    return paragraph;
  };
  body.appendListItem = (listItem: unknown) => {
    children.push(listItem);
    return listItem;
  };
  body.removeChild = (child: unknown) => {
    const childIndex = children.indexOf(child);
    if (childIndex >= 0) children.splice(childIndex, 1);
    return body;
  };

  return {
    body,
    documentApp: {
      ElementType: elementType,
      Attribute: { PAGE_BREAK_BEFORE: pageBreakBefore },
    },
    getRenderedSampleIds: () => body.getTables().flatMap((table: any) => {
      const values: string[] = [];
      for (let rowIndex = 1; rowIndex < table.getNumRows(); rowIndex++) {
        const value = table.getRow(rowIndex).getCell(0).getText();
        if (value) values.push(value);
      }
      return values;
    }),
    getPageLabels: () => children
      .filter((child) => child.getType() === elementType.PARAGRAPH)
      .map((paragraph) => paragraph.getText())
      .filter((text) => text.startsWith('Trang:')),
  };
}

test('template preflight rejects malformed Type2 template before folder creation or Drive copy', () => {
  const context = loadGasFiles(['gas/SOP_Configs.gs', 'gas/LIMS_ReportGenerator.gs']);
  let folderCalls = 0;
  let driveReads = 0;
  context['DocumentApp'] = {
    openById: () => ({
      getBody: () => ({
        getText: () => 'date1 date2',
        getTables: () => [createTemplateTable([['unrelated']])],
      }),
    }),
  };
  context['DriveApp'] = {
    getFileById: () => {
      driveReads++;
      throw new Error('Drive copy path must not be reached');
    },
  };
  context['getOrCreateFolder'] = () => {
    folderCalls++;
    return {};
  };

  const generateCore = context['generateReportCore'] as (
    sopId: string,
    metadata: Record<string, unknown>,
    samples: Record<string, unknown>[],
    version?: number,
  ) => unknown;

  assert.throws(
    () => generateCore('trifluralin-gcms', { batchCode: 'B01' }, [{ maSoMau: 'M01' }], 1),
    /sampleTableIndex 1 is outside 1 tables/,
  );
  assert.equal(folderCalls, 0);
  assert.equal(driveReads, 0);
});

test('valid Type2 template passes preflight and proceeds to the configured reporter', () => {
  const context = loadGasFiles(['gas/SOP_Configs.gs', 'gas/LIMS_ReportGenerator.gs']);
  let folderCalls = 0;
  let reporterCalls = 0;
  const validSampleTable = createTemplateTable([
    ['Lọ số', 'Mẫu thử', 'KQ', 'Ghi chú'],
    ['', '', '', ''],
  ]);
  context['DocumentApp'] = {
    openById: () => ({
      getBody: () => ({
        getText: () => 'date1 date2',
        getTables: () => [createTrifluralinCalibrationTemplateTable(), validSampleTable],
      }),
    }),
  };
  context['Utilities'] = { formatDate: () => '20260809_1915' };
  context['getOrCreateFolder'] = () => {
    folderCalls++;
    return { id: 'folder' };
  };
  context['generateCustomReport_trifluralin_gcms'] = () => {
    reporterCalls++;
    return { docId: 'doc-1', pdfId: 'pdf-1', fileName: 'ok' };
  };

  const generateCore = context['generateReportCore'] as (
    sopId: string,
    metadata: Record<string, unknown>,
    samples: Record<string, unknown>[],
    version?: number,
  ) => Record<string, unknown>;
  const result = generateCore('trifluralin-gcms', { batchCode: 'B01' }, [{ maSoMau: 'M01' }], 1);

  assert.equal(folderCalls, 1);
  assert.equal(reporterCalls, 1);
  assert.equal(result['docId'], 'doc-1');
});

test('Trifluralin preflight requires exactly one writable R² calibration table before mutation', () => {
  const sampleTable = createTemplateTable([
    ['Lọ số', 'Mẫu thử', 'KQ', 'Ghi chú'],
    ['', '', '', ''],
  ]);

  assertCustomType2PreflightBlocksMutation(
    'trifluralin-gcms',
    [createTemplateTable([['not calibration']]), sampleTable],
    /expected exactly 1 writable Trifluralin calibration\/R² table, found 0/,
  );
  assertCustomType2PreflightBlocksMutation(
    'trifluralin-gcms',
    [createTrifluralinCalibrationTemplateTable(), sampleTable, createTrifluralinCalibrationTemplateTable('R²')],
    /expected exactly 1 writable Trifluralin calibration\/R² table, found 2/,
  );
});

test('Fipronil-style preflight rejects missing or ambiguous calibration tables before mutation', () => {
  for (const sopId of ['fipronil-chlorpyrifos', 'tbvtv-thuc-pham-gcmsms-rut-gon']) {
    const qcTable = createFipronilQcTemplateTable();
    const sampleTable = createFipronilSampleTemplateTable();
    assertCustomType2PreflightBlocksMutation(
      sopId,
      [createTemplateTable([['not calibration']]), qcTable, sampleTable],
      /expected exactly 1 writable Fipronil-style calibration table, found 0/,
    );
    assertCustomType2PreflightBlocksMutation(
      sopId,
      [createFipronilCalibrationTemplateTable(), createFipronilCalibrationTemplateTable('Vial No'), sampleTable, qcTable],
      /expected exactly 1 writable Fipronil-style calibration table, found 2/,
    );
  }
});

test('Fipronil-style preflight requires the QC table for full and compact SOPs before mutation', () => {
  for (const sopId of ['fipronil-chlorpyrifos', 'tbvtv-thuc-pham-gcmsms-rut-gon']) {
    assertCustomType2PreflightBlocksMutation(
      sopId,
      [
        createFipronilCalibrationTemplateTable(),
        createTemplateTable([['not QC']]),
        createFipronilSampleTemplateTable(),
      ],
      /expected exactly 1 Fipronil-style QC table, found 0/,
    );
  }
});

test('Fipronil-style preflight requires configured QC rows and writable checkbox markers', () => {
  assertCustomType2PreflightBlocksMutation(
    'fipronil-chlorpyrifos',
    [
      createFipronilCalibrationTemplateTable(),
      createFipronilQcTemplateTable({ omitLabel: 'Độ thu hồi IS' }),
      createFipronilSampleTemplateTable(),
    ],
    /expected exactly 1 QC row for "Độ thu hồi IS", found 0/,
  );
  assertCustomType2PreflightBlocksMutation(
    'fipronil-chlorpyrifos',
    [
      createFipronilCalibrationTemplateTable(),
      createFipronilQcTemplateTable({ unwritableLabel: 'Hệ số hồi quy tuyến tính' }),
      createFipronilSampleTemplateTable(),
    ],
    /QC row "Hệ số hồi quy tuyến tính" has no writable Đạt\/Không đạt\/N\/A checkbox markers/,
  );
});

test('valid Fipronil-style templates pass custom preflight for full and compact SOPs', () => {
  for (const sopId of ['fipronil-chlorpyrifos', 'tbvtv-thuc-pham-gcmsms-rut-gon']) {
    const context = loadGasFiles(['gas/SOP_Configs.gs', 'gas/LIMS_ReportGenerator.gs']);
    let folderCalls = 0;
    let reporterCalls = 0;
    context['DocumentApp'] = {
      openById: () => ({
        getBody: () => ({
          getText: () => 'date1 date2',
          getTables: () => [
            createFipronilCalibrationTemplateTable(),
            createFipronilQcTemplateTable(),
            createFipronilSampleTemplateTable(),
          ],
        }),
      }),
    };
    context['Utilities'] = { formatDate: () => '20260809_2210' };
    context['getOrCreateFolder'] = () => {
      folderCalls++;
      return { id: `folder-${sopId}` };
    };
    const reporterName = 'generateCustomReport_' + sopId.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    context[reporterName] = () => {
      reporterCalls++;
      return { docId: `doc-${sopId}`, pdfId: `pdf-${sopId}`, fileName: `file-${sopId}` };
    };

    const generateCore = context['generateReportCore'] as (
      sopId: string,
      metadata: Record<string, unknown>,
      samples: Record<string, unknown>[],
      version?: number,
    ) => Record<string, unknown>;
    const result = generateCore(sopId, { batchCode: 'B-VALID' }, [{ maSoMau: 'M01' }], 1);

    assert.equal(folderCalls, 1);
    assert.equal(reporterCalls, 1);
    assert.equal(result['docId'], `doc-${sopId}`);
  }
});

test('generateReportCore routes every supported custom SOP to its exact reporter without fallback', () => {
  const context = loadGasFiles(['gas/SOP_Configs.gs', 'gas/LIMS_ReportGenerator.gs']);
  const expectedRoutes = [
    ['trifluralin-gcms', 'generateCustomReport_trifluralin_gcms'],
    ['fipronil-chlorpyrifos', 'generateCustomReport_fipronil_chlorpyrifos'],
    ['tbvtv-thuc-pham-gcmsms-rut-gon', 'generateCustomReport_tbvtv_thuc_pham_gcmsms_rut_gon'],
    ['dichlorvos-gcms', 'generateCustomReport_dichlorvos_gcms'],
    ['chloroform-gcms', 'generateCustomReport_chloroform_gcms'],
  ] as const;
  const reporterCalls = new Map<string, unknown[][]>();
  let fallbackCalls = 0;

  context['resolveReportTemplateId'] = (sopId: string) => `template-${sopId}`;
  context['preflightReportTemplateContract'] = () => true;
  context['Utilities'] = { formatDate: () => '20260809_2000' };
  context['getOrCreateFolder'] = () => ({ id: 'folder-custom-route' });
  context['generateReportFromTemplate'] = () => {
    fallbackCalls++;
    throw new Error('fallback engine must not run for a supported custom SOP');
  };
  context['logRequestTrace'] = () => undefined;
  context['updateRequestTrace'] = () => undefined;

  for (const [sopId, reporterName] of expectedRoutes) {
    reporterCalls.set(reporterName, []);
    context[reporterName] = (...args: unknown[]) => {
      reporterCalls.get(reporterName)!.push(args);
      return { docId: `doc-${sopId}`, pdfId: `pdf-${sopId}`, fileName: `file-${sopId}` };
    };
  }

  const generateCore = context['generateReportCore'] as (
    sopId: string,
    metadata: Record<string, unknown>,
    samples: Record<string, unknown>[],
    version?: number,
  ) => Record<string, unknown>;

  for (const [sopId, reporterName] of expectedRoutes) {
    const metadata = { batchCode: 'B-CUSTOM' };
    const samples = [{ maSoMau: `S-${sopId}` }];
    const result = generateCore(sopId, metadata, samples, 2);
    const calls = reporterCalls.get(reporterName)!;

    assert.equal(calls.length, 1, `${reporterName} must be called exactly once`);
    assert.equal(calls[0][0], `template-${sopId}`);
    assert.equal(calls[0][1], metadata);
    assert.equal(calls[0][2], samples);
    assert.equal(calls[0][4], `KQ_${sopId}_B-CUSTOM_v2`);
    assert.equal(calls[0][5], 2);
    assert.equal(result['docId'], `doc-${sopId}`);
  }

  assert.equal(fallbackCalls, 0);
});

test('Form Don template preflight accepts reordered semantic headers', () => {
  const context = loadGasFiles(['gas/LIMS_ReportGenerator.gs', 'gas/Report_Type3B.gs']);
  const calibrationTable = createTemplateTable([
    ['Area', 'Nồng độ (ng/ml)', 'Điểm chuẩn', 'Vial No'],
    ['', '', '', ''],
  ]);
  const resultTable = createTemplateTable([
    ['Kết quả (µg/g)', 'Mã số mẫu', 'Vial', 'Khối lượng (g)', 'F'],
    ['', '', '', '', ''],
  ]);
  context['DocumentApp'] = {
    openById: () => ({
      getBody: () => ({
        getText: () => 'date1 date2',
        getTables: () => [calibrationTable, resultTable],
      }),
    }),
  };

  const preflight = context['preflightReportTemplateContract'] as (
    templateId: string,
    sopConfig: Record<string, unknown>,
    metadata: Record<string, unknown>,
    sopId: string,
  ) => boolean;

  assert.equal(preflight(
    'template-form-don',
    { formType: 'type3b', signaturePlaceholders: { date1: 'a', date2: 'b' } },
    { printFormType: 'formDon' },
    'type3b-test',
  ), true);
});

test('Form Don template preflight fails clearly when a required semantic header is missing', () => {
  const context = loadGasFiles(['gas/LIMS_ReportGenerator.gs', 'gas/Report_Type3B.gs']);
  const calibrationTable = createTemplateTable([
    ['Điểm chuẩn', 'Vial No', 'Nồng độ (ng/ml)'],
    ['', '', ''],
  ]);
  const malformedResultTable = createTemplateTable([
    ['Mã số mẫu', 'Khối lượng (g)', 'F', 'Vial'],
    ['', '', '', ''],
  ]);
  context['DocumentApp'] = {
    openById: () => ({
      getBody: () => ({
        getText: () => 'date1 date2',
        getTables: () => [calibrationTable, malformedResultTable],
      }),
    }),
  };

  const preflight = context['preflightReportTemplateContract'] as (
    templateId: string,
    sopConfig: Record<string, unknown>,
    metadata: Record<string, unknown>,
    sopId: string,
  ) => boolean;

  assert.throws(
    () => preflight(
      'template-form-don',
      { formType: 'type3b', signaturePlaceholders: { date1: 'a', date2: 'b' } },
      { printFormType: 'formDon' },
      'type3b-test',
    ),
    /result table: missing required header "Kết quả"/,
  );
});

test('Form Check template preflight requires a writable result segment for every configured compound', () => {
  const context = loadGasFiles(['gas/SOP_Configs.gs', 'gas/LIMS_ReportGenerator.gs']);
  const resultTable = createTemplateTable([
    ['Parathion-methyl', '☐ ND ........'],
    ['Parathion', '☐ ND ........'],
    ['Fipronil', '☐ ND ........'],
  ]);
  context['DocumentApp'] = {
    openById: () => ({
      getBody: () => ({
        getText: () => 'date1 date2',
        getTables: () => [resultTable],
      }),
    }),
  };

  const preflight = context['preflightReportTemplateContract'] as (
    templateId: string,
    sopConfig: Record<string, unknown>,
    metadata: Record<string, unknown>,
    sopId: string,
  ) => boolean;

  assert.equal(preflight(
    'template-form-check',
    {
      formType: 'type3b',
      signaturePlaceholders: { date1: 'a', date2: 'b' },
      compounds: ['Parathion', 'Parathion-methyl', 'Fipronil'],
    },
    { printFormType: 'formCheck' },
    'type3b-form-check-test',
  ), true);
});

test('Form Check template preflight does not let a longer compound name hide a missing result segment', () => {
  const context = loadGasFiles(['gas/SOP_Configs.gs', 'gas/LIMS_ReportGenerator.gs']);
  const incompleteResultTable = createTemplateTable([
    ['Parathion-methyl', '☐ ND ........'],
    ['Fipronil', 'result only', '........'],
  ]);
  context['DocumentApp'] = {
    openById: () => ({
      getBody: () => ({
        getText: () => 'date1 date2',
        getTables: () => [incompleteResultTable],
      }),
    }),
  };

  const preflight = context['preflightReportTemplateContract'] as (
    templateId: string,
    sopConfig: Record<string, unknown>,
    metadata: Record<string, unknown>,
    sopId: string,
  ) => boolean;

  assert.throws(
    () => preflight(
      'template-form-check',
      {
        formType: 'type3b',
        signaturePlaceholders: { date1: 'a', date2: 'b' },
        compounds: ['Parathion', 'Parathion-methyl', 'Fipronil'],
      },
      { printFormType: 'formCheck' },
      'type3b-form-check-test',
    ),
    /Form Check has no writable ND\/result segment for compounds: Parathion, Fipronil/,
  );
});

test('Form Check template preflight rejects result text that the renderer cannot mutate', () => {
  const context = loadGasFiles(['gas/SOP_Configs.gs', 'gas/LIMS_ReportGenerator.gs']);
  const unwritableResultTable = createTemplateTable([
    ['Parathion', 'ND ........'],
    ['Fipronil', '☐ ND', '........'],
  ]);
  context['DocumentApp'] = {
    openById: () => ({
      getBody: () => ({
        getText: () => 'date1 date2',
        getTables: () => [unwritableResultTable],
      }),
    }),
  };

  const preflight = context['preflightReportTemplateContract'] as (
    templateId: string,
    sopConfig: Record<string, unknown>,
    metadata: Record<string, unknown>,
    sopId: string,
  ) => boolean;

  assert.throws(
    () => preflight(
      'template-form-check',
      {
        formType: 'type3b',
        signaturePlaceholders: { date1: 'a', date2: 'b' },
        compounds: ['Parathion', 'Fipronil'],
      },
      { printFormType: 'formCheck' },
      'type3b-form-check-test',
    ),
    /Form Check has no writable ND\/result segment for compounds: Parathion, Fipronil/,
  );
});

test('mutation payload validator rejects malformed action payloads before Drive or Docs work', () => {
  const context = loadGasFiles(['gas/SOP_Configs.gs', 'gas/LIMS_ReportGenerator.gs']);
  const validatePayload = context['validateMutationPayload'] as (payload: Record<string, unknown>) => void;

  assert.doesNotThrow(() => validatePayload({
    action: 'generate_pdf',
    requestId: 'generate-001',
    sopId: 'trifluralin-gcms',
    metadata: { batchCode: 'BATCH-01', ...validSignatureMetadata },
    samples: [{ maSoMau: 'M01', kq: 'ND' }],
    version: 2,
  }));
  assert.throws(
    () => validatePayload({ action: 'generate_pdf', sopId: 'trifluralin-gcms', metadata: {}, samples: [] }),
    /Invalid requestId/,
  );
  assert.throws(
    () => validatePayload({ action: 'generate_pdf', requestId: 'generate-002', sopId: 'unknown-sop', metadata: {}, samples: [] }),
    /Unknown sopId/,
  );
  assert.throws(
    () => validatePayload({ action: 'generate_pdf', requestId: 'generate-003', sopId: 'trifluralin-gcms', metadata: null, samples: [] }),
    /Invalid metadata/,
  );
  assert.throws(
    () => validatePayload({ action: 'generate_pdf', requestId: 'generate-004', sopId: 'trifluralin-gcms', metadata: { ...validSignatureMetadata }, samples: 'bad' }),
    /Invalid samples/,
  );
  assert.throws(
    () => validatePayload({ action: 'generate_pdf', requestId: 'generate-005', sopId: 'trifluralin-gcms', metadata: { ...validSignatureMetadata }, samples: [], version: 0 }),
    /Invalid version/,
  );

  assert.doesNotThrow(() => validatePayload({
    action: 'archive_reports',
    requestId: 'archive-001',
    files: [{ docsUrl: 'https://docs.google.com/document/d/abc123/edit' }],
  }));
  assert.throws(
    () => validatePayload({ action: 'archive_reports', requestId: 'archive-002', files: [{ docsUrl: 'not-a-drive-url' }] }),
    /cannot resolve Drive file ID/,
  );

  assert.doesNotThrow(() => validatePayload({
    action: 'upload_excel',
    requestId: 'req-001',
    fileName: 'source.xlsx',
    fileData: 'ZmFrZQ==',
    sopId: 'fipronil-chlorpyrifos',
  }));
  assert.throws(
    () => validatePayload({
      action: 'upload_excel',
      requestId: '',
      fileName: 'source.xlsx',
      fileData: 'ZmFrZQ==',
      sopId: 'fipronil-chlorpyrifos',
    }),
    /Invalid requestId/,
  );
  assert.throws(
    () => validatePayload({
      action: 'upload_excel',
      requestId: 'req-002',
      fileName: 'source.csv',
      fileData: 'ZmFrZQ==',
      sopId: 'fipronil-chlorpyrifos',
    }),
    /only \.xlsx and \.xls are allowed/,
  );
  assert.throws(
    () => validatePayload({
      action: 'upload_excel',
      requestId: 'req-003',
      fileName: '..\\source.xlsx',
      fileData: 'ZmFrZQ==',
      sopId: 'fipronil-chlorpyrifos',
    }),
    /without path separators/,
  );
  assert.throws(() => validatePayload({ action: 'unknown_action' }), /Unknown action/);
});

test('generate_pdf requires configured signature metadata before Drive or Docs generation work', () => {
  const context = loadGasFiles(['gas/SOP_Configs.gs', 'gas/LIMS_ReportGenerator.gs']);
  let driveCalls = 0;
  let documentCalls = 0;
  context['DriveApp'] = {
    getFileById: () => {
      driveCalls++;
      throw new Error('Drive work must not be reached');
    },
    getFolderById: () => {
      driveCalls++;
      throw new Error('Drive work must not be reached');
    },
  };
  context['DocumentApp'] = {
    openById: () => {
      documentCalls++;
      throw new Error('Docs work must not be reached');
    },
  };

  const generateReport = context['generateReport'] as (
    sopId: string,
    metadata: Record<string, unknown>,
    samples: Record<string, unknown>[],
    version: number,
    requestId: string,
  ) => unknown;

  assert.throws(
    () => generateReport(
      'trifluralin-gcms',
      { batchCode: 'BATCH-SIGNATURE', ngayNguoiThamTra: '2026-08-09' },
      [],
      1,
      'missing-analyst-date',
    ),
    /Missing required metadata field: ngayNguoiPhanTich \(signature placeholder date1\)/,
  );
  assert.throws(
    () => generateReport(
      'trifluralin-gcms',
      { batchCode: 'BATCH-SIGNATURE', ngayNguoiPhanTich: '2026-08-09', ngayNguoiThamTra: '   ' },
      [],
      1,
      'blank-reviewer-date',
    ),
    /Missing required metadata field: ngayNguoiThamTra \(signature placeholder date2\)/,
  );
  assert.equal(driveCalls, 0);
  assert.equal(documentCalls, 0);
});

test('doPost emits one structured request trace across success and error paths', () => {
  const context = loadGasFiles(['gas/SOP_Configs.gs', 'gas/LIMS_ReportGenerator.gs']);
  const logs: string[] = [];

  context['Logger'] = { log: (message: unknown) => logs.push(String(message)) };
  context['Utilities'] = {
    getUuid: () => 'server-request-unused',
  };
  context['ContentService'] = {
    MimeType: { JSON: 'application/json' },
    createTextOutput: (text: string) => ({
      text,
      setMimeType() { return this; },
    }),
  };
  context['authenticateAndAuthorizeMutation'] = () => ({
    uid: 'uid-trace',
    role: 'staff',
    appId: 'lims-cloud-fixed',
    idToken: 'trace-secret-token',
  });
  context['generateReport'] = () => ({
    docId: 'doc-trace-001',
    pdfId: 'pdf-trace-001',
    docsUrl: 'https://docs.google.com/document/d/doc-trace-001/edit',
    pdfUrl: 'https://drive.google.com/file/d/pdf-trace-001/view',
    pdfViewUrl: 'https://drive.google.com/file/d/pdf-trace-001/view',
    fileName: 'KQ_trifluralin-gcms_BATCH-TRACE',
    createdAt: '2026-08-09T00:00:00.000Z',
  });

  const doPost = context['doPost'] as (event: { postData: { contents: string } }) => { text: string };
  const successResponse = doPost({
    postData: {
      contents: JSON.stringify({
        action: 'generate_pdf',
        requestId: 'client-request-1',
        idToken: 'trace-secret-token',
        appId: 'lims-cloud-fixed',
        sopId: 'trifluralin-gcms',
        metadata: { batchCode: 'BATCH-TRACE', ...validSignatureMetadata },
        samples: [{ maSoMau: 'M01', kq: 'ND' }],
      }),
    },
  });
  const successBody = JSON.parse(successResponse.text) as Record<string, unknown>;

  assert.equal(successBody['success'], true);
  assert.equal(successBody['requestId'], 'client-request-1');
  assert.equal(successBody['docId'], 'doc-trace-001');

  const successTrace = logs.map((message) => JSON.parse(message) as Record<string, unknown>);
  assert.deepEqual(
    successTrace.map((entry) => entry['event']),
    ['request.received', 'request.validated', 'request.authorized', 'dispatch.start', 'request.success'],
  );
  successTrace.forEach((entry) => {
    assert.equal(entry['requestId'], 'client-request-1');
    assert.equal(entry['action'], 'generate_pdf');
    assert.equal(entry['sopId'], 'trifluralin-gcms');
    assert.equal(entry['batchId'], 'BATCH-TRACE');
  });
  assert.equal(successTrace.at(-1)?.['reportId'], 'doc-trace-001');
  assert.equal(successTrace.at(-1)?.['pdfId'], 'pdf-trace-001');
  assert.equal(successTrace.at(-1)?.['callerUid'], 'uid-trace');
  assert.equal(successTrace.at(-1)?.['callerRole'], 'staff');
  assert.equal(logs.join('\n').includes('trace-secret-token'), false);

  logs.length = 0;
  context['generateReport'] = () => {
    throw new Error('trace generation failed');
  };
  const errorResponse = doPost({
    postData: {
      contents: JSON.stringify({
        action: 'generate_pdf',
        requestId: 'client-request-9',
        idToken: 'trace-secret-token',
        appId: 'lims-cloud-fixed',
        sopId: 'trifluralin-gcms',
        metadata: { batchCode: 'BATCH-ERR', ...validSignatureMetadata },
        samples: [],
      }),
    },
  });
  const errorBody = JSON.parse(errorResponse.text) as Record<string, unknown>;
  const errorTrace = logs.map((message) => JSON.parse(message) as Record<string, unknown>);

  assert.equal(errorBody['success'], false);
  assert.equal(errorBody['requestId'], 'client-request-9');
  assert.equal(errorBody['error'], 'trace generation failed');
  assert.equal(errorTrace.at(-1)?.['event'], 'request.error');
  assert.equal(errorTrace.at(-1)?.['requestId'], 'client-request-9');
  assert.equal(errorTrace.at(-1)?.['action'], 'generate_pdf');
  assert.equal(errorTrace.at(-1)?.['sopId'], 'trifluralin-gcms');
  assert.equal(errorTrace.at(-1)?.['batchId'], 'BATCH-ERR');
  assert.equal(errorTrace.at(-1)?.['error'], 'trace generation failed');
  assert.equal(logs.join('\n').includes('trace-secret-token'), false);
});

test('doPost rejects missing auth for every mutation action before any mutation handler runs', () => {
  const context = loadGasFiles(['gas/SOP_Configs.gs', 'gas/LIMS_ReportGenerator.gs']);
  let mutationCount = 0;
  context['Utilities'] = { getUuid: () => 'server-request-auth-missing' };
  context['ContentService'] = {
    MimeType: { JSON: 'application/json' },
    createTextOutput: (text: string) => ({
      text,
      setMimeType() { return this; },
    }),
  };
  context['generateReport'] = () => { mutationCount++; return {}; };
  context['archiveReportsAction'] = () => { mutationCount++; return {}; };
  context['uploadExcelAction'] = () => { mutationCount++; return {}; };

  const doPost = context['doPost'] as (event: { postData: { contents: string } }) => { text: string };
  const payloads = [
    {
      action: 'generate_pdf', requestId: 'auth-missing-pdf', sopId: 'trifluralin-gcms',
      metadata: { batchCode: 'B1', ...validSignatureMetadata }, samples: [],
    },
    {
      action: 'archive_reports', requestId: 'auth-missing-archive',
      files: [{ docsUrl: 'https://docs.google.com/document/d/doc-auth-missing/edit' }],
    },
    {
      action: 'upload_excel', requestId: 'auth-missing-upload', fileName: 'source.xlsx',
      fileData: 'UEsDBA==', sopId: 'trifluralin-gcms',
    },
  ];

  payloads.forEach(payload => {
    const body = JSON.parse(doPost({ postData: { contents: JSON.stringify(payload) } }).text) as Record<string, unknown>;
    assert.equal(body['success'], false);
    assert.match(String(body['error']), /Invalid idToken/);
  });
  assert.equal(mutationCount, 0);
});

test('server-side Firebase auth rejects invalid token before report mutation', () => {
  const context = loadGasFiles(['gas/SOP_Configs.gs', 'gas/LIMS_ReportGenerator.gs']);
  let fetchCount = 0;
  let mutationCount = 0;
  context['Utilities'] = { getUuid: () => 'server-request-invalid-token' };
  context['ContentService'] = {
    MimeType: { JSON: 'application/json' },
    createTextOutput: (text: string) => ({
      text,
      setMimeType() { return this; },
    }),
  };
  context['UrlFetchApp'] = {
    fetch: (url: string) => {
      fetchCount++;
      assert.match(url, /identitytoolkit\.googleapis\.com\/v1\/accounts:lookup/);
      return {
        getResponseCode: () => 400,
        getContentText: () => JSON.stringify({ error: { message: 'INVALID_ID_TOKEN' } }),
      };
    },
  };
  context['generateReport'] = () => { mutationCount++; return {}; };

  const doPost = context['doPost'] as (event: { postData: { contents: string } }) => { text: string };
  const body = JSON.parse(doPost({
    postData: {
      contents: JSON.stringify({
        action: 'generate_pdf',
        requestId: 'invalid-token-pdf',
        idToken: 'invalid-token',
        appId: 'lims-cloud-fixed',
        sopId: 'trifluralin-gcms',
        metadata: { batchCode: 'B2', ...validSignatureMetadata },
        samples: [],
      }),
    },
  }).text) as Record<string, unknown>;

  assert.equal(body['success'], false);
  assert.match(String(body['error']), /invalid or expired Firebase ID token/);
  assert.equal(fetchCount, 1);
  assert.equal(mutationCount, 0);
});

test('mutation auth rejects inactive and underprivileged profiles but accepts authorized staff', () => {
  const firestoreString = (value: string) => ({ stringValue: value });
  const firestoreArray = (values: string[]) => ({
    arrayValue: { values: values.map(value => ({ stringValue: value })) },
  });
  const response = (status: number, body: unknown) => ({
    getResponseCode: () => status,
    getContentText: () => JSON.stringify(body),
  });

  const runCase = (
    role: string,
    rolePermissions: string[] | null,
    expectedError?: RegExp,
  ) => {
    const context = loadGasFiles(['gas/SOP_Configs.gs', 'gas/LIMS_ReportGenerator.gs']);
    let fetchCount = 0;
    context['UrlFetchApp'] = {
      fetch: (url: string) => {
        fetchCount++;
        if (url.includes('identitytoolkit.googleapis.com')) {
          return response(200, { users: [{ localId: 'uid-authz' }] });
        }
        if (url.includes('/users/uid-authz')) {
          return response(200, {
            fields: {
              role: firestoreString(role),
              roleId: firestoreString('role-test'),
              permissions: firestoreArray([]),
              customPermissions: firestoreArray([]),
            },
          });
        }
        if (url.includes('/roles_config/role-test')) {
          if (rolePermissions === null) return response(404, {});
          return response(200, { fields: { permissions: firestoreArray(rolePermissions) } });
        }
        throw new Error('Unexpected URL: ' + url);
      },
    };

    const authorize = context['authenticateAndAuthorizeMutation'] as (
      payload: Record<string, unknown>,
    ) => Record<string, unknown>;
    const payload = {
      action: 'generate_pdf',
      idToken: 'verified-token',
      appId: 'lims-cloud-fixed',
    };

    if (expectedError) {
      assert.throws(() => authorize(payload), expectedError);
      return fetchCount;
    }
    const auth = authorize(payload);
    assert.equal(auth['uid'], 'uid-authz');
    assert.equal(auth['role'], role);
    assert.equal(auth['appId'], 'lims-cloud-fixed');
    return fetchCount;
  };

  assert.equal(runCase('pending', null, /active manager\/staff account required/), 2);
  assert.equal(runCase('viewer', null, /active manager\/staff account required/), 2);
  assert.equal(runCase('staff', [], /report mutation permission denied/), 3);
  assert.equal(runCase('staff', ['sop_view', 'batch_run']), 3);

  const invalidAppContext = loadGasFiles(['gas/SOP_Configs.gs', 'gas/LIMS_ReportGenerator.gs']);
  let invalidAppFetchCount = 0;
  invalidAppContext['UrlFetchApp'] = { fetch: () => { invalidAppFetchCount++; throw new Error('must not fetch'); } };
  const authorizeInvalidApp = invalidAppContext['authenticateAndAuthorizeMutation'] as (
    payload: Record<string, unknown>,
  ) => unknown;
  assert.throws(
    () => authorizeInvalidApp({ action: 'generate_pdf', idToken: 'token', appId: '../other-app' }),
    /Invalid appId/,
  );
  assert.equal(invalidAppFetchCount, 0);

  assert.throws(
    () => authorizeInvalidApp({ action: 'generate_pdf', idToken: 'token', appId: 'other-valid-app' }),
    /LIMS namespace is not authorized/,
  );
  assert.equal(invalidAppFetchCount, 0);
});

test('authorized doPost succeeds without logging the raw Firebase ID token', () => {
  const context = loadGasFiles(['gas/SOP_Configs.gs', 'gas/LIMS_ReportGenerator.gs']);
  const rawToken = 'verified-secret-token-must-not-be-logged';
  const logs: string[] = [];
  let mutationCount = 0;
  const response = (status: number, body: unknown) => ({
    getResponseCode: () => status,
    getContentText: () => JSON.stringify(body),
  });
  context['Logger'] = { log: (message: unknown) => logs.push(String(message)) };
  context['Utilities'] = { getUuid: () => 'server-request-authorized' };
  context['ContentService'] = {
    MimeType: { JSON: 'application/json' },
    createTextOutput: (text: string) => ({
      text,
      setMimeType() { return this; },
    }),
  };
  context['UrlFetchApp'] = {
    fetch: (url: string, options: { headers?: Record<string, string> }) => {
      if (url.includes('identitytoolkit.googleapis.com')) {
        return response(200, { users: [{ localId: 'uid-authorized' }] });
      }
      assert.equal(options.headers?.['Authorization'], 'Bearer ' + rawToken);
      if (url.includes('/users/uid-authorized')) {
        return response(200, {
          fields: {
            role: { stringValue: 'staff' },
            roleId: { stringValue: 'role-authorized' },
            permissions: { arrayValue: { values: [] } },
            customPermissions: { arrayValue: { values: [] } },
          },
        });
      }
      if (url.includes('/roles_config/role-authorized')) {
        return response(200, {
          fields: {
            permissions: {
              arrayValue: {
                values: [{ stringValue: 'sop_view' }, { stringValue: 'sop_approve' }],
              },
            },
          },
        });
      }
      throw new Error('Unexpected URL: ' + url);
    },
  };
  context['generateReport'] = () => {
    mutationCount++;
    return { docId: 'doc-authorized', pdfId: 'pdf-authorized', fileName: 'authorized.pdf' };
  };

  const doPost = context['doPost'] as (event: { postData: { contents: string } }) => { text: string };
  const body = JSON.parse(doPost({
    postData: {
      contents: JSON.stringify({
        action: 'generate_pdf',
        requestId: 'authorized-request',
        idToken: rawToken,
        appId: 'lims-cloud-fixed',
        sopId: 'trifluralin-gcms',
        metadata: { batchCode: 'B-AUTH', ...validSignatureMetadata },
        samples: [],
      }),
    },
  }).text) as Record<string, unknown>;

  assert.equal(body['success'], true);
  assert.equal(body['docId'], 'doc-authorized');
  assert.equal(mutationCount, 1);
  assert.equal(logs.join('\n').includes(rawToken), false);
  const traceEntries = logs.map(message => JSON.parse(message) as Record<string, unknown>);
  assert.ok(traceEntries.some(entry => entry['event'] === 'request.authorized'));
  assert.equal(traceEntries.at(-1)?.['callerUid'], 'uid-authorized');
});

test('archive ownership guard accepts only Drive files referenced by the same request or history', () => {
  const context = loadGasFiles(['gas/SOP_Configs.gs', 'gas/LIMS_ReportGenerator.gs']);
  const token = 'archive-verified-token';
  const response = (body: unknown) => ({
    getResponseCode: () => 200,
    getContentText: () => JSON.stringify(body),
  });
  context['UrlFetchApp'] = {
    fetch: (url: string, options: { headers?: Record<string, string> }) => {
      assert.equal(options.headers?.['Authorization'], 'Bearer ' + token);
      if (url.includes('/requests/request-archive/history')) {
        return response({
          documents: [{
            fields: {
              docsUrl: { stringValue: 'https://docs.google.com/document/d/allowed-doc/edit' },
            },
          }],
        });
      }
      if (url.includes('/requests/request-archive')) {
        return response({
          fields: {
            analysisResultSummary: {
              mapValue: {
                fields: {
                  pdfUrl: { stringValue: 'https://drive.google.com/file/d/allowed-pdf/view' },
                },
              },
            },
          },
        });
      }
      throw new Error('Unexpected URL: ' + url);
    },
  };

  const assertOwnership = context['assertArchiveFilesBelongToRequest'] as (
    files: { pdfUrl?: string; docsUrl?: string }[],
    requestId: string,
    authContext: Record<string, string>,
  ) => void;
  const authContext = { appId: 'lims-cloud-fixed', idToken: token };

  assert.doesNotThrow(() => assertOwnership([
    { pdfUrl: 'https://drive.google.com/file/d/allowed-pdf/view' },
    { docsUrl: 'https://docs.google.com/document/d/allowed-doc/edit' },
  ], 'request-archive', authContext));
  assert.throws(
    () => assertOwnership([
      { pdfUrl: 'https://drive.google.com/file/d/not-owned-pdf/view' },
    ], 'request-archive', authContext),
    /not referenced by request request-archive/,
  );
});

test('generate_pdf idempotency reuses completed artifacts and clears failed claims for retry', () => {
  const context = loadGasFile('gas/LIMS_ReportGenerator.gs');
  const properties = new Map<string, string>();
  let lockHeld = false;
  let generationCount = 0;

  context['LockService'] = {
    getScriptLock: () => ({
      waitLock: () => { lockHeld = true; },
      releaseLock: () => { lockHeld = false; },
    }),
  };
  context['PropertiesService'] = {
    getScriptProperties: () => ({
      getProperties: () => Object.fromEntries(properties.entries()),
      getProperty: (key: string) => properties.get(key) ?? null,
      setProperty: (key: string, value: string) => {
        assert.equal(lockHeld, true);
        properties.set(key, value);
      },
      deleteProperty: (key: string) => {
        assert.equal(lockHeld, true);
        properties.delete(key);
      },
    }),
  };
  context['Utilities'] = {
    DigestAlgorithm: { SHA_256: 'SHA_256' },
    Charset: { UTF_8: 'UTF_8' },
    computeDigest: (_algorithm: string, input: string) => Array.from(Buffer.from(input, 'utf8')),
    base64EncodeWebSafe: (bytes: number[]) => Buffer.from(bytes).toString('base64url'),
  };

  const executeIdempotently = context['executeGeneratePdfIdempotently'] as (
    requestId: string,
    sopId: string,
    metadata: Record<string, unknown>,
    samples: Record<string, unknown>[],
    version: number,
    generator: () => Record<string, unknown>,
  ) => Record<string, unknown> & { idempotentReplay?: boolean };
  const firstResult = executeIdempotently(
    'pdf-request-1',
    'trifluralin-gcms',
    { batchCode: 'BATCH-IDEM' },
    [{ maSoMau: 'M01', kq: 'ND' }],
    1,
    () => {
      generationCount++;
      return { docId: 'doc-idem-1', pdfId: 'pdf-idem-1', fileName: 'idem.pdf' };
    },
  );
  const replayResult = executeIdempotently(
    'pdf-request-1',
    'trifluralin-gcms',
    { batchCode: 'BATCH-IDEM' },
    [{ maSoMau: 'M01', kq: 'ND' }],
    1,
    () => {
      generationCount++;
      throw new Error('duplicate generator must not run');
    },
  );

  assert.equal(firstResult['docId'], 'doc-idem-1');
  assert.equal(replayResult['docId'], 'doc-idem-1');
  assert.equal(replayResult['pdfId'], 'pdf-idem-1');
  assert.equal(replayResult.idempotentReplay, true);
  assert.equal(generationCount, 1);
  assert.throws(
    () => executeIdempotently(
      'pdf-request-1',
      'trifluralin-gcms',
      { batchCode: 'BATCH-CHANGED' },
      [{ maSoMau: 'M01', kq: '0.1' }],
      1,
      () => ({ docId: 'must-not-run' }),
    ),
    /different generate_pdf payload/,
  );

  assert.throws(
    () => executeIdempotently(
      'pdf-request-failed',
      'trifluralin-gcms',
      { batchCode: 'BATCH-FAIL' },
      [],
      1,
      () => {
        throw new Error('generation failed before completion');
      },
    ),
    /generation failed before completion/,
  );
  assert.equal(properties.has('generate_pdf_idempotency:pdf-request-failed'), false);
  const retryAfterFailure = executeIdempotently(
    'pdf-request-failed',
    'trifluralin-gcms',
    { batchCode: 'BATCH-FAIL' },
    [],
    1,
    () => ({ docId: 'doc-after-retry', pdfId: 'pdf-after-retry' }),
  );
  assert.equal(retryAfterFailure['docId'], 'doc-after-retry');
});

test('upload_excel file guard validates Base64 size, MIME, extension and binary signature', () => {
  const context = loadGasFile('gas/LIMS_ReportGenerator.gs');
  context['Utilities'] = {
    base64Decode: (input: string) => Array.from(Buffer.from(input, 'base64')),
  };

  const prepareUpload = context['prepareUploadExcelFile'] as (
    fileName: string,
    fileData: string,
  ) => { decodedBytes: number[]; mimeType: string; extension: string };
  const validateEncodedLength = context['validateUploadExcelEncodedLength'] as (length: number) => void;
  const validateDecodedLength = context['validateUploadExcelDecodedLength'] as (length: number) => void;
  const maxBytes = vm.runInContext('UPLOAD_EXCEL_MAX_BYTES', context as vm.Context) as number;
  const maxEncodedLength = Math.ceil(maxBytes / 3) * 4;

  const xlsxBytes = Buffer.from([0x50, 0x4B, 0x03, 0x04, 0x01, 0x02, 0x03, 0x04]);
  const xlsxBase64 = xlsxBytes.toString('base64');
  const xlsx = prepareUpload(
    'MassHunter.xlsx',
    `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${xlsxBase64}`,
  );
  assert.equal(xlsx.extension, '.xlsx');
  assert.equal(xlsx.mimeType, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

  const xlsBytes = Buffer.from([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1, 0x01]);
  const xls = prepareUpload(
    'MassHunter.xls',
    `data:application/vnd.ms-excel;base64,${xlsBytes.toString('base64')}`,
  );
  assert.equal(xls.extension, '.xls');
  assert.equal(xls.mimeType, 'application/vnd.ms-excel');

  assert.throws(
    () => prepareUpload(
      'MassHunter.xlsx',
      `data:application/vnd.ms-excel;base64,${xlsxBase64}`,
    ),
    /Invalid Excel MIME type/,
  );
  assert.throws(
    () => prepareUpload('MassHunter.xls', xlsxBase64),
    /signature does not match \.xls/,
  );
  assert.throws(
    () => prepareUpload('MassHunter.xlsx', 'not_base64!'),
    /malformed Base64/,
  );
  assert.throws(() => validateEncodedLength(maxEncodedLength + 1), /maximum decoded size/);
  assert.throws(() => validateDecodedLength(maxBytes + 1), /maximum decoded size/);
});

test('upload_excel idempotency replays the first Drive file and clears failed claims', () => {
  const context = loadGasFiles(['gas/SOP_Configs.gs', 'gas/LIMS_ReportGenerator.gs']);
  const properties = new Map<string, string>();
  let lockHeld = false;
  let createCount = 0;
  let failNextCreate = false;
  let failCompletedIdempotencyOnce = false;
  let rollbackCount = 0;
  let lastBlobMimeType = '';

  context['LockService'] = {
    getScriptLock: () => ({
      waitLock: () => { lockHeld = true; },
      releaseLock: () => { lockHeld = false; },
    }),
  };
  context['PropertiesService'] = {
    getScriptProperties: () => ({
      getProperties: () => Object.fromEntries(properties.entries()),
      getProperty: (key: string) => properties.get(key) ?? null,
      setProperty: (key: string, value: string) => {
        assert.equal(lockHeld, true);
        if (failCompletedIdempotencyOnce && value.includes('"status":"completed"')) {
          failCompletedIdempotencyOnce = false;
          throw new Error('Properties completion failed');
        }
        properties.set(key, value);
      },
      deleteProperty: (key: string) => {
        assert.equal(lockHeld, true);
        properties.delete(key);
      },
    }),
  };
  context['Utilities'] = {
    DigestAlgorithm: { SHA_256: 'SHA_256' },
    Charset: { UTF_8: 'UTF_8' },
    base64Decode: (input: string) => Array.from(Buffer.from(input, 'base64')),
    computeDigest: (_algorithm: string, input: string | number[]) => {
      const buffer = typeof input === 'string'
        ? Buffer.from(input, 'utf8')
        : Buffer.from(input.map(value => value < 0 ? value + 256 : value));
      return Array.from(buffer);
    },
    base64EncodeWebSafe: (bytes: number[]) => Buffer.from(bytes).toString('base64url'),
    newBlob: (_bytes: number[], mimeType: string, name: string) => {
      lastBlobMimeType = mimeType;
      return { mimeType, name };
    },
  };

  const folder = {
    getName: () => 'SOP-folder',
    createFile: (_blob: unknown) => {
      if (failNextCreate) {
        failNextCreate = false;
        throw new Error('Drive create failed');
      }
      createCount++;
      const id = `excel-${createCount}`;
      return {
        getId: () => id,
        getUrl: () => `https://drive.google.com/file/d/${id}/view`,
        getName: () => `stored-${id}.xlsx`,
        setTrashed: () => { rollbackCount++; },
      };
    },
  };
  context['getOrCreateFolder'] = () => folder;

  const uploadExcel = context['uploadExcelAction'] as (payload: Record<string, unknown>) => Record<string, unknown>;
  const xlsxData = Buffer.from([0x50, 0x4B, 0x03, 0x04, 0x01, 0x02, 0x03, 0x04]).toString('base64');
  const basePayload = {
    action: 'upload_excel',
    requestId: 'upload-request-1',
    fileName: 'source.xlsx',
    fileData: xlsxData,
    sopId: 'fipronil-chlorpyrifos',
  };

  const firstResult = uploadExcel(basePayload);
  const replayResult = uploadExcel(basePayload);
  assert.equal(firstResult['fileId'], 'excel-1');
  assert.equal(replayResult['fileId'], 'excel-1');
  assert.equal(replayResult['idempotentReplay'], true);
  assert.equal(createCount, 1);
  assert.equal(lastBlobMimeType, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

  const changedData = Buffer.from([0x50, 0x4B, 0x03, 0x04, 0x09, 0x09, 0x09, 0x09]).toString('base64');
  assert.throws(
    () => uploadExcel({ ...basePayload, fileData: changedData }),
    /different upload_excel payload/,
  );
  assert.equal(createCount, 1);

  failNextCreate = true;
  assert.throws(
    () => uploadExcel({ ...basePayload, requestId: 'upload-request-failed' }),
    /Drive create failed/,
  );
  assert.equal(properties.has('upload_excel_idempotency:upload-request-failed'), false);

  const retryResult = uploadExcel({ ...basePayload, requestId: 'upload-request-failed' });
  assert.equal(retryResult['fileId'], 'excel-2');
  assert.equal(createCount, 2);
  assert.equal(rollbackCount, 0);

  failCompletedIdempotencyOnce = true;
  assert.throws(
    () => uploadExcel({ ...basePayload, requestId: 'upload-request-finalize-failed' }),
    /Properties completion failed/,
  );
  assert.equal(rollbackCount, 1);
  assert.equal(properties.has('upload_excel_idempotency:upload-request-finalize-failed'), false);
  const retryAfterFinalizeFailure = uploadExcel({ ...basePayload, requestId: 'upload-request-finalize-failed' });
  assert.equal(retryAfterFinalizeFailure['fileId'], 'excel-4');
  assert.equal(createCount, 4);
});

test('upload_excel rate guard limits new uploads per fixed window and resets afterward', () => {
  const context = loadGasFile('gas/LIMS_ReportGenerator.gs');
  const properties = new Map<string, string>();
  let lockHeld = false;

  context['LockService'] = {
    getScriptLock: () => ({
      waitLock: () => { lockHeld = true; },
      releaseLock: () => { lockHeld = false; },
    }),
  };
  context['PropertiesService'] = {
    getScriptProperties: () => ({
      getProperty: (key: string) => properties.get(key) ?? null,
      setProperty: (key: string, value: string) => {
        assert.equal(lockHeld, true);
        properties.set(key, value);
      },
    }),
  };

  const consumeQuota = context['consumeUploadExcelQuota'] as (nowMs?: number) => number;
  const maxRequests = vm.runInContext('UPLOAD_EXCEL_RATE_LIMIT_MAX_REQUESTS', context as vm.Context) as number;
  const windowMs = vm.runInContext('UPLOAD_EXCEL_RATE_LIMIT_WINDOW_MS', context as vm.Context) as number;
  const windowStart = 1_000_000;

  for (let index = 0; index < maxRequests; index++) {
    assert.equal(consumeQuota(windowStart + index), index + 1);
  }
  assert.throws(() => consumeQuota(windowStart + maxRequests), /rate limit exceeded/);
  assert.equal(consumeQuota(windowStart + windowMs), 1);
});

test('folder get-or-create operations hold and release the GAS script lock', () => {
  const context = loadGasFiles(['gas/SOP_Configs.gs', 'gas/LIMS_ReportGenerator.gs']);
  interface FakeFolder {
    name: string;
    children: Map<string, FakeFolder>;
    getFoldersByName: (name: string) => { hasNext: () => boolean; next: () => FakeFolder };
    createFolder: (name: string) => FakeFolder;
  }

  let lockHeld = false;
  let lockCount = 0;
  let unlockCount = 0;
  let createCount = 0;
  const makeFolder = (name: string): FakeFolder => {
    const folder: FakeFolder = {
      name,
      children: new Map<string, FakeFolder>(),
      getFoldersByName(childName: string) {
        assert.equal(lockHeld, true);
        const child = folder.children.get(childName);
        return {
          hasNext: () => child !== undefined,
          next: () => {
            if (!child) throw new Error(`Missing child folder: ${childName}`);
            return child;
          },
        };
      },
      createFolder(childName: string) {
        assert.equal(lockHeld, true);
        createCount++;
        const child = makeFolder(childName);
        folder.children.set(childName, child);
        return child;
      },
    };
    return folder;
  };

  const root = makeFolder('root');
  context['LockService'] = {
    getScriptLock: () => ({
      waitLock: (timeoutMs: number) => {
        assert.equal(timeoutMs, 30000);
        assert.equal(lockHeld, false);
        lockHeld = true;
        lockCount++;
      },
      releaseLock: () => {
        assert.equal(lockHeld, true);
        lockHeld = false;
        unlockCount++;
      },
    }),
  };
  context['Utilities'] = { formatDate: () => '08-August' };
  context['DriveApp'] = { getFolderById: () => root };

  const getOrCreateFolder = context['getOrCreateFolder'] as (date: Date, sopId: string) => FakeFolder;
  const getArchiveFolder = context['getArchiveFolder'] as (parentFolder: FakeFolder) => FakeFolder;

  const first = getOrCreateFolder(new Date('2026-08-09T00:00:00Z'), 'trifluralin-gcms');
  const second = getOrCreateFolder(new Date('2026-08-09T00:00:00Z'), 'trifluralin-gcms');
  assert.equal(first, second);
  assert.equal(createCount, 3);
  assert.equal(lockHeld, false);

  const archiveFirst = getArchiveFolder(first);
  const archiveSecond = getArchiveFolder(first);
  assert.equal(archiveFirst, archiveSecond);
  assert.equal(createCount, 4);
  assert.equal(lockHeld, false);
  assert.equal(lockCount, 4);
  assert.equal(unlockCount, 4);
});

test('folder lock is released when Drive folder lookup fails', () => {
  const context = loadGasFiles(['gas/SOP_Configs.gs', 'gas/LIMS_ReportGenerator.gs']);
  let lockHeld = false;
  let unlockCount = 0;
  context['LockService'] = {
    getScriptLock: () => ({
      waitLock: () => {
        lockHeld = true;
      },
      releaseLock: () => {
        lockHeld = false;
        unlockCount++;
      },
    }),
  };
  context['Utilities'] = { formatDate: () => '08-August' };
  context['DriveApp'] = {
    getFolderById: () => {
      assert.equal(lockHeld, true);
      throw new Error('Drive unavailable');
    },
  };

  const getOrCreateFolder = context['getOrCreateFolder'] as (date: Date, sopId: string) => unknown;
  assert.throws(
    () => getOrCreateFolder(new Date('2026-08-09T00:00:00Z'), 'trifluralin-gcms'),
    /Drive unavailable/,
  );
  assert.equal(lockHeld, false);
  assert.equal(unlockCount, 1);
});

test('archive rejects files outside the configured LIMS root before rename or move', () => {
  const context = loadGasFiles(['gas/SOP_Configs.gs', 'gas/LIMS_ReportGenerator.gs']);
  const rootId = vm.runInContext('CONFIG.ROOT_FOLDER_ID', context as vm.Context) as string;

  interface FakeFolder {
    id: string;
    parents: FakeFolder[];
    children: Map<string, FakeFolder>;
    getId: () => string;
    getParents: () => { hasNext: () => boolean; next: () => FakeFolder };
    getFoldersByName: (name: string) => { hasNext: () => boolean; next: () => FakeFolder };
    createFolder: (name: string) => FakeFolder;
  }

  const iterator = <T>(items: T[]) => {
    let index = 0;
    return {
      hasNext: () => index < items.length,
      next: () => {
        if (index >= items.length) throw new Error('Iterator exhausted');
        return items[index++];
      },
    };
  };

  let archiveFolderCreates = 0;
  const makeFolder = (id: string, parents: FakeFolder[] = []): FakeFolder => {
    const folder: FakeFolder = {
      id,
      parents,
      children: new Map<string, FakeFolder>(),
      getId: () => id,
      getParents: () => iterator(folder.parents),
      getFoldersByName: (name: string) => {
        const child = folder.children.get(name);
        return iterator(child ? [child] : []);
      },
      createFolder: (name: string) => {
        archiveFolderCreates++;
        const child = makeFolder(`${id}/${name}`, [folder]);
        folder.children.set(name, child);
        return child;
      },
    };
    return folder;
  };

  const root = makeFolder(rootId);
  const year = makeFolder('year', [root]);
  const month = makeFolder('month', [year]);
  const sopFolder = makeFolder('sop', [month]);
  const outsideRoot = makeFolder('outside-root');
  const outsideFolder = makeFolder('outside-folder', [outsideRoot]);

  let insideName = 'inside.pdf';
  let insideMovedTo: FakeFolder | null = null;
  let outsideName = 'outside.pdf';
  let outsideMovedTo: FakeFolder | null = null;
  const files = {
    inside: {
      getId: () => 'inside',
      getParents: () => iterator([sopFolder]),
      getName: () => insideName,
      setName: (name: string) => { insideName = name; },
      moveTo: (folder: FakeFolder) => { insideMovedTo = folder; },
    },
    outside: {
      getId: () => 'outside',
      getParents: () => iterator([outsideFolder]),
      getName: () => outsideName,
      setName: (name: string) => { outsideName = name; },
      moveTo: (folder: FakeFolder) => { outsideMovedTo = folder; },
    },
  };

  context['DriveApp'] = {
    getFileById: (id: keyof typeof files) => files[id],
  };
  context['LockService'] = {
    getScriptLock: () => ({ waitLock() {}, releaseLock() {} }),
  };

  const archiveSingleFile = context['archiveSingleFile'] as (fileId: 'inside' | 'outside') => void;

  assert.doesNotThrow(() => archiveSingleFile('inside'));
  assert.equal(insideName, '[HUY]_inside.pdf');
  assert.ok(insideMovedTo);
  assert.equal((insideMovedTo as FakeFolder).getId(), 'sop/Bản_Hủy_Archived');
  assert.equal(archiveFolderCreates, 1);

  assert.throws(
    () => archiveSingleFile('outside'),
    /Refusing to archive file outside LIMS root: outside/,
  );
  assert.equal(outsideName, 'outside.pdf');
  assert.equal(outsideMovedTo, null);
  assert.equal(archiveFolderCreates, 1);
});

test('report generation rollback trashes created artifacts and preserves the original failure', () => {
  const context = loadGasFile('gas/LIMS_ReportGenerator.gs');
  const withRollback = context['withGeneratedArtifactRollback'] as <T>(callback: () => T) => T;
  const registerArtifact = context['registerGeneratedArtifact'] as (
    file: { setTrashed: (trashed: boolean) => unknown },
    kind: string,
  ) => unknown;
  const cleanupOrder: string[] = [];

  const docFile = {
    setTrashed: (trashed: boolean) => cleanupOrder.push(`doc:${trashed}`),
  };
  const pdfFile = {
    setTrashed: (trashed: boolean) => cleanupOrder.push(`pdf:${trashed}`),
  };

  assert.throws(
    () => withRollback(() => {
      registerArtifact(docFile, 'doc');
      registerArtifact(pdfFile, 'pdf');
      throw new Error('render failed');
    }),
    /render failed/,
  );
  assert.deepEqual(cleanupOrder, ['pdf:true', 'doc:true']);

  cleanupOrder.length = 0;
  assert.equal(withRollback(() => {
    registerArtifact(docFile, 'doc');
    return 'ok';
  }), 'ok');
  assert.deepEqual(cleanupOrder, []);
});

test('shared report lifecycle renders and validates before save and PDF export', () => {
  const context = loadGasFile('gas/LIMS_ReportGenerator.gs');
  const generateFromTemplate = context['generateReportFromTemplate'] as (
    templateId: string,
    folder: Record<string, unknown>,
    fileName: string,
    renderDocument: (input: { body: unknown; docId: string }) => void,
    options?: Record<string, unknown>,
  ) => Record<string, unknown>;
  const order: string[] = [];
  const body = { marker: 'body' };
  const docFile = {
    getId: () => 'doc-lifecycle-001',
    setTrashed: () => undefined,
  };
  const pdfFile = {
    setName: (name: string) => {
      order.push(`pdf:name:${name}`);
      return pdfFile;
    },
    getId: () => 'pdf-lifecycle-001',
    getUrl: () => 'https://drive.google.com/file/d/pdf-lifecycle-001/view',
    getDownloadUrl: () => 'https://drive.google.com/uc?id=pdf-lifecycle-001',
    setTrashed: () => undefined,
  };
  const templateFile = {
    makeCopy: (name: string) => {
      order.push(`doc:create:${name}`);
      return docFile;
    },
  };
  const exportedDocFile = {
    getAs: (mimeType: string) => {
      order.push(`doc:export:${mimeType}`);
      return { mimeType };
    },
  };
  const folder = {
    createFile: () => {
      order.push('pdf:create');
      return pdfFile;
    },
  };
  const doc = {
    getBody: () => body,
    saveAndClose: () => order.push('doc:save'),
  };

  context['DriveApp'] = {
    getFileById: (id: string) => id === 'template-lifecycle-001' ? templateFile : exportedDocFile,
  };
  context['DocumentApp'] = {
    openById: (id: string) => {
      order.push(`doc:open:${id}`);
      return doc;
    },
  };
  const createdAt = vm.runInContext(
    "new Date('2026-08-09T10:00:00.000Z')",
    context as vm.Context,
  );

  const result = generateFromTemplate(
    'template-lifecycle-001',
    folder,
    'Lifecycle report',
    ({ body: renderedBody, docId }) => {
      assert.equal(renderedBody, body);
      assert.equal(docId, 'doc-lifecycle-001');
      order.push('render:validate');
    },
    {
      createdAt,
      onDocCreated: () => order.push('hook:doc-created'),
      onPdfCreated: () => order.push('hook:pdf-created'),
    },
  );

  assert.deepEqual(order, [
    'doc:create:Lifecycle report',
    'hook:doc-created',
    'doc:open:doc-lifecycle-001',
    'render:validate',
    'doc:save',
    'doc:export:application/pdf',
    'pdf:create',
    'pdf:name:Lifecycle report.pdf',
    'hook:pdf-created',
  ]);
  assert.deepEqual({ ...result }, {
    docId: 'doc-lifecycle-001',
    pdfId: 'pdf-lifecycle-001',
    docsUrl: 'https://docs.google.com/document/d/doc-lifecycle-001/edit',
    pdfUrl: 'https://drive.google.com/file/d/pdf-lifecycle-001/view',
    pdfViewUrl: 'https://drive.google.com/uc?id=pdf-lifecycle-001',
    fileName: 'Lifecycle report',
    createdAt: '2026-08-09T10:00:00.000Z',
  });
});

test('shared report lifecycle rolls back the copied Doc when render validation fails', () => {
  const context = loadGasFile('gas/LIMS_ReportGenerator.gs');
  const withRollback = context['withGeneratedArtifactRollback'] as <T>(callback: () => T) => T;
  const generateFromTemplate = context['generateReportFromTemplate'] as (
    templateId: string,
    folder: Record<string, unknown>,
    fileName: string,
    renderDocument: () => void,
  ) => unknown;
  let saved = false;
  let exported = false;
  let pdfCreated = false;
  let docTrashed = false;
  const docFile = {
    getId: () => 'doc-render-failure',
    setTrashed: (value: boolean) => {
      docTrashed = value;
    },
  };
  const templateFile = { makeCopy: () => docFile };
  const exportedDocFile = {
    getAs: () => {
      exported = true;
      return {};
    },
  };
  const folder = {
    createFile: () => {
      pdfCreated = true;
      return {};
    },
  };

  context['DriveApp'] = {
    getFileById: (id: string) => id === 'template-render-failure' ? templateFile : exportedDocFile,
  };
  context['DocumentApp'] = {
    openById: () => ({
      getBody: () => ({}),
      saveAndClose: () => {
        saved = true;
      },
    }),
  };

  assert.throws(
    () => withRollback(() => generateFromTemplate(
      'template-render-failure',
      folder,
      'Render failure report',
      () => {
        throw new Error('post-generation validation failed');
      },
    )),
    /post-generation validation failed/,
  );
  assert.equal(saved, false);
  assert.equal(exported, false);
  assert.equal(pdfCreated, false);
  assert.equal(docTrashed, true);
});

test('PDF artifact is registered before naming so setName failures are rolled back', () => {
  const context = loadGasFile('gas/LIMS_ReportGenerator.gs');
  const withRollback = context['withGeneratedArtifactRollback'] as <T>(callback: () => T) => T;
  const createPdf = context['createGeneratedPdfFile'] as (
    folder: { createFile: (blob: unknown) => unknown },
    blob: unknown,
    name: string,
  ) => unknown;
  let trashed = false;
  const pdfFile = {
    setName: () => {
      throw new Error('rename failed');
    },
    setTrashed: (value: boolean) => {
      trashed = value;
    },
  };
  const folder = { createFile: () => pdfFile };

  assert.throws(
    () => withRollback(() => createPdf(folder, {}, 'report.pdf')),
    /rename failed/,
  );
  assert.equal(trashed, true);
});

test('rollback cleanup failures do not replace the original generation error', () => {
  const context = loadGasFile('gas/LIMS_ReportGenerator.gs');
  const withRollback = context['withGeneratedArtifactRollback'] as <T>(callback: () => T) => T;
  const registerArtifact = context['registerGeneratedArtifact'] as (
    file: { setTrashed: (trashed: boolean) => unknown },
    kind: string,
  ) => unknown;

  assert.throws(
    () => withRollback(() => {
      registerArtifact({
        setTrashed: () => {
          throw new Error('cleanup failed');
        },
      }, 'doc');
      throw new Error('generation failed');
    }),
    /generation failed/,
  );
});

test('required Type3B mutation errors propagate into report artifact rollback', () => {
  const context = loadGasFiles(['gas/LIMS_ReportGenerator.gs', 'gas/Report_Type3B.gs']);
  const withRollback = context['withGeneratedArtifactRollback'] as <T>(callback: () => T) => T;
  const registerArtifact = context['registerGeneratedArtifact'] as (
    file: { setTrashed: (trashed: boolean) => unknown },
    kind: string,
  ) => unknown;
  const fillFormDonTables = context['_fillFormDonTablesDynamically'] as (
    pageElements: unknown[],
    metadata: Record<string, unknown>,
    samples: Record<string, unknown>[],
    compoundName: string,
    sopConfig: Record<string, unknown>,
  ) => void;
  const logs: string[] = [];
  let trashed = false;

  context['Logger'] = { log: (message: unknown) => logs.push(String(message)) };
  context['DocumentApp'] = { ElementType: { TABLE: 'TABLE' } };
  context['setCellText'] = () => {
    throw new Error('required mutation failed');
  };

  const headers = ['Diem chuan', 'Vial No', 'Nong do (ng/ml)'];
  const headerRow = {
    getText: () => headers.join(' '),
    getNumCells: () => headers.length,
    getCell: (index: number) => ({ getText: () => headers[index] }),
  };
  const dataRow = { getNumCells: () => headers.length };
  const table = {
    getNumRows: () => 3,
    getRow: (index: number) => index === 0 ? headerRow : dataRow,
  };
  const pageElement = {
    getType: () => 'TABLE',
    asTable: () => table,
  };

  assert.throws(
    () => withRollback(() => {
      registerArtifact({ setTrashed: (value: boolean) => { trashed = value; } }, 'doc');
      fillFormDonTables(
        [pageElement],
        { calibPoints: [{ loSo: 'C1', vialNo: 'V1', hamLuong: 1 }] },
        [],
        'Fipronil',
        { defaultFontSize: 9 },
      );
    }),
    /required mutation failed/,
  );
  assert.equal(trashed, true);
  assert.equal(logs.some((message) => message.includes('[FormDon-Type3B][required-calibration]')), true);
});

test('optional Type3B cleanup errors are logged without aborting generation', () => {
  const context = loadGasFile('gas/Report_Type3B.gs');
  const cleanLastPageBreak = context['cleanLastPageBreak'] as (body: Record<string, unknown>) => void;
  const logs: string[] = [];
  const pageBreak = { getType: () => 'PAGE_BREAK' };

  context['Logger'] = { log: (message: unknown) => logs.push(String(message)) };
  context['DocumentApp'] = { ElementType: { PAGE_BREAK: 'PAGE_BREAK' } };

  assert.doesNotThrow(() => cleanLastPageBreak({
    getNumChildren: () => 1,
    getChild: () => pageBreak,
    removeChild: () => {
      throw new Error('optional cleanup failed');
    },
  }));
  assert.equal(logs.some((message) => message.includes('[Autocut 3B][optional-cleanup]')), true);
});

test('TBVTV trong nuoc config keeps one display compound per canonical result column', () => {
  const context = loadGasFile('gas/SOP_Configs.gs');
  const sopConfig = vm.runInContext(
    "CONFIG.SOP_CONFIG['tbvtv-trong-nuoc-gcmsms']",
    context as vm.Context,
  ) as {
    compounds: string[];
    resultColumns: { key: string }[];
  };
  const compoundToCanonical = vm.runInContext(
    'COMPOUND_TO_CANONICAL',
    context as vm.Context,
  ) as Record<string, string>;

  const compounds = [...sopConfig.compounds];
  const canonicalCompounds = compounds.map((compound) => compoundToCanonical[compound] ?? compound);
  const resultColumnKeys = [...sopConfig.resultColumns].map(({ key }) => key);
  const frontendCompounds = [...(ANGULAR_SOP_CONFIG['tbvtv-trong-nuoc-gcmsms'].compounds ?? [])];

  assert.equal(compounds.length, 121);
  assert.equal(compounds.length, resultColumnKeys.length);
  assert.equal(new Set(canonicalCompounds).size, canonicalCompounds.length);
  assert.deepEqual(canonicalCompounds, resultColumnKeys);
  assert.deepEqual(canonicalCompounds, frontendCompounds);
});

test('GAS Type3B analyte lists stay aligned with Angular SOP configuration', () => {
  const context = loadGasFile('gas/SOP_Configs.gs');
  const gasConfigs = vm.runInContext(
    'CONFIG.SOP_CONFIG',
    context as vm.Context,
  ) as Record<string, { compounds: string[]; resultColumns: { key: string }[] }>;
  const compoundToCanonical = vm.runInContext(
    'COMPOUND_TO_CANONICAL',
    context as vm.Context,
  ) as Record<string, string>;
  const type3bSopIds = [
    'chlor-huu-co',
    'lan-huu-co',
    'nhom-cuc',
    'nhom-i',
    'tbvtv-thuc-pham-gcmsms',
    'tbvtv-trong-nuoc-gcmsms',
  ];

  for (const sopId of type3bSopIds) {
    const gasConfig = gasConfigs[sopId];
    const angularCompounds = [...(ANGULAR_SOP_CONFIG[sopId].compounds ?? [])];
    const gasCompounds = Array.from(gasConfig.compounds, (compound) =>
      compoundToCanonical[compound] ?? compound,
    );
    const gasResultColumns = Array.from(gasConfig.resultColumns, ({ key }) => key);

    assert.deepEqual(
      gasCompounds,
      gasResultColumns,
      `${sopId}: GAS compounds must match GAS resultColumns`,
    );
    assert.deepEqual(
      [...gasCompounds].sort(),
      [...angularCompounds].sort(),
      `${sopId}: GAS and Angular Type3B analyte sets must match`,
    );
  }

  assert.equal(ANGULAR_SOP_CONFIG['nhom-i'].compounds?.length, 51);
  assert.equal(ANGULAR_SOP_CONFIG['nhom-i'].compounds?.includes('silafluofen'), true);
});

test('Type3B missing QC data renders as N/A instead of Dat', () => {
  const context = loadGasFile('gas/Report_Type3B.gs');
  const buildLabels = context['buildQcCheckboxLabels'] as (value: unknown) => {
    datCheck: string;
    khongDatCheck: string;
    naCheck: string;
  };

  assert.deepEqual(
    { ...buildLabels(undefined) },
    { datCheck: '☐ Đạt', khongDatCheck: '☐ Không đạt', naCheck: '☑ N/A' },
  );
  assert.deepEqual(
    { ...buildLabels(true) },
    { datCheck: '☑ Đạt', khongDatCheck: '☐ Không đạt', naCheck: '☐ N/A' },
  );
  assert.deepEqual(
    { ...buildLabels(false) },
    { datCheck: '☐ Đạt', khongDatCheck: '☑ Không đạt', naCheck: '☐ N/A' },
  );
});

test('sample metadata alone does not auto-detect an analyte result', () => {
  const context = loadGasFile('gas/LIMS_ReportGenerator.gs');
  const hasDetectedSampleResult = context['hasDetectedSampleResult'] as (
    sample: Record<string, unknown>,
    sopConfig: Record<string, unknown>,
    metadata: Record<string, unknown>,
  ) => boolean;

  const sopConfig = { resultColumns: [{ key: 'fipronil' }] };
  const metadata = { targetInfo: { fipronil: { displayName: 'Fipronil' } } };

  assert.equal(
    hasDetectedSampleResult(
      {
        maSoMau: 'M01',
        khoiLuong: '10.0',
        loaiMau: 'Thuỷ sản',
        tinhTrangMau: 'Bình thường',
      },
      sopConfig,
      metadata,
    ),
    false,
  );
  assert.equal(hasDetectedSampleResult({ fipronil: 'ND', fipronil_nd: true }, sopConfig, metadata), false);
  assert.equal(hasDetectedSampleResult({ fipronil: 0, fipronil_nd: false }, sopConfig, metadata), true);
});

test('generic chromatogram helper leaves non-chromatogram tables untouched', () => {
  const context = loadGasFile('gas/Report_Type3B.gs');
  const fillChromatogram = context['_fillGenericChromatogramTable'] as (
    table: Record<string, unknown>,
    sample: Record<string, unknown>,
    sopConfig: Record<string, unknown>,
    isAssigned: () => boolean,
  ) => void;

  let cellReads = 0;
  const makeRow = (text: string) => ({
    getText: () => text,
    getNumCells: () => 3,
    getCell: () => {
      cellReads++;
      return { getText: () => '' };
    },
  });
  const rows = [
    makeRow('Thông tin chung'),
    makeRow('Mã số mẫu'),
    makeRow('Khối lượng mẫu'),
    makeRow('Ghi chú'),
    makeRow('Fipronil'),
  ];
  const table = {
    getNumRows: () => rows.length,
    getRow: (index: number) => rows[index],
  };

  fillChromatogram(table, {}, { compounds: ['Fipronil'] }, () => true);
  assert.equal(cellReads, 0);
});

test('Type2/3A sample pagination fails fast when template capacity is exhausted', () => {
  const context = loadGasFile('gas/Report_Type2_3A.gs');
  const assertSampleTableAvailable = context['assertSampleTableAvailable'] as (
    currentTableIdx: number,
    tablesLength: number,
    tablesPerPage: number,
  ) => void;

  assert.doesNotThrow(() => assertSampleTableAvailable(0, 2, 1));
  assert.doesNotThrow(() => assertSampleTableAvailable(1, 2, 1));
  assert.throws(
    () => assertSampleTableAvailable(2, 2, 1),
    /Số lượng mẫu vượt quá dung lượng tối đa của template/,
  );
});

test('Type2/3A sample pagination asserts every requested sample was rendered', () => {
  const context = loadGasFile('gas/Report_Type2_3A.gs');
  const assertAllSamplesRendered = context['assertAllSamplesRendered'] as (
    sampleIdx: number,
    totalSamples: number,
  ) => void;

  assert.doesNotThrow(() => assertAllSamplesRendered(0, 0));
  assert.doesNotThrow(() => assertAllSamplesRendered(4, 4));
  assert.throws(
    () => assertAllSamplesRendered(3, 4),
    /Report chưa render đủ mẫu: 3\/4/,
  );
});

test('Type2/3A pagination plan covers exact-capacity and multi-page cloning', () => {
  const context = loadGasFile('gas/Report_Type2_3A.gs');
  const buildPlan = context['buildSamplePaginationPlan'] as (
    totalSamples: number,
    usableSlotsPerPage: number,
    existingSampleTablesCount: number,
  ) => { totalPagesNeeded: number; pagesToClone: number };

  assert.deepEqual(
    { ...buildPlan(10, 5, 2) },
    { totalPagesNeeded: 2, pagesToClone: 0 },
  );
  assert.deepEqual(
    { ...buildPlan(11, 5, 1) },
    { totalPagesNeeded: 3, pagesToClone: 2 },
  );
  assert.deepEqual(
    { ...buildPlan(100, 12, 2) },
    { totalPagesNeeded: 9, pagesToClone: 7 },
  );
  assert.deepEqual(
    { ...buildPlan(0, 5, 1) },
    { totalPagesNeeded: 0, pagesToClone: 0 },
  );
  assert.throws(() => buildPlan(1, 0, 1), /Invalid usableSlotsPerPage/);
  assert.throws(() => buildPlan(1, 1, 0), /Invalid existingSampleTablesCount/);
});

test('Type2/3A actual renderer clones pages and writes every sample exactly once', () => {
  const context = loadGasFile('gas/Report_Type2_3A.gs');
  const harness = createType2RenderHarness();
  context['DocumentApp'] = harness.documentApp;
  context['fillTextFields'] = () => undefined;
  context['setCellText'] = (row: any, colIndex: number, value: unknown) => {
    row.getCell(colIndex).setText(value);
    return 1;
  };

  const generate = context['generateType2_3aReport'] as (
    body: Record<string, unknown>,
    sopConfig: Record<string, unknown>,
    metadata: Record<string, unknown>,
    samples: Record<string, unknown>[],
  ) => Record<string, unknown>;
  const samples = Array.from({ length: 11 }, (_, index) => ({
    maSoMau: `S${String(index + 1).padStart(2, '0')}`,
  }));
  const sopConfig = {
    folderName: 'Trifluralin VM render test',
    sampleTableIndex: 0,
    headerRows: 1,
    tablesPerPage: 1,
    columns: { maSoMau: 0 },
    defaultFontSize: 11,
  };

  const result = generate(harness.body, sopConfig, {}, samples);
  const expectedIds = samples.map((sample) => sample.maSoMau);

  assert.deepEqual({ ...result }, {
    reporter: 'type2_3a',
    mode: 'samplePages',
    renderedSampleCount: 11,
    logicalPageCount: 3,
    samplesPerLogicalPage: 5,
  });
  assert.deepEqual(harness.getRenderedSampleIds(), expectedIds);
  assert.equal(new Set(harness.getRenderedSampleIds()).size, samples.length);
  assert.deepEqual(harness.getPageLabels(), ['Trang: 1/3', 'Trang: 2/3', 'Trang: 3/3']);
});

test('Type2/3A actual renderer fails when required cloned sample tables are unavailable', () => {
  const context = loadGasFile('gas/Report_Type2_3A.gs');
  const harness = createType2RenderHarness({ maxAppendedTables: 0 });
  context['DocumentApp'] = harness.documentApp;
  context['fillTextFields'] = () => undefined;
  context['setCellText'] = (row: any, colIndex: number, value: unknown) => {
    row.getCell(colIndex).setText(value);
    return 1;
  };

  const generate = context['generateType2_3aReport'] as (
    body: Record<string, unknown>,
    sopConfig: Record<string, unknown>,
    metadata: Record<string, unknown>,
    samples: Record<string, unknown>[],
  ) => Record<string, unknown>;
  const samples = Array.from({ length: 6 }, (_, index) => ({ maSoMau: `F${index + 1}` }));

  assert.throws(
    () => generate(harness.body, {
      folderName: 'Trifluralin VM render test',
      sampleTableIndex: 0,
      headerRows: 1,
      tablesPerPage: 1,
      columns: { maSoMau: 0 },
      defaultFontSize: 11,
    }, {}, samples),
    /Số lượng mẫu vượt quá dung lượng tối đa của template/,
  );
});

test('post-generation validation accepts a complete Type2/3A render contract', () => {
  const context = loadGasFile('gas/LIMS_ReportGenerator.gs');
  const validate = context['assertPostGenerationReportComplete'] as (
    body: Record<string, unknown>,
    sopConfig: Record<string, unknown>,
    metadata: Record<string, unknown>,
    samples: Record<string, unknown>[],
    renderStats: Record<string, unknown>,
  ) => void;
  const body = { getText: () => '' };

  assert.doesNotThrow(() => validate(body, {}, {}, [{}, {}, {}, {}, {}], {
    reporter: 'type2_3a',
    mode: 'samplePages',
    renderedSampleCount: 5,
    logicalPageCount: 2,
    samplesPerLogicalPage: 3,
  }));
  assert.doesNotThrow(() => validate(body, {}, {}, [], {
    reporter: 'type2_3a',
    mode: 'samplePages',
    renderedSampleCount: 0,
    logicalPageCount: 0,
    samplesPerLogicalPage: 3,
  }));
});

test('post-generation validation rejects Type2/3A sample and page-count mismatches', () => {
  const context = loadGasFile('gas/LIMS_ReportGenerator.gs');
  const validate = context['assertPostGenerationReportComplete'] as (
    body: Record<string, unknown>,
    sopConfig: Record<string, unknown>,
    metadata: Record<string, unknown>,
    samples: Record<string, unknown>[],
    renderStats: Record<string, unknown>,
  ) => void;
  const body = { getText: () => '' };
  const samples = [{}, {}, {}, {}, {}];

  assert.throws(() => validate(body, {}, {}, samples, {
    reporter: 'type2_3a',
    mode: 'samplePages',
    renderedSampleCount: 4,
    logicalPageCount: 2,
    samplesPerLogicalPage: 3,
  }), /rendered samples 4\/5/);
  assert.throws(() => validate(body, {}, {}, samples, {
    reporter: 'type2_3a',
    mode: 'samplePages',
    renderedSampleCount: 5,
    logicalPageCount: 1,
    samplesPerLogicalPage: 3,
  }), /sample pages 1\/2/);
  assert.throws(() => validate(body, {}, {}, samples, {
    reporter: 'type2_3a',
    mode: 'samplePages',
    renderedSampleCount: 5,
    logicalPageCount: 2,
    samplesPerLogicalPage: 0,
  }), /invalid samplesPerLogicalPage 0/);
});

test('post-generation validation rejects Form Check page-count mismatch', () => {
  const context = loadGasFile('gas/LIMS_ReportGenerator.gs');
  const validate = context['assertPostGenerationReportComplete'] as (
    body: Record<string, unknown>,
    sopConfig: Record<string, unknown>,
    metadata: Record<string, unknown>,
    samples: Record<string, unknown>[],
    renderStats: Record<string, unknown>,
  ) => void;

  assert.throws(() => validate({ getText: () => '' }, {}, {}, [{}, {}], {
    reporter: 'type3b',
    mode: 'formCheck',
    renderedSampleCount: 2,
    logicalPageCount: 1,
    renderedCompoundIds: [],
    formDonResults: [],
  }), /Form Check pages 1\/2/);
});

test('post-generation validation rejects missing, extra, and reordered Form Don compounds', () => {
  const context = loadGasFiles(['gas/LIMS_ReportGenerator.gs', 'gas/Report_Type3B.gs']);
  const validate = context['assertPostGenerationReportComplete'] as (
    body: Record<string, unknown>,
    sopConfig: Record<string, unknown>,
    metadata: Record<string, unknown>,
    samples: Record<string, unknown>[],
    renderStats: Record<string, unknown>,
  ) => void;
  const body = { getText: () => '' };
  const samples = [{}, {}];
  const metadata = { compoundsToPrint: ['compound-a', 'compound-b'] };
  const validResults = [
    { compoundId: 'compound-a', resultTableCount: 1, resultRowsWritten: 2 },
    { compoundId: 'compound-b', resultTableCount: 1, resultRowsWritten: 2 },
  ];

  assert.throws(() => validate(body, {}, metadata, samples, {
    reporter: 'type3b', mode: 'formDon', renderedSampleCount: 2, logicalPageCount: 2,
    renderedCompoundIds: ['compound-a'], formDonResults: validResults,
  }), /rendered compounds 1\/2/);
  assert.throws(() => validate(body, {}, metadata, samples, {
    reporter: 'type3b', mode: 'formDon', renderedSampleCount: 2, logicalPageCount: 2,
    renderedCompoundIds: ['compound-a', 'compound-b', 'compound-c'], formDonResults: validResults,
  }), /rendered compounds 3\/2/);
  assert.throws(() => validate(body, {}, metadata, samples, {
    reporter: 'type3b', mode: 'formDon', renderedSampleCount: 2, logicalPageCount: 2,
    renderedCompoundIds: ['compound-b', 'compound-a'], formDonResults: validResults,
  }), /compound 1 expected "compound-a" but rendered "compound-b"/);
});

test('post-generation validation rejects Form Don result-table and row-count mismatches', () => {
  const context = loadGasFiles(['gas/LIMS_ReportGenerator.gs', 'gas/Report_Type3B.gs']);
  const validate = context['assertPostGenerationReportComplete'] as (
    body: Record<string, unknown>,
    sopConfig: Record<string, unknown>,
    metadata: Record<string, unknown>,
    samples: Record<string, unknown>[],
    renderStats: Record<string, unknown>,
  ) => void;
  const body = { getText: () => '' };
  const samples = [{}, {}];
  const metadata = { compoundsToPrint: ['compound-a', 'compound-b'] };
  const baseStats = {
    reporter: 'type3b',
    mode: 'formDon',
    renderedSampleCount: 2,
    logicalPageCount: 2,
    renderedCompoundIds: ['compound-a', 'compound-b'],
  };

  assert.throws(() => validate(body, {}, metadata, samples, {
    ...baseStats,
    formDonResults: [
      { compoundId: 'compound-a', resultTableCount: 2, resultRowsWritten: 2 },
      { compoundId: 'compound-b', resultTableCount: 1, resultRowsWritten: 2 },
    ],
  }), /compound "compound-a" has 2 result tables; expected 1/);
  assert.throws(() => validate(body, {}, metadata, samples, {
    ...baseStats,
    formDonResults: [
      { compoundId: 'compound-a', resultTableCount: 1, resultRowsWritten: 2 },
      { compoundId: 'compound-b', resultTableCount: 1, resultRowsWritten: 1 },
    ],
  }), /compound "compound-b" rendered result rows 1\/2/);
});

test('post-generation placeholder validation checks only the configured allowlist', () => {
  const context = loadGasFile('gas/LIMS_ReportGenerator.gs');
  const validate = context['assertPostGenerationReportComplete'] as (
    body: Record<string, unknown>,
    sopConfig: Record<string, unknown>,
    metadata: Record<string, unknown>,
    samples: Record<string, unknown>[],
    renderStats: Record<string, unknown>,
  ) => void;
  const stats = {
    reporter: 'type2_3a',
    mode: 'samplePages',
    renderedSampleCount: 1,
    logicalPageCount: 1,
    samplesPerLogicalPage: 1,
  };

  assert.throws(() => validate(
    { getText: () => 'still here: {{required}} and {{optional}}' },
    { requiredPlaceholders: ['{{required}}'] },
    {},
    [{}],
    stats,
  ), /unresolved required placeholders: \{\{required\}\}/);
  assert.doesNotThrow(() => validate(
    { getText: () => 'allowed to remain: {{optional}}' },
    { requiredPlaceholders: ['{{required}}'] },
    {},
    [{}],
    stats,
  ));
  assert.throws(() => validate(
    { getText: () => 'date1' },
    { signaturePlaceholders: { date1: 'ngayNguoiPhanTich' } },
    {},
    [{}],
    stats,
  ), /unresolved required placeholders: date1/);
});

test('custom Type2 reporters validate inside the shared lifecycle before saving or exporting', () => {
  const directReporterFiles = [
    'gas/Report_Trifluralin.gs',
    'gas/Report_FipronilChlorpyrifos.gs',
  ];

  for (const relativePath of directReporterFiles) {
    const source = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
    const lifecycleIndex = source.indexOf('generateReportFromTemplate(');
    const fillIndex = source.indexOf('const renderStats = fillSampleTable(body, sopConfig, samples);');
    const validateIndex = source.indexOf('assertPostGenerationReportComplete(body, sopConfig, metadata, samples, renderStats);');
    assert.ok(lifecycleIndex >= 0, `${relativePath} must delegate artifact lifecycle to the shared helper`);
    assert.ok(fillIndex >= 0, `${relativePath} must capture render stats`);
    assert.ok(validateIndex > fillIndex, `${relativePath} must validate after rendering`);
  }

  const sharedSource = fs.readFileSync(path.join(repoRoot, 'gas/Report_Type2_3A.gs'), 'utf8');
  const sharedGeneratorIndex = sharedSource.indexOf('function generateCustomSingleAnalyteType2Report(');
  const sharedLifecycleIndex = sharedSource.indexOf('generateReportFromTemplate(', sharedGeneratorIndex);
  const sharedFillIndex = sharedSource.indexOf('const renderStats = fillSampleTable(body, sopConfig, samples);', sharedGeneratorIndex);
  const sharedValidateIndex = sharedSource.indexOf('assertPostGenerationReportComplete(body, sopConfig, metadata, samples, renderStats);', sharedGeneratorIndex);
  assert.ok(sharedGeneratorIndex >= 0, 'shared custom Type2 generator must exist');
  assert.ok(sharedLifecycleIndex > sharedGeneratorIndex, 'shared custom Type2 generator must delegate artifact lifecycle');
  assert.ok(sharedFillIndex > sharedGeneratorIndex, 'shared custom Type2 generator must capture render stats');
  assert.ok(sharedValidateIndex > sharedFillIndex, 'shared custom Type2 generator must validate after rendering');

  const lifecycleSource = fs.readFileSync(path.join(repoRoot, 'gas/LIMS_ReportGenerator.gs'), 'utf8');
  const lifecycleFunctionIndex = lifecycleSource.indexOf('function generateReportFromTemplate(');
  const renderIndex = lifecycleSource.indexOf('renderDocument({ doc, body, docId, file: newFile });', lifecycleFunctionIndex);
  const saveIndex = lifecycleSource.indexOf('doc.saveAndClose();', lifecycleFunctionIndex);
  const exportIndex = lifecycleSource.indexOf("getAs('application/pdf')", lifecycleFunctionIndex);
  assert.ok(lifecycleFunctionIndex >= 0, 'shared report lifecycle helper must exist');
  assert.ok(renderIndex > lifecycleFunctionIndex, 'shared report lifecycle must invoke the reporter callback');
  assert.ok(saveIndex > renderIndex, 'shared report lifecycle must save only after reporter rendering/validation succeeds');
  assert.ok(exportIndex > saveIndex, 'shared report lifecycle must export PDF only after save succeeds');

  for (const relativePath of ['gas/Report_Dichlorvos.gs', 'gas/Report_Chloroform.gs']) {
    const source = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
    assert.match(source, /generateCustomSingleAnalyteType2Report\(/, `${relativePath} must delegate to shared custom Type2 generator`);
  }
});

test('Dichlorvos and Chloroform wrappers delegate with the correct SOP identity', () => {
  const context = loadGasFiles(['gas/Report_Dichlorvos.gs', 'gas/Report_Chloroform.gs']);
  const calls: unknown[][] = [];
  context['generateCustomSingleAnalyteType2Report'] = (...args: unknown[]) => {
    calls.push(args);
    return { delegated: true };
  };

  const dichlorvos = context['generateCustomReport_dichlorvos_gcms'] as (...args: unknown[]) => unknown;
  const chloroform = context['generateCustomReport_chloroform_gcms'] as (...args: unknown[]) => unknown;
  const folder = {};

  assert.deepEqual(dichlorvos('template-d', { r2: 1 }, [{ maSoMau: 'D01' }], folder, 'file-d', 1), { delegated: true });
  assert.deepEqual(chloroform('template-c', { r2: 2 }, [{ maSoMau: 'C01' }], folder, 'file-c', 1), { delegated: true });

  assert.equal(calls.length, 2);
  assert.equal(calls[0][5], 'dichlorvos-gcms');
  assert.equal(calls[0][6], 'DichlorvosCustom');
  assert.equal(calls[1][5], 'chloroform-gcms');
  assert.equal(calls[1][6], 'ChloroformCustom');
});

test('Form Don result resolution preserves zero, ND, N/A, and explicit empty values', () => {
  const type3bContext = loadGasFile('gas/Report_Type3B.gs');
  const resolveResult = type3bContext['resolveFormDonResultValue'] as (
    sample: Record<string, unknown>,
    compoundName: string,
    backendKey: string,
  ) => unknown;

  assert.equal(resolveResult({ Fipronil: 0 }, 'Fipronil', 'Fipronil'), 0);
  assert.equal(resolveResult({ Fipronil: '0' }, 'Fipronil', 'Fipronil'), '0');
  assert.equal(resolveResult({ Fipronil: 0.0 }, 'Fipronil', 'Fipronil'), 0);
  assert.equal(resolveResult({ Fipronil: 'ND' }, 'Fipronil', 'Fipronil'), 'ND');
  assert.equal(resolveResult({ Fipronil: 'N/A' }, 'Fipronil', 'Fipronil'), 'N/A');
  assert.equal(resolveResult({ Fipronil: '' }, 'Fipronil', 'Fipronil'), '');
  assert.equal(resolveResult({}, 'Fipronil', 'Fipronil'), 'ND');
  assert.equal(
    resolveResult({ compoundResults: { Fipronil: 0 }, kq: 'ND' }, 'Fipronil', 'Fipronil'),
    0,
  );
});

test('Form Don header contract resolves required columns without hard-coded indexes', () => {
  const type3bContext = loadGasFile('gas/Report_Type3B.gs');
  const resolveCalibrationColumns = type3bContext['resolveFormDonCalibrationHeaderColumns'] as (
    headers: string[],
  ) => Record<string, number>;
  const resolveResultColumns = type3bContext['resolveFormDonResultHeaderColumns'] as (
    headers: string[],
  ) => Record<string, number>;

  assert.deepEqual(
    { ...resolveCalibrationColumns(['Area', 'Nồng độ (ng/ml)', 'Điểm chuẩn', 'Vial No']) },
    { loSoCol: 2, vialCol: 3, kqCol: 1, areaCol: 0 },
  );
  assert.deepEqual(
    { ...resolveResultColumns(['Kết quả (µg/g)', 'Mã số mẫu', 'Vial', 'Khối lượng (g)', 'F']) },
    { maSoMauCol: 1, khoiLuongCol: 3, fCol: 4, loSoCol: 2, kqCol: 0, ghiChuCol: -1 },
  );
});

test('Form Don header contract fails fast on missing or duplicate required headers', () => {
  const type3bContext = loadGasFile('gas/Report_Type3B.gs');
  const resolveCalibrationColumns = type3bContext['resolveFormDonCalibrationHeaderColumns'] as (
    headers: string[],
  ) => Record<string, number>;
  const resolveResultColumns = type3bContext['resolveFormDonResultHeaderColumns'] as (
    headers: string[],
  ) => Record<string, number>;

  assert.throws(
    () => resolveCalibrationColumns(['STT', 'Vial No', 'Nồng độ (ng/ml)']),
    /calibration table: missing required header "Điểm chuẩn"/,
  );
  assert.throws(
    () => resolveCalibrationColumns(['Điểm chuẩn', 'Vial No', 'Vial phụ', 'Nồng độ (ng/ml)']),
    /calibration table: duplicate\/ambiguous header "Vial\/Lọ số"/,
  );
  assert.throws(
    () => resolveResultColumns(['Mã số mẫu', 'Khối lượng (g)', 'F', 'Vial']),
    /result table: missing required header "Kết quả"/,
  );
  assert.throws(
    () => resolveResultColumns(['Mã số mẫu', 'Khối lượng (g)', 'F', 'Vial', 'Kết quả', 'Kết quả (µg\/g)']),
    /result table: duplicate\/ambiguous header "Kết quả"/,
  );
});

test('Type3B custom calibration uses its own strict header contract without positional fallback', () => {
  const type3bContext = loadGasFile('gas/Report_Type3B.gs');
  const isCustomCalibrationCandidate = type3bContext['isType3bCustomCalibrationHeaderCandidate'] as (
    headers: string[],
  ) => boolean;
  const resolveCustomCalibrationColumns = type3bContext['resolveType3bCustomCalibrationHeaderColumns'] as (
    headers: string[],
  ) => Record<string, number>;

  assert.equal(isCustomCalibrationCandidate(['Nồng độ (ng/ml)', 'Điểm chuẩn', 'Vial No']), true);
  assert.equal(isCustomCalibrationCandidate(['C (ng/ml)', 'Vial No']), true);
  assert.equal(isCustomCalibrationCandidate(['Điểm chuẩn', 'Vial No', 'Area']), false);
  assert.equal(isCustomCalibrationCandidate(['Điểm chuẩn', 'Nồng độ (ng/ml)']), false);
  assert.equal(isCustomCalibrationCandidate(['Mã số mẫu', 'Vial No', 'Kết quả']), false);

  assert.deepEqual(
    { ...resolveCustomCalibrationColumns(['Nồng độ (ng/ml)', 'Điểm chuẩn', 'Vial No']) },
    { vialCol: 2, kqCol: 0 },
  );
  assert.deepEqual(
    { ...resolveCustomCalibrationColumns(['Nồng độ (ng/ml)', 'Vial No']) },
    { vialCol: 1, kqCol: 0 },
  );
  assert.throws(
    () => resolveCustomCalibrationColumns(['Điểm chuẩn', 'Nồng độ (ng/ml)']),
    /custom calibration table: missing required header "Vial\/Lọ số"/,
  );
  assert.throws(
    () => resolveCustomCalibrationColumns(['Vial No', 'Nồng độ (ng/ml)', 'Nồng độ phụ (ng/ml)']),
    /custom calibration table: duplicate\/ambiguous header "Nồng độ"/,
  );

  const type3bSource = fs.readFileSync(path.join(repoRoot, 'gas/Report_Type3B.gs'), 'utf8');
  assert.doesNotMatch(type3bSource, /if\s*\(vialCol\s*===\s*-1\)\s*vialCol\s*=\s*\d+/);
  assert.doesNotMatch(type3bSource, /if\s*\(nongDoCol\s*===\s*-1\)\s*nongDoCol\s*=\s*\d+/);
});

test('Type3B grouped sample assignment only falls back to show-all when no sub-code has assignments', () => {
  const type3bContext = loadGasFile('gas/Report_Type3B.gs');
  const isAssigned = type3bContext['isType3BTargetAssigned'] as (
    sampleTargetMap: Record<string, string[]> | null,
    sampleCode: string,
    compoundDisplayName: string,
  ) => boolean;

  assert.equal(isAssigned({ A: ['fipronil'], B: [] }, 'A; B', 'Fipronil'), true);
  assert.equal(isAssigned({ A: ['fipronil'], B: [] }, 'A; B', 'Chlorpyrifos'), false);
  assert.equal(isAssigned({ B: ['fipronil'] }, 'A; B', 'Chlorpyrifos'), false);
  assert.equal(isAssigned({ A: [], B: [] }, 'A; B', 'Chlorpyrifos'), true);
  assert.equal(isAssigned({}, 'A; B', 'Chlorpyrifos'), true);
  assert.equal(isAssigned(null, 'A; B', 'Chlorpyrifos'), true);
});

test('Form Don renders displayName while retaining canonical id for result lookup', () => {
  const type3bContext = loadGasFile('gas/Report_Type3B.gs');
  const resolveDisplayName = type3bContext['resolveCompoundDisplayName'] as (
    compoundId: string,
    metadata: Record<string, unknown>,
  ) => string;
  const resolveResult = type3bContext['resolveFormDonResultValue'] as (
    sample: Record<string, unknown>,
    compoundName: string,
    backendKey: string,
  ) => unknown;
  const canonicalId = 'bhc_alpha_benzene_hexachloride';
  const metadata = {
    targetInfo: {
      [canonicalId]: { displayName: 'BHC alpha' },
    },
  };

  assert.equal(resolveDisplayName(canonicalId, metadata), 'BHC alpha');
  assert.equal(
    resolveResult({ compoundResults: { [canonicalId]: 0 } }, canonicalId, canonicalId),
    0,
  );
  assert.throws(
    () => resolveDisplayName('unknown_internal_id', {}),
    /Missing displayName for canonical compound: unknown_internal_id/,
  );
});

test('GAS cell text normalization renders numeric zero as 0 instead of blank', () => {
  const context = loadGasFile('gas/LIMS_ReportGenerator.gs');
  const normalizeCellText = context['normalizeCellText'] as (value: unknown) => string;

  assert.equal(normalizeCellText(0), '0');
  assert.equal(normalizeCellText('0'), '0');
  assert.equal(normalizeCellText(0.0), '0');
  assert.equal(normalizeCellText(undefined), '');
  assert.equal(normalizeCellText(null), '');
  assert.equal(normalizeCellText('ND'), 'ND');
  assert.equal(normalizeCellText('N/A'), 'N/A');
  assert.equal(normalizeCellText(''), '');
});
