import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function read(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('standards shared UI primitive integration', () => {
  it('uses the shared page header and buttons while preserving the standards function-menu contract', () => {
    const toolbar = read('./components/standards-toolbar.component.ts');
    const page = read('./standards.component.html');

    assert.match(page, /<app-standards-toolbar\b/);
    assert.match(toolbar, /AppButtonComponent/);
    assert.match(toolbar, /AppPageHeaderComponent/);
    assert.match(toolbar, /<app-page-header\b/);
    assert.match(toolbar, /pageHeaderActions/);
    assert.match(toolbar, /<app-button\b/);
    assert.match(toolbar, /title="Quản lý chất chuẩn đối chiếu"/);
    assert.match(toolbar, />\s*Chức năng\s*</);
    assert.match(toolbar, />\s*Thêm mới\s*</);
    assert.match(toolbar, /Đồng bộ mã nội bộ/);
    assert.match(toolbar, /Import chuẩn/);
    assert.match(toolbar, /Import nhật ký/);
    assert.match(toolbar, /Chuẩn hóa tên chất chuẩn/);
    assert.match(toolbar, /Từ thư mục/);
    assert.match(toolbar, /Chọn tệp/);
    assert.match(toolbar, /aria-haspopup="menu"/);
    assert.match(toolbar, /\[attr\.aria-expanded\]="functionMenuOpen\(\)"/);
    assert.match(toolbar, /closeMenuOnOutsideClick/);
    assert.match(toolbar, /closeMenuOnEscape/);
    assert.match(toolbar, /this\.functionMenuOpen\.set\(false\);\s*input\.click\(\);/);
  });

  it('uses the shared page header, toolbar and buttons for standards requests with sentence-case migrated labels', () => {
    const component = read('./requests/standard-requests.component.ts');
    const template = read('./requests/standard-requests.component.html');

    assert.match(component, /AppButtonComponent/);
    assert.match(component, /AppPageHeaderComponent/);
    assert.match(component, /AppToolbarComponent/);
    assert.match(template, /<app-page-header\b/);
    assert.match(template, /pageHeaderActions/);
    assert.match(template, /<app-toolbar\b/);
    assert.match(template, /toolbarSearch/);
    assert.match(template, /toolbarActions/);
    assert.match(template, /<app-button\b/);
    assert.match(template, /title="Quản lý yêu cầu chất chuẩn"/);
    assert.match(template, /Yêu cầu mua sắm/);
    assert.match(template, /Tạo yêu cầu mới/);
    assert.match(template, />\s*Tất cả\s*</);
    assert.match(template, />\s*Chờ duyệt\s*</);
    assert.match(template, />\s*Đang dùng\s*</);
    assert.match(template, />\s*Chờ trả\s*</);
    assert.match(template, />\s*Hoàn thành\s*</);
    assert.match(template, /Giao diện thẻ \(Kanban\)/);
    assert.match(template, /Giao diện bảng \(Table\)/);
  });

  it('uses shared header, buttons and empty state on standard detail while preserving specialized tab controls', () => {
    const component = read('./standard-detail.component.ts');
    const template = read('./standard-detail.component.html');

    assert.match(component, /AppButtonComponent/);
    assert.match(component, /AppEmptyStateComponent/);
    assert.match(component, /AppPageHeaderComponent/);
    assert.match(template, /<app-page-header\b/);
    assert.match(template, /pageHeaderActions/);
    assert.match(template, /<app-button\b/);
    assert.match(template, /<app-empty-state\b/);
    assert.match(template, /title="Chi tiết chất chuẩn đối chiếu"/);
    assert.match(template, />\s*Chỉnh sửa\s*</);
    assert.match(template, />\s*Quay lại danh sách\s*</);
    assert.match(template, />\s*Nhật ký sử dụng\s*</);
    assert.match(template, />\s*Lọ chuẩn cùng tên/);
    assert.doesNotMatch(template, /<h1[^>]*>\s*\{\{std\.name\}\}/);
  });

  it('uses shared header, toolbar, buttons and empty state for usage history with sentence-case labels', () => {
    const component = read('./usage/standard-usage.component.ts');
    const template = read('./usage/standard-usage.component.html');

    assert.match(component, /AppButtonComponent/);
    assert.match(component, /AppEmptyStateComponent/);
    assert.match(component, /AppPageHeaderComponent/);
    assert.match(component, /AppToolbarComponent/);
    assert.match(template, /<app-page-header\b/);
    assert.match(template, /pageHeaderActions/);
    assert.match(template, /<app-toolbar\b/);
    assert.match(template, /toolbarSearch/);
    assert.match(template, /toolbarFilters/);
    assert.match(template, /toolbarActions/);
    assert.match(template, /<app-button\b/);
    assert.match(template, /<app-empty-state\b/);
    assert.match(template, /title="Nhật ký dùng chuẩn"/);
    assert.match(template, />\s*Xóa lọc\s*</);
    assert.match(template, /1\. Nhật ký chi tiết/);
    assert.match(template, /2\. Tổng hợp theo hóa chất/);
    assert.match(template, /3\. Tổng hợp theo nhân viên/);
  });
});
