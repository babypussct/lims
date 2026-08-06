import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
export class SkeletonComponent {
    constructor() {
        this.width = input('100%');
        this.height = input('1rem');
        this.shape = input('text');
    }
    static { this.ɵfac = function SkeletonComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SkeletonComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: SkeletonComponent, selectors: [["app-skeleton"]], inputs: { width: [1, "width"], height: [1, "height"], shape: [1, "shape"] }, decls: 2, vars: 10, consts: [[1, "animate-pulse", "bg-slate-200", "dark:bg-slate-800", "rounded", "relative", "overflow-hidden"], [1, "absolute", "inset-0", "-translate-x-full", "bg-gradient-to-r", "from-transparent", "via-white/40", "dark:via-white/5", "to-transparent", "animate-[shimmer_1.5s_infinite]"]], template: function SkeletonComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0);
            i0.ɵɵelement(1, "div", 1);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵstyleProp("width", ctx.width())("height", ctx.height());
            i0.ɵɵclassProp("rounded-full", ctx.shape() === "circle")("rounded-lg", ctx.shape() === "rect")("rounded-md", ctx.shape() === "text");
        } }, dependencies: [CommonModule], styles: ["@keyframes _ngcontent-%COMP%_shimmer {\n      100% { transform: translateX(100%); }\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SkeletonComponent, [{
        type: Component,
        args: [{ selector: 'app-skeleton', standalone: true, imports: [CommonModule], template: `
    <div class="animate-pulse bg-slate-200 dark:bg-slate-800 rounded relative overflow-hidden" 
         [class.rounded-full]="shape() === 'circle'"
         [class.rounded-lg]="shape() === 'rect'"
         [class.rounded-md]="shape() === 'text'"
         [style.width]="width()" 
         [style.height]="height()">
         <!-- Shimmer effect -->
         <div class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent animate-[shimmer_1.5s_infinite]"></div>
    </div>
  `, styles: ["\n    @keyframes shimmer {\n      100% { transform: translateX(100%); }\n    }\n  "] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(SkeletonComponent, { className: "SkeletonComponent", filePath: "src/app/shared/components/skeleton/skeleton.component.ts", lineNumber: 26 }); })();
//# sourceMappingURL=skeleton.component.js.map