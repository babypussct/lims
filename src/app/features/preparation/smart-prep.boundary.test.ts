import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const preparationDir = resolve(process.cwd(), 'src/app/features/preparation');
const componentSource = readFileSync(resolve(preparationDir, 'smart-prep.component.ts'), 'utf8');
const templateSource = readFileSync(resolve(preparationDir, 'smart-prep.component.html'), 'utf8');
const engineSource = readFileSync(resolve(preparationDir, 'prep-calculation.engine.ts'), 'utf8');
const domainSource = readFileSync(resolve(preparationDir, 'prep-domain.types.ts'), 'utf8');

test('prep calculator has no inventory, standards catalog or Firestore dependency', () => {
  const forbiddenRuntimeTokens = /PrepReferenceService|StandardCacheService|ReferenceStandard|AuthService|StateService|HttpClient|PubChemService|InventoryService|StandardService|StandardCrudService|StandardUsageService|StandardRequestService|FirebaseService|Firestore|firebase\/|reference_standards|standard\.model|features\/standards|updateStock|getInventoryPage|canEditInventory|confirmTransaction|inventoryItemId|stockAfter/i;
  const productionFiles = readdirSync(preparationDir).filter(file => file.endsWith('.ts') && !/\.(test|spec)\.ts$/.test(file));
  for (const file of productionFiles) {
    assert.doesNotMatch(readFileSync(resolve(preparationDir, file), 'utf8'), forbiddenRuntimeTokens, file);
  }
  assert.doesNotMatch(templateSource, /Chất chuẩn LIMS|Đang tìm chất chuẩn|referenceLoading|referenceError|mã AA01/);
});

