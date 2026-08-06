import { Directive, Input, ElementRef, Renderer2, inject, effect } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { StateService } from '../../core/services/state.service';
import { ToastService } from '../../core/services/toast.service';
import * as i0 from "@angular/core";
export class LockPermissionDirective {
    constructor() {
        this.auth = inject(AuthService);
        this.state = inject(StateService);
        this.toast = inject(ToastService);
        this.el = inject(ElementRef);
        this.renderer = inject(Renderer2);
        this.originalTitle = null;
        this.hasCapturedTitle = false;
        effect(() => {
            // Reactivity triggers when user or showLockedFeatures changes
            this.auth.currentUser();
            this.state.showLockedFeatures();
            this.applyState();
        });
    }
    ngOnInit() {
        const nativeEl = this.el.nativeElement;
        if (nativeEl.hasAttribute('title')) {
            this.originalTitle = nativeEl.getAttribute('title');
            this.hasCapturedTitle = true;
        }
        this.setupCaptureListeners();
        this.applyState();
    }
    ngOnDestroy() {
        if (this.removeClickListener)
            this.removeClickListener();
        if (this.removeKeydownListener)
            this.removeKeydownListener();
    }
    setupCaptureListeners() {
        const nativeEl = this.el.nativeElement;
        // Register in capture phase so parent intercept catches child button clicks before they fire
        const captureHandler = (event) => {
            if (!this.permission)
                return;
            const hasPerm = this.auth.hasPermission(this.permission);
            const showLocked = this.state.showLockedFeatures();
            if (!hasPerm && showLocked) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                const permName = this.auth.getPermissionName(this.permission) || this.permission;
                this.toast.show(`Cần quyền "${permName}" · Liên hệ quản trị viên để được cấp`, 'warning');
            }
        };
        nativeEl.addEventListener('click', captureHandler, true);
        const keydownHandler = (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                captureHandler(event);
            }
        };
        nativeEl.addEventListener('keydown', keydownHandler, true);
        this.removeClickListener = () => nativeEl.removeEventListener('click', captureHandler, true);
        this.removeKeydownListener = () => nativeEl.removeEventListener('keydown', keydownHandler, true);
    }
    applyState() {
        if (!this.permission)
            return;
        const hasPerm = this.auth.hasPermission(this.permission);
        const showLocked = this.state.showLockedFeatures();
        const nativeEl = this.el.nativeElement;
        if (hasPerm) {
            if (this.hasCapturedTitle && this.originalTitle !== null) {
                this.renderer.setAttribute(nativeEl, 'title', this.originalTitle);
            }
            else {
                this.renderer.removeAttribute(nativeEl, 'title');
            }
            this.renderer.removeAttribute(nativeEl, 'aria-disabled');
            this.renderer.removeAttribute(nativeEl, 'disabled');
            this.renderer.removeClass(nativeEl, 'opacity-50');
            this.renderer.removeClass(nativeEl, 'cursor-not-allowed');
            this.renderer.setStyle(nativeEl, 'display', '');
            this.renderer.setStyle(nativeEl, 'pointer-events', '');
        }
        else if (showLocked) {
            // Capture original title before overriding if not already captured
            if (!this.hasCapturedTitle && nativeEl.hasAttribute('title')) {
                this.originalTitle = nativeEl.getAttribute('title');
                this.hasCapturedTitle = true;
            }
            // Do NOT set native `disabled` so standard browsers allow click event to be caught by capture listener
            this.renderer.removeAttribute(nativeEl, 'disabled');
            this.renderer.setAttribute(nativeEl, 'aria-disabled', 'true');
            this.renderer.addClass(nativeEl, 'opacity-50');
            this.renderer.addClass(nativeEl, 'cursor-not-allowed');
            this.renderer.setStyle(nativeEl, 'pointer-events', 'auto');
            this.renderer.setAttribute(nativeEl, 'title', `Cần quyền "${this.permission}" · Liên hệ quản trị viên để được cấp`);
            this.renderer.setStyle(nativeEl, 'display', '');
        }
        else {
            this.renderer.setStyle(nativeEl, 'display', 'none');
        }
    }
    static { this.ɵfac = function LockPermissionDirective_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LockPermissionDirective)(); }; }
    static { this.ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: LockPermissionDirective, selectors: [["", "appLockPermission", ""]], inputs: { permission: [0, "appLockPermission", "permission"] } }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LockPermissionDirective, [{
        type: Directive,
        args: [{
                selector: '[appLockPermission]',
                standalone: true
            }]
    }], () => [], { permission: [{
            type: Input,
            args: ['appLockPermission']
        }] }); })();
//# sourceMappingURL=lock-permission.directive.js.map