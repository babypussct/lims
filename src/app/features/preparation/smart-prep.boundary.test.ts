import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const preparationDir = resolve(process.cwd(), 'src/app/features/preparation');
const componentSource = readFileSync(resolve(preparationDir, 'smart-prep.component.ts'), 'utf8');
const templateSource = readFileSync(resolve(preparationDir, 'smart-prep.component.html'), 'utf8');
const engineSource = readFileSync(resolve(preparationDir, 'prep-calculation.engine.ts'), 'utf8');
const domainSource = readFileSync(resolve(preparationDir, 'prep-domain.types.ts'), 'utf8');

test('prep helper has no inventory, standard, or persistence dependency', () => {
  const forbiddenRuntimeTokens = /InventoryService|FirebaseService|Firestore|updateStock|getInventoryPage|canEditInventory|confirmTransaction|referenceStandard|standardId|inventoryItemId|stockAfter/i;
  assert.doesNotMatch(componentSource, forbiddenRuntimeTokens);
  assert.doesNotMatch(engineSource, forbiddenRuntimeTokens);
  assert.doesNotMatch(domainSource, forbiddenRuntimeTokens);
});

test('prep helper exposes simulation-only actions', () => {
  assert.match(componentSource, /calculatePrep/);
  assert.match(componentSource, /copyResult/);
  assert.match(componentSource, /exportSimulation/);
  assert.match(componentSource, /printSimulation/);
  assert.doesNotMatch(componentSource, /stockAfter|transactionId|auditLog|writeBatch|setDoc|updateDoc/i);
  assert.doesNotMatch(templateSource, /Dùng tồn kho|Trừ kho|tồn kho|Đủ hàng|Thiếu hàng/i);
});
