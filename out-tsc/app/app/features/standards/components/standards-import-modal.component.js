import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
function StandardsImportDataModalComponent_Conditional_0_Conditional_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 15);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("L\u1ED7i: ", ctx_r1.invalidCount(), "");
} }
function StandardsImportDataModalComponent_Conditional_0_For_52_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 31);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r3 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", item_r3.mode === "UPDATE_SAFE" ? "C\u1EADp nh\u1EADt an to\u00E0n" : "T\u1EA1o m\u1EDBi", " ");
} }
function StandardsImportDataModalComponent_Conditional_0_For_52_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 32);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r3 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(item_r3.errorMessage || "D\u1EEF li\u1EC7u kh\u00F4ng h\u1EE3p l\u1EC7");
} }
function StandardsImportDataModalComponent_Conditional_0_For_52_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 22)(1, "td", 27);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 28);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "td", 29);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "td", 30);
    i0.ɵɵtext(8);
    i0.ɵɵpipe(9, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "td", 28);
    i0.ɵɵtext(11);
    i0.ɵɵpipe(12, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "td", 18);
    i0.ɵɵtemplate(14, StandardsImportDataModalComponent_Conditional_0_For_52_Conditional_14_Template, 2, 1, "span", 31)(15, StandardsImportDataModalComponent_Conditional_0_For_52_Conditional_15_Template, 2, 1, "span", 32);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r3 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("title", item_r3.parsed.name);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(item_r3.parsed.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r3.parsed.lot_number);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r3.raw["Ng\u00E0y nh\u1EADn (G\u1ED1c)"]);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", item_r3.parsed.received_date ? i0.ɵɵpipeBind2(9, 7, item_r3.parsed.received_date, "dd/MM/yyyy") : "---", " ");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", item_r3.parsed.expiry_date ? i0.ɵɵpipeBind2(12, 10, item_r3.parsed.expiry_date, "dd/MM/yyyy") : "---", " ");
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(item_r3.isValid ? 14 : 15);
} }
function StandardsImportDataModalComponent_Conditional_0_Conditional_53_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 23);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("... v\u00E0 ", ctx_r1.data().length - 10, " d\u00F2ng kh\u00E1c.");
} }
function StandardsImportDataModalComponent_Conditional_0_Conditional_58_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 33);
    i0.ɵɵtext(1, " \u0110ang l\u01B0u... ");
} }
function StandardsImportDataModalComponent_Conditional_0_Conditional_59_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 34);
    i0.ɵɵtext(1, " X\u00E1c nh\u1EADn Import ");
} }
function StandardsImportDataModalComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div")(4, "h3", 3);
    i0.ɵɵelement(5, "i", 4);
    i0.ɵɵtext(6, " X\u00E1c Nh\u1EADn Import ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "p", 5);
    i0.ɵɵtext(8, "Vui l\u00F2ng ki\u1EC3m tra k\u1EF9 ng\u00E0y th\u00E1ng tr\u01B0\u1EDBc khi l\u01B0u.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "button", 6);
    i0.ɵɵlistener("click", function StandardsImportDataModalComponent_Conditional_0_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onCancel()); });
    i0.ɵɵelement(10, "i", 7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "div", 8)(12, "div", 9);
    i0.ɵɵelement(13, "i", 10);
    i0.ɵɵelementStart(14, "div")(15, "span", 11);
    i0.ɵɵtext(16, "L\u01B0u \u00FD ng\u00E0y th\u00E1ng:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(17, " H\u1EC7 th\u1ED1ng \u0111ang \u00E9p ki\u1EC3u ng\u00E0y th\u00E1ng theo \u0111\u1ECBnh d\u1EA1ng ");
    i0.ɵɵelementStart(18, "b");
    i0.ɵɵtext(19, "dd/mm/yyyy");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(20, " (Vi\u1EC7t Nam).");
    i0.ɵɵelement(21, "br");
    i0.ɵɵtext(22, " V\u00ED d\u1EE5: Chu\u1ED7i ");
    i0.ɵɵelementStart(23, "b");
    i0.ɵɵtext(24, "05/10/2024");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(25, " s\u1EBD \u0111\u01B0\u1EE3c hi\u1EC3u l\u00E0 ng\u00E0y ");
    i0.ɵɵelementStart(26, "b");
    i0.ɵɵtext(27, "5 th\u00E1ng 10");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(28, ". H\u00E3y ki\u1EC3m tra c\u1ED9t \"K\u1EBFt qu\u1EA3 (H\u1EC7 th\u1ED1ng hi\u1EC3u)\" b\u00EAn d\u01B0\u1EDBi. ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(29, "div", 12)(30, "span", 13);
    i0.ɵɵtext(31);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "span", 14);
    i0.ɵɵtext(33);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(34, StandardsImportDataModalComponent_Conditional_0_Conditional_34_Template, 2, 1, "span", 15);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "table", 16)(36, "thead", 17)(37, "tr")(38, "th", 18);
    i0.ɵɵtext(39, "T\u00EAn ch\u1EA5t chu\u1EA9n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "th", 18);
    i0.ɵɵtext(41, "L\u00F4 (Lot)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(42, "th", 19);
    i0.ɵɵtext(43, "Ng\u00E0y nh\u1EADn (G\u1ED1c)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(44, "th", 20);
    i0.ɵɵtext(45, "K\u1EBFt qu\u1EA3 (H\u1EC7 th\u1ED1ng hi\u1EC3u)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(46, "th", 18);
    i0.ɵɵtext(47, "H\u1EA1n d\u00F9ng (Parsed)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(48, "th", 18);
    i0.ɵɵtext(49, "Tr\u1EA1ng th\u00E1i");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(50, "tbody", 21);
    i0.ɵɵrepeaterCreate(51, StandardsImportDataModalComponent_Conditional_0_For_52_Template, 16, 13, "tr", 22, i0.ɵɵrepeaterTrackByIndex);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(53, StandardsImportDataModalComponent_Conditional_0_Conditional_53_Template, 2, 1, "p", 23);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(54, "div", 24)(55, "button", 25);
    i0.ɵɵlistener("click", function StandardsImportDataModalComponent_Conditional_0_Template_button_click_55_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onCancel()); });
    i0.ɵɵtext(56, "H\u1EE7y B\u1ECF");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(57, "button", 26);
    i0.ɵɵlistener("click", function StandardsImportDataModalComponent_Conditional_0_Template_button_click_57_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onConfirm()); });
    i0.ɵɵtemplate(58, StandardsImportDataModalComponent_Conditional_0_Conditional_58_Template, 2, 0)(59, StandardsImportDataModalComponent_Conditional_0_Conditional_59_Template, 2, 0);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(31);
    i0.ɵɵtextInterpolate1("T\u1ED5ng: ", ctx_r1.data().length, "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("H\u1EE3p l\u1EC7: ", ctx_r1.validCount(), "");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.invalidCount() > 0 ? 34 : -1);
    i0.ɵɵadvance(17);
    i0.ɵɵrepeater(ctx_r1.previewRows());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.data().length > 10 ? 53 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("disabled", ctx_r1.isImporting() || ctx_r1.validCount() === 0);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isImporting() ? 58 : 59);
} }
const _c0 = (a0, a1) => ({ "bg-red-50 dark:bg-red-900/10": a0, "bg-amber-50 dark:bg-amber-900/10": a1 });
function StandardsImportUsageModalComponent_Conditional_0_For_47_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 31);
    i0.ɵɵelement(1, "i", 38);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r3 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" Map: ", item_r3.standard.internal_id || "OK", "");
} }
function StandardsImportUsageModalComponent_Conditional_0_For_47_Conditional_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 35);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r3 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(item_r3.standard.unit);
} }
function StandardsImportUsageModalComponent_Conditional_0_For_47_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 36);
    i0.ɵɵelement(1, "i", 39);
    i0.ɵɵtext(2, " H\u1EE3p l\u1EC7");
    i0.ɵɵelementEnd();
} }
function StandardsImportUsageModalComponent_Conditional_0_For_47_Conditional_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 37);
    i0.ɵɵelement(1, "i", 40);
    i0.ɵɵtext(2, " Tr\u00F9ng l\u1EB7p");
    i0.ɵɵelementEnd();
} }
function StandardsImportUsageModalComponent_Conditional_0_For_47_Conditional_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 41);
    i0.ɵɵelement(1, "i", 42);
    i0.ɵɵtext(2, " L\u1ED7i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 43);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r3 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("title", item_r3.errorMessage);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(item_r3.errorMessage);
} }
function StandardsImportUsageModalComponent_Conditional_0_For_47_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 18)(1, "td", 28);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 15)(4, "div", 29);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 30);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(8, StandardsImportUsageModalComponent_Conditional_0_For_47_Conditional_8_Template, 3, 1, "div", 31);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "td", 32);
    i0.ɵɵtext(10);
    i0.ɵɵelement(11, "br");
    i0.ɵɵelementStart(12, "span", 33);
    i0.ɵɵtext(13);
    i0.ɵɵpipe(14, "date");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "td", 15);
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "td", 34);
    i0.ɵɵtext(18);
    i0.ɵɵtemplate(19, StandardsImportUsageModalComponent_Conditional_0_For_47_Conditional_19_Template, 2, 1, "span", 35);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "td", 15);
    i0.ɵɵtemplate(21, StandardsImportUsageModalComponent_Conditional_0_For_47_Conditional_21_Template, 3, 0, "span", 36)(22, StandardsImportUsageModalComponent_Conditional_0_For_47_Conditional_22_Template, 3, 0, "span", 37)(23, StandardsImportUsageModalComponent_Conditional_0_For_47_Conditional_23_Template, 5, 2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r3 = ctx.$implicit;
    const $index_r4 = ctx.$index;
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction2(15, _c0, !item_r3.isValid, item_r3.isDuplicate));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate($index_r4 + 1);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("title", item_r3.raw["T\u00EAn"]);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(item_r3.raw["T\u00EAn"]);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("L\u00F4: ", item_r3.raw["L\u00F4"], "");
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r3.standard ? 8 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", item_r3.raw["Ng\u00E0y"], " ");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(14, 12, item_r3.log.date, "dd/MM/yyyy"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r3.raw["Ng\u01B0\u1EDDi"]);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", item_r3.raw["L\u01B0\u1EE3ng"], " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r3.standard ? 19 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(item_r3.isValid && !item_r3.isDuplicate ? 21 : item_r3.isDuplicate ? 22 : 23);
} }
function StandardsImportUsageModalComponent_Conditional_0_Conditional_48_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 19);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("... v\u00E0 ", ctx_r1.data().length - 15, " d\u00F2ng kh\u00E1c.");
} }
function StandardsImportUsageModalComponent_Conditional_0_Conditional_64_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 44);
    i0.ɵɵtext(1, " \u0110ang l\u01B0u... ");
} }
function StandardsImportUsageModalComponent_Conditional_0_Conditional_65_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 39);
    i0.ɵɵtext(1, " Import H\u1EE3p l\u1EC7 ");
} }
function StandardsImportUsageModalComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div")(4, "h3", 3);
    i0.ɵɵelement(5, "i", 4);
    i0.ɵɵtext(6, " X\u00E1c Nh\u1EADn Import Nh\u1EADt K\u00FD ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "p", 5);
    i0.ɵɵtext(8, "Vui l\u00F2ng ki\u1EC3m tra d\u1EEF li\u1EC7u tr\u01B0\u1EDBc khi l\u01B0u. C\u00E1c d\u00F2ng l\u1ED7i ho\u1EB7c tr\u00F9ng l\u1EB7p s\u1EBD b\u1ECB b\u1ECF qua.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "button", 6);
    i0.ɵɵlistener("click", function StandardsImportUsageModalComponent_Conditional_0_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onCancel()); });
    i0.ɵɵelement(10, "i", 7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "div", 8)(12, "div", 9);
    i0.ɵɵelement(13, "i", 10);
    i0.ɵɵelementStart(14, "div")(15, "strong");
    i0.ɵɵtext(16, "L\u01B0u \u00FD quan tr\u1ECDng:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "ul", 11)(18, "li");
    i0.ɵɵtext(19, "H\u1EC7 th\u1ED1ng s\u1EBD t\u1EF1 \u0111\u1ED9ng t\u00ECm ki\u1EBFm ch\u1EA5t chu\u1EA9n d\u1EF1a tr\u00EAn ");
    i0.ɵɵelementStart(20, "strong");
    i0.ɵɵtext(21, "S\u1ED1 nh\u1EADn di\u1EC7n");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(22, " ho\u1EB7c ");
    i0.ɵɵelementStart(23, "strong");
    i0.ɵɵtext(24, "T\u00EAn + S\u1ED1 l\u00F4");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(25, ".");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "li");
    i0.ɵɵtext(27, "N\u1EBFu nh\u1EADt k\u00FD (c\u00F9ng ng\u00E0y, ng\u01B0\u1EDDi pha, l\u01B0\u1EE3ng d\u00F9ng) \u0111\u00E3 t\u1ED3n t\u1EA1i, d\u00F2ng \u0111\u00F3 s\u1EBD b\u1ECB b\u1ECF qua (tr\u00F9ng l\u1EB7p).");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "li");
    i0.ɵɵtext(29, "L\u01B0\u1EE3ng d\u00F9ng s\u1EBD \u0111\u01B0\u1EE3c t\u1EF1 \u0111\u1ED9ng tr\u1EEB v\u00E0o t\u1ED3n kho hi\u1EC7n t\u1EA1i c\u1EE7a ch\u1EA5t chu\u1EA9n.");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(30, "table", 12)(31, "thead")(32, "tr", 13)(33, "th", 14);
    i0.ɵɵtext(34, "STT");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "th", 15);
    i0.ɵɵtext(36, "Ch\u1EA5t chu\u1EA9n (Excel)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "th", 15);
    i0.ɵɵtext(38, "Ng\u00E0y pha");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(39, "th", 15);
    i0.ɵɵtext(40, "Ng\u01B0\u1EDDi pha");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(41, "th", 16);
    i0.ɵɵtext(42, "L\u01B0\u1EE3ng d\u00F9ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(43, "th", 15);
    i0.ɵɵtext(44, "Tr\u1EA1ng th\u00E1i");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(45, "tbody", 17);
    i0.ɵɵrepeaterCreate(46, StandardsImportUsageModalComponent_Conditional_0_For_47_Template, 24, 18, "tr", 18, i0.ɵɵrepeaterTrackByIndex);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(48, StandardsImportUsageModalComponent_Conditional_0_Conditional_48_Template, 2, 1, "p", 19);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(49, "div", 20)(50, "div", 21);
    i0.ɵɵtext(51);
    i0.ɵɵelementStart(52, "span", 22);
    i0.ɵɵtext(53);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(54, " | ");
    i0.ɵɵelementStart(55, "span", 23);
    i0.ɵɵtext(56);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(57, " | ");
    i0.ɵɵelementStart(58, "span", 24);
    i0.ɵɵtext(59);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(60, "div", 25)(61, "button", 26);
    i0.ɵɵlistener("click", function StandardsImportUsageModalComponent_Conditional_0_Template_button_click_61_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onCancel()); });
    i0.ɵɵtext(62, "H\u1EE7y B\u1ECF");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(63, "button", 27);
    i0.ɵɵlistener("click", function StandardsImportUsageModalComponent_Conditional_0_Template_button_click_63_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onConfirm()); });
    i0.ɵɵtemplate(64, StandardsImportUsageModalComponent_Conditional_0_Conditional_64_Template, 2, 0)(65, StandardsImportUsageModalComponent_Conditional_0_Conditional_65_Template, 2, 0);
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(46);
    i0.ɵɵrepeater(ctx_r1.data().slice(0, 15));
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.data().length > 15 ? 48 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" T\u1ED5ng: ", ctx_r1.data().length, " | ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("H\u1EE3p l\u1EC7: ", ctx_r1.validCount(), "");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("Tr\u00F9ng: ", ctx_r1.duplicateCount(), "");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("L\u1ED7i: ", ctx_r1.errorCount(), "");
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("disabled", ctx_r1.isImporting() || ctx_r1.validCount() === 0);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isImporting() ? 64 : 65);
} }
export class StandardsImportDataModalComponent {
    constructor() {
        this.data = input([]);
        this.isImporting = input(false);
        this.cancel = output();
        this.confirm = output();
    }
    validCount() { return this.data().filter(item => item.isValid).length; }
    invalidCount() { return this.data().length - this.validCount(); }
    previewRows() {
        return [...this.data()]
            .sort((a, b) => Number(a.isValid) - Number(b.isValid))
            .slice(0, 10);
    }
    onCancel() { this.cancel.emit(); }
    onConfirm() { this.confirm.emit(); }
    static { this.ɵfac = function StandardsImportDataModalComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StandardsImportDataModalComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StandardsImportDataModalComponent, selectors: [["app-standards-import-data-modal"]], inputs: { data: [1, "data"], isImporting: [1, "isImporting"] }, outputs: { cancel: "cancel", confirm: "confirm" }, decls: 1, vars: 1, consts: [[1, "fixed", "inset-0", "z-[80]", "flex", "items-center", "justify-center", "p-4", "bg-black/70", "backdrop-blur-sm", "fade-in"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "shadow-2xl", "w-full", "max-w-7xl", "overflow-hidden", "flex", "flex-col", "max-h-[90vh]", "animate-slide-up"], [1, "px-6", "py-4", "border-b", "border-slate-100", "dark:border-slate-800", "bg-slate-50", "dark:bg-slate-800/50", "flex", "justify-between", "items-center", "shrink-0"], [1, "font-black", "text-slate-800", "dark:text-slate-200", "text-lg", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-file-import", "text-emerald-600", "dark:text-emerald-500"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "mt-1"], [1, "w-8", "h-8", "rounded-full", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "flex", "items-center", "justify-center", "text-slate-400", "dark:text-slate-500", "hover:text-red-500", "dark:hover:text-red-400", "transition", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-times"], [1, "flex-1", "overflow-auto", "custom-scrollbar", "p-6"], [1, "mb-4", "bg-yellow-50", "dark:bg-yellow-900/20", "border", "border-yellow-100", "dark:border-yellow-800/50", "rounded-lg", "p-3", "flex", "gap-3", "text-sm", "text-yellow-800", "dark:text-yellow-500"], [1, "fa-solid", "fa-triangle-exclamation", "mt-0.5"], [1, "font-bold"], [1, "mb-4", "flex", "flex-wrap", "gap-2", "text-xs", "font-bold"], [1, "px-3", "py-1.5", "rounded-full", "bg-slate-100", "dark:bg-slate-800", "text-slate-600", "dark:text-slate-300"], [1, "px-3", "py-1.5", "rounded-full", "bg-emerald-100", "dark:bg-emerald-900/30", "text-emerald-700", "dark:text-emerald-400"], [1, "px-3", "py-1.5", "rounded-full", "bg-red-100", "dark:bg-red-900/30", "text-red-700", "dark:text-red-400"], [1, "w-full", "text-xs", "text-left", "border-collapse", "border", "border-slate-200", "dark:border-slate-700"], [1, "bg-slate-100", "dark:bg-slate-800", "text-slate-500", "dark:text-slate-400", "font-bold", "uppercase", "sticky", "top-0"], [1, "p-2", "border", "border-slate-200", "dark:border-slate-700"], [1, "p-2", "border", "border-slate-200", "dark:border-slate-700", "bg-red-50", "dark:bg-red-900/20", "text-red-700", "dark:text-red-400", "w-32"], [1, "p-2", "border", "border-slate-200", "dark:border-slate-700", "bg-emerald-50", "dark:bg-emerald-900/20", "text-emerald-700", "dark:text-emerald-400", "w-32"], [1, "text-slate-700", "dark:text-slate-300"], [1, "hover:bg-slate-50", "dark:hover:bg-slate-800/50"], [1, "text-center", "text-xs", "text-slate-400", "dark:text-slate-500", "mt-2", "italic"], [1, "px-6", "py-4", "border-t", "border-slate-100", "dark:border-slate-800", "bg-slate-50", "dark:bg-slate-800/50", "flex", "justify-end", "gap-3", "shrink-0"], [1, "px-5", "py-2.5", "text-slate-600", "dark:text-slate-400", "hover:bg-slate-200", "dark:hover:bg-slate-700", "rounded-xl", "font-bold", "text-sm", "transition", 3, "click"], [1, "px-6", "py-2.5", "bg-emerald-600", "dark:bg-emerald-500", "hover:bg-emerald-700", "dark:hover:bg-emerald-600", "text-white", "rounded-xl", "font-bold", "text-sm", "shadow-md", "dark:shadow-none", "transition", "disabled:opacity-50", "flex", "items-center", "gap-2", 3, "click", "disabled"], [1, "p-2", "border", "border-slate-200", "dark:border-slate-700", "break-words", 3, "title"], [1, "p-2", "border", "border-slate-200", "dark:border-slate-700", "font-mono"], [1, "p-2", "border", "border-slate-200", "dark:border-slate-700", "font-mono", "bg-red-50/30", "dark:bg-red-900/10"], [1, "p-2", "border", "border-slate-200", "dark:border-slate-700", "font-bold", "font-mono", "text-emerald-700", "dark:text-emerald-400", "bg-emerald-50/30", "dark:bg-emerald-900/10"], [1, "font-bold", "text-emerald-600", "dark:text-emerald-400"], [1, "font-bold", "text-red-600", "dark:text-red-400"], [1, "fa-solid", "fa-spinner", "fa-spin"], [1, "fa-solid", "fa-check"]], template: function StandardsImportDataModalComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, StandardsImportDataModalComponent_Conditional_0_Template, 60, 6, "div", 0);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.data().length > 0 ? 0 : -1);
        } }, dependencies: [CommonModule, i1.DatePipe], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StandardsImportDataModalComponent, [{
        type: Component,
        args: [{
                selector: 'app-standards-import-data-modal',
                standalone: true,
                imports: [CommonModule],
                template: `
      <!-- IMPORT PREVIEW MODAL -->
      @if (data().length > 0) {
         <div class="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-7xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                
                <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center shrink-0">
                    <div>
                        <h3 class="font-black text-slate-800 dark:text-slate-200 text-lg flex items-center gap-2">
                            <i class="fa-solid fa-file-import text-emerald-600 dark:text-emerald-500"></i> Xác Nhận Import
                        </h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Vui lòng kiểm tra kỹ ngày tháng trước khi lưu.</p>
                    </div>
                    <button (click)="onCancel()" class="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition active:scale-95"><i class="fa-solid fa-times"></i></button>
                </div>

                <div class="flex-1 overflow-auto custom-scrollbar p-6">
                    <div class="mb-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800/50 rounded-lg p-3 flex gap-3 text-sm text-yellow-800 dark:text-yellow-500">
                        <i class="fa-solid fa-triangle-exclamation mt-0.5"></i>
                        <div>
                            <span class="font-bold">Lưu ý ngày tháng:</span> Hệ thống đang ép kiểu ngày tháng theo định dạng <b>dd/mm/yyyy</b> (Việt Nam).<br>
                            Ví dụ: Chuỗi <b>05/10/2024</b> sẽ được hiểu là ngày <b>5 tháng 10</b>. Hãy kiểm tra cột "Kết quả (Hệ thống hiểu)" bên dưới.
                        </div>
                    </div>

                    <div class="mb-4 flex flex-wrap gap-2 text-xs font-bold">
                        <span class="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Tổng: {{data().length}}</span>
                        <span class="px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">Hợp lệ: {{validCount()}}</span>
                        @if (invalidCount() > 0) {
                            <span class="px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">Lỗi: {{invalidCount()}}</span>
                        }
                    </div>

                    <table class="w-full text-xs text-left border-collapse border border-slate-200 dark:border-slate-700">
                        <thead class="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase sticky top-0">
                            <tr>
                                <th class="p-2 border border-slate-200 dark:border-slate-700">Tên chất chuẩn</th>
                                <th class="p-2 border border-slate-200 dark:border-slate-700">Lô (Lot)</th>
                                <th class="p-2 border border-slate-200 dark:border-slate-700 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 w-32">Ngày nhận (Gốc)</th>
                                <th class="p-2 border border-slate-200 dark:border-slate-700 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 w-32">Kết quả (Hệ thống hiểu)</th>
                                <th class="p-2 border border-slate-200 dark:border-slate-700">Hạn dùng (Parsed)</th>
                                <th class="p-2 border border-slate-200 dark:border-slate-700">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody class="text-slate-700 dark:text-slate-300">
                            @for (item of previewRows(); track $index) {
                                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td class="p-2 border border-slate-200 dark:border-slate-700 break-words" [title]="item.parsed.name">{{item.parsed.name}}</td>
                                    <td class="p-2 border border-slate-200 dark:border-slate-700 font-mono">{{item.parsed.lot_number}}</td>
                                    <td class="p-2 border border-slate-200 dark:border-slate-700 font-mono bg-red-50/30 dark:bg-red-900/10">{{item.raw['Ngày nhận (Gốc)']}}</td>
                                    <td class="p-2 border border-slate-200 dark:border-slate-700 font-bold font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-900/10">
                                        {{item.parsed.received_date ? (item.parsed.received_date | date:'dd/MM/yyyy') : '---'}}
                                    </td>
                                    <td class="p-2 border border-slate-200 dark:border-slate-700 font-mono">
                                        {{item.parsed.expiry_date ? (item.parsed.expiry_date | date:'dd/MM/yyyy') : '---'}}
                                    </td>
                                    <td class="p-2 border border-slate-200 dark:border-slate-700">
                                        @if (item.isValid) {
                                            <span class="font-bold text-emerald-600 dark:text-emerald-400">
                                                {{item.mode === 'UPDATE_SAFE' ? 'Cập nhật an toàn' : 'Tạo mới'}}
                                            </span>
                                        } @else {
                                            <span class="font-bold text-red-600 dark:text-red-400">{{item.errorMessage || 'Dữ liệu không hợp lệ'}}</span>
                                        }
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                    @if(data().length > 10) {
                        <p class="text-center text-xs text-slate-400 dark:text-slate-500 mt-2 italic">... và {{data().length - 10}} dòng khác.</p>
                    }
                </div>

                <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 shrink-0">
                    <button (click)="onCancel()" class="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold text-sm transition">Hủy Bỏ</button>
                    <button (click)="onConfirm()" [disabled]="isImporting() || validCount() === 0" class="px-6 py-2.5 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md dark:shadow-none transition disabled:opacity-50 flex items-center gap-2">
                        @if(isImporting()) { <i class="fa-solid fa-spinner fa-spin"></i> Đang lưu... }
                        @else { <i class="fa-solid fa-check"></i> Xác nhận Import }
                    </button>
                </div>
            </div>
         </div>
      }
  `
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StandardsImportDataModalComponent, { className: "StandardsImportDataModalComponent", filePath: "src/app/features/standards/components/standards-import-modal.component.ts", lineNumber: 94 }); })();
export class StandardsImportUsageModalComponent {
    constructor() {
        this.data = input([]);
        this.validCount = input(0);
        this.duplicateCount = input(0);
        this.errorCount = input(0);
        this.isImporting = input(false);
        this.cancel = output();
        this.confirm = output();
    }
    onCancel() { this.cancel.emit(); }
    onConfirm() { this.confirm.emit(); }
    static { this.ɵfac = function StandardsImportUsageModalComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StandardsImportUsageModalComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StandardsImportUsageModalComponent, selectors: [["app-standards-import-usage-modal"]], inputs: { data: [1, "data"], validCount: [1, "validCount"], duplicateCount: [1, "duplicateCount"], errorCount: [1, "errorCount"], isImporting: [1, "isImporting"] }, outputs: { cancel: "cancel", confirm: "confirm" }, decls: 1, vars: 1, consts: [[1, "fixed", "inset-0", "z-[80]", "flex", "items-center", "justify-center", "p-4", "bg-black/70", "backdrop-blur-sm", "fade-in"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "shadow-2xl", "w-full", "max-w-7xl", "overflow-hidden", "flex", "flex-col", "max-h-[90vh]", "animate-slide-up"], [1, "px-6", "py-4", "border-b", "border-slate-100", "dark:border-slate-800", "bg-slate-50", "dark:bg-slate-800/50", "flex", "justify-between", "items-center", "shrink-0"], [1, "font-black", "text-slate-800", "dark:text-slate-200", "text-lg", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-book-open", "text-teal-600", "dark:text-teal-500"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "mt-1"], [1, "w-8", "h-8", "rounded-full", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "flex", "items-center", "justify-center", "text-slate-400", "dark:text-slate-500", "hover:text-red-500", "dark:hover:text-red-400", "transition", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-times"], [1, "flex-1", "overflow-auto", "p-6", "bg-white", "dark:bg-slate-900"], [1, "bg-amber-50", "dark:bg-amber-900/20", "border", "border-amber-200", "dark:border-amber-800/50", "text-amber-800", "dark:text-amber-500", "p-4", "rounded-xl", "text-sm", "flex", "items-start", "gap-3"], [1, "fa-solid", "fa-triangle-exclamation", "mt-0.5", "text-amber-500", "dark:text-amber-400"], [1, "list-disc", "pl-5", "mt-1", "space-y-1", "text-amber-700/80", "dark:text-amber-400/80"], [1, "w-full", "text-sm", "text-left", "mt-4"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "uppercase", "bg-slate-100", "dark:bg-slate-800"], [1, "p-2", "border", "border-slate-200", "dark:border-slate-700", "w-10", "text-center"], [1, "p-2", "border", "border-slate-200", "dark:border-slate-700"], [1, "p-2", "border", "border-slate-200", "dark:border-slate-700", "text-right"], [1, "text-slate-700", "dark:text-slate-300"], [1, "hover:bg-slate-50", "dark:hover:bg-slate-800/50", 3, "ngClass"], [1, "text-center", "text-xs", "text-slate-400", "dark:text-slate-500", "mt-2", "italic"], [1, "px-6", "py-4", "border-t", "border-slate-100", "dark:border-slate-800", "bg-slate-50", "dark:bg-slate-800/50", "flex", "justify-between", "items-center", "shrink-0"], [1, "text-sm", "font-bold", "text-slate-600", "dark:text-slate-400"], [1, "text-emerald-600", "dark:text-emerald-400"], [1, "text-amber-600", "dark:text-amber-400"], [1, "text-red-500", "dark:text-red-400"], [1, "flex", "gap-3"], [1, "px-5", "py-2.5", "text-slate-600", "dark:text-slate-400", "hover:bg-slate-200", "dark:hover:bg-slate-700", "rounded-xl", "font-bold", "text-sm", "transition", 3, "click"], [1, "px-6", "py-2.5", "bg-teal-600", "dark:bg-teal-500", "hover:bg-teal-700", "dark:hover:bg-teal-600", "text-white", "rounded-xl", "font-bold", "text-sm", "shadow-md", "dark:shadow-none", "transition", "disabled:opacity-50", "flex", "items-center", "gap-2", 3, "click", "disabled"], [1, "p-2", "border", "border-slate-200", "dark:border-slate-700", "text-center", "text-slate-400", "dark:text-slate-500"], [1, "font-bold", "text-slate-700", "dark:text-slate-200", "break-words", 3, "title"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "font-mono"], [1, "text-[10px]", "text-emerald-600", "dark:text-emerald-400", "mt-1"], [1, "p-2", "border", "border-slate-200", "dark:border-slate-700", "font-mono"], [1, "text-xs", "text-slate-400", "dark:text-slate-500"], [1, "p-2", "border", "border-slate-200", "dark:border-slate-700", "text-right", "font-mono", "font-bold"], [1, "text-xs", "font-normal", "text-slate-500", "dark:text-slate-400"], [1, "inline-flex", "items-center", "gap-1", "px-2", "py-1", "bg-emerald-100", "dark:bg-emerald-900/30", "text-emerald-700", "dark:text-emerald-400", "rounded", "text-xs", "font-bold"], ["title", "Nh\u1EADt k\u00FD n\u00E0y \u0111\u00E3 c\u00F3 trong h\u1EC7 th\u1ED1ng", 1, "inline-flex", "items-center", "gap-1", "px-2", "py-1", "bg-amber-100", "dark:bg-amber-900/30", "text-amber-700", "dark:text-amber-400", "rounded", "text-xs", "font-bold"], [1, "fa-solid", "fa-check-circle"], [1, "fa-solid", "fa-check"], [1, "fa-solid", "fa-copy"], [1, "inline-flex", "items-center", "gap-1", "px-2", "py-1", "bg-red-100", "dark:bg-red-900/30", "text-red-700", "dark:text-red-400", "rounded", "text-xs", "font-bold", 3, "title"], [1, "fa-solid", "fa-xmark"], [1, "text-[10px]", "text-red-500", "dark:text-red-400", "mt-1"], [1, "fa-solid", "fa-spinner", "fa-spin"]], template: function StandardsImportUsageModalComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, StandardsImportUsageModalComponent_Conditional_0_Template, 66, 7, "div", 0);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.data().length > 0 ? 0 : -1);
        } }, dependencies: [CommonModule, i1.NgClass, i1.DatePipe], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StandardsImportUsageModalComponent, [{
        type: Component,
        args: [{
                selector: 'app-standards-import-usage-modal',
                standalone: true,
                imports: [CommonModule],
                template: `
      <!-- IMPORT USAGE LOG PREVIEW MODAL -->
      @if (data().length > 0) {
         <div class="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-7xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                
                <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center shrink-0">
                    <div>
                        <h3 class="font-black text-slate-800 dark:text-slate-200 text-lg flex items-center gap-2">
                            <i class="fa-solid fa-book-open text-teal-600 dark:text-teal-500"></i> Xác Nhận Import Nhật Ký
                        </h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Vui lòng kiểm tra dữ liệu trước khi lưu. Các dòng lỗi hoặc trùng lặp sẽ bị bỏ qua.</p>
                    </div>
                    <button (click)="onCancel()" class="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition active:scale-95"><i class="fa-solid fa-times"></i></button>
                </div>

                <div class="flex-1 overflow-auto p-6 bg-white dark:bg-slate-900">
                    <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-500 p-4 rounded-xl text-sm flex items-start gap-3">
                        <i class="fa-solid fa-triangle-exclamation mt-0.5 text-amber-500 dark:text-amber-400"></i>
                        <div>
                            <strong>Lưu ý quan trọng:</strong>
                            <ul class="list-disc pl-5 mt-1 space-y-1 text-amber-700/80 dark:text-amber-400/80">
                                <li>Hệ thống sẽ tự động tìm kiếm chất chuẩn dựa trên <strong>Số nhận diện</strong> hoặc <strong>Tên + Số lô</strong>.</li>
                                <li>Nếu nhật ký (cùng ngày, người pha, lượng dùng) đã tồn tại, dòng đó sẽ bị bỏ qua (trùng lặp).</li>
                                <li>Lượng dùng sẽ được tự động trừ vào tồn kho hiện tại của chất chuẩn.</li>
                            </ul>
                        </div>
                    </div>

                    <table class="w-full text-sm text-left mt-4">
                        <thead>
                            <tr class="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-100 dark:bg-slate-800">
                                <th class="p-2 border border-slate-200 dark:border-slate-700 w-10 text-center">STT</th>
                                <th class="p-2 border border-slate-200 dark:border-slate-700">Chất chuẩn (Excel)</th>
                                <th class="p-2 border border-slate-200 dark:border-slate-700">Ngày pha</th>
                                <th class="p-2 border border-slate-200 dark:border-slate-700">Người pha</th>
                                <th class="p-2 border border-slate-200 dark:border-slate-700 text-right">Lượng dùng</th>
                                <th class="p-2 border border-slate-200 dark:border-slate-700">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody class="text-slate-700 dark:text-slate-300">
                            @for (item of data().slice(0, 15); track $index) {
                                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50" [ngClass]="{'bg-red-50 dark:bg-red-900/10': !item.isValid, 'bg-amber-50 dark:bg-amber-900/10': item.isDuplicate}">
                                    <td class="p-2 border border-slate-200 dark:border-slate-700 text-center text-slate-400 dark:text-slate-500">{{$index + 1}}</td>
                                    <td class="p-2 border border-slate-200 dark:border-slate-700">
                                        <div class="font-bold text-slate-700 dark:text-slate-200 break-words" [title]="item.raw['Tên']">{{item.raw['Tên']}}</div>
                                        <div class="text-xs text-slate-500 dark:text-slate-400 font-mono">Lô: {{item.raw['Lô']}}</div>
                                        @if(item.standard) {
                                            <div class="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1"><i class="fa-solid fa-check-circle"></i> Map: {{item.standard.internal_id || 'OK'}}</div>
                                        }
                                    </td>
                                    <td class="p-2 border border-slate-200 dark:border-slate-700 font-mono">{{item.raw['Ngày']}} <br> <span class="text-xs text-slate-400 dark:text-slate-500">{{item.log.date | date:'dd/MM/yyyy'}}</span></td>
                                    <td class="p-2 border border-slate-200 dark:border-slate-700">{{item.raw['Người']}}</td>
                                    <td class="p-2 border border-slate-200 dark:border-slate-700 text-right font-mono font-bold">
                                        {{item.raw['Lượng']}}
                                        @if(item.standard) { <span class="text-xs font-normal text-slate-500 dark:text-slate-400">{{item.standard.unit}}</span> }
                                    </td>
                                    <td class="p-2 border border-slate-200 dark:border-slate-700">
                                        @if(item.isValid && !item.isDuplicate) {
                                            <span class="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded text-xs font-bold"><i class="fa-solid fa-check"></i> Hợp lệ</span>
                                        } @else if (item.isDuplicate) {
                                            <span class="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded text-xs font-bold" title="Nhật ký này đã có trong hệ thống"><i class="fa-solid fa-copy"></i> Trùng lặp</span>
                                        } @else {
                                            <span class="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs font-bold" [title]="item.errorMessage"><i class="fa-solid fa-xmark"></i> Lỗi</span>
                                            <div class="text-[10px] text-red-500 dark:text-red-400 mt-1">{{item.errorMessage}}</div>
                                        }
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                    @if(data().length > 15) {
                        <p class="text-center text-xs text-slate-400 dark:text-slate-500 mt-2 italic">... và {{data().length - 15}} dòng khác.</p>
                    }
                </div>

                <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center shrink-0">
                    <div class="text-sm font-bold text-slate-600 dark:text-slate-400">
                        Tổng: {{data().length}} | 
                        <span class="text-emerald-600 dark:text-emerald-400">Hợp lệ: {{validCount()}}</span> | 
                        <span class="text-amber-600 dark:text-amber-400">Trùng: {{duplicateCount()}}</span> | 
                        <span class="text-red-500 dark:text-red-400">Lỗi: {{errorCount()}}</span>
                    </div>
                    <div class="flex gap-3">
                        <button (click)="onCancel()" class="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold text-sm transition">Hủy Bỏ</button>
                        <button (click)="onConfirm()" [disabled]="isImporting() || validCount() === 0" class="px-6 py-2.5 bg-teal-600 dark:bg-teal-500 hover:bg-teal-700 dark:hover:bg-teal-600 text-white rounded-xl font-bold text-sm shadow-md dark:shadow-none transition disabled:opacity-50 flex items-center gap-2">
                            @if(isImporting()) { <i class="fa-solid fa-spinner fa-spin"></i> Đang lưu... }
                            @else { <i class="fa-solid fa-check"></i> Import Hợp lệ }
                        </button>
                    </div>
                </div>
            </div>
         </div>
      }
  `
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StandardsImportUsageModalComponent, { className: "StandardsImportUsageModalComponent", filePath: "src/app/features/standards/components/standards-import-modal.component.ts", lineNumber: 212 }); })();
//# sourceMappingURL=standards-import-modal.component.js.map