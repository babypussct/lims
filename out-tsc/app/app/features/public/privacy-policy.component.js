import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as i0 from "@angular/core";
export class PrivacyPolicyComponent {
    constructor() {
        this.router = inject(Router);
        this.year = new Date().getFullYear();
    }
    goBack() {
        this.router.navigate(['/']);
    }
    static { this.ɵfac = function PrivacyPolicyComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PrivacyPolicyComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PrivacyPolicyComponent, selectors: [["app-privacy-policy"]], decls: 212, vars: 1, consts: [[1, "min-h-screen", "bg-slate-50", "dark:bg-slate-900", "py-12", "px-4", "sm:px-6", "lg:px-8", "transition-colors", "duration-300"], [1, "max-w-4xl", "mx-auto"], [1, "flex", "flex-col", "sm:flex-row", "sm:items-center", "sm:justify-between", "gap-4", "mb-8"], [1, "flex", "items-center", "gap-3"], [1, "w-12", "h-12", "bg-blue-600", "rounded-2xl", "flex", "items-center", "justify-center", "text-white", "shadow-lg", "shadow-blue-500/20"], [1, "fa-solid", "fa-shield-halved", "text-2xl"], [1, "text-2xl", "font-black", "text-slate-800", "dark:text-white", "tracking-tight"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "font-semibold", "uppercase", "tracking-wider"], [1, "self-start", "sm:self-auto", "px-5", "py-2.5", "bg-white", "dark:bg-slate-800", "hover:bg-slate-100", "dark:hover:bg-slate-700", "text-slate-700", "dark:text-slate-200", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-sm", "font-bold", "transition", "flex", "items-center", "gap-2", "shadow-sm", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-arrow-left"], [1, "bg-white", "dark:bg-slate-800", "shadow-soft-xl", "border", "border-slate-100", "dark:border-slate-700/50", "rounded-3xl", "p-6", "sm:p-10", "transition-all", "duration-300"], [1, "border-b", "border-slate-100", "dark:border-slate-700/80", "pb-6", "mb-8"], [1, "text-3xl", "font-extrabold", "text-slate-900", "dark:text-white", "mb-2"], [1, "flex", "items-center", "gap-2", "text-sm", "text-slate-500", "dark:text-slate-400", "font-semibold"], [1, "fa-regular", "fa-clock"], [1, "prose", "prose-slate", "dark:prose-invert", "max-w-none", "text-slate-600", "dark:text-slate-300", "space-y-6", "text-sm", "sm:text-base", "leading-relaxed"], [1, "bg-gradient-to-br", "from-blue-50", "to-indigo-50", "dark:from-slate-900", "dark:to-blue-950/40", "p-6", "rounded-3xl", "border-2", "border-blue-200", "dark:border-blue-800/60", "shadow-sm", "my-6"], [1, "flex", "items-center", "gap-3", "mb-4"], [1, "w-10", "h-10", "rounded-xl", "bg-blue-600", "text-white", "flex", "items-center", "justify-center", "font-black", "shadow-md"], [1, "fa-solid", "fa-circle-check", "text-xl"], [1, "text-base", "font-extrabold", "text-blue-950", "dark:text-blue-200", "m-0"], [1, "text-xs", "text-blue-700", "dark:text-blue-300", "font-semibold", "m-0"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-3", "text-xs", "font-semibold"], [1, "bg-white/80", "dark:bg-slate-800/80", "p-3.5", "rounded-2xl", "border", "border-blue-100", "dark:border-blue-900/50"], [1, "text-blue-600", "dark:text-blue-400", "font-bold", "block", "mb-1"], [1, "text-[11px]", "bg-blue-100", "dark:bg-blue-950", "text-blue-800", "dark:text-blue-300", "px-2", "py-0.5", "rounded", "font-mono", "font-bold", "border", "border-blue-200", "dark:border-blue-800"], [1, "text-[11px]", "text-slate-500", "dark:text-slate-400", "mt-1", "mb-0", "leading-normal"], [1, "text-slate-800", "dark:text-slate-200", "font-bold"], [1, "text-emerald-600", "dark:text-emerald-400", "font-bold"], [1, "bg-slate-50", "dark:bg-slate-900/50", "p-6", "rounded-2xl", "border", "border-slate-200", "dark:border-slate-800", "my-6"], [1, "text-lg", "font-extrabold", "text-slate-800", "dark:text-white", "mb-3", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-folder-open", "text-blue-600"], [1, "mb-3"], [1, "list-disc", "pl-5", "space-y-3"], [1, "bg-blue-100", "dark:bg-blue-950", "text-blue-700", "dark:text-blue-300", "px-2", "py-0.5", "rounded", "font-mono", "font-bold", "border", "border-blue-200", "dark:border-blue-800"], [1, "fa-solid", "fa-gears", "text-blue-600"], [1, "list-disc", "pl-5", "mt-2", "space-y-2"], [1, "fa-solid", "fa-lock", "text-blue-600"], [1, "list-disc", "pl-5", "space-y-2"], [1, "bg-emerald-50/50", "dark:bg-emerald-950/20", "p-6", "rounded-2xl", "border", "border-emerald-200", "dark:border-emerald-900/50", "my-6"], [1, "text-lg", "font-extrabold", "text-emerald-900", "dark:text-emerald-200", "mb-3", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-shield-cat", "text-emerald-600"], [1, "m-0", "text-slate-700", "dark:text-slate-300"], [1, "bg-red-50/50", "dark:bg-red-950/20", "p-6", "rounded-2xl", "border", "border-red-200", "dark:border-red-900/50", "my-6"], [1, "text-lg", "font-extrabold", "text-red-900", "dark:text-red-200", "mb-3", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-user-slash", "text-red-600"], [1, "list-disc", "pl-5", "space-y-2", "mb-4"], [1, "text-sm", "text-slate-600", "dark:text-slate-300"], [1, "fa-solid", "fa-fire", "text-orange-500"], [1, "fa-solid", "fa-user-xmark", "text-blue-600"], [1, "list-decimal", "pl-5", "mt-2", "space-y-2"], ["href", "https://myaccount.google.com/permissions", "target", "_blank", "rel", "noopener", 1, "text-blue-600", "font-bold", "hover:underline"], [1, "border-t", "border-slate-200", "dark:border-slate-700/80", "pt-6", "mt-8"], [1, "fa-solid", "fa-envelope-open-text", "text-blue-600"], [1, "mt-4", "p-4", "bg-blue-50", "dark:bg-slate-900", "border", "border-blue-100", "dark:border-slate-700/80", "rounded-2xl", "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "bg-blue-100", "dark:bg-slate-800", "rounded-xl", "flex", "items-center", "justify-center", "text-blue-600"], [1, "fa-solid", "fa-envelope"], [1, "text-xs", "text-slate-400", "dark:text-slate-500", "font-semibold", "uppercase"], ["href", "mailto:chuannafi6@gmail.com", 1, "text-sm", "font-bold", "text-blue-600", "dark:text-blue-400", "hover:underline"], [1, "text-center", "mt-8", "text-xs", "text-slate-400", "dark:text-slate-500", "select-none"]], template: function PrivacyPolicyComponent_Template(rf, ctx) { if (rf & 1) {
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
            i0.ɵɵlistener("click", function PrivacyPolicyComponent_Template_button_click_11_listener() { return ctx.goBack(); });
            i0.ɵɵelement(12, "i", 9);
            i0.ɵɵtext(13, " Quay L\u1EA1i ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(14, "div", 10)(15, "div", 11)(16, "h2", 12);
            i0.ɵɵtext(17, "Ch\u00EDnh S\u00E1ch B\u1EA3o M\u1EADt & Quy\u1EC1n Ri\u00EAng T\u01B0");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "div", 13);
            i0.ɵɵelement(19, "i", 14);
            i0.ɵɵelementStart(20, "span");
            i0.ɵɵtext(21, "C\u1EADp nh\u1EADt l\u1EA7n cu\u1ED1i: 30/07/2026");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(22, "div", 15)(23, "p");
            i0.ɵɵtext(24, " Ch\u00E0o m\u1EEBng b\u1EA1n \u0111\u1EBFn v\u1EDBi ");
            i0.ɵɵelementStart(25, "strong");
            i0.ɵɵtext(26, "NAFIQPM6 LIMS Cloud");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(27, " (H\u1EC7 th\u1ED1ng qu\u1EA3n l\u00FD th\u00F4ng tin ph\u00F2ng th\u00ED nghi\u1EC7m). Ch\u00FAng t\u00F4i cam k\u1EBFt b\u1EA3o v\u1EC7 tuy\u1EC7t \u0111\u1ED1i th\u00F4ng tin c\u00E1 nh\u00E2n v\u00E0 d\u1EEF li\u1EC7u ri\u00EAng t\u01B0 c\u1EE7a b\u1EA1n. Ch\u00EDnh s\u00E1ch b\u1EA3o m\u1EADt n\u00E0y gi\u1EA3i th\u00EDch chi ti\u1EBFt v\u00E0 minh b\u1EA1ch c\u00E1ch \u1EE9ng d\u1EE5ng thu th\u1EADp, s\u1EED d\u1EE5ng v\u00E0 b\u1EA3o v\u1EC7 d\u1EEF li\u1EC7u khi b\u1EA1n s\u1EED d\u1EE5ng c\u00E1c t\u00EDnh n\u0103ng li\u00EAn quan \u0111\u1EBFn t\u00E0i kho\u1EA3n v\u00E0 t\u00EDch h\u1EE3p Google API. ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(28, "div", 16)(29, "div", 17)(30, "div", 18);
            i0.ɵɵelement(31, "i", 19);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(32, "div")(33, "h3", 20);
            i0.ɵɵtext(34, "T\u00F3m T\u1EAFt Cam K\u1EBFt B\u1EA3o M\u1EADt (Google OAuth Summary)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(35, "p", 21);
            i0.ɵɵtext(36, "D\u00E0nh cho Ng\u01B0\u1EDDi D\u00F9ng & \u0110\u1ED9i ng\u0169 Ki\u1EC3m duy\u1EC7t Google Cloud");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(37, "div", 22)(38, "div", 23)(39, "span", 24);
            i0.ɵɵtext(40, "\uD83D\uDD11 Ph\u1EA1m Vi Truy C\u1EADp (Scope)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(41, "code", 25);
            i0.ɵɵtext(42, "drive.file");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(43, "p", 26);
            i0.ɵɵtext(44, "Ch\u1EC9 thao t\u00E1c v\u1EDBi t\u1EC7p do ch\u00EDnh \u1EE9ng d\u1EE5ng n\u00E0y t\u1EA1o ra.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(45, "div", 23)(46, "span", 24);
            i0.ɵɵtext(47, "\uD83D\uDCC2 N\u01A1i L\u01B0u Tr\u1EEF (Storage)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(48, "span", 27);
            i0.ɵɵtext(49, "Th\u01B0 m\u1EE5c Ph\u00F2ng Lab");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(50, "p", 26);
            i0.ɵɵtext(51, "L\u01B0u tr\u1EF1c ti\u1EBFp v\u00E0o th\u01B0 m\u1EE5c d\u00F9ng chung \u0111\u01B0\u1EE3c c\u1EA5p quy\u1EC1n.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(52, "div", 23)(53, "span", 24);
            i0.ɵɵtext(54, "\uD83D\uDEE1\uFE0F Chia S\u1EBB D\u1EEF Li\u1EC7u");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(55, "span", 28);
            i0.ɵɵtext(56, "Cam K\u1EBFt 0% Chia S\u1EBB");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(57, "p", 26);
            i0.ɵɵtext(58, "Kh\u00F4ng b\u00E1n, truy\u1EC1n hay l\u01B0u tr\u1EEF d\u1EEF li\u1EC7u sang b\u00EAn th\u1EE9 ba.");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(59, "div", 29)(60, "h3", 30);
            i0.ɵɵelement(61, "i", 31);
            i0.ɵɵtext(62, " 1. Thu Th\u1EADp D\u1EEF Li\u1EC7u v\u00E0 Ph\u1EA1m Vi Truy C\u1EADp Google API ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(63, "p", 32);
            i0.ɵɵtext(64, " H\u1EC7 th\u1ED1ng c\u1EE7a ch\u00FAng t\u00F4i t\u00EDch h\u1EE3p d\u1ECBch v\u1EE5 Google Drive API \u0111\u1EC3 ph\u1EE5c v\u1EE5 t\u00EDnh n\u0103ng l\u01B0u tr\u1EEF b\u00E1o c\u00E1o ki\u1EC3m nghi\u1EC7m. C\u1EE5 th\u1EC3: ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(65, "ul", 33)(66, "li")(67, "strong");
            i0.ɵɵtext(68, "Ph\u1EA1m vi truy c\u1EADp (OAuth Scope):");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(69, " \u1EE8ng d\u1EE5ng ch\u1EC9 y\u00EAu c\u1EA7u quy\u1EC1n ");
            i0.ɵɵelementStart(70, "code", 34);
            i0.ɵɵtext(71, "https://www.googleapis.com/auth/drive.file");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(72, ". Quy\u1EC1n n\u00E0y ");
            i0.ɵɵelementStart(73, "strong");
            i0.ɵɵtext(74, "KH\u00D4NG");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(75, " cho ph\u00E9p \u1EE9ng d\u1EE5ng \u0111\u1ECDc ho\u1EB7c xem to\u00E0n b\u1ED9 Google Drive c\u1EE7a b\u1EA1n, m\u00E0 ");
            i0.ɵɵelementStart(76, "strong");
            i0.ɵɵtext(77, "ch\u1EC9 gi\u1EDBi h\u1EA1n");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(78, " \u0111\u1ECDc, ghi v\u00E0 c\u1EADp nh\u1EADt c\u00E1c t\u1EC7p tin \u0111\u01B0\u1EE3c t\u1EA1o b\u1EDFi ch\u00EDnh \u1EE9ng d\u1EE5ng n\u00E0y. ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(79, "li")(80, "strong");
            i0.ɵɵtext(81, "Lo\u1EA1i t\u1EC7p tin t\u01B0\u01A1ng t\u00E1c:");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(82, " \u1EE8ng d\u1EE5ng ch\u1EC9 t\u1EA1o v\u00E0 l\u00E0m vi\u1EC7c v\u1EDBi c\u00E1c t\u1EC7p tin b\u00E1o c\u00E1o k\u1EBFt qu\u1EA3 th\u00ED nghi\u1EC7m, ch\u1EE9ng ch\u1EC9 ch\u1EA5t l\u01B0\u1EE3ng (CoA) ho\u1EB7c bi\u1EC3u m\u1EABu SOP d\u01B0\u1EDBi d\u1EA1ng t\u1EC7p Excel/PDF do ng\u01B0\u1EDDi d\u00F9ng ch\u1ECDn xu\u1EA5t. ");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(83, "div", 29)(84, "h3", 30);
            i0.ɵɵelement(85, "i", 35);
            i0.ɵɵtext(86, " 2. M\u1EE5c \u0110\u00EDch S\u1EED D\u1EE5ng D\u1EEF Li\u1EC7u ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(87, "p");
            i0.ɵɵtext(88, " D\u1EEF li\u1EC7u truy c\u1EADp th\u00F4ng qua Google OAuth ch\u1EC9 \u0111\u01B0\u1EE3c s\u1EED d\u1EE5ng ph\u1EE5c v\u1EE5 c\u00E1c ch\u1EE9c n\u0103ng nghi\u1EC7p v\u1EE5 c\u1ED1t l\u00F5i sau: ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(89, "ul", 36)(90, "li");
            i0.ɵɵtext(91, "T\u1EA3i c\u00E1c m\u1EABu b\u00E1o c\u00E1o ti\u00EAu chu\u1EA9n t\u1EEB Google Drive xu\u1ED1ng \u1EE9ng d\u1EE5ng \u0111\u1EC3 x\u1EED l\u00FD t\u00EDnh to\u00E1n.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(92, "li");
            i0.ɵɵtext(93, "L\u01B0u tr\u1EEF c\u00E1c k\u1EBFt qu\u1EA3 ph\u00E2n t\u00EDch ph\u00F2ng th\u00ED nghi\u1EC7m d\u01B0\u1EDBi d\u1EA1ng t\u1EC7p Excel ho\u1EB7c PDF tr\u1EF1c ti\u1EBFp v\u00E0o th\u01B0 m\u1EE5c d\u00F9ng chung c\u1EE7a ph\u00F2ng th\u00ED nghi\u1EC7m \u0111\u01B0\u1EE3c ph\u00E2n quy\u1EC1n \u0111\u1EC3 ph\u1EE5c v\u1EE5 m\u1EE5c \u0111\u00EDch in \u1EA5n, tra c\u1EE9u v\u00E0 l\u01B0u tr\u1EEF h\u1ED3 s\u01A1.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(94, "li");
            i0.ɵɵtext(95, "\u0110\u1ECDc c\u1EA5u h\u00ECnh ti\u00EAu chu\u1EA9n d\u1EA1ng JSON tr\u00EAn Drive \u0111\u1EC3 \u0111\u1ED3ng b\u1ED9 quy tr\u00ECnh ph\u00E2n t\u00EDch.");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(96, "div", 29)(97, "h3", 30);
            i0.ɵɵelement(98, "i", 37);
            i0.ɵɵtext(99, " 3. L\u01B0u Tr\u1EEF v\u00E0 B\u1EA3o M\u1EADt D\u1EEF Li\u1EC7u ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(100, "p", 32);
            i0.ɵɵtext(101, " Ch\u00FAng t\u00F4i \u00E1p d\u1EE5ng ti\u00EAu chu\u1EA9n an ninh cao nh\u1EA5t \u0111\u1EC3 b\u1EA3o v\u1EC7 th\u00F4ng tin x\u00E1c th\u1EF1c c\u1EE7a b\u1EA1n: ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(102, "ul", 38)(103, "li")(104, "strong");
            i0.ɵɵtext(105, "M\u00E3 th\u00F4ng b\u00E1o truy c\u1EADp (Access Token):");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(106, " M\u00E3 truy c\u1EADp Google OAuth \u0111\u01B0\u1EE3c x\u1EED l\u00FD tr\u1EF1c ti\u1EBFp trong tr\u00ECnh duy\u1EC7t c\u1EE7a ng\u01B0\u1EDDi d\u00F9ng (Client-Side) ho\u1EB7c cookie b\u1EA3o m\u1EADt m\u00E3 h\u00F3a. Ch\u00FAng t\u00F4i ");
            i0.ɵɵelementStart(107, "strong");
            i0.ɵɵtext(108, "KH\u00D4NG");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(109, " truy\u1EC1n, l\u01B0u tr\u1EEF hay chia s\u1EBB m\u00E3 n\u00E0y tr\u00EAn b\u1EA5t k\u1EF3 m\u00E1y ch\u1EE7 trung gian n\u00E0o c\u1EE7a b\u00EAn th\u1EE9 ba. ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(110, "li")(111, "strong");
            i0.ɵɵtext(112, "D\u1EEF li\u1EC7u t\u1EC7p tin:");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(113, " To\u00E0n b\u1ED9 t\u00E0i li\u1EC7u b\u00E1o c\u00E1o c\u1EE7a b\u1EA1n \u0111\u01B0\u1EE3c l\u01B0u tr\u1EF1c ti\u1EBFp v\u00E0o th\u01B0 m\u1EE5c l\u01B0u tr\u1EEF d\u00F9ng chung c\u1EE7a ph\u00F2ng th\u00ED nghi\u1EC7m \u0111\u01B0\u1EE3c c\u1EA5p quy\u1EC1n. \u1EE8ng d\u1EE5ng kh\u00F4ng sao l\u01B0u d\u1EEF li\u1EC7u n\u00E0y \u1EDF c\u00E1c m\u00E1y ch\u1EE7 kh\u00E1c ngo\u1EA1i tr\u1EEB c\u00E1c c\u01A1 s\u1EDF d\u1EEF li\u1EC7u n\u1ED9i b\u1ED9 \u0111\u01B0\u1EE3c b\u1EA3o m\u1EADt ph\u1EE5c v\u1EE5 v\u1EADn h\u00E0nh. ");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(114, "div", 39)(115, "h3", 40);
            i0.ɵɵelement(116, "i", 41);
            i0.ɵɵtext(117, " 4. Cam K\u1EBFt Kh\u00F4ng Chia S\u1EBB Th\u00F4ng Tin ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(118, "p", 42);
            i0.ɵɵtext(119, " Ch\u00FAng t\u00F4i tuy\u1EC7t \u0111\u1ED1i ");
            i0.ɵɵelementStart(120, "strong");
            i0.ɵɵtext(121, "KH\u00D4NG");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(122, " chia s\u1EBB, b\u00E1n, trao \u0111\u1ED5i ho\u1EB7c chuy\u1EC3n giao th\u00F4ng tin c\u00E1 nh\u00E2n hay d\u1EEF li\u1EC7u t\u1EEB Google Drive c\u1EE7a b\u1EA1n cho b\u1EA5t k\u1EF3 b\u00EAn th\u1EE9 ba n\u00E0o. D\u1EEF li\u1EC7u n\u00E0y ch\u1EC9 thu\u1ED9c s\u1EDF h\u1EEFu c\u1EE7a ph\u00F2ng th\u00ED nghi\u1EC7m v\u00E0 ch\u1EC9 ph\u1EE5c v\u1EE5 vi\u1EC7c v\u1EADn h\u00E0nh ch\u1EE9c n\u0103ng \u1EE9ng d\u1EE5ng theo h\u00E0nh \u0111\u1ED9ng th\u1EF1c t\u1EBF c\u1EE7a b\u1EA1n. ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(123, "div", 43)(124, "h3", 44);
            i0.ɵɵelement(125, "i", 45);
            i0.ɵɵtext(126, " 5. Quy\u1EC1n X\u00F3a v\u00E0 \u1EA8n Danh Ho\u00E1 T\u00E0i Kho\u1EA3n ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(127, "p", 32);
            i0.ɵɵtext(128, " Theo y\u00EAu c\u1EA7u c\u1EE7a Apple App Store v\u00E0 ch\u00EDnh s\u00E1ch GDPR, b\u1EA1n c\u00F3 quy\u1EC1n y\u00EAu c\u1EA7u \u1EA9n danh ho\u00E1 th\u00F4ng tin c\u00E1 nh\u00E2n b\u1EA5t k\u1EF3 l\u00FAc n\u00E0o. ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(129, "ul", 46)(130, "li")(131, "strong");
            i0.ɵɵtext(132, "Th\u00F4ng tin \u0111\u01B0\u1EE3c \u1EA9n danh ho\u00E1:");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(133, " \u0110\u1ECBa ch\u1EC9 email v\u00E0 \u1EA3nh \u0111\u1EA1i di\u1EC7n.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(134, "li")(135, "strong");
            i0.ɵɵtext(136, "Th\u00F4ng tin \u0111\u01B0\u1EE3c gi\u1EEF l\u1EA1i:");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(137, " T\u00EAn hi\u1EC3n th\u1ECB v\u00E0 UID \u0111\u01B0\u1EE3c gi\u1EEF \u0111\u1EC3 ph\u1EE5c v\u1EE5 audit trail v\u00E0 t\u00EDnh to\u00E0n v\u1EB9n d\u1EEF li\u1EC7u k\u1EBFt qu\u1EA3 ki\u1EC3m nghi\u1EC7m.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(138, "li")(139, "strong");
            i0.ɵɵtext(140, "C\u00E1ch th\u1EF1c hi\u1EC7n:");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(141, " V\u00E0o ");
            i0.ɵɵelementStart(142, "strong");
            i0.ɵɵtext(143, "Trang c\u00E1 nh\u00E2n \u2192 Qu\u1EA3n l\u00FD T\u00E0i Kho\u1EA3n");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(144, " v\u00E0 b\u1EA5m n\u00FAt \u201C\u1EA8n danh ho\u00E1 th\u00F4ng tin c\u00E1 nh\u00E2n\u201D.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(145, "li")(146, "strong");
            i0.ɵɵtext(147, "Hi\u1EC7u l\u1EF1c t\u1EE9c th\u00EC:");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(148, " Sau khi x\u00E1c nh\u1EADn, h\u1EC7 th\u1ED1ng s\u1EBD th\u1EF1c hi\u1EC7n trong v\u00F2ng 60 gi\u00E2y.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(149, "p", 47);
            i0.ɵɵtext(150, " N\u1EBFu b\u1EA1n mu\u1ED1n x\u00F3a ho\u00E0n to\u00E0n t\u00E0i kho\u1EA3n v\u00E0 to\u00E0n b\u1ED9 d\u1EEF li\u1EC7u li\u00EAn quan, vui l\u00F2ng li\u00EAn h\u1EC7 tr\u1EF1c ti\u1EBFp qu\u1EA3n tr\u1ECB vi\u00EAn qua email b\u00EAn d\u01B0\u1EDBi. ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(151, "div", 29)(152, "h3", 30);
            i0.ɵɵelement(153, "i", 48);
            i0.ɵɵtext(154, " 6. D\u1ECBch V\u1EE5 Firebase v\u00E0 Th\u00F4ng B\u00E1o \u0110\u1EA9y ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(155, "p", 32);
            i0.ɵɵtext(156, "H\u1EC7 th\u1ED1ng s\u1EED d\u1EE5ng c\u00E1c d\u1ECBch v\u1EE5 Google Firebase:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(157, "ul", 38)(158, "li")(159, "strong");
            i0.ɵɵtext(160, "Firebase Authentication:");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(161, " H\u1ED7 tr\u1EE3 \u0111\u0103ng nh\u1EADp b\u1EB1ng Google ho\u1EB7c Gmail/email v\u00E0 m\u1EADt kh\u1EA9u LIMS. Hai ph\u01B0\u01A1ng th\u1EE9c \u0111\u01B0\u1EE3c li\u00EAn k\u1EBFt v\u1EC1 c\u00F9ng m\u1ED9t UID; m\u1EADt kh\u1EA9u LIMS \u0111\u01B0\u1EE3c Firebase b\u1EA3o v\u1EC7 d\u01B0\u1EDBi d\u1EA1ng hash v\u00E0 kh\u00F4ng ph\u1EA3i m\u1EADt kh\u1EA9u Google.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(162, "li")(163, "strong");
            i0.ɵɵtext(164, "Cloud Firestore:");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(165, " L\u01B0u tr\u1EEF d\u1EEF li\u1EC7u nghi\u1EC7p v\u1EE5 (k\u1EBFt qu\u1EA3 ki\u1EC3m nghi\u1EC7m, s\u1ED1 l\u01B0\u1EE3ng, SOP). To\u00E0n b\u1ED9 d\u1EEF li\u1EC7u thu\u1ED9c s\u1EDF h\u1EEFu c\u1EE7a ph\u00F2ng th\u00ED nghi\u1EC7m NAFIQPM6.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(166, "li")(167, "strong");
            i0.ɵɵtext(168, "Firebase Cloud Messaging (FCM):");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(169, " G\u1EEDi th\u00F4ng b\u00E1o \u0111\u1EA9y n\u1ED9i b\u1ED9 (c\u1EA3nh b\u00E1o h\u1EBFt h\u1EA1n, y\u00EAu c\u1EA7u duy\u1EC7t). FCM token \u0111\u01B0\u1EE3c l\u01B0u tr\u00EAn thi\u1EBFt b\u1ECB v\u00E0 Firestore, ch\u1EC9 d\u00F9ng \u0111\u1EC3 g\u1EEDi th\u00F4ng b\u00E1o n\u1ED9i b\u1ED9, kh\u00F4ng chia s\u1EBB b\u00EAn ngo\u00E0i.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(170, "li")(171, "strong");
            i0.ɵɵtext(172, "Vercel (hosting):");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(173, " \u1EE8ng d\u1EE5ng \u0111\u01B0\u1EE3c tri\u1EC3n khai tr\u00EAn Vercel. Vercel c\u00F3 th\u1EC3 l\u01B0u access log (IP, user agent) trong t\u1ED1i \u0111a 30 ng\u00E0y theo ch\u00EDnh s\u00E1ch ri\u00EAng c\u1EE7a h\u1ECD.");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(174, "div", 29)(175, "h3", 30);
            i0.ɵɵelement(176, "i", 49);
            i0.ɵɵtext(177, " 7. Quy\u1EC1n Ki\u1EC3m So\u00E1t v\u00E0 Thu H\u1ED3i Quy\u1EC1n Truy C\u1EADp Google ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(178, "p");
            i0.ɵɵtext(179, " B\u1EA1n c\u00F3 to\u00E0n quy\u1EC1n ki\u1EC3m so\u00E1t t\u00E0i kho\u1EA3n c\u1EE7a m\u00ECnh. B\u1EA1n c\u00F3 th\u1EC3 thu h\u1ED3i quy\u1EC1n truy c\u1EADp Google Drive b\u1EA5t k\u1EF3 l\u00FAc n\u00E0o b\u1EB1ng c\u00E1ch: ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(180, "ol", 50)(181, "li");
            i0.ɵɵtext(182, "Truy c\u1EADp trang c\u00E0i \u0111\u1EB7t b\u1EA3o m\u1EADt t\u00E0i kho\u1EA3n Google c\u1EE7a b\u1EA1n t\u1EA1i: ");
            i0.ɵɵelementStart(183, "a", 51);
            i0.ɵɵtext(184, "My Account Permissions");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(185, ".");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(186, "li");
            i0.ɵɵtext(187, "Ch\u1ECDn \u1EE9ng d\u1EE5ng ");
            i0.ɵɵelementStart(188, "strong");
            i0.ɵɵtext(189, "NAFIQPM6 LIMS Cloud");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(190, ".");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(191, "li");
            i0.ɵɵtext(192, "Nh\u1EA5n n\u00FAt ");
            i0.ɵɵelementStart(193, "strong");
            i0.ɵɵtext(194, "X\u00F3a quy\u1EC1n truy c\u1EADp (Remove Access)");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(195, ".");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(196, "div", 52)(197, "h3", 30);
            i0.ɵɵelement(198, "i", 53);
            i0.ɵɵtext(199, " 8. Li\u00EAn H\u1EC7 H\u1ED7 Tr\u1EE3 ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(200, "p");
            i0.ɵɵtext(201, " N\u1EBFu b\u1EA1n c\u00F3 b\u1EA5t k\u1EF3 c\u00E2u h\u1ECFi n\u00E0o li\u00EAn quan \u0111\u1EBFn Ch\u00EDnh s\u00E1ch B\u1EA3o m\u1EADt n\u00E0y ho\u1EB7c c\u00E1c v\u1EA5n \u0111\u1EC1 k\u1EF9 thu\u1EADt kh\u00E1c, vui l\u00F2ng li\u00EAn h\u1EC7 qu\u1EA3n tr\u1ECB vi\u00EAn: ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(202, "div", 54)(203, "div", 55);
            i0.ɵɵelement(204, "i", 56);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(205, "div")(206, "div", 57);
            i0.ɵɵtext(207, "Email li\u00EAn h\u1EC7");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(208, "a", 58);
            i0.ɵɵtext(209, "chuannafi6@gmail.com");
            i0.ɵɵelementEnd()()()()()();
            i0.ɵɵelementStart(210, "div", 59);
            i0.ɵɵtext(211);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(211);
            i0.ɵɵtextInterpolate1(" \u00A9 ", ctx.year, " NAFIQPM6 LIMS Cloud. B\u1EA3o l\u01B0u m\u1ECDi quy\u1EC1n. ");
        } }, dependencies: [CommonModule], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PrivacyPolicyComponent, [{
        type: Component,
        args: [{
                selector: 'app-privacy-policy',
                standalone: true,
                imports: [CommonModule],
                template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div class="max-w-4xl mx-auto">
        <!-- Back Button & Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <i class="fa-solid fa-shield-halved text-2xl"></i>
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

        <!-- Privacy Card -->
        <div class="bg-white dark:bg-slate-800 shadow-soft-xl border border-slate-100 dark:border-slate-700/50 rounded-3xl p-6 sm:p-10 transition-all duration-300">
          <div class="border-b border-slate-100 dark:border-slate-700/80 pb-6 mb-8">
            <h2 class="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Chính Sách Bảo Mật & Quyền Riêng Tư</h2>
            <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-semibold">
              <i class="fa-regular fa-clock"></i>
              <span>Cập nhật lần cuối: 30/07/2026</span>
            </div>
          </div>

          <div class="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 space-y-6 text-sm sm:text-base leading-relaxed">
            <p>
              Chào mừng bạn đến với <strong>NAFIQPM6 LIMS Cloud</strong> (Hệ thống quản lý thông tin phòng thí nghiệm).
              Chúng tôi cam kết bảo vệ tuyệt đối thông tin cá nhân và dữ liệu riêng tư của bạn. Chính sách bảo mật này giải thích chi tiết và minh bạch cách ứng dụng thu thập, sử dụng và bảo vệ dữ liệu khi bạn sử dụng các tính năng liên quan đến tài khoản và tích hợp Google API.
            </p>

            <!-- HIGHLIGHT SUMMARY BOX FOR USERS & GOOGLE VERIFICATION TEAM -->
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/40 p-6 rounded-3xl border-2 border-blue-200 dark:border-blue-800/60 shadow-sm my-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md">
                  <i class="fa-solid fa-circle-check text-xl"></i>
                </div>
                <div>
                  <h3 class="text-base font-extrabold text-blue-950 dark:text-blue-200 m-0">Tóm Tắt Cam Kết Bảo Mật (Google OAuth Summary)</h3>
                  <p class="text-xs text-blue-700 dark:text-blue-300 font-semibold m-0">Dành cho Người Dùng & Đội ngũ Kiểm duyệt Google Cloud</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-semibold">
                <div class="bg-white/80 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-blue-100 dark:border-blue-900/50">
                  <span class="text-blue-600 dark:text-blue-400 font-bold block mb-1">🔑 Phạm Vi Truy Cập (Scope)</span>
                  <code class="text-[11px] bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded font-mono font-bold border border-blue-200 dark:border-blue-800">drive.file</code>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 mb-0 leading-normal">Chỉ thao tác với tệp do chính ứng dụng này tạo ra.</p>
                </div>
                <div class="bg-white/80 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-blue-100 dark:border-blue-900/50">
                  <span class="text-blue-600 dark:text-blue-400 font-bold block mb-1">📂 Nơi Lưu Trữ (Storage)</span>
                  <span class="text-slate-800 dark:text-slate-200 font-bold">Thư mục Phòng Lab</span>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 mb-0 leading-normal">Lưu trực tiếp vào thư mục dùng chung được cấp quyền.</p>
                </div>
                <div class="bg-white/80 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-blue-100 dark:border-blue-900/50">
                  <span class="text-blue-600 dark:text-blue-400 font-bold block mb-1">🛡️ Chia Sẻ Dữ Liệu</span>
                  <span class="text-emerald-600 dark:text-emerald-400 font-bold">Cam Kết 0% Chia Sẻ</span>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 mb-0 leading-normal">Không bán, truyền hay lưu trữ dữ liệu sang bên thứ ba.</p>
                </div>
              </div>
            </div>

            <!-- Section 1 -->
            <div class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 my-6">
              <h3 class="text-lg font-extrabold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-folder-open text-blue-600"></i> 1. Thu Thập Dữ Liệu và Phạm Vi Truy Cập Google API
              </h3>
              <p class="mb-3">
                Hệ thống của chúng tôi tích hợp dịch vụ Google Drive API để phục vụ tính năng lưu trữ báo cáo kiểm nghiệm. Cụ thể:
              </p>
              <ul class="list-disc pl-5 space-y-3">
                <li>
                  <strong>Phạm vi truy cập (OAuth Scope):</strong> Ứng dụng chỉ yêu cầu quyền 
                  <code class="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-mono font-bold border border-blue-200 dark:border-blue-800">https://www.googleapis.com/auth/drive.file</code>. 
                  Quyền này <strong>KHÔNG</strong> cho phép ứng dụng đọc hoặc xem toàn bộ Google Drive của bạn, mà <strong>chỉ giới hạn</strong> đọc, ghi và cập nhật các tệp tin được tạo bởi chính ứng dụng này.
                </li>
                <li>
                  <strong>Loại tệp tin tương tác:</strong> Ứng dụng chỉ tạo và làm việc với các tệp tin báo cáo kết quả thí nghiệm, chứng chỉ chất lượng (CoA) hoặc biểu mẫu SOP dưới dạng tệp Excel/PDF do người dùng chọn xuất.
                </li>
              </ul>
            </div>

            <!-- Section 2 -->
            <div class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 my-6">
              <h3 class="text-lg font-extrabold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-gears text-blue-600"></i> 2. Mục Đích Sử Dụng Dữ Liệu
              </h3>
              <p>
                Dữ liệu truy cập thông qua Google OAuth chỉ được sử dụng phục vụ các chức năng nghiệp vụ cốt lõi sau:
              </p>
              <ul class="list-disc pl-5 mt-2 space-y-2">
                <li>Tải các mẫu báo cáo tiêu chuẩn từ Google Drive xuống ứng dụng để xử lý tính toán.</li>
                <li>Lưu trữ các kết quả phân tích phòng thí nghiệm dưới dạng tệp Excel hoặc PDF trực tiếp vào thư mục dùng chung của phòng thí nghiệm được phân quyền để phục vụ mục đích in ấn, tra cứu và lưu trữ hồ sơ.</li>
                <li>Đọc cấu hình tiêu chuẩn dạng JSON trên Drive để đồng bộ quy trình phân tích.</li>
              </ul>
            </div>

            <!-- Section 3 -->
            <div class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 my-6">
              <h3 class="text-lg font-extrabold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-lock text-blue-600"></i> 3. Lưu Trữ và Bảo Mật Dữ Liệu
              </h3>
              <p class="mb-3">
                Chúng tôi áp dụng tiêu chuẩn an ninh cao nhất để bảo vệ thông tin xác thực của bạn:
              </p>
              <ul class="list-disc pl-5 space-y-2">
                <li>
                  <strong>Mã thông báo truy cập (Access Token):</strong> Mã truy cập Google OAuth được xử lý trực tiếp trong trình duyệt của người dùng (Client-Side) hoặc cookie bảo mật mã hóa. Chúng tôi <strong>KHÔNG</strong> truyền, lưu trữ hay chia sẻ mã này trên bất kỳ máy chủ trung gian nào của bên thứ ba.
                </li>
                <li>
                  <strong>Dữ liệu tệp tin:</strong> Toàn bộ tài liệu báo cáo của bạn được lưu trực tiếp vào thư mục lưu trữ dùng chung của phòng thí nghiệm được cấp quyền. Ứng dụng không sao lưu dữ liệu này ở các máy chủ khác ngoại trừ các cơ sở dữ liệu nội bộ được bảo mật phục vụ vận hành.
                </li>
              </ul>
            </div>

            <!-- Section 4 -->
            <div class="bg-emerald-50/50 dark:bg-emerald-950/20 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 my-6">
              <h3 class="text-lg font-extrabold text-emerald-900 dark:text-emerald-200 mb-3 flex items-center gap-2">
                <i class="fa-solid fa-shield-cat text-emerald-600"></i> 4. Cam Kết Không Chia Sẻ Thông Tin
              </h3>
              <p class="m-0 text-slate-700 dark:text-slate-300">
                Chúng tôi tuyệt đối <strong>KHÔNG</strong> chia sẻ, bán, trao đổi hoặc chuyển giao thông tin cá nhân hay dữ liệu từ Google Drive của bạn cho bất kỳ bên thứ ba nào. Dữ liệu này chỉ thuộc sở hữu của phòng thí nghiệm và chỉ phục vụ việc vận hành chức năng ứng dụng theo hành động thực tế của bạn.
              </p>
            </div>

            <!-- Section 5: Xoa tai khoan -->
            <div class="bg-red-50/50 dark:bg-red-950/20 p-6 rounded-2xl border border-red-200 dark:border-red-900/50 my-6">
              <h3 class="text-lg font-extrabold text-red-900 dark:text-red-200 mb-3 flex items-center gap-2">
                <i class="fa-solid fa-user-slash text-red-600"></i> 5. Quyền Xóa và Ẩn Danh Hoá Tài Khoản
              </h3>
              <p class="mb-3">
                Theo yêu cầu của Apple App Store và chính sách GDPR, bạn có quyền yêu cầu ẩn danh hoá thông tin cá nhân bất kỳ lúc nào.
              </p>
              <ul class="list-disc pl-5 space-y-2 mb-4">
                <li><strong>Thông tin được ẩn danh hoá:</strong> Địa chỉ email và ảnh đại diện.</li>
                <li><strong>Thông tin được giữ lại:</strong> Tên hiển thị và UID được giữ để phục vụ audit trail và tính toàn vẹn dữ liệu kết quả kiểm nghiệm.</li>
                <li><strong>Cách thực hiện:</strong> Vào <strong>Trang cá nhân → Quản lý Tài Khoản</strong> và bấm nút “Ẩn danh hoá thông tin cá nhân”.</li>
                <li><strong>Hiệu lực tức thì:</strong> Sau khi xác nhận, hệ thống sẽ thực hiện trong vòng 60 giây.</li>
              </ul>
              <p class="text-sm text-slate-600 dark:text-slate-300">
                Nếu bạn muốn xóa hoàn toàn tài khoản và toàn bộ dữ liệu liên quan, vui lòng liên hệ trực tiếp quản trị viên qua email bên dưới.
              </p>
            </div>

            <!-- Section 6: Firebase/FCM -->
            <div class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 my-6">
              <h3 class="text-lg font-extrabold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-fire text-orange-500"></i> 6. Dịch Vụ Firebase và Thông Báo Đẩy
              </h3>
              <p class="mb-3">Hệ thống sử dụng các dịch vụ Google Firebase:</p>
              <ul class="list-disc pl-5 space-y-2">
                <li><strong>Firebase Authentication:</strong> Hỗ trợ đăng nhập bằng Google hoặc Gmail/email và mật khẩu LIMS. Hai phương thức được liên kết về cùng một UID; mật khẩu LIMS được Firebase bảo vệ dưới dạng hash và không phải mật khẩu Google.</li>
                <li><strong>Cloud Firestore:</strong> Lưu trữ dữ liệu nghiệp vụ (kết quả kiểm nghiệm, số lượng, SOP). Toàn bộ dữ liệu thuộc sở hữu của phòng thí nghiệm NAFIQPM6.</li>
                <li><strong>Firebase Cloud Messaging (FCM):</strong> Gửi thông báo đẩy nội bộ (cảnh báo hết hạn, yêu cầu duyệt). FCM token được lưu trên thiết bị và Firestore, chỉ dùng để gửi thông báo nội bộ, không chia sẻ bên ngoài.</li>
                <li><strong>Vercel (hosting):</strong> Ứng dụng được triển khai trên Vercel. Vercel có thể lưu access log (IP, user agent) trong tối đa 30 ngày theo chính sách riêng của họ.</li>
              </ul>
            </div>

            <!-- Section 7: Quyen kiem soat -->
            <div class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 my-6">
              <h3 class="text-lg font-extrabold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-user-xmark text-blue-600"></i> 7. Quyền Kiểm Soát và Thu Hồi Quyền Truy Cập Google
              </h3>
              <p>
                Bạn có toàn quyền kiểm soát tài khoản của mình. Bạn có thể thu hồi quyền truy cập Google Drive bất kỳ lúc nào bằng cách:
              </p>
              <ol class="list-decimal pl-5 mt-2 space-y-2">
                <li>Truy cập trang cài đặt bảo mật tài khoản Google của bạn tại: <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener" class="text-blue-600 font-bold hover:underline">My Account Permissions</a>.</li>
                <li>Chọn ứng dụng <strong>NAFIQPM6 LIMS Cloud</strong>.</li>
                <li>Nhấn nút <strong>Xóa quyền truy cập (Remove Access)</strong>.</li>
              </ol>
            </div>

            <!-- Section 8: Lien he -->
            <div class="border-t border-slate-200 dark:border-slate-700/80 pt-6 mt-8">
              <h3 class="text-lg font-extrabold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <i class="fa-solid fa-envelope-open-text text-blue-600"></i> 8. Liên Hệ Hỗ Trợ
              </h3>
              <p>
                Nếu bạn có bất kỳ câu hỏi nào liên quan đến Chính sách Bảo mật này hoặc các vấn đề kỹ thuật khác, vui lòng liên hệ quản trị viên:
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
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PrivacyPolicyComponent, { className: "PrivacyPolicyComponent", filePath: "src/app/features/public/privacy-policy.component.ts", lineNumber: 215 }); })();
//# sourceMappingURL=privacy-policy.component.js.map