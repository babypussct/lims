import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../core/services/firebase.service';
import { AuthService, PERMISSIONS } from '../../core/services/auth.service';
import { StateService } from '../../core/services/state.service';
import { ToastService } from '../../core/services/toast.service';
import { getAvatarUrl } from '../../shared/utils/utils';

// Import subcomponents
import { ConfigGeneralComponent } from './components/config-general.component';
import { ConfigSafetyComponent } from './components/config-safety.component';
import { ConfigUsersComponent } from './components/config-users.component';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, ConfigGeneralComponent, ConfigSafetyComponent, ConfigUsersComponent],
  template: `
    <div class="w-full max-w-7xl mx-auto space-y-6 pb-24 fade-in px-4 md:px-8">
        
        <!-- Header -->
        @if(state.isAdmin()) {
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
                        <i class="fa-solid fa-gears text-slate-400 dark:text-slate-500"></i> Cấu hình Hệ thống
                    </h2>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium ml-1">Quản trị viên: {{auth.currentUser()?.displayName}}</p>
                </div>
                <div class="text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                    Version: <span class="text-blue-600 dark:text-blue-400 font-mono">{{state.systemVersion()}}</span>
                </div>
            </div>

            <!-- TABS -->
            <div class="flex gap-6 border-b border-slate-200 dark:border-slate-700 overflow-x-auto custom-scrollbar whitespace-nowrap">
                <button (click)="activeTab.set('general')" class="pb-3 px-2 text-sm font-bold border-b-2 transition flex items-center gap-2 min-w-max shrink-0" [class]="activeTab() === 'general' ? 'border-blue-600 dark:border-blue-400 text-blue-700 dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
                    <i class="fa-solid fa-server"></i> Hệ thống & Dữ liệu
                </button>
                <button (click)="activeTab.set('safety')" class="pb-3 px-2 text-sm font-bold border-b-2 transition flex items-center gap-2 min-w-max shrink-0" [class]="activeTab() === 'safety' ? 'border-orange-600 dark:border-orange-400 text-orange-700 dark:text-orange-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
                    <i class="fa-solid fa-shield-halved"></i> Định mức & Tiêu hao
                </button>
                <button (click)="activeTab.set('users')" class="pb-3 px-2 text-sm font-bold border-b-2 transition flex items-center gap-2 min-w-max shrink-0" [class]="activeTab() === 'users' ? 'border-blue-600 dark:border-blue-400 text-blue-700 dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
                    <i class="fa-solid fa-users-gear"></i> Người dùng & Phân quyền
                </button>
            </div>

            @if (activeTab() === 'general') {
                <app-config-general></app-config-general>
            }
            @if (activeTab() === 'safety') {
                <app-config-safety></app-config-safety>
            }
            @if (activeTab() === 'users') {
                <app-config-users></app-config-users>
            }
        } @else {
            <!-- NON-ADMIN VIEW (Profile Card Design) -->
            <div class="max-w-3xl mx-auto pt-8">
                <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-soft-xl dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden relative">
                    <!-- Header Background -->
                    <div class="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-900 relative">
                        <div class="absolute inset-0 bg-white/10 opacity-30 pattern-dots"></div>
                    </div>
                    
                    <div class="px-8 pb-8">
                        <!-- Avatar & Basic Info -->
                        <div class="relative -mt-12 mb-6 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                            <div class="w-28 h-28 rounded-2xl bg-white dark:bg-slate-800 p-1 shadow-lg dark:shadow-none shrink-0">
                                <img [src]="getAvatarUrl(auth.currentUser()?.displayName, state.avatarStyle(), auth.currentUser()?.photoURL)" 
                                     alt="Profile Avatar"
                                     class="w-full h-full rounded-xl bg-slate-100 dark:bg-slate-700 object-cover border border-slate-200 dark:border-slate-600">
                            </div>
                            <div class="flex-1 pb-2">
                                <h2 class="text-3xl font-black text-slate-800 dark:text-slate-100">{{auth.currentUser()?.displayName}}</h2>
                                <p class="text-slate-500 dark:text-slate-400 font-medium">{{auth.currentUser()?.email}}</p>
                            </div>
                            <div class="pb-2">
                                <span class="px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-bold uppercase tracking-wide border border-blue-200 dark:border-blue-800/50">
                                    {{auth.currentUser()?.role}} Account
                                </span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Left: ID & Context -->
                            <div class="space-y-4">
                                <div class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                                    <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">User ID (UID)</label>
                                    <div class="flex items-center gap-2">
                                        <code class="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 truncate flex-1 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 select-all">
                                            {{auth.currentUser()?.uid}}
                                        </code>
                                        <button (click)="copyUid(auth.currentUser()?.uid || '')" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs font-bold px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition">Copy</button>
                                    </div>
                                </div>
                                
                                <div class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                                    <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">App Context</label>
                                    <div class="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <i class="fa-solid fa-database text-slate-400 dark:text-slate-500"></i> {{fb.APP_ID}}
                                    </div>
                                </div>
                            </div>

                            <!-- Right: Permissions -->
                            <div class="bg-indigo-50/50 dark:bg-indigo-900/10 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                                <label class="text-[10px] font-bold text-indigo-400 dark:text-indigo-500 uppercase tracking-wider block mb-3 flex items-center gap-2">
                                    <i class="fa-solid fa-shield-halved"></i> Quyền hạn truy cập
                                </label>
                                @if (auth.currentUser()?.role === 'manager') {
                                    <div class="text-sm font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-2 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm dark:shadow-none border border-indigo-100 dark:border-indigo-800/30">
                                        <i class="fa-solid fa-check-double text-green-500 dark:text-green-400"></i>
                                        Full System Access (Quản trị viên)
                                    </div>
                                } @else {
                                    <div class="grid grid-cols-1 gap-2">
                                        @for(p of availablePermissions; track p.val) {
                                            @if(hasPerm(auth.currentUser()!, p.val)) {
                                                <div class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none">
                                                    <i class="fa-solid fa-check text-green-500 dark:text-green-400"></i> {{p.label}}
                                                </div>
                                            }
                                        }
                                        @if(!auth.currentUser()?.permissions?.length) {
                                            <div class="text-center text-xs text-slate-400 dark:text-slate-500 italic py-2">Chưa được cấp quyền cụ thể.</div>
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="text-center mt-6">
                    <p class="text-xs text-slate-400 dark:text-slate-500">Để yêu cầu nâng cấp quyền hạn, vui lòng gửi UID cho Quản lý hệ thống.</p>
                </div>
            </div>
        }
    </div>
  `
})
export class ConfigComponent {
  fb = inject(FirebaseService);
  auth = inject(AuthService);
  state = inject(StateService);
  toast = inject(ToastService);
  
