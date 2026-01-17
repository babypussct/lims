import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FirebaseService } from '../../core/services/firebase.service';
import { ToastService } from '../../core/services/toast.service';
import { AuthService, PERMISSIONS, UserProfile } from '../../core/services/auth.service';
import { StateService } from '../../core/services/state.service';
import { HealthCheckItem } from '../../core/models/config.model';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { getAvatarUrl } from '../../shared/utils/utils';
import { SopService } from '../sop/services/sop.service';
import { collection, getDocs, writeBatch, doc, serverTimestamp, deleteField } from 'firebase/firestore';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto space-y-6 pb-24 fade-in px-4 md:px-8">
        
        <!-- Header -->
        @if(state.isAdmin()) {
            <div class="flex items-center justify-between">
                <h2 class="text-3xl font-black text-slate-800 flex items-center gap-3">
                    <i class="fa-solid fa-gears text-slate-400"></i> Cấu hình Hệ thống
                </h2>
                <div class="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                    App Context: <span class="text-blue-600 font-mono">{{fb.APP_ID}}</span>
                </div>
            </div>

            <!-- TABS -->
            <div class="flex gap-6 border-b border-slate-200">
                <button (click)="activeTab.set('general')" class="pb-3 px-2 text-sm font-bold border-b-2 transition flex items-center gap-2" [class]="activeTab() === 'general' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'">
                    <i class="fa-solid fa-server"></i> Hệ thống & Tài nguyên
                </button>
                <button (click)="activeTab.set('users')" class="pb-3 px-2 text-sm font-bold border-b-2 transition flex items-center gap-2" [class]="activeTab() === 'users' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'">
                    <i class="fa-solid fa-users-gear"></i> Người dùng & Phân quyền
                </button>
            </div>

            @if (activeTab() === 'general') {
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    
                    <!-- 1. SYSTEM SETTINGS (App ID & Version) -->
                    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
                        <div class="flex justify-between items-center">
                            <h3 class="font-bold text-slate-800 flex items-center gap-2 text-base">
                                <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><i class="fa-solid fa-sliders"></i></div>
                                Cài đặt chung
                            </h3>
                        </div>
                        
                        <div class="space-y-4">
                            <!-- Version Control -->
                            <div>
                                <label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Số hiệu Phiên bản (System Version)</label>
                                <div class="flex gap-2">
                                    <input [formControl]="versionControl" class="flex-1 border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition" placeholder="VD: V1.0 FINAL">
                                    <button (click)="saveVersion()" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition shadow-sm">Lưu</button>
                                </div>
                                <p class="text-[9px] text-slate-400 mt-1 italic">Thay đổi này sẽ cập nhật hiển thị phiên bản trên toàn hệ thống.</p>
                            </div>

                            <hr class="border-slate-100">

                            <!-- App ID Switch -->
                            <div>
                                <label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Switch App Context ID (Advanced)</label>
                                <div class="flex gap-2">
                                    <input [formControl]="appIdControl" class="flex-1 border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-600 outline-none focus:bg-white focus:border-blue-500 transition">
                                    <button (click)="saveAppId()" class="bg-slate-800 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-black transition">Switch</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 2. RESOURCES & STORAGE -->
                    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
                        <div class="flex justify-between items-center">
                            <h3 class="font-bold text-slate-800 flex items-center gap-2 text-base">
                                <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><i class="fa-solid fa-hard-drive"></i></div>
                                Dung lượng & Tài nguyên
                            </h3>
                            <button (click)="loadUsage()" class="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600"><i class="fa-solid fa-calculator"></i> Tính toán</button>
                        </div>

                        @if(storageEstimate(); as stat) {
                            <div class="grid grid-cols-2 gap-3">
                                <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                                    <div class="text-[10px] text-slate-400 uppercase font-bold">Tổng Docs</div>
                                    <div class="text-2xl font-black text-slate-700">{{stat.totalDocs}}</div>
                                </div>
                                <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                                    <div class="text-[10px] text-slate-400 uppercase font-bold">Size (JSON)</div>
                                    <div class="text-2xl font-black text-emerald-600">{{stat.estimatedSizeKB}} <span class="text-xs text-slate-400 font-medium">KB</span></div>
                                </div>
                            </div>
                            <div class="space-y-3 mt-2">
                                @for(key of objectKeys(stat.details); track key) {
                                    <div>
                                        <div class="flex justify-between text-[10px] mb-1 font-bold text-slate-500 uppercase">
                                            <span>{{key}}</span>
                                            <span>{{stat.details[key].count}} docs ({{stat.details[key].sizeKB}} KB)</span>
                                        </div>
                                        <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                            <div class="bg-emerald-500 h-1.5 rounded-full" [style.width.%]="(stat.details[key].sizeKB / (stat.estimatedSizeKB || 1)) * 100"></div>
                                        </div>
                                    </div>
                                }
                            </div>
                        } @else {
                            <div class="py-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <p class="text-xs text-slate-400">Nhấn nút tính toán để xem chi tiết.</p>
                            </div>
                        }
                    </div>

                    <!-- 3. CONNECTION HEALTH -->
                    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
                        <div class="flex justify-between items-center">
                            <h3 class="font-bold text-slate-800 flex items-center gap-2 text-base">
                                <div class="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center"><i class="fa-solid fa-heart-pulse"></i></div>
                                Trạng thái Kết nối
                            </h3>
                            <button (click)="checkHealth()" class="text-xs font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition flex items-center gap-1">
                                <i class="fa-solid fa-rotate" [class.fa-spin]="loadingHealth()"></i> Refresh
                            </button>
                        </div>
                        
                        <div class="border border-slate-100 rounded-xl overflow-hidden">
                            <table class="w-full text-xs text-left">
                                <thead class="bg-slate-50 font-bold text-slate-500 uppercase">
                                    <tr>
                                        <th class="px-4 py-2">Collection</th>
                                        <th class="px-4 py-2 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-50">
                                    @for (item of healthItems(); track item.collection) {
                                        <tr>
                                            <td class="px-4 py-2 font-bold text-slate-700 capitalize">{{item.collection}}</td>
                                            <td class="px-4 py-2 text-right">
                                                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                                                      [class]="item.status === 'Online' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                                                    {{item.status}}
                                                </span>
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- 4. PRINT CONFIG -->
                    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
                        <div class="flex justify-between items-center">
                            <h3 class="font-bold text-slate-800 flex items-center gap-2 text-base">
                                <div class="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><i class="fa-solid fa-print"></i></div>
                                Cấu hình In ấn
                            </h3>
                            <button (click)="savePrintConfig()" class="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-blue-700 transition shadow-sm">Lưu</button>
                        </div>
                        
                        <!-- Toggle Signature -->
                        <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div>
                                <div class="text-xs font-bold text-slate-700">Hiển thị Khung Ký Tên</div>
                                <div class="text-[10px] text-slate-400">Thêm mục "Xác nhận / Ký tên" vào cuối phiếu</div>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" [(ngModel)]="printConfig().showSignature" class="sr-only peer">
                                <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                        </div>

                        <div>
                            <label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Footer Text (Cam kết cuối phiếu)</label>
                            <textarea [(ngModel)]="printConfig().footerText" rows="3" class="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none transition" placeholder="Nhập nội dung..."></textarea>
                        </div>
                    </div>

                    <!-- 5. SECURITY RULES & BACKUP -->
                    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
                        <div class="flex justify-between items-start">
                            <h3 class="font-bold text-slate-800 flex items-center gap-2 text-base">
                                <div class="w-8 h-8 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center"><i class="fa-solid fa-shield-cat"></i></div>
                                Security & Backup
                            </h3>
                        </div>
                        
                        <!-- Backup Buttons -->
                        <div class="grid grid-cols-2 gap-2 mb-2">
                            <button (click)="exportData()" class="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 text-xs font-bold text-slate-600 transition">
                                <i class="fa-solid fa-download"></i> Backup JSON
                            </button>
                            <label class="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 text-xs font-bold text-slate-600 transition cursor-pointer">
                                <i class="fa-solid fa-upload"></i> Restore JSON
                                <input type="file" class="hidden" accept=".json" (change)="importData($event)">
                            </label>
                        </div>

                        <!-- Rules -->
                        <div class="relative">
                            <div class="flex justify-between items-center mb-1">
                                <span class="text-[10px] font-bold text-slate-400 uppercase">Firestore Rules</span>
                                <button (click)="copyRules()" class="text-[10px] text-blue-600 font-bold hover:underline">Copy</button>
                            </div>
                            <textarea readonly class="w-full h-32 bg-slate-800 text-green-400 font-mono text-[10px] p-2 rounded-lg focus:outline-none resize-none leading-relaxed" spellcheck="false">{{firestoreRules()}}</textarea>
                            <p class="text-[9px] text-slate-400 mt-1 italic"><i class="fa-solid fa-circle-info"></i> Hãy copy và dán vào tab "Rules" trên Firebase Console nếu gặp lỗi "Missing Permissions".</p>
                        </div>
                    </div>

                    <!-- 6. DANGER ZONE & MAINTENANCE -->
                    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4 md:col-span-2">
                        <h3 class="font-bold text-slate-800 flex items-center gap-2 text-base">
                            <div class="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center"><i class="fa-solid fa-triangle-exclamation"></i></div>
                            Vùng Quản trị & Bảo trì (Danger Zone)
                        </h3>
                        
                        <div class="flex flex-col md:flex-row gap-4">
                            <!-- New Migration Tool -->
                            <button (click)="migrateLegacyLogs()" class="flex-1 p-4 border border-orange-100 bg-orange-50 rounded-xl hover:bg-orange-100 transition flex items-center justify-center gap-3 text-orange-700 font-bold text-sm">
                                 <i class="fa-solid fa-file-export text-lg"></i>
                                 <div>
                                     <div>Migrate Data (v1 -> v2)</div>
                                     <div class="text-[10px] font-normal opacity-80">Tách PrintData sang collection riêng</div>
                                 </div>
                            </button>

                            <button (click)="loadSampleData()" class="flex-1 p-4 border border-blue-100 bg-blue-50/30 rounded-xl hover:bg-blue-50 transition flex items-center justify-center gap-3 text-blue-700 font-bold text-sm">
                                 <i class="fa-solid fa-flask-vial text-lg"></i>
                                 Nạp Dữ liệu Mẫu (NAFI6)
                            </button>

                            <button (click)="resetDefaults()" class="flex-1 p-4 border border-red-200 bg-red-100 rounded-xl hover:bg-red-200 transition flex items-center justify-center gap-3 text-red-800 font-bold text-sm">
                                 <i class="fa-solid fa-eraser text-lg"></i>
                                 Xóa Sạch (Wipe All Data)
                            </button>
                        </div>
                    </div>

                </div>
            }

            @if (activeTab() === 'users') {
                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6 fade-in">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="font-bold text-slate-800 flex items-center gap-2 text-base">
                                <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><i class="fa-solid fa-users"></i></div>
                                Danh sách Người dùng
                            </h3>
                            <p class="text-xs text-slate-500 mt-1">Cấp quyền truy cập chi tiết. Manager có mặc định toàn quyền.</p>
                        </div>
                        <button (click)="loadUsers()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-2">
                            <i class="fa-solid fa-rotate"></i> Tải lại
                        </button>
                    </div>

                    <div class="overflow-x-auto border border-slate-100 rounded-xl">
                        <table class="w-full text-sm text-left">
                            <thead class="bg-slate-50 text-xs text-slate-500 uppercase font-bold">
                                <tr>
                                    <th class="px-6 py-4">Người dùng</th>
                                    <th class="px-6 py-4 w-32">Vai trò (Role)</th>
                                    <th class="px-6 py-4">Quyền hạn (Detailed Permissions)</th>
                                    <th class="px-6 py-4 text-center w-24">Lưu</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                @for (u of userList(); track u.uid) {
                                    <tr class="hover:bg-slate-50 transition">
                                        <td class="px-6 py-4 align-top">
                                            <div class="flex items-center gap-3">
                                                <img [src]="getAvatarUrl(u.displayName)" class="w-8 h-8 rounded-full bg-slate-200 border border-slate-300" alt="Avatar">
                                                <div>
                                                    <div class="font-bold text-slate-700">{{u.displayName}}</div>
                                                    <div class="text-xs text-slate-400 font-mono mt-0.5">{{u.email}}</div>
                                                    <div class="text-[10px] text-slate-300 font-mono mt-1 flex items-center gap-1 cursor-pointer hover:text-blue-500" (click)="copyUid(u.uid)" title="Copy UID">
                                                        <i class="fa-regular fa-copy"></i> {{u.uid.substring(0,8)}}...
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 align-top">
                                            <select [ngModel]="u.role" (ngModelChange)="updateRole(u, $event)" 
                                                    class="w-full text-xs border border-slate-300 rounded-lg p-2 font-bold outline-none focus:border-indigo-500 bg-white"
                                                    [class.text-orange-500]="u.role === 'pending'">
                                                <option value="manager">Manager</option>
                                                <option value="staff">Staff</option>
                                                <option value="viewer">Viewer</option>
                                                <option value="pending">Pending (Chờ duyệt)</option>
                                            </select>
                                        </td>
                                        <td class="px-6 py-4 align-top">
                                            @if(u.role === 'manager') {
                                                <div class="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-700 text-xs font-bold flex items-center gap-2">
                                                    <i class="fa-solid fa-check-double"></i> Tài khoản Manager có toàn quyền hệ thống.
                                                </div>
                                            } @else if(u.role === 'viewer') {
                                                <div class="p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-700 text-xs font-bold flex items-center gap-2">
                                                    <i class="fa-solid fa-eye"></i> Tài khoản Viewer chỉ có quyền xem Dashboard (Read-only).
                                                </div>
                                            } @else if(u.role === 'pending') {
                                                <div class="p-3 bg-orange-50 border border-orange-100 rounded-lg text-orange-700 text-xs font-bold flex items-center gap-2">
                                                    <i class="fa-solid fa-hourglass-half"></i> Đang chờ cấp quyền. (Zero Trust)
                                                </div>
                                            } @else {
                                                <div class="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                                    @for (perm of availablePermissions; track perm.val) {
                                                        <label class="flex items-center gap-2 p-1.5 rounded hover:bg-slate-100 cursor-pointer border border-transparent hover:border-slate-200 transition">
                                                            <input type="checkbox" 
                                                                   [checked]="hasPerm(u, perm.val)" 
                                                                   (change)="togglePerm(u, perm.val)"
                                                                   class="w-4 h-4 rounded border-slate-300 accent-indigo-600">
                                                            <span class="text-[11px] font-bold text-slate-600">{{perm.label}}</span>
                                                        </label>
                                                    }
                                                </div>
                                            }
                                        </td>
                                        <td class="px-6 py-4 text-center align-top">
                                            <button (click)="saveUser(u)" class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition flex items-center justify-center shadow-sm" title="Lưu thay đổi">
                                                <i class="fa-solid fa-floppy-disk"></i>
                                            </button>
                                        </td>
                                    </tr>
                                } @empty {
                                    <tr>
                                        <td colspan="4" class="p-8 text-center text-slate-400 italic">
                                            Không tìm thấy người dùng.
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            }
        } @else {
            <!-- NON-ADMIN VIEW (Profile Card Design) -->
            <div class="max-w-3xl mx-auto pt-8">
                <div class="bg-white rounded-3xl shadow-soft-xl border border-slate-100 overflow-hidden relative">
                    <!-- Header Background -->
                    <div class="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                        <div class="absolute inset-0 bg-white/10 opacity-30 pattern-dots"></div>
                    </div>
                    
                    <div class="px-8 pb-8">
                        <!-- Avatar & Basic Info -->
                        <div class="relative -mt-12 mb-6 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                            <div class="w-28 h-28 rounded-2xl bg-white p-1 shadow-lg shrink-0">
                                <!-- ROBOT AVATAR IMPLEMENTATION -->
                                <img [src]="getAvatarUrl(auth.currentUser()?.displayName)" 
                                     alt="Profile Avatar"
                                     class="w-full h-full rounded-xl bg-slate-100 object-cover border border-slate-200">
                            </div>
                            <div class="flex-1 pb-2">
                                <h2 class="text-3xl font-black text-slate-800">{{auth.currentUser()?.displayName}}</h2>
                                <p class="text-slate-500 font-medium">{{auth.currentUser()?.email}}</p>
                            </div>
                            <div class="pb-2">
                                <span class="px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-bold uppercase tracking-wide border border-blue-200">
                                    {{auth.currentUser()?.role}} Account
                                </span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Left: ID & Context -->
                            <div class="space-y-4">
                                <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">User ID (UID)</label>
                                    <div class="flex items-center gap-2">
                                        <code class="text-xs font-mono font-bold text-slate-600 truncate flex-1 bg-white px-2 py-1 rounded border border-slate-200 select-all">
                                            {{auth.currentUser()?.uid}}
                                        </code>
                                        <button (click)="copyUid(auth.currentUser()?.uid || '')" class="text-blue-600 hover:text-blue-800 text-xs font-bold px-2 py-1 rounded hover:bg-blue-50 transition">Copy</button>
                                    </div>
                                </div>
                                
                                <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">App Context</label>
                                    <div class="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <i class="fa-solid fa-database text-slate-400"></i> {{fb.APP_ID}}
                                    </div>
                                </div>
                            </div>

                            <!-- Right: Permissions -->
                            <div class="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
                                <label class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-3 flex items-center gap-2">
                                    <i class="fa-solid fa-shield-halved"></i> Quyền hạn truy cập
                                </label>
                                @if (auth.currentUser()?.role === 'manager') {
                                    <div class="text-sm font-bold text-indigo-700 flex items-center gap-2 bg-white p-3 rounded-xl shadow-sm border border-indigo-100">
                                        <i class="fa-solid fa-check-double text-green-500"></i>
                                        Full System Access (Quản trị viên)
                                    </div>
                                } @else {
                                    <div class="grid grid-cols-1 gap-2">
                                        @for(p of availablePermissions; track p.val) {
                                            @if(hasPerm(auth.currentUser()!, p.val)) {
                                                <div class="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                                                    <i class="fa-solid fa-check text-green-500"></i> {{p.label}}
                                                </div>
                                            }
                                        }
                                        @if(!auth.currentUser()?.permissions?.length) {
                                            <div class="text-center text-xs text-slate-400 italic py-2">Chưa được cấp quyền cụ thể.</div>
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="text-center mt-6">
                    <p class="text-xs text-slate-400">Để yêu cầu nâng cấp quyền hạn, vui lòng gửi UID cho Quản lý hệ thống.</p>
                </div>
            </div>
        }
    </div>
  `
})
export class ConfigComponent implements OnInit {
  fb = inject(FirebaseService);
  auth = inject(AuthService);
  state = inject(StateService);
  toast = inject(ToastService);
  sopService = inject(SopService);
  confirmationService = inject(ConfirmationService);
  
  appIdControl = new FormControl('');
  versionControl = new FormControl(''); // New control for Version
  
  printConfig = this.state.printConfig;
  
  activeTab = signal<'general' | 'users'>('general');
  loadingHealth = signal(false);
  healthItems = signal<HealthCheckItem[]>([]);
  storageEstimate = signal<{ totalDocs: number, estimatedSizeKB: number, details: any } | null>(null);
  
  userList = signal<UserProfile[]>([]);
  availablePermissions = [
      { val: PERMISSIONS.INVENTORY_VIEW, label: 'Xem Kho' },
      { val: PERMISSIONS.INVENTORY_EDIT, label: 'Sửa Kho (Thêm/Xóa/Sửa)' },
      { val: PERMISSIONS.STANDARD_VIEW, label: 'Xem Chuẩn' },
      { val: PERMISSIONS.STANDARD_EDIT, label: 'Sửa Chuẩn' },
      { val: PERMISSIONS.RECIPE_VIEW, label: 'Xem Công thức' },
      { val: PERMISSIONS.RECIPE_EDIT, label: 'Sửa Công thức (Library)' },
      { val: PERMISSIONS.SOP_VIEW, label: 'Xem SOP' },
      { val: PERMISSIONS.SOP_EDIT, label: 'Sửa SOP (Editor)' },
      { val: PERMISSIONS.SOP_APPROVE, label: 'Duyệt (Approve)' },
      { val: PERMISSIONS.REPORT_VIEW, label: 'Xem Báo cáo' },
      { val: PERMISSIONS.USER_MANAGE, label: 'Quản trị (Admin)' },
  ];
  
  objectKeys = Object.keys;
  getAvatarUrl = getAvatarUrl; 

  firestoreRules = computed(() => {
    const appId = this.fb.APP_ID;
    return `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Check if user is manager based on their user profile doc
    function isManager() { 
      return exists(/databases/$(database)/documents/artifacts/${appId}/users/$(request.auth.uid)) && 
             get(/databases/$(database)/documents/artifacts/${appId}/users/$(request.auth.uid)).data.role == 'manager'; 
    }

    match /artifacts/${appId} {
        // Users: Self-read/write, Manager-write
        match /users/{userId} { 
          allow read: if request.auth != null; 
          allow write: if isManager() || request.auth.uid == userId; 
        }
        
        // Recipes: Authenticated users can read/write (Shared Library)
        match /recipes/{recipeId} {
           allow read, write: if request.auth != null;
        }

        // Print Jobs: Heavy data (Created via Transaction)
        match /print_jobs/{jobId} {
           allow read, write: if request.auth != null;
        }

        // Fallback for other collections (inventory, sops, etc)
        match /{document=**} { 
          allow read, write: if request.auth != null; 
        }
    }
  }
}`;
  });

  ngOnInit() {
      if (this.state.isAdmin()) {
          this.appIdControl.setValue(this.fb.APP_ID);
          this.versionControl.setValue(this.state.systemVersion()); // Init version value
          this.checkHealth();
          this.loadUsers();
      }
  }

  async saveAppId() {
      const val = this.appIdControl.value;
      if (val && val !== this.fb.APP_ID) {
          if(await this.confirmationService.confirm('Chuyển đổi App ID?')) this.fb.setAppId(val);
      }
  }

  async saveVersion() {
      const val = this.versionControl.value;
      if (val) {
          await this.state.saveSystemVersion(val);
          this.toast.show('Đã cập nhật phiên bản!');
      }
  }

  checkHealth() {
      this.loadingHealth.set(true);
      this.fb.checkSystemHealth().subscribe({
          next: (res) => { this.healthItems.set(res); this.loadingHealth.set(false); },
          error: () => this.loadingHealth.set(false)
      });
  }

  async loadUsage() {
      try {
          const estimate = await this.fb.getStorageEstimate();
          this.storageEstimate.set(estimate);
      } catch (e) { this.toast.show('Lỗi tính dung lượng.', 'error'); }
  }

  savePrintConfig() { this.state.savePrintConfig(this.printConfig()); }
  copyUid(uid: string) { navigator.clipboard.writeText(uid).then(() => this.toast.show('Đã copy UID!')); }
  copyRules() { navigator.clipboard.writeText(this.firestoreRules()).then(() => this.toast.show('Đã copy Rules!')); }
  
  async exportData() {
      try {
          const data = await this.fb.exportData();
          const json = JSON.stringify(data, null, 2);
          const blob = new Blob([json], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = url; a.download = `LIMS_Backup_${this.fb.APP_ID}.json`; a.click(); URL.revokeObjectURL(url);
          this.toast.show('Đã tải backup.');
      } catch (e) { this.toast.show('Backup lỗi', 'error'); }
  }

  async importData(event: any) {
      const file = event.target.files[0]; if (!file) return;
      if (await this.confirmationService.confirm({ message: 'Restore sẽ GHI ĐÈ dữ liệu. Tiếp tục?', confirmText: 'Restore', isDangerous: true })) {
          const reader = new FileReader();
          reader.onload = async (e: any) => {
              try { await this.fb.importData(JSON.parse(e.target.result)); this.toast.show('Restore thành công!', 'success'); setTimeout(() => window.location.reload(), 1000); } 
              catch (err) { this.toast.show('File lỗi', 'error'); }
          };
          reader.readAsText(file);
      }
  }

  async migrateLegacyLogs() {
      if (!await this.confirmationService.confirm({ message: 'Chạy chuyển đổi dữ liệu cũ (Tách PrintData)?\nQuá trình này có thể mất thời gian.', confirmText: 'Chạy Migration' })) return;

      this.toast.show('Đang xử lý migration...', 'info');
      const logsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/logs`);
      const snapshot = await getDocs(logsRef);
      
      let batch = writeBatch(this.fb.db);
      let count = 0;
      let migrated = 0;
      const BATCH_SIZE = 400;

      for (const docSnap of snapshot.docs) {
          const log = docSnap.data() as any;
          
          // Only migrate if it has legacy printData AND hasn't been migrated yet
          if (log.printData && !log.printJobId) {
              // 1. Create Print Job
              const jobRef = doc(collection(this.fb.db, `artifacts/${this.fb.APP_ID}/print_jobs`));
              const printJobData = {
                  ...log.printData,
                  createdAt: log.timestamp || serverTimestamp(),
                  createdBy: log.user || 'System Migration',
                  migratedFromLogId: docSnap.id
              };
              
              batch.set(jobRef, printJobData);

              // 2. Update Log
              const sopBasic = {
                  name: log.printData.sop?.name || 'Unknown',
                  category: log.printData.sop?.category || '',
                  ref: log.printData.sop?.ref || ''
              };

              batch.update(docSnap.ref, {
                  printJobId: jobRef.id,
                  sopBasicInfo: sopBasic,
                  printData: deleteField() // Remove heavy data
              });

              migrated++;
              count++;
          }

          if (count >= BATCH_SIZE) {
              await batch.commit();
              batch = writeBatch(this.fb.db);
              count = 0;
          }
      }

      if (count > 0) await batch.commit();
      this.toast.show(`Hoàn tất! Đã chuyển đổi ${migrated} bản ghi.`, 'success');
  }

  async resetDefaults() {
      if(await this.confirmationService.confirm({ message: 'XÓA SẠCH toàn bộ dữ liệu? Không thể hoàn tác.', confirmText: 'Xóa Sạch', isDangerous: true })) {
          await this.fb.resetToDefaults();
          this.toast.show('Đã xóa sạch dữ liệu.', 'info');
          setTimeout(() => window.location.reload(), 1500);
      }
  }

  async loadSampleData() {
    if(await this.confirmationService.confirm({ message: 'Nạp mẫu NAFI6 (Ghi đè)?', confirmText: 'Nạp Mẫu', isDangerous: true })) {
        await this.fb.loadSampleData();
        this.toast.show('Đã nạp mẫu! Refreshing...', 'success');
        setTimeout(() => window.location.reload(), 1500);
    }
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
                  return { ...user, permissions: perms };
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
}