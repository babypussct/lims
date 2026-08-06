import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as i0 from "@angular/core";
export class TermsOfServiceComponent {
    constructor() {
        this.router = inject(Router);
        this.year = new Date().getFullYear();
    }
    goBack() {
        this.router.navigate(['/']);
    }
    static { this.ɵfac = function TermsOfServiceComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || TermsOfServiceComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: TermsOfServiceComponent, selectors: [["app-terms-of-service"]], decls: 103, vars: 1, consts: [[1, "min-h-screen", "bg-slate-50", "dark:bg-slate-900", "py-12", "px-4", "sm:px-6", "lg:px-8", "transition-colors", "duration-300"], [1, "max-w-4xl", "mx-auto"], [1, "flex", "flex-col", "sm:flex-row", "sm:items-center", "sm:justify-between", "gap-4", "mb-8"], [1, "flex", "items-center", "gap-3"], [1, "w-12", "h-12", "bg-blue-600", "rounded-2xl", "flex", "items-center", "justify-center", "text-white", "shadow-lg", "shadow-blue-500/20"], [1, "fa-solid", "fa-file-contract", "text-2xl"], [1, "text-2xl", "font-black", "text-slate-800", "dark:text-white", "tracking-tight"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "font-semibold", "uppercase", "tracking-wider"], [1, "self-start", "sm:self-auto", "px-5", "py-2.5", "bg-white", "dark:bg-slate-800", "hover:bg-slate-100", "dark:hover:bg-slate-700", "text-slate-700", "dark:text-slate-200", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-sm", "font-bold", "transition", "flex", "items-center", "gap-2", "shadow-sm", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-arrow-left"], [1, "bg-white", "dark:bg-slate-800", "shadow-soft-xl", "border", "border-slate-100", "dark:border-slate-700/50", "rounded-3xl", "p-6", "sm:p-10", "transition-all", "duration-300"], [1, "border-b", "border-slate-100", "dark:border-slate-700/80", "pb-6", "mb-8"], [1, "text-3xl", "font-extrabold", "text-slate-900", "dark:text-white", "mb-2"], [1, "flex", "items-center", "gap-2", "text-sm", "text-slate-500", "dark:text-slate-400", "font-semibold"], [1, "fa-regular", "fa-clock"], [1, "prose", "prose-slate", "dark:prose-invert", "max-w-none", "text-slate-600", "dark:text-slate-300", "space-y-6", "text-sm", "sm:text-base", "leading-relaxed"], [1, "bg-slate-50", "dark:bg-slate-900/50", "p-6", "rounded-2xl", "border", "border-slate-200", "dark:border-slate-800", "my-6"], [1, "text-lg", "font-extrabold", "text-slate-800", "dark:text-white", "mb-3", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-check", "text-blue-600"], [1, "m-0"], [1, "fa-solid", "fa-user-shield", "text-blue-600"], [1, "list-disc", "pl-5", "space-y-2", "m-0"], [1, "fa-solid", "fa-cloud-arrow-up", "text-blue-600"], [1, "mb-2"], [1, "bg-blue-100", "dark:bg-blue-950", "text-blue-700", "dark:text-blue-300", "px-2", "py-0.5", "rounded", "font-mono", "font-bold", "border", "border-blue-200", "dark:border-blue-800"], [1, "fa-solid", "fa-ban", "text-blue-600"], [1, "fa-solid", "fa-triangle-exclamation", "text-blue-600"], [1, "border-t", "border-slate-200", "dark:border-slate-700/80", "pt-6", "mt-8"], [1, "fa-solid", "fa-envelope-open-text", "text-blue-600"], [1, "mt-4"], [1, "mt-4", "p-4", "bg-blue-50", "dark:bg-slate-900", "border", "border-blue-100", "dark:border-slate-700/80", "rounded-2xl", "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "bg-blue-100", "dark:bg-slate-800", "rounded-xl", "flex", "items-center", "justify-center", "text-blue-600"], [1, "fa-solid", "fa-envelope"], [1, "text-xs", "text-slate-400", "dark:text-slate-500", "font-semibold", "uppercase"], ["href", "mailto:chuannafi6@gmail.com", 1, "text-sm", "font-bold", "text-blue-600", "dark:text-blue-400", "hover:underline"], [1, "text-center", "mt-8", "text-xs", "text-slate-400", "dark:text-slate-500", "select-none"]], template: function TermsOfServiceComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4);
            i0.ɵɵelement(5, "i", 5);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "div")(7, "h1", 6);
            i0.ɵɵtext(8, "LIMS Cloud");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "p", 7);
            i0.ɵɵtext(10, "C\u1ED5ng Th\u00F4ng Tin C\u00F4ng Khai");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(11, "button", 8);
            i0.ɵɵlistener("click", function TermsOfServiceComponent_Template_button_click_11_listener() { return ctx.goBack(); });
            i0.ɵɵelement(12, "i", 9);
            i0.ɵɵtext(13, " Quay L\u1EA1i ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(14, "div", 10)(15, "div", 11)(16, "h2", 12);
            i0.ɵɵtext(17, "\u0110i\u1EC1u Kho\u1EA3n D\u1ECBch V\u1EE5 S\u1EED D\u1EE5ng");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "div", 13);
            i0.ɵɵelement(19, "i", 14);
            i0.ɵɵelementStart(20, "span");
            i0.ɵɵtext(21, "C\u1EADp nh\u1EADt l\u1EA7n cu\u1ED1i: 13/07/2026");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(22, "div", 15)(23, "p");
            i0.ɵɵtext(24, " Ch\u00E0o m\u1EEBng b\u1EA1n \u0111\u1EBFn s\u1EED d\u1EE5ng ");
            i0.ɵɵelementStart(25, "strong");
            i0.ɵɵtext(26, "NAFIQPM6 LIMS Cloud");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(27, ". B\u1EB1ng vi\u1EC7c \u0111\u0103ng nh\u1EADp v\u00E0 truy c\u1EADp v\u00E0o d\u1ECBch v\u1EE5 c\u1EE7a ch\u00FAng t\u00F4i, b\u1EA1n \u0111\u1ED3ng \u00FD tu\u00E2n th\u1EE7 c\u00E1c \u0111i\u1EC1u kho\u1EA3n d\u1ECBch v\u1EE5 d\u01B0\u1EDBi \u0111\u00E2y. Vui l\u00F2ng \u0111\u1ECDc k\u1EF9 c\u00E1c th\u00F4ng tin n\u00E0y tr\u01B0\u1EDBc khi b\u1EAFt \u0111\u1EA7u s\u1EED d\u1EE5ng. ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(28, "div", 16)(29, "h3", 17);
            i0.ɵɵelement(30, "i", 18);
            i0.ɵɵtext(31, " 1. Ch\u1EA5p Thu\u1EADn \u0110i\u1EC1u Kho\u1EA3n ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(32, "p", 19);
            i0.ɵɵtext(33, " Vi\u1EC7c truy c\u1EADp, \u0111\u0103ng k\u00FD t\u00E0i kho\u1EA3n ho\u1EB7c s\u1EED d\u1EE5ng b\u1EA5t k\u1EF3 t\u00EDnh n\u0103ng n\u00E0o c\u1EE7a h\u1EC7 th\u1ED1ng LIMS Cloud \u0111\u1ED3ng ngh\u0129a v\u1EDBi vi\u1EC7c b\u1EA1n \u0111\u1ED3ng \u00FD v\u1EDBi c\u00E1c \u0111i\u1EC1u kho\u1EA3n n\u00E0y. N\u1EBFu b\u1EA1n kh\u00F4ng \u0111\u1ED3ng \u00FD v\u1EDBi b\u1EA5t k\u1EF3 ph\u1EA7n n\u00E0o, vui l\u00F2ng ng\u1EEBng s\u1EED d\u1EE5ng d\u1ECBch v\u1EE5 v\u00E0 ng\u1EAFt k\u1EBFt n\u1ED1i t\u00E0i kho\u1EA3n c\u1EE7a m\u00ECnh. ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(34, "div", 16)(35, "h3", 17);
            i0.ɵɵelement(36, "i", 20);
            i0.ɵɵtext(37, " 2. \u0110\u0103ng Nh\u1EADp v\u00E0 B\u1EA3o M\u1EADt T\u00E0i Kho\u1EA3n ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(38, "ul", 21)(39, "li");
            i0.ɵɵtext(40, "Ng\u01B0\u1EDDi d\u00F9ng c\u00F3 th\u1EC3 \u0111\u0103ng nh\u1EADp b\u1EB1ng Google ho\u1EB7c Gmail/email v\u00E0 m\u1EADt kh\u1EA9u LIMS \u0111\u00E3 li\u00EAn k\u1EBFt trong Firebase Authentication.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(41, "li");
            i0.ɵɵtext(42, "B\u1EA1n ch\u1ECBu tr\u00E1ch nhi\u1EC7m b\u1EA3o m\u1EADt th\u00F4ng tin \u0111\u0103ng nh\u1EADp t\u00E0i kho\u1EA3n Google c\u1EE7a m\u00ECnh v\u00E0 kh\u00F4ng cho ph\u00E9p b\u00EAn th\u1EE9 ba truy c\u1EADp tr\u00E1i ph\u00E9p v\u00E0o t\u00E0i kho\u1EA3n c\u1EE7a b\u1EA1n \u0111\u1EC3 thao t\u00E1c tr\u00EAn h\u1EC7 th\u1ED1ng LIMS.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(43, "li");
            i0.ɵɵtext(44, "M\u1ECDi ho\u1EA1t \u0111\u1ED9ng \u0111\u01B0\u1EE3c th\u1EF1c hi\u1EC7n d\u01B0\u1EDBi t\u00E0i kho\u1EA3n \u0111\u00E3 \u0111\u0103ng nh\u1EADp c\u1EE7a b\u1EA1n s\u1EBD \u0111\u01B0\u1EE3c ghi nh\u1EADn l\u00E0 ho\u1EA1t \u0111\u1ED9ng h\u1EE3p ph\u00E1p c\u1EE7a ch\u00EDnh b\u1EA1n.");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(45, "div", 16)(46, "h3", 17);
            i0.ɵɵelement(47, "i", 22);
            i0.ɵɵtext(48, " 3. S\u1EED D\u1EE5ng D\u1ECBch V\u1EE5 Li\u00EAn K\u1EBFt Google Drive ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(49, "p", 23);
            i0.ɵɵtext(50, " Khi b\u1EA1n k\u00EDch ho\u1EA1t t\u00EDnh n\u0103ng t\u00EDch h\u1EE3p Google Drive: ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(51, "ul", 21)(52, "li");
            i0.ɵɵtext(53, "\u1EE8ng d\u1EE5ng ch\u1EC9 \u0111\u01B0\u1EE3c c\u1EA5p quy\u1EC1n truy c\u1EADp h\u1EA1n ch\u1EBF ph\u1EA1m vi ");
            i0.ɵɵelementStart(54, "code", 24);
            i0.ɵɵtext(55, "drive.file");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(56, " (ch\u1EC9 \u0111\u1ED1i v\u1EDBi c\u00E1c t\u1EC7p tin do \u1EE9ng d\u1EE5ng t\u1EA1o ra).");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(57, "li");
            i0.ɵɵtext(58, "B\u1EA1n \u0111\u1ED3ng \u00FD r\u1EB1ng c\u00E1c t\u1EC7p b\u00E1o c\u00E1o ph\u00E2n t\u00EDch, t\u00E0i li\u1EC7u n\u1ED9i b\u1ED9 s\u1EBD \u0111\u01B0\u1EE3c l\u01B0u tr\u1EEF tr\u1EF1c ti\u1EBFp v\u00E0o th\u01B0 m\u1EE5c l\u01B0u tr\u1EEF d\u00F9ng chung c\u1EE7a ph\u00F2ng th\u00ED nghi\u1EC7m \u0111\u01B0\u1EE3c ph\u00E2n quy\u1EC1n.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(59, "li");
            i0.ɵɵtext(60, "B\u1EA1n c\u00F3 to\u00E0n quy\u1EC1n x\u00F3a, di chuy\u1EC3n ho\u1EB7c thu h\u1ED3i quy\u1EC1n truy c\u1EADp n\u00E0y b\u1EA5t c\u1EE9 l\u00FAc n\u00E0o th\u00F4ng qua trang qu\u1EA3n l\u00FD t\u00E0i kho\u1EA3n Google.");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(61, "div", 16)(62, "h3", 17);
            i0.ɵɵelement(63, "i", 25);
            i0.ɵɵtext(64, " 4. C\u00E1c H\u00E0nh Vi B\u1ECB C\u1EA5m ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(65, "p", 23);
            i0.ɵɵtext(66, "Khi s\u1EED d\u1EE5ng h\u1EC7 th\u1ED1ng LIMS Cloud, b\u1EA1n cam k\u1EBFt KH\u00D4NG th\u1EF1c hi\u1EC7n c\u00E1c h\u00E0nh vi sau:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(67, "ul", 21)(68, "li");
            i0.ɵɵtext(69, "T\u1EA3i l\u00EAn h\u1EC7 th\u1ED1ng ho\u1EB7c li\u00EAn k\u1EBFt Drive c\u00E1c t\u1EC7p tin ch\u1EE9a virus, m\u00E3 \u0111\u1ED9c ho\u1EB7c ph\u1EA7n m\u1EC1m \u0111\u1ED9c h\u1EA1i g\u00E2y \u1EA3nh h\u01B0\u1EDFng \u0111\u1EBFn h\u1EC7 th\u1ED1ng.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(70, "li");
            i0.ɵɵtext(71, "C\u1ED1 g\u1EAFng truy c\u1EADp tr\u00E1i ph\u00E9p ho\u1EB7c ph\u00E1 ho\u1EA1i c\u01A1 s\u1EDF d\u1EEF li\u1EC7u c\u1EE7a ph\u00F2ng th\u00ED nghi\u1EC7m ho\u1EB7c c\u1EE7a ng\u01B0\u1EDDi d\u00F9ng kh\u00E1c.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(72, "li");
            i0.ɵɵtext(73, "S\u1EED d\u1EE5ng th\u00F4ng tin v\u00E0 bi\u1EC3u m\u1EABu c\u1EE7a h\u1EC7 th\u1ED1ng v\u00E0o c\u00E1c m\u1EE5c \u0111\u00EDch phi ph\u00E1p ho\u1EB7c tr\u00E1i v\u1EDBi quy \u0111\u1ECBnh b\u1EA3o m\u1EADt c\u1EE7a ph\u00F2ng th\u00ED nghi\u1EC7m.");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(74, "div", 16)(75, "h3", 17);
            i0.ɵɵelement(76, "i", 26);
            i0.ɵɵtext(77, " 5. Gi\u1EDBi H\u1EA1n Tr\u00E1ch Nhi\u1EC7m Ph\u00E1p L\u00FD ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(78, "p", 23);
            i0.ɵɵtext(79, " \u1EE8ng d\u1EE5ng cung c\u1EA5p c\u00F4ng c\u1EE5 l\u01B0u tr\u1EEF d\u1EEF li\u1EC7u th\u00F4ng qua b\u00EAn th\u1EE9 ba (Google Drive API). Ch\u00FAng t\u00F4i kh\u00F4ng ch\u1ECBu tr\u00E1ch nhi\u1EC7m trong tr\u01B0\u1EDDng h\u1EE3p: ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(80, "ul", 21)(81, "li");
            i0.ɵɵtext(82, "Ng\u01B0\u1EDDi d\u00F9ng t\u1EF1 \u00FD x\u00F3a ho\u1EB7c thay \u0111\u1ED5i t\u1EC7p tin tr\u00EAn Google Drive d\u1EABn \u0111\u1EBFn m\u1EA5t m\u00E1t ho\u1EB7c h\u1ECFng d\u1EEF li\u1EC7u trong h\u1EC7 th\u1ED1ng LIMS.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(83, "li");
            i0.ɵɵtext(84, "S\u1EF1 c\u1ED1 k\u1EBFt n\u1ED1i ho\u1EB7c gi\u00E1n \u0111o\u1EA1n d\u1ECBch v\u1EE5 t\u1EEB ph\u00EDa nh\u00E0 cung c\u1EA5p d\u1ECBch v\u1EE5 m\u00E1y ch\u1EE7 \u0111\u00E1m m\u00E2y c\u1EE7a Google n\u1EB1m ngo\u00E0i t\u1EA7m ki\u1EC3m so\u00E1t c\u1EE7a ch\u00FAng t\u00F4i.");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(85, "div", 27)(86, "h3", 17);
            i0.ɵɵelement(87, "i", 28);
            i0.ɵɵtext(88, " 6. Thay \u0110\u1ED5i \u0110i\u1EC1u Kho\u1EA3n v\u00E0 Li\u00EAn H\u1EC7 ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(89, "p");
            i0.ɵɵtext(90, " Ch\u00FAng t\u00F4i c\u00F3 quy\u1EC1n s\u1EEDa \u0111\u1ED5i c\u00E1c \u0111i\u1EC1u kho\u1EA3n n\u00E0y v\u00E0o b\u1EA5t k\u1EF3 l\u00FAc n\u00E0o \u0111\u1EC3 ph\u00F9 h\u1EE3p v\u1EDBi quy \u0111\u1ECBnh m\u1EDBi c\u1EE7a ph\u00E1p lu\u1EADt ho\u1EB7c c\u1EADp nh\u1EADt k\u1EF9 thu\u1EADt. C\u00E1c thay \u0111\u1ED5i s\u1EBD \u0111\u01B0\u1EE3c c\u00F4ng khai t\u1EA1i trang n\u00E0y. ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(91, "p", 29);
            i0.ɵɵtext(92, " N\u1EBFu b\u1EA1n c\u00F3 b\u1EA5t k\u1EF3 c\u00E2u h\u1ECFi n\u00E0o v\u1EC1 c\u00E1c \u0111i\u1EC1u kho\u1EA3n n\u00E0y, vui l\u00F2ng li\u00EAn h\u1EC7 b\u1ED9 ph\u1EADn h\u1ED7 tr\u1EE3 k\u1EF9 thu\u1EADt: ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(93, "div", 30)(94, "div", 31);
            i0.ɵɵelement(95, "i", 32);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(96, "div")(97, "div", 33);
            i0.ɵɵtext(98, "Email li\u00EAn h\u1EC7");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(99, "a", 34);
            i0.ɵɵtext(100, "chuannafi6@gmail.com");
            i0.ɵɵelementEnd()()()()()();
            i0.ɵɵelementStart(101, "div", 35);
            i0.ɵɵtext(102);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(102);
            i0.ɵɵtextInterpolate1(" \u00A9 ", ctx.year, " NAFIQPM6 LIMS Cloud. B\u1EA3o l\u01B0u m\u1ECDi quy\u1EC1n. ");
        } }, dependencies: [CommonModule], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TermsOfServiceComponent, [{
        type: Component,
        args: [{
                selector: 'app-terms-of-service',
                standalone: true,
                imports: [CommonModule],
                template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div class="max-w-4xl mx-auto">
        <!-- Back Button & Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <i class="fa-solid fa-file-contract text-2xl"></i>
            </div>
            <div>
              <h1 class="text-2xl font-black text-slate-800 dark:text-white tracking-tight">LIMS Cloud</h1>
              <p class="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Cổng Thông Tin Công Khai</p>
            </div>
          </div>
          <button (click)="goBack()" 
                  class="self-start sm:self-auto px-5 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-sm active:scale-95">
            <i class="fa-solid fa-arrow-left"></i> Quay Lại
          </button>
        </div>

        <!-- Terms Card -->
        <div class="bg-white dark:bg-slate-800 shadow-soft-xl border border-slate-100 dark:border-slate-700/50 rounded-3xl p-6 sm:p-10 transition-all duration-300">
          <div class="border-b border-slate-100 dark:border-slate-700/80 pb-6 mb-8">
            <h2 class="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Điều Khoản Dịch Vụ Sử Dụng</h2>
            <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-semibold">
              <i class="fa-regular fa-clock"></i>
              <span>Cập nhật lần cuối: 13/07/2026</span>
            </div>
          </div>

          <div class="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 space-y-6 text-sm sm:text-base leading-relaxed">
            <p>
              Chào mừng bạn đến sử dụng <strong>NAFIQPM6 LIMS Cloud</strong>. Bằng việc đăng nhập và truy cập vào dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản dịch vụ dưới đây. Vui lòng đọc kỹ các thông tin này trước khi bắt đầu sử dụng.
            </p>

            <!-- Section 1 -->
            <div class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 my-6">
              <h3 class="text-lg font-extrabold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-check text-blue-600"></i> 1. Chấp Thuận Điều Khoản
              </h3>
              <p class="m-0">
                Việc truy cập, đăng ký tài khoản hoặc sử dụng bất kỳ tính năng nào của hệ thống LIMS Cloud đồng nghĩa với việc bạn đồng ý với các điều khoản này. Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng ngừng sử dụng dịch vụ và ngắt kết nối tài khoản của mình.
              </p>
            </div>

            <!-- Section 2 -->
            <div class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 my-6">
              <h3 class="text-lg font-extrabold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-user-shield text-blue-600"></i> 2. Đăng Nhập và Bảo Mật Tài Khoản
              </h3>
              <ul class="list-disc pl-5 space-y-2 m-0">
                <li>Người dùng có thể đăng nhập bằng Google hoặc Gmail/email và mật khẩu LIMS đã liên kết trong Firebase Authentication.</li>
                <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập tài khoản Google của mình và không cho phép bên thứ ba truy cập trái phép vào tài khoản của bạn để thao tác trên hệ thống LIMS.</li>
                <li>Mọi hoạt động được thực hiện dưới tài khoản đã đăng nhập của bạn sẽ được ghi nhận là hoạt động hợp pháp của chính bạn.</li>
              </ul>
            </div>

            <!-- Section 3 -->
            <div class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 my-6">
              <h3 class="text-lg font-extrabold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-cloud-arrow-up text-blue-600"></i> 3. Sử Dụng Dịch Vụ Liên Kết Google Drive
              </h3>
              <p class="mb-2">
                Khi bạn kích hoạt tính năng tích hợp Google Drive:
              </p>
              <ul class="list-disc pl-5 space-y-2 m-0">
                <li>Ứng dụng chỉ được cấp quyền truy cập hạn chế phạm vi <code class="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-mono font-bold border border-blue-200 dark:border-blue-800">drive.file</code> (chỉ đối với các tệp tin do ứng dụng tạo ra).</li>
                <li>Bạn đồng ý rằng các tệp báo cáo phân tích, tài liệu nội bộ sẽ được lưu trữ trực tiếp vào thư mục lưu trữ dùng chung của phòng thí nghiệm được phân quyền.</li>
                <li>Bạn có toàn quyền xóa, di chuyển hoặc thu hồi quyền truy cập này bất cứ lúc nào thông qua trang quản lý tài khoản Google.</li>
              </ul>
            </div>

            <!-- Section 4 -->
            <div class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 my-6">
              <h3 class="text-lg font-extrabold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-ban text-blue-600"></i> 4. Các Hành Vi Bị Cấm
              </h3>
              <p class="mb-2">Khi sử dụng hệ thống LIMS Cloud, bạn cam kết KHÔNG thực hiện các hành vi sau:</p>
              <ul class="list-disc pl-5 space-y-2 m-0">
                <li>Tải lên hệ thống hoặc liên kết Drive các tệp tin chứa virus, mã độc hoặc phần mềm độc hại gây ảnh hưởng đến hệ thống.</li>
                <li>Cố gắng truy cập trái phép hoặc phá hoại cơ sở dữ liệu của phòng thí nghiệm hoặc của người dùng khác.</li>
                <li>Sử dụng thông tin và biểu mẫu của hệ thống vào các mục đích phi pháp hoặc trái với quy định bảo mật của phòng thí nghiệm.</li>
              </ul>
            </div>

            <!-- Section 5 -->
            <div class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 my-6">
              <h3 class="text-lg font-extrabold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-triangle-exclamation text-blue-600"></i> 5. Giới Hạn Trách Nhiệm Pháp Lý
              </h3>
              <p class="mb-2">
                Ứng dụng cung cấp công cụ lưu trữ dữ liệu thông qua bên thứ ba (Google Drive API). Chúng tôi không chịu trách nhiệm trong trường hợp:
              </p>
              <ul class="list-disc pl-5 space-y-2 m-0">
                <li>Người dùng tự ý xóa hoặc thay đổi tệp tin trên Google Drive dẫn đến mất mát hoặc hỏng dữ liệu trong hệ thống LIMS.</li>
                <li>Sự cố kết nối hoặc gián đoạn dịch vụ từ phía nhà cung cấp dịch vụ máy chủ đám mây của Google nằm ngoài tầm kiểm soát của chúng tôi.</li>
              </ul>
            </div>

            <!-- Section 6 -->
            <div class="border-t border-slate-200 dark:border-slate-700/80 pt-6 mt-8">
              <h3 class="text-lg font-extrabold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-envelope-open-text text-blue-600"></i> 6. Thay Đổi Điều Khoản và Liên Hệ
              </h3>
              <p>
                Chúng tôi có quyền sửa đổi các điều khoản này vào bất kỳ lúc nào để phù hợp với quy định mới của pháp luật hoặc cập nhật kỹ thuật. Các thay đổi sẽ được công khai tại trang này.
              </p>
              <p class="mt-4">
                Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ bộ phận hỗ trợ kỹ thuật:
              </p>
              <div class="mt-4 p-4 bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-700/80 rounded-2xl flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-blue-600">
                  <i class="fa-solid fa-envelope"></i>
                </div>
                <div>
                  <div class="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase">Email liên hệ</div>
                  <a href="mailto:chuannafi6@gmail.com" class="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">chuannafi6&#64;gmail.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center mt-8 text-xs text-slate-400 dark:text-slate-500 select-none">
          &copy; {{year}} NAFIQPM6 LIMS Cloud. Bảo lưu mọi quyền.
        </div>
      </div>
    </div>
  `
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(TermsOfServiceComponent, { className: "TermsOfServiceComponent", filePath: "src/app/features/public/terms-of-service.component.ts", lineNumber: 140 }); })();
//# sourceMappingURL=terms-of-service.component.js.map