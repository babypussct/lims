import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PDFDocument } from 'pdf-lib';
import { defaultPrintReports, drivePdfId, duplicatePrintSamples, mergeReportPdfs, orderPrintReports } from './report-bulk-print.utils';
import type { ReportCardProjection } from './result-reports-projection';
import { readFileSync } from 'node:fs';

const card = (id: string, samples = [id], extra = {}): ReportCardProjection => ({
  id, samples, title: id, subtitle: id, kind: 'group', prefix: '', version: 1,
  isStale: false, pdfUrl: 'https://drive.google.com/file/d/' + id + '/view', ...extra,
});

test('defaults exclude stale, archived, missing PDFs and overlapping ALL/group scopes', () => {
  const all = card('all', ['1', '2']);
  const cards = [card('1'), card('2'), all, card('3', ['3'], { isStale: true }),
    card('4', ['4'], { status: 'archived' }), card('5', ['5'], { pdfUrl: null })];
  assert.deepEqual(defaultPrintReports(cards, ['1', '2', '3', '4', '5']), [all]);
  assert.deepEqual(duplicatePrintSamples([all, cards[0]]), ['1']);
});

test('preserves batch order and natural numeric fallback', () => {
  assert.deepEqual(orderPrintReports([card('10'), card('2'), card('1')], []).map(c => c.id), ['1', '2', '10']);
  assert.deepEqual(orderPrintReports([card('1'), card('2')], ['2', '1']).map(c => c.id), ['2', '1']);
});

test('accepts Drive PDF URLs only', () => {
  assert.equal(drivePdfId('https://drive.google.com/open?id=abc'), 'abc');
  assert.equal(drivePdfId('https://evil.test/file/d/abc'), null);
  assert.equal(drivePdfId('javascript:alert(1)'), null);
});

test('five PDFs merge in selection order with mixed portrait/landscape and bounded downloads', async () => {
  const cards = ['1', '2', '3', '4', '5'].map(id => card(id));
  let active = 0; let maximum = 0;
  const progress: number[] = [];
  const result = await mergeReportPdfs(cards, async c => {
    maximum = Math.max(maximum, ++active);
    const pdf = await PDFDocument.create();
    const i = Number(c.id);
    pdf.addPage([100 + i, 200 + i]);
    pdf.addPage([300 + i, 100 + i]);
    const bytes = await pdf.save();
    active--;
    return new Blob([new Uint8Array(bytes)]);
  }, new AbortController().signal, n => progress.push(n));
  const merged = await PDFDocument.load(await result.blob.arrayBuffer());
  assert.equal(result.pages, 10);
  assert.ok(maximum <= 3);
  assert.deepEqual(progress, [1, 2, 3, 4, 5]);
  assert.deepEqual(merged.getPages().map(p => p.getWidth()), [101, 301, 102, 302, 103, 303, 104, 304, 105, 305]);
});

test('a failed third PDF rejects the whole operation and identifies the report', async () => {
  await assert.rejects(mergeReportPdfs(['1', '2', '3', '4', '5'].map(id => card(id)), async c => {
    if (c.id === '3') throw new Error('Hết quyền truy cập');
    const pdf = await PDFDocument.create(); pdf.addPage();
    return new Blob([new Uint8Array(await pdf.save())]);
  }, new AbortController().signal, () => {}), /Phiếu 3.*Hết quyền truy cập/);
});

test('cancelled operation produces no PDF', async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(mergeReportPdfs([card('1')], async () => new Blob(), controller.signal, () => {}), { name: 'AbortError' });
});

test('publishing records every successful chunk before the next chunk and preserves them on retry', () => {
  const source = readFileSync('src/app/features/results/result-entry.component.ts', 'utf8');
  const publish = source.slice(source.indexOf('const result = await this.resultService.publishReport('));
  assert.ok(publish.indexOf('if (!result.success)') < publish.indexOf('this.recentPublishedReports.update'));
  assert.ok(publish.indexOf('this.recentPublishedReports.update') < publish.indexOf('if (lastResult && lastResult.success)'));
  assert.match(source, /if \(retryFromChunkIndex === 0\) this.recentPublishedReports.set\(\[\]\)/);
  const template = readFileSync('src/app/features/results/result-entry.component.html', 'utf8');
  assert.match(template, /\[cards\]="recentPublishedReports\(\)"/);
  assert.match(template, /recentPublishedReports\(\).length < recentPublishExpected\(\)/);
});
