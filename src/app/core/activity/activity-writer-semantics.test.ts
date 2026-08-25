import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { crossedInventoryLowStockThreshold } from '../../features/inventory/inventory-low-stock';

test('inventory low-stock alert fires only when crossing from healthy to low stock', () => {
  assert.equal(crossedInventoryLowStockThreshold(11, 10, 10), true);
  assert.equal(crossedInventoryLowStockThreshold(10, 9, 10), false);
  assert.equal(crossedInventoryLowStockThreshold(9, 8, 10), false);
  assert.equal(crossedInventoryLowStockThreshold(9, 12, 10), false);
  assert.equal(crossedInventoryLowStockThreshold(12, 11, 10), false);
});

test('inventory writers persist and dispatch canonical low-stock transitions', () => {
  const source = readFileSync('src/app/features/inventory/inventory.service.ts', 'utf8');
  assert.match(source, /action:\s*'INVENTORY_LOW_STOCK'/);
  assert.match(source, /crossedInventoryLowStockThreshold\(oldStock, item\.stock, lowStockThreshold\)/);
  assert.match(source, /crossedInventoryLowStockThreshold\(freshStock, newStock, threshold\)/);
  assert.match(source, /dispatchActivityProjectionIfEnabled\(lowStockActivityRef\.id\)/);
  assert.match(source, /dispatchActivityProjectionIfEnabled\(globalLogRef\.id\)/);
});

test('unlock-to-edit uses its dedicated non-notifying activity action', () => {
  const source = readFileSync('src/app/features/results/services/result.service.ts', 'utf8');
  const start = source.indexOf('async unlockToEdit(');
  const end = source.indexOf('\n  async resetResults(', start);
  assert.ok(start >= 0 && end > start, 'unlockToEdit source block must be discoverable');
  const block = source.slice(start, end);
  assert.match(block, /'UNLOCK_RESULT_EDIT'/);
  assert.doesNotMatch(block, /'REVERT_RESULT_DRAFT'/);
  assert.doesNotMatch(block, /dispatchActivityProjectionIfEnabled/);
});
