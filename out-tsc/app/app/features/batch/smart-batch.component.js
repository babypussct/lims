import { ChangeDetectionStrategy, Component, inject, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { getCanonicalId, normalizeSampleCode, resolveTargetMasterInfo } from '../results/shared/compound-id-resolver';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../core/services/state.service';
import { AuthService } from '../../core/services/auth.service';
import { CalculatorService } from '../../core/services/calculator.service';
import { RecipeService } from '../recipes/recipe.service';
import { TargetService } from '../targets/target.service';
import { InventoryService } from '../inventory/inventory.service';
import { MatrixTypeService } from '../config/matrix-type.service';
import { MasterDeviceService } from '../config/master-device.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { formatNum, formatSampleList } from '../../shared/utils/utils';
import { GHS_DICTIONARY } from '../../core/services/pubchem.service';
import { computeTargetSignature } from '../targets/target-scope-classifier';
import { SampleDescriptionMasterService } from '../config/sample-description-master.service';
import { formatSampleDescriptions, getSampleDescriptionSnapshot, setSampleDescriptionSnapshot, subsetSampleDescriptionMap } from '../../shared/utils/sample-description.utils';
import { applyNeedsToStockLedger, buildAnalysisTaskKey, countUnavailableStockItems, getSopTargetKey, isSopMatrixCompatible, parseUniqueSampleCodes, validateCalculatedItems } from './smart-batch.utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
const SmartBatchComponent_Conditional_24_Defer_1_DepsFn = () => [import("./components/batch-split-wizard.component").then(m => m.BatchSplitWizardComponent)];
const SmartBatchComponent_Conditional_26_Defer_1_DepsFn = () => [import("../../shared/components/quick-generate-sample-modal/quick-generate-sample-modal.component").then(m => m.QuickGenerateSampleModalComponent)];
const _c0 = () => [];
const _c1 = a0 => ({ "bg-teal-50 dark:bg-teal-900/20": a0 });
const _c2 = a0 => ({ "bg-indigo-50/50 dark:bg-indigo-900/10": a0 });
const _c3 = a0 => ({ "text-red-600 dark:text-red-400": a0 });
const _c4 = a0 => ({ "text-red-500 dark:text-red-400": a0 });
const _c5 = a0 => ({ "text-red-500 dark:text-red-400 font-bold": a0 });
const _c6 = a0 => ({ "bg-red-50/50 dark:bg-red-900/10": a0 });
const _forTrack0 = ($index, $item) => $item.id;
const _forTrack1 = ($index, $item) => $item.uniqueKey;
const _forTrack2 = ($index, $item) => $item.sop.id;
const _forTrack3 = ($index, $item) => $item.code + $item.message;
const _forTrack4 = ($index, $item) => $item.sample + $item.targetId;
const _forTrack5 = ($index, $item) => $item.var;
const _forTrack6 = ($index, $item) => $item.value;
const _forTrack7 = ($index, $item) => $item.name;
const _forTrack8 = ($index, $item) => $item.targetId + $item.blockId;
function SmartBatchComponent_For_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 2);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const description_r1 = ctx.$implicit;
    i0.ɵɵproperty("value", description_r1.name);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate((description_r1.aliases == null ? null : description_r1.aliases.join(", ")) || description_r1.description || "");
} }
function SmartBatchComponent_Conditional_11_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 18);
    i0.ɵɵelement(1, "i", 20);
    i0.ɵɵtext(2, "Gh\u00E9p Nhi\u1EC1u M\u1EABu ");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_11_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 19);
    i0.ɵɵelement(1, "i", 21);
    i0.ɵɵtext(2, "M\u1ED9t M\u1EABu Duy Nh\u1EA5t ");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, SmartBatchComponent_Conditional_11_Conditional_0_Template, 3, 0, "span", 18)(1, SmartBatchComponent_Conditional_11_Conditional_1_Template, 3, 0, "span", 19);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵconditional(ctx_r1.smartBatchMode() === "multiple" ? 0 : 1);
} }
function SmartBatchComponent_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 22);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_15_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openSopCalculator()); });
    i0.ɵɵelement(1, "i", 23);
    i0.ɵɵtext(2, " T\u00EDnh nhanh SOP ");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 24);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_16_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.goBackToStep0()); });
    i0.ɵɵelement(1, "i", 25);
    i0.ɵɵtext(2, " \u0110\u1ED5i Ch\u1EBF \u0110\u1ED9 ");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 24);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_17_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.goBackFromStep2()); });
    i0.ɵɵelement(1, "i", 26);
    i0.ɵɵtext(2, " Quay L\u1EA1i ");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_19_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 13)(1, "div", 27)(2, "h3", 28);
    i0.ɵɵtext(3, "Ch\u1ECDn C\u00E1ch L\u1EADp M\u1EBB");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 29);
    i0.ɵɵtext(5, "Vui l\u00F2ng ch\u1ECDn ch\u1EBF \u0111\u1ED9 thi\u1EBFt l\u1EADp ph\u00F9 h\u1EE3p v\u1EDBi nhu c\u1EA7u ph\u00E2n t\u00EDch c\u1EE7a b\u1EA1n");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "div", 30)(7, "div", 31);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_19_Template_div_click_7_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.selectMode("multiple")); });
    i0.ɵɵelementStart(8, "div")(9, "div", 32);
    i0.ɵɵelement(10, "i", 33);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "h4", 34);
    i0.ɵɵtext(12, "Gh\u00E9p Nhi\u1EC1u M\u1EABu");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "p", 35);
    i0.ɵɵtext(14, " Ph\u00E2n t\u00EDch \u0111\u1ED3ng th\u1EDDi nhi\u1EC1u m\u1EABu kh\u00E1c nhau, t\u1EF1 \u0111\u1ED9ng t\u1ED1i \u01B0u h\u00F3a v\u00E0 gh\u00E9p c\u00E1c m\u1EABu c\u00F3 chung ch\u1EC9 ti\u00EAu v\u00E0o c\u00E1c quy tr\u00ECnh (SOP) ch\u1EA1y chung \u0111\u1EC3 ti\u1EBFt ki\u1EC7m h\u00F3a ch\u1EA5t. ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "div", 36);
    i0.ɵɵtext(16, " B\u1EAFt \u0111\u1EA7u ");
    i0.ɵɵelement(17, "i", 37);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(18, "div", 38);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_19_Template_div_click_18_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.selectMode("single")); });
    i0.ɵɵelementStart(19, "div")(20, "div", 39);
    i0.ɵɵelement(21, "i", 40);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "h4", 41);
    i0.ɵɵtext(23, "M\u1ED9t M\u1EABu Duy Nh\u1EA5t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "p", 35);
    i0.ɵɵtext(25, " Ph\u00E2n t\u00EDch m\u1ED9t m\u1EABu ki\u1EC3m nghi\u1EC7m duy nh\u1EA5t, t\u1EF1 \u0111\u1ED9ng ph\u00E2n chia c\u00E1c ch\u1EC9 ti\u00EAu ph\u00E2n t\u00EDch \u0111\u0103ng k\u00FD v\u00E0o c\u00E1c m\u1EBB ch\u1EA1y/SOP ph\u00F9 h\u1EE3p c\u1EE7a ph\u00F2ng th\u00ED nghi\u1EC7m. ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(26, "div", 42);
    i0.ɵɵtext(27, " B\u1EAFt \u0111\u1EA7u ");
    i0.ɵɵelement(28, "i", 37);
    i0.ɵɵelementEnd()()()();
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "input", 74);
    i0.ɵɵlistener("ngModelChange", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_5_Template_input_ngModelChange_0_listener($event) { i0.ɵɵrestoreView(_r11); const ɵ$index_120_r10 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.updateBlockName(ɵ$index_120_r10, $event)); })("blur", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_5_Template_input_blur_0_listener() { i0.ɵɵrestoreView(_r11); const ctx_r1 = i0.ɵɵnextContext(5); return i0.ɵɵresetView(ctx_r1.isEditingName.set(null)); })("keyup.enter", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_5_Template_input_keyup_enter_0_listener() { i0.ɵɵrestoreView(_r11); const ctx_r1 = i0.ɵɵnextContext(5); return i0.ɵɵresetView(ctx_r1.isEditingName.set(null)); })("click", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_5_Template_input_click_0_listener($event) { i0.ɵɵrestoreView(_r11); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const block_r12 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("ngModel", block_r12.name);
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "h3", 75);
    i0.ɵɵlistener("dblclick", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_6_Template_h3_dblclick_0_listener() { i0.ɵɵrestoreView(_r13); const block_r12 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.isEditingName.set(block_r12.id)); });
    i0.ɵɵtext(1);
    i0.ɵɵelement(2, "i", 76);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const block_r12 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", block_r12.name, " ");
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_For_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 2);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const m_r14 = ctx.$implicit;
    i0.ɵɵproperty("value", m_r14.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(m_r14.name);
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_10_For_9_Template(rf, ctx) { if (rf & 1) {
    const _r16 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 108)(1, "span", 110);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 111);
    i0.ɵɵelement(4, "i", 112);
    i0.ɵɵelementStart(5, "input", 113);
    i0.ɵɵlistener("ngModelChange", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_10_For_9_Template_input_ngModelChange_5_listener($event) { const sampleCode_r17 = i0.ɵɵrestoreView(_r16).$implicit; const ɵ$index_120_r10 = i0.ɵɵnextContext(3).$index; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.updateBlockSampleDescription(ɵ$index_120_r10, sampleCode_r17, $event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "button", 114);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_10_For_9_Template_button_click_6_listener() { const sampleCode_r17 = i0.ɵɵrestoreView(_r16).$implicit; const ɵ$index_120_r10 = i0.ɵɵnextContext(3).$index; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.applyDescriptionToAll(ɵ$index_120_r10, sampleCode_r17)); });
    i0.ɵɵelement(7, "i", 115);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const sampleCode_r17 = ctx.$implicit;
    const block_r12 = i0.ɵɵnextContext(3).$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(sampleCode_r17);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngModel", ctx_r1.getBlockSampleDescription(block_r12, sampleCode_r17));
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "details", 84)(1, "summary", 104)(2, "span");
    i0.ɵɵelement(3, "i", 105);
    i0.ɵɵtext(4, "M\u00F4 t\u1EA3 t\u1EEBng m\u1EABu \u2014 t\u00F9y ch\u1ECDn");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span", 106);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "div", 107);
    i0.ɵɵrepeaterCreate(8, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_10_For_9_Template, 8, 2, "div", 108, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "p", 109);
    i0.ɵɵtext(11, "T\u00EAn ch\u1ECDn t\u1EEB danh m\u1EE5c g\u1ED1c \u0111\u01B0\u1EE3c l\u01B0u k\u00E8m m\u00E3 \u0111\u1ECBnh danh; n\u1ED9i dung nh\u1EADp t\u1EF1 do \u0111\u01B0\u1EE3c l\u01B0u t\u1EA1i th\u1EDDi \u0111i\u1EC3m l\u1EADp m\u1EBB.");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const block_r12 = i0.ɵɵnextContext(2).$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate2("", ctx_r1.getBlockDescriptionCount(block_r12), "/", ctx_r1.getBlockSamples(block_r12).length, " m\u1EABu");
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r1.getBlockSamples(block_r12));
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_For_27_Template(rf, ctx) { if (rf & 1) {
    const _r18 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "label", 97)(1, "input", 116);
    i0.ɵɵlistener("change", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_For_27_Template_input_change_1_listener() { const t_r19 = i0.ɵɵrestoreView(_r18).$implicit; const ɵ$index_120_r10 = i0.ɵɵnextContext(2).$index; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.toggleBlockTarget(ɵ$index_120_r10, t_r19.uniqueKey)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "div", 117)(3, "div", 118);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const t_r19 = ctx.$implicit;
    const block_r12 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction1(3, _c1, block_r12.selectedTargets.has(t_r19.uniqueKey)));
    i0.ɵɵadvance();
    i0.ɵɵproperty("checked", block_r12.selectedTargets.has(t_r19.uniqueKey));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(t_r19.name);
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 98);
    i0.ɵɵtext(1, "Kh\u00F4ng t\u00ECm th\u1EA5y.");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_34_Template(rf, ctx) { if (rf & 1) {
    const _r20 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 119);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_34_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r20); const ɵ$index_120_r10 = i0.ɵɵnextContext(2).$index; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.updateBlockForcedSop(ɵ$index_120_r10, undefined)); });
    i0.ɵɵtext(1, "B\u1ECF Ch\u1EC9 \u0110\u1ECBnh");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_35_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 103);
    i0.ɵɵtext(1, "Vui l\u00F2ng ch\u1ECDn \u00EDt nh\u1EA5t 1 ch\u1EC9 ti\u00EAu \u0111\u1EC3 xem c\u00E1c quy tr\u00ECnh ph\u00F9 h\u1EE3p.");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 120);
    i0.ɵɵtext(1, "Kh\u00F4ng t\u00ECm th\u1EA5y quy tr\u00ECnh ph\u00F9 h\u1EE3p. H\u00E3y ki\u1EC3m tra l\u1EA1i c\u1EA5u h\u00ECnh n\u1EC1n m\u1EABu ho\u1EB7c danh m\u1EE5c ch\u1EC9 ti\u00EAu.");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_1_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 122);
    i0.ɵɵelement(1, "i", 126);
    i0.ɵɵelementStart(2, "p");
    i0.ɵɵtext(3, "Kh\u00F4ng c\u00F3 quy tr\u00ECnh n\u00E0o bao ph\u1EE7 to\u00E0n b\u1ED9 m\u1EE5c ti\u00EAu. C\u00E1c quy tr\u00ECnh g\u1EA7n nh\u1EA5t d\u01B0\u1EDBi \u0111\u00E2y ch\u1EC9 mang t\u00EDnh tham kh\u1EA3o, nh\u00F3m s\u1EBD t\u1EF1 \u0111\u1ED9ng ph\u00E2n t\u00E1ch m\u1EBB \u1EDF B\u01B0\u1EDBc 2.");
    i0.ɵɵelementEnd()();
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_1_Conditional_1_For_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 130);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const mt_r21 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(mt_r21.name);
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_1_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 123)(1, "div", 127);
    i0.ɵɵelement(2, "i", 128);
    i0.ɵɵelementStart(3, "p");
    i0.ɵɵtext(4, "Quy tr\u00ECnh \u0111\u01B0\u1EE3c ch\u1EC9 \u0111\u1ECBnh ch\u1EC9 bao ph\u1EE7 ");
    i0.ɵɵelementStart(5, "b");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(7, " ch\u1EC9 ti\u00EAu. ");
    i0.ɵɵelementStart(8, "b");
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(10, " ch\u1EC9 ti\u00EAu c\u00F2n l\u1EA1i d\u01B0\u1EDBi \u0111\u00E2y s\u1EBD \u0111\u01B0\u1EE3c h\u1EC7 th\u1ED1ng t\u1EF1 \u0111\u1ED9ng t\u00E1ch sang m\u1EBB m\u1EDBi \u1EDF B\u01B0\u1EDBc 2:");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "div", 129);
    i0.ɵɵrepeaterCreate(12, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_1_Conditional_1_For_13_Template, 2, 1, "span", 130, _forTrack0);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const block_r12 = i0.ɵɵnextContext(4).$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate2("", (ctx_r1.sopSuggestionsMap().get(block_r12.id) || i0.ɵɵpureFunction0(3, _c0))[0].coverageCount, "/", (ctx_r1.sopSuggestionsMap().get(block_r12.id) || i0.ɵɵpureFunction0(4, _c0))[0].totalRequired, "");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate((ctx_r1.sopSuggestionsMap().get(block_r12.id) || i0.ɵɵpureFunction0(5, _c0))[0].missingTargets.length);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater((ctx_r1.sopSuggestionsMap().get(block_r12.id) || i0.ɵɵpureFunction0(6, _c0))[0].missingTargets);
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_1_For_4_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 134);
    i0.ɵɵelement(1, "i", 147);
    i0.ɵɵtext(2, " Ch\u1EC9 \u0110\u1ECBnh Th\u1EE7 C\u00F4ng");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_1_For_4_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 135);
    i0.ɵɵelement(1, "i", 148);
    i0.ɵɵtext(2, " T\u1ED1t Nh\u1EA5t");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_1_For_4_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 137);
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_1_For_4_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 139);
    i0.ɵɵelement(1, "div", 149);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const sug_r23 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(8);
    i0.ɵɵadvance();
    i0.ɵɵstyleProp("background-color", ctx_r1.getMatrixColor(sug_r23.sop.matrixTags[0]));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.getMatrixLabel(sug_r23.sop.matrixTags[0]), " ");
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_1_For_4_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 139);
    i0.ɵɵelement(1, "div", 150);
    i0.ɵɵtext(2, " D\u00F9ng Chung ");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_1_For_4_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 142);
    i0.ɵɵelement(1, "i", 151);
    i0.ɵɵtext(2, " Kho");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_1_For_4_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 143);
    i0.ɵɵelement(1, "i", 152);
    i0.ɵɵtext(2, " Kho");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_1_For_4_Template(rf, ctx) { if (rf & 1) {
    const _r22 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 131)(1, "button", 132);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_1_For_4_Template_button_click_1_listener() { const sug_r23 = i0.ɵɵrestoreView(_r22).$implicit; const ɵ$index_120_r10 = i0.ɵɵnextContext(4).$index; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.updateBlockForcedSop(ɵ$index_120_r10, sug_r23.sop.id)); });
    i0.ɵɵelementStart(2, "div", 133);
    i0.ɵɵtemplate(3, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_1_For_4_Conditional_3_Template, 3, 0, "span", 134)(4, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_1_For_4_Conditional_4_Template, 3, 0, "span", 135);
    i0.ɵɵelementStart(5, "span", 136);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(7, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_1_For_4_Conditional_7_Template, 1, 0, "i", 137);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 138);
    i0.ɵɵtemplate(9, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_1_For_4_Conditional_9_Template, 3, 3, "span", 139)(10, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_1_For_4_Conditional_10_Template, 3, 0, "span", 139);
    i0.ɵɵelementStart(11, "span", 140);
    i0.ɵɵelement(12, "i", 141);
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(14, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_1_For_4_Conditional_14_Template, 3, 0, "span", 142)(15, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_1_For_4_Conditional_15_Template, 3, 0, "span", 143);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "div", 144);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_1_For_4_Template_div_click_16_listener($event) { const sug_r23 = i0.ɵɵrestoreView(_r22).$implicit; const ɵ$index_120_r10 = i0.ɵɵnextContext(4).$index; const ctx_r1 = i0.ɵɵnextContext(4); ctx_r1.openSopPreview(ɵ$index_120_r10, sug_r23); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementStart(17, "button", 145);
    i0.ɵɵelement(18, "i", 146);
    i0.ɵɵtext(19, " Xem Chi Ti\u1EBFt ");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const sug_r23 = ctx.$implicit;
    const block_r12 = i0.ɵɵnextContext(4).$implicit;
    i0.ɵɵclassProp("ring-2", block_r12.forcedSopId === sug_r23.sop.id)("ring-indigo-500", block_r12.forcedSopId === sug_r23.sop.id);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", sug_r23.isPartial && !sug_r23.sop.isManualOnly);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(sug_r23.sop.isManualOnly ? 3 : sug_r23.isBest && !sug_r23.isPartial ? 4 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(sug_r23.sop.name);
    i0.ɵɵadvance();
    i0.ɵɵconditional(block_r12.forcedSopId === sug_r23.sop.id ? 7 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(sug_r23.sop.matrixTags && sug_r23.sop.matrixTags.length > 0 ? 9 : 10);
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("text-red-500", sug_r23.isPartial);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2(" ", sug_r23.coverageCount, "/", sug_r23.totalRequired, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(sug_r23.isMissingStock ? 14 : 15);
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_1_Conditional_0_Template, 4, 0, "div", 122)(1, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_1_Conditional_1_Template, 14, 7, "div", 123);
    i0.ɵɵelementStart(2, "div", 124);
    i0.ɵɵrepeaterCreate(3, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_1_For_4_Template, 20, 14, "div", 125, _forTrack2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const block_r12 = i0.ɵɵnextContext(3).$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵconditional((ctx_r1.sopSuggestionsMap().get(block_r12.id) || i0.ɵɵpureFunction0(2, _c0)).length > 0 && (ctx_r1.sopSuggestionsMap().get(block_r12.id) || i0.ɵɵpureFunction0(3, _c0))[0].isPartial && !block_r12.forcedSopId ? 0 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(block_r12.forcedSopId && (ctx_r1.sopSuggestionsMap().get(block_r12.id) || i0.ɵɵpureFunction0(4, _c0)).length > 0 && (ctx_r1.sopSuggestionsMap().get(block_r12.id) || i0.ɵɵpureFunction0(5, _c0))[0].isPartial && (ctx_r1.sopSuggestionsMap().get(block_r12.id) || i0.ɵɵpureFunction0(6, _c0))[0].sop.id === block_r12.forcedSopId ? 1 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r1.sopSuggestionsMap().get(block_r12.id) || i0.ɵɵpureFunction0(7, _c0));
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_2_For_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 2);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const sug_r25 = ctx.$implicit;
    i0.ɵɵproperty("value", sug_r25.sop.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate3("", sug_r25.sop.name, " (", sug_r25.coverageCount, "/", sug_r25.totalRequired, " ch\u1EC9 ti\u00EAu)");
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r24 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 121)(1, "span", 153);
    i0.ɵɵtext(2, "CH\u1EC8 \u0110\u1ECANH TH\u1EE6 C\u00D4NG:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "select", 154);
    i0.ɵɵlistener("ngModelChange", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_2_Template_select_ngModelChange_3_listener($event) { i0.ɵɵrestoreView(_r24); const ɵ$index_120_r10 = i0.ɵɵnextContext(3).$index; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.updateBlockForcedSop(ɵ$index_120_r10, $event === "" ? undefined : $event)); });
    i0.ɵɵelementStart(4, "option", 67);
    i0.ɵɵtext(5, "-- T\u1EF1 \u0111\u1ED9ng (Greedy) --");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(6, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_2_For_7_Template, 2, 4, "option", 2, _forTrack2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const block_r12 = i0.ɵɵnextContext(3).$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngModel", block_r12.forcedSopId || "");
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r1.eligibleManualSopsMap().get(block_r12.id) || i0.ɵɵpureFunction0(1, _c0));
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_0_Template, 2, 0, "p", 120)(1, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_1_Template, 5, 8)(2, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Conditional_2_Template, 8, 2, "div", 121);
} if (rf & 2) {
    const block_r12 = i0.ɵɵnextContext(2).$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵconditional((ctx_r1.sopSuggestionsMap().get(block_r12.id) || i0.ɵɵpureFunction0(2, _c0)).length === 0 && !block_r12.forcedSopId ? 0 : 1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional((ctx_r1.eligibleManualSopsMap().get(block_r12.id) || i0.ɵɵpureFunction0(3, _c0)).length > 0 ? 2 : -1);
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Template(rf, ctx) { if (rf & 1) {
    const _r15 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 73)(1, "div", 77)(2, "div", 78)(3, "div", 79)(4, "label", 80);
    i0.ɵɵtext(5, "Danh s\u00E1ch m\u1EABu");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "button", 81);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r15); const ɵ$index_120_r10 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.openQuickGenerateModal(ɵ$index_120_r10)); });
    i0.ɵɵelement(7, "i", 82);
    i0.ɵɵtext(8, " T\u1EA1o Nhanh ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "textarea", 83);
    i0.ɵɵlistener("ngModelChange", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Template_textarea_ngModelChange_9_listener($event) { i0.ɵɵrestoreView(_r15); const ɵ$index_120_r10 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.updateBlockSamples(ɵ$index_120_r10, $event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(10, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_10_Template, 12, 2, "details", 84);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "div", 85)(12, "label", 86);
    i0.ɵɵtext(13, "Ch\u1EC9 ti\u00EAu ki\u1EC3m nghi\u1EC7m");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "div", 87)(15, "div", 88);
    i0.ɵɵelement(16, "i", 89);
    i0.ɵɵelementStart(17, "input", 90);
    i0.ɵɵlistener("ngModelChange", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Template_input_ngModelChange_17_listener($event) { i0.ɵɵrestoreView(_r15); const ɵ$index_120_r10 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.updateBlockSearch(ɵ$index_120_r10, $event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(18, "button", 91);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Template_button_click_18_listener() { i0.ɵɵrestoreView(_r15); const ɵ$index_120_r10 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.openGroupModal(ɵ$index_120_r10)); });
    i0.ɵɵelement(19, "i", 82);
    i0.ɵɵtext(20, " Groups ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "button", 92);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Template_button_click_21_listener() { i0.ɵɵrestoreView(_r15); const ɵ$index_120_r10 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.selectAllTargets(ɵ$index_120_r10)); });
    i0.ɵɵelement(22, "i", 93);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "button", 94);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Template_button_click_23_listener() { i0.ɵɵrestoreView(_r15); const ɵ$index_120_r10 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.deselectAllTargets(ɵ$index_120_r10)); });
    i0.ɵɵelement(24, "i", 95);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(25, "div", 96);
    i0.ɵɵrepeaterCreate(26, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_For_27_Template, 5, 5, "label", 97, _forTrack1);
    i0.ɵɵtemplate(28, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_28_Template, 2, 0, "div", 98);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(29, "div", 99)(30, "label", 100)(31, "span");
    i0.ɵɵelement(32, "i", 101);
    i0.ɵɵtext(33, " G\u1EE3i \u00FD Quy tr\u00ECnh (SOP)");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(34, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_34_Template, 2, 0, "button", 102);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(35, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_35_Template, 2, 0, "p", 103)(36, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Conditional_36_Template, 3, 4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const block_r12 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(9);
    i0.ɵɵproperty("ngModel", block_r12.rawSamples);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.getBlockSamples(block_r12).length > 0 ? 10 : -1);
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("ngModel", block_r12.targetSearch);
    i0.ɵɵadvance(9);
    i0.ɵɵrepeater(ctx_r1.filteredTargetsMap().get(block_r12.id) || i0.ɵɵpureFunction0(6, _c0));
    i0.ɵɵadvance(2);
    i0.ɵɵconditional((ctx_r1.filteredTargetsMap().get(block_r12.id) || i0.ɵɵpureFunction0(7, _c0)).length === 0 ? 28 : -1);
    i0.ɵɵadvance(6);
    i0.ɵɵconditional(block_r12.forcedSopId ? 34 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(block_r12.selectedTargets.size === 0 ? 35 : 36);
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 55)(1, "div", 58);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Template_div_click_1_listener() { const ɵ$index_120_r10 = i0.ɵɵrestoreView(_r9).$index; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.toggleBlockCollapse(ɵ$index_120_r10)); });
    i0.ɵɵelementStart(2, "div", 4)(3, "div", 59);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_5_Template, 1, 1, "input", 60)(6, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_6_Template, 3, 1, "h3", 61);
    i0.ɵɵelementStart(7, "span", 62);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "div", 63)(10, "div", 64);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Template_div_click_10_listener($event) { i0.ɵɵrestoreView(_r9); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementStart(11, "span", 65);
    i0.ɵɵtext(12, "N\u1EC1n m\u1EABu:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "select", 66);
    i0.ɵɵlistener("ngModelChange", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Template_select_ngModelChange_13_listener($event) { const ɵ$index_120_r10 = i0.ɵɵrestoreView(_r9).$index; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.updateBlockMatrix(ɵ$index_120_r10, $event === "" ? undefined : $event)); });
    i0.ɵɵelementStart(14, "option", 67);
    i0.ɵɵtext(15, "D\u00F9ng chung (ANY)");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(16, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_For_17_Template, 2, 2, "option", 2, _forTrack0);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(18, "button", 68);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Template_button_click_18_listener($event) { const ɵ$index_120_r10 = i0.ɵɵrestoreView(_r9).$index; const ctx_r1 = i0.ɵɵnextContext(4); ctx_r1.duplicateBlock(ɵ$index_120_r10); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelement(19, "i", 69);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "button", 70);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Template_button_click_20_listener($event) { const ɵ$index_120_r10 = i0.ɵɵrestoreView(_r9).$index; const ctx_r1 = i0.ɵɵnextContext(4); ctx_r1.removeBlock(ɵ$index_120_r10); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelement(21, "i", 71);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(22, "i", 72);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(23, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Conditional_23_Template, 37, 8, "div", 73);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const block_r12 = ctx.$implicit;
    const ɵ$index_120_r10 = ctx.$index;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ɵ$index_120_r10 + 1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isEditingName() === block_r12.id ? 5 : 6);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate2(" ", ctx_r1.countSamples(block_r12.rawSamples), " m\u1EABu \u2022 ", block_r12.selectedTargets.size, " ch\u1EC9 ti\u00EAu ");
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngModel", block_r12.matrixType || "");
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r1.availableMatrices());
    i0.ɵɵadvance(6);
    i0.ɵɵclassProp("rotate-180", block_r12.isCollapsed);
    i0.ɵɵadvance();
    i0.ɵɵconditional(!block_r12.isCollapsed ? 23 : -1);
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 44);
    i0.ɵɵrepeaterCreate(1, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_For_2_Template, 24, 8, "div", 55, _forTrack0);
    i0.ɵɵelementStart(3, "button", 56);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r8); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.addBlock()); });
    i0.ɵɵelement(4, "i", 57);
    i0.ɵɵtext(5, " Th\u00EAm Nh\u00F3m M\u1EABu ");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.blocks());
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_For_36_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 2);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const m_r27 = ctx.$implicit;
    i0.ɵɵproperty("value", m_r27.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(m_r27.name);
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_For_54_Template(rf, ctx) { if (rf & 1) {
    const _r28 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "label", 97)(1, "input", 185);
    i0.ɵɵlistener("change", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_For_54_Template_input_change_1_listener() { const t_r29 = i0.ɵɵrestoreView(_r28).$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.toggleSingleTarget(t_r29.uniqueKey)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "div", 117)(3, "div", 186);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const t_r29 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction1(3, _c2, ctx_r1.singleSelectedTargets().has(t_r29.uniqueKey)));
    i0.ɵɵadvance();
    i0.ɵɵproperty("checked", ctx_r1.singleSelectedTargets().has(t_r29.uniqueKey));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(t_r29.name);
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_55_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 98);
    i0.ɵɵtext(1, "Kh\u00F4ng t\u00ECm th\u1EA5y.");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_69_Template(rf, ctx) { if (rf & 1) {
    const _r30 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 119);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_69_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r30); const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.singleForcedSopId.set(undefined)); });
    i0.ɵɵtext(1, "B\u1ECF Ch\u1EC9 \u0110\u1ECBnh");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_70_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 184);
    i0.ɵɵelement(1, "i", 187);
    i0.ɵɵelementStart(2, "h5", 188);
    i0.ɵɵtext(3, "Ch\u01B0a Ch\u1ECDn Ch\u1EC9 Ti\u00EAu Ki\u1EC3m Nghi\u1EC7m");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 189);
    i0.ɵɵtext(5, "H\u00E3y ch\u1ECDn \u00EDt nh\u1EA5t 1 ch\u1EC9 ti\u00EAu ki\u1EC3m nghi\u1EC7m \u1EDF khung b\u00EAn ph\u1EA3i \u0111\u1EC3 h\u1EC7 th\u1ED1ng t\u1EF1 \u0111\u1ED9ng g\u1EE3i \u00FD quy tr\u00ECnh ph\u00F9 h\u1EE3p.");
    i0.ɵɵelementEnd()();
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r31 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 190);
    i0.ɵɵelement(1, "i", 191);
    i0.ɵɵelementStart(2, "h5", 192);
    i0.ɵɵtext(3, "Kh\u00F4ng T\u00ECm Th\u1EA5y Quy Tr\u00ECnh Ph\u00F9 H\u1EE3p");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 193);
    i0.ɵɵtext(5, "Ch\u01B0a c\u00F3 SOP n\u00E0o \u0111\u01B0\u1EE3c c\u1EA5u h\u00ECnh cho c\u00E1c ch\u1EC9 ti\u00EAu \u0111\u00E3 ch\u1ECDn t\u01B0\u01A1ng th\u00EDch v\u1EDBi N\u1EC1n m\u1EABu n\u00E0y.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "button", 194);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_0_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r31); const ctx_r1 = i0.ɵɵnextContext(5); ctx_r1.singleMatrixType.set(undefined); return i0.ɵɵresetView(ctx_r1.singleForcedSopId.set(undefined)); });
    i0.ɵɵtext(7, " Th\u1EED \u0110\u1EB7t L\u1EA1i N\u1EC1n M\u1EABu ");
    i0.ɵɵelementEnd()();
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_1_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 122);
    i0.ɵɵelement(1, "i", 126);
    i0.ɵɵelementStart(2, "p");
    i0.ɵɵtext(3, "Kh\u00F4ng c\u00F3 quy tr\u00ECnh n\u00E0o bao ph\u1EE7 to\u00E0n b\u1ED9 m\u1EE5c ti\u00EAu. Quy tr\u00ECnh d\u01B0\u1EDBi \u0111\u00E2y ch\u1EC9 mang t\u00EDnh tham kh\u1EA3o, h\u1EC7 th\u1ED1ng s\u1EBD t\u1EF1 \u0111\u1ED9ng t\u00E1ch m\u1EBB \u1EDF B\u01B0\u1EDBc 2.");
    i0.ɵɵelementEnd()();
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_1_Conditional_1_For_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 130);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const mt_r32 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(mt_r32.name);
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_1_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 123)(1, "div", 127);
    i0.ɵɵelement(2, "i", 128);
    i0.ɵɵelementStart(3, "p");
    i0.ɵɵtext(4, "Quy tr\u00ECnh \u0111\u01B0\u1EE3c ch\u1EC9 \u0111\u1ECBnh ch\u1EC9 bao ph\u1EE7 ");
    i0.ɵɵelementStart(5, "b");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(7, " ch\u1EC9 ti\u00EAu. ");
    i0.ɵɵelementStart(8, "b");
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(10, " ch\u1EC9 ti\u00EAu c\u00F2n l\u1EA1i d\u01B0\u1EDBi \u0111\u00E2y s\u1EBD \u0111\u01B0\u1EE3c h\u1EC7 th\u1ED1ng t\u1EF1 \u0111\u1ED9ng t\u00E1ch sang m\u1EBB m\u1EDBi \u1EDF B\u01B0\u1EDBc 2:");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "div", 129);
    i0.ɵɵrepeaterCreate(12, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_1_Conditional_1_For_13_Template, 2, 1, "span", 130, _forTrack0);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(6);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate2("", ctx_r1.singleSopSuggestions()[0].coverageCount, "/", ctx_r1.singleSopSuggestions()[0].totalRequired, "");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.singleSopSuggestions()[0].missingTargets.length);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r1.singleSopSuggestions()[0].missingTargets);
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_1_For_4_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 134);
    i0.ɵɵelement(1, "i", 147);
    i0.ɵɵtext(2, " Ch\u1EC9 \u0110\u1ECBnh Th\u1EE7 C\u00F4ng");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_1_For_4_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 135);
    i0.ɵɵelement(1, "i", 148);
    i0.ɵɵtext(2, " T\u1ED1t Nh\u1EA5t");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_1_For_4_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 137);
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_1_For_4_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 139);
    i0.ɵɵelement(1, "div", 149);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const sug_r34 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(6);
    i0.ɵɵadvance();
    i0.ɵɵstyleProp("background-color", ctx_r1.getMatrixColor(sug_r34.sop.matrixTags[0]));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.getMatrixLabel(sug_r34.sop.matrixTags[0]), " ");
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_1_For_4_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 139);
    i0.ɵɵelement(1, "div", 150);
    i0.ɵɵtext(2, " D\u00F9ng Chung ");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_1_For_4_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 142);
    i0.ɵɵelement(1, "i", 151);
    i0.ɵɵtext(2, " Kho");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_1_For_4_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 143);
    i0.ɵɵelement(1, "i", 152);
    i0.ɵɵtext(2, " Kho");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_1_For_4_Template(rf, ctx) { if (rf & 1) {
    const _r33 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 131)(1, "button", 132);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_1_For_4_Template_button_click_1_listener() { const sug_r34 = i0.ɵɵrestoreView(_r33).$implicit; const ctx_r1 = i0.ɵɵnextContext(6); return i0.ɵɵresetView(ctx_r1.singleForcedSopId.set(sug_r34.sop.id)); });
    i0.ɵɵelementStart(2, "div", 133);
    i0.ɵɵtemplate(3, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_1_For_4_Conditional_3_Template, 3, 0, "span", 134)(4, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_1_For_4_Conditional_4_Template, 3, 0, "span", 135);
    i0.ɵɵelementStart(5, "span", 136);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(7, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_1_For_4_Conditional_7_Template, 1, 0, "i", 137);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 138);
    i0.ɵɵtemplate(9, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_1_For_4_Conditional_9_Template, 3, 3, "span", 139)(10, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_1_For_4_Conditional_10_Template, 3, 0, "span", 139);
    i0.ɵɵelementStart(11, "span", 140);
    i0.ɵɵelement(12, "i", 141);
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(14, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_1_For_4_Conditional_14_Template, 3, 0, "span", 142)(15, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_1_For_4_Conditional_15_Template, 3, 0, "span", 143);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "div", 144);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_1_For_4_Template_div_click_16_listener($event) { const sug_r34 = i0.ɵɵrestoreView(_r33).$implicit; const ctx_r1 = i0.ɵɵnextContext(6); ctx_r1.openSopPreview(-1, sug_r34); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementStart(17, "button", 145);
    i0.ɵɵelement(18, "i", 146);
    i0.ɵɵtext(19, " Xem Chi Ti\u1EBFt ");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const sug_r34 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(6);
    i0.ɵɵclassProp("ring-2", ctx_r1.singleForcedSopId() === sug_r34.sop.id)("ring-indigo-500", ctx_r1.singleForcedSopId() === sug_r34.sop.id);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", sug_r34.isPartial && !sug_r34.sop.isManualOnly);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(sug_r34.sop.isManualOnly ? 3 : sug_r34.isBest && !sug_r34.isPartial ? 4 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(sug_r34.sop.name);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.singleForcedSopId() === sug_r34.sop.id ? 7 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(sug_r34.sop.matrixTags && sug_r34.sop.matrixTags.length > 0 ? 9 : 10);
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("text-red-500", sug_r34.isPartial);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2(" ", sug_r34.coverageCount, "/", sug_r34.totalRequired, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(sug_r34.isMissingStock ? 14 : 15);
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_1_Conditional_0_Template, 4, 0, "div", 122)(1, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_1_Conditional_1_Template, 14, 3, "div", 123);
    i0.ɵɵelementStart(2, "div", 124);
    i0.ɵɵrepeaterCreate(3, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_1_For_4_Template, 20, 14, "div", 125, _forTrack2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(5);
    i0.ɵɵconditional(ctx_r1.singleSopSuggestions().length > 0 && ctx_r1.singleSopSuggestions()[0].isPartial && !ctx_r1.singleForcedSopId() ? 0 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.singleForcedSopId() && ctx_r1.singleSopSuggestions().length > 0 && ctx_r1.singleSopSuggestions()[0].isPartial && ctx_r1.singleSopSuggestions()[0].sop.id === ctx_r1.singleForcedSopId() ? 1 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r1.singleSopSuggestions());
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_2_For_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 2);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const sug_r36 = ctx.$implicit;
    i0.ɵɵproperty("value", sug_r36.sop.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate3("", sug_r36.sop.name, " (", sug_r36.coverageCount, "/", sug_r36.totalRequired, " ch\u1EC9 ti\u00EAu)");
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r35 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 121)(1, "span", 153);
    i0.ɵɵtext(2, "CH\u1EC8 \u0110\u1ECANH TH\u1EE6 C\u00D4NG:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "select", 154);
    i0.ɵɵlistener("ngModelChange", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_2_Template_select_ngModelChange_3_listener($event) { i0.ɵɵrestoreView(_r35); const ctx_r1 = i0.ɵɵnextContext(5); return i0.ɵɵresetView(ctx_r1.singleForcedSopId.set($event === "" ? undefined : $event)); });
    i0.ɵɵelementStart(4, "option", 67);
    i0.ɵɵtext(5, "-- T\u1EF1 \u0111\u1ED9ng (Greedy) --");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(6, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_2_For_7_Template, 2, 4, "option", 2, _forTrack2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(5);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngModel", ctx_r1.singleForcedSopId() || "");
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r1.singleEligibleManualSops());
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_0_Template, 8, 0, "div", 190)(1, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_1_Template, 5, 2)(2, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Conditional_2_Template, 8, 1, "div", 121);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵconditional(ctx_r1.singleSopSuggestions().length === 0 && !ctx_r1.singleForcedSopId() ? 0 : 1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.singleEligibleManualSops().length > 0 ? 2 : -1);
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r26 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 45)(1, "div", 155)(2, "div", 156);
    i0.ɵɵelement(3, "i", 157);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div")(5, "h3", 158);
    i0.ɵɵtext(6, "Ph\u00E2n Chia M\u1EBB cho 1 M\u1EABu Duy Nh\u1EA5t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "p", 8);
    i0.ɵɵtext(8, "H\u1EC7 th\u1ED1ng s\u1EBD t\u1EF1 \u0111\u1ED9ng ph\u00E2n t\u00E1ch c\u00E1c ch\u1EC9 ti\u00EAu \u0111\u01B0\u1EE3c ch\u1ECDn v\u00E0o c\u00E1c m\u1EBB ch\u1EA1y/SOP t\u01B0\u01A1ng \u1EE9ng.");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(9, "div", 159)(10, "div", 160)(11, "div")(12, "label", 161);
    i0.ɵɵtext(13, "M\u00E3 m\u1EABu duy nh\u1EA5t *");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "input", 162);
    i0.ɵɵlistener("ngModelChange", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Template_input_ngModelChange_14_listener($event) { i0.ɵɵrestoreView(_r26); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.singleSampleCode.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "div")(16, "label", 163);
    i0.ɵɵtext(17, "M\u00F4 t\u1EA3 m\u1EABu \u2014 t\u00F9y ch\u1ECDn");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "div", 111);
    i0.ɵɵelement(19, "i", 164);
    i0.ɵɵelementStart(20, "input", 165);
    i0.ɵɵlistener("ngModelChange", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Template_input_ngModelChange_20_listener($event) { i0.ɵɵrestoreView(_r26); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.updateSingleSampleDescription($event)); });
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(21, "div")(22, "label", 166);
    i0.ɵɵtext(23, " N\u1EC1n m\u1EABu (Matrix Type) ");
    i0.ɵɵelementStart(24, "div", 167);
    i0.ɵɵelement(25, "i", 168);
    i0.ɵɵelementStart(26, "div", 169)(27, "div", 170);
    i0.ɵɵelement(28, "i", 171);
    i0.ɵɵtext(29, " L\u1ECDc theo N\u1EC1n m\u1EABu ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "div", 172);
    i0.ɵɵtext(31, " Ch\u1EC9 hi\u1EC3n th\u1ECB c\u00E1c quy tr\u00ECnh (SOP) t\u01B0\u01A1ng th\u00EDch v\u1EDBi ch\u1EA5t n\u1EC1n ph\u00E2n t\u00EDch c\u1EE5 th\u1EC3 n\u00E0y (V\u00ED d\u1EE5: N\u01B0\u1EDBc th\u1EA3i, \u0110\u1EA5t, B\u00F9n th\u1EA3i). \u0110\u1EC3 tr\u1ED1ng \u0111\u1EC3 hi\u1EC3n th\u1ECB t\u1EA5t c\u1EA3 c\u00E1c SOP. ");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(32, "select", 173);
    i0.ɵɵlistener("ngModelChange", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Template_select_ngModelChange_32_listener($event) { i0.ɵɵrestoreView(_r26); const ctx_r1 = i0.ɵɵnextContext(3); ctx_r1.singleMatrixType.set($event === "" ? undefined : $event); return i0.ɵɵresetView(ctx_r1.singleForcedSopId.set(undefined)); });
    i0.ɵɵelementStart(33, "option", 67);
    i0.ɵɵtext(34, "D\u00F9ng chung (ANY)");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(35, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_For_36_Template, 2, 2, "option", 2, _forTrack0);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(37, "div", 174)(38, "div", 175)(39, "label", 176);
    i0.ɵɵtext(40);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(41, "button", 177);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Template_button_click_41_listener() { i0.ɵɵrestoreView(_r26); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.openSingleTargetGroupModal()); });
    i0.ɵɵelement(42, "i", 82);
    i0.ɵɵtext(43, " Groups ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(44, "div", 87)(45, "div", 88);
    i0.ɵɵelement(46, "i", 89);
    i0.ɵɵelementStart(47, "input", 178);
    i0.ɵɵlistener("ngModelChange", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Template_input_ngModelChange_47_listener($event) { i0.ɵɵrestoreView(_r26); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.singleTargetSearch.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(48, "button", 92);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Template_button_click_48_listener() { i0.ɵɵrestoreView(_r26); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.selectAllSingleTargets()); });
    i0.ɵɵelement(49, "i", 93);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(50, "button", 179);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Template_button_click_50_listener() { i0.ɵɵrestoreView(_r26); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.deselectAllSingleTargets()); });
    i0.ɵɵelement(51, "i", 95);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(52, "div", 96);
    i0.ɵɵrepeaterCreate(53, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_For_54_Template, 5, 5, "label", 97, _forTrack1);
    i0.ɵɵtemplate(55, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_55_Template, 2, 0, "div", 98);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(56, "div", 180)(57, "label", 181)(58, "span", 182);
    i0.ɵɵelement(59, "i", 101);
    i0.ɵɵtext(60, " Quy tr\u00ECnh (SOP) g\u1EE3i \u00FD ");
    i0.ɵɵelementStart(61, "div", 167);
    i0.ɵɵelement(62, "i", 168);
    i0.ɵɵelementStart(63, "div", 169)(64, "div", 170);
    i0.ɵɵelement(65, "i", 183);
    i0.ɵɵtext(66, " Ch\u1EC9 \u0111\u1ECBnh Quy tr\u00ECnh ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(67, "div", 172);
    i0.ɵɵtext(68, " Nh\u1EA5p ch\u1ECDn 1 quy tr\u00ECnh c\u1EE5 th\u1EC3 \u0111\u1EC3 ch\u1EC9 \u0111\u1ECBnh ch\u1EA1y c\u1ED1 \u0111\u1ECBnh quy tr\u00ECnh n\u00E0y. Thu\u1EADt to\u00E1n ph\u00E2n t\u00EDch s\u1EBD \u01B0u ti\u00EAn s\u1EED d\u1EE5ng SOP \u0111\u00E3 ch\u1ECDn \u1EDF B\u01B0\u1EDBc 2. \u0110\u1EC3 tr\u1ED1ng \u0111\u1EC3 h\u1EC7 th\u1ED1ng t\u1EF1 \u0111\u1ED9ng t\u00EDnh to\u00E1n ph\u01B0\u01A1ng \u00E1n t\u1ED1i \u01B0u. ");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵtemplate(69, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_69_Template, 2, 0, "button", 102);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(70, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_70_Template, 6, 0, "div", 184)(71, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Conditional_71_Template, 3, 2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(14);
    i0.ɵɵproperty("ngModel", ctx_r1.singleSampleCode());
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngModel", ctx_r1.singleSampleDescriptionName());
    i0.ɵɵadvance(12);
    i0.ɵɵproperty("ngModel", ctx_r1.singleMatrixType() || "");
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r1.availableMatrices());
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1("Ch\u1EC9 ti\u00EAu ki\u1EC3m nghi\u1EC7m (", ctx_r1.singleSelectedTargets().size, " \u0111\u00E3 ch\u1ECDn)");
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("ngModel", ctx_r1.singleTargetSearch());
    i0.ɵɵadvance(6);
    i0.ɵɵrepeater(ctx_r1.singleFilteredTargets());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.singleFilteredTargets().length === 0 ? 55 : -1);
    i0.ɵɵadvance(14);
    i0.ɵɵconditional(ctx_r1.singleForcedSopId() ? 69 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.singleSelectedTargets().size === 0 ? 70 : 71);
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 195);
    i0.ɵɵtext(1, " Th\u00F4ng tin m\u1EABu ");
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 196);
    i0.ɵɵtext(1, " C\u1EA5u h\u00ECnh ph\u00E2n t\u00EDch ");
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 197);
    i0.ɵɵtext(1, " X\u1EED l\u00FD... ");
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1, "Ph\u00E2n T\u00EDch v\u00E0 L\u1EADp K\u1EBF Ho\u1EA1ch");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(2, "i", 198);
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_22_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 205);
    i0.ɵɵelement(1, "div", 149);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵstyleProp("background-color", ctx_r1.getMatrixColor(ctx_r1.previewSop().suggestion.sop.matrixTags[0]));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.getMatrixLabel(ctx_r1.previewSop().suggestion.sop.matrixTags[0]), " ");
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_22_Conditional_15_For_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 217);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const t_r38 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", t_r38.name, " ");
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_22_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div")(1, "h4", 214);
    i0.ɵɵelement(2, "i", 215);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 216);
    i0.ɵɵrepeaterCreate(5, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_22_Conditional_15_For_6_Template, 2, 1, "div", 217, _forTrack0);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" S\u1EBD x\u1EED l\u00FD (", ctx_r1.previewSop().suggestion.coveredTargets.length, ") ");
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r1.previewSop().suggestion.coveredTargets);
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_22_Conditional_16_For_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 222);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const t_r39 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", t_r39.name, " ");
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_22_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div")(1, "h4", 218);
    i0.ɵɵelement(2, "i", 219);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 220);
    i0.ɵɵtext(5, "H\u1EC7 th\u1ED1ng s\u1EBD t\u1EF1 \u0111\u1ED9ng t\u00ECm SOP kh\u00E1c \u0111\u1EC3 x\u1EED l\u00FD c\u00E1c ch\u1EC9 ti\u00EAu n\u00E0y.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 221);
    i0.ɵɵrepeaterCreate(7, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_22_Conditional_16_For_8_Template, 2, 1, "div", 222, _forTrack0);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" S\u1EBD b\u1ECB thi\u1EBFu (", ctx_r1.previewSop().suggestion.missingTargets.length, ") ");
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx_r1.previewSop().suggestion.missingTargets);
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_22_Conditional_17_For_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 227);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const t_r40 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", t_r40.name, " ");
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_22_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div")(1, "h4", 223);
    i0.ɵɵelement(2, "i", 224);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 225);
    i0.ɵɵtext(5, "SOP c\u00F3 nh\u01B0ng Nh\u00F3m m\u1EABu kh\u00F4ng y\u00EAu c\u1EA7u.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 226);
    i0.ɵɵrepeaterCreate(7, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_22_Conditional_17_For_8_Template, 2, 1, "div", 227, _forTrack0);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" C\u00F3 d\u01B0 (", ctx_r1.previewSop().suggestion.extraTargets.length, ") ");
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx_r1.previewSop().suggestion.extraTargets);
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_22_Conditional_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 213);
    i0.ɵɵtext(1, "T\u00EDnh n\u0103ng ch\u1EC9 \u0111\u1ECBnh nhi\u1EC1u quy tr\u00ECnh (Multi-Force) s\u1EBD ra m\u1EAFt trong t\u01B0\u01A1ng lai.");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_22_Template(rf, ctx) { if (rf & 1) {
    const _r37 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 54)(1, "div", 199);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_22_Template_div_click_1_listener() { i0.ɵɵrestoreView(_r37); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.closeSopPreview()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "div", 200)(3, "div", 201)(4, "div")(5, "h3", 202);
    i0.ɵɵelement(6, "i", 203);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 204);
    i0.ɵɵtemplate(9, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_22_Conditional_9_Template, 3, 3, "span", 205);
    i0.ɵɵelementStart(10, "span", 206);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(12, "button", 207);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_22_Template_button_click_12_listener() { i0.ɵɵrestoreView(_r37); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.closeSopPreview()); });
    i0.ɵɵelement(13, "i", 208);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "div", 209);
    i0.ɵɵtemplate(15, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_22_Conditional_15_Template, 7, 1, "div")(16, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_22_Conditional_16_Template, 9, 1, "div")(17, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_22_Conditional_17_Template, 9, 1, "div");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "div", 210)(19, "button", 211);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_1_Conditional_22_Template_button_click_19_listener() { i0.ɵɵrestoreView(_r37); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.assignSopFromPreview()); });
    i0.ɵɵelement(20, "i", 212);
    i0.ɵɵtext(21, " Ch\u1EC9 \u0110\u1ECBnh SOP N\u00E0y ");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(22, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_22_Conditional_22_Template, 2, 0, "p", 213);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.previewSop().suggestion.sop.name, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional((((tmp_4_0 = ctx_r1.previewSop().suggestion.sop.matrixTags) == null ? null : tmp_4_0.length) || 0) > 0 ? 9 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", ((tmp_5_0 = ctx_r1.previewSop().suggestion.sop.targets) == null ? null : tmp_5_0.length) || 0, " ch\u1EC9 ti\u00EAu");
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.previewSop().suggestion.coveredTargets.length > 0 ? 15 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.previewSop().suggestion.missingTargets.length > 0 ? 16 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.previewSop().suggestion.extraTargets.length > 0 ? 17 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r1.previewSop().suggestion.isPartial);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r1.previewSop().suggestion.isPartial ? 22 : -1);
} }
function SmartBatchComponent_Conditional_20_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 43);
    i0.ɵɵtemplate(1, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_1_Template, 6, 0, "div", 44)(2, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_2_Template, 72, 8, "div", 45);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 46)(4, "h4", 47);
    i0.ɵɵtemplate(5, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_5_Template, 2, 0)(6, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_6_Template, 2, 0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div", 48)(8, "div", 49)(9, "span", 50);
    i0.ɵɵtext(10, "T\u1ED5ng m\u1EABu (Unique)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "span", 51);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "div", 49)(14, "span", 50);
    i0.ɵɵtext(15, "T\u1ED5ng ch\u1EC9 ti\u00EAu");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "span", 51);
    i0.ɵɵtext(17);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(18, "div", 52)(19, "button", 53);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_1_Template_button_click_19_listener() { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.analyzePlan()); });
    i0.ɵɵtemplate(20, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_20_Template, 2, 0)(21, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_21_Template, 3, 0);
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(22, SmartBatchComponent_Conditional_20_Conditional_1_Conditional_22_Template, 23, 8, "div", 54);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.smartBatchMode() === "multiple" ? 1 : 2);
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.smartBatchMode() === "single" ? 5 : 6);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r1.totalUniqueSamples());
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r1.totalUniqueTargets());
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r1.smartBatchMode() === "single" ? "w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group" : "w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group");
    i0.ɵɵproperty("disabled", ctx_r1.totalUniqueSamples() === 0 || ctx_r1.totalUniqueTargets() === 0 || ctx_r1.isProcessing());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isProcessing() ? 20 : 21);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.previewSop() ? 22 : -1);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_Conditional_5_For_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const issue_r42 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(issue_r42.message);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_Conditional_5_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 241);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("V\u00E0 ", ctx_r1.planValidationIssues().length - 5, " l\u1ED7i kh\u00E1c.");
} }
function SmartBatchComponent_Conditional_20_Conditional_2_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 233);
    i0.ɵɵelement(1, "i", 238);
    i0.ɵɵelementStart(2, "div")(3, "h4", 239);
    i0.ɵɵtext(4, "K\u1EBF ho\u1EA1ch c\u00F3 d\u1EEF li\u1EC7u ti\u00EAu hao kh\u00F4ng h\u1EE3p l\u1EC7");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "ul", 240);
    i0.ɵɵrepeaterCreate(6, SmartBatchComponent_Conditional_20_Conditional_2_Conditional_5_For_7_Template, 2, 1, "li", null, _forTrack3);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(8, SmartBatchComponent_Conditional_20_Conditional_2_Conditional_5_Conditional_8_Template, 2, 1, "p", 241);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(6);
    i0.ɵɵrepeater(ctx_r1.planValidationIssues().slice(0, 5));
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.planValidationIssues().length > 5 ? 8 : -1);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_Conditional_6_For_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 246);
    i0.ɵɵtext(1);
    i0.ɵɵelement(2, "i", 247);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const task_r43 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", task_r43.sample, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", task_r43.targetName, " ");
} }
function SmartBatchComponent_Conditional_20_Conditional_2_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 234);
    i0.ɵɵelement(1, "i", 242);
    i0.ɵɵelementStart(2, "div")(3, "h4", 243);
    i0.ɵɵtext(4, "C\u1EA3nh B\u00E1o: Kh\u00F4ng T\u00ECm Th\u1EA5y Quy Tr\u00ECnh (SOP)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 244);
    i0.ɵɵtext(6, "C\u00E1c y\u00EAu c\u1EA7u sau kh\u00F4ng th\u1EC3 th\u1EF1c hi\u1EC7n do kh\u00F4ng c\u00F3 SOP ph\u00F9 h\u1EE3p trong h\u1EC7 th\u1ED1ng:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div", 245);
    i0.ɵɵrepeaterCreate(8, SmartBatchComponent_Conditional_20_Conditional_2_Conditional_6_For_9_Template, 4, 2, "span", 246, _forTrack4);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(8);
    i0.ɵɵrepeater(ctx_r1.unmappedTasks());
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_6_For_1_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 283);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const tag_r46 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(tag_r46);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_6_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_6_For_1_Conditional_0_Template, 2, 1, "span", 283);
} if (rf & 2) {
    const tag_r46 = ctx.$implicit;
    i0.ɵɵconditional(tag_r46 !== "T\u1EF1 \u0111\u1ED9ng-Optimized" ? 0 : -1);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_6_For_1_Template, 1, 1, null, null, i0.ɵɵrepeaterTrackByIdentity);
} if (rf & 2) {
    const batch_r47 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵrepeater(batch_r47.tags);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 253);
    i0.ɵɵelement(1, "i", 151);
    i0.ɵɵtext(2, " Thi\u1EBFu h\u00E0ng ");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 254);
    i0.ɵɵelement(1, "i", 284);
    i0.ɵɵtext(2, " M\u1EDBi t\u00E1ch ");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 268)(1, "span", 285);
    i0.ɵɵelement(2, "i", 286);
    i0.ɵɵtext(3, "M\u00F4 t\u1EA3:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const batch_r47 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("", ctx_r1.getBatchDescriptionText(batch_r47), " ");
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_For_30_Template(rf, ctx) { if (rf & 1) {
    const _r48 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "span", 270);
    i0.ɵɵtext(1);
    i0.ɵɵelementStart(2, "i", 287);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_2_For_8_For_30_Template_i_click_2_listener($event) { const t_r49 = i0.ɵɵrestoreView(_r48).$implicit; const ɵ$index_869_r45 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(3); ctx_r1.removeTargetFromBatch(ɵ$index_869_r45, t_r49.id); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const t_r49 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", t_r49._displayName || t_r49.name, " ");
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_For_39_Conditional_0_Case_3_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 2);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const opt_r52 = ctx.$implicit;
    i0.ɵɵproperty("value", opt_r52.value);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(opt_r52.label);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_For_39_Conditional_0_Case_3_Template(rf, ctx) { if (rf & 1) {
    const _r50 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "select", 291);
    i0.ɵɵlistener("ngModelChange", function SmartBatchComponent_Conditional_20_Conditional_2_For_8_For_39_Conditional_0_Case_3_Template_select_ngModelChange_0_listener($event) { i0.ɵɵrestoreView(_r50); const inp_r51 = i0.ɵɵnextContext(2).$implicit; const ɵ$index_869_r45 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.updateBatchInput(ɵ$index_869_r45, inp_r51.var, $event)); });
    i0.ɵɵrepeaterCreate(1, SmartBatchComponent_Conditional_20_Conditional_2_For_8_For_39_Conditional_0_Case_3_For_2_Template, 2, 2, "option", 2, _forTrack6);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const inp_r51 = i0.ɵɵnextContext(2).$implicit;
    const batch_r47 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("ngModel", batch_r47.inputValues[inp_r51.var]);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(inp_r51.options);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_For_39_Conditional_0_Case_4_Template(rf, ctx) { if (rf & 1) {
    const _r53 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 290)(1, "label", 292)(2, "input", 293);
    i0.ɵɵlistener("ngModelChange", function SmartBatchComponent_Conditional_20_Conditional_2_For_8_For_39_Conditional_0_Case_4_Template_input_ngModelChange_2_listener($event) { i0.ɵɵrestoreView(_r53); const inp_r51 = i0.ɵɵnextContext(2).$implicit; const ɵ$index_869_r45 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.updateBatchInput(ɵ$index_869_r45, inp_r51.var, $event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 294);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const inp_r51 = i0.ɵɵnextContext(2).$implicit;
    const batch_r47 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngModel", batch_r47.inputValues[inp_r51.var]);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(batch_r47.inputValues[inp_r51.var] ? "B\u1EADt" : "T\u1EAFt");
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_For_39_Conditional_0_Case_5_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 296);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const inp_r51 = i0.ɵɵnextContext(3).$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(inp_r51.unitLabel);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_For_39_Conditional_0_Case_5_Template(rf, ctx) { if (rf & 1) {
    const _r54 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 111)(1, "input", 295);
    i0.ɵɵlistener("ngModelChange", function SmartBatchComponent_Conditional_20_Conditional_2_For_8_For_39_Conditional_0_Case_5_Template_input_ngModelChange_1_listener($event) { i0.ɵɵrestoreView(_r54); const inp_r51 = i0.ɵɵnextContext(2).$implicit; const ɵ$index_869_r45 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.updateBatchInput(ɵ$index_869_r45, inp_r51.var, $event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(2, SmartBatchComponent_Conditional_20_Conditional_2_For_8_For_39_Conditional_0_Case_5_Conditional_2_Template, 2, 1, "span", 296);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const inp_r51 = i0.ɵɵnextContext(2).$implicit;
    const batch_r47 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngModel", batch_r47.inputValues[inp_r51.var])("step", inp_r51.step || 1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(inp_r51.unitLabel ? 2 : -1);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_For_39_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 272)(1, "label", 288);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(3, SmartBatchComponent_Conditional_20_Conditional_2_For_8_For_39_Conditional_0_Case_3_Template, 3, 1, "select", 289)(4, SmartBatchComponent_Conditional_20_Conditional_2_For_8_For_39_Conditional_0_Case_4_Template, 5, 2, "div", 290)(5, SmartBatchComponent_Conditional_20_Conditional_2_For_8_For_39_Conditional_0_Case_5_Template, 3, 3, "div", 111);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    let tmp_26_0;
    const inp_r51 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("title", inp_r51.label);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(inp_r51.label);
    i0.ɵɵadvance();
    i0.ɵɵconditional((tmp_26_0 = inp_r51.type) === "select" ? 3 : tmp_26_0 === "checkbox" ? 4 : 5);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_For_39_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, SmartBatchComponent_Conditional_20_Conditional_2_For_8_For_39_Conditional_0_Template, 6, 3, "div", 272);
} if (rf & 2) {
    const inp_r51 = ctx.$implicit;
    i0.ɵɵconditional(inp_r51.var !== "n_sample" && inp_r51.var !== "safetyMargin" && inp_r51.var !== "analysisDate" ? 0 : -1);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_43_Template(rf, ctx) { if (rf & 1) {
    const _r55 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 297);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_43_Template_div_click_0_listener() { i0.ɵɵrestoreView(_r55); const ɵ$index_869_r45 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.setBatchMarginManual(ɵ$index_869_r45)); });
    i0.ɵɵelement(1, "i", 82);
    i0.ɵɵtext(2, " T\u1EF1 \u0111\u1ED9ng ");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_44_Template(rf, ctx) { if (rf & 1) {
    const _r56 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "input", 298);
    i0.ɵɵlistener("ngModelChange", function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_44_Template_input_ngModelChange_0_listener($event) { i0.ɵɵrestoreView(_r56); const ɵ$index_869_r45 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.updateBatchMargin(ɵ$index_869_r45, $event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const batch_r47 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("ngModel", batch_r47.safetyMargin);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_51_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 2);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const name_r57 = ctx.$implicit;
    i0.ɵɵproperty("value", name_r57);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(name_r57);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_51_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_51_For_1_Template, 2, 2, "option", 2, i0.ɵɵrepeaterTrackByIdentity);
} if (rf & 2) {
    const batch_r47 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵrepeater(batch_r47.sop.allowedDevices);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_52_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 2);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const d_r58 = ctx.$implicit;
    i0.ɵɵproperty("value", d_r58.name);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(d_r58.name);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_52_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_52_For_1_Template, 2, 2, "option", 2, _forTrack0);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵrepeater(ctx_r1.availableDevices());
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_For_11_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 310);
    i0.ɵɵtext(1, "(Mix)");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_For_11_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    const _r59 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 315);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_For_11_Conditional_10_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r59); const item_r60 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(5); return i0.ɵɵresetView(ctx_r1.openQuickImport(item_r60)); });
    i0.ɵɵelement(1, "i", 316);
    i0.ɵɵtext(2, " B\u00F9 Kho ");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_For_11_Conditional_11_For_1_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    const _r61 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 324);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_For_11_Conditional_11_For_1_Conditional_9_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r61); const sub_r62 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(7); return i0.ɵɵresetView(ctx_r1.openQuickImport(sub_r62)); });
    i0.ɵɵelement(1, "i", 316);
    i0.ɵɵtext(2, " B\u00F9 Kho ");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_For_11_Conditional_11_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 317)(1, "td", 318)(2, "div", 319);
    i0.ɵɵelement(3, "div", 320);
    i0.ɵɵelementStart(4, "span");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(6, "td", 321);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "td", 322);
    i0.ɵɵtemplate(9, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_For_11_Conditional_11_For_1_Conditional_9_Template, 3, 0, "button", 323);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const sub_r62 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(7);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction1(5, _c4, sub_r62.isMissing));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(sub_r62.displayName || sub_r62.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2(" ", ctx_r1.formatNum(sub_r62.totalNeed), " ", sub_r62.stockUnit, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(sub_r62.isMissing ? 9 : -1);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_For_11_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_For_11_Conditional_11_For_1_Template, 10, 7, "tr", 317, _forTrack7);
} if (rf & 2) {
    const item_r60 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵrepeater(item_r60.breakdown);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_For_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 307)(1, "td", 308)(2, "div", 309);
    i0.ɵɵtext(3);
    i0.ɵɵtemplate(4, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_For_11_Conditional_4_Template, 2, 0, "span", 310);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "td", 311);
    i0.ɵɵtext(6);
    i0.ɵɵelementStart(7, "span", 312);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "td", 313);
    i0.ɵɵtemplate(10, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_For_11_Conditional_10_Template, 3, 0, "button", 314);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(11, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_For_11_Conditional_11_Template, 2, 0);
} if (rf & 2) {
    const item_r60 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(5);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction1(7, _c3, item_r60.isMissing));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", item_r60.displayName || item_r60.name, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r60.isComposite ? 4 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.formatNum(item_r60.stockNeed), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r60.stockUnit);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(item_r60.isMissing && !item_r60.isComposite ? 10 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r60.isComposite ? 11 : -1);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_For_14_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 310);
    i0.ɵɵtext(1, "(Mix)");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_For_14_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    const _r63 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 328)(1, "button", 330);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_For_14_Conditional_9_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r63); const item_r64 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(5); return i0.ɵɵresetView(ctx_r1.openQuickImport(item_r64)); });
    i0.ɵɵelement(2, "i", 316);
    i0.ɵɵtext(3, " B\u00F9 Kho ");
    i0.ɵɵelementEnd()();
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_For_14_Conditional_10_For_2_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    const _r65 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 334)(1, "button", 335);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_For_14_Conditional_10_For_2_Conditional_6_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r65); const sub_r66 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(7); return i0.ɵɵresetView(ctx_r1.openQuickImport(sub_r66)); });
    i0.ɵɵelement(2, "i", 316);
    i0.ɵɵtext(3, " B\u00F9 Kho ");
    i0.ɵɵelementEnd()();
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_For_14_Conditional_10_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div")(1, "div", 331)(2, "div", 332);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 333);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(6, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_For_14_Conditional_10_For_2_Conditional_6_Template, 4, 0, "div", 334);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const sub_r66 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(7);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction1(5, _c5, sub_r66.isMissing));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", sub_r66.displayName || sub_r66.name, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2(" ", ctx_r1.formatNum(sub_r66.totalNeed), " ", sub_r66.stockUnit, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(sub_r66.isMissing ? 6 : -1);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_For_14_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 329);
    i0.ɵɵrepeaterCreate(1, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_For_14_Conditional_10_For_2_Template, 7, 7, "div", null, _forTrack7);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r64 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵrepeater(item_r64.breakdown);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_For_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 306)(1, "div", 325)(2, "div", 326);
    i0.ɵɵtext(3);
    i0.ɵɵtemplate(4, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_For_14_Conditional_4_Template, 2, 0, "span", 310);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 327);
    i0.ɵɵtext(6);
    i0.ɵɵelementStart(7, "span", 312);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(9, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_For_14_Conditional_9_Template, 4, 0, "div", 328)(10, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_For_14_Conditional_10_Template, 3, 0, "div", 329);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r64 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(5);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction1(7, _c3, item_r64.isMissing));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", item_r64.displayName || item_r64.name, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r64.isComposite ? 4 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.formatNum(item_r64.stockNeed), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r64.stockUnit);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r64.isMissing && !item_r64.isComposite ? 9 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r64.isComposite ? 10 : -1);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 281)(1, "table", 299)(2, "thead", 300)(3, "tr")(4, "th", 301);
    i0.ɵɵtext(5, "H\u00F3a ch\u1EA5t v\u00E0 v\u1EADt t\u01B0");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "th", 302);
    i0.ɵɵtext(7, "L\u01B0\u1EE3ng c\u1EA7n");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(8, "th", 303);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "tbody", 304);
    i0.ɵɵrepeaterCreate(10, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_For_11_Template, 12, 9, null, null, _forTrack7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "div", 305);
    i0.ɵɵrepeaterCreate(13, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_For_14_Template, 11, 9, "div", 306, _forTrack7);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const batch_r47 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(10);
    i0.ɵɵrepeater(batch_r47.resourceImpact);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(batch_r47.resourceImpact);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_54_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 337);
    i0.ɵɵelement(1, "i", 219);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const batch_r47 = i0.ɵɵnextContext(2).$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" Thi\u1EBFu ", ctx_r1.getMissingCount(batch_r47), " h\u00F3a ch\u1EA5t ");
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_54_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 338);
    i0.ɵɵelement(1, "i", 215);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const batch_r47 = i0.ɵɵnextContext(2).$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2(" \u0110\u1EE7 ", ctx_r1.countTotalItems(batch_r47), "/", ctx_r1.countTotalItems(batch_r47), " h\u00F3a ch\u1EA5t ");
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_54_Template(rf, ctx) { if (rf & 1) {
    const _r67 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 336);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_54_Template_div_click_0_listener() { i0.ɵɵrestoreView(_r67); const ɵ$index_869_r45 = i0.ɵɵnextContext().$index; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.toggleBatchDetails(ɵ$index_869_r45)); });
    i0.ɵɵtemplate(1, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_54_Conditional_1_Template, 3, 1, "div", 337)(2, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_54_Conditional_2_Template, 3, 2, "div", 338);
    i0.ɵɵelementStart(3, "div", 339);
    i0.ɵɵtext(4, " Xem chi ti\u1EBFt ");
    i0.ɵɵelement(5, "i", 340);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const batch_r47 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.getMissingCount(batch_r47) > 0 ? 1 : 2);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Template(rf, ctx) { if (rf & 1) {
    const _r44 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 248)(1, "div", 249);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Template_div_click_1_listener() { const ɵ$index_869_r45 = i0.ɵɵrestoreView(_r44).$index; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.toggleBatchDetails(ɵ$index_869_r45)); });
    i0.ɵɵelementStart(2, "div", 250)(3, "div", 251)(4, "span", 252);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(6, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_6_Template, 2, 0)(7, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_7_Template, 3, 0, "span", 253)(8, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_8_Template, 3, 0, "span", 254);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 255)(10, "button", 256);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Template_button_click_10_listener($event) { const ɵ$index_869_r45 = i0.ɵɵrestoreView(_r44).$index; const ctx_r1 = i0.ɵɵnextContext(3); ctx_r1.openSplitModal(ɵ$index_869_r45); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelement(11, "i", 257);
    i0.ɵɵelementStart(12, "span", 258);
    i0.ɵɵtext(13, "T\u00E1ch");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "button", 259);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Template_button_click_14_listener($event) { const ɵ$index_869_r45 = i0.ɵɵrestoreView(_r44).$index; const ctx_r1 = i0.ɵɵnextContext(3); ctx_r1.toggleBatchDetails(ɵ$index_869_r45); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelement(15, "i", 260);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(16, "div", 261)(17, "h3", 262);
    i0.ɵɵtext(18);
    i0.ɵɵelementStart(19, "span", 263);
    i0.ɵɵtext(20);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(21, "div", 264);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Template_div_click_21_listener($event) { i0.ɵɵrestoreView(_r44); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementStart(22, "div", 265)(23, "span", 266);
    i0.ɵɵtext(24);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "div", 267);
    i0.ɵɵtext(26);
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(27, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_27_Template, 5, 1, "div", 268);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "div", 269);
    i0.ɵɵrepeaterCreate(29, SmartBatchComponent_Conditional_20_Conditional_2_For_8_For_30_Template, 3, 1, "span", 270, _forTrack0);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(31, "div", 271)(32, "div", 272)(33, "label", 273);
    i0.ɵɵtext(34, " Ng\u00E0y ki\u1EC3m nghi\u1EC7m ");
    i0.ɵɵelementStart(35, "span", 274);
    i0.ɵɵtext(36, "*");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(37, "input", 275);
    i0.ɵɵlistener("ngModelChange", function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Template_input_ngModelChange_37_listener($event) { const ɵ$index_869_r45 = i0.ɵɵrestoreView(_r44).$index; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.updateBatchInput(ɵ$index_869_r45, "analysisDate", $event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵrepeaterCreate(38, SmartBatchComponent_Conditional_20_Conditional_2_For_8_For_39_Template, 1, 1, null, null, _forTrack5);
    i0.ɵɵelementStart(40, "div")(41, "label", 276);
    i0.ɵɵtext(42, "Hao h\u1EE5t (%)");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(43, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_43_Template, 3, 0, "div", 277)(44, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_44_Template, 1, 1, "input", 278);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(45, "div")(46, "label", 279);
    i0.ɵɵtext(47, "Thi\u1EBFt b\u1ECB");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(48, "select", 280);
    i0.ɵɵlistener("ngModelChange", function SmartBatchComponent_Conditional_20_Conditional_2_For_8_Template_select_ngModelChange_48_listener($event) { const ɵ$index_869_r45 = i0.ɵɵrestoreView(_r44).$index; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.updateBatchInput(ɵ$index_869_r45, "device", $event)); });
    i0.ɵɵelementStart(49, "option", 67);
    i0.ɵɵtext(50, "-- M\u1EB7c \u0111\u1ECBnh --");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(51, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_51_Template, 2, 0)(52, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_52_Template, 2, 0);
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(53, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_53_Template, 15, 0, "div", 281)(54, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Conditional_54_Template, 6, 1, "div", 282);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const batch_r47 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵclassProp("border-l-4", true)("border-l-emerald-500", batch_r47.status === "ready" && !batch_r47.name.includes("(T\u00E1ch)"))("border-l-red-500", batch_r47.status === "missing_stock")("border-l-yellow-400", batch_r47.name.includes("(T\u00E1ch)") && batch_r47.status !== "missing_stock")("ring-2", ctx_r1.matchesSearch(batch_r47))("ring-blue-400", ctx_r1.matchesSearch(batch_r47))("opacity-40", ctx_r1.sampleSearchTerm() && !ctx_r1.matchesSearch(batch_r47));
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(batch_r47.sop.category);
    i0.ɵɵadvance();
    i0.ɵɵconditional(batch_r47.tags ? 6 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(batch_r47.status === "missing_stock" ? 7 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(batch_r47.name.includes("(T\u00E1ch)") ? 8 : -1);
    i0.ɵɵadvance(7);
    i0.ɵɵclassProp("rotate-180", batch_r47.isExpanded);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", batch_r47.name, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("(", batch_r47.sop.name, ")");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("", batch_r47.samples.size, " m\u1EABu");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("line-clamp-2", !batch_r47.isExpanded);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", batch_r47.isExpanded ? ctx_r1.getFullSampleString(batch_r47.samples) : ctx_r1.formatSampleList(batch_r47.samples), " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.getBatchDescriptionText(batch_r47) ? 27 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(batch_r47.targets);
    i0.ɵɵadvance(8);
    i0.ɵɵclassProp("border-red-400", !batch_r47.inputValues["analysisDate"]);
    i0.ɵɵproperty("ngModel", batch_r47.inputValues["analysisDate"]);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(batch_r47.sop.inputs);
    i0.ɵɵadvance(5);
    i0.ɵɵconditional(batch_r47.safetyMargin === -1 ? 43 : 44);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngModel", batch_r47.inputValues["device"] || "");
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(batch_r47.sop.allowedDevices && batch_r47.sop.allowedDevices.length > 0 ? 51 : 52);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(batch_r47.isExpanded ? 53 : 54);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_For_15_Conditional_3_For_2_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "img", 360);
} if (rf & 2) {
    const ghs_r68 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(6);
    i0.ɵɵproperty("src", ctx_r1.GHS_DICT[ghs_r68].iconUrl, i0.ɵɵsanitizeUrl)("title", ctx_r1.GHS_DICT[ghs_r68].label);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_For_15_Conditional_3_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_For_15_Conditional_3_For_2_Conditional_0_Template, 1, 2, "img", 360);
} if (rf & 2) {
    const ghs_r68 = ctx.$implicit;
    i0.ɵɵconditional(ghs_r68.startsWith("GHS") ? 0 : -1);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_For_15_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 354);
    i0.ɵɵrepeaterCreate(1, SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_For_15_Conditional_3_For_2_Template, 1, 1, null, null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r69 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵrepeater(item_r69.ghsWarnings);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_For_15_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 355);
    i0.ɵɵelement(1, "i", 151);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r69 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2(" Thi\u1EBFu: ", ctx_r1.formatNum(item_r69.missing), " ", item_r69.unit, "");
} }
function SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_For_15_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    const _r70 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 361);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_For_15_Conditional_10_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r70); const item_r69 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.openQuickImport(item_r69)); });
    i0.ɵɵelement(1, "i", 316);
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_For_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 351)(1, "td", 353);
    i0.ɵɵtext(2);
    i0.ɵɵtemplate(3, SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_For_15_Conditional_3_Template, 3, 0, "div", 354)(4, SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_For_15_Conditional_4_Template, 3, 2, "div", 355);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "td", 356);
    i0.ɵɵtext(6);
    i0.ɵɵelementStart(7, "span", 357);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "td", 358);
    i0.ɵɵtemplate(10, SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_For_15_Conditional_10_Template, 2, 0, "button", 359);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r69 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction1(9, _c6, item_r69.isMissing));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", item_r69.isMissing ? "text-red-700 dark:text-red-400" : "text-slate-700 dark:text-slate-300");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", item_r69.name, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r69.ghsWarnings && item_r69.ghsWarnings.length > 0 ? 3 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r69.isMissing ? 4 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", item_r69.isMissing ? "text-red-600 dark:text-red-400" : "text-slate-600 dark:text-slate-400");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.formatNum(item_r69.needed), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r69.unit);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(item_r69.isMissing ? 10 : -1);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_Conditional_16_For_6_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 366);
    i0.ɵɵelement(1, "img", 367);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const code_r71 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(5);
    i0.ɵɵadvance();
    i0.ɵɵproperty("src", ctx_r1.GHS_DICT[code_r71].iconUrl, i0.ɵɵsanitizeUrl)("title", ctx_r1.GHS_DICT[code_r71].label);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_Conditional_16_For_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_Conditional_16_For_6_Conditional_0_Template, 2, 2, "div", 366);
} if (rf & 2) {
    const code_r71 = ctx.$implicit;
    i0.ɵɵconditional(code_r71.startsWith("GHS") ? 0 : -1);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_Conditional_16_For_9_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li", 368);
    i0.ɵɵelement(1, "i", 369);
    i0.ɵɵelementStart(2, "span", 370);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const code_r72 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(code_r72);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_Conditional_16_For_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_Conditional_16_For_9_Conditional_0_Template, 4, 1, "li", 368);
} if (rf & 2) {
    const code_r72 = ctx.$implicit;
    i0.ɵɵconditional(!code_r72.startsWith("GHS") ? 0 : -1);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_Conditional_16_For_11_Conditional_0_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li", 371);
    i0.ɵɵelement(1, "i", 369);
    i0.ɵɵelementStart(2, "span", 370)(3, "span", 372);
    i0.ɵɵtext(4, "Precaution:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const rule_r73 = ctx.$implicit;
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", rule_r73, "");
} }
function SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_Conditional_16_For_11_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_Conditional_16_For_11_Conditional_0_For_1_Template, 6, 1, "li", 371, i0.ɵɵrepeaterTrackByIdentity);
} if (rf & 2) {
    const code_r74 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(5);
    i0.ɵɵrepeater(ctx_r1.GHS_DICT[code_r74].precautions);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_Conditional_16_For_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_Conditional_16_For_11_Conditional_0_Template, 2, 0);
} if (rf & 2) {
    const code_r74 = ctx.$implicit;
    i0.ɵɵconditional(code_r74.startsWith("GHS") ? 0 : -1);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 352)(1, "h4", 362);
    i0.ɵɵelement(2, "i", 363);
    i0.ɵɵtext(3, " H\u01B0\u1EDBng D\u1EABn An To\u00E0n Tr\u01B0\u1EDBc Pha Ch\u1EBF ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 364);
    i0.ɵɵrepeaterCreate(5, SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_Conditional_16_For_6_Template, 1, 1, null, null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "ul", 365);
    i0.ɵɵrepeaterCreate(8, SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_Conditional_16_For_9_Template, 1, 1, null, null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵrepeaterCreate(10, SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_Conditional_16_For_11_Template, 1, 1, null, null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(5);
    i0.ɵɵrepeater(ctx_r1.aggregateGHSWarnings());
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r1.aggregateGHSWarnings());
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r1.aggregateGHSWarnings());
} }
function SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 341)(1, "h4", 342);
    i0.ɵɵelement(2, "i", 343);
    i0.ɵɵtext(3, " T\u1ED5ng L\u01B0\u1EE3ng C\u1EA7n D\u00F9ng ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 344)(5, "table", 345)(6, "thead", 346)(7, "tr")(8, "th", 347);
    i0.ɵɵtext(9, "H\u00F3a ch\u1EA5t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "th", 348);
    i0.ɵɵtext(11, "L\u01B0\u1EE3ng c\u1EA7n");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(12, "th", 349);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "tbody", 350);
    i0.ɵɵrepeaterCreate(14, SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_For_15_Template, 11, 11, "tr", 351, _forTrack7);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵtemplate(16, SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_Conditional_16_Template, 12, 0, "div", 352);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(14);
    i0.ɵɵrepeater(ctx_r1.totalStockSummary());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.aggregateGHSWarnings().length > 0 ? 16 : -1);
} }
function SmartBatchComponent_Conditional_20_Conditional_2_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 237);
    i0.ɵɵelement(1, "i", 373)(2, "br");
    i0.ɵɵtext(3, " Kh\u00F4ng c\u00F3 h\u00F3a ch\u1EA5t n\u00E0o b\u1ECB ti\u00EAu hao. ");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_20_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r41 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 228)(1, "div", 229);
    i0.ɵɵelement(2, "i", 230);
    i0.ɵɵelementStart(3, "input", 231);
    i0.ɵɵlistener("ngModelChange", function SmartBatchComponent_Conditional_20_Conditional_2_Template_input_ngModelChange_3_listener($event) { i0.ɵɵrestoreView(_r41); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.sampleSearchTerm.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "div", 232);
    i0.ɵɵtemplate(5, SmartBatchComponent_Conditional_20_Conditional_2_Conditional_5_Template, 9, 1, "div", 233)(6, SmartBatchComponent_Conditional_20_Conditional_2_Conditional_6_Template, 10, 0, "div", 234);
    i0.ɵɵrepeaterCreate(7, SmartBatchComponent_Conditional_20_Conditional_2_For_8_Template, 55, 34, "div", 235, _forTrack0);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "div", 236);
    i0.ɵɵtemplate(10, SmartBatchComponent_Conditional_20_Conditional_2_Conditional_10_Template, 17, 1)(11, SmartBatchComponent_Conditional_20_Conditional_2_Conditional_11_Template, 4, 0, "div", 237);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngModel", ctx_r1.sampleSearchTerm());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.planValidationIssues().length > 0 ? 5 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.unmappedTasks().length > 0 ? 6 : -1);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.batches());
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r1.totalStockSummary().length > 0 ? 10 : 11);
} }
function SmartBatchComponent_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 14);
    i0.ɵɵtemplate(1, SmartBatchComponent_Conditional_20_Conditional_1_Template, 23, 9)(2, SmartBatchComponent_Conditional_20_Conditional_2_Template, 12, 4);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.step() === 1 ? 1 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.step() === 2 ? 2 : -1);
} }
function SmartBatchComponent_Conditional_21_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 380);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("(Tr\u00F9ng l\u1EB7p: ", ctx_r1.coverageMetrics().duplicateCount, ")");
} }
function SmartBatchComponent_Conditional_21_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 381);
    i0.ɵɵelement(1, "i", 385);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" Ki\u1EC3m tra c\u00E1c m\u1EABu: ", ctx_r1.coverageMetrics().missingSampleNames, " ");
} }
function SmartBatchComponent_Conditional_21_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    const _r76 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 386);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_21_Conditional_17_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r76); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.fixCoverage()); });
    i0.ɵɵelement(1, "i", 82);
    i0.ɵɵtext(2, " T\u1EF1 S\u1EEDa ");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_21_Conditional_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 197);
    i0.ɵɵtext(1, " X\u1EED l\u00FD... ");
} }
function SmartBatchComponent_Conditional_21_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 387);
    i0.ɵɵtext(1, " Duy\u1EC7t & X\u1EBFp H\u00E0ng In ");
} }
function SmartBatchComponent_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    const _r75 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 15)(1, "div", 374)(2, "div", 375)(3, "div", 63)(4, "div", 376);
    i0.ɵɵelement(5, "i", 377);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div")(7, "div", 378);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 379);
    i0.ɵɵtext(10, " Thi\u1EBFu ");
    i0.ɵɵelementStart(11, "b");
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(13, " ch\u1EC9 ti\u00EAu/m\u1EABu. ");
    i0.ɵɵtemplate(14, SmartBatchComponent_Conditional_21_Conditional_14_Template, 2, 1, "span", 380);
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(15, SmartBatchComponent_Conditional_21_Conditional_15_Template, 3, 1, "div", 381);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "div", 382);
    i0.ɵɵtemplate(17, SmartBatchComponent_Conditional_21_Conditional_17_Template, 3, 0, "button", 383);
    i0.ɵɵelementStart(18, "button", 384);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_21_Template_button_click_18_listener() { i0.ɵɵrestoreView(_r75); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.executeAll()); });
    i0.ɵɵtemplate(19, SmartBatchComponent_Conditional_21_Conditional_19_Template, 2, 0)(20, SmartBatchComponent_Conditional_21_Conditional_20_Template, 2, 0);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵclassMap(ctx_r1.coverageMetrics().isFullyCovered ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse");
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.coverageMetrics().isFullyCovered ? "fa-check" : "fa-triangle-exclamation");
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r1.coverageMetrics().isFullyCovered ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.coverageMetrics().isFullyCovered ? "\u0110\u00E3 ph\u1EE7 k\u00EDn to\u00E0n b\u1ED9 y\u00EAu c\u1EA7u" : "C\u1EA3nh b\u00E1o: Ch\u01B0a ph\u1EE7 h\u1EBFt y\u00EAu c\u1EA7u!", " ");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.coverageMetrics().missingCount);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.coverageMetrics().duplicateCount > 0 ? 14 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(!ctx_r1.coverageMetrics().isFullyCovered ? 15 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(!ctx_r1.coverageMetrics().isFullyCovered ? 17 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.isProcessing() || ctx_r1.batches().length === 0 || ctx_r1.hasCriticalMissing() || ctx_r1.hasInvalidAnalysisDates() || ctx_r1.hasInvalidPlanResources() || !ctx_r1.coverageMetrics().isFullyCovered || ctx_r1.coverageMetrics().duplicateCount > 0);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isProcessing() ? 19 : 20);
} }
function SmartBatchComponent_Conditional_22_Conditional_14_For_9_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 410);
    i0.ɵɵtext(1, "T\u1EF1 \u0111\u1ED9ng g\u1EE3i \u00FD");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_22_Conditional_14_For_9_For_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 2);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const sop_r80 = ctx.$implicit;
    i0.ɵɵproperty("value", sop_r80.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("G\u00E1n SOP: ", sop_r80.name, "");
} }
function SmartBatchComponent_Conditional_22_Conditional_14_For_9_Template(rf, ctx) { if (rf & 1) {
    const _r78 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 407)(1, "div", 250)(2, "div")(3, "div", 408);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 409);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(7, SmartBatchComponent_Conditional_22_Conditional_14_For_9_Conditional_7_Template, 2, 0, "span", 410);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 411)(9, "select", 412);
    i0.ɵɵlistener("ngModelChange", function SmartBatchComponent_Conditional_22_Conditional_14_For_9_Template_select_ngModelChange_9_listener($event) { const ɵ$index_1368_r79 = i0.ɵɵrestoreView(_r78).$index; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.updateFixGroup1Sop(ɵ$index_1368_r79, $event === "REMOVE" ? null : $event)); });
    i0.ɵɵelementStart(10, "option", 413);
    i0.ɵɵtext(11, "-- Lo\u1EA1i b\u1ECF kh\u1ECFi k\u1EBF ho\u1EA1ch --");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(12, SmartBatchComponent_Conditional_22_Conditional_14_For_9_For_13_Template, 2, 2, "option", 2, _forTrack0);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const item_r81 = ctx.$implicit;
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(item_r81.targetName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("Nh\u00F3m m\u1EABu #", item_r81.blockId, " \u2022 ", item_r81.affectedSamples.join(", "), "");
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r81.candidateSops.length === 1 ? 7 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngModel", item_r81.chosenSopId || "REMOVE");
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(item_r81.candidateSops);
} }
function SmartBatchComponent_Conditional_22_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 396)(1, "div", 402);
    i0.ɵɵelement(2, "i", 403);
    i0.ɵɵelementStart(3, "span", 404);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "div", 405)(6, "p", 406);
    i0.ɵɵtext(7, "C\u00E1c ch\u1EC9 ti\u00EAu n\u00E0y ch\u1EC9 t\u1ED3n t\u1EA1i trong SOP ch\u1EC9 \u0111\u1ECBnh th\u1EE7 c\u00F4ng. Vui l\u00F2ng ch\u1ECDn quy tr\u00ECnh mu\u1ED1n s\u1EED d\u1EE5ng ho\u1EB7c lo\u1EA1i b\u1ECF kh\u1ECFi k\u1EBF ho\u1EA1ch.");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(8, SmartBatchComponent_Conditional_22_Conditional_14_For_9_Template, 14, 5, "div", 407, _forTrack8);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("NH\u00D3M 1: C\u1EA7n ch\u1ECDn th\u1EE7 c\u00F4ng SOP \u0110\u1EB7c th\u00F9 (", ctx_r1.fixCoverageState().group1.length, ")");
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx_r1.fixCoverageState().group1);
} }
function SmartBatchComponent_Conditional_22_Conditional_15_For_9_Template(rf, ctx) { if (rf & 1) {
    const _r82 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 407)(1, "div", 417)(2, "div", 408);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 409);
    i0.ɵɵtext(5);
    i0.ɵɵelementStart(6, "span", 418);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 419);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "div", 420)(12, "label", 421)(13, "input", 422);
    i0.ɵɵlistener("change", function SmartBatchComponent_Conditional_22_Conditional_15_For_9_Template_input_change_13_listener() { const ɵ$index_1411_r83 = i0.ɵɵrestoreView(_r82).$index; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.updateFixGroup2Action(ɵ$index_1411_r83, "ignore_matrix")); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "span");
    i0.ɵɵtext(15, "B\u1ECF qua r\u00E0ng bu\u1ED9c Matrix");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "label", 421)(17, "input", 423);
    i0.ɵɵlistener("change", function SmartBatchComponent_Conditional_22_Conditional_15_For_9_Template_input_change_17_listener() { const ɵ$index_1411_r83 = i0.ɵɵrestoreView(_r82).$index; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.updateFixGroup2Action(ɵ$index_1411_r83, "remove")); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "span", 424);
    i0.ɵɵtext(19, "Lo\u1EA1i b\u1ECF ch\u1EC9 ti\u00EAu");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const item_r84 = ctx.$implicit;
    const ɵ$index_1411_r83 = ctx.$index;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r84.targetName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Nh\u00F3m m\u1EABu #", item_r84.blockId, " (N\u1EC1n m\u1EABu: ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.getMatrixLabel(item_r84.currentMatrix) || "D\u00F9ng chung");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(") \u2022 ", item_r84.affectedSamples.join(", "), "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("SOP h\u1ED7 tr\u1EE3 ch\u1EC9 d\u00F9ng cho: ", ctx_r1.getCompatibleMatricesLabel(item_r84), "...");
    i0.ɵɵadvance(3);
    i0.ɵɵpropertyInterpolate1("name", "g2_", ɵ$index_1411_r83, "");
    i0.ɵɵproperty("checked", item_r84.action === "ignore_matrix");
    i0.ɵɵadvance(4);
    i0.ɵɵpropertyInterpolate1("name", "g2_", ɵ$index_1411_r83, "");
    i0.ɵɵproperty("checked", item_r84.action === "remove");
} }
function SmartBatchComponent_Conditional_22_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 397)(1, "div", 414);
    i0.ɵɵelement(2, "i", 415);
    i0.ɵɵelementStart(3, "span", 416);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "div", 405)(6, "p", 406);
    i0.ɵɵtext(7, "SOP h\u1ED7 tr\u1EE3 kh\u00F4ng kh\u1EDBp v\u1EDBi N\u1EC1n m\u1EABu c\u1EE7a nh\u00F3m. Ch\u1ECDn b\u1ECF qua r\u00E0ng bu\u1ED9c ho\u1EB7c lo\u1EA1i b\u1ECF ch\u1EC9 ti\u00EAu.");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(8, SmartBatchComponent_Conditional_22_Conditional_15_For_9_Template, 20, 11, "div", 407, _forTrack8);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("NH\u00D3M 2: Sai N\u1EC1n m\u1EABu (Matrix) (", ctx_r1.fixCoverageState().group2.length, ")");
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx_r1.fixCoverageState().group2);
} }
function SmartBatchComponent_Conditional_22_Conditional_16_For_9_Template(rf, ctx) { if (rf & 1) {
    const _r85 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 407)(1, "div", 417)(2, "div", 408);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 409);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "div", 428)(7, "label", 421)(8, "input", 423);
    i0.ɵɵlistener("change", function SmartBatchComponent_Conditional_22_Conditional_16_For_9_Template_input_change_8_listener() { const ɵ$index_1460_r86 = i0.ɵɵrestoreView(_r85).$index; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.updateFixGroup3Action(ɵ$index_1460_r86, "remove")); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "span", 429);
    i0.ɵɵtext(10, "Lo\u1EA1i b\u1ECF kh\u1ECFi k\u1EBF ho\u1EA1ch");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "label", 421)(12, "input", 430);
    i0.ɵɵlistener("change", function SmartBatchComponent_Conditional_22_Conditional_16_For_9_Template_input_change_12_listener() { const ɵ$index_1460_r86 = i0.ɵɵrestoreView(_r85).$index; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.updateFixGroup3Action(ɵ$index_1460_r86, "keep_unmapped")); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "span");
    i0.ɵɵtext(14, "Gi\u1EEF l\u1EA1i (ch\u1EA5p nh\u1EADn c\u1EA3nh b\u00E1o)");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const item_r87 = ctx.$implicit;
    const ɵ$index_1460_r86 = ctx.$index;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r87.targetName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("Nh\u00F3m m\u1EABu #", item_r87.blockId, " \u2022 ", item_r87.affectedSamples.join(", "), "");
    i0.ɵɵadvance(3);
    i0.ɵɵpropertyInterpolate1("name", "g3_", ɵ$index_1460_r86, "");
    i0.ɵɵproperty("checked", item_r87.action === "remove");
    i0.ɵɵadvance(4);
    i0.ɵɵpropertyInterpolate1("name", "g3_", ɵ$index_1460_r86, "");
    i0.ɵɵproperty("checked", item_r87.action === "keep_unmapped");
} }
function SmartBatchComponent_Conditional_22_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 398)(1, "div", 425);
    i0.ɵɵelement(2, "i", 426);
    i0.ɵɵelementStart(3, "span", 427);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "div", 405)(6, "p", 406);
    i0.ɵɵtext(7, "Kh\u00F4ng t\u00ECm th\u1EA5y b\u1EA5t k\u1EF3 quy tr\u00ECnh n\u00E0o trong h\u1EC7 th\u1ED1ng c\u00F3 th\u1EC3 ph\u00E2n t\u00EDch ch\u1EC9 ti\u00EAu n\u00E0y.");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(8, SmartBatchComponent_Conditional_22_Conditional_16_For_9_Template, 15, 9, "div", 407, _forTrack8);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("NH\u00D3M 3: Kh\u00F4ng c\u00F3 SOP n\u00E0o h\u1ED7 tr\u1EE3 (", ctx_r1.fixCoverageState().group3.length, ")");
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx_r1.fixCoverageState().group3);
} }
function SmartBatchComponent_Conditional_22_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 197);
    i0.ɵɵtext(1, " X\u1EED l\u00FD... ");
} }
function SmartBatchComponent_Conditional_22_Conditional_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 152);
    i0.ɵɵtext(1, " \u00C1p d\u1EE5ng & Ch\u1EA1y l\u1EA1i ");
} }
function SmartBatchComponent_Conditional_22_Template(rf, ctx) { if (rf & 1) {
    const _r77 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 16)(1, "div", 388)(2, "div", 389)(3, "div", 4)(4, "div", 390);
    i0.ɵɵelement(5, "i", 82);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div")(7, "h3", 391);
    i0.ɵɵtext(8, "Ki\u1EC3m Tra v\u00E0 X\u1EED L\u00FD Ch\u1EC9 Ti\u00EAu Ch\u01B0a \u0110\u01B0\u1EE3c Ph\u00E2n B\u1ED5");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "p", 392);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(11, "button", 393);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_22_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r77); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeFixCoverageModal()); });
    i0.ɵɵelement(12, "i", 394);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "div", 395);
    i0.ɵɵtemplate(14, SmartBatchComponent_Conditional_22_Conditional_14_Template, 10, 1, "div", 396)(15, SmartBatchComponent_Conditional_22_Conditional_15_Template, 10, 1, "div", 397)(16, SmartBatchComponent_Conditional_22_Conditional_16_Template, 10, 1, "div", 398);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "div", 399)(18, "button", 400);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_22_Template_button_click_18_listener() { i0.ɵɵrestoreView(_r77); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeFixCoverageModal()); });
    i0.ɵɵtext(19, " H\u1EE7y ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "button", 401);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_22_Template_button_click_20_listener() { i0.ɵɵrestoreView(_r77); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.applyFixCoverage()); });
    i0.ɵɵtemplate(21, SmartBatchComponent_Conditional_22_Conditional_21_Template, 2, 0)(22, SmartBatchComponent_Conditional_22_Conditional_22_Template, 2, 0);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(10);
    i0.ɵɵtextInterpolate1("T\u00ECm th\u1EA5y ", ctx_r1.fixCoverageState().group1.length + ctx_r1.fixCoverageState().group2.length + ctx_r1.fixCoverageState().group3.length, " ch\u1EC9 ti\u00EAu kh\u00F4ng th\u1EC3 t\u1EF1 gh\u00E9p m\u1EBB.");
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.fixCoverageState().group1.length > 0 ? 14 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.fixCoverageState().group2.length > 0 ? 15 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.fixCoverageState().group3.length > 0 ? 16 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("disabled", ctx_r1.fixCoverageState().isProcessing);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.fixCoverageState().isProcessing ? 21 : 22);
} }
function SmartBatchComponent_Conditional_23_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 434);
    i0.ɵɵelement(1, "i", 435)(2, "br");
    i0.ɵɵtext(3, "\u0110ang t\u1EA3i ho\u1EB7c ch\u01B0a c\u00F3 b\u1ED9 ch\u1EC9 ti\u00EAu n\u00E0o.");
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_23_Conditional_9_For_1_Template(rf, ctx) { if (rf & 1) {
    const _r89 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 437);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_23_Conditional_9_For_1_Template_div_click_0_listener() { const g_r90 = i0.ɵɵrestoreView(_r89).$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.importGroup(g_r90)); });
    i0.ɵɵelementStart(1, "div", 438);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 439)(4, "span");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const g_r90 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(g_r90.name);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", g_r90.targets.length, " ch\u1EC9 ti\u00EAu");
} }
function SmartBatchComponent_Conditional_23_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, SmartBatchComponent_Conditional_23_Conditional_9_For_1_Template, 6, 2, "div", 436, _forTrack0);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵrepeater(ctx_r1.availableGroups());
} }
function SmartBatchComponent_Conditional_23_Template(rf, ctx) { if (rf & 1) {
    const _r88 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 16)(1, "div", 431)(2, "div", 389)(3, "h3", 391);
    i0.ɵɵtext(4, "Ch\u1ECDn Nh\u00F3m Ch\u1EC9 Ti\u00EAu");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "button", 432);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_23_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r88); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.showGroupModal.set(false)); });
    i0.ɵɵelement(6, "i", 394);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "div", 433);
    i0.ɵɵtemplate(8, SmartBatchComponent_Conditional_23_Conditional_8_Template, 4, 0, "div", 434)(9, SmartBatchComponent_Conditional_23_Conditional_9_Template, 2, 0);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(8);
    i0.ɵɵconditional(ctx_r1.availableGroups().length === 0 ? 8 : 9);
} }
function SmartBatchComponent_Conditional_24_Defer_0_Template(rf, ctx) { if (rf & 1) {
    const _r91 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-batch-split-wizard", 440);
    i0.ɵɵlistener("close", function SmartBatchComponent_Conditional_24_Defer_0_Template_app_batch_split_wizard_close_0_listener() { i0.ɵɵrestoreView(_r91); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.showSplitModal.set(false)); })("execute", function SmartBatchComponent_Conditional_24_Defer_0_Template_app_batch_split_wizard_execute_0_listener($event) { i0.ɵɵrestoreView(_r91); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.executeSplitFromWizard($event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("sourceBatch", ctx_r1.batches()[ctx_r1.splitState().sourceBatchIndex])("allSops", ctx_r1.activeSops());
} }
function SmartBatchComponent_Conditional_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, SmartBatchComponent_Conditional_24_Defer_0_Template, 1, 2);
    i0.ɵɵdefer(1, 0, SmartBatchComponent_Conditional_24_Defer_1_DepsFn);
    i0.ɵɵdeferOnIdle();
} }
function SmartBatchComponent_Conditional_25_Template(rf, ctx) { if (rf & 1) {
    const _r92 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 17)(1, "div", 441)(2, "div", 442)(3, "div")(4, "h3", 443);
    i0.ɵɵelement(5, "i", 444);
    i0.ɵɵtext(6, " Nh\u1EADp Kho Nhanh ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "p", 445);
    i0.ɵɵtext(8, "B\u00F9 h\u00E0ng cho m\u1EBB ph\u00E2n t\u00EDch");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "button", 432);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_25_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r92); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.showQuickImport.set(false)); });
    i0.ɵɵelement(10, "i", 446);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "div", 447)(12, "div", 448)(13, "div", 449);
    i0.ɵɵtext(14, "H\u00F3a ch\u1EA5t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "div", 450);
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "div", 451)(18, "div", 452);
    i0.ɵɵtext(19, "T\u1ED3n: ");
    i0.ɵɵelementStart(20, "b", 453);
    i0.ɵɵtext(21);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(22, "div", 452);
    i0.ɵɵtext(23, "Thi\u1EBFu: ");
    i0.ɵɵelementStart(24, "b", 454);
    i0.ɵɵtext(25);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(26, "div")(27, "label", 455);
    i0.ɵɵtext(28, "S\u1ED1 l\u01B0\u1EE3ng th\u1EF1c nh\u1EADp");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "div", 111)(30, "input", 456);
    i0.ɵɵtwoWayListener("ngModelChange", function SmartBatchComponent_Conditional_25_Template_input_ngModelChange_30_listener($event) { i0.ɵɵrestoreView(_r92); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.quickImportInput, $event) || (ctx_r1.quickImportInput = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "span", 457);
    i0.ɵɵtext(32);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(33, "p", 458);
    i0.ɵɵtext(34);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(35, "div", 459)(36, "button", 460);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_25_Template_button_click_36_listener() { i0.ɵɵrestoreView(_r92); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.showQuickImport.set(false)); });
    i0.ɵɵtext(37, "H\u1EE7y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(38, "button", 461);
    i0.ɵɵlistener("click", function SmartBatchComponent_Conditional_25_Template_button_click_38_listener() { i0.ɵɵrestoreView(_r92); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.submitQuickImport()); });
    i0.ɵɵtext(39, " X\u00E1c Nh\u1EADn Nh\u1EADp ");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(16);
    i0.ɵɵtextInterpolate(ctx_r1.quickImportState().name);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r1.formatNum(ctx_r1.quickImportState().currentStock));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("-", ctx_r1.formatNum(ctx_r1.quickImportState().missingAmount), "");
    i0.ɵɵadvance(5);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.quickImportInput);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.quickImportState().unit);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("* Nh\u1EADp tr\u1EF1c ti\u1EBFp theo \u0111\u01A1n v\u1ECB g\u1ED1c (", ctx_r1.quickImportState().unit, ")");
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("disabled", ctx_r1.quickImportInput <= 0 || ctx_r1.isProcessing());
} }
function SmartBatchComponent_Conditional_26_Defer_0_Template(rf, ctx) { if (rf & 1) {
    const _r93 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-quick-generate-sample-modal", 462);
    i0.ɵɵlistener("close", function SmartBatchComponent_Conditional_26_Defer_0_Template_app_quick_generate_sample_modal_close_0_listener() { i0.ɵɵrestoreView(_r93); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.closeQuickGenerateModal()); })("generated", function SmartBatchComponent_Conditional_26_Defer_0_Template_app_quick_generate_sample_modal_generated_0_listener($event) { i0.ɵɵrestoreView(_r93); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.handleGeneratedSamples($event)); });
    i0.ɵɵelementEnd();
} }
function SmartBatchComponent_Conditional_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, SmartBatchComponent_Conditional_26_Defer_0_Template, 1, 0);
    i0.ɵɵdefer(1, 0, SmartBatchComponent_Conditional_26_Defer_1_DepsFn);
    i0.ɵɵdeferOnIdle();
} }
export class SmartBatchComponent {
    get GHS_DICT() { return GHS_DICTIONARY; }
    constructor() {
        this.state = inject(StateService);
        this.auth = inject(AuthService);
        this.router = inject(Router);
        this.calculator = inject(CalculatorService);
        this.recipeService = inject(RecipeService);
        this.targetService = inject(TargetService);
        this.invService = inject(InventoryService);
        this.toast = inject(ToastService);
        this.confirmation = inject(ConfirmationService);
        this.matrixTypeService = inject(MatrixTypeService);
        this.masterDeviceService = inject(MasterDeviceService);
        this.sampleDescriptionMasterService = inject(SampleDescriptionMasterService);
        this.formatNum = formatNum;
        this.formatSampleList = formatSampleList;
        this.step = signal(0);
        this.smartBatchMode = signal('multiple');
        // Single mode state
        this.singleSampleCode = signal('');
        this.singleSelectedTargets = signal(new Set());
        this.singleSourceGroupId = signal(null);
        this.singleMatrixType = signal(undefined);
        this.singleTargetSearch = signal('');
        this.singleForcedSopId = signal(undefined);
        this.singleSampleDescription = signal(undefined);
        this.blocks = signal([this.createEmptyBlock()]);
        this.batches = signal([]);
        this.unmappedTasks = signal([]);
        this.excludedTaskKeys = signal(new Set());
        this.isProcessing = signal(false);
        this.isEditingName = signal(null);
        this.availableMatrices = signal([]);
        this.availableDevices = signal([]);
        this.availableSampleDescriptions = signal([]);
        this.matrixById = computed(() => new Map(this.availableMatrices().map(matrix => [matrix.id, matrix])));
        this.blockSamplesCache = new Map();
        this.blockDescriptionCountCache = new Map();
        // Quick Generate Modal State
        this.quickGenerateModalOpen = signal(false);
        this.activeBlockIndexForGenerate = signal(null);
        this.inventoryCache = {};
        this.recipeCache = {};
        this.sampleSearchTerm = signal('');
        // --- SPLIT WIZARD STATE ---
        this.showSplitModal = signal(false);
        this.splitState = signal({
            step: 1,
            sourceBatchIndex: -1,
            sourceBatchName: '',
            availableSamples: [],
            selectedSamples: new Set(),
            availableTargets: [],
            selectedTargets: new Set(),
            selectedSopId: null
        });
        this.showGroupModal = signal(false);
        this.availableGroups = signal([]);
        this.currentBlockIndexForGroupImport = signal(-1);
        // --- PREVIEW PANEL STATE ---
        this.previewSop = signal(null);
        // --- QUICK IMPORT STATE ---
        this.showQuickImport = signal(false);
        this.quickImportState = signal({
            id: '', name: '', unit: '', currentStock: 0, missingAmount: 0
        });
        this.quickImportInput = 0;
        // --- FIX COVERAGE MODAL STATE ---
        this.fixCoverageState = signal({
            isOpen: false,
            isProcessing: false,
            group1: [],
            group2: [],
            group3: []
        });
        // --- COMPUTED: GENERAL ---
        this.activeSops = computed(() => this.state.sops().filter(s => !s.isArchived));
        this.allAvailableTargets = computed(() => {
            const targets = new Map();
            this.activeSops().forEach(sop => {
                sop.targets?.forEach(target => {
                    if (!target.name)
                        return;
                    const canonical = getCanonicalId(target.name);
                    if (!targets.has(canonical)) {
                        targets.set(canonical, { id: canonical, name: target.name, uniqueKey: canonical });
                    }
                });
            });
            return Array.from(targets.values()).sort((a, b) => a.name.localeCompare(b.name));
        });
        // --- COMPUTED MAPS ---
        // Tránh tính lại không cần thiết mỗi change detection cycle trong @for loops
        this.filteredTargetsMap = computed(() => {
            const map = new Map();
            const all = this.allAvailableTargets();
            for (const block of this.blocks()) {
                const term = (block.targetSearch || '').toLowerCase().trim();
                map.set(block.id, !term ? all : all.filter(t => t.name.toLowerCase().includes(term) || t.id.toLowerCase().includes(term)));
            }
            return map;
        });
        this.singleFilteredTargets = computed(() => {
            const term = this.singleTargetSearch().toLowerCase().trim();
            const all = this.allAvailableTargets();
            if (!term)
                return all;
            return all.filter(t => t.name.toLowerCase().includes(term) || t.id.toLowerCase().includes(term));
        });
        this.sopSuggestionsMap = computed(() => {
            const map = new Map();
            const activeNormal = this.activeSops().filter(s => !s.isManualOnly);
            const inventory = this.state.inventoryMap();
            const allTargets = this.allAvailableTargets(); // Extracted from loop
            for (const block of this.blocks()) {
                if (block.selectedTargets.size === 0) {
                    map.set(block.id, []);
                    continue;
                }
                const reqTargetIds = Array.from(block.selectedTargets);
                const candidates = [];
                for (const sop of activeNormal) {
                    const sug = this.buildSopSuggestion(sop, reqTargetIds, allTargets, inventory, block.matrixType);
                    if (sug)
                        candidates.push(sug);
                }
                // We have all candidates.
                // Filter logic: if there are 100% matches (missing.length === 0), only show them.
                // If no 100% matches, show top 5 partial matches.
                const fullMatches = candidates.filter(c => !c.isPartial);
                let results = [];
                if (fullMatches.length > 0) {
                    results = fullMatches.sort((a, b) => b.coverageRatio - a.coverageRatio);
                }
                else {
                    results = candidates.sort((a, b) => b.coverageCount - a.coverageCount || b.coverageRatio - a.coverageRatio).slice(0, 5);
                }
                if (results.length > 0) {
                    results[0].isBest = true; // Best overall based on sort order
                }
                // Inject forced SOP if needed
                if (block.forcedSopId) {
                    const alreadyInResults = results.some(r => r.sop.id === block.forcedSopId);
                    if (!alreadyInResults) {
                        const forcedSop = this.activeSops().find(s => s.id === block.forcedSopId);
                        if (forcedSop) {
                            const forcedSug = this.buildSopSuggestion(forcedSop, reqTargetIds, allTargets, inventory, block.matrixType);
                            if (forcedSug) {
                                results = [forcedSug, ...results];
                            }
                        }
                    }
                }
                map.set(block.id, results);
            }
            return map;
        });
        this.eligibleManualSopsMap = computed(() => {
            const map = new Map();
            const manualSops = this.activeSops().filter(s => s.isManualOnly);
            const inventory = this.state.inventoryMap();
            const allTargets = this.allAvailableTargets(); // Extracted from loop
            for (const block of this.blocks()) {
                if (block.selectedTargets.size === 0) {
                    map.set(block.id, []);
                    continue;
                }
                const reqTargetIds = Array.from(block.selectedTargets);
                const eligibles = [];
                for (const sop of manualSops) {
                    const sug = this.buildSopSuggestion(sop, reqTargetIds, allTargets, inventory, block.matrixType);
                    if (sug)
                        eligibles.push(sug);
                }
                map.set(block.id, eligibles);
            }
            return map;
        });
        this.singleSopSuggestions = computed(() => {
            if (this.singleSelectedTargets().size === 0)
                return [];
            const reqTargetIds = Array.from(this.singleSelectedTargets());
            const allTargets = this.allAvailableTargets();
            const activeNormal = this.activeSops().filter(s => !s.isManualOnly);
            const inventory = this.state.inventoryMap();
            const matrixType = this.singleMatrixType();
            const candidates = [];
            for (const sop of activeNormal) {
                const sug = this.buildSopSuggestion(sop, reqTargetIds, allTargets, inventory, matrixType);
                if (sug)
                    candidates.push(sug);
            }
            const fullMatches = candidates.filter(c => !c.isPartial);
            let results = [];
            if (fullMatches.length > 0) {
                results = fullMatches.sort((a, b) => b.coverageRatio - a.coverageRatio);
            }
            else {
                results = candidates.sort((a, b) => b.coverageCount - a.coverageCount || b.coverageRatio - a.coverageRatio).slice(0, 5);
            }
            if (results.length > 0) {
                results[0].isBest = true;
            }
            // Inject forced SOP if needed
            if (this.singleForcedSopId()) {
                const forcedId = this.singleForcedSopId();
                const alreadyInResults = results.some(r => r.sop.id === forcedId);
                if (!alreadyInResults) {
                    const forcedSop = this.activeSops().find(s => s.id === forcedId);
                    if (forcedSop) {
                        const forcedSug = this.buildSopSuggestion(forcedSop, reqTargetIds, allTargets, inventory, matrixType);
                        if (forcedSug) {
                            results = [forcedSug, ...results];
                        }
                    }
                }
            }
            return results;
        });
        this.singleEligibleManualSops = computed(() => {
            if (this.singleSelectedTargets().size === 0)
                return [];
            const reqTargetIds = Array.from(this.singleSelectedTargets());
            const allTargets = this.allAvailableTargets();
            const manualSops = this.activeSops().filter(s => s.isManualOnly);
            const inventory = this.state.inventoryMap();
            const matrixType = this.singleMatrixType();
            const eligibles = [];
            for (const sop of manualSops) {
                const sug = this.buildSopSuggestion(sop, reqTargetIds, allTargets, inventory, matrixType);
                if (sug)
                    eligibles.push(sug);
            }
            return eligibles;
        });
        this.totalUniqueSamples = computed(() => {
            if (this.smartBatchMode() === 'single') {
                return this.singleSampleCode().trim() ? 1 : 0;
            }
            const allSamples = new Set();
            this.blocks().forEach(b => {
                this.getBlockSamples(b).forEach(sample => allSamples.add(normalizeSampleCode(sample)));
            });
            return allSamples.size;
        });
        this.totalUniqueTargets = computed(() => {
            if (this.smartBatchMode() === 'single') {
                return this.singleSelectedTargets().size;
            }
            const allTargets = new Set();
            this.blocks().forEach(b => {
                b.selectedTargets.forEach(t => allTargets.add(t));
            });
            return allTargets.size;
        });
        this.hasCriticalMissing = computed(() => this.batches().some(b => b.status === 'missing_stock'));
        this.planValidationIssues = computed(() => this.batches().flatMap(batch => validateCalculatedItems(batch.resourceImpact, Number(batch.safetyMargin))));
        this.hasInvalidPlanResources = computed(() => this.planValidationIssues().length > 0);
        this.totalStockSummary = computed(() => {
            const summary = new Map();
            const ledger = {};
            Object.values(this.state.inventoryMap()).forEach((i) => ledger[i.id] = i.stock);
            for (const batch of this.batches()) {
                for (const item of batch.resourceImpact) {
                    if (item.isComposite) {
                        for (const sub of item.breakdown) {
                            const current = ledger[sub.name] || 0;
                            const remaining = current - sub.totalNeed;
                            ledger[sub.name] = remaining;
                            const invItem = this.state.inventoryMap()[sub.name];
                            if (!summary.has(sub.name)) {
                                summary.set(sub.name, { id: sub.name, name: sub.displayName || sub.name, unit: sub.stockUnit, needed: 0, missing: 0, currentStock: current, ghsWarnings: invItem?.ghsWarnings || [] });
                            }
                            summary.get(sub.name).needed += sub.totalNeed;
                        }
                    }
                    else {
                        const current = ledger[item.name] || 0;
                        const remaining = current - item.stockNeed;
                        ledger[item.name] = remaining;
                        const invItem = this.state.inventoryMap()[item.name];
                        if (!summary.has(item.name)) {
                            summary.set(item.name, { id: item.name, name: item.displayName || item.name, unit: item.stockUnit, needed: 0, missing: 0, currentStock: current, ghsWarnings: invItem?.ghsWarnings || [] });
                        }
                        summary.get(item.name).needed += item.stockNeed;
                    }
                }
            }
            const result = [];
            summary.forEach((val, key) => {
                const finalBalance = ledger[key];
                if (finalBalance < 0) {
                    val.missing = Math.abs(finalBalance);
                    val.isMissing = true;
                }
                else {
                    val.isMissing = false;
                }
                result.push(val);
            });
            return result.sort((a, b) => {
                if (a.isMissing && !b.isMissing)
                    return -1;
                if (!a.isMissing && b.isMissing)
                    return 1;
                return a.name.localeCompare(b.name);
            });
        });
        this.aggregateGHSWarnings = computed(() => {
            const summary = this.totalStockSummary();
            const warnings = new Set();
            summary.forEach(item => {
                if (item.ghsWarnings) {
                    item.ghsWarnings.forEach((w) => warnings.add(w));
                }
            });
            return Array.from(warnings).sort();
        });
        // --- COMPUTED: COVERAGE STATUS BAR (Global Safety Net) ---
        this.coverageMetrics = computed(() => {
            // 1. Calculate Needs from Blocks (Input)
            const neededTasks = new Set(); // "Sample|TargetID"
            const sampleNames = {}; // Helper for displaying names if sample ID is obscure (not used here but good practice)
            this.blocks().forEach(block => {
                const samples = this.getBlockSamples(block);
                samples.forEach(s => {
                    block.selectedTargets.forEach(tId => {
                        const key = buildAnalysisTaskKey(s, tId);
                        if (!this.excludedTaskKeys().has(key))
                            neededTasks.add(key);
                    });
                });
            });
            // 2. Calculate Coverage from Batches (Output)
            const coveredTasks = new Set();
            const duplicateTasks = new Set();
            let dupCount = 0;
            this.batches().forEach(batch => {
                // Use tasks directly if available (Task-Based)
                if (batch.tasks && batch.tasks.length > 0) {
                    batch.tasks.forEach(t => {
                        if (!t.covered)
                            return;
                        const key = buildAnalysisTaskKey(t.sample, t.targetId);
                        if (coveredTasks.has(key)) {
                            duplicateTasks.add(key);
                            dupCount++;
                        }
                        coveredTasks.add(key);
                    });
                }
                else {
                    // Fallback for legacy structure (should not happen with new logic)
                    const targetIds = batch.targets.map(t => t.id);
                    batch.samples.forEach(s => {
                        targetIds.forEach(tId => {
                            const key = buildAnalysisTaskKey(s, tId);
                            if (coveredTasks.has(key)) {
                                duplicateTasks.add(key);
                                dupCount++;
                            }
                            coveredTasks.add(key);
                        });
                    });
                }
            });
            // 3. Diff
            const missingTasks = [];
            const missingSamples = new Set();
            neededTasks.forEach(key => {
                if (!coveredTasks.has(key)) {
                    missingTasks.push(key);
                    const s = key.split('|')[0];
                    missingSamples.add(s);
                }
            });
            // 4. Return Report
            return {
                isFullyCovered: missingTasks.length === 0,
                missingCount: missingTasks.length,
                duplicateCount: dupCount,
                missingSampleNames: Array.from(missingSamples).slice(0, 3).join(', ') + (missingSamples.size > 3 ? '...' : '')
            };
        });
        // --- COMPUTED: SPLIT WIZARD LOGIC ---
        this.filteredSopsForSplit = computed(() => {
            const s = this.splitState();
            // Only active in Step 3
            if (s.step !== 3)
                return [];
            const allSops = this.state.sops().filter(sop => !sop.isArchived);
            const reqTargets = s.selectedTargets;
            if (reqTargets.size === 0)
                return []; // Should not happen due to validation
            // Filter Logic: Reuse buildSopSuggestion for consistency
            const inventory = this.state.inventoryMap();
            const allTargets = this.allAvailableTargets();
            return allSops.filter(sop => {
                const reqIdsArray = Array.from(reqTargets);
                // Matrix type is undefined here since split wizard doesn't care about matrix constraint initially, 
                // or we assume the source block's matrix? Actually split wizard doesn't have matrixType.
                const sug = this.buildSopSuggestion(sop, reqIdsArray, allTargets, inventory, undefined);
                return sug && !sug.isPartial; // Must cover 100% of the selected targets
            });
        });
        effect(() => {
            const activeIds = new Set(this.activeSops().map(s => s.id));
            if (this.singleForcedSopId() && !activeIds.has(this.singleForcedSopId())) {
                this.singleForcedSopId.set(undefined);
            }
            let changed = false;
            const updatedBlocks = this.blocks().map(b => {
                if (b.forcedSopId && !activeIds.has(b.forcedSopId)) {
                    changed = true;
                    return { ...b, forcedSopId: undefined };
                }
                return b;
            });
            if (changed) {
                this.blocks.set(updatedBlocks);
            }
        });
    }
    buildSopSuggestion(sop, reqTargetIds, allTargets, inventory, matrixType) {
        if (!sop.targets || sop.targets.length === 0)
            return null;
        // Matrix Filter
        const sopMatrices = sop.matrixTags || [];
        if (sopMatrices.length > 0 && matrixType && !sopMatrices.includes(matrixType)) {
            return null; // doesn't match matrix
        }
        const sopTargetIds = new Set(sop.targets.map(t => getCanonicalId(t.name)));
        const covered = [];
        const missing = [];
        reqTargetIds.forEach(reqId => {
            const foundName = allTargets.find(t => t.uniqueKey === reqId)?.name || reqId;
            if (sopTargetIds.has(reqId)) {
                covered.push({ id: reqId, name: foundName });
            }
            else {
                missing.push({ id: reqId, name: foundName });
            }
        });
        if (covered.length === 0)
            return null; // No overlap
        const extra = [];
        sop.targets.forEach(t => {
            const id = getCanonicalId(t.name);
            if (!reqTargetIds.includes(id)) {
                extra.push({ id, name: t.name });
            }
        });
        // Check stock
        let isMissingStock = false;
        if (sop.consumables) {
            for (const c of sop.consumables) {
                if (c.type === 'simple') {
                    const stockItem = inventory[c.name];
                    if (!stockItem || stockItem.stock <= 0) {
                        isMissingStock = true;
                        break;
                    }
                }
            }
        }
        const ratio = covered.length / sop.targets.length; // high ratio means less waste
        return {
            sop,
            coverageCount: covered.length,
            totalRequired: reqTargetIds.length,
            coverageRatio: ratio,
            coveredTargets: covered,
            missingTargets: missing,
            extraTargets: extra,
            isMissingStock,
            isBest: false,
            isPartial: missing.length > 0
        };
    }
    // --- METHODS ---
    getFullSampleString(samples) {
        return Array.from(samples).sort().join(', ');
    }
    getBatchDescriptionText(batch) {
        return formatSampleDescriptions(batch.samples, batch.sampleDescriptionMap);
    }
    getBlockSamples(block) {
        const cached = this.blockSamplesCache.get(block.id);
        if (cached && cached.rawSamples === block.rawSamples)
            return cached.samples;
        const samples = parseUniqueSampleCodes(block.rawSamples);
        this.blockSamplesCache.set(block.id, { rawSamples: block.rawSamples, samples });
        return samples;
    }
    getBlockSampleDescription(block, sampleCode) {
        return getSampleDescriptionSnapshot(block.sampleDescriptionMap, sampleCode)?.nameSnapshot || '';
    }
    getBlockDescriptionCount(block) {
        const cached = this.blockDescriptionCountCache.get(block.id);
        if (cached
            && cached.rawSamples === block.rawSamples
            && cached.sampleDescriptionMap === block.sampleDescriptionMap) {
            return cached.count;
        }
        const count = this.getBlockSamples(block)
            .filter(sample => Boolean(getSampleDescriptionSnapshot(block.sampleDescriptionMap, sample)))
            .length;
        this.blockDescriptionCountCache.set(block.id, {
            rawSamples: block.rawSamples,
            sampleDescriptionMap: block.sampleDescriptionMap,
            count
        });
        return count;
    }
    updateBlockSampleDescription(index, sampleCode, value) {
        const snapshot = this.resolveDescriptionSnapshot(value);
        this.blocks.update(blocks => {
            const next = [...blocks];
            const block = next[index];
            next[index] = {
                ...block,
                sampleDescriptionMap: setSampleDescriptionSnapshot(block.sampleDescriptionMap, sampleCode, snapshot)
            };
            return next;
        });
    }
    applyDescriptionToAll(index, sourceSampleCode) {
        this.blocks.update(blocks => {
            const next = [...blocks];
            const block = next[index];
            const snapshot = getSampleDescriptionSnapshot(block.sampleDescriptionMap, sourceSampleCode);
            let newMap = block.sampleDescriptionMap;
            for (const sample of this.getBlockSamples(block)) {
                if (sample !== sourceSampleCode) {
                    newMap = setSampleDescriptionSnapshot(newMap, sample, snapshot);
                }
            }
            next[index] = {
                ...block,
                sampleDescriptionMap: newMap
            };
            return next;
        });
    }
    updateSingleSampleDescription(value) {
        this.singleSampleDescription.set(this.resolveDescriptionSnapshot(value));
    }
    singleSampleDescriptionName() {
        return this.singleSampleDescription()?.nameSnapshot || '';
    }
    createEmptyBlock(name = 'Nhóm mẫu 1', matrixType) {
        return {
            id: Date.now(),
            name,
            rawSamples: '',
            selectedTargets: new Set(),
            targetSearch: '',
            isCollapsed: false,
            forcedSopId: undefined,
            matrixType,
            sampleDescriptionMap: {}
        };
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
    buildDescriptionMapForSamples(samples) {
        const result = {};
        Array.from(samples).forEach(sample => {
            for (const block of this.blocks()) {
                const snapshot = getSampleDescriptionSnapshot(block.sampleDescriptionMap, sample);
                if (snapshot) {
                    result[sample] = snapshot;
                    break;
                }
            }
        });
        return result;
    }
    findDescriptionConflict() {
        const descriptions = new Map();
        this.blocks().forEach(block => this.getBlockSamples(block).forEach(sample => {
            const snapshot = getSampleDescriptionSnapshot(block.sampleDescriptionMap, sample);
            if (!snapshot)
                return;
            const key = normalizeSampleCode(sample);
            const current = descriptions.get(key) || { sample, names: new Set() };
            current.names.add(normalizeDescription(snapshot.nameSnapshot));
            descriptions.set(key, current);
        }));
        const conflict = Array.from(descriptions.values()).find(item => item.names.size > 1);
        return conflict?.sample || null;
    }
    // ... Block management helpers ...
    addBlock() {
        const defaultMatrix = this.availableMatrices().find(m => m.isDefault);
        this.blocks.update(b => [...b, this.createEmptyBlock(`Nhóm mẫu #${b.length + 1}`, defaultMatrix?.id)]);
    }
    removeBlock(index) { this.blocks.update(b => b.filter((_, i) => i !== index)); }
    duplicateBlock(index) {
        const src = this.blocks()[index];
        const newBlock = {
            ...src,
            id: Date.now(),
            name: src.name + ' (bản sao)',
            selectedTargets: new Set(src.selectedTargets),
            sampleDescriptionMap: { ...src.sampleDescriptionMap }
        };
        this.blocks.update(b => { const n = [...b]; n.splice(index + 1, 0, newBlock); return n; });
    }
    toggleBlockCollapse(index) {
        this.blocks.update(b => { const n = [...b]; n[index] = { ...n[index], isCollapsed: !n[index].isCollapsed }; return n; });
    }
    updateBlockName(index, val) { this.blocks.update(b => { const n = [...b]; n[index] = { ...n[index], name: val }; return n; }); }
    updateBlockSamples(index, val) {
        this.blocks.update(blocks => {
            const next = [...blocks];
            next[index] = {
                ...next[index],
                rawSamples: val,
                sampleDescriptionMap: subsetSampleDescriptionMap(next[index].sampleDescriptionMap, val.split('\n').map(sample => sample.trim()).filter(Boolean))
            };
            return next;
        });
    }
    updateBlockSearch(index, val) { this.blocks.update(b => { const n = [...b]; n[index] = { ...n[index], targetSearch: val }; return n; }); }
    updateBlockForcedSop(index, sopId) {
        this.blocks.update(b => {
            const n = [...b];
            n[index] = { ...n[index], forcedSopId: sopId };
            return n;
        });
    }
    updateBlockMatrix(index, val) {
        this.blocks.update(b => {
            const n = [...b];
            n[index] = { ...n[index], matrixType: val || undefined };
            return n;
        });
    }
    getMatrixLabel(id) {
        if (!id)
            return '';
        return this.matrixById().get(id)?.name || id;
    }
    getMatrixColor(id) {
        if (!id)
            return '#94a3b8';
        return this.matrixById().get(id)?.color || '#94a3b8';
    }
    // --- PREVIEW PANEL METHODS ---
    openSopPreview(blockIndex, suggestion) {
        this.previewSop.set({ blockIndex, suggestion });
    }
    closeSopPreview() {
        this.previewSop.set(null);
    }
    assignSopFromPreview() {
        const data = this.previewSop();
        if (data) {
            if (data.blockIndex === -1) {
                this.singleForcedSopId.set(data.suggestion.sop.id);
            }
            else {
                this.updateBlockForcedSop(data.blockIndex, data.suggestion.sop.id);
            }
            this.closeSopPreview();
        }
    }
    countSamples(raw) { return parseUniqueSampleCodes(raw).length; }
    // getFilteredTargets method removed as it's replaced by filteredTargetsMap
    toggleBlockTarget(index, targetId) {
        this.blocks.update(b => {
            const n = [...b];
            const set = new Set(n[index].selectedTargets);
            if (set.has(targetId))
                set.delete(targetId);
            else
                set.add(targetId);
            n[index] = { ...n[index], selectedTargets: set, forcedSopId: undefined, sourceGroupId: undefined, sourceGroupModified: true }; // Reset provenance on manual change
            return n;
        });
    }
    selectAllTargets(index) {
        this.blocks.update(b => {
            const n = [...b];
            const filtered = this.filteredTargetsMap().get(n[index].id) || [];
            const set = new Set(n[index].selectedTargets);
            filtered.forEach(t => set.add(t.uniqueKey));
            n[index] = { ...n[index], selectedTargets: set, forcedSopId: undefined, sourceGroupId: undefined, sourceGroupModified: true };
            return n;
        });
    }
    deselectAllTargets(index) {
        this.blocks.update(b => { const n = [...b]; n[index] = { ...n[index], selectedTargets: new Set(), forcedSopId: undefined, sourceGroupId: undefined, sourceGroupModified: true }; return n; });
    }
    // getFilteredSingleTargets method removed as it's replaced by singleFilteredTargets signal
    toggleSingleTarget(targetId) {
        this.singleSourceGroupId.set(null);
        this.singleSelectedTargets.update(set => {
            const next = new Set(set);
            if (next.has(targetId))
                next.delete(targetId);
            else
                next.add(targetId);
            return next;
        });
    }
    selectAllSingleTargets() {
        this.singleSourceGroupId.set(null);
        const filtered = this.singleFilteredTargets();
        this.singleSelectedTargets.update(set => {
            const next = new Set(set);
            filtered.forEach(t => next.add(t.uniqueKey));
            return next;
        });
    }
    deselectAllSingleTargets() {
        this.singleSelectedTargets.set(new Set());
        this.singleSourceGroupId.set(null);
    }
    openSingleTargetGroupModal() {
        this.currentBlockIndexForGroupImport.set(-2); // Special value for single sample mode
        if (this.availableGroups().length === 0) {
            this.targetService.getAllGroups().then(groups => this.availableGroups.set(groups));
        }
        this.showGroupModal.set(true);
    }
    selectMode(mode) {
        this.smartBatchMode.set(mode);
        this.step.set(1);
        void this.ensureSetupDataLoaded();
    }
    openSopCalculator() {
        this.router.navigate(['/calculator']);
    }
    goBackToStep0() {
        this.step.set(0);
    }
    ensureSetupDataLoaded() {
        if (this.setupDataLoadPromise)
            return this.setupDataLoadPromise;
        this.setupDataLoadPromise = Promise.all([
            this.matrixTypeService.getAll().then(m => {
                this.availableMatrices.set(m);
                const defaultMatrix = m.find(x => x.isDefault);
                if (defaultMatrix && this.blocks().length === 1 && !this.blocks()[0].matrixType) {
                    this.updateBlockMatrix(0, defaultMatrix.id);
                }
            }),
            this.masterDeviceService.getAll().then(d => this.availableDevices.set(d)),
            this.sampleDescriptionMasterService.getActive()
                .then(items => this.availableSampleDescriptions.set(items))
                .catch(() => this.toast.show('Không thể tải gợi ý mô tả mẫu; vẫn có thể nhập tự do.', 'info'))
        ]).then(() => undefined);
        return this.setupDataLoadPromise;
    }
    // --- GROUP MODAL ---
    async openGroupModal(blockIndex) {
        this.currentBlockIndexForGroupImport.set(blockIndex);
        if (this.availableGroups().length === 0) {
            try {
                const groups = await this.targetService.getAllGroups();
                this.availableGroups.set(groups);
            }
            catch (e) { }
        }
        this.showGroupModal.set(true);
    }
    importGroup(g) {
        const idx = this.currentBlockIndexForGroupImport();
        if (idx === -2) {
            this.singleSelectedTargets.update(set => {
                const hadTargets = set.size > 0;
                const next = new Set(set);
                g.targets.forEach(t => next.add(t.id));
                this.singleSourceGroupId.set(!hadTargets
                    && computeTargetSignature([...next]) === computeTargetSignature(g.targets.map(target => target.id))
                    ? g.id
                    : null);
                return next;
            });
            this.toast.show(`Đã thêm ${g.targets.length} chỉ tiêu cho mẫu.`, 'success');
        }
        else if (idx >= 0) {
            this.blocks.update(b => {
                const n = [...b];
                const hadTargets = n[idx].selectedTargets.size > 0;
                const set = new Set(n[idx].selectedTargets);
                g.targets.forEach(t => set.add(t.id));
                const exactGroup = !hadTargets
                    && computeTargetSignature([...set]) === computeTargetSignature(g.targets.map(target => target.id));
                n[idx] = {
                    ...n[idx],
                    selectedTargets: set,
                    forcedSopId: undefined,
                    sourceGroupId: exactGroup ? g.id : undefined,
                    sourceGroupModified: hadTargets
                };
                return n;
            });
            this.toast.show(`Đã thêm ${g.targets.length} chỉ tiêu.`, 'success');
        }
        this.showGroupModal.set(false);
    }
    // --- REWRITTEN: TARGET-CENTRIC GREEDY ALGORITHM (WEIGHTED) ---
    async analyzePlan() {
        if (this.smartBatchMode() === 'single') {
            const sample = this.singleSampleCode().trim();
            if (!sample) {
                this.toast.show('Vui lòng nhập Mã mẫu duy nhất.', 'error');
                return;
            }
            if (this.singleSelectedTargets().size === 0) {
                this.toast.show('Vui lòng chọn ít nhất 1 chỉ tiêu kiểm nghiệm.', 'error');
                return;
            }
            // Construct single mock block
            const mockBlock = {
                id: Date.now(),
                name: `Mẫu ${sample}`,
                rawSamples: sample,
                selectedTargets: new Set(this.singleSelectedTargets()),
                targetSearch: '',
                isCollapsed: false,
                forcedSopId: this.singleForcedSopId(),
                matrixType: this.singleMatrixType(),
                sourceGroupId: this.singleSourceGroupId() || undefined,
                sampleDescriptionMap: this.singleSampleDescription()
                    ? { [sample]: this.singleSampleDescription() }
                    : {}
            };
            this.blocks.set([mockBlock]);
        }
        const descriptionConflict = this.findDescriptionConflict();
        if (descriptionConflict) {
            this.toast.show(`Mã mẫu “${descriptionConflict}” đang có mô tả không thống nhất giữa các nhóm mẫu.`, 'error');
            return;
        }
        this.excludedTaskKeys.set(new Set());
        this.isProcessing.set(true);
        try {
            // 1. Prefetch Data
            const [inv, recipes] = await Promise.all([
                this.invService.getAllInventory(),
                this.recipeService.getAllRecipes()
            ]);
            this.inventoryCache = {};
            inv.forEach(i => this.inventoryCache[i.id] = i);
            this.recipeCache = {};
            recipes.forEach(r => this.recipeCache[r.id] = r);
            const batches = [];
            const sops = this.state.sops().filter(s => !s.isArchived);
            // 2. Flatten and de-duplicate the request before planning.
            const pendingTasks = new Map();
            const forcedAssignments = new Map();
            const taskMatrices = new Map();
            const planningLedger = {};
            inv.forEach(item => planningLedger[item.id] = item.stock);
            const registerMatrix = (key, matrixType) => {
                const matrixKey = matrixType || '';
                const existing = taskMatrices.get(key);
                if (existing && matrixKey && existing !== matrixKey) {
                    throw new Error(`Cùng một mẫu/chỉ tiêu đang được khai báo với hai nền mẫu khác nhau (${existing} và ${matrixKey}).`);
                }
                if (!existing || matrixKey)
                    taskMatrices.set(key, matrixKey);
            };
            for (const block of this.blocks()) {
                const samples = this.getBlockSamples(block);
                if (samples.length === 0 || block.selectedTargets.size === 0)
                    continue;
                const forcedSop = block.forcedSopId
                    ? sops.find(sop => sop.id === block.forcedSopId)
                    : undefined;
                if (forcedSop && !isSopMatrixCompatible(forcedSop, block.matrixType)) {
                    throw new Error(`SOP “${forcedSop.name}” không tương thích với nền mẫu “${this.getMatrixLabel(block.matrixType)}”.`);
                }
                const supportedForcedTasks = [];
                for (const sample of samples) {
                    for (const rawTargetId of block.selectedTargets) {
                        const targetId = getCanonicalId(rawTargetId);
                        const foundTarget = resolveTargetMasterInfo(targetId, this.allAvailableTargets());
                        const task = {
                            sample,
                            targetId,
                            targetName: foundTarget?.name || rawTargetId,
                            covered: false,
                            matrixType: block.matrixType,
                            sourceGroupId: block.sourceGroupId
                        };
                        const key = buildAnalysisTaskKey(sample, targetId);
                        registerMatrix(key, block.matrixType);
                        if (forcedSop && forcedSop.targets?.some(target => getSopTargetKey(target) === targetId)) {
                            const existingForcedSop = forcedAssignments.get(key);
                            if (existingForcedSop && existingForcedSop !== forcedSop.id) {
                                throw new Error(`Mẫu “${sample}” / chỉ tiêu “${task.targetName}” bị chỉ định cho nhiều SOP khác nhau.`);
                            }
                            if (!existingForcedSop) {
                                forcedAssignments.set(key, forcedSop.id);
                                pendingTasks.delete(key);
                                supportedForcedTasks.push({ ...task, covered: true });
                            }
                        }
                        else if (!forcedAssignments.has(key)) {
                            const existingTask = pendingTasks.get(key);
                            if (!existingTask) {
                                pendingTasks.set(key, task);
                            }
                            else if (!existingTask.matrixType && task.matrixType) {
                                pendingTasks.set(key, { ...existingTask, matrixType: task.matrixType });
                            }
                        }
                    }
                }
                if (forcedSop && supportedForcedTasks.length > 0) {
                    const blockSamples = new Set(supportedForcedTasks.map(task => task.sample));
                    const blockTargetIds = new Set(supportedForcedTasks.map(task => task.targetId));
                    const batchTargets = (forcedSop.targets || []).filter(target => blockTargetIds.has(getSopTargetKey(target)));
                    const inputs = this.buildDefaultBatchInputs(forcedSop, blockSamples.size);
                    const needs = this.calculator.calculateSopNeeds(forcedSop, inputs, -1, this.inventoryCache, this.recipeCache, this.state.safetyConfig());
                    applyNeedsToStockLedger(needs, planningLedger);
                    const tags = ['Forced-SOP'];
                    if (block.matrixType)
                        tags.push(this.getMatrixLabel(block.matrixType));
                    batches.push({
                        id: `batch_${Date.now()}_${batches.length}`,
                        name: forcedSop.name + ' (Chỉ định)',
                        sop: forcedSop,
                        targets: batchTargets,
                        samples: blockSamples,
                        sampleCount: blockSamples.size,
                        tasks: supportedForcedTasks,
                        inputValues: inputs,
                        safetyMargin: -1,
                        resourceImpact: needs,
                        status: 'ready',
                        tags,
                        isExpanded: false,
                        sampleDescriptionMap: this.buildDescriptionMapForSamples(blockSamples)
                    });
                }
            }
            // 3. Greedy loop with deterministic scoring and quantity-aware stock penalty.
            let remainingTasks = Array.from(pendingTasks.values());
            let iterationCount = 0;
            const sopsForAuto = sops.filter(sop => !sop.isManualOnly);
            const maxIterations = Math.max(1, Math.min(remainingTasks.length, sopsForAuto.length + 1));
            while (remainingTasks.length > 0 && iterationCount < maxIterations) {
                iterationCount++;
                const candidates = sopsForAuto.map(sop => {
                    if (!sop.targets || sop.targets.length === 0)
                        return null;
                    const sopTargetIds = new Set(sop.targets.map(getSopTargetKey));
                    const coverableTasks = remainingTasks.filter(task => sopTargetIds.has(task.targetId) && isSopMatrixCompatible(sop, task.matrixType));
                    if (coverableTasks.length === 0)
                        return null;
                    let score = coverableTasks.length * 10;
                    const involvedSamples = new Set(coverableTasks.map(task => normalizeSampleCode(task.sample)));
                    involvedSamples.forEach(sampleKey => {
                        const tasksForSample = remainingTasks.filter(task => normalizeSampleCode(task.sample) === sampleKey);
                        const coveredForSample = coverableTasks.filter(task => normalizeSampleCode(task.sample) === sampleKey);
                        if (tasksForSample.length === coveredForSample.length)
                            score += 5;
                    });
                    const uniqueCovered = new Set(coverableTasks.map(task => task.targetId)).size;
                    score += (uniqueCovered / sop.targets.length) * 30;
                    score -= (sop.targets.length - uniqueCovered);
                    const sampleCount = new Set(coverableTasks.map(task => normalizeSampleCode(task.sample))).size;
                    const inputs = this.buildDefaultBatchInputs(sop, sampleCount);
                    const needs = this.calculator.calculateSopNeeds(sop, inputs, -1, this.inventoryCache, this.recipeCache, this.state.safetyConfig());
                    const unavailableCount = countUnavailableStockItems(needs, planningLedger);
                    const validationCount = validateCalculatedItems(needs, -1).length;
                    score -= unavailableCount * 100;
                    score -= validationCount * 1000;
                    return { sop, coverableTasks, score, inputs, needs };
                }).filter((candidate) => candidate !== null);
                if (candidates.length === 0)
                    break;
                candidates.sort((a, b) => b.score - a.score
                    || a.sop.name.localeCompare(b.sop.name)
                    || a.sop.id.localeCompare(b.sop.id));
                const bestFit = candidates[0];
                const coveredTasks = bestFit.coverableTasks.map(task => ({ ...task, covered: true }));
                const batchSamples = new Set(coveredTasks.map(task => task.sample));
                const batchTargetIds = new Set(coveredTasks.map(task => task.targetId));
                const batchTargets = (bestFit.sop.targets || []).filter(target => batchTargetIds.has(getSopTargetKey(target)));
                applyNeedsToStockLedger(bestFit.needs, planningLedger);
                const tags = ['Đã tối ưu tự động'];
                const matrixTypes = new Set(coveredTasks.map(task => task.matrixType).filter((matrix) => Boolean(matrix)));
                matrixTypes.forEach(matrix => tags.push(this.getMatrixLabel(matrix)));
                batches.push({
                    id: `batch_${Date.now()}_${batches.length}`,
                    name: bestFit.sop.name,
                    sop: bestFit.sop,
                    targets: batchTargets,
                    samples: batchSamples,
                    sampleCount: batchSamples.size,
                    tasks: coveredTasks,
                    inputValues: bestFit.inputs,
                    safetyMargin: -1,
                    resourceImpact: bestFit.needs,
                    status: 'ready',
                    tags,
                    isExpanded: false,
                    sampleDescriptionMap: this.buildDescriptionMapForSamples(batchSamples)
                });
                const coveredKeys = new Set(coveredTasks.map(task => buildAnalysisTaskKey(task.sample, task.targetId)));
                remainingTasks = remainingTasks.filter(task => !coveredKeys.has(buildAnalysisTaskKey(task.sample, task.targetId)));
            }
            this.batches.set(batches);
            this.unmappedTasks.set(remainingTasks);
            this.validateGlobalStock();
            this.step.set(2);
        }
        catch (e) {
            this.toast.show('Lỗi phân tích: ' + e.message, 'error');
            console.error(e);
        }
        finally {
            this.isProcessing.set(false);
        }
    }
    matchesSearch(batch) {
        if (!this.sampleSearchTerm())
            return false;
        const term = this.sampleSearchTerm().toLowerCase();
        for (const s of Array.from(batch.samples)) {
            if (s.toLowerCase().includes(term))
                return true;
        }
        return false;
    }
    // --- BATCH MODIFICATION ---
    setBatchMarginManual(index) { this.updateBatchMargin(index, 10); }
    updateBatchMargin(index, val) {
        this.batches.update(current => {
            const next = [...current];
            let finalVal = Number(val);
            if (isNaN(finalVal))
                finalVal = 0;
            const batch = { ...next[index], safetyMargin: finalVal };
            batch.resourceImpact = this.calculator.calculateSopNeeds(batch.sop, batch.inputValues, batch.safetyMargin, this.inventoryCache, this.recipeCache, this.state.safetyConfig());
            next[index] = batch;
            return next;
        });
        this.validateGlobalStock();
    }
    updateBatchInput(index, key, val) {
        this.batches.update(current => {
            const next = [...current];
            const batch = { ...next[index] };
            batch.inputValues = { ...batch.inputValues, [key]: val };
            batch.resourceImpact = this.calculator.calculateSopNeeds(batch.sop, batch.inputValues, batch.safetyMargin, this.inventoryCache, this.recipeCache, this.state.safetyConfig());
            next[index] = batch;
            return next;
        });
        this.validateGlobalStock();
    }
    getLocalTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    buildDefaultBatchInputs(sop, sampleCount) {
        const inputs = { analysisDate: this.getLocalTodayDate() };
        sop.inputs.forEach(input => inputs[input.var] = input.default);
        inputs['analysisDate'] ||= this.getLocalTodayDate();
        inputs['n_sample'] = sampleCount;
        if (sop.device)
            inputs['device'] = sop.device;
        return inputs;
    }
    isValidAnalysisDate(value) {
        if (typeof value !== 'string')
            return false;
        const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
        if (!match)
            return false;
        const year = Number(match[1]);
        const month = Number(match[2]);
        const day = Number(match[3]);
        const candidate = new Date(year, month - 1, day);
        return candidate.getFullYear() === year
            && candidate.getMonth() === month - 1
            && candidate.getDate() === day;
    }
    hasInvalidAnalysisDates() {
        return this.batches().some(batch => !this.isValidAnalysisDate(batch.inputValues['analysisDate']));
    }
    toggleBatchDetails(index) {
        this.batches.update(current => {
            const next = [...current];
            next[index] = { ...next[index], isExpanded: !next[index].isExpanded };
            return next;
        });
    }
    // Helpers for summary view
    getMissingCount(batch) {
        let count = 0;
        batch.resourceImpact.forEach(item => {
            if (item.isComposite) {
                item.breakdown.forEach(sub => { if (sub.isMissing)
                    count++; });
            }
            else {
                if (item.isMissing)
                    count++;
            }
        });
        return count;
    }
    countTotalItems(batch) {
        let count = 0;
        batch.resourceImpact.forEach(item => {
            if (item.isComposite)
                count += item.breakdown.length;
            else
                count++;
        });
        return count;
    }
    validateGlobalStock() {
        const ledger = {};
        Object.entries(this.inventoryCache).forEach(([k, v]) => ledger[k] = v.stock);
        this.batches.update(current => {
            return current.map(batch => {
                const needs = batch.resourceImpact;
                let isMissing = false;
                // We need to map over needs and update isMissing flags on a deep copy or in place if mutable
                // Since signals update is immutable, we map and return new structure if changes
                const updatedNeeds = needs.map(item => {
                    const newItem = { ...item };
                    if (newItem.isComposite) {
                        const newBreakdown = newItem.breakdown.map(sub => {
                            const available = ledger[sub.name] || 0;
                            const subMissing = available < sub.totalNeed;
                            if (subMissing)
                                isMissing = true;
                            if (ledger[sub.name] !== undefined)
                                ledger[sub.name] -= sub.totalNeed;
                            return { ...sub, isMissing: subMissing };
                        });
                        newItem.breakdown = newBreakdown;
                    }
                    else {
                        const available = ledger[newItem.name] || 0;
                        const itemMissing = available < newItem.stockNeed;
                        if (itemMissing)
                            isMissing = true;
                        if (ledger[newItem.name] !== undefined)
                            ledger[newItem.name] -= newItem.stockNeed;
                        newItem.isMissing = itemMissing;
                    }
                    return newItem;
                });
                // Auto-expand if critical error, otherwise respect user choice or default
                const newStatus = isMissing ? 'missing_stock' : 'ready';
                const shouldExpand = isMissing ? true : (batch.isExpanded || false);
                return { ...batch, resourceImpact: updatedNeeds, status: newStatus, isExpanded: shouldExpand };
            });
        });
    }
    // --- SPLIT WIZARD LOGIC ---
    openSplitModal(batchIndex) {
        const batch = this.batches()[batchIndex];
        this.splitState.set({
            ...this.splitState(),
            sourceBatchIndex: batchIndex,
            sourceBatchName: batch.name,
        });
        this.showSplitModal.set(true);
    }
    executeSplitFromWizard(event) {
        this.splitState.update(s => ({
            ...s,
            selectedSamples: event.samples,
            selectedTargets: event.targets,
            selectedSopId: event.sopId
        }));
        this.executeSplit();
    }
    // Helper to re-generate batch metadata from a list of tasks
    recalculateBatchMetadata(tasks, sop, originalBatch) {
        const uniqueSamples = new Set(tasks.map(t => t.sample));
        const uniqueTargetIds = new Set(tasks.map(t => t.targetId));
        // Use originalBatch.targets instead of sop.targets so manually removed targets don't come back
        const batchTargets = (originalBatch.targets || []).filter(t => uniqueTargetIds.has(getCanonicalId(t.name)));
        const newInputs = { ...originalBatch.inputValues };
        // Try to reset n_sample based on new size, but keep other manual inputs
        newInputs['n_sample'] = uniqueSamples.size;
        // Recalculate resource impact using calculator service
        // Note: We need inventory/recipe cache which should be available
        const needs = this.calculator.calculateSopNeeds(sop, newInputs, originalBatch.safetyMargin, this.inventoryCache, this.recipeCache, this.state.safetyConfig());
        return {
            samples: uniqueSamples,
            sampleCount: uniqueSamples.size,
            targets: batchTargets,
            tasks: tasks,
            inputValues: newInputs,
            resourceImpact: needs,
            sampleDescriptionMap: subsetSampleDescriptionMap(originalBatch.sampleDescriptionMap, uniqueSamples)
        };
    }
    // Execute
    async executeSplit() {
        const state = this.splitState();
        if (!state.selectedSopId)
            return;
        const sourceBatch = this.batches()[state.sourceBatchIndex];
        const targetSop = this.activeSops().find(s => s.id === state.selectedSopId);
        if (!targetSop)
            return;
        // 1. Identify TASKS to Move (Intersection of Selected Samples & Selected Targets)
        // Logic: Move specific AnalysisTasks. If Sample L01 is selected, and Target A is selected, move (L01, A).
        // Keep (L01, B) in old batch if B wasn't selected.
        const tasksToMove = [];
        const tasksToKeep = [];
        const selectedCanonicalIds = new Set(Array.from(state.selectedTargets).map(getCanonicalId));
        if (sourceBatch.tasks) {
            sourceBatch.tasks.forEach(t => {
                if (state.selectedSamples.has(t.sample) && selectedCanonicalIds.has(t.targetId)) {
                    tasksToMove.push(t);
                }
                else {
                    tasksToKeep.push(t);
                }
            });
        }
        else {
            // Fallback: Artificial task creation if source lacks them
            state.selectedSamples.forEach(s => {
                state.selectedTargets.forEach(tid => {
                    const tName = state.availableTargets.find(t => t.id === tid)?.name || tid;
                    tasksToMove.push({ sample: s, targetId: tid, targetName: tName, covered: true });
                });
            });
            // For legacy, we just clear the source if all samples moved, hard to reconstruct exact 'keep' without original tasks
            // Assuming source is valid Task-Based from now on.
        }
        if (tasksToMove.length === 0)
            return;
        if (tasksToMove.some(task => !isSopMatrixCompatible(targetSop, task.matrixType))) {
            this.toast.show('SOP đích không tương thích với nền mẫu của các task đã chọn.', 'error');
            return;
        }
        // 2. Create New Batch
        // Metadata calculation for new batch
        const uniqueSamplesNew = new Set(tasksToMove.map(t => t.sample));
        const uniqueTargetIdsNew = new Set(tasksToMove.map(t => t.targetId));
        const newBatchTargets = (targetSop.targets || []).filter(target => uniqueTargetIdsNew.has(getSopTargetKey(target)));
        if (newBatchTargets.length !== uniqueTargetIdsNew.size) {
            this.toast.show('SOP đích không phủ đầy đủ các chỉ tiêu đã chọn.', 'error');
            return;
        }
        const newInputs = {};
        targetSop.inputs.forEach(i => newInputs[i.var] = i.default);
        Object.keys(newInputs).forEach(k => {
            if (sourceBatch.inputValues[k] !== undefined)
                newInputs[k] = sourceBatch.inputValues[k];
        });
        newInputs['n_sample'] = uniqueSamplesNew.size;
        if (targetSop.device && !newInputs['device']) {
            newInputs['device'] = targetSop.device;
        }
        const newNeeds = this.calculator.calculateSopNeeds(targetSop, newInputs, sourceBatch.safetyMargin, this.inventoryCache, this.recipeCache, this.state.safetyConfig());
        const newBatch = {
            id: `batch_split_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            name: targetSop.name + ' (Tách)',
            sop: targetSop,
            targets: newBatchTargets,
            samples: uniqueSamplesNew,
            sampleCount: uniqueSamplesNew.size,
            tasks: tasksToMove.map(task => ({ ...task, covered: true })),
            inputValues: newInputs,
            safetyMargin: sourceBatch.safetyMargin,
            resourceImpact: newNeeds,
            status: 'ready',
            isExpanded: false,
            sampleDescriptionMap: subsetSampleDescriptionMap(sourceBatch.sampleDescriptionMap, uniqueSamplesNew)
        };
        // 3. Update Source Batch
        this.batches.update(current => {
            const next = [...current];
            if (tasksToKeep.length === 0) {
                // Source completely drained
                next.splice(state.sourceBatchIndex, 1);
            }
            else {
                // Recalculate source based on remaining tasks
                const updatedMeta = this.recalculateBatchMetadata(tasksToKeep, sourceBatch.sop, sourceBatch);
                next[state.sourceBatchIndex] = {
                    ...sourceBatch,
                    ...updatedMeta
                };
            }
            next.push(newBatch);
            return next;
        });
        this.validateGlobalStock();
        this.showSplitModal.set(false);
        this.toast.show('Đã tách mẻ thành công.', 'success');
    }
    // --- NEW: Remove Target From Batch directly ---
    removeTargetFromBatch(batchIndex, targetId) {
        const currentBatch = this.batches()[batchIndex];
        if (!currentBatch)
            return;
        const target = currentBatch.targets.find(item => item.id === targetId);
        const canonicalTargetId = target ? getSopTargetKey(target) : getCanonicalId(targetId);
        const removedTasks = currentBatch.tasks.filter(task => task.targetId === canonicalTargetId);
        this.excludedTaskKeys.update(current => {
            const next = new Set(current);
            removedTasks.forEach(task => next.add(buildAnalysisTaskKey(task.sample, task.targetId)));
            return next;
        });
        this.batches.update(current => {
            const next = [...current];
            const batch = next[batchIndex];
            if (!batch)
                return next;
            const tasksToKeep = batch.tasks.filter(task => task.targetId !== canonicalTargetId);
            if (tasksToKeep.length === 0) {
                next.splice(batchIndex, 1);
            }
            else {
                const updatedMeta = this.recalculateBatchMetadata(tasksToKeep, batch.sop, batch);
                next[batchIndex] = {
                    ...batch,
                    ...updatedMeta
                };
            }
            return next;
        });
        this.validateGlobalStock();
        this.toast.show(`Đã loại “${removedTasks[0]?.targetName || targetId}” khỏi kế hoạch hiện tại.`, 'info');
    }
    // --- QUICK IMPORT LOGIC ---
    async openQuickImport(item) {
        if (!this.auth.canEditInventory()) {
            this.toast.show('Bạn không có quyền sửa kho.', 'error');
            return;
        }
        this.isProcessing.set(true);
        try {
            // FIX: Determine correct Inventory ID
            // Summary Item: id=InventoryID, name=DisplayName
            // CalculatedItem: name=InventoryID, displayName=DisplayName
            // We use the ID if available, otherwise name.
            const targetId = item.id || item.name;
            // FETCH FRESH DATA directly from Firestore to ensure accuracy
            const freshItems = await this.invService.getItemsByIds([targetId]);
            const freshStock = freshItems.length > 0 ? freshItems[0].stock : 0;
            // Update the local cache with this fresh value immediately
            if (freshItems.length > 0) {
                this.inventoryCache[targetId] = freshItems[0];
            }
            // Calculate missing based on FRESH stock
            // If item comes from summary (has .missing), we can try to use it as a hint, 
            // or re-calculate total need.
            let missingAmount = 0;
            if (item.missing !== undefined) {
                // Re-calculate Total Need for this specific Item across all batches to be accurate against fresh stock
                let totalNeed = 0;
                for (const b of this.batches()) {
                    b.resourceImpact.forEach(ri => {
                        if (ri.isComposite) {
                            ri.breakdown.forEach(sub => { if (sub.name === targetId)
                                totalNeed += sub.totalNeed; });
                        }
                        else {
                            if (ri.name === targetId)
                                totalNeed += ri.stockNeed;
                        }
                    });
                }
                missingAmount = Math.max(0, totalNeed - freshStock);
            }
            else {
                // Single item context
                const needed = item.totalNeed || item.stockNeed || 0;
                missingAmount = Math.max(0, needed - freshStock);
            }
            this.quickImportState.set({
                id: targetId,
                name: item.displayName || item.name, // Display Name
                unit: item.stockUnit || item.unit,
                currentStock: freshStock,
                missingAmount: missingAmount
            });
            this.quickImportInput = 0;
            this.showQuickImport.set(true);
        }
        catch (e) {
            this.toast.show('Lỗi tải dữ liệu kho: ' + e.message, 'error');
        }
        finally {
            this.isProcessing.set(false);
        }
    }
    async submitQuickImport() {
        if (this.isProcessing())
            return;
        const state = this.quickImportState();
        const amount = this.quickImportInput;
        if (amount <= 0)
            return;
        this.isProcessing.set(true);
        try {
            // Use Base Unit directly as per requirement
            await this.invService.updateStock(state.id, state.currentStock, amount, 'Điều chỉnh tồn kho khi lập mẻ');
            const updatedItem = (await this.invService.getItemsByIds([state.id]))[0];
            if (updatedItem) {
                this.inventoryCache[state.id] = updatedItem;
                this.state.inventory.update(items => {
                    const index = items.findIndex(item => item.id === state.id);
                    if (index < 0)
                        return [...items, updatedItem];
                    const next = [...items];
                    next[index] = updatedItem;
                    return next;
                });
            }
            this.toast.show(`Đã nhập +${formatNum(amount)} ${state.unit}`, 'success');
            this.showQuickImport.set(false);
            // Re-validate Batches
            this.validateGlobalStock();
        }
        catch (e) {
            this.toast.show('Lỗi nhập kho: ' + e.message, 'error');
        }
        finally {
            this.isProcessing.set(false);
        }
    }
    // --- Auto-Fix Logic (Modal) ---
    fixCoverage() {
        const unmapped = this.unmappedTasks();
        if (unmapped.length === 0)
            return;
        const allSops = this.activeSops();
        const normalSops = allSops.filter(s => !s.isManualOnly);
        const manualSops = allSops.filter(s => s.isManualOnly);
        const group1 = [];
        const group2 = [];
        const group3 = [];
        // --- Gom theo (targetId, blockId, matrixType) ---
        const keyMap = new Map();
        for (const task of unmapped) {
            const block = this.blocks().find(b => {
                const samples = b.rawSamples.split('\n').map(s => s.trim()).filter(Boolean);
                // check if sample is in this block and target is selected
                return samples.includes(task.sample) && b.selectedTargets.has(task.targetId);
            });
            const blockId = block?.id ?? -1;
            const key = `${task.targetId}__${blockId}`;
            if (!keyMap.has(key)) {
                keyMap.set(key, { targetId: task.targetId, targetName: task.targetName, blockId, matrixType: task.matrixType, samples: [] });
            }
            keyMap.get(key).samples.push(task.sample);
        }
        // --- Phân loại từng nhóm ---
        for (const [, item] of keyMap) {
            const { targetId, targetName, blockId, matrixType, samples } = item;
            const normalSopsWithTarget = normalSops.filter(s => s.targets?.some(t => getCanonicalId(t.name) === targetId));
            const manualSopsWithTarget = manualSops.filter(s => s.targets?.some(t => getCanonicalId(t.name) === targetId));
            const compatibleNormalSops = normalSopsWithTarget.filter(sop => isSopMatrixCompatible(sop, matrixType));
            const compatibleManualSops = manualSopsWithTarget.filter(sop => isSopMatrixCompatible(sop, matrixType));
            if (normalSopsWithTarget.length === 0 && manualSopsWithTarget.length === 0) {
                // --- NHÓM 3: Không có SOP nào ---
                group3.push({ targetId, targetName, affectedSamples: samples, blockId, action: 'remove' });
            }
            else if (compatibleNormalSops.length === 0 && compatibleManualSops.length > 0) {
                // --- NHÓM 1: Chỉ có SOP Đặc thù ---
                const autoChosen = compatibleManualSops.length === 1 ? compatibleManualSops[0].id : null;
                group1.push({
                    targetId, targetName, affectedSamples: samples, blockId,
                    candidateSops: compatibleManualSops,
                    chosenSopId: autoChosen
                });
            }
            else {
                // --- NHÓM 2: Sai Matrix ---
                const compatibleSops = [...normalSopsWithTarget, ...manualSopsWithTarget].map(sop => ({
                    sop,
                    matrices: sop.matrixTags || []
                }));
                group2.push({
                    targetId, targetName, affectedSamples: samples, blockId,
                    currentMatrix: matrixType,
                    compatibleSops,
                    action: 'ignore_matrix'
                });
            }
        }
        this.fixCoverageState.set({
            isOpen: true,
            isProcessing: false,
            group1, group2, group3
        });
    }
    updateFixGroup1Sop(idx, sopId) {
        this.fixCoverageState.update(s => {
            const g1 = [...s.group1];
            g1[idx] = { ...g1[idx], chosenSopId: sopId };
            return { ...s, group1: g1 };
        });
    }
    updateFixGroup2Action(idx, action) {
        this.fixCoverageState.update(s => {
            const g2 = [...s.group2];
            g2[idx] = { ...g2[idx], action };
            return { ...s, group2: g2 };
        });
    }
    updateFixGroup3Action(idx, action) {
        this.fixCoverageState.update(s => {
            const g3 = [...s.group3];
            g3[idx] = { ...g3[idx], action };
            return { ...s, group3: g3 };
        });
    }
    removeTargetFromSourceBlock(blockId, targetId) {
        this.blocks.update(blocks => blocks
            .map(block => {
            if (block.id !== blockId)
                return block;
            const selectedTargets = new Set(block.selectedTargets);
            selectedTargets.delete(targetId);
            return {
                ...block,
                selectedTargets,
                forcedSopId: selectedTargets.size === 0 ? undefined : block.forcedSopId,
                sourceGroupId: undefined,
                sourceGroupModified: true
            };
        })
            .filter(block => block.selectedTargets.size > 0 || parseUniqueSampleCodes(block.rawSamples).length === 0));
    }
    moveTargetToDedicatedBlock(blockId, targetId, targetName, affectedSamples, options) {
        this.blocks.update(blocks => {
            const sourceIndex = blocks.findIndex(block => block.id === blockId);
            if (sourceIndex < 0)
                return blocks;
            const source = blocks[sourceIndex];
            if (source.selectedTargets.size === 1 && source.selectedTargets.has(targetId)) {
                const next = [...blocks];
                next[sourceIndex] = {
                    ...source,
                    forcedSopId: options.forcedSopId,
                    matrixType: options.clearMatrix ? undefined : source.matrixType,
                    sourceGroupId: undefined,
                    sourceGroupModified: true
                };
                return next;
            }
            const remainingTargets = new Set(source.selectedTargets);
            remainingTargets.delete(targetId);
            const dedicatedSamples = parseUniqueSampleCodes(affectedSamples.join('\n'));
            const dedicated = {
                ...this.createEmptyBlock(`${source.name} — ${targetName}`, options.clearMatrix ? undefined : source.matrixType),
                id: Date.now() + blocks.length + Math.floor(Math.random() * 1000),
                rawSamples: dedicatedSamples.join('\n'),
                selectedTargets: new Set([targetId]),
                forcedSopId: options.forcedSopId,
                sourceGroupModified: true,
                sampleDescriptionMap: subsetSampleDescriptionMap(source.sampleDescriptionMap, dedicatedSamples)
            };
            const next = [...blocks];
            next[sourceIndex] = {
                ...source,
                selectedTargets: remainingTargets,
                sourceGroupId: undefined,
                sourceGroupModified: true
            };
            next.splice(sourceIndex + 1, 0, dedicated);
            return next;
        });
    }
    applyFixCoverage() {
        const state = this.fixCoverageState();
        this.fixCoverageState.update(s => ({ ...s, isProcessing: true }));
        // Process Group 1
        for (const item of state.group1) {
            if (item.chosenSopId === null) {
                this.removeTargetFromSourceBlock(item.blockId, item.targetId);
            }
            else {
                this.moveTargetToDedicatedBlock(item.blockId, item.targetId, item.targetName, item.affectedSamples, { forcedSopId: item.chosenSopId });
            }
        }
        // Process Group 2
        for (const item of state.group2) {
            const blockIdx = this.blocks().findIndex(b => b.id === item.blockId);
            if (blockIdx === -1)
                continue;
            if (item.action === 'remove') {
                this.removeTargetFromSourceBlock(item.blockId, item.targetId);
            }
            else {
                this.moveTargetToDedicatedBlock(item.blockId, item.targetId, item.targetName, item.affectedSamples, { clearMatrix: true });
            }
        }
        // Process Group 3
        for (const item of state.group3) {
            if (item.action === 'remove') {
                this.removeTargetFromSourceBlock(item.blockId, item.targetId);
            }
        }
        this.fixCoverageState.update(s => ({ ...s, isOpen: false, isProcessing: false }));
        this.analyzePlan();
    }
    closeFixCoverageModal() {
        this.fixCoverageState.update(s => ({ ...s, isOpen: false }));
    }
    getCompatibleMatricesLabel(item) {
        if (!item.compatibleSops || item.compatibleSops.length === 0)
            return '';
        const matrices = item.compatibleSops[0].matrices;
        const labels = matrices.map(m => this.getMatrixLabel(m) || 'Dùng chung');
        return labels.join(', ');
    }
    reset() {
        this.step.set(0);
        this.batches.set([]);
        this.unmappedTasks.set([]);
        this.excludedTaskKeys.set(new Set());
        this.blocks.set([this.createEmptyBlock()]);
        this.singleSampleCode.set('');
        this.singleSampleDescription.set(undefined);
        this.singleSelectedTargets.set(new Set());
        this.singleSourceGroupId.set(null);
        this.singleMatrixType.set(undefined);
        this.singleTargetSearch.set('');
        this.singleForcedSopId.set(undefined);
    }
    goBackFromStep2() {
        if (this.smartBatchMode() === 'single' && this.blocks().length > 0) {
            const mockBlock = this.blocks()[0];
            this.singleSampleCode.set(mockBlock.rawSamples.trim());
            this.singleSampleDescription.set(getSampleDescriptionSnapshot(mockBlock.sampleDescriptionMap, mockBlock.rawSamples.trim()));
            this.singleSelectedTargets.set(new Set(mockBlock.selectedTargets));
            this.singleSourceGroupId.set(mockBlock.sourceGroupId || null);
            this.singleMatrixType.set(mockBlock.matrixType);
            this.singleForcedSopId.set(mockBlock.forcedSopId);
        }
        this.batches.set([]);
        this.unmappedTasks.set([]);
        this.excludedTaskKeys.set(new Set());
        this.step.set(1);
    }
    async executeAll() {
        if (this.isProcessing())
            return;
        if (!this.auth.canRunBatch()) {
            this.toast.show('Bạn không có quyền lập và vận hành mẻ.', 'error');
            return;
        }
        if (this.batches().length === 0) {
            this.toast.show('Kế hoạch chưa có mẻ nào để duyệt.', 'error');
            return;
        }
        if (this.hasInvalidAnalysisDates()) {
            this.toast.show('Vui lòng chọn ngày kiểm nghiệm hợp lệ cho tất cả các mẻ.', 'error');
            return;
        }
        if (this.hasInvalidPlanResources()) {
            this.toast.show('Kế hoạch có lỗi công thức, đơn vị hoặc lượng tiêu hao không hợp lệ.', 'error');
            return;
        }
        const coverage = this.coverageMetrics();
        if (!coverage.isFullyCovered || coverage.duplicateCount > 0) {
            this.toast.show('Kế hoạch phải phủ đủ và không được trùng task trước khi duyệt.', 'error');
            return;
        }
        this.validateGlobalStock();
        if (this.hasCriticalMissing()) {
            this.toast.show('Kho không đủ đáp ứng. Vui lòng kiểm tra lại.', 'error');
            return;
        }
        if (await this.confirmation.confirm({ message: `Xác nhận tạo nguyên tử ${this.batches().length} phiếu yêu cầu, trừ kho và đưa toàn bộ vào hàng đợi in? Nếu một mẻ lỗi, toàn bộ kế hoạch sẽ không được ghi.`, confirmText: 'Duyệt Toàn Bộ' })) {
            this.isProcessing.set(true);
            const inventoryMap = this.state.inventoryMap();
            try {
                const planItems = this.batches().map(batch => {
                    const sampleTargetMap = {};
                    if (batch.tasks && batch.tasks.length > 0) {
                        batch.tasks.forEach(t => {
                            if (!sampleTargetMap[t.sample]) {
                                sampleTargetMap[t.sample] = [];
                            }
                            if (!sampleTargetMap[t.sample].includes(t.targetId)) {
                                sampleTargetMap[t.sample].push(t.targetId);
                            }
                        });
                    }
                    else {
                        const allTargetIds = batch.targets.map(t => t.id);
                        Array.from(batch.samples).forEach(s => {
                            sampleTargetMap[s] = allTargetIds;
                        });
                    }
                    const finalInputs = {
                        ...batch.inputValues,
                        safetyMargin: Number(batch.safetyMargin),
                        sampleList: Array.from(batch.samples),
                        targetIds: batch.targets.map(t => t.id),
                        sampleTargetMap,
                        sampleDescriptionMap: batch.sampleDescriptionMap,
                        analysisDate: batch.inputValues['analysisDate'],
                        explicitGroupId: batch.tasks.length > 0
                            && batch.tasks.every(task => task.sourceGroupId && task.sourceGroupId === batch.tasks[0].sourceGroupId)
                            ? batch.tasks[0].sourceGroupId
                            : undefined
                    };
                    return {
                        sop: batch.sop,
                        calculatedItems: batch.resourceImpact,
                        formInputs: finalInputs
                    };
                });
                const result = await this.state.directApproveBatchPlan(planItems, inventoryMap);
                if (result && result.length === planItems.length) {
                    this.toast.show(`Hoàn tất! Đã duyệt nguyên tử ${result.length} mẻ và đưa phiếu vào hàng đợi in.`, 'success');
                    this.reset();
                }
            }
            catch (e) {
                this.toast.show('Lỗi xử lý: ' + e.message, 'error');
            }
            finally {
                this.isProcessing.set(false);
            }
        }
    }
    // --- QUICK GENERATE MODAL HANDLERS ---
    openQuickGenerateModal(index) {
        this.activeBlockIndexForGenerate.set(index);
        this.quickGenerateModalOpen.set(true);
    }
    closeQuickGenerateModal() {
        this.quickGenerateModalOpen.set(false);
        this.activeBlockIndexForGenerate.set(null);
    }
    handleGeneratedSamples(samples) {
        const index = this.activeBlockIndexForGenerate();
        if (index !== null && index >= 0 && index < this.blocks().length) {
            const currentSamples = this.blocks()[index].rawSamples;
            const newSamplesStr = samples.join('\n');
            const updatedSamples = currentSamples
                ? `${currentSamples.trim()}\n${newSamplesStr}`
                : newSamplesStr;
            this.updateBlockSamples(index, updatedSamples);
            this.toast.show(`Đã thêm ${samples.length} mẫu vào danh sách.`, 'success');
        }
        this.closeQuickGenerateModal();
    }
    static { this.ɵfac = function SmartBatchComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SmartBatchComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: SmartBatchComponent, selectors: [["app-smart-batch"]], decls: 27, vars: 12, consts: [[1, "h-full", "flex", "flex-col", "fade-in", "pb-0", "relative", "font-sans", "text-slate-800", "dark:text-slate-200"], ["id", "sample-description-master-options"], [3, "value"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-4", "mb-4", "bg-white", "dark:bg-slate-800", "p-4", "rounded-2xl", "shadow-sm", "border", "border-slate-100", "dark:border-slate-700", "shrink-0"], [1, "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-xl", "bg-teal-50", "dark:bg-teal-900/30", "text-teal-600", "dark:text-teal-400", "flex", "items-center", "justify-center", "border", "border-teal-100", "dark:border-teal-800/30", "shadow-sm", "shrink-0"], [1, "fa-solid", "fa-layer-group", "text-base"], [1, "text-xl", "font-black", "text-slate-850", "dark:text-slate-100", "tracking-tight", "leading-tight", "flex", "items-center", "gap-2"], [1, "text-xs", "font-medium", "text-slate-500", "dark:text-slate-400", "mt-0.5"], [1, "flex", "flex-wrap", "justify-end", "gap-2"], ["type", "button", "title", "M\u1EDF SOP Calculator khi c\u1EA7n t\u00EDnh nhanh ho\u1EB7c ki\u1EC3m tra chi ti\u1EBFt", 1, "px-4", "py-2", "border", "border-blue-200", "dark:border-blue-800/60", "bg-blue-50", "dark:bg-blue-900/20", "text-blue-700", "dark:text-blue-300", "rounded-xl", "font-bold", "text-xs", "hover:bg-blue-100", "dark:hover:bg-blue-900/35", "transition", "active:scale-95"], [1, "px-4", "py-2", "border", "border-slate-200", "dark:border-slate-700", "text-slate-600", "dark:text-slate-300", "rounded-xl", "font-bold", "text-xs", "hover:bg-slate-50", "dark:hover:bg-slate-700", "transition"], [1, "flex-1", "overflow-y-auto", "custom-scrollbar", "relative", "pb-32", "lg:pb-36", "p-2", "lg:p-1"], [1, "max-w-4xl", "mx-auto", "py-12", "px-4", "animate-fade-in"], [1, "flex", "flex-col-reverse", "lg:flex-row", "gap-4", "lg:gap-6", "min-h-fit", "w-full"], [1, "sticky", "bottom-0", "w-full", "shrink-0", "bg-white", "dark:bg-slate-800", "border-t", "border-slate-200", "dark:border-slate-700", "p-4", "shadow-[0_-4px_20px_rgba(0,0,0,0.05)]", "dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)]", "z-40", "transition-transform", "duration-300"], [1, "fixed", "inset-0", "z-[60]", "flex", "items-center", "justify-center", "p-4", "bg-slate-900/50", "backdrop-blur-sm", "fade-in"], [1, "fixed", "inset-0", "z-[70]", "flex", "items-center", "justify-center", "p-4", "bg-slate-900/60", "backdrop-blur-sm", "fade-in"], [1, "text-[10px]", "bg-teal-50", "dark:bg-teal-900/30", "text-teal-700", "dark:text-teal-400", "px-2", "py-0.5", "rounded-full", "font-bold", "border", "border-teal-200", "dark:border-teal-800", "shrink-0"], [1, "text-[10px]", "bg-indigo-50", "dark:bg-indigo-900/30", "text-indigo-700", "dark:text-indigo-400", "px-2", "py-0.5", "rounded-full", "font-bold", "border", "border-indigo-200", "dark:border-indigo-800", "shrink-0"], [1, "fa-solid", "fa-layer-group", "text-[9px]", "mr-1"], [1, "fa-solid", "fa-vial", "text-[9px]", "mr-1"], ["type", "button", "title", "M\u1EDF SOP Calculator khi c\u1EA7n t\u00EDnh nhanh ho\u1EB7c ki\u1EC3m tra chi ti\u1EBFt", 1, "px-4", "py-2", "border", "border-blue-200", "dark:border-blue-800/60", "bg-blue-50", "dark:bg-blue-900/20", "text-blue-700", "dark:text-blue-300", "rounded-xl", "font-bold", "text-xs", "hover:bg-blue-100", "dark:hover:bg-blue-900/35", "transition", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-calculator", "mr-1"], [1, "px-4", "py-2", "border", "border-slate-200", "dark:border-slate-700", "text-slate-600", "dark:text-slate-300", "rounded-xl", "font-bold", "text-xs", "hover:bg-slate-50", "dark:hover:bg-slate-700", "transition", 3, "click"], [1, "fa-solid", "fa-chevron-left", "mr-1"], [1, "fa-solid", "fa-rotate-left", "mr-1"], [1, "text-center", "mb-10"], [1, "text-2xl", "font-black", "text-slate-850", "dark:text-slate-100", "tracking-tight"], [1, "text-xs", "font-medium", "text-slate-500", "dark:text-slate-400", "mt-2"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-6"], [1, "group", "cursor-pointer", "bg-white", "dark:bg-slate-800", "rounded-2xl", "border", "border-slate-200", "dark:border-slate-750", "p-6", "shadow-sm", "hover:shadow-xl", "hover:border-teal-400", "dark:hover:border-teal-500", "transition-all", "duration-300", "transform", "hover:-translate-y-1", "flex", "flex-col", "justify-between", "min-h-[220px]", 3, "click"], [1, "w-12", "h-12", "rounded-2xl", "bg-teal-50", "dark:bg-teal-900/30", "text-teal-600", "dark:text-teal-400", "flex", "items-center", "justify-center", "border", "border-teal-100", "dark:border-teal-800/30", "shadow-sm", "mb-4", "group-hover:scale-110", "transition-transform"], [1, "fa-solid", "fa-layer-group", "text-xl"], [1, "text-lg", "font-black", "text-slate-800", "dark:text-slate-100", "group-hover:text-teal-600", "dark:group-hover:text-teal-400", "transition-colors"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "mt-2", "leading-relaxed"], [1, "flex", "items-center", "gap-1.5", "text-xs", "font-black", "text-teal-600", "dark:text-teal-400", "mt-4", "group-hover:translate-x-1", "transition-transform"], [1, "fa-solid", "fa-arrow-right"], [1, "group", "cursor-pointer", "bg-white", "dark:bg-slate-800", "rounded-2xl", "border", "border-slate-200", "dark:border-slate-750", "p-6", "shadow-sm", "hover:shadow-xl", "hover:border-indigo-400", "dark:hover:border-indigo-500", "transition-all", "duration-300", "transform", "hover:-translate-y-1", "flex", "flex-col", "justify-between", "min-h-[220px]", 3, "click"], [1, "w-12", "h-12", "rounded-2xl", "bg-indigo-50", "dark:bg-indigo-900/30", "text-indigo-600", "dark:text-indigo-400", "flex", "items-center", "justify-center", "border", "border-indigo-100", "dark:border-indigo-800/30", "shadow-sm", "mb-4", "group-hover:scale-110", "transition-transform"], [1, "fa-solid", "fa-vial", "text-xl"], [1, "text-lg", "font-black", "text-slate-800", "dark:text-slate-100", "group-hover:text-indigo-600", "dark:group-hover:text-indigo-400", "transition-colors"], [1, "flex", "items-center", "gap-1.5", "text-xs", "font-black", "text-indigo-600", "dark:text-indigo-400", "mt-4", "group-hover:translate-x-1", "transition-transform"], [1, "flex-1", "flex", "flex-col", "bg-transparent", "gap-4", "animate-fade-in"], [1, "space-y-4"], [1, "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-sm", "border", "border-slate-200", "dark:border-slate-700", "overflow-hidden", "animate-slide-up", "p-4", "lg:p-6", "flex", "flex-col", "gap-5"], [1, "w-full", "lg:w-80", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-2xl", "p-5", "shadow-sm", "h-fit", "sticky", "top-4", "max-h-[calc(100vh-2rem)]", "overflow-y-auto", "custom-scrollbar"], [1, "font-bold", "text-slate-800", "dark:text-slate-200", "mb-4", "flex", "items-center", "gap-2"], [1, "space-y-4", "mb-6"], [1, "flex", "justify-between", "items-center", "p-3", "bg-slate-50", "dark:bg-slate-900/50", "rounded-xl", "border", "border-slate-100", "dark:border-slate-700"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "font-bold"], [1, "text-lg", "font-black", "text-slate-800", "dark:text-slate-200"], [1, "pt-4", "border-t", "border-slate-100", "dark:border-slate-700"], [3, "click", "disabled"], [1, "fixed", "inset-0", "z-50", "flex", "justify-end"], [1, "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-sm", "border", "border-slate-200", "dark:border-slate-700", "overflow-hidden", "animate-slide-up", "transition-all", "hover:shadow-md", "group"], [1, "w-full", "py-3", "border-2", "border-dashed", "border-slate-300", "dark:border-slate-600", "rounded-2xl", "text-slate-500", "dark:text-slate-400", "font-bold", "text-sm", "hover:border-teal-400", "dark:hover:border-teal-500", "hover:text-teal-600", "dark:hover:text-teal-400", "hover:bg-teal-50", "dark:hover:bg-teal-900/20", "transition", "flex", "items-center", "justify-center", "gap-2", 3, "click"], [1, "fa-solid", "fa-plus-circle"], [1, "bg-slate-50/50", "dark:bg-slate-800/50", "p-3", "flex", "justify-between", "items-center", "border-b", "border-slate-100", "dark:border-slate-700", "cursor-pointer", 3, "click"], [1, "w-6", "h-6", "rounded-full", "bg-slate-200", "dark:bg-slate-700", "text-slate-600", "dark:text-slate-300", "flex", "items-center", "justify-center", "text-xs", "font-bold"], [1, "font-bold", "text-sm", "bg-white", "dark:bg-slate-900", "border", "border-slate-300", "dark:border-slate-600", "rounded", "px-2", "py-1", "outline-none", "focus:border-teal-500", "dark:focus:border-teal-400", "text-slate-800", "dark:text-slate-200", 3, "ngModel"], [1, "font-bold", "text-slate-700", "dark:text-slate-200", "text-sm", "flex", "items-center", "gap-2"], [1, "text-[10px]", "bg-slate-100", "dark:bg-slate-700", "text-slate-500", "dark:text-slate-400", "px-2", "py-0.5", "rounded-full", "border", "border-slate-200", "dark:border-slate-600"], [1, "flex", "items-center", "gap-2"], [1, "flex", "items-center", "gap-2", "mr-1", "md:mr-3", "border-r", "border-slate-200", "dark:border-slate-700", "pr-2", "md:pr-4", 3, "click"], [1, "text-[10px]", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase", "hidden", "md:block"], [1, "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "px-2", "py-1", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "outline-none", "focus:border-teal-500", "dark:focus:border-teal-400", "cursor-pointer", "shadow-sm", "max-w-[140px]", "truncate", 3, "ngModelChange", "ngModel"], ["value", ""], ["title", "Nh\u00E2n b\u1EA3n", 1, "w-8", "h-8", "rounded-lg", "hover:bg-blue-50", "dark:hover:bg-blue-900/20", "text-slate-400", "dark:text-slate-500", "hover:text-blue-600", "dark:hover:text-blue-400", "transition", 3, "click"], [1, "fa-regular", "fa-clone"], ["title", "X\u00F3a", 1, "w-8", "h-8", "rounded-lg", "hover:bg-red-50", "dark:hover:bg-red-900/20", "text-slate-400", "dark:text-slate-500", "hover:text-red-600", "dark:hover:text-red-400", "transition", 3, "click"], [1, "fa-solid", "fa-trash"], [1, "fa-solid", "fa-chevron-down", "text-slate-400", "dark:text-slate-500", "text-xs", "transition-transform", "duration-300", "ml-2"], [1, "p-3", "lg:p-4", "flex", "flex-col", "gap-4"], [1, "font-bold", "text-sm", "bg-white", "dark:bg-slate-900", "border", "border-slate-300", "dark:border-slate-600", "rounded", "px-2", "py-1", "outline-none", "focus:border-teal-500", "dark:focus:border-teal-400", "text-slate-800", "dark:text-slate-200", 3, "ngModelChange", "blur", "keyup.enter", "click", "ngModel"], [1, "font-bold", "text-slate-700", "dark:text-slate-200", "text-sm", "flex", "items-center", "gap-2", 3, "dblclick"], [1, "fa-solid", "fa-pen", "text-[10px]", "text-slate-300", "dark:text-slate-500", "opacity-0", "group-hover:opacity-100"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-4", "lg:gap-6"], [1, "flex", "flex-col"], [1, "flex", "justify-between", "items-center", "mb-1"], [1, "text-[10px]", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase", "block"], [1, "text-[10px]", "text-blue-600", "dark:text-blue-400", "hover:bg-blue-50", "dark:hover:bg-blue-900/20", "px-2", "py-1", "rounded", "transition", "font-bold", "flex", "items-center", "gap-1", 3, "click"], [1, "fa-solid", "fa-layer-group"], ["placeholder", "A01\nA02\n...", 1, "w-full", "h-40", "p-3", "text-sm", "font-mono", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "focus:border-teal-500", "dark:focus:border-teal-400", "focus:ring-1", "focus:ring-teal-200", "dark:focus:ring-teal-900/30", "outline-none", "resize-none", "bg-slate-50", "dark:bg-slate-900/50", "focus:bg-white", "dark:focus:bg-slate-900", "transition", "text-slate-800", "dark:text-slate-200", 3, "ngModelChange", "ngModel"], [1, "mt-2", "rounded-xl", "border", "border-fuchsia-100", "dark:border-fuchsia-900/40", "bg-fuchsia-50/40", "dark:bg-fuchsia-950/10", "overflow-hidden"], [1, "flex", "flex-col", "h-40"], [1, "text-[10px]", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase", "mb-1", "block"], [1, "flex", "gap-2", "mb-2"], [1, "relative", "flex-1"], [1, "fa-solid", "fa-search", "absolute", "left-2.5", "top-2.5", "text-slate-400", "dark:text-slate-500", "text-xs"], ["placeholder", "T\u00ECm ch\u1EC9 ti\u00EAu...", 1, "w-full", "pl-8", "pr-3", "py-1.5", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "text-xs", "outline-none", "focus:border-teal-500", "dark:focus:border-teal-400", "transition", "bg-white", "dark:bg-slate-900", "text-slate-800", "dark:text-slate-200", 3, "ngModelChange", "ngModel"], ["title", "Ch\u1ECDn t\u1EEB B\u1ED9 ch\u1EC9 ti\u00EAu", 1, "px-3", "py-1.5", "bg-indigo-50", "dark:bg-indigo-900/20", "text-indigo-700", "dark:text-indigo-400", "rounded-lg", "border", "border-indigo-100", "dark:border-indigo-800", "hover:bg-indigo-100", "dark:hover:bg-indigo-900/40", "transition", "flex", "items-center", "gap-1", "text-[10px]", "font-bold", 3, "click"], ["title", "Ch\u1ECDn t\u1EA5t c\u1EA3", 1, "px-2", "py-1.5", "bg-teal-50", "dark:bg-teal-900/20", "text-teal-700", "dark:text-teal-400", "rounded-lg", "border", "border-teal-100", "dark:border-teal-800", "hover:bg-teal-100", "dark:hover:bg-teal-900/40", "transition", 3, "click"], [1, "fa-solid", "fa-check-double", "text-xs"], ["title", "B\u1ECF ch\u1ECDn t\u1EA5t c\u1EA3", 1, "px-2", "py-1.5", "bg-slate-50", "dark:bg-slate-800", "text-slate-600", "dark:text-slate-400", "rounded-lg", "border", "border-slate-200", "dark:border-slate-700", "hover:bg-slate-100", "dark:hover:bg-slate-700", "transition", 3, "click"], [1, "fa-solid", "fa-xmark", "text-xs"], [1, "flex-1", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "overflow-y-auto", "custom-scrollbar", "p-1", "bg-white", "dark:bg-slate-900"], [1, "flex", "items-center", "gap-2", "p-1.5", "hover:bg-slate-50", "dark:hover:bg-slate-800", "rounded", "cursor-pointer", "group", 3, "ngClass"], [1, "text-center", "py-4", "text-slate-400", "dark:text-slate-500", "text-[10px]", "italic"], [1, "bg-indigo-50", "dark:bg-indigo-900/10", "border", "border-indigo-100", "dark:border-indigo-800/50", "rounded-xl", "p-3"], [1, "text-[10px]", "font-bold", "text-indigo-700", "dark:text-indigo-400", "uppercase", "mb-2", "flex", "items-center", "justify-between"], [1, "fa-solid", "fa-code-branch", "mr-1"], [1, "text-xs", "text-red-500", "hover:text-red-600", "capitalize", "font-medium", "transition", "cursor-pointer"], [1, "text-[11px]", "text-slate-500", "dark:text-slate-400", "italic", "font-medium"], [1, "px-3", "py-2", "cursor-pointer", "text-[10px]", "font-black", "uppercase", "tracking-wide", "text-fuchsia-700", "dark:text-fuchsia-400", "flex", "items-center", "justify-between", "gap-2"], [1, "fa-solid", "fa-tags", "mr-1.5"], [1, "normal-case", "text-slate-400"], [1, "max-h-64", "overflow-y-auto", "custom-scrollbar", "border-t", "border-fuchsia-100", "dark:border-fuchsia-900/40", "divide-y", "divide-fuchsia-100/70", "dark:divide-fuchsia-900/30"], [1, "grid", "grid-cols-[minmax(90px,0.7fr)_minmax(150px,1.3fr)_auto]", "gap-2", "items-center", "px-3", "py-2", "bg-white/70", "dark:bg-slate-900/40", "group"], [1, "px-3", "py-2", "text-[9px]", "text-slate-400", "border-t", "border-fuchsia-100", "dark:border-fuchsia-900/40"], [1, "font-mono", "text-xs", "font-black", "text-slate-700", "dark:text-slate-300", "break-all"], [1, "relative"], [1, "fa-solid", "fa-tag", "absolute", "left-2.5", "top-1/2", "-translate-y-1/2", "text-fuchsia-300", "text-[10px]"], ["list", "sample-description-master-options", "placeholder", "Ch\u1ECDn ho\u1EB7c nh\u1EADp m\u00F4 t\u1EA3...", 1, "w-full", "h-8", "pl-7", "pr-2", "rounded-lg", "border", "border-slate-200", "dark:border-slate-700", "bg-white", "dark:bg-slate-900", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "outline-none", "focus:border-fuchsia-400", 3, "ngModelChange", "ngModel"], ["title", "\u00C1p d\u1EE5ng m\u00F4 t\u1EA3 n\u00E0y cho t\u1EA5t c\u1EA3 c\u00E1c m\u1EABu trong m\u1EBB", 1, "w-7", "h-7", "flex", "items-center", "justify-center", "rounded", "text-slate-400", "hover:text-fuchsia-600", "hover:bg-fuchsia-50", "dark:hover:bg-fuchsia-900/30", "transition", "opacity-0", "group-hover:opacity-100", "focus:opacity-100", 3, "click"], [1, "fa-solid", "fa-clone", "text-[11px]"], ["type", "checkbox", 1, "w-3.5", "h-3.5", "accent-teal-600", "rounded", "cursor-pointer", 3, "change", "checked"], [1, "flex-1", "min-w-0"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "truncate", "group-hover:text-teal-700", "dark:group-hover:text-teal-400"], [1, "text-xs", "text-red-500", "hover:text-red-600", "capitalize", "font-medium", "transition", "cursor-pointer", 3, "click"], [1, "text-[11px]", "text-orange-600", "dark:text-orange-400", "italic", "font-medium", "mb-3"], [1, "mt-3", "pt-2.5", "border-t", "border-indigo-100/50", "dark:border-indigo-950/20", "flex", "items-center", "gap-2"], [1, "mb-2", "text-[11px]", "text-orange-600", "dark:text-orange-400", "font-medium", "flex", "items-start", "gap-1.5"], [1, "mb-3", "text-[11px]", "bg-yellow-50", "dark:bg-yellow-900/20", "text-yellow-800", "dark:text-yellow-500", "font-medium", "flex", "flex-col", "gap-1.5", "p-2", "rounded-lg", "border", "border-yellow-200", "dark:border-yellow-900/50"], [1, "flex", "flex-wrap", "gap-2"], [1, "flex", "flex-col", "rounded-lg", "border", "transition", "bg-white", "dark:bg-slate-800", "border-slate-200", "dark:border-slate-700", "overflow-hidden", 3, "ring-2", "ring-indigo-500"], [1, "fa-solid", "fa-triangle-exclamation", "mt-0.5"], [1, "flex", "items-start", "gap-1.5"], [1, "fa-solid", "fa-triangle-exclamation", "mt-0.5", "text-yellow-600", "dark:text-yellow-500"], [1, "flex", "flex-wrap", "gap-1", "mt-1", "pl-4"], [1, "px-1.5", "py-0.5", "bg-white/60", "dark:bg-black/20", "border", "border-yellow-200", "dark:border-yellow-900/50", "rounded", "text-[9px]", "font-bold", "text-yellow-700", "dark:text-yellow-400"], [1, "flex", "flex-col", "rounded-lg", "border", "transition", "bg-white", "dark:bg-slate-800", "border-slate-200", "dark:border-slate-700", "overflow-hidden"], [1, "px-3", "py-2", "text-left", "hover:bg-slate-50", "dark:hover:bg-slate-700/50", "disabled:opacity-75", "disabled:cursor-not-allowed", "transition", 3, "click", "disabled"], [1, "flex", "items-center", "gap-2", "mb-1"], [1, "bg-purple-100", "text-purple-800", "dark:bg-purple-900/30", "dark:text-purple-400", "text-[9px]", "px-1.5", "py-0.5", "rounded", "font-black", "tracking-wide", "uppercase"], [1, "bg-yellow-100", "text-yellow-800", "dark:bg-yellow-900/30", "dark:text-yellow-400", "text-[9px]", "px-1.5", "py-0.5", "rounded", "font-black", "tracking-wide", "uppercase"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-200", "flex-1"], [1, "fa-solid", "fa-circle-check", "text-indigo-600", "dark:text-indigo-400"], [1, "flex", "items-center", "gap-3", "text-[10px]", "text-slate-500", "dark:text-slate-400"], [1, "flex", "items-center", "gap-1"], [1, "font-medium"], [1, "fa-solid", "fa-bullseye", "mr-0.5"], ["title", "C\u00F3 h\u00F3a ch\u1EA5t b\u1ECB h\u1EBFt (T\u1ED3n = 0)", 1, "text-red-500", "font-bold"], [1, "text-teal-600", "dark:text-teal-400"], [1, "bg-slate-50", "dark:bg-slate-800/80", "border-t", "border-slate-100", "dark:border-slate-700/50", "py-1", "px-3", "text-center", "hover:bg-slate-100", "dark:hover:bg-slate-700", "cursor-pointer", "transition", 3, "click"], [1, "text-[10px]", "text-indigo-600", "dark:text-indigo-400", "font-bold", "hover:underline", "w-full", "pointer-events-none"], [1, "fa-regular", "fa-eye", "mr-1"], [1, "fa-solid", "fa-crosshairs", "mr-0.5"], [1, "fa-solid", "fa-star", "mr-0.5"], [1, "w-1.5", "h-1.5", "rounded-full"], [1, "w-1.5", "h-1.5", "rounded-full", "bg-slate-400"], [1, "fa-solid", "fa-triangle-exclamation"], [1, "fa-solid", "fa-check"], [1, "text-[10px]", "font-black", "text-indigo-750", "dark:text-indigo-400", "whitespace-nowrap"], [1, "flex-1", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "px-2.5", "py-1", "text-xs", "outline-none", "focus:border-indigo-500", "cursor-pointer", "font-bold", "text-slate-700", "dark:text-slate-300", 3, "ngModelChange", "ngModel"], [1, "flex", "items-center", "gap-3", "border-b", "border-slate-150", "dark:border-slate-700", "pb-4"], [1, "w-10", "h-10", "rounded-xl", "bg-indigo-50", "dark:bg-indigo-900/30", "text-indigo-600", "dark:text-indigo-400", "flex", "items-center", "justify-center", "border", "border-indigo-100", "dark:border-indigo-800/30", "shadow-sm", "shrink-0"], [1, "fa-solid", "fa-vial", "text-base"], [1, "font-black", "text-slate-850", "dark:text-slate-100", "text-base", "leading-tight"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4", "lg:gap-6"], [1, "flex", "flex-col", "gap-4"], [1, "text-[10px]", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase", "block", "mb-1.5", "ml-1"], ["placeholder", "Nh\u1EADp m\u00E3 m\u1EABu (v\u00ED d\u1EE5: M-TEST-001)...", 1, "w-full", "px-4", "py-2.5", "bg-slate-50", "dark:bg-slate-900/50", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-sm", "font-bold", "text-slate-800", "dark:text-slate-200", "outline-none", "focus:border-indigo-500", "dark:focus:border-indigo-400", "focus:bg-white", "dark:focus:bg-slate-900", "focus:ring-1", "focus:ring-indigo-100", "dark:focus:ring-indigo-900/30", "transition", "shadow-sm", 3, "ngModelChange", "ngModel"], [1, "text-[10px]", "font-bold", "text-fuchsia-500", "dark:text-fuchsia-400", "uppercase", "block", "mb-1.5", "ml-1"], [1, "fa-solid", "fa-tag", "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-fuchsia-300", "text-xs"], ["list", "sample-description-master-options", "placeholder", "Ch\u1ECDn t\u1EEB danh m\u1EE5c g\u1ED1c ho\u1EB7c nh\u1EADp t\u00EAn...", 1, "w-full", "px-4", "pl-9", "py-2.5", "bg-fuchsia-50/40", "dark:bg-fuchsia-950/10", "border", "border-fuchsia-100", "dark:border-fuchsia-900/40", "rounded-xl", "text-sm", "font-bold", "text-slate-800", "dark:text-slate-200", "outline-none", "focus:border-fuchsia-500", 3, "ngModelChange", "ngModel"], [1, "text-[10px]", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase", "flex", "items-center", "gap-1.5", "mb-1.5", "ml-1"], [1, "relative", "group/tooltip", "inline-block", "shrink-0", "leading-none"], [1, "fa-regular", "fa-circle-question", "text-slate-400", "dark:text-slate-500", "cursor-help", "hover:text-indigo-500", "dark:hover:text-indigo-400", "transition-colors", "text-[11px]"], [1, "absolute", "bottom-full", "left-1/2", "-translate-x-1/2", "mb-2", "w-64", "bg-slate-900/95", "dark:bg-slate-950/95", "text-white", "text-[10px]", "p-2.5", "rounded-xl", "shadow-xl", "border", "border-slate-750", "backdrop-blur-md", "opacity-0", "scale-95", "pointer-events-none", "group-hover/tooltip:opacity-100", "group-hover/tooltip:scale-100", "transition-all", "duration-200", "z-50", "origin-bottom", "leading-relaxed", "font-normal", "normal-case"], [1, "font-bold", "text-indigo-400", "mb-1", "flex", "items-center", "gap-1.5"], [1, "fa-solid", "fa-filter"], [1, "text-slate-300"], [1, "w-full", "px-4", "py-2.5", "bg-slate-50", "dark:bg-slate-900/50", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-sm", "font-bold", "text-slate-700", "dark:text-slate-350", "outline-none", "focus:border-indigo-500", "dark:focus:border-indigo-400", "cursor-pointer", "shadow-sm", 3, "ngModelChange", "ngModel"], [1, "flex", "flex-col", "h-[280px]"], [1, "flex", "justify-between", "items-center", "mb-1.5"], [1, "text-[10px]", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase", "block", "ml-1"], [1, "text-[10px]", "text-indigo-650", "dark:text-indigo-400", "hover:bg-indigo-50", "dark:hover:bg-indigo-900/20", "px-2", "py-1", "rounded", "transition", "font-bold", "flex", "items-center", "gap-1", 3, "click"], ["placeholder", "T\u00ECm ch\u1EC9 ti\u00EAu...", 1, "w-full", "pl-8", "pr-3", "py-1.5", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "text-xs", "outline-none", "focus:border-indigo-500", "dark:focus:border-indigo-400", "transition", "bg-white", "dark:bg-slate-900", "text-slate-800", "dark:text-slate-200", 3, "ngModelChange", "ngModel"], ["title", "B\u1ECF ch\u1ECDn t\u1EA5t c\u1EA3", 1, "px-2", "py-1.5", "bg-slate-50", "dark:bg-slate-800", "text-slate-650", "dark:text-slate-400", "rounded-lg", "border", "border-slate-200", "dark:border-slate-700", "hover:bg-slate-100", "dark:hover:bg-slate-700", "transition", 3, "click"], [1, "bg-indigo-50/30", "dark:bg-indigo-900/10", "border", "border-indigo-100", "dark:border-indigo-800/50", "rounded-xl", "p-3", "mt-2", "animate-fade-in"], [1, "text-[10px]", "font-bold", "text-indigo-750", "dark:text-indigo-400", "uppercase", "mb-2", "flex", "items-center", "justify-between"], [1, "flex", "items-center", "gap-1.5"], [1, "fa-solid", "fa-anchor"], [1, "border", "border-dashed", "border-slate-200", "dark:border-slate-700", "bg-slate-50/50", "dark:bg-slate-900/30", "rounded-xl", "p-4", "text-center", "group", "cursor-default"], ["type", "checkbox", 1, "w-3.5", "h-3.5", "accent-indigo-600", "rounded", "cursor-pointer", 3, "change", "checked"], [1, "text-xs", "font-bold", "text-slate-750", "dark:text-slate-350", "truncate", "group-hover:text-indigo-700", "dark:group-hover:text-indigo-400"], [1, "fa-solid", "fa-vials", "text-2xl", "text-slate-300", "dark:text-slate-650", "mb-1.5", "block", "group-hover:animate-bounce"], [1, "text-[11px]", "font-bold", "text-slate-750", "dark:text-slate-350", "mb-0.5"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "max-w-xs", "mx-auto", "leading-relaxed"], [1, "border", "border-orange-100", "dark:border-orange-950", "bg-orange-50/30", "dark:bg-orange-900/10", "rounded-xl", "p-4", "text-center", "mb-3"], [1, "fa-solid", "fa-microscope", "text-2xl", "text-orange-400", "dark:text-orange-550", "mb-1.5", "block"], [1, "text-[11px]", "font-bold", "text-orange-700", "dark:text-orange-400", "mb-0.5"], [1, "text-[10px]", "text-orange-500", "dark:text-orange-550", "max-w-xs", "mx-auto", "leading-relaxed", "mb-2"], [1, "text-[9px]", "bg-orange-100", "dark:bg-orange-900/30", "hover:bg-orange-200", "text-orange-700", "dark:text-orange-400", "px-2.5", "py-1", "rounded", "font-bold", "transition", 3, "click"], [1, "fa-solid", "fa-vial", "text-indigo-500"], [1, "fa-solid", "fa-chart-pie", "text-teal-500"], [1, "fa-solid", "fa-spinner", "fa-spin"], [1, "fa-solid", "fa-arrow-right", "group-hover:translate-x-1", "transition-transform"], [1, "absolute", "inset-0", "bg-slate-900/20", "backdrop-blur-sm", "transition-opacity", 3, "click"], [1, "relative", "w-full", "max-w-md", "bg-white", "dark:bg-slate-900", "h-full", "shadow-2xl", "flex", "flex-col", "transform", "transition-transform", "border-l", "border-slate-200", "dark:border-slate-800", "animate-slide-in-right"], [1, "flex", "items-center", "justify-between", "p-4", "border-b", "border-slate-200", "dark:border-slate-800", "bg-slate-50", "dark:bg-slate-900/50"], [1, "text-sm", "font-black", "text-slate-800", "dark:text-slate-200", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-microscope", "text-indigo-500"], [1, "flex", "items-center", "gap-2", "mt-1", "text-[10px]", "font-bold", "text-slate-500", "dark:text-slate-400"], [1, "flex", "items-center", "gap-1", "bg-slate-200", "dark:bg-slate-800", "px-1.5", "py-0.5", "rounded"], [1, "bg-slate-200", "dark:bg-slate-800", "px-1.5", "py-0.5", "rounded"], [1, "w-8", "h-8", "flex", "items-center", "justify-center", "rounded-full", "hover:bg-slate-200", "dark:hover:bg-slate-800", "text-slate-400", "transition", 3, "click"], [1, "fa-solid", "fa-xmark"], [1, "flex-1", "overflow-y-auto", "custom-scrollbar", "p-4", "space-y-6"], [1, "p-4", "border-t", "border-slate-200", "dark:border-slate-800", "bg-white", "dark:bg-slate-900"], [1, "w-full", "py-3", "bg-indigo-600", "hover:bg-indigo-700", "disabled:bg-slate-400", "disabled:cursor-not-allowed", "text-white", "rounded-xl", "font-bold", "text-sm", "shadow-md", "transition", "flex", "items-center", "justify-center", "gap-2", 3, "click", "disabled"], [1, "fa-solid", "fa-check-to-slot"], [1, "text-center", "text-[10px]", "text-slate-500", "mt-2", "italic"], [1, "text-xs", "font-bold", "text-teal-700", "dark:text-teal-400", "mb-2", "flex", "items-center", "gap-1.5"], [1, "fa-solid", "fa-circle-check"], [1, "bg-teal-50/50", "dark:bg-teal-900/10", "border", "border-teal-100", "dark:border-teal-900/30", "rounded-xl", "p-2", "max-h-60", "overflow-y-auto", "custom-scrollbar"], [1, "px-2", "py-1.5", "text-[11px]", "font-bold", "text-slate-700", "dark:text-slate-300", "border-b", "border-teal-100", "dark:border-teal-900/30", "last:border-0", "truncate"], [1, "text-xs", "font-bold", "text-red-600", "dark:text-red-400", "mb-2", "flex", "items-center", "gap-1.5"], [1, "fa-solid", "fa-circle-xmark"], [1, "text-[10px]", "text-slate-500", "mb-2", "italic"], [1, "bg-red-50/50", "dark:bg-red-900/10", "border", "border-red-100", "dark:border-red-900/30", "rounded-xl", "p-2", "max-h-40", "overflow-y-auto", "custom-scrollbar"], [1, "px-2", "py-1.5", "text-[11px]", "font-bold", "text-red-700", "dark:text-red-300", "border-b", "border-red-100", "dark:border-red-900/30", "last:border-0", "truncate"], [1, "text-xs", "font-bold", "text-slate-500", "dark:text-slate-400", "mb-2", "flex", "items-center", "gap-1.5"], [1, "fa-solid", "fa-circle-info"], [1, "text-[10px]", "text-slate-400", "mb-2", "italic"], [1, "bg-slate-50", "dark:bg-slate-900/30", "border", "border-slate-200", "dark:border-slate-800", "rounded-xl", "p-2", "max-h-40", "overflow-y-auto", "custom-scrollbar", "opacity-60", "hover:opacity-100", "transition-opacity"], [1, "px-2", "py-1", "text-[10px]", "font-medium", "text-slate-500", "dark:text-slate-400", "border-b", "border-slate-100", "dark:border-slate-800", "last:border-0", "truncate"], [1, "flex-1", "lg:w-2/3", "flex", "flex-col", "gap-4", "animate-fade-in"], [1, "relative", "w-full", "shadow-sm", "shrink-0", "sticky", "top-0", "z-10"], [1, "fa-solid", "fa-search", "absolute", "left-3", "top-2.5", "text-slate-400", "dark:text-slate-500", "text-xs"], ["placeholder", "T\u00ECm v\u1ECB tr\u00ED m\u1EABu (VD: A05)...", 1, "w-full", "pl-9", "pr-3", "py-2", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "outline-none", "focus:border-blue-500", "dark:focus:border-blue-400", "focus:ring-2", "focus:ring-blue-100", "dark:focus:ring-blue-900/30", "transition", "bg-white", "dark:bg-slate-800", 3, "ngModelChange", "ngModel"], [1, "pb-10", "flex", "flex-col", "gap-4"], [1, "bg-rose-50", "dark:bg-rose-900/20", "border", "border-rose-200", "dark:border-rose-800", "rounded-xl", "p-4", "flex", "items-start", "gap-3"], [1, "bg-red-50", "dark:bg-red-900/20", "border", "border-red-100", "dark:border-red-800", "rounded-xl", "p-4", "flex", "items-start", "gap-3"], [1, "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-sm", "border", "border-slate-200", "dark:border-slate-700", "flex", "flex-col", "overflow-hidden", "transition-all", "duration-300", "group", 3, "border-l-4", "border-l-emerald-500", "border-l-red-500", "border-l-yellow-400", "ring-2", "ring-blue-400", "opacity-40"], [1, "w-full", "lg:w-1/3", "flex", "flex-col", "gap-4", "h-fit", "sticky", "top-4", "max-h-[calc(100vh-14rem)]", "overflow-y-auto", "custom-scrollbar", "pb-2", "pr-1"], [1, "p-5", "text-center", "text-sm", "font-medium", "text-slate-400", "italic", "bg-white", "dark:bg-slate-800", "border-2", "border-dashed", "border-slate-200", "dark:border-slate-700", "rounded-2xl", "animate-fade-in"], [1, "fa-solid", "fa-shield-halved", "text-rose-600", "dark:text-rose-400", "mt-0.5"], [1, "text-sm", "font-bold", "text-rose-800", "dark:text-rose-300", "mb-1"], [1, "text-xs", "text-rose-700", "dark:text-rose-400", "list-disc", "pl-4", "space-y-1"], [1, "text-[10px]", "text-rose-500", "mt-1"], [1, "fa-solid", "fa-circle-exclamation", "text-red-500", "dark:text-red-400", "mt-0.5"], [1, "text-sm", "font-bold", "text-red-800", "dark:text-red-300", "mb-1"], [1, "text-xs", "text-red-600", "dark:text-red-400", "mb-2"], [1, "flex", "flex-wrap", "gap-2", "max-h-32", "overflow-y-auto", "custom-scrollbar"], [1, "bg-white", "dark:bg-slate-800", "px-2", "py-1", "rounded", "text-[10px]", "font-bold", "text-red-600", "dark:text-red-400", "border", "border-red-100", "dark:border-red-800", "flex", "items-center", "gap-1"], [1, "fa-solid", "fa-arrow-right", "text-[8px]", "text-red-300", "dark:text-red-500/50"], [1, "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-sm", "border", "border-slate-200", "dark:border-slate-700", "flex", "flex-col", "overflow-hidden", "transition-all", "duration-300", "group"], [1, "p-4", "border-b", "border-slate-100", "dark:border-slate-700", "cursor-pointer", "hover:bg-slate-50", "dark:hover:bg-slate-700/50", "transition", 3, "click"], [1, "flex", "justify-between", "items-start", "mb-2"], [1, "flex", "items-center", "gap-2", "flex-wrap"], [1, "text-[10px]", "font-bold", "text-slate-500", "dark:text-slate-400", "uppercase", "tracking-wider", "bg-slate-100", "dark:bg-slate-700", "px-2", "py-0.5", "rounded", "border", "border-slate-200", "dark:border-slate-600"], [1, "text-[9px]", "bg-red-100", "dark:bg-red-900/30", "text-red-600", "dark:text-red-400", "px-2", "py-0.5", "rounded", "font-bold", "border", "border-red-200", "dark:border-red-800", "flex", "items-center", "gap-1"], [1, "text-[9px]", "bg-yellow-100", "dark:bg-yellow-900/30", "text-yellow-700", "dark:text-yellow-400", "px-2", "py-0.5", "rounded", "font-bold", "border", "border-yellow-200", "dark:border-yellow-800", "animate-pulse", "flex", "items-center", "gap-1"], [1, "flex", "gap-2"], ["title", "T\u00E1ch m\u1EBB n\u00E0y", 1, "text-xs", "px-2", "py-1.5", "rounded", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-600", "text-slate-500", "dark:text-slate-400", "hover:text-blue-600", "dark:hover:text-blue-400", "hover:border-blue-300", "dark:hover:border-blue-500", "transition", "shadow-sm", "active:scale-95", "flex", "items-center", "gap-1", 3, "click"], [1, "fa-solid", "fa-shuffle"], [1, "hidden", "sm:inline"], ["title", "M\u1EDF r\u1ED9ng / Thu g\u1ECDn", 1, "w-7", "h-7", "flex", "items-center", "justify-center", "rounded-full", "hover:bg-slate-200", "dark:hover:bg-slate-700", "text-slate-400", "dark:text-slate-500", "transition", 3, "click"], [1, "fa-solid", "fa-chevron-down", "transition-transform", "duration-300"], [1, "mb-3"], [1, "text-base", "font-bold", "text-slate-800", "dark:text-slate-200", "leading-tight", "mb-2"], [1, "text-slate-400", "dark:text-slate-500", "font-normal", "text-xs"], [1, "flex", "items-start", "gap-2", "w-full", "mt-1", 3, "click"], [1, "bg-indigo-50", "dark:bg-indigo-900/20", "text-indigo-700", "dark:text-indigo-400", "px-2", "py-1.5", "rounded", "text-xs", "font-mono", "font-bold", "border", "border-indigo-100", "dark:border-indigo-800", "flex", "items-start", "gap-2", "shadow-sm", "w-full"], [1, "bg-white", "dark:bg-slate-800", "px-1.5", "py-0.5", "rounded", "text-[10px]", "shadow-sm", "text-slate-500", "dark:text-slate-400", "border", "border-slate-100", "dark:border-slate-700", "shrink-0", "mt-0.5"], [1, "break-words", "whitespace-normal", "flex-1"], [1, "mt-2", "rounded-lg", "border", "border-fuchsia-100", "dark:border-fuchsia-900/40", "bg-fuchsia-50/50", "dark:bg-fuchsia-950/10", "px-2.5", "py-2", "text-[10px]", "text-fuchsia-800", "dark:text-fuchsia-300", "leading-relaxed"], [1, "flex", "flex-wrap", "gap-1"], [1, "px-1.5", "py-0.5", "bg-slate-50", "dark:bg-slate-700/50", "text-slate-500", "dark:text-slate-400", "rounded", "text-[9px]", "border", "border-slate-200", "dark:border-slate-600", "font-bold", "flex", "items-center", "gap-1", "group/tag"], [1, "bg-slate-50", "dark:bg-slate-800/50", "p-3", "border-b", "border-slate-100", "dark:border-slate-700", "grid", "grid-cols-2", "md:grid-cols-4", "gap-3"], [1, "group"], ["title", "Ng\u00E0y ki\u1EC3m nghi\u1EC7m d\u1EF1 ki\u1EBFn", 1, "text-[9px]", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase", "block", "mb-1", "truncate"], [1, "text-red-500"], ["type", "date", "required", "", 1, "w-full", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "px-2", "py-1", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "outline-none", "focus:border-teal-500", "dark:focus:border-teal-400", "transition", "h-8", "shadow-sm", "[color-scheme:light]", "dark:[color-scheme:dark]", 3, "ngModelChange", "ngModel"], [1, "text-[9px]", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase", "block", "mb-1"], [1, "w-full", "bg-orange-50", "dark:bg-orange-900/20", "border", "border-orange-200", "dark:border-orange-800", "text-orange-700", "dark:text-orange-400", "text-[10px]", "font-bold", "py-1.5", "px-2", "rounded-lg", "cursor-pointer", "text-center", "flex", "items-center", "justify-center", "gap-1", "hover:bg-orange-100", "dark:hover:bg-orange-900/40", "transition", "shadow-sm", "h-8"], ["type", "number", "min", "0", "max", "100", 1, "w-full", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "px-2", "py-1", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "text-center", "outline-none", "focus:border-orange-500", "dark:focus:border-orange-400", "transition", "h-8", "shadow-sm", 3, "ngModel"], ["title", "Thi\u1EBFt b\u1ECB ph\u00E2n t\u00EDch", 1, "text-[9px]", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase", "block", "mb-1", "truncate"], [1, "w-full", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "px-1", "py-1", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "outline-none", "focus:border-teal-500", "dark:focus:border-teal-400", "cursor-pointer", "h-8", "shadow-sm", "truncate", 3, "ngModelChange", "ngModel"], [1, "w-full", "bg-white", "dark:bg-slate-800", "animate-slide-down"], [1, "px-4", "py-2", "bg-white", "dark:bg-slate-800", "flex", "items-center", "justify-between", "text-xs", "cursor-pointer", "hover:bg-slate-50", "dark:hover:bg-slate-700/50", "transition"], [1, "text-[9px]", "bg-teal-50", "dark:bg-teal-900/30", "text-teal-700", "dark:text-teal-400", "px-2", "py-0.5", "rounded", "font-bold", "border", "border-teal-200", "dark:border-teal-800"], [1, "fa-solid", "fa-star", "text-[8px]"], [1, "font-black", "uppercase", "tracking-wide", "mr-1"], [1, "fa-solid", "fa-tags", "mr-1"], ["title", "Lo\u1EA1i b\u1ECF kh\u1ECFi m\u1EBB", 1, "fa-solid", "fa-xmark", "cursor-pointer", "hover:text-red-500", "transition", "opacity-0", "group-hover/tag:opacity-100", 3, "click"], [1, "text-[9px]", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase", "block", "mb-1", "truncate", 3, "title"], [1, "w-full", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "px-1", "py-1", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "outline-none", "focus:border-teal-500", "dark:focus:border-teal-400", "cursor-pointer", "h-8", "shadow-sm", 3, "ngModel"], [1, "flex", "items-center", "h-8", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "px-2"], [1, "w-full", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "px-1", "py-1", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "outline-none", "focus:border-teal-500", "dark:focus:border-teal-400", "cursor-pointer", "h-8", "shadow-sm", 3, "ngModelChange", "ngModel"], [1, "flex", "items-center", "gap-2", "cursor-pointer", "w-full"], ["type", "checkbox", 1, "w-4", "h-4", "accent-teal-600", "rounded", 3, "ngModelChange", "ngModel"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300"], ["type", "number", 1, "w-full", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "px-2", "py-1", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "text-center", "outline-none", "focus:border-teal-500", "dark:focus:border-teal-400", "transition", "h-8", "shadow-sm", 3, "ngModelChange", "ngModel", "step"], [1, "absolute", "right-2", "top-1/2", "-translate-y-1/2", "text-[8px]", "text-slate-400", "dark:text-slate-500", "font-bold", "pointer-events-none"], [1, "w-full", "bg-orange-50", "dark:bg-orange-900/20", "border", "border-orange-200", "dark:border-orange-800", "text-orange-700", "dark:text-orange-400", "text-[10px]", "font-bold", "py-1.5", "px-2", "rounded-lg", "cursor-pointer", "text-center", "flex", "items-center", "justify-center", "gap-1", "hover:bg-orange-100", "dark:hover:bg-orange-900/40", "transition", "shadow-sm", "h-8", 3, "click"], ["type", "number", "min", "0", "max", "100", 1, "w-full", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "px-2", "py-1", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "text-center", "outline-none", "focus:border-orange-500", "dark:focus:border-orange-400", "transition", "h-8", "shadow-sm", 3, "ngModelChange", "ngModel"], [1, "hidden", "md:table", "w-full", "text-xs", "text-left", "border-collapse"], [1, "bg-white", "dark:bg-slate-800", "text-slate-400", "dark:text-slate-500", "border-b", "border-slate-50", "dark:border-slate-700/50"], [1, "px-5", "py-2", "font-bold", "uppercase", "text-[9px]", "tracking-wider"], [1, "px-5", "py-2", "font-bold", "uppercase", "text-[9px]", "text-right", "tracking-wider"], [1, "px-5", "py-2", "w-24"], [1, "divide-y", "divide-slate-50", "dark:divide-slate-700/50"], [1, "md:hidden", "flex", "flex-col", "divide-y", "divide-slate-100", "dark:divide-slate-700/50"], [1, "p-4", "hover:bg-slate-50", "dark:hover:bg-slate-700/30", "transition"], [1, "hover:bg-slate-50", "dark:hover:bg-slate-700/30", "transition", "group/row"], [1, "px-5", "py-3", "align-middle"], [1, "break-words", "whitespace-normal", "font-medium", "text-slate-700", "dark:text-slate-300", "text-xs", 3, "ngClass"], [1, "text-[9px]", "text-slate-400", "dark:text-slate-500", "italic", "font-normal", "ml-1"], [1, "px-5", "py-3", "text-right", "font-mono", "font-bold", "text-slate-600", "dark:text-slate-400", "text-xs"], [1, "text-[9px]", "text-slate-400", "dark:text-slate-500", "font-normal"], [1, "px-5", "py-3", "text-right"], [1, "text-[10px]", "bg-red-50", "dark:bg-red-900/20", "text-red-600", "dark:text-red-400", "hover:bg-red-100", "dark:hover:bg-red-900/40", "px-3", "py-1.5", "rounded-lg", "font-bold", "border", "border-red-100", "dark:border-red-800", "flex", "items-center", "gap-1", "transition", "ml-auto", "active:scale-95"], [1, "text-[10px]", "bg-red-50", "dark:bg-red-900/20", "text-red-600", "dark:text-red-400", "hover:bg-red-100", "dark:hover:bg-red-900/40", "px-3", "py-1.5", "rounded-lg", "font-bold", "border", "border-red-100", "dark:border-red-800", "flex", "items-center", "gap-1", "transition", "ml-auto", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-bolt"], [1, "bg-slate-50/30", "dark:bg-slate-800/30"], [1, "px-5", "py-2", "pl-8", "align-middle"], [1, "break-words", "whitespace-normal", "text-[10px]", "text-slate-500", "dark:text-slate-400", "flex", "items-start", "gap-1.5", "mt-0.5", 3, "ngClass"], [1, "w-1", "h-1", "rounded-full", "bg-slate-300", "dark:bg-slate-600", "shrink-0", "mt-1.5"], [1, "px-5", "py-2", "text-right", "font-mono", "text-[10px]", "text-slate-500", "dark:text-slate-400"], [1, "px-5", "py-2", "text-right"], [1, "text-[9px]", "bg-red-50", "dark:bg-red-900/20", "text-red-600", "dark:text-red-400", "hover:bg-red-100", "dark:hover:bg-red-900/40", "px-2", "py-1.5", "rounded-lg", "font-bold", "border", "border-red-100", "dark:border-red-800", "flex", "items-center", "gap-1", "transition", "ml-auto", "active:scale-95"], [1, "text-[9px]", "bg-red-50", "dark:bg-red-900/20", "text-red-600", "dark:text-red-400", "hover:bg-red-100", "dark:hover:bg-red-900/40", "px-2", "py-1.5", "rounded-lg", "font-bold", "border", "border-red-100", "dark:border-red-800", "flex", "items-center", "gap-1", "transition", "ml-auto", "active:scale-95", 3, "click"], [1, "flex", "justify-between", "items-start", "mb-1", "gap-2"], [1, "font-medium", "text-slate-700", "dark:text-slate-300", "text-xs", "flex-1", 3, "ngClass"], [1, "font-mono", "font-bold", "text-slate-600", "dark:text-slate-400", "text-xs", "shrink-0", "bg-slate-50", "dark:bg-slate-900/50", "px-2", "py-1", "rounded", "border", "border-slate-100", "dark:border-slate-700"], [1, "flex", "justify-end", "mt-3"], [1, "mt-3", "pl-3", "border-l-2", "border-indigo-100", "dark:border-indigo-800", "space-y-3"], [1, "text-[11px]", "bg-red-50", "dark:bg-red-900/20", "text-red-600", "dark:text-red-400", "hover:bg-red-100", "dark:hover:bg-red-900/40", "px-4", "py-2", "rounded-xl", "font-bold", "border", "border-red-100", "dark:border-red-800", "flex", "items-center", "gap-1.5", "transition", "active:scale-95", "w-full", "justify-center", 3, "click"], [1, "flex", "justify-between", "items-center", "gap-2"], [1, "text-[11px]", "text-slate-500", "dark:text-slate-400", "flex-1", "leading-tight", 3, "ngClass"], [1, "font-mono", "font-bold", "text-[10px]", "text-slate-500", "dark:text-slate-400", "shrink-0"], [1, "flex", "justify-end", "mt-2"], [1, "text-[10px]", "bg-red-50", "dark:bg-red-900/20", "text-red-600", "dark:text-red-400", "hover:bg-red-100", "dark:hover:bg-red-900/40", "px-3", "py-1.5", "rounded-lg", "font-bold", "border", "border-red-100", "dark:border-red-800", "flex", "items-center", "gap-1.5", "transition", "active:scale-95", 3, "click"], [1, "px-4", "py-2", "bg-white", "dark:bg-slate-800", "flex", "items-center", "justify-between", "text-xs", "cursor-pointer", "hover:bg-slate-50", "dark:hover:bg-slate-700/50", "transition", 3, "click"], [1, "text-red-600", "dark:text-red-400", "font-bold", "flex", "items-center", "gap-2"], [1, "text-emerald-600", "dark:text-emerald-400", "font-bold", "flex", "items-center", "gap-2"], [1, "text-slate-400", "dark:text-slate-500", "text-[10px]", "font-medium", "flex", "items-center", "gap-1"], [1, "fa-solid", "fa-angle-down"], [1, "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-2xl", "p-5", "shadow-sm", "animate-slide-up"], [1, "font-bold", "text-slate-800", "dark:text-slate-200", "text-sm", "mb-3", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-flask", "text-teal-500"], [1, "overflow-hidden", "rounded-xl", "border", "border-slate-100", "dark:border-slate-700"], [1, "w-full", "text-xs", "text-left"], [1, "bg-slate-50", "dark:bg-slate-900/50", "text-slate-500", "dark:text-slate-400", "font-bold", "border-b", "border-slate-100", "dark:border-slate-700"], [1, "px-3", "py-2"], [1, "px-3", "py-2", "text-right"], [1, "px-2", "w-10"], [1, "bg-white", "dark:bg-slate-800", "divide-y", "divide-slate-50", "dark:divide-slate-700/50"], [3, "ngClass"], [1, "bg-orange-50", "dark:bg-orange-900/20", "border-l-4", "border-orange-500", "rounded-lg", "p-4", "shadow-sm", "animate-slide-up", "mt-2"], [1, "px-3", "py-2", "font-medium", "break-words", "whitespace-normal", 3, "ngClass"], [1, "flex", "gap-0.5", "mt-1", "opacity-70"], [1, "text-[9px]", "text-red-500", "dark:text-red-400", "font-bold", "mt-0.5"], [1, "px-3", "py-2", "text-right", "font-bold", "font-mono", 3, "ngClass"], [1, "text-[9px]", "text-slate-400", "font-normal"], [1, "px-2", "py-1", "text-center"], ["title", "Nh\u1EADp b\u1ED5 sung", 1, "text-red-500", "dark:text-red-400", "hover:bg-red-100", "dark:hover:bg-red-900/40", "w-6", "h-6", "rounded", "flex", "items-center", "justify-center", "transition"], [1, "w-3.5", "h-3.5", 3, "src", "title"], ["title", "Nh\u1EADp b\u1ED5 sung", 1, "text-red-500", "dark:text-red-400", "hover:bg-red-100", "dark:hover:bg-red-900/40", "w-6", "h-6", "rounded", "flex", "items-center", "justify-center", "transition", 3, "click"], [1, "font-bold", "text-orange-800", "dark:text-orange-400", "text-xs", "mb-2", "uppercase", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-triangle-exclamation", "animate-pulse"], [1, "flex", "flex-wrap", "gap-2", "mb-3"], [1, "space-y-1.5", "text-[11px]", "text-orange-700", "dark:text-orange-300", "font-medium"], [1, "bg-white", "dark:bg-slate-800", "p-1.5", "rounded-md", "shadow-sm", "border", "border-orange-100", "dark:border-orange-800"], [1, "w-6", "h-6", 3, "src", "title"], [1, "flex", "items-start", "gap-1.5", "text-orange-800", "dark:text-orange-200"], [1, "fa-solid", "fa-circle", "text-[4px]", "mt-1.5", "opacity-50"], [1, "break-words", "whitespace-normal"], [1, "flex", "items-start", "gap-1.5", "opacity-80"], [1, "font-bold", "opacity-70"], [1, "fa-solid", "fa-leaf", "text-2xl", "mb-2", "text-slate-300", "dark:text-slate-600"], [1, "max-w-screen-2xl", "mx-auto", "flex", "flex-col", "md:flex-row", "items-center", "justify-between", "gap-4"], [1, "flex", "items-center", "gap-6", "text-sm", "flex-1"], [1, "w-8", "h-8", "rounded-full", "flex", "items-center", "justify-center", "shrink-0"], [1, "fa-solid"], [1, "font-bold"], [1, "text-xs", "text-slate-500", "dark:text-slate-400"], [1, "text-orange-600", "dark:text-orange-400", "ml-1"], [1, "hidden", "md:block", "text-xs", "bg-red-50", "dark:bg-red-900/20", "text-red-700", "dark:text-red-400", "px-3", "py-1.5", "rounded-lg", "border", "border-red-100", "dark:border-red-800"], [1, "flex", "items-center", "gap-2", "lg:gap-3", "w-full", "md:w-auto", "mt-3", "md:mt-0"], [1, "flex-1", "md:flex-none", "px-4", "py-3", "bg-white", "dark:bg-slate-800", "border", "border-red-200", "dark:border-red-800", "text-red-600", "dark:text-red-400", "hover:bg-red-50", "dark:hover:bg-red-900/20", "rounded-xl", "font-bold", "text-xs", "transition", "shadow-sm", "active:scale-95", "flex", "items-center", "justify-center", "gap-1"], [1, "flex-[2]", "md:flex-none", "px-4", "lg:px-8", "py-3", "bg-slate-900", "dark:bg-slate-700", "text-white", "hover:bg-black", "dark:hover:bg-slate-600", "rounded-xl", "font-bold", "text-sm", "shadow-lg", "transition", "transform", "active:scale-95", "disabled:opacity-50", "disabled:cursor-not-allowed", "flex", "items-center", "justify-center", "gap-2", 3, "click", "disabled"], [1, "fa-solid", "fa-circle-info", "mr-1"], [1, "flex-1", "md:flex-none", "px-4", "py-3", "bg-white", "dark:bg-slate-800", "border", "border-red-200", "dark:border-red-800", "text-red-600", "dark:text-red-400", "hover:bg-red-50", "dark:hover:bg-red-900/20", "rounded-xl", "font-bold", "text-xs", "transition", "shadow-sm", "active:scale-95", "flex", "items-center", "justify-center", "gap-1", 3, "click"], [1, "fa-solid", "fa-paper-plane"], [1, "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-xl", "w-full", "max-w-2xl", "overflow-hidden", "flex", "flex-col", "max-h-[90vh]", "animate-slide-up"], [1, "px-5", "py-4", "border-b", "border-slate-100", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800/50", "flex", "justify-between", "items-center", "shrink-0"], [1, "w-8", "h-8", "rounded-full", "bg-indigo-100", "dark:bg-indigo-900/30", "text-indigo-600", "dark:text-indigo-400", "flex", "items-center", "justify-center"], [1, "font-black", "text-slate-800", "dark:text-slate-200", "text-lg"], [1, "text-[11px]", "text-slate-500", "font-medium"], [1, "text-slate-400", "hover:text-slate-600", "dark:hover:text-slate-300", 3, "click"], [1, "fa-solid", "fa-times", "text-lg"], [1, "flex-1", "overflow-y-auto", "custom-scrollbar", "p-5", "space-y-6"], [1, "border", "border-amber-200", "dark:border-amber-900/50", "rounded-xl", "overflow-hidden"], [1, "border", "border-orange-200", "dark:border-orange-900/50", "rounded-xl", "overflow-hidden"], [1, "border", "border-red-200", "dark:border-red-900/50", "rounded-xl", "overflow-hidden"], [1, "p-4", "border-t", "border-slate-100", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800/50", "flex", "justify-end", "gap-2", "shrink-0"], [1, "px-4", "py-2", "border", "border-slate-200", "dark:border-slate-700", "text-slate-600", "dark:text-slate-300", "rounded-lg", "text-sm", "font-bold", "hover:bg-slate-100", "dark:hover:bg-slate-700", "transition", 3, "click"], [1, "px-6", "py-2", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "rounded-lg", "text-sm", "font-bold", "shadow-md", "transition", "disabled:opacity-50", "flex", "items-center", "gap-2", 3, "click", "disabled"], [1, "bg-amber-50", "dark:bg-amber-900/20", "px-4", "py-2", "border-b", "border-amber-200", "dark:border-amber-900/50", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-hand-pointer", "text-amber-600", "dark:text-amber-400"], [1, "font-bold", "text-amber-800", "dark:text-amber-300", "text-sm"], [1, "p-4", "space-y-4"], [1, "text-xs", "text-slate-600", "dark:text-slate-400"], [1, "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "p-3"], [1, "font-bold", "text-slate-800", "dark:text-slate-200", "text-sm"], [1, "text-[11px]", "text-slate-500", "mt-0.5"], [1, "text-[10px]", "bg-amber-100", "text-amber-700", "px-2", "py-0.5", "rounded", "font-bold"], [1, "flex", "items-center", "gap-2", "mt-2"], [1, "flex-1", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-600", "rounded", "p-1.5", "text-xs", "outline-none", "font-medium", 3, "ngModelChange", "ngModel"], ["value", "REMOVE"], [1, "bg-orange-50", "dark:bg-orange-900/20", "px-4", "py-2", "border-b", "border-orange-200", "dark:border-orange-900/50", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-triangle-exclamation", "text-orange-600", "dark:text-orange-400"], [1, "font-bold", "text-orange-800", "dark:text-orange-300", "text-sm"], [1, "mb-2"], [1, "font-bold", "text-slate-700", "dark:text-slate-300"], [1, "text-[10px]", "text-orange-600", "dark:text-orange-400", "italic", "mt-1"], [1, "flex", "gap-4", "mt-3"], [1, "flex", "items-center", "gap-1.5", "text-xs", "cursor-pointer"], ["type", "radio", 1, "accent-orange-500", 3, "change", "name", "checked"], ["type", "radio", 1, "accent-red-500", 3, "change", "name", "checked"], [1, "text-red-600"], [1, "bg-red-50", "dark:bg-red-900/20", "px-4", "py-2", "border-b", "border-red-200", "dark:border-red-900/50", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-ban", "text-red-600", "dark:text-red-400"], [1, "font-bold", "text-red-800", "dark:text-red-300", "text-sm"], [1, "flex", "flex-wrap", "gap-4", "mt-3"], [1, "font-bold", "text-red-600"], ["type", "radio", 1, "accent-slate-500", 3, "change", "name", "checked"], [1, "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-xl", "w-full", "max-w-lg", "overflow-hidden", "flex", "flex-col", "max-h-[80vh]", "animate-slide-up"], [1, "text-slate-400", "dark:text-slate-500", "hover:text-slate-600", "dark:hover:text-slate-300", 3, "click"], [1, "flex-1", "overflow-y-auto", "p-2", "custom-scrollbar"], [1, "p-8", "text-center", "text-slate-400", "dark:text-slate-500", "italic", "text-sm"], [1, "fa-solid", "fa-spinner", "fa-spin", "mb-2", "text-xl"], [1, "p-4", "border-b", "border-slate-50", "dark:border-slate-700/50", "hover:bg-indigo-50", "dark:hover:bg-indigo-900/20", "cursor-pointer", "transition", "group"], [1, "p-4", "border-b", "border-slate-50", "dark:border-slate-700/50", "hover:bg-indigo-50", "dark:hover:bg-indigo-900/20", "cursor-pointer", "transition", "group", 3, "click"], [1, "font-bold", "text-slate-700", "dark:text-slate-300", "text-sm", "group-hover:text-indigo-700", "dark:group-hover:text-indigo-400"], [1, "text-[10px]", "text-slate-500", "dark:text-slate-400", "mt-1", "flex", "justify-between"], [3, "close", "execute", "sourceBatch", "allSops"], [1, "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-xl", "w-full", "max-w-sm", "overflow-hidden", "animate-bounce-in"], [1, "p-5", "border-b", "border-slate-100", "dark:border-slate-700", "flex", "justify-between", "items-start"], [1, "font-black", "text-slate-800", "dark:text-slate-200", "text-lg", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-bolt", "text-yellow-500"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "mt-1"], [1, "fa-solid", "fa-times"], [1, "p-5", "space-y-4"], [1, "bg-slate-50", "dark:bg-slate-900/50", "p-3", "rounded-xl", "border", "border-slate-100", "dark:border-slate-700"], [1, "text-xs", "font-bold", "text-slate-500", "dark:text-slate-400", "uppercase", "mb-1"], [1, "font-bold", "text-slate-800", "dark:text-slate-200", "text-sm", "break-words", "whitespace-normal"], [1, "flex", "justify-between", "mt-2", "pt-2", "border-t", "border-slate-200", "dark:border-slate-700"], [1, "text-[10px]", "text-slate-500", "dark:text-slate-400"], [1, "text-slate-700", "dark:text-slate-300"], [1, "text-red-600", "dark:text-red-400"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "uppercase", "block", "mb-1"], ["type", "number", "placeholder", "0", 1, "w-full", "pl-4", "pr-12", "py-3", "border", "border-slate-300", "dark:border-slate-600", "rounded-xl", "text-lg", "font-bold", "text-emerald-600", "dark:text-emerald-400", "outline-none", "focus:border-emerald-500", "dark:focus:border-emerald-400", "focus:ring-2", "focus:ring-emerald-100", "dark:focus:ring-emerald-900/30", "transition", "bg-white", "dark:bg-slate-900", 3, "ngModelChange", "ngModel"], [1, "absolute", "right-4", "top-3.5", "text-xs", "font-bold", "text-slate-400", "dark:text-slate-500"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "mt-1", "italic"], [1, "p-5", "border-t", "border-slate-100", "dark:border-slate-700", "flex", "gap-3"], [1, "flex-1", "py-3", "text-slate-500", "dark:text-slate-400", "font-bold", "text-xs", "bg-slate-100", "dark:bg-slate-700", "hover:bg-slate-200", "dark:hover:bg-slate-600", "rounded-xl", "transition", 3, "click"], [1, "flex-[2]", "py-3", "bg-emerald-600", "hover:bg-emerald-700", "text-white", "rounded-xl", "font-bold", "text-sm", "shadow-md", "transition", "disabled:opacity-50", 3, "click", "disabled"], [3, "close", "generated"]], template: function SmartBatchComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "datalist", 1);
            i0.ɵɵrepeaterCreate(2, SmartBatchComponent_For_3_Template, 2, 2, "option", 2, _forTrack0);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "div", 3)(5, "div", 4)(6, "div", 5);
            i0.ɵɵelement(7, "i", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "div")(9, "h2", 7);
            i0.ɵɵtext(10, " L\u1EADp m\u1EBB ph\u00E2n t\u00EDch t\u1EF1 \u0111\u1ED9ng ");
            i0.ɵɵtemplate(11, SmartBatchComponent_Conditional_11_Template, 2, 1);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "p", 8);
            i0.ɵɵtext(13, "T\u1EF1 \u0111\u1ED9ng gh\u00E9p SOP theo ch\u1EC9 ti\u00EAu v\u00E0 t\u1ED1i \u01B0u l\u01B0\u1EE3ng h\u00F3a ch\u1EA5t s\u1EED d\u1EE5ng.");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(14, "div", 9);
            i0.ɵɵtemplate(15, SmartBatchComponent_Conditional_15_Template, 3, 0, "button", 10)(16, SmartBatchComponent_Conditional_16_Template, 3, 0, "button", 11)(17, SmartBatchComponent_Conditional_17_Template, 3, 0, "button", 11);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(18, "div", 12);
            i0.ɵɵtemplate(19, SmartBatchComponent_Conditional_19_Template, 29, 0, "div", 13)(20, SmartBatchComponent_Conditional_20_Template, 3, 2, "div", 14);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(21, SmartBatchComponent_Conditional_21_Template, 21, 13, "div", 15)(22, SmartBatchComponent_Conditional_22_Template, 23, 6, "div", 16)(23, SmartBatchComponent_Conditional_23_Template, 10, 1, "div", 16)(24, SmartBatchComponent_Conditional_24_Template, 3, 0)(25, SmartBatchComponent_Conditional_25_Template, 40, 7, "div", 17)(26, SmartBatchComponent_Conditional_26_Template, 3, 0);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(2);
            i0.ɵɵrepeater(ctx.availableSampleDescriptions());
            i0.ɵɵadvance(9);
            i0.ɵɵconditional(ctx.step() >= 1 ? 11 : -1);
            i0.ɵɵadvance(4);
            i0.ɵɵconditional(ctx.auth.canViewSop() ? 15 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.step() === 1 ? 16 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.step() === 2 ? 17 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.step() === 0 ? 19 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.step() > 0 ? 20 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.step() === 2 ? 21 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.fixCoverageState().isOpen ? 22 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showGroupModal() ? 23 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showSplitModal() && ctx.splitState().sourceBatchIndex >= 0 ? 24 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showQuickImport() ? 25 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.quickGenerateModalOpen() ? 26 : -1);
        } }, dependencies: [CommonModule, i1.NgClass, FormsModule, i2.NgSelectOption, i2.ɵNgSelectMultipleOption, i2.DefaultValueAccessor, i2.NumberValueAccessor, i2.CheckboxControlValueAccessor, i2.SelectControlValueAccessor, i2.NgControlStatus, i2.RequiredValidator, i2.MinValidator, i2.MaxValidator, i2.NgModel], encapsulation: 2, changeDetection: 0 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadataAsync(SmartBatchComponent, () => [import("./components/batch-split-wizard.component").then(m => m.BatchSplitWizardComponent), import("../../shared/components/quick-generate-sample-modal/quick-generate-sample-modal.component").then(m => m.QuickGenerateSampleModalComponent)], (BatchSplitWizardComponent, QuickGenerateSampleModalComponent) => { i0.ɵsetClassMetadata(SmartBatchComponent, [{
        type: Component,
        args: [{ selector: 'app-smart-batch', standalone: true, imports: [CommonModule, FormsModule, QuickGenerateSampleModalComponent, BatchSplitWizardComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "    <div class=\"h-full flex flex-col fade-in pb-0 relative font-sans text-slate-800 dark:text-slate-200\">\r\n        <datalist id=\"sample-description-master-options\">\r\n            @for (description of availableSampleDescriptions(); track description.id) {\r\n                <option [value]=\"description.name\">{{description.aliases?.join(', ') || description.description || ''}}</option>\r\n            }\r\n        </datalist>\r\n        <!-- HEADER -->\r\n        <div class=\"flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 shrink-0\">\r\n            <div class=\"flex items-center gap-3\">\r\n                <div class=\"w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-100 dark:border-teal-800/30 shadow-sm shrink-0\">\r\n                    <i class=\"fa-solid fa-layer-group text-base\"></i>\r\n                </div>\r\n                <div>\r\n                    <h2 class=\"text-xl font-black text-slate-850 dark:text-slate-100 tracking-tight leading-tight flex items-center gap-2\">\r\n                        L\u1EADp m\u1EBB ph\u00E2n t\u00EDch t\u1EF1 \u0111\u1ED9ng\r\n                        @if (step() >= 1) {\r\n                            @if (smartBatchMode() === 'multiple') {\r\n                                <span class=\"text-[10px] bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 px-2 py-0.5 rounded-full font-bold border border-teal-200 dark:border-teal-800 shrink-0\">\r\n                                    <i class=\"fa-solid fa-layer-group text-[9px] mr-1\"></i>Gh\u00E9p Nhi\u1EC1u M\u1EABu\r\n                                </span>\r\n                            } @else {\r\n                                <span class=\"text-[10px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full font-bold border border-indigo-200 dark:border-indigo-800 shrink-0\">\r\n                                    <i class=\"fa-solid fa-vial text-[9px] mr-1\"></i>M\u1ED9t M\u1EABu Duy Nh\u1EA5t\r\n                                </span>\r\n                            }\r\n                        }\r\n                    </h2>\r\n                    <p class=\"text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5\">T\u1EF1 \u0111\u1ED9ng gh\u00E9p SOP theo ch\u1EC9 ti\u00EAu v\u00E0 t\u1ED1i \u01B0u l\u01B0\u1EE3ng h\u00F3a ch\u1EA5t s\u1EED d\u1EE5ng.</p>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"flex flex-wrap justify-end gap-2\">\r\n                @if(auth.canViewSop()) {\r\n                    <button type=\"button\"\r\n                            (click)=\"openSopCalculator()\"\r\n                            class=\"px-4 py-2 border border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl font-bold text-xs hover:bg-blue-100 dark:hover:bg-blue-900/35 transition active:scale-95\"\r\n                            title=\"M\u1EDF SOP Calculator khi c\u1EA7n t\u00EDnh nhanh ho\u1EB7c ki\u1EC3m tra chi ti\u1EBFt\">\r\n                        <i class=\"fa-solid fa-calculator mr-1\"></i> T\u00EDnh nhanh SOP\r\n                    </button>\r\n                }\r\n                @if(step() === 1) {\r\n                    <button (click)=\"goBackToStep0()\" class=\"px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition\">\r\n                        <i class=\"fa-solid fa-chevron-left mr-1\"></i> \u0110\u1ED5i Ch\u1EBF \u0110\u1ED9\r\n                    </button>\r\n                }\r\n                @if(step() === 2) {\r\n                    <button (click)=\"goBackFromStep2()\" class=\"px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition\">\r\n                        <i class=\"fa-solid fa-rotate-left mr-1\"></i> Quay L\u1EA1i\r\n                    </button>\r\n                }\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"flex-1 overflow-y-auto custom-scrollbar relative pb-32 lg:pb-36 p-2 lg:p-1\">\r\n            @if(step() === 0) {\r\n                <!-- B\u01AF\u1EDAC 0: CH\u1ECCN CH\u1EBE \u0110\u1ED8 -->\r\n                <div class=\"max-w-4xl mx-auto py-12 px-4 animate-fade-in\">\r\n                    <div class=\"text-center mb-10\">\r\n                        <h3 class=\"text-2xl font-black text-slate-850 dark:text-slate-100 tracking-tight\">Ch\u1ECDn C\u00E1ch L\u1EADp M\u1EBB</h3>\r\n                        <p class=\"text-xs font-medium text-slate-500 dark:text-slate-400 mt-2\">Vui l\u00F2ng ch\u1ECDn ch\u1EBF \u0111\u1ED9 thi\u1EBFt l\u1EADp ph\u00F9 h\u1EE3p v\u1EDBi nhu c\u1EA7u ph\u00E2n t\u00EDch c\u1EE7a b\u1EA1n</p>\r\n                    </div>\r\n\r\n                    <div class=\"grid grid-cols-1 md:grid-cols-2 gap-6\">\r\n                        <!-- Mode 1: Multiple Samples -->\r\n                        <div (click)=\"selectMode('multiple')\"\r\n                             class=\"group cursor-pointer bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-750 p-6 shadow-sm hover:shadow-xl hover:border-teal-400 dark:hover:border-teal-500 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between min-h-[220px]\">\r\n                            <div>\r\n                                <div class=\"w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-100 dark:border-teal-800/30 shadow-sm mb-4 group-hover:scale-110 transition-transform\">\r\n                                    <i class=\"fa-solid fa-layer-group text-xl\"></i>\r\n                                </div>\r\n                                <h4 class=\"text-lg font-black text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors\">Gh\u00E9p Nhi\u1EC1u M\u1EABu</h4>\r\n                                <p class=\"text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed\">\r\n                                    Ph\u00E2n t\u00EDch \u0111\u1ED3ng th\u1EDDi nhi\u1EC1u m\u1EABu kh\u00E1c nhau, t\u1EF1 \u0111\u1ED9ng t\u1ED1i \u01B0u h\u00F3a v\u00E0 gh\u00E9p c\u00E1c m\u1EABu c\u00F3 chung ch\u1EC9 ti\u00EAu v\u00E0o c\u00E1c quy tr\u00ECnh (SOP) ch\u1EA1y chung \u0111\u1EC3 ti\u1EBFt ki\u1EC7m h\u00F3a ch\u1EA5t.\r\n                                </p>\r\n                            </div>\r\n                            <div class=\"flex items-center gap-1.5 text-xs font-black text-teal-600 dark:text-teal-400 mt-4 group-hover:translate-x-1 transition-transform\">\r\n                                B\u1EAFt \u0111\u1EA7u <i class=\"fa-solid fa-arrow-right\"></i>\r\n                            </div>\r\n                        </div>\r\n\r\n                        <!-- Mode 2: Single Sample -->\r\n                        <div (click)=\"selectMode('single')\"\r\n                             class=\"group cursor-pointer bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-750 p-6 shadow-sm hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between min-h-[220px]\">\r\n                            <div>\r\n                                <div class=\"w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/30 shadow-sm mb-4 group-hover:scale-110 transition-transform\">\r\n                                    <i class=\"fa-solid fa-vial text-xl\"></i>\r\n                                </div>\r\n                                <h4 class=\"text-lg font-black text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors\">M\u1ED9t M\u1EABu Duy Nh\u1EA5t</h4>\r\n                                <p class=\"text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed\">\r\n                                    Ph\u00E2n t\u00EDch m\u1ED9t m\u1EABu ki\u1EC3m nghi\u1EC7m duy nh\u1EA5t, t\u1EF1 \u0111\u1ED9ng ph\u00E2n chia c\u00E1c ch\u1EC9 ti\u00EAu ph\u00E2n t\u00EDch \u0111\u0103ng k\u00FD v\u00E0o c\u00E1c m\u1EBB ch\u1EA1y/SOP ph\u00F9 h\u1EE3p c\u1EE7a ph\u00F2ng th\u00ED nghi\u1EC7m.\r\n                                </p>\r\n                            </div>\r\n                            <div class=\"flex items-center gap-1.5 text-xs font-black text-indigo-600 dark:text-indigo-400 mt-4 group-hover:translate-x-1 transition-transform\">\r\n                                B\u1EAFt \u0111\u1EA7u <i class=\"fa-solid fa-arrow-right\"></i>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            }\r\n\r\n            @if(step() > 0) {\r\n                <div class=\"flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 min-h-fit w-full\">\r\n\r\n            <!-- STEP 1: JOB BUILDER -->\r\n            @if(step() === 1) {\r\n                <!-- Left: Blocks List / Single Sample Config -->\r\n                <div class=\"flex-1 flex flex-col bg-transparent gap-4 animate-fade-in\">\r\n                    @if(smartBatchMode() === 'multiple') {\r\n                        <div class=\"space-y-4\">\r\n                            @for (block of blocks(); track block.id; let i = $index) {\r\n                                <div class=\"bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden animate-slide-up transition-all hover:shadow-md group\">\r\n                                    <!-- Block Header -->\r\n                                    <div class=\"bg-slate-50/50 dark:bg-slate-800/50 p-3 flex justify-between items-center border-b border-slate-100 dark:border-slate-700 cursor-pointer\"\r\n                                         (click)=\"toggleBlockCollapse(i)\">\r\n                                        <div class=\"flex items-center gap-3\">\r\n                                            <div class=\"w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold\">{{i + 1}}</div>\r\n                                            @if(isEditingName() === block.id) {\r\n                                                <input [ngModel]=\"block.name\" (ngModelChange)=\"updateBlockName(i, $event)\"\r\n                                                       (blur)=\"isEditingName.set(null)\" (keyup.enter)=\"isEditingName.set(null)\" (click)=\"$event.stopPropagation()\"\r\n                                                       class=\"font-bold text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 outline-none focus:border-teal-500 dark:focus:border-teal-400 text-slate-800 dark:text-slate-200\">\r\n                                            } @else {\r\n                                                <h3 class=\"font-bold text-slate-700 dark:text-slate-200 text-sm flex items-center gap-2\" (dblclick)=\"isEditingName.set(block.id)\">\r\n                                                    {{block.name}} <i class=\"fa-solid fa-pen text-[10px] text-slate-300 dark:text-slate-500 opacity-0 group-hover:opacity-100\"></i>\r\n                                                </h3>\r\n                                            }\r\n                                            <span class=\"text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-600\">\r\n                                                {{ countSamples(block.rawSamples) }} m\u1EABu \u2022 {{ block.selectedTargets.size }} ch\u1EC9 ti\u00EAu\r\n                                            </span>\r\n                                        </div>\r\n                                        <div class=\"flex items-center gap-2\">\r\n                                            <!-- Matrix Selector in Header -->\r\n                                            <div class=\"flex items-center gap-2 mr-1 md:mr-3 border-r border-slate-200 dark:border-slate-700 pr-2 md:pr-4\" (click)=\"$event.stopPropagation()\">\r\n                                                <span class=\"text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase hidden md:block\">N\u1EC1n m\u1EABu:</span>\r\n                                                <select [ngModel]=\"block.matrixType || ''\" (ngModelChange)=\"updateBlockMatrix(i, $event === '' ? undefined : $event)\"\r\n                                                        class=\"bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-teal-500 dark:focus:border-teal-400 cursor-pointer shadow-sm max-w-[140px] truncate\">\r\n                                                    <option value=\"\">D\u00F9ng chung (ANY)</option>\r\n                                                    @for (m of availableMatrices(); track m.id) {\r\n                                                        <option [value]=\"m.id\">{{m.name}}</option>\r\n                                                    }\r\n                                                </select>\r\n                                            </div>\r\n\r\n                                            <button (click)=\"duplicateBlock(i); $event.stopPropagation()\" class=\"w-8 h-8 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition\" title=\"Nh\u00E2n b\u1EA3n\">\r\n                                                <i class=\"fa-regular fa-clone\"></i>\r\n                                            </button>\r\n                                            <button (click)=\"removeBlock(i); $event.stopPropagation()\" class=\"w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition\" title=\"X\u00F3a\">\r\n                                                <i class=\"fa-solid fa-trash\"></i>\r\n                                            </button>\r\n                                            <i class=\"fa-solid fa-chevron-down text-slate-400 dark:text-slate-500 text-xs transition-transform duration-300 ml-2\" [class.rotate-180]=\"block.isCollapsed\"></i>\r\n                                        </div>\r\n                                    </div>\r\n\r\n                                    <!-- Block Body -->\r\n                                    @if(!block.isCollapsed) {\r\n                                        <div class=\"p-3 lg:p-4 flex flex-col gap-4\">\r\n                                            <div class=\"grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6\">\r\n                                                <!-- Sample Input -->\r\n                                            <div class=\"flex flex-col\">\r\n                                                <div class=\"flex justify-between items-center mb-1\">\r\n                                                    <label class=\"text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block\">Danh s\u00E1ch m\u1EABu</label>\r\n                                                    <button (click)=\"openQuickGenerateModal(i)\" class=\"text-[10px] text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded transition font-bold flex items-center gap-1\">\r\n                                                        <i class=\"fa-solid fa-layer-group\"></i> T\u1EA1o Nhanh\r\n                                                    </button>\r\n                                                </div>\r\n                                                <textarea [ngModel]=\"block.rawSamples\" (ngModelChange)=\"updateBlockSamples(i, $event)\"\r\n                                                          class=\"w-full h-40 p-3 text-sm font-mono border border-slate-200 dark:border-slate-700 rounded-xl focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-200 dark:focus:ring-teal-900/30 outline-none resize-none bg-slate-50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 transition text-slate-800 dark:text-slate-200\"\r\n                                                          placeholder=\"A01&#10;A02&#10;...\"></textarea>\r\n                                                @if (getBlockSamples(block).length > 0) {\r\n                                                    <details class=\"mt-2 rounded-xl border border-fuchsia-100 dark:border-fuchsia-900/40 bg-fuchsia-50/40 dark:bg-fuchsia-950/10 overflow-hidden\">\r\n                                                        <summary class=\"px-3 py-2 cursor-pointer text-[10px] font-black uppercase tracking-wide text-fuchsia-700 dark:text-fuchsia-400 flex items-center justify-between gap-2\">\r\n                                                            <span><i class=\"fa-solid fa-tags mr-1.5\"></i>M\u00F4 t\u1EA3 t\u1EEBng m\u1EABu \u2014 t\u00F9y ch\u1ECDn</span>\r\n                                                            <span class=\"normal-case text-slate-400\">{{getBlockDescriptionCount(block)}}/{{getBlockSamples(block).length}} m\u1EABu</span>\r\n                                                        </summary>\r\n                                                        <div class=\"max-h-64 overflow-y-auto custom-scrollbar border-t border-fuchsia-100 dark:border-fuchsia-900/40 divide-y divide-fuchsia-100/70 dark:divide-fuchsia-900/30\">\r\n                                                            @for (sampleCode of getBlockSamples(block); track sampleCode) {\r\n                                                                <div class=\"grid grid-cols-[minmax(90px,0.7fr)_minmax(150px,1.3fr)_auto] gap-2 items-center px-3 py-2 bg-white/70 dark:bg-slate-900/40 group\">\r\n                                                                    <span class=\"font-mono text-xs font-black text-slate-700 dark:text-slate-300 break-all\">{{sampleCode}}</span>\r\n                                                                    <div class=\"relative\">\r\n                                                                        <i class=\"fa-solid fa-tag absolute left-2.5 top-1/2 -translate-y-1/2 text-fuchsia-300 text-[10px]\"></i>\r\n                                                                        <input [ngModel]=\"getBlockSampleDescription(block, sampleCode)\"\r\n                                                                               (ngModelChange)=\"updateBlockSampleDescription(i, sampleCode, $event)\"\r\n                                                                               list=\"sample-description-master-options\"\r\n                                                                               class=\"w-full h-8 pl-7 pr-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-fuchsia-400\"\r\n                                                                               placeholder=\"Ch\u1ECDn ho\u1EB7c nh\u1EADp m\u00F4 t\u1EA3...\">\r\n                                                                    </div>\r\n                                                                    <button (click)=\"applyDescriptionToAll(i, sampleCode)\" \r\n                                                                            class=\"w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:text-fuchsia-600 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/30 transition opacity-0 group-hover:opacity-100 focus:opacity-100\"\r\n                                                                            title=\"\u00C1p d\u1EE5ng m\u00F4 t\u1EA3 n\u00E0y cho t\u1EA5t c\u1EA3 c\u00E1c m\u1EABu trong m\u1EBB\">\r\n                                                                        <i class=\"fa-solid fa-clone text-[11px]\"></i>\r\n                                                                    </button>\r\n                                                                </div>\r\n                                                            }\r\n                                                        </div>\r\n                                                        <p class=\"px-3 py-2 text-[9px] text-slate-400 border-t border-fuchsia-100 dark:border-fuchsia-900/40\">T\u00EAn ch\u1ECDn t\u1EEB danh m\u1EE5c g\u1ED1c \u0111\u01B0\u1EE3c l\u01B0u k\u00E8m m\u00E3 \u0111\u1ECBnh danh; n\u1ED9i dung nh\u1EADp t\u1EF1 do \u0111\u01B0\u1EE3c l\u01B0u t\u1EA1i th\u1EDDi \u0111i\u1EC3m l\u1EADp m\u1EBB.</p>\r\n                                                    </details>\r\n                                                }\r\n                                            </div>\r\n\r\n                                            <!-- Target Selector -->\r\n                                            <div class=\"flex flex-col h-40\">\r\n                                                <label class=\"text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 block\">Ch\u1EC9 ti\u00EAu ki\u1EC3m nghi\u1EC7m</label>\r\n                                                <div class=\"flex gap-2 mb-2\">\r\n                                                    <div class=\"relative flex-1\">\r\n                                                        <i class=\"fa-solid fa-search absolute left-2.5 top-2.5 text-slate-400 dark:text-slate-500 text-xs\"></i>\r\n                                                        <input [ngModel]=\"block.targetSearch\" (ngModelChange)=\"updateBlockSearch(i, $event)\"\r\n                                                               class=\"w-full pl-8 pr-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:border-teal-500 dark:focus:border-teal-400 transition bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200\"\r\n                                                               placeholder=\"T\u00ECm ch\u1EC9 ti\u00EAu...\">\r\n                                                    </div>\r\n                                                    <button (click)=\"openGroupModal(i)\" class=\"px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-lg border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition flex items-center gap-1 text-[10px] font-bold\" title=\"Ch\u1ECDn t\u1EEB B\u1ED9 ch\u1EC9 ti\u00EAu\">\r\n                                                        <i class=\"fa-solid fa-layer-group\"></i> Groups\r\n                                                    </button>\r\n                                                    <button (click)=\"selectAllTargets(i)\" class=\"px-2 py-1.5 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 rounded-lg border border-teal-100 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900/40 transition\" title=\"Ch\u1ECDn t\u1EA5t c\u1EA3\">\r\n                                                        <i class=\"fa-solid fa-check-double text-xs\"></i>\r\n                                                    </button>\r\n                                                    <button (click)=\"deselectAllTargets(i)\" class=\"px-2 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition\" title=\"B\u1ECF ch\u1ECDn t\u1EA5t c\u1EA3\">\r\n                                                        <i class=\"fa-solid fa-xmark text-xs\"></i>\r\n                                                    </button>\r\n                                                </div>\r\n\r\n                                                <div class=\"flex-1 border border-slate-200 dark:border-slate-700 rounded-xl overflow-y-auto custom-scrollbar p-1 bg-white dark:bg-slate-900\">\r\n                                                    @for (t of filteredTargetsMap().get(block.id) || []; track t.uniqueKey) {\r\n                                                        <label class=\"flex items-center gap-2 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded cursor-pointer group\"\r\n                                                               [ngClass]=\"{'bg-teal-50 dark:bg-teal-900/20': block.selectedTargets.has(t.uniqueKey)}\">\r\n                                                            <input type=\"checkbox\"\r\n                                                                   [checked]=\"block.selectedTargets.has(t.uniqueKey)\"\r\n                                                                   (change)=\"toggleBlockTarget(i, t.uniqueKey)\"\r\n                                                                   class=\"w-3.5 h-3.5 accent-teal-600 rounded cursor-pointer\">\r\n                                                            <div class=\"flex-1 min-w-0\">\r\n                                                                <div class=\"text-xs font-bold text-slate-700 dark:text-slate-300 truncate group-hover:text-teal-700 dark:group-hover:text-teal-400\">{{t.name}}</div>\r\n                                                            </div>\r\n                                                        </label>\r\n                                                    }\r\n                                                    @if((filteredTargetsMap().get(block.id) || []).length === 0) {\r\n                                                        <div class=\"text-center py-4 text-slate-400 dark:text-slate-500 text-[10px] italic\">Kh\u00F4ng t\u00ECm th\u1EA5y.</div>\r\n                                                    }\r\n                                                </div>\r\n                                            </div>\r\n                                        </div>\r\n\r\n                                        <!-- NEW: Eligible SOP Display (Bottom of Block Body) -->\r\n                                        <div class=\"bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/50 rounded-xl p-3\">\r\n                                            <label class=\"text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase mb-2 flex items-center justify-between\">\r\n                                                <span><i class=\"fa-solid fa-code-branch mr-1\"></i> G\u1EE3i \u00FD Quy tr\u00ECnh (SOP)</span>\r\n                                                @if(block.forcedSopId) {\r\n                                                    <button (click)=\"updateBlockForcedSop(i, undefined)\" class=\"text-xs text-red-500 hover:text-red-600 capitalize font-medium transition cursor-pointer\">B\u1ECF Ch\u1EC9 \u0110\u1ECBnh</button>\r\n                                                }\r\n                                            </label>\r\n\r\n                                            @if(block.selectedTargets.size === 0) {\r\n                                                <p class=\"text-[11px] text-slate-500 dark:text-slate-400 italic font-medium\">Vui l\u00F2ng ch\u1ECDn \u00EDt nh\u1EA5t 1 ch\u1EC9 ti\u00EAu \u0111\u1EC3 xem c\u00E1c quy tr\u00ECnh ph\u00F9 h\u1EE3p.</p>\r\n                                            } @else {\r\n                                                @if ((sopSuggestionsMap().get(block.id) || []).length === 0 && !block.forcedSopId) {\r\n                                                    <p class=\"text-[11px] text-orange-600 dark:text-orange-400 italic font-medium mb-3\">Kh\u00F4ng t\u00ECm th\u1EA5y quy tr\u00ECnh ph\u00F9 h\u1EE3p. H\u00E3y ki\u1EC3m tra l\u1EA1i c\u1EA5u h\u00ECnh n\u1EC1n m\u1EABu ho\u1EB7c danh m\u1EE5c ch\u1EC9 ti\u00EAu.</p>\r\n                                                } @else {\r\n                                                    @if((sopSuggestionsMap().get(block.id) || []).length > 0 && (sopSuggestionsMap().get(block.id) || [])[0].isPartial && !block.forcedSopId) {\r\n                                                        <div class=\"mb-2 text-[11px] text-orange-600 dark:text-orange-400 font-medium flex items-start gap-1.5\">\r\n                                                            <i class=\"fa-solid fa-triangle-exclamation mt-0.5\"></i>\r\n                                                            <p>Kh\u00F4ng c\u00F3 quy tr\u00ECnh n\u00E0o bao ph\u1EE7 to\u00E0n b\u1ED9 m\u1EE5c ti\u00EAu. C\u00E1c quy tr\u00ECnh g\u1EA7n nh\u1EA5t d\u01B0\u1EDBi \u0111\u00E2y ch\u1EC9 mang t\u00EDnh tham kh\u1EA3o, nh\u00F3m s\u1EBD t\u1EF1 \u0111\u1ED9ng ph\u00E2n t\u00E1ch m\u1EBB \u1EDF B\u01B0\u1EDBc 2.</p>\r\n                                                        </div>\r\n                                                    }\r\n                                                    @if(block.forcedSopId && (sopSuggestionsMap().get(block.id) || []).length > 0 && (sopSuggestionsMap().get(block.id) || [])[0].isPartial && (sopSuggestionsMap().get(block.id) || [])[0].sop.id === block.forcedSopId) {\r\n                                                        <div class=\"mb-3 text-[11px] bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-500 font-medium flex flex-col gap-1.5 p-2 rounded-lg border border-yellow-200 dark:border-yellow-900/50\">\r\n                                                            <div class=\"flex items-start gap-1.5\">\r\n                                                                <i class=\"fa-solid fa-triangle-exclamation mt-0.5 text-yellow-600 dark:text-yellow-500\"></i>\r\n                                                                <p>Quy tr\u00ECnh \u0111\u01B0\u1EE3c ch\u1EC9 \u0111\u1ECBnh ch\u1EC9 bao ph\u1EE7 <b>{{ (sopSuggestionsMap().get(block.id) || [])[0].coverageCount }}/{{ (sopSuggestionsMap().get(block.id) || [])[0].totalRequired }}</b> ch\u1EC9 ti\u00EAu. <b>{{ (sopSuggestionsMap().get(block.id) || [])[0].missingTargets.length }}</b> ch\u1EC9 ti\u00EAu c\u00F2n l\u1EA1i d\u01B0\u1EDBi \u0111\u00E2y s\u1EBD \u0111\u01B0\u1EE3c h\u1EC7 th\u1ED1ng t\u1EF1 \u0111\u1ED9ng t\u00E1ch sang m\u1EBB m\u1EDBi \u1EDF B\u01B0\u1EDBc 2:</p>\r\n                                                            </div>\r\n                                                            <div class=\"flex flex-wrap gap-1 mt-1 pl-4\">\r\n                                                                @for(mt of (sopSuggestionsMap().get(block.id) || [])[0].missingTargets; track mt.id) {\r\n                                                                    <span class=\"px-1.5 py-0.5 bg-white/60 dark:bg-black/20 border border-yellow-200 dark:border-yellow-900/50 rounded text-[9px] font-bold text-yellow-700 dark:text-yellow-400\">{{mt.name}}</span>\r\n                                                                }\r\n                                                            </div>\r\n                                                        </div>\r\n                                                    }\r\n\r\n                                                    <div class=\"flex flex-wrap gap-2\">\r\n                                                        @for(sug of sopSuggestionsMap().get(block.id) || []; track sug.sop.id) {\r\n                                                            <div class=\"flex flex-col rounded-lg border transition bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 overflow-hidden\"\r\n                                                                 [class.ring-2]=\"block.forcedSopId === sug.sop.id\"\r\n                                                                 [class.ring-indigo-500]=\"block.forcedSopId === sug.sop.id\">\r\n\r\n                                                                 <!-- Th\u00E2n n\u00FAt: Nh\u1EA5n \u0111\u1EC3 ch\u1EC9 \u0111\u1ECBnh -->\r\n                                                                 <button (click)=\"updateBlockForcedSop(i, sug.sop.id)\"\r\n                                                                         [disabled]=\"sug.isPartial && !sug.sop.isManualOnly\"\r\n                                                                         class=\"px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 disabled:opacity-75 disabled:cursor-not-allowed transition\">\r\n\r\n                                                                     <div class=\"flex items-center gap-2 mb-1\">\r\n                                                                         @if(sug.sop.isManualOnly) {\r\n                                                                             <span class=\"bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 text-[9px] px-1.5 py-0.5 rounded font-black tracking-wide uppercase\"><i class=\"fa-solid fa-crosshairs mr-0.5\"></i> Ch\u1EC9 \u0110\u1ECBnh Th\u1EE7 C\u00F4ng</span>\r\n                                                                         } @else if(sug.isBest && !sug.isPartial) {\r\n                                                                             <span class=\"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-[9px] px-1.5 py-0.5 rounded font-black tracking-wide uppercase\"><i class=\"fa-solid fa-star mr-0.5\"></i> T\u1ED1t Nh\u1EA5t</span>\r\n                                                                         }\r\n                                                                         <span class=\"text-xs font-bold text-slate-700 dark:text-slate-200 flex-1\">{{sug.sop.name}}</span>\r\n                                                                         @if(block.forcedSopId === sug.sop.id) {\r\n                                                                             <i class=\"fa-solid fa-circle-check text-indigo-600 dark:text-indigo-400\"></i>\r\n                                                                         }\r\n                                                                     </div>\r\n\r\n                                                                     <div class=\"flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400\">\r\n                                                                         @if(sug.sop.matrixTags && sug.sop.matrixTags.length > 0) {\r\n                                                                             <span class=\"flex items-center gap-1\">\r\n                                                                                 <div class=\"w-1.5 h-1.5 rounded-full\" [style.background-color]=\"getMatrixColor(sug.sop.matrixTags[0])\"></div>\r\n                                                                                 {{getMatrixLabel(sug.sop.matrixTags[0])}}\r\n                                                                             </span>\r\n                                                                         } @else {\r\n                                                                             <span class=\"flex items-center gap-1\">\r\n                                                                                 <div class=\"w-1.5 h-1.5 rounded-full bg-slate-400\"></div> D\u00F9ng Chung\r\n                                                                             </span>\r\n                                                                         }\r\n                                                                         <span [class.text-red-500]=\"sug.isPartial\" class=\"font-medium\">\r\n                                                                             <i class=\"fa-solid fa-bullseye mr-0.5\"></i> {{sug.coverageCount}}/{{sug.totalRequired}}\r\n                                                                         </span>\r\n                                                                         @if(sug.isMissingStock) {\r\n                                                                             <span class=\"text-red-500 font-bold\" title=\"C\u00F3 h\u00F3a ch\u1EA5t b\u1ECB h\u1EBFt (T\u1ED3n = 0)\"><i class=\"fa-solid fa-triangle-exclamation\"></i> Kho</span>\r\n                                                                         } @else {\r\n                                                                             <span class=\"text-teal-600 dark:text-teal-400\"><i class=\"fa-solid fa-check\"></i> Kho</span>\r\n                                                                         }\r\n                                                                     </div>\r\n                                                                 </button>\r\n\r\n                                                                 <!-- Ch\u00E2n n\u00FAt: Icon Xem -->\r\n                                                                 <div class=\"bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700/50 py-1 px-3 text-center hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition\" (click)=\"openSopPreview(i, sug); $event.stopPropagation()\">\r\n                                                                     <button class=\"text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline w-full pointer-events-none\">\r\n                                                                         <i class=\"fa-regular fa-eye mr-1\"></i> Xem Chi Ti\u1EBFt\r\n                                                                     </button>\r\n                                                                 </div>\r\n                                                            </div>\r\n                                                        }\r\n                                                    </div>\r\n                                                }\r\n                                                \r\n                                                @if((eligibleManualSopsMap().get(block.id) || []).length > 0) {\r\n                                                    <div class=\"mt-3 pt-2.5 border-t border-indigo-100/50 dark:border-indigo-950/20 flex items-center gap-2\">\r\n                                                        <span class=\"text-[10px] font-black text-indigo-750 dark:text-indigo-400 whitespace-nowrap\">CH\u1EC8 \u0110\u1ECANH TH\u1EE6 C\u00D4NG:</span>\r\n                                                        <select [ngModel]=\"block.forcedSopId || ''\" \r\n                                                                (ngModelChange)=\"updateBlockForcedSop(i, $event === '' ? undefined : $event)\"\r\n                                                                class=\"flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs outline-none focus:border-indigo-500 cursor-pointer font-bold text-slate-700 dark:text-slate-300\">\r\n                                                            <option value=\"\">-- T\u1EF1 \u0111\u1ED9ng (Greedy) --</option>\r\n                                                            @for(sug of eligibleManualSopsMap().get(block.id) || []; track sug.sop.id) {\r\n                                                                <option [value]=\"sug.sop.id\">{{sug.sop.name}} ({{sug.coverageCount}}/{{sug.totalRequired}} ch\u1EC9 ti\u00EAu)</option>\r\n                                                            }\r\n                                                        </select>\r\n                                                    </div>\r\n                                                }\r\n                                            }\r\n                                        </div>\r\n\r\n                                        </div>\r\n                                    }\r\n                                </div>\r\n                            }\r\n\r\n                            <button (click)=\"addBlock()\" class=\"w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl text-slate-500 dark:text-slate-400 font-bold text-sm hover:border-teal-400 dark:hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition flex items-center justify-center gap-2\">\r\n                                <i class=\"fa-solid fa-plus-circle\"></i> Th\u00EAm Nh\u00F3m M\u1EABu\r\n                            </button>\r\n                        </div>\r\n                    } @else {\r\n                        <!-- Single Sample Mode Form -->\r\n                        <div class=\"bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden animate-slide-up p-4 lg:p-6 flex flex-col gap-5\">\r\n                            <div class=\"flex items-center gap-3 border-b border-slate-150 dark:border-slate-700 pb-4\">\r\n                                <div class=\"w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/30 shadow-sm shrink-0\">\r\n                                    <i class=\"fa-solid fa-vial text-base\"></i>\r\n                                </div>\r\n                                <div>\r\n                                    <h3 class=\"font-black text-slate-850 dark:text-slate-100 text-base leading-tight\">Ph\u00E2n Chia M\u1EBB cho 1 M\u1EABu Duy Nh\u1EA5t</h3>\r\n                                    <p class=\"text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5\">H\u1EC7 th\u1ED1ng s\u1EBD t\u1EF1 \u0111\u1ED9ng ph\u00E2n t\u00E1ch c\u00E1c ch\u1EC9 ti\u00EAu \u0111\u01B0\u1EE3c ch\u1ECDn v\u00E0o c\u00E1c m\u1EBB ch\u1EA1y/SOP t\u01B0\u01A1ng \u1EE9ng.</p>\r\n                                </div>\r\n                            </div>\r\n\r\n                            <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6\">\r\n                                <!-- Left Column: Sample Inputs -->\r\n                                <div class=\"flex flex-col gap-4\">\r\n                                    <div>\r\n                                        <label class=\"text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1.5 ml-1\">M\u00E3 m\u1EABu duy nh\u1EA5t *</label>\r\n                                        <input [ngModel]=\"singleSampleCode()\" (ngModelChange)=\"singleSampleCode.set($event)\"\r\n                                               class=\"w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition shadow-sm\"\r\n                                               placeholder=\"Nh\u1EADp m\u00E3 m\u1EABu (v\u00ED d\u1EE5: M-TEST-001)...\">\r\n                                    </div>\r\n                                    <div>\r\n                                        <label class=\"text-[10px] font-bold text-fuchsia-500 dark:text-fuchsia-400 uppercase block mb-1.5 ml-1\">M\u00F4 t\u1EA3 m\u1EABu \u2014 t\u00F9y ch\u1ECDn</label>\r\n                                        <div class=\"relative\">\r\n                                            <i class=\"fa-solid fa-tag absolute left-3 top-1/2 -translate-y-1/2 text-fuchsia-300 text-xs\"></i>\r\n                                            <input [ngModel]=\"singleSampleDescriptionName()\" (ngModelChange)=\"updateSingleSampleDescription($event)\"\r\n                                                   list=\"sample-description-master-options\"\r\n                                                   class=\"w-full px-4 pl-9 py-2.5 bg-fuchsia-50/40 dark:bg-fuchsia-950/10 border border-fuchsia-100 dark:border-fuchsia-900/40 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 outline-none focus:border-fuchsia-500\"\r\n                                                   placeholder=\"Ch\u1ECDn t\u1EEB danh m\u1EE5c g\u1ED1c ho\u1EB7c nh\u1EADp t\u00EAn...\">\r\n                                        </div>\r\n                                    </div>\r\n                                    <div>\r\n                                        <label class=\"text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1.5 mb-1.5 ml-1\">\r\n                                            N\u1EC1n m\u1EABu (Matrix Type)\r\n                                            <div class=\"relative group/tooltip inline-block shrink-0 leading-none\">\r\n                                                <i class=\"fa-regular fa-circle-question text-slate-400 dark:text-slate-500 cursor-help hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors text-[11px]\"></i>\r\n                                                <!-- Tooltip content -->\r\n                                                <div class=\"absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-900/95 dark:bg-slate-950/95 text-white text-[10px] p-2.5 rounded-xl shadow-xl border border-slate-750 backdrop-blur-md opacity-0 scale-95 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all duration-200 z-50 origin-bottom leading-relaxed font-normal normal-case\">\r\n                                                    <div class=\"font-bold text-indigo-400 mb-1 flex items-center gap-1.5\">\r\n                                                        <i class=\"fa-solid fa-filter\"></i> L\u1ECDc theo N\u1EC1n m\u1EABu\r\n                                                    </div>\r\n                                                    <div class=\"text-slate-300\">\r\n                                                        Ch\u1EC9 hi\u1EC3n th\u1ECB c\u00E1c quy tr\u00ECnh (SOP) t\u01B0\u01A1ng th\u00EDch v\u1EDBi ch\u1EA5t n\u1EC1n ph\u00E2n t\u00EDch c\u1EE5 th\u1EC3 n\u00E0y (V\u00ED d\u1EE5: N\u01B0\u1EDBc th\u1EA3i, \u0110\u1EA5t, B\u00F9n th\u1EA3i). \u0110\u1EC3 tr\u1ED1ng \u0111\u1EC3 hi\u1EC3n th\u1ECB t\u1EA5t c\u1EA3 c\u00E1c SOP.\r\n                                                    </div>\r\n                                                </div>\r\n                                            </div>\r\n                                        </label>\r\n                                        <select [ngModel]=\"singleMatrixType() || ''\" (ngModelChange)=\"singleMatrixType.set($event === '' ? undefined : $event); singleForcedSopId.set(undefined)\"\r\n                                                class=\"w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-350 outline-none focus:border-indigo-500 dark:focus:border-indigo-400 cursor-pointer shadow-sm\">\r\n                                            <option value=\"\">D\u00F9ng chung (ANY)</option>\r\n                                            @for (m of availableMatrices(); track m.id) {\r\n                                                <option [value]=\"m.id\">{{m.name}}</option>\r\n                                            }\r\n                                        </select>\r\n                                    </div>\r\n                                </div>\r\n\r\n                                <!-- Right Column: Targets Selector -->\r\n                                <div class=\"flex flex-col h-[280px]\">\r\n                                    <div class=\"flex justify-between items-center mb-1.5\">\r\n                                        <label class=\"text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block ml-1\">Ch\u1EC9 ti\u00EAu ki\u1EC3m nghi\u1EC7m ({{ singleSelectedTargets().size }} \u0111\u00E3 ch\u1ECDn)</label>\r\n                                        <button (click)=\"openSingleTargetGroupModal()\" class=\"text-[10px] text-indigo-650 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-2 py-1 rounded transition font-bold flex items-center gap-1\">\r\n                                            <i class=\"fa-solid fa-layer-group\"></i> Groups\r\n                                        </button>\r\n                                    </div>\r\n                                    <div class=\"flex gap-2 mb-2\">\r\n                                        <div class=\"relative flex-1\">\r\n                                            <i class=\"fa-solid fa-search absolute left-2.5 top-2.5 text-slate-400 dark:text-slate-500 text-xs\"></i>\r\n                                            <input [ngModel]=\"singleTargetSearch()\" (ngModelChange)=\"singleTargetSearch.set($event)\"\r\n                                                   class=\"w-full pl-8 pr-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200\"\r\n                                                   placeholder=\"T\u00ECm ch\u1EC9 ti\u00EAu...\">\r\n                                        </div>\r\n                                        <button (click)=\"selectAllSingleTargets()\" class=\"px-2 py-1.5 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 rounded-lg border border-teal-100 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900/40 transition\" title=\"Ch\u1ECDn t\u1EA5t c\u1EA3\">\r\n                                            <i class=\"fa-solid fa-check-double text-xs\"></i>\r\n                                        </button>\r\n                                        <button (click)=\"deselectAllSingleTargets()\" class=\"px-2 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-650 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition\" title=\"B\u1ECF ch\u1ECDn t\u1EA5t c\u1EA3\">\r\n                                            <i class=\"fa-solid fa-xmark text-xs\"></i>\r\n                                        </button>\r\n                                    </div>\r\n\r\n                                    <div class=\"flex-1 border border-slate-200 dark:border-slate-700 rounded-xl overflow-y-auto custom-scrollbar p-1 bg-white dark:bg-slate-900\">\r\n                                        @for (t of singleFilteredTargets(); track t.uniqueKey) {\r\n                                            <label class=\"flex items-center gap-2 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded cursor-pointer group\"\r\n                                                   [ngClass]=\"{'bg-indigo-50/50 dark:bg-indigo-900/10': singleSelectedTargets().has(t.uniqueKey)}\">\r\n                                                <input type=\"checkbox\"\r\n                                                       [checked]=\"singleSelectedTargets().has(t.uniqueKey)\"\r\n                                                       (change)=\"toggleSingleTarget(t.uniqueKey)\"\r\n                                                       class=\"w-3.5 h-3.5 accent-indigo-600 rounded cursor-pointer\">\r\n                                                <div class=\"flex-1 min-w-0\">\r\n                                                    <div class=\"text-xs font-bold text-slate-750 dark:text-slate-350 truncate group-hover:text-indigo-700 dark:group-hover:text-indigo-400\">{{t.name}}</div>\r\n                                                </div>\r\n                                            </label>\r\n                                        }\r\n                                        @if(singleFilteredTargets().length === 0) {\r\n                                            <div class=\"text-center py-4 text-slate-400 dark:text-slate-500 text-[10px] italic\">Kh\u00F4ng t\u00ECm th\u1EA5y.</div>\r\n                                        }\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n\r\n                            <!-- Realtime SOP Suggestions -->\r\n                            <div class=\"bg-indigo-50/30 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/50 rounded-xl p-3 mt-2 animate-fade-in\">\r\n                                <label class=\"text-[10px] font-bold text-indigo-750 dark:text-indigo-400 uppercase mb-2 flex items-center justify-between\">\r\n                                     <span class=\"flex items-center gap-1.5\">\r\n                                         <i class=\"fa-solid fa-code-branch mr-1\"></i> Quy tr\u00ECnh (SOP) g\u1EE3i \u00FD\r\n                                         <div class=\"relative group/tooltip inline-block shrink-0 leading-none\">\r\n                                             <i class=\"fa-regular fa-circle-question text-slate-400 dark:text-slate-500 cursor-help hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors text-[11px]\"></i>\r\n                                             <!-- Tooltip content -->\r\n                                             <div class=\"absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-900/95 dark:bg-slate-950/95 text-white text-[10px] p-2.5 rounded-xl shadow-xl border border-slate-750 backdrop-blur-md opacity-0 scale-95 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all duration-200 z-50 origin-bottom leading-relaxed font-normal normal-case\">\r\n                                                 <div class=\"font-bold text-indigo-400 mb-1 flex items-center gap-1.5\">\r\n                                                     <i class=\"fa-solid fa-anchor\"></i> Ch\u1EC9 \u0111\u1ECBnh Quy tr\u00ECnh\r\n                                                 </div>\r\n                                                 <div class=\"text-slate-300\">\r\n                                                     Nh\u1EA5p ch\u1ECDn 1 quy tr\u00ECnh c\u1EE5 th\u1EC3 \u0111\u1EC3 ch\u1EC9 \u0111\u1ECBnh ch\u1EA1y c\u1ED1 \u0111\u1ECBnh quy tr\u00ECnh n\u00E0y. Thu\u1EADt to\u00E1n ph\u00E2n t\u00EDch s\u1EBD \u01B0u ti\u00EAn s\u1EED d\u1EE5ng SOP \u0111\u00E3 ch\u1ECDn \u1EDF B\u01B0\u1EDBc 2. \u0110\u1EC3 tr\u1ED1ng \u0111\u1EC3 h\u1EC7 th\u1ED1ng t\u1EF1 \u0111\u1ED9ng t\u00EDnh to\u00E1n ph\u01B0\u01A1ng \u00E1n t\u1ED1i \u01B0u.\r\n                                                 </div>\r\n                                             </div>\r\n                                         </div>\r\n                                     </span>\r\n                                    @if(singleForcedSopId()) {\r\n                                        <button (click)=\"singleForcedSopId.set(undefined)\" class=\"text-xs text-red-500 hover:text-red-600 capitalize font-medium transition cursor-pointer\">B\u1ECF Ch\u1EC9 \u0110\u1ECBnh</button>\r\n                                    }\r\n                                </label>\r\n                                \r\n                                @if(singleSelectedTargets().size === 0) {\r\n                                    <div class=\"border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl p-4 text-center group cursor-default\">\r\n                                        <i class=\"fa-solid fa-vials text-2xl text-slate-300 dark:text-slate-650 mb-1.5 block group-hover:animate-bounce\"></i>\r\n                                        <h5 class=\"text-[11px] font-bold text-slate-750 dark:text-slate-350 mb-0.5\">Ch\u01B0a Ch\u1ECDn Ch\u1EC9 Ti\u00EAu Ki\u1EC3m Nghi\u1EC7m</h5>\r\n                                        <p class=\"text-[10px] text-slate-400 dark:text-slate-500 max-w-xs mx-auto leading-relaxed\">H\u00E3y ch\u1ECDn \u00EDt nh\u1EA5t 1 ch\u1EC9 ti\u00EAu ki\u1EC3m nghi\u1EC7m \u1EDF khung b\u00EAn ph\u1EA3i \u0111\u1EC3 h\u1EC7 th\u1ED1ng t\u1EF1 \u0111\u1ED9ng g\u1EE3i \u00FD quy tr\u00ECnh ph\u00F9 h\u1EE3p.</p>\r\n                                    </div>\r\n                                } @else {\r\n                                    @if (singleSopSuggestions().length === 0 && !singleForcedSopId()) {\r\n                                        <div class=\"border border-orange-100 dark:border-orange-950 bg-orange-50/30 dark:bg-orange-900/10 rounded-xl p-4 text-center mb-3\">\r\n                                            <i class=\"fa-solid fa-microscope text-2xl text-orange-400 dark:text-orange-550 mb-1.5 block\"></i>\r\n                                            <h5 class=\"text-[11px] font-bold text-orange-700 dark:text-orange-400 mb-0.5\">Kh\u00F4ng T\u00ECm Th\u1EA5y Quy Tr\u00ECnh Ph\u00F9 H\u1EE3p</h5>\r\n                                            <p class=\"text-[10px] text-orange-500 dark:text-orange-550 max-w-xs mx-auto leading-relaxed mb-2\">Ch\u01B0a c\u00F3 SOP n\u00E0o \u0111\u01B0\u1EE3c c\u1EA5u h\u00ECnh cho c\u00E1c ch\u1EC9 ti\u00EAu \u0111\u00E3 ch\u1ECDn t\u01B0\u01A1ng th\u00EDch v\u1EDBi N\u1EC1n m\u1EABu n\u00E0y.</p>\r\n                                            <button (click)=\"singleMatrixType.set(undefined); singleForcedSopId.set(undefined)\" class=\"text-[9px] bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 text-orange-700 dark:text-orange-400 px-2.5 py-1 rounded font-bold transition\">\r\n                                                Th\u1EED \u0110\u1EB7t L\u1EA1i N\u1EC1n M\u1EABu\r\n                                            </button>\r\n                                        </div>\r\n                                    } @else {\r\n                                        @if(singleSopSuggestions().length > 0 && singleSopSuggestions()[0].isPartial && !singleForcedSopId()) {\r\n                                            <div class=\"mb-2 text-[11px] text-orange-600 dark:text-orange-400 font-medium flex items-start gap-1.5\">\r\n                                                <i class=\"fa-solid fa-triangle-exclamation mt-0.5\"></i>\r\n                                                <p>Kh\u00F4ng c\u00F3 quy tr\u00ECnh n\u00E0o bao ph\u1EE7 to\u00E0n b\u1ED9 m\u1EE5c ti\u00EAu. Quy tr\u00ECnh d\u01B0\u1EDBi \u0111\u00E2y ch\u1EC9 mang t\u00EDnh tham kh\u1EA3o, h\u1EC7 th\u1ED1ng s\u1EBD t\u1EF1 \u0111\u1ED9ng t\u00E1ch m\u1EBB \u1EDF B\u01B0\u1EDBc 2.</p>\r\n                                            </div>\r\n                                        }\r\n                                        @if(singleForcedSopId() && singleSopSuggestions().length > 0 && singleSopSuggestions()[0].isPartial && singleSopSuggestions()[0].sop.id === singleForcedSopId()) {\r\n                                            <div class=\"mb-3 text-[11px] bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-500 font-medium flex flex-col gap-1.5 p-2 rounded-lg border border-yellow-200 dark:border-yellow-900/50\">\r\n                                                <div class=\"flex items-start gap-1.5\">\r\n                                                    <i class=\"fa-solid fa-triangle-exclamation mt-0.5 text-yellow-600 dark:text-yellow-500\"></i>\r\n                                                    <p>Quy tr\u00ECnh \u0111\u01B0\u1EE3c ch\u1EC9 \u0111\u1ECBnh ch\u1EC9 bao ph\u1EE7 <b>{{ singleSopSuggestions()[0].coverageCount }}/{{ singleSopSuggestions()[0].totalRequired }}</b> ch\u1EC9 ti\u00EAu. <b>{{ singleSopSuggestions()[0].missingTargets.length }}</b> ch\u1EC9 ti\u00EAu c\u00F2n l\u1EA1i d\u01B0\u1EDBi \u0111\u00E2y s\u1EBD \u0111\u01B0\u1EE3c h\u1EC7 th\u1ED1ng t\u1EF1 \u0111\u1ED9ng t\u00E1ch sang m\u1EBB m\u1EDBi \u1EDF B\u01B0\u1EDBc 2:</p>\r\n                                                </div>\r\n                                                <div class=\"flex flex-wrap gap-1 mt-1 pl-4\">\r\n                                                    @for(mt of singleSopSuggestions()[0].missingTargets; track mt.id) {\r\n                                                        <span class=\"px-1.5 py-0.5 bg-white/60 dark:bg-black/20 border border-yellow-200 dark:border-yellow-900/50 rounded text-[9px] font-bold text-yellow-700 dark:text-yellow-400\">{{mt.name}}</span>\r\n                                                    }\r\n                                                </div>\r\n                                            </div>\r\n                                        }\r\n\r\n                                        <div class=\"flex flex-wrap gap-2\">\r\n                                            @for(sug of singleSopSuggestions(); track sug.sop.id) {\r\n                                                <div class=\"flex flex-col rounded-lg border transition bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 overflow-hidden\"\r\n                                                     [class.ring-2]=\"singleForcedSopId() === sug.sop.id\"\r\n                                                     [class.ring-indigo-500]=\"singleForcedSopId() === sug.sop.id\">\r\n\r\n                                                     <!-- Th\u00E2n n\u00FAt: Nh\u1EA5n \u0111\u1EC3 ch\u1EC9 \u0111\u1ECBnh -->\r\n                                                     <button (click)=\"singleForcedSopId.set(sug.sop.id)\"\r\n                                                             [disabled]=\"sug.isPartial && !sug.sop.isManualOnly\"\r\n                                                             class=\"px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 disabled:opacity-75 disabled:cursor-not-allowed transition\">\r\n\r\n                                                         <div class=\"flex items-center gap-2 mb-1\">\r\n                                                             @if(sug.sop.isManualOnly) {\r\n                                                                 <span class=\"bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 text-[9px] px-1.5 py-0.5 rounded font-black tracking-wide uppercase\"><i class=\"fa-solid fa-crosshairs mr-0.5\"></i> Ch\u1EC9 \u0110\u1ECBnh Th\u1EE7 C\u00F4ng</span>\r\n                                                             } @else if(sug.isBest && !sug.isPartial) {\r\n                                                                 <span class=\"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-[9px] px-1.5 py-0.5 rounded font-black tracking-wide uppercase\"><i class=\"fa-solid fa-star mr-0.5\"></i> T\u1ED1t Nh\u1EA5t</span>\r\n                                                             }\r\n                                                             <span class=\"text-xs font-bold text-slate-700 dark:text-slate-200 flex-1\">{{sug.sop.name}}</span>\r\n                                                             @if(singleForcedSopId() === sug.sop.id) {\r\n                                                                 <i class=\"fa-solid fa-circle-check text-indigo-600 dark:text-indigo-400\"></i>\r\n                                                             }\r\n                                                         </div>\r\n\r\n                                                         <div class=\"flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400\">\r\n                                                             @if(sug.sop.matrixTags && sug.sop.matrixTags.length > 0) {\r\n                                                                 <span class=\"flex items-center gap-1\">\r\n                                                                     <div class=\"w-1.5 h-1.5 rounded-full\" [style.background-color]=\"getMatrixColor(sug.sop.matrixTags[0])\"></div>\r\n                                                                     {{getMatrixLabel(sug.sop.matrixTags[0])}}\r\n                                                                 </span>\r\n                                                             } @else {\r\n                                                                 <span class=\"flex items-center gap-1\">\r\n                                                                     <div class=\"w-1.5 h-1.5 rounded-full bg-slate-400\"></div> D\u00F9ng Chung\r\n                                                                 </span>\r\n                                                             }\r\n                                                             <span [class.text-red-500]=\"sug.isPartial\" class=\"font-medium\">\r\n                                                                 <i class=\"fa-solid fa-bullseye mr-0.5\"></i> {{sug.coverageCount}}/{{sug.totalRequired}}\r\n                                                             </span>\r\n                                                             @if(sug.isMissingStock) {\r\n                                                                 <span class=\"text-red-500 font-bold\" title=\"C\u00F3 h\u00F3a ch\u1EA5t b\u1ECB h\u1EBFt (T\u1ED3n = 0)\"><i class=\"fa-solid fa-triangle-exclamation\"></i> Kho</span>\r\n                                                             } @else {\r\n                                                                 <span class=\"text-teal-600 dark:text-teal-400\"><i class=\"fa-solid fa-check\"></i> Kho</span>\r\n                                                             }\r\n                                                         </div>\r\n                                                     </button>\r\n\r\n                                                     <!-- Ch\u00E2n n\u00FAt: Icon Xem -->\r\n                                                     <div class=\"bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700/50 py-1 px-3 text-center hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition\" (click)=\"openSopPreview(-1, sug); $event.stopPropagation()\">\r\n                                                         <button class=\"text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline w-full pointer-events-none\">\r\n                                                             <i class=\"fa-regular fa-eye mr-1\"></i> Xem Chi Ti\u1EBFt\r\n                                                         </button>\r\n                                                     </div>\r\n                                                </div>\r\n                                            }\r\n                                        </div>\r\n                                    }\r\n                                    \r\n                                    @if(singleEligibleManualSops().length > 0) {\r\n                                        <div class=\"mt-3 pt-2.5 border-t border-indigo-100/50 dark:border-indigo-950/20 flex items-center gap-2\">\r\n                                            <span class=\"text-[10px] font-black text-indigo-750 dark:text-indigo-400 whitespace-nowrap\">CH\u1EC8 \u0110\u1ECANH TH\u1EE6 C\u00D4NG:</span>\r\n                                            <select [ngModel]=\"singleForcedSopId() || ''\" \r\n                                                    (ngModelChange)=\"singleForcedSopId.set($event === '' ? undefined : $event)\"\r\n                                                    class=\"flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs outline-none focus:border-indigo-500 cursor-pointer font-bold text-slate-700 dark:text-slate-300\">\r\n                                                <option value=\"\">-- T\u1EF1 \u0111\u1ED9ng (Greedy) --</option>\r\n                                                @for(sug of singleEligibleManualSops(); track sug.sop.id) {\r\n                                                    <option [value]=\"sug.sop.id\">{{sug.sop.name}} ({{sug.coverageCount}}/{{sug.totalRequired}} ch\u1EC9 ti\u00EAu)</option>\r\n                                                }\r\n                                            </select>\r\n                                        </div>\r\n                                    }\r\n                                }\r\n                            </div>\r\n                        </div>\r\n                    }\r\n                </div>\r\n\r\n                <!-- Right: Summary Dashboard -->\r\n                <div class=\"w-full lg:w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm h-fit sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar\">\r\n                    <h4 class=\"font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2\">\r\n                        @if(smartBatchMode() === 'single') {\r\n                            <i class=\"fa-solid fa-vial text-indigo-500\"></i> Th\u00F4ng tin m\u1EABu\r\n                        } @else {\r\n                            <i class=\"fa-solid fa-chart-pie text-teal-500\"></i> C\u1EA5u h\u00ECnh ph\u00E2n t\u00EDch\r\n                        }\r\n                    </h4>\r\n\r\n                    <div class=\"space-y-4 mb-6\">\r\n                        <div class=\"flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700\">\r\n                            <span class=\"text-xs text-slate-500 dark:text-slate-400 font-bold\">T\u1ED5ng m\u1EABu (Unique)</span>\r\n                            <span class=\"text-lg font-black text-slate-800 dark:text-slate-200\">{{ totalUniqueSamples() }}</span>\r\n                        </div>\r\n                        <div class=\"flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700\">\r\n                            <span class=\"text-xs text-slate-500 dark:text-slate-400 font-bold\">T\u1ED5ng ch\u1EC9 ti\u00EAu</span>\r\n                            <span class=\"text-lg font-black text-slate-800 dark:text-slate-200\">{{ totalUniqueTargets() }}</span>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"pt-4 border-t border-slate-100 dark:border-slate-700\">\r\n                        <button (click)=\"analyzePlan()\" [disabled]=\"totalUniqueSamples() === 0 || totalUniqueTargets() === 0 || isProcessing()\"\r\n                                [class]=\"smartBatchMode() === 'single' ? 'w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group' : 'w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group'\">\r\n                            @if(isProcessing()) { <i class=\"fa-solid fa-spinner fa-spin\"></i> X\u1EED l\u00FD... }\r\n                            @else { <span>Ph\u00E2n T\u00EDch v\u00E0 L\u1EADp K\u1EBF Ho\u1EA1ch</span> <i class=\"fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform\"></i> }\r\n                        </button>\r\n                    </div>\r\n                </div>\r\n\r\n                <!-- SOP Quick Preview Side Panel -->\r\n                @if(previewSop()) {\r\n                    <div class=\"fixed inset-0 z-50 flex justify-end\">\r\n                        <!-- Overlay -->\r\n                        <div class=\"absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity\" (click)=\"closeSopPreview()\"></div>\r\n\r\n                        <!-- Panel -->\r\n                        <div class=\"relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col transform transition-transform border-l border-slate-200 dark:border-slate-800 animate-slide-in-right\">\r\n                            <!-- Header -->\r\n                            <div class=\"flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50\">\r\n                                <div>\r\n                                    <h3 class=\"text-sm font-black text-slate-800 dark:text-slate-200 flex items-center gap-2\">\r\n                                        <i class=\"fa-solid fa-microscope text-indigo-500\"></i>\r\n                                        {{previewSop()!.suggestion.sop.name}}\r\n                                    </h3>\r\n                                    <div class=\"flex items-center gap-2 mt-1 text-[10px] font-bold text-slate-500 dark:text-slate-400\">\r\n                                        @if((previewSop()!.suggestion.sop.matrixTags?.length || 0) > 0) {\r\n                                            <span class=\"flex items-center gap-1 bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded\">\r\n                                                <div class=\"w-1.5 h-1.5 rounded-full\" [style.background-color]=\"getMatrixColor(previewSop()!.suggestion.sop.matrixTags![0])\"></div>\r\n                                                {{getMatrixLabel(previewSop()!.suggestion.sop.matrixTags![0])}}\r\n                                            </span>\r\n                                        }\r\n                                        <span class=\"bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded\">{{previewSop()!.suggestion.sop.targets?.length || 0}} ch\u1EC9 ti\u00EAu</span>\r\n                                    </div>\r\n                                </div>\r\n                                <button (click)=\"closeSopPreview()\" class=\"w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 transition\">\r\n                                    <i class=\"fa-solid fa-xmark\"></i>\r\n                                </button>\r\n                            </div>\r\n\r\n                            <!-- Content -->\r\n                            <div class=\"flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6\">\r\n                                <!-- Covered Targets -->\r\n                                @if(previewSop()!.suggestion.coveredTargets.length > 0) {\r\n                                    <div>\r\n                                        <h4 class=\"text-xs font-bold text-teal-700 dark:text-teal-400 mb-2 flex items-center gap-1.5\">\r\n                                            <i class=\"fa-solid fa-circle-check\"></i>\r\n                                            S\u1EBD x\u1EED l\u00FD ({{previewSop()!.suggestion.coveredTargets.length}})\r\n                                        </h4>\r\n                                        <div class=\"bg-teal-50/50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-900/30 rounded-xl p-2 max-h-60 overflow-y-auto custom-scrollbar\">\r\n                                            @for(t of previewSop()!.suggestion.coveredTargets; track t.id) {\r\n                                                <div class=\"px-2 py-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 border-b border-teal-100 dark:border-teal-900/30 last:border-0 truncate\">\r\n                                                    {{t.name}}\r\n                                                </div>\r\n                                            }\r\n                                        </div>\r\n                                    </div>\r\n                                }\r\n\r\n                                <!-- Missing Targets -->\r\n                                @if(previewSop()!.suggestion.missingTargets.length > 0) {\r\n                                    <div>\r\n                                        <h4 class=\"text-xs font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-1.5\">\r\n                                            <i class=\"fa-solid fa-circle-xmark\"></i>\r\n                                            S\u1EBD b\u1ECB thi\u1EBFu ({{previewSop()!.suggestion.missingTargets.length}})\r\n                                        </h4>\r\n                                        <p class=\"text-[10px] text-slate-500 mb-2 italic\">H\u1EC7 th\u1ED1ng s\u1EBD t\u1EF1 \u0111\u1ED9ng t\u00ECm SOP kh\u00E1c \u0111\u1EC3 x\u1EED l\u00FD c\u00E1c ch\u1EC9 ti\u00EAu n\u00E0y.</p>\r\n                                        <div class=\"bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-2 max-h-40 overflow-y-auto custom-scrollbar\">\r\n                                            @for(t of previewSop()!.suggestion.missingTargets; track t.id) {\r\n                                                <div class=\"px-2 py-1.5 text-[11px] font-bold text-red-700 dark:text-red-300 border-b border-red-100 dark:border-red-900/30 last:border-0 truncate\">\r\n                                                    {{t.name}}\r\n                                                </div>\r\n                                            }\r\n                                        </div>\r\n                                    </div>\r\n                                }\r\n\r\n                                <!-- Extra Targets -->\r\n                                @if(previewSop()!.suggestion.extraTargets.length > 0) {\r\n                                    <div>\r\n                                        <h4 class=\"text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5\">\r\n                                            <i class=\"fa-solid fa-circle-info\"></i>\r\n                                            C\u00F3 d\u01B0 ({{previewSop()!.suggestion.extraTargets.length}})\r\n                                        </h4>\r\n                                        <p class=\"text-[10px] text-slate-400 mb-2 italic\">SOP c\u00F3 nh\u01B0ng Nh\u00F3m m\u1EABu kh\u00F4ng y\u00EAu c\u1EA7u.</p>\r\n                                        <div class=\"bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl p-2 max-h-40 overflow-y-auto custom-scrollbar opacity-60 hover:opacity-100 transition-opacity\">\r\n                                            @for(t of previewSop()!.suggestion.extraTargets; track t.id) {\r\n                                                <div class=\"px-2 py-1 text-[10px] font-medium text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 last:border-0 truncate\">\r\n                                                    {{t.name}}\r\n                                                </div>\r\n                                            }\r\n                                        </div>\r\n                                    </div>\r\n                                }\r\n                            </div>\r\n\r\n                            <!-- Footer -->\r\n                            <div class=\"p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900\">\r\n                                <button (click)=\"assignSopFromPreview()\"\r\n                                        [disabled]=\"previewSop()!.suggestion.isPartial\"\r\n                                        class=\"w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2\">\r\n                                    <i class=\"fa-solid fa-check-to-slot\"></i> Ch\u1EC9 \u0110\u1ECBnh SOP N\u00E0y\r\n                                </button>\r\n                                @if(previewSop()!.suggestion.isPartial) {\r\n                                    <p class=\"text-center text-[10px] text-slate-500 mt-2 italic\">T\u00EDnh n\u0103ng ch\u1EC9 \u0111\u1ECBnh nhi\u1EC1u quy tr\u00ECnh (Multi-Force) s\u1EBD ra m\u1EAFt trong t\u01B0\u01A1ng lai.</p>\r\n                                }\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                }\r\n            }\r\n\r\n            <!-- STEP 2: REVIEW PLAN -->\r\n            @if(step() === 2) {\r\n                <!-- Left: Batches -->\r\n                <div class=\"flex-1 lg:w-2/3 flex flex-col gap-4 animate-fade-in\">\r\n\r\n                    <div class=\"relative w-full shadow-sm shrink-0 sticky top-0 z-10\">\r\n                        <i class=\"fa-solid fa-search absolute left-3 top-2.5 text-slate-400 dark:text-slate-500 text-xs\"></i>\r\n                        <input [ngModel]=\"sampleSearchTerm()\" (ngModelChange)=\"sampleSearchTerm.set($event)\"\r\n                               class=\"w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition bg-white dark:bg-slate-800\"\r\n                               placeholder=\"T\u00ECm v\u1ECB tr\u00ED m\u1EABu (VD: A05)...\">\r\n                    </div>\r\n\r\n                    <div class=\"pb-10 flex flex-col gap-4\">\r\n                        @if (planValidationIssues().length > 0) {\r\n                        <div class=\"bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-4 flex items-start gap-3\">\r\n                            <i class=\"fa-solid fa-shield-halved text-rose-600 dark:text-rose-400 mt-0.5\"></i>\r\n                            <div>\r\n                                <h4 class=\"text-sm font-bold text-rose-800 dark:text-rose-300 mb-1\">K\u1EBF ho\u1EA1ch c\u00F3 d\u1EEF li\u1EC7u ti\u00EAu hao kh\u00F4ng h\u1EE3p l\u1EC7</h4>\r\n                                <ul class=\"text-xs text-rose-700 dark:text-rose-400 list-disc pl-4 space-y-1\">\r\n                                    @for(issue of planValidationIssues().slice(0, 5); track issue.code + issue.message) {\r\n                                        <li>{{ issue.message }}</li>\r\n                                    }\r\n                                </ul>\r\n                                @if(planValidationIssues().length > 5) {\r\n                                    <p class=\"text-[10px] text-rose-500 mt-1\">V\u00E0 {{planValidationIssues().length - 5}} l\u1ED7i kh\u00E1c.</p>\r\n                                }\r\n                            </div>\r\n                        </div>\r\n                        }\r\n                        @if (unmappedTasks().length > 0) {\r\n                        <div class=\"bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl p-4 flex items-start gap-3\">\r\n                            <i class=\"fa-solid fa-circle-exclamation text-red-500 dark:text-red-400 mt-0.5\"></i>\r\n                            <div>\r\n                                <h4 class=\"text-sm font-bold text-red-800 dark:text-red-300 mb-1\">C\u1EA3nh B\u00E1o: Kh\u00F4ng T\u00ECm Th\u1EA5y Quy Tr\u00ECnh (SOP)</h4>\r\n                                <div class=\"text-xs text-red-600 dark:text-red-400 mb-2\">C\u00E1c y\u00EAu c\u1EA7u sau kh\u00F4ng th\u1EC3 th\u1EF1c hi\u1EC7n do kh\u00F4ng c\u00F3 SOP ph\u00F9 h\u1EE3p trong h\u1EC7 th\u1ED1ng:</div>\r\n                                <div class=\"flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar\">\r\n                                    @for(task of unmappedTasks(); track task.sample + task.targetId) {\r\n                                        <span class=\"bg-white dark:bg-slate-800 px-2 py-1 rounded text-[10px] font-bold text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800 flex items-center gap-1\">\r\n                                            {{task.sample}} <i class=\"fa-solid fa-arrow-right text-[8px] text-red-300 dark:text-red-500/50\"></i> {{task.targetName}}\r\n                                        </span>\r\n                                    }\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    }\r\n\r\n                    @for (batch of batches(); track batch.id; let batchIdx = $index) {\r\n                        <div class=\"bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden transition-all duration-300 group\"\r\n                             [class.border-l-4]=\"true\"\r\n                             [class.border-l-emerald-500]=\"batch.status === 'ready' && !batch.name.includes('(T\u00E1ch)')\"\r\n                             [class.border-l-red-500]=\"batch.status === 'missing_stock'\"\r\n                             [class.border-l-yellow-400]=\"batch.name.includes('(T\u00E1ch)') && batch.status !== 'missing_stock'\"\r\n                             [class.ring-2]=\"matchesSearch(batch)\"\r\n                             [class.ring-blue-400]=\"matchesSearch(batch)\"\r\n                             [class.opacity-40]=\"sampleSearchTerm() && !matchesSearch(batch)\">\r\n\r\n                            <!-- Header Section -->\r\n                            <div class=\"p-4 border-b border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition\" (click)=\"toggleBatchDetails(batchIdx)\">\r\n                                <!-- Top Row: Category & Status Badges -->\r\n                                <div class=\"flex justify-between items-start mb-2\">\r\n                                    <div class=\"flex items-center gap-2 flex-wrap\">\r\n                                        <span class=\"text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600\">{{batch.sop.category}}</span>\r\n\r\n                                        @if(batch.tags) {\r\n                                            @for(tag of batch.tags; track tag) {\r\n                                                @if(tag !== 'T\u1EF1 \u0111\u1ED9ng-Optimized') {\r\n                                                    <span class=\"text-[9px] bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 px-2 py-0.5 rounded font-bold border border-teal-200 dark:border-teal-800\">{{tag}}</span>\r\n                                                }\r\n                                            }\r\n                                        }\r\n\r\n                                        @if(batch.status === 'missing_stock') {\r\n                                            <span class=\"text-[9px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded font-bold border border-red-200 dark:border-red-800 flex items-center gap-1\">\r\n                                                <i class=\"fa-solid fa-triangle-exclamation\"></i> Thi\u1EBFu h\u00E0ng\r\n                                            </span>\r\n                                        }\r\n                                        @if(batch.name.includes('(T\u00E1ch)')) {\r\n                                             <span class=\"text-[9px] bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded font-bold border border-yellow-200 dark:border-yellow-800 animate-pulse flex items-center gap-1\">\r\n                                                <i class=\"fa-solid fa-star text-[8px]\"></i> M\u1EDBi t\u00E1ch\r\n                                            </span>\r\n                                        }\r\n                                    </div>\r\n\r\n                                    <!-- Action Buttons -->\r\n                                    <div class=\"flex gap-2\">\r\n                                         <button (click)=\"openSplitModal(batchIdx); $event.stopPropagation()\" class=\"text-xs px-2 py-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-500 transition shadow-sm active:scale-95 flex items-center gap-1\" title=\"T\u00E1ch m\u1EBB n\u00E0y\">\r\n                                            <i class=\"fa-solid fa-shuffle\"></i> <span class=\"hidden sm:inline\">T\u00E1ch</span>\r\n                                        </button>\r\n                                        <button (click)=\"toggleBatchDetails(batchIdx); $event.stopPropagation()\" class=\"w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 transition\" title=\"M\u1EDF r\u1ED9ng / Thu g\u1ECDn\">\r\n                                            <i class=\"fa-solid fa-chevron-down transition-transform duration-300\" [class.rotate-180]=\"batch.isExpanded\"></i>\r\n                                        </button>\r\n                                    </div>\r\n                                </div>\r\n\r\n                                <!-- Main Title & Sample Range -->\r\n                                <div class=\"mb-3\">\r\n                                    <h3 class=\"text-base font-bold text-slate-800 dark:text-slate-200 leading-tight mb-2\">\r\n                                        {{batch.name}} <span class=\"text-slate-400 dark:text-slate-500 font-normal text-xs\">({{batch.sop.name}})</span>\r\n                                    </h3>\r\n\r\n                                    <!-- Consolidated Sample Display -->\r\n                                    <div class=\"flex items-start gap-2 w-full mt-1\" (click)=\"$event.stopPropagation()\">\r\n                                        <div class=\"bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-2 py-1.5 rounded text-xs font-mono font-bold border border-indigo-100 dark:border-indigo-800 flex items-start gap-2 shadow-sm w-full\">\r\n                                            <span class=\"bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] shadow-sm text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700 shrink-0 mt-0.5\">{{batch.samples.size}} m\u1EABu</span>\r\n                                            <div class=\"break-words whitespace-normal flex-1\"\r\n                                                 [class.line-clamp-2]=\"!batch.isExpanded\">\r\n                                                {{ batch.isExpanded ? getFullSampleString(batch.samples) : formatSampleList(batch.samples) }}\r\n                                            </div>\r\n                                        </div>\r\n                                    </div>\r\n                                    @if (getBatchDescriptionText(batch)) {\r\n                                        <div class=\"mt-2 rounded-lg border border-fuchsia-100 dark:border-fuchsia-900/40 bg-fuchsia-50/50 dark:bg-fuchsia-950/10 px-2.5 py-2 text-[10px] text-fuchsia-800 dark:text-fuchsia-300 leading-relaxed\">\r\n                                            <span class=\"font-black uppercase tracking-wide mr-1\"><i class=\"fa-solid fa-tags mr-1\"></i>M\u00F4 t\u1EA3:</span>{{getBatchDescriptionText(batch)}}\r\n                                        </div>\r\n                                    }\r\n                                </div>\r\n\r\n                                <!-- Tags (Targets) -->\r\n                                <div class=\"flex flex-wrap gap-1\">\r\n                                    @for(t of batch.targets; track t.id) {\r\n                                        <span class=\"px-1.5 py-0.5 bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 rounded text-[9px] border border-slate-200 dark:border-slate-600 font-bold flex items-center gap-1 group/tag\">\r\n                                            {{t._displayName || t.name}}\r\n                                            <i class=\"fa-solid fa-xmark cursor-pointer hover:text-red-500 transition opacity-0 group-hover/tag:opacity-100\"\r\n                                               (click)=\"removeTargetFromBatch(batchIdx, t.id); $event.stopPropagation()\" title=\"Lo\u1EA1i b\u1ECF kh\u1ECFi m\u1EBB\"></i>\r\n                                        </span>\r\n                                    }\r\n                                </div>\r\n                            </div>\r\n\r\n                            <!-- Controls (Gray Block - Always Visible) -->\r\n                            <div class=\"bg-slate-50 dark:bg-slate-800/50 p-3 border-b border-slate-100 dark:border-slate-700 grid grid-cols-2 md:grid-cols-4 gap-3\">\r\n                                <!-- Analysis Date (business date used by the daily sample tracker) -->\r\n                                <div class=\"group\">\r\n                                    <label class=\"text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1 truncate\" title=\"Ng\u00E0y ki\u1EC3m nghi\u1EC7m d\u1EF1 ki\u1EBFn\">\r\n                                        Ng\u00E0y ki\u1EC3m nghi\u1EC7m <span class=\"text-red-500\">*</span>\r\n                                    </label>\r\n                                    <input type=\"date\"\r\n                                           required\r\n                                           [ngModel]=\"batch.inputValues['analysisDate']\"\r\n                                           (ngModelChange)=\"updateBatchInput(batchIdx, 'analysisDate', $event)\"\r\n                                           [class.border-red-400]=\"!batch.inputValues['analysisDate']\"\r\n                                           class=\"w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-teal-500 dark:focus:border-teal-400 transition h-8 shadow-sm [color-scheme:light] dark:[color-scheme:dark]\">\r\n                                </div>\r\n\r\n                                <!-- DYNAMIC INPUTS -->\r\n                                @for (inp of batch.sop.inputs; track inp.var) {\r\n                                    @if(inp.var !== 'n_sample' && inp.var !== 'safetyMargin' && inp.var !== 'analysisDate') {\r\n                                        <div class=\"group\">\r\n                                            <label class=\"text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1 truncate\" [title]=\"inp.label\">{{inp.label}}</label>\r\n                                            @switch (inp.type) {\r\n                                                @case ('select') {\r\n                                                    <select [ngModel]=\"batch.inputValues[inp.var]\"\r\n                                                            (ngModelChange)=\"updateBatchInput(batchIdx, inp.var, $event)\"\r\n                                                            class=\"w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-1 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-teal-500 dark:focus:border-teal-400 cursor-pointer h-8 shadow-sm\">\r\n                                                        @for (opt of inp.options; track opt.value) {\r\n                                                            <option [value]=\"opt.value\">{{opt.label}}</option>\r\n                                                        }\r\n                                                    </select>\r\n                                                }\r\n                                                @case ('checkbox') {\r\n                                                    <div class=\"flex items-center h-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2\">\r\n                                                        <label class=\"flex items-center gap-2 cursor-pointer w-full\">\r\n                                                            <input type=\"checkbox\"\r\n                                                                   [ngModel]=\"batch.inputValues[inp.var]\"\r\n                                                                   (ngModelChange)=\"updateBatchInput(batchIdx, inp.var, $event)\"\r\n                                                                   class=\"w-4 h-4 accent-teal-600 rounded\">\r\n                                                            <span class=\"text-xs font-bold text-slate-700 dark:text-slate-300\">{{batch.inputValues[inp.var] ? 'B\u1EADt' : 'T\u1EAFt'}}</span>\r\n                                                        </label>\r\n                                                    </div>\r\n                                                }\r\n                                                @default {\r\n                                                    <div class=\"relative\">\r\n                                                        <input type=\"number\"\r\n                                                               [ngModel]=\"batch.inputValues[inp.var]\"\r\n                                                               (ngModelChange)=\"updateBatchInput(batchIdx, inp.var, $event)\"\r\n                                                               [step]=\"inp.step || 1\"\r\n                                                               class=\"w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 text-center outline-none focus:border-teal-500 dark:focus:border-teal-400 transition h-8 shadow-sm\">\r\n                                                        @if(inp.unitLabel) {\r\n                                                            <span class=\"absolute right-2 top-1/2 -translate-y-1/2 text-[8px] text-slate-400 dark:text-slate-500 font-bold pointer-events-none\">{{inp.unitLabel}}</span>\r\n                                                        }\r\n                                                    </div>\r\n                                                }\r\n                                            }\r\n                                        </div>\r\n                                    }\r\n                                }\r\n                                <!-- Safety Margin -->\r\n                                <div>\r\n                                    <label class=\"text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1\">Hao h\u1EE5t (%)</label>\r\n                                    @if(batch.safetyMargin === -1) {\r\n                                        <div (click)=\"setBatchMarginManual(batchIdx)\"\r\n                                             class=\"w-full bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 text-[10px] font-bold py-1.5 px-2 rounded-lg cursor-pointer text-center flex items-center justify-center gap-1 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition shadow-sm h-8\">\r\n                                            <i class=\"fa-solid fa-layer-group\"></i> T\u1EF1 \u0111\u1ED9ng\r\n                                        </div>\r\n                                    } @else {\r\n                                        <input type=\"number\"\r\n                                               [ngModel]=\"batch.safetyMargin\"\r\n                                               (ngModelChange)=\"updateBatchMargin(batchIdx, $event)\"\r\n                                               min=\"0\"\r\n                                               max=\"100\"\r\n                                               class=\"w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 text-center outline-none focus:border-orange-500 dark:focus:border-orange-400 transition h-8 shadow-sm\">\r\n                                    }\r\n                                </div>\r\n\r\n                                <!-- Device Selection -->\r\n                                <div>\r\n                                    <label class=\"text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1 truncate\" title=\"Thi\u1EBFt b\u1ECB ph\u00E2n t\u00EDch\">Thi\u1EBFt b\u1ECB</label>\r\n                                    <select [ngModel]=\"batch.inputValues['device'] || ''\"\r\n                                            (ngModelChange)=\"updateBatchInput(batchIdx, 'device', $event)\"\r\n                                            class=\"w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-1 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-teal-500 dark:focus:border-teal-400 cursor-pointer h-8 shadow-sm truncate\">\r\n                                        <option value=\"\">-- M\u1EB7c \u0111\u1ECBnh --</option>\r\n                                        @if (batch.sop.allowedDevices && batch.sop.allowedDevices.length > 0) {\r\n                                            @for (name of batch.sop.allowedDevices; track name) {\r\n                                                <option [value]=\"name\">{{name}}</option>\r\n                                            }\r\n                                        } @else {\r\n                                            @for (d of availableDevices(); track d.id) {\r\n                                                <option [value]=\"d.name\">{{d.name}}</option>\r\n                                            }\r\n                                        }\r\n                                    </select>\r\n                                </div>\r\n                            </div>\r\n\r\n                            <!-- Resource Table (ACCORDION) -->\r\n                            @if (batch.isExpanded) {\r\n                                <div class=\"w-full bg-white dark:bg-slate-800 animate-slide-down\">\r\n                                    <!-- Desktop Table -->\r\n                                    <table class=\"hidden md:table w-full text-xs text-left border-collapse\">\r\n                                        <thead class=\"bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-b border-slate-50 dark:border-slate-700/50\">\r\n                                            <tr>\r\n                                                <th class=\"px-5 py-2 font-bold uppercase text-[9px] tracking-wider\">H\u00F3a ch\u1EA5t v\u00E0 v\u1EADt t\u01B0</th>\r\n                                                <th class=\"px-5 py-2 font-bold uppercase text-[9px] text-right tracking-wider\">L\u01B0\u1EE3ng c\u1EA7n</th>\r\n                                                <th class=\"px-5 py-2 w-24\"></th> <!-- Action Column -->\r\n                                            </tr>\r\n                                        </thead>\r\n                                        <tbody class=\"divide-y divide-slate-50 dark:divide-slate-700/50\">\r\n                                            @for(item of batch.resourceImpact; track item.name) {\r\n                                                <!-- Parent Item -->\r\n                                                <tr class=\"hover:bg-slate-50 dark:hover:bg-slate-700/30 transition group/row\">\r\n                                                    <td class=\"px-5 py-3 align-middle\">\r\n                                                        <div class=\"break-words whitespace-normal font-medium text-slate-700 dark:text-slate-300 text-xs\" [ngClass]=\"{'text-red-600 dark:text-red-400': item.isMissing}\">\r\n                                                            {{item.displayName || item.name}}\r\n                                                            @if(item.isComposite) { <span class=\"text-[9px] text-slate-400 dark:text-slate-500 italic font-normal ml-1\">(Mix)</span> }\r\n                                                        </div>\r\n                                                    </td>\r\n                                                    <td class=\"px-5 py-3 text-right font-mono font-bold text-slate-600 dark:text-slate-400 text-xs\">\r\n                                                        {{formatNum(item.stockNeed)}} <span class=\"text-[9px] text-slate-400 dark:text-slate-500 font-normal\">{{item.stockUnit}}</span>\r\n                                                    </td>\r\n                                                    <td class=\"px-5 py-3 text-right\">\r\n                                                        @if(item.isMissing && !item.isComposite) {\r\n                                                            <button (click)=\"openQuickImport(item)\" class=\"text-[10px] bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 px-3 py-1.5 rounded-lg font-bold border border-red-100 dark:border-red-800 flex items-center gap-1 transition ml-auto active:scale-95\">\r\n                                                                <i class=\"fa-solid fa-bolt\"></i> B\u00F9 Kho\r\n                                                            </button>\r\n                                                        }\r\n                                                    </td>\r\n                                                </tr>\r\n                                                <!-- Sub Items -->\r\n                                                @if(item.isComposite) {\r\n                                                    @for(sub of item.breakdown; track sub.name) {\r\n                                                        <tr class=\"bg-slate-50/30 dark:bg-slate-800/30\">\r\n                                                            <td class=\"px-5 py-2 pl-8 align-middle\">\r\n                                                                <div class=\"break-words whitespace-normal text-[10px] text-slate-500 dark:text-slate-400 flex items-start gap-1.5 mt-0.5\" [ngClass]=\"{'text-red-500 dark:text-red-400': sub.isMissing}\">\r\n                                                                    <div class=\"w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0 mt-1.5\"></div>\r\n                                                                    <span>{{sub.displayName || sub.name}}</span>\r\n                                                                </div>\r\n                                                            </td>\r\n                                                            <td class=\"px-5 py-2 text-right font-mono text-[10px] text-slate-500 dark:text-slate-400\">\r\n                                                                {{formatNum(sub.totalNeed)}} {{sub.stockUnit}}\r\n                                                            </td>\r\n                                                            <td class=\"px-5 py-2 text-right\">\r\n                                                                @if(sub.isMissing) {\r\n                                                                    <button (click)=\"openQuickImport(sub)\" class=\"text-[9px] bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 px-2 py-1.5 rounded-lg font-bold border border-red-100 dark:border-red-800 flex items-center gap-1 transition ml-auto active:scale-95\">\r\n                                                                        <i class=\"fa-solid fa-bolt\"></i> B\u00F9 Kho\r\n                                                                    </button>\r\n                                                                }\r\n                                                            </td>\r\n                                                        </tr>\r\n                                                    }\r\n                                                }\r\n                                            }\r\n                                        </tbody>\r\n                                    </table>\r\n\r\n                                    <!-- Mobile Card List -->\r\n                                    <div class=\"md:hidden flex flex-col divide-y divide-slate-100 dark:divide-slate-700/50\">\r\n                                        @for(item of batch.resourceImpact; track item.name) {\r\n                                            <div class=\"p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition\">\r\n                                                <div class=\"flex justify-between items-start mb-1 gap-2\">\r\n                                                    <div class=\"font-medium text-slate-700 dark:text-slate-300 text-xs flex-1\" [ngClass]=\"{'text-red-600 dark:text-red-400': item.isMissing}\">\r\n                                                        {{item.displayName || item.name}}\r\n                                                        @if(item.isComposite) { <span class=\"text-[9px] text-slate-400 dark:text-slate-500 italic font-normal ml-1\">(Mix)</span> }\r\n                                                    </div>\r\n                                                    <div class=\"font-mono font-bold text-slate-600 dark:text-slate-400 text-xs shrink-0 bg-slate-50 dark:bg-slate-900/50 px-2 py-1 rounded border border-slate-100 dark:border-slate-700\">\r\n                                                        {{formatNum(item.stockNeed)}} <span class=\"text-[9px] text-slate-400 dark:text-slate-500 font-normal\">{{item.stockUnit}}</span>\r\n                                                    </div>\r\n                                                </div>\r\n\r\n                                                @if(item.isMissing && !item.isComposite) {\r\n                                                    <div class=\"flex justify-end mt-3\">\r\n                                                        <button (click)=\"openQuickImport(item)\" class=\"text-[11px] bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 px-4 py-2 rounded-xl font-bold border border-red-100 dark:border-red-800 flex items-center gap-1.5 transition active:scale-95 w-full justify-center\">\r\n                                                            <i class=\"fa-solid fa-bolt\"></i> B\u00F9 Kho\r\n                                                        </button>\r\n                                                    </div>\r\n                                                }\r\n\r\n                                                @if(item.isComposite) {\r\n                                                    <div class=\"mt-3 pl-3 border-l-2 border-indigo-100 dark:border-indigo-800 space-y-3\">\r\n                                                        @for(sub of item.breakdown; track sub.name) {\r\n                                                            <div>\r\n                                                                <div class=\"flex justify-between items-center gap-2\">\r\n                                                                    <div class=\"text-[11px] text-slate-500 dark:text-slate-400 flex-1 leading-tight\" [ngClass]=\"{'text-red-500 dark:text-red-400 font-bold': sub.isMissing}\">\r\n                                                                        {{sub.displayName || sub.name}}\r\n                                                                    </div>\r\n                                                                    <div class=\"font-mono font-bold text-[10px] text-slate-500 dark:text-slate-400 shrink-0\">\r\n                                                                        {{formatNum(sub.totalNeed)}} {{sub.stockUnit}}\r\n                                                                    </div>\r\n                                                                </div>\r\n                                                                @if(sub.isMissing) {\r\n                                                                    <div class=\"flex justify-end mt-2\">\r\n                                                                        <button (click)=\"openQuickImport(sub)\" class=\"text-[10px] bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 px-3 py-1.5 rounded-lg font-bold border border-red-100 dark:border-red-800 flex items-center gap-1.5 transition active:scale-95\">\r\n                                                                            <i class=\"fa-solid fa-bolt\"></i> B\u00F9 Kho\r\n                                                                        </button>\r\n                                                                    </div>\r\n                                                                }\r\n                                                            </div>\r\n                                                        }\r\n                                                    </div>\r\n                                                }\r\n                                            </div>\r\n                                        }\r\n                                    </div>\r\n                                </div>\r\n                            } @else {\r\n                                <!-- SUMMARY VIEW (When collapsed) -->\r\n                                <div class=\"px-4 py-2 bg-white dark:bg-slate-800 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition\" (click)=\"toggleBatchDetails(batchIdx)\">\r\n                                    @if(getMissingCount(batch) > 0) {\r\n                                        <div class=\"text-red-600 dark:text-red-400 font-bold flex items-center gap-2\">\r\n                                            <i class=\"fa-solid fa-circle-xmark\"></i> Thi\u1EBFu {{getMissingCount(batch)}} h\u00F3a ch\u1EA5t\r\n                                        </div>\r\n                                    } @else {\r\n                                        <div class=\"text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2\">\r\n                                            <i class=\"fa-solid fa-circle-check\"></i> \u0110\u1EE7 {{countTotalItems(batch)}}/{{countTotalItems(batch)}} h\u00F3a ch\u1EA5t\r\n                                        </div>\r\n                                    }\r\n                                    <div class=\"text-slate-400 dark:text-slate-500 text-[10px] font-medium flex items-center gap-1\">\r\n                                        Xem chi ti\u1EBFt <i class=\"fa-solid fa-angle-down\"></i>\r\n                                    </div>\r\n                                </div>\r\n                            }\r\n                        </div>\r\n                    }\r\n                    </div>\r\n                </div>\r\n\r\n                <!-- Right: Summary & Action -->\r\n                <div class=\"w-full lg:w-1/3 flex flex-col gap-4 h-fit sticky top-4 max-h-[calc(100vh-14rem)] overflow-y-auto custom-scrollbar pb-2 pr-1\">\r\n                    <!-- Stock Summary -->\r\n                    @if (totalStockSummary().length > 0) {\r\n                        <div class=\"bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm animate-slide-up\">\r\n                            <h4 class=\"font-bold text-slate-800 dark:text-slate-200 text-sm mb-3 flex items-center gap-2\">\r\n                                <i class=\"fa-solid fa-flask text-teal-500\"></i> T\u1ED5ng L\u01B0\u1EE3ng C\u1EA7n D\u00F9ng\r\n                            </h4>\r\n                            <div class=\"overflow-hidden rounded-xl border border-slate-100 dark:border-slate-700\">\r\n                                <table class=\"w-full text-xs text-left\">\r\n                                    <thead class=\"bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-slate-700\">\r\n                                        <tr><th class=\"px-3 py-2\">H\u00F3a ch\u1EA5t</th><th class=\"px-3 py-2 text-right\">L\u01B0\u1EE3ng c\u1EA7n</th><th class=\"px-2 w-10\"></th></tr>\r\n                                    </thead>\r\n                                    <tbody class=\"bg-white dark:bg-slate-800 divide-y divide-slate-50 dark:divide-slate-700/50\">\r\n                                        @for (item of totalStockSummary(); track item.name) {\r\n                                            <tr [ngClass]=\"{'bg-red-50/50 dark:bg-red-900/10': item.isMissing}\">\r\n                                                <td class=\"px-3 py-2 font-medium break-words whitespace-normal\" [ngClass]=\"item.isMissing ? 'text-red-700 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'\">\r\n                                                    {{item.name}}\r\n                                                    @if(item.ghsWarnings && item.ghsWarnings.length > 0) {\r\n                                                        <div class=\"flex gap-0.5 mt-1 opacity-70\">\r\n                                                            @for(ghs of item.ghsWarnings; track ghs) {\r\n                                                                @if(ghs.startsWith('GHS')) {\r\n                                                                    <img [src]=\"GHS_DICT[ghs].iconUrl\" class=\"w-3.5 h-3.5\" [title]=\"GHS_DICT[ghs].label\" />\r\n                                                                }\r\n                                                            }\r\n                                                        </div>\r\n                                                    }\r\n                                                    @if(item.isMissing) {\r\n                                                        <div class=\"text-[9px] text-red-500 dark:text-red-400 font-bold mt-0.5\"><i class=\"fa-solid fa-triangle-exclamation\"></i> Thi\u1EBFu: {{formatNum(item.missing)}} {{item.unit}}</div>\r\n                                                    }\r\n                                                </td>\r\n                                                <td class=\"px-3 py-2 text-right font-bold font-mono\" [ngClass]=\"item.isMissing ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'\">\r\n                                                    {{formatNum(item.needed)}} <span class=\"text-[9px] text-slate-400 font-normal\">{{item.unit}}</span>\r\n                                                </td>\r\n                                                <td class=\"px-2 py-1 text-center\">\r\n                                                    @if(item.isMissing) {\r\n                                                        <button (click)=\"openQuickImport(item)\" class=\"text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 w-6 h-6 rounded flex items-center justify-center transition\" title=\"Nh\u1EADp b\u1ED5 sung\">\r\n                                                            <i class=\"fa-solid fa-bolt\"></i>\r\n                                                        </button>\r\n                                                    }\r\n                                                </td>\r\n                                            </tr>\r\n                                        }\r\n                                    </tbody>\r\n                                </table>\r\n                            </div>\r\n                        </div>\r\n\r\n                        <!-- Safety Pre-Flight Briefing -->\r\n                        @if (aggregateGHSWarnings().length > 0) {\r\n                            <div class=\"bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 rounded-lg p-4 shadow-sm animate-slide-up mt-2\">\r\n                                <h4 class=\"font-bold text-orange-800 dark:text-orange-400 text-xs mb-2 uppercase flex items-center gap-2\">\r\n                                    <i class=\"fa-solid fa-triangle-exclamation animate-pulse\"></i> H\u01B0\u1EDBng D\u1EABn An To\u00E0n Tr\u01B0\u1EDBc Pha Ch\u1EBF\r\n                                </h4>\r\n\r\n                                <!-- GHS Icons -->\r\n                                <div class=\"flex flex-wrap gap-2 mb-3\">\r\n                                    @for(code of aggregateGHSWarnings(); track code) {\r\n                                        @if(code.startsWith('GHS')) {\r\n                                            <div class=\"bg-white dark:bg-slate-800 p-1.5 rounded-md shadow-sm border border-orange-100 dark:border-orange-800\">\r\n                                                <img [src]=\"GHS_DICT[code].iconUrl\" class=\"w-6 h-6\" [title]=\"GHS_DICT[code].label\"/>\r\n                                            </div>\r\n                                        }\r\n                                    }\r\n                                </div>\r\n\r\n                                <!-- Safety Checklist (H/P codes + Custom) -->\r\n                                <ul class=\"space-y-1.5 text-[11px] text-orange-700 dark:text-orange-300 font-medium\">\r\n                                    @for(code of aggregateGHSWarnings(); track code) {\r\n                                        @if(!code.startsWith('GHS')) {\r\n                                            <li class=\"flex items-start gap-1.5 text-orange-800 dark:text-orange-200\">\r\n                                                <i class=\"fa-solid fa-circle text-[4px] mt-1.5 opacity-50\"></i>\r\n                                                <span class=\"break-words whitespace-normal\">{{code}}</span>\r\n                                            </li>\r\n                                        }\r\n                                    }\r\n\r\n                                    <!-- Generic Precautionary Statements associated with the GHS modules -->\r\n                                    @for(code of aggregateGHSWarnings(); track code) {\r\n                                        @if(code.startsWith('GHS')) {\r\n                                            @for(rule of GHS_DICT[code].precautions; track rule) {\r\n                                                <li class=\"flex items-start gap-1.5 opacity-80\">\r\n                                                    <i class=\"fa-solid fa-circle text-[4px] mt-1.5 opacity-50\"></i>\r\n                                                    <span class=\"break-words whitespace-normal\"><span class=\"font-bold opacity-70\">Precaution:</span> {{rule}}</span>\r\n                                                </li>\r\n                                            }\r\n                                        }\r\n                                    }\r\n                                </ul>\r\n                            </div>\r\n                        }\r\n                    } @else {\r\n                        <div class=\"p-5 text-center text-sm font-medium text-slate-400 italic bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl animate-fade-in\">\r\n                            <i class=\"fa-solid fa-leaf text-2xl mb-2 text-slate-300 dark:text-slate-600\"></i><br>\r\n                            Kh\u00F4ng c\u00F3 h\u00F3a ch\u1EA5t n\u00E0o b\u1ECB ti\u00EAu hao.\r\n                        </div>\r\n                    }\r\n                </div>\r\n            }\r\n            </div>\r\n            }\r\n        </div>\r\n\r\n        <!-- NEW: Coverage Status Bar (Bottom Sticky) -->\r\n        @if(step() === 2) {\r\n            <div class=\"sticky bottom-0 w-full shrink-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)] z-40 transition-transform duration-300\">\r\n                <div class=\"max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4\">\r\n\r\n                    <!-- Metrics -->\r\n                    <div class=\"flex items-center gap-6 text-sm flex-1\">\r\n                        <div class=\"flex items-center gap-2\">\r\n                            <div class=\"w-8 h-8 rounded-full flex items-center justify-center shrink-0\"\r\n                                 [class]=\"coverageMetrics().isFullyCovered ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse'\">\r\n                                <i class=\"fa-solid\" [class]=\"coverageMetrics().isFullyCovered ? 'fa-check' : 'fa-triangle-exclamation'\"></i>\r\n                            </div>\r\n                            <div>\r\n                                <div class=\"font-bold\" [class]=\"coverageMetrics().isFullyCovered ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'\">\r\n                                    {{ coverageMetrics().isFullyCovered ? '\u0110\u00E3 ph\u1EE7 k\u00EDn to\u00E0n b\u1ED9 y\u00EAu c\u1EA7u' : 'C\u1EA3nh b\u00E1o: Ch\u01B0a ph\u1EE7 h\u1EBFt y\u00EAu c\u1EA7u!' }}\r\n                                </div>\r\n                                <div class=\"text-xs text-slate-500 dark:text-slate-400\">\r\n                                    Thi\u1EBFu <b>{{coverageMetrics().missingCount}}</b> ch\u1EC9 ti\u00EAu/m\u1EABu.\r\n                                    @if(coverageMetrics().duplicateCount > 0) { <span class=\"text-orange-600 dark:text-orange-400 ml-1\">(Tr\u00F9ng l\u1EB7p: {{coverageMetrics().duplicateCount}})</span> }\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n\r\n                        @if(!coverageMetrics().isFullyCovered) {\r\n                            <div class=\"hidden md:block text-xs bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-800\">\r\n                                <i class=\"fa-solid fa-circle-info mr-1\"></i> Ki\u1EC3m tra c\u00E1c m\u1EABu: {{ coverageMetrics().missingSampleNames }}\r\n                            </div>\r\n                        }\r\n                    </div>\r\n\r\n                    <!-- Actions -->\r\n                    <div class=\"flex items-center gap-2 lg:gap-3 w-full md:w-auto mt-3 md:mt-0\">\r\n                        @if(!coverageMetrics().isFullyCovered) {\r\n                            <button (click)=\"fixCoverage()\" class=\"flex-1 md:flex-none px-4 py-3 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-bold text-xs transition shadow-sm active:scale-95 flex items-center justify-center gap-1\">\r\n                                <i class=\"fa-solid fa-layer-group\"></i> T\u1EF1 S\u1EEDa\r\n                            </button>\r\n                        }\r\n\r\n                        <button (click)=\"executeAll()\"\r\n                                [disabled]=\"isProcessing() || batches().length === 0 || hasCriticalMissing() || hasInvalidAnalysisDates() || hasInvalidPlanResources() || !coverageMetrics().isFullyCovered || coverageMetrics().duplicateCount > 0\"\r\n                                class=\"flex-[2] md:flex-none px-4 lg:px-8 py-3 bg-slate-900 dark:bg-slate-700 text-white hover:bg-black dark:hover:bg-slate-600 rounded-xl font-bold text-sm shadow-lg transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2\">\r\n                            @if(isProcessing()) { <i class=\"fa-solid fa-spinner fa-spin\"></i> X\u1EED l\u00FD... }\r\n                            @else { <i class=\"fa-solid fa-paper-plane\"></i> Duy\u1EC7t & X\u1EBFp H\u00E0ng In }\r\n                        </button>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        }\r\n\r\n        <!-- Fix Coverage Modal -->\r\n        @if (fixCoverageState().isOpen) {\r\n            <div class=\"fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in\">\r\n                <div class=\"bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up\">\r\n                    <div class=\"px-5 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center shrink-0\">\r\n                        <div class=\"flex items-center gap-3\">\r\n                            <div class=\"w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center\">\r\n                                <i class=\"fa-solid fa-layer-group\"></i>\r\n                            </div>\r\n                            <div>\r\n                                <h3 class=\"font-black text-slate-800 dark:text-slate-200 text-lg\">Ki\u1EC3m Tra v\u00E0 X\u1EED L\u00FD Ch\u1EC9 Ti\u00EAu Ch\u01B0a \u0110\u01B0\u1EE3c Ph\u00E2n B\u1ED5</h3>\r\n                                <p class=\"text-[11px] text-slate-500 font-medium\">T\u00ECm th\u1EA5y {{fixCoverageState().group1.length + fixCoverageState().group2.length + fixCoverageState().group3.length}} ch\u1EC9 ti\u00EAu kh\u00F4ng th\u1EC3 t\u1EF1 gh\u00E9p m\u1EBB.</p>\r\n                            </div>\r\n                        </div>\r\n                        <button (click)=\"closeFixCoverageModal()\" class=\"text-slate-400 hover:text-slate-600 dark:hover:text-slate-300\"><i class=\"fa-solid fa-times text-lg\"></i></button>\r\n                    </div>\r\n\r\n                    <div class=\"flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6\">\r\n                        <!-- Nh\u00F3m 1 -->\r\n                        @if (fixCoverageState().group1.length > 0) {\r\n                            <div class=\"border border-amber-200 dark:border-amber-900/50 rounded-xl overflow-hidden\">\r\n                                <div class=\"bg-amber-50 dark:bg-amber-900/20 px-4 py-2 border-b border-amber-200 dark:border-amber-900/50 flex items-center gap-2\">\r\n                                    <i class=\"fa-solid fa-hand-pointer text-amber-600 dark:text-amber-400\"></i>\r\n                                    <span class=\"font-bold text-amber-800 dark:text-amber-300 text-sm\">NH\u00D3M 1: C\u1EA7n ch\u1ECDn th\u1EE7 c\u00F4ng SOP \u0110\u1EB7c th\u00F9 ({{fixCoverageState().group1.length}})</span>\r\n                                </div>\r\n                                <div class=\"p-4 space-y-4\">\r\n                                    <p class=\"text-xs text-slate-600 dark:text-slate-400\">C\u00E1c ch\u1EC9 ti\u00EAu n\u00E0y ch\u1EC9 t\u1ED3n t\u1EA1i trong SOP ch\u1EC9 \u0111\u1ECBnh th\u1EE7 c\u00F4ng. Vui l\u00F2ng ch\u1ECDn quy tr\u00ECnh mu\u1ED1n s\u1EED d\u1EE5ng ho\u1EB7c lo\u1EA1i b\u1ECF kh\u1ECFi k\u1EBF ho\u1EA1ch.</p>\r\n                                    @for (item of fixCoverageState().group1; track item.targetId + item.blockId; let i = $index) {\r\n                                        <div class=\"bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3\">\r\n                                            <div class=\"flex justify-between items-start mb-2\">\r\n                                                <div>\r\n                                                    <div class=\"font-bold text-slate-800 dark:text-slate-200 text-sm\">{{item.targetName}}</div>\r\n                                                    <div class=\"text-[11px] text-slate-500 mt-0.5\">Nh\u00F3m m\u1EABu #{{item.blockId}} \u2022 {{item.affectedSamples.join(', ')}}</div>\r\n                                                </div>\r\n                                                @if (item.candidateSops.length === 1) {\r\n                                                    <span class=\"text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold\">T\u1EF1 \u0111\u1ED9ng g\u1EE3i \u00FD</span>\r\n                                                }\r\n                                            </div>\r\n                                            <div class=\"flex items-center gap-2 mt-2\">\r\n                                                <select [ngModel]=\"item.chosenSopId || 'REMOVE'\" \r\n                                                        (ngModelChange)=\"updateFixGroup1Sop(i, $event === 'REMOVE' ? null : $event)\"\r\n                                                        class=\"flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded p-1.5 text-xs outline-none font-medium\">\r\n                                                    <option value=\"REMOVE\">-- Lo\u1EA1i b\u1ECF kh\u1ECFi k\u1EBF ho\u1EA1ch --</option>\r\n                                                    @for (sop of item.candidateSops; track sop.id) {\r\n                                                        <option [value]=\"sop.id\">G\u00E1n SOP: {{sop.name}}</option>\r\n                                                    }\r\n                                                </select>\r\n                                            </div>\r\n                                        </div>\r\n                                    }\r\n                                </div>\r\n                            </div>\r\n                        }\r\n\r\n                        <!-- Nh\u00F3m 2 -->\r\n                        @if (fixCoverageState().group2.length > 0) {\r\n                            <div class=\"border border-orange-200 dark:border-orange-900/50 rounded-xl overflow-hidden\">\r\n                                <div class=\"bg-orange-50 dark:bg-orange-900/20 px-4 py-2 border-b border-orange-200 dark:border-orange-900/50 flex items-center gap-2\">\r\n                                    <i class=\"fa-solid fa-triangle-exclamation text-orange-600 dark:text-orange-400\"></i>\r\n                                    <span class=\"font-bold text-orange-800 dark:text-orange-300 text-sm\">NH\u00D3M 2: Sai N\u1EC1n m\u1EABu (Matrix) ({{fixCoverageState().group2.length}})</span>\r\n                                </div>\r\n                                <div class=\"p-4 space-y-4\">\r\n                                    <p class=\"text-xs text-slate-600 dark:text-slate-400\">SOP h\u1ED7 tr\u1EE3 kh\u00F4ng kh\u1EDBp v\u1EDBi N\u1EC1n m\u1EABu c\u1EE7a nh\u00F3m. Ch\u1ECDn b\u1ECF qua r\u00E0ng bu\u1ED9c ho\u1EB7c lo\u1EA1i b\u1ECF ch\u1EC9 ti\u00EAu.</p>\r\n                                    @for (item of fixCoverageState().group2; track item.targetId + item.blockId; let i = $index) {\r\n                                        <div class=\"bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3\">\r\n                                            <div class=\"mb-2\">\r\n                                                <div class=\"font-bold text-slate-800 dark:text-slate-200 text-sm\">{{item.targetName}}</div>\r\n                                                <div class=\"text-[11px] text-slate-500 mt-0.5\">Nh\u00F3m m\u1EABu #{{item.blockId}} (N\u1EC1n m\u1EABu: <span class=\"font-bold text-slate-700 dark:text-slate-300\">{{getMatrixLabel(item.currentMatrix) || 'D\u00F9ng chung'}}</span>) \u2022 {{item.affectedSamples.join(', ')}}</div>\r\n                                                <div class=\"text-[10px] text-orange-600 dark:text-orange-400 italic mt-1\">SOP h\u1ED7 tr\u1EE3 ch\u1EC9 d\u00F9ng cho: {{ getCompatibleMatricesLabel(item) }}...</div>\r\n                                            </div>\r\n                                            <div class=\"flex gap-4 mt-3\">\r\n                                                <label class=\"flex items-center gap-1.5 text-xs cursor-pointer\">\r\n                                                    <input type=\"radio\" name=\"g2_{{i}}\" [checked]=\"item.action === 'ignore_matrix'\" (change)=\"updateFixGroup2Action(i, 'ignore_matrix')\" class=\"accent-orange-500\">\r\n                                                    <span>B\u1ECF qua r\u00E0ng bu\u1ED9c Matrix</span>\r\n                                                </label>\r\n                                                <label class=\"flex items-center gap-1.5 text-xs cursor-pointer\">\r\n                                                    <input type=\"radio\" name=\"g2_{{i}}\" [checked]=\"item.action === 'remove'\" (change)=\"updateFixGroup2Action(i, 'remove')\" class=\"accent-red-500\">\r\n                                                    <span class=\"text-red-600\">Lo\u1EA1i b\u1ECF ch\u1EC9 ti\u00EAu</span>\r\n                                                </label>\r\n                                            </div>\r\n                                        </div>\r\n                                    }\r\n                                </div>\r\n                            </div>\r\n                        }\r\n\r\n                        <!-- Nh\u00F3m 3 -->\r\n                        @if (fixCoverageState().group3.length > 0) {\r\n                            <div class=\"border border-red-200 dark:border-red-900/50 rounded-xl overflow-hidden\">\r\n                                <div class=\"bg-red-50 dark:bg-red-900/20 px-4 py-2 border-b border-red-200 dark:border-red-900/50 flex items-center gap-2\">\r\n                                    <i class=\"fa-solid fa-ban text-red-600 dark:text-red-400\"></i>\r\n                                    <span class=\"font-bold text-red-800 dark:text-red-300 text-sm\">NH\u00D3M 3: Kh\u00F4ng c\u00F3 SOP n\u00E0o h\u1ED7 tr\u1EE3 ({{fixCoverageState().group3.length}})</span>\r\n                                </div>\r\n                                <div class=\"p-4 space-y-4\">\r\n                                    <p class=\"text-xs text-slate-600 dark:text-slate-400\">Kh\u00F4ng t\u00ECm th\u1EA5y b\u1EA5t k\u1EF3 quy tr\u00ECnh n\u00E0o trong h\u1EC7 th\u1ED1ng c\u00F3 th\u1EC3 ph\u00E2n t\u00EDch ch\u1EC9 ti\u00EAu n\u00E0y.</p>\r\n                                    @for (item of fixCoverageState().group3; track item.targetId + item.blockId; let i = $index) {\r\n                                        <div class=\"bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3\">\r\n                                            <div class=\"mb-2\">\r\n                                                <div class=\"font-bold text-slate-800 dark:text-slate-200 text-sm\">{{item.targetName}}</div>\r\n                                                <div class=\"text-[11px] text-slate-500 mt-0.5\">Nh\u00F3m m\u1EABu #{{item.blockId}} \u2022 {{item.affectedSamples.join(', ')}}</div>\r\n                                            </div>\r\n                                            <div class=\"flex flex-wrap gap-4 mt-3\">\r\n                                                <label class=\"flex items-center gap-1.5 text-xs cursor-pointer\">\r\n                                                    <input type=\"radio\" name=\"g3_{{i}}\" [checked]=\"item.action === 'remove'\" (change)=\"updateFixGroup3Action(i, 'remove')\" class=\"accent-red-500\">\r\n                                                    <span class=\"font-bold text-red-600\">Lo\u1EA1i b\u1ECF kh\u1ECFi k\u1EBF ho\u1EA1ch</span>\r\n                                                </label>\r\n                                                <label class=\"flex items-center gap-1.5 text-xs cursor-pointer\">\r\n                                                    <input type=\"radio\" name=\"g3_{{i}}\" [checked]=\"item.action === 'keep_unmapped'\" (change)=\"updateFixGroup3Action(i, 'keep_unmapped')\" class=\"accent-slate-500\">\r\n                                                    <span>Gi\u1EEF l\u1EA1i (ch\u1EA5p nh\u1EADn c\u1EA3nh b\u00E1o)</span>\r\n                                                </label>\r\n                                            </div>\r\n                                        </div>\r\n                                    }\r\n                                </div>\r\n                            </div>\r\n                        }\r\n                    </div>\r\n\r\n                    <div class=\"p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-2 shrink-0\">\r\n                        <button (click)=\"closeFixCoverageModal()\" class=\"px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition\">\r\n                            H\u1EE7y\r\n                        </button>\r\n                        <button (click)=\"applyFixCoverage()\" [disabled]=\"fixCoverageState().isProcessing\" class=\"px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-md transition disabled:opacity-50 flex items-center gap-2\">\r\n                            @if(fixCoverageState().isProcessing) { <i class=\"fa-solid fa-spinner fa-spin\"></i> X\u1EED l\u00FD... }\r\n                            @else { <i class=\"fa-solid fa-check\"></i> \u00C1p d\u1EE5ng & Ch\u1EA1y l\u1EA1i }\r\n                        </button>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        }\r\n\r\n        <!-- Group Modal (Unchanged) -->\r\n        @if (showGroupModal()) {\r\n            <div class=\"fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in\">\r\n                <div class=\"bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh] animate-slide-up\">\r\n                    <div class=\"px-5 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center shrink-0\">\r\n                        <h3 class=\"font-black text-slate-800 dark:text-slate-200 text-lg\">Ch\u1ECDn Nh\u00F3m Ch\u1EC9 Ti\u00EAu</h3>\r\n                        <button (click)=\"showGroupModal.set(false)\" class=\"text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300\"><i class=\"fa-solid fa-times text-lg\"></i></button>\r\n                    </div>\r\n                    <div class=\"flex-1 overflow-y-auto p-2 custom-scrollbar\">\r\n                        @if (availableGroups().length === 0) {\r\n                            <div class=\"p-8 text-center text-slate-400 dark:text-slate-500 italic text-sm\"><i class=\"fa-solid fa-spinner fa-spin mb-2 text-xl\"></i><br>\u0110ang t\u1EA3i ho\u1EB7c ch\u01B0a c\u00F3 b\u1ED9 ch\u1EC9 ti\u00EAu n\u00E0o.</div>\r\n                        } @else {\r\n                            @for(g of availableGroups(); track g.id) {\r\n                                <div (click)=\"importGroup(g)\" class=\"p-4 border-b border-slate-50 dark:border-slate-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer transition group\">\r\n                                    <div class=\"font-bold text-slate-700 dark:text-slate-300 text-sm group-hover:text-indigo-700 dark:group-hover:text-indigo-400\">{{g.name}}</div>\r\n                                    <div class=\"text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex justify-between\"><span>{{g.targets.length}} ch\u1EC9 ti\u00EAu</span></div>\r\n                                </div>\r\n                            }\r\n                        }\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        }\r\n\r\n        <!-- REVERSE LOGIC SPLIT MODAL (3-STEP WIZARD) -->\r\n        @if (showSplitModal() && splitState().sourceBatchIndex >= 0) {\r\n            @defer {\r\n                <app-batch-split-wizard\r\n                    [sourceBatch]=\"batches()[splitState().sourceBatchIndex]\"\r\n                    [allSops]=\"activeSops()\"\r\n                    (close)=\"showSplitModal.set(false)\"\r\n                    (execute)=\"executeSplitFromWizard($event)\">\r\n                </app-batch-split-wizard>\r\n            }\r\n        }\r\n\r\n        <!-- QUICK IMPORT MODAL -->\r\n        @if (showQuickImport()) {\r\n            <div class=\"fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in\">\r\n                <div class=\"bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-bounce-in\">\r\n                    <div class=\"p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-start\">\r\n                        <div>\r\n                            <h3 class=\"font-black text-slate-800 dark:text-slate-200 text-lg flex items-center gap-2\">\r\n                                <i class=\"fa-solid fa-bolt text-yellow-500\"></i> Nh\u1EADp Kho Nhanh\r\n                            </h3>\r\n                            <p class=\"text-xs text-slate-500 dark:text-slate-400 mt-1\">B\u00F9 h\u00E0ng cho m\u1EBB ph\u00E2n t\u00EDch</p>\r\n                        </div>\r\n                        <button (click)=\"showQuickImport.set(false)\" class=\"text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300\"><i class=\"fa-solid fa-times\"></i></button>\r\n                    </div>\r\n\r\n                    <div class=\"p-5 space-y-4\">\r\n                        <div class=\"bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700\">\r\n                            <div class=\"text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1\">H\u00F3a ch\u1EA5t</div>\r\n                            <div class=\"font-bold text-slate-800 dark:text-slate-200 text-sm break-words whitespace-normal\">{{quickImportState().name}}</div>\r\n                            <div class=\"flex justify-between mt-2 pt-2 border-t border-slate-200 dark:border-slate-700\">\r\n                                <div class=\"text-[10px] text-slate-500 dark:text-slate-400\">T\u1ED3n: <b class=\"text-slate-700 dark:text-slate-300\">{{formatNum(quickImportState().currentStock)}}</b></div>\r\n                                <div class=\"text-[10px] text-slate-500 dark:text-slate-400\">Thi\u1EBFu: <b class=\"text-red-600 dark:text-red-400\">-{{formatNum(quickImportState().missingAmount)}}</b></div>\r\n                            </div>\r\n                        </div>\r\n\r\n                        <div>\r\n                            <label class=\"text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1\">S\u1ED1 l\u01B0\u1EE3ng th\u1EF1c nh\u1EADp</label>\r\n                            <div class=\"relative\">\r\n                                <input type=\"number\" [(ngModel)]=\"quickImportInput\" class=\"w-full pl-4 pr-12 py-3 border border-slate-300 dark:border-slate-600 rounded-xl text-lg font-bold text-emerald-600 dark:text-emerald-400 outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 transition bg-white dark:bg-slate-900\" placeholder=\"0\">\r\n                                <span class=\"absolute right-4 top-3.5 text-xs font-bold text-slate-400 dark:text-slate-500\">{{quickImportState().unit}}</span>\r\n                            </div>\r\n                            <p class=\"text-[10px] text-slate-400 dark:text-slate-500 mt-1 italic\">* Nh\u1EADp tr\u1EF1c ti\u1EBFp theo \u0111\u01A1n v\u1ECB g\u1ED1c ({{quickImportState().unit}})</p>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"p-5 border-t border-slate-100 dark:border-slate-700 flex gap-3\">\r\n                        <button (click)=\"showQuickImport.set(false)\" class=\"flex-1 py-3 text-slate-500 dark:text-slate-400 font-bold text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition\">H\u1EE7y</button>\r\n                        <button (click)=\"submitQuickImport()\" [disabled]=\"quickImportInput <= 0 || isProcessing()\" class=\"flex-[2] py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50\">\r\n                            X\u00E1c Nh\u1EADn Nh\u1EADp\r\n                        </button>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        }\r\n\r\n        <!-- QUICK GENERATE MODAL -->\r\n        @if (quickGenerateModalOpen()) {\r\n            @defer {\r\n                <app-quick-generate-sample-modal\r\n                    (close)=\"closeQuickGenerateModal()\"\r\n                    (generated)=\"handleGeneratedSamples($event)\">\r\n                </app-quick-generate-sample-modal>\r\n            }\r\n        }\r\n    </div>\r\n" }]
    }], () => [], null); }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(SmartBatchComponent, { className: "SmartBatchComponent", filePath: "src/app/features/batch/smart-batch.component.ts", lineNumber: 162 }); })();
function normalizeDescription(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}
//# sourceMappingURL=smart-batch.component.js.map