import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { QrScannerComponent } from '../../shared/components/qr-scanner/qr-scanner.component';
import * as i0 from "@angular/core";
function MobileQrLoginComponent_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 6)(1, "app-qr-scanner", 9);
    i0.ɵɵlistener("scanSuccess", function MobileQrLoginComponent_Conditional_7_Template_app_qr_scanner_scanSuccess_1_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onScan($event)); })("scanError", function MobileQrLoginComponent_Conditional_7_Template_app_qr_scanner_scanError_1_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onError($event)); });
    i0.ɵɵelementEnd()();
} }
function MobileQrLoginComponent_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 7)(1, "div", 10);
    i0.ɵɵelement(2, "i", 11);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "h2", 12);
    i0.ɵɵtext(4, "\u0110ang x\u00E1c th\u1EF1c...");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 13);
    i0.ɵɵtext(6, "\u0110ang g\u1EEDi x\u00E1c nh\u1EADn an to\u00E0n \u0111\u1EBFn m\u00E1y t\u00EDnh.");
    i0.ɵɵelementEnd()();
} }
function MobileQrLoginComponent_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 8)(1, "div", 14);
    i0.ɵɵelement(2, "i", 15);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "h2", 12);
    i0.ɵɵtext(4, "\u0110\u0103ng Nh\u1EADp M\u00E1y T\u00EDnh?");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 16);
    i0.ɵɵtext(6, "X\u00E1c nh\u1EADn \u0111\u1EC3 c\u1EA5p quy\u1EC1n truy c\u1EADp an to\u00E0n cho thi\u1EBFt b\u1ECB n\u00E0y.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div", 17)(8, "div", 18);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "div", 19)(11, "div", 20);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "div", 21);
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "div", 22);
    i0.ɵɵelement(16, "i", 23);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(17, "div", 24);
    i0.ɵɵelement(18, "i", 25);
    i0.ɵɵelementStart(19, "p", 26);
    i0.ɵɵtext(20, " X\u00E1c th\u1EF1c b\u1EB1ng t\u00E0i kho\u1EA3n c\u1EE7a b\u1EA1n \u2014 kh\u00F4ng c\u1EA7n nh\u1EADp m\u1EADt kh\u1EA9u. Phi\u00EAn \u0111\u0103ng nh\u1EADp s\u1EBD h\u1EBFt h\u1EA1n sau 5 ph\u00FAt n\u1EBFu kh\u00F4ng x\u00E1c nh\u1EADn. ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(21, "div", 27)(22, "button", 28);
    i0.ɵɵlistener("click", function MobileQrLoginComponent_Conditional_9_Template_button_click_22_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.cancel()); });
    i0.ɵɵtext(23, "H\u1EE7y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "button", 29);
    i0.ɵɵlistener("click", function MobileQrLoginComponent_Conditional_9_Template_button_click_24_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.approve()); });
    i0.ɵɵelement(25, "i", 30);
    i0.ɵɵtext(26, " \u0110\u1ED3ng \u00FD & \u0110\u0103ng nh\u1EADp ");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    let tmp_3_0;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(9);
    i0.ɵɵtextInterpolate1(" ", (tmp_1_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_1_0.displayName == null ? null : tmp_1_0.displayName.charAt(0), " ");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate((tmp_2_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_2_0.displayName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate((tmp_3_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_3_0.email);
    i0.ɵɵadvance(10);
    i0.ɵɵproperty("disabled", ctx_r1.isProcessing());
} }
export class MobileQrLoginComponent {
    constructor() {
        this.auth = inject(AuthService);
        this.router = inject(Router);
        this.route = inject(ActivatedRoute);
        this.toast = inject(ToastService);
        this.scanData = signal(null);
        this.isProcessing = signal(false);
    }
    ngOnInit() {
        // Hỗ trợ QR code được pass qua query params (ví dụ từ Global Scanner)
        this.route.queryParams.subscribe(params => {
            if (params['qr']) {
                this.onScan(params['qr']);
            }
        });
    }
    onScan(raw) {
        if (this.scanData() || this.isProcessing())
            return;
        // Format mới: "LIMS_QR|{sessionId}|{nonce}"
        const parts = raw.split('|');
        if (parts.length === 3 && parts[0] === 'LIMS_QR' && parts[1] && parts[2]) {
            const sessionId = parts[1];
            const nonce = parts[2];
            // Validation cơ bản: nonce phải đủ dài (32+ chars từ crypto.getRandomValues)
            if (nonce.length < 16) {
                this.toast.show('Mã QR không hợp lệ hoặc đã hết hạn.', 'error');
                return;
            }
            this.scanData.set({ sessionId, nonce });
        }
        else {
            this.toast.show('Mã QR không đúng định dạng. Vui lòng quét mã trên màn hình đăng nhập.', 'error');
        }
    }
    onError(_err) {
        // Xử lý lỗi camera một cách yên lặng — user có thể thử lại
    }
    cancel() {
        this.scanData.set(null);
        this.router.navigate(['/dashboard']);
    }
    async approve() {
        const data = this.scanData();
        if (!data || this.isProcessing())
            return;
        this.isProcessing.set(true);
        try {
            // Lấy Firebase ID Token của user hiện tại (không truyền password)
            const idToken = await this.auth.getIdToken(false);
            if (!idToken) {
                this.toast.show('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.', 'error');
                this.isProcessing.set(false);
                return;
            }
            // Gửi ID Token lên server để xác thực — server tạo customToken cho Desktop
            const response = await fetch('/api/qr/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: data.sessionId,
                    nonce: data.nonce,
                    idToken
                })
            });
            if (!response.ok) {
                const err = await response.json().catch(() => ({ error: 'Lỗi không xác định' }));
                throw new Error(err.error || `HTTP ${response.status}`);
            }
            this.toast.show('Đã xác nhận đăng nhập thành công!', 'success');
            setTimeout(() => this.router.navigate(['/dashboard']), 1200);
        }
        catch (e) {
            console.error('[QR Approve] Error:', e);
            const msg = e?.message?.includes('expired')
                ? 'Mã QR đã hết hạn. Vui lòng quét lại mã mới.'
                : 'Lỗi kết nối. Vui lòng thử lại.';
            this.toast.show(msg, 'error');
            this.scanData.set(null);
            this.isProcessing.set(false);
        }
    }
    static { this.ɵfac = function MobileQrLoginComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || MobileQrLoginComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: MobileQrLoginComponent, selectors: [["app-mobile-qr-login"]], decls: 10, vars: 1, consts: [[1, "h-full", "flex", "flex-col", "bg-black", "relative"], [1, "absolute", "top-0", "left-0", "w-full", "p-4", "z-20", "flex", "justify-between", "items-center", "bg-gradient-to-b", "from-black/80", "to-transparent"], [1, "w-10", "h-10", "rounded-full", "bg-white/20", "backdrop-blur-md", "flex", "items-center", "justify-center", "text-white", "active:scale-95", "transition", 3, "click"], [1, "fa-solid", "fa-arrow-left"], [1, "text-white", "font-bold", "text-sm"], [1, "w-10"], [1, "flex-1", "relative"], [1, "flex-1", "bg-slate-50", "flex", "flex-col", "items-center", "justify-center", "p-6"], [1, "flex-1", "bg-slate-50", "flex", "flex-col", "items-center", "justify-center", "p-6", "animate-slide-up"], [3, "scanSuccess", "scanError"], [1, "w-24", "h-24", "bg-blue-100", "text-blue-600", "rounded-full", "flex", "items-center", "justify-center", "text-5xl", "mb-6", "shadow-lg", "shadow-blue-200"], [1, "fa-solid", "fa-spinner", "fa-spin"], [1, "text-xl", "font-black", "text-slate-800", "text-center", "mb-2"], [1, "text-sm", "text-slate-500", "text-center", "px-4"], [1, "w-24", "h-24", "bg-green-100", "text-green-600", "rounded-full", "flex", "items-center", "justify-center", "text-5xl", "mb-6", "shadow-lg", "shadow-green-200", "animate-bounce-in"], [1, "fa-solid", "fa-desktop"], [1, "text-sm", "text-slate-500", "text-center", "mb-8", "px-4"], [1, "w-full", "max-w-sm", "bg-white", "p-4", "rounded-2xl", "shadow-sm", "border", "border-slate-200", "mb-6", "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-full", "bg-blue-100", "flex", "items-center", "justify-center", "text-blue-600", "font-bold"], [1, "flex-1", "min-w-0"], [1, "text-sm", "font-bold", "text-slate-800", "truncate"], [1, "text-xs", "text-slate-400", "truncate"], [1, "text-green-500", "text-xl"], [1, "fa-solid", "fa-circle-check"], [1, "w-full", "max-w-sm", "bg-emerald-50", "border", "border-emerald-200", "rounded-2xl", "p-4", "mb-6", "flex", "items-start", "gap-3"], [1, "fa-solid", "fa-shield-halved", "text-emerald-600", "mt-0.5"], [1, "text-xs", "text-emerald-700"], [1, "w-full", "max-w-sm", "flex", "gap-3", "mt-auto", "mb-6"], [1, "flex-1", "py-4", "rounded-xl", "border", "border-slate-200", "font-bold", "text-slate-600", "bg-white", "hover:bg-slate-50", "transition", 3, "click"], [1, "flex-[2]", "py-4", "rounded-xl", "bg-blue-600", "text-white", "font-bold", "shadow-lg", "shadow-blue-200", "hover:bg-blue-700", "transition", "disabled:opacity-50", "flex", "items-center", "justify-center", "gap-2", "text-base", 3, "click", "disabled"], [1, "fa-solid", "fa-fingerprint"]], template: function MobileQrLoginComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "button", 2);
            i0.ɵɵlistener("click", function MobileQrLoginComponent_Template_button_click_2_listener() { return ctx.cancel(); });
            i0.ɵɵelement(3, "i", 3);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "span", 4);
            i0.ɵɵtext(5, "Qu\u00E9t m\u00E3 \u0111\u0103ng nh\u1EADp");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(6, "div", 5);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(7, MobileQrLoginComponent_Conditional_7_Template, 2, 0, "div", 6)(8, MobileQrLoginComponent_Conditional_8_Template, 7, 0, "div", 7)(9, MobileQrLoginComponent_Conditional_9_Template, 27, 4, "div", 8);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(7);
            i0.ɵɵconditional(!ctx.scanData() ? 7 : ctx.isProcessing() ? 8 : 9);
        } }, dependencies: [CommonModule, QrScannerComponent], styles: ["@keyframes _ngcontent-%COMP%_bounceIn { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }\n    .animate-bounce-in[_ngcontent-%COMP%] { animation: _ngcontent-%COMP%_bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }\n    @keyframes _ngcontent-%COMP%_slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }\n    .animate-slide-up[_ngcontent-%COMP%] { animation: _ngcontent-%COMP%_slideUp 0.3s ease-out; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(MobileQrLoginComponent, [{
        type: Component,
        args: [{ selector: 'app-mobile-qr-login', standalone: true, imports: [CommonModule, QrScannerComponent], template: `
    <div class="h-full flex flex-col bg-black relative">
        <!-- Header -->
        <div class="absolute top-0 left-0 w-full p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
            <button (click)="cancel()" class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition">
                <i class="fa-solid fa-arrow-left"></i>
            </button>
            <span class="text-white font-bold text-sm">Quét mã đăng nhập</span>
            <div class="w-10"></div>
        </div>

        @if (!scanData()) {
            <!-- SCANNER -->
            <div class="flex-1 relative">
                <app-qr-scanner (scanSuccess)="onScan($event)" (scanError)="onError($event)"></app-qr-scanner>
            </div>
        } @else if (isProcessing()) {
            <!-- PROCESSING STATE -->
            <div class="flex-1 bg-slate-50 flex flex-col items-center justify-center p-6">
                <div class="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-5xl mb-6 shadow-lg shadow-blue-200">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                </div>
                <h2 class="text-xl font-black text-slate-800 text-center mb-2">Đang xác thực...</h2>
                <p class="text-sm text-slate-500 text-center px-4">Đang gửi xác nhận an toàn đến máy tính.</p>
            </div>
        } @else {
            <!-- CONFIRM FORM -->
            <div class="flex-1 bg-slate-50 flex flex-col items-center justify-center p-6 animate-slide-up">

                <!-- Success Icon -->
                <div class="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mb-6 shadow-lg shadow-green-200 animate-bounce-in">
                    <i class="fa-solid fa-desktop"></i>
                </div>

                <h2 class="text-xl font-black text-slate-800 text-center mb-2">Đăng Nhập Máy Tính?</h2>
                <p class="text-sm text-slate-500 text-center mb-8 px-4">Xác nhận để cấp quyền truy cập an toàn cho thiết bị này.</p>

                <!-- User Info Card -->
                <div class="w-full max-w-sm bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {{ auth.currentUser()?.displayName?.charAt(0) }}
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="text-sm font-bold text-slate-800 truncate">{{ auth.currentUser()?.displayName }}</div>
                        <div class="text-xs text-slate-400 truncate">{{ auth.currentUser()?.email }}</div>
                    </div>
                    <div class="text-green-500 text-xl"><i class="fa-solid fa-circle-check"></i></div>
                </div>

                <!-- Security Notice -->
                <div class="w-full max-w-sm bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
                    <i class="fa-solid fa-shield-halved text-emerald-600 mt-0.5"></i>
                    <p class="text-xs text-emerald-700">
                        Xác thực bằng tài khoản của bạn — không cần nhập mật khẩu.
                        Phiên đăng nhập sẽ hết hạn sau 5 phút nếu không xác nhận.
                    </p>
                </div>

                <div class="w-full max-w-sm flex gap-3 mt-auto mb-6">
                    <button (click)="cancel()" class="flex-1 py-4 rounded-xl border border-slate-200 font-bold text-slate-600 bg-white hover:bg-slate-50 transition">Hủy</button>

                    <button (click)="approve()" [disabled]="isProcessing()"
                            class="flex-[2] py-4 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2 text-base">
                        <i class="fa-solid fa-fingerprint"></i>
                        Đồng ý & Đăng nhập
                    </button>
                </div>
            </div>
        }
    </div>
  `, styles: ["\n    @keyframes bounceIn { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }\n    .animate-bounce-in { animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }\n    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }\n    .animate-slide-up { animation: slideUp 0.3s ease-out; }\n  "] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(MobileQrLoginComponent, { className: "MobileQrLoginComponent", filePath: "src/app/features/auth/mobile-qr-login.component.ts", lineNumber: 97 }); })();
//# sourceMappingURL=mobile-qr-login.component.js.map