import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../core/services/firebase.service';
import { ToastService } from '../../../core/services/toast.service';
import { StateService } from '../../../core/services/state.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { CategoryItem } from '../../../core/models/config.model';
import { InventoryService } from '../../inventory/inventory.service';
import { StandardService } from '../../standards/standard.service';
import { collection, getDocs, writeBatch, doc, query, where } from 'firebase/firestore';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-config-general',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start animate-fade-in">
        
        <!-- LEFT COLUMN -->
        <div class="space-y-6">
            
            <!-- 1. MASTER DATA -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-4">
                <h3 class="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-base">
                    <div class="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 flex items-center justify-center"><i class="fa-solid fa-layer-group"></i></div>
                    Danh mục Gốc (Master Data)
                </h3>
                <div class="grid gap-3">
                    <button (click)="router.navigate(['/master-targets'])" class="w-full py-3 px-4 border border-teal-200 dark:border-teal-800/30 bg-teal-50 dark:bg-teal-900/10 text-teal-800 dark:text-teal-300 rounded-xl font-bold text-sm hover:bg-teal-100 dark:hover:bg-teal-900/30 transition flex items-center justify-between group">
                        <span class="flex items-center gap-2"><i class="fa-solid fa-book-medical"></i> Thư viện Chỉ tiêu Gốc</span>
                        <i class="fa-solid fa-arrow-right opacity-50 group-hover:opacity-100 transition-opacity"></i>
                    </button>
                    <button (click)="router.navigate(['/target-groups'])" class="w-full py-3 px-4 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition flex items-center justify-between group">
                        <span class="flex items-center gap-2"><i class="fa-solid fa-list-check"></i> Bộ Chỉ tiêu (Groups)</span>
                        <i class="fa-solid fa-arrow-right opacity-50 group-hover:opacity-100 transition-opacity"></i>
                    </button>
                </div>
            </div>

            <!-- 1.5. CATEGORIES CONFIG -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-4">
                <div class="flex justify-between items-center">
                    <h3 class="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-base">
                        <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center"><i class="fa-solid fa-tags"></i></div>
                        Phân loại (Categories)
                    </h3>
                    <button (click)="saveCategories()" class="text-xs bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold transition shadow-sm dark:shadow-none">Lưu</button>
                </div>
                
                <div class="flex flex-col gap-2">
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Danh sách (Mã : Tên hiển thị)</span>
                        <button (click)="addCategory()" class="text-[9px] bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 px-2 py-1 rounded font-bold transition">+ Thêm</button>
                    </div>
                    <div class="text-[10px] text-slate-500 dark:text-slate-400 mb-2 italic">Cảnh báo: Nếu đổi mã ID, dữ liệu cũ sẽ không bị mất dữ liệu nhưng cần cập nhật hàng loạt để hiển thị đúng nhóm (Khuyên dùng: Chỉ sửa Label).</div>
                    
                    <div class="space-y-2 border border-slate-100 dark:border-slate-700/50 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-900/20">
                        @for (cat of categoriesLocal(); track $index) {
                            <div class="flex gap-2 items-center group">
                                <input [(ngModel)]="cat.id" class="w-1/3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded px-2 py-1 text-xs font-mono font-bold text-slate-600 dark:text-slate-400 outline-none focus:border-blue-400 dark:focus:border-blue-500 transition" placeholder="ID (VD: reagent)">
                                <input [(ngModel)]="cat.name" class="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded px-2 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none focus:border-blue-400 dark:focus:border-blue-500 transition" placeholder="Tên hiển thị (VD: Hóa chất)">
                                <button (click)="removeCategory($index)" class="w-6 h-6 flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><i class="fa-solid fa-trash text-[10px]"></i></button>
                            </div>
                        }
                    </div>
                </div>
            </div>

            <!-- 2. PRINT CONFIG -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-4">
                <div class="flex justify-between items-center">
                    <h3 class="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-base">
                        <div class="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center"><i class="fa-solid fa-print"></i></div>
                        Cấu hình In ấn
                    </h3>
                    <button (click)="savePrintConfig()" class="text-xs bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold transition shadow-sm dark:shadow-none">Lưu</button>
                </div>
                
                <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                    <div>
                        <div class="text-xs font-bold text-slate-700 dark:text-slate-300">Hiển thị Khung Ký Tên</div>
                        <div class="text-[10px] text-slate-400 dark:text-slate-500">Thêm mục "Xác nhận / Ký tên" vào cuối phiếu</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" [(ngModel)]="printConfig().showSignature" class="sr-only peer">
                        <div class="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-slate-600 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600 dark:peer-checked:bg-purple-500"></div>
                    </label>
                </div>

                <div>
                    <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Footer Text (Cam kết cuối phiếu)</label>
                    <textarea [(ngModel)]="printConfig().footerText" rows="2" class="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 focus:bg-white dark:focus:bg-slate-800 focus:border-purple-500 dark:focus:border-purple-500 outline-none resize-none transition" placeholder="Nội dung chân trang..."></textarea>
                </div>
            </div>

        </div>

        <!-- RIGHT COLUMN -->
        <div class="space-y-6">
            
            <!-- 3. SYSTEM & AVATAR -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-4">
                <h3 class="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-base">
                    <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center"><i class="fa-solid fa-sliders"></i></div>
                    Giao diện & Phiên bản
                </h3>
                
                <!-- Avatar Style Selector -->
                <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                    <div>
                        <div class="text-xs font-bold text-slate-700 dark:text-slate-300">Phong cách Avatar</div>
                        <div class="text-[10px] text-slate-400 dark:text-slate-500">Thay đổi icon mặc định cho user</div>
                    </div>
                    <select [ngModel]="state.avatarStyle()" (ngModelChange)="saveAvatarStyle($event)" 
                            class="text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1 outline-none focus:border-blue-500 dark:focus:border-blue-500 cursor-pointer">
                        <option value="google">📷 Ảnh Google (Chất lượng cao)</option>
                        <option value="initials">🔤 Chữ cái (Letters)</option>
                        <option value="identicon">🔷 Hình học (Identicon)</option>
                        <option value="bottts">🤖 Robot (Bottts)</option>
                        <option value="shapes">🎨 Nghệ thuật (Shapes)</option>
                        <option value="avataaars">🧑 Hoạt hình (Avatars)</option>
                    </select>
                </div>

                <div class="flex gap-2 items-end">
                    <div class="flex-1">
                        <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">System Version</label>
                        <input [formControl]="versionControl" class="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-500 transition">
                    </div>
                    <button (click)="saveVersion()" class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm dark:shadow-none h-[34px]">Cập nhật</button>
                </div>
            </div>

            <!-- 4. SECURITY & BACKUP (Includes Rules) -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-4">
                <h3 class="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-base">
                    <div class="w-8 h-8 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-slate-300 flex items-center justify-center"><i class="fa-solid fa-shield-cat"></i></div>
                    An toàn Dữ liệu
                </h3>
                
                <div class="grid grid-cols-2 gap-2">
                    <button (click)="exportData()" class="p-2 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center justify-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 transition">
                        <i class="fa-solid fa-download"></i> Backup JSON
                    </button>
                    <label class="p-2 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center justify-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 transition cursor-pointer">
                        <i class="fa-solid fa-upload"></i> Restore JSON
                        <input type="file" class="hidden" accept=".json" (change)="importData($event)">
                    </label>
                </div>

                <div class="relative mt-2">
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Firestore Rules (Config)</span>
                        <button (click)="copyRules()" class="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline">Copy</button>
                    </div>
                    <textarea readonly class="w-full h-24 bg-slate-800 dark:bg-slate-900 text-green-400 dark:text-green-500 font-mono text-[9px] p-2 rounded-lg focus:outline-none resize-none leading-relaxed" spellcheck="false">{{firestoreRules()}}</textarea>
                </div>

                <!-- Recycle Bin -->
                <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <div class="flex flex-col gap-2 p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-xl">
                        <div class="flex justify-between items-center">
                            <div>
                                <div class="text-[11px] font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2 uppercase tracking-wide">
                                    <i class="fa-solid fa-trash-can-arrow-up"></i> Thùng Rác (Recycle Bin - Soft Delete)
                                </div>
                                <div class="text-[10px] text-rose-600/70 dark:text-rose-400/80 mt-1">Dữ liệu được giữ trên mây để phòng ngừa rủi ro. Quản trị viên có thể "Xóa vĩnh viễn" để làm sạch.</div>
                            </div>
                            <button (click)="openRecycleBin()" class="bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-800 transition shadow-sm">
                                Mở Thùng Rác
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 5. RESOURCES (Compact) -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-4">
                <div class="flex justify-between items-center">
                    <h3 class="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-base">
                        <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center"><i class="fa-solid fa-hard-drive"></i></div>
                        Tài nguyên
                    </h3>
                    <button (click)="loadUsage()" class="text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 px-2 py-1 rounded text-slate-600 dark:text-slate-300"><i class="fa-solid fa-rotate"></i> Check</button>
                </div>
                @if(storageEstimate(); as stat) {
                    <div class="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <div class="text-xs font-bold text-slate-500 dark:text-slate-400">Tổng Documents</div>
                        <div class="text-sm font-black text-slate-800 dark:text-slate-100">{{stat.totalDocs}}</div>
                    </div>
                }
            </div>

            <!-- 6. DATA ARCHIVER -->
            <div class="bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-200 dark:border-rose-900/30 p-6 flex flex-col gap-4">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-bold text-rose-800 dark:text-rose-400 flex items-center gap-2 text-base">
                            <div class="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 flex items-center justify-center">
                                <i class="fa-solid fa-boxes-packing"></i>
                            </div>
                            Kho Lưu trữ & Phục hồi
                        </h3>
                        <p class="text-[10px] text-rose-600/80 dark:text-rose-400/80 mt-1">Xuất dữ liệu cũ ra Excel và xóa khỏi Firebase để bảo vệ 1GB dung lượng.</p>
                    </div>
                    <label class="text-[10px] bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-bold transition flex items-center gap-2 cursor-pointer shadow-sm">
                        <i class="fa-solid fa-cloud-arrow-up text-blue-500"></i> Nạp lại Excel
                        <input type="file" class="hidden" accept=".xlsx" (change)="importArchiverData($event)">
                    </label>
                </div>
                
                <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-slate-600 dark:text-slate-400">Dọn bản ghi cũ hơn:</span>
                    <select [(ngModel)]="archiverDays" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-bold outline-none cursor-pointer">
                        <option [value]="90">3 Tháng (90 ngày)</option>
                        <option [value]="180">6 Tháng (180 ngày)</option>
                        <option [value]="365">1 Năm (365 ngày)</option>
                        <option [value]="730">2 Năm (730 ngày)</option>
                    </select>
                </div>

                @if(archiverStatus() === 'idle') {
                    <button (click)="fetchArchiverData()" class="w-full py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2">
                        <i class="fa-solid fa-file-excel text-green-400"></i> Bắt đầu Trích xuất
                    </button>
                } @else if(archiverStatus() === 'fetching') {
                    <button disabled class="w-full py-2 bg-slate-300 dark:bg-slate-800 text-slate-500 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-wait">
                        <i class="fa-solid fa-spinner fa-spin"></i> Đang tải dữ liệu...
                    </button>
                } @else if(archiverStatus() === 'exporting') {
                    <button disabled class="w-full py-2 bg-slate-300 dark:bg-slate-800 text-slate-500 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-wait">
                        <i class="fa-solid fa-spinner fa-spin"></i> Đang tạo file Excel...
                    </button>
                } @else if(archiverStatus() === 'deleting') {
                    <button disabled class="w-full py-2 bg-red-300 dark:bg-red-900/50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-wait">
                        <i class="fa-solid fa-spinner fa-spin"></i> Đang dọn dẹp hệ thống...
                    </button>
                } @else if(archiverStatus() === 'restoring') {
                    <button disabled class="w-full py-2 bg-blue-300 dark:bg-blue-900/50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-wait">
                        <i class="fa-solid fa-spinner fa-spin"></i> Đang nạp lại dữ liệu...
                    </button>
                } @else if(archiverStatus() === 'ready_to_delete') {
                    <div class="bg-white dark:bg-slate-800 rounded-xl p-3 border border-rose-200 dark:border-rose-900/50 text-center">
                        <p class="text-xs font-bold text-green-600 dark:text-green-400 mb-2">Đã lưu file Excel thành công!</p>
                        <p class="text-[10px] text-slate-500 dark:text-slate-400 mb-3">Sẵn sàng dọn dẹp {{archiverData().logs.length + archiverData().requests.length}} bản ghi.</p>
                        <div class="flex gap-2">
                            <button (click)="cancelArchiver()" class="flex-1 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition">Hủy</button>
                            <button (click)="confirmDeleteArchiver()" class="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2">
                                <i class="fa-solid fa-trash-can"></i> Xóa Vĩnh viễn
                            </button>
                        </div>
                    </div>
                }

            </div>

        </div>

    </div>

    <!-- RECYCLE BIN MODAL -->
    @if (showRecycleBin()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm animate-fade-in" style="z-index: 100;">
            <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
                <!-- Modal Header -->
                <div class="px-6 py-4 border-b border-rose-100 dark:border-rose-900/30 flex justify-between items-center bg-rose-50/50 dark:bg-rose-900/10">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-800/50">
                            <i class="fa-solid fa-trash-can-arrow-up text-lg"></i>
                        </div>
                        <div>
                            <h3 class="text-base font-black text-rose-800 dark:text-rose-300">Thùng rác Dữ liệu (Soft Deleted)</h3>
                            <p class="text-[10px] font-bold text-rose-500/80 dark:text-rose-400/80">Khôi phục thao tác lỗi hoặc Xóa vĩnh viễn để làm sạch hệ thống.</p>
                        </div>
                    </div>
                    <button (click)="showRecycleBin.set(false)" class="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                
                <!-- Modal Body -->
                <div class="p-6 overflow-y-auto custom-scrollbar flex-1 relative bg-slate-50/30 dark:bg-slate-900/20">
                    @if(isRecycling()) {
                        <div class="absolute inset-0 z-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex flex-col items-center justify-center text-rose-600 dark:text-rose-400">
                            <i class="fa-solid fa-circle-notch fa-spin text-4xl mb-3"></i>
                            <span class="text-sm font-bold">Đang xử lý dữ liệu hệ thống...</span>
                        </div>
                    }

                    <table class="w-full text-sm text-left border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                        <thead class="bg-slate-100 dark:bg-slate-800/50 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                            <tr>
                                <th class="px-4 py-3">Loại Module</th>
                                <th class="px-4 py-3">Mã ID</th>
                                <th class="px-4 py-3 text-center">Tên hiển thị / Thông tin</th>
                                <th class="px-4 py-3 text-center w-32">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                            @for (item of recycleItems(); track $index) {
                                <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                                    <td class="px-4 py-3 align-middle font-bold text-[10px]">
                                        @if(item.type === 'inventory') {
                                            <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md">Hóa chất (Kho)</span>
                                        } @else {
                                            <span class="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-md">Chuẩn đối chiếu</span>
                                        }
                                    </td>
                                    <td class="px-4 py-3 font-mono text-[10px] font-bold text-slate-600 dark:text-slate-400">{{item.id}}</td>
                                    <td class="px-4 py-3">
                                        <div class="text-xs font-bold text-slate-800 dark:text-slate-200 text-center">{{item.name}}</div>
                                    </td>
                                    <td class="px-4 py-3 justify-center flex gap-2">
                                        <button (click)="restoreRecycleItem(item)" class="w-8 h-8 rounded bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 hover:bg-teal-600 hover:text-white transition flex items-center justify-center font-bold shadow-sm" title="Khôi phục (Restore)">
                                            <i class="fa-solid fa-rotate-left"></i>
                                        </button>
                                    </td>
                                </tr>
                            }
                            @if (recycleItems().length === 0) {
                                <tr>
                                    <td colspan="4" class="p-12 text-center text-slate-400 dark:text-slate-500 italic text-sm">
                                        <i class="fa-solid fa-leaf text-2xl text-emerald-400 mb-3 block opacity-80"></i>
                                        Không có dự liệu rác nào. Hệ thống đang cực kỳ sạch sẽ!
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>

                <!-- Modal Footer -->
                <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row justify-between gap-4 items-center">
                    <div class="text-[10px] text-slate-500 dark:text-slate-400 font-bold md:w-1/2 leading-relaxed">
                        <i class="fa-solid fa-triangle-exclamation text-orange-500 mr-1"></i> Tính năng Dọn rác sẽ <span class="text-rose-500">XÓA CỨNG (DeleteDoc)</span> toàn bộ danh sách ở trên khỏi Cloud và ép các nhân viên khác làm mới (F5) toàn bộ ứng dụng. 
                    </div>
                    <div class="flex gap-2 w-full md:w-auto shrink-0">
                        <button (click)="showRecycleBin.set(false)" class="flex-1 md:flex-none px-4 py-2 bg-white dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl transition shadow-sm">Đóng</button>
                        <button [disabled]="recycleItems().length === 0" (click)="emptyRecycleBin()" class="flex-1 md:flex-none px-6 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-2">
                            <i class="fa-solid fa-fire"></i> Dọn Rác & Ép Lắp Ráp (Force Sync)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }
  `
})
export class ConfigGeneralComponent implements OnInit {
  fb = inject(FirebaseService);
  state = inject(StateService);
  toast = inject(ToastService);
  confirmationService = inject(ConfirmationService);
  inventoryService = inject(InventoryService);
  standardService = inject(StandardService);
  router = inject(Router);

  versionControl = new FormControl(''); 
  printConfig = this.state.printConfig;
  
  categoriesLocal = signal<CategoryItem[]>([]);
  storageEstimate = signal<{ totalDocs: number, estimatedSizeKB: number, details: any } | null>(null);

  archiverDays = signal<number>(180);
  archiverStatus = signal<'idle' | 'fetching' | 'exporting' | 'ready_to_delete' | 'deleting' | 'restoring'>('idle');
  archiverData = signal<{logs: any[], requests: any[]}>({logs: [], requests: []});

  showRecycleBin = signal<boolean>(false);
  recycleItems = signal<any[]>([]);
  isRecycling = signal<boolean>(false);

  firestoreRules = computed(() => {
    const appId = this.fb.APP_ID;
    return `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isManager() { 
      return exists(/databases/$(database)/documents/artifacts/${appId}/users/$(request.auth.uid)) && 
             get(/databases/$(database)/documents/artifacts/${appId}/users/$(request.auth.uid)).data.role == 'manager'; 
    }
    match /artifacts/${appId} {
        match /auth_sessions/{sessionId} { allow read, write: if true; }
        match /users/{userId} { allow read: if request.auth != null; allow write: if isManager() || request.auth.uid == userId; }
        match /recipes/{recipeId} { allow read, write: if request.auth != null; }
        match /print_jobs/{jobId} { allow read, write: if request.auth != null; }
        match /{document=**} { allow read, write: if request.auth != null; }
    }
  }
}`;
  });

  ngOnInit() {
    this.versionControl.setValue(this.state.systemVersion()); 
    this.categoriesLocal.set(JSON.parse(JSON.stringify(this.state.categories())));
  }

  async saveVersion() {
      const val = this.versionControl.value;
      if (val) {
          await this.state.saveSystemVersion(val);
          this.toast.show('Đã cập nhật phiên bản!');
      }
  }

  async saveAvatarStyle(style: string) {
      await this.state.saveAvatarStyle(style);
      this.toast.show('Đã cập nhật giao diện Avatar!');
  }

  async loadUsage() {
      try {
          const estimate = await this.fb.getStorageEstimate();
          this.storageEstimate.set(estimate);
      } catch (e) { this.toast.show('Lỗi tính dung lượng.', 'error'); }
  }

  savePrintConfig() { this.state.savePrintConfig(this.printConfig()); }
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

  addCategory() { this.categoriesLocal.update(c => [...c, { id: '', name: '' }]); }
  removeCategory(index: number) { this.categoriesLocal.update(c => c.filter((_, i) => i !== index)); }
  async saveCategories() {
      const validCategories = this.categoriesLocal().filter(c => c.id && c.id.trim() && c.name && c.name.trim());
      if (validCategories.length === 0) {
          this.toast.show('Phân loại không được để trống hoàn toàn.', 'error');
          return;
      }
      await this.state.saveCategoriesConfig(validCategories);
      this.toast.show('Đã cập nhật danh mục phân loại.', 'success');
  }

  async fetchArchiverData() {
    this.archiverStatus.set('fetching');
    try {
      const logs = await this.fb.fetchOldData('logs', this.archiverDays());
      const requests = await this.fb.fetchOldData('requests', this.archiverDays());
      
      this.archiverData.set({logs, requests});
      
      if (logs.length === 0 && requests.length === 0) {
        this.toast.show('Không có dữ liệu cũ nào được tìm thấy.', 'info');
        this.archiverStatus.set('idle');
        return;
      }
      
      this.exportArchiverToExcel(logs, requests);
      
    } catch (e) {
      this.toast.show('Lỗi khi tải dữ liệu cũ.', 'error');
      this.archiverStatus.set('idle');
    }
  }

  private exportArchiverToExcel(logs: any[], requests: any[]) {
    this.archiverStatus.set('exporting');
    try {
      const wb = XLSX.utils.book_new();
      if (logs.length > 0) {
        const wsLogs = XLSX.utils.json_to_sheet(logs);
        XLSX.utils.book_append_sheet(wb, wsLogs, "Logs");
      }
      if (requests.length > 0) {
        const wsReqs = XLSX.utils.json_to_sheet(requests);
        XLSX.utils.book_append_sheet(wb, wsReqs, "Requests");
      }
      
      const fileName = `LIMS_Archive_${this.archiverDays()}days_${new Date().getTime()}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      this.archiverStatus.set('ready_to_delete');
    } catch (e) {
      this.toast.show('Lỗi khi tạo file Excel.', 'error');
      this.archiverStatus.set('idle');
    }
  }

  cancelArchiver() {
      this.archiverStatus.set('idle');
      this.archiverData.set({logs: [], requests: []});
  }

  async confirmDeleteArchiver() {
    const data = this.archiverData();
    if (data.logs.length === 0 && data.requests.length === 0) return;
    
    const count = data.logs.length + data.requests.length;
    if (!await this.confirmationService.confirm({
      message: `CẢNH BÁO: Tác vụ này sẽ XÓA VĨNH VIỄN ${count} bản ghi cũ khỏi Firebase. Bạn CHẮC CHẮN MÌNH ĐÃ TẢI LƯU TRỮ CHƯA?`,
      confirmText: 'XÓA THẬT KỸ',
      isDangerous: true
    })) return;

    this.archiverStatus.set('deleting');
    try {
      if (data.logs.length > 0) {
        await this.fb.deleteDocsInBatch('logs', data.logs.map(d => d.id));
      }
      if (data.requests.length > 0) {
        await this.fb.deleteDocsInBatch('requests', data.requests.map(d => d.id));
      }
      this.toast.show(`Thành công! Đã dọn dẹp ${count} bản ghi cũ rác.`, 'success');
      this.archiverStatus.set('idle');
      this.archiverData.set({logs: [], requests: []});
      this.loadUsage(); // Cập nhật lại số liệu
    } catch (e) {
      this.toast.show('Lỗi khi xóa dữ liệu.', 'error');
      this.archiverStatus.set('ready_to_delete');
    }
  }

  async importArchiverData(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!await this.confirmationService.confirm({
        message: `Bạn chuẩn bị khôi phục lại dữ liệu từ File Excel: ${file.name}. Quá trình này sẽ nạp lại các bản ghi cũ lên hệ thống (có thể tốn thời gian). Bạn chắc chắn chứ?`,
        confirmText: 'Bắt đầu Nạp'
    })) {
        event.target.value = '';
        return;
    }

    this.archiverStatus.set('restoring');

    const reader = new FileReader();
    reader.onload = async (e: any) => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            let logsToRestore: any[] = [];
            let reqsToRestore: any[] = [];

            if (workbook.SheetNames.includes('Logs')) {
                const ws = workbook.Sheets['Logs'];
                logsToRestore = XLSX.utils.sheet_to_json(ws);
            }
            if (workbook.SheetNames.includes('Requests')) {
                const ws = workbook.Sheets['Requests'];
                reqsToRestore = XLSX.utils.sheet_to_json(ws);
            }

            if (logsToRestore.length === 0 && reqsToRestore.length === 0) {
                this.toast.show('Không tìm thấy dữ liệu hợp lệ trong file Excel.', 'error');
                this.archiverStatus.set('idle');
                return;
            }

            let restoredCount = 0;
            if (logsToRestore.length > 0) {
                restoredCount += await this.fb.restoreArchivedData('logs', logsToRestore);
            }
            if (reqsToRestore.length > 0) {
                restoredCount += await this.fb.restoreArchivedData('requests', reqsToRestore);
            }

            this.toast.show(`Thành công! Đã nạp lại ${restoredCount} bản ghi vào hệ thống.`, 'success');
            this.archiverStatus.set('idle');
            this.loadUsage();

        } catch (err) {
            this.toast.show('Lỗi định dạng File Excel.', 'error');
            this.archiverStatus.set('idle');
        } finally {
            event.target.value = '';
        }
    };
    reader.onerror = () => {
        this.toast.show('Không thể đọc file.', 'error');
        this.archiverStatus.set('idle');
        event.target.value = '';
    }
    reader.readAsArrayBuffer(file);
  }

  async openRecycleBin() {
      this.isRecycling.set(true);
      this.showRecycleBin.set(true);
      this.recycleItems.set([]);

      try {
          const inventoryRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/inventory`);
          const standardsRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/reference_standards`);

          const [invSnap, stdSnap] = await Promise.all([
              getDocs(query(inventoryRef, where('_isDeleted', '==', true))),
              getDocs(query(standardsRef, where('_isDeleted', '==', true)))
          ]);

          const results: any[] = [];
          invSnap.forEach((d: any) => results.push({ type: 'inventory', id: d.id, name: d.data()['name'] || '', lastUpdated: d.data()['lastUpdated'] || null }));
          stdSnap.forEach((d: any) => results.push({ type: 'standard', id: d.id, name: d.data()['name'] || '', lastUpdated: d.data()['lastUpdated'] || null }));

          results.sort((a, b) => {
              const ta = a.lastUpdated?.toMillis() || 0;
              const tb = b.lastUpdated?.toMillis() || 0;
              return tb - ta;
          });

          this.recycleItems.set(results);
      } catch (e) {
          console.error("Lỗi khi tải dữ liệu thùng rác:", e);
          this.toast.show('Không thể tải thùng rác do Firebase từ chối truy vấn. Cần index!', 'error');
      } finally {
          this.isRecycling.set(false);
      }
  }

  async restoreRecycleItem(item: any) {
      if (!await this.confirmationService.confirm({ message: `Bạn muốn khôi phục dữ liệu: ${item.name}?`, confirmText: 'Khôi phục' })) return;
      this.isRecycling.set(true);
      try {
          if (item.type === 'inventory') {
              await this.inventoryService.restoreItem(item.id);
          } else {
              await this.standardService.restoreStandard(item.id, item.name);
          }
          this.toast.show('Đã khôi phục thành công!');
          this.recycleItems.update(list => list.filter(i => i !== item));
          
          if (item.type === 'inventory') await this.fb.updateMetadata('inventory');
          if (item.type === 'standard') await this.fb.updateMetadata('standards');
      } catch (e) {
          console.error(e);
          this.toast.show('Lỗi khi khôi phục.', 'error');
      } finally {
          this.isRecycling.set(false);
      }
  }

  async emptyRecycleBin() {
      if (!await this.confirmationService.confirm({ message: 'Thao tác này là KHÔNG THỂ PHỤC HỒI. Nó gửi lệnh ÉP TOÀN BỘ NHÂN VIÊN bị Reset App. Tiếp tục?', confirmText: 'DỌN RÁC NGAY', isDangerous: true })) return;
      
      this.isRecycling.set(true);
      try {
          const BATCH_SIZE = 400;
          let batch = writeBatch(this.fb.db);
          let opCount = 0;
          
          const items = this.recycleItems();
          for (const item of items) {
              const path = item.type === 'inventory' ? `artifacts/${this.fb.APP_ID}/inventory/${item.id}` : `artifacts/${this.fb.APP_ID}/reference_standards/${item.id}`;
              batch.delete(doc(this.fb.db, path));
              opCount++;
              
              if (opCount >= BATCH_SIZE) { await batch.commit(); batch = writeBatch(this.fb.db); opCount = 0; }
          }
          if (opCount > 0) await batch.commit();
          
          await this.fb.adminForceSyncCache();
          
          this.toast.show('Đã xóa vĩnh viễn rác và phát tín hiệu F5.');
          this.recycleItems.set([]);
          setTimeout(() => this.showRecycleBin.set(false), 500);

      } catch (e) {
          console.error(e);
          this.toast.show('Lỗi dọn rác.', 'error');
          this.isRecycling.set(false);
      }
  }
}
