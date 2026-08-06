import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
function PasswordSetupComponent_Conditional_0_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " C\u00E0i \u0111\u1EB7t m\u1EADt kh\u1EA9u LIMS ");
} }
function PasswordSetupComponent_Conditional_0_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " \u0110\u1ED5i m\u1EADt kh\u1EA9u LIMS ");
} }
function PasswordSetupComponent_Conditional_0_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " T\u00E0i kho\u1EA3n ");
    i0.ɵɵelementStart(1, "strong");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3, " \u0111\u00E3 s\u1EB5n s\u00E0ng. H\u00E3y t\u1EA1o m\u1EADt kh\u1EA9u d\u1EF1 ph\u00F2ng. ");
} if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate((tmp_2_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_2_0.email);
} }
function PasswordSetupComponent_Conditional_0_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " C\u1EADp nh\u1EADt m\u1EADt kh\u1EA9u cho ");
    i0.ɵɵelementStart(1, "strong");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3, ". ");
} if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate((tmp_2_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_2_0.email);
} }
function PasswordSetupComponent_Conditional_0_Conditional_30_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 16)(1, "label", 40);
    i0.ɵɵtext(2, "M\u1EADt kh\u1EA9u hi\u1EC7n t\u1EA1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 18)(4, "input", 41);
    i0.ɵɵtwoWayListener("ngModelChange", function PasswordSetupComponent_Conditional_0_Conditional_30_Template_input_ngModelChange_4_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r1.currentPassword, $event) || (ctx_r1.currentPassword = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "button", 20);
    i0.ɵɵlistener("click", function PasswordSetupComponent_Conditional_0_Conditional_30_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.toggleCurrentPassword()); });
    i0.ɵɵelement(6, "i", 21);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("type", ctx_r1.showCurrentPassword() ? "text" : "password");
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.currentPassword);
    i0.ɵɵproperty("disabled", ctx_r1.isSaving());
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("fa-eye", !ctx_r1.showCurrentPassword())("fa-eye-slash", ctx_r1.showCurrentPassword());
} }
function PasswordSetupComponent_Conditional_0_Conditional_78_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 34);
    i0.ɵɵelement(1, "i", 42);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.errorMsg());
} }
function PasswordSetupComponent_Conditional_0_Conditional_87_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 43);
    i0.ɵɵtext(1, " \u0110ang l\u01B0u... ");
} }
function PasswordSetupComponent_Conditional_0_Conditional_88_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 44);
    i0.ɵɵtext(1, " L\u01B0u m\u1EADt kh\u1EA9u v\u00E0 ti\u1EBFp t\u1EE5c ");
} }
function PasswordSetupComponent_Conditional_0_Conditional_89_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 45);
    i0.ɵɵlistener("click", function PasswordSetupComponent_Conditional_0_Conditional_89_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.logout()); });
    i0.ɵɵtext(1, " \u0110\u0103ng xu\u1EA5t v\u00E0 th\u1EF1c hi\u1EC7n sau ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("disabled", ctx_r1.isSaving());
} }
function PasswordSetupComponent_Conditional_0_Conditional_90_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 45);
    i0.ɵɵlistener("click", function PasswordSetupComponent_Conditional_0_Conditional_90_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.close()); });
    i0.ɵɵtext(1, " H\u1EE7y thao t\u00E1c ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("disabled", ctx_r1.isSaving());
} }
function PasswordSetupComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 0)(1, "div", 1);
    i0.ɵɵelement(2, "div", 2);
    i0.ɵɵelementStart(3, "div", 3)(4, "div", 4);
    i0.ɵɵelement(5, "i", 5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div")(7, "h2", 6);
    i0.ɵɵtemplate(8, PasswordSetupComponent_Conditional_0_Conditional_8_Template, 1, 0)(9, PasswordSetupComponent_Conditional_0_Conditional_9_Template, 1, 0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "p", 7);
    i0.ɵɵtemplate(11, PasswordSetupComponent_Conditional_0_Conditional_11_Template, 4, 1)(12, PasswordSetupComponent_Conditional_0_Conditional_12_Template, 4, 1);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(13, "div", 8)(14, "div", 9);
    i0.ɵɵelement(15, "i", 10);
    i0.ɵɵelementStart(16, "div", 11)(17, "p", 12);
    i0.ɵɵtext(18, "M\u1EADt kh\u1EA9u n\u00E0y d\u00F9ng \u0111\u1EC3 l\u00E0m g\u00EC?");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "p", 13);
    i0.ɵɵtext(20, " \u0110\u00E2y l\u00E0 m\u1EADt kh\u1EA9u \u0111\u0103ng nh\u1EADp ri\u00EAng c\u1EE7a LIMS. B\u1EA1n c\u00F3 th\u1EC3 d\u00F9ng ");
    i0.ɵɵelementStart(21, "strong");
    i0.ɵɵtext(22, "Gmail + m\u1EADt kh\u1EA9u LIMS");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(23, " \u0111\u1EC3 \u0111\u0103ng nh\u1EADp thay cho n\u00FAt Google. M\u1EADt kh\u1EA9u n\u00E0y ");
    i0.ɵɵelementStart(24, "strong");
    i0.ɵɵtext(25, "kh\u00F4ng ph\u1EA3i m\u1EADt kh\u1EA9u Gmail");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(26, " v\u00E0 kh\u00F4ng l\u00E0m thay \u0111\u1ED5i t\u00E0i kho\u1EA3n Google c\u1EE7a b\u1EA1n. ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "p", 14);
    i0.ɵɵtext(28, " B\u1EAFt bu\u1ED9c: \u00EDt nh\u1EA5t 8 k\u00FD t\u1EF1 v\u00E0 hai \u00F4 m\u1EADt kh\u1EA9u ph\u1EA3i tr\u00F9ng nhau. \u0110\u1ED9 m\u1EA1nh ch\u1EC9 l\u00E0 g\u1EE3i \u00FD. ");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(29, "form", 15);
    i0.ɵɵlistener("ngSubmit", function PasswordSetupComponent_Conditional_0_Template_form_ngSubmit_29_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.save()); });
    i0.ɵɵtemplate(30, PasswordSetupComponent_Conditional_0_Conditional_30_Template, 7, 7, "div", 16);
    i0.ɵɵelementStart(31, "div", 16)(32, "label", 17);
    i0.ɵɵtext(33, "M\u1EADt kh\u1EA9u m\u1EDBi");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "div", 18)(35, "input", 19);
    i0.ɵɵtwoWayListener("ngModelChange", function PasswordSetupComponent_Conditional_0_Template_input_ngModelChange_35_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.password, $event) || (ctx_r1.password = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function PasswordSetupComponent_Conditional_0_Template_input_ngModelChange_35_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onPasswordInput()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(36, "button", 20);
    i0.ɵɵlistener("click", function PasswordSetupComponent_Conditional_0_Template_button_click_36_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.toggleNewPassword()); });
    i0.ɵɵelement(37, "i", 21);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(38, "div", 22)(39, "div", 23)(40, "span", 24);
    i0.ɵɵtext(41, "G\u1EE3i \u00FD \u0111\u1ED9 m\u1EA1nh ");
    i0.ɵɵelementStart(42, "span", 25);
    i0.ɵɵtext(43, "(kh\u00F4ng b\u1EAFt bu\u1ED9c)");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(44, "span", 26);
    i0.ɵɵtext(45);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(46, "div", 27);
    i0.ɵɵelement(47, "div", 28)(48, "div", 28)(49, "div", 28)(50, "div", 28);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(51, "div", 16)(52, "label", 29);
    i0.ɵɵtext(53, "Nh\u1EADp l\u1EA1i m\u1EADt kh\u1EA9u m\u1EDBi");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(54, "div", 18)(55, "input", 30);
    i0.ɵɵtwoWayListener("ngModelChange", function PasswordSetupComponent_Conditional_0_Template_input_ngModelChange_55_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.confirmation, $event) || (ctx_r1.confirmation = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(56, "button", 20);
    i0.ɵɵlistener("click", function PasswordSetupComponent_Conditional_0_Template_button_click_56_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.toggleConfirmPassword()); });
    i0.ɵɵelement(57, "i", 21);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(58, "div", 31)(59, "ul", 32)(60, "li", 33);
    i0.ɵɵelement(61, "i", 21);
    i0.ɵɵelementStart(62, "span")(63, "strong");
    i0.ɵɵtext(64, "B\u1EAFt bu\u1ED9c:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(65, " \u00EDt nh\u1EA5t 8 k\u00FD t\u1EF1");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(66, "li", 33);
    i0.ɵɵelement(67, "i", 21);
    i0.ɵɵelementStart(68, "span")(69, "strong");
    i0.ɵɵtext(70, "G\u1EE3i \u00FD:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(71, " kh\u00F4ng ch\u1EE9a kho\u1EA3ng tr\u1EAFng");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(72, "li", 33);
    i0.ɵɵelement(73, "i", 21);
    i0.ɵɵelementStart(74, "span")(75, "strong");
    i0.ɵɵtext(76, "B\u1EAFt bu\u1ED9c:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(77, " x\u00E1c nh\u1EADn tr\u00F9ng kh\u1EDBp");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵtemplate(78, PasswordSetupComponent_Conditional_0_Conditional_78_Template, 4, 1, "div", 34);
    i0.ɵɵelementStart(79, "div", 35);
    i0.ɵɵelement(80, "i", 36);
    i0.ɵɵelementStart(81, "span", 37);
    i0.ɵɵtext(82, "M\u1EADt kh\u1EA9u n\u00E0y \u0111\u01B0\u1EE3c t\u1EA1o ri\u00EAng \u0111\u1EC3 d\u1EF1 ph\u00F2ng cho h\u1EC7 th\u1ED1ng LIMS v\u00E0 ho\u00E0n to\u00E0n ");
    i0.ɵɵelementStart(83, "strong");
    i0.ɵɵtext(84, "kh\u00F4ng \u1EA3nh h\u01B0\u1EDFng");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(85, " \u0111\u1EBFn m\u1EADt kh\u1EA9u Google hi\u1EC7n t\u1EA1i c\u1EE7a b\u1EA1n.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(86, "button", 38);
    i0.ɵɵtemplate(87, PasswordSetupComponent_Conditional_0_Conditional_87_Template, 2, 0)(88, PasswordSetupComponent_Conditional_0_Conditional_88_Template, 2, 0);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(89, PasswordSetupComponent_Conditional_0_Conditional_89_Template, 2, 1, "button", 39)(90, PasswordSetupComponent_Conditional_0_Conditional_90_Template, 2, 1, "button", 39);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(8);
    i0.ɵɵconditional(!ctx_r1.auth.hasPasswordProvider() ? 8 : 9);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(!ctx_r1.auth.hasPasswordProvider() ? 11 : 12);
    i0.ɵɵadvance(19);
    i0.ɵɵconditional(ctx_r1.auth.requiresCurrentPassword() ? 30 : -1);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("type", ctx_r1.showNewPassword() ? "text" : "password");
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.password);
    i0.ɵɵproperty("disabled", ctx_r1.isSaving());
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("fa-eye", !ctx_r1.showNewPassword())("fa-eye-slash", ctx_r1.showNewPassword());
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate(ctx_r1.strengthLabel());
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngClass", ctx_r1.strengthColors()[0]);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ctx_r1.strengthColors()[1]);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ctx_r1.strengthColors()[2]);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ctx_r1.strengthColors()[3]);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("type", ctx_r1.showConfirmPassword() ? "text" : "password");
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.confirmation);
    i0.ɵɵproperty("disabled", ctx_r1.isSaving());
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("fa-eye", !ctx_r1.showConfirmPassword())("fa-eye-slash", ctx_r1.showConfirmPassword());
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngClass", ctx_r1.checkLength() ? "text-emerald-500" : "text-slate-400");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("fa-circle-check", ctx_r1.checkLength())("fa-circle", !ctx_r1.checkLength());
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngClass", ctx_r1.checkNoSpaces() ? "text-blue-500" : "text-slate-400");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("fa-lightbulb", ctx_r1.checkNoSpaces())("fa-circle", !ctx_r1.checkNoSpaces());
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngClass", ctx_r1.checkMatch() ? "text-emerald-500" : "text-slate-400");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("fa-circle-check", ctx_r1.checkMatch())("fa-circle", !ctx_r1.checkMatch());
    i0.ɵɵadvance(5);
    i0.ɵɵconditional(ctx_r1.errorMsg() ? 78 : -1);
    i0.ɵɵadvance(8);
    i0.ɵɵproperty("disabled", ctx_r1.isSaving() || !ctx_r1.isFormValid());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isSaving() ? 87 : 88);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.auth.needsPasswordSetup() ? 89 : 90);
} }
export class PasswordSetupComponent {
    constructor() {
        this.auth = inject(AuthService);
        this.currentPassword = '';
        this.password = '';
        this.confirmation = '';
        this.showCurrentPassword = signal(false);
        this.showNewPassword = signal(false);
        this.showConfirmPassword = signal(false);
        this.isSaving = signal(false);
        this.errorMsg = signal('');
        this.passwordStrength = signal(0); // 0-4
        this.strengthColors = computed(() => {
            const s = this.passwordStrength();
            return [
                s >= 1 ? (s === 1 ? 'w-1/4 bg-red-500' : (s === 2 ? 'w-1/4 bg-amber-500' : (s === 3 ? 'w-1/4 bg-yellow-400' : 'w-1/4 bg-emerald-500'))) : 'w-0',
                s >= 2 ? (s === 2 ? 'w-1/4 bg-amber-500' : (s === 3 ? 'w-1/4 bg-yellow-400' : 'w-1/4 bg-emerald-500')) : 'w-0',
                s >= 3 ? (s === 3 ? 'w-1/4 bg-yellow-400' : 'w-1/4 bg-emerald-500') : 'w-0',
                s >= 4 ? 'w-1/4 bg-emerald-500' : 'w-0'
            ];
        });
    }
    // These fields are bound with ngModel, so evaluate their checklist state on
    // every change-detection pass instead of caching plain-property values.
    checkLength() { return this.password.length >= 8; }
    checkNoSpaces() { return this.password.length > 0 && !/\s/.test(this.password); }
    checkMatch() { return this.password.length > 0 && this.password === this.confirmation; }
    isFormValid() {
        return this.checkLength() && this.checkMatch() &&
            (!this.auth.requiresCurrentPassword() || this.currentPassword.length > 0);
    }
    strengthLabel() {
        const strength = this.passwordStrength();
        if (!this.password)
            return 'Chưa nhập';
        if (!this.checkLength())
            return 'Cần thêm ký tự';
        return ['Cơ bản', 'Khá', 'Tốt', 'Mạnh'][Math.max(0, strength - 1)] ?? 'Cơ bản';
    }
    toggleCurrentPassword() { this.showCurrentPassword.set(!this.showCurrentPassword()); }
    toggleNewPassword() { this.showNewPassword.set(!this.showNewPassword()); }
    toggleConfirmPassword() { this.showConfirmPassword.set(!this.showConfirmPassword()); }
    onPasswordInput() {
        let strength = 0;
        if (this.password.length >= 8)
            strength += 1;
        if (this.password.match(/[a-z]+/))
            strength += 1;
        if (this.password.match(/[A-Z]+/))
            strength += 1;
        if (this.password.match(/[0-9]+/) || this.password.match(/[^a-zA-Z0-9]+/))
            strength += 1;
        this.passwordStrength.set(strength);
    }
    async save() {
        this.errorMsg.set('');
        if (!this.isFormValid())
            return;
        this.isSaving.set(true);
        try {
            await this.auth.setLocalPassword(this.password, this.currentPassword || undefined);
            this.resetForm();
        }
        catch (error) {
            this.errorMsg.set(this.errorMessage(error));
        }
        finally {
            this.isSaving.set(false);
        }
    }
    async logout() {
        if (this.isSaving())
            return;
        await this.auth.logout();
    }
    close() {
        if (!this.isSaving()) {
            this.auth.closePasswordSetup();
            this.resetForm();
        }
    }
    resetForm() {
        this.password = '';
        this.confirmation = '';
        this.currentPassword = '';
        this.passwordStrength.set(0);
        this.errorMsg.set('');
    }
    errorMessage(error) {
        switch (error?.code) {
            case 'auth/missing-current-password':
                return 'Vui lòng nhập mật khẩu LIMS hiện tại để xác thực.';
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                return 'Mật khẩu hiện tại không đúng.';
            case 'auth/requires-recent-login':
                return 'Phiên bảo mật đã cũ. Vui lòng đăng xuất, đăng nhập lại bằng Mật khẩu cũ hoặc Google, sau đó đổi mật khẩu.';
            case 'auth/email-already-in-use':
            case 'auth/credential-already-in-use':
                return 'Email này đã có tài khoản mật khẩu khác. Hãy liên hệ quản trị viên.';
            case 'auth/weak-password':
                return error?.message || 'Mật khẩu chưa đủ mạnh.';
            case 'auth/network-request-failed':
                return 'Không thể kết nối máy chủ. Vui lòng thử lại.';
            default:
                return error?.message || 'Không thể tạo mật khẩu. Vui lòng thử lại.';
        }
    }
    static { this.ɵfac = function PasswordSetupComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PasswordSetupComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PasswordSetupComponent, selectors: [["app-password-setup"]], decls: 1, vars: 1, consts: [["role", "dialog", "aria-modal", "true", "aria-labelledby", "password-setup-title", 1, "fixed", "inset-0", "z-[10000]", "flex", "items-center", "justify-center", "bg-slate-950/75", "backdrop-blur-md", "p-4", "animate-fade-in-up"], [1, "w-full", "max-w-md", "rounded-3xl", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "shadow-2xl", "p-6", "md:p-8", "relative", "overflow-hidden"], [1, "absolute", "top-0", "left-0", "right-0", "h-1/2", "bg-gradient-to-b", "from-fuchsia-500/10", "to-transparent", "pointer-events-none"], [1, "flex", "items-start", "gap-4", "mb-6", "relative", "z-10"], [1, "w-12", "h-12", "rounded-2xl", "bg-fuchsia-100", "dark:bg-fuchsia-950/50", "text-fuchsia-600", "dark:text-fuchsia-400", "flex", "items-center", "justify-center", "shrink-0", "shadow-inner"], [1, "fa-solid", "fa-shield-halved", "text-xl"], ["id", "password-setup-title", 1, "text-xl", "font-black", "text-slate-800", "dark:text-white", "tracking-tight"], [1, "text-sm", "text-slate-500", "dark:text-slate-400", "mt-1.5", "leading-relaxed", "font-medium"], [1, "mb-5", "rounded-2xl", "border", "border-fuchsia-200", "dark:border-fuchsia-900/60", "bg-fuchsia-50/80", "dark:bg-fuchsia-950/25", "p-4", "relative", "z-10"], [1, "flex", "items-start", "gap-3"], [1, "fa-solid", "fa-key", "text-fuchsia-600", "dark:text-fuchsia-400", "mt-0.5", "shrink-0"], [1, "space-y-1.5"], [1, "text-sm", "font-black", "text-fuchsia-900", "dark:text-fuchsia-200"], [1, "text-xs", "font-medium", "leading-relaxed", "text-fuchsia-800/90", "dark:text-fuchsia-200/85"], [1, "text-[11px]", "font-bold", "leading-relaxed", "text-fuchsia-700", "dark:text-fuchsia-300"], [1, "space-y-4", "relative", "z-10", 3, "ngSubmit"], [1, "group"], ["for", "new-login-password", 1, "block", "text-[11px]", "font-bold", "text-slate-500", "uppercase", "tracking-wider", "mb-1.5", "ml-1"], [1, "relative"], ["id", "new-login-password", "name", "newLoginPassword", "autocomplete", "new-password", "placeholder", "\u00CDt nh\u1EA5t 8 k\u00FD t\u1EF1", 1, "w-full", "pl-4", "pr-11", "py-3.5", "bg-slate-50", "dark:bg-slate-800/50", "border", "border-slate-200", "dark:border-slate-700/60", "rounded-2xl", "text-sm", "font-semibold", "text-slate-700", "dark:text-slate-200", "outline-none", "focus:bg-white", "dark:focus:bg-slate-800", "focus:border-fuchsia-400", "dark:focus:border-fuchsia-500", "focus:ring-4", "focus:ring-fuchsia-400/10", "transition-all", "shadow-sm", 3, "ngModelChange", "type", "ngModel", "disabled"], ["type", "button", "tabindex", "-1", 1, "absolute", "inset-y-0", "right-0", "px-4", "flex", "items-center", "text-slate-400", "hover:text-slate-600", "dark:hover:text-slate-200", "transition-colors", 3, "click"], [1, "fa-solid"], ["aria-live", "polite", 1, "mt-3"], [1, "flex", "items-center", "justify-between", "mb-1.5", "px-1"], [1, "text-[10px]", "font-bold", "uppercase", "tracking-wider", "text-slate-400"], [1, "normal-case", "tracking-normal", "font-semibold"], [1, "text-[10px]", "font-bold", "text-slate-500", "dark:text-slate-400"], ["aria-hidden", "true", 1, "flex", "gap-1", "h-1.5", "w-full", "rounded-full", "overflow-hidden", "bg-slate-100", "dark:bg-slate-800"], [1, "h-full", "transition-all", "duration-300", 3, "ngClass"], ["for", "confirm-login-password", 1, "block", "text-[11px]", "font-bold", "text-slate-500", "uppercase", "tracking-wider", "mb-1.5", "ml-1"], ["id", "confirm-login-password", "name", "confirmLoginPassword", "autocomplete", "new-password", "placeholder", "Nh\u1EADp l\u1EA1i ch\u00EDnh x\u00E1c", 1, "w-full", "pl-4", "pr-11", "py-3.5", "bg-slate-50", "dark:bg-slate-800/50", "border", "border-slate-200", "dark:border-slate-700/60", "rounded-2xl", "text-sm", "font-semibold", "text-slate-700", "dark:text-slate-200", "outline-none", "focus:bg-white", "dark:focus:bg-slate-800", "focus:border-fuchsia-400", "dark:focus:border-fuchsia-500", "focus:ring-4", "focus:ring-fuchsia-400/10", "transition-all", "shadow-sm", 3, "ngModelChange", "type", "ngModel", "disabled"], [1, "bg-slate-50/50", "dark:bg-slate-800/30", "rounded-xl", "p-3", "border", "border-slate-100", "dark:border-slate-800/50"], [1, "text-[12px]", "space-y-2", "font-medium"], [1, "flex", "items-center", "gap-2", "transition-colors", 3, "ngClass"], [1, "px-4", "py-3", "rounded-2xl", "bg-red-50/80", "dark:bg-red-950/30", "border", "border-red-100", "dark:border-red-900/50", "text-red-600", "dark:text-red-400", "text-[13px]", "font-medium", "flex", "items-start", "gap-2", "animate-shake"], [1, "flex", "items-start", "gap-3", "px-4", "py-3", "rounded-2xl", "bg-blue-50/80", "dark:bg-blue-950/30", "border", "border-blue-100", "dark:border-blue-900/50", "text-blue-700", "dark:text-blue-300"], [1, "fa-solid", "fa-circle-info", "mt-0.5", "shrink-0"], [1, "text-xs", "font-medium", "leading-relaxed"], ["type", "submit", 1, "w-full", "py-3.5", "rounded-2xl", "bg-fuchsia-600", "hover:bg-fuchsia-700", "disabled:opacity-50", "disabled:hover:bg-fuchsia-600", "text-white", "font-bold", "text-sm", "shadow-soft-md", "hover:shadow-lg", "transition-all", "active:scale-[0.98]", "flex", "items-center", "justify-center", "gap-2", 3, "disabled"], ["type", "button", 1, "w-full", "mt-4", "py-2.5", "rounded-xl", "text-slate-500", "dark:text-slate-400", "hover:bg-slate-100", "dark:hover:bg-slate-800", "text-xs", "font-bold", "transition-colors", 3, "disabled"], ["for", "current-password", 1, "block", "text-[11px]", "font-bold", "text-slate-500", "uppercase", "tracking-wider", "mb-1.5", "ml-1"], ["id", "current-password", "name", "currentPassword", "autocomplete", "current-password", "placeholder", "Nh\u1EADp m\u1EADt kh\u1EA9u c\u0169 \u0111\u1EC3 x\u00E1c th\u1EF1c", 1, "w-full", "pl-4", "pr-11", "py-3.5", "bg-slate-50", "dark:bg-slate-800/50", "border", "border-slate-200", "dark:border-slate-700/60", "rounded-2xl", "text-sm", "font-semibold", "text-slate-700", "dark:text-slate-200", "outline-none", "focus:bg-white", "dark:focus:bg-slate-800", "focus:border-fuchsia-400", "dark:focus:border-fuchsia-500", "focus:ring-4", "focus:ring-fuchsia-400/10", "transition-all", "shadow-sm", 3, "ngModelChange", "type", "ngModel", "disabled"], [1, "fa-solid", "fa-circle-exclamation", "mt-0.5"], [1, "fa-solid", "fa-circle-notch", "fa-spin"], [1, "fa-solid", "fa-check"], ["type", "button", 1, "w-full", "mt-4", "py-2.5", "rounded-xl", "text-slate-500", "dark:text-slate-400", "hover:bg-slate-100", "dark:hover:bg-slate-800", "text-xs", "font-bold", "transition-colors", 3, "click", "disabled"]], template: function PasswordSetupComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, PasswordSetupComponent_Conditional_0_Template, 91, 41, "div", 0);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.auth.isPasswordSetupOpen() ? 0 : -1);
        } }, dependencies: [CommonModule, i1.NgClass, FormsModule, i2.ɵNgNoValidate, i2.DefaultValueAccessor, i2.NgControlStatus, i2.NgControlStatusGroup, i2.NgModel, i2.NgForm], styles: ["@keyframes _ngcontent-%COMP%_fadeInUp { from { opacity: 0; transform: translateY(10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }\n    .animate-fade-in-up[_ngcontent-%COMP%] { animation: _ngcontent-%COMP%_fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }\n\n    @keyframes _ngcontent-%COMP%_shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }\n    .animate-shake[_ngcontent-%COMP%] { animation: _ngcontent-%COMP%_shake 0.3s ease-in-out; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PasswordSetupComponent, [{
        type: Component,
        args: [{ selector: 'app-password-setup', standalone: true, imports: [CommonModule, FormsModule], template: `
    @if (auth.isPasswordSetupOpen()) {
      <div class="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 animate-fade-in-up" role="dialog" aria-modal="true" aria-labelledby="password-setup-title">
        <div class="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 md:p-8 relative overflow-hidden">

          <!-- Decorative Top Glow -->
          <div class="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-fuchsia-500/10 to-transparent pointer-events-none"></div>

          <div class="flex items-start gap-4 mb-6 relative z-10">
            <div class="w-12 h-12 rounded-2xl bg-fuchsia-100 dark:bg-fuchsia-950/50 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center shrink-0 shadow-inner">
              <i class="fa-solid fa-shield-halved text-xl"></i>
            </div>
            <div>
              <h2 id="password-setup-title" class="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                @if (!auth.hasPasswordProvider()) { Cài đặt mật khẩu LIMS } @else { Đổi mật khẩu LIMS }
              </h2>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-medium">
                @if (!auth.hasPasswordProvider()) {
                  Tài khoản <strong>{{auth.currentUser()?.email}}</strong> đã sẵn sàng. Hãy tạo mật khẩu dự phòng.
                } @else {
                  Cập nhật mật khẩu cho <strong>{{auth.currentUser()?.email}}</strong>.
                }
              </p>
            </div>
          </div>

          <!-- Password Purpose -->
          <div class="mb-5 rounded-2xl border border-fuchsia-200 dark:border-fuchsia-900/60 bg-fuchsia-50/80 dark:bg-fuchsia-950/25 p-4 relative z-10">
            <div class="flex items-start gap-3">
              <i class="fa-solid fa-key text-fuchsia-600 dark:text-fuchsia-400 mt-0.5 shrink-0"></i>
              <div class="space-y-1.5">
                <p class="text-sm font-black text-fuchsia-900 dark:text-fuchsia-200">Mật khẩu này dùng để làm gì?</p>
                <p class="text-xs font-medium leading-relaxed text-fuchsia-800/90 dark:text-fuchsia-200/85">
                  Đây là mật khẩu đăng nhập riêng của LIMS. Bạn có thể dùng <strong>Gmail + mật khẩu LIMS</strong> để đăng nhập thay cho nút Google.
                  Mật khẩu này <strong>không phải mật khẩu Gmail</strong> và không làm thay đổi tài khoản Google của bạn.
                </p>
                <p class="text-[11px] font-bold leading-relaxed text-fuchsia-700 dark:text-fuchsia-300">
                  Bắt buộc: ít nhất 8 ký tự và hai ô mật khẩu phải trùng nhau. Độ mạnh chỉ là gợi ý.
                </p>
              </div>
            </div>
          </div>

          <form (ngSubmit)="save()" class="space-y-4 relative z-10">

            <!-- Current Password (Only when changing password) -->
            @if (auth.requiresCurrentPassword()) {
              <div class="group">
                <label for="current-password" class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Mật khẩu hiện tại</label>
                <div class="relative">
                  <input id="current-password" name="currentPassword" [type]="showCurrentPassword() ? 'text' : 'password'" [(ngModel)]="currentPassword" autocomplete="current-password"
                         class="w-full pl-4 pr-11 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-fuchsia-400 dark:focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-400/10 transition-all shadow-sm"
                         placeholder="Nhập mật khẩu cũ để xác thực" [disabled]="isSaving()" />
                  <button type="button" (click)="toggleCurrentPassword()" tabindex="-1" class="absolute inset-y-0 right-0 px-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    <i class="fa-solid" [class.fa-eye]="!showCurrentPassword()" [class.fa-eye-slash]="showCurrentPassword()"></i>
                  </button>
                </div>
              </div>
            }

            <div class="group">
              <label for="new-login-password" class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Mật khẩu mới</label>
              <div class="relative">
                <input id="new-login-password" name="newLoginPassword" [type]="showNewPassword() ? 'text' : 'password'" [(ngModel)]="password" (ngModelChange)="onPasswordInput()" autocomplete="new-password"
                       class="w-full pl-4 pr-11 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-fuchsia-400 dark:focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-400/10 transition-all shadow-sm"
                       placeholder="Ít nhất 8 ký tự" [disabled]="isSaving()" />
                <button type="button" (click)="toggleNewPassword()" tabindex="-1" class="absolute inset-y-0 right-0 px-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                  <i class="fa-solid" [class.fa-eye]="!showNewPassword()" [class.fa-eye-slash]="showNewPassword()"></i>
                </button>
              </div>

              <!-- Optional Strength Meter -->
              <div class="mt-3" aria-live="polite">
                <div class="flex items-center justify-between mb-1.5 px-1">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Gợi ý độ mạnh <span class="normal-case tracking-normal font-semibold">(không bắt buộc)</span></span>
                  <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400">{{strengthLabel()}}</span>
                </div>
                <div class="flex gap-1 h-1.5 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800" aria-hidden="true">
                  <div class="h-full transition-all duration-300" [ngClass]="strengthColors()[0]"></div>
                  <div class="h-full transition-all duration-300" [ngClass]="strengthColors()[1]"></div>
                  <div class="h-full transition-all duration-300" [ngClass]="strengthColors()[2]"></div>
                  <div class="h-full transition-all duration-300" [ngClass]="strengthColors()[3]"></div>
                </div>
              </div>
            </div>

            <div class="group">
              <label for="confirm-login-password" class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Nhập lại mật khẩu mới</label>
              <div class="relative">
                <input id="confirm-login-password" name="confirmLoginPassword" [type]="showConfirmPassword() ? 'text' : 'password'" [(ngModel)]="confirmation" autocomplete="new-password"
                       class="w-full pl-4 pr-11 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-fuchsia-400 dark:focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-400/10 transition-all shadow-sm"
                       placeholder="Nhập lại chính xác" [disabled]="isSaving()" />
                <button type="button" (click)="toggleConfirmPassword()" tabindex="-1" class="absolute inset-y-0 right-0 px-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                  <i class="fa-solid" [class.fa-eye]="!showConfirmPassword()" [class.fa-eye-slash]="showConfirmPassword()"></i>
                </button>
              </div>
            </div>

            <!-- Real-time Checklist -->
            <div class="bg-slate-50/50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-slate-800/50">
              <ul class="text-[12px] space-y-2 font-medium">
                <li class="flex items-center gap-2 transition-colors" [ngClass]="checkLength() ? 'text-emerald-500' : 'text-slate-400'">
                  <i class="fa-solid" [class.fa-circle-check]="checkLength()" [class.fa-circle]="!checkLength()"></i>
                  <span><strong>Bắt buộc:</strong> ít nhất 8 ký tự</span>
                </li>
                <li class="flex items-center gap-2 transition-colors" [ngClass]="checkNoSpaces() ? 'text-blue-500' : 'text-slate-400'">
                  <i class="fa-solid" [class.fa-lightbulb]="checkNoSpaces()" [class.fa-circle]="!checkNoSpaces()"></i>
                  <span><strong>Gợi ý:</strong> không chứa khoảng trắng</span>
                </li>
                <li class="flex items-center gap-2 transition-colors" [ngClass]="checkMatch() ? 'text-emerald-500' : 'text-slate-400'">
                  <i class="fa-solid" [class.fa-circle-check]="checkMatch()" [class.fa-circle]="!checkMatch()"></i>
                  <span><strong>Bắt buộc:</strong> xác nhận trùng khớp</span>
                </li>
              </ul>
            </div>

            @if (errorMsg()) {
              <div class="px-4 py-3 rounded-2xl bg-red-50/80 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-[13px] font-medium flex items-start gap-2 animate-shake">
                <i class="fa-solid fa-circle-exclamation mt-0.5"></i>
                <span>{{errorMsg()}}</span>
              </div>
            }

            <!-- Reassurance Banner -->
            <div class="flex items-start gap-3 px-4 py-3 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-blue-700 dark:text-blue-300">
              <i class="fa-solid fa-circle-info mt-0.5 shrink-0"></i>
              <span class="text-xs font-medium leading-relaxed">Mật khẩu này được tạo riêng để dự phòng cho hệ thống LIMS và hoàn toàn <strong>không ảnh hưởng</strong> đến mật khẩu Google hiện tại của bạn.</span>
            </div>

            <button type="submit" [disabled]="isSaving() || !isFormValid()"
                    class="w-full py-3.5 rounded-2xl bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-50 disabled:hover:bg-fuchsia-600 text-white font-bold text-sm shadow-soft-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              @if (isSaving()) {
                <i class="fa-solid fa-circle-notch fa-spin"></i> Đang lưu...
              } @else {
                <i class="fa-solid fa-check"></i> Lưu mật khẩu và tiếp tục
              }
            </button>
          </form>

          @if (auth.needsPasswordSetup()) {
            <button type="button" (click)="logout()" [disabled]="isSaving()"
                    class="w-full mt-4 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors">
              Đăng xuất và thực hiện sau
            </button>
          } @else {
            <button type="button" (click)="close()" [disabled]="isSaving()"
                    class="w-full mt-4 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors">
              Hủy thao tác
            </button>
          }
        </div>
      </div>
    }
  `, styles: ["\n    @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }\n    .animate-fade-in-up { animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }\n\n    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }\n    .animate-shake { animation: shake 0.3s ease-in-out; }\n  "] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PasswordSetupComponent, { className: "PasswordSetupComponent", filePath: "src/app/features/auth/password-setup.component.ts", lineNumber: 172 }); })();
//# sourceMappingURL=password-setup.component.js.map