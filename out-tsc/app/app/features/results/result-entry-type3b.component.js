import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterTargetService } from '../targets/master-target.service';
import { getAssignedTargetsForSample, resolveCompoundDisplayName, isCompoundAssigned } from './shared/compound-id-resolver';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.key;
function ResultEntryType3bComponent_For_25_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "label", 37)(1, "input", 39);
    i0.ɵɵtwoWayListener("ngModelChange", function ResultEntryType3bComponent_For_25_Conditional_0_Template_input_ngModelChange_1_listener($event) { i0.ɵɵrestoreView(_r1); const checkbox_r2 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.draft.page1Data[checkbox_r2.key], $event) || (ctx_r2.draft.page1Data[checkbox_r2.key] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function ResultEntryType3bComponent_For_25_Conditional_0_Template_input_ngModelChange_1_listener() { i0.ɵɵrestoreView(_r1); const checkbox_r2 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.onCheckboxChange(checkbox_r2.key)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "div")(3, "span", 40);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const checkbox_r2 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.draft.page1Data[checkbox_r2.key]);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(checkbox_r2.label);
} }
function ResultEntryType3bComponent_For_25_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 38)(1, "div", 41)(2, "span", 42);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "div", 43)(5, "button", 44);
    i0.ɵɵlistener("click", function ResultEntryType3bComponent_For_25_Conditional_1_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r4); const checkbox_r2 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.setQcStatus(checkbox_r2.key, true)); });
    i0.ɵɵtext(6, " \u0110\u1EA1t ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "button", 45);
    i0.ɵɵlistener("click", function ResultEntryType3bComponent_For_25_Conditional_1_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r4); const checkbox_r2 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.setQcStatus(checkbox_r2.key, false)); });
    i0.ɵɵtext(8, " K.\u0110\u1EA1t ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "button", 46);
    i0.ɵɵlistener("click", function ResultEntryType3bComponent_For_25_Conditional_1_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r4); const checkbox_r2 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.setQcStatus(checkbox_r2.key, null)); });
    i0.ɵɵtext(10, " N/A ");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const checkbox_r2 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", checkbox_r2.label, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r2.draft.page1Data[checkbox_r2.key] === true ? "px-2.5 py-1 text-[10px] font-black rounded bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs transition duration-150 active:scale-95" : "px-2.5 py-1 text-[10px] font-bold rounded text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition duration-150 active:scale-95");
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r2.draft.page1Data[checkbox_r2.key] === false ? "px-2.5 py-1 text-[10px] font-black rounded bg-rose-500 hover:bg-rose-600 text-white shadow-xs transition duration-150 active:scale-95" : "px-2.5 py-1 text-[10px] font-bold rounded text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition duration-150 active:scale-95");
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r2.draft.page1Data[checkbox_r2.key] === undefined || ctx_r2.draft.page1Data[checkbox_r2.key] === null ? "px-2 py-1 text-[9px] font-black rounded bg-slate-350 dark:bg-slate-700 text-slate-750 dark:text-slate-250 shadow-xs transition duration-150 active:scale-95" : "px-2 py-1 text-[9px] font-bold rounded text-slate-400 dark:text-slate-500 hover:text-slate-600 transition duration-150 active:scale-95");
} }
function ResultEntryType3bComponent_For_25_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, ResultEntryType3bComponent_For_25_Conditional_0_Template, 5, 2, "label", 37)(1, ResultEntryType3bComponent_For_25_Conditional_1_Template, 11, 7, "div", 38);
} if (rf & 2) {
    const checkbox_r2 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵconditional(ctx_r2.isGeneralObservation(checkbox_r2.key) ? 0 : 1);
} }
function ResultEntryType3bComponent_For_30_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 47);
    i0.ɵɵlistener("click", function ResultEntryType3bComponent_For_30_Template_button_click_0_listener() { const sampleCode_r6 = i0.ɵɵrestoreView(_r5).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.selectSample(sampleCode_r6)); });
    i0.ɵɵelementStart(1, "span");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 48);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const sampleCode_r6 = ctx.$implicit;
    const ɵ$index_79_r7 = ctx.$index;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵclassMap(ctx_r2.activeSampleCode() === sampleCode_r6 ? "bg-fuchsia-600 text-white font-extrabold shadow-sm border border-fuchsia-650 transition shrink-0 active:scale-95" : "bg-white dark:bg-slate-900 text-slate-655 dark:text-slate-455 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800/80 transition shrink-0 active:scale-95 shadow-2xs");
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r2.activeSampleCode() === sampleCode_r6 ? "w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black text-white" : "w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/80");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ɵ$index_79_r7 + 1, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(sampleCode_r6);
} }
function ResultEntryType3bComponent_For_76_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const ɵ$index_162_r9 = i0.ɵɵnextContext().$index;
    i0.ɵɵtextInterpolate1(" ", ɵ$index_162_r9 + 1, " ");
} }
function ResultEntryType3bComponent_For_76_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 51);
} }
function ResultEntryType3bComponent_For_76_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵdeclareLet(0);
    i0.ɵɵelementStart(1, "tr", 49)(2, "td", 50);
    i0.ɵɵtemplate(3, ResultEntryType3bComponent_For_76_Conditional_3_Template, 1, 1)(4, ResultEntryType3bComponent_For_76_Conditional_4_Template, 1, 0, "i", 51);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "td", 52);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "td", 53)(8, "input", 54);
    i0.ɵɵtwoWayListener("ngModelChange", function ResultEntryType3bComponent_For_76_Template_input_ngModelChange_8_listener($event) { const compound_r10 = i0.ɵɵrestoreView(_r8).$implicit; const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.draft.resultData[ctx_r2.activeSampleCode()][compound_r10 + "_nd"], $event) || (ctx_r2.draft.resultData[ctx_r2.activeSampleCode()][compound_r10 + "_nd"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function ResultEntryType3bComponent_For_76_Template_input_ngModelChange_8_listener() { const compound_r10 = i0.ɵɵrestoreView(_r8).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.onNdCheckboxChanged(compound_r10)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "td", 55)(10, "input", 56);
    i0.ɵɵtwoWayListener("ngModelChange", function ResultEntryType3bComponent_For_76_Template_input_ngModelChange_10_listener($event) { const compound_r10 = i0.ɵɵrestoreView(_r8).$implicit; const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.draft.resultData[ctx_r2.activeSampleCode()][compound_r10], $event) || (ctx_r2.draft.resultData[ctx_r2.activeSampleCode()][compound_r10] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function ResultEntryType3bComponent_For_76_Template_input_ngModelChange_10_listener() { const compound_r10 = i0.ɵɵrestoreView(_r8).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.onResultInputChanged(compound_r10)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "td", 55)(12, "select", 57);
    i0.ɵɵtwoWayListener("ngModelChange", function ResultEntryType3bComponent_For_76_Template_select_ngModelChange_12_listener($event) { const compound_r10 = i0.ɵɵrestoreView(_r8).$implicit; const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.draft.resultData[ctx_r2.activeSampleCode()][compound_r10 + "_qc1"], $event) || (ctx_r2.draft.resultData[ctx_r2.activeSampleCode()][compound_r10 + "_qc1"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function ResultEntryType3bComponent_For_76_Template_select_ngModelChange_12_listener() { i0.ɵɵrestoreView(_r8); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.onDataChanged()); });
    i0.ɵɵelementStart(13, "option", 58);
    i0.ɵɵtext(14, "\u0110\u1EA1t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "option", 59);
    i0.ɵɵtext(16, "Kh\u00F4ng \u0111\u1EA1t");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(17, "td", 55)(18, "select", 57);
    i0.ɵɵtwoWayListener("ngModelChange", function ResultEntryType3bComponent_For_76_Template_select_ngModelChange_18_listener($event) { const compound_r10 = i0.ɵɵrestoreView(_r8).$implicit; const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.draft.resultData[ctx_r2.activeSampleCode()][compound_r10 + "_qc2"], $event) || (ctx_r2.draft.resultData[ctx_r2.activeSampleCode()][compound_r10 + "_qc2"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function ResultEntryType3bComponent_For_76_Template_select_ngModelChange_18_listener() { i0.ɵɵrestoreView(_r8); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.onDataChanged()); });
    i0.ɵɵelementStart(19, "option", 58);
    i0.ɵɵtext(20, "\u0110\u1EA1t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "option", 59);
    i0.ɵɵtext(22, "Kh\u00F4ng \u0111\u1EA1t");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(23, "td", 55)(24, "select", 57);
    i0.ɵɵtwoWayListener("ngModelChange", function ResultEntryType3bComponent_For_76_Template_select_ngModelChange_24_listener($event) { const compound_r10 = i0.ɵɵrestoreView(_r8).$implicit; const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.draft.resultData[ctx_r2.activeSampleCode()][compound_r10 + "_qc3"], $event) || (ctx_r2.draft.resultData[ctx_r2.activeSampleCode()][compound_r10 + "_qc3"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function ResultEntryType3bComponent_For_76_Template_select_ngModelChange_24_listener() { i0.ɵɵrestoreView(_r8); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.onDataChanged()); });
    i0.ɵɵelementStart(25, "option", 58);
    i0.ɵɵtext(26, "\u0110\u1EA1t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "option", 59);
    i0.ɵɵtext(28, "Kh\u00F4ng \u0111\u1EA1t");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const compound_r10 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    const isAssigned_r11 = ctx_r2.isTargetAssigned(ctx_r2.activeSampleCode(), compound_r10);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(isAssigned_r11 ? "hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-all focus-within:bg-fuchsia-50/10 dark:focus-within:bg-fuchsia-500/5 border-l-4 border-l-transparent focus-within:border-l-fuchsia-500 duration-150" : "bg-slate-50/50 dark:bg-slate-955/20 opacity-60 text-slate-400 select-none border-l-4 border-l-slate-200 dark:border-l-slate-800");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(isAssigned_r11 ? 3 : 4);
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("line-through", !isAssigned_r11);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.compoundDisplayNames()[compound_r10] || compound_r10, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", !isAssigned_r11);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.draft.resultData[ctx_r2.activeSampleCode()][compound_r10 + "_nd"]);
    i0.ɵɵadvance(2);
    i0.ɵɵclassMapInterpolate1("w-full border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-extrabold focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 outline-none text-center shadow-inner transition\n                                  ", isAssigned_r11 ? "bg-white dark:bg-slate-850 text-slate-850 dark:text-slate-200" : "bg-slate-100/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-655 cursor-not-allowed border-dashed", "");
    i0.ɵɵpropertyInterpolate("placeholder", isAssigned_r11 ? "ND / S\u1ED1 l\u01B0\u1EE3ng..." : "N/A");
    i0.ɵɵproperty("readonly", !isAssigned_r11);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.draft.resultData[ctx_r2.activeSampleCode()][compound_r10]);
    i0.ɵɵadvance(2);
    i0.ɵɵclassMapInterpolate1("w-full border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1.5 text-xs font-extrabold focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 outline-none shadow-2xs transition\n                                   ", isAssigned_r11 ? "bg-white dark:bg-slate-850 text-slate-850 dark:text-slate-200" : "bg-slate-100/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-655 cursor-not-allowed border-dashed", "");
    i0.ɵɵproperty("disabled", !isAssigned_r11);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.draft.resultData[ctx_r2.activeSampleCode()][compound_r10 + "_qc1"]);
    i0.ɵɵadvance(6);
    i0.ɵɵclassMapInterpolate1("w-full border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1.5 text-xs font-extrabold focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 outline-none shadow-2xs transition\n                                   ", isAssigned_r11 ? "bg-white dark:bg-slate-850 text-slate-850 dark:text-slate-200" : "bg-slate-100/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-655 cursor-not-allowed border-dashed", "");
    i0.ɵɵproperty("disabled", !isAssigned_r11);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.draft.resultData[ctx_r2.activeSampleCode()][compound_r10 + "_qc2"]);
    i0.ɵɵadvance(6);
    i0.ɵɵclassMapInterpolate1("w-full border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1.5 text-xs font-extrabold focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 outline-none shadow-2xs transition\n                                   ", isAssigned_r11 ? "bg-white dark:bg-slate-850 text-slate-850 dark:text-slate-200" : "bg-slate-100/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-655 cursor-not-allowed border-dashed", "");
    i0.ɵɵproperty("disabled", !isAssigned_r11);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.draft.resultData[ctx_r2.activeSampleCode()][compound_r10 + "_qc3"]);
} }
export class ResultEntryType3bComponent {
    constructor() {
        this.isReadOnly = false;
        this.publishedSampleSet = null;
        this.draftChanged = new EventEmitter();
        this.masterTargetService = inject(MasterTargetService);
        this.masterTargets = signal([]);
        this.compoundDisplayNames = signal({});
        this.checkboxList = [];
        this.activeSampleCode = signal('');
    }
    async ngOnInit() {
        if (this.run.sampleList && this.run.sampleList.length > 0) {
            this.activeSampleCode.set(this.run.sampleList[0]);
        }
        if (this.config.checkboxLines) {
            this.checkboxList = Object.entries(this.config.checkboxLines).map(([label, key]) => ({
                key: key,
                label
            }));
        }
        try {
            const analytes = await this.masterTargetService.getAll();
            this.masterTargets.set(analytes);
            this.buildDisplayNameMap();
        }
        catch (e) {
            console.warn('Failed to load master analytes', e);
        }
        // Auto-prefill unassigned compounds during grid bootstrap
        this.prefillUnassignedTargets();
    }
    buildDisplayNameMap() {
        if (!this.config.compounds)
            return;
        const map = {};
        for (const compound of this.config.compounds) {
            map[compound] = this.getCompoundDisplayName(compound);
        }
        this.compoundDisplayNames.set(map);
    }
    getCompoundDisplayName(compound) {
        return resolveCompoundDisplayName(compound, this.masterTargets(), this.config?.id || this.run?.sopId);
    }
    isTargetAssigned(sampleCode, compound) {
        // QC samples luôn cần hiển thị tất cả compounds
        if (sampleCode.startsWith('QC_'))
            return true;
        if (!this.run)
            return true;
        const targetMap = this.run.sampleTargetMap || (this.run.inputs && this.run.inputs.sampleTargetMap);
        if (!targetMap)
            return true;
        const assigned = getAssignedTargetsForSample(sampleCode, targetMap);
        if (!assigned || assigned.length === 0)
            return true;
        // Fast path: canonical id direct match (DATA_VERSION 2)
        if (assigned.includes(compound))
            return true;
        // Fallback: shim cho data v1 chưa migrate
        return isCompoundAssigned(assigned, compound, this.masterTargets());
    }
    prefillUnassignedTargets() {
        const targetMap = this.run?.sampleTargetMap || (this.run?.inputs && this.run.inputs.sampleTargetMap);
        if (!this.run || !targetMap || !this.config.compounds)
            return;
        const sampleList = this.run.sampleList || [];
        sampleList.forEach((sampleCode) => {
            if (!this.draft.resultData[sampleCode]) {
                this.draft.resultData[sampleCode] = { selected: true };
            }
            const row = this.draft.resultData[sampleCode];
            this.config.compounds.forEach((c) => {
                if (!this.isTargetAssigned(sampleCode, c)) {
                    // Pre-fill to prevent validator/checking side effects
                    row[c] = 'N/A';
                    row[`${c}_nd`] = false;
                    row[`${c}_qc1`] = 'Đạt';
                    row[`${c}_qc2`] = 'Đạt';
                    row[`${c}_qc3`] = 'Đạt';
                }
            });
        });
    }
    selectSample(sampleCode) {
        this.activeSampleCode.set(sampleCode);
    }
    onDataChanged() {
        if (this.isReadOnly)
            return;
        this.draftChanged.emit(this.draft);
    }
    onCheckboxChange(changedKey) {
        if (changedKey === 'checkTatCaND' && this.draft.page1Data['checkTatCaND']) {
            this.draft.page1Data['checkCoMauPhatHien'] = false;
        }
        else if (changedKey === 'checkCoMauPhatHien' && this.draft.page1Data['checkCoMauPhatHien']) {
            this.draft.page1Data['checkTatCaND'] = false;
        }
        this.onDataChanged();
    }
    /**
     * Đồng bộ khi nhấn check KPH/ND: tự điền 'KPH' vào ô kết quả
     */
    onNdCheckboxChanged(compound) {
        const active = this.activeSampleCode();
        const row = this.draft.resultData[active];
        if (row) {
            if (row[`${compound}_nd`]) {
                row[compound] = 'ND';
            }
            else {
                row[compound] = '';
            }
        }
        this.onDataChanged();
    }
    /**
     * Đồng bộ khi sửa ô kết quả: tự bỏ chọn KPH/ND nếu điền số lượng cụ thể
     */
    onResultInputChanged(compound) {
        const active = this.activeSampleCode();
        const row = this.draft.resultData[active];
        if (row) {
            const val = String(row[compound] || '').trim().toUpperCase();
            if (val === 'KPH' || val === 'ND' || val === '') {
                row[`${compound}_nd`] = true;
                if (val === 'KPH')
                    row[compound] = 'ND';
            }
            else {
                row[`${compound}_nd`] = false;
            }
        }
        this.onDataChanged();
    }
    /**
     * Bulk Action: Đặt tất cả hoạt chất của mẫu đang mở là KPH (Không phát hiện)
     */
    sampleBulkFillND() {
        const active = this.activeSampleCode();
        const row = this.draft.resultData[active];
        if (row && this.config.compounds) {
            this.config.compounds.forEach((c) => {
                if (this.isTargetAssigned(active, c)) {
                    row[c] = 'ND';
                    row[`${c}_nd`] = true;
                }
            });
        }
        this.onDataChanged();
    }
    /**
     * Bulk Action: Đặt tất cả các QC (QC1, QC2, QC3) của mẫu đang mở là "Đạt"
     */
    sampleBulkQC() {
        const active = this.activeSampleCode();
        const row = this.draft.resultData[active];
        if (row && this.config.compounds) {
            this.config.compounds.forEach((c) => {
                if (this.isTargetAssigned(active, c)) {
                    row[`${c}_qc1`] = 'Đạt';
                    row[`${c}_qc2`] = 'Đạt';
                    row[`${c}_qc3`] = 'Đạt';
                }
            });
        }
        this.onDataChanged();
    }
    /**
     * Bulk Action: Sao chép toàn bộ kết quả của mẫu đang mở sang tất cả các mẫu khác trong mẻ chạy
     */
    copyActiveSampleToAll() {
        const sourceSample = this.activeSampleCode();
        const sourceData = this.draft.resultData[sourceSample];
        if (!sourceData || !this.config.compounds)
            return;
        const sampleList = this.run.sampleList || [];
        sampleList.forEach((sampleCode) => {
            if (sampleCode !== sourceSample) {
                const destRow = this.draft.resultData[sampleCode];
                if (destRow) {
                    this.config.compounds.forEach((c) => {
                        // Sao chép chỉ khi hoạt chất đó được gán chung trên cả 2 mẫu nguồn và đích
                        if (this.isTargetAssigned(sourceSample, c) && this.isTargetAssigned(sampleCode, c)) {
                            destRow[c] = sourceData[c] || 'ND';
                            destRow[`${c}_nd`] = sourceData[`${c}_nd`] !== false;
                            destRow[`${c}_qc1`] = sourceData[`${c}_qc1`] || 'Đạt';
                            destRow[`${c}_qc2`] = sourceData[`${c}_qc2`] || 'Đạt';
                            destRow[`${c}_qc3`] = sourceData[`${c}_qc3`] || 'Đạt';
                        }
                    });
                }
            }
        });
        this.onDataChanged();
    }
    isGeneralObservation(key) {
        return key === 'checkTatCaND' || key === 'checkCoMauPhatHien';
    }
    setQcStatus(key, value) {
        this.draft.page1Data[key] = value;
        this.onDataChanged();
    }
    static { this.ɵfac = function ResultEntryType3bComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ResultEntryType3bComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ResultEntryType3bComponent, selectors: [["app-result-entry-type3b"]], inputs: { run: "run", draft: "draft", config: "config", isReadOnly: "isReadOnly", publishedSampleSet: "publishedSampleSet" }, outputs: { draftChanged: "draftChanged" }, decls: 77, vars: 7, consts: [[1, "space-y-6", "animate-fade-in", 3, "disabled"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "shadow-sm", "border", "border-slate-200/60", "dark:border-slate-800/80", "p-5", "space-y-4"], [1, "text-xs", "font-black", "text-slate-800", "dark:text-slate-200", "border-b", "border-slate-100", "dark:border-slate-800", "pb-2.5", "uppercase", "tracking-wider", "flex", "items-center"], [1, "fa-solid", "fa-file-invoice", "mr-2", "text-fuchsia-500", "text-sm"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4"], [1, "block", "text-[10px]", "font-black", "text-slate-400", "dark:text-slate-500", "mb-1.5", "uppercase", "tracking-widest"], ["type", "date", 1, "w-full", "bg-slate-50", "dark:bg-slate-955", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-xl", "px-4", "py-2.5", "text-xs", "text-slate-800", "dark:text-slate-200", "font-bold", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "transition", "outline-none", 3, "ngModelChange", "ngModel"], ["type", "text", "placeholder", "V\u00ED d\u1EE5: GC-MS/MS / LC-MS/MS", 1, "w-full", "bg-slate-50", "dark:bg-slate-955", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-xl", "px-4", "py-2.5", "text-xs", "text-slate-800", "dark:text-slate-200", "font-bold", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "transition", "outline-none", 3, "ngModelChange", "ngModel"], ["type", "text", "placeholder", "\u00DD ki\u1EBFn th\u1EA3o lu\u1EADn ho\u1EB7c ghi ch\u00FA k\u1EBFt qu\u1EA3...", 1, "w-full", "bg-slate-50", "dark:bg-slate-955", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-xl", "px-4", "py-2.5", "text-xs", "text-slate-800", "dark:text-slate-200", "font-bold", "focus:ring-2", "focus:ring-fuchsia-500/10", "focus:border-fuchsia-500", "transition", "outline-none", 3, "ngModelChange", "ngModel"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4", "pt-2"], [1, "flex", "items-center", "gap-3", "overflow-x-auto", "custom-scrollbar", "py-2.5", "px-3", "shrink-0", "bg-indigo-50/15", "dark:bg-indigo-955/15", "border", "border-indigo-100/40", "dark:border-indigo-950/20", "rounded-2xl", "shadow-2xs"], [1, "text-[10px]", "font-black", "text-indigo-700", "dark:text-indigo-400", "uppercase", "tracking-widest", "mr-1"], [1, "px-4", "py-2.5", "rounded-xl", "text-xs", "flex", "items-center", "gap-2", 3, "class"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "shadow-sm", "border", "border-slate-200/60", "dark:border-slate-800/80", "p-5", "space-y-4", "animate-fade-in"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-4", "border-b", "border-slate-100", "dark:border-slate-800", "pb-3.5"], [1, "text-xs", "font-black", "text-slate-800", "dark:text-slate-200", "uppercase", "tracking-wider", "flex", "items-center"], [1, "fa-solid", "fa-flask-vial", "mr-2", "text-fuchsia-500", "text-sm"], [1, "font-mono", "text-fuchsia-600", "dark:text-fuchsia-400", "font-extrabold", "ml-1", "bg-fuchsia-50", "dark:bg-fuchsia-950/30", "px-2", "py-0.5", "rounded-lg", "border", "border-fuchsia-100", "dark:border-fuchsia-900/30"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "font-bold", "mt-1", "tracking-wide"], [1, "flex", "flex-wrap", "items-center", "gap-2.5"], [1, "text-[10px]", "font-black", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-widest", "mr-1"], [1, "px-3", "py-2", "bg-slate-50", "dark:bg-slate-850", "hover:bg-amber-50", "dark:hover:bg-amber-950/20", "text-slate-700", "dark:text-slate-300", "hover:text-amber-600", "dark:hover:text-amber-400", "border", "border-slate-200", "dark:border-slate-800", "hover:border-amber-200", "dark:hover:border-amber-900/30", "rounded-xl", "text-xs", "font-extrabold", "transition", "flex", "items-center", "gap-1.5", "active:scale-95", "shadow-2xs", 3, "click"], [1, "fa-solid", "fa-pen-nib", "text-amber-500"], [1, "px-3", "py-2", "bg-slate-50", "dark:bg-slate-850", "hover:bg-emerald-50", "dark:hover:bg-emerald-950/20", "text-slate-700", "dark:text-slate-300", "hover:text-emerald-600", "dark:hover:text-emerald-400", "border", "border-slate-200", "dark:border-slate-800", "hover:border-emerald-200", "dark:hover:border-emerald-900/30", "rounded-xl", "text-xs", "font-extrabold", "transition", "flex", "items-center", "gap-1.5", "active:scale-95", "shadow-2xs", 3, "click"], [1, "fa-solid", "fa-circle-check", "text-emerald-500"], ["title", "Sao ch\u00E9p to\u00E0n b\u1ED9 k\u1EBFt qu\u1EA3 c\u1EE7a m\u1EABu \u0111ang hi\u1EC3n th\u1ECB cho t\u1EA5t c\u1EA3 c\u00E1c m\u1EABu kh\u00E1c trong m\u1EBB ch\u1EA1y n\u00E0y", 1, "px-3.5", "py-2", "bg-gradient-to-r", "from-fuchsia-600", "to-indigo-600", "hover:from-fuchsia-700", "hover:to-indigo-700", "text-white", "rounded-xl", "text-xs", "font-black", "shadow-sm", "transition", "flex", "items-center", "gap-1.5", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-copy"], [1, "overflow-x-auto", "custom-scrollbar", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-2xl", "max-h-[550px]", "overflow-y-auto"], [1, "w-full", "text-sm", "border-collapse"], [1, "bg-slate-50", "dark:bg-slate-955", "border-b", "border-slate-255/80", "dark:border-slate-800", "sticky", "top-0", "z-20", "shadow-2xs"], [1, "py-3", "px-4", "text-center", "font-black", "text-slate-500", "dark:text-slate-400", "text-[10px]", "uppercase", "tracking-widest", "w-16"], [1, "py-3", "px-4", "text-left", "font-black", "text-slate-500", "dark:text-slate-400", "text-[10px]", "uppercase", "tracking-widest", "min-w-[150px]"], [1, "py-3", "px-4", "text-center", "font-black", "text-slate-500", "dark:text-slate-400", "text-[10px]", "uppercase", "tracking-widest", "w-28"], [1, "py-3", "px-4", "text-left", "font-black", "text-slate-500", "dark:text-slate-400", "text-[10px]", "uppercase", "tracking-widest", "min-w-[130px]"], [1, "py-3", "px-4", "text-center", "font-black", "text-slate-500", "dark:text-slate-400", "text-[10px]", "uppercase", "tracking-widest", "w-36"], [1, "divide-y", "divide-slate-100", "dark:divide-slate-800/80"], [1, "transition-all", "duration-155", 3, "class"], [1, "flex", "items-start", "gap-3", "p-3.5", "rounded-xl", "hover:bg-slate-50", "dark:hover:bg-slate-850", "border", "border-slate-100", "dark:border-slate-800/60", "cursor-pointer", "select-none", "transition", "bg-slate-50/20", "dark:bg-slate-900/10"], [1, "flex", "items-center", "justify-between", "gap-3", "p-3", "rounded-xl", "bg-slate-50/40", "dark:bg-slate-955/40", "border", "border-slate-250/25", "dark:border-slate-800/60", "transition", "hover:border-slate-350", "dark:hover:border-slate-700", "shadow-xs"], ["type", "checkbox", 1, "mt-0.5", "w-4", "h-4", "rounded", "text-indigo-650", "border-slate-350", "dark:border-slate-700", "focus:ring-indigo-500", "focus:ring-2", "dark:bg-slate-800", "dark:border-slate-700", 3, "ngModelChange", "ngModel"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "leading-tight", "block"], [1, "flex-1", "min-w-0", "pr-1"], [1, "text-[11px]", "font-extrabold", "text-slate-700", "dark:text-slate-200", "leading-snug", "block", "break-words"], [1, "flex", "items-center", "bg-slate-100", "dark:bg-slate-900", "p-0.5", "rounded-lg", "border", "border-slate-250/30", "dark:border-slate-800", "shrink-0", "select-none"], ["type", "button", "title", "\u0110\u1EA1t ti\u00EAu ch\u00ED", 3, "click"], ["type", "button", "title", "Kh\u00F4ng \u0111\u1EA1t ti\u00EAu ch\u00ED", 3, "click"], ["type", "button", "title", "Ch\u01B0a \u0111\u00E1nh gi\u00E1", 3, "click"], [1, "px-4", "py-2.5", "rounded-xl", "text-xs", "flex", "items-center", "gap-2", 3, "click"], [1, "font-mono", "font-bold"], [1, "transition-all", "duration-155"], [1, "py-2.5", "px-4", "font-mono", "text-xs", "text-slate-400", "font-bold", "text-center"], ["title", "Ch\u1EC9 ti\u00EAu kh\u00F4ng \u0111\u01B0\u1EE3c ph\u00E2n t\u00EDch cho m\u1EABu n\u00E0y", 1, "fa-solid", "fa-lock", "text-[10px]", "text-slate-450", "dark:text-slate-500"], [1, "py-2.5", "px-4", "text-slate-700", "dark:text-slate-200", "font-extrabold", "text-xs"], [1, "py-2.5", "px-4", "text-center"], ["type", "checkbox", 1, "w-4", "h-4", "rounded", "text-fuchsia-600", "border-slate-350", "dark:border-slate-700", "focus:ring-fuchsia-500", "dark:bg-slate-900", "disabled:opacity-50", 3, "ngModelChange", "disabled", "ngModel"], [1, "py-1.5", "px-2"], ["type", "text", 3, "ngModelChange", "readonly", "ngModel", "placeholder"], [3, "ngModelChange", "disabled", "ngModel"], ["value", "\u0110\u1EA1t"], ["value", "Kh\u00F4ng \u0111\u1EA1t"]], template: function ResultEntryType3bComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "fieldset", 0)(1, "div", 1)(2, "h4", 2);
            i0.ɵɵelement(3, "i", 3);
            i0.ɵɵtext(4, " Th\u00F4ng Tin Chung & \u0110\u00E1nh Gi\u00E1 (D\u1EA1ng 3B) ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "div", 4)(6, "div")(7, "label", 5);
            i0.ɵɵtext(8, "Ng\u00E0y k\u00FD Ng\u01B0\u1EDDi ph\u00E2n t\u00EDch");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "input", 6);
            i0.ɵɵtwoWayListener("ngModelChange", function ResultEntryType3bComponent_Template_input_ngModelChange_9_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["ngayNguoiPhanTich"], $event) || (ctx.draft.page1Data["ngayNguoiPhanTich"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function ResultEntryType3bComponent_Template_input_ngModelChange_9_listener() { return ctx.onDataChanged(); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(10, "div")(11, "label", 5);
            i0.ɵɵtext(12, "Ng\u00E0y k\u00FD Ng\u01B0\u1EDDi th\u1EA9m tra");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "input", 6);
            i0.ɵɵtwoWayListener("ngModelChange", function ResultEntryType3bComponent_Template_input_ngModelChange_13_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["ngayNguoiThamTra"], $event) || (ctx.draft.page1Data["ngayNguoiThamTra"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function ResultEntryType3bComponent_Template_input_ngModelChange_13_listener() { return ctx.onDataChanged(); });
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(14, "div", 4)(15, "div")(16, "label", 5);
            i0.ɵɵtext(17, "Thi\u1EBFt b\u1ECB ph\u00E2n t\u00EDch");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "input", 7);
            i0.ɵɵtwoWayListener("ngModelChange", function ResultEntryType3bComponent_Template_input_ngModelChange_18_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["device"], $event) || (ctx.draft.page1Data["device"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function ResultEntryType3bComponent_Template_input_ngModelChange_18_listener() { return ctx.onDataChanged(); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(19, "div")(20, "label", 5);
            i0.ɵɵtext(21, "Th\u1EA3o lu\u1EADn / Nh\u1EADn x\u00E9t");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "input", 8);
            i0.ɵɵtwoWayListener("ngModelChange", function ResultEntryType3bComponent_Template_input_ngModelChange_22_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.draft.page1Data["thaoLuan"], $event) || (ctx.draft.page1Data["thaoLuan"] = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function ResultEntryType3bComponent_Template_input_ngModelChange_22_listener() { return ctx.onDataChanged(); });
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(23, "div", 9);
            i0.ɵɵrepeaterCreate(24, ResultEntryType3bComponent_For_25_Template, 2, 1, null, null, _forTrack0);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(26, "div", 10)(27, "span", 11);
            i0.ɵɵtext(28, "Danh s\u00E1ch m\u1EABu:");
            i0.ɵɵelementEnd();
            i0.ɵɵrepeaterCreate(29, ResultEntryType3bComponent_For_30_Template, 5, 6, "button", 12, i0.ɵɵrepeaterTrackByIdentity);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(31, "div", 13)(32, "div", 14)(33, "div")(34, "h4", 15);
            i0.ɵɵelement(35, "i", 16);
            i0.ɵɵtext(36, " B\u1EA3ng K\u1EBFt Qu\u1EA3 M\u1EABu: ");
            i0.ɵɵelementStart(37, "span", 17);
            i0.ɵɵtext(38);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(39, "p", 18);
            i0.ɵɵtext(40);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(41, "div", 19)(42, "span", 20);
            i0.ɵɵtext(43, "M\u1EABu n\u00E0y:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(44, "button", 21);
            i0.ɵɵlistener("click", function ResultEntryType3bComponent_Template_button_click_44_listener() { return ctx.sampleBulkFillND(); });
            i0.ɵɵelement(45, "i", 22);
            i0.ɵɵelementStart(46, "span");
            i0.ɵɵtext(47, "\u0110\u1EB7t T\u1EA5t C\u1EA3 ND");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(48, "button", 23);
            i0.ɵɵlistener("click", function ResultEntryType3bComponent_Template_button_click_48_listener() { return ctx.sampleBulkQC(); });
            i0.ɵɵelement(49, "i", 24);
            i0.ɵɵelementStart(50, "span");
            i0.ɵɵtext(51, "T\u1EA5t C\u1EA3 QC \u0110\u1EA1t");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(52, "button", 25);
            i0.ɵɵlistener("click", function ResultEntryType3bComponent_Template_button_click_52_listener() { return ctx.copyActiveSampleToAll(); });
            i0.ɵɵelement(53, "i", 26);
            i0.ɵɵelementStart(54, "span");
            i0.ɵɵtext(55, "Sao Ch\u00E9p M\u1EABu cho C\u1EA3 M\u1EBB");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(56, "div", 27)(57, "table", 28)(58, "thead")(59, "tr", 29)(60, "th", 30);
            i0.ɵɵtext(61, "STT");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(62, "th", 31);
            i0.ɵɵtext(63, "Ho\u1EA1t ch\u1EA5t");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(64, "th", 32);
            i0.ɵɵtext(65, "KPH / ND");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(66, "th", 33);
            i0.ɵɵtext(67, "K\u1EBFt qu\u1EA3 (\u00B5g/kg)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(68, "th", 34);
            i0.ɵɵtext(69, "\u0110\u1ED9 thu h\u1ED3i R%");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(70, "th", 34);
            i0.ɵɵtext(71, "H\u1EC7 s\u1ED1 tuy\u1EBFn t\u00EDnh R2");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(72, "th", 34);
            i0.ɵɵtext(73, "K\u1EBFt lu\u1EADn");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(74, "tbody", 35);
            i0.ɵɵrepeaterCreate(75, ResultEntryType3bComponent_For_76_Template, 29, 29, "tr", 36, i0.ɵɵrepeaterTrackByIdentity);
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            i0.ɵɵproperty("disabled", ctx.isReadOnly);
            i0.ɵɵadvance(9);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["ngayNguoiPhanTich"]);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["ngayNguoiThamTra"]);
            i0.ɵɵadvance(5);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["device"]);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.draft.page1Data["thaoLuan"]);
            i0.ɵɵadvance(2);
            i0.ɵɵrepeater(ctx.checkboxList);
            i0.ɵɵadvance(5);
            i0.ɵɵrepeater(ctx.run.sampleList);
            i0.ɵɵadvance(9);
            i0.ɵɵtextInterpolate(ctx.activeSampleCode());
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1(" T\u1ED5ng c\u1ED9ng ", (ctx.config.compounds == null ? null : ctx.config.compounds.length) || 0, " ho\u1EA1t ch\u1EA5t c\u1EA7n ki\u1EC3m nghi\u1EC7m. ");
            i0.ɵɵadvance(35);
            i0.ɵɵrepeater(ctx.config.compounds);
        } }, dependencies: [CommonModule, FormsModule, i1.NgSelectOption, i1.ɵNgSelectMultipleOption, i1.DefaultValueAccessor, i1.CheckboxControlValueAccessor, i1.SelectControlValueAccessor, i1.NgControlStatus, i1.NgModel], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ResultEntryType3bComponent, [{
        type: Component,
        args: [{
                selector: 'app-result-entry-type3b',
                standalone: true,
                imports: [CommonModule, FormsModule],
                template: `
    <fieldset [disabled]="isReadOnly" class="space-y-6 animate-fade-in">
      
      <!-- 1. Metadata Form & Checkboxes -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4">
        <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2.5 uppercase tracking-wider flex items-center">
          <i class="fa-solid fa-file-invoice mr-2 text-fuchsia-500 text-sm"></i> Thông Tin Chung & Đánh Giá (Dạng 3B)
        </h4>

        <!-- Signature Dates -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Ngày ký Người phân tích</label>
            <input type="date" 
                   [(ngModel)]="draft.page1Data['ngayNguoiPhanTich']" 
                   (ngModelChange)="onDataChanged()"
                   class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none">
          </div>
          <div>
            <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Ngày ký Người thẩm tra</label>
            <input type="date" 
                   [(ngModel)]="draft.page1Data['ngayNguoiThamTra']" 
                   (ngModelChange)="onDataChanged()"
                   class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none">
          </div>
        </div>

        <!-- Device & Discussion -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Thiết bị phân tích</label>
            <input type="text" 
                   [(ngModel)]="draft.page1Data['device']" 
                   (ngModelChange)="onDataChanged()"
                   placeholder="Ví dụ: GC-MS/MS / LC-MS/MS"
                   class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none">
          </div>
          <div>
            <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-widest">Thảo luận / Nhận xét</label>
            <input type="text" 
                   [(ngModel)]="draft.page1Data['thaoLuan']" 
                   (ngModelChange)="onDataChanged()"
                   placeholder="Ý kiến thảo luận hoặc ghi chú kết quả..."
                   class="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition outline-none">
          </div>
        </div>

        <!-- Checkbox & QC segment controls grid (Dynamic from SOP metadata configuration) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          @for (checkbox of checkboxList; track checkbox.key) {
            @if (isGeneralObservation(checkbox.key)) {
              <!-- Standard observation checkbox -->
              <label class="flex items-start gap-3 p-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-100 dark:border-slate-800/60 cursor-pointer select-none transition bg-slate-50/20 dark:bg-slate-900/10">
                <input type="checkbox" 
                       [(ngModel)]="draft.page1Data[checkbox.key]" 
                       (ngModelChange)="onCheckboxChange(checkbox.key)"
                       class="mt-0.5 w-4 h-4 rounded text-indigo-650 border-slate-350 dark:border-slate-700 focus:ring-indigo-500 focus:ring-2 dark:bg-slate-800 dark:border-slate-700">
                <div>
                  <span class="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight block">{{ checkbox.label }}</span>
                </div>
              </label>
            } @else {
              <!-- QC evaluation with Đạt / Không đạt Segment Control -->
              <div class="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50/40 dark:bg-slate-955/40 border border-slate-250/25 dark:border-slate-800/60 transition hover:border-slate-350 dark:hover:border-slate-700 shadow-xs">
                <div class="flex-1 min-w-0 pr-1">
                  <span class="text-[11px] font-extrabold text-slate-700 dark:text-slate-200 leading-snug block break-words">
                    {{ checkbox.label }}
                  </span>
                </div>
                
                <!-- Pass / Fail selector -->
                <div class="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-250/30 dark:border-slate-800 shrink-0 select-none">
                  <!-- Button 'Đạt' (true) -->
                  <button type="button"
                          (click)="setQcStatus(checkbox.key, true)"
                          [class]="draft.page1Data[checkbox.key] === true 
                            ? 'px-2.5 py-1 text-[10px] font-black rounded bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs transition duration-150 active:scale-95' 
                            : 'px-2.5 py-1 text-[10px] font-bold rounded text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition duration-150 active:scale-95'"
                          title="Đạt tiêu chí">
                    Đạt
                  </button>
                  
                  <!-- Button 'Không đạt' (false) -->
                  <button type="button"
                          (click)="setQcStatus(checkbox.key, false)"
                          [class]="draft.page1Data[checkbox.key] === false 
                            ? 'px-2.5 py-1 text-[10px] font-black rounded bg-rose-500 hover:bg-rose-600 text-white shadow-xs transition duration-150 active:scale-95' 
                            : 'px-2.5 py-1 text-[10px] font-bold rounded text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition duration-150 active:scale-95'"
                          title="Không đạt tiêu chí">
                    K.Đạt
                  </button>

                  <!-- Button 'N/A' (null) -->
                  <button type="button"
                          (click)="setQcStatus(checkbox.key, null)"
                          [class]="draft.page1Data[checkbox.key] === undefined || draft.page1Data[checkbox.key] === null
                            ? 'px-2 py-1 text-[9px] font-black rounded bg-slate-350 dark:bg-slate-700 text-slate-750 dark:text-slate-250 shadow-xs transition duration-150 active:scale-95' 
                            : 'px-2 py-1 text-[9px] font-bold rounded text-slate-400 dark:text-slate-500 hover:text-slate-600 transition duration-150 active:scale-95'"
                          title="Chưa đánh giá">
                    N/A
                  </button>
                </div>
              </div>
            }
          }
        </div>
      </div>

      <!-- 2. Sample Navigation Tabs -->
      <div class="flex items-center gap-3 overflow-x-auto custom-scrollbar py-2.5 px-3 shrink-0 bg-indigo-50/15 dark:bg-indigo-955/15 border border-indigo-100/40 dark:border-indigo-950/20 rounded-2xl shadow-2xs">
        <span class="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mr-1">Danh sách mẫu:</span>
        @for (sampleCode of run.sampleList; track sampleCode; let idx = $index) {
          <button (click)="selectSample(sampleCode)"
                  [class]="activeSampleCode() === sampleCode 
                    ? 'bg-fuchsia-600 text-white font-extrabold shadow-sm border border-fuchsia-650 transition shrink-0 active:scale-95' 
                    : 'bg-white dark:bg-slate-900 text-slate-655 dark:text-slate-455 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800/80 transition shrink-0 active:scale-95 shadow-2xs'"
                  class="px-4 py-2.5 rounded-xl text-xs flex items-center gap-2">
            <span [class]="activeSampleCode() === sampleCode
                    ? 'w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black text-white'
                    : 'w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/80'">
              {{ idx + 1 }}
            </span>
            <span class="font-mono font-bold">{{ sampleCode }}</span>
          </button>
        }
      </div>

      <!-- 3. Compound Checklist & QCs -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-5 space-y-4 animate-fade-in">
        <!-- Panel Header -->
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div>
            <h4 class="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center">
              <i class="fa-solid fa-flask-vial mr-2 text-fuchsia-500 text-sm"></i>
              Bảng Kết Quả Mẫu: <span class="font-mono text-fuchsia-600 dark:text-fuchsia-400 font-extrabold ml-1 bg-fuchsia-50 dark:bg-fuchsia-950/30 px-2 py-0.5 rounded-lg border border-fuchsia-100 dark:border-fuchsia-900/30">{{ activeSampleCode() }}</span>
            </h4>
            <p class="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1 tracking-wide">
              Tổng cộng {{ config.compounds?.length || 0 }} hoạt chất cần kiểm nghiệm.
            </p>
          </div>

          <!-- Bulk Actions for the Selected Sample -->
          <div class="flex flex-wrap items-center gap-2.5">
            <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-1">Mẫu này:</span>
            
            <button (click)="sampleBulkFillND()" 
                    class="px-3 py-2 bg-slate-50 dark:bg-slate-850 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-900/30 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 active:scale-95 shadow-2xs">
              <i class="fa-solid fa-pen-nib text-amber-500"></i>
              <span>Đặt Tất Cả ND</span>
            </button>

            <button (click)="sampleBulkQC()" 
                    class="px-3 py-2 bg-slate-50 dark:bg-slate-850 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900/30 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 active:scale-95 shadow-2xs">
              <i class="fa-solid fa-circle-check text-emerald-500"></i>
              <span>Tất Cả QC Đạt</span>
            </button>

            <button (click)="copyActiveSampleToAll()" 
                    class="px-3.5 py-2 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black shadow-sm transition flex items-center gap-1.5 active:scale-95"
                    title="Sao chép toàn bộ kết quả của mẫu đang hiển thị cho tất cả các mẫu khác trong mẻ chạy này">
              <i class="fa-solid fa-copy"></i>
              <span>Sao Chép Mẫu cho Cả Mẻ</span>
            </button>
          </div>
        </div>

        <!-- Compound List Table -->
        <div class="overflow-x-auto custom-scrollbar border border-slate-200/80 dark:border-slate-800 rounded-2xl max-h-[550px] overflow-y-auto">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-955 border-b border-slate-255/80 dark:border-slate-800 sticky top-0 z-20 shadow-2xs">
                <th class="py-3 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest w-16">STT</th>
                <th class="py-3 px-4 text-left font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest min-w-[150px]">Hoạt chất</th>
                <th class="py-3 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest w-28">KPH / ND</th>
                <th class="py-3 px-4 text-left font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest min-w-[130px]">Kết quả (µg/kg)</th>
                
                <!-- 3 QC Columns -->
                <th class="py-3 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest w-36">Độ thu hồi R%</th>
                <th class="py-3 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest w-36">Hệ số tuyến tính R2</th>
                <th class="py-3 px-4 text-center font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest w-36">Kết luận</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80">
              @for (compound of config.compounds; track compound; let idx = $index) {
                @let isAssigned = isTargetAssigned(activeSampleCode(), compound);
                <tr [class]="isAssigned 
                      ? 'hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-all focus-within:bg-fuchsia-50/10 dark:focus-within:bg-fuchsia-500/5 border-l-4 border-l-transparent focus-within:border-l-fuchsia-500 duration-150' 
                      : 'bg-slate-50/50 dark:bg-slate-955/20 opacity-60 text-slate-400 select-none border-l-4 border-l-slate-200 dark:border-l-slate-800'"
                    class="transition-all duration-155">
                  <td class="py-2.5 px-4 font-mono text-xs text-slate-400 font-bold text-center">
                    @if (isAssigned) {
                      {{ idx + 1 }}
                    } @else {
                      <i class="fa-solid fa-lock text-[10px] text-slate-450 dark:text-slate-500" title="Chỉ tiêu không được phân tích cho mẫu này"></i>
                    }
                  </td>
                  <td [class.line-through]="!isAssigned" class="py-2.5 px-4 text-slate-700 dark:text-slate-200 font-extrabold text-xs">
                    {{ compoundDisplayNames()[compound] || compound }}
                  </td>
                  
                  <!-- ND Checkbox -->
                  <td class="py-2.5 px-4 text-center">
                    <input type="checkbox"
                           [disabled]="!isAssigned"
                           [(ngModel)]="draft.resultData[activeSampleCode()][compound + '_nd']"
                           (ngModelChange)="onNdCheckboxChanged(compound)"
                           class="w-4 h-4 rounded text-fuchsia-600 border-slate-350 dark:border-slate-700 focus:ring-fuchsia-500 dark:bg-slate-900 disabled:opacity-50">
                  </td>

                  <!-- Result Input -->
                  <td class="py-1.5 px-2">
                    <input type="text"
                           [readonly]="!isAssigned"
                           [(ngModel)]="draft.resultData[activeSampleCode()][compound]"
                           (ngModelChange)="onResultInputChanged(compound)"
                           placeholder="{{ isAssigned ? 'ND / Số lượng...' : 'N/A' }}"
                           class="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-extrabold focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 outline-none text-center shadow-inner transition
                                  {{ isAssigned ? 'bg-white dark:bg-slate-850 text-slate-850 dark:text-slate-200' : 'bg-slate-100/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-655 cursor-not-allowed border-dashed' }}">
                  </td>

                  <!-- QC1 Dropdown -->
                  <td class="py-1.5 px-2">
                    <select [disabled]="!isAssigned"
                            [(ngModel)]="draft.resultData[activeSampleCode()][compound + '_qc1']"
                            (ngModelChange)="onDataChanged()"
                            class="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1.5 text-xs font-extrabold focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 outline-none shadow-2xs transition
                                   {{ isAssigned ? 'bg-white dark:bg-slate-850 text-slate-850 dark:text-slate-200' : 'bg-slate-100/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-655 cursor-not-allowed border-dashed' }}">
                      <option value="Đạt">Đạt</option>
                      <option value="Không đạt">Không đạt</option>
                    </select>
                  </td>

                  <!-- QC2 Dropdown -->
                  <td class="py-1.5 px-2">
                    <select [disabled]="!isAssigned"
                            [(ngModel)]="draft.resultData[activeSampleCode()][compound + '_qc2']"
                            (ngModelChange)="onDataChanged()"
                            class="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1.5 text-xs font-extrabold focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 outline-none shadow-2xs transition
                                   {{ isAssigned ? 'bg-white dark:bg-slate-850 text-slate-850 dark:text-slate-200' : 'bg-slate-100/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-655 cursor-not-allowed border-dashed' }}">
                      <option value="Đạt">Đạt</option>
                      <option value="Không đạt">Không đạt</option>
                    </select>
                  </td>

                  <!-- QC3 Dropdown -->
                  <td class="py-1.5 px-2">
                    <select [disabled]="!isAssigned"
                            [(ngModel)]="draft.resultData[activeSampleCode()][compound + '_qc3']"
                            (ngModelChange)="onDataChanged()"
                            class="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1.5 text-xs font-extrabold focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 outline-none shadow-2xs transition
                                   {{ isAssigned ? 'bg-white dark:bg-slate-850 text-slate-850 dark:text-slate-200' : 'bg-slate-100/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-655 cursor-not-allowed border-dashed' }}">
                      <option value="Đạt">Đạt</option>
                      <option value="Không đạt">Không đạt</option>
                    </select>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </fieldset>
  `
            }]
    }], null, { run: [{
            type: Input
        }], draft: [{
            type: Input
        }], config: [{
            type: Input
        }], isReadOnly: [{
            type: Input
        }], publishedSampleSet: [{
            type: Input
        }], draftChanged: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ResultEntryType3bComponent, { className: "ResultEntryType3bComponent", filePath: "src/app/features/results/result-entry-type3b.component.ts", lineNumber: 276 }); })();
//# sourceMappingURL=result-entry-type3b.component.js.map