import assert from 'node:assert/strict';
import test from 'node:test';
import { ReferenceStandard } from '../../../core/models/standard.model';
import {
  buildSafeImportMetadata,
  countAtomicStandardImportWrites,
  isActiveStandardIdentity,
  normalizeImportHeader,
  parseExcelDateDetailed,
  parseStandardImportRows,
  validateStandardImportFile
} from './standard-import.utils';

const searchKey = (standard: ReferenceStandard) =>
  [standard.name, standard.internal_id, standard.lot_number, standard.product_code]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

function parse(rows: Record<string, unknown>[], existingStandards: ReferenceStandard[] = []) {
  return parseStandardImportRows(rows, {
    sourceSheet: 'Sheet1',
    existingStandards,
    generateSearchKey: searchKey,
    today: '2026-07-29'
  });
}

test('normalizes annotated multiline headers by their first meaningful line', () => {
  assert.equal(normalizeImportHeader('Hạn sử dụng\nNGÀY/THÁNG/NĂM\n(/: Không HSD)'), 'hạn sử dụng');
  assert.equal(normalizeImportHeader('\n\nSố nhận diện'), 'số nhận diện');
});

test('parses the Book2 header shape and /Chai quantities without ambiguous amount matching', () => {
  const [item] = parse([{
    'Tên chuẩn': 'CRM dcGTX2&3-d',
    'Ngày nhận': '23/07/2026',
    'Khối lượng chai': 0.5,
    'Quy cách': 'mL/Chai',
    'Mã số sản phẩm': 'CRM-dcGTX2&3-d',
    'Số lô\nLOT': '20220630',
    '\n\nSố nhận diện': 'AH45',
    'Lượng \ncòn lại': '0.5 mL/Chai'
  }]);

  assert.equal(item.isValid, true);
  assert.match(item.parsed.id, /^std_ah45_/);
  assert.equal(item.parsed.initial_amount, 0.5);
  assert.equal(item.parsed.current_amount, 0.5);
  assert.equal(item.parsed.unit, 'ml');
  assert.equal(item.parsed.product_code, 'CRM-dcGTX2&3-d');
});

test('derives current stock from unit-aware usage logs when current stock is blank', () => {
  const [item] = parse([{
    'Tên chuẩn': 'Test standard',
    'Khối lượng chai': '1000 mg',
    'Số nhận diện': 'AA01',
    'LẦN CÂN 1': 'Người: An; Ngày: 29/07/2026; Lượng dùng: 0.1 g'
  }]);

  assert.equal(item.isValid, true);
  assert.equal(item.logs[0].amount_used, 0.1);
  assert.equal(item.logs[0].unit, 'g');
  assert.equal(item.logs[0].normalized_amount, 100);
  assert.equal(item.logs[0].normalized_unit, 'mg');
  assert.equal(item.parsed.current_amount, 900);
});

test('rejects invalid dates, missing identity, and stock greater than initial', () => {
  const [item] = parse([{
    'Tên chuẩn': 'Broken',
    'Khối lượng chai': '5 mg',
    'Lượng còn lại': '6 mg',
    'Ngày nhận': '31/02/2026'
  }]);

  assert.equal(item.isValid, false);
  assert.match(item.errorMessage || '', /Mã quản lý nội bộ/);
  assert.match(item.errorMessage || '', /Ngày/);
  assert.match(item.errorMessage || '', /lớn hơn lượng ban đầu/);
});

test('marks duplicate identities in one workbook as blocking conflicts', () => {
  const items = parse([
    { 'Tên chuẩn': 'A', 'Khối lượng chai': '1 mg', 'Số nhận diện': 'AB01' },
    { 'Tên chuẩn': 'A corrected', 'Khối lượng chai': '1 mg', 'Số nhận diện': 'AB01' }
  ]);

  assert.equal(items.every(item => !item.isValid && item.mode === 'CONFLICT'), true);
});

