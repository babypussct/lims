import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const rules = readFileSync(resolve(process.cwd(), 'firestore.rules'), 'utf8');
const smartBatchSource = readFileSync(
  resolve(process.cwd(), 'src/app/features/batch/smart-batch.component.ts'),
  'utf8'
);
const sampleGroupWizardSource = readFileSync(
  resolve(process.cwd(), 'src/app/features/batch/components/sample-group-step2-wizard.component.ts'),
  'utf8'
);
const smartBatchTemplate = readFileSync(
  resolve(process.cwd(), 'src/app/features/batch/smart-batch.component.html'),
  'utf8'
);
const printQueueSource = readFileSync(
  resolve(process.cwd(), 'src/app/features/requests/print-queue.component.ts'),
  'utf8'
);
const configGeneralSource = readFileSync(
  resolve(process.cwd(), 'src/app/features/config/components/config-general.component.ts'),
  'utf8'
);
const configGeneralTemplate = readFileSync(
  resolve(process.cwd(), 'src/app/features/config/components/config-general.component.html'),
  'utf8'
);

function ruleBlock(startMarker: string, endMarker: string): string {
  const start = rules.indexOf(startMarker);
  const end = rules.indexOf(endMarker, start + startMarker.length);
  assert.notEqual(start, -1, `${startMarker} must exist`);
  assert.notEqual(end, -1, `${endMarker} must exist after ${startMarker}`);
  return rules.slice(start, end);
}

test('print jobs are not public and signed-in users do not receive blanket write access', () => {
  const block = ruleBlock(
    'match /artifacts/{appId}/print_jobs/{jobId}',
    '// Thu vien Target Master'
  );
  assert.doesNotMatch(block, /allow read:\s*if\s*true/);
  assert.doesNotMatch(block, /allow write:\s*if\s*isSignedIn\(\)/);
  assert.match(block, /allow get, list:\s*if canUseSopWorkspace\(appId\) \|\|/);
  assert.match(block, /hasPermission\(appId, 'report_view'\)/);
  assert.match(block, /createdByUid/);
  assert.match(block, /allow update:\s*if false/);
  assert.match(block, /allow delete:\s*if false/);
});

test('report_view can read persisted inventory without receiving inventory write privileges', () => {
  const block = ruleBlock(
    'match /artifacts/{appId}/inventory/{itemId}',
    '// MODULE CHUAN DOI CHIEU'
  );
  assert.match(block, /allow read:\s*if hasPermission\(appId, 'inventory_view'\) \|\| hasPermission\(appId, 'report_view'\)/);
  assert.doesNotMatch(block, /allow create, delete:\s*if[^;]*report_view/);
  assert.doesNotMatch(block, /allow update:\s*if[^;]*report_view/);
});

test('batch_run cannot approve or arbitrarily rewrite an existing request', () => {
  const block = ruleBlock(
    'match /artifacts/{appId}/requests/{reqId}',
    'match /artifacts/{appId}/daily_checklists/{analysisDate}'
  );
  assert.doesNotMatch(block, /allow write:\s*if[^;]*batch_run/);
  assert.match(block, /validBatchRequestUpdate\(appId\)/);
  assert.match(rules, /function validResultUpdate\(\)/);
  assert.match(rules, /function validLockUpdate\(appId\)/);
  assert.match(rules, /function validVirtualMasterUpdate\(\)/);
  assert.match(rules, /fromStatus == 'approved' && toStatus == 'draft'/);
  assert.doesNotMatch(rules, /fromStatus == 'pending' && toStatus == 'approved'/);
});

test('master data writes are manager-only', () => {
  for (const collectionName of ['master_targets', 'master_analytes', 'matrix_types', 'master_devices']) {
    const marker = `match /artifacts/{appId}/${collectionName}/{docId}`;
    const start = rules.indexOf(marker);
    assert.notEqual(start, -1, `${collectionName} rule must exist`);
    const block = rules.slice(start, rules.indexOf('\n    }', start) + 6);
    assert.match(block, /allow write:\s*if isManager\(appId\)/);
    assert.doesNotMatch(block, /allow read, write:\s*if isSignedIn\(\)/);
  }
});

test('result details require an operational role to write', () => {
  const block = ruleBlock(
    'match /artifacts/{appId}/results_details/{docId}',
    '// Yeu cau in an nhan / barcode'
  );
  assert.match(block, /allow create, update:\s*if canEditResults\(appId\)/);
  assert.doesNotMatch(block, /allow read, write:\s*if isSignedIn\(\)/);
});

