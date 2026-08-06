import { Component, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { PwaInstallPromptComponent } from '../../shared/components/pwa-install-prompt.component';
import { StateService } from '../../core/services/state.service';
import { ChangelogService } from '../../core/services/changelog.service';
import { LogoComponent } from '../../shared/components/logo.component';
import { ensureQrious } from '../../shared/utils/external-script-loader';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
const _c0 = ["qrCanvas"];
function LoginComponent_Conditional_0_Conditional_19_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " Phi\u00EAn \u0111\u0103ng nh\u1EADp \u0111\u00E3 h\u1EBFt h\u1EA1n do h\u1EC7 th\u1ED1ng kh\u00F4ng ho\u1EA1t \u0111\u1ED9ng trong 30 ph\u00FAt. Vui l\u00F2ng \u0111\u0103ng nh\u1EADp l\u1EA1i. ");
} }
function LoginComponent_Conditional_0_Conditional_19_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " T\u00E0i kho\u1EA3n c\u1EE7a b\u1EA1n \u0111\u00E3 b\u1ECB t\u1EEB ch\u1ED1i truy c\u1EADp b\u1EDFi h\u1EC7 th\u1ED1ng. Vui l\u00F2ng li\u00EAn h\u1EC7 Admin. ");
} }
function LoginComponent_Conditional_0_Conditional_19_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " B\u1EA1n \u0111\u00E3 \u0111\u01B0\u1EE3c \u0111\u0103ng xu\u1EA5t kh\u1ECFi h\u1EC7 th\u1ED1ng. ");
} }
function LoginComponent_Conditional_0_Conditional_19_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 17)(1, "div", 35);
    i0.ɵɵelement(2, "i", 36);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 37)(4, "div", 38);
    i0.ɵɵtext(5, "Th\u00F4ng b\u00E1o h\u1EC7 th\u1ED1ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div");
    i0.ɵɵtemplate(7, LoginComponent_Conditional_0_Conditional_19_Conditional_7_Template, 1, 0)(8, LoginComponent_Conditional_0_Conditional_19_Conditional_8_Template, 1, 0)(9, LoginComponent_Conditional_0_Conditional_19_Conditional_9_Template, 1, 0);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "button", 39);
    i0.ɵɵlistener("click", function LoginComponent_Conditional_0_Conditional_19_Template_button_click_10_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.logoutReason.set(null)); });
    i0.ɵɵelement(11, "i", 40);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(7);
    i0.ɵɵconditional(ctx_r2.logoutReason() === "idle" ? 7 : ctx_r2.logoutReason() === "permission-denied" ? 8 : 9);
} }
function LoginComponent_Conditional_0_Conditional_31_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 43);
} }
function LoginComponent_Conditional_0_Conditional_31_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 44);
    i0.ɵɵelement(1, "i", 61);
    i0.ɵɵelementEnd();
} }
function LoginComponent_Conditional_0_Conditional_31_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 50);
} }
function LoginComponent_Conditional_0_Conditional_31_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 50);
} }
function LoginComponent_Conditional_0_Conditional_31_Conditional_36_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 59);
    i0.ɵɵelement(1, "i", 62);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.errorMsg() || ctx_r2.auth.googleRedirectError(), " ");
} }
function LoginComponent_Conditional_0_Conditional_31_Conditional_37_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 67);
    i0.ɵɵtext(1, " \u0110ang li\u00EAn k\u1EBFt... ");
} }
function LoginComponent_Conditional_0_Conditional_31_Conditional_37_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 68);
    i0.ɵɵtext(1, " X\u00E1c th\u1EF1c v\u00E0 li\u00EAn k\u1EBFt Google ");
} }
function LoginComponent_Conditional_0_Conditional_31_Conditional_37_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 60)(1, "div", 63);
    i0.ɵɵtext(2, "Li\u00EAn k\u1EBFt t\u00E0i kho\u1EA3n hi\u1EC7n c\u00F3");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 64);
    i0.ɵɵtext(4, " Email Google n\u00E0y \u0111\u00E3 c\u00F3 t\u00E0i kho\u1EA3n LIMS. Nh\u1EADp m\u1EADt kh\u1EA9u hi\u1EC7n t\u1EA1i \u0111\u1EC3 d\u00F9ng chung m\u1ED9t t\u00E0i kho\u1EA3n. ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "input", 65);
    i0.ɵɵtwoWayListener("ngModelChange", function LoginComponent_Conditional_0_Conditional_31_Conditional_37_Template_input_ngModelChange_5_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(3); i0.ɵɵtwoWayBindingSet(ctx_r2.pendingLinkPassword, $event) || (ctx_r2.pendingLinkPassword = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("keyup.enter", function LoginComponent_Conditional_0_Conditional_31_Conditional_37_Template_input_keyup_enter_5_listener() { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.linkGoogleAccount()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "button", 66);
    i0.ɵɵlistener("click", function LoginComponent_Conditional_0_Conditional_31_Conditional_37_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.linkGoogleAccount()); });
    i0.ɵɵtemplate(7, LoginComponent_Conditional_0_Conditional_31_Conditional_37_Conditional_7_Template, 2, 0)(8, LoginComponent_Conditional_0_Conditional_31_Conditional_37_Conditional_8_Template, 2, 0);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(5);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.pendingLinkPassword);
    i0.ɵɵproperty("disabled", ctx_r2.isLinkLoading());
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r2.isLinkLoading());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.isLinkLoading() ? 7 : 8);
} }
function LoginComponent_Conditional_0_Conditional_31_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 24)(1, "button", 41);
    i0.ɵɵlistener("click", function LoginComponent_Conditional_0_Conditional_31_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.loginGoogle()); });
    i0.ɵɵelement(2, "div", 42);
    i0.ɵɵtemplate(3, LoginComponent_Conditional_0_Conditional_31_Conditional_3_Template, 1, 0, "i", 43)(4, LoginComponent_Conditional_0_Conditional_31_Conditional_4_Template, 2, 0, "div", 44);
    i0.ɵɵelementStart(5, "span", 45);
    i0.ɵɵtext(6, " \u0110\u0103ng nh\u1EADp v\u1EDBi Google ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "div", 46)(8, "label", 47)(9, "div", 48)(10, "input", 49);
    i0.ɵɵlistener("change", function LoginComponent_Conditional_0_Conditional_31_Template_input_change_10_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.toggleRememberSession()); });
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(11, LoginComponent_Conditional_0_Conditional_31_Conditional_11_Template, 1, 0, "i", 50);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "span", 51);
    i0.ɵɵtext(13, "Duy tr\u00EC \u0111\u0103ng nh\u1EADp");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "label", 47)(15, "div", 48)(16, "input", 49);
    i0.ɵɵlistener("change", function LoginComponent_Conditional_0_Conditional_31_Template_input_change_16_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.toggleSharedDevice()); });
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(17, LoginComponent_Conditional_0_Conditional_31_Conditional_17_Template, 1, 0, "i", 50);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "span", 51);
    i0.ɵɵtext(19, "M\u00E1y d\u00F9ng chung");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(20, "div", 52)(21, "button", 53);
    i0.ɵɵelement(22, "i", 54);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "div", 55)(24, "div", 56);
    i0.ɵɵelement(25, "i", 57);
    i0.ɵɵtext(26, " H\u01B0\u1EDBng d\u1EABn b\u1EA3o m\u1EADt phi\u00EAn ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "div", 58)(28, "div")(29, "strong");
    i0.ɵɵtext(30, "\u2022 Duy tr\u00EC \u0111\u0103ng nh\u1EADp:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(31, " T\u1EAFt t\u1EF1 \u0111\u1ED9ng \u0111\u0103ng xu\u1EA5t sau 30 ph\u00FAt kh\u00F4ng ho\u1EA1t \u0111\u1ED9ng v\u00E0 gi\u1EEF phi\u00EAn \u0111\u0103ng nh\u1EADp qua ng\u00E0y (d\u00E0nh cho m\u00E1y c\u00E1 nh\u00E2n).");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "div")(33, "strong");
    i0.ɵɵtext(34, "\u2022 M\u00E1y d\u00F9ng chung:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(35, " K\u00EDch ho\u1EA1t t\u1EF1 tho\u00E1t 30 ph\u00FAt v\u00E0 t\u1EF1 \u0111\u1ED9ng \u0111\u0103ng xu\u1EA5t t\u00E0i kho\u1EA3n Google khi nh\u1EA5n \u0111\u0103ng xu\u1EA5t \u0111\u1EC3 b\u1EA3o m\u1EADt.");
    i0.ɵɵelementEnd()()()()();
    i0.ɵɵtemplate(36, LoginComponent_Conditional_0_Conditional_31_Conditional_36_Template, 3, 1, "div", 59)(37, LoginComponent_Conditional_0_Conditional_31_Conditional_37_Template, 9, 4, "div", 60);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r2.isLoading());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.isGoogleLoading() ? 3 : 4);
    i0.ɵɵadvance(5);
    i0.ɵɵclassProp("opacity-40", ctx_r2.isSharedDevice())("pointer-events-none", ctx_r2.isSharedDevice());
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ctx_r2.rememberSession() ? "bg-fuchsia-50 border-fuchsia-500 dark:bg-fuchsia-950/50" : "border-gray-300 dark:border-slate-650");
    i0.ɵɵadvance();
    i0.ɵɵproperty("checked", ctx_r2.rememberSession())("disabled", ctx_r2.isSharedDevice());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.rememberSession() ? 11 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵclassProp("opacity-40", ctx_r2.rememberSession())("pointer-events-none", ctx_r2.rememberSession());
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ctx_r2.isSharedDevice() ? "bg-fuchsia-50 border-fuchsia-500 dark:bg-fuchsia-950/50" : "border-gray-300 dark:border-slate-650");
    i0.ɵɵadvance();
    i0.ɵɵproperty("checked", ctx_r2.isSharedDevice())("disabled", ctx_r2.rememberSession());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.isSharedDevice() ? 17 : -1);
    i0.ɵɵadvance(19);
    i0.ɵɵconditional(ctx_r2.errorMsg() || ctx_r2.auth.googleRedirectError() ? 36 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.auth.pendingGoogleLinkEmail() ? 37 : -1);
} }
function LoginComponent_Conditional_0_Conditional_32_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 76);
    i0.ɵɵtext(1, " @lims.com ");
    i0.ɵɵelementEnd();
} }
function LoginComponent_Conditional_0_Conditional_32_Conditional_51_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 88);
    i0.ɵɵelement(1, "i", 62);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.errorMsg(), " ");
} }
function LoginComponent_Conditional_0_Conditional_32_Conditional_57_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 67);
} }
function LoginComponent_Conditional_0_Conditional_32_Conditional_58_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 93);
    i0.ɵɵelementStart(1, "span");
    i0.ɵɵtext(2, "\u0110\u0103ng nh\u1EADp LIMS");
    i0.ɵɵelementEnd();
} }
function LoginComponent_Conditional_0_Conditional_32_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 25)(1, "div", 69)(2, "div", 70)(3, "label", 71);
    i0.ɵɵtext(4, "Gmail / Email ho\u1EB7c username");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 72)(6, "div", 73);
    i0.ɵɵelement(7, "i", 74);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "input", 75);
    i0.ɵɵtwoWayListener("ngModelChange", function LoginComponent_Conditional_0_Conditional_32_Template_input_ngModelChange_8_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r2.email, $event) || (ctx_r2.email = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("keyup.enter", function LoginComponent_Conditional_0_Conditional_32_Template_input_keyup_enter_8_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.login()); });
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(9, LoginComponent_Conditional_0_Conditional_32_Conditional_9_Template, 2, 0, "span", 76);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "div", 70)(11, "div", 77)(12, "label", 78);
    i0.ɵɵtext(13, "M\u1EADt kh\u1EA9u");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "div", 72)(15, "div", 73);
    i0.ɵɵelement(16, "i", 79);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "input", 80);
    i0.ɵɵtwoWayListener("ngModelChange", function LoginComponent_Conditional_0_Conditional_32_Template_input_ngModelChange_17_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r2.password, $event) || (ctx_r2.password = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("keyup.enter", function LoginComponent_Conditional_0_Conditional_32_Template_input_keyup_enter_17_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.login()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "button", 81);
    i0.ɵɵlistener("click", function LoginComponent_Conditional_0_Conditional_32_Template_button_click_18_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.showPassword.set(!ctx_r2.showPassword())); });
    i0.ɵɵelement(19, "i", 82);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(20, "div", 46)(21, "label", 47)(22, "span", 83)(23, "input", 84);
    i0.ɵɵlistener("change", function LoginComponent_Conditional_0_Conditional_32_Template_input_change_23_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.toggleRememberSession()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelement(24, "span", 85)(25, "span", 86);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "span", 51);
    i0.ɵɵtext(27, "Duy tr\u00EC \u0111\u0103ng nh\u1EADp");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(28, "label", 47)(29, "span", 83)(30, "input", 87);
    i0.ɵɵlistener("change", function LoginComponent_Conditional_0_Conditional_32_Template_input_change_30_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.toggleSharedDevice()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelement(31, "span", 85)(32, "span", 86);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(33, "span", 51);
    i0.ɵɵtext(34, "M\u00E1y d\u00F9ng chung");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(35, "div", 52)(36, "button", 53);
    i0.ɵɵelement(37, "i", 54);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(38, "div", 55)(39, "div", 56);
    i0.ɵɵelement(40, "i", 57);
    i0.ɵɵtext(41, " H\u01B0\u1EDBng d\u1EABn b\u1EA3o m\u1EADt phi\u00EAn ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(42, "div", 58)(43, "div")(44, "strong");
    i0.ɵɵtext(45, "\u2022 Duy tr\u00EC \u0111\u0103ng nh\u1EADp:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(46, " Gi\u1EEF phi\u00EAn \u0111\u0103ng nh\u1EADp tr\u00EAn m\u00E1y c\u00E1 nh\u00E2n.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(47, "div")(48, "strong");
    i0.ɵɵtext(49, "\u2022 M\u00E1y d\u00F9ng chung:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(50, " T\u1EF1 tho\u00E1t phi\u00EAn sau th\u1EDDi gian kh\u00F4ng ho\u1EA1t \u0111\u1ED9ng.");
    i0.ɵɵelementEnd()()()()();
    i0.ɵɵtemplate(51, LoginComponent_Conditional_0_Conditional_32_Conditional_51_Template, 3, 1, "div", 88);
    i0.ɵɵelementStart(52, "div", 89)(53, "button", 90);
    i0.ɵɵlistener("click", function LoginComponent_Conditional_0_Conditional_32_Template_button_click_53_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.auth.openForgotPassword()); });
    i0.ɵɵtext(54, " Qu\u00EAn m\u1EADt kh\u1EA9u? ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(55, "button", 91);
    i0.ɵɵlistener("click", function LoginComponent_Conditional_0_Conditional_32_Template_button_click_55_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.login()); });
    i0.ɵɵelement(56, "div", 92);
    i0.ɵɵtemplate(57, LoginComponent_Conditional_0_Conditional_32_Conditional_57_Template, 1, 0, "i", 67)(58, LoginComponent_Conditional_0_Conditional_32_Conditional_58_Template, 3, 0);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(8);
    i0.ɵɵclassProp("border-red-400", ctx_r2.errorMsg())("bg-red-50", ctx_r2.errorMsg());
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.email);
    i0.ɵɵproperty("disabled", ctx_r2.isLoading());
    i0.ɵɵadvance();
    i0.ɵɵconditional(!ctx_r2.email.includes("@") ? 9 : -1);
    i0.ɵɵadvance(8);
    i0.ɵɵclassProp("border-red-400", ctx_r2.errorMsg())("bg-red-50", ctx_r2.errorMsg());
    i0.ɵɵproperty("type", ctx_r2.showPassword() ? "text" : "password");
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.password);
    i0.ɵɵproperty("disabled", ctx_r2.isLoading());
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("fa-eye", !ctx_r2.showPassword())("fa-eye-slash", ctx_r2.showPassword());
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("opacity-40", ctx_r2.isSharedDevice())("pointer-events-none", ctx_r2.isSharedDevice());
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("checked", ctx_r2.rememberSession())("disabled", ctx_r2.isSharedDevice());
    i0.ɵɵadvance(5);
    i0.ɵɵclassProp("opacity-40", ctx_r2.rememberSession())("pointer-events-none", ctx_r2.rememberSession());
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("checked", ctx_r2.isSharedDevice())("disabled", ctx_r2.rememberSession());
    i0.ɵɵadvance(21);
    i0.ɵɵconditional(ctx_r2.errorMsg() ? 51 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("disabled", ctx_r2.isLoading());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.isLoading() && !ctx_r2.isGoogleLoading() ? 57 : 58);
} }
function LoginComponent_Conditional_0_Conditional_33_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 98);
} }
function LoginComponent_Conditional_0_Conditional_33_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 99)(1, "div", 106);
    i0.ɵɵelement(2, "i", 107);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 108);
    i0.ɵɵtext(4, "Th\u00E0nh c\u00F4ng!");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span", 109);
    i0.ɵɵtext(6, "\u0110ang chuy\u1EC3n h\u01B0\u1EDBng...");
    i0.ɵɵelementEnd()();
} }
function LoginComponent_Conditional_0_Conditional_33_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 110);
    i0.ɵɵlistener("click", function LoginComponent_Conditional_0_Conditional_33_Conditional_10_Template_div_click_0_listener() { i0.ɵɵrestoreView(_r8); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.generateSession()); });
    i0.ɵɵelementStart(1, "div", 111);
    i0.ɵɵelement(2, "i", 112);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 113);
    i0.ɵɵtext(4, "M\u00E3 h\u1EBFt h\u1EA1n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span", 114);
    i0.ɵɵtext(6, "Nh\u1EA5n \u0111\u1EC3 t\u1EA3i l\u1EA1i");
    i0.ɵɵelementEnd()();
} }
function LoginComponent_Conditional_0_Conditional_33_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 101)(1, "div", 115);
    i0.ɵɵelement(2, "i", 116);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 117);
    i0.ɵɵtext(4, "L\u1ED7i k\u1EBFt n\u1ED1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span", 118);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "button", 119);
    i0.ɵɵlistener("click", function LoginComponent_Conditional_0_Conditional_33_Conditional_11_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r9); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.generateSession()); });
    i0.ɵɵtext(8, "Th\u1EED L\u1EA1i");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(ctx_r2.errorMsg());
} }
function LoginComponent_Conditional_0_Conditional_33_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 26)(1, "h2", 94);
    i0.ɵɵtext(2, "\u0110\u0103ng Nh\u1EADp Nhanh");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 95);
    i0.ɵɵtext(4, "S\u1EED d\u1EE5ng \u1EE9ng d\u1EE5ng LIMS tr\u00EAn \u0111i\u1EC7n tho\u1EA1i \u0111\u1EC3 qu\u00E9t m\u00E3 n\u00E0y.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 96);
    i0.ɵɵelement(6, "canvas", 97, 0);
    i0.ɵɵtemplate(8, LoginComponent_Conditional_0_Conditional_33_Conditional_8_Template, 1, 0, "div", 98)(9, LoginComponent_Conditional_0_Conditional_33_Conditional_9_Template, 7, 0, "div", 99)(10, LoginComponent_Conditional_0_Conditional_33_Conditional_10_Template, 7, 0, "div", 100)(11, LoginComponent_Conditional_0_Conditional_33_Conditional_11_Template, 9, 1, "div", 101);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "div", 102)(13, "label", 47)(14, "span", 83)(15, "input", 84);
    i0.ɵɵlistener("change", function LoginComponent_Conditional_0_Conditional_33_Template_input_change_15_listener() { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.toggleRememberSession()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelement(16, "span", 85)(17, "span", 86);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "span", 51);
    i0.ɵɵtext(19, "Duy tr\u00EC \u0111\u0103ng nh\u1EADp");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(20, "label", 47)(21, "span", 83)(22, "input", 87);
    i0.ɵɵlistener("change", function LoginComponent_Conditional_0_Conditional_33_Template_input_change_22_listener() { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.toggleSharedDevice()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelement(23, "span", 85)(24, "span", 86);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "span", 51);
    i0.ɵɵtext(26, "M\u00E1y d\u00F9ng chung");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(27, "div", 52)(28, "button", 53);
    i0.ɵɵelement(29, "i", 54);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "div", 55)(31, "div", 56);
    i0.ɵɵelement(32, "i", 57);
    i0.ɵɵtext(33, " H\u01B0\u1EDBng d\u1EABn b\u1EA3o m\u1EADt phi\u00EAn ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "div", 58)(35, "div")(36, "strong");
    i0.ɵɵtext(37, "\u2022 Duy tr\u00EC \u0111\u0103ng nh\u1EADp:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(38, " T\u1EAFt t\u1EF1 \u0111\u1ED9ng \u0111\u0103ng xu\u1EA5t sau 30 ph\u00FAt kh\u00F4ng ho\u1EA1t \u0111\u1ED9ng v\u00E0 gi\u1EEF phi\u00EAn \u0111\u0103ng nh\u1EADp qua ng\u00E0y (d\u00E0nh cho m\u00E1y c\u00E1 nh\u00E2n).");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(39, "div")(40, "strong");
    i0.ɵɵtext(41, "\u2022 M\u00E1y d\u00F9ng chung:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(42, " K\u00EDch ho\u1EA1t t\u1EF1 tho\u00E1t 30 ph\u00FAt v\u00E0 t\u1EF1 \u0111\u1ED9ng \u0111\u0103ng xu\u1EA5t t\u00E0i kho\u1EA3n Google khi nh\u1EA5n \u0111\u0103ng xu\u1EA5t \u0111\u1EC3 b\u1EA3o m\u1EADt.");
    i0.ɵɵelementEnd()()()()();
    i0.ɵɵelementStart(43, "div", 103)(44, "div", 104);
    i0.ɵɵelement(45, "div", 105);
    i0.ɵɵtext(46);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(8);
    i0.ɵɵconditional(ctx_r2.qrStatus() === "waiting" || ctx_r2.qrStatus() === "scanned" ? 8 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.qrStatus() === "approved" ? 9 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.qrStatus() === "expired" ? 10 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.errorMsg() && ctx_r2.mode() === "qr" ? 11 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("opacity-40", ctx_r2.isSharedDevice())("pointer-events-none", ctx_r2.isSharedDevice());
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("checked", ctx_r2.rememberSession())("disabled", ctx_r2.isSharedDevice());
    i0.ɵɵadvance(5);
    i0.ɵɵclassProp("opacity-40", ctx_r2.rememberSession())("pointer-events-none", ctx_r2.rememberSession());
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("checked", ctx_r2.isSharedDevice())("disabled", ctx_r2.rememberSession());
    i0.ɵɵadvance(23);
    i0.ɵɵclassProp("bg-fuchsia-500", ctx_r2.qrStatus() === "waiting")("animate-pulse", ctx_r2.qrStatus() === "waiting")("bg-gray-300", ctx_r2.qrStatus() !== "waiting");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.qrStatus() === "waiting" ? "\u0110ang ch\u1EDD qu\u00E9t m\u00E3..." : ctx_r2.qrStatus() === "scanned" ? "\u0110\u00E3 qu\u00E9t! Vui l\u00F2ng x\u00E1c nh\u1EADn." : "Tr\u1EA1ng th\u00E1i: " + ctx_r2.qrStatus(), " ");
} }
function LoginComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 1)(1, "div", 2);
    i0.ɵɵelement(2, "div", 3)(3, "div", 4)(4, "div", 5)(5, "div", 6)(6, "div", 7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div", 8)(8, "div", 9);
    i0.ɵɵelement(9, "div", 10);
    i0.ɵɵelementStart(10, "div", 11)(11, "div", 12);
    i0.ɵɵelement(12, "app-logo", 13);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "h1", 14);
    i0.ɵɵtext(14, "LIMS ");
    i0.ɵɵelementStart(15, "span", 15);
    i0.ɵɵtext(16, "NAFIQPM6");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(17, "p", 16);
    i0.ɵɵtext(18, "H\u1EC7 th\u1ED1ng qu\u1EA3n l\u00FD th\u00F4ng tin ph\u00F2ng th\u00ED nghi\u1EC7m");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(19, LoginComponent_Conditional_0_Conditional_19_Template, 12, 1, "div", 17);
    i0.ɵɵelementStart(20, "div", 18);
    i0.ɵɵelement(21, "div", 19);
    i0.ɵɵelementStart(22, "button", 20);
    i0.ɵɵlistener("click", function LoginComponent_Conditional_0_Template_button_click_22_listener() { i0.ɵɵrestoreView(_r1); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.switchMode("google")); });
    i0.ɵɵelement(23, "i", 21);
    i0.ɵɵtext(24, " Google ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "button", 20);
    i0.ɵɵlistener("click", function LoginComponent_Conditional_0_Template_button_click_25_listener() { i0.ɵɵrestoreView(_r1); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.switchMode("qr")); });
    i0.ɵɵelement(26, "i", 22);
    i0.ɵɵtext(27, " M\u00E3 QR ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "button", 20);
    i0.ɵɵlistener("click", function LoginComponent_Conditional_0_Template_button_click_28_listener() { i0.ɵɵrestoreView(_r1); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.switchMode("password")); });
    i0.ɵɵelement(29, "i", 23);
    i0.ɵɵtext(30, " T\u00E0i Kho\u1EA3n ");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(31, LoginComponent_Conditional_0_Conditional_31_Template, 38, 20, "div", 24)(32, LoginComponent_Conditional_0_Conditional_32_Template, 59, 33, "div", 25)(33, LoginComponent_Conditional_0_Conditional_33_Template, 47, 23, "div", 26);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "div", 27)(35, "div", 28)(36, "a", 29);
    i0.ɵɵtext(37, "Ch\u00EDnh s\u00E1ch b\u1EA3o m\u1EADt");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(38, "span", 30);
    i0.ɵɵtext(39, "\u2022");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "a", 31);
    i0.ɵɵtext(41, "\u0110i\u1EC1u kho\u1EA3n s\u1EED d\u1EE5ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(42, "span", 30);
    i0.ɵɵtext(43, "\u2022");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(44, "button", 32);
    i0.ɵɵlistener("click", function LoginComponent_Conditional_0_Template_button_click_44_listener() { i0.ɵɵrestoreView(_r1); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.changelogService.open()); });
    i0.ɵɵelement(45, "i", 33);
    i0.ɵɵtext(46, " Nh\u1EADt k\u00FD c\u1EADp nh\u1EADt ");
    i0.ɵɵelementEnd()();
    i0.ɵɵtext(47);
    i0.ɵɵelement(48, "br");
    i0.ɵɵelementStart(49, "span", 34);
    i0.ɵɵtext(50);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(51, "app-pwa-install-prompt");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(19);
    i0.ɵɵconditional(ctx_r2.logoutReason() ? 19 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵstyleProp("width", 31, "%")("left", ctx_r2.mode() === "google" ? 1.5 : ctx_r2.mode() === "qr" ? 34.5 : 67.5, "%");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("text-fuchsia-600", ctx_r2.mode() === "google")("dark:text-fuchsia-400", ctx_r2.mode() === "google")("text-gray-500", ctx_r2.mode() !== "google");
    i0.ɵɵadvance(3);
    i0.ɵɵclassProp("text-fuchsia-600", ctx_r2.mode() === "qr")("dark:text-fuchsia-400", ctx_r2.mode() === "qr")("text-gray-500", ctx_r2.mode() !== "qr");
    i0.ɵɵadvance(3);
    i0.ɵɵclassProp("text-fuchsia-600", ctx_r2.mode() === "password")("dark:text-fuchsia-400", ctx_r2.mode() === "password")("text-gray-500", ctx_r2.mode() !== "password");
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r2.mode() === "google" ? 31 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.mode() === "password" ? 32 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.mode() === "qr" ? 33 : -1);
    i0.ɵɵadvance(14);
    i0.ɵɵtextInterpolate1(" \u00A9 ", ctx_r2.year, " Angular Portal \u2022 Thi\u1EBFt k\u1EBF & Ph\u00E1t tri\u1EC3n b\u1EDFi Otada \u2022 S\u1EED d\u1EE5ng n\u1ED9i b\u1ED9");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("NAFIQPM6 Laboratory Information Management System Cloud \u2022 ", ctx_r2.state.systemVersion(), "");
} }
export class LoginComponent {
    constructor() {
        this.auth = inject(AuthService);
        this.toast = inject(ToastService);
        this.state = inject(StateService);
        this.changelogService = inject(ChangelogService);
        this.mode = signal('google');
        this.logoutReason = signal(null);
        this.isSharedDevice = signal(false);
        this.rememberSession = signal(false);
        this.email = '';
        this.password = '';
        this.showPassword = signal(false);
        this.pendingLinkPassword = '';
        this.errorMsg = signal('');
        this.isPWA = signal(false);
        this.isLoading = signal(false);
        this.isGoogleLoading = signal(false);
        this.isLinkLoading = signal(false);
        this.isResetLoading = signal(false);
        this.year = new Date().getFullYear();
        this.qrStatus = signal('waiting');
        this.currentSessionId = null;
        this.pollInterval = null;
    }
    ngOnInit() {
        const reason = localStorage.getItem('lims_logout_reason');
        if (reason) {
            this.logoutReason.set(reason);
            localStorage.removeItem('lims_logout_reason');
        }
        const sharedPref = localStorage.getItem('lims_shared_device');
        if (sharedPref === 'true') {
            this.isSharedDevice.set(true);
        }
        const rememberPref = localStorage.getItem('lims_remember_session');
        if (rememberPref === 'true') {
            this.rememberSession.set(true);
        }
        if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone) {
            this.isPWA.set(true);
        }
    }
    toggleSharedDevice() {
        this.isSharedDevice.set(!this.isSharedDevice());
        localStorage.setItem('lims_shared_device', this.isSharedDevice() ? 'true' : 'false');
        if (this.isSharedDevice()) {
            this.rememberSession.set(false);
            localStorage.setItem('lims_remember_session', 'false');
        }
        this.auth.updatePersistence(this.rememberSession());
    }
    toggleRememberSession() {
        this.rememberSession.set(!this.rememberSession());
        localStorage.setItem('lims_remember_session', this.rememberSession() ? 'true' : 'false');
        if (this.rememberSession()) {
            this.isSharedDevice.set(false);
            localStorage.setItem('lims_shared_device', 'false');
        }
        this.auth.updatePersistence(this.rememberSession());
    }
    ngOnDestroy() {
        this.cleanupSession();
    }
    switchMode(m) {
        this.mode.set(m);
        this.errorMsg.set('');
        this.auth.clearGoogleRedirectError();
        if (m === 'qr') {
            setTimeout(() => this.generateSession(), 100);
        }
        else {
            this.cleanupSession();
        }
    }
    async generateSession() {
        this.cleanupSession();
        this.errorMsg.set('');
        this.qrStatus.set('waiting');
        try {
            // 1. Tạo session bằng Admin SDK qua Vercel serverless function
            const createRes = await fetch('/api/qr/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            if (!createRes.ok) {
                throw new Error(`Server error: ${createRes.status}`);
            }
            const { sessionId, nonce, expiresAt } = await createRes.json();
            this.currentSessionId = sessionId;
            // 2. Hiển thị QR với format mới: LIMS_QR|sessionId|nonce
            // Mobile đọc QR này và gửi lên /api/qr/approve kèm Firebase ID Token
            try {
                const QRious = await ensureQrious();
                const qrData = `LIMS_QR|${sessionId}|${nonce}`;
                new QRious({
                    element: this.qrCanvas.nativeElement,
                    value: qrData,
                    size: 256,
                    level: 'M'
                });
            }
            catch (e) {
                console.error('QR library load error:', e);
                this.errorMsg.set('Không thể tải thư viện tạo mã QR. Vui lòng kiểm tra kết nối mạng.');
                return;
            }
            // 3. Poll /api/qr/status mỗi 3 giây để chờ Mobile approve
            this.pollInterval = setInterval(async () => {
                if (!this.currentSessionId)
                    return;
                try {
                    const statusRes = await fetch(`/api/qr/status?sessionId=${encodeURIComponent(this.currentSessionId)}`);
                    if (!statusRes.ok)
                        return;
                    const statusData = await statusRes.json();
                    if (statusData.status === 'approved' && statusData.customToken) {
                        this.qrStatus.set('approved');
                        this.cleanupSession(false);
                        await this.handleApproval(statusData.customToken);
                    }
                    else if (statusData.status === 'expired') {
                        this.qrStatus.set('expired');
                        this.cleanupSession(false);
                    }
                }
                catch {
                    // Lỗi mạng tạm thời — tiếp tục poll
                }
            }, 3000);
            // 4. Bộ đếm hết hạn dựa trên expiresAt từ server
            const remainingMs = Math.max((expiresAt - Date.now()), 0);
            this.expiryTimer = setTimeout(() => {
                this.qrStatus.set('expired');
                this.cleanupSession(false);
            }, remainingMs);
        }
        catch (e) {
            console.error('[QR generateSession] Error:', e);
            this.errorMsg.set('Không thể tạo phiên kết nối. Vui lòng thử lại.');
        }
    }
    cleanupSession(clearId = true) {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
        if (this.expiryTimer) {
            clearTimeout(this.expiryTimer);
            this.expiryTimer = null;
        }
        if (this.currentSessionId && clearId) {
            this.auth.deleteAuthSession(this.currentSessionId).catch(() => { });
            this.currentSessionId = null;
        }
    }
    async handleApproval(customToken) {
        // Desktop nhận customToken từ /api/qr/status, dùng signInWithCustomToken() để đăng nhập.
        // Không có password nào được truyền trong quá trình này.
        try {
            const { getAuth, signInWithCustomToken } = await import('firebase/auth');
            const auth = getAuth();
            await signInWithCustomToken(auth, customToken);
            this.toast.show('Đăng nhập qua QR thành công!', 'success');
        }
        catch (e) {
            console.error('[QR handleApproval] Error:', e);
            this.toast.show('Lỗi xác thực phiên đăng nhập.', 'error');
            this.generateSession(); // Thử lại
        }
    }
    async login() {
        if (!this.email || !this.password) {
            this.errorMsg.set('Vui lòng nhập đầy đủ thông tin.');
            return;
        }
        this.isLoading.set(true);
        this.isGoogleLoading.set(false);
        this.errorMsg.set('');
        // SMART DOMAIN APPEND LOGIC
        let finalEmail = this.email.trim();
        if (!finalEmail.includes('@')) {
            finalEmail += '@lims.com';
        }
        try {
            await this.auth.login(finalEmail, this.password);
        }
        catch (e) {
            this.handleError(e, false);
        }
        finally {
            this.isLoading.set(false);
        }
    }
    loginGoogle() {
        this.errorMsg.set('');
        this.auth.clearGoogleRedirectError();
        this.isLoading.set(true);
        this.isGoogleLoading.set(true);
        // Redirect navigates away from this document on success. Only reset the
        // button state when Firebase reports that the redirect could not start.
        void this.auth.loginWithGoogle().catch((e) => {
            if (e) {
                this.errorMsg.set(this.auth.googleRedirectError() || 'Không thể bắt đầu đăng nhập Google.');
            }
            this.isLoading.set(false);
            this.isGoogleLoading.set(false);
        });
    }
    async linkGoogleAccount() {
        if (!this.pendingLinkPassword) {
            this.errorMsg.set('Vui lòng nhập mật khẩu LIMS hiện tại.');
            return;
        }
        this.errorMsg.set('');
        this.isLinkLoading.set(true);
        try {
            await this.auth.linkPendingGoogleAccount(this.pendingLinkPassword);
            this.pendingLinkPassword = '';
            this.toast.show('Đã liên kết Google với tài khoản LIMS.', 'success');
        }
        catch (error) {
            this.handleError(error, false);
        }
        finally {
            this.isLinkLoading.set(false);
        }
    }
    async sendPasswordReset() {
        if (!this.email.trim()) {
            this.errorMsg.set('Vui lòng nhập Gmail hoặc email trước.');
            return;
        }
        this.errorMsg.set('');
        this.isResetLoading.set(true);
        try {
            await this.auth.sendPasswordReset(this.email);
            this.toast.show('Đã gửi email khôi phục mật khẩu. Hãy kiểm tra hộp thư.', 'success');
        }
        catch (error) {
            this.handleError(error, false);
        }
        finally {
            this.isResetLoading.set(false);
        }
    }
    handleError(e, isGoogle) {
        const code = e.code || '';
        const msg = e.message || '';
        if (code === 'auth/invalid-credential' || msg.includes('invalid-credential')) {
            this.errorMsg.set('Thông tin đăng nhập không chính xác.');
        }
        else if (code === 'auth/user-not-found' || code === 'auth/wrong-password') {
            this.errorMsg.set('Email hoặc mật khẩu không đúng.');
            this.password = '';
        }
        else if (code === 'auth/too-many-requests') {
            this.errorMsg.set('Tạm khóa do đăng nhập sai nhiều lần. Thử lại sau.');
        }
        else if (code === 'auth/network-request-failed') {
            this.errorMsg.set('Lỗi kết nối mạng.');
        }
        else if (code === 'auth/popup-blocked') {
            this.errorMsg.set('Trình duyệt đã chặn cửa sổ Popup.');
        }
        else if (code === 'permission-denied') {
            this.errorMsg.set('Tài khoản không có quyền truy cập hệ thống.');
        }
        else if (code === 'auth/weak-password') {
            this.errorMsg.set(msg || 'Mật khẩu chưa đủ mạnh.');
        }
        else if (code === 'auth/requires-recent-login') {
            this.errorMsg.set('Phiên đăng nhập đã cũ. Vui lòng đăng nhập lại rồi thử lại.');
        }
        else {
            this.errorMsg.set('Không thể hoàn tất đăng nhập. Vui lòng kiểm tra thông tin và thử lại.');
        }
    }
    static { this.ɵfac = function LoginComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LoginComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: LoginComponent, selectors: [["app-login"]], viewQuery: function LoginComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.qrCanvas = _t.first);
        } }, decls: 1, vars: 1, consts: [["qrCanvas", ""], [1, "min-h-screen", "w-full", "flex", "items-center", "justify-center", "overflow-hidden", "relative", "font-sans", "selection:bg-fuchsia-500", "selection:text-white", "bg-[#f8fafc]", "dark:bg-slate-950"], [1, "absolute", "inset-0", "z-0", "overflow-hidden", "pointer-events-none"], [1, "absolute", "top-[-10%]", "left-[-10%]", "w-[50vw]", "h-[50vw]", "bg-fuchsia-400/30", "rounded-full", "mix-blend-multiply", "filter", "blur-[80px]", "opacity-70", "animate-blob"], [1, "absolute", "top-[20%]", "right-[-10%]", "w-[40vw]", "h-[40vw]", "bg-pink-400/30", "rounded-full", "mix-blend-multiply", "filter", "blur-[80px]", "opacity-70", "animate-blob", "animation-delay-2000"], [1, "absolute", "bottom-[-20%]", "left-[20%]", "w-[60vw]", "h-[60vw]", "bg-purple-400/30", "rounded-full", "mix-blend-multiply", "filter", "blur-[80px]", "opacity-70", "animate-blob", "animation-delay-4000"], [1, "absolute", "bottom-[30%]", "right-[10%]", "w-[35vw]", "h-[35vw]", "bg-blue-400/20", "rounded-full", "mix-blend-multiply", "filter", "blur-[80px]", "opacity-60", "animate-blob", "animation-delay-6000"], [1, "absolute", "inset-0", "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNCkiLz48L3N2Zz4=')]", "opacity-60", "dark:opacity-20"], [1, "relative", "z-10", "w-full", "max-w-[420px]", "mx-4", "sm:mx-auto"], [1, "bg-white/60", "dark:bg-slate-900/60", "backdrop-blur-2xl", "border", "border-white/60", "dark:border-slate-800/60", "shadow-[0_20px_27px_0_rgba(0,0,0,0.05)]", "rounded-[2.5rem]", "p-8", "sm:p-10", "relative", "overflow-hidden"], [1, "absolute", "top-0", "left-0", "right-0", "h-1/2", "bg-gradient-to-b", "from-white/40", "to-transparent", "pointer-events-none"], [1, "text-center", "mb-8", "relative", "z-10"], [1, "inline-flex", "items-center", "justify-center", "w-24", "h-24", "rounded-[2rem]", "overflow-hidden", "shadow-lg", "shadow-indigo-500/10", "mb-6", "transform", "hover:scale-105", "transition-transform", "duration-300"], ["size", "96px"], [1, "text-2xl", "font-black", "text-gray-700", "dark:text-slate-200", "tracking-tight"], [1, "font-light", "text-gray-500"], [1, "text-gray-500", "dark:text-slate-400", "text-[13px]", "mt-2", "font-medium"], [1, "relative", "z-10", "mb-6", "p-4", "rounded-2xl", "bg-amber-50/90", "dark:bg-amber-950/40", "backdrop-blur-sm", "border", "border-amber-200", "dark:border-amber-900", "text-amber-800", "dark:text-amber-300", "text-[13px]", "font-medium", "animate-fade-in-up", "flex", "gap-3", "shadow-[0_4px_12px_rgba(217,119,6,0.08)]"], [1, "relative", "z-10", "bg-gray-100/80", "dark:bg-slate-800/80", "backdrop-blur-sm", "p-1", "rounded-2xl", "flex", "items-center", "mb-6", "border", "border-gray-200/30", "dark:border-slate-700/30", "shadow-inner", "relative", "h-10", "select-none"], [1, "absolute", "top-1", "bottom-1", "rounded-xl", "bg-white", "dark:bg-slate-700", "shadow-sm", "transition-all", "duration-300", "ease-out", "pointer-events-none"], [1, "flex-1", "py-1.5", "text-center", "text-xs", "font-bold", "transition-all", "relative", "z-10", "cursor-pointer", "select-none", "rounded-xl", 3, "click"], [1, "fa-brands", "fa-google", "mr-1"], [1, "fa-solid", "fa-qrcode", "mr-1"], [1, "fa-solid", "fa-shield-halved", "mr-1"], [1, "animate-fade-in-up", "relative", "z-10", "text-center"], [1, "animate-fade-in-up", "relative", "z-10"], [1, "animate-fade-in-up", "relative", "z-10", "flex", "flex-col", "items-center", "text-center"], [1, "text-center", "mt-6", "text-[11px]", "font-medium", "text-gray-400", "mb-8", "select-none"], [1, "mb-2", "flex", "flex-wrap", "items-center", "justify-center", "gap-3", "no-print"], ["routerLink", "/privacy-policy", 1, "hover:text-fuchsia-600", "dark:hover:text-fuchsia-400", "transition-colors", "cursor-pointer", "font-bold"], [1, "text-gray-300", "dark:text-slate-700"], ["routerLink", "/terms-of-service", 1, "hover:text-fuchsia-600", "dark:hover:text-fuchsia-400", "transition-colors", "cursor-pointer", "font-bold"], ["type", "button", 1, "hover:text-fuchsia-600", "dark:hover:text-fuchsia-400", "transition-colors", "cursor-pointer", "font-bold", "flex", "items-center", "gap-1", "inline-flex", 3, "click"], [1, "fa-solid", "fa-scroll", "text-blue-500"], [1, "text-gray-400/80", "dark:text-gray-500"], [1, "shrink-0", "text-amber-500", "text-base", "mt-0.5"], [1, "fa-solid", "fa-circle-exclamation"], [1, "flex-1", "text-left"], [1, "font-bold", "text-amber-900", "dark:text-amber-200", "mb-0.5"], [1, "text-amber-400", "hover:text-amber-600", "transition", "shrink-0", "self-start", "active:scale-90", "p-0.5", 3, "click"], [1, "fa-solid", "fa-xmark"], ["type", "button", 1, "w-full", "py-4", "mt-2", "bg-white", "dark:bg-slate-800", "backdrop-blur-md", "border", "border-white", "dark:border-slate-700", "hover:bg-gray-50", "dark:hover:bg-slate-750", "text-gray-700", "dark:text-slate-200", "rounded-2xl", "font-bold", "text-sm", "shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]", "hover:shadow-lg", "transition-all", "flex", "items-center", "justify-center", "gap-3", "active:scale-[0.98]", "group", "relative", "overflow-hidden", 3, "click", "disabled"], [1, "absolute", "inset-0", "bg-gradient-to-r", "from-transparent", "via-pink-50/50", "to-transparent", "dark:via-pink-950/20", "opacity-0", "group-hover:opacity-100", "transition-opacity"], [1, "fa-solid", "fa-spinner", "fa-spin", "text-gray-400"], [1, "w-8", "h-8", "rounded-full", "bg-red-50", "dark:bg-red-950/50", "flex", "items-center", "justify-center", "group-hover:bg-red-100", "dark:group-hover:bg-red-900/50", "transition-colors"], [1, "text-[15px]"], [1, "mt-4", "flex", "items-center", "justify-between", "gap-2", "text-left", "relative"], [1, "flex", "items-center", "gap-2", "cursor-pointer", "group", "select-none", "bg-white/40", "dark:bg-slate-850/40", "px-2.5", "py-1.5", "rounded-xl", "border", "border-white/60", "dark:border-slate-700/60", "shadow-sm", "hover:bg-white/60", "dark:hover:bg-slate-800/65", "transition-all", "flex-1", "min-w-0"], [1, "relative", "flex", "items-center", "justify-center", "w-4", "h-4", "rounded", "border", "border-gray-300", "dark:border-slate-650", "group-hover:border-fuchsia-400", "transition-colors", "shrink-0", "duration-200", 3, "ngClass"], ["type", "checkbox", 1, "opacity-0", "absolute", "inset-0", "cursor-pointer", 3, "change", "checked", "disabled"], [1, "fa-solid", "fa-check", "text-[9px]", "text-fuchsia-600", "dark:text-fuchsia-450", "animate-fade-in"], [1, "text-[11px]", "font-bold", "text-gray-500", "dark:text-slate-400", "group-hover:text-gray-755", "dark:group-hover:text-slate-300", "transition-colors", "truncate"], [1, "relative", "group/tooltip", "shrink-0"], ["type", "button", 1, "w-7", "h-7", "rounded-full", "bg-white/40", "dark:bg-slate-800/40", "hover:bg-white/60", "dark:hover:bg-slate-700/60", "text-gray-400", "dark:text-slate-500", "hover:text-fuchsia-600", "dark:hover:text-fuchsia-450", "flex", "items-center", "justify-center", "text-xs", "transition-colors", "cursor-help", "border", "border-white/50", "dark:border-slate-700/50", "shadow-sm"], [1, "fa-regular", "fa-circle-question", "text-[13px]"], [1, "absolute", "bottom-full", "right-0", "mb-2", "w-64", "bg-slate-900/95", "dark:bg-slate-950/95", "text-white", "text-[11px]", "p-3.5", "rounded-2xl", "shadow-xl", "border", "border-slate-700/50", "backdrop-blur-md", "opacity-0", "scale-95", "pointer-events-none", "group-hover/tooltip:opacity-100", "group-hover/tooltip:scale-100", "transition-all", "duration-200", "z-50", "origin-bottom-right", "leading-relaxed"], [1, "font-bold", "text-fuchsia-400", "mb-1.5", "flex", "items-center", "gap-1.5"], [1, "fa-solid", "fa-shield-halved"], [1, "space-y-1.5", "text-slate-300"], [1, "mt-4", "px-4", "py-3", "rounded-2xl", "bg-red-50/80", "backdrop-blur-sm", "border", "border-red-100", "text-red-600", "text-[13px]", "font-medium", "flex", "items-center", "justify-center", "gap-2", "animate-shake"], [1, "mt-4", "p-4", "rounded-2xl", "bg-amber-50/90", "dark:bg-amber-950/30", "border", "border-amber-200", "dark:border-amber-900/50", "text-left"], [1, "fa-brands", "fa-google", "text-red-500", "text-[16px]", "group-hover:scale-110", "transition-transform"], [1, "fa-solid", "fa-circle-exclamation", "text-red-500"], [1, "text-xs", "font-bold", "text-amber-800", "dark:text-amber-200", "mb-1"], [1, "text-[11px]", "text-amber-700", "dark:text-amber-300", "leading-relaxed", "mb-3"], ["type", "password", "placeholder", "M\u1EADt kh\u1EA9u LIMS hi\u1EC7n t\u1EA1i", "autocomplete", "current-password", 1, "w-full", "px-3", "py-2.5", "rounded-xl", "border", "border-amber-200", "dark:border-amber-800", "bg-white/80", "dark:bg-slate-900/60", "text-sm", "outline-none", "focus:border-amber-500", 3, "ngModelChange", "keyup.enter", "ngModel", "disabled"], ["type", "button", 1, "w-full", "mt-2.5", "py-2.5", "rounded-xl", "bg-amber-600", "hover:bg-amber-700", "disabled:opacity-60", "text-white", "text-xs", "font-bold", "transition", "flex", "items-center", "justify-center", "gap-2", 3, "click", "disabled"], [1, "fa-solid", "fa-circle-notch", "fa-spin"], [1, "fa-solid", "fa-link"], [1, "space-y-4"], [1, "group"], [1, "block", "text-[11px]", "font-bold", "text-gray-500", "uppercase", "tracking-wider", "mb-1.5", "ml-1"], [1, "relative"], [1, "absolute", "inset-y-0", "left-0", "pl-4", "flex", "items-center", "pointer-events-none"], [1, "fa-regular", "fa-user", "text-gray-400", "group-focus-within:text-fuchsia-500", "transition-colors"], ["id", "login-email", "name", "email", "type", "text", "autocomplete", "username", "placeholder", "Nh\u1EADp Gmail ho\u1EB7c username...", 1, "w-full", "pl-11", "pr-24", "py-3.5", "bg-white/50", "dark:bg-slate-800/50", "backdrop-blur-sm", "border", "border-white/40", "dark:border-slate-700/40", "rounded-2xl", "text-sm", "font-semibold", "text-gray-700", "dark:text-slate-200", "outline-none", "focus:bg-white", "focus:border-fuchsia-400", "dark:focus:border-fuchsia-500", "focus:ring-4", "focus:ring-fuchsia-400/10", "transition-all", "shadow-sm", "placeholder:font-normal", "placeholder:text-gray-400", "dark:placeholder:text-gray-500", 3, "ngModelChange", "keyup.enter", "ngModel", "disabled"], [1, "absolute", "right-4", "top-3.5", "text-gray-400", "font-medium", "text-sm", "pointer-events-none", "select-none", "tracking-tight", "animate-fade-in"], [1, "flex", "justify-between", "items-center", "mb-1.5", "ml-1"], ["for", "login-password", 1, "block", "text-[11px]", "font-bold", "text-gray-500", "uppercase", "tracking-wider"], [1, "fa-solid", "fa-lock", "text-gray-400", "group-focus-within:text-fuchsia-500", "transition-colors"], ["id", "login-password", "name", "password", "autocomplete", "current-password", "placeholder", "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", 1, "w-full", "pl-11", "pr-12", "py-3.5", "bg-white/50", "dark:bg-slate-800/50", "backdrop-blur-sm", "border", "border-white/40", "dark:border-slate-700/40", "rounded-2xl", "text-sm", "font-semibold", "text-gray-700", "dark:text-slate-200", "outline-none", "focus:bg-white", "focus:border-fuchsia-400", "dark:focus:border-fuchsia-500", "focus:ring-4", "focus:ring-fuchsia-400/10", "transition-all", "shadow-sm", "placeholder:font-normal", "placeholder:text-gray-400", "dark:placeholder:text-gray-500", 3, "ngModelChange", "keyup.enter", "type", "ngModel", "disabled"], ["type", "button", "tabindex", "-1", "aria-label", "Hi\u1EC7n ho\u1EB7c \u1EA9n m\u1EADt kh\u1EA9u", 1, "absolute", "inset-y-0", "right-0", "px-4", "flex", "items-center", "text-gray-400", "hover:text-fuchsia-600", "transition-colors", 3, "click"], [1, "fa-solid"], [1, "relative", "inline-flex", "h-5", "w-9", "shrink-0"], ["type", "checkbox", "aria-label", "Duy tr\u00EC \u0111\u0103ng nh\u1EADp", 1, "peer", "sr-only", 3, "change", "checked", "disabled"], [1, "absolute", "inset-0", "rounded-full", "bg-slate-300", "dark:bg-slate-600", "transition-colors", "peer-checked:bg-fuchsia-500"], [1, "absolute", "left-0.5", "top-0.5", "h-4", "w-4", "rounded-full", "bg-white", "shadow-sm", "transition-transform", "peer-checked:translate-x-4"], ["type", "checkbox", "aria-label", "M\u00E1y d\u00F9ng chung", 1, "peer", "sr-only", 3, "change", "checked", "disabled"], [1, "px-4", "py-3", "rounded-2xl", "bg-red-50/80", "backdrop-blur-sm", "border", "border-red-100", "text-red-600", "text-[13px]", "font-medium", "flex", "items-center", "gap-2", "animate-shake"], [1, "text-right", "-mt-1"], ["type", "button", 1, "text-[11px]", "font-bold", "text-fuchsia-600", "dark:text-fuchsia-400", "hover:underline", 3, "click"], [1, "w-full", "py-4", "mt-2", "bg-[linear-gradient(310deg,#7928ca,#ff0080)]", "hover:opacity-90", "text-white", "rounded-2xl", "font-bold", "text-sm", "shadow-[0_4px_6px_-1px_rgba(203,12,159,0.2)]", "hover:shadow-[0_8px_15px_-6px_rgba(203,12,159,0.4)]", "hover:-translate-y-0.5", "transition-all", "active:scale-[0.98]", "disabled:opacity-70", "disabled:cursor-not-allowed", "disabled:transform-none", "flex", "items-center", "justify-center", "gap-2", "relative", "overflow-hidden", "group", 3, "click", "disabled"], [1, "absolute", "inset-0", "w-1/2", "h-full", "bg-white/20", "transform", "-skew-x-12", "-translate-x-full", "group-hover:animate-shimmer"], [1, "fa-solid", "fa-shield-halved", "text-xs"], [1, "text-xl", "font-bold", "text-gray-700", "dark:text-slate-200", "mb-2"], [1, "text-gray-500", "dark:text-slate-400", "text-[13px]", "mb-8", "px-4"], [1, "bg-white", "dark:bg-slate-800", "p-3", "rounded-[2rem]", "shadow-sm", "border", "border-gray-100", "dark:border-slate-700", "relative", "group", "w-64", "h-64", "mx-auto", "flex", "items-center", "justify-center", "overflow-hidden"], [1, "w-56", "h-56", "relative", "z-10"], [1, "absolute", "left-0", "right-0", "h-[2px]", "bg-gradient-to-r", "from-transparent", "via-fuchsia-500", "to-transparent", "shadow-[0_0_8px_#d946ef]", "z-20", "animate-laser"], [1, "absolute", "inset-0", "bg-white/95", "dark:bg-slate-800/95", "backdrop-blur-sm", "flex", "flex-col", "items-center", "justify-center", "rounded-[2rem]", "animate-fade-in", "z-30"], [1, "absolute", "inset-0", "bg-white/95", "dark:bg-slate-800/95", "backdrop-blur-sm", "flex", "flex-col", "items-center", "justify-center", "rounded-[2rem]", "animate-fade-in", "cursor-pointer", "group-hover:bg-gray-50", "dark:group-hover:bg-slate-700/60", "transition-colors", "z-30"], [1, "absolute", "inset-0", "bg-white/95", "dark:bg-slate-800/95", "backdrop-blur-sm", "flex", "flex-col", "items-center", "justify-center", "rounded-[2rem]", "animate-fade-in", "p-6", "text-center", "z-30"], [1, "mt-6", "flex", "items-center", "justify-between", "gap-2", "text-left", "relative", "w-full"], [1, "mt-6", "flex", "flex-col", "gap-4", "w-full"], [1, "flex", "items-center", "gap-2", "justify-center", "text-[13px]", "font-semibold", "text-gray-500", "dark:text-slate-400", "bg-white/50", "dark:bg-slate-800/50", "backdrop-blur-sm", "py-2", "px-4", "rounded-xl", "border", "border-white/60", "dark:border-slate-700/60", "shadow-sm"], [1, "w-2", "h-2", "rounded-full"], [1, "w-16", "h-16", "bg-green-50", "dark:bg-green-950/50", "text-green-500", "rounded-full", "flex", "items-center", "justify-center", "text-3xl", "mb-3", "shadow-inner"], [1, "fa-solid", "fa-check"], [1, "font-bold", "text-green-700", "dark:text-green-400", "text-lg"], [1, "text-[13px]", "text-green-600/80", "dark:text-green-550/80", "font-medium", "mt-1"], [1, "absolute", "inset-0", "bg-white/95", "dark:bg-slate-800/95", "backdrop-blur-sm", "flex", "flex-col", "items-center", "justify-center", "rounded-[2rem]", "animate-fade-in", "cursor-pointer", "group-hover:bg-gray-50", "dark:group-hover:bg-slate-700/60", "transition-colors", "z-30", 3, "click"], [1, "w-16", "h-16", "bg-gray-100", "dark:bg-slate-700", "text-gray-400", "dark:text-slate-500", "rounded-full", "flex", "items-center", "justify-center", "text-3xl", "mb-3", "shadow-inner", "group-hover:scale-110", "transition-transform"], [1, "fa-solid", "fa-rotate-right"], [1, "font-bold", "text-gray-700", "dark:text-slate-300"], [1, "text-[13px]", "text-fuchsia-600", "dark:text-fuchsia-400", "font-bold", "mt-1"], [1, "w-12", "h-12", "bg-red-50", "dark:bg-red-950/50", "text-red-500", "rounded-full", "flex", "items-center", "justify-center", "text-2xl", "mb-3"], [1, "fa-solid", "fa-triangle-exclamation"], [1, "font-bold", "text-red-700", "dark:text-red-400", "text-sm"], [1, "text-[11px]", "text-red-500/80", "mt-1", "mb-4"], [1, "px-4", "py-2", "bg-red-50", "dark:bg-red-950/50", "text-red-700", "dark:text-red-400", "border", "border-red-100", "dark:border-red-900/50", "rounded-xl", "text-xs", "font-bold", "hover:bg-red-100", "dark:hover:bg-red-900", "transition-colors", 3, "click"]], template: function LoginComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, LoginComponent_Conditional_0_Template, 52, 28, "div", 1);
        } if (rf & 2) {
            i0.ɵɵconditional(!ctx.auth.currentUser() ? 0 : -1);
        } }, dependencies: [CommonModule, i1.NgClass, FormsModule, i2.DefaultValueAccessor, i2.NgControlStatus, i2.NgModel, PwaInstallPromptComponent, LogoComponent, RouterLink], styles: ["@keyframes _ngcontent-%COMP%_fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }\n    .animate-fade-in-up[_ngcontent-%COMP%] { animation: _ngcontent-%COMP%_fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }\n    \n    @keyframes _ngcontent-%COMP%_shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }\n    .animate-shake[_ngcontent-%COMP%] { animation: _ngcontent-%COMP%_shake 0.3s ease-in-out; }\n\n    @keyframes _ngcontent-%COMP%_blob {\n      0% { transform: translate(0px, 0px) scale(1); }\n      33% { transform: translate(30px, -50px) scale(1.1); }\n      66% { transform: translate(-20px, 20px) scale(0.9); }\n      100% { transform: translate(0px, 0px) scale(1); }\n    }\n    .animate-blob[_ngcontent-%COMP%] { animation: _ngcontent-%COMP%_blob 10s infinite; }\n    .animation-delay-2000[_ngcontent-%COMP%] { animation-delay: 2s; }\n    .animation-delay-4000[_ngcontent-%COMP%] { animation-delay: 4s; }\n    .animation-delay-6000[_ngcontent-%COMP%] { animation-delay: 6s; }\n\n    @keyframes _ngcontent-%COMP%_laser {\n      0% { top: 4%; }\n      50% { top: 96%; }\n      100% { top: 4%; }\n    }\n    .animate-laser[_ngcontent-%COMP%] { animation: _ngcontent-%COMP%_laser 3s infinite ease-in-out; }\n\n    @keyframes _ngcontent-%COMP%_shimmer {\n      0% { transform: skewX(-12deg) translateX(-100%); }\n      100% { transform: skewX(-12deg) translateX(250%); }\n    }\n    .group[_ngcontent-%COMP%]:hover   .group-hover[_ngcontent-%COMP%]:animate-shimmer {\n      animation: _ngcontent-%COMP%_shimmer 1s ease-in-out forwards;\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LoginComponent, [{
        type: Component,
        args: [{ selector: 'app-login', standalone: true, imports: [CommonModule, FormsModule, PwaInstallPromptComponent, LogoComponent, RouterLink], template: `
    @if (!auth.currentUser()) {
      <div class="min-h-screen w-full flex items-center justify-center overflow-hidden relative font-sans selection:bg-fuchsia-500 selection:text-white bg-[#f8fafc] dark:bg-slate-950">
        
        <!-- Animated Light Gradient Background (Fluid Shapes) -->
        <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div class="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-fuchsia-400/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob"></div>
            <div class="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-pink-400/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-2000"></div>
            <div class="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-purple-400/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-4000"></div>
            <div class="absolute bottom-[30%] right-[10%] w-[35vw] h-[35vw] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob animation-delay-6000"></div>
            <!-- Subtle Grid Pattern Overlay for a "Lab" feel -->
            <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNCkiLz48L3N2Zz4=')] opacity-60 dark:opacity-20"></div>
        </div>

        <!-- Centered Glass Card -->
        <div class="relative z-10 w-full max-w-[420px] mx-4 sm:mx-auto">
            
            <div class="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/60 dark:border-slate-800/60 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden">
                
                <!-- Subtle inner shine -->
                <div class="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>

                <div class="text-center mb-8 relative z-10">
                    <div class="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] overflow-hidden shadow-lg shadow-indigo-500/10 mb-6 transform hover:scale-105 transition-transform duration-300">
                        <app-logo size="96px"></app-logo>
                    </div>
                    <h1 class="text-2xl font-black text-gray-700 dark:text-slate-200 tracking-tight">LIMS <span class="font-light text-gray-500">NAFIQPM6</span></h1>
                    <p class="text-gray-500 dark:text-slate-400 text-[13px] mt-2 font-medium">Hệ thống quản lý thông tin phòng thí nghiệm</p>
                </div>

                <!-- LOGOUT REASON NOTIFICATION -->
                @if (logoutReason()) {
                  <div class="relative z-10 mb-6 p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 backdrop-blur-sm border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-[13px] font-medium animate-fade-in-up flex gap-3 shadow-[0_4px_12px_rgba(217,119,6,0.08)]">
                    <div class="shrink-0 text-amber-500 text-base mt-0.5">
                      <i class="fa-solid fa-circle-exclamation"></i>
                    </div>
                    <div class="flex-1 text-left">
                      <div class="font-bold text-amber-900 dark:text-amber-200 mb-0.5">Thông báo hệ thống</div>
                      <div>
                        @if (logoutReason() === 'idle') {
                          Phiên đăng nhập đã hết hạn do hệ thống không hoạt động trong 30 phút. Vui lòng đăng nhập lại.
                        } @else if (logoutReason() === 'permission-denied') {
                          Tài khoản của bạn đã bị từ chối truy cập bởi hệ thống. Vui lòng liên hệ Admin.
                        } @else {
                          Bạn đã được đăng xuất khỏi hệ thống.
                        }
                      </div>
                    </div>
                    <button (click)="logoutReason.set(null)" class="text-amber-400 hover:text-amber-600 transition shrink-0 self-start active:scale-90 p-0.5">
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                }

                <!-- TAB SWITCHER: PILL SEGMENTED CONTROL -->
                <div class="relative z-10 bg-gray-100/80 dark:bg-slate-800/80 backdrop-blur-sm p-1 rounded-2xl flex items-center mb-6 border border-gray-200/30 dark:border-slate-700/30 shadow-inner relative h-10 select-none">
                    <!-- Sliding highlight indicator -->
                    <div class="absolute top-1 bottom-1 rounded-xl bg-white dark:bg-slate-700 shadow-sm transition-all duration-300 ease-out pointer-events-none"
                         [style.width.%]="31"
                         [style.left.%]="mode() === 'google' ? 1.5 : (mode() === 'qr' ? 34.5 : 67.5)">
                    </div>
                    
                    <button (click)="switchMode('google')" class="flex-1 py-1.5 text-center text-xs font-bold transition-all relative z-10 cursor-pointer select-none rounded-xl"
                            [class.text-fuchsia-600]="mode() === 'google'"
                            [class.dark:text-fuchsia-400]="mode() === 'google'"
                            [class.text-gray-500]="mode() !== 'google'">
                        <i class="fa-brands fa-google mr-1"></i> Google
                    </button>
                    <button (click)="switchMode('qr')" class="flex-1 py-1.5 text-center text-xs font-bold transition-all relative z-10 cursor-pointer select-none rounded-xl"
                            [class.text-fuchsia-600]="mode() === 'qr'"
                            [class.dark:text-fuchsia-400]="mode() === 'qr'"
                            [class.text-gray-500]="mode() !== 'qr'">
                        <i class="fa-solid fa-qrcode mr-1"></i> Mã QR
                    </button>
                    <button (click)="switchMode('password')" class="flex-1 py-1.5 text-center text-xs font-bold transition-all relative z-10 cursor-pointer select-none rounded-xl"
                            [class.text-fuchsia-600]="mode() === 'password'"
                            [class.dark:text-fuchsia-400]="mode() === 'password'"
                            [class.text-gray-500]="mode() !== 'password'">
                        <i class="fa-solid fa-shield-halved mr-1"></i> Tài Khoản
                    </button>
                </div>

                <!-- LOGIN MODE: GOOGLE (PRIMARY) -->
                @if (mode() === 'google') {
                    <div class="animate-fade-in-up relative z-10 text-center">
                        <button type="button" (click)="loginGoogle()" [disabled]="isLoading()"
                                class="w-full py-4 mt-2 bg-white dark:bg-slate-800 backdrop-blur-md border border-white dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-750 text-gray-700 dark:text-slate-200 rounded-2xl font-bold text-sm shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98] group relative overflow-hidden">
                            <!-- Subtle pink hover glow -->
                            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-pink-50/50 to-transparent dark:via-pink-950/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            @if (isGoogleLoading()) { <i class="fa-solid fa-spinner fa-spin text-gray-400"></i> }
                            @else { 
                                <div class="w-8 h-8 rounded-full bg-red-50 dark:bg-red-950/50 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/50 transition-colors">
                                    <i class="fa-brands fa-google text-red-500 text-[16px] group-hover:scale-110 transition-transform"></i> 
                                </div>
                            }
                            <span class="text-[15px]">
                              Đăng nhập với Google
                            </span>
                        </button>

                        <!-- Shared Device & Remember Session Checkboxes (Horizontal Row) -->
                        <div class="mt-4 flex items-center justify-between gap-2 text-left relative">
                            <!-- Checkbox 1: Remember session -->
                            <label class="flex items-center gap-2 cursor-pointer group select-none bg-white/40 dark:bg-slate-850/40 px-2.5 py-1.5 rounded-xl border border-white/60 dark:border-slate-700/60 shadow-sm hover:bg-white/60 dark:hover:bg-slate-800/65 transition-all flex-1 min-w-0"
                                   [class.opacity-40]="isSharedDevice()"
                                   [class.pointer-events-none]="isSharedDevice()">
                                <div class="relative flex items-center justify-center w-4 h-4 rounded border border-gray-300 dark:border-slate-650 group-hover:border-fuchsia-400 transition-colors shrink-0 duration-200" 
                                     [ngClass]="rememberSession() ? 'bg-fuchsia-50 border-fuchsia-500 dark:bg-fuchsia-950/50' : 'border-gray-300 dark:border-slate-650'">
                                    <input type="checkbox" [checked]="rememberSession()" (change)="toggleRememberSession()" class="opacity-0 absolute inset-0 cursor-pointer" [disabled]="isSharedDevice()">
                                    @if (rememberSession()) {
                                        <i class="fa-solid fa-check text-[9px] text-fuchsia-600 dark:text-fuchsia-450 animate-fade-in"></i>
                                    }
                                </div>
                                <span class="text-[11px] font-bold text-gray-500 dark:text-slate-400 group-hover:text-gray-755 dark:group-hover:text-slate-300 transition-colors truncate">Duy trì đăng nhập</span>
                            </label>

                            <!-- Checkbox 2: Shared Device -->
                            <label class="flex items-center gap-2 cursor-pointer group select-none bg-white/40 dark:bg-slate-850/40 px-2.5 py-1.5 rounded-xl border border-white/60 dark:border-slate-700/60 shadow-sm hover:bg-white/60 dark:hover:bg-slate-800/65 transition-all flex-1 min-w-0"
                                   [class.opacity-40]="rememberSession()"
                                   [class.pointer-events-none]="rememberSession()">
                                <div class="relative flex items-center justify-center w-4 h-4 rounded border border-gray-300 dark:border-slate-650 group-hover:border-fuchsia-400 transition-colors shrink-0 duration-200" 
                                     [ngClass]="isSharedDevice() ? 'bg-fuchsia-50 border-fuchsia-500 dark:bg-fuchsia-950/50' : 'border-gray-300 dark:border-slate-650'">
                                    <input type="checkbox" [checked]="isSharedDevice()" (change)="toggleSharedDevice()" class="opacity-0 absolute inset-0 cursor-pointer" [disabled]="rememberSession()">
                                    @if (isSharedDevice()) {
                                        <i class="fa-solid fa-check text-[9px] text-fuchsia-600 dark:text-fuchsia-450 animate-fade-in"></i>
                                    }
                                </div>
                                <span class="text-[11px] font-bold text-gray-500 dark:text-slate-400 group-hover:text-gray-755 dark:group-hover:text-slate-300 transition-colors truncate">Máy dùng chung</span>
                            </label>

                            <!-- Tooltip Help Info -->
                            <div class="relative group/tooltip shrink-0">
                                <button type="button" class="w-7 h-7 rounded-full bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-700/60 text-gray-400 dark:text-slate-500 hover:text-fuchsia-600 dark:hover:text-fuchsia-450 flex items-center justify-center text-xs transition-colors cursor-help border border-white/50 dark:border-slate-700/50 shadow-sm">
                                    <i class="fa-regular fa-circle-question text-[13px]"></i>
                                </button>
                                <!-- Tooltip content -->
                                <div class="absolute bottom-full right-0 mb-2 w-64 bg-slate-900/95 dark:bg-slate-950/95 text-white text-[11px] p-3.5 rounded-2xl shadow-xl border border-slate-700/50 backdrop-blur-md opacity-0 scale-95 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all duration-200 z-50 origin-bottom-right leading-relaxed">
                                    <div class="font-bold text-fuchsia-400 mb-1.5 flex items-center gap-1.5">
                                        <i class="fa-solid fa-shield-halved"></i> Hướng dẫn bảo mật phiên
                                    </div>
                                    <div class="space-y-1.5 text-slate-300">
                                        <div><strong>• Duy trì đăng nhập:</strong> Tắt tự động đăng xuất sau 30 phút không hoạt động và giữ phiên đăng nhập qua ngày (dành cho máy cá nhân).</div>
                                        <div><strong>• Máy dùng chung:</strong> Kích hoạt tự thoát 30 phút và tự động đăng xuất tài khoản Google khi nhấn đăng xuất để bảo mật.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        @if (errorMsg() || auth.googleRedirectError()) {
                            <div class="mt-4 px-4 py-3 rounded-2xl bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 text-[13px] font-medium flex items-center justify-center gap-2 animate-shake">
                                <i class="fa-solid fa-circle-exclamation text-red-500"></i> {{ errorMsg() || auth.googleRedirectError() }}
                            </div>
                        }

                        @if (auth.pendingGoogleLinkEmail()) {
                            <div class="mt-4 p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-left">
                                <div class="text-xs font-bold text-amber-800 dark:text-amber-200 mb-1">Liên kết tài khoản hiện có</div>
                                <p class="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed mb-3">
                                    Email Google này đã có tài khoản LIMS. Nhập mật khẩu hiện tại để dùng chung một tài khoản.
                                </p>
                                <input type="password" [(ngModel)]="pendingLinkPassword" (keyup.enter)="linkGoogleAccount()"
                                       class="w-full px-3 py-2.5 rounded-xl border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-slate-900/60 text-sm outline-none focus:border-amber-500"
                                       placeholder="Mật khẩu LIMS hiện tại" [disabled]="isLinkLoading()" autocomplete="current-password">
                                <button type="button" (click)="linkGoogleAccount()" [disabled]="isLinkLoading()"
                                        class="w-full mt-2.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white text-xs font-bold transition flex items-center justify-center gap-2">
                                    @if (isLinkLoading()) { <i class="fa-solid fa-circle-notch fa-spin"></i> Đang liên kết... }
                                    @else { <i class="fa-solid fa-link"></i> Xác thực và liên kết Google }
                                </button>
                            </div>
                        }
                    </div>
                }

                <!-- LOGIN MODE: PASSWORD -->
                @if (mode() === 'password') {
                    <div class="animate-fade-in-up relative z-10">
                        <div class="space-y-4">
                            <div class="group">
                                <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Gmail / Email hoặc username</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <i class="fa-regular fa-user text-gray-400 group-focus-within:text-fuchsia-500 transition-colors"></i>
                                    </div>
                                    <input id="login-email" name="email" type="text" [(ngModel)]="email" (keyup.enter)="login()"
                                           autocomplete="username"
                                           class="w-full pl-11 pr-24 py-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/40 dark:border-slate-700/40 rounded-2xl text-sm font-semibold text-gray-700 dark:text-slate-200 outline-none focus:bg-white focus:border-fuchsia-400 dark:focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-400/10 transition-all shadow-sm placeholder:font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                           [class.border-red-400]="errorMsg()"
                                           [class.bg-red-50]="errorMsg()"
                                           placeholder="Nhập Gmail hoặc username..."
                                           [disabled]="isLoading()">

                                    @if (!email.includes('@')) {
                                        <span class="absolute right-4 top-3.5 text-gray-400 font-medium text-sm pointer-events-none select-none tracking-tight animate-fade-in">
                                            &#64;lims.com
                                        </span>
                                    }
                                </div>
                            </div>

                            <div class="group">
                                <div class="flex justify-between items-center mb-1.5 ml-1">
                                    <label for="login-password" class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Mật khẩu</label>
                                </div>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <i class="fa-solid fa-lock text-gray-400 group-focus-within:text-fuchsia-500 transition-colors"></i>
                                    </div>
                                    <input id="login-password" name="password" [type]="showPassword() ? 'text' : 'password'" [(ngModel)]="password" (keyup.enter)="login()"
                                           autocomplete="current-password"
                                           class="w-full pl-11 pr-12 py-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/40 dark:border-slate-700/40 rounded-2xl text-sm font-semibold text-gray-700 dark:text-slate-200 outline-none focus:bg-white focus:border-fuchsia-400 dark:focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-400/10 transition-all shadow-sm placeholder:font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                           [class.border-red-400]="errorMsg()"
                                           [class.bg-red-50]="errorMsg()"
                                           placeholder="••••••••"
                                           [disabled]="isLoading()">
                                    <button type="button" (click)="showPassword.set(!showPassword())" tabindex="-1" aria-label="Hiện hoặc ẩn mật khẩu"
                                            class="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400 hover:text-fuchsia-600 transition-colors">
                                        <i class="fa-solid" [class.fa-eye]="!showPassword()" [class.fa-eye-slash]="showPassword()"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- Shared Device & Remember Session iOS Toggles -->
                            <div class="mt-4 flex items-center justify-between gap-2 text-left relative">
                                <label class="flex items-center gap-2 cursor-pointer group select-none bg-white/40 dark:bg-slate-850/40 px-2.5 py-1.5 rounded-xl border border-white/60 dark:border-slate-700/60 shadow-sm hover:bg-white/60 dark:hover:bg-slate-800/65 transition-all flex-1 min-w-0"
                                       [class.opacity-40]="isSharedDevice()"
                                       [class.pointer-events-none]="isSharedDevice()">
                                    <span class="relative inline-flex h-5 w-9 shrink-0">
                                        <input type="checkbox" [checked]="rememberSession()" (change)="toggleRememberSession()" class="peer sr-only" [disabled]="isSharedDevice()" aria-label="Duy trì đăng nhập">
                                        <span class="absolute inset-0 rounded-full bg-slate-300 dark:bg-slate-600 transition-colors peer-checked:bg-fuchsia-500"></span>
                                        <span class="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4"></span>
                                    </span>
                                    <span class="text-[11px] font-bold text-gray-500 dark:text-slate-400 group-hover:text-gray-755 dark:group-hover:text-slate-300 transition-colors truncate">Duy trì đăng nhập</span>
                                </label>

                                <label class="flex items-center gap-2 cursor-pointer group select-none bg-white/40 dark:bg-slate-850/40 px-2.5 py-1.5 rounded-xl border border-white/60 dark:border-slate-700/60 shadow-sm hover:bg-white/60 dark:hover:bg-slate-800/65 transition-all flex-1 min-w-0"
                                       [class.opacity-40]="rememberSession()"
                                       [class.pointer-events-none]="rememberSession()">
                                    <span class="relative inline-flex h-5 w-9 shrink-0">
                                        <input type="checkbox" [checked]="isSharedDevice()" (change)="toggleSharedDevice()" class="peer sr-only" [disabled]="rememberSession()" aria-label="Máy dùng chung">
                                        <span class="absolute inset-0 rounded-full bg-slate-300 dark:bg-slate-600 transition-colors peer-checked:bg-fuchsia-500"></span>
                                        <span class="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4"></span>
                                    </span>
                                    <span class="text-[11px] font-bold text-gray-500 dark:text-slate-400 group-hover:text-gray-755 dark:group-hover:text-slate-300 transition-colors truncate">Máy dùng chung</span>
                                </label>

                                <!-- Tooltip Help Info -->
                                <div class="relative group/tooltip shrink-0">
                                    <button type="button" class="w-7 h-7 rounded-full bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-700/60 text-gray-400 dark:text-slate-500 hover:text-fuchsia-600 dark:hover:text-fuchsia-450 flex items-center justify-center text-xs transition-colors cursor-help border border-white/50 dark:border-slate-700/50 shadow-sm">
                                        <i class="fa-regular fa-circle-question text-[13px]"></i>
                                    </button>
                                    <div class="absolute bottom-full right-0 mb-2 w-64 bg-slate-900/95 dark:bg-slate-950/95 text-white text-[11px] p-3.5 rounded-2xl shadow-xl border border-slate-700/50 backdrop-blur-md opacity-0 scale-95 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all duration-200 z-50 origin-bottom-right leading-relaxed">
                                        <div class="font-bold text-fuchsia-400 mb-1.5 flex items-center gap-1.5">
                                            <i class="fa-solid fa-shield-halved"></i> Hướng dẫn bảo mật phiên
                                        </div>
                                        <div class="space-y-1.5 text-slate-300">
                                            <div><strong>• Duy trì đăng nhập:</strong> Giữ phiên đăng nhập trên máy cá nhân.</div>
                                            <div><strong>• Máy dùng chung:</strong> Tự thoát phiên sau thời gian không hoạt động.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            @if (errorMsg()) {
                                <div class="px-4 py-3 rounded-2xl bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 text-[13px] font-medium flex items-center gap-2 animate-shake">
                                    <i class="fa-solid fa-circle-exclamation text-red-500"></i> {{ errorMsg() }}
                                </div>
                            }

                            <div class="text-right -mt-1">
                                <button type="button" (click)="auth.openForgotPassword()"
                                        class="text-[11px] font-bold text-fuchsia-600 dark:text-fuchsia-400 hover:underline">
                                    Quên mật khẩu?
                                </button>
                            </div>

                            <button (click)="login()" [disabled]="isLoading()"
                                    class="w-full py-4 mt-2 bg-[linear-gradient(310deg,#7928ca,#ff0080)] hover:opacity-90 text-white rounded-2xl font-bold text-sm shadow-[0_4px_6px_-1px_rgba(203,12,159,0.2)] hover:shadow-[0_8px_15px_-6px_rgba(203,12,159,0.4)] hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 relative overflow-hidden group">
                                <div class="absolute inset-0 w-1/2 h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-shimmer"></div>
                                @if (isLoading() && !isGoogleLoading()) { <i class="fa-solid fa-circle-notch fa-spin"></i> }
                                @else { <i class="fa-solid fa-shield-halved text-xs"></i> <span>Đăng nhập LIMS</span> }
                            </button>
                        </div>
                    </div>
                }

                <!-- LOGIN MODE: QR SHOW -->
                @if (mode() === 'qr') {
                    <div class="animate-fade-in-up relative z-10 flex flex-col items-center text-center">
                        <h2 class="text-xl font-bold text-gray-700 dark:text-slate-200 mb-2">Đăng Nhập Nhanh</h2>
                        <p class="text-gray-500 dark:text-slate-400 text-[13px] mb-8 px-4">Sử dụng ứng dụng LIMS trên điện thoại để quét mã này.</p>

                        <div class="bg-white dark:bg-slate-800 p-3 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-700 relative group w-64 h-64 mx-auto flex items-center justify-center overflow-hidden">
                            <canvas #qrCanvas class="w-56 h-56 relative z-10"></canvas>
                            
                            <!-- Scanner Line Overlay (Laser Pulse) -->
                            @if (qrStatus() === 'waiting' || qrStatus() === 'scanned') {
                                <div class="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent shadow-[0_0_8px_#d946ef] z-20 animate-laser"></div>
                            }
                            
                            <!-- Overlay status -->
                            @if (qrStatus() === 'approved') {
                                <div class="absolute inset-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-[2rem] animate-fade-in z-30">
                                    <div class="w-16 h-16 bg-green-50 dark:bg-green-950/50 text-green-500 rounded-full flex items-center justify-center text-3xl mb-3 shadow-inner"><i class="fa-solid fa-check"></i></div>
                                    <span class="font-bold text-green-700 dark:text-green-400 text-lg">Thành công!</span>
                                    <span class="text-[13px] text-green-600/80 dark:text-green-550/80 font-medium mt-1">Đang chuyển hướng...</span>
                                </div>
                            }
                            @if (qrStatus() === 'expired') {
                                <div class="absolute inset-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-[2rem] animate-fade-in cursor-pointer group-hover:bg-gray-50 dark:group-hover:bg-slate-700/60 transition-colors z-30" (click)="generateSession()">
                                    <div class="w-16 h-16 bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500 rounded-full flex items-center justify-center text-3xl mb-3 shadow-inner group-hover:scale-110 transition-transform"><i class="fa-solid fa-rotate-right"></i></div>
                                    <span class="font-bold text-gray-700 dark:text-slate-300">Mã hết hạn</span>
                                    <span class="text-[13px] text-fuchsia-600 dark:text-fuchsia-400 font-bold mt-1">Nhấn để tải lại</span>
                                </div>
                            }
                            @if (errorMsg() && mode() === 'qr') {
                                <div class="absolute inset-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-[2rem] animate-fade-in p-6 text-center z-30">
                                    <div class="w-12 h-12 bg-red-50 dark:bg-red-950/50 text-red-500 rounded-full flex items-center justify-center text-2xl mb-3"><i class="fa-solid fa-triangle-exclamation"></i></div>
                                    <span class="font-bold text-red-700 dark:text-red-400 text-sm">Lỗi kết nối</span>
                                    <span class="text-[11px] text-red-500/80 mt-1 mb-4">{{ errorMsg() }}</span>
                                    <button (click)="generateSession()" class="px-4 py-2 bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/50 rounded-xl text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900 transition-colors">Thử Lại</button>
                                </div>
                            }
                        </div>

                        <!-- Shared Device & Remember Session iOS Toggles -->
                        <div class="mt-6 flex items-center justify-between gap-2 text-left relative w-full">
                            <label class="flex items-center gap-2 cursor-pointer group select-none bg-white/40 dark:bg-slate-850/40 px-2.5 py-1.5 rounded-xl border border-white/60 dark:border-slate-700/60 shadow-sm hover:bg-white/60 dark:hover:bg-slate-800/65 transition-all flex-1 min-w-0"
                                   [class.opacity-40]="isSharedDevice()"
                                   [class.pointer-events-none]="isSharedDevice()">
                                <span class="relative inline-flex h-5 w-9 shrink-0">
                                    <input type="checkbox" [checked]="rememberSession()" (change)="toggleRememberSession()" class="peer sr-only" [disabled]="isSharedDevice()" aria-label="Duy trì đăng nhập">
                                    <span class="absolute inset-0 rounded-full bg-slate-300 dark:bg-slate-600 transition-colors peer-checked:bg-fuchsia-500"></span>
                                    <span class="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4"></span>
                                </span>
                                <span class="text-[11px] font-bold text-gray-500 dark:text-slate-400 group-hover:text-gray-755 dark:group-hover:text-slate-300 transition-colors truncate">Duy trì đăng nhập</span>
                            </label>

                            <label class="flex items-center gap-2 cursor-pointer group select-none bg-white/40 dark:bg-slate-850/40 px-2.5 py-1.5 rounded-xl border border-white/60 dark:border-slate-700/60 shadow-sm hover:bg-white/60 dark:hover:bg-slate-800/65 transition-all flex-1 min-w-0"
                                   [class.opacity-40]="rememberSession()"
                                   [class.pointer-events-none]="rememberSession()">
                                <span class="relative inline-flex h-5 w-9 shrink-0">
                                    <input type="checkbox" [checked]="isSharedDevice()" (change)="toggleSharedDevice()" class="peer sr-only" [disabled]="rememberSession()" aria-label="Máy dùng chung">
                                    <span class="absolute inset-0 rounded-full bg-slate-300 dark:bg-slate-600 transition-colors peer-checked:bg-fuchsia-500"></span>
                                    <span class="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4"></span>
                                </span>
                                <span class="text-[11px] font-bold text-gray-500 dark:text-slate-400 group-hover:text-gray-755 dark:group-hover:text-slate-300 transition-colors truncate">Máy dùng chung</span>
                            </label>

                            <!-- Tooltip Help Info -->
                            <div class="relative group/tooltip shrink-0">
                                <button type="button" class="w-7 h-7 rounded-full bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-700/60 text-gray-400 dark:text-slate-500 hover:text-fuchsia-600 dark:hover:text-fuchsia-450 flex items-center justify-center text-xs transition-colors cursor-help border border-white/50 dark:border-slate-700/50 shadow-sm">
                                    <i class="fa-regular fa-circle-question text-[13px]"></i>
                                </button>
                                <!-- Tooltip content -->
                                <div class="absolute bottom-full right-0 mb-2 w-64 bg-slate-900/95 dark:bg-slate-950/95 text-white text-[11px] p-3.5 rounded-2xl shadow-xl border border-slate-700/50 backdrop-blur-md opacity-0 scale-95 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all duration-200 z-50 origin-bottom-right leading-relaxed">
                                    <div class="font-bold text-fuchsia-400 mb-1.5 flex items-center gap-1.5">
                                        <i class="fa-solid fa-shield-halved"></i> Hướng dẫn bảo mật phiên
                                    </div>
                                    <div class="space-y-1.5 text-slate-300">
                                            <div><strong>• Duy trì đăng nhập:</strong> Tắt tự động đăng xuất sau 30 phút không hoạt động và giữ phiên đăng nhập qua ngày (dành cho máy cá nhân).</div>
                                        <div><strong>• Máy dùng chung:</strong> Kích hoạt tự thoát 30 phút và tự động đăng xuất tài khoản Google khi nhấn đăng xuất để bảo mật.</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mt-6 flex flex-col gap-4 w-full">
                            <div class="flex items-center gap-2 justify-center text-[13px] font-semibold text-gray-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm py-2 px-4 rounded-xl border border-white/60 dark:border-slate-700/60 shadow-sm">
                                <div class="w-2 h-2 rounded-full" [class.bg-fuchsia-500]="qrStatus() === 'waiting'" [class.animate-pulse]="qrStatus() === 'waiting'" [class.bg-gray-300]="qrStatus() !== 'waiting'"></div>
                                {{ qrStatus() === 'waiting' ? 'Đang chờ quét mã...' : (qrStatus() === 'scanned' ? 'Đã quét! Vui lòng xác nhận.' : 'Trạng thái: ' + qrStatus()) }}
                            </div>
                        </div>
                    </div>
                }

            </div>
            
            <!-- Footer -->
            <div class="text-center mt-6 text-[11px] font-medium text-gray-400 mb-8 select-none">
                <div class="mb-2 flex flex-wrap items-center justify-center gap-3 no-print">
                    <a routerLink="/privacy-policy" class="hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors cursor-pointer font-bold">Chính sách bảo mật</a>
                    <span class="text-gray-300 dark:text-slate-700">&bull;</span>
                    <a routerLink="/terms-of-service" class="hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors cursor-pointer font-bold">Điều khoản sử dụng</a>
                    <span class="text-gray-300 dark:text-slate-700">&bull;</span>
                    <button type="button" (click)="changelogService.open()" class="hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors cursor-pointer font-bold flex items-center gap-1 inline-flex">
                        <i class="fa-solid fa-scroll text-blue-500"></i> Nhật ký cập nhật
                    </button>
                </div>
                &copy; {{year}} Angular Portal &bull; Thiết kế & Phát triển bởi Otada &bull; Sử dụng nội bộ<br>
                <span class="text-gray-400/80 dark:text-gray-500">NAFIQPM6 Laboratory Information Management System Cloud &bull; {{state.systemVersion()}}</span>
            </div>

            <!-- Install App Button & Prompt -->
            <app-pwa-install-prompt></app-pwa-install-prompt>

        </div>
      </div>
    }
  `, styles: ["\n    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }\n    .animate-fade-in-up { animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }\n    \n    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }\n    .animate-shake { animation: shake 0.3s ease-in-out; }\n\n    @keyframes blob {\n      0% { transform: translate(0px, 0px) scale(1); }\n      33% { transform: translate(30px, -50px) scale(1.1); }\n      66% { transform: translate(-20px, 20px) scale(0.9); }\n      100% { transform: translate(0px, 0px) scale(1); }\n    }\n    .animate-blob { animation: blob 10s infinite; }\n    .animation-delay-2000 { animation-delay: 2s; }\n    .animation-delay-4000 { animation-delay: 4s; }\n    .animation-delay-6000 { animation-delay: 6s; }\n\n    @keyframes laser {\n      0% { top: 4%; }\n      50% { top: 96%; }\n      100% { top: 4%; }\n    }\n    .animate-laser { animation: laser 3s infinite ease-in-out; }\n\n    @keyframes shimmer {\n      0% { transform: skewX(-12deg) translateX(-100%); }\n      100% { transform: skewX(-12deg) translateX(250%); }\n    }\n    .group:hover .group-hover:animate-shimmer {\n      animation: shimmer 1s ease-in-out forwards;\n    }\n  "] }]
    }], null, { qrCanvas: [{
            type: ViewChild,
            args: ['qrCanvas']
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "src/app/features/auth/login.component.ts", lineNumber: 453 }); })();
//# sourceMappingURL=login.component.js.map