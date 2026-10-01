import assert from 'node:assert/strict';
import { test } from 'node:test';
import { labelSheetError, SAMPLE_TOMY_TEMPLATES, STANDARD_GRID_PRESETS } from './label-paper-catalog';

test('paper catalog preserves both legacy Tomy 145 calibrations and validates printable bounds', () => {
  const sample = SAMPLE_TOMY_TEMPLATES.find(item => item.id === 'tomy_145')!;
  const standard = STANDARD_GRID_PRESETS['tomy_145'];
  assert.equal(sample.cellW, 38);
  assert.equal(standard.width, 38.1);
  assert.equal(labelSheetError({width:standard.width,height:standard.height,cols:standard.cols,rows:standard.rows,left:standard.leftMargin,top:standard.topMargin,gapX:standard.colGap,gapY:standard.rowGap}), null);
});

test('layouts that would clip the last A4 row or column must be corrected before printing', () => {
  assert.match(labelSheetError({width:40,height:14,cols:5,rows:20,left:5,top:8.5,gapX:2.5,gapY:.5})!, /vượt khổ A4/);
  assert.match(labelSheetError({width:70,height:42.5,cols:3,rows:7,left:0,top:0,gapX:0,gapY:0})!, /vượt khổ A4/);
  assert.match(labelSheetError({width:40,height:14,cols:2.5,rows:20,left:5,top:8.5,gapX:0,gapY:0})!, /chưa hợp lệ/);
});
