import { Component, input, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { StandardService } from '../standard.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
function StandardsPurchaseModalComponent_Conditional_0_Conditional_48_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 23);
} }
function StandardsPurchaseModalComponent_Conditional_0_Conditional_49_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 24);
    i0.ɵɵtext(1, " G\u1EEDi y\u00EAu c\u1EA7u ");
} }
function StandardsPurchaseModalComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h3", 3);
    i0.ɵɵelement(4, "i", 4);
    i0.ɵɵtext(5, " \u0110\u1EC1 Ngh\u1ECB Mua S\u1EAFm");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "button", 5);
    i0.ɵɵlistener("click", function StandardsPurchaseModalComponent_Conditional_0_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onClose()); });
    i0.ɵɵelement(7, "i", 6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "form", 7);
    i0.ɵɵlistener("ngSubmit", function StandardsPurchaseModalComponent_Conditional_0_Template_form_ngSubmit_8_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.submitPurchaseRequest()); });
    i0.ɵɵelementStart(9, "div", 8);
    i0.ɵɵtext(10, " Xin c\u1EA5p m\u1EDBi: ");
    i0.ɵɵelementStart(11, "span", 9);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(13, " Code: ");
    i0.ɵɵelementStart(14, "span", 10);
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "div")(17, "label", 11);
    i0.ɵɵtext(18, "M\u1EE9c \u0111\u1ED9 \u01B0u ti\u00EAn *");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "select", 12)(20, "option", 13);
    i0.ɵɵtext(21, "B\u00ECnh th\u01B0\u1EDDng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "option", 14);
    i0.ɵɵtext(23, "Kh\u1EA9n c\u1EA5p");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(24, "div")(25, "label", 11);
    i0.ɵɵtext(26, "S\u1ED1 l\u01B0\u1EE3ng d\u1EF1 ki\u1EBFn c\u1EA7n *");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(27, "input", 15);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "div")(29, "label", 11);
    i0.ɵɵtext(30, "H\u00E3ng c\u1EA7n mua");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(31, "input", 16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "div")(33, "label", 11);
    i0.ɵɵtext(34, "C\u1EA5p \u0111\u1ED9 chu\u1EA9n (VD: ISO 17034)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(35, "input", 17);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(36, "div")(37, "label", 11);
    i0.ɵɵtext(38, "\u0110\u1ED9 tinh khi\u1EBFt y\u00EAu c\u1EA7u");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(39, "input", 18);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "div")(41, "label", 11);
    i0.ɵɵtext(42, "Ghi ch\u00FA / L\u00FD do mua");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(43, "textarea", 19);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(44, "div", 20)(45, "button", 21);
    i0.ɵɵlistener("click", function StandardsPurchaseModalComponent_Conditional_0_Template_button_click_45_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onClose()); });
    i0.ɵɵtext(46, "H\u1EE7y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(47, "button", 22);
    i0.ɵɵtemplate(48, StandardsPurchaseModalComponent_Conditional_0_Conditional_48_Template, 1, 0, "i", 23)(49, StandardsPurchaseModalComponent_Conditional_0_Conditional_49_Template, 2, 0);
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(8);
    i0.ɵɵproperty("formGroup", ctx_r1.purchaseForm);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("title", (tmp_2_0 = ctx_r1.selectedStd()) == null ? null : tmp_2_0.name);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate((tmp_3_0 = ctx_r1.selectedStd()) == null ? null : tmp_3_0.name);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(((tmp_4_0 = ctx_r1.selectedStd()) == null ? null : tmp_4_0.product_code) || "N/A");
    i0.ɵɵadvance(32);
    i0.ɵɵproperty("disabled", ctx_r1.purchaseForm.invalid || ctx_r1.isProcessing());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isProcessing() ? 48 : 49);
} }
export class StandardsPurchaseModalComponent {
    constructor() {
        this.isOpen = input(false);
        this.selectedStd = input(null);
        this.closeModal = output();
        this.fb = inject(FormBuilder);
        this.stdService = inject(StandardService);
        this.toast = inject(ToastService);
        this.auth = inject(AuthService);
        this.isProcessing = signal(false);
        this.purchaseForm = this.fb.group({
            priority: ['NORMAL'],
            notes: [''],
            expectedAmount: ['', Validators.required],
            preferred_manufacturer: [''],
            required_level: [''],
            required_purity: ['']
        });
    }
    onClose() {
        this.closeModal.emit();
        this.purchaseForm.reset({ priority: 'NORMAL' });
    }
    async submitPurchaseRequest() {
        if (this.purchaseForm.invalid || !this.selectedStd() || this.isProcessing())
            return;
        try {
            this.isProcessing.set(true);
            const user = this.auth.currentUser();
            const std = this.selectedStd();
            const req = {
                standardId: std.id,
                standardName: std.name,
                requestedBy: user?.uid || 'unknown',
                requestedByName: user?.displayName || user?.email || 'Người dùng không xác định',
                priority: this.purchaseForm.value.priority,
                notes: this.purchaseForm.value.notes,
                status: 'PENDING',
                requestDate: Date.now(),
                expectedAmount: this.purchaseForm.value.expectedAmount,
                preferred_manufacturer: this.purchaseForm.value.preferred_manufacturer,
                required_level: this.purchaseForm.value.required_level,
                required_purity: this.purchaseForm.value.required_purity,
                product_code: std.product_code || ''
            };
            await this.stdService.createPurchaseRequest(req);
            this.toast.show('Đã gửi yêu cầu mua sắm', 'success');
            this.onClose();
        }
        catch (e) {
            this.toast.show('Lỗi gửi yêu cầu: ' + e.message, 'error');
        }
        finally {
            this.isProcessing.set(false);
        }
    }
    static { this.ɵfac = function StandardsPurchaseModalComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StandardsPurchaseModalComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StandardsPurchaseModalComponent, selectors: [["app-standards-purchase-modal"]], inputs: { isOpen: [1, "isOpen"], selectedStd: [1, "selectedStd"] }, outputs: { closeModal: "closeModal" }, decls: 1, vars: 1, consts: [[1, "fixed", "inset-0", "z-[80]", "flex", "items-center", "justify-center", "p-4", "bg-black/70", "backdrop-blur-sm", "fade-in"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "shadow-2xl", "w-full", "max-w-md", "overflow-hidden", "animate-slide-up", "border", "border-amber-100", "dark:border-amber-900/40"], [1, "px-6", "py-4", "border-b", "border-amber-100", "dark:border-amber-800/40", "bg-amber-50", "dark:bg-amber-900/10", "flex", "justify-between", "items-center"], [1, "font-black", "text-amber-800", "dark:text-amber-500", "text-lg", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-cart-plus"], [1, "text-slate-400", "hover:text-red-500", "rounded-full", "w-8", "h-8", "flex", "items-center", "justify-center", "border", "border-slate-200", "dark:border-slate-700", "transition", 3, "click"], [1, "fa-solid", "fa-times"], [1, "p-6", "flex", "flex-col", "gap-4", 3, "ngSubmit", "formGroup"], [1, "text-sm", "border-l-4", "border-amber-500", "bg-amber-50", "dark:bg-amber-900/20", "p-3", "rounded-r", "text-amber-800", "dark:text-amber-200"], [1, "font-black", "truncate", "max-w-full", "block", 3, "title"], [1, "font-mono", "font-bold"], [1, "block", "text-xs", "font-bold", "text-slate-500", "dark:text-slate-400", "mb-1"], ["formControlName", "priority", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "px-3", "py-2", "text-sm", "focus:ring-2", "focus:ring-amber-500", "dark:text-white"], ["value", "NORMAL"], ["value", "HIGH"], ["type", "text", "formControlName", "expectedAmount", "placeholder", "VD: 2 chai 10mg", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "px-3", "py-2", "text-sm", "focus:ring-2", "focus:ring-amber-500", "dark:text-white"], ["type", "text", "formControlName", "preferred_manufacturer", "placeholder", "VD: Sigma Aldrich", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "px-3", "py-2", "text-sm", "focus:ring-2", "focus:ring-amber-500", "dark:text-white"], ["type", "text", "formControlName", "required_level", "placeholder", "ISO 17034 / CRM / SRM...", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "px-3", "py-2", "text-sm", "focus:ring-2", "focus:ring-amber-500", "dark:text-white"], ["type", "text", "formControlName", "required_purity", "placeholder", "VD: >= 99%", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "px-3", "py-2", "text-sm", "focus:ring-2", "focus:ring-amber-500", "dark:text-white"], ["formControlName", "notes", "rows", "2", "placeholder", "M\u1EE5c \u0111\u00EDch s\u1EED d\u1EE5ng...", 1, "w-full", "bg-slate-50", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "px-3", "py-2", "text-sm", "focus:ring-2", "focus:ring-amber-500", "dark:text-white"], [1, "flex", "justify-end", "gap-3", "mt-4", "pt-4", "border-t", "border-slate-100", "dark:border-slate-800"], ["type", "button", 1, "px-5", "py-2.5", "text-slate-600", "dark:text-slate-400", "hover:bg-slate-200", "dark:hover:bg-slate-800", "rounded-xl", "font-bold", "text-sm", "transition", 3, "click"], ["type", "submit", 1, "px-6", "py-2.5", "bg-amber-500", "hover:bg-amber-600", "dark:bg-amber-600", "dark:hover:bg-amber-500", "text-white", "rounded-xl", "font-bold", "text-sm", "shadow-md", "dark:shadow-none", "transition", "disabled:opacity-50", "flex", "items-center", "gap-2", 3, "disabled"], [1, "fa-solid", "fa-spinner", "fa-spin"], [1, "fa-solid", "fa-paper-plane", "text-xs"]], template: function StandardsPurchaseModalComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, StandardsPurchaseModalComponent_Conditional_0_Template, 50, 6, "div", 0);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.isOpen() ? 0 : -1);
        } }, dependencies: [CommonModule, ReactiveFormsModule, i1.ɵNgNoValidate, i1.NgSelectOption, i1.ɵNgSelectMultipleOption, i1.DefaultValueAccessor, i1.SelectControlValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StandardsPurchaseModalComponent, [{
        type: Component,
        args: [{
                selector: 'app-standards-purchase-modal',
                standalone: true,
                imports: [CommonModule, ReactiveFormsModule],
                template: `
      <!-- PURCHASE REQUEST MODAL -->
      @if (isOpen()) {
         <div class="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up border border-amber-100 dark:border-amber-900/40">
               <div class="px-6 py-4 border-b border-amber-100 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-900/10 flex justify-between items-center">
                   <h3 class="font-black text-amber-800 dark:text-amber-500 text-lg flex items-center gap-2"><i class="fa-solid fa-cart-plus"></i> Đề Nghị Mua Sắm</h3>
                   <button (click)="onClose()" class="text-slate-400 hover:text-red-500 rounded-full w-8 h-8 flex items-center justify-center border border-slate-200 dark:border-slate-700 transition"><i class="fa-solid fa-times"></i></button>
               </div>
               <form [formGroup]="purchaseForm" (ngSubmit)="submitPurchaseRequest()" class="p-6 flex flex-col gap-4">
                   <div class="text-sm border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-r text-amber-800 dark:text-amber-200">
                       Xin cấp mới: <span class="font-black truncate max-w-full block" [title]="selectedStd()?.name">{{selectedStd()?.name}}</span>
                       Code: <span class="font-mono font-bold">{{selectedStd()?.product_code || 'N/A'}}</span>
                   </div>
                   
                   <div><label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Mức độ ưu tiên *</label><select formControlName="priority" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 dark:text-white"><option value="NORMAL">Bình thường</option><option value="HIGH">Khẩn cấp</option></select></div>
                   
                   <div><label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Số lượng dự kiến cần *</label><input type="text" formControlName="expectedAmount" placeholder="VD: 2 chai 10mg" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 dark:text-white"></div>
                   
                   <div><label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Hãng cần mua</label><input type="text" formControlName="preferred_manufacturer" placeholder="VD: Sigma Aldrich" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 dark:text-white"></div>
                   
                   <div><label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Cấp độ chuẩn (VD: ISO 17034)</label><input type="text" formControlName="required_level" placeholder="ISO 17034 / CRM / SRM..." class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 dark:text-white"></div>
                   
                   <div><label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Độ tinh khiết yêu cầu</label><input type="text" formControlName="required_purity" placeholder="VD: >= 99%" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 dark:text-white"></div>
                   
                   <div><label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Ghi chú / Lý do mua</label><textarea formControlName="notes" rows="2" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 dark:text-white" placeholder="Mục đích sử dụng..."></textarea></div>
                   
                   <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                       <button type="button" (click)="onClose()" class="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl font-bold text-sm transition">Hủy</button>
                       <button type="submit" [disabled]="purchaseForm.invalid || isProcessing()" class="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-xl font-bold text-sm shadow-md dark:shadow-none transition disabled:opacity-50 flex items-center gap-2">
                            @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> } @else { <i class="fa-solid fa-paper-plane text-xs"></i> Gửi yêu cầu }
                       </button>
                   </div>
               </form>
            </div>
         </div>
      }
  `
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StandardsPurchaseModalComponent, { className: "StandardsPurchaseModalComponent", filePath: "src/app/features/standards/components/standards-purchase-modal.component.ts", lineNumber: 52 }); })();
//# sourceMappingURL=standards-purchase-modal.component.js.map