import {
  COMPOUND_TO_FIRESTORE_ID,
  SOP01_COLUMN_TO_CANONICAL,
  getAssignedTargetsForSample,
  getCanonicalId,
  isCompoundAssigned
} from '../shared/compound-id-resolver';
import {
  ExcelImportCandidate,
  ExcelImportContext,
  ParsedExcelCompound,
  ParsedExcelResultRow,
  ParsedExcelWorkbook
} from './excel-result-import.models';

interface ResultTarget {
  compoundId: string;
  resultKey: string;
  aliases: Set<string>;
}

const SAMPLE_HEADER_NAMES = new Set(['samplename', 'sample']);
const FINAL_CONC_HEADER_NAMES = new Set(['finalconc', 'finalconcentration']);
const TYPE_HEADER_NAMES = new Set(['type', 'sampletype']);

export function parseMassHunterResultWorkbook(XLSX: any, workbook: any): ParsedExcelWorkbook {
  const compounds: ParsedExcelCompound[] = [];
  const warnings: string[] = [];

  for (const sheetName of workbook.SheetNames || []) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet?.['!ref']) continue;

    const range = XLSX.utils.decode_range(sheet['!ref']);
    const header = findHeaderRow(XLSX, sheet, range);
    if (!header) continue;

    const rows: ParsedExcelResultRow[] = [];
    const calibrationPointNames: string[] = [];

    for (let row = header.row + 1; row <= range.e.r; row++) {
      const sampleName = cellDisplayValue(sheet[XLSX.utils.encode_cell({ r: row, c: header.sampleColumn })]);
      if (!sampleName) continue;

      const finalCell = sheet[XLSX.utils.encode_cell({ r: row, c: header.finalConcColumn })];
      const finalConc = cellDisplayValue(finalCell);
      const sampleType = header.typeColumn === null
        ? ''
        : cellDisplayValue(sheet[XLSX.utils.encode_cell({ r: row, c: header.typeColumn })]);

      if (isCalibrationRow(sampleName, sampleType)) {
        const pointName = extractCalibrationPointName(sampleName);
        if (pointName && !calibrationPointNames.includes(pointName)) {
          calibrationPointNames.push(pointName);
        }
        continue;
      }

      // Ô Final-Conc. trống không phải là ND: không tạo candidate để tránh
      // ghi đè dữ liệu UI bằng một kết quả chưa được máy tính toán.
      if (!finalConc) continue;

      rows.push({
        sheetName,
        compoundName: sheetName,
        rowNumber: row + 1,
        sampleName,
        sampleType,
        finalConc,
        isNd: isNdValue(finalConc)
      });
    }

    compounds.push({
      sheetName,
      compoundName: sheetName,
      r2: findR2(XLSX, sheet, range),
      calibrationPointNames: calibrationPointNames.sort(compareCalibrationPoints),
      rows
    });
  }

  if (compounds.length === 0) {
    warnings.push('Không tìm thấy sheet nào có cột Sample name và Final-Conc.');
  }

  return { compounds, warnings };
}

