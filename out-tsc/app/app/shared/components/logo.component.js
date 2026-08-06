import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
/**
 * NAFIQPM6 LIMS — Logo Component (Sử dụng trực tiếp tệp tin ảnh tĩnh chuẩn từ public/icons)
 *
 * Để đạt được độ đồng bộ 100% tuyệt đối y hệt như bản phác thảo hình ảnh gốc đã phê duyệt
 * (không lệch một pixel nào và giữ nguyên hiệu ứng phát sáng 3D phức tạp):
 * Chúng ta sử dụng trực tiếp các tệp tin PNG được tối ưu hóa theo kích thước tương ứng.
 */
export class LogoComponent {
    constructor() {
        /** Kích thước hiển thị (ví dụ: '18px', '32px', '64px', '128px') */
        this.size = '32px';
        /** Chế độ màu (để tương thích ngược với các file HTML cũ, không ảnh hưởng đến PNG) */
        this.mode = 'multicolor';
    }
    getIconPath() {
        const numericSize = parseInt(this.size, 10) || 32;
        if (numericSize <= 24) {
            return 'icons/icon-72x72.png';
        }
        else if (numericSize <= 48) {
            return 'icons/icon-96x96.png';
        }
        else if (numericSize <= 192) {
            return 'icons/icon-192x192.png';
        }
        else {
            return 'icons/icon-512x512.png';
        }
    }
    static { this.ɵfac = function LogoComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LogoComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: LogoComponent, selectors: [["app-logo"]], hostAttrs: [1, "inline-flex", "items-center", "justify-center", "shrink-0"], hostVars: 4, hostBindings: function LogoComponent_HostBindings(rf, ctx) { if (rf & 2) {
            i0.ɵɵstyleProp("width", ctx.size)("height", ctx.size);
        } }, inputs: { size: "size", mode: "mode" }, decls: 1, vars: 1, consts: [["alt", "LIMS NAFIQPM6 Logo", 1, "w-full", "h-full", "object-contain", "select-none", "pointer-events-none", "block", "shrink-0", 3, "src"]], template: function LogoComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelement(0, "img", 0);
        } if (rf & 2) {
            i0.ɵɵproperty("src", ctx.getIconPath(), i0.ɵɵsanitizeUrl);
        } }, dependencies: [CommonModule], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LogoComponent, [{
        type: Component,
        args: [{
                selector: 'app-logo',
                standalone: true,
                imports: [CommonModule],
                host: {
                    'class': 'inline-flex items-center justify-center shrink-0',
                    '[style.width]': 'size',
                    '[style.height]': 'size'
                },
                template: `
    <img
      [src]="getIconPath()"
      class="w-full h-full object-contain select-none pointer-events-none block shrink-0"
      alt="LIMS NAFIQPM6 Logo"
    />
  `
            }]
    }], null, { size: [{
            type: Input
        }], mode: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(LogoComponent, { className: "LogoComponent", filePath: "src/app/shared/components/logo.component.ts", lineNumber: 28 }); })();
//# sourceMappingURL=logo.component.js.map