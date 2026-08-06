import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService, PERMISSIONS } from '../../../core/services/auth.service';
import { StateService } from '../../../core/services/state.service';
import { ToastService } from '../../../core/services/toast.service';
import { getAvatarUrl } from '../../../shared/utils/utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
const _c0 = a0 => ({ "bg-indigo-50/40 dark:bg-indigo-950/30": a0 });
const _c1 = (a0, a1) => [a0, a1];
const _c2 = a0 => ({ "--tw-ring-color": a0 });
const _forTrack0 = ($index, $item) => $item.id;
const _forTrack1 = ($index, $item) => $item.uid;
const _forTrack2 = ($index, $item) => $item.name;
const _forTrack3 = ($index, $item) => $item.val;
function ConfigUsersComponent_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 11);
    i0.ɵɵelement(1, "i", 49);
    i0.ɵɵtext(2, " Ch\u1EDD duy\u1EC7t: ");
    i0.ɵɵelementStart(3, "strong");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r0.pendingCount());
} }
function ConfigUsersComponent_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 50);
    i0.ɵɵlistener("click", function ConfigUsersComponent_Conditional_17_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.resetFilters()); });
    i0.ɵɵelement(1, "i", 51);
    i0.ɵɵtext(2, " X\u00F3a L\u1ECDc ");
    i0.ɵɵelementEnd();
} }
function ConfigUsersComponent_Conditional_26_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 52);
    i0.ɵɵlistener("click", function ConfigUsersComponent_Conditional_26_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.searchQuery.set("")); });
    i0.ɵɵelement(1, "i", 53);
    i0.ɵɵelementEnd();
} }
function ConfigUsersComponent_For_52_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 33);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const r_r4 = ctx.$implicit;
    i0.ɵɵproperty("value", r_r4.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(r_r4.name);
} }
function ConfigUsersComponent_Conditional_69_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 72);
    i0.ɵɵlistener("click", function ConfigUsersComponent_Conditional_69_Conditional_10_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.batchApprovePending()); });
    i0.ɵɵelement(1, "i", 73);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" Duy\u1EC7t ", ctx_r0.selectedPendingCount(), " Ch\u1EDD duy\u1EC7t (Staff) ");
} }
function ConfigUsersComponent_Conditional_69_Conditional_21_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 33);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const r_r8 = ctx.$implicit;
    i0.ɵɵproperty("value", r_r8.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(r_r8.name);
} }
function ConfigUsersComponent_Conditional_69_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "select", 74);
    i0.ɵɵlistener("ngModelChange", function ConfigUsersComponent_Conditional_69_Conditional_21_Template_select_ngModelChange_0_listener($event) { i0.ɵɵrestoreView(_r7); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.batchRoleId.set($event)); });
    i0.ɵɵrepeaterCreate(1, ConfigUsersComponent_Conditional_69_Conditional_21_For_2_Template, 2, 2, "option", 33, _forTrack0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("ngModel", ctx_r0.batchRoleId());
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r0.rolesList());
} }
function ConfigUsersComponent_Conditional_69_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 37)(1, "div", 54)(2, "div", 55);
    i0.ɵɵelement(3, "i", 56);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div")(5, "div", 57);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "p", 58);
    i0.ɵɵtext(8, "\u00C1p d\u1EE5ng t\u00E1c v\u1EE5 ph\u00E2n quy\u1EC1n h\u00E0ng lo\u1EA1t cho c\u00E1c t\u00E0i kho\u1EA3n \u0111\u01B0\u1EE3c ch\u1ECDn");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(9, "div", 59);
    i0.ɵɵtemplate(10, ConfigUsersComponent_Conditional_69_Conditional_10_Template, 3, 1, "button", 60);
    i0.ɵɵelementStart(11, "div", 61)(12, "select", 62);
    i0.ɵɵlistener("ngModelChange", function ConfigUsersComponent_Conditional_69_Template_select_ngModelChange_12_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.batchRole.set($event)); });
    i0.ɵɵelementStart(13, "option", 63);
    i0.ɵɵtext(14, "Staff");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "option", 64);
    i0.ɵɵtext(16, "Manager");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "option", 65);
    i0.ɵɵtext(18, "Viewer");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "option", 66);
    i0.ɵɵtext(20, "Pending");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(21, ConfigUsersComponent_Conditional_69_Conditional_21_Template, 3, 1, "select", 67);
    i0.ɵɵelementStart(22, "button", 68);
    i0.ɵɵlistener("click", function ConfigUsersComponent_Conditional_69_Template_button_click_22_listener() { i0.ɵɵrestoreView(_r5); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.applyBatchRole()); });
    i0.ɵɵtext(23, " \u00C1p D\u1EE5ng ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(24, "button", 69);
    i0.ɵɵlistener("click", function ConfigUsersComponent_Conditional_69_Template_button_click_24_listener() { i0.ɵɵrestoreView(_r5); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.saveBatchUsers()); });
    i0.ɵɵelement(25, "i", 70);
    i0.ɵɵtext(26, " L\u01B0u T\u1EA5t C\u1EA3 \u0110\u00E3 Ch\u1ECDn ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "button", 71);
    i0.ɵɵlistener("click", function ConfigUsersComponent_Conditional_69_Template_button_click_27_listener() { i0.ɵɵrestoreView(_r5); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.clearSelection()); });
    i0.ɵɵtext(28, " B\u1ECF Ch\u1ECDn ");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate1("\u0110\u00E3 ch\u1ECDn ", ctx_r0.selectedCount(), " ng\u01B0\u1EDDi d\u00F9ng");
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r0.selectedPendingCount() > 0 ? 10 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngModel", ctx_r0.batchRole());
    i0.ɵɵadvance(9);
    i0.ɵɵconditional(ctx_r0.batchRole() === "staff" ? 21 : -1);
} }
function ConfigUsersComponent_For_84_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 81);
    i0.ɵɵtext(1, " \uD83D\uDC51 Super Admin ");
    i0.ɵɵelementEnd();
} }
function ConfigUsersComponent_For_84_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 82);
    i0.ɵɵtext(1, " Ch\u1EDD duy\u1EC7t ");
    i0.ɵɵelementEnd();
} }
function ConfigUsersComponent_For_84_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 83);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const u_r11 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵpropertyInterpolate1("title", "C\u00F3 ", u_r11.customPermissions.length, " quy\u1EC1n t\u00F9y ch\u1EC9nh ri\u00EAng");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" \u26A1 +", u_r11.customPermissions.length, " quy\u1EC1n ri\u00EAng ");
} }
function ConfigUsersComponent_For_84_Conditional_29_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 102);
    i0.ɵɵlistener("click", function ConfigUsersComponent_For_84_Conditional_29_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r12); const u_r11 = i0.ɵɵnextContext().$implicit; const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.quickApprovePending(u_r11)); });
    i0.ɵɵelement(1, "i", 73);
    i0.ɵɵtext(2, " Duy\u1EC7t Nhanh ");
    i0.ɵɵelementEnd();
} }
function ConfigUsersComponent_For_84_Conditional_30_For_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 33);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const r_r14 = ctx.$implicit;
    i0.ɵɵproperty("value", r_r14.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(r_r14.name);
} }
function ConfigUsersComponent_For_84_Conditional_30_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 91)(1, "label", 103);
    i0.ɵɵtext(2, "Nh\u00F3m vai tr\u00F2 nghi\u1EC7p v\u1EE5:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "select", 104);
    i0.ɵɵlistener("ngModelChange", function ConfigUsersComponent_For_84_Conditional_30_Template_select_ngModelChange_3_listener($event) { i0.ɵɵrestoreView(_r13); const u_r11 = i0.ɵɵnextContext().$implicit; const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.updateUserRoleId(u_r11, $event)); });
    i0.ɵɵrepeaterCreate(4, ConfigUsersComponent_For_84_Conditional_30_For_5_Template, 2, 2, "option", 33, _forTrack0);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const u_r11 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngModel", u_r11.roleId || "role_staff_default");
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r0.rolesList());
} }
function ConfigUsersComponent_For_84_Conditional_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 94);
    i0.ɵɵelement(1, "i", 105);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3, "T\u00E0i kho\u1EA3n Manager c\u00F3 to\u00E0n quy\u1EC1n h\u1EC7 th\u1ED1ng.");
    i0.ɵɵelementEnd()();
} }
function ConfigUsersComponent_For_84_Conditional_35_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 95);
    i0.ɵɵelement(1, "i", 106);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3, "T\u00E0i kho\u1EA3n Viewer ch\u1EC9 c\u00F3 quy\u1EC1n xem.");
    i0.ɵɵelementEnd()();
} }
function ConfigUsersComponent_For_84_Conditional_36_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 96);
    i0.ɵɵelement(1, "i", 107);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3, "\u0110ang ch\u1EDD Qu\u1EA3n tr\u1ECB vi\u00EAn duy\u1EC7t & c\u1EA5p quy\u1EC1n.");
    i0.ɵɵelementEnd()();
} }
function ConfigUsersComponent_For_84_Conditional_37_Template(rf, ctx) { if (rf & 1) {
    const _r15 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 108);
    i0.ɵɵlistener("click", function ConfigUsersComponent_For_84_Conditional_37_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r15); const u_r11 = i0.ɵɵnextContext().$implicit; const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.selectedUserForPerms.set(u_r11)); });
    i0.ɵɵelementStart(1, "div", 109);
    i0.ɵɵelement(2, "i", 110);
    i0.ɵɵelementStart(3, "span", 111);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(5, "i", 112);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const u_r11 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("C\u1EA5u h\u00ECnh quy\u1EC1n (", ctx_r0.getUserPermissionsCount(u_r11), ")");
} }
function ConfigUsersComponent_For_84_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 46)(1, "div", 75)(2, "input", 76);
    i0.ɵɵlistener("change", function ConfigUsersComponent_For_84_Template_input_change_2_listener() { const u_r11 = i0.ɵɵrestoreView(_r10).$implicit; const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.toggleSelectUser(u_r11.uid)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelement(3, "img", 77);
    i0.ɵɵelementStart(4, "div", 78)(5, "div", 79)(6, "span", 80);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(8, ConfigUsersComponent_For_84_Conditional_8_Template, 2, 0, "span", 81)(9, ConfigUsersComponent_For_84_Conditional_9_Template, 2, 0, "span", 82)(10, ConfigUsersComponent_For_84_Conditional_10_Template, 2, 3, "span", 83);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "div", 84);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "div", 85);
    i0.ɵɵlistener("click", function ConfigUsersComponent_For_84_Template_div_click_13_listener() { const u_r11 = i0.ɵɵrestoreView(_r10).$implicit; const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.copyUid(u_r11.uid)); });
    i0.ɵɵelement(14, "i", 86);
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(16, "div", 87)(17, "label", 88);
    i0.ɵɵtext(18, "Vai tr\u00F2 t\u00E0i kho\u1EA3n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "div", 2)(20, "select", 89);
    i0.ɵɵlistener("ngModelChange", function ConfigUsersComponent_For_84_Template_select_ngModelChange_20_listener($event) { const u_r11 = i0.ɵɵrestoreView(_r10).$implicit; const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.updateRole(u_r11, $event)); });
    i0.ɵɵelementStart(21, "option", 64);
    i0.ɵɵtext(22, "Manager (To\u00E0n quy\u1EC1n)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "option", 63);
    i0.ɵɵtext(24, "Staff (Nh\u00E2n vi\u00EAn)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "option", 65);
    i0.ɵɵtext(26, "Viewer (Ch\u1EC9 xem)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "option", 66);
    i0.ɵɵtext(28, "Pending (Ch\u1EDD duy\u1EC7t)");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(29, ConfigUsersComponent_For_84_Conditional_29_Template, 3, 0, "button", 90);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(30, ConfigUsersComponent_For_84_Conditional_30_Template, 6, 1, "div", 91);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "div", 92)(32, "label", 93);
    i0.ɵɵtext(33, "Ph\u00E2n quy\u1EC1n");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(34, ConfigUsersComponent_For_84_Conditional_34_Template, 4, 0, "div", 94)(35, ConfigUsersComponent_For_84_Conditional_35_Template, 4, 0, "div", 95)(36, ConfigUsersComponent_For_84_Conditional_36_Template, 4, 0, "div", 96)(37, ConfigUsersComponent_For_84_Conditional_37_Template, 6, 1, "button", 97);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(38, "div", 98)(39, "button", 99);
    i0.ɵɵlistener("click", function ConfigUsersComponent_For_84_Template_button_click_39_listener() { const u_r11 = i0.ɵɵrestoreView(_r10).$implicit; const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.saveUser(u_r11)); });
    i0.ɵɵelement(40, "i", 100);
    i0.ɵɵelementStart(41, "span", 101);
    i0.ɵɵtext(42, "L\u01B0u Thay \u0110\u1ED5i");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const u_r11 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction1(17, _c0, ctx_r0.selectedUids().has(u_r11.uid)));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("checked", ctx_r0.selectedUids().has(u_r11.uid));
    i0.ɵɵadvance();
    i0.ɵɵproperty("src", ctx_r0.getAvatarUrl(u_r11.displayName, ctx_r0.state.avatarStyle(), u_r11.photoURL), i0.ɵɵsanitizeUrl);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(u_r11.displayName);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.isSuperAdmin(u_r11) ? 8 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(u_r11.role === "pending" ? 9 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(u_r11.customPermissions && u_r11.customPermissions.length > 0 ? 10 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(u_r11.email);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", u_r11.uid.substring(0, 8), "... ");
    i0.ɵɵadvance(5);
    i0.ɵɵclassProp("text-orange-600", u_r11.role === "pending")("dark:text-orange-400", u_r11.role === "pending");
    i0.ɵɵproperty("ngModel", u_r11.role);
    i0.ɵɵadvance(9);
    i0.ɵɵconditional(u_r11.role === "pending" ? 29 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(u_r11.role === "staff" ? 30 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(u_r11.role === "manager" ? 34 : u_r11.role === "viewer" ? 35 : u_r11.role === "pending" ? 36 : 37);
} }
function ConfigUsersComponent_ForEmpty_85_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 47)(1, "div", 113);
    i0.ɵɵelement(2, "i", 114);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 115);
    i0.ɵɵtext(4, "Kh\u00F4ng t\u00ECm th\u1EA5y ng\u01B0\u1EDDi d\u00F9ng ph\u00F9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 116);
    i0.ɵɵtext(6, "Th\u1EED thay \u0111\u1ED5i t\u1EEB kh\u00F3a t\u00ECm ki\u1EBFm ho\u1EB7c b\u1EA5m n\u00FAt b\u00EAn d\u01B0\u1EDBi \u0111\u1EC3 \u0111\u1EB7t l\u1EA1i b\u1ED9 l\u1ECDc.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "button", 117);
    i0.ɵɵlistener("click", function ConfigUsersComponent_ForEmpty_85_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r9); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.resetFilters()); });
    i0.ɵɵelement(8, "i", 118);
    i0.ɵɵtext(9, " \u0110\u1EB7t L\u1EA1i T\u1EA5t C\u1EA3 B\u1ED9 L\u1ECDc ");
    i0.ɵɵelementEnd()();
} }
function ConfigUsersComponent_Conditional_86_For_16_For_6_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 143);
    i0.ɵɵtext(1, "K\u1EBF th\u1EEBa");
    i0.ɵɵelementEnd();
} }
function ConfigUsersComponent_Conditional_86_For_16_For_6_Template(rf, ctx) { if (rf & 1) {
    const _r17 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "label", 137)(1, "div", 54)(2, "div", 138)(3, "input", 139);
    i0.ɵɵlistener("change", function ConfigUsersComponent_Conditional_86_For_16_For_6_Template_input_change_3_listener() { const perm_r18 = i0.ɵɵrestoreView(_r17).$implicit; const user_r19 = i0.ɵɵnextContext(2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.togglePerm(user_r19, perm_r18.val)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelement(4, "div", 140)(5, "div", 141);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "span", 142);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(8, ConfigUsersComponent_Conditional_86_For_16_For_6_Conditional_8_Template, 2, 0, "span", 143);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const perm_r18 = ctx.$implicit;
    const group_r20 = i0.ɵɵnextContext().$implicit;
    const user_r19 = i0.ɵɵnextContext();
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("cursor-not-allowed", ctx_r0.isPermInherited(user_r19, perm_r18.val))("cursor-pointer", !ctx_r0.isPermInherited(user_r19, perm_r18.val));
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("checked", ctx_r0.isPermChecked(user_r19, perm_r18.val))("disabled", ctx_r0.isPermInherited(user_r19, perm_r18.val));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngStyle", i0.ɵɵpureFunction1(9, _c2, group_r20.ring));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(perm_r18.label);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.isPermInherited(user_r19, perm_r18.val) ? 8 : -1);
} }
function ConfigUsersComponent_Conditional_86_For_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 129)(1, "span", 133);
    i0.ɵɵelement(2, "i", 134);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 135);
    i0.ɵɵrepeaterCreate(5, ConfigUsersComponent_Conditional_86_For_16_For_6_Template, 9, 11, "label", 136, _forTrack3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const group_r20 = ctx.$implicit;
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction2(4, _c1, group_r20.bg, group_r20.border));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction2(7, _c1, group_r20.color, group_r20.border));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", group_r20.icon);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", group_r20.name, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(group_r20.perms);
} }
function ConfigUsersComponent_Conditional_86_Template(rf, ctx) { if (rf & 1) {
    const _r16 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 48)(1, "div", 119)(2, "div", 120)(3, "div", 121);
    i0.ɵɵelement(4, "img", 122);
    i0.ɵɵelementStart(5, "div")(6, "h3", 123);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "p", 124);
    i0.ɵɵelement(9, "i", 125);
    i0.ɵɵtext(10, " Ph\u00E2n quy\u1EC1n Ng\u01B0\u1EDDi d\u00F9ng");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(11, "button", 126);
    i0.ɵɵlistener("click", function ConfigUsersComponent_Conditional_86_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r16); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.closePermModal()); });
    i0.ɵɵelement(12, "i", 53);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "div", 127)(14, "div", 128);
    i0.ɵɵrepeaterCreate(15, ConfigUsersComponent_Conditional_86_For_16_Template, 7, 10, "div", 129, _forTrack2);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(17, "div", 130)(18, "button", 131);
    i0.ɵɵlistener("click", function ConfigUsersComponent_Conditional_86_Template_button_click_18_listener() { i0.ɵɵrestoreView(_r16); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.closePermModal()); });
    i0.ɵɵtext(19, "\u0110\u00F3ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "button", 132);
    i0.ɵɵlistener("click", function ConfigUsersComponent_Conditional_86_Template_button_click_20_listener() { const user_r19 = i0.ɵɵrestoreView(_r16); const ctx_r0 = i0.ɵɵnextContext(); ctx_r0.saveUser(user_r19); return i0.ɵɵresetView(ctx_r0.closePermModal()); });
    i0.ɵɵelement(21, "i", 70);
    i0.ɵɵtext(22, " L\u01B0u Thay \u0110\u1ED5i ");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const user_r19 = ctx;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("src", ctx_r0.getAvatarUrl(user_r19.displayName, ctx_r0.state.avatarStyle(), user_r19.photoURL), i0.ɵɵsanitizeUrl);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(user_r19.displayName);
    i0.ɵɵadvance(8);
    i0.ɵɵrepeater(ctx_r0.permissionGroups);
} }
export class ConfigUsersComponent {
    constructor() {
        this.fb = inject(FirebaseService);
        this.auth = inject(AuthService);
        this.state = inject(StateService);
        this.toast = inject(ToastService);
        this.getAvatarUrl = getAvatarUrl;
        this.userList = signal([]);
        this.selectedUserForPerms = signal(null);
        // SEARCH & FILTER SIGNALS
        this.searchQuery = signal('');
        this.roleFilter = signal('all'); // 'all' | 'pending' | 'staff' | 'manager' | 'viewer'
        this.roleIdFilter = signal('all'); // 'all' | role.id
        this.permStatusFilter = signal('all'); // 'all' | 'has_custom' | 'inherited_only'
        // SELECTION & BATCH ACTIONS SIGNALS
        this.selectedUids = signal(new Set());
        this.batchRole = signal('staff');
        this.batchRoleId = signal('role_staff_default');
        // COMPUTED STATS & FILTERED USERS
        this.totalCount = computed(() => this.userList().length);
        this.pendingCount = computed(() => this.userList().filter(u => u.role === 'pending').length);
        this.staffCount = computed(() => this.userList().filter(u => u.role === 'staff').length);
        this.managerCount = computed(() => this.userList().filter(u => u.role === 'manager').length);
        this.viewerCount = computed(() => this.userList().filter(u => u.role === 'viewer').length);
        this.hasActiveFilters = computed(() => {
            return !!this.searchQuery().trim() ||
                this.roleFilter() !== 'all' ||
                this.roleIdFilter() !== 'all' ||
                this.permStatusFilter() !== 'all';
        });
        this.filteredUsers = computed(() => {
            let list = this.userList();
            const query = this.searchQuery().trim().toLowerCase();
            const rFilter = this.roleFilter();
            const rIdFilter = this.roleIdFilter();
            const pFilter = this.permStatusFilter();
            // 1. Text Search Filter
            if (query) {
                list = list.filter(u => (u.displayName && u.displayName.toLowerCase().includes(query)) ||
                    (u.email && u.email.toLowerCase().includes(query)) ||
                    (u.uid && u.uid.toLowerCase().includes(query)));
            }
            // 2. Role Filter
            if (rFilter !== 'all') {
                list = list.filter(u => u.role === rFilter);
            }
            // 3. Specific Role Group Filter (roleId)
            if (rIdFilter !== 'all') {
                list = list.filter(u => (u.roleId || 'role_staff_default') === rIdFilter);
            }
            // 4. Custom Permission Status Filter
            if (pFilter === 'has_custom') {
                list = list.filter(u => u.customPermissions && u.customPermissions.length > 0);
            }
            else if (pFilter === 'inherited_only') {
                list = list.filter(u => !u.customPermissions || u.customPermissions.length === 0);
            }
            return list;
        });
        this.selectedCount = computed(() => this.selectedUids().size);
        this.selectedPendingCount = computed(() => {
            const selected = this.selectedUids();
            return this.userList().filter(u => selected.has(u.uid) && u.role === 'pending').length;
        });
        this.isAllSelected = computed(() => {
            const visible = this.filteredUsers();
            if (visible.length === 0)
                return false;
            const selected = this.selectedUids();
            return visible.every(u => selected.has(u.uid));
        });
        this.permissionGroups = [
            {
                name: 'Quản lý kho và hóa chất',
                icon: 'fa-box-open',
                color: 'text-emerald-500',
                bg: 'bg-emerald-50 dark:bg-emerald-900/20',
                border: 'border-emerald-100 dark:border-emerald-800/30',
                ring: 'var(--tw-colors-emerald-500, #10b981)',
                perms: [
                    { val: PERMISSIONS.INVENTORY_VIEW, label: 'Xem Kho' },
                    { val: PERMISSIONS.INVENTORY_EDIT, label: 'Sửa Kho (Nhập/Xuất/Xóa)' },
                    { val: PERMISSIONS.BATCH_RUN, label: 'Pha chế & Tiêu hao (Batch)' }
                ]
            },
            {
                name: 'Chất chuẩn đối chiếu',
                icon: 'fa-vial-circle-check',
                color: 'text-indigo-500',
                bg: 'bg-indigo-50 dark:bg-indigo-900/20',
                border: 'border-indigo-100 dark:border-indigo-800/30',
                ring: 'var(--tw-colors-indigo-500, #6366f1)',
                perms: [
                    { val: PERMISSIONS.STANDARD_VIEW, label: 'Xem chất chuẩn' },
                    { val: PERMISSIONS.STANDARD_REQUEST, label: 'Đăng ký mượn chất chuẩn' },
                    { val: PERMISSIONS.STANDARD_EDIT, label: 'Sửa thông tin chất chuẩn' },
                    { val: PERMISSIONS.STANDARD_APPROVE, label: 'Duyệt và giao nhận chất chuẩn' },
                    { val: PERMISSIONS.STANDARD_LOG_VIEW, label: 'Xem Báo cáo/Nhật ký sử dụng chất chuẩn' },
                    { val: PERMISSIONS.STANDARD_LOG_DELETE, label: 'Xóa yêu cầu và nhật ký chất chuẩn' }
                ]
            },
            {
                name: 'Quy trình SOP và công thức',
                icon: 'fa-book-open',
                color: 'text-amber-500',
                bg: 'bg-amber-50 dark:bg-amber-900/20',
                border: 'border-amber-100 dark:border-amber-800/30',
                ring: 'var(--tw-colors-amber-500, #f59e0b)',
                perms: [
                    { val: PERMISSIONS.SOP_VIEW, label: 'Xem SOP' },
                    { val: PERMISSIONS.SOP_EDIT, label: 'Biên soạn SOP' },
                    { val: PERMISSIONS.SOP_APPROVE, label: 'Phê duyệt SOP' },
                    { val: PERMISSIONS.RECIPE_VIEW, label: 'Xem công thức' },
                    { val: PERMISSIONS.RECIPE_EDIT, label: 'Sửa công thức' }
                ]
            },
            {
                name: 'Hệ thống và báo cáo',
                icon: 'fa-server',
                color: 'text-slate-500',
                bg: 'bg-slate-50 dark:bg-slate-800/50',
                border: 'border-slate-100 dark:border-slate-700/50',
                ring: 'var(--tw-colors-slate-500, #64748b)',
                perms: [
                    { val: PERMISSIONS.REPORT_VIEW, label: 'Xem Báo cáo Tổng hợp' },
                    { val: PERMISSIONS.USER_MANAGE, label: 'Quản trị nhân sự (Admin)' }
                ]
            }
        ];
        this.rolesList = signal([]);
        this.SUPER_ADMIN_EMAIL = 'oneloveonepeopleforever@gmail.com';
    }
    ngOnInit() {
        this.loadUsers();
        this.loadRoles();
    }
    async loadUsers() {
        try {
            const users = await this.fb.getAllUsers();
            this.userList.set(users);
        }
        catch (e) {
            this.userList.set([]);
        }
    }
    async loadRoles() {
        try {
            const roles = await this.fb.getRolesConfig();
            this.rolesList.set(roles);
        }
        catch (e) {
            this.rolesList.set([]);
        }
    }
    resetFilters() {
        this.searchQuery.set('');
        this.roleFilter.set('all');
        this.roleIdFilter.set('all');
        this.permStatusFilter.set('all');
    }
    // SELECTION HANDLERS
    toggleSelectUser(uid) {
        const next = new Set(this.selectedUids());
        if (next.has(uid)) {
            next.delete(uid);
        }
        else {
            next.add(uid);
        }
        this.selectedUids.set(next);
    }
    toggleSelectAll() {
        const next = new Set(this.selectedUids());
        const visible = this.filteredUsers();
        if (this.isAllSelected()) {
            visible.forEach(u => next.delete(u.uid));
        }
        else {
            visible.forEach(u => next.add(u.uid));
        }
        this.selectedUids.set(next);
    }
    clearSelection() {
        this.selectedUids.set(new Set());
    }
    // QUICK & BATCH ACTION HANDLERS
    async quickApprovePending(u) {
        const updatedUser = {
            ...u,
            role: 'staff',
            roleId: u.roleId || 'role_staff_default',
            customPermissions: u.customPermissions || []
        };
        this.userList.update(users => users.map(user => user.uid === u.uid ? updatedUser : user));
        await this.saveUser(updatedUser);
    }
    async batchApprovePending() {
        const selected = this.selectedUids();
        const pendingUsers = this.userList().filter(u => selected.has(u.uid) && u.role === 'pending');
        if (pendingUsers.length === 0)
            return;
        this.userList.update(users => users.map(u => {
            if (selected.has(u.uid) && u.role === 'pending') {
                const updated = {
                    ...u,
                    role: 'staff',
                    roleId: u.roleId || 'role_staff_default',
                    customPermissions: u.customPermissions || []
                };
                return updated;
            }
            return u;
        }));
        await this.saveBatchUsers();
    }
    applyBatchRole() {
        const targetRole = this.batchRole();
        const targetRoleId = this.batchRoleId();
        const selected = this.selectedUids();
        // SAFETY GUARD: Protect last manager(s) from being demoted in batch
        if (targetRole !== 'manager') {
            const currentManagers = this.userList().filter(u => u.role === 'manager');
            const remainingManagers = currentManagers.filter(u => !selected.has(u.uid));
            if (remainingManagers.length === 0) {
                this.toast.show('❌ Thao tác bị từ chối: Không thể hạ cấp toàn bộ Manager của hệ thống!', 'error');
                return;
            }
        }
        this.userList.update(users => users.map(u => {
            if (selected.has(u.uid)) {
                if (this.isSuperAdmin(u) && targetRole !== 'manager') {
                    return u; // Protect Super Admin from demotion
                }
                const updated = { ...u, role: targetRole };
                if (targetRole === 'viewer' || targetRole === 'pending') {
                    updated.permissions = [];
                    updated.customPermissions = [];
                    updated.roleId = '';
                }
                else if (targetRole === 'staff') {
                    updated.roleId = targetRoleId || 'role_staff_default';
                }
                return updated;
            }
            return u;
        }));
        this.toast.show(`Đã áp dụng vai trò "${targetRole}" cho ${selected.size} người dùng được chọn. Bấm "Lưu" để hoàn tất.`, 'info');
    }
    async saveBatchUsers() {
        const selected = this.selectedUids();
        const targets = this.userList().filter(u => selected.has(u.uid));
        if (targets.length === 0)
            return;
        try {
            let count = 0;
            for (const u of targets) {
                let resolvedPerms = [];
                if (u.role === 'manager') {
                    resolvedPerms = Object.values(PERMISSIONS);
                }
                else if (u.role === 'viewer' || u.role === 'pending') {
                    resolvedPerms = [];
                }
                else if (u.role === 'staff') {
                    const roleId = u.roleId || 'role_staff_default';
                    const role = this.rolesList().find(r => r.id === roleId);
                    const custom = u.customPermissions || [];
                    resolvedPerms = Array.from(new Set([
                        ...(role?.permissions || []),
                        ...custom
                    ]));
                }
                await this.fb.updateUserPermissions(u.uid, u.role, resolvedPerms, u.roleId || 'role_staff_default', u.customPermissions || []);
                count++;
            }
            this.toast.show(`Đã lưu thành công ${count} người dùng!`, 'success');
            this.clearSelection();
        }
        catch (e) {
            this.toast.show('Lỗi khi lưu danh sách người dùng.', 'error');
        }
    }
    updateUserRoleId(u, roleId) {
        this.userList.update(currentUsers => currentUsers.map(user => {
            if (user.uid === u.uid) {
                return { ...user, roleId: roleId };
            }
            return user;
        }));
    }
    isPermInherited(u, p) {
        if (u.role !== 'staff')
            return false;
        const roleId = u.roleId || 'role_staff_default';
        const role = this.rolesList().find(r => r.id === roleId);
        return role?.permissions?.includes(p) || false;
    }
    isPermChecked(u, p) {
        if (u.role === 'manager')
            return true;
        if (u.role === 'viewer')
            return false;
        if (u.role === 'pending')
            return false;
        // staff
        const inherited = this.isPermInherited(u, p);
        const custom = u.customPermissions?.includes(p) || false;
        return inherited || custom;
    }
    getUserPermissionsCount(u) {
        if (u.role === 'manager')
            return Object.keys(PERMISSIONS).length;
        if (u.role === 'viewer')
            return 0;
        if (u.role === 'pending')
            return 0;
        // staff
        const roleId = u.roleId || 'role_staff_default';
        const role = this.rolesList().find(r => r.id === roleId);
        const custom = u.customPermissions || [];
        const distinct = new Set([
            ...(role?.permissions || []),
            ...custom
        ]);
        return distinct.size;
    }
    hasPerm(u, p) { return u.permissions?.includes(p); }
    togglePerm(u, p) {
        if (this.isPermInherited(u, p))
            return;
        this.userList.update(currentUsers => currentUsers.map(user => {
            if (user.uid === u.uid) {
                const custom = user.customPermissions ? [...user.customPermissions] : [];
                const idx = custom.indexOf(p);
                if (idx > -1)
                    custom.splice(idx, 1);
                else
                    custom.push(p);
                const updatedUser = { ...user, customPermissions: custom };
                if (this.selectedUserForPerms()?.uid === u.uid) {
                    this.selectedUserForPerms.set(updatedUser);
                }
                return updatedUser;
            }
            return user;
        }));
    }
    isSuperAdmin(u) {
        return (u.email || '').toLowerCase() === this.SUPER_ADMIN_EMAIL;
    }
    updateRole(u, role) {
        // SAFETY GUARD: Protect Super Admin account
        if (this.isSuperAdmin(u) && role !== 'manager') {
            this.toast.show('Không thể hạ cấp tài khoản quản trị cao nhất.', 'error');
            return;
        }
        // SAFETY GUARD: Protect the last Manager account
        if (u.role === 'manager' && role !== 'manager') {
            const totalManagers = this.userList().filter(user => user.role === 'manager').length;
            if (totalManagers <= 1) {
                this.toast.show('Không thể hạ cấp quản trị viên cuối cùng. Hệ thống phải có ít nhất một quản trị viên.', 'error');
                return;
            }
        }
        this.userList.update(currentUsers => currentUsers.map(user => {
            if (user.uid === u.uid) {
                const updatedUser = { ...user, role: role };
                if (role === 'viewer' || role === 'pending') {
                    updatedUser.permissions = [];
                    updatedUser.customPermissions = [];
                    updatedUser.roleId = '';
                }
                else if (role === 'staff') {
                    updatedUser.roleId = 'role_staff_default';
                    updatedUser.customPermissions = [];
                }
                return updatedUser;
            }
            return user;
        }));
    }
    async saveUser(u) {
        try {
            let resolvedPerms = [];
            if (u.role === 'manager') {
                resolvedPerms = Object.values(PERMISSIONS);
            }
            else if (u.role === 'viewer' || u.role === 'pending') {
                resolvedPerms = [];
            }
            else if (u.role === 'staff') {
                const roleId = u.roleId || 'role_staff_default';
                const role = this.rolesList().find(r => r.id === roleId);
                const custom = u.customPermissions || [];
                resolvedPerms = Array.from(new Set([
                    ...(role?.permissions || []),
                    ...custom
                ]));
            }
            await this.fb.updateUserPermissions(u.uid, u.role, resolvedPerms, u.roleId || 'role_staff_default', u.customPermissions || []);
            this.toast.show(`Đã cập nhật ${u.displayName}`, 'success');
        }
        catch (e) {
            this.toast.show('Lỗi cập nhật.', 'error');
        }
    }
    closePermModal() {
        this.selectedUserForPerms.set(null);
    }
    copyUid(uid) { navigator.clipboard.writeText(uid).then(() => this.toast.show('Đã sao chép UID.')); }
    static { this.ɵfac = function ConfigUsersComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ConfigUsersComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ConfigUsersComponent, selectors: [["app-config-users"]], decls: 87, vars: 30, consts: [[1, "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-sm", "dark:shadow-none", "border", "border-slate-200", "dark:border-slate-700", "p-6", "flex", "flex-col", "gap-6", "fade-in"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-4", "border-b", "border-slate-100", "dark:border-slate-700/60", "pb-5"], [1, "flex", "items-center", "gap-2"], [1, "w-9", "h-9", "rounded-xl", "bg-indigo-50", "dark:bg-indigo-900/30", "text-indigo-600", "dark:text-indigo-400", "flex", "items-center", "justify-center", "font-bold", "text-base", "shadow-sm"], [1, "fa-solid", "fa-users-gear"], [1, "font-black", "text-slate-800", "dark:text-slate-100", "text-lg", "tracking-tight"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "mt-1"], [1, "flex", "flex-wrap", "items-center", "gap-2"], [1, "flex", "items-center", "bg-slate-100", "dark:bg-slate-900/60", "p-1", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "text-xs", "font-bold", "text-slate-600", "dark:text-slate-300"], [1, "px-2", "py-1", "rounded-lg", "bg-white", "dark:bg-slate-800", "shadow-xs", "text-slate-700", "dark:text-slate-200"], [1, "text-indigo-600", "dark:text-indigo-400"], [1, "px-2", "py-1", "text-orange-600", "dark:text-orange-400", "flex", "items-center", "gap-1"], [1, "px-3", "py-2", "bg-rose-50", "dark:bg-rose-950/30", "hover:bg-rose-100", "dark:hover:bg-rose-900/40", "text-rose-600", "dark:text-rose-400", "rounded-xl", "text-xs", "font-bold", "transition", "flex", "items-center", "gap-1.5", "border", "border-rose-200", "dark:border-rose-800/40"], [1, "px-3.5", "py-2", "bg-slate-100", "dark:bg-slate-700", "hover:bg-slate-200", "dark:hover:bg-slate-600", "text-slate-700", "dark:text-slate-200", "rounded-xl", "text-xs", "font-bold", "transition", "flex", "items-center", "gap-2", 3, "click"], [1, "fa-solid", "fa-rotate"], [1, "bg-slate-50", "dark:bg-slate-900/40", "p-4", "rounded-2xl", "border", "border-slate-200/80", "dark:border-slate-700/60", "flex", "flex-col", "gap-4"], [1, "flex", "flex-col", "lg:flex-row", "items-stretch", "lg:items-center", "gap-3"], [1, "relative", "flex-1"], [1, "fa-solid", "fa-magnifying-glass", "absolute", "left-3.5", "top-1/2", "-translate-y-1/2", "text-slate-400", "text-xs"], ["type", "text", "placeholder", "T\u00ECm t\u00EAn, email ho\u1EB7c UID...", 1, "w-full", "pl-9", "pr-9", "py-2.5", "text-xs", "md:text-sm", "font-bold", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-slate-800", "dark:text-slate-200", "placeholder-slate-400", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500/20", "focus:border-indigo-500", "transition", "shadow-xs", 3, "ngModelChange", "ngModel"], [1, "absolute", "right-3", "top-1/2", "-translate-y-1/2", "text-slate-400", "hover:text-slate-600", "dark:hover:text-slate-200", "text-xs"], [1, "flex", "items-center", "gap-1", "overflow-x-auto", "custom-scrollbar", "pb-1", "lg:pb-0", "shrink-0"], [1, "px-3", "py-2", "rounded-xl", "text-xs", "font-bold", "transition", "flex", "items-center", "gap-1.5", "shrink-0", 3, "click"], [1, "px-3", "py-2", "rounded-xl", "text-xs", "font-bold", "transition", "flex", "items-center", "gap-1.5", "shrink-0", "relative", 3, "click"], [1, "fa-solid", "fa-hourglass-half", "text-[10px]"], [1, "px-1.5", "py-0.2", "rounded-full", "text-[10px]"], [1, "fa-solid", "fa-user-gear", "text-[10px]"], [1, "fa-solid", "fa-user-shield", "text-[10px]"], [1, "fa-solid", "fa-eye", "text-[10px]"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3", "gap-3", "pt-2", "border-t", "border-slate-200/60", "dark:border-slate-700/40"], [1, "text-[11px]", "font-bold", "text-slate-500", "dark:text-slate-400", "uppercase", "tracking-wider", "shrink-0"], [1, "w-full", "text-xs", "font-bold", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "px-3", "py-2", "text-slate-700", "dark:text-slate-200", "focus:outline-none", "focus:border-indigo-500", "cursor-pointer", 3, "ngModelChange", "ngModel"], ["value", "all"], [3, "value"], ["value", "has_custom"], ["value", "inherited_only"], [1, "flex", "items-center", "justify-between", "sm:justify-end", "gap-2", "text-xs", "font-bold", "text-slate-500", "dark:text-slate-400"], [1, "bg-gradient-to-r", "from-indigo-900", "to-slate-900", "text-white", "p-4", "rounded-2xl", "shadow-xl", "border", "border-indigo-700/50", "flex", "flex-col", "md:flex-row", "items-start", "md:items-center", "justify-between", "gap-4", "animate-fade-in", "sticky", "top-4", "z-30"], [1, "bg-slate-50", "dark:bg-slate-900/10", "border", "border-slate-200", "dark:border-slate-700/60", "rounded-2xl", "overflow-hidden", "shadow-xs"], [1, "hidden", "md:grid", "grid-cols-12", "gap-4", "bg-slate-100/90", "dark:bg-slate-900/70", "px-6", "py-3.5", "text-xs", "text-slate-500", "dark:text-slate-400", "uppercase", "font-bold", "border-b", "border-slate-200", "dark:border-slate-700", "items-center"], [1, "col-span-4", "flex", "items-center", "gap-3"], ["type", "checkbox", 1, "w-4", "h-4", "rounded", "text-indigo-600", "focus:ring-indigo-500", "cursor-pointer", "accent-indigo-600", 3, "change", "checked"], [1, "col-span-3"], [1, "col-span-4"], [1, "col-span-1", "text-center"], [1, "flex", "flex-col", "md:divide-y", "md:divide-slate-200", "dark:md:divide-slate-700/50", "bg-slate-50/50", "md:bg-transparent", "dark:bg-slate-900/20", "md:dark:bg-transparent", "p-3", "md:p-0", "gap-3", "md:gap-0"], [1, "grid", "grid-cols-1", "md:grid-cols-12", "gap-4", "md:gap-4", "p-4", "md:px-6", "md:py-4", "hover:bg-slate-100/50", "dark:hover:bg-slate-700/30", "transition", "items-start", "bg-white", "md:bg-transparent", "shadow-sm", "md:shadow-none", "rounded-xl", "md:rounded-none", "border", "border-slate-200", "dark:border-slate-700", "md:border-none", 3, "ngClass"], [1, "p-12", "text-center", "text-slate-400", "dark:text-slate-500", "bg-white", "dark:bg-slate-800/60", "flex", "flex-col", "items-center", "justify-center", "gap-3"], [1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "p-4", "sm:p-6", "bg-slate-900/40", "dark:bg-slate-900/60", "backdrop-blur-sm", "animate-fade-in"], [1, "fa-solid", "fa-clock", "text-[10px]", "animate-pulse"], [1, "px-3", "py-2", "bg-rose-50", "dark:bg-rose-950/30", "hover:bg-rose-100", "dark:hover:bg-rose-900/40", "text-rose-600", "dark:text-rose-400", "rounded-xl", "text-xs", "font-bold", "transition", "flex", "items-center", "gap-1.5", "border", "border-rose-200", "dark:border-rose-800/40", 3, "click"], [1, "fa-solid", "fa-filter-circle-xmark"], [1, "absolute", "right-3", "top-1/2", "-translate-y-1/2", "text-slate-400", "hover:text-slate-600", "dark:hover:text-slate-200", "text-xs", 3, "click"], [1, "fa-solid", "fa-xmark"], [1, "flex", "items-center", "gap-3"], [1, "w-8", "h-8", "rounded-lg", "bg-indigo-500/20", "text-indigo-300", "flex", "items-center", "justify-center", "font-bold"], [1, "fa-solid", "fa-check-double"], [1, "font-black", "text-sm", "text-white"], [1, "text-[11px]", "text-indigo-200"], [1, "flex", "flex-wrap", "items-center", "gap-2.5", "w-full", "md:w-auto", "justify-end"], [1, "px-3.5", "py-2", "bg-amber-500", "hover:bg-amber-600", "text-white", "rounded-xl", "text-xs", "font-bold", "shadow-md", "transition", "flex", "items-center", "gap-1.5", "active:scale-95"], [1, "flex", "items-center", "gap-1", "bg-slate-800/80", "p-1", "rounded-xl", "border", "border-slate-700"], [1, "bg-slate-900", "text-xs", "font-bold", "text-slate-200", "border-none", "rounded-lg", "px-2.5", "py-1.5", "focus:outline-none", "cursor-pointer", 3, "ngModelChange", "ngModel"], ["value", "staff"], ["value", "manager"], ["value", "viewer"], ["value", "pending"], [1, "bg-slate-900", "text-xs", "font-bold", "text-amber-300", "border-none", "rounded-lg", "px-2.5", "py-1.5", "focus:outline-none", "cursor-pointer", "max-w-[140px]", "truncate", 3, "ngModel"], [1, "px-3", "py-1.5", "bg-indigo-600", "hover:bg-indigo-500", "text-white", "rounded-lg", "text-xs", "font-bold", "transition", 3, "click"], [1, "px-4", "py-2", "bg-emerald-600", "hover:bg-emerald-500", "text-white", "rounded-xl", "text-xs", "font-bold", "shadow-md", "transition", "flex", "items-center", "gap-1.5", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-floppy-disk"], [1, "px-3", "py-2", "bg-slate-800", "hover:bg-slate-700", "text-slate-300", "rounded-xl", "text-xs", "font-bold", "transition", 3, "click"], [1, "px-3.5", "py-2", "bg-amber-500", "hover:bg-amber-600", "text-white", "rounded-xl", "text-xs", "font-bold", "shadow-md", "transition", "flex", "items-center", "gap-1.5", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-user-check"], [1, "bg-slate-900", "text-xs", "font-bold", "text-amber-300", "border-none", "rounded-lg", "px-2.5", "py-1.5", "focus:outline-none", "cursor-pointer", "max-w-[140px]", "truncate", 3, "ngModelChange", "ngModel"], [1, "col-span-1", "md:col-span-4", "flex", "items-center", "gap-3.5"], ["type", "checkbox", 1, "w-4", "h-4", "rounded", "text-indigo-600", "focus:ring-indigo-500", "cursor-pointer", "accent-indigo-600", "shrink-0", 3, "change", "checked"], ["alt", "Avatar", 1, "w-10", "h-10", "md:w-9", "md:h-9", "rounded-full", "bg-slate-200", "dark:bg-slate-700", "border", "border-slate-300", "dark:border-slate-600", "shrink-0", "object-cover", 3, "src"], [1, "min-w-0", "flex-1"], [1, "flex", "items-center", "gap-2", "flex-wrap"], [1, "font-bold", "text-slate-800", "dark:text-slate-200", "truncate", "text-sm", "md:text-base"], [1, "px-2", "py-0.5", "bg-amber-100", "dark:bg-amber-950/40", "text-amber-800", "dark:text-amber-300", "text-[10px]", "font-black", "rounded-md", "border", "border-amber-300", "dark:border-amber-700/60", "shrink-0", "flex", "items-center", "gap-1"], [1, "px-2", "py-0.5", "bg-orange-100", "dark:bg-orange-950/40", "text-orange-700", "dark:text-orange-400", "text-[10px]", "font-extrabold", "rounded-md", "border", "border-orange-200", "dark:border-orange-800/40", "shrink-0"], [1, "px-2", "py-0.5", "bg-purple-100", "dark:bg-purple-950/40", "text-purple-700", "dark:text-purple-300", "text-[10px]", "font-extrabold", "rounded-md", "border", "border-purple-200", "dark:border-purple-800/40", "shrink-0", 3, "title"], [1, "text-xs", "text-slate-400", "dark:text-slate-500", "font-mono", "mt-0.5", "truncate"], ["title", "Nh\u1EA5n \u0111\u1EC3 sao ch\u00E9p UID", 1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "font-mono", "mt-0.5", "flex", "items-center", "gap-1", "cursor-pointer", "hover:text-indigo-600", "dark:hover:text-indigo-400", "w-fit", 3, "click"], [1, "fa-regular", "fa-copy"], [1, "col-span-1", "md:col-span-3", "flex", "flex-col", "gap-2"], [1, "md:hidden", "text-[10px]", "uppercase", "font-bold", "text-slate-400", "mb-1", "block"], [1, "w-full", "text-xs", "md:text-sm", "border", "border-slate-300", "dark:border-slate-600", "rounded-xl", "p-2", "md:p-2", "font-bold", "outline-none", "focus:border-indigo-500", "bg-slate-50", "md:bg-white", "dark:bg-slate-800", "dark:text-slate-200", "transition", 3, "ngModelChange", "ngModel"], ["title", "Duy\u1EC7t nhanh t\u00E0i kho\u1EA3n n\u00E0y th\u00E0nh Staff", 1, "px-3", "py-2", "bg-gradient-to-r", "from-emerald-600", "to-teal-600", "hover:from-emerald-700", "hover:to-teal-700", "text-white", "rounded-xl", "text-xs", "font-bold", "shadow-sm", "transition", "shrink-0", "flex", "items-center", "gap-1.5", "active:scale-95"], [1, "flex", "flex-col", "gap-1"], [1, "col-span-1", "md:col-span-4"], [1, "md:hidden", "text-[10px]", "uppercase", "font-bold", "text-slate-400", "mb-1.5", "block"], [1, "p-2.5", "bg-emerald-50", "dark:bg-emerald-950/30", "border", "border-emerald-200", "dark:border-emerald-900/40", "rounded-xl", "text-emerald-700", "dark:text-emerald-400", "text-xs", "font-bold", "flex", "items-center", "gap-2"], [1, "p-2.5", "bg-blue-50", "dark:bg-blue-950/30", "border", "border-blue-200", "dark:border-blue-900/40", "rounded-xl", "text-blue-700", "dark:text-blue-400", "text-xs", "font-bold", "flex", "items-center", "gap-2"], [1, "p-2.5", "bg-orange-50", "dark:bg-orange-950/30", "border", "border-orange-200", "dark:border-orange-900/40", "rounded-xl", "text-orange-700", "dark:text-orange-400", "text-xs", "font-bold", "flex", "items-center", "gap-2"], [1, "w-full", "text-left", "p-2.5", "min-w-0", "md:min-w-[200px]", "bg-slate-50", "md:bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "hover:border-indigo-400", "dark:hover:border-indigo-500", "hover:shadow-xs", "transition", "rounded-xl", "flex", "items-center", "justify-between", "group"], [1, "col-span-1", "md:col-span-1", "flex", "md:justify-center", "mt-2", "md:mt-0"], ["title", "L\u01B0u thay \u0111\u1ED5i cho ng\u01B0\u1EDDi d\u00F9ng n\u00E0y", 1, "w-full", "md:w-10", "h-10", "md:h-10", "rounded-xl", "bg-indigo-50", "md:bg-indigo-50/60", "dark:bg-indigo-900/30", "text-indigo-700", "dark:text-indigo-400", "hover:bg-indigo-600", "dark:hover:bg-indigo-500", "hover:text-white", "dark:hover:text-white", "transition", "flex", "items-center", "justify-center", "border", "border-indigo-200", "md:border-transparent", "dark:border-indigo-800/40", "font-bold", "gap-2", "text-sm", "shadow-xs", 3, "click"], [1, "fa-solid", "fa-floppy-disk", "text-base", "md:text-sm"], [1, "md:hidden"], ["title", "Duy\u1EC7t nhanh t\u00E0i kho\u1EA3n n\u00E0y th\u00E0nh Staff", 1, "px-3", "py-2", "bg-gradient-to-r", "from-emerald-600", "to-teal-600", "hover:from-emerald-700", "hover:to-teal-700", "text-white", "rounded-xl", "text-xs", "font-bold", "shadow-sm", "transition", "shrink-0", "flex", "items-center", "gap-1.5", "active:scale-95", 3, "click"], [1, "text-[10px]", "font-bold", "text-slate-400", "uppercase", "tracking-wider"], [1, "w-full", "text-xs", "md:text-sm", "border", "border-orange-300", "dark:border-orange-800/80", "rounded-xl", "p-2", "font-bold", "outline-none", "focus:border-orange-500", "bg-orange-50/50", "dark:bg-orange-950/20", "text-orange-800", "dark:text-orange-300", "transition", "cursor-pointer", 3, "ngModelChange", "ngModel"], [1, "fa-solid", "fa-shield-halved", "shrink-0", "text-emerald-500"], [1, "fa-solid", "fa-eye", "shrink-0", "text-blue-500"], [1, "fa-solid", "fa-hourglass-half", "shrink-0", "text-orange-500"], [1, "w-full", "text-left", "p-2.5", "min-w-0", "md:min-w-[200px]", "bg-slate-50", "md:bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "hover:border-indigo-400", "dark:hover:border-indigo-500", "hover:shadow-xs", "transition", "rounded-xl", "flex", "items-center", "justify-between", "group", 3, "click"], [1, "flex", "items-center", "gap-2", "text-xs", "md:text-sm", "font-bold", "text-slate-700", "dark:text-slate-200", "truncate"], [1, "fa-solid", "fa-sliders", "text-indigo-500", "shrink-0"], [1, "truncate"], [1, "fa-solid", "fa-chevron-right", "text-[10px]", "text-slate-400", "group-hover:text-indigo-500", "transition-colors"], [1, "w-12", "h-12", "rounded-2xl", "bg-slate-100", "dark:bg-slate-700/50", "flex", "items-center", "justify-center", "text-slate-400", "text-xl"], [1, "fa-solid", "fa-users-slash"], [1, "font-bold", "text-slate-600", "dark:text-slate-400", "text-sm"], [1, "text-xs", "text-slate-400", "dark:text-slate-500"], [1, "mt-1", "px-4", "py-2", "bg-indigo-50", "dark:bg-indigo-950/40", "text-indigo-600", "dark:text-indigo-400", "rounded-xl", "text-xs", "font-bold", "hover:bg-indigo-100", "transition", 3, "click"], [1, "fa-solid", "fa-rotate-left"], [1, "bg-white", "dark:bg-slate-800", "rounded-3xl", "shadow-xl", "border", "border-slate-200", "dark:border-slate-700", "w-full", "max-w-3xl", "overflow-hidden", "flex", "flex-col", "max-h-[90vh]"], [1, "px-6", "py-4", "border-b", "border-slate-100", "dark:border-slate-700", "flex", "justify-between", "items-center", "bg-slate-50/50", "dark:bg-slate-900/50"], [1, "flex", "items-center", "gap-4"], [1, "w-12", "h-12", "rounded-full", "border-2", "border-white", "dark:border-slate-700", "shadow-sm", "object-cover", 3, "src"], [1, "text-lg", "font-black", "text-slate-800", "dark:text-slate-100"], [1, "text-xs", "font-bold", "text-slate-500", "dark:text-slate-400", "flex", "items-center", "gap-1"], [1, "fa-solid", "fa-shield-halved"], [1, "w-8", "h-8", "flex", "items-center", "justify-center", "text-slate-400", "hover:text-red-500", "hover:bg-red-50", "dark:hover:bg-red-900/20", "rounded-full", "transition", 3, "click"], [1, "p-6", "overflow-y-auto", "custom-scrollbar", "flex-1", "space-y-6"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4"], [1, "rounded-2xl", "border", "p-4", "relative", "pt-5", 3, "ngClass"], [1, "px-6", "py-4", "border-t", "border-slate-100", "dark:border-slate-700", "bg-slate-50/50", "dark:bg-slate-900/50", "flex", "justify-end", "gap-3"], [1, "px-4", "py-2", "text-xs", "font-bold", "text-slate-600", "dark:text-slate-400", "hover:text-slate-800", "dark:hover:text-slate-200", "transition", 3, "click"], [1, "px-6", "py-2", "bg-blue-600", "hover:bg-blue-700", "text-white", "rounded-xl", "text-xs", "font-bold", "shadow-sm", "transition", "flex", "items-center", "gap-2", 3, "click"], [1, "absolute", "-top-3", "left-4", "px-2", "py-0.5", "text-[10px]", "font-black", "uppercase", "flex", "items-center", "gap-1.5", "rounded-lg", "bg-white", "dark:bg-slate-800", "border", "shadow-sm", 3, "ngClass"], [1, "fa-solid", 3, "ngClass"], [1, "flex", "flex-col", "gap-2", "mt-1"], [1, "flex", "items-center", "justify-between", "p-2", "rounded-xl", "hover:bg-white", "dark:hover:bg-slate-800/80", "transition", 3, "cursor-not-allowed", "cursor-pointer"], [1, "flex", "items-center", "justify-between", "p-2", "rounded-xl", "hover:bg-white", "dark:hover:bg-slate-800/80", "transition"], [1, "relative", "w-8", "h-4", "shrink-0", "mt-0.5"], ["type", "checkbox", 1, "peer", "sr-only", 3, "change", "checked", "disabled"], [1, "w-full", "h-full", "bg-slate-300", "dark:bg-slate-600", "rounded-full", "peer", "peer-checked:bg-[var(--tw-ring-color)]", "transition-colors", 3, "ngStyle"], [1, "absolute", "left-0.5", "top-0.5", "bg-white", "w-3", "h-3", "rounded-full", "transition-transform", "peer-checked:translate-x-4", "shadow"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300"], [1, "text-[9px]", "bg-slate-100", "dark:bg-slate-700", "text-slate-500", "dark:text-slate-400", "font-bold", "px-1.5", "py-0.5", "rounded", "border", "border-slate-200", "dark:border-slate-600/50"]], template: function ConfigUsersComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "div", 2)(4, "div", 3);
            i0.ɵɵelement(5, "i", 4);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "h3", 5);
            i0.ɵɵtext(7, " Danh S\u00E1ch Ng\u01B0\u1EDDi D\u00F9ng v\u00E0 Ph\u00E2n Quy\u1EC1n ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(8, "p", 6);
            i0.ɵɵtext(9, " Qu\u1EA3n l\u00FD t\u00E0i kho\u1EA3n, g\u00E1n nh\u00F3m vai tr\u00F2 nghi\u1EC7p v\u1EE5 v\u00E0 c\u1EA5p quy\u1EC1n chi ti\u1EBFt. ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(10, "div", 7)(11, "div", 8)(12, "span", 9);
            i0.ɵɵtext(13, " T\u1ED5ng: ");
            i0.ɵɵelementStart(14, "strong", 10);
            i0.ɵɵtext(15);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(16, ConfigUsersComponent_Conditional_16_Template, 5, 1, "span", 11);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(17, ConfigUsersComponent_Conditional_17_Template, 3, 0, "button", 12);
            i0.ɵɵelementStart(18, "button", 13);
            i0.ɵɵlistener("click", function ConfigUsersComponent_Template_button_click_18_listener() { return ctx.loadUsers(); });
            i0.ɵɵelement(19, "i", 14);
            i0.ɵɵtext(20, " T\u1EA3i L\u1EA1i ");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(21, "div", 15)(22, "div", 16)(23, "div", 17);
            i0.ɵɵelement(24, "i", 18);
            i0.ɵɵelementStart(25, "input", 19);
            i0.ɵɵlistener("ngModelChange", function ConfigUsersComponent_Template_input_ngModelChange_25_listener($event) { return ctx.searchQuery.set($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(26, ConfigUsersComponent_Conditional_26_Template, 2, 0, "button", 20);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(27, "div", 21)(28, "button", 22);
            i0.ɵɵlistener("click", function ConfigUsersComponent_Template_button_click_28_listener() { return ctx.roleFilter.set("all"); });
            i0.ɵɵtext(29);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(30, "button", 23);
            i0.ɵɵlistener("click", function ConfigUsersComponent_Template_button_click_30_listener() { return ctx.roleFilter.set("pending"); });
            i0.ɵɵelement(31, "i", 24);
            i0.ɵɵtext(32, " Ch\u1EDD Duy\u1EC7t ");
            i0.ɵɵelementStart(33, "span", 25);
            i0.ɵɵtext(34);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(35, "button", 22);
            i0.ɵɵlistener("click", function ConfigUsersComponent_Template_button_click_35_listener() { return ctx.roleFilter.set("staff"); });
            i0.ɵɵelement(36, "i", 26);
            i0.ɵɵtext(37);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(38, "button", 22);
            i0.ɵɵlistener("click", function ConfigUsersComponent_Template_button_click_38_listener() { return ctx.roleFilter.set("manager"); });
            i0.ɵɵelement(39, "i", 27);
            i0.ɵɵtext(40);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(41, "button", 22);
            i0.ɵɵlistener("click", function ConfigUsersComponent_Template_button_click_41_listener() { return ctx.roleFilter.set("viewer"); });
            i0.ɵɵelement(42, "i", 28);
            i0.ɵɵtext(43);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(44, "div", 29)(45, "div", 2)(46, "label", 30);
            i0.ɵɵtext(47, "Nh\u00F3m vai tr\u00F2:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(48, "select", 31);
            i0.ɵɵlistener("ngModelChange", function ConfigUsersComponent_Template_select_ngModelChange_48_listener($event) { return ctx.roleIdFilter.set($event); });
            i0.ɵɵelementStart(49, "option", 32);
            i0.ɵɵtext(50, "\u26A1 T\u1EA5t c\u1EA3 nh\u00F3m vai tr\u00F2");
            i0.ɵɵelementEnd();
            i0.ɵɵrepeaterCreate(51, ConfigUsersComponent_For_52_Template, 2, 2, "option", 33, _forTrack0);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(53, "div", 2)(54, "label", 30);
            i0.ɵɵtext(55, "Quy\u1EC1n h\u1EA1n:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(56, "select", 31);
            i0.ɵɵlistener("ngModelChange", function ConfigUsersComponent_Template_select_ngModelChange_56_listener($event) { return ctx.permStatusFilter.set($event); });
            i0.ɵɵelementStart(57, "option", 32);
            i0.ɵɵtext(58, "\uD83C\uDF10 T\u1EA5t c\u1EA3 tr\u1EA1ng th\u00E1i quy\u1EC1n");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(59, "option", 34);
            i0.ɵɵtext(60, "\u26A1 C\u00F3 quy\u1EC1n ri\u00EAng / t\u00F9y ch\u1EC9nh (Custom)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(61, "option", 35);
            i0.ɵɵtext(62, "\uD83D\uDCCB Ch\u1EC9 quy\u1EC1n theo Nh\u00F3m vai tr\u00F2");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(63, "div", 36)(64, "span");
            i0.ɵɵtext(65, "\u0110ang hi\u1EC3n th\u1ECB: ");
            i0.ɵɵelementStart(66, "strong", 10);
            i0.ɵɵtext(67);
            i0.ɵɵelementEnd();
            i0.ɵɵtext(68);
            i0.ɵɵelementEnd()()()();
            i0.ɵɵtemplate(69, ConfigUsersComponent_Conditional_69_Template, 29, 4, "div", 37);
            i0.ɵɵelementStart(70, "div", 38)(71, "div", 39)(72, "div", 40)(73, "input", 41);
            i0.ɵɵlistener("change", function ConfigUsersComponent_Template_input_change_73_listener() { return ctx.toggleSelectAll(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(74, "span");
            i0.ɵɵtext(75, "Ng\u01B0\u1EDDi d\u00F9ng");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(76, "div", 42);
            i0.ɵɵtext(77, "Vai tr\u00F2 (Role) & Nh\u00F3m");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(78, "div", 43);
            i0.ɵɵtext(79, "Quy\u1EC1n h\u1EA1n (Permissions)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(80, "div", 44);
            i0.ɵɵtext(81, "L\u01B0u");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(82, "div", 45);
            i0.ɵɵrepeaterCreate(83, ConfigUsersComponent_For_84_Template, 43, 19, "div", 46, _forTrack1, false, ConfigUsersComponent_ForEmpty_85_Template, 10, 0, "div", 47);
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(86, ConfigUsersComponent_Conditional_86_Template, 23, 2, "div", 48);
        } if (rf & 2) {
            let tmp_24_0;
            i0.ɵɵadvance(15);
            i0.ɵɵtextInterpolate(ctx.totalCount());
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.pendingCount() > 0 ? 16 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.hasActiveFilters() ? 17 : -1);
            i0.ɵɵadvance(8);
            i0.ɵɵproperty("ngModel", ctx.searchQuery());
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.searchQuery() ? 26 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵclassMap(ctx.roleFilter() === "all" ? "bg-indigo-600 text-white shadow-sm" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700");
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" T\u1EA5t c\u1EA3 (", ctx.totalCount(), ") ");
            i0.ɵɵadvance();
            i0.ɵɵclassMap(ctx.roleFilter() === "pending" ? "bg-orange-500 text-white shadow-sm" : "bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/40 hover:bg-orange-50 dark:hover:bg-orange-950/20");
            i0.ɵɵadvance(3);
            i0.ɵɵclassMap(ctx.roleFilter() === "pending" ? "bg-white/30 text-white" : "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300");
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.pendingCount(), " ");
            i0.ɵɵadvance();
            i0.ɵɵclassMap(ctx.roleFilter() === "staff" ? "bg-blue-600 text-white shadow-sm" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1(" Staff (", ctx.staffCount(), ") ");
            i0.ɵɵadvance();
            i0.ɵɵclassMap(ctx.roleFilter() === "manager" ? "bg-emerald-600 text-white shadow-sm" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1(" Manager (", ctx.managerCount(), ") ");
            i0.ɵɵadvance();
            i0.ɵɵclassMap(ctx.roleFilter() === "viewer" ? "bg-slate-700 text-white shadow-sm" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1(" Viewer (", ctx.viewerCount(), ") ");
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("ngModel", ctx.roleIdFilter());
            i0.ɵɵadvance(3);
            i0.ɵɵrepeater(ctx.rolesList());
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("ngModel", ctx.permStatusFilter());
            i0.ɵɵadvance(11);
            i0.ɵɵtextInterpolate(ctx.filteredUsers().length);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" / ", ctx.totalCount(), " ng\u01B0\u1EDDi d\u00F9ng");
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.selectedCount() > 0 ? 69 : -1);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("checked", ctx.isAllSelected());
            i0.ɵɵadvance(10);
            i0.ɵɵrepeater(ctx.filteredUsers());
            i0.ɵɵadvance(3);
            i0.ɵɵconditional((tmp_24_0 = ctx.selectedUserForPerms()) ? 86 : -1, tmp_24_0);
        } }, dependencies: [CommonModule, i1.NgClass, i1.NgStyle, FormsModule, i2.NgSelectOption, i2.ɵNgSelectMultipleOption, i2.DefaultValueAccessor, i2.SelectControlValueAccessor, i2.NgControlStatus, i2.NgModel], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ConfigUsersComponent, [{
        type: Component,
        args: [{
                selector: 'app-config-users',
                standalone: true,
                imports: [CommonModule, FormsModule],
                template: `
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-6 fade-in">
        
        <!-- TOP HEADER & QUICK STATS -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/60 pb-5">
            <div>
                <div class="flex items-center gap-2">
                    <div class="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-base shadow-sm">
                        <i class="fa-solid fa-users-gear"></i>
                    </div>
                    <h3 class="font-black text-slate-800 dark:text-slate-100 text-lg tracking-tight">
                        Danh Sách Người Dùng và Phân Quyền
                    </h3>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Quản lý tài khoản, gán nhóm vai trò nghiệp vụ và cấp quyền chi tiết.
                </p>
            </div>

            <!-- STAT BADGES & TOOLBAR ACTION -->
            <div class="flex flex-wrap items-center gap-2">
                <div class="flex items-center bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span class="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 shadow-xs text-slate-700 dark:text-slate-200">
                        Tổng: <strong class="text-indigo-600 dark:text-indigo-400">{{totalCount()}}</strong>
                    </span>
                    @if (pendingCount() > 0) {
                        <span class="px-2 py-1 text-orange-600 dark:text-orange-400 flex items-center gap-1">
                            <i class="fa-solid fa-clock text-[10px] animate-pulse"></i> Chờ duyệt: <strong>{{pendingCount()}}</strong>
                        </span>
                    }
                </div>

                @if (hasActiveFilters()) {
                    <button (click)="resetFilters()" 
                            class="px-3 py-2 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-rose-200 dark:border-rose-800/40">
                        <i class="fa-solid fa-filter-circle-xmark"></i> Xóa Lọc
                    </button>
                }

                <button (click)="loadUsers()" class="px-3.5 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-2">
                    <i class="fa-solid fa-rotate"></i> Tải Lại
                </button>
            </div>
        </div>

        <!-- SMART FILTER & SEARCH TOOLBAR -->
        <div class="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 flex flex-col gap-4">
            
            <!-- Row 1: Live Search Input + Quick Role Tabs -->
            <div class="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                <!-- Search Box -->
                <div class="relative flex-1">
                    <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                    <input type="text" 
                           [ngModel]="searchQuery()" 
                           (ngModelChange)="searchQuery.set($event)"
                           placeholder="Tìm tên, email hoặc UID..." 
                           class="w-full pl-9 pr-9 py-2.5 text-xs md:text-sm font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-xs">
                    @if (searchQuery()) {
                        <button (click)="searchQuery.set('')" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    }
                </div>

                <!-- Role Filter Tabs / Chips -->
                <div class="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 lg:pb-0 shrink-0">
                    <button (click)="roleFilter.set('all')" 
                            class="px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                            [class]="roleFilter() === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'">
                        Tất cả ({{totalCount()}})
                    </button>

                    <button (click)="roleFilter.set('pending')" 
                            class="px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 relative"
                            [class]="roleFilter() === 'pending' ? 'bg-orange-500 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/40 hover:bg-orange-50 dark:hover:bg-orange-950/20'">
                        <i class="fa-solid fa-hourglass-half text-[10px]"></i> Chờ Duyệt
                        <span class="px-1.5 py-0.2 rounded-full text-[10px]" [class]="roleFilter() === 'pending' ? 'bg-white/30 text-white' : 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300'">
                            {{pendingCount()}}
                        </span>
                    </button>

                    <button (click)="roleFilter.set('staff')" 
                            class="px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                            [class]="roleFilter() === 'staff' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'">
                        <i class="fa-solid fa-user-gear text-[10px]"></i> Staff ({{staffCount()}})
                    </button>

                    <button (click)="roleFilter.set('manager')" 
                            class="px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                            [class]="roleFilter() === 'manager' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'">
                        <i class="fa-solid fa-user-shield text-[10px]"></i> Manager ({{managerCount()}})
                    </button>

                    <button (click)="roleFilter.set('viewer')" 
                            class="px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                            [class]="roleFilter() === 'viewer' ? 'bg-slate-700 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'">
                        <i class="fa-solid fa-eye text-[10px]"></i> Viewer ({{viewerCount()}})
                    </button>
                </div>
            </div>

            <!-- Row 2: Advanced Dropdown Filters (Role Group & Custom Perm Status) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/40">
                <!-- Specific Role Group Dropdown -->
                <div class="flex items-center gap-2">
                    <label class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0">Nhóm vai trò:</label>
                    <select [ngModel]="roleIdFilter()" (ngModelChange)="roleIdFilter.set($event)"
                            class="w-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer">
                        <option value="all">⚡ Tất cả nhóm vai trò</option>
                        @for (r of rolesList(); track r.id) {
                            <option [value]="r.id">{{r.name}}</option>
                        }
                    </select>
                </div>

                <!-- Permission Status Dropdown -->
                <div class="flex items-center gap-2">
                    <label class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0">Quyền hạn:</label>
                    <select [ngModel]="permStatusFilter()" (ngModelChange)="permStatusFilter.set($event)"
                            class="w-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer">
                        <option value="all">🌐 Tất cả trạng thái quyền</option>
                        <option value="has_custom">⚡ Có quyền riêng / tùy chỉnh (Custom)</option>
                        <option value="inherited_only">📋 Chỉ quyền theo Nhóm vai trò</option>
                    </select>
                </div>

                <!-- Visible Results Counter -->
                <div class="flex items-center justify-between sm:justify-end gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span>Đang hiển thị: <strong class="text-indigo-600 dark:text-indigo-400">{{filteredUsers().length}}</strong> / {{totalCount()}} người dùng</span>
                </div>
            </div>
        </div>

        <!-- STICKY BATCH ACTIONS TOOLBAR (Appears when >= 1 user selected) -->
        @if (selectedCount() > 0) {
            <div class="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-4 rounded-2xl shadow-xl border border-indigo-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-in sticky top-4 z-30">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
                        <i class="fa-solid fa-check-double"></i>
                    </div>
                    <div>
                        <div class="font-black text-sm text-white">Đã chọn {{selectedCount()}} người dùng</div>
                        <p class="text-[11px] text-indigo-200">Áp dụng tác vụ phân quyền hàng loạt cho các tài khoản được chọn</p>
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
                    <!-- Quick Approve Pending Batch -->
                    @if (selectedPendingCount() > 0) {
                        <button (click)="batchApprovePending()" 
                                class="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 active:scale-95">
                            <i class="fa-solid fa-user-check"></i> Duyệt {{selectedPendingCount()}} Chờ duyệt (Staff)
                        </button>
                    }

                    <!-- Batch Set Role & Group Dropdowns -->
                    <div class="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
                        <select [ngModel]="batchRole()" (ngModelChange)="batchRole.set($event)" 
                                class="bg-slate-900 text-xs font-bold text-slate-200 border-none rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer">
                            <option value="staff">Staff</option>
                            <option value="manager">Manager</option>
                            <option value="viewer">Viewer</option>
                            <option value="pending">Pending</option>
                        </select>

                        @if (batchRole() === 'staff') {
                            <select [ngModel]="batchRoleId()" (ngModelChange)="batchRoleId.set($event)" 
                                    class="bg-slate-900 text-xs font-bold text-amber-300 border-none rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer max-w-[140px] truncate">
                                @for (r of rolesList(); track r.id) {
                                    <option [value]="r.id">{{r.name}}</option>
                                }
                            </select>
                        }

                        <button (click)="applyBatchRole()" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition">
                            Áp Dụng
                        </button>
                    </div>

                    <!-- Batch Save Button -->
                    <button (click)="saveBatchUsers()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 active:scale-95">
                        <i class="fa-solid fa-floppy-disk"></i> Lưu Tất Cả Đã Chọn
                    </button>

                    <!-- Clear Selection -->
                    <button (click)="clearSelection()" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition">
                        Bỏ Chọn
                    </button>
                </div>
            </div>
        }

        <!-- USER LIST CONTAINER -->
        <div class="bg-slate-50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-700/60 rounded-2xl overflow-hidden shadow-xs">
            
            <!-- Desktop Table Header -->
            <div class="hidden md:grid grid-cols-12 gap-4 bg-slate-100/90 dark:bg-slate-900/70 px-6 py-3.5 text-xs text-slate-500 dark:text-slate-400 uppercase font-bold border-b border-slate-200 dark:border-slate-700 items-center">
                <div class="col-span-4 flex items-center gap-3">
                    <input type="checkbox" 
                           [checked]="isAllSelected()" 
                           (change)="toggleSelectAll()" 
                           class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600">
                    <span>Người dùng</span>
                </div>
                <div class="col-span-3">Vai trò (Role) & Nhóm</div>
                <div class="col-span-4">Quyền hạn (Permissions)</div>
                <div class="col-span-1 text-center">Lưu</div>
            </div>
            
            <!-- List Items -->
            <div class="flex flex-col md:divide-y md:divide-slate-200 dark:md:divide-slate-700/50 bg-slate-50/50 md:bg-transparent dark:bg-slate-900/20 md:dark:bg-transparent p-3 md:p-0 gap-3 md:gap-0">
                @for (u of filteredUsers(); track u.uid) {
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-4 p-4 md:px-6 md:py-4 hover:bg-slate-100/50 dark:hover:bg-slate-700/30 transition items-start bg-white md:bg-transparent shadow-sm md:shadow-none rounded-xl md:rounded-none border border-slate-200 dark:border-slate-700 md:border-none"
                         [ngClass]="{ 'bg-indigo-50/40 dark:bg-indigo-950/30': selectedUids().has(u.uid) }">
                        
                        <!-- Col 1: Checkbox & User Info -->
                        <div class="col-span-1 md:col-span-4 flex items-center gap-3.5">
                            <input type="checkbox" 
                                   [checked]="selectedUids().has(u.uid)" 
                                   (change)="toggleSelectUser(u.uid)" 
                                   class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600 shrink-0">
                            
                            <img [src]="getAvatarUrl(u.displayName, state.avatarStyle(), u.photoURL)" class="w-10 h-10 md:w-9 md:h-9 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 shrink-0 object-cover" alt="Avatar">
                            
                            <div class="min-w-0 flex-1">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span class="font-bold text-slate-800 dark:text-slate-200 truncate text-sm md:text-base">{{u.displayName}}</span>
                                    
                                    <!-- Status Badges -->
                                    @if (isSuperAdmin(u)) {
                                        <span class="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[10px] font-black rounded-md border border-amber-300 dark:border-amber-700/60 shrink-0 flex items-center gap-1">
                                            👑 Super Admin
                                        </span>
                                    }
                                    @if (u.role === 'pending') {
                                        <span class="px-2 py-0.5 bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 text-[10px] font-extrabold rounded-md border border-orange-200 dark:border-orange-800/40 shrink-0">
                                            Chờ duyệt
                                        </span>
                                    }
                                    @if (u.customPermissions && u.customPermissions.length > 0) {
                                        <span class="px-2 py-0.5 bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-[10px] font-extrabold rounded-md border border-purple-200 dark:border-purple-800/40 shrink-0" 
                                              title="Có {{u.customPermissions.length}} quyền tùy chỉnh riêng">
                                            ⚡ +{{u.customPermissions.length}} quyền riêng
                                        </span>
                                    }
                                </div>

                                <div class="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5 truncate">{{u.email}}</div>
                                <div class="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 flex items-center gap-1 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 w-fit" (click)="copyUid(u.uid)" title="Nhấn để sao chép UID">
                                    <i class="fa-regular fa-copy"></i> {{u.uid.substring(0,8)}}...
                                </div>
                            </div>
                        </div>
                        
                        <!-- Col 2: Role & Role Group -->
                        <div class="col-span-1 md:col-span-3 flex flex-col gap-2">
                            <label class="md:hidden text-[10px] uppercase font-bold text-slate-400 mb-1 block">Vai trò tài khoản</label>
                            
                            <div class="flex items-center gap-2">
                                <select [ngModel]="u.role" (ngModelChange)="updateRole(u, $event)" 
                                        class="w-full text-xs md:text-sm border border-slate-300 dark:border-slate-600 rounded-xl p-2 md:p-2 font-bold outline-none focus:border-indigo-500 bg-slate-50 md:bg-white dark:bg-slate-800 dark:text-slate-200 transition"
                                        [class.text-orange-600]="u.role === 'pending'"
                                        [class.dark:text-orange-400]="u.role === 'pending'">
                                    <option value="manager">Manager (Toàn quyền)</option>
                                    <option value="staff">Staff (Nhân viên)</option>
                                    <option value="viewer">Viewer (Chỉ xem)</option>
                                    <option value="pending">Pending (Chờ duyệt)</option>
                                </select>

                                <!-- 1-Click Quick Approve for Pending Rows -->
                                @if (u.role === 'pending') {
                                    <button (click)="quickApprovePending(u)" 
                                            class="px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition shrink-0 flex items-center gap-1.5 active:scale-95"
                                            title="Duyệt nhanh tài khoản này thành Staff">
                                        <i class="fa-solid fa-user-check"></i> Duyệt Nhanh
                                    </button>
                                }
                            </div>
                            
                            @if (u.role === 'staff') {
                                <div class="flex flex-col gap-1">
                                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nhóm vai trò nghiệp vụ:</label>
                                    <select [ngModel]="u.roleId || 'role_staff_default'" (ngModelChange)="updateUserRoleId(u, $event)"
                                            class="w-full text-xs md:text-sm border border-orange-300 dark:border-orange-800/80 rounded-xl p-2 font-bold outline-none focus:border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 text-orange-800 dark:text-orange-300 transition cursor-pointer">
                                        @for (r of rolesList(); track r.id) {
                                            <option [value]="r.id">{{r.name}}</option>
                                        }
                                    </select>
                                </div>
                            }
                        </div>
                        
                        <!-- Col 3: Permissions Column -->
                        <div class="col-span-1 md:col-span-4">
                            <label class="md:hidden text-[10px] uppercase font-bold text-slate-400 mb-1.5 block">Phân quyền</label>
                            @if (u.role === 'manager') {
                                <div class="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 rounded-xl text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                                    <i class="fa-solid fa-shield-halved shrink-0 text-emerald-500"></i> <span>Tài khoản Manager có toàn quyền hệ thống.</span>
                                </div>
                            } @else if (u.role === 'viewer') {
                                <div class="p-2.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 rounded-xl text-blue-700 dark:text-blue-400 text-xs font-bold flex items-center gap-2">
                                    <i class="fa-solid fa-eye shrink-0 text-blue-500"></i> <span>Tài khoản Viewer chỉ có quyền xem.</span>
                                </div>
                            } @else if (u.role === 'pending') {
                                <div class="p-2.5 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40 rounded-xl text-orange-700 dark:text-orange-400 text-xs font-bold flex items-center gap-2">
                                    <i class="fa-solid fa-hourglass-half shrink-0 text-orange-500"></i> <span>Đang chờ Quản trị viên duyệt & cấp quyền.</span>
                                </div>
                            } @else {
                                <button (click)="selectedUserForPerms.set(u)" class="w-full text-left p-2.5 min-w-0 md:min-w-[200px] bg-slate-50 md:bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-xs transition rounded-xl flex items-center justify-between group">
                                    <div class="flex items-center gap-2 text-xs md:text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                                        <i class="fa-solid fa-sliders text-indigo-500 shrink-0"></i> 
                                        <span class="truncate">Cấu hình quyền ({{getUserPermissionsCount(u)}})</span>
                                    </div>
                                    <i class="fa-solid fa-chevron-right text-[10px] text-slate-400 group-hover:text-indigo-500 transition-colors"></i>
                                </button>
                            }
                        </div>
                        
                        <!-- Col 4: Save Single User -->
                        <div class="col-span-1 md:col-span-1 flex md:justify-center mt-2 md:mt-0">
                            <button (click)="saveUser(u)" 
                                    class="w-full md:w-10 h-10 md:h-10 rounded-xl bg-indigo-50 md:bg-indigo-50/60 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white dark:hover:text-white transition flex items-center justify-center border border-indigo-200 md:border-transparent dark:border-indigo-800/40 font-bold gap-2 text-sm shadow-xs" 
                                    title="Lưu thay đổi cho người dùng này">
                                <i class="fa-solid fa-floppy-disk text-base md:text-sm"></i> <span class="md:hidden">Lưu Thay Đổi</span>
                            </button>
                        </div>
                        
                    </div>
                } @empty {
                    <div class="p-12 text-center text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800/60 flex flex-col items-center justify-center gap-3">
                        <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center text-slate-400 text-xl">
                            <i class="fa-solid fa-users-slash"></i>
                        </div>
                        <div class="font-bold text-slate-600 dark:text-slate-400 text-sm">Không tìm thấy người dùng phù hợp với bộ lọc.</div>
                        <p class="text-xs text-slate-400 dark:text-slate-500">Thử thay đổi từ khóa tìm kiếm hoặc bấm nút bên dưới để đặt lại bộ lọc.</p>
                        <button (click)="resetFilters()" class="mt-1 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold hover:bg-indigo-100 transition">
                            <i class="fa-solid fa-rotate-left"></i> Đặt Lại Tất Cả Bộ Lọc
                        </button>
                    </div>
                }
            </div>
        </div>
    </div>

    <!-- USER PERMISSIONS MODAL -->
    @if (selectedUserForPerms(); as user) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                <!-- Modal Header -->
                <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div class="flex items-center gap-4">
                        <img [src]="getAvatarUrl(user.displayName, state.avatarStyle(), user.photoURL)" class="w-12 h-12 rounded-full border-2 border-white dark:border-slate-700 shadow-sm object-cover">
                        <div>
                            <h3 class="text-lg font-black text-slate-800 dark:text-slate-100">{{user.displayName}}</h3>
                            <p class="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1"><i class="fa-solid fa-shield-halved"></i> Phân quyền Người dùng</p>
                        </div>
                    </div>
                    <button (click)="closePermModal()" class="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                
                <!-- Modal Body -->
                <div class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        @for (group of permissionGroups; track group.name) {
                            <div class="rounded-2xl border p-4 relative pt-5" [ngClass]="[group.bg, group.border]">
                                <span class="absolute -top-3 left-4 px-2 py-0.5 text-[10px] font-black uppercase flex items-center gap-1.5 rounded-lg bg-white dark:bg-slate-800 border shadow-sm" [ngClass]="[group.color, group.border]">
                                    <i class="fa-solid" [ngClass]="group.icon"></i> {{group.name}}
                                </span>
                                <div class="flex flex-col gap-2 mt-1">
                                    @for (perm of group.perms; track perm.val) {
                                        <label class="flex items-center justify-between p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800/80 transition"
                                               [class.cursor-not-allowed]="isPermInherited(user, perm.val)"
                                               [class.cursor-pointer]="!isPermInherited(user, perm.val)">
                                            <div class="flex items-center gap-3">
                                                <div class="relative w-8 h-4 shrink-0 mt-0.5">
                                                    <input type="checkbox" 
                                                           [checked]="isPermChecked(user, perm.val)" 
                                                           [disabled]="isPermInherited(user, perm.val)"
                                                           (change)="togglePerm(user, perm.val)" 
                                                           class="peer sr-only">
                                                    <div class="w-full h-full bg-slate-300 dark:bg-slate-600 rounded-full peer peer-checked:bg-[var(--tw-ring-color)] transition-colors" [ngStyle]="{'--tw-ring-color': group.ring}"></div>
                                                    <div class="absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform peer-checked:translate-x-4 shadow"></div>
                                                </div>
                                                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{perm.label}}</span>
                                            </div>
                                            @if (isPermInherited(user, perm.val)) {
                                                <span class="text-[9px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600/50">Kế thừa</span>
                                            }
                                        </label>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
                    <button (click)="closePermModal()" class="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition">Đóng</button>
                    <button (click)="saveUser(user); closePermModal()" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2">
                        <i class="fa-solid fa-floppy-disk"></i> Lưu Thay Đổi
                    </button>
                </div>
            </div>
        </div>
    }
  `
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ConfigUsersComponent, { className: "ConfigUsersComponent", filePath: "src/app/features/config/components/config-users.component.ts", lineNumber: 425 }); })();
//# sourceMappingURL=config-users.component.js.map