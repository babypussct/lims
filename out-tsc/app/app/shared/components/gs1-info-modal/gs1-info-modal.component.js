import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QrGlobalService } from '../../../core/services/qr-global.service';
import { InventoryService } from '../../../features/inventory/inventory.service';
import { formatSmartUnit } from '../../utils/utils';
import * as i0 from "@angular/core";
function Gs1InfoModalComponent_Conditional_0_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 11);
    i0.ɵɵelement(1, "i", 12);
    i0.ɵɵelementStart(2, "p", 13);
    i0.ɵɵtext(3, "\u0110ang tra c\u1EE9u th\u00F4ng tin...");
    i0.ɵɵelementEnd()();
} }
function Gs1InfoModalComponent_Conditional_0_Conditional_15_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 15)(1, "div", 27);
    i0.ɵɵelement(2, "i", 28);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div")(4, "div", 29);
    i0.ɵɵtext(5, "L\u1ED7i ph\u00E2n t\u00EDch m\u00E3 v\u1EA1ch");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 30);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate((tmp_3_0 = ctx_r1.qrService.scannedGs1Data()) == null ? null : tmp_3_0.error);
} }
function Gs1InfoModalComponent_Conditional_0_Conditional_15_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 15)(1, "div", 27);
    i0.ɵɵelement(2, "i", 5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div")(4, "div", 29);
    i0.ɵɵtext(5, "Thi\u1EBFu th\u00F4ng tin GTIN");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 30);
    i0.ɵɵtext(7, "M\u00E3 v\u1EA1ch n\u00E0y kh\u00F4ng ch\u1EE9a m\u00E3 s\u1EA3n ph\u1EA9m (GTIN). Kh\u00F4ng th\u1EC3 tra c\u1EE9u.");
    i0.ɵɵelementEnd()()();
} }
function Gs1InfoModalComponent_Conditional_0_Conditional_15_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 16)(1, "div", 31);
    i0.ɵɵelement(2, "i", 32);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div")(4, "div", 33);
    i0.ɵɵtext(5, "\u0110\u00E3 c\u00F3 trong h\u1EC7 th\u1ED1ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 34);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 35);
    i0.ɵɵtext(9, " T\u1ED3n kho hi\u1EC7n t\u1EA1i: ");
    i0.ɵɵelement(10, "span", 36);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate((tmp_3_0 = ctx_r1.matchedItem()) == null ? null : tmp_3_0.name);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("innerHTML", ctx_r1.formatSmartUnit(((tmp_4_0 = ctx_r1.matchedItem()) == null ? null : tmp_4_0.stock) || 0, ((tmp_4_0 = ctx_r1.matchedItem()) == null ? null : tmp_4_0.unit) || ""), i0.ɵɵsanitizeHtml);
} }
function Gs1InfoModalComponent_Conditional_0_Conditional_15_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 17)(1, "div", 37);
    i0.ɵɵelement(2, "i", 38);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div")(4, "div", 39);
    i0.ɵɵtext(5, "Ch\u01B0a c\u00F3 trong h\u1EC7 th\u1ED1ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 30);
    i0.ɵɵtext(7, "H\u00F3a ch\u1EA5t n\u00E0y ch\u01B0a \u0111\u01B0\u1EE3c khai b\u00E1o ho\u1EB7c kh\u00F4ng t\u00ECm th\u1EA5y GTIN.");
    i0.ɵɵelementEnd()()();
} }
function Gs1InfoModalComponent_Conditional_0_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 14);
    i0.ɵɵtemplate(1, Gs1InfoModalComponent_Conditional_0_Conditional_15_Conditional_1_Template, 8, 1, "div", 15)(2, Gs1InfoModalComponent_Conditional_0_Conditional_15_Conditional_2_Template, 8, 0, "div", 15)(3, Gs1InfoModalComponent_Conditional_0_Conditional_15_Conditional_3_Template, 11, 2, "div", 16)(4, Gs1InfoModalComponent_Conditional_0_Conditional_15_Conditional_4_Template, 8, 0, "div", 17);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 18)(6, "div", 19)(7, "div", 20);
    i0.ɵɵtext(8, "GTIN");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 21);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "div", 19)(12, "div", 20);
    i0.ɵɵtext(13, "S\u1ED1 L\u00F4 (Lot)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "div", 21);
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "div", 22)(17, "div", 20);
    i0.ɵɵtext(18, "H\u1EA1n s\u1EED d\u1EE5ng (EXP)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "div", 21);
    i0.ɵɵtext(20);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(21, "div", 23)(22, "button", 24);
    i0.ɵɵlistener("click", function Gs1InfoModalComponent_Conditional_0_Conditional_15_Template_button_click_22_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.close()); });
    i0.ɵɵtext(23, " \u0110\u00F3ng ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "button", 25);
    i0.ɵɵlistener("click", function Gs1InfoModalComponent_Conditional_0_Conditional_15_Template_button_click_24_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.goToInventory()); });
    i0.ɵɵelement(25, "i", 26);
    i0.ɵɵtext(26);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    let tmp_6_0;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵconditional(((tmp_2_0 = ctx_r1.qrService.scannedGs1Data()) == null ? null : tmp_2_0.error) ? 1 : !((tmp_2_0 = ctx_r1.qrService.scannedGs1Data()) == null ? null : tmp_2_0.gtin) ? 2 : ctx_r1.matchedItem() ? 3 : 4);
    i0.ɵɵadvance(9);
    i0.ɵɵtextInterpolate(((tmp_3_0 = ctx_r1.qrService.scannedGs1Data()) == null ? null : tmp_3_0.gtin) || "N/A");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(((tmp_4_0 = ctx_r1.qrService.scannedGs1Data()) == null ? null : tmp_4_0.lotNumber) || "N/A");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(((tmp_5_0 = ctx_r1.qrService.scannedGs1Data()) == null ? null : tmp_5_0.expiryDate) || "N/A");
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("disabled", ((tmp_6_0 = ctx_r1.qrService.scannedGs1Data()) == null ? null : tmp_6_0.error) || !((tmp_6_0 = ctx_r1.qrService.scannedGs1Data()) == null ? null : tmp_6_0.gtin));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.matchedItem() ? "C\u1EADp nh\u1EADt kho" : "Th\u00EAm v\u00E0o kho", " ");
} }
function Gs1InfoModalComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4);
    i0.ɵɵelement(5, "i", 5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div")(7, "h3", 6);
    i0.ɵɵtext(8, "Th\u00F4ng Tin GS1");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "p", 7);
    i0.ɵɵtext(10, "Qu\u00E9t t\u1EEB Data Matrix");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(11, "button", 8);
    i0.ɵɵlistener("click", function Gs1InfoModalComponent_Conditional_0_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.close()); });
    i0.ɵɵelement(12, "i", 9);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "div", 10);
    i0.ɵɵtemplate(14, Gs1InfoModalComponent_Conditional_0_Conditional_14_Template, 4, 0, "div", 11)(15, Gs1InfoModalComponent_Conditional_0_Conditional_15_Template, 27, 6);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(14);
    i0.ɵɵconditional(ctx_r1.isLoading() ? 14 : 15);
} }
export class Gs1InfoModalComponent {
    constructor() {
        this.qrService = inject(QrGlobalService);
        this.inventoryService = inject(InventoryService);
        this.router = inject(Router);
        this.isLoading = signal(false);
        this.matchedItem = signal(null);
        this.formatSmartUnit = formatSmartUnit;
        effect(() => {
            const data = this.qrService.scannedGs1Data();
            if (data && data.gtin) {
                this.lookupItem(data.gtin);
            }
            else {
                this.matchedItem.set(null);
            }
        });
    }
    async lookupItem(gtin) {
        this.isLoading.set(true);
        try {
            const item = await this.inventoryService.getItemByGtin(gtin);
            this.matchedItem.set(item);
        }
        catch (e) {
            console.error("Error looking up GTIN", e);
            this.matchedItem.set(null);
        }
        finally {
            this.isLoading.set(false);
        }
    }
    close() {
        this.qrService.scannedGs1Data.set(null);
    }
    goToInventory() {
        const data = this.qrService.scannedGs1Data();
        if (data) {
            this.router.navigate(['/inventory'], {
                queryParams: {
                    action: 'scan_gs1',
                    gtin: data.gtin,
                    lot: data.lotNumber,
                    exp: data.expiryDate,
                    raw: data.raw
                }
            });
            this.close();
        }
    }
    static { this.ɵfac = function Gs1InfoModalComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || Gs1InfoModalComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: Gs1InfoModalComponent, selectors: [["app-gs1-info-modal"]], decls: 1, vars: 1, consts: [[1, "fixed", "inset-0", "z-[160]", "flex", "items-center", "justify-center", "p-4", "bg-slate-900/40", "backdrop-blur-sm", "animate-fade-in"], [1, "bg-white", "dark:bg-slate-800", "rounded-3xl", "shadow-2xl", "w-full", "max-w-md", "overflow-hidden", "animate-slide-up", "border", "border-slate-200", "dark:border-slate-700"], [1, "px-6", "py-5", "border-b", "border-slate-100", "dark:border-slate-700", "flex", "justify-between", "items-center", "bg-slate-50", "dark:bg-slate-800/50"], [1, "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-full", "bg-blue-100", "dark:bg-blue-900/30", "text-blue-600", "dark:text-blue-400", "flex", "items-center", "justify-center", "text-lg"], [1, "fa-solid", "fa-barcode"], [1, "font-bold", "text-slate-800", "dark:text-white", "text-lg", "leading-tight"], [1, "text-xs", "text-slate-500", "dark:text-slate-400"], [1, "w-8", "h-8", "flex", "items-center", "justify-center", "rounded-full", "hover:bg-slate-200", "dark:hover:bg-slate-700", "text-slate-400", "transition", 3, "click"], [1, "fa-solid", "fa-xmark"], [1, "p-6"], [1, "flex", "flex-col", "items-center", "justify-center", "py-8"], [1, "fa-solid", "fa-spinner", "fa-spin", "text-3xl", "text-blue-500", "mb-4"], [1, "text-sm", "text-slate-500"], [1, "mb-6"], [1, "flex", "items-start", "gap-3", "mb-4", "p-4", "bg-red-50", "dark:bg-red-900/20", "border", "border-red-100", "dark:border-red-800/30", "rounded-2xl"], [1, "flex", "items-start", "gap-3", "mb-4", "p-4", "bg-emerald-50", "dark:bg-emerald-900/20", "border", "border-emerald-100", "dark:border-emerald-800/30", "rounded-2xl"], [1, "flex", "items-start", "gap-3", "mb-4", "p-4", "bg-amber-50", "dark:bg-amber-900/20", "border", "border-amber-100", "dark:border-amber-800/30", "rounded-2xl"], [1, "grid", "grid-cols-2", "gap-3", "mb-6"], [1, "p-3", "bg-slate-50", "dark:bg-slate-800/50", "rounded-xl", "border", "border-slate-100", "dark:border-slate-700"], [1, "text-[10px]", "uppercase", "font-bold", "text-slate-400", "mb-1"], [1, "font-mono", "text-sm", "font-bold", "text-slate-700", "dark:text-slate-200"], [1, "p-3", "bg-slate-50", "dark:bg-slate-800/50", "rounded-xl", "border", "border-slate-100", "dark:border-slate-700", "col-span-2"], [1, "flex", "gap-3"], [1, "flex-1", "py-3", "px-4", "rounded-xl", "font-bold", "text-slate-600", "dark:text-slate-300", "bg-slate-100", "dark:bg-slate-700", "hover:bg-slate-200", "dark:hover:bg-slate-600", "transition", 3, "click"], [1, "flex-1", "py-3", "px-4", "rounded-xl", "font-bold", "text-white", "bg-blue-600", "hover:bg-blue-700", "shadow-lg", "shadow-blue-600/20", "transition", "flex", "items-center", "justify-center", "gap-2", "disabled:opacity-50", "disabled:cursor-not-allowed", "disabled:hover:bg-blue-600", 3, "click", "disabled"], [1, "fa-solid", "fa-boxes-stacked"], [1, "w-10", "h-10", "rounded-full", "bg-red-100", "dark:bg-red-800/50", "text-red-600", "dark:text-red-400", "flex", "items-center", "justify-center", "shrink-0"], [1, "fa-solid", "fa-triangle-exclamation"], [1, "text-xs", "font-bold", "text-red-600", "dark:text-red-400", "uppercase", "tracking-wider", "mb-1"], [1, "font-medium", "text-slate-700", "dark:text-slate-300", "text-sm"], [1, "w-10", "h-10", "rounded-full", "bg-emerald-100", "dark:bg-emerald-800/50", "text-emerald-600", "dark:text-emerald-400", "flex", "items-center", "justify-center", "shrink-0"], [1, "fa-solid", "fa-check"], [1, "text-xs", "font-bold", "text-emerald-600", "dark:text-emerald-400", "uppercase", "tracking-wider", "mb-1"], [1, "font-bold", "text-slate-800", "dark:text-white", "text-lg"], [1, "text-sm", "text-slate-500", "mt-1"], [1, "font-bold", "text-slate-700", "dark:text-slate-300", 3, "innerHTML"], [1, "w-10", "h-10", "rounded-full", "bg-amber-100", "dark:bg-amber-800/50", "text-amber-600", "dark:text-amber-400", "flex", "items-center", "justify-center", "shrink-0"], [1, "fa-solid", "fa-box-open"], [1, "text-xs", "font-bold", "text-amber-600", "dark:text-amber-400", "uppercase", "tracking-wider", "mb-1"]], template: function Gs1InfoModalComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, Gs1InfoModalComponent_Conditional_0_Template, 16, 1, "div", 0);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.qrService.scannedGs1Data() ? 0 : -1);
        } }, dependencies: [CommonModule], styles: [".animate-fade-in[_ngcontent-%COMP%] { animation: _ngcontent-%COMP%_fadeIn 0.2s ease-out; }\n    .animate-slide-up[_ngcontent-%COMP%] { animation: _ngcontent-%COMP%_slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }\n    @keyframes _ngcontent-%COMP%_fadeIn { from { opacity: 0; } to { opacity: 1; } }\n    @keyframes _ngcontent-%COMP%_slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(Gs1InfoModalComponent, [{
        type: Component,
        args: [{ selector: 'app-gs1-info-modal', standalone: true, imports: [CommonModule], template: `
    @if (qrService.scannedGs1Data()) {
      <div class="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
        <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up border border-slate-200 dark:border-slate-700">
          
          <!-- Header -->
          <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg">
                <i class="fa-solid fa-barcode"></i>
              </div>
              <div>
                <h3 class="font-bold text-slate-800 dark:text-white text-lg leading-tight">Thông Tin GS1</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Quét từ Data Matrix</p>
              </div>
            </div>
            <button (click)="close()" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Content -->
          <div class="p-6">
            @if (isLoading()) {
              <div class="flex flex-col items-center justify-center py-8">
                <i class="fa-solid fa-spinner fa-spin text-3xl text-blue-500 mb-4"></i>
                <p class="text-sm text-slate-500">Đang tra cứu thông tin...</p>
              </div>
            } @else {
              <!-- Product Info -->
              <div class="mb-6">
                @if (qrService.scannedGs1Data()?.error) {
                  <div class="flex items-start gap-3 mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-2xl">
                    <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-800/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                      <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <div>
                      <div class="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">Lỗi phân tích mã vạch</div>
                      <div class="font-medium text-slate-700 dark:text-slate-300 text-sm">{{ qrService.scannedGs1Data()?.error }}</div>
                    </div>
                  </div>
                } @else if (!qrService.scannedGs1Data()?.gtin) {
                  <div class="flex items-start gap-3 mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-2xl">
                    <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-800/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                      <i class="fa-solid fa-barcode"></i>
                    </div>
                    <div>
                      <div class="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">Thiếu thông tin GTIN</div>
                      <div class="font-medium text-slate-700 dark:text-slate-300 text-sm">Mã vạch này không chứa mã sản phẩm (GTIN). Không thể tra cứu.</div>
                    </div>
                  </div>
                } @else if (matchedItem()) {
                  <div class="flex items-start gap-3 mb-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl">
                    <div class="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-800/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <i class="fa-solid fa-check"></i>
                    </div>
                    <div>
                      <div class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Đã có trong hệ thống</div>
                      <div class="font-bold text-slate-800 dark:text-white text-lg">{{ matchedItem()?.name }}</div>
                      <div class="text-sm text-slate-500 mt-1">
                        Tồn kho hiện tại: 
                        <span class="font-bold text-slate-700 dark:text-slate-300" [innerHTML]="formatSmartUnit(matchedItem()?.stock || 0, matchedItem()?.unit || '')"></span>
                      </div>
                    </div>
                  </div>
                } @else {
                  <div class="flex items-start gap-3 mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-2xl">
                    <div class="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-800/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <i class="fa-solid fa-box-open"></i>
                    </div>
                    <div>
                      <div class="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Chưa có trong hệ thống</div>
                      <div class="font-medium text-slate-700 dark:text-slate-300 text-sm">Hóa chất này chưa được khai báo hoặc không tìm thấy GTIN.</div>
                    </div>
                  </div>
                }
              </div>

              <!-- GS1 Data Grid -->
              <div class="grid grid-cols-2 gap-3 mb-6">
                <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div class="text-[10px] uppercase font-bold text-slate-400 mb-1">GTIN</div>
                  <div class="font-mono text-sm font-bold text-slate-700 dark:text-slate-200">{{ qrService.scannedGs1Data()?.gtin || 'N/A' }}</div>
                </div>
                <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div class="text-[10px] uppercase font-bold text-slate-400 mb-1">Số Lô (Lot)</div>
                  <div class="font-mono text-sm font-bold text-slate-700 dark:text-slate-200">{{ qrService.scannedGs1Data()?.lotNumber || 'N/A' }}</div>
                </div>
                <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 col-span-2">
                  <div class="text-[10px] uppercase font-bold text-slate-400 mb-1">Hạn sử dụng (EXP)</div>
                  <div class="font-mono text-sm font-bold text-slate-700 dark:text-slate-200">{{ qrService.scannedGs1Data()?.expiryDate || 'N/A' }}</div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-3">
                <button (click)="close()" class="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                  Đóng
                </button>
                <button (click)="goToInventory()" 
                        [disabled]="qrService.scannedGs1Data()?.error || !qrService.scannedGs1Data()?.gtin"
                        class="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600">
                  <i class="fa-solid fa-boxes-stacked"></i>
                  {{ matchedItem() ? 'Cập nhật kho' : 'Thêm vào kho' }}
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `, styles: ["\n    .animate-fade-in { animation: fadeIn 0.2s ease-out; }\n    .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }\n    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }\n    @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }\n  "] }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(Gs1InfoModalComponent, { className: "Gs1InfoModalComponent", filePath: "src/app/shared/components/gs1-info-modal/gs1-info-modal.component.ts", lineNumber: 132 }); })();
//# sourceMappingURL=gs1-info-modal.component.js.map