export function buildExcelImportCandidates(
  parsed: ParsedExcelWorkbook,
  context: ExcelImportContext
): ExcelImportCandidate[] {
  const targets = buildResultTargets(context.config, context.masterTargets || []);
  const formMode = String(context.draft?.page1Data?.['printFormType'] || '');
  const isFormDon = formMode === 'formDon';
  const candidates: ExcelImportCandidate[] = [];

  parsed.compounds.forEach((compound, compoundIndex) => {
    const target = matchCompoundTarget(compound.compoundName, targets);

    if (!target) {
      compound.rows.forEach((row, rowIndex) => {
        candidates.push({
          id: `result-${compoundIndex}-${rowIndex}`,
          kind: 'result',
          sheetName: compound.sheetName,
          sourceLabel: `${row.sampleName} — ${row.finalConc}`,
          sourceSample: row.sampleName,
          targetLabel: 'Hoạt chất không thuộc SOP hiện tại',
          currentValue: '',
          sourceValue: normalizedResultValue(row),
          importValue: normalizedResultValue(row),
          isNd: row.isNd,
          selected: false,
          selectable: false,
          status: 'not-in-sop',
          possibleSamples: []
        });
      });
      return;
    }

    compound.rows.forEach((row, rowIndex) => {
      candidates.push(buildResultCandidate(
        row,
        target,
        context,
        `result-${compoundIndex}-${rowIndex}`
      ));
    });

    if (isFormDon && compound.r2 !== null) {
      const currentR2 = readCurrentR2(context, target.compoundId);
      candidates.push({
        id: `r2-${compoundIndex}`,
        kind: 'r2',
        sheetName: compound.sheetName,
        sourceLabel: `R² — ${compound.compoundName}`,
        compoundId: target.compoundId,
        targetField: 'r2',
        targetLabel: `R² · ${compound.compoundName}`,
        currentValue: currentR2,
        importValue: compound.r2,
        isNd: false,
        selected: true,
        selectable: true,
        status: hasExistingValue(currentR2) ? 'overwrite' : 'ready',
        possibleSamples: []
      });
    }
  });

  if (isFormDon) {
    const pointNames = chooseCalibrationPointNames(parsed.compounds);
    if (pointNames.length > 0) {
      const existing = context.draft?.page1Data?.['calibPoints'] || [];
      candidates.push({
        id: 'calibration-points',
        kind: 'calibration',
        sheetName: parsed.compounds.find(c => c.calibrationPointNames.length === pointNames.length)?.sheetName || '',
        sourceLabel: `Đường chuẩn Excel: ${pointNames.join(', ')}`,
        targetField: 'calibPoints',
        targetLabel: 'Danh sách điểm chuẩn (giữ nồng độ danh định)',
        currentValue: existing.map((point: any, index: number) => point?.loSo || `C${index}`).join(', '),
        importValue: pointNames.join(', '),
        isNd: false,
        selected: pointNames.length >= 4,
        selectable: pointNames.length >= 4,
        status: pointNames.length >= 4
          ? (existing.length === pointNames.length ? 'ready' : 'overwrite')
          : 'invalid',
        possibleSamples: [],
        calibrationPointNames: pointNames
      });
    }
  }

  return candidates;
}

export function getRelevantExcelImportSheetNames(
  sheetNames: string[],
  context: ExcelImportContext
): string[] {
  const targets = buildResultTargets(context.config, context.masterTargets || []);
  return sheetNames.filter(sheetName => Boolean(matchCompoundTarget(sheetName, targets)));
}

export function updateCandidateSample(
  candidate: ExcelImportCandidate,
  targetSample: string,
  context: ExcelImportContext
): void {
  candidate.targetSample = targetSample || undefined;
  if (!targetSample || !candidate.targetField || !candidate.compoundId) {
    candidate.targetLabel = 'Chưa chọn mẫu đích';
    candidate.currentValue = '';
    candidate.status = 'unmatched';
    candidate.selectable = false;
    candidate.selected = false;
    return;
  }

  if (!isQcTargetAvailable(targetSample, context)) {
    candidate.targetLabel = 'Form hiện tại không có dòng QC này';
    candidate.currentValue = '';
    candidate.status = 'not-in-form';
    candidate.selectable = false;
    candidate.selected = false;
    return;
  }

  if (!isTargetAllowedForSample(
    targetSample,
    candidate.compoundId,
    context.run,
    context.masterTargets
  )) {
    candidate.targetLabel = `${targetSample} · hoạt chất không được phân`;
    candidate.currentValue = '';
    candidate.status = 'unassigned';
    candidate.selectable = false;
    candidate.selected = false;
    return;
  }

  const row = context.draft?.resultData?.[targetSample] || {};
  const current = readResultCurrentValue(row, candidate.targetField, usesNdCheckbox(context));
  candidate.currentValue = current;
  candidate.targetLabel = `${targetSample} · ${candidate.sheetName}`;
  candidate.status = hasExistingValue(current) ? 'overwrite' : 'ready';
  candidate.selectable = true;
  candidate.selected = true;
}

