
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
                <div>
                    <h2 class="text-3xl font-black text-slate-800 flex items-center gap-3">
                        <i class="fa-solid fa-gears text-slate-400"></i> Cấu hình Hệ thống
                    </h2>
                    <p class="text-xs text-slate-500 mt-1 font-medium ml-1">Quản trị viên: {{auth.currentUser()?.displayName}}</p>
                </div>
                <div class="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                    Version: <span class="text-blue-600 font-mono">{{state.systemVersion()}}</span>
                </div>
            </div>

            <!-- TABS -->
            <div class="flex gap-6 border-b border-slate-200">
                <button (click)="activeTab.set('general')" class="pb-3 px-2 text-sm font-bold border-b-2 transition flex items-center gap-2" [class]="activeTab() === 'general' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'">
                    <i class="fa-solid fa-server"></i> Hệ thống & Dữ liệu
                </button>
                <button (click)="activeTab.set('safety')" class="pb-3 px-2 text-sm font-bold border-b-2 transition flex items-center gap-2" [class]="activeTab() === 'safety' ? 'border-orange-600 text-orange-700' : 'border-transparent text-slate-500 hover:text-slate-700'">
                    <i class="fa-solid fa-shield-halved"></i> Định mức & Tiêu hao
                </button>
                <button (click)="activeTab.set('users')" class="pb-3 px-2 text-sm font-bold border-b-2 transition flex items-center gap-2" [class]="activeTab() === 'users' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'">
                    <i class="fa-solid fa-users-gear"></i> Người dùng & Phân quyền
                </button>
            </div>

            @if (activeTab() === 'general') {
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start animate-fade-in">
                    
                    <!-- LEFT COLUMN -->
                    <div class="space-y-6">
                        
                        <!-- 1. MASTER DATA -->
                        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
                            <h3 class="font-bold text-slate-800 flex items-center gap-2 text-base">
                                <div class="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center"><i class="fa-solid fa-layer-group"></i></div>
                                Danh mục Gốc (Master Data)
                            </h3>
                            <div class="grid gap-3">
                                <button (click)="router.navigate(['/master-targets'])" class="w-full py-3 px-4 border border-teal-200 bg-teal-50 text-teal-800 rounded-xl font-bold text-sm hover:bg-teal-100 transition flex items-center justify-between group">
                                    <span class="flex items-center gap-2"><i class="fa-solid fa-book-medical"></i> Thư viện Chỉ tiêu Gốc</span>
                                    <i class="fa-solid fa-arrow-right opacity-50 group-hover:opacity-100 transition-opacity"></i>
                                </button>
                                <button (click)="router.navigate(['/target-groups'])" class="w-full py-3 px-4 border border-slate-200 bg-slate-50 text-slate-700 rounded-xl font-bold text-sm hover:bg-white hover:shadow-sm transition flex items-center justify-between group">
                                    <span class="flex items-center gap-2"><i class="fa-solid fa-list-check"></i> Bộ Chỉ tiêu (Groups)</span>
                                    <i class="fa-solid fa-arrow-right opacity-50 group-hover:opacity-100 transition-opacity"></i>
                                </button>
                            </div>
                        </div>

                        <!-- 2. PRINT CONFIG -->
                        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
                            <div class="flex justify-between items-center">
                                <h3 class="font-bold text-slate-800 flex items-center gap-2 text-base">
                                    <div class="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><i class="fa-solid fa-print"></i></div>
                                    Cấu hình In ấn
                                </h3>
                                <button (click)="savePrintConfig()" class="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-blue-700 transition shadow-sm">Lưu</button>
                            </div>
                            
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
                                <textarea [(ngModel)]="printConfig().footerText" rows="2" class="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white focus:border-purple-500 outline-none resize-none transition" placeholder="Nội dung chân trang..."></textarea>
                            </div>
                        </div>

                    </div>

                    <!-- RIGHT COLUMN -->
                    <div class="space-y-6">
                        
                        <!-- 3. SYSTEM & VERSION -->
                        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
                            <h3 class="font-bold text-slate-800 flex items-center gap-2 text-base">
                                <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><i class="fa-solid fa-sliders"></i></div>
                                Phiên bản & Bảo trì
                            </h3>
                            <div class="flex gap-2 items-end">
                                <div class="flex-1">
                                    <label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">System Version</label>
                                    <input [formControl]="versionControl" class="w-full border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition">
                                </div>
                                <button (click)="saveVersion()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm h-[34px]">Cập nhật</button>
                            </div>
                        </div>

                        <!-- 4. SECURITY & BACKUP (Includes Rules) -->
                        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
                            <h3 class="font-bold text-slate-800 flex items-center gap-2 text-base">
                                <div class="w-8 h-8 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center"><i class="fa-solid fa-shield-cat"></i></div>
                                An toàn Dữ liệu
                            </h3>
                            
                            <div class="grid grid-cols-2 gap-2">
                                <button (click)="exportData()" class="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 text-xs font-bold text-slate-600 transition">
                                    <i class="fa-solid fa-download"></i> Backup JSON
                                </button>
                                <label class="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 text-xs font-bold text-slate-600 transition cursor-pointer">
                                    <i class="fa-solid fa-upload"></i> Restore JSON
                                    <input type="file" class="hidden" accept=".json" (change)="importData($event)">
                                </label>
                            </div>

                            <div class="relative mt-2">
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-[10px] font-bold text-slate-400 uppercase">Firestore Rules (Config)</span>
                                    <button (click)="copyRules()" class="text-[10px] text-blue-600 font-bold hover:underline">Copy</button>
                                </div>
                                <textarea readonly class="w-full h-24 bg-slate-800 text-green-400 font-mono text-[9px] p-2 rounded-lg focus:outline-none resize-none leading-relaxed" spellcheck="false">{{firestoreRules()}}</textarea>
                            </div>
                        </div>

                        <!-- 5. RESOURCES (Compact) -->
                        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
                            <div class="flex justify-between items-center">
                                <h3 class="font-bold text-slate-800 flex items-center gap-2 text-base">
                                    <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><i class="fa-solid fa-hard-drive"></i></div>
                                    Tài nguyên
                                </h3>
                                <button (click)="loadUsage()" class="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600"><i class="fa-solid fa-rotate"></i> Check</button>
                            </div>
                            @if(storageEstimate(); as stat) {
                                <div class="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <div class="text-xs font-bold text-slate-500">Tổng Documents</div>
                                    <div class="text-sm font-black text-slate-800">{{stat.totalDocs}}</div>
                                </div>
                            }
                        </div>

                    </div>

                    <!-- BOTTOM: DANGER ZONE -->
                    <div class="md:col-span-2 bg-red-50 rounded-2xl border border-red-100 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl"><i class="fa-solid fa-triangle-exclamation"></i></div>
                            <div>
                                <h3 class="font-bold text-red-800">Vùng Nguy Hiểm</h3>
                                <p class="text-xs text-red-600">Các hành động dưới đây không thể hoàn tác. Hãy cẩn trọng.</p>
                            </div>
                        </div>
                        <button (click)="resetDefaults()" class="px-5 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white rounded-xl font-bold text-sm transition shadow-sm">
                            <i class="fa-solid fa-eraser mr-1"></i> Xóa Sạch Dữ Liệu (Wipe All)
                        </button>
                    </div>

                </div>
            }

            @if (activeTab() === 'safety') {
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in items-start">
                    
                    <!-- Safety Config Card -->
                    <div class="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6">
                        <div class="flex justify-between items-center">
                            <div>
                                <h3 class="font-bold text-slate-800 flex items-center gap-2 text-base">
                                    <div class="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center"><i class="fa-solid fa-percent"></i></div>
                                    Quy định Hao hụt (Safety Margin)
                                </h3>
                                <p class="text-xs text-slate-500 mt-1">Cấu hình tỷ lệ hao hụt tự động dựa trên phân loại hóa chất.</p>
                            </div>
                            <button (click)="saveSafety()" class="px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 rounded-lg text-xs font-bold transition shadow-sm flex items-center gap-2">
                                <i class="fa-solid fa-floppy-disk"></i> Lưu Cấu hình
                            </button>
                        </div>

                        <!-- Default Margin -->
                        <div class="bg-orange-50/50 p-4 rounded-xl border border-orange-100 flex items-center justify-between">
                            <div>
                                <label class="text-xs font-bold text-slate-700 uppercase block mb-1">Mức Hao hụt Mặc định</label>
                                <p class="text-[10px] text-slate-500">Áp dụng cho các loại không có quy tắc riêng.</p>
                            </div>
                            <div class="relative w-24">
                                <input type="number" [(ngModel)]="safetyConfigLocal.defaultMargin" class="w-full pl-3 pr-8 py-2 border border-orange-200 rounded-lg font-bold text-slate-700 text-center outline-none focus:ring-2 focus:ring-orange-200 transition">
                                <span class="absolute right-3 top-2 text-xs font-bold text-orange-400">%</span>
                            </div>
                        </div>

                        <!-- Category Rules Table -->
                        <div>
                            <div class="flex justify-between items-center mb-3">
                                <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Quy tắc chi tiết theo Loại (Category)</h4>
                                <button (click)="addSafetyRule()" class="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg font-bold transition">+ Thêm Quy tắc</button>
                            </div>
                            
                            <div class="border border-slate-200 rounded-xl overflow-hidden">
                                <table class="w-full text-sm text-left">
                                    <thead class="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">
                                        <tr>
                                            <th class="px-4 py-3">Loại Hóa chất (Category)</th>
                                            <th class="px-4 py-3 w-32 text-center">Mức Hao hụt</th>
                                            <th class="px-4 py-3 w-16"></th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100">
                                        @for (rule of safetyRulesLocal(); track $index) {
                                            <tr class="hover:bg-slate-50 transition group">
                                                <td class="px-4 py-2">
                                                    <input [(ngModel)]="rule.category" list="catOptions" class="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-orange-300 rounded px-2 py-1 outline-none text-xs font-bold text-slate-700" placeholder="VD: reagent, standard...">
                                                    <datalist id="catOptions">
                                                        <option value="reagent">Hóa chất (reagent)</option>
                                                        <option value="standard">Chất chuẩn (standard)</option>
                                                        <option value="solvent">Dung môi (solvent)</option>
                                                        <option value="consumable">Vật tư (consumable)</option>
                                                        <option value="kit">Kit xét nghiệm (kit)</option>
                                                    </datalist>
                                                </td>
                                                <td class="px-4 py-2 text-center">
                                                    <div class="relative mx-auto w-20">
                                                        <input type="number" [(ngModel)]="rule.margin" class="w-full pl-2 pr-6 py-1 border border-slate-200 rounded text-center text-xs font-bold outline-none focus:border-orange-400">
                                                        <span class="absolute right-2 top-1 text-[10px] font-bold text-slate-400">%</span>
                                                    </div>
                                                </td>
                                                <td class="px-4 py-2 text-center">
                                                    <button (click)="removeSafetyRule($index)" class="text-slate-300 hover:text-red-500 transition"><i class="fa-solid fa-trash"></i></button>
                                                </td>
                                            </tr>
                                        }
                                        @if(safetyRulesLocal().length === 0) {
                                            <tr><td colspan="3" class="p-6 text-center text-slate-400 italic text-xs">Chưa có quy tắc riêng. Hệ thống sẽ dùng mức mặc định.</td></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Helper / Info Panel -->
                    <div class="bg-indigo-50/50 rounded-2xl border border-indigo-100 p-6">
                        <h4 class="font-bold text-indigo-800 text-sm mb-3 flex items-center gap-2">
                            <i class="fa-solid fa-circle-info"></i> Hướng dẫn
                        </h4>
                        <ul class="text-xs text-slate-600 space-y-3 list-disc pl-4">
                            <li>
                                <b>Mức mặc định:</b> Được áp dụng cho tất cả các chất không thuộc danh sách quy tắc riêng.
                            </li>
                            <li>
                                <b>Auto Mode:</b> Khi chạy Calculator hoặc Smart Batch, nếu bạn chọn chế độ hao hụt là "Auto" (hoặc để trống), hệ thống sẽ tra cứu bảng này.
                            </li>
                            <li>
                                <b>Gợi ý thiết lập:</b>
                                <ul class="list-circle pl-4 mt-1 space-y-1 text-slate-500">
                                    <li><i>Standard (Chất chuẩn):</i> 2% (Vì đắt tiền).</li>
                                    <li><i>Solvent (Dung môi):</i> 15-20% (Do bay hơi).</li>
                                    <li><i>Reagent (Hóa chất thường):</i> 10%.</li>
                                </ul>
                            </li>
                        </ul>
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
  router = inject(Router);
  
  versionControl = new FormControl(''); 
  
  printConfig = this.state.printConfig;
  
  activeTab = signal<'general' | 'users' | 'safety'>('general');
  loadingHealth = signal(false);
  healthItems = signal<HealthCheckItem[]>([]);
  storageEstimate = signal<{ totalDocs: number, estimatedSizeKB: number, details: any } | null>(null);
  
  // Safety Config State
  safetyConfigLocal = { defaultMargin: 10, rules: {} as Record<string, number> };
  safetyRulesLocal = signal<{category: string, margin: number}[]>([]);

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
        
        // PUBLIC ACCESS for QR Login Handshake (Temporary Sessions)
        match /auth_sessions/{sessionId} {
           allow read, write: if true;
        }

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
          this.versionControl.setValue(this.state.systemVersion()); 
          this.loadUsers();
          
          // Hydrate safety config from state signal
          const sVal = this.state.safetyConfig();
          this.safetyConfigLocal = { 
              defaultMargin: sVal.defaultMargin, 
              rules: { ...sVal.rules } 
          };
          this.safetyRulesLocal.set(
              Object.entries(sVal.rules).map(([category, margin]) => ({ category, margin }))
          );
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
      // Kept method but removed UI to simplify as requested, logic remains if needed later
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

  async resetDefaults() {
      if(await this.confirmationService.confirm({ message: 'XÓA SẠCH toàn bộ dữ liệu? Không thể hoàn tác.', confirmText: 'Xóa Sạch', isDangerous: true })) {
          await this.fb.resetToDefaults();
          this.toast.show('Đã xóa sạch dữ liệu.', 'info');
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

  // --- SAFETY CONFIG METHODS ---
  addSafetyRule() {
      this.safetyRulesLocal.update(r => [...r, { category: '', margin: 10 }]);
  }

  removeSafetyRule(index: number) {
      this.safetyRulesLocal.update(r => r.filter((_, i) => i !== index));
  }

  saveSafety() {
      const rulesObj: Record<string, number> = {};
      this.safetyRulesLocal().forEach(item => {
          if (item.category && item.category.trim()) {
              rulesObj[item.category.trim()] = item.margin;
          }
      });
      
      const config = {
          defaultMargin: this.safetyConfigLocal.defaultMargin,
          rules: rulesObj
      };
      
      this.state.saveSafetyConfig(config);
      this.toast.show('Đã lưu cấu hình định mức.');
  }
}
