import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildExcelPreviewContextMenu,
  buildExcelPreviewFilterCriteria,
  classifyExcelPreviewContextTarget,
  getExcelColumnLabel,
  inferExcelPreviewSortKind,
  isExcelPreviewTextEntryElement,
  isSafeExcelHyperlink,
  parseExcelGoToTarget,
  removeExcelPreviewViewChange,
  serializeExcelPreviewGrid,
  upsertExcelPreviewViewChange,
  type ExcelPreviewMenuAction,
} from './excel-viewer-tools';

const capabilities = {
  hasValue: true,
  hasFormula: true,
  hasHyperlink: true,
  hasFilter: true,
  canFilter: true,
  hasMultipleSheets: true,
  gridlinesHidden: false,
  frozen: true,
  sortKind: 'text' as const,
};

test('parses safe A1 go-to targets with optional quoted sheet names', () => {
  assert.deepEqual(parseExcelGoToTarget('B12'), { sheetName: undefined, address: 'B12' });
  assert.deepEqual(parseExcelGoToTarget("'Kết quả 1'!$C$4:$D$9"), {
    sheetName: 'Kết quả 1',
    address: 'C4:D9',
  });
  assert.equal(parseExcelGoToTarget('A0'), undefined);
  assert.equal(parseExcelGoToTarget('DROP TABLE'), undefined);
});

test('serializes displayed, raw or formula grids as tab-separated text', () => {
  assert.equal(
    serializeExcelPreviewGrid([['Mẫu', 12], ['ghi\nchú', null]]),
    'Mẫu\t12\nghi chú\t',
  );
});

test('formats zero-based Excel column indexes and infers contextual sort labels', () => {
  assert.equal(getExcelColumnLabel(0), 'A');
  assert.equal(getExcelColumnLabel(25), 'Z');
  assert.equal(getExcelColumnLabel(26), 'AA');
  assert.equal(getExcelColumnLabel(702), 'AAA');
  assert.equal(getExcelColumnLabel(-1), '');

  assert.equal(inferExcelPreviewSortKind([3, 1, 2]), 'number');
  assert.equal(inferExcelPreviewSortKind(['B', 'A']), 'text');
  assert.equal(inferExcelPreviewSortKind([new Date(2026, 0, 1), new Date(2026, 0, 2)]), 'date');
  assert.equal(inferExcelPreviewSortKind([46257, 46258], 'dd/mm/yyyy'), 'date');
  assert.equal(inferExcelPreviewSortKind([1, 'A']), 'mixed');

  const numberMenu = buildExcelPreviewContextMenu('column', { ...capabilities, sortKind: 'number' });
  assert.ok(numberMenu.some(item => item.label === 'Sắp xếp nhỏ → lớn'));
  assert.ok(numberMenu.some(item => item.label === 'Sắp xếp lớn → nhỏ'));
});

test('keeps text-entry shortcuts local to inputs and textboxes', () => {
  assert.equal(isExcelPreviewTextEntryElement('INPUT'), true);
  assert.equal(isExcelPreviewTextEntryElement('textarea'), true);
  assert.equal(isExcelPreviewTextEntryElement('select'), true);
  assert.equal(isExcelPreviewTextEntryElement('div', true), true);
  assert.equal(isExcelPreviewTextEntryElement('div', false, 'textbox'), true);
  assert.equal(isExcelPreviewTextEntryElement('canvas'), false);
});

test('builds explicit view-only submenus and safe hyperlink decisions', () => {
  const more = buildExcelPreviewContextMenu('more', capabilities);
  const format = more.find(item => item.action === 'submenu-format');
  const layout = more.find(item => item.action === 'submenu-layout');
  assert.ok(format?.submenu?.some(item => item.action === 'align-center'));
  assert.ok(layout?.submenu?.some(item => item.action === 'toggle-gridlines'));
  assert.equal(isSafeExcelHyperlink('https://example.com/a?q=1'), true);
  assert.equal(isSafeExcelHyperlink('mailto:test@example.com'), true);
  assert.equal(isSafeExcelHyperlink('javascript:alert(1)'), false);
  assert.equal(isSafeExcelHyperlink('data:text/html,unsafe'), false);
  assert.equal(isSafeExcelHyperlink('not a URL'), false);
});