test('uses internal id to resolve a legacy document id and exposes field diffs', () => {
  const existing: ReferenceStandard = {
    id: 'legacy-name-lot-id',
    name: 'Old name',
    internal_id: 'AB47',
    product_code: '',
    initial_amount: 5,
    current_amount: 4,
    unit: 'mg',
    status: 'AVAILABLE'
  };
  const [item] = parse([{
    'Tên chuẩn': 'Bicozamycin',
    'Khối lượng chai': '5 mg',
    'Số nhận diện': 'AB47',
    'Mã số sản phẩm': 'AB61701'
  }], [existing]);

  assert.equal(item.parsed.id, 'legacy-name-lot-id');
  assert.equal(item.mode, 'UPDATE_SAFE');
  assert.equal(item.changes?.some(change => change.field === 'product_code' && change.after === 'AB61701'), true);
});

test('treats a soft-deleted identity as released and creates a new immutable document', () => {
  const existing: ReferenceStandard = {
    id: 'deleted-id',
    name: 'Deleted standard',
    internal_id: 'AB02',
    initial_amount: 1,
    current_amount: 1,
    unit: 'mg',
    status: 'DELETED',
    _isDeleted: true
  };
  const [item] = parse([{
    'Tên chuẩn': 'New standard using released slot',
    'Khối lượng chai': '1 mg',
    'Số nhận diện': 'AB02'
  }], [existing]);
  assert.equal(item.mode, 'CREATE');
  assert.notEqual(item.parsed.id, existing.id);
  assert.match(item.parsed.id, /^std_ab02_/);
  assert.equal(item.isValid, true);
});

test('only active standards occupy a management-code slot', () => {
  assert.equal(isActiveStandardIdentity({
    id: 'active',
    name: 'Active',
    initial_amount: 1,
    current_amount: 1,
    unit: 'mg',
    status: 'AVAILABLE'
  }), true);
  assert.equal(isActiveStandardIdentity({
    id: 'deleted',
    name: 'Deleted',
    initial_amount: 1,
    current_amount: 1,
    unit: 'mg',
    status: 'DELETED',
    _isDeleted: true
  }), false);
});

test('safe metadata never overwrites existing values with blanks or stock/workflow fields', () => {
  const parsed: ReferenceStandard = {
    id: 'one',
    name: 'Updated',
    internal_id: '',
    product_code: '',
    initial_amount: 100,
    current_amount: 0,
    unit: 'mg',
    status: 'DEPLETED'
  };
  const metadata = buildSafeImportMetadata(parsed, [
    'name',
    'internal_id',
    'product_code',
    'initial_amount',
    'current_amount',
    'status'
  ]);
  assert.deepEqual(metadata, { name: 'Updated' });
});

test('counts all writes before committing so oversized imports can be rejected atomically', () => {
  const [createItem, updateItem] = parse([
    {
      'Tên chuẩn': 'New',
      'Khối lượng chai': '10 mg',
      'Số nhận diện': 'AB03',
      'LẦN CÂN 1': '1 mg'
    },
    {
      'Tên chuẩn': 'Existing',
      'Khối lượng chai': '10 mg',
      'Số nhận diện': 'AB04',
      'LẦN CÂN 1': '1 mg'
    }
  ]);
  assert.equal(countAtomicStandardImportWrites([createItem, updateItem], new Set([updateItem.parsed.id])), 5);
});

test('validates supported file types and maximum size before reading', () => {
  assert.doesNotThrow(() => validateStandardImportFile({ name: 'Book2.xlsx', size: 1024 } as File));
  assert.throws(
    () => validateStandardImportFile({ name: 'Book2.exe', size: 1024 } as File),
    /Chỉ hỗ trợ/
  );
  assert.throws(
    () => validateStandardImportFile({ name: 'Book2.xlsx', size: 11 * 1024 * 1024 } as File),
    /10 MB/
  );
});

test('parses valid Excel serials and reports malformed dates instead of silently clearing them', () => {
  assert.equal(parseExcelDateDetailed(46232).value, '2026-07-29');
  assert.match(parseExcelDateDetailed('not-a-date').error || '', /không hợp lệ/);
});

test('rejects workbooks without required unambiguous headers', () => {
  assert.throws(
    () => parse([{ 'Tên chuẩn': 'A', 'Lượng còn lại': '1 mg', 'Số nhận diện': 'A1' }]),
    /Khối lượng chai/
  );
});
