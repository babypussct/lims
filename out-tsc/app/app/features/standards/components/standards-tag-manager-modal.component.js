import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StandardTagCatalogService } from '../services/standard-tag-catalog.service';
import { compareChemicalMethodCodes, parseTagKeyStrict } from '../services/standard-tag.utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _c0 = () => [];
const _forTrack0 = ($index, $item) => $item.key;
function StandardsTagManagerModalComponent_Conditional_0_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 31);
    i0.ɵɵlistener("click", function StandardsTagManagerModalComponent_Conditional_0_Conditional_16_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.resetForm()); });
    i0.ɵɵtext(1, "T\u1EA1o m\u1EDBi");
    i0.ɵɵelementEnd();
} }
function StandardsTagManagerModalComponent_Conditional_0_Conditional_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 19);
} }
function StandardsTagManagerModalComponent_Conditional_0_Conditional_25_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.editingId() ? "L\u01B0u thay \u0111\u1ED5i" : "T\u1EA1o nh\u00E3n", " ");
} }
function StandardsTagManagerModalComponent_Conditional_0_Conditional_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 32);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("text-red-500", ctx_r1.messageType() === "error")("text-emerald-600", ctx_r1.messageType() === "success");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.message());
} }
function StandardsTagManagerModalComponent_Conditional_0_Conditional_36_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 33)(1, "div", 34)(2, "div", 35);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 36);
    i0.ɵɵtext(5, "T\u1EA1o");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "div", 34)(7, "div", 35);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 36);
    i0.ɵɵtext(10, "C\u1EADp nh\u1EADt");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "div", 34)(12, "div", 35);
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "div", 36);
    i0.ɵɵtext(15, "Gi\u1EEF nguy\u00EAn");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "div", 34)(17, "div", 35);
    i0.ɵɵtext(18);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "div", 36);
    i0.ɵɵtext(20, "Kh\u00F4i ph\u1EE5c");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(21, "div", 37)(22, "div", 38);
    i0.ɵɵtext(23);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "div", 39);
    i0.ɵɵtext(25, "Xung \u0111\u1ED9t");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(26, "label", 40)(27, "input", 41);
    i0.ɵɵlistener("ngModelChange", function StandardsTagManagerModalComponent_Conditional_0_Conditional_36_Template_input_ngModelChange_27_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(2); ctx_r1.restoreArchivedFromSameSeed.set($event); return i0.ɵɵresetView(ctx_r1.loadPreview()); });
    i0.ɵɵelementEnd();
    i0.ɵɵtext(28, " Kh\u00F4i ph\u1EE5c nh\u00E3n \u0111\u00E3 soft-delete c\u00F9ng seed n\u1EBFu c\u00F2n hi\u1EC7u l\u1EF1c ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "button", 42);
    i0.ɵɵlistener("click", function StandardsTagManagerModalComponent_Conditional_0_Conditional_36_Template_button_click_29_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.importSeed()); });
    i0.ɵɵtext(30, "N\u1EA1p/\u0111\u1ED3ng b\u1ED9 seed h\u00F3a h\u1ECDc");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.preview().createIds.length);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r1.preview().updateIds.length);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r1.preview().unchangedIds.length);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r1.preview().restoreIds.length);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r1.preview().conflictIds.length);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r1.restoreArchivedFromSameSeed())("disabled", ctx_r1.isBusy());
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r1.isBusy() || ctx_r1.preview().conflictIds.length > 0);
} }
function StandardsTagManagerModalComponent_Conditional_0_For_45_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 47);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const option_r5 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("title", option_r5.methodName);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(option_r5.methodName);
} }
function StandardsTagManagerModalComponent_Conditional_0_For_45_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 50);
    i0.ɵɵtext(1, "ACCREDITATION");
    i0.ɵɵelementEnd();
} }
function StandardsTagManagerModalComponent_Conditional_0_For_45_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 51);
    i0.ɵɵtext(1, "\u0110\u00C3 \u1EA8N");
    i0.ɵɵelementEnd();
} }
function StandardsTagManagerModalComponent_Conditional_0_For_45_For_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 52);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const device_r6 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(device_r6);
} }
function StandardsTagManagerModalComponent_Conditional_0_For_45_Conditional_13_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 55);
    i0.ɵɵlistener("click", function StandardsTagManagerModalComponent_Conditional_0_For_45_Conditional_13_Conditional_1_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r7); const option_r5 = i0.ɵɵnextContext(2).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.restore(option_r5.key)); });
    i0.ɵɵelement(1, "i", 56);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵproperty("disabled", ctx_r1.isBusy());
} }
function StandardsTagManagerModalComponent_Conditional_0_For_45_Conditional_13_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 57);
    i0.ɵɵlistener("click", function StandardsTagManagerModalComponent_Conditional_0_For_45_Conditional_13_Conditional_2_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r8); const option_r5 = i0.ɵɵnextContext(2).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.edit(option_r5)); });
    i0.ɵɵelement(1, "i", 58);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "button", 59);
    i0.ɵɵlistener("click", function StandardsTagManagerModalComponent_Conditional_0_For_45_Conditional_13_Conditional_2_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r8); const option_r5 = i0.ɵɵnextContext(2).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.softDelete(option_r5.key)); });
    i0.ɵɵelement(3, "i", 60);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵproperty("disabled", ctx_r1.isBusy());
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r1.isBusy());
} }
function StandardsTagManagerModalComponent_Conditional_0_For_45_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 53);
    i0.ɵɵtemplate(1, StandardsTagManagerModalComponent_Conditional_0_For_45_Conditional_13_Conditional_1_Template, 2, 1, "button", 54)(2, StandardsTagManagerModalComponent_Conditional_0_For_45_Conditional_13_Conditional_2_Template, 4, 2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const option_r5 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵconditional(option_r5.archived ? 1 : 2);
} }
function StandardsTagManagerModalComponent_Conditional_0_For_45_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 43)(1, "div", 44)(2, "div", 45)(3, "div", 46);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, StandardsTagManagerModalComponent_Conditional_0_For_45_Conditional_5_Template, 2, 2, "div", 47);
    i0.ɵɵelementStart(6, "div", 48);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 49);
    i0.ɵɵtemplate(9, StandardsTagManagerModalComponent_Conditional_0_For_45_Conditional_9_Template, 2, 0, "span", 50)(10, StandardsTagManagerModalComponent_Conditional_0_For_45_Conditional_10_Template, 2, 0, "span", 51);
    i0.ɵɵrepeaterCreate(11, StandardsTagManagerModalComponent_Conditional_0_For_45_For_12_Template, 2, 1, "span", 52, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(13, StandardsTagManagerModalComponent_Conditional_0_For_45_Conditional_13_Template, 3, 1, "div", 53);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const option_r5 = ctx.$implicit;
    i0.ɵɵclassProp("opacity-60", option_r5.archived);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("title", option_r5.key);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(option_r5.label);
    i0.ɵɵadvance();
    i0.ɵɵconditional(option_r5.methodName ? 5 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("title", option_r5.key);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(option_r5.key);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(option_r5.origin === "ACCREDITATION_SCOPE" ? 9 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(option_r5.archived ? 10 : -1);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(option_r5.deviceCodes || i0.ɵɵpureFunction0(10, _c0));
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(option_r5.origin !== "ACCREDITATION_SCOPE" ? 13 : -1);
} }
function StandardsTagManagerModalComponent_Conditional_0_ForEmpty_46_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 30);
    i0.ɵɵtext(1, "Ch\u01B0a c\u00F3 nh\u00E3n custom trong danh m\u1EE5c.");
    i0.ɵɵelementEnd();
} }
function StandardsTagManagerModalComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div")(4, "h3", 3);
    i0.ɵɵtext(5, "Danh m\u1EE5c nh\u00E3n trung t\u00E2m");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 4);
    i0.ɵɵtext(7, "Nh\u00E3n ph\u01B0\u01A1ng ph\u00E1p h\u00F3a h\u1ECDc \u0111\u01B0\u1EE3c n\u1EA1p theo seed c\u00F3 truy v\u1EBFt; nh\u00E3n th\u1EE7 c\u00F4ng d\u00F9ng soft-delete.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "button", 5);
    i0.ɵɵlistener("click", function StandardsTagManagerModalComponent_Conditional_0_Template_button_click_8_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.close.emit()); });
    i0.ɵɵelement(9, "i", 6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "div", 7)(11, "div", 8)(12, "section", 9)(13, "div", 10)(14, "h4", 11);
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(16, StandardsTagManagerModalComponent_Conditional_0_Conditional_16_Template, 2, 0, "button", 12);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "input", 13);
    i0.ɵɵlistener("ngModelChange", function StandardsTagManagerModalComponent_Conditional_0_Template_input_ngModelChange_17_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.name.set($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "textarea", 14);
    i0.ɵɵlistener("ngModelChange", function StandardsTagManagerModalComponent_Conditional_0_Template_textarea_ngModelChange_18_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.description.set($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "div", 15)(20, "label", 16);
    i0.ɵɵtext(21, "M\u00E0u");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "input", 17);
    i0.ɵɵlistener("ngModelChange", function StandardsTagManagerModalComponent_Conditional_0_Template_input_ngModelChange_22_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.color.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(23, "button", 18);
    i0.ɵɵlistener("click", function StandardsTagManagerModalComponent_Conditional_0_Template_button_click_23_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.saveManualTag()); });
    i0.ɵɵtemplate(24, StandardsTagManagerModalComponent_Conditional_0_Conditional_24_Template, 1, 0, "i", 19)(25, StandardsTagManagerModalComponent_Conditional_0_Conditional_25_Template, 1, 1);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(26, StandardsTagManagerModalComponent_Conditional_0_Conditional_26_Template, 2, 5, "p", 20);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "section", 21)(28, "div", 22)(29, "div")(30, "h4", 23);
    i0.ɵɵtext(31, "VLAT-1.1669 \u00B7 487/Q\u0110-AOSC");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "p", 24);
    i0.ɵɵtext(33, "119 m\u00E3 NAFI6/H-* h\u00F3a h\u1ECDc, kh\u00F4ng bao g\u1ED3m ph\u1EA7n sinh h\u1ECDc. Thi\u1EBFt b\u1ECB ch\u1EC9 l\u00E0 metadata d\u1EABn xu\u1EA5t.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(34, "button", 25);
    i0.ɵɵlistener("click", function StandardsTagManagerModalComponent_Conditional_0_Template_button_click_34_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.loadPreview()); });
    i0.ɵɵtext(35, "Preview");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(36, StandardsTagManagerModalComponent_Conditional_0_Conditional_36_Template, 31, 8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(37, "section")(38, "div", 26)(39, "h4", 11);
    i0.ɵɵtext(40);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(41, "button", 27);
    i0.ɵɵlistener("click", function StandardsTagManagerModalComponent_Conditional_0_Template_button_click_41_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.refreshCatalog()); });
    i0.ɵɵtext(42, "L\u00E0m m\u1EDBi");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(43, "div", 28);
    i0.ɵɵrepeaterCreate(44, StandardsTagManagerModalComponent_Conditional_0_For_45_Template, 14, 11, "div", 29, _forTrack0, false, StandardsTagManagerModalComponent_Conditional_0_ForEmpty_46_Template, 2, 0, "div", 30);
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(15);
    i0.ɵɵtextInterpolate(ctx_r1.editingId() ? "S\u1EEDa nh\u00E3n th\u1EE7 c\u00F4ng" : "T\u1EA1o nh\u00E3n th\u1EE7 c\u00F4ng");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.editingId() ? 16 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngModel", ctx_r1.name());
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngModel", ctx_r1.description());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngModel", ctx_r1.color());
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.isBusy() || !ctx_r1.name().trim());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isBusy() ? 24 : 25);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.message() ? 26 : -1);
    i0.ɵɵadvance(8);
    i0.ɵɵproperty("disabled", ctx_r1.isBusy());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.preview() ? 36 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("C\u00E1c nh\u00E3n trong danh m\u1EE5c (", ctx_r1.customOptions().length, ")");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.isBusy());
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r1.customOptions());
} }
/** Admin-only lifecycle UI for manual and accreditation-scope catalog tags. */
export class StandardsTagManagerModalComponent {
    constructor() {
        this.isOpen = input(false);
        this.close = output();
        this.catalog = inject(StandardTagCatalogService);
        this.customOptions = computed(() => [...this.catalog.lookupMap().values()]
            .filter(option => option.source === 'CUSTOM')
            .sort((a, b) => a.methodCode && b.methodCode
            ? compareChemicalMethodCodes(a.methodCode, b.methodCode)
            : a.label.localeCompare(b.label, 'vi', { sensitivity: 'base', numeric: true })));
        this.name = signal('');
        this.description = signal('');
        this.color = signal('');
        this.editingId = signal(null);
        this.preview = signal(null);
        this.restoreArchivedFromSameSeed = signal(false);
        this.isBusy = signal(false);
        this.message = signal('');
        this.messageType = signal('success');
        effect(() => {
            if (this.isOpen()) {
                this.preview.set(null);
                this.clearMessage();
            }
        });
    }
    edit(option) {
        try {
            this.editingId.set(parseTagKeyStrict(option.key).id);
            this.name.set(option.label);
            this.description.set(option.description || '');
            this.color.set(option.color || '');
        }
        catch {
            this.showMessage('Key nhãn không hợp lệ.', 'error');
        }
    }
    resetForm() {
        this.editingId.set(null);
        this.name.set('');
        this.description.set('');
        this.color.set('');
    }
    async saveManualTag() {
        if (this.isBusy())
            return;
        this.isBusy.set(true);
        try {
            const input = { name: this.name(), description: this.description(), color: this.color() };
            if (this.editingId())
                await this.catalog.updateCustomTag(this.editingId(), input);
            else
                await this.catalog.createCustomTag(input);
            this.showMessage(this.editingId() ? 'Đã cập nhật nhãn.' : 'Đã tạo nhãn.', 'success');
            this.resetForm();
        }
        catch (error) {
            this.showMessage(error?.message || 'Không thể lưu nhãn.', 'error');
        }
        finally {
            this.isBusy.set(false);
        }
    }
    async softDelete(key) {
        if (this.isBusy() || !window.confirm('Ẩn nhãn này? Lịch sử cũ vẫn giữ nguyên label.'))
            return;
        await this.runCatalogAction(() => this.catalog.softDeleteCustomTag(parseTagKeyStrict(key).id), 'Đã ẩn nhãn.');
    }
    async restore(key) {
        if (this.isBusy())
            return;
        await this.runCatalogAction(() => this.catalog.restoreCustomTag(parseTagKeyStrict(key).id), 'Đã khôi phục nhãn.');
    }
    async refreshCatalog() {
        if (this.isBusy())
            return;
        await this.runCatalogAction(() => this.catalog.refresh(true), 'Đã làm mới danh mục.');
    }
    async loadPreview() {
        if (this.isBusy())
            return;
        this.isBusy.set(true);
        try {
            this.preview.set(await this.catalog.previewAccreditationMethodImport({ restoreArchivedFromSameSeed: this.restoreArchivedFromSameSeed() }));
            this.clearMessage();
        }
        catch (error) {
            this.showMessage(error?.message || 'Không thể đọc preview seed.', 'error');
        }
        finally {
            this.isBusy.set(false);
        }
    }
    async importSeed() {
        if (this.isBusy() || !this.preview() || this.preview().conflictIds.length > 0)
            return;
        if (!window.confirm(`Nạp ${this.preview().createIds.length + this.preview().updateIds.length + this.preview().restoreIds.length} nhãn phương pháp?`))
            return;
        this.isBusy.set(true);
        try {
            const result = await this.catalog.upsertAccreditationMethodTags({ restoreArchivedFromSameSeed: this.restoreArchivedFromSameSeed() });
            this.showMessage(`Đã đồng bộ seed: tạo ${result.createIds.length}, cập nhật ${result.updateIds.length}, khôi phục ${result.restoreIds.length}, giữ nguyên ${result.unchangedIds.length}.`, 'success');
            this.preview.set(await this.catalog.previewAccreditationMethodImport({ restoreArchivedFromSameSeed: this.restoreArchivedFromSameSeed() }));
        }
        catch (error) {
            this.showMessage(error?.message || 'Không thể import seed.', 'error');
        }
        finally {
            this.isBusy.set(false);
        }
    }
    async runCatalogAction(action, success) {
        this.isBusy.set(true);
        try {
            await action();
            this.showMessage(success, 'success');
        }
        catch (error) {
            this.showMessage(error?.message || 'Thao tác danh mục thất bại.', 'error');
        }
        finally {
            this.isBusy.set(false);
        }
    }
    showMessage(value, type) {
        this.message.set(value);
        this.messageType.set(type);
    }
    clearMessage() {
        this.message.set('');
    }
    static { this.ɵfac = function StandardsTagManagerModalComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StandardsTagManagerModalComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StandardsTagManagerModalComponent, selectors: [["app-standards-tag-manager-modal"]], inputs: { isOpen: [1, "isOpen"] }, outputs: { close: "close" }, decls: 1, vars: 1, consts: [["role", "dialog", "aria-modal", "true", 1, "fixed", "inset-0", "z-[610]", "flex", "items-center", "justify-center", "p-4", "bg-slate-900/60", "backdrop-blur-sm"], [1, "w-full", "max-w-4xl", "max-h-[90vh]", "rounded-[2rem]", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "shadow-2xl", "overflow-hidden", "flex", "flex-col"], [1, "px-6", "py-5", "border-b", "border-slate-100", "dark:border-slate-800", "flex", "items-center", "justify-between", "shrink-0"], [1, "text-lg", "font-black", "text-slate-800", "dark:text-slate-100"], [1, "text-xs", "text-slate-500", "mt-1"], ["type", "button", 1, "w-8", "h-8", "rounded-full", "hover:bg-slate-100", "dark:hover:bg-slate-800", "text-slate-400", 3, "click"], [1, "fa-solid", "fa-times"], [1, "flex-1", "overflow-y-auto", "p-6", "space-y-6", "custom-scrollbar"], [1, "grid", "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]", "gap-6"], [1, "rounded-2xl", "border", "border-slate-200", "dark:border-slate-700", "p-4", "space-y-3"], [1, "flex", "items-center", "justify-between"], [1, "text-sm", "font-black", "text-slate-700", "dark:text-slate-200"], ["type", "button", 1, "text-xs", "font-bold", "text-slate-400", "hover:text-indigo-600"], ["maxlength", "100", "placeholder", "T\u00EAn nh\u00E3n", 1, "w-full", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800", "px-3", "py-2", "text-sm", "font-bold", 3, "ngModelChange", "ngModel"], ["rows", "3", "placeholder", "M\u00F4 t\u1EA3 (kh\u00F4ng b\u1EAFt bu\u1ED9c)", 1, "w-full", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800", "px-3", "py-2", "text-sm", 3, "ngModelChange", "ngModel"], [1, "flex", "items-center", "gap-2"], [1, "text-xs", "font-bold", "text-slate-500"], ["type", "text", "maxlength", "7", "placeholder", "#4F46E5", 1, "flex-1", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800", "px-3", "py-2", "text-sm", "font-mono", 3, "ngModelChange", "ngModel"], ["type", "button", 1, "w-full", "rounded-xl", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "px-4", "py-2.5", "text-sm", "font-black", "disabled:opacity-50", 3, "click", "disabled"], [1, "fa-solid", "fa-spinner", "fa-spin"], [1, "text-xs", "font-bold", 3, "text-red-500", "text-emerald-600"], [1, "rounded-2xl", "border", "border-fuchsia-200", "dark:border-fuchsia-900/40", "bg-fuchsia-50/50", "dark:bg-fuchsia-900/10", "p-4", "space-y-3"], [1, "flex", "items-start", "justify-between", "gap-4"], [1, "text-sm", "font-black", "text-fuchsia-800", "dark:text-fuchsia-200"], [1, "text-xs", "text-fuchsia-700/80", "dark:text-fuchsia-300/80", "mt-1"], ["type", "button", 1, "shrink-0", "rounded-xl", "border", "border-fuchsia-300", "dark:border-fuchsia-700", "px-3", "py-2", "text-xs", "font-black", "text-fuchsia-700", "dark:text-fuchsia-200", "hover:bg-white/70", "disabled:opacity-50", 3, "click", "disabled"], [1, "flex", "items-center", "justify-between", "mb-3"], ["type", "button", 1, "text-xs", "font-bold", "text-indigo-600", "hover:text-indigo-700", 3, "click", "disabled"], [1, "grid", "sm:grid-cols-2", "lg:grid-cols-3", "gap-2"], [1, "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "p-3", "bg-white", "dark:bg-slate-800/60", 3, "opacity-60"], [1, "col-span-full", "text-xs", "text-slate-400", "italic"], ["type", "button", 1, "text-xs", "font-bold", "text-slate-400", "hover:text-indigo-600", 3, "click"], [1, "text-xs", "font-bold"], [1, "grid", "grid-cols-2", "sm:grid-cols-5", "gap-2", "text-center"], [1, "rounded-lg", "bg-white/70", "dark:bg-slate-800/70", "p-2"], [1, "text-lg", "font-black"], [1, "text-[10px]", "uppercase", "text-slate-500"], [1, "rounded-lg", "bg-red-100", "dark:bg-red-900/30", "p-2"], [1, "text-lg", "font-black", "text-red-600", "dark:text-red-300"], [1, "text-[10px]", "uppercase", "text-red-600", "dark:text-red-300"], [1, "flex", "items-center", "gap-2", "text-xs", "font-bold", "text-fuchsia-800", "dark:text-fuchsia-200"], ["type", "checkbox", 3, "ngModelChange", "ngModel", "disabled"], ["type", "button", 1, "w-full", "rounded-xl", "bg-fuchsia-600", "hover:bg-fuchsia-700", "text-white", "px-4", "py-2.5", "text-sm", "font-black", "disabled:opacity-50", 3, "click", "disabled"], [1, "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "p-3", "bg-white", "dark:bg-slate-800/60"], [1, "flex", "items-start", "justify-between", "gap-2"], [1, "min-w-0"], [1, "font-bold", "text-sm", "text-slate-700", "dark:text-slate-200", "truncate", 3, "title"], [1, "text-[10px]", "text-slate-500", "dark:text-slate-400", "line-clamp-2", 3, "title"], [1, "text-[10px]", "font-mono", "text-slate-400", "truncate", 3, "title"], [1, "flex", "flex-wrap", "gap-1", "mt-1"], [1, "rounded-full", "bg-fuchsia-100", "text-fuchsia-700", "px-1.5", "py-0.5", "text-[9px]", "font-black"], [1, "rounded-full", "bg-slate-100", "text-slate-500", "px-1.5", "py-0.5", "text-[9px]", "font-black"], [1, "rounded-full", "bg-fuchsia-50", "text-fuchsia-700", "px-1.5", "py-0.5", "text-[9px]", "font-black"], [1, "flex", "gap-1", "shrink-0"], ["type", "button", "title", "Kh\u00F4i ph\u1EE5c", 1, "text-xs", "text-emerald-600", "hover:text-emerald-700", 3, "disabled"], ["type", "button", "title", "Kh\u00F4i ph\u1EE5c", 1, "text-xs", "text-emerald-600", "hover:text-emerald-700", 3, "click", "disabled"], [1, "fa-solid", "fa-rotate-left"], ["type", "button", "title", "S\u1EEDa", 1, "text-xs", "text-indigo-600", "hover:text-indigo-700", 3, "click", "disabled"], [1, "fa-solid", "fa-pen"], ["type", "button", "title", "\u1EA8n", 1, "text-xs", "text-red-500", "hover:text-red-600", 3, "click", "disabled"], [1, "fa-solid", "fa-eye-slash"]], template: function StandardsTagManagerModalComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, StandardsTagManagerModalComponent_Conditional_0_Template, 47, 13, "div", 0);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.isOpen() ? 0 : -1);
        } }, dependencies: [CommonModule, FormsModule, i1.DefaultValueAccessor, i1.CheckboxControlValueAccessor, i1.NgControlStatus, i1.MaxLengthValidator, i1.NgModel], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StandardsTagManagerModalComponent, [{
        type: Component,
        args: [{
                selector: 'app-standards-tag-manager-modal',
                standalone: true,
                imports: [CommonModule, FormsModule],
                template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-[610] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" role="dialog" aria-modal="true">
        <div class="w-full max-w-4xl max-h-[90vh] rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col">
          <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div>
              <h3 class="text-lg font-black text-slate-800 dark:text-slate-100">Danh mục nhãn trung tâm</h3>
              <p class="text-xs text-slate-500 mt-1">Nhãn phương pháp hóa học được nạp theo seed có truy vết; nhãn thủ công dùng soft-delete.</p>
            </div>
            <button type="button" (click)="close.emit()" class="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"><i class="fa-solid fa-times"></i></button>
          </div>

          <div class="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            <div class="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-6">
              <section class="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
                <div class="flex items-center justify-between">
                  <h4 class="text-sm font-black text-slate-700 dark:text-slate-200">{{ editingId() ? 'Sửa nhãn thủ công' : 'Tạo nhãn thủ công' }}</h4>
                  @if (editingId()) { <button type="button" (click)="resetForm()" class="text-xs font-bold text-slate-400 hover:text-indigo-600">Tạo mới</button> }
                </div>
                <input [ngModel]="name()" (ngModelChange)="name.set($event)" maxlength="100" placeholder="Tên nhãn" class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm font-bold">
                <textarea [ngModel]="description()" (ngModelChange)="description.set($event)" rows="3" placeholder="Mô tả (không bắt buộc)" class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm"></textarea>
                <div class="flex items-center gap-2">
                  <label class="text-xs font-bold text-slate-500">Màu</label>
                  <input [ngModel]="color()" (ngModelChange)="color.set($event)" type="text" maxlength="7" placeholder="#4F46E5" class="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm font-mono">
                </div>
                <button type="button" (click)="saveManualTag()" [disabled]="isBusy() || !name().trim()" class="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 text-sm font-black disabled:opacity-50">
                  @if (isBusy()) { <i class="fa-solid fa-spinner fa-spin"></i> } @else { {{ editingId() ? 'Lưu thay đổi' : 'Tạo nhãn' }} }
                </button>
                @if (message()) { <p class="text-xs font-bold" [class.text-red-500]="messageType() === 'error'" [class.text-emerald-600]="messageType() === 'success'">{{message()}}</p> }
              </section>

              <section class="rounded-2xl border border-fuchsia-200 dark:border-fuchsia-900/40 bg-fuchsia-50/50 dark:bg-fuchsia-900/10 p-4 space-y-3">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h4 class="text-sm font-black text-fuchsia-800 dark:text-fuchsia-200">VLAT-1.1669 · 487/QĐ-AOSC</h4>
                    <p class="text-xs text-fuchsia-700/80 dark:text-fuchsia-300/80 mt-1">119 mã NAFI6/H-* hóa học, không bao gồm phần sinh học. Thiết bị chỉ là metadata dẫn xuất.</p>
                  </div>
                  <button type="button" (click)="loadPreview()" [disabled]="isBusy()" class="shrink-0 rounded-xl border border-fuchsia-300 dark:border-fuchsia-700 px-3 py-2 text-xs font-black text-fuchsia-700 dark:text-fuchsia-200 hover:bg-white/70 disabled:opacity-50">Preview</button>
                </div>
                @if (preview()) {
                  <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                    <div class="rounded-lg bg-white/70 dark:bg-slate-800/70 p-2"><div class="text-lg font-black">{{preview()!.createIds.length}}</div><div class="text-[10px] uppercase text-slate-500">Tạo</div></div>
                    <div class="rounded-lg bg-white/70 dark:bg-slate-800/70 p-2"><div class="text-lg font-black">{{preview()!.updateIds.length}}</div><div class="text-[10px] uppercase text-slate-500">Cập nhật</div></div>
                    <div class="rounded-lg bg-white/70 dark:bg-slate-800/70 p-2"><div class="text-lg font-black">{{preview()!.unchangedIds.length}}</div><div class="text-[10px] uppercase text-slate-500">Giữ nguyên</div></div>
                    <div class="rounded-lg bg-white/70 dark:bg-slate-800/70 p-2"><div class="text-lg font-black">{{preview()!.restoreIds.length}}</div><div class="text-[10px] uppercase text-slate-500">Khôi phục</div></div>
                    <div class="rounded-lg bg-red-100 dark:bg-red-900/30 p-2"><div class="text-lg font-black text-red-600 dark:text-red-300">{{preview()!.conflictIds.length}}</div><div class="text-[10px] uppercase text-red-600 dark:text-red-300">Xung đột</div></div>
                  </div>
                  <label class="flex items-center gap-2 text-xs font-bold text-fuchsia-800 dark:text-fuchsia-200">
                    <input type="checkbox" [ngModel]="restoreArchivedFromSameSeed()" (ngModelChange)="restoreArchivedFromSameSeed.set($event); loadPreview()" [disabled]="isBusy()">
                    Khôi phục nhãn đã soft-delete cùng seed nếu còn hiệu lực
                  </label>
                  <button type="button" (click)="importSeed()" [disabled]="isBusy() || preview()!.conflictIds.length > 0" class="w-full rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2.5 text-sm font-black disabled:opacity-50">Nạp/đồng bộ seed hóa học</button>
                }
              </section>
            </div>

            <section>
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-sm font-black text-slate-700 dark:text-slate-200">Các nhãn trong danh mục ({{customOptions().length}})</h4>
                <button type="button" (click)="refreshCatalog()" [disabled]="isBusy()" class="text-xs font-bold text-indigo-600 hover:text-indigo-700">Làm mới</button>
              </div>
              <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                @for (option of customOptions(); track option.key) {
                  <div class="rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-800/60" [class.opacity-60]="option.archived">
                    <div class="flex items-start justify-between gap-2">
                      <div class="min-w-0">
                        <div class="font-bold text-sm text-slate-700 dark:text-slate-200 truncate" [title]="option.key">{{option.label}}</div>
                        @if (option.methodName) { <div class="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2" [title]="option.methodName">{{option.methodName}}</div> }
                        <div class="text-[10px] font-mono text-slate-400 truncate" [title]="option.key">{{option.key}}</div>
                        <div class="flex flex-wrap gap-1 mt-1">
                          @if (option.origin === 'ACCREDITATION_SCOPE') { <span class="rounded-full bg-fuchsia-100 text-fuchsia-700 px-1.5 py-0.5 text-[9px] font-black">ACCREDITATION</span> }
                          @if (option.archived) { <span class="rounded-full bg-slate-100 text-slate-500 px-1.5 py-0.5 text-[9px] font-black">ĐÃ ẨN</span> }
                          @for (device of option.deviceCodes || []; track device) { <span class="rounded-full bg-fuchsia-50 text-fuchsia-700 px-1.5 py-0.5 text-[9px] font-black">{{device}}</span> }
                        </div>
                      </div>
                      @if (option.origin !== 'ACCREDITATION_SCOPE') {
                        <div class="flex gap-1 shrink-0">
                          @if (option.archived) {
                            <button type="button" (click)="restore(option.key)" [disabled]="isBusy()" class="text-xs text-emerald-600 hover:text-emerald-700" title="Khôi phục"><i class="fa-solid fa-rotate-left"></i></button>
                          } @else {
                            <button type="button" (click)="edit(option)" [disabled]="isBusy()" class="text-xs text-indigo-600 hover:text-indigo-700" title="Sửa"><i class="fa-solid fa-pen"></i></button>
                            <button type="button" (click)="softDelete(option.key)" [disabled]="isBusy()" class="text-xs text-red-500 hover:text-red-600" title="Ẩn"><i class="fa-solid fa-eye-slash"></i></button>
                          }
                        </div>
                      }
                    </div>
                  </div>
                } @empty {
                  <div class="col-span-full text-xs text-slate-400 italic">Chưa có nhãn custom trong danh mục.</div>
                }
              </div>
            </section>
          </div>
        </div>
      </div>
    }
  `,
            }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StandardsTagManagerModalComponent, { className: "StandardsTagManagerModalComponent", filePath: "src/app/features/standards/components/standards-tag-manager-modal.component.ts", lineNumber: 113 }); })();
//# sourceMappingURL=standards-tag-manager-modal.component.js.map