test('activity log creation validates V2 classification, actor identity and server timestamp', () => {
  const block = rules.slice(rules.indexOf('match /artifacts/{appId}/logs/{logId}'));
  assert.match(block, /allow create:\s*if canCreateAuditLog\(appId\) &&\s*validCanonicalActivityCreate/);
  assert.match(rules, /data\.get\('actorUid', ''\) == request\.auth\.uid/);
  assert.match(rules, /isCurrentActorName\(appId, actorName\)/);
  assert.match(rules, /validActivityClassification\(data\)/);
  assert.match(rules, /data\.timestamp == request\.time/);
});

test('an unselected matrix remains any and the obsolete parent split filter stays removed', () => {
  assert.doesNotMatch(smartBatchSource, /find\([^\n]*isDefault/);
  assert.doesNotMatch(smartBatchSource, /filteredSopsForSplit\s*=/);
  assert.match(smartBatchSource, /createEmptyBlock\(`Nhóm mẫu #\$\{b\.length \+ 1\}`\)/);
});

test('print queue owns its independent listener instead of consuming Activity Feed state', () => {
  assert.match(printQueueSource, /this\.queue\.ensureListener\(\)/);
  assert.match(printQueueSource, /this\.queue\.printableLogs\(\)/);
  assert.doesNotMatch(printQueueSource, /this\.state\.ensureActivityFeedListeners\(\)/);
  assert.doesNotMatch(printQueueSource, /this\.state\.ensureLogsListener\(\)/);
});

test('config screen no longer embeds or copies a deployable Firestore ruleset', () => {
  assert.doesNotMatch(configGeneralSource, /firestoreRules\s*=\s*computed/);
  assert.doesNotMatch(configGeneralSource, /copyRules\s*\(/);
  assert.doesNotMatch(configGeneralTemplate, /copyRules\s*\(/);
  assert.doesNotMatch(configGeneralTemplate, /firestoreRules\(\)/);
  assert.match(configGeneralSource, /firestoreRulesNotice/);
});

test('SmartBatch canonicalizes imported target groups and Auto Fix target membership', () => {
  assert.match(smartBatchSource, /getCanonicalId\(target\.name \|\| target\.id\)/);
  assert.match(smartBatchSource, /selectedTargetSetHas\(b\.selectedTargets, task\.targetId\)/);
  assert.match(smartBatchSource, /selectedTargetSetWithout\(block\.selectedTargets, targetId\)/);
});

test('SmartBatch Step 2 uses a bounded two-step group wizard without adding a discussion field', () => {
  assert.match(smartBatchSource, /SampleGroupStep2WizardComponent/);
  assert.match(smartBatchSource, /completeSampleGroupWizard/);
  assert.match(smartBatchSource, /createSampleGroupWizardGroup/);
  assert.match(sampleGroupWizardSource, /stepLabels = \['Thông tin mẫu', 'Chỉ tiêu & SOP'\]/);
  assert.match(sampleGroupWizardSource, /sampleGroupCompletionIssues/);
  assert.match(sampleGroupWizardSource, /forcedSopIssue/);
  assert.match(sampleGroupWizardSource, /smartbatch-group-wizard/);
  assert.match(sampleGroupWizardSource, /runOptimizer\(\)/);
  assert.match(sampleGroupWizardSource, /overflow-y-auto custom-scrollbar/);
  assert.match(sampleGroupWizardSource, /Chọn Nhóm Chỉ Tiêu/);
  assert.match(sampleGroupWizardSource, /Gợi ý Quy trình \(SOP\)/);
  assert.match(sampleGroupWizardSource, /SOP hiện tại/);
  assert.match(sampleGroupWizardSource, /sop\.isManualOnly \? 'Thủ công: '/);
  assert.doesNotMatch(sampleGroupWizardSource, /eligibleManualSops|manualSelectionValue|CHỈ ĐỊNH THỦ CÔNG/);
  assert.match(sampleGroupWizardSource, /slice\(0, 5\)/);
  assert.match(sampleGroupWizardSource, /showSampleDescriptions/);
  assert.match(sampleGroupWizardSource, /copyDescriptionToAll/);
  assert.match(sampleGroupWizardSource, /matrixConfirmed: true/);
  assert.doesNotMatch(sampleGroupWizardSource, /Khai báo nhiều nhóm mẻ trên cùng một trang|Mỗi nhóm có wizard 2 bước/);
  assert.doesNotMatch(sampleGroupWizardSource, /Mở wizard nhóm/);
  assert.match(sampleGroupWizardSource, /Thêm nhóm mới/);
  assert.match(sampleGroupWizardSource, /AppButtonComponent/);
  assert.match(sampleGroupWizardSource, /AppEmptyStateComponent/);
  assert.match(sampleGroupWizardSource, /<app-button variant="secondary" size="sm" class="whitespace-nowrap" \(click\)="close\.emit\(\)"/);
  assert.match(sampleGroupWizardSource, /<app-button variant="secondary" size="sm" \[fullWidth\]="true" \(click\)="addGroup\(\)" \[disabled\]="singleMode"/);
  assert.match(sampleGroupWizardSource, /<app-button variant="secondary" \(click\)="previousStep\(\)" \[disabled\]="activeStep\(\) === 1"/);
  assert.match(sampleGroupWizardSource, /<app-button variant="primary" \(click\)="nextStep\(\)"/);
  assert.match(sampleGroupWizardSource, /<app-empty-state[\s\S]*title="Các nhóm mẻ đã được lưu trong bước 2"/);
  assert.match(sampleGroupWizardSource, /<button type="button" \(click\)="openGroup\(group\.id\)"/);
  assert.match(sampleGroupWizardSource, /<button type="button" \(click\)="removeGroup\(group\.id\); \$event\.stopPropagation\(\)"/);
  assert.match(sampleGroupWizardSource, /<button type="button" \(click\)="toggleTargetGroupPicker\(\)"/);
  assert.match(sampleGroupWizardSource, /<input type="checkbox" \[checked\]="isTargetSelected\(target\)"/);
  assert.match(sampleGroupWizardSource, /\[attr\.aria-pressed\]="suggestion\.isPartial \? null : group\.forcedSopId === suggestion\.sop\.id"/);
  assert.match(sampleGroupWizardSource, /<select \[ngModel\]="group\.forcedSopId \|\| ''"[\s\S]*aria-label="SOP hiện tại"/);
  assert.match(smartBatchTemplate, /batch\.isExpanded && getBatchDescriptionText\(batch\)/);
  assert.match(smartBatchTemplate, /Duyệt & xếp hàng in/);
  assert.match(smartBatchTemplate, /step\(\) === 1 && showSampleGroupWizard/);
  assert.match(sampleGroupWizardSource, /groupStates/);
  assert.match(sampleGroupWizardSource, /addGroup\(\)/);
  assert.match(sampleGroupWizardSource, /allGroupsCompleted/);
  assert.match(sampleGroupWizardSource, /selectSuggestedSop\(suggestion\.sop\.id, suggestion\.isPartial\)/);
  assert.match(sampleGroupWizardSource, /hover:bg-indigo-50/);
  assert.match(sampleGroupWizardSource, /border-indigo-600/);
  assert.match(sampleGroupWizardSource, /ring-indigo-500/);
  assert.match(sampleGroupWizardSource, /aria-pressed/);
  assert.match(sampleGroupWizardSource, /group\.forcedSopId !== suggestion\.sop\.id/);
  assert.match(sampleGroupWizardSource, /Đang chọn/);
  assert.match(sampleGroupWizardSource, /completionIssuesForGroup/);
  assert.match(sampleGroupWizardSource, /activeGroupIsCompleted/);
  assert.match(sampleGroupWizardSource, /Nhấn thẻ SOP để chỉ định/);
  assert.doesNotMatch(sampleGroupWizardSource, /<button[^>]*>\s*Chỉ định\s*<\/button>/);
  assert.doesNotMatch(sampleGroupWizardSource, /Đang áp dụng/);
  assert.doesNotMatch(sampleGroupWizardSource, /Hoàn tất nhóm mẻ/);
  assert.doesNotMatch(sampleGroupWizardSource, /finishGroup\(/);
  assert.match(smartBatchTemplate, /<app-page-header/);
  assert.match(smartBatchTemplate, /<app-toolbar/);
  assert.match(smartBatchTemplate, /<app-modal-shell/);
  assert.match(smartBatchTemplate, /<app-empty-state/);
  assert.match(smartBatchTemplate, /Chạy SmartBatch optimizer/);
  assert.match(smartBatchTemplate, /smartbatch-action-dock/);
  assert.match(smartBatchTemplate, /<app-button[\s\S]*?\(click\)="sampleGroupWizard\.runOptimizer\(\)"[\s\S]*?\[disabled\]="!sampleGroupWizard\.allGroupsCompleted\(\)"/);
  assert.match(smartBatchTemplate, /<app-button[\s\S]*?\(click\)="executeAll\(\)"[\s\S]*?\[loading\]="isProcessing\(\)"/);
  assert.match(smartBatchTemplate, /\[disabled\]="isProcessing\(\) \|\| batches\(\)\.length === 0 \|\| hasCriticalMissing\(\) \|\| hasInvalidAnalysisDates\(\) \|\| hasInvalidPlanResources\(\) \|\| !coverageMetrics\(\)\.isFullyCovered \|\| coverageMetrics\(\)\.duplicateCount > 0"/);
  assert.doesNotMatch(smartBatchTemplate, /smartbatch-primary-action/);
  assert.doesNotMatch(sampleGroupWizardSource, /Thảo luận chi tiết|updateDiscussion|discussion/);
});
