import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterDeviceService } from './master-device.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { generateSlug } from '../../shared/utils/utils';
import { RouterLink } from '@angular/router';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.id;
function MasterDeviceManagerComponent_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 10);
    i0.ɵɵelement(1, "div", 13);
    i0.ɵɵelementEnd();
} }
function MasterDeviceManagerComponent_Conditional_17_For_2_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 27);
    i0.ɵɵtext(1, "M\u1EB7c \u0110\u1ECBnh");
    i0.ɵɵelementEnd();
} }
function MasterDeviceManagerComponent_Conditional_17_For_2_Conditional_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 29);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(item_r2.description);
} }
function MasterDeviceManagerComponent_Conditional_17_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 14)(1, "div", 16)(2, "button", 17);
    i0.ɵɵlistener("click", function MasterDeviceManagerComponent_Conditional_17_For_2_Template_button_click_2_listener() { const item_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.setDefault(item_r2)); });
    i0.ɵɵelement(3, "i", 18);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "button", 19);
    i0.ɵɵlistener("click", function MasterDeviceManagerComponent_Conditional_17_For_2_Template_button_click_4_listener() { const item_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.openEditModal(item_r2)); });
    i0.ɵɵnamespaceSVG();
    i0.ɵɵelementStart(5, "svg", 8);
    i0.ɵɵelement(6, "path", 20);
    i0.ɵɵelementEnd()();
    i0.ɵɵnamespaceHTML();
    i0.ɵɵelementStart(7, "button", 21);
    i0.ɵɵlistener("click", function MasterDeviceManagerComponent_Conditional_17_For_2_Template_button_click_7_listener() { const item_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.deleteItem(item_r2)); });
    i0.ɵɵnamespaceSVG();
    i0.ɵɵelementStart(8, "svg", 8);
    i0.ɵɵelement(9, "path", 22);
    i0.ɵɵelementEnd()()();
    i0.ɵɵnamespaceHTML();
    i0.ɵɵelementStart(10, "div", 23)(11, "div", 24);
    i0.ɵɵelement(12, "i", 25);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "div")(14, "h3", 26);
    i0.ɵɵtext(15);
    i0.ɵɵtemplate(16, MasterDeviceManagerComponent_Conditional_17_For_2_Conditional_16_Template, 2, 0, "span", 27);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "p", 28);
    i0.ɵɵtext(18);
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(19, MasterDeviceManagerComponent_Conditional_17_For_2_Conditional_19_Template, 2, 1, "p", 29);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r2 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("title", item_r2.isDefault ? "\u0110ang l\u00E0 m\u1EB7c \u0111\u1ECBnh" : "\u0110\u1EB7t l\u00E0m m\u1EB7c \u0111\u1ECBnh");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("text-amber-500", item_r2.isDefault);
    i0.ɵɵadvance(12);
    i0.ɵɵtextInterpolate1(" ", item_r2.name, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r2.isDefault ? 16 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r2.id);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r2.description ? 19 : -1);
} }
function MasterDeviceManagerComponent_Conditional_17_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 15);
    i0.ɵɵtext(1, " Ch\u01B0a c\u00F3 thi\u1EBFt b\u1ECB n\u00E0o. Nh\u1EA5n \"Th\u00EAm thi\u1EBFt b\u1ECB\" \u0111\u1EC3 t\u1EA1o. ");
    i0.ɵɵelementEnd();
} }
function MasterDeviceManagerComponent_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 11);
    i0.ɵɵrepeaterCreate(1, MasterDeviceManagerComponent_Conditional_17_For_2_Template, 20, 7, "div", 14, _forTrack0);
    i0.ɵɵtemplate(3, MasterDeviceManagerComponent_Conditional_17_Conditional_3_Template, 2, 0, "div", 15);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r2.devices());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.devices().length === 0 ? 3 : -1);
} }
function MasterDeviceManagerComponent_Conditional_18_Conditional_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 40);
    i0.ɵɵtext(1, "M\u00E3 \u0111\u1ECBnh danh kh\u00F4ng th\u1EC3 thay \u0111\u1ED5i sau khi t\u1EA1o.");
    i0.ɵɵelementEnd();
} }
function MasterDeviceManagerComponent_Conditional_18_Conditional_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 45);
} }
function MasterDeviceManagerComponent_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 12)(1, "div", 30)(2, "div", 31)(3, "h3", 32);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "button", 33);
    i0.ɵɵlistener("click", function MasterDeviceManagerComponent_Conditional_18_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.closeModal()); });
    i0.ɵɵnamespaceSVG();
    i0.ɵɵelementStart(6, "svg", 34);
    i0.ɵɵelement(7, "path", 35);
    i0.ɵɵelementEnd()()();
    i0.ɵɵnamespaceHTML();
    i0.ɵɵelementStart(8, "div", 36)(9, "div")(10, "label", 37);
    i0.ɵɵtext(11, "T\u00EAn thi\u1EBFt b\u1ECB *");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "input", 38);
    i0.ɵɵtwoWayListener("ngModelChange", function MasterDeviceManagerComponent_Conditional_18_Template_input_ngModelChange_12_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.formData.name, $event) || (ctx_r2.formData.name = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function MasterDeviceManagerComponent_Conditional_18_Template_input_ngModelChange_12_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.onNameChange()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "div")(14, "label", 37);
    i0.ɵɵtext(15, "M\u00E3 (ID) *");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "input", 39);
    i0.ɵɵtwoWayListener("ngModelChange", function MasterDeviceManagerComponent_Conditional_18_Template_input_ngModelChange_16_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.formData.id, $event) || (ctx_r2.formData.id = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(17, MasterDeviceManagerComponent_Conditional_18_Conditional_17_Template, 2, 0, "p", 40);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "div")(19, "label", 37);
    i0.ɵɵtext(20, "M\u00F4 t\u1EA3");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "textarea", 41);
    i0.ɵɵtwoWayListener("ngModelChange", function MasterDeviceManagerComponent_Conditional_18_Template_textarea_ngModelChange_21_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.formData.description, $event) || (ctx_r2.formData.description = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(22, "div", 42)(23, "button", 43);
    i0.ɵɵlistener("click", function MasterDeviceManagerComponent_Conditional_18_Template_button_click_23_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.closeModal()); });
    i0.ɵɵtext(24, " H\u1EE7y ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "button", 44);
    i0.ɵɵlistener("click", function MasterDeviceManagerComponent_Conditional_18_Template_button_click_25_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.save()); });
    i0.ɵɵtemplate(26, MasterDeviceManagerComponent_Conditional_18_Conditional_26_Template, 1, 0, "div", 45);
    i0.ɵɵtext(27, " L\u01B0u thi\u1EBFt b\u1ECB ");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.isEditMode ? "S\u1EEDa thi\u1EBFt b\u1ECB" : "Th\u00EAm thi\u1EBFt b\u1ECB m\u1EDBi", " ");
    i0.ɵɵadvance(8);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.formData.name);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.formData.id);
    i0.ɵɵproperty("disabled", ctx_r2.isEditMode);
    i0.ɵɵadvance();
    i0.ɵɵconditional(!ctx_r2.isEditMode ? 17 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.formData.description);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("disabled", ctx_r2.isSaving());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.isSaving() ? 26 : -1);
} }
export class MasterDeviceManagerComponent {
    constructor() {
        this.deviceService = inject(MasterDeviceService);
        this.toast = inject(ToastService);
        this.confirmation = inject(ConfirmationService);
        this.devices = signal([]);
        this.isLoading = signal(true);
        this.isSaving = signal(false);
        this.showModal = signal(false);
        this.editingItem = signal(null);
        this.formData = {
            id: '',
            name: '',
            description: ''
        };
        this.isEditMode = false;
    }
    async ngOnInit() {
        await this.loadData();
    }
    async loadData() {
        this.isLoading.set(true);
        try {
            await this.deviceService.seedDefaults(); // Auto seed
            const data = await this.deviceService.getAll();
            this.devices.set(data);
        }
        catch (e) {
            this.toast.show('Lỗi tải danh sách thiết bị', 'error');
        }
        finally {
            this.isLoading.set(false);
        }
    }
    openAddModal() {
        this.isEditMode = false;
        this.formData = { id: '', name: '', description: '' };
        this.showModal.set(true);
    }
    openEditModal(item) {
        this.isEditMode = true;
        this.formData = {
            id: item.id,
            name: item.name,
            description: item.description || ''
        };
        this.showModal.set(true);
    }
    closeModal() {
        this.showModal.set(false);
    }
    onNameChange() {
        if (!this.isEditMode && this.formData.name) {
            this.formData.id = generateSlug(this.formData.name);
        }
    }
    async save() {
        if (!this.formData.id || !this.formData.name) {
            this.toast.show('Vui lòng nhập mã và tên thiết bị', 'error');
            return;
        }
        this.isSaving.set(true);
        try {
            const payload = {
                id: this.formData.id,
                name: this.formData.name,
                description: this.formData.description
            };
            await this.deviceService.save(payload);
            this.toast.show('Đã lưu thiết bị thành công', 'success');
            this.closeModal();
            await this.loadData();
        }
        catch (e) {
            this.toast.show('Lỗi khi lưu: ' + e.message, 'error');
        }
        finally {
            this.isSaving.set(false);
        }
    }
    async deleteItem(item) {
        const ok = await this.confirmation.confirm({
            message: `Bạn có chắc chắn muốn xóa thiết bị "${item.name}" không?`,
            isDangerous: true
        });
        if (!ok)
            return;
        try {
            await this.deviceService.delete(item.id);
            this.toast.show('Đã xóa thiết bị', 'success');
            await this.loadData();
        }
        catch (e) {
            this.toast.show('Lỗi khi xóa: ' + e.message, 'error');
        }
    }
    async setDefault(item) {
        try {
            await this.deviceService.toggleDefault(item);
            const msg = item.isDefault ? `Đã gỡ bỏ mặc định của "${item.name}"` : `Đã đặt "${item.name}" làm thiết bị mặc định`;
            this.toast.show(msg, 'success');
            await this.loadData();
        }
        catch (e) {
            this.toast.show('Lỗi: ' + e.message, 'error');
        }
    }
    static { this.ɵfac = function MasterDeviceManagerComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || MasterDeviceManagerComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: MasterDeviceManagerComponent, selectors: [["app-master-device-manager"]], decls: 19, vars: 2, consts: [[1, "p-6", "max-w-6xl", "mx-auto"], [1, "flex", "items-center", "justify-between", "mb-6"], [1, "text-2xl", "font-bold", "text-slate-800", "dark:text-white", "flex", "items-center", "gap-2"], [1, "text-3xl"], [1, "text-slate-500", "dark:text-slate-400", "mt-1"], [1, "flex", "items-center", "gap-3"], ["routerLink", "/config", 1, "px-4", "py-2", "text-sm", "font-medium", "text-slate-600", "bg-slate-100", "hover:bg-slate-200", "dark:text-slate-300", "dark:bg-slate-800", "dark:hover:bg-slate-700", "rounded-lg", "transition-colors"], [1, "px-4", "py-2", "bg-blue-600", "hover:bg-blue-700", "text-white", "text-sm", "font-medium", "rounded-lg", "transition-colors", "shadow-sm", "flex", "items-center", "gap-2", 3, "click"], ["xmlns", "http://www.w3.org/2000/svg", "fill", "none", "viewBox", "0 0 24 24", "stroke", "currentColor", 1, "h-4", "w-4"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M12 4v16m8-8H4"], [1, "flex", "justify-center", "p-12"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-4"], [1, "fixed", "inset-0", "bg-slate-900/50", "backdrop-blur-sm", "z-50", "flex", "items-center", "justify-center", "p-4"], [1, "animate-spin", "rounded-full", "h-8", "w-8", "border-b-2", "border-blue-600"], [1, "bg-white", "dark:bg-slate-800", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "p-5", "shadow-sm", "hover:shadow-md", "transition-shadow", "relative", "group"], [1, "col-span-full", "py-12", "text-center", "text-slate-500"], [1, "absolute", "top-4", "right-4", "opacity-0", "group-hover:opacity-100", "transition-opacity", "flex", "items-center", "gap-1"], [1, "p-1.5", "text-slate-400", "hover:text-amber-500", "dark:hover:text-amber-400", "bg-slate-50", "dark:bg-slate-700", "rounded", "transition-colors", 3, "click", "title"], [1, "fa-solid", "fa-star"], ["title", "S\u1EEDa", 1, "p-1.5", "text-slate-400", "hover:text-blue-600", "dark:hover:text-blue-400", "bg-slate-50", "dark:bg-slate-700", "rounded", "transition-colors", 3, "click"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"], ["title", "X\u00F3a", 1, "p-1.5", "text-slate-400", "hover:text-red-600", "dark:hover:text-red-400", "bg-slate-50", "dark:bg-slate-700", "rounded", "transition-colors", 3, "click"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"], [1, "flex", "items-start", "gap-3"], [1, "w-10", "h-10", "rounded-lg", "flex", "items-center", "justify-center", "shrink-0", "bg-blue-50", "dark:bg-blue-900/20", "text-blue-600", "dark:text-blue-400"], [1, "fa-solid", "fa-microchip"], [1, "font-bold", "text-slate-800", "dark:text-white", "flex", "items-center", "gap-2"], [1, "text-[10px]", "bg-amber-100", "text-amber-700", "dark:bg-amber-900/30", "dark:text-amber-400", "px-1.5", "py-0.5", "rounded-full", "font-bold", "uppercase", "border", "border-amber-200", "dark:border-amber-800"], [1, "text-xs", "text-slate-500", "font-mono", "mt-0.5"], [1, "text-sm", "text-slate-600", "dark:text-slate-400", "mt-3", "line-clamp-2"], [1, "bg-white", "dark:bg-slate-800", "rounded-xl", "shadow-xl", "w-full", "max-w-md", "overflow-hidden", "flex", "flex-col"], [1, "p-4", "border-b", "border-slate-100", "dark:border-slate-700", "flex", "justify-between", "items-center"], [1, "font-bold", "text-lg", "text-slate-800", "dark:text-white"], [1, "text-slate-400", "hover:text-slate-600", "dark:hover:text-slate-200", 3, "click"], ["xmlns", "http://www.w3.org/2000/svg", "fill", "none", "viewBox", "0 0 24 24", "stroke", "currentColor", 1, "h-6", "w-6"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M6 18L18 6M6 6l12 12"], [1, "p-4", "space-y-4"], [1, "block", "text-sm", "font-medium", "text-slate-700", "dark:text-slate-300", "mb-1"], ["type", "text", "placeholder", "VD: GC-MS/MS, LC-MS/MS...", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "bg-white", "dark:bg-slate-700", "text-slate-900", "dark:text-white", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "outline-none", 3, "ngModelChange", "ngModel"], ["type", "text", "placeholder", "VD: gcmsms", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "bg-slate-50", "dark:bg-slate-800", "text-slate-900", "dark:text-white", "rounded-lg", "disabled:opacity-70", "outline-none", "font-mono", "text-sm", 3, "ngModelChange", "ngModel", "disabled"], [1, "text-xs", "text-slate-500", "mt-1"], ["rows", "3", "placeholder", "Ghi ch\u00FA th\u00EAm...", 1, "w-full", "px-3", "py-2", "border", "border-slate-300", "dark:border-slate-600", "bg-white", "dark:bg-slate-700", "text-slate-900", "dark:text-white", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "outline-none", 3, "ngModelChange", "ngModel"], [1, "p-4", "border-t", "border-slate-100", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-900/30", "flex", "justify-end", "gap-2"], [1, "px-4", "py-2", "text-sm", "font-medium", "text-slate-700", "dark:text-slate-300", "hover:bg-slate-200", "dark:hover:bg-slate-700", "rounded-lg", "transition-colors", 3, "click"], [1, "px-4", "py-2", "bg-blue-600", "hover:bg-blue-700", "disabled:opacity-50", "text-white", "text-sm", "font-medium", "rounded-lg", "transition-colors", "flex", "items-center", "gap-2", 3, "click", "disabled"], [1, "animate-spin", "rounded-full", "h-4", "w-4", "border-b-2", "border-white"]], template: function MasterDeviceManagerComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "h1", 2)(4, "span", 3);
            i0.ɵɵtext(5, "\uD83D\uDCBB");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(6, " Qu\u1EA3n L\u00FD Thi\u1EBFt B\u1ECB Ph\u00E2n T\u00EDch ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "p", 4);
            i0.ɵɵtext(8, "Qu\u1EA3n l\u00FD danh s\u00E1ch c\u00E1c thi\u1EBFt b\u1ECB \u00E1p d\u1EE5ng cho SOP v\u00E0 khai b\u00E1o m\u1EBB.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(9, "div", 5)(10, "a", 6);
            i0.ɵɵtext(11, " Quay l\u1EA1i c\u1EA5u h\u00ECnh ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "button", 7);
            i0.ɵɵlistener("click", function MasterDeviceManagerComponent_Template_button_click_12_listener() { return ctx.openAddModal(); });
            i0.ɵɵnamespaceSVG();
            i0.ɵɵelementStart(13, "svg", 8);
            i0.ɵɵelement(14, "path", 9);
            i0.ɵɵelementEnd();
            i0.ɵɵtext(15, " Th\u00EAm Thi\u1EBFt B\u1ECB ");
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(16, MasterDeviceManagerComponent_Conditional_16_Template, 2, 0, "div", 10)(17, MasterDeviceManagerComponent_Conditional_17_Template, 4, 1, "div", 11);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(18, MasterDeviceManagerComponent_Conditional_18_Template, 28, 8, "div", 12);
        } if (rf & 2) {
            i0.ɵɵadvance(16);
            i0.ɵɵconditional(ctx.isLoading() ? 16 : 17);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.showModal() ? 18 : -1);
        } }, dependencies: [CommonModule, FormsModule, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgModel, RouterLink], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(MasterDeviceManagerComponent, [{
        type: Component,
        args: [{ selector: 'app-master-device-manager', standalone: true, imports: [CommonModule, FormsModule, RouterLink], template: "<div class=\"p-6 max-w-6xl mx-auto\">\r\n  <div class=\"flex items-center justify-between mb-6\">\r\n    <div>\r\n      <h1 class=\"text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2\">\r\n        <span class=\"text-3xl\">\uD83D\uDCBB</span> Qu\u1EA3n L\u00FD Thi\u1EBFt B\u1ECB Ph\u00E2n T\u00EDch\r\n      </h1>\r\n      <p class=\"text-slate-500 dark:text-slate-400 mt-1\">Qu\u1EA3n l\u00FD danh s\u00E1ch c\u00E1c thi\u1EBFt b\u1ECB \u00E1p d\u1EE5ng cho SOP v\u00E0 khai b\u00E1o m\u1EBB.</p>\r\n    </div>\r\n    \r\n    <div class=\"flex items-center gap-3\">\r\n      <a routerLink=\"/config\" class=\"px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors\">\r\n        Quay l\u1EA1i c\u1EA5u h\u00ECnh\r\n      </a>\r\n      <button (click)=\"openAddModal()\" class=\"px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2\">\r\n        <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-4 w-4\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M12 4v16m8-8H4\"/></svg>\r\n        Th\u00EAm Thi\u1EBFt B\u1ECB\r\n      </button>\r\n    </div>\r\n  </div>\r\n\r\n  @if (isLoading()) {\r\n    <div class=\"flex justify-center p-12\">\r\n      <div class=\"animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600\"></div>\r\n    </div>\r\n  } @else {\r\n    <div class=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4\">\r\n      @for (item of devices(); track item.id) {\r\n        <div class=\"bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-shadow relative group\">\r\n          \r\n          <div class=\"absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1\">\r\n            <button (click)=\"setDefault(item)\" class=\"p-1.5 text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 bg-slate-50 dark:bg-slate-700 rounded transition-colors\" [title]=\"item.isDefault ? '\u0110ang l\u00E0 m\u1EB7c \u0111\u1ECBnh' : '\u0110\u1EB7t l\u00E0m m\u1EB7c \u0111\u1ECBnh'\">\r\n              <i class=\"fa-solid fa-star\" [class.text-amber-500]=\"item.isDefault\"></i>\r\n            </button>\r\n            <button (click)=\"openEditModal(item)\" class=\"p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-50 dark:bg-slate-700 rounded transition-colors\" title=\"S\u1EEDa\">\r\n              <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-4 w-4\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z\"/></svg>\r\n            </button>\r\n            <button (click)=\"deleteItem(item)\" class=\"p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 bg-slate-50 dark:bg-slate-700 rounded transition-colors\" title=\"X\u00F3a\">\r\n              <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-4 w-4\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16\"/></svg>\r\n            </button>\r\n          </div>\r\n\r\n          <div class=\"flex items-start gap-3\">\r\n            <div class=\"w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400\">\r\n               <i class=\"fa-solid fa-microchip\"></i>\r\n            </div>\r\n            <div>\r\n              <h3 class=\"font-bold text-slate-800 dark:text-white flex items-center gap-2\">\r\n                {{ item.name }}\r\n                @if (item.isDefault) {\r\n                  <span class=\"text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded-full font-bold uppercase border border-amber-200 dark:border-amber-800\">M\u1EB7c \u0110\u1ECBnh</span>\r\n                }\r\n              </h3>\r\n              <p class=\"text-xs text-slate-500 font-mono mt-0.5\">{{ item.id }}</p>\r\n            </div>\r\n          </div>\r\n          \r\n          @if (item.description) {\r\n            <p class=\"text-sm text-slate-600 dark:text-slate-400 mt-3 line-clamp-2\">{{ item.description }}</p>\r\n          }\r\n        </div>\r\n      }\r\n      \r\n      @if (devices().length === 0) {\r\n        <div class=\"col-span-full py-12 text-center text-slate-500\">\r\n          Ch\u01B0a c\u00F3 thi\u1EBFt b\u1ECB n\u00E0o. Nh\u1EA5n \"Th\u00EAm thi\u1EBFt b\u1ECB\" \u0111\u1EC3 t\u1EA1o.\r\n        </div>\r\n      }\r\n    </div>\r\n  }\r\n</div>\r\n\r\n<!-- Modal -->\r\n@if (showModal()) {\r\n  <div class=\"fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4\">\r\n    <div class=\"bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col\">\r\n      <div class=\"p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center\">\r\n        <h3 class=\"font-bold text-lg text-slate-800 dark:text-white\">\r\n          {{ isEditMode ? 'S\u1EEDa thi\u1EBFt b\u1ECB' : 'Th\u00EAm thi\u1EBFt b\u1ECB m\u1EDBi' }}\r\n        </h3>\r\n        <button (click)=\"closeModal()\" class=\"text-slate-400 hover:text-slate-600 dark:hover:text-slate-200\">\r\n          <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-6 w-6\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M6 18L18 6M6 6l12 12\"/></svg>\r\n        </button>\r\n      </div>\r\n      \r\n      <div class=\"p-4 space-y-4\">\r\n        <div>\r\n          <label class=\"block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1\">T\u00EAn thi\u1EBFt b\u1ECB *</label>\r\n          <input type=\"text\" [(ngModel)]=\"formData.name\" (ngModelChange)=\"onNameChange()\" class=\"w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none\" placeholder=\"VD: GC-MS/MS, LC-MS/MS...\">\r\n        </div>\r\n        \r\n        <div>\r\n          <label class=\"block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1\">M\u00E3 (ID) *</label>\r\n          <input type=\"text\" [(ngModel)]=\"formData.id\" [disabled]=\"isEditMode\" class=\"w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg disabled:opacity-70 outline-none font-mono text-sm\" placeholder=\"VD: gcmsms\">\r\n          @if (!isEditMode) {\r\n             <p class=\"text-xs text-slate-500 mt-1\">M\u00E3 \u0111\u1ECBnh danh kh\u00F4ng th\u1EC3 thay \u0111\u1ED5i sau khi t\u1EA1o.</p>\r\n          }\r\n        </div>\r\n        \r\n        <div>\r\n          <label class=\"block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1\">M\u00F4 t\u1EA3</label>\r\n          <textarea [(ngModel)]=\"formData.description\" rows=\"3\" class=\"w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none\" placeholder=\"Ghi ch\u00FA th\u00EAm...\"></textarea>\r\n        </div>\r\n      </div>\r\n      \r\n      <div class=\"p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 flex justify-end gap-2\">\r\n        <button (click)=\"closeModal()\" class=\"px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors\">\r\n          H\u1EE7y\r\n        </button>\r\n        <button (click)=\"save()\" [disabled]=\"isSaving()\" class=\"px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2\">\r\n          @if (isSaving()) {\r\n            <div class=\"animate-spin rounded-full h-4 w-4 border-b-2 border-white\"></div>\r\n          }\r\n          L\u01B0u thi\u1EBFt b\u1ECB\r\n        </button>\r\n      </div>\r\n    </div>\r\n  </div>\r\n}\r\n" }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(MasterDeviceManagerComponent, { className: "MasterDeviceManagerComponent", filePath: "src/app/features/config/master-device-manager.component.ts", lineNumber: 17 }); })();
//# sourceMappingURL=master-device-manager.component.js.map