import '@angular/compiler';
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  Injector,
  runInInjectionContext,
  ɵChangeDetectionScheduler as ChangeDetectionScheduler,
  ɵEffectScheduler as EffectScheduler,
  ɵMicrotaskEffectScheduler as MicrotaskEffectScheduler,
  ɵPendingTasksInternal as PendingTasksInternal
} from '@angular/core';
import { ToastService } from '../../core/services/toast.service';
import { SmartPrepComponent } from './smart-prep.component';

function setup() {
  const injector = Injector.create({ providers: [
    { provide: ToastService, useValue: { show() {} } },
    { provide: ChangeDetectionScheduler, useValue: { notify() {}, runningTick: false } },
    PendingTasksInternal,
    { provide: EffectScheduler, useClass: MicrotaskEffectScheduler }
  ] });
  return runInInjectionContext(injector, () => new SmartPrepComponent());
}

function dilution() {
  const ui = setup();
  ui.targetName.set('Chuẩn kiểm tra');
  ui.targetSourceValue.set(1000);
  ui.targetValue.set(10);
  ui.targetFinalVolume.set(10);
  return ui;
}

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length(): number { return this.values.size; }
  clear(): void { this.values.clear(); }
  getItem(key: string): string | null { return this.values.get(key) ?? null; }
  key(index: number): string | null { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string): void { this.values.delete(key); }
  setItem(key: string, value: string): void { this.values.set(key, value); }
}

async function flushEffects(): Promise<void> {
  await Promise.resolve();
}

async function withLocalStorage(run: (storage: MemoryStorage) => Promise<void>): Promise<void> {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const storage = new MemoryStorage();
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage });
  try {
    await run(storage);
    await flushEffects();
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor);
    else delete (globalThis as typeof globalThis & { localStorage?: Storage }).localStorage;
  }
}

function draftState(ui: SmartPrepComponent): Record<string, unknown> {
  return (ui as unknown as { snapshotDraftState(): Record<string, unknown> }).snapshotDraftState();
}

test('new preparation starts empty and cannot be exported as a completed calculation', () => {
  const ui = setup();
  assert.equal(ui.calcMode(), 'target');
  assert.equal(ui.calculation().output, null);
  assert.equal(ui.canExport(), false);
  assert.equal(ui.targetPotency(), null);
  assert.deepEqual(ui.seriesAdditions(), []);
});

test('blank stored draft roundtrips with empty additions and is cleaned after restore', async () => {
  await withLocalStorage(async storage => {
    const seed = setup();
    await flushEffects();
    storage.setItem('lims.smart-prep.draft.v1', JSON.stringify({
      version: 1,
      savedAt: '2026-09-07T00:00:00.000Z',
      state: draftState(seed)
    }));

    const restored = setup();
    assert.equal(restored.draftRestoreNotice(), null);
    assert.equal(restored.calcMode(), 'target');
    assert.deepEqual(restored.seriesAdditions(), []);
    assert.deepEqual(restored.seriesSources(), seed.seriesSources());

    await flushEffects();
    assert.equal(storage.getItem('lims.smart-prep.draft.v1'), null);
  });
});

test('unfinished series draft keeps a stale source reference so the user can repair it', async () => {
  await withLocalStorage(async storage => {
    const seed = setup();
    await flushEffects();
    const state = draftState(seed);
    state['calcMode'] = 'series';
    state['seriesPoints'] = seed.seriesPoints().map(point => ({
      ...point,
      targetConcentration: 10,
      finalVolume: 10,
      sourceId: 'source-deleted'
    }));
    storage.setItem('lims.smart-prep.draft.v1', JSON.stringify({
      version: 1,
      savedAt: '2026-09-07T00:00:00.000Z',
      state
    }));

    const restored = setup();
    assert.equal(restored.draftRestoreNotice(), null);
    assert.equal(restored.calcMode(), 'series');
    assert.equal(restored.seriesPoints()[0].sourceId, 'source-deleted');
    assert.equal(restored.canExport(), false);

    await flushEffects();
    const saved = storage.getItem('lims.smart-prep.draft.v1');
    assert.ok(saved);
    const savedState = JSON.parse(saved).state as { seriesPoints: { sourceId: string }[] };
    assert.equal(savedState.seriesPoints[0].sourceId, 'source-deleted');
  });
});

