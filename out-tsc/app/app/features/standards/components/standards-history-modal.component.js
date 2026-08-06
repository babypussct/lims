import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../../core/services/state.service';
import { formatNum } from '../../../shared/utils/utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
const _forTrack0 = ($index, $item) => $item.id;
function StandardsHistoryModalComponent_Conditional_0_Conditional_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 13);
    i0.ɵɵtext(1, "T\u00E1c v\u1EE5");
    i0.ɵɵelementEnd();
} }
function StandardsHistoryModalComponent_Conditional_0_Conditional_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 16);
    i0.ɵɵelement(2, "i", 17);
    i0.ɵɵtext(3, " \u0110ang t\u1EA3i...");
    i0.ɵɵelementEnd()();
} }
function StandardsHistoryModalComponent_Conditional_0_Conditional_25_For_1_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 21);
    i0.ɵɵelement(1, "i", 27);
    i0.ɵɵtext(2, "Nh\u1EADp b\u00F9 ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const log_r3 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("title", "Nh\u1EADp b\u1EDFi " + (log_r3.backfilledByName || "Qu\u1EA3n l\u00FD"));
} }
function StandardsHistoryModalComponent_Conditional_0_Conditional_25_For_1_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "td", 26)(1, "button", 28);
    i0.ɵɵlistener("click", function StandardsHistoryModalComponent_Conditional_0_Conditional_25_For_1_Conditional_16_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r4); const log_r3 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.onDeleteLog(log_r3)); });
    i0.ɵɵelement(2, "i", 29);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.isProcessing());
} }
function StandardsHistoryModalComponent_Conditional_0_Conditional_25_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 18)(1, "td", 19);
    i0.ɵɵtext(2);
    i0.ɵɵpipe(3, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "td", 11)(5, "div", 20);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(7, StandardsHistoryModalComponent_Conditional_0_Conditional_25_For_1_Conditional_7_Template, 3, 1, "div", 21);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "td", 11)(9, "div", 22);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "td", 23)(12, "span", 24);
    i0.ɵɵtext(13);
    i0.ɵɵelementStart(14, "span", 25);
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(16, StandardsHistoryModalComponent_Conditional_0_Conditional_25_For_1_Conditional_16_Template, 3, 1, "td", 26);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    let tmp_18_0;
    const log_r3 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(3, 8, log_r3.date, "dd/MM/yyyy"));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(log_r3.user);
    i0.ɵɵadvance();
    i0.ɵɵconditional(log_r3.isBackfill ? 7 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("title", log_r3.purpose || "");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(log_r3.purpose || "N/A");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("-", ctx_r1.formatNum(log_r3.amount_used), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(log_r3.unit || ((tmp_18_0 = ctx_r1.historyStd()) == null ? null : tmp_18_0.unit));
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.state.isAdmin() ? 16 : -1);
} }
function StandardsHistoryModalComponent_Conditional_0_Conditional_25_ForEmpty_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 30);
    i0.ɵɵtext(2, "Ch\u01B0a c\u00F3 d\u1EEF li\u1EC7u.");
    i0.ɵɵelementEnd()();
} }
function StandardsHistoryModalComponent_Conditional_0_Conditional_25_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, StandardsHistoryModalComponent_Conditional_0_Conditional_25_For_1_Template, 17, 11, "tr", 18, _forTrack0, false, StandardsHistoryModalComponent_Conditional_0_Conditional_25_ForEmpty_2_Template, 3, 0, "tr");
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵrepeater(ctx_r1.historyLogs());
} }
function StandardsHistoryModalComponent_Conditional_0_Conditional_26_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 32);
    i0.ɵɵtext(1, " \u0110ang t\u1EA3i... ");
} }
function StandardsHistoryModalComponent_Conditional_0_Conditional_26_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " T\u1EA3i th\u00EAm l\u1ECBch s\u1EED ");
} }
function StandardsHistoryModalComponent_Conditional_0_Conditional_26_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 15)(1, "button", 31);
    i0.ɵɵlistener("click", function StandardsHistoryModalComponent_Conditional_0_Conditional_26_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.loadMoreHistoryEvent.emit()); });
    i0.ɵɵtemplate(2, StandardsHistoryModalComponent_Conditional_0_Conditional_26_Conditional_2_Template, 2, 0)(3, StandardsHistoryModalComponent_Conditional_0_Conditional_26_Conditional_3_Template, 1, 0);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.loadingMoreHistory());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.loadingMoreHistory() ? 2 : 3);
} }
function StandardsHistoryModalComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div")(4, "h3", 3);
    i0.ɵɵtext(5, "L\u1ECBch S\u1EED S\u1EED D\u1EE5ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 4);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "button", 5);
    i0.ɵɵlistener("click", function StandardsHistoryModalComponent_Conditional_0_Template_button_click_8_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onClose()); });
    i0.ɵɵelement(9, "i", 6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "div", 7)(11, "table", 8)(12, "thead", 9)(13, "tr")(14, "th", 10);
    i0.ɵɵtext(15, "Th\u1EDDi gian");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "th", 11);
    i0.ɵɵtext(17, "Ng\u01B0\u1EDDi th\u1EF1c hi\u1EC7n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "th", 11);
    i0.ɵɵtext(19, "M\u1EE5c \u0111\u00EDch");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "th", 12);
    i0.ɵɵtext(21, "L\u01B0\u1EE3ng d\u00F9ng");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(22, StandardsHistoryModalComponent_Conditional_0_Conditional_22_Template, 2, 0, "th", 13);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(23, "tbody", 14);
    i0.ɵɵtemplate(24, StandardsHistoryModalComponent_Conditional_0_Conditional_24_Template, 4, 0, "tr")(25, StandardsHistoryModalComponent_Conditional_0_Conditional_25_Template, 3, 1);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(26, StandardsHistoryModalComponent_Conditional_0_Conditional_26_Template, 4, 2, "div", 15);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    let tmp_1_0;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate((tmp_1_0 = ctx_r1.historyStd()) == null ? null : tmp_1_0.name);
    i0.ɵɵadvance(15);
    i0.ɵɵconditional(ctx_r1.state.isAdmin() ? 22 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.loadingHistory() ? 24 : 25);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.hasMoreHistory() ? 26 : -1);
} }
export class StandardsHistoryModalComponent {
    constructor() {
        this.state = inject(StateService);
        this.historyStd = input(null);
        this.historyLogs = input([]);
        this.loadingHistory = input(false);
        this.isProcessing = input(false);
        this.hasMoreHistory = input(false);
        this.loadingMoreHistory = input(false);
        this.closeModal = output();
        this.deleteLogEvent = output();
        this.loadMoreHistoryEvent = output();
        this.formatNum = formatNum;
    }
    onClose() {
        this.closeModal.emit();
    }
    onDeleteLog(log) {
        this.deleteLogEvent.emit(log);
    }
    static { this.ɵfac = function StandardsHistoryModalComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StandardsHistoryModalComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StandardsHistoryModalComponent, selectors: [["app-standards-history-modal"]], inputs: { historyStd: [1, "historyStd"], historyLogs: [1, "historyLogs"], loadingHistory: [1, "loadingHistory"], isProcessing: [1, "isProcessing"], hasMoreHistory: [1, "hasMoreHistory"], loadingMoreHistory: [1, "loadingMoreHistory"] }, outputs: { closeModal: "closeModal", deleteLogEvent: "deleteLogEvent", loadMoreHistoryEvent: "loadMoreHistoryEvent" }, decls: 1, vars: 1, consts: [[1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "p-4", "bg-slate-900/50", "backdrop-blur-sm", "fade-in"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "shadow-xl", "w-full", "max-w-5xl", "overflow-hidden", "flex", "flex-col", "max-h-[85vh]"], [1, "p-6", "border-b", "border-slate-100", "dark:border-slate-800", "bg-slate-50/50", "dark:bg-slate-800/50", "flex", "justify-between", "items-center", "shrink-0"], [1, "font-bold", "text-slate-800", "dark:text-slate-200", "text-lg"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "font-mono"], [1, "text-slate-400", "dark:text-slate-500", "hover:text-slate-600", "dark:hover:text-slate-300", "transition", 3, "click"], [1, "fa-solid", "fa-times", "text-xl"], [1, "flex-1", "overflow-y-auto", "p-0", "custom-scrollbar"], [1, "w-full", "text-sm", "text-left"], [1, "bg-slate-50", "dark:bg-slate-800/50", "text-xs", "font-bold", "text-slate-500", "dark:text-slate-400", "uppercase", "sticky", "top-0", "border-b", "border-slate-100", "dark:border-slate-800", "shadow-sm"], [1, "px-6", "py-4", "w-32"], [1, "px-6", "py-4"], [1, "px-6", "py-4", "text-right", "w-32"], [1, "px-6", "py-4", "text-center", "w-24"], [1, "divide-y", "divide-slate-50", "dark:divide-slate-800/50"], [1, "p-4", "text-center", "border-t", "border-slate-100", "dark:border-slate-800"], ["colspan", "5", 1, "p-8", "text-center", "text-slate-400", "dark:text-slate-500"], [1, "fa-solid", "fa-spinner", "fa-spin"], [1, "hover:bg-slate-50", "dark:hover:bg-slate-800/50", "transition", "group"], [1, "px-6", "py-4", "text-slate-600", "dark:text-slate-400", "font-mono", "text-xs"], [1, "font-bold", "text-slate-700", "dark:text-slate-300", "text-xs"], [1, "mt-1", "text-[9px]", "font-black", "uppercase", "tracking-wider", "text-purple-600", "dark:text-purple-400", 3, "title"], [1, "text-slate-600", "dark:text-slate-400", "text-xs", "italic", "line-clamp-2", 3, "title"], [1, "px-6", "py-4", "text-right"], [1, "font-bold", "text-red-600", "dark:text-red-400", "bg-red-50", "dark:bg-red-900/20", "px-2", "py-1", "rounded", "text-xs"], [1, "text-[9px]", "text-slate-500", "dark:text-slate-400"], [1, "px-6", "py-4", "text-center"], [1, "fa-solid", "fa-clock-rotate-left", "mr-1"], [1, "text-red-500", "dark:text-red-400", "hover:text-red-700", "dark:hover:text-red-300", "p-2", "disabled:opacity-50", 3, "click", "disabled"], [1, "fa-solid", "fa-trash"], ["colspan", "5", 1, "p-8", "text-center", "text-slate-400", "dark:text-slate-500", "italic"], [1, "px-4", "py-2", "rounded-full", "border", "border-slate-200", "dark:border-slate-700", "text-xs", "font-bold", "text-slate-600", "dark:text-slate-300", "hover:text-indigo-600", "hover:border-indigo-300", "disabled:opacity-50", "transition", 3, "click", "disabled"], [1, "fa-solid", "fa-spinner", "fa-spin", "mr-1"]], template: function StandardsHistoryModalComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, StandardsHistoryModalComponent_Conditional_0_Template, 27, 4, "div", 0);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.historyStd() ? 0 : -1);
        } }, dependencies: [CommonModule, i1.DatePipe], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StandardsHistoryModalComponent, [{
        type: Component,
        args: [{
                selector: 'app-standards-history-modal',
                standalone: true,
                imports: [CommonModule],
                template: `
      @if (historyStd()) {
         <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[85vh]">
               <div class="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center shrink-0">
                  <div><h3 class="font-bold text-slate-800 dark:text-slate-200 text-lg">Lịch Sử Sử Dụng</h3><p class="text-xs text-slate-500 dark:text-slate-400 font-mono">{{historyStd()?.name}}</p></div>
                  <button (click)="onClose()" class="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition"><i class="fa-solid fa-times text-xl"></i></button>
               </div>
               <div class="flex-1 overflow-y-auto p-0 custom-scrollbar">
                  <table class="w-full text-sm text-left">
                    <thead class="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase sticky top-0 border-b border-slate-100 dark:border-slate-800 shadow-sm">
                        <tr>
                            <th class="px-6 py-4 w-32">Thời gian</th>
                            <th class="px-6 py-4">Người thực hiện</th>
                            <th class="px-6 py-4">Mục đích</th>
                            <th class="px-6 py-4 text-right w-32">Lượng dùng</th>
                            @if(state.isAdmin()){<th class="px-6 py-4 text-center w-24">Tác vụ</th>}
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
                        @if (loadingHistory()) { 
                            <tr><td colspan="5" class="p-8 text-center text-slate-400 dark:text-slate-500"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải...</td></tr> 
                        } @else {
                            @for (log of historyLogs(); track log.id) { 
                                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition group"> 
                                    <td class="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono text-xs">{{ log.date | date:'dd/MM/yyyy' }}</td>
                                    <td class="px-6 py-4">
                                        <div class="font-bold text-slate-700 dark:text-slate-300 text-xs">{{ log.user }}</div>
                                        @if(log.isBackfill) {
                                            <div class="mt-1 text-[9px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400" [title]="'Nhập bởi ' + (log.backfilledByName || 'Quản lý')">
                                                <i class="fa-solid fa-clock-rotate-left mr-1"></i>Nhập bù
                                            </div>
                                        }
                                    </td>
                                    <td class="px-6 py-4"><div class="text-slate-600 dark:text-slate-400 text-xs italic line-clamp-2" [title]="log.purpose || ''">{{ log.purpose || 'N/A' }}</div></td>
                                    <td class="px-6 py-4 text-right"><span class="font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded text-xs">-{{ formatNum(log.amount_used) }} <span class="text-[9px] text-slate-500 dark:text-slate-400">{{log.unit || historyStd()?.unit}}</span></span></td>
                                    @if(state.isAdmin()){
                                        <td class="px-6 py-4 text-center"><button (click)="onDeleteLog(log)" [disabled]="isProcessing()" class="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-2 disabled:opacity-50"><i class="fa-solid fa-trash"></i></button></td>
                                    }
                                </tr> 
                        } @empty {
                                <tr><td colspan="5" class="p-8 text-center text-slate-400 dark:text-slate-500 italic">Chưa có dữ liệu.</td></tr> 
                            }
                        }
                  </tbody></table>
                  @if(hasMoreHistory()) {
                    <div class="p-4 text-center border-t border-slate-100 dark:border-slate-800">
                      <button (click)="loadMoreHistoryEvent.emit()" [disabled]="loadingMoreHistory()" class="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-50 transition">
                        @if(loadingMoreHistory()) { <i class="fa-solid fa-spinner fa-spin mr-1"></i> Đang tải... } @else { Tải thêm lịch sử }
                      </button>
                    </div>
                  }
               </div>
            </div>
         </div>
      }
  `
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StandardsHistoryModalComponent, { className: "StandardsHistoryModalComponent", filePath: "src/app/features/standards/components/standards-history-modal.component.ts", lineNumber: 69 }); })();
//# sourceMappingURL=standards-history-modal.component.js.map