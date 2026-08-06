import { Component, inject, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { NotificationPanelService } from '../../../core/services/notification-panel.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
function NotificationBellComponent_Conditional_0_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 7);
    i0.ɵɵelement(1, "span", 9);
    i0.ɵɵelementStart(2, "span", 10);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.hasActionableUnread() ? "bg-amber-400" : "bg-red-400");
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.panel.isOpen() ? "border-fuchsia-500" : "border-white dark:border-slate-900");
    i0.ɵɵproperty("ngClass", ctx_r1.hasActionableUnread() ? "bg-gradient-to-br from-amber-500 to-orange-500 shadow-sm shadow-amber-500/40" : "bg-gradient-to-br from-red-500 to-rose-600 shadow-sm shadow-red-500/40");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.unreadCount() > 9 ? "9+" : ctx_r1.unreadCount(), " ");
} }
function NotificationBellComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 4);
    i0.ɵɵlistener("click", function NotificationBellComponent_Conditional_0_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onToggle($event)); });
    i0.ɵɵelementStart(1, "div", 5);
    i0.ɵɵelement(2, "i", 6);
    i0.ɵɵtemplate(3, NotificationBellComponent_Conditional_0_Conditional_3_Template, 4, 6, "span", 7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span", 8);
    i0.ɵɵtext(5, " Th\u00F4ng B\u00E1o ");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("title", ctx_r1.unreadCount() > 0 ? ctx_r1.unreadCount() + " th\u00F4ng b\u00E1o ch\u01B0a \u0111\u1ECDc" : "Th\u00F4ng b\u00E1o");
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.panel.isOpen() ? "bg-gradient-to-br from-fuchsia-500 to-purple-600 shadow-md shadow-fuchsia-500/25" : "text-slate-400 dark:text-slate-500 group-active:bg-slate-100 dark:group-active:bg-slate-800");
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.panel.isOpen() ? "text-white -translate-y-0.5" : "");
    i0.ɵɵclassProp("bell-gentle-swing", ctx_r1.unreadCount() > 0 && !ctx_r1.panel.isOpen());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.unreadCount() > 0 ? 3 : -1);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.panel.isOpen() ? "text-fuchsia-600 dark:text-fuchsia-400" : "text-slate-400 dark:text-slate-500");
} }
function NotificationBellComponent_Conditional_1_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 13);
    i0.ɵɵelement(1, "span", 9);
    i0.ɵɵelementStart(2, "span", 14);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.hasActionableUnread() ? "bg-amber-400" : "bg-red-400");
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.panel.isOpen() ? "border-fuchsia-500" : "border-white dark:border-slate-900");
    i0.ɵɵproperty("ngClass", ctx_r1.hasActionableUnread() ? "bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-500/40" : "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/40");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.unreadCount() > 9 ? "9+" : ctx_r1.unreadCount(), " ");
} }
function NotificationBellComponent_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 11);
    i0.ɵɵlistener("click", function NotificationBellComponent_Conditional_1_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onToggle($event)); });
    i0.ɵɵelement(1, "i", 12);
    i0.ɵɵtemplate(2, NotificationBellComponent_Conditional_1_Conditional_2_Template, 4, 6, "span", 13);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("title", ctx_r1.unreadCount() > 0 ? ctx_r1.unreadCount() + " th\u00F4ng b\u00E1o ch\u01B0a \u0111\u1ECDc" : "Th\u00F4ng b\u00E1o")("ngClass", ctx_r1.panel.isOpen() ? "bell-btn--active" : "bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60\n             text-slate-500 dark:text-slate-400 shadow-sm\n             hover:text-fuchsia-500 dark:hover:text-fuchsia-400\n             hover:border-fuchsia-300 dark:hover:border-fuchsia-700\n             hover:shadow-md hover:shadow-fuchsia-500/5");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("text-white", ctx_r1.panel.isOpen())("bell-gentle-swing", ctx_r1.unreadCount() > 0 && !ctx_r1.panel.isOpen());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.unreadCount() > 0 ? 2 : -1);
} }
function NotificationBellComponent_Conditional_2_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 17);
    i0.ɵɵelementStart(1, "span", 18);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵclassMap(ctx_r1.hasActionableUnread() ? "bg-amber-400" : "bg-rose-500");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ctx_r1.hasActionableUnread() ? "bg-gradient-to-br from-amber-500 to-orange-500" : "bg-gradient-to-br from-red-500 to-rose-600");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.unreadCount() > 9 ? "9+" : ctx_r1.unreadCount(), " ");
} }
function NotificationBellComponent_Conditional_2_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 16);
} }
function NotificationBellComponent_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 15);
    i0.ɵɵlistener("click", function NotificationBellComponent_Conditional_2_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onToggle($event)); });
    i0.ɵɵtemplate(1, NotificationBellComponent_Conditional_2_Conditional_1_Template, 3, 4)(2, NotificationBellComponent_Conditional_2_Conditional_2_Template, 1, 0, "i", 16);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("title", ctx_r1.unreadCount() > 0 ? ctx_r1.unreadCount() + " th\u00F4ng b\u00E1o ch\u01B0a \u0111\u1ECDc" : "Th\u00F4ng b\u00E1o")("ngClass", ctx_r1.unreadCount() > 0 ? ctx_r1.hasActionableUnread() ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-amber-500/40" : "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-red-500/40" : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.unreadCount() > 0 ? 1 : 2);
} }
function NotificationBellComponent_Conditional_3_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 20);
} }
function NotificationBellComponent_Conditional_3_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 22);
    i0.ɵɵelement(1, "span", 9);
    i0.ɵɵelementStart(2, "span", 23);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.hasActionableUnread() ? "bg-amber-400" : "bg-red-400");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ctx_r1.hasActionableUnread() ? "bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-500/40" : "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/40");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.unreadCount() > 9 ? "9+" : ctx_r1.unreadCount(), " ");
} }
function NotificationBellComponent_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 19);
    i0.ɵɵlistener("click", function NotificationBellComponent_Conditional_3_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onToggle($event)); });
    i0.ɵɵtemplate(1, NotificationBellComponent_Conditional_3_Conditional_1_Template, 1, 0, "span", 20);
    i0.ɵɵelement(2, "i", 21);
    i0.ɵɵtemplate(3, NotificationBellComponent_Conditional_3_Conditional_3_Template, 4, 4, "span", 22);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("bell-btn--active", ctx_r1.panel.isOpen())("bell-btn--idle", !ctx_r1.panel.isOpen());
    i0.ɵɵproperty("title", ctx_r1.unreadCount() > 0 ? ctx_r1.unreadCount() + " th\u00F4ng b\u00E1o ch\u01B0a \u0111\u1ECDc" : "Th\u00F4ng b\u00E1o");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.panel.isOpen() ? 1 : -1);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r1.panel.isOpen() ? "text-white -translate-y-px" : "text-slate-500 dark:text-slate-400");
    i0.ɵɵclassProp("bell-gentle-swing", ctx_r1.unreadCount() > 0 && !ctx_r1.panel.isOpen());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.unreadCount() > 0 ? 3 : -1);
} }
/**
 * NotificationBellComponent
 *
 * Trigger button cho Notification Panel.
 *
 * Modes:
 *  - asBadge:       Badge nhỏ gắn góc trên Avatar (Sidebar footer) — [Xác nhận giữ nguyên]
 *  - bottomNavMode: Tab thông báo trên thanh di động (Mobile Bottom Nav)
 *  - headerMode:    Nút action trên Header desktop
 *  - Default:       Nút vuông độc lập bo góc
 */
