import { Component, inject, signal, computed, viewChild, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { StateService } from '../../core/services/state.service';
import { AuthService } from '../../core/services/auth.service';
import { ResultService } from '../results/services/result.service';
import { PrintService } from '../../core/services/print.service';
import { ToastService } from '../../core/services/toast.service';
import { GoogleDriveService } from '../../core/services/google-drive.service';
import { resolveConfigKey, ANGULAR_SOP_CONFIG } from '../results/config/sop-configs';
import { getSafeGoogleUrl, formatSampleList } from '../../shared/utils/utils';
import { ensureQrious } from '../../shared/utils/external-script-loader';
import { resolveCompoundDisplayName, isCompoundAssigned } from '../results/shared/compound-id-resolver';
import { MasterTargetService } from '../targets/master-target.service';
import { timestampToDate } from '../../shared/utils/timestamp';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
import * as i3 from "@angular/router";
const _c0 = ["qrCanvas"];
const _c1 = ["qrModalCanvas"];
const _c2 = (a0, a1, a2) => ({ "bg-emerald-500": a0, "bg-indigo-500": a1, "bg-amber-500": a2 });
const _c3 = a0 => ["/results-view", a0];
const _c4 = () => ({});
const _c5 = () => ["1", "2", "3"];
const _c6 = (a0, a1) => ({ "bg-indigo-50/30 dark:bg-indigo-900/10 font-semibold text-slate-900 dark:text-slate-100": a0, "bg-white dark:bg-slate-900": a1 });
const _forTrack0 = ($index, $item) => $item.key;
function BatchDetailViewComponent_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 19);
    i0.ɵɵelement(1, "span", 20);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    let tmp_2_0;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵclassMap(ctx_r0.getStatusClass());
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction3(4, _c2, ((tmp_2_0 = ctx_r0.draft()) == null ? null : tmp_2_0.status) === "completed", ((tmp_2_0 = ctx_r0.draft()) == null ? null : tmp_2_0.status) === "draft", ((tmp_2_0 = ctx_r0.draft()) == null ? null : tmp_2_0.status) === "pending" || !((tmp_2_0 = ctx_r0.draft()) == null ? null : tmp_2_0.status)));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.getStatusText(), " ");
} }
function BatchDetailViewComponent_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "a", 12);
    i0.ɵɵelement(1, "i", 21);
    i0.ɵɵtext(2, " \u0110\u00E3 G\u1ED9p M\u1EBB T\u1ED5ng H\u1EE3p ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("routerLink", i0.ɵɵpureFunction1(1, _c3, ctx_r0.run().parentMasterId));
} }
function BatchDetailViewComponent_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 13)(1, "button", 22);
    i0.ɵɵlistener("click", function BatchDetailViewComponent_Conditional_17_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.openQrModal()); });
    i0.ɵɵelement(2, "i", 23);
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4, "M\u00E3 QR");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "button", 24);
    i0.ɵɵlistener("click", function BatchDetailViewComponent_Conditional_17_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.goToEditMode()); });
    i0.ɵɵelement(6, "i", 25);
    i0.ɵɵelementStart(7, "span");
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    let tmp_2_0;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵclassMap(ctx_r0.lockedByOthers() ? "px-4 py-2 text-xs font-black text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-all duration-200 active:scale-95 flex items-center gap-2 cursor-pointer" : "px-4 py-2 text-xs font-black text-white bg-indigo-650 hover:bg-indigo-755 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-xl shadow-xs transition-all duration-200 active:scale-95 flex items-center gap-2 cursor-pointer");
    i0.ɵɵproperty("title", ctx_r0.lockedByOthers() ? "M\u1EBB n\u00E0y \u0111ang b\u1ECB s\u1EEDa b\u1EDFi " + ((tmp_2_0 = ctx_r0.run()) == null ? null : tmp_2_0.lockedByName) + ". Nh\u1EA5p \u0111\u1EC3 xem chi ti\u1EBFt ho\u1EB7c Gi\u00E0nh quy\u1EC1n." : "Nh\u1EA5p \u0111\u1EC3 ch\u1EC9nh s\u1EEDa s\u1ED1 li\u1EC7u");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("fa-lock", ctx_r0.lockedByOthers())("fa-pen-to-square", !ctx_r0.lockedByOthers());
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.lockedByOthers() ? "M\u1EBB \u0111ang kh\u00F3a" : "Ch\u1EC9nh s\u1EEDa s\u1ED1 li\u1EC7u");
} }
function BatchDetailViewComponent_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 14)(1, "div", 26);
    i0.ɵɵelement(2, "i", 27);
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4, "M\u00E3 m\u1EBB:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span", 28);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "div", 29);
    i0.ɵɵtext(8, "\u2022");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 26);
    i0.ɵɵelement(10, "i", 30);
    i0.ɵɵelementStart(11, "span");
    i0.ɵɵtext(12, "Ph\u00E2n t\u00EDch vi\u00EAn:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "span", 31);
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "div", 29);
    i0.ɵɵtext(16, "\u2022");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "div", 26);
    i0.ɵɵelement(18, "i", 32);
    i0.ɵɵelementStart(19, "span");
    i0.ɵɵtext(20, "Ng\u00E0y ph\u00E2n t\u00EDch:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "span", 31);
    i0.ɵɵtext(22);
    i0.ɵɵpipe(23, "date");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    let tmp_3_0;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(((tmp_1_0 = ctx_r0.run()) == null ? null : tmp_1_0.inputs == null ? null : tmp_1_0.inputs["batchCode"]) || ((tmp_1_0 = ctx_r0.run()) == null ? null : tmp_1_0.id));
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate(((tmp_2_0 = ctx_r0.run()) == null ? null : tmp_2_0.user) || "\u2014");
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate(((tmp_3_0 = ctx_r0.run()) == null ? null : tmp_3_0.analysisDate) ? i0.ɵɵpipeBind2(23, 3, ctx_r0.run().analysisDate, "dd/MM/yyyy") : "\u2014");
} }
function BatchDetailViewComponent_Conditional_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 15)(1, "div", 33);
    i0.ɵɵelement(2, "i", 34);
    i0.ɵɵelementStart(3, "p", 35);
    i0.ɵɵtext(4, "\u0110ang t\u1EA3i chi ti\u1EBFt m\u1EBB ch\u1EA1y...");
    i0.ɵɵelementEnd()()();
} }
function BatchDetailViewComponent_Conditional_20_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 36)(1, "div", 60)(2, "div", 61);
    i0.ɵɵelement(3, "i", 62);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div")(5, "h4", 63);
    i0.ɵɵtext(6, "M\u1EBB Ch\u1EA1y \u0110ang \u0110\u01B0\u1EE3c Ch\u1EC9nh S\u1EEDa");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "p", 64);
    i0.ɵɵtext(8, " KTV ");
    i0.ɵɵelementStart(9, "strong");
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(11, " \u0111ang ch\u1EC9nh s\u1EEDa m\u1EBB n\u00E0y t\u1EEB l\u00FAc ");
    i0.ɵɵelementStart(12, "strong");
    i0.ɵɵtext(13);
    i0.ɵɵpipe(14, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(15, ". S\u1ED1 li\u1EC7u hi\u1EC3n th\u1ECB c\u00F3 th\u1EC3 thay \u0111\u1ED5i li\u00EAn t\u1EE5c. ");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(16, "button", 65);
    i0.ɵɵlistener("click", function BatchDetailViewComponent_Conditional_20_Conditional_0_Template_button_click_16_listener() { i0.ɵɵrestoreView(_r4); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.takeOverLock()); });
    i0.ɵɵelement(17, "i", 66);
    i0.ɵɵelementStart(18, "span");
    i0.ɵɵtext(19, "Gi\u00E0nh Quy\u1EC1n Ch\u1EC9nh S\u1EEDa");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(10);
    i0.ɵɵtextInterpolate((tmp_2_0 = ctx_r0.run()) == null ? null : tmp_2_0.lockedByName);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(14, 2, ctx_r0.convertToDate((tmp_3_0 = ctx_r0.run()) == null ? null : tmp_3_0.lockedAt), "HH:mm dd/MM/yyyy"));
} }
function BatchDetailViewComponent_Conditional_20_Conditional_17_For_4_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 67);
    i0.ɵɵlistener("click", function BatchDetailViewComponent_Conditional_20_Conditional_17_For_4_Template_button_click_0_listener() { const prefix_r7 = i0.ɵɵrestoreView(_r6).$implicit; const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.changeActiveFilter(prefix_r7)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const prefix_r7 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵclassMap(ctx_r0.activeFilter() === prefix_r7 ? "px-2 py-1 text-[9px] font-black bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 rounded shadow-xs" : "px-2 py-1 text-[9px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", prefix_r7 === "" ? "Kh\u00F4ng" : prefix_r7, " ");
} }
function BatchDetailViewComponent_Conditional_20_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 47)(1, "button", 67);
    i0.ɵɵlistener("click", function BatchDetailViewComponent_Conditional_20_Conditional_17_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r5); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.changeActiveFilter("ALL")); });
    i0.ɵɵtext(2, " T\u1EA5t C\u1EA3 ");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(3, BatchDetailViewComponent_Conditional_20_Conditional_17_For_4_Template, 2, 3, "button", 68, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r0.activeFilter() === "ALL" ? "px-2 py-1 text-[9px] font-black bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 rounded shadow-xs" : "px-2 py-1 text-[9px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300");
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r0.detectedPrefixes());
} }
function BatchDetailViewComponent_Conditional_20_Conditional_18_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 70);
    i0.ɵɵlistener("click", function BatchDetailViewComponent_Conditional_20_Conditional_18_For_2_Template_button_click_0_listener() { const sample_r9 = i0.ɵɵrestoreView(_r8).$implicit; const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.activeSampleCode.set(sample_r9)); });
    i0.ɵɵelementStart(1, "span", 71);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const sample_r9 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵclassMap(ctx_r0.activeSampleCode() === sample_r9 ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20 border-transparent" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(sample_r9);
} }
function BatchDetailViewComponent_Conditional_20_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 48);
    i0.ɵɵrepeaterCreate(1, BatchDetailViewComponent_Conditional_20_Conditional_18_For_2_Template, 3, 3, "button", 69, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    let tmp_2_0;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵrepeater((tmp_2_0 = ctx_r0.run()) == null ? null : tmp_2_0.sampleList);
} }
function BatchDetailViewComponent_Conditional_20_Conditional_20_For_20_For_11_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 87);
    i0.ɵɵtext(1, "\u0110\u1EA1t");
    i0.ɵɵelementEnd();
} }
function BatchDetailViewComponent_Conditional_20_Conditional_20_For_20_For_11_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 88);
    i0.ɵɵtext(1, "K.\u0110\u1EA1t");
    i0.ɵɵelementEnd();
} }
function BatchDetailViewComponent_Conditional_20_Conditional_20_For_20_For_11_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 89);
    i0.ɵɵtext(1, "\u2014");
    i0.ɵɵelementEnd();
} }
function BatchDetailViewComponent_Conditional_20_Conditional_20_For_20_For_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 83);
    i0.ɵɵtemplate(1, BatchDetailViewComponent_Conditional_20_Conditional_20_For_20_For_11_Conditional_1_Template, 2, 0, "span", 87)(2, BatchDetailViewComponent_Conditional_20_Conditional_20_For_20_For_11_Conditional_2_Template, 2, 0, "span", 88)(3, BatchDetailViewComponent_Conditional_20_Conditional_20_For_20_For_11_Conditional_3_Template, 2, 0, "span", 89);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    let tmp_23_0;
    const qcNum_r10 = ctx.$implicit;
    const comp_r11 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵconditional((((tmp_23_0 = ctx_r0.draft()) == null ? null : tmp_23_0.resultData == null ? null : tmp_23_0.resultData[ctx_r0.activeSampleCode()]) || i0.ɵɵpureFunction0(1, _c4))[comp_r11 + "_qc" + qcNum_r10] === "\u0110\u1EA1t" ? 1 : (((tmp_23_0 = ctx_r0.draft()) == null ? null : tmp_23_0.resultData == null ? null : tmp_23_0.resultData[ctx_r0.activeSampleCode()]) || i0.ɵɵpureFunction0(2, _c4))[comp_r11 + "_qc" + qcNum_r10] === "Kh\u00F4ng \u0111\u1EA1t" ? 2 : 3);
} }
function BatchDetailViewComponent_Conditional_20_Conditional_20_For_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 79)(1, "td", 81);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 82);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "td", 83)(6, "span", 84);
    i0.ɵɵelement(7, "i", 85);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "td", 86);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(10, BatchDetailViewComponent_Conditional_20_Conditional_20_For_20_For_11_Template, 4, 3, "td", 83, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    let tmp_15_0;
    let tmp_16_0;
    let tmp_17_0;
    let tmp_18_0;
    const comp_r11 = ctx.$implicit;
    const ɵ$index_223_r12 = ctx.$index;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ɵ$index_223_r12 + 1, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r0.getCompoundDisplayName(comp_r11), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("text-amber-500", (((tmp_15_0 = ctx_r0.draft()) == null ? null : tmp_15_0.resultData == null ? null : tmp_15_0.resultData[ctx_r0.activeSampleCode()]) || i0.ɵɵpureFunction0(9, _c4))[comp_r11 + "_nd"]);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("fa-square-check", (((tmp_16_0 = ctx_r0.draft()) == null ? null : tmp_16_0.resultData == null ? null : tmp_16_0.resultData[ctx_r0.activeSampleCode()]) || i0.ɵɵpureFunction0(10, _c4))[comp_r11 + "_nd"])("fa-square", !(((tmp_17_0 = ctx_r0.draft()) == null ? null : tmp_17_0.resultData == null ? null : tmp_17_0.resultData[ctx_r0.activeSampleCode()]) || i0.ɵɵpureFunction0(11, _c4))[comp_r11 + "_nd"]);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", (((tmp_18_0 = ctx_r0.draft()) == null ? null : tmp_18_0.resultData == null ? null : tmp_18_0.resultData[ctx_r0.activeSampleCode()]) || i0.ɵɵpureFunction0(12, _c4))[comp_r11] !== undefined && (((tmp_18_0 = ctx_r0.draft()) == null ? null : tmp_18_0.resultData == null ? null : tmp_18_0.resultData[ctx_r0.activeSampleCode()]) || i0.ɵɵpureFunction0(13, _c4))[comp_r11] !== null ? (((tmp_18_0 = ctx_r0.draft()) == null ? null : tmp_18_0.resultData == null ? null : tmp_18_0.resultData[ctx_r0.activeSampleCode()]) || i0.ɵɵpureFunction0(14, _c4))[comp_r11] === "N/A" ? "\u2014" : (((tmp_18_0 = ctx_r0.draft()) == null ? null : tmp_18_0.resultData == null ? null : tmp_18_0.resultData[ctx_r0.activeSampleCode()]) || i0.ɵɵpureFunction0(15, _c4))[comp_r11] : "\u2014", " ");
    i0.ɵɵadvance();
    i0.ɵɵrepeater(i0.ɵɵpureFunction0(16, _c5));
} }
function BatchDetailViewComponent_Conditional_20_Conditional_20_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr", 80)(1, "td", 90)(2, "button", 91);
    i0.ɵɵlistener("click", function BatchDetailViewComponent_Conditional_20_Conditional_20_Conditional_21_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r13); const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.showAllTargets.set(!ctx_r0.showAllTargets())); });
    i0.ɵɵelement(3, "i", 92);
    i0.ɵɵelementStart(4, "span");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "span", 93);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵattribute("colspan", 7);
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("fa-chevron-down", !ctx_r0.showAllTargets())("fa-chevron-up", ctx_r0.showAllTargets());
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.showAllTargets() ? "\u1EA8n b\u1EDBt ch\u1EC9 ti\u00EAu kh\u00F4ng ch\u1EC9 \u0111\u1ECBnh" : "Hi\u1EC7n th\u00EAm " + ctx_r0.unassignedCompounds().length + " ch\u1EC9 ti\u00EAu kh\u00F4ng ch\u1EC9 \u0111\u1ECBnh");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r0.unassignedCompounds().length, " ");
} }
function BatchDetailViewComponent_Conditional_20_Conditional_20_Conditional_22_For_1_For_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 83)(1, "span", 98);
    i0.ɵɵtext(2, "\u2014");
    i0.ɵɵelementEnd()();
} }
function BatchDetailViewComponent_Conditional_20_Conditional_20_Conditional_22_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 94)(1, "td", 81);
    i0.ɵɵelement(2, "i", 95);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 82);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "td", 83)(6, "span", 96);
    i0.ɵɵtext(7, "\u2014");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "td", 86)(9, "span", 97);
    i0.ɵɵtext(10, "\u2014");
    i0.ɵɵelementEnd()();
    i0.ɵɵrepeaterCreate(11, BatchDetailViewComponent_Conditional_20_Conditional_20_Conditional_22_For_1_For_12_Template, 3, 0, "td", 83, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const comp_r14 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", ctx_r0.getCompoundDisplayName(comp_r14), " ");
    i0.ɵɵadvance(7);
    i0.ɵɵrepeater(i0.ɵɵpureFunction0(1, _c5));
} }
function BatchDetailViewComponent_Conditional_20_Conditional_20_Conditional_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, BatchDetailViewComponent_Conditional_20_Conditional_20_Conditional_22_For_1_Template, 13, 2, "tr", 94, i0.ɵɵrepeaterTrackByIdentity);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵrepeater(ctx_r0.unassignedCompounds());
} }
function BatchDetailViewComponent_Conditional_20_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 50)(1, "table", 72)(2, "thead")(3, "tr", 73)(4, "th", 74);
    i0.ɵɵtext(5, "STT");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "th", 75);
    i0.ɵɵtext(7, "Ho\u1EA1t ch\u1EA5t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "th", 76);
    i0.ɵɵtext(9, "ND (N/A)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "th", 77);
    i0.ɵɵtext(11, "K\u1EBFt qu\u1EA3 (\u00B5g/kg)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "th", 77);
    i0.ɵɵtext(13, "\u0110\u1ED9 thu h\u1ED3i R%");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "th", 77);
    i0.ɵɵtext(15, "H\u1EC7 s\u1ED1 tuy\u1EBFn t\u00EDnh R2");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "th", 77);
    i0.ɵɵtext(17, "K\u1EBFt lu\u1EADn");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(18, "tbody", 78);
    i0.ɵɵrepeaterCreate(19, BatchDetailViewComponent_Conditional_20_Conditional_20_For_20_Template, 12, 17, "tr", 79, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵtemplate(21, BatchDetailViewComponent_Conditional_20_Conditional_20_Conditional_21_Template, 8, 7, "tr", 80)(22, BatchDetailViewComponent_Conditional_20_Conditional_20_Conditional_22_Template, 2, 0);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(19);
    i0.ɵɵrepeater(ctx_r0.assignedCompounds());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.unassignedCompounds().length > 0 ? 21 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.showAllTargets() ? 22 : -1);
} }
function BatchDetailViewComponent_Conditional_20_Conditional_21_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 102);
    i0.ɵɵtext(1, "Kh\u1ED1i l\u01B0\u1EE3ng");
    i0.ɵɵelementEnd();
} }
function BatchDetailViewComponent_Conditional_20_Conditional_21_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 102);
    i0.ɵɵtext(1, "HS Pha lo\u00E3ng");
    i0.ɵɵelementEnd();
} }
function BatchDetailViewComponent_Conditional_20_Conditional_21_For_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 103);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const col_r15 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.columnDisplayNames()[col_r15] || col_r15, " ");
} }
function BatchDetailViewComponent_Conditional_20_Conditional_21_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    const _r16 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "th", 104)(1, "button", 107);
    i0.ɵɵlistener("click", function BatchDetailViewComponent_Conditional_20_Conditional_21_Conditional_12_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r16); const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.showAllTargets.set(!ctx_r0.showAllTargets())); });
    i0.ɵɵelement(2, "i", 25);
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("fa-plus-circle", !ctx_r0.showAllTargets())("fa-minus-circle", ctx_r0.showAllTargets());
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.showAllTargets() ? "Thu g\u1ECDn" : "+" + ctx_r0.hiddenColumns().length + " c\u1ED9t");
} }
function BatchDetailViewComponent_Conditional_20_Conditional_21_For_17_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 110);
    i0.ɵɵelement(1, "i", 116);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const row_r17 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", row_r17.label, " ");
} }
function BatchDetailViewComponent_Conditional_20_Conditional_21_For_17_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 111);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const row_r17 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(row_r17.label);
} }
function BatchDetailViewComponent_Conditional_20_Conditional_21_For_17_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 112);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const row_r17 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.getRowDataValue(row_r17.key, "khoiLuong") !== "" ? ctx_r0.getRowDataValue(row_r17.key, "khoiLuong") : "\u2014", " ");
} }
function BatchDetailViewComponent_Conditional_20_Conditional_21_For_17_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 112);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const row_r17 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.getRowDataValue(row_r17.key, "heSoPhaLoang") !== "" ? ctx_r0.getRowDataValue(row_r17.key, "heSoPhaLoang") : "\u2014", " ");
} }
function BatchDetailViewComponent_Conditional_20_Conditional_21_For_17_For_9_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const col_r18 = i0.ɵɵnextContext().$implicit;
    const row_r17 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵtextInterpolate1(" ", ctx_r0.getRowDataValue(row_r17.key, col_r18) !== "" ? ctx_r0.getRowDataValue(row_r17.key, col_r18) === "N/A" ? "\u2014" : ctx_r0.getRowDataValue(row_r17.key, col_r18) : "\u2014", " ");
} }
function BatchDetailViewComponent_Conditional_20_Conditional_21_For_17_For_9_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 97);
    i0.ɵɵtext(1, "\u2014");
    i0.ɵɵelementEnd();
} }
function BatchDetailViewComponent_Conditional_20_Conditional_21_For_17_For_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 113);
    i0.ɵɵtemplate(1, BatchDetailViewComponent_Conditional_20_Conditional_21_For_17_For_9_Conditional_1_Template, 1, 1)(2, BatchDetailViewComponent_Conditional_20_Conditional_21_For_17_For_9_Conditional_2_Template, 2, 0, "span", 97);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const col_r18 = ctx.$implicit;
    const row_r17 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.isTargetAssigned(row_r17.key, col_r18) ? 1 : 2);
} }
function BatchDetailViewComponent_Conditional_20_Conditional_21_For_17_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 114);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.showAllTargets() ? "" : "...", " ");
} }
function BatchDetailViewComponent_Conditional_20_Conditional_21_For_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 106)(1, "td", 108);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 109);
    i0.ɵɵtemplate(4, BatchDetailViewComponent_Conditional_20_Conditional_21_For_17_Conditional_4_Template, 3, 1, "span", 110)(5, BatchDetailViewComponent_Conditional_20_Conditional_21_For_17_Conditional_5_Template, 2, 1, "span", 111);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(6, BatchDetailViewComponent_Conditional_20_Conditional_21_For_17_Conditional_6_Template, 2, 1, "td", 112)(7, BatchDetailViewComponent_Conditional_20_Conditional_21_For_17_Conditional_7_Template, 2, 1, "td", 112);
    i0.ɵɵrepeaterCreate(8, BatchDetailViewComponent_Conditional_20_Conditional_21_For_17_For_9_Template, 3, 1, "td", 113, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵtemplate(10, BatchDetailViewComponent_Conditional_20_Conditional_21_For_17_Conditional_10_Template, 2, 1, "td", 114);
    i0.ɵɵelementStart(11, "td", 115);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const row_r17 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction2(7, _c6, row_r17.isQC, !row_r17.isQC));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r0.getRowDataValue(row_r17.key, "loSo") || "\u2014", " ");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(row_r17.isQC ? 4 : 5);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.hasColumn("khoiLuong") ? 6 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.hasColumn("heSoPhaLoang") ? 7 : -1);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r0.visibleColumns());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.hiddenColumns().length > 0 ? 10 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r0.getRowDataValue(row_r17.key, "ghiChu"), " ");
} }
function BatchDetailViewComponent_Conditional_20_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 50)(1, "table", 99)(2, "thead")(3, "tr", 73)(4, "th", 100);
    i0.ɵɵtext(5, "Vial No.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "th", 101);
    i0.ɵɵtext(7, "M\u1EABu th\u1EED");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(8, BatchDetailViewComponent_Conditional_20_Conditional_21_Conditional_8_Template, 2, 0, "th", 102)(9, BatchDetailViewComponent_Conditional_20_Conditional_21_Conditional_9_Template, 2, 0, "th", 102);
    i0.ɵɵrepeaterCreate(10, BatchDetailViewComponent_Conditional_20_Conditional_21_For_11_Template, 2, 1, "th", 103, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵtemplate(12, BatchDetailViewComponent_Conditional_20_Conditional_21_Conditional_12_Template, 5, 5, "th", 104);
    i0.ɵɵelementStart(13, "th", 105);
    i0.ɵɵtext(14, "Ghi ch\u00FA");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(15, "tbody", 78);
    i0.ɵɵrepeaterCreate(16, BatchDetailViewComponent_Conditional_20_Conditional_21_For_17_Template, 13, 10, "tr", 106, _forTrack0);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(8);
    i0.ɵɵconditional(ctx_r0.hasColumn("khoiLuong") ? 8 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.hasColumn("heSoPhaLoang") ? 9 : -1);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r0.visibleColumns());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.hiddenColumns().length > 0 ? 12 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx_r0.getType2DisplayRows());
} }
function BatchDetailViewComponent_Conditional_20_Conditional_28_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 118);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const report_r20 = ctx.$implicit;
    i0.ɵɵproperty("value", report_r20.key);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(report_r20.label);
} }
function BatchDetailViewComponent_Conditional_20_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    const _r19 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "select", 117);
    i0.ɵɵlistener("ngModelChange", function BatchDetailViewComponent_Conditional_20_Conditional_28_Template_select_ngModelChange_0_listener($event) { i0.ɵɵrestoreView(_r19); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.selectReport($event)); });
    i0.ɵɵrepeaterCreate(1, BatchDetailViewComponent_Conditional_20_Conditional_28_For_2_Template, 2, 2, "option", 118, _forTrack0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("ngModel", ctx_r0.selectedPdfPrefix());
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r0.availableReports());
} }
function BatchDetailViewComponent_Conditional_20_Conditional_30_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "a", 56);
    i0.ɵɵelement(1, "i", 119);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3, "Google Docs");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("href", ctx_r0.currentDocsUrl(), i0.ɵɵsanitizeUrl);
} }
function BatchDetailViewComponent_Conditional_20_Conditional_31_Template(rf, ctx) { if (rf & 1) {
    const _r21 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 120);
    i0.ɵɵlistener("click", function BatchDetailViewComponent_Conditional_20_Conditional_31_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r21); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.openPdfInModal(ctx_r0.currentPdfUrl())); });
    i0.ɵɵelement(1, "i", 121);
    i0.ɵɵelementEnd();
} }
function BatchDetailViewComponent_Conditional_20_Conditional_33_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 122)(1, "div", 125);
    i0.ɵɵelement(2, "i", 126);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div")(4, "p", 127);
    i0.ɵɵtext(5, "\u0110ang t\u1EA3i PDF...");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 128);
    i0.ɵɵtext(7, "T\u1EA3i d\u1EEF li\u1EC7u t\u1EEB Google Drive qua proxy");
    i0.ɵɵelementEnd()()();
} }
function BatchDetailViewComponent_Conditional_20_Conditional_33_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r22 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 122)(1, "div", 129);
    i0.ɵɵelement(2, "i", 130);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div")(4, "p", 131);
    i0.ɵɵtext(5, "C\u1EA7n x\u00E1c th\u1EF1c Google Drive");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 132);
    i0.ɵɵtext(7, "Phi\u00EAn x\u00E1c th\u1EF1c \u0111\u00E3 h\u1EBFt h\u1EA1n. X\u00E1c th\u1EF1c l\u1EA1i \u0111\u1EC3 xem PDF tr\u1EF1c ti\u1EBFp trong trang.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 133)(9, "button", 134);
    i0.ɵɵlistener("click", function BatchDetailViewComponent_Conditional_20_Conditional_33_Conditional_1_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r22); const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.beginInlinePdfAuth()); });
    i0.ɵɵelement(10, "i", 135);
    i0.ɵɵtext(11, "X\u00E1c th\u1EF1c & t\u1EA3i l\u1EA1i ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "button", 136);
    i0.ɵɵlistener("click", function BatchDetailViewComponent_Conditional_20_Conditional_33_Conditional_1_Template_button_click_12_listener() { i0.ɵɵrestoreView(_r22); const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.openPdfInModal(ctx_r0.currentPdfUrl())); });
    i0.ɵɵtext(13, " M\u1EDF modal ");
    i0.ɵɵelementEnd()()();
} }
function BatchDetailViewComponent_Conditional_20_Conditional_33_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r23 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 122);
    i0.ɵɵelement(1, "i", 137);
    i0.ɵɵelementStart(2, "div")(3, "p", 131);
    i0.ɵɵtext(4, "Kh\u00F4ng th\u1EC3 t\u1EA3i PDF tr\u1EF1c ti\u1EBFp");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 138);
    i0.ɵɵtext(6, "B\u1EA1n v\u1EABn c\u00F3 th\u1EC3 m\u1EDF b\u1EB1ng modal h\u1EC7 th\u1ED1ng.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "button", 134);
    i0.ɵɵlistener("click", function BatchDetailViewComponent_Conditional_20_Conditional_33_Conditional_2_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r23); const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.openPdfInModal(ctx_r0.currentPdfUrl())); });
    i0.ɵɵelement(8, "i", 139);
    i0.ɵɵtext(9, "M\u1EDF qua h\u1EC7 th\u1ED1ng ");
    i0.ɵɵelementEnd()();
} }
function BatchDetailViewComponent_Conditional_20_Conditional_33_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "iframe", 123);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("src", ctx_r0.inlinePdfSafeUrl(), i0.ɵɵsanitizeResourceUrl);
} }
function BatchDetailViewComponent_Conditional_20_Conditional_33_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 124);
    i0.ɵɵelement(1, "i", 140);
    i0.ɵɵelementStart(2, "p", 141);
    i0.ɵɵtext(3, "\u0110ang chu\u1EA9n b\u1ECB PDF...");
    i0.ɵɵelementEnd()();
} }
function BatchDetailViewComponent_Conditional_20_Conditional_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, BatchDetailViewComponent_Conditional_20_Conditional_33_Conditional_0_Template, 8, 0, "div", 122)(1, BatchDetailViewComponent_Conditional_20_Conditional_33_Conditional_1_Template, 14, 0, "div", 122)(2, BatchDetailViewComponent_Conditional_20_Conditional_33_Conditional_2_Template, 10, 0, "div", 122)(3, BatchDetailViewComponent_Conditional_20_Conditional_33_Conditional_3_Template, 1, 1, "iframe", 123)(4, BatchDetailViewComponent_Conditional_20_Conditional_33_Conditional_4_Template, 4, 0, "div", 124);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵconditional(ctx_r0.isInlinePdfLoading() ? 0 : ctx_r0.inlinePdfNeedsAuth() ? 1 : ctx_r0.inlinePdfError() ? 2 : ctx_r0.inlinePdfSafeUrl() ? 3 : 4);
} }
function BatchDetailViewComponent_Conditional_20_Conditional_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 59);
    i0.ɵɵelement(1, "i", 142);
    i0.ɵɵelementStart(2, "p", 143);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r0.pdfPreviewEmptyMessage());
} }
function BatchDetailViewComponent_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵtemplate(0, BatchDetailViewComponent_Conditional_20_Conditional_0_Template, 20, 5, "div", 36);
    i0.ɵɵelementStart(1, "div", 37)(2, "button", 38);
    i0.ɵɵlistener("click", function BatchDetailViewComponent_Conditional_20_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.mobileActiveTab.set("grid")); });
    i0.ɵɵelement(3, "i", 39);
    i0.ɵɵelementStart(4, "span");
    i0.ɵɵtext(5, "B\u1EA3ng K\u1EBFt Qu\u1EA3");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "button", 38);
    i0.ɵɵlistener("click", function BatchDetailViewComponent_Conditional_20_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.mobileActiveTab.set("pdf")); });
    i0.ɵɵelement(7, "i", 40);
    i0.ɵɵelementStart(8, "span");
    i0.ɵɵtext(9, "Xem Tr\u01B0\u1EDBc PDF");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(10, "div", 41)(11, "div", 42)(12, "div", 43)(13, "div", 44)(14, "h4", 45);
    i0.ɵɵelement(15, "i", 46);
    i0.ɵɵtext(16, " B\u1EA3ng K\u1EBFt Qu\u1EA3 Ch\u1EA1y ");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(17, BatchDetailViewComponent_Conditional_20_Conditional_17_Template, 5, 2, "div", 47);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(18, BatchDetailViewComponent_Conditional_20_Conditional_18_Template, 3, 0, "div", 48);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "div", 49);
    i0.ɵɵtemplate(20, BatchDetailViewComponent_Conditional_20_Conditional_20_Template, 23, 2, "div", 50)(21, BatchDetailViewComponent_Conditional_20_Conditional_21_Template, 18, 3, "div", 50);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(22, "div", 51)(23, "div", 52)(24, "div", 4)(25, "h4", 53);
    i0.ɵɵelement(26, "i", 54);
    i0.ɵɵtext(27, " PDF PREVIEW ");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(28, BatchDetailViewComponent_Conditional_20_Conditional_28_Template, 3, 1, "select", 55);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "div", 4);
    i0.ɵɵtemplate(30, BatchDetailViewComponent_Conditional_20_Conditional_30_Template, 4, 1, "a", 56)(31, BatchDetailViewComponent_Conditional_20_Conditional_31_Template, 2, 0, "button", 57);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(32, "div", 58);
    i0.ɵɵtemplate(33, BatchDetailViewComponent_Conditional_20_Conditional_33_Template, 5, 1)(34, BatchDetailViewComponent_Conditional_20_Conditional_34_Template, 4, 1, "div", 59);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    let tmp_6_0;
    let tmp_7_0;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵconditional(ctx_r0.lockedByOthers() ? 0 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r0.mobileActiveTab() === "grid" ? "flex-1 py-2.5 text-xs font-black bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 rounded-xl shadow-xs border border-slate-200/20 dark:border-slate-700/30" : "flex-1 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300");
    i0.ɵɵadvance(4);
    i0.ɵɵclassMap(ctx_r0.mobileActiveTab() === "pdf" ? "flex-1 py-2.5 text-xs font-black bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 rounded-xl shadow-xs border border-slate-200/20 dark:border-slate-700/30" : "flex-1 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300");
    i0.ɵɵadvance(5);
    i0.ɵɵclassProp("hidden", ctx_r0.mobileActiveTab() !== "grid");
    i0.ɵɵadvance(6);
    i0.ɵɵconditional(ctx_r0.detectedPrefixes().length > 1 ? 17 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(((tmp_6_0 = ctx_r0.config()) == null ? null : tmp_6_0.formType) === "type3b" ? 18 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(((tmp_7_0 = ctx_r0.config()) == null ? null : tmp_7_0.formType) === "type3b" ? 20 : 21);
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("hidden", ctx_r0.mobileActiveTab() !== "pdf");
    i0.ɵɵadvance(6);
    i0.ɵɵconditional(ctx_r0.availableReports().length > 1 ? 28 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.currentDocsUrl() ? 30 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.currentPdfUrl() ? 31 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.currentPdfUrl() ? 33 : 34);
} }
function BatchDetailViewComponent_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    const _r24 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 16)(1, "div", 144);
    i0.ɵɵelement(2, "i", 145);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "h4", 146);
    i0.ɵɵtext(4, "Ch\u01B0a C\u00F3 K\u1EBFt Qu\u1EA3 Ph\u00E2n T\u00EDch");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 147);
    i0.ɵɵtext(6, " M\u1EBB ch\u1EA1y ");
    i0.ɵɵelementStart(7, "span", 31);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(9, " hi\u1EC7n ch\u01B0a \u0111\u01B0\u1EE3c nh\u1EADp s\u1ED1 li\u1EC7u v\u00E0 \u0111\u00E1nh gi\u00E1 QC. Nh\u1EA5n n\u00FAt b\u00EAn d\u01B0\u1EDBi \u0111\u1EC3 b\u1EAFt \u0111\u1EA7u \u0111i\u1EC1n k\u1EBFt qu\u1EA3. ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "div", 4)(11, "button", 148);
    i0.ɵɵlistener("click", function BatchDetailViewComponent_Conditional_21_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r24); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.goBack()); });
    i0.ɵɵtext(12, " Quay L\u1EA1i ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "button", 149);
    i0.ɵɵlistener("click", function BatchDetailViewComponent_Conditional_21_Template_button_click_13_listener() { i0.ɵɵrestoreView(_r24); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.goToEditMode()); });
    i0.ɵɵelement(14, "i", 150);
    i0.ɵɵtext(15, " M\u1EDF M\u00E0n H\u00ECnh Nh\u1EADp K\u1EBFt Qu\u1EA3 ");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate1("[", ((tmp_1_0 = ctx_r0.run()) == null ? null : tmp_1_0.inputs == null ? null : tmp_1_0.inputs["batchCode"]) || ((tmp_1_0 = ctx_r0.run()) == null ? null : tmp_1_0.id), "]");
} }
function BatchDetailViewComponent_Conditional_22_Template(rf, ctx) { if (rf & 1) {
    const _r25 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 17)(1, "div", 151);
    i0.ɵɵelement(2, "i", 152);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "h4", 153);
    i0.ɵɵtext(4, "Kh\u00F4ng T\u00ECm Th\u1EA5y M\u1EBB Ph\u00E2n T\u00EDch");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 154);
    i0.ɵɵtext(6, " Kh\u00F4ng t\u00ECm th\u1EA5y th\u00F4ng tin chi ti\u1EBFt ho\u1EB7c c\u1EA5u h\u00ECnh SOP t\u01B0\u01A1ng \u1EE9ng c\u1EE7a m\u1EBB ch\u1EA1y ph\u00E2n t\u00EDch n\u00E0y. ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "button", 155);
    i0.ɵɵlistener("click", function BatchDetailViewComponent_Conditional_22_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r25); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.goBack()); });
    i0.ɵɵtext(8, " Quay L\u1EA1i Danh S\u00E1ch ");
    i0.ɵɵelementEnd()();
} }
function BatchDetailViewComponent_Conditional_23_Template(rf, ctx) { if (rf & 1) {
    const _r26 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 156);
    i0.ɵɵlistener("click", function BatchDetailViewComponent_Conditional_23_Template_div_click_0_listener() { i0.ɵɵrestoreView(_r26); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.isQrModalOpen.set(false)); });
    i0.ɵɵelementStart(1, "div", 157);
    i0.ɵɵlistener("click", function BatchDetailViewComponent_Conditional_23_Template_div_click_1_listener($event) { i0.ɵɵrestoreView(_r26); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementStart(2, "div", 158)(3, "h3", 159);
    i0.ɵɵtext(4, "X\u00E1c Minh M\u1EBB Ch\u1EA1y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 160);
    i0.ɵɵtext(6, "S\u1EED d\u1EE5ng \u0111i\u1EC7n tho\u1EA1i \u0111\u1EC3 qu\u00E9t ho\u1EB7c truy c\u1EADp v\u00E0o li\u00EAn k\u1EBFt \u0111\u1ED1i chi\u1EBFu \u0111\u1ED9c l\u1EADp c\u1EE7a h\u1EC7 th\u1ED1ng LIMS.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "div", 161);
    i0.ɵɵelement(8, "canvas", 162, 0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "div", 163)(11, "button", 164);
    i0.ɵɵlistener("click", function BatchDetailViewComponent_Conditional_23_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r26); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.viewTraceability()); });
    i0.ɵɵelement(12, "i", 165);
    i0.ɵɵelementStart(13, "span");
    i0.ɵɵtext(14, "M\u1EDF Trang");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "button", 166);
    i0.ɵɵlistener("click", function BatchDetailViewComponent_Conditional_23_Template_button_click_15_listener() { i0.ɵɵrestoreView(_r26); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.copyTraceabilityLink()); });
    i0.ɵɵelement(16, "i", 167);
    i0.ɵɵelementStart(17, "span");
    i0.ɵɵtext(18, "Sao Ch\u00E9p Li\u00EAn K\u1EBFt");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(19, "button", 168);
    i0.ɵɵlistener("click", function BatchDetailViewComponent_Conditional_23_Template_button_click_19_listener() { i0.ɵɵrestoreView(_r26); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.isQrModalOpen.set(false)); });
    i0.ɵɵtext(20, " \u0110\u00F3ng ");
    i0.ɵɵelementEnd()()();
} }
export class BatchDetailViewComponent {
    constructor() {
        this.route = inject(ActivatedRoute);
        this.router = inject(Router);
        this.state = inject(StateService);
        this.resultService = inject(ResultService);
        this.printService = inject(PrintService);
        this.toast = inject(ToastService);
        this.masterTargetService = inject(MasterTargetService);
        this.auth = inject(AuthService);
        this.sanitizer = inject(DomSanitizer);
        this.googleDriveService = inject(GoogleDriveService);
        this.requestId = '';
        this.isLoading = signal(true);
        this.qrCanvas = viewChild('qrCanvas');
        this.qrModalCanvas = viewChild('qrModalCanvas');
        this.isQrModalOpen = signal(false);
        // App models signals
        this.run = signal(null);
        this.draft = signal(null);
        this.config = signal(null);
        this.configKey = signal(null);
        // Master analyte DB signals
        this.masterTargets = signal([]);
        this.columnDisplayNames = signal({});
        // Active filters and tabs
        this.activeFilter = signal('ALL');
        this.activeSampleCode = signal('');
        this.selectedPdfPrefix = signal('');
        this.activeViewTab = signal('grid');
        this.mobileActiveTab = signal('grid');
        this.showAllTargets = signal(false);
        this.inlinePdfBlobUrl = signal(null);
        this.isInlinePdfLoading = signal(false);
        this.inlinePdfError = signal(false);
        this.inlinePdfNeedsAuth = signal(false);
        this.hasInitializedReportSelection = false;
        this.inlinePdfLoadSeq = 0;
        // Detected prefixes list
        this.detectedPrefixes = computed(() => {
            const r = this.run();
            if (!r)
                return [];
            const prefixes = new Set();
            (r.sampleList || []).forEach((sample) => {
                const startsWithLetter = /^[a-zA-Z]/.test(sample);
                const prefix = startsWithLetter ? sample.charAt(0).toUpperCase() : '';
                prefixes.add(prefix);
            });
            return Array.from(prefixes).sort();
        });
        this.lockedByOthers = computed(() => {
            const r = this.run();
            const user = this.auth.currentUser();
            if (!r?.lockedBy || !user || r.lockedBy.toLowerCase() === user.email.toLowerCase())
                return false;
            if (r.lastActiveAt) {
                const lastActive = this.convertToDate(r.lastActiveAt);
                if (lastActive && (new Date().getTime() - lastActive.getTime()) > 3 * 60 * 1000) {
                    return false;
                }
            }
            return true;
        });
        // Extract compounds columns
        this.activeColumns = computed(() => {
            const conf = this.config();
            if (!conf || !conf.columns)
                return [];
            return Object.keys(conf.columns).filter((c) => c !== 'loSo' && c !== 'maSoMau' && c !== 'ghiChu' && c !== 'khoiLuong' && c !== 'heSoPhaLoang');
        });
        this.assignedCompounds = computed(() => {
            const conf = this.config();
            if (!conf?.compounds || conf.formType !== 'type3b')
                return [];
            return conf.compounds.filter((comp) => this.isTargetAssigned(this.activeSampleCode(), comp));
        });
        this.unassignedCompounds = computed(() => {
            const conf = this.config();
            if (!conf?.compounds || conf.formType !== 'type3b')
                return [];
            return conf.compounds.filter((comp) => !this.isTargetAssigned(this.activeSampleCode(), comp));
        });
        this.assignedColumns = computed(() => {
            const cols = this.activeColumns();
            if (!cols.length)
                return [];
            const realSamples = this.getType2DisplayRows().filter(row => !row.isQC);
            if (realSamples.length === 0)
                return cols;
            return cols.filter(col => realSamples.some(row => this.isTargetAssigned(row.key, col)));
        });
        this.hiddenColumns = computed(() => {
            const assigned = new Set(this.assignedColumns());
            return this.activeColumns().filter(col => !assigned.has(col));
        });
        this.visibleColumns = computed(() => {
            return this.showAllTargets() ? this.activeColumns() : this.assignedColumns();
        });
        this.inlinePdfSafeUrl = computed(() => {
            const url = this.inlinePdfBlobUrl();
            return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
        });
        // Dynamic checkbox checklist
        this.checkboxList = computed(() => {
            const conf = this.config();
            if (!conf || !conf.checkboxLines)
                return [];
            return Object.entries(conf.checkboxLines).map(([label, key]) => ({
                key: key,
                label
            }));
        });
        this._displayNameCache = new Map();
        this._assignedCache = new Map();
        this._lastTargetMapRef = null;
        this.availableReports = computed(() => {
            const reportsMap = this.collectReports();
            // Convert map to array for UI
            return Array.from(reportsMap.entries()).map(([key, value]) => {
                const prefixValue = value?.prefix || key;
                const normalizedPrefix = prefixValue === '_NO_PREFIX_' ? '' : prefixValue;
                return {
                    key: value?.id || key,
                    prefix: normalizedPrefix,
                    label: this.getReportSampleLabel(value, normalizedPrefix),
                    fileName: value.pdfFileName || value.fileName,
                    url: value.pdfViewUrl || value.pdfUrl || null,
                    docsUrl: value.docsUrl || null,
                    version: value.version || 0
                };
            }).sort((a, b) => {
                if (a.prefix !== b.prefix)
                    return a.prefix.localeCompare(b.prefix);
                return (b.version || 0) - (a.version || 0);
            });
        });
        this.currentPdfUrl = computed(() => {
            const activeFilter = this.activeFilter();
            if (!this.draft())
                return null;
            if (activeFilter !== 'ALL') {
                const report = this.findLatestReportByPrefix(activeFilter);
                return report?.pdfViewUrl || report?.pdfUrl || null;
            }
            const selectedMeta = this.findReportMetaById(this.selectedPdfPrefix());
            const selectedReport = this.findReportById(this.selectedPdfPrefix());
            let url = selectedMeta?.prefix === 'ALL'
                ? selectedReport?.pdfViewUrl || selectedReport?.pdfUrl || null
                : null;
            if (url)
                return url;
            url = this.getRootPdfUrl();
            if (url)
                return url;
            return null;
        });
        this.currentDocsUrl = computed(() => {
            const activeFilter = this.activeFilter();
            if (!this.draft())
                return null;
            if (activeFilter !== 'ALL') {
                const report = this.findLatestReportByPrefix(activeFilter);
                return report?.docsUrl ? getSafeGoogleUrl(report.docsUrl, 'doc') : null;
            }
            const selectedMeta = this.findReportMetaById(this.selectedPdfPrefix());
            const selectedReport = this.findReportById(this.selectedPdfPrefix());
            let url = selectedMeta?.prefix === 'ALL' ? selectedReport?.docsUrl || null : null;
            if (!url)
                url = this.getRootDocsUrl();
            return url ? getSafeGoogleUrl(url, 'doc') : null;
        });
        this.pdfPreviewEmptyMessage = computed(() => {
            if (this.activeFilter() === 'ALL' && this.detectedPrefixes().length > 1) {
                return 'Chưa có PDF toàn mẻ. Chọn một tiền tố để xem PDF tương ứng.';
            }
            return 'Chưa có bản xem trước PDF cho phạm vi đang chọn.';
        });
        effect(() => {
            const canvas = this.qrCanvas();
            if (canvas) {
                void this.generateQrCode();
            }
        });
        effect(() => {
            this.activeSampleCode();
            this.activeFilter();
            untracked(() => this.showAllTargets.set(false));
        });
        effect(() => {
            const pdfUrl = this.currentPdfUrl();
            untracked(() => this.startInlinePdfLoad(pdfUrl));
        });
    }
    async ngOnInit() {
        this.requestId = this.route.snapshot.paramMap.get('id') || '';
        if (!this.requestId) {
            this.toast.show('Không tìm thấy ID mẻ chạy!', 'error');
            this.router.navigate(['/results-view']);
            return;
        }
        const initialPrefix = this.route.snapshot.queryParamMap.get('prefix');
        if (initialPrefix !== null) {
            this.activeFilter.set(initialPrefix);
        }
        // Load master Targets/Analytes
        try {
            const analytes = await this.masterTargetService.getAll();
            this.masterTargets.set(analytes);
        }
        catch (e) {
            console.warn('Failed to load master analytes in Viewer', e);
        }
        this.isLoading.set(true);
        // Subscribe to Firebase real-time updates
        this.unsubscribeFromDraft = this.resultService.subscribeToDraft(this.requestId, async (draftDoc, runDoc) => {
            if (runDoc) {
                this.run.set(runDoc);
                // Auto-select first sample for 3B accordion
                if (runDoc.sampleList && runDoc.sampleList.length > 0 && !this.activeSampleCode()) {
                    this.activeSampleCode.set(runDoc.sampleList[0]);
                }
                const sopObj = this.state.sops().find((s) => s.id === runDoc.sopId) || null;
                const resolvedKey = resolveConfigKey(runDoc.sopId, runDoc.sopName || '', sopObj);
                const sopConf = resolvedKey ? ANGULAR_SOP_CONFIG[resolvedKey] : null;
                if (sopConf && resolvedKey) {
                    this.config.set({ ...sopConf, id: resolvedKey });
                    this.configKey.set(resolvedKey);
                    this.draft.set(draftDoc);
                    this.ensureSelectedReport();
                    // Build custom columns labels map
                    this.buildColumnDisplayNames();
                }
            }
            this.isLoading.set(false);
        });
    }
    ngOnDestroy() {
        if (this.unsubscribeFromDraft) {
            this.unsubscribeFromDraft();
        }
        this.cleanupInlinePdf();
    }
    buildColumnDisplayNames() {
        const conf = this.config();
        if (!conf || !conf.columns)
            return;
        const map = {};
        // Filter active column names
        const cols = Object.keys(conf.columns).filter((c) => c !== 'loSo' && c !== 'maSoMau' && c !== 'ghiChu' && c !== 'khoiLuong' && c !== 'heSoPhaLoang');
        cols.forEach(col => {
            // Custom labels based on config mapping
            if (col === 'kqTrifluralin')
                map[col] = 'Trifluralin';
            else if (col === 'kqFip')
                map[col] = 'Fipronil';
            else if (col === 'kqFipDesl')
                map[col] = 'Fipronil-desulfinyl';
            else if (col === 'kqFipSulf')
                map[col] = 'Fipronil sulfide';
            else if (col === 'kqFipSulf2')
                map[col] = 'Fipronil sulfone';
            else if (col === 'kqClp')
                map[col] = 'Chlorpyrifos';
            else if (col === 'kqClpMe')
                map[col] = 'Chlorpyrifos methyl';
            else if (col === 'kqClpMeDes')
                map[col] = 'Chlorpyriphos-methyl-desmethyl';
            else if (col === 'kqDichlorvos')
                map[col] = 'Dichlorvos';
            else {
                // Fallback display format clean
                let name = col.replace(/^kq/, '');
                name = name.replace(/([A-Z])/g, ' $1').trim();
                map[col] = name.charAt(0).toUpperCase() + name.slice(1);
            }
            // Translate display name through master Analytes DB
            map[col] = resolveCompoundDisplayName(map[col], this.masterTargets(), this.configKey() || this.run()?.sopId) + ' (µg/kg)';
        });
        this.columnDisplayNames.set(map);
    }
    getCompoundDisplayName(compound) {
        if (this._displayNameCache.has(compound)) {
            return this._displayNameCache.get(compound);
        }
        const name = resolveCompoundDisplayName(compound, this.masterTargets(), this.configKey() || this.run()?.sopId);
        this._displayNameCache.set(compound, name);
        return name;
    }
    isTargetAssigned(sampleCode, compound) {
        if (!this.run())
            return true;
        const targetMap = this.run().sampleTargetMap || (this.run().inputs && this.run().inputs.sampleTargetMap);
        if (!targetMap)
            return true;
        if (this._lastTargetMapRef !== targetMap) {
            this._assignedCache.clear();
            this._lastTargetMapRef = targetMap;
        }
        const cacheKey = `${sampleCode}_${compound}`;
        if (this._assignedCache.has(cacheKey)) {
            return this._assignedCache.get(cacheKey);
        }
        const assigned = targetMap[sampleCode];
        if (!assigned || assigned.length === 0) {
            this._assignedCache.set(cacheKey, true);
            return true;
        }
        const result = isCompoundAssigned(assigned, compound, this.masterTargets());
        this._assignedCache.set(cacheKey, result);
        return result;
    }
    getRowDataValue(rowKey, field) {
        const d = this.draft();
        if (!d || !d.resultData)
            return '';
        const resObj = d.resultData[rowKey];
        if (resObj && resObj[field] !== undefined && resObj[field] !== null && resObj[field] !== '') {
            return String(resObj[field]);
        }
        // Fallback logic for prefix-specific final keys (e.g. QC_FINAL_QC_A) to main final key
        if (rowKey.startsWith('QC_FINAL_QC_')) {
            const mainFinal = d.resultData['QC_FINAL_QC_'];
            if (mainFinal && mainFinal[field] !== undefined && mainFinal[field] !== null && mainFinal[field] !== '') {
                return String(mainFinal[field]);
            }
        }
        return '';
    }
    hasColumn(colKey) {
        const conf = this.config();
        return !!(conf && conf.columns && conf.columns[colKey] !== undefined);
    }
    hasCalibPoints() {
        const d = this.draft();
        return !!(d && d.page1Data && d.page1Data['calibPoints'] && d.page1Data['calibPoints'].length > 0);
    }
    isQcField(key) {
        return key.startsWith('qc');
    }
    collectReports() {
        const d = this.draft();
        const r = this.run();
        const reportsMap = new Map();
        // Load reports from draft first
        if (d?.reports) {
            Object.entries(d.reports).forEach(([key, value]) => {
                const reportId = value?.id || key;
                reportsMap.set(reportId, { ...value, id: reportId });
            });
        }
        // Merge reports from run to get the latest published PDFs
        if (r) {
            const runReports = r.analysisResultSummary?.reports || r.analysisResult?.reports;
            if (runReports) {
                Object.entries(runReports).forEach(([key, value]) => {
                    const reportId = value?.id || key;
                    if (!reportsMap.has(reportId)) {
                        reportsMap.set(reportId, { ...value, id: reportId });
                    }
                    else {
                        const existing = reportsMap.get(reportId);
                        reportsMap.set(reportId, {
                            ...existing,
                            id: existing.id || reportId,
                            pdfViewUrl: existing.pdfViewUrl || value.pdfViewUrl,
                            pdfUrl: existing.pdfUrl || value.pdfUrl,
                            docsUrl: existing.docsUrl || value.docsUrl
                        });
                    }
                });
            }
        }
        return reportsMap;
    }
    getReportSampleLabel(report, prefix) {
        const samples = this.getReportSamples(report, prefix);
        return samples.length > 0 ? formatSampleList(samples) : 'Chưa rõ mẫu';
    }
    getReportSamples(report, prefix) {
        if (Array.isArray(report?.includedSamples) && report.includedSamples.length > 0) {
            return [...report.includedSamples].sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
        }
        if (report?.samples && typeof report.samples === 'object') {
            const samples = Object.keys(report.samples).filter(sample => report.samples[sample]?.included !== false);
            if (samples.length > 0) {
                return samples.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
            }
        }
        const r = this.run();
        const sampleList = r?.sampleList || [];
        if (prefix === 'ALL')
            return [...sampleList];
        return sampleList.filter((sample) => {
            const startsWithLetter = /^[a-zA-Z]/.test(sample);
            const samplePrefix = startsWithLetter ? sample.charAt(0).toUpperCase() : '';
            return samplePrefix === prefix;
        });
    }
    changeActiveFilter(prefix) {
        this.activeFilter.set(prefix);
        this.showAllTargets.set(false);
        if (prefix === 'ALL') {
            const overallReport = this.findOverallReportMeta();
            this.selectedPdfPrefix.set(overallReport?.key || '');
            this.hasInitializedReportSelection = true;
            return;
        }
        const matchingReport = this.findLatestReportMetaByPrefix(prefix);
        this.selectedPdfPrefix.set(matchingReport?.key || '');
        this.hasInitializedReportSelection = true;
    }
    selectReport(reportId) {
        this.selectedPdfPrefix.set(reportId);
        this.hasInitializedReportSelection = true;
        const selectedReport = this.findReportMetaById(reportId);
        if (selectedReport && selectedReport.prefix !== this.activeFilter()) {
            this.activeFilter.set(selectedReport.prefix);
            this.showAllTargets.set(false);
        }
    }
    ensureSelectedReport() {
        const available = this.availableReports();
        if (available.length === 0) {
            if (this.activeFilter() === 'ALL' && this.getRootPdfUrl()) {
                this.selectedPdfPrefix.set('');
                this.hasInitializedReportSelection = true;
            }
            return;
        }
        const selected = this.selectedPdfPrefix();
        const activeFilter = this.activeFilter();
        const selectedMeta = selected ? this.findReportMetaById(selected) : null;
        const selectionMatchesFilter = selectedMeta
            ? selectedMeta.prefix === activeFilter
            : activeFilter === 'ALL' && !!this.getRootPdfUrl();
        if (this.hasInitializedReportSelection && selectionMatchesFilter)
            return;
        if (activeFilter !== 'ALL') {
            const preferred = this.findLatestReportMetaByPrefix(activeFilter);
            this.selectedPdfPrefix.set(preferred?.key || '');
            this.hasInitializedReportSelection = true;
            return;
        }
        const overallReport = this.findOverallReportMeta();
        if (overallReport || this.getRootPdfUrl()) {
            this.selectedPdfPrefix.set(overallReport?.key || '');
            this.hasInitializedReportSelection = true;
            return;
        }
        const firstPrefixReport = available.find(report => report.prefix !== 'ALL');
        if (firstPrefixReport) {
            this.activeFilter.set(firstPrefixReport.prefix);
            this.selectedPdfPrefix.set(firstPrefixReport.key);
            this.hasInitializedReportSelection = true;
            return;
        }
        this.selectedPdfPrefix.set('');
        this.hasInitializedReportSelection = true;
    }
    findReportMetaById(reportId) {
        if (!reportId)
            return null;
        return this.availableReports().find(report => report.key === reportId) || null;
    }
    findReportById(reportId) {
        if (!reportId)
            return null;
        return this.collectReports().get(reportId) || null;
    }
    findLatestReportMetaByPrefix(prefix) {
        return this.availableReports()
            .filter(report => report.prefix === prefix)
            .sort((a, b) => (b.version || 0) - (a.version || 0))[0] || null;
    }
    findLatestReportByPrefix(prefix) {
        const selected = this.findReportMetaById(this.selectedPdfPrefix());
        const reportMeta = selected?.prefix === prefix ? selected : this.findLatestReportMetaByPrefix(prefix);
        return reportMeta ? this.findReportById(reportMeta.key) : null;
    }
    findOverallReportMeta() {
        return this.findLatestReportMetaByPrefix('ALL');
    }
    getRootPdfUrl() {
        const d = this.draft();
        const r = this.run();
        if (!d)
            return null;
        return d.pdfViewUrl || d.pdfUrl
            || r?.analysisResultSummary?.pdfViewUrl || r?.analysisResultSummary?.pdfUrl
            || r?.analysisResult?.pdfViewUrl || r?.analysisResult?.pdfUrl
            || null;
    }
    getRootDocsUrl() {
        const d = this.draft();
        const r = this.run();
        if (!d)
            return null;
        return d.docsUrl
            || r?.analysisResultSummary?.docsUrl
            || r?.analysisResult?.docsUrl
            || null;
    }
    getType2DisplayRows() {
        const d = this.draft();
        const r = this.run();
        const conf = this.config();
        if (!d || !r || !conf)
            return [];
        const activeFilter = this.activeFilter();
        const isTrifluralin = conf.id === 'trifluralin-gcms';
        const isFipronil = conf.id === 'fipronil-chlorpyrifos';
        const isDichlorvos = conf.id === 'dichlorvos-gcms';
        const isChloroform = conf.id === 'chloroform-gcms';
        const list = [];
        if (isFipronil) {
            // BLANK (vial 1.7)
            const blankName = d.page1Data?.['blankName'] || 'BLANK';
            list.push({ key: 'QC_BLANK', label: blankName, isQC: true });
            // SPIKE (vial 1.8)
            const spikeName = d.page1Data?.['spikeName'] || 'SPIKE';
            list.push({ key: 'QC_SPIKE', label: spikeName, isQC: true });
            // CHECK_SAMPLE (vial 1.9, optional)
            if (d.page1Data?.['hasCheckSample']) {
                const checkSampleName = d.page1Data?.['checkSampleName'] || 'CHECK_SAMPLE';
                list.push({ key: 'QC_CHECK_SAMPLE', label: checkSampleName, isQC: true });
            }
            // Regular samples & dynamic SP_N every 10 samples
            const sampleList = r.sampleList || [];
            let regularCount = 0;
            sampleList.forEach((sampleCode) => {
                list.push({ key: sampleCode, label: sampleCode, isQC: false });
                regularCount++;
                if (regularCount % 10 === 0) {
                    const isLastSample = regularCount === sampleList.length;
                    if (!isLastSample) {
                        const n = regularCount / 10;
                        list.push({
                            key: `QC_SPIKE_${n}`,
                            label: `SP_${n}`,
                            isQC: true
                        });
                    }
                }
            });
            // FINAL (vial 1.8)
            list.push({ key: 'QC_FINAL', label: 'FINAL', isQC: true });
        }
        else if (isDichlorvos) {
            // Blank
            const blankName = d.page1Data?.['blankName'] || 'Blank';
            list.push({ key: 'QC_BLANK', label: blankName, isQC: true });
            // Spike
            const spikeName = d.page1Data?.['spikeName'] || 'Spike';
            list.push({ key: 'QC_SPIKE', label: spikeName, isQC: true });
            // Regular samples (filtered by activeFilter)
            const sampleList = r.sampleList || [];
            const filteredSamples = sampleList.filter((s) => {
                const startsWithLetter = /^[a-zA-Z]/.test(s);
                const prefix = startsWithLetter ? s.charAt(0).toUpperCase() : '';
                return activeFilter === 'ALL' || prefix === activeFilter;
            });
            filteredSamples.forEach((sampleCode) => {
                list.push({ key: sampleCode, label: sampleCode, isQC: false });
            });
            // FINAL (optional)
            if (d.page1Data?.['hasFinal']) {
                list.push({ key: 'QC_FINAL', label: 'FINAL', isQC: true });
            }
        }
        else if (isChloroform) {
            // Blank
            const blankName = d.page1Data?.['blankName'] || 'Blank';
            list.push({ key: 'QC_BLANK', label: blankName, isQC: true });
            // Spike
            const spikeName = d.page1Data?.['spikeName'] || 'Spike';
            list.push({ key: 'QC_SPIKE', label: spikeName, isQC: true });
            // Regular samples (filtered by activeFilter)
            const sampleList = r.sampleList || [];
            const filteredSamples = sampleList.filter((s) => {
                const startsWithLetter = /^[a-zA-Z]/.test(s);
                const prefix = startsWithLetter ? s.charAt(0).toUpperCase() : '';
                return activeFilter === 'ALL' || prefix === activeFilter;
            });
            filteredSamples.forEach((sampleCode) => {
                list.push({ key: sampleCode, label: sampleCode, isQC: false });
            });
            // FINAL (optional)
            if (d.page1Data?.['hasFinal']) {
                list.push({ key: 'QC_FINAL', label: 'FINAL', isQC: true });
            }
        }
        else if (isTrifluralin) {
            const blankName = d.page1Data?.['blankName'] || 'Blank';
            const spikeName = d.page1Data?.['spikeName'] || 'Spike';
            const prefixes = activeFilter === 'ALL' ? (this.detectedPrefixes() || ['']) : [activeFilter];
            prefixes.forEach((prefix) => {
                const prefixSamples = (r.sampleList || []).filter((s) => {
                    const startsWithLetter = /^[a-zA-Z]/.test(s);
                    const p = startsWithLetter ? s.charAt(0).toUpperCase() : '';
                    return p === prefix;
                });
                if (prefixSamples.length === 0)
                    return;
                const labelPrefix = prefix ? ` (Tiền tố ${prefix})` : '';
                list.push({
                    key: 'QC_BLANK',
                    label: `${blankName}${labelPrefix}`,
                    isQC: true
                });
                list.push({
                    key: 'QC_SPIKE',
                    label: `${spikeName}${labelPrefix}`,
                    isQC: true
                });
                let selectedCount = 0;
                prefixSamples.forEach((sampleCode) => {
                    const resObj = d.resultData[sampleCode] || {};
                    const isSelected = resObj['selected'] !== false;
                    list.push({
                        key: sampleCode,
                        label: sampleCode,
                        isQC: false
                    });
                    if (isSelected) {
                        selectedCount++;
                        if (selectedCount % 10 === 0) {
                            const totalSelected = prefixSamples.filter((s) => d.resultData[s]?.['selected'] !== false).length;
                            const isLastSelected = selectedCount === totalSelected;
                            if (!isLastSelected) {
                                const n = selectedCount / 10;
                                list.push({
                                    key: `QC_SPIKE_${n}_QC_${prefix}`,
                                    label: `SPIKE_${n}${labelPrefix}`,
                                    isQC: true
                                });
                            }
                        }
                    }
                });
                if (selectedCount > 0) {
                    const finalKey = `QC_FINAL_QC_${prefix}`;
                    list.push({
                        key: finalKey,
                        label: `FINAL${labelPrefix}`,
                        isQC: true
                    });
                }
            });
        }
        else {
            // General fallback for default Type 2 SOPs: list all regular samples
            const sampleList = r.sampleList || [];
            const filteredSamples = sampleList.filter((s) => {
                const startsWithLetter = /^[a-zA-Z]/.test(s);
                const prefix = startsWithLetter ? s.charAt(0).toUpperCase() : '';
                return activeFilter === 'ALL' || prefix === activeFilter;
            });
            filteredSamples.forEach((sampleCode) => {
                list.push({ key: sampleCode, label: sampleCode, isQC: false });
            });
        }
        return list;
    }
    getCurrentPdfUrl() {
        return this.currentPdfUrl();
    }
    getCurrentDocsUrl() {
        return this.currentDocsUrl();
    }
    startInlinePdfLoad(pdfUrl) {
        const seq = ++this.inlinePdfLoadSeq;
        this.cleanupInlinePdf();
        if (!pdfUrl) {
            this.isInlinePdfLoading.set(false);
            return;
        }
        void this.loadPdfBlob(pdfUrl, seq);
    }
    async loadPdfBlob(pdfUrl, seq) {
        const fileId = this.extractFileId(pdfUrl);
        if (!fileId) {
            if (seq === this.inlinePdfLoadSeq) {
                this.inlinePdfBlobUrl.set(pdfUrl);
            }
            return;
        }
        this.isInlinePdfLoading.set(true);
        this.inlinePdfError.set(false);
        this.inlinePdfNeedsAuth.set(false);
        try {
            const rawBlob = await this.googleDriveService.downloadFile(fileId);
            const blob = new Blob([rawBlob], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);
            if (seq === this.inlinePdfLoadSeq && this.currentPdfUrl() === pdfUrl) {
                this.inlinePdfBlobUrl.set(blobUrl);
            }
            else {
                URL.revokeObjectURL(blobUrl);
            }
        }
        catch (err) {
            if (seq !== this.inlinePdfLoadSeq)
                return;
            if (err?.code === 'oauth_required') {
                this.inlinePdfNeedsAuth.set(true);
            }
            else {
                console.error('[InlinePDF] Failed to load PDF blob:', err);
                this.inlinePdfError.set(true);
            }
        }
        finally {
            if (seq === this.inlinePdfLoadSeq) {
                this.isInlinePdfLoading.set(false);
            }
        }
    }
    extractFileId(url) {
        const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (fileDMatch?.[1])
            return fileDMatch[1];
        const genericDMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (genericDMatch?.[1])
            return genericDMatch[1];
        try {
            const urlObj = new URL(url);
            return urlObj.searchParams.get('id');
        }
        catch {
            const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
            return idMatch?.[1] || null;
        }
    }
    cleanupInlinePdf() {
        const current = this.inlinePdfBlobUrl();
        if (current?.startsWith('blob:')) {
            URL.revokeObjectURL(current);
        }
        this.inlinePdfBlobUrl.set(null);
        this.inlinePdfError.set(false);
        this.inlinePdfNeedsAuth.set(false);
    }
    beginInlinePdfAuth() {
        this.googleDriveService.beginRedirectAuth();
    }
    openPdfInModal(url) {
        const activeFilter = this.activeFilter();
        const filterName = activeFilter === 'ALL' ? 'Tất cả mẫu' : (activeFilter === '' ? 'Không tiền tố' : `Nhóm ${activeFilter}`);
        const previewUrl = this.getGoogleDrivePreviewUrl(url);
        this.printService.openPdfPreview(previewUrl, `Báo cáo kết quả — ${this.run()?.sopName || ''} (${filterName})`, this.draft()?.version || 1, this.draft()?.updatedBy || 'Chưa rõ', this.draft()?.updatedAt);
    }
    getStatusText() {
        const status = this.draft()?.status || 'pending';
        if (status === 'completed')
            return 'Đã duyệt';
        if (status === 'draft')
            return 'Đang nháp';
        return 'Chờ nhập';
    }
    getStatusClass() {
        const status = this.draft()?.status || 'pending';
        if (status === 'completed') {
            return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/40 dark:border-emerald-900/30';
        }
        if (status === 'draft') {
            return 'bg-indigo-50 dark:bg-indigo-955/20 text-indigo-700 dark:text-indigo-400 border-indigo-200/40 dark:border-indigo-900/30';
        }
        return 'bg-amber-50 dark:bg-amber-955/20 text-amber-700 dark:text-amber-400 border-amber-200/40 dark:border-amber-900/30';
    }
    convertToDate(timestamp) {
        return timestampToDate(timestamp);
    }
    async takeOverLock() {
        const user = this.auth.currentUser();
        const run = this.run();
        if (!user || !run)
            return;
        const confirmed = confirm(`Bạn có chắc chắn muốn giành quyền chỉnh sửa mẻ này?\nThao tác này sẽ chuyển sang màn hình Nhập kết quả. Thao tác này sẽ chuyển màn hình của ${run.lockedByName || 'người khác'} về chế độ Chỉ xem.`);
        if (confirmed) {
            this.isLoading.set(true);
            await this.resultService.acquireLock(this.requestId, user.email, user.displayName);
            this.isLoading.set(false);
            this.toast.show('Bạn đã giành quyền chỉnh sửa mẻ này thành công!', 'success');
            this.goToEditMode();
        }
    }
    goToEditMode() {
        this.router.navigate(['/results', this.requestId], {
            queryParams: this.activeFilter() !== 'ALL'
                ? { prefix: this.activeFilter(), edit: '1' }
                : { edit: '1' }
        });
    }
    goBack() {
        this.router.navigate(['/results']);
    }
    viewTraceability() {
        this.router.navigate(['/traceability', this.requestId]);
    }
    copyTraceabilityLink() {
        const baseUrl = window.location.origin + window.location.pathname + '#/traceability/';
        const link = baseUrl + this.requestId;
        navigator.clipboard.writeText(link).then(() => {
            this.toast.show('Đã sao chép liên kết truy xuất nguồn gốc!', 'success');
        }).catch(err => {
            this.toast.show('Không thể sao chép liên kết: ' + err, 'error');
        });
    }
    async generateQrCode() {
        if (!this.qrCanvas())
            return;
        let QRious;
        try {
            QRious = await ensureQrious();
        }
        catch (e) {
            console.warn('QR library load error:', e);
            return;
        }
        if (!QRious || !this.qrCanvas())
            return;
        const baseUrl = window.location.origin + window.location.pathname + '#/traceability/';
        new QRious({
            element: this.qrCanvas().nativeElement,
            value: baseUrl + this.requestId,
            size: 160,
            level: 'M'
        });
    }
    openQrModal() {
        this.isQrModalOpen.set(true);
        setTimeout(async () => {
            let QRious;
            try {
                QRious = await ensureQrious();
            }
            catch (e) {
                console.warn('QR library load error:', e);
                return;
            }
            if (QRious && this.qrModalCanvas()) {
                const baseUrl = window.location.origin + window.location.pathname + '#/traceability/';
                new QRious({
                    element: this.qrModalCanvas().nativeElement,
                    value: baseUrl + this.requestId,
                    size: 240,
                    level: 'M'
                });
            }
        }, 50);
    }
    getGoogleDrivePreviewUrl(url) {
        if (!url)
            return '';
        const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (fileDMatch && fileDMatch[1]) {
            return `https://drive.google.com/file/d/${fileDMatch[1]}/preview`;
        }
        const docDMatch = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
        if (docDMatch && docDMatch[1]) {
            return `https://docs.google.com/document/d/${docDMatch[1]}/preview`;
        }
        try {
            const urlObj = new URL(url);
            const id = urlObj.searchParams.get('id');
            if (id) {
                return `https://drive.google.com/file/d/${id}/preview`;
            }
        }
        catch (e) {
            const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
            if (idMatch && idMatch[1]) {
                return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
            }
        }
        return url;
    }
    static { this.ɵfac = function BatchDetailViewComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || BatchDetailViewComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: BatchDetailViewComponent, selectors: [["app-batch-detail-view"]], viewQuery: function BatchDetailViewComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuerySignal(ctx.qrCanvas, _c0, 5);
            i0.ɵɵviewQuerySignal(ctx.qrModalCanvas, _c1, 5);
        } if (rf & 2) {
            i0.ɵɵqueryAdvance(2);
        } }, decls: 24, vars: 7, consts: [["qrModalCanvas", ""], [1, "h-full", "flex", "flex-col", "animate-fade-in", "bg-slate-50/60", "dark:bg-slate-900", "p-4", "lg:p-6", "space-y-4", "lg:space-y-5"], [1, "flex", "flex-col", "gap-4", "shrink-0", "bg-white", "dark:bg-slate-800", "p-4", "rounded-2xl", "border", "border-slate-100", "dark:border-slate-700", "shadow-sm"], [1, "flex", "flex-col", "lg:flex-row", "lg:items-center", "justify-between", "gap-4"], [1, "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-xl", "bg-slate-50", "dark:bg-slate-900", "text-slate-500", "hover:text-indigo-600", "dark:text-slate-400", "dark:hover:text-indigo-400", "flex", "items-center", "justify-center", "border", "border-slate-200", "dark:border-slate-700", "shadow-sm", "active:scale-95", "group", "shrink-0", 3, "click"], [1, "fa-solid", "fa-arrow-left", "group-hover:-translate-x-0.5", "transition-transform", "text-base"], [1, "flex", "items-center", "gap-1.5", "text-[10px]", "font-bold", "text-slate-450", "dark:text-slate-500", "uppercase", "tracking-wider", "mb-0.5"], [1, "fa-solid", "fa-chevron-right", "text-[8px]", "text-slate-300", "dark:text-slate-650"], [1, "text-indigo-650", "dark:text-indigo-400"], [1, "text-xl", "font-black", "text-slate-855", "dark:text-slate-100", "flex", "flex-wrap", "items-center", "gap-2", "m-0", "tracking-tight"], [1, "inline-flex", "items-center", "gap-1.5", "px-2.5", "py-0.5", "rounded-full", "text-[9px]", "font-extrabold", "uppercase", "tracking-wide", "border", "shadow-xs", 3, "class"], ["title", "M\u1EBB ch\u1EA1y n\u00E0y \u0111\u00E3 \u0111\u01B0\u1EE3c g\u1ED9p s\u1ED1 li\u1EC7u. Nh\u1EA5n \u0111\u1EC3 \u0111i t\u1EDBi m\u1EBB t\u1ED5ng h\u1EE3p.", 1, "px-2", "py-0.5", "rounded-full", "bg-fuchsia-50", "dark:bg-fuchsia-955/20", "border", "border-fuchsia-200", "dark:border-fuchsia-900/40", "text-fuchsia-600", "dark:text-fuchsia-400", "text-[9px]", "font-extrabold", "uppercase", "hover:bg-fuchsia-100", "dark:hover:bg-fuchsia-900/30", "transition-colors", "flex", "items-center", "gap-1", "cursor-pointer", "shadow-xs", 3, "routerLink"], [1, "flex", "items-center", "gap-2", "shrink-0"], [1, "pt-3.5", "border-t", "border-slate-100", "dark:border-slate-800/80", "flex", "flex-wrap", "items-center", "gap-y-2", "gap-x-4", "text-xs", "font-semibold", "text-slate-500", "dark:text-slate-400"], [1, "flex-1", "flex", "items-center", "justify-center", "bg-white", "dark:bg-slate-900", "rounded-3xl", "border", "border-slate-200/60", "dark:border-slate-800/80", "p-12"], [1, "flex-1", "flex", "flex-col", "items-center", "justify-center", "bg-white", "dark:bg-slate-900", "rounded-3xl", "border", "border-slate-200", "dark:border-slate-800", "border-dashed", "p-12", "animate-fade-in", "shadow-sm"], [1, "flex-1", "flex", "flex-col", "items-center", "justify-center", "bg-white", "dark:bg-slate-900", "rounded-3xl", "border", "border-slate-200", "dark:border-slate-800", "border-dashed", "p-12"], [1, "fixed", "inset-0", "z-[100]", "flex", "items-center", "justify-center", "fade-in", "backdrop-blur-md", "bg-slate-900/60"], [1, "inline-flex", "items-center", "gap-1.5", "px-2.5", "py-0.5", "rounded-full", "text-[9px]", "font-extrabold", "uppercase", "tracking-wide", "border", "shadow-xs"], [1, "w-1.5", "h-1.5", "rounded-full", 3, "ngClass"], [1, "fa-solid", "fa-link", "text-[8px]", "animate-pulse"], [1, "px-3.5", "py-2", "text-xs", "font-bold", "text-slate-700", "hover:text-slate-900", "dark:text-slate-300", "dark:hover:text-white", "bg-slate-50", "hover:bg-slate-100", "dark:bg-slate-800", "dark:hover:bg-slate-700", "border", "border-slate-200/60", "dark:border-slate-700", "rounded-xl", "transition", "duration-200", "active:scale-95", "flex", "items-center", "gap-2", 3, "click"], [1, "fa-solid", "fa-qrcode", "text-indigo-500"], [3, "click", "title"], [1, "fa-solid"], [1, "flex", "items-center", "gap-1.5"], [1, "fa-solid", "fa-barcode", "text-slate-400", "dark:text-slate-600", "text-[11px]"], [1, "font-mono", "font-bold", "text-slate-700", "dark:text-slate-300", "select-all"], [1, "text-slate-300", "dark:text-slate-700", "select-none"], [1, "fa-solid", "fa-user-astronaut", "text-slate-400", "dark:text-slate-600", "text-[11px]"], [1, "font-bold", "text-slate-700", "dark:text-slate-300"], [1, "fa-regular", "fa-calendar", "text-slate-400", "dark:text-slate-600", "text-[11px]"], [1, "text-center", "space-y-4"], [1, "fa-solid", "fa-circle-notch", "fa-spin", "text-3xl", "text-indigo-600", "dark:text-indigo-400"], [1, "text-xs", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-widest"], [1, "bg-amber-50/50", "dark:bg-amber-955/20", "border", "border-amber-200/40", "dark:border-amber-900/30", "rounded-2xl", "p-4", "flex", "flex-col", "sm:flex-row", "sm:items-center", "justify-between", "gap-4", "animate-in", "fade-in", "slide-in-from-top-4", "duration-300", "shrink-0"], [1, "lg:hidden", "flex", "bg-slate-100", "dark:bg-slate-950", "p-1", "rounded-2xl", "border", "border-slate-200/60", "dark:border-slate-800/80", "shrink-0", "mb-1"], [1, "transition-all", "duration-200", "flex", "items-center", "justify-center", "gap-2", 3, "click"], [1, "fa-solid", "fa-table-cells", "text-sm"], [1, "fa-solid", "fa-file-pdf", "text-sm", "text-red-500"], [1, "flex-1", "min-h-0", "flex", "flex-col", "lg:flex-row", "gap-5", "overflow-hidden", "lg:h-[calc(100vh-220px)]", "lg:min-h-[600px]"], [1, "lg:!flex", "lg:flex-[6]", "flex", "flex-col", "min-h-0", "bg-white", "dark:bg-slate-900", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-3xl", "shadow-sm", "overflow-hidden"], [1, "px-5", "py-3.5", "flex", "flex-col", "sm:flex-row", "sm:items-center", "justify-between", "gap-3", "border-b", "border-slate-100", "dark:border-slate-800", "bg-slate-50/30", "dark:bg-slate-800/30", "shrink-0"], [1, "flex", "items-center", "gap-3", "min-w-0"], [1, "text-sm", "font-bold", "text-slate-800", "dark:text-slate-200", "uppercase", "tracking-wider", "flex", "items-center", "m-0", "shrink-0"], [1, "fa-solid", "fa-table-cells", "mr-2.5", "text-indigo-500"], [1, "flex", "items-center", "bg-slate-100", "dark:bg-slate-950", "p-0.5", "rounded-lg", "border", "border-slate-200/60", "dark:border-slate-800/80", "ml-2", "overflow-x-auto", "max-w-[200px]", "sm:max-w-none", "custom-scrollbar", "shrink-0"], [1, "flex", "items-center", "gap-1.5", "overflow-x-auto", "max-w-full", "sm:max-w-[60%]", "custom-scrollbar", "pb-1", "sm:pb-0"], [1, "flex-1", "overflow-y-auto", "custom-scrollbar", "p-1"], [1, "overflow-x-auto", "custom-scrollbar"], [1, "lg:!flex", "lg:flex-[4]", "flex", "flex-col", "min-h-[300px]", "lg:min-h-[600px]", "bg-white", "dark:bg-slate-900", "border", "border-slate-200/80", "dark:border-slate-800", "rounded-3xl", "shadow-sm", "overflow-hidden", "relative"], [1, "px-5", "py-4", "flex", "items-center", "justify-between", "border-b", "border-slate-100", "dark:border-slate-800", "bg-slate-50/30", "dark:bg-slate-800/30", "shrink-0", "relative", "z-10"], [1, "text-sm", "font-bold", "text-slate-800", "dark:text-slate-200", "uppercase", "tracking-wider", "flex", "items-center", "m-0"], [1, "fa-solid", "fa-file-pdf", "mr-2.5", "text-red-500"], [1, "bg-white", "dark:bg-slate-850", "text-slate-700", "dark:text-slate-200", "border", "border-slate-200", "dark:border-slate-750", "rounded-lg", "px-2", "py-1", "text-[11px]", "font-bold", "outline-none", "focus:ring-1", "focus:ring-indigo-500", "shadow-sm", 3, "ngModel"], ["target", "_blank", "rel", "noopener noreferrer", "title", "M\u1EDF Google Docs g\u1ED1c \u0111\u1EC3 xem/ch\u1EC9nh s\u1EEDa \u1EDF c\u1EEDa s\u1ED5 m\u1EDBi", 1, "px-2.5", "py-1", "text-[10px]", "font-bold", "text-slate-650", "hover:text-indigo-600", "dark:text-slate-300", "dark:hover:text-indigo-400", "bg-slate-50", "hover:bg-slate-100", "dark:bg-slate-800", "dark:hover:bg-slate-750", "rounded-lg", "border", "border-slate-200/60", "dark:border-slate-700/80", "transition", "flex", "items-center", "gap-1.5", "no-underline", "shadow-xs", "cursor-pointer", 3, "href"], ["title", "M\u1EDF PDF to\u00E0n m\u00E0n h\u00ECnh (Modal h\u1EC7 th\u1ED1ng)", 1, "p-2", "-mr-2", "text-slate-400", "hover:text-indigo-600", "dark:hover:text-indigo-400", "transition", "active:scale-90"], [1, "flex-1", "bg-slate-100/50", "dark:bg-slate-950/50", "flex", "flex-col", "relative"], [1, "flex-1", "flex", "flex-col", "items-center", "justify-center", "text-slate-400", "dark:text-slate-600", "p-8", "text-center", "space-y-3", "relative", "z-10"], [1, "flex", "items-start", "gap-3.5"], [1, "w-9", "h-9", "rounded-xl", "bg-amber-100", "dark:bg-amber-900/40", "text-amber-600", "dark:text-amber-400", "flex", "items-center", "justify-center", "border", "border-amber-200/20", "shrink-0"], [1, "fa-solid", "fa-lock", "text-sm", "animate-pulse"], [1, "text-xs", "font-black", "uppercase", "tracking-wider", "text-amber-800", "dark:text-amber-400"], [1, "text-[11px]", "text-amber-650", "dark:text-amber-300", "font-semibold", "mt-0.5"], [1, "px-4", "py-2", "bg-amber-600", "hover:bg-amber-700", "text-white", "text-xs", "font-black", "rounded-xl", "transition", "flex", "items-center", "gap-2", "shrink-0", "active:scale-95", "shadow-md", "shadow-amber-500/10", "cursor-pointer", 3, "click"], [1, "fa-solid", "fa-unlock-keyhole"], [1, "transition", "duration-150", "shrink-0", 3, "click"], [1, "transition", "duration-150", "shrink-0", 3, "class"], [1, "px-2.5", "py-1.5", "rounded-lg", "text-[11px]", "flex", "items-center", "gap-1.5", "shrink-0", "transition-all", "duration-200", 3, "class"], [1, "px-2.5", "py-1.5", "rounded-lg", "text-[11px]", "flex", "items-center", "gap-1.5", "shrink-0", "transition-all", "duration-200", 3, "click"], [1, "font-mono"], [1, "w-full", "text-sm", "border-collapse", "text-left", "whitespace-nowrap", "min-w-[700px]"], [1, "bg-slate-50", "dark:bg-slate-800/50", "border-b", "border-slate-200", "dark:border-slate-700/60", "sticky", "top-0", "z-10", "shadow-sm"], [1, "py-3", "px-4", "text-center", "font-semibold", "text-slate-500", "dark:text-slate-400", "text-[11px]", "uppercase", "tracking-wider", "w-16"], [1, "py-3", "px-4", "font-semibold", "text-slate-500", "dark:text-slate-400", "text-[11px]", "uppercase", "tracking-wider"], [1, "py-3", "px-4", "text-center", "font-semibold", "text-slate-500", "dark:text-slate-400", "text-[11px]", "uppercase", "tracking-wider", "w-24"], [1, "py-3", "px-4", "text-center", "font-semibold", "text-slate-500", "dark:text-slate-400", "text-[11px]", "uppercase", "tracking-wider", "w-36"], [1, "divide-y", "divide-slate-100", "dark:divide-slate-800/80", "font-medium"], [1, "hover:bg-slate-50", "dark:hover:bg-slate-800/50", "transition-colors"], [1, "border-t-2", "border-dashed", "border-slate-200", "dark:border-slate-700"], [1, "py-3", "px-4", "text-center", "font-mono", "text-sm", "text-slate-400"], [1, "py-3", "px-4", "font-bold", "text-sm", "text-slate-700", "dark:text-slate-200"], [1, "py-3", "px-4", "text-center"], [1, "text-sm"], [1, "fa-regular"], [1, "py-3", "px-4", "text-center", "font-mono", "font-semibold", "text-sm", "text-slate-800", "dark:text-slate-200"], [1, "inline-flex", "items-center", "px-2.5", "py-1", "rounded-md", "text-[10px]", "font-bold", "uppercase", "tracking-wider", "bg-emerald-100/50", "dark:bg-emerald-900/30", "text-emerald-700", "dark:text-emerald-400"], [1, "inline-flex", "items-center", "px-2.5", "py-1", "rounded-md", "text-[10px]", "font-bold", "uppercase", "tracking-wider", "bg-rose-100/50", "dark:bg-rose-900/30", "text-rose-700", "dark:text-rose-400"], [1, "inline-flex", "items-center", "px-2.5", "py-1", "rounded-md", "text-[10px]", "font-semibold", "uppercase", "tracking-wider", "bg-slate-100", "dark:bg-slate-800", "text-slate-500", "dark:text-slate-400", "select-none"], [1, "py-2.5", "px-4", "bg-slate-50/60", "dark:bg-slate-900/40"], [1, "w-full", "flex", "items-center", "justify-center", "gap-2", "text-[11px]", "font-bold", "text-slate-500", "dark:text-slate-400", "hover:text-indigo-600", "dark:hover:text-indigo-400", "transition-colors", 3, "click"], [1, "fa-solid", "text-[9px]", "transition-transform", "duration-200"], [1, "px-1.5", "py-0.5", "bg-slate-100", "dark:bg-slate-800", "text-slate-400", "dark:text-slate-500", "rounded", "text-[9px]", "font-mono"], [1, "opacity-45", "bg-slate-50/30", "dark:bg-slate-900/30", "hover:opacity-75", "transition-opacity"], [1, "fa-solid", "fa-lock", "text-[10px]"], [1, "text-slate-300", "dark:text-slate-600"], [1, "text-slate-300", "dark:text-slate-600", "font-normal", "select-none"], [1, "text-slate-300", "dark:text-slate-600", "select-none"], [1, "w-full", "text-sm", "border-collapse", "text-left", "whitespace-nowrap", "min-w-[850px]"], [1, "py-3.5", "px-5", "font-semibold", "text-slate-500", "dark:text-slate-400", "text-[11px]", "uppercase", "tracking-wider", "w-24", "min-w-[96px]", "max-w-[96px]", "sticky", "left-0", "bg-slate-50", "dark:bg-slate-800", "z-30", "border-r", "border-slate-200/60", "dark:border-slate-700"], [1, "py-3.5", "px-5", "font-semibold", "text-slate-500", "dark:text-slate-400", "text-[11px]", "uppercase", "tracking-wider", "min-w-[160px]", "sticky", "left-24", "bg-slate-50", "dark:bg-slate-800", "z-30", "border-r", "border-slate-200/60", "dark:border-slate-700", "shadow-[4px_0_8px_-3px_rgba(0,0,0,0.08)]", "dark:shadow-[4px_0_8px_-3px_rgba(0,0,0,0.3)]"], [1, "py-3.5", "px-5", "text-center", "font-semibold", "text-slate-500", "dark:text-slate-400", "text-[11px]", "uppercase", "tracking-wider", "w-28"], [1, "py-3.5", "px-5", "text-center", "font-semibold", "text-slate-500", "dark:text-slate-400", "text-[11px]", "uppercase", "tracking-wider", "min-w-[140px]"], [1, "py-3.5", "px-3", "text-center", "font-semibold", "text-slate-500", "dark:text-slate-400", "text-[11px]", "uppercase", "tracking-wider", "w-24"], [1, "py-3.5", "px-5", "font-semibold", "text-slate-500", "dark:text-slate-400", "text-[11px]", "uppercase", "tracking-wider", "min-w-[180px]"], [1, "hover:bg-slate-50", "dark:hover:bg-slate-800/50", "transition-colors", "bg-white", "dark:bg-slate-900", 3, "ngClass"], [1, "inline-flex", "items-center", "justify-center", "gap-1", "text-[9px]", "font-bold", "text-slate-400", "hover:text-indigo-600", "dark:hover:text-indigo-400", "transition", "whitespace-nowrap", 3, "click"], [1, "py-3", "px-5", "font-mono", "text-sm", "text-slate-500", "dark:text-slate-400", "w-24", "min-w-[96px]", "max-w-[96px]", "sticky", "left-0", "bg-inherit", "z-10", "border-r", "border-slate-100", "dark:border-slate-800/80"], [1, "py-3", "px-5", "sticky", "left-24", "bg-inherit", "z-10", "border-r", "border-slate-100", "dark:border-slate-800/80", "shadow-[4px_0_8px_-3px_rgba(0,0,0,0.08)]", "dark:shadow-[4px_0_8px_-3px_rgba(0,0,0,0.3)]"], [1, "inline-flex", "items-center", "gap-2", "text-sm", "text-indigo-600", "dark:text-indigo-400", "font-bold", "uppercase", "tracking-wide"], [1, "font-mono", "text-sm", "font-semibold", "text-slate-800", "dark:text-slate-200", "select-all"], [1, "py-3", "px-5", "text-center", "font-mono", "text-sm", "text-slate-700", "dark:text-slate-300"], [1, "py-3", "px-5", "text-center", "font-mono", "font-semibold", "text-sm", "text-slate-700", "dark:text-slate-200"], [1, "py-3", "px-3", "text-center", "text-[10px]", "text-slate-300", "dark:text-slate-600", "select-none"], [1, "py-3", "px-5", "text-slate-500", "dark:text-slate-400", "text-sm", "italic"], [1, "fa-solid", "fa-flask", "text-xs"], [1, "bg-white", "dark:bg-slate-850", "text-slate-700", "dark:text-slate-200", "border", "border-slate-200", "dark:border-slate-750", "rounded-lg", "px-2", "py-1", "text-[11px]", "font-bold", "outline-none", "focus:ring-1", "focus:ring-indigo-500", "shadow-sm", 3, "ngModelChange", "ngModel"], [3, "value"], [1, "fa-solid", "fa-file-word", "text-blue-500"], ["title", "M\u1EDF PDF to\u00E0n m\u00E0n h\u00ECnh (Modal h\u1EC7 th\u1ED1ng)", 1, "p-2", "-mr-2", "text-slate-400", "hover:text-indigo-600", "dark:hover:text-indigo-400", "transition", "active:scale-90", 3, "click"], [1, "fa-solid", "fa-expand", "text-sm", "lg:text-base"], [1, "flex-1", "flex", "flex-col", "items-center", "justify-center", "gap-4", "p-8", "text-center"], [1, "w-full", "h-full", "border-none", "bg-white", "flex-1", 3, "src"], [1, "flex-1", "flex", "flex-col", "items-center", "justify-center", "gap-3", "p-8", "text-center"], [1, "w-12", "h-12", "rounded-2xl", "bg-indigo-50", "dark:bg-indigo-950/30", "flex", "items-center", "justify-center", "border", "border-indigo-100", "dark:border-indigo-900/40"], [1, "fa-solid", "fa-circle-notch", "fa-spin", "text-xl", "text-indigo-500"], [1, "text-xs", "font-bold", "text-slate-500", "dark:text-slate-400", "uppercase", "tracking-wider"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "mt-1"], [1, "w-14", "h-14", "rounded-2xl", "bg-amber-50", "dark:bg-amber-950/20", "flex", "items-center", "justify-center", "border", "border-amber-100", "dark:border-amber-900/40"], [1, "fa-solid", "fa-key", "text-2xl", "text-amber-500"], [1, "text-sm", "font-bold", "text-slate-700", "dark:text-slate-200"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "mt-1", "max-w-xs"], [1, "flex", "items-center", "gap-2"], [1, "px-4", "py-2", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "rounded-xl", "text-xs", "font-bold", "transition", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-rotate-right", "mr-1.5"], [1, "px-4", "py-2", "bg-white", "dark:bg-slate-800", "text-slate-600", "dark:text-slate-300", "rounded-xl", "text-xs", "font-bold", "border", "border-slate-200", "dark:border-slate-700", "transition", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-triangle-exclamation", "text-3xl", "text-amber-500"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "mt-1"], [1, "fa-solid", "fa-expand", "mr-1.5"], [1, "fa-solid", "fa-file-pdf", "text-4xl", "text-red-400", "animate-pulse"], [1, "text-xs", "text-slate-400"], [1, "fa-regular", "fa-file-pdf", "text-4xl"], [1, "text-sm", "font-medium"], [1, "w-20", "h-20", "bg-indigo-50", "dark:bg-indigo-955/30", "border", "border-indigo-100", "dark:border-indigo-900/50", "rounded-full", "flex", "items-center", "justify-center", "text-indigo-500", "text-3xl", "mb-5", "shadow-inner"], [1, "fa-solid", "fa-file-pen"], [1, "text-xl", "font-black", "text-slate-800", "dark:text-slate-100", "mb-2", "tracking-tight"], [1, "text-sm", "text-slate-500", "dark:text-slate-400", "mb-8", "text-center", "max-w-md", "leading-relaxed", "font-medium"], [1, "px-5", "py-2.5", "bg-slate-100", "hover:bg-slate-200", "dark:bg-slate-800", "dark:hover:bg-slate-750", "text-slate-600", "dark:text-slate-300", "rounded-xl", "text-sm", "font-bold", "transition", "active:scale-95", "shadow-sm", 3, "click"], [1, "px-6", "py-2.5", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "rounded-xl", "text-sm", "font-black", "transition", "shadow-md", "shadow-indigo-500/20", "active:scale-95", "flex", "items-center", "gap-2", 3, "click"], [1, "fa-solid", "fa-play", "text-xs"], [1, "w-16", "h-16", "bg-red-50", "dark:bg-red-950/20", "border", "border-red-100", "dark:border-red-900", "rounded-full", "flex", "items-center", "justify-center", "text-red-500", "text-2xl", "mb-4"], [1, "fa-solid", "fa-triangle-exclamation"], [1, "text-base", "font-extrabold", "text-slate-800", "dark:text-slate-200", "mb-1"], [1, "text-xs", "text-slate-400", "dark:text-slate-500", "mb-4", "text-center", "max-w-sm"], [1, "px-4", "py-2", "bg-slate-100", "hover:bg-slate-200", "dark:bg-slate-800", "dark:hover:bg-slate-750", "text-slate-700", "dark:text-slate-300", "rounded-xl", "text-xs", "font-bold", "transition", 3, "click"], [1, "fixed", "inset-0", "z-[100]", "flex", "items-center", "justify-center", "fade-in", "backdrop-blur-md", "bg-slate-900/60", 3, "click"], [1, "bg-white", "dark:bg-slate-900", "p-6", "sm:p-8", "rounded-3xl", "shadow-2xl", "scale-in", "border", "border-slate-200", "dark:border-slate-800", "flex", "flex-col", "items-center", "gap-6", "max-w-[calc(100vw-2rem)]", 3, "click"], [1, "text-center", "space-y-2"], [1, "text-xl", "font-black", "text-slate-800", "dark:text-slate-100", "uppercase", "tracking-wider"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "max-w-[280px]", "mx-auto", "leading-relaxed"], [1, "bg-white", "p-4", "rounded-2xl", "shadow-inner", "border", "border-slate-200/60", "max-w-full", "flex", "items-center", "justify-center"], [1, "w-[240px]", "h-[240px]", "max-w-full", "aspect-square", "object-contain"], [1, "flex", "items-center", "gap-3", "w-full", "justify-center"], [1, "px-5", "py-2.5", "bg-indigo-650", "hover:bg-indigo-755", "text-white", "rounded-xl", "text-xs", "font-black", "shadow-sm", "active:scale-95", "transition", "flex", "items-center", "gap-2", 3, "click"], [1, "fa-solid", "fa-arrow-up-right-from-square"], [1, "px-5", "py-2.5", "bg-slate-100", "dark:bg-slate-800", "hover:bg-slate-200", "dark:hover:bg-slate-700", "text-slate-655", "dark:text-slate-355", "rounded-xl", "text-xs", "font-bold", "active:scale-95", "transition", "border", "border-slate-200/50", 3, "click"], [1, "fa-solid", "fa-copy"], [1, "w-full", "px-8", "py-3", "bg-slate-100", "hover:bg-slate-200", "dark:bg-slate-800", "dark:hover:bg-slate-700", "dark:text-slate-200", "text-slate-700", "rounded-xl", "text-xs", "font-black", "active:scale-95", "transition", "mt-2", "border", "border-slate-200/60", "dark:border-slate-700", 3, "click"]], template: function BatchDetailViewComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 1)(1, "div", 2)(2, "div", 3)(3, "div", 4)(4, "button", 5);
            i0.ɵɵlistener("click", function BatchDetailViewComponent_Template_button_click_4_listener() { return ctx.goBack(); });
            i0.ɵɵelement(5, "i", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "div")(7, "div", 7)(8, "span");
            i0.ɵɵtext(9, "K\u1EBFt qu\u1EA3 ph\u00E2n t\u00EDch");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(10, "i", 8);
            i0.ɵɵelementStart(11, "span", 9);
            i0.ɵɵtext(12);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(13, "h3", 10);
            i0.ɵɵtext(14, " Chi Ti\u1EBFt K\u1EBFt Qu\u1EA3 M\u1EBB Ph\u00E2n T\u00EDch ");
            i0.ɵɵtemplate(15, BatchDetailViewComponent_Conditional_15_Template, 3, 8, "span", 11)(16, BatchDetailViewComponent_Conditional_16_Template, 3, 3, "a", 12);
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(17, BatchDetailViewComponent_Conditional_17_Template, 9, 8, "div", 13);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(18, BatchDetailViewComponent_Conditional_18_Template, 24, 6, "div", 14);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(19, BatchDetailViewComponent_Conditional_19_Template, 5, 0, "div", 15)(20, BatchDetailViewComponent_Conditional_20_Template, 35, 16)(21, BatchDetailViewComponent_Conditional_21_Template, 16, 1, "div", 16)(22, BatchDetailViewComponent_Conditional_22_Template, 9, 0, "div", 17)(23, BatchDetailViewComponent_Conditional_23_Template, 21, 0, "div", 18);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            let tmp_2_0;
            i0.ɵɵadvance(12);
            i0.ɵɵtextInterpolate(ctx.run() ? ctx.run().sopName : "\u0110ang t\u1EA3i...");
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.run() && ctx.draft() && ctx.config() ? 15 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(((tmp_2_0 = ctx.run()) == null ? null : tmp_2_0.parentMasterId) ? 16 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.run() && ctx.draft() && ctx.config() ? 17 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.run() && ctx.draft() && ctx.config() ? 18 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.isLoading() ? 19 : ctx.run() && ctx.draft() && ctx.config() ? 20 : ctx.run() && !ctx.draft() ? 21 : 22);
            i0.ɵɵadvance(4);
            i0.ɵɵconditional(ctx.isQrModalOpen() ? 23 : -1);
        } }, dependencies: [CommonModule, i1.NgClass, i1.DatePipe, FormsModule, i2.NgSelectOption, i2.ɵNgSelectMultipleOption, i2.SelectControlValueAccessor, i2.NgControlStatus, i2.NgModel, RouterModule, i3.RouterLink], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(BatchDetailViewComponent, [{
        type: Component,
        args: [{ selector: 'app-batch-detail-view', standalone: true, imports: [CommonModule, FormsModule, RouterModule], template: `
    <div class="h-full flex flex-col animate-fade-in bg-slate-50/60 dark:bg-slate-900 p-4 lg:p-6 space-y-4 lg:space-y-5">
      
      <!-- TOP HEADER & BREADCRUMBS -->
      <div class="flex flex-col gap-4 shrink-0 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <!-- Title and actions row -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <button (click)="goBack()" 
                    class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95 group shrink-0">
              <i class="fa-solid fa-arrow-left group-hover:-translate-x-0.5 transition-transform text-base"></i>
            </button>
            <div>
              <div class="flex items-center gap-1.5 text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider mb-0.5">
                <span>Kết quả phân tích</span>
                <i class="fa-solid fa-chevron-right text-[8px] text-slate-300 dark:text-slate-650"></i>
                <span class="text-indigo-650 dark:text-indigo-400">{{ run() ? run().sopName : 'Đang tải...' }}</span>
              </div>
              <h3 class="text-xl font-black text-slate-855 dark:text-slate-100 flex flex-wrap items-center gap-2 m-0 tracking-tight">
                Chi Tiết Kết Quả Mẻ Phân Tích
                @if (run() && draft() && config()) {
                  <span [class]="getStatusClass()" class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border shadow-xs">
                    <span class="w-1.5 h-1.5 rounded-full" [ngClass]="{
                      'bg-emerald-500': draft()?.status === 'completed',
                      'bg-indigo-500': draft()?.status === 'draft',
                      'bg-amber-500': $any(draft()?.status) === 'pending' || !draft()?.status
                    }"></span>
                    {{ getStatusText() }}
                  </span>
                }

                @if (run()?.parentMasterId) {
                  <a [routerLink]="['/results-view', run().parentMasterId]" class="px-2 py-0.5 rounded-full bg-fuchsia-50 dark:bg-fuchsia-955/20 border border-fuchsia-200 dark:border-fuchsia-900/40 text-fuchsia-600 dark:text-fuchsia-400 text-[9px] font-extrabold uppercase hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/30 transition-colors flex items-center gap-1 cursor-pointer shadow-xs" title="Mẻ chạy này đã được gộp số liệu. Nhấn để đi tới mẻ tổng hợp.">
                    <i class="fa-solid fa-link text-[8px] animate-pulse"></i> Đã Gộp Mẻ Tổng Hợp
                  </a>
                }
              </h3>
            </div>
          </div>

          <!-- Action Buttons -->
          @if (run() && draft() && config()) {
            <div class="flex items-center gap-2 shrink-0">
              <button (click)="openQrModal()"
                      class="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700 rounded-xl transition duration-200 active:scale-95 flex items-center gap-2">
                <i class="fa-solid fa-qrcode text-indigo-500"></i>
                <span>Mã QR</span>
              </button>

              <button (click)="goToEditMode()"
                      [class]="lockedByOthers() 
                        ? 'px-4 py-2 text-xs font-black text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-all duration-200 active:scale-95 flex items-center gap-2 cursor-pointer'
                        : 'px-4 py-2 text-xs font-black text-white bg-indigo-650 hover:bg-indigo-755 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-xl shadow-xs transition-all duration-200 active:scale-95 flex items-center gap-2 cursor-pointer'"
                      [title]="lockedByOthers() ? 'Mẻ này đang bị sửa bởi ' + run()?.lockedByName + '. Nhấp để xem chi tiết hoặc Giành quyền.' : 'Nhấp để chỉnh sửa số liệu'">
                <i class="fa-solid" [class.fa-lock]="lockedByOthers()" [class.fa-pen-to-square]="!lockedByOthers()"></i>
                <span>{{ lockedByOthers() ? 'Mẻ đang khóa' : 'Chỉnh sửa số liệu' }}</span>
              </button>
            </div>
          }
        </div>

        <!-- Metadata row -->
        @if (run() && draft() && config()) {
          <div class="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <div class="flex items-center gap-1.5">
              <i class="fa-solid fa-barcode text-slate-400 dark:text-slate-600 text-[11px]"></i>
              <span>Mã mẻ:</span>
              <span class="font-mono font-bold text-slate-700 dark:text-slate-300 select-all">{{ run()?.inputs?.['batchCode'] || run()?.id }}</span>
            </div>
            
            <div class="text-slate-300 dark:text-slate-700 select-none">•</div>

            <div class="flex items-center gap-1.5">
              <i class="fa-solid fa-user-astronaut text-slate-400 dark:text-slate-600 text-[11px]"></i>
              <span>Phân tích viên:</span>
              <span class="font-bold text-slate-700 dark:text-slate-300">{{ run()?.user || '—' }}</span>
            </div>

            <div class="text-slate-300 dark:text-slate-700 select-none">•</div>

            <div class="flex items-center gap-1.5">
              <i class="fa-regular fa-calendar text-slate-400 dark:text-slate-600 text-[11px]"></i>
              <span>Ngày phân tích:</span>
              <span class="font-bold text-slate-700 dark:text-slate-300">{{ run()?.analysisDate ? (run()!.analysisDate | date:'dd/MM/yyyy') : '—' }}</span>
            </div>
          </div>
        }
      </div>

      <!-- MAIN SPLIT SCREEN LAYOUT -->
      @if (isLoading()) {
        <div class="flex-1 flex items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 p-12">
          <div class="text-center space-y-4">
            <i class="fa-solid fa-circle-notch fa-spin text-3xl text-indigo-600 dark:text-indigo-400"></i>
            <p class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Đang tải chi tiết mẻ chạy...</p>
          </div>
        </div>
      } @else if (run() && draft() && config()) {
        <!-- Locking warning banner for View-Only Details -->
        @if (lockedByOthers()) {
          <div class="bg-amber-50/50 dark:bg-amber-955/20 border border-amber-200/40 dark:border-amber-900/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300 shrink-0">
            <div class="flex items-start gap-3.5">
              <div class="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200/20 shrink-0">
                <i class="fa-solid fa-lock text-sm animate-pulse"></i>
              </div>
              <div>
                <h4 class="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-400">Mẻ Chạy Đang Được Chỉnh Sửa</h4>
                <p class="text-[11px] text-amber-650 dark:text-amber-300 font-semibold mt-0.5">
                  KTV <strong>{{ run()?.lockedByName }}</strong> đang chỉnh sửa mẻ này từ lúc <strong>{{ convertToDate(run()?.lockedAt) | date: 'HH:mm dd/MM/yyyy' }}</strong>. Số liệu hiển thị có thể thay đổi liên tục.
                </p>
              </div>
            </div>
            <button (click)="takeOverLock()"
                    class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-xl transition flex items-center gap-2 shrink-0 active:scale-95 shadow-md shadow-amber-500/10 cursor-pointer">
              <i class="fa-solid fa-unlock-keyhole"></i>
              <span>Giành Quyền Chỉnh Sửa</span>
            </button>
          </div>
        }

        <!-- MOBILE TAB SWITCHER (lg:hidden) -->
        <div class="lg:hidden flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shrink-0 mb-1">
          <button (click)="mobileActiveTab.set('grid')"
                  [class]="mobileActiveTab() === 'grid'
                    ? 'flex-1 py-2.5 text-xs font-black bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 rounded-xl shadow-xs border border-slate-200/20 dark:border-slate-700/30'
                    : 'flex-1 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
                  class="transition-all duration-200 flex items-center justify-center gap-2">
            <i class="fa-solid fa-table-cells text-sm"></i>
            <span>Bảng Kết Quả</span>
          </button>
          <button (click)="mobileActiveTab.set('pdf')"
                  [class]="mobileActiveTab() === 'pdf'
                    ? 'flex-1 py-2.5 text-xs font-black bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 rounded-xl shadow-xs border border-slate-200/20 dark:border-slate-700/30'
                    : 'flex-1 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
                  class="transition-all duration-200 flex items-center justify-center gap-2">
            <i class="fa-solid fa-file-pdf text-sm text-red-500"></i>
            <span>Xem Trước PDF</span>
          </button>
        </div>

        <div class="flex-1 min-h-0 flex flex-col lg:flex-row gap-5 overflow-hidden lg:h-[calc(100vh-220px)] lg:min-h-[600px]">
          
          <!-- LEFT PANE: CHROMATOGRAPHY GRID (approx 55-60%) -->
          <div [class.hidden]="mobileActiveTab() !== 'grid'" class="lg:!flex lg:flex-[6] flex flex-col min-h-0 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
            
            <!-- Header of Grid -->
            <div class="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 shrink-0">
              <div class="flex items-center gap-3 min-w-0">
                <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center m-0 shrink-0">
                  <i class="fa-solid fa-table-cells mr-2.5 text-indigo-500"></i> Bảng Kết Quả Chạy
                </h4>
                
                <!-- Prefix filter tabs -->
                @if (detectedPrefixes().length > 1) {
                  <div class="flex items-center bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg border border-slate-200/60 dark:border-slate-800/80 ml-2 overflow-x-auto max-w-[200px] sm:max-w-none custom-scrollbar shrink-0">
                    <button (click)="changeActiveFilter('ALL')"
                            [class]="activeFilter() === 'ALL'
                              ? 'px-2 py-1 text-[9px] font-black bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 rounded shadow-xs'
                              : 'px-2 py-1 text-[9px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
                            class="transition duration-150 shrink-0">
                      Tất Cả
                    </button>
                    @for (prefix of detectedPrefixes(); track prefix) {
                      <button (click)="changeActiveFilter(prefix)"
                              [class]="activeFilter() === prefix
                                ? 'px-2 py-1 text-[9px] font-black bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 rounded shadow-xs'
                                : 'px-2 py-1 text-[9px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
                              class="transition duration-150 shrink-0">
                        {{ prefix === '' ? 'Không' : prefix }}
                      </button>
                    }
                  </div>
                }
              </div>
              
              <!-- Sample tabs for 3b -->
              @if (config()?.formType === 'type3b') {
                <div class="flex items-center gap-1.5 overflow-x-auto max-w-full sm:max-w-[60%] custom-scrollbar pb-1 sm:pb-0">
                  @for (sample of run()?.sampleList; track sample; let idx = $index) {
                    <button (click)="activeSampleCode.set(sample)"
                            [class]="activeSampleCode() === sample
                              ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20 border-transparent'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'"
                            class="px-2.5 py-1.5 rounded-lg text-[11px] flex items-center gap-1.5 shrink-0 transition-all duration-200">
                      <span class="font-mono">{{ sample }}</span>
                    </button>
                  }
                </div>
              }
            </div>

            <!-- Grid Content -->
            <div class="flex-1 overflow-y-auto custom-scrollbar p-1">
              @if (config()?.formType === 'type3b') {
                <!-- TYPE 3B Grid -->
                <div class="overflow-x-auto custom-scrollbar">
                  <table class="w-full text-sm border-collapse text-left whitespace-nowrap min-w-[700px]">
                  <thead>
                    <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/60 sticky top-0 z-10 shadow-sm">
                      <th class="py-3 px-4 text-center font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-16">STT</th>
                      <th class="py-3 px-4 font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">Hoạt chất</th>
                      <th class="py-3 px-4 text-center font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-24">ND (N/A)</th>
                      <th class="py-3 px-4 text-center font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-36">Kết quả (µg/kg)</th>
                      <th class="py-3 px-4 text-center font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-36">Độ thu hồi R%</th>
                      <th class="py-3 px-4 text-center font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-36">Hệ số tuyến tính R2</th>
                      <th class="py-3 px-4 text-center font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-36">Kết luận</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                    @for (comp of assignedCompounds(); track comp; let idx = $index) {
                      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td class="py-3 px-4 text-center font-mono text-sm text-slate-400">
                          {{ idx + 1 }}
                        </td>
                        <td class="py-3 px-4 font-bold text-sm text-slate-700 dark:text-slate-200">
                          {{ getCompoundDisplayName(comp) }}
                        </td>
                        <td class="py-3 px-4 text-center">
                          <span [class.text-amber-500]="(draft()?.resultData?.[activeSampleCode()] || {})[comp + '_nd']" class="text-sm">
                            <i class="fa-regular" [class.fa-square-check]="(draft()?.resultData?.[activeSampleCode()] || {})[comp + '_nd']" [class.fa-square]="!(draft()?.resultData?.[activeSampleCode()] || {})[comp + '_nd']"></i>
                          </span>
                        </td>
                        <td class="py-3 px-4 text-center font-mono font-semibold text-sm text-slate-800 dark:text-slate-200">
                          {{ (draft()?.resultData?.[activeSampleCode()] || {})[comp] !== undefined && (draft()?.resultData?.[activeSampleCode()] || {})[comp] !== null ? ((draft()?.resultData?.[activeSampleCode()] || {})[comp] === 'N/A' ? '—' : (draft()?.resultData?.[activeSampleCode()] || {})[comp]) : '—' }}
                        </td>
                        <!-- QC statuses badges -->
                        @for (qcNum of ['1', '2', '3']; track qcNum) {
                          <td class="py-3 px-4 text-center">
                            @if ((draft()?.resultData?.[activeSampleCode()] || {})[comp + '_qc' + qcNum] === 'Đạt') {
                              <span class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">Đạt</span>
                            } @else if ((draft()?.resultData?.[activeSampleCode()] || {})[comp + '_qc' + qcNum] === 'Không đạt') {
                              <span class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-100/50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400">K.Đạt</span>
                            } @else {
                              <span class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 select-none">—</span>
                            }
                          </td>
                        }
                      </tr>
                    }
                    @if (unassignedCompounds().length > 0) {
                      <tr class="border-t-2 border-dashed border-slate-200 dark:border-slate-700">
                        <td [attr.colspan]="7" class="py-2.5 px-4 bg-slate-50/60 dark:bg-slate-900/40">
                          <button (click)="showAllTargets.set(!showAllTargets())"
                                  class="w-full flex items-center justify-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            <i class="fa-solid text-[9px] transition-transform duration-200"
                               [class.fa-chevron-down]="!showAllTargets()"
                               [class.fa-chevron-up]="showAllTargets()"></i>
                            <span>{{ showAllTargets() ? 'Ẩn bớt chỉ tiêu không chỉ định' : 'Hiện thêm ' + unassignedCompounds().length + ' chỉ tiêu không chỉ định' }}</span>
                            <span class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded text-[9px] font-mono">
                              {{ unassignedCompounds().length }}
                            </span>
                          </button>
                        </td>
                      </tr>
                    }
                    @if (showAllTargets()) {
                      @for (comp of unassignedCompounds(); track comp) {
                        <tr class="opacity-45 bg-slate-50/30 dark:bg-slate-900/30 hover:opacity-75 transition-opacity">
                          <td class="py-3 px-4 text-center font-mono text-sm text-slate-400">
                            <i class="fa-solid fa-lock text-[10px]"></i>
                          </td>
                          <td class="py-3 px-4 font-bold text-sm text-slate-700 dark:text-slate-200">
                            {{ getCompoundDisplayName(comp) }}
                          </td>
                          <td class="py-3 px-4 text-center"><span class="text-slate-300 dark:text-slate-600">—</span></td>
                          <td class="py-3 px-4 text-center font-mono font-semibold text-sm text-slate-800 dark:text-slate-200">
                            <span class="text-slate-300 dark:text-slate-600 font-normal select-none">—</span>
                          </td>
                          @for (qcNum of ['1', '2', '3']; track qcNum) {
                            <td class="py-3 px-4 text-center">
                              <span class="text-slate-300 dark:text-slate-600 select-none">—</span>
                            </td>
                          }
                        </tr>
                      }
                    }
                  </tbody>
                </table>
                </div>
              } @else {
                <!-- TYPE 2 / 3A Grid -->
                <div class="overflow-x-auto custom-scrollbar">
                  <table class="w-full text-sm border-collapse text-left whitespace-nowrap min-w-[850px]">
                  <thead>
                    <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/60 sticky top-0 z-10 shadow-sm">
                      <th class="py-3.5 px-5 font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-24 min-w-[96px] max-w-[96px] sticky left-0 bg-slate-50 dark:bg-slate-800 z-30 border-r border-slate-200/60 dark:border-slate-700">Vial No.</th>
                      <th class="py-3.5 px-5 font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider min-w-[160px] sticky left-24 bg-slate-50 dark:bg-slate-800 z-30 border-r border-slate-200/60 dark:border-slate-700 shadow-[4px_0_8px_-3px_rgba(0,0,0,0.08)] dark:shadow-[4px_0_8px_-3px_rgba(0,0,0,0.3)]">Mẫu thử</th>
                      
                      @if (hasColumn('khoiLuong')) {
                        <th class="py-3.5 px-5 text-center font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-28">Khối lượng</th>
                      }
                      @if (hasColumn('heSoPhaLoang')) {
                        <th class="py-3.5 px-5 text-center font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-28">HS Pha loãng</th>
                      }

                      @for (col of visibleColumns(); track col) {
                        <th class="py-3.5 px-5 text-center font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider min-w-[140px]">
                          {{ columnDisplayNames()[col] || col }}
                        </th>
                      }
                      @if (hiddenColumns().length > 0) {
                        <th class="py-3.5 px-3 text-center font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider w-24">
                          <button (click)="showAllTargets.set(!showAllTargets())"
                                  class="inline-flex items-center justify-center gap-1 text-[9px] font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition whitespace-nowrap">
                            <i class="fa-solid"
                               [class.fa-plus-circle]="!showAllTargets()"
                               [class.fa-minus-circle]="showAllTargets()"></i>
                            <span>{{ showAllTargets() ? 'Thu gọn' : '+' + hiddenColumns().length + ' cột' }}</span>
                          </button>
                        </th>
                      }
                      
                      <th class="py-3.5 px-5 font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider min-w-[180px]">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                    @for (row of getType2DisplayRows(); track row.key) {
                      <tr [ngClass]="{
                        'bg-indigo-50/30 dark:bg-indigo-900/10 font-semibold text-slate-900 dark:text-slate-100': row.isQC,
                        'bg-white dark:bg-slate-900': !row.isQC
                      }" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors bg-white dark:bg-slate-900">
                        
                        <td class="py-3 px-5 font-mono text-sm text-slate-500 dark:text-slate-400 w-24 min-w-[96px] max-w-[96px] sticky left-0 bg-inherit z-10 border-r border-slate-100 dark:border-slate-800/80">
                          {{ getRowDataValue(row.key, 'loSo') || '—' }}
                        </td>
                        
                        <td class="py-3 px-5 sticky left-24 bg-inherit z-10 border-r border-slate-100 dark:border-slate-800/80 shadow-[4px_0_8px_-3px_rgba(0,0,0,0.08)] dark:shadow-[4px_0_8px_-3px_rgba(0,0,0,0.3)]">
                          @if (row.isQC) {
                            <span class="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wide">
                              <i class="fa-solid fa-flask text-xs"></i> {{ row.label }}
                            </span>
                          } @else {
                            <span class="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200 select-all">{{ row.label }}</span>
                          }
                        </td>

                        @if (hasColumn('khoiLuong')) {
                          <td class="py-3 px-5 text-center font-mono text-sm text-slate-700 dark:text-slate-300">
                            {{ getRowDataValue(row.key, 'khoiLuong') !== '' ? getRowDataValue(row.key, 'khoiLuong') : '—' }}
                          </td>
                        }
                        @if (hasColumn('heSoPhaLoang')) {
                          <td class="py-3 px-5 text-center font-mono text-sm text-slate-700 dark:text-slate-300">
                            {{ getRowDataValue(row.key, 'heSoPhaLoang') !== '' ? getRowDataValue(row.key, 'heSoPhaLoang') : '—' }}
                          </td>
                        }

                        @for (col of visibleColumns(); track col) {
                          <td class="py-3 px-5 text-center font-mono font-semibold text-sm text-slate-700 dark:text-slate-200">
                            @if (isTargetAssigned(row.key, col)) {
                              {{ getRowDataValue(row.key, col) !== '' ? (getRowDataValue(row.key, col) === 'N/A' ? '—' : getRowDataValue(row.key, col)) : '—' }}
                            } @else {
                              <span class="text-slate-300 dark:text-slate-600 font-normal select-none">—</span>
                            }
                          </td>
                        }
                        @if (hiddenColumns().length > 0) {
                          <td class="py-3 px-3 text-center text-[10px] text-slate-300 dark:text-slate-600 select-none">
                            {{ showAllTargets() ? '' : '...' }}
                          </td>
                        }

                        <td class="py-3 px-5 text-slate-500 dark:text-slate-400 text-sm italic">
                          {{ getRowDataValue(row.key, 'ghiChu') }}
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
                </div>
              }
            </div>
          </div>

          <!-- RIGHT PANE: PDF PREVIEW (approx 40-45%) -->
          <div [class.hidden]="mobileActiveTab() !== 'pdf'" class="lg:!flex lg:flex-[4] flex flex-col min-h-[300px] lg:min-h-[600px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden relative">
            
            <div class="px-5 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 shrink-0 relative z-10">
              <div class="flex items-center gap-3">
                <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center m-0">
                  <i class="fa-solid fa-file-pdf mr-2.5 text-red-500"></i> PDF PREVIEW
                </h4>
                
                @if (availableReports().length > 1) {
                  <select [ngModel]="selectedPdfPrefix()" 
                          (ngModelChange)="selectReport($event)"
                          class="bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-750 rounded-lg px-2 py-1 text-[11px] font-bold outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm">
                    @for (report of availableReports(); track report.key) {
                      <option [value]="report.key">{{ report.label }}</option>
                    }
                  </select>
                }
              </div>
              
              <div class="flex items-center gap-3">
                @if (currentDocsUrl()) {
                  <a [href]="currentDocsUrl()" target="_blank" rel="noopener noreferrer"
                     class="px-2.5 py-1 text-[10px] font-bold text-slate-650 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 rounded-lg border border-slate-200/60 dark:border-slate-700/80 transition flex items-center gap-1.5 no-underline shadow-xs cursor-pointer"
                     title="Mở Google Docs gốc để xem/chỉnh sửa ở cửa sổ mới">
                    <i class="fa-solid fa-file-word text-blue-500"></i>
                    <span>Google Docs</span>
                  </a>
                }

                @if (currentPdfUrl()) {
                  <button (click)="openPdfInModal(currentPdfUrl()!)" 
                          class="p-2 -mr-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition active:scale-90" title="Mở PDF toàn màn hình (Modal hệ thống)">
                    <i class="fa-solid fa-expand text-sm lg:text-base"></i>
                  </button>
                }
              </div>
            </div>

            <div class="flex-1 bg-slate-100/50 dark:bg-slate-950/50 flex flex-col relative">
              @if (currentPdfUrl()) {
                @if (isInlinePdfLoading()) {
                  <div class="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
                    <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
                      <i class="fa-solid fa-circle-notch fa-spin text-xl text-indigo-500"></i>
                    </div>
                    <div>
                      <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Đang tải PDF...</p>
                      <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Tải dữ liệu từ Google Drive qua proxy</p>
                    </div>
                  </div>
                } @else if (inlinePdfNeedsAuth()) {
                  <div class="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
                    <div class="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center border border-amber-100 dark:border-amber-900/40">
                      <i class="fa-solid fa-key text-2xl text-amber-500"></i>
                    </div>
                    <div>
                      <p class="text-sm font-bold text-slate-700 dark:text-slate-200">Cần xác thực Google Drive</p>
                      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">Phiên xác thực đã hết hạn. Xác thực lại để xem PDF trực tiếp trong trang.</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <button (click)="beginInlinePdfAuth()"
                              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition active:scale-95">
                        <i class="fa-solid fa-rotate-right mr-1.5"></i>Xác thực & tải lại
                      </button>
                      <button (click)="openPdfInModal(currentPdfUrl()!)"
                              class="px-4 py-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 transition active:scale-95">
                        Mở modal
                      </button>
                    </div>
                  </div>
                } @else if (inlinePdfError()) {
                  <div class="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
                    <i class="fa-solid fa-triangle-exclamation text-3xl text-amber-500"></i>
                    <div>
                      <p class="text-sm font-bold text-slate-700 dark:text-slate-200">Không thể tải PDF trực tiếp</p>
                      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Bạn vẫn có thể mở bằng modal hệ thống.</p>
                    </div>
                    <button (click)="openPdfInModal(currentPdfUrl()!)"
                            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition active:scale-95">
                      <i class="fa-solid fa-expand mr-1.5"></i>Mở qua hệ thống
                    </button>
                  </div>
                } @else if (inlinePdfSafeUrl()) {
                  <iframe [src]="inlinePdfSafeUrl()!" class="w-full h-full border-none bg-white flex-1"></iframe>
                } @else {
                  <div class="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
                    <i class="fa-solid fa-file-pdf text-4xl text-red-400 animate-pulse"></i>
                    <p class="text-xs text-slate-400">Đang chuẩn bị PDF...</p>
                  </div>
                }
              } @else {
                <div class="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 p-8 text-center space-y-3 relative z-10">
                  <i class="fa-regular fa-file-pdf text-4xl"></i>
                  <p class="text-sm font-medium">{{ pdfPreviewEmptyMessage() }}</p>
                </div>
              }
            </div>
          </div>
        </div>
      } @else if (run() && !draft()) {
        <!-- PENDING STATE: No results entered yet -->
        <div class="flex-1 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed p-12 animate-fade-in shadow-sm">
          <div class="w-20 h-20 bg-indigo-50 dark:bg-indigo-955/30 border border-indigo-100 dark:border-indigo-900/50 rounded-full flex items-center justify-center text-indigo-500 text-3xl mb-5 shadow-inner">
            <i class="fa-solid fa-file-pen"></i>
          </div>
          <h4 class="text-xl font-black text-slate-800 dark:text-slate-100 mb-2 tracking-tight">Chưa Có Kết Quả Phân Tích</h4>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8 text-center max-w-md leading-relaxed font-medium">
            Mẻ chạy <span class="font-bold text-slate-700 dark:text-slate-300">[{{ run()?.inputs?.['batchCode'] || run()?.id }}]</span> hiện chưa được nhập số liệu và đánh giá QC. Nhấn nút bên dưới để bắt đầu điền kết quả.
          </p>
          <div class="flex items-center gap-3">
            <button (click)="goBack()" class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-bold transition active:scale-95 shadow-sm">
              Quay Lại
            </button>
            <button (click)="goToEditMode()" class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-black transition shadow-md shadow-indigo-500/20 active:scale-95 flex items-center gap-2">
              <i class="fa-solid fa-play text-xs"></i>
              Mở Màn Hình Nhập Kết Quả
            </button>
          </div>
        </div>
      } @else {
        <!-- ERROR STATE: Batch not found -->
        <div class="flex-1 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed p-12">
          <div class="w-16 h-16 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 rounded-full flex items-center justify-center text-red-500 text-2xl mb-4">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <h4 class="text-base font-extrabold text-slate-800 dark:text-slate-200 mb-1">Không Tìm Thấy Mẻ Phân Tích</h4>
          <p class="text-xs text-slate-400 dark:text-slate-500 mb-4 text-center max-w-sm">
            Không tìm thấy thông tin chi tiết hoặc cấu hình SOP tương ứng của mẻ chạy phân tích này.
          </p>
          <button (click)="goBack()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition">
            Quay Lại Danh Sách
          </button>
        </div>
      }

      <!-- QR Interactive Modal -->
      @if (isQrModalOpen()) {
        <div class="fixed inset-0 z-[100] flex items-center justify-center fade-in backdrop-blur-md bg-slate-900/60" (click)="isQrModalOpen.set(false)">
          <div class="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-2xl scale-in border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-6 max-w-[calc(100vw-2rem)]" (click)="$event.stopPropagation()">
            <div class="text-center space-y-2">
              <h3 class="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">Xác Minh Mẻ Chạy</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 max-w-[280px] mx-auto leading-relaxed">Sử dụng điện thoại để quét hoặc truy cập vào liên kết đối chiếu độc lập của hệ thống LIMS.</p>
            </div>
            
            <div class="bg-white p-4 rounded-2xl shadow-inner border border-slate-200/60 max-w-full flex items-center justify-center">
              <canvas #qrModalCanvas class="w-[240px] h-[240px] max-w-full aspect-square object-contain"></canvas>
            </div>
            
            <div class="flex items-center gap-3 w-full justify-center">
              <button (click)="viewTraceability()" 
                      class="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-755 text-white rounded-xl text-xs font-black shadow-sm active:scale-95 transition flex items-center gap-2">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                <span>Mở Trang</span>
              </button>
              <button (click)="copyTraceabilityLink()" 
                      class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-655 dark:text-slate-355 rounded-xl text-xs font-bold active:scale-95 transition border border-slate-200/50">
                <i class="fa-solid fa-copy"></i>
                <span>Sao Chép Liên Kết</span>
              </button>
            </div>

            <button (click)="isQrModalOpen.set(false)" class="w-full px-8 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 text-slate-700 rounded-xl text-xs font-black active:scale-95 transition mt-2 border border-slate-200/60 dark:border-slate-700">
              Đóng
            </button>
          </div>
        </div>
      }
    </div>

  ` }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(BatchDetailViewComponent, { className: "BatchDetailViewComponent", filePath: "src/app/features/results-view/batch-detail-view.component.ts", lineNumber: 572 }); })();
//# sourceMappingURL=batch-detail-view.component.js.map