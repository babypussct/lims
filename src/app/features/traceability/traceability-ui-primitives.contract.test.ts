import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { getTraceabilitySearchCandidate, normalizeTraceabilityLookup } from '../../shared/utils/traceability-lookup';

const source = readFileSync(new URL('./traceability.component.ts', import.meta.url), 'utf8');
const appSource = readFileSync(new URL('../../app.component.ts', import.meta.url), 'utf8');

describe('traceability shared UI primitive integration', () => {
  it('uses shared page header, action buttons and empty state while retaining QR lookup semantics', () => {
    assert.match(source, /AppButtonComponent/);
    assert.match(source, /AppEmptyStateComponent/);
    assert.match(source, /AppPageHeaderComponent/);
    assert.match(source, /<app-page-header\b/);
    assert.match(source, /\[variant\]="id \? 'detail' : 'page'"/);
    assert.match(source, /pageHeaderLeading/);
    assert.match(source, /pageHeaderActions/);
    assert.match(source, /pageHeaderMeta/);
    assert.match(source, /openLookup\(\)/);
    assert.match(source, /<app-button\b[^>]*type="submit"/);
    assert.match(source, /<app-button\b[^>]*variant="secondary"[^>]*\(click\)="startQrScan\(\)"/);
    assert.match(source, /<app-empty-state\b/);
    assert.match(source, /\(ngSubmit\)="submitLookup\(\)"/);
    assert.match(source, /#lookupInput/);
    assert.match(source, /@if \(!id\) \{\s*<section/);
    assert.match(source, /getDistinctAssociatedRequestId\(\)/);
    assert.match(source, /min-h-full[^"]*shrink-0/);
    assert.match(source, /max-w-7xl/);
    assert.match(source, /p-4 md:p-6/);
    assert.doesNotMatch(source, /<app-page-header[^>]*border/);
    assert.doesNotMatch(source, /<app-page-header[^>]*shadow/);
    assert.doesNotMatch(source, /slate-350|slate-850/);
  });

  it('owns vertical scrolling when traceability is rendered outside the app shell', () => {
    assert.match(appSource, /isTraceabilityRoute\s*=\s*computed/);
    assert.match(appSource, /data-traceability-scroll-owner/);
    assert.match(appSource, /h-\[100dvh\][^\"]*overflow-y-auto[^\"]*touch-pan-y/);
  });
});

describe('global search traceability lookup', () => {
  it('preserves case and prioritizes traceability prefixes and Firestore IDs', () => {
    for (const code of ['REQ-Ab12', 'TRC-123', 'LOG-Ab12', 'log_Ab12', 'aB123456789012345678']) {
      assert.deepEqual(getTraceabilitySearchCandidate(`  ${code}  `), { code, preferred: true });
    }
  });

  it('extracts printed links, path links and query IDs without navigating to the pasted host', () => {
    for (const value of [
      'https://example.com/#/traceability/REQ-Ab12?print=1',
      'https://example.com/traceability/REQ-Ab12',
      '/#/traceability/REQ-Ab12',
      '/traceability/REQ-Ab12',
      'https://example.com/?id=REQ-Ab12',
      'https://example.com/#/traceability/REQ%2DAb12'
    ]) {
      assert.equal(normalizeTraceabilityLookup(value), 'REQ-Ab12');
      assert.deepEqual(getTraceabilitySearchCandidate(value), { code: 'REQ-Ab12', preferred: true });
    }
  });

  it('keeps ordinary function searches ahead of the optional arbitrary-ID lookup', () => {
    assert.deepEqual(getTraceabilitySearchCandidate('inventory'), { code: 'inventory', preferred: false });
    assert.deepEqual(getTraceabilitySearchCandidate('custom_123'), { code: 'custom_123', preferred: false });
    assert.equal(getTraceabilitySearchCandidate('Truy xuất nguồn gốc'), null);
  });

  it('rejects empty, oversized and non-document path values', () => {
    for (const value of ['', '  ', 'x'.repeat(201), 'REQ/a', 'REQ%2Fa', 'REQ-%00', 'https://example.com/unrelated']) {
      assert.equal(getTraceabilitySearchCandidate(value), null, value);
    }
  });
});
