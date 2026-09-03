import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService, PERMISSIONS } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { generateSlug } from '../../../shared/utils/utils';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { FormLabelA11yDirective } from '../../../shared/directives/form-label-a11y.directive';
import { AppButtonComponent } from '../../../shared/components/ui/button/button.component';
import { AppEmptyStateComponent } from '../../../shared/components/ui/empty-state/empty-state.component';
import { AppModalShellComponent } from '../../../shared/components/ui/modal-shell/modal-shell.component';
import { findUsersReferencingRole } from '../../settings/settings-validation.utils';
import { PERMISSION_CATALOG, PERMISSION_EDITOR_GROUPS } from '../../../core/auth/permission-catalog';

@Component({
  selector: 'app-config-roles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormLabelA11yDirective,
    AppButtonComponent,
    AppEmptyStateComponent,
    AppModalShellComponent,
  ],
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
                <app-button variant="secondary" size="sm" (click)="loadRoles()" [loading]="isLoading()" [disabled]="isLoading()">
                    <i class="fa-solid fa-rotate"></i> Tải Lại
                </app-button>
                <app-button size="sm" (click)="openAddModal()">
                    <i class="fa-solid fa-plus"></i> Thêm Vai Trò
                </app-button>
            </div>
        </div>

        @if (loadError()) {
            <div class="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300 flex items-center justify-between gap-3">
                <span><i class="fa-solid fa-circle-exclamation mr-2"></i>{{loadError()}}</span>
                <app-button variant="secondary" size="sm" (click)="loadRoles()">Thử lại</app-button>
            </div>
        }

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
                            <button (click)="deleteRole(role)" [disabled]="deletingRoleId() === role.id" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-bold transition flex items-center gap-1.5 active:scale-95 disabled:opacity-50 disabled:cursor-wait">
                                <i class="fa-solid" [class.fa-spinner]="deletingRoleId() === role.id" [class.fa-spin]="deletingRoleId() === role.id" [class.fa-trash-can]="deletingRoleId() !== role.id"></i> Xóa
                            </button>
                        }
                    </div>
                </div>
            } @empty {
                <app-empty-state
                    class="col-span-full"
                    icon="fa-user-shield"
                    title="Chưa có nhóm vai trò"
                    message="Nhấn “Thêm vai trò” để tạo nhóm quyền đầu tiên." />
            }
        </div>
    </div>

    <!-- ADD/EDIT ROLE MODAL -->
    @if (modalOpen()) {
        <app-modal-shell
            [title]="(editingRole() ? 'Chỉnh sửa' : 'Thêm mới') + ' nhóm vai trò'"
            description="Thiết lập tên, mã nhận dạng và tổ hợp quyền hạn của vai trò."
            size="lg"
            [closeOnBackdrop]="false"
            (closed)="closeModal()"
        >
                <div modalBody class="space-y-6">
                    <form id="role-config-form" appFormLabelA11y [formGroup]="roleForm" class="space-y-4">
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
                        <label class="relative mb-4 block">
                            <span class="sr-only">Tìm quyền</span>
                            <i class="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
                            <input type="search" [ngModel]="permissionQuery()" (ngModelChange)="permissionQuery.set($event)" placeholder="Tìm quyền theo tên hoặc mô tả..." class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:focus:bg-slate-900">
                        </label>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            @for (group of filteredPermissionGroups(); track group.name) {
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

                <div modalFooter class="contents">
                    <app-button variant="secondary" (click)="closeModal()">Đóng</app-button>
                    <app-button (click)="saveRole()" [disabled]="roleForm.invalid || savingRole()" [loading]="savingRole()">
                        <i class="fa-solid fa-floppy-disk"></i> Lưu thay đổi
                    </app-button>
                </div>
        </app-modal-shell>
    }
  `
})
export class ConfigRolesComponent implements OnInit {
    confirmation = inject(ConfirmationService);
  private fb = inject(FirebaseService);
  private toast = inject(ToastService);
  private formBuilder = inject(FormBuilder);

  rolesList = signal<any[]>([]);
  modalOpen = signal(false);
  editingRole = signal<any | null>(null);
  selectedPermissions = signal<string[]>([]);
  permissionQuery = signal('');
  isLoading = signal(false);
  loadError = signal('');
  savingRole = signal(false);
  deletingRoleId = signal('');
  
  roleForm!: FormGroup;

  readonly availablePermissions = PERMISSION_CATALOG.map(permission => ({ val: permission.code, label: permission.label }));
  readonly permissionGroups = PERMISSION_EDITOR_GROUPS;
  readonly filteredPermissionGroups = computed(() => {
      const query = this.permissionQuery().trim().toLocaleLowerCase('vi');
      if (!query) return this.permissionGroups;
      return this.permissionGroups
          .map(group => ({
              ...group,
              perms: group.perms.filter(permission => `${permission.label} ${permission.description}`.toLocaleLowerCase('vi').includes(query)),
          }))
          .filter(group => group.perms.length > 0);
  });

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
      if (this.isLoading()) return;
      this.isLoading.set(true);
      this.loadError.set('');
      try {
          const list = await this.fb.getRolesConfig(true);
          this.rolesList.set(list);
      } catch (e: any) {
          this.loadError.set(`Không thể tải danh sách vai trò: ${e?.message || e}`);
      } finally {
          this.isLoading.set(false);
      }
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
      this.permissionQuery.set('');
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
      const roleId = String(formValue.id || '').trim();
      const roleName = String(formValue.name || '').trim();
      if (!roleId || roleId === 'role_' || !roleName) {
          this.toast.show('Tên vai trò không được để trống.', 'error');
          return;
      }

      const editingId = this.editingRole()?.id || '';
      if (!editingId && this.rolesList().some(role => role.id === roleId)) {
          this.toast.show(`Mã vai trò “${roleId}” đã tồn tại. Vui lòng chọn tên khác.`, 'error');
          return;
      }
      if (this.rolesList().some(role => role.id !== editingId && String(role.name || '').trim().toLocaleLowerCase('vi') === roleName.toLocaleLowerCase('vi'))) {
          this.toast.show(`Tên vai trò “${roleName}” đã tồn tại.`, 'error');
          return;
      }

      const roleData = {
          name: roleName,
          description: String(formValue.description || '').trim(),
          isSystemRole: formValue.isSystemRole || false,
          permissions: this.selectedPermissions()
      };

      this.savingRole.set(true);
      try {
          await this.fb.saveRoleConfig(roleId, roleData);
          this.toast.show(`Đã lưu cấu hình vai trò "${roleName}" thành công.`, 'success');
          await this.loadRoles();
          this.closeModal();
      } catch (e: any) {
          this.toast.show(`Lỗi khi lưu cấu hình vai trò: ${e?.message || e}`, 'error');
      } finally {
          this.savingRole.set(false);
      }
  }

  async deleteRole(role: any) {
      if (role.isSystemRole) {
          this.toast.show('Không thể xóa vai trò hệ thống mặc định.', 'error');
          return;
      }

      this.deletingRoleId.set(role.id);
      let referencedUsers: any[];
      try {
          const users = await this.fb.getAllUsers(true);
          referencedUsers = findUsersReferencingRole(users, role.id);
      } catch (e: any) {
          this.deletingRoleId.set('');
          this.toast.show(`Không thể xác minh người dùng đang sử dụng vai trò này: ${e?.message || e}`, 'error');
          return;
      }

      if (referencedUsers.length > 0) {
          this.deletingRoleId.set('');
          const sample = referencedUsers.slice(0, 3).map(user => user.displayName || user.email || user.uid).join(', ');
          const suffix = referencedUsers.length > 3 ? ', …' : '';
          this.toast.show(`Không thể xóa “${role.name}”: còn ${referencedUsers.length} người dùng đang tham chiếu (${sample}${suffix}). Hãy gán họ sang vai trò khác trước.`, 'error');
          return;
      }

      if (await this.confirmation.confirm({
          message: `Vai trò "${role.name}" hiện không còn người dùng tham chiếu. Bạn có chắc chắn muốn xóa?`,
          confirmText: 'Xóa vai trò',
          isDangerous: true
      })) {
          try {
              await this.fb.deleteRoleConfig(role.id);
              this.toast.show(`Đã xóa vai trò "${role.name}".`, 'success');
              await this.loadRoles();
          } catch (e: any) {
              this.toast.show(`Lỗi khi xóa vai trò: ${e?.message || e}`, 'error');
          }
      }
      this.deletingRoleId.set('');
  }
}
