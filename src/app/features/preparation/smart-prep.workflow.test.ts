import '@angular/compiler';
import assert from 'node:assert/strict';
import test from 'node:test';
import { Injector, runInInjectionContext } from '@angular/core';
import { Router, type ActivatedRouteSnapshot, type RouterStateSnapshot } from '@angular/router';
import { routes } from '../../app.routes';
import { AuthService } from '../../core/services/auth.service';
import { permissionGuard } from '../../core/guards/permission.guard';
import { ToastService } from '../../core/services/toast.service';
import { PREP_SUBSTANCE_LIBRARY, formulaSubstanceOption } from './prep-substance-catalog';
import { SmartPrepComponent } from './smart-prep.component';

function setup() {
  const injector = Injector.create({ providers: [
    { provide: ToastService, useValue: { show() {} } }
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

test('offline substance selection clears stale source constants and actual quantities', () => {
  const ui = dilution();
  ui.targetActualValue.set(98);
  ui.targetMolecularWeight.set(100);
  ui.targetSourceDensity.set(1.2);
  ui.selectSubstance(formulaSubstanceOption('NaCl')!);
  assert.equal(ui.targetSourceType(), 'solid');
  assert.equal(ui.targetSourceValue(), null);
  assert.equal(ui.targetActualValue(), null);
  assert.ok(Math.abs(ui.targetMolecularWeight()! - 58.44) < 0.001);
  assert.equal(ui.targetSourceDensity(), null);
  assert.equal(ui.targetPotency(), null);
  assert.equal(ui.canExport(), false);
  ui.targetPotency.set(100);
  assert.equal(ui.calculation().status, 'valid');
  ui.resetDraft();
  assert.equal(ui.targetSourceNote(), '');
});

test('offline concentrate applies source density while leaving target solution density independent', () => {
  const ui = setup();
  ui.applyPresetChemical('hno3-65');
  ui.targetValue.set(0.1);
  ui.targetChoice.set('molar_m');
  ui.targetFinalVolume.set(100);
  const output = ui.calculation().output;
  assert.equal(output?.kind, 'target');
  if (output?.kind !== 'target') return;
  assert.ok(Math.abs(output.plannedQuantity.canonicalValue - 0.69241758) < 1e-7);
  assert.equal(ui.targetDensity(), null);
});

test('hydrate defaults to whole salt and explicit copper selection changes both f and analyte M', () => {
  const ui = setup();
  ui.selectSubstance(PREP_SUBSTANCE_LIBRARY.find(option => option.formula === 'CuSO4.5H2O')!);
  assert.equal(ui.useTargetConversion(), false);
  assert.equal(ui.targetPotency(), null);
  ui.targetPotency.set(100);
  ui.targetChoice.set('molar_m');
  ui.targetValue.set(0.1);
  ui.targetFinalVolume.set(100);
  ui.selectSpecies('Cu');
  assert.equal(ui.targetMolecularWeight(), 63.546);
  assert.ok(Math.abs(ui.targetConversionFactor()! - 0.254506) < 0.00001);
  const output = ui.calculation().output;
  assert.equal(output?.kind, 'target');
  if (output?.kind !== 'target') return;
  assert.ok(Math.abs(output.plannedQuantity.canonicalValue - 2.49677) < 0.00001);
  ui.selectSubstance(formulaSubstanceOption('NaCl')!);
  assert.equal(ui.useTargetConversion(), false);
  assert.equal(ui.targetSpecies(), '');
  assert.equal(ui.targetConversionFactor(), 1);
  assert.equal(ui.targetPotency(), null);
});

test('concentration mode includes molar alternatives from a parsed formula while reporting mass concentration', () => {
  const ui = setup();
  ui.setCalcMode('concentration');
  ui.selectSubstance(formulaSubstanceOption('NaCl')!);
  ui.concentrationPotency.set(100);
  ui.concentrationActualValue.set(58.44);
  ui.concentrationFinalVolume.set(100);
  const output = ui.calculation().output;
  assert.equal(output?.kind, 'concentration');
  if (output?.kind !== 'concentration') return;
  assert.ok(Math.abs(output.actualConcentration.molarM! - 0.01) < 1e-7);
});

test('spike and direct series use manually entered stock concentrations without sample metadata', () => {
  const ui = setup();
  ui.setCalcMode('spike');
  ui.spikeStandardName.set('Chuẩn Cu đã pha');
  ui.spikeStandardValue.set(10);
  ui.spikeStandardChoice.set('mg_l');
  ui.spikeSampleValue.set(5);
  ui.spikeTargetValue.set(0.05);
  const spike = ui.calculation().output;
  assert.equal(spike?.kind, 'spike');
  if (spike?.kind !== 'spike') return;
  assert.ok(Math.abs(spike.spikeVolumeMl - 0.025) < 1e-12);
  ui.setCalcMode('series');
  const sourceId = ui.seriesSources()[0].id;
  ui.updateSeriesSource(sourceId, 'name', 'Chuẩn Cu đã pha');
  ui.updateSeriesSource(sourceId, 'concentration', 1);
  ui.updateSeriesSource(sourceId, 'concentrationChoice', 'mg_ml');
  ui.quickSeriesText.set('1, 2, 5, 10, 20');
  ui.quickSeriesVolume.set(100);
  ui.applyQuickSeries();
  const series = ui.calculation().output;
  assert.equal(series?.kind, 'series');
  if (series?.kind !== 'series') return;
  assert.deepEqual(series.pointRows.map(row => row.sourceVolumeMl), [0.1, 0.2, 0.5, 1, 2]);
});

test('simple result conversion applies C V F / m and optional recovery with correct units', () => {
  const ui = setup();
  ui.setCalcMode('result_conversion');
  ui.resultSampleValue.set(5);
  ui.resultInstrumentValue.set(2);
  ui.resultFinalVolume.set(50);
  ui.resultDilutionFactor.set(10);
  ui.resultRecoveryPercent.set(80);
  const output = ui.calculation().output;
  assert.equal(output?.kind, 'result_conversion');
  if (output?.kind !== 'result_conversion') return;
  assert.ok(Math.abs(output.resultValue - 250) < 1e-10);
  assert.equal(output.finalVolumeMl, 50);
  assert.equal(ui.calculation().issues.length, 0);
  ui.resultRecoveryPercent.set(null);
  assert.equal((ui.calculation().output as typeof output).resultValue, 200);
  ui.resultDilutionFactor.set(0);
  assert.equal(ui.canExport(), false);
  ui.resultDilutionFactor.set(1);
  ui.resultRecoveryPercent.set(0);
  assert.equal(ui.canExport(), false);
  ui.resultRecoveryPercent.set(null);
  ui.setResultSampleBase('volume');
  ui.resultSampleValue.set(10);
  ui.resultUnit.set('mg/L');
  assert.equal((ui.calculation().output as typeof output).resultValue, 10);
});

test('advanced result conversion uses only steps entered in the current calculation', () => {
  const ui = setup();
  ui.setCalcMode('result_conversion');
  ui.advancedResultSteps.set(true);
  ui.resultSampleValue.set(5);
  ui.resultInstrumentValue.set(2);
  ui.updateStep('step-extract', 'volume', 50);
  const output = ui.calculation().output;
  assert.equal(output?.kind, 'result_conversion');
  if (output?.kind === 'result_conversion') assert.equal(output.resultValue, 20);
});

test('offline search immediately resolves names and formulas without an external service', () => {
  const ui = setup();
  ui.searchSubstance('Đồng sulfat');
  assert.ok(ui.substanceOptions().some(option => option.formula === 'CuSO4.5H2O' && option.origin === 'library'));
  ui.searchSubstance('MgSO4.7H2O');
  assert.ok(ui.substanceOptions().some(option => option.formula === 'MgSO4.7H2O' && option.origin === 'formula'));
  ui.searchSubstance('Không có chất này');
  assert.deepEqual(ui.substanceOptions(), []);
  ui.setCalcMode('spike');
  assert.equal(ui.substanceQuery(), '');
  assert.ok(ui.substanceOptions().every(option => option.sourceType !== 'solid'));
});

test('copy text contains the bench operation and includes formulas only when requested', () => {
  assert.equal(setup().resultText(), '');
  const ui = dilution();
  assert.match(ui.resultText(), /Pha 10 mL/);
  assert.match(ui.resultText(), /Hút 100 µL/);
  assert.match(ui.resultText(), /P100/);
  assert.doesNotMatch(ui.resultText(), /PHIẾU|CÔNG THỨC|C_target/);
  ui.showTrace.set(true);
  assert.ok(ui.resultText().split('\n').length > 1);
});

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();
  readonly reads: string[] = [];
  readonly writes: string[] = [];

  get length(): number { return this.values.size; }
  clear(): void { this.values.clear(); }
  getItem(key: string): string | null { this.reads.push(key); return this.values.get(key) ?? null; }
  key(index: number): string | null { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string): void { this.values.delete(key); }
  setItem(key: string, value: string): void { this.writes.push(key); this.values.set(key, value); }
}

async function withBrowserStorage(name: 'localStorage' | 'sessionStorage', run: (storage: MemoryStorage) => Promise<void>): Promise<void> {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, name);
  const storage = new MemoryStorage();
  Object.defineProperty(globalThis, name, { configurable: true, value: storage });
  try {
    await run(storage);
    await Promise.resolve();
  } finally {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor);
    else Reflect.deleteProperty(globalThis, name);
  }
}

function checkRouteAccess(path: string, signedIn: boolean) {
  const route = routes.find(candidate => candidate.path === path)!;
  assert.ok(route.canActivate?.includes(permissionGuard), path + ' must use the permission guard');
  const navigations: { commands: string[]; options?: unknown }[] = [];
  const injector = Injector.create({ providers: [
    { provide: AuthService, useValue: {
      currentUser: () => signedIn ? { uid: 'calculator-user', role: 'staff' } : null,
      isManager: () => false,
      isStandardAuditMode: () => false,
      hasPermission: () => false,
      getPermissionName: (permission: string) => permission
    } },
    { provide: Router, useValue: { navigate(commands: string[], options?: unknown) { navigations.push({ commands, options }); return Promise.resolve(true); } } },
    { provide: ToastService, useValue: { show() {} } }
  ] });
  const decision = runInInjectionContext(injector, () => permissionGuard(
    { data: route.data ?? {} } as ActivatedRouteSnapshot,
    { url: '/' + path } as RouterStateSnapshot
  ));
  return { decision, navigations };
}

test('anonymous users cannot open prep through a direct link', async () => {
  await withBrowserStorage('sessionStorage', async storage => {
    const access = checkRouteAccess('prep', false);
    assert.equal(access.decision, false);
    assert.deepEqual(access.navigations.map(item => item.commands), [['/']]);
    assert.equal(storage.getItem('__lims_intended_route'), '#/prep');
  });
});

test('signed-in users without operational permissions can calculate but cannot open business data', () => {
  const access = checkRouteAccess('prep', true);
  assert.equal(access.decision, true);
  assert.deepEqual(access.navigations, []);
  for (const path of ['inventory', 'standards', 'results']) {
    const denied = checkRouteAccess(path, true);
    assert.equal(denied.decision, false, path);
    assert.deepEqual(denied.navigations.map(item => item.commands), [['/403']], path);
  }
});

test('new preparation starts empty and cannot be exported as a completed calculation', () => {
  const ui = setup();
  assert.equal(ui.calcMode(), 'target');
  assert.equal(ui.calculation().output, null);
  assert.equal(ui.canExport(), false);
  assert.equal(ui.targetPotency(), null);
  assert.deepEqual(ui.seriesAdditions(), []);
});

test('calculator never reads another user cache and removes only its legacy shared draft', async () => {
  await withBrowserStorage('localStorage', async storage => {
    storage.setItem('lims.smart-prep.draft.v1', JSON.stringify({ version: 1, state: { targetName: 'Private lot from previous user', targetSourceValue: 1000, targetValue: 10 } }));
    storage.setItem('private-lims-cache', 'Other protected data');
    storage.writes.length = 0;
    const ui = setup();
    assert.deepEqual(storage.reads, []);
    assert.deepEqual(storage.writes, []);
    assert.equal(ui.targetName(), '');
    assert.equal(ui.targetSourceValue(), null);
    assert.equal(ui.calculation().output, null);
    assert.equal(storage.getItem('lims.smart-prep.draft.v1'), null);
    assert.equal(storage.getItem('private-lims-cache'), 'Other protected data');
  });
});

test('calculation stays in memory and a new calculator cannot inherit the previous input', async () => {
  await withBrowserStorage('localStorage', async storage => {
    const first = dilution();
    assert.equal(first.calculation().status, 'valid');
    await Promise.resolve();
    assert.deepEqual(storage.reads, []);
    assert.deepEqual(storage.writes, []);
    assert.equal(storage.length, 0);
    const next = setup();
    assert.equal(next.targetName(), '');
    assert.equal(next.targetValue(), null);
    assert.equal(next.calculation().output, null);
    assert.equal(next.resultText(), '');
  });
});

test('denied browser storage does not prevent calculation', () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('Storage denied'); } });
  try {
    assert.equal(dilution().calculation().status, 'valid');
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  }
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

test('reset clears selected substance, optional corrections, dynamic rows and all old results', () => {
  const ui = dilution();
  ui.targetActualValue.set(98);
  ui.targetSourceDensity.set(1.2);
  ui.addSeriesSource();
  ui.addAddition();
  ui.resetDraft();
  assert.equal(ui.canExport(), false);
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
