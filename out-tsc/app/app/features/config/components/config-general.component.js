import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../core/services/firebase.service';
import { ToastService } from '../../../core/services/toast.service';
import { StateService } from '../../../core/services/state.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { InventoryService } from '../../inventory/inventory.service';
import { StandardService } from '../../standards/standard.service';
import { collection, getDocs, writeBatch, doc, query, where, onSnapshot, deleteDoc, setDoc, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { NotificationService } from '../../../core/services/notification.service';
import { NotificationCenterService } from '../../../core/services/notification-center.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.id;
function ConfigGeneralComponent_For_51_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 26)(1, "div", 126)(2, "input", 127);
    i0.ɵɵtwoWayListener("ngModelChange", function ConfigGeneralComponent_For_51_Template_input_ngModelChange_2_listener($event) { const cat_r2 = i0.ɵɵrestoreView(_r1).$implicit; i0.ɵɵtwoWayBindingSet(cat_r2.id, $event) || (cat_r2.id = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function ConfigGeneralComponent_For_51_Template_input_ngModelChange_2_listener() { i0.ɵɵrestoreView(_r1); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.onCategoryChange()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "input", 128);
    i0.ɵɵtwoWayListener("ngModelChange", function ConfigGeneralComponent_For_51_Template_input_ngModelChange_3_listener($event) { const cat_r2 = i0.ɵɵrestoreView(_r1).$implicit; i0.ɵɵtwoWayBindingSet(cat_r2.name, $event) || (cat_r2.name = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function ConfigGeneralComponent_For_51_Template_input_ngModelChange_3_listener() { i0.ɵɵrestoreView(_r1); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.onCategoryChange()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "button", 129);
    i0.ɵɵlistener("click", function ConfigGeneralComponent_For_51_Template_button_click_4_listener() { const $index_r4 = i0.ɵɵrestoreView(_r1).$index; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.removeCategory($index_r4)); });
    i0.ɵɵelement(5, "i", 130);
    i0.ɵɵelementStart(6, "span", 131);
    i0.ɵɵtext(7, "X\u00F3a");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const cat_r2 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", cat_r2.id);
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", cat_r2.name);
} }
function ConfigGeneralComponent_For_97_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 134);
} }
function ConfigGeneralComponent_For_97_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 135);
} }
function ConfigGeneralComponent_For_97_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 136);
} }
function ConfigGeneralComponent_For_97_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 139)(1, "a", 142);
    i0.ɵɵelement(2, "i", 41);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r6 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("href", item_r6.actionUrl, i0.ɵɵsanitizeUrl);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", item_r6.actionUrl, "");
} }
function ConfigGeneralComponent_For_97_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 50)(1, "div", 132)(2, "div", 133);
    i0.ɵɵtemplate(3, ConfigGeneralComponent_For_97_Conditional_3_Template, 1, 0, "span", 134)(4, ConfigGeneralComponent_For_97_Conditional_4_Template, 1, 0, "span", 135)(5, ConfigGeneralComponent_For_97_Conditional_5_Template, 1, 0, "span", 136);
    i0.ɵɵelementStart(6, "span", 137);
    i0.ɵɵtext(7);
    i0.ɵɵpipe(8, "date");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "div", 138);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(11, ConfigGeneralComponent_For_97_Conditional_11_Template, 4, 2, "div", 139);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "button", 140);
    i0.ɵɵlistener("click", function ConfigGeneralComponent_For_97_Template_button_click_12_listener() { const item_r6 = i0.ɵɵrestoreView(_r5).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.deleteSystemUpdate(item_r6.id)); });
    i0.ɵɵelement(13, "i", 141);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r6 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(item_r6.type === "success" ? 3 : item_r6.type === "warning" ? 4 : 5);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(8, 4, item_r6.timestamp, "dd/MM/yyyy HH:mm"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r6.content);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r6.actionUrl ? 11 : -1);
} }
function ConfigGeneralComponent_Conditional_98_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 51);
    i0.ɵɵtext(1, "Ch\u01B0a c\u00F3 th\u00F4ng b\u00E1o n\u00E0o.");
    i0.ɵɵelementEnd();
} }
function ConfigGeneralComponent_Conditional_132_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 2)(1, "div", 17)(2, "h3", 3)(3, "div", 119);
    i0.ɵɵelement(4, "i", 143);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(5, " Hi\u1EC3n Th\u1ECB T\u00EDnh N\u0103ng B\u1ECB Kh\u00F3a ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "button", 144);
    i0.ɵɵlistener("click", function ConfigGeneralComponent_Conditional_132_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.saveShowLockedFeaturesConfig()); });
    i0.ɵɵtext(7, "L\u01B0u");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 145)(9, "div")(10, "div", 146);
    i0.ɵɵtext(11, "Ch\u1EBF \u0111\u1ED9 Hi\u1EC3n th\u1ECB Kh\u00F3a \uD83D\uDD12");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "div", 147);
    i0.ɵɵtext(13, "Khi B\u1EACT: M\u1ECDi ng\u01B0\u1EDDi d\u00F9ng s\u1EBD th\u1EA5y to\u00E0n b\u1ED9 menu/t\u00EDnh n\u0103ng v\u1EDBi icon \uD83D\uDD12 thay v\u00EC b\u1ECB \u1EA9n ho\u00E0n to\u00E0n.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "label", 70)(15, "input", 33);
    i0.ɵɵtwoWayListener("ngModelChange", function ConfigGeneralComponent_Conditional_132_Template_input_ngModelChange_15_listener($event) { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.showLockedFeaturesLocal, $event) || (ctx_r2.showLockedFeaturesLocal = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function ConfigGeneralComponent_Conditional_132_Template_input_ngModelChange_15_listener() { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.onShowLockedFeaturesChange()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelement(16, "div", 148);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(15);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.showLockedFeaturesLocal);
} }
function ConfigGeneralComponent_Conditional_159_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 149);
    i0.ɵɵlistener("click", function ConfigGeneralComponent_Conditional_159_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r8); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.clearScheduledTime()); });
    i0.ɵɵtext(1, "H\u1EE7y H\u1EB9n");
    i0.ɵɵelementEnd();
} }
function ConfigGeneralComponent_Conditional_200_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 99)(1, "div", 150);
    i0.ɵɵtext(2, "T\u1ED5ng s\u1ED1 t\u00E0i li\u1EC7u");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 151);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx.totalDocs);
} }
function ConfigGeneralComponent_Conditional_226_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 152);
    i0.ɵɵlistener("click", function ConfigGeneralComponent_Conditional_226_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r9); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.fetchArchiverData()); });
    i0.ɵɵelement(1, "i", 153);
    i0.ɵɵtext(2, " B\u1EAFt \u0110\u1EA7u Tr\u00EDch Xu\u1EA5t ");
    i0.ɵɵelementEnd();
} }
function ConfigGeneralComponent_Conditional_227_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "button", 113);
    i0.ɵɵelement(1, "i", 154);
    i0.ɵɵtext(2, " \u0110ang T\u1EA3i D\u1EEF Li\u1EC7u... ");
    i0.ɵɵelementEnd();
} }
function ConfigGeneralComponent_Conditional_228_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "button", 113);
    i0.ɵɵelement(1, "i", 154);
    i0.ɵɵtext(2, " \u0110ang T\u1EA1o T\u1EC7p Excel... ");
    i0.ɵɵelementEnd();
} }
function ConfigGeneralComponent_Conditional_229_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "button", 114);
    i0.ɵɵelement(1, "i", 154);
    i0.ɵɵtext(2, " \u0110ang D\u1ECDn D\u1EB9p H\u1EC7 Th\u1ED1ng... ");
    i0.ɵɵelementEnd();
} }
function ConfigGeneralComponent_Conditional_230_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "button", 115);
    i0.ɵɵelement(1, "i", 154);
    i0.ɵɵtext(2, " \u0110ang N\u1EA1p L\u1EA1i D\u1EEF Li\u1EC7u... ");
    i0.ɵɵelementEnd();
} }
function ConfigGeneralComponent_Conditional_231_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 116)(1, "p", 155);
    i0.ɵɵtext(2, "\u0110\u00E3 l\u01B0u t\u1EC7p Excel th\u00E0nh c\u00F4ng!");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 156);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 74)(6, "button", 157);
    i0.ɵɵlistener("click", function ConfigGeneralComponent_Conditional_231_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r10); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.cancelArchiver()); });
    i0.ɵɵtext(7, "H\u1EE7y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "button", 158);
    i0.ɵɵlistener("click", function ConfigGeneralComponent_Conditional_231_Template_button_click_8_listener() { i0.ɵɵrestoreView(_r10); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.confirmDeleteArchiver()); });
    i0.ɵɵelement(9, "i", 159);
    i0.ɵɵtext(10, " X\u00F3a V\u0129nh Vi\u1EC5n ");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("S\u1EB5n s\u00E0ng d\u1ECDn d\u1EB9p ", ctx_r2.archiverData().logs.length + ctx_r2.archiverData().requests.length, " b\u1EA3n ghi.");
} }
function ConfigGeneralComponent_Conditional_255_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 154);
    i0.ɵɵtext(1, " \u0110ang ch\u1EA1y migration... ");
} }
function ConfigGeneralComponent_Conditional_256_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 160);
    i0.ɵɵtext(1, " Ch\u1EA1y Migration lastUpdated ");
} }
function ConfigGeneralComponent_Conditional_257_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const line_r12 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(line_r12);
} }
function ConfigGeneralComponent_Conditional_257_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 161);
    i0.ɵɵrepeaterCreate(1, ConfigGeneralComponent_Conditional_257_For_2_Template, 2, 1, "div", null, i0.ɵɵrepeaterTrackByIndex);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "button", 162);
    i0.ɵɵlistener("click", function ConfigGeneralComponent_Conditional_257_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r11); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.migrationLog.set([])); });
    i0.ɵɵtext(4, "X\u00F3a log");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r2.migrationLog());
} }
function ConfigGeneralComponent_Conditional_258_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 173);
    i0.ɵɵelement(1, "i", 189);
    i0.ɵɵelementStart(2, "span", 190);
    i0.ɵɵtext(3, "\u0110ang x\u1EED l\u00FD d\u1EEF li\u1EC7u h\u1EC7 th\u1ED1ng...");
    i0.ɵɵelementEnd()();
} }
function ConfigGeneralComponent_Conditional_258_For_28_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 192);
    i0.ɵɵtext(1, "H\u00F3a ch\u1EA5t trong kho");
    i0.ɵɵelementEnd();
} }
function ConfigGeneralComponent_Conditional_258_For_28_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 193);
    i0.ɵɵtext(1, "Ch\u1EA5t chu\u1EA9n \u0111\u1ED1i chi\u1EBFu");
    i0.ɵɵelementEnd();
} }
function ConfigGeneralComponent_Conditional_258_For_28_Template(rf, ctx) { if (rf & 1) {
    const _r14 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr", 180)(1, "td", 191);
    i0.ɵɵtemplate(2, ConfigGeneralComponent_Conditional_258_For_28_Conditional_2_Template, 2, 0, "span", 192)(3, ConfigGeneralComponent_Conditional_258_For_28_Conditional_3_Template, 2, 0, "span", 193);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "td", 194);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "td", 176)(7, "div", 195);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "td", 196)(10, "button", 197);
    i0.ɵɵlistener("click", function ConfigGeneralComponent_Conditional_258_For_28_Template_button_click_10_listener() { const item_r15 = i0.ɵɵrestoreView(_r14).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.restoreRecycleItem(item_r15)); });
    i0.ɵɵelement(11, "i", 198);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const item_r15 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(item_r15.type === "inventory" ? 2 : 3);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r15.id);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r15.name);
} }
function ConfigGeneralComponent_Conditional_258_Conditional_29_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 199);
    i0.ɵɵelement(2, "i", 200);
    i0.ɵɵtext(3, " Kh\u00F4ng c\u00F3 d\u1EEF li\u1EC7u n\u00E0o trong th\u00F9ng r\u00E1c. ");
    i0.ɵɵelementEnd()();
} }
function ConfigGeneralComponent_Conditional_258_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 125)(1, "div", 163)(2, "div", 164)(3, "div", 165)(4, "div", 166);
    i0.ɵɵelement(5, "i", 167);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div")(7, "h3", 168);
    i0.ɵɵtext(8, "Th\u00F9ng R\u00E1c D\u1EEF Li\u1EC7u");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "p", 169);
    i0.ɵɵtext(10, "Kh\u00F4i ph\u1EE5c thao t\u00E1c l\u1ED7i ho\u1EB7c X\u00F3a v\u0129nh vi\u1EC5n \u0111\u1EC3 l\u00E0m s\u1EA1ch h\u1EC7 th\u1ED1ng.");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(11, "button", 170);
    i0.ɵɵlistener("click", function ConfigGeneralComponent_Conditional_258_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r13); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.showRecycleBin.set(false)); });
    i0.ɵɵelement(12, "i", 171);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "div", 172);
    i0.ɵɵtemplate(14, ConfigGeneralComponent_Conditional_258_Conditional_14_Template, 4, 0, "div", 173);
    i0.ɵɵelementStart(15, "table", 174)(16, "thead", 175)(17, "tr")(18, "th", 176);
    i0.ɵɵtext(19, "Lo\u1EA1i Module");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "th", 176);
    i0.ɵɵtext(21, "M\u00E3 \u0111\u1ECBnh danh");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "th", 177);
    i0.ɵɵtext(23, "T\u00EAn hi\u1EC3n th\u1ECB / Th\u00F4ng tin");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "th", 178);
    i0.ɵɵtext(25, "Thao t\u00E1c");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(26, "tbody", 179);
    i0.ɵɵrepeaterCreate(27, ConfigGeneralComponent_Conditional_258_For_28_Template, 12, 3, "tr", 180, i0.ɵɵrepeaterTrackByIndex);
    i0.ɵɵtemplate(29, ConfigGeneralComponent_Conditional_258_Conditional_29_Template, 4, 0, "tr");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(30, "div", 181)(31, "div", 182);
    i0.ɵɵelement(32, "i", 183);
    i0.ɵɵtext(33, " T\u00EDnh n\u0103ng D\u1ECDn r\u00E1c s\u1EBD ");
    i0.ɵɵelementStart(34, "span", 184);
    i0.ɵɵtext(35, "X\u00D3A V\u0128NH VI\u1EC4N");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(36, " to\u00E0n b\u1ED9 d\u1EEF li\u1EC7u \u1EDF tr\u00EAn kh\u1ECFi \u0111\u00E1m m\u00E2y v\u00E0 y\u00EAu c\u1EA7u c\u00E1c thi\u1EBFt b\u1ECB kh\u00E1c t\u1EA3i l\u1EA1i \u1EE9ng d\u1EE5ng. ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "div", 185)(38, "button", 186);
    i0.ɵɵlistener("click", function ConfigGeneralComponent_Conditional_258_Template_button_click_38_listener() { i0.ɵɵrestoreView(_r13); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.showRecycleBin.set(false)); });
    i0.ɵɵtext(39, "\u0110\u00F3ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "button", 187);
    i0.ɵɵlistener("click", function ConfigGeneralComponent_Conditional_258_Template_button_click_40_listener() { i0.ɵɵrestoreView(_r13); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.emptyRecycleBin()); });
    i0.ɵɵelement(41, "i", 188);
    i0.ɵɵtext(42, " D\u1ECDn R\u00E1c & \u00C9p L\u1EAFp R\u00E1p (Force Sync) ");
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(14);
    i0.ɵɵconditional(ctx_r2.isRecycling() ? 14 : -1);
    i0.ɵɵadvance(13);
    i0.ɵɵrepeater(ctx_r2.recycleItems());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.recycleItems().length === 0 ? 29 : -1);
    i0.ɵɵadvance(11);
    i0.ɵɵproperty("disabled", ctx_r2.recycleItems().length === 0);
} }
export class ConfigGeneralComponent {
    constructor() {
        this.fb = inject(FirebaseService);
        this.state = inject(StateService);
        this.isCategoriesDirty = signal(false);
        this.isPrintConfigDirty = signal(false);
        this.isMaintenanceModeDirty = signal(false);
        this.isShowLockedFeaturesDirty = signal(false);
        this.toast = inject(ToastService);
        this.confirmationService = inject(ConfirmationService);
        this.inventoryService = inject(InventoryService);
        this.standardService = inject(StandardService);
        this.router = inject(Router);
        this.notificationService = inject(NotificationService);
        this.notificationCenter = inject(NotificationCenterService);
        this.versionControl = new FormControl('');
        this.maintenanceModeLocal = signal(false);
        this.maintenanceMessageLocal = new FormControl('');
        this.maintenanceScheduledTimeLocal = new FormControl('');
        this.showLockedFeaturesLocal = signal(false);
        this.categoriesLocal = signal([]);
        this.editingCategory = signal(null);
        this.showCategoryModal = signal(false);
        this.newCategoryName = '';
        this.newCategoryCode = '';
        this.newCategoryDescription = '';
        this.archiverData = signal(null);
        this.archiverStatus = signal('idle');
        this.archiverDays = signal(180);
        this.storageEstimate = signal(null);
        this.printConfig = signal({
            showSignature: true,
            footerText: ''
        });
        this.isRecycling = signal(false);
        this.showRecycleBin = signal(false);
        this.recycleItems = signal([]);
        this.firestoreRulesNotice = 'Rules triển khai được quản lý trong file firestore.rules của mã nguồn. Màn hình Config không còn nhúng hoặc sao chép bản rules để tránh phát tán cấu hình cũ.';
        this.newUpdateContent = '';
        this.newUpdateType = 'info';
        this.newUpdateActionUrl = '';
        this.systemUpdates = signal([]);
        // ─── Migration: Đặt lastUpdated cho legacy docs ─────────────────────────────
        this.isMigrating = signal(false);
        this.migrationLog = signal([]);
        effect(() => {
            const v = this.state.systemVersion();
            if (!this.versionControl.dirty) {
                this.versionControl.setValue(v, { emitEvent: false });
            }
        });
        effect(() => {
            const m = this.state.maintenanceMode();
            if (!this.isMaintenanceModeDirty()) {
                this.maintenanceModeLocal.set(m);
            }
        });
        effect(() => {
            const msg = this.state.maintenanceMessage() || '';
            if (!this.maintenanceMessageLocal.dirty) {
                this.maintenanceMessageLocal.setValue(msg, { emitEvent: false });
            }
        });
        effect(() => {
            const st = this.state.maintenanceScheduledTime() || '';
            if (!this.maintenanceScheduledTimeLocal.dirty) {
                this.maintenanceScheduledTimeLocal.setValue(st, { emitEvent: false });
            }
        });
        effect(() => {
            const s = this.state.showLockedFeatures();
            if (!this.isShowLockedFeaturesDirty()) {
                this.showLockedFeaturesLocal.set(s);
            }
        });
        effect(() => {
            const cats = this.state.categories();
            if (!this.isCategoriesDirty()) {
                this.categoriesLocal.set(JSON.parse(JSON.stringify(cats)));
            }
        });
        effect(() => {
            const cfg = this.state.printConfig();
            if (cfg && !this.isPrintConfigDirty()) {
                this.printConfig.set(JSON.parse(JSON.stringify(cfg)));
            }
        });
    }
    onMaintenanceModeChange() {
        this.isMaintenanceModeDirty.set(true);
    }
    onShowLockedFeaturesChange() {
        this.isShowLockedFeaturesDirty.set(true);
    }
    ngOnInit() {
        this.versionControl.setValue(this.state.systemVersion());
        this.maintenanceModeLocal.set(this.state.maintenanceMode());
        this.maintenanceMessageLocal.setValue(this.state.maintenanceMessage());
        this.maintenanceScheduledTimeLocal.setValue(this.state.maintenanceScheduledTime() || '');
        this.showLockedFeaturesLocal.set(this.state.showLockedFeatures());
        this.categoriesLocal.set(JSON.parse(JSON.stringify(this.state.categories())));
        this.printConfig.set(this.state.printConfig() || {
            showSignature: true,
            footerText: ''
        });
        this.listenSystemUpdates();
    }
    ngOnDestroy() {
        if (this.systemUpdatesSub)
            this.systemUpdatesSub();
    }
    listenSystemUpdates() {
        const updatesRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/system_updates`);
        const q = query(updatesRef, orderBy('timestamp', 'desc'), limit(50));
        this.systemUpdatesSub = onSnapshot(q, (snap) => {
            this.systemUpdates.set(snap.docs.map(d => {
                const data = d.data();
                return {
                    id: d.id,
                    content: data['content'],
                    type: data['type'] || 'info',
                    actionUrl: data['actionUrl'] || '',
                    timestamp: data['timestamp'] ? data['timestamp'].toDate() : new Date()
                };
            }));
        });
    }
    async postSystemUpdate() {
        if (!this.newUpdateContent.trim())
            return;
        const updatesRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/system_updates`);
        const newRef = doc(updatesRef);
        const content = this.newUpdateContent.trim();
        const actionUrl = this.newUpdateActionUrl.trim();
        await setDoc(newRef, {
            content: content,
            type: this.newUpdateType,
            actionUrl: actionUrl,
            timestamp: serverTimestamp()
        });
        // Gửi Broadcast (thông báo đẩy) tới tất cả user
        await this.notificationCenter.publish({
            recipientUid: 'role:all',
            eventId: newRef.id,
            type: 'SYSTEM_UPDATE',
            title: 'Thông báo hệ thống',
            message: content,
            actionUrl: actionUrl,
            channels: ['inbox', 'push']
        });
        this.newUpdateContent = '';
        this.newUpdateActionUrl = '';
        this.toast.show('Đã đăng thông báo hệ thống!');
    }
    async deleteSystemUpdate(id) {
        if (!await this.confirmationService.confirm({
            message: 'Xóa bài đăng này và thu hồi thông báo trong Hộp thư? (Lưu ý: Thông báo đẩy đã phát trên thiết bị không thể thu hồi)',
            confirmText: 'Xóa & Thu hồi',
            isDangerous: true
        }))
            return;
        try {
            await this.notificationCenter.deleteBroadcastByGroupId(id);
        }
        catch (e) {
            console.error('Revoke broadcast error:', e);
            this.toast.show('Không thể thu hồi thông báo qua API. Bài đăng hệ thống CHƯA bị xóa để bạn có thể thử lại.', 'error');
            return;
        }
        try {
            await deleteDoc(doc(this.fb.db, `artifacts/${this.fb.APP_ID}/system_updates/${id}`));
            this.toast.show('Đã xóa bài đăng hệ thống và thu hồi thông báo trong Hộp thư thành công.', 'success');
        }
        catch (e) {
            console.error('deleteDoc error:', e);
            this.toast.show(`Đã thu hồi thông báo Hộp thư nhưng không thể xóa bài đăng khỏi Firestore: ${e?.message || e}`, 'error');
        }
    }
    saveAvatarStyle(event) {
        const style = typeof event === 'string' ? event : event?.target?.value;
        if (style) {
            this.state.saveAvatarStyle(style);
            this.toast.show('Đã cập nhật kiểu avatar.', 'success');
        }
    }
    addCategory() {
        this.isCategoriesDirty.set(true);
        this.categoriesLocal.update(c => [...c, { id: '', name: '' }]);
    }
    removeCategory(index) {
        this.isCategoriesDirty.set(true);
        this.categoriesLocal.update(c => c.filter((_, i) => i !== index));
    }
    onCategoryChange() {
        this.isCategoriesDirty.set(true);
    }
    onPrintConfigChange() {
        this.isPrintConfigDirty.set(true);
    }
    async saveCategories() {
        const validCategories = this.categoriesLocal().filter(c => c.id && c.id.trim() && c.name && c.name.trim());
        if (validCategories.length === 0) {
            this.toast.show('Phân loại không được để trống hoàn toàn.', 'error');
            return;
        }
        await this.state.saveCategoriesConfig(validCategories);
        this.isCategoriesDirty.set(false);
        this.toast.show('Đã cập nhật danh mục phân loại.', 'success');
    }
    async fetchArchiverData() {
        this.archiverStatus.set('fetching');
        try {
            const logs = await this.fb.fetchOldData('logs', this.archiverDays());
            const requests = await this.fb.fetchOldData('requests', this.archiverDays());
            this.archiverData.set({ logs, requests });
            if (logs.length === 0 && requests.length === 0) {
                this.toast.show('Không có dữ liệu cũ nào được tìm thấy.', 'info');
                this.archiverStatus.set('idle');
                return;
            }
            await this.exportArchiverToExcel(logs, requests);
        }
        catch (e) {
            this.toast.show('Lỗi khi tải dữ liệu cũ.', 'error');
            this.archiverStatus.set('idle');
        }
    }
    async exportArchiverToExcel(logs, requests) {
        this.archiverStatus.set('exporting');
        try {
            const XLSX = await this.loadXlsx();
            const wb = XLSX.utils.book_new();
            if (logs.length > 0) {
                const wsLogs = XLSX.utils.json_to_sheet(logs);
                XLSX.utils.book_append_sheet(wb, wsLogs, "Logs");
            }
            if (requests.length > 0) {
                const wsReqs = XLSX.utils.json_to_sheet(requests);
                XLSX.utils.book_append_sheet(wb, wsReqs, "Requests");
            }
            const fileName = `LIMS_Archive_${this.archiverDays()}days_${new Date().getTime()}.xlsx`;
            XLSX.writeFile(wb, fileName);
            this.archiverStatus.set('ready_to_delete');
        }
        catch (e) {
            this.toast.show('Lỗi khi tạo tệp Excel.', 'error');
            this.archiverStatus.set('idle');
        }
    }
    cancelArchiver() {
        this.archiverStatus.set('idle');
        this.archiverData.set({ logs: [], requests: [] });
    }
    async confirmDeleteArchiver() {
        const data = this.archiverData();
        if (!data || (data.logs?.length === 0 && data.requests?.length === 0))
            return;
        const count = (data.logs?.length || 0) + (data.requests?.length || 0);
        if (!await this.confirmationService.confirm({
            message: `CẢNH BÁO: Tác vụ này sẽ XÓA VĨNH VIỄN ${count} bản ghi cũ khỏi Firebase. Bạn CHẮC CHẮN MÌNH ĐÃ TẢI LƯU TRỮ CHƯA?`,
            confirmText: 'XÓA THẬT KỸ',
            isDangerous: true
        }))
            return;
        this.archiverStatus.set('deleting');
        try {
            if (data.logs?.length > 0) {
                await this.fb.deleteDocsInBatch('logs', data.logs.map((d) => d.id));
            }
            if (data.requests?.length > 0) {
                await this.fb.deleteDocsInBatch('requests', data.requests.map((d) => d.id));
            }
            this.toast.show(`Thành công! Đã dọn dẹp ${count} bản ghi cũ rác.`, 'success');
            this.archiverStatus.set('idle');
            this.archiverData.set({ logs: [], requests: [] });
            this.loadUsage();
        }
        catch (e) {
            this.toast.show('Lỗi khi xóa dữ liệu.', 'error');
            this.archiverStatus.set('ready_to_delete');
        }
    }
    async importArchiverData(event) {
        const file = event.target.files[0];
        if (!file)
            return;
        if (!await this.confirmationService.confirm({
            message: `Bạn chuẩn bị khôi phục lại dữ liệu từ File Excel: ${file.name}. Quá trình này sẽ nạp lại các bản ghi cũ lên hệ thống (có thể tốn thời gian). Bạn chắc chắn chứ?`,
            confirmText: 'Bắt đầu Nạp'
        })) {
            event.target.value = '';
            return;
        }
        this.archiverStatus.set('restoring');
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const XLSX = await this.loadXlsx();
                const workbook = XLSX.read(data, { type: 'array' });
                let logsToRestore = [];
                let reqsToRestore = [];
                if (workbook.SheetNames.includes('Logs')) {
                    logsToRestore = XLSX.utils.sheet_to_json(workbook.Sheets['Logs']);
                }
                if (workbook.SheetNames.includes('Requests')) {
                    reqsToRestore = XLSX.utils.sheet_to_json(workbook.Sheets['Requests']);
                }
                if (logsToRestore.length === 0 && reqsToRestore.length === 0) {
                    this.toast.show('Không tìm thấy dữ liệu hợp lệ trong tệp Excel.', 'error');
                    this.archiverStatus.set('idle');
                    return;
                }
                let restoredCount = 0;
                if (logsToRestore.length > 0)
                    restoredCount += await this.fb.restoreArchivedData('logs', logsToRestore);
                if (reqsToRestore.length > 0)
                    restoredCount += await this.fb.restoreArchivedData('requests', reqsToRestore);
                this.toast.show(`Thành công! Đã nạp lại ${restoredCount} bản ghi vào hệ thống.`, 'success');
                this.archiverStatus.set('idle');
                this.loadUsage();
            }
            catch (err) {
                this.toast.show('Lỗi định dạng File Excel.', 'error');
                this.archiverStatus.set('idle');
            }
            finally {
                event.target.value = '';
            }
        };
        reader.onerror = () => {
            this.toast.show('Không thể đọc file.', 'error');
            this.archiverStatus.set('idle');
            event.target.value = '';
        };
        reader.readAsArrayBuffer(file);
    }
    loadXlsx() {
        this.xlsxLoader ??= import('xlsx');
        return this.xlsxLoader;
    }
    async loadUsage() {
        try {
            const estimate = await this.fb.getStorageEstimate();
            this.storageEstimate.set(estimate);
        }
        catch (e) {
            this.toast.show('Lỗi tính dung lượng.', 'error');
        }
    }
    async savePrintConfig() {
        try {
            await this.state.savePrintConfig(this.printConfig());
            this.isPrintConfigDirty.set(false);
            this.toast.show('Đã lưu cấu hình in thành công.', 'success');
        }
        catch (e) {
            this.toast.show(`Không thể lưu cấu hình in: ${e?.message || e}`, 'error');
        }
    }
    async exportData() {
        try {
            const data = await this.fb.exportData();
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `LIMS_Backup_${this.fb.APP_ID}.json`;
            a.click();
            URL.revokeObjectURL(url);
            this.toast.show('Đã tải backup.');
        }
        catch (e) {
            this.toast.show('Backup lỗi', 'error');
        }
    }
    async importData(event) {
        const file = event.target.files[0];
        if (!file)
            return;
        if (await this.confirmationService.confirm({ message: 'Restore sẽ GHI ĐÈ dữ liệu. Tiếp tục?', confirmText: 'Restore', isDangerous: true })) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    await this.fb.importData(JSON.parse(e.target.result));
                    this.toast.show('Restore thành công!', 'success');
                    setTimeout(() => window.location.reload(), 1000);
                }
                catch (err) {
                    this.toast.show('File lỗi', 'error');
                }
            };
            reader.readAsText(file);
        }
    }
    async saveMaintenanceConfig() {
        const msg = this.maintenanceMessageLocal.value || 'Hệ thống đang được bảo trì. Vui lòng quay lại sau ít phút.';
        const scheduledVal = this.maintenanceScheduledTimeLocal.value || null;
        await this.state.saveMaintenanceConfig(this.maintenanceModeLocal(), msg, scheduledVal);
        this.isMaintenanceModeDirty.set(false);
        this.maintenanceMessageLocal.markAsPristine();
        this.maintenanceScheduledTimeLocal.markAsPristine();
        if (this.maintenanceModeLocal()) {
            this.toast.show('Đã BẬT chế độ bảo trì! Người dùng thông thường sẽ bị chặn.', 'info', true);
        }
        else if (scheduledVal) {
            const formatted = new Date(scheduledVal).toLocaleString('vi-VN');
            this.toast.show(`Đã hẹn giờ bảo trì vào lúc ${formatted}`, 'info');
        }
        else {
            this.toast.show('Đã cập nhật cấu hình bảo trì thành công!', 'success');
        }
    }
    async openRecycleBin() {
        this.isRecycling.set(true);
        this.showRecycleBin.set(true);
        this.recycleItems.set([]);
        try {
            const inventoryRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/inventory`);
            const standardsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards`);
            const [invSnap, stdSnap] = await Promise.all([
                getDocs(query(inventoryRef, where('_isDeleted', '==', true))),
                getDocs(query(standardsRef, where('_isDeleted', '==', true)))
            ]);
            const results = [];
            invSnap.forEach((d) => results.push({ type: 'inventory', id: d.id, name: d.data()['name'] || '', lastUpdated: d.data()['lastUpdated'] || null }));
            stdSnap.forEach((d) => results.push({ type: 'standard', id: d.id, name: d.data()['name'] || '', lastUpdated: d.data()['lastUpdated'] || null }));
            results.sort((a, b) => {
                const ta = a.lastUpdated?.toMillis() || 0;
                const tb = b.lastUpdated?.toMillis() || 0;
                return tb - ta;
            });
            this.recycleItems.set(results);
        }
        catch (e) {
            console.error("Lỗi khi tải dữ liệu thùng rác:", e);
            this.toast.show('Không thể tải thùng rác do Firebase từ chối truy vấn. Cần index!', 'error');
        }
        finally {
            this.isRecycling.set(false);
        }
    }
    async saveShowLockedFeaturesConfig() {
        await this.state.saveShowLockedFeaturesConfig(this.showLockedFeaturesLocal());
        this.isShowLockedFeaturesDirty.set(false);
        this.toast.show(this.showLockedFeaturesLocal()
            ? 'Đã BẬT chế độ hiển thị tính năng bị khóa (🔒) cho toàn hệ thống!'
            : 'Đã TẮT chế độ hiển thị tính năng bị khóa (quay lại chế độ ẩn mặc định).', 'info');
    }
    clearScheduledTime() {
        this.maintenanceScheduledTimeLocal.setValue('');
        this.maintenanceScheduledTimeLocal.markAsDirty();
        this.toast.show('Đã xóa thời gian hẹn giờ bảo trì. Nhấn Lưu để áp dụng.', 'info');
    }
    async restoreRecycleItem(item) {
        if (!await this.confirmationService.confirm({ message: `Bạn muốn khôi phục dữ liệu: ${item.name}?`, confirmText: 'Khôi phục' }))
            return;
        this.isRecycling.set(true);
        try {
            if (item.type === 'inventory') {
                await this.inventoryService.restoreItem(item.id);
            }
            else {
                await this.standardService.restoreStandard(item.id, item.name);
            }
            this.toast.show('Đã khôi phục thành công!');
            this.recycleItems.update(list => list.filter(i => i !== item));
            if (item.type === 'inventory')
                await this.fb.updateMetadata('inventory');
            if (item.type === 'standard')
                await this.fb.updateMetadata('standards');
        }
        catch (e) {
            console.error(e);
            this.toast.show('Lỗi khi khôi phục.', 'error');
        }
        finally {
            this.isRecycling.set(false);
        }
    }
    async emptyRecycleBin() {
        if (!await this.confirmationService.confirm({ message: 'Thao tác này là KHÔNG THỂ PHỤC HỒI. Nó gửi lệnh ÉP TOÀN BỘ NHÂN VIÊN phải khởi động lại ứng dụng. Tiếp tục?', confirmText: 'DỌN RÁC NGAY', isDangerous: true }))
            return;
        this.isRecycling.set(true);
        try {
            const BATCH_SIZE = 400;
            let batch = writeBatch(this.fb.db);
            let opCount = 0;
            const items = this.recycleItems();
            for (const item of items) {
                const path = item.type === 'inventory' ? `artifacts/${this.fb.APP_ID}/inventory/${item.id}` : `artifacts/${this.fb.APP_ID}/reference_standards/${item.id}`;
                batch.delete(doc(this.fb.db, path));
                opCount++;
                if (opCount >= BATCH_SIZE) {
                    await batch.commit();
                    batch = writeBatch(this.fb.db);
                    opCount = 0;
                }
            }
            if (opCount > 0)
                await batch.commit();
            await this.fb.adminForceSyncCache();
            this.toast.show('Đã xóa vĩnh viễn rác và phát tín hiệu F5.');
            this.recycleItems.set([]);
            setTimeout(() => this.showRecycleBin.set(false), 500);
        }
        catch (e) {
            console.error(e);
            this.toast.show('Lỗi dọn rác.', 'error');
            this.isRecycling.set(false);
        }
    }
    async runLastUpdatedMigration() {
        if (!await this.confirmationService.confirm({
            message: 'Migration sẽ quét inventory, sops và logs để ghi lastUpdated cho các document cũ chưa có field này. Thao tác này an toàn và idempotent (có thể chạy lại). Tiếp tục?',
            confirmText: 'Chạy Migration'
        }))
            return;
        this.isMigrating.set(true);
        this.migrationLog.set([]);
        const appId = this.fb.APP_ID;
        const BATCH_SIZE = 400;
        const logs = [];
        const addLog = (msg) => {
            logs.push(msg);
            this.migrationLog.set([...logs]);
        };
        try {
            const collectionsToMigrate = [
                { name: 'inventory', path: `artifacts/${appId}/inventory` },
                { name: 'sops', path: `artifacts/${appId}/sops` },
                { name: 'logs', path: `artifacts/${appId}/logs` },
            ];
            for (const col of collectionsToMigrate) {
                addLog(`🔍 Đang quét ${col.name}...`);
                const colRef = collection(this.fb.db, col.path);
                const snap = await getDocs(colRef);
                let batchOps = writeBatch(this.fb.db);
                let opCount = 0;
                let updatedCount = 0;
                for (const docSnap of snap.docs) {
                    const data = docSnap.data();
                    // Idempotent: chỉ migrate docs THỰC SỰ thiếu lastUpdated
                    if (data['lastUpdated'] != null)
                        continue;
                    // Với sops: dùng lastModified làm gốc nếu có, tránh ghi đè thông tin cũ
                    const fallbackTs = data['lastModified'] ?? serverTimestamp();
                    batchOps.update(docSnap.ref, { lastUpdated: fallbackTs });
                    opCount++;
                    updatedCount++;
                    if (opCount >= BATCH_SIZE) {
                        await batchOps.commit();
                        batchOps = writeBatch(this.fb.db);
                        opCount = 0;
                        addLog(`  ✅ Đã commit batch (${updatedCount} docs xử lý...)`);
                    }
                }
                if (opCount > 0)
                    await batchOps.commit();
                addLog(`✅ ${col.name}: ${updatedCount}/${snap.size} docs đã được cập nhật lastUpdated`);
            }
            addLog('🎉 Migration hoàn tất! Hệ thống DeltaSync cursor sẽ hoạt động đúng cho tất cả collections.');
            this.toast.show('Migration lastUpdated hoàn tất!', 'success');
        }
        catch (e) {
            addLog(`❌ Lỗi: ${e?.message || e}`);
            this.toast.show('Lỗi trong quá trình migration.', 'error');
            console.error('[Migration] Error:', e);
        }
        finally {
            this.isMigrating.set(false);
        }
    }
    static { this.ɵfac = function ConfigGeneralComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ConfigGeneralComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ConfigGeneralComponent, selectors: [["app-config-general"]], decls: 259, vars: 26, consts: [[1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-6", "items-start", "animate-fade-in"], [1, "space-y-6"], [1, "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-sm", "dark:shadow-none", "border", "border-slate-200", "dark:border-slate-700", "p-6", "flex", "flex-col", "gap-4"], [1, "font-bold", "text-slate-800", "dark:text-slate-100", "flex", "items-center", "gap-2", "text-base"], [1, "w-8", "h-8", "rounded-lg", "bg-teal-50", "dark:bg-teal-900/20", "text-teal-600", "dark:text-teal-400", "flex", "items-center", "justify-center"], [1, "fa-solid", "fa-layer-group"], [1, "grid", "gap-3"], [1, "w-full", "py-3", "px-4", "border", "border-teal-200", "dark:border-teal-800/30", "bg-teal-50", "dark:bg-teal-900/10", "text-teal-800", "dark:text-teal-300", "rounded-xl", "font-bold", "text-sm", "hover:bg-teal-100", "dark:hover:bg-teal-900/30", "transition", "flex", "items-center", "justify-between", "group", 3, "click"], [1, "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-book-medical"], [1, "fa-solid", "fa-arrow-right", "opacity-50", "group-hover:opacity-100", "transition-opacity"], [1, "w-full", "py-3", "px-4", "border", "border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-900/50", "text-slate-700", "dark:text-slate-300", "rounded-xl", "font-bold", "text-sm", "hover:bg-white", "dark:hover:bg-slate-800", "hover:shadow-sm", "transition", "flex", "items-center", "justify-between", "group", 3, "click"], [1, "fa-solid", "fa-list-check"], [1, "fa-solid", "fa-table-cells", "text-base", "mr-1"], [1, "w-full", "py-3", "px-4", "border", "border-fuchsia-200", "dark:border-fuchsia-800/30", "bg-fuchsia-50", "dark:bg-fuchsia-900/10", "text-fuchsia-800", "dark:text-fuchsia-300", "rounded-xl", "font-bold", "text-sm", "hover:bg-fuchsia-100", "dark:hover:bg-fuchsia-900/30", "transition", "flex", "items-center", "justify-between", "group", 3, "click"], [1, "fa-solid", "fa-tags"], [1, "fa-solid", "fa-microscope", "text-base", "mr-1"], [1, "flex", "justify-between", "items-center"], [1, "w-8", "h-8", "rounded-lg", "bg-blue-50", "dark:bg-blue-900/20", "text-blue-600", "dark:text-blue-400", "flex", "items-center", "justify-center"], [1, "text-xs", "bg-blue-600", "hover:bg-blue-700", "dark:bg-blue-500", "dark:hover:bg-blue-600", "text-white", "px-3", "py-1.5", "rounded-lg", "font-bold", "transition", "shadow-sm", "dark:shadow-none", 3, "click"], [1, "flex", "flex-col", "gap-2"], [1, "flex", "justify-between", "items-center", "mb-1"], [1, "text-[10px]", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase"], [1, "text-[9px]", "bg-slate-100", "dark:bg-slate-700", "hover:bg-slate-200", "dark:hover:bg-slate-600", "text-slate-600", "dark:text-slate-300", "px-2", "py-1", "rounded", "font-bold", "transition", 3, "click"], [1, "text-[10px]", "text-slate-500", "dark:text-slate-400", "mb-2", "italic"], [1, "space-y-2", "border", "border-slate-100", "dark:border-slate-700/50", "rounded-xl", "p-3", "bg-slate-50/50", "dark:bg-slate-900/20"], [1, "flex", "flex-col", "sm:flex-row", "gap-2", "sm:items-center", "group"], [1, "w-8", "h-8", "rounded-lg", "bg-purple-50", "dark:bg-purple-900/20", "text-purple-600", "dark:text-purple-400", "flex", "items-center", "justify-center"], [1, "fa-solid", "fa-print"], [1, "flex", "items-center", "justify-between", "p-3", "bg-slate-50", "dark:bg-slate-900/50", "rounded-xl", "border", "border-slate-100", "dark:border-slate-700/50"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500"], [1, "relative", "inline-flex", "items-center", "cursor-pointer"], ["type", "checkbox", 1, "sr-only", "peer", 3, "ngModelChange", "ngModel"], [1, "w-9", "h-5", "bg-slate-200", "dark:bg-slate-700", "peer-focus:outline-none", "rounded-full", "peer", "peer-checked:after:translate-x-full", "peer-checked:after:border-white", "after:content-['']", "after:absolute", "after:top-[2px]", "after:left-[2px]", "after:bg-white", "after:border-gray-300", "dark:after:border-slate-600", "after:border", "after:rounded-full", "after:h-4", "after:w-4", "after:transition-all", "peer-checked:bg-purple-600", "dark:peer-checked:bg-purple-500"], [1, "text-[10px]", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase", "block", "mb-1"], ["rows", "2", "placeholder", "N\u1ED9i dung ch\u00E2n trang...", 1, "w-full", "border", "border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-900/50", "rounded-xl", "px-3", "py-2", "text-xs", "font-medium", "text-slate-700", "dark:text-slate-300", "focus:bg-white", "dark:focus:bg-slate-800", "focus:border-purple-500", "dark:focus:border-purple-500", "outline-none", "resize-none", "transition", 3, "ngModelChange", "ngModel"], [1, "w-8", "h-8", "rounded-lg", "bg-orange-50", "dark:bg-orange-900/20", "text-orange-600", "dark:text-orange-400", "flex", "items-center", "justify-center"], [1, "fa-solid", "fa-bullhorn"], ["rows", "2", "placeholder", "Nh\u1EADp n\u1ED9i dung th\u00F4ng b\u00E1o m\u1EDBi cho ng\u01B0\u1EDDi d\u00F9ng...", 1, "w-full", "border", "border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-900/50", "rounded-xl", "px-3", "py-2", "text-xs", "font-medium", "text-slate-700", "dark:text-slate-300", "focus:bg-white", "dark:focus:bg-slate-800", "focus:border-orange-500", "outline-none", "resize-none", "transition", 3, "ngModelChange", "ngModel"], [1, "w-7", "h-7", "flex", "shrink-0", "items-center", "justify-center", "rounded-lg", "bg-slate-100", "dark:bg-slate-800", "text-slate-400"], [1, "fa-solid", "fa-link"], ["type", "text", "placeholder", "Link \u0111\u00EDnh k\u00E8m (URL tu\u1EF3 ch\u1ECDn, vd: /reports)...", 1, "flex-1", "border", "border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-900/50", "rounded-lg", "px-3", "py-1.5", "text-xs", "font-medium", "text-slate-700", "dark:text-slate-300", "focus:bg-white", "dark:focus:bg-slate-800", "focus:border-orange-500", "outline-none", "transition", 3, "ngModelChange", "ngModel"], [1, "flex", "gap-2", "items-center", "justify-between"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-600", "rounded-lg", "px-2", "py-1", "outline-none", "focus:border-orange-500", "cursor-pointer", 3, "ngModelChange", "ngModel"], ["value", "info"], ["value", "success"], ["value", "warning"], [1, "text-xs", "bg-orange-600", "hover:bg-orange-700", "text-white", "px-4", "py-1.5", "rounded-lg", "font-bold", "transition", "shadow-sm", "disabled:opacity-50", 3, "click", "disabled"], [1, "space-y-2", "mt-2", "max-h-[250px]", "overflow-y-auto", "custom-scrollbar", "border-t", "border-slate-100", "dark:border-slate-700/50", "pt-2"], [1, "flex", "items-start", "justify-between", "gap-2", "p-3", "rounded-xl", "bg-slate-50", "dark:bg-slate-900/50", "border", "border-slate-100", "dark:border-slate-700/50"], [1, "text-center", "text-slate-400", "dark:text-slate-500", "text-xs", "italic", "py-4"], [1, "fa-solid", "fa-sliders"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-600", "rounded-lg", "px-2", "py-1", "outline-none", "focus:border-blue-500", "dark:focus:border-blue-500", "cursor-pointer", 3, "ngModelChange", "ngModel"], ["value", "google"], ["value", "bottts-neutral"], ["value", "fun-emoji"], ["value", "micah"], ["value", "notionists"], ["value", "initials"], [1, "flex", "items-center", "justify-between", "border", "border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-900/50", "rounded-lg", "px-3", "py-2", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300"], [1, "font-mono", "text-blue-600", "dark:text-blue-400"], [1, "text-[10px]", "text-slate-400", "font-normal"], [1, "font-bold", "text-rose-600", "dark:text-rose-400", "flex", "items-center", "gap-2", "text-base"], [1, "w-8", "h-8", "rounded-lg", "bg-rose-50", "dark:bg-rose-900/20", "text-rose-600", "dark:text-rose-400", "flex", "items-center", "justify-center"], [1, "fa-solid", "fa-person-digging"], [1, "text-xs", "bg-rose-600", "hover:bg-rose-700", "text-white", "px-3", "py-1.5", "rounded-lg", "font-bold", "transition", "shadow-sm", "dark:shadow-none", 3, "click"], [1, "flex", "items-center", "justify-between", "p-3", "bg-rose-50/50", "dark:bg-rose-900/10", "rounded-xl", "border", "border-rose-100", "dark:border-rose-900/30"], [1, "text-xs", "font-bold", "text-rose-700", "dark:text-rose-400"], [1, "text-[10px]", "text-rose-600/80", "dark:text-rose-500/80", "mt-0.5", "max-w-[200px]"], [1, "relative", "inline-flex", "items-center", "cursor-pointer", "shrink-0"], [1, "w-9", "h-5", "bg-slate-200", "dark:bg-slate-700", "peer-focus:outline-none", "rounded-full", "peer", "peer-checked:after:translate-x-full", "peer-checked:after:border-white", "after:content-['']", "after:absolute", "after:top-[2px]", "after:left-[2px]", "after:bg-white", "after:border-gray-300", "dark:after:border-slate-600", "after:border", "after:rounded-full", "after:h-4", "after:w-4", "after:transition-all", "peer-checked:bg-rose-600", "dark:peer-checked:bg-rose-500"], ["rows", "2", "placeholder", "Nh\u1EADp n\u1ED9i dung b\u1EA3o tr\u00EC...", 1, "w-full", "border", "border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-900/50", "rounded-xl", "px-3", "py-2", "text-xs", "font-medium", "text-slate-700", "dark:text-slate-300", "focus:bg-white", "dark:focus:bg-slate-800", "focus:border-rose-500", "dark:focus:border-rose-500", "outline-none", "resize-none", "transition", 3, "formControl"], [1, "border-t", "border-slate-100", "dark:border-slate-700/50", "pt-3"], [1, "flex", "gap-2"], ["type", "datetime-local", 1, "flex-1", "bg-slate-50", "dark:bg-slate-900/50", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "px-3", "py-1.5", "text-xs", "font-medium", "text-slate-700", "dark:text-slate-300", "outline-none", "focus:bg-white", "dark:focus:bg-slate-800", "focus:border-rose-500", "transition", "cursor-pointer", 3, "formControl"], [1, "text-xs", "bg-slate-100", "hover:bg-slate-200", "dark:bg-slate-700", "dark:hover:bg-slate-600", "text-slate-600", "dark:text-slate-300", "px-3", "py-1.5", "rounded-lg", "font-bold", "transition"], [1, "text-[9px]", "text-slate-400", "dark:text-slate-500", "mt-1", "italic"], [1, "w-8", "h-8", "rounded-lg", "bg-gray-50", "dark:bg-slate-700", "text-gray-600", "dark:text-slate-300", "flex", "items-center", "justify-center"], [1, "fa-solid", "fa-shield-cat"], [1, "grid", "grid-cols-2", "gap-2"], [1, "p-2", "border", "border-slate-200", "dark:border-slate-600", "rounded-lg", "hover:bg-slate-50", "dark:hover:bg-slate-700/50", "flex", "items-center", "justify-center", "gap-2", "text-xs", "font-bold", "text-slate-600", "dark:text-slate-300", "transition", 3, "click"], [1, "fa-solid", "fa-download"], [1, "p-2", "border", "border-slate-200", "dark:border-slate-600", "rounded-lg", "hover:bg-slate-50", "dark:hover:bg-slate-700/50", "flex", "items-center", "justify-center", "gap-2", "text-xs", "font-bold", "text-slate-600", "dark:text-slate-300", "transition", "cursor-pointer"], [1, "fa-solid", "fa-upload"], ["type", "file", "accept", ".json", 1, "hidden", 3, "change"], [1, "relative", "mt-2", "rounded-xl", "border", "border-amber-200", "dark:border-amber-900/50", "bg-amber-50", "dark:bg-amber-950/20", "p-3"], [1, "text-[10px]", "font-bold", "text-amber-700", "dark:text-amber-400", "uppercase", "mb-1"], [1, "text-[10px]", "leading-relaxed", "text-amber-700/80", "dark:text-amber-300/80"], [1, "mt-4", "pt-4", "border-t", "border-slate-100", "dark:border-slate-700"], [1, "flex", "flex-col", "gap-2", "p-4", "bg-rose-50", "dark:bg-rose-900/10", "border", "border-rose-100", "dark:border-rose-900/30", "rounded-xl"], [1, "text-[11px]", "font-bold", "text-rose-700", "dark:text-rose-400", "flex", "items-center", "gap-2", "uppercase", "tracking-wide"], [1, "fa-solid", "fa-trash-can-arrow-up"], [1, "text-[10px]", "text-rose-600/70", "dark:text-rose-400/80", "mt-1"], [1, "bg-white", "dark:bg-slate-800", "border", "border-rose-200", "dark:border-rose-800", "text-rose-600", "dark:text-rose-400", "px-3", "py-1.5", "rounded-lg", "text-xs", "font-bold", "hover:bg-rose-100", "dark:hover:bg-rose-800", "transition", "shadow-sm", 3, "click"], [1, "w-8", "h-8", "rounded-lg", "bg-emerald-50", "dark:bg-emerald-900/20", "text-emerald-600", "dark:text-emerald-400", "flex", "items-center", "justify-center"], [1, "fa-solid", "fa-hard-drive"], [1, "text-xs", "bg-slate-100", "dark:bg-slate-700", "hover:bg-slate-200", "dark:hover:bg-slate-600", "px-2", "py-1", "rounded", "text-slate-600", "dark:text-slate-300", 3, "click"], [1, "fa-solid", "fa-rotate"], [1, "flex", "justify-between", "items-center", "bg-slate-50", "dark:bg-slate-900/50", "p-3", "rounded-xl", "border", "border-slate-100", "dark:border-slate-700/50"], [1, "bg-rose-50", "dark:bg-rose-900/10", "rounded-2xl", "border", "border-rose-200", "dark:border-rose-900/30", "p-6", "flex", "flex-col", "gap-4"], [1, "flex", "justify-between", "items-start"], [1, "font-bold", "text-rose-800", "dark:text-rose-400", "flex", "items-center", "gap-2", "text-base"], [1, "w-8", "h-8", "rounded-lg", "bg-rose-100", "dark:bg-rose-900/50", "text-rose-600", "dark:text-rose-300", "flex", "items-center", "justify-center"], [1, "fa-solid", "fa-boxes-packing"], [1, "text-[10px]", "text-rose-600/80", "dark:text-rose-400/80", "mt-1"], [1, "text-[10px]", "bg-white", "dark:bg-slate-800", "hover:bg-slate-50", "dark:hover:bg-slate-700", "text-slate-600", "dark:text-slate-300", "px-3", "py-1.5", "rounded-lg", "border", "border-slate-200", "dark:border-slate-700", "font-bold", "transition", "flex", "items-center", "gap-2", "cursor-pointer", "shadow-sm"], [1, "fa-solid", "fa-cloud-arrow-up", "text-blue-500"], ["type", "file", "accept", ".xlsx", 1, "hidden", 3, "change"], [1, "text-xs", "font-bold", "text-slate-600", "dark:text-slate-400"], [1, "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "px-2", "py-1", "text-xs", "font-bold", "outline-none", "cursor-pointer", 3, "ngModelChange", "ngModel"], [3, "value"], [1, "w-full", "py-2", "bg-slate-800", "dark:bg-slate-700", "hover:bg-slate-900", "dark:hover:bg-slate-600", "text-white", "rounded-xl", "text-xs", "font-bold", "transition", "flex", "items-center", "justify-center", "gap-2"], ["disabled", "", 1, "w-full", "py-2", "bg-slate-300", "dark:bg-slate-800", "text-slate-500", "rounded-xl", "text-xs", "font-bold", "flex", "items-center", "justify-center", "gap-2", "cursor-wait"], ["disabled", "", 1, "w-full", "py-2", "bg-red-300", "dark:bg-red-900/50", "text-white", "rounded-xl", "text-xs", "font-bold", "flex", "items-center", "justify-center", "gap-2", "cursor-wait"], ["disabled", "", 1, "w-full", "py-2", "bg-blue-300", "dark:bg-blue-900/50", "text-white", "rounded-xl", "text-xs", "font-bold", "flex", "items-center", "justify-center", "gap-2", "cursor-wait"], [1, "bg-white", "dark:bg-slate-800", "rounded-xl", "p-3", "border", "border-rose-200", "dark:border-rose-900/50", "text-center"], [1, "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-sm", "dark:shadow-none", "border", "border-amber-200", "dark:border-amber-900/40", "p-6", "flex", "flex-col", "gap-4", "mt-6"], [1, "flex", "items-center", "justify-between"], [1, "w-8", "h-8", "rounded-lg", "bg-amber-50", "dark:bg-amber-900/20", "text-amber-600", "dark:text-amber-400", "flex", "items-center", "justify-center"], [1, "fa-solid", "fa-database"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "font-bold", "bg-slate-100", "dark:bg-slate-700", "px-2", "py-1", "rounded"], [1, "text-xs", "text-slate-500", "dark:text-slate-400"], [1, "font-mono", "bg-slate-100", "dark:bg-slate-700", "px-1", "rounded"], [1, "w-full", "py-2.5", "bg-amber-600", "hover:bg-amber-700", "disabled:opacity-50", "disabled:cursor-wait", "text-white", "rounded-xl", "text-sm", "font-bold", "transition", "flex", "items-center", "justify-center", "gap-2", "shadow-sm", 3, "click", "disabled"], [1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "p-4", "sm:p-6", "bg-slate-900/40", "dark:bg-slate-900/60", "backdrop-blur-sm", "animate-fade-in", 2, "z-index", "100"], [1, "flex", "gap-2", "flex-1"], ["placeholder", "ID (VD: reagent)", 1, "w-1/3", "min-w-0", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-600", "rounded", "px-2", "py-2", "sm:py-1", "text-xs", "font-mono", "font-bold", "text-slate-600", "dark:text-slate-400", "outline-none", "focus:border-blue-400", "dark:focus:border-blue-500", "transition", "shadow-sm", "sm:shadow-none", 3, "ngModelChange", "ngModel"], ["placeholder", "T\u00EAn hi\u1EC3n th\u1ECB (v\u00ED d\u1EE5: H\u00F3a ch\u1EA5t)", 1, "flex-1", "min-w-0", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-600", "rounded", "px-2", "py-2", "sm:py-1", "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200", "outline-none", "focus:border-blue-400", "dark:focus:border-blue-500", "transition", "shadow-sm", "sm:shadow-none", 3, "ngModelChange", "ngModel"], [1, "w-full", "sm:w-6", "h-8", "sm:h-6", "shrink-0", "flex", "items-center", "justify-center", "text-slate-400", "dark:text-slate-500", "sm:text-slate-300", "sm:dark:text-slate-600", "hover:text-red-500", "hover:bg-red-50", "dark:hover:text-red-400", "transition", "sm:rounded-full", "sm:hover:bg-slate-100", "sm:dark:hover:bg-slate-700", "border", "border-slate-200", "sm:border-transparent", "dark:border-slate-600", "bg-white", "sm:bg-transparent", "dark:bg-slate-800", "rounded", "shadow-sm", "sm:shadow-none", 3, "click"], [1, "fa-solid", "fa-trash", "text-[10px]", "sm:text-[10px]"], [1, "sm:hidden", "ml-2", "text-xs", "font-bold"], [1, "flex-1", "min-w-0"], [1, "flex", "items-center", "gap-2", "mb-1"], [1, "w-2", "h-2", "rounded-full", "bg-emerald-500"], [1, "w-2", "h-2", "rounded-full", "bg-orange-500"], [1, "w-2", "h-2", "rounded-full", "bg-blue-500"], [1, "text-[10px]", "text-slate-400", "font-bold"], [1, "text-xs", "text-slate-700", "dark:text-slate-300", "whitespace-pre-wrap", "leading-relaxed"], [1, "mt-1"], [1, "text-slate-400", "hover:text-red-500", "transition", "p-1", "hover:bg-red-50", "rounded", 3, "click"], [1, "fa-solid", "fa-trash", "text-[10px]"], ["target", "_blank", "rel", "noopener noreferrer", 1, "text-[10px]", "font-bold", "text-blue-500", "hover:text-blue-600", "transition", "flex", "items-center", "gap-1", 3, "href"], [1, "fa-solid", "fa-lock"], [1, "text-xs", "bg-amber-600", "hover:bg-amber-700", "text-white", "px-3", "py-1.5", "rounded-lg", "font-bold", "transition", "shadow-sm", "dark:shadow-none", 3, "click"], [1, "flex", "items-center", "justify-between", "p-3", "bg-amber-50/50", "dark:bg-amber-900/10", "rounded-xl", "border", "border-amber-100", "dark:border-amber-900/30"], [1, "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200"], [1, "text-[10px]", "text-slate-500", "dark:text-slate-400", "mt-0.5", "max-w-[240px]"], [1, "w-9", "h-5", "bg-slate-200", "dark:bg-slate-700", "peer-focus:outline-none", "rounded-full", "peer", "peer-checked:after:translate-x-full", "peer-checked:after:border-white", "after:content-['']", "after:absolute", "after:top-[2px]", "after:left-[2px]", "after:bg-white", "after:border-gray-300", "dark:after:border-slate-600", "after:border", "after:rounded-full", "after:h-4", "after:w-4", "after:transition-all", "peer-checked:bg-amber-500", "dark:peer-checked:bg-amber-500"], [1, "text-xs", "bg-slate-100", "hover:bg-slate-200", "dark:bg-slate-700", "dark:hover:bg-slate-600", "text-slate-600", "dark:text-slate-300", "px-3", "py-1.5", "rounded-lg", "font-bold", "transition", 3, "click"], [1, "text-xs", "font-bold", "text-slate-500", "dark:text-slate-400"], [1, "text-sm", "font-black", "text-slate-800", "dark:text-slate-100"], [1, "w-full", "py-2", "bg-slate-800", "dark:bg-slate-700", "hover:bg-slate-900", "dark:hover:bg-slate-600", "text-white", "rounded-xl", "text-xs", "font-bold", "transition", "flex", "items-center", "justify-center", "gap-2", 3, "click"], [1, "fa-solid", "fa-file-excel", "text-green-400"], [1, "fa-solid", "fa-spinner", "fa-spin"], [1, "text-xs", "font-bold", "text-green-600", "dark:text-green-400", "mb-2"], [1, "text-[10px]", "text-slate-500", "dark:text-slate-400", "mb-3"], [1, "flex-1", "py-2", "bg-slate-100", "dark:bg-slate-700", "text-slate-600", "dark:text-slate-300", "rounded-lg", "text-xs", "font-bold", "hover:bg-slate-200", "dark:hover:bg-slate-600", "transition", 3, "click"], [1, "flex-1", "py-2", "bg-red-500", "hover:bg-red-600", "text-white", "rounded-lg", "text-xs", "font-bold", "transition", "flex", "items-center", "justify-center", "gap-2", 3, "click"], [1, "fa-solid", "fa-trash-can"], [1, "fa-solid", "fa-wand-magic-sparkles"], [1, "bg-slate-900", "dark:bg-slate-950", "rounded-xl", "p-4", "font-mono", "text-[11px]", "text-slate-300", "max-h-48", "overflow-y-auto", "flex", "flex-col", "gap-1"], [1, "text-xs", "text-slate-400", "hover:text-slate-600", "dark:hover:text-slate-300", "transition", "self-end", 3, "click"], [1, "bg-white", "dark:bg-slate-800", "rounded-3xl", "shadow-xl", "border", "border-slate-200", "dark:border-slate-700", "w-full", "max-w-4xl", "overflow-hidden", "flex", "flex-col", "max-h-[90vh]"], [1, "px-6", "py-4", "border-b", "border-rose-100", "dark:border-rose-900/30", "flex", "justify-between", "items-center", "bg-rose-50/50", "dark:bg-rose-900/10"], [1, "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-full", "bg-rose-100", "dark:bg-rose-900/40", "text-rose-600", "dark:text-rose-400", "flex", "items-center", "justify-center", "border", "border-rose-200", "dark:border-rose-800/50"], [1, "fa-solid", "fa-trash-can-arrow-up", "text-lg"], [1, "text-base", "font-black", "text-rose-800", "dark:text-rose-300"], [1, "text-[10px]", "font-bold", "text-rose-500/80", "dark:text-rose-400/80"], [1, "w-8", "h-8", "flex", "items-center", "justify-center", "text-slate-400", "hover:text-red-500", "hover:bg-red-50", "dark:hover:bg-red-900/20", "rounded-full", "transition", 3, "click"], [1, "fa-solid", "fa-xmark"], [1, "p-6", "overflow-y-auto", "custom-scrollbar", "flex-1", "relative", "bg-slate-50/30", "dark:bg-slate-900/20"], [1, "absolute", "inset-0", "z-10", "bg-white/50", "dark:bg-slate-900/50", "backdrop-blur-sm", "flex", "flex-col", "items-center", "justify-center", "text-rose-600", "dark:text-rose-400"], [1, "w-full", "text-sm", "text-left", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "overflow-hidden", "shadow-sm"], [1, "bg-slate-100", "dark:bg-slate-800/50", "text-[10px]", "font-bold", "text-slate-600", "dark:text-slate-400", "uppercase", "tracking-widest"], [1, "px-4", "py-3"], [1, "px-4", "py-3", "text-center"], [1, "px-4", "py-3", "text-center", "w-32"], [1, "divide-y", "divide-slate-100", "dark:divide-slate-700", "bg-white", "dark:bg-slate-800", "border-t", "border-slate-200", "dark:border-slate-700"], [1, "hover:bg-slate-50", "dark:hover:bg-slate-700/50", "transition"], [1, "px-6", "py-4", "border-t", "border-slate-100", "dark:border-slate-700", "bg-slate-50/50", "dark:bg-slate-900/50", "flex", "flex-col", "md:flex-row", "justify-between", "gap-4", "items-center"], [1, "text-[10px]", "text-slate-500", "dark:text-slate-400", "font-bold", "md:w-1/2", "leading-relaxed"], [1, "fa-solid", "fa-triangle-exclamation", "text-orange-500", "mr-1"], [1, "text-rose-500"], [1, "flex", "gap-2", "w-full", "md:w-auto", "shrink-0"], [1, "flex-1", "md:flex-none", "px-4", "py-2", "bg-white", "dark:bg-slate-800", "text-xs", "font-bold", "text-slate-600", "dark:text-slate-400", "hover:text-slate-800", "dark:hover:text-slate-200", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "transition", "shadow-sm", 3, "click"], [1, "flex-1", "md:flex-none", "px-6", "py-2", "bg-rose-600", "hover:bg-rose-700", "disabled:opacity-50", "text-white", "rounded-xl", "text-xs", "font-bold", "shadow-sm", "transition", "flex", "items-center", "justify-center", "gap-2", 3, "click", "disabled"], [1, "fa-solid", "fa-fire"], [1, "fa-solid", "fa-circle-notch", "fa-spin", "text-4xl", "mb-3"], [1, "text-sm", "font-bold"], [1, "px-4", "py-3", "align-middle", "font-bold", "text-[10px]"], [1, "px-2", "py-1", "bg-blue-100", "dark:bg-blue-900/30", "text-blue-700", "dark:text-blue-400", "rounded-md"], [1, "px-2", "py-1", "bg-indigo-100", "dark:bg-indigo-900/30", "text-indigo-700", "dark:text-indigo-400", "rounded-md"], [1, "px-4", "py-3", "font-mono", "text-[10px]", "font-bold", "text-slate-600", "dark:text-slate-400"], [1, "text-xs", "font-bold", "text-slate-800", "dark:text-slate-200", "text-center"], [1, "px-4", "py-3", "justify-center", "flex", "gap-2"], ["title", "Kh\u00F4i ph\u1EE5c (Restore)", 1, "w-8", "h-8", "rounded", "bg-teal-50", "dark:bg-teal-900/20", "text-teal-600", "dark:text-teal-400", "hover:bg-teal-600", "hover:text-white", "transition", "flex", "items-center", "justify-center", "font-bold", "shadow-sm", 3, "click"], [1, "fa-solid", "fa-rotate-left"], ["colspan", "4", 1, "p-12", "text-center", "text-slate-400", "dark:text-slate-500", "italic", "text-sm"], [1, "fa-solid", "fa-leaf", "text-2xl", "text-emerald-400", "mb-3", "block", "opacity-80"]], template: function ConfigGeneralComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h3", 3)(4, "div", 4);
            i0.ɵɵelement(5, "i", 5);
            i0.ɵɵelementEnd();
            i0.ɵɵtext(6, " Danh M\u1EE5c D\u1EEF Li\u1EC7u G\u1ED1c ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "div", 6)(8, "button", 7);
            i0.ɵɵlistener("click", function ConfigGeneralComponent_Template_button_click_8_listener() { return ctx.router.navigate(["/master-targets"]); });
            i0.ɵɵelementStart(9, "span", 8);
            i0.ɵɵelement(10, "i", 9);
            i0.ɵɵtext(11, " Danh M\u1EE5c Ch\u1EC9 Ti\u00EAu G\u1ED1c");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(12, "i", 10);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "button", 11);
            i0.ɵɵlistener("click", function ConfigGeneralComponent_Template_button_click_13_listener() { return ctx.router.navigate(["/target-groups"]); });
            i0.ɵɵelementStart(14, "span", 8);
            i0.ɵɵelement(15, "i", 12);
            i0.ɵɵtext(16, " Nh\u00F3m Ch\u1EC9 Ti\u00EAu");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(17, "i", 10);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "button", 11);
            i0.ɵɵlistener("click", function ConfigGeneralComponent_Template_button_click_18_listener() { return ctx.router.navigate(["/matrix-types"]); });
            i0.ɵɵelementStart(19, "span", 8);
            i0.ɵɵelement(20, "i", 13);
            i0.ɵɵtext(21, " N\u1EC1n M\u1EABu Ph\u00E2n T\u00EDch");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(22, "i", 10);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "button", 14);
            i0.ɵɵlistener("click", function ConfigGeneralComponent_Template_button_click_23_listener() { return ctx.router.navigate(["/sample-description-master"]); });
            i0.ɵɵelementStart(24, "span", 8);
            i0.ɵɵelement(25, "i", 15);
            i0.ɵɵtext(26, " Danh M\u1EE5c M\u00F4 T\u1EA3 M\u1EABu");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(27, "i", 10);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(28, "button", 11);
            i0.ɵɵlistener("click", function ConfigGeneralComponent_Template_button_click_28_listener() { return ctx.router.navigate(["/master-devices"]); });
            i0.ɵɵelementStart(29, "span", 8);
            i0.ɵɵelement(30, "i", 16);
            i0.ɵɵtext(31, " Thi\u1EBFt B\u1ECB Ph\u00E2n T\u00EDch");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(32, "i", 10);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(33, "div", 2)(34, "div", 17)(35, "h3", 3)(36, "div", 18);
            i0.ɵɵelement(37, "i", 15);
            i0.ɵɵelementEnd();
            i0.ɵɵtext(38, " Ph\u00E2n Lo\u1EA1i ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(39, "button", 19);
            i0.ɵɵlistener("click", function ConfigGeneralComponent_Template_button_click_39_listener() { return ctx.saveCategories(); });
            i0.ɵɵtext(40, "L\u01B0u");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(41, "div", 20)(42, "div", 21)(43, "span", 22);
            i0.ɵɵtext(44, "Danh s\u00E1ch (M\u00E3 : T\u00EAn hi\u1EC3n th\u1ECB)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(45, "button", 23);
            i0.ɵɵlistener("click", function ConfigGeneralComponent_Template_button_click_45_listener() { return ctx.addCategory(); });
            i0.ɵɵtext(46, "+ Th\u00EAm");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(47, "div", 24);
            i0.ɵɵtext(48, "N\u1EBFu \u0111\u1ED5i m\u00E3, d\u1EEF li\u1EC7u c\u0169 v\u1EABn \u0111\u01B0\u1EE3c gi\u1EEF nh\u01B0ng c\u1EA7n c\u1EADp nh\u1EADt h\u00E0ng lo\u1EA1t \u0111\u1EC3 hi\u1EC3n th\u1ECB \u0111\u00FAng nh\u00F3m. N\u00EAn ch\u1EC9 s\u1EEDa t\u00EAn hi\u1EC3n th\u1ECB.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(49, "div", 25);
            i0.ɵɵrepeaterCreate(50, ConfigGeneralComponent_For_51_Template, 8, 2, "div", 26, i0.ɵɵrepeaterTrackByIndex);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(52, "div", 2)(53, "div", 17)(54, "h3", 3)(55, "div", 27);
            i0.ɵɵelement(56, "i", 28);
            i0.ɵɵelementEnd();
            i0.ɵɵtext(57, " C\u1EA5u H\u00ECnh In \u1EA4n ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(58, "button", 19);
            i0.ɵɵlistener("click", function ConfigGeneralComponent_Template_button_click_58_listener() { return ctx.savePrintConfig(); });
            i0.ɵɵtext(59, "L\u01B0u");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(60, "div", 29)(61, "div")(62, "div", 30);
            i0.ɵɵtext(63, "Hi\u1EC3n th\u1ECB khung k\u00FD t\u00EAn");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(64, "div", 31);
            i0.ɵɵtext(65, "Th\u00EAm m\u1EE5c \"X\u00E1c nh\u1EADn / K\u00FD t\u00EAn\" v\u00E0o cu\u1ED1i phi\u1EBFu");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(66, "label", 32)(67, "input", 33);
            i0.ɵɵtwoWayListener("ngModelChange", function ConfigGeneralComponent_Template_input_ngModelChange_67_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.printConfig().showSignature, $event) || (ctx.printConfig().showSignature = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function ConfigGeneralComponent_Template_input_ngModelChange_67_listener() { return ctx.onPrintConfigChange(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelement(68, "div", 34);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(69, "div")(70, "label", 35);
            i0.ɵɵtext(71, "N\u1ED9i dung ch\u00E2n trang (cam k\u1EBFt cu\u1ED1i phi\u1EBFu)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(72, "textarea", 36);
            i0.ɵɵtwoWayListener("ngModelChange", function ConfigGeneralComponent_Template_textarea_ngModelChange_72_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.printConfig().footerText, $event) || (ctx.printConfig().footerText = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function ConfigGeneralComponent_Template_textarea_ngModelChange_72_listener() { return ctx.onPrintConfigChange(); });
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(73, "div", 2)(74, "div", 17)(75, "h3", 3)(76, "div", 37);
            i0.ɵɵelement(77, "i", 38);
            i0.ɵɵelementEnd();
            i0.ɵɵtext(78, " Th\u00F4ng B\u00E1o H\u1EC7 Th\u1ED1ng ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(79, "div", 20)(80, "textarea", 39);
            i0.ɵɵtwoWayListener("ngModelChange", function ConfigGeneralComponent_Template_textarea_ngModelChange_80_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.newUpdateContent, $event) || (ctx.newUpdateContent = $event); return $event; });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(81, "div", 8)(82, "div", 40);
            i0.ɵɵelement(83, "i", 41);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(84, "input", 42);
            i0.ɵɵtwoWayListener("ngModelChange", function ConfigGeneralComponent_Template_input_ngModelChange_84_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.newUpdateActionUrl, $event) || (ctx.newUpdateActionUrl = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(85, "div", 43)(86, "select", 44);
            i0.ɵɵtwoWayListener("ngModelChange", function ConfigGeneralComponent_Template_select_ngModelChange_86_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.newUpdateType, $event) || (ctx.newUpdateType = $event); return $event; });
            i0.ɵɵelementStart(87, "option", 45);
            i0.ɵɵtext(88, "Xanh lam (th\u00F4ng tin)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(89, "option", 46);
            i0.ɵɵtext(90, "Xanh l\u00E1 (th\u00E0nh c\u00F4ng)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(91, "option", 47);
            i0.ɵɵtext(92, "Cam ho\u1EB7c \u0111\u1ECF (c\u1EA3nh b\u00E1o)");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(93, "button", 48);
            i0.ɵɵlistener("click", function ConfigGeneralComponent_Template_button_click_93_listener() { return ctx.postSystemUpdate(); });
            i0.ɵɵtext(94, "\u0110\u0103ng Th\u00F4ng B\u00E1o");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(95, "div", 49);
            i0.ɵɵrepeaterCreate(96, ConfigGeneralComponent_For_97_Template, 14, 7, "div", 50, _forTrack0);
            i0.ɵɵtemplate(98, ConfigGeneralComponent_Conditional_98_Template, 2, 0, "div", 51);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(99, "div", 1)(100, "div", 2)(101, "h3", 3)(102, "div", 18);
            i0.ɵɵelement(103, "i", 52);
            i0.ɵɵelementEnd();
            i0.ɵɵtext(104, " Giao Di\u1EC7n & Phi\u00EAn B\u1EA3n ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(105, "div", 29)(106, "div")(107, "div", 30);
            i0.ɵɵtext(108, "Giao di\u1EC7n m\u1EB7c \u0111\u1ECBnh c\u1EE7a h\u1EC7 th\u1ED1ng");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(109, "div", 31);
            i0.ɵɵtext(110, "\u00C1p d\u1EE5ng cho ng\u01B0\u1EDDi ch\u01B0a t\u00F9y ch\u1EC9nh c\u00E1 nh\u00E2n");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(111, "select", 53);
            i0.ɵɵlistener("ngModelChange", function ConfigGeneralComponent_Template_select_ngModelChange_111_listener($event) { return ctx.saveAvatarStyle($event); });
            i0.ɵɵelementStart(112, "option", 54);
            i0.ɵɵtext(113, "\uD83D\uDCF7 \u1EA2nh Google (Ch\u1EA5t l\u01B0\u1EE3ng cao)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(114, "option", 55);
            i0.ɵɵtext(115, "\uD83E\uDD16 Robot (Bottts Neutral)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(116, "option", 56);
            i0.ɵɵtext(117, "\uD83D\uDE0A Bi\u1EC3u c\u1EA3m (Fun Emoji)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(118, "option", 57);
            i0.ɵɵtext(119, "\uD83C\uDFA8 Hi\u1EC7n \u0111\u1EA1i (Micah)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(120, "option", 58);
            i0.ɵɵtext(121, "\u270F\uFE0F V\u1EBD tay (Notionists)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(122, "option", 59);
            i0.ɵɵtext(123, "\uD83D\uDD24 Ch\u1EEF c\u00E1i (Letters)");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(124, "div")(125, "label", 35);
            i0.ɵɵtext(126, "Phi\u00EAn b\u1EA3n h\u1EC7 th\u1ED1ng (b\u1EA3n d\u1EF1ng)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(127, "div", 60)(128, "span", 61);
            i0.ɵɵtext(129);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(130, "span", 62);
            i0.ɵɵtext(131, "T\u1EF1 \u0111\u1ED9ng \u0111\u1ED3ng b\u1ED9 t\u1EEB b\u1EA3n d\u1EF1ng");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵtemplate(132, ConfigGeneralComponent_Conditional_132_Template, 17, 1, "div", 2);
            i0.ɵɵelementStart(133, "div", 2)(134, "div", 17)(135, "h3", 63)(136, "div", 64);
            i0.ɵɵelement(137, "i", 65);
            i0.ɵɵelementEnd();
            i0.ɵɵtext(138, " B\u1EA3o Tr\u00EC H\u1EC7 Th\u1ED1ng ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(139, "button", 66);
            i0.ɵɵlistener("click", function ConfigGeneralComponent_Template_button_click_139_listener() { return ctx.saveMaintenanceConfig(); });
            i0.ɵɵtext(140, "L\u01B0u");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(141, "div", 67)(142, "div")(143, "div", 68);
            i0.ɵɵtext(144, "Ch\u1EBF \u0111\u1ED9 B\u1EA3o tr\u00EC (Maintenance Mode)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(145, "div", 69);
            i0.ɵɵtext(146, "B\u1EADt \u0111\u1EC3 ch\u1EB7n to\u00E0n b\u1ED9 thao t\u00E1c c\u1EE7a nh\u00E2n vi\u00EAn (Ngo\u1EA1i tr\u1EEB Manager).");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(147, "label", 70)(148, "input", 33);
            i0.ɵɵtwoWayListener("ngModelChange", function ConfigGeneralComponent_Template_input_ngModelChange_148_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.maintenanceModeLocal, $event) || (ctx.maintenanceModeLocal = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function ConfigGeneralComponent_Template_input_ngModelChange_148_listener() { return ctx.onMaintenanceModeChange(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelement(149, "div", 71);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(150, "div")(151, "label", 35);
            i0.ɵɵtext(152, "N\u1ED9i dung th\u00F4ng b\u00E1o (hi\u1EC3n th\u1ECB khi ch\u1EB7n)");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(153, "textarea", 72);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(154, "div", 73)(155, "label", 35);
            i0.ɵɵtext(156, "H\u1EB9n gi\u1EDD b\u1EA3o tr\u00EC t\u1EF1 \u0111\u1ED9ng (T\u00F9y ch\u1ECDn)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(157, "div", 74);
            i0.ɵɵelement(158, "input", 75);
            i0.ɵɵtemplate(159, ConfigGeneralComponent_Conditional_159_Template, 2, 0, "button", 76);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(160, "div", 77);
            i0.ɵɵtext(161, "H\u1EC7 th\u1ED1ng s\u1EBD hi\u1EC7n banner c\u1EA3nh b\u00E1o \u0111\u1EBFm ng\u01B0\u1EE3c tr\u01B0\u1EDBc 30 ph\u00FAt v\u00E0 t\u1EF1 \u0111\u1ED9ng kh\u00F3a m\u00E0n h\u00ECnh c\u1EE7a nh\u00E2n vi\u00EAn khi \u0111\u1EBFn gi\u1EDD.");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(162, "div", 2)(163, "h3", 3)(164, "div", 78);
            i0.ɵɵelement(165, "i", 79);
            i0.ɵɵelementEnd();
            i0.ɵɵtext(166, " An To\u00E0n D\u1EEF Li\u1EC7u ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(167, "div", 80)(168, "button", 81);
            i0.ɵɵlistener("click", function ConfigGeneralComponent_Template_button_click_168_listener() { return ctx.exportData(); });
            i0.ɵɵelement(169, "i", 82);
            i0.ɵɵtext(170, " Backup JSON ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(171, "label", 83);
            i0.ɵɵelement(172, "i", 84);
            i0.ɵɵtext(173, " Restore JSON ");
            i0.ɵɵelementStart(174, "input", 85);
            i0.ɵɵlistener("change", function ConfigGeneralComponent_Template_input_change_174_listener($event) { return ctx.importData($event); });
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(175, "div", 86)(176, "div", 87);
            i0.ɵɵtext(177, "Quy t\u1EAFc Firestore");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(178, "p", 88);
            i0.ɵɵtext(179);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(180, "div", 89)(181, "div", 90)(182, "div", 17)(183, "div")(184, "div", 91);
            i0.ɵɵelement(185, "i", 92);
            i0.ɵɵtext(186, " Th\u00F9ng R\u00E1c (Recycle Bin - Soft Delete) ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(187, "div", 93);
            i0.ɵɵtext(188, "D\u1EEF li\u1EC7u \u0111\u01B0\u1EE3c gi\u1EEF tr\u00EAn m\u00E2y \u0111\u1EC3 ph\u00F2ng ng\u1EEBa r\u1EE7i ro. Qu\u1EA3n tr\u1ECB vi\u00EAn c\u00F3 th\u1EC3 \"X\u00F3a v\u0129nh vi\u1EC5n\" \u0111\u1EC3 l\u00E0m s\u1EA1ch.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(189, "button", 94);
            i0.ɵɵlistener("click", function ConfigGeneralComponent_Template_button_click_189_listener() { return ctx.openRecycleBin(); });
            i0.ɵɵtext(190, " M\u1EDF Th\u00F9ng R\u00E1c ");
            i0.ɵɵelementEnd()()()()();
            i0.ɵɵelementStart(191, "div", 2)(192, "div", 17)(193, "h3", 3)(194, "div", 95);
            i0.ɵɵelement(195, "i", 96);
            i0.ɵɵelementEnd();
            i0.ɵɵtext(196, " T\u00E0i Nguy\u00EAn ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(197, "button", 97);
            i0.ɵɵlistener("click", function ConfigGeneralComponent_Template_button_click_197_listener() { return ctx.loadUsage(); });
            i0.ɵɵelement(198, "i", 98);
            i0.ɵɵtext(199, " Check");
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(200, ConfigGeneralComponent_Conditional_200_Template, 5, 1, "div", 99);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(201, "div", 100)(202, "div", 101)(203, "div")(204, "h3", 102)(205, "div", 103);
            i0.ɵɵelement(206, "i", 104);
            i0.ɵɵelementEnd();
            i0.ɵɵtext(207, " Kho L\u01B0u Tr\u1EEF & Ph\u1EE5c H\u1ED3i ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(208, "p", 105);
            i0.ɵɵtext(209, "Xu\u1EA5t d\u1EEF li\u1EC7u c\u0169 ra Excel v\u00E0 x\u00F3a kh\u1ECFi Firebase \u0111\u1EC3 b\u1EA3o v\u1EC7 1GB dung l\u01B0\u1EE3ng.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(210, "label", 106);
            i0.ɵɵelement(211, "i", 107);
            i0.ɵɵtext(212, " N\u1EA1p l\u1EA1i Excel ");
            i0.ɵɵelementStart(213, "input", 108);
            i0.ɵɵlistener("change", function ConfigGeneralComponent_Template_input_change_213_listener($event) { return ctx.importArchiverData($event); });
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(214, "div", 8)(215, "span", 109);
            i0.ɵɵtext(216, "D\u1ECDn b\u1EA3n ghi c\u0169 h\u01A1n:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(217, "select", 110);
            i0.ɵɵtwoWayListener("ngModelChange", function ConfigGeneralComponent_Template_select_ngModelChange_217_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.archiverDays, $event) || (ctx.archiverDays = $event); return $event; });
            i0.ɵɵelementStart(218, "option", 111);
            i0.ɵɵtext(219, "3 Th\u00E1ng (90 ng\u00E0y)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(220, "option", 111);
            i0.ɵɵtext(221, "6 Th\u00E1ng (180 ng\u00E0y)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(222, "option", 111);
            i0.ɵɵtext(223, "1 N\u0103m (365 ng\u00E0y)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(224, "option", 111);
            i0.ɵɵtext(225, "2 N\u0103m (730 ng\u00E0y)");
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(226, ConfigGeneralComponent_Conditional_226_Template, 3, 0, "button", 112)(227, ConfigGeneralComponent_Conditional_227_Template, 3, 0, "button", 113)(228, ConfigGeneralComponent_Conditional_228_Template, 3, 0, "button", 113)(229, ConfigGeneralComponent_Conditional_229_Template, 3, 0, "button", 114)(230, ConfigGeneralComponent_Conditional_230_Template, 3, 0, "button", 115)(231, ConfigGeneralComponent_Conditional_231_Template, 11, 1, "div", 116);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(232, "div", 117)(233, "div", 118)(234, "h3", 3)(235, "div", 119);
            i0.ɵɵelement(236, "i", 120);
            i0.ɵɵelementEnd();
            i0.ɵɵtext(237, " Migration D\u1EEF Li\u1EC7u H\u1EC7 Th\u1ED1ng ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(238, "span", 121);
            i0.ɵɵtext(239, "Ch\u1EC9 Admin");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(240, "p", 122);
            i0.ɵɵtext(241, "Ghi ");
            i0.ɵɵelementStart(242, "code", 123);
            i0.ɵɵtext(243, "lastUpdated");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(244, " cho c\u00E1c document c\u0169 trong ");
            i0.ɵɵelementStart(245, "strong");
            i0.ɵɵtext(246, "inventory");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(247, ", ");
            i0.ɵɵelementStart(248, "strong");
            i0.ɵɵtext(249, "sops");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(250, " v\u00E0 ");
            i0.ɵɵelementStart(251, "strong");
            i0.ɵɵtext(252, "logs");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(253, " \u0111\u1EC3 DeltaSync cursor ho\u1EA1t \u0111\u1ED9ng \u0111\u00FAng. Thao t\u00E1c idempotent \u2014 an to\u00E0n khi ch\u1EA1y l\u1EA1i.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(254, "button", 124);
            i0.ɵɵlistener("click", function ConfigGeneralComponent_Template_button_click_254_listener() { return ctx.runLastUpdatedMigration(); });
            i0.ɵɵtemplate(255, ConfigGeneralComponent_Conditional_255_Template, 2, 0)(256, ConfigGeneralComponent_Conditional_256_Template, 2, 0);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(257, ConfigGeneralComponent_Conditional_257_Template, 5, 0);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(258, ConfigGeneralComponent_Conditional_258_Template, 43, 3, "div", 125);
        } if (rf & 2) {
            let tmp_11_0;
            let tmp_17_0;
            i0.ɵɵadvance(50);
            i0.ɵɵrepeater(ctx.categoriesLocal());
            i0.ɵɵadvance(17);
            i0.ɵɵtwoWayProperty("ngModel", ctx.printConfig().showSignature);
            i0.ɵɵadvance(5);
            i0.ɵɵtwoWayProperty("ngModel", ctx.printConfig().footerText);
            i0.ɵɵadvance(8);
            i0.ɵɵtwoWayProperty("ngModel", ctx.newUpdateContent);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.newUpdateActionUrl);
            i0.ɵɵadvance(2);
            i0.ɵɵtwoWayProperty("ngModel", ctx.newUpdateType);
            i0.ɵɵadvance(7);
            i0.ɵɵproperty("disabled", !ctx.newUpdateContent);
            i0.ɵɵadvance(3);
            i0.ɵɵrepeater(ctx.systemUpdates());
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.systemUpdates().length === 0 ? 98 : -1);
            i0.ɵɵadvance(13);
            i0.ɵɵproperty("ngModel", ctx.state.avatarStyle());
            i0.ɵɵadvance(18);
            i0.ɵɵtextInterpolate(ctx.state.systemVersion());
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(((tmp_11_0 = ctx.state.currentUser()) == null ? null : tmp_11_0.role) === "manager" ? 132 : -1);
            i0.ɵɵadvance(16);
            i0.ɵɵtwoWayProperty("ngModel", ctx.maintenanceModeLocal);
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("formControl", ctx.maintenanceMessageLocal);
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("formControl", ctx.maintenanceScheduledTimeLocal);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.maintenanceScheduledTimeLocal.value ? 159 : -1);
            i0.ɵɵadvance(20);
            i0.ɵɵtextInterpolate1(" ", ctx.firestoreRulesNotice, " ");
            i0.ɵɵadvance(21);
            i0.ɵɵconditional((tmp_17_0 = ctx.storageEstimate()) ? 200 : -1, tmp_17_0);
            i0.ɵɵadvance(17);
            i0.ɵɵtwoWayProperty("ngModel", ctx.archiverDays);
            i0.ɵɵadvance();
            i0.ɵɵproperty("value", 90);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("value", 180);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("value", 365);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("value", 730);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.archiverStatus() === "idle" ? 226 : ctx.archiverStatus() === "fetching" ? 227 : ctx.archiverStatus() === "exporting" ? 228 : ctx.archiverStatus() === "deleting" ? 229 : ctx.archiverStatus() === "restoring" ? 230 : ctx.archiverStatus() === "ready_to_delete" ? 231 : -1);
            i0.ɵɵadvance(28);
            i0.ɵɵproperty("disabled", ctx.isMigrating());
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.isMigrating() ? 255 : 256);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.migrationLog().length > 0 ? 257 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showRecycleBin() ? 258 : -1);
        } }, dependencies: [CommonModule, i1.DatePipe, ReactiveFormsModule, i2.NgSelectOption, i2.ɵNgSelectMultipleOption, i2.DefaultValueAccessor, i2.CheckboxControlValueAccessor, i2.SelectControlValueAccessor, i2.NgControlStatus, i2.FormControlDirective, FormsModule, i2.NgModel], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ConfigGeneralComponent, [{
        type: Component,
        args: [{ selector: 'app-config-general', standalone: true, imports: [CommonModule, ReactiveFormsModule, FormsModule], template: "    <div class=\"grid grid-cols-1 md:grid-cols-2 gap-6 items-start animate-fade-in\">\r\n\r\n        <!-- LEFT COLUMN -->\r\n        <div class=\"space-y-6\">\r\n\r\n            <!-- 1. MASTER DATA -->\r\n            <div class=\"bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-4\">\r\n                <h3 class=\"font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-base\">\r\n                    <div class=\"w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 flex items-center justify-center\"><i class=\"fa-solid fa-layer-group\"></i></div>\r\n                    Danh M\u1EE5c D\u1EEF Li\u1EC7u G\u1ED1c\r\n                </h3>\r\n                <div class=\"grid gap-3\">\r\n                    <button (click)=\"router.navigate(['/master-targets'])\" class=\"w-full py-3 px-4 border border-teal-200 dark:border-teal-800/30 bg-teal-50 dark:bg-teal-900/10 text-teal-800 dark:text-teal-300 rounded-xl font-bold text-sm hover:bg-teal-100 dark:hover:bg-teal-900/30 transition flex items-center justify-between group\">\r\n                        <span class=\"flex items-center gap-2\"><i class=\"fa-solid fa-book-medical\"></i> Danh M\u1EE5c Ch\u1EC9 Ti\u00EAu G\u1ED1c</span>\r\n                        <i class=\"fa-solid fa-arrow-right opacity-50 group-hover:opacity-100 transition-opacity\"></i>\r\n                    </button>\r\n                    <button (click)=\"router.navigate(['/target-groups'])\" class=\"w-full py-3 px-4 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition flex items-center justify-between group\">\r\n                        <span class=\"flex items-center gap-2\"><i class=\"fa-solid fa-list-check\"></i> Nh\u00F3m Ch\u1EC9 Ti\u00EAu</span>\r\n                        <i class=\"fa-solid fa-arrow-right opacity-50 group-hover:opacity-100 transition-opacity\"></i>\r\n                    </button>\r\n                    <button (click)=\"router.navigate(['/matrix-types'])\" class=\"w-full py-3 px-4 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition flex items-center justify-between group\">\r\n                        <span class=\"flex items-center gap-2\"><i class=\"fa-solid fa-table-cells text-base mr-1\"></i> N\u1EC1n M\u1EABu Ph\u00E2n T\u00EDch</span>\r\n                        <i class=\"fa-solid fa-arrow-right opacity-50 group-hover:opacity-100 transition-opacity\"></i>\r\n                    </button>\r\n                    <button (click)=\"router.navigate(['/sample-description-master'])\" class=\"w-full py-3 px-4 border border-fuchsia-200 dark:border-fuchsia-800/30 bg-fuchsia-50 dark:bg-fuchsia-900/10 text-fuchsia-800 dark:text-fuchsia-300 rounded-xl font-bold text-sm hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/30 transition flex items-center justify-between group\">\r\n                        <span class=\"flex items-center gap-2\"><i class=\"fa-solid fa-tags\"></i> Danh M\u1EE5c M\u00F4 T\u1EA3 M\u1EABu</span>\r\n                        <i class=\"fa-solid fa-arrow-right opacity-50 group-hover:opacity-100 transition-opacity\"></i>\r\n                    </button>\r\n                    <button (click)=\"router.navigate(['/master-devices'])\" class=\"w-full py-3 px-4 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition flex items-center justify-between group\">\r\n                        <span class=\"flex items-center gap-2\"><i class=\"fa-solid fa-microscope text-base mr-1\"></i> Thi\u1EBFt B\u1ECB Ph\u00E2n T\u00EDch</span>\r\n                        <i class=\"fa-solid fa-arrow-right opacity-50 group-hover:opacity-100 transition-opacity\"></i>\r\n                    </button>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- 1.5. CATEGORIES CONFIG -->\r\n            <div class=\"bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-4\">\r\n                <div class=\"flex justify-between items-center\">\r\n                    <h3 class=\"font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-base\">\r\n                        <div class=\"w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center\"><i class=\"fa-solid fa-tags\"></i></div>\r\n                        Ph\u00E2n Lo\u1EA1i\r\n                    </h3>\r\n                    <button (click)=\"saveCategories()\" class=\"text-xs bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold transition shadow-sm dark:shadow-none\">L\u01B0u</button>\r\n                </div>\r\n\r\n                <div class=\"flex flex-col gap-2\">\r\n                    <div class=\"flex justify-between items-center mb-1\">\r\n                        <span class=\"text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase\">Danh s\u00E1ch (M\u00E3 : T\u00EAn hi\u1EC3n th\u1ECB)</span>\r\n                        <button (click)=\"addCategory()\" class=\"text-[9px] bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 px-2 py-1 rounded font-bold transition\">+ Th\u00EAm</button>\r\n                    </div>\r\n                    <div class=\"text-[10px] text-slate-500 dark:text-slate-400 mb-2 italic\">N\u1EBFu \u0111\u1ED5i m\u00E3, d\u1EEF li\u1EC7u c\u0169 v\u1EABn \u0111\u01B0\u1EE3c gi\u1EEF nh\u01B0ng c\u1EA7n c\u1EADp nh\u1EADt h\u00E0ng lo\u1EA1t \u0111\u1EC3 hi\u1EC3n th\u1ECB \u0111\u00FAng nh\u00F3m. N\u00EAn ch\u1EC9 s\u1EEDa t\u00EAn hi\u1EC3n th\u1ECB.</div>\r\n\r\n                    <div class=\"space-y-2 border border-slate-100 dark:border-slate-700/50 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-900/20\">\r\n                        @for (cat of categoriesLocal(); track $index) {\r\n                            <div class=\"flex flex-col sm:flex-row gap-2 sm:items-center group\">\r\n                                <div class=\"flex gap-2 flex-1\">\r\n                                    <input [(ngModel)]=\"cat.id\" (ngModelChange)=\"onCategoryChange()\" class=\"w-1/3 min-w-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded px-2 py-2 sm:py-1 text-xs font-mono font-bold text-slate-600 dark:text-slate-400 outline-none focus:border-blue-400 dark:focus:border-blue-500 transition shadow-sm sm:shadow-none\" placeholder=\"ID (VD: reagent)\">\r\n                                    <input [(ngModel)]=\"cat.name\" (ngModelChange)=\"onCategoryChange()\" class=\"flex-1 min-w-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded px-2 py-2 sm:py-1 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none focus:border-blue-400 dark:focus:border-blue-500 transition shadow-sm sm:shadow-none\" placeholder=\"T\u00EAn hi\u1EC3n th\u1ECB (v\u00ED d\u1EE5: H\u00F3a ch\u1EA5t)\">\r\n                                </div>\r\n                                <button (click)=\"removeCategory($index)\" class=\"w-full sm:w-6 h-8 sm:h-6 shrink-0 flex items-center justify-center text-slate-400 dark:text-slate-500 sm:text-slate-300 sm:dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:text-red-400 transition sm:rounded-full sm:hover:bg-slate-100 sm:dark:hover:bg-slate-700 border border-slate-200 sm:border-transparent dark:border-slate-600 bg-white sm:bg-transparent dark:bg-slate-800 rounded shadow-sm sm:shadow-none\"><i class=\"fa-solid fa-trash text-[10px] sm:text-[10px]\"></i> <span class=\"sm:hidden ml-2 text-xs font-bold\">X\u00F3a</span></button>\r\n                            </div>\r\n                        }\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- 2. PRINT CONFIG -->\r\n            <div class=\"bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-4\">\r\n                <div class=\"flex justify-between items-center\">\r\n                    <h3 class=\"font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-base\">\r\n                        <div class=\"w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center\"><i class=\"fa-solid fa-print\"></i></div>\r\n                        C\u1EA5u H\u00ECnh In \u1EA4n\r\n                    </h3>\r\n                    <button (click)=\"savePrintConfig()\" class=\"text-xs bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold transition shadow-sm dark:shadow-none\">L\u01B0u</button>\r\n                </div>\r\n\r\n                <div class=\"flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50\">\r\n                    <div>\r\n                        <div class=\"text-xs font-bold text-slate-700 dark:text-slate-300\">Hi\u1EC3n th\u1ECB khung k\u00FD t\u00EAn</div>\r\n                        <div class=\"text-[10px] text-slate-400 dark:text-slate-500\">Th\u00EAm m\u1EE5c \"X\u00E1c nh\u1EADn / K\u00FD t\u00EAn\" v\u00E0o cu\u1ED1i phi\u1EBFu</div>\r\n                    </div>\r\n                    <label class=\"relative inline-flex items-center cursor-pointer\">\r\n                        <input type=\"checkbox\" [(ngModel)]=\"printConfig().showSignature\" (ngModelChange)=\"onPrintConfigChange()\" class=\"sr-only peer\">\r\n                        <div class=\"w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-slate-600 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600 dark:peer-checked:bg-purple-500\"></div>\r\n                    </label>\r\n                </div>\r\n\r\n                <div>\r\n                    <label class=\"text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1\">N\u1ED9i dung ch\u00E2n trang (cam k\u1EBFt cu\u1ED1i phi\u1EBFu)</label>\r\n                    <textarea [(ngModel)]=\"printConfig().footerText\" (ngModelChange)=\"onPrintConfigChange()\" rows=\"2\" class=\"w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 focus:bg-white dark:focus:bg-slate-800 focus:border-purple-500 dark:focus:border-purple-500 outline-none resize-none transition\" placeholder=\"N\u1ED9i dung ch\u00E2n trang...\"></textarea>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- 2.5. SYSTEM UPDATES NOTIFICATIONS -->\r\n            <div class=\"bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-4\">\r\n                <div class=\"flex justify-between items-center\">\r\n                    <h3 class=\"font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-base\">\r\n                        <div class=\"w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center\"><i class=\"fa-solid fa-bullhorn\"></i></div>\r\n                        Th\u00F4ng B\u00E1o H\u1EC7 Th\u1ED1ng\r\n                    </h3>\r\n                </div>\r\n\r\n                <div class=\"flex flex-col gap-2\">\r\n                    <textarea [(ngModel)]=\"newUpdateContent\" rows=\"2\" class=\"w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 focus:bg-white dark:focus:bg-slate-800 focus:border-orange-500 outline-none resize-none transition\" placeholder=\"Nh\u1EADp n\u1ED9i dung th\u00F4ng b\u00E1o m\u1EDBi cho ng\u01B0\u1EDDi d\u00F9ng...\"></textarea>\r\n\r\n                    <div class=\"flex items-center gap-2\">\r\n                        <div class=\"w-7 h-7 flex shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400\"><i class=\"fa-solid fa-link\"></i></div>\r\n                        <input [(ngModel)]=\"newUpdateActionUrl\" type=\"text\" class=\"flex-1 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 focus:bg-white dark:focus:bg-slate-800 focus:border-orange-500 outline-none transition\" placeholder=\"Link \u0111\u00EDnh k\u00E8m (URL tu\u1EF3 ch\u1ECDn, vd: /reports)...\">\r\n                    </div>\r\n\r\n                    <div class=\"flex gap-2 items-center justify-between\">\r\n                        <select [(ngModel)]=\"newUpdateType\" class=\"text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1 outline-none focus:border-orange-500 cursor-pointer\">\r\n                            <option value=\"info\">Xanh lam (th\u00F4ng tin)</option>\r\n                            <option value=\"success\">Xanh l\u00E1 (th\u00E0nh c\u00F4ng)</option>\r\n                            <option value=\"warning\">Cam ho\u1EB7c \u0111\u1ECF (c\u1EA3nh b\u00E1o)</option>\r\n                        </select>\r\n                        <button (click)=\"postSystemUpdate()\" [disabled]=\"!newUpdateContent\" class=\"text-xs bg-orange-600 hover:bg-orange-700 text-white px-4 py-1.5 rounded-lg font-bold transition shadow-sm disabled:opacity-50\">\u0110\u0103ng Th\u00F4ng B\u00E1o</button>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class=\"space-y-2 mt-2 max-h-[250px] overflow-y-auto custom-scrollbar border-t border-slate-100 dark:border-slate-700/50 pt-2\">\r\n                    @for (item of systemUpdates(); track item.id) {\r\n                        <div class=\"flex items-start justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50\">\r\n                            <div class=\"flex-1 min-w-0\">\r\n                                <div class=\"flex items-center gap-2 mb-1\">\r\n                                    @if(item.type === 'success') {\r\n                                        <span class=\"w-2 h-2 rounded-full bg-emerald-500\"></span>\r\n                                    } @else if(item.type === 'warning') {\r\n                                        <span class=\"w-2 h-2 rounded-full bg-orange-500\"></span>\r\n                                    } @else {\r\n                                        <span class=\"w-2 h-2 rounded-full bg-blue-500\"></span>\r\n                                    }\r\n                                    <span class=\"text-[10px] text-slate-400 font-bold\">{{item.timestamp | date:'dd/MM/yyyy HH:mm'}}</span>\r\n                                </div>\r\n                                <div class=\"text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed\">{{item.content}}</div>\r\n                                @if(item.actionUrl) {\r\n                                    <div class=\"mt-1\">\r\n                                        <a [href]=\"item.actionUrl\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-[10px] font-bold text-blue-500 hover:text-blue-600 transition flex items-center gap-1\"><i class=\"fa-solid fa-link\"></i> {{item.actionUrl}}</a>\r\n                                    </div>\r\n                                }\r\n                            </div>\r\n                            <button (click)=\"deleteSystemUpdate(item.id)\" class=\"text-slate-400 hover:text-red-500 transition p-1 hover:bg-red-50 rounded\"><i class=\"fa-solid fa-trash text-[10px]\"></i></button>\r\n                        </div>\r\n                    }\r\n                    @if (systemUpdates().length === 0) {\r\n                        <div class=\"text-center text-slate-400 dark:text-slate-500 text-xs italic py-4\">Ch\u01B0a c\u00F3 th\u00F4ng b\u00E1o n\u00E0o.</div>\r\n                    }\r\n                </div>\r\n            </div>\r\n\r\n        </div>\r\n\r\n        <!-- RIGHT COLUMN -->\r\n        <div class=\"space-y-6\">\r\n\r\n            <!-- 3. SYSTEM & AVATAR -->\r\n            <div class=\"bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-4\">\r\n                <h3 class=\"font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-base\">\r\n                    <div class=\"w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center\"><i class=\"fa-solid fa-sliders\"></i></div>\r\n                    Giao Di\u1EC7n & Phi\u00EAn B\u1EA3n\r\n                </h3>\r\n\r\n                <!-- Avatar Style Selector -->\r\n                <div class=\"flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50\">\r\n                    <div>\r\n                        <div class=\"text-xs font-bold text-slate-700 dark:text-slate-300\">Giao di\u1EC7n m\u1EB7c \u0111\u1ECBnh c\u1EE7a h\u1EC7 th\u1ED1ng</div>\r\n                        <div class=\"text-[10px] text-slate-400 dark:text-slate-500\">\u00C1p d\u1EE5ng cho ng\u01B0\u1EDDi ch\u01B0a t\u00F9y ch\u1EC9nh c\u00E1 nh\u00E2n</div>\r\n                    </div>\r\n                    <select [ngModel]=\"state.avatarStyle()\" (ngModelChange)=\"saveAvatarStyle($event)\"\r\n                            class=\"text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1 outline-none focus:border-blue-500 dark:focus:border-blue-500 cursor-pointer\">\r\n                        <option value=\"google\">\uD83D\uDCF7 \u1EA2nh Google (Ch\u1EA5t l\u01B0\u1EE3ng cao)</option>\r\n                        <option value=\"bottts-neutral\">\uD83E\uDD16 Robot (Bottts Neutral)</option>\r\n                        <option value=\"fun-emoji\">\uD83D\uDE0A Bi\u1EC3u c\u1EA3m (Fun Emoji)</option>\r\n                        <option value=\"micah\">\uD83C\uDFA8 Hi\u1EC7n \u0111\u1EA1i (Micah)</option>\r\n                        <option value=\"notionists\">\u270F\uFE0F V\u1EBD tay (Notionists)</option>\r\n                        <option value=\"initials\">\uD83D\uDD24 Ch\u1EEF c\u00E1i (Letters)</option>\r\n                    </select>\r\n                </div>\r\n\r\n                <div>\r\n                    <label class=\"text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1\">Phi\u00EAn b\u1EA3n h\u1EC7 th\u1ED1ng (b\u1EA3n d\u1EF1ng)</label>\r\n                    <div class=\"flex items-center justify-between border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300\">\r\n                        <span class=\"font-mono text-blue-600 dark:text-blue-400\">{{ state.systemVersion() }}</span>\r\n                        <span class=\"text-[10px] text-slate-400 font-normal\">T\u1EF1 \u0111\u1ED9ng \u0111\u1ED3ng b\u1ED9 t\u1EEB b\u1EA3n d\u1EF1ng</span>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- 3.1. FEATURE VISIBILITY (LOCKING VS HIDING) -->\r\n            @if (state.currentUser()?.role === 'manager') {\r\n                <div class=\"bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-4\">\r\n                    <div class=\"flex justify-between items-center\">\r\n                        <h3 class=\"font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-base\">\r\n                            <div class=\"w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center\"><i class=\"fa-solid fa-lock\"></i></div>\r\n                            Hi\u1EC3n Th\u1ECB T\u00EDnh N\u0103ng B\u1ECB Kh\u00F3a\r\n                        </h3>\r\n                        <button (click)=\"saveShowLockedFeaturesConfig()\" class=\"text-xs bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg font-bold transition shadow-sm dark:shadow-none\">L\u01B0u</button>\r\n                    </div>\r\n\r\n                    <div class=\"flex items-center justify-between p-3 bg-amber-50/50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30\">\r\n                        <div>\r\n                            <div class=\"text-xs font-bold text-slate-800 dark:text-slate-200\">Ch\u1EBF \u0111\u1ED9 Hi\u1EC3n th\u1ECB Kh\u00F3a \uD83D\uDD12</div>\r\n                            <div class=\"text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 max-w-[240px]\">Khi B\u1EACT: M\u1ECDi ng\u01B0\u1EDDi d\u00F9ng s\u1EBD th\u1EA5y to\u00E0n b\u1ED9 menu/t\u00EDnh n\u0103ng v\u1EDBi icon \uD83D\uDD12 thay v\u00EC b\u1ECB \u1EA9n ho\u00E0n to\u00E0n.</div>\r\n                        </div>\r\n                        <label class=\"relative inline-flex items-center cursor-pointer shrink-0\">\r\n                            <input type=\"checkbox\" [(ngModel)]=\"showLockedFeaturesLocal\" (ngModelChange)=\"onShowLockedFeaturesChange()\" class=\"sr-only peer\">\r\n                            <div class=\"w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-slate-600 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500 dark:peer-checked:bg-amber-500\"></div>\r\n                        </label>\r\n                    </div>\r\n                </div>\r\n            }\r\n\r\n            <!-- 3.5. MAINTENANCE MODE -->\r\n            <div class=\"bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-4\">\r\n                <div class=\"flex justify-between items-center\">\r\n                    <h3 class=\"font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2 text-base\">\r\n                        <div class=\"w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 flex items-center justify-center\"><i class=\"fa-solid fa-person-digging\"></i></div>\r\n                        B\u1EA3o Tr\u00EC H\u1EC7 Th\u1ED1ng\r\n                    </h3>\r\n                    <button (click)=\"saveMaintenanceConfig()\" class=\"text-xs bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg font-bold transition shadow-sm dark:shadow-none\">L\u01B0u</button>\r\n                </div>\r\n\r\n                <div class=\"flex items-center justify-between p-3 bg-rose-50/50 dark:bg-rose-900/10 rounded-xl border border-rose-100 dark:border-rose-900/30\">\r\n                    <div>\r\n                        <div class=\"text-xs font-bold text-rose-700 dark:text-rose-400\">Ch\u1EBF \u0111\u1ED9 B\u1EA3o tr\u00EC (Maintenance Mode)</div>\r\n                        <div class=\"text-[10px] text-rose-600/80 dark:text-rose-500/80 mt-0.5 max-w-[200px]\">B\u1EADt \u0111\u1EC3 ch\u1EB7n to\u00E0n b\u1ED9 thao t\u00E1c c\u1EE7a nh\u00E2n vi\u00EAn (Ngo\u1EA1i tr\u1EEB Manager).</div>\r\n                    </div>\r\n                    <label class=\"relative inline-flex items-center cursor-pointer shrink-0\">\r\n                        <input type=\"checkbox\" [(ngModel)]=\"maintenanceModeLocal\" (ngModelChange)=\"onMaintenanceModeChange()\" class=\"sr-only peer\">\r\n                        <div class=\"w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-slate-600 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600 dark:peer-checked:bg-rose-500\"></div>\r\n                    </label>\r\n                </div>\r\n\r\n                <div>\r\n                    <label class=\"text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1\">N\u1ED9i dung th\u00F4ng b\u00E1o (hi\u1EC3n th\u1ECB khi ch\u1EB7n)</label>\r\n                    <textarea [formControl]=\"maintenanceMessageLocal\" rows=\"2\" class=\"w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 focus:bg-white dark:focus:bg-slate-800 focus:border-rose-500 dark:focus:border-rose-500 outline-none resize-none transition\" placeholder=\"Nh\u1EADp n\u1ED9i dung b\u1EA3o tr\u00EC...\"></textarea>\r\n                </div>\r\n\r\n                <div class=\"border-t border-slate-100 dark:border-slate-700/50 pt-3\">\r\n                    <label class=\"text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1\">H\u1EB9n gi\u1EDD b\u1EA3o tr\u00EC t\u1EF1 \u0111\u1ED9ng (T\u00F9y ch\u1ECDn)</label>\r\n                    <div class=\"flex gap-2\">\r\n                        <input type=\"datetime-local\" [formControl]=\"maintenanceScheduledTimeLocal\" class=\"flex-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-rose-500 transition cursor-pointer\">\r\n                        @if (maintenanceScheduledTimeLocal.value) {\r\n                            <button (click)=\"clearScheduledTime()\" class=\"text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg font-bold transition\">H\u1EE7y H\u1EB9n</button>\r\n                        }\r\n                    </div>\r\n                    <div class=\"text-[9px] text-slate-400 dark:text-slate-500 mt-1 italic\">H\u1EC7 th\u1ED1ng s\u1EBD hi\u1EC7n banner c\u1EA3nh b\u00E1o \u0111\u1EBFm ng\u01B0\u1EE3c tr\u01B0\u1EDBc 30 ph\u00FAt v\u00E0 t\u1EF1 \u0111\u1ED9ng kh\u00F3a m\u00E0n h\u00ECnh c\u1EE7a nh\u00E2n vi\u00EAn khi \u0111\u1EBFn gi\u1EDD.</div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- 4. SECURITY & BACKUP (Includes Rules) -->\r\n            <div class=\"bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-4\">\r\n                <h3 class=\"font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-base\">\r\n                    <div class=\"w-8 h-8 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-slate-300 flex items-center justify-center\"><i class=\"fa-solid fa-shield-cat\"></i></div>\r\n                    An To\u00E0n D\u1EEF Li\u1EC7u\r\n                </h3>\r\n\r\n                <div class=\"grid grid-cols-2 gap-2\">\r\n                    <button (click)=\"exportData()\" class=\"p-2 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center justify-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 transition\">\r\n                        <i class=\"fa-solid fa-download\"></i> Backup JSON\r\n                    </button>\r\n                    <label class=\"p-2 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center justify-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 transition cursor-pointer\">\r\n                        <i class=\"fa-solid fa-upload\"></i> Restore JSON\r\n                        <input type=\"file\" class=\"hidden\" accept=\".json\" (change)=\"importData($event)\">\r\n                    </label>\r\n                </div>\r\n\r\n                <div class=\"relative mt-2 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-3\">\n                    <div class=\"text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase mb-1\">Quy t\u1EAFc Firestore</div>\n                    <p class=\"text-[10px] leading-relaxed text-amber-700/80 dark:text-amber-300/80\">\n                        {{ firestoreRulesNotice }}\n                    </p>\n                </div>\n\r\n                <!-- Recycle Bin -->\r\n                <div class=\"mt-4 pt-4 border-t border-slate-100 dark:border-slate-700\">\r\n                    <div class=\"flex flex-col gap-2 p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-xl\">\r\n                        <div class=\"flex justify-between items-center\">\r\n                            <div>\r\n                                <div class=\"text-[11px] font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2 uppercase tracking-wide\">\r\n                                    <i class=\"fa-solid fa-trash-can-arrow-up\"></i> Th\u00F9ng R\u00E1c (Recycle Bin - Soft Delete)\r\n                                </div>\r\n                                <div class=\"text-[10px] text-rose-600/70 dark:text-rose-400/80 mt-1\">D\u1EEF li\u1EC7u \u0111\u01B0\u1EE3c gi\u1EEF tr\u00EAn m\u00E2y \u0111\u1EC3 ph\u00F2ng ng\u1EEBa r\u1EE7i ro. Qu\u1EA3n tr\u1ECB vi\u00EAn c\u00F3 th\u1EC3 \"X\u00F3a v\u0129nh vi\u1EC5n\" \u0111\u1EC3 l\u00E0m s\u1EA1ch.</div>\r\n                            </div>\r\n                            <button (click)=\"openRecycleBin()\" class=\"bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-800 transition shadow-sm\">\r\n                                M\u1EDF Th\u00F9ng R\u00E1c\r\n                            </button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- 5. RESOURCES (Compact) -->\r\n            <div class=\"bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-4\">\r\n                <div class=\"flex justify-between items-center\">\r\n                    <h3 class=\"font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-base\">\r\n                        <div class=\"w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center\"><i class=\"fa-solid fa-hard-drive\"></i></div>\r\n                        T\u00E0i Nguy\u00EAn\r\n                    </h3>\r\n                    <button (click)=\"loadUsage()\" class=\"text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 px-2 py-1 rounded text-slate-600 dark:text-slate-300\"><i class=\"fa-solid fa-rotate\"></i> Check</button>\r\n                </div>\r\n                @if(storageEstimate(); as stat) {\r\n                    <div class=\"flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50\">\r\n                        <div class=\"text-xs font-bold text-slate-500 dark:text-slate-400\">T\u1ED5ng s\u1ED1 t\u00E0i li\u1EC7u</div>\r\n                        <div class=\"text-sm font-black text-slate-800 dark:text-slate-100\">{{stat.totalDocs}}</div>\r\n                    </div>\r\n                }\r\n            </div>\r\n\r\n            <!-- 6. DATA ARCHIVER -->\r\n            <div class=\"bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-200 dark:border-rose-900/30 p-6 flex flex-col gap-4\">\r\n                <div class=\"flex justify-between items-start\">\r\n                    <div>\r\n                        <h3 class=\"font-bold text-rose-800 dark:text-rose-400 flex items-center gap-2 text-base\">\r\n                            <div class=\"w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 flex items-center justify-center\">\r\n                                <i class=\"fa-solid fa-boxes-packing\"></i>\r\n                            </div>\r\n                            Kho L\u01B0u Tr\u1EEF & Ph\u1EE5c H\u1ED3i\r\n                        </h3>\r\n                        <p class=\"text-[10px] text-rose-600/80 dark:text-rose-400/80 mt-1\">Xu\u1EA5t d\u1EEF li\u1EC7u c\u0169 ra Excel v\u00E0 x\u00F3a kh\u1ECFi Firebase \u0111\u1EC3 b\u1EA3o v\u1EC7 1GB dung l\u01B0\u1EE3ng.</p>\r\n                    </div>\r\n                    <label class=\"text-[10px] bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-bold transition flex items-center gap-2 cursor-pointer shadow-sm\">\r\n                        <i class=\"fa-solid fa-cloud-arrow-up text-blue-500\"></i> N\u1EA1p l\u1EA1i Excel\r\n                        <input type=\"file\" class=\"hidden\" accept=\".xlsx\" (change)=\"importArchiverData($event)\">\r\n                    </label>\r\n                </div>\r\n\r\n                <div class=\"flex items-center gap-2\">\r\n                    <span class=\"text-xs font-bold text-slate-600 dark:text-slate-400\">D\u1ECDn b\u1EA3n ghi c\u0169 h\u01A1n:</span>\r\n                    <select [(ngModel)]=\"archiverDays\" class=\"bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-bold outline-none cursor-pointer\">\r\n                        <option [value]=\"90\">3 Th\u00E1ng (90 ng\u00E0y)</option>\r\n                        <option [value]=\"180\">6 Th\u00E1ng (180 ng\u00E0y)</option>\r\n                        <option [value]=\"365\">1 N\u0103m (365 ng\u00E0y)</option>\r\n                        <option [value]=\"730\">2 N\u0103m (730 ng\u00E0y)</option>\r\n                    </select>\r\n                </div>\r\n\r\n                @if(archiverStatus() === 'idle') {\r\n                    <button (click)=\"fetchArchiverData()\" class=\"w-full py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2\">\r\n                        <i class=\"fa-solid fa-file-excel text-green-400\"></i> B\u1EAFt \u0110\u1EA7u Tr\u00EDch Xu\u1EA5t\r\n                    </button>\r\n                } @else if(archiverStatus() === 'fetching') {\r\n                    <button disabled class=\"w-full py-2 bg-slate-300 dark:bg-slate-800 text-slate-500 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-wait\">\r\n                        <i class=\"fa-solid fa-spinner fa-spin\"></i> \u0110ang T\u1EA3i D\u1EEF Li\u1EC7u...\r\n                    </button>\r\n                } @else if(archiverStatus() === 'exporting') {\r\n                    <button disabled class=\"w-full py-2 bg-slate-300 dark:bg-slate-800 text-slate-500 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-wait\">\r\n                        <i class=\"fa-solid fa-spinner fa-spin\"></i> \u0110ang T\u1EA1o T\u1EC7p Excel...\r\n                    </button>\r\n                } @else if(archiverStatus() === 'deleting') {\r\n                    <button disabled class=\"w-full py-2 bg-red-300 dark:bg-red-900/50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-wait\">\r\n                        <i class=\"fa-solid fa-spinner fa-spin\"></i> \u0110ang D\u1ECDn D\u1EB9p H\u1EC7 Th\u1ED1ng...\r\n                    </button>\r\n                } @else if(archiverStatus() === 'restoring') {\r\n                    <button disabled class=\"w-full py-2 bg-blue-300 dark:bg-blue-900/50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-wait\">\r\n                        <i class=\"fa-solid fa-spinner fa-spin\"></i> \u0110ang N\u1EA1p L\u1EA1i D\u1EEF Li\u1EC7u...\r\n                    </button>\r\n                } @else if(archiverStatus() === 'ready_to_delete') {\r\n                    <div class=\"bg-white dark:bg-slate-800 rounded-xl p-3 border border-rose-200 dark:border-rose-900/50 text-center\">\r\n                        <p class=\"text-xs font-bold text-green-600 dark:text-green-400 mb-2\">\u0110\u00E3 l\u01B0u t\u1EC7p Excel th\u00E0nh c\u00F4ng!</p>\r\n                        <p class=\"text-[10px] text-slate-500 dark:text-slate-400 mb-3\">S\u1EB5n s\u00E0ng d\u1ECDn d\u1EB9p {{archiverData().logs.length + archiverData().requests.length}} b\u1EA3n ghi.</p>\r\n                        <div class=\"flex gap-2\">\r\n                            <button (click)=\"cancelArchiver()\" class=\"flex-1 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition\">H\u1EE7y</button>\r\n                            <button (click)=\"confirmDeleteArchiver()\" class=\"flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2\">\r\n                                <i class=\"fa-solid fa-trash-can\"></i> X\u00F3a V\u0129nh Vi\u1EC5n\r\n                            </button>\r\n                        </div>\r\n                    </div>\r\n                }\r\n\r\n            </div>\r\n\r\n        </div>\r\n\r\n    </div>\r\n\r\n    <!-- MIGRATION PANEL -->\r\n    <div class=\"bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none border border-amber-200 dark:border-amber-900/40 p-6 flex flex-col gap-4 mt-6\">\r\n        <div class=\"flex items-center justify-between\">\r\n            <h3 class=\"font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-base\">\r\n                <div class=\"w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center\"><i class=\"fa-solid fa-database\"></i></div>\r\n                Migration D\u1EEF Li\u1EC7u H\u1EC7 Th\u1ED1ng\r\n            </h3>\r\n            <span class=\"text-[10px] text-slate-400 dark:text-slate-500 font-bold bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded\">Ch\u1EC9 Admin</span>\r\n        </div>\r\n        <p class=\"text-xs text-slate-500 dark:text-slate-400\">Ghi <code class=\"font-mono bg-slate-100 dark:bg-slate-700 px-1 rounded\">lastUpdated</code> cho c\u00E1c document c\u0169 trong <strong>inventory</strong>, <strong>sops</strong> v\u00E0 <strong>logs</strong> \u0111\u1EC3 DeltaSync cursor ho\u1EA1t \u0111\u1ED9ng \u0111\u00FAng. Thao t\u00E1c idempotent \u2014 an to\u00E0n khi ch\u1EA1y l\u1EA1i.</p>\r\n        <button (click)=\"runLastUpdatedMigration()\"\r\n            [disabled]=\"isMigrating()\"\r\n            class=\"w-full py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-wait text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm\">\r\n            @if (isMigrating()) {\r\n                <i class=\"fa-solid fa-spinner fa-spin\"></i> \u0110ang ch\u1EA1y migration...\r\n            } @else {\r\n                <i class=\"fa-solid fa-wand-magic-sparkles\"></i> Ch\u1EA1y Migration lastUpdated\r\n            }\r\n        </button>\r\n        @if (migrationLog().length > 0) {\r\n            <div class=\"bg-slate-900 dark:bg-slate-950 rounded-xl p-4 font-mono text-[11px] text-slate-300 max-h-48 overflow-y-auto flex flex-col gap-1\">\r\n                @for (line of migrationLog(); track $index) {\r\n                    <div>{{ line }}</div>\r\n                }\r\n            </div>\r\n            <button (click)=\"migrationLog.set([])\" class=\"text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition self-end\">X\u00F3a log</button>\r\n        }\r\n    </div>\r\n\r\n    <!-- RECYCLE BIN MODAL -->\r\n    @if (showRecycleBin()) {\r\n        <div class=\"fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm animate-fade-in\" style=\"z-index: 100;\">\r\n            <div class=\"bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]\">\r\n                <!-- Modal Header -->\r\n                <div class=\"px-6 py-4 border-b border-rose-100 dark:border-rose-900/30 flex justify-between items-center bg-rose-50/50 dark:bg-rose-900/10\">\r\n                    <div class=\"flex items-center gap-3\">\r\n                        <div class=\"w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-800/50\">\r\n                            <i class=\"fa-solid fa-trash-can-arrow-up text-lg\"></i>\r\n                        </div>\r\n                        <div>\r\n                            <h3 class=\"text-base font-black text-rose-800 dark:text-rose-300\">Th\u00F9ng R\u00E1c D\u1EEF Li\u1EC7u</h3>\r\n                            <p class=\"text-[10px] font-bold text-rose-500/80 dark:text-rose-400/80\">Kh\u00F4i ph\u1EE5c thao t\u00E1c l\u1ED7i ho\u1EB7c X\u00F3a v\u0129nh vi\u1EC5n \u0111\u1EC3 l\u00E0m s\u1EA1ch h\u1EC7 th\u1ED1ng.</p>\r\n                        </div>\r\n                    </div>\r\n                    <button (click)=\"showRecycleBin.set(false)\" class=\"w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition\">\r\n                        <i class=\"fa-solid fa-xmark\"></i>\r\n                    </button>\r\n                </div>\r\n\r\n                <!-- Modal Body -->\r\n                <div class=\"p-6 overflow-y-auto custom-scrollbar flex-1 relative bg-slate-50/30 dark:bg-slate-900/20\">\r\n                    @if(isRecycling()) {\r\n                        <div class=\"absolute inset-0 z-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex flex-col items-center justify-center text-rose-600 dark:text-rose-400\">\r\n                            <i class=\"fa-solid fa-circle-notch fa-spin text-4xl mb-3\"></i>\r\n                            <span class=\"text-sm font-bold\">\u0110ang x\u1EED l\u00FD d\u1EEF li\u1EC7u h\u1EC7 th\u1ED1ng...</span>\r\n                        </div>\r\n                    }\r\n\r\n                    <table class=\"w-full text-sm text-left border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm\">\r\n                        <thead class=\"bg-slate-100 dark:bg-slate-800/50 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest\">\r\n                            <tr>\r\n                                <th class=\"px-4 py-3\">Lo\u1EA1i Module</th>\r\n                                <th class=\"px-4 py-3\">M\u00E3 \u0111\u1ECBnh danh</th>\r\n                                <th class=\"px-4 py-3 text-center\">T\u00EAn hi\u1EC3n th\u1ECB / Th\u00F4ng tin</th>\r\n                                <th class=\"px-4 py-3 text-center w-32\">Thao t\u00E1c</th>\r\n                            </tr>\r\n                        </thead>\r\n                        <tbody class=\"divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700\">\r\n                            @for (item of recycleItems(); track $index) {\r\n                                <tr class=\"hover:bg-slate-50 dark:hover:bg-slate-700/50 transition\">\r\n                                    <td class=\"px-4 py-3 align-middle font-bold text-[10px]\">\r\n                                        @if(item.type === 'inventory') {\r\n                                            <span class=\"px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md\">H\u00F3a ch\u1EA5t trong kho</span>\r\n                                        } @else {\r\n                                            <span class=\"px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-md\">Ch\u1EA5t chu\u1EA9n \u0111\u1ED1i chi\u1EBFu</span>\r\n                                        }\r\n                                    </td>\r\n                                    <td class=\"px-4 py-3 font-mono text-[10px] font-bold text-slate-600 dark:text-slate-400\">{{item.id}}</td>\r\n                                    <td class=\"px-4 py-3\">\r\n                                        <div class=\"text-xs font-bold text-slate-800 dark:text-slate-200 text-center\">{{item.name}}</div>\r\n                                    </td>\r\n                                    <td class=\"px-4 py-3 justify-center flex gap-2\">\r\n                                        <button (click)=\"restoreRecycleItem(item)\" class=\"w-8 h-8 rounded bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 hover:bg-teal-600 hover:text-white transition flex items-center justify-center font-bold shadow-sm\" title=\"Kh\u00F4i ph\u1EE5c (Restore)\">\r\n                                            <i class=\"fa-solid fa-rotate-left\"></i>\r\n                                        </button>\r\n                                    </td>\r\n                                </tr>\r\n                            }\r\n                            @if (recycleItems().length === 0) {\r\n                                <tr>\r\n                                    <td colspan=\"4\" class=\"p-12 text-center text-slate-400 dark:text-slate-500 italic text-sm\">\r\n                                        <i class=\"fa-solid fa-leaf text-2xl text-emerald-400 mb-3 block opacity-80\"></i>\r\n                                        Kh\u00F4ng c\u00F3 d\u1EEF li\u1EC7u n\u00E0o trong th\u00F9ng r\u00E1c.\r\n                                    </td>\r\n                                </tr>\r\n                            }\r\n                        </tbody>\r\n                    </table>\r\n                </div>\r\n\r\n                <!-- Modal Footer -->\r\n                <div class=\"px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row justify-between gap-4 items-center\">\r\n                    <div class=\"text-[10px] text-slate-500 dark:text-slate-400 font-bold md:w-1/2 leading-relaxed\">\r\n                        <i class=\"fa-solid fa-triangle-exclamation text-orange-500 mr-1\"></i> T\u00EDnh n\u0103ng D\u1ECDn r\u00E1c s\u1EBD <span class=\"text-rose-500\">X\u00D3A V\u0128NH VI\u1EC4N</span> to\u00E0n b\u1ED9 d\u1EEF li\u1EC7u \u1EDF tr\u00EAn kh\u1ECFi \u0111\u00E1m m\u00E2y v\u00E0 y\u00EAu c\u1EA7u c\u00E1c thi\u1EBFt b\u1ECB kh\u00E1c t\u1EA3i l\u1EA1i \u1EE9ng d\u1EE5ng.\r\n                    </div>\r\n                    <div class=\"flex gap-2 w-full md:w-auto shrink-0\">\r\n                        <button (click)=\"showRecycleBin.set(false)\" class=\"flex-1 md:flex-none px-4 py-2 bg-white dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl transition shadow-sm\">\u0110\u00F3ng</button>\r\n                        <button [disabled]=\"recycleItems().length === 0\" (click)=\"emptyRecycleBin()\" class=\"flex-1 md:flex-none px-6 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-2\">\r\n                            <i class=\"fa-solid fa-fire\"></i> D\u1ECDn R\u00E1c & \u00C9p L\u1EAFp R\u00E1p (Force Sync)\r\n                        </button>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    }\r\n" }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ConfigGeneralComponent, { className: "ConfigGeneralComponent", filePath: "src/app/features/config/components/config-general.component.ts", lineNumber: 22 }); })();
//# sourceMappingURL=config-general.component.js.map