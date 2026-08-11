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

test('prep UI does not expose technical boundary copy to KNV', () => {
  const technicalBoundaryCopy = /Tính toán cục bộ|Ranh giới cục bộ|Phạm vi dữ liệu|Tác động dữ liệu|Không đọc\/ghi Kho|không tạo giao dịch|Chỉ nhập tay/i;
  assert.doesNotMatch(templateSource, technicalBoundaryCopy);
  assert.doesNotMatch(componentSource, technicalBoundaryCopy);
});

test('prep UI declares automatic concentration basis pairs for ppm, ppb and ppt', () => {
  assert.match(componentSource, /ppt_ng_l/);
  assert.match(componentSource, /ppt_ng_kg/);
  assert.match(templateSource, /concentrationOptionsFor\('solution'\)/);
  assert.match(templateSource, /sampleConcentrationOptions/);
  assert.match(templateSource, /setSpikeMatrix/);
  assert.match(componentSource, /concentrationOptionsFor\(context/);
  assert.match(componentSource, /sampleConcentrationOptions/);
  assert.match(componentSource, /setSpikeMatrix/);
});

test('prep UI prioritizes KNV operation units and fixes units when dimension changes', () => {
  assert.match(componentSource, /\{ unit: 'µL', label: 'µL' \}/);
  assert.match(componentSource, /\{ unit: 'mL', label: 'mL' \}/);
  assert.match(componentSource, /\{ unit: 'mg', label: 'mg' \}/);
  assert.match(componentSource, /\{ unit: 'g', label: 'g' \}/);
  assert.doesNotMatch(componentSource, /\{ unit: 'L', label: 'L' \}/);
  assert.doesNotMatch(componentSource, /\{ unit: 'kg', label: 'kg' \}/);
  assert.match(templateSource, /setConcentrationSourceType/);
  assert.match(templateSource, /setTargetSourceType/);
  assert.match(templateSource, /setResultSampleBase/);
  assert.match(componentSource, /keepDimensionUnit/);
});
