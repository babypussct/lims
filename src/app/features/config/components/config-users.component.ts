import { Component, inject, signal, computed, OnInit } from '@angular/core';
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
        
        <!-- TOP HEADER & QUICK STATS -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/60 pb-5">
            <div>
                <div class="flex items-center gap-2">
                    <div class="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-base shadow-sm">
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
                        Tổng: <strong class="text-indigo-600 dark:text-indigo-400">{{totalCount()}}</strong>
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

                <button (click)="loadUsers()" class="px-3.5 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-2">
                    <i class="fa-solid fa-rotate"></i> Tải Lại
                </button>
            </div>
        </div>

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
                           class="w-full pl-9 pr-9 py-2.5 text-xs md:text-sm font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-xs">
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
                            [class]="roleFilter() === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'">
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
                            class="w-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer">
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
                            class="w-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer">
                        <option value="all">🌐 Tất cả trạng thái quyền</option>
                        <option value="has_custom">⚡ Có quyền riêng / tùy chỉnh (Custom)</option>
                        <option value="inherited_only">📋 Chỉ quyền theo Nhóm vai trò</option>
                    </select>
                </div>

                <!-- Visible Results Counter -->
                <div class="flex items-center justify-between sm:justify-end gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span>Đang hiển thị: <strong class="text-indigo-600 dark:text-indigo-400">{{filteredUsers().length}}</strong> / {{totalCount()}} người dùng</span>
                </div>
            </div>
        </div>

        <!-- STICKY BATCH ACTIONS TOOLBAR (Appears when >= 1 user selected) -->
        @if (selectedCount() > 0) {
            <div class="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-4 rounded-2xl shadow-xl border border-indigo-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-in sticky top-4 z-30">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
                        <i class="fa-solid fa-check-double"></i>
                    </div>
                    <div>
                        <div class="font-black text-sm text-white">Đã chọn {{selectedCount()}} người dùng</div>
                        <p class="text-[11px] text-indigo-200">Áp dụng tác vụ phân quyền hàng loạt cho các tài khoản được chọn</p>
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
                            <option value="manager">Manager</option>
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

                        <button (click)="applyBatchRole()" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition">
                            Áp Dụng
                        </button>
                    </div>

                    <!-- Batch Save Button -->
                    <button (click)="saveBatchUsers()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 active:scale-95">
                        <i class="fa-solid fa-floppy-disk"></i> Lưu Tất Cả Đã Chọn
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
                           class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600">
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
                         [ngClass]="{ 'bg-indigo-50/40 dark:bg-indigo-950/30': selectedUids().has(u.uid) }">
                        
                        <!-- Col 1: Checkbox & User Info -->
                        <div class="col-span-1 md:col-span-4 flex items-center gap-3.5">
                            <input type="checkbox" 
                                   [checked]="selectedUids().has(u.uid)" 
                                   (change)="toggleSelectUser(u.uid)" 
                                   class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600 shrink-0">
                            
                            <img [src]="getAvatarUrl(u.displayName, state.avatarStyle(), u.photoURL)" class="w-10 h-10 md:w-9 md:h-9 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 shrink-0 object-cover" alt="Avatar">
                            
                            <div class="min-w-0 flex-1">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span class="font-bold text-slate-800 dark:text-slate-200 truncate text-sm md:text-base">{{u.displayName}}</span>
                                    
                                    <!-- Status Badges -->
                                    @if (isSuperAdmin(u)) {
                                        <span class="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[10px] font-black rounded-md border border-amber-300 dark:border-amber-700/60 shrink-0 flex items-center gap-1">
                                            👑 Super Admin
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
                                <div class="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 flex items-center gap-1 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 w-fit" (click)="copyUid(u.uid)" title="Nhấn để sao chép UID">
                                    <i class="fa-regular fa-copy"></i> {{u.uid.substring(0,8)}}...
                                </div>
                            </div>
                        </div>
                        
                        <!-- Col 2: Role & Role Group -->
                        <div class="col-span-1 md:col-span-3 flex flex-col gap-2">
                            <label class="md:hidden text-[10px] uppercase font-bold text-slate-400 mb-1 block">Vai trò tài khoản</label>
                            
                            <div class="flex items-center gap-2">
                                <select [ngModel]="u.role" (ngModelChange)="updateRole(u, $event)" 
                                        class="w-full text-xs md:text-sm border border-slate-300 dark:border-slate-600 rounded-xl p-2 md:p-2 font-bold outline-none focus:border-indigo-500 bg-slate-50 md:bg-white dark:bg-slate-800 dark:text-slate-200 transition"
                                        [class.text-orange-600]="u.role === 'pending'"
                                        [class.dark:text-orange-400]="u.role === 'pending'">
                                    <option value="manager">Manager (Toàn quyền)</option>
                                    <option value="staff">Staff (Nhân viên)</option>
                                    <option value="viewer">Viewer (Chỉ xem)</option>
                                    <option value="pending">Pending (Chờ duyệt)</option>
                                </select>

                                <!-- 1-Click Quick Approve for Pending Rows -->
                                @if (u.role === 'pending') {
                                    <button (click)="quickApprovePending(u)" 
                                            class="px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition shrink-0 flex items-center gap-1.5 active:scale-95"
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
                                <button (click)="selectedUserForPerms.set(u)" class="w-full text-left p-2.5 min-w-0 md:min-w-[200px] bg-slate-50 md:bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-xs transition rounded-xl flex items-center justify-between group">
                                    <div class="flex items-center gap-2 text-xs md:text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                                        <i class="fa-solid fa-sliders text-indigo-500 shrink-0"></i> 
                                        <span class="truncate">Cấu hình quyền ({{getUserPermissionsCount(u)}})</span>
                                    </div>
                                    <i class="fa-solid fa-chevron-right text-[10px] text-slate-400 group-hover:text-indigo-500 transition-colors"></i>
                                </button>
                            }
                        </div>
                        
                        <!-- Col 4: Save Single User -->
                        <div class="col-span-1 md:col-span-1 flex md:justify-center mt-2 md:mt-0">
                            <button (click)="saveUser(u)" 
                                    class="w-full md:w-10 h-10 md:h-10 rounded-xl bg-indigo-50 md:bg-indigo-50/60 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white dark:hover:text-white transition flex items-center justify-center border border-indigo-200 md:border-transparent dark:border-indigo-800/40 font-bold gap-2 text-sm shadow-xs" 
                                    title="Lưu thay đổi cho người dùng này">
                                <i class="fa-solid fa-floppy-disk text-base md:text-sm"></i> <span class="md:hidden">Lưu Thay Đổi</span>
                            </button>
                        </div>
                        
                    </div>
                } @empty {
                    <div class="p-12 text-center text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800/60 flex flex-col items-center justify-center gap-3">
                        <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center text-slate-400 text-xl">
                            <i class="fa-solid fa-users-slash"></i>
                        </div>
                        <div class="font-bold text-slate-600 dark:text-slate-400 text-sm">Không tìm thấy người dùng phù hợp với bộ lọc.</div>
                        <p class="text-xs text-slate-400 dark:text-slate-500">Thử thay đổi từ khóa tìm kiếm hoặc bấm nút bên dưới để đặt lại bộ lọc.</p>
                        <button (click)="resetFilters()" class="mt-1 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold hover:bg-indigo-100 transition">
                            <i class="fa-solid fa-rotate-left"></i> Đặt Lại Tất Cả Bộ Lọc
                        </button>
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
                        <img [src]="getAvatarUrl(user.displayName, state.avatarStyle(), user.photoURL)" class="w-12 h-12 rounded-full border-2 border-white dark:border-slate-700 shadow-sm object-cover">
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
                                            }
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
                        <i class="fa-solid fa-floppy-disk"></i> Lưu Thay Đổi
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

  // SEARCH & FILTER SIGNALS
  searchQuery = signal<string>('');
  roleFilter = signal<string>('all'); // 'all' | 'pending' | 'staff' | 'manager' | 'viewer'
  roleIdFilter = signal<string>('all'); // 'all' | role.id
  permStatusFilter = signal<string>('all'); // 'all' | 'has_custom' | 'inherited_only'

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
    const visible = this.filteredUsers();
    if (visible.length === 0) return false;
    const selected = this.selectedUids();
    return visible.every(u => selected.has(u.uid));
  });

  permissionGroups = [
    {
      name: 'Quản lý kho và hóa chất',
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
        { val: PERMISSIONS.SOP_EDIT, label: 'Biên soạn SOP' },
        { val: PERMISSIONS.SOP_APPROVE, label: 'Phê duyệt SOP' },
        { val: PERMISSIONS.RECIPE_VIEW, label: 'Xem công thức' },
        { val: PERMISSIONS.RECIPE_EDIT, label: 'Sửa công thức' }
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

  rolesList = signal<any[]>([]);

  ngOnInit() {
      this.loadUsers();
      this.loadRoles();
  }

  async loadUsers() {
      try { const users = await this.fb.getAllUsers(); this.userList.set(users); } catch (e) { this.userList.set([]); }
  }

  async loadRoles() {
      try { const roles = await this.fb.getRolesConfig(); this.rolesList.set(roles); } catch (e) { this.rolesList.set([]); }
  }

  resetFilters() {
      this.searchQuery.set('');
      this.roleFilter.set('all');
      this.roleIdFilter.set('all');
      this.permStatusFilter.set('all');
  }

  // SELECTION HANDLERS
  toggleSelectUser(uid: string) {
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
      const visible = this.filteredUsers();
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
      const targets = this.userList().filter(u => selected.has(u.uid));

      if (targets.length === 0) return;

      try {
          let count = 0;
          for (const u of targets) {
              let resolvedPerms: string[] = [];
              if (u.role === 'manager') {
                  resolvedPerms = Object.values(PERMISSIONS);
              } else if (u.role === 'viewer' || u.role === 'pending') {
                  resolvedPerms = [];
              } else if (u.role === 'staff') {
                  const roleId = u.roleId || 'role_staff_default';
                  const role = this.rolesList().find(r => r.id === roleId);
                  const custom = u.customPermissions || [];
                  resolvedPerms = Array.from(new Set([
                      ...(role?.permissions || []),
                      ...custom
                  ]));
              }

              await this.fb.updateUserPermissions(
                  u.uid, 
                  u.role, 
                  resolvedPerms, 
                  u.roleId || 'role_staff_default', 
                  u.customPermissions || []
              );
              count++;
          }
          this.toast.show(`Đã lưu thành công ${count} người dùng!`, 'success');
          this.clearSelection();
      } catch (e) {
          this.toast.show('Lỗi khi lưu danh sách người dùng.', 'error');
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

  hasPerm(u: UserProfile, p: string) { return u.permissions?.includes(p); }
  
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

  SUPER_ADMIN_EMAIL = 'oneloveonepeopleforever@gmail.com';

  isSuperAdmin(u: UserProfile): boolean {
      return (u.email || '').toLowerCase() === this.SUPER_ADMIN_EMAIL;
  }

  updateRole(u: UserProfile, role: 'manager' | 'staff' | 'viewer' | 'pending') { 
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

  async saveUser(u: UserProfile) {
      try { 
          let resolvedPerms: string[] = [];
          if (u.role === 'manager') {
              resolvedPerms = Object.values(PERMISSIONS);
          } else if (u.role === 'viewer' || u.role === 'pending') {
              resolvedPerms = [];
          } else if (u.role === 'staff') {
              const roleId = u.roleId || 'role_staff_default';
              const role = this.rolesList().find(r => r.id === roleId);
              const custom = u.customPermissions || [];
              resolvedPerms = Array.from(new Set([
                  ...(role?.permissions || []),
                  ...custom
              ]));
          }

          await this.fb.updateUserPermissions(
              u.uid, 
              u.role, 
              resolvedPerms, 
              u.roleId || 'role_staff_default', 
              u.customPermissions || []
          ); 
          this.toast.show(`Đã cập nhật ${u.displayName}`, 'success'); 
      } 
      catch (e) { this.toast.show('Lỗi cập nhật.', 'error'); }
  }

  closePermModal() {
      this.selectedUserForPerms.set(null);
  }

  copyUid(uid: string) { navigator.clipboard.writeText(uid).then(() => this.toast.show('Đã sao chép UID.')); }
}
