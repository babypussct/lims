import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function read(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('standards shared UI primitive integration', () => {
  it('keeps the Audit whitelist inside the existing list, grid and detail surfaces', () => {
    const list = read('./components/standards-list-view.component.ts');
    const grid = read('./components/standards-grid-view.component.ts');
    const filter = read('./components/standards-filter.component.ts');
    const detail = read('./standard-detail.component.ts');
    const detailTemplate = read('./standard-detail.component.html');
    const page = read('./standards.component.html');
    const component = read('./standards.component.ts');
    const routes = read('../../app.routes.ts');
    const catalog = read('../../core/auth/permission-catalog.ts');

    for (const surface of [list, grid, detailTemplate]) {
      assert.match(surface, /isAuditMode\(\)/);
      for (const field of [
        'name',
        'initial_amount',
        'unit',
        'product_code',
        'lot_number',
        'manufacturer',
        'cas_number',
        'expiry_date',
        'storage_condition',
        'internal_id',
      ]) {
        assert.match(surface, new RegExp(`std\\.${field}`));
      }
    }

    assert.match(list, /certificate_ref/);
    assert.match(grid, /certificate_ref/);
    assert.match(list, /openCoaPreview/);
    assert.match(grid, /openCoaPreview/);
    assert.match(detailTemplate, /certificate_ref/);
    assert.match(detailTemplate, /openCoaPreview/);
    assert.match(filter, /isAuditMode = input/);
    assert.match(filter, /@if \(!isAuditMode\(\)\)/);
    assert.match(list, /\[class\.hidden\]="isAuditMode\(\)"/);
    assert.match(list, /!isAuditMode\(\) && std\.chemical_name/);
    assert.match(grid, /@if \(!isAuditMode\(\)\)/);
    assert.match(detailTemplate, /@if \(!isAuditMode\(\)\)/);
    assert.match(component, /isAuditMode\(\)/);
    assert.match(component, /auditFilteredItems/);
    assert.match(page, /\[isAuditMode\]="isAuditMode\(\)"/);
    assert.doesNotMatch(page, /app-standards-audit-view/);
    assert.doesNotMatch(routes, /standards\/audit\/:id/);
    assert.match(routes, /path: 'standards\/:id'/);
    assert.match(routes, /permissionsAny: \[PERMISSIONS\.STANDARD_VIEW, PERMISSIONS\.STANDARD_AUDIT_VIEW\]/);
    assert.match(routes, /PERMISSIONS\.STANDARD_AUDIT_VIEW/);
    assert.match(catalog, /STANDARD_AUDIT_VIEW: 'standard_audit_view'/);
  });

  it('uses the shared page header and buttons while preserving the standards function-menu contract', () => {
    const toolbar = read('./components/standards-toolbar.component.ts');
    const filter = read('./components/standards-filter.component.ts');
    const page = read('./standards.component.html');
    const component = read('./standards.component.ts');

    assert.match(page, /<app-standards-toolbar\b/);
    assert.match(filter, /flex flex-col gap-2 lg:flex-row/);
    assert.match(filter, /relative min-w-0 flex-1 group/);
    assert.match(page, /Vuốt ngang để xem đầy đủ bảng chuẩn/);
    assert.match(component, /window\.matchMedia\('\(max-width: 767px\), \(hover: none\) and \(pointer: coarse\)'\)/);
    assert.match(component, /this\.mobileMediaQuery\.matches \? 'grid' : \(this\.stdService\.listState\.viewMode \|\| 'list'\)/);
    assert.match(toolbar, /AppButtonComponent/);
    assert.match(toolbar, /AppPageHeaderComponent/);
    assert.match(toolbar, /<app-page-header\b/);
    assert.match(toolbar, /pageHeaderActions/);
    assert.match(toolbar, /<app-button\b/);
    assert.match(toolbar, /title="Quản lý chất chuẩn đối chiếu"/);
    assert.match(toolbar, />\s*Chức năng\s*</);
    assert.match(toolbar, />\s*Thêm mới\s*</);
    assert.match(toolbar, /Đồng bộ mã nội bộ/);
    assert.match(toolbar, /Nhập danh mục chuẩn/);
    assert.match(toolbar, /Nhập nhật ký/);
    assert.match(toolbar, /Chuẩn hóa tên chất chuẩn/);
    assert.match(toolbar, /Từ thư mục/);
    assert.match(toolbar, /Chọn tệp/);
    assert.match(toolbar, /aria-haspopup="menu"/);
    assert.match(toolbar, /\[attr\.aria-expanded\]="functionMenuOpen\(\)"/);
    assert.match(toolbar, /closeMenuOnOutsideClick/);
    assert.match(toolbar, /closeMenuOnEscape/);
    assert.match(toolbar, /this\.functionMenuOpen\.set\(false\);\s*input\.click\(\);/);

    // Spatial anchor and borderless page header contract
    assert.match(page, /class="[^"]*p-4 md:p-6[^"]*"/);
    assert.doesNotMatch(toolbar, /<app-page-header[^>]*border/);
    assert.doesNotMatch(toolbar, /<app-page-header[^>]*shadow/);
  });

  it('uses the shared page header, toolbar and buttons for standards requests with sentence-case migrated labels', () => {
    const actionModals = read('./requests/components/requests-action-modals.component.ts');
    const createRequestDrawer = read('./requests/components/create-request-drawer.component.ts');
    const component = read('./requests/standard-requests.component.ts');
    const template = read('./requests/standard-requests.component.html');

    assert.match(actionModals, /AppButtonComponent/);
    assert.match(actionModals, /AppModalShellComponent/);
    assert.match(actionModals, /<app-modal-shell\b/);
    assert.doesNotMatch(actionModals, /requests-modal-layer/);
    assert.match(createRequestDrawer, /AppModalShellComponent/);
    assert.match(createRequestDrawer, /<app-modal-shell\b/);
    assert.match(createRequestDrawer, /title="Tạo yêu cầu chất chuẩn"/);
    assert.match(createRequestDrawer, /size="xl"/);
    assert.match(createRequestDrawer, /\[closeOnBackdrop\]="true"/);
    assert.match(createRequestDrawer, /modalFooter/);
    assert.doesNotMatch(createRequestDrawer, /requests-modal-layer|class="[^"]*fixed inset-0/);
    assert.match(component, /AppButtonComponent/);
    assert.match(component, /AppModalShellComponent/);
    assert.match(component, /AppPageHeaderComponent/);
    assert.match(component, /AppToolbarComponent/);
    assert.match(template, /<app-page-header\b/);
    assert.match(template, /pageHeaderActions/);
    assert.match(template, /<app-toolbar\b/);
    assert.match(template, /toolbarSearch/);
    assert.match(template, /toolbarActions/);
    assert.match(template, /<app-button\b/);
    assert.match(template, /<app-modal-shell\b/);
    assert.match(template, /title="Duyệt yêu cầu mua bổ sung chất chuẩn"/);
    assert.doesNotMatch(template, /requests-modal-layer/);
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
    assert.match(template, /variant="detail"/);
    assert.match(template, /pageHeaderLeading/);
    assert.match(template, /pageHeaderActions/);
    assert.match(template, /pageHeaderMeta/);
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
    assert.match(template, /Vuốt ngang để xem đầy đủ nhật ký sử dụng/);
    assert.match(template, /role="region" aria-label="Bảng nhật ký sử dụng chuẩn" tabindex="0"/);
    assert.match(template, />\s*Xóa lọc\s*</);
    assert.match(template, /1\. Nhật ký chi tiết/);
    assert.match(template, /2\. Tổng hợp theo hóa chất/);
    assert.match(template, /3\. Tổng hợp theo nhân viên/);
  });

  it('uses the shared modal shell for migrated standards modals', () => {
    const historyModal = read('./components/standards-history-modal.component.ts');
    const bulkTagModal = read('./components/standards-bulk-tag-modal.component.ts');
    const tagManagerModal = read('./components/standards-tag-manager-modal.component.ts');
    const purchaseModal = read('./components/standards-purchase-modal.component.ts');
    const formModal = read('./components/standards-form-modal.component.ts');
    const assignModal = read('./components/standards-assign-modal.component.ts');
    const backfillModal = read('./components/standards-backfill-modal.component.ts');
    const printModal = read('./components/standards-print-modal.component.ts');
    const internalIdSyncModal = read('./components/standards-internal-id-sync-modal.component.ts');
    const bulkCoaModal = read('./components/standards-bulk-coa-modal.component.ts');
    const importDataModal = read('./components/standards-import-data-modal.component.ts');
    const importPreviewModals = read('./components/standards-import-modal.component.ts');
    const dataCleanupModal = read('./components/standards-data-cleanup-modal.component.ts');

    for (const modal of [historyModal, bulkTagModal, tagManagerModal, purchaseModal, formModal, assignModal, backfillModal, printModal, internalIdSyncModal, bulkCoaModal, importDataModal, importPreviewModals, dataCleanupModal]) {
      assert.match(modal, /AppModalShellComponent/);
      assert.match(modal, /<app-modal-shell\b/);
      assert.doesNotMatch(modal, /class="[^"]*fixed inset-0/);
    }

    assert.match(historyModal, /title="Lịch sử sử dụng"/);
    assert.match(bulkTagModal, /title="Gán nhãn hàng loạt"/);
    assert.match(tagManagerModal, /title="Danh mục nhãn trung tâm"/);
    assert.match(purchaseModal, /title="Đề nghị mua sắm"/);
    assert.match(purchaseModal, /form="standards-purchase-form"/);
    assert.match(formModal, /\[title\]="std\(\) \? 'Cập nhật chất chuẩn' : 'Thêm chất chuẩn mới'"/);
    assert.match(formModal, /\[closeOnBackdrop\]="false"/);
    assert.match(assignModal, /\[title\]="isAssignMode\(\) \? 'Gán cho nhân viên' : 'Mượn chuẩn sử dụng'"/);
    assert.match(assignModal, /\[closeOnBackdrop\]="false"/);
    assert.match(backfillModal, /title="Nhập bù nhật ký"/);
    assert.match(backfillModal, /\[closeOnBackdrop\]="false"/);
    assert.match(printModal, /\[title\]="printModalTitle\(\)"/);
    assert.match(printModal, /size="xl"/);
    assert.match(printModal, /\[closeOnBackdrop\]="false"/);
    assert.match(printModal, /modalFooter/);
    assert.match(internalIdSyncModal, /title="Đồng bộ Mã quản lý nội bộ"/);
    assert.match(internalIdSyncModal, /size="xl"/);
    assert.match(internalIdSyncModal, /\[closeOnBackdrop\]="false"/);
    assert.match(internalIdSyncModal, /\[closeDisabled\]="isBusy\(\)"/);
    assert.match(internalIdSyncModal, /modalFooter/);
    assert.match(bulkCoaModal, /title="Ghép nối CoA hàng loạt"/);
    assert.match(bulkCoaModal, /size="xl"/);
    assert.match(bulkCoaModal, /\[closeOnBackdrop\]="false"/);
    assert.match(bulkCoaModal, /\[closeDisabled\]="isUploading"/);
    assert.match(bulkCoaModal, /modalFooter/);
    assert.match(importDataModal, /title="Xác nhận nhập danh mục chuẩn"/);
    assert.match(importDataModal, /size="2xl"/);
    assert.match(importDataModal, /\[closeOnBackdrop\]="false"/);
    assert.match(importDataModal, /\[closeDisabled\]="isImporting\(\) \|\| isParsing\(\)"/);
    assert.match(importDataModal, /modalFooter/);
    assert.doesNotMatch(importDataModal, /HostListener|dialogPanel/);
    assert.equal((importPreviewModals.match(/<app-modal-shell\b/g) || []).length, 2);
    assert.match(importPreviewModals, /title="Xác nhận nhập dữ liệu"/);
    assert.match(importPreviewModals, /title="Xác nhận nhập nhật ký"/);
    assert.equal((importPreviewModals.match(/size="2xl"/g) || []).length, 2);
    assert.equal((importPreviewModals.match(/\[closeOnBackdrop\]="false"/g) || []).length, 2);
    assert.equal((importPreviewModals.match(/modalFooter/g) || []).length, 2);
    assert.match(dataCleanupModal, /title="Chuẩn hóa danh pháp & CAS chất chuẩn"/);
    assert.match(dataCleanupModal, /size="xl"/);
    assert.match(dataCleanupModal, /\[closeOnBackdrop\]="false"/);
    assert.match(dataCleanupModal, /\[closeDisabled\]="isProcessing\(\) \|\| undoingBatchId\(\) !== null"/);
    assert.match(dataCleanupModal, /modalFooter/);
    assert.match(dataCleanupModal, /Lịch sử chuẩn hóa & hoàn tác/);
  });
});