export function applyExcelImportCandidates(
  candidates: ExcelImportCandidate[],
  context: ExcelImportContext,
  fileName: string,
  decimalPlaces: number | null = null
): number {
  const selected = candidates.filter(candidate => candidate.selected && candidate.selectable);
  const ndCheckbox = usesNdCheckbox(context);
  let applied = 0;

  for (const candidate of selected) {
    if (candidate.kind === 'result') {
      if (!candidate.targetSample || !candidate.targetField) continue;
      const row = context.draft.resultData[candidate.targetSample] ||= { selected: true };
      if (ndCheckbox) {
        row[`${candidate.targetField}_nd`] = candidate.isNd;
        row[candidate.targetField] = candidate.isNd ? '' : candidate.importValue;
      } else {
        row[candidate.targetField] = candidate.isNd ? 'ND' : candidate.importValue;
      }
      applied++;
      continue;
    }

    if (candidate.kind === 'r2' && candidate.compoundId) {
      if (context.config?.formType === 'type3b') {
        const byCompound = context.draft.page1Data['r2ByCompound'] ||= {};
        byCompound[candidate.compoundId] = candidate.importValue;
        if (context.draft.page1Data['activeCompound'] === candidate.compoundId) {
          context.draft.page1Data['r2'] = candidate.importValue;
        }
      } else {
        context.draft.page1Data['r2'] = candidate.importValue;
      }
      applied++;
      continue;
    }

    if (candidate.kind === 'calibration' && candidate.calibrationPointNames) {
      applyCalibrationPointNames(context.draft.page1Data, candidate.calibrationPointNames);
      applied++;
    }
  }

  const auditTrail = context.draft.page1Data['excelResultImports'] ||= [];
  auditTrail.push({
    fileName,
    importedAt: new Date().toISOString(),
    appliedCandidates: applied,
    selectedResults: selected.filter(candidate => candidate.kind === 'result').length,
    decimalPlaces
  });
  if (auditTrail.length > 20) auditTrail.splice(0, auditTrail.length - 20);
  context.draft.page1Data['lastExcelResultImport'] = auditTrail[auditTrail.length - 1];

  return applied;
}

export function normalizeImportSampleName(value: string): string {
  return String(value || '')
    .trim()
    .toUpperCase()
    .replace(/\.D$/i, '')
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_');
}

export function getAvailableExcelImportSamples(context: ExcelImportContext): string[] {
  const regularSamples = (context.run?.sampleList || []).map(String);
  const dynamicSpikeSamples = Object.keys(context.draft?.resultData || {})
    .filter(sample => /^QC_SPIKE_\d+$/.test(sample))
    .sort(compareDynamicSpikeSamples);
  const qcSamples = [
    'QC_BLANK',
    'QC_SPIKE',
    ...dynamicSpikeSamples,
    'QC_FINAL',
    'QC_CHECK_SAMPLE'
  ]
    .filter(sample => isQcTargetAvailable(sample, context));
  return Array.from(new Set([...regularSamples, ...qcSamples]));
}

export function formatImportedFinalConc(
  sourceValue: string,
  isNd: boolean,
  decimalPlaces: number | null
): string {
  if (isNd || isNdValue(sourceValue)) return 'ND';
  if (decimalPlaces === null) return String(sourceValue || '').trim();

  const normalized = String(sourceValue || '').trim().replace(',', '.');
  const numericValue = Number(normalized);
  if (!Number.isFinite(numericValue)) return String(sourceValue || '').trim();
  return numericValue.toFixed(decimalPlaces);
}

function findHeaderRow(XLSX: any, sheet: any, range: any): {
  row: number;
  sampleColumn: number;
  finalConcColumn: number;
  typeColumn: number | null;
} | null {
  const lastHeaderRow = Math.min(range.e.r, range.s.r + 24);
  for (let row = range.s.r; row <= lastHeaderRow; row++) {
    let sampleColumn: number | null = null;
    let finalConcColumn: number | null = null;
    let typeColumn: number | null = null;

    for (let column = range.s.c; column <= range.e.c; column++) {
      const cell = sheet[XLSX.utils.encode_cell({ r: row, c: column })];
      const normalized = normalizeHeader(cellDisplayValue(cell));
      if (SAMPLE_HEADER_NAMES.has(normalized)) sampleColumn = column;
      if (FINAL_CONC_HEADER_NAMES.has(normalized)) finalConcColumn = column;
      if (TYPE_HEADER_NAMES.has(normalized)) typeColumn = column;
    }

    if (sampleColumn !== null && finalConcColumn !== null) {
      return { row, sampleColumn, finalConcColumn, typeColumn };
    }
  }
  return null;
}

