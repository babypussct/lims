import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FirebaseService } from '../../core/services/firebase.service';
import { AuthService, PERMISSIONS, PERMISSION_NAMES } from '../../core/services/auth.service';
import { StateService } from '../../core/services/state.service';
import { ToastService } from '../../core/services/toast.service';
import { NotificationService } from '../../core/services/notification.service';
import { getAvatarUrl } from '../../shared/utils/utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
const ConfigComponent_Conditional_1_Conditional_33_Defer_1_DepsFn = () => [import("./components/config-general.component").then(m => m.ConfigGeneralComponent)];
const ConfigComponent_Conditional_1_Conditional_34_Defer_1_DepsFn = () => [import("./components/config-safety.component").then(m => m.ConfigSafetyComponent)];
const ConfigComponent_Conditional_1_Conditional_35_Defer_1_DepsFn = () => [import("./components/config-roles.component").then(m => m.ConfigRolesComponent)];
const ConfigComponent_Conditional_1_Conditional_36_Defer_1_DepsFn = () => [import("./components/config-users.component").then(m => m.ConfigUsersComponent)];
const _forTrack0 = ($index, $item) => $item.label;
function ConfigComponent_Conditional_1_Conditional_33_Defer_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-config-general");
} }
function ConfigComponent_Conditional_1_Conditional_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, ConfigComponent_Conditional_1_Conditional_33_Defer_0_Template, 1, 0);
    i0.ɵɵdefer(1, 0, ConfigComponent_Conditional_1_Conditional_33_Defer_1_DepsFn);
    i0.ɵɵdeferOnIdle();
} }
function ConfigComponent_Conditional_1_Conditional_34_Defer_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-config-safety");
} }
function ConfigComponent_Conditional_1_Conditional_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, ConfigComponent_Conditional_1_Conditional_34_Defer_0_Template, 1, 0);
    i0.ɵɵdefer(1, 0, ConfigComponent_Conditional_1_Conditional_34_Defer_1_DepsFn);
    i0.ɵɵdeferOnIdle();
} }
function ConfigComponent_Conditional_1_Conditional_35_Defer_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-config-roles");
} }
function ConfigComponent_Conditional_1_Conditional_35_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, ConfigComponent_Conditional_1_Conditional_35_Defer_0_Template, 1, 0);
    i0.ɵɵdefer(1, 0, ConfigComponent_Conditional_1_Conditional_35_Defer_1_DepsFn);
    i0.ɵɵdeferOnIdle();
} }
function ConfigComponent_Conditional_1_Conditional_36_Defer_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-config-users");
} }
function ConfigComponent_Conditional_1_Conditional_36_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, ConfigComponent_Conditional_1_Conditional_36_Defer_0_Template, 1, 0);
    i0.ɵɵdefer(1, 0, ConfigComponent_Conditional_1_Conditional_36_Defer_1_DepsFn);
    i0.ɵɵdeferOnIdle();
} }
function ConfigComponent_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 2)(1, "div", 3)(2, "div", 4);
    i0.ɵɵelement(3, "i", 5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div")(5, "h2", 6);
    i0.ɵɵtext(6, "C\u1EA5u H\u00ECnh H\u1EC7 Th\u1ED1ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "p", 7);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(9, "div", 8)(10, "button", 9);
    i0.ɵɵlistener("click", function ConfigComponent_Conditional_1_Template_button_click_10_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.enableNotifications()); });
    i0.ɵɵelement(11, "i", 10);
    i0.ɵɵtext(12, " B\u1EADt Th\u00F4ng B\u00E1o ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "div", 11);
    i0.ɵɵtext(14, " Version: ");
    i0.ɵɵelementStart(15, "span", 12);
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(17, "div", 13)(18, "button", 14);
    i0.ɵɵlistener("click", function ConfigComponent_Conditional_1_Template_button_click_18_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.activeTab.set("profile")); });
    i0.ɵɵelement(19, "i", 15);
    i0.ɵɵtext(20, " H\u1ED3 S\u01A1 C\u00E1 Nh\u00E2n ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "button", 14);
    i0.ɵɵlistener("click", function ConfigComponent_Conditional_1_Template_button_click_21_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.activeTab.set("general")); });
    i0.ɵɵelement(22, "i", 16);
    i0.ɵɵtext(23, " H\u1EC7 Th\u1ED1ng & D\u1EEF Li\u1EC7u ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "button", 14);
    i0.ɵɵlistener("click", function ConfigComponent_Conditional_1_Template_button_click_24_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.activeTab.set("safety")); });
    i0.ɵɵelement(25, "i", 17);
    i0.ɵɵtext(26, " \u0110\u1ECBnh M\u1EE9c & Ti\u00EAu Hao ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "button", 14);
    i0.ɵɵlistener("click", function ConfigComponent_Conditional_1_Template_button_click_27_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.activeTab.set("roles")); });
    i0.ɵɵelement(28, "i", 18);
    i0.ɵɵtext(29, " Nh\u00F3m Vai Tr\u00F2 ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "button", 14);
    i0.ɵɵlistener("click", function ConfigComponent_Conditional_1_Template_button_click_30_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.activeTab.set("users")); });
    i0.ɵɵelement(31, "i", 19);
    i0.ɵɵtext(32, " Ng\u01B0\u1EDDi D\u00F9ng & Ph\u00E2n Quy\u1EC1n ");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(33, ConfigComponent_Conditional_1_Conditional_33_Template, 3, 0)(34, ConfigComponent_Conditional_1_Conditional_34_Template, 3, 0)(35, ConfigComponent_Conditional_1_Conditional_35_Template, 3, 0)(36, ConfigComponent_Conditional_1_Conditional_36_Template, 3, 0);
} if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate1("Qu\u1EA3n tr\u1ECB vi\u00EAn: ", (tmp_2_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_2_0.displayName, ".");
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate(ctx_r1.state.systemVersion());
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r1.activeTab() === "profile" ? "border-indigo-600 dark:border-indigo-400 text-indigo-700 dark:text-indigo-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300");
    i0.ɵɵadvance(3);
    i0.ɵɵclassMap(ctx_r1.activeTab() === "general" ? "border-blue-600 dark:border-blue-400 text-blue-700 dark:text-blue-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300");
    i0.ɵɵadvance(3);
    i0.ɵɵclassMap(ctx_r1.activeTab() === "safety" ? "border-orange-600 dark:border-orange-400 text-orange-700 dark:text-orange-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300");
    i0.ɵɵadvance(3);
    i0.ɵɵclassMap(ctx_r1.activeTab() === "roles" ? "border-orange-600 dark:border-orange-400 text-orange-700 dark:text-orange-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300");
    i0.ɵɵadvance(3);
    i0.ɵɵclassMap(ctx_r1.activeTab() === "users" ? "border-blue-600 dark:border-blue-400 text-blue-700 dark:text-blue-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300");
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r1.activeTab() === "general" ? 33 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.activeTab() === "safety" ? 34 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.activeTab() === "roles" ? 35 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.activeTab() === "users" ? 36 : -1);
} }
function ConfigComponent_Conditional_2_ng_container_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainer(0);
} }
function ConfigComponent_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, ConfigComponent_Conditional_2_ng_container_0_Template, 1, 0, "ng-container", 20);
} if (rf & 2) {
    i0.ɵɵnextContext();
    const profileCard_r3 = i0.ɵɵreference(4);
    i0.ɵɵproperty("ngTemplateOutlet", profileCard_r3);
} }
function ConfigComponent_ng_template_3_Conditional_68_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 94);
    i0.ɵɵlistener("click", function ConfigComponent_ng_template_3_Conditional_68_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.showDeleteConfirm.set(true)); });
    i0.ɵɵelement(1, "i", 95);
    i0.ɵɵtext(2, " \u1EA8n danh ho\u00E1 th\u00F4ng tin");
    i0.ɵɵelementEnd();
} }
function ConfigComponent_ng_template_3_Conditional_69_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 65)(1, "p", 96);
    i0.ɵɵtext(2, "Email v\u00E0 \u1EA3nh \u0111\u1EA1i di\u1EC7n s\u1EBD b\u1ECB \u1EA9n danh ho\u00E1.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 97)(4, "button", 98);
    i0.ɵɵlistener("click", function ConfigComponent_ng_template_3_Conditional_69_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.showDeleteConfirm.set(false)); });
    i0.ɵɵtext(5, "H\u1EE7y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "button", 99);
    i0.ɵɵlistener("click", function ConfigComponent_ng_template_3_Conditional_69_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.anonymizeAccount()); });
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("disabled", ctx_r1.isAnonymizing());
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.isAnonymizing() ? "\u0110ang x\u1EED l\u00FD..." : "X\u00E1c nh\u1EADn");
} }
function ConfigComponent_ng_template_3_Conditional_91_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 79)(1, "div", 100);
    i0.ɵɵelement(2, "i", 101);
    i0.ɵɵtext(3, "\u0110\u00E3 li\u00EAn k\u1EBFt");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "button", 102);
    i0.ɵɵlistener("click", function ConfigComponent_ng_template_3_Conditional_91_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.unlinkProvider("google.com")); });
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("disabled", !ctx_r1.auth.canUnlinkProvider("google.com") || ctx_r1.unlinkingProvider() === "google.com");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.unlinkingProvider() === "google.com" ? "\u0110ang x\u1EED l\u00FD..." : ctx_r1.auth.canUnlinkProvider("google.com") ? "H\u1EE7y li\u00EAn k\u1EBFt" : "Kh\u00F3a an to\u00E0n");
} }
function ConfigComponent_ng_template_3_Conditional_92_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 103);
    i0.ɵɵlistener("click", function ConfigComponent_ng_template_3_Conditional_92_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r8); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.linkGoogle()); });
    i0.ɵɵtext(1, "Li\u00EAn k\u1EBFt");
    i0.ɵɵelementEnd();
} }
function ConfigComponent_ng_template_3_Conditional_93_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 81);
    i0.ɵɵelement(1, "i", 104);
    i0.ɵɵtext(2, "Kh\u00F4ng th\u1EC3 x\u00F3a ph\u01B0\u01A1ng th\u1EE9c cu\u1ED1i c\u00F9ng.");
    i0.ɵɵelementEnd();
} }
function ConfigComponent_ng_template_3_Conditional_105_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 105);
    i0.ɵɵelement(1, "i", 106);
    i0.ɵɵtext(2, "C\u1EA7n thi\u1EBFt l\u1EADp");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "button", 107);
    i0.ɵɵlistener("click", function ConfigComponent_ng_template_3_Conditional_105_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r9); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.auth.openPasswordSetup()); });
    i0.ɵɵtext(4, "Thi\u1EBFt l\u1EADp ngay");
    i0.ɵɵelementEnd();
} }
function ConfigComponent_ng_template_3_Conditional_106_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 100);
    i0.ɵɵelement(1, "i", 101);
    i0.ɵɵtext(2, "\u0110\u00E3 b\u1EADt");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 108)(4, "button", 107);
    i0.ɵɵlistener("click", function ConfigComponent_ng_template_3_Conditional_106_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.auth.openPasswordSetup()); });
    i0.ɵɵtext(5, "\u0110\u1ED5i m\u1EADt kh\u1EA9u");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "button", 102);
    i0.ɵɵlistener("click", function ConfigComponent_ng_template_3_Conditional_106_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r10); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.unlinkProvider("password")); });
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("disabled", !ctx_r1.auth.canUnlinkProvider("password") || ctx_r1.unlinkingProvider() === "password");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.unlinkingProvider() === "password" ? "\u0110ang x\u1EED l\u00FD..." : ctx_r1.auth.canUnlinkProvider("password") ? "X\u00F3a m\u1EADt kh\u1EA9u" : "Kh\u00F3a an to\u00E0n");
} }
function ConfigComponent_ng_template_3_Conditional_107_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 83);
    i0.ɵɵtext(1, "Ch\u01B0a b\u1EADt");
    i0.ɵɵelementEnd();
} }
function ConfigComponent_ng_template_3_Conditional_108_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 81);
    i0.ɵɵelement(1, "i", 104);
    i0.ɵɵtext(2, "Kh\u00F4ng th\u1EC3 x\u00F3a ph\u01B0\u01A1ng th\u1EE9c cu\u1ED1i c\u00F9ng.");
    i0.ɵɵelementEnd();
} }
function ConfigComponent_ng_template_3_Conditional_109_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 84);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.auth.googleRedirectError());
} }
function ConfigComponent_ng_template_3_Conditional_125_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 91);
    i0.ɵɵelement(1, "i", 109);
    i0.ɵɵtext(2, " Full System Access");
    i0.ɵɵelementEnd();
} }
function ConfigComponent_ng_template_3_Conditional_126_For_2_For_5_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 113);
    i0.ɵɵelement(1, "i", 114);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const permission_r11 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.permissionLabel(permission_r11));
} }
function ConfigComponent_ng_template_3_Conditional_126_For_2_For_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, ConfigComponent_ng_template_3_Conditional_126_For_2_For_5_Conditional_0_Template, 3, 1, "span", 113);
} if (rf & 2) {
    const permission_r11 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵconditional(ctx_r1.auth.hasPermission(permission_r11) ? 0 : -1);
} }
function ConfigComponent_ng_template_3_Conditional_126_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div")(1, "div", 111);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 112);
    i0.ɵɵrepeaterCreate(4, ConfigComponent_ng_template_3_Conditional_126_For_2_For_5_Template, 1, 1, null, null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const group_r12 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(group_r12.label);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(group_r12.permissions);
} }
function ConfigComponent_ng_template_3_Conditional_126_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 110);
    i0.ɵɵtext(1, "Ch\u01B0a \u0111\u01B0\u1EE3c c\u1EA5p quy\u1EC1n c\u1EE5 th\u1EC3.");
    i0.ɵɵelementEnd();
} }
function ConfigComponent_ng_template_3_Conditional_126_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 92);
    i0.ɵɵrepeaterCreate(1, ConfigComponent_ng_template_3_Conditional_126_For_2_Template, 6, 1, "div", null, _forTrack0);
    i0.ɵɵtemplate(3, ConfigComponent_ng_template_3_Conditional_126_Conditional_3_Template, 2, 0, "div", 110);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.permissionGroups);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.auth.userPermissions().length === 0 ? 3 : -1);
} }
function ConfigComponent_ng_template_3_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 21)(1, "div", 22)(2, "div", 23);
    i0.ɵɵelement(3, "div", 24)(4, "div", 25)(5, "div", 26);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 27)(7, "div", 28)(8, "div", 29);
    i0.ɵɵelement(9, "img", 30);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "div", 31)(11, "h2", 32);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "p", 33);
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "div", 34)(16, "span", 35);
    i0.ɵɵelement(17, "i", 36);
    i0.ɵɵtext(18);
    i0.ɵɵelementEnd()()()()();
    i0.ɵɵelementStart(19, "div", 37)(20, "div", 38)(21, "div", 39)(22, "label", 40);
    i0.ɵɵelement(23, "i", 41);
    i0.ɵɵtext(24, " \u0110\u1ECBnh danh ng\u01B0\u1EDDi d\u00F9ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "div", 42)(26, "div")(27, "div", 43);
    i0.ɵɵtext(28, "User ID (UID)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "div", 8)(30, "code", 44);
    i0.ɵɵtext(31);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "button", 45);
    i0.ɵɵlistener("click", function ConfigComponent_ng_template_3_Template_button_click_32_listener() { let tmp_3_0; i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.copyUid(((tmp_3_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_3_0.uid) || "")); });
    i0.ɵɵelement(33, "i", 46);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(34, "div")(35, "div", 43);
    i0.ɵɵtext(36, "App Context");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "div", 47);
    i0.ɵɵelement(38, "i", 48);
    i0.ɵɵtext(39);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(40, "div", 39)(41, "label", 40);
    i0.ɵɵelement(42, "i", 49);
    i0.ɵɵtext(43, " C\u00E1 nh\u00E2n h\u00F3a");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(44, "select", 50);
    i0.ɵɵlistener("ngModelChange", function ConfigComponent_ng_template_3_Template_select_ngModelChange_44_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.saveMyAvatarStyle($event)); });
    i0.ɵɵelementStart(45, "option", 51);
    i0.ɵɵtext(46, "\u2699\uFE0F M\u1EB7c \u0111\u1ECBnh h\u1EC7 th\u1ED1ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(47, "option", 52);
    i0.ɵɵtext(48, "\uD83D\uDCF7 \u1EA2nh Google");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(49, "option", 53);
    i0.ɵɵtext(50, "\uD83E\uDD16 Robot");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(51, "option", 54);
    i0.ɵɵtext(52, "\uD83D\uDE0A Bi\u1EC3u c\u1EA3m");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(53, "option", 55);
    i0.ɵɵtext(54, "\uD83C\uDFA8 Hi\u1EC7n \u0111\u1EA1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(55, "option", 56);
    i0.ɵɵtext(56, "\u270F\uFE0F V\u1EBD tay");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(57, "option", 57);
    i0.ɵɵtext(58, "\uD83D\uDD24 Ch\u1EEF c\u00E1i");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(59, "button", 58);
    i0.ɵɵlistener("click", function ConfigComponent_ng_template_3_Template_button_click_59_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.enableNotifications()); });
    i0.ɵɵelement(60, "i", 59);
    i0.ɵɵtext(61, " B\u1EADt Th\u00F4ng B\u00E1o \u0110\u1EA9y (PWA)");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(62, "div", 60)(63, "label", 61);
    i0.ɵɵelement(64, "i", 62);
    i0.ɵɵtext(65, " Qu\u1EA3n l\u00FD t\u00E0i kho\u1EA3n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(66, "p", 63);
    i0.ɵɵtext(67, "\u1EA8n danh ho\u00E1 email v\u00E0 avatar kh\u1ECFi h\u1EC7 th\u1ED1ng. T\u00EAn hi\u1EC3n th\u1ECB v\u00E0 UID v\u1EABn gi\u1EEF cho m\u1EE5c \u0111\u00EDch audit.");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(68, ConfigComponent_ng_template_3_Conditional_68_Template, 3, 0, "button", 64)(69, ConfigComponent_ng_template_3_Conditional_69_Template, 8, 2, "div", 65);
    i0.ɵɵelementStart(70, "a", 66);
    i0.ɵɵelement(71, "i", 67);
    i0.ɵɵtext(72, " Xem Ch\u00EDnh s\u00E1ch B\u1EA3o m\u1EADt");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(73, "div", 38)(74, "div", 68);
    i0.ɵɵelement(75, "div", 69);
    i0.ɵɵelementStart(76, "label", 70)(77, "span", 71);
    i0.ɵɵelement(78, "i", 17);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(79, " Auth Security Hub");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(80, "div", 72)(81, "div", 73)(82, "div", 74)(83, "div", 3)(84, "div", 75);
    i0.ɵɵelement(85, "i", 76);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(86, "div")(87, "div", 77);
    i0.ɵɵtext(88, "T\u00E0i kho\u1EA3n Google");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(89, "div", 78);
    i0.ɵɵtext(90, "\u0110\u0103ng nh\u1EADp m\u1ED9t ch\u1EA1m");
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(91, ConfigComponent_ng_template_3_Conditional_91_Template, 6, 2, "div", 79)(92, ConfigComponent_ng_template_3_Conditional_92_Template, 2, 0, "button", 80);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(93, ConfigComponent_ng_template_3_Conditional_93_Template, 3, 0, "p", 81);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(94, "div", 73)(95, "div", 74)(96, "div", 3)(97, "div", 75);
    i0.ɵɵelement(98, "i", 82);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(99, "div")(100, "div", 77);
    i0.ɵɵtext(101, "Gmail / m\u1EADt kh\u1EA9u LIMS");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(102, "div", 78);
    i0.ɵɵtext(103, "M\u1EADt kh\u1EA9u d\u1EF1 ph\u00F2ng ri\u00EAng c\u1EE7a LIMS");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(104, "div", 79);
    i0.ɵɵtemplate(105, ConfigComponent_ng_template_3_Conditional_105_Template, 5, 0)(106, ConfigComponent_ng_template_3_Conditional_106_Template, 8, 2)(107, ConfigComponent_ng_template_3_Conditional_107_Template, 2, 0, "div", 83);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(108, ConfigComponent_ng_template_3_Conditional_108_Template, 3, 0, "p", 81);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(109, ConfigComponent_ng_template_3_Conditional_109_Template, 2, 1, "div", 84);
    i0.ɵɵelementStart(110, "p", 85);
    i0.ɵɵtext(111, "Hai ph\u01B0\u01A1ng th\u1EE9c d\u00F9ng chung m\u1ED9t UID v\u00E0 d\u1EEF li\u1EC7u LIMS. M\u1EADt kh\u1EA9u LIMS kh\u00F4ng ph\u1EA3i m\u1EADt kh\u1EA9u Google.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(112, "div", 39)(113, "label", 40);
    i0.ɵɵelement(114, "i", 86);
    i0.ɵɵtext(115, " Nh\u1EADt k\u00FD b\u1EA3o m\u1EADt");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(116, "div", 87)(117, "span", 88);
    i0.ɵɵtext(118, "M\u1EADt kh\u1EA9u LIMS c\u1EADp nh\u1EADt l\u1EA7n cu\u1ED1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(119, "span", 89);
    i0.ɵɵtext(120);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(121, "div", 39)(122, "label", 90);
    i0.ɵɵelement(123, "i", 17);
    i0.ɵɵtext(124, " Quy\u1EC1n h\u1EA1n truy c\u1EADp");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(125, ConfigComponent_ng_template_3_Conditional_125_Template, 3, 0, "div", 91)(126, ConfigComponent_ng_template_3_Conditional_126_Template, 4, 1, "div", 92);
    i0.ɵɵelementStart(127, "p", 93);
    i0.ɵɵtext(128, "\u0110\u1EC3 y\u00EAu c\u1EA7u n\u00E2ng c\u1EA5p quy\u1EC1n h\u1EA1n, vui l\u00F2ng g\u1EEDi UID cho Qu\u1EA3n l\u00FD h\u1EC7 th\u1ED1ng.");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    let tmp_10_0;
    let tmp_17_0;
    let tmp_18_0;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(9);
    i0.ɵɵproperty("src", ctx_r1.getAvatarUrl((tmp_2_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_2_0.displayName, ((tmp_2_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_2_0.avatarStyle) || ctx_r1.state.avatarStyle(), (tmp_2_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_2_0.photoURL), i0.ɵɵsanitizeUrl);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate((tmp_3_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_3_0.displayName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate((tmp_4_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_4_0.email);
    i0.ɵɵadvance(3);
    i0.ɵɵclassProp("fa-chess-king", ((tmp_5_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_5_0.role) === "manager")("fa-user", ((tmp_6_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_6_0.role) !== "manager");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", (tmp_7_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_7_0.role, " ");
    i0.ɵɵadvance(13);
    i0.ɵɵtextInterpolate((tmp_8_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_8_0.uid);
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate(ctx_r1.fb.APP_ID);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngModel", ((tmp_10_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_10_0.avatarStyle) || "");
    i0.ɵɵadvance(24);
    i0.ɵɵconditional(!ctx_r1.showDeleteConfirm() ? 68 : 69);
    i0.ɵɵadvance(23);
    i0.ɵɵconditional(ctx_r1.auth.hasGoogleProvider() ? 91 : 92);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.auth.hasGoogleProvider() && !ctx_r1.auth.canUnlinkProvider("google.com") ? 93 : -1);
    i0.ɵɵadvance(12);
    i0.ɵɵconditional(ctx_r1.auth.needsPasswordSetup() ? 105 : ctx_r1.auth.hasPasswordProvider() ? 106 : 107);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r1.auth.hasPasswordProvider() && !ctx_r1.auth.canUnlinkProvider("password") ? 108 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.auth.googleRedirectError() ? 109 : -1);
    i0.ɵɵadvance(11);
    i0.ɵɵtextInterpolate(ctx_r1.formatAuditDate((tmp_17_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_17_0.lastPasswordChangedAt));
    i0.ɵɵadvance(5);
    i0.ɵɵconditional(((tmp_18_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_18_0.role) === "manager" ? 125 : 126);
} }
export class ConfigComponent {
    constructor() {
        this.fb = inject(FirebaseService);
        this.auth = inject(AuthService);
        this.state = inject(StateService);
        this.toast = inject(ToastService);
        this.notificationService = inject(NotificationService);
        this.getAvatarUrl = getAvatarUrl;
        this.activeTab = signal('general');
        this.showDeleteConfirm = signal(false);
        this.isAnonymizing = signal(false);
        this.unlinkingProvider = signal(null);
        this.availablePermissions = [
            { val: PERMISSIONS.INVENTORY_VIEW, label: 'Xem Kho' },
            { val: PERMISSIONS.INVENTORY_EDIT, label: 'Sửa Kho' },
            { val: PERMISSIONS.BATCH_RUN, label: 'Vận hành mẻ' },
            { val: PERMISSIONS.STANDARD_VIEW, label: 'Xem Chất Chuẩn' },
            { val: PERMISSIONS.STANDARD_EDIT, label: 'Sửa Chất Chuẩn' },
            { val: PERMISSIONS.STANDARD_APPROVE, label: 'Duyệt Chất Chuẩn' },
            { val: PERMISSIONS.STANDARD_LOG_VIEW, label: 'Xem Nhật Ký Chuẩn' },
            { val: PERMISSIONS.STANDARD_LOG_DELETE, label: 'Xóa Nhật Ký Chuẩn' },
            { val: PERMISSIONS.RECIPE_VIEW, label: 'Xem Công Thức' },
            { val: PERMISSIONS.RECIPE_EDIT, label: 'Sửa Công Thức' },
            { val: PERMISSIONS.SOP_VIEW, label: 'Xem SOP' },
            { val: PERMISSIONS.SOP_EDIT, label: 'Sửa SOP' },
            { val: PERMISSIONS.SOP_APPROVE, label: 'Duyệt SOP' },
            { val: PERMISSIONS.REPORT_VIEW, label: 'Xem Báo Cáo' },
            { val: PERMISSIONS.USER_MANAGE, label: 'Quản Lý Hệ Thống' },
            { val: PERMISSIONS.BYPASS_MAINTENANCE, label: 'Vượt Bảo Trì' }
        ];
        this.permissionGroups = [
            { label: 'Kho & vận hành', permissions: [PERMISSIONS.INVENTORY_VIEW, PERMISSIONS.INVENTORY_EDIT, PERMISSIONS.BATCH_RUN] },
            { label: 'Chất chuẩn', permissions: [PERMISSIONS.STANDARD_VIEW, PERMISSIONS.STANDARD_EDIT, PERMISSIONS.STANDARD_APPROVE, PERMISSIONS.STANDARD_LOG_VIEW, PERMISSIONS.STANDARD_LOG_DELETE] },
            { label: 'Tài liệu & báo cáo', permissions: [PERMISSIONS.RECIPE_VIEW, PERMISSIONS.RECIPE_EDIT, PERMISSIONS.SOP_VIEW, PERMISSIONS.SOP_EDIT, PERMISSIONS.SOP_APPROVE, PERMISSIONS.REPORT_VIEW] },
            { label: 'Quản trị', permissions: [PERMISSIONS.USER_MANAGE, PERMISSIONS.BYPASS_MAINTENANCE] }
        ];
    }
    permissionLabel(permission) {
        return PERMISSION_NAMES[permission] || this.availablePermissions.find(item => item.val === permission)?.label || permission;
    }
    formatAuditDate(value) {
        if (!value)
            return 'Chưa ghi nhận';
        const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
        return Number.isNaN(date.getTime()) ? 'Chưa ghi nhận' : date.toLocaleString('vi-VN');
    }
    copyUid(uid) {
        navigator.clipboard.writeText(uid).then(() => this.toast.show('Đã sao chép UID.', 'success')).catch(() => this.toast.show('Không thể sao chép UID.', 'error'));
    }
    async saveMyAvatarStyle(style) {
        await this.state.saveMyAvatarStyle(style);
        this.toast.show('Đã cập nhật Avatar cá nhân!', 'success');
    }
    async linkGoogle() {
        try {
            await this.auth.linkGoogleToCurrentUser();
        }
        catch (e) {
            this.toast.show(this.auth.googleRedirectError() || e?.message || 'Không thể liên kết Google.', 'error');
        }
    }
    async unlinkProvider(providerId) {
        if (!this.auth.canUnlinkProvider(providerId)) {
            this.toast.show('Không thể xóa phương thức đăng nhập cuối cùng.', 'error');
            return;
        }
        this.unlinkingProvider.set(providerId);
        try {
            await this.auth.unlinkProvider(providerId);
            this.toast.show(providerId === 'google.com' ? 'Đã hủy liên kết Google.' : 'Đã xóa mật khẩu LIMS.', 'success');
        }
        catch (e) {
            const message = e?.code === 'auth/requires-recent-login'
                ? 'Phiên bảo mật đã cũ. Vui lòng đăng nhập lại rồi thử lại.'
                : e?.message || 'Không thể thay đổi phương thức đăng nhập.';
            this.toast.show(message, 'error');
        }
        finally {
            this.unlinkingProvider.set(null);
        }
    }
    async anonymizeAccount() {
        if (this.isAnonymizing())
            return;
        this.isAnonymizing.set(true);
        try {
            const { getAuth } = await import('firebase/auth');
            const user = getAuth().currentUser;
            if (!user)
                throw new Error('Chưa đăng nhập');
            const idToken = await user.getIdToken();
            const res = await fetch('/api/account/delete-request', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${idToken}`, 'Content-Type': 'application/json' }
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Lỗi máy chủ');
            }
            this.toast.show('Đã ẩn danh hoá thông tin cá nhân thành công.', 'success');
            this.showDeleteConfirm.set(false);
            setTimeout(() => this.auth.logout(), 1500);
        }
        catch (e) {
            this.toast.show('Lỗi: ' + e.message, 'error');
        }
        finally {
            this.isAnonymizing.set(false);
        }
    }
    async enableNotifications() {
        try {
            const token = await this.notificationService.registerCurrentDevicePushToken({ force: true });
            this.toast.show(token ? 'Đã bật thông báo đẩy trên thiết bị này!' : 'Bạn đã từ chối quyền hoặc trình duyệt không hỗ trợ.', token ? 'success' : 'error');
        }
        catch (e) {
            this.toast.show('Lỗi: ' + e.message, 'error');
        }
    }
    static { this.ɵfac = function ConfigComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ConfigComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ConfigComponent, selectors: [["app-config"]], decls: 5, vars: 2, consts: [["profileCard", ""], [1, "w-full", "max-w-7xl", "mx-auto", "space-y-6", "pb-24", "fade-in", "px-4", "md:px-8"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-4", "mb-4", "bg-white/70", "dark:bg-slate-800/70", "backdrop-blur-xl", "p-4", "rounded-2xl", "shadow-sm", "border", "border-white/70", "dark:border-slate-700", "shrink-0"], [1, "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-xl", "bg-indigo-50", "dark:bg-indigo-900/30", "text-indigo-600", "dark:text-indigo-400", "flex", "items-center", "justify-center", "border", "border-indigo-100", "dark:border-indigo-800", "shadow-sm", "shrink-0"], [1, "fa-solid", "fa-gears", "text-base"], [1, "text-xl", "font-black", "text-slate-800", "dark:text-slate-100", "tracking-tight", "leading-tight"], [1, "text-xs", "font-medium", "text-slate-500", "dark:text-slate-400", "mt-0.5"], [1, "flex", "items-center", "gap-2"], ["type", "button", 1, "text-xs", "font-bold", "text-white", "bg-blue-600", "hover:bg-blue-700", "px-4", "py-2.5", "rounded-xl", "shadow-sm", "flex", "items-center", "gap-2", "transition", "active:scale-95", 3, "click"], [1, "fa-regular", "fa-bell", "text-sm"], [1, "text-xs", "font-bold", "text-slate-500", "dark:text-slate-400", "bg-slate-50", "dark:bg-slate-900", "px-3.5", "py-2.5", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "shadow-inner"], [1, "text-blue-600", "dark:text-blue-400", "font-mono"], [1, "flex", "gap-6", "border-b", "border-slate-200", "dark:border-slate-700", "overflow-x-auto", "custom-scrollbar", "whitespace-nowrap"], ["type", "button", 1, "pb-3", "px-2", "text-sm", "font-bold", "border-b-2", "transition", "flex", "items-center", "gap-2", "min-w-max", "shrink-0", 3, "click"], [1, "fa-solid", "fa-id-badge"], [1, "fa-solid", "fa-server"], [1, "fa-solid", "fa-shield-halved"], [1, "fa-solid", "fa-user-shield"], [1, "fa-solid", "fa-users-gear"], [4, "ngTemplateOutlet"], [1, "max-w-6xl", "mx-auto", "pt-4"], [1, "bg-white/60", "dark:bg-slate-800/60", "backdrop-blur-xl", "rounded-[2rem]", "shadow-soft-xl", "dark:shadow-none", "border", "border-white/70", "dark:border-slate-700/60", "overflow-hidden", "relative", "mb-6"], [1, "h-36", "bg-[linear-gradient(110deg,#3b82f6,#8b5cf6,#d946ef)]", "relative", "overflow-hidden"], [1, "absolute", "inset-0", "bg-white/10", "opacity-30", "pattern-dots", "mix-blend-overlay"], [1, "absolute", "-bottom-24", "-right-24", "w-64", "h-64", "bg-white/20", "rounded-full", "blur-3xl"], [1, "absolute", "-top-24", "-left-24", "w-64", "h-64", "bg-black/10", "rounded-full", "blur-3xl"], [1, "px-6", "md:px-8", "pb-7"], [1, "relative", "-mt-14", "mb-2", "flex", "flex-col", "md:flex-row", "items-center", "md:items-end", "gap-5", "text-center", "md:text-left"], [1, "w-28", "h-28", "rounded-[1.4rem]", "bg-white/60", "dark:bg-slate-800/60", "backdrop-blur-md", "p-1.5", "shadow-xl", "shrink-0", "border", "border-white/70", "dark:border-slate-700/60"], ["alt", "Profile Avatar", 1, "w-full", "h-full", "rounded-2xl", "bg-slate-100", "dark:bg-slate-700", "object-cover", 3, "src"], [1, "flex-1", "pb-2"], [1, "text-2xl", "md:text-3xl", "font-black", "text-slate-800", "dark:text-slate-100", "tracking-tight"], [1, "text-slate-500", "dark:text-slate-400", "font-medium", "mt-1"], [1, "pb-2"], [1, "px-4", "py-2", "rounded-xl", "bg-indigo-100/80", "dark:bg-indigo-900/40", "text-indigo-800", "dark:text-indigo-300", "text-xs", "font-black", "uppercase", "tracking-widest", "border", "border-white/60", "dark:border-slate-700/50", "shadow-sm", "inline-flex", "items-center", "gap-2"], [1, "fa-solid"], [1, "grid", "grid-cols-1", "lg:grid-cols-3", "gap-6"], [1, "space-y-6"], [1, "bg-white/60", "dark:bg-slate-800/60", "backdrop-blur-xl", "p-5", "rounded-3xl", "border", "border-white/70", "dark:border-slate-700/60", "shadow-sm"], [1, "text-[11px]", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-widest", "block", "mb-3", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-id-card"], [1, "space-y-3"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "mb-1"], [1, "text-xs", "font-mono", "font-bold", "text-slate-600", "dark:text-slate-300", "truncate", "flex-1", "bg-slate-100/50", "dark:bg-slate-900/50", "px-3", "py-2.5", "rounded-xl", "border", "border-slate-200/50", "dark:border-slate-700/50", "select-all"], ["type", "button", "aria-label", "Sao ch\u00E9p UID", 1, "text-indigo-600", "dark:text-indigo-400", "hover:bg-indigo-50", "dark:hover:bg-indigo-900/30", "w-10", "h-10", "rounded-xl", "flex", "items-center", "justify-center", "transition-colors", "shadow-sm", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", 3, "click"], [1, "fa-regular", "fa-copy"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "flex", "items-center", "gap-2", "bg-slate-100/50", "dark:bg-slate-900/50", "px-3", "py-2.5", "rounded-xl", "border", "border-slate-200/50", "dark:border-slate-700/50"], [1, "fa-solid", "fa-database", "text-slate-400"], [1, "fa-solid", "fa-palette"], [1, "w-full", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "bg-slate-50", "dark:bg-slate-900/50", "border", "border-slate-200", "dark:border-slate-700/50", "rounded-xl", "px-4", "py-3", "outline-none", "focus:border-indigo-500", "cursor-pointer", 3, "ngModelChange", "ngModel"], ["value", ""], ["value", "google"], ["value", "bottts-neutral"], ["value", "fun-emoji"], ["value", "micah"], ["value", "notionists"], ["value", "initials"], ["type", "button", 1, "w-full", "mt-4", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-200", "bg-white", "dark:bg-slate-800", "hover:bg-slate-50", "dark:hover:bg-slate-750", "py-3", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "transition", "flex", "items-center", "justify-center", "gap-2", "shadow-sm", 3, "click"], [1, "fa-regular", "fa-bell", "text-blue-500"], [1, "bg-red-50/60", "dark:bg-red-950/20", "border", "border-red-200", "dark:border-red-900/50", "rounded-3xl", "p-5"], [1, "text-[11px]", "font-bold", "text-red-500", "uppercase", "tracking-widest", "flex", "items-center", "gap-2", "mb-3"], [1, "fa-solid", "fa-circle-exclamation"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "mb-3", "leading-relaxed"], ["type", "button", 1, "w-full", "text-xs", "font-bold", "text-red-600", "dark:text-red-400", "border", "border-red-300", "dark:border-red-800", "bg-white", "dark:bg-slate-900", "hover:bg-red-50", "dark:hover:bg-red-950/40", "py-2.5", "rounded-xl", "transition", "flex", "items-center", "justify-center", "gap-2"], [1, "bg-red-100", "dark:bg-red-950/40", "border", "border-red-300", "dark:border-red-800", "rounded-xl", "p-3", "space-y-3"], ["routerLink", "/privacy-policy", 1, "block", "mt-3", "text-center", "text-[11px]", "text-blue-500", "dark:text-blue-400", "hover:underline"], [1, "fa-solid", "fa-shield-halved", "mr-1"], [1, "bg-white/60", "dark:bg-slate-800/60", "backdrop-blur-xl", "p-5", "rounded-3xl", "border", "border-white/70", "dark:border-slate-700/60", "shadow-sm", "relative", "overflow-hidden"], [1, "absolute", "top-0", "right-0", "w-32", "h-32", "bg-fuchsia-500/10", "rounded-full", "blur-3xl", "pointer-events-none"], [1, "text-[11px]", "font-bold", "text-slate-800", "dark:text-white", "uppercase", "tracking-widest", "block", "mb-4", "flex", "items-center", "gap-2", "relative", "z-10"], [1, "w-6", "h-6", "rounded", "bg-fuchsia-100", "dark:bg-fuchsia-900/30", "text-fuchsia-600", "dark:text-fuchsia-400", "flex", "items-center", "justify-center"], [1, "space-y-3", "relative", "z-10"], [1, "bg-slate-50/80", "dark:bg-slate-900/50", "p-3.5", "rounded-2xl", "border", "border-slate-200/60", "dark:border-slate-700/50"], [1, "flex", "items-center", "justify-between", "gap-3"], [1, "w-8", "h-8", "rounded-full", "bg-white", "dark:bg-slate-800", "flex", "items-center", "justify-center", "shadow-sm"], [1, "fa-brands", "fa-google", "text-red-500", "text-sm"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-200"], [1, "text-[10px]", "text-slate-500", "dark:text-slate-400"], [1, "text-right"], ["type", "button", 1, "text-xs", "font-bold", "text-blue-600", "dark:text-blue-400", "hover:underline"], [1, "text-[10px]", "text-slate-400", "mt-2", "leading-relaxed"], [1, "fa-solid", "fa-key", "text-fuchsia-500", "text-sm"], [1, "text-[11px]", "font-bold", "text-slate-400"], [1, "mt-3", "rounded-xl", "bg-red-50", "dark:bg-red-950/30", "border", "border-red-100", "dark:border-red-900/50", "text-red-600", "dark:text-red-300", "text-[11px]", "px-3", "py-2", "leading-relaxed"], [1, "text-[11px]", "text-slate-400", "dark:text-slate-500", "mt-3", "leading-relaxed"], [1, "fa-solid", "fa-clock-rotate-left"], [1, "flex", "items-center", "justify-between", "gap-3", "bg-slate-50/80", "dark:bg-slate-900/50", "rounded-2xl", "px-3.5", "py-3", "border", "border-slate-200/60", "dark:border-slate-700/50"], [1, "text-xs", "text-slate-500", "dark:text-slate-400"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-200", "text-right"], [1, "text-[11px]", "font-bold", "text-indigo-500", "dark:text-indigo-400", "uppercase", "tracking-widest", "block", "mb-4", "flex", "items-center", "gap-2"], [1, "text-sm", "font-bold", "text-indigo-700", "dark:text-indigo-400", "flex", "items-center", "gap-2", "bg-indigo-50", "dark:bg-indigo-900/20", "p-3", "rounded-xl", "border", "border-indigo-100", "dark:border-indigo-800/30"], [1, "space-y-4"], [1, "text-[11px]", "text-slate-400", "dark:text-slate-500", "mt-5", "leading-relaxed"], ["type", "button", 1, "w-full", "text-xs", "font-bold", "text-red-600", "dark:text-red-400", "border", "border-red-300", "dark:border-red-800", "bg-white", "dark:bg-slate-900", "hover:bg-red-50", "dark:hover:bg-red-950/40", "py-2.5", "rounded-xl", "transition", "flex", "items-center", "justify-center", "gap-2", 3, "click"], [1, "fa-solid", "fa-user-slash"], [1, "text-xs", "font-bold", "text-red-700", "dark:text-red-300", "text-center"], [1, "flex", "gap-2"], ["type", "button", 1, "flex-1", "text-xs", "font-bold", "text-slate-600", "dark:text-slate-300", "bg-white", "dark:bg-slate-800", "border", "border-slate-300", "dark:border-slate-600", "py-2", "rounded-lg", 3, "click"], ["type", "button", 1, "flex-1", "text-xs", "font-bold", "text-white", "bg-red-600", "hover:bg-red-700", "disabled:opacity-60", "py-2", "rounded-lg", 3, "click", "disabled"], [1, "text-[11px]", "font-bold", "text-emerald-600", "dark:text-emerald-400"], [1, "fa-solid", "fa-circle-check", "mr-1"], ["type", "button", 1, "text-[10px]", "text-red-500", "hover:underline", "disabled:text-slate-400", "disabled:no-underline", "disabled:cursor-not-allowed", 3, "click", "disabled"], ["type", "button", 1, "text-xs", "font-bold", "text-blue-600", "dark:text-blue-400", "hover:underline", 3, "click"], [1, "fa-solid", "fa-lock", "mr-1"], [1, "text-[11px]", "font-bold", "text-amber-600", "dark:text-amber-400"], [1, "fa-solid", "fa-triangle-exclamation", "mr-1"], ["type", "button", 1, "text-[10px]", "text-fuchsia-600", "dark:text-fuchsia-400", "hover:underline", 3, "click"], [1, "flex", "items-center", "gap-2", "justify-end"], [1, "fa-solid", "fa-check-double", "text-emerald-500"], [1, "text-center", "text-xs", "text-slate-400", "dark:text-slate-500", "italic", "py-4"], [1, "text-[10px]", "font-black", "uppercase", "tracking-wider", "text-slate-400", "dark:text-slate-500", "mb-2"], [1, "flex", "flex-wrap", "gap-2"], [1, "inline-flex", "items-center", "gap-1.5", "px-2.5", "py-1.5", "rounded-lg", "bg-emerald-50", "dark:bg-emerald-950/30", "border", "border-emerald-100", "dark:border-emerald-900/50", "text-[10px]", "font-bold", "text-emerald-700", "dark:text-emerald-400"], [1, "fa-solid", "fa-check"]], template: function ConfigComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 1);
            i0.ɵɵtemplate(1, ConfigComponent_Conditional_1_Template, 37, 16)(2, ConfigComponent_Conditional_2_Template, 1, 1, "ng-container");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(3, ConfigComponent_ng_template_3_Template, 129, 19, "ng-template", null, 0, i0.ɵɵtemplateRefExtractor);
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.state.isAdmin() ? 1 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(!ctx.state.isAdmin() || ctx.activeTab() === "profile" ? 2 : -1);
        } }, dependencies: [CommonModule, i1.NgTemplateOutlet, FormsModule, i2.NgSelectOption, i2.ɵNgSelectMultipleOption, i2.SelectControlValueAccessor, i2.NgControlStatus, i2.NgModel, RouterLink], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadataAsync(ConfigComponent, () => [import("./components/config-general.component").then(m => m.ConfigGeneralComponent), import("./components/config-safety.component").then(m => m.ConfigSafetyComponent), import("./components/config-roles.component").then(m => m.ConfigRolesComponent), import("./components/config-users.component").then(m => m.ConfigUsersComponent)], (ConfigGeneralComponent, ConfigSafetyComponent, ConfigRolesComponent, ConfigUsersComponent) => { i0.ɵsetClassMetadata(ConfigComponent, [{
        type: Component,
        args: [{
                selector: 'app-config',
                standalone: true,
                imports: [CommonModule, FormsModule, RouterLink, ConfigGeneralComponent, ConfigSafetyComponent, ConfigUsersComponent, ConfigRolesComponent],
                template: `
    <div class="w-full max-w-7xl mx-auto space-y-6 pb-24 fade-in px-4 md:px-8">
      @if (state.isAdmin()) {
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-4 rounded-2xl shadow-sm border border-white/70 dark:border-slate-700 shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800 shadow-sm shrink-0">
              <i class="fa-solid fa-gears text-base"></i>
            </div>
            <div>
              <h2 class="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight">Cấu Hình Hệ Thống</h2>
              <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Quản trị viên: {{auth.currentUser()?.displayName}}.</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" (click)="enableNotifications()" class="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition active:scale-95">
              <i class="fa-regular fa-bell text-sm"></i> Bật Thông Báo
            </button>
            <div class="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
              Version: <span class="text-blue-600 dark:text-blue-400 font-mono">{{state.systemVersion()}}</span>
            </div>
          </div>
        </div>

        <div class="flex gap-6 border-b border-slate-200 dark:border-slate-700 overflow-x-auto custom-scrollbar whitespace-nowrap">
          <button type="button" (click)="activeTab.set('profile')" class="pb-3 px-2 text-sm font-bold border-b-2 transition flex items-center gap-2 min-w-max shrink-0" [class]="activeTab() === 'profile' ? 'border-indigo-600 dark:border-indigo-400 text-indigo-700 dark:text-indigo-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
            <i class="fa-solid fa-id-badge"></i> Hồ Sơ Cá Nhân
          </button>
          <button type="button" (click)="activeTab.set('general')" class="pb-3 px-2 text-sm font-bold border-b-2 transition flex items-center gap-2 min-w-max shrink-0" [class]="activeTab() === 'general' ? 'border-blue-600 dark:border-blue-400 text-blue-700 dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
            <i class="fa-solid fa-server"></i> Hệ Thống & Dữ Liệu
          </button>
          <button type="button" (click)="activeTab.set('safety')" class="pb-3 px-2 text-sm font-bold border-b-2 transition flex items-center gap-2 min-w-max shrink-0" [class]="activeTab() === 'safety' ? 'border-orange-600 dark:border-orange-400 text-orange-700 dark:text-orange-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
            <i class="fa-solid fa-shield-halved"></i> Định Mức & Tiêu Hao
          </button>
          <button type="button" (click)="activeTab.set('roles')" class="pb-3 px-2 text-sm font-bold border-b-2 transition flex items-center gap-2 min-w-max shrink-0" [class]="activeTab() === 'roles' ? 'border-orange-600 dark:border-orange-400 text-orange-700 dark:text-orange-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
            <i class="fa-solid fa-user-shield"></i> Nhóm Vai Trò
          </button>
          <button type="button" (click)="activeTab.set('users')" class="pb-3 px-2 text-sm font-bold border-b-2 transition flex items-center gap-2 min-w-max shrink-0" [class]="activeTab() === 'users' ? 'border-blue-600 dark:border-blue-400 text-blue-700 dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
            <i class="fa-solid fa-users-gear"></i> Người Dùng & Phân Quyền
          </button>
        </div>

        @if (activeTab() === 'general') {
          @defer { <app-config-general></app-config-general> }
        }
        @if (activeTab() === 'safety') {
          @defer { <app-config-safety></app-config-safety> }
        }
        @if (activeTab() === 'roles') {
          @defer { <app-config-roles></app-config-roles> }
        }
        @if (activeTab() === 'users') {
          @defer { <app-config-users></app-config-users> }
        }
      }

      @if (!state.isAdmin() || activeTab() === 'profile') {
        <ng-container *ngTemplateOutlet="profileCard"></ng-container>
      }
    </div>

    <ng-template #profileCard>
      <div class="max-w-6xl mx-auto pt-4">
        <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-[2rem] shadow-soft-xl dark:shadow-none border border-white/70 dark:border-slate-700/60 overflow-hidden relative mb-6">
          <div class="h-36 bg-[linear-gradient(110deg,#3b82f6,#8b5cf6,#d946ef)] relative overflow-hidden">
            <div class="absolute inset-0 bg-white/10 opacity-30 pattern-dots mix-blend-overlay"></div>
            <div class="absolute -bottom-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
            <div class="absolute -top-24 -left-24 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
          </div>
          <div class="px-6 md:px-8 pb-7">
            <div class="relative -mt-14 mb-2 flex flex-col md:flex-row items-center md:items-end gap-5 text-center md:text-left">
              <div class="w-28 h-28 rounded-[1.4rem] bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-1.5 shadow-xl shrink-0 border border-white/70 dark:border-slate-700/60">
                <img [src]="getAvatarUrl(auth.currentUser()?.displayName, auth.currentUser()?.avatarStyle || state.avatarStyle(), auth.currentUser()?.photoURL)" alt="Profile Avatar" class="w-full h-full rounded-2xl bg-slate-100 dark:bg-slate-700 object-cover">
              </div>
              <div class="flex-1 pb-2">
                <h2 class="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{{auth.currentUser()?.displayName}}</h2>
                <p class="text-slate-500 dark:text-slate-400 font-medium mt-1">{{auth.currentUser()?.email}}</p>
              </div>
              <div class="pb-2">
                <span class="px-4 py-2 rounded-xl bg-indigo-100/80 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 text-xs font-black uppercase tracking-widest border border-white/60 dark:border-slate-700/50 shadow-sm inline-flex items-center gap-2">
                  <i class="fa-solid" [class.fa-chess-king]="auth.currentUser()?.role === 'manager'" [class.fa-user]="auth.currentUser()?.role !== 'manager'"></i>
                  {{auth.currentUser()?.role}}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="space-y-6">
            <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-3xl border border-white/70 dark:border-slate-700/60 shadow-sm">
              <label class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-3 flex items-center gap-2"><i class="fa-solid fa-id-card"></i> Định danh người dùng</label>
              <div class="space-y-3">
                <div>
                  <div class="text-xs text-slate-500 dark:text-slate-400 mb-1">User ID (UID)</div>
                  <div class="flex items-center gap-2">
                    <code class="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 truncate flex-1 bg-slate-100/50 dark:bg-slate-900/50 px-3 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 select-all">{{auth.currentUser()?.uid}}</code>
                    <button type="button" (click)="copyUid(auth.currentUser()?.uid || '')" class="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700" aria-label="Sao chép UID"><i class="fa-regular fa-copy"></i></button>
                  </div>
                </div>
                <div>
                  <div class="text-xs text-slate-500 dark:text-slate-400 mb-1">App Context</div>
                  <div class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 bg-slate-100/50 dark:bg-slate-900/50 px-3 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50"><i class="fa-solid fa-database text-slate-400"></i>{{fb.APP_ID}}</div>
                </div>
              </div>
            </div>

            <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-3xl border border-white/70 dark:border-slate-700/60 shadow-sm">
              <label class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-3 flex items-center gap-2"><i class="fa-solid fa-palette"></i> Cá nhân hóa</label>
              <select [ngModel]="auth.currentUser()?.avatarStyle || ''" (ngModelChange)="saveMyAvatarStyle($event)" class="w-full text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 cursor-pointer">
                <option value="">⚙️ Mặc định hệ thống</option>
                <option value="google">📷 Ảnh Google</option>
                <option value="bottts-neutral">🤖 Robot</option>
                <option value="fun-emoji">😊 Biểu cảm</option>
                <option value="micah">🎨 Hiện đại</option>
                <option value="notionists">✏️ Vẽ tay</option>
                <option value="initials">🔤 Chữ cái</option>
              </select>
              <button type="button" (click)="enableNotifications()" class="w-full mt-4 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 py-3 rounded-xl border border-slate-200 dark:border-slate-700 transition flex items-center justify-center gap-2 shadow-sm"><i class="fa-regular fa-bell text-blue-500"></i> Bật Thông Báo Đẩy (PWA)</button>
            </div>

            <div class="bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-3xl p-5">
              <label class="text-[11px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-2 mb-3"><i class="fa-solid fa-circle-exclamation"></i> Quản lý tài khoản</label>
              <p class="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">Ẩn danh hoá email và avatar khỏi hệ thống. Tên hiển thị và UID vẫn giữ cho mục đích audit.</p>
              @if (!showDeleteConfirm()) {
                <button type="button" (click)="showDeleteConfirm.set(true)" class="w-full text-xs font-bold text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/40 py-2.5 rounded-xl transition flex items-center justify-center gap-2"><i class="fa-solid fa-user-slash"></i> Ẩn danh hoá thông tin</button>
              } @else {
                <div class="bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-800 rounded-xl p-3 space-y-3">
                  <p class="text-xs font-bold text-red-700 dark:text-red-300 text-center">Email và ảnh đại diện sẽ bị ẩn danh hoá.</p>
                  <div class="flex gap-2">
                    <button type="button" (click)="showDeleteConfirm.set(false)" class="flex-1 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 py-2 rounded-lg">Hủy</button>
                    <button type="button" (click)="anonymizeAccount()" [disabled]="isAnonymizing()" class="flex-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 py-2 rounded-lg">{{isAnonymizing() ? 'Đang xử lý...' : 'Xác nhận'}}</button>
                  </div>
                </div>
              }
              <a routerLink="/privacy-policy" class="block mt-3 text-center text-[11px] text-blue-500 dark:text-blue-400 hover:underline"><i class="fa-solid fa-shield-halved mr-1"></i> Xem Chính sách Bảo mật</a>
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-3xl border border-white/70 dark:border-slate-700/60 shadow-sm relative overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <label class="text-[11px] font-bold text-slate-800 dark:text-white uppercase tracking-widest block mb-4 flex items-center gap-2 relative z-10"><span class="w-6 h-6 rounded bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center"><i class="fa-solid fa-shield-halved"></i></span> Auth Security Hub</label>

              <div class="space-y-3 relative z-10">
                <div class="bg-slate-50/80 dark:bg-slate-900/50 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/50">
                  <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm"><i class="fa-brands fa-google text-red-500 text-sm"></i></div><div><div class="text-xs font-bold text-slate-700 dark:text-slate-200">Tài khoản Google</div><div class="text-[10px] text-slate-500 dark:text-slate-400">Đăng nhập một chạm</div></div></div>
                    @if (auth.hasGoogleProvider()) {
                      <div class="text-right"><div class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400"><i class="fa-solid fa-circle-check mr-1"></i>Đã liên kết</div><button type="button" (click)="unlinkProvider('google.com')" [disabled]="!auth.canUnlinkProvider('google.com') || unlinkingProvider() === 'google.com'" class="text-[10px] text-red-500 hover:underline disabled:text-slate-400 disabled:no-underline disabled:cursor-not-allowed">{{unlinkingProvider() === 'google.com' ? 'Đang xử lý...' : (auth.canUnlinkProvider('google.com') ? 'Hủy liên kết' : 'Khóa an toàn')}}</button></div>
                    } @else {
                      <button type="button" (click)="linkGoogle()" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">Liên kết</button>
                    }
                  </div>
                  @if (auth.hasGoogleProvider() && !auth.canUnlinkProvider('google.com')) { <p class="text-[10px] text-slate-400 mt-2 leading-relaxed"><i class="fa-solid fa-lock mr-1"></i>Không thể xóa phương thức cuối cùng.</p> }
                </div>

                <div class="bg-slate-50/80 dark:bg-slate-900/50 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/50">
                  <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm"><i class="fa-solid fa-key text-fuchsia-500 text-sm"></i></div><div><div class="text-xs font-bold text-slate-700 dark:text-slate-200">Gmail / mật khẩu LIMS</div><div class="text-[10px] text-slate-500 dark:text-slate-400">Mật khẩu dự phòng riêng của LIMS</div></div></div>
                    <div class="text-right">
                      @if (auth.needsPasswordSetup()) {
                        <div class="text-[11px] font-bold text-amber-600 dark:text-amber-400"><i class="fa-solid fa-triangle-exclamation mr-1"></i>Cần thiết lập</div>
                        <button type="button" (click)="auth.openPasswordSetup()" class="text-[10px] text-fuchsia-600 dark:text-fuchsia-400 hover:underline">Thiết lập ngay</button>
                      } @else if (auth.hasPasswordProvider()) {
                        <div class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400"><i class="fa-solid fa-circle-check mr-1"></i>Đã bật</div>
                        <div class="flex items-center gap-2 justify-end"><button type="button" (click)="auth.openPasswordSetup()" class="text-[10px] text-fuchsia-600 dark:text-fuchsia-400 hover:underline">Đổi mật khẩu</button><button type="button" (click)="unlinkProvider('password')" [disabled]="!auth.canUnlinkProvider('password') || unlinkingProvider() === 'password'" class="text-[10px] text-red-500 hover:underline disabled:text-slate-400 disabled:no-underline disabled:cursor-not-allowed">{{unlinkingProvider() === 'password' ? 'Đang xử lý...' : (auth.canUnlinkProvider('password') ? 'Xóa mật khẩu' : 'Khóa an toàn')}}</button></div>
                      } @else {
                        <div class="text-[11px] font-bold text-slate-400">Chưa bật</div>
                      }
                    </div>
                  </div>
                  @if (auth.hasPasswordProvider() && !auth.canUnlinkProvider('password')) { <p class="text-[10px] text-slate-400 mt-2 leading-relaxed"><i class="fa-solid fa-lock mr-1"></i>Không thể xóa phương thức cuối cùng.</p> }
                </div>
              </div>

              @if (auth.googleRedirectError()) { <div class="mt-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-300 text-[11px] px-3 py-2 leading-relaxed">{{auth.googleRedirectError()}}</div> }
              <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-3 leading-relaxed">Hai phương thức dùng chung một UID và dữ liệu LIMS. Mật khẩu LIMS không phải mật khẩu Google.</p>
            </div>

            <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-3xl border border-white/70 dark:border-slate-700/60 shadow-sm">
              <label class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-3 flex items-center gap-2"><i class="fa-solid fa-clock-rotate-left"></i> Nhật ký bảo mật</label>
              <div class="flex items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-900/50 rounded-2xl px-3.5 py-3 border border-slate-200/60 dark:border-slate-700/50">
                <span class="text-xs text-slate-500 dark:text-slate-400">Mật khẩu LIMS cập nhật lần cuối</span>
                <span class="text-xs font-bold text-slate-700 dark:text-slate-200 text-right">{{formatAuditDate(auth.currentUser()?.lastPasswordChangedAt)}}</span>
              </div>
            </div>
          </div>

          <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-3xl border border-white/70 dark:border-slate-700/60 shadow-sm">
            <label class="text-[11px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest block mb-4 flex items-center gap-2"><i class="fa-solid fa-shield-halved"></i> Quyền hạn truy cập</label>
            @if (auth.currentUser()?.role === 'manager') {
              <div class="text-sm font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800/30"><i class="fa-solid fa-check-double text-emerald-500"></i> Full System Access</div>
            } @else {
              <div class="space-y-4">
                @for (group of permissionGroups; track group.label) {
                  <div>
                    <div class="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">{{group.label}}</div>
                    <div class="flex flex-wrap gap-2">
                      @for (permission of group.permissions; track permission) {
                        @if (auth.hasPermission(permission)) {
                          <span class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-[10px] font-bold text-emerald-700 dark:text-emerald-400"><i class="fa-solid fa-check"></i>{{permissionLabel(permission)}}</span>
                        }
                      }
                    </div>
                  </div>
                }
                @if (auth.userPermissions().length === 0) { <div class="text-center text-xs text-slate-400 dark:text-slate-500 italic py-4">Chưa được cấp quyền cụ thể.</div> }
              </div>
            }
            <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-5 leading-relaxed">Để yêu cầu nâng cấp quyền hạn, vui lòng gửi UID cho Quản lý hệ thống.</p>
          </div>
        </div>
      </div>
    </ng-template>
  `
            }]
    }], null, null); }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ConfigComponent, { className: "ConfigComponent", filePath: "src/app/features/config/config.component.ts", lineNumber: 237 }); })();
//# sourceMappingURL=config.component.js.map