export type ExcelImportCandidateKind = 'result' | 'r2' | 'calibration';

export type ExcelImportCandidateStatus =
  | 'ready'
  | 'overwrite'
  | 'unmatched'
  | 'ambiguous'
  | 'not-in-sop'
  | 'not-in-form'
  | 'unassigned'
  | 'invalid';

export interface ParsedExcelResultRow {
  sheetName: string;
  compoundName: string;
  rowNumber: number;
  sampleName: string;
  sampleType: string;
  finalConc: string;
  isNd: boolean;
}

export interface ParsedExcelCompound {
  sheetName: string;
  compoundName: string;
  r2: string | null;
  calibrationPointNames: string[];
  rows: ParsedExcelResultRow[];
}

export interface ParsedExcelWorkbook {
  compounds: ParsedExcelCompound[];
  warnings: string[];
}

export interface ExcelImportCandidate {
  id: string;
  kind: ExcelImportCandidateKind;
  sheetName: string;
  sourceLabel: string;
  sourceSample?: string;
  compoundId?: string;
  targetField?: string;
  targetSample?: string;
  targetLabel: string;
  currentValue: string;
  sourceValue?: string;
  importValue: string;
  isNd: boolean;
  selected: boolean;
  selectable: boolean;
  status: ExcelImportCandidateStatus;
  possibleSamples: string[];
  calibrationPointNames?: string[];
}

export interface ExcelImportContext {
  run: any;
  draft: any;
  config: any;
  configKey: string | null;
}
