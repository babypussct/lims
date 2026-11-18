import type { ReportCardProjection } from './result-reports-projection';

export function drivePdfId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || !['drive.google.com', 'docs.google.com'].includes(parsed.hostname)) return null;
    return parsed.pathname.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1] || parsed.searchParams.get('id');
  } catch { return null; }
}

export function orderPrintReports(cards: ReportCardProjection[], samples: string[]): ReportCardProjection[] {
  const positions = new Map(samples.map((s, i) => [s, i]));
  const first = (card: ReportCardProjection) => Math.min(...card.samples.map(s => positions.get(s) ?? Infinity));
  return [...cards].sort((a, b) => first(a) - first(b)
    || (a.samples[0] || '').localeCompare(b.samples[0] || '', undefined, { numeric: true })
    || a.id.localeCompare(b.id, undefined, { numeric: true }));
}

export function defaultPrintReports(cards: ReportCardProjection[], samples: string[]): ReportCardProjection[] {
  const selected: ReportCardProjection[] = [];
  const used = new Set<string>();
  const eligible = cards.filter(c => !c.isStale && !['archived', 'stale'].includes(c.status || '')
    && !!(c.pdfUrl || c.pdfViewUrl) && c.samples.length > 0);
  for (const card of [...eligible].sort((a, b) => b.samples.length - a.samples.length || b.version - a.version)) {
    if (card.samples.some(s => used.has(s))) continue;
    selected.push(card);
    card.samples.forEach(s => used.add(s));
  }
  return orderPrintReports(selected, samples);
}

export function duplicatePrintSamples(cards: ReportCardProjection[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  cards.forEach(c => c.samples.forEach(s => { if (seen.has(s)) duplicates.add(s); seen.add(s); }));
  return [...duplicates];
}

export async function mergeReportPdfs(
  cards: ReportCardProjection[],
  download: (card: ReportCardProjection, signal: AbortSignal) => Promise<Blob>,
  signal: AbortSignal,
  progress: (done: number) => void,
): Promise<{ blob: Blob; pages: number }> {
  const { PDFDocument } = await import('pdf-lib');
  signal.throwIfAborted();
  const documents: Awaited<ReturnType<typeof PDFDocument.load>>[] = new Array(cards.length);
  let next = 0;
  let done = 0;
  await Promise.all(Array.from({ length: Math.min(3, cards.length) }, async () => {
    while (next < cards.length) {
      signal.throwIfAborted();
      const index = next++;
      try {
        const blob = await download(cards[index], signal);
        signal.throwIfAborted();
        const document = await PDFDocument.load(await blob.arrayBuffer());
        if (!document.getPageCount()) throw new Error('PDF không có trang');
        documents[index] = document;
        signal.throwIfAborted();
        progress(++done);
      } catch (error) {
        signal.throwIfAborted();
        throw new Error(`Phiếu ${cards[index].title} (v${cards[index].version}): ${error instanceof Error ? error.message : 'Không tải được PDF'}`);
      }
    }
  }));
  if (!cards.length) throw new Error('Chưa chọn phiếu PDF.');
  const merged = await PDFDocument.create();
  for (const source of documents) {
    signal.throwIfAborted();
    const pages = await merged.copyPages(source, source.getPageIndices());
    pages.forEach(page => merged.addPage(page));
  }
  const bytes = await merged.save();
  signal.throwIfAborted();
  return { blob: new Blob([new Uint8Array(bytes)], { type: 'application/pdf' }), pages: merged.getPageCount() };
}
