import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FirebaseService } from '../../core/services/firebase.service';
import { AuthService, PERMISSIONS, PERMISSION_NAMES } from '../../core/services/auth.service';
import { StateService } from '../../core/services/state.service';
import { ToastService } from '../../core/services/toast.service';
import { NotificationService } from '../../core/services/notification.service';
import { getAvatarUrl } from '../../shared/utils/utils';

import { ConfigGeneralComponent } from './components/config-general.component';
import { ConfigSafetyComponent } from './components/config-safety.component';
import { ConfigUsersComponent } from './components/config-users.component';
import { ConfigRolesComponent } from './components/config-roles.component';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ConfigGeneralComponent, ConfigSafetyComponent, ConfigUsersComponent, ConfigRolesComponent],
  template: `
    <div class="w-full max-w-7xl mx-auto space-y-6 pb-24 fade-in px-4 md:px-8">
      @if (state.isAdmin()) {
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-4 rounded-2xl shadow-sm border border-white/70 dark:border-slate-700 shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800 shadow-sm shrink-0">
              <i class="fa-solid fa-gears text-base"></i>
            </div>
            <div>
              <h2 class="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight">Cấu Hình Hệ Thống</h2>
              <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Quản trị viên: {{auth.currentUser()?.displayName}}.</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" (click)="enableNotifications()" class="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition active:scale-95">
              <i class="fa-regular fa-bell text-sm"></i> Bật Thông Báo
            </button>
            <div class="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
              Version: <span class="text-blue-600 dark:text-blue-400 font-mono">{{state.systemVersion()}}</span>
            </div>
          </div>
        </div>

        <div class="flex gap-6 border-b border-slate-200 dark:border-slate-700 overflow-x-auto custom-scrollbar whitespace-nowrap">
          <button type="button" (click)="activeTab.set('profile')" class="pb-3 px-2 text-sm font-bold border-b-2 transition flex items-center gap-2 min-w-max shrink-0" [class]="activeTab() === 'profile' ? 'border-indigo-600 dark:border-indigo-400 text-indigo-700 dark:text-indigo-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
            <i class="fa-solid fa-id-badge"></i> Hồ Sơ Cá Nhân
          </button>
          <button type="button" (click)="activeTab.set('general')" class="pb-3 px-2 text-sm font-bold border-b-2 transition flex items-center gap-2 min-w-max shrink-0" [class]="activeTab() === 'general' ? 'border-blue-600 dark:border-blue-400 text-blue-700 dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
            <i class="fa-solid fa-server"></i> Hệ Thống & Dữ Liệu
          </button>
          <button type="button" (click)="activeTab.set('safety')" class="pb-3 px-2 text-sm font-bold border-b-2 transition flex items-center gap-2 min-w-max shrink-0" [class]="activeTab() === 'safety' ? 'border-orange-600 dark:border-orange-400 text-orange-700 dark:text-orange-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
            <i class="fa-solid fa-shield-halved"></i> Định Mức & Tiêu Hao
          </button>
          <button type="button" (click)="activeTab.set('roles')" class="pb-3 px-2 text-sm font-bold border-b-2 transition flex items-center gap-2 min-w-max shrink-0" [class]="activeTab() === 'roles' ? 'border-orange-600 dark:border-orange-400 text-orange-700 dark:text-orange-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
            <i class="fa-solid fa-user-shield"></i> Nhóm Vai Trò
          </button>
          <button type="button" (click)="activeTab.set('users')" class="pb-3 px-2 text-sm font-bold border-b-2 transition flex items-center gap-2 min-w-max shrink-0" [class]="activeTab() === 'users' ? 'border-blue-600 dark:border-blue-400 text-blue-700 dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
            <i class="fa-solid fa-users-gear"></i> Người Dùng & Phân Quyền
          </button>
        </div>

        @if (activeTab() === 'general') {
          @defer { <app-config-general></app-config-general> }
        }
        @if (activeTab() === 'safety') {
          @defer { <app-config-safety></app-config-safety> }
        }
        @if (activeTab() === 'roles') {
          @defer { <app-config-roles></app-config-roles> }
        }
        @if (activeTab() === 'users') {
          @defer { <app-config-users></app-config-users> }
        }
      }

      @if (!state.isAdmin() || activeTab() === 'profile') {
        <ng-container *ngTemplateOutlet="profileCard"></ng-container>
      }
    </div>

    <ng-template #profileCard>
      <div class="max-w-6xl mx-auto pt-4">
        <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-[2rem] shadow-soft-xl dark:shadow-none border border-white/70 dark:border-slate-700/60 overflow-hidden relative mb-6">
          <div class="h-36 bg-[linear-gradient(110deg,#3b82f6,#8b5cf6,#d946ef)] relative overflow-hidden">
            <div class="absolute inset-0 bg-white/10 opacity-30 pattern-dots mix-blend-overlay"></div>
            <div class="absolute -bottom-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
            <div class="absolute -top-24 -left-24 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
          </div>
          <div class="px-6 md:px-8 pb-7">
            <div class="relative -mt-14 mb-2 flex flex-col md:flex-row items-center md:items-end gap-5 text-center md:text-left">
              <div class="w-28 h-28 rounded-[1.4rem] bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-1.5 shadow-xl shrink-0 border border-white/70 dark:border-slate-700/60">
                <img [src]="getAvatarUrl(auth.currentUser()?.displayName, auth.currentUser()?.avatarStyle || state.avatarStyle(), auth.currentUser()?.photoURL)" alt="Profile Avatar" class="w-full h-full rounded-2xl bg-slate-100 dark:bg-slate-700 object-cover">
              </div>
              <div class="flex-1 pb-2">
                <h2 class="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{{auth.currentUser()?.displayName}}</h2>
                <p class="text-slate-500 dark:text-slate-400 font-medium mt-1">{{auth.currentUser()?.email}}</p>
              </div>
              <div class="pb-2">
                <span class="px-4 py-2 rounded-xl bg-indigo-100/80 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 text-xs font-black uppercase tracking-widest border border-white/60 dark:border-slate-700/50 shadow-sm inline-flex items-center gap-2">
                  <i class="fa-solid" [class.fa-chess-king]="auth.currentUser()?.role === 'manager'" [class.fa-user]="auth.currentUser()?.role !== 'manager'"></i>
                  {{auth.currentUser()?.role}}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="space-y-6">
            <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-3xl border border-white/70 dark:border-slate-700/60 shadow-sm">
              <label class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-3 flex items-center gap-2"><i class="fa-solid fa-id-card"></i> Định danh người dùng</label>
              <div class="space-y-3">
                <div>
                  <div class="text-xs text-slate-500 dark:text-slate-400 mb-1">User ID (UID)</div>
                  <div class="flex items-center gap-2">
                    <code class="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 truncate flex-1 bg-slate-100/50 dark:bg-slate-900/50 px-3 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 select-all">{{auth.currentUser()?.uid}}</code>
                    <button type="button" (click)="copyUid(auth.currentUser()?.uid || '')" class="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700" aria-label="Sao chép UID"><i class="fa-regular fa-copy"></i></button>
                  </div>
                </div>
                <div>
                  <div class="text-xs text-slate-500 dark:text-slate-400 mb-1">App Context</div>
                  <div class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 bg-slate-100/50 dark:bg-slate-900/50 px-3 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50"><i class="fa-solid fa-database text-slate-400"></i>{{fb.APP_ID}}</div>
                </div>
              </div>
            </div>

            <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-3xl border border-white/70 dark:border-slate-700/60 shadow-sm">
              <label class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-3 flex items-center gap-2"><i class="fa-solid fa-palette"></i> Cá nhân hóa</label>
              <select [ngModel]="auth.currentUser()?.avatarStyle || ''" (ngModelChange)="saveMyAvatarStyle($event)" class="w-full text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 cursor-pointer">
                <option value="">⚙️ Mặc định hệ thống</option>
                <option value="google">📷 Ảnh Google</option>
                <option value="bottts-neutral">🤖 Robot</option>
                <option value="fun-emoji">😊 Biểu cảm</option>
                <option value="micah">🎨 Hiện đại</option>
                <option value="notionists">✏️ Vẽ tay</option>
                <option value="initials">🔤 Chữ cái</option>
              </select>
              <button type="button" (click)="enableNotifications()" class="w-full mt-4 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 py-3 rounded-xl border border-slate-200 dark:border-slate-700 transition flex items-center justify-center gap-2 shadow-sm"><i class="fa-regular fa-bell text-blue-500"></i> Bật Thông Báo Đẩy (PWA)</button>
            </div>

            <div class="bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-3xl p-5">
              <label class="text-[11px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-2 mb-3"><i class="fa-solid fa-circle-exclamation"></i> Quản lý tài khoản</label>
              <p class="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">Ẩn danh hoá email và avatar khỏi hệ thống. Tên hiển thị và UID vẫn giữ cho mục đích audit.</p>
              @if (!showDeleteConfirm()) {
                <button type="button" (click)="showDeleteConfirm.set(true)" class="w-full text-xs font-bold text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/40 py-2.5 rounded-xl transition flex items-center justify-center gap-2"><i class="fa-solid fa-user-slash"></i> Ẩn danh hoá thông tin</button>
              } @else {
                <div class="bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-800 rounded-xl p-3 space-y-3">
                  <p class="text-xs font-bold text-red-700 dark:text-red-300 text-center">Email và ảnh đại diện sẽ bị ẩn danh hoá.</p>
                  <div class="flex gap-2">
                    <button type="button" (click)="showDeleteConfirm.set(false)" class="flex-1 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 py-2 rounded-lg">Hủy</button>
                    <button type="button" (click)="anonymizeAccount()" [disabled]="isAnonymizing()" class="flex-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 py-2 rounded-lg">{{isAnonymizing() ? 'Đang xử lý...' : 'Xác nhận'}}</button>
                  </div>
                </div>
              }
              <a routerLink="/privacy-policy" class="block mt-3 text-center text-[11px] text-blue-500 dark:text-blue-400 hover:underline"><i class="fa-solid fa-shield-halved mr-1"></i> Xem Chính sách Bảo mật</a>
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-3xl border border-white/70 dark:border-slate-700/60 shadow-sm relative overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <label class="text-[11px] font-bold text-slate-800 dark:text-white uppercase tracking-widest block mb-4 flex items-center gap-2 relative z-10"><span class="w-6 h-6 rounded bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center"><i class="fa-solid fa-shield-halved"></i></span> Auth Security Hub</label>

              <div class="space-y-3 relative z-10">
                <div class="bg-slate-50/80 dark:bg-slate-900/50 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/50">
                  <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm"><i class="fa-brands fa-google text-red-500 text-sm"></i></div><div><div class="text-xs font-bold text-slate-700 dark:text-slate-200">Tài khoản Google</div><div class="text-[10px] text-slate-500 dark:text-slate-400">Đăng nhập một chạm</div></div></div>
                    @if (auth.hasGoogleProvider()) {
                      <div class="text-right"><div class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400"><i class="fa-solid fa-circle-check mr-1"></i>Đã liên kết</div><button type="button" (click)="unlinkProvider('google.com')" [disabled]="!auth.canUnlinkProvider('google.com') || unlinkingProvider() === 'google.com'" class="text-[10px] text-red-500 hover:underline disabled:text-slate-400 disabled:no-underline disabled:cursor-not-allowed">{{unlinkingProvider() === 'google.com' ? 'Đang xử lý...' : (auth.canUnlinkProvider('google.com') ? 'Hủy liên kết' : 'Khóa an toàn')}}</button></div>
                    } @else {
                      <button type="button" (click)="linkGoogle()" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">Liên kết</button>
                    }
                  </div>
                  @if (auth.hasGoogleProvider() && !auth.canUnlinkProvider('google.com')) { <p class="text-[10px] text-slate-400 mt-2 leading-relaxed"><i class="fa-solid fa-lock mr-1"></i>Không thể xóa phương thức cuối cùng.</p> }
                </div>

                <div class="bg-slate-50/80 dark:bg-slate-900/50 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/50">
                  <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm"><i class="fa-solid fa-key text-fuchsia-500 text-sm"></i></div><div><div class="text-xs font-bold text-slate-700 dark:text-slate-200">Gmail / mật khẩu LIMS</div><div class="text-[10px] text-slate-500 dark:text-slate-400">Mật khẩu dự phòng riêng của LIMS</div></div></div>
                    <div class="text-right">
                      @if (auth.needsPasswordSetup()) {
                        <div class="text-[11px] font-bold text-amber-600 dark:text-amber-400"><i class="fa-solid fa-triangle-exclamation mr-1"></i>Cần thiết lập</div>
                        <button type="button" (click)="auth.openPasswordSetup()" class="text-[10px] text-fuchsia-600 dark:text-fuchsia-400 hover:underline">Thiết lập ngay</button>
                      } @else if (auth.hasPasswordProvider()) {
                        <div class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400"><i class="fa-solid fa-circle-check mr-1"></i>Đã bật</div>
                        <div class="flex items-center gap-2 justify-end"><button type="button" (click)="auth.openPasswordSetup()" class="text-[10px] text-fuchsia-600 dark:text-fuchsia-400 hover:underline">Đổi mật khẩu</button><button type="button" (click)="unlinkProvider('password')" [disabled]="!auth.canUnlinkProvider('password') || unlinkingProvider() === 'password'" class="text-[10px] text-red-500 hover:underline disabled:text-slate-400 disabled:no-underline disabled:cursor-not-allowed">{{unlinkingProvider() === 'password' ? 'Đang xử lý...' : (auth.canUnlinkProvider('password') ? 'Xóa mật khẩu' : 'Khóa an toàn')}}</button></div>
                      } @else {
                        <div class="text-[11px] font-bold text-slate-400">Chưa bật</div>
                      }
                    </div>
                  </div>
                  @if (auth.hasPasswordProvider() && !auth.canUnlinkProvider('password')) { <p class="text-[10px] text-slate-400 mt-2 leading-relaxed"><i class="fa-solid fa-lock mr-1"></i>Không thể xóa phương thức cuối cùng.</p> }
                </div>
              </div>

              @if (auth.googleRedirectError()) { <div class="mt-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-300 text-[11px] px-3 py-2 leading-relaxed">{{auth.googleRedirectError()}}</div> }
              <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-3 leading-relaxed">Hai phương thức dùng chung một UID và dữ liệu LIMS. Mật khẩu LIMS không phải mật khẩu Google.</p>
            </div>

            <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-3xl border border-white/70 dark:border-slate-700/60 shadow-sm">
              <label class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-3 flex items-center gap-2"><i class="fa-solid fa-clock-rotate-left"></i> Nhật ký bảo mật</label>
              <div class="flex items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-900/50 rounded-2xl px-3.5 py-3 border border-slate-200/60 dark:border-slate-700/50">
                <span class="text-xs text-slate-500 dark:text-slate-400">Mật khẩu LIMS cập nhật lần cuối</span>
                <span class="text-xs font-bold text-slate-700 dark:text-slate-200 text-right">{{formatAuditDate(auth.currentUser()?.lastPasswordChangedAt)}}</span>
              </div>
            </div>
          </div>

          <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-3xl border border-white/70 dark:border-slate-700/60 shadow-sm">
            <label class="text-[11px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest block mb-4 flex items-center gap-2"><i class="fa-solid fa-shield-halved"></i> Quyền hạn truy cập</label>
            @if (auth.currentUser()?.role === 'manager') {
              <div class="text-sm font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800/30"><i class="fa-solid fa-check-double text-emerald-500"></i> Full System Access</div>
            } @else {
              <div class="space-y-4">
                @for (group of permissionGroups; track group.label) {
                  <div>
                    <div class="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">{{group.label}}</div>
                    <div class="flex flex-wrap gap-2">
                      @for (permission of group.permissions; track permission) {
                        @if (auth.hasPermission(permission)) {
                          <span class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-[10px] font-bold text-emerald-700 dark:text-emerald-400"><i class="fa-solid fa-check"></i>{{permissionLabel(permission)}}</span>
                        }
                      }
                    </div>
                  </div>
                }
                @if (auth.userPermissions().length === 0) { <div class="text-center text-xs text-slate-400 dark:text-slate-500 italic py-4">Chưa được cấp quyền cụ thể.</div> }
              </div>
            }
            <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-5 leading-relaxed">Để yêu cầu nâng cấp quyền hạn, vui lòng gửi UID cho Quản lý hệ thống.</p>
          </div>
        </div>
      </div>
    </ng-template>
  `
})
export class ConfigComponent {
  fb = inject(FirebaseService);
  auth = inject(AuthService);
  state = inject(StateService);
  toast = inject(ToastService);
  notificationService = inject(NotificationService);

