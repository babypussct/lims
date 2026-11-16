import assert from 'node:assert/strict';
import test from 'node:test';
import { ANGULAR_SOP_CONFIG } from './config/sop-configs';
import { buildLivePreflightState } from './result-preflight-ui';

test('buildLivePreflightState resolves jump targets for missing dates, samples and R2', () => {
  const config = ANGULAR_SOP_CONFIG['chloroform-gcms'];
  const state = buildLivePreflightState({
    run: {
      id: 'R1',
      sopId: '9.20-chloroform',
      sampleList: ['S01', 'S02'],
    },
    draft: {
      requestId: 'R1',
      sopId: '9.20-chloroform',
      status: 'draft',
      version: 1,
      updatedBy: 'tester',
      updatedAt: '',
      page1Data: {
        ngayNguoiPhanTich: '',
        ngayNguoiThamTra: '2026-11-16',
        r2: '',
      },
      resultData: {
        S01: { selected: true, kqChloroform: '' },
        S02: { selected: true, kqChloroform: 'ND' },
      },
    } as any,
    config,
    configKey: 'chloroform-gcms',
    activeFilter: 'ALL',
    samplesPerReport: null,
    unpublishedSamples: ['S01', 'S02'],
  });

  assert.equal(state.isReady, false);
  assert.equal(state.blockerCount, 2);
  assert.equal(state.warningCount, 1);

  const dateItem = state.items.find(i => i.targetKind === 'date_analyst');
  assert.ok(dateItem);
  const sampleItem = state.items.find(i => i.targetKind === 'incomplete_sample');
  assert.equal(sampleItem?.sampleCode, 'S01');
  const r2Item = state.items.find(i => i.targetKind === 'r2');
  assert.ok(r2Item);
});

test('buildLivePreflightState matches SOP 9.14 formRutGon publish rules and does not falsely require R2', () => {
  const baseConfig = ANGULAR_SOP_CONFIG['tbvtv-thuc-pham-gcmsms'];
  const state = buildLivePreflightState({
    run: {
      id: 'R914',
      sopId: '9.14-tbvtv-gcmsms',
      sampleList: ['A01'],
      sampleTargetMap: {
        A01: ['Acetamiprid'],
      },
    },
    draft: {
      requestId: 'R914',
      sopId: '9.14-tbvtv-gcmsms',
      status: 'draft',
      version: 1,
      updatedBy: 'tester',
      updatedAt: '',
      page1Data: {
        printFormType: 'formRutGon',
        ngayNguoiPhanTich: '2026-11-16',
        ngayNguoiThamTra: '2026-11-16',
      },
      resultData: {
        A01: { selected: true, Acetamiprid: '1.25' },
      },
    } as any,
    config: baseConfig,
    configKey: 'tbvtv-thuc-pham-gcmsms',
    activeFilter: 'ALL',
    samplesPerReport: null,
    unpublishedSamples: ['A01'],
  });

  assert.equal(state.isReady, true);
  assert.equal(state.blockerCount, 0);
  assert.equal(state.warningCount, 0);
});

test('buildLivePreflightState honors blank-as-ND rule for SOP-01 and SOP-03', () => {
  const config = ANGULAR_SOP_CONFIG['fipronil-chlorpyrifos'];
  const state = buildLivePreflightState({
    run: {
      id: 'R01',
      sopId: 'SOP-01',
      sampleList: ['B01'],
    },
    draft: {
      requestId: 'R01',
      sopId: 'SOP-01',
      status: 'draft',
      version: 1,
      updatedBy: 'tester',
      updatedAt: '',
      page1Data: {
        ngayNguoiPhanTich: '2026-11-16',
        ngayNguoiThamTra: '2026-11-16',
      },
      resultData: {
        B01: { selected: true },
      },
    } as any,
    config,
    configKey: 'fipronil-chlorpyrifos',
    activeFilter: 'ALL',
    samplesPerReport: null,
    unpublishedSamples: ['B01'],
  });

  assert.equal(state.isReady, true);
  assert.equal(state.blockerCount, 0);
});
