import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService, PERMISSIONS, UserProfile } from '../../../core/services/auth.service';
import { StateService } from '../../../core/services/state.service';
import { ToastService } from '../../../core/services/toast.service';
import { getAvatarUrl } from '../../../shared/utils/utils';

@Component({
  selector: 'app-config-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-6 fade-in">
        <div class="flex justify-between items-center">
            <div>
                <h3 class="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-base">
                    <div class="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center"><i class="fa-solid fa-users"></i></div>
                    Danh sách Người dùng
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Cấp quyền truy cập chi tiết. Manager có mặc định toàn quyền.</p>
            </div>
            <button (click)="loadUsers()" class="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition flex items-center gap-2">
                <i class="fa-solid fa-rotate"></i> Tải lại
            </button>
        </div>

        <div class="bg-slate-50 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-700/50 rounded-xl overflow-hidden">
            <!-- Desktop Header -->
            <div class="hidden md:grid grid-cols-12 gap-4 bg-slate-100/80 dark:bg-slate-900/50 px-6 py-4 text-xs text-slate-500 dark:text-slate-400 uppercase font-bold border-b border-slate-200 dark:border-slate-700">
                <div class="col-span-4">Người dùng</div>
                <div class="col-span-3">Vai trò (Role)</div>
                <div class="col-span-4">Quyền hạn (Permissions)</div>
                <div class="col-span-1 text-center">Lưu</div>
            </div>
            
            <div class="flex flex-col md:divide-y md:divide-slate-200 dark:md:divide-slate-700/50 bg-slate-50/50 md:bg-transparent dark:bg-slate-900/20 md:dark:bg-transparent p-3 md:p-0 gap-3 md:gap-0">
                @for (u of userList(); track u.uid) {
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-4 p-4 md:px-6 md:py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition items-start bg-white md:bg-transparent shadow-sm md:shadow-none rounded-xl md:rounded-none border border-slate-200 dark:border-slate-700 md:border-none">
                        
                        <!-- Col 1: User Info -->
                        <div class="col-span-1 md:col-span-4 flex items-center gap-4">
                            <img [src]="getAvatarUrl(u.displayName, state.avatarStyle(), u.photoURL)" class="w-10 h-10 md:w-8 md:h-8 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 shrink-0" alt="Avatar">
                            <div class="min-w-0 flex-1">
                                <div class="font-bold text-slate-700 dark:text-slate-300 truncate text-sm md:text-base">{{u.displayName}}</div>
                                <div class="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5 truncate">{{u.email}}</div>
                                <div class="text-[10px] text-slate-300 dark:text-slate-600 font-mono mt-1 flex items-center gap-1 cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 w-fit" (click)="copyUid(u.uid)" title="Copy UID">
                                    <i class="fa-regular fa-copy"></i> {{u.uid.substring(0,8)}}...
                                </div>
                            </div>
                        </div>
                        
                        <!-- Col 2: Role -->
                        <div class="col-span-1 md:col-span-3">
                            <label class="md:hidden text-[10px] uppercase font-bold text-slate-400 mb-1.5 block">Vai trò tài khoản</label>
                            <select [ngModel]="u.role" (ngModelChange)="updateRole(u, $event)" 
                                    class="w-full text-xs md:text-sm border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 md:p-2 font-bold outline-none focus:border-indigo-500 dark:focus:border-indigo-500 bg-slate-50 md:bg-white dark:bg-slate-800 dark:text-slate-300 transition"
                                    [class.text-orange-600]="u.role === 'pending'"
                                    [class.dark:text-orange-400]="u.role === 'pending'">
                                <option value="manager">Manager</option>
                                <option value="staff">Staff</option>
                                <option value="viewer">Viewer</option>
                                <option value="pending">Pending (Chờ duyệt)</option>
                            </select>
                        </div>
                        
                        <!-- Col 3: Permissions -->
                        <div class="col-span-1 md:col-span-4">
                            <label class="md:hidden text-[10px] uppercase font-bold text-slate-400 mb-1.5 block">Phân quyền</label>
                            @if(u.role === 'manager') {
                                <div class="p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-lg text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                                    <i class="fa-solid fa-check-double shrink-0"></i> <span>Tài khoản Manager có toàn quyền.</span>
                                </div>
                            } @else if(u.role === 'viewer') {
                                <div class="p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg text-blue-700 dark:text-blue-400 text-xs font-bold flex items-center gap-2">
                                    <i class="fa-solid fa-eye shrink-0"></i> <span>Tài khoản Viewer chỉ xem.</span>
                                </div>
                            } @else if(u.role === 'pending') {
                                <div class="p-3 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-lg text-orange-700 dark:text-orange-400 text-xs font-bold flex items-center gap-2">
                                    <i class="fa-solid fa-hourglass-half shrink-0"></i> <span>Đang chờ cấp quyền.</span>
                                </div>
                            } @else {
                                <button (click)="selectedUserForPerms.set(u)" class="w-full text-left p-3 min-w-0 md:min-w-[200px] bg-slate-50 md:bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm transition rounded-xl flex items-center justify-between group">
                                    <div class="flex items-center gap-2 text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
                                        <i class="fa-solid fa-sliders text-blue-500 shrink-0"></i> <span class="truncate">Cấu hình Quyền ({{u.permissions?.length || 0}})</span>
                                    </div>
                                    <i class="fa-solid fa-chevron-right text-[10px] text-slate-400 group-hover:text-blue-500 transition-colors"></i>
                                </button>
                            }
                        </div>
                        
                        <!-- Col 4: Save -->
                        <div class="col-span-1 md:col-span-1 flex md:justify-center mt-2 md:mt-0">
                            <button (click)="saveUser(u)" class="w-full md:w-10 h-10 md:h-10 rounded-xl md:rounded-lg bg-indigo-50 md:bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white dark:hover:text-white transition flex items-center justify-center border border-indigo-200 md:border-transparent dark:border-indigo-800/30 font-bold gap-2 text-sm shadow-sm md:shadow-none" title="Lưu thay đổi">
                                <i class="fa-solid fa-floppy-disk text-base md:text-sm"></i> <span class="md:hidden">Lưu Thay Đổi</span>
                            </button>
                        </div>
                        
                    </div>
                } @empty {
                    <div class="p-8 text-center text-slate-400 dark:text-slate-500 italic bg-white dark:bg-slate-800">
                        Không tìm thấy người dùng.
                    </div>
                }
            </div>
        </div>
    </div>

    <!-- USER PERMISSIONS MODAL -->
    @if (selectedUserForPerms(); as user) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                <!-- Modal Header -->
                <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div class="flex items-center gap-4">
                        <img [src]="getAvatarUrl(user.displayName, state.avatarStyle(), user.photoURL)" class="w-12 h-12 rounded-full border-2 border-white dark:border-slate-700 shadow-sm">
                        <div>
                            <h3 class="text-lg font-black text-slate-800 dark:text-slate-100">{{user.displayName}}</h3>
                            <p class="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1"><i class="fa-solid fa-shield-halved"></i> Phân quyền Người dùng</p>
                        </div>
                    </div>
                    <button (click)="closePermModal()" class="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                
                <!-- Modal Body -->
                <div class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
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
                                                <input type="checkbox" [checked]="hasPerm(user, perm.val)" (change)="togglePerm(user, perm.val)" class="peer sr-only">
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

                <!-- Modal Footer -->
                <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
                    <button (click)="closePermModal()" class="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition">Đóng</button>
                    <button (click)="saveUser(user); closePermModal()" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2">
                        <i class="fa-solid fa-floppy-disk"></i> Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    }
  `
})
export class ConfigUsersComponent implements OnInit {
  fb = inject(FirebaseService);
  auth = inject(AuthService);
  state = inject(StateService);
  toast = inject(ToastService);
  
  getAvatarUrl = getAvatarUrl;
  
  userList = signal<UserProfile[]>([]);
  selectedUserForPerms = signal<UserProfile | null>(null);

  permissionGroups = [
    {
      name: 'Quản lý Kho & Hóa chất',
      icon: 'fa-box-open',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-100 dark:border-emerald-800/30',
      ring: 'var(--tw-colors-emerald-500, #10b981)',
      perms: [
        { val: PERMISSIONS.INVENTORY_VIEW, label: 'Xem Kho' },
        { val: PERMISSIONS.INVENTORY_EDIT, label: 'Sửa Kho (Nhập/Xuất/Xóa)' },
        { val: PERMISSIONS.BATCH_RUN, label: 'Pha chế & Tiêu hao (Batch)' }
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
        { val: PERMISSIONS.STANDARD_EDIT, label: 'Sửa thông tin Chuẩn' },
        { val: PERMISSIONS.STANDARD_APPROVE, label: 'Duyệt & Giao nhận Chuẩn' },
        { val: PERMISSIONS.STANDARD_LOG_VIEW, label: 'Xem Báo cáo/Nhật ký Chuẩn' },
        { val: PERMISSIONS.STANDARD_LOG_DELETE, label: 'Xoá Yêu cầu/Nhật ký chuẩn' }
      ]
    },
    {
      name: 'Quy trình (SOP) & Công thức',
      icon: 'fa-book-open',
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-100 dark:border-amber-800/30',
      ring: 'var(--tw-colors-amber-500, #f59e0b)',
      perms: [
        { val: PERMISSIONS.SOP_VIEW, label: 'Xem SOP' },
        { val: PERMISSIONS.SOP_EDIT, label: 'Biên soạn SOP' },
        { val: PERMISSIONS.SOP_APPROVE, label: 'Phê duyệt SOP' },
        { val: PERMISSIONS.RECIPE_VIEW, label: 'Xem Công thức' },
        { val: PERMISSIONS.RECIPE_EDIT, label: 'Sửa Công thức' }
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
      this.loadUsers();
  }

  async loadUsers() {
      try { const users = await this.fb.getAllUsers(); this.userList.set(users); } catch (e) { this.userList.set([]); }
  }

  hasPerm(u: UserProfile, p: string) { return u.permissions?.includes(p); }
  
  togglePerm(u: UserProfile, p: string) {
      this.userList.update(currentUsers => 
          currentUsers.map(user => {
              if (user.uid === u.uid) {
                  const perms = user.permissions ? [...user.permissions] : [];
                  const idx = perms.indexOf(p);
                  if (idx > -1) perms.splice(idx, 1);
                  else perms.push(p);
                  
                  const updatedUser = { ...user, permissions: perms };
                  // CRITICAL: Ensure the modal UI gets the new reference immediately!
                  if (this.selectedUserForPerms()?.uid === u.uid) {
                      this.selectedUserForPerms.set(updatedUser);
                  }
                  return updatedUser;
              }
              return user;
          })
      );
  }

  updateRole(u: UserProfile, role: any) { 
      this.userList.update(currentUsers => 
          currentUsers.map(user => {
              if (user.uid === u.uid) {
                  const updatedUser = { ...user, role: role };
                  if (role === 'viewer' || role === 'pending') {
                      updatedUser.permissions = [];
                  }
                  return updatedUser;
              }
              return user;
          })
      );
  }

  async saveUser(u: UserProfile) {
      try { await this.fb.updateUserPermissions(u.uid, u.role, u.permissions || []); this.toast.show(`Đã cập nhật ${u.displayName}`, 'success'); } 
      catch (e) { this.toast.show('Lỗi cập nhật.', 'error'); }
  }

  closePermModal() {
      this.selectedUserForPerms.set(null);
  }

  copyUid(uid: string) { navigator.clipboard.writeText(uid).then(() => this.toast.show('Đã copy UID!')); }
}
