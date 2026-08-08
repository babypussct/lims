import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StateService } from '../services/state.service';
import * as i0 from "@angular/core";
const AppShellComponent_Conditional_1_Defer_2_DepsFn = () => [import("./navigation-panel.component").then(m => m.NavigationPanelComponent)];
const AppShellComponent_Conditional_2_Defer_1_DepsFn = () => [import("./app-header.component").then(m => m.AppHeaderComponent)];
const AppShellComponent_Conditional_9_Defer_1_DepsFn = () => [import("./bottom-nav.component").then(m => m.BottomNavComponent)];
function AppShellComponent_Conditional_1_Defer_1_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-navigation-panel");
} }
function AppShellComponent_Conditional_1_Defer_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, AppShellComponent_Conditional_1_Defer_1_Conditional_0_Template, 1, 0, "app-navigation-panel");
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵconditional(!ctx_r0.state.sidebarCollapsed() ? 0 : -1);
} }
function AppShellComponent_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 1);
    i0.ɵɵtemplate(1, AppShellComponent_Conditional_1_Defer_1_Template, 1, 1);
    i0.ɵɵdefer(2, 1, AppShellComponent_Conditional_1_Defer_2_DepsFn);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵdeferWhen(!!ctx_r0.state.currentUser());
} }
function AppShellComponent_Conditional_2_Defer_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-header");
} }
function AppShellComponent_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, AppShellComponent_Conditional_2_Defer_0_Template, 1, 0);
    i0.ɵɵdefer(1, 0, AppShellComponent_Conditional_2_Defer_1_DepsFn);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵdeferWhen(!!ctx_r0.state.currentUser());
} }
function AppShellComponent_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 4)(1, "div", 7);
    i0.ɵɵelement(2, "i", 8);
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4, "B\u1EA1n kh\u00F4ng c\u00F3 quy\u1EC1n truy c\u1EADp n\u1ED9i dung n\u00E0y.");
    i0.ɵɵelementEnd()()();
} }
function AppShellComponent_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 5)(1, "div", 9);
    i0.ɵɵelement(2, "i", 10);
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "button", 11);
    i0.ɵɵlistener("click", function AppShellComponent_Conditional_6_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.state.clearOfflineState()); });
    i0.ɵɵelement(6, "i", 12);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("M\u1EA5t k\u1EBFt n\u1ED1i d\u1EEF li\u1EC7u (", ctx_r0.state.offlineSource(), "). D\u1EEF li\u1EC7u c\u00F3 th\u1EC3 ch\u01B0a \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt.");
} }
function AppShellComponent_Conditional_9_Defer_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-bottom-nav");
} }
function AppShellComponent_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, AppShellComponent_Conditional_9_Defer_0_Template, 1, 0);
    i0.ɵɵdefer(1, 0, AppShellComponent_Conditional_9_Defer_1_DepsFn);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵdeferWhen(!!ctx_r0.state.currentUser());
} }
export class AppShellComponent {
    constructor() {
        this.state = inject(StateService);
    }
    static { this.ɵfac = function AppShellComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AppShellComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AppShellComponent, selectors: [["app-shell"]], decls: 10, vars: 19, consts: [[1, "min-h-screen", "h-[100dvh]", "bg-gray-50", "dark:bg-slate-900", "flex", "overflow-hidden", "relative"], [1, "hidden", "md:block"], [1, "flex-1", "flex", "flex-col", "relative", "h-full", "transition-all", "duration-300", "ease-in-out", "overflow-hidden"], [1, "flex-1", "min-h-0", "flex", "flex-col", "overflow-hidden"], [1, "w-full", "bg-red-50", "dark:bg-red-900/20", "border", "border-red-100", "dark:border-red-800/30", "rounded-xl", "p-3", "mb-4", "flex", "items-center", "justify-between", "animate-bounce-in", "shadow-sm", "shrink-0"], [1, "w-full", "bg-orange-50", "dark:bg-orange-900/20", "border", "border-orange-200", "dark:border-orange-800/30", "rounded-xl", "p-3", "mb-4", "flex", "items-center", "justify-between", "animate-bounce-in", "shadow-sm", "shrink-0"], [1, "app-content-scroll", "flex-1", "min-h-0", "overflow-y-auto", "custom-scrollbar"], [1, "flex", "items-center", "gap-2", "text-sm", "text-red-600", "dark:text-red-400", "font-bold"], [1, "fa-solid", "fa-triangle-exclamation"], [1, "flex", "items-center", "gap-2", "text-sm", "text-orange-700", "dark:text-orange-400", "font-bold"], [1, "fa-solid", "fa-plug-circle-xmark"], ["type", "button", "title", "\u0110\u00F3ng", "aria-label", "\u0110\u00F3ng th\u00F4ng b\u00E1o m\u1EA5t k\u1EBFt n\u1ED1i", 1, "text-orange-500", "hover:text-orange-700", "dark:hover:text-orange-300", "transition", "ml-3", "shrink-0", 3, "click"], [1, "fa-solid", "fa-xmark"]], template: function AppShellComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0);
            i0.ɵɵtemplate(1, AppShellComponent_Conditional_1_Template, 4, 1, "div", 1)(2, AppShellComponent_Conditional_2_Template, 3, 1);
            i0.ɵɵelementStart(3, "main", 2)(4, "div", 3);
            i0.ɵɵtemplate(5, AppShellComponent_Conditional_5_Template, 5, 0, "div", 4)(6, AppShellComponent_Conditional_6_Template, 7, 1, "div", 5);
            i0.ɵɵelementStart(7, "div", 6);
            i0.ɵɵelement(8, "router-outlet");
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(9, AppShellComponent_Conditional_9_Template, 3, 1);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵconditional(!ctx.state.focusMode() ? 1 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(!ctx.state.focusMode() ? 2 : -1);
            i0.ɵɵadvance();
            i0.ɵɵclassProp("md:ml-64", !ctx.state.sidebarCollapsed() && !ctx.state.focusMode())("md:pt-14", !ctx.state.focusMode())("p-0", ctx.state.focusMode());
            i0.ɵɵadvance();
            i0.ɵɵclassProp("px-3", !ctx.state.focusMode())("pt-4", !ctx.state.focusMode())("md:p-6", !ctx.state.focusMode())("p-0", ctx.state.focusMode());
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.state.permissionError() ? 5 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.state.isOffline() ? 6 : -1);
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(!ctx.state.focusMode() ? 9 : -1);
        } }, dependencies: [CommonModule,
            RouterOutlet], styles: [".app-content-scroll[_ngcontent-%COMP%] {\n      padding-bottom: calc(5rem + env(safe-area-inset-bottom, 0px));\n    }\n\n    @media (min-width: 768px) {\n      .app-content-scroll[_ngcontent-%COMP%] {\n        padding-bottom: 1.5rem;\n      }\n    }"], changeDetection: 0 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadataAsync(AppShellComponent, () => [import("./navigation-panel.component").then(m => m.NavigationPanelComponent), import("./app-header.component").then(m => m.AppHeaderComponent), import("./bottom-nav.component").then(m => m.BottomNavComponent)], (NavigationPanelComponent, AppHeaderComponent, BottomNavComponent) => { i0.ɵsetClassMetadata(AppShellComponent, [{
        type: Component,
        args: [{ selector: 'app-shell', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, imports: [
                    CommonModule,
                    RouterOutlet,
                    AppHeaderComponent,
                    NavigationPanelComponent,
                    BottomNavComponent
                ], template: `
    <div class="min-h-screen h-[100dvh] bg-gray-50 dark:bg-slate-900 flex overflow-hidden relative">

      @if (!state.focusMode()) {
        <div class="hidden md:block">
          @defer (when !!state.currentUser()) {
            @if (!state.sidebarCollapsed()) {
              <app-navigation-panel></app-navigation-panel>
            }
          }
        </div>
      }

      <!-- Desktop Top Header -->
      @if (!state.focusMode()) {
        @defer (when !!state.currentUser()) {
          <app-header></app-header>
        }
      }

      <main
        class="flex-1 flex flex-col relative h-full transition-all duration-300 ease-in-out overflow-hidden"
        [class.md:ml-64]="!state.sidebarCollapsed() && !state.focusMode()"
        [class.md:pt-14]="!state.focusMode()"
        [class.p-0]="state.focusMode()">

        <div
          class="flex-1 min-h-0 flex flex-col overflow-hidden"
          [class.px-3]="!state.focusMode()"
          [class.pt-4]="!state.focusMode()"
          [class.md:p-6]="!state.focusMode()"
          [class.p-0]="state.focusMode()">

          @if (state.permissionError()) {
            <div class="w-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-xl p-3 mb-4 flex items-center justify-between animate-bounce-in shadow-sm shrink-0">
              <div class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 font-bold">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span>Bạn không có quyền truy cập nội dung này.</span>
              </div>
            </div>
          }

          @if (state.isOffline()) {
            <div class="w-full bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/30 rounded-xl p-3 mb-4 flex items-center justify-between animate-bounce-in shadow-sm shrink-0">
              <div class="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-400 font-bold">
                <i class="fa-solid fa-plug-circle-xmark"></i>
                <span>Mất kết nối dữ liệu ({{ state.offlineSource() }}). Dữ liệu có thể chưa được cập nhật.</span>
              </div>
              <button
                type="button"
                (click)="state.clearOfflineState()"
                class="text-orange-500 hover:text-orange-700 dark:hover:text-orange-300 transition ml-3 shrink-0"
                title="Đóng"
                aria-label="Đóng thông báo mất kết nối">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          }

          <div class="app-content-scroll flex-1 min-h-0 overflow-y-auto custom-scrollbar">
            <router-outlet></router-outlet>
          </div>
        </div>
      </main>

      @if (!state.focusMode()) {
        @defer (when !!state.currentUser()) {
          <app-bottom-nav></app-bottom-nav>
        }
      }
    </div>
  `, styles: ["\n    .app-content-scroll {\n      padding-bottom: calc(5rem + env(safe-area-inset-bottom, 0px));\n    }\n\n    @media (min-width: 768px) {\n      .app-content-scroll {\n        padding-bottom: 1.5rem;\n      }\n    }\n  "] }]
    }], null, null); }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AppShellComponent, { className: "AppShellComponent", filePath: "src/app/core/layout/app-shell.component.ts", lineNumber: 104 }); })();
//# sourceMappingURL=app-shell.component.js.map