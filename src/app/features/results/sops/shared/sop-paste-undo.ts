export interface WriteGuardContext {
  canEdit: boolean;
  isReadOnly: boolean;
  isLockedByOthers: boolean;
  isCompleted: boolean;
}

export interface GridPasteCellTarget {
  rowKey: string;
  rowLabel: string;
  colKey: string;
  colLabel: string;
  editable: boolean;
  assigned: boolean;
  isNdMode?: boolean;
}

export interface GridPasteGridSpec {
  rows: { rowKey: string; rowLabel: string }[];
  columns: { colKey: string; colLabel: string }[];
  startRowIndex: number;
  startColIndex: number;
  getCellSpec: (rowKey: string, colKey: string) => GridPasteCellTarget;
  readCell: (rowKey: string, colKey: string) => { value: string; nd?: boolean };
  minNumericValue?: number;
  maxNumericValue?: number;
  allowTextNotesForCol?: (colKey: string) => boolean;
}

export interface ParsedResultValue {
  kind: 'empty' | 'nd' | 'loq' | 'na' | 'numeric' | 'text' | 'invalid';
  normalizedValue: string;
  ndFlag: boolean;
  numericValue?: number;
  reason?: string;
}

export interface PasteCellDiff {
  rowKey: string;
  rowLabel: string;
  colKey: string;
  colLabel: string;
  rawValue: string;
  oldValue: string;
  oldNd?: boolean;
  newValue: string;
  newNd?: boolean;
  isOverwrite: boolean;
  isNdMode?: boolean;
}

export interface PasteSkippedCell {
  rowKey: string;
  rowLabel: string;
  colKey: string;
  colLabel: string;
  rawValue: string;
  reason: string;
}

export interface PasteTransactionPlan {
  allowed: boolean;
  blockedReason?: string;
  totalParsedCells: number;
  ignoredOutOfBoundsCount: number;
  diffs: PasteCellDiff[];
  overwriteCount: number;
  skippedUnassigned: PasteSkippedCell[];
  invalidCells: PasteSkippedCell[];
  requiresPreviewConfirm: boolean;
}

export interface UndoTransactionRecord {
  id: string;
  summary: string;
  createdAt: number;
  baseRevision: number;
  appliedRevision: number;
  cells: {
    rowKey: string;
    colKey: string;
    oldValue: string;
    oldNd?: boolean;
    newValue: string;
    newNd?: boolean;
    isNdMode?: boolean;
  }[];
}

export interface ApplyPasteResult {
  applied: boolean;
  reason?: string;
  appliedCount: number;
  nextRevision: number;
  transaction?: UndoTransactionRecord;
}

export interface UndoExecutionResult {
  undone: boolean;
  reason?: string;
  restoredCount: number;
  nextRevision: number;
}

export function checkWritePermission(guard: WriteGuardContext): { allowed: boolean; reason?: string } {
  if (!guard.canEdit) {
    return { allowed: false, reason: 'Bạn không có quyền chỉnh sửa kết quả.' };
  }
  if (guard.isCompleted) {
    return { allowed: false, reason: 'Mẻ đã hoàn thành/xuất bản. Hãy mở khóa trước khi sửa.' };
  }
  if (guard.isLockedByOthers) {
    return { allowed: false, reason: 'Mẻ đang bị người khác khóa chỉnh sửa.' };
  }
  if (guard.isReadOnly) {
    return { allowed: false, reason: 'Biểu mẫu đang ở chế độ chỉ xem.' };
  }
  return { allowed: true };
}

/**
 * Parse TSV clipboard payload copied from Excel / Google Sheets / LibreOffice.
 */
export function parseSpreadsheetPasteText(rawText: string): string[][] {
  if (!rawText) return [];
  const normalized = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalized.split('\n');
  while (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
  }
  if (lines.length === 0) return [];
  return lines.map(line => line.split('\t').map(cell => cell.trim()));
}

