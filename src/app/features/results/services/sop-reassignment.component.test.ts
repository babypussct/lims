import '@angular/compiler';
import assert from 'node:assert/strict';
import test from 'node:test';
import { signal } from '@angular/core';
import { ResultEntryComponent } from '../result-entry.component';
import { resolveConfigKey } from '../config/sop-configs';

function fixture() {
  const source = { id: 'source', sopId: 'SOP-03', sopName: 'Trifluralin', status: 'draft', items: [],
    sampleList: ['M1', 'M2'], inputs: {}, timestamp: null };
  const draft = { id: 'source', requestId: 'source', sopId: 'SOP-03', sopName: 'Trifluralin', status: 'draft',
    page1Data: { analyst: 'An' }, resultData: { M1: { value: 1 }, M2: { value: 2 } }, updatedBy: 'An', updatedAt: null };
  const preview = { request: source, movingRequest: { ...source, sampleList: ['M1'] },
    remainingRequest: { ...source, sampleList: ['M2'] }, targetSop: { id: 'target', name: 'Fipronil' },
    sourceSop: { id: source.sopId, name: source.sopName }, configKey: 'fipronil' };
  const calls: string[] = [];
  const sourceKey = resolveConfigKey(source.sopId, source.sopName)!;
  const component: any = Object.assign(Object.create(ResultEntryComponent.prototype), {
    requestId: source.id, run: signal(source), draft: signal(draft), configKey: signal(sourceKey), config: signal({ id: sourceKey }),
    sopReassignmentPreview: signal(preview), sopReassignmentScope: signal('selected'), selectedReassignmentSamples: signal(['M1']),
    selectedReassignmentSopId: signal('target'), sopReassignmentCandidates: signal([]), sopReassignmentUnavailableOptions: signal([]),
    sopReassignmentLoadId: 0, showSopReassignmentModal: signal(true), sopReassignmentError: signal(''), sopReassignmentNote: signal(''),
    isProcessing: () => false, isLoadingSopReassignment: signal(false), isReassigningSop: signal(false),
    renderDraftForm: signal(true), autoSaveStatus: signal('modified'), lastSavedAt: signal(null),
    autoSaveRevision: 0, lastSavedRevision: 0, autoSaveGeneration: 0, draftChangeSubject: { next: () => calls.push('queue') },
    activeFilter: signal('ALL'), historyList: signal([]), excelImportFile: signal(null), showResetModal: signal(false),
    showPreflightModal: signal(false), showActionsMenu: signal(false), showRestoreMenu: signal(false),
    auth: { currentUser: () => null }, toast: { show: () => calls.push('toast'), showEvent: () => calls.push('toast') },
    pauseAutoSave: async () => { calls.push('pause'); }, resumeAutoSave: () => calls.push('resume'),
    flushCurrentDraft: async () => { calls.push('flush'); return true; },
    sopReassignment: {
      reassign: async (_id: string, _source: string, _target: string, _note: string, samples: string[]) => {
        calls.push('reassign'); assert.deepEqual(samples, ['M1']);
        return { isPartial: true, sourceRequest: preview.remainingRequest, targetRequest: { ...preview.movingRequest, id: 'new' },
          sourceDraft: { ...draft, resultData: { M2: { value: 2 } } } };
      }
    }
  });
  return { component, calls, sourceKey };
}

test('partial transfer flushes dirty edits before splitting and keeps the source SOP/draft on screen', async () => {
  const { component, calls, sourceKey } = fixture();
  await component.confirmSopReassignment();
  assert.deepEqual(calls, ['pause', 'flush', 'reassign', 'toast', 'resume']);
  assert.equal(component.configKey(), sourceKey);
  assert.deepEqual(component.run().sampleList, ['M2']);
  assert.deepEqual(component.draft().resultData, { M2: { value: 2 } });
  assert.equal(component.autoSaveStatus(), 'synced');
  assert.equal(component.showSopReassignmentModal(), false);
});

test('a failed draft save prevents splitting and leaves the selection and unsaved edits available', async () => {
  const { component, calls } = fixture();
  component.flushCurrentDraft = async () => { calls.push('flush-failed'); return false; };
  await component.confirmSopReassignment();
  assert.equal(calls.includes('reassign'), false);
  assert.equal(calls.includes('queue'), true);
  assert.deepEqual(component.run().sampleList, ['M1', 'M2']);
  assert.equal(component.showSopReassignmentModal(), true);
  assert.match(component.sopReassignmentError(), /Chưa lưu được/);
});

test('late previews cannot override a newer sample selection for the same SOP', async () => {
  const { component } = fixture();
  const pending: ((value: any) => void)[] = [];
  component.sopReassignment.preview = () => new Promise(resolve => pending.push(resolve));
  const first = component.loadSopReassignmentPreview('target');
  component.selectedReassignmentSamples.set(['M2']);
  const second = component.loadSopReassignmentPreview('target');
  pending[1]({ movingRequest: { sampleList: ['M2'] } });
  await second;
  pending[0]({ movingRequest: { sampleList: ['M1'] } });
  await first;
  assert.deepEqual(component.sopReassignmentPreview().movingRequest.sampleList, ['M2']);
});