  getAvatarUrl = getAvatarUrl;
  activeTab = signal<'profile' | 'general' | 'users' | 'safety' | 'roles'>('general');
  showDeleteConfirm = signal(false);
  isAnonymizing = signal(false);
  unlinkingProvider = signal<'google.com' | 'password' | null>(null);

  availablePermissions = [
    { val: PERMISSIONS.INVENTORY_VIEW, label: 'Xem Kho' },
    { val: PERMISSIONS.INVENTORY_EDIT, label: 'Sửa Kho' },
    { val: PERMISSIONS.BATCH_RUN, label: 'Vận hành mẻ' },
    { val: PERMISSIONS.STANDARD_VIEW, label: 'Xem Chất Chuẩn' },
    { val: PERMISSIONS.STANDARD_EDIT, label: 'Sửa Chất Chuẩn' },
    { val: PERMISSIONS.STANDARD_APPROVE, label: 'Duyệt Chất Chuẩn' },
    { val: PERMISSIONS.STANDARD_LOG_VIEW, label: 'Xem Nhật Ký Chuẩn' },
    { val: PERMISSIONS.STANDARD_LOG_DELETE, label: 'Xóa Nhật Ký Chuẩn' },
    { val: PERMISSIONS.RECIPE_VIEW, label: 'Xem Công Thức' },
    { val: PERMISSIONS.RECIPE_EDIT, label: 'Sửa Công Thức' },
    { val: PERMISSIONS.SOP_VIEW, label: 'Xem SOP' },
    { val: PERMISSIONS.SOP_EDIT, label: 'Sửa SOP' },
    { val: PERMISSIONS.SOP_APPROVE, label: 'Duyệt SOP' },
    { val: PERMISSIONS.REPORT_VIEW, label: 'Xem Báo Cáo' },
    { val: PERMISSIONS.USER_MANAGE, label: 'Quản Lý Hệ Thống' },
    { val: PERMISSIONS.BYPASS_MAINTENANCE, label: 'Vượt Bảo Trì' }
  ];

