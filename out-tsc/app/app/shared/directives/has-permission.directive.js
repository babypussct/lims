import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import * as i0 from "@angular/core";
export class HasPermissionDirective {
    constructor() {
        this.auth = inject(AuthService);
        this.templateRef = inject((TemplateRef));
        this.viewContainer = inject(ViewContainerRef);
        this.hasView = false;
        effect(() => {
            // Sẽ tự động chạy lại bất cứ khi nào auth.currentUser() thay đổi
            const user = this.auth.currentUser();
            const hasPerm = this.auth.hasPermission(this.permission);
            if (hasPerm && !this.hasView) {
                this.viewContainer.createEmbeddedView(this.templateRef);
                this.hasView = true;
            }
            else if (!hasPerm && this.hasView) {
                this.viewContainer.clear();
                this.hasView = false;
            }
        });
    }
    static { this.ɵfac = function HasPermissionDirective_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || HasPermissionDirective)(); }; }
    static { this.ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: HasPermissionDirective, selectors: [["", "appHasPermission", ""]], inputs: { permission: [0, "appHasPermission", "permission"] } }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(HasPermissionDirective, [{
        type: Directive,
        args: [{
                selector: '[appHasPermission]',
                standalone: true
            }]
    }], () => [], { permission: [{
            type: Input,
            args: ['appHasPermission']
        }] }); })();
//# sourceMappingURL=has-permission.directive.js.map