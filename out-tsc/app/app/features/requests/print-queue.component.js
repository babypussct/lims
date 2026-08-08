import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import { AuthService } from '../../core/services/auth.service';
import { PrintService } from '../../core/services/print.service';
import { formatDate } from '../../shared/utils/utils';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { FirebaseService } from '../../core/services/firebase.service';
import { getDocs, collection, query, where, documentId } from 'firebase/firestore';
import { ToastService } from '../../core/services/toast.service';
import { timestampToDate } from '../../shared/utils/timestamp';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
const _c0 = () => [1, 2, 3, 4, 5];
const _c1 = a0 => ({ "bg-blue-50 dark:bg-blue-900/20": a0 });
const _forTrack0 = ($index, $item) => $item.id;
function PrintQueueComponent_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 18);
    i0.ɵɵlistener("click", function PrintQueueComponent_Conditional_6_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.deleteSelected()); });
    i0.ɵɵelement(1, "i", 19);
    i0.ɵɵelementStart(2, "span", 20);
    i0.ɵɵtext(3, "X\u00F3a");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("disabled", ctx_r1.selectedLogIds().size === 0);
} }
function PrintQueueComponent_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 7);
} }
function PrintQueueComponent_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 8);
} }
function PrintQueueComponent_Conditional_27_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 21);
    i0.ɵɵelement(2, "app-skeleton", 22);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 15);
    i0.ɵɵelement(4, "app-skeleton", 23)(5, "app-skeleton", 24);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "td", 15);
    i0.ɵɵelement(7, "app-skeleton", 25);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "td", 15);
    i0.ɵɵelement(9, "app-skeleton", 26);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "td", 27);
    i0.ɵɵelement(11, "app-skeleton", 28)(12, "app-skeleton", 28);
    i0.ɵɵelementEnd()();
} }
function PrintQueueComponent_Conditional_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, PrintQueueComponent_Conditional_27_For_1_Template, 13, 0, "tr", null, i0.ɵɵrepeaterTrackByIdentity);
} if (rf & 2) {
    i0.ɵɵrepeater(i0.ɵɵpureFunction0(0, _c0));
} }
function PrintQueueComponent_Conditional_28_For_1_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 38);
    i0.ɵɵlistener("click", function PrintQueueComponent_Conditional_28_For_1_Conditional_15_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r5); const log_r4 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.editBatch(log_r4)); });
    i0.ɵɵelement(1, "i", 39);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "button", 40);
    i0.ɵɵlistener("click", function PrintQueueComponent_Conditional_28_For_1_Conditional_15_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r5); const log_r4 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.deleteSingle(log_r4)); });
    i0.ɵɵelement(3, "i", 41);
    i0.ɵɵelementEnd();
} }
function PrintQueueComponent_Conditional_28_For_1_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr", 29)(1, "td", 30)(2, "input", 14);
    i0.ɵɵlistener("change", function PrintQueueComponent_Conditional_28_For_1_Template_input_change_2_listener() { const log_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.toggleSelection(log_r4.id)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(3, "td", 31)(4, "div", 32);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 33);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "td", 34);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "td", 35);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "td", 36)(13, "button", 37);
    i0.ɵɵlistener("click", function PrintQueueComponent_Conditional_28_For_1_Template_button_click_13_listener() { const log_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.printSingle(log_r4)); });
    i0.ɵɵelement(14, "i", 8);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(15, PrintQueueComponent_Conditional_28_For_1_Conditional_15_Template, 4, 0);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const log_r4 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction1(7, _c1, ctx_r1.selectedLogIds().has(log_r4.id)));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("checked", ctx_r1.selectedLogIds().has(log_r4.id));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", (log_r4.sopBasicInfo == null ? null : log_r4.sopBasicInfo.name) || (log_r4.printData == null ? null : log_r4.printData.sop == null ? null : log_r4.printData.sop.name) || "---", " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", (log_r4.sopBasicInfo == null ? null : log_r4.sopBasicInfo.category) || (log_r4.printData == null ? null : log_r4.printData.sop == null ? null : log_r4.printData.sop.category) || "---", " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(log_r4.user);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.formatDate(log_r4.timestamp));
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.state.isAdmin() ? 15 : -1);
} }
function PrintQueueComponent_Conditional_28_ForEmpty_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 42);
    i0.ɵɵelement(2, "i", 43);
    i0.ɵɵelementStart(3, "p");
    i0.ɵɵtext(4, "Kh\u00F4ng c\u00F3 phi\u1EBFu in n\u00E0o trong h\u00E0ng \u0111\u1EE3i.");
    i0.ɵɵelementEnd()()();
} }
function PrintQueueComponent_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, PrintQueueComponent_Conditional_28_For_1_Template, 16, 9, "tr", 29, _forTrack0, false, PrintQueueComponent_Conditional_28_ForEmpty_2_Template, 5, 0, "tr");
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵrepeater(ctx_r1.filteredLogs());
} }
export class PrintQueueComponent {
    constructor() {
        this.state = inject(StateService);
        this.auth = inject(AuthService);
        this.printService = inject(PrintService);
        this.fb = inject(FirebaseService);
        this.toast = inject(ToastService);
        this.router = inject(Router);
        this.isLoading = signal(true);
        this.isPrinting = signal(false);
        this.selectedLogIds = signal(new Set());
        this.formatDate = formatDate;
        this.filteredLogs = computed(() => {
            const all = this.state.printableLogs();
            const user = this.auth.currentUser();
            if (!user)
                return [];
            if (user.role === 'manager')
                return all;
            return all.filter(log => log.user === user.displayName);
        });
        this.areAllSelected = computed(() => {
            const visibleLogs = this.filteredLogs();
            return visibleLogs.length > 0 && visibleLogs.every(log => this.selectedLogIds().has(log.id));
        });
    }
    ngOnInit() {
        this.state.ensureActivityFeedListeners();
        if (this.state.printableLogs().length > 0) {
            this.isLoading.set(false);
        }
        else {
            setTimeout(() => this.isLoading.set(false), 800);
        }
    }
    toggleSelection(logId) {
        this.selectedLogIds.update(currentSet => {
            const newSet = new Set(currentSet);
            if (newSet.has(logId))
                newSet.delete(logId);
            else
                newSet.add(logId);
            return newSet;
        });
    }
    toggleSelectAll() {
        const visibleIds = this.filteredLogs().map(log => log.id);
        if (this.areAllSelected()) {
            this.selectedLogIds.set(new Set());
        }
        else {
            this.selectedLogIds.set(new Set(visibleIds));
        }
    }
    async fetchPrintData(logs) {
        const jobs = [];
        const jobIdsToFetch = [];
        const mapLogIdToJob = {};
        for (const log of logs) {
            if (log.printData) {
                jobs.push({
                    ...log.printData,
                    date: timestampToDate(log.timestamp) ?? new Date(0),
                    user: log.user,
                    requestId: log.requestId || log.printData.requestId || log.id
                });
            }
            else if (log.printJobId) {
                jobIdsToFetch.push(log.printJobId);
                mapLogIdToJob[log.printJobId] = log.id;
            }
        }
        if (jobIdsToFetch.length > 0) {
            const chunkSize = 30;
            for (let i = 0; i < jobIdsToFetch.length; i += chunkSize) {
                const chunk = jobIdsToFetch.slice(i, i + chunkSize);
                try {
                    const q = query(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/print_jobs`), where(documentId(), 'in', chunk));
                    const snap = await getDocs(q);
                    snap.forEach(d => {
                        const data = d.data();
                        const relatedLogId = mapLogIdToJob[d.id];
                        const originalLog = logs.find(l => l.id === relatedLogId);
                        if (originalLog) {
                            jobs.push({
                                ...data,
                                date: timestampToDate(originalLog.timestamp) ?? new Date(0),
                                user: originalLog.user,
                                requestId: originalLog.requestId || relatedLogId
                            });
                        }
                    });
                }
                catch (e) {
                    console.error("Error fetching print jobs:", e);
                    this.toast.show('Lỗi tải dữ liệu in chi tiết.', 'error');
                }
            }
        }
        return jobs;
    }
    async printSingle(log) {
        this.isPrinting.set(true);
        try {
            const jobs = await this.fetchPrintData([log]);
            if (jobs.length > 0) {
                this.printService.openPreview(jobs); // UPDATED: Open Preview
            }
            else {
                this.toast.show('Không tìm thấy dữ liệu in cho phiếu này.', 'error');
            }
        }
        finally {
            this.isPrinting.set(false);
        }
    }
    async printSelected() {
        const ids = this.selectedLogIds();
        if (ids.size === 0)
            return;
        this.isPrinting.set(true);
        try {
            const logsToPrint = this.filteredLogs().filter(log => ids.has(log.id));
            const jobs = await this.fetchPrintData(logsToPrint);
            if (jobs.length > 0) {
                this.printService.openPreview(jobs); // UPDATED: Open Preview
            }
        }
        finally {
            this.isPrinting.set(false);
        }
    }
    async deleteSingle(log) {
        const sopName = log.sopBasicInfo?.name || log.printData?.sop.name || 'phiếu';
        await this.state.deletePrintLog(log.id, sopName, log.printJobId);
    }
    editBatch(log) {
        if (!log.requestId) {
            this.toast.show('Phiếu in cũ chưa có mã mẻ liên kết để chỉnh sửa.', 'warning');
            return;
        }
        this.router.navigate(['/calculator'], { queryParams: { editRequestId: log.requestId } });
    }
    async deleteSelected() {
        const ids = this.selectedLogIds();
        const logsToDelete = this.filteredLogs().filter(log => ids.has(log.id));
        if (logsToDelete.length > 0) {
            await this.state.deleteSelectedPrintLogs(logsToDelete);
            this.selectedLogIds.set(new Set());
        }
    }
    static { this.ɵfac = function PrintQueueComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PrintQueueComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PrintQueueComponent, selectors: [["app-print-queue"]], decls: 29, vars: 5, consts: [[1, "w-full", "space-y-6", "pb-20", "fade-in", "h-full", "flex", "flex-col"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-4", "shrink-0"], [1, "text-2xl", "font-bold", "text-slate-800", "dark:text-slate-200", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-print", "text-purple-500", "dark:text-purple-400"], [1, "flex", "gap-2"], [1, "px-4", "py-2", "bg-red-600", "dark:bg-red-500", "hover:bg-red-700", "dark:hover:bg-red-600", "text-white", "rounded-lg", "font-bold", "shadow-sm", "dark:shadow-none", "transition", "text-sm", "flex", "items-center", "justify-center", "gap-2", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "disabled"], [1, "px-4", "py-2", "bg-blue-600", "dark:bg-blue-500", "hover:bg-blue-700", "dark:hover:bg-blue-600", "text-white", "rounded-lg", "font-bold", "shadow-sm", "dark:shadow-none", "transition", "text-sm", "flex", "items-center", "justify-center", "gap-2", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "fa-solid", "fa-spinner", "fa-spin"], [1, "fa-solid", "fa-print"], [1, "bg-white", "dark:bg-slate-800", "rounded-xl", "shadow-sm", "border", "border-slate-200", "dark:border-slate-700", "flex-1", "flex", "flex-col", "overflow-hidden"], [1, "flex-1", "overflow-y-auto"], [1, "w-full", "text-sm", "text-left"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "uppercase", "bg-slate-50", "dark:bg-slate-800/50", "sticky", "top-0", "shadow-sm", "dark:shadow-none", "border-b", "border-slate-200", "dark:border-slate-700"], [1, "px-3", "py-3", "w-12", "text-center"], ["type", "checkbox", 1, "w-4", "h-4", "accent-blue-600", "dark:accent-blue-500", "cursor-pointer", 3, "change", "checked"], [1, "px-4", "py-3"], [1, "px-4", "py-3", "text-center"], [1, "divide-y", "divide-slate-100", "dark:divide-slate-700/50"], [1, "px-4", "py-2", "bg-red-600", "dark:bg-red-500", "hover:bg-red-700", "dark:hover:bg-red-600", "text-white", "rounded-lg", "font-bold", "shadow-sm", "dark:shadow-none", "transition", "text-sm", "flex", "items-center", "justify-center", "gap-2", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "fa-solid", "fa-trash-can"], [1, "hidden", "md:inline"], [1, "px-3", "py-3", "text-center"], ["shape", "rect", "width", "16px", "height", "16px", 1, "mx-auto"], ["width", "150px", "height", "14px", 1, "mb-1"], ["width", "80px", "height", "10px"], ["width", "100px", "height", "12px"], ["width", "120px", "height", "12px"], [1, "px-4", "py-3", "text-center", "flex", "justify-center", "gap-2"], ["shape", "rect", "width", "30px", "height", "30px"], [1, "transition", "hover:bg-slate-50", "dark:hover:bg-slate-700/50", 3, "ngClass"], [1, "px-3", "py-2", "text-center"], [1, "px-4", "py-2"], [1, "font-bold", "text-slate-700", "dark:text-slate-200"], [1, "text-xs", "text-slate-400", "dark:text-slate-500"], [1, "px-4", "py-2", "text-slate-600", "dark:text-slate-300", "font-medium"], [1, "px-4", "py-2", "text-slate-500", "dark:text-slate-400", "text-xs"], [1, "px-4", "py-2", "text-center"], ["title", "In phi\u1EBFu n\u00E0y", 1, "text-blue-600", "dark:text-blue-400", "hover:text-blue-800", "dark:hover:text-blue-300", "p-2", "rounded-md", "transition", 3, "click"], ["title", "S\u1EEDa m\u1EBB tr\u01B0\u1EDBc khi in", 1, "text-emerald-600", "dark:text-emerald-400", "hover:text-emerald-800", "dark:hover:text-emerald-300", "p-2", "rounded-md", "transition", 3, "click"], [1, "fa-solid", "fa-pen"], ["title", "X\u00F3a phi\u1EBFu n\u00E0y", 1, "text-red-500", "dark:text-red-400", "hover:text-red-700", "dark:hover:text-red-300", "p-2", "rounded-md", "transition", 3, "click"], [1, "fa-solid", "fa-trash"], ["colspan", "5", 1, "text-center", "py-20", "text-slate-400", "dark:text-slate-500"], [1, "fa-solid", "fa-box-open", "text-4xl", "mb-3", "text-slate-300", "dark:text-slate-600"]], template: function PrintQueueComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "h2", 2);
            i0.ɵɵelement(3, "i", 3);
            i0.ɵɵtext(4, " H\u00E0ng \u0110\u1EE3i In ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "div", 4);
            i0.ɵɵtemplate(6, PrintQueueComponent_Conditional_6_Template, 4, 1, "button", 5);
            i0.ɵɵelementStart(7, "button", 6);
            i0.ɵɵlistener("click", function PrintQueueComponent_Template_button_click_7_listener() { return ctx.printSelected(); });
            i0.ɵɵtemplate(8, PrintQueueComponent_Conditional_8_Template, 1, 0, "i", 7)(9, PrintQueueComponent_Conditional_9_Template, 1, 0, "i", 8);
            i0.ɵɵtext(10, " Xem & In ");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(11, "div", 9)(12, "div", 10)(13, "table", 11)(14, "thead", 12)(15, "tr")(16, "th", 13)(17, "input", 14);
            i0.ɵɵlistener("change", function PrintQueueComponent_Template_input_change_17_listener() { return ctx.toggleSelectAll(); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(18, "th", 15);
            i0.ɵɵtext(19, "Quy tr\u00ECnh (SOP)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "th", 15);
            i0.ɵɵtext(21, "Ng\u01B0\u1EDDi duy\u1EC7t");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "th", 15);
            i0.ɵɵtext(23, "Th\u1EDDi gian duy\u1EC7t");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(24, "th", 16);
            i0.ɵɵtext(25, "H\u00E0nh \u0111\u1ED9ng");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(26, "tbody", 17);
            i0.ɵɵtemplate(27, PrintQueueComponent_Conditional_27_Template, 2, 1)(28, PrintQueueComponent_Conditional_28_Template, 3, 1);
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(6);
            i0.ɵɵconditional(ctx.state.isAdmin() ? 6 : -1);
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", ctx.selectedLogIds().size === 0 || ctx.isPrinting());
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.isPrinting() ? 8 : 9);
            i0.ɵɵadvance(9);
            i0.ɵɵproperty("checked", ctx.areAllSelected());
            i0.ɵɵadvance(10);
            i0.ɵɵconditional(ctx.isLoading() ? 27 : 28);
        } }, dependencies: [CommonModule, i1.NgClass, SkeletonComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PrintQueueComponent, [{
        type: Component,
        args: [{
                selector: 'app-print-queue',
                standalone: true,
                imports: [CommonModule, SkeletonComponent],
                template: `
    <div class="w-full space-y-6 pb-20 fade-in h-full flex flex-col">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
            <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <i class="fa-solid fa-print text-purple-500 dark:text-purple-400"></i> Hàng Đợi In
            </h2>
            
            <div class="flex gap-2">
               @if(state.isAdmin()) {
                 <button (click)="deleteSelected()" [disabled]="selectedLogIds().size === 0"
                    class="px-4 py-2 bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 text-white rounded-lg font-bold shadow-sm dark:shadow-none transition text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <i class="fa-solid fa-trash-can"></i> <span class="hidden md:inline">Xóa</span>
                 </button>
               }
               
               <button (click)="printSelected()" [disabled]="selectedLogIds().size === 0 || isPrinting()"
                  class="px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-bold shadow-sm dark:shadow-none transition text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  @if(isPrinting()) { <i class="fa-solid fa-spinner fa-spin"></i> } 
                  @else { <i class="fa-solid fa-print"></i> } Xem & In
               </button>
            </div>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex-1 flex flex-col overflow-hidden">
            <div class="flex-1 overflow-y-auto">
                <table class="w-full text-sm text-left">
                    <thead class="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 sticky top-0 shadow-sm dark:shadow-none border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th class="px-3 py-3 w-12 text-center">
                               <input type="checkbox" [checked]="areAllSelected()" (change)="toggleSelectAll()" class="w-4 h-4 accent-blue-600 dark:accent-blue-500 cursor-pointer">
                            </th>
                            <th class="px-4 py-3">Quy trình (SOP)</th>
                            <th class="px-4 py-3">Người duyệt</th>
                            <th class="px-4 py-3">Thời gian duyệt</th>
                            <th class="px-4 py-3 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
                        @if(isLoading()) {
                            @for(i of [1,2,3,4,5]; track i) {
                                <tr>
                                    <td class="px-3 py-3 text-center"><app-skeleton shape="rect" width="16px" height="16px" class="mx-auto"></app-skeleton></td>
                                    <td class="px-4 py-3">
                                        <app-skeleton width="150px" height="14px" class="mb-1"></app-skeleton>
                                        <app-skeleton width="80px" height="10px"></app-skeleton>
                                    </td>
                                    <td class="px-4 py-3"><app-skeleton width="100px" height="12px"></app-skeleton></td>
                                    <td class="px-4 py-3"><app-skeleton width="120px" height="12px"></app-skeleton></td>
                                    <td class="px-4 py-3 text-center flex justify-center gap-2">
                                        <app-skeleton shape="rect" width="30px" height="30px"></app-skeleton>
                                        <app-skeleton shape="rect" width="30px" height="30px"></app-skeleton>
                                    </td>
                                </tr>
                            }
                        } @else {
                            @for (log of filteredLogs(); track log.id) {
                                <tr class="transition hover:bg-slate-50 dark:hover:bg-slate-700/50" [ngClass]="{'bg-blue-50 dark:bg-blue-900/20': selectedLogIds().has(log.id)}">
                                    <td class="px-3 py-2 text-center">
                                    <input type="checkbox" [checked]="selectedLogIds().has(log.id)" (change)="toggleSelection(log.id)" class="w-4 h-4 accent-blue-600 dark:accent-blue-500 cursor-pointer">
                                    </td>
                                    <td class="px-4 py-2">
                                        <div class="font-bold text-slate-700 dark:text-slate-200">
                                            {{ log.sopBasicInfo?.name || log.printData?.sop?.name || '---' }}
                                        </div>
                                        <div class="text-xs text-slate-400 dark:text-slate-500">
                                            {{ log.sopBasicInfo?.category || log.printData?.sop?.category || '---' }}
                                        </div>
                                    </td>
                                    <td class="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium">{{log.user}}</td>
                                    <td class="px-4 py-2 text-slate-500 dark:text-slate-400 text-xs">{{formatDate(log.timestamp)}}</td>
                                    <td class="px-4 py-2 text-center">
                                        <button (click)="printSingle(log)" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-2 rounded-md transition" title="In phiếu này">
                                            <i class="fa-solid fa-print"></i>
                                        </button>
                                        @if (state.isAdmin()) {
                                            <button (click)="editBatch(log)" class="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 p-2 rounded-md transition" title="Sửa mẻ trước khi in">
                                                <i class="fa-solid fa-pen"></i>
                                            </button>
                                            <button (click)="deleteSingle(log)" class="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-2 rounded-md transition" title="Xóa phiếu này">
                                                <i class="fa-solid fa-trash"></i>
                                            </button>
                                        }
                                    </td>
                                </tr>
                            } @empty {
                                <tr>
                                    <td colspan="5" class="text-center py-20 text-slate-400 dark:text-slate-500">
                                        <i class="fa-solid fa-box-open text-4xl mb-3 text-slate-300 dark:text-slate-600"></i>
                                        <p>Không có phiếu in nào trong hàng đợi.</p>
                                    </td>
                                </tr>
                            }
                        }
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  `
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PrintQueueComponent, { className: "PrintQueueComponent", filePath: "src/app/features/requests/print-queue.component.ts", lineNumber: 120 }); })();
//# sourceMappingURL=print-queue.component.js.map