import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FirebaseService } from '../../../core/services/firebase.service';
import { PERMISSIONS } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { generateSlug } from '../../../shared/utils/utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
const _c0 = (a0, a1) => [a0, a1];
const _c1 = a0 => ({ "--tw-ring-color": a0 });
const _forTrack0 = ($index, $item) => $item.id;
const _forTrack1 = ($index, $item) => $item.name;
const _forTrack2 = ($index, $item) => $item.val;
function ConfigRolesComponent_For_18_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 15);
    i0.ɵɵtext(1, " H\u1EC7 th\u1ED1ng ");
    i0.ɵɵelementEnd();
} }
function ConfigRolesComponent_For_18_For_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 26);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const p_r2 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.getFriendlyPermissionLabel(p_r2), " ");
} }
function ConfigRolesComponent_For_18_ForEmpty_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 27);
    i0.ɵɵtext(1, "Kh\u00F4ng c\u00F3 quy\u1EC1n n\u00E0o \u0111\u01B0\u1EE3c g\u00E1n.");
    i0.ɵɵelementEnd();
} }
function ConfigRolesComponent_For_18_Conditional_24_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 32);
    i0.ɵɵlistener("click", function ConfigRolesComponent_For_18_Conditional_24_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r5); const role_r4 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.deleteRole(role_r4)); });
    i0.ɵɵelement(1, "i", 33);
    i0.ɵɵtext(2, " X\u00F3a ");
    i0.ɵɵelementEnd();
} }
function ConfigRolesComponent_For_18_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 12);
    i0.ɵɵtemplate(1, ConfigRolesComponent_For_18_Conditional_1_Template, 2, 0, "span", 15);
    i0.ɵɵelementStart(2, "div")(3, "div", 16)(4, "div", 17);
    i0.ɵɵelement(5, "i", 18);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 19)(7, "h4", 20);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "code", 21);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(11, "p", 22);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "div", 23)(14, "div", 24);
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "div", 25);
    i0.ɵɵrepeaterCreate(17, ConfigRolesComponent_For_18_For_18_Template, 2, 1, "span", 26, i0.ɵɵrepeaterTrackByIdentity, false, ConfigRolesComponent_For_18_ForEmpty_19_Template, 2, 0, "span", 27);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(20, "div", 28)(21, "button", 29);
    i0.ɵɵlistener("click", function ConfigRolesComponent_For_18_Template_button_click_21_listener() { const role_r4 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.openEditModal(role_r4)); });
    i0.ɵɵelement(22, "i", 30);
    i0.ɵɵtext(23, " C\u1EA5u H\u00ECnh ");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(24, ConfigRolesComponent_For_18_Conditional_24_Template, 3, 0, "button", 31);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const role_r4 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵconditional(role_r4.isSystemRole ? 1 : -1);
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(role_r4.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(role_r4.id);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(role_r4.description || "Ch\u01B0a c\u00F3 m\u00F4 t\u1EA3 cho vai tr\u00F2 n\u00E0y.");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("Quy\u1EC1n h\u1EA1n (", (role_r4.permissions == null ? null : role_r4.permissions.length) || 0, ")");
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(role_r4.permissions);
    i0.ɵɵadvance(7);
    i0.ɵɵconditional(!role_r4.isSystemRole ? 24 : -1);
} }
function ConfigRolesComponent_ForEmpty_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 13);
    i0.ɵɵelement(1, "i", 34);
    i0.ɵɵelementStart(2, "div");
    i0.ɵɵtext(3, "Kh\u00F4ng t\u00ECm th\u1EA5y vai tr\u00F2 n\u00E0o. Click \"Th\u00EAm vai tr\u00F2\" \u0111\u1EC3 b\u1EAFt \u0111\u1EA7u.");
    i0.ɵɵelementEnd()();
} }
function ConfigRolesComponent_Conditional_20_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 47);
    i0.ɵɵtext(1, "Vui l\u00F2ng nh\u1EADp t\u00EAn vai tr\u00F2.");
    i0.ɵɵelementEnd();
} }
function ConfigRolesComponent_Conditional_20_For_36_For_6_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "label", 60)(1, "div", 61)(2, "input", 62);
    i0.ɵɵlistener("change", function ConfigRolesComponent_Conditional_20_For_36_For_6_Template_input_change_2_listener() { const perm_r8 = i0.ɵɵrestoreView(_r7).$implicit; const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.togglePermSelected(perm_r8.val)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelement(3, "div", 63)(4, "div", 64);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span", 65);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const perm_r8 = ctx.$implicit;
    const group_r9 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("checked", ctx_r2.hasPermSelected(perm_r8.val));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngStyle", i0.ɵɵpureFunction1(3, _c1, group_r9.ring));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(perm_r8.label);
} }
function ConfigRolesComponent_Conditional_20_For_36_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 52)(1, "span", 57);
    i0.ɵɵelement(2, "i", 58);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 59);
    i0.ɵɵrepeaterCreate(5, ConfigRolesComponent_Conditional_20_For_36_For_6_Template, 7, 5, "label", 60, _forTrack2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const group_r9 = ctx.$implicit;
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction2(4, _c0, group_r9.bg, group_r9.border));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction2(7, _c0, group_r9.color, group_r9.border));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", group_r9.icon);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", group_r9.name, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(group_r9.perms);
} }
function ConfigRolesComponent_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 14)(1, "div", 35)(2, "div", 36)(3, "div", 16)(4, "div", 37);
    i0.ɵɵelement(5, "i", 4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div")(7, "h3", 38);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "p", 39);
    i0.ɵɵtext(10, " Thi\u1EBFt l\u1EADp t\u00EAn, m\u00E3 nh\u1EADn d\u1EA1ng v\u00E0 t\u1ED5 h\u1EE3p quy\u1EC1n h\u1EA1n c\u1EE7a vai tr\u00F2. ");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(11, "button", 40);
    i0.ɵɵlistener("click", function ConfigRolesComponent_Conditional_20_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.closeModal()); });
    i0.ɵɵelement(12, "i", 41);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "div", 42)(14, "form", 43)(15, "div", 44)(16, "div")(17, "label", 45);
    i0.ɵɵtext(18, "T\u00EAn vai tr\u00F2");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "input", 46);
    i0.ɵɵlistener("input", function ConfigRolesComponent_Conditional_20_Template_input_input_19_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.onNameInput()); });
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(20, ConfigRolesComponent_Conditional_20_Conditional_20_Template, 2, 0, "span", 47);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "div")(22, "label", 45);
    i0.ɵɵtext(23, "M\u00E3 nh\u1EADn d\u1EA1ng (ID)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(24, "input", 48);
    i0.ɵɵelementStart(25, "span", 49);
    i0.ɵɵtext(26, "* T\u1EF1 \u0111\u1ED9ng t\u1EA1o d\u1EA1ng slug \u0111\u1EC3 \u0111\u1EA3m b\u1EA3o t\u00EDnh duy nh\u1EA5t.");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(27, "div")(28, "label", 45);
    i0.ɵɵtext(29, "M\u00F4 t\u1EA3 nhi\u1EC7m v\u1EE5");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(30, "textarea", 50);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(31, "div")(32, "label", 51);
    i0.ɵɵtext(33, "T\u1ED5 h\u1EE3p Quy\u1EC1n h\u1EA1n Chi ti\u1EBFt");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "div", 44);
    i0.ɵɵrepeaterCreate(35, ConfigRolesComponent_Conditional_20_For_36_Template, 7, 10, "div", 52, _forTrack1);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(37, "div", 53)(38, "button", 54);
    i0.ɵɵlistener("click", function ConfigRolesComponent_Conditional_20_Template_button_click_38_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.closeModal()); });
    i0.ɵɵtext(39, "\u0110\u00F3ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "button", 55);
    i0.ɵɵlistener("click", function ConfigRolesComponent_Conditional_20_Template_button_click_40_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.saveRole()); });
    i0.ɵɵelement(41, "i", 56);
    i0.ɵɵtext(42, " L\u01B0u Thay \u0110\u1ED5i ");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    let tmp_3_0;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.editingRole() ? "Ch\u1EC9nh s\u1EEDa" : "Th\u00EAm m\u1EDBi", " Nh\u00F3m Vai Tr\u00F2 ");
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("formGroup", ctx_r2.roleForm);
    i0.ɵɵadvance(6);
    i0.ɵɵconditional(((tmp_3_0 = ctx_r2.roleForm.get("name")) == null ? null : tmp_3_0.touched) && ((tmp_3_0 = ctx_r2.roleForm.get("name")) == null ? null : tmp_3_0.errors == null ? null : tmp_3_0.errors["required"]) ? 20 : -1);
    i0.ɵɵadvance(15);
    i0.ɵɵrepeater(ctx_r2.permissionGroups);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("disabled", ctx_r2.roleForm.invalid);
} }
export class ConfigRolesComponent {
    constructor() {
        this.fb = inject(FirebaseService);
        this.toast = inject(ToastService);
        this.formBuilder = inject(FormBuilder);
        this.rolesList = signal([]);
        this.modalOpen = signal(false);
        this.editingRole = signal(null);
        this.selectedPermissions = signal([]);
        this.availablePermissions = [
            { val: PERMISSIONS.INVENTORY_VIEW, label: 'Xem Kho' },
            { val: PERMISSIONS.INVENTORY_EDIT, label: 'Sửa Kho' },
            { val: PERMISSIONS.BATCH_RUN, label: 'Chạy Batch & Pha Chế' },
            { val: PERMISSIONS.STANDARD_VIEW, label: 'Xem chất chuẩn' },
            { val: PERMISSIONS.STANDARD_REQUEST, label: 'Mượn chất chuẩn' },
            { val: PERMISSIONS.STANDARD_EDIT, label: 'Sửa chất chuẩn' },
            { val: PERMISSIONS.STANDARD_APPROVE, label: 'Duyệt và cấp chất chuẩn' },
            { val: PERMISSIONS.STANDARD_LOG_VIEW, label: 'Xem báo cáo chất chuẩn' },
            { val: PERMISSIONS.STANDARD_LOG_DELETE, label: 'Xóa báo cáo chất chuẩn' },
            { val: PERMISSIONS.RECIPE_VIEW, label: 'Xem công thức' },
            { val: PERMISSIONS.RECIPE_EDIT, label: 'Sửa công thức' },
            { val: PERMISSIONS.SOP_VIEW, label: 'Xem SOP' },
            { val: PERMISSIONS.SOP_EDIT, label: 'Sửa SOP' },
            { val: PERMISSIONS.SOP_APPROVE, label: 'Duyệt SOP' },
            { val: PERMISSIONS.REPORT_VIEW, label: 'Xem Báo cáo Tổng hợp' },
            { val: PERMISSIONS.USER_MANAGE, label: 'Quản trị Admin' }
        ];
        this.permissionGroups = [
            {
                name: 'Kho và hóa chất',
                icon: 'fa-box-open',
                color: 'text-emerald-500',
                bg: 'bg-emerald-50 dark:bg-emerald-900/20',
                border: 'border-emerald-100 dark:border-emerald-800/30',
                ring: 'var(--tw-colors-emerald-500, #10b981)',
                perms: [
                    { val: PERMISSIONS.INVENTORY_VIEW, label: 'Xem Kho' },
                    { val: PERMISSIONS.INVENTORY_EDIT, label: 'Sửa Kho (Thêm/Xoá/Nhập xuất)' },
                    { val: PERMISSIONS.BATCH_RUN, label: 'Pha chế và lập mẻ phân tích' }
                ]
            },
            {
                name: 'Chất chuẩn đối chiếu',
                icon: 'fa-vial-circle-check',
                color: 'text-indigo-500',
                bg: 'bg-indigo-50 dark:bg-indigo-900/20',
                border: 'border-indigo-100 dark:border-indigo-800/30',
                ring: 'var(--tw-colors-indigo-500, #6366f1)',
                perms: [
                    { val: PERMISSIONS.STANDARD_VIEW, label: 'Xem chất chuẩn' },
                    { val: PERMISSIONS.STANDARD_REQUEST, label: 'Đăng ký mượn chất chuẩn' },
                    { val: PERMISSIONS.STANDARD_EDIT, label: 'Sửa thông tin chất chuẩn' },
                    { val: PERMISSIONS.STANDARD_APPROVE, label: 'Duyệt và giao nhận chất chuẩn' },
                    { val: PERMISSIONS.STANDARD_LOG_VIEW, label: 'Xem Báo cáo/Nhật ký sử dụng chất chuẩn' },
                    { val: PERMISSIONS.STANDARD_LOG_DELETE, label: 'Xóa yêu cầu và nhật ký chất chuẩn' }
                ]
            },
            {
                name: 'Quy trình SOP và công thức',
                icon: 'fa-book-open',
                color: 'text-amber-500',
                bg: 'bg-amber-50 dark:bg-amber-900/20',
                border: 'border-amber-100 dark:border-amber-800/30',
                ring: 'var(--tw-colors-amber-500, #f59e0b)',
                perms: [
                    { val: PERMISSIONS.SOP_VIEW, label: 'Xem SOP' },
                    { val: PERMISSIONS.SOP_EDIT, label: 'Biên soạn SOP (Editor)' },
                    { val: PERMISSIONS.SOP_APPROVE, label: 'Phê duyệt SOP (Approve)' },
                    { val: PERMISSIONS.RECIPE_VIEW, label: 'Xem công thức (Library)' },
                    { val: PERMISSIONS.RECIPE_EDIT, label: 'Sửa công thức (Recipe)' }
                ]
            },
            {
                name: 'Hệ thống và báo cáo',
                icon: 'fa-server',
                color: 'text-slate-500',
                bg: 'bg-slate-50 dark:bg-slate-800/50',
                border: 'border-slate-100 dark:border-slate-700/50',
                ring: 'var(--tw-colors-slate-500, #64748b)',
                perms: [
                    { val: PERMISSIONS.REPORT_VIEW, label: 'Xem Báo cáo Tổng hợp' },
                    { val: PERMISSIONS.USER_MANAGE, label: 'Quản trị nhân sự (Admin)' }
                ]
            }
        ];
    }
    ngOnInit() {
        this.initForm();
        this.loadRoles();
    }
    initForm() {
        this.roleForm = this.formBuilder.group({
            id: ['', Validators.required],
            name: ['', Validators.required],
            description: [''],
            isSystemRole: [false]
        });
    }
    async loadRoles() {
        const list = await this.fb.getRolesConfig();
        this.rolesList.set(list);
    }
    getFriendlyPermissionLabel(val) {
        const match = this.availablePermissions.find(p => p.val === val);
        return match ? match.label : val;
    }
    openAddModal() {
        this.editingRole.set(null);
        this.selectedPermissions.set([]);
        this.roleForm.reset({ isSystemRole: false });
        this.roleForm.get('id')?.enable(); // Enable to auto-generate
        this.modalOpen.set(true);
    }
    openEditModal(role) {
        this.editingRole.set(role);
        this.selectedPermissions.set(role.permissions || []);
        this.roleForm.patchValue({
            id: role.id,
            name: role.name,
            description: role.description || '',
            isSystemRole: role.isSystemRole || false
        });
        // ID should not be editable after creation
        this.roleForm.get('id')?.disable();
        this.modalOpen.set(true);
    }
    closeModal() {
        this.modalOpen.set(false);
    }
    onNameInput() {
        if (this.editingRole())
            return; // Don't auto-generate ID when editing
        const name = this.roleForm.get('name')?.value || '';
        const slug = 'role_' + generateSlug(name).replace(/-/g, '_');
        this.roleForm.patchValue({ id: slug });
    }
    hasPermSelected(val) {
        return this.selectedPermissions().includes(val);
    }
    togglePermSelected(val) {
        this.selectedPermissions.update(current => {
            const idx = current.indexOf(val);
            const next = [...current];
            if (idx > -1) {
                next.splice(idx, 1);
            }
            else {
                next.push(val);
            }
            return next;
        });
    }
    async saveRole() {
        if (this.roleForm.invalid)
            return;
        const formValue = this.roleForm.getRawValue(); // Get raw value including disabled ID
        const roleId = formValue.id;
        const roleData = {
            name: formValue.name,
            description: formValue.description || '',
            isSystemRole: formValue.isSystemRole || false,
            permissions: this.selectedPermissions()
        };
        try {
            await this.fb.saveRoleConfig(roleId, roleData);
            this.toast.show(`Đã lưu cấu hình vai trò "${formValue.name}" thành công.`, 'success');
            this.loadRoles();
            this.closeModal();
        }
        catch (e) {
            this.toast.show('Lỗi khi lưu cấu hình vai trò.', 'error');
        }
    }
    async deleteRole(role) {
        if (role.isSystemRole) {
            this.toast.show('Không thể xóa vai trò hệ thống mặc định.', 'error');
            return;
        }
        if (confirm(`Bạn có chắc chắn muốn xóa vai trò "${role.name}"? Quyền truy cập của nhân viên thuộc nhóm này sẽ bị ảnh hưởng.`)) {
            try {
                await this.fb.deleteRoleConfig(role.id);
                this.toast.show(`Đã xóa vai trò "${role.name}".`, 'success');
                this.loadRoles();
            }
            catch (e) {
                this.toast.show('Lỗi khi xóa vai trò.', 'error');
            }
        }
    }
    static { this.ɵfac = function ConfigRolesComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ConfigRolesComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ConfigRolesComponent, selectors: [["app-config-roles"]], decls: 21, vars: 2, consts: [[1, "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-sm", "dark:shadow-none", "border", "border-slate-200", "dark:border-slate-700", "p-6", "flex", "flex-col", "gap-6", "fade-in"], [1, "flex", "justify-between", "items-center", "flex-wrap", "gap-4"], [1, "font-bold", "text-slate-800", "dark:text-slate-100", "flex", "items-center", "gap-2", "text-base"], [1, "w-8", "h-8", "rounded-lg", "bg-orange-50", "dark:bg-orange-900/20", "text-orange-600", "dark:text-orange-400", "flex", "items-center", "justify-center"], [1, "fa-solid", "fa-user-shield"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "mt-1"], [1, "flex", "gap-2"], [1, "px-4", "py-2", "bg-slate-100", "dark:bg-slate-700", "hover:bg-slate-200", "dark:hover:bg-slate-600", "text-slate-700", "dark:text-slate-300", "rounded-lg", "text-xs", "font-bold", "transition", "flex", "items-center", "gap-2", 3, "click"], [1, "fa-solid", "fa-rotate"], [1, "px-4", "py-2", "bg-gradient-to-r", "from-blue-600", "to-indigo-600", "hover:from-blue-700", "hover:to-indigo-700", "text-white", "rounded-lg", "text-xs", "font-bold", "transition", "flex", "items-center", "gap-2", "shadow-sm", "shadow-blue-500/20", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-plus"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-6"], [1, "bg-slate-50/50", "dark:bg-slate-900/10", "border", "border-slate-200", "dark:border-slate-700", "rounded-2xl", "p-5", "flex", "flex-col", "justify-between", "hover:shadow-md", "transition", "duration-200", "group", "relative"], [1, "col-span-full", "py-16", "text-center", "text-slate-400", "dark:text-slate-500", "italic"], [1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "p-4", "sm:p-6", "bg-slate-900/40", "dark:bg-slate-900/60", "backdrop-blur-sm", "animate-fade-in"], [1, "absolute", "top-4", "right-4", "bg-blue-100", "dark:bg-blue-900/30", "text-blue-700", "dark:text-blue-400", "text-[9px]", "font-black", "uppercase", "tracking-wider", "px-2", "py-0.5", "rounded-full", "border", "border-blue-200", "dark:border-blue-800"], [1, "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-xl", "bg-orange-100", "dark:bg-orange-900/20", "text-orange-600", "dark:text-orange-400", "flex", "items-center", "justify-center", "text-sm", "font-bold", "shrink-0"], [1, "fa-solid", "fa-shield-halved"], [1, "min-w-0"], [1, "font-bold", "text-slate-800", "dark:text-slate-100", "text-sm", "truncate"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "font-mono", "block", "truncate"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "mt-3", "line-clamp-2", "min-h-[32px]"], [1, "mt-4"], [1, "text-[10px]", "uppercase", "font-bold", "text-slate-400", "dark:text-slate-500", "tracking-wider", "mb-2"], [1, "flex", "flex-wrap", "gap-1", "max-h-24", "overflow-y-auto", "custom-scrollbar"], [1, "px-2", "py-0.5", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded", "text-[10px]", "text-slate-600", "dark:text-slate-400", "font-medium"], [1, "text-xs", "text-slate-400", "italic"], [1, "flex", "justify-end", "gap-2", "mt-5", "pt-4", "border-t", "border-slate-200/50", "dark:border-slate-700/50"], [1, "px-3", "py-1.5", "bg-slate-100", "dark:bg-slate-700", "hover:bg-slate-200", "dark:hover:bg-slate-600", "text-slate-700", "dark:text-slate-300", "rounded-lg", "text-xs", "font-bold", "transition", "flex", "items-center", "gap-1.5", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-sliders"], [1, "px-3", "py-1.5", "bg-rose-50", "hover:bg-rose-100", "dark:bg-rose-950/20", "dark:hover:bg-rose-900/30", "text-rose-600", "dark:text-rose-400", "rounded-lg", "text-xs", "font-bold", "transition", "flex", "items-center", "gap-1.5", "active:scale-95"], [1, "px-3", "py-1.5", "bg-rose-50", "hover:bg-rose-100", "dark:bg-rose-950/20", "dark:hover:bg-rose-900/30", "text-rose-600", "dark:text-rose-400", "rounded-lg", "text-xs", "font-bold", "transition", "flex", "items-center", "gap-1.5", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-trash-can"], [1, "fa-solid", "fa-folder-open", "text-3xl", "mb-2", "opacity-50"], [1, "bg-white", "dark:bg-slate-800", "rounded-3xl", "shadow-xl", "border", "border-slate-200", "dark:border-slate-700", "w-full", "max-w-3xl", "overflow-hidden", "flex", "flex-col", "max-h-[90vh]"], [1, "px-6", "py-4", "border-b", "border-slate-100", "dark:border-slate-700", "flex", "justify-between", "items-center", "bg-slate-50/50", "dark:bg-slate-900/50"], [1, "w-10", "h-10", "rounded-xl", "bg-orange-100", "dark:bg-orange-900/20", "text-orange-600", "dark:text-orange-400", "flex", "items-center", "justify-center", "text-sm"], [1, "text-base", "font-black", "text-slate-800", "dark:text-slate-100"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "mt-0.5"], [1, "w-8", "h-8", "flex", "items-center", "justify-center", "text-slate-400", "hover:text-red-500", "hover:bg-red-50", "dark:hover:bg-red-900/20", "rounded-full", "transition", 3, "click"], [1, "fa-solid", "fa-xmark"], [1, "p-6", "overflow-y-auto", "custom-scrollbar", "flex-1", "space-y-6"], [1, "space-y-4", 3, "formGroup"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4"], [1, "block", "text-[11px]", "font-bold", "text-slate-500", "dark:text-slate-400", "uppercase", "tracking-wide", "mb-1.5", "ml-1"], ["type", "text", "formControlName", "name", 1, "w-full", "px-4", "py-2.5", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-sm", "font-bold", "text-slate-700", "dark:text-slate-200", "focus:bg-white", "dark:focus:bg-slate-800", "focus:border-blue-500", "dark:focus:border-blue-400", "outline-none", "transition", "shadow-sm", 3, "input"], [1, "text-[10px]", "text-red-500", "font-bold", "ml-1"], ["type", "text", "formControlName", "id", "readonly", "", 1, "w-full", "px-4", "py-2.5", "bg-slate-100", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-sm", "font-mono", "text-slate-600", "dark:text-slate-400", "outline-none", "cursor-not-allowed"], [1, "text-[9px]", "text-slate-400", "dark:text-slate-500", "ml-1", "italic"], ["formControlName", "description", "rows", "2", 1, "w-full", "px-4", "py-2.5", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "text-sm", "font-bold", "text-slate-700", "dark:text-slate-200", "focus:bg-white", "dark:focus:bg-slate-800", "focus:border-blue-500", "dark:focus:border-blue-400", "outline-none", "transition", "shadow-sm", "resize-none"], [1, "block", "text-[11px]", "font-bold", "text-slate-500", "dark:text-slate-400", "uppercase", "tracking-wide", "mb-3", "ml-1"], [1, "rounded-2xl", "border", "p-4", "relative", "pt-5", 3, "ngClass"], [1, "px-6", "py-4", "border-t", "border-slate-100", "dark:border-slate-700", "bg-slate-50/50", "dark:bg-slate-900/50", "flex", "justify-end", "gap-3", "shrink-0"], [1, "px-4", "py-2", "text-xs", "font-bold", "text-slate-600", "dark:text-slate-400", "hover:text-slate-800", "dark:hover:text-slate-200", "transition", 3, "click"], [1, "px-6", "py-2", "bg-blue-600", "hover:bg-blue-700", "text-white", "disabled:opacity-50", "disabled:cursor-not-allowed", "rounded-xl", "text-xs", "font-bold", "shadow-sm", "transition", "flex", "items-center", "gap-2", 3, "click", "disabled"], [1, "fa-solid", "fa-floppy-disk"], [1, "absolute", "-top-3", "left-4", "px-2", "py-0.5", "text-[10px]", "font-black", "uppercase", "flex", "items-center", "gap-1.5", "rounded-lg", "bg-white", "dark:bg-slate-800", "border", "shadow-sm", 3, "ngClass"], [1, "fa-solid", 3, "ngClass"], [1, "flex", "flex-col", "gap-2", "mt-1"], [1, "flex", "items-center", "gap-3", "p-2", "rounded-xl", "hover:bg-white", "dark:hover:bg-slate-800/80", "cursor-pointer", "transition"], [1, "relative", "w-8", "h-4", "shrink-0", "mt-0.5"], ["type", "checkbox", 1, "peer", "sr-only", 3, "change", "checked"], [1, "w-full", "h-full", "bg-slate-300", "dark:bg-slate-600", "rounded-full", "peer", "peer-checked:bg-[var(--tw-ring-color)]", "transition-colors", 3, "ngStyle"], [1, "absolute", "left-0.5", "top-0.5", "bg-white", "w-3", "h-3", "rounded-full", "transition-transform", "peer-checked:translate-x-4", "shadow"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300"]], template: function ConfigRolesComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "h3", 2)(4, "div", 3);
            i0.ɵɵelement(5, "i", 4);
            i0.ɵɵelementEnd();
            i0.ɵɵtext(6, " Nh\u00F3m Vai Tr\u00F2 & Quy\u1EC1n H\u1EA1n ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "p", 5);
            i0.ɵɵtext(8, "C\u1EA5u h\u00ECnh c\u00E1c nh\u00F3m vai tr\u00F2 nghi\u1EC7p v\u1EE5 \u0111\u1ED9ng \u0111\u1EC3 g\u00E1n h\u00E0ng lo\u1EA1t cho nh\u00E2n vi\u00EAn.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(9, "div", 6)(10, "button", 7);
            i0.ɵɵlistener("click", function ConfigRolesComponent_Template_button_click_10_listener() { return ctx.loadRoles(); });
            i0.ɵɵelement(11, "i", 8);
            i0.ɵɵtext(12, " T\u1EA3i L\u1EA1i ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "button", 9);
            i0.ɵɵlistener("click", function ConfigRolesComponent_Template_button_click_13_listener() { return ctx.openAddModal(); });
            i0.ɵɵelement(14, "i", 10);
            i0.ɵɵtext(15, " Th\u00EAm Vai Tr\u00F2 ");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(16, "div", 11);
            i0.ɵɵrepeaterCreate(17, ConfigRolesComponent_For_18_Template, 25, 7, "div", 12, _forTrack0, false, ConfigRolesComponent_ForEmpty_19_Template, 4, 0, "div", 13);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(20, ConfigRolesComponent_Conditional_20_Template, 43, 4, "div", 14);
        } if (rf & 2) {
            i0.ɵɵadvance(17);
            i0.ɵɵrepeater(ctx.rolesList());
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.modalOpen() ? 20 : -1);
        } }, dependencies: [CommonModule, i1.NgClass, i1.NgStyle, FormsModule, i2.ɵNgNoValidate, i2.DefaultValueAccessor, i2.NgControlStatus, i2.NgControlStatusGroup, ReactiveFormsModule, i2.FormGroupDirective, i2.FormControlName], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ConfigRolesComponent, [{
        type: Component,
        args: [{
                selector: 'app-config-roles',
                standalone: true,
                imports: [CommonModule, FormsModule, ReactiveFormsModule],
                template: `
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-6 fade-in">
        <!-- Header -->
        <div class="flex justify-between items-center flex-wrap gap-4">
            <div>
                <h3 class="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-base">
                    <div class="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                        <i class="fa-solid fa-user-shield"></i>
                    </div>
                    Nhóm Vai Trò & Quyền Hạn
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Cấu hình các nhóm vai trò nghiệp vụ động để gán hàng loạt cho nhân viên.</p>
            </div>
            <div class="flex gap-2">
                <button (click)="loadRoles()" class="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition flex items-center gap-2">
                    <i class="fa-solid fa-rotate"></i> Tải Lại
                </button>
                <button (click)="openAddModal()" class="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-sm shadow-blue-500/20 active:scale-95">
                    <i class="fa-solid fa-plus"></i> Thêm Vai Trò
                </button>
            </div>
        </div>

        <!-- Role Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (role of rolesList(); track role.id) {
                <div class="bg-slate-50/50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition duration-200 group relative">
                    <!-- Badges -->
                    @if (role.isSystemRole) {
                        <span class="absolute top-4 right-4 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                            Hệ thống
                        </span>
                    }

                    <div>
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center text-sm font-bold shrink-0">
                                <i class="fa-solid fa-shield-halved"></i>
                            </div>
                            <div class="min-w-0">
                                <h4 class="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">{{role.name}}</h4>
                                <code class="text-[10px] text-slate-400 dark:text-slate-500 font-mono block truncate">{{role.id}}</code>
                            </div>
                        </div>

                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2 min-h-[32px]">{{role.description || 'Chưa có mô tả cho vai trò này.'}}</p>
                        
                        <!-- Mini Permissions display -->
                        <div class="mt-4">
                            <div class="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider mb-2">Quyền hạn ({{role.permissions?.length || 0}})</div>
                            <div class="flex flex-wrap gap-1 max-h-24 overflow-y-auto custom-scrollbar">
                                @for(p of role.permissions; track p) {
                                    <span class="px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                                        {{getFriendlyPermissionLabel(p)}}
                                    </span>
                                } @empty {
                                    <span class="text-xs text-slate-400 italic">Không có quyền nào được gán.</span>
                                }
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end gap-2 mt-5 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                        <button (click)="openEditModal(role)" class="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition flex items-center gap-1.5 active:scale-95">
                            <i class="fa-solid fa-sliders"></i> Cấu Hình
                        </button>
                        @if (!role.isSystemRole) {
                            <button (click)="deleteRole(role)" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-bold transition flex items-center gap-1.5 active:scale-95">
                                <i class="fa-solid fa-trash-can"></i> Xóa
                            </button>
                        }
                    </div>
                </div>
            } @empty {
                <div class="col-span-full py-16 text-center text-slate-400 dark:text-slate-500 italic">
                    <i class="fa-solid fa-folder-open text-3xl mb-2 opacity-50"></i>
                    <div>Không tìm thấy vai trò nào. Click "Thêm vai trò" để bắt đầu.</div>
                </div>
            }
        </div>
    </div>

    <!-- ADD/EDIT ROLE MODAL -->
    @if (modalOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                <!-- Header -->
                <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center text-sm">
                            <i class="fa-solid fa-user-shield"></i>
                        </div>
                        <div>
                            <h3 class="text-base font-black text-slate-800 dark:text-slate-100">
                                {{ editingRole() ? 'Chỉnh sửa' : 'Thêm mới' }} Nhóm Vai Trò
                            </h3>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Thiết lập tên, mã nhận dạng và tổ hợp quyền hạn của vai trò.
                            </p>
                        </div>
                    </div>
                    <button (click)="closeModal()" class="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <!-- Form Body -->
                <div class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                    <form [formGroup]="roleForm" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- Role Name -->
                            <div>
                                <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 ml-1">Tên vai trò</label>
                                <input type="text" formControlName="name" (input)="onNameInput()"
                                       class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition shadow-sm">
                                @if (roleForm.get('name')?.touched && roleForm.get('name')?.errors?.['required']) {
                                    <span class="text-[10px] text-red-500 font-bold ml-1">Vui lòng nhập tên vai trò.</span>
                                }
                            </div>

                            <!-- Role ID -->
                            <div>
                                <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 ml-1">Mã nhận dạng (ID)</label>
                                <input type="text" formControlName="id"
                                       class="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-600 dark:text-slate-400 outline-none cursor-not-allowed"
                                       readonly>
                                <span class="text-[9px] text-slate-400 dark:text-slate-500 ml-1 italic">* Tự động tạo dạng slug để đảm bảo tính duy nhất.</span>
                            </div>
                        </div>

                        <!-- Description -->
                        <div>
                            <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 ml-1">Mô tả nhiệm vụ</label>
                            <textarea formControlName="description" rows="2"
                                      class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition shadow-sm resize-none"></textarea>
                        </div>
                    </form>

                    <!-- Permissions Selection Matrix -->
                    <div>
                        <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3 ml-1">Tổ hợp Quyền hạn Chi tiết</label>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            @for (group of permissionGroups; track group.name) {
                                <div class="rounded-2xl border p-4 relative pt-5" [ngClass]="[group.bg, group.border]">
                                    <span class="absolute -top-3 left-4 px-2 py-0.5 text-[10px] font-black uppercase flex items-center gap-1.5 rounded-lg bg-white dark:bg-slate-800 border shadow-sm" [ngClass]="[group.color, group.border]">
                                        <i class="fa-solid" [ngClass]="group.icon"></i> {{group.name}}
                                    </span>
                                    <div class="flex flex-col gap-2 mt-1">
                                        @for (perm of group.perms; track perm.val) {
                                            <label class="flex items-center gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800/80 cursor-pointer transition">
                                                <div class="relative w-8 h-4 shrink-0 mt-0.5">
                                                    <input type="checkbox" [checked]="hasPermSelected(perm.val)" (change)="togglePermSelected(perm.val)" class="peer sr-only">
                                                    <div class="w-full h-full bg-slate-300 dark:bg-slate-600 rounded-full peer peer-checked:bg-[var(--tw-ring-color)] transition-colors" [ngStyle]="{'--tw-ring-color': group.ring}"></div>
                                                    <div class="absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform peer-checked:translate-x-4 shadow"></div>
                                                </div>
                                                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{perm.label}}</span>
                                            </label>
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3 shrink-0">
                    <button (click)="closeModal()" class="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition">Đóng</button>
                    <button (click)="saveRole()" [disabled]="roleForm.invalid" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2">
                        <i class="fa-solid fa-floppy-disk"></i> Lưu Thay Đổi
                    </button>
                </div>
            </div>
        </div>
    }
  `
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ConfigRolesComponent, { className: "ConfigRolesComponent", filePath: "src/app/features/config/components/config-roles.component.ts", lineNumber: 190 }); })();
//# sourceMappingURL=config-roles.component.js.map