  getAvatarUrl = getAvatarUrl;
  
  activeTab = signal<'general' | 'users' | 'safety'>('general');

  availablePermissions = [
      { val: PERMISSIONS.INVENTORY_VIEW,  label: 'Xem Kho' },
      { val: PERMISSIONS.INVENTORY_EDIT,  label: 'Sửa Kho (Thêm/Xóa/Sửa)' },
      { val: PERMISSIONS.BATCH_RUN,       label: 'Chạy Batch & Pha Chế' },
      { val: PERMISSIONS.STANDARD_VIEW,   label: 'Xem Chuẩn' },
      { val: PERMISSIONS.STANDARD_EDIT,   label: 'Sửa thông tin Chuẩn' },
      { val: PERMISSIONS.STANDARD_APPROVE,label: 'Duyệt & Giao nhận Chuẩn' },
      { val: PERMISSIONS.STANDARD_LOG_VIEW,label: 'Xem Báo cáo/Nhật ký Chuẩn' },
      { val: PERMISSIONS.STANDARD_LOG_DELETE,label: 'Xoá Yêu cầu/Nhật ký chuẩn' },
      { val: PERMISSIONS.RECIPE_VIEW,     label: 'Xem Công thức' },
      { val: PERMISSIONS.RECIPE_EDIT,     label: 'Sửa Công thức (Library)' },
      { val: PERMISSIONS.SOP_VIEW,        label: 'Xem SOP' },
      { val: PERMISSIONS.SOP_EDIT,        label: 'Sửa SOP (Editor)' },
      { val: PERMISSIONS.SOP_APPROVE,     label: 'Duyệt (Approve)' },
      { val: PERMISSIONS.REPORT_VIEW,     label: 'Xem Báo cáo' },
      { val: PERMISSIONS.USER_MANAGE,     label: 'Quản trị (Admin)' },
  ];

  hasPerm(u: any, p: string) { return u.permissions?.includes(p); }
  copyUid(uid: string) { navigator.clipboard.writeText(uid).then(() => this.toast.show('Đã copy UID!')); }
}