function parseLocaleNumber(raw: string): number | null {
  const compact = raw.replace(/\s+/g, '');
  if (!/^[+-]?[\d.,]+$/.test(compact)) return null;

  // Both comma and dot present -> whichever appears last is decimal separator
  const lastComma = compact.lastIndexOf(',');
  const lastDot = compact.lastIndexOf('.');
  let normalized = compact;

  if (lastComma !== -1 && lastDot !== -1) {
    if (lastComma > lastDot) {
      // Vietnamese style: 1.250,75 -> 1250.75
      normalized = compact.replace(/\./g, '').replace(',', '.');
    } else {
      // English style: 1,250.75 -> 1250.75
      normalized = compact.replace(/,/g, '');
    }
  } else if (lastComma !== -1) {
    const parts = compact.split(',');
    if (parts.length === 2) {
      normalized = `${parts[0]}.${parts[1]}`;
    } else {
      normalized = compact.replace(/,/g, '');
    }
  } else if (lastDot !== -1) {
    const parts = compact.split('.');
    if (parts.length > 2) {
      normalized = compact.replace(/\./g, '');
    }
  }

  const num = Number(normalized);
  return Number.isFinite(num) ? num : null;
}

export function normalizePastedResultValue(
  raw: string,
  options: {
    minNumericValue?: number;
    maxNumericValue?: number;
    isNdMode?: boolean;
    allowTextNotes?: boolean;
  } = {}
): ParsedResultValue {
  const trimmed = String(raw ?? '').trim();
  if (!trimmed) {
    return { kind: 'empty', normalizedValue: '', ndFlag: false };
  }

  const upper = trimmed.toUpperCase();
  if (upper === 'ND' || upper === 'KPH' || upper === 'K.P.H' || upper === 'KHÔNG PHÁT HIỆN') {
    return {
      kind: 'nd',
      normalizedValue: options.isNdMode ? '' : 'ND',
      ndFlag: true,
    };
  }

  if (upper === 'N/A' || upper === 'NA') {
    return {
      kind: 'na',
      normalizedValue: 'N/A',
      ndFlag: false,
    };
  }

  if (/^<\s*(LOQ|LOD|\d+(?:[.,]\d+)?)/i.test(trimmed)) {
    const cleanedLoq = trimmed.replace(/,/g, '.').replace(/\s+/g, '');
    return {
      kind: 'loq',
      normalizedValue: cleanedLoq,
      ndFlag: false,
    };
  }

  if (options.allowTextNotes) {
    return {
      kind: 'text',
      normalizedValue: trimmed,
      ndFlag: false,
    };
  }

  const numeric = parseLocaleNumber(trimmed);
  if (numeric === null) {
    return {
      kind: 'invalid',
      normalizedValue: trimmed,
      ndFlag: false,
      reason: `Giá trị "${trimmed}" không đúng định dạng số hoặc ND/KPH/<LOQ.`,
    };
  }

  const minVal = options.minNumericValue ?? 0;
  if (numeric < minVal) {
    return {
      kind: 'invalid',
      normalizedValue: trimmed,
      ndFlag: false,
      reason: `Giá trị ${numeric} nhỏ hơn giới hạn tối thiểu (${minVal}).`,
    };
  }

  if (options.maxNumericValue !== undefined && numeric > options.maxNumericValue) {
    return {
      kind: 'invalid',
      normalizedValue: trimmed,
      ndFlag: false,
      reason: `Giá trị ${numeric} vượt quá giới hạn tối đa (${options.maxNumericValue}).`,
    };
  }

  // Normalize comma decimal to dot while avoiding scientific notation for normal lab numbers
  const canonicalStr = String(numeric);
  return {
    kind: 'numeric',
    normalizedValue: canonicalStr,
    ndFlag: false,
    numericValue: numeric,
  };
}