export class NotificationBellComponent {
    constructor() {
        this.asBadge = false;
        this.bottomNavMode = false;
        this.headerMode = false;
        this.panel = inject(NotificationPanelService);
        this.notifications = inject(NotificationService);
        this.unreadCount = this.notifications.unreadCount;
        this.hasActionableUnread = computed(() => this.notifications.notifications()
            .some(n => !n.isRead && (n.type === 'COA_REQUEST' || n.type === 'BORROW_REQUEST')));
    }
    /** stopPropagation ngăn click bubble lên parent (sidebar toggleProfileMenu) */
    onToggle(event) {
        event.stopPropagation();
        this.panel.toggle();
    }
    static { this.ɵfac = function NotificationBellComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || NotificationBellComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: NotificationBellComponent, selectors: [["app-notification-bell"]], hostBindings: function NotificationBellComponent_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("click", function NotificationBellComponent_click_HostBindingHandler($event) { return $event.stopPropagation(); });
        } }, inputs: { asBadge: "asBadge", bottomNavMode: "bottomNavMode", headerMode: "headerMode" }, decls: 4, vars: 1, consts: [["id", "notif-bell-mobile", 1, "flex", "flex-col", "items-center", "justify-center", "min-w-[56px]", "py-2", "gap-1", "group", "active:scale-90", "transition-transform", "select-none", 3, "title"], ["id", "notif-bell-header", 1, "relative", "w-9", "h-9", "rounded-xl", "flex", "items-center", "justify-center", "transition-all", "duration-200", "active:scale-95", "select-none", 3, "title", "ngClass"], ["id", "notif-bell-badge", 1, "relative", "flex", "h-5", "w-5", "items-center", "justify-center", "rounded-full", "border-2", "border-white", "dark:border-slate-900", "shadow-md", "transition-all", "hover:scale-115", "active:scale-90", "z-10", "select-none", "cursor-pointer", 3, "title", "ngClass"], ["id", "notif-bell-default", 1, "bell-btn", "relative", "w-10", "h-10", "flex", "items-center", "justify-center", "rounded-2xl", "transition-all", "duration-200", "active:scale-95", "overflow-visible", "select-none", 3, "title", "bell-btn--active", "bell-btn--idle"], ["id", "notif-bell-mobile", 1, "flex", "flex-col", "items-center", "justify-center", "min-w-[56px]", "py-2", "gap-1", "group", "active:scale-90", "transition-transform", "select-none", 3, "click", "title"], [1, "relative", "w-10", "h-10", "rounded-xl", "flex", "items-center", "justify-center", "transition-all", "duration-200"], [1, "fa-solid", "fa-bell", "text-base", "transition-all", "duration-200"], [1, "absolute", "-top-0.5", "-right-0.5", "flex", "h-4", "w-4", "items-center", "justify-center"], [1, "text-[9.5px]", "font-bold", "transition-all", "duration-200"], [1, "bell-soft-pulse", "absolute", "inline-flex", "h-full", "w-full", "rounded-full", "opacity-65"], [1, "relative", "inline-flex", "rounded-full", "h-4", "w-4", "text-white", "text-[8.5px]", "font-extrabold", "items-center", "justify-center", "border-2", 3, "ngClass"], ["id", "notif-bell-header", 1, "relative", "w-9", "h-9", "rounded-xl", "flex", "items-center", "justify-center", "transition-all", "duration-200", "active:scale-95", "select-none", 3, "click", "title", "ngClass"], [1, "fa-solid", "fa-bell", "text-sm", "relative", "z-10", "transition-all", "duration-200"], [1, "absolute", "-top-1", "-right-1", "flex", "h-4", "w-4", "items-center", "justify-center", "z-20"], [1, "relative", "inline-flex", "rounded-full", "h-4", "w-4", "text-white", "text-[8px]", "font-black", "items-center", "justify-center", "border-2", "shadow-sm", 3, "ngClass"], ["id", "notif-bell-badge", 1, "relative", "flex", "h-5", "w-5", "items-center", "justify-center", "rounded-full", "border-2", "border-white", "dark:border-slate-900", "shadow-md", "transition-all", "hover:scale-115", "active:scale-90", "z-10", "select-none", "cursor-pointer", 3, "click", "title", "ngClass"], [1, "fa-solid", "fa-bell", "text-[8.5px]"], [1, "bell-soft-pulse", "absolute", "-inset-0.5", "rounded-full", "opacity-70"], [1, "relative", "inline-flex", "rounded-full", "h-full", "w-full", "text-white", "text-[8.5px]", "font-black", "items-center", "justify-center", 3, "ngClass"], ["id", "notif-bell-default", 1, "bell-btn", "relative", "w-10", "h-10", "flex", "items-center", "justify-center", "rounded-2xl", "transition-all", "duration-200", "active:scale-95", "overflow-visible", "select-none", 3, "click", "title"], [1, "bell-glow-ring"], [1, "fa-solid", "fa-bell", "text-[17px]", "relative", "z-10", "transition-all", "duration-200"], [1, "absolute", "-top-1", "-right-1", "flex", "h-[18px]", "w-[18px]", "items-center", "justify-center", "z-20"], [1, "relative", "inline-flex", "rounded-full", "h-[18px]", "w-[18px]", "text-white", "text-[9px]", "font-black", "items-center", "justify-center", "border-2", "border-white", "dark:border-slate-900", "shadow-sm", 3, "ngClass"]], template: function NotificationBellComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, NotificationBellComponent_Conditional_0_Template, 6, 10, "button", 0)(1, NotificationBellComponent_Conditional_1_Template, 3, 7, "button", 1)(2, NotificationBellComponent_Conditional_2_Template, 3, 3, "button", 2)(3, NotificationBellComponent_Conditional_3_Template, 4, 11, "button", 3);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.bottomNavMode ? 0 : ctx.headerMode ? 1 : ctx.asBadge ? 2 : 3);
        } }, dependencies: [CommonModule, i1.NgClass], styles: ["\n\n    .bell-btn--idle[_ngcontent-%COMP%] {\n      background: white;\n      border: 1px solid #e2e8f0;\n      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);\n    }\n\n    .dark[_nghost-%COMP%]   .bell-btn--idle[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .bell-btn--idle[_ngcontent-%COMP%] {\n      background: #1e293b;\n      border-color: #334155;\n      box-shadow: none;\n    }\n\n    .bell-btn--idle[_ngcontent-%COMP%]:hover {\n      background: #f8fafc;\n      border-color: #f0abfc;\n      box-shadow: 0 4px 14px rgba(217, 70, 239, 0.15);\n    }\n\n    .dark[_nghost-%COMP%]   .bell-btn--idle[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .bell-btn--idle[_ngcontent-%COMP%]:hover {\n      background: #283548;\n      border-color: #8b5cf6;\n    }\n\n    \n\n    .bell-btn--active[_ngcontent-%COMP%] {\n      background: linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%);\n      border: 1px solid transparent;\n      box-shadow:\n        0 4px 16px rgba(217, 70, 239, 0.4),\n        0 0 0 3px rgba(217, 70, 239, 0.15);\n    }\n\n    .dark[_nghost-%COMP%]   .bell-btn--active[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .bell-btn--active[_ngcontent-%COMP%] {\n      box-shadow:\n        0 4px 16px rgba(217, 70, 239, 0.35),\n        0 0 0 3px rgba(217, 70, 239, 0.2);\n    }\n\n    \n\n    .bell-glow-ring[_ngcontent-%COMP%] {\n      position: absolute;\n      inset: -4px;\n      border-radius: 18px;\n      border: 2px solid rgba(217, 70, 239, 0.4);\n      animation: _ngcontent-%COMP%_bellRingPulse 2s cubic-bezier(0.16, 1, 0.3, 1) infinite;\n      pointer-events: none;\n    }\n\n    \n\n    .bell-soft-pulse[_ngcontent-%COMP%] {\n      animation: _ngcontent-%COMP%_bellSoftPulse 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;\n    }\n\n    \n\n    .bell-gentle-swing[_ngcontent-%COMP%] {\n      animation: _ngcontent-%COMP%_bellGentleSwing 2.5s ease-in-out infinite;\n      transform-origin: top center;\n    }\n\n    @keyframes _ngcontent-%COMP%_bellRingPulse {\n      0%, 100% { opacity: 0.4; transform: scale(1); }\n      50%       { opacity: 0.9; transform: scale(1.05); }\n    }\n\n    @keyframes _ngcontent-%COMP%_bellSoftPulse {\n      0%, 100% { opacity: 0.3; transform: scale(1); }\n      50%       { opacity: 0.75; transform: scale(1.25); }\n    }\n\n    @keyframes _ngcontent-%COMP%_bellGentleSwing {\n      0%, 70%, 100% { transform: rotate(0deg); }\n      75%           { transform: rotate(10deg); }\n      80%           { transform: rotate(-8deg); }\n      85%           { transform: rotate(6deg); }\n      90%           { transform: rotate(-4deg); }\n      95%           { transform: rotate(2deg); }\n    }\n\n    \n\n    html.performance-lite[_nghost-%COMP%]   .bell-glow-ring[_ngcontent-%COMP%], html.performance-lite   [_nghost-%COMP%]   .bell-glow-ring[_ngcontent-%COMP%], \n   html.performance-lite[_nghost-%COMP%]   .bell-soft-pulse[_ngcontent-%COMP%], html.performance-lite   [_nghost-%COMP%]   .bell-soft-pulse[_ngcontent-%COMP%], \n   html.performance-lite[_nghost-%COMP%]   .bell-gentle-swing[_ngcontent-%COMP%], html.performance-lite   [_nghost-%COMP%]   .bell-gentle-swing[_ngcontent-%COMP%] {\n      animation: none !important;\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NotificationBellComponent, [{
        type: Component,
        args: [{ selector: 'app-notification-bell', standalone: true, imports: [CommonModule], host: {
                    '(click)': '$event.stopPropagation()'
                }, template: `
    @if (bottomNavMode) {

      <!-- ════ BOTTOM NAV TAB (Mobile) ════ -->
      <button
        id="notif-bell-mobile"
        (click)="onToggle($event)"
        [title]="unreadCount() > 0 ? unreadCount() + ' thông báo chưa đọc' : 'Thông báo'"
        class="flex flex-col items-center justify-center min-w-[56px] py-2 gap-1 group active:scale-90 transition-transform select-none">

        <div class="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
             [class]="panel.isOpen()
               ? 'bg-gradient-to-br from-fuchsia-500 to-purple-600 shadow-md shadow-fuchsia-500/25'
               : 'text-slate-400 dark:text-slate-500 group-active:bg-slate-100 dark:group-active:bg-slate-800'">
          <i class="fa-solid fa-bell text-base transition-all duration-200"
             [class]="panel.isOpen() ? 'text-white -translate-y-0.5' : ''"
             [class.bell-gentle-swing]="unreadCount() > 0 && !panel.isOpen()"></i>

          @if (unreadCount() > 0) {
            <span class="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center">
              <span class="bell-soft-pulse absolute inline-flex h-full w-full rounded-full opacity-65"
                    [class]="hasActionableUnread() ? 'bg-amber-400' : 'bg-red-400'"></span>
              <span class="relative inline-flex rounded-full h-4 w-4 text-white text-[8.5px] font-extrabold items-center justify-center border-2"
                    [class]="panel.isOpen() ? 'border-fuchsia-500' : 'border-white dark:border-slate-900'"
                    [ngClass]="hasActionableUnread() ? 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-sm shadow-amber-500/40' : 'bg-gradient-to-br from-red-500 to-rose-600 shadow-sm shadow-red-500/40'">
                {{ unreadCount() > 9 ? '9+' : unreadCount() }}
              </span>
            </span>
          }
        </div>

        <span class="text-[9.5px] font-bold transition-all duration-200"
              [class]="panel.isOpen() ? 'text-fuchsia-600 dark:text-fuchsia-400' : 'text-slate-400 dark:text-slate-500'">
          Thông Báo
        </span>
      </button>

    } @else if (headerMode) {

      <!-- ════ HEADER ACTION BUTTON (Desktop) ════ -->
      <button
        id="notif-bell-header"
        (click)="onToggle($event)"
        [title]="unreadCount() > 0 ? unreadCount() + ' thông báo chưa đọc' : 'Thông báo'"
        class="relative w-9 h-9 rounded-xl flex items-center justify-center
               transition-all duration-200 active:scale-95 select-none"
        [ngClass]="panel.isOpen()
          ? 'bell-btn--active'
          : 'bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60
             text-slate-500 dark:text-slate-400 shadow-sm
             hover:text-fuchsia-500 dark:hover:text-fuchsia-400
             hover:border-fuchsia-300 dark:hover:border-fuchsia-700
             hover:shadow-md hover:shadow-fuchsia-500/5'">

        <i class="fa-solid fa-bell text-sm relative z-10 transition-all duration-200"
           [class.text-white]="panel.isOpen()"
           [class.bell-gentle-swing]="unreadCount() > 0 && !panel.isOpen()"></i>

        @if (unreadCount() > 0) {
          <span class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center z-20">
            <span class="bell-soft-pulse absolute inline-flex h-full w-full rounded-full opacity-65"
                  [class]="hasActionableUnread() ? 'bg-amber-400' : 'bg-red-400'"></span>
            <span class="relative inline-flex rounded-full h-4 w-4 text-white text-[8px] font-black
                         items-center justify-center border-2 shadow-sm"
                  [class]="panel.isOpen()
                    ? 'border-fuchsia-500'
                    : 'border-white dark:border-slate-900'"
                  [ngClass]="hasActionableUnread()
                    ? 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-500/40'
                    : 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/40'">
              {{ unreadCount() > 9 ? '9+' : unreadCount() }}
            </span>
          </span>
        }
      </button>

    } @else if (asBadge) {

      <!-- ════ BADGE ON AVATAR (Sidebar Footer) ════ -->
      <button
        id="notif-bell-badge"
        (click)="onToggle($event)"
        [title]="unreadCount() > 0 ? unreadCount() + ' thông báo chưa đọc' : 'Thông báo'"
        class="relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-white dark:border-slate-900 shadow-md transition-all hover:scale-115 active:scale-90 z-10 select-none cursor-pointer"
        [ngClass]="unreadCount() > 0
          ? (hasActionableUnread()
              ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-amber-500/40'
              : 'bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-red-500/40')
          : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'">

        @if (unreadCount() > 0) {
          <!-- Soft ambient glow ring -->
          <span class="bell-soft-pulse absolute -inset-0.5 rounded-full opacity-70"
                [class]="hasActionableUnread() ? 'bg-amber-400' : 'bg-rose-500'"></span>
          <span class="relative inline-flex rounded-full h-full w-full text-white text-[8.5px] font-black items-center justify-center"
                [ngClass]="hasActionableUnread() ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-gradient-to-br from-red-500 to-rose-600'">
            {{ unreadCount() > 9 ? '9+' : unreadCount() }}
          </span>
        } @else {
          <i class="fa-solid fa-bell text-[8.5px]"></i>
        }
      </button>

    } @else {

      <!-- ════ DEFAULT: STANDALONE BUTTON ════ -->
      <button
        id="notif-bell-default"
        (click)="onToggle($event)"
        [title]="unreadCount() > 0 ? unreadCount() + ' thông báo chưa đọc' : 'Thông báo'"
        class="bell-btn relative w-10 h-10 flex items-center justify-center rounded-2xl transition-all duration-200 active:scale-95 overflow-visible select-none"
        [class.bell-btn--active]="panel.isOpen()"
        [class.bell-btn--idle]="!panel.isOpen()">

        <!-- Glow ring khi panel dang mo -->
        @if (panel.isOpen()) {
          <span class="bell-glow-ring"></span>
        }

        <!-- Bell icon với 1-swing animation nhe -->
        <i class="fa-solid fa-bell text-[17px] relative z-10 transition-all duration-200"
           [class]="panel.isOpen() ? 'text-white -translate-y-px' : 'text-slate-500 dark:text-slate-400'"
           [class.bell-gentle-swing]="unreadCount() > 0 && !panel.isOpen()"></i>

        <!-- Unread badge -->
        @if (unreadCount() > 0) {
          <span class="absolute -top-1 -right-1 flex h-[18px] w-[18px] items-center justify-center z-20">
            <span class="bell-soft-pulse absolute inline-flex h-full w-full rounded-full opacity-65"
                  [class]="hasActionableUnread() ? 'bg-amber-400' : 'bg-red-400'"></span>
            <span class="relative inline-flex rounded-full h-[18px] w-[18px] text-white text-[9px] font-black items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm"
                  [ngClass]="hasActionableUnread()
                    ? 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-500/40'
                    : 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/40'">
              {{ unreadCount() > 9 ? '9+' : unreadCount() }}
            </span>
          </span>
        }
      </button>
    }
  `, styles: ["\n    /* \u2500\u2500 Default button: idle \u2500\u2500 */\n    .bell-btn--idle {\n      background: white;\n      border: 1px solid #e2e8f0;\n      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);\n    }\n\n    :host-context(.dark) .bell-btn--idle {\n      background: #1e293b;\n      border-color: #334155;\n      box-shadow: none;\n    }\n\n    .bell-btn--idle:hover {\n      background: #f8fafc;\n      border-color: #f0abfc;\n      box-shadow: 0 4px 14px rgba(217, 70, 239, 0.15);\n    }\n\n    :host-context(.dark) .bell-btn--idle:hover {\n      background: #283548;\n      border-color: #8b5cf6;\n    }\n\n    /* \u2500\u2500 Default button: active (panel open) \u2500\u2500 */\n    .bell-btn--active {\n      background: linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%);\n      border: 1px solid transparent;\n      box-shadow:\n        0 4px 16px rgba(217, 70, 239, 0.4),\n        0 0 0 3px rgba(217, 70, 239, 0.15);\n    }\n\n    :host-context(.dark) .bell-btn--active {\n      box-shadow:\n        0 4px 16px rgba(217, 70, 239, 0.35),\n        0 0 0 3px rgba(217, 70, 239, 0.2);\n    }\n\n    /* \u2500\u2500 Glow ring pulse khi active \u2500\u2500 */\n    .bell-glow-ring {\n      position: absolute;\n      inset: -4px;\n      border-radius: 18px;\n      border: 2px solid rgba(217, 70, 239, 0.4);\n      animation: bellRingPulse 2s cubic-bezier(0.16, 1, 0.3, 1) infinite;\n      pointer-events: none;\n    }\n\n    /* \u2500\u2500 Ambient Soft Pulse cho badge \u2500\u2500 */\n    .bell-soft-pulse {\n      animation: bellSoftPulse 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;\n    }\n\n    /* \u2500\u2500 Gentle Swing (chao nh\u1EB9 1 nh\u1ECBp t\u1EF1 nhi\u00EAn) \u2500\u2500 */\n    .bell-gentle-swing {\n      animation: bellGentleSwing 2.5s ease-in-out infinite;\n      transform-origin: top center;\n    }\n\n    @keyframes bellRingPulse {\n      0%, 100% { opacity: 0.4; transform: scale(1); }\n      50%       { opacity: 0.9; transform: scale(1.05); }\n    }\n\n    @keyframes bellSoftPulse {\n      0%, 100% { opacity: 0.3; transform: scale(1); }\n      50%       { opacity: 0.75; transform: scale(1.25); }\n    }\n\n    @keyframes bellGentleSwing {\n      0%, 70%, 100% { transform: rotate(0deg); }\n      75%           { transform: rotate(10deg); }\n      80%           { transform: rotate(-8deg); }\n      85%           { transform: rotate(6deg); }\n      90%           { transform: rotate(-4deg); }\n      95%           { transform: rotate(2deg); }\n    }\n\n    /* Performance Lite override */\n    :host-context(html.performance-lite) .bell-glow-ring,\n    :host-context(html.performance-lite) .bell-soft-pulse,\n    :host-context(html.performance-lite) .bell-gentle-swing {\n      animation: none !important;\n    }\n  "] }]
    }], null, { asBadge: [{
            type: Input
        }], bottomNavMode: [{
            type: Input
        }], headerMode: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(NotificationBellComponent, { className: "NotificationBellComponent", filePath: "src/app/shared/components/notification-bell/notification-bell.component.ts", lineNumber: 252 }); })();
//# sourceMappingURL=notification-bell.component.js.map