import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getExpiryClass, formatNum } from '../../../shared/utils/utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.uid;
function StandardsBackfillModalComponent_Conditional_0_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 8)(1, "span", 9);
    i0.ɵɵtext(2, "M\u00E3 qu\u1EA3n l\u00FD");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 50);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate((tmp_2_0 = ctx_r1.std()) == null ? null : tmp_2_0.internal_id);
} }
function StandardsBackfillModalComponent_Conditional_0_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 14)(1, "div", 51);
    i0.ɵɵelement(2, "i", 52);
    i0.ɵɵelementStart(3, "span", 53);
    i0.ɵɵtext(4, "\u0110ang \u0111\u01B0\u1EE3c m\u01B0\u1EE3n");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "p", 54);
    i0.ɵɵtext(6, " Chu\u1EA9n \u0111ang \u0111\u01B0\u1EE3c ");
    i0.ɵɵelementStart(7, "strong");
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(9, " s\u1EED d\u1EE5ng. Nh\u1EADp b\u00F9 v\u1EABn \u0111\u01B0\u1EE3c cho ph\u00E9p v\u00EC \u0111\u00E2y l\u00E0 h\u1ED3i k\u00FD l\u1ECBch s\u1EED. ");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate((tmp_2_0 = ctx_r1.std()) == null ? null : tmp_2_0.current_holder);
} }
function StandardsBackfillModalComponent_Conditional_0_For_50_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 29);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const user_r3 = ctx.$implicit;
    i0.ɵɵproperty("value", user_r3.uid);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2("", user_r3.displayName, " (", user_r3.email, ")");
} }
function StandardsBackfillModalComponent_Conditional_0_Conditional_66_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 55);
    i0.ɵɵlistener("click", function StandardsBackfillModalComponent_Conditional_0_Conditional_66_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.fillMaxAmount()); });
    i0.ɵɵelement(1, "i", 56);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2(" T\u1ED1i \u0111a (", ctx_r1.formatNum((tmp_2_0 = (tmp_2_0 = ctx_r1.std()) == null ? null : tmp_2_0.current_amount) !== null && tmp_2_0 !== undefined ? tmp_2_0 : 0), " ", (tmp_2_0 = ctx_r1.std()) == null ? null : tmp_2_0.unit, ") ");
} }
function StandardsBackfillModalComponent_Conditional_0_Conditional_76_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 43);
    i0.ɵɵelement(1, "i", 57);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2(" V\u01B0\u1EE3t qu\u00E1 t\u1ED3n kho (c\u00F2n ", ctx_r1.formatNum((tmp_2_0 = (tmp_2_0 = ctx_r1.std()) == null ? null : tmp_2_0.current_amount) !== null && tmp_2_0 !== undefined ? tmp_2_0 : 0), " ", (tmp_2_0 = ctx_r1.std()) == null ? null : tmp_2_0.unit, ") ");
} }
function StandardsBackfillModalComponent_Conditional_0_Conditional_98_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 58);
    i0.ɵɵtext(1, " \u0110ang l\u01B0u... ");
} }
function StandardsBackfillModalComponent_Conditional_0_Conditional_99_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 59);
    i0.ɵɵtext(1, " Ghi nh\u1EADt k\u00FD ");
} }
function StandardsBackfillModalComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
    i0.ɵɵelement(4, "i", 4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "h3", 5);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div", 6);
    i0.ɵɵtext(8, "Nh\u1EADp b\u00F9 nh\u1EADt k\u00FD s\u1EED d\u1EE5ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 7)(10, "div", 8)(11, "span", 9);
    i0.ɵɵtext(12, "S\u1ED1 L\u00F4 / Lot");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "span", 10);
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(15, StandardsBackfillModalComponent_Conditional_0_Conditional_15_Template, 5, 1, "div", 8);
    i0.ɵɵelementStart(16, "div", 8)(17, "span", 9);
    i0.ɵɵtext(18, "H\u1EA1n d\u00F9ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "span", 11);
    i0.ɵɵtext(20);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(21, "div", 8)(22, "span", 9);
    i0.ɵɵtext(23, "T\u1ED3n kho hi\u1EC7n t\u1EA1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "span", 12);
    i0.ɵɵtext(25);
    i0.ɵɵelementStart(26, "span", 13);
    i0.ɵɵtext(27);
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(28, StandardsBackfillModalComponent_Conditional_0_Conditional_28_Template, 10, 1, "div", 14);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "div", 15)(30, "div", 16)(31, "p", 17);
    i0.ɵɵelement(32, "i", 18);
    i0.ɵɵtext(33, " Thao t\u00E1c s\u1EBD ghi nh\u1EADt k\u00FD v\u00E0 tr\u1EEB t\u1ED3n kho t\u01B0\u01A1ng \u1EE9ng v\u1EDBi ng\u00E0y \u0111\u01B0\u1EE3c nh\u1EADp. D\u1EEF li\u1EC7u c\u00F3 th\u1EC3 rollback t\u1EEB m\u00E0n h\u00ECnh L\u1ECBch s\u1EED. ");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(34, "div", 19)(35, "div", 20)(36, "h3", 21);
    i0.ɵɵtext(37, " Nh\u1EADp b\u00F9 nh\u1EADt k\u00FD ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(38, "button", 22);
    i0.ɵɵlistener("click", function StandardsBackfillModalComponent_Conditional_0_Template_button_click_38_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeModal.emit()); });
    i0.ɵɵelement(39, "i", 23);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(40, "div", 24)(41, "div")(42, "label", 25);
    i0.ɵɵtext(43, "Ng\u01B0\u1EDDi s\u1EED d\u1EE5ng ");
    i0.ɵɵelementStart(44, "span", 26);
    i0.ɵɵtext(45, "*");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(46, "select", 27);
    i0.ɵɵlistener("ngModelChange", function StandardsBackfillModalComponent_Conditional_0_Template_select_ngModelChange_46_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onUserChange($event)); });
    i0.ɵɵelementStart(47, "option", 28);
    i0.ɵɵtext(48, "-- Ch\u1ECDn ng\u01B0\u1EDDi s\u1EED d\u1EE5ng --");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(49, StandardsBackfillModalComponent_Conditional_0_For_50_Template, 2, 3, "option", 29, _forTrack0);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(51, "div")(52, "label", 25);
    i0.ɵɵtext(53, "Ng\u00E0y s\u1EED d\u1EE5ng ");
    i0.ɵɵelementStart(54, "span", 26);
    i0.ɵɵtext(55, "*");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(56, "input", 30);
    i0.ɵɵlistener("ngModelChange", function StandardsBackfillModalComponent_Conditional_0_Template_input_ngModelChange_56_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.usageDate.set($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(57, "p", 31);
    i0.ɵɵelement(58, "i", 32);
    i0.ɵɵtext(59, " Ng\u00E0y c\u00F3 th\u1EC3 nh\u1EADp ng\u01B0\u1EE3c (kh\u00F4ng \u0111\u01B0\u1EE3c sau h\u00F4m nay) ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(60, "div")(61, "div", 33)(62, "label", 34);
    i0.ɵɵtext(63);
    i0.ɵɵelementStart(64, "span", 26);
    i0.ɵɵtext(65, "*");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(66, StandardsBackfillModalComponent_Conditional_0_Conditional_66_Template, 3, 2, "button", 35);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(67, "div", 36)(68, "input", 37);
    i0.ɵɵlistener("ngModelChange", function StandardsBackfillModalComponent_Conditional_0_Template_input_ngModelChange_68_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onAmountChange($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(69, "span", 38);
    i0.ɵɵtext(70);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(71, "div", 39)(72, "input", 40);
    i0.ɵɵlistener("ngModelChange", function StandardsBackfillModalComponent_Conditional_0_Template_input_ngModelChange_72_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onDepletedChange($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(73, "label", 41);
    i0.ɵɵelement(74, "i", 42);
    i0.ɵɵtext(75, " \u0110\u00E1nh d\u1EA5u chu\u1EA9n \u0111\u00E3 s\u1EED d\u1EE5ng h\u1EBFt (H\u1EBFt h\u00E0ng) ");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(76, StandardsBackfillModalComponent_Conditional_0_Conditional_76_Template, 3, 2, "p", 43);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(77, "div")(78, "label", 25);
    i0.ɵɵtext(79, "M\u1EE5c \u0111\u00EDch s\u1EED d\u1EE5ng ");
    i0.ɵɵelementStart(80, "span", 26);
    i0.ɵɵtext(81, "*");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(82, "textarea", 44);
    i0.ɵɵlistener("ngModelChange", function StandardsBackfillModalComponent_Conditional_0_Template_textarea_ngModelChange_82_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.purpose.set($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(83, "div", 45)(84, "button", 46);
    i0.ɵɵlistener("click", function StandardsBackfillModalComponent_Conditional_0_Template_button_click_84_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.purpose.set("Pha chu\u1EA9n m\u1EDBi")); });
    i0.ɵɵtext(85, "# Pha Chu\u1EA9n M\u1EDBi");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(86, "button", 46);
    i0.ɵɵlistener("click", function StandardsBackfillModalComponent_Conditional_0_Template_button_click_86_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.purpose.set("Ki\u1EC3m tra \u0111\u1ECBnh k\u1EF3")); });
    i0.ɵɵtext(87, "# Ki\u1EC3m Tra \u0110\u1ECBnh K\u1EF3");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(88, "button", 46);
    i0.ɵɵlistener("click", function StandardsBackfillModalComponent_Conditional_0_Template_button_click_88_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.purpose.set("Ngo\u1EA1i ki\u1EC3m")); });
    i0.ɵɵtext(89, "# Ngo\u1EA1i Ki\u1EC3m");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(90, "button", 46);
    i0.ɵɵlistener("click", function StandardsBackfillModalComponent_Conditional_0_Template_button_click_90_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.purpose.set("Nghi\u00EAn c\u1EE9u ph\u00E1t tri\u1EC3n")); });
    i0.ɵɵtext(91, "# Nghi\u00EAn C\u1EE9u Ph\u00E1t Tri\u1EC3n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(92, "button", 46);
    i0.ɵɵlistener("click", function StandardsBackfillModalComponent_Conditional_0_Template_button_click_92_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.purpose.set("Ki\u1EC3m nghi\u1EC7m m\u1EABu")); });
    i0.ɵɵtext(93, "# Ki\u1EC3m Nghi\u1EC7m M\u1EABu");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(94, "div", 47)(95, "button", 48);
    i0.ɵɵlistener("click", function StandardsBackfillModalComponent_Conditional_0_Template_button_click_95_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeModal.emit()); });
    i0.ɵɵtext(96, "H\u1EE7y B\u1ECF");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(97, "button", 49);
    i0.ɵɵlistener("click", function StandardsBackfillModalComponent_Conditional_0_Template_button_click_97_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onConfirm()); });
    i0.ɵɵtemplate(98, StandardsBackfillModalComponent_Conditional_0_Conditional_98_Template, 2, 0)(99, StandardsBackfillModalComponent_Conditional_0_Conditional_99_Template, 2, 0);
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    let tmp_13_0;
    let tmp_14_0;
    let tmp_16_0;
    let tmp_17_0;
    let tmp_19_0;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate((tmp_1_0 = ctx_r1.std()) == null ? null : tmp_1_0.name);
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate(((tmp_2_0 = ctx_r1.std()) == null ? null : tmp_2_0.lot_number) || "N/A");
    i0.ɵɵadvance();
    i0.ɵɵconditional(((tmp_3_0 = ctx_r1.std()) == null ? null : tmp_3_0.internal_id) ? 15 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵclassMap(ctx_r1.getExpiryClass((tmp_4_0 = ctx_r1.std()) == null ? null : tmp_4_0.expiry_date));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(((tmp_5_0 = ctx_r1.std()) == null ? null : tmp_5_0.expiry_date) || "N/A");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1("", ctx_r1.formatNum((tmp_6_0 = (tmp_6_0 = ctx_r1.std()) == null ? null : tmp_6_0.current_amount) !== null && tmp_6_0 !== undefined ? tmp_6_0 : 0), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate((tmp_7_0 = ctx_r1.std()) == null ? null : tmp_7_0.unit);
    i0.ɵɵadvance();
    i0.ɵɵconditional(((tmp_8_0 = ctx_r1.std()) == null ? null : tmp_8_0.status) === "IN_USE" ? 28 : -1);
    i0.ɵɵadvance(18);
    i0.ɵɵproperty("ngModel", ctx_r1.userId());
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r1.userList());
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("ngModel", ctx_r1.usageDate())("max", ctx_r1.todayStr);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate1(" L\u01B0\u1EE3ng s\u1EED d\u1EE5ng (", (tmp_13_0 = ctx_r1.std()) == null ? null : tmp_13_0.unit, ") ");
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(((tmp_14_0 = (tmp_14_0 = ctx_r1.std()) == null ? null : tmp_14_0.current_amount) !== null && tmp_14_0 !== undefined ? tmp_14_0 : 0) > 0 ? 66 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngModel", ctx_r1.amountUsed())("max", (tmp_16_0 = (tmp_16_0 = ctx_r1.std()) == null ? null : tmp_16_0.current_amount) !== null && tmp_16_0 !== undefined ? tmp_16_0 : null);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate((tmp_17_0 = ctx_r1.std()) == null ? null : tmp_17_0.unit);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngModel", ctx_r1.isDepleted());
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.amountUsed() && ctx_r1.std() && ctx_r1.amountUsed() > ((tmp_19_0 = (tmp_19_0 = ctx_r1.std()) == null ? null : tmp_19_0.current_amount) !== null && tmp_19_0 !== undefined ? tmp_19_0 : 0) ? 76 : -1);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngModel", ctx_r1.purpose());
    i0.ɵɵadvance(15);
    i0.ɵɵproperty("disabled", !ctx_r1.canConfirm() || ctx_r1.isProcessing());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isProcessing() ? 98 : 99);
} }
export class StandardsBackfillModalComponent {
    constructor() {
        this.std = input.required();
        this.isOpen = input.required();
        this.userList = input.required();
        this.isProcessing = input.required();
        this.closeModal = output();
        this.confirm = output();
        this.userId = signal('');
        this.userName = signal('');
        this.usageDate = signal('');
        this.amountUsed = signal(null);
        this.purpose = signal('');
        this.isDepleted = signal(false);
        this.todayStr = new Date().toISOString().split('T')[0];
        this.getExpiryClass = getExpiryClass;
        this.formatNum = formatNum;
        effect(() => {
            if (this.isOpen()) {
                // Reset form khi modal mở
                this.userId.set('');
                this.userName.set('');
                this.usageDate.set(this.todayStr);
                this.amountUsed.set(null);
                this.purpose.set('');
                this.isDepleted.set(false);
            }
        });
    }
    onUserChange(uid) {
        this.userId.set(uid);
        const user = this.userList().find(u => u.uid === uid);
        this.userName.set(user ? (user.displayName || user.email || '') : '');
    }
    fillMaxAmount() {
        const max = this.std()?.current_amount ?? 0;
        this.amountUsed.set(max);
        this.isDepleted.set(true);
    }
    onAmountChange(val) {
        this.amountUsed.set(val);
        const max = this.std()?.current_amount ?? 0;
        if (val !== null && max > 0 && val >= max) {
            this.isDepleted.set(true);
        }
    }
    onDepletedChange(checked) {
        this.isDepleted.set(checked);
        if (checked) {
            const max = this.std()?.current_amount ?? 0;
            if (max > 0) {
                this.amountUsed.set(max);
            }
        }
    }
    canConfirm() {
        const amount = this.amountUsed();
        return !!(this.userId() &&
            this.usageDate() &&
            amount !== null && amount > 0 &&
            this.purpose().trim());
    }
    onConfirm() {
        const amount = this.amountUsed();
        if (!this.canConfirm() || amount === null)
            return;
        this.confirm.emit({
            date: this.usageDate(),
            amountUsed: amount,
            unit: this.std()?.unit || 'mg',
            purpose: this.purpose().trim(),
            userId: this.userId(),
            userName: this.userName(),
            isDepleted: this.isDepleted()
        });
    }
    static { this.ɵfac = function StandardsBackfillModalComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StandardsBackfillModalComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StandardsBackfillModalComponent, selectors: [["app-standards-backfill-modal"]], inputs: { std: [1, "std"], isOpen: [1, "isOpen"], userList: [1, "userList"], isProcessing: [1, "isProcessing"] }, outputs: { closeModal: "closeModal", confirm: "confirm" }, decls: 1, vars: 1, consts: [[1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "p-4", "bg-slate-900/60", "backdrop-blur-sm", "fade-in"], [1, "bg-white", "dark:bg-slate-900", "rounded-[2.5rem]", "shadow-2xl", "w-full", "max-w-3xl", "flex", "overflow-hidden", "animate-bounce-in", "border", "border-slate-100", "dark:border-slate-800"], [1, "hidden", "md:flex", "w-2/5", "bg-slate-50", "dark:bg-slate-800/50", "p-8", "flex-col", "border-r", "border-slate-100", "dark:border-slate-800"], [1, "w-14", "h-14", "rounded-2xl", "bg-white", "dark:bg-slate-800", "text-purple-600", "dark:text-purple-400", "flex", "items-center", "justify-center", "text-2xl", "shadow-sm", "border", "border-slate-100", "dark:border-slate-700", "mb-6"], [1, "fa-solid", "fa-pen-to-square"], [1, "text-xl", "font-black", "text-slate-800", "dark:text-slate-100", "leading-tight", "mb-2", "line-clamp-3"], [1, "text-[10px]", "font-bold", "text-purple-600", "dark:text-purple-400", "uppercase", "tracking-widest", "mb-6"], [1, "space-y-4"], [1, "flex", "flex-col"], [1, "text-[10px]", "font-bold", "text-slate-400", "uppercase"], [1, "text-sm", "font-bold", "text-slate-700", "dark:text-slate-200"], [1, "text-sm", "font-bold"], [1, "text-lg", "font-black", "text-emerald-600", "dark:text-emerald-400"], [1, "text-xs", "font-bold", "text-slate-400"], [1, "p-3", "bg-amber-50", "dark:bg-amber-900/20", "rounded-2xl", "border", "border-amber-200", "dark:border-amber-700/50"], [1, "mt-auto", "pt-6", "border-t", "border-slate-200", "dark:border-slate-700"], [1, "bg-purple-50", "dark:bg-purple-900/20", "p-3", "rounded-2xl", "border", "border-purple-100", "dark:border-purple-800/30"], [1, "text-[10px]", "text-purple-700", "dark:text-purple-400", "leading-relaxed", "font-medium"], [1, "fa-solid", "fa-circle-info", "mr-1"], [1, "flex-1", "p-8", "flex", "flex-col", "bg-white", "dark:bg-slate-900"], [1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-xl", "font-black", "text-slate-800", "dark:text-slate-100", "tracking-tight"], [1, "w-8", "h-8", "rounded-full", "hover:bg-slate-100", "dark:hover:bg-slate-800", "flex", "items-center", "justify-center", "text-slate-400", "transition", 3, "click"], [1, "fa-solid", "fa-times"], [1, "flex-1", "space-y-5", "overflow-y-auto", "pr-2", "custom-scrollbar"], [1, "block", "text-xs", "font-bold", "text-slate-500", "dark:text-slate-400", "uppercase", "tracking-wider", "mb-2"], [1, "text-red-500"], [1, "w-full", "px-4", "py-3", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-sm", "font-bold", "text-slate-700", "dark:text-slate-200", "focus:border-purple-500", "focus:ring-4", "focus:ring-purple-500/10", "transition-all", "outline-none", "appearance-none", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], ["type", "date", 1, "w-full", "px-4", "py-3", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-sm", "font-bold", "text-slate-700", "dark:text-slate-200", "focus:border-purple-500", "focus:ring-4", "focus:ring-purple-500/10", "transition-all", "outline-none", 3, "ngModelChange", "ngModel", "max"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "mt-1", "pl-1"], [1, "fa-solid", "fa-calendar-days", "mr-1"], [1, "flex", "items-center", "justify-between", "mb-2"], [1, "block", "text-xs", "font-bold", "text-slate-500", "dark:text-slate-400", "uppercase", "tracking-wider"], ["type", "button", 1, "px-2.5", "py-1", "bg-amber-50", "dark:bg-amber-900/30", "text-amber-700", "dark:text-amber-400", "border", "border-amber-200", "dark:border-amber-700/50", "hover:bg-amber-100", "dark:hover:bg-amber-900/50", "rounded-lg", "text-xs", "font-bold", "transition", "flex", "items-center", "gap-1", "shadow-sm", "active:scale-95"], [1, "relative"], ["type", "number", "min", "0.001", "step", "any", "placeholder", "VD: 5", 1, "w-full", "px-4", "py-3", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-sm", "font-bold", "text-slate-700", "dark:text-slate-200", "focus:border-purple-500", "focus:ring-4", "focus:ring-purple-500/10", "transition-all", "outline-none", "pr-16", 3, "ngModelChange", "ngModel", "max"], [1, "absolute", "right-4", "top-1/2", "-translate-y-1/2", "text-xs", "font-bold", "text-slate-400"], [1, "mt-2", "flex", "items-center", "gap-2", "bg-amber-50/50", "dark:bg-amber-900/10", "p-2.5", "rounded-xl", "border", "border-amber-200/60", "dark:border-amber-800/40"], ["type", "checkbox", "id", "backfillIsDepleted", 1, "w-4", "h-4", "accent-amber-600", "rounded", "cursor-pointer", 3, "ngModelChange", "ngModel"], ["for", "backfillIsDepleted", 1, "text-xs", "font-bold", "text-amber-900", "dark:text-amber-300", "cursor-pointer", "flex", "items-center", "gap-1.5", "select-none"], [1, "fa-solid", "fa-box-archive", "text-amber-500", "text-[11px]"], [1, "text-[10px]", "text-rose-500", "mt-1", "pl-1", "font-bold"], ["rows", "3", "placeholder", "Nh\u1EADp m\u1EE5c \u0111\u00EDch s\u1EED d\u1EE5ng...", 1, "w-full", "px-4", "py-3", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-sm", "font-bold", "text-slate-700", "dark:text-slate-200", "focus:border-purple-500", "focus:ring-4", "focus:ring-purple-500/10", "transition-all", "outline-none", "resize-none", "placeholder-slate-300", 3, "ngModelChange", "ngModel"], [1, "flex", "flex-wrap", "gap-2", "mt-2"], ["type", "button", 1, "px-3", "py-1", "bg-slate-100", "dark:bg-slate-800", "hover:bg-purple-100", "dark:hover:bg-purple-900/40", "text-[10px]", "font-bold", "text-slate-500", "dark:text-slate-400", "hover:text-purple-600", "rounded-lg", "transition", "border", "border-transparent", "hover:border-purple-200", 3, "click"], [1, "flex", "justify-end", "gap-3", "mt-8", "pt-4", "border-t", "border-slate-100", "dark:border-slate-800"], [1, "px-6", "py-3", "text-slate-500", "dark:text-slate-400", "font-bold", "text-sm", "hover:bg-slate-100", "dark:hover:bg-slate-800", "rounded-2xl", "transition", 3, "click"], [1, "px-8", "py-3", "bg-purple-600", "dark:bg-purple-500", "text-white", "font-bold", "text-sm", "rounded-2xl", "hover:bg-purple-700", "dark:hover:bg-purple-600", "shadow-xl", "shadow-purple-200", "dark:shadow-none", "transition", "disabled:opacity-50", "flex", "items-center", "gap-2", 3, "click", "disabled"], [1, "text-sm", "font-bold", "text-slate-500"], [1, "flex", "items-center", "gap-1.5", "mb-1"], [1, "fa-solid", "fa-triangle-exclamation", "text-amber-500", "text-xs"], [1, "text-[10px]", "font-black", "text-amber-700", "dark:text-amber-400", "uppercase", "tracking-wide"], [1, "text-[10px]", "text-amber-700", "dark:text-amber-400", "leading-relaxed"], ["type", "button", 1, "px-2.5", "py-1", "bg-amber-50", "dark:bg-amber-900/30", "text-amber-700", "dark:text-amber-400", "border", "border-amber-200", "dark:border-amber-700/50", "hover:bg-amber-100", "dark:hover:bg-amber-900/50", "rounded-lg", "text-xs", "font-bold", "transition", "flex", "items-center", "gap-1", "shadow-sm", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-angles-up", "text-[10px]"], [1, "fa-solid", "fa-triangle-exclamation", "mr-1"], [1, "fa-solid", "fa-spinner", "fa-spin"], [1, "fa-solid", "fa-pen-to-square", "text-xs"]], template: function StandardsBackfillModalComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, StandardsBackfillModalComponent_Conditional_0_Template, 100, 22, "div", 0);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.isOpen() && ctx.std() ? 0 : -1);
        } }, dependencies: [CommonModule, FormsModule, i1.NgSelectOption, i1.ɵNgSelectMultipleOption, i1.DefaultValueAccessor, i1.NumberValueAccessor, i1.CheckboxControlValueAccessor, i1.SelectControlValueAccessor, i1.NgControlStatus, i1.MinValidator, i1.MaxValidator, i1.NgModel], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StandardsBackfillModalComponent, [{
        type: Component,
        args: [{
                selector: 'app-standards-backfill-modal',
                standalone: true,
                imports: [CommonModule, FormsModule],
                template: `
    @if (isOpen() && std()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
        <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-3xl flex overflow-hidden animate-bounce-in border border-slate-100 dark:border-slate-800">

          <!-- Left: Standard Info Summary -->
          <div class="hidden md:flex w-2/5 bg-slate-50 dark:bg-slate-800/50 p-8 flex-col border-r border-slate-100 dark:border-slate-800">
            <div class="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
              <i class="fa-solid fa-pen-to-square"></i>
            </div>

            <h3 class="text-xl font-black text-slate-800 dark:text-slate-100 leading-tight mb-2 line-clamp-3">{{std()?.name}}</h3>
            <div class="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-6">Nhập bù nhật ký sử dụng</div>

            <div class="space-y-4">
              <div class="flex flex-col">
                <span class="text-[10px] font-bold text-slate-400 uppercase">Số Lô / Lot</span>
                <span class="text-sm font-bold text-slate-700 dark:text-slate-200">{{std()?.lot_number || 'N/A'}}</span>
              </div>
              @if(std()?.internal_id) {
                <div class="flex flex-col">
                  <span class="text-[10px] font-bold text-slate-400 uppercase">Mã quản lý</span>
                  <span class="text-sm font-bold text-slate-500">{{std()?.internal_id}}</span>
                </div>
              }
              <div class="flex flex-col">
                <span class="text-[10px] font-bold text-slate-400 uppercase">Hạn dùng</span>
                <span class="text-sm font-bold" [class]="getExpiryClass(std()?.expiry_date)">{{std()?.expiry_date || 'N/A'}}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] font-bold text-slate-400 uppercase">Tồn kho hiện tại</span>
                <span class="text-lg font-black text-emerald-600 dark:text-emerald-400">{{formatNum(std()?.current_amount ?? 0)}} <span class="text-xs font-bold text-slate-400">{{std()?.unit}}</span></span>
              </div>
              @if(std()?.status === 'IN_USE') {
                <div class="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-700/50">
                  <div class="flex items-center gap-1.5 mb-1">
                    <i class="fa-solid fa-triangle-exclamation text-amber-500 text-xs"></i>
                    <span class="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wide">Đang được mượn</span>
                  </div>
                  <p class="text-[10px] text-amber-700 dark:text-amber-400 leading-relaxed">
                    Chuẩn đang được <strong>{{std()?.current_holder}}</strong> sử dụng. Nhập bù vẫn được cho phép vì đây là hồi ký lịch sử.
                  </p>
                </div>
              }
            </div>

            <div class="mt-auto pt-6 border-t border-slate-200 dark:border-slate-700">
              <div class="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-2xl border border-purple-100 dark:border-purple-800/30">
                <p class="text-[10px] text-purple-700 dark:text-purple-400 leading-relaxed font-medium">
                  <i class="fa-solid fa-circle-info mr-1"></i>
                  Thao tác sẽ ghi nhật ký và trừ tồn kho tương ứng với ngày được nhập. Dữ liệu có thể rollback từ màn hình Lịch sử.
                </p>
              </div>
            </div>
          </div>

          <!-- Right: Backfill Form -->
          <div class="flex-1 p-8 flex flex-col bg-white dark:bg-slate-900">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                Nhập bù nhật ký
              </h3>
              <button (click)="closeModal.emit()" class="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>

            <div class="flex-1 space-y-5 overflow-y-auto pr-2 custom-scrollbar">

              <!-- Người sử dụng -->
              <div>
                <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Người sử dụng <span class="text-red-500">*</span></label>
                <select [ngModel]="userId()" (ngModelChange)="onUserChange($event)"
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none appearance-none">
                  <option value="">-- Chọn người sử dụng --</option>
                  @for (user of userList(); track user.uid) {
                    <option [value]="user.uid">{{user.displayName}} ({{user.email}})</option>
                  }
                </select>
              </div>

              <!-- Ngày sử dụng -->
              <div>
                <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Ngày sử dụng <span class="text-red-500">*</span></label>
                <input type="date"
                  [ngModel]="usageDate()"
                  (ngModelChange)="usageDate.set($event)"
                  [max]="todayStr"
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none">
                <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-1 pl-1">
                  <i class="fa-solid fa-calendar-days mr-1"></i>
                  Ngày có thể nhập ngược (không được sau hôm nay)
                </p>
              </div>

              <!-- Số lượng -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Lượng sử dụng ({{std()?.unit}}) <span class="text-red-500">*</span>
                  </label>
                  @if ((std()?.current_amount ?? 0) > 0) {
                    <button type="button" (click)="fillMaxAmount()"
                      class="px-2.5 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm active:scale-95">
                      <i class="fa-solid fa-angles-up text-[10px]"></i> Tối đa ({{formatNum(std()?.current_amount ?? 0)}} {{std()?.unit}})
                    </button>
                  }
                </div>
                <div class="relative">
                  <input type="number"
                    [ngModel]="amountUsed()"
                    (ngModelChange)="onAmountChange($event)"
                    min="0.001"
                    [max]="std()?.current_amount ?? null"
                    step="any"
                    class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none pr-16"
                    placeholder="VD: 5">
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{{std()?.unit}}</span>
                </div>
                
                <!-- Checkbox đánh dấu hết chuẩn -->
                <div class="mt-2 flex items-center gap-2 bg-amber-50/50 dark:bg-amber-900/10 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-800/40">
                  <input type="checkbox" id="backfillIsDepleted" [ngModel]="isDepleted()" (ngModelChange)="onDepletedChange($event)" class="w-4 h-4 accent-amber-600 rounded cursor-pointer">
                  <label for="backfillIsDepleted" class="text-xs font-bold text-amber-900 dark:text-amber-300 cursor-pointer flex items-center gap-1.5 select-none">
                    <i class="fa-solid fa-box-archive text-amber-500 text-[11px]"></i> Đánh dấu chuẩn đã sử dụng hết (Hết hàng)
                  </label>
                </div>

                @if (amountUsed() && std() && amountUsed()! > (std()?.current_amount ?? 0)) {
                  <p class="text-[10px] text-rose-500 mt-1 pl-1 font-bold">
                    <i class="fa-solid fa-triangle-exclamation mr-1"></i>
                    Vượt quá tồn kho (còn {{formatNum(std()?.current_amount ?? 0)}} {{std()?.unit}})
                  </p>
                }
              </div>

              <!-- Mục đích -->
              <div>
                <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Mục đích sử dụng <span class="text-red-500">*</span></label>
                <textarea [ngModel]="purpose()" (ngModelChange)="purpose.set($event)" rows="3"
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none resize-none placeholder-slate-300"
                  placeholder="Nhập mục đích sử dụng..."></textarea>
                <!-- Quick select chips giống modal gán/mượn chuẩn -->
                <div class="flex flex-wrap gap-2 mt-2">
                  <button type="button" (click)="purpose.set('Pha chuẩn mới')" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-purple-600 rounded-lg transition border border-transparent hover:border-purple-200"># Pha Chuẩn Mới</button>
                  <button type="button" (click)="purpose.set('Kiểm tra định kỳ')" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-purple-600 rounded-lg transition border border-transparent hover:border-purple-200"># Kiểm Tra Định Kỳ</button>
                  <button type="button" (click)="purpose.set('Ngoại kiểm')" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-purple-600 rounded-lg transition border border-transparent hover:border-purple-200"># Ngoại Kiểm</button>
                  <button type="button" (click)="purpose.set('Nghiên cứu phát triển')" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-purple-600 rounded-lg transition border border-transparent hover:border-purple-200"># Nghiên Cứu Phát Triển</button>
                  <button type="button" (click)="purpose.set('Kiểm nghiệm mẫu')" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-purple-600 rounded-lg transition border border-transparent hover:border-purple-200"># Kiểm Nghiệm Mẫu</button>
                </div>
              </div>

            </div>

            <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button (click)="closeModal.emit()" class="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition">Hủy Bỏ</button>
              <button (click)="onConfirm()"
                [disabled]="!canConfirm() || isProcessing()"
                class="px-8 py-3 bg-purple-600 dark:bg-purple-500 text-white font-bold text-sm rounded-2xl hover:bg-purple-700 dark:hover:bg-purple-600 shadow-xl shadow-purple-200 dark:shadow-none transition disabled:opacity-50 flex items-center gap-2">
                @if(isProcessing()) {
                  <i class="fa-solid fa-spinner fa-spin"></i> Đang lưu...
                } @else {
                  <i class="fa-solid fa-pen-to-square text-xs"></i> Ghi nhật ký
                }
              </button>
            </div>
          </div>

        </div>
      </div>
    }
  `
            }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StandardsBackfillModalComponent, { className: "StandardsBackfillModalComponent", filePath: "src/app/features/standards/components/standards-backfill-modal.component.ts", lineNumber: 195 }); })();
//# sourceMappingURL=standards-backfill-modal.component.js.map