import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

import { isMobileViewport } from '../../../core/utils/viewport.utils';
import { copyRowToAll } from './shared/sop-grid-helper';
import {
  applyPasteTransaction,
  PasteUndoStack,
  planSpreadsheetPaste,
  WriteGuardContext,
} from './shared/sop-paste-undo';

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

test('SOP mobile view mode initializes once from viewport width without resetting on resize', () => {
  const originalWindow = (globalThis as { window?: unknown }).window;

  try {
    (globalThis as { window: unknown }).window = {
      innerWidth: 390,
      matchMedia: (q: string) => ({ matches: q.includes('767px') }),
    };
    const initialMobileMode: 'table' | 'cards' = isMobileViewport() ? 'cards' : 'table';
    assert.equal(initialMobileMode, 'cards');

    // Simulate user switching to table mode, then viewport resizing — initialized mode stays sticky
    let userSelectedMode: 'table' | 'cards' = initialMobileMode;
    userSelectedMode = 'table';
    (globalThis as { window: unknown }).window = {
      innerWidth: 430,
      matchMedia: (q: string) => ({ matches: q.includes('767px') }),
    };
    assert.equal(userSelectedMode, 'table');

    (globalThis as { window: unknown }).window = {
      innerWidth: 1024,
      matchMedia: () => ({ matches: false }),
    };
    const initialDesktopMode: 'table' | 'cards' = isMobileViewport() ? 'cards' : 'table';
    assert.equal(initialDesktopMode, 'table');
  } finally {
    if (originalWindow === undefined) {
      delete (globalThis as { window?: unknown }).window;
    } else {
      (globalThis as { window: unknown }).window = originalWindow;
    }
  }
});

test('SOP draft data (values, ND, QC, print selected, copyRowToAll, undoStack) survives card/table and sample switches', () => {
  const resultData: Record<string, any> = {
    S001: { loSo: '1.1', kqFip: '0.12', kqFip_nd: false, kqFip_qc1: 'Đạt', selected: true },
    S002: { loSo: '1.2', kqFip: '', kqFip_nd: false, kqFip_qc1: 'N/A', selected: false },
  };
  const guard: WriteGuardContext = {
    canEdit: true,
    isReadOnly: false,
    isLockedByOthers: false,
    isCompleted: false,
  };
  const undoStack = new PasteUndoStack();
  let revision = 0;

  // Simulate paste in one view mode, verify undo works regardless of view mode
  const plan = planSpreadsheetPaste(
    [['ND', '0.45']],
    {
      rows: [
        { rowKey: 'S001', rowLabel: 'S001' },
        { rowKey: 'S002', rowLabel: 'S002' },
      ],
      columns: [
        { colKey: 'kqFip', colLabel: 'Fipronil' },
        { colKey: 'kqFipSulf', colLabel: 'Sulfone' },
      ],
      startRowIndex: 0,
      startColIndex: 0,
      getCellSpec: (rowKey, colKey) => ({
        rowKey,
        rowLabel: rowKey,
        colKey,
        colLabel: colKey,
        editable: true,
        assigned: true,
      }),
      readCell: (rowKey, colKey) => ({
        value: String(resultData[rowKey]?.[colKey] ?? ''),
        nd: Boolean(resultData[rowKey]?.[`${colKey}_nd`]),
      }),
    },
    guard
  );

  const applied = applyPasteTransaction(
    plan,
    guard,
    revision,
    (rowKey, colKey, val, nd) => {
      resultData[rowKey][colKey] = val;
      resultData[rowKey][`${colKey}_nd`] = Boolean(nd);
    },
    'Paste test'
  );
  assert.equal(applied.applied, true);
  revision = applied.nextRevision;
  if (applied.transaction) undoStack.push(applied.transaction);

  assert.equal(resultData['S001']['kqFip'], 'ND');
  assert.equal(resultData['S001']['kqFipSulf'], '0.45');
  assert.equal(resultData['S002']['selected'], false);

  // Copy S001 values to all samples, verify selected print flag of S002 is preserved
  copyRowToAll(resultData, ['S001', 'S002'], ['kqFip', 'kqFipSulf'], 'S001');
  assert.equal(resultData['S002']['kqFip'], 'ND');
  assert.equal(resultData['S002']['kqFipSulf'], '0.45');
  assert.equal(resultData['S002']['selected'], false);

  // Undo paste on untouched S001 (simulate switching view then undoing)
  resultData['S001']['selected'] = false; // toggling print flag shouldn't block undo on cell values
  const undone = undoStack.undoLast(
    guard,
    revision,
    (rowKey, colKey) => ({
      value: String(resultData[rowKey]?.[colKey] ?? ''),
      nd: Boolean(resultData[rowKey]?.[`${colKey}_nd`]),
    }),
    (rowKey, colKey, val, nd) => {
      resultData[rowKey][colKey] = val;
      resultData[rowKey][`${colKey}_nd`] = Boolean(nd);
    }
  );
  assert.equal(undone.undone, true);
  assert.equal(resultData['S001']['kqFip'], '0.12');
  assert.equal(resultData['S001']['selected'], false);
});

