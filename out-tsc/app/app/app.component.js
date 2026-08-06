import { ChangeDetectionStrategy, Component, inject, computed, effect, signal, HostListener, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { AppShellComponent } from './core/layout/app-shell.component';
import { LogoComponent } from './shared/components/logo.component';
import { PasswordSetupComponent } from './features/auth/password-setup.component';
import { ToastHostComponent } from './shared/components/toast-host/toast-host.component';
import { ForgotPasswordModalComponent } from './features/auth/forgot-password-modal.component';
import { StateService } from './core/services/state.service';
import { AuthService } from './core/services/auth.service';
import { ToastService } from './core/services/toast.service';
import { PrintService } from './core/services/print.service';
import { IdleTimeoutService } from './core/services/idle-timeout.service';
import { NotificationService } from './core/services/notification.service';
import { NotificationCenterService } from './core/services/notification-center.service';
import { ConfirmationService } from './core/services/confirmation.service';
import { NotificationPanelService } from './core/services/notification-panel.service';
import { ProgressService } from './core/services/progress.service';
import { QrGlobalService } from './core/services/qr-global.service';
import { ChangelogService } from './core/services/changelog.service';
import { ReleaseService } from './core/services/release.service';
import { SwUpdate } from '@angular/service-worker';
import { filter } from 'rxjs/operators';
import * as i0 from "@angular/core";
const AppComponent_Conditional_1_Defer_8_DepsFn = () => [import("./shared/components/changelog-modal/changelog-modal.component").then(m => m.ChangelogModalComponent)];
const AppComponent_Conditional_1_Defer_12_DepsFn = () => [import("./shared/components/confirmation-modal/confirmation-modal.component").then(m => m.ConfirmationModalComponent)];
const AppComponent_Conditional_1_Defer_15_DepsFn = () => [import("./shared/components/print-preview-modal/print-preview-modal.component").then(m => m.PrintPreviewModalComponent)];
const AppComponent_Conditional_1_Defer_18_DepsFn = () => [import("./shared/components/global-scanner/global-scanner.component").then(m => m.GlobalScannerComponent)];
const AppComponent_Conditional_1_Defer_21_DepsFn = () => [import("./shared/components/gs1-info-modal/gs1-info-modal.component").then(m => m.Gs1InfoModalComponent)];
const AppComponent_Conditional_1_Defer_24_DepsFn = () => [import("./shared/components/notification-panel/notification-panel.component").then(m => m.NotificationPanelComponent)];
const AppComponent_Conditional_1_Defer_27_DepsFn = () => [import("./shared/components/progress-overlay/progress-overlay.component").then(m => m.ProgressOverlayComponent)];
const AppComponent_Conditional_1_Conditional_35_Conditional_1_Conditional_1_Defer_2_DepsFn = () => [import("./features/auth/login.component").then(m => m.LoginComponent)];
function AppComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "router-outlet");
} }
function AppComponent_Conditional_1_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 0);
    i0.ɵɵelement(1, "span");
    i0.ɵɵelementEnd();
} }
function AppComponent_Conditional_1_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 1)(1, "div", 10)(2, "div", 11)(3, "span", 12);
    i0.ɵɵelement(4, "i", 13);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 14);
    i0.ɵɵelement(6, "span")(7, "span");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "span", 15);
    i0.ɵɵelement(9, "i")(10, "i")(11, "i");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "div", 16);
    i0.ɵɵelement(13, "span")(14, "span")(15, "span");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "div", 17);
    i0.ɵɵelement(17, "span")(18, "span")(19, "span");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "span", 18);
    i0.ɵɵtext(21, "\u0110ang m\u1EDF n\u1ED9i dung, vui l\u00F2ng ch\u1EDD.");
    i0.ɵɵelementEnd()()();
} }
function AppComponent_Conditional_1_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 2);
    i0.ɵɵelement(1, "i", 19);
    i0.ɵɵelementEnd();
} }
function AppComponent_Conditional_1_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 3)(1, "div", 20);
    i0.ɵɵelement(2, "i", 21);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 22)(4, "div", 23);
    i0.ɵɵtext(5, "Th\u00F4ng b\u00E1o b\u1EA3o tr\u00EC");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 24);
    i0.ɵɵtext(7, "H\u1EC7 th\u1ED1ng s\u1EBD t\u1EF1 \u0111\u1ED9ng kh\u00F3a \u0111\u1EC3 b\u1EA3o tr\u00EC sau ");
    i0.ɵɵelementStart(8, "span", 25);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(10, ". Vui l\u00F2ng l\u01B0u d\u1EEF li\u1EC7u!");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(9);
    i0.ɵɵtextInterpolate(ctx_r0.maintenanceCountdownText());
} }
function AppComponent_Conditional_1_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-password-setup");
} }
function AppComponent_Conditional_1_Defer_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-changelog-modal");
} }
function AppComponent_Conditional_1_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 4);
    i0.ɵɵelement(1, "i", 26);
    i0.ɵɵelementEnd();
} }
function AppComponent_Conditional_1_Defer_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-confirmation-modal");
} }
function AppComponent_Conditional_1_Defer_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-print-preview-modal");
} }
function AppComponent_Conditional_1_Defer_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-global-scanner");
} }
function AppComponent_Conditional_1_Defer_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-gs1-info-modal");
} }
function AppComponent_Conditional_1_Defer_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-notification-panel");
} }
function AppComponent_Conditional_1_Defer_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-progress-overlay");
} }
function AppComponent_Conditional_1_Conditional_29_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 43);
    i0.ɵɵelementStart(1, "span", 44);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", ctx_r0.updateCountdown(), "s");
} }
function AppComponent_Conditional_1_Conditional_29_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 45);
    i0.ɵɵelementStart(1, "span", 46);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", ctx_r0.updateCountdown(), "s");
} }
function AppComponent_Conditional_1_Conditional_29_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵtextInterpolate1(" C\u1EADp nh\u1EADt phi\u00EAn b\u1EA3n ", ctx_r0.updateVersion(), " ");
} }
function AppComponent_Conditional_1_Conditional_29_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " C\u00F3 b\u1EA3n c\u1EADp nh\u1EADt h\u1EC7 th\u1ED1ng m\u1EDBi ");
} }
function AppComponent_Conditional_1_Conditional_29_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 34);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.updateTitle());
} }
function AppComponent_Conditional_1_Conditional_29_Conditional_13_For_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li", 49);
    i0.ɵɵelement(1, "div", 50);
    i0.ɵɵelementStart(2, "span", 51);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const feature_r3 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(feature_r3);
} }
function AppComponent_Conditional_1_Conditional_29_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 35)(1, "h3", 47);
    i0.ɵɵtext(2, "N\u1ED9i Dung N\u00E2ng C\u1EA5p");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "ul", 48);
    i0.ɵɵrepeaterCreate(4, AppComponent_Conditional_1_Conditional_29_Conditional_13_For_5_Template, 4, 1, "li", 49, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx_r0.updateFeatures());
} }
function AppComponent_Conditional_1_Conditional_29_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 36);
    i0.ɵɵtext(1, " H\u1EC7 th\u1ED1ng LIMS v\u1EEBa \u0111\u01B0\u1EE3c n\u00E2ng c\u1EA5p. Vui l\u00F2ng \u00E1p d\u1EE5ng ngay \u0111\u1EC3 \u0111\u1EA3m b\u1EA3o t\u00EDnh \u0111\u1ED3ng b\u1ED9 d\u1EEF li\u1EC7u. ");
    i0.ɵɵelementEnd();
} }
function AppComponent_Conditional_1_Conditional_29_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 41);
    i0.ɵɵelement(1, "i", 52);
    i0.ɵɵtext(2, " \u0110ang t\u1EA1m d\u1EEBng \u00B7 Di chu\u1ED9t ho\u1EB7c ch\u1EA1m \u0111\u1EC3 ti\u1EBFp t\u1EE5c \u0111\u1EBFm ");
    i0.ɵɵelementEnd();
} }
function AppComponent_Conditional_1_Conditional_29_Conditional_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 42);
    i0.ɵɵelement(1, "i", 53);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" T\u1EF1 \u0111\u1ED9ng \u00E1p d\u1EE5ng sau ", ctx_r0.updateCountdown(), " gi\u00E2y ");
} }
function AppComponent_Conditional_1_Conditional_29_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 5)(1, "div", 27)(2, "div", 28);
    i0.ɵɵnamespaceSVG();
    i0.ɵɵelementStart(3, "svg", 29);
    i0.ɵɵelement(4, "circle", 30)(5, "circle", 31);
    i0.ɵɵelementEnd();
    i0.ɵɵnamespaceHTML();
    i0.ɵɵelementStart(6, "div", 32);
    i0.ɵɵtemplate(7, AppComponent_Conditional_1_Conditional_29_Conditional_7_Template, 3, 1)(8, AppComponent_Conditional_1_Conditional_29_Conditional_8_Template, 3, 1);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "h2", 33);
    i0.ɵɵtemplate(10, AppComponent_Conditional_1_Conditional_29_Conditional_10_Template, 1, 1)(11, AppComponent_Conditional_1_Conditional_29_Conditional_11_Template, 1, 0);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(12, AppComponent_Conditional_1_Conditional_29_Conditional_12_Template, 2, 1, "p", 34)(13, AppComponent_Conditional_1_Conditional_29_Conditional_13_Template, 6, 0, "div", 35)(14, AppComponent_Conditional_1_Conditional_29_Conditional_14_Template, 2, 0, "p", 36);
    i0.ɵɵelementStart(15, "button", 37);
    i0.ɵɵlistener("click", function AppComponent_Conditional_1_Conditional_29_Template_button_click_15_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.window_reload()); });
    i0.ɵɵelement(16, "i", 38);
    i0.ɵɵtext(17, " \u00C1p D\u1EE5ng C\u1EADp Nh\u1EADt ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "button", 39);
    i0.ɵɵlistener("click", function AppComponent_Conditional_1_Conditional_29_Template_button_click_18_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.dismissUpdate()); });
    i0.ɵɵtext(19, " \u0110\u1EC3 sau ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "div", 40);
    i0.ɵɵtemplate(21, AppComponent_Conditional_1_Conditional_29_Conditional_21_Template, 3, 0, "span", 41)(22, AppComponent_Conditional_1_Conditional_29_Conditional_22_Template, 3, 1, "span", 42);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(5);
    i0.ɵɵclassMap(ctx_r0.isCountdownPaused() ? "stroke-amber-400" : "stroke-blue-600");
    i0.ɵɵstyleProp("stroke-dasharray", "296")("stroke-dashoffset", 296 - ctx_r0.updateCountdown() / 30 * 296);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.isCountdownPaused() ? 7 : 8);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r0.updateVersion() ? 10 : 11);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.updateTitle() ? 12 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.updateFeatures().length > 0 ? 13 : 14);
    i0.ɵɵadvance(8);
    i0.ɵɵconditional(ctx_r0.isCountdownPaused() ? 21 : 22);
} }
function AppComponent_Conditional_1_Conditional_30_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 6)(1, "div", 54)(2, "div", 55);
    i0.ɵɵelement(3, "i", 56);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span", 57);
    i0.ɵɵtext(5, "C\u00F3 phi\u00EAn b\u1EA3n m\u1EDBi \u0111ang ch\u1EDD \u0111\u01B0\u1EE3c c\u00E0i \u0111\u1EB7t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "button", 58);
    i0.ɵɵlistener("click", function AppComponent_Conditional_1_Conditional_30_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r4); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.window_reload()); });
    i0.ɵɵtext(7, " C\u1EADp nh\u1EADt ");
    i0.ɵɵelementEnd()()();
} }
function AppComponent_Conditional_1_Conditional_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 7)(1, "div", 59)(2, "div", 60);
    i0.ɵɵelement(3, "i", 61);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "h2", 62);
    i0.ɵɵtext(5, "H\u1EC7 Th\u1ED1ng \u0110ang B\u1EA3o Tr\u00EC");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 63);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 64);
    i0.ɵɵtext(9);
    i0.ɵɵelement(10, "br");
    i0.ɵɵelementStart(11, "span");
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r0.state.maintenanceMessage());
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" \u00A9 ", ctx_r0.year, " Angular Portal \u2022 Thi\u1EBFt k\u1EBF & Ph\u00E1t tri\u1EC3n b\u1EDFi Otada \u2022 S\u1EED d\u1EE5ng n\u1ED9i b\u1ED9");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("NAFIQPM6 Laboratory Information Management System Cloud \u2022 ", ctx_r0.state.systemVersion(), "");
} }
function AppComponent_Conditional_1_Conditional_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 8)(1, "div", 65)(2, "div", 66);
    i0.ɵɵelement(3, "i", 67);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 22)(5, "div", 68);
    i0.ɵɵtext(6, "\u0110ang B\u1EADt B\u1EA3o Tr\u00EC");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div", 69);
    i0.ɵɵtext(8, "H\u1EC7 th\u1ED1ng \u0111ang ch\u1EB7n t\u1EA5t c\u1EA3 ng\u01B0\u1EDDi d\u00F9ng. \u0110\u1EEBng qu\u00EAn t\u1EAFt khi xong!");
    i0.ɵɵelementEnd()()()();
} }
function AppComponent_Conditional_1_Conditional_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 9)(1, "div", 70);
    i0.ɵɵelement(2, "app-logo", 71);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 72);
    i0.ɵɵtext(4, "NAFIQPM6 | LIMS CLOUD");
    i0.ɵɵelementEnd()();
} }
function AppComponent_Conditional_1_Conditional_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 9);
    i0.ɵɵelement(1, "i", 73);
    i0.ɵɵelementStart(2, "div", 74);
    i0.ɵɵtext(3, "\u0110ANG X\u00C1C TH\u1EF0C T\u00C0I KHO\u1EA2N...");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 75);
    i0.ɵɵtext(5, "Vui l\u00F2ng ch\u1EDD trong gi\u00E2y l\u00E1t");
    i0.ɵɵelementEnd()();
} }
function AppComponent_Conditional_1_Conditional_35_Conditional_0_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 76)(1, "div", 77)(2, "div", 78);
    i0.ɵɵelement(3, "i", 79);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "h2", 80);
    i0.ɵɵtext(5, "\u0110ang Ch\u1EDD Ph\u00EA Duy\u1EC7t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 81);
    i0.ɵɵtext(7, "Xin ch\u00E0o ");
    i0.ɵɵelementStart(8, "b");
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(10, ",");
    i0.ɵɵelement(11, "br");
    i0.ɵɵtext(12, "T\u00E0i kho\u1EA3n c\u1EE7a b\u1EA1n \u0111\u00E3 \u0111\u01B0\u1EE3c t\u1EA1o nh\u01B0ng c\u1EA7n qu\u1EA3n tr\u1ECB vi\u00EAn c\u1EA5p quy\u1EC1n truy c\u1EADp v\u00E0o h\u1EC7 th\u1ED1ng.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "div", 82)(14, "div", 83);
    i0.ɵɵtext(15, "UID c\u1EE7a b\u1EA1n (G\u1EEDi cho Admin):");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "div", 84)(17, "code", 85);
    i0.ɵɵtext(18);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(19, "button", 86);
    i0.ɵɵlistener("click", function AppComponent_Conditional_1_Conditional_35_Conditional_0_Conditional_0_Template_button_click_19_listener() { i0.ɵɵrestoreView(_r5); const ctx_r0 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r0.auth.logout()); });
    i0.ɵɵelement(20, "i", 87);
    i0.ɵɵtext(21, " \u0110\u0103ng Xu\u1EA5t");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const user_r6 = i0.ɵɵnextContext();
    i0.ɵɵadvance(9);
    i0.ɵɵtextInterpolate(user_r6.displayName);
    i0.ɵɵadvance(9);
    i0.ɵɵtextInterpolate(user_r6.uid);
} }
function AppComponent_Conditional_1_Conditional_35_Conditional_0_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-shell");
} }
function AppComponent_Conditional_1_Conditional_35_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, AppComponent_Conditional_1_Conditional_35_Conditional_0_Conditional_0_Template, 22, 2, "div", 76)(1, AppComponent_Conditional_1_Conditional_35_Conditional_0_Conditional_1_Template, 1, 0, "app-shell");
} if (rf & 2) {
    i0.ɵɵconditional(ctx.role === "pending" ? 0 : 1);
} }
function AppComponent_Conditional_1_Conditional_35_Conditional_1_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 88);
    i0.ɵɵelement(1, "router-outlet");
    i0.ɵɵelementEnd();
} }
function AppComponent_Conditional_1_Conditional_35_Conditional_1_Conditional_1_Defer_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-login", 89);
} }
function AppComponent_Conditional_1_Conditional_35_Conditional_1_Conditional_1_DeferPlaceholder_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 90);
    i0.ɵɵelement(1, "app-logo", 91);
    i0.ɵɵelementStart(2, "div", 92);
    i0.ɵɵtext(3, "\u0110ANG T\u1EA2I \u0110\u0102NG NH\u1EACP...");
    i0.ɵɵelementEnd()();
} }
function AppComponent_Conditional_1_Conditional_35_Conditional_1_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, AppComponent_Conditional_1_Conditional_35_Conditional_1_Conditional_1_Defer_0_Template, 1, 0)(1, AppComponent_Conditional_1_Conditional_35_Conditional_1_Conditional_1_DeferPlaceholder_1_Template, 4, 0);
    i0.ɵɵdefer(2, 0, AppComponent_Conditional_1_Conditional_35_Conditional_1_Conditional_1_Defer_2_DepsFn, null, 1);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(2);
    i0.ɵɵdeferWhen(ctx_r0.auth.isAuthReady() && !ctx_r0.state.currentUser() && !ctx_r0.isPublicRoute());
} }
function AppComponent_Conditional_1_Conditional_35_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, AppComponent_Conditional_1_Conditional_35_Conditional_1_Conditional_0_Template, 2, 0, "div", 88)(1, AppComponent_Conditional_1_Conditional_35_Conditional_1_Conditional_1_Template, 4, 1);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵconditional(ctx_r0.isPublicRoute() ? 0 : 1);
} }
function AppComponent_Conditional_1_Conditional_35_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, AppComponent_Conditional_1_Conditional_35_Conditional_0_Template, 2, 1)(1, AppComponent_Conditional_1_Conditional_35_Conditional_1_Template, 2, 1);
} if (rf & 2) {
    let tmp_2_0;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵconditional((tmp_2_0 = ctx_r0.state.currentUser()) ? 0 : 1, tmp_2_0);
} }
function AppComponent_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, AppComponent_Conditional_1_Conditional_0_Template, 2, 0, "div", 0)(1, AppComponent_Conditional_1_Conditional_1_Template, 22, 0, "div", 1)(2, AppComponent_Conditional_1_Conditional_2_Template, 2, 0, "div", 2)(3, AppComponent_Conditional_1_Conditional_3_Template, 11, 1, "div", 3);
    i0.ɵɵelement(4, "app-toast-host");
    i0.ɵɵtemplate(5, AppComponent_Conditional_1_Conditional_5_Template, 1, 0, "app-password-setup");
    i0.ɵɵelement(6, "app-forgot-password-modal");
    i0.ɵɵtemplate(7, AppComponent_Conditional_1_Defer_7_Template, 1, 0);
    i0.ɵɵdefer(8, 7, AppComponent_Conditional_1_Defer_8_DepsFn);
    i0.ɵɵtemplate(10, AppComponent_Conditional_1_Conditional_10_Template, 2, 0, "div", 4)(11, AppComponent_Conditional_1_Defer_11_Template, 1, 0);
    i0.ɵɵdefer(12, 11, AppComponent_Conditional_1_Defer_12_DepsFn);
    i0.ɵɵtemplate(14, AppComponent_Conditional_1_Defer_14_Template, 1, 0);
    i0.ɵɵdefer(15, 14, AppComponent_Conditional_1_Defer_15_DepsFn);
    i0.ɵɵtemplate(17, AppComponent_Conditional_1_Defer_17_Template, 1, 0);
    i0.ɵɵdefer(18, 17, AppComponent_Conditional_1_Defer_18_DepsFn);
    i0.ɵɵtemplate(20, AppComponent_Conditional_1_Defer_20_Template, 1, 0);
    i0.ɵɵdefer(21, 20, AppComponent_Conditional_1_Defer_21_DepsFn);
    i0.ɵɵtemplate(23, AppComponent_Conditional_1_Defer_23_Template, 1, 0);
    i0.ɵɵdefer(24, 23, AppComponent_Conditional_1_Defer_24_DepsFn);
    i0.ɵɵtemplate(26, AppComponent_Conditional_1_Defer_26_Template, 1, 0);
    i0.ɵɵdefer(27, 26, AppComponent_Conditional_1_Defer_27_DepsFn);
    i0.ɵɵtemplate(29, AppComponent_Conditional_1_Conditional_29_Template, 23, 11, "div", 5)(30, AppComponent_Conditional_1_Conditional_30_Template, 8, 0, "div", 6)(31, AppComponent_Conditional_1_Conditional_31_Template, 13, 3, "div", 7)(32, AppComponent_Conditional_1_Conditional_32_Template, 9, 0, "div", 8)(33, AppComponent_Conditional_1_Conditional_33_Template, 5, 0, "div", 9)(34, AppComponent_Conditional_1_Conditional_34_Template, 6, 0, "div", 9)(35, AppComponent_Conditional_1_Conditional_35_Template, 2, 1);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵconditional(ctx_r0.isNavigating() ? 0 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.showNavigationSkeleton() ? 1 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.isPulling() ? 2 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.maintenanceCountdownText() && !ctx_r0.isMaintenanceActive() ? 3 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.auth.isPasswordSetupOpen() ? 5 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵdeferWhen(ctx_r0.changelogService.isOpen());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.printService.isProcessing() ? 10 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵdeferWhen(ctx_r0.confirmationService.state().isVisible);
    i0.ɵɵadvance(3);
    i0.ɵɵdeferWhen(ctx_r0.printService.isPreviewOpen() || ctx_r0.printService.isPreviewPdfOpen());
    i0.ɵɵadvance(3);
    i0.ɵɵdeferWhen(ctx_r0.qrService.isScanning());
    i0.ɵɵadvance(3);
    i0.ɵɵdeferWhen(!!ctx_r0.qrService.scannedGs1Data());
    i0.ɵɵadvance(3);
    i0.ɵɵdeferWhen(ctx_r0.notificationPanel.isOpen());
    i0.ɵɵadvance(3);
    i0.ɵɵdeferWhen(ctx_r0.progressService.isVisible());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.hasNewVersion() && !ctx_r0.isUpdateModalDismissed() ? 29 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.hasNewVersion() && ctx_r0.isUpdateModalDismissed() ? 30 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.isMaintenanceActive() && ctx_r0.auth.currentUser() && !ctx_r0.state.isAdmin() && !ctx_r0.auth.hasPermission("bypass_maintenance") ? 31 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.isMaintenanceActive() && ctx_r0.state.isAdmin() ? 32 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(!ctx_r0.auth.isAuthReady() ? 33 : ctx_r0.auth.isProcessingRedirect() ? 34 : 35);
} }
export class AppComponent {
    constructor() {
        this.auth = inject(AuthService);
        this.state = inject(StateService);
        this.toast = inject(ToastService);
        this.printService = inject(PrintService);
        this.router = inject(Router);
        this.idleService = inject(IdleTimeoutService);
        this.notificationService = inject(NotificationService);
        this.notificationCenter = inject(NotificationCenterService);
        this.confirmationService = inject(ConfirmationService);
        this.notificationPanel = inject(NotificationPanelService);
        this.progressService = inject(ProgressService);
        this.qrService = inject(QrGlobalService);
        this.changelogService = inject(ChangelogService);
        this.releaseService = inject(ReleaseService);
        this.swUpdate = inject(SwUpdate);
        this.ngZone = inject(NgZone);
        // Reactive URL signal for computed dependencies
        this.currentUrl = signal('');
        this.isNavigating = signal(false);
        this.showNavigationSkeleton = signal(false);
        this.isPublicRoute = computed(() => {
            const url = this.currentUrl();
            return url.startsWith('/privacy-policy') || url.startsWith('/terms-of-service') || url.startsWith('/changelog');
        });
        this.year = new Date().getFullYear();
        this._navigationFeedbackTimer = null;
        this.releaseBootstrapVersion = null;
        this.isPrintMode = computed(() => {
            const url = this.currentUrl();
            return url.includes('/mobile-login') || url.includes('/labels') || url.includes('/traceability');
        });
        this.pageTitle = computed(() => {
            const url = this.currentUrl().split('/')[1]?.split('?')[0] || 'dashboard';
            const titles = {
                'dashboard': 'Trang Chủ',
                'inventory': 'Kho Hóa Chất',
                'calculator': 'Vận Hành SOP',
                'requests': 'Quản Lý Yêu Cầu',
                'stats': 'Báo Cáo',
                'config': 'Cấu Hình',
                'standards': 'Chất Chuẩn Đối Chiếu',
                'recipes': 'Thư Viện Công Thức',
                'prep': 'Trạm Pha Chế',
                'smart-batch': 'Lập Mẻ Phân Tích',
                'traceability': 'Truy xuất nguồn gốc'
            };
            return titles[url] || 'LIMS Cloud';
        });
        // --- PULL TO REFRESH & UPDATE LOGIC ---
        this.touchStartY = 0;
        this.isPulling = signal(false);
        this.hasNewVersion = signal(false);
        this.isUpdateModalDismissed = signal(false);
        this.isCountdownPaused = signal(false);
        this.updateCountdown = signal(30);
        this.updateVersion = signal(null);
        this.updateTitle = signal(null);
        this.updateFeatures = signal([]);
        this._boundInteractionHandler = null;
        this.currentTime = signal(Date.now());
        this.isMaintenanceActive = computed(() => {
            const isManual = this.state.maintenanceMode();
            const scheduled = this.state.maintenanceScheduledTime();
            if (isManual)
                return true;
            if (scheduled) {
                const target = new Date(scheduled).getTime();
                return this.currentTime() >= target;
            }
            return false;
        });
        this.maintenanceCountdownText = computed(() => {
            const scheduled = this.state.maintenanceScheduledTime();
            if (!scheduled)
                return null;
            const target = new Date(scheduled).getTime();
            const diff = target - this.currentTime();
            if (diff <= 0)
                return null;
            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            // Show warning banner if remaining time is under 30 minutes
            if (minutes < 30) {
                const secStr = seconds < 10 ? '0' + seconds : seconds;
                const minStr = minutes < 10 ? '0' + minutes : minutes;
                return `${minStr}:${secStr}`;
            }
            return null;
        });
        this.applyPerformanceProfile();
        // Only run the maintenance clock when a schedule exists. Far from the
        // deadline it wakes once a minute; inside the 30-minute warning window it
        // updates once a second. Timers stay outside Angular to avoid full app-wide
        // change detection on every tick.
        effect((onCleanup) => {
            this.startMaintenanceClock(this.state.maintenanceScheduledTime());
            onCleanup(() => clearTimeout(this._maintenanceTimer));
        });
        // Initialize currentUrl
        this.currentUrl.set(this.router.url);
        // Keep feedback immediate, but delay the larger skeleton so fast routes do
        // not flash. The current screen stays visible underneath while a lazy chunk
        // is fetched.
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.startNavigationFeedback();
            }
            else if (event instanceof NavigationEnd) {
                this.currentUrl.set(this.router.url);
                this.finishNavigationFeedback();
            }
            else if (event instanceof NavigationCancel || event instanceof NavigationError) {
                this.finishNavigationFeedback();
            }
        });
        // Start idle timeout watcher and notifications when auth state is ready and logged in
        effect(() => {
            if (this.auth.isAuthReady() && this.auth.currentUserUid()) {
                this.idleService.startWatching();
                this.notificationService.startListener();
            }
            else {
                this.idleService.stopWatching();
                this.notificationService.stopListener();
            }
        });
        // Changelog history is published lazily by a Manager after the first login
        // of a new build. The release content is embedded in ngsw.json at build time.
        effect(() => {
            const user = this.auth.currentUser();
            const version = this.state.systemVersion();
            if (this.auth.isAuthReady() && user?.role === 'manager' && this.releaseBootstrapVersion !== version) {
                this.releaseBootstrapVersion = version;
                void this.ensureCurrentRelease(version);
            }
        });
        // Lắng nghe trạng thái bảo trì để thông báo khi kết thúc
        let previousMaintenanceState = false;
        effect(() => {
            const active = this.isMaintenanceActive();
            if (previousMaintenanceState && !active && this.auth.currentUser()) {
                this.toast.show('🎉 Hệ thống đã hoàn tất bảo trì! Bạn có thể tiếp tục làm việc.', 'success');
            }
            previousMaintenanceState = active;
        });
        // --- SERVICE WORKER: Lắng nghe bản build mới ---
        if (this.swUpdate.isEnabled) {
            console.log('[LIMS SW] ✅ Service Worker đang hoạt động. Bắt đầu lắng nghe update...');
            // Lắng nghe TẤT CẢ sự kiện version (để log)
            this.swUpdate.versionUpdates.subscribe(event => {
                console.log(`[LIMS SW] 📡 Event: ${event.type}`, event);
            });
            // Lắng nghe khi có bản mới sẵn sàng
            this.swUpdate.versionUpdates.pipe(filter((e) => e.type === 'VERSION_READY')).subscribe(event => {
                console.log('[LIMS SW] 🚀 VERSION_READY — Bản mới sẵn sàng!', {
                    current: event.currentVersion.hash,
                    latest: event.latestVersion.hash
                });
                // Xử lý dữ liệu Changelog từ ngsw-config.json (nếu có)
                const appData = event.latestVersion.appData;
                if (appData) {
                    if (appData.version)
                        this.updateVersion.set(appData.version);
                    if (appData.title)
                        this.updateTitle.set(appData.title);
                    if (appData.features && Array.isArray(appData.features)) {
                        this.updateFeatures.set(appData.features);
                    }
                }
                this.hasNewVersion.set(true);
                this.startUpdateCountdown();
                // Toast can be removed since we have a blocking modal now
                this.toast.removeByMessage('phiên bản mới');
            });
            // Giữ index.html trong hash verification để một phiên bản luôn gồm đúng HTML và chunks.
            // Lỗi cài đặt thường là trạng thái deploy/CDN tạm thời; lần polling kế tiếp sẽ thử lại.
            // Không auto-reload ở đây vì phiên bản hiện tại vẫn hợp lệ và reload có thể tạo vòng lặp.
            this.swUpdate.versionUpdates.pipe(filter(e => e.type === 'VERSION_INSTALLATION_FAILED')).subscribe((event) => {
                console.error('[LIMS SW] ❌ VERSION_INSTALLATION_FAILED:', event.error);
                this.toast.show('⚠️ Bản cập nhật chưa cài được. Hệ thống sẽ tự động thử lại.', 'info');
            });
            // Xử lý trạng thái không thể phục hồi (cache corrupt, hash mismatch nghiêm trọng)
            this.swUpdate.unrecoverable.subscribe(event => {
                console.error('[LIMS SW] 💀 UNRECOVERABLE STATE:', event.reason);
                this.toast.show('⚠️ Ứng dụng gặp lỗi nghiêm trọng. Đang tải lại...', 'error');
                setTimeout(() => window.location.reload(), 2000);
            });
            // Chủ động kiểm tra update ngay khi app load (không đợi SW tự check)
            this.swUpdate.checkForUpdate().then(hasUpdate => {
                console.log(`[LIMS SW] 🔍 Kiểm tra lần đầu: ${hasUpdate ? 'CÓ bản mới!' : 'Đang dùng bản mới nhất.'}`);
            }).catch(err => {
                console.warn('[LIMS SW] ⚠️ Lỗi kiểm tra update lần đầu:', err);
            });
            // Kiểm tra mỗi 5 phút cho user giữ app mở lâu (giảm từ 10 phút)
            this._swCheckInterval = setInterval(() => {
                this.swUpdate.checkForUpdate().then(hasUpdate => {
                    if (hasUpdate)
                        console.log('[LIMS SW] 🔍 Polling: Phát hiện bản mới!');
                }).catch(err => {
                    console.warn('[LIMS SW] ⚠️ Polling check failed:', err);
                });
            }, 5 * 60 * 1000); // 5 phút
        }
        else {
            console.warn('[LIMS SW] ⛔ Service Worker KHÔNG hoạt động (dev mode hoặc trình duyệt không hỗ trợ).');
        }
    }
    async ensureCurrentRelease(version) {
        try {
            const appData = await this.loadEmbeddedAppData();
            await this.releaseService.ensureReleaseExists(version, {
                version,
                title: appData?.title || this.updateTitle() || 'Cập nhật hệ thống',
                highlights: appData?.features || this.updateFeatures(),
                features: [],
                improvements: [],
                fixes: [],
                date: new Intl.DateTimeFormat('vi-VN').format(new Date())
            });
        }
        catch (error) {
            // A release record should never prevent a user from opening the app.
            console.warn('[Release] Không thể tự tạo release trên Firestore:', error);
        }
    }
    async loadEmbeddedAppData() {
        if (typeof fetch !== 'function')
            return null;
        try {
            const response = await fetch('/ngsw.json', { cache: 'no-store' });
            if (!response.ok)
                return null;
            const manifest = await response.json();
            return manifest?.appData || null;
        }
        catch (error) {
            console.warn('[Release] Không đọc được appData từ ngsw.json:', error);
            return null;
        }
    }
    ngOnDestroy() {
        clearInterval(this._swCheckInterval);
        clearTimeout(this._maintenanceTimer);
        if (this._navigationFeedbackTimer)
            clearTimeout(this._navigationFeedbackTimer);
        clearInterval(this._updateTimer);
        this._removeInteractionHandler();
    }
    startNavigationFeedback() {
        if (this._navigationFeedbackTimer)
            clearTimeout(this._navigationFeedbackTimer);
        this.isNavigating.set(true);
        this.showNavigationSkeleton.set(false);
        this._navigationFeedbackTimer = setTimeout(() => {
            if (this.isNavigating())
                this.showNavigationSkeleton.set(true);
        }, 160);
    }
    finishNavigationFeedback() {
        if (this._navigationFeedbackTimer) {
            clearTimeout(this._navigationFeedbackTimer);
            this._navigationFeedbackTimer = null;
        }
        this.showNavigationSkeleton.set(false);
        this.isNavigating.set(false);
    }
    // Kiểm tra build mới ngay khi user quay lại tab (từ bất kỳ ứng dụng nào khác)
    onVisibilityChange() {
        this.startMaintenanceClock(this.state.maintenanceScheduledTime());
        if (document.visibilityState === 'visible' && this.swUpdate.isEnabled) {
            console.log('[LIMS SW] 👀 Tab được focus lại — kiểm tra update...');
            this.swUpdate.checkForUpdate().then(hasUpdate => {
                if (hasUpdate)
                    console.log('[LIMS SW] 🔍 Visibility check: Phát hiện bản mới!');
            }).catch(err => {
                console.warn('[LIMS SW] ⚠️ Visibility check failed:', err);
            });
        }
    }
    startMaintenanceClock(scheduled) {
        clearTimeout(this._maintenanceTimer);
        if (!scheduled)
            return;
        const target = new Date(scheduled).getTime();
        if (!Number.isFinite(target))
            return;
        const tick = () => {
            const now = Date.now();
            if (document.visibilityState === 'visible') {
                this.ngZone.run(() => this.currentTime.set(now));
            }
            const remaining = target - now;
            if (remaining <= 0)
                return;
            const warningWindow = 30 * 60 * 1000;
            const delay = document.visibilityState !== 'visible'
                ? 60_000
                : remaining > warningWindow
                    ? Math.min(60_000, Math.max(1_000, remaining - warningWindow))
                    : 1_000;
            this.ngZone.runOutsideAngular(() => {
                this._maintenanceTimer = setTimeout(tick, delay);
            });
        };
        this.ngZone.runOutsideAngular(tick);
    }
    applyPerformanceProfile() {
        const nav = navigator;
        const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
        const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;
        const lowCpu = typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4;
        if (prefersReducedMotion || lowMemory || lowCpu || nav.connection?.saveData) {
            document.documentElement.classList.add('performance-lite');
        }
    }
    onTouchStart(e) {
        // Chỉ kích hoạt nếu chạm từ mép trên cùng của màn hình (header)
        if (e.touches[0].clientY < 60) {
            this.touchStartY = e.touches[0].clientY;
        }
        else {
            this.touchStartY = 0;
        }
    }
    onTouchMove(e) {
        if (this.touchStartY === 0)
            return;
        const currentY = e.touches[0].clientY;
        if (currentY - this.touchStartY > 120) {
            this.isPulling.set(true);
        }
    }
    onTouchEnd() {
        if (this.isPulling()) {
            window.location.reload();
        }
        this.touchStartY = 0;
        this.isPulling.set(false);
    }
    startUpdateCountdown() {
        this.updateCountdown.set(30);
        this.isCountdownPaused.set(false);
        clearInterval(this._updateTimer);
        this._removeInteractionHandler();
        this.ngZone.runOutsideAngular(() => {
            this._updateTimer = setInterval(() => {
                this.ngZone.run(() => {
                    // Nếu đang tạm dừng thì bỏ qua tick này
                    if (this.isCountdownPaused())
                        return;
                    const current = this.updateCountdown() - 1;
                    this.updateCountdown.set(current);
                    // Khi đếm xuống 10s: kiểm tra có tương tác không, nếu không thì tạm dừng
                    if (current === 10) {
                        this.isCountdownPaused.set(true);
                        this._setupInteractionHandler();
                    }
                    if (current <= 0) {
                        clearInterval(this._updateTimer);
                        this._removeInteractionHandler();
                        this.window_reload();
                    }
                });
            }, 1000);
        });
    }
    _setupInteractionHandler() {
        this._removeInteractionHandler(); // Tránh đăng ký 2 lần
        this._boundInteractionHandler = () => {
            this.ngZone.run(() => {
                if (this.isCountdownPaused()) {
                    this.isCountdownPaused.set(false);
                    this._removeInteractionHandler();
                }
            });
        };
        document.addEventListener('mousemove', this._boundInteractionHandler, { once: true });
        document.addEventListener('keydown', this._boundInteractionHandler, { once: true });
        document.addEventListener('touchstart', this._boundInteractionHandler, { once: true });
    }
    _removeInteractionHandler() {
        if (this._boundInteractionHandler) {
            document.removeEventListener('mousemove', this._boundInteractionHandler);
            document.removeEventListener('keydown', this._boundInteractionHandler);
            document.removeEventListener('touchstart', this._boundInteractionHandler);
            this._boundInteractionHandler = null;
        }
    }
    dismissUpdate() {
        clearInterval(this._updateTimer);
        this._removeInteractionHandler();
        this.isUpdateModalDismissed.set(true);
    }
    // Dùng trong template cho nút "Tải lại ngay" trong Toast
    async window_reload() {
        clearInterval(this._updateTimer);
        // Kích hoạt bản SW mới trước khi reload (đảm bảo không serve bản cũ từ cache)
        if (this.swUpdate.isEnabled && this.hasNewVersion()) {
            try {
                console.log('[LIMS SW] ⏳ Đang kích hoạt bản mới trước khi reload...');
                await this.swUpdate.activateUpdate();
                console.log('[LIMS SW] ✅ Kích hoạt thành công! Đang reload...');
            }
            catch (err) {
                console.warn('[LIMS SW] ⚠️ activateUpdate() lỗi, reload bình thường:', err);
            }
        }
        window.location.reload();
    }
    static { this.ɵfac = function AppComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AppComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AppComponent, selectors: [["app-root"]], hostBindings: function AppComponent_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("visibilitychange", function AppComponent_visibilitychange_HostBindingHandler() { return ctx.onVisibilityChange(); }, false, i0.ɵɵresolveDocument)("touchstart", function AppComponent_touchstart_HostBindingHandler($event) { return ctx.onTouchStart($event); }, false, i0.ɵɵresolveWindow)("touchmove", function AppComponent_touchmove_HostBindingHandler($event) { return ctx.onTouchMove($event); }, false, i0.ɵɵresolveWindow)("touchend", function AppComponent_touchend_HostBindingHandler() { return ctx.onTouchEnd(); }, false, i0.ɵɵresolveWindow);
        } }, decls: 2, vars: 1, consts: [["role", "progressbar", "aria-label", "\u0110ang chuy\u1EC3n trang", 1, "route-progress"], ["aria-live", "polite", "aria-busy", "true", 1, "route-loading-layer", "no-print"], [1, "fixed", "top-10", "left-1/2", "-translate-x-1/2", "z-[300]", "bg-white", "rounded-full", "shadow-lg", "w-10", "h-10", "flex", "items-center", "justify-center", "animate-bounce"], [1, "fixed", "top-4", "left-1/2", "-translate-x-1/2", "z-[105]", "bg-amber-500", "text-white", "font-bold", "py-3", "px-6", "rounded-2xl", "shadow-2xl", "flex", "items-center", "gap-3", "border", "border-amber-400", "animate-slide-down", "no-print", "max-w-md", "w-[calc(100%-2rem)]"], [1, "fixed", "inset-0", "z-[120]", "flex", "items-center", "justify-center", "bg-gray-900/20", "backdrop-blur-sm", "no-print"], [1, "fixed", "inset-0", "z-[9999]", "flex", "flex-col", "items-center", "justify-center", "bg-slate-900/80", "backdrop-blur-sm", "no-print", "p-4", "md:p-6"], [1, "fixed", "bottom-20", "md:bottom-4", "left-1/2", "-translate-x-1/2", "z-[200]", "no-print", "animate-slide-up"], [1, "fixed", "inset-0", "z-[9999]", "flex", "flex-col", "items-center", "justify-center", "bg-slate-900/90", "backdrop-blur-md", "no-print", "p-4"], [1, "fixed", "bottom-20", "right-4", "z-[9999]", "no-print", "animate-bounce-in", "pointer-events-none"], [1, "fixed", "inset-0", "z-[200]", "flex", "flex-col", "items-center", "justify-center", "bg-slate-900"], [1, "route-loading-shell"], [1, "route-loading-heading"], [1, "route-loading-icon"], [1, "fa-solid", "fa-flask-vial"], [1, "route-loading-title"], ["aria-hidden", "true", 1, "route-loading-dots"], ["aria-hidden", "true", 1, "route-loading-grid"], ["aria-hidden", "true", 1, "route-loading-lines"], [1, "sr-only"], [1, "fa-solid", "fa-rotate", "fa-spin", "text-blue-500", "text-xl"], [1, "w-8", "h-8", "rounded-full", "bg-white/20", "flex", "items-center", "justify-center", "animate-pulse"], [1, "fa-solid", "fa-hourglass-half", "text-sm"], [1, "flex-1"], [1, "text-[9px]", "uppercase", "tracking-wider", "opacity-85"], [1, "text-xs", "leading-snug"], [1, "font-mono", "text-sm", "underline", "text-white"], [1, "fa-solid", "fa-spinner", "fa-spin", "text-3xl", "text-white"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "shadow-xl", "p-6", "md:p-8", "max-w-md", "w-full", "border", "border-slate-200", "dark:border-slate-800", "animate-fade-in"], [1, "relative", "w-20", "h-20", "md:w-24", "md:h-24", "mx-auto", "mb-6", "md:mb-8"], ["viewBox", "0 0 100 100", 1, "absolute", "inset-0", "w-full", "h-full", "-rotate-90"], ["cx", "50", "cy", "50", "r", "47", "stroke-width", "2", 1, "fill-slate-50", "dark:fill-slate-800/50", "stroke-slate-200", "dark:stroke-slate-700/50"], ["cx", "50", "cy", "50", "r", "47", "stroke-width", "3", "stroke-linecap", "round", 1, "fill-none", "transition-all", "duration-1000", "ease-linear"], [1, "absolute", "inset-0", "flex", "flex-col", "items-center", "justify-center", "text-slate-700", "dark:text-slate-300", "z-10"], [1, "text-lg", "md:text-xl", "font-bold", "text-slate-800", "dark:text-white", "mb-2", "text-center", "tracking-tight", "leading-snug"], [1, "text-slate-500", "dark:text-slate-400", "text-xs", "md:text-sm", "text-center", "font-medium", "mb-5", "md:mb-6", "px-2"], [1, "bg-slate-50", "dark:bg-slate-800/50", "rounded-lg", "p-4", "md:p-5", "mb-6", "md:mb-8", "text-left", "border", "border-slate-100", "dark:border-slate-700/50"], [1, "text-slate-500", "dark:text-slate-400", "mb-6", "md:mb-8", "text-xs", "md:text-sm", "leading-relaxed", "text-center", "px-2"], [1, "w-full", "py-3.5", "bg-slate-900", "hover:bg-slate-800", "dark:bg-blue-600", "dark:hover:bg-blue-700", "text-white", "rounded-xl", "text-sm", "font-semibold", "transition-colors", "flex", "items-center", "justify-center", "gap-2", 3, "click"], [1, "fa-solid", "fa-arrows-rotate"], [1, "w-full", "mt-2.5", "py-2.5", "text-slate-400", "dark:text-slate-500", "hover:text-slate-600", "dark:hover:text-slate-300", "rounded-xl", "text-xs", "font-medium", "transition-colors", 3, "click"], [1, "mt-3", "text-center"], [1, "text-[11px]", "text-amber-500", "dark:text-amber-400", "font-medium", "flex", "items-center", "justify-center", "gap-2"], [1, "text-[11px]", "text-slate-500", "dark:text-slate-400", "font-medium", "flex", "items-center", "justify-center", "gap-2"], [1, "fa-solid", "fa-pause", "text-2xl", "md:text-3xl", "text-amber-400"], [1, "text-[9px]", "md:text-[10px]", "font-mono", "mt-1", "md:mt-2", "text-amber-400"], [1, "fa-solid", "fa-cloud-arrow-down", "text-2xl", "md:text-3xl"], [1, "text-[9px]", "md:text-[10px]", "font-mono", "mt-1", "md:mt-2", "opacity-60"], [1, "text-[9px]", "md:text-[10px]", "font-bold", "text-slate-400", "uppercase", "tracking-widest", "mb-2.5", "md:mb-3"], [1, "space-y-2.5", "md:space-y-3", "max-h-36", "md:max-h-40", "overflow-y-auto", "custom-scrollbar", "pr-1", "md:pr-2"], [1, "flex", "gap-2.5", "md:gap-3", "text-xs", "md:text-sm", "text-slate-600", "dark:text-slate-300", "items-start"], [1, "w-1.5", "h-1.5", "rounded-full", "bg-blue-500", "mt-1", "md:mt-1.5", "shrink-0", "opacity-80"], [1, "leading-relaxed"], [1, "fa-solid", "fa-hand-pointer", "opacity-70"], [1, "fa-solid", "fa-circle-notch", "fa-spin", "opacity-70"], [1, "flex", "items-center", "gap-3", "bg-slate-800", "dark:bg-slate-700", "text-white", "text-xs", "font-medium", "px-4", "py-3", "rounded-2xl", "shadow-xl", "border", "border-slate-600", "max-w-sm", "w-[calc(100vw-2rem)]"], [1, "w-7", "h-7", "shrink-0", "bg-blue-500/20", "rounded-full", "flex", "items-center", "justify-center"], [1, "fa-solid", "fa-cloud-arrow-down", "text-blue-400", "text-sm"], [1, "flex-1", "leading-snug", "text-slate-200"], [1, "shrink-0", "bg-blue-600", "hover:bg-blue-500", "text-white", "text-xs", "font-bold", "px-3", "py-1.5", "rounded-lg", "transition-colors", 3, "click"], [1, "bg-white", "dark:bg-slate-800", "rounded-3xl", "shadow-2xl", "p-8", "max-w-md", "w-full", "text-center", "border", "border-rose-500/30", "animate-bounce-in"], [1, "w-20", "h-20", "bg-rose-100", "dark:bg-rose-900/50", "rounded-full", "flex", "items-center", "justify-center", "mx-auto", "mb-6", "text-rose-500", "animate-pulse"], [1, "fa-solid", "fa-person-digging", "text-4xl"], [1, "text-2xl", "font-black", "text-slate-800", "dark:text-white", "mb-2"], [1, "text-slate-500", "dark:text-slate-400", "mb-8", "text-sm", "leading-relaxed", "whitespace-pre-wrap"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "font-medium", "leading-relaxed", "select-none"], [1, "pointer-events-auto", "bg-rose-600", "text-white", "px-4", "py-3", "rounded-2xl", "shadow-xl", "shadow-rose-500/30", "flex", "items-center", "gap-3", "border-2", "border-white", "dark:border-slate-800", "max-w-[280px]"], [1, "w-10", "h-10", "shrink-0", "bg-white/20", "rounded-full", "flex", "items-center", "justify-center", "animate-pulse"], [1, "fa-solid", "fa-person-digging", "text-lg"], [1, "text-[10px]", "font-black", "uppercase", "tracking-wider", "text-rose-200"], [1, "text-xs", "font-bold", "leading-tight", "mt-0.5"], [1, "rounded-[3.75rem]", "overflow-hidden", "shadow-lg", "shadow-indigo-500/10", "mb-4", "animate-pulse"], ["size", "180px"], [1, "text-white", "font-bold", "tracking-widest", "animate-pulse", "mt-4"], [1, "fa-brands", "fa-google", "text-5xl", "text-white", "animate-pulse", "mb-6"], [1, "text-white", "font-bold", "tracking-widest", "animate-pulse", "mb-2"], [1, "text-slate-400", "text-sm"], [1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "bg-slate-50", "p-4"], [1, "bg-white", "rounded-3xl", "shadow-soft-xl", "p-8", "max-w-md", "w-full", "text-center", "border", "border-slate-100"], [1, "w-20", "h-20", "bg-orange-100", "rounded-full", "flex", "items-center", "justify-center", "mx-auto", "mb-6", "text-orange-500", "animate-pulse"], [1, "fa-solid", "fa-hourglass-half", "text-3xl"], [1, "text-2xl", "font-black", "text-slate-800", "mb-2"], [1, "text-slate-500", "mb-6", "text-sm", "leading-relaxed"], [1, "bg-slate-50", "p-4", "rounded-xl", "border", "border-slate-200", "mb-6", "text-left"], [1, "text-[10px]", "font-bold", "text-slate-400", "uppercase", "mb-1"], [1, "flex", "gap-2", "items-center"], [1, "text-sm", "font-mono", "font-bold", "text-slate-700", "bg-white", "px-2", "py-1", "rounded", "border", "border-slate-200", "flex-1", "truncate", "select-all"], [1, "w-full", "py-3", "rounded-xl", "border", "border-slate-200", "text-slate-600", "font-bold", "text-sm", "hover:bg-slate-50", "transition", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-arrow-right-from-bracket", "mr-2"], [1, "min-h-screen", "h-[100dvh]", "bg-slate-50", "overflow-y-auto"], [1, "no-print"], [1, "fixed", "inset-0", "bg-slate-900", "flex", "flex-col", "items-center", "justify-center"], ["size", "140px"], [1, "text-slate-300", "text-xs", "font-bold", "tracking-widest", "mt-5"]], template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, AppComponent_Conditional_0_Template, 1, 0, "router-outlet")(1, AppComponent_Conditional_1_Template, 36, 18);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.isPrintMode() ? 0 : 1);
        } }, dependencies: [CommonModule,
            RouterOutlet,
            AppShellComponent,
            PasswordSetupComponent,
            ToastHostComponent,
            LogoComponent,
            ForgotPasswordModalComponent], encapsulation: 2, changeDetection: 0 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadataAsync(AppComponent, () => [import("./shared/components/changelog-modal/changelog-modal.component").then(m => m.ChangelogModalComponent), import("./shared/components/confirmation-modal/confirmation-modal.component").then(m => m.ConfirmationModalComponent), import("./shared/components/print-preview-modal/print-preview-modal.component").then(m => m.PrintPreviewModalComponent), import("./shared/components/global-scanner/global-scanner.component").then(m => m.GlobalScannerComponent), import("./shared/components/gs1-info-modal/gs1-info-modal.component").then(m => m.Gs1InfoModalComponent), import("./shared/components/notification-panel/notification-panel.component").then(m => m.NotificationPanelComponent), import("./shared/components/progress-overlay/progress-overlay.component").then(m => m.ProgressOverlayComponent), import("./features/auth/login.component").then(m => m.LoginComponent)], (ChangelogModalComponent, ConfirmationModalComponent, PrintPreviewModalComponent, GlobalScannerComponent, Gs1InfoModalComponent, NotificationPanelComponent, ProgressOverlayComponent, LoginComponent) => { i0.ɵsetClassMetadata(AppComponent, [{
        type: Component,
        args: [{
                selector: 'app-root',
                standalone: true,
                changeDetection: ChangeDetectionStrategy.OnPush,
                imports: [
                    CommonModule,
                    RouterOutlet,
                    AppShellComponent,
                    ConfirmationModalComponent,
                    PrintPreviewModalComponent,
                    GlobalScannerComponent,
                    Gs1InfoModalComponent,
                    LoginComponent,
                    PasswordSetupComponent,
                    NotificationPanelComponent,
                    ProgressOverlayComponent,
                    ToastHostComponent,
                    LogoComponent,
                    ChangelogModalComponent,
                    ForgotPasswordModalComponent
                ],
                template: `
    @if (isPrintMode()) {
       <router-outlet></router-outlet>
    } 
    @else {
      <!-- Global route feedback: instant progress, skeleton only for genuinely slow lazy chunks. -->
      @if (isNavigating()) {
        <div class="route-progress" role="progressbar" aria-label="Đang chuyển trang">
          <span></span>
        </div>
      }

      @if (showNavigationSkeleton()) {
        <div class="route-loading-layer no-print" aria-live="polite" aria-busy="true">
          <div class="route-loading-shell">
            <div class="route-loading-heading">
              <span class="route-loading-icon"><i class="fa-solid fa-flask-vial"></i></span>
              <div class="route-loading-title">
                <span></span>
                <span></span>
              </div>
              <span class="route-loading-dots" aria-hidden="true"><i></i><i></i><i></i></span>
            </div>
            <div class="route-loading-grid" aria-hidden="true">
              <span></span><span></span><span></span>
            </div>
            <div class="route-loading-lines" aria-hidden="true">
              <span></span><span></span><span></span>
            </div>
            <span class="sr-only">Đang mở nội dung, vui lòng chờ.</span>
          </div>
        </div>
      }

      <!-- Pull to Refresh Spinner -->
      @if (isPulling()) {
        <div class="fixed top-10 left-1/2 -translate-x-1/2 z-[300] bg-white rounded-full shadow-lg w-10 h-10 flex items-center justify-center animate-bounce">
            <i class="fa-solid fa-rotate fa-spin text-blue-500 text-xl"></i>
        </div>
      }

      <!-- Yellow Countdown Banner -->
      @if (maintenanceCountdownText() && !isMaintenanceActive()) {
        <div class="fixed top-4 left-1/2 -translate-x-1/2 z-[105] bg-amber-500 text-white font-bold py-3 px-6 rounded-2xl shadow-2xl flex items-center gap-3 border border-amber-400 animate-slide-down no-print max-w-md w-[calc(100%-2rem)]">
            <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse"><i class="fa-solid fa-hourglass-half text-sm"></i></div>
            <div class="flex-1">
                <div class="text-[9px] uppercase tracking-wider opacity-85">Thông báo bảo trì</div>
                <div class="text-xs leading-snug">Hệ thống sẽ tự động khóa để bảo trì sau <span class="font-mono text-sm underline text-white">{{ maintenanceCountdownText() }}</span>. Vui lòng lưu dữ liệu!</div>
            </div>
        </div>
      }

      <app-toast-host></app-toast-host>
      @if (auth.isPasswordSetupOpen()) {
        <app-password-setup></app-password-setup>
      }
      <app-forgot-password-modal></app-forgot-password-modal>
      @defer (when changelogService.isOpen()) {
        <app-changelog-modal></app-changelog-modal>
      }

      <!-- Loaders & Modals -->
      @if (printService.isProcessing()) { <div class="fixed inset-0 z-[120] flex items-center justify-center bg-gray-900/20 backdrop-blur-sm no-print"><i class="fa-solid fa-spinner fa-spin text-3xl text-white"></i></div> }
      
      @defer (when confirmationService.state().isVisible) {
        <app-confirmation-modal></app-confirmation-modal>
      }
      @defer (when printService.isPreviewOpen() || printService.isPreviewPdfOpen()) {
        <app-print-preview-modal></app-print-preview-modal>
      }
      @defer (when qrService.isScanning()) {
        <app-global-scanner></app-global-scanner>
      }
      @defer (when !!qrService.scannedGs1Data()) {
        <app-gs1-info-modal></app-gs1-info-modal>
      }
      <!-- Notification Panel: rendered at root to bypass sidebar stacking context -->
      @defer (when notificationPanel.isOpen()) {
        <app-notification-panel></app-notification-panel>
      }
      @defer (when progressService.isVisible()) {
        <app-progress-overlay></app-progress-overlay>
      }

      @if (hasNewVersion() && !isUpdateModalDismissed()) {
        <div class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm no-print p-4 md:p-6">
           <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 md:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 animate-fade-in">
              
              <div class="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 md:mb-8">
                <!-- SVG Circular Progress -->
                <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="47" class="fill-slate-50 dark:fill-slate-800/50 stroke-slate-200 dark:stroke-slate-700/50" stroke-width="2"></circle>
                  <circle cx="50" cy="50" r="47" class="fill-none transition-all duration-1000 ease-linear" stroke-width="3" stroke-linecap="round"
                          [class]="isCountdownPaused() ? 'stroke-amber-400' : 'stroke-blue-600'"
                          [style.stroke-dasharray]="'296'" 
                          [style.stroke-dashoffset]="296 - (updateCountdown() / 30) * 296"></circle>
                </svg>
                <!-- Icon inside -->
                <div class="absolute inset-0 flex flex-col items-center justify-center text-slate-700 dark:text-slate-300 z-10">
                  @if (isCountdownPaused()) {
                    <i class="fa-solid fa-pause text-2xl md:text-3xl text-amber-400"></i>
                    <span class="text-[9px] md:text-[10px] font-mono mt-1 md:mt-2 text-amber-400">{{ updateCountdown() }}s</span>
                  } @else {
                    <i class="fa-solid fa-cloud-arrow-down text-2xl md:text-3xl"></i>
                    <span class="text-[9px] md:text-[10px] font-mono mt-1 md:mt-2 opacity-60">{{ updateCountdown() }}s</span>
                  }
                </div>
              </div>

              <h2 class="text-lg md:text-xl font-bold text-slate-800 dark:text-white mb-2 text-center tracking-tight leading-snug">
                 @if (updateVersion()) { Cập nhật phiên bản {{ updateVersion() }} }
                 @else { Có bản cập nhật hệ thống mới }
              </h2>
              
              @if (updateTitle()) {
                 <p class="text-slate-500 dark:text-slate-400 text-xs md:text-sm text-center font-medium mb-5 md:mb-6 px-2">{{ updateTitle() }}</p>
              }

              @if (updateFeatures().length > 0) {
                 <div class="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 md:p-5 mb-6 md:mb-8 text-left border border-slate-100 dark:border-slate-700/50">
                    <h3 class="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 md:mb-3">Nội Dung Nâng Cấp</h3>
                    <ul class="space-y-2.5 md:space-y-3 max-h-36 md:max-h-40 overflow-y-auto custom-scrollbar pr-1 md:pr-2">
                       @for (feature of updateFeatures(); track feature) {
                          <li class="flex gap-2.5 md:gap-3 text-xs md:text-sm text-slate-600 dark:text-slate-300 items-start">
                             <div class="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 md:mt-1.5 shrink-0 opacity-80"></div>
                             <span class="leading-relaxed">{{ feature }}</span>
                          </li>
                       }
                    </ul>
                 </div>
              } @else {
                 <p class="text-slate-500 dark:text-slate-400 mb-6 md:mb-8 text-xs md:text-sm leading-relaxed text-center px-2">
                   Hệ thống LIMS vừa được nâng cấp. Vui lòng áp dụng ngay để đảm bảo tính đồng bộ dữ liệu.
                 </p>
              }
              
              <!-- Primary CTA -->
              <button (click)="window_reload()" class="w-full py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                <i class="fa-solid fa-arrows-rotate"></i> Áp Dụng Cập Nhật
              </button>

              <!-- Secondary: Dismiss -->
              <button (click)="dismissUpdate()" class="w-full mt-2.5 py-2.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-xl text-xs font-medium transition-colors">
                Để sau
              </button>

              <div class="mt-3 text-center">
                 @if (isCountdownPaused()) {
                   <span class="text-[11px] text-amber-500 dark:text-amber-400 font-medium flex items-center justify-center gap-2">
                     <i class="fa-solid fa-hand-pointer opacity-70"></i>
                     Đang tạm dừng · Di chuột hoặc chạm để tiếp tục đếm
                   </span>
                 } @else {
                   <span class="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center gap-2">
                     <i class="fa-solid fa-circle-notch fa-spin opacity-70"></i>
                     Tự động áp dụng sau {{ updateCountdown() }} giây
                   </span>
                 }
              </div>
           </div>
        </div>
      }

      <!-- Banner nhắc nhở khi user đã bấm "Để sau" -->
      @if (hasNewVersion() && isUpdateModalDismissed()) {
        <div class="fixed bottom-20 md:bottom-4 left-1/2 -translate-x-1/2 z-[200] no-print animate-slide-up">
          <div class="flex items-center gap-3 bg-slate-800 dark:bg-slate-700 text-white text-xs font-medium px-4 py-3 rounded-2xl shadow-xl border border-slate-600 max-w-sm w-[calc(100vw-2rem)]">
            <div class="w-7 h-7 shrink-0 bg-blue-500/20 rounded-full flex items-center justify-center">
              <i class="fa-solid fa-cloud-arrow-down text-blue-400 text-sm"></i>
            </div>
            <span class="flex-1 leading-snug text-slate-200">Có phiên bản mới đang chờ được cài đặt</span>
            <button (click)="window_reload()" class="shrink-0 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
              Cập nhật
            </button>
          </div>
        </div>
      }

      @if (isMaintenanceActive() && auth.currentUser() && !state.isAdmin() && !auth.hasPermission('bypass_maintenance')) {
        <div class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md no-print p-4">
           <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-rose-500/30 animate-bounce-in">
              <div class="w-20 h-20 bg-rose-100 dark:bg-rose-900/50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500 animate-pulse">
                <i class="fa-solid fa-person-digging text-4xl"></i>
              </div>
              <h2 class="text-2xl font-black text-slate-800 dark:text-white mb-2">Hệ Thống Đang Bảo Trì</h2>
              <p class="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed whitespace-pre-wrap">{{ state.maintenanceMessage() }}</p>
              
              <div class="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-relaxed select-none">
                 &copy; {{year}} Angular Portal &bull; Thiết kế & Phát triển bởi Otada &bull; Sử dụng nội bộ<br>
                 <span>NAFIQPM6 Laboratory Information Management System Cloud &bull; {{state.systemVersion()}}</span>
              </div>
           </div>
        </div>
      }

      @if (isMaintenanceActive() && state.isAdmin()) {
        <div class="fixed bottom-20 right-4 z-[9999] no-print animate-bounce-in pointer-events-none">
            <div class="pointer-events-auto bg-rose-600 text-white px-4 py-3 rounded-2xl shadow-xl shadow-rose-500/30 flex items-center gap-3 border-2 border-white dark:border-slate-800 max-w-[280px]">
                <div class="w-10 h-10 shrink-0 bg-white/20 rounded-full flex items-center justify-center animate-pulse"><i class="fa-solid fa-person-digging text-lg"></i></div>
                <div class="flex-1">
                    <div class="text-[10px] font-black uppercase tracking-wider text-rose-200">Đang Bật Bảo Trì</div>
                    <div class="text-xs font-bold leading-tight mt-0.5">Hệ thống đang chặn tất cả người dùng. Đừng quên tắt khi xong!</div>
                </div>
            </div>
        </div>
      }

      @if (!auth.isAuthReady()) {
         <div class="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-900">
            <div class="rounded-[3.75rem] overflow-hidden shadow-lg shadow-indigo-500/10 mb-4 animate-pulse">
               <app-logo size="180px"></app-logo>
            </div>
            <div class="text-white font-bold tracking-widest animate-pulse mt-4">NAFIQPM6 | LIMS CLOUD</div>
         </div>
      } @else if (auth.isProcessingRedirect()) {
        <!-- Overlay khi đang xử lý token từ Google redirect — không cho tương tác trang login -->
        <div class="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-900">
           <i class="fa-brands fa-google text-5xl text-white animate-pulse mb-6"></i>
           <div class="text-white font-bold tracking-widest animate-pulse mb-2">ĐANG XÁC THỰC TÀI KHOẢN...</div>
           <div class="text-slate-400 text-sm">Vui lòng chờ trong giây lát</div>
        </div>
      } @else {
        @if (state.currentUser(); as user) {
          @if (user.role === 'pending') {
             <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 p-4">
                <div class="bg-white rounded-3xl shadow-soft-xl p-8 max-w-md w-full text-center border border-slate-100">
                   <div class="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500 animate-pulse"><i class="fa-solid fa-hourglass-half text-3xl"></i></div>
                   <h2 class="text-2xl font-black text-slate-800 mb-2">Đang Chờ Phê Duyệt</h2>
                   <p class="text-slate-500 mb-6 text-sm leading-relaxed">Xin chào <b>{{user.displayName}}</b>,<br>Tài khoản của bạn đã được tạo nhưng cần quản trị viên cấp quyền truy cập vào hệ thống.</p>
                   <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-left">
                      <div class="text-[10px] font-bold text-slate-400 uppercase mb-1">UID của bạn (Gửi cho Admin):</div>
                      <div class="flex gap-2 items-center"><code class="text-sm font-mono font-bold text-slate-700 bg-white px-2 py-1 rounded border border-slate-200 flex-1 truncate select-all">{{user.uid}}</code></div>
                   </div>
                   <button (click)="auth.logout()" class="w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition active:scale-95"><i class="fa-solid fa-arrow-right-from-bracket mr-2"></i> Đăng Xuất</button>
                </div>
             </div>
          } 
          @else {
             <app-shell></app-shell>
          }
        } 
        @else {
          @if (isPublicRoute()) {
            <div class="min-h-screen h-[100dvh] bg-slate-50 overflow-y-auto">
              <router-outlet></router-outlet>
            </div>
          } @else {
            @defer (when auth.isAuthReady() && !state.currentUser() && !isPublicRoute()) {
              <app-login class="no-print"></app-login>
            } @placeholder {
              <div class="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center">
                <app-logo size="140px"></app-logo>
                <div class="text-slate-300 text-xs font-bold tracking-widest mt-5">ĐANG TẢI ĐĂNG NHẬP...</div>
              </div>
            }
          }
        }
      }
    }
  `
            }]
    }], () => [], { onVisibilityChange: [{
            type: HostListener,
            args: ['document:visibilitychange']
        }], onTouchStart: [{
            type: HostListener,
            args: ['window:touchstart', ['$event']]
        }], onTouchMove: [{
            type: HostListener,
            args: ['window:touchmove', ['$event']]
        }], onTouchEnd: [{
            type: HostListener,
            args: ['window:touchend']
        }] }); }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "src/app/app.component.ts", lineNumber: 325 }); })();
//# sourceMappingURL=app.component.js.map