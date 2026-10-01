import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildInventoryCountDocument, buildStockCardDocument } from './inventory-print-document';
import { StockHistoryItem } from '../../core/models/inventory.model';

const item = { id: 'HC01', name: 'Dung môi thử', stock: 7, unit: 'mL', lotNumber: 'LOT-A' };
const history: StockHistoryItem[] = [
  { id: 'first', timestamp: new Date('2026-09-01'), actionType: 'CREATE', amountChange: 10, stockAfter: 10, user: 'A', reference: 'Khởi tạo' },
  { id: 'last', timestamp: new Date('2026-10-01'), actionType: 'EXPORT', amountChange: -3, stockAfter: 7, user: 'B', reference: 'Dùng mẻ' },
];
test('stock card sorts all history and reconciles opening, changes and current balance without modifying input', () => {
  const snapshot = structuredClone(history);
  const doc = buildStockCardDocument(item, [...history].reverse());
  assert.deepEqual(doc.sections[1].rows.map(row => row.key), ['first', 'last']);
  assert.match(doc.sections[0].rows.at(-1)!.cells[1], /0 \/ 7 mL/);
  assert.deepEqual(history, snapshot);
});
test('stock cards block incomplete, inconsistent, missing-date and stale histories', () => {
  assert.throws(() => buildStockCardDocument(item, []), /Chưa có lịch sử/);
  assert.throws(() => buildStockCardDocument(item, [history[0], { ...history[1], amountChange: -2 }]), /liên tục/);
  assert.throws(() => buildStockCardDocument({ ...item, stock: 8 }, history), /chưa khớp/);
  assert.throws(() => buildStockCardDocument(item, [{ ...history[0], timestamp: null }, history[1]]), /liên tục/);
});
test('inventory count prints all filtered items, preserves zero balances and leaves actual counts blank', () => {
  const doc = buildInventoryCountDocument([item, { ...item, id: 'HC02', stock: 0 }], 'Phạm vi đang lọc');
  assert.equal(doc.orientation, 'landscape');
  assert.equal(doc.sections[0].rows.length, 2);
  assert.equal(doc.sections[0].rows[1].cells[3], '0');
  assert.equal(doc.sections[0].rows[1].cells[4], '________________');
  assert.match(doc.notice, /danh sách đang lọc/);
});
