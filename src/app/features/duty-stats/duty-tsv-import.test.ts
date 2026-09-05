import assert from 'node:assert/strict';
import test from 'node:test';
import { buildDutyGeminiPrompt, DUTY_TSV_HEADER, parseDutyTsv } from './duty-tsv-import';

const staff = ['Huynh', 'Huỳnh', 'Đạt (O)', 'Đạt (N)', 'Dĩ', 'Bến', 'Thành'].map((displayName, i) => ({ id: String(i), displayName, active: true }));
const parse = (body: string, people = staff) => parseDutyTsv(`${DUTY_TSV_HEADER}\n${body}`, '2026-09', people);
test('TSV preserves distinct identities, order, Vietnamese Unicode and blank note', () => {
  const result = parse('2026-09-01\tHuynh | Huỳnh | Đạt (O) | Đạt (N)\t18:00\t\n2026-09-02\tDĩ | Bến | Thành\t19:30\tGhi chú'.normalize('NFD'));
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.rows.map(row => row.errors), [[], []]);
  assert.deepEqual(result.rows[0].staffIds, ['0', '1', '2', '3']);
  assert.deepEqual(result.rows[1].staffIds, ['4', '5', '6']);
});
test('TSV accepts BOM, CRLF and copied TSV fence', () => {
  const value = '\uFEFF```tsv\r\n' + DUTY_TSV_HEADER + '\r\n2026-09-01\tHuynh\t18:00\t\r\n```';
  const result = parseDutyTsv(value, '2026-09', staff);
  assert.equal(result.rows.length, 1); assert.deepEqual(result.errors, []); assert.deepEqual(result.rows[0].errors, []);
});
test('TSV rejects duplicates on both rows and out-of-month or impossible dates', () => {
  const result = parse('2026-09-01\tHuynh\t18:00\n2026-09-01\tHuỳnh\t18:00\n2026-09-31\tDĩ\t18:00\n2026-08-31\tBến\t18:00');
  assert.ok(result.rows.every(row => row.errors.length));
});
test('TSV never guesses unknown, ambiguous, inactive or repeated staff', () => {
  for (const names of ['Huyn', 'Huynh | Huynh', '?', '']) assert.ok(parse(`2026-09-01\t${names}\t18:00`).rows[0].errors.length);
  assert.ok(parse('2026-09-01\tHuynh\t18:00', [...staff, { id: 'another', displayName: 'Huynh', active: true }]).rows[0].errors.length);
  assert.ok(parse('2026-09-01\tHuynh\t18:00', staff.map(row => ({ ...row, active: false }))).rows[0].errors.length);
});
test('TSV rejects malformed delimiter, time, uncertainty and overly long note', () => {
  assert.ok(parseDutyTsv('date,assignees,startTime,note\n2026-09-01,Huynh,18:00,', '2026-09', staff).errors.length);
  for (const row of ['2026-09-01\tHuynh\t24:00', '2026-09-01\tHuynh\t18:00\tCHƯA RÕ', '2026-09-01\tHuynh\t18:00\ta\tb', '2026-09-01\tHuynh\t18:00\t' + 'x'.repeat(1001)]) assert.ok(parse(row).rows[0].errors.length);
});
test('TSV bounds file size, row count and rejects empty imports', () => {
  assert.ok(parseDutyTsv('x'.repeat(100001), '2026-09', staff).errors.length);
  assert.ok(parse('').errors.length);
  assert.ok(parse(Array(32).fill('2026-09-01\tHuynh\t18:00').join('\n')).errors.length);
});
test('fixed prompt updates month and active roster without changing the contract', () => {
  const prompt = buildDutyGeminiPrompt('2027-01', [...staff, { id: 'old', displayName: 'Ngừng trực', active: false }]);
  assert.ok(prompt.includes(DUTY_TSV_HEADER)); assert.ok(prompt.includes('2027-01'));
  for (const person of staff) assert.ok(prompt.includes(person.displayName));
  assert.ok(!prompt.includes('Ngừng trực')); assert.ok(prompt.includes('CHƯA RÕ'));
});
