import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
function ForgotPasswordModalComponent_Conditional_0_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 17);
    i0.ɵɵelement(1, "i", 20);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.errorMsg());
} }
function ForgotPasswordModalComponent_Conditional_0_Conditional_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 18);
    i0.ɵɵelement(1, "i", 21);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.successMsg());
} }
function ForgotPasswordModalComponent_Conditional_0_Conditional_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 22);
    i0.ɵɵtext(1, " \u0110ang g\u1EEDi... ");
} }
function ForgotPasswordModalComponent_Conditional_0_Conditional_25_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 23);
    i0.ɵɵtext(1);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" Th\u1EED l\u1EA1i sau ", ctx_r1.countdown(), "s ");
} }
function ForgotPasswordModalComponent_Conditional_0_Conditional_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 24);
    i0.ɵɵtext(1, " G\u1EEDi li\u00EAn k\u1EBFt \u0111\u1EB7t l\u1EA1i ");
} }
function ForgotPasswordModalComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 0)(1, "div", 1);
    i0.ɵɵelement(2, "div", 2);
    i0.ɵɵelementStart(3, "button", 3);
    i0.ɵɵlistener("click", function ForgotPasswordModalComponent_Conditional_0_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.close()); });
    i0.ɵɵelement(4, "i", 4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 5)(6, "div", 6);
    i0.ɵɵelement(7, "i", 7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div")(9, "h2", 8);
    i0.ɵɵtext(10, "Kh\u00F4i ph\u1EE5c m\u1EADt kh\u1EA9u");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "p", 9);
    i0.ɵɵtext(12, " Nh\u1EADp email c\u1EE7a b\u1EA1n \u0111\u1EC3 nh\u1EADn li\u00EAn k\u1EBFt \u0111\u1EB7t l\u1EA1i m\u1EADt kh\u1EA9u LIMS. ");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(13, "form", 10);
    i0.ɵɵlistener("ngSubmit", function ForgotPasswordModalComponent_Conditional_0_Template_form_ngSubmit_13_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.sendResetLink()); });
    i0.ɵɵelementStart(14, "div", 11)(15, "label", 12);
    i0.ɵɵtext(16, "Email \u0111\u0103ng nh\u1EADp");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "div", 13)(18, "div", 14);
    i0.ɵɵelement(19, "i", 15);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "input", 16);
    i0.ɵɵtwoWayListener("ngModelChange", function ForgotPasswordModalComponent_Conditional_0_Template_input_ngModelChange_20_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.email, $event) || (ctx_r1.email = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(21, ForgotPasswordModalComponent_Conditional_0_Conditional_21_Template, 4, 1, "div", 17)(22, ForgotPasswordModalComponent_Conditional_0_Conditional_22_Template, 4, 1, "div", 18);
    i0.ɵɵelementStart(23, "button", 19);
    i0.ɵɵtemplate(24, ForgotPasswordModalComponent_Conditional_0_Conditional_24_Template, 2, 0)(25, ForgotPasswordModalComponent_Conditional_0_Conditional_25_Template, 2, 1)(26, ForgotPasswordModalComponent_Conditional_0_Conditional_26_Template, 2, 0);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(20);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.email);
    i0.ɵɵproperty("disabled", ctx_r1.isLoading() || ctx_r1.countdown() > 0);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.errorMsg() ? 21 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.successMsg() ? 22 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.isLoading() || ctx_r1.countdown() > 0 || !ctx_r1.email);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isLoading() ? 24 : ctx_r1.countdown() > 0 ? 25 : 26);
} }
export class ForgotPasswordModalComponent {
    constructor() {
        this.auth = inject(AuthService);
        this.email = '';
        this.isLoading = signal(false);
        this.errorMsg = signal('');
        this.successMsg = signal('');
        this.countdown = signal(0);
        this.timer = null;
    }
    ngOnDestroy() {
        this.clearTimer();
    }
    async sendResetLink() {
        if (!this.email || this.countdown() > 0 || this.isLoading())
            return;
        this.errorMsg.set('');
        this.successMsg.set('');
        this.isLoading.set(true);
        try {
            await this.auth.sendPasswordReset(this.email);
            this.successMsg.set('Đã gửi email khôi phục. Vui lòng kiểm tra hộp thư đến (hoặc thư mục Spam).');
            this.startCooldown();
        }
        catch (error) {
            if (error.code === 'auth/invalid-email') {
                this.errorMsg.set('Địa chỉ email không hợp lệ.');
            }
            else if (error.code === 'auth/user-not-found') {
                // Do not reveal whether an email exists in Firebase Authentication.
                this.successMsg.set('Nếu email hợp lệ, liên kết khôi phục đã được gửi. Hãy kiểm tra hộp thư đến hoặc thư mục Spam.');
                this.startCooldown();
            }
            else {
                this.errorMsg.set(error.message || 'Không thể gửi email. Vui lòng thử lại sau.');
            }
        }
        finally {
            this.isLoading.set(false);
        }
    }
    close() {
        if (!this.isLoading()) {
            this.auth.closeForgotPassword();
            this.email = '';
            this.errorMsg.set('');
            this.successMsg.set('');
        }
    }
    startCooldown() {
        this.countdown.set(60);
        this.clearTimer();
        this.timer = setInterval(() => {
            if (this.countdown() > 0) {
                this.countdown.set(this.countdown() - 1);
            }
            else {
                this.clearTimer();
            }
        }, 1000);
    }
    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    static { this.ɵfac = function ForgotPasswordModalComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ForgotPasswordModalComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ForgotPasswordModalComponent, selectors: [["app-forgot-password-modal"]], decls: 1, vars: 1, consts: [["role", "dialog", "aria-modal", "true", "aria-labelledby", "forgot-pwd-title", 1, "fixed", "inset-0", "z-[10000]", "flex", "items-center", "justify-center", "bg-slate-950/75", "backdrop-blur-md", "p-4", "animate-fade-in-up"], [1, "w-full", "max-w-md", "rounded-3xl", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "shadow-2xl", "p-6", "md:p-8", "relative", "overflow-hidden"], [1, "absolute", "top-0", "left-0", "right-0", "h-1/2", "bg-gradient-to-b", "from-blue-500/10", "to-transparent", "pointer-events-none"], ["type", "button", 1, "absolute", "top-4", "right-4", "w-8", "h-8", "flex", "items-center", "justify-center", "rounded-full", "bg-slate-100", "dark:bg-slate-800", "text-slate-500", "hover:text-slate-800", "dark:hover:text-slate-200", "transition-colors", "z-10", 3, "click"], [1, "fa-solid", "fa-xmark"], [1, "flex", "items-start", "gap-4", "mb-6", "relative", "z-10"], [1, "w-12", "h-12", "rounded-2xl", "bg-blue-100", "dark:bg-blue-950/50", "text-blue-600", "dark:text-blue-400", "flex", "items-center", "justify-center", "shrink-0", "shadow-inner"], [1, "fa-solid", "fa-key", "text-xl"], ["id", "forgot-pwd-title", 1, "text-xl", "font-black", "text-slate-800", "dark:text-white", "tracking-tight"], [1, "text-sm", "text-slate-500", "dark:text-slate-400", "mt-1.5", "leading-relaxed", "font-medium"], [1, "space-y-5", "relative", "z-10", 3, "ngSubmit"], [1, "group"], ["for", "reset-email", 1, "block", "text-[11px]", "font-bold", "text-slate-500", "uppercase", "tracking-wider", "mb-1.5", "ml-1"], [1, "relative"], [1, "absolute", "inset-y-0", "left-0", "pl-4", "flex", "items-center", "pointer-events-none"], [1, "fa-regular", "fa-envelope", "text-slate-400", "group-focus-within:text-blue-500", "transition-colors"], ["id", "reset-email", "name", "resetEmail", "type", "email", "autocomplete", "username", "placeholder", "Nh\u1EADp email c\u1EE7a b\u1EA1n...", 1, "w-full", "pl-11", "pr-4", "py-3.5", "bg-slate-50", "dark:bg-slate-800/50", "border", "border-slate-200", "dark:border-slate-700/60", "rounded-2xl", "text-sm", "font-semibold", "text-slate-700", "dark:text-slate-200", "outline-none", "focus:bg-white", "dark:focus:bg-slate-800", "focus:border-blue-400", "dark:focus:border-blue-500", "focus:ring-4", "focus:ring-blue-400/10", "transition-all", "shadow-sm", "placeholder:font-normal", "placeholder:text-slate-400", 3, "ngModelChange", "ngModel", "disabled"], [1, "px-4", "py-3", "rounded-2xl", "bg-red-50/80", "dark:bg-red-950/30", "border", "border-red-100", "dark:border-red-900/50", "text-red-600", "dark:text-red-400", "text-[13px]", "font-medium", "flex", "items-start", "gap-2", "animate-shake"], [1, "px-4", "py-3", "rounded-2xl", "bg-emerald-50/80", "dark:bg-emerald-950/30", "border", "border-emerald-100", "dark:border-emerald-900/50", "text-emerald-700", "dark:text-emerald-400", "text-[13px]", "font-medium", "flex", "items-start", "gap-2"], ["type", "submit", 1, "w-full", "py-3.5", "bg-blue-600", "hover:bg-blue-700", "text-white", "rounded-2xl", "font-bold", "text-sm", "shadow-soft-md", "hover:shadow-lg", "transition-all", "active:scale-[0.98]", "disabled:opacity-60", "disabled:cursor-not-allowed", "flex", "items-center", "justify-center", "gap-2", 3, "disabled"], [1, "fa-solid", "fa-circle-exclamation", "mt-0.5"], [1, "fa-solid", "fa-paper-plane", "mt-0.5"], [1, "fa-solid", "fa-circle-notch", "fa-spin"], [1, "fa-solid", "fa-clock"], [1, "fa-solid", "fa-paper-plane"]], template: function ForgotPasswordModalComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, ForgotPasswordModalComponent_Conditional_0_Template, 27, 6, "div", 0);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.auth.forgotPasswordRequested() ? 0 : -1);
        } }, dependencies: [CommonModule, FormsModule, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.NgModel, i1.NgForm], styles: ["@keyframes _ngcontent-%COMP%_fadeInUp { from { opacity: 0; transform: translateY(10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }\n    .animate-fade-in-up[_ngcontent-%COMP%] { animation: _ngcontent-%COMP%_fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }\n\n    @keyframes _ngcontent-%COMP%_shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }\n    .animate-shake[_ngcontent-%COMP%] { animation: _ngcontent-%COMP%_shake 0.3s ease-in-out; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ForgotPasswordModalComponent, [{
        type: Component,
        args: [{ selector: 'app-forgot-password-modal', standalone: true, imports: [CommonModule, FormsModule], template: `
    @if (auth.forgotPasswordRequested()) {
      <div class="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 animate-fade-in-up" role="dialog" aria-modal="true" aria-labelledby="forgot-pwd-title">
        <div class="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 md:p-8 relative overflow-hidden">
          <!-- Decorative Top Glow -->
          <div class="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none"></div>

          <button type="button" (click)="close()" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors z-10">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div class="flex items-start gap-4 mb-6 relative z-10">
            <div class="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-inner">
              <i class="fa-solid fa-key text-xl"></i>
            </div>
            <div>
              <h2 id="forgot-pwd-title" class="text-xl font-black text-slate-800 dark:text-white tracking-tight">Khôi phục mật khẩu</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-medium">
                Nhập email của bạn để nhận liên kết đặt lại mật khẩu LIMS.
              </p>
            </div>
          </div>

          <form (ngSubmit)="sendResetLink()" class="space-y-5 relative z-10">
            <div class="group">
              <label for="reset-email" class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Email đăng nhập</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i class="fa-regular fa-envelope text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
                </div>
                <input id="reset-email" name="resetEmail" type="email" [(ngModel)]="email" autocomplete="username"
                       class="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-400/10 transition-all shadow-sm placeholder:font-normal placeholder:text-slate-400"
                       placeholder="Nhập email của bạn..." [disabled]="isLoading() || countdown() > 0" />
              </div>
            </div>

            @if (errorMsg()) {
              <div class="px-4 py-3 rounded-2xl bg-red-50/80 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-[13px] font-medium flex items-start gap-2 animate-shake">
                <i class="fa-solid fa-circle-exclamation mt-0.5"></i>
                <span>{{errorMsg()}}</span>
              </div>
            }

            @if (successMsg()) {
              <div class="px-4 py-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-[13px] font-medium flex items-start gap-2">
                <i class="fa-solid fa-paper-plane mt-0.5"></i>
                <span>{{successMsg()}}</span>
              </div>
            }

            <button type="submit" [disabled]="isLoading() || countdown() > 0 || !email"
                    class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-soft-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              @if (isLoading()) {
                <i class="fa-solid fa-circle-notch fa-spin"></i> Đang gửi...
              } @else if (countdown() > 0) {
                <i class="fa-solid fa-clock"></i> Thử lại sau {{countdown()}}s
              } @else {
                <i class="fa-solid fa-paper-plane"></i> Gửi liên kết đặt lại
              }
            </button>
          </form>
        </div>
      </div>
    }
  `, styles: ["\n    @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }\n    .animate-fade-in-up { animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }\n\n    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }\n    .animate-shake { animation: shake 0.3s ease-in-out; }\n  "] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ForgotPasswordModalComponent, { className: "ForgotPasswordModalComponent", filePath: "src/app/features/auth/forgot-password-modal.component.ts", lineNumber: 83 }); })();
//# sourceMappingURL=forgot-password-modal.component.js.map