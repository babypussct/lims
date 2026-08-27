import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function read(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('dashboard shared UI primitive integration', () => {
  it('uses the shared page header, buttons and empty state on the dashboard surface', () => {
    const component = read('./dashboard.component.ts');
    const template = read('./dashboard.component.html');

    assert.match(component, /AppButtonComponent/);
    assert.match(component, /AppEmptyStateComponent/);
    assert.match(component, /AppPageHeaderComponent/);
    assert.match(template, /<app-page-header\b/);
    assert.match(template, /<app-button\b/);
    assert.match(template, /<app-empty-state\b/);
    assert.match(template, /<app-skeleton\b/);
    assert.match(template, /'Xin chào, '/);
    assert.match(template, />Nhật ký \{\{state\.systemVersion\(\)\}\}<\/span>/);
    assert.match(template, /Quét mã/);
    assert.match(template, /aria-label="Tìm kiếm hoạt động"/);
    assert.match(template, /\[attr\.aria-pressed\]/);
    assert.match(template, /flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2/);
    assert.match(template, /relative w-full sm:w-1\/2/);
    assert.match(template, /overflow-x-auto custom-scrollbar/);
    assert.match(template, /\[attr\.aria-busy\]="activityFeedLoading\(\)"/);
    assert.match(template, /getActivityTraceabilityUrl\(log\); as traceabilityUrl/);
    assert.match(template, /aria-label\]="'Truy xuất nguồn gốc '/);
    assert.match(template, /focus-visible:ring-2 focus-visible:ring-blue-500/);
    assert.match(template, /role="separator" aria-label="Mới kể từ lần truy cập trước"/);
  });

  it('uses the shared page header, toolbar and buttons on management statistics', () => {
    const component = read('./statistics.component.ts');
    const template = read('./statistics.component.html');

    assert.match(component, /AppButtonComponent/);
    assert.match(component, /AppPageHeaderComponent/);
    assert.match(component, /AppToolbarComponent/);
    assert.match(template, /<app-page-header\b/);
    assert.match(template, /<app-toolbar\b/);
    assert.match(template, /toolbarSearch/);
    assert.match(template, /toolbarActions/);
    assert.match(template, /<app-button\b/);
    assert.match(template, /title="Báo cáo quản trị"/);
    assert.match(template, /Xuất báo cáo/);
    assert.match(template, /Cập nhật lại dữ liệu \(backfill\)/);
    assert.match(template, /1\. Nhật ký hoạt động/);
    assert.match(template, /3\. Tiêu hao & biểu đồ/);
    assert.match(template, /5\. Sức khỏe & truy xuất/);
    assert.match(template, /Bảng kê nhập - xuất - tồn/);
    assert.match(template, /Chi tiết xuất kho theo quy trình/);
    assert.match(template, /Thống kê tần suất quy trình/);
    assert.match(template, /Quyền truy cập bị từ chối/);
    assert.match(template, /Báo cáo kế hoạch \(NXT \+ TH\)/);
    assert.match(template, /Phân tích dữ liệu chi tiết/);
    assert.match(template, /Dữ liệu kế toán và mua hàng/);
    assert.match(template, /1\. Báo cáo nhập - xuất - tồn \(NXT\)/);
    assert.match(template, /2\. Dữ liệu tiêu hao hóa chất/);
    assert.match(template, /3\. Tần suất quy trình \(SOP\)/);
    assert.match(template, /4\. Nhật ký hoạt động \(Audit Log\)/);
    assert.match(template, /5\. Tình trạng và truy xuất chất chuẩn/);
  });

  it('treats standards health as an unconditional Excel cover dependency', () => {
    const component = read('./statistics.component.ts');
    const helperStart = component.indexOf('private async ensureExportCoverStandardsLoaded()');
    const helperEnd = component.indexOf('private async ensureReportInventoryLoaded', helperStart);
    const helper = component.slice(helperStart, helperEnd);

    assert.ok(helperStart >= 0);
    assert.match(helper, /this\.state\.loadReferenceStandards\(\)/);
    assert.match(helper, /this\.state\.loadAllStandardRequests\(\)/);
    assert.match(helper, /Không thể tải đầy đủ dữ liệu bắt buộc cho Trang bìa/);

    const coverLoad = component.indexOf('const coverStandardsLoad = this.ensureExportCoverStandardsLoaded();');
    const dependencyBarrier = component.indexOf('const [approvedLoadResult, , , exportNxtRows] = await Promise.all([', coverLoad);
    const workbookCreation = component.indexOf("const XLSX = await import('xlsx');", dependencyBarrier);

    assert.ok(coverLoad >= 0, 'global export must always preload cover standards dependencies');
    assert.ok(dependencyBarrier > coverLoad, 'export must await all required datasets');
    assert.ok(workbookCreation > dependencyBarrier, 'workbook creation must happen only after completeness checks');
  });

  it('hard-stops N-X-T completeness before creating the Excel workbook', () => {
    const component = read('./statistics.component.ts');
    const exportStart = component.indexOf('async runGlobalExport()');
    const nxtLoad = component.indexOf('const nxtLoad = exportInventory', exportStart);
    const dependencyBarrier = component.indexOf('await Promise.all([', nxtLoad);
    const workbookCreation = component.indexOf("const XLSX = await import('xlsx');", dependencyBarrier);
    const nxtSheet = component.indexOf('const nxtRows = exportNxtRows;', workbookCreation);

    assert.ok(nxtLoad > exportStart, 'selected N-X-T export must preload complete reconstruction data');
    assert.match(component.slice(nxtLoad, dependencyBarrier), /this\.generateNxtReport\(true, \{ range: activeRange, sopId \}\)/);
    assert.ok(dependencyBarrier > nxtLoad, 'N-X-T load must be part of the export dependency barrier');
    assert.ok(workbookCreation > dependencyBarrier, 'workbook creation must wait for N-X-T completeness');
    assert.ok(nxtSheet > workbookCreation, 'N-X-T sheet must reuse the prevalidated rows');
  });

  it('does not make unrelated dangling print jobs invalidate the audit report', () => {
    const component = read('./statistics.component.ts');
    const loaderStart = component.indexOf('private async fetchCompleteReportLogs');
    const loaderEnd = component.indexOf('getDateRangeDisplayText()', loaderStart);
    const loader = component.slice(loaderStart, loaderEnd);

    assert.ok(loaderStart >= 0);
    assert.match(loader, /findUnresolvedLegacyNxtApprovalLogs\(logs, printDataByLog\)/);
    assert.doesNotMatch(loader, /!!log\.printJobId && !log\.printData/);
  });

  it('freezes one canonical report snapshot before building the Excel workbook', () => {
    const component = read('./statistics.component.ts');
    const exportStart = component.indexOf('async runGlobalExport()');
    const dependencyBarrier = component.indexOf('const [approvedLoadResult, , , exportNxtRows] = await Promise.all([', exportStart);
    const snapshotBoundary = component.indexOf('const exportSnapshot = this.buildReportSnapshot(activeRange);', dependencyBarrier);
    const workbookCreation = component.indexOf("const XLSX = await import('xlsx');", snapshotBoundary);
    const exportEnd = component.indexOf('// Handle native input event for specific day', workbookCreation);
    const frozenExport = component.slice(snapshotBoundary, exportEnd);

    assert.ok(exportStart >= 0);
    assert.ok(snapshotBoundary > dependencyBarrier, 'snapshot must be captured after all report loaders complete');
    assert.ok(workbookCreation > snapshotBoundary, 'workbook must be derived only after the snapshot is frozen');
    assert.match(frozenExport, /const selectedSopName = this\.getSnapshotSopName\(exportSnapshot, sopId\)/);
    assert.match(frozenExport, /aggregateSopFrequency\(\s*exportSnapshot\.monthlyStats,\s*exportSnapshot\.range,/);
    assert.match(frozenExport, /const nxtRows = exportNxtRows/);
    assert.doesNotMatch(frozenExport, /this\.generateNxtReport\(/);

    for (const liveComputed of [
      'this.reportSnapshot()',
      'this.sopFrequencyData()',
      'this.filteredApprovedRequests()',
      'this.filteredLogs()',
      'this.healthStats()',
      'this.consumptionData()',
      'this.getSelectedSopName()'
    ]) {
      assert.equal(
        frozenExport.includes(liveComputed),
        false,
        `Excel generation must not re-read live computed state via ${liveComputed}`
      );
    }
  });

  it('derives SOP frequency UI data from the canonical report snapshot', () => {
    const component = read('./statistics.component.ts');
    const computedStart = component.indexOf('sopFrequencyData = computed(() => {');
    const computedEnd = component.indexOf('async createConsumptionBarChart()', computedStart);
    const computedBody = component.slice(computedStart, computedEnd);

    assert.ok(computedStart >= 0);
    assert.match(computedBody, /const snapshot = this\.reportSnapshot\(\)/);
    assert.match(computedBody, /snapshot\.monthlyStats/);
    assert.match(computedBody, /snapshot\.range/);
    assert.doesNotMatch(computedBody, /this\.statsData\(\)/);
    assert.doesNotMatch(computedBody, /this\.getActiveDateRange\(\)/);
  });
});
