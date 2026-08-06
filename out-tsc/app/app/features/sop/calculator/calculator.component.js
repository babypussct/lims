import { Component, inject, input, effect, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StateService } from '../../../core/services/state.service';
import { AuthService } from '../../../core/services/auth.service';
import { InventoryService } from '../../inventory/inventory.service';
import { RecipeService } from '../../recipes/recipe.service';
import { SopService } from '../services/sop.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { PrintService } from '../../../core/services/print.service';
import { CalculatorService } from '../../../core/services/calculator.service';
import { formatNum, generateSlug, formatDate, naturalCompare } from '../../../shared/utils/utils';
import { startWith, debounceTime } from 'rxjs/operators';
import { RecipeManagerComponent } from '../../recipes/recipe-manager.component';
import { QuickGenerateSampleModalComponent } from '../../../shared/components/quick-generate-sample-modal/quick-generate-sample-modal.component';
import { GHS_DICTIONARY } from '../../../core/services/pubchem.service';
import { LockPermissionDirective } from '../../../shared/directives/lock-permission.directive';
import { TargetService } from '../../targets/target.service';
import { getSampleDescriptionSnapshot, setSampleDescriptionSnapshot, subsetSampleDescriptionMap } from '../../../shared/utils/sample-description.utils';
import { SampleDescriptionMasterService } from '../../config/sample-description-master.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
const _c0 = () => ({ standalone: true });
const _c1 = a0 => ({ "bg-blue-50 dark:bg-blue-900/20": a0 });
const _c2 = a0 => ({ "bg-red-50 dark:bg-red-900/10": a0 });
const _c3 = a0 => ({ "text-red-500 dark:text-red-400": a0 });
const _c4 = a0 => ({ "text-slate-600 dark:text-slate-300": a0 });
const _forTrack0 = ($index, $item) => $item.name;
const _forTrack1 = ($index, $item) => $item.var;
const _forTrack2 = ($index, $item) => $item.id;
const _forTrack3 = ($index, $item) => $item.value;
const _forTrack4 = ($index, $item) => $item.label;
function CalculatorComponent_Conditional_1_Conditional_23_Conditional_14_For_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "option", 69);
} if (rf & 2) {
    const description_r4 = ctx.$implicit;
    i0.ɵɵproperty("value", description_r4.name);
} }
function CalculatorComponent_Conditional_1_Conditional_23_Conditional_14_For_12_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 77);
    i0.ɵɵlistener("click", function CalculatorComponent_Conditional_1_Conditional_23_Conditional_14_For_12_Conditional_5_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r6); const sample_r7 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.applyDescriptionToAllSamples(sample_r7)); });
    i0.ɵɵtext(1, " \u00C1p d\u1EE5ng t\u1EA5t c\u1EA3 ");
    i0.ɵɵelementEnd();
} }
function CalculatorComponent_Conditional_1_Conditional_23_Conditional_14_For_12_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 71)(1, "div", 72)(2, "div", 73);
    i0.ɵɵelement(3, "i", 74);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, CalculatorComponent_Conditional_1_Conditional_23_Conditional_14_For_12_Conditional_5_Template, 2, 0, "button", 75);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "input", 76);
    i0.ɵɵlistener("ngModelChange", function CalculatorComponent_Conditional_1_Conditional_23_Conditional_14_For_12_Template_input_ngModelChange_6_listener($event) { const sample_r7 = i0.ɵɵrestoreView(_r5).$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.updateSampleDescription(sample_r7, $event)); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const sample_r7 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("", sample_r7, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.getSampleDescriptionName(sample_r7) ? 5 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngModel", ctx_r1.getSampleDescriptionName(sample_r7))("ngModelOptions", i0.ɵɵpureFunction0(4, _c0));
} }
function CalculatorComponent_Conditional_1_Conditional_23_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 45)(1, "div", 64)(2, "label", 65);
    i0.ɵɵelement(3, "i", 66);
    i0.ɵɵtext(4, " M\u00F4 t\u1EA3 m\u1EABu ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span", 67);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "datalist", 68);
    i0.ɵɵrepeaterCreate(8, CalculatorComponent_Conditional_1_Conditional_23_Conditional_14_For_9_Template, 1, 1, "option", 69, _forTrack2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "div", 70);
    i0.ɵɵrepeaterCreate(11, CalculatorComponent_Conditional_1_Conditional_23_Conditional_14_For_12_Template, 7, 5, "div", 71, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate2(" ", ctx_r1.sampleDescriptionCount(), "/", ctx_r1.samplesList().length, " m\u1EABu ");
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r1.availableSampleDescriptions());
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r1.samplesList());
} }
function CalculatorComponent_Conditional_1_Conditional_23_Conditional_15_Conditional_8_Conditional_5_For_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 69);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const g_r11 = ctx.$implicit;
    i0.ɵɵproperty("value", g_r11.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(g_r11.name);
} }
function CalculatorComponent_Conditional_1_Conditional_23_Conditional_15_Conditional_8_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "select", 93);
    i0.ɵɵlistener("change", function CalculatorComponent_Conditional_1_Conditional_23_Conditional_15_Conditional_8_Conditional_5_Template_select_change_0_listener($event) { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(5); ctx_r1.applyTargetGroup($event.target.value); return i0.ɵɵresetView($event.target.value = ""); });
    i0.ɵɵelementStart(1, "option", 94);
    i0.ɵɵtext(2, "Ch\u1ECDn nh\u00F3m...");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(3, CalculatorComponent_Conditional_1_Conditional_23_Conditional_15_Conditional_8_Conditional_5_For_4_Template, 2, 2, "option", 69, _forTrack2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(5);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r1.targetGroups());
} }
function CalculatorComponent_Conditional_1_Conditional_23_Conditional_15_Conditional_8_For_10_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 98);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const target_r14 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(target_r14.lod);
} }
function CalculatorComponent_Conditional_1_Conditional_23_Conditional_15_Conditional_8_For_10_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "label", 95)(1, "input", 96);
    i0.ɵɵlistener("change", function CalculatorComponent_Conditional_1_Conditional_23_Conditional_15_Conditional_8_For_10_Template_input_change_1_listener() { const target_r14 = i0.ɵɵrestoreView(_r13).$implicit; const ctx_r1 = i0.ɵɵnextContext(5); return i0.ɵɵresetView(ctx_r1.toggleTarget(target_r14.id)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "span", 97);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(4, CalculatorComponent_Conditional_1_Conditional_23_Conditional_15_Conditional_8_For_10_Conditional_4_Template, 2, 1, "span", 98);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const target_r14 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(5);
    i0.ɵɵclassMap(ctx_r1.selectedTargets().has(target_r14.id) ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800" : "bg-white dark:bg-slate-800 border border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50");
    i0.ɵɵadvance();
    i0.ɵɵproperty("checked", ctx_r1.selectedTargets().has(target_r14.id));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(target_r14._displayName || target_r14.name);
    i0.ɵɵadvance();
    i0.ɵɵconditional(target_r14.lod ? 4 : -1);
} }
function CalculatorComponent_Conditional_1_Conditional_23_Conditional_15_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 84)(1, "div", 85)(2, "div", 86);
    i0.ɵɵelement(3, "i", 87);
    i0.ɵɵelementStart(4, "input", 88);
    i0.ɵɵlistener("ngModelChange", function CalculatorComponent_Conditional_1_Conditional_23_Conditional_15_Conditional_8_Template_input_ngModelChange_4_listener($event) { i0.ɵɵrestoreView(_r9); const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.targetSearchTerm.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(5, CalculatorComponent_Conditional_1_Conditional_23_Conditional_15_Conditional_8_Conditional_5_Template, 5, 0, "select", 89);
    i0.ɵɵelementStart(6, "button", 90);
    i0.ɵɵlistener("click", function CalculatorComponent_Conditional_1_Conditional_23_Conditional_15_Conditional_8_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r9); const currentSop_r12 = i0.ɵɵnextContext(3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.toggleAllTargets(currentSop_r12.targets)); });
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 91);
    i0.ɵɵrepeaterCreate(9, CalculatorComponent_Conditional_1_Conditional_23_Conditional_15_Conditional_8_For_10_Template, 5, 5, "label", 92, _forTrack2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const currentSop_r12 = i0.ɵɵnextContext(3);
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r1.targetSearchTerm())("ngModelOptions", i0.ɵɵpureFunction0(4, _c0));
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.targetGroups().length > 0 ? 5 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.isAllSelected(currentSop_r12.targets) ? "B\u1ECF ch\u1ECDn" : "Ch\u1ECDn h\u1EBFt", " ");
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r1.filteredTargets());
} }
function CalculatorComponent_Conditional_1_Conditional_23_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 46)(1, "button", 78);
    i0.ɵɵlistener("click", function CalculatorComponent_Conditional_1_Conditional_23_Conditional_15_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r8); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.targetsOpen.set(!ctx_r1.targetsOpen())); });
    i0.ɵɵelementStart(2, "div", 79)(3, "div", 80);
    i0.ɵɵelement(4, "i", 81);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span", 82);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(7, "i", 83);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(8, CalculatorComponent_Conditional_1_Conditional_23_Conditional_15_Conditional_8_Template, 11, 5, "div", 84);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const currentSop_r12 = i0.ɵɵnextContext(2);
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate2("Ch\u1EC9 ti\u00EAu (", ctx_r1.selectedTargets().size, "/", currentSop_r12.targets.length, ")");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("rotate-180", ctx_r1.targetsOpen());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.targetsOpen() ? 8 : -1);
} }
function CalculatorComponent_Conditional_1_Conditional_23_Conditional_16_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    const _r15 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 105);
    i0.ɵɵlistener("click", function CalculatorComponent_Conditional_1_Conditional_23_Conditional_16_Conditional_5_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r15); const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.resetMatrix()); });
    i0.ɵɵelement(1, "i", 106);
    i0.ɵɵtext(2, " Thi\u1EBFt L\u1EADp L\u1EA1i ");
    i0.ɵɵelementEnd();
} }
function CalculatorComponent_Conditional_1_Conditional_23_Conditional_16_For_8_For_6_Template(rf, ctx) { if (rf & 1) {
    const _r16 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 111);
    i0.ɵɵlistener("click", function CalculatorComponent_Conditional_1_Conditional_23_Conditional_16_For_8_For_6_Template_button_click_0_listener() { const target_r17 = i0.ɵɵrestoreView(_r16).$implicit; const sample_r18 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.toggleMatrixCell(sample_r18, target_r17.id)); });
    i0.ɵɵelement(1, "i", 112);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const target_r17 = ctx.$implicit;
    const sample_r18 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵclassMap(ctx_r1.isTargetCheckedForSample(sample_r18, target_r17.id) ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 shadow-sm" : "bg-slate-50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 border-slate-200/60 dark:border-slate-700/60");
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.isTargetCheckedForSample(sample_r18, target_r17.id) ? "fa-circle-check text-emerald-600 dark:text-emerald-500" : "fa-circle text-slate-300 dark:text-slate-700");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", target_r17._displayName || target_r17.name, " ");
} }
function CalculatorComponent_Conditional_1_Conditional_23_Conditional_16_For_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 104)(1, "div", 107);
    i0.ɵɵelement(2, "i", 108);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 109);
    i0.ɵɵrepeaterCreate(5, CalculatorComponent_Conditional_1_Conditional_23_Conditional_16_For_8_For_6_Template, 3, 5, "button", 110, _forTrack2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const sample_r18 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" M\u1EABu: ", sample_r18, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r1.getSelectedTargetsList());
} }
function CalculatorComponent_Conditional_1_Conditional_23_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 47)(1, "div", 99)(2, "span", 100);
    i0.ɵɵelement(3, "i", 101);
    i0.ɵɵtext(4, " Ch\u1EC9 ti\u00EAu t\u1EEBng m\u1EABu ");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, CalculatorComponent_Conditional_1_Conditional_23_Conditional_16_Conditional_5_Template, 3, 0, "button", 102);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 103);
    i0.ɵɵrepeaterCreate(7, CalculatorComponent_Conditional_1_Conditional_23_Conditional_16_For_8_Template, 7, 1, "div", 104, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(5);
    i0.ɵɵconditional(ctx_r1.isMatrixCustomized() ? 5 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r1.samplesList());
} }
function CalculatorComponent_Conditional_1_Conditional_23_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 56);
    i0.ɵɵtext(1, "Vui l\u00F2ng ch\u1ECDn ng\u00E0y ki\u1EC3m nghi\u1EC7m.");
    i0.ɵɵelementEnd();
} }
function CalculatorComponent_Conditional_1_Conditional_23_For_30_Case_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "label", 114)(1, "span", 115);
    i0.ɵɵtext(2, "K\u00EDch ho\u1EA1t");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(3, "input", 116);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const inp_r19 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("formControlName", inp_r19.var);
} }
function CalculatorComponent_Conditional_1_Conditional_23_For_30_Case_4_For_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 69);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const opt_r20 = ctx.$implicit;
    i0.ɵɵproperty("value", opt_r20.value);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(opt_r20.label);
} }
function CalculatorComponent_Conditional_1_Conditional_23_For_30_Case_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 53)(1, "select", 117);
    i0.ɵɵrepeaterCreate(2, CalculatorComponent_Conditional_1_Conditional_23_For_30_Case_4_For_3_Template, 2, 2, "option", 69, _forTrack3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 118);
    i0.ɵɵelement(5, "i", 119);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const inp_r19 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("formControlName", inp_r19.var);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(inp_r19.options);
} }
function CalculatorComponent_Conditional_1_Conditional_23_For_30_Case_5_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 121);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const inp_r19 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(inp_r19.unitLabel);
} }
function CalculatorComponent_Conditional_1_Conditional_23_For_30_Case_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 53);
    i0.ɵɵelement(1, "input", 120);
    i0.ɵɵtemplate(2, CalculatorComponent_Conditional_1_Conditional_23_For_30_Case_5_Conditional_2_Template, 2, 1, "span", 121);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const inp_r19 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵproperty("formControlName", inp_r19.var)("step", inp_r19.step || 1)("ngClass", i0.ɵɵpureFunction1(5, _c1, inp_r19.var === "n_sample" && ctx_r1.sampleListText().length > 0))("readonly", inp_r19.var === "n_sample" && ctx_r1.sampleListText().length > 0);
    i0.ɵɵadvance();
    i0.ɵɵconditional(inp_r19.unitLabel ? 2 : -1);
} }
function CalculatorComponent_Conditional_1_Conditional_23_For_30_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 50)(1, "label", 113);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(3, CalculatorComponent_Conditional_1_Conditional_23_For_30_Case_3_Template, 4, 1, "label", 114)(4, CalculatorComponent_Conditional_1_Conditional_23_For_30_Case_4_Template, 6, 1, "div", 53)(5, CalculatorComponent_Conditional_1_Conditional_23_For_30_Case_5_Template, 3, 7, "div", 53);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    let tmp_14_0;
    const inp_r19 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(inp_r19.label);
    i0.ɵɵadvance();
    i0.ɵɵconditional((tmp_14_0 = inp_r19.type) === "checkbox" ? 3 : tmp_14_0 === "select" ? 4 : 5);
} }
function CalculatorComponent_Conditional_1_Conditional_23_Conditional_40_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 62)(1, "div", 122);
    i0.ɵɵelement(2, "i", 123);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div")(4, "div", 124);
    i0.ɵɵtext(5, "Ch\u1EBF \u0111\u1ED9 T\u1EF1 \u0111\u1ED9ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 125);
    i0.ɵɵtext(7, "\u00C1p d\u1EE5ng theo t\u1EEBng lo\u1EA1i h\u00F3a ch\u1EA5t");
    i0.ɵɵelementEnd()()();
} }
function CalculatorComponent_Conditional_1_Conditional_23_Conditional_41_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 63);
    i0.ɵɵelement(1, "input", 126);
    i0.ɵɵelementStart(2, "span", 121);
    i0.ɵɵtext(3, "%");
    i0.ɵɵelementEnd()();
} }
function CalculatorComponent_Conditional_1_Conditional_23_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "form", 20)(1, "div", 37)(2, "div", 38)(3, "label", 39)(4, "span");
    i0.ɵɵtext(5, "Danh s\u00E1ch m\u00E3 m\u1EABu");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "button", 40);
    i0.ɵɵlistener("click", function CalculatorComponent_Conditional_1_Conditional_23_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openQuickGenerateModal()); });
    i0.ɵɵelement(7, "i", 41);
    i0.ɵɵtext(8, " T\u1EA1o Nhanh ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "span", 42);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "textarea", 43);
    i0.ɵɵlistener("ngModelChange", function CalculatorComponent_Conditional_1_Conditional_23_Template_textarea_ngModelChange_11_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onSampleListChange($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "p", 44);
    i0.ɵɵtext(13, "* T\u1EF1 \u0111\u1ED9ng c\u1EADp nh\u1EADt s\u1ED1 l\u01B0\u1EE3ng m\u1EABu b\u00EAn d\u01B0\u1EDBi.");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(14, CalculatorComponent_Conditional_1_Conditional_23_Conditional_14_Template, 13, 2, "div", 45);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(15, CalculatorComponent_Conditional_1_Conditional_23_Conditional_15_Template, 9, 5, "div", 46)(16, CalculatorComponent_Conditional_1_Conditional_23_Conditional_16_Template, 9, 1, "div", 47);
    i0.ɵɵelement(17, "div", 48);
    i0.ɵɵelementStart(18, "div", 49)(19, "div", 50)(20, "label", 51);
    i0.ɵɵtext(21, " Ng\u00E0y ki\u1EC3m nghi\u1EC7m d\u1EF1 ki\u1EBFn ");
    i0.ɵɵelementStart(22, "span", 52);
    i0.ɵɵtext(23, "*");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(24, "div", 53);
    i0.ɵɵelement(25, "input", 54);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "p", 55);
    i0.ɵɵtext(27, "D\u00F9ng \u0111\u1EC3 \u0111\u01B0a m\u1EBB v\u00E0o \u0111\u00FAng ng\u00E0y tr\u00EAn B\u1EA3ng theo d\u00F5i m\u1EABu ng\u00E0y.");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(28, CalculatorComponent_Conditional_1_Conditional_23_Conditional_28_Template, 2, 0, "p", 56);
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(29, CalculatorComponent_Conditional_1_Conditional_23_For_30_Template, 6, 2, "div", 50, _forTrack1);
    i0.ɵɵelementStart(31, "div", 57)(32, "div", 58)(33, "label", 59);
    i0.ɵɵtext(34, "H\u1EC7 s\u1ED1 hao h\u1EE5t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "div", 60)(36, "button", 61);
    i0.ɵɵlistener("click", function CalculatorComponent_Conditional_1_Conditional_23_Template_button_click_36_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.setMarginMode("auto")); });
    i0.ɵɵtext(37, " T\u1EF1 \u0110\u1ED9ng ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(38, "button", 61);
    i0.ɵɵlistener("click", function CalculatorComponent_Conditional_1_Conditional_23_Template_button_click_38_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.setMarginMode("manual")); });
    i0.ɵɵtext(39, " T\u00F9y Ch\u1EC9nh ");
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(40, CalculatorComponent_Conditional_1_Conditional_23_Conditional_40_Template, 8, 0, "div", 62)(41, CalculatorComponent_Conditional_1_Conditional_23_Conditional_41_Template, 4, 0, "div", 63);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    let tmp_10_0;
    let tmp_11_0;
    const currentSop_r12 = i0.ɵɵnextContext();
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("formGroup", ctx_r1.form());
    i0.ɵɵadvance(10);
    i0.ɵɵtextInterpolate1("", ctx_r1.sampleCount(), " m\u1EABu");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngModel", ctx_r1.sampleListText())("ngModelOptions", i0.ɵɵpureFunction0(15, _c0));
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r1.samplesList().length > 0 ? 14 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(currentSop_r12.targets && currentSop_r12.targets.length > 0 ? 15 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.getSelectedTargetsList().length > 0 && ctx_r1.samplesList().length > 0 ? 16 : -1);
    i0.ɵɵadvance(9);
    i0.ɵɵclassProp("border-red-400", ((tmp_10_0 = ctx_r1.form().get("analysisDate")) == null ? null : tmp_10_0.invalid) && ((tmp_10_0 = ctx_r1.form().get("analysisDate")) == null ? null : tmp_10_0.touched));
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(((tmp_11_0 = ctx_r1.form().get("analysisDate")) == null ? null : tmp_11_0.invalid) && ((tmp_11_0 = ctx_r1.form().get("analysisDate")) == null ? null : tmp_11_0.touched) ? 28 : -1);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(currentSop_r12.inputs);
    i0.ɵɵadvance(7);
    i0.ɵɵclassMap(ctx_r1.marginMode() === "auto" ? "bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300");
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r1.marginMode() === "manual" ? "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 shadow-sm" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.marginMode() === "auto" ? 40 : 41);
} }
function CalculatorComponent_Conditional_1_Conditional_25_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 134);
    i0.ɵɵelement(1, "i", 142);
    i0.ɵɵtext(2, " Ch\u01B0a ph\u00E1t hi\u1EC7n thay \u0111\u1ED5i so v\u1EDBi m\u1EBB hi\u1EC7n t\u1EA1i. ");
    i0.ɵɵelementEnd();
} }
function CalculatorComponent_Conditional_1_Conditional_25_Conditional_10_Conditional_0_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 145)(1, "div", 146);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 147)(4, "span", 148);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(6, "i", 149);
    i0.ɵɵelementStart(7, "span", 150);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const change_r22 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(change_r22.label);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("title", change_r22.before);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(change_r22.before);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("title", change_r22.after);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(change_r22.after);
} }
function CalculatorComponent_Conditional_1_Conditional_25_Conditional_10_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 143);
    i0.ɵɵrepeaterCreate(1, CalculatorComponent_Conditional_1_Conditional_25_Conditional_10_Conditional_0_For_2_Template, 9, 5, "div", 145, _forTrack4);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.editInfoChanges());
} }
function CalculatorComponent_Conditional_1_Conditional_25_Conditional_10_Conditional_1_For_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 153)(1, "span", 154);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 155);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const row_r23 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(5);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(row_r23.name);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("text-red-600", row_r23.diff > 0)("dark:text-red-400", row_r23.diff > 0)("text-emerald-600", row_r23.diff < 0)("dark:text-emerald-400", row_r23.diff < 0);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate3(" ", row_r23.diff > 0 ? "+" : "", "", ctx_r1.formatNum(row_r23.diff), " ", row_r23.unit, " ");
} }
function CalculatorComponent_Conditional_1_Conditional_25_Conditional_10_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 144)(1, "div", 151);
    i0.ɵɵtext(2, "Ch\u00EAnh l\u1EC7ch t\u1ED3n kho");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 152);
    i0.ɵɵrepeaterCreate(4, CalculatorComponent_Conditional_1_Conditional_25_Conditional_10_Conditional_1_For_5_Template, 5, 12, "div", 153, _forTrack0);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx_r1.editInventoryDiff());
} }
function CalculatorComponent_Conditional_1_Conditional_25_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, CalculatorComponent_Conditional_1_Conditional_25_Conditional_10_Conditional_0_Template, 3, 0, "div", 143)(1, CalculatorComponent_Conditional_1_Conditional_25_Conditional_10_Conditional_1_Template, 6, 0, "div", 144);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵconditional(ctx_r1.editInfoChanges().length > 0 ? 0 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.editInventoryDiff().length > 0 ? 1 : -1);
} }
function CalculatorComponent_Conditional_1_Conditional_25_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 138);
} }
function CalculatorComponent_Conditional_1_Conditional_25_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 139);
} }
function CalculatorComponent_Conditional_1_Conditional_25_Template(rf, ctx) { if (rf & 1) {
    const _r21 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 127)(1, "div", 128)(2, "div", 129);
    i0.ɵɵelement(3, "i", 130);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 131)(5, "div", 132);
    i0.ɵɵtext(6, "Xem tr\u01B0\u1EDBc thay \u0111\u1ED5i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div", 133);
    i0.ɵɵtext(8, " Khi l\u01B0u, h\u1EC7 th\u1ED1ng s\u1EBD c\u1EADp nh\u1EADt m\u1EBB, \u0111i\u1EC1u ch\u1EC9nh t\u1ED3n kho theo ch\u00EAnh l\u1EC7ch v\u00E0 t\u1EA1o l\u1EA1i phi\u1EBFu trong h\u00E0ng \u0111\u1EE3i in. ");
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(9, CalculatorComponent_Conditional_1_Conditional_25_Conditional_9_Template, 3, 0, "div", 134)(10, CalculatorComponent_Conditional_1_Conditional_25_Conditional_10_Template, 2, 2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "button", 135);
    i0.ɵɵlistener("click", function CalculatorComponent_Conditional_1_Conditional_25_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r21); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.goToResultsEntry()); });
    i0.ɵɵelement(12, "i", 136);
    i0.ɵɵtext(13, " Nh\u1EADp K\u1EBFt Qu\u1EA3 Ngay ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "button", 137);
    i0.ɵɵlistener("click", function CalculatorComponent_Conditional_1_Conditional_25_Template_button_click_14_listener() { i0.ɵɵrestoreView(_r21); const currentSop_r12 = i0.ɵɵnextContext(); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.saveEditedRequest(currentSop_r12)); });
    i0.ɵɵtemplate(15, CalculatorComponent_Conditional_1_Conditional_25_Conditional_15_Template, 1, 0, "i", 138)(16, CalculatorComponent_Conditional_1_Conditional_25_Conditional_16_Template, 1, 0, "i", 139);
    i0.ɵɵtext(17, " L\u01B0u thay \u0111\u1ED5i ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "button", 140);
    i0.ɵɵlistener("click", function CalculatorComponent_Conditional_1_Conditional_25_Template_button_click_18_listener() { i0.ɵɵrestoreView(_r21); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.cancelEdit()); });
    i0.ɵɵelement(19, "i", 141);
    i0.ɵɵtext(20, " H\u1EE7y Ch\u1EC9nh S\u1EEDa ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(9);
    i0.ɵɵconditional(!ctx_r1.hasEditChanges() ? 9 : 10);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r1.isProcessing());
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("disabled", ctx_r1.isProcessing() || ctx_r1.form().invalid);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isProcessing() ? 15 : 16);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("disabled", ctx_r1.isProcessing());
} }
function CalculatorComponent_Conditional_1_Conditional_26_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 138);
} }
function CalculatorComponent_Conditional_1_Conditional_26_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 156);
} }
function CalculatorComponent_Conditional_1_Conditional_26_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 138);
    i0.ɵɵtext(1, " \u0110ang x\u1EED l\u00FD... ");
} }
function CalculatorComponent_Conditional_1_Conditional_26_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 159);
    i0.ɵɵtext(1, " Duy\u1EC7t & \u0110\u01B0a V\u00E0o H\u00E0ng \u0110\u1EE3i In ");
} }
function CalculatorComponent_Conditional_1_Conditional_26_Template(rf, ctx) { if (rf & 1) {
    const _r24 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 140);
    i0.ɵɵlistener("click", function CalculatorComponent_Conditional_1_Conditional_26_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r24); const currentSop_r12 = i0.ɵɵnextContext(); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onPrintDraft(currentSop_r12)); });
    i0.ɵɵtemplate(1, CalculatorComponent_Conditional_1_Conditional_26_Conditional_1_Template, 1, 0, "i", 138)(2, CalculatorComponent_Conditional_1_Conditional_26_Conditional_2_Template, 1, 0, "i", 156);
    i0.ɵɵtext(3, " In Nh\u00E1p (Xem tr\u01B0\u1EDBc) ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "button", 137);
    i0.ɵɵlistener("click", function CalculatorComponent_Conditional_1_Conditional_26_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r24); const currentSop_r12 = i0.ɵɵnextContext(); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.sendRequest(currentSop_r12)); });
    i0.ɵɵelement(5, "i", 157);
    i0.ɵɵtext(6, " G\u1EEDi Y\u00EAu C\u1EA7u Duy\u1EC7t ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "button", 158);
    i0.ɵɵlistener("click", function CalculatorComponent_Conditional_1_Conditional_26_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r24); const currentSop_r12 = i0.ɵɵnextContext(); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.approveAndQueuePrintJob(currentSop_r12)); });
    i0.ɵɵtemplate(8, CalculatorComponent_Conditional_1_Conditional_26_Conditional_8_Template, 2, 0)(9, CalculatorComponent_Conditional_1_Conditional_26_Conditional_9_Template, 2, 0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("disabled", ctx_r1.isProcessing() || ctx_r1.form().invalid);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isProcessing() ? 1 : 2);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("disabled", ctx_r1.isProcessing() || ctx_r1.form().invalid);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("appLockPermission", "sop_approve")("disabled", ctx_r1.isProcessing() || ctx_r1.form().invalid);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isProcessing() ? 8 : 9);
} }
function CalculatorComponent_Conditional_1_Conditional_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 26);
    i0.ɵɵelement(1, "i", 160);
    i0.ɵɵelementStart(2, "span", 161);
    i0.ɵɵtext(3, "\u0110ang ki\u1EC3m tra kho...");
    i0.ɵɵelementEnd()();
} }
function CalculatorComponent_Conditional_1_Conditional_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 27);
    i0.ɵɵelement(1, "i", 162);
    i0.ɵɵtext(2, "\u0110\u00E3 \u0111\u1ED3ng b\u1ED9 kho");
    i0.ɵɵelementEnd();
} }
function CalculatorComponent_Conditional_1_For_52_Conditional_6_For_2_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "img", 180);
} if (rf & 2) {
    const ghs_r25 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵproperty("src", ctx_r1.GHS_DICT[ghs_r25].iconUrl, i0.ɵɵsanitizeUrl)("title", ctx_r1.GHS_DICT[ghs_r25].label);
} }
function CalculatorComponent_Conditional_1_For_52_Conditional_6_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, CalculatorComponent_Conditional_1_For_52_Conditional_6_For_2_Conditional_0_Template, 1, 2, "img", 180);
} if (rf & 2) {
    const ghs_r25 = ctx.$implicit;
    i0.ɵɵconditional(ghs_r25.startsWith("GHS") ? 0 : -1);
} }
function CalculatorComponent_Conditional_1_For_52_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 168);
    i0.ɵɵrepeaterCreate(1, CalculatorComponent_Conditional_1_For_52_Conditional_6_For_2_Template, 1, 1, null, null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r26 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵrepeater(item_r26.ghsWarnings);
} }
function CalculatorComponent_Conditional_1_For_52_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 169);
    i0.ɵɵelement(1, "i", 181);
    i0.ɵɵtext(2, " Kh\u00F4ng c\u00F3 trong kho");
    i0.ɵɵelementEnd();
} }
function CalculatorComponent_Conditional_1_For_52_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 170);
    i0.ɵɵelement(1, "i", 182);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r26 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", item_r26.displayWarning, "");
} }
function CalculatorComponent_Conditional_1_For_52_Conditional_24_For_7_Conditional_4_For_2_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "img", 196);
} if (rf & 2) {
    const ghs_r27 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(6);
    i0.ɵɵproperty("src", ctx_r1.GHS_DICT[ghs_r27].iconUrl, i0.ɵɵsanitizeUrl)("title", ctx_r1.GHS_DICT[ghs_r27].label);
} }
function CalculatorComponent_Conditional_1_For_52_Conditional_24_For_7_Conditional_4_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, CalculatorComponent_Conditional_1_For_52_Conditional_24_For_7_Conditional_4_For_2_Conditional_0_Template, 1, 2, "img", 196);
} if (rf & 2) {
    const ghs_r27 = ctx.$implicit;
    i0.ɵɵconditional(ghs_r27.startsWith("GHS") ? 0 : -1);
} }
function CalculatorComponent_Conditional_1_For_52_Conditional_24_For_7_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 168);
    i0.ɵɵrepeaterCreate(1, CalculatorComponent_Conditional_1_For_52_Conditional_24_For_7_Conditional_4_For_2_Template, 1, 1, null, null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const sub_r28 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵrepeater(sub_r28.ghsWarnings);
} }
function CalculatorComponent_Conditional_1_For_52_Conditional_24_For_7_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 189);
} }
function CalculatorComponent_Conditional_1_For_52_Conditional_24_For_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 187)(1, "div", 79)(2, "span", 188);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(4, CalculatorComponent_Conditional_1_For_52_Conditional_24_For_7_Conditional_4_Template, 3, 0, "div", 168)(5, CalculatorComponent_Conditional_1_For_52_Conditional_24_For_7_Conditional_5_Template, 1, 0, "i", 189);
    i0.ɵɵelementStart(6, "span", 190);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 4)(9, "span", 191);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "span", 192);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "div", 193)(14, "span", 194);
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "span", 195);
    i0.ɵɵtext(17);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const sub_r28 = ctx.$implicit;
    const item_r26 = i0.ɵɵnextContext(2).$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction1(11, _c3, sub_r28.isMissing));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction1(13, _c4, !sub_r28.isMissing));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.resolveName(sub_r28));
    i0.ɵɵadvance();
    i0.ɵɵconditional(sub_r28.ghsWarnings && sub_r28.ghsWarnings.length > 0 ? 4 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(sub_r28.isMissing ? 5 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("(", sub_r28.amountPerUnit, " / ", item_r26.unit, ")");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("\u0110\u1ECBnh m\u1EE9c: ", ctx_r1.formatNum(sub_r28.baseAmount || 0), "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("+", sub_r28.appliedMargin || 0, "%");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.formatNum(sub_r28.displayAmount));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(sub_r28.unit);
} }
function CalculatorComponent_Conditional_1_For_52_Conditional_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 179)(1, "td", 183)(2, "div", 184)(3, "div", 185);
    i0.ɵɵtext(4, "Th\u00E0nh ph\u1EA7n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 186);
    i0.ɵɵrepeaterCreate(6, CalculatorComponent_Conditional_1_For_52_Conditional_24_For_7_Template, 18, 15, "div", 187, _forTrack0);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const item_r26 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(6);
    i0.ɵɵrepeater(item_r26.breakdown);
} }
function CalculatorComponent_Conditional_1_For_52_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 163)(1, "td", 164)(2, "div", 165)(3, "span", 166);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 167);
    i0.ɵɵtemplate(6, CalculatorComponent_Conditional_1_For_52_Conditional_6_Template, 3, 0, "div", 168)(7, CalculatorComponent_Conditional_1_For_52_Conditional_7_Template, 3, 0, "span", 169)(8, CalculatorComponent_Conditional_1_For_52_Conditional_8_Template, 3, 1, "span", 170);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(9, "td", 171)(10, "code", 172);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "td", 171)(13, "span", 173);
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "td", 171)(16, "span", 174);
    i0.ɵɵtext(17);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(18, "td", 175)(19, "span", 176);
    i0.ɵɵtext(20);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(21, "td", 177)(22, "span", 178);
    i0.ɵɵtext(23);
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(24, CalculatorComponent_Conditional_1_For_52_Conditional_24_Template, 8, 0, "tr", 179);
} if (rf & 2) {
    const item_r26 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction1(11, _c2, item_r26.isMissing));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.resolveName(item_r26), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(item_r26.ghsWarnings && item_r26.ghsWarnings.length > 0 ? 6 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r26.isMissing ? 7 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r26.displayWarning ? 8 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r26.formula);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.formatNum(item_r26.baseQty || 0));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("+", item_r26.appliedMargin || 0, "%");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.formatNum(item_r26.totalQty));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r26.unit);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r26.isComposite ? 24 : -1);
} }
function CalculatorComponent_Conditional_1_ForEmpty_53_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 197);
    i0.ɵɵtext(2, "Ch\u01B0a c\u00F3 d\u1EEF li\u1EC7u t\u00EDnh to\u00E1n.");
    i0.ɵɵelementEnd()();
} }
function CalculatorComponent_Conditional_1_Conditional_54_For_6_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 203);
    i0.ɵɵelement(1, "img", 204);
    i0.ɵɵelementStart(2, "div", 205);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const code_r29 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵproperty("src", ctx_r1.GHS_DICT[code_r29].iconUrl, i0.ɵɵsanitizeUrl)("title", ctx_r1.GHS_DICT[code_r29].label);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.GHS_DICT[code_r29].label);
} }
function CalculatorComponent_Conditional_1_Conditional_54_For_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, CalculatorComponent_Conditional_1_Conditional_54_For_6_Conditional_0_Template, 4, 3, "div", 203);
} if (rf & 2) {
    const code_r29 = ctx.$implicit;
    i0.ɵɵconditional(code_r29.startsWith("GHS") ? 0 : -1);
} }
function CalculatorComponent_Conditional_1_Conditional_54_For_10_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li", 206);
    i0.ɵɵelement(1, "i", 207);
    i0.ɵɵelementStart(2, "span", 208);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const code_r30 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(code_r30);
} }
function CalculatorComponent_Conditional_1_Conditional_54_For_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, CalculatorComponent_Conditional_1_Conditional_54_For_10_Conditional_0_Template, 4, 1, "li", 206);
} if (rf & 2) {
    const code_r30 = ctx.$implicit;
    i0.ɵɵconditional(!code_r30.startsWith("GHS") ? 0 : -1);
} }
function CalculatorComponent_Conditional_1_Conditional_54_For_12_Conditional_0_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li", 209);
    i0.ɵɵelement(1, "i", 207);
    i0.ɵɵelementStart(2, "span", 208);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const rule_r31 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(rule_r31);
} }
function CalculatorComponent_Conditional_1_Conditional_54_For_12_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, CalculatorComponent_Conditional_1_Conditional_54_For_12_Conditional_0_For_1_Template, 4, 1, "li", 209, i0.ɵɵrepeaterTrackByIdentity);
} if (rf & 2) {
    const code_r32 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵrepeater(ctx_r1.GHS_DICT[code_r32].precautions);
} }
function CalculatorComponent_Conditional_1_Conditional_54_For_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, CalculatorComponent_Conditional_1_Conditional_54_For_12_Conditional_0_Template, 2, 0);
} if (rf & 2) {
    const code_r32 = ctx.$implicit;
    i0.ɵɵconditional(code_r32.startsWith("GHS") ? 0 : -1);
} }
function CalculatorComponent_Conditional_1_Conditional_54_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 36)(1, "h4", 198);
    i0.ɵɵelement(2, "i", 199);
    i0.ɵɵtext(3, " H\u01B0\u1EDBng D\u1EABn An To\u00E0n Tr\u01B0\u1EDBc Pha Ch\u1EBF ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 200);
    i0.ɵɵrepeaterCreate(5, CalculatorComponent_Conditional_1_Conditional_54_For_6_Template, 1, 1, null, null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div", 201)(8, "ul", 202);
    i0.ɵɵrepeaterCreate(9, CalculatorComponent_Conditional_1_Conditional_54_For_10_Template, 1, 1, null, null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵrepeaterCreate(11, CalculatorComponent_Conditional_1_Conditional_54_For_12_Template, 1, 1, null, null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(5);
    i0.ɵɵrepeater(ctx_r1.aggregateGHSWarnings());
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx_r1.aggregateGHSWarnings());
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r1.aggregateGHSWarnings());
} }
function CalculatorComponent_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 3)(1, "div", 4)(2, "div", 5);
    i0.ɵɵelement(3, "i", 6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div")(5, "div", 7)(6, "span", 8);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "h2", 9);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(10, "div", 10)(11, "button", 11);
    i0.ɵɵlistener("click", function CalculatorComponent_Conditional_1_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.clearSelection()); });
    i0.ɵɵelement(12, "i", 12);
    i0.ɵɵtext(13, " Th\u01B0 Vi\u1EC7n ");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(14, "div", 13)(15, "div", 14)(16, "div", 15)(17, "div", 16);
    i0.ɵɵelement(18, "i", 17);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "div")(20, "h3", 18);
    i0.ɵɵtext(21, "Th\u00F4ng S\u1ED1 M\u1EBB M\u1EABu");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(22, "div", 19);
    i0.ɵɵtemplate(23, CalculatorComponent_Conditional_1_Conditional_23_Template, 42, 16, "form", 20);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "div", 21);
    i0.ɵɵtemplate(25, CalculatorComponent_Conditional_1_Conditional_25_Template, 21, 5)(26, CalculatorComponent_Conditional_1_Conditional_26_Template, 10, 6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(27, "div", 22)(28, "div", 23)(29, "h3", 24);
    i0.ɵɵelement(30, "i", 25);
    i0.ɵɵtext(31, " B\u1EA3ng D\u1EF1 Tr\u00F9 H\u00F3a Ch\u1EA5t ");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(32, CalculatorComponent_Conditional_1_Conditional_32_Template, 4, 0, "div", 26)(33, CalculatorComponent_Conditional_1_Conditional_33_Template, 3, 0, "span", 27);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "div", 28)(35, "table", 29)(36, "thead", 30)(37, "tr")(38, "th", 31);
    i0.ɵɵtext(39, "H\u00F3a ch\u1EA5t v\u00E0 v\u1EADt t\u01B0");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "th", 32);
    i0.ɵɵtext(41, "C\u00F4ng th\u1EE9c");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(42, "th", 32);
    i0.ɵɵtext(43, "\u0110\u1ECBnh m\u1EE9c");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(44, "th", 32);
    i0.ɵɵtext(45, "Ti\u00EAu hao");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(46, "th", 33);
    i0.ɵɵtext(47, "T\u1ED5ng c\u1EA7n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(48, "th", 34);
    i0.ɵɵtext(49, "\u0110\u01A1n v\u1ECB");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(50, "tbody", 35);
    i0.ɵɵrepeaterCreate(51, CalculatorComponent_Conditional_1_For_52_Template, 25, 13, null, null, _forTrack0, false, CalculatorComponent_Conditional_1_ForEmpty_53_Template, 3, 0, "tr");
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(54, CalculatorComponent_Conditional_1_Conditional_54_Template, 13, 0, "div", 36);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const currentSop_r12 = ctx;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate1(" ", currentSop_r12.category, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(currentSop_r12.name);
    i0.ɵɵadvance(14);
    i0.ɵɵconditional(ctx_r1.form() ? 23 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.editingRequest() ? 25 : 26);
    i0.ɵɵadvance(7);
    i0.ɵɵconditional(ctx_r1.isLoadingInventory() ? 32 : 33);
    i0.ɵɵadvance(19);
    i0.ɵɵrepeater(ctx_r1.calculatedItems());
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r1.aggregateGHSWarnings().length > 0 ? 54 : -1);
} }
function CalculatorComponent_Conditional_2_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    const _r34 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 220);
    i0.ɵɵlistener("click", function CalculatorComponent_Conditional_2_Conditional_15_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r34); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.libraryTab.set("recipes")); });
    i0.ɵɵelement(1, "i", 221);
    i0.ɵɵtext(2, " C\u00F4ng Th\u1EE9c Pha Ch\u1EBF ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵclassMap(ctx_r1.libraryTab() === "recipes" ? "border-purple-600 text-purple-700 dark:text-purple-400" : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300");
    i0.ɵɵproperty("appLockPermission", "recipe_view");
} }
function CalculatorComponent_Conditional_2_Conditional_16_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    const _r36 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 226)(1, "button", 231);
    i0.ɵɵlistener("click", function CalculatorComponent_Conditional_2_Conditional_16_Conditional_5_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r36); const importFileInput_r37 = i0.ɵɵreference(6); return i0.ɵɵresetView(importFileInput_r37.click()); });
    i0.ɵɵelement(2, "i", 232);
    i0.ɵɵelementStart(3, "span", 233);
    i0.ɵɵtext(4, "Nh\u1EADp");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "input", 234, 0);
    i0.ɵɵlistener("change", function CalculatorComponent_Conditional_2_Conditional_16_Conditional_5_Template_input_change_5_listener($event) { i0.ɵɵrestoreView(_r36); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.importSop($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "button", 235);
    i0.ɵɵlistener("click", function CalculatorComponent_Conditional_2_Conditional_16_Conditional_5_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r36); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.createNew()); });
    i0.ɵɵelement(8, "i", 236);
    i0.ɵɵelementStart(9, "span", 233);
    i0.ɵɵtext(10, "T\u1EA1o M\u1EDBi");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵproperty("appLockPermission", "sop_edit");
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("appLockPermission", "sop_edit");
} }
function CalculatorComponent_Conditional_2_Conditional_16_For_9_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 241);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const sop_r39 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("v", sop_r39.version, "");
} }
function CalculatorComponent_Conditional_2_Conditional_16_For_9_Conditional_8_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    const _r41 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 250);
    i0.ɵɵlistener("click", function CalculatorComponent_Conditional_2_Conditional_16_For_9_Conditional_8_Conditional_4_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r41); const sop_r39 = i0.ɵɵnextContext(2).$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.duplicateSop(sop_r39, $event)); });
    i0.ɵɵelement(1, "i", 251);
    i0.ɵɵtext(2, " Nh\u00E2n B\u1EA3n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "button", 250);
    i0.ɵɵlistener("click", function CalculatorComponent_Conditional_2_Conditional_16_For_9_Conditional_8_Conditional_4_Template_button_click_3_listener($event) { i0.ɵɵrestoreView(_r41); const sop_r39 = i0.ɵɵnextContext(2).$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.editDirect(sop_r39, $event)); });
    i0.ɵɵelement(4, "i", 252);
    i0.ɵɵtext(5, " Ch\u1EC9nh S\u1EEDa");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(6, "div", 253);
    i0.ɵɵelementStart(7, "button", 254);
    i0.ɵɵlistener("click", function CalculatorComponent_Conditional_2_Conditional_16_For_9_Conditional_8_Conditional_4_Template_button_click_7_listener($event) { i0.ɵɵrestoreView(_r41); const sop_r39 = i0.ɵɵnextContext(2).$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.softDeleteSop(sop_r39, $event)); });
    i0.ɵɵelement(8, "i", 255);
    i0.ɵɵtext(9, " L\u01B0u Tr\u1EEF");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵproperty("appLockPermission", "sop_edit");
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("appLockPermission", "sop_edit");
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("appLockPermission", "sop_edit");
} }
function CalculatorComponent_Conditional_2_Conditional_16_For_9_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    const _r40 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 247);
    i0.ɵɵlistener("click", function CalculatorComponent_Conditional_2_Conditional_16_For_9_Conditional_8_Template_div_click_0_listener($event) { i0.ɵɵrestoreView(_r40); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementStart(1, "button", 248);
    i0.ɵɵlistener("click", function CalculatorComponent_Conditional_2_Conditional_16_For_9_Conditional_8_Template_button_click_1_listener($event) { i0.ɵɵrestoreView(_r40); const sop_r39 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.exportSop(sop_r39, $event)); });
    i0.ɵɵelement(2, "i", 249);
    i0.ɵɵtext(3, " Xu\u1EA5t JSON");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(4, CalculatorComponent_Conditional_2_Conditional_16_For_9_Conditional_8_Conditional_4_Template, 10, 3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.canEditSop() || ctx_r1.state.showLockedFeatures() ? 4 : -1);
} }
function CalculatorComponent_Conditional_2_Conditional_16_For_9_Template(rf, ctx) { if (rf & 1) {
    const _r38 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 237);
    i0.ɵɵlistener("click", function CalculatorComponent_Conditional_2_Conditional_16_For_9_Template_div_click_0_listener() { const sop_r39 = i0.ɵɵrestoreView(_r38).$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.selectSop(sop_r39)); });
    i0.ɵɵelementStart(1, "div", 238)(2, "div", 239)(3, "span", 240);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, CalculatorComponent_Conditional_2_Conditional_16_For_9_Conditional_5_Template, 2, 1, "span", 241);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "button", 242);
    i0.ɵɵlistener("click", function CalculatorComponent_Conditional_2_Conditional_16_For_9_Template_button_click_6_listener($event) { const sop_r39 = i0.ɵɵrestoreView(_r38).$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.toggleMenu(sop_r39.id, $event)); });
    i0.ɵɵelement(7, "i", 243);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(8, CalculatorComponent_Conditional_2_Conditional_16_For_9_Conditional_8_Template, 5, 1, "div", 244);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "h3", 245);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "div", 246)(12, "span");
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "span");
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const sop_r39 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("title", sop_r39.category);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(sop_r39.category);
    i0.ɵɵadvance();
    i0.ɵɵconditional(sop_r39.version ? 5 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r1.activeMenuSopId() === sop_r39.id ? 8 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(sop_r39.name);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", sop_r39.consumables.length, " ch\u1EA5t");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.formatDate(sop_r39.lastModified));
} }
function CalculatorComponent_Conditional_2_Conditional_16_ForEmpty_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 230);
    i0.ɵɵelement(1, "i", 256);
    i0.ɵɵelementStart(2, "p");
    i0.ɵɵtext(3, "Ch\u01B0a c\u00F3 quy tr\u00ECnh n\u00E0o ph\u00F9 h\u1EE3p.");
    i0.ɵɵelementEnd()();
} }
function CalculatorComponent_Conditional_2_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    const _r35 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 218)(1, "div", 222)(2, "div", 223);
    i0.ɵɵelement(3, "i", 224);
    i0.ɵɵelementStart(4, "input", 225);
    i0.ɵɵlistener("ngModelChange", function CalculatorComponent_Conditional_2_Conditional_16_Template_input_ngModelChange_4_listener($event) { i0.ɵɵrestoreView(_r35); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.searchTerm.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(5, CalculatorComponent_Conditional_2_Conditional_16_Conditional_5_Template, 11, 2, "div", 226);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 227)(7, "div", 228);
    i0.ɵɵrepeaterCreate(8, CalculatorComponent_Conditional_2_Conditional_16_For_9_Template, 16, 7, "div", 229, _forTrack2, false, CalculatorComponent_Conditional_2_Conditional_16_ForEmpty_10_Template, 4, 0, "div", 230);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r1.searchTerm());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.canEditSop() || ctx_r1.state.showLockedFeatures() ? 5 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r1.filteredSops());
} }
function CalculatorComponent_Conditional_2_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 219);
    i0.ɵɵelement(1, "app-recipe-manager");
    i0.ɵɵelementEnd();
} }
function CalculatorComponent_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r33 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 2)(1, "div", 3)(2, "div", 4)(3, "div", 5);
    i0.ɵɵelement(4, "i", 210);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div")(6, "h2", 211);
    i0.ɵɵtext(7, "Th\u01B0 Vi\u1EC7n Quy Tr\u00ECnh v\u00E0 C\u00F4ng Th\u1EE9c");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "p", 212);
    i0.ɵɵtext(9, "Danh s\u00E1ch quy tr\u00ECnh chu\u1EA9n h\u00F3a SOP v\u00E0 c\u00F4ng th\u1EE9c pha ch\u1EBF c\u00F3 s\u1EB5n trong h\u1EC7 th\u1ED1ng.");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(10, "div", 213)(11, "div", 214)(12, "button", 215);
    i0.ɵɵlistener("click", function CalculatorComponent_Conditional_2_Template_button_click_12_listener() { i0.ɵɵrestoreView(_r33); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.libraryTab.set("sops")); });
    i0.ɵɵelement(13, "i", 216);
    i0.ɵɵtext(14, " Quy Tr\u00ECnh (SOPs) ");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(15, CalculatorComponent_Conditional_2_Conditional_15_Template, 3, 3, "button", 217);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(16, CalculatorComponent_Conditional_2_Conditional_16_Template, 11, 3, "div", 218)(17, CalculatorComponent_Conditional_2_Conditional_17_Template, 2, 0, "div", 219);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(12);
    i0.ɵɵclassMap(ctx_r1.libraryTab() === "sops" ? "border-blue-600 text-blue-700 dark:text-blue-400" : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300");
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r1.canViewRecipes() || ctx_r1.state.showLockedFeatures() ? 15 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.libraryTab() === "sops" ? 16 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.libraryTab() === "recipes" ? 17 : -1);
} }
function CalculatorComponent_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    const _r42 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-quick-generate-sample-modal", 257);
    i0.ɵɵlistener("close", function CalculatorComponent_Conditional_3_Template_app_quick_generate_sample_modal_close_0_listener() { i0.ɵɵrestoreView(_r42); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeQuickGenerateModal()); })("generated", function CalculatorComponent_Conditional_3_Template_app_quick_generate_sample_modal_generated_0_listener($event) { i0.ɵɵrestoreView(_r42); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.handleGeneratedSamples($event)); });
    i0.ɵɵelementEnd();
} }
export class CalculatorComponent {
    get GHS_DICT() { return GHS_DICTIONARY; }
    canViewRecipes() { return this.auth.canViewRecipes(); }
    canEditSop() { return this.auth.canEditSop(); }
    isTargetCheckedForSample(sample, targetId) {
        const map = this.customSampleTargetMap();
        return map[sample]?.has(targetId) || false;
    }
    toggleMatrixCell(sample, targetId) {
        this.isMatrixCustomized.set(true);
        this.targetSelectionModified.set(true);
        this.customSampleTargetMap.update(map => {
            const next = { ...map };
            const set = next[sample] ? new Set(next[sample]) : new Set();
            if (set.has(targetId)) {
                set.delete(targetId);
            }
            else {
                set.add(targetId);
            }
            next[sample] = set;
            return next;
        });
        // Re-run calculations
        this.runCalculation(this.activeSop(), this.form().value);
    }
    resetMatrix() {
        this.isMatrixCustomized.set(false);
        this.syncMatrixWithGlobals();
    }
    syncMatrixWithGlobals() {
        const samples = this.samplesList();
        const globalTargets = this.selectedTargets();
        const map = {};
        samples.forEach(sample => {
            map[sample] = new Set(globalTargets);
        });
        this.customSampleTargetMap.set(map);
        // Re-run calculations
        if (this.activeSop()) {
            this.runCalculation(this.activeSop(), this.form().value);
        }
    }
    constructor() {
        this.sopInput = input(null, { alias: 'sop' });
        this.fb = inject(FormBuilder);
        this.state = inject(StateService);
        this.auth = inject(AuthService);
        this.toast = inject(ToastService);
        this.confirmation = inject(ConfirmationService);
        this.printService = inject(PrintService);
        this.sopService = inject(SopService);
        this.router = inject(Router);
        this.route = inject(ActivatedRoute);
        this.invService = inject(InventoryService);
        this.recipeService = inject(RecipeService);
        this.calcService = inject(CalculatorService);
        this.targetService = inject(TargetService);
        this.sampleDescriptionMasterService = inject(SampleDescriptionMasterService);
        this.activeSop = computed(() => this.sopInput() || this.state.selectedSop());
        this.libraryTab = signal('sops');
        this.searchTerm = signal('');
        this.activeMenuSopId = signal(null);
        this.isProcessing = signal(false);
        this.currentFormSopId = null;
        this.localInventoryMap = signal({});
        this.localRecipeMap = signal({});
        this.isLoadingInventory = signal(false);
        this.sampleListText = signal('');
        this.sampleCount = signal(0);
        this.preservedSampleDescriptionMap = signal({});
        this.availableSampleDescriptions = signal([]);
        this.sampleDescriptionCount = computed(() => {
            const map = this.preservedSampleDescriptionMap();
            return this.samplesList().filter(sample => Boolean(getSampleDescriptionSnapshot(map, sample))).length;
        });
        this.selectedTargets = signal(new Set());
        this.targetsOpen = signal(false);
        this.targetSearchTerm = signal('');
        this.targetGroups = signal([]);
        this.selectedTargetGroupId = signal(null);
        this.targetSelectionModified = signal(false);
        // Custom Visual Selection Matrix State
        this.customSampleTargetMap = signal({});
        this.isMatrixCustomized = signal(false);
        this.matrixOpen = signal(false);
        // Quick Generate Modal State
        this.quickGenerateModalOpen = signal(false);
        // Edit Request State
        this.editingRequest = signal(null);
        // SAFETY MARGIN MODE: 'auto' means use Config (-1), 'manual' uses explicit number
        this.marginMode = signal('auto');
        this.filteredSops = computed(() => {
            const term = this.searchTerm().toLowerCase();
            const allSops = this.state.sops().filter(s => !s.isArchived);
            const filtered = allSops.filter(s => s.name.toLowerCase().includes(term) || s.category.toLowerCase().includes(term));
            return filtered.sort((a, b) => {
                const catCompare = naturalCompare((a.category || '').toLowerCase(), (b.category || '').toLowerCase());
                if (catCompare !== 0)
                    return catCompare;
                return naturalCompare(a.name, b.name);
            });
        });
        this.filteredTargets = computed(() => {
            const sop = this.activeSop();
            if (!sop || !sop.targets)
                return [];
            const term = this.targetSearchTerm().toLowerCase();
            if (!term)
                return sop.targets;
            return sop.targets.filter(t => t.name.toLowerCase().includes(term) || t.id.toLowerCase().includes(term));
        });
        this.getSelectedTargetsList = computed(() => {
            const sop = this.activeSop();
            if (!sop || !sop.targets)
                return [];
            const selected = this.selectedTargets();
            return sop.targets.filter(t => selected.has(t.id));
        });
        this.samplesList = computed(() => {
            const val = this.sampleListText();
            return val.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        });
        this.form = signal(this.fb.group({
            safetyMargin: [10],
            analysisDate: [this.getTodayDate(), Validators.required]
        }));
        this.calculatedItems = signal([]);
        this.aggregateGHSWarnings = computed(() => {
            const items = this.calculatedItems();
            const warnings = new Set();
            const addWarnings = (item) => {
                if (item.ghsWarnings) {
                    item.ghsWarnings.forEach((w) => warnings.add(w));
                }
            };
            for (const item of items) {
                if (item.isComposite && item.breakdown) {
                    item.breakdown.forEach((sub) => addWarnings(sub));
                }
                else {
                    addWarnings(item);
                }
            }
            return Array.from(warnings).sort();
        });
        this.editInfoChanges = computed(() => {
            const req = this.editingRequest();
            if (!req)
                return [];
            const payload = this.getPayloadData();
            const changes = [];
            const addChange = (label, before, after) => {
                const beforeText = this.formatPreviewValue(before);
                const afterText = this.formatPreviewValue(after);
                if (beforeText !== afterText) {
                    changes.push({ label, before: beforeText, after: afterText });
                }
            };
            addChange('Ngày kiểm nghiệm', req.analysisDate || '', payload.analysisDate || '');
            addChange('Số mẫu', req.sampleList?.length || 0, payload.sampleList?.length || 0);
            addChange('Danh sách mẫu', req.sampleList || [], payload.sampleList || []);
            addChange('Số chỉ tiêu', req.targetIds?.length || 0, payload.targetIds?.length || 0);
            const oldSampleTargetMap = req.sampleTargetMap || {};
            const newSampleTargetMap = payload.sampleTargetMap || {};
            if (JSON.stringify(this.normalizeMapForCompare(oldSampleTargetMap)) !== JSON.stringify(this.normalizeMapForCompare(newSampleTargetMap))) {
                changes.push({ label: 'Chỉ tiêu từng mẫu', before: 'Thiết lập cũ', after: 'Đã thay đổi' });
            }
            const oldDescriptionMap = req.sampleDescriptionMap || req.inputs?.sampleDescriptionMap || {};
            const newDescriptionMap = payload.sampleDescriptionMap || {};
            if (JSON.stringify(this.normalizeMapForCompare(oldDescriptionMap)) !== JSON.stringify(this.normalizeMapForCompare(newDescriptionMap))) {
                changes.push({ label: 'Mô tả mẫu', before: `${Object.keys(oldDescriptionMap).length} mẫu`, after: `${Object.keys(newDescriptionMap).length} mẫu` });
            }
            const ignoredKeys = new Set(['analysisDate', 'safetyMargin', 'sampleList', 'targetIds', 'sampleTargetMap', 'sampleDescriptionMap', 'explicitGroupId']);
            const oldInputs = req.inputs || {};
            const inputKeys = new Set([
                ...Object.keys(oldInputs),
                ...Object.keys(payload)
            ]);
            inputKeys.forEach(key => {
                if (ignoredKeys.has(key))
                    return;
                addChange(`Thông số: ${key}`, oldInputs[key], payload[key]);
            });
            addChange('Safety margin', req.margin ?? oldInputs.safetyMargin ?? '', payload.safetyMargin ?? '');
            return changes;
        });
        this.editInventoryDiff = computed(() => {
            const req = this.editingRequest();
            if (!req)
                return [];
            const oldMap = new Map();
            (req.items || []).forEach(item => {
                const current = oldMap.get(item.name);
                oldMap.set(item.name, {
                    name: item.displayName || item.name,
                    unit: item.stockUnit || item.unit || '',
                    amount: (current?.amount || 0) + Number(item.amount || 0)
                });
            });
            const newMap = new Map();
            this.calculatedItems().forEach(item => {
                if (item.isComposite) {
                    (item.breakdown || []).forEach(sub => {
                        const current = newMap.get(sub.name);
                        newMap.set(sub.name, {
                            name: sub.displayName || this.localInventoryMap()[sub.name]?.name || sub.name,
                            unit: sub.stockUnit || sub.unit || '',
                            amount: (current?.amount || 0) + Number(sub.totalNeed || 0)
                        });
                    });
                }
                else {
                    const current = newMap.get(item.name);
                    newMap.set(item.name, {
                        name: item.displayName || this.localInventoryMap()[item.name]?.name || item.name,
                        unit: item.stockUnit || item.unit || '',
                        amount: (current?.amount || 0) + Number(item.stockNeed || 0)
                    });
                }
            });
            return Array.from(new Set([...oldMap.keys(), ...newMap.keys()]))
                .map(id => {
                const oldItem = oldMap.get(id);
                const newItem = newMap.get(id);
                const before = oldItem?.amount || 0;
                const after = newItem?.amount || 0;
                return {
                    name: newItem?.name || oldItem?.name || id,
                    unit: newItem?.unit || oldItem?.unit || '',
                    before,
                    after,
                    diff: Math.round((after - before) * 1000000) / 1000000
                };
            })
                .filter(row => Math.abs(row.diff) > 0.000001)
                .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
        });
        this.hasEditChanges = computed(() => this.editInfoChanges().length > 0 || this.editInventoryDiff().length > 0);
        this.safetyMargin = signal(10);
        this.formatNum = formatNum;
        this.formatDate = formatDate;
        this.editRequestIdSignal = signal(null);
        this.targetService.getAllGroups().then(groups => this.targetGroups.set(groups));
        this.route.queryParams.subscribe(params => {
            const editRequestId = params['editRequestId'] || null;
            if (editRequestId) {
                this.state.ensureApprovedRequestsListener();
            }
            this.editRequestIdSignal.set(editRequestId);
        });
        effect(() => {
            const editId = this.editRequestIdSignal();
            if (editId) {
                const reqs = this.state.approvedRequests();
                if (reqs.length > 0) { // Wait until loaded
                    const req = reqs.find(r => r.id === editId);
                    if (req) {
                        if (this.editingRequest()?.id !== req.id) {
                            this.editingRequest.set(req);
                            const sop = this.state.sops().find(s => s.id === req.sopId);
                            if (sop) {
                                this.currentFormSopId = null; // Force form re-init
                                this.state.selectedSop.set(sop);
                            }
                            else {
                                this.toast.show('Không tìm thấy SOP của phiếu này.', 'error');
                            }
                        }
                    }
                    else {
                        if (this.editingRequest() !== null) {
                            this.editingRequest.set(null);
                            this.toast.show('Không tìm thấy phiếu yêu cầu.', 'error');
                        }
                    }
                }
            }
            else {
                if (this.editingRequest() !== null) {
                    this.editingRequest.set(null);
                }
            }
        });
        effect(() => {
            const s = this.activeSop();
            if (s) {
                if (s.id === this.currentFormSopId)
                    return;
                this.currentFormSopId = s.id;
                this.formValueSub?.unsubscribe();
                const controls = {
                    safetyMargin: [10],
                    analysisDate: [this.getTodayDate(), Validators.required]
                };
                s.inputs.forEach(i => {
                    if (i.var !== 'safetyMargin' && i.var !== 'analysisDate') {
                        controls[i.var] = [i.default !== undefined ? i.default : 0];
                    }
                });
                const newForm = this.fb.group(controls);
                const cached = this.state.cachedCalculatorState();
                const editingReq = this.editingRequest();
                if (editingReq && editingReq.sopId === s.id) {
                    // Patch from request
                    const patchData = {};
                    if (editingReq.inputs) {
                        Object.keys(editingReq.inputs).forEach(key => {
                            if (newForm.contains(key)) {
                                patchData[key] = editingReq.inputs[key];
                            }
                        });
                    }
                    if (editingReq.margin !== undefined && editingReq.margin !== -1) {
                        this.marginMode.set('manual');
                        if (newForm.contains('safetyMargin')) {
                            patchData['safetyMargin'] = editingReq.margin;
                        }
                    }
                    else {
                        this.marginMode.set('auto');
                    }
                    if (editingReq.analysisDate && newForm.contains('analysisDate')) {
                        patchData['analysisDate'] = editingReq.analysisDate;
                    }
                    newForm.patchValue(patchData);
                    if (editingReq.sampleList) {
                        const samplesStr = editingReq.sampleList.join('\n');
                        this.sampleListText.set(samplesStr);
                        this.sampleCount.set(editingReq.sampleList.length);
                        if (newForm.contains('n_sample') && editingReq.sampleList.length > 0) {
                            newForm.patchValue({ n_sample: editingReq.sampleList.length });
                        }
                    }
                    else {
                        this.sampleListText.set('');
                        this.sampleCount.set(0);
                    }
                    this.preservedSampleDescriptionMap.set(editingReq.sampleDescriptionMap || editingReq.inputs?.sampleDescriptionMap || {});
                    if (editingReq.sampleList?.length) {
                        void this.ensureSampleDescriptionsLoaded();
                    }
                    if (editingReq.targetIds) {
                        this.selectedTargets.set(new Set(editingReq.targetIds));
                    }
                    else {
                        this.selectedTargets.set(new Set());
                    }
                    const storedGroup = editingReq.targetScopeSnapshots?.find(scope => scope.kind === 'target-group' && scope.sourceId);
                    this.selectedTargetGroupId.set(storedGroup?.sourceId || null);
                    this.targetSelectionModified.set(!storedGroup);
                    if (editingReq.sampleTargetMap) {
                        const map = {};
                        Object.entries(editingReq.sampleTargetMap).forEach(([sample, targets]) => {
                            map[sample] = new Set(targets);
                        });
                        this.customSampleTargetMap.set(map);
                        this.isMatrixCustomized.set(true);
                    }
                    else {
                        // Initialize default map matching globals
                        const map = {};
                        const tIds = editingReq.targetIds || [];
                        (editingReq.sampleList || []).forEach(sample => {
                            map[sample] = new Set(tIds);
                        });
                        this.customSampleTargetMap.set(map);
                        this.isMatrixCustomized.set(false);
                    }
                }
                else {
                    if (cached && cached.sopId === s.id) {
                        newForm.patchValue(cached.formValues);
                    }
                    this.sampleListText.set('');
                    this.sampleCount.set(0);
                    this.preservedSampleDescriptionMap.set({});
                    this.selectedTargets.set(new Set());
                    this.customSampleTargetMap.set({});
                    this.isMatrixCustomized.set(false);
                    this.selectedTargetGroupId.set(null);
                    this.targetSelectionModified.set(false);
                    this.marginMode.set('auto');
                }
                this.form.set(newForm);
                this.localInventoryMap.set({});
                this.localRecipeMap.set({});
                this.targetsOpen.set(false);
                this.targetSearchTerm.set('');
                this.runCalculation(s, newForm.value);
                this.fetchData(s);
                this.formValueSub = newForm.valueChanges.pipe(startWith(newForm.value), debounceTime(50)).subscribe(vals => {
                    this.runCalculation(s, vals);
                    const margin = Number(vals['safetyMargin']);
                    this.safetyMargin.set(isNaN(margin) ? 0 : margin);
                });
            }
            else {
                this.currentFormSopId = null;
                this.calculatedItems.set([]);
                this.localInventoryMap.set({});
            }
        });
    }
    ngOnDestroy() { this.formValueSub?.unsubscribe(); }
    getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    setMarginMode(mode) {
        this.marginMode.set(mode);
        if (mode === 'manual') {
            // If switching to manual, default to 10 if not set
            const current = this.form().get('safetyMargin')?.value;
            if (!current)
                this.form().patchValue({ safetyMargin: 10 });
        }
        // Re-trigger calc
        this.runCalculation(this.activeSop(), this.form().value);
    }
    onSampleListChange(val) {
        this.sampleListText.set(val);
        const lines = val.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        this.sampleCount.set(lines.length);
        if (lines.length > 0) {
            void this.ensureSampleDescriptionsLoaded();
        }
        if (this.form().contains('n_sample') && lines.length > 0) {
            this.form().patchValue({ n_sample: lines.length });
        }
        // Sync customSampleTargetMap
        if (!this.isMatrixCustomized()) {
            this.syncMatrixWithGlobals();
        }
        else {
            // Matrix has customizations: keep existing ones, add new ones with globals, remove old ones
            this.customSampleTargetMap.update(map => {
                const next = {};
                const globalTargets = this.selectedTargets();
                lines.forEach(sample => {
                    if (map[sample]) {
                        next[sample] = map[sample];
                    }
                    else {
                        next[sample] = new Set(globalTargets);
                    }
                });
                return next;
            });
            // Re-run calculations since custom targets affect chemical needs
            this.runCalculation(this.activeSop(), this.form().value);
        }
    }
    getSampleDescriptionName(sampleCode) {
        return getSampleDescriptionSnapshot(this.preservedSampleDescriptionMap(), sampleCode)?.nameSnapshot || '';
    }
    updateSampleDescription(sampleCode, value) {
        const snapshot = this.resolveDescriptionSnapshot(value);
        this.preservedSampleDescriptionMap.update(map => setSampleDescriptionSnapshot(map, sampleCode, snapshot));
    }
    applyDescriptionToAllSamples(sourceSampleCode) {
        const snapshot = getSampleDescriptionSnapshot(this.preservedSampleDescriptionMap(), sourceSampleCode);
        this.preservedSampleDescriptionMap.update(map => {
            let next = map;
            for (const sample of this.samplesList()) {
                if (sample !== sourceSampleCode) {
                    next = setSampleDescriptionSnapshot(next, sample, snapshot);
                }
            }
            return next;
        });
    }
    resolveDescriptionSnapshot(value) {
        const name = String(value || '').trim();
        if (!name)
            return undefined;
        const normalized = normalizeDescription(name);
        const master = this.availableSampleDescriptions().find(item => normalizeDescription(item.name) === normalized
            || (item.aliases || []).some(alias => normalizeDescription(alias) === normalized));
        return master
            ? { masterId: master.id, nameSnapshot: master.name }
            : { nameSnapshot: name };
    }
    ensureSampleDescriptionsLoaded() {
        if (this.sampleDescriptionLoadPromise)
            return this.sampleDescriptionLoadPromise;
        this.sampleDescriptionLoadPromise = this.sampleDescriptionMasterService.getActive()
            .then(items => this.availableSampleDescriptions.set(items))
            .catch(() => {
            this.toast.show('Không thể tải gợi ý mô tả mẫu; vẫn có thể nhập tự do.', 'info');
        });
        return this.sampleDescriptionLoadPromise;
    }
    toggleTarget(id) {
        this.targetSelectionModified.set(true);
        this.selectedTargets.update(s => {
            const n = new Set(s);
            if (n.has(id)) {
                n.delete(id);
                // Delete from all samples' sets in the matrix
                this.customSampleTargetMap.update(map => {
                    const next = { ...map };
                    Object.keys(next).forEach(sample => {
                        const set = new Set(next[sample]);
                        set.delete(id);
                        next[sample] = set;
                    });
                    return next;
                });
            }
            else {
                n.add(id);
                // Add to all samples' sets in the matrix
                this.customSampleTargetMap.update(map => {
                    const next = { ...map };
                    Object.keys(next).forEach(sample => {
                        const set = new Set(next[sample]);
                        set.add(id);
                        next[sample] = set;
                    });
                    return next;
                });
            }
            return n;
        });
    }
    isAllSelected(allTargets) {
        if (!allTargets || allTargets.length === 0)
            return false;
        return this.selectedTargets().size === allTargets.length;
    }
    toggleAllTargets(allTargets) {
        this.targetSelectionModified.set(true);
        if (this.isAllSelected(allTargets)) {
            this.selectedTargets.set(new Set());
            // Clear all targets from all samples in matrix
            this.customSampleTargetMap.update(map => {
                const next = { ...map };
                Object.keys(next).forEach(sample => {
                    next[sample] = new Set();
                });
                return next;
            });
        }
        else {
            const allIds = allTargets.map(t => t.id);
            this.selectedTargets.set(new Set(allIds));
            // Set all targets for all samples in matrix
            this.customSampleTargetMap.update(map => {
                const next = { ...map };
                Object.keys(next).forEach(sample => {
                    next[sample] = new Set(allIds);
                });
                return next;
            });
        }
    }
    applyTargetGroup(groupId) {
        if (!groupId)
            return;
        const group = this.targetGroups().find(g => g.id === groupId);
        if (!group)
            return;
        const sop = this.activeSop();
        if (!sop || !sop.targets)
            return;
        const groupTargetIds = new Set(group.targets.map(t => t.id));
        const validIdsToSelect = sop.targets.filter(t => groupTargetIds.has(t.id)).map(t => t.id);
        this.selectedTargets.set(new Set(validIdsToSelect));
        this.selectedTargetGroupId.set(group.id);
        this.targetSelectionModified.set(false);
        this.customSampleTargetMap.update(map => {
            const next = { ...map };
            Object.keys(next).forEach(sample => {
                next[sample] = new Set(validIdsToSelect);
            });
            return next;
        });
    }
    getPayloadData() {
        const rawSamples = this.sampleListText();
        const sampleList = rawSamples.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const values = this.form().value;
        // Override margin if Auto
        const finalMargin = this.marginMode() === 'auto' ? -1 : (values.safetyMargin || 0);
        const targetIds = Array.from(this.selectedTargets());
        const sampleTargetMap = {};
        const currentMap = this.customSampleTargetMap();
        sampleList.forEach(sample => {
            sampleTargetMap[sample] = currentMap[sample] ? Array.from(currentMap[sample]) : targetIds;
        });
        const payload = {
            ...values,
            safetyMargin: finalMargin,
            sampleList: sampleList,
            targetIds: targetIds,
            sampleTargetMap: sampleTargetMap,
            sampleDescriptionMap: subsetSampleDescriptionMap(this.preservedSampleDescriptionMap(), sampleList)
        };
        const explicitGroupId = this.targetSelectionModified() ? undefined : (this.selectedTargetGroupId() || undefined);
        if (explicitGroupId) {
            payload.explicitGroupId = explicitGroupId;
        }
        return payload;
    }
    formatPreviewValue(value) {
        if (Array.isArray(value))
            return value.join(', ');
        if (value === undefined || value === null || value === '')
            return '—';
        return String(value);
    }
    normalizeMapForCompare(map) {
        return Object.keys(map || {})
            .sort()
            .reduce((acc, key) => {
            const value = map[key];
            acc[key] = Array.isArray(value) ? [...value].sort() : value;
            return acc;
        }, {});
    }
    async fetchData(sop) {
        this.isLoadingInventory.set(true);
        const neededInvIds = new Set();
        const neededRecipeIds = new Set();
        sop.consumables.forEach(c => {
            if (c.type === 'shared_recipe' && c.recipeId)
                neededRecipeIds.add(c.recipeId);
            else if (c.type === 'simple' && c.name)
                neededInvIds.add(c.name);
            else if (c.type === 'composite' && c.ingredients)
                c.ingredients.forEach(i => neededInvIds.add(i.name));
        });
        try {
            const recipes = await this.recipeService.getRecipesByIds(Array.from(neededRecipeIds));
            const recMap = {};
            recipes.forEach(r => { recMap[r.id] = r; r.ingredients.forEach(i => neededInvIds.add(i.name)); });
            const items = await this.invService.getItemsByIds(Array.from(neededInvIds));
            const invMap = {};
            items.forEach(i => invMap[i.id] = i);
            if (this.activeSop()?.id !== sop.id)
                return;
            this.localRecipeMap.set(recMap);
            this.localInventoryMap.set(invMap);
            this.runCalculation(sop, this.form().value);
        }
        catch (e) {
            console.warn("Fetch warning:", e);
        }
        finally {
            this.isLoadingInventory.set(false);
        }
    }
    resolveName(item) { return item.displayName || item.name; }
    runCalculation(sop, values) {
        try {
            const safeValues = (values || {});
            // DETERMINE MARGIN
            let margin = 0;
            if (this.marginMode() === 'auto') {
                margin = -1; // Flag for Auto
            }
            else {
                margin = Number(safeValues['safetyMargin'] || 0);
                if (isNaN(margin))
                    margin = 0;
            }
            const results = this.calcService.calculateSopNeeds(sop, safeValues, margin, this.localInventoryMap(), this.localRecipeMap(), this.state.safetyConfig() // Pass config
            );
            this.calculatedItems.set(results);
        }
        catch (e) {
            console.error("Calculation Error", e);
        }
    }
    // ... (Other standard methods: toggleMenu, selectSop, createNew, editDirect, softDeleteSop, duplicateSop, exportSop, importSop) ...
    // Methods to reduce boilerplate in XML are omitted but assumed present as in original file, only changed methods shown below.
    toggleMenu(id, event) { event.stopPropagation(); if (this.activeMenuSopId() === id)
        this.activeMenuSopId.set(null);
    else
        this.activeMenuSopId.set(id); }
    closeMenu() { this.activeMenuSopId.set(null); }
    selectSop(s) { this.state.selectedSop.set(s); }
    clearSelection() {
        this.state.selectedSop.set(null);
        this.state.cachedCalculatorState.set(null);
        this.currentFormSopId = null;
        if (this.editingRequest()) {
            this.router.navigate(['/calculator']);
        }
    }
    createNew() { this.state.editingSop.set(null); this.router.navigate(['/editor']); }
    editDirect(sop, event) { event.stopPropagation(); this.closeMenu(); this.state.editingSop.set(sop); this.router.navigate(['/editor']); }
    async softDeleteSop(sop, event) {
        event.stopPropagation();
        if (await this.confirmation.confirm({
            message: `Xóa quy trình "${sop.name}"?\nHành động này không thể hoàn tác.`,
            confirmText: 'Xóa vĩnh viễn',
            isDangerous: true
        })) {
            try {
                await this.sopService.deleteSop(sop.id);
                this.toast.show('Đã xóa SOP');
            }
            catch (e) {
                this.toast.show('Lỗi xóa: ' + e.message, 'error');
            }
        }
    }
    async duplicateSop(sop, event) {
        event.stopPropagation();
        if (await this.confirmation.confirm({ message: `Nhân bản SOP: "${sop.name}"?`, confirmText: 'Nhân bản' })) {
            try {
                const newSop = JSON.parse(JSON.stringify(sop));
                newSop.id = generateSlug(sop.name + '_copy_' + Date.now());
                newSop.name = `${sop.name} (bản sao)`;
                newSop.version = 1;
                newSop.lastModified = null;
                newSop.archivedAt = null;
                await this.sopService.saveSop(newSop);
                this.toast.show('Đã nhân bản SOP!', 'success');
            }
            catch (e) {
                this.toast.show('Lỗi: ' + e.message, 'error');
            }
        }
    }
    exportSop(sop, event) {
        event.stopPropagation();
        try {
            const json = JSON.stringify(sop, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `SOP_${generateSlug(sop.name)}_${sop.version}.json`;
            a.click();
            URL.revokeObjectURL(url);
            this.toast.show('Đã tải xuống SOP.');
        }
        catch (e) {
            this.toast.show('Không thể xuất JSON', 'error');
        }
    }
    async importSop(event) {
        const file = event.target.files[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (!data.name || !data.consumables)
                    throw new Error("File JSON không hợp lệ (thiếu name/consumables)");
                data.id = generateSlug(data.name + '_' + Date.now());
                data.version = 1;
                data.lastModified = null;
                data.archivedAt = null;
                if (await this.confirmation.confirm({ message: `Nhập SOP: "${data.name}"?`, confirmText: 'Nhập' })) {
                    await this.sopService.saveSop(data);
                    this.toast.show('Nhập dữ liệu thành công!', 'success');
                }
            }
            catch (err) {
                this.toast.show('Không thể nhập dữ liệu: ' + err.message, 'error');
            }
            finally {
                event.target.value = '';
            }
        };
        reader.readAsText(file);
    }
    // --- UPDATED: PDF SUPPORT WITH PREVIEW ---
    onPrintDraft(sop) {
        if (this.isProcessing())
            return;
        this.isProcessing.set(true);
        try {
            const payload = this.getPayloadData();
            this.state.cachedCalculatorState.set({ sopId: sop.id, formValues: this.form().value });
            const job = {
                sop: sop, inputs: payload, margin: payload.safetyMargin, items: this.calculatedItems(),
                date: new Date(), user: (this.state.currentUser()?.displayName || 'Guest') + ' (Bản nháp)',
                analysisDate: payload.analysisDate, requestId: `DRAFT-${Date.now()}`
            };
            // OPEN PREVIEW INSTEAD OF DIRECT PRINT
            this.printService.openPreview([job]);
        }
        finally {
            this.isProcessing.set(false);
        }
    }
    async approveAndQueuePrintJob(sop) {
        if (!this.auth.canApprove())
            return;
        if (this.isProcessing())
            return;
        this.isProcessing.set(true);
        try {
            const payload = this.getPayloadData();
            await this.state.directApproveAndQueuePrint(sop, this.calculatedItems(), payload, this.localInventoryMap());
        }
        catch (e) { }
        finally {
            this.isProcessing.set(false);
        }
    }
    async sendRequest(sop) {
        if (this.isProcessing())
            return;
        this.isProcessing.set(true);
        try {
            const payload = this.getPayloadData();
            await this.state.submitRequest(sop, this.calculatedItems(), payload, this.localInventoryMap());
        }
        finally {
            this.isProcessing.set(false);
        }
    }
    async saveEditedRequest(sop) {
        const req = this.editingRequest();
        if (!req)
            return;
        if (this.isProcessing())
            return;
        this.isProcessing.set(true);
        try {
            const payload = this.getPayloadData();
            const success = await this.state.updateApprovedRequest(req, sop, this.calculatedItems(), payload, this.localInventoryMap());
            if (success) {
                this.router.navigate(['/requests']);
            }
        }
        finally {
            this.isProcessing.set(false);
        }
    }
    cancelEdit() {
        this.router.navigate(['/requests']);
    }
    goToResultsEntry() {
        const req = this.editingRequest();
        if (req) {
            this.router.navigate(['/results', req.id]);
        }
    }
    // --- QUICK GENERATE MODAL HANDLERS ---
    openQuickGenerateModal() {
        this.quickGenerateModalOpen.set(true);
    }
    closeQuickGenerateModal() {
        this.quickGenerateModalOpen.set(false);
    }
    handleGeneratedSamples(samples) {
        const currentSamples = this.sampleListText();
        const newSamplesStr = samples.join('\n');
        const updatedSamples = currentSamples
            ? `${currentSamples.trim()}\n${newSamplesStr}`
            : newSamplesStr;
        this.onSampleListChange(updatedSamples);
        this.toast.show(`Đã thêm ${samples.length} mẫu vào danh sách.`, 'success');
        this.closeQuickGenerateModal();
    }
    static { this.ɵfac = function CalculatorComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || CalculatorComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: CalculatorComponent, selectors: [["app-calculator"]], inputs: { sopInput: [1, "sop", "sopInput"] }, decls: 4, vars: 2, consts: [["importFileInput", ""], [1, "w-full", "max-w-[1920px]", "mx-auto", "pb-24", "md:pb-6", "fade-in", "h-full", "flex", "flex-col", "no-print", "px-4", "md:px-6"], [1, "flex", "flex-col", "flex-1", "min-h-0", "animate-fade-in", "relative"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-4", "mb-4", "bg-white", "dark:bg-slate-800", "p-4", "rounded-2xl", "shadow-sm", "border", "border-slate-100", "dark:border-slate-700", "shrink-0", "mt-4"], [1, "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-xl", "bg-blue-50", "dark:bg-blue-900/30", "text-blue-600", "dark:text-blue-400", "flex", "items-center", "justify-center", "border", "border-blue-100", "dark:border-blue-800/30", "shadow-sm", "shrink-0"], [1, "fa-solid", "fa-calculator", "text-base"], [1, "flex", "items-center", "gap-2", "mb-0.5"], [1, "px-2", "py-0.5", "rounded", "bg-indigo-50", "dark:bg-indigo-950/20", "border", "border-indigo-100", "dark:border-indigo-900/30", "text-indigo-650", "dark:text-indigo-400", "text-[10px]", "font-black", "uppercase"], [1, "text-xl", "font-black", "text-slate-850", "dark:text-slate-100", "tracking-tight", "leading-tight"], [1, "flex", "gap-2", "items-center"], [1, "text-xs", "font-bold", "text-slate-600", "dark:text-slate-300", "hover:text-blue-600", "dark:hover:text-blue-400", "flex", "items-center", "gap-1.5", "transition", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "px-3.5", "py-2", "rounded-xl", "shadow-sm", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-arrow-left"], [1, "flex", "flex-col", "lg:flex-row", "gap-6", "lg:gap-8", "lg:items-stretch", "flex-1", "min-h-0"], [1, "w-full", "lg:w-[400px]", "shrink-0", "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-[0_4px_20px_rgba(0,0,0,0.03)]", "dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)]", "border", "border-slate-100", "dark:border-slate-700", "overflow-hidden", "flex", "flex-col", "h-[600px]", "lg:h-full"], [1, "p-5", "border-b", "border-slate-100", "dark:border-slate-700", "bg-slate-50/50", "dark:bg-slate-800/50", "flex", "items-center", "gap-3", "shrink-0"], [1, "w-10", "h-10", "rounded-xl", "bg-gradient-to-br", "from-blue-500", "to-blue-600", "flex", "items-center", "justify-center", "text-white", "shadow-blue-200", "dark:shadow-blue-900/20", "shadow-md"], [1, "fa-solid", "fa-sliders"], [1, "font-bold", "text-slate-800", "dark:text-slate-200", "text-sm"], [1, "p-5", "flex-1", "min-h-0", "overflow-y-auto", "custom-scrollbar", "space-y-6"], [1, "space-y-6", 3, "formGroup"], [1, "p-5", "border-t", "border-slate-100", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800/50", "space-y-3", "shrink-0"], [1, "flex-1", "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-[0_4px_20px_rgba(0,0,0,0.03)]", "dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)]", "border", "border-slate-100", "dark:border-slate-700", "overflow-hidden", "flex", "flex-col", "h-[600px]", "lg:h-full"], [1, "bg-slate-50/50", "dark:bg-slate-800/50", "px-6", "py-4", "border-b", "border-slate-100", "dark:border-slate-700", "flex", "items-center", "justify-between", "shrink-0"], [1, "font-black", "text-slate-800", "dark:text-slate-200", "text-base", "flex", "items-center", "gap-3"], [1, "fa-solid", "fa-flask-vial", "text-purple-600", "dark:text-purple-400"], [1, "flex", "items-center", "gap-2", "bg-blue-50", "dark:bg-blue-900/20", "px-3", "py-1", "rounded-full", "border", "border-blue-100", "dark:border-blue-800/50", "animate-pulse"], [1, "text-xs", "text-green-600", "dark:text-green-400", "font-bold", "bg-green-50", "dark:bg-green-900/20", "px-2", "py-1", "rounded-full", "border", "border-green-100", "dark:border-green-800/50"], [1, "lg:overflow-y-auto", "lg:flex-1", "p-0", "custom-scrollbar"], [1, "w-full", "text-sm", "text-left", "border-collapse"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "font-bold", "uppercase", "bg-slate-50", "dark:bg-slate-800/80", "sticky", "top-0", "shadow-sm", "z-10"], [1, "px-6", "py-3", "tracking-wider", "w-1/3"], [1, "px-6", "py-3", "tracking-wider", "text-right", "hidden", "sm:table-cell"], [1, "px-6", "py-3", "tracking-wider", "text-right", "w-32"], [1, "px-6", "py-3", "tracking-wider", "text-center", "w-20"], [1, "divide-y", "divide-slate-50", "dark:divide-slate-700/50"], [1, "mt-4", "bg-orange-50", "dark:bg-orange-900/10", "border-l-4", "border-orange-500", "p-4", "rounded-r-xl"], [1, "bg-blue-50/50", "dark:bg-blue-900/10", "p-3", "rounded-xl", "border", "border-blue-100", "dark:border-blue-800/50"], [1, "flex", "justify-between", "items-center", "mb-2"], [1, "text-[11px]", "font-bold", "text-blue-800", "dark:text-blue-400", "uppercase", "tracking-wide", "flex", "items-center", "gap-2"], ["type", "button", 1, "text-[10px]", "text-blue-600", "dark:text-blue-400", "hover:bg-blue-100", "dark:hover:bg-blue-900/30", "px-2", "py-1", "rounded", "transition", "font-bold", "flex", "items-center", "gap-1", "normal-case", "tracking-normal", 3, "click"], [1, "fa-solid", "fa-wand-magic-sparkles"], [1, "bg-blue-100", "dark:bg-blue-900/30", "text-blue-700", "dark:text-blue-400", "px-2", "rounded-md", "text-[11px]", "font-bold"], ["placeholder", "D\u00E1n m\u00E3 m\u1EABu v\u00E0o \u0111\u00E2y (m\u1ED7i m\u00E3 1 d\u00F2ng)...", 1, "w-full", "p-3", "text-xs", "font-mono", "border", "border-blue-200", "dark:border-blue-800/50", "rounded-lg", "focus:ring-2", "focus:ring-blue-200", "dark:focus:ring-blue-900/30", "outline-none", "bg-white", "dark:bg-slate-900", "min-h-[80px]", "resize-y", "placeholder-blue-300/50", "dark:placeholder-blue-700/50", "text-slate-800", "dark:text-slate-200", 3, "ngModelChange", "ngModel", "ngModelOptions"], [1, "text-[9px]", "text-blue-400", "dark:text-blue-500", "mt-1", "italic", "text-right"], [1, "mt-3", "pt-3", "border-t", "border-blue-100", "dark:border-blue-800/40"], [1, "border", "border-emerald-100", "dark:border-emerald-800/50", "rounded-xl", "overflow-hidden", "bg-white", "dark:bg-slate-800", "shadow-sm", "transition-all", "duration-300"], [1, "border", "border-indigo-100", "dark:border-indigo-800/50", "rounded-xl", "overflow-hidden", "bg-white", "dark:bg-slate-800", "mt-4", "shadow-sm", "transition-all", "duration-300"], [1, "h-px", "bg-slate-100", "dark:bg-slate-700"], [1, "space-y-4"], [1, "group"], ["for", "analysis-date", 1, "block", "text-[11px]", "font-bold", "text-slate-500", "dark:text-slate-400", "uppercase", "tracking-wide", "mb-1.5", "ml-1"], [1, "text-red-500"], [1, "relative"], ["id", "analysis-date", "type", "date", "formControlName", "analysisDate", "required", "", 1, "w-full", "pl-4", "pr-4", "py-3", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-sm", "font-bold", "text-slate-700", "dark:text-slate-200", "focus:bg-white", "dark:focus:bg-slate-800", "focus:border-blue-500", "dark:focus:border-blue-400", "outline-none", "transition", "shadow-sm", "[color-scheme:light]", "dark:[color-scheme:dark]"], [1, "mt-1.5", "ml-1", "text-[10px]", "text-slate-400", "dark:text-slate-500"], [1, "mt-1", "ml-1", "text-[10px]", "font-bold", "text-red-500"], [1, "pt-4", "mt-2", "border-t", "border-slate-100", "dark:border-slate-700"], [1, "flex", "justify-between", "items-center", "mb-2", "ml-1"], [1, "text-[11px]", "font-bold", "text-slate-500", "dark:text-slate-400", "uppercase", "tracking-wide"], [1, "flex", "bg-slate-100", "dark:bg-slate-800", "p-0.5", "rounded-lg", "border", "border-slate-200", "dark:border-slate-700"], ["type", "button", 1, "px-2", "py-1", "text-[10px]", "font-bold", "rounded-md", "transition", 3, "click"], ["title", "S\u1EED d\u1EE5ng c\u1EA5u h\u00ECnh \u0111\u1ECBnh m\u1EE9c cho t\u1EEBng lo\u1EA1i h\u00F3a ch\u1EA5t", 1, "w-full", "py-3", "px-4", "bg-orange-50", "dark:bg-orange-900/20", "border", "border-orange-100", "dark:border-orange-800/50", "rounded-xl", "flex", "items-center", "gap-3", "text-orange-800", "dark:text-orange-400", "animate-fade-in", "cursor-default"], [1, "relative", "group", "animate-fade-in"], [1, "flex", "items-center", "justify-between", "mb-2"], [1, "text-[10px]", "font-black", "text-fuchsia-700", "dark:text-fuchsia-400", "uppercase", "tracking-wide", "flex", "items-center", "gap-1.5"], [1, "fa-solid", "fa-tags"], [1, "text-[10px]", "font-bold", "px-2", "py-0.5", "rounded-md", "bg-fuchsia-50", "dark:bg-fuchsia-900/20", "text-fuchsia-700", "dark:text-fuchsia-400", "border", "border-fuchsia-100", "dark:border-fuchsia-800/50"], ["id", "calculator-sample-description-options"], [3, "value"], [1, "space-y-2", "max-h-56", "overflow-y-auto", "custom-scrollbar", "pr-1"], [1, "bg-white", "dark:bg-slate-900/70", "border", "border-blue-100", "dark:border-blue-800/40", "rounded-xl", "p-2.5", "shadow-sm"], [1, "flex", "items-center", "justify-between", "gap-2", "mb-1.5"], [1, "text-[10px]", "font-mono", "font-black", "text-indigo-700", "dark:text-indigo-400", "truncate"], [1, "fa-solid", "fa-vial", "mr-1"], ["type", "button", 1, "text-[9px]", "font-bold", "px-2", "py-0.5", "rounded-lg", "bg-fuchsia-50", "dark:bg-fuchsia-900/20", "text-fuchsia-700", "dark:text-fuchsia-400", "border", "border-fuchsia-100", "dark:border-fuchsia-800/50", "hover:bg-fuchsia-100", "dark:hover:bg-fuchsia-900/30", "transition"], ["list", "calculator-sample-description-options", "placeholder", "VD: N\u01B0\u1EDBc u\u1ED1ng, rau, th\u1ECBt, m\u1EABu QC...", 1, "w-full", "px-3", "py-2", "rounded-lg", "border", "border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-200", "outline-none", "focus:border-fuchsia-500", "dark:focus:border-fuchsia-400", "focus:bg-white", "dark:focus:bg-slate-900", "transition", 3, "ngModelChange", "ngModel", "ngModelOptions"], ["type", "button", 1, "text-[9px]", "font-bold", "px-2", "py-0.5", "rounded-lg", "bg-fuchsia-50", "dark:bg-fuchsia-900/20", "text-fuchsia-700", "dark:text-fuchsia-400", "border", "border-fuchsia-100", "dark:border-fuchsia-800/50", "hover:bg-fuchsia-100", "dark:hover:bg-fuchsia-900/30", "transition", 3, "click"], ["type", "button", 1, "w-full", "flex", "items-center", "justify-between", "p-3", "bg-emerald-50", "dark:bg-emerald-900/10", "hover:bg-emerald-100/80", "dark:hover:bg-emerald-900/20", "transition", "text-emerald-800", "dark:text-emerald-400", "group", 3, "click"], [1, "flex", "items-center", "gap-2"], [1, "w-6", "h-6", "rounded", "bg-emerald-200", "dark:bg-emerald-900/30", "text-emerald-700", "dark:text-emerald-400", "flex", "items-center", "justify-center", "text-xs"], [1, "fa-solid", "fa-bullseye"], [1, "text-xs", "font-bold", "uppercase", "tracking-wide"], [1, "fa-solid", "fa-chevron-down", "text-emerald-600", "dark:text-emerald-500", "transition-transform", "duration-300"], [1, "p-3", "bg-white", "dark:bg-slate-800", "animate-slide-down"], [1, "flex", "gap-2", "mb-3"], [1, "relative", "flex-1"], [1, "fa-solid", "fa-search", "absolute", "left-2", "top-2", "text-slate-400", "dark:text-slate-500", "text-xs"], ["placeholder", "T\u00ECm ch\u1EC9 ti\u00EAu...", 1, "w-full", "pl-7", "pr-2", "py-1.5", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "text-xs", "outline-none", "focus:border-emerald-500", "dark:focus:border-emerald-400", "bg-white", "dark:bg-slate-900", "text-slate-800", "dark:text-slate-200", 3, "ngModelChange", "ngModel", "ngModelOptions"], [1, "px-2", "py-1", "bg-emerald-50", "dark:bg-emerald-900/20", "text-emerald-700", "dark:text-emerald-400", "rounded-lg", "text-[10px]", "font-bold", "border", "border-emerald-200", "dark:border-emerald-800", "transition", "outline-none", "cursor-pointer", "w-32", "truncate", "shrink-0"], ["type", "button", 1, "px-2", "py-1", "bg-slate-100", "dark:bg-slate-700", "hover:bg-slate-200", "dark:hover:bg-slate-600", "text-slate-600", "dark:text-slate-300", "rounded-lg", "text-[10px]", "font-bold", "border", "border-slate-200", "dark:border-slate-600", "transition", "shrink-0", 3, "click"], [1, "grid", "grid-cols-1", "gap-1", "max-h-48", "overflow-y-auto", "custom-scrollbar", "pr-1"], [1, "flex", "items-center", "gap-2", "p-2", "rounded-lg", "cursor-pointer", "transition", "group", 3, "class"], [1, "px-2", "py-1", "bg-emerald-50", "dark:bg-emerald-900/20", "text-emerald-700", "dark:text-emerald-400", "rounded-lg", "text-[10px]", "font-bold", "border", "border-emerald-200", "dark:border-emerald-800", "transition", "outline-none", "cursor-pointer", "w-32", "truncate", "shrink-0", 3, "change"], ["value", "", "disabled", "", "selected", ""], [1, "flex", "items-center", "gap-2", "p-2", "rounded-lg", "cursor-pointer", "transition", "group"], ["type", "checkbox", 1, "w-4", "h-4", "accent-emerald-600", "rounded", "cursor-pointer", 3, "change", "checked"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "group-hover:text-emerald-700", "dark:group-hover:text-emerald-400", "truncate", "flex-1"], [1, "text-[9px]", "text-slate-400", "dark:text-slate-500", "shrink-0", "bg-white", "dark:bg-slate-800", "px-1.5", "rounded", "border", "border-slate-100", "dark:border-slate-700"], [1, "flex", "justify-between", "items-center", "p-3", "bg-indigo-50/50", "dark:bg-indigo-900/10", "text-indigo-800", "dark:text-indigo-400"], [1, "text-[11px]", "font-bold", "uppercase", "tracking-wider", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-table-cells"], ["type", "button", 1, "text-[9px]", "text-red-600", "dark:text-red-400", "hover:bg-red-50", "dark:hover:bg-red-900/20", "px-2", "py-0.5", "rounded", "transition", "font-bold", "border", "border-red-200", "dark:border-red-800/30"], [1, "space-y-3", "p-3", "max-h-72", "overflow-y-auto", "custom-scrollbar", "bg-slate-50/30", "dark:bg-slate-900/10"], [1, "p-2.5", "rounded-xl", "border", "border-slate-100", "dark:border-slate-700/50", "bg-white", "dark:bg-slate-800/80", "space-y-2", "shadow-sm"], ["type", "button", 1, "text-[9px]", "text-red-600", "dark:text-red-400", "hover:bg-red-50", "dark:hover:bg-red-900/20", "px-2", "py-0.5", "rounded", "transition", "font-bold", "border", "border-red-200", "dark:border-red-800/30", 3, "click"], [1, "fa-solid", "fa-rotate-left"], [1, "flex", "items-center", "gap-1.5", "text-[11px]", "font-mono", "font-bold", "text-indigo-700", "dark:text-indigo-400"], [1, "fa-solid", "fa-vial", "text-[10px]"], [1, "flex", "flex-wrap", "gap-1.5"], ["type", "button", 1, "px-2.5", "py-1", "text-[10px]", "font-bold", "rounded-lg", "border", "transition-all", "duration-200", "flex", "items-center", "gap-1.5", "hover:scale-102", "hover:shadow-sm", "active:scale-95", 3, "class"], ["type", "button", 1, "px-2.5", "py-1", "text-[10px]", "font-bold", "rounded-lg", "border", "transition-all", "duration-200", "flex", "items-center", "gap-1.5", "hover:scale-102", "hover:shadow-sm", "active:scale-95", 3, "click"], [1, "fa-solid"], [1, "block", "text-[11px]", "font-bold", "text-slate-500", "dark:text-slate-400", "uppercase", "tracking-wide", "mb-1.5", "ml-1"], [1, "flex", "items-center", "justify-between", "p-3", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "cursor-pointer", "bg-white", "dark:bg-slate-800", "hover:border-blue-300", "dark:hover:border-blue-500", "transition"], [1, "text-sm", "font-bold", "text-slate-700", "dark:text-slate-200"], ["type", "checkbox", 1, "w-5", "h-5", "accent-blue-600", "rounded", "cursor-pointer", 3, "formControlName"], [1, "w-full", "pl-4", "pr-10", "py-3", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-sm", "font-bold", "text-slate-800", "dark:text-slate-200", "outline-none", "focus:bg-white", "dark:focus:bg-slate-800", "focus:border-blue-500", "dark:focus:border-blue-400", "transition", "shadow-sm", "appearance-none", "cursor-pointer", 3, "formControlName"], [1, "absolute", "right-4", "top-1/2", "-translate-y-1/2", "pointer-events-none"], [1, "fa-solid", "fa-chevron-down", "text-slate-400", "dark:text-slate-500", "text-xs"], ["type", "number", 1, "w-full", "pl-4", "pr-12", "py-3", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-lg", "font-bold", "text-slate-800", "dark:text-slate-200", "focus:bg-white", "dark:focus:bg-slate-800", "focus:border-blue-500", "dark:focus:border-blue-400", "outline-none", "transition", "shadow-sm", 3, "formControlName", "step", "ngClass", "readonly"], [1, "absolute", "right-4", "top-1/2", "-translate-y-1/2", "text-xs", "font-bold", "text-slate-400", "dark:text-slate-500"], [1, "w-8", "h-8", "rounded-full", "bg-orange-100", "dark:bg-orange-900/40", "flex", "items-center", "justify-center", "shrink-0"], [1, "fa-solid", "fa-wand-magic-sparkles", "text-orange-500", "dark:text-orange-400"], [1, "text-xs", "font-bold"], [1, "text-[10px]", "opacity-80"], ["type", "number", "formControlName", "safetyMargin", "min", "0", "step", "1", 1, "w-full", "pl-4", "pr-12", "py-3", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-lg", "font-bold", "text-slate-700", "dark:text-slate-200", "focus:bg-white", "dark:focus:bg-slate-800", "focus:border-orange-500", "dark:focus:border-orange-400", "outline-none", "transition", "shadow-sm"], [1, "rounded-2xl", "border", "border-blue-100", "dark:border-blue-800/50", "bg-white", "dark:bg-slate-900/60", "p-3", "shadow-sm", "space-y-3"], [1, "flex", "items-start", "gap-2"], [1, "w-8", "h-8", "rounded-xl", "bg-blue-50", "dark:bg-blue-900/30", "text-blue-600", "dark:text-blue-400", "flex", "items-center", "justify-center", "shrink-0"], [1, "fa-solid", "fa-code-compare", "text-xs"], [1, "min-w-0"], [1, "text-xs", "font-black", "text-slate-800", "dark:text-slate-100", "uppercase", "tracking-wide"], [1, "text-[10px]", "text-slate-500", "dark:text-slate-400", "leading-relaxed"], [1, "text-[11px]", "font-bold", "text-emerald-700", "dark:text-emerald-400", "bg-emerald-50", "dark:bg-emerald-900/20", "border", "border-emerald-100", "dark:border-emerald-800/40", "px-3", "py-2", "rounded-xl"], [1, "w-full", "bg-gradient-to-r", "from-fuchsia-500", "to-pink-600", "hover:from-fuchsia-600", "hover:to-pink-700", "text-white", "font-bold", "py-3.5", "rounded-xl", "shadow-lg", "transition", "flex", "items-center", "justify-center", "gap-2", "active:scale-98", "disabled:opacity-50", 3, "click", "disabled"], [1, "fa-solid", "fa-square-poll-vertical"], [1, "w-full", "bg-blue-600", "hover:bg-blue-700", "text-white", "font-bold", "py-3.5", "rounded-xl", "shadow-md", "transition", "disabled:opacity-50", "flex", "items-center", "justify-center", "gap-2", 3, "click", "disabled"], [1, "fa-solid", "fa-spinner", "fa-spin"], [1, "fa-solid", "fa-save"], [1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-slate-300", "dark:border-slate-600", "text-slate-700", "dark:text-slate-300", "font-bold", "py-3.5", "rounded-xl", "shadow-sm", "transition", "hover:bg-slate-50", "dark:hover:bg-slate-700", "flex", "items-center", "justify-center", "gap-2", "disabled:opacity-50", 3, "click", "disabled"], [1, "fa-solid", "fa-times"], [1, "fa-solid", "fa-circle-check", "mr-1"], [1, "space-y-1.5", "max-h-32", "overflow-y-auto", "custom-scrollbar", "pr-1"], [1, "border-t", "border-slate-100", "dark:border-slate-700", "pt-2", "space-y-1"], [1, "text-[10px]", "rounded-lg", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-100", "dark:border-slate-700", "px-2.5", "py-2"], [1, "font-black", "text-slate-700", "dark:text-slate-200"], [1, "grid", "grid-cols-[1fr_auto_1fr]", "gap-2", "items-center", "mt-1", "text-slate-500", "dark:text-slate-400"], [1, "truncate", 3, "title"], [1, "fa-solid", "fa-arrow-right", "text-blue-400", "text-[9px]"], [1, "truncate", "font-bold", "text-blue-700", "dark:text-blue-300", 3, "title"], [1, "text-[10px]", "font-black", "text-slate-500", "dark:text-slate-400", "uppercase"], [1, "space-y-1", "max-h-28", "overflow-y-auto", "custom-scrollbar", "pr-1"], [1, "flex", "items-center", "justify-between", "gap-2", "text-[10px]", "px-2.5", "py-1.5", "rounded-lg", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-100", "dark:border-slate-700"], [1, "font-bold", "text-slate-700", "dark:text-slate-200", "truncate"], [1, "font-mono", "font-black", "shrink-0"], [1, "fa-solid", "fa-print"], [1, "fa-solid", "fa-paper-plane"], [1, "w-full", "bg-gradient-to-r", "from-emerald-500", "to-teal-600", "text-white", "font-bold", "py-3.5", "rounded-xl", "shadow-lg", "transition", "hover:from-emerald-600", "hover:to-teal-700", "flex", "items-center", "justify-center", "gap-2", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "click", "appLockPermission", "disabled"], [1, "fa-solid", "fa-check-double"], [1, "fa-solid", "fa-circle-notch", "fa-spin", "text-blue-500", "dark:text-blue-400", "text-xs"], [1, "text-xs", "text-blue-600", "dark:text-blue-400", "font-bold"], [1, "fa-solid", "fa-check", "mr-1"], [1, "group", "hover:bg-slate-50/80", "dark:hover:bg-slate-700/50", "transition", "duration-150", 3, "ngClass"], [1, "px-6", "py-4", "align-top"], [1, "flex", "flex-col"], [1, "font-bold", "text-slate-700", "dark:text-slate-300", "text-sm", "group-hover:text-blue-700", "dark:group-hover:text-blue-400", "transition-colors"], [1, "flex", "flex-wrap", "gap-1", "mt-1"], [1, "flex", "gap-0.5", "opacity-70"], [1, "text-[10px]", "font-bold", "text-red-600", "dark:text-red-400", "bg-white", "dark:bg-slate-800", "px-2", "py-0.5", "rounded", "border", "border-red-200", "dark:border-red-800/50"], [1, "text-[10px]", "font-bold", "text-orange-600", "dark:text-orange-400", "bg-orange-50", "dark:bg-orange-900/20", "px-2", "py-0.5", "rounded", "border", "border-orange-100", "dark:border-orange-800/50"], [1, "px-6", "py-4", "text-right", "align-top", "hidden", "sm:table-cell"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "bg-slate-100", "dark:bg-slate-800", "px-1.5", "py-0.5", "rounded", "font-mono"], [1, "font-medium", "text-slate-600", "dark:text-slate-400", "text-sm", "tabular-nums"], [1, "text-xs", "font-bold", "text-orange-500", "dark:text-orange-400", "bg-orange-50", "dark:bg-orange-900/20", "px-2", "py-1", "rounded-md", "border", "border-orange-100", "dark:border-orange-800/50"], [1, "px-6", "py-4", "text-right", "align-top"], [1, "font-black", "text-blue-600", "dark:text-blue-400", "text-lg", "tabular-nums"], [1, "px-6", "py-4", "text-center", "align-top"], [1, "text-xs", "font-bold", "text-slate-500", "dark:text-slate-400", "bg-slate-100", "dark:bg-slate-800", "px-2", "py-1", "rounded-md"], [1, "bg-slate-50/50", "dark:bg-slate-800/30"], [1, "w-3.5", "h-3.5", 3, "src", "title"], [1, "fa-solid", "fa-circle-xmark"], [1, "fa-solid", "fa-triangle-exclamation"], ["colspan", "6", 1, "px-6", "py-2", "pb-4"], [1, "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "p-3", "shadow-sm", "ml-4"], [1, "text-[10px]", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase", "mb-2"], [1, "grid", "gap-2"], [1, "flex", "justify-between", "items-center", "text-xs", "border-b", "border-slate-50", "dark:border-slate-700/50", "last:border-0", "pb-1", 3, "ngClass"], [1, "font-medium", 3, "ngClass"], ["title", "Kh\u00F4ng t\u00ECm th\u1EA5y trong kho", 1, "fa-solid", "fa-circle-exclamation", "text-[10px]"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "italic"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500"], [1, "text-[10px]", "font-bold", "text-orange-500", "dark:text-orange-400"], [1, "flex", "items-center", "gap-1"], [1, "font-bold", "text-slate-700", "dark:text-slate-300", "font-mono"], [1, "text-[10px]", "text-slate-500", "dark:text-slate-400"], [1, "w-2.5", "h-2.5", 3, "src", "title"], ["colspan", "4", 1, "p-10", "text-center", "text-slate-400", "dark:text-slate-500", "italic"], [1, "font-bold", "text-orange-800", "dark:text-orange-300", "text-sm", "flex", "items-center", "gap-2", "mb-2"], [1, "fa-solid", "fa-shield-virus"], [1, "flex", "flex-wrap", "gap-2", "mb-3"], [1, "space-y-3"], [1, "space-y-1.5", "text-xs", "text-orange-700", "dark:text-orange-300", "font-medium"], [1, "bg-white", "dark:bg-slate-800", "p-1.5", "rounded-md", "shadow-sm", "border", "border-orange-100", "dark:border-orange-800", "group", "relative"], [1, "w-8", "h-8", "flex-shrink-0", 3, "src", "title"], [1, "absolute", "bottom-full", "mb-1", "left-1/2", "-translate-x-1/2", "hidden", "group-hover:block", "bg-slate-800", "text-white", "text-xs", "px-2", "py-1", "rounded", "whitespace-nowrap", "z-10"], [1, "flex", "items-start", "gap-1.5"], [1, "fa-solid", "fa-circle", "text-[4px]", "mt-1.5", "opacity-50"], [1, "break-words", "whitespace-normal"], [1, "flex", "items-start", "gap-1.5", "opacity-80"], [1, "fa-solid", "fa-book", "text-base"], [1, "text-xl", "font-black", "text-slate-855", "dark:text-slate-100", "tracking-tight", "leading-tight"], [1, "text-xs", "font-medium", "text-slate-500", "dark:text-slate-400", "mt-0.5"], [1, "flex", "justify-between", "items-end", "border-b", "border-slate-200", "dark:border-slate-700", "mb-6", "shrink-0", "pt-4", "px-1"], [1, "flex", "gap-6"], [1, "pb-3", "text-sm", "font-bold", "border-b-2", "transition", "flex", "items-center", "gap-2", "uppercase", "tracking-wide", "px-2", 3, "click"], [1, "fa-solid", "fa-file-lines"], [1, "pb-3", "text-sm", "font-bold", "border-b-2", "transition", "flex", "items-center", "gap-2", "uppercase", "tracking-wide", "px-2", 3, "appLockPermission", "class"], [1, "flex", "flex-col", "flex-1", "min-h-0", "animate-slide-up"], [1, "flex-1", "min-h-0", "animate-slide-up"], [1, "pb-3", "text-sm", "font-bold", "border-b-2", "transition", "flex", "items-center", "gap-2", "uppercase", "tracking-wide", "px-2", 3, "click", "appLockPermission"], [1, "fa-solid", "fa-flask"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-4", "mb-6", "shrink-0"], [1, "relative", "flex-1", "md:max-w-md"], [1, "fa-solid", "fa-search", "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-slate-400"], ["type", "text", "placeholder", "T\u00ECm ki\u1EBFm SOP...", 1, "w-full", "pl-10", "pr-4", "py-2.5", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-sm", "font-bold", "text-slate-700", "dark:text-slate-200", "outline-none", "focus:ring-2", "focus:ring-blue-100", "dark:focus:ring-blue-900", "shadow-sm", "transition", 3, "ngModelChange", "ngModel"], [1, "flex", "gap-2", "self-end", "md:self-auto"], [1, "overflow-y-auto", "pb-10", "custom-scrollbar", "p-1", "flex-1"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-4", "2xl:grid-cols-5", "gap-4"], [1, "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-2xl", "p-5", "hover:border-blue-400", "dark:hover:border-blue-500", "hover:shadow-lg", "transition-all", "duration-300", "group", "relative", "flex", "flex-col", "h-full", "min-h-[160px]"], [1, "col-span-full", "py-20", "text-center", "text-slate-400", "italic", "flex", "flex-col", "items-center"], ["title", "Nh\u1EADp SOP t\u1EEB t\u1EC7p JSON", 1, "bg-emerald-50", "dark:bg-emerald-900/30", "text-emerald-700", "dark:text-emerald-400", "hover:bg-emerald-100", "dark:hover:bg-emerald-900/50", "border", "border-emerald-200", "dark:border-emerald-800", "px-4", "py-2", "rounded-xl", "font-bold", "text-sm", "transition", "flex", "items-center", "justify-center", "gap-2", "shrink-0", "active:scale-95", 3, "click", "appLockPermission"], [1, "fa-solid", "fa-file-import"], [1, "hidden", "md:inline"], ["type", "file", "accept", ".json", 1, "hidden", 3, "change"], [1, "bg-blue-600", "hover:bg-blue-700", "text-white", "px-4", "py-2", "rounded-xl", "font-bold", "text-sm", "shadow-md", "transition", "flex", "items-center", "justify-center", "gap-2", "shrink-0", "active:scale-95", 3, "click", "appLockPermission"], [1, "fa-solid", "fa-plus"], [1, "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-2xl", "p-5", "hover:border-blue-400", "dark:hover:border-blue-500", "hover:shadow-lg", "transition-all", "duration-300", "group", "relative", "flex", "flex-col", "h-full", "min-h-[160px]", 3, "click"], [1, "flex", "justify-between", "items-start", "mb-2"], [1, "flex", "items-center", "gap-2", "flex-wrap"], [1, "text-[10px]", "font-bold", "uppercase", "text-slate-500", "dark:text-slate-400", "bg-slate-100", "dark:bg-slate-700", "px-2", "py-0.5", "rounded", "border", "border-slate-200", "dark:border-slate-600", "truncate", "max-w-[120px]", 3, "title"], [1, "text-[10px]", "font-mono", "font-bold", "text-slate-400", "dark:text-slate-500", "bg-slate-50", "dark:bg-slate-800/50", "px-2", "py-0.5", "rounded", "border", "border-slate-100", "dark:border-slate-700"], [1, "w-8", "h-8", "flex", "items-center", "justify-center", "rounded-full", "hover:bg-slate-100", "dark:hover:bg-slate-700", "text-slate-400", "transition", "relative", "z-20", "-mr-2", "-mt-2", 3, "click"], [1, "fa-solid", "fa-ellipsis-vertical"], [1, "absolute", "top-8", "right-2", "bg-white", "dark:bg-slate-800", "rounded-xl", "shadow-xl", "border", "border-slate-100", "dark:border-slate-700", "py-1", "w-48", "z-30", "animate-slide-up", "overflow-hidden"], [1, "font-bold", "text-slate-700", "dark:text-slate-200", "text-lg", "leading-snug", "mb-2", "group-hover:text-blue-700", "dark:group-hover:text-blue-400", "transition-colors", "pr-2", "line-clamp-2"], [1, "mt-auto", "pt-3", "border-t", "border-slate-50", "dark:border-slate-700/50", "flex", "justify-between", "items-center", "text-xs", "text-slate-400", "font-medium"], [1, "absolute", "top-8", "right-2", "bg-white", "dark:bg-slate-800", "rounded-xl", "shadow-xl", "border", "border-slate-100", "dark:border-slate-700", "py-1", "w-48", "z-30", "animate-slide-up", "overflow-hidden", 3, "click"], [1, "w-full", "text-left", "px-4", "py-2.5", "text-xs", "font-bold", "text-slate-600", "dark:text-slate-300", "hover:bg-slate-50", "dark:hover:bg-slate-700", "flex", "items-center", "gap-2", "transition", 3, "click"], [1, "fa-solid", "fa-download", "text-emerald-500", "w-4"], [1, "w-full", "text-left", "px-4", "py-2.5", "text-xs", "font-bold", "text-slate-600", "dark:text-slate-300", "hover:bg-slate-50", "dark:hover:bg-slate-700", "flex", "items-center", "gap-2", "transition", 3, "click", "appLockPermission"], [1, "fa-solid", "fa-copy", "text-purple-500", "w-4"], [1, "fa-solid", "fa-pen", "text-blue-500", "w-4"], [1, "h-px", "bg-slate-100", "dark:bg-slate-700", "my-1"], [1, "w-full", "text-left", "px-4", "py-2.5", "text-xs", "font-bold", "text-red-600", "dark:text-red-400", "hover:bg-red-50", "dark:hover:bg-red-900/30", "flex", "items-center", "gap-2", "transition", 3, "click", "appLockPermission"], [1, "fa-solid", "fa-box-archive", "w-4"], [1, "fa-solid", "fa-folder-open", "text-4xl", "mb-3", "text-slate-300", "dark:text-slate-600"], [3, "close", "generated"]], template: function CalculatorComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 1);
            i0.ɵɵtemplate(1, CalculatorComponent_Conditional_1_Template, 55, 7)(2, CalculatorComponent_Conditional_2_Template, 18, 5, "div", 2)(3, CalculatorComponent_Conditional_3_Template, 1, 0, "app-quick-generate-sample-modal");
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            let tmp_0_0;
            i0.ɵɵadvance();
            i0.ɵɵconditional((tmp_0_0 = ctx.activeSop()) ? 1 : 2, tmp_0_0);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.quickGenerateModalOpen() ? 3 : -1);
        } }, dependencies: [CommonModule, i1.NgClass, ReactiveFormsModule, i2.ɵNgNoValidate, i2.NgSelectOption, i2.ɵNgSelectMultipleOption, i2.DefaultValueAccessor, i2.NumberValueAccessor, i2.CheckboxControlValueAccessor, i2.SelectControlValueAccessor, i2.NgControlStatus, i2.NgControlStatusGroup, i2.RequiredValidator, i2.MinValidator, i2.FormGroupDirective, i2.FormControlName, FormsModule, i2.NgModel, RecipeManagerComponent, QuickGenerateSampleModalComponent, LockPermissionDirective], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CalculatorComponent, [{
        type: Component,
        args: [{ selector: 'app-calculator', standalone: true, imports: [CommonModule, ReactiveFormsModule, FormsModule, RecipeManagerComponent, QuickGenerateSampleModalComponent, LockPermissionDirective], template: "<div class=\"w-full max-w-[1920px] mx-auto pb-24 md:pb-6 fade-in h-full flex flex-col no-print px-4 md:px-6\">\r\n\r\n  @if (activeSop(); as currentSop) {\r\n    <!-- VIEW: CALCULATOR FORM (RUNNER) -->\r\n    <div class=\"flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 shrink-0 mt-4\">\r\n      <div class=\"flex items-center gap-3\">\r\n        <div class=\"w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-800/30 shadow-sm shrink-0\">\r\n          <i class=\"fa-solid fa-calculator text-base\"></i>\r\n        </div>\r\n        <div>\r\n          <div class=\"flex items-center gap-2 mb-0.5\">\r\n            <span class=\"px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-indigo-650 dark:text-indigo-400 text-[10px] font-black uppercase\">\r\n              {{currentSop.category}}\r\n            </span>\r\n          </div>\r\n          <h2 class=\"text-xl font-black text-slate-850 dark:text-slate-100 tracking-tight leading-tight\">{{currentSop.name}}</h2>\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"flex gap-2 items-center\">\r\n        <button (click)=\"clearSelection()\" class=\"text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 transition bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl shadow-sm active:scale-95\">\r\n          <i class=\"fa-solid fa-arrow-left\"></i> Th\u01B0 Vi\u1EC7n\r\n        </button>\r\n      </div>\r\n    </div>\r\n\r\n    <!-- Main Layout -->\r\n    <div class=\"flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-stretch flex-1 min-h-0\">\r\n\r\n      <!-- LEFT PANEL: INPUTS -->\r\n      <div class=\"w-full lg:w-[400px] shrink-0 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col h-[600px] lg:h-full\">\r\n        <div class=\"p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-3 shrink-0\">\r\n          <div class=\"w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-blue-200 dark:shadow-blue-900/20 shadow-md\">\r\n            <i class=\"fa-solid fa-sliders\"></i>\r\n          </div>\r\n          <div><h3 class=\"font-bold text-slate-800 dark:text-slate-200 text-sm\">Th\u00F4ng S\u1ED1 M\u1EBB M\u1EABu</h3></div>\r\n        </div>\r\n\r\n        <!-- Scrollable Inputs -->\r\n        <div class=\"p-5 flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-6\">\r\n          @if (form()) {\r\n            <form [formGroup]=\"form()\" class=\"space-y-6\">\r\n              <!-- 1. SAMPLE MANAGEMENT -->\r\n              <div class=\"bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-800/50\">\r\n                <div class=\"flex justify-between items-center mb-2\">\r\n                  <label class=\"text-[11px] font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wide flex items-center gap-2\">\r\n                    <span>Danh s\u00E1ch m\u00E3 m\u1EABu</span>\r\n                    <button type=\"button\" (click)=\"openQuickGenerateModal()\" class=\"text-[10px] text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 px-2 py-1 rounded transition font-bold flex items-center gap-1 normal-case tracking-normal\">\r\n                      <i class=\"fa-solid fa-wand-magic-sparkles\"></i> T\u1EA1o Nhanh\r\n                    </button>\r\n                  </label>\r\n                  <span class=\"bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 rounded-md text-[11px] font-bold\">{{sampleCount()}} m\u1EABu</span>\r\n                </div>\r\n                <textarea [ngModel]=\"sampleListText()\" (ngModelChange)=\"onSampleListChange($event)\" [ngModelOptions]=\"{standalone: true}\"\r\n                  class=\"w-full p-3 text-xs font-mono border border-blue-200 dark:border-blue-800/50 rounded-lg focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/30 outline-none bg-white dark:bg-slate-900 min-h-[80px] resize-y placeholder-blue-300/50 dark:placeholder-blue-700/50 text-slate-800 dark:text-slate-200\"\r\n                placeholder=\"D\u00E1n m\u00E3 m\u1EABu v\u00E0o \u0111\u00E2y (m\u1ED7i m\u00E3 1 d\u00F2ng)...\"></textarea>\r\n                <p class=\"text-[9px] text-blue-400 dark:text-blue-500 mt-1 italic text-right\">* T\u1EF1 \u0111\u1ED9ng c\u1EADp nh\u1EADt s\u1ED1 l\u01B0\u1EE3ng m\u1EABu b\u00EAn d\u01B0\u1EDBi.</p>\r\n\r\n                @if (samplesList().length > 0) {\r\n                  <div class=\"mt-3 pt-3 border-t border-blue-100 dark:border-blue-800/40\">\r\n                    <div class=\"flex items-center justify-between mb-2\">\r\n                      <label class=\"text-[10px] font-black text-fuchsia-700 dark:text-fuchsia-400 uppercase tracking-wide flex items-center gap-1.5\">\r\n                        <i class=\"fa-solid fa-tags\"></i> M\u00F4 t\u1EA3 m\u1EABu\r\n                      </label>\r\n                      <span class=\"text-[10px] font-bold px-2 py-0.5 rounded-md bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-700 dark:text-fuchsia-400 border border-fuchsia-100 dark:border-fuchsia-800/50\">\r\n                        {{sampleDescriptionCount()}}/{{samplesList().length}} m\u1EABu\r\n                      </span>\r\n                    </div>\r\n\r\n                    <datalist id=\"calculator-sample-description-options\">\r\n                      @for (description of availableSampleDescriptions(); track description.id) {\r\n                        <option [value]=\"description.name\"></option>\r\n                      }\r\n                    </datalist>\r\n\r\n                    <div class=\"space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1\">\r\n                      @for (sample of samplesList(); track sample) {\r\n                        <div class=\"bg-white dark:bg-slate-900/70 border border-blue-100 dark:border-blue-800/40 rounded-xl p-2.5 shadow-sm\">\r\n                          <div class=\"flex items-center justify-between gap-2 mb-1.5\">\r\n                            <div class=\"text-[10px] font-mono font-black text-indigo-700 dark:text-indigo-400 truncate\">\r\n                              <i class=\"fa-solid fa-vial mr-1\"></i>{{sample}}\r\n                            </div>\r\n                            @if (getSampleDescriptionName(sample)) {\r\n                              <button type=\"button\" (click)=\"applyDescriptionToAllSamples(sample)\"\r\n                                class=\"text-[9px] font-bold px-2 py-0.5 rounded-lg bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-700 dark:text-fuchsia-400 border border-fuchsia-100 dark:border-fuchsia-800/50 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/30 transition\">\r\n                                \u00C1p d\u1EE5ng t\u1EA5t c\u1EA3\r\n                              </button>\r\n                            }\r\n                          </div>\r\n                          <input [ngModel]=\"getSampleDescriptionName(sample)\"\r\n                            (ngModelChange)=\"updateSampleDescription(sample, $event)\"\r\n                            [ngModelOptions]=\"{standalone: true}\"\r\n                            list=\"calculator-sample-description-options\"\r\n                            class=\"w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-fuchsia-500 dark:focus:border-fuchsia-400 focus:bg-white dark:focus:bg-slate-900 transition\"\r\n                            placeholder=\"VD: N\u01B0\u1EDBc u\u1ED1ng, rau, th\u1ECBt, m\u1EABu QC...\">\r\n                        </div>\r\n                      }\r\n                    </div>\r\n                  </div>\r\n                }\r\n              </div>\r\n\r\n              <!-- 2. TARGET SELECTION -->\r\n              @if (currentSop.targets && currentSop.targets.length > 0) {\r\n                <div class=\"border border-emerald-100 dark:border-emerald-800/50 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm transition-all duration-300\">\r\n                  <button type=\"button\" (click)=\"targetsOpen.set(!targetsOpen())\"\r\n                    class=\"w-full flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/10 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/20 transition text-emerald-800 dark:text-emerald-400 group\">\r\n                    <div class=\"flex items-center gap-2\">\r\n                      <div class=\"w-6 h-6 rounded bg-emerald-200 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xs\">\r\n                        <i class=\"fa-solid fa-bullseye\"></i>\r\n                      </div>\r\n                      <span class=\"text-xs font-bold uppercase tracking-wide\">Ch\u1EC9 ti\u00EAu ({{selectedTargets().size}}/{{currentSop.targets.length}})</span>\r\n                    </div>\r\n                    <i class=\"fa-solid fa-chevron-down text-emerald-600 dark:text-emerald-500 transition-transform duration-300\" [class.rotate-180]=\"targetsOpen()\"></i>\r\n                  </button>\r\n\r\n                  @if (targetsOpen()) {\r\n                    <div class=\"p-3 bg-white dark:bg-slate-800 animate-slide-down\">\r\n                      <div class=\"flex gap-2 mb-3\">\r\n                        <div class=\"relative flex-1\">\r\n                          <i class=\"fa-solid fa-search absolute left-2 top-2 text-slate-400 dark:text-slate-500 text-xs\"></i>\r\n                          <input [ngModel]=\"targetSearchTerm()\" (ngModelChange)=\"targetSearchTerm.set($event)\" [ngModelOptions]=\"{standalone: true}\"\r\n                            class=\"w-full pl-7 pr-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200\"\r\n                            placeholder=\"T\u00ECm ch\u1EC9 ti\u00EAu...\">\r\n                          </div>\r\n                          @if(targetGroups().length > 0) {\r\n                            <select (change)=\"applyTargetGroup($any($event.target).value); $any($event.target).value = ''\"\r\n                              class=\"px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-[10px] font-bold border border-emerald-200 dark:border-emerald-800 transition outline-none cursor-pointer w-32 truncate shrink-0\">\r\n                              <option value=\"\" disabled selected>Ch\u1ECDn nh\u00F3m...</option>\r\n                              @for (g of targetGroups(); track g.id) {\r\n                                <option [value]=\"g.id\">{{g.name}}</option>\r\n                              }\r\n                            </select>\r\n                          }\r\n                          <button type=\"button\" (click)=\"toggleAllTargets(currentSop.targets)\"\r\n                            class=\"px-2 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-600 transition shrink-0\">\r\n                            {{ isAllSelected(currentSop.targets) ? 'B\u1ECF ch\u1ECDn' : 'Ch\u1ECDn h\u1EBFt' }}\r\n                          </button>\r\n                        </div>\r\n\r\n                        <div class=\"grid grid-cols-1 gap-1 max-h-48 overflow-y-auto custom-scrollbar pr-1\">\r\n                          @for (target of filteredTargets(); track target.id) {\r\n                            <label class=\"flex items-center gap-2 p-2 rounded-lg cursor-pointer transition group\"\r\n                              [class]=\"selectedTargets().has(target.id) ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800' : 'bg-white dark:bg-slate-800 border border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50'\">\r\n                              <input type=\"checkbox\" [checked]=\"selectedTargets().has(target.id)\" (change)=\"toggleTarget(target.id)\"\r\n                                class=\"w-4 h-4 accent-emerald-600 rounded cursor-pointer\">\r\n                                <span class=\"text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 truncate flex-1\">{{target._displayName || target.name}}</span>\r\n                                @if(target.lod) { <span class=\"text-[9px] text-slate-400 dark:text-slate-500 shrink-0 bg-white dark:bg-slate-800 px-1.5 rounded border border-slate-100 dark:border-slate-700\">{{target.lod}}</span> }\r\n                              </label>\r\n                            }\r\n                          </div>\r\n                        </div>\r\n                      }\r\n                    </div>\r\n                  }\r\n\r\n                  <!-- 2.5 VISUAL SELECTION MATRIX (Granular Mapping) -->\r\n                  @if (getSelectedTargetsList().length > 0 && samplesList().length > 0) {\r\n                    <div class=\"border border-indigo-100 dark:border-indigo-800/50 rounded-xl overflow-hidden bg-white dark:bg-slate-800 mt-4 shadow-sm transition-all duration-300\">\r\n                      <!-- Header Panel -->\r\n                      <div class=\"flex justify-between items-center p-3 bg-indigo-50/50 dark:bg-indigo-900/10 text-indigo-800 dark:text-indigo-400\">\r\n                        <span class=\"text-[11px] font-bold uppercase tracking-wider flex items-center gap-2\">\r\n                          <i class=\"fa-solid fa-table-cells\"></i> Ch\u1EC9 ti\u00EAu t\u1EEBng m\u1EABu\r\n                        </span>\r\n                        @if (isMatrixCustomized()) {\r\n                          <button type=\"button\" (click)=\"resetMatrix()\"\r\n                            class=\"text-[9px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-0.5 rounded transition font-bold border border-red-200 dark:border-red-800/30\">\r\n                            <i class=\"fa-solid fa-rotate-left\"></i> Thi\u1EBFt L\u1EADp L\u1EA1i\r\n                          </button>\r\n                        }\r\n                      </div>\r\n\r\n                      <!-- Interactive Pills Cards Layout -->\r\n                      <div class=\"space-y-3 p-3 max-h-72 overflow-y-auto custom-scrollbar bg-slate-50/30 dark:bg-slate-900/10\">\r\n                        @for (sample of samplesList(); track sample) {\r\n                          <div class=\"p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800/80 space-y-2 shadow-sm\">\r\n                            <!-- Sample Name Badge -->\r\n                            <div class=\"flex items-center gap-1.5 text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-400\">\r\n                              <i class=\"fa-solid fa-vial text-[10px]\"></i> M\u1EABu: {{ sample }}\r\n                            </div>\r\n\r\n                            <!-- Target Pills List -->\r\n                            <div class=\"flex flex-wrap gap-1.5\">\r\n                              @for (target of getSelectedTargetsList(); track target.id) {\r\n                                <button type=\"button\"\r\n                                  (click)=\"toggleMatrixCell(sample, target.id)\"\r\n                                                               [class]=\"isTargetCheckedForSample(sample, target.id) \r\n                                                                   ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 shadow-sm' \r\n                                                                   : 'bg-slate-50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 border-slate-200/60 dark:border-slate-700/60'\"\r\n                                  class=\"px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all duration-200 flex items-center gap-1.5 hover:scale-102 hover:shadow-sm active:scale-95\">\r\n                                  <i class=\"fa-solid\" [class]=\"isTargetCheckedForSample(sample, target.id) ? 'fa-circle-check text-emerald-600 dark:text-emerald-500' : 'fa-circle text-slate-300 dark:text-slate-700'\"></i>\r\n                                  {{ target._displayName || target.name }}\r\n                                </button>\r\n                              }\r\n                            </div>\r\n                          </div>\r\n                        }\r\n                      </div>\r\n                    </div>\r\n                  }\r\n\r\n                  <div class=\"h-px bg-slate-100 dark:bg-slate-700\"></div>\r\n\r\n                  <!-- 3. STANDARD INPUTS -->\r\n                  <div class=\"space-y-4\">\r\n                    <div class=\"group\">\r\n                      <label for=\"analysis-date\" class=\"block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 ml-1\">\r\n                        Ng\u00E0y ki\u1EC3m nghi\u1EC7m d\u1EF1 ki\u1EBFn <span class=\"text-red-500\">*</span>\r\n                      </label>\r\n                      <div class=\"relative\">\r\n                        <input id=\"analysis-date\" type=\"date\" formControlName=\"analysisDate\" required\r\n                          class=\"w-full pl-4 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition shadow-sm [color-scheme:light] dark:[color-scheme:dark]\"\r\n                          [class.border-red-400]=\"form().get('analysisDate')?.invalid && form().get('analysisDate')?.touched\">\r\n                      </div>\r\n                      <p class=\"mt-1.5 ml-1 text-[10px] text-slate-400 dark:text-slate-500\">D\u00F9ng \u0111\u1EC3 \u0111\u01B0a m\u1EBB v\u00E0o \u0111\u00FAng ng\u00E0y tr\u00EAn B\u1EA3ng theo d\u00F5i m\u1EABu ng\u00E0y.</p>\r\n                      @if (form().get('analysisDate')?.invalid && form().get('analysisDate')?.touched) {\r\n                        <p class=\"mt-1 ml-1 text-[10px] font-bold text-red-500\">Vui l\u00F2ng ch\u1ECDn ng\u00E0y ki\u1EC3m nghi\u1EC7m.</p>\r\n                      }\r\n                    </div>\r\n\r\n                      @for (inp of currentSop.inputs; track inp.var) {\r\n                        <div class=\"group\">\r\n                          <label class=\"block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 ml-1\">{{inp.label}}</label>\r\n                          @switch (inp.type) {\r\n                            @case ('checkbox') {\r\n                              <label class=\"flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-500 transition\">\r\n                                <span class=\"text-sm font-bold text-slate-700 dark:text-slate-200\">K\u00EDch ho\u1EA1t</span>\r\n                                <input type=\"checkbox\" [formControlName]=\"inp.var\" class=\"w-5 h-5 accent-blue-600 rounded cursor-pointer\">\r\n                              </label>\r\n                            }\r\n                            @case ('select') {\r\n                              <div class=\"relative\">\r\n                                <select [formControlName]=\"inp.var\" class=\"w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-400 transition shadow-sm appearance-none cursor-pointer\">\r\n                                  @for (opt of inp.options; track opt.value) {\r\n                                    <option [value]=\"opt.value\">{{opt.label}}</option>\r\n                                  }\r\n                                </select>\r\n                                <div class=\"absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none\"><i class=\"fa-solid fa-chevron-down text-slate-400 dark:text-slate-500 text-xs\"></i></div>\r\n                              </div>\r\n                            }\r\n                            @default {\r\n                              <div class=\"relative\">\r\n                                <input type=\"number\" [formControlName]=\"inp.var\" [step]=\"inp.step || 1\"\r\n                                  class=\"w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-bold text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition shadow-sm\"\r\n                                  [ngClass]=\"{'bg-blue-50 dark:bg-blue-900/20': inp.var === 'n_sample' && sampleListText().length > 0}\"\r\n                                  [readonly]=\"inp.var === 'n_sample' && sampleListText().length > 0\">\r\n                                  @if(inp.unitLabel) { <span class=\"absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 dark:text-slate-500\">{{inp.unitLabel}}</span> }\r\n                                </div>\r\n                              }\r\n                            }\r\n                          </div>\r\n                        }\r\n\r\n                        <div class=\"pt-4 mt-2 border-t border-slate-100 dark:border-slate-700\">\r\n                          <div class=\"flex justify-between items-center mb-2 ml-1\">\r\n                            <label class=\"text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide\">H\u1EC7 s\u1ED1 hao h\u1EE5t</label>\r\n                            <div class=\"flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700\">\r\n                              <button type=\"button\" (click)=\"setMarginMode('auto')\"\r\n                                class=\"px-2 py-1 text-[10px] font-bold rounded-md transition\"\r\n                                [class]=\"marginMode() === 'auto' ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'\">\r\n                                T\u1EF1 \u0110\u1ED9ng\r\n                              </button>\r\n                              <button type=\"button\" (click)=\"setMarginMode('manual')\"\r\n                                class=\"px-2 py-1 text-[10px] font-bold rounded-md transition\"\r\n                                [class]=\"marginMode() === 'manual' ? 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'\">\r\n                                T\u00F9y Ch\u1EC9nh\r\n                              </button>\r\n                            </div>\r\n                          </div>\r\n\r\n                          @if(marginMode() === 'auto') {\r\n                            <div class=\"w-full py-3 px-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/50 rounded-xl flex items-center gap-3 text-orange-800 dark:text-orange-400 animate-fade-in cursor-default\" title=\"S\u1EED d\u1EE5ng c\u1EA5u h\u00ECnh \u0111\u1ECBnh m\u1EE9c cho t\u1EEBng lo\u1EA1i h\u00F3a ch\u1EA5t\">\r\n                              <div class=\"w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center shrink-0\">\r\n                                <i class=\"fa-solid fa-wand-magic-sparkles text-orange-500 dark:text-orange-400\"></i>\r\n                              </div>\r\n                              <div>\r\n                                <div class=\"text-xs font-bold\">Ch\u1EBF \u0111\u1ED9 T\u1EF1 \u0111\u1ED9ng</div>\r\n                                <div class=\"text-[10px] opacity-80\">\u00C1p d\u1EE5ng theo t\u1EEBng lo\u1EA1i h\u00F3a ch\u1EA5t</div>\r\n                              </div>\r\n                            </div>\r\n                          } @else {\r\n                            <div class=\"relative group animate-fade-in\">\r\n                              <input type=\"number\" formControlName=\"safetyMargin\" min=\"0\" step=\"1\"\r\n                                class=\"w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-bold text-slate-700 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-800 focus:border-orange-500 dark:focus:border-orange-400 outline-none transition shadow-sm\">\r\n                                <span class=\"absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 dark:text-slate-500\">%</span>\r\n                              </div>\r\n                            }\r\n                          </div>\r\n                        </div>\r\n                      </form>\r\n                    }\r\n                  </div>\r\n\r\n                  <div class=\"p-5 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-3 shrink-0\">\r\n                    <!-- Action Buttons -->\r\n                    @if (editingRequest()) {\r\n                      <div class=\"rounded-2xl border border-blue-100 dark:border-blue-800/50 bg-white dark:bg-slate-900/60 p-3 shadow-sm space-y-3\">\r\n                        <div class=\"flex items-start gap-2\">\r\n                          <div class=\"w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0\">\r\n                            <i class=\"fa-solid fa-code-compare text-xs\"></i>\r\n                          </div>\r\n                          <div class=\"min-w-0\">\r\n                            <div class=\"text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide\">Xem tr\u01B0\u1EDBc thay \u0111\u1ED5i</div>\r\n                            <div class=\"text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed\">\r\n                              Khi l\u01B0u, h\u1EC7 th\u1ED1ng s\u1EBD c\u1EADp nh\u1EADt m\u1EBB, \u0111i\u1EC1u ch\u1EC9nh t\u1ED3n kho theo ch\u00EAnh l\u1EC7ch v\u00E0 t\u1EA1o l\u1EA1i phi\u1EBFu trong h\u00E0ng \u0111\u1EE3i in.\r\n                            </div>\r\n                          </div>\r\n                        </div>\r\n\r\n                        @if (!hasEditChanges()) {\r\n                          <div class=\"text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40 px-3 py-2 rounded-xl\">\r\n                            <i class=\"fa-solid fa-circle-check mr-1\"></i> Ch\u01B0a ph\u00E1t hi\u1EC7n thay \u0111\u1ED5i so v\u1EDBi m\u1EBB hi\u1EC7n t\u1EA1i.\r\n                          </div>\r\n                        } @else {\r\n                          @if (editInfoChanges().length > 0) {\r\n                            <div class=\"space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar pr-1\">\r\n                              @for (change of editInfoChanges(); track change.label) {\r\n                                <div class=\"text-[10px] rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-2.5 py-2\">\r\n                                  <div class=\"font-black text-slate-700 dark:text-slate-200\">{{change.label}}</div>\r\n                                  <div class=\"grid grid-cols-[1fr_auto_1fr] gap-2 items-center mt-1 text-slate-500 dark:text-slate-400\">\r\n                                    <span class=\"truncate\" [title]=\"change.before\">{{change.before}}</span>\r\n                                    <i class=\"fa-solid fa-arrow-right text-blue-400 text-[9px]\"></i>\r\n                                    <span class=\"truncate font-bold text-blue-700 dark:text-blue-300\" [title]=\"change.after\">{{change.after}}</span>\r\n                                  </div>\r\n                                </div>\r\n                              }\r\n                            </div>\r\n                          }\r\n\r\n                          @if (editInventoryDiff().length > 0) {\r\n                            <div class=\"border-t border-slate-100 dark:border-slate-700 pt-2 space-y-1\">\r\n                              <div class=\"text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase\">Ch\u00EAnh l\u1EC7ch t\u1ED3n kho</div>\r\n                              <div class=\"space-y-1 max-h-28 overflow-y-auto custom-scrollbar pr-1\">\r\n                                @for (row of editInventoryDiff(); track row.name) {\r\n                                  <div class=\"flex items-center justify-between gap-2 text-[10px] px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700\">\r\n                                    <span class=\"font-bold text-slate-700 dark:text-slate-200 truncate\">{{row.name}}</span>\r\n                                    <span class=\"font-mono font-black shrink-0\"\r\n                                          [class.text-red-600]=\"row.diff > 0\"\r\n                                          [class.dark:text-red-400]=\"row.diff > 0\"\r\n                                          [class.text-emerald-600]=\"row.diff < 0\"\r\n                                          [class.dark:text-emerald-400]=\"row.diff < 0\">\r\n                                      {{row.diff > 0 ? '+' : ''}}{{formatNum(row.diff)}} {{row.unit}}\r\n                                    </span>\r\n                                  </div>\r\n                                }\r\n                              </div>\r\n                            </div>\r\n                          }\r\n                        }\r\n                      </div>\r\n                      <button (click)=\"goToResultsEntry()\" [disabled]=\"isProcessing()\" class=\"w-full bg-gradient-to-r from-fuchsia-500 to-pink-600 hover:from-fuchsia-600 hover:to-pink-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50\">\r\n                        <i class=\"fa-solid fa-square-poll-vertical\"></i> Nh\u1EADp K\u1EBFt Qu\u1EA3 Ngay\r\n                      </button>\r\n                      <button (click)=\"saveEditedRequest(currentSop)\" [disabled]=\"isProcessing() || form().invalid\" class=\"w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2\">\r\n                        @if(isProcessing()) { <i class=\"fa-solid fa-spinner fa-spin\"></i> } @else { <i class=\"fa-solid fa-save\"></i> } L\u01B0u thay \u0111\u1ED5i\r\n                      </button>\r\n                      <button (click)=\"cancelEdit()\" [disabled]=\"isProcessing()\" class=\"w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold py-3.5 rounded-xl shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2 disabled:opacity-50\">\r\n                        <i class=\"fa-solid fa-times\"></i> H\u1EE7y Ch\u1EC9nh S\u1EEDa\r\n                      </button>\r\n                    } @else {\r\n                      <button (click)=\"onPrintDraft(currentSop)\" [disabled]=\"isProcessing() || form().invalid\" class=\"w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold py-3.5 rounded-xl shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2 disabled:opacity-50\">\r\n                        @if(isProcessing()) { <i class=\"fa-solid fa-spinner fa-spin\"></i> } @else { <i class=\"fa-solid fa-print\"></i> } In Nh\u00E1p (Xem tr\u01B0\u1EDBc)\r\n                      </button>\r\n\r\n                      <button (click)=\"sendRequest(currentSop)\" [disabled]=\"isProcessing() || form().invalid\" class=\"w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2\">\r\n                        <i class=\"fa-solid fa-paper-plane\"></i> G\u1EEDi Y\u00EAu C\u1EA7u Duy\u1EC7t\r\n                      </button>\r\n\r\n                      <button [appLockPermission]=\"'sop_approve'\" (click)=\"approveAndQueuePrintJob(currentSop)\" [disabled]=\"isProcessing() || form().invalid\" class=\"w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition hover:from-emerald-600 hover:to-teal-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed\">\r\n                        @if(isProcessing()) { <i class=\"fa-solid fa-spinner fa-spin\"></i> \u0110ang x\u1EED l\u00FD... }\r\n                        @else { <i class=\"fa-solid fa-check-double\"></i> Duy\u1EC7t & \u0110\u01B0a V\u00E0o H\u00E0ng \u0110\u1EE3i In }\r\n                      </button>\r\n                    }\r\n                  </div>\r\n                </div>\r\n\r\n                <!-- RIGHT PANEL: RESULTS -->\r\n                <div class=\"flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col h-[600px] lg:h-full\">\r\n                  <div class=\"bg-slate-50/50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between shrink-0\">\r\n                    <h3 class=\"font-black text-slate-800 dark:text-slate-200 text-base flex items-center gap-3\">\r\n                      <i class=\"fa-solid fa-flask-vial text-purple-600 dark:text-purple-400\"></i> B\u1EA3ng D\u1EF1 Tr\u00F9 H\u00F3a Ch\u1EA5t\r\n                    </h3>\r\n                    @if(isLoadingInventory()) {\r\n                      <div class=\"flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800/50 animate-pulse\">\r\n                        <i class=\"fa-solid fa-circle-notch fa-spin text-blue-500 dark:text-blue-400 text-xs\"></i>\r\n                        <span class=\"text-xs text-blue-600 dark:text-blue-400 font-bold\">\u0110ang ki\u1EC3m tra kho...</span>\r\n                      </div>\r\n                    } @else {\r\n                      <span class=\"text-xs text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full border border-green-100 dark:border-green-800/50\"><i class=\"fa-solid fa-check mr-1\"></i>\u0110\u00E3 \u0111\u1ED3ng b\u1ED9 kho</span>\r\n                    }\r\n                  </div>\r\n\r\n                  <div class=\"lg:overflow-y-auto lg:flex-1 p-0 custom-scrollbar\">\r\n                    <table class=\"w-full text-sm text-left border-collapse\">\r\n                      <thead class=\"text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase bg-slate-50 dark:bg-slate-800/80 sticky top-0 shadow-sm z-10\">\r\n                        <tr>\r\n                          <th class=\"px-6 py-3 tracking-wider w-1/3\">H\u00F3a ch\u1EA5t v\u00E0 v\u1EADt t\u01B0</th>\r\n                          <th class=\"px-6 py-3 tracking-wider text-right hidden sm:table-cell\">C\u00F4ng th\u1EE9c</th>\r\n                          <th class=\"px-6 py-3 tracking-wider text-right hidden sm:table-cell\">\u0110\u1ECBnh m\u1EE9c</th>\r\n                          <th class=\"px-6 py-3 tracking-wider text-right hidden sm:table-cell\">Ti\u00EAu hao</th>\r\n                          <th class=\"px-6 py-3 tracking-wider text-right w-32\">T\u1ED5ng c\u1EA7n</th>\r\n                          <th class=\"px-6 py-3 tracking-wider text-center w-20\">\u0110\u01A1n v\u1ECB</th>\r\n                        </tr>\r\n                      </thead>\r\n                      <tbody class=\"divide-y divide-slate-50 dark:divide-slate-700/50\">\r\n                        @for (item of calculatedItems(); track item.name) {\r\n                          <tr class=\"group hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition duration-150\" [ngClass]=\"{'bg-red-50 dark:bg-red-900/10': item.isMissing}\">\r\n                            <td class=\"px-6 py-4 align-top\">\r\n                              <div class=\"flex flex-col\">\r\n                                <span class=\"font-bold text-slate-700 dark:text-slate-300 text-sm group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors\">\r\n                                  {{resolveName(item)}}\r\n                                </span>\r\n                                <div class=\"flex flex-wrap gap-1 mt-1\">\r\n                                  @if(item.ghsWarnings && item.ghsWarnings.length > 0) {\r\n                                    <div class=\"flex gap-0.5 opacity-70\">\r\n                                      @for(ghs of item.ghsWarnings; track ghs) {\r\n                                        @if(ghs.startsWith('GHS')) {\r\n                                          <img [src]=\"GHS_DICT[ghs].iconUrl\" class=\"w-3.5 h-3.5\" [title]=\"GHS_DICT[ghs].label\" />\r\n                                        }\r\n                                      }\r\n                                    </div>\r\n                                  }\r\n                                  @if(item.isMissing) {\r\n                                    <span class=\"text-[10px] font-bold text-red-600 dark:text-red-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-red-200 dark:border-red-800/50\"><i class=\"fa-solid fa-circle-xmark\"></i> Kh\u00F4ng c\u00F3 trong kho</span>\r\n                                  }\r\n                                  @if (item.displayWarning) {\r\n                                    <span class=\"text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded border border-orange-100 dark:border-orange-800/50\"><i class=\"fa-solid fa-triangle-exclamation\"></i> {{item.displayWarning}}</span>\r\n                                  }\r\n                                </div>\r\n                              </div>\r\n                            </td>\r\n                            <td class=\"px-6 py-4 text-right align-top hidden sm:table-cell\">\r\n                              <code class=\"text-[10px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono\">{{item.formula}}</code>\r\n                            </td>\r\n                            <td class=\"px-6 py-4 text-right align-top hidden sm:table-cell\">\r\n                              <span class=\"font-medium text-slate-600 dark:text-slate-400 text-sm tabular-nums\">{{formatNum(item.baseQty || 0)}}</span>\r\n                            </td>\r\n                            <td class=\"px-6 py-4 text-right align-top hidden sm:table-cell\">\r\n                              <span class=\"text-xs font-bold text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-md border border-orange-100 dark:border-orange-800/50\">+{{item.appliedMargin || 0}}%</span>\r\n                            </td>\r\n                            <td class=\"px-6 py-4 text-right align-top\">\r\n                              <span class=\"font-black text-blue-600 dark:text-blue-400 text-lg tabular-nums\">{{formatNum(item.totalQty)}}</span>\r\n                            </td>\r\n                            <td class=\"px-6 py-4 text-center align-top\"><span class=\"text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md\">{{item.unit}}</span></td>\r\n                          </tr>\r\n\r\n                          @if (item.isComposite) {\r\n                            <tr class=\"bg-slate-50/50 dark:bg-slate-800/30\">\r\n                              <td colspan=\"6\" class=\"px-6 py-2 pb-4\">\r\n                                <div class=\"bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-sm ml-4\">\r\n                                  <div class=\"text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2\">Th\u00E0nh ph\u1EA7n</div>\r\n                                  <div class=\"grid gap-2\">\r\n                                    @for (sub of item.breakdown; track sub.name) {\r\n                                      <div class=\"flex justify-between items-center text-xs border-b border-slate-50 dark:border-slate-700/50 last:border-0 pb-1\" [ngClass]=\"{'text-red-500 dark:text-red-400': sub.isMissing}\">\r\n                                        <div class=\"flex items-center gap-2\">\r\n                                          <span class=\"font-medium\" [ngClass]=\"{'text-slate-600 dark:text-slate-300': !sub.isMissing}\">{{resolveName(sub)}}</span>\r\n                                          @if(sub.ghsWarnings && sub.ghsWarnings.length > 0) {\r\n                                            <div class=\"flex gap-0.5 opacity-70\">\r\n                                              @for(ghs of sub.ghsWarnings; track ghs) {\r\n                                                @if(ghs.startsWith('GHS')) {\r\n                                                  <img [src]=\"GHS_DICT[ghs].iconUrl\" class=\"w-2.5 h-2.5\" [title]=\"GHS_DICT[ghs].label\" />\r\n                                                }\r\n                                              }\r\n                                            </div>\r\n                                          }\r\n                                          @if(sub.isMissing) { <i class=\"fa-solid fa-circle-exclamation text-[10px]\" title=\"Kh\u00F4ng t\u00ECm th\u1EA5y trong kho\"></i> }\r\n                                          <span class=\"text-[10px] text-slate-400 dark:text-slate-500 italic\">({{sub.amountPerUnit}} / {{item.unit}})</span>\r\n                                        </div>\r\n                                        <div class=\"flex items-center gap-3\">\r\n                                          <span class=\"text-[10px] text-slate-400 dark:text-slate-500\">\u0110\u1ECBnh m\u1EE9c: {{formatNum(sub.baseAmount || 0)}}</span>\r\n                                          <span class=\"text-[10px] font-bold text-orange-500 dark:text-orange-400\">+{{sub.appliedMargin || 0}}%</span>\r\n                                          <div class=\"flex items-center gap-1\"><span class=\"font-bold text-slate-700 dark:text-slate-300 font-mono\">{{formatNum(sub.displayAmount)}}</span><span class=\"text-[10px] text-slate-500 dark:text-slate-400\">{{sub.unit}}</span></div>\r\n                                        </div>\r\n                                      </div>\r\n                                    }\r\n                                  </div>\r\n                                </div>\r\n                              </td>\r\n                            </tr>\r\n                          }\r\n                          } @empty {\r\n                          <tr><td colspan=\"4\" class=\"p-10 text-center text-slate-400 dark:text-slate-500 italic\">Ch\u01B0a c\u00F3 d\u1EEF li\u1EC7u t\u00EDnh to\u00E1n.</td></tr>\r\n                        }\r\n                      </tbody>\r\n                    </table>\r\n                  </div>\r\n\r\n                  <!-- Safety Pre-Flight Briefing -->\r\n                  @if(aggregateGHSWarnings().length > 0) {\r\n                    <div class=\"mt-4 bg-orange-50 dark:bg-orange-900/10 border-l-4 border-orange-500 p-4 rounded-r-xl\">\r\n                      <h4 class=\"font-bold text-orange-800 dark:text-orange-300 text-sm flex items-center gap-2 mb-2\">\r\n                        <i class=\"fa-solid fa-shield-virus\"></i> H\u01B0\u1EDBng D\u1EABn An To\u00E0n Tr\u01B0\u1EDBc Pha Ch\u1EBF\r\n                      </h4>\r\n\r\n                      <!-- GHS Icons -->\r\n                      <div class=\"flex flex-wrap gap-2 mb-3\">\r\n                        @for(code of aggregateGHSWarnings(); track code) {\r\n                          @if(code.startsWith('GHS')) {\r\n                            <div class=\"bg-white dark:bg-slate-800 p-1.5 rounded-md shadow-sm border border-orange-100 dark:border-orange-800 group relative\">\r\n                              <img [src]=\"GHS_DICT[code].iconUrl\" class=\"w-8 h-8 flex-shrink-0\" [title]=\"GHS_DICT[code].label\"/>\r\n                              <div class=\"absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10\">{{GHS_DICT[code].label}}</div>\r\n                            </div>\r\n                          }\r\n                        }\r\n                      </div>\r\n\r\n                      <!-- Safety Checklist -->\r\n                      <div class=\"space-y-3\">\r\n                        <ul class=\"space-y-1.5 text-xs text-orange-700 dark:text-orange-300 font-medium\">\r\n                          @for(code of aggregateGHSWarnings(); track code) {\r\n                            @if(!code.startsWith('GHS')) {\r\n                              <li class=\"flex items-start gap-1.5\">\r\n                                <i class=\"fa-solid fa-circle text-[4px] mt-1.5 opacity-50\"></i>\r\n                                <span class=\"break-words whitespace-normal\">{{code}}</span>\r\n                              </li>\r\n                            }\r\n                          }\r\n                          <!-- Generic rules associated with the GHS modules -->\r\n                          @for(code of aggregateGHSWarnings(); track code) {\r\n                            @if(code.startsWith('GHS')) {\r\n                              @for(rule of GHS_DICT[code].precautions; track rule) {\r\n                                <li class=\"flex items-start gap-1.5 opacity-80\">\r\n                                  <i class=\"fa-solid fa-circle text-[4px] mt-1.5 opacity-50\"></i>\r\n                                  <span class=\"break-words whitespace-normal\">{{rule}}</span>\r\n                                </li>\r\n                              }\r\n                            }\r\n                          }\r\n                        </ul>\r\n                      </div>\r\n                    </div>\r\n                  }\r\n                </div>\r\n              </div>\r\n            }\r\n            @else {\r\n            <!-- LIBRARY VIEW -->\r\n            <div class=\"flex flex-col flex-1 min-h-0 animate-fade-in relative\">\r\n              <!-- Header Area -->\r\n              <div class=\"flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 shrink-0 mt-4\">\r\n                <div class=\"flex items-center gap-3\">\r\n                  <div class=\"w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-800/30 shadow-sm shrink-0\">\r\n                    <i class=\"fa-solid fa-book text-base\"></i>\r\n                  </div>\r\n                  <div>\r\n                    <h2 class=\"text-xl font-black text-slate-855 dark:text-slate-100 tracking-tight leading-tight\">Th\u01B0 Vi\u1EC7n Quy Tr\u00ECnh v\u00E0 C\u00F4ng Th\u1EE9c</h2>\r\n                    <p class=\"text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5\">Danh s\u00E1ch quy tr\u00ECnh chu\u1EA9n h\u00F3a SOP v\u00E0 c\u00F4ng th\u1EE9c pha ch\u1EBF c\u00F3 s\u1EB5n trong h\u1EC7 th\u1ED1ng.</p>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"flex justify-between items-end border-b border-slate-200 dark:border-slate-700 mb-6 shrink-0 pt-4 px-1\">\r\n                <div class=\"flex gap-6\">\r\n                  <button (click)=\"libraryTab.set('sops')\"\r\n                    class=\"pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide px-2\"\r\n                    [class]=\"libraryTab() === 'sops' ? 'border-blue-600 text-blue-700 dark:text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'\">\r\n                    <i class=\"fa-solid fa-file-lines\"></i> Quy Tr\u00ECnh (SOPs)\r\n                  </button>\r\n                  @if(canViewRecipes() || state.showLockedFeatures()) {\r\n                    <button [appLockPermission]=\"'recipe_view'\" (click)=\"libraryTab.set('recipes')\"\r\n                      class=\"pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide px-2\"\r\n                      [class]=\"libraryTab() === 'recipes' ? 'border-purple-600 text-purple-700 dark:text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'\">\r\n                      <i class=\"fa-solid fa-flask\"></i> C\u00F4ng Th\u1EE9c Pha Ch\u1EBF\r\n                    </button>\r\n                  }\r\n                </div>\r\n              </div>\r\n\r\n              @if (libraryTab() === 'sops') {\r\n                <div class=\"flex flex-col flex-1 min-h-0 animate-slide-up\">\r\n                  <div class=\"flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0\">\r\n                    <div class=\"relative flex-1 md:max-w-md\">\r\n                      <i class=\"fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400\"></i>\r\n                      <input type=\"text\" [ngModel]=\"searchTerm()\" (ngModelChange)=\"searchTerm.set($event)\"\r\n                        class=\"w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 shadow-sm transition\"\r\n                        placeholder=\"T\u00ECm ki\u1EBFm SOP...\">\r\n                      </div>\r\n\r\n                      @if(canEditSop() || state.showLockedFeatures()) {\r\n                        <div class=\"flex gap-2 self-end md:self-auto\">\r\n                          <button [appLockPermission]=\"'sop_edit'\" (click)=\"importFileInput.click()\" class=\"bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 px-4 py-2 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shrink-0 active:scale-95\" title=\"Nh\u1EADp SOP t\u1EEB t\u1EC7p JSON\">\r\n                            <i class=\"fa-solid fa-file-import\"></i> <span class=\"hidden md:inline\">Nh\u1EADp</span>\r\n                          </button>\r\n                          <input #importFileInput type=\"file\" class=\"hidden\" accept=\".json\" (change)=\"importSop($event)\">\r\n\r\n                          <button [appLockPermission]=\"'sop_edit'\" (click)=\"createNew()\" class=\"bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 shrink-0 active:scale-95\">\r\n                            <i class=\"fa-solid fa-plus\"></i> <span class=\"hidden md:inline\">T\u1EA1o M\u1EDBi</span>\r\n                          </button>\r\n                        </div>\r\n                      }\r\n                    </div>\r\n\r\n                    <div class=\"overflow-y-auto pb-10 custom-scrollbar p-1 flex-1\">\r\n                      <div class=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4\">\r\n                        @for (sop of filteredSops(); track sop.id) {\r\n                          <div class=\"bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300 group relative flex flex-col h-full min-h-[160px]\"\r\n                            (click)=\"selectSop(sop)\">\r\n                            <div class=\"flex justify-between items-start mb-2\">\r\n                              <div class=\"flex items-center gap-2 flex-wrap\">\r\n                                <span class=\"text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600 truncate max-w-[120px]\" [title]=\"sop.category\">{{sop.category}}</span>\r\n                                @if(sop.version) { <span class=\"text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-700\">v{{sop.version}}</span> }\r\n                              </div>\r\n                              <button (click)=\"toggleMenu(sop.id, $event)\" class=\"w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition relative z-20 -mr-2 -mt-2\"><i class=\"fa-solid fa-ellipsis-vertical\"></i></button>\r\n                              @if (activeMenuSopId() === sop.id) {\r\n                                <div class=\"absolute top-8 right-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-1 w-48 z-30 animate-slide-up overflow-hidden\" (click)=\"$event.stopPropagation()\">\r\n                                  <button (click)=\"exportSop(sop, $event)\" class=\"w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition\"><i class=\"fa-solid fa-download text-emerald-500 w-4\"></i> Xu\u1EA5t JSON</button>\r\n                                  @if(canEditSop() || state.showLockedFeatures()) {\r\n                                    <button [appLockPermission]=\"'sop_edit'\" (click)=\"duplicateSop(sop, $event)\" class=\"w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition\"><i class=\"fa-solid fa-copy text-purple-500 w-4\"></i> Nh\u00E2n B\u1EA3n</button>\r\n                                    <button [appLockPermission]=\"'sop_edit'\" (click)=\"editDirect(sop, $event)\" class=\"w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition\"><i class=\"fa-solid fa-pen text-blue-500 w-4\"></i> Ch\u1EC9nh S\u1EEDa</button>\r\n                                    <div class=\"h-px bg-slate-100 dark:bg-slate-700 my-1\"></div>\r\n                                    <button [appLockPermission]=\"'sop_edit'\" (click)=\"softDeleteSop(sop, $event)\" class=\"w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2 transition\"><i class=\"fa-solid fa-box-archive w-4\"></i> L\u01B0u Tr\u1EEF</button>\r\n                                  }\r\n                                </div>\r\n                              }\r\n                            </div>\r\n                            <h3 class=\"font-bold text-slate-700 dark:text-slate-200 text-lg leading-snug mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors pr-2 line-clamp-2\">{{sop.name}}</h3>\r\n                            <div class=\"mt-auto pt-3 border-t border-slate-50 dark:border-slate-700/50 flex justify-between items-center text-xs text-slate-400 font-medium\"><span>{{sop.consumables.length}} ch\u1EA5t</span><span>{{formatDate(sop.lastModified)}}</span></div>\r\n                          </div>\r\n                          } @empty {\r\n                          <div class=\"col-span-full py-20 text-center text-slate-400 italic flex flex-col items-center\">\r\n                            <i class=\"fa-solid fa-folder-open text-4xl mb-3 text-slate-300 dark:text-slate-600\"></i><p>Ch\u01B0a c\u00F3 quy tr\u00ECnh n\u00E0o ph\u00F9 h\u1EE3p.</p>\r\n                          </div>\r\n                        }\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n                }\r\n\r\n                @if (libraryTab() === 'recipes') {\r\n                  <div class=\"flex-1 min-h-0 animate-slide-up\">\r\n                    <app-recipe-manager></app-recipe-manager>\r\n                  </div>\r\n                }\r\n              </div>\r\n            }\r\n\r\n            <!-- QUICK GENERATE MODAL -->\r\n            @if (quickGenerateModalOpen()) {\r\n              <app-quick-generate-sample-modal\r\n                (close)=\"closeQuickGenerateModal()\"\r\n                (generated)=\"handleGeneratedSamples($event)\">\r\n              </app-quick-generate-sample-modal>\r\n            }\r\n          </div>\r\n" }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(CalculatorComponent, { className: "CalculatorComponent", filePath: "src/app/features/sop/calculator/calculator.component.ts", lineNumber: 50 }); })();
function normalizeDescription(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}
//# sourceMappingURL=calculator.component.js.map