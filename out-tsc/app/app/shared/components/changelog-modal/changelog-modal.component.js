import { Component, inject, computed, signal, HostListener, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChangelogService } from '../../../core/services/changelog.service';
import { StateService } from '../../../core/services/state.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _c0 = () => [1, 2, 3];
const _forTrack0 = ($index, $item) => $item.version;
function ChangelogModalComponent_Conditional_0_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 26);
    i0.ɵɵlistener("click", function ChangelogModalComponent_Conditional_0_Conditional_20_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.searchQuery.set("")); });
    i0.ɵɵelement(1, "i", 27);
    i0.ɵɵelementEnd();
} }
function ChangelogModalComponent_Conditional_0_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 19);
    i0.ɵɵtext(1, " Top 3 b\u1EA3n m\u1EDBi nh\u1EA5t ");
    i0.ɵɵelementEnd();
} }
function ChangelogModalComponent_Conditional_0_Conditional_23_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 28);
    i0.ɵɵelement(1, "div", 29)(2, "div", 30)(3, "div", 31)(4, "div", 32);
    i0.ɵɵelementEnd();
} }
function ChangelogModalComponent_Conditional_0_Conditional_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 21);
    i0.ɵɵrepeaterCreate(1, ChangelogModalComponent_Conditional_0_Conditional_23_For_2_Template, 5, 0, "div", 28, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵrepeater(i0.ɵɵpureFunction0(0, _c0));
} }
function ChangelogModalComponent_Conditional_0_Conditional_24_For_2_Conditional_11_For_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li", 46);
    i0.ɵɵelement(1, "i", 47);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const hl_r4 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(hl_r4);
} }
function ChangelogModalComponent_Conditional_0_Conditional_24_For_2_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 43)(1, "ul", 45);
    i0.ɵɵrepeaterCreate(2, ChangelogModalComponent_Conditional_0_Conditional_24_For_2_Conditional_11_For_3_Template, 4, 1, "li", 46, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r5 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(item_r5.highlights);
} }
function ChangelogModalComponent_Conditional_0_Conditional_24_For_2_Conditional_12_For_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const f_r6 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(f_r6);
} }
function ChangelogModalComponent_Conditional_0_Conditional_24_For_2_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 44)(1, "span", 48);
    i0.ɵɵtext(2, "\uD83D\uDE80 T\u00EDnh N\u0103ng M\u1EDBi");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "ul", 49);
    i0.ɵɵrepeaterCreate(4, ChangelogModalComponent_Conditional_0_Conditional_24_For_2_Conditional_12_For_5_Template, 2, 1, "li", null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r5 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(item_r5.features);
} }
function ChangelogModalComponent_Conditional_0_Conditional_24_For_2_Conditional_13_For_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const imp_r7 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(imp_r7);
} }
function ChangelogModalComponent_Conditional_0_Conditional_24_For_2_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 44)(1, "span", 50);
    i0.ɵɵtext(2, "\u26A1 T\u1ED1i \u01AFu & C\u1EA3i Ti\u1EBFn");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "ul", 49);
    i0.ɵɵrepeaterCreate(4, ChangelogModalComponent_Conditional_0_Conditional_24_For_2_Conditional_13_For_5_Template, 2, 1, "li", null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r5 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(item_r5.improvements);
} }
function ChangelogModalComponent_Conditional_0_Conditional_24_For_2_Conditional_14_For_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const fix_r8 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(fix_r8);
} }
function ChangelogModalComponent_Conditional_0_Conditional_24_For_2_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 44)(1, "span", 51);
    i0.ɵɵtext(2, "\uD83D\uDC1B S\u1EEDa L\u1ED7i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "ul", 49);
    i0.ɵɵrepeaterCreate(4, ChangelogModalComponent_Conditional_0_Conditional_24_For_2_Conditional_14_For_5_Template, 2, 1, "li", null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r5 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(item_r5.fixes);
} }
function ChangelogModalComponent_Conditional_0_Conditional_24_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "article", 34);
    i0.ɵɵelement(1, "div", 36);
    i0.ɵɵelementStart(2, "div", 37)(3, "div", 38)(4, "span", 39);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "span", 40);
    i0.ɵɵelement(7, "i", 41);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(9, "h4", 42);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(11, ChangelogModalComponent_Conditional_0_Conditional_24_For_2_Conditional_11_Template, 4, 0, "div", 43)(12, ChangelogModalComponent_Conditional_0_Conditional_24_For_2_Conditional_12_Template, 6, 0, "div", 44)(13, ChangelogModalComponent_Conditional_0_Conditional_24_For_2_Conditional_13_Template, 6, 0, "div", 44)(14, ChangelogModalComponent_Conditional_0_Conditional_24_For_2_Conditional_14_Template, 6, 0, "div", 44);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r5 = ctx.$implicit;
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", item_r5.version, " ");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r5.date);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r5.title);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r5.highlights && item_r5.highlights.length > 0 ? 11 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r5.features && item_r5.features.length > 0 ? 12 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r5.improvements && item_r5.improvements.length > 0 ? 13 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r5.fixes && item_r5.fixes.length > 0 ? 14 : -1);
} }
function ChangelogModalComponent_Conditional_0_Conditional_24_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 35);
    i0.ɵɵelement(1, "i", 52);
    i0.ɵɵelementStart(2, "p", 53);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("Kh\u00F4ng t\u00ECm th\u1EA5y b\u1EA3n ghi ph\u00F9 h\u1EE3p t\u1EEB kh\u00F3a \"", ctx_r1.searchQuery(), "\"");
} }
function ChangelogModalComponent_Conditional_0_Conditional_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 33);
    i0.ɵɵrepeaterCreate(1, ChangelogModalComponent_Conditional_0_Conditional_24_For_2_Template, 15, 7, "article", 34, _forTrack0);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(3, ChangelogModalComponent_Conditional_0_Conditional_24_Conditional_3_Template, 4, 1, "div", 35);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.filteredList());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.filteredList().length === 0 ? 3 : -1);
} }
function ChangelogModalComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 1);
    i0.ɵɵlistener("click", function ChangelogModalComponent_Conditional_0_Template_div_click_0_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onBackdropClick($event)); });
    i0.ɵɵelementStart(1, "div", 2);
    i0.ɵɵlistener("click", function ChangelogModalComponent_Conditional_0_Template_div_click_1_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementStart(2, "div", 3)(3, "div", 4)(4, "div", 5);
    i0.ɵɵelement(5, "i", 6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 7)(7, "div", 8)(8, "h3", 9);
    i0.ɵɵtext(9, "Nh\u1EADt K\u00FD C\u1EADp Nh\u1EADt");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "span", 10);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "p", 11);
    i0.ɵɵtext(13, "L\u1ECBch s\u1EED n\u00E2ng c\u1EA5p & c\u1EA3i ti\u1EBFn h\u1EC7 th\u1ED1ng LIMS Cloud");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(14, "button", 12);
    i0.ɵɵlistener("click", function ChangelogModalComponent_Conditional_0_Template_button_click_14_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.changelogService.close()); });
    i0.ɵɵelement(15, "i", 13);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "div", 14)(17, "div", 15);
    i0.ɵɵelement(18, "i", 16);
    i0.ɵɵelementStart(19, "input", 17);
    i0.ɵɵtwoWayListener("ngModelChange", function ChangelogModalComponent_Conditional_0_Template_input_ngModelChange_19_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.searchQuery, $event) || (ctx_r1.searchQuery = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(20, ChangelogModalComponent_Conditional_0_Conditional_20_Template, 2, 0, "button", 18);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(21, ChangelogModalComponent_Conditional_0_Conditional_21_Template, 2, 0, "span", 19);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "div", 20);
    i0.ɵɵtemplate(23, ChangelogModalComponent_Conditional_0_Conditional_23_Template, 3, 1, "div", 21)(24, ChangelogModalComponent_Conditional_0_Conditional_24_Template, 4, 1);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "div", 22)(26, "button", 23);
    i0.ɵɵlistener("click", function ChangelogModalComponent_Conditional_0_Template_button_click_26_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.navigateToFullChangelog()); });
    i0.ɵɵelement(27, "i", 24);
    i0.ɵɵtext(28, " Xem To\u00E0n B\u1ED9 L\u1ECBch S\u1EED ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "button", 25);
    i0.ɵɵlistener("click", function ChangelogModalComponent_Conditional_0_Template_button_click_29_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.changelogService.close()); });
    i0.ɵɵtext(30, " \u0110\u00F3ng ");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(11);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.state.systemVersion(), " ");
    i0.ɵɵadvance(8);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.searchQuery);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.searchQuery() ? 20 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(!ctx_r1.searchQuery() ? 21 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.changelogService.loading() ? 23 : 24);
} }
export class ChangelogModalComponent {
    constructor() {
        this.changelogService = inject(ChangelogService);
        this.state = inject(StateService);
        this.router = inject(Router);
        this.searchQuery = signal('');
        this.filteredList = computed(() => {
            const q = this.searchQuery().toLowerCase().trim();
            const releases = this.changelogService.latestReleases();
            if (!q)
                return releases;
            return releases.filter(item => item.version.toLowerCase().includes(q) ||
                item.title.toLowerCase().includes(q) ||
                (item.highlights && item.highlights.some(h => h.toLowerCase().includes(q))) ||
                (item.features && item.features.some(f => f.toLowerCase().includes(q))) ||
                (item.improvements && item.improvements.some(imp => imp.toLowerCase().includes(q))) ||
                (item.fixes && item.fixes.some(fx => fx.toLowerCase().includes(q))));
        });
        effect(() => {
            if (this.changelogService.isOpen()) {
                void this.changelogService.loadLatest();
            }
        });
    }
    onEscKey() {
        if (this.changelogService.isOpen()) {
            this.changelogService.close();
        }
    }
    onBackdropClick(event) {
        this.changelogService.close();
    }
    navigateToFullChangelog() {
        this.changelogService.close();
        this.router.navigate(['/changelog']);
    }
    static { this.ɵfac = function ChangelogModalComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ChangelogModalComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ChangelogModalComponent, selectors: [["app-changelog-modal"]], hostBindings: function ChangelogModalComponent_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("keydown.escape", function ChangelogModalComponent_keydown_escape_HostBindingHandler() { return ctx.onEscKey(); }, false, i0.ɵɵresolveDocument);
        } }, decls: 1, vars: 1, consts: [[1, "fixed", "inset-0", "z-[9999]", "flex", "items-center", "justify-center", "p-4", "sm:p-6", "bg-slate-900/60", "backdrop-blur-sm", "animate-fade-in", "no-print", "cursor-pointer"], [1, "fixed", "inset-0", "z-[9999]", "flex", "items-center", "justify-center", "p-4", "sm:p-6", "bg-slate-900/60", "backdrop-blur-sm", "animate-fade-in", "no-print", "cursor-pointer", 3, "click"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "sm:rounded-3xl", "shadow-2xl", "border", "border-slate-200", "dark:border-slate-800", "w-full", "max-w-2xl", "overflow-hidden", "flex", "flex-col", "max-h-[90dvh]", "sm:max-h-[85vh]", "animate-bounce-in", "cursor-default", 3, "click"], [1, "px-4", "sm:px-6", "py-4", "sm:py-5", "border-b", "border-slate-100", "dark:border-slate-800", "flex", "justify-between", "items-start", "sm:items-center", "gap-3", "bg-gradient-to-r", "from-blue-50/80", "via-indigo-50/50", "to-purple-50/50", "dark:from-slate-850", "dark:to-slate-900"], [1, "flex", "items-start", "sm:items-center", "gap-3", "min-w-0"], [1, "w-10", "h-10", "rounded-2xl", "bg-blue-600", "text-white", "flex", "items-center", "justify-center", "font-black", "shadow-md", "shadow-blue-500/20", "shrink-0"], [1, "fa-solid", "fa-scroll", "text-lg"], [1, "min-w-0"], [1, "flex", "flex-wrap", "items-center", "gap-2"], [1, "text-base", "sm:text-lg", "font-black", "text-slate-800", "dark:text-white", "tracking-tight", "leading-tight"], [1, "text-[10px]", "font-extrabold", "px-2", "py-0.5", "rounded-full", "bg-blue-100", "dark:bg-blue-950", "text-blue-700", "dark:text-blue-300", "border", "border-blue-200", "dark:border-blue-800"], [1, "text-xs", "font-semibold", "text-slate-500", "dark:text-slate-400", "mt-1"], ["title", "\u0110\u00F3ng (Esc)", 1, "w-9", "h-9", "flex", "items-center", "justify-center", "text-slate-400", "hover:text-slate-600", "dark:hover:text-slate-200", "hover:bg-slate-100", "dark:hover:bg-slate-800", "rounded-full", "transition", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-xmark", "text-base"], [1, "px-4", "sm:px-6", "py-3", "bg-slate-50/80", "dark:bg-slate-900/60", "border-b", "border-slate-100", "dark:border-slate-800/80", "flex", "items-center", "justify-between", "gap-2"], [1, "flex", "items-center", "gap-2", "flex-1"], [1, "fa-solid", "fa-magnifying-glass", "text-slate-400", "text-xs", "pl-1"], ["type", "text", "placeholder", "T\u00ECm ki\u1EBFm t\u00EDnh n\u0103ng, phi\u00EAn b\u1EA3n (v\u00ED d\u1EE5: b02, SmartBatch...)...", 1, "w-full", "bg-transparent", "text-xs", "font-semibold", "text-slate-700", "dark:text-slate-200", "placeholder-slate-400", "outline-none", 3, "ngModelChange", "ngModel"], [1, "text-xs", "text-slate-400", "hover:text-slate-600", "dark:hover:text-slate-300"], [1, "text-[10px]", "font-bold", "text-slate-400", "dark:text-slate-500", "shrink-0", "bg-slate-200/60", "dark:bg-slate-800", "px-2", "py-0.5", "rounded-md"], [1, "px-4", "sm:px-6", "py-5", "sm:py-6", "overflow-y-auto", "custom-scrollbar", "flex-1", "min-h-0"], ["aria-live", "polite", "aria-busy", "true", 1, "relative", "ml-2", "border-l-2", "border-blue-200", "dark:border-blue-900/60", "pl-5", "space-y-6", "animate-pulse"], [1, "px-4", "sm:px-6", "py-4", "border-t", "border-slate-100", "dark:border-slate-800", "bg-slate-50/80", "dark:bg-slate-900/80", "flex", "items-center", "justify-between", "gap-4"], [1, "text-xs", "font-extrabold", "text-blue-600", "dark:text-blue-400", "hover:text-blue-700", "dark:hover:text-blue-300", "flex", "items-center", "gap-1.5", "transition", 3, "click"], [1, "fa-solid", "fa-arrow-up-right-from-square"], [1, "px-5", "py-2", "bg-slate-800", "dark:bg-slate-700", "hover:bg-slate-900", "dark:hover:bg-slate-600", "text-white", "rounded-xl", "text-xs", "font-bold", "transition", "active:scale-95", "shadow-sm", 3, "click"], [1, "text-xs", "text-slate-400", "hover:text-slate-600", "dark:hover:text-slate-300", 3, "click"], [1, "fa-solid", "fa-circle-xmark"], [1, "relative", "space-y-3", "min-w-0"], [1, "absolute", "-left-[29px]", "top-0", "w-4", "h-4", "rounded-full", "bg-blue-200", "dark:bg-blue-900"], [1, "h-4", "w-28", "rounded", "bg-slate-200", "dark:bg-slate-800"], [1, "h-5", "w-3/4", "rounded", "bg-slate-200", "dark:bg-slate-800"], [1, "h-16", "w-full", "rounded-2xl", "bg-slate-100", "dark:bg-slate-800/70"], [1, "relative", "ml-2", "border-l-2", "border-blue-500/30", "dark:border-blue-500/20", "pl-5", "space-y-6"], [1, "relative", "min-w-0"], [1, "text-center", "py-10", "text-slate-400", "dark:text-slate-500"], [1, "absolute", "-left-[29px]", "top-0", "w-4", "h-4", "rounded-full", "bg-blue-600", "border-4", "border-white", "dark:border-slate-900", "shadow-sm"], [1, "flex", "items-center", "justify-between", "gap-2", "mb-2"], [1, "flex", "items-center", "gap-2"], [1, "text-xs", "font-black", "font-mono", "bg-blue-50", "dark:bg-blue-950/60", "text-blue-700", "dark:text-blue-300", "px-2", "py-0.5", "rounded-lg", "border", "border-blue-200", "dark:border-blue-800"], [1, "text-xs", "text-slate-400", "font-medium"], [1, "fa-regular", "fa-calendar-check", "mr-1"], [1, "text-sm", "font-extrabold", "text-slate-800", "dark:text-white", "mb-2", "leading-snug"], [1, "bg-slate-50", "dark:bg-slate-800/60", "p-3", "rounded-2xl", "border", "border-slate-100", "dark:border-slate-800", "mb-3"], [1, "mb-2"], [1, "space-y-1.5", "text-xs", "text-slate-600", "dark:text-slate-300", "font-medium"], [1, "flex", "items-start", "gap-2"], [1, "fa-solid", "fa-sparkles", "text-amber-500", "text-[10px]", "mt-1", "shrink-0"], [1, "text-[10px]", "font-bold", "text-emerald-600", "dark:text-emerald-400", "uppercase", "tracking-wider", "block", "mb-1"], [1, "list-disc", "pl-4", "space-y-1", "text-xs", "text-slate-600", "dark:text-slate-300"], [1, "text-[10px]", "font-bold", "text-blue-600", "dark:text-blue-400", "uppercase", "tracking-wider", "block", "mb-1"], [1, "text-[10px]", "font-bold", "text-rose-600", "dark:text-rose-400", "uppercase", "tracking-wider", "block", "mb-1"], [1, "fa-solid", "fa-scroll", "text-3xl", "mb-2", "opacity-50", "block"], [1, "text-xs", "font-semibold"]], template: function ChangelogModalComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, ChangelogModalComponent_Conditional_0_Template, 31, 5, "div", 0);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.changelogService.isOpen() ? 0 : -1);
        } }, dependencies: [CommonModule, FormsModule, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgModel], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ChangelogModalComponent, [{
        type: Component,
        args: [{
                selector: 'app-changelog-modal',
                standalone: true,
                imports: [CommonModule, FormsModule],
                template: `
    @if (changelogService.isOpen()) {
      <div (click)="onBackdropClick($event)" 
           class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in no-print cursor-pointer">
        
        <!-- Modal Card Container -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90dvh] sm:max-h-[85vh] animate-bounce-in cursor-default"
             (click)="$event.stopPropagation()">
          
          <!-- Modal Header -->
          <div class="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start sm:items-center gap-3 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-purple-50/50 dark:from-slate-850 dark:to-slate-900">
            <div class="flex items-start sm:items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20 shrink-0">
                <i class="fa-solid fa-scroll text-lg"></i>
              </div>
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="text-base sm:text-lg font-black text-slate-800 dark:text-white tracking-tight leading-tight">Nhật Ký Cập Nhật</h3>
                  <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {{ state.systemVersion() }}
                  </span>
                </div>
                <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Lịch sử nâng cấp & cải tiến hệ thống LIMS Cloud</p>
              </div>
            </div>
            
            <button (click)="changelogService.close()" 
                    title="Đóng (Esc)"
                    class="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition active:scale-95">
              <i class="fa-solid fa-xmark text-base"></i>
            </button>
          </div>

          <!-- Search / Filter Bar -->
          <div class="px-4 sm:px-6 py-3 bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 flex-1">
              <i class="fa-solid fa-magnifying-glass text-slate-400 text-xs pl-1"></i>
              <input type="text" [(ngModel)]="searchQuery" 
                     placeholder="Tìm kiếm tính năng, phiên bản (ví dụ: b02, SmartBatch...)..."
                     class="w-full bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-400 outline-none">
              @if (searchQuery()) {
                <button (click)="searchQuery.set('')" class="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <i class="fa-solid fa-circle-xmark"></i>
                </button>
              }
            </div>
            
            @if (!searchQuery()) {
              <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 shrink-0 bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                Top 3 bản mới nhất
              </span>
            }
          </div>

          <!-- Modal Body (Timeline List) -->
          <div class="px-4 sm:px-6 py-5 sm:py-6 overflow-y-auto custom-scrollbar flex-1 min-h-0">
            @if (changelogService.loading()) {
              <div class="relative ml-2 border-l-2 border-blue-200 dark:border-blue-900/60 pl-5 space-y-6 animate-pulse" aria-live="polite" aria-busy="true">
                @for (placeholder of [1, 2, 3]; track placeholder) {
                  <div class="relative space-y-3 min-w-0">
                    <div class="absolute -left-[29px] top-0 w-4 h-4 rounded-full bg-blue-200 dark:bg-blue-900"></div>
                    <div class="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800"></div>
                    <div class="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800"></div>
                    <div class="h-16 w-full rounded-2xl bg-slate-100 dark:bg-slate-800/70"></div>
                  </div>
                }
              </div>
            } @else {
              <div class="relative ml-2 border-l-2 border-blue-500/30 dark:border-blue-500/20 pl-5 space-y-6">
                @for (item of filteredList(); track item.version) {
              <article class="relative min-w-0">
                <!-- Timeline Dot -->
                <div class="absolute -left-[29px] top-0 w-4 h-4 rounded-full bg-blue-600 border-4 border-white dark:border-slate-900 shadow-sm"></div>

                <div class="flex items-center justify-between gap-2 mb-2">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-black font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-lg border border-blue-200 dark:border-blue-800">
                      {{ item.version }}
                    </span>
                    <span class="text-xs text-slate-400 font-medium"><i class="fa-regular fa-calendar-check mr-1"></i>{{ item.date }}</span>
                  </div>
                </div>

                <h4 class="text-sm font-extrabold text-slate-800 dark:text-white mb-2 leading-snug">{{ item.title }}</h4>

                @if (item.highlights && item.highlights.length > 0) {
                  <div class="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 mb-3">
                    <ul class="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                      @for (hl of item.highlights; track hl) {
                        <li class="flex items-start gap-2">
                          <i class="fa-solid fa-sparkles text-amber-500 text-[10px] mt-1 shrink-0"></i>
                          <span>{{ hl }}</span>
                        </li>
                      }
                    </ul>
                  </div>
                }

                @if (item.features && item.features.length > 0) {
                  <div class="mb-2">
                    <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">🚀 Tính Năng Mới</span>
                    <ul class="list-disc pl-4 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                      @for (f of item.features; track f) { <li>{{ f }}</li> }
                    </ul>
                  </div>
                }

                @if (item.improvements && item.improvements.length > 0) {
                  <div class="mb-2">
                    <span class="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">⚡ Tối Ưu & Cải Tiến</span>
                    <ul class="list-disc pl-4 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                      @for (imp of item.improvements; track imp) { <li>{{ imp }}</li> }
                    </ul>
                  </div>
                }

                @if (item.fixes && item.fixes.length > 0) {
                  <div class="mb-2">
                    <span class="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block mb-1">🐛 Sửa Lỗi</span>
                    <ul class="list-disc pl-4 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                      @for (fix of item.fixes; track fix) { <li>{{ fix }}</li> }
                    </ul>
                  </div>
                }
              </article>
                }
              </div>

              @if (filteredList().length === 0) {
                <div class="text-center py-10 text-slate-400 dark:text-slate-500">
                  <i class="fa-solid fa-scroll text-3xl mb-2 opacity-50 block"></i>
                  <p class="text-xs font-semibold">Không tìm thấy bản ghi phù hợp từ khóa "{{ searchQuery() }}"</p>
                </div>
              }
            }
          </div>

          <!-- Modal Footer -->
          <div class="px-4 sm:px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between gap-4">
            <button (click)="navigateToFullChangelog()" 
                    class="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1.5 transition">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Xem Toàn Bộ Lịch Sử
            </button>

            <button (click)="changelogService.close()" 
                    class="px-5 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition active:scale-95 shadow-sm">
              Đóng
            </button>
          </div>

        </div>
      </div>
    }
  `
            }]
    }], () => [], { onEscKey: [{
            type: HostListener,
            args: ['document:keydown.escape']
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ChangelogModalComponent, { className: "ChangelogModalComponent", filePath: "src/app/shared/components/changelog-modal/changelog-modal.component.ts", lineNumber: 167 }); })();
//# sourceMappingURL=changelog-modal.component.js.map