test('calculator only injects presentation feedback and never reads business or browser data', () => {
  assert.deepEqual([...componentSource.matchAll(/inject\((\w+)\)/g)].map(match => match[1]), ['ToastService']);
  assert.doesNotMatch(componentSource, /getItem\s*\(|setItem\s*\(|sessionStorage|indexedDB|fetch\s*\(|XMLHttpRequest|HttpClient|BroadcastChannel/);
  assert.doesNotMatch(templateSource, /routerLink|href=|innerHTML|draftRestoreNotice/);
  const appSource = readFileSync(resolve(process.cwd(), 'src/app/app.component.ts'), 'utf8');
  const publicRouteDeclaration = appSource.match(/isPublicRoute = computed\(\(\) => \{[\s\S]*?\n {2}\}\);/)?.[0];
  assert.ok(publicRouteDeclaration);
  assert.doesNotMatch(publicRouteDeclaration, /prep|preparation/);
});

test('prep helper exposes simulation-only actions', () => {
  assert.match(componentSource, /calculatePrep/);
  assert.match(componentSource, /copyResult/);
  assert.doesNotMatch(componentSource, /exportSimulation|printSimulation|printDocument|sheetMethod/);
  assert.doesNotMatch(templateSource, /app-a4-document-preview|Xuất TXT|Xem & In|Thông tin kèm phiếu/);
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

test('ppm (mg/L) stays in the UI and its reminder is tooltip-only', () => {
  assert.match(componentSource, /key: 'ppm_mg_l'.*label: 'ppm \(mg\/L\)'/s);
  assert.match(componentSource, /concentrationTooltip\(token: string\): string \| null/);
  assert.match(componentSource, /tokens: \['ppm_mg_l', 'ppm \(mg\/L\)', 'mg_l', 'mg\/L', 'ug_ml', 'µg\/mL'\]/);
  assert.match(templateSource, /\[attr\.title\]="concentrationTooltip\(concentrationSourceChoice\(\)\)"/);
  assert.match(templateSource, /\[attr\.title\]="concentrationTooltip\(resultInstrumentChoice\(\)\)"/);
  assert.match(templateSource, /\[attr\.title\]="concentrationTooltip\(item\.unit\)"/);
  assert.ok((templateSource.match(/\[attr\.title\]="concentrationTooltip/g) ?? []).length >= 10);
});

test('all equivalent mass concentration families have tooltip groups', () => {
  assert.match(componentSource, /tokens: \['g_l', 'g\/L', 'mg_ml', 'mg\/mL'\]/);
  assert.match(componentSource, /tokens: \['ppb_ug_l', 'ppb \(µg\/L\)', 'ug_l', 'µg\/L', 'ng_ml', 'ng\/mL'\]/);
  assert.match(componentSource, /tokens: \['ppt_ng_l', 'ppt \(ng\/L\)', 'ng_l', 'ng\/L'\]/);
  assert.match(componentSource, /tokens: \['ppm_mg_kg', 'ppm \(mg\/kg\)', 'mg_kg', 'mg\/kg'\]/);
  assert.match(componentSource, /tokens: \['ppb_ug_kg', 'ppb \(µg\/kg\)', 'ug_kg', 'µg\/kg'\]/);
  assert.match(componentSource, /tokens: \['ppt_ng_kg', 'ppt \(ng\/kg\)', 'ng_kg', 'ng\/kg'\]/);
});

test('source references resolve to KNV labels without exposing technical IDs', () => {
  assert.match(componentSource, /sourceDisplayName\(id: string \| null \| undefined\): string/);
  assert.match(componentSource, /sourceTooltip\(id: string \| null \| undefined\): string/);
  assert.match(componentSource, /source\.name\.trim\(\) \|\| 'Nguồn chưa có tên'/);
  assert.match(componentSource, /point\.label\.trim\(\) \|\| 'Điểm chuẩn chưa có tên'/);
  assert.match(componentSource, /return 'Nguồn sử dụng: ' \+ label/);
  assert.doesNotMatch(componentSource, /mã kỹ thuật:/i);
  assert.match(componentSource, /sourceDisplayName\(row\.sourceId\)/);
  assert.match(engineSource, /sourceLabel = sourceById\.get\(point\.sourceId\)/);
  assert.match(templateSource, /\[attr\.title\]="sourceTooltip\(source\.sourceId\)"/);
  assert.match(templateSource, /\[attr\.title\]="sourceTooltip\(point\.sourceId\)"/);
  assert.match(templateSource, /\[attr\.title\]="sourceTooltip\(component\.sourceId\)"/);
  assert.match(templateSource, /\[attr\.title\]="sourceTooltip\(addition\.sourceId\)"/);
  assert.match(templateSource, /sourceDisplayName\(row\.sourceId\)/);
  assert.doesNotMatch(templateSource, /Nguồn: \{\{row\.sourceId\}\}/);
  assert.doesNotMatch(templateSource, /← \{\{row\.sourceId\}\}/);
});

test('prep step 2 and steps 3-4 share the desktop panel height and scroll independently', () => {
  assert.match(templateSource, /<div class="flex min-h-full flex-col/);
  assert.match(templateSource, /<main class="grid .*xl:min-h-0 xl:flex-1/);
  assert.match(templateSource, /<section class="min-w-0 rounded-2xl xl:flex xl:min-h-0 xl:flex-col/);
  assert.match(templateSource, /<div class="space-y-5 xl:min-h-0 xl:flex-1 overflow-y-auto/);
  assert.match(templateSource, /<aside class="min-w-0 rounded-2xl xl:flex xl:min-h-0 xl:flex-col/);
  assert.match(templateSource, /<div class="space-y-4 xl:min-h-0 xl:flex-1 overflow-y-auto/);
  assert.doesNotMatch(templateSource, /max-h-\[calc\(100vh-310px\)\]|min-h-\[620px\]|min-h-\[680px\]/);
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


test('calculation engine and domain remain free of browser draft storage side effects', () => {
  const sideEffects = /localStorage|sessionStorage|window\.|document\.|fetch\s*\(|XMLHttpRequest/;
  assert.doesNotMatch(engineSource, sideEffects);
  assert.doesNotMatch(domainSource, sideEffects);
});
