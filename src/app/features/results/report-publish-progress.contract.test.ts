import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');

describe('report publication progress integration', () => {
  it('shows five real stages, indefinite motion, elapsed time and actionable failure', () => {
    const modal = read('./components/report-publish-progress-modal.component.ts');
    for (const label of ['Đang chuẩn bị dữ liệu', 'Đang gửi yêu cầu đến GAS', 'Đang xử lý và chờ phản hồi PDF', 'Đã nhận PDF', 'Xuất bản thành công']) {
      assert.ok(modal.includes(label));
    }
    assert.match(modal, /report-progress-indeterminate/);
    assert.match(modal, /elapsedLabel/);
    assert.doesNotMatch(modal, /aria-valuenow|% hoàn thành/);
    assert.match(modal, /closeDisabled\]="state\(\) === 'working'"/);
    assert.match(modal, /retry\.emit\(\)/);
  });

  it('guards duplicate submits and retries from the failed chunk', () => {
    const source = read('./result-entry.component.ts');
    const template = read('./result-entry.component.html');
    assert.match(template, /<app-report-publish-progress-modal\b/);
    assert.match(source, /if \(this\.isPublishing\(\)\) return;/);
    assert.match(source, /this\.startPublishProgress\(retryFromChunkIndex\)/);
    assert.match(source, /for \(let chunkIndex = retryFromChunkIndex; chunkIndex < chunks\.length; chunkIndex\+\+\)/);
    assert.match(source, /this\.publishRetryChunkIndex = chunkIndex/);
    assert.match(source, /this\.stopPublishElapsedTimer\(\)/);
  });

  it('tracks GAS request/receipt and applies a finite HTTP response timeout', () => {
    const resultService = read('./services/result.service.ts');
    const reportService = read('../../core/services/report.service.ts');
    assert.match(resultService, /onProgress\?\.\('sending'\)/);
    assert.match(resultService, /onProgress\?\.\('waiting'\)/);
    assert.match(resultService, /onProgress\?\.\('received'\)/);
    assert.match(reportService, /timeout\(\{ first: this\.reportResponseTimeoutMs \}\)/);
    assert.match(reportService, /error instanceof TimeoutError/);
  });
});
