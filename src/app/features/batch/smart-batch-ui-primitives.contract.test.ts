import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const component = readFileSync(new URL('./smart-batch.component.ts', import.meta.url), 'utf8');
const template = readFileSync(new URL('./smart-batch.component.html', import.meta.url), 'utf8');

const singleWorkspace = readFileSync(new URL('./components/single-sample-dispatch-workspace.component.ts', import.meta.url), 'utf8');
const wizard = readFileSync(new URL('./components/sample-group-step2-wizard.component.ts', import.meta.url), 'utf8');
const splitWizard = readFileSync(new URL('./components/batch-split-wizard.component.ts', import.meta.url), 'utf8');

describe('smart batch focused workspace header', () => {
  it('uses the shared workspace header and keeps step navigation on the leading slot', () => {
    assert.match(component, /AppPageHeaderComponent/);
    assert.match(component, /AppButtonComponent/);
    assert.match(template, /<app-page-header\b/);
    assert.match(template, /variant="workspace"/);
    assert.match(template, /\[sticky\]="true"/);
    assert.match(template, /pageHeaderLeading/);
    assert.match(template, /pageHeaderActions/);
    assert.match(template, /pageHeaderLeading[\s\S]*?\(click\)="goBackToStep0\(\)"/);
    assert.match(template, /pageHeaderLeading[\s\S]*?\(click\)="goBackFromStep2\(\)"/);
    assert.match(template, /pageHeaderActions[\s\S]*?Ghép nhiều mẫu/);
    assert.match(template, /pageHeaderActions[\s\S]*?Một mẫu duy nhất/);
    assert.match(template, /pageHeaderActions[\s\S]*?\(click\)="openSopCalculator\(\)"/);
    assert.doesNotMatch(template, /app-page-header[\s\S]{0,180}border border-slate-100/);
  });

  it('renders SingleSampleDispatchWorkspaceComponent for single mode and separates multiple mode wizard', () => {
    assert.match(template, /<app-single-sample-dispatch-workspace\b/);
    assert.match(template, /<app-sample-group-step2-wizard\b/);
    assert.match(template, /smartBatchMode\(\) === 'single'/);
    assert.match(component, /SingleSampleDispatchWorkspaceComponent/);
  });

  it('SingleSampleDispatchWorkspaceComponent implements split-view, onPush detection, and UI primitives', () => {
    assert.match(singleWorkspace, /ChangeDetectionStrategy\.OnPush/);
    assert.match(singleWorkspace, /selector:\s*'app-single-sample-dispatch-workspace'/);
    assert.match(singleWorkspace, /grid-cols-1 lg:grid-cols-12/);
    assert.match(singleWorkspace, /AppButtonComponent/);
    assert.match(singleWorkspace, /AppModalShellComponent/);
    assert.match(singleWorkspace, /AppEmptyStateComponent/);
    assert.match(singleWorkspace, /@Output\(\)\s+draftChange/);
    assert.match(singleWorkspace, /@Output\(\)\s+commit/);
  });

  it('SampleGroupStep2WizardComponent is decoupled from singleMode', () => {
    assert.doesNotMatch(wizard, /@Input\(\)\s+singleMode/);
    assert.doesNotMatch(wizard, /singleSampleCode/);
  });

  it('cleans up legacy single-mode state from smart-batch.component.ts and keeps singleSampleDraft as single source of truth', () => {
    assert.doesNotMatch(component, /singleSampleCode = signal/);
    assert.doesNotMatch(component, /singleSelectedTargets = signal/);
    assert.doesNotMatch(component, /singleMatrixType = signal/);
    assert.doesNotMatch(component, /singleForcedSopId = signal/);
    assert.doesNotMatch(component, /singleSopSuggestions = computed/);
    assert.doesNotMatch(component, /singleEligibleManualSops = computed/);
    assert.match(component, /singleSampleDraft = signal/);
    assert.match(component, /singleSamplePreview = signal/);
    assert.match(component, /isSingleSampleCommitting = signal/);
  });

  it('enforces in-flight commit guards and completeness verification in both workspace and parent', () => {
    assert.match(component, /if \(this\.isSingleSampleCommitting\(\)\) return;/);
    assert.match(component, /if \(this\.isSingleSampleCalculating\(\)\) return;/);
    assert.match(component, /!preview\.isFullyCovered/);
    assert.match(singleWorkspace, /preview\?\.isFullyCovered/);
    assert.match(singleWorkspace, /!this\._isCalculating\(\)/);
    assert.match(singleWorkspace, /commitBlockReason = computed/);
    assert.match(singleWorkspace, /draftFingerprint === computeSingleSampleDraftFingerprint/);
    assert.match(template, /\[draft\]="singleSampleDraft\(\)"/);
  });

  it('uses the shared thin progress primitive for the split-and-transfer wizard', () => {
    assert.match(splitWizard, /AppUiProgressComponent/);
    assert.match(splitWizard, /<app-ui-progress\b/);
    assert.match(splitWizard, /\[value\]="state\(\)\.step"/);
    assert.match(splitWizard, /\[max\]="3"/);
    assert.match(splitWizard, /ariaLabel="Tiến độ phân tách và chuyển mẻ"/);
  });
});
