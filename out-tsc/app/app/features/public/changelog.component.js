import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChangelogService } from '../../core/services/changelog.service';
import { StateService } from '../../core/services/state.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _c0 = () => [1, 2, 3];
const _forTrack0 = ($index, $item) => $item.version;
function ChangelogComponent_Conditional_27_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 26);
    i0.ɵɵlistener("click", function ChangelogComponent_Conditional_27_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.searchQuery.set("")); });
    i0.ɵɵelement(1, "i", 27);
    i0.ɵɵelementEnd();
} }
function ChangelogComponent_Conditional_29_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 28);
    i0.ɵɵelement(1, "div", 29)(2, "div", 30)(3, "div", 31)(4, "div", 32);
    i0.ɵɵelementEnd();
} }
function ChangelogComponent_Conditional_29_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 21);
    i0.ɵɵrepeaterCreate(1, ChangelogComponent_Conditional_29_For_2_Template, 5, 0, "div", 28, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵrepeater(i0.ɵɵpureFunction0(0, _c0));
} }
function ChangelogComponent_Conditional_30_For_2_Conditional_10_For_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li", 49);
    i0.ɵɵelement(1, "span", 50);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const hl_r3 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(hl_r3);
} }
function ChangelogComponent_Conditional_30_For_2_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 42)(1, "h4", 46);
    i0.ɵɵelement(2, "i", 47);
    i0.ɵɵtext(3, " \u0110i\u1EC3m N\u1ED5i B\u1EADt B\u1EA3n N\u00E0y ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "ul", 48);
    i0.ɵɵrepeaterCreate(5, ChangelogComponent_Conditional_30_For_2_Conditional_10_For_6_Template, 4, 1, "li", 49, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r4 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(5);
    i0.ɵɵrepeater(item_r4.highlights);
} }
function ChangelogComponent_Conditional_30_For_2_Conditional_12_For_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const f_r5 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(f_r5);
} }
function ChangelogComponent_Conditional_30_For_2_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 44)(1, "h4", 51);
    i0.ɵɵelement(2, "i", 52);
    i0.ɵɵtext(3, " T\u00EDnh N\u0103ng M\u1EDBi ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "ul", 53);
    i0.ɵɵrepeaterCreate(5, ChangelogComponent_Conditional_30_For_2_Conditional_12_For_6_Template, 2, 1, "li", null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r4 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(5);
    i0.ɵɵrepeater(item_r4.features);
} }
function ChangelogComponent_Conditional_30_For_2_Conditional_13_For_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const imp_r6 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(imp_r6);
} }
function ChangelogComponent_Conditional_30_For_2_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 44)(1, "h4", 54);
    i0.ɵɵelement(2, "i", 55);
    i0.ɵɵtext(3, " C\u1EA3i Ti\u1EBFn & T\u1ED1i \u01AFu ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "ul", 53);
    i0.ɵɵrepeaterCreate(5, ChangelogComponent_Conditional_30_For_2_Conditional_13_For_6_Template, 2, 1, "li", null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r4 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(5);
    i0.ɵɵrepeater(item_r4.improvements);
} }
function ChangelogComponent_Conditional_30_For_2_Conditional_14_For_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const fix_r7 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(fix_r7);
} }
function ChangelogComponent_Conditional_30_For_2_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 45)(1, "h4", 56);
    i0.ɵɵelement(2, "i", 57);
    i0.ɵɵtext(3, " S\u1EEDa L\u1ED7i H\u1EC7 Th\u1ED1ng ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "ul", 53);
    i0.ɵɵrepeaterCreate(5, ChangelogComponent_Conditional_30_For_2_Conditional_14_For_6_Template, 2, 1, "li", null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r4 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(5);
    i0.ɵɵrepeater(item_r4.fixes);
} }
function ChangelogComponent_Conditional_30_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "article", 34);
    i0.ɵɵelement(1, "div", 36);
    i0.ɵɵelementStart(2, "div", 37)(3, "span", 38);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span", 39);
    i0.ɵɵelement(6, "i", 40);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "h3", 41);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(10, ChangelogComponent_Conditional_30_For_2_Conditional_10_Template, 7, 0, "div", 42);
    i0.ɵɵelementStart(11, "div", 43);
    i0.ɵɵtemplate(12, ChangelogComponent_Conditional_30_For_2_Conditional_12_Template, 7, 0, "div", 44)(13, ChangelogComponent_Conditional_30_For_2_Conditional_13_Template, 7, 0, "div", 44)(14, ChangelogComponent_Conditional_30_For_2_Conditional_14_Template, 7, 0, "div", 45);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r4 = ctx.$implicit;
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", item_r4.version, " ");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", item_r4.date, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r4.title);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r4.highlights && item_r4.highlights.length > 0 ? 10 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(item_r4.features && item_r4.features.length > 0 ? 12 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r4.improvements && item_r4.improvements.length > 0 ? 13 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r4.fixes && item_r4.fixes.length > 0 ? 14 : -1);
} }
function ChangelogComponent_Conditional_30_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 35);
    i0.ɵɵelement(1, "i", 58);
    i0.ɵɵelementStart(2, "p", 59);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("Kh\u00F4ng t\u00ECm th\u1EA5y b\u1EA3n ghi ph\u00F9 h\u1EE3p t\u1EEB kh\u00F3a \"", ctx_r1.searchQuery(), "\"");
} }
function ChangelogComponent_Conditional_30_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 33);
    i0.ɵɵrepeaterCreate(1, ChangelogComponent_Conditional_30_For_2_Template, 15, 7, "article", 34, _forTrack0);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(3, ChangelogComponent_Conditional_30_Conditional_3_Template, 4, 1, "div", 35);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.filteredList());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.filteredList().length === 0 ? 3 : -1);
} }
export class ChangelogComponent {
    constructor() {
        this.state = inject(StateService);
        this.changelogService = inject(ChangelogService);
        this.router = inject(Router);
        this.year = new Date().getFullYear();
        this.searchQuery = signal('');
        this.filteredList = computed(() => {
            const q = this.searchQuery().toLowerCase().trim();
            const releases = this.changelogService.allReleases();
            if (!q)
                return releases;
            return releases.filter(item => item.version.toLowerCase().includes(q) ||
                item.title.toLowerCase().includes(q) ||
                (item.highlights && item.highlights.some(h => h.toLowerCase().includes(q))) ||
                (item.features && item.features.some(f => f.toLowerCase().includes(q))) ||
                (item.improvements && item.improvements.some(imp => imp.toLowerCase().includes(q))) ||
                (item.fixes && item.fixes.some(fx => fx.toLowerCase().includes(q))));
        });
        void this.changelogService.loadAll();
    }
    goBack() {
        this.router.navigate(['/']);
    }
    static { this.ɵfac = function ChangelogComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ChangelogComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ChangelogComponent, selectors: [["app-changelog"]], decls: 40, vars: 5, consts: [[1, "min-h-full", "w-full", "bg-slate-50", "dark:bg-slate-900", "py-4", "sm:py-8", "px-2", "sm:px-4", "lg:px-6", "transition-colors", "duration-300"], [1, "w-full", "max-w-5xl", "mx-auto"], [1, "flex", "flex-col", "sm:flex-row", "sm:items-center", "sm:justify-between", "gap-4", "mb-5", "sm:mb-8"], [1, "flex", "items-start", "sm:items-center", "gap-3", "min-w-0"], [1, "w-12", "h-12", "bg-blue-600", "rounded-2xl", "flex", "items-center", "justify-center", "text-white", "shadow-lg", "shadow-blue-500/20"], [1, "fa-solid", "fa-scroll", "text-2xl"], [1, "min-w-0"], [1, "flex", "flex-wrap", "items-center", "gap-2"], [1, "text-xl", "sm:text-2xl", "font-black", "text-slate-800", "dark:text-white", "tracking-tight", "leading-tight"], [1, "text-xs", "font-black", "px-2.5", "py-0.5", "rounded-full", "bg-blue-100", "dark:bg-blue-950", "text-blue-700", "dark:text-blue-300", "border", "border-blue-200", "dark:border-blue-800"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "font-semibold", "uppercase", "tracking-wider"], [1, "self-start", "sm:self-auto", "px-5", "py-2.5", "bg-white", "dark:bg-slate-800", "hover:bg-slate-100", "dark:hover:bg-slate-700", "text-slate-700", "dark:text-slate-200", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-sm", "font-bold", "transition", "flex", "items-center", "gap-2", "shadow-sm", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-arrow-left"], [1, "bg-white", "dark:bg-slate-800", "shadow-soft-xl", "border", "border-slate-100", "dark:border-slate-700/50", "rounded-2xl", "sm:rounded-3xl", "p-4", "sm:p-8", "lg:p-10", "transition-all", "duration-300", "overflow-hidden"], [1, "border-b", "border-slate-100", "dark:border-slate-700/80", "pb-5", "sm:pb-6", "mb-6", "sm:mb-8", "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-4"], [1, "text-2xl", "sm:text-3xl", "font-extrabold", "text-slate-900", "dark:text-white", "mb-2", "leading-tight"], [1, "text-sm", "text-slate-500", "dark:text-slate-400", "font-medium"], [1, "relative", "w-full", "md:w-72", "shrink-0"], [1, "fa-solid", "fa-magnifying-glass", "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-slate-400", "text-xs"], ["type", "text", "placeholder", "T\u00ECm phi\u00EAn b\u1EA3n, t\u00EDnh n\u0103ng...", 1, "w-full", "pl-9", "pr-8", "py-2", "bg-slate-50", "dark:bg-slate-900/60", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-xs", "font-semibold", "text-slate-700", "dark:text-slate-200", "outline-none", "focus:border-blue-500", "transition", 3, "ngModelChange", "ngModel"], [1, "absolute", "right-3", "top-1/2", "-translate-y-1/2", "text-xs", "text-slate-400", "hover:text-slate-600"], ["aria-live", "polite", "aria-busy", "true", 1, "relative", "ml-2", "sm:ml-3", "border-l-2", "border-blue-200", "dark:border-blue-900/60", "pl-5", "sm:pl-8", "space-y-8", "animate-pulse"], [1, "text-center", "mt-8", "text-xs", "text-slate-400", "dark:text-slate-500", "select-none"], [1, "mb-2", "flex", "items-center", "justify-center", "gap-3"], ["routerLink", "/privacy-policy", 1, "hover:text-blue-600", "dark:hover:text-blue-400", "transition-colors", "font-bold"], ["routerLink", "/terms-of-service", 1, "hover:text-blue-600", "dark:hover:text-blue-400", "transition-colors", "font-bold"], [1, "absolute", "right-3", "top-1/2", "-translate-y-1/2", "text-xs", "text-slate-400", "hover:text-slate-600", 3, "click"], [1, "fa-solid", "fa-xmark"], [1, "relative", "space-y-3", "min-w-0"], [1, "absolute", "-left-[31px]", "sm:-left-[43px]", "top-1", "w-5", "h-5", "rounded-full", "bg-blue-200", "dark:bg-blue-900"], [1, "h-6", "w-32", "rounded-xl", "bg-slate-200", "dark:bg-slate-700"], [1, "h-7", "w-2/3", "rounded", "bg-slate-200", "dark:bg-slate-700"], [1, "h-24", "w-full", "rounded-2xl", "bg-slate-100", "dark:bg-slate-900"], [1, "relative", "ml-2", "sm:ml-3", "border-l-2", "border-blue-500/30", "dark:border-blue-500/20", "pl-5", "sm:pl-8", "space-y-8", "sm:space-y-10"], [1, "relative", "min-w-0"], [1, "text-center", "py-12", "text-slate-400", "dark:text-slate-500"], [1, "absolute", "-left-[31px]", "sm:-left-[43px]", "top-1", "w-5", "h-5", "rounded-full", "bg-blue-600", "border-4", "border-white", "dark:border-slate-800", "shadow-md"], [1, "flex", "flex-wrap", "items-center", "gap-3", "mb-2"], [1, "text-sm", "font-black", "font-mono", "bg-blue-50", "dark:bg-blue-950", "text-blue-700", "dark:text-blue-300", "px-3", "py-1", "rounded-xl", "border", "border-blue-200", "dark:border-blue-800", "shadow-sm"], [1, "text-xs", "text-slate-400", "font-semibold", "flex", "items-center", "gap-1"], [1, "fa-regular", "fa-calendar"], [1, "text-xl", "font-extrabold", "text-slate-850", "dark:text-white", "mb-3", "tracking-tight"], [1, "bg-gradient-to-r", "from-blue-50/70", "to-indigo-50/50", "dark:from-slate-900/70", "dark:to-slate-900/40", "p-4", "rounded-2xl", "border", "border-blue-100", "dark:border-blue-900/40", "mb-4"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4"], [1, "bg-slate-50", "dark:bg-slate-900/50", "p-4", "rounded-2xl", "border", "border-slate-100", "dark:border-slate-800/80"], [1, "bg-slate-50", "dark:bg-slate-900/50", "p-4", "rounded-2xl", "border", "border-slate-100", "dark:border-slate-800/80", "md:col-span-2"], [1, "text-xs", "font-bold", "text-blue-900", "dark:text-blue-300", "uppercase", "tracking-wider", "mb-2", "flex", "items-center", "gap-1.5"], [1, "fa-solid", "fa-sparkles", "text-amber-500"], [1, "space-y-2", "text-sm", "text-slate-700", "dark:text-slate-300", "font-medium"], [1, "flex", "items-start", "gap-2.5"], [1, "w-1.5", "h-1.5", "rounded-full", "bg-blue-500", "mt-2", "shrink-0"], [1, "text-xs", "font-bold", "text-emerald-600", "dark:text-emerald-400", "uppercase", "tracking-wider", "mb-2", "flex", "items-center", "gap-1.5"], [1, "fa-solid", "fa-rocket"], [1, "list-disc", "pl-4", "space-y-1.5", "text-xs", "text-slate-600", "dark:text-slate-300"], [1, "text-xs", "font-bold", "text-blue-600", "dark:text-blue-400", "uppercase", "tracking-wider", "mb-2", "flex", "items-center", "gap-1.5"], [1, "fa-solid", "fa-bolt"], [1, "text-xs", "font-bold", "text-rose-600", "dark:text-rose-400", "uppercase", "tracking-wider", "mb-2", "flex", "items-center", "gap-1.5"], [1, "fa-solid", "fa-bug"], [1, "fa-solid", "fa-scroll", "text-4xl", "mb-3", "block", "opacity-40"], [1, "text-sm", "font-semibold"]], template: function ChangelogComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4);
            i0.ɵɵelement(5, "i", 5);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "div", 6)(7, "div", 7)(8, "h1", 8);
            i0.ɵɵtext(9, "Nh\u1EADt K\u00FD C\u1EADp Nh\u1EADt");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "span", 9);
            i0.ɵɵtext(11);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(12, "p", 10);
            i0.ɵɵtext(13, "C\u1ED5ng Th\u00F4ng Tin C\u00F4ng Khai \u2022 LIMS Cloud");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(14, "button", 11);
            i0.ɵɵlistener("click", function ChangelogComponent_Template_button_click_14_listener() { return ctx.goBack(); });
            i0.ɵɵelement(15, "i", 12);
            i0.ɵɵtext(16, " Quay L\u1EA1i ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(17, "div", 13)(18, "div", 14)(19, "div", 6)(20, "h2", 15);
            i0.ɵɵtext(21, "L\u1ECBch S\u1EED N\u00E2ng C\u1EA5p H\u1EC7 Th\u1ED1ng");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "p", 16);
            i0.ɵɵtext(23, "To\u00E0n b\u1ED9 t\u00EDnh n\u0103ng m\u1EDBi, c\u1EA3i ti\u1EBFn hi\u1EC7u n\u0103ng v\u00E0 b\u1EA3n s\u1EEDa l\u1ED7i c\u1EE7a LIMS Cloud.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(24, "div", 17);
            i0.ɵɵelement(25, "i", 18);
            i0.ɵɵelementStart(26, "input", 19);
            i0.ɵɵtwoWayListener("ngModelChange", function ChangelogComponent_Template_input_ngModelChange_26_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.searchQuery, $event) || (ctx.searchQuery = $event); return $event; });
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(27, ChangelogComponent_Conditional_27_Template, 2, 0, "button", 20);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(28, "div");
            i0.ɵɵtemplate(29, ChangelogComponent_Conditional_29_Template, 3, 1, "div", 21)(30, ChangelogComponent_Conditional_30_Template, 4, 1);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(31, "div", 22)(32, "div", 23)(33, "a", 24);
            i0.ɵɵtext(34, "Ch\u00EDnh s\u00E1ch b\u1EA3o m\u1EADt");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(35, "span");
            i0.ɵɵtext(36, "\u2022");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(37, "a", 25);
            i0.ɵɵtext(38, "\u0110i\u1EC1u kho\u1EA3n s\u1EED d\u1EE5ng");
            i0.ɵɵelementEnd()();
            i0.ɵɵtext(39);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(11);
            i0.ɵɵtextInterpolate1(" ", ctx.state.systemVersion(), " ");
            i0.ɵɵadvance(15);
            i0.ɵɵtwoWayProperty("ngModel", ctx.searchQuery);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.searchQuery() ? 27 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.changelogService.loading() ? 29 : 30);
            i0.ɵɵadvance(10);
            i0.ɵɵtextInterpolate1(" \u00A9 ", ctx.year, " NAFIQPM6 LIMS Cloud. B\u1EA3o l\u01B0u m\u1ECDi quy\u1EC1n. ");
        } }, dependencies: [CommonModule, FormsModule, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgModel, RouterLink], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ChangelogComponent, [{
        type: Component,
        args: [{
                selector: 'app-changelog',
                standalone: true,
                imports: [CommonModule, FormsModule, RouterLink],
                template: `
    <div class="min-h-full w-full bg-slate-50 dark:bg-slate-900 py-4 sm:py-8 px-2 sm:px-4 lg:px-6 transition-colors duration-300">
      <div class="w-full max-w-5xl mx-auto">
        
        <!-- Header & Back Button -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 sm:mb-8">
          <div class="flex items-start sm:items-center gap-3 min-w-0">
            <div class="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <i class="fa-solid fa-scroll text-2xl"></i>
            </div>
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h1 class="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">Nhật Ký Cập Nhật</h1>
                <span class="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {{ state.systemVersion() }}
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Cổng Thông Tin Công Khai &bull; LIMS Cloud</p>
            </div>
          </div>
          <button (click)="goBack()" 
                  class="self-start sm:self-auto px-5 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-sm active:scale-95">
            <i class="fa-solid fa-arrow-left"></i> Quay Lại
          </button>
        </div>

        <!-- Main Card -->
        <div class="bg-white dark:bg-slate-800 shadow-soft-xl border border-slate-100 dark:border-slate-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 transition-all duration-300 overflow-hidden">
          
          <div class="border-b border-slate-100 dark:border-slate-700/80 pb-5 sm:pb-6 mb-6 sm:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="min-w-0">
              <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2 leading-tight">Lịch Sử Nâng Cấp Hệ Thống</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">Toàn bộ tính năng mới, cải tiến hiệu năng và bản sửa lỗi của LIMS Cloud.</p>
            </div>
            
            <!-- Search Bar -->
            <div class="relative w-full md:w-72 shrink-0">
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input type="text" [(ngModel)]="searchQuery" 
                     placeholder="Tìm phiên bản, tính năng..." 
                     class="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition">
              @if (searchQuery()) {
                <button (click)="searchQuery.set('')" class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              }
            </div>
          </div>

          <!-- Timeline -->
          <div>
            @if (changelogService.loading()) {
              <div class="relative ml-2 sm:ml-3 border-l-2 border-blue-200 dark:border-blue-900/60 pl-5 sm:pl-8 space-y-8 animate-pulse" aria-live="polite" aria-busy="true">
                @for (placeholder of [1, 2, 3]; track placeholder) {
                  <div class="relative space-y-3 min-w-0">
                    <div class="absolute -left-[31px] sm:-left-[43px] top-1 w-5 h-5 rounded-full bg-blue-200 dark:bg-blue-900"></div>
                    <div class="h-6 w-32 rounded-xl bg-slate-200 dark:bg-slate-700"></div>
                    <div class="h-7 w-2/3 rounded bg-slate-200 dark:bg-slate-700"></div>
                    <div class="h-24 w-full rounded-2xl bg-slate-100 dark:bg-slate-900"></div>
                  </div>
                }
              </div>
            } @else {
              <div class="relative ml-2 sm:ml-3 border-l-2 border-blue-500/30 dark:border-blue-500/20 pl-5 sm:pl-8 space-y-8 sm:space-y-10">
                @for (item of filteredList(); track item.version) {
              <article class="relative min-w-0">
                
                <!-- Dot -->
                <div class="absolute -left-[31px] sm:-left-[43px] top-1 w-5 h-5 rounded-full bg-blue-600 border-4 border-white dark:border-slate-800 shadow-md"></div>

                <div class="flex flex-wrap items-center gap-3 mb-2">
                  <span class="text-sm font-black font-mono bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm">
                    {{ item.version }}
                  </span>
                  <span class="text-xs text-slate-400 font-semibold flex items-center gap-1">
                    <i class="fa-regular fa-calendar"></i> {{ item.date }}
                  </span>
                </div>

                <h3 class="text-xl font-extrabold text-slate-850 dark:text-white mb-3 tracking-tight">{{ item.title }}</h3>

                @if (item.highlights && item.highlights.length > 0) {
                  <div class="bg-gradient-to-r from-blue-50/70 to-indigo-50/50 dark:from-slate-900/70 dark:to-slate-900/40 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/40 mb-4">
                    <h4 class="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <i class="fa-solid fa-sparkles text-amber-500"></i> Điểm Nổi Bật Bản Này
                    </h4>
                    <ul class="space-y-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
                      @for (hl of item.highlights; track hl) {
                        <li class="flex items-start gap-2.5">
                          <span class="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></span>
                          <span>{{ hl }}</span>
                        </li>
                      }
                    </ul>
                  </div>
                }

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  @if (item.features && item.features.length > 0) {
                    <div class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                      <h4 class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <i class="fa-solid fa-rocket"></i> Tính Năng Mới
                      </h4>
                      <ul class="list-disc pl-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                        @for (f of item.features; track f) { <li>{{ f }}</li> }
                      </ul>
                    </div>
                  }

                  @if (item.improvements && item.improvements.length > 0) {
                    <div class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                      <h4 class="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <i class="fa-solid fa-bolt"></i> Cải Tiến & Tối Ưu
                      </h4>
                      <ul class="list-disc pl-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                        @for (imp of item.improvements; track imp) { <li>{{ imp }}</li> }
                      </ul>
                    </div>
                  }

                  @if (item.fixes && item.fixes.length > 0) {
                    <div class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 md:col-span-2">
                      <h4 class="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <i class="fa-solid fa-bug"></i> Sửa Lỗi Hệ Thống
                      </h4>
                      <ul class="list-disc pl-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                        @for (fix of item.fixes; track fix) { <li>{{ fix }}</li> }
                      </ul>
                    </div>
                  }
                </div>

              </article>
                }
              </div>

              @if (filteredList().length === 0) {
                <div class="text-center py-12 text-slate-400 dark:text-slate-500">
                  <i class="fa-solid fa-scroll text-4xl mb-3 block opacity-40"></i>
                  <p class="text-sm font-semibold">Không tìm thấy bản ghi phù hợp từ khóa "{{ searchQuery() }}"</p>
                </div>
              }
            }
          </div>

        </div>

        <!-- Footer -->
        <div class="text-center mt-8 text-xs text-slate-400 dark:text-slate-500 select-none">
          <div class="mb-2 flex items-center justify-center gap-3">
            <a routerLink="/privacy-policy" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold">Chính sách bảo mật</a>
            <span>&bull;</span>
            <a routerLink="/terms-of-service" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold">Điều khoản sử dụng</a>
          </div>
          &copy; {{year}} NAFIQPM6 LIMS Cloud. Bảo lưu mọi quyền.
        </div>
      </div>
    </div>
  `
            }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ChangelogComponent, { className: "ChangelogComponent", filePath: "src/app/features/public/changelog.component.ts", lineNumber: 172 }); })();
//# sourceMappingURL=changelog.component.js.map