export function planSpreadsheetPaste(
  matrix: string[][],
  grid: GridPasteGridSpec,
  guard: WriteGuardContext
): PasteTransactionPlan {
  const perm = checkWritePermission(guard);
  if (!perm.allowed) {
    return {
      allowed: false,
      blockedReason: perm.reason,
      totalParsedCells: 0,
      ignoredOutOfBoundsCount: 0,
      diffs: [],
      overwriteCount: 0,
      skippedUnassigned: [],
      invalidCells: [],
      requiresPreviewConfirm: false,
    };
  }

  const diffs: PasteCellDiff[] = [];
  const skippedUnassigned: PasteSkippedCell[] = [];
  const invalidCells: PasteSkippedCell[] = [];
  let totalParsedCells = 0;
  let ignoredOutOfBoundsCount = 0;
  let overwriteCount = 0;

  matrix.forEach((rowCells, rOffset) => {
    const targetRowIdx = grid.startRowIndex + rOffset;
    if (targetRowIdx < 0 || targetRowIdx >= grid.rows.length) {
      ignoredOutOfBoundsCount += rowCells.length;
      return;
    }
    const rowSpec = grid.rows[targetRowIdx];

    rowCells.forEach((rawCell, cOffset) => {
      totalParsedCells++;
      const targetColIdx = grid.startColIndex + cOffset;
      if (targetColIdx < 0 || targetColIdx >= grid.columns.length) {
        ignoredOutOfBoundsCount++;
        return;
      }
      const colSpec = grid.columns[targetColIdx];
      const cellSpec = grid.getCellSpec(rowSpec.rowKey, colSpec.colKey);

      if (!cellSpec.assigned || !cellSpec.editable) {
        if (rawCell !== '') {
          skippedUnassigned.push({
            rowKey: rowSpec.rowKey,
            rowLabel: rowSpec.rowLabel,
            colKey: colSpec.colKey,
            colLabel: colSpec.colLabel,
            rawValue: rawCell,
            reason: !cellSpec.assigned
              ? 'Chỉ tiêu không được chỉ định cho mẫu này.'
              : 'Ô đang khóa không cho phép dán.',
          });
        }
        return;
      }

      const allowText = grid.allowTextNotesForCol ? grid.allowTextNotesForCol(colSpec.colKey) : false;
      const parsed = normalizePastedResultValue(rawCell, {
        minNumericValue: grid.minNumericValue,
        maxNumericValue: grid.maxNumericValue,
        isNdMode: cellSpec.isNdMode,
        allowTextNotes: allowText,
      });

      if (parsed.kind === 'invalid') {
        invalidCells.push({
          rowKey: rowSpec.rowKey,
          rowLabel: rowSpec.rowLabel,
          colKey: colSpec.colKey,
          colLabel: colSpec.colLabel,
          rawValue: rawCell,
          reason: parsed.reason || 'Giá trị không hợp lệ.',
        });
        return;
      }

      const current = grid.readCell(rowSpec.rowKey, colSpec.colKey);
      const oldValue = String(current.value ?? '');
      const oldNd = Boolean(current.nd);
      const newValue = parsed.normalizedValue;
      const newNd = cellSpec.isNdMode ? parsed.ndFlag : current.nd;

      const valueChanged = oldValue !== newValue || Boolean(oldNd) !== Boolean(newNd);
      if (!valueChanged) return;

      const hadExistingContent = oldValue.trim() !== '' || Boolean(cellSpec.isNdMode && oldNd);
      if (hadExistingContent) {
        overwriteCount++;
      }

      diffs.push({
        rowKey: rowSpec.rowKey,
        rowLabel: rowSpec.rowLabel,
        colKey: colSpec.colKey,
        colLabel: colSpec.colLabel,
        rawValue: rawCell,
        oldValue,
        oldNd,
        newValue,
        newNd,
        isOverwrite: hadExistingContent,
        isNdMode: cellSpec.isNdMode,
      });
    });
  });

  const requiresPreviewConfirm =
    overwriteCount > 0 ||
    invalidCells.length > 0 ||
    skippedUnassigned.length > 0 ||
    diffs.length > 1;

  return {
    allowed: true,
    totalParsedCells,
    ignoredOutOfBoundsCount,
    diffs,
    overwriteCount,
    skippedUnassigned,
    invalidCells,
    requiresPreviewConfirm,
  };
}