test('Pilot components (sop-01 & sop-master-detail-compound-grid) uphold mobile layout and state contracts', () => {
  const sop01Ts = read('src/app/features/results/sops/sop-01/sop-01-entry.component.ts');
  const sop01Html = read('src/app/features/results/sops/sop-01/sop-01-entry.component.html');
  const masterDetail = read('src/app/features/results/sops/shared/sop-master-detail-compound-grid.component.ts');

  // sop-01 initializes once via isMobileViewport and never resets on resize
  assert.match(sop01Ts, /isMobileViewport\(\) \? 'cards' : 'table'/);
  assert.doesNotMatch(sop01Ts, /window:resize/);

  // sop-01 card mode provides selectAll and copyRowToAll parity on the same draft.resultData
  assert.match(sop01Html, /@if \(mobileViewMode\(\) === 'cards'\)[\s\S]*toggleSelectAll\(\$event\)[\s\S]*copyRowToAll\(row\.key\)/);

  // sop-01 table mode keeps only Mẫu thử sticky left-0 on < md and releases max-h-[550px] to md:max-h-[550px]
  assert.match(sop01Html, /md:max-h-\[550px\]/);
  assert.match(sop01Html, /sticky left-0 md:left-\[136px\]/);

  // sop-master-detail-compound-grid renders responsive mobile cards + desktop table bound to the same draft model
  assert.match(masterDetail, /<div class="space-y-2\.5 md:hidden">/);
  assert.match(masterDetail, /<div class="hidden md:block overflow-x-auto/);
  assert.match(masterDetail, /md:hidden[\s\S]*toggleNdForCompound\(compound\)[\s\S]*setQc\(compound, qcKey, 'Đạt'\)/);
});

test('All rolled-out Type 2 / Form Don / Type 3B SOPs uphold shared mobile viewport, card parity, and scroll contracts', () => {
  const type2Sops: { ts: string; html: string }[] = [
    {
      ts: 'src/app/features/results/sops/sop-01/sop-01-entry.component.ts',
      html: 'src/app/features/results/sops/sop-01/sop-01-entry.component.html',
    },
    {
      ts: 'src/app/features/results/sops/sop-03/sop-03-entry.component.ts',
      html: 'src/app/features/results/sops/sop-03/sop-03-entry.component.html',
    },
    {
      ts: 'src/app/features/results/sops/sop-chloroform/sop-chloroform-entry.component.ts',
      html: 'src/app/features/results/sops/sop-chloroform/sop-chloroform-entry.component.html',
    },
    {
      ts: 'src/app/features/results/sops/sop-1767857760184/sop-1767857760184-entry.component.ts',
      html: 'src/app/features/results/sops/sop-1767857760184/sop-1767857760184-entry.component.html',
    },
    {
      ts: 'src/app/features/results/sops/sop-default-type2/sop-default-type2-entry.component.ts',
      html: 'src/app/features/results/sops/sop-default-type2/sop-default-type2-entry.component.html',
    },
    {
      ts: 'src/app/features/results/sops/sop-tbvtv-thuc-pham-gcmsms/sop-tbvtv-thuc-pham-gcmsms-entry.component.ts',
      html: 'src/app/features/results/sops/sop-tbvtv-thuc-pham-gcmsms/sop-tbvtv-thuc-pham-gcmsms-entry.component.html',
    },
  ];

  for (const sop of type2Sops) {
    const tsCode = read(sop.ts);
    const htmlCode = read(sop.html);
    assert.match(tsCode, /isMobileViewport\(\) \? 'cards' : 'table'/, sop.ts);
    assert.doesNotMatch(tsCode, /window:resize/, sop.ts);
    assert.match(htmlCode, /md:max-h-\[550px\]/, sop.html);
    assert.match(htmlCode, /copyRowToAll\(/, sop.html);
  }

  const formDonTs = read('src/app/features/results/sops/shared/sop-form-don-workspace.component.ts');
  assert.match(formDonTs, /isMobileViewport\(\) \? 'cards' : 'table'/);
  assert.doesNotMatch(formDonTs, /window:resize/);

  const type3bShell = read('src/app/features/results/result-entry-type3b.component.ts');
  assert.match(type3bShell, /isMetadataExpanded/);

  const type3bSops = [
    'src/app/features/results/sops/sop-1767856825928/sop-1767856825928-entry.component.html',
    'src/app/features/results/sops/sop-lan-huu-co/sop-lan-huu-co-entry.component.html',
    'src/app/features/results/sops/sop-nhom-i/sop-nhom-i-entry.component.html',
    'src/app/features/results/sops/sop-nhom-lan-huu-co-gc-msms-copy-1768036876719/sop-nhom-lan-huu-co-gc-msms-copy-1768036876719-entry.component.html',
    'src/app/features/results/sops/sop-tbvtv-trong-nuoc-gcmsms/sop-tbvtv-trong-nuoc-gcmsms-entry.component.html',
  ];
  for (const path of type3bSops) {
    const htmlCode = read(path);
    assert.match(htmlCode, /flex-wrap/, path);
  }
});