function findR2(XLSX: any, sheet: any, range: any): string | null {
  const preferred = sheet[XLSX.utils.encode_cell({ r: 7, c: 13 })];
  const preferredValue = cellDisplayValue(preferred);
  if (isNumericText(preferredValue)) return preferredValue;

  const maxRow = Math.min(range.e.r, range.s.r + 20);
  const maxColumn = Math.min(range.e.c, range.s.c + 20);
  for (let row = range.s.r; row <= maxRow; row++) {
    for (let column = range.s.c; column <= maxColumn; column++) {
      const cell = sheet[XLSX.utils.encode_cell({ r: row, c: column })];
      const label = normalizeHeader(cellDisplayValue(cell));
      if (label !== 'r2') continue;

      const adjacent = [
        sheet[XLSX.utils.encode_cell({ r: row, c: column + 1 })],
        sheet[XLSX.utils.encode_cell({ r: row + 1, c: column })]
      ];
      for (const valueCell of adjacent) {
        const value = cellDisplayValue(valueCell);
        if (isNumericText(value)) return value;
      }
    }
  }
  return null;
}

function buildResultCandidate(
  row: ParsedExcelResultRow,
  target: ResultTarget,
  context: ExcelImportContext,
  id: string
): ExcelImportCandidate {
  const regularSamples = (context.run?.sampleList || []).map(String);
  const possibleSamples = getAvailableExcelImportSamples(context);
  const matchedSamples = matchRegularSamples(row.sampleName, regularSamples);
  let targetSample: string | undefined;
  let status: ExcelImportCandidate['status'] = 'unmatched';

  if (matchedSamples.length === 1) {
    targetSample = matchedSamples[0];
  } else if (matchedSamples.length > 1) {
    status = 'ambiguous';
  } else {
    targetSample = classifyQcSample(row.sampleName, row.sampleType, context);
  }

  if (targetSample?.startsWith('QC_') && !isQcTargetAvailable(targetSample, context)) {
    return {
      id,
      kind: 'result',
      sheetName: row.sheetName,
      sourceLabel: `${row.sampleName} — ${row.finalConc}`,
      sourceSample: row.sampleName,
      compoundId: target.compoundId,
      targetField: target.resultKey,
      targetLabel: 'Form hiện tại không có dòng QC này',
      currentValue: '',
      sourceValue: normalizedResultValue(row),
      importValue: normalizedResultValue(row),
      isNd: row.isNd,
      selected: false,
      selectable: false,
      status: 'not-in-form',
      possibleSamples
    };
  }

  if (!targetSample) {
    return {
      id,
      kind: 'result',
      sheetName: row.sheetName,
      sourceLabel: `${row.sampleName} — ${row.finalConc}`,
      sourceSample: row.sampleName,
      compoundId: target.compoundId,
      targetField: target.resultKey,
      targetLabel: status === 'ambiguous' ? 'Có nhiều mẫu phù hợp' : 'Chưa tìm thấy mẫu đích',
      currentValue: '',
      sourceValue: normalizedResultValue(row),
      importValue: normalizedResultValue(row),
      isNd: row.isNd,
      selected: false,
      selectable: false,
      status,
      possibleSamples
    };
  }

  if (!isTargetAllowedForSample(
    targetSample,
    target.compoundId,
    context.run,
    context.masterTargets
  )) {
    return {
      id,
      kind: 'result',
      sheetName: row.sheetName,
      sourceLabel: `${row.sampleName} — ${row.finalConc}`,
      sourceSample: row.sampleName,
      compoundId: target.compoundId,
      targetField: target.resultKey,
      targetSample,
      targetLabel: `${targetSample} · hoạt chất không được phân`,
      currentValue: '',
      sourceValue: normalizedResultValue(row),
      importValue: normalizedResultValue(row),
      isNd: row.isNd,
      selected: false,
      selectable: false,
      status: 'unassigned',
      possibleSamples
    };
  }

  const current = readResultCurrentValue(
    context.draft?.resultData?.[targetSample] || {},
    target.resultKey,
    usesNdCheckbox(context)
  );
  return {
    id,
    kind: 'result',
    sheetName: row.sheetName,
    sourceLabel: `${row.sampleName} — ${row.finalConc}`,
    sourceSample: row.sampleName,
    compoundId: target.compoundId,
    targetField: target.resultKey,
    targetSample,
    targetLabel: `${targetSample} · ${row.sheetName}`,
    currentValue: current,
    sourceValue: normalizedResultValue(row),
    importValue: normalizedResultValue(row),
    isNd: row.isNd,
    selected: true,
    selectable: true,
    status: hasExistingValue(current) ? 'overwrite' : 'ready',
    possibleSamples
  };
}