  permissionGroups = [
    { label: 'Kho & vận hành', permissions: [PERMISSIONS.INVENTORY_VIEW, PERMISSIONS.INVENTORY_EDIT, PERMISSIONS.BATCH_RUN] },
    { label: 'Chất chuẩn', permissions: [PERMISSIONS.STANDARD_VIEW, PERMISSIONS.STANDARD_EDIT, PERMISSIONS.STANDARD_APPROVE, PERMISSIONS.STANDARD_LOG_VIEW, PERMISSIONS.STANDARD_LOG_DELETE] },
    { label: 'Tài liệu & báo cáo', permissions: [PERMISSIONS.RECIPE_VIEW, PERMISSIONS.RECIPE_EDIT, PERMISSIONS.SOP_VIEW, PERMISSIONS.SOP_EDIT, PERMISSIONS.SOP_APPROVE, PERMISSIONS.REPORT_VIEW] },
    { label: 'Quản trị', permissions: [PERMISSIONS.USER_MANAGE, PERMISSIONS.BYPASS_MAINTENANCE] }
  ];

  permissionLabel(permission: string): string {
    return PERMISSION_NAMES[permission] || this.availablePermissions.find(item => item.val === permission)?.label || permission;
  }

  formatAuditDate(value: any): string {
    if (!value) return 'Chưa ghi nhận';
    const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
    return Number.isNaN(date.getTime()) ? 'Chưa ghi nhận' : date.toLocaleString('vi-VN');
  }