test('upserts, bounds and removes temporary view-state without mutating prior state', () => {
  const initial = [
    { id: 'C:zoom', kind: 'zoom' as const, sheetName: 'C', label: 'Zoom 80%' },
    { id: 'EU:filter', kind: 'filter' as const, sheetName: 'EU', label: 'Filter A1:D8' },
  ];
  const replaced = upsertExcelPreviewViewChange(initial, {
    id: 'C:zoom', kind: 'zoom', sheetName: 'C', label: 'Zoom 100%',
  });
  assert.equal(initial[0].label, 'Zoom 80%');
  assert.deepEqual(replaced.map(change => change.id), ['EU:filter', 'C:zoom']);
  assert.equal(replaced[1].label, 'Zoom 100%');

  const bounded = upsertExcelPreviewViewChange(replaced, {
    id: 'C:sort', kind: 'sort', sheetName: 'C', label: 'A → Z',
  }, 2);
  assert.deepEqual(bounded.map(change => change.id), ['C:zoom', 'C:sort']);
  assert.deepEqual(removeExcelPreviewViewChange(bounded, 'zoom', 'C'), [bounded[1]]);
});

test('builds include, exclude, blank and non-blank filter criteria', () => {
  const notEquals = 'not-equals';
  assert.deepEqual(buildExcelPreviewFilterCriteria('include', 2, 'EU', notEquals), {
    colId: 2,
    filters: { filters: ['EU'] },
  });
  assert.deepEqual(buildExcelPreviewFilterCriteria('exclude', 1, 0, notEquals), {
    colId: 1,
    customFilters: { customFilters: [{ val: 0, operator: notEquals }] },
  });
  assert.deepEqual(buildExcelPreviewFilterCriteria('blanks', 3, undefined, notEquals), {
    colId: 3,
    filters: { blank: true },
  });
  assert.deepEqual(buildExcelPreviewFilterCriteria('non-blanks', 4, undefined, notEquals), {
    colId: 4,
    customFilters: { customFilters: [{ val: '', operator: notEquals }] },
  });
});

test('classifies right-click targets without enabling Univer default context menu', () => {
  assert.equal(classifyExcelPreviewContextTarget(200, 10, 1000, 700), 'column');
  assert.equal(classifyExcelPreviewContextTarget(10, 200, 1000, 700), 'row');
  assert.equal(classifyExcelPreviewContextTarget(200, 200, 1000, 700), 'cell');
  assert.equal(classifyExcelPreviewContextTarget(200, 680, 1000, 700), 'sheet');
});

test('returns only the explicit view-only whitelist for each context target', () => {
  const cellActions = buildExcelPreviewContextMenu('cell', capabilities).map(item => item.action);
  const columnActions = buildExcelPreviewContextMenu('column', capabilities).map(item => item.action);
  const rowActions = buildExcelPreviewContextMenu('row', capabilities).map(item => item.action);
  const sheetActions = buildExcelPreviewContextMenu('sheet', capabilities).map(item => item.action);

  assert.ok(cellActions.includes('copy-display'));
  assert.ok(cellActions.includes('filter-by-value'));
  assert.ok(cellActions.includes('filter-blanks'));
  assert.ok(cellActions.includes('fit-selection'));
  assert.ok(cellActions.includes('selection-info'));
  assert.ok(cellActions.includes('open-hyperlink'));
  assert.ok(columnActions.includes('hide-columns'));
  assert.ok(columnActions.includes('set-column-width'));
  assert.ok(columnActions.includes('copy-column-name'));
  assert.ok(rowActions.includes('hide-rows'));
  assert.ok(rowActions.includes('set-row-height'));
  assert.ok(rowActions.includes('copy-row-number'));
  assert.ok(sheetActions.includes('reset-view'));
  assert.ok(sheetActions.includes('sheet-list'));
  assert.ok(sheetActions.includes('zoom-100'));

  const forbidden = new Set<ExcelPreviewMenuAction | string>([
    'set-value', 'paste', 'cut', 'delete', 'insert-row', 'insert-column', 'rename-sheet', 'delete-sheet',
  ]);
  for (const target of ['cell', 'column', 'row', 'sheet', 'more'] as const) {
    const actions = buildExcelPreviewContextMenu(target, capabilities).map(menuItem => menuItem.action);
    assert.equal(actions.some(action => forbidden.has(action)), false);
  }
});

test('disables context actions whose source metadata is absent', () => {
  const items = buildExcelPreviewContextMenu('cell', {
    ...capabilities,
    hasFormula: false,
    hasHyperlink: false,
    hasFilter: false,
    canFilter: false,
  });
  const byAction = new Map(items.map(menuItem => [menuItem.action, menuItem]));
  assert.equal(byAction.get('copy-formulas')?.disabled, true);
  assert.equal(byAction.get('open-hyperlink')?.disabled, true);
  assert.equal(byAction.get('clear-column-filter')?.disabled, true);
  assert.equal(byAction.get('filter-by-value')?.disabled, true);
  assert.equal(byAction.get('copy-formulas')?.disabledReason, 'Vùng đang chọn không có công thức.');
  assert.equal(byAction.get('open-hyperlink')?.disabledReason, 'Ô đang chọn không có liên kết hợp lệ.');
  assert.equal(byAction.get('clear-column-filter')?.disabledReason, 'Cột đang chọn chưa có điều kiện lọc.');
});
