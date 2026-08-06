import { Component, input, output, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getExpiryClass, formatNum } from '../../../shared/utils/utils';
import { getFefoPredecessor } from '../../../shared/utils/standard-fefo';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.uid;
function StandardsAssignModalComponent_Conditional_0_Conditional_25_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 8)(1, "span", 9);
    i0.ɵɵtext(2, "M\u00E3 qu\u1EA3n l\u00FD");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 35);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate((tmp_2_0 = ctx_r1.std()) == null ? null : tmp_2_0.internal_id);
} }
function StandardsAssignModalComponent_Conditional_0_Conditional_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 13)(1, "div", 36);
    i0.ɵɵelement(2, "i", 37);
    i0.ɵɵelementStart(3, "span", 38);
    i0.ɵɵtext(4, "G\u1EE3i \u00FD FEFO");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "p", 39);
    i0.ɵɵtext(6, " L\u1ECD ");
    i0.ɵɵelementStart(7, "strong");
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const top_r3 = ctx;
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate(top_r3.internal_id || top_r3.lot_number);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" (h\u1EA1n: ", top_r3.expiry_date || "N/A", ") g\u1EA7n h\u1EBFt h\u1EA1n h\u01A1n \u2014 n\u00EAn \u0111\u01B0\u1EE3c c\u1EA5p tr\u01B0\u1EDBc. ");
} }
function StandardsAssignModalComponent_Conditional_0_Conditional_39_For_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 42);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const user_r5 = ctx.$implicit;
    i0.ɵɵproperty("value", user_r5.uid);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2("", user_r5.displayName, " (", user_r5.email, ")");
} }
function StandardsAssignModalComponent_Conditional_0_Conditional_39_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div")(1, "label", 25);
    i0.ɵɵtext(2, "Nh\u00E2n vi\u00EAn ti\u1EBFp nh\u1EADn ");
    i0.ɵɵelementStart(3, "span", 27);
    i0.ɵɵtext(4, "*");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "select", 40);
    i0.ɵɵlistener("ngModelChange", function StandardsAssignModalComponent_Conditional_0_Conditional_39_Template_select_ngModelChange_5_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onAssignUserChange($event)); });
    i0.ɵɵelementStart(6, "option", 41);
    i0.ɵɵtext(7, "-- Ch\u1ECDn nh\u00E2n vi\u00EAn --");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(8, StandardsAssignModalComponent_Conditional_0_Conditional_39_For_9_Template, 2, 3, "option", 42, _forTrack0);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngModel", ctx_r1.assignUserId());
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r1.userList());
} }
function StandardsAssignModalComponent_Conditional_0_Conditional_66_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 34);
} }
function StandardsAssignModalComponent_Conditional_0_Conditional_67_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 43);
    i0.ɵɵtext(1, " X\u00E1c nh\u1EADn m\u01B0\u1EE3n ");
} }
function StandardsAssignModalComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
    i0.ɵɵelement(4, "i", 4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "h3", 5);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div", 6);
    i0.ɵɵtext(8, "Th\u00F4ng tin chu\u1EA9n m\u01B0\u1EE3n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 7)(10, "div", 8)(11, "span", 9);
    i0.ɵɵtext(12, "S\u1ED1 L\u00F4 / Lot");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "span", 10);
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "div", 8)(16, "span", 9);
    i0.ɵɵtext(17, "H\u1EA1n d\u00F9ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "span", 11);
    i0.ɵɵtext(19);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(20, "div", 8)(21, "span", 9);
    i0.ɵɵtext(22, "L\u01B0\u1EE3ng t\u1ED3n kho");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "span", 12);
    i0.ɵɵtext(24);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(25, StandardsAssignModalComponent_Conditional_0_Conditional_25_Template, 5, 1, "div", 8);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(26, StandardsAssignModalComponent_Conditional_0_Conditional_26_Template, 10, 2, "div", 13);
    i0.ɵɵelementStart(27, "div", 14)(28, "div", 15)(29, "p", 16);
    i0.ɵɵelement(30, "i", 17);
    i0.ɵɵtext(31, " Vui l\u00F2ng ghi l\u1EA1i nh\u1EADt k\u00FD s\u1EED d\u1EE5ng sau khi pha xong \u0111\u1EC3 h\u1EC7 th\u1ED1ng tr\u1EEB kho ch\u00EDnh x\u00E1c. ");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(32, "div", 18)(33, "div", 19)(34, "h3", 20);
    i0.ɵɵtext(35);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(36, "button", 21);
    i0.ɵɵlistener("click", function StandardsAssignModalComponent_Conditional_0_Template_button_click_36_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeModal.emit()); });
    i0.ɵɵelement(37, "i", 22);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(38, "div", 23);
    i0.ɵɵtemplate(39, StandardsAssignModalComponent_Conditional_0_Conditional_39_Template, 10, 1, "div");
    i0.ɵɵelementStart(40, "div", 24)(41, "div")(42, "label", 25);
    i0.ɵɵtext(43);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(44, "input", 26);
    i0.ɵɵlistener("ngModelChange", function StandardsAssignModalComponent_Conditional_0_Template_input_ngModelChange_44_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.assignExpectedAmount.set($event)); });
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(45, "div")(46, "label", 25);
    i0.ɵɵtext(47, "M\u1EE5c \u0111\u00EDch s\u1EED d\u1EE5ng ");
    i0.ɵɵelementStart(48, "span", 27);
    i0.ɵɵtext(49, "*");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(50, "textarea", 28);
    i0.ɵɵlistener("ngModelChange", function StandardsAssignModalComponent_Conditional_0_Template_textarea_ngModelChange_50_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.assignPurpose.set($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(51, "div", 29)(52, "button", 30);
    i0.ɵɵlistener("click", function StandardsAssignModalComponent_Conditional_0_Template_button_click_52_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.assignPurpose.set("Pha chu\u1EA9n m\u1EDBi")); });
    i0.ɵɵtext(53, "# Pha Chu\u1EA9n M\u1EDBi");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(54, "button", 30);
    i0.ɵɵlistener("click", function StandardsAssignModalComponent_Conditional_0_Template_button_click_54_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.assignPurpose.set("Ki\u1EC3m tra \u0111\u1ECBnh k\u1EF3")); });
    i0.ɵɵtext(55, "# Ki\u1EC3m Tra \u0110\u1ECBnh K\u1EF3");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(56, "button", 30);
    i0.ɵɵlistener("click", function StandardsAssignModalComponent_Conditional_0_Template_button_click_56_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.assignPurpose.set("Ngo\u1EA1i ki\u1EC3m")); });
    i0.ɵɵtext(57, "# Ngo\u1EA1i Ki\u1EC3m");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(58, "button", 30);
    i0.ɵɵlistener("click", function StandardsAssignModalComponent_Conditional_0_Template_button_click_58_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.assignPurpose.set("Nghi\u00EAn c\u1EE9u ph\u00E1t tri\u1EC3n")); });
    i0.ɵɵtext(59, "# Nghi\u00EAn C\u1EE9u Ph\u00E1t Tri\u1EC3n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(60, "button", 30);
    i0.ɵɵlistener("click", function StandardsAssignModalComponent_Conditional_0_Template_button_click_60_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.assignPurpose.set("Ki\u1EC3m nghi\u1EC7m m\u1EABu")); });
    i0.ɵɵtext(61, "# Ki\u1EC3m Nghi\u1EC7m M\u1EABu");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(62, "div", 31)(63, "button", 32);
    i0.ɵɵlistener("click", function StandardsAssignModalComponent_Conditional_0_Template_button_click_63_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeModal.emit()); });
    i0.ɵɵtext(64, "H\u1EE7y B\u1ECF");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(65, "button", 33);
    i0.ɵɵlistener("click", function StandardsAssignModalComponent_Conditional_0_Template_button_click_65_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onConfirm()); });
    i0.ɵɵtemplate(66, StandardsAssignModalComponent_Conditional_0_Conditional_66_Template, 1, 0, "i", 34)(67, StandardsAssignModalComponent_Conditional_0_Conditional_67_Template, 2, 0);
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    let tmp_6_0;
    let tmp_7_0;
    let tmp_10_0;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate((tmp_1_0 = ctx_r1.std()) == null ? null : tmp_1_0.name);
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate(((tmp_2_0 = ctx_r1.std()) == null ? null : tmp_2_0.lot_number) || "N/A");
    i0.ɵɵadvance(4);
    i0.ɵɵclassMap(ctx_r1.getExpiryClass((tmp_3_0 = ctx_r1.std()) == null ? null : tmp_3_0.expiry_date));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(((tmp_4_0 = ctx_r1.std()) == null ? null : tmp_4_0.expiry_date) || "N/A");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate2("", ctx_r1.formatNum((tmp_5_0 = (tmp_5_0 = ctx_r1.std()) == null ? null : tmp_5_0.current_amount) !== null && tmp_5_0 !== undefined ? tmp_5_0 : 0), " ", (tmp_5_0 = ctx_r1.std()) == null ? null : tmp_5_0.unit, "");
    i0.ɵɵadvance();
    i0.ɵɵconditional(((tmp_6_0 = ctx_r1.std()) == null ? null : tmp_6_0.internal_id) ? 25 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional((tmp_7_0 = ctx_r1.fefoTopSibling()) ? 26 : -1, tmp_7_0);
    i0.ɵɵadvance(9);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.isAssignMode() ? "G\u00E1n cho nh\u00E2n vi\u00EAn" : "M\u01B0\u1EE3n chu\u1EA9n s\u1EED d\u1EE5ng", " ");
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.isAssignMode() ? 39 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("L\u01B0\u1EE3ng d\u1EF1 ki\u1EBFn d\u00F9ng (", (tmp_10_0 = ctx_r1.std()) == null ? null : tmp_10_0.unit, ")");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngModel", ctx_r1.assignExpectedAmount());
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("ngModel", ctx_r1.assignPurpose());
    i0.ɵɵadvance(15);
    i0.ɵɵproperty("disabled", !ctx_r1.assignUserId() || !ctx_r1.assignPurpose() || ctx_r1.isProcessing());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isProcessing() ? 66 : 67);
} }
export class StandardsAssignModalComponent {
    constructor() {
        this.std = input.required();
        this.isOpen = input.required();
        this.isAssignMode = input.required();
        this.userList = input.required();
        this.isProcessing = input.required();
        this.currentUserUid = input('');
        this.currentUserName = input('');
        /** Danh sách lọ cùng tên (không gồm lọ hiện tại), đã sắp xếp theo FEFO */
        this.sameName = input([]);
        this.closeModal = output();
        this.confirm = output();
        this.assignUserId = signal('');
        this.assignUserName = signal('');
        this.assignPurpose = signal('');
        this.assignExpectedAmount = signal(null);
        this.getExpiryClass = getExpiryClass;
        this.formatNum = formatNum;
        /** Lọ ưu tiên FEFO trong các lọ cùng tên mà nên dùng trước lọ hiện tại */
        this.fefoTopSibling = computed(() => {
            const current = this.std();
            const siblings = this.sameName();
            if (!current || siblings.length === 0)
                return null;
            return getFefoPredecessor(current, [current, ...siblings]);
        });
        effect(() => {
            // Whenever modal opens, reset form
            if (this.isOpen()) {
                if (this.isAssignMode()) {
                    this.assignUserId.set('');
                    this.assignUserName.set('');
                }
                else {
                    this.assignUserId.set(this.currentUserUid());
                    this.assignUserName.set(this.currentUserName());
                }
                this.assignPurpose.set('');
                this.assignExpectedAmount.set(null);
            }
        });
    }
    onAssignUserChange(userId) {
        this.assignUserId.set(userId);
        const user = this.userList().find(u => u.uid === userId);
        this.assignUserName.set(user ? user.displayName || '' : '');
    }
    onConfirm() {
        this.confirm.emit({
            userId: this.assignUserId(),
            userName: this.assignUserName(),
            purpose: this.assignPurpose(),
            expectedAmount: this.assignExpectedAmount()
        });
    }
    static { this.ɵfac = function StandardsAssignModalComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StandardsAssignModalComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StandardsAssignModalComponent, selectors: [["app-standards-assign-modal"]], inputs: { std: [1, "std"], isOpen: [1, "isOpen"], isAssignMode: [1, "isAssignMode"], userList: [1, "userList"], isProcessing: [1, "isProcessing"], currentUserUid: [1, "currentUserUid"], currentUserName: [1, "currentUserName"], sameName: [1, "sameName"] }, outputs: { closeModal: "closeModal", confirm: "confirm" }, decls: 1, vars: 1, consts: [[1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "p-4", "bg-slate-900/60", "backdrop-blur-sm", "fade-in"], [1, "bg-white", "dark:bg-slate-900", "rounded-[2.5rem]", "shadow-2xl", "w-full", "max-w-3xl", "flex", "overflow-hidden", "animate-bounce-in", "border", "border-slate-100", "dark:border-slate-800"], [1, "hidden", "md:flex", "w-2/5", "bg-slate-50", "dark:bg-slate-800/50", "p-8", "flex-col", "border-r", "border-slate-100", "dark:border-slate-800"], [1, "w-14", "h-14", "rounded-2xl", "bg-white", "dark:bg-slate-800", "text-emerald-600", "dark:text-emerald-400", "flex", "items-center", "justify-center", "text-2xl", "shadow-sm", "border", "border-slate-100", "dark:border-slate-700", "mb-6"], [1, "fa-solid", "fa-vial"], [1, "text-xl", "font-black", "text-slate-800", "dark:text-slate-100", "leading-tight", "mb-2", "line-clamp-2"], [1, "text-[10px]", "font-bold", "text-indigo-600", "dark:text-indigo-400", "uppercase", "tracking-widest", "mb-6"], [1, "space-y-4"], [1, "flex", "flex-col"], [1, "text-[10px]", "font-bold", "text-slate-400", "uppercase"], [1, "text-sm", "font-bold", "text-slate-700", "dark:text-slate-200"], [1, "text-sm", "font-bold"], [1, "text-sm", "font-bold", "text-emerald-600"], [1, "mt-4", "p-3", "bg-amber-50", "dark:bg-amber-900/20", "rounded-2xl", "border", "border-amber-200", "dark:border-amber-700/50"], [1, "mt-auto", "pt-6", "border-t", "border-slate-200", "dark:border-slate-700"], [1, "bg-blue-50", "dark:bg-blue-900/20", "p-3", "rounded-2xl", "border", "border-blue-100", "dark:border-blue-800/30"], [1, "text-[10px]", "text-blue-700", "dark:text-blue-400", "leading-relaxed", "font-medium"], [1, "fa-solid", "fa-circle-info", "mr-1"], [1, "flex-1", "p-8", "flex", "flex-col", "bg-white", "dark:bg-slate-900"], [1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-xl", "font-black", "text-slate-800", "dark:text-slate-100", "tracking-tight"], [1, "w-8", "h-8", "rounded-full", "hover:bg-slate-100", "dark:hover:bg-slate-800", "flex", "items-center", "justify-center", "text-slate-400", "transition", 3, "click"], [1, "fa-solid", "fa-times"], [1, "flex-1", "space-y-5", "overflow-y-auto", "pr-2", "custom-scrollbar"], [1, "grid", "grid-cols-1", "gap-4"], [1, "block", "text-xs", "font-bold", "text-slate-500", "dark:text-slate-400", "uppercase", "tracking-wider", "mb-2"], ["type", "number", "placeholder", "VD: 5", 1, "w-full", "px-4", "py-3", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-sm", "font-bold", "text-slate-700", "dark:text-slate-200", "focus:border-indigo-500", "outline-none", 3, "ngModelChange", "ngModel"], [1, "text-red-500"], ["rows", "3", "placeholder", "Nh\u1EADp m\u1EE5c \u0111\u00EDch s\u1EED d\u1EE5ng...", 1, "w-full", "px-4", "py-3", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-sm", "font-bold", "text-slate-700", "dark:text-slate-200", "focus:border-indigo-500", "focus:ring-4", "focus:ring-indigo-500/10", "transition-all", "outline-none", "resize-none", "placeholder-slate-300", 3, "ngModelChange", "ngModel"], [1, "flex", "flex-wrap", "gap-2", "mt-2"], [1, "px-3", "py-1", "bg-slate-100", "dark:bg-slate-800", "hover:bg-indigo-100", "dark:hover:bg-indigo-900/40", "text-[10px]", "font-bold", "text-slate-500", "dark:text-slate-400", "hover:text-indigo-600", "rounded-lg", "transition", "border", "border-transparent", "hover:border-indigo-200", 3, "click"], [1, "flex", "justify-end", "gap-3", "mt-8", "pt-4", "border-t", "border-slate-100", "dark:border-slate-800"], [1, "px-6", "py-3", "text-slate-500", "dark:text-slate-400", "font-bold", "text-sm", "hover:bg-slate-100", "dark:hover:bg-slate-800", "rounded-2xl", "transition", 3, "click"], [1, "px-8", "py-3", "bg-indigo-600", "dark:bg-indigo-500", "text-white", "font-bold", "text-sm", "rounded-2xl", "hover:bg-indigo-700", "dark:hover:bg-indigo-600", "shadow-xl", "shadow-indigo-200", "dark:shadow-none", "transition", "disabled:opacity-50", "flex", "items-center", "gap-2", 3, "click", "disabled"], [1, "fa-solid", "fa-spinner", "fa-spin"], [1, "text-sm", "font-bold", "text-slate-500"], [1, "flex", "items-center", "gap-1.5", "mb-1"], [1, "fa-solid", "fa-triangle-exclamation", "text-amber-500", "text-xs"], [1, "text-[10px]", "font-black", "text-amber-700", "dark:text-amber-400", "uppercase", "tracking-wide"], [1, "text-[10px]", "text-amber-700", "dark:text-amber-400", "leading-relaxed"], [1, "w-full", "px-4", "py-3", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-sm", "font-bold", "text-slate-700", "dark:text-slate-200", "focus:border-indigo-500", "focus:ring-4", "focus:ring-indigo-500/10", "transition-all", "outline-none", "appearance-none", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], [1, "fa-solid", "fa-paper-plane", "text-xs"]], template: function StandardsAssignModalComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, StandardsAssignModalComponent_Conditional_0_Template, 68, 16, "div", 0);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.isOpen() && ctx.std() ? 0 : -1);
        } }, dependencies: [CommonModule, FormsModule, i1.NgSelectOption, i1.ɵNgSelectMultipleOption, i1.DefaultValueAccessor, i1.NumberValueAccessor, i1.SelectControlValueAccessor, i1.NgControlStatus, i1.NgModel], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StandardsAssignModalComponent, [{
        type: Component,
        args: [{
                selector: 'app-standards-assign-modal',
                standalone: true,
                imports: [CommonModule, FormsModule],
                template: `
    @if (isOpen() && std()) {
       <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
          <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-3xl flex overflow-hidden animate-bounce-in border border-slate-100 dark:border-slate-800">
              <!-- Left: Standard Info Summary -->
              <div class="hidden md:flex w-2/5 bg-slate-50 dark:bg-slate-800/50 p-8 flex-col border-r border-slate-100 dark:border-slate-800">
                  <div class="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
                      <i class="fa-solid fa-vial"></i>
                  </div>
                  
                  <h3 class="text-xl font-black text-slate-800 dark:text-slate-100 leading-tight mb-2 line-clamp-2">{{std()?.name}}</h3>
                  <div class="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-6">Thông tin chuẩn mượn</div>

                  <div class="space-y-4">
                      <div class="flex flex-col">
                          <span class="text-[10px] font-bold text-slate-400 uppercase">Số Lô / Lot</span>
                          <span class="text-sm font-bold text-slate-700 dark:text-slate-200">{{std()?.lot_number || 'N/A'}}</span>
                      </div>
                      <div class="flex flex-col">
                          <span class="text-[10px] font-bold text-slate-400 uppercase">Hạn dùng</span>
                          <span class="text-sm font-bold" [class]="getExpiryClass(std()?.expiry_date)">{{std()?.expiry_date || 'N/A'}}</span>
                      </div>
                      <div class="flex flex-col">
                          <span class="text-[10px] font-bold text-slate-400 uppercase">Lượng tồn kho</span>
                          <span class="text-sm font-bold text-emerald-600">{{formatNum(std()?.current_amount ?? 0)}} {{std()?.unit}}</span>
                      </div>
                      @if(std()?.internal_id) {
                          <div class="flex flex-col">
                              <span class="text-[10px] font-bold text-slate-400 uppercase">Mã quản lý</span>
                              <span class="text-sm font-bold text-slate-500">{{std()?.internal_id}}</span>
                          </div>
                      }
                  </div>

                  <!-- FEFO Siblings Info -->
                  @if(fefoTopSibling(); as top) {
                      <div class="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-700/50">
                          <div class="flex items-center gap-1.5 mb-1">
                              <i class="fa-solid fa-triangle-exclamation text-amber-500 text-xs"></i>
                              <span class="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wide">Gợi ý FEFO</span>
                          </div>
                          <p class="text-[10px] text-amber-700 dark:text-amber-400 leading-relaxed">
                              Lọ <strong>{{top.internal_id || top.lot_number}}</strong>
                              (hạn: {{top.expiry_date || 'N/A'}}) gần hết hạn hơn — nên được cấp trước.
                          </p>
                      </div>
                  }

                  <div class="mt-auto pt-6 border-t border-slate-200 dark:border-slate-700">
                      <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                          <p class="text-[10px] text-blue-700 dark:text-blue-400 leading-relaxed font-medium">
                              <i class="fa-solid fa-circle-info mr-1"></i>
                              Vui lòng ghi lại nhật ký sử dụng sau khi pha xong để hệ thống trừ kho chính xác.
                          </p>
                      </div>
                  </div>
              </div>

              <!-- Right: Borrow Form -->
              <div class="flex-1 p-8 flex flex-col bg-white dark:bg-slate-900">
                  <div class="flex justify-between items-center mb-6">
                      <h3 class="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                          {{ isAssignMode() ? 'Gán cho nhân viên' : 'Mượn chuẩn sử dụng' }}
                      </h3>
                      <button (click)="closeModal.emit()" class="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition"><i class="fa-solid fa-times"></i></button>
                  </div>

                  <div class="flex-1 space-y-5 overflow-y-auto pr-2 custom-scrollbar">
                      @if(isAssignMode()) {
                          <div>
                              <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Nhân viên tiếp nhận <span class="text-red-500">*</span></label>
                              <select [ngModel]="assignUserId()" (ngModelChange)="onAssignUserChange($event)" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none appearance-none">
                                  <option value="">-- Chọn nhân viên --</option>
                                  @for (user of userList(); track user.uid) {
                                      <option [value]="user.uid">{{user.displayName}} ({{user.email}})</option>
                                  }
                              </select>
                          </div>
                      }

                      <div class="grid grid-cols-1 gap-4">
                          <div>
                              <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Lượng dự kiến dùng ({{std()?.unit}})</label>
                              <input type="number" [ngModel]="assignExpectedAmount()" (ngModelChange)="assignExpectedAmount.set($event)" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 outline-none" placeholder="VD: 5">
                          </div>
                      </div>

                      <div>
                          <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Mục đích sử dụng <span class="text-red-500">*</span></label>
                          <textarea [ngModel]="assignPurpose()" (ngModelChange)="assignPurpose.set($event)" rows="3" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none placeholder-slate-300" placeholder="Nhập mục đích sử dụng..."></textarea>
                          
                          <div class="flex flex-wrap gap-2 mt-2">
                              <button (click)="assignPurpose.set('Pha chuẩn mới')" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Pha Chuẩn Mới</button>
                              <button (click)="assignPurpose.set('Kiểm tra định kỳ')" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Kiểm Tra Định Kỳ</button>
                              <button (click)="assignPurpose.set('Ngoại kiểm')" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Ngoại Kiểm</button>
                              <button (click)="assignPurpose.set('Nghiên cứu phát triển')" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Nghiên Cứu Phát Triển</button>
                              <button (click)="assignPurpose.set('Kiểm nghiệm mẫu')" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Kiểm Nghiệm Mẫu</button>
                          </div>
                      </div>
                  </div>

                  <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <button (click)="closeModal.emit()" class="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition">Hủy Bỏ</button>
                      <button (click)="onConfirm()" [disabled]="!assignUserId() || !assignPurpose() || isProcessing()" class="px-8 py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-bold text-sm rounded-2xl hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-xl shadow-indigo-200 dark:shadow-none transition disabled:opacity-50 flex items-center gap-2">
                          @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> } @else { <i class="fa-solid fa-paper-plane text-xs"></i> Xác nhận mượn }
                      </button>
                  </div>
              </div>
          </div>
       </div>
    }
  `
            }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StandardsAssignModalComponent, { className: "StandardsAssignModalComponent", filePath: "src/app/features/standards/components/standards-assign-modal.component.ts", lineNumber: 126 }); })();
//# sourceMappingURL=standards-assign-modal.component.js.map