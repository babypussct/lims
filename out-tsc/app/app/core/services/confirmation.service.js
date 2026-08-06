import { Injectable, signal } from '@angular/core';
import * as i0 from "@angular/core";
export class ConfirmationService {
    constructor() {
        this.defaultState = {
            isVisible: false, message: '', confirmText: 'Xác nhận', cancelText: 'Hủy', isDangerous: false,
        };
        this.state = signal(this.defaultState);
    }
    confirm(options) {
        const opts = typeof options === 'string' ? { message: options } : options;
        return new Promise((resolve) => {
            this.resolver = resolve;
            this.state.set({
                isVisible: true, message: opts.message, confirmText: opts.confirmText || 'Xác nhận',
                cancelText: opts.cancelText || 'Hủy', isDangerous: opts.isDangerous || false,
            });
        });
    }
    onConfirm() { if (this.resolver)
        this.resolver(true); this.close(); }
    onCancel() { if (this.resolver)
        this.resolver(false); this.close(); }
    close() { this.state.set({ ...this.defaultState }); this.resolver = undefined; }
    static { this.ɵfac = function ConfirmationService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ConfirmationService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ConfirmationService, factory: ConfirmationService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ConfirmationService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=confirmation.service.js.map