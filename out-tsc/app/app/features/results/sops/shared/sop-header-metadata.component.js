import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _c0 = [[["", "sop-metadata-extra", ""]]];
const _c1 = ["[sop-metadata-extra]"];
const _forTrack0 = ($index, $item) => $item.key;
function SopHeaderMetadataComponent_Conditional_15_For_2_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "label", 10)(1, "input", 11);
    i0.ɵɵtwoWayListener("ngModelChange", function SopHeaderMetadataComponent_Conditional_15_For_2_Conditional_0_Template_input_ngModelChange_1_listener($event) { i0.ɵɵrestoreView(_r1); const checkbox_r2 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r2.draft.page1Data[checkbox_r2.key], $event) || (ctx_r2.draft.page1Data[checkbox_r2.key] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopHeaderMetadataComponent_Conditional_15_For_2_Conditional_0_Template_input_ngModelChange_1_listener() { i0.ɵɵrestoreView(_r1); const checkbox_r2 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.onCheckboxChange(checkbox_r2.key)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "div")(3, "span", 12);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const checkbox_r2 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("cursor-pointer", !ctx_r2.isReadOnly)("cursor-not-allowed", ctx_r2.isReadOnly);
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.draft.page1Data[checkbox_r2.key]);
    i0.ɵɵproperty("disabled", ctx_r2.isReadOnly);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(checkbox_r2.label);
} }
function SopHeaderMetadataComponent_Conditional_15_For_2_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 9)(1, "div", 13)(2, "span", 14);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "div", 15)(5, "button", 16);
    i0.ɵɵlistener("click", function SopHeaderMetadataComponent_Conditional_15_For_2_Conditional_1_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r4); const checkbox_r2 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.setQcStatus(checkbox_r2.key, true)); });
    i0.ɵɵtext(6, " \u0110\u1EA1t ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "button", 17);
    i0.ɵɵlistener("click", function SopHeaderMetadataComponent_Conditional_15_For_2_Conditional_1_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r4); const checkbox_r2 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.setQcStatus(checkbox_r2.key, false)); });
    i0.ɵɵtext(8, " K.\u0110\u1EA1t ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "button", 18);
    i0.ɵɵlistener("click", function SopHeaderMetadataComponent_Conditional_15_For_2_Conditional_1_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r4); const checkbox_r2 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.setQcStatus(checkbox_r2.key, null)); });
    i0.ɵɵtext(10, " N/A ");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const checkbox_r2 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", checkbox_r2.label, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r2.draft.page1Data[checkbox_r2.key] === true ? "px-2.5 py-1 text-[10px] font-black rounded bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs transition duration-150 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed" : "px-2.5 py-1 text-[10px] font-bold rounded text-slate-550 dark:text-slate-400 hover:text-slate-750 dark:hover:text-slate-200 transition duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed");
    i0.ɵɵproperty("disabled", ctx_r2.isReadOnly);
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r2.draft.page1Data[checkbox_r2.key] === false ? "px-2.5 py-1 text-[10px] font-black rounded bg-rose-500 hover:bg-rose-600 text-white shadow-xs transition duration-150 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed" : "px-2.5 py-1 text-[10px] font-bold rounded text-slate-550 dark:text-slate-400 hover:text-slate-750 dark:hover:text-slate-200 transition duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed");
    i0.ɵɵproperty("disabled", ctx_r2.isReadOnly);
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r2.draft.page1Data[checkbox_r2.key] === undefined || ctx_r2.draft.page1Data[checkbox_r2.key] === null ? "px-2 py-1 text-[9px] font-black rounded bg-slate-350 dark:bg-slate-700 text-slate-750 dark:text-slate-250 shadow-xs transition duration-150 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed" : "px-2 py-1 text-[9px] font-bold rounded text-slate-455 dark:text-slate-500 hover:text-slate-600 transition duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed");
    i0.ɵɵproperty("disabled", ctx_r2.isReadOnly);
} }
function SopHeaderMetadataComponent_Conditional_15_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, SopHeaderMetadataComponent_Conditional_15_For_2_Conditional_0_Template, 5, 7, "label", 8)(1, SopHeaderMetadataComponent_Conditional_15_For_2_Conditional_1_Template, 11, 10, "div", 9);
} if (rf & 2) {
    const checkbox_r2 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵconditional(!ctx_r2.isQcField(checkbox_r2.key) ? 0 : 1);
} }
function SopHeaderMetadataComponent_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 7);
    i0.ɵɵrepeaterCreate(1, SopHeaderMetadataComponent_Conditional_15_For_2_Template, 2, 1, null, null, _forTrack0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r2.checkboxList);
} }
export class SopHeaderMetadataComponent {
    constructor() {
        this.title = 'Thông tin chung & Đánh giá';
        this.checkboxList = [];
        this.isReadOnly = false;
        this.draftChanged = new EventEmitter();
    }
    isQcField(key) {
        return key.startsWith('qc');
    }
    setQcStatus(key, value) {
        if (this.isReadOnly)
            return;
        this.draft.page1Data[key] = value;
        this.onDataChanged();
    }
    onCheckboxChange(changedKey) {
        if (this.isReadOnly)
            return;
        if (changedKey === 'checkTatCaND' && this.draft.page1Data['checkTatCaND']) {
            this.draft.page1Data['checkCoMauPhatHien'] = false;
            if (this.draft.page1Data['qcNhanDang'] !== undefined) {
                this.draft.page1Data['qcNhanDang'] = null; // Reset to N/A
            }
        }
        else if (changedKey === 'checkCoMauPhatHien' && this.draft.page1Data['checkCoMauPhatHien']) {
            this.draft.page1Data['checkTatCaND'] = false;
            if (this.draft.page1Data['qcNhanDang'] !== undefined) {
                this.draft.page1Data['qcNhanDang'] = true; // Auto check "Đạt"
            }
        }
        this.onDataChanged();
    }
    onDataChanged() {
        this.draftChanged.emit(this.draft);
    }
    static { this.ɵfac = function SopHeaderMetadataComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SopHeaderMetadataComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: SopHeaderMetadataComponent, selectors: [["app-sop-header-metadata"]], inputs: { title: "title", draft: "draft", checkboxList: "checkboxList", isReadOnly: "isReadOnly" }, outputs: { draftChanged: "draftChanged" }, ngContentSelectors: _c1, decls: 16, vars: 6, consts: [[1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "shadow-sm", "border", "border-slate-200/60", "dark:border-slate-800/80", "p-5", "space-y-4"], [1, "text-xs", "font-black", "text-slate-800", "dark:text-slate-200", "border-b", "border-slate-100", "dark:border-slate-800", "pb-2.5", "uppercase", "tracking-wider", "flex", "items-center"], [1, "fa-solid", "fa-file-invoice", "mr-2", "text-indigo-500", "text-sm"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4"], [1, "block", "text-[10px]", "font-black", "text-slate-400", "dark:text-slate-500", "mb-1.5", "uppercase", "tracking-widest"], ["type", "date", 1, "w-full", "bg-slate-50", "dark:bg-slate-955", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-xl", "px-4", "py-2.5", "text-xs", "text-slate-800", "dark:text-slate-200", "font-bold", "focus:ring-2", "focus:ring-indigo-500/10", "focus:border-indigo-500", "transition", "outline-none", "disabled:opacity-75", "disabled:cursor-not-allowed", 3, "ngModelChange", "ngModel", "disabled"], [1, "empty:hidden"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-4", "pt-2"], [1, "flex", "items-start", "gap-3", "p-3.5", "rounded-xl", "hover:bg-slate-50", "dark:hover:bg-slate-850", "border", "border-slate-100", "dark:border-slate-800/60", "select-none", "transition", "bg-slate-50/20", "dark:bg-slate-900/10", 3, "cursor-pointer", "cursor-not-allowed"], [1, "flex", "items-center", "justify-between", "gap-3", "p-3", "rounded-xl", "bg-slate-50/40", "dark:bg-slate-955/40", "border", "border-slate-250/25", "dark:border-slate-800/60", "transition", "hover:border-slate-350", "dark:hover:border-slate-700", "shadow-xs"], [1, "flex", "items-start", "gap-3", "p-3.5", "rounded-xl", "hover:bg-slate-50", "dark:hover:bg-slate-850", "border", "border-slate-100", "dark:border-slate-800/60", "select-none", "transition", "bg-slate-50/20", "dark:bg-slate-900/10"], ["type", "checkbox", 1, "mt-0.5", "w-4", "h-4", "rounded", "text-indigo-600", "border-slate-300", "focus:ring-indigo-500", "focus:ring-2", "dark:bg-slate-800", "dark:border-slate-700", "disabled:opacity-75", 3, "ngModelChange", "ngModel", "disabled"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "leading-tight", "block"], [1, "flex-1", "min-w-0", "pr-1"], [1, "text-[11px]", "font-extrabold", "text-slate-700", "dark:text-slate-200", "leading-snug", "block", "break-words"], [1, "flex", "items-center", "bg-slate-100", "dark:bg-slate-900", "p-0.5", "rounded-lg", "border", "border-slate-250/30", "dark:border-slate-800", "shrink-0", "select-none"], ["type", "button", "title", "\u0110\u1EA1t ti\u00EAu ch\u00ED", 3, "click", "disabled"], ["type", "button", "title", "Kh\u00F4ng \u0111\u1EA1t ti\u00EAu ch\u00ED", 3, "click", "disabled"], ["type", "button", "title", "Ch\u01B0a \u0111\u00E1nh gi\u00E1", 3, "click", "disabled"]], template: function SopHeaderMetadataComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef(_c0);
            i0.ɵɵelementStart(0, "div", 0)(1, "h4", 1);
            i0.ɵɵelement(2, "i", 2);
            i0.ɵɵtext(3);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "div", 3)(5, "div")(6, "label", 4);
            i0.ɵɵtext(7, "Ng\u00E0y k\u00FD/ Ng\u01B0\u1EDDi ph\u00E2n t\u00EDch");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "input", 5);
            i0.ɵɵtwoWayListener("ngModelChange", function SopHeaderMetadataComponent_Template_input_ngModelChange_8_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["ngayNguoiPhanTich"], $event) || (ctx.draft.page1Data["ngayNguoiPhanTich"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function SopHeaderMetadataComponent_Template_input_ngModelChange_8_listener() { return ctx.onDataChanged(); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(9, "div")(10, "label", 4);
            i0.ɵɵtext(11, "Ng\u00E0y k\u00FD/ Ng\u01B0\u1EDDi th\u1EA9m tra");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "input", 5);
            i0.ɵɵtwoWayListener("ngModelChange", function SopHeaderMetadataComponent_Template_input_ngModelChange_12_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["ngayNguoiThamTra"], $event) || (ctx.draft.page1Data["ngayNguoiThamTra"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function SopHeaderMetadataComponent_Template_input_ngModelChange_12_listener() { return ctx.onDataChanged(); });
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(13, "div", 6);
            i0.ɵɵprojection(14);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(15, SopHeaderMetadataComponent_Conditional_15_Template, 3, 0, "div", 7);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate1(" ", ctx.title, " ");
            i0.ɵɵadvance(5);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["ngayNguoiPhanTich"]);
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["ngayNguoiThamTra"]);
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.checkboxList.length > 0 ? 15 : -1);
        } }, dependencies: [FormsModule, i1.DefaultValueAccessor, i1.CheckboxControlValueAccessor, i1.NgControlStatus, i1.NgModel], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SopHeaderMetadataComponent, [{
        type: Component,
        args: [{
                selector: 'app-sop-header-metadata',
                standalone: true,
                imports: [FormsModule],
                template: `
    <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4">
      <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2.5 uppercase tracking-wider flex items-center">
        <i class="fa-solid fa-file-invoice mr-2 text-indigo-500 text-sm"></i> {{ title }}
      </h4>

      <!-- Signature Dates -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Ngày ký/ Người phân tích</label>
          <input type="date"
            [(ngModel)]="draft.page1Data['ngayNguoiPhanTich']"
            (ngModelChange)="onDataChanged()"
            [disabled]="isReadOnly"
            class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition outline-none disabled:opacity-75 disabled:cursor-not-allowed">
          </div>
          <div>
            <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Ngày ký/ Người thẩm tra</label>
            <input type="date"
              [(ngModel)]="draft.page1Data['ngayNguoiThamTra']"
              (ngModelChange)="onDataChanged()"
              [disabled]="isReadOnly"
              class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition outline-none disabled:opacity-75 disabled:cursor-not-allowed">
            </div>
          </div>

          <!-- Custom metadata inputs projected from parent -->
          <div class="empty:hidden">
            <ng-content select="[sop-metadata-extra]"></ng-content>
          </div>

          <!-- Checkbox & QC evaluation grid -->
          @if (checkboxList.length > 0) {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              @for (checkbox of checkboxList; track checkbox.key) {
                @if (!isQcField(checkbox.key)) {
                  <label class="flex items-start gap-3 p-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-100 dark:border-slate-800/60 select-none transition bg-slate-50/20 dark:bg-slate-900/10"
                    [class.cursor-pointer]="!isReadOnly"
                    [class.cursor-not-allowed]="isReadOnly">
                    <input type="checkbox"
                      [(ngModel)]="draft.page1Data[checkbox.key]"
                      (ngModelChange)="onCheckboxChange(checkbox.key)"
                      [disabled]="isReadOnly"
                      class="mt-0.5 w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 focus:ring-2 dark:bg-slate-800 dark:border-slate-700 disabled:opacity-75">
                      <div>
                        <span class="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight block">{{ checkbox.label }}</span>
                      </div>
                    </label>
                  } @else {
                    <div class="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50/40 dark:bg-slate-955/40 border border-slate-250/25 dark:border-slate-800/60 transition hover:border-slate-350 dark:hover:border-slate-700 shadow-xs">
                      <div class="flex-1 min-w-0 pr-1">
                        <span class="text-[11px] font-extrabold text-slate-700 dark:text-slate-200 leading-snug block break-words">
                          {{ checkbox.label }}
                        </span>
                      </div>
                      <div class="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-250/30 dark:border-slate-800 shrink-0 select-none">
                        <button type="button"
                          (click)="setQcStatus(checkbox.key, true)"
                          [disabled]="isReadOnly"
                        [class]="draft.page1Data[checkbox.key] === true 
                          ? 'px-2.5 py-1 text-[10px] font-black rounded bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs transition duration-150 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed' 
                          : 'px-2.5 py-1 text-[10px] font-bold rounded text-slate-550 dark:text-slate-400 hover:text-slate-750 dark:hover:text-slate-200 transition duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'"
                          title="Đạt tiêu chí">
                          Đạt
                        </button>
                        <button type="button"
                          (click)="setQcStatus(checkbox.key, false)"
                          [disabled]="isReadOnly"
                        [class]="draft.page1Data[checkbox.key] === false 
                          ? 'px-2.5 py-1 text-[10px] font-black rounded bg-rose-500 hover:bg-rose-600 text-white shadow-xs transition duration-150 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed' 
                          : 'px-2.5 py-1 text-[10px] font-bold rounded text-slate-550 dark:text-slate-400 hover:text-slate-750 dark:hover:text-slate-200 transition duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'"
                          title="Không đạt tiêu chí">
                          K.Đạt
                        </button>
                        <button type="button"
                          (click)="setQcStatus(checkbox.key, null)"
                          [disabled]="isReadOnly"
                        [class]="draft.page1Data[checkbox.key] === undefined || draft.page1Data[checkbox.key] === null
                          ? 'px-2 py-1 text-[9px] font-black rounded bg-slate-350 dark:bg-slate-700 text-slate-750 dark:text-slate-250 shadow-xs transition duration-150 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed' 
                          : 'px-2 py-1 text-[9px] font-bold rounded text-slate-455 dark:text-slate-500 hover:text-slate-600 transition duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'"
                          title="Chưa đánh giá">
                          N/A
                        </button>
                      </div>
                    </div>
                  }
                }
              </div>
            }
          </div>
    `
            }]
    }], null, { title: [{
            type: Input
        }], draft: [{
            type: Input
        }], checkboxList: [{
            type: Input
        }], isReadOnly: [{
            type: Input
        }], draftChanged: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(SopHeaderMetadataComponent, { className: "SopHeaderMetadataComponent", filePath: "src/app/features/results/sops/shared/sop-header-metadata.component.ts", lineNumber: 102 }); })();
//# sourceMappingURL=sop-header-metadata.component.js.map