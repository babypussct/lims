import { ChangeDetectionStrategy, Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { StateService } from '../../../core/services/state.service';
import { StandardService } from '../standard.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { AuthService } from '../../../core/services/auth.service';
import { StandardRequestService } from '../services/standard-request.service';
import { isFefoCandidate } from '../../../shared/utils/standard-fefo';
import { RequestsKanbanComponent } from './components/requests-kanban.component';
import { LockPermissionDirective } from '../../../shared/directives/lock-permission.directive';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
const StandardRequestsComponent_Conditional_59_Defer_1_DepsFn = () => [import("./components/requests-table.component").then(m => m.RequestsTableComponent)];
const StandardRequestsComponent_Conditional_60_Defer_1_DepsFn = () => [import("./components/requests-action-modals.component").then(m => m.RequestsActionModalsComponent)];
const StandardRequestsComponent_Conditional_61_Defer_1_DepsFn = () => [import("./components/create-request-drawer.component").then(m => m.CreateRequestDrawerComponent)];
const StandardRequestsComponent_Conditional_62_Defer_1_DepsFn = () => [import("../components/standards-purchase-modal.component").then(m => m.StandardsPurchaseModalComponent)];
const StandardRequestsComponent_Conditional_64_Defer_1_DepsFn = () => [i2.DefaultValueAccessor, i2.NgControlStatus, i2.NgModel, import("../../../shared/components/export-modal/export-modal.component").then(m => m.ExportModalComponent)];
const _forTrack0 = ($index, $item) => $item.id;
function StandardRequestsComponent_Conditional_14_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 40);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.pendingPurchaseRequestsCount());
} }
function StandardRequestsComponent_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 38);
    i0.ɵɵlistener("click", function StandardRequestsComponent_Conditional_14_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openAdminPurchaseRequests()); });
    i0.ɵɵelement(1, "i", 39);
    i0.ɵɵtext(2, " Y\u00EAu c\u1EA7u Mua s\u1EAFm ");
    i0.ɵɵtemplate(3, StandardRequestsComponent_Conditional_14_Conditional_3_Template, 2, 1, "div", 40);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵclassProp("animate-bounce", ctx_r1.pendingPurchaseRequestsCount() > 0);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.pendingPurchaseRequestsCount() > 0 ? 3 : -1);
} }
function StandardRequestsComponent_Conditional_48_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 41);
    i0.ɵɵlistener("click", function StandardRequestsComponent_Conditional_48_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.clearFilters()); });
    i0.ɵɵelement(1, "i", 42);
    i0.ɵɵtext(2, " X\u00F3a l\u1ECDc ");
    i0.ɵɵelementEnd();
} }
function StandardRequestsComponent_Conditional_58_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-requests-kanban", 43);
    i0.ɵɵlistener("navigateToStandard", function StandardRequestsComponent_Conditional_58_Template_app_requests_kanban_navigateToStandard_0_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.router.navigate(["/standards", $event])); })("actionApprove", function StandardRequestsComponent_Conditional_58_Template_app_requests_kanban_actionApprove_0_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.approveRequest($event)); })("actionReject", function StandardRequestsComponent_Conditional_58_Template_app_requests_kanban_actionReject_0_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openRejectModal($event)); })("actionLogUsage", function StandardRequestsComponent_Conditional_58_Template_app_requests_kanban_actionLogUsage_0_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openLogUsageModal($event)); })("actionReturn", function StandardRequestsComponent_Conditional_58_Template_app_requests_kanban_actionReturn_0_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openReturnModal($event.req, $event.isForce)); })("actionUndoReturn", function StandardRequestsComponent_Conditional_58_Template_app_requests_kanban_actionUndoReturn_0_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.undoReturn($event)); })("actionAdminReceive", function StandardRequestsComponent_Conditional_58_Template_app_requests_kanban_actionAdminReceive_0_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openAdminReceiveModal($event)); })("actionDelete", function StandardRequestsComponent_Conditional_58_Template_app_requests_kanban_actionDelete_0_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.hardDeleteHistory($event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("requests", ctx_r1.filteredRequests())("currentFilter", ctx_r1.statusFilter());
} }
function StandardRequestsComponent_Conditional_59_Defer_0_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-requests-table", 44);
    i0.ɵɵlistener("navigateToStandard", function StandardRequestsComponent_Conditional_59_Defer_0_Template_app_requests_table_navigateToStandard_0_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.router.navigate(["/standards", $event])); })("actionApprove", function StandardRequestsComponent_Conditional_59_Defer_0_Template_app_requests_table_actionApprove_0_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.approveRequest($event)); })("actionReject", function StandardRequestsComponent_Conditional_59_Defer_0_Template_app_requests_table_actionReject_0_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openRejectModal($event)); })("actionLogUsage", function StandardRequestsComponent_Conditional_59_Defer_0_Template_app_requests_table_actionLogUsage_0_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openLogUsageModal($event)); })("actionReturn", function StandardRequestsComponent_Conditional_59_Defer_0_Template_app_requests_table_actionReturn_0_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openReturnModal($event.req, $event.isForce)); })("actionUndoReturn", function StandardRequestsComponent_Conditional_59_Defer_0_Template_app_requests_table_actionUndoReturn_0_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.undoReturn($event)); })("actionAdminReceive", function StandardRequestsComponent_Conditional_59_Defer_0_Template_app_requests_table_actionAdminReceive_0_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openAdminReceiveModal($event)); })("actionDelete", function StandardRequestsComponent_Conditional_59_Defer_0_Template_app_requests_table_actionDelete_0_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.hardDeleteHistory($event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("requests", ctx_r1.filteredRequests())("isLoading", ctx_r1.isLoading());
} }
function StandardRequestsComponent_Conditional_59_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardRequestsComponent_Conditional_59_Defer_0_Template, 1, 2);
    i0.ɵɵdefer(1, 0, StandardRequestsComponent_Conditional_59_Defer_1_DepsFn);
    i0.ɵɵdeferOnIdle();
} }
function StandardRequestsComponent_Conditional_60_Defer_0_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-requests-action-modals", 45);
    i0.ɵɵlistener("close", function StandardRequestsComponent_Conditional_60_Defer_0_Template_app_requests_action_modals_close_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.closeActionModal()); })("approveAction", function StandardRequestsComponent_Conditional_60_Defer_0_Template_app_requests_action_modals_approveAction_0_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.confirmApprove($event)); })("rejectAction", function StandardRequestsComponent_Conditional_60_Defer_0_Template_app_requests_action_modals_rejectAction_0_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.confirmReject($event)); })("logUsageAction", function StandardRequestsComponent_Conditional_60_Defer_0_Template_app_requests_action_modals_logUsageAction_0_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.confirmLogUsage($event)); })("returnAction", function StandardRequestsComponent_Conditional_60_Defer_0_Template_app_requests_action_modals_returnAction_0_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.confirmReturn($event)); })("adminReceiveAction", function StandardRequestsComponent_Conditional_60_Defer_0_Template_app_requests_action_modals_adminReceiveAction_0_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.confirmAdminReceive($event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("activeModal", ctx_r1.activeModal())("request", ctx_r1.selectedRequest())("standard", ctx_r1.currentStandard())("isForceReturn", ctx_r1.isForceReturn())("isProcessing", ctx_r1.isProcessing());
} }
function StandardRequestsComponent_Conditional_60_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardRequestsComponent_Conditional_60_Defer_0_Template, 1, 5);
    i0.ɵɵdefer(1, 0, StandardRequestsComponent_Conditional_60_Defer_1_DepsFn);
    i0.ɵɵdeferOnIdle();
} }
function StandardRequestsComponent_Conditional_61_Defer_0_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-create-request-drawer", 46);
    i0.ɵɵlistener("close", function StandardRequestsComponent_Conditional_61_Defer_0_Template_app_create_request_drawer_close_0_listener() { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.closeModal()); })("submitRequest", function StandardRequestsComponent_Conditional_61_Defer_0_Template_app_create_request_drawer_submitRequest_0_listener($event) { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.submitRequest($event)); })("requestPurchase", function StandardRequestsComponent_Conditional_61_Defer_0_Template_app_create_request_drawer_requestPurchase_0_listener($event) { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openPurchaseModal($event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("isOpen", ctx_r1.showModal())("isProcessing", ctx_r1.isProcessing())("availableStandards", ctx_r1.availableStandards());
} }
function StandardRequestsComponent_Conditional_61_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardRequestsComponent_Conditional_61_Defer_0_Template, 1, 3);
    i0.ɵɵdefer(1, 0, StandardRequestsComponent_Conditional_61_Defer_1_DepsFn);
    i0.ɵɵdeferOnIdle();
} }
function StandardRequestsComponent_Conditional_62_Defer_0_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-standards-purchase-modal", 47);
    i0.ɵɵlistener("closeModal", function StandardRequestsComponent_Conditional_62_Defer_0_Template_app_standards_purchase_modal_closeModal_0_listener() { i0.ɵɵrestoreView(_r8); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.closePurchaseModal()); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("isOpen", ctx_r1.showPurchaseModal())("selectedStd", ctx_r1.selectedPurchaseStd());
} }
function StandardRequestsComponent_Conditional_62_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardRequestsComponent_Conditional_62_Defer_0_Template, 1, 2);
    i0.ɵɵdefer(1, 0, StandardRequestsComponent_Conditional_62_Defer_1_DepsFn);
    i0.ɵɵdeferOnIdle();
} }
function StandardRequestsComponent_Conditional_63_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 56);
    i0.ɵɵelement(1, "i", 57);
    i0.ɵɵelementEnd();
} }
function StandardRequestsComponent_Conditional_63_Conditional_12_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 58);
    i0.ɵɵtext(1, "Kh\u00F4ng c\u00F3 y\u00EAu c\u1EA7u mua s\u1EAFm n\u00E0o ch\u1EDD x\u1EED l\u00FD.");
    i0.ɵɵelementEnd();
} }
function StandardRequestsComponent_Conditional_63_Conditional_12_Conditional_1_For_16_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 71);
    i0.ɵɵelement(1, "i", 85);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const r_r10 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", r_r10.required_level, " ");
} }
function StandardRequestsComponent_Conditional_63_Conditional_12_Conditional_1_For_16_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 72);
    i0.ɵɵelement(1, "i", 86);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const r_r10 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" \u0110TK: ", r_r10.required_purity, " ");
} }
function StandardRequestsComponent_Conditional_63_Conditional_12_Conditional_1_For_16_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 73);
    i0.ɵɵelement(1, "i", 87);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const r_r10 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("title", r_r10.notes);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", r_r10.notes, " ");
} }
function StandardRequestsComponent_Conditional_63_Conditional_12_Conditional_1_For_16_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 75)(1, "span", 88);
    i0.ɵɵtext(2, "H\u00E3ng CC:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 89);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const r_r10 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(r_r10.preferred_manufacturer);
} }
function StandardRequestsComponent_Conditional_63_Conditional_12_Conditional_1_For_16_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 75)(1, "span", 88);
    i0.ɵɵtext(2, "L\u01B0\u1EE3ng c\u1EA7n:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 90);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const r_r10 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(r_r10.expectedAmount);
} }
function StandardRequestsComponent_Conditional_63_Conditional_12_Conditional_1_For_16_Conditional_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 82)(1, "span", 91);
    i0.ɵɵelement(2, "i", 92);
    i0.ɵɵtext(3, " G\u1EA4P");
    i0.ɵɵelementEnd()();
} }
function StandardRequestsComponent_Conditional_63_Conditional_12_Conditional_1_For_16_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 84)(1, "button", 93);
    i0.ɵɵlistener("click", function StandardRequestsComponent_Conditional_63_Conditional_12_Conditional_1_For_16_Conditional_28_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r11); const r_r10 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.markPurchaseRequestOrdered(r_r10)); });
    i0.ɵɵelement(2, "i", 94);
    i0.ɵɵtext(3, " \u0110\u00E3 \u0110\u1EB7t H\u00E0ng ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "button", 95);
    i0.ɵɵlistener("click", function StandardRequestsComponent_Conditional_63_Conditional_12_Conditional_1_For_16_Conditional_28_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r11); const r_r10 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.rejectPurchaseRequest(r_r10)); });
    i0.ɵɵelement(5, "i", 96);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(5);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.isProcessing());
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("disabled", ctx_r1.isProcessing());
} }
function StandardRequestsComponent_Conditional_63_Conditional_12_Conditional_1_For_16_Conditional_29_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 97);
    i0.ɵɵelement(1, "i", 98);
    i0.ɵɵtext(2, " \u0110ang ch\u1EDD nh\u1EADn h\u00E0ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "button", 99);
    i0.ɵɵlistener("click", function StandardRequestsComponent_Conditional_63_Conditional_12_Conditional_1_For_16_Conditional_29_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r12); const r_r10 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.markPurchaseRequestCompleted(r_r10)); });
    i0.ɵɵelement(4, "i", 100);
    i0.ɵɵtext(5, " \u0110\u00E3 Nh\u1EADn H\u00E0ng ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(5);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("disabled", ctx_r1.isProcessing());
} }
function StandardRequestsComponent_Conditional_63_Conditional_12_Conditional_1_For_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 65)(1, "td", 66)(2, "div", 67);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 68);
    i0.ɵɵelement(5, "i", 69);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "td", 66)(8, "div", 70);
    i0.ɵɵtemplate(9, StandardRequestsComponent_Conditional_63_Conditional_12_Conditional_1_For_16_Conditional_9_Template, 3, 1, "div", 71)(10, StandardRequestsComponent_Conditional_63_Conditional_12_Conditional_1_For_16_Conditional_10_Template, 3, 1, "div", 72)(11, StandardRequestsComponent_Conditional_63_Conditional_12_Conditional_1_For_16_Conditional_11_Template, 3, 2, "div", 73);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "td", 66)(13, "div", 74);
    i0.ɵɵtemplate(14, StandardRequestsComponent_Conditional_63_Conditional_12_Conditional_1_For_16_Conditional_14_Template, 5, 1, "div", 75)(15, StandardRequestsComponent_Conditional_63_Conditional_12_Conditional_1_For_16_Conditional_15_Template, 5, 1, "div", 75);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "td", 66)(17, "div", 76)(18, "div", 77)(19, "div", 78);
    i0.ɵɵelement(20, "i", 79);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(21);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "div", 80);
    i0.ɵɵelement(23, "i", 81);
    i0.ɵɵtext(24);
    i0.ɵɵpipe(25, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(26, StandardRequestsComponent_Conditional_63_Conditional_12_Conditional_1_For_16_Conditional_26_Template, 4, 0, "div", 82);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(27, "td", 83);
    i0.ɵɵtemplate(28, StandardRequestsComponent_Conditional_63_Conditional_12_Conditional_1_For_16_Conditional_28_Template, 6, 2, "div", 84)(29, StandardRequestsComponent_Conditional_63_Conditional_12_Conditional_1_For_16_Conditional_29_Template, 6, 1);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const r_r10 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("title", r_r10.standardName);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(r_r10.standardName);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", r_r10.product_code, "");
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(r_r10.required_level ? 9 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(r_r10.required_purity ? 10 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(r_r10.notes ? 11 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(r_r10.preferred_manufacturer ? 14 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(r_r10.expectedAmount ? 15 : -1);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate1(" ", r_r10.requestedByName, " ");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind2(25, 12, r_r10.requestDate, "dd/MM/yyyy HH:mm"), "");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(r_r10.priority === "HIGH" ? 26 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(r_r10.status === "PENDING" ? 28 : 29);
} }
function StandardRequestsComponent_Conditional_63_Conditional_12_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 59)(1, "table", 60)(2, "thead", 61)(3, "tr")(4, "th", 62);
    i0.ɵɵtext(5, "Ch\u1EA5t chu\u1EA9n \u0111\u1ED1i chi\u1EBFu");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "th", 62);
    i0.ɵɵtext(7, "Ph\u00E2n lo\u1EA1i & M\u1EE5c \u0111\u00EDch");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "th", 62);
    i0.ɵɵtext(9, "Y\u00EAu c\u1EA7u mua s\u1EAFm");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "th", 62);
    i0.ɵɵtext(11, "Ng\u01B0\u1EDDi \u0111\u1EC1 ngh\u1ECB");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "th", 63);
    i0.ɵɵtext(13, "T\u00E1c v\u1EE5");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(14, "tbody", 64);
    i0.ɵɵrepeaterCreate(15, StandardRequestsComponent_Conditional_63_Conditional_12_Conditional_1_For_16_Template, 30, 15, "tr", 65, _forTrack0);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(15);
    i0.ɵɵrepeater(ctx_r1.adminPurchaseRequests());
} }
function StandardRequestsComponent_Conditional_63_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardRequestsComponent_Conditional_63_Conditional_12_Conditional_0_Template, 2, 0, "div", 58)(1, StandardRequestsComponent_Conditional_63_Conditional_12_Conditional_1_Template, 17, 0, "div", 59);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵconditional(ctx_r1.adminPurchaseRequests().length === 0 ? 0 : 1);
} }
function StandardRequestsComponent_Conditional_63_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 37)(1, "div", 48)(2, "div", 49)(3, "h3", 50)(4, "div", 51);
    i0.ɵɵelement(5, "i", 39);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "span", 52);
    i0.ɵɵtext(7, "Duy\u1EC7t Y\u00EAu C\u1EA7u Mua B\u1ED5 Sung Ch\u1EA5t Chu\u1EA9n");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "button", 53);
    i0.ɵɵlistener("click", function StandardRequestsComponent_Conditional_63_Template_button_click_8_listener() { i0.ɵɵrestoreView(_r9); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeAdminPurchaseRequests()); });
    i0.ɵɵelement(9, "i", 54);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "div", 55);
    i0.ɵɵtemplate(11, StandardRequestsComponent_Conditional_63_Conditional_11_Template, 2, 0, "div", 56)(12, StandardRequestsComponent_Conditional_63_Conditional_12_Template, 2, 1);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(11);
    i0.ɵɵconditional(ctx_r1.loadingAdminRequests() ? 11 : 12);
} }
function StandardRequestsComponent_Conditional_64_Defer_0_Conditional_2_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 126);
    i0.ɵɵelement(1, "i", 127);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.getStatusLabel(ctx_r1.statusFilter()), " ");
} }
function StandardRequestsComponent_Conditional_64_Defer_0_Conditional_2_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 126);
    i0.ɵɵelement(1, "i", 128);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" \"", ctx_r1.searchTerm(), "\" ");
} }
function StandardRequestsComponent_Conditional_64_Defer_0_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 103)(1, "div", 123);
    i0.ɵɵelement(2, "i", 124);
    i0.ɵɵtext(3, " B\u1ED9 l\u1ECDc \u0111ang \u00E1p d\u1EE5ng ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 125);
    i0.ɵɵtemplate(5, StandardRequestsComponent_Conditional_64_Defer_0_Conditional_2_Conditional_5_Template, 3, 1, "span", 126)(6, StandardRequestsComponent_Conditional_64_Defer_0_Conditional_2_Conditional_6_Template, 3, 1, "span", 126);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(5);
    i0.ɵɵconditional(ctx_r1.statusFilter() !== "ALL" ? 5 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.searchTerm() ? 6 : -1);
} }
function StandardRequestsComponent_Conditional_64_Defer_0_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    const _r14 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 129);
    i0.ɵɵlistener("click", function StandardRequestsComponent_Conditional_64_Defer_0_Conditional_11_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r14); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.dateRangeFilter.set({ from: "", to: "" })); });
    i0.ɵɵelement(1, "i", 130);
    i0.ɵɵelementEnd();
} }
function StandardRequestsComponent_Conditional_64_Defer_0_Conditional_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 118);
    i0.ɵɵelement(1, "i", 131);
    i0.ɵɵelementEnd();
} }
function StandardRequestsComponent_Conditional_64_Defer_0_Conditional_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 120);
    i0.ɵɵelement(1, "i", 131);
    i0.ɵɵelementEnd();
} }
function StandardRequestsComponent_Conditional_64_Defer_0_Conditional_44_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 122);
    i0.ɵɵelement(1, "i", 131);
    i0.ɵɵelementEnd();
} }
function StandardRequestsComponent_Conditional_64_Defer_0_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-export-modal", 101);
    i0.ɵɵlistener("close", function StandardRequestsComponent_Conditional_64_Defer_0_Template_app_export_modal_close_0_listener() { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.closeExportModal()); })("execute", function StandardRequestsComponent_Conditional_64_Defer_0_Template_app_export_modal_execute_0_listener() { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.runExport()); });
    i0.ɵɵelementStart(1, "div", 102);
    i0.ɵɵtemplate(2, StandardRequestsComponent_Conditional_64_Defer_0_Conditional_2_Template, 7, 2, "div", 103);
    i0.ɵɵelementStart(3, "div", 104)(4, "div", 105);
    i0.ɵɵelement(5, "i", 106);
    i0.ɵɵtext(6, " L\u1ECDc theo kho\u1EA3ng ng\u00E0y y\u00EAu c\u1EA7u (tu\u1EF3 ch\u1ECDn) ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div", 2)(8, "input", 107);
    i0.ɵɵlistener("ngModelChange", function StandardRequestsComponent_Conditional_64_Defer_0_Template_input_ngModelChange_8_listener($event) { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.dateRangeFilter.set({ from: $event, to: ctx_r1.dateRangeFilter().to })); });
    i0.ɵɵelementEnd();
    i0.ɵɵelement(9, "i", 108);
    i0.ɵɵelementStart(10, "input", 107);
    i0.ɵɵlistener("ngModelChange", function StandardRequestsComponent_Conditional_64_Defer_0_Template_input_ngModelChange_10_listener($event) { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.dateRangeFilter.set({ from: ctx_r1.dateRangeFilter().from, to: $event })); });
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(11, StandardRequestsComponent_Conditional_64_Defer_0_Conditional_11_Template, 2, 0, "button", 109);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "div", 110);
    i0.ɵɵelement(13, "i", 111);
    i0.ɵɵtext(14, " Ch\u1ECDn lo\u1EA1i b\u00E1o c\u00E1o ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "div", 112)(16, "button", 113);
    i0.ɵɵlistener("click", function StandardRequestsComponent_Conditional_64_Defer_0_Template_button_click_16_listener() { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(2); !ctx_r1.isExporting() && ctx_r1.exportType.set("raw"); return i0.ɵɵresetView(ctx_r1.exportCompleted.set(false)); });
    i0.ɵɵelementStart(17, "div", 114);
    i0.ɵɵelement(18, "i", 32);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "div", 115)(20, "div", 116);
    i0.ɵɵtext(21, "1. Chi Ti\u1EBFt T\u1EEBng Y\u00EAu C\u1EA7u");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "div", 117);
    i0.ɵɵtext(23, "To\u00E0n b\u1ED9 th\u00F4ng tin: chu\u1EA9n, ng\u01B0\u1EDDi m\u01B0\u1EE3n, tr\u1EA1ng th\u00E1i, duy\u1EC7t, tr\u1EA3, l\u01B0\u1EE3ng d\u00F9ng...");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(24, StandardRequestsComponent_Conditional_64_Defer_0_Conditional_24_Template, 2, 0, "div", 118);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(25, "div", 112)(26, "button", 113);
    i0.ɵɵlistener("click", function StandardRequestsComponent_Conditional_64_Defer_0_Template_button_click_26_listener() { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(2); !ctx_r1.isExporting() && ctx_r1.exportType.set("standard"); return i0.ɵɵresetView(ctx_r1.exportCompleted.set(false)); });
    i0.ɵɵelementStart(27, "div", 114);
    i0.ɵɵelement(28, "i", 119);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "div", 115)(30, "div", 116);
    i0.ɵɵtext(31, "2. T\u1ED5ng H\u1EE3p theo Ch\u1EA5t Chu\u1EA9n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "div", 117);
    i0.ɵɵtext(33, "Th\u1ED1ng K\u00EA T\u1ED5ng L\u01B0\u1EE3ng D\u00F9ng, S\u1ED1 L\u01B0\u1EE3t Y\u00EAu C\u1EA7u & Tr\u1EA1ng Th\u00E1i cho T\u1EEBng Chu\u1EA9n");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(34, StandardRequestsComponent_Conditional_64_Defer_0_Conditional_34_Template, 2, 0, "div", 120);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(35, "div", 112)(36, "button", 113);
    i0.ɵɵlistener("click", function StandardRequestsComponent_Conditional_64_Defer_0_Template_button_click_36_listener() { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(2); !ctx_r1.isExporting() && ctx_r1.exportType.set("user"); return i0.ɵɵresetView(ctx_r1.exportCompleted.set(false)); });
    i0.ɵɵelementStart(37, "div", 114);
    i0.ɵɵelement(38, "i", 121);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(39, "div", 115)(40, "div", 116);
    i0.ɵɵtext(41, "3. T\u1ED5ng H\u1EE3p theo Nh\u00E2n Vi\u00EAn");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(42, "div", 117);
    i0.ɵɵtext(43, "T\u1EA7n Su\u1EA5t M\u01B0\u1EE3n, S\u1ED1 Chu\u1EA9n S\u1EED D\u1EE5ng & T\u1ED5ng L\u01B0\u1EE3ng D\u00F9ng c\u1EE7a T\u1EEBng Nh\u00E2n Vi\u00EAn");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(44, StandardRequestsComponent_Conditional_64_Defer_0_Conditional_44_Template, 2, 0, "div", 122);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("subtitle", ctx_r1.statusFilter() !== "ALL" ? ctx_r1.getStatusLabel(ctx_r1.statusFilter()) : "")("dateRangeText", ctx_r1.getExportDateRangeText())("footerText", ctx_r1.getExportableRequests().length + " b\u1EA3n ghi s\u1EBD \u0111\u01B0\u1EE3c xu\u1EA5t")("isExporting", ctx_r1.isExporting())("isCompleted", ctx_r1.exportCompleted());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.statusFilter() !== "ALL" || ctx_r1.searchTerm() ? 2 : -1);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngModel", ctx_r1.dateRangeFilter().from);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngModel", ctx_r1.dateRangeFilter().to);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.dateRangeFilter().from || ctx_r1.dateRangeFilter().to ? 11 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵclassMap(ctx_r1.exportType() === "raw" ? "border-indigo-200 bg-indigo-50/30 dark:border-indigo-800 dark:bg-indigo-900/20 ring-1 ring-indigo-300/50 dark:ring-indigo-700/30" : "border-slate-100 dark:border-slate-700");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.isExporting());
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.exportType() === "raw" ? "bg-indigo-500 text-white shadow-indigo-200" : "bg-slate-100 dark:bg-slate-700 text-slate-400");
    i0.ɵɵadvance(3);
    i0.ɵɵclassProp("text-indigo-700", ctx_r1.exportType() === "raw");
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.exportType() === "raw" ? 24 : -1);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.exportType() === "standard" ? "border-emerald-200 bg-emerald-50/30 dark:border-emerald-800 dark:bg-emerald-900/20 ring-1 ring-emerald-300/50 dark:ring-emerald-700/30" : "border-slate-100 dark:border-slate-700");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.isExporting());
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.exportType() === "standard" ? "bg-emerald-500 text-white shadow-emerald-200" : "bg-slate-100 dark:bg-slate-700 text-slate-400");
    i0.ɵɵadvance(3);
    i0.ɵɵclassProp("text-emerald-700", ctx_r1.exportType() === "standard");
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.exportType() === "standard" ? 34 : -1);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.exportType() === "user" ? "border-orange-200 bg-orange-50/30 dark:border-orange-800 dark:bg-orange-900/20 ring-1 ring-orange-300/50 dark:ring-orange-700/30" : "border-slate-100 dark:border-slate-700");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.isExporting());
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.exportType() === "user" ? "bg-orange-500 text-white shadow-orange-200" : "bg-slate-100 dark:bg-slate-700 text-slate-400");
    i0.ɵɵadvance(3);
    i0.ɵɵclassProp("text-orange-700", ctx_r1.exportType() === "user");
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.exportType() === "user" ? 44 : -1);
} }
function StandardRequestsComponent_Conditional_64_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, StandardRequestsComponent_Conditional_64_Defer_0_Template, 45, 33);
    i0.ɵɵdefer(1, 0, StandardRequestsComponent_Conditional_64_Defer_1_DepsFn);
    i0.ɵɵdeferOnIdle();
} }
function removeAccents(str) {
    if (!str)
        return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}
