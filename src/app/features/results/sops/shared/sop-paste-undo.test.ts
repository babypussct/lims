import assert from 'node:assert/strict';
import test from 'node:test';
import {
  applyPasteTransaction,
  GridPasteController,
  GridPasteGridSpec,
  normalizePastedResultValue,
  parseSpreadsheetPasteText,
  PasteUndoStack,
  planSpreadsheetPaste,
  WriteGuardContext,
} from './sop-paste-undo';

function makeGrid(initial: Record<string, Record<string, any>>, unassigned = new Set<string>(), lockedRows = new Set<string>()): {
  grid: GridPasteGridSpec;
  data: Record<string, Record<string, any>>;
} {
  const data = JSON.parse(JSON.stringify(initial));
  const rows = Object.keys(data).map(rowKey => ({ rowKey, rowLabel: rowKey }));
  const columns = [
    { colKey: 'loSo', colLabel: 'Số lọ' },
    { colKey: 'kqFip', colLabel: 'Fipronil' },
    { colKey: 'kqClp', colLabel: 'Chlorpyrifos' },
    { colKey: 'ghiChu', colLabel: 'Ghi chú' },
  ];

  const grid: GridPasteGridSpec = {
    rows,
    columns,
    startRowIndex: 0,
    startColIndex: 1,
    minNumericValue: 0,
    allowTextNotesForCol: colKey => colKey === 'ghiChu' || colKey === 'loSo',
    getCellSpec: (rowKey, colKey) => ({
      rowKey,
      rowLabel: rowKey,
      colKey,
      colLabel: colKey,
      editable: !lockedRows.has(rowKey),
      assigned: colKey === 'ghiChu' || colKey === 'loSo' ? true : !unassigned.has(`${rowKey}:${colKey}`),
    }),
    readCell: (rowKey, colKey) => ({ value: String(data[rowKey]?.[colKey] ?? '') }),
  };
  return { grid, data };
}

const EDITABLE_GUARD: WriteGuardContext = {
  canEdit: true,
  isReadOnly: false,
  isLockedByOthers: false,
  isCompleted: false,
};

test('parseSpreadsheetPasteText handles CRLF, LF, tabs and trailing blank line', () => {
  const parsed = parseSpreadsheetPasteText('1,25\tND\r\nKPH\t<LOQ\r\n');
  assert.deepEqual(parsed, [
    ['1,25', 'ND'],
    ['KPH', '<LOQ'],
  ]);
});

test('normalizePastedResultValue handles Vietnamese decimals, ND, KPH, <LOQ and negative bounds', () => {
  assert.deepEqual(normalizePastedResultValue('1,25'), {
    kind: 'numeric',
    normalizedValue: '1.25',
    ndFlag: false,
    numericValue: 1.25,
  });
  assert.deepEqual(normalizePastedResultValue('1.250,5'), {
    kind: 'numeric',
    normalizedValue: '1250.5',
    ndFlag: false,
    numericValue: 1250.5,
  });
  assert.equal(normalizePastedResultValue('KPH').normalizedValue, 'ND');
  assert.equal(normalizePastedResultValue('ND', { isNdMode: true }).ndFlag, true);
  assert.equal(normalizePastedResultValue('<0,5').normalizedValue, '<0.5');
  assert.equal(normalizePastedResultValue('-2', { minNumericValue: 0 }).kind, 'invalid');
  assert.equal(normalizePastedResultValue('abc').kind, 'invalid');
});

test('planSpreadsheetPaste skips unassigned cells and tracks overwrites & out-of-bounds', () => {
  const { grid } = makeGrid(
    {
      M01: { kqFip: '2.5', kqClp: '' },
      M02: { kqFip: '', kqClp: '' },
    },
    new Set(['M02:kqClp'])
  );

  const matrix = [
    ['3.1', 'ND', 'ok note'],
    ['<LOQ', '9.9', 'note 2'],
    ['1.0', '2.0', 'extra row'],
  ];

  const plan = planSpreadsheetPaste(matrix, grid, EDITABLE_GUARD);
  assert.equal(plan.allowed, true);
  assert.equal(plan.overwriteCount, 1);
  assert.equal(plan.skippedUnassigned.length, 1);
  assert.equal(plan.skippedUnassigned[0].rowKey, 'M02');
  assert.equal(plan.skippedUnassigned[0].colKey, 'kqClp');
  assert.equal(plan.ignoredOutOfBoundsCount, 3);
  assert.equal(plan.diffs.length, 5);
});