export function applyPasteTransaction(
  plan: PasteTransactionPlan,
  guard: WriteGuardContext,
  currentRevision: number,
  writeCell: (rowKey: string, colKey: string, value: string, nd?: boolean) => void,
  summaryLabel?: string
): ApplyPasteResult {
  const perm = checkWritePermission(guard);
  if (!perm.allowed) {
    return {
      applied: false,
      reason: perm.reason,
      appliedCount: 0,
      nextRevision: currentRevision,
    };
  }

  if (!plan.allowed) {
    return {
      applied: false,
      reason: plan.blockedReason || 'Không thể dán dữ liệu.',
      appliedCount: 0,
      nextRevision: currentRevision,
    };
  }

  if (plan.invalidCells.length > 0) {
    return {
      applied: false,
      reason: `Có ${plan.invalidCells.length} ô dữ liệu không hợp lệ.`,
      appliedCount: 0,
      nextRevision: currentRevision,
    };
  }

  if (plan.diffs.length === 0) {
    return {
      applied: false,
      reason: 'Không có ô hợp lệ nào thay đổi.',
      appliedCount: 0,
      nextRevision: currentRevision,
    };
  }

  for (const diff of plan.diffs) {
    writeCell(diff.rowKey, diff.colKey, diff.newValue, diff.newNd);
  }

  const nextRevision = currentRevision + 1;
  const transaction: UndoTransactionRecord = {
    id: `tx_${Date.now()}_${nextRevision}`,
    summary: summaryLabel || `Dán ${plan.diffs.length} ô từ clipboard`,
    createdAt: Date.now(),
    baseRevision: currentRevision,
    appliedRevision: nextRevision,
    cells: plan.diffs.map(d => ({
      rowKey: d.rowKey,
      colKey: d.colKey,
      oldValue: d.oldValue,
      oldNd: d.oldNd,
      newValue: d.newValue,
      newNd: d.newNd,
      isNdMode: d.isNdMode,
    })),
  };

  return {
    applied: true,
    appliedCount: plan.diffs.length,
    nextRevision,
    transaction,
  };
}

export class PasteUndoStack {
  private stack: UndoTransactionRecord[] = [];

  constructor(private readonly maxEntries = 20) {}

  get size(): number {
    return this.stack.length;
  }

  peek(): UndoTransactionRecord | null {
    return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
  }

  push(tx: UndoTransactionRecord): void {
    this.stack.push(tx);
    if (this.stack.length > this.maxEntries) {
      this.stack.shift();
    }
  }

  clear(): void {
    this.stack = [];
  }

  undoLast(
    guard: WriteGuardContext,
    currentRevision: number,
    readCell: (rowKey: string, colKey: string) => { value: string; nd?: boolean },
    writeCell: (rowKey: string, colKey: string, value: string, nd?: boolean) => void
  ): UndoExecutionResult {
    const perm = checkWritePermission(guard);
    if (!perm.allowed) {
      return {
        undone: false,
        reason: perm.reason,
        restoredCount: 0,
        nextRevision: currentRevision,
      };
    }

    const tx = this.peek();
    if (!tx) {
      return {
        undone: false,
        reason: 'Không có thao tác nào để hoàn tác.',
        restoredCount: 0,
        nextRevision: currentRevision,
      };
    }

    // Verify revision / concurrent edit safety:
    // If another write happened after this transaction, reject unless cells still match
    if (currentRevision !== tx.appliedRevision) {
      return {
        undone: false,
        reason: 'Dữ liệu đã có thay đổi mới sau lần dán này. Không thể hoàn tác an toàn.',
        restoredCount: 0,
        nextRevision: currentRevision,
      };
    }

    // Verify every cell still contains what the transaction wrote
    for (const cell of tx.cells) {
      const current = readCell(cell.rowKey, cell.colKey);
      const curVal = String(current.value ?? '');
      const matchesVal = curVal === cell.newValue;
      const matchesNd = cell.isNdMode ? Boolean(current.nd) === Boolean(cell.newNd) : true;
      if (!matchesVal || !matchesNd) {
        return {
          undone: false,
          reason: `Ô (${cell.rowKey} · ${cell.colKey}) đã bị sửa đổi sau khi dán.`,
          restoredCount: 0,
          nextRevision: currentRevision,
        };
      }
    }

    for (const cell of tx.cells) {
      writeCell(cell.rowKey, cell.colKey, cell.oldValue, cell.oldNd);
    }

    this.stack.pop();
    return {
      undone: true,
      restoredCount: tx.cells.length,
      nextRevision: currentRevision + 1,
    };
  }
}