function buildResultTargets(config: any, masterTargets: any[]): ResultTarget[] {
  if (config?.formType === 'type3b') {
    return (config.compounds || []).map((compoundId: string) => ({
      compoundId,
      resultKey: compoundId,
      aliases: aliasesForCompound(compoundId, '', masterTargets)
    }));
  }

  return Object.keys(config?.columns || {})
    .filter(key => /^kq/i.test(key))
    .map(resultKey => {
      const mapped = SOP01_COLUMN_TO_CANONICAL[resultKey];
      const compoundId = mapped || getCanonicalId(resultKey.replace(/^kq/i, ''));
      return {
        compoundId,
        resultKey,
        aliases: aliasesForCompound(
          compoundId,
          resultKey.replace(/^kq/i, ''),
          masterTargets
        )
      };
    });
}

function aliasesForCompound(
  compoundId: string,
  extraAlias = '',
  masterTargets: any[] = []
): Set<string> {
  const aliases = new Set<string>([
    normalizeCompoundName(compoundId),
    normalizeCompoundName(extraAlias)
  ]);
  for (const [alias, canonical] of Object.entries(COMPOUND_TO_FIRESTORE_ID)) {
    if (canonical === compoundId) aliases.add(normalizeCompoundName(alias));
  }

  const canonicalId = getCanonicalId(compoundId);
  masterTargets
    .filter(target =>
      getCanonicalId(String(target?.id || '')) === canonicalId
      || getCanonicalId(String(target?.name || '')) === canonicalId
    )
    .forEach(target => {
      aliases.add(normalizeCompoundName(String(target.id || '')));
      aliases.add(normalizeCompoundName(String(target.name || '')));
      (Array.isArray(target.aliases) ? target.aliases : []).forEach((alias: unknown) => {
        aliases.add(normalizeCompoundName(String(alias || '')));
      });
    });

  aliases.delete('');
  return aliases;
}

function matchCompoundTarget(sourceName: string, targets: ResultTarget[]): ResultTarget | null {
  const normalized = normalizeCompoundName(sourceName);
  const exact = targets.filter(target => target.aliases.has(normalized));
  if (exact.length === 1) return exact[0];

  // Một số tên sheet của MassHunter thêm chú thích trong ngoặc hoặc dấu gạch dưới.
  const contained = targets.filter(target =>
    Array.from(target.aliases).some(alias =>
      alias.length >= 5 && (normalized.includes(alias) || alias.includes(normalized))
    )
  );
  return contained.length === 1 ? contained[0] : null;
}

function matchRegularSamples(
  excelSampleName: string,
  samples: string[]
): string[] {
  const excel = normalizeImportSampleName(excelSampleName);
  if (!excel) return [];

  const exact = samples.filter(sample => normalizeImportSampleName(sample) === excel);
  if (exact.length > 0) return exact;

  const suffixMatches = samples.filter(sample => {
    const lims = normalizeImportSampleName(sample);
    return Boolean(lims) && excel.endsWith(`_${lims}`);
  });
  if (suffixMatches.length === 1) return suffixMatches;
  if (suffixMatches.length > 1) {
    const longestLength = Math.max(
      ...suffixMatches.map(sample => normalizeImportSampleName(sample).length)
    );
    return suffixMatches.filter(
      sample => normalizeImportSampleName(sample).length === longestLength
    );
  }

  // Nhánh fallback cho quy ước đặt tên sequence chung của lab:
  // xxx_ngày_mã-mẫu (FIPRONIL_27_U01.D) tương ứng mã mẻ mã-mẫu+ngày (U0127).
  // Chỉ dùng sau khi exact/suffix đều thất bại và chỉ trả về khi tên ghép
  // thực sự tồn tại trong danh sách mẫu của mẻ.
  const datedSample = excel.match(/(?:^|_)(0[1-9]|[12]\d|3[01])_([A-Z0-9]+)$/);
  if (!datedSample) return [];

  const limsSampleName = `${datedSample[2]}${datedSample[1]}`;
  return samples.filter(
    sample => normalizeImportSampleName(sample) === limsSampleName
  );
}

