import assert from 'node:assert/strict';
import test from 'node:test';
import { buildDutyGeminiPrompt, buildDutyGeminiVerificationPrompt, compareDutyImportRuns, DUTY_TSV_HEADER, parseDutyTsv } from './duty-tsv-import';

const staff = ['Huynh', 'Huỳnh', 'Đạt (O)', 'Đạt (N)', 'Dĩ', 'Bến', 'Thành'].map((displayName, i) => ({ id: String(i), displayName, active: true }));
const parse = (body: string, people = staff) => parseDutyTsv(`${DUTY_TSV_HEADER}\n${body}`, '2026-09', people);
test('TSV preserves distinct identities, order, Vietnamese Unicode and blank note', () => {
  const result = parse('2026-09-01\tHuynh | Huỳnh | Đạt (O) | Đạt (N)\t18:00\t\n2026-09-02\tDĩ | Bến | Thành\t19:30\tGhi chú'.normalize('NFD'));
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.rows.map(row => row.errors), [[], []]);
  assert.deepEqual(result.rows[0].staffIds, ['0', '1', '2', '3']);
  assert.deepEqual(result.rows[1].staffIds, ['4', '5', '6']);
});
test('TSV accepts BOM, CRLF, copied TSV fence and a plain Gemini tsv label', () => {
  const value = '\uFEFF```tsv\r\n' + DUTY_TSV_HEADER + '\r\n2026-09-01\tHuynh\t18:00\t\r\n```';
  const result = parseDutyTsv(value, '2026-09', staff);
  assert.equal(result.rows.length, 1); assert.deepEqual(result.errors, []); assert.deepEqual(result.rows[0].errors, []);
  const plain = parseDutyTsv(`tsv\n\n${DUTY_TSV_HEADER}\n2026-09-02\tHuỳnh\t18:00\t`, '2026-09', staff);
  assert.equal(plain.rows.length, 1); assert.deepEqual(plain.errors, []); assert.deepEqual(plain.rows[0].errors, []);
});
test('TSV rejects duplicates on both rows and out-of-month or impossible dates', () => {
  const result = parse('2026-09-01\tHuynh\t18:00\n2026-09-01\tHuỳnh\t18:00\n2026-09-31\tDĩ\t18:00\n2026-08-31\tBến\t18:00');
  assert.ok(result.rows.every(row => row.errors.length));
});
test('TSV never guesses unknown, ambiguous, inactive or repeated staff', () => {
  for (const names of ['Huyn', 'Huynh | Huynh', '']) assert.ok(parse(`2026-09-01\t${names}\t18:00`).rows[0].errors.length);
  assert.ok(parse('2026-09-01\tHuynh\t18:00', [...staff, { id: 'another', displayName: 'Huynh', active: true }]).rows[0].errors.length);
  assert.ok(parse('2026-09-01\tHuynh\t18:00', staff.map(row => ({ ...row, active: false }))).rows[0].errors.length);
});
test('TSV keeps uncertain assignees as warnings instead of inventing staff identities', () => {
  const result = parse('2026-09-16\tDĩ | ?\t18:00\tCHƯA RÕ\n2026-09-18\tBến | Đạt (?)\t18:00\tCHƯA RÕ');
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.rows.map(row => row.errors), [[], []]);
  assert.deepEqual(result.rows[0].staffIds, ['4']);
  assert.deepEqual(result.rows[0].unresolvedAssignees, ['?']);
  assert.deepEqual(result.rows[1].staffIds, ['5']);
  assert.deepEqual(result.rows[1].unresolvedAssignees, ['Đạt (?)']);
  assert.ok(result.rows.every(row => row.warnings.length > 0));
});
test('TSV rejects malformed delimiter, time and overly long note', () => {
  assert.ok(parseDutyTsv('date,assignees,startTime,note\n2026-09-01,Huynh,18:00,', '2026-09', staff).errors.length);
  for (const row of ['2026-09-01\tHuynh\t24:00', '2026-09-01\tHuynh\t18:00\ta\tb', '2026-09-01\tHuynh\t18:00\t' + 'x'.repeat(1001)]) assert.ok(parse(row).rows[0].errors.length);
  const uncertainNote = parse('2026-09-01\tHuynh\t18:00\tCHƯA RÕ');
  assert.deepEqual(uncertainNote.rows[0].errors, []);
  assert.ok(uncertainNote.rows[0].warnings.length > 0);
  assert.match(uncertainNote.rows[0].warnings[0], /thông tin ca chưa rõ/i);
  assert.doesNotMatch(uncertainNote.rows[0].warnings[0], /1 vị trí chưa xác định/i);
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

test('verification prompt forces a fresh image-first recognition run instead of reviewing the first TSV', () => {
  const prompt = buildDutyGeminiVerificationPrompt('2027-01', staff);
  assert.ok(prompt.includes(DUTY_TSV_HEADER));
  assert.ok(prompt.includes('2027-01'));
  assert.match(prompt, /lượt đọc ảnh MỚI/i);
  assert.match(prompt, /KHÔNG sử dụng, tái tạo, suy luận hoặc cố khớp/i);
  assert.match(prompt, /Chỉ căn cứ vào những gì nhìn thấy trực tiếp trong ảnh/i);
  assert.match(prompt, /KHÔNG được dùng để đoán một ô mờ/i);
  assert.match(prompt, /Không nhận xét TSV của lần khác/i);
});

test('dual Gemini verification accepts semantically identical TSV even when row order changes', () => {
  const first = parse('2026-09-01\tHuynh | Huỳnh\t18:00\t\n2026-09-03\tĐạt (O) | Dĩ\t19:00\tGhi chú');
  const second = parse('2026-09-03\tĐạt (O) | Dĩ\t19:00\tGhi chú\n2026-09-01\tHuynh | Huỳnh\t18:00\t');
  assert.deepEqual(compareDutyImportRuns(first.rows, second.rows), []);
});

test('dual Gemini verification reports missing dates, staff order, time and note drift', () => {
  const first = parse('2026-09-01\tHuynh | Huỳnh\t18:00\tA\n2026-09-02\tĐạt (O) | Dĩ\t19:00\tB');
  const second = parse('2026-09-01\tHuỳnh | Huynh\t18:30\tKhác\n2026-09-03\tĐạt (N)\t18:00\t');
  const mismatches = compareDutyImportRuns(first.rows, second.rows);
  assert.ok(mismatches.some(message => message.includes('danh sách hoặc thứ tự người trực khác')));
  assert.ok(mismatches.some(message => message.includes('giờ bắt đầu khác')));
  assert.ok(mismatches.some(message => message.includes('ghi chú khác')));
  assert.ok(mismatches.some(message => message.includes('2026-09-02: thiếu')));
  assert.ok(mismatches.some(message => message.includes('2026-09-03: chỉ xuất hiện')));
});
