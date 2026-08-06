import { Injectable, inject, NgZone } from '@angular/core';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';
import * as i0 from "@angular/core";
export class IdleTimeoutService {
    constructor() {
        this.auth = inject(AuthService);
        this.toast = inject(ToastService);
        this.ngZone = inject(NgZone);
        // Time is set in minutes. Defaults to 30 mins.
        this.TIMEOUT_MINUTES = 30;
        this.TIMEOUT_MILLISECONDS = this.TIMEOUT_MINUTES * 60 * 1000;
        this.isListening = false;
        // The event listener is bounded so it can be un-registered easily
        this.resetFn = () => this.resetTimer();
    }
    shouldDisableTimeout() {
        // 1. Kiểm tra cấu hình duy trì đăng nhập của người dùng
        const rememberSession = localStorage.getItem('lims_remember_session') === 'true';
        if (rememberSession) {
            return true; // Bỏ qua tự thoát nếu người dùng chủ động duy trì đăng nhập
        }
        const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isMobileWidth = window.innerWidth <= 768;
        // Tắt timeout nếu là thiết bị di động (áp dụng chung cho cả Trình duyệt trên Mobile và PWA trên Mobile).
        // Desktop (kể cả PWA trên Desktop) vẫn sẽ bị tự động đăng xuất.
        return isMobileUserAgent || isMobileWidth;
    }
    startWatching() {
        if (this.shouldDisableTimeout()) {
            return; // Không theo dõi idle timeout trên thiết bị di động hoặc PWA
        }
        if (this.isListening)
            return;
        // Run outside Angular zone to avoid triggering change detection on every mouse move
        this.ngZone.runOutsideAngular(() => {
            window.addEventListener('mousemove', this.resetFn);
            window.addEventListener('keydown', this.resetFn);
            window.addEventListener('mousedown', this.resetFn);
            window.addEventListener('touchstart', this.resetFn);
        });
        this.isListening = true;
        this.resetTimer();
    }
    stopWatching() {
        if (!this.isListening)
            return;
        window.removeEventListener('mousemove', this.resetFn);
        window.removeEventListener('keydown', this.resetFn);
        window.removeEventListener('mousedown', this.resetFn);
        window.removeEventListener('touchstart', this.resetFn);
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        this.isListening = false;
    }
    resetTimer() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        // Set new timeout outside Angular
        this.ngZone.runOutsideAngular(() => {
            this.timeoutId = setTimeout(() => {
                // Run back inside Angular zone to update UI state and navigate
                this.ngZone.run(() => {
                    this.handleTimeout();
                });
            }, this.TIMEOUT_MILLISECONDS);
        });
    }
    handleTimeout() {
        // Check if user is actually somewhat logged in before showing message
        if (this.auth.currentUser()) {
            localStorage.setItem('lims_logout_reason', 'idle');
            this.auth.logout();
        }
    }
    static { this.ɵfac = function IdleTimeoutService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdleTimeoutService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: IdleTimeoutService, factory: IdleTimeoutService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdleTimeoutService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], null, null); })();
//# sourceMappingURL=idle-timeout.service.js.map