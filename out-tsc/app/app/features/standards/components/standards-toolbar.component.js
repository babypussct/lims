import { Component, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LockPermissionDirective } from '../../../shared/directives/lock-permission.directive';
import { StateService } from '../../../core/services/state.service';
import * as i0 from "@angular/core";
function StandardsToolbarComponent_Conditional_10_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 19);
    i0.ɵɵlistener("click", function StandardsToolbarComponent_Conditional_10_Conditional_3_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openBulkTagModal.emit()); });
    i0.ɵɵelement(1, "i", 20);
    i0.ɵɵtext(2, " G\u00E1n nh\u00E3n ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("appLockPermission", "standard_edit")("disabled", ctx_r1.isProcessing());
} }
function StandardsToolbarComponent_Conditional_10_Conditional_4_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 22);
} }
function StandardsToolbarComponent_Conditional_10_Conditional_4_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 23);
} }
function StandardsToolbarComponent_Conditional_10_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 21);
    i0.ɵɵlistener("click", function StandardsToolbarComponent_Conditional_10_Conditional_4_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.deleteSelected.emit()); });
    i0.ɵɵtemplate(1, StandardsToolbarComponent_Conditional_10_Conditional_4_Conditional_1_Template, 1, 0, "i", 22)(2, StandardsToolbarComponent_Conditional_10_Conditional_4_Conditional_2_Template, 1, 0, "i", 23);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("appLockPermission", "standard_edit")("disabled", ctx_r1.isProcessing());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isProcessing() ? 1 : 2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" \u1EA8n ", ctx_r1.selectedCount(), " m\u1EE5c ");
} }
function StandardsToolbarComponent_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 14);
    i0.ɵɵlistener("click", function StandardsToolbarComponent_Conditional_10_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.printSelected.emit()); });
    i0.ɵɵelement(1, "i", 15);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(3, StandardsToolbarComponent_Conditional_10_Conditional_3_Template, 3, 2, "button", 16)(4, StandardsToolbarComponent_Conditional_10_Conditional_4_Template, 4, 4, "button", 17);
    i0.ɵɵelement(5, "div", 18);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("disabled", ctx_r1.isProcessing());
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" In ", ctx_r1.selectedCount(), " nh\u00E3n ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.canEditStandards() || ctx_r1.state.showLockedFeatures() ? 3 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.canEditStandards() || ctx_r1.state.showLockedFeatures() ? 4 : -1);
} }
function StandardsToolbarComponent_Conditional_11_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 27)(1, "button", 31);
    i0.ɵɵlistener("click", function StandardsToolbarComponent_Conditional_11_Conditional_5_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.runMenuAction(ctx_r1.openAddModal)); });
    i0.ɵɵelement(2, "i", 32);
    i0.ɵɵtext(3, " Th\u00EAm M\u1EDBi ");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(4, "div", 33);
    i0.ɵɵelementStart(5, "button", 34);
    i0.ɵɵlistener("click", function StandardsToolbarComponent_Conditional_11_Conditional_5_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r6); i0.ɵɵnextContext(); const fileInput_r7 = i0.ɵɵreference(7); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openFilePicker(fileInput_r7)); });
    i0.ɵɵelement(6, "i", 35);
    i0.ɵɵtext(7, " Import Chu\u1EA9n ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "button", 36);
    i0.ɵɵlistener("click", function StandardsToolbarComponent_Conditional_11_Conditional_5_Template_button_click_8_listener() { i0.ɵɵrestoreView(_r6); i0.ɵɵnextContext(); const usageLogFileInput_r8 = i0.ɵɵreference(9); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openFilePicker(usageLogFileInput_r8)); });
    i0.ɵɵelement(9, "i", 37);
    i0.ɵɵtext(10, " Import Nh\u1EADt K\u00FD ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "button", 38);
    i0.ɵɵlistener("click", function StandardsToolbarComponent_Conditional_11_Conditional_5_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.runMenuAction(ctx_r1.openCleanupModal)); });
    i0.ɵɵelement(12, "i", 39);
    i0.ɵɵtext(13, " Chu\u1EA9n H\u00F3a T\u00EAn Ch\u1EA5t Chu\u1EA9n ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "button", 40);
    i0.ɵɵlistener("click", function StandardsToolbarComponent_Conditional_11_Conditional_5_Template_button_click_14_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.runMenuAction(ctx_r1.openTagManager)); });
    i0.ɵɵelement(15, "i", 41);
    i0.ɵɵtext(16, " Qu\u1EA3n l\u00FD danh m\u1EE5c nh\u00E3n ");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(17, "div", 33);
    i0.ɵɵelementStart(18, "div", 42);
    i0.ɵɵtext(19, "T\u1EA3i nhi\u1EC1u CoA l\u00EAn");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "button", 43);
    i0.ɵɵlistener("click", function StandardsToolbarComponent_Conditional_11_Conditional_5_Template_button_click_20_listener() { i0.ɵɵrestoreView(_r6); i0.ɵɵnextContext(); const bulkCoaFolderInput_r9 = i0.ɵɵreference(11); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openFilePicker(bulkCoaFolderInput_r9)); });
    i0.ɵɵelement(21, "i", 44);
    i0.ɵɵtext(22, " T\u1EEB Th\u01B0 M\u1EE5c ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "button", 43);
    i0.ɵɵlistener("click", function StandardsToolbarComponent_Conditional_11_Conditional_5_Template_button_click_23_listener() { i0.ɵɵrestoreView(_r6); i0.ɵɵnextContext(); const bulkCoaFilesInput_r10 = i0.ɵɵreference(13); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openFilePicker(bulkCoaFilesInput_r10)); });
    i0.ɵɵelement(24, "i", 45);
    i0.ɵɵtext(25, " Ch\u1ECDn T\u1EC7p ");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵproperty("appLockPermission", "standard_edit");
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("appLockPermission", "standard_edit");
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("appLockPermission", "standard_edit");
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("appLockPermission", "standard_edit");
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("appLockPermission", "standard_edit");
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("appLockPermission", "standard_edit");
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("appLockPermission", "standard_edit");
} }
function StandardsToolbarComponent_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 11)(1, "button", 24);
    i0.ɵɵlistener("click", function StandardsToolbarComponent_Conditional_11_Template_button_click_1_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.toggleFunctionMenu($event)); });
    i0.ɵɵelement(2, "i", 25);
    i0.ɵɵtext(3, " Ch\u1EE9c N\u0103ng ");
    i0.ɵɵelement(4, "i", 26);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, StandardsToolbarComponent_Conditional_11_Conditional_5_Template, 26, 7, "div", 27);
    i0.ɵɵelementStart(6, "input", 28, 0);
    i0.ɵɵlistener("change", function StandardsToolbarComponent_Conditional_11_Template_input_change_6_listener($event) { i0.ɵɵrestoreView(_r5); const fileInput_r7 = i0.ɵɵreference(7); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onFileSelect($event, fileInput_r7, "standards")); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "input", 28, 1);
    i0.ɵɵlistener("change", function StandardsToolbarComponent_Conditional_11_Template_input_change_8_listener($event) { i0.ɵɵrestoreView(_r5); const usageLogFileInput_r8 = i0.ɵɵreference(9); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onFileSelect($event, usageLogFileInput_r8, "usageLogs")); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "input", 29, 2);
    i0.ɵɵlistener("change", function StandardsToolbarComponent_Conditional_11_Template_input_change_10_listener($event) { i0.ɵɵrestoreView(_r5); const bulkCoaFolderInput_r9 = i0.ɵɵreference(11); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onBulkCoaSelect($event, bulkCoaFolderInput_r9)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "input", 30, 3);
    i0.ɵɵlistener("change", function StandardsToolbarComponent_Conditional_11_Template_input_change_12_listener($event) { i0.ɵɵrestoreView(_r5); const bulkCoaFilesInput_r10 = i0.ɵɵreference(13); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onBulkCoaSelect($event, bulkCoaFilesInput_r10)); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("appLockPermission", "standard_edit");
    i0.ɵɵattribute("aria-expanded", ctx_r1.functionMenuOpen());
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.functionMenuOpen() ? 5 : -1);
} }
export class StandardsToolbarComponent {
    constructor() {
        this.state = inject(StateService);
        this.elementRef = inject((ElementRef));
        this.functionMenuOpen = signal(false);
        this.selectedCount = input(0);
        this.isProcessing = input(false);
        this.canEditStandards = input(true);
        this.deleteSelected = output();
        this.printSelected = output();
        this.openAddModal = output();
        this.importStandardsFile = output();
        this.importUsageLogFile = output();
        this.bulkCoaSelect = output();
        this.openExportModal = output();
        this.openCleanupModal = output();
        this.openBulkTagModal = output();
        this.openTagManager = output();
    }
    toggleFunctionMenu(event) {
        event.stopPropagation();
        this.functionMenuOpen.update(value => !value);
    }
    runMenuAction(action) {
        this.functionMenuOpen.set(false);
        action.emit();
    }
    openFilePicker(input) {
        this.functionMenuOpen.set(false);
        input.click();
    }
    closeMenuOnOutsideClick(event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.functionMenuOpen.set(false);
        }
    }
    closeMenuOnEscape() {
        this.functionMenuOpen.set(false);
    }
    onFileSelect(event, inputEl, type) {
        if (type === 'standards') {
            this.importStandardsFile.emit(event);
        }
        else {
            this.importUsageLogFile.emit(event);
        }
    }
    onBulkCoaSelect(event, inputEl) {
        this.bulkCoaSelect.emit(event);
    }
    static { this.ɵfac = function StandardsToolbarComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StandardsToolbarComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StandardsToolbarComponent, selectors: [["app-standards-toolbar"]], hostBindings: function StandardsToolbarComponent_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("click", function StandardsToolbarComponent_click_HostBindingHandler($event) { return ctx.closeMenuOnOutsideClick($event); }, false, i0.ɵɵresolveDocument)("keydown.escape", function StandardsToolbarComponent_keydown_escape_HostBindingHandler() { return ctx.closeMenuOnEscape(); }, false, i0.ɵɵresolveDocument);
        } }, inputs: { selectedCount: [1, "selectedCount"], isProcessing: [1, "isProcessing"], canEditStandards: [1, "canEditStandards"] }, outputs: { deleteSelected: "deleteSelected", printSelected: "printSelected", openAddModal: "openAddModal", importStandardsFile: "importStandardsFile", importUsageLogFile: "importUsageLogFile", bulkCoaSelect: "bulkCoaSelect", openExportModal: "openExportModal", openCleanupModal: "openCleanupModal", openBulkTagModal: "openBulkTagModal", openTagManager: "openTagManager" }, decls: 15, vars: 2, consts: [["fileInput", ""], ["usageLogFileInput", ""], ["bulkCoaFolderInput", ""], ["bulkCoaFilesInput", ""], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-4", "shrink-0", "bg-white", "dark:bg-slate-800", "p-4", "rounded-2xl", "border", "border-slate-100", "dark:border-slate-700", "shadow-sm", "dark:shadow-none", "mb-4"], [1, "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-xl", "bg-indigo-50", "dark:bg-indigo-900/30", "text-indigo-600", "dark:text-indigo-400", "flex", "items-center", "justify-center", "border", "border-indigo-100", "dark:border-indigo-800/30", "shadow-sm", "shrink-0"], [1, "fa-solid", "fa-vial-circle-check", "text-base"], [1, "text-xl", "font-black", "text-slate-850", "dark:text-slate-100", "tracking-tight", "leading-tight"], [1, "text-xs", "font-medium", "text-slate-500", "dark:text-slate-400", "mt-0.5"], [1, "flex", "flex-wrap", "gap-2", "items-center", "justify-end"], [1, "relative", "ml-1"], ["title", "Xu\u1EA5t danh s\u00E1ch \u0111ang l\u1ECDc ra t\u1EC7p Excel", 1, "px-3", "py-1.5", "bg-emerald-600", "dark:bg-emerald-500", "text-white", "hover:bg-emerald-700", "dark:hover:bg-emerald-600", "rounded-lg", "shadow-sm", "shadow-emerald-200", "dark:shadow-none", "transition", "font-bold", "text-[11px]", "flex", "items-center", "gap-1.5", 3, "click"], [1, "fa-solid", "fa-file-excel"], [1, "px-3", "py-1.5", "bg-indigo-600", "dark:bg-indigo-500", "text-white", "hover:bg-indigo-700", "dark:hover:bg-indigo-600", "rounded-lg", "shadow-sm", "shadow-indigo-200", "dark:shadow-none", "transition", "font-bold", "text-[11px]", "flex", "items-center", "gap-1.5", "animate-bounce-in", "disabled:opacity-50", 3, "click", "disabled"], [1, "fa-solid", "fa-print"], [1, "px-3", "py-1.5", "bg-fuchsia-600", "dark:bg-fuchsia-500", "text-white", "hover:bg-fuchsia-700", "dark:hover:bg-fuchsia-600", "rounded-lg", "shadow-sm", "shadow-fuchsia-200", "dark:shadow-none", "transition", "font-bold", "text-[11px]", "flex", "items-center", "gap-1.5", "animate-bounce-in", "disabled:opacity-50", 3, "appLockPermission", "disabled"], [1, "px-3", "py-1.5", "bg-red-600", "dark:bg-red-500", "text-white", "hover:bg-red-700", "dark:hover:bg-red-600", "rounded-lg", "shadow-sm", "shadow-red-200", "dark:shadow-none", "transition", "font-bold", "text-[11px]", "flex", "items-center", "gap-1.5", "animate-bounce-in", "disabled:opacity-50", 3, "appLockPermission", "disabled"], [1, "h-5", "w-px", "bg-slate-200", "dark:bg-slate-700", "mx-1"], [1, "px-3", "py-1.5", "bg-fuchsia-600", "dark:bg-fuchsia-500", "text-white", "hover:bg-fuchsia-700", "dark:hover:bg-fuchsia-600", "rounded-lg", "shadow-sm", "shadow-fuchsia-200", "dark:shadow-none", "transition", "font-bold", "text-[11px]", "flex", "items-center", "gap-1.5", "animate-bounce-in", "disabled:opacity-50", 3, "click", "appLockPermission", "disabled"], [1, "fa-solid", "fa-tags"], [1, "px-3", "py-1.5", "bg-red-600", "dark:bg-red-500", "text-white", "hover:bg-red-700", "dark:hover:bg-red-600", "rounded-lg", "shadow-sm", "shadow-red-200", "dark:shadow-none", "transition", "font-bold", "text-[11px]", "flex", "items-center", "gap-1.5", "animate-bounce-in", "disabled:opacity-50", 3, "click", "appLockPermission", "disabled"], [1, "fa-solid", "fa-spinner", "fa-spin"], [1, "fa-solid", "fa-eye-slash"], ["type", "button", "aria-haspopup", "menu", "aria-controls", "standards-function-menu", 1, "px-3", "py-1.5", "bg-indigo-600", "dark:bg-indigo-500", "text-white", "hover:bg-indigo-700", "dark:hover:bg-indigo-600", "rounded-lg", "shadow-sm", "shadow-indigo-200", "dark:shadow-none", "transition", "font-bold", "text-[11px]", "flex", "items-center", "gap-1.5", 3, "click", "appLockPermission"], [1, "fa-solid", "fa-bars"], [1, "fa-solid", "fa-caret-down"], ["id", "standards-function-menu", "role", "menu", 1, "absolute", "right-0", "top-full", "mt-1", "w-56", "max-w-[calc(100vw-2rem)]", "bg-white", "dark:bg-slate-800", "rounded-xl", "shadow-lg", "border", "border-slate-100", "dark:border-slate-700", "z-30", "overflow-hidden", "flex", "flex-col", "p-1", "animate-slide-up"], ["type", "file", "accept", ".xlsx, .xlsm, .csv", 1, "hidden", 3, "change"], ["type", "file", "webkitdirectory", "", "directory", "", "multiple", "", 1, "hidden", 3, "change"], ["type", "file", "multiple", "", "accept", ".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp", 1, "hidden", 3, "change"], ["role", "menuitem", 1, "text-left", "px-3", "py-2", "text-xs", "font-bold", "text-slate-600", "dark:text-slate-300", "hover:bg-indigo-50", "hover:text-indigo-600", "dark:hover:bg-slate-700", "rounded-lg", "transition", "flex", "items-center", "gap-2", 3, "click", "appLockPermission"], [1, "fa-solid", "fa-plus", "text-indigo-500", "w-4"], [1, "h-px", "bg-slate-100", "dark:bg-slate-700", "my-1", "mx-2"], ["role", "menuitem", 1, "text-left", "px-3", "py-2", "text-xs", "font-bold", "text-slate-600", "dark:text-slate-300", "hover:bg-emerald-50", "hover:text-emerald-600", "dark:hover:bg-slate-700", "rounded-lg", "transition", "flex", "items-center", "gap-2", 3, "click", "appLockPermission"], [1, "fa-solid", "fa-file-excel", "text-emerald-500", "w-4"], ["role", "menuitem", 1, "text-left", "px-3", "py-2", "text-xs", "font-bold", "text-slate-600", "dark:text-slate-300", "hover:bg-teal-50", "hover:text-teal-600", "dark:hover:bg-slate-700", "rounded-lg", "transition", "flex", "items-center", "gap-2", 3, "click", "appLockPermission"], [1, "fa-solid", "fa-book-open", "text-teal-500", "w-4"], ["role", "menuitem", 1, "text-left", "px-3", "py-2", "text-xs", "font-bold", "text-slate-600", "dark:text-slate-300", "hover:bg-purple-50", "hover:text-purple-600", "dark:hover:bg-slate-700", "rounded-lg", "transition", "flex", "items-center", "gap-2", 3, "click", "appLockPermission"], [1, "fa-solid", "fa-broom", "text-purple-500", "w-4"], ["role", "menuitem", 1, "text-left", "px-3", "py-2", "text-xs", "font-bold", "text-slate-600", "dark:text-slate-300", "hover:bg-fuchsia-50", "hover:text-fuchsia-600", "dark:hover:bg-slate-700", "rounded-lg", "transition", "flex", "items-center", "gap-2", 3, "click", "appLockPermission"], [1, "fa-solid", "fa-tags", "text-fuchsia-500", "w-4"], [1, "px-3", "py-1", "text-[10px]", "font-black", "text-slate-400", "uppercase", "tracking-widest"], ["role", "menuitem", 1, "text-left", "px-3", "py-2", "text-xs", "font-bold", "text-slate-600", "dark:text-slate-300", "hover:bg-blue-50", "hover:text-blue-600", "dark:hover:bg-slate-700", "rounded-lg", "transition", "flex", "items-center", "gap-2", 3, "click", "appLockPermission"], [1, "fa-solid", "fa-folder-open", "text-amber-500", "w-4", "ml-2"], [1, "fa-regular", "fa-images", "text-blue-500", "w-4", "ml-2"]], template: function StandardsToolbarComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 4)(1, "div", 5)(2, "div", 6);
            i0.ɵɵelement(3, "i", 7);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "div")(5, "h2", 8);
            i0.ɵɵtext(6, "Qu\u1EA3n L\u00FD Ch\u1EA5t Chu\u1EA9n \u0110\u1ED1i Chi\u1EBFu");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "p", 9);
            i0.ɵɵtext(8, "Qu\u1EA3n l\u00FD danh s\u00E1ch ch\u1EA5t chu\u1EA9n, in tem v\u00E0 c\u1EADp nh\u1EADt th\u00F4ng tin l\u00F4 s\u1EA3n xu\u1EA5t.");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(9, "div", 10);
            i0.ɵɵtemplate(10, StandardsToolbarComponent_Conditional_10_Template, 6, 4)(11, StandardsToolbarComponent_Conditional_11_Template, 14, 3, "div", 11);
            i0.ɵɵelementStart(12, "button", 12);
            i0.ɵɵlistener("click", function StandardsToolbarComponent_Template_button_click_12_listener() { return ctx.openExportModal.emit(); });
            i0.ɵɵelement(13, "i", 13);
            i0.ɵɵtext(14, " Xu\u1EA5t Excel ");
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(10);
            i0.ɵɵconditional(ctx.selectedCount() > 0 ? 10 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.canEditStandards() || ctx.state.showLockedFeatures() ? 11 : -1);
        } }, dependencies: [CommonModule, LockPermissionDirective], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StandardsToolbarComponent, [{
        type: Component,
        args: [{
                selector: 'app-standards-toolbar',
                standalone: true,
                imports: [CommonModule, LockPermissionDirective],
                template: `
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm dark:shadow-none mb-4">
      <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/30 shadow-sm shrink-0">
              <i class="fa-solid fa-vial-circle-check text-base"></i>
          </div>
          <div>
              <h2 class="text-xl font-black text-slate-850 dark:text-slate-100 tracking-tight leading-tight">Quản Lý Chất Chuẩn Đối Chiếu</h2>
              <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Quản lý danh sách chất chuẩn, in tem và cập nhật thông tin lô sản xuất.</p>
          </div>
      </div>
      
      <div class="flex flex-wrap gap-2 items-center justify-end">
         @if(selectedCount() > 0) {
              <button (click)="printSelected.emit()" [disabled]="isProcessing()" class="px-3 py-1.5 bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 rounded-lg shadow-sm shadow-indigo-200 dark:shadow-none transition font-bold text-[11px] flex items-center gap-1.5 animate-bounce-in disabled:opacity-50">
                  <i class="fa-solid fa-print"></i> In {{selectedCount()}} nhãn
              </button>
              @if (canEditStandards() || state.showLockedFeatures()) {
                  <button [appLockPermission]="'standard_edit'" (click)="openBulkTagModal.emit()" [disabled]="isProcessing()" class="px-3 py-1.5 bg-fuchsia-600 dark:bg-fuchsia-500 text-white hover:bg-fuchsia-700 dark:hover:bg-fuchsia-600 rounded-lg shadow-sm shadow-fuchsia-200 dark:shadow-none transition font-bold text-[11px] flex items-center gap-1.5 animate-bounce-in disabled:opacity-50">
                      <i class="fa-solid fa-tags"></i> Gán nhãn
                  </button>
              }
              @if (canEditStandards() || state.showLockedFeatures()) {
                  <button [appLockPermission]="'standard_edit'" (click)="deleteSelected.emit()" [disabled]="isProcessing()" class="px-3 py-1.5 bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-600 rounded-lg shadow-sm shadow-red-200 dark:shadow-none transition font-bold text-[11px] flex items-center gap-1.5 animate-bounce-in disabled:opacity-50">
                      @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> } @else { <i class="fa-solid fa-eye-slash"></i> } Ẩn {{selectedCount()}} mục
                  </button>
              }
              <div class="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
         }

         @if(canEditStandards() || state.showLockedFeatures()) {
            <div class="relative ml-1">
                <button
                    [appLockPermission]="'standard_edit'"
                    type="button"
                    aria-haspopup="menu"
                    aria-controls="standards-function-menu"
                    [attr.aria-expanded]="functionMenuOpen()"
                    (click)="toggleFunctionMenu($event)"
                    class="px-3 py-1.5 bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 rounded-lg shadow-sm shadow-indigo-200 dark:shadow-none transition font-bold text-[11px] flex items-center gap-1.5">
                    <i class="fa-solid fa-bars"></i> Chức Năng <i class="fa-solid fa-caret-down"></i>
                </button>
                @if (functionMenuOpen()) {
                  <div id="standards-function-menu" role="menu" class="absolute right-0 top-full mt-1 w-56 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 z-30 overflow-hidden flex flex-col p-1 animate-slide-up">
                    <button role="menuitem" [appLockPermission]="'standard_edit'" (click)="runMenuAction(openAddModal)" class="text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-2">
                        <i class="fa-solid fa-plus text-indigo-500 w-4"></i> Thêm Mới
                    </button>
                    <div class="h-px bg-slate-100 dark:bg-slate-700 my-1 mx-2"></div>
                    <button role="menuitem" [appLockPermission]="'standard_edit'" (click)="openFilePicker(fileInput)" class="text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-2">
                        <i class="fa-solid fa-file-excel text-emerald-500 w-4"></i> Import Chuẩn
                    </button>
                    <button role="menuitem" [appLockPermission]="'standard_edit'" (click)="openFilePicker(usageLogFileInput)" class="text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-teal-50 hover:text-teal-600 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-2">
                        <i class="fa-solid fa-book-open text-teal-500 w-4"></i> Import Nhật Ký
                    </button>
                    <button role="menuitem" [appLockPermission]="'standard_edit'" (click)="runMenuAction(openCleanupModal)" class="text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-2">
                        <i class="fa-solid fa-broom text-purple-500 w-4"></i> Chuẩn Hóa Tên Chất Chuẩn
                    </button>
                    <button role="menuitem" [appLockPermission]="'standard_edit'" (click)="runMenuAction(openTagManager)" class="text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-fuchsia-50 hover:text-fuchsia-600 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-2">
                        <i class="fa-solid fa-tags text-fuchsia-500 w-4"></i> Quản lý danh mục nhãn
                    </button>
                    <div class="h-px bg-slate-100 dark:bg-slate-700 my-1 mx-2"></div>
                    <div class="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tải nhiều CoA lên</div>
                    <button role="menuitem" [appLockPermission]="'standard_edit'" (click)="openFilePicker(bulkCoaFolderInput)" class="text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-2">
                        <i class="fa-solid fa-folder-open text-amber-500 w-4 ml-2"></i> Từ Thư Mục
                    </button>
                    <button role="menuitem" [appLockPermission]="'standard_edit'" (click)="openFilePicker(bulkCoaFilesInput)" class="text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-2">
                        <i class="fa-regular fa-images text-blue-500 w-4 ml-2"></i> Chọn Tệp
                    </button>
                  </div>
                }
                <input #fileInput type="file" class="hidden" accept=".xlsx, .xlsm, .csv" (change)="onFileSelect($event, fileInput, 'standards')">
                <input #usageLogFileInput type="file" class="hidden" accept=".xlsx, .xlsm, .csv" (change)="onFileSelect($event, usageLogFileInput, 'usageLogs')">
                <input #bulkCoaFolderInput type="file" webkitdirectory directory multiple class="hidden" (change)="onBulkCoaSelect($event, bulkCoaFolderInput)">
                <input #bulkCoaFilesInput type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp" class="hidden" (change)="onBulkCoaSelect($event, bulkCoaFilesInput)">
            </div>
         }
         <!-- Xuất Excel — hiển thị cho tất cả user, không cần phân quyền -->
         <button (click)="openExportModal.emit()" title="Xuất danh sách đang lọc ra tệp Excel"
             class="px-3 py-1.5 bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 dark:hover:bg-emerald-600 rounded-lg shadow-sm shadow-emerald-200 dark:shadow-none transition font-bold text-[11px] flex items-center gap-1.5">
             <i class="fa-solid fa-file-excel"></i> Xuất Excel
         </button>
      </div>
    </div>
  `
            }]
    }], null, { closeMenuOnOutsideClick: [{
            type: HostListener,
            args: ['document:click', ['$event']]
        }], closeMenuOnEscape: [{
            type: HostListener,
            args: ['document:keydown.escape']
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StandardsToolbarComponent, { className: "StandardsToolbarComponent", filePath: "src/app/features/standards/components/standards-toolbar.component.ts", lineNumber: 95 }); })();
//# sourceMappingURL=standards-toolbar.component.js.map