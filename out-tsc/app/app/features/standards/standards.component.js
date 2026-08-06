import { ChangeDetectionStrategy, Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import { StandardService } from './standard.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { formatNum, calculateSimilarityScore } from '../../shared/utils/utils';
import { getSameStandardLots, isFefoCandidate, sortStandardsByFefo } from '../../shared/utils/standard-fefo';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { GoogleDriveService } from '../../core/services/google-drive.service';
import { PrintService } from '../../core/services/print.service';
import { ProgressService } from '../../core/services/progress.service';
import { StandardsToolbarComponent } from './components/standards-toolbar.component';
import { StandardsFilterComponent } from './components/standards-filter.component';
import { StandardsListViewComponent } from './components/standards-list-view.component';
import { StandardsGridViewComponent } from './components/standards-grid-view.component';
import { StandardsBackfillModalComponent } from './components/standards-backfill-modal.component';
import { StandardsBulkTagModalComponent } from './components/standards-bulk-tag-modal.component';
import { StandardsTagManagerModalComponent } from './components/standards-tag-manager-modal.component';
import { StandardTagCatalogService } from './services/standard-tag-catalog.service';
import { formatMethodOptionLabel, summarizeStockByUnit } from './services/standard-tag.utils';
import * as i0 from "@angular/core";
const StandardsComponent_Conditional_10_Defer_1_DepsFn = () => [import("./components/standards-form-modal.component").then(m => m.StandardsFormModalComponent)];
const StandardsComponent_Conditional_11_Defer_1_DepsFn = () => [import("./components/standards-import-data-modal.component").then(m => m.StandardsImportDataModalComponent)];
const StandardsComponent_Conditional_12_Defer_1_DepsFn = () => [import("./components/standards-import-modal.component").then(m => m.StandardsImportUsageModalComponent)];
const StandardsComponent_Conditional_13_Defer_1_DepsFn = () => [import("./components/standards-bulk-coa-modal.component").then(m => m.StandardsBulkCoaModalComponent)];
const StandardsComponent_Conditional_16_Defer_1_DepsFn = () => [import("./components/standards-data-cleanup-modal.component").then(m => m.StandardsDataCleanupModalComponent)];
const StandardsComponent_Conditional_17_Defer_1_DepsFn = () => [import("./components/standards-assign-modal.component").then(m => m.StandardsAssignModalComponent)];
const StandardsComponent_Conditional_18_Defer_1_DepsFn = () => [import("./components/standards-print-modal.component").then(m => m.StandardsPrintModalComponent)];
const StandardsComponent_Conditional_19_Defer_1_DepsFn = () => [import("./components/standards-history-modal.component").then(m => m.StandardsHistoryModalComponent)];
const StandardsComponent_Conditional_20_Defer_1_DepsFn = () => [StandardsBackfillModalComponent];
const StandardsComponent_Conditional_21_Defer_1_DepsFn = () => [import("./components/standards-purchase-modal.component").then(m => m.StandardsPurchaseModalComponent)];
const StandardsComponent_Conditional_22_Defer_1_DepsFn = () => [import("../../shared/components/export-modal/export-modal.component").then(m => m.ExportModalComponent)];
function StandardsComponent_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-standards-list-view", 11);
    i0.ɵɵlistener("toggleSelection", function StandardsComponent_Conditional_5_Template_app_standards_list_view_toggleSelection_0_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.toggleSelection($event)); })("toggleAll", function StandardsComponent_Conditional_5_Template_app_standards_list_view_toggleAll_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.toggleAll()); })("navigateToDetail", function StandardsComponent_Conditional_5_Template_app_standards_list_view_navigateToDetail_0_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.navigateToDetail($event)); })("copyText", function StandardsComponent_Conditional_5_Template_app_standards_list_view_copyText_0_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.copyText($event.text, $event.event)); })("openCoaPreview", function StandardsComponent_Conditional_5_Template_app_standards_list_view_openCoaPreview_0_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.openCoaPreview($event.url, $event.event)); })("triggerQuickDriveUpload", function StandardsComponent_Conditional_5_Template_app_standards_list_view_triggerQuickDriveUpload_0_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.triggerQuickDriveUpload($event.std, $event.event)); })("openAssignModal", function StandardsComponent_Conditional_5_Template_app_standards_list_view_openAssignModal_0_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.openAssignModal($event.std, $event.isAssign)); })("goToReturn", function StandardsComponent_Conditional_5_Template_app_standards_list_view_goToReturn_0_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.goToReturn($event)); })("openPurchaseRequestModal", function StandardsComponent_Conditional_5_Template_app_standards_list_view_openPurchaseRequestModal_0_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.openPurchaseRequestModal($event)); })("openPrintModal", function StandardsComponent_Conditional_5_Template_app_standards_list_view_openPrintModal_0_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.openPrintModal($event)); })("viewHistory", function StandardsComponent_Conditional_5_Template_app_standards_list_view_viewHistory_0_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.viewHistory($event)); })("openEditModal", function StandardsComponent_Conditional_5_Template_app_standards_list_view_openEditModal_0_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.openEditModal($event)); })("openBackfillModal", function StandardsComponent_Conditional_5_Template_app_standards_list_view_openBackfillModal_0_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.openBackfillModal($event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵproperty("items", ctx_r2.visibleItems())("isLoading", ctx_r2.isLoading())("allStandardsLength", ctx_r2.allStandards().length)("selectedIds", ctx_r2.selectedIds())("quickUploadStdId", ctx_r2.quickUploadStdId())("canEditStandards", ctx_r2.auth.canEditStandards())("canAssignStandards", ctx_r2.auth.canAssignStandards())("canRequestStandards", ctx_r2.auth.hasPermission("standard_request"))("currentUser", ctx_r2.auth.currentUser());
} }
function StandardsComponent_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-standards-grid-view", 12);
    i0.ɵɵlistener("toggleSelection", function StandardsComponent_Conditional_6_Template_app_standards_grid_view_toggleSelection_0_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.toggleSelection($event)); })("navigateToDetail", function StandardsComponent_Conditional_6_Template_app_standards_grid_view_navigateToDetail_0_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.navigateToDetail($event)); })("copyText", function StandardsComponent_Conditional_6_Template_app_standards_grid_view_copyText_0_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.copyText($event.text, $event.event)); })("openCoaPreview", function StandardsComponent_Conditional_6_Template_app_standards_grid_view_openCoaPreview_0_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.openCoaPreview($event.url, $event.event)); })("triggerQuickDriveUpload", function StandardsComponent_Conditional_6_Template_app_standards_grid_view_triggerQuickDriveUpload_0_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.triggerQuickDriveUpload($event.std, $event.event)); })("openAssignModal", function StandardsComponent_Conditional_6_Template_app_standards_grid_view_openAssignModal_0_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.openAssignModal($event.std, $event.isAssign)); })("goToReturn", function StandardsComponent_Conditional_6_Template_app_standards_grid_view_goToReturn_0_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.goToReturn($event)); })("openPurchaseRequestModal", function StandardsComponent_Conditional_6_Template_app_standards_grid_view_openPurchaseRequestModal_0_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.openPurchaseRequestModal($event)); })("openPrintModal", function StandardsComponent_Conditional_6_Template_app_standards_grid_view_openPrintModal_0_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.openPrintModal($event)); })("viewHistory", function StandardsComponent_Conditional_6_Template_app_standards_grid_view_viewHistory_0_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.viewHistory($event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵproperty("items", ctx_r2.visibleItems())("isLoading", ctx_r2.isLoading())("allStandardsLength", ctx_r2.allStandards().length)("selectedIds", ctx_r2.selectedIds())("quickUploadStdId", ctx_r2.quickUploadStdId())("canEditStandards", ctx_r2.auth.canEditStandards())("canAssignStandards", ctx_r2.auth.canAssignStandards())("canRequestStandards", ctx_r2.auth.hasPermission("standard_request"))("currentUser", ctx_r2.auth.currentUser());
} }
function StandardsComponent_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 8)(1, "button", 13);
    i0.ɵɵlistener("click", function StandardsComponent_Conditional_9_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.loadMore()); });
    i0.ɵɵtext(2, " Xem Th\u00EAm... ");
    i0.ɵɵelementEnd()();
} }
function StandardsComponent_Conditional_10_Defer_0_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-standards-form-modal", 14);
    i0.ɵɵlistener("closeModal", function StandardsComponent_Conditional_10_Defer_0_Template_app_standards_form_modal_closeModal_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.closeModal()); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("isOpen", ctx_r2.showModal())("std", ctx_r2.isEditing() ? ctx_r2.selectedStd() : null)("allStandards", ctx_r2.allStandards());
} }
function StandardsComponent_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardsComponent_Conditional_10_Defer_0_Template, 1, 3);
    i0.ɵɵdefer(1, 0, StandardsComponent_Conditional_10_Defer_1_DepsFn);
    i0.ɵɵdeferOnIdle();
} }
function StandardsComponent_Conditional_11_Defer_0_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-standards-import-data-modal", 15);
    i0.ɵɵlistener("sheetChange", function StandardsComponent_Conditional_11_Defer_0_Template_app_standards_import_data_modal_sheetChange_0_listener($event) { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.changeImportSheet($event)); })("cancel", function StandardsComponent_Conditional_11_Defer_0_Template_app_standards_import_data_modal_cancel_0_listener() { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.cancelImport()); })("confirm", function StandardsComponent_Conditional_11_Defer_0_Template_app_standards_import_data_modal_confirm_0_listener() { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.confirmImport()); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("data", ctx_r2.importPreviewData())("isImporting", ctx_r2.isImporting())("isParsing", ctx_r2.isParsingImport())("sheetNames", ctx_r2.importSheetNames())("selectedSheet", ctx_r2.selectedImportSheet());
} }
function StandardsComponent_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardsComponent_Conditional_11_Defer_0_Template, 1, 5);
    i0.ɵɵdefer(1, 0, StandardsComponent_Conditional_11_Defer_1_DepsFn);
    i0.ɵɵdeferOnIdle();
} }
function StandardsComponent_Conditional_12_Defer_0_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-standards-import-usage-modal", 16);
    i0.ɵɵlistener("cancel", function StandardsComponent_Conditional_12_Defer_0_Template_app_standards_import_usage_modal_cancel_0_listener() { i0.ɵɵrestoreView(_r8); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.cancelImport()); })("confirm", function StandardsComponent_Conditional_12_Defer_0_Template_app_standards_import_usage_modal_confirm_0_listener() { i0.ɵɵrestoreView(_r8); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.confirmUsageLogImport()); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("data", ctx_r2.importUsageLogPreviewData())("validCount", ctx_r2.validUsageLogsCount())("duplicateCount", ctx_r2.duplicateUsageLogsCount())("errorCount", ctx_r2.errorUsageLogsCount())("isImporting", ctx_r2.isImporting());
} }
function StandardsComponent_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardsComponent_Conditional_12_Defer_0_Template, 1, 5);
    i0.ɵɵdefer(1, 0, StandardsComponent_Conditional_12_Defer_1_DepsFn);
    i0.ɵɵdeferOnIdle();
} }
function StandardsComponent_Conditional_13_Defer_0_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-standards-bulk-coa-modal", 17);
    i0.ɵɵlistener("cancel", function StandardsComponent_Conditional_13_Defer_0_Template_app_standards_bulk_coa_modal_cancel_0_listener() { i0.ɵɵrestoreView(_r9); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.cancelBulkCoa()); })("confirm", function StandardsComponent_Conditional_13_Defer_0_Template_app_standards_bulk_coa_modal_confirm_0_listener() { i0.ɵɵrestoreView(_r9); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.confirmBulkCoaUpload()); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("isOpen", ctx_r2.showBulkCoaModal())("items", ctx_r2.bulkCoaItems())("allStandards", ctx_r2.allStandards())("isUploading", ctx_r2.isBulkUploading())("uploadComplete", ctx_r2.bulkUploadComplete());
} }
function StandardsComponent_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardsComponent_Conditional_13_Defer_0_Template, 1, 5);
    i0.ɵɵdefer(1, 0, StandardsComponent_Conditional_13_Defer_1_DepsFn);
    i0.ɵɵdeferOnIdle();
} }
function StandardsComponent_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-standards-bulk-tag-modal", 18);
    i0.ɵɵlistener("cancel", function StandardsComponent_Conditional_14_Template_app_standards_bulk_tag_modal_cancel_0_listener() { i0.ɵɵrestoreView(_r10); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.showBulkTagModal.set(false)); })("confirm", function StandardsComponent_Conditional_14_Template_app_standards_bulk_tag_modal_confirm_0_listener($event) { i0.ɵɵrestoreView(_r10); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.confirmBulkTagUpdate($event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵproperty("isOpen", ctx_r2.showBulkTagModal())("selectedCount", ctx_r2.selectedIds().size)("tagOptions", ctx_r2.tagCatalog.selectableOptions())("isProcessing", ctx_r2.isProcessing());
} }
function StandardsComponent_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-standards-tag-manager-modal", 19);
    i0.ɵɵlistener("close", function StandardsComponent_Conditional_15_Template_app_standards_tag_manager_modal_close_0_listener() { i0.ɵɵrestoreView(_r11); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.showTagManagerModal.set(false)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵproperty("isOpen", ctx_r2.showTagManagerModal());
} }
function StandardsComponent_Conditional_16_Defer_0_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-standards-data-cleanup-modal", 20);
    i0.ɵɵlistener("closeModal", function StandardsComponent_Conditional_16_Defer_0_Template_app_standards_data_cleanup_modal_closeModal_0_listener() { i0.ɵɵrestoreView(_r12); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.showDataCleanupModal.set(false)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("isOpen", ctx_r2.showDataCleanupModal())("allStandards", ctx_r2.allStandards());
} }
function StandardsComponent_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardsComponent_Conditional_16_Defer_0_Template, 1, 2);
    i0.ɵɵdefer(1, 0, StandardsComponent_Conditional_16_Defer_1_DepsFn);
    i0.ɵɵdeferOnIdle();
} }
function StandardsComponent_Conditional_17_Defer_0_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-standards-assign-modal", 21);
    i0.ɵɵlistener("closeModal", function StandardsComponent_Conditional_17_Defer_0_Template_app_standards_assign_modal_closeModal_0_listener() { i0.ɵɵrestoreView(_r13); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.showAssignModal.set(false)); })("confirm", function StandardsComponent_Conditional_17_Defer_0_Template_app_standards_assign_modal_confirm_0_listener($event) { i0.ɵɵrestoreView(_r13); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.confirmAssign($event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    let tmp_8_0;
    let tmp_9_0;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("isOpen", ctx_r2.showAssignModal())("std", ctx_r2.selectedStd())("isAssignMode", ctx_r2.isAssignMode())("userList", ctx_r2.userList())("isProcessing", ctx_r2.isProcessing())("currentUserUid", ((tmp_8_0 = ctx_r2.auth.currentUser()) == null ? null : tmp_8_0.uid) || "")("currentUserName", ((tmp_9_0 = ctx_r2.auth.currentUser()) == null ? null : tmp_9_0.displayName) || "")("sameName", ctx_r2.sameNameAsSelected());
} }
function StandardsComponent_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardsComponent_Conditional_17_Defer_0_Template, 1, 8);
    i0.ɵɵdefer(1, 0, StandardsComponent_Conditional_17_Defer_1_DepsFn);
    i0.ɵɵdeferOnIdle();
} }
function StandardsComponent_Conditional_18_Defer_0_Template(rf, ctx) { if (rf & 1) {
    const _r14 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-standards-print-modal", 22);
    i0.ɵɵlistener("closeModal", function StandardsComponent_Conditional_18_Defer_0_Template_app_standards_print_modal_closeModal_0_listener() { i0.ɵɵrestoreView(_r14); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.showPrintModal.set(false)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("isOpen", ctx_r2.showPrintModal())("std", ctx_r2.selectedStd())("standards", ctx_r2.selectedStandardsToPrint());
} }
function StandardsComponent_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardsComponent_Conditional_18_Defer_0_Template, 1, 3);
    i0.ɵɵdefer(1, 0, StandardsComponent_Conditional_18_Defer_1_DepsFn);
    i0.ɵɵdeferOnIdle();
} }
function StandardsComponent_Conditional_19_Defer_0_Template(rf, ctx) { if (rf & 1) {
    const _r15 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-standards-history-modal", 23);
    i0.ɵɵlistener("closeModal", function StandardsComponent_Conditional_19_Defer_0_Template_app_standards_history_modal_closeModal_0_listener() { i0.ɵɵrestoreView(_r15); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.historyStd.set(null)); })("deleteLogEvent", function StandardsComponent_Conditional_19_Defer_0_Template_app_standards_history_modal_deleteLogEvent_0_listener($event) { i0.ɵɵrestoreView(_r15); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.deleteLog($event)); })("loadMoreHistoryEvent", function StandardsComponent_Conditional_19_Defer_0_Template_app_standards_history_modal_loadMoreHistoryEvent_0_listener() { i0.ɵɵrestoreView(_r15); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.loadMoreHistory()); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("historyStd", ctx_r2.historyStd())("loadingHistory", ctx_r2.loadingHistory())("historyLogs", ctx_r2.historyLogs())("isProcessing", ctx_r2.isProcessing())("hasMoreHistory", ctx_r2.hasMoreHistory())("loadingMoreHistory", ctx_r2.loadingMoreHistory());
} }
function StandardsComponent_Conditional_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardsComponent_Conditional_19_Defer_0_Template, 1, 6);
    i0.ɵɵdefer(1, 0, StandardsComponent_Conditional_19_Defer_1_DepsFn);
    i0.ɵɵdeferOnIdle();
} }
function StandardsComponent_Conditional_20_Defer_0_Template(rf, ctx) { if (rf & 1) {
    const _r16 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-standards-backfill-modal", 24);
    i0.ɵɵlistener("closeModal", function StandardsComponent_Conditional_20_Defer_0_Template_app_standards_backfill_modal_closeModal_0_listener() { i0.ɵɵrestoreView(_r16); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.showBackfillModal.set(false)); })("confirm", function StandardsComponent_Conditional_20_Defer_0_Template_app_standards_backfill_modal_confirm_0_listener($event) { i0.ɵɵrestoreView(_r16); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.confirmBackfill($event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("isOpen", ctx_r2.showBackfillModal())("std", ctx_r2.selectedBackfillStd())("userList", ctx_r2.userList())("isProcessing", ctx_r2.isProcessing());
} }
function StandardsComponent_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardsComponent_Conditional_20_Defer_0_Template, 1, 4);
    i0.ɵɵdefer(1, 0, StandardsComponent_Conditional_20_Defer_1_DepsFn);
    i0.ɵɵdeferOnIdle();
} }
function StandardsComponent_Conditional_21_Defer_0_Template(rf, ctx) { if (rf & 1) {
    const _r17 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-standards-purchase-modal", 25);
    i0.ɵɵlistener("closeModal", function StandardsComponent_Conditional_21_Defer_0_Template_app_standards_purchase_modal_closeModal_0_listener() { i0.ɵɵrestoreView(_r17); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.closePurchaseRequestModal()); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("isOpen", ctx_r2.showPurchaseRequestModal())("selectedStd", ctx_r2.selectedPurchaseStd());
} }
function StandardsComponent_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardsComponent_Conditional_21_Defer_0_Template, 1, 2);
    i0.ɵɵdefer(1, 0, StandardsComponent_Conditional_21_Defer_1_DepsFn);
    i0.ɵɵdeferOnIdle();
} }
function StandardsComponent_Conditional_22_Defer_0_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r19 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 28)(1, "div", 43);
    i0.ɵɵelement(2, "i", 44);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 45)(5, "button", 46);
    i0.ɵɵlistener("click", function StandardsComponent_Conditional_22_Defer_0_Conditional_2_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r19); const ctx_r2 = i0.ɵɵnextContext(3); ctx_r2.exportDataSource.set("selected"); return i0.ɵɵresetView(ctx_r2.exportCompleted.set(false)); });
    i0.ɵɵelement(6, "i", 47);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "button", 46);
    i0.ɵɵlistener("click", function StandardsComponent_Conditional_22_Defer_0_Conditional_2_Template_button_click_8_listener() { i0.ɵɵrestoreView(_r19); const ctx_r2 = i0.ɵɵnextContext(3); ctx_r2.exportDataSource.set("filtered"); return i0.ɵɵresetView(ctx_r2.exportCompleted.set(false)); });
    i0.ɵɵelement(9, "i", 48);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" B\u1EA1n \u0111ang c\u00F3 ", ctx_r2.selectedIds().size, " chu\u1EA9n \u0111\u01B0\u1EE3c tick. Xu\u1EA5t t\u1EEB \u0111\u00E2u? ");
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r2.exportDataSource() === "selected" ? "bg-amber-500 text-white border-amber-500" : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-amber-300");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.selectedIds().size, " chu\u1EA9n \u0111\u00E3 ch\u1ECDn ");
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r2.exportDataSource() === "filtered" ? "bg-indigo-500 text-white border-indigo-500" : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-indigo-300");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.filteredItems().length, " k\u1EBFt qu\u1EA3 \u0111ang l\u1ECDc ");
} }
function StandardsComponent_Conditional_22_Defer_0_Template(rf, ctx) { if (rf & 1) {
    const _r18 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-export-modal", 26);
    i0.ɵɵlistener("close", function StandardsComponent_Conditional_22_Defer_0_Template_app_export_modal_close_0_listener() { i0.ɵɵrestoreView(_r18); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.showExportModal.set(false)); })("execute", function StandardsComponent_Conditional_22_Defer_0_Template_app_export_modal_execute_0_listener() { i0.ɵɵrestoreView(_r18); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.runExport()); });
    i0.ɵɵelementStart(1, "div", 27);
    i0.ɵɵtemplate(2, StandardsComponent_Conditional_22_Defer_0_Conditional_2_Template, 11, 7, "div", 28);
    i0.ɵɵelementStart(3, "div", 29)(4, "button", 30);
    i0.ɵɵlistener("click", function StandardsComponent_Conditional_22_Defer_0_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r18); const ctx_r2 = i0.ɵɵnextContext(2); ctx_r2.exportType.set("full"); return i0.ɵɵresetView(ctx_r2.exportCompleted.set(false)); });
    i0.ɵɵelementStart(5, "div", 31);
    i0.ɵɵelement(6, "i", 32);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div", 33)(8, "div", 34);
    i0.ɵɵtext(9, "1. Danh S\u00E1ch \u0110\u1EA7y \u0110\u1EE7");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "div", 35);
    i0.ɵɵtext(11, "22 c\u1ED9t: m\u00E3, t\u00EAn, s\u1ED1 l\u00F4, t\u1ED3n kho, h\u1EA1n d\u00F9ng, CoA, h\u00E3ng s\u1EA3n xu\u1EA5t...");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(12, "div", 29)(13, "button", 30);
    i0.ɵɵlistener("click", function StandardsComponent_Conditional_22_Defer_0_Template_button_click_13_listener() { i0.ɵɵrestoreView(_r18); const ctx_r2 = i0.ɵɵnextContext(2); ctx_r2.exportType.set("expiry"); return i0.ɵɵresetView(ctx_r2.exportCompleted.set(false)); });
    i0.ɵɵelementStart(14, "div", 31);
    i0.ɵɵelement(15, "i", 36);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "div", 33)(17, "div", 34);
    i0.ɵɵtext(18, "2. B\u00E1o C\u00E1o H\u1EA1n D\u00F9ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "div", 35);
    i0.ɵɵtext(20, "Ch\u1EC9 Chu\u1EA9n C\u00F3 H\u1EA1n D\u00F9ng - K\u00E8m C\u1ED9t \"C\u00F2n L\u1EA1i (Ng\u00E0y)\" v\u00E0 Tr\u1EA1ng Th\u00E1i H\u1EA1n");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(21, "div", 37);
    i0.ɵɵelement(22, "i", 38);
    i0.ɵɵelementStart(23, "span");
    i0.ɵɵtext(24, "File Excel g\u1ED3m ");
    i0.ɵɵelementStart(25, "b");
    i0.ɵɵtext(26, "2 sheet");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(27);
    i0.ɵɵelementStart(28, "span", 39);
    i0.ɵɵtext(29, "C\u1ED0 \u0110\u1ECANH");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(30, " - ");
    i0.ɵɵelementStart(31, "span", 40);
    i0.ɵɵtext(32, "Thay th\u1EBF");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(33, " - ");
    i0.ɵɵelementStart(34, "span", 41);
    i0.ɵɵtext(35, "H\u1EBFt h\u00E0ng");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(36, " - ");
    i0.ɵɵelementStart(37, "span", 42);
    i0.ɵɵtext(38, "H\u1EBFt h\u1EA1n");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(39, ".");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("subtitle", ctx_r2.exportSubtitle())("footerText", ctx_r2.exportItems().length + " chu\u1EA9n s\u1EBD \u0111\u01B0\u1EE3c xu\u1EA5t" + (ctx_r2.exportGroupCount() > 0 ? " - " + ctx_r2.exportGroupCount() + " nh\u00F3m c\u00F3 chu\u1EA9n thay th\u1EBF" : "") + " - 2 sheet: " + (ctx_r2.exportType() === "expiry" ? "B\u00E1o c\u00E1o" : "Chi ti\u1EBFt") + " + T\u1ED5ng h\u1EE3p")("isExporting", ctx_r2.isExporting())("isCompleted", ctx_r2.exportCompleted())("isSubmitDisabled", ctx_r2.exportItems().length === 0);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.selectedIds().size > 0 ? 2 : -1);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r2.exportType() === "full" ? "border-indigo-200 bg-indigo-50/30 dark:border-indigo-800 dark:bg-indigo-900/20" : "border-slate-100 dark:border-slate-700");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r2.isExporting());
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r2.exportType() === "full" ? "bg-indigo-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-400");
    i0.ɵɵadvance(3);
    i0.ɵɵclassProp("text-indigo-700", ctx_r2.exportType() === "full");
    i0.ɵɵadvance(4);
    i0.ɵɵclassMap(ctx_r2.exportType() === "expiry" ? "border-rose-200 bg-rose-50/30 dark:border-rose-800 dark:bg-rose-900/20" : "border-slate-100 dark:border-slate-700");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r2.isExporting());
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r2.exportType() === "expiry" ? "bg-rose-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-400");
    i0.ɵɵadvance(3);
    i0.ɵɵclassProp("text-rose-700", ctx_r2.exportType() === "expiry");
    i0.ɵɵadvance(10);
    i0.ɵɵtextInterpolate1(": ", ctx_r2.exportType() === "expiry" ? "B\u00E1o c\u00E1o h\u1EA1n d\u00F9ng" : "Chi ti\u1EBFt", " + T\u1ED5ng h\u1EE3p. H\u00E0ng ti\u00EAu \u0111\u1EC1 \u0111\u01B0\u1EE3c \u0111\u00F3ng b\u0103ng (freeze). M\u00E0u s\u1EAFc: ");
} }
function StandardsComponent_Conditional_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardsComponent_Conditional_22_Defer_0_Template, 40, 21);
    i0.ɵɵdefer(1, 0, StandardsComponent_Conditional_22_Defer_1_DepsFn);
    i0.ɵɵdeferOnIdle();
} }
export class StandardsComponent {
    constructor() {
        this.state = inject(StateService);
        this.auth = inject(AuthService);
        this.stdService = inject(StandardService);
        this.firebaseService = inject(FirebaseService);
        this.toast = inject(ToastService);
        this.confirmationService = inject(ConfirmationService);
        this.sanitizer = inject(DomSanitizer);
        this.router = inject(Router);
        this.googleDriveService = inject(GoogleDriveService);
        this.printService = inject(PrintService);
        this.progressService = inject(ProgressService);
        this.tagCatalog = inject(StandardTagCatalogService);
        this.datePipe = inject(DatePipe);
        this.Math = Math;
        this.isLoading = signal(true);
        this.quickUploadStdId = signal(''); // Track which std is being quick-uploaded
        this.quickUploadStd = null;
        this.isImporting = signal(false);
        this.isParsingImport = signal(false);
        this.isProcessing = signal(false); // Hardened UX State
        this.showTagManagerModal = signal(false);
        // Responsive view mode: mobile (touch device) defaults to grid, desktop defaults to list
        this.mobileMediaQuery = window.matchMedia('(hover: none) and (pointer: coarse)');
        this.viewMode = signal(this.stdService.listState.viewMode || (this.mobileMediaQuery.matches ? 'grid' : 'list'));
        this.onMediaChange = (e) => this.viewMode.set(e.matches ? 'grid' : 'list');
        this.searchTerm = signal(this.stdService.listState.searchTerm || '');
        this.sortOption = signal(this.stdService.listState.sortOption || 'received_desc');
        this.searchSubject = new Subject();
        // --- CHANGED: CLIENT-SIDE STATE ---
        this.allStandards = signal([]); // Holds ALL data from Firebase stream
        this.displayLimit = signal(50); // Virtual scroll limit
        this.activeWidgetFilter = signal('all');
        this.activeMethodTagFilter = signal(null);
        this.activeDeviceFilter = signal('all');
        // --- Export State ---
        this.showExportModal = signal(false);
        this.exportType = signal('full');
        this.exportDataSource = signal('filtered');
        this.isExporting = signal(false);
        this.exportCompleted = signal(false);
        // --- Purchase Requests State (Staff) ---
        this.showPurchaseRequestModal = signal(false);
        this.selectedPurchaseStd = signal(null);
        // Stats Computed
        this.stats = computed(() => {
            const data = this.allStandards();
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
            const thirtyDays = today + 30 * 24 * 60 * 60 * 1000;
            // Logic 3 thang: lay thang hien tai + 3 thang, bat ke ngay
            const threeMonthsEnd = new Date(now.getFullYear(), now.getMonth() + 4, 1).getTime(); // exclusive
            const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
            let expired = 0;
            let expiringSoon = 0;
            let expiring3Months = 0;
            let lowStock = 0;
            data.forEach(item => {
                if ((item.current_amount / (item.initial_amount || 1)) <= 0.2) {
                    lowStock++;
                }
                if (item.expiry_date) {
                    const expDate = new Date(item.expiry_date).getTime();
                    if (expDate < today) {
                        expired++;
                    }
                    else if (expDate <= thirtyDays) {
                        expiringSoon++;
                    }
                    if (expDate >= thisMonthStart && expDate < threeMonthsEnd) {
                        expiring3Months++;
                    }
                }
            });
            return { expired, expiringSoon, expiring3Months, lowStock, total: data.length };
        });
        this.filteredItems = computed(() => {
            let data = this.allStandards().filter(item => !item._isDeleted && item.status !== 'DELETED');
            const term = this.searchTerm().trim().toLowerCase();
            const widgetFilter = this.activeWidgetFilter();
            const methodKey = this.activeMethodTagFilter();
            if (methodKey)
                data = data.filter(item => (item.sop_tags || []).includes(methodKey));
            const device = this.activeDeviceFilter();
            if (device !== 'all') {
                data = data.filter(item => {
                    const codes = new Set();
                    for (const key of item.sop_tags || []) {
                        const option = this.tagCatalog.resolveTag(key);
                        for (const code of option.deviceCodes || [])
                            codes.add(code);
                    }
                    return codes.has(device);
                });
            }
            // 1. WIDGET FILTER
            if (widgetFilter !== 'all') {
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                const thirtyDays = today + 30 * 24 * 60 * 60 * 1000;
                const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
                const threeMonthsEnd = new Date(now.getFullYear(), now.getMonth() + 4, 1).getTime(); // exclusive
                data = data.filter(item => {
                    if (widgetFilter === 'low_stock') {
                        return (item.current_amount / (item.initial_amount || 1)) <= 0.2;
                    }
                    if (!item.expiry_date)
                        return false;
                    const expDate = new Date(item.expiry_date).getTime();
                    if (widgetFilter === 'expired') {
                        return expDate < today;
                    }
                    if (widgetFilter === 'expiring_soon') {
                        return expDate >= today && expDate <= thirtyDays;
                    }
                    if (widgetFilter === 'expiring_3months') {
                        return expDate >= thisMonthStart && expDate < threeMonthsEnd;
                    }
                    return true;
                });
            }
            // 2. SEARCH FILTER
            if (term) {
                const normalize = (s) => s ? String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
                const searchTerms = term.split('+').map(t => normalize(t.trim())).filter(t => t.length > 0);
                data = data.filter(item => {
                    // Cover ALL information of the standard by concatenating all values
                    // Additionally, format YYYY-MM-DD dates as DD/MM/YYYY so user can search exactly what they see
                    const searchStr = Object.values(item)
                        .filter(val => val !== null && val !== undefined && typeof val !== 'object')
                        .map(val => {
                        let str = String(val);
                        if (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}/)) {
                            const parts = val.split('T')[0].split('-');
                            if (parts.length === 3)
                                str += ` ${parts[2]}/${parts[1]}/${parts[0]}`;
                        }
                        return normalize(str);
                    })
                        .join(' ');
                    return searchTerms.every(t => searchStr.includes(t));
                });
                // Inject search score if search term is active
                data = data.map(item => ({
                    ...item,
                    search_score: calculateSimilarityScore(term, item)
                }));
            }
            // 3. SORT
            const option = this.sortOption();
            return data.sort((a, b) => {
                // If searching, prioritize search score over fallback sort method
                if (term && b.search_score !== a.search_score) {
                    return (b.search_score || 0) - (a.search_score || 0);
                }
                switch (option) {
                    case 'name_asc': return (a.name || '').localeCompare(b.name || '');
                    case 'name_desc': return (b.name || '').localeCompare(a.name || '');
                    case 'received_desc': return (b.received_date || '').localeCompare(a.received_date || '');
                    case 'expiry_asc': return (a.expiry_date || '9999').localeCompare(b.expiry_date || '9999');
                    case 'expiry_desc': return (b.expiry_date || '').localeCompare(a.expiry_date || '');
                    case 'updated_desc':
                        const ta = (a.lastUpdated?.seconds || 0);
                        const tb = (b.lastUpdated?.seconds || 0);
                        return tb - ta;
                    default: return (b.received_date || '').localeCompare(a.received_date || '');
                }
            });
        });
        /** Overview numbers always follow the active method/device/widget/search set. */
        this.groupFilteredStats = computed(() => this.computeStats(this.filteredItems()));
        this.filteredStockSummary = computed(() => summarizeStockByUnit(this.filteredItems()));
        // Display subset for DOM performance
        this.visibleItems = computed(() => {
            return this.filteredItems().slice(0, this.displayLimit()).map(item => ({
                ...item,
                derivedDeviceCodes: this.tagCatalog.deriveDeviceCodes(item.sop_tags),
                derivedMethodLabels: (item.sop_tags || [])
                    .map(key => formatMethodOptionLabel(this.tagCatalog.resolveTag(key)))
                    .filter(Boolean),
            }));
        });
        this.hasMore = computed(() => this.visibleItems().length < this.filteredItems().length);
        this.selectedIds = signal(new Set());
        this.showBulkTagModal = signal(false);
        /** Danh sach lo cung ten voi selectedStd(), da sap xep FEFO. Dung cho Assign Modal. */
        this.sameNameAsSelected = computed(() => {
            const sel = this.selectedStd();
            if (!sel)
                return [];
            return sortStandardsByFefo(getSameStandardLots(sel, this.allStandards(), false));
        });
        /** Du lieu thuc te se xuat: cac chuan da chon (neu co) hoac toan bo filteredItems */
        this.exportItems = computed(() => {
            let items = this.filteredItems();
            if (this.exportDataSource() === 'selected' && this.selectedIds().size > 0) {
                items = items.filter(item => this.selectedIds().has(item.id));
            }
            if (this.exportType() === 'expiry') {
                items = items.filter(item => !!item.expiry_date);
            }
            return items;
        });
        /** Mo ta ngan bo loc dang ap dung - hien thi trong modal header */
        this.exportSubtitle = computed(() => {
            const src = this.exportDataSource();
            const cnt = src === 'selected' ? this.selectedIds().size : this.filteredItems().length;
            const filter = this.activeWidgetFilter();
            const search = this.searchTerm();
            const filterLabels = {
                expired: 'Đã hết hạn',
                expiring_soon: 'Sắp hết hạn 30 ngày',
                expiring_3months: 'Sắp hết hạn 3 tháng tới',
                low_stock: 'Tồn kho thấp',
            };
            let desc = src === 'selected' ? `${cnt} chuẩn đã chọn` : `${cnt} kết quả`;
            if (filter !== 'all')
                desc += ` · Lọc: ${filterLabels[filter] || filter}`;
            if (search)
                desc += ` · Tìm: “${search}”`;
            return desc;
        });
        /** So nhom chuan co it nhat 1 chuan thay the trong kho - hien thi trong modal footer */
        this.exportGroupCount = computed(() => {
            const items = this.exportItems();
            if (items.length === 0)
                return 0;
            const allStds = this.allStandards();
            return items.filter(item => this.hasRelatedStandards(item, allStds)).length;
        });
        // Import Preview State
        this.importPreviewData = signal([]);
        this.pendingImportFile = signal(null);
        this.importSheetNames = signal([]);
        this.selectedImportSheet = signal('');
        this.importUsageLogPreviewData = signal([]);
        this.validUsageLogsCount = computed(() => this.importUsageLogPreviewData().filter(i => i.isValid && !i.isDuplicate).length);
        this.duplicateUsageLogsCount = computed(() => this.importUsageLogPreviewData().filter(i => i.isDuplicate).length);
        this.errorUsageLogsCount = computed(() => this.importUsageLogPreviewData().filter(i => !i.isValid && !i.isDuplicate).length);
        this.selectedStd = signal(null);
        this.selectedStandardsToPrint = signal([]);
        this.historyStd = signal(null);
        this.historyLogs = signal([]);
        this.loadingHistory = signal(false);
        this.loadingMoreHistory = signal(false);
        this.hasMoreHistory = signal(false);
        this.usageHistoryPageSize = 100;
        this.historyLastDoc = null;
        this.showModal = signal(false);
        this.isEditing = signal(false);
        this.showAssignModal = signal(false);
        this.isAssignMode = signal(true);
        this.userList = signal([]);
        this.showPrintModal = signal(false);
        // Bulk CoA Upload State
        this.bulkCoaItems = signal([]);
        this.showBulkCoaModal = signal(false);
        this.isBulkUploading = signal(false);
        this.bulkUploadComplete = signal(false);
        this.showDataCleanupModal = signal(false);
        // --- Backfill Usage Log State (Manager) ---
        this.showBackfillModal = signal(false);
        this.selectedBackfillStd = signal(null);
        this.formatNum = formatNum;
        this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(term => {
            this.searchTerm.set(term);
            // Reset pagination on search
            this.displayLimit.set(50);
        });
        // Sync state to service so it persists when navigating away
        effect(() => {
            this.stdService.listState.searchTerm = this.searchTerm();
            this.stdService.listState.sortOption = this.sortOption();
            this.stdService.listState.viewMode = this.viewMode();
        });
    }
    ngOnInit() {
        this.isLoading.set(true);
        // Pre-load Google Drive SDK script in background so when user interacts, we don't block for network request
        this.googleDriveService.ensureInitialized().catch(e => console.warn('GIS preload deferred:', e));
        // Reactive view mode listener (updates on window resize / device rotation)
        this.mobileMediaQuery.addEventListener('change', this.onMediaChange);
        // Setup Real-time Listener (Load All)
        const cached = this.stdService.getAllStandardsFromCache();
        if (cached && cached.length > 0) {
            this.allStandards.set(cached);
        }
        this.snapshotUnsub = this.stdService.listenToStandards((items) => {
            this.allStandards.set([...items]);
            this.isLoading.set(false);
        });
    }
    ngOnDestroy() {
        this.searchSubject.complete();
        if (this.snapshotUnsub)
            this.snapshotUnsub();
        this.mobileMediaQuery.removeEventListener('change', this.onMediaChange);
    }
    // --- Purchase Requests Logic (Staff) ---
    openPurchaseRequestModal(std) {
        if (this.isProcessing())
            return;
        this.selectedPurchaseStd.set(std);
        this.showPurchaseRequestModal.set(true);
    }
    closePurchaseRequestModal() {
        this.showPurchaseRequestModal.set(false);
        this.selectedPurchaseStd.set(null);
    }
    onInternalIdChange(event) {
        // Logic removed as per user request (Internal ID is manual, Location is based on Storage Condition)
    }
    toggleSelection(id) {
        this.selectedIds.update(set => {
            const newSet = new Set(set);
            if (newSet.has(id))
                newSet.delete(id);
            else
                newSet.add(id);
            return newSet;
        });
    }
    isAllSelected() { return this.visibleItems().length > 0 && this.visibleItems().every(i => this.selectedIds().has(i.id)); }
    toggleAll() {
        if (this.isAllSelected())
            this.selectedIds.set(new Set());
        else
            this.selectedIds.set(new Set(this.visibleItems().map(i => i.id)));
    }
    async confirmBulkTagUpdate(data) {
        if (this.isProcessing())
            return;
        const ids = [...this.selectedIds()];
        if (!ids.length)
            return;
        if (data.mode === 'REPLACE' && !await this.confirmationService.confirm({
            message: `REPLACE sẽ thay thế toàn bộ nhãn trên ${ids.length} lọ. Tiếp tục?`,
            confirmText: 'Xác nhận REPLACE',
            isDangerous: true,
        }))
            return;
        this.isProcessing.set(true);
        try {
            const result = await this.stdService.bulkUpdateStandardTags(ids, data.tags, data.mode);
            const message = `Đã cập nhật ${result.successIds.length} lọ` +
                (result.failed.length ? `; ${result.failed.length} lỗi` : '') +
                (result.skippedIds.length ? `; ${result.skippedIds.length} không còn tồn tại` : '');
            this.toast.show(message, result.failed.length ? 'error' : 'success');
            this.showBulkTagModal.set(false);
            if (!result.failed.length)
                this.selectedIds.set(new Set());
        }
        catch (error) {
            this.toast.show('Lỗi gán nhãn: ' + (error?.message || error), 'error');
        }
        finally {
            this.isProcessing.set(false);
        }
    }
    refreshData() {
        // Just reset the view limit, data is live synced
        this.displayLimit.set(50);
    }
    loadMore() {
        // Increase visible limit
        this.displayLimit.update(l => l + 50);
    }
    onSearchInput(val) { this.searchSubject.next(val); }
    onSortChange(val) { this.sortOption.set(val); }
    openAddModal() {
        this.isEditing.set(false);
        this.selectedStd.set(null);
        this.showModal.set(true);
    }
    openEditModal(std) {
        if (!this.auth.canEditStandards())
            return;
        this.selectedStd.set(std);
        this.isEditing.set(true);
        this.showModal.set(true);
    }
    closeModal() {
        if (!this.isProcessing()) {
            this.showModal.set(false);
        }
    }
    // --- HARDENED: Bulk Delete ---
    async deleteSelected() {
        if (this.isProcessing())
            return;
        const ids = Array.from(this.selectedIds());
        if (ids.length === 0)
            return;
        const active = this.allStandards().filter(standard => ids.includes(standard.id) && (standard.status === 'IN_USE' || standard.current_holder || standard.current_holder_uid ||
            standard.current_request_id || standard.has_pending_request));
        if (active.length) {
            this.toast.show(`Không thể ẩn ${active.length} lô đang mượn/trả hoặc chờ duyệt.`, 'error');
            return;
        }
        if (await this.confirmationService.confirm({ message: `Bạn có chắc muốn ẩn ${ids.length} chuẩn đã chọn khỏi danh sách?\n\n• Lịch sử sử dụng vẫn được lưu giữ đầy đủ.\n• Dữ liệu có thể khôi phục từ Thùng rác (quản trị viên).`, confirmText: 'Xác nhận ẩn', isDangerous: true })) {
            this.isProcessing.set(true);
            try {
                await this.stdService.deleteSelectedStandards(ids);
                this.toast.show(`Đã ẩn ${ids.length} chuẩn. Lịch sử sử dụng vẫn được giữ lại.`, 'success');
                this.selectedIds.set(new Set());
            }
            catch (e) {
                this.toast.show('Lỗi xóa: ' + e.message, 'error');
            }
            finally {
                this.isProcessing.set(false);
            }
        }
    }
    // --- NEW IMPORT LOGIC ---
    async handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file)
            return;
        this.isParsingImport.set(true);
        try {
            const preview = await this.stdService.parseExcelWorkbook(file);
            if (!preview.items.length)
                throw new Error('Sheet đã chọn không có dòng dữ liệu.');
            this.pendingImportFile.set(file);
            this.importSheetNames.set(preview.sheetNames);
            this.selectedImportSheet.set(preview.selectedSheet);
            this.importPreviewData.set(preview.items);
            const validCount = preview.items.filter(item => item.isValid).length;
            const invalidCount = preview.items.length - validCount;
            this.toast.show(invalidCount > 0
                ? `Đã đọc ${preview.items.length} dòng từ sheet ${preview.selectedSheet}: ${validCount} hợp lệ, ${invalidCount} cần kiểm tra.`
                : `Đã đọc ${preview.items.length} dòng hợp lệ từ sheet ${preview.selectedSheet}.`, invalidCount > 0 ? 'warning' : 'info');
        }
        catch (e) {
            this.toast.show('Lỗi đọc file: ' + e.message, 'error');
        }
        finally {
            this.isParsingImport.set(false);
            event.target.value = ''; // Reset input
        }
    }
    async changeImportSheet(sheetName) {
        const file = this.pendingImportFile();
        if (!file || !sheetName || sheetName === this.selectedImportSheet() || this.isParsingImport())
            return;
        this.isParsingImport.set(true);
        try {
            const preview = await this.stdService.parseExcelWorkbook(file, sheetName);
            if (!preview.items.length)
                throw new Error('Sheet đã chọn không có dòng dữ liệu.');
            this.selectedImportSheet.set(preview.selectedSheet);
            this.importPreviewData.set(preview.items);
        }
        catch (e) {
            this.toast.show('Không thể đọc sheet: ' + e.message, 'error');
        }
        finally {
            this.isParsingImport.set(false);
        }
    }
    async handleUsageLogFileSelect(event) {
        const file = event.target.files[0];
        if (!file)
            return;
        this.isLoading.set(true);
        try {
            const data = await this.stdService.parseUsageLogExcelData(file);
            this.importUsageLogPreviewData.set(data);
            this.toast.show(`Đã đọc ${data.length} dòng nhật ký.`);
        }
        catch (e) {
            this.toast.show('Lỗi đọc file: ' + e.message, 'error');
        }
        finally {
            this.isLoading.set(false);
            event.target.value = ''; // Reset input
        }
    }
    cancelImport() {
        this.importPreviewData.set([]);
        this.importUsageLogPreviewData.set([]);
        this.pendingImportFile.set(null);
        this.importSheetNames.set([]);
        this.selectedImportSheet.set('');
    }
    // --- HARDENED: Confirm Import ---
    async confirmImport() {
        if (this.importPreviewData().length === 0 || this.isImporting())
            return;
        if (this.importPreviewData().some(item => item.mode === 'CONFLICT'))
            return;
        this.isImporting.set(true);
        try {
            const result = await this.stdService.saveImportedData(this.importPreviewData());
            const parts = [
                result.created > 0 ? `${result.created} chuẩn mới` : '',
                result.updated > 0 ? `${result.updated} chuẩn đã có` : '',
                result.restored > 0 ? `khôi phục ${result.restored} chuẩn` : '',
                result.skippedLogs > 0 ? `không nhập lại ${result.skippedLogs} nhật ký của chuẩn đã có` : '',
                result.skippedInvalid > 0 ? `bỏ qua ${result.skippedInvalid} dòng lỗi` : ''
            ].filter(Boolean);
            this.toast.show(`Import thành công: ${parts.join(', ')}.`, 'success');
            this.cancelImport();
        }
        catch (e) {
            this.importPreviewData.update(items => [...items]);
            this.toast.show('Không thể lưu dữ liệu nhập: ' + e.message, 'error');
        }
        finally {
            this.isImporting.set(false);
        }
    }
    async confirmUsageLogImport() {
        if (this.importUsageLogPreviewData().length === 0 || this.isImporting())
            return;
        this.isImporting.set(true);
        try {
            await this.stdService.saveImportedUsageLogs(this.importUsageLogPreviewData());
            this.toast.show('Nhập nhật ký thành công!', 'success');
            this.importUsageLogPreviewData.set([]);
        }
        catch (e) {
            this.toast.show('Không thể lưu nhật ký vừa nhập: ' + e.message, 'error');
        }
        finally {
            this.isImporting.set(false);
        }
    }
    // --- Quick Drive Upload (from list/grid view) ---
    triggerQuickDriveUpload(std, event) {
        event.stopPropagation();
        this.quickUploadStd = std;
        if (this.googleDriveService.hasValidToken) {
            const input = document.querySelector('#quickDriveInput');
            if (input) {
                input.click();
                return;
            }
            // Fallback: try by ref
            const inputs = document.querySelectorAll('input[type="file"][accept]');
            const driveInput = Array.from(inputs).find(el => el.accept.includes('.pdf'));
            if (driveInput && driveInput.classList.contains('hidden')) {
                driveInput.click();
                return;
            }
            this.toast.show('Không tìm thấy ô chọn tệp.', 'error');
        }
        else {
            // XÁC THỰC TRƯỚC: Nếu chưa có token, xác thực xong yêu cầu user nhấn lại để có user activation
            this.googleDriveService.authenticateSync(() => {
                this.toast.show('Đã kết nối Google Drive! Vui lòng nhấn lại nút Tải lên để chọn tệp.', 'success');
            }, (err) => {
                this.toast.show('Lỗi đăng nhập Google: ' + err, 'error');
                this.quickUploadStd = null;
            });
        }
    }
    async handleQuickDriveUpload(event) {
        const file = event.target.files[0];
        const std = this.quickUploadStd;
        if (!file || !std) {
            event.target.value = '';
            return;
        }
        this.quickUploadStdId.set(std.id);
        try {
            const fileName = GoogleDriveService.generateFileName(std.name, std.lot_number || '', file.name);
            this.toast.show(`Đang tải CoA lên cho "${std.name}"...`);
            // Đã có token rồi nên hàm này sẽ upload luôn mà không bị hỏi lại
            const previewUrl = await this.googleDriveService.uploadFile(file, fileName);
            // Tìm tất cả các chuẩn cùng Tên và Số Lô
            const lot = (std.lot_number || '').trim().toLowerCase();
            const siblings = lot
                ? this.allStandards().filter(s => s.name?.trim().toLowerCase() === std.name?.trim().toLowerCase() &&
                    (s.lot_number || '').trim().toLowerCase() === lot &&
                    !s._isDeleted)
                : [std];
            await this.stdService.completeCoaUpload(siblings.length ? siblings : [std], previewUrl);
            if (siblings.length > 1) {
                this.toast.show(`Upload thành công! Đã tự động áp dụng CoA cho ${siblings.length} lọ chuẩn cùng lô.`);
            }
            else {
                this.toast.show(`Tải CoA lên thành công! ${fileName}`);
            }
        }
        catch (e) {
            console.error('Quick Drive upload error:', e);
            this.toast.show('Không thể tải CoA lên: ' + (e.message || 'Không xác định'), 'error');
        }
        finally {
            this.quickUploadStdId.set('');
            this.quickUploadStd = null;
            event.target.value = '';
        }
    }
    // --- Bulk CoA Match & Upload Logic ---
    handleBulkCoaSelect(event) {
        const files = event.target.files;
        if (!files || files.length === 0)
            return;
        const newItems = [];
        const standards = this.allStandards();
        for (const file of Array.from(files)) {
            if (!file.name.toLowerCase().match(/\.(pdf|jpeg|jpg|png|webp|bmp|doc|docx)$/))
                continue;
            const nameLower = file.name.toLowerCase();
            // Match logic: Generate suggested standards sorted by global similarity score
            const scoredStandards = standards.map(s => {
                const score = calculateSimilarityScore(nameLower, s);
                return { std: s, score };
            });
            // Top ones first, fallback to alphabetical on tie
            scoredStandards.sort((a, b) => b.score - a.score || (a.std.name || '').localeCompare(b.std.name || ''));
            const suggestedStandards = scoredStandards.map(ss => ({ std: ss.std, score: ss.score }));
            // Define matched standard as top 1 IF the score is reasonably high enough
            // (to avoid forcing a match when nothing is actually similar)
            let matched = null;
            let matchScore = 0;
            if (scoredStandards[0] && scoredStandards[0].score >= 80) { // arbitrary threshold for confident auto-match
                matched = scoredStandards[0].std;
                matchScore = scoredStandards[0].score;
            }
            newItems.push({
                file,
                fileName: file.name,
                matchedStandard: matched,
                matchScore: matchScore,
                suggestedStandards: suggestedStandards, // Feed sorted array to dropdown
                status: 'pending'
            });
        }
        if (newItems.length > 0) {
            this.bulkCoaItems.set(newItems);
            this.showBulkCoaModal.set(true);
            this.bulkUploadComplete.set(false);
        }
        else {
            this.toast.show('Không tìm thấy file tài liệu hợp lệ trong thư mục/số file đã chọn (yêu cầu .pdf, .jpg, v.v.)', 'error');
        }
        event.target.value = '';
    }
    cancelBulkCoa() {
        if (this.isBulkUploading())
            return;
        this.showBulkCoaModal.set(false);
        this.bulkCoaItems.set([]);
    }
    // Xóa hàm triggerBulkUpload vì không cần nữa
    async confirmBulkCoaUpload() {
        const items = this.bulkCoaItems();
        const toUpload = items.filter(i => i.matchedStandard && i.status !== 'success');
        if (toUpload.length === 0 || this.isBulkUploading())
            return;
        const targetKeys = toUpload.map(item => {
            const standard = item.matchedStandard;
            const lot = (standard.lot_number || '').trim().toLowerCase();
            return lot ? `${standard.name.trim().toLowerCase()}|${lot}` : standard.id;
        });
        if (new Set(targetKeys).size !== targetKeys.length) {
            this.toast.show('Có nhiều file cùng ghép vào một chuẩn/lô. Vui lòng chỉ giữ một file cho mỗi lô.', 'error');
            return;
        }
        // NÚT "XÁC NHẬN UPLOAD" TRONG MODAL SẼ KÍCH HOẠT HÀM NÀY, TỨC LÀ MỘT USER GESTURE.
        this.googleDriveService.authenticateSync(async () => {
            this.isBulkUploading.set(true);
            this.bulkUploadComplete.set(false);
            this.progressService.start('Đang tải lên CoA hàng loạt', 'Vui lòng không đóng trình duyệt', toUpload.length);
            let processed = 0;
            try {
                for (const item of toUpload) {
                    processed++;
                    this.progressService.update(processed, `Đang xử lý tải lên cho chuẩn ${item.matchedStandard?.name}`);
                    item.status = 'uploading';
                    this.bulkCoaItems.set([...items]); // Trigger UI update
                    const std = item.matchedStandard;
                    const fileName = GoogleDriveService.generateFileName(std.name, std.lot_number || '', item.file.name);
                    try {
                        const previewUrl = await this.googleDriveService.uploadFile(item.file, fileName);
                        // Tìm tất cả các chuẩn cùng Tên và Số Lô (1-to-N matching)
                        const lot = (std.lot_number || '').trim().toLowerCase();
                        const siblings = lot
                            ? this.allStandards().filter(s => s.name?.trim().toLowerCase() === std.name?.trim().toLowerCase() &&
                                (s.lot_number || '').trim().toLowerCase() === lot &&
                                !s._isDeleted)
                            : [std];
                        await this.stdService.completeCoaUpload(siblings.length ? siblings : [std], previewUrl);
                        item.status = 'success';
                    }
                    catch (e) {
                        item.status = 'error';
                        item.uploadError = e.message || 'Lỗi kết nối';
                    }
                    this.bulkCoaItems.set([...items]); // Update progress for this file
                }
            }
            finally {
                this.isBulkUploading.set(false);
                this.bulkUploadComplete.set(true);
                const successCount = items.filter(item => item.status === 'success').length;
                const errorCount = items.filter(item => item.status === 'error').length;
                this.toast.show(errorCount > 0
                    ? `Hoàn tất: ${successCount} thành công, ${errorCount} lỗi.`
                    : `Hoàn tất ${successCount} file CoA.`, errorCount > 0 ? 'error' : 'success');
                this.progressService.complete();
            }
        }, (err) => {
            this.toast.show('Lỗi đăng nhập Google: ' + err, 'error');
        });
    }
    // --- Helpers ---
    copyText(text, event) {
        event.stopPropagation();
        if (!text)
            return;
        navigator.clipboard.writeText(text).then(() => this.toast.show('Đã sao chép: ' + text));
    }
    goToReturn(std) {
        if (!std.current_request_id) {
            this.toast.show('Không tìm thấy yêu cầu mượn chuẩn này', 'error');
            return;
        }
        this.toast.show('Chuyển đến trang Yêu cầu để trả chuẩn');
        this.router.navigate(['/standard-requests']);
    }
    async openAssignModal(std, isAssign = true) {
        if (this.isProcessing())
            return;
        this.selectedStd.set(std);
        this.isAssignMode.set(isAssign);
        this.showAssignModal.set(true);
        if (isAssign && this.userList().length === 0) {
            try {
                const users = await this.firebaseService.getAllUsers();
                this.userList.set(users);
            }
            catch (error) {
                console.error('Error fetching users:', error);
            }
        }
    }
    async confirmAssign(data) {
        const std = this.selectedStd();
        if (!std || !data.userId || !data.purpose) {
            this.toast.show('Vui lòng điền đầy đủ thông tin bắt buộc (*)', 'error');
            return;
        }
        if (!isFefoCandidate(std)) {
            this.toast.show('Lô chuẩn không còn sẵn sàng để cấp. Vui lòng tải lại và chọn lô khác.', 'error');
            return;
        }
        this.isProcessing.set(true);
        try {
            const request = {
                standardId: std.id,
                standardName: std.name,
                lotNumber: std.lot_number,
                requestedBy: data.userId,
                requestedByName: data.userName,
                requestDate: Date.now(),
                purpose: data.purpose.trim(),
                expectedAmount: data.expectedAmount || 0,
                status: 'PENDING_APPROVAL',
                totalAmountUsed: 0
            };
            // If it's "Assign Mode", it implies an admin is giving it to someone,
            // but we still follow the request workflow for tracking.
            await this.stdService.createRequest(request, this.isAssignMode());
            if (this.isAssignMode()) {
                // Automatically dispense if assigning directly
                await this.stdService.dispenseStandard(request.id, std.id, this.auth.currentUser()?.uid || '', this.auth.currentUser()?.displayName || 'QTV', true);
                this.toast.show('Đã gán chuẩn thành công', 'success');
            }
            else {
                this.toast.show('Đã gửi yêu cầu mượn chuẩn', 'success');
            }
            this.showAssignModal.set(false);
        }
        catch (error) {
            this.toast.show(error.message || 'Lỗi khi xử lý', 'error');
        }
        finally {
            this.isProcessing.set(false);
        }
    }
    openPrintModal(std) {
        this.selectedStd.set(std);
        this.selectedStandardsToPrint.set([]);
        this.showPrintModal.set(true);
    }
    openBatchPrintModal() {
        const ids = Array.from(this.selectedIds());
        const list = this.allStandards().filter(s => s.id && ids.includes(s.id));
        if (list.length === 0)
            return;
        this.selectedStd.set(null);
        this.selectedStandardsToPrint.set(list);
        this.showPrintModal.set(true);
    }
    getQrCodeUrl(std) {
        if (!std)
            return '';
        const baseUrl = window.location.origin;
        return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(baseUrl + '/standards/' + std.id)}`;
    }
    navigateToDetail(std) {
        this.router.navigate(['/standards', std.id]);
    }
    async viewHistory(std) {
        this.historyStd.set(std);
        this.loadingHistory.set(true);
        this.historyLastDoc = null;
        this.hasMoreHistory.set(false);
        try {
            const page = await this.stdService.getUsageHistoryPage(std.id, this.usageHistoryPageSize);
            this.historyLogs.set(page.items);
            this.historyLastDoc = page.lastDoc;
            this.hasMoreHistory.set(page.hasMore);
        }
        finally {
            this.loadingHistory.set(false);
        }
    }
    async loadMoreHistory() {
        const std = this.historyStd();
        if (!std || !this.hasMoreHistory() || !this.historyLastDoc || this.loadingMoreHistory())
            return;
        this.loadingMoreHistory.set(true);
        try {
            const page = await this.stdService.getUsageHistoryPage(std.id, this.usageHistoryPageSize, this.historyLastDoc);
            if (this.historyStd()?.id !== std.id)
                return;
            const existingIds = new Set(this.historyLogs().map(log => log.id));
            this.historyLogs.update(logs => [
                ...logs,
                ...page.items.filter(log => !existingIds.has(log.id))
            ]);
            this.historyLastDoc = page.lastDoc;
            this.hasMoreHistory.set(page.hasMore);
        }
        finally {
            this.loadingMoreHistory.set(false);
        }
    }
    async deleteLog(log) {
        if (this.isProcessing())
            return;
        if (!this.historyStd() || !log.id)
            return;
        if (await this.confirmationService.confirm({ message: `Xóa lịch sử dụng ngày ${log.date}?`, confirmText: 'Xóa & Hoàn kho', isDangerous: true })) {
            this.isProcessing.set(true);
            try {
                await this.stdService.deleteUsageLog(this.historyStd().id, log.id);
                this.toast.show('Đã xóa', 'success');
                await this.viewHistory(this.historyStd());
            }
            catch (e) {
                this.toast.show('Lỗi: ' + e.message, 'error');
            }
            finally {
                this.isProcessing.set(false);
            }
        }
    }
    // --- Backfill Usage Log (Manager) ---
    async openBackfillModal(std) {
        if (this.isProcessing())
            return;
        this.selectedBackfillStd.set(std);
        this.showBackfillModal.set(true);
        if (this.userList().length === 0) {
            try {
                const users = await this.firebaseService.getAllUsers();
                this.userList.set(users);
            }
            catch (error) {
                console.error('Error fetching users:', error);
            }
        }
    }
    async confirmBackfill(data) {
        const std = this.selectedBackfillStd();
        if (!std || this.isProcessing())
            return;
        this.isProcessing.set(true);
        try {
            // Tạo timestamp từ ngày nhập: đặt vào 12:00:00 để tránh nhầm timezone
            const dateObj = new Date(data.date + 'T12:00:00');
            const log = {
                date: data.date + 'T12:00:00',
                timestamp: dateObj.getTime(),
                amount_used: data.amountUsed,
                unit: data.unit,
                purpose: data.purpose,
                user: data.userName,
                isDepleted: data.isDepleted
            };
            await this.stdService.recordBackfillUsage(std.id, log, data.userId, data.userName);
            this.toast.show(`Đã ghi nhật ký ${data.amountUsed} ${data.unit} cho ${data.userName} ngày ${data.date.split('-').reverse().join('/')}`, 'success');
            this.showBackfillModal.set(false);
            this.selectedBackfillStd.set(null);
        }
        catch (e) {
            this.toast.show('Lỗi: ' + e.message, 'error');
        }
        finally {
            this.isProcessing.set(false);
        }
    }
    openCoaPreview(url, event) {
        event.stopPropagation();
        this.printService.openCoaPreview(url, 'Chung chi chat luong (CoA)');
    }
    // --- EXPORT EXCEL ---
    openExportModal() {
        this.exportDataSource.set(this.selectedIds().size > 0 ? 'selected' : 'filtered');
        this.exportType.set('full');
        this.exportCompleted.set(false);
        this.showExportModal.set(true);
    }
    async runExport() {
        const items = this.exportItems();
        if (items.length === 0) {
            this.toast.show('Không có dữ liệu để xuất.', 'info');
            return;
        }
        this.isExporting.set(true);
        this.exportCompleted.set(false);
        try {
            const ExcelJSModule = await import('exceljs');
            const Workbook = ExcelJSModule.Workbook || ExcelJSModule.default.Workbook;
            const wb = new Workbook();
            wb.creator = 'LIMS System';
            wb.created = new Date();
            const isExpiry = this.exportType() === 'expiry';
            const today = new Date();
            const todayMs = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
            const thirtyDaysMs = todayMs + 30 * 86400000;
            const ninetyDaysMs = todayMs + 90 * 86400000;
            const C = {
                headerBg: 'FF3730A3', headerFg: 'FFFFFFFF',
                primaryBg: 'FFEEF2FF', primaryFg: 'FF1E1B4B', primaryBorder: 'FF4F46E5',
                replaceBg: 'FFFEFCE8', replaceFg: 'FF92400E', replaceBorder: 'FFF59E0B',
                depletedBg: 'FFF3F4F6', depletedFg: 'FF9CA3AF', depletedBorder: 'FF9CA3AF',
                expiredBg: 'FFFEE2E2', expiredFg: 'FFB91C1C',
                soonBg: 'FFFFF7ED', soonFg: 'FFC2410C',
                m3Bg: 'FFFEFCE8', m3Fg: 'FFA16207',
                sepBg: 'FFF1F5F9', border: 'FFE2E8F0',
            };
            const getExpiryCat = (d) => {
                if (!d)
                    return null;
                const ms = new Date(d).getTime();
                if (ms < todayMs)
                    return 'expired';
                if (ms <= thirtyDaysMs)
                    return 'soon';
                if (ms <= ninetyDaysMs)
                    return 'm3';
                return null;
            };
            const getPrimaryBg = (cat) => cat === 'expired' ? C.expiredBg : cat === 'soon' ? C.soonBg : cat === 'm3' ? C.m3Bg : C.primaryBg;
            const getPrimaryFg = (cat) => cat === 'expired' ? C.expiredFg : cat === 'soon' ? C.soonFg : cat === 'm3' ? C.m3Fg : C.primaryFg;
            const getDaysLeft = (d) => d ? Math.ceil((new Date(d).getTime() - todayMs) / 86400000).toString() : '';
            const getExpiryLabel = (d) => {
                if (!d)
                    return '';
                const ms = new Date(d).getTime();
                if (ms < todayMs)
                    return 'Da het han';
                if (ms <= thirtyDaysMs)
                    return 'Sap het han (30 ngay)';
                if (ms <= ninetyDaysMs)
                    return 'Sap het han (3 thang)';
                return 'Con han';
            };
            const ws = wb.addWorksheet(isExpiry ? 'Bao cao han dung' : 'Danh sach chuan', { views: [{ state: 'frozen', ySplit: 1 }] });
            if (isExpiry) {
                ws.columns = [
                    { header: 'STT', key: 'stt', width: 6 },
                    { header: 'Phan loai', key: 'pl', width: 17 },
                    { header: 'Ma quan ly', key: 'mql', width: 14 },
                    { header: 'Ten chuan', key: 'ten', width: 32 },
                    { header: 'Phuong phap', key: 'methods', width: 28 },
                    { header: 'Thiet bi', key: 'devices', width: 20 },
                    { header: 'Phong thi nghiem', key: 'lab', width: 18 },
                    { header: 'Quyet dinh', key: 'decision', width: 24 },
                    { header: 'So lo', key: 'lot', width: 14 },
                    { header: 'Hang san xuat', key: 'hang', width: 22 },
                    { header: 'Ma Catalog', key: 'catalog', width: 16 },
                    { header: 'Luong con lai', key: 'luong', width: 14 },
                    { header: 'Don vi', key: 'dv', width: 9 },
                    { header: 'Han su dung', key: 'han', width: 14 },
                    { header: 'Con lai ngay', key: 'ngay', width: 15 },
                    { header: 'Trang thai han', key: 'tt', width: 24 },
                    { header: 'Vi tri luu tru', key: 'vt', width: 16 },
                    { header: 'Dieu kien BQ', key: 'dk', width: 20 },
                ];
            }
            else {
                ws.columns = [
                    { header: 'STT', key: 'stt', width: 6 },
                    { header: 'Phan loai', key: 'pl', width: 17 },
                    { header: 'Ma quan ly', key: 'mql', width: 14 },
                    { header: 'Ten chuan', key: 'ten', width: 32 },
                    { header: 'Phuong phap', key: 'methods', width: 28 },
                    { header: 'Thiet bi', key: 'devices', width: 20 },
                    { header: 'Phong thi nghiem', key: 'lab', width: 18 },
                    { header: 'Quyet dinh', key: 'decision', width: 24 },
                    { header: 'Ten hoa hoc', key: 'tenhh', width: 28 },
                    { header: 'So CAS', key: 'cas', width: 14 },
                    { header: 'Ma Catalog', key: 'catalog', width: 16 },
                    { header: 'So lo', key: 'lot', width: 14 },
                    { header: 'Do tinh khiet', key: 'dtk', width: 14 },
                    { header: 'Hang san xuat', key: 'hang', width: 22 },
                    { header: 'Quy cach', key: 'qc', width: 13 },
                    { header: 'Luong ban dau', key: 'luongbd', width: 15 },
                    { header: 'Luong con lai', key: 'luong', width: 15 },
                    { header: 'Don vi', key: 'dv', width: 9 },
                    { header: 'Ngay nhan', key: 'ngaynhan', width: 13 },
                    { header: 'Han su dung', key: 'han', width: 14 },
                    { header: 'Ngay mo nap', key: 'ngaymo', width: 14 },
                    { header: 'Vi tri luu tru', key: 'vt', width: 16 },
                    { header: 'Dieu kien BQ', key: 'dk', width: 20 },
                    { header: 'Trang thai', key: 'status', width: 14 },
                    { header: 'Link CoA', key: 'coa', width: 32 },
                    { header: 'So hop dong', key: 'hopd', width: 15 },
                ];
            }
            const headerRow = ws.getRow(1);
            headerRow.height = 32;
            for (let ci = 1; ci <= ws.columnCount; ci++) {
                const cell = headerRow.getCell(ci);
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.headerBg } };
                cell.font = { color: { argb: C.headerFg }, bold: true, size: 10.5 };
                cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
                cell.border = {
                    bottom: { style: 'medium', color: { argb: 'FF1E1B4B' } },
                    right: { style: 'thin', color: { argb: 'FF4338CA' } },
                };
            }
            const applyRowStyle = (row, type, expCat) => {
                const bg = type === 'primary' ? getPrimaryBg(expCat) : type === 'replacement' ? C.replaceBg : C.depletedBg;
                const fg = type === 'primary' ? getPrimaryFg(expCat) : type === 'replacement' ? C.replaceFg : C.depletedFg;
                const lBorder = type === 'primary' ? C.primaryBorder : type === 'replacement' ? C.replaceBorder : C.depletedBorder;
                row.height = type === 'primary' ? 20 : 18;
                for (let ci = 1; ci <= ws.columnCount; ci++) {
                    const cell = row.getCell(ci);
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
                    cell.font = { color: { argb: fg }, bold: type === 'primary', italic: type === 'depleted', size: 10 };
                    cell.border = {
                        left: ci === 1 ? { style: 'thick', color: { argb: lBorder } } : { style: 'thin', color: { argb: C.border } },
                        right: { style: 'thin', color: { argb: C.border } },
                        bottom: { style: 'thin', color: { argb: C.border } },
                    };
                    cell.alignment = { vertical: 'middle', wrapText: false };
                }
                if (expCat && type !== 'depleted') {
                    const expFg = expCat === 'expired' ? C.expiredFg : expCat === 'soon' ? C.soonFg : C.m3Fg;
                    const hanCell = row.getCell('han');
                    hanCell.font = { color: { argb: expFg }, bold: true, size: 10 };
                }
                if (type === 'depleted') {
                    const luongCell = row.getCell('luong');
                    luongCell.font = { color: { argb: C.depletedFg }, italic: true, strike: true, size: 10 };
                }
            };
            const groups = this.buildExportGroups(items);
            let stt = 1;
            const buildRowData = (item, label, sttVal) => {
                const methodLabels = (item.sop_tags || [])
                    .map((key) => formatMethodOptionLabel(this.tagCatalog.resolveTag(key)))
                    .join(', ');
                const methodOptions = (item.sop_tags || []).map((key) => this.tagCatalog.resolveTag(key));
                const sourceLabs = [...new Set(methodOptions.map(option => option.sourceLabCode).filter(Boolean))].join(', ');
                const sourceDecisions = [...new Set(methodOptions.map(option => option.sourceDecision).filter(Boolean))].join(', ');
                const deviceLabels = this.tagCatalog.deriveDeviceCodes(item.sop_tags).join(', ');
                if (isExpiry) {
                    return {
                        stt: sttVal, pl: label,
                        mql: item.internal_id || '', ten: item.name,
                        methods: methodLabels, devices: deviceLabels, lab: sourceLabs, decision: sourceDecisions,
                        lot: item.lot_number || '', hang: item.manufacturer || '',
                        catalog: item.product_code || '',
                        luong: item.current_amount, dv: item.unit,
                        han: item.expiry_date || '',
                        ngay: getDaysLeft(item.expiry_date),
                        tt: getExpiryLabel(item.expiry_date),
                        vt: item.location || '', dk: item.storage_condition || '',
                    };
                }
                return {
                    stt: sttVal, pl: label,
                    mql: item.internal_id || '', ten: item.name,
                    methods: methodLabels, devices: deviceLabels, lab: sourceLabs, decision: sourceDecisions,
                    tenhh: item.chemical_name || '', cas: item.cas_number || '',
                    catalog: item.product_code || '', lot: item.lot_number || '',
                    dtk: item.purity || '', hang: item.manufacturer || '',
                    qc: item.pack_size || '',
                    luongbd: item.initial_amount, luong: item.current_amount,
                    dv: item.unit, ngaynhan: item.received_date || '',
                    han: item.expiry_date || '', ngaymo: item.date_opened || '',
                    vt: item.location || '', dk: item.storage_condition || '',
                    status: item.status || '', coa: item.certificate_ref || '',
                    hopd: item.contract_ref || '',
                };
            };
            for (const group of groups) {
                const p = group.primary;
                const pCat = getExpiryCat(p.expiry_date);
                const pRow = ws.addRow(buildRowData(p, 'CO DINH', stt++));
                applyRowStyle(pRow, 'primary', pCat);
                for (const rep of group.replacements) {
                    const isDepleted = rep.status === 'DEPLETED' || rep.current_amount <= 0;
                    const rCat = isDepleted ? null : getExpiryCat(rep.expiry_date);
                    const rRow = ws.addRow(buildRowData(rep, isDepleted ? '  Het hang' : '  Thay the', ''));
                    applyRowStyle(rRow, isDepleted ? 'depleted' : 'replacement', rCat);
                }
                const sep = ws.addRow({});
                sep.height = 5;
                for (let ci = 1; ci <= ws.columnCount; ci++) {
                    sep.getCell(ci).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.sepBg } };
                }
            }
            // Sheet 2: Tong hop
            const ws2 = wb.addWorksheet('Tong hop');
            ws2.columns = [
                { header: 'Chi tieu', key: 'chi', width: 44 },
                { header: 'Gia tri', key: 'gia', width: 25 },
            ];
            const h2 = ws2.getRow(1);
            h2.height = 30;
            for (let ci = 1; ci <= 2; ci++) {
                const cell = h2.getCell(ci);
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D4ED8' } };
                cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 11 };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
            }
            const allFiltered = this.filteredItems();
            const groupsWithRep = groups.filter(g => g.replacements.length > 0).length;
            let sumExpired = 0, sumSoon = 0, sum3m = 0, sumLow = 0;
            const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
            const threeMonthsEnd = new Date(today.getFullYear(), today.getMonth() + 4, 1).getTime();
            allFiltered.forEach(item => {
                if ((item.current_amount / (item.initial_amount || 1)) <= 0.2)
                    sumLow++;
                if (item.expiry_date) {
                    const d = new Date(item.expiry_date).getTime();
                    if (d < todayMs)
                        sumExpired++;
                    else if (d <= thirtyDaysMs)
                        sumSoon++;
                    if (d >= thisMonthStart && d < threeMonthsEnd)
                        sum3m++;
                }
            });
            const summaryDefs = [
                { chi: 'Tong so chuan trong danh sach loc', gia: allFiltered.length },
                { chi: 'So chuan xuat trong bao cao nay', gia: items.length, bold: true },
                { chi: 'So nhom co chuan thay the trong kho', gia: groupsWithRep, bg: 'FFEEF2FF', fg: 'FF3730A3', bold: true },
                { chi: '', gia: '' },
                { chi: 'Da het han', gia: sumExpired, ...(sumExpired > 0 ? { bg: 'FFFEE2E2', fg: 'FFB91C1C', bold: true } : {}) },
                { chi: 'Sap het han (30 ngay toi)', gia: sumSoon, ...(sumSoon > 0 ? { bg: 'FFFFF7ED', fg: 'FFC2410C', bold: true } : {}) },
                { chi: 'Sap het han (3 thang toi)', gia: sum3m, ...(sum3m > 0 ? { bg: 'FFFEFCE8', fg: 'FFA16207', bold: true } : {}) },
                { chi: 'Ton kho thap (<=20%)', gia: sumLow, ...(sumLow > 0 ? { bg: 'FFEFF6FF', fg: 'FF1D4ED8', bold: true } : {}) },
                { chi: '', gia: '' },
                { chi: 'Ngay xuat bao cao', gia: this.datePipe.transform(Date.now(), 'dd/MM/yyyy HH:mm') || '' },
                { chi: 'Bo loc / Ghi chu', gia: this.exportSubtitle() },
            ];
            summaryDefs.forEach((data, idx) => {
                const row = ws2.addRow({ chi: data.chi, gia: data.gia });
                row.height = data.chi === '' ? 8 : 22;
                const bg = data.bg || (idx % 2 === 0 ? 'FFF8FAFC' : 'FFFFFFFF');
                for (let ci = 1; ci <= 2; ci++) {
                    const cell = row.getCell(ci);
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
                    cell.font = { bold: data.bold || false, color: { argb: data.fg || 'FF1E293B' }, size: 10.5 };
                    cell.border = { bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } } };
                    cell.alignment = { vertical: 'middle', horizontal: ci === 1 ? 'left' : 'center', indent: ci === 1 ? 1 : 0 };
                }
            });
            // Download
            const buffer = await wb.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `ChuanDoiChieu_${isExpiry ? 'HanDung' : 'DanhSach'}_${this.datePipe.transform(Date.now(), 'yyyyMMdd_HHmm')}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            this.exportCompleted.set(true);
            this.toast.show('Xuat tệp Excel thanh cong!', 'success');
        }
        catch (err) {
            console.error('Loi xuat Excel:', err);
            this.toast.show('Loi xuat tệp Excel: ' + (err.message || ''), 'error');
        }
        finally {
            this.isExporting.set(false);
        }
    }
    // Private helpers
    computeStats(data) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const thirtyDays = today + 30 * 24 * 60 * 60 * 1000;
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        const threeMonthsEnd = new Date(now.getFullYear(), now.getMonth() + 4, 1).getTime();
        let expired = 0;
        let expiringSoon = 0;
        let expiring3Months = 0;
        let lowStock = 0;
        for (const item of data) {
            if ((item.current_amount / (item.initial_amount || 1)) <= 0.2)
                lowStock++;
            if (!item.expiry_date)
                continue;
            const expDate = new Date(item.expiry_date).getTime();
            if (expDate < today)
                expired++;
            else if (expDate <= thirtyDays)
                expiringSoon++;
            if (expDate >= thisMonthStart && expDate < threeMonthsEnd)
                expiring3Months++;
        }
        return { expired, expiringSoon, expiring3Months, lowStock, total: data.length };
    }
    normalizeStr(s) {
        return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    }
    isValidMatch(v) {
        if (!v)
            return false;
        const s = v.trim().toLowerCase();
        if (!s || s === 'n/a' || s === 'na' || s === '-' || s === 'none' || s === 'null' || s.includes('cas inside') || s.includes('không có') || s.includes('khong co'))
            return false;
        return true;
    }
    hasRelatedStandards(item, allStds) {
        const norm = this.normalizeStr.bind(this);
        return allStds.some(std => {
            if (std.id === item.id || std._isDeleted)
                return false;
            if (this.isValidMatch(item.cas_number) && item.cas_number.trim().toLowerCase() === std.cas_number?.trim().toLowerCase())
                return true;
            if (this.isValidMatch(item.product_code) && item.product_code.trim().toLowerCase() === std.product_code?.trim().toLowerCase())
                return true;
            if (this.isValidMatch(item.name) && norm(item.name) === norm(std.name))
                return true;
            return false;
        });
    }
    buildExportGroups(items) {
        const allStds = this.allStandards();
        const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
        return items.map(item => {
            const replacements = allStds.filter(std => {
                if (std.id === item.id || std._isDeleted)
                    return false;
                if (this.isValidMatch(item.cas_number) && item.cas_number.trim().toLowerCase() === std.cas_number?.trim().toLowerCase())
                    return true;
                if (this.isValidMatch(item.product_code) && item.product_code.trim().toLowerCase() === std.product_code?.trim().toLowerCase())
                    return true;
                if (this.isValidMatch(item.name) && norm(item.name || '') === norm(std.name || ''))
                    return true;
                return false;
            });
            replacements.sort((a, b) => {
                const aOk = (a.status !== 'DEPLETED' && a.current_amount > 0) ? 1 : 0;
                const bOk = (b.status !== 'DEPLETED' && b.current_amount > 0) ? 1 : 0;
                if (aOk !== bOk)
                    return bOk - aOk;
                return (a.expiry_date || '9999').localeCompare(b.expiry_date || '9999');
            });
            return { primary: item, replacements };
        });
    }
    static { this.ɵfac = function StandardsComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StandardsComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StandardsComponent, selectors: [["app-standards"]], features: [i0.ɵɵProvidersFeature([DatePipe])], decls: 23, vars: 31, consts: [["quickDriveInput", ""], [1, "flex", "flex-col", "space-y-2", "md:space-y-3", "fade-in", "h-full", "relative"], [3, "deleteSelected", "printSelected", "openAddModal", "importStandardsFile", "importUsageLogFile", "bulkCoaSelect", "openBulkTagModal", "openTagManager", "openExportModal", "openCleanupModal", "selectedCount", "isProcessing", "canEditStandards"], [1, "flex-1", "min-h-0", "overflow-hidden", "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-[0_8px_30px_rgb(0,0,0,0.04)]", "dark:shadow-none", "border", "border-slate-100", "dark:border-slate-700", "flex", "flex-col", "relative"], [3, "searchTermChange", "activeWidgetFilterChange", "sortOptionChange", "viewModeChange", "methodTagFilterChange", "deviceFilterChange", "searchTerm", "activeWidgetFilter", "sortOption", "viewMode", "stats", "visibleCount", "filteredCount", "isLoading", "tagOptions", "methodTagFilter", "deviceOptions", "deviceFilter", "stockSummary"], [1, "flex-1", "min-h-0", "overflow-auto", "custom-scrollbar", "relative", "bg-slate-50/30", "dark:bg-slate-900/50"], [3, "items", "isLoading", "allStandardsLength", "selectedIds", "quickUploadStdId", "canEditStandards", "canAssignStandards", "canRequestStandards", "currentUser"], ["id", "quickDriveInput", "type", "file", "accept", ".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx", 1, "hidden", 3, "change"], [1, "text-center", "p-4"], [3, "isOpen", "selectedCount", "tagOptions", "isProcessing"], [3, "isOpen"], [3, "toggleSelection", "toggleAll", "navigateToDetail", "copyText", "openCoaPreview", "triggerQuickDriveUpload", "openAssignModal", "goToReturn", "openPurchaseRequestModal", "openPrintModal", "viewHistory", "openEditModal", "openBackfillModal", "items", "isLoading", "allStandardsLength", "selectedIds", "quickUploadStdId", "canEditStandards", "canAssignStandards", "canRequestStandards", "currentUser"], [3, "toggleSelection", "navigateToDetail", "copyText", "openCoaPreview", "triggerQuickDriveUpload", "openAssignModal", "goToReturn", "openPurchaseRequestModal", "openPrintModal", "viewHistory", "items", "isLoading", "allStandardsLength", "selectedIds", "quickUploadStdId", "canEditStandards", "canAssignStandards", "canRequestStandards", "currentUser"], [1, "text-xs", "font-bold", "text-gray-500", "dark:text-gray-400", "hover:text-indigo-600", "dark:hover:text-indigo-400", "transition", "active:scale-95", "bg-white", "dark:bg-slate-800", "border", "border-gray-200", "dark:border-slate-700", "px-4", "py-2", "rounded-full", "shadow-sm", "dark:shadow-none", 3, "click"], [3, "closeModal", "isOpen", "std", "allStandards"], [3, "sheetChange", "cancel", "confirm", "data", "isImporting", "isParsing", "sheetNames", "selectedSheet"], [3, "cancel", "confirm", "data", "validCount", "duplicateCount", "errorCount", "isImporting"], [3, "cancel", "confirm", "isOpen", "items", "allStandards", "isUploading", "uploadComplete"], [3, "cancel", "confirm", "isOpen", "selectedCount", "tagOptions", "isProcessing"], [3, "close", "isOpen"], [3, "closeModal", "isOpen", "allStandards"], [3, "closeModal", "confirm", "isOpen", "std", "isAssignMode", "userList", "isProcessing", "currentUserUid", "currentUserName", "sameName"], [3, "closeModal", "isOpen", "std", "standards"], [3, "closeModal", "deleteLogEvent", "loadMoreHistoryEvent", "historyStd", "loadingHistory", "historyLogs", "isProcessing", "hasMoreHistory", "loadingMoreHistory"], [3, "closeModal", "confirm", "isOpen", "std", "userList", "isProcessing"], [3, "closeModal", "isOpen", "selectedStd"], ["title", "Xu\u1EA5t danh s\u00E1ch ch\u1EA5t chu\u1EA9n", "iconClass", "fa-solid fa-file-excel", "submitButtonText", "Xu\u1EA5t t\u1EC7p", 3, "close", "execute", "subtitle", "footerText", "isExporting", "isCompleted", "isSubmitDisabled"], [1, "px-5", "pb-5", "space-y-3", "mt-4"], [1, "bg-amber-50", "dark:bg-amber-900/20", "border", "border-amber-200", "dark:border-amber-800", "rounded-2xl", "p-3", "space-y-2"], [1, "border", "rounded-2xl", "overflow-hidden", "transition-all"], [1, "w-full", "flex", "items-center", "gap-3.5", "p-4", "cursor-pointer", "hover:bg-slate-50/50", "dark:hover:bg-slate-700/20", "transition", "text-left", 3, "click", "disabled"], [1, "w-9", "h-9", "rounded-xl", "flex", "items-center", "justify-center", "text-sm", "shrink-0", "shadow-sm"], [1, "fa-solid", "fa-table"], [1, "flex-1"], [1, "text-sm", "font-black", "dark:text-slate-200"], [1, "text-[11px]", "text-slate-500"], [1, "fa-solid", "fa-calendar-xmark"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "px-1", "flex", "items-start", "gap-1.5"], [1, "fa-solid", "fa-circle-info", "mt-0.5", "shrink-0"], [1, "text-indigo-500", "font-bold"], [1, "text-amber-500", "font-bold"], [1, "text-gray-400", "font-bold"], [1, "text-red-400", "font-bold"], [1, "text-[10px]", "font-black", "text-amber-700", "dark:text-amber-400", "uppercase", "tracking-wider"], [1, "fa-solid", "fa-triangle-exclamation", "mr-1"], [1, "flex", "gap-2"], [1, "flex-1", "py-2", "rounded-xl", "text-[11px]", "font-black", "transition", "border", 3, "click"], [1, "fa-solid", "fa-check-square", "mr-1"], [1, "fa-solid", "fa-filter", "mr-1"]], template: function StandardsComponent_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "div", 1)(1, "app-standards-toolbar", 2);
            i0.ɵɵlistener("deleteSelected", function StandardsComponent_Template_app_standards_toolbar_deleteSelected_1_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.deleteSelected()); })("printSelected", function StandardsComponent_Template_app_standards_toolbar_printSelected_1_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.openBatchPrintModal()); })("openAddModal", function StandardsComponent_Template_app_standards_toolbar_openAddModal_1_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.openAddModal()); })("importStandardsFile", function StandardsComponent_Template_app_standards_toolbar_importStandardsFile_1_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.handleFileSelect($event)); })("importUsageLogFile", function StandardsComponent_Template_app_standards_toolbar_importUsageLogFile_1_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.handleUsageLogFileSelect($event)); })("bulkCoaSelect", function StandardsComponent_Template_app_standards_toolbar_bulkCoaSelect_1_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.handleBulkCoaSelect($event)); })("openBulkTagModal", function StandardsComponent_Template_app_standards_toolbar_openBulkTagModal_1_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.showBulkTagModal.set(true)); })("openTagManager", function StandardsComponent_Template_app_standards_toolbar_openTagManager_1_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.showTagManagerModal.set(true)); })("openExportModal", function StandardsComponent_Template_app_standards_toolbar_openExportModal_1_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.openExportModal()); })("openCleanupModal", function StandardsComponent_Template_app_standards_toolbar_openCleanupModal_1_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.showDataCleanupModal.set(true)); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(2, "div", 3)(3, "app-standards-filter", 4);
            i0.ɵɵlistener("searchTermChange", function StandardsComponent_Template_app_standards_filter_searchTermChange_3_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onSearchInput($event)); })("activeWidgetFilterChange", function StandardsComponent_Template_app_standards_filter_activeWidgetFilterChange_3_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.activeWidgetFilter.set($event)); })("sortOptionChange", function StandardsComponent_Template_app_standards_filter_sortOptionChange_3_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onSortChange($event)); })("viewModeChange", function StandardsComponent_Template_app_standards_filter_viewModeChange_3_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.viewMode.set($event)); })("methodTagFilterChange", function StandardsComponent_Template_app_standards_filter_methodTagFilterChange_3_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.activeMethodTagFilter.set($event)); })("deviceFilterChange", function StandardsComponent_Template_app_standards_filter_deviceFilterChange_3_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.activeDeviceFilter.set($event)); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "div", 5);
            i0.ɵɵtemplate(5, StandardsComponent_Conditional_5_Template, 1, 9, "app-standards-list-view", 6)(6, StandardsComponent_Conditional_6_Template, 1, 9, "app-standards-grid-view", 6);
            i0.ɵɵelementStart(7, "input", 7, 0);
            i0.ɵɵlistener("change", function StandardsComponent_Template_input_change_7_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.handleQuickDriveUpload($event)); });
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(9, StandardsComponent_Conditional_9_Template, 3, 0, "div", 8);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(10, StandardsComponent_Conditional_10_Template, 3, 0)(11, StandardsComponent_Conditional_11_Template, 3, 0)(12, StandardsComponent_Conditional_12_Template, 3, 0)(13, StandardsComponent_Conditional_13_Template, 3, 0)(14, StandardsComponent_Conditional_14_Template, 1, 4, "app-standards-bulk-tag-modal", 9)(15, StandardsComponent_Conditional_15_Template, 1, 1, "app-standards-tag-manager-modal", 10)(16, StandardsComponent_Conditional_16_Template, 3, 0)(17, StandardsComponent_Conditional_17_Template, 3, 0)(18, StandardsComponent_Conditional_18_Template, 3, 0)(19, StandardsComponent_Conditional_19_Template, 3, 0)(20, StandardsComponent_Conditional_20_Template, 3, 0)(21, StandardsComponent_Conditional_21_Template, 3, 0)(22, StandardsComponent_Conditional_22_Template, 3, 0);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("selectedCount", ctx.selectedIds().size)("isProcessing", ctx.isProcessing() || ctx.isParsingImport())("canEditStandards", ctx.auth.canEditStandards());
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("searchTerm", ctx.searchTerm())("activeWidgetFilter", ctx.activeWidgetFilter())("sortOption", ctx.sortOption())("viewMode", ctx.viewMode())("stats", ctx.groupFilteredStats())("visibleCount", ctx.visibleItems().length)("filteredCount", ctx.filteredItems().length)("isLoading", ctx.isLoading())("tagOptions", ctx.tagCatalog.selectableOptions())("methodTagFilter", ctx.activeMethodTagFilter())("deviceOptions", ctx.tagCatalog.deviceOptions)("deviceFilter", ctx.activeDeviceFilter())("stockSummary", ctx.filteredStockSummary());
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.viewMode() === "list" ? 5 : 6);
            i0.ɵɵadvance(4);
            i0.ɵɵconditional(ctx.hasMore() && !ctx.isLoading() ? 9 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showModal() ? 10 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.importPreviewData().length > 0 ? 11 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.importUsageLogPreviewData().length > 0 ? 12 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showBulkCoaModal() ? 13 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showBulkTagModal() ? 14 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showTagManagerModal() ? 15 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showDataCleanupModal() ? 16 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showAssignModal() ? 17 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showPrintModal() ? 18 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.historyStd() ? 19 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showBackfillModal() ? 20 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showPurchaseRequestModal() ? 21 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showExportModal() ? 22 : -1);
        } }, dependencies: [CommonModule, FormsModule, StandardsToolbarComponent, StandardsFilterComponent, StandardsListViewComponent, StandardsGridViewComponent, StandardsBulkTagModalComponent, StandardsTagManagerModalComponent], encapsulation: 2, changeDetection: 0 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadataAsync(StandardsComponent, () => [import("./components/standards-form-modal.component").then(m => m.StandardsFormModalComponent), import("./components/standards-import-data-modal.component").then(m => m.StandardsImportDataModalComponent), import("./components/standards-import-modal.component").then(m => m.StandardsImportUsageModalComponent), import("./components/standards-bulk-coa-modal.component").then(m => m.StandardsBulkCoaModalComponent), import("./components/standards-data-cleanup-modal.component").then(m => m.StandardsDataCleanupModalComponent), import("./components/standards-assign-modal.component").then(m => m.StandardsAssignModalComponent), import("./components/standards-print-modal.component").then(m => m.StandardsPrintModalComponent), import("./components/standards-history-modal.component").then(m => m.StandardsHistoryModalComponent), import("./components/standards-purchase-modal.component").then(m => m.StandardsPurchaseModalComponent), import("../../shared/components/export-modal/export-modal.component").then(m => m.ExportModalComponent)], (StandardsFormModalComponent, StandardsImportDataModalComponent, StandardsImportUsageModalComponent, StandardsBulkCoaModalComponent, StandardsDataCleanupModalComponent, StandardsAssignModalComponent, StandardsPrintModalComponent, StandardsHistoryModalComponent, StandardsPurchaseModalComponent, ExportModalComponent) => { i0.ɵsetClassMetadata(StandardsComponent, [{
        type: Component,
        args: [{ selector: 'app-standards', standalone: true, imports: [CommonModule, FormsModule, StandardsFormModalComponent, StandardsPrintModalComponent, StandardsImportDataModalComponent, StandardsImportUsageModalComponent, StandardsHistoryModalComponent, StandardsPurchaseModalComponent, StandardsBulkCoaModalComponent, StandardsToolbarComponent, StandardsFilterComponent, StandardsListViewComponent, StandardsGridViewComponent, StandardsAssignModalComponent, StandardsDataCleanupModalComponent, StandardsBackfillModalComponent, StandardsBulkTagModalComponent, StandardsTagManagerModalComponent, ExportModalComponent], providers: [DatePipe], changeDetection: ChangeDetectionStrategy.OnPush, template: "    <div class=\"flex flex-col space-y-2 md:space-y-3 fade-in h-full relative\">\r\n\r\n      <!-- Header -->\r\n      <app-standards-toolbar\r\n          [selectedCount]=\"selectedIds().size\"\r\n          [isProcessing]=\"isProcessing() || isParsingImport()\"\r\n          [canEditStandards]=\"auth.canEditStandards()\"\r\n          (deleteSelected)=\"deleteSelected()\"\r\n          (printSelected)=\"openBatchPrintModal()\"\r\n          (openAddModal)=\"openAddModal()\"\r\n          (importStandardsFile)=\"handleFileSelect($event)\"\r\n          (importUsageLogFile)=\"handleUsageLogFileSelect($event)\"\r\n          (bulkCoaSelect)=\"handleBulkCoaSelect($event)\"\r\n          (openBulkTagModal)=\"showBulkTagModal.set(true)\"\r\n          (openTagManager)=\"showTagManagerModal.set(true)\"\r\n          (openExportModal)=\"openExportModal()\"\r\n          (openCleanupModal)=\"showDataCleanupModal.set(true)\">\r\n      </app-standards-toolbar>\r\n\r\n      <!-- Main Content -->\r\n      <div class=\"flex-1 min-h-0 overflow-hidden bg-white dark:bg-slate-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col relative\">\r\n          \r\n          <app-standards-filter\r\n              [searchTerm]=\"searchTerm()\"\r\n              [activeWidgetFilter]=\"activeWidgetFilter()\"\r\n              [sortOption]=\"sortOption()\"\r\n              [viewMode]=\"viewMode()\"\r\n              [stats]=\"groupFilteredStats()\"\r\n              [visibleCount]=\"visibleItems().length\"\r\n              [filteredCount]=\"filteredItems().length\"\r\n              [isLoading]=\"isLoading()\"\r\n              [tagOptions]=\"tagCatalog.selectableOptions()\"\r\n              [methodTagFilter]=\"activeMethodTagFilter()\"\r\n              [deviceOptions]=\"tagCatalog.deviceOptions\"\r\n              [deviceFilter]=\"activeDeviceFilter()\"\r\n              [stockSummary]=\"filteredStockSummary()\"\r\n              (searchTermChange)=\"onSearchInput($event)\"\r\n              (activeWidgetFilterChange)=\"activeWidgetFilter.set($event)\"\r\n              (sortOptionChange)=\"onSortChange($event)\"\r\n              (viewModeChange)=\"viewMode.set($event)\"\r\n              (methodTagFilterChange)=\"activeMethodTagFilter.set($event)\"\r\n              (deviceFilterChange)=\"activeDeviceFilter.set($event)\">\r\n          </app-standards-filter>\r\n\r\n          <!-- Content Body -->\r\n          <div class=\"flex-1 min-h-0 overflow-auto custom-scrollbar relative bg-slate-50/30 dark:bg-slate-900/50\">\r\n             \r\n             @if (viewMode() === 'list') {\r\n                 <app-standards-list-view\r\n                    [items]=\"visibleItems()\"\r\n                    [isLoading]=\"isLoading()\"\r\n                    [allStandardsLength]=\"allStandards().length\"\r\n                    [selectedIds]=\"selectedIds()\"\r\n                    [quickUploadStdId]=\"quickUploadStdId()\"\r\n                    [canEditStandards]=\"auth.canEditStandards()\"\r\n                     [canAssignStandards]=\"auth.canAssignStandards()\"\r\n                    [canRequestStandards]=\"auth.hasPermission('standard_request')\"\r\n                    [currentUser]=\"auth.currentUser()\"\r\n                    (toggleSelection)=\"toggleSelection($event)\"\r\n                    (toggleAll)=\"toggleAll()\"\r\n                    (navigateToDetail)=\"navigateToDetail($event)\"\r\n                    (copyText)=\"copyText($event.text, $event.event)\"\r\n                    (openCoaPreview)=\"openCoaPreview($event.url, $event.event)\"\r\n                    (triggerQuickDriveUpload)=\"triggerQuickDriveUpload($event.std, $event.event)\"\r\n                    (openAssignModal)=\"openAssignModal($event.std, $event.isAssign)\"\r\n                    (goToReturn)=\"goToReturn($event)\"\r\n                    (openPurchaseRequestModal)=\"openPurchaseRequestModal($event)\"\r\n                    (openPrintModal)=\"openPrintModal($event)\"\r\n                    (viewHistory)=\"viewHistory($event)\"\r\n                    (openEditModal)=\"openEditModal($event)\"\r\n                    (openBackfillModal)=\"openBackfillModal($event)\">\r\n                 </app-standards-list-view>\r\n             } @else {\r\n                 <app-standards-grid-view\r\n                    [items]=\"visibleItems()\"\r\n                    [isLoading]=\"isLoading()\"\r\n                    [allStandardsLength]=\"allStandards().length\"\r\n                    [selectedIds]=\"selectedIds()\"\r\n                    [quickUploadStdId]=\"quickUploadStdId()\"\r\n                    [canEditStandards]=\"auth.canEditStandards()\"\r\n                     [canAssignStandards]=\"auth.canAssignStandards()\"\r\n                    [canRequestStandards]=\"auth.hasPermission('standard_request')\"\r\n                    [currentUser]=\"auth.currentUser()\"\r\n                    (toggleSelection)=\"toggleSelection($event)\"\r\n                    (navigateToDetail)=\"navigateToDetail($event)\"\r\n                    (copyText)=\"copyText($event.text, $event.event)\"\r\n                    (openCoaPreview)=\"openCoaPreview($event.url, $event.event)\"\r\n                    (triggerQuickDriveUpload)=\"triggerQuickDriveUpload($event.std, $event.event)\"\r\n                    (openAssignModal)=\"openAssignModal($event.std, $event.isAssign)\"\r\n                    (goToReturn)=\"goToReturn($event)\"\r\n                    (openPurchaseRequestModal)=\"openPurchaseRequestModal($event)\"\r\n                    (openPrintModal)=\"openPrintModal($event)\"\r\n                    (viewHistory)=\"viewHistory($event)\">\r\n                 </app-standards-grid-view>\r\n             }\r\n             \r\n             <!-- Hidden input for quick Drive upload from list/grid -->\r\n             <input id=\"quickDriveInput\" #quickDriveInput type=\"file\" class=\"hidden\" accept=\".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx\" (change)=\"handleQuickDriveUpload($event)\">\r\n\r\n             @if (hasMore() && !isLoading()) {\r\n                <div class=\"text-center p-4\">\r\n                    <button (click)=\"loadMore()\" class=\"text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition active:scale-95 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-4 py-2 rounded-full shadow-sm dark:shadow-none\">\r\n                        Xem Th\u00EAm...\r\n                    </button>\r\n                </div>\r\n             }\r\n          </div>\r\n      </div>\r\n\r\n      <!-- ADD/EDIT MODAL -->\r\n      @if (showModal()) {\r\n        @defer {\r\n          <app-standards-form-modal [isOpen]=\"showModal()\" [std]=\"isEditing() ? selectedStd() : null\" [allStandards]=\"allStandards()\" (closeModal)=\"closeModal()\"></app-standards-form-modal>\r\n        }\r\n      }\r\n\r\n      <!-- IMPORT PREVIEW MODAL -->\r\n      @if (importPreviewData().length > 0) {\r\n        @defer {\r\n          <app-standards-import-data-modal\r\n              [data]=\"importPreviewData()\"\r\n              [isImporting]=\"isImporting()\"\r\n              [isParsing]=\"isParsingImport()\"\r\n              [sheetNames]=\"importSheetNames()\"\r\n              [selectedSheet]=\"selectedImportSheet()\"\r\n              (sheetChange)=\"changeImportSheet($event)\"\r\n              (cancel)=\"cancelImport()\"\r\n              (confirm)=\"confirmImport()\">\r\n          </app-standards-import-data-modal>\r\n        }\r\n      }\r\n\r\n      <!-- IMPORT USAGE LOG PREVIEW MODAL -->\r\n      @if (importUsageLogPreviewData().length > 0) {\r\n        @defer {\r\n          <app-standards-import-usage-modal [data]=\"importUsageLogPreviewData()\" [validCount]=\"validUsageLogsCount()\" [duplicateCount]=\"duplicateUsageLogsCount()\" [errorCount]=\"errorUsageLogsCount()\" [isImporting]=\"isImporting()\" (cancel)=\"cancelImport()\" (confirm)=\"confirmUsageLogImport()\"></app-standards-import-usage-modal>\r\n        }\r\n      }\r\n\r\n      <!-- BULK COA MODAL -->\r\n      @if (showBulkCoaModal()) {\r\n        @defer {\r\n          <app-standards-bulk-coa-modal [isOpen]=\"showBulkCoaModal()\" [items]=\"bulkCoaItems()\" [allStandards]=\"allStandards()\" [isUploading]=\"isBulkUploading()\" [uploadComplete]=\"bulkUploadComplete()\" (cancel)=\"cancelBulkCoa()\" (confirm)=\"confirmBulkCoaUpload()\"></app-standards-bulk-coa-modal>\r\n        }\r\n      }\r\n\r\n      @if (showBulkTagModal()) {\r\n        <app-standards-bulk-tag-modal\r\n          [isOpen]=\"showBulkTagModal()\"\r\n          [selectedCount]=\"selectedIds().size\"\r\n          [tagOptions]=\"tagCatalog.selectableOptions()\"\r\n          [isProcessing]=\"isProcessing()\"\r\n          (cancel)=\"showBulkTagModal.set(false)\"\r\n          (confirm)=\"confirmBulkTagUpdate($event)\">\r\n        </app-standards-bulk-tag-modal>\r\n      }\r\n\r\n      @if (showTagManagerModal()) {\r\n        <app-standards-tag-manager-modal\r\n          [isOpen]=\"showTagManagerModal()\"\r\n          (close)=\"showTagManagerModal.set(false)\">\r\n        </app-standards-tag-manager-modal>\r\n      }\r\n\r\n      <!-- DATA CLEANUP MODAL -->\r\n      @if (showDataCleanupModal()) {\r\n        @defer {\r\n          <app-standards-data-cleanup-modal [isOpen]=\"showDataCleanupModal()\" [allStandards]=\"allStandards()\" (closeModal)=\"showDataCleanupModal.set(false)\"></app-standards-data-cleanup-modal>\r\n        }\r\n      }\r\n\r\n      @if (showAssignModal()) {\r\n        @defer {\r\n          <app-standards-assign-modal\r\n              [isOpen]=\"showAssignModal()\"\r\n              [std]=\"selectedStd()\"\r\n              [isAssignMode]=\"isAssignMode()\"\r\n              [userList]=\"userList()\"\r\n              [isProcessing]=\"isProcessing()\"\r\n              [currentUserUid]=\"auth.currentUser()?.uid || ''\"\r\n              [currentUserName]=\"auth.currentUser()?.displayName || ''\"\r\n              [sameName]=\"sameNameAsSelected()\"\r\n              (closeModal)=\"showAssignModal.set(false)\"\r\n              (confirm)=\"confirmAssign($event)\">\r\n          </app-standards-assign-modal>\r\n        }\r\n      }\r\n\r\n      <!-- PRINT MODAL -->\r\n      @if (showPrintModal()) {\r\n        @defer {\r\n          <app-standards-print-modal [isOpen]=\"showPrintModal()\" [std]=\"selectedStd()\" [standards]=\"selectedStandardsToPrint()\" (closeModal)=\"showPrintModal.set(false)\"></app-standards-print-modal>\r\n        }\r\n      }\r\n\r\n      <!-- HISTORY MODAL -->\r\n      @if (historyStd()) {\r\n        @defer {\r\n          <app-standards-history-modal\r\n            [historyStd]=\"historyStd()\"\r\n            [loadingHistory]=\"loadingHistory()\"\r\n            [historyLogs]=\"historyLogs()\"\r\n            [isProcessing]=\"isProcessing()\"\r\n            [hasMoreHistory]=\"hasMoreHistory()\"\r\n            [loadingMoreHistory]=\"loadingMoreHistory()\"\r\n            (closeModal)=\"historyStd.set(null)\"\r\n            (deleteLogEvent)=\"deleteLog($event)\"\r\n            (loadMoreHistoryEvent)=\"loadMoreHistory()\"></app-standards-history-modal>\r\n        }\r\n      }\r\n\r\n      <!-- BACKFILL USAGE LOG MODAL -->\r\n      @if (showBackfillModal()) {\r\n        @defer {\r\n          <app-standards-backfill-modal\r\n            [isOpen]=\"showBackfillModal()\"\r\n            [std]=\"selectedBackfillStd()\"\r\n            [userList]=\"userList()\"\r\n            [isProcessing]=\"isProcessing()\"\r\n            (closeModal)=\"showBackfillModal.set(false)\"\r\n            (confirm)=\"confirmBackfill($event)\">\r\n          </app-standards-backfill-modal>\r\n        }\r\n      }\r\n\r\n      <!-- PURCHASE REQUEST MODAL -->\r\n      @if (showPurchaseRequestModal()) {\r\n        @defer {\r\n          <app-standards-purchase-modal [isOpen]=\"showPurchaseRequestModal()\" [selectedStd]=\"selectedPurchaseStd()\" (closeModal)=\"closePurchaseRequestModal()\"></app-standards-purchase-modal>\r\n        }\r\n      }\r\n\r\n      <!-- EXPORT EXCEL MODAL -->\r\n      @if (showExportModal()) {\r\n        @defer {\r\n          <app-export-modal\r\n            title=\"Xu\u1EA5t danh s\u00E1ch ch\u1EA5t chu\u1EA9n\"\r\n            iconClass=\"fa-solid fa-file-excel\"\r\n            submitButtonText=\"Xu\u1EA5t t\u1EC7p\"\r\n            [subtitle]=\"exportSubtitle()\"\r\n            [footerText]=\"exportItems().length + ' chu\u1EA9n s\u1EBD \u0111\u01B0\u1EE3c xu\u1EA5t' + (exportGroupCount() > 0 ? ' - ' + exportGroupCount() + ' nh\u00F3m c\u00F3 chu\u1EA9n thay th\u1EBF' : '') + ' - 2 sheet: ' + (exportType() === 'expiry' ? 'B\u00E1o c\u00E1o' : 'Chi ti\u1EBFt') + ' + T\u1ED5ng h\u1EE3p'\"\r\n            [isExporting]=\"isExporting()\"\r\n            [isCompleted]=\"exportCompleted()\"\r\n            [isSubmitDisabled]=\"exportItems().length === 0\"\r\n            (close)=\"showExportModal.set(false)\"\r\n            (execute)=\"runExport()\">\r\n\r\n          <div class=\"px-5 pb-5 space-y-3 mt-4\">\r\n\r\n            <!-- Data source selector -->\r\n            @if (selectedIds().size > 0) {\r\n              <div class=\"bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-3 space-y-2\">\r\n                <div class=\"text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider\">\r\n                  <i class=\"fa-solid fa-triangle-exclamation mr-1\"></i>\r\n                  B\u1EA1n \u0111ang c\u00F3 {{ selectedIds().size }} chu\u1EA9n \u0111\u01B0\u1EE3c tick. Xu\u1EA5t t\u1EEB \u0111\u00E2u?\r\n                </div>\r\n                <div class=\"flex gap-2\">\r\n                  <button (click)=\"exportDataSource.set('selected'); exportCompleted.set(false)\"\r\n                    class=\"flex-1 py-2 rounded-xl text-[11px] font-black transition border\"\r\n                    [class]=\"exportDataSource() === 'selected'\r\n                      ? 'bg-amber-500 text-white border-amber-500'\r\n                      : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-amber-300'\">\r\n                    <i class=\"fa-solid fa-check-square mr-1\"></i> {{ selectedIds().size }} chu\u1EA9n \u0111\u00E3 ch\u1ECDn\r\n                  </button>\r\n                  <button (click)=\"exportDataSource.set('filtered'); exportCompleted.set(false)\"\r\n                    class=\"flex-1 py-2 rounded-xl text-[11px] font-black transition border\"\r\n                    [class]=\"exportDataSource() === 'filtered'\r\n                      ? 'bg-indigo-500 text-white border-indigo-500'\r\n                      : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-indigo-300'\">\r\n                    <i class=\"fa-solid fa-filter mr-1\"></i> {{ filteredItems().length }} k\u1EBFt qu\u1EA3 \u0111ang l\u1ECDc\r\n                  </button>\r\n                </div>\r\n              </div>\r\n            }\r\n\r\n            <!-- Ki\u1EC3u xu\u1EA5t 1: Danh s\u00E1ch \u0111\u1EA7y \u0111\u1EE7 -->\r\n            <div class=\"border rounded-2xl overflow-hidden transition-all\"\r\n              [class]=\"exportType() === 'full'\r\n                ? 'border-indigo-200 bg-indigo-50/30 dark:border-indigo-800 dark:bg-indigo-900/20'\r\n                : 'border-slate-100 dark:border-slate-700'\">\r\n              <button (click)=\"exportType.set('full'); exportCompleted.set(false)\" [disabled]=\"isExporting()\"\r\n                class=\"w-full flex items-center gap-3.5 p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition text-left\">\r\n                <div class=\"w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-sm\"\r\n                  [class]=\"exportType() === 'full' ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'\">\r\n                  <i class=\"fa-solid fa-table\"></i>\r\n                </div>\r\n                <div class=\"flex-1\">\r\n                  <div class=\"text-sm font-black dark:text-slate-200\" [class.text-indigo-700]=\"exportType() === 'full'\">1. Danh S\u00E1ch \u0110\u1EA7y \u0110\u1EE7</div>\r\n                  <div class=\"text-[11px] text-slate-500\">22 c\u1ED9t: m\u00E3, t\u00EAn, s\u1ED1 l\u00F4, t\u1ED3n kho, h\u1EA1n d\u00F9ng, CoA, h\u00E3ng s\u1EA3n xu\u1EA5t...</div>\r\n                </div>\r\n              </button>\r\n            </div>\r\n\r\n            <!-- Ki\u1EC3u xu\u1EA5t 2: B\u00E1o c\u00E1o h\u1EA1n d\u00F9ng -->\r\n            <div class=\"border rounded-2xl overflow-hidden transition-all\"\r\n              [class]=\"exportType() === 'expiry'\r\n                ? 'border-rose-200 bg-rose-50/30 dark:border-rose-800 dark:bg-rose-900/20'\r\n                : 'border-slate-100 dark:border-slate-700'\">\r\n              <button (click)=\"exportType.set('expiry'); exportCompleted.set(false)\" [disabled]=\"isExporting()\"\r\n                class=\"w-full flex items-center gap-3.5 p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition text-left\">\r\n                <div class=\"w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-sm\"\r\n                  [class]=\"exportType() === 'expiry' ? 'bg-rose-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'\">\r\n                  <i class=\"fa-solid fa-calendar-xmark\"></i>\r\n                </div>\r\n                <div class=\"flex-1\">\r\n                  <div class=\"text-sm font-black dark:text-slate-200\" [class.text-rose-700]=\"exportType() === 'expiry'\">2. B\u00E1o C\u00E1o H\u1EA1n D\u00F9ng</div>\r\n                  <div class=\"text-[11px] text-slate-500\">Ch\u1EC9 Chu\u1EA9n C\u00F3 H\u1EA1n D\u00F9ng - K\u00E8m C\u1ED9t \"C\u00F2n L\u1EA1i (Ng\u00E0y)\" v\u00E0 Tr\u1EA1ng Th\u00E1i H\u1EA1n</div>\r\n                </div>\r\n              </button>\r\n            </div>\r\n\r\n            <!-- Info note -->\r\n            <div class=\"text-[10px] text-slate-400 dark:text-slate-500 px-1 flex items-start gap-1.5\">\r\n              <i class=\"fa-solid fa-circle-info mt-0.5 shrink-0\"></i>\r\n              <span>File Excel g\u1ED3m <b>2 sheet</b>: {{ exportType() === 'expiry' ? 'B\u00E1o c\u00E1o h\u1EA1n d\u00F9ng' : 'Chi ti\u1EBFt' }} + T\u1ED5ng h\u1EE3p. H\u00E0ng ti\u00EAu \u0111\u1EC1 \u0111\u01B0\u1EE3c \u0111\u00F3ng b\u0103ng (freeze). M\u00E0u s\u1EAFc: <span class=\"text-indigo-500 font-bold\">C\u1ED0 \u0110\u1ECANH</span> - <span class=\"text-amber-500 font-bold\">Thay th\u1EBF</span> - <span class=\"text-gray-400 font-bold\">H\u1EBFt h\u00E0ng</span> - <span class=\"text-red-400 font-bold\">H\u1EBFt h\u1EA1n</span>.</span>\r\n            </div>\r\n\r\n          </div>\r\n          </app-export-modal>\r\n        }\r\n      }\r\n\r\n    </div>\r\n" }]
    }], () => [], null); }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StandardsComponent, { className: "StandardsComponent", filePath: "src/app/features/standards/standards.component.ts", lineNumber: 48 }); })();
//# sourceMappingURL=standards.component.js.map