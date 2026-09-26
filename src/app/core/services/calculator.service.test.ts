import assert from 'node:assert/strict';
import test from 'node:test';
import { Sop } from '../models/sop.model';
import { CalculatorService } from './calculator.service';

function makeSop(formula: string, condition?: string): Sop {
  return {
    id: 'formula-test',
    category: 'Test',
    name: 'Formula Test',
    inputs: [
      { var: 'n_sample', label: 'Số mẫu', type: 'number', default: 1 },
      {
        var: 'mode',
        label: 'Chế độ',
        type: 'select',
        default: 'a.b',
        options: [{ label: 'A', value: 'a.b' }]
      }
    ],
    variables: {},
    targets: [],
    consumables: [{
      name: 'water',
      formula,
      condition,
      unit: 'ml',
      type: 'simple'
    }]
  };
}

test('allows arithmetic, Math/Chem helpers and string comparisons', () => {
  const service = new CalculatorService();
  const result = service.calculateSopNeeds(
    makeSop('Math.max(n_sample * 2, Chem.round(1.234, 1))', "mode === 'a.b'"),
    { n_sample: 3, mode: 'a.b' }
  );

  assert.equal(result.length, 1);
  assert.equal(result[0].totalQty, 6);
  assert.equal(result[0].validationError, undefined);
});

test('rejects formulas that can reach browser or Function globals', () => {
  const service = new CalculatorService();
  for (const formula of [
    'globalThis.fetch("https://example.com")',
    'Math.constructor("return 1")()',
    'n_sample = 100',
    'this'
  ]) {
    const result = service.calculateSopNeeds(makeSop(formula), { n_sample: 1, mode: 'a.b' });
    assert.equal(result[0].validationError, 'Lỗi công thức', formula);
    assert.equal(result[0].stockNeed, 0, formula);
  }
});

test('supports comparisons, logical operators, ternaries, exponentiation and safe Math constants', () => {
  const service = new CalculatorService();
  const result = service.calculateSopNeeds(
    makeSop("mode === 'a.b' && n_sample >= 2 ? Math.round(Math.PI) + 2 ** 3 : 0"),
    { n_sample: 2, mode: 'a.b' }
  );
  assert.equal(result[0].totalQty, 11);
});

test('rejects computed properties, arbitrary calls and unsupported syntax without executing it', () => {
  const service = new CalculatorService();
  for (const formula of [
    'Math["max"](1, 2)',
    'Math.random()',
    'constructor.constructor("return 1")()',
    'n_sample++;',
    '({a:1})'
  ]) {
    const result = service.calculateSopNeeds(makeSop(formula), { n_sample: 1, mode: 'a.b' });
    assert.equal(result[0].validationError, 'Lỗi công thức', formula);
  }
});
