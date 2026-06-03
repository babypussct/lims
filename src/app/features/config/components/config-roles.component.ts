import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService, PERMISSIONS } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { generateSlug } from '../../../shared/utils/utils';

@Component({
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
                    Nhóm vai trò & Quyền hạn
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Cấu hình các nhóm vai trò nghiệp vụ động để gán hàng loạt cho nhân viên.</p>
            </div>
            <div class="flex gap-2">
                <button (click)="loadRoles()" class="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition flex items-center gap-2">
                    <i class="fa-solid fa-rotate"></i> Tải lại
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
                            <i class="fa-solid fa-sliders"></i> Cấu hình
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
                                <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 ml-1">Tên Vai Trò</label>
                                <input type="text" formControlName="name" (input)="onNameInput()"
                                       class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition shadow-sm">
                                @if (roleForm.get('name')?.touched && roleForm.get('name')?.errors?.['required']) {
                                    <span class="text-[10px] text-red-500 font-bold ml-1">Vui lòng nhập tên vai trò.</span>
                                }
                            </div>

                            <!-- Role ID -->
                            <div>
                                <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 ml-1">Mã Nhận Dạng (ID)</label>
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
                        <i class="fa-solid fa-floppy-disk"></i> Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    }
  `
})
export class ConfigRolesComponent implements OnInit {
  private fb = inject(FirebaseService);
  private toast = inject(ToastService);
  private formBuilder = inject(FormBuilder);

  rolesList = signal<any[]>([]);
  modalOpen = signal(false);
  editingRole = signal<any | null>(null);
  selectedPermissions = signal<string[]>([]);
  
  roleForm!: FormGroup;

  availablePermissions = [
      { val: PERMISSIONS.INVENTORY_VIEW,  label: 'Xem Kho' },
      { val: PERMISSIONS.INVENTORY_EDIT,  label: 'Sửa Kho' },
      { val: PERMISSIONS.BATCH_RUN,       label: 'Chạy Batch & Pha Chế' },
      { val: PERMISSIONS.STANDARD_VIEW,   label: 'Xem Chuẩn' },
      { val: PERMISSIONS.STANDARD_REQUEST,label: 'Mượn Chuẩn' },
      { val: PERMISSIONS.STANDARD_EDIT,   label: 'Sửa Chuẩn' },
      { val: PERMISSIONS.STANDARD_APPROVE,label: 'Duyệt & Giao Chuẩn' },
      { val: PERMISSIONS.STANDARD_LOG_VIEW,label: 'Xem Báo cáo Chuẩn' },
      { val: PERMISSIONS.STANDARD_LOG_DELETE,label: 'Xoá Báo cáo Chuẩn' },
      { val: PERMISSIONS.RECIPE_VIEW,     label: 'Xem Công thức' },
      { val: PERMISSIONS.RECIPE_EDIT,     label: 'Sửa Công thức' },
      { val: PERMISSIONS.SOP_VIEW,        label: 'Xem SOP' },
      { val: PERMISSIONS.SOP_EDIT,        label: 'Sửa SOP' },
      { val: PERMISSIONS.SOP_APPROVE,     label: 'Duyệt SOP' },
      { val: PERMISSIONS.REPORT_VIEW,     label: 'Xem Báo cáo Tổng hợp' },
      { val: PERMISSIONS.USER_MANAGE,     label: 'Quản trị Admin' }
  ];

  permissionGroups = [
    {
      name: 'Kho & Hóa chất',
      icon: 'fa-box-open',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-100 dark:border-emerald-800/30',
      ring: 'var(--tw-colors-emerald-500, #10b981)',
      perms: [
        { val: PERMISSIONS.INVENTORY_VIEW, label: 'Xem Kho' },
        { val: PERMISSIONS.INVENTORY_EDIT, label: 'Sửa Kho (Thêm/Xoá/Nhập xuất)' },
        { val: PERMISSIONS.BATCH_RUN, label: 'Pha chế & Tiêu hao (Smart Batch)' }
      ]
    },
    {
      name: 'Chuẩn đối chiếu',
      icon: 'fa-vial-circle-check',
      color: 'text-indigo-500',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      border: 'border-indigo-100 dark:border-indigo-800/30',
      ring: 'var(--tw-colors-indigo-500, #6366f1)',
      perms: [
        { val: PERMISSIONS.STANDARD_VIEW, label: 'Xem Chuẩn' },
        { val: PERMISSIONS.STANDARD_REQUEST, label: 'Đăng ký mượn Chuẩn' },
        { val: PERMISSIONS.STANDARD_EDIT, label: 'Sửa thông tin Chuẩn' },
        { val: PERMISSIONS.STANDARD_APPROVE, label: 'Duyệt & Giao nhận Chuẩn' },
        { val: PERMISSIONS.STANDARD_LOG_VIEW, label: 'Xem Báo cáo/Nhật ký Chuẩn' },
        { val: PERMISSIONS.STANDARD_LOG_DELETE, label: 'Xoá Yêu cầu/Nhật ký chuẩn' }
      ]
    },
    {
      name: 'Quy trình SOP & Công thức',
      icon: 'fa-book-open',
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-100 dark:border-amber-800/30',
      ring: 'var(--tw-colors-amber-500, #f59e0b)',
      perms: [
        { val: PERMISSIONS.SOP_VIEW, label: 'Xem SOP' },
        { val: PERMISSIONS.SOP_EDIT, label: 'Biên soạn SOP (Editor)' },
        { val: PERMISSIONS.SOP_APPROVE, label: 'Phê duyệt SOP (Approve)' },
        { val: PERMISSIONS.RECIPE_VIEW, label: 'Xem Công thức (Library)' },
        { val: PERMISSIONS.RECIPE_EDIT, label: 'Sửa Công thức (Recipe)' }
      ]
    },
    {
      name: 'Hệ thống & Báo cáo',
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

  getFriendlyPermissionLabel(val: string): string {
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

  openEditModal(role: any) {
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
      if (this.editingRole()) return; // Don't auto-generate ID when editing
      const name = this.roleForm.get('name')?.value || '';
      const slug = 'role_' + generateSlug(name).replace(/-/g, '_');
      this.roleForm.patchValue({ id: slug });
  }

  hasPermSelected(val: string): boolean {
      return this.selectedPermissions().includes(val);
  }

  togglePermSelected(val: string) {
      this.selectedPermissions.update(current => {
          const idx = current.indexOf(val);
          const next = [...current];
          if (idx > -1) {
              next.splice(idx, 1);
          } else {
              next.push(val);
          }
          return next;
      });
  }

  async saveRole() {
      if (this.roleForm.invalid) return;
      
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
      } catch (e) {
          this.toast.show('Lỗi khi lưu cấu hình vai trò.', 'error');
      }
  }

  async deleteRole(role: any) {
      if (role.isSystemRole) {
          this.toast.show('Không thể xóa vai trò hệ thống mặc định.', 'error');
          return;
      }
      if (confirm(`Bạn có chắc chắn muốn xóa vai trò "${role.name}"? Quyền truy cập của nhân viên thuộc nhóm này sẽ bị ảnh hưởng.`)) {
          try {
              await this.fb.deleteRoleConfig(role.id);
              this.toast.show(`Đã xóa vai trò "${role.name}".`, 'success');
              this.loadRoles();
          } catch (e) {
              this.toast.show('Lỗi khi xóa vai trò.', 'error');
          }
      }
  }
}