test('dilution ignores hidden solid corrections and uses optional actual input when entered', () => {
  const ui = dilution();
  ui.targetConversionFactor.set(-5);
  ui.targetMolecularWeight.set(-5);
  ui.targetPotency.set(-5);
  ui.targetActualValue.set(98);
  const output = ui.calculation().output;
  assert.equal(output?.kind, 'target');
  if (output?.kind !== 'target') return;
  assert.equal(output.plannedQuantity.displayValue, 100);
  assert.ok(Math.abs(output.actualConcentration!.massPerVolumeGPerL - 0.0098) < 1e-12);
  assert.match(ui.resultText(), /Lượng đã cân \/ hút: 98/);
});

test('solid preparation requires declared purity and applies salt correction only when selected', () => {
  const ui = dilution();
  ui.setTargetSourceType('solid');
  assert.equal(ui.calculation().output, null);
  assert.ok(ui.calculation().issues.some(issue => issue.path === 'substance.potencyPercent'));
  ui.targetPotency.set(98.5);
  ui.targetConversionFactor.set(0.5);
  const uncorrected = ui.calculation().output;
  assert.equal(uncorrected?.kind, 'target');
  if (uncorrected?.kind !== 'target') return;
  ui.useTargetConversion.set(true);
  const corrected = ui.calculation().output;
  assert.equal(corrected?.kind, 'target');
  if (corrected?.kind !== 'target') return;
  assert.equal(corrected.plannedQuantity.canonicalValue, uncorrected.plannedQuantity.canonicalValue * 2);
});

test('source and target mass fractions use their own densities', () => {
  const ui = dilution();
  ui.targetSourceChoice.set('percent_ww');
  ui.targetSourceValue.set(20);
  ui.targetSourceDensity.set(1.2);
  ui.targetChoice.set('percent_ww');
  ui.targetValue.set(2);
  ui.targetDensity.set(1.05);
  ui.targetFinalVolume.set(100);
  const output = ui.calculation().output;
  assert.equal(output?.kind, 'target');
  if (output?.kind !== 'target') return;
  assert.ok(Math.abs(output.plannedQuantity.canonicalValue - 8.75) < 1e-12);
});

test('already prepared concentration requires actual quantity and calculates deviation', () => {
  const ui = setup();
  ui.setCalcMode('concentration');
  ui.concentrationName.set('Chuẩn A');
  ui.concentrationPotency.set(98.5);
  ui.concentrationFinalVolume.set(10);
  assert.equal(ui.canExport(), false);
  ui.concentrationActualValue.set(10.2);
  const output = ui.calculation().output;
  assert.equal(output?.kind, 'concentration');
  if (output?.kind !== 'concentration') return;
  assert.ok(Math.abs(output.actualConcentration.massPerVolumeGPerL - 1.0047) < 1e-12);
  ui.useConcentrationComparison.set(true);
  assert.equal(ui.canExport(), false);
  ui.concentrationTargetValue.set(1000);
  assert.equal(ui.canExport(), true);
});

test('ready-made stock needs no preparation volume and additions can be completely removed', () => {
  const ui = setup();
  ui.setCalcMode('series');
  ui.updateSeriesSource('source-root', 'concentration', 1000);
  ui.updateSeriesPoint('point-1', 'targetConcentration', 10);
  ui.updateSeriesPoint('point-1', 'finalVolume', 10);
  assert.equal(ui.calculation().status, 'valid', JSON.stringify(ui.calculation().issues));
  ui.addAddition();
  const id = ui.seriesAdditions()[0].id;
  ui.removeAddition(id);
  assert.deepEqual(ui.seriesAdditions(), []);
  assert.equal(ui.calculation().status, 'valid', JSON.stringify(ui.calculation().issues));
});

test('switching source type clears quantities whose physical meaning changed', () => {
  const ui = dilution();
  ui.targetActualValue.set(98);
  ui.setTargetSourceType('solid');
  assert.equal(ui.targetActualValue(), null);
  assert.equal(ui.targetQuantityUnit(), 'mg');
});

test('new sheet clears optional corrections, metadata, dynamic rows and all old results', () => {
  const ui = dilution();
  ui.targetActualValue.set(98);
  ui.sheetSource.set('LOT-TEST');
  ui.sheetMethod.set('SOP-TEST v1');
  ui.targetSourceDensity.set(1.2);
  ui.addSeriesSource();
  ui.addAddition();
  assert.match(ui.resultText(), /LOT-TEST/);
  assert.match(ui.resultText(), /SOP-TEST v1/);
  ui.resetDraft();
  assert.equal(ui.canExport(), false);
  assert.equal(ui.sheetSource(), '');
  assert.equal(ui.targetActualValue(), null);
  assert.equal(ui.targetSourceDensity(), null);
  assert.equal(ui.seriesSources().length, 1);
  assert.deepEqual(ui.seriesAdditions(), []);
});

