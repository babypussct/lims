import assert from 'node:assert/strict';
import test from 'node:test';
import { CalculatedItem, Sop } from '../../core/models/sop.model';
import {
  applyNeedsToStockLedger,
  buildAnalysisTaskKey,
  countUnavailableStockItems,
  getSopTargetKey,
  isSopMatrixCompatible,
  parseUniqueSampleCodes,
  validateCalculatedItems
} from './smart-batch.utils';

function makeSop(overrides: Partial<Sop> = {}): Sop {
  return {
    id: 'sop-1',
    category: 'Test',
    name: 'SOP Test',
    inputs: [],
    variables: {},
    consumables: [],
    targets: [{ id: 'legacy-target-id', name: 'Acephate' }],
    ...overrides
  };
}

function makeSimpleItem(overrides: Partial<CalculatedItem> = {}): CalculatedItem {
  return {
    name: 'solvent-a',
    formula: '1',
    unit: 'ml',
    type: 'simple',
    totalQty: 1,
    stockNeed: 1,
    stockUnit: 'ml',
    isComposite: false,
    breakdown: [],
    ...overrides
  };
}

test('normalizes and de-duplicates sample codes while preserving the first display form', () => {
  assert.deepEqual(
    parseUniqueSampleCodes(' A01 \nA01\na01\n\nB02\r\n b02 '),
    ['A01', 'B02']
  );
});

test('uses canonical sample and target identities for task keys', () => {
  assert.equal(buildAnalysisTaskKey(' A01 ', 'Acephate'), buildAnalysisTaskKey('a01', 'acephate'));
  assert.equal(getSopTargetKey(makeSop().targets![0]), 'acephate');
});

test('enforces matrix tags but keeps explicitly universal SOPs compatible', () => {
  assert.equal(isSopMatrixCompatible(makeSop({ matrixTags: ['food'] }), 'food'), true);
  assert.equal(isSopMatrixCompatible(makeSop({ matrixTags: ['food'] }), 'water'), false);
  assert.equal(isSopMatrixCompatible(makeSop({ matrixTags: [] }), 'water'), true);
});

test('blocks negative needs, formula failures, unit mismatches and invalid margins', () => {
  const issues = validateCalculatedItems([
    makeSimpleItem({
      stockNeed: -1,
      validationError: 'Lỗi công thức',
      displayWarning: '(Khác ĐV: ml != g)'
    })
  ], 150);

  assert.deepEqual(
    new Set(issues.map(issue => issue.code)),
    new Set(['INVALID_AMOUNT', 'FORMULA_ERROR', 'UNIT_MISMATCH', 'INVALID_MARGIN'])
  );
});

test('scores quantity shortages and applies needs to a planning ledger', () => {
  const items = [makeSimpleItem({ stockNeed: 6 })];
  const ledger = { 'solvent-a': 5 };
  assert.equal(countUnavailableStockItems(items, ledger), 1);
  applyNeedsToStockLedger(items, ledger);
  assert.equal(ledger['solvent-a'], -1);
});
