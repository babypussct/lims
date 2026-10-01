import assert from 'node:assert/strict';
import test from 'node:test';
import { calculatePrep } from './prep-calculation.engine';
import { buildPrepPrintDocument } from './prep-print-document';
import { ConcentrationDraft, PrepDraft, QuantityDraft, SeriesTaskDraft } from './prep-domain.types';

const volume = (value: number): QuantityDraft => ({ value, unit: 'mL', dimension: 'volume' });
const mass = (value: number): QuantityDraft => ({ value, unit: 'g', dimension: 'mass' });
const c = (value: number, basis: ConcentrationDraft['basis'] = 'mass_per_volume'): ConcentrationDraft => ({ value, unit: 'ppm', basis });
const series: SeriesTaskDraft = {
  mode: 'series', strategy: 'direct', residualPercent: 10,
  sources: [{ id: 'internal-root', name: 'Chuẩn gốc', concentration: c(100) }],
  points: [{ id: 'p1', label: 'Điểm 1', objectType: 'standard', sourceId: 'internal-root', targetConcentration: c(1), finalVolume: volume(10), actualSourceQuantity: volume(0.11) },
    { id: 'blank', label: 'Mẫu trắng', objectType: 'blank', sourceId: 'internal-root', targetConcentration: c(0), finalVolume: volume(10) }],
  components: [], additions: [],
};
const drafts: PrepDraft[] = [
  { mode: 'target', sourceType: 'solution', substance: { name: 'Chuẩn A' }, sourceConcentration: c(100), targetConcentration: c(1), finalVolume: volume(10), actualQuantity: null },
  { mode: 'concentration', sourceType: 'solid', substance: { name: 'NaCl', potencyPercent: 99, conversionFactor: 1 }, plannedQuantity: mass(1), actualQuantity: mass(0.98), finalVolume: volume(100) },
  { mode: 'spike', matrix: 'solid', location: 'sample_initial', semantic: 'added_on_initial', standardName: 'Chuẩn B', sampleName: 'Mẫu B', standard: c(100), target: c(1, 'mass_per_mass'), sampleQuantity: mass(10) },
  series,
  { mode: 'result_conversion', sampleName: 'Mẫu C', sampleBase: 'mass', sampleAmount: mass(10), instrument: c(1), resultUnit: 'mg/kg', steps: [{ id: 'extract', label: 'Chiết mẫu', type: 'extract', volume: volume(10) }, { id: 'aliquot', label: 'Lấy dịch', type: 'aliquot', volume: volume(1) }, { id: 'dilution', label: 'Pha loãng', type: 'dilution', volume: volume(10) }] },
];
for (const draft of drafts) {
  test(`print adapter preserves ${draft.mode} calculations, formulas, issues and missing metadata`, () => {
    const calculation = calculatePrep(draft);
    assert.equal(calculation.status, 'valid', JSON.stringify(calculation.issues));
    const before = JSON.stringify({ draft, calculation });
    calculation.issues.push({ code: 'review', severity: 'warning', path: 'test', message: 'Cần kiểm tra theo SOP', suggestedAction: 'Kiểm tra thiết bị' });
    const document = buildPrepPrintDocument(draft, calculation, [['SOP', 'SOP-01 v2'], ['Thiết bị thực dùng', '']]);
    assert.equal(document.sections.find(section => section.title === 'Công thức và phép thế số')?.rows.length, calculation.trace.length);
    assert.match(JSON.stringify(document), /Cần kiểm tra theo SOP/);
    assert.match(JSON.stringify(document), /Kiểm tra thiết bị/);
    assert.match(JSON.stringify(document), /SOP-01 v2/);
    assert.equal(document.sections[0].rows[1].cells[1], '________________');
    calculation.issues.pop();
    assert.equal(JSON.stringify({ draft, calculation }), before);
    assert.ok(document.sections.some(section => section.title === 'Xác nhận thực hiện theo SOP'));
  });
}
test('series print preserves blank zero values, actual source quantities and display names', () => {
  const document = buildPrepPrintDocument(series, calculatePrep(series), []);
  const rows = document.sections.find(section => section.title.startsWith('Các điểm'))!.rows;
  assert.match(rows[0].cells[3], /0,11 mL/);
  assert.match(rows[1].cells[2], /^0 mL/);
  assert.match(rows[1].cells[1], /^0 ppm/);
  assert.doesNotMatch(document.sections.flatMap(section => section.rows.flatMap(row => row.cells)).join('\n'), /internal-root/);
});
test('incomplete, invalid and mismatched results cannot be presented as a valid printable calculation', () => {
  const draft = drafts[0];
  const calculation = calculatePrep(draft);
  assert.throws(() => buildPrepPrintDocument(draft, { ...calculation, status: 'incomplete' }, []));
  assert.throws(() => buildPrepPrintDocument(draft, { ...calculation, status: 'invalid' }, []));
  assert.throws(() => buildPrepPrintDocument(drafts[1], calculation, []));
});
test('print retains selected molar concentration units when the calculation provides them', () => {
  const draft: PrepDraft = { mode: 'concentration', sourceType: 'solid', substance: { name: 'Chuẩn mol', potencyPercent: 100, molecularWeight: 100, conversionFactor: 1 }, plannedQuantity: mass(1), actualQuantity: mass(1), finalVolume: volume(100) };
  const document = buildPrepPrintDocument(draft, calculatePrep(draft), [], new Date(), 'M');
  const row = document.sections.find(section => section.title === 'Lượng pha và ghi nhận thực hiện')!.rows[2];
  assert.equal(row.cells[2], '0,1 M');
});
test('addition scope, exceptions and final-volume accounting match the engine default', () => {
  const draft: SeriesTaskDraft = { ...series, additions: [{ id: 'is', type: 'internal_standard', name: 'Nội chuẩn IS', sourceId: 'internal-root', source: c(100), fixedVolume: volume(0.1), applicationScope: ['standard', 'blank'], exceptions: ['blank'] }] };
  const calculation = calculatePrep(draft);
  assert.equal(calculation.status, 'valid');
  const document = buildPrepPrintDocument(draft, calculation, []);
  const added = document.sections.find(section => section.title === 'Nội chuẩn, chuẩn đồng hành và phần thêm')!;
  assert.equal(added.rows.length, 1);
  assert.match(added.rows[0].cells[0], /Điểm 1/);
  assert.doesNotMatch(added.rows[0].cells[0], /Mẫu trắng/);
  const rules = document.sections.find(section => section.title === 'Quy tắc áp dụng phần thêm')!.rows[0].cells[1];
  assert.match(rules, /Ngoại lệ: Mẫu trắng/);
  assert.match(rules, /Ngoài thể tích cuối/);
});
test('print formats floating-point tails in generated instructions without changing source metadata or calculations', () => {
  const draft: PrepDraft = { mode: 'concentration', sourceType: 'solid', substance: { name: 'Chuẩn A', potencyPercent: 98.5, conversionFactor: 1 }, plannedQuantity: { value: 10.2, unit: 'mg', dimension: 'mass' }, finalVolume: volume(10) };
  const calculation = calculatePrep(draft);
  const before = JSON.stringify(calculation);
  const lot = 'LOT-0.123456789123456';
  const document = buildPrepPrintDocument(draft, calculation, [['Số lô', lot]]);
  assert.equal(document.sections[0].rows[0].cells[1], lot);
  const trace = document.sections.find(section => section.title === 'Công thức và phép thế số')!;
  assert.match(trace.rows[0].cells[1], /0\.0102 g/);
  assert.doesNotMatch(trace.rows[0].cells[1], /999999999/);
  assert.equal(JSON.stringify(calculation), before);
});
