import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { ToastService } from '../../core/services/toast.service';
import { generateSlug } from '../../shared/utils/utils';
import { SampleDescriptionMasterService } from './sample-description-master.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.id;
function SampleDescriptionMasterComponent_Conditional_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 24);
    i0.ɵɵelement(1, "i", 29);
    i0.ɵɵelementEnd();
} }
function SampleDescriptionMasterComponent_Conditional_35_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 25);
    i0.ɵɵtext(1, "Ch\u01B0a c\u00F3 m\u00F4 t\u1EA3 m\u1EABu ph\u00F9 h\u1EE3p.");
    i0.ɵɵelementEnd();
} }
function SampleDescriptionMasterComponent_Conditional_36_For_2_Conditional_15_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 44);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const alias_r4 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(alias_r4);
} }
function SampleDescriptionMasterComponent_Conditional_36_For_2_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 42);
    i0.ɵɵrepeaterCreate(1, SampleDescriptionMasterComponent_Conditional_36_For_2_Conditional_15_For_2_Template, 2, 1, "span", 44, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵrepeater(item_r2.aliases);
} }
function SampleDescriptionMasterComponent_Conditional_36_For_2_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 43);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(item_r2.description);
} }
function SampleDescriptionMasterComponent_Conditional_36_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "article", 31)(1, "div", 32)(2, "div", 33)(3, "div", 6)(4, "h2", 34);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "span", 35);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 36);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "div", 37)(11, "button", 38);
    i0.ɵɵlistener("click", function SampleDescriptionMasterComponent_Conditional_36_For_2_Template_button_click_11_listener() { const item_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.openEditModal(item_r2)); });
    i0.ɵɵelement(12, "i", 39);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "button", 40);
    i0.ɵɵlistener("click", function SampleDescriptionMasterComponent_Conditional_36_For_2_Template_button_click_13_listener() { const item_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.toggleActive(item_r2)); });
    i0.ɵɵelement(14, "i", 41);
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(15, SampleDescriptionMasterComponent_Conditional_36_For_2_Conditional_15_Template, 3, 0, "div", 42)(16, SampleDescriptionMasterComponent_Conditional_36_For_2_Conditional_16_Template, 2, 1, "p", 43);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r2 = ctx.$implicit;
    i0.ɵɵclassProp("border-slate-200", item_r2.isActive)("dark:border-slate-700", item_r2.isActive)("border-amber-300", !item_r2.isActive)("opacity-70", !item_r2.isActive);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(item_r2.name);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", item_r2.isActive ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(item_r2.isActive ? "\u0110ang d\u00F9ng" : "\u0110\u00E3 ng\u1EEBng");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r2.id);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("title", item_r2.isActive ? "Ng\u1EEBng s\u1EED d\u1EE5ng" : "K\u00EDch ho\u1EA1t l\u1EA1i");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("fa-pause", item_r2.isActive)("fa-play", !item_r2.isActive);
    i0.ɵɵadvance();
    i0.ɵɵconditional((item_r2.aliases == null ? null : item_r2.aliases.length) ? 15 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r2.description ? 16 : -1);
} }
function SampleDescriptionMasterComponent_Conditional_36_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 26);
    i0.ɵɵrepeaterCreate(1, SampleDescriptionMasterComponent_Conditional_36_For_2_Template, 17, 19, "article", 30, _forTrack0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r2.filteredItems());
} }
function SampleDescriptionMasterComponent_Conditional_37_Conditional_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 62);
} }
function SampleDescriptionMasterComponent_Conditional_37_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 27)(1, "div", 45)(2, "header", 46)(3, "h2", 47);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "button", 48);
    i0.ɵɵlistener("click", function SampleDescriptionMasterComponent_Conditional_37_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.closeModal()); });
    i0.ɵɵelement(6, "i", 49);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "div", 50)(8, "div")(9, "label", 51);
    i0.ɵɵtext(10, "T\u00EAn m\u00F4 t\u1EA3 m\u1EABu *");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "input", 52);
    i0.ɵɵtwoWayListener("ngModelChange", function SampleDescriptionMasterComponent_Conditional_37_Template_input_ngModelChange_11_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.formData.name, $event) || (ctx_r2.formData.name = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SampleDescriptionMasterComponent_Conditional_37_Template_input_ngModelChange_11_listener() { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.onNameChange()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "div")(13, "label", 51);
    i0.ɵɵtext(14, "M\u00E3 \u0111\u1ECBnh danh *");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "input", 53);
    i0.ɵɵtwoWayListener("ngModelChange", function SampleDescriptionMasterComponent_Conditional_37_Template_input_ngModelChange_15_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.formData.id, $event) || (ctx_r2.formData.id = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "p", 54);
    i0.ɵɵtext(17, "D\u00F9ng quy \u01B0\u1EDBc snake_case gi\u1ED1ng danh m\u1EE5c ch\u1EC9 ti\u00EAu g\u1ED1c, v\u00ED d\u1EE5: ca_tra, hanh_tim.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(18, "div")(19, "label", 51);
    i0.ɵɵtext(20, "B\u00ED danh");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "textarea", 55);
    i0.ɵɵtwoWayListener("ngModelChange", function SampleDescriptionMasterComponent_Conditional_37_Template_textarea_ngModelChange_21_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.formData.aliasesText, $event) || (ctx_r2.formData.aliasesText = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(22, "div")(23, "label", 51);
    i0.ɵɵtext(24, "Ghi ch\u00FA qu\u1EA3n tr\u1ECB");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "textarea", 56);
    i0.ɵɵtwoWayListener("ngModelChange", function SampleDescriptionMasterComponent_Conditional_37_Template_textarea_ngModelChange_25_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.formData.description, $event) || (ctx_r2.formData.description = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(26, "label", 57)(27, "input", 58);
    i0.ɵɵtwoWayListener("ngModelChange", function SampleDescriptionMasterComponent_Conditional_37_Template_input_ngModelChange_27_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.formData.isActive, $event) || (ctx_r2.formData.isActive = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵtext(28, "\u0110ang s\u1EED d\u1EE5ng");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(29, "footer", 59)(30, "button", 60);
    i0.ɵɵlistener("click", function SampleDescriptionMasterComponent_Conditional_37_Template_button_click_30_listener() { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.closeModal()); });
    i0.ɵɵtext(31, "H\u1EE7y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "button", 61);
    i0.ɵɵlistener("click", function SampleDescriptionMasterComponent_Conditional_37_Template_button_click_32_listener() { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.save()); });
    i0.ɵɵtemplate(33, SampleDescriptionMasterComponent_Conditional_37_Conditional_33_Template, 1, 0, "i", 62);
    i0.ɵɵtext(34, "L\u01B0u");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r2.editingId() ? "Ch\u1EC9nh s\u1EEDa m\u00F4 t\u1EA3 m\u1EABu" : "Th\u00EAm m\u00F4 t\u1EA3 m\u1EABu");
    i0.ɵɵadvance(7);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.formData.name);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.formData.id);
    i0.ɵɵproperty("disabled", !!ctx_r2.editingId());
    i0.ɵɵadvance(6);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.formData.aliasesText);
    i0.ɵɵadvance(4);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.formData.description);
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.formData.isActive);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("disabled", ctx_r2.saving());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.saving() ? 33 : -1);
} }
function SampleDescriptionMasterComponent_Conditional_38_For_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 73);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 74);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "td", 75);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "td", 68);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r7 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r7.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r7.id);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate((item_r7.aliases == null ? null : item_r7.aliases.join(", ")) || "\u2014");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r7.isActive ? "\u0110ang d\u00F9ng" : "\u0110\u00E3 ng\u1EEBng");
} }
function SampleDescriptionMasterComponent_Conditional_38_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 28)(1, "div", 63)(2, "header", 64)(3, "h2", 47);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "div", 65)(6, "table", 66)(7, "thead", 67)(8, "tr")(9, "th", 68);
    i0.ɵɵtext(10, "T\u00EAn");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "th", 68);
    i0.ɵɵtext(12, "M\u00E3");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "th", 68);
    i0.ɵɵtext(14, "B\u00ED danh");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "th", 68);
    i0.ɵɵtext(16, "Tr\u1EA1ng th\u00E1i");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(17, "tbody", 69);
    i0.ɵɵrepeaterCreate(18, SampleDescriptionMasterComponent_Conditional_38_For_19_Template, 9, 4, "tr", null, i0.ɵɵrepeaterTrackByIndex);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(20, "footer", 70)(21, "button", 71);
    i0.ɵɵlistener("click", function SampleDescriptionMasterComponent_Conditional_38_Template_button_click_21_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.importPreview.set([])); });
    i0.ɵɵtext(22, "H\u1EE7y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "button", 72);
    i0.ɵɵlistener("click", function SampleDescriptionMasterComponent_Conditional_38_Template_button_click_23_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.confirmImport()); });
    i0.ɵɵtext(24, "X\u00E1c Nh\u1EADn Nh\u1EADp D\u1EEF Li\u1EC7u");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("X\u00E1c nh\u1EADn nh\u1EADp d\u1EEF li\u1EC7u ", ctx_r2.importPreview().length, " m\u00F4 t\u1EA3 m\u1EABu");
    i0.ɵɵadvance(14);
    i0.ɵɵrepeater(ctx_r2.importPreview());
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("disabled", ctx_r2.saving());
} }
export class SampleDescriptionMasterComponent {
    constructor() {
        this.service = inject(SampleDescriptionMasterService);
        this.toast = inject(ToastService);
        this.confirmation = inject(ConfirmationService);
        this.auth = inject(AuthService);
        this.items = signal([]);
        this.loading = signal(true);
        this.saving = signal(false);
        this.showModal = signal(false);
        this.editingId = signal(null);
        this.searchTerm = signal('');
        this.statusFilter = signal('active');
        this.importPreview = signal([]);
        this.formData = this.emptyForm();
        this.filteredItems = computed(() => {
            const term = normalizeText(this.searchTerm());
            const status = this.statusFilter();
            return this.items().filter(item => {
                if (status === 'active' && !item.isActive)
                    return false;
                if (status === 'inactive' && item.isActive)
                    return false;
                if (!term)
                    return true;
                return normalizeText([item.id, item.name, ...(item.aliases || []), item.description || ''].join(' ')).includes(term);
            });
        });
    }
    async ngOnInit() {
        await this.loadData();
    }
    async loadData() {
        this.loading.set(true);
        try {
            this.items.set(await this.service.getAll());
        }
        catch (error) {
            this.toast.show(`Không thể tải danh mục mô tả mẫu: ${error?.message || error}`, 'error');
        }
        finally {
            this.loading.set(false);
        }
    }
    openAddModal() {
        this.editingId.set(null);
        this.formData = this.emptyForm();
        this.showModal.set(true);
    }
    openEditModal(item) {
        this.editingId.set(item.id);
        this.formData = {
            id: item.id,
            name: item.name,
            aliasesText: (item.aliases || []).join('\n'),
            description: item.description || '',
            isActive: item.isActive
        };
        this.showModal.set(true);
    }
    closeModal() {
        this.showModal.set(false);
        this.editingId.set(null);
    }
    onNameChange() {
        if (!this.editingId())
            this.formData.id = generateSlug(this.formData.name);
    }
    async save() {
        const item = this.buildItemFromForm();
        if (!item.id || !item.name) {
            this.toast.show('Vui lòng nhập mã và tên mô tả mẫu.', 'error');
            return;
        }
        if (!/^[a-z0-9_]+$/.test(item.id)) {
            this.toast.show('Mã định danh phải dùng chữ thường không dấu, số và dấu gạch dưới (_), ví dụ: ca_tra.', 'error');
            return;
        }
        const duplicateId = this.items().find(existing => existing.id === item.id && existing.id !== this.editingId());
        if (duplicateId) {
            this.toast.show(`Mã định danh “${item.id}” đã được sử dụng cho “${duplicateId.name}”.`, 'error');
            return;
        }
        const duplicate = this.items().find(existing => existing.id !== this.editingId() && normalizeText(existing.name) === normalizeText(item.name));
        if (duplicate) {
            this.toast.show(`Tên mô tả đã tồn tại với mã “${duplicate.id}”.`, 'error');
            return;
        }
        this.saving.set(true);
        try {
            await this.service.save(item, this.auth.currentUser()?.displayName || '');
            this.toast.show('Đã lưu danh mục mô tả mẫu.', 'success');
            this.closeModal();
            await this.loadData();
        }
        catch (error) {
            this.toast.show(`Không thể lưu: ${error?.message || error}`, 'error');
        }
        finally {
            this.saving.set(false);
        }
    }
    async toggleActive(item) {
        const nextActive = !item.isActive;
        if (!nextActive) {
            const confirmed = await this.confirmation.confirm({
                message: `Ngừng sử dụng “${item.name}”? Dữ liệu đã lưu trong các mẻ cũ vẫn được giữ nguyên.`,
                confirmText: 'Ngừng sử dụng'
            });
            if (!confirmed)
                return;
        }
        try {
            await this.service.setActive(item, nextActive, this.auth.currentUser()?.displayName || '');
            this.toast.show(nextActive ? 'Đã kích hoạt mô tả mẫu.' : 'Đã ngừng sử dụng mô tả mẫu.', 'success');
            await this.loadData();
        }
        catch (error) {
            this.toast.show(`Không thể cập nhật trạng thái: ${error?.message || error}`, 'error');
        }
    }
    async onFileSelected(event) {
        const input = event.target;
        const file = input.files?.[0];
        if (!file)
            return;
        try {
            const XLSX = await import('xlsx');
            const data = new Uint8Array(await file.arrayBuffer());
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet);
            const parsed = rows.map(row => this.parseImportRow(row)).filter((item) => Boolean(item));
            this.importPreview.set(parsed);
            this.toast.show(`Đã đọc ${parsed.length} dòng hợp lệ.`, parsed.length ? 'success' : 'info');
        }
        catch (error) {
            this.toast.show(`Không thể đọc file: ${error?.message || error}`, 'error');
        }
        finally {
            input.value = '';
        }
    }
    async confirmImport() {
        const preview = this.importPreview();
        if (!preview.length)
            return;
        this.saving.set(true);
        try {
            await this.service.saveBatch(preview, this.auth.currentUser()?.displayName || '');
            this.importPreview.set([]);
            this.toast.show(`Đã import ${preview.length} mô tả mẫu.`, 'success');
            await this.loadData();
        }
        catch (error) {
            this.toast.show(`Không thể nhập dữ liệu: ${error?.message || error}`, 'error');
        }
        finally {
            this.saving.set(false);
        }
    }
    async exportToExcel() {
        try {
            const XLSX = await import('xlsx');
            const rows = this.items().map(item => ({
                'Mã định danh': item.id,
                'Tên mô tả mẫu': item.name,
                'Bí danh': (item.aliases || []).join('; '),
                'Mô tả / Ghi chú': item.description || '',
                'Đang sử dụng': item.isActive ? 'Có' : 'Không'
            }));
            const worksheet = XLSX.utils.json_to_sheet(rows);
            worksheet['!cols'] = [{ wch: 24 }, { wch: 32 }, { wch: 36 }, { wch: 48 }, { wch: 16 }];
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'MoTaMau');
            XLSX.writeFile(workbook, 'LIMS_Master_Mo_Ta_Mau.xlsx');
        }
        catch (error) {
            this.toast.show(`Không thể xuất Excel: ${error?.message || error}`, 'error');
        }
    }
    parseImportRow(row) {
        let id = '';
        let name = '';
        let aliasesText = '';
        let description = '';
        let isActive = true;
        Object.entries(row).forEach(([rawKey, rawValue]) => {
            const key = normalizeText(rawKey);
            const value = String(rawValue ?? '').trim();
            if ((key.includes('ma id') || key.includes('ma dinh danh') || key === 'id') && value)
                id = value;
            else if ((key.includes('ten mo ta') || key === 'name' || key === 'ten') && value)
                name = value;
            else if (key.includes('bi danh') || key.includes('alias'))
                aliasesText = value;
            else if (key.includes('ghi chu') || key === 'mo ta' || key.includes('description'))
                description = value;
            else if (key.includes('dang su dung') || key.includes('active'))
                isActive = !['khong', 'no', 'false', '0'].includes(normalizeText(value));
        });
        if (!name)
            return null;
        return {
            id: generateSlug(id || name),
            name,
            aliases: splitAliases(aliasesText),
            description,
            isActive
        };
    }
    buildItemFromForm() {
        return {
            id: this.formData.id.trim(),
            name: this.formData.name.trim(),
            aliases: splitAliases(this.formData.aliasesText),
            description: this.formData.description.trim(),
            isActive: this.formData.isActive
        };
    }
    emptyForm() {
        return { id: '', name: '', aliasesText: '', description: '', isActive: true };
    }
    static { this.ɵfac = function SampleDescriptionMasterComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SampleDescriptionMasterComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: SampleDescriptionMasterComponent, selectors: [["app-sample-description-master"]], decls: 39, vars: 5, consts: [[1, "p-4", "md:p-6", "max-w-7xl", "mx-auto", "space-y-5"], [1, "flex", "flex-col", "lg:flex-row", "lg:items-center", "justify-between", "gap-4"], [1, "text-2xl", "font-black", "text-slate-850", "dark:text-white", "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-xl", "bg-fuchsia-50", "dark:bg-fuchsia-900/20", "text-fuchsia-600", "dark:text-fuchsia-400", "flex", "items-center", "justify-center"], [1, "fa-solid", "fa-tags"], [1, "mt-1", "text-sm", "text-slate-500", "dark:text-slate-400"], [1, "flex", "flex-wrap", "items-center", "gap-2"], ["routerLink", "/config", 1, "h-10", "px-4", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "text-sm", "font-bold", "text-slate-600", "dark:text-slate-300", "flex", "items-center", "gap-2", "hover:bg-slate-50", "dark:hover:bg-slate-800"], [1, "fa-solid", "fa-arrow-left"], [1, "h-10", "px-4", "rounded-xl", "border", "border-emerald-200", "dark:border-emerald-800", "text-sm", "font-bold", "text-emerald-700", "dark:text-emerald-400", "flex", "items-center", "gap-2", "cursor-pointer", "hover:bg-emerald-50", "dark:hover:bg-emerald-900/20"], [1, "fa-solid", "fa-file-import"], ["type", "file", "accept", ".xlsx,.xls,.csv", 1, "hidden", 3, "change"], ["type", "button", 1, "h-10", "px-4", "rounded-xl", "border", "border-blue-200", "dark:border-blue-800", "text-sm", "font-bold", "text-blue-700", "dark:text-blue-400", "hover:bg-blue-50", "dark:hover:bg-blue-900/20", 3, "click"], [1, "fa-solid", "fa-file-export", "mr-1.5"], ["type", "button", 1, "h-10", "px-4", "rounded-xl", "bg-fuchsia-600", "hover:bg-fuchsia-700", "text-white", "text-sm", "font-bold", "shadow-sm", 3, "click"], [1, "fa-solid", "fa-plus", "mr-1.5"], [1, "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-2xl", "p-3", "shadow-sm", "flex", "flex-col", "md:flex-row", "gap-3"], [1, "relative", "flex-1"], [1, "fa-solid", "fa-magnifying-glass", "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-slate-400", "text-xs"], ["placeholder", "T\u00ECm theo t\u00EAn, m\u00E3 ho\u1EB7c b\u00ED danh...", 1, "w-full", "h-10", "pl-9", "pr-3", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-900", "text-sm", "text-slate-800", "dark:text-slate-200", "outline-none", "focus:border-fuchsia-400", 3, "ngModelChange", "ngModel"], [1, "h-10", "px-3", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "bg-white", "dark:bg-slate-900", "text-sm", "font-bold", "text-slate-600", "dark:text-slate-300", 3, "ngModelChange", "ngModel"], ["value", "active"], ["value", "inactive"], ["value", "all"], [1, "py-20", "text-center", "text-slate-400"], [1, "py-16", "text-center", "bg-white", "dark:bg-slate-800", "border", "border-dashed", "border-slate-300", "dark:border-slate-700", "rounded-2xl", "text-slate-500"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "xl:grid-cols-3", "gap-4"], [1, "fixed", "inset-0", "z-[100]", "bg-slate-900/60", "backdrop-blur-sm", "flex", "items-center", "justify-center", "p-4"], [1, "fixed", "inset-0", "z-[110]", "bg-slate-900/60", "backdrop-blur-sm", "flex", "items-center", "justify-center", "p-4"], [1, "fa-solid", "fa-circle-notch", "fa-spin", "text-2xl"], [1, "bg-white", "dark:bg-slate-800", "border", "rounded-2xl", "p-5", "shadow-sm", 3, "border-slate-200", "dark:border-slate-700", "border-amber-300", "opacity-70"], [1, "bg-white", "dark:bg-slate-800", "border", "rounded-2xl", "p-5", "shadow-sm"], [1, "flex", "items-start", "justify-between", "gap-3"], [1, "min-w-0"], [1, "font-black", "text-slate-850", "dark:text-slate-100", "break-words"], [1, "px-2", "py-0.5", "rounded-full", "text-[9px]", "font-black", "uppercase", 3, "ngClass"], [1, "mt-1", "text-[11px]", "font-mono", "text-slate-400"], [1, "flex", "items-center", "gap-1", "shrink-0"], ["type", "button", "title", "Ch\u1EC9nh s\u1EEDa", 1, "w-8", "h-8", "rounded-lg", "text-slate-400", "hover:text-blue-600", "hover:bg-blue-50", "dark:hover:bg-blue-900/20", 3, "click"], [1, "fa-solid", "fa-pen"], ["type", "button", 1, "w-8", "h-8", "rounded-lg", "text-slate-400", "hover:text-amber-600", "hover:bg-amber-50", "dark:hover:bg-amber-900/20", 3, "click", "title"], [1, "fa-solid"], [1, "mt-3", "flex", "flex-wrap", "gap-1.5"], [1, "mt-3", "text-sm", "text-slate-600", "dark:text-slate-400", "leading-relaxed"], [1, "px-2", "py-1", "rounded-lg", "bg-slate-50", "dark:bg-slate-900", "text-[10px]", "font-bold", "text-slate-500", "dark:text-slate-400", "border", "border-slate-100", "dark:border-slate-700"], [1, "w-full", "max-w-lg", "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-2xl", "overflow-hidden"], [1, "px-5", "py-4", "border-b", "border-slate-100", "dark:border-slate-700", "flex", "items-center", "justify-between"], [1, "font-black", "text-lg", "text-slate-850", "dark:text-white"], ["type", "button", 1, "w-8", "h-8", "rounded-lg", "text-slate-400", "hover:bg-slate-100", "dark:hover:bg-slate-700", 3, "click"], [1, "fa-solid", "fa-xmark"], [1, "p-5", "space-y-4"], [1, "text-xs", "font-bold", "text-slate-600", "dark:text-slate-300", "block", "mb-1.5"], ["placeholder", "V\u00ED d\u1EE5: C\u00E1 tra, H\u00E0nh t\u00EDm...", 1, "w-full", "h-10", "px-3", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "bg-white", "dark:bg-slate-900", "text-sm", "font-bold", "text-slate-800", "dark:text-slate-200", "outline-none", "focus:border-fuchsia-400", 3, "ngModelChange", "ngModel"], ["placeholder", "ca_tra", 1, "w-full", "h-10", "px-3", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-900", "text-sm", "font-mono", "text-slate-700", "dark:text-slate-300", "disabled:opacity-70", 3, "ngModelChange", "ngModel", "disabled"], [1, "mt-1", "text-[10px]", "text-slate-400"], ["rows", "3", "placeholder", "M\u1ED7i b\u00ED danh m\u1ED9t d\u00F2ng ho\u1EB7c ph\u00E2n c\u00E1ch b\u1EB1ng d\u1EA5u ch\u1EA5m ph\u1EA9y", 1, "w-full", "px-3", "py-2", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "bg-white", "dark:bg-slate-900", "text-sm", "text-slate-800", "dark:text-slate-200", "outline-none", "focus:border-fuchsia-400", "resize-none", 3, "ngModelChange", "ngModel"], ["rows", "3", 1, "w-full", "px-3", "py-2", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "bg-white", "dark:bg-slate-900", "text-sm", "text-slate-800", "dark:text-slate-200", "outline-none", "focus:border-fuchsia-400", "resize-none", 3, "ngModelChange", "ngModel"], [1, "flex", "items-center", "gap-2", "text-sm", "font-bold", "text-slate-700", "dark:text-slate-300", "cursor-pointer"], ["type", "checkbox", 1, "w-4", "h-4", "accent-fuchsia-600", 3, "ngModelChange", "ngModel"], [1, "px-5", "py-4", "border-t", "border-slate-100", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-900/30", "flex", "justify-end", "gap-2"], ["type", "button", 1, "h-10", "px-4", "rounded-xl", "text-sm", "font-bold", "text-slate-600", "dark:text-slate-300", "hover:bg-slate-200", "dark:hover:bg-slate-700", 3, "click"], ["type", "button", 1, "h-10", "px-5", "rounded-xl", "bg-fuchsia-600", "hover:bg-fuchsia-700", "text-white", "text-sm", "font-bold", "disabled:opacity-50", 3, "click", "disabled"], [1, "fa-solid", "fa-circle-notch", "fa-spin", "mr-1.5"], [1, "w-full", "max-w-4xl", "max-h-[85vh]", "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-2xl", "overflow-hidden", "flex", "flex-col"], [1, "p-5", "border-b", "border-slate-100", "dark:border-slate-700"], [1, "overflow-auto", "flex-1"], [1, "w-full", "text-sm"], [1, "sticky", "top-0", "bg-slate-50", "dark:bg-slate-900", "text-left", "text-xs", "text-slate-500"], [1, "p-3"], [1, "divide-y", "divide-slate-100", "dark:divide-slate-700"], [1, "p-4", "border-t", "border-slate-100", "dark:border-slate-700", "flex", "justify-end", "gap-2"], ["type", "button", 1, "h-10", "px-4", "rounded-xl", "text-sm", "font-bold", "text-slate-600", "dark:text-slate-300", 3, "click"], ["type", "button", 1, "h-10", "px-5", "rounded-xl", "bg-emerald-600", "text-white", "text-sm", "font-bold", "disabled:opacity-50", 3, "click", "disabled"], [1, "p-3", "font-bold", "text-slate-800", "dark:text-slate-200"], [1, "p-3", "font-mono", "text-slate-500"], [1, "p-3", "text-slate-500"]], template: function SampleDescriptionMasterComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "header", 1)(2, "div")(3, "h1", 2)(4, "span", 3);
            i0.ɵɵelement(5, "i", 4);
            i0.ɵɵelementEnd();
            i0.ɵɵtext(6, " Danh M\u1EE5c M\u00F4 T\u1EA3 M\u1EABu ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "p", 5);
            i0.ɵɵtext(8, "Danh m\u1EE5c g\u1EE3i \u00FD \u0111\u01B0\u1EE3c KNV s\u1EED d\u1EE5ng \u0111\u1EC3 g\u1EAFn m\u00F4 t\u1EA3 cho t\u1EEBng m\u00E3 m\u1EABu khi t\u1EA1o m\u1EBB.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(9, "div", 6)(10, "a", 7);
            i0.ɵɵelement(11, "i", 8);
            i0.ɵɵtext(12, "C\u1EA5u h\u00ECnh");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "label", 9);
            i0.ɵɵelement(14, "i", 10);
            i0.ɵɵtext(15, "Nh\u1EADp t\u1EEB Excel ");
            i0.ɵɵelementStart(16, "input", 11);
            i0.ɵɵlistener("change", function SampleDescriptionMasterComponent_Template_input_change_16_listener($event) { return ctx.onFileSelected($event); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(17, "button", 12);
            i0.ɵɵlistener("click", function SampleDescriptionMasterComponent_Template_button_click_17_listener() { return ctx.exportToExcel(); });
            i0.ɵɵelement(18, "i", 13);
            i0.ɵɵtext(19, "Xu\u1EA5t Excel");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "button", 14);
            i0.ɵɵlistener("click", function SampleDescriptionMasterComponent_Template_button_click_20_listener() { return ctx.openAddModal(); });
            i0.ɵɵelement(21, "i", 15);
            i0.ɵɵtext(22, "Th\u00EAm M\u00F4 T\u1EA3");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(23, "section", 16)(24, "div", 17);
            i0.ɵɵelement(25, "i", 18);
            i0.ɵɵelementStart(26, "input", 19);
            i0.ɵɵlistener("ngModelChange", function SampleDescriptionMasterComponent_Template_input_ngModelChange_26_listener($event) { return ctx.searchTerm.set($event); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(27, "select", 20);
            i0.ɵɵlistener("ngModelChange", function SampleDescriptionMasterComponent_Template_select_ngModelChange_27_listener($event) { return ctx.statusFilter.set($event); });
            i0.ɵɵelementStart(28, "option", 21);
            i0.ɵɵtext(29, "\u0110ang s\u1EED d\u1EE5ng");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(30, "option", 22);
            i0.ɵɵtext(31, "Ng\u1EEBng s\u1EED d\u1EE5ng");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(32, "option", 23);
            i0.ɵɵtext(33, "T\u1EA5t c\u1EA3");
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(34, SampleDescriptionMasterComponent_Conditional_34_Template, 2, 0, "div", 24)(35, SampleDescriptionMasterComponent_Conditional_35_Template, 2, 0, "div", 25)(36, SampleDescriptionMasterComponent_Conditional_36_Template, 3, 0, "div", 26);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(37, SampleDescriptionMasterComponent_Conditional_37_Template, 35, 9, "div", 27)(38, SampleDescriptionMasterComponent_Conditional_38_Template, 25, 2, "div", 28);
        } if (rf & 2) {
            i0.ɵɵadvance(26);
            i0.ɵɵproperty("ngModel", ctx.searchTerm());
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngModel", ctx.statusFilter());
            i0.ɵɵadvance(7);
            i0.ɵɵconditional(ctx.loading() ? 34 : ctx.filteredItems().length === 0 ? 35 : 36);
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.showModal() ? 37 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.importPreview().length > 0 ? 38 : -1);
        } }, dependencies: [CommonModule, i1.NgClass, FormsModule, i2.NgSelectOption, i2.ɵNgSelectMultipleOption, i2.DefaultValueAccessor, i2.CheckboxControlValueAccessor, i2.SelectControlValueAccessor, i2.NgControlStatus, i2.NgModel, RouterLink], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SampleDescriptionMasterComponent, [{
        type: Component,
        args: [{ selector: 'app-sample-description-master', standalone: true, imports: [CommonModule, FormsModule, RouterLink], template: "<div class=\"p-4 md:p-6 max-w-7xl mx-auto space-y-5\">\r\n  <header class=\"flex flex-col lg:flex-row lg:items-center justify-between gap-4\">\r\n    <div>\r\n      <h1 class=\"text-2xl font-black text-slate-850 dark:text-white flex items-center gap-3\">\r\n        <span class=\"w-10 h-10 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center\"><i class=\"fa-solid fa-tags\"></i></span>\r\n        Danh M\u1EE5c M\u00F4 T\u1EA3 M\u1EABu\r\n      </h1>\r\n      <p class=\"mt-1 text-sm text-slate-500 dark:text-slate-400\">Danh m\u1EE5c g\u1EE3i \u00FD \u0111\u01B0\u1EE3c KNV s\u1EED d\u1EE5ng \u0111\u1EC3 g\u1EAFn m\u00F4 t\u1EA3 cho t\u1EEBng m\u00E3 m\u1EABu khi t\u1EA1o m\u1EBB.</p>\r\n    </div>\r\n    <div class=\"flex flex-wrap items-center gap-2\">\r\n      <a routerLink=\"/config\" class=\"h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800\"><i class=\"fa-solid fa-arrow-left\"></i>C\u1EA5u h\u00ECnh</a>\r\n      <label class=\"h-10 px-4 rounded-xl border border-emerald-200 dark:border-emerald-800 text-sm font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2 cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20\">\r\n        <i class=\"fa-solid fa-file-import\"></i>Nh\u1EADp t\u1EEB Excel\r\n        <input type=\"file\" accept=\".xlsx,.xls,.csv\" class=\"hidden\" (change)=\"onFileSelected($event)\">\r\n      </label>\r\n      <button type=\"button\" (click)=\"exportToExcel()\" class=\"h-10 px-4 rounded-xl border border-blue-200 dark:border-blue-800 text-sm font-bold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20\"><i class=\"fa-solid fa-file-export mr-1.5\"></i>Xu\u1EA5t Excel</button>\r\n      <button type=\"button\" (click)=\"openAddModal()\" class=\"h-10 px-4 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-sm font-bold shadow-sm\"><i class=\"fa-solid fa-plus mr-1.5\"></i>Th\u00EAm M\u00F4 T\u1EA3</button>\r\n    </div>\r\n  </header>\r\n\r\n  <section class=\"bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 shadow-sm flex flex-col md:flex-row gap-3\">\r\n    <div class=\"relative flex-1\">\r\n      <i class=\"fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs\"></i>\r\n      <input [ngModel]=\"searchTerm()\" (ngModelChange)=\"searchTerm.set($event)\" class=\"w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-fuchsia-400\" placeholder=\"T\u00ECm theo t\u00EAn, m\u00E3 ho\u1EB7c b\u00ED danh...\">\r\n    </div>\r\n    <select [ngModel]=\"statusFilter()\" (ngModelChange)=\"statusFilter.set($event)\" class=\"h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold text-slate-600 dark:text-slate-300\">\r\n      <option value=\"active\">\u0110ang s\u1EED d\u1EE5ng</option>\r\n      <option value=\"inactive\">Ng\u1EEBng s\u1EED d\u1EE5ng</option>\r\n      <option value=\"all\">T\u1EA5t c\u1EA3</option>\r\n    </select>\r\n  </section>\r\n\r\n  @if (loading()) {\r\n    <div class=\"py-20 text-center text-slate-400\"><i class=\"fa-solid fa-circle-notch fa-spin text-2xl\"></i></div>\r\n  } @else if (filteredItems().length === 0) {\r\n    <div class=\"py-16 text-center bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-slate-500\">Ch\u01B0a c\u00F3 m\u00F4 t\u1EA3 m\u1EABu ph\u00F9 h\u1EE3p.</div>\r\n  } @else {\r\n    <div class=\"grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4\">\r\n      @for (item of filteredItems(); track item.id) {\r\n        <article class=\"bg-white dark:bg-slate-800 border rounded-2xl p-5 shadow-sm\" [class.border-slate-200]=\"item.isActive\" [class.dark:border-slate-700]=\"item.isActive\" [class.border-amber-300]=\"!item.isActive\" [class.opacity-70]=\"!item.isActive\">\r\n          <div class=\"flex items-start justify-between gap-3\">\r\n            <div class=\"min-w-0\">\r\n              <div class=\"flex flex-wrap items-center gap-2\">\r\n                <h2 class=\"font-black text-slate-850 dark:text-slate-100 break-words\">{{item.name}}</h2>\r\n                <span class=\"px-2 py-0.5 rounded-full text-[9px] font-black uppercase\" [ngClass]=\"item.isActive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'\">{{item.isActive ? '\u0110ang d\u00F9ng' : '\u0110\u00E3 ng\u1EEBng'}}</span>\r\n              </div>\r\n              <div class=\"mt-1 text-[11px] font-mono text-slate-400\">{{item.id}}</div>\r\n            </div>\r\n            <div class=\"flex items-center gap-1 shrink-0\">\r\n              <button type=\"button\" (click)=\"openEditModal(item)\" class=\"w-8 h-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20\" title=\"Ch\u1EC9nh s\u1EEDa\"><i class=\"fa-solid fa-pen\"></i></button>\r\n              <button type=\"button\" (click)=\"toggleActive(item)\" class=\"w-8 h-8 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20\" [title]=\"item.isActive ? 'Ng\u1EEBng s\u1EED d\u1EE5ng' : 'K\u00EDch ho\u1EA1t l\u1EA1i'\"><i class=\"fa-solid\" [class.fa-pause]=\"item.isActive\" [class.fa-play]=\"!item.isActive\"></i></button>\r\n            </div>\r\n          </div>\r\n          @if (item.aliases?.length) {\r\n            <div class=\"mt-3 flex flex-wrap gap-1.5\">@for (alias of item.aliases; track alias) { <span class=\"px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 text-[10px] font-bold text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700\">{{alias}}</span> }</div>\r\n          }\r\n          @if (item.description) { <p class=\"mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed\">{{item.description}}</p> }\r\n        </article>\r\n      }\r\n    </div>\r\n  }\r\n</div>\r\n\r\n@if (showModal()) {\r\n  <div class=\"fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4\">\r\n    <div class=\"w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden\">\r\n      <header class=\"px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between\">\r\n        <h2 class=\"font-black text-lg text-slate-850 dark:text-white\">{{editingId() ? 'Ch\u1EC9nh s\u1EEDa m\u00F4 t\u1EA3 m\u1EABu' : 'Th\u00EAm m\u00F4 t\u1EA3 m\u1EABu'}}</h2>\r\n        <button type=\"button\" (click)=\"closeModal()\" class=\"w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700\"><i class=\"fa-solid fa-xmark\"></i></button>\r\n      </header>\r\n      <div class=\"p-5 space-y-4\">\r\n        <div><label class=\"text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5\">T\u00EAn m\u00F4 t\u1EA3 m\u1EABu *</label><input [(ngModel)]=\"formData.name\" (ngModelChange)=\"onNameChange()\" class=\"w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold text-slate-800 dark:text-slate-200 outline-none focus:border-fuchsia-400\" placeholder=\"V\u00ED d\u1EE5: C\u00E1 tra, H\u00E0nh t\u00EDm...\"></div>\r\n        <div>\r\n          <label class=\"text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5\">M\u00E3 \u0111\u1ECBnh danh *</label>\r\n          <input [(ngModel)]=\"formData.id\" [disabled]=\"!!editingId()\" class=\"w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono text-slate-700 dark:text-slate-300 disabled:opacity-70\" placeholder=\"ca_tra\">\r\n          <p class=\"mt-1 text-[10px] text-slate-400\">D\u00F9ng quy \u01B0\u1EDBc snake_case gi\u1ED1ng danh m\u1EE5c ch\u1EC9 ti\u00EAu g\u1ED1c, v\u00ED d\u1EE5: ca_tra, hanh_tim.</p>\r\n        </div>\r\n        <div><label class=\"text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5\">B\u00ED danh</label><textarea [(ngModel)]=\"formData.aliasesText\" rows=\"3\" class=\"w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-fuchsia-400 resize-none\" placeholder=\"M\u1ED7i b\u00ED danh m\u1ED9t d\u00F2ng ho\u1EB7c ph\u00E2n c\u00E1ch b\u1EB1ng d\u1EA5u ch\u1EA5m ph\u1EA9y\"></textarea></div>\r\n        <div><label class=\"text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5\">Ghi ch\u00FA qu\u1EA3n tr\u1ECB</label><textarea [(ngModel)]=\"formData.description\" rows=\"3\" class=\"w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-fuchsia-400 resize-none\"></textarea></div>\r\n        <label class=\"flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer\"><input type=\"checkbox\" [(ngModel)]=\"formData.isActive\" class=\"w-4 h-4 accent-fuchsia-600\">\u0110ang s\u1EED d\u1EE5ng</label>\r\n      </div>\r\n      <footer class=\"px-5 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 flex justify-end gap-2\">\r\n        <button type=\"button\" (click)=\"closeModal()\" class=\"h-10 px-4 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700\">H\u1EE7y</button>\r\n        <button type=\"button\" (click)=\"save()\" [disabled]=\"saving()\" class=\"h-10 px-5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-sm font-bold disabled:opacity-50\">@if (saving()) { <i class=\"fa-solid fa-circle-notch fa-spin mr-1.5\"></i> }L\u01B0u</button>\r\n      </footer>\r\n    </div>\r\n  </div>\r\n}\r\n\r\n@if (importPreview().length > 0) {\r\n  <div class=\"fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4\">\r\n    <div class=\"w-full max-w-4xl max-h-[85vh] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col\">\r\n      <header class=\"p-5 border-b border-slate-100 dark:border-slate-700\"><h2 class=\"font-black text-lg text-slate-850 dark:text-white\">X\u00E1c nh\u1EADn nh\u1EADp d\u1EEF li\u1EC7u {{importPreview().length}} m\u00F4 t\u1EA3 m\u1EABu</h2></header>\r\n      <div class=\"overflow-auto flex-1\">\r\n        <table class=\"w-full text-sm\"><thead class=\"sticky top-0 bg-slate-50 dark:bg-slate-900 text-left text-xs text-slate-500\"><tr><th class=\"p-3\">T\u00EAn</th><th class=\"p-3\">M\u00E3</th><th class=\"p-3\">B\u00ED danh</th><th class=\"p-3\">Tr\u1EA1ng th\u00E1i</th></tr></thead><tbody class=\"divide-y divide-slate-100 dark:divide-slate-700\">@for (item of importPreview(); track $index) { <tr><td class=\"p-3 font-bold text-slate-800 dark:text-slate-200\">{{item.name}}</td><td class=\"p-3 font-mono text-slate-500\">{{item.id}}</td><td class=\"p-3 text-slate-500\">{{item.aliases?.join(', ') || '\u2014'}}</td><td class=\"p-3\">{{item.isActive ? '\u0110ang d\u00F9ng' : '\u0110\u00E3 ng\u1EEBng'}}</td></tr> }</tbody></table>\r\n      </div>\r\n      <footer class=\"p-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2\"><button type=\"button\" (click)=\"importPreview.set([])\" class=\"h-10 px-4 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300\">H\u1EE7y</button><button type=\"button\" (click)=\"confirmImport()\" [disabled]=\"saving()\" class=\"h-10 px-5 rounded-xl bg-emerald-600 text-white text-sm font-bold disabled:opacity-50\">X\u00E1c Nh\u1EADn Nh\u1EADp D\u1EEF Li\u1EC7u</button></footer>\r\n    </div>\r\n  </div>\r\n}\r\n" }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(SampleDescriptionMasterComponent, { className: "SampleDescriptionMasterComponent", filePath: "src/app/features/config/sample-description-master.component.ts", lineNumber: 18 }); })();
function splitAliases(value) {
    return Array.from(new Set(value.split(/[;\n,]/).map(item => item.trim()).filter(Boolean)));
}
function normalizeText(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}
//# sourceMappingURL=sample-description-master.component.js.map