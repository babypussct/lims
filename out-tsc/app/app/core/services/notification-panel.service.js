import { Injectable, signal } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Service đơn giản quản lý trạng thái mở/đóng của Notification Panel.
 * Được inject ở root → bất kỳ component nào cũng có thể toggle panel
 * mà không cần quan tâm đến vị trí DOM hay stacking context.
 */
export class NotificationPanelService {
    constructor() {
        this.isOpen = signal(false);
    }
    open() { this.isOpen.set(true); }
    close() { this.isOpen.set(false); }
    toggle() { this.isOpen.update(v => !v); }
    static { this.ɵfac = function NotificationPanelService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || NotificationPanelService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: NotificationPanelService, factory: NotificationPanelService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NotificationPanelService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=notification-panel.service.js.map