  copyUid(uid: string) {
    navigator.clipboard.writeText(uid).then(() => this.toast.show('Đã sao chép UID.', 'success')).catch(() => this.toast.show('Không thể sao chép UID.', 'error'));
  }

  async saveMyAvatarStyle(style: string) {
    await this.state.saveMyAvatarStyle(style);
    this.toast.show('Đã cập nhật Avatar cá nhân!', 'success');
  }

  async linkGoogle() {
    try {
      await this.auth.linkGoogleToCurrentUser();
    } catch (e: any) {
      this.toast.show(this.auth.googleRedirectError() || e?.message || 'Không thể liên kết Google.', 'error');
    }
  }

  async unlinkProvider(providerId: 'google.com' | 'password') {
    if (!this.auth.canUnlinkProvider(providerId)) {
      this.toast.show('Không thể xóa phương thức đăng nhập cuối cùng.', 'error');
      return;
    }

    this.unlinkingProvider.set(providerId);
    try {
      await this.auth.unlinkProvider(providerId);
      this.toast.show(providerId === 'google.com' ? 'Đã hủy liên kết Google.' : 'Đã xóa mật khẩu LIMS.', 'success');
    } catch (e: any) {
      const message = e?.code === 'auth/requires-recent-login'
        ? 'Phiên bảo mật đã cũ. Vui lòng đăng nhập lại rồi thử lại.'
        : e?.message || 'Không thể thay đổi phương thức đăng nhập.';
      this.toast.show(message, 'error');
    } finally {
      this.unlinkingProvider.set(null);
    }
  }

  async anonymizeAccount() {
    if (this.isAnonymizing()) return;
    this.isAnonymizing.set(true);
    try {
      const { getAuth } = await import('firebase/auth');
      const user = getAuth().currentUser;
      if (!user) throw new Error('Chưa đăng nhập');
      const idToken = await user.getIdToken();
      const res = await fetch('/api/account/delete-request', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${idToken}`, 'Content-Type': 'application/json' }
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Lỗi máy chủ');
      }
      this.toast.show('Đã ẩn danh hoá thông tin cá nhân thành công.', 'success');
      this.showDeleteConfirm.set(false);
      setTimeout(() => this.auth.logout(), 1500);
    } catch (e: any) {
      this.toast.show('Lỗi: ' + e.message, 'error');
    } finally {
      this.isAnonymizing.set(false);
    }
  }

  async enableNotifications() {
    try {
      const token = await this.notificationService.registerCurrentDevicePushToken({ force: true });
      this.toast.show(token ? 'Đã bật thông báo đẩy trên thiết bị này!' : 'Bạn đã từ chối quyền hoặc trình duyệt không hỗ trợ.', token ? 'success' : 'error');
    } catch (e: any) {
      this.toast.show('Lỗi: ' + e.message, 'error');
    }
  }
}