function classifyQcSample(
  sampleName: string,
  sampleType: string,
  context: ExcelImportContext
): string | undefined {
  const normalized = normalizeImportSampleName(sampleName);
  const type = normalizeImportSampleName(sampleType);
  const lastToken = normalized.split('_').filter(Boolean).at(-1) || '';

  if (type.includes('CALIBRATION')) return undefined;

  if (isSop01Import(context)) {
    const numberedSpike = normalized.match(/(?:^|_)(?:SP|SPIKE)_(\d+)(?:_|$)/);
    if (numberedSpike) return `QC_SPIKE_${Number(numberedSpike[1])}`;

    // SOP-01 dùng các tên như FIPRONIL_BL0107F và FIPRONIL_SP0107F.
    // Chỉ áp dụng quy tắc prefix này trong SOP-01 để tránh nhận nhầm mẫu thường
    // có BL/SP ở những SOP khác.
    if (/(?:^|_)(?:BLANK|BL)[A-Z0-9]*(?:_|$)/.test(normalized)) return 'QC_BLANK';
    if (/(?:^|_)(?:SPIKE|SP)[A-Z0-9]*(?:_|$)/.test(normalized)) return 'QC_SPIKE';

    const checkSampleName = normalizeImportSampleName(
      String(context.draft?.page1Data?.['checkSampleName'] || '')
    );
    if (checkSampleName && normalized.includes(checkSampleName)) return 'QC_CHECK_SAMPLE';
  }

  if (lastToken === 'BL' || lastToken === 'BLANK') return 'QC_BLANK';
  if (lastToken === 'SP' || lastToken === 'SPIKE') return 'QC_SPIKE';
  if (lastToken === 'FINAL') return 'QC_FINAL';
  if (lastToken === 'CHECK' || normalized.endsWith('_CHECK_SAMPLE')) return 'QC_CHECK_SAMPLE';
  return undefined;
}

function isSop01Import(context: ExcelImportContext): boolean {
  return context.configKey === 'fipronil-chlorpyrifos'
    || context.run?.sopId === 'SOP-01';
}

function compareDynamicSpikeSamples(left: string, right: string): number {
  return Number(left.replace('QC_SPIKE_', '')) - Number(right.replace('QC_SPIKE_', ''));
}

function isTargetAllowedForSample(
  sample: string,
  compoundId: string,
  run: any,
  masterTargets: any[] = []
): boolean {
  if (sample.startsWith('QC_')) return true;
  const targetMap = run?.sampleTargetMap ?? run?.inputs?.sampleTargetMap;
  const assigned = getAssignedTargetsForSample(sample, targetMap);
  return assigned === null || isCompoundAssigned(assigned, compoundId, masterTargets);
}

function isQcTargetAvailable(sample: string, context: ExcelImportContext): boolean {
  if (!sample.startsWith('QC_')) return true;

  const printFormType = context.draft?.page1Data?.['printFormType'];
  if (context.config?.formType === 'type3b') {
    if (printFormType === 'formCheck') return false;
    if (printFormType === 'formDon') {
      if (sample === 'QC_FINAL') return context.draft?.page1Data?.['hasFinal'] === true;
      if (sample === 'QC_CHECK_SAMPLE') return false;
      return sample === 'QC_BLANK' || sample === 'QC_SPIKE';
    }
  }

  // Form đặc thù chỉ cho import QC khi chính component SOP đã tạo dòng đó.
  return Boolean(context.draft?.resultData?.[sample]);
}