test('applyPasteTransaction & PasteUndoStack apply atomically and undo with guard & revision checks', () => {
  const { grid, data } = makeGrid({
    M01: { kqFip: '1.5', kqClp: '' },
    M02: { kqFip: 'ND', kqClp: '' },
  });

  const plan = planSpreadsheetPaste([['4.2', 'ND'], ['0.5', '1.1']], grid, EDITABLE_GUARD);
  const stack = new PasteUndoStack();
  const applyRes = applyPasteTransaction(
    plan,
    EDITABLE_GUARD,
    10,
    (rowKey, colKey, val) => {
      data[rowKey][colKey] = val;
    },
    'Dán 4 ô'
  );

  assert.equal(applyRes.applied, true);
  assert.equal(applyRes.nextRevision, 11);
  assert.equal(data['M01']['kqFip'], '4.2');
  assert.equal(data['M02']['kqClp'], '1.1');
  stack.push(applyRes.transaction!);

  // Reject Undo if locked by others
  const lockedUndo = stack.undoLast(
    { ...EDITABLE_GUARD, isLockedByOthers: true },
    11,
    (r, c) => grid.readCell(r, c),
    (r, c, v) => {
      data[r][c] = v;
    }
  );
  assert.equal(lockedUndo.undone, false);
  assert.equal(data['M01']['kqFip'], '4.2');

  // Reject Undo if revision advanced due to subsequent manual edit
  const staleRevUndo = stack.undoLast(
    EDITABLE_GUARD,
    12,
    (r, c) => grid.readCell(r, c),
    (r, c, v) => {
      data[r][c] = v;
    }
  );
  assert.equal(staleRevUndo.undone, false);

  // Clean Undo succeeds and restores prior values
  const okUndo = stack.undoLast(
    EDITABLE_GUARD,
    11,
    (r, c) => grid.readCell(r, c),
    (r, c, v) => {
      data[r][c] = v;
    }
  );
  assert.equal(okUndo.undone, true);
  assert.equal(okUndo.restoredCount, 4);
  assert.equal(data['M01']['kqFip'], '1.5');
  assert.equal(data['M02']['kqFip'], 'ND');
  assert.equal(data['M02']['kqClp'], '');
  assert.equal(stack.size, 0);
});

test('planSpreadsheetPaste & Undo block writes when completed or read-only', () => {
  const { grid } = makeGrid({ M01: { kqFip: '', kqClp: '' } });
  const plan = planSpreadsheetPaste([['1.0']], grid, { ...EDITABLE_GUARD, isCompleted: true });
  assert.equal(plan.allowed, false);
  assert.match(plan.blockedReason || '', /hoàn thành|mở khóa/i);

  const planRO = planSpreadsheetPaste([['1.0']], grid, { ...EDITABLE_GUARD, isReadOnly: true });
  assert.equal(planRO.allowed, false);
});

test('GridPasteController coordinates preview, confirm, undo and revision safety', () => {
  const { data, grid } = makeGrid({
    M01: { kqFip: '2.0', kqClp: '' },
    M02: { kqFip: '', kqClp: '' },
  });
  const writeCell = (r: string, c: string, v: string) => {
    data[r][c] = v;
  };
  const readCell = (r: string, c: string) => grid.readCell(r, c);
  const ctrl = new GridPasteController();

  // Single new empty cell applies immediately without preview
  const immediate = ctrl.planOrApply('3.5', grid, EDITABLE_GUARD, writeCell);
  assert.equal(immediate.applied, false); // M01/kqFip has '2.0' -> triggers preview because overwriteCount === 1
  assert.equal(immediate.previewNeeded, true);
  assert.ok(ctrl.pendingPlan);

  const confirmed = ctrl.confirmPending(EDITABLE_GUARD);
  assert.equal(confirmed.applied, true);
  assert.equal(data['M01']['kqFip'], '3.5');
  assert.equal(ctrl.undoStack.size, 1);

  // Undo restores '2.0'
  const undone = ctrl.undoLast(EDITABLE_GUARD, readCell, writeCell);
  assert.equal(undone.undone, true);
  assert.equal(data['M01']['kqFip'], '2.0');

  // Re-apply and bumpRevision simulates manual user edit invalidating prior paste Undo
  const second = ctrl.planOrApply('4.5', { ...grid, startRowIndex: 1 }, EDITABLE_GUARD, writeCell);
  assert.equal(second.applied, true);
  assert.equal(data['M02']['kqFip'], '4.5');
  ctrl.bumpRevision();
  const blockedUndo = ctrl.undoLast(EDITABLE_GUARD, readCell, writeCell);
  assert.equal(blockedUndo.undone, false);
});
