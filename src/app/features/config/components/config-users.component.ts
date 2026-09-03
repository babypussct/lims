import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AuthService, PERMISSIONS, UserProfile } from '../../../core/services/auth.service';
import { StateService } from '../../../core/services/state.service';
import { ToastService } from '../../../core/services/toast.service';
import { getAvatarUrl } from '../../../shared/utils/utils';
import { AppButtonComponent } from '../../../shared/components/ui/button/button.component';
import { AppEmptyStateComponent } from '../../../shared/components/ui/empty-state/empty-state.component';
import { AppModalShellComponent } from '../../../shared/components/ui/modal-shell/modal-shell.component';
import { PERMISSION_EDITOR_GROUPS } from '../../../core/auth/permission-catalog';

@Component({
  selector: 'app-config-users',
  standalone: true,
  imports: [CommonModule, FormsModule, AppButtonComponent, AppEmptyStateComponent, AppModalShellComponent],
  template: `
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-6 fade-in">
        
        <!-- TOP HEADER & QUICK STATS -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/60 pb-5">
            <div>
                <div class="flex items-center gap-2">
                    <div class="w-9 h-9 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center font-bold text-base shadow-sm">
                        <i class="fa-solid fa-users-gear"></i>
                    </div>
                    <h3 class="font-black text-slate-800 dark:text-slate-100 text-lg tracking-tight">
                        Danh Sách Người Dùng và Phân Quyền
                    </h3>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Quản lý tài khoản, gán nhóm vai trò nghiệp vụ và cấp quyền chi tiết.
                </p>
            </div>

            <!-- STAT BADGES & TOOLBAR ACTION -->
            <div class="flex flex-wrap items-center gap-2">
                <div class="flex items-center bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span class="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 shadow-xs text-slate-700 dark:text-slate-200">
                        Tổng: <strong class="text-fuchsia-600 dark:text-fuchsia-400">{{totalCount()}}</strong>
                    </span>
                    @if (pendingCount() > 0) {
                        <span class="px-2 py-1 text-orange-600 dark:text-orange-400 flex items-center gap-1">
                            <i class="fa-solid fa-clock text-[10px] animate-pulse"></i> Chờ duyệt: <strong>{{pendingCount()}}</strong>
                        </span>
                    }
                </div>

                @if (hasActiveFilters()) {
                    <button (click)="resetFilters()" 
                            class="px-3 py-2 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-rose-200 dark:border-rose-800/40">
                        <i class="fa-solid fa-filter-circle-xmark"></i> Xóa Lọc
                    </button>
                }

                <button (click)="loadUsers()" [disabled]="usersLoading()" class="px-3.5 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait">
                    <i class="fa-solid fa-rotate" [class.fa-spin]="usersLoading()"></i> {{usersLoading() ? 'Đang tải...' : 'Tải Lại'}}
                </button>
            </div>
        </div>

        @if (pendingCount() > 0) {
            <button type="button" (click)="roleFilter.set('pending')" class="flex w-full items-center justify-between gap-4 rounded-2xl border border-orange-200 bg-orange-50/70 p-3.5 text-left transition hover:bg-orange-100/70 dark:border-orange-900/50 dark:bg-orange-950/20 dark:hover:bg-orange-950/30">
                <div class="flex items-center gap-3">
                    <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300"><i class="fa-solid fa-user-clock"></i></span>
                    <div>
                        <div class="text-xs font-black text-orange-800 dark:text-orange-300">{{pendingCount()}} tài khoản đang chờ duyệt</div>
                        <div class="mt-0.5 text-[10px] font-semibold text-orange-700/70 dark:text-orange-300/70">Ưu tiên xử lý để tài khoản mới không bị kẹt ở trạng thái pending.</div>
                    </div>
                </div>
                <span class="shrink-0 text-[10px] font-black uppercase tracking-wider text-orange-700 dark:text-orange-300">Xem ngay <i class="fa-solid fa-arrow-right ml-1"></i></span>
            </button>
        }

        @if (usersLoadError() || rolesLoadError()) {
            <div class="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <span><i class="fa-solid fa-circle-exclamation mr-2"></i>{{usersLoadError() || rolesLoadError()}}</span>
                <div class="flex gap-2">
                    @if (usersLoadError()) {
                        <app-button variant="secondary" size="sm" (click)="loadUsers()">Tải lại người dùng</app-button>
                    }
                    @if (rolesLoadError()) {
                        <app-button variant="secondary" size="sm" (click)="loadRoles()">Tải lại vai trò</app-button>
                    }
                </div>
            </div>
        }

        <!-- SMART FILTER & SEARCH TOOLBAR -->
        <div class="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 flex flex-col gap-4">
            
            <!-- Row 1: Live Search Input + Quick Role Tabs -->
            <div class="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                <!-- Search Box -->
                <div class="relative flex-1">
                    <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                    <input type="text" 
                           [ngModel]="searchQuery()" 
                           (ngModelChange)="searchQuery.set($event)"
                           placeholder="Tìm tên, email hoặc UID..." 
                           class="w-full pl-9 pr-9 py-2.5 text-xs md:text-sm font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition shadow-xs">
                    @if (searchQuery()) {
                        <button (click)="searchQuery.set('')" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    }
                </div>

                <!-- Role Filter Tabs / Chips -->
                <div class="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 lg:pb-0 shrink-0">
                    <button (click)="roleFilter.set('all')" 
                            class="px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                            [class]="roleFilter() === 'all' ? 'bg-fuchsia-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'">
                        Tất cả ({{totalCount()}})
                    </button>

                    <button (click)="roleFilter.set('pending')" 
                            class="px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 relative"
                            [class]="roleFilter() === 'pending' ? 'bg-orange-500 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/40 hover:bg-orange-50 dark:hover:bg-orange-950/20'">
                        <i class="fa-solid fa-hourglass-half text-[10px]"></i> Chờ Duyệt
                        <span class="px-1.5 py-0.2 rounded-full text-[10px]" [class]="roleFilter() === 'pending' ? 'bg-white/30 text-white' : 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300'">
                            {{pendingCount()}}
                        </span>
                    </button>

                    <button (click)="roleFilter.set('staff')" 
                            class="px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                            [class]="roleFilter() === 'staff' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'">
                        <i class="fa-solid fa-user-gear text-[10px]"></i> Staff ({{staffCount()}})
                    </button>

                    <button (click)="roleFilter.set('manager')" 
                            class="px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                            [class]="roleFilter() === 'manager' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'">
                        <i class="fa-solid fa-user-shield text-[10px]"></i> Manager ({{managerCount()}})
                    </button>

                    <button (click)="roleFilter.set('viewer')" 
                            class="px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                            [class]="roleFilter() === 'viewer' ? 'bg-slate-700 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'">
                        <i class="fa-solid fa-eye text-[10px]"></i> Viewer ({{viewerCount()}})
                    </button>
                </div>
            </div>

            <!-- Row 2: Advanced Dropdown Filters (Role Group & Custom Perm Status) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/40">
                <!-- Specific Role Group Dropdown -->
                <div class="flex items-center gap-2">
                    <label class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0">Nhóm vai trò:</label>
                    <select [ngModel]="roleIdFilter()" (ngModelChange)="roleIdFilter.set($event)"
                            class="w-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-fuchsia-500 cursor-pointer">
                        <option value="all">⚡ Tất cả nhóm vai trò</option>
                        @for (r of rolesList(); track r.id) {
                            <option [value]="r.id">{{r.name}}</option>
                        }
                    </select>
                </div>

                <!-- Permission Status Dropdown -->
                <div class="flex items-center gap-2">
                    <label class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0">Quyền hạn:</label>
                    <select [ngModel]="permStatusFilter()" (ngModelChange)="permStatusFilter.set($event)"
                            class="w-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-fuchsia-500 cursor-pointer">
                        <option value="all">🌐 Tất cả trạng thái quyền</option>
                        <option value="has_custom">⚡ Có quyền riêng / tùy chỉnh (Custom)</option>
                        <option value="inherited_only">📋 Chỉ quyền theo Nhóm vai trò</option>
                    </select>
                </div>

                <!-- Visible Results Counter -->
                <div class="flex items-center justify-between sm:justify-end gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span>Đang hiển thị: <strong class="text-fuchsia-600 dark:text-fuchsia-400">{{filteredUsers().length}}</strong> / {{totalCount()}} người dùng</span>
                </div>
            </div>
        </div>

        <!-- STICKY BATCH ACTIONS TOOLBAR (Appears when >= 1 user selected) -->
        @if (selectedCount() > 0) {
            <div class="bg-gradient-to-r from-fuchsia-900 to-slate-900 text-white p-4 rounded-2xl shadow-xl border border-fuchsia-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-in sticky top-4 z-30">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-fuchsia-500/20 text-fuchsia-300 flex items-center justify-center font-bold">
                        <i class="fa-solid fa-check-double"></i>
                    </div>
                    <div>
                        <div class="font-black text-sm text-white">Đã chọn {{selectedCount()}} người dùng</div>
                        <p class="text-[11px] text-fuchsia-200">Áp dụng tác vụ phân quyền hàng loạt cho các tài khoản được chọn</p>
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
                    <!-- Quick Approve Pending Batch -->
                    @if (selectedPendingCount() > 0) {
                        <button (click)="batchApprovePending()" 
                                class="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 active:scale-95">
                            <i class="fa-solid fa-user-check"></i> Duyệt {{selectedPendingCount()}} Chờ duyệt (Staff)
                        </button>
                    }

                    <!-- Batch Set Role & Group Dropdowns -->
                    <div class="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
                        <select [ngModel]="batchRole()" (ngModelChange)="batchRole.set($event)" 
                                class="bg-slate-900 text-xs font-bold text-slate-200 border-none rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer">
                            <option value="staff">Staff</option>
                            <option value="manager" [disabled]="auth.currentUser()?.role !== 'manager'">Manager</option>
                            <option value="viewer">Viewer</option>
                            <option value="pending">Pending</option>
                        </select>

                        @if (batchRole() === 'staff') {
                            <select [ngModel]="batchRoleId()" (ngModelChange)="batchRoleId.set($event)" 
                                    class="bg-slate-900 text-xs font-bold text-amber-300 border-none rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer max-w-[140px] truncate">
                                @for (r of rolesList(); track r.id) {
                                    <option [value]="r.id">{{r.name}}</option>
                                }
                            </select>
                        }

                        <button (click)="applyBatchRole()" class="px-3 py-1.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg text-xs font-bold transition">
                            Áp Dụng
                        </button>
                    </div>

                    <!-- Batch Save Button -->
                    <button (click)="saveBatchUsers()" [disabled]="batchSaving()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 active:scale-95 disabled:opacity-50 disabled:cursor-wait">
                        <i class="fa-solid" [class.fa-spinner]="batchSaving()" [class.fa-spin]="batchSaving()" [class.fa-floppy-disk]="!batchSaving()"></i> {{batchSaving() ? 'Đang lưu...' : 'Lưu Tất Cả Đã Chọn'}}
                    </button>

                    <!-- Clear Selection -->
                    <button (click)="clearSelection()" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition">
                        Bỏ Chọn
                    </button>
                </div>
            </div>
        }

        <!-- USER LIST CONTAINER -->
        <div class="bg-slate-50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-700/60 rounded-2xl overflow-hidden shadow-xs">
            
            <!-- Desktop Table Header -->
            <div class="hidden md:grid grid-cols-12 gap-4 bg-slate-100/90 dark:bg-slate-900/70 px-6 py-3.5 text-xs text-slate-500 dark:text-slate-400 uppercase font-bold border-b border-slate-200 dark:border-slate-700 items-center">
                <div class="col-span-4 flex items-center gap-3">
                    <input type="checkbox" 
                           [checked]="isAllSelected()" 
                           (change)="toggleSelectAll()" 
                           class="w-4 h-4 rounded text-fuchsia-600 focus:ring-fuchsia-500 cursor-pointer accent-fuchsia-600">
                    <span>Người dùng</span>
                </div>
                <div class="col-span-3">Vai trò (Role) & Nhóm</div>
                <div class="col-span-4">Quyền hạn (Permissions)</div>
                <div class="col-span-1 text-center">Lưu</div>
            </div>
            
            <!-- List Items -->
            <div class="flex flex-col md:divide-y md:divide-slate-200 dark:md:divide-slate-700/50 bg-slate-50/50 md:bg-transparent dark:bg-slate-900/20 md:dark:bg-transparent p-3 md:p-0 gap-3 md:gap-0">
                @for (u of filteredUsers(); track u.uid) {
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-4 p-4 md:px-6 md:py-4 hover:bg-slate-100/50 dark:hover:bg-slate-700/30 transition items-start bg-white md:bg-transparent shadow-sm md:shadow-none rounded-xl md:rounded-none border border-slate-200 dark:border-slate-700 md:border-none"
                         [ngClass]="{ 'bg-fuchsia-50/40 dark:bg-fuchsia-950/30': selectedUids().has(u.uid) }">
                        
                        <!-- Col 1: Checkbox & User Info -->
                        <div class="col-span-1 md:col-span-4 flex items-center gap-3.5">
                            <input type="checkbox" 
                                   [checked]="selectedUids().has(u.uid)" 
                                   [disabled]="isSuperAdmin(u)"
                                   [title]="isSuperAdmin(u) ? 'Tài khoản quản trị gốc được bảo vệ và không tham gia thao tác hàng loạt.' : 'Chọn người dùng'"
                                   (change)="toggleSelectUser(u.uid)" 
                                   class="w-4 h-4 rounded text-fuchsia-600 focus:ring-fuchsia-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 accent-fuchsia-600 shrink-0">
                            
                            <img [src]="getAvatarUrl(u.displayName, state.avatarStyle(), u.photoURL)" class="w-10 h-10 md:w-9 md:h-9 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 shrink-0 object-cover" alt="Avatar">
                            
                            <div class="min-w-0 flex-1">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span class="font-bold text-slate-800 dark:text-slate-200 truncate text-sm md:text-base">{{u.displayName}}</span>
                                    
                                    <!-- Status Badges -->
                                    @if (isSuperAdmin(u)) {
                                        <span class="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[10px] font-black rounded-md border border-amber-300 dark:border-amber-700/60 shrink-0 flex items-center gap-1">
                                            <i class="fa-solid fa-lock" aria-hidden="true"></i> Quản trị được bảo vệ
                                        </span>
                                    }
                                    @if (u.role === 'pending') {
                                        <span class="px-2 py-0.5 bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 text-[10px] font-extrabold rounded-md border border-orange-200 dark:border-orange-800/40 shrink-0">
                                            Chờ duyệt
                                        </span>
                                    }
                                    @if (u.customPermissions && u.customPermissions.length > 0) {
                                        <span class="px-2 py-0.5 bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-[10px] font-extrabold rounded-md border border-purple-200 dark:border-purple-800/40 shrink-0" 
                                              title="Có {{u.customPermissions.length}} quyền tùy chỉnh riêng">
                                            ⚡ +{{u.customPermissions.length}} quyền riêng
                                        </span>
                                    }
                                </div>

                                <div class="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5 truncate">{{u.email}}</div>
                                <button type="button" class="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 flex items-center gap-1 cursor-pointer hover:text-fuchsia-600 dark:hover:text-fuchsia-400 w-fit" (click)="copyUid(u.uid)" title="Nhấn để sao chép UID" aria-label="Sao chép UID">
                                    <i class="fa-regular fa-copy"></i> {{u.uid.substring(0,8)}}...
                                </button>
                            </div>
                        </div>
                        
                        <!-- Col 2: Role & Role Group -->
                        <div class="col-span-1 md:col-span-3 flex flex-col gap-2">
                            <label class="md:hidden text-[10px] uppercase font-bold text-slate-400 mb-1 block">Vai trò tài khoản</label>
                            
                            <div class="flex items-center gap-2">
                                <select [ngModel]="u.role" (ngModelChange)="updateRole(u, $event)" 
                                        [disabled]="isSuperAdmin(u)"
                                        [title]="isSuperAdmin(u) ? 'Vai trò của tài khoản quản trị gốc chỉ có thể thay đổi qua trusted admin path.' : 'Vai trò tài khoản'"
                                        class="w-full text-xs md:text-sm border border-slate-300 dark:border-slate-600 rounded-xl p-2 md:p-2 font-bold outline-none focus:border-fuchsia-500 bg-slate-50 md:bg-white dark:bg-slate-800 dark:text-slate-200 transition"
                                        [class.text-orange-600]="u.role === 'pending'"
                                        [class.dark:text-orange-400]="u.role === 'pending'">
                                    <option value="manager" [disabled]="auth.currentUser()?.role !== 'manager'">Manager (Toàn quyền)</option>
                                    <option value="staff">Staff (Nhân viên)</option>
                                    <option value="viewer">Viewer (Chỉ xem)</option>
                                    <option value="pending">Pending (Chờ duyệt)</option>
                                </select>

                                <!-- 1-Click Quick Approve for Pending Rows -->
                                @if (u.role === 'pending') {
                                    <button (click)="quickApprovePending(u)" 
                                            class="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition shrink-0 flex items-center gap-1.5 active:scale-95"
                                            title="Duyệt nhanh tài khoản này thành Staff">
                                        <i class="fa-solid fa-user-check"></i> Duyệt Nhanh
                                    </button>
                                }
                            </div>
                            
                            @if (u.role === 'staff') {
                                <div class="flex flex-col gap-1">
                                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nhóm vai trò nghiệp vụ:</label>
                                    <select [ngModel]="u.roleId || 'role_staff_default'" (ngModelChange)="updateUserRoleId(u, $event)"
                                            class="w-full text-xs md:text-sm border border-orange-300 dark:border-orange-800/80 rounded-xl p-2 font-bold outline-none focus:border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 text-orange-800 dark:text-orange-300 transition cursor-pointer">
                                        @for (r of rolesList(); track r.id) {
                                            <option [value]="r.id">{{r.name}}</option>
                                        }
                                    </select>
                                </div>
                            }
                        </div>
                        
                        <!-- Col 3: Permissions Column -->
                        <div class="col-span-1 md:col-span-4">
                            <label class="md:hidden text-[10px] uppercase font-bold text-slate-400 mb-1.5 block">Phân quyền</label>
                            @if (u.role === 'manager') {
                                <div class="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 rounded-xl text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                                    <i class="fa-solid fa-shield-halved shrink-0 text-emerald-500"></i> <span>Tài khoản Manager có toàn quyền hệ thống.</span>
                                </div>
                            } @else if (u.role === 'viewer') {
                                <div class="p-2.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 rounded-xl text-blue-700 dark:text-blue-400 text-xs font-bold flex items-center gap-2">
                                    <i class="fa-solid fa-eye shrink-0 text-blue-500"></i> <span>Tài khoản Viewer chỉ có quyền xem.</span>
                                </div>
                            } @else if (u.role === 'pending') {
                                <div class="p-2.5 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40 rounded-xl text-orange-700 dark:text-orange-400 text-xs font-bold flex items-center gap-2">
                                    <i class="fa-solid fa-hourglass-half shrink-0 text-orange-500"></i> <span>Đang chờ Quản trị viên duyệt & cấp quyền.</span>
                                </div>
                            } @else {
                                <button (click)="selectedUserForPerms.set(u)" class="w-full text-left p-2.5 min-w-0 md:min-w-[200px] bg-slate-50 md:bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-fuchsia-400 dark:hover:border-fuchsia-500 hover:shadow-xs transition rounded-xl flex items-center justify-between group">
                                    <div class="flex items-center gap-2 text-xs md:text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                                        <i class="fa-solid fa-sliders text-fuchsia-500 shrink-0"></i>
                                        <span class="truncate">Cấu hình quyền ({{getUserPermissionsCount(u)}})</span>
                                    </div>
                                    <i class="fa-solid fa-chevron-right text-[10px] text-slate-400 group-hover:text-fuchsia-500 transition-colors"></i>
                                </button>
                            }
                        </div>
                        
                        <!-- Col 4: Save Single User -->
                        <div class="col-span-1 md:col-span-1 flex md:justify-center mt-2 md:mt-0">
                            <button (click)="saveUser(u)"
                                    [disabled]="isSuperAdmin(u)"
                                    class="w-full md:w-10 h-10 md:h-10 rounded-xl bg-fuchsia-50 md:bg-fuchsia-50/60 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-400 hover:bg-fuchsia-600 dark:hover:bg-fuchsia-500 hover:text-white dark:hover:text-white transition flex items-center justify-center border border-fuchsia-200 md:border-transparent dark:border-fuchsia-800/40 font-bold gap-2 text-sm shadow-xs disabled:cursor-not-allowed disabled:opacity-40"
                                    [title]="isSuperAdmin(u) ? 'Tài khoản quản trị gốc được bảo vệ ở trusted layer.' : 'Lưu thay đổi cho người dùng này'">
                                <i class="fa-solid fa-floppy-disk text-base md:text-sm"></i> <span class="md:hidden">Lưu Thay Đổi</span>
                            </button>
                        </div>
                        
                    </div>
                } @empty {
                    <app-empty-state
                        icon="fa-users-slash"
                        [title]="usersLoadError() ? 'Không thể tải người dùng' : (hasActiveFilters() ? 'Không tìm thấy người dùng' : 'Chưa có người dùng')"
                        [message]="usersLoadError() ? 'Dữ liệu người dùng chưa tải được. Hãy thử lại để phân biệt lỗi kết nối với danh sách trống.' : (hasActiveFilters() ? 'Thử thay đổi từ khóa hoặc bộ lọc để xem thêm tài khoản.' : 'Chưa có tài khoản nào trong hệ thống.')">
                        @if (usersLoadError()) {
                            <app-button emptyStateActions variant="secondary" size="sm" (click)="loadUsers()">
                                <i class="fa-solid fa-rotate" aria-hidden="true"></i>
                                Thử tải lại
                            </app-button>
                        } @else if (hasActiveFilters()) {
                            <app-button emptyStateActions variant="secondary" size="sm" (click)="resetFilters()">
                                <i class="fa-solid fa-rotate-left" aria-hidden="true"></i>
                                Đặt lại bộ lọc
                            </app-button>
                        }
                    </app-empty-state>
                }
            </div>
        </div>
    </div>

    <!-- USER PERMISSIONS MODAL -->
    @if (selectedUserForPerms(); as user) {
        <app-modal-shell
            [title]="user.displayName"
            description="Phân quyền người dùng"
            size="lg"
            [closeOnBackdrop]="false"
            (closed)="closePermModal()"
        >
                <div modalBody class="space-y-6">
                    <label class="relative block">
                        <span class="sr-only">Tìm quyền</span>
                        <i class="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
                        <input type="search" [ngModel]="permissionQuery()" (ngModelChange)="permissionQuery.set($event)" placeholder="Tìm quyền theo tên hoặc mô tả..." class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs font-bold text-slate-700 outline-none focus:border-fuchsia-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:focus:bg-slate-900">
                    </label>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        @for (group of filteredPermissionGroups(); track group.name) {
                            <div class="rounded-2xl border p-4 relative pt-5" [ngClass]="[group.bg, group.border]">
                                <span class="absolute -top-3 left-4 px-2 py-0.5 text-[10px] font-black uppercase flex items-center gap-1.5 rounded-lg bg-white dark:bg-slate-800 border shadow-sm" [ngClass]="[group.color, group.border]">
                                    <i class="fa-solid" [ngClass]="group.icon"></i> {{group.name}}
                                </span>
                                <div class="flex flex-col gap-2 mt-1">
                                    @for (perm of group.perms; track perm.val) {
                                        <label class="flex items-center justify-between p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800/80 transition"
                                               [class.cursor-not-allowed]="isPermInherited(user, perm.val)"
                                               [class.cursor-pointer]="!isPermInherited(user, perm.val)">
                                            <div class="flex items-center gap-3">
                                                <div class="relative w-8 h-4 shrink-0 mt-0.5">
                                                    <input type="checkbox" 
                                                           [checked]="isPermChecked(user, perm.val)" 
                                                           [disabled]="isPermInherited(user, perm.val)"
                                                           (change)="togglePerm(user, perm.val)" 
                                                           class="peer sr-only">
                                                    <div class="w-full h-full bg-slate-300 dark:bg-slate-600 rounded-full peer peer-checked:bg-[var(--tw-ring-color)] transition-colors" [ngStyle]="{'--tw-ring-color': group.ring}"></div>
                                                    <div class="absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform peer-checked:translate-x-4 shadow"></div>
                                                </div>
                                                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{perm.label}}</span>
                                            </div>
                                            @if (isPermInherited(user, perm.val)) {
                                                <span class="text-[9px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600/50">Kế thừa</span>
                                            } @else if (isPermChecked(user, perm.val)) {
                                                <span class="text-[9px] bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 font-bold px-1.5 py-0.5 rounded border border-purple-200 dark:border-purple-800/50">Cấp riêng</span>
                                            }
                                        </label>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>

                <div modalFooter class="contents">
                    <app-button variant="secondary" (click)="closePermModal()">Đóng</app-button>
                    <app-button (click)="saveUserFromModal(user)">
                        <i class="fa-solid fa-floppy-disk"></i> Lưu thay đổi
                    </app-button>
                </div>
        </app-modal-shell>
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
  usersLoading = signal(false);
  usersLoadError = signal('');
  rolesLoadError = signal('');
  batchSaving = signal(false);

  // SEARCH & FILTER SIGNALS
  searchQuery = signal<string>('');
  roleFilter = signal<string>('all'); // 'all' | 'pending' | 'staff' | 'manager' | 'viewer'
  roleIdFilter = signal<string>('all'); // 'all' | role.id
  permStatusFilter = signal<string>('all'); // 'all' | 'has_custom' | 'inherited_only'
  permissionQuery = signal('');

  // SELECTION & BATCH ACTIONS SIGNALS
  selectedUids = signal<Set<string>>(new Set());
  batchRole = signal<'manager' | 'staff' | 'viewer' | 'pending'>('staff');
  batchRoleId = signal<string>('role_staff_default');

  // COMPUTED STATS & FILTERED USERS
  totalCount = computed(() => this.userList().length);
  pendingCount = computed(() => this.userList().filter(u => u.role === 'pending').length);
  staffCount = computed(() => this.userList().filter(u => u.role === 'staff').length);
  managerCount = computed(() => this.userList().filter(u => u.role === 'manager').length);
  viewerCount = computed(() => this.userList().filter(u => u.role === 'viewer').length);

  hasActiveFilters = computed(() => {
    return !!this.searchQuery().trim() ||
           this.roleFilter() !== 'all' ||
           this.roleIdFilter() !== 'all' ||
           this.permStatusFilter() !== 'all';
  });

  filteredUsers = computed(() => {
    let list = this.userList();
    const query = this.searchQuery().trim().toLowerCase();
    const rFilter = this.roleFilter();
    const rIdFilter = this.roleIdFilter();
    const pFilter = this.permStatusFilter();

    // 1. Text Search Filter
    if (query) {
      list = list.filter(u => 
        (u.displayName && u.displayName.toLowerCase().includes(query)) ||
        (u.email && u.email.toLowerCase().includes(query)) ||
        (u.uid && u.uid.toLowerCase().includes(query))
      );
    }

    // 2. Role Filter
    if (rFilter !== 'all') {
      list = list.filter(u => u.role === rFilter);
    }

    // 3. Specific Role Group Filter (roleId)
    if (rIdFilter !== 'all') {
      list = list.filter(u => (u.roleId || 'role_staff_default') === rIdFilter);
    }

    // 4. Custom Permission Status Filter
    if (pFilter === 'has_custom') {
      list = list.filter(u => u.customPermissions && u.customPermissions.length > 0);
    } else if (pFilter === 'inherited_only') {
      list = list.filter(u => !u.customPermissions || u.customPermissions.length === 0);
    }

    return list;
  });

  selectedCount = computed(() => this.selectedUids().size);

  selectedPendingCount = computed(() => {
    const selected = this.selectedUids();
    return this.userList().filter(u => selected.has(u.uid) && u.role === 'pending').length;
  });

  isAllSelected = computed(() => {
    const visible = this.filteredUsers().filter(u => !this.isSuperAdmin(u));
    if (visible.length === 0) return false;
    const selected = this.selectedUids();
    return visible.every(u => selected.has(u.uid));
  });

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

  rolesList = signal<any[]>([]);

  ngOnInit() {
      this.loadUsers(false);
      this.loadRoles();
  }

  async loadUsers(forceRefresh = true) {
      if (this.usersLoading()) return;
      this.usersLoading.set(true);
      this.usersLoadError.set('');
      try {
          const users = await this.fb.getAllUsers(forceRefresh);
          this.userList.set(users);
      } catch (e: any) {
          this.userList.set([]);
          this.usersLoadError.set(`Không thể tải danh sách người dùng: ${e?.message || e}`);
      } finally {
          this.usersLoading.set(false);
      }
  }

  async loadRoles() {
      this.rolesLoadError.set('');
      try {
          const roles = await this.fb.getRolesConfig(true);
          this.rolesList.set(roles);
      } catch (e: any) {
          this.rolesList.set([]);
          this.rolesLoadError.set(`Không thể tải nhóm vai trò: ${e?.message || e}`);
      }
  }

  resetFilters() {
      this.searchQuery.set('');
      this.roleFilter.set('all');
      this.roleIdFilter.set('all');
      this.permStatusFilter.set('all');
  }

  // SELECTION HANDLERS
  toggleSelectUser(uid: string) {
      const user = this.userList().find(candidate => candidate.uid === uid);
      if (user && this.isSuperAdmin(user)) return;
      const next = new Set(this.selectedUids());
      if (next.has(uid)) {
          next.delete(uid);
      } else {
          next.add(uid);
      }
      this.selectedUids.set(next);
  }

  toggleSelectAll() {
      const next = new Set(this.selectedUids());
      const visible = this.filteredUsers().filter(u => !this.isSuperAdmin(u));
      if (this.isAllSelected()) {
          visible.forEach(u => next.delete(u.uid));
      } else {
          visible.forEach(u => next.add(u.uid));
      }
      this.selectedUids.set(next);
  }

  clearSelection() {
      this.selectedUids.set(new Set());
  }

  // QUICK & BATCH ACTION HANDLERS
  async quickApprovePending(u: UserProfile) {
      const updatedUser: UserProfile = {
          ...u,
          role: 'staff',
          roleId: u.roleId || 'role_staff_default',
          customPermissions: u.customPermissions || []
      };
      
      this.userList.update(users => users.map(user => user.uid === u.uid ? updatedUser : user));
      await this.saveUser(updatedUser);
  }

  async batchApprovePending() {
      const selected = this.selectedUids();
      const pendingUsers = this.userList().filter(u => selected.has(u.uid) && u.role === 'pending');
      
      if (pendingUsers.length === 0) return;

      this.userList.update(users => 
          users.map(u => {
              if (selected.has(u.uid) && u.role === 'pending') {
                  const updated: UserProfile = {
                      ...u,
                      role: 'staff',
                      roleId: u.roleId || 'role_staff_default',
                      customPermissions: u.customPermissions || []
                  };
                  return updated;
              }
              return u;
          })
      );

      await this.saveBatchUsers();
  }

  applyBatchRole() {
      const targetRole = this.batchRole();
      const targetRoleId = this.batchRoleId();
      const selected = this.selectedUids();

      if (targetRole === 'manager' && this.auth.currentUser()?.role !== 'manager') {
          this.toast.show('Chỉ Manager mới được cấp vai trò Manager.', 'error');
          return;
      }

      // SAFETY GUARD: Protect last manager(s) from being demoted in batch
      if (targetRole !== 'manager') {
          const currentManagers = this.userList().filter(u => u.role === 'manager');
          const remainingManagers = currentManagers.filter(u => !selected.has(u.uid));
          if (remainingManagers.length === 0) {
              this.toast.show('❌ Thao tác bị từ chối: Không thể hạ cấp toàn bộ Manager của hệ thống!', 'error');
              return;
          }
      }

      this.userList.update(users => 
          users.map(u => {
              if (selected.has(u.uid)) {
                  if (this.isSuperAdmin(u) && targetRole !== 'manager') {
                      return u; // Protect Super Admin from demotion
                  }
                  const updated: UserProfile = { ...u, role: targetRole };
                  if (targetRole === 'viewer' || targetRole === 'pending') {
                      updated.permissions = [];
                      updated.customPermissions = [];
                      updated.roleId = '';
                  } else if (targetRole === 'staff') {
                      updated.roleId = targetRoleId || 'role_staff_default';
                  }
                  return updated;
              }
              return u;
          })
      );

      this.toast.show(`Đã áp dụng vai trò "${targetRole}" cho ${selected.size} người dùng được chọn. Bấm "Lưu" để hoàn tất.`, 'info');
  }

  async saveBatchUsers() {
      const selected = this.selectedUids();
      const targets = this.userList().filter(u => selected.has(u.uid) && !this.isSuperAdmin(u));

      if (targets.length === 0 || this.batchSaving()) return;

      this.batchSaving.set(true);
      const failedUids = new Set<string>();
      const failedNames: string[] = [];
      let successCount = 0;
      try {
          for (const u of targets) {
              try {
                  await this.persistUser(u);
                  successCount++;
              } catch (e) {
                  failedUids.add(u.uid);
                  failedNames.push(u.displayName || u.email || u.uid);
              }
          }

          this.selectedUids.set(failedUids);
          if (failedNames.length === 0) {
              this.toast.show(`Đã lưu thành công ${successCount} người dùng!`, 'success');
          } else if (successCount > 0) {
              this.toast.show(`Đã lưu ${successCount}/${targets.length} người dùng. ${failedNames.length} tài khoản chưa lưu (${failedNames.slice(0, 3).join(', ')}${failedNames.length > 3 ? ', …' : ''}) và vẫn được giữ chọn để thử lại.`, 'error');
          } else {
              this.toast.show(`Không thể lưu ${failedNames.length} người dùng đã chọn. Các tài khoản vẫn được giữ chọn để thử lại.`, 'error');
          }
      } finally {
          this.batchSaving.set(false);
      }
  }

  updateUserRoleId(u: UserProfile, roleId: string) {
      this.userList.update(currentUsers => 
          currentUsers.map(user => {
              if (user.uid === u.uid) {
                  return { ...user, roleId: roleId };
              }
              return user;
          })
      );
  }

  isPermInherited(u: UserProfile, p: string): boolean {
      if (u.role !== 'staff') return false;
      const roleId = u.roleId || 'role_staff_default';
      const role = this.rolesList().find(r => r.id === roleId);
      return role?.permissions?.includes(p) || false;
  }

  isPermChecked(u: UserProfile, p: string): boolean {
      if (u.role === 'manager') return true;
      if (u.role === 'viewer') return false;
      if (u.role === 'pending') return false;
      // staff
      const inherited = this.isPermInherited(u, p);
      const custom = u.customPermissions?.includes(p) || false;
      return inherited || custom;
  }

  getUserPermissionsCount(u: UserProfile): number {
      if (u.role === 'manager') return Object.keys(PERMISSIONS).length;
      if (u.role === 'viewer') return 0;
      if (u.role === 'pending') return 0;
      // staff
      const roleId = u.roleId || 'role_staff_default';
      const role = this.rolesList().find(r => r.id === roleId);
      const custom = u.customPermissions || [];
      const distinct = new Set([
          ...(role?.permissions || []),
          ...custom
      ]);
      return distinct.size;
  }

  togglePerm(u: UserProfile, p: string) {
      if (this.isPermInherited(u, p)) return;
      this.userList.update(currentUsers => 
          currentUsers.map(user => {
              if (user.uid === u.uid) {
                  const custom = user.customPermissions ? [...user.customPermissions] : [];
                  const idx = custom.indexOf(p);
                  if (idx > -1) custom.splice(idx, 1);
                  else custom.push(p);
                  
                  const updatedUser = { ...user, customPermissions: custom };
                  if (this.selectedUserForPerms()?.uid === u.uid) {
                      this.selectedUserForPerms.set(updatedUser);
                  }
                  return updatedUser;
              }
              return user;
          })
      );
  }

  isSuperAdmin(u: UserProfile): boolean {
      return u.protectedAdmin === true;
  }

  updateRole(u: UserProfile, role: 'manager' | 'staff' | 'viewer' | 'pending') { 
      if (this.auth.currentUser()?.role !== 'manager' && (u.role === 'manager' || role === 'manager')) {
          this.toast.show('Chỉ Manager mới được cấp hoặc thay đổi vai trò Manager.', 'error');
          return;
      }

      // SAFETY GUARD: Protect Super Admin account
      if (this.isSuperAdmin(u) && role !== 'manager') {
          this.toast.show('Không thể hạ cấp tài khoản quản trị cao nhất.', 'error');
          return;
      }

      // SAFETY GUARD: Protect the last Manager account
      if (u.role === 'manager' && role !== 'manager') {
          const totalManagers = this.userList().filter(user => user.role === 'manager').length;
          if (totalManagers <= 1) {
              this.toast.show('Không thể hạ cấp quản trị viên cuối cùng. Hệ thống phải có ít nhất một quản trị viên.', 'error');
              return;
          }
      }

      this.userList.update(currentUsers => 
          currentUsers.map(user => {
              if (user.uid === u.uid) {
                  const updatedUser: UserProfile = { ...user, role: role };
                  if (role === 'viewer' || role === 'pending') {
                      updatedUser.permissions = [];
                      updatedUser.customPermissions = [];
                      updatedUser.roleId = '';
                  } else if (role === 'staff') {
                      updatedUser.roleId = 'role_staff_default';
                      updatedUser.customPermissions = [];
                  }
                  return updatedUser;
              }
              return user;
          })
      );
  }

  private async persistUser(u: UserProfile): Promise<void> {
      if (this.isSuperAdmin(u)) {
          throw new Error('Tài khoản quản trị gốc được bảo vệ và không thể sửa từ giao diện phân quyền.');
      }
      let resolvedPerms: string[] = [];
      let roleId = '';
      let customPermissions: string[] = [];

      if (u.role === 'manager') {
          resolvedPerms = Object.values(PERMISSIONS);
      } else if (u.role === 'staff') {
          roleId = u.roleId || 'role_staff_default';
          const role = this.rolesList().find(r => r.id === roleId);
          if (!role) throw new Error(`Không tìm thấy nhóm vai trò “${roleId}”.`);
          customPermissions = u.customPermissions || [];
          resolvedPerms = Array.from(new Set([
              ...(role.permissions || []),
              ...customPermissions
          ]));
      }

      await this.fb.updateUserPermissions(
          u.uid,
          u.role,
          resolvedPerms,
          roleId,
          customPermissions
      );
  }

  async saveUser(u: UserProfile): Promise<boolean> {
      try {
          await this.persistUser(u);
          this.toast.show(`Đã cập nhật ${u.displayName}`, 'success');
          return true;
      } catch (e: any) {
          this.toast.show(`Lỗi cập nhật ${u.displayName}: ${e?.message || e}`, 'error');
          return false;
      }
  }

  async saveUserFromModal(u: UserProfile) {
      if (await this.saveUser(u)) this.closePermModal();
  }

  closePermModal() {
      this.selectedUserForPerms.set(null);
      this.permissionQuery.set('');
  }

  copyUid(uid: string) {
      navigator.clipboard.writeText(uid)
          .then(() => this.toast.show('Đã sao chép UID.'))
          .catch(() => this.toast.show('Không thể sao chép UID.', 'error'));
  }
}
