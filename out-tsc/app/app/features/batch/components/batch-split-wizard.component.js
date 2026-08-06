import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getSopTargetKey, isSopMatrixCompatible } from '../smart-batch.utils';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.id;
function BatchSplitWizardComponent_Conditional_21_For_12_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 24);
    i0.ɵɵlistener("click", function BatchSplitWizardComponent_Conditional_21_For_12_Template_div_click_0_listener() { const sample_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.toggleSample(sample_r4)); });
    i0.ɵɵelementStart(1, "span", 25);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const sample_r4 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵclassMap(ctx_r1.state().selectedSamples.has(sample_r4) ? "bg-blue-600 border-blue-600 text-white shadow-md transform scale-105" : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(sample_r4);
} }
function BatchSplitWizardComponent_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 11)(1, "div", 16)(2, "h4", 17);
    i0.ɵɵtext(3, "Ch\u1ECDn M\u1EABu C\u1EA7n Chuy\u1EC3n \u0110i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 18)(5, "button", 19);
    i0.ɵɵlistener("click", function BatchSplitWizardComponent_Conditional_21_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.selectAllSamples()); });
    i0.ɵɵtext(6, "Ch\u1ECDn H\u1EBFt");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "button", 20);
    i0.ɵɵlistener("click", function BatchSplitWizardComponent_Conditional_21_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.deselectAllSamples()); });
    i0.ɵɵtext(8, "B\u1ECF Ch\u1ECDn");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(9, "div", 21)(10, "div", 22);
    i0.ɵɵrepeaterCreate(11, BatchSplitWizardComponent_Conditional_21_For_12_Template, 3, 3, "div", 23, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(11);
    i0.ɵɵrepeater(ctx_r1.state().availableSamples);
} }
function BatchSplitWizardComponent_Conditional_22_For_14_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "label", 29)(1, "input", 30);
    i0.ɵɵlistener("change", function BatchSplitWizardComponent_Conditional_22_For_14_Template_input_change_1_listener() { const t_r7 = i0.ɵɵrestoreView(_r6).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.toggleTarget(ctx_r1.targetKey(t_r7))); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "span", 31);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const t_r7 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("checked", ctx_r1.state().selectedTargets.has(ctx_r1.targetKey(t_r7)));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(t_r7._displayName || t_r7.name);
} }
function BatchSplitWizardComponent_Conditional_22_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 11)(1, "div", 16)(2, "h4", 17);
    i0.ɵɵtext(3, "Ch\u1ECDn Ch\u1EC9 Ti\u00EAu C\u1EA7n Th\u1EF1c Hi\u1EC7n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 18)(5, "button", 19);
    i0.ɵɵlistener("click", function BatchSplitWizardComponent_Conditional_22_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.selectAllTargets()); });
    i0.ɵɵtext(6, "Ch\u1ECDn H\u1EBFt");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "button", 20);
    i0.ɵɵlistener("click", function BatchSplitWizardComponent_Conditional_22_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.deselectAllTargets()); });
    i0.ɵɵtext(8, "B\u1ECF Ch\u1ECDn");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(9, "div", 26);
    i0.ɵɵelement(10, "i", 27);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "div", 28);
    i0.ɵɵrepeaterCreate(13, BatchSplitWizardComponent_Conditional_22_For_14_Template, 4, 2, "label", 29, _forTrack0);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(11);
    i0.ɵɵtextInterpolate1(" C\u00E1c m\u1EABu \u0111\u00E3 ch\u1ECDn (", ctx_r1.state().selectedSamples.size, ") s\u1EBD \u0111\u01B0\u1EE3c chuy\u1EC3n sang m\u1EBB m\u1EDBi \u0111\u1EC3 l\u00E0m c\u00E1c ch\u1EC9 ti\u00EAu n\u00E0y. ");
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r1.state().availableTargets);
} }
function BatchSplitWizardComponent_Conditional_23_For_5_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 37);
    i0.ɵɵelement(1, "i", 44);
    i0.ɵɵelementEnd();
} }
function BatchSplitWizardComponent_Conditional_23_For_5_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 36);
    i0.ɵɵlistener("click", function BatchSplitWizardComponent_Conditional_23_For_5_Template_div_click_0_listener() { const sop_r9 = i0.ɵɵrestoreView(_r8).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.selectSop(sop_r9.id)); });
    i0.ɵɵtemplate(1, BatchSplitWizardComponent_Conditional_23_For_5_Conditional_1_Template, 2, 0, "div", 37);
    i0.ɵɵelementStart(2, "div", 38)(3, "div", 39);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 40);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "div", 41)(8, "div", 42);
    i0.ɵɵtext(9, "\u0110\u1ED9 ph\u1EE7");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "div", 43);
    i0.ɵɵtext(11, "100%");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const sop_r9 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵclassMap(ctx_r1.state().selectedSopId === sop_r9.id ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 ring-2 ring-blue-500 shadow-md" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.state().selectedSopId === sop_r9.id ? 1 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(sop_r9.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(sop_r9.category);
} }
function BatchSplitWizardComponent_Conditional_23_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 35);
    i0.ɵɵelement(1, "i", 45);
    i0.ɵɵelementStart(2, "p", 46);
    i0.ɵɵtext(3, "Kh\u00F4ng t\u00ECm th\u1EA5y SOP n\u00E0o ph\u1EE7 h\u1EBFt c\u00E1c ch\u1EC9 ti\u00EAu \u0111\u00E3 ch\u1ECDn.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "button", 47);
    i0.ɵɵlistener("click", function BatchSplitWizardComponent_Conditional_23_Conditional_6_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.prevStep()); });
    i0.ɵɵtext(5, "Quay L\u1EA1i Ch\u1ECDn \u00CDt Ch\u1EC9 Ti\u00EAu H\u01A1n");
    i0.ɵɵelementEnd()();
} }
function BatchSplitWizardComponent_Conditional_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 11)(1, "h4", 32);
    i0.ɵɵtext(2, "\u0110\u1EC1 Xu\u1EA5t Quy Tr\u00ECnh (SOP) Ph\u00F9 H\u1EE3p");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 33);
    i0.ɵɵrepeaterCreate(4, BatchSplitWizardComponent_Conditional_23_For_5_Template, 12, 5, "div", 34, _forTrack0);
    i0.ɵɵtemplate(6, BatchSplitWizardComponent_Conditional_23_Conditional_6_Template, 6, 0, "div", 35);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx_r1.filteredSops());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.filteredSops().length === 0 ? 6 : -1);
} }
function BatchSplitWizardComponent_Conditional_25_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 48);
    i0.ɵɵlistener("click", function BatchSplitWizardComponent_Conditional_25_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r11); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.prevStep()); });
    i0.ɵɵelement(1, "i", 49);
    i0.ɵɵtext(2, " Quay L\u1EA1i ");
    i0.ɵɵelementEnd();
} }
function BatchSplitWizardComponent_Conditional_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div");
} }
function BatchSplitWizardComponent_Conditional_27_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 50);
    i0.ɵɵlistener("click", function BatchSplitWizardComponent_Conditional_27_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r12); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.nextStep()); });
    i0.ɵɵtext(1, " Ti\u1EBFp T\u1EE5c ");
    i0.ɵɵelement(2, "i", 51);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("disabled", ctx_r1.state().step === 1 && ctx_r1.state().selectedSamples.size === 0 || ctx_r1.state().step === 2 && ctx_r1.state().selectedTargets.size === 0);
} }
function BatchSplitWizardComponent_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 52);
    i0.ɵɵlistener("click", function BatchSplitWizardComponent_Conditional_28_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.confirm()); });
    i0.ɵɵelement(1, "i", 53);
    i0.ɵɵtext(2, " Ho\u00E0n T\u1EA5t ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("disabled", !ctx_r1.state().selectedSopId);
} }
export class BatchSplitWizardComponent {
    constructor() {
        this.close = new EventEmitter();
        this.execute = new EventEmitter();
        this.state = signal({
            step: 1,
            sourceBatchName: '',
            availableSamples: [],
            selectedSamples: new Set(),
            availableTargets: [],
            selectedTargets: new Set(),
            selectedSopId: null
        });
        this.filteredSops = computed(() => {
            const s = this.state();
            if (s.step !== 3)
                return [];
            const reqTargets = s.selectedTargets;
            if (reqTargets.size === 0)
                return [];
            return this.allSops.filter(sop => {
                if (!sop.targets)
                    return false;
                const sopTargetIds = new Set(sop.targets.map(getSopTargetKey));
                for (const reqId of Array.from(reqTargets)) {
                    if (!sopTargetIds.has(reqId))
                        return false;
                }
                const selectedTasks = (this.sourceBatch.tasks || []).filter(task => s.selectedSamples.has(task.sample) && reqTargets.has(task.targetId));
                if (selectedTasks.some(task => !isSopMatrixCompatible(sop, task.matrixType)))
                    return false;
                return true;
            });
        });
    }
    ngOnInit() {
        this.state.set({
            step: 1,
            sourceBatchName: this.sourceBatch.name,
            availableSamples: Array.from(this.sourceBatch.samples).sort(),
            selectedSamples: new Set(),
            availableTargets: this.sourceBatch.targets,
            selectedTargets: new Set(this.sourceBatch.targets.map(target => getSopTargetKey(target))),
            selectedSopId: null
        });
    }
    targetKey(target) {
        return getSopTargetKey(target);
    }
    toggleSample(sample) {
        this.state.update(s => {
            const newSet = new Set(s.selectedSamples);
            if (newSet.has(sample))
                newSet.delete(sample);
            else
                newSet.add(sample);
            return { ...s, selectedSamples: newSet };
        });
    }
    selectAllSamples() { this.state.update(s => ({ ...s, selectedSamples: new Set(s.availableSamples) })); }
    deselectAllSamples() { this.state.update(s => ({ ...s, selectedSamples: new Set() })); }
    toggleTarget(id) {
        this.state.update(s => {
            const newSet = new Set(s.selectedTargets);
            if (newSet.has(id))
                newSet.delete(id);
            else
                newSet.add(id);
            return { ...s, selectedTargets: newSet };
        });
    }
    selectAllTargets() {
        this.state.update(s => ({
            ...s,
            selectedTargets: new Set(s.availableTargets.map(target => getSopTargetKey(target)))
        }));
    }
    deselectAllTargets() { this.state.update(s => ({ ...s, selectedTargets: new Set() })); }
    selectSop(id) { this.state.update(s => ({ ...s, selectedSopId: id })); }
    nextStep() {
        this.state.update(s => {
            if (s.step === 1) {
                if (s.selectedSamples.size === 0)
                    return s;
                const relevantTargets = new Set();
                if (this.sourceBatch.tasks) {
                    this.sourceBatch.tasks.forEach(t => {
                        if (s.selectedSamples.has(t.sample))
                            relevantTargets.add(t.targetId);
                    });
                }
                else {
                    s.availableTargets.forEach(target => relevantTargets.add(getSopTargetKey(target)));
                }
                return { ...s, step: 2, selectedTargets: relevantTargets };
            }
            if (s.step === 2 && s.selectedTargets.size === 0)
                return s;
            return { ...s, step: (s.step + 1) };
        });
    }
    prevStep() {
        this.state.update(s => {
            if (s.step === 1)
                return s;
            return { ...s, step: (s.step - 1) };
        });
    }
    confirm() {
        const s = this.state();
        if (s.selectedSopId) {
            this.execute.emit({
                samples: s.selectedSamples,
                targets: s.selectedTargets,
                sopId: s.selectedSopId
            });
        }
    }
    static { this.ɵfac = function BatchSplitWizardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || BatchSplitWizardComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: BatchSplitWizardComponent, selectors: [["app-batch-split-wizard"]], inputs: { sourceBatch: "sourceBatch", allSops: "allSops" }, outputs: { close: "close", execute: "execute" }, decls: 29, vars: 12, consts: [[1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "p-4", "bg-slate-900/50", "backdrop-blur-sm", "fade-in"], [1, "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-2xl", "w-full", "max-w-4xl", "overflow-hidden", "flex", "flex-col", "h-[85vh]", "animate-slide-up"], [1, "px-6", "py-4", "border-b", "border-slate-100", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800/50", "flex", "justify-between", "items-center", "shrink-0"], [1, "font-black", "text-slate-800", "dark:text-slate-200", "text-lg", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-shuffle", "text-blue-600", "dark:text-blue-400"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "mt-0.5"], [1, "text-slate-400", "dark:text-slate-500", "hover:text-red-500", "dark:hover:text-red-400", "transition", 3, "click"], [1, "fa-solid", "fa-times", "text-xl"], [1, "flex", "border-b", "border-slate-100", "dark:border-slate-700", "bg-white", "dark:bg-slate-800", "shrink-0"], [1, "flex-1", "py-3", "text-center", "text-xs", "font-bold", "border-b-2", "transition-colors"], [1, "flex-1", "overflow-hidden", "bg-slate-50", "dark:bg-slate-900/50", "relative", "p-4", "md:p-6"], [1, "h-full", "flex", "flex-col", "gap-3", "animate-fade-in"], [1, "p-4", "bg-white", "dark:bg-slate-800", "border-t", "border-slate-200", "dark:border-slate-700", "flex", "justify-between", "items-center", "shrink-0"], [1, "px-5", "py-3", "md:py-2.5", "text-slate-600", "dark:text-slate-300", "bg-slate-100", "md:bg-transparent", "hover:bg-slate-200", "dark:hover:bg-slate-700", "rounded-xl", "font-bold", "text-sm", "transition"], [1, "px-8", "py-3", "md:py-2.5", "bg-blue-600", "hover:bg-blue-700", "text-white", "rounded-xl", "font-bold", "text-sm", "shadow-md", "transition", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "disabled"], [1, "px-8", "py-3", "md:py-2.5", "bg-emerald-600", "hover:bg-emerald-700", "text-white", "rounded-xl", "font-bold", "text-sm", "shadow-md", "transition", "transform", "active:scale-95", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "disabled"], [1, "flex", "justify-between", "items-center", "mb-2"], [1, "text-sm", "font-bold", "text-slate-700", "dark:text-slate-300", "uppercase"], [1, "text-xs", "space-x-2"], [1, "text-blue-600", "dark:text-blue-400", "hover:underline", "font-bold", 3, "click"], [1, "text-slate-400", "dark:text-slate-500", "hover:text-slate-600", "dark:hover:text-slate-300", 3, "click"], [1, "flex-1", "overflow-y-auto", "custom-scrollbar", "bg-white", "dark:bg-slate-800", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "p-4"], [1, "grid", "grid-cols-2", "sm:grid-cols-4", "md:grid-cols-5", "gap-3"], [1, "p-3", "md:p-2", "rounded-lg", "border", "cursor-pointer", "text-center", "transition", "select-none", 3, "class"], [1, "p-3", "md:p-2", "rounded-lg", "border", "cursor-pointer", "text-center", "transition", "select-none", 3, "click"], [1, "text-sm", "md:text-xs", "font-mono", "font-bold"], [1, "bg-blue-50", "dark:bg-blue-900/20", "border", "border-blue-100", "dark:border-blue-800", "rounded-lg", "p-3", "text-xs", "text-blue-800", "dark:text-blue-300", "mb-2"], [1, "fa-solid", "fa-circle-info", "mr-1"], [1, "flex-1", "overflow-y-auto", "custom-scrollbar", "bg-white", "dark:bg-slate-800", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "p-2"], [1, "flex", "items-center", "gap-3", "p-4", "md:p-3", "hover:bg-slate-50", "dark:hover:bg-slate-700/50", "border-b", "border-slate-50", "dark:border-slate-700/50", "last:border-0", "cursor-pointer", "active:bg-slate-100"], ["type", "checkbox", 1, "w-5", "h-5", "md:w-4", "md:h-4", "accent-blue-600", "rounded", 3, "change", "checked"], [1, "text-base", "md:text-sm", "font-bold", "text-slate-700", "dark:text-slate-300"], [1, "text-sm", "font-bold", "text-slate-700", "dark:text-slate-300", "uppercase", "mb-2"], [1, "flex-1", "overflow-y-auto", "custom-scrollbar", "space-y-3"], [1, "p-4", "rounded-xl", "border", "cursor-pointer", "transition", "flex", "justify-between", "items-center", "group", "relative", "overflow-hidden", 3, "class"], [1, "p-8", "text-center", "text-slate-400", "dark:text-slate-500", "bg-white", "dark:bg-slate-800", "rounded-xl", "border", "border-dashed", "border-slate-200", "dark:border-slate-700"], [1, "p-4", "rounded-xl", "border", "cursor-pointer", "transition", "flex", "justify-between", "items-center", "group", "relative", "overflow-hidden", 3, "click"], [1, "absolute", "top-0", "right-0", "w-8", "h-8", "bg-blue-500", "text-white", "flex", "items-center", "justify-center", "rounded-bl-xl"], [1, "pr-6"], [1, "font-bold", "text-slate-800", "dark:text-slate-200", "text-base", "group-hover:text-blue-700", "dark:group-hover:text-blue-400", "leading-tight"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "mt-1"], [1, "text-right", "shrink-0"], [1, "text-[10px]", "font-bold", "uppercase", "text-slate-400", "dark:text-slate-500"], [1, "text-lg", "font-black", "text-emerald-600", "dark:text-emerald-400"], [1, "fa-solid", "fa-check", "text-sm"], [1, "fa-solid", "fa-filter-circle-xmark", "text-3xl", "mb-3"], [1, "text-sm", "font-medium"], [1, "text-blue-600", "dark:text-blue-400", "font-bold", "hover:underline", "mt-4", "text-sm", "bg-blue-50", "dark:bg-blue-900/20", "px-4", "py-2", "rounded-lg", 3, "click"], [1, "px-5", "py-3", "md:py-2.5", "text-slate-600", "dark:text-slate-300", "bg-slate-100", "md:bg-transparent", "hover:bg-slate-200", "dark:hover:bg-slate-700", "rounded-xl", "font-bold", "text-sm", "transition", 3, "click"], [1, "fa-solid", "fa-arrow-left", "mr-1"], [1, "px-8", "py-3", "md:py-2.5", "bg-blue-600", "hover:bg-blue-700", "text-white", "rounded-xl", "font-bold", "text-sm", "shadow-md", "transition", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "fa-solid", "fa-arrow-right", "ml-1"], [1, "px-8", "py-3", "md:py-2.5", "bg-emerald-600", "hover:bg-emerald-700", "text-white", "rounded-xl", "font-bold", "text-sm", "shadow-md", "transition", "transform", "active:scale-95", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "fa-solid", "fa-check", "mr-1"]], template: function BatchSplitWizardComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div")(4, "h3", 3);
            i0.ɵɵelement(5, "i", 4);
            i0.ɵɵtext(6, " Ph\u00E2n T\u00E1ch v\u00E0 Chuy\u1EC3n M\u1EBB ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "p", 5);
            i0.ɵɵtext(8, "Ngu\u1ED3n: ");
            i0.ɵɵelementStart(9, "b");
            i0.ɵɵtext(10);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(11, "button", 6);
            i0.ɵɵlistener("click", function BatchSplitWizardComponent_Template_button_click_11_listener() { return ctx.close.emit(); });
            i0.ɵɵelement(12, "i", 7);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(13, "div", 8)(14, "div", 9);
            i0.ɵɵtext(15, "1. Ch\u1ECDn m\u1EABu");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(16, "div", 9);
            i0.ɵɵtext(17, "2. Ch\u1ECDn ch\u1EC9 ti\u00EAu");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "div", 9);
            i0.ɵɵtext(19, "3. Ch\u1ECDn quy tr\u00ECnh");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(20, "div", 10);
            i0.ɵɵtemplate(21, BatchSplitWizardComponent_Conditional_21_Template, 13, 0, "div", 11)(22, BatchSplitWizardComponent_Conditional_22_Template, 15, 1, "div", 11)(23, BatchSplitWizardComponent_Conditional_23_Template, 7, 1, "div", 11);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(24, "div", 12);
            i0.ɵɵtemplate(25, BatchSplitWizardComponent_Conditional_25_Template, 3, 0, "button", 13)(26, BatchSplitWizardComponent_Conditional_26_Template, 1, 0, "div")(27, BatchSplitWizardComponent_Conditional_27_Template, 3, 1, "button", 14)(28, BatchSplitWizardComponent_Conditional_28_Template, 3, 1, "button", 15);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(10);
            i0.ɵɵtextInterpolate(ctx.state().sourceBatchName);
            i0.ɵɵadvance(4);
            i0.ɵɵclassMap(ctx.state().step >= 1 ? "border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400" : "border-transparent text-slate-300 dark:text-slate-600");
            i0.ɵɵadvance(2);
            i0.ɵɵclassMap(ctx.state().step >= 2 ? "border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400" : "border-transparent text-slate-300 dark:text-slate-600");
            i0.ɵɵadvance(2);
            i0.ɵɵclassMap(ctx.state().step >= 3 ? "border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400" : "border-transparent text-slate-300 dark:text-slate-600");
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.state().step === 1 ? 21 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.state().step === 2 ? 22 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.state().step === 3 ? 23 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.state().step > 1 ? 25 : 26);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.state().step < 3 ? 27 : 28);
        } }, dependencies: [CommonModule, FormsModule], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(BatchSplitWizardComponent, [{
        type: Component,
        args: [{
                selector: 'app-batch-split-wizard',
                standalone: true,
                imports: [CommonModule, FormsModule],
                template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col h-[85vh] animate-slide-up">
            
            <!-- Header -->
            <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center shrink-0">
                <div>
                    <h3 class="font-black text-slate-800 dark:text-slate-200 text-lg flex items-center gap-2">
                        <i class="fa-solid fa-shuffle text-blue-600 dark:text-blue-400"></i> Phân Tách và Chuyển Mẻ
                    </h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Nguồn: <b>{{state().sourceBatchName}}</b></p>
                </div>
                <button (click)="close.emit()" class="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition"><i class="fa-solid fa-times text-xl"></i></button>
            </div>

            <!-- Steps Indicator -->
            <div class="flex border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0">
                <div class="flex-1 py-3 text-center text-xs font-bold border-b-2 transition-colors" [class]="state().step >= 1 ? 'border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400' : 'border-transparent text-slate-300 dark:text-slate-600'">1. Chọn mẫu</div>
                <div class="flex-1 py-3 text-center text-xs font-bold border-b-2 transition-colors" [class]="state().step >= 2 ? 'border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400' : 'border-transparent text-slate-300 dark:text-slate-600'">2. Chọn chỉ tiêu</div>
                <div class="flex-1 py-3 text-center text-xs font-bold border-b-2 transition-colors" [class]="state().step >= 3 ? 'border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400' : 'border-transparent text-slate-300 dark:text-slate-600'">3. Chọn quy trình</div>
            </div>

            <!-- Wizard Content -->
            <div class="flex-1 overflow-hidden bg-slate-50 dark:bg-slate-900/50 relative p-4 md:p-6">
                
                <!-- STEP 1: SELECT SAMPLES -->
                @if (state().step === 1) {
                    <div class="h-full flex flex-col gap-3 animate-fade-in">
                        <div class="flex justify-between items-center mb-2">
                            <h4 class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase">Chọn Mẫu Cần Chuyển Đi</h4>
                            <div class="text-xs space-x-2">
                                <button (click)="selectAllSamples()" class="text-blue-600 dark:text-blue-400 hover:underline font-bold">Chọn Hết</button>
                                <button (click)="deselectAllSamples()" class="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">Bỏ Chọn</button>
                            </div>
                        </div>
                        <div class="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                            <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                @for(sample of state().availableSamples; track sample) {
                                    <div (click)="toggleSample(sample)" 
                                         class="p-3 md:p-2 rounded-lg border cursor-pointer text-center transition select-none"
                                         [class]="state().selectedSamples.has(sample) ? 'bg-blue-600 border-blue-600 text-white shadow-md transform scale-105' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'">
                                        <span class="text-sm md:text-xs font-mono font-bold">{{sample}}</span>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                }

                <!-- STEP 2: SELECT TARGETS -->
                @if (state().step === 2) {
                    <div class="h-full flex flex-col gap-3 animate-fade-in">
                        <div class="flex justify-between items-center mb-2">
                            <h4 class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase">Chọn Chỉ Tiêu Cần Thực Hiện</h4>
                            <div class="text-xs space-x-2">
                                <button (click)="selectAllTargets()" class="text-blue-600 dark:text-blue-400 hover:underline font-bold">Chọn Hết</button>
                                <button (click)="deselectAllTargets()" class="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">Bỏ Chọn</button>
                            </div>
                        </div>
                        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-3 text-xs text-blue-800 dark:text-blue-300 mb-2">
                            <i class="fa-solid fa-circle-info mr-1"></i>
                            Các mẫu đã chọn ({{state().selectedSamples.size}}) sẽ được chuyển sang mẻ mới để làm các chỉ tiêu này.
                        </div>
                        <div class="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-2">
                            @for(t of state().availableTargets; track t.id) {
                                <label class="flex items-center gap-3 p-4 md:p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 border-b border-slate-50 dark:border-slate-700/50 last:border-0 cursor-pointer active:bg-slate-100">
                                    <input type="checkbox" 
                                           [checked]="state().selectedTargets.has(targetKey(t))"
                                           (change)="toggleTarget(targetKey(t))"
                                           class="w-5 h-5 md:w-4 md:h-4 accent-blue-600 rounded">
                                    <span class="text-base md:text-sm font-bold text-slate-700 dark:text-slate-300">{{t._displayName || t.name}}</span>
                                </label>
                            }
                        </div>
                    </div>
                }

                <!-- STEP 3: SELECT SOP -->
                @if (state().step === 3) {
                    <div class="h-full flex flex-col gap-3 animate-fade-in">
                        <h4 class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">Đề Xuất Quy Trình (SOP) Phù Hợp</h4>
                        <div class="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                            @for(sop of filteredSops(); track sop.id) {
                                <div (click)="selectSop(sop.id)" 
                                     class="p-4 rounded-xl border cursor-pointer transition flex justify-between items-center group relative overflow-hidden"
                                     [class]="state().selectedSopId === sop.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 ring-2 ring-blue-500 shadow-md' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500'">
                                    
                                    @if(state().selectedSopId === sop.id) {
                                        <div class="absolute top-0 right-0 w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-bl-xl"><i class="fa-solid fa-check text-sm"></i></div>
                                    }

                                    <div class="pr-6">
                                        <div class="font-bold text-slate-800 dark:text-slate-200 text-base group-hover:text-blue-700 dark:group-hover:text-blue-400 leading-tight">{{sop.name}}</div>
                                        <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">{{sop.category}}</div>
                                    </div>
                                    <div class="text-right shrink-0">
                                        <div class="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Độ phủ</div>
                                        <div class="text-lg font-black text-emerald-600 dark:text-emerald-400">100%</div>
                                    </div>
                                </div>
                            }
                            @if(filteredSops().length === 0) {
                                <div class="p-8 text-center text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                    <i class="fa-solid fa-filter-circle-xmark text-3xl mb-3"></i>
                                    <p class="text-sm font-medium">Không tìm thấy SOP nào phủ hết các chỉ tiêu đã chọn.</p>
                                    <button (click)="prevStep()" class="text-blue-600 dark:text-blue-400 font-bold hover:underline mt-4 text-sm bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg">Quay Lại Chọn Ít Chỉ Tiêu Hơn</button>
                                </div>
                            }
                        </div>
                    </div>
                }

            </div>

            <!-- Footer Buttons -->
            <div class="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
                @if (state().step > 1) {
                    <button (click)="prevStep()" class="px-5 py-3 md:py-2.5 text-slate-600 dark:text-slate-300 bg-slate-100 md:bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold text-sm transition">
                        <i class="fa-solid fa-arrow-left mr-1"></i> Quay Lại
                    </button>
                } @else {
                    <div></div>
                }

                @if (state().step < 3) {
                    <button (click)="nextStep()" 
                            [disabled]="(state().step === 1 && state().selectedSamples.size === 0) || (state().step === 2 && state().selectedTargets.size === 0)"
                            class="px-8 py-3 md:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed">
                        Tiếp Tục <i class="fa-solid fa-arrow-right ml-1"></i>
                    </button>
                } @else {
                    <button (click)="confirm()" 
                            [disabled]="!state().selectedSopId"
                            class="px-8 py-3 md:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                        <i class="fa-solid fa-check mr-1"></i> Hoàn Tất
                    </button>
                }
            </div>
        </div>
    </div>
  `
            }]
    }], null, { sourceBatch: [{
            type: Input,
            args: [{ required: true }]
        }], allSops: [{
            type: Input,
            args: [{ required: true }]
        }], close: [{
            type: Output
        }], execute: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(BatchSplitWizardComponent, { className: "BatchSplitWizardComponent", filePath: "src/app/features/batch/components/batch-split-wizard.component.ts", lineNumber: 172 }); })();
//# sourceMappingURL=batch-split-wizard.component.js.map