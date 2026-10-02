/* Real Angular AOT UI with the offline library and manually entered source concentrations. */
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { execFileSync } = require('node:child_process');
const esbuild = require('esbuild');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

async function main() {
  const repo = path.resolve(__dirname, '..');
  const output = await fs.mkdtemp(path.join(os.tmpdir(), 'lims-prep-bench-'));
  console.log('Artifacts:', output);
  const compiled = path.join(output, 'compiled');
  execFileSync(process.execPath, [path.join(repo, 'node_modules/@angular/compiler-cli/bundles/src/bin/ngc.js'), '-p', path.join(repo, 'tsconfig.app.json'), '--outDir', compiled], { stdio: 'pipe' });
  const entry = `
    import '@angular/compiler';
    import { Component, ViewChild, provideZonelessChangeDetection } from '@angular/core';
    import { bootstrapApplication } from '@angular/platform-browser';
    import { SmartPrepComponent } from './src/app/features/preparation/smart-prep.component';
    import { formulaSubstanceOption } from './src/app/features/preparation/prep-substance-catalog';
    @Component({selector:'prep-fixture',standalone:true,imports:[SmartPrepComponent],template:'<app-smart-prep />'})
    class Fixture {
      @ViewChild(SmartPrepComponent) prep;
      ngAfterViewInit() {
        window.prepFixture=this.prep;
        window.formulaOption=formulaSubstanceOption;
      }
    }
    bootstrapApplication(Fixture,{providers:[provideZonelessChangeDetection()]}).then(()=>window.fixtureReady=true);
  `;
  const mocks = {
    'toast.service': `import {Injectable} from '@angular/core'; @Injectable({providedIn:'root'}) export class ToastService {show(message){(window.messages||=[]).push(message);}}`
  };
  await esbuild.build({ stdin: { contents: entry, resolveDir: repo, sourcefile: 'prep-fixture.ts', loader: 'ts' }, outfile: path.join(output, 'fixture.js'), bundle: true, platform: 'browser', format: 'iife', nodePaths: [path.join(repo, 'node_modules')], tsconfig: path.join(repo, 'tsconfig.json'), logLevel: 'warning', plugins: [{ name: 'mock-toast', setup(build) {
    build.onResolve({ filter: /^\.\/src\// }, args => ({ path: path.join(compiled, args.path.slice('./src/'.length) + '.js') }));
    build.onResolve({ filter: /toast\.service$/ }, args => ({ path: args.path.split('/').pop(), namespace: 'mock' }));
    build.onLoad({ filter: /.*/, namespace: 'mock' }, args => ({ contents: mocks[args.path], loader: 'ts', resolveDir: repo }));
  } }] });
  const css = await postcss([tailwindcss(require('../tailwind.config')), require('autoprefixer')]).process(await fs.readFile(path.join(repo, 'src/styles.css'), 'utf8'), { from: path.join(repo, 'src/styles.css') });
  await fs.writeFile(path.join(output, 'fixture.css'), css.css);
  const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/fixture.css"><link rel="stylesheet" href="/fonts.css"><link rel="stylesheet" href="/icons.css"></head><body style="padding:20px;background:#f8fafc"><prep-fixture></prep-fixture><script src="/fixture.js"></script></body></html>';
  const server = http.createServer(async (request, response) => {
    try {
      if (request.url === '/') { response.setHeader('Content-Type', 'text/html; charset=utf-8'); response.end(html); return; }
      let file;
      if (request.url === '/icons.css') file = path.join(repo, 'node_modules/@fortawesome/fontawesome-free/css/all.min.css');
      if (request.url === '/fonts.css') { response.setHeader('Content-Type', 'text/css'); response.end((await Promise.all([400,500,600,700,800].map(weight => fs.readFile(path.join(repo, 'node_modules/@fontsource/open-sans', weight + '.css'), 'utf8')))).join('\n')); return; }
      if (request.url.startsWith('/files/')) file = path.join(repo, 'node_modules/@fontsource/open-sans/files', path.basename(request.url));
      if (request.url.startsWith('/webfonts/')) file = path.join(repo, 'node_modules/@fortawesome/fontawesome-free/webfonts', path.basename(request.url));
      if (request.url === '/fixture.js' || request.url === '/fixture.css') file = path.join(output, request.url.slice(1));
      if (!file) { response.writeHead(404); response.end(); return; }
      if (file.endsWith('.js')) response.setHeader('Content-Type', 'text/javascript');
      if (file.endsWith('.css')) response.setHeader('Content-Type', 'text/css');
      response.end(await fs.readFile(file));
    } catch { response.writeHead(500); response.end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ channel: process.env.PREP_BROWSER_CHANNEL || 'msedge', headless: true });
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    const errors = [], externalRequests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:')) externalRequests.push(request.url()); });
    await page.addInitScript(() => {
      const draftKey = 'lims.smart-prep.draft.v1';
      localStorage.setItem(draftKey, JSON.stringify({ version: 1, state: { targetName: 'PRIVATE-PREVIOUS-USER', targetSourceValue: 1000 } }));
      localStorage.setItem('fixture-protected-cache', 'PRIVATE-CACHE-CONTENT');
      const getItem = Storage.prototype.getItem;
      const setItem = Storage.prototype.setItem;
      window.prepStorageReads = [];
      window.prepStorageWrites = [];
      window.fixtureStoredValue = key => getItem.call(localStorage, key);
      Storage.prototype.getItem = function(key) {
        if (key === draftKey || key === 'fixture-protected-cache') window.prepStorageReads.push(key);
        return getItem.call(this, key);
      };
      Storage.prototype.setItem = function(key, value) {
        if (key === draftKey) window.prepStorageWrites.push(key);
        return setItem.call(this, key, value);
      };
    });
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.waitForFunction(() => window.fixtureReady);
    assert.equal(await page.getByRole('button', { name: 'Sao chép kết quả', exact: true }).isDisabled(), true);
    assert.doesNotMatch(await page.locator('body').innerText(), /PRIVATE-PREVIOUS-USER|PRIVATE-CACHE-CONTENT/);
    assert.deepEqual(await page.evaluate(() => window.prepStorageReads), []);
    assert.equal(await page.evaluate(() => window.fixtureStoredValue('lims.smart-prep.draft.v1')), null);
    assert.equal(await page.evaluate(() => window.fixtureStoredValue('fixture-protected-cache')), 'PRIVATE-CACHE-CONTENT');
    await page.getByRole('searchbox').fill('HNO3');
    await page.getByRole('button', { name: /HNO₃ 65%.*Thư viện/ }).click();
    assert.deepEqual(await page.evaluate(() => [window.prepFixture.targetMolecularWeight(), window.prepFixture.targetSourceDensity(), window.prepFixture.targetSourceValue()]), [63.01, 1.4, 65]);
    await page.getByRole('button', { name: 'Phép tính mới', exact: true }).click();
    await page.getByText('Thông số nguồn · chỉnh theo lô thực tế', { exact: true }).click();
    await page.getByLabel('Tên chất / dung dịch', { exact: true }).fill('Dung dịch chuẩn Cu đã pha');
    await page.locator('#targetSourceValue').fill('1000');
    await page.getByText('Thông số nguồn · chỉnh theo lô thực tế', { exact: true }).click();
    await page.locator('#targetValue').fill('10');
    await page.locator('#targetFinalVolume').fill('100');
    await page.waitForFunction(() => window.prepFixture.calculation().status === 'valid');
    assert.ok((await page.locator('aside').innerText()).includes('1 mL'));
    assert.equal(await page.locator('app-a4-document-preview').count(), 0);
    await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { window.copiedText = text; } } }); });
    await page.getByRole('button', { name: 'Sao chép kết quả', exact: true }).click();
    assert.match(await page.evaluate(() => window.copiedText), /Pha 100 mL.*Hút 1 mL.*P1000/);
    await page.screenshot({ path: path.join(output, 'target-desktop.png'), fullPage: true, animations: 'disabled' });
    for (const mode of ['concentration', 'spike', 'series', 'result_conversion']) {
      await page.evaluate(mode => {
        const ui = window.prepFixture;
        ui.resetDraft(); ui.setCalcMode(mode);
        if (mode === 'concentration') { ui.selectSubstance(window.formulaOption('NaCl')); ui.concentrationPotency.set(100); ui.concentrationActualValue.set(58.44); ui.concentrationFinalVolume.set(100); }
        if (mode === 'spike') { ui.spikeStandardName.set('Dung dịch chuẩn Cu đã pha'); ui.spikeStandardValue.set(1000); ui.spikeStandardChoice.set('mg_l'); ui.spikeSampleValue.set(5); ui.spikeTargetValue.set(10); }
        if (mode === 'series') { const id = ui.seriesSources()[0].id; ui.updateSeriesSource(id, 'name', 'Dung dịch chuẩn Cu đã pha'); ui.updateSeriesSource(id, 'concentration', 1000); ui.updateSeriesSource(id, 'concentrationChoice', 'mg_l'); ui.quickSeriesText.set('1, 2, 5, 10, 20'); ui.quickSeriesVolume.set(100); ui.applyQuickSeries(); }
        if (mode === 'result_conversion') { ui.resultSampleValue.set(5); ui.resultInstrumentValue.set(2); ui.resultFinalVolume.set(50); ui.resultDilutionFactor.set(10); ui.resultRecoveryPercent.set(80); }
        if (ui.calculation().status !== 'valid') throw new Error(JSON.stringify(ui.calculation().issues));
      }, mode);
      await page.waitForFunction(() => document.querySelector('aside')?.textContent.includes('Đã tính được kết quả'));
      await page.screenshot({ path: path.join(output, mode + '-desktop.png'), fullPage: true, animations: 'disabled' });
    }
    await page.evaluate(() => { const ui = window.prepFixture; ui.resetDraft(); ui.targetName.set('Dung dịch chuẩn Cu đã pha'); ui.targetSourceValue.set(1000); ui.targetValue.set(10); ui.targetFinalVolume.set(100); });
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    await page.screenshot({ path: path.join(output, 'target-mobile.png'), fullPage: true, animations: 'disabled' });
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.screenshot({ path: path.join(output, 'target-mobile-dark.png'), fullPage: true, animations: 'disabled' });
    assert.deepEqual(await page.evaluate(() => window.prepStorageWrites), []);
    await page.reload();
    await page.waitForFunction(() => window.fixtureReady);
    assert.equal(await page.locator('#targetValue').inputValue(), '');
    assert.equal(await page.locator('#targetFinalVolume').inputValue(), '');
    assert.equal(await page.getByRole('button', { name: 'Sao chép kết quả', exact: true }).isDisabled(), true);
    assert.doesNotMatch(await page.locator('body').innerText(), /PRIVATE-PREVIOUS-USER|PRIVATE-CACHE-CONTENT|Dung dịch chuẩn Cu đã pha/);
    assert.deepEqual(await page.evaluate(() => window.prepStorageReads), []);
    assert.deepEqual(errors, []);
    assert.deepEqual(externalRequests, []);
    console.log('PASS: five calculator modes, offline picker, manual source parameters, copy, desktop/mobile/dark, shared-device privacy and no external requests.');
    console.log('Artifacts:', output);
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