export class StandardRequestsComponent {
    constructor() {
        this.stdService = inject(StandardService);
        this.requestService = inject(StandardRequestService);
        this.state = inject(StateService);
        this.toast = inject(ToastService);
        this.confirmationService = inject(ConfirmationService);
        this.auth = inject(AuthService);
        this.fb = inject(FormBuilder);
        this.router = inject(Router);
        this.datePipe = inject(DatePipe);
        this.requests = signal([]);
        this.availableStandards = computed(() => {
            const activeRequestStdIds = new Set(this.requests()
                .filter(r => ['PENDING_APPROVAL', 'IN_PROGRESS', 'PENDING_RETURN'].includes(r.status))
                .map(r => r.standardId));
            return this.allStandards().filter(s => s.status !== 'IN_USE' && !activeRequestStdIds.has(s.id));
        });
        this.allStandards = signal([]);
        this.searchTerm = signal('');
        this.statusFilter = signal('ALL');
        this.viewMode = signal('kanban');
        this.isLoading = signal(true);
        // Export
        this.showExportModal = signal(false);
        this.exportType = signal('raw');
        this.isExporting = signal(false);
        this.exportCompleted = signal(false);
        this.dateRangeFilter = signal({ from: '', to: '' });
        this.isProcessing = signal(false);
        this.showModal = signal(false);
        this.showPurchaseModal = signal(false);
        this.selectedPurchaseStd = signal(null);
        this.selectedRequest = signal(null);
        this.activeModal = signal(null);
        this.isForceReturn = signal(false);
        this.canOperateStandards = computed(() => this.auth.canAssignStandards());
        this.currentStandard = computed(() => {
            const req = this.selectedRequest();
            if (!req)
                return null;
            return this.allStandards().find(s => s.id === req.standardId) || null;
        });
        // Admin Purchase Requests
        this.showPurchaseRequestsAdminModal = signal(false);
        this.loadingAdminRequests = signal(false);
        this.adminPurchaseRequests = signal([]);
        this.pendingPurchaseRequestsCount = signal(0);
        this.currentListenerRoleKey = '';
        this.filteredRequests = computed(() => {
            const reqs = this.requests();
            const term = removeAccents(this.searchTerm().toLowerCase());
            const status = this.statusFilter();
            const stdsMap = new Map(this.allStandards().map(s => [s.id, s]));
            const currentUser = this.auth.currentUser();
            const isAdmin = this.auth.canAssignStandards();
            // Filter for non-admins to only see their own requests (for the main list)
            let displayReqs = [...reqs];
            if (!isAdmin && currentUser) {
                displayReqs = displayReqs.filter(r => r.requestedBy === currentUser.uid);
            }
            if (status !== 'ALL') {
                displayReqs = displayReqs.filter(r => r.status === status);
            }
            if (term) {
                displayReqs = displayReqs.filter(r => removeAccents((r.standardName || '').toLowerCase()).includes(term) ||
                    removeAccents((r.requestedByName || '').toLowerCase()).includes(term) ||
                    removeAccents((r.lotNumber || '').toLowerCase()).includes(term));
            }
            return displayReqs.map(r => ({
                ...r,
                standardDetails: stdsMap.get(r.standardId)
            }));
        });
        // Status Counts for Tabs (Admin views all, Users view theirs)
        this.statusCounts = computed(() => {
            const reqs = this.requests();
            const currentUser = this.auth.currentUser();
            const isAdmin = this.auth.canAssignStandards();
            const filtered = isAdmin ? reqs : reqs.filter(r => r.requestedBy === currentUser?.uid);
            return {
                ALL: filtered.length,
                PENDING_APPROVAL: filtered.filter(r => r.status === 'PENDING_APPROVAL').length,
                APPROVED: filtered.filter(r => r.status === 'IN_PROGRESS').length,
                IN_PROGRESS: filtered.filter(r => r.status === 'IN_PROGRESS').length,
                PENDING_RETURN: filtered.filter(r => r.status === 'PENDING_RETURN').length,
                COMPLETED: filtered.filter(r => r.status === 'COMPLETED').length,
                REJECTED: filtered.filter(r => r.status === 'REJECTED').length
            };
        });
        // Đảm bảo listener hoạt động đúng kể cả khi PWA tải siêu nhanh
        // và auth state chưa được nạp xong.
        effect(() => {
            const isAuthReady = this.auth.isAuthReady();
            const user = this.auth.currentUser();
            if (isAuthReady && user) {
                const isAdmin = this.auth.canAssignStandards();
                const roleKey = isAdmin ? 'admin' : user.uid;
                if (this.currentListenerRoleKey !== roleKey) {
                    this.currentListenerRoleKey = roleKey;
                    // 1. Lắng nghe Standard Requests (singleton — chỉ register callback)
                    if (this.unregisterRequests)
                        this.unregisterRequests();
                    this.isLoading.set(true);
                    this.unregisterRequests = this.requestService.startRequestsListener((reqs) => {
                        this.requests.set(reqs.filter(r => !r._isDeleted));
                        this.isLoading.set(false);
                    });
                    // 2. Lắng nghe Purchase Requests (chỉ dành cho Admin)
                    if (isAdmin) {
                        if (this.purchaseReqUnsub)
                            this.purchaseReqUnsub();
                        this.purchaseReqUnsub = this.stdService.listenToPendingPurchaseRequests((reqs) => {
                            this.adminPurchaseRequests.set(reqs);
                            this.pendingPurchaseRequestsCount.set(reqs.length);
                            this.loadingAdminRequests.set(false);
                        });
                    }
                    else {
                        if (this.purchaseReqUnsub) {
                            this.purchaseReqUnsub();
                            this.purchaseReqUnsub = undefined;
                        }
                    }
                }
            }
        });
    }
    clearFilters() {
        this.searchTerm.set('');
        this.statusFilter.set('ALL');
    }
    ngOnInit() {
        const cachedRequests = this.requestService.getRequestsFromCache();
        if (cachedRequests.length > 0 && this.requests().length === 0) {
            this.requests.set(cachedRequests.filter(r => !r._isDeleted));
            this.isLoading.set(false);
        }
        const stds = this.stdService.getAllStandardsFromCache();
        if (stds && stds.length > 0) {
            this.allStandards.set(stds);
        }
        this.unregisterLiveListener = this.stdService.listenToStandards((stds) => {
            if (stds) {
                this.allStandards.set([...stds]);
            }
        });
    }
    ngOnDestroy() {
        if (this.unregisterRequests)
            this.unregisterRequests();
        if (this.unregisterLiveListener)
            this.unregisterLiveListener();
        if (this.purchaseReqUnsub)
            this.purchaseReqUnsub();
    }
    // --- Purchase Requests Logic (Admin) ---
    openAdminPurchaseRequests() {
        if (!this.auth.canAssignStandards())
            return;
    }
    closeAdminPurchaseRequests() {
        this.showPurchaseRequestsAdminModal.set(false);
    }
    async markPurchaseRequestCompleted(req) {
        if (!req.id)
            return;
        this.confirmationService.confirm({
            message: `Xác nhận bạn đã MUA và NHẬN ĐƯỢC chuẩn "${req.standardName}"? Cần cập nhật số lượng tồn kho theo số liệu thực tế sau khi nhận.`,
            confirmText: 'Đã nhận',
            cancelText: 'Hủy'
        }).then(async (confirmed) => {
            if (confirmed) {
                this.isProcessing.set(true);
                try {
                    const uid = this.auth.currentUser()?.uid || '';
                    const uname = this.auth.currentUser()?.displayName || this.auth.currentUser()?.email || 'Admin';
                    const reqId = req.id;
                    await this.stdService.completePurchaseRequest(reqId, req.standardId, uid, uname);
                    this.toast.show('Đã hoàn thành yêu cầu mua sắm. Vui lòng cập nhật số lượng tồn kho của chuẩn!', 'success');
                }
                catch (e) {
                    this.toast.show('Lỗi: ' + e.message, 'error');
                }
                finally {
                    this.isProcessing.set(false);
                }
            }
        });
    }
    async markPurchaseRequestOrdered(req) {
        if (!req.id || this.isProcessing())
            return;
        this.isProcessing.set(true);
        try {
            await this.stdService.updatePurchaseRequestStatus(req.id, req.standardId, 'ORDERED');
            this.toast.show('Đã chuyển yêu cầu sang trạng thái đã đặt hàng.', 'success');
        }
        catch (error) {
            this.toast.show('Lỗi: ' + error.message, 'error');
        }
        finally {
            this.isProcessing.set(false);
        }
    }
    async rejectPurchaseRequest(req) {
        if (!req.id || this.isProcessing())
            return;
        const confirmed = await this.confirmationService.confirm({
            message: `Từ chối yêu cầu mua chuẩn "${req.standardName}"?`,
            confirmText: 'Từ chối',
            cancelText: 'Hủy',
            isDangerous: true
        });
        if (!confirmed)
            return;
        this.isProcessing.set(true);
        try {
            await this.stdService.updatePurchaseRequestStatus(req.id, req.standardId, 'REJECTED');
            this.toast.show('Đã từ chối yêu cầu mua.', 'success');
        }
        catch (error) {
            this.toast.show('Lỗi: ' + error.message, 'error');
        }
        finally {
            this.isProcessing.set(false);
        }
    }
    openRequestModal() {
        this.showModal.set(true);
    }
    closeModal() {
        this.showModal.set(false);
    }
    openPurchaseModal(std) {
        this.selectedPurchaseStd.set(std);
        this.showPurchaseModal.set(true);
    }
    closePurchaseModal() {
        this.showPurchaseModal.set(false);
        this.selectedPurchaseStd.set(null);
    }
    async submitRequest(event) {
        if (event.standardIds.length === 0 || this.isProcessing())
            return;
        const user = this.auth.currentUser();
        if (!user) {
            this.toast.show('Bạn cần đăng nhập để thực hiện', 'error');
            return;
        }
        this.isProcessing.set(true);
        let createdCount = 0;
        let skippedCount = 0;
        try {
            for (const stdId of event.standardIds) {
                const std = this.availableStandards().find(s => s.id === stdId);
                if (!std)
                    continue;
                if (!isFefoCandidate(std)) {
                    this.toast.show(`Lô "${std.internal_id || std.lot_number || std.name}" không còn sẵn sàng, đã bỏ qua.`, 'info');
                    skippedCount++;
                    continue;
                }
                // Kiểm tra request trùng lặp: bất kỳ ai đã có yêu cầu đang hoạt động cho chuẩn này chưa
                const hasActiveRequest = this.requests().some(r => r.standardId === stdId &&
                    ['PENDING_APPROVAL', 'IN_PROGRESS', 'PENDING_RETURN'].includes(r.status));
                if (hasActiveRequest) {
                    this.toast.show(`"${std.name}" đã có yêu cầu của bạn đang hoạt động, bỏ qua.`, 'info');
                    skippedCount++;
                    continue;
                }
                const req = {
                    standardId: std.id,
                    standardName: std.name,
                    lotNumber: std.lot_number,
                    requestedBy: user.uid,
                    requestedByName: user.displayName || user.email || 'Unknown',
                    requestDate: Date.now(),
                    purpose: event.purpose,
                    status: 'PENDING_APPROVAL',
                    totalAmountUsed: 0
                };
                await this.stdService.createRequest(req);
                createdCount++;
            }
            if (createdCount > 0) {
                this.toast.show(`Đã gửi ${createdCount} yêu cầu thành công${skippedCount > 0 ? ` (bỏ qua ${skippedCount} trùng lặp)` : ''}`, 'success');
            }
            else if (skippedCount > 0) {
                this.toast.show('Tất cả chuẩn đã chọn đều đã có yêu cầu đang hoạt động.', 'info');
            }
            this.closeModal();
        }
        catch (e) {
            this.toast.show('Lỗi: ' + (e.message || e), 'error');
        }
        finally {
            this.isProcessing.set(false);
        }
    }
    async hardDeleteHistory(req) {
        this.confirmationService.confirm({
            message: `XÓA YÊU CẦU: Thao tác này sẽ dọn dẹp các bản ghi nhật ký tự động và HOÀN TÁC dư lượng của chuẩn "${req.standardName}". Dữ liệu bị xóa không thể khôi phục!`,
            confirmText: 'Đồng ý xóa & Fallback',
            cancelText: 'Hủy',
            isDangerous: true
        }).then(async (confirmed) => {
            if (confirmed) {
                this.isProcessing.set(true);
                try {
                    await this.stdService.hardDeleteRequest(req);
                    this.toast.show('Đã xóa vĩnh viễn lịch sử và hoàn tác dữ liệu thành công', 'success');
                }
                catch (e) {
                    this.toast.show('Lỗi khi xóa: ' + (e.message || e), 'error');
                }
                finally {
                    this.isProcessing.set(false);
                }
            }
        });
    }
    closeActionModal() {
        this.activeModal.set(null);
        this.selectedRequest.set(null);
    }
    approveRequest(req) {
        if (this.isProcessing())
            return;
        this.selectedRequest.set(req);
        this.activeModal.set('approve');
    }
    async confirmApprove(data) {
        const req = this.selectedRequest();
        if (!req || !req.id || this.isProcessing())
            return;
        const user = this.auth.currentUser();
        if (!user)
            return;
        this.isProcessing.set(true);
        try {
            // Dispense
            await this.stdService.dispenseStandard(req.id, req.standardId, user.uid, user.displayName || user.email || 'Unknown');
            if (data.purpose !== req.purpose || data.expectedAmount !== req.expectedAmount) {
                const updates = {
                    purpose: data.purpose,
                    expectedAmount: data.expectedAmount ?? null
                };
                await this.stdService.updateRequestStatus(req.id, 'IN_PROGRESS', updates);
            }
            this.toast.show('Đã duyệt và giao chuẩn thành công', 'success');
            this.closeActionModal();
        }
        catch (e) {
            this.toast.show('Lỗi: ' + e.message, 'error');
        }
        finally {
            this.isProcessing.set(false);
        }
    }
    openRejectModal(req) {
        if (this.isProcessing())
            return;
        this.selectedRequest.set(req);
        this.activeModal.set('reject');
    }
    async confirmReject(data) {
        const req = this.selectedRequest();
        if (!req || !req.id || this.isProcessing())
            return;
        this.isProcessing.set(true);
        try {
            await this.stdService.updateRequestStatus(req.id, 'REJECTED', { rejectionReason: data.reason });
            this.toast.show('Đã từ chối yêu cầu', 'success');
            this.closeActionModal();
        }
        catch (e) {
            this.toast.show('Lỗi: ' + e.message, 'error');
        }
        finally {
            this.isProcessing.set(false);
        }
    }
    openReturnModal(req, isForce) {
        if (this.isProcessing())
            return;
        this.selectedRequest.set(req);
        this.isForceReturn.set(isForce);
        this.activeModal.set('return');
    }
    async confirmReturn(data) {
        const req = this.selectedRequest();
        if (!req || !req.id || this.isProcessing())
            return;
        const isForce = this.isForceReturn();
        this.isProcessing.set(true);
        try {
            if (isForce) {
                const user = this.auth.currentUser();
                const result = await this.stdService.returnStandard(req.id, req.standardId, user?.uid || '', user?.displayName || user?.email || 'Unknown', data.isDepleted, data.amount, req.standardDetails?.unit || 'mg', undefined, data.sopTags);
                this.toast.show('Đã thu hồi chuẩn thành công', 'success');
                if (result.tagMergeStatus === 'SKIPPED_LIMIT') {
                    this.toast.show(result.tagMergeWarning || 'Đã hoàn trả kho nhưng chưa gộp được nhãn vì chất chuẩn đã đủ giới hạn.', 'info');
                }
            }
            else {
                // Employee -> Pending Admin Receive
                await this.stdService.updateRequestStatus(req.id, 'PENDING_RETURN', {
                    reportedAmountUsed: data.amount,
                    reportedUnit: req.standardDetails?.unit || 'mg',
                    reportedDepleted: data.isDepleted,
                    sopTags: data.sopTags
                });
                this.toast.show('Đã báo cáo trả chuẩn', 'success');
            }
            this.closeActionModal();
        }
        catch (e) {
            this.toast.show('Lỗi: ' + e.message, 'error');
        }
        finally {
            this.isProcessing.set(false);
        }
    }
    async undoReturn(req) {
        if (this.isProcessing() || req.status !== 'PENDING_RETURN')
            return;
        this.confirmationService.confirm({
            message: `Hủy báo cáo trả và quay lại trạng thái "Đang sử dụng" cho chuẩn "${req.standardName}"?`,
            confirmText: 'Đồng ý hủy báo cáo',
            cancelText: 'Quay lại'
        }).then(async (confirmed) => {
            if (confirmed) {
                this.isProcessing.set(true);
                try {
                    await this.stdService.updateRequestStatus(req.id, 'IN_PROGRESS');
                    this.toast.show('Đã hủy báo cáo trả', 'success');
                }
                catch (e) {
                    this.toast.show('Lỗi: ' + e.message, 'error');
                }
                finally {
                    this.isProcessing.set(false);
                }
            }
        });
    }
    openLogUsageModal(req) {
        if (this.isProcessing())
            return;
        this.selectedRequest.set(req);
        this.activeModal.set('logUsage');
    }
    async confirmLogUsage(data) {
        const req = this.selectedRequest();
        if (!req || !req.id || this.isProcessing())
            return;
        this.isProcessing.set(true);
        try {
            const user = this.auth.currentUser();
            await this.stdService.logUsageForRequest(req.id, req.standardId, data.amount, req.standardDetails?.unit || 'mg', data.purpose.trim(), user?.uid || '', user?.displayName || user?.email || 'Unknown');
            this.toast.show('Đã ghi nhận sử dụng (Dùng dần) thành công', 'success');
            this.closeActionModal();
        }
        catch (e) {
            this.toast.show('Lỗi: ' + e.message, 'error');
        }
        finally {
            this.isProcessing.set(false);
        }
    }
    openAdminReceiveModal(req) {
        if (this.isProcessing())
            return;
        this.selectedRequest.set(req);
        this.activeModal.set('adminReceive');
    }
    async confirmAdminReceive(data) {
        const req = this.selectedRequest();
        if (!req || !req.id || this.isProcessing())
            return;
        const user = this.auth.currentUser();
        if (!user)
            return;
        this.isProcessing.set(true);
        try {
            const reason = data.disposalReason.trim();
            const result = await this.stdService.returnStandard(req.id, req.standardId, user.uid, user.displayName || user.email || 'Unknown', data.isDepleted, data.amount, req.standardDetails?.unit || 'mg', data.isDepleted && reason ? reason : undefined, data.finalSopTags);
            this.toast.show('Đã xác nhận nhận lại chuẩn thành công', 'success');
            if (result.tagMergeStatus === 'SKIPPED_LIMIT') {
                this.toast.show(result.tagMergeWarning || 'Đã nhập kho trả nhưng chưa gộp được nhãn vì chất chuẩn đã đủ giới hạn.', 'info');
            }
            this.closeActionModal();
        }
        catch (e) {
            this.toast.show('Lỗi: ' + e.message, 'error');
        }
        finally {
            this.isProcessing.set(false);
        }
    }
    getStatusLabel(status) {
        switch (status) {
            case 'PENDING_APPROVAL': return 'Chờ duyệt';
            case 'IN_PROGRESS': return 'Đang sử dụng';
            case 'PENDING_RETURN': return 'Chờ trả';
            case 'COMPLETED': return 'Hoàn thành';
            case 'REJECTED': return 'Từ chối';
            default: return status;
        }
    }
    openExportModal() {
        this.exportCompleted.set(false);
        this.isExporting.set(false);
        this.exportType.set('raw');
        this.showExportModal.set(true);
    }
    closeExportModal() {
        this.showExportModal.set(false);
    }
    getExportDateRangeText() {
        const dr = this.dateRangeFilter();
        if (!dr.from && !dr.to)
            return '';
        const fromStr = dr.from ? (this.datePipe.transform(dr.from, 'dd/MM/yyyy') ?? '...') : '...';
        const toStr = dr.to ? (this.datePipe.transform(dr.to, 'dd/MM/yyyy') ?? '...') : '...';
        return `${fromStr} → ${toStr}`;
    }
    getExportableRequests() {
        let reqs = this.filteredRequests();
        // Date range filter (from export modal)
        const dr = this.dateRangeFilter();
        if (dr.from) {
            const fromTs = new Date(dr.from).getTime();
            reqs = reqs.filter(r => r.requestDate >= fromTs);
        }
        if (dr.to) {
            const toTs = new Date(dr.to).setHours(23, 59, 59, 999);
            reqs = reqs.filter(r => r.requestDate <= toTs);
        }
        return reqs;
    }
    async runExport() {
        const reqs = this.getExportableRequests();
        if (reqs.length === 0) {
            this.toast.show('Không có dữ liệu để xuất.', 'info');
            return;
        }
        this.isExporting.set(true);
        this.exportCompleted.set(false);
        try {
            const XLSX = await import('xlsx');
            const wb = XLSX.utils.book_new();
            if (this.exportType() === 'raw') {
                const exportData = reqs.map((r, i) => ({
                    'STT': i + 1,
                    'Tên chuẩn': r.standardName,
                    'Tên hóa học': r.standardDetails?.chemical_name || '',
                    'Số lô (Lot)': r.lotNumber || '',
                    'Mã quản lý': r.standardDetails?.internal_id || '',
                    'Mã catalog (mã sản phẩm)': r.standardDetails?.product_code || '',
                    'Số CAS': r.standardDetails?.cas_number || '',
                    'Độ tinh khiết': r.standardDetails?.purity || '',
                    'Hãng sản xuất': r.standardDetails?.manufacturer || '',
                    'Quy cách đóng gói': r.standardDetails?.pack_size || '',
                    'Người yêu cầu': r.requestedByName,
                    'Nguồn hồ sơ': r.isBackfill ? 'Nhập bù lịch sử' : 'Mượn thực tế',
                    'Ngày yêu cầu': this.datePipe.transform(r.requestDate, 'dd/MM/yyyy HH:mm'),
                    'Mục đích': r.purpose || '',
                    'Lượng dự kiến': r.expectedAmount ?? '',
                    'Trạng thái': this.getStatusLabel(r.status),
                    'Người duyệt': r.approvedByName || '',
                    'Ngày duyệt': r.approvalDate ? this.datePipe.transform(r.approvalDate, 'dd/MM/yyyy HH:mm') : '',
                    'Lượng đã dùng': r.totalAmountUsed || 0,
                    'Đơn vị': r.standardDetails?.unit || 'mg',
                    'Ngày trả': r.returnDate ? this.datePipe.transform(r.returnDate, 'dd/MM/yyyy HH:mm') : '',
                    'Người nhận lại': r.receivedByName || '',
                    'Đã hết chuẩn': r.reportedDepleted ? 'Có' : '',
                    'Hạn sử dụng': r.standardDetails?.expiry_date || '',
                    'Ngày nhận': r.standardDetails?.received_date || '',
                    'Ngày mở nắp': r.standardDetails?.date_opened || '',
                    'Vị trí lưu trữ': r.standardDetails?.location || '',
                    'Điều kiện bảo quản': r.standardDetails?.storage_condition || '',
                    'Link CoA / Chứng chỉ': r.standardDetails?.certificate_ref || '',
                    'Lý do từ chối': r.rejectionReason || '',
                    'Lý do hủy/tiêu hủy': r.disposalReason || ''
                }));
                const ws = XLSX.utils.json_to_sheet(exportData);
                // Auto-width columns
                const colWidths = Object.keys(exportData[0]).map(key => ({
                    wch: Math.max(key.length, ...exportData.map(row => String(row[key] || '').length)) + 2
                }));
                ws['!cols'] = colWidths;
                XLSX.utils.book_append_sheet(wb, ws, 'Chi tiết yêu cầu');
            }
            else if (this.exportType() === 'standard') {
                const summary = {};
                reqs.forEach(r => {
                    const key = r.standardId;
                    if (!summary[key]) {
                        summary[key] = {
                            name: r.standardName,
                            lot: r.lotNumber || '',
                            internalId: r.standardDetails?.internal_id || '',
                            manufacturer: r.standardDetails?.manufacturer || '',
                            count: 0,
                            totalUsed: 0,
                            unit: r.standardDetails?.unit || 'mg',
                            pending: 0,
                            inProgress: 0,
                            pendingReturn: 0,
                            completed: 0,
                            rejected: 0
                        };
                    }
                    summary[key].count++;
                    summary[key].totalUsed += (r.totalAmountUsed || 0);
                    if (r.status === 'PENDING_APPROVAL')
                        summary[key].pending++;
                    else if (r.status === 'IN_PROGRESS')
                        summary[key].inProgress++;
                    else if (r.status === 'PENDING_RETURN' || r.status === 'PENDING_DEPLETION')
                        summary[key].pendingReturn++;
                    else if (r.status === 'COMPLETED')
                        summary[key].completed++;
                    else if (r.status === 'REJECTED')
                        summary[key].rejected++;
                });
                const exportData = Object.values(summary).map((s, i) => ({
                    'STT': i + 1,
                    'Tên chuẩn': s.name,
                    'Số lô': s.lot,
                    'Mã quản lý': s.internalId,
                    'Hãng sản xuất': s.manufacturer,
                    'Tổng yêu cầu': s.count,
                    'Chờ duyệt': s.pending,
                    'Đang dùng': s.inProgress,
                    'Chờ trả': s.pendingReturn,
                    'Hoàn thành': s.completed,
                    'Từ chối': s.rejected,
                    'Tổng lượng đã dùng': s.totalUsed,
                    'Đơn vị': s.unit
                }));
                const ws = XLSX.utils.json_to_sheet(exportData);
                ws['!cols'] = Object.keys(exportData[0]).map(key => ({
                    wch: Math.max(key.length, ...exportData.map(row => String(row[key] || '').length)) + 2
                }));
                XLSX.utils.book_append_sheet(wb, ws, 'Theo Chất chuẩn');
            }
            else if (this.exportType() === 'user') {
                const summary = {};
                reqs.forEach(r => {
                    const key = r.requestedBy;
                    if (!summary[key]) {
                        summary[key] = {
                            name: r.requestedByName,
                            total: 0,
                            totalsByUnit: {},
                            pending: 0,
                            inProgress: 0,
                            pendingReturn: 0,
                            completed: 0,
                            rejected: 0,
                            standards: new Set()
                        };
                    }
                    summary[key].total++;
                    const unit = r.confirmedUnit || r.standardDetails?.unit || 'không rõ';
                    summary[key].totalsByUnit[unit] = (summary[key].totalsByUnit[unit] || 0) + (r.totalAmountUsed || 0);
                    summary[key].standards.add(r.standardName);
                    if (r.status === 'PENDING_APPROVAL')
                        summary[key].pending++;
                    else if (r.status === 'IN_PROGRESS')
                        summary[key].inProgress++;
                    else if (r.status === 'PENDING_RETURN' || r.status === 'PENDING_DEPLETION')
                        summary[key].pendingReturn++;
                    else if (r.status === 'COMPLETED')
                        summary[key].completed++;
                    else if (r.status === 'REJECTED')
                        summary[key].rejected++;
                });
                const exportData = Object.values(summary).map((s, i) => ({
                    'STT': i + 1,
                    'Nhân viên': s.name,
                    'Tổng yêu cầu': s.total,
                    'Số chuẩn sử dụng': s.standards.size,
                    'Chờ duyệt': s.pending,
                    'Đang dùng': s.inProgress,
                    'Chờ trả': s.pendingReturn,
                    'Hoàn thành': s.completed,
                    'Từ chối': s.rejected,
                    'Tổng lượng đã dùng theo đơn vị': Object.entries(s.totalsByUnit)
                        .map(([unit, amount]) => `${amount} ${unit}`)
                        .join(' · ')
                }));
                const ws = XLSX.utils.json_to_sheet(exportData);
                ws['!cols'] = Object.keys(exportData[0]).map(key => ({
                    wch: Math.max(key.length, ...exportData.map(row => String(row[key] || '').length)) + 2
                }));
                XLSX.utils.book_append_sheet(wb, ws, 'Theo Nhân viên');
            }
            const statusSuffix = this.statusFilter() !== 'ALL' ? `_${this.statusFilter()}` : '';
            const typeSuffix = this.exportType();
            XLSX.writeFile(wb, `YeuCauChuan_${typeSuffix}${statusSuffix}_${this.datePipe.transform(Date.now(), 'yyyyMMdd_HHmm')}.xlsx`);
            this.exportCompleted.set(true);
        }
        catch (err) {
            console.error('Lỗi xuất Excel:', err);
            this.toast.show('Lỗi xuất tệp Excel', 'error');
        }
        finally {
            this.isExporting.set(false);
        }
    }
    static { this.ɵfac = function StandardRequestsComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StandardRequestsComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StandardRequestsComponent, selectors: [["app-standard-requests"]], features: [i0.ɵɵProvidersFeature([DatePipe])], decls: 65, vars: 30, consts: [[1, "requests-page", "flex", "flex-col", "space-y-4", "h-full", "relative", "p-1", "pb-6", "overflow-visible"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-4", "mb-4", "bg-white", "dark:bg-slate-800", "p-4", "rounded-2xl", "shadow-sm", "border", "border-slate-100", "dark:border-slate-700", "shrink-0"], [1, "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-xl", "bg-indigo-50", "dark:bg-indigo-900/30", "text-indigo-650", "dark:text-indigo-400", "flex", "items-center", "justify-center", "border", "border-indigo-100", "dark:border-indigo-800/30", "shadow-sm", "shrink-0"], [1, "fa-solid", "fa-clipboard-list", "text-base"], [1, "text-xl", "font-black", "text-slate-850", "dark:text-slate-100", "tracking-tight", "leading-tight"], [1, "text-xs", "font-medium", "text-slate-500", "dark:text-slate-400", "mt-0.5"], [1, "flex", "flex-wrap", "gap-2", "items-center", "w-full", "md:w-auto"], [1, "group", "px-4", "py-2.5", "bg-emerald-600", "text-white", "hover:bg-emerald-700", "rounded-2xl", "shadow-lg", "shadow-emerald-200", "dark:shadow-none", "transition-all", "font-black", "text-xs", "flex", "items-center", "gap-2", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-file-excel", "text-sm", "group-hover:scale-110", "transition-transform"], [1, "group", "relative", "px-4", "py-2", "bg-amber-500", "hover:bg-amber-600", "text-white", "rounded-2xl", "shadow-lg", "shadow-amber-200", "dark:shadow-none", "transition-all", "font-black", "text-sm", "flex", "items-center", "gap-2", "active:scale-95"], [1, "group", "px-5", "py-2.5", "bg-slate-900", "dark:bg-indigo-600", "text-white", "hover:bg-slate-800", "dark:hover:bg-indigo-500", "rounded-2xl", "shadow-xl", "shadow-indigo-100", "dark:shadow-none", "transition-all", "font-black", "text-sm", "flex", "items-center", "gap-2", "active:scale-95", 3, "click", "appLockPermission"], [1, "fa-solid", "fa-plus-circle", "text-base", "group-hover:rotate-90", "transition-transform"], [1, "flex", "flex-col", "flex-1", "bg-white", "dark:bg-slate-800", "mx-2", "rounded-[2.5rem]", "shadow-[0_20px_50px_rgba(0,0,0,0.04)]", "border", "border-slate-100", "dark:border-slate-700", "overflow-hidden", "min-h-0"], [1, "p-4", "border-b", "border-slate-50", "dark:border-slate-700", "bg-white/50", "dark:bg-slate-800/50", "backdrop-blur-md", "sticky", "top-0", "z-40"], [1, "flex", "flex-col", "lg:flex-row", "lg:items-center", "justify-between", "gap-4"], [1, "flex", "items-center", "gap-1", "p-1", "bg-slate-100/50", "dark:bg-slate-900/50", "rounded-2xl", "border", "border-slate-100", "dark:border-slate-800", "overflow-x-auto", "no-scrollbar", "max-w-full"], [1, "flex", "items-center", "gap-2", "px-4", "py-2", "rounded-xl", "text-sm", "font-black", "transition-all", "whitespace-nowrap", 3, "click"], [1, "px-1.5", "py-0.5", "bg-slate-200", "dark:bg-slate-700", "rounded-md", "text-xs", "opacity-70"], [1, "px-1.5", "py-0.5", "bg-amber-100", "dark:bg-amber-900/30", "rounded-md", "text-xs", "opacity-70", "text-amber-600"], [1, "px-1.5", "py-0.5", "bg-emerald-100", "dark:bg-emerald-900/30", "rounded-md", "text-xs", "opacity-70", "text-emerald-600"], [1, "px-1.5", "py-0.5", "bg-indigo-100", "dark:bg-indigo-900/30", "rounded-md", "text-xs", "opacity-70", "text-indigo-600"], [1, "flex", "flex-col", "sm:flex-row", "sm:items-center", "gap-2", "w-full", "lg:w-auto"], [1, "flex", "items-center", "justify-between", "gap-2", "min-w-0"], ["data-testid", "request-count", "aria-live", "polite", 1, "flex", "items-center", "gap-1.5", "px-2.5", "py-2", "rounded-xl", "bg-indigo-50/70", "dark:bg-indigo-900/20", "border", "border-indigo-100", "dark:border-indigo-800/40", "text-xs", "font-black", "text-indigo-700", "dark:text-indigo-300", "whitespace-nowrap"], [1, "fa-solid", "fa-list-check", "text-[10px]"], ["type", "button", "title", "X\u00F3a b\u1ED9 l\u1ECDc", 1, "px-2.5", "py-2", "rounded-xl", "text-xs", "font-black", "text-slate-500", "dark:text-slate-400", "hover:text-indigo-600", "hover:bg-slate-100", "dark:hover:bg-slate-800", "transition", "whitespace-nowrap"], [1, "flex", "items-center", "gap-2", "shrink-0"], [1, "flex", "items-center", "bg-slate-100/50", "dark:bg-slate-900/50", "rounded-xl", "p-1", "border", "border-slate-100", "dark:border-slate-800"], ["title", "Giao di\u1EC7n Th\u1EBB (Kanban)", "aria-label", "Giao di\u1EC7n Th\u1EBB (Kanban)", 1, "w-8", "h-8", "rounded-lg", "flex", "items-center", "justify-center", "transition-all", "text-base", 3, "click"], [1, "fa-solid", "fa-columns"], ["title", "Giao di\u1EC7n B\u1EA3ng (Table)", "aria-label", "Giao di\u1EC7n B\u1EA3ng (Table)", 1, "w-8", "h-8", "rounded-lg", "flex", "items-center", "justify-center", "transition-all", "text-base", 3, "click"], [1, "fa-solid", "fa-list"], [1, "relative", "min-w-0", "flex-1", "sm:w-[250px]", "sm:flex-none"], [1, "fa-solid", "fa-search", "absolute", "left-4", "top-1/2", "-translate-y-1/2", "text-slate-400"], ["type", "text", "placeholder", "T\u00ECm t\u00EAn chu\u1EA9n, ng\u01B0\u1EDDi m\u01B0\u1EE3n, s\u1ED1 l\u00F4...", "aria-label", "T\u00ECm y\u00EAu c\u1EA7u ch\u1EA5t chu\u1EA9n", "data-testid", "request-search", 1, "w-full", "pl-11", "pr-4", "py-2", "bg-slate-100/50", "dark:bg-slate-900/50", "border", "border-transparent", "rounded-xl", "text-base", "font-bold", "text-slate-800", "dark:text-slate-100", "outline-none", "focus:bg-white", "dark:focus:bg-slate-900", "focus:ring-4", "focus:ring-indigo-500/10", "focus:border-indigo-500", "transition-all", "placeholder-slate-400", 3, "ngModelChange", "ngModel"], [1, "flex", "flex-col", "flex-1", "overflow-hidden", "min-h-0", 3, "requests", "currentFilter"], ["role", "dialog", "aria-modal", "true", "aria-labelledby", "admin-purchase-requests-title", 1, "requests-modal-layer", "fixed", "inset-0", "z-[500]", "flex", "items-center", "justify-center", "p-4", "bg-slate-900/50", "backdrop-blur-sm", "fade-in"], [1, "group", "relative", "px-4", "py-2", "bg-amber-500", "hover:bg-amber-600", "text-white", "rounded-2xl", "shadow-lg", "shadow-amber-200", "dark:shadow-none", "transition-all", "font-black", "text-sm", "flex", "items-center", "gap-2", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-cart-shopping"], [1, "absolute", "-top-2", "-right-2", "px-2", "py-0.5", "min-w-[24px]", "h-6", "flex", "items-center", "justify-center", "bg-red-600", "text-white", "rounded-full", "text-xs", "font-black", "border-2", "border-white", "dark:border-slate-900", "shadow-md"], ["type", "button", "title", "X\u00F3a b\u1ED9 l\u1ECDc", 1, "px-2.5", "py-2", "rounded-xl", "text-xs", "font-black", "text-slate-500", "dark:text-slate-400", "hover:text-indigo-600", "hover:bg-slate-100", "dark:hover:bg-slate-800", "transition", "whitespace-nowrap", 3, "click"], [1, "fa-solid", "fa-filter-circle-xmark", "mr-1"], [1, "flex", "flex-col", "flex-1", "overflow-hidden", "min-h-0", 3, "navigateToStandard", "actionApprove", "actionReject", "actionLogUsage", "actionReturn", "actionUndoReturn", "actionAdminReceive", "actionDelete", "requests", "currentFilter"], [1, "flex", "flex-col", "flex-1", "overflow-hidden", "min-h-0", 3, "navigateToStandard", "actionApprove", "actionReject", "actionLogUsage", "actionReturn", "actionUndoReturn", "actionAdminReceive", "actionDelete", "requests", "isLoading"], [3, "close", "approveAction", "rejectAction", "logUsageAction", "returnAction", "adminReceiveAction", "activeModal", "request", "standard", "isForceReturn", "isProcessing"], [3, "close", "submitRequest", "requestPurchase", "isOpen", "isProcessing", "availableStandards"], [3, "closeModal", "isOpen", "selectedStd"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "shadow-2xl", "w-full", "max-w-5xl", "overflow-hidden", "flex", "flex-col", "max-h-[90vh]", "animate-slide-up"], [1, "px-6", "py-4", "border-b", "border-slate-100", "dark:border-slate-800", "bg-slate-50", "dark:bg-slate-800/80", "flex", "justify-between", "items-center", "shrink-0"], [1, "font-black", "text-slate-800", "dark:text-slate-100", "text-lg", "flex", "items-center", "gap-2"], [1, "w-8", "h-8", "rounded-lg", "bg-amber-100", "dark:bg-amber-500/20", "text-amber-600", "dark:text-amber-400", "flex", "items-center", "justify-center"], ["id", "admin-purchase-requests-title"], [1, "w-8", "h-8", "rounded-full", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "flex", "items-center", "justify-center", "text-slate-400", "dark:text-slate-500", "hover:text-red-500", "transition", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-times"], [1, "flex-1", "overflow-auto", "p-6", "bg-slate-50", "dark:bg-slate-900"], [1, "py-12", "flex", "justify-center"], [1, "fa-solid", "fa-spinner", "fa-spin", "text-2xl", "text-indigo-500"], [1, "py-12", "text-center", "text-slate-500", "dark:text-slate-400", "font-medium"], [1, "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "overflow-x-auto", "shadow-sm"], [1, "w-full", "text-left", "text-base", "whitespace-nowrap"], [1, "bg-slate-50", "dark:bg-slate-800/80", "text-sm", "uppercase", "font-bold", "text-slate-500", "dark:text-slate-400", "border-b", "border-slate-200", "dark:border-slate-700"], [1, "px-4", "py-3"], [1, "px-4", "py-3", "text-center"], [1, "divide-y", "divide-slate-100", "dark:divide-slate-800/60"], [1, "hover:bg-slate-50", "dark:hover:bg-slate-800/50", "transition"], [1, "px-4", "py-3", "align-top"], [1, "font-bold", "text-slate-800", "dark:text-slate-200", "whitespace-normal", "line-clamp-2", "max-w-[200px]", 3, "title"], [1, "text-sm", "font-bold", "text-indigo-600", "dark:text-indigo-400", "mt-1"], [1, "fa-solid", "fa-barcode", "mr-1"], [1, "flex", "flex-col", "gap-1.5", "text-sm"], [1, "flex", "items-center", "gap-1.5", "font-bold", "text-emerald-700", "dark:text-emerald-400", "bg-emerald-50", "dark:bg-emerald-900/30", "px-2", "py-0.5", "rounded", "w-max"], [1, "flex", "items-center", "gap-1.5", "font-bold", "text-cyan-700", "dark:text-cyan-400", "bg-cyan-50", "dark:bg-cyan-900/30", "px-2", "py-0.5", "rounded", "w-max"], [1, "text-slate-600", "dark:text-slate-400", "mt-1", "max-w-[250px]", "whitespace-normal", "italic", "bg-slate-50", "dark:bg-slate-800/50", "p-1.5", "rounded", 3, "title"], [1, "flex", "flex-col", "gap-1", "text-sm", "text-slate-600", "dark:text-slate-300"], [1, "flex", "gap-2"], [1, "flex", "flex-col", "gap-1"], [1, "font-bold", "text-base", "text-slate-800", "dark:text-slate-200", "flex", "items-center", "gap-1.5"], [1, "w-5", "h-5", "rounded-full", "bg-slate-200", "dark:bg-slate-700", "flex", "items-center", "justify-center", "text-xs", "text-slate-500"], [1, "fa-solid", "fa-user"], [1, "text-sm", "text-slate-500", "ml-6"], [1, "fa-regular", "fa-clock", "mr-1"], [1, "ml-6", "mt-1"], [1, "px-4", "py-3", "text-center", "align-top"], [1, "flex", "items-center", "justify-center", "gap-2"], [1, "fa-solid", "fa-shield-halved"], [1, "fa-solid", "fa-droplet"], [1, "fa-regular", "fa-comment", "text-slate-400"], [1, "w-16", "text-slate-400", "font-medium"], [1, "font-black", "text-slate-800", "dark:text-slate-100", "uppercase"], [1, "font-bold", "text-indigo-600", "dark:text-indigo-400"], [1, "inline-block", "px-2", "py-0.5", "rounded", "text-xs", "font-bold", "bg-red-100", "text-red-600", "border", "border-red-200", "dark:bg-red-900/30", "dark:text-red-400", "dark:border-red-800/50", "uppercase", "tracking-widest"], [1, "fa-solid", "fa-bolt", "mr-1"], [1, "px-3", "py-1.5", "bg-amber-500", "hover:bg-amber-600", "text-white", "rounded-lg", "text-sm", "font-bold", "transition", "disabled:opacity-50", 3, "click", "disabled"], [1, "fa-solid", "fa-cart-flatbed"], ["title", "T\u1EEB ch\u1ED1i", 1, "px-3", "py-1.5", "bg-red-50", "text-red-600", "border", "border-red-200", "hover:bg-red-100", "rounded-lg", "text-sm", "font-bold", "transition", "disabled:opacity-50", 3, "click", "disabled"], [1, "fa-solid", "fa-ban"], [1, "text-xs", "font-black", "text-amber-600", "mb-2", "uppercase", "tracking-wider"], [1, "fa-solid", "fa-truck-fast", "mr-1"], [1, "px-3", "py-1.5", "bg-emerald-500", "hover:bg-emerald-600", "text-white", "rounded-lg", "text-sm", "font-bold", "shadow-sm", "shadow-emerald-200", "dark:shadow-none", "transition", "disabled:opacity-50", "active:scale-95", "flex", "items-center", "gap-1.5", "mx-auto", 3, "click", "disabled"], [1, "fa-solid", "fa-check"], ["title", "Xu\u1EA5t danh s\u00E1ch y\u00EAu c\u1EA7u ch\u1EA5t chu\u1EA9n", "iconClass", "fa-solid fa-clipboard-list", 3, "close", "execute", "subtitle", "dateRangeText", "footerText", "isExporting", "isCompleted"], [1, "px-5", "pb-2", "pt-4", "space-y-4"], [1, "p-3", "bg-blue-50/80", "dark:bg-blue-900/20", "border", "border-blue-200/60", "dark:border-blue-800/40", "rounded-2xl"], [1, "p-3", "bg-slate-50/80", "dark:bg-slate-900/50", "border", "border-slate-200/60", "dark:border-slate-700/50", "rounded-2xl"], [1, "text-[10px]", "font-black", "text-slate-500", "dark:text-slate-400", "uppercase", "tracking-widest", "mb-2.5", "flex", "items-center", "gap-1.5"], [1, "fa-regular", "fa-calendar", "text-[9px]"], ["type", "date", 1, "flex-1", "px-3", "py-2", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-sm", "font-bold", "text-slate-700", "dark:text-slate-200", "focus:border-indigo-500", "outline-none", "transition", "[color-scheme:light]", "dark:[color-scheme:dark]", 3, "ngModelChange", "ngModel"], [1, "fa-solid", "fa-arrow-right", "text-slate-300", "dark:text-slate-600", "text-xs"], [1, "w-8", "h-8", "shrink-0", "flex", "items-center", "justify-center", "rounded-lg", "text-slate-400", "hover:text-red-500", "hover:bg-red-50", "dark:hover:bg-red-900/20", "transition", "text-xs"], [1, "text-[10px]", "font-black", "text-slate-500", "dark:text-slate-400", "uppercase", "tracking-widest", "flex", "items-center", "gap-1.5", "pt-1"], [1, "fa-solid", "fa-layer-group", "text-[9px]"], [1, "border", "rounded-2xl", "overflow-hidden", "transition-all"], [1, "w-full", "flex", "items-center", "gap-3.5", "p-4", "cursor-pointer", "hover:bg-slate-50/50", "dark:hover:bg-slate-700/20", "transition", 3, "click", "disabled"], [1, "w-9", "h-9", "rounded-xl", "flex", "items-center", "justify-center", "text-sm", "shrink-0", "shadow-sm", "transition-all"], [1, "flex-1", "text-left"], [1, "text-sm", "font-black", "dark:text-slate-200"], [1, "text-[11px]", "text-slate-500"], [1, "w-5", "h-5", "rounded-full", "bg-indigo-500", "text-white", "flex", "items-center", "justify-center", "shrink-0"], [1, "fa-solid", "fa-flask"], [1, "w-5", "h-5", "rounded-full", "bg-emerald-500", "text-white", "flex", "items-center", "justify-center", "shrink-0"], [1, "fa-solid", "fa-users"], [1, "w-5", "h-5", "rounded-full", "bg-orange-500", "text-white", "flex", "items-center", "justify-center", "shrink-0"], [1, "text-[10px]", "font-black", "text-blue-500", "dark:text-blue-400", "uppercase", "tracking-widest", "mb-2", "flex", "items-center", "gap-1.5"], [1, "fa-solid", "fa-filter", "text-[9px]"], [1, "flex", "flex-wrap", "gap-2"], [1, "px-2.5", "py-1", "bg-white", "dark:bg-slate-800", "border", "border-blue-200", "dark:border-blue-800/50", "rounded-lg", "text-[11px]", "font-bold", "text-blue-600", "dark:text-blue-400", "flex", "items-center", "gap-1.5"], [1, "fa-solid", "fa-circle-dot", "text-[8px]"], [1, "fa-solid", "fa-search", "text-[8px]"], [1, "w-8", "h-8", "shrink-0", "flex", "items-center", "justify-center", "rounded-lg", "text-slate-400", "hover:text-red-500", "hover:bg-red-50", "dark:hover:bg-red-900/20", "transition", "text-xs", 3, "click"], [1, "fa-solid", "fa-xmark"], [1, "fa-solid", "fa-check", "text-[10px]"]], template: function StandardRequestsComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
            i0.ɵɵelement(4, "i", 4);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "div")(6, "h2", 5);
            i0.ɵɵtext(7, "Qu\u1EA3n L\u00FD Y\u00EAu C\u1EA7u Ch\u1EA5t Chu\u1EA9n");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "p", 6);
            i0.ɵɵtext(9, "Theo d\u00F5i, c\u1EA5p ph\u00E1t v\u00E0 thu h\u1ED3i chu\u1EA9n \u0111\u1ED1i chi\u1EBFu.");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(10, "div", 7)(11, "button", 8);
            i0.ɵɵlistener("click", function StandardRequestsComponent_Template_button_click_11_listener() { return ctx.openExportModal(); });
            i0.ɵɵelement(12, "i", 9);
            i0.ɵɵtext(13, " Xu\u1EA5t Excel ");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(14, StandardRequestsComponent_Conditional_14_Template, 4, 3, "button", 10);
            i0.ɵɵelementStart(15, "button", 11);
            i0.ɵɵlistener("click", function StandardRequestsComponent_Template_button_click_15_listener() { return ctx.openRequestModal(); });
            i0.ɵɵelement(16, "i", 12);
            i0.ɵɵtext(17, " T\u1EA1o Y\u00EAu C\u1EA7u M\u1EDBi ");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(18, "div", 13)(19, "div", 14)(20, "div", 15)(21, "div", 16)(22, "button", 17);
            i0.ɵɵlistener("click", function StandardRequestsComponent_Template_button_click_22_listener() { return ctx.statusFilter.set("ALL"); });
            i0.ɵɵtext(23, " T\u1EA5t C\u1EA3 ");
            i0.ɵɵelementStart(24, "span", 18);
            i0.ɵɵtext(25);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(26, "button", 17);
            i0.ɵɵlistener("click", function StandardRequestsComponent_Template_button_click_26_listener() { return ctx.statusFilter.set("PENDING_APPROVAL"); });
            i0.ɵɵtext(27, " Ch\u1EDD Duy\u1EC7t ");
            i0.ɵɵelementStart(28, "span", 19);
            i0.ɵɵtext(29);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(30, "button", 17);
            i0.ɵɵlistener("click", function StandardRequestsComponent_Template_button_click_30_listener() { return ctx.statusFilter.set("IN_PROGRESS"); });
            i0.ɵɵtext(31, " \u0110ang D\u00F9ng ");
            i0.ɵɵelementStart(32, "span", 20);
            i0.ɵɵtext(33);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(34, "button", 17);
            i0.ɵɵlistener("click", function StandardRequestsComponent_Template_button_click_34_listener() { return ctx.statusFilter.set("PENDING_RETURN"); });
            i0.ɵɵtext(35, " Ch\u1EDD Tr\u1EA3 ");
            i0.ɵɵelementStart(36, "span", 21);
            i0.ɵɵtext(37);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(38, "button", 17);
            i0.ɵɵlistener("click", function StandardRequestsComponent_Template_button_click_38_listener() { return ctx.statusFilter.set("COMPLETED"); });
            i0.ɵɵtext(39, " Ho\u00E0n Th\u00E0nh ");
            i0.ɵɵelementStart(40, "span", 18);
            i0.ɵɵtext(41);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(42, "div", 22)(43, "div", 23)(44, "div", 24);
            i0.ɵɵelement(45, "i", 25);
            i0.ɵɵelementStart(46, "span");
            i0.ɵɵtext(47);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(48, StandardRequestsComponent_Conditional_48_Template, 3, 0, "button", 26);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(49, "div", 27)(50, "div", 28)(51, "button", 29);
            i0.ɵɵlistener("click", function StandardRequestsComponent_Template_button_click_51_listener() { return ctx.viewMode.set("kanban"); });
            i0.ɵɵelement(52, "i", 30);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(53, "button", 31);
            i0.ɵɵlistener("click", function StandardRequestsComponent_Template_button_click_53_listener() { return ctx.viewMode.set("table"); });
            i0.ɵɵelement(54, "i", 32);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(55, "div", 33);
            i0.ɵɵelement(56, "i", 34);
            i0.ɵɵelementStart(57, "input", 35);
            i0.ɵɵlistener("ngModelChange", function StandardRequestsComponent_Template_input_ngModelChange_57_listener($event) { return ctx.searchTerm.set($event); });
            i0.ɵɵelementEnd()()()()()();
            i0.ɵɵtemplate(58, StandardRequestsComponent_Conditional_58_Template, 1, 2, "app-requests-kanban", 36)(59, StandardRequestsComponent_Conditional_59_Template, 3, 0);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(60, StandardRequestsComponent_Conditional_60_Template, 3, 0)(61, StandardRequestsComponent_Conditional_61_Template, 3, 0)(62, StandardRequestsComponent_Conditional_62_Template, 3, 0)(63, StandardRequestsComponent_Conditional_63_Template, 13, 1, "div", 37)(64, StandardRequestsComponent_Conditional_64_Template, 3, 0);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(14);
            i0.ɵɵconditional(ctx.canOperateStandards() ? 14 : -1);
            i0.ɵɵadvance();
            i0.ɵɵproperty("appLockPermission", "standard_request");
            i0.ɵɵadvance(7);
            i0.ɵɵclassMap(ctx.statusFilter() === "ALL" ? "bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50");
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.statusCounts().ALL);
            i0.ɵɵadvance();
            i0.ɵɵclassMap(ctx.statusFilter() === "PENDING_APPROVAL" ? "bg-white dark:bg-slate-800 shadow-sm text-amber-600 dark:text-amber-400" : "text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50");
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.statusCounts().PENDING_APPROVAL);
            i0.ɵɵadvance();
            i0.ɵɵclassMap(ctx.statusFilter() === "IN_PROGRESS" ? "bg-white dark:bg-slate-800 shadow-sm text-emerald-600 dark:text-emerald-400" : "text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50");
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.statusCounts().IN_PROGRESS);
            i0.ɵɵadvance();
            i0.ɵɵclassMap(ctx.statusFilter() === "PENDING_RETURN" ? "bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50");
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.statusCounts().PENDING_RETURN);
            i0.ɵɵadvance();
            i0.ɵɵclassMap(ctx.statusFilter() === "COMPLETED" ? "bg-white dark:bg-slate-800 shadow-sm text-slate-600 dark:text-slate-300" : "text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50");
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.statusCounts().COMPLETED);
            i0.ɵɵadvance(6);
            i0.ɵɵtextInterpolate1("", ctx.filteredRequests().length, " y\u00EAu c\u1EA7u");
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.searchTerm() || ctx.statusFilter() !== "ALL" ? 48 : -1);
            i0.ɵɵadvance(3);
            i0.ɵɵclassMap(ctx.viewMode() === "kanban" ? "bg-white dark:bg-slate-800 text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600");
            i0.ɵɵadvance(2);
            i0.ɵɵclassMap(ctx.viewMode() === "table" ? "bg-white dark:bg-slate-800 text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600");
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("ngModel", ctx.searchTerm());
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.viewMode() === "kanban" ? 58 : 59);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.activeModal() ? 60 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showModal() ? 61 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showPurchaseModal() ? 62 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showPurchaseRequestsAdminModal() ? 63 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showExportModal() ? 64 : -1);
        } }, dependencies: [CommonModule, i1.DatePipe, FormsModule, i2.DefaultValueAccessor, i2.NgControlStatus, i2.NgModel, ReactiveFormsModule, RequestsKanbanComponent, LockPermissionDirective], encapsulation: 2, changeDetection: 0 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadataAsync(StandardRequestsComponent, () => [import("./components/requests-table.component").then(m => m.RequestsTableComponent), import("./components/requests-action-modals.component").then(m => m.RequestsActionModalsComponent), import("./components/create-request-drawer.component").then(m => m.CreateRequestDrawerComponent), import("../components/standards-purchase-modal.component").then(m => m.StandardsPurchaseModalComponent), import("../../../shared/components/export-modal/export-modal.component").then(m => m.ExportModalComponent)], (RequestsTableComponent, RequestsActionModalsComponent, CreateRequestDrawerComponent, StandardsPurchaseModalComponent, ExportModalComponent) => { i0.ɵsetClassMetadata(StandardRequestsComponent, [{
        type: Component,
        args: [{ selector: 'app-standard-requests', standalone: true, imports: [CommonModule, FormsModule, ReactiveFormsModule, RequestsKanbanComponent, RequestsTableComponent, CreateRequestDrawerComponent, RequestsActionModalsComponent, StandardsPurchaseModalComponent, ExportModalComponent, LockPermissionDirective], providers: [DatePipe], changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"requests-page flex flex-col space-y-4 h-full relative p-1 pb-6 overflow-visible\">\r\n      <!-- Header Area -->\r\n      <div class=\"flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 shrink-0\">\r\n        <div class=\"flex items-center gap-3\">\r\n            <div class=\"w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-650 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/30 shadow-sm shrink-0\">\r\n                <i class=\"fa-solid fa-clipboard-list text-base\"></i>\r\n            </div>\r\n            <div>\r\n                <h2 class=\"text-xl font-black text-slate-850 dark:text-slate-100 tracking-tight leading-tight\">Qu\u1EA3n L\u00FD Y\u00EAu C\u1EA7u Ch\u1EA5t Chu\u1EA9n</h2>\r\n                <p class=\"text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5\">Theo d\u00F5i, c\u1EA5p ph\u00E1t v\u00E0 thu h\u1ED3i chu\u1EA9n \u0111\u1ED1i chi\u1EBFu.</p>\r\n            </div>\r\n        </div>\r\n        \r\n        <div class=\"flex flex-wrap gap-2 items-center w-full md:w-auto\">\r\n             <button (click)=\"openExportModal()\" class=\"group px-4 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-2xl shadow-lg shadow-emerald-200 dark:shadow-none transition-all font-black text-xs flex items-center gap-2 active:scale-95\">\r\n                <i class=\"fa-solid fa-file-excel text-sm group-hover:scale-110 transition-transform\"></i> Xu\u1EA5t Excel\r\n             </button>\r\n             @if(canOperateStandards()) {\r\n                 <button (click)=\"openAdminPurchaseRequests()\" class=\"group relative px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl shadow-lg shadow-amber-200 dark:shadow-none transition-all font-black text-sm flex items-center gap-2 active:scale-95\">\r\n                     <i class=\"fa-solid fa-cart-shopping\" [class.animate-bounce]=\"pendingPurchaseRequestsCount() > 0\"></i> Y\u00EAu c\u1EA7u Mua s\u1EAFm\r\n                     @if (pendingPurchaseRequestsCount() > 0) {\r\n                        <div class=\"absolute -top-2 -right-2 px-2 py-0.5 min-w-[24px] h-6 flex items-center justify-center bg-red-600 text-white rounded-full text-xs font-black border-2 border-white dark:border-slate-900 shadow-md\">{{pendingPurchaseRequestsCount()}}</div>\r\n                     }\r\n                 </button>\r\n             }\r\n             <button [appLockPermission]=\"'standard_request'\" (click)=\"openRequestModal()\" class=\"group px-5 py-2.5 bg-slate-900 dark:bg-indigo-600 text-white hover:bg-slate-800 dark:hover:bg-indigo-500 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none transition-all font-black text-sm flex items-center gap-2 active:scale-95\">\r\n                <i class=\"fa-solid fa-plus-circle text-base group-hover:rotate-90 transition-transform\"></i> T\u1EA1o Y\u00EAu C\u1EA7u M\u1EDBi\r\n             </button>\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"flex flex-col flex-1 bg-white dark:bg-slate-800 mx-2 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700 overflow-hidden min-h-0\">\r\n          \r\n          <!-- Modern Tab Filters & Search -->\r\n          <div class=\"p-4 border-b border-slate-50 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md sticky top-0 z-40\">\r\n              <div class=\"flex flex-col lg:flex-row lg:items-center justify-between gap-4\">\r\n                  <!-- Segmented Tabs -->\r\n                  <div class=\"flex items-center gap-1 p-1 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar max-w-full\">\r\n                      <button (click)=\"statusFilter.set('ALL')\" \r\n                              [class]=\"statusFilter() === 'ALL' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50'\"\r\n                              class=\"flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all whitespace-nowrap\">\r\n                          T\u1EA5t C\u1EA3 <span class=\"px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded-md text-xs opacity-70\">{{statusCounts().ALL}}</span>\r\n                      </button>\r\n                      <button (click)=\"statusFilter.set('PENDING_APPROVAL')\" \r\n                              [class]=\"statusFilter() === 'PENDING_APPROVAL' ? 'bg-white dark:bg-slate-800 shadow-sm text-amber-600 dark:text-amber-400' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50'\"\r\n                              class=\"flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all whitespace-nowrap\">\r\n                          Ch\u1EDD Duy\u1EC7t <span class=\"px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 rounded-md text-xs opacity-70 text-amber-600\">{{statusCounts().PENDING_APPROVAL}}</span>\r\n                      </button>\r\n                      <button (click)=\"statusFilter.set('IN_PROGRESS')\" \r\n                              [class]=\"statusFilter() === 'IN_PROGRESS' ? 'bg-white dark:bg-slate-800 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50'\"\r\n                              class=\"flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all whitespace-nowrap\">\r\n                          \u0110ang D\u00F9ng <span class=\"px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md text-xs opacity-70 text-emerald-600\">{{statusCounts().IN_PROGRESS}}</span>\r\n                      </button>\r\n                      <button (click)=\"statusFilter.set('PENDING_RETURN')\" \r\n                              [class]=\"statusFilter() === 'PENDING_RETURN' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50'\"\r\n                              class=\"flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all whitespace-nowrap\">\r\n                          Ch\u1EDD Tr\u1EA3 <span class=\"px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-md text-xs opacity-70 text-indigo-600\">{{statusCounts().PENDING_RETURN}}</span>\r\n                      </button>\r\n                      <button (click)=\"statusFilter.set('COMPLETED')\" \r\n                              [class]=\"statusFilter() === 'COMPLETED' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-600 dark:text-slate-300' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50'\"\r\n                              class=\"flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all whitespace-nowrap\">\r\n                          Ho\u00E0n Th\u00E0nh <span class=\"px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded-md text-xs opacity-70\">{{statusCounts().COMPLETED}}</span>\r\n                      </button>\r\n                  </div>\r\n\r\n                   <!-- Search & View Toggle -->\r\n                   <div class=\"flex flex-col sm:flex-row sm:items-center gap-2 w-full lg:w-auto\">\r\n                        <div class=\"flex items-center justify-between gap-2 min-w-0\">\r\n                            <div class=\"flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-indigo-50/70 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/40 text-xs font-black text-indigo-700 dark:text-indigo-300 whitespace-nowrap\" data-testid=\"request-count\" aria-live=\"polite\">\r\n                                <i class=\"fa-solid fa-list-check text-[10px]\"></i>\r\n                                <span>{{filteredRequests().length}} y\u00EAu c\u1EA7u</span>\r\n                            </div>\r\n                            @if (searchTerm() || statusFilter() !== 'ALL') {\r\n                                <button type=\"button\" (click)=\"clearFilters()\" class=\"px-2.5 py-2 rounded-xl text-xs font-black text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition whitespace-nowrap\" title=\"X\u00F3a b\u1ED9 l\u1ECDc\">\r\n                                    <i class=\"fa-solid fa-filter-circle-xmark mr-1\"></i> X\u00F3a l\u1ECDc\r\n                                </button>\r\n                            }\r\n                        </div>\r\n                        <div class=\"flex items-center gap-2 shrink-0\">\r\n                            <div class=\"flex items-center bg-slate-100/50 dark:bg-slate-900/50 rounded-xl p-1 border border-slate-100 dark:border-slate-800\">\r\n                            <button (click)=\"viewMode.set('kanban')\" [class]=\"viewMode() === 'kanban' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'\" class=\"w-8 h-8 rounded-lg flex items-center justify-center transition-all text-base\" title=\"Giao di\u1EC7n Th\u1EBB (Kanban)\" aria-label=\"Giao di\u1EC7n Th\u1EBB (Kanban)\">\r\n                                <i class=\"fa-solid fa-columns\"></i>\r\n                            </button>\r\n                            <button (click)=\"viewMode.set('table')\" [class]=\"viewMode() === 'table' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'\" class=\"w-8 h-8 rounded-lg flex items-center justify-center transition-all text-base\" title=\"Giao di\u1EC7n B\u1EA3ng (Table)\" aria-label=\"Giao di\u1EC7n B\u1EA3ng (Table)\">\r\n                                <i class=\"fa-solid fa-list\"></i>\r\n                            </button>\r\n                            </div>\r\n                            <div class=\"relative min-w-0 flex-1 sm:w-[250px] sm:flex-none\">\r\n                                <i class=\"fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400\"></i>\r\n                                <input type=\"text\" [ngModel]=\"searchTerm()\" (ngModelChange)=\"searchTerm.set($event)\"\r\n                                       class=\"w-full pl-11 pr-4 py-2 bg-slate-100/50 dark:bg-slate-900/50 border border-transparent rounded-xl text-base font-bold text-slate-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder-slate-400\"\r\n                                       placeholder=\"T\u00ECm t\u00EAn chu\u1EA9n, ng\u01B0\u1EDDi m\u01B0\u1EE3n, s\u1ED1 l\u00F4...\" aria-label=\"T\u00ECm y\u00EAu c\u1EA7u ch\u1EA5t chu\u1EA9n\" data-testid=\"request-search\">\r\n                            </div>\r\n                        </div>\r\n                   </div>\r\n              </div>\r\n          </div>\r\n\r\n          <!-- Content Area based on View Mode -->\r\n          @if(viewMode() === 'kanban') {\r\n              <app-requests-kanban \r\n                  class=\"flex flex-col flex-1 overflow-hidden min-h-0\"\r\n                  [requests]=\"filteredRequests()\"\r\n                  [currentFilter]=\"statusFilter()\"\r\n                  (navigateToStandard)=\"router.navigate(['/standards', $event])\"\r\n                  (actionApprove)=\"approveRequest($event)\"\r\n                  (actionReject)=\"openRejectModal($event)\"\r\n                  (actionLogUsage)=\"openLogUsageModal($event)\"\r\n                  (actionReturn)=\"openReturnModal($event.req, $event.isForce)\"\r\n                  (actionUndoReturn)=\"undoReturn($event)\"\r\n                  (actionAdminReceive)=\"openAdminReceiveModal($event)\"\r\n                  (actionDelete)=\"hardDeleteHistory($event)\">\r\n              </app-requests-kanban>\r\n          } @else {\r\n            @defer {\r\n              <app-requests-table\r\n                  class=\"flex flex-col flex-1 overflow-hidden min-h-0\"\r\n                  [requests]=\"filteredRequests()\"\r\n                  [isLoading]=\"isLoading()\"\r\n                  (navigateToStandard)=\"router.navigate(['/standards', $event])\"\r\n                  (actionApprove)=\"approveRequest($event)\"\r\n                  (actionReject)=\"openRejectModal($event)\"\r\n                  (actionLogUsage)=\"openLogUsageModal($event)\"\r\n                  (actionReturn)=\"openReturnModal($event.req, $event.isForce)\"\r\n                  (actionUndoReturn)=\"undoReturn($event)\"\r\n                  (actionAdminReceive)=\"openAdminReceiveModal($event)\"\r\n                  (actionDelete)=\"hardDeleteHistory($event)\">\r\n              </app-requests-table>\r\n            }\r\n          }\r\n      </div>\r\n\r\n      @if (activeModal()) {\r\n          @defer {\r\n              <app-requests-action-modals\r\n                  [activeModal]=\"activeModal()\"\r\n                  [request]=\"selectedRequest()\"\r\n                  [standard]=\"currentStandard()\"\r\n                  [isForceReturn]=\"isForceReturn()\"\r\n                  [isProcessing]=\"isProcessing()\"\r\n                  (close)=\"closeActionModal()\"\r\n                  (approveAction)=\"confirmApprove($event)\"\r\n                  (rejectAction)=\"confirmReject($event)\"\r\n                  (logUsageAction)=\"confirmLogUsage($event)\"\r\n                  (returnAction)=\"confirmReturn($event)\"\r\n                  (adminReceiveAction)=\"confirmAdminReceive($event)\">\r\n              </app-requests-action-modals>\r\n          }\r\n      }\r\n\r\n      <!-- CREATE REQUEST DRAWER -->\r\n      @if (showModal()) {\r\n          @defer {\r\n              <app-create-request-drawer\r\n                  [isOpen]=\"showModal()\"\r\n                  [isProcessing]=\"isProcessing()\"\r\n                  [availableStandards]=\"availableStandards()\"\r\n                  (close)=\"closeModal()\"\r\n                  (submitRequest)=\"submitRequest($event)\"\r\n                  (requestPurchase)=\"openPurchaseModal($event)\">\r\n              </app-create-request-drawer>\r\n          }\r\n      }\r\n\r\n      <!-- PURCHASE REQUEST MODAL FOR USERS -->\r\n      @if (showPurchaseModal()) {\r\n          @defer {\r\n              <app-standards-purchase-modal\r\n                  [isOpen]=\"showPurchaseModal()\"\r\n                  [selectedStd]=\"selectedPurchaseStd()\"\r\n                  (closeModal)=\"closePurchaseModal()\">\r\n              </app-standards-purchase-modal>\r\n          }\r\n      }\r\n\r\n      <!-- ADMIN PURCHASE REQUESTS MODAL -->\r\n      @if (showPurchaseRequestsAdminModal()) {\r\n         <div class=\"requests-modal-layer fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"admin-purchase-requests-title\">\r\n             <div class=\"bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up\">\r\n                 <div class=\"px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex justify-between items-center shrink-0\">\r\n                     <h3 class=\"font-black text-slate-800 dark:text-slate-100 text-lg flex items-center gap-2\">\r\n                         <div class=\"w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center\">\r\n                             <i class=\"fa-solid fa-cart-shopping\"></i>\r\n                         </div>\r\n                          <span id=\"admin-purchase-requests-title\">Duy\u1EC7t Y\u00EAu C\u1EA7u Mua B\u1ED5 Sung Ch\u1EA5t Chu\u1EA9n</span>\r\n                     </h3>\r\n                     <button (click)=\"closeAdminPurchaseRequests()\" class=\"w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-500 transition active:scale-95\"><i class=\"fa-solid fa-times\"></i></button>\r\n                 </div>\r\n                 <div class=\"flex-1 overflow-auto p-6 bg-slate-50 dark:bg-slate-900\">\r\n                     @if(loadingAdminRequests()) {\r\n                         <div class=\"py-12 flex justify-center\"><i class=\"fa-solid fa-spinner fa-spin text-2xl text-indigo-500\"></i></div>\r\n                     } @else {\r\n                         @if(adminPurchaseRequests().length === 0) {\r\n                             <div class=\"py-12 text-center text-slate-500 dark:text-slate-400 font-medium\">Kh\u00F4ng c\u00F3 y\u00EAu c\u1EA7u mua s\u1EAFm n\u00E0o ch\u1EDD x\u1EED l\u00FD.</div>\r\n                         } @else {\r\n                             <div class=\"bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-x-auto shadow-sm\">\r\n                                 <table class=\"w-full text-left text-base whitespace-nowrap\">\r\n                                     <thead class=\"bg-slate-50 dark:bg-slate-800/80 text-sm uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700\">\r\n                                         <tr>\r\n                                             <th class=\"px-4 py-3\">Ch\u1EA5t chu\u1EA9n \u0111\u1ED1i chi\u1EBFu</th>\r\n                                             <th class=\"px-4 py-3\">Ph\u00E2n lo\u1EA1i & M\u1EE5c \u0111\u00EDch</th>\r\n                                             <th class=\"px-4 py-3\">Y\u00EAu c\u1EA7u mua s\u1EAFm</th>\r\n                                             <th class=\"px-4 py-3\">Ng\u01B0\u1EDDi \u0111\u1EC1 ngh\u1ECB</th>\r\n                                             <th class=\"px-4 py-3 text-center\">T\u00E1c v\u1EE5</th>\r\n                                         </tr>\r\n                                     </thead>\r\n                                     <tbody class=\"divide-y divide-slate-100 dark:divide-slate-800/60\">\r\n                                         @for(r of adminPurchaseRequests(); track r.id) {\r\n                                             <tr class=\"hover:bg-slate-50 dark:hover:bg-slate-800/50 transition\">\r\n                                                 <td class=\"px-4 py-3 align-top\">\r\n                                                     <div class=\"font-bold text-slate-800 dark:text-slate-200 whitespace-normal line-clamp-2 max-w-[200px]\" [title]=\"r.standardName\">{{r.standardName}}</div>\r\n                                                     <div class=\"text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-1\"><i class=\"fa-solid fa-barcode mr-1\"></i> {{r.product_code}}</div>\r\n                                                 </td>\r\n                                                 <td class=\"px-4 py-3 align-top\">\r\n                                                     <div class=\"flex flex-col gap-1.5 text-sm\">\r\n                                                         @if(r.required_level) {\r\n                                                            <div class=\"flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded w-max\">\r\n                                                                <i class=\"fa-solid fa-shield-halved\"></i> {{r.required_level}}\r\n                                                            </div>\r\n                                                         }\r\n                                                         @if(r.required_purity) {\r\n                                                            <div class=\"flex items-center gap-1.5 font-bold text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 px-2 py-0.5 rounded w-max\">\r\n                                                                <i class=\"fa-solid fa-droplet\"></i> \u0110TK: {{r.required_purity}}\r\n                                                            </div>\r\n                                                         }\r\n                                                         @if(r.notes) {\r\n                                                            <div class=\"text-slate-600 dark:text-slate-400 mt-1 max-w-[250px] whitespace-normal italic bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded\" [title]=\"r.notes\">\r\n                                                                <i class=\"fa-regular fa-comment text-slate-400\"></i> {{r.notes}}\r\n                                                            </div>\r\n                                                         }\r\n                                                     </div>\r\n                                                 </td>\r\n                                                 <td class=\"px-4 py-3 align-top\">\r\n                                                     <div class=\"flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300\">\r\n                                                         @if(r.preferred_manufacturer) { \r\n                                                            <div class=\"flex gap-2\">\r\n                                                                <span class=\"w-16 text-slate-400 font-medium\">H\u00E3ng CC:</span>\r\n                                                                <span class=\"font-black text-slate-800 dark:text-slate-100 uppercase\">{{r.preferred_manufacturer}}</span>\r\n                                                            </div> \r\n                                                         }\r\n                                                         @if(r.expectedAmount) { \r\n                                                            <div class=\"flex gap-2\">\r\n                                                                <span class=\"w-16 text-slate-400 font-medium\">L\u01B0\u1EE3ng c\u1EA7n:</span>\r\n                                                                <span class=\"font-bold text-indigo-600 dark:text-indigo-400\">{{r.expectedAmount}}</span>\r\n                                                            </div>\r\n                                                         }\r\n                                                     </div>\r\n                                                 </td>\r\n                                                 <td class=\"px-4 py-3 align-top\">\r\n                                                     <div class=\"flex flex-col gap-1\">\r\n                                                         <div class=\"font-bold text-base text-slate-800 dark:text-slate-200 flex items-center gap-1.5\">\r\n                                                             <div class=\"w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs text-slate-500\"><i class=\"fa-solid fa-user\"></i></div>\r\n                                                             {{r.requestedByName}}\r\n                                                         </div>\r\n                                                         <div class=\"text-sm text-slate-500 ml-6\"><i class=\"fa-regular fa-clock mr-1\"></i> {{r.requestDate | date:'dd/MM/yyyy HH:mm'}}</div>\r\n                                                         @if(r.priority === 'HIGH') {\r\n                                                             <div class=\"ml-6 mt-1\">\r\n                                                                 <span class=\"inline-block px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50 uppercase tracking-widest\"><i class=\"fa-solid fa-bolt mr-1\"></i> G\u1EA4P</span>\r\n                                                             </div>\r\n                                                         }\r\n                                                     </div>\r\n                                                 </td>\r\n                                                  <td class=\"px-4 py-3 text-center align-top\">\r\n                                                      @if(r.status === 'PENDING') {\r\n                                                      <div class=\"flex items-center justify-center gap-2\">\r\n                                                      <button (click)=\"markPurchaseRequestOrdered(r)\" [disabled]=\"isProcessing()\" class=\"px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-bold transition disabled:opacity-50\">\r\n                                                          <i class=\"fa-solid fa-cart-flatbed\"></i> \u0110\u00E3 \u0110\u1EB7t H\u00E0ng\r\n                                                      </button>\r\n                                                      <button (click)=\"rejectPurchaseRequest(r)\" [disabled]=\"isProcessing()\" class=\"px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-lg text-sm font-bold transition disabled:opacity-50\" title=\"T\u1EEB ch\u1ED1i\">\r\n                                                          <i class=\"fa-solid fa-ban\"></i>\r\n                                                      </button>\r\n                                                      </div>\r\n                                                      } @else {\r\n                                                      <div class=\"text-xs font-black text-amber-600 mb-2 uppercase tracking-wider\"><i class=\"fa-solid fa-truck-fast mr-1\"></i> \u0110ang ch\u1EDD nh\u1EADn h\u00E0ng</div>\r\n                                                      <button (click)=\"markPurchaseRequestCompleted(r)\" [disabled]=\"isProcessing()\" class=\"px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-sm shadow-emerald-200 dark:shadow-none transition disabled:opacity-50 active:scale-95 flex items-center gap-1.5 mx-auto\">\r\n                                                          <i class=\"fa-solid fa-check\"></i> \u0110\u00E3 Nh\u1EADn H\u00E0ng\r\n                                                      </button>\r\n                                                      }\r\n                                                  </td>\r\n                                             </tr>\r\n                                         }\r\n                                     </tbody>\r\n                                 </table>\r\n                             </div>\r\n                         }\r\n                     }\r\n                 </div>\r\n             </div>\r\n         </div>\r\n      }\r\n\r\n      <!-- EXPORT MODAL -->\r\n      @if (showExportModal()) {\r\n          @defer {\r\n            <app-export-modal\r\n              title=\"Xu\u1EA5t danh s\u00E1ch y\u00EAu c\u1EA7u ch\u1EA5t chu\u1EA9n\"\r\n              iconClass=\"fa-solid fa-clipboard-list\"\r\n              [subtitle]=\"statusFilter() !== 'ALL' ? getStatusLabel($any(statusFilter())) : ''\"\r\n              [dateRangeText]=\"getExportDateRangeText()\"\r\n              [footerText]=\"getExportableRequests().length + ' b\u1EA3n ghi s\u1EBD \u0111\u01B0\u1EE3c xu\u1EA5t'\"\r\n              [isExporting]=\"isExporting()\"\r\n              [isCompleted]=\"exportCompleted()\"\r\n              (close)=\"closeExportModal()\"\r\n              (execute)=\"runExport()\">\r\n\r\n              <div class=\"px-5 pb-2 pt-4 space-y-4\">\r\n\r\n                  <!-- Active Filters Summary -->\r\n                  @if (statusFilter() !== 'ALL' || searchTerm()) {\r\n                      <div class=\"p-3 bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200/60 dark:border-blue-800/40 rounded-2xl\">\r\n                          <div class=\"text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-1.5\">\r\n                              <i class=\"fa-solid fa-filter text-[9px]\"></i> B\u1ED9 l\u1ECDc \u0111ang \u00E1p d\u1EE5ng\r\n                          </div>\r\n                          <div class=\"flex flex-wrap gap-2\">\r\n                              @if (statusFilter() !== 'ALL') {\r\n                                  <span class=\"px-2.5 py-1 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800/50 rounded-lg text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5\">\r\n                                      <i class=\"fa-solid fa-circle-dot text-[8px]\"></i> {{getStatusLabel($any(statusFilter()))}}\r\n                                  </span>\r\n                              }\r\n                              @if (searchTerm()) {\r\n                                  <span class=\"px-2.5 py-1 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800/50 rounded-lg text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5\">\r\n                                      <i class=\"fa-solid fa-search text-[8px]\"></i> \"{{searchTerm()}}\"\r\n                                  </span>\r\n                              }\r\n                          </div>\r\n                      </div>\r\n                  }\r\n\r\n                  <!-- Date Range Filter -->\r\n                  <div class=\"p-3 bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/50 rounded-2xl\">\r\n                      <div class=\"text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5\">\r\n                          <i class=\"fa-regular fa-calendar text-[9px]\"></i> L\u1ECDc theo kho\u1EA3ng ng\u00E0y y\u00EAu c\u1EA7u (tu\u1EF3 ch\u1ECDn)\r\n                      </div>\r\n                      <div class=\"flex items-center gap-3\">\r\n                          <input type=\"date\" [ngModel]=\"dateRangeFilter().from\" (ngModelChange)=\"dateRangeFilter.set({from: $event, to: dateRangeFilter().to})\"\r\n                                 class=\"flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 outline-none transition [color-scheme:light] dark:[color-scheme:dark]\">\r\n                          <i class=\"fa-solid fa-arrow-right text-slate-300 dark:text-slate-600 text-xs\"></i>\r\n                          <input type=\"date\" [ngModel]=\"dateRangeFilter().to\" (ngModelChange)=\"dateRangeFilter.set({from: dateRangeFilter().from, to: $event})\"\r\n                                 class=\"flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 outline-none transition [color-scheme:light] dark:[color-scheme:dark]\">\r\n                          @if (dateRangeFilter().from || dateRangeFilter().to) {\r\n                              <button (click)=\"dateRangeFilter.set({from:'', to:''})\" class=\"w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-xs\">\r\n                                  <i class=\"fa-solid fa-xmark\"></i>\r\n                              </button>\r\n                          }\r\n                      </div>\r\n                  </div>\r\n\r\n                  <!-- Export Type Selection -->\r\n                  <div class=\"text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5 pt-1\">\r\n                      <i class=\"fa-solid fa-layer-group text-[9px]\"></i> Ch\u1ECDn lo\u1EA1i b\u00E1o c\u00E1o\r\n                  </div>\r\n\r\n                  <!-- 1. D\u1EEF li\u1EC7u g\u1ED1c -->\r\n                  <div class=\"border rounded-2xl overflow-hidden transition-all\"\r\n                       [class]=\"exportType() === 'raw' ? 'border-indigo-200 bg-indigo-50/30 dark:border-indigo-800 dark:bg-indigo-900/20 ring-1 ring-indigo-300/50 dark:ring-indigo-700/30' : 'border-slate-100 dark:border-slate-700'\">\r\n                      <button (click)=\"!isExporting() && exportType.set('raw'); exportCompleted.set(false)\" [disabled]=\"isExporting()\"\r\n                              class=\"w-full flex items-center gap-3.5 p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition\">\r\n                          <div class=\"w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-sm transition-all\"\r\n                               [class]=\"exportType() === 'raw' ? 'bg-indigo-500 text-white shadow-indigo-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'\">\r\n                              <i class=\"fa-solid fa-list\"></i>\r\n                          </div>\r\n                          <div class=\"flex-1 text-left\">\r\n                              <div class=\"text-sm font-black dark:text-slate-200\" [class.text-indigo-700]=\"exportType() === 'raw'\">1. Chi Ti\u1EBFt T\u1EEBng Y\u00EAu C\u1EA7u</div>\r\n                              <div class=\"text-[11px] text-slate-500\">To\u00E0n b\u1ED9 th\u00F4ng tin: chu\u1EA9n, ng\u01B0\u1EDDi m\u01B0\u1EE3n, tr\u1EA1ng th\u00E1i, duy\u1EC7t, tr\u1EA3, l\u01B0\u1EE3ng d\u00F9ng...</div>\r\n                          </div>\r\n                          @if (exportType() === 'raw') {\r\n                              <div class=\"w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0\">\r\n                                  <i class=\"fa-solid fa-check text-[10px]\"></i>\r\n                              </div>\r\n                          }\r\n                      </button>\r\n                  </div>\r\n\r\n                  <!-- 2. By Standard -->\r\n                  <div class=\"border rounded-2xl overflow-hidden transition-all\"\r\n                       [class]=\"exportType() === 'standard' ? 'border-emerald-200 bg-emerald-50/30 dark:border-emerald-800 dark:bg-emerald-900/20 ring-1 ring-emerald-300/50 dark:ring-emerald-700/30' : 'border-slate-100 dark:border-slate-700'\">\r\n                      <button (click)=\"!isExporting() && exportType.set('standard'); exportCompleted.set(false)\" [disabled]=\"isExporting()\"\r\n                              class=\"w-full flex items-center gap-3.5 p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition\">\r\n                          <div class=\"w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-sm transition-all\"\r\n                               [class]=\"exportType() === 'standard' ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'\">\r\n                              <i class=\"fa-solid fa-flask\"></i>\r\n                          </div>\r\n                          <div class=\"flex-1 text-left\">\r\n                              <div class=\"text-sm font-black dark:text-slate-200\" [class.text-emerald-700]=\"exportType() === 'standard'\">2. T\u1ED5ng H\u1EE3p theo Ch\u1EA5t Chu\u1EA9n</div>\r\n                              <div class=\"text-[11px] text-slate-500\">Th\u1ED1ng K\u00EA T\u1ED5ng L\u01B0\u1EE3ng D\u00F9ng, S\u1ED1 L\u01B0\u1EE3t Y\u00EAu C\u1EA7u & Tr\u1EA1ng Th\u00E1i cho T\u1EEBng Chu\u1EA9n</div>\r\n                          </div>\r\n                          @if (exportType() === 'standard') {\r\n                              <div class=\"w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0\">\r\n                                  <i class=\"fa-solid fa-check text-[10px]\"></i>\r\n                              </div>\r\n                          }\r\n                      </button>\r\n                  </div>\r\n\r\n                  <!-- 3. By User -->\r\n                  <div class=\"border rounded-2xl overflow-hidden transition-all\"\r\n                       [class]=\"exportType() === 'user' ? 'border-orange-200 bg-orange-50/30 dark:border-orange-800 dark:bg-orange-900/20 ring-1 ring-orange-300/50 dark:ring-orange-700/30' : 'border-slate-100 dark:border-slate-700'\">\r\n                      <button (click)=\"!isExporting() && exportType.set('user'); exportCompleted.set(false)\" [disabled]=\"isExporting()\"\r\n                              class=\"w-full flex items-center gap-3.5 p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition\">\r\n                          <div class=\"w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-sm transition-all\"\r\n                               [class]=\"exportType() === 'user' ? 'bg-orange-500 text-white shadow-orange-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'\">\r\n                              <i class=\"fa-solid fa-users\"></i>\r\n                          </div>\r\n                          <div class=\"flex-1 text-left\">\r\n                              <div class=\"text-sm font-black dark:text-slate-200\" [class.text-orange-700]=\"exportType() === 'user'\">3. T\u1ED5ng H\u1EE3p theo Nh\u00E2n Vi\u00EAn</div>\r\n                              <div class=\"text-[11px] text-slate-500\">T\u1EA7n Su\u1EA5t M\u01B0\u1EE3n, S\u1ED1 Chu\u1EA9n S\u1EED D\u1EE5ng & T\u1ED5ng L\u01B0\u1EE3ng D\u00F9ng c\u1EE7a T\u1EEBng Nh\u00E2n Vi\u00EAn</div>\r\n                          </div>\r\n                          @if (exportType() === 'user') {\r\n                              <div class=\"w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0\">\r\n                                  <i class=\"fa-solid fa-check text-[10px]\"></i>\r\n                              </div>\r\n                          }\r\n                      </button>\r\n                  </div>\r\n              </div>\r\n\r\n            </app-export-modal>\r\n          }\r\n      }\r\n\r\n    </div>\r\n" }]
    }], () => [], null); }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StandardRequestsComponent, { className: "StandardRequestsComponent", filePath: "src/app/features/standards/requests/standard-requests.component.ts", lineNumber: 37 }); })();
//# sourceMappingURL=standard-requests.component.js.map