function usesNdCheckbox(context: ExcelImportContext): boolean {
  return context.config?.formType === 'type3b'
    && context.draft?.page1Data?.['printFormType'] === 'formCheck';
}

function readResultCurrentValue(row: any, resultKey: string, ndCheckbox: boolean): string {
  if (ndCheckbox && row?.[`${resultKey}_nd`] === true) return 'ND';
  return String(row?.[resultKey] ?? '').trim();
}

function readCurrentR2(context: ExcelImportContext, compoundId: string): string {
  if (context.config?.formType !== 'type3b') {
    return String(context.draft?.page1Data?.['r2'] ?? '').trim();
  }
  const byCompound = context.draft?.page1Data?.['r2ByCompound'] || {};
  if (byCompound[compoundId] !== undefined) return String(byCompound[compoundId]).trim();
  if (context.draft?.page1Data?.['activeCompound'] === compoundId) {
    return String(context.draft?.page1Data?.['r2'] ?? '').trim();
  }
  return '';
}

function applyCalibrationPointNames(page1Data: any, pointNames: string[]): void {
  if (pointNames.length < 4) return;
  const existing = Array.isArray(page1Data['calibPoints']) ? page1Data['calibPoints'] : [];
  page1Data['calibPoints'] = pointNames.map((name, index) => {
    const sameName = existing.find((point: any) =>
      normalizeImportSampleName(point?.loSo) === normalizeImportSampleName(name)
    );
    const fallback = existing[index];
    const source = sameName || fallback || {};
    return {
      ...source,
      loSo: name,
      vialNo: source.vialNo || String(index + 1),
      // Không lấy Final-Conc. của calibration: đây là nồng độ đo lại.
      // Nồng độ danh định hiện có trên form luôn được giữ nguyên.
      hamLuong: source.hamLuong ?? ''
    };
  });
}

function chooseCalibrationPointNames(compounds: ParsedExcelCompound[]): string[] {
  const groups = new Map<string, { names: string[]; count: number }>();
  compounds.forEach(compound => {
    if (compound.calibrationPointNames.length === 0) return;
    const key = compound.calibrationPointNames.join('|');
    const current = groups.get(key);
    if (current) current.count++;
    else groups.set(key, { names: compound.calibrationPointNames, count: 1 });
  });
  return Array.from(groups.values()).sort((a, b) => b.count - a.count)[0]?.names || [];
}

function isCalibrationRow(sampleName: string, sampleType: string): boolean {
  const type = normalizeImportSampleName(sampleType);
  if (type.includes('CALIBRATION')) return true;
  return extractCalibrationPointName(sampleName) !== null;
}

function extractCalibrationPointName(sampleName: string): string | null {
  const normalized = normalizeImportSampleName(sampleName);
  const match = normalized.match(/(?:^|_)(C\d+)$/);
  return match?.[1] || null;
}

function compareCalibrationPoints(a: string, b: string): number {
  return Number(a.slice(1)) - Number(b.slice(1));
}

function normalizedResultValue(row: ParsedExcelResultRow): string {
  return row.isNd ? 'ND' : row.finalConc.trim();
}

function cellDisplayValue(cell: any): string {
  if (!cell || cell.v === undefined || cell.v === null) return '';
  // Ưu tiên giá trị hiển thị của Excel, không tự làm tròn hoặc đổi đơn vị.
  return String(cell.w ?? cell.v).trim();
}

function normalizeHeader(value: string): string {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function normalizeCompoundName(value: string): string {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function isNumericText(value: string): boolean {
  return value !== '' && Number.isFinite(Number(value.replace(',', '.')));
}

function isNdValue(value: string): boolean {
  const normalized = String(value ?? '').trim();
  if (!normalized) return false;
  if (/^N[\s.]*D[\s.]*$/i.test(normalized)) return true;

  // Máy có thể xuất kết quả dưới LOQ dưới dạng 0, 0.000 hoặc 0,000.
  // Mọi giá trị số bằng 0 đều được trả về ND ở cả hai loại form.
  const numericValue = Number(normalized.replace(',', '.'));
  return Number.isFinite(numericValue) && numericValue === 0;
}

function hasExistingValue(value: string): boolean {
  return String(value || '').trim() !== '';
}
