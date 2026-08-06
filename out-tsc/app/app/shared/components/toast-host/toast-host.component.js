import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
const _forTrack0 = ($index, $item) => $item.id;
function ToastHostComponent_For_2_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 5);
} }
function ToastHostComponent_For_2_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 6);
} }
function ToastHostComponent_For_2_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 7);
} }
function ToastHostComponent_For_2_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 8);
} }
function ToastHostComponent_For_2_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 11);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const t_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" \u00D7", t_r2.count, " ");
} }
function ToastHostComponent_For_2_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 18);
    i0.ɵɵlistener("click", function ToastHostComponent_For_2_Conditional_13_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r4); const t_r2 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.toggleExpanded(t_r2.id, $event)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const t_r2 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.isExpanded(t_r2.id) ? "Thu g\u1ECDn" : "Xem th\u00EAm", " ");
} }
function ToastHostComponent_For_2_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 19);
    i0.ɵɵlistener("click", function ToastHostComponent_For_2_Conditional_16_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r5); const t_r2 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.toast.runAction(t_r2)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const t_r2 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵproperty("ngClass", ctx_r2.actionClass(t_r2.type));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", t_r2.actionLabel || "Xem chi ti\u1EBFt", " ");
} }
function ToastHostComponent_For_2_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 20);
} if (rf & 2) {
    const t_r2 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵstyleProp("animation-duration", t_r2.durationMs, "ms")("animation-play-state", t_r2.paused ? "paused" : "running");
    i0.ɵɵproperty("ngClass", ctx_r2.progressClass(t_r2.type));
} }
function ToastHostComponent_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 2);
    i0.ɵɵlistener("mouseenter", function ToastHostComponent_For_2_Template_div_mouseenter_0_listener() { const t_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.toast.pause(t_r2.id)); })("mouseleave", function ToastHostComponent_For_2_Template_div_mouseleave_0_listener() { const t_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.toast.resume(t_r2.id)); })("focusin", function ToastHostComponent_For_2_Template_div_focusin_0_listener() { const t_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.toast.pause(t_r2.id)); })("focusout", function ToastHostComponent_For_2_Template_div_focusout_0_listener() { const t_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.toast.resume(t_r2.id)); })("pointerdown", function ToastHostComponent_For_2_Template_div_pointerdown_0_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.onPointerDown($event)); })("pointerup", function ToastHostComponent_For_2_Template_div_pointerup_0_listener($event) { const t_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.onPointerUp(t_r2.id, $event)); });
    i0.ɵɵelementStart(1, "div", 3)(2, "div", 4);
    i0.ɵɵtemplate(3, ToastHostComponent_For_2_Conditional_3_Template, 1, 0, "i", 5)(4, ToastHostComponent_For_2_Conditional_4_Template, 1, 0, "i", 6)(5, ToastHostComponent_For_2_Conditional_5_Template, 1, 0, "i", 7)(6, ToastHostComponent_For_2_Conditional_6_Template, 1, 0, "i", 8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div", 9)(8, "div", 10);
    i0.ɵɵtext(9);
    i0.ɵɵtemplate(10, ToastHostComponent_For_2_Conditional_10_Template, 2, 1, "span", 11);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "div", 12);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(13, ToastHostComponent_For_2_Conditional_13_Template, 2, 1, "button", 13);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "button", 14);
    i0.ɵɵlistener("click", function ToastHostComponent_For_2_Template_button_click_14_listener() { const t_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.toast.remove(t_r2.id)); });
    i0.ɵɵelement(15, "i", 15);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(16, ToastHostComponent_For_2_Conditional_16_Template, 2, 2, "button", 16)(17, ToastHostComponent_For_2_Conditional_17_Template, 1, 5, "span", 17);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const t_r2 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵproperty("ngClass", ctx_r2.cardClass(t_r2.type));
    i0.ɵɵattribute("role", t_r2.type === "error" ? "alert" : "status")("aria-live", t_r2.type === "error" ? "assertive" : "polite");
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(t_r2.type === "success" ? 3 : t_r2.type === "error" ? 4 : t_r2.type === "warning" ? 5 : 6);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate1(" ", t_r2.title || ctx_r2.defaultTitle(t_r2.type), " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional((t_r2.count || 1) > 1 ? 10 : -1);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("line-clamp-3", !ctx_r2.isExpanded(t_r2.id));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(t_r2.message);
    i0.ɵɵadvance();
    i0.ɵɵconditional(t_r2.message.length > 160 ? 13 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(t_r2.action ? 16 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(!t_r2.persistent && t_r2.durationMs ? 17 : -1);
} }
export class ToastHostComponent {
    constructor() {
        this.toast = inject(ToastService);
        this.pointerStartX = 0;
        this.expandedIds = new Set();
    }
    defaultTitle(type) {
        if (type === 'success')
            return 'Thành công';
        if (type === 'error')
            return 'Lỗi';
        if (type === 'warning')
            return 'Cảnh báo';
        return 'Thông báo';
    }
    cardClass(type) {
        const classes = {
            success: 'bg-emerald-50/95 dark:bg-emerald-950/95 border-emerald-200 dark:border-emerald-800 border-l-emerald-500',
            error: 'bg-red-50/95 dark:bg-red-950/95 border-red-200 dark:border-red-800 border-l-red-500',
            warning: 'bg-amber-50/95 dark:bg-amber-950/95 border-amber-200 dark:border-amber-800 border-l-amber-500',
            info: 'bg-blue-50/95 dark:bg-slate-900/95 border-blue-200 dark:border-blue-800 border-l-blue-500'
        };
        return classes[type] || classes['info'];
    }
    actionClass(type) {
        const classes = {
            success: 'bg-emerald-600 hover:bg-emerald-700',
            error: 'bg-red-600 hover:bg-red-700',
            warning: 'bg-amber-600 hover:bg-amber-700',
            info: 'bg-blue-600 hover:bg-blue-700'
        };
        return classes[type] || classes['info'];
    }
    progressClass(type) {
        const classes = {
            success: 'bg-emerald-500', error: 'bg-red-500', warning: 'bg-amber-500', info: 'bg-blue-500'
        };
        return classes[type] || classes['info'];
    }
    isExpanded(id) { return this.expandedIds.has(id); }
    toggleExpanded(id, event) {
        event.stopPropagation();
        this.expandedIds.has(id) ? this.expandedIds.delete(id) : this.expandedIds.add(id);
    }
    onPointerDown(event) { this.pointerStartX = event.clientX; }
    onPointerUp(id, event) {
        if (Math.abs(event.clientX - this.pointerStartX) > 70)
            this.toast.remove(id);
        this.pointerStartX = 0;
    }
    static { this.ɵfac = function ToastHostComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ToastHostComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ToastHostComponent, selectors: [["app-toast-host"]], decls: 3, vars: 0, consts: [["aria-live", "polite", "aria-atomic", "false", 1, "fixed", "z-[210]", "flex", "flex-col-reverse", "items-stretch", "gap-2.5", "no-print", "pointer-events-none", "left-1/2", "-translate-x-1/2", "bottom-[calc(5.75rem+env(safe-area-inset-bottom))]", "w-full", "max-w-sm", "px-4", "md:left-auto", "md:right-4", "md:translate-x-0", "md:top-4", "md:bottom-auto", "md:w-[380px]", "md:px-0"], [1, "toast-card", "pointer-events-auto", "relative", "overflow-hidden", "flex", "flex-col", "gap-2.5", "px-4", "py-3.5", "rounded-2xl", "shadow-xl", "backdrop-blur-xl", "border", "border-l-4", "animate-slide-up", "touch-pan-y", 3, "ngClass"], [1, "toast-card", "pointer-events-auto", "relative", "overflow-hidden", "flex", "flex-col", "gap-2.5", "px-4", "py-3.5", "rounded-2xl", "shadow-xl", "backdrop-blur-xl", "border", "border-l-4", "animate-slide-up", "touch-pan-y", 3, "mouseenter", "mouseleave", "focusin", "focusout", "pointerdown", "pointerup", "ngClass"], [1, "flex", "items-center", "gap-4"], [1, "shrink-0", "text-xl"], [1, "fa-solid", "fa-circle-check", "text-emerald-500"], [1, "fa-solid", "fa-circle-xmark", "text-red-500"], [1, "fa-solid", "fa-circle-exclamation", "text-amber-500"], [1, "fa-solid", "fa-circle-info", "text-blue-500"], [1, "flex-1", "min-w-0", "text-slate-800", "dark:text-slate-100"], [1, "text-xs", "font-bold", "uppercase", "opacity-60", "tracking-wider", "flex", "items-center", "gap-1.5"], [1, "inline-flex", "items-center", "justify-center", "min-w-[1.25rem]", "h-5", "px-1.5", "rounded-full", "text-[10px]", "font-extrabold", "bg-current/15", "text-current", "opacity-100"], [1, "text-sm", "font-semibold", "leading-snug", "break-words"], [1, "mt-1", "text-[11px]", "font-bold", "opacity-70", "hover:opacity-100"], ["aria-label", "\u0110\u00F3ng th\u00F4ng b\u00E1o", 1, "shrink-0", "w-10", "h-10", "-mr-2", "flex", "items-center", "justify-center", "rounded-xl", "text-slate-400", "hover:text-slate-700", "hover:bg-black/5", "dark:hover:text-slate-200", "dark:hover:bg-white/10", "transition", "active:scale-90", 3, "click"], [1, "fa-solid", "fa-xmark"], [1, "w-full", "min-h-10", "px-4", "py-2", "text-white", "rounded-xl", "text-xs", "font-bold", "transition", "flex", "items-center", "justify-center", "gap-2", "active:scale-95", 3, "ngClass"], [1, "toast-progress", "absolute", "bottom-0", "left-0", "h-0.5", "opacity-60", 3, "ngClass", "animation-duration", "animation-play-state"], [1, "mt-1", "text-[11px]", "font-bold", "opacity-70", "hover:opacity-100", 3, "click"], [1, "w-full", "min-h-10", "px-4", "py-2", "text-white", "rounded-xl", "text-xs", "font-bold", "transition", "flex", "items-center", "justify-center", "gap-2", "active:scale-95", 3, "click", "ngClass"], [1, "toast-progress", "absolute", "bottom-0", "left-0", "h-0.5", "opacity-60", 3, "ngClass"]], template: function ToastHostComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0);
            i0.ɵɵrepeaterCreate(1, ToastHostComponent_For_2_Template, 18, 12, "div", 1, _forTrack0);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵrepeater(ctx.toast.toasts());
        } }, dependencies: [CommonModule, i1.NgClass], styles: [".toast-card[_ngcontent-%COMP%] { will-change: transform, opacity; }\n    .toast-progress[_ngcontent-%COMP%] {\n      width: 100%;\n      transform-origin: left;\n      animation-name: _ngcontent-%COMP%_toastCountdown;\n      animation-timing-function: linear;\n      animation-fill-mode: forwards;\n    }\n    @keyframes _ngcontent-%COMP%_toastCountdown {\n      from { transform: scaleX(1); }\n      to { transform: scaleX(0); }\n    }\n    @media (prefers-reduced-motion: reduce) {\n      .toast-progress[_ngcontent-%COMP%] { animation: none; }\n      .toast-card[_ngcontent-%COMP%] { animation: none; }\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ToastHostComponent, [{
        type: Component,
        args: [{ selector: 'app-toast-host', standalone: true, imports: [CommonModule], template: `
    <div class="fixed z-[210] flex flex-col-reverse items-stretch gap-2.5 no-print pointer-events-none
                left-1/2 -translate-x-1/2 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] w-full max-w-sm px-4
                md:left-auto md:right-4 md:translate-x-0 md:top-4 md:bottom-auto md:w-[380px] md:px-0"
         aria-live="polite" aria-atomic="false">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast-card pointer-events-auto relative overflow-hidden flex flex-col gap-2.5 px-4 py-3.5 rounded-2xl shadow-xl backdrop-blur-xl border border-l-4 animate-slide-up touch-pan-y"
             [attr.role]="t.type === 'error' ? 'alert' : 'status'"
             [attr.aria-live]="t.type === 'error' ? 'assertive' : 'polite'"
             (mouseenter)="toast.pause(t.id)" (mouseleave)="toast.resume(t.id)"
             (focusin)="toast.pause(t.id)" (focusout)="toast.resume(t.id)"
             (pointerdown)="onPointerDown($event)" (pointerup)="onPointerUp(t.id, $event)"
             [ngClass]="cardClass(t.type)">
          <div class="flex items-center gap-4">
            <div class="shrink-0 text-xl">
              @if (t.type === 'success') { <i class="fa-solid fa-circle-check text-emerald-500"></i> }
              @else if (t.type === 'error') { <i class="fa-solid fa-circle-xmark text-red-500"></i> }
              @else if (t.type === 'warning') { <i class="fa-solid fa-circle-exclamation text-amber-500"></i> }
              @else { <i class="fa-solid fa-circle-info text-blue-500"></i> }
            </div>
            <div class="flex-1 min-w-0 text-slate-800 dark:text-slate-100">
              <div class="text-xs font-bold uppercase opacity-60 tracking-wider flex items-center gap-1.5">
                {{ t.title || defaultTitle(t.type) }}
                @if ((t.count || 1) > 1) {
                  <span class="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-[10px] font-extrabold bg-current/15 text-current opacity-100">
                    ×{{ t.count }}
                  </span>
                }
              </div>
              <div class="text-sm font-semibold leading-snug break-words"
                   [class.line-clamp-3]="!isExpanded(t.id)">{{ t.message }}</div>
              @if (t.message.length > 160) {
                <button (click)="toggleExpanded(t.id, $event)" class="mt-1 text-[11px] font-bold opacity-70 hover:opacity-100">
                  {{ isExpanded(t.id) ? 'Thu gọn' : 'Xem thêm' }}
                </button>
              }
            </div>
            <button (click)="toast.remove(t.id)" class="shrink-0 w-10 h-10 -mr-2 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-black/5 dark:hover:text-slate-200 dark:hover:bg-white/10 transition active:scale-90" aria-label="Đóng thông báo">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          @if (t.action) {
            <button (click)="toast.runAction(t)"
                    class="w-full min-h-10 px-4 py-2 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 active:scale-95"
                    [ngClass]="actionClass(t.type)">
              {{ t.actionLabel || 'Xem chi tiết' }}
            </button>
          }
          @if (!t.persistent && t.durationMs) {
            <span class="toast-progress absolute bottom-0 left-0 h-0.5 opacity-60"
                  [ngClass]="progressClass(t.type)"
                  [style.animation-duration.ms]="t.durationMs"
                  [style.animation-play-state]="t.paused ? 'paused' : 'running'"></span>
          }
        </div>
      }
    </div>
  `, styles: ["\n    .toast-card { will-change: transform, opacity; }\n    .toast-progress {\n      width: 100%;\n      transform-origin: left;\n      animation-name: toastCountdown;\n      animation-timing-function: linear;\n      animation-fill-mode: forwards;\n    }\n    @keyframes toastCountdown {\n      from { transform: scaleX(1); }\n      to { transform: scaleX(0); }\n    }\n    @media (prefers-reduced-motion: reduce) {\n      .toast-progress { animation: none; }\n      .toast-card { animation: none; }\n    }\n  "] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ToastHostComponent, { className: "ToastHostComponent", filePath: "src/app/shared/components/toast-host/toast-host.component.ts", lineNumber: 86 }); })();
//# sourceMappingURL=toast-host.component.js.map