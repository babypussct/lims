import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import * as i0 from "@angular/core";
function ForbiddenComponent_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 5);
    i0.ɵɵtext(1, " Trang ");
    i0.ɵɵelementStart(2, "code", 14);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(4, " y\u00EAu c\u1EA7u: ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r0.fromUrl());
} }
function ForbiddenComponent_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 6);
    i0.ɵɵtext(1, " B\u1EA1n kh\u00F4ng c\u00F3 \u0111\u1EE7 quy\u1EC1n h\u1EA1n \u0111\u1EC3 xem n\u1ED9i dung ho\u1EB7c th\u1EF1c hi\u1EC7n thao t\u00E1c tr\u00EAn trang n\u00E0y. ");
    i0.ɵɵelementEnd();
} }
function ForbiddenComponent_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 7);
    i0.ɵɵelement(1, "i", 15);
    i0.ɵɵelementStart(2, "span", 16);
    i0.ɵɵtext(3, "Quy\u1EC1n:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "code", 17);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.requiredPermission());
} }
export class ForbiddenComponent {
    constructor() {
        this.route = inject(ActivatedRoute);
        this.router = inject(Router);
        this.requiredPermission = signal('');
        this.fromUrl = signal('');
    }
    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['required'])
                this.requiredPermission.set(params['required']);
            if (params['from'])
                this.fromUrl.set(params['from']);
        });
    }
    goBack() {
        this.router.navigate(['/dashboard']);
    }
    static { this.ɵfac = function ForbiddenComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ForbiddenComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ForbiddenComponent, selectors: [["app-forbidden"]], decls: 18, vars: 2, consts: [[1, "min-h-screen", "flex", "items-center", "justify-center", "bg-slate-50", "dark:bg-slate-900", "p-4"], [1, "max-w-md", "w-full", "bg-white", "dark:bg-slate-800", "rounded-3xl", "shadow-xl", "p-8", "text-center", "border", "border-slate-100", "dark:border-slate-700", "animate-fade-in"], [1, "w-20", "h-20", "bg-amber-50", "dark:bg-amber-900/20", "text-amber-500", "rounded-2xl", "flex", "items-center", "justify-center", "mx-auto", "mb-6", "border", "border-amber-200", "dark:border-amber-800/50", "shadow-inner"], [1, "fa-solid", "fa-lock", "text-3xl"], [1, "text-2xl", "font-black", "text-slate-800", "dark:text-slate-100", "mb-1"], [1, "text-xs", "text-slate-400", "dark:text-slate-500", "mb-3"], [1, "text-slate-500", "dark:text-slate-400", "mb-4", "text-xs"], [1, "inline-flex", "items-center", "gap-2", "bg-amber-50", "dark:bg-amber-900/20", "border", "border-amber-200", "dark:border-amber-800/50", "px-4", "py-2", "rounded-xl", "mb-6", "shadow-sm"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "mb-6", "leading-relaxed"], [1, "flex", "flex-col", "gap-2.5"], [1, "w-full", "py-3", "bg-slate-800", "dark:bg-slate-700", "hover:bg-slate-900", "dark:hover:bg-slate-600", "text-white", "font-bold", "text-xs", "rounded-xl", "transition-all", "shadow-sm", "active:scale-95", "flex", "items-center", "justify-center", "gap-2", 3, "click"], [1, "fa-solid", "fa-arrow-left"], ["routerLink", "/dashboard", 1, "w-full", "py-3", "bg-slate-100", "dark:bg-slate-800", "hover:bg-slate-200", "dark:hover:bg-slate-700", "text-slate-700", "dark:text-slate-300", "font-bold", "text-xs", "rounded-xl", "transition-all", "active:scale-95", "flex", "items-center", "justify-center", "gap-2"], [1, "fa-solid", "fa-house"], [1, "bg-slate-100", "dark:bg-slate-900", "px-2", "py-0.5", "rounded", "font-mono", "font-bold", "text-slate-600", "dark:text-slate-400"], [1, "fa-solid", "fa-key", "text-amber-500", "text-sm"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "font-medium"], [1, "font-mono", "font-extrabold", "text-xs", "text-amber-700", "dark:text-amber-400"]], template: function ForbiddenComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
            i0.ɵɵelement(3, "i", 3);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "h1", 4);
            i0.ɵɵtext(5, "Ch\u01B0a C\u00F3 Quy\u1EC1n Truy C\u1EADp");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(6, ForbiddenComponent_Conditional_6_Template, 5, 1, "p", 5)(7, ForbiddenComponent_Conditional_7_Template, 2, 0, "p", 6)(8, ForbiddenComponent_Conditional_8_Template, 6, 1, "div", 7);
            i0.ɵɵelementStart(9, "p", 8);
            i0.ɵɵtext(10, " Vui l\u00F2ng li\u00EAn h\u1EC7 Qu\u1EA3n tr\u1ECB vi\u00EAn (Admin) n\u1EBFu b\u1EA1n c\u1EA7n c\u1EA5p b\u1ED5 sung quy\u1EC1n truy c\u1EADp cho t\u00EDnh n\u0103ng n\u00E0y. ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(11, "div", 9)(12, "button", 10);
            i0.ɵɵlistener("click", function ForbiddenComponent_Template_button_click_12_listener() { return ctx.goBack(); });
            i0.ɵɵelement(13, "i", 11);
            i0.ɵɵtext(14, " Quay L\u1EA1i Trang Tr\u01B0\u1EDBc ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "a", 12);
            i0.ɵɵelement(16, "i", 13);
            i0.ɵɵtext(17, " V\u1EC1 Trang ch\u1EE7 ");
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(6);
            i0.ɵɵconditional(ctx.fromUrl() ? 6 : 7);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.requiredPermission() ? 8 : -1);
        } }, dependencies: [CommonModule, RouterLink], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ForbiddenComponent, [{
        type: Component,
        args: [{
                selector: 'app-forbidden',
                standalone: true,
                imports: [CommonModule, RouterLink],
                template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div class="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 text-center border border-slate-100 dark:border-slate-700 animate-fade-in">
        <div class="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-200 dark:border-amber-800/50 shadow-inner">
          <i class="fa-solid fa-lock text-3xl"></i>
        </div>
        <h1 class="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">Chưa Có Quyền Truy Cập</h1>

        @if (fromUrl()) {
          <p class="text-xs text-slate-400 dark:text-slate-500 mb-3">
            Trang <code class="bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded font-mono font-bold text-slate-600 dark:text-slate-400">{{fromUrl()}}</code> yêu cầu:
          </p>
        } @else {
          <p class="text-slate-500 dark:text-slate-400 mb-4 text-xs">
            Bạn không có đủ quyền hạn để xem nội dung hoặc thực hiện thao tác trên trang này.
          </p>
        }

        @if (requiredPermission()) {
          <div class="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 px-4 py-2 rounded-xl mb-6 shadow-sm">
            <i class="fa-solid fa-key text-amber-500 text-sm"></i>
            <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Quyền:</span>
            <code class="font-mono font-extrabold text-xs text-amber-700 dark:text-amber-400">{{requiredPermission()}}</code>
          </div>
        }

        <p class="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          Vui lòng liên hệ Quản trị viên (Admin) nếu bạn cần cấp bổ sung quyền truy cập cho tính năng này.
        </p>

        <div class="flex flex-col gap-2.5">
          <button (click)="goBack()" class="w-full py-3 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2">
            <i class="fa-solid fa-arrow-left"></i> Quay Lại Trang Trước
          </button>
          <a routerLink="/dashboard" class="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2">
            <i class="fa-solid fa-house"></i> Về Trang chủ
          </a>
        </div>
      </div>
    </div>
  `
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ForbiddenComponent, { className: "ForbiddenComponent", filePath: "src/app/features/auth/forbidden.component.ts", lineNumber: 51 }); })();
//# sourceMappingURL=forbidden.component.js.map