test('final-total spike requires a declared background including explicit zero', () => {
  const ui = setup();
  ui.setCalcMode('spike');
  ui.spikeStandardName.set('Chuẩn A');
  ui.spikeSampleName.set('Mẫu kiểm tra');
  ui.spikeSampleValue.set(5);
  ui.spikeStandardValue.set(10);
  ui.spikeTargetValue.set(0.05);
  ui.spikeSemantic.set('final_total');
  assert.equal(ui.canExport(), false);
  ui.spikeInitialValue.set(0);
  assert.equal(ui.calculation().status, 'valid', JSON.stringify(ui.calculation().issues));
});

test('molar reporting requires molar mass and reports the requested unit without a target comparison', () => {
  const ui = setup();
  ui.setCalcMode('concentration');
  ui.concentrationName.set('NaCl');
  ui.concentrationActualValue.set(58.44);
  ui.concentrationFinalVolume.set(100);
  ui.concentrationPotency.set(100);
  ui.concentrationResultChoice.set('molar_mm');
  assert.equal(ui.canExport(), false);
  ui.concentrationMolecularWeight.set(58.44);
  const output = ui.calculation().output;
  assert.equal(output?.kind, 'concentration');
  if (output?.kind !== 'concentration') return;
  assert.equal(ui.displaySnapshot(output.actualConcentration, 'molar_mm'), '10 mM (mmol/L)');
  assert.match(ui.resultText(), /10 mM \(mmol\/L\)/);
});

test('linked addition inherits concentration, ignores the inactive dose and requires an explicit scope', () => {
  const ui = setup();
  ui.setCalcMode('series');
  ui.updateSeriesSource('source-root', 'concentration', 1000);
  ui.updateSeriesPoint('point-1', 'targetConcentration', 10);
  ui.updateSeriesPoint('point-1', 'finalVolume', 10);
  ui.addAddition();
  const id = ui.seriesAdditions()[0].id;
  ui.updateAddition(id, 'name', 'Nội chuẩn kiểm tra');
  ui.updateAddition(id, 'sourceId', 'source-root');
  ui.updateAddition(id, 'fixedVolume', 0.1);
  ui.updateAddition(id, 'targetLevel', -50);
  assert.equal(ui.calculation().status, 'valid', JSON.stringify(ui.calculation().issues));
  ui.updateAddition(id, 'dosing', 'concentration');
  ui.updateAddition(id, 'targetLevel', 20);
  const output = ui.calculation().output;
  assert.equal(output?.kind, 'series');
  if (output?.kind !== 'series') return;
  assert.equal(output.additionRows[0].volumeMl, 0.2);
  for (const type of ui.seriesObjectTypes) ui.toggleAdditionScope(id, type, false);
  assert.equal(ui.canExport(), false);
  assert.ok(ui.calculation().issues.some(issue => issue.code === 'MISSING_ADDITION_SCOPE'));
});

test('reporting retains the selected trace concentration unit and stock is not exported as a zero-volume preparation', () => {
  const ui = setup();
  ui.setCalcMode('concentration');
  ui.concentrationName.set('Chuẩn A');
  ui.concentrationActualValue.set(1);
  ui.concentrationFinalVolume.set(100);
  ui.concentrationPotency.set(100);
  const output = ui.calculation().output;
  assert.equal(output?.kind, 'concentration');
  if (output?.kind !== 'concentration') return;
  assert.equal(ui.displaySnapshot(output.actualConcentration, 'ug_ml'), '10 µg/mL');
  assert.equal(ui.displaySnapshot(output.actualConcentration, 'ug_l'), '10.000 µg/L');
  ui.setCalcMode('series');
  ui.updateSeriesSource('source-root', 'concentration', 1000);
  ui.updateSeriesPoint('point-1', 'targetConcentration', 10);
  ui.updateSeriesPoint('point-1', 'finalVolume', 10);
  assert.doesNotMatch(ui.resultText(), /thể tích pha 0/);
  assert.match(ui.resultText(), /dung dịch có sẵn/);
});