export interface GridPasteControllerResult {
  applied?: boolean;
  count?: number;
  previewNeeded?: boolean;
  error?: string;
}

/**
 * Coordinates spreadsheet paste planning, optional preview confirmation (overwrites/warnings),
 * atomic commit and guarded transaction Undo across Type2/Type3a/9.14 SOP forms.
 */
export class GridPasteController {
  readonly undoStack = new PasteUndoStack();
  revision = 0;
  pendingPlan: PasteTransactionPlan | null = null;
  private pendingWriter: ((rowKey: string, colKey: string, value: string, nd?: boolean) => void) | null = null;
  private pendingSummary = '';

  bumpRevision(): void {
    this.revision++;
  }

  reset(): void {
    this.undoStack.clear();
    this.pendingPlan = null;
    this.pendingWriter = null;
  }

  cancelPending(): void {
    this.pendingPlan = null;
    this.pendingWriter = null;
  }

  planOrApply(
    rawText: string,
    grid: GridPasteGridSpec,
    guard: WriteGuardContext,
    writeCell: (rowKey: string, colKey: string, value: string, nd?: boolean) => void,
    summaryLabel?: string
  ): GridPasteControllerResult {
    const matrix = parseSpreadsheetPasteText(rawText);
    const plan = planSpreadsheetPaste(matrix, grid, guard);
    if (!plan.allowed) {
      return { applied: false, error: plan.blockedReason || 'Không thể dán dữ liệu.' };
    }

    if (plan.invalidCells.length > 0 || plan.overwriteCount > 0 || plan.skippedUnassigned.length > 0) {
      this.pendingPlan = plan;
      this.pendingWriter = writeCell;
      this.pendingSummary = summaryLabel || '';
      return { applied: false, previewNeeded: true };
    }

    const res = applyPasteTransaction(plan, guard, this.revision, writeCell, summaryLabel);
    if (!res.applied || !res.transaction) {
      return { applied: false, error: res.reason || 'Không có ô hợp lệ nào thay đổi.' };
    }
    this.revision = res.nextRevision;
    this.undoStack.push(res.transaction);
    return { applied: true, count: res.appliedCount };
  }

  confirmPending(guard: WriteGuardContext): GridPasteControllerResult {
    const plan = this.pendingPlan;
    const writeCell = this.pendingWriter;
    const summary = this.pendingSummary;
    this.pendingPlan = null;
    this.pendingWriter = null;
    this.pendingSummary = '';

    if (!plan || !writeCell) {
      return { applied: false, error: 'Không có thao tác dán đang chờ.' };
    }
    const res = applyPasteTransaction(plan, guard, this.revision, writeCell, summary);
    if (!res.applied || !res.transaction) {
      return { applied: false, error: res.reason || 'Không thể áp dụng dán.' };
    }
    this.revision = res.nextRevision;
    this.undoStack.push(res.transaction);
    return { applied: true, count: res.appliedCount };
  }

  undoLast(
    guard: WriteGuardContext,
    readCell: (rowKey: string, colKey: string) => { value: string; nd?: boolean },
    writeCell: (rowKey: string, colKey: string, value: string, nd?: boolean) => void
  ): UndoExecutionResult {
    const res = this.undoStack.undoLast(guard, this.revision, readCell, writeCell);
    if (res.undone) {
      this.revision = res.nextRevision;
    }
    return res;
  }
}
