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
});
