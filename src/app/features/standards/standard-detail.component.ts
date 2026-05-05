import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StandardService } from './standard.service';
import { AuthService, UserProfile } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { StateService } from '../../core/services/state.service';
import { ReferenceStandard, UsageLog, StandardRequest } from '../../core/models/standard.model';
import { formatNum, getAvatarUrl, getStandardStatus, getStorageInfo, getExpiryClass, getExpiryTimeLeft, canAssign } from '../../shared/utils/utils';

// Modals
import { StandardsFormModalComponent } from './components/standards-form-modal.component';
import { StandardsPrintModalComponent } from './components/standards-print-modal.component';
import { StandardsPurchaseModalComponent } from './components/standards-purchase-modal.component';
import { StandardsCoaModalComponent } from './components/standards-coa-modal.component';
import { StandardsAssignModalComponent } from './components/standards-assign-modal.component';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { GoogleDriveService } from '../../core/services/google-drive.service';
import { NotificationService } from '../../core/services/notification.service';
import { writeBatch, doc, deleteField } from 'firebase/firestore';

@Component({
  selector: 'app-standard-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, StandardsFormModalComponent, StandardsPrintModalComponent, StandardsPurchaseModalComponent, StandardsCoaModalComponent, StandardsAssignModalComponent],
  template: `
    <div class="flex flex-col h-full bg-slate-50 dark:bg-slate-900/50 p-2 md:p-4 gap-4 overflow-y-auto custom-scrollbar relative fade-in">
        
        <!-- Breadcrumb & Top Actions -->
        <div class="flex items-center justify-between shrink-0 mb-2">
            <button (click)="goBack()" class="flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition font-bold text-sm bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95 group">
                <i class="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
                Danh sách Chuẩn
            </button>
            <div class="flex items-center gap-2">
                @if(auth.canEditStandards()) {
                    <button (click)="openPrintModal()" [disabled]="!standard()" class="w-9 h-9 rounded-xl flex items-center justify-center bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition shadow-sm active:scale-95 disabled:opacity-50" title="In nhãn">
                        <i class="fa-solid fa-print"></i>
                    </button>
                    <button (click)="openEditModal()" [disabled]="!standard()" class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-xl shadow-md shadow-indigo-200 dark:shadow-none transition font-bold text-sm active:scale-95 disabled:opacity-50">
                        <i class="fa-solid fa-pen text-xs"></i> Chỉnh sửa
                    </button>
                }
            </div>
        </div>

        @if(isLoading()) {
            <!-- Loading Skeleton -->
            <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col gap-4 animate-pulse">
                <div class="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/3"></div>
                <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                <div class="flex gap-2 mt-4"><div class="h-6 bg-slate-200 dark:bg-slate-700 rounded w-16"></div><div class="h-6 bg-slate-200 dark:bg-slate-700 rounded w-20"></div></div>
            </div>
        } @else if(notFound() || !standard()) {
            <!-- Not Found State -->
            <div class="flex-1 flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm p-8 text-center">
                <div class="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-800 shadow-inner">
                    <i class="fa-solid fa-flask-vial text-3xl text-slate-300 dark:text-slate-600"></i>
                </div>
                <h2 class="text-xl font-black text-slate-800 dark:text-slate-200 mb-2">Không tìm thấy Chuẩn Đối Chiếu</h2>
                <p class="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">Dữ liệu có thể đã bị xóa hoặc đường dẫn không hợp lệ. Vui lòng kiểm tra lại.</p>
                <button (click)="goBack()" class="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-md active:scale-95">
                    Quay lại danh sách
                </button>
            </div>
        } @else {
            <ng-container *ngIf="standard() as std">
                
                <!-- HERO CARD -->
                <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-6 items-start md:items-center">
                    
                    <!-- Decorative Background -->
                    <div class="absolute -right-10 -top-10 text-indigo-50 dark:text-slate-700/30 opacity-50 pointer-events-none">
                        <i class="fa-solid fa-flask-vial text-[200px]"></i>
                    </div>

                    <div class="flex-1 z-10 w-full">
                        <div class="flex flex-wrap items-center gap-3 mb-3">
                            <span class="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border shadow-sm" [ngClass]="statusInfo().class">
                                <i class="fa-solid fa-circle text-[8px] mr-1.5" [class.animate-pulse]="std.status === 'IN_USE' || std.current_amount <= 0"></i>
                                {{statusInfo().label}}
                            </span>
                            @if(std.internal_id) { <span class="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-black border border-indigo-100 dark:border-indigo-800/50 shadow-sm"><i class="fa-solid fa-tag mr-1 opacity-70"></i> {{std.internal_id}}</span> }
                        </div>
                        
                        <h1 class="text-3xl md:text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight mb-1 break-words">
                            {{std.name}}
                        </h1>
                        @if(std.chemical_name) { <p class="text-base text-slate-500 dark:text-slate-400 italic font-medium mb-4">{{std.chemical_name}}</p> }
                        
                        <div class="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4 text-sm bg-slate-50 dark:bg-slate-900/50 w-fit p-3 px-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div class="flex flex-col">
                                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Lot Number</span>
                                <span class="font-mono font-bold text-slate-700 dark:text-slate-300 text-base cursor-pointer hover:text-indigo-600 transition" (click)="copyText(std.lot_number)" title="Click để copy">{{std.lot_number || 'N/A'}}</span>
                            </div>
                            <div class="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                            <div class="flex flex-col">
                                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Hãng SX</span>
                                <span class="font-bold text-slate-700 dark:text-slate-300 text-base">{{std.manufacturer || 'N/A'}}</span>
                            </div>
                            <div class="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                            <div class="flex flex-col">
                                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Product Code</span>
                                <span class="font-mono font-bold text-slate-700 dark:text-slate-300 text-base cursor-pointer hover:text-indigo-600 transition" (click)="copyText(std.product_code)" title="Click để copy">{{std.product_code || 'N/A'}}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="w-28 h-28 bg-white p-2 rounded-2xl shadow-md border border-slate-100 shrink-0 mx-auto md:mx-0 z-10 group relative">
                         <img [src]="qrCodeUrl()" class="w-full h-full object-contain mix-blend-multiply opacity-90 group-hover:opacity-100 transition" alt="QR Code">
                         <div class="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer backdrop-blur-sm" (click)="openPrintModal()">
                             <i class="fa-solid fa-print text-white text-2xl"></i>
                         </div>
                    </div>
                </div>

                <!-- MAIN CONTENT GRID -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    
                    <!-- COLUMN 1: TỒN KHO & BẢO QUẢN -->
                    <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col h-full">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center shadow-inner">
                                <i class="fa-solid fa-boxes-stacked text-lg"></i>
                            </div>
                            <h3 class="text-base font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">Tồn Kho & Bảo Quản</h3>
                        </div>

                        <div class="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 mb-6">
                            <div class="flex justify-between items-end mb-2">
                                <div>
                                    <span class="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Lượng hiện tại</span>
                                    <div class="flex items-baseline gap-1">
                                        <span class="text-4xl font-black text-emerald-600 dark:text-emerald-400 leading-none">{{formatNum(std.current_amount)}}</span>
                                        <span class="text-sm font-bold text-slate-500">{{std.unit}}</span>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <span class="text-[10px] font-bold text-slate-400 block mb-0.5">Lượng ban đầu</span>
                                    <span class="text-sm font-bold text-slate-600 dark:text-slate-300 font-mono">{{formatNum(std.initial_amount || 0)}} {{std.unit}}</span>
                                </div>
                            </div>
                            <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden shadow-inner">
                                <div class="h-full rounded-full transition-all duration-1000 ease-out" 
                                     [style.width.%]="Math.min((std.current_amount / (std.initial_amount || 1)) * 100, 100)" 
                                     [class.bg-emerald-500]="(std.current_amount / (std.initial_amount || 1)) > 0.2" 
                                     [class.bg-rose-500]="(std.current_amount / (std.initial_amount || 1)) <= 0.2">
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4 flex-1">
                            <div>
                                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Vị trí lưu trữ</span>
                                @if(std.location) { 
                                    <div class="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2"><i class="fa-solid fa-location-dot text-slate-400"></i> {{std.location}}</div> 
                                } @else { <span class="text-sm text-slate-400 italic">Chưa xác định</span> }
                            </div>
                            <div>
                                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Điều kiện bảo quản</span>
                                <div class="flex flex-col gap-1.5">
                                    @for(info of storageInfo(); track $index) {
                                        <div class="px-2 py-1 rounded text-[11px] flex items-center gap-2 border w-fit shadow-sm" [ngClass]="[info.bg, info.border, info.color]">
                                            <i class="fa-solid" [ngClass]="info.icon"></i><span class="font-bold">{{info.text}}</span>
                                        </div>
                                    }
                                </div>
                            </div>
                             @if(std.purity) {
                             <div>
                                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Độ tinh khiết</span>
                                <div class="font-bold text-slate-700 dark:text-slate-200">{{std.purity}}</div>
                             </div>
                             }
                            <div>
                                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Quy cách đóng gói</span>
                                <div class="font-bold text-slate-700 dark:text-slate-200">{{std.pack_size || 'N/A'}}</div>
                            </div>
                            @if(std.cas_number) {
                                <div>
                                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">CAS Number</span>
                                    <div class="font-mono font-bold text-slate-700 dark:text-slate-200">{{std.cas_number}}</div>
                                </div>
                            }
                        </div>
                    </div>

                    <!-- COLUMN 2: HẠN DÙNG & HỒ SƠ -->
                    <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col h-full">
                        <div class="flex items-center justify-between mb-6">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center shadow-inner">
                                    <i class="fa-solid fa-clock text-lg"></i>
                                </div>
                                <h3 class="text-base font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">Hạn Dùng & Hồ Sơ</h3>
                            </div>
                            
                            <div class="flex items-center gap-2">
                                @if(std.certificate_ref) {
                                    <button (click)="openCoaPreview(std.certificate_ref)" class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-md shadow-blue-200 dark:shadow-none hover:from-blue-700 hover:to-indigo-700 transition font-bold text-sm active:scale-95 group">
                                        <i class="fa-solid fa-file-pdf group-hover:-translate-y-0.5 transition-transform"></i> Xem CoA
                                    </button>
                                }
                                @if(auth.canEditStandards()) {
                                    <button (click)="triggerQuickDriveUpload()" [disabled]="isUploadingCoa()" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition font-bold text-sm active:scale-95 disabled:opacity-50 group shadow-sm">
                                        @if(isUploadingCoa()) {
                                            <i class="fa-solid fa-circle-notch fa-spin"></i>
                                        } @else {
                                            <i class="fa-brands fa-google-drive text-emerald-600"></i>
                                        }
                                        {{ std.certificate_ref ? 'Cập nhật CoA' : 'Upload CoA' }}
                                    </button>
                                }
                            </div>
                        </div>

                        <div class="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 mb-6 flex items-center gap-5">
                            <div class="w-14 h-14 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-700 shrink-0">
                                <i class="fa-regular fa-calendar-xmark text-2xl" [ngClass]="expiryInfo().colorClass"></i>
                            </div>
                            <div class="flex-1">
                                <span class="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Hạn Sử Dụng</span>
                                <div class="text-2xl font-black font-mono tracking-tight" [ngClass]="expiryInfo().colorClass">{{std.expiry_date ? (std.expiry_date | date:'dd/MM/yyyy') : 'N/A'}}</div>
                                <div class="text-sm font-bold mt-1" [ngClass]="expiryInfo().colorClass">{{expiryInfo().timeLeftText}}</div>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4 flex-1 content-start">
                            <div class="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block"><i class="fa-solid fa-calendar-check mr-1"></i> Ngày nhận</span>
                                <div class="font-bold text-slate-700 dark:text-slate-200">{{std.received_date ? (std.received_date | date:'dd/MM/yyyy') : 'N/A'}}</div>
                            </div>
                            <div class="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block"><i class="fa-solid fa-flask-vial mr-1"></i> Ngày mở nắp</span>
                                <div class="font-bold text-slate-700 dark:text-slate-200">{{std.date_opened ? (std.date_opened | date:'dd/MM/yyyy') : 'Chưa mở nắp'}}</div>
                            </div>
                            @if(std.contract_ref) {
                                <div class="col-span-2 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500"><i class="fa-solid fa-file-contract"></i></div>
                                    <div>
                                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 block">Hợp đồng / PO</span>
                                        <div class="font-bold text-slate-700 dark:text-slate-200">{{std.contract_ref}}</div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <!-- SECTION: CURRENT HOLDER (IF IN_USE) -->
                @if(std.status === 'IN_USE' && std.current_holder) {
                    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-3xl p-5 flex items-center gap-4 animate-fade-in shadow-sm mt-2">
                        <div class="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-blue-500 text-xl border border-blue-100 dark:border-blue-700 shrink-0">
                            <i class="fa-solid fa-user-lock"></i>
                        </div>
                        <div class="flex-1">
                            <h4 class="text-sm font-black text-blue-800 dark:text-blue-300">Đang được mượn bởi</h4>
                            <p class="text-base font-bold text-blue-900 dark:text-blue-200 mt-0.5">{{std.current_holder}}</p>
                        </div>
                        @if(auth.canEditStandards() || std.current_holder_uid === auth.currentUser()?.uid) {
                            <button (click)="goToReturn()" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-md active:scale-95 flex items-center gap-2">
                                <i class="fa-solid fa-rotate-left"></i> Hoàn trả Chuẩn
                            </button>
                        }
                    </div>
                }

                <!-- ACTION SHORTCUTS (BOTTOM PANEL) -->
                @if(canAssign(std) || std.status === 'DEPLETED' || std.current_amount <= 0 || (!std.certificate_ref && !auth.canEditStandards())) {
                    <div class="flex flex-wrap items-center gap-3 mt-2 bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <span class="text-xs font-black text-slate-400 uppercase tracking-widest mr-2"><i class="fa-solid fa-bolt text-amber-500 mr-1"></i> Tác vụ nhanh:</span>

                        <!-- FEFO Warning: có lọ khác nên dùng trước -->
                        @if(fefoWarningSibling(); as warn) {
                            <div class="w-full flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
                                <i class="fa-solid fa-triangle-exclamation text-amber-500"></i>
                                <span>
                                    <strong>Gợi ý FEFO:</strong> Lọ <strong>{{warn.internal_id || warn.lot_number}}</strong>
                                    (hết hạn: {{warn.expiry_date ? (warn.expiry_date | date:'dd/MM/yyyy') : 'N/A'}})
                                    nên được cấp trước lọ này.
                                </span>
                                <button (click)="navigateToRelated(warn.id!)" class="ml-auto px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black transition whitespace-nowrap">
                                    Chuyển sang lọ ưu tiên
                                </button>
                            </div>
                        }
                        
                        @if(canAssign(std)) {
                            @if(auth.canAssignStandards()) {
                                <button (click)="openAssignModal(true)" class="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/40 rounded-xl font-bold text-sm transition flex items-center gap-2">
                                    <i class="fa-solid fa-hand-holding-hand"></i> Gán cho mượn
                                </button>
                            } @else {
                                <button (click)="openAssignModal(false)" class="px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/40 rounded-xl font-bold text-sm transition flex items-center gap-2">
                                    <i class="fa-solid fa-hand-holding-hand"></i> Đăng ký mượn chuẩn
                                </button>
                            }
                        }

                        @if(std.status === 'DEPLETED' || std.current_amount <= 0) {
                            @if(!std.restock_requested) {
                                <button (click)="openPurchaseModal()" class="px-4 py-2 bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/40 rounded-xl font-bold text-sm transition flex items-center gap-2">
                                    <i class="fa-solid fa-cart-plus"></i> Đề nghị mua thêm
                                </button>
                            } @else {
                                <span class="px-4 py-2 bg-slate-50 text-slate-500 border border-slate-200 rounded-xl font-bold text-sm flex items-center gap-2 cursor-not-allowed">
                                    <i class="fa-solid fa-cart-arrow-down"></i> Đã có yêu cầu mua
                                </span>
                            }
                        }

                        @if(!std.certificate_ref && !auth.canEditStandards()) {
                            <button (click)="requestCoa(std)" class="px-4 py-2 bg-purple-50 text-purple-600 border border-purple-200 hover:bg-purple-100 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-900/40 rounded-xl font-bold text-sm transition flex items-center gap-2" [disabled]="!!std.coa_requested_by" [class.opacity-50]="!!std.coa_requested_by">
                                <i class="fa-solid" [class.fa-file-signature]="!std.coa_requested_by" [class.fa-clock-rotate-left]="!!std.coa_requested_by"></i> {{std.coa_requested_by ? 'Đã yêu cầu CoA' : 'Yêu cầu cập nhật CoA'}}
                            </button>
                        }
                    </div>
                }

                <!-- TABS: RELATED & HISTORY -->
                <div class="mt-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
                    <div class="flex border-b border-slate-100 dark:border-slate-700 px-6 pt-4 gap-8 bg-slate-50/50 dark:bg-slate-900/50">
                        <button (click)="activeTab.set('usage')" class="pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 tracking-wide" [class]="activeTab() === 'usage' ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 dark:border-indigo-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'">
                            <i class="fa-solid fa-clock-rotate-left"></i> Nhật ký Sử dụng
                        </button>
                        <button (click)="activeTab.set('related')" class="pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 tracking-wide" [class]="activeTab() === 'related' ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'">
                            <i class="fa-solid fa-flask"></i> Lọ chuẩn cùng tên 
                            <span class="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full text-[10px] ml-1">{{relatedStandards().length}}</span>
                        </button>
                    </div>

                    <div class="p-0 flex-1 overflow-y-auto">
                        <!-- TAB: USAGE LOGS -->
                        @if(activeTab() === 'usage') {
                            @if(loadingHistory()) {
                                <div class="p-12 text-center text-slate-400"><i class="fa-solid fa-spinner fa-spin text-2xl"></i><p class="mt-2 text-sm">Đang tải lịch sử...</p></div>
                            } @else {
                                <table class="w-full text-sm text-left">
                                    <thead class="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800 sticky top-0 border-b border-slate-100 dark:border-slate-700">
                                        <tr>
                                            <th class="px-6 py-4 font-bold">Ngày thao tác</th>
                                            <th class="px-6 py-4 font-bold text-right">Lượng sử dụng</th>
                                            <th class="px-6 py-4 font-bold">Mục đích / Người dùng</th>
                                            <th class="px-6 py-4 font-bold text-center w-16"></th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
                                        @for (log of usageLogs(); track log.id) {
                                            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition group">
                                                <td class="px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-300 font-bold whitespace-nowrap">{{log.date}}</td>
                                                <td class="px-6 py-4 font-mono font-black text-orange-600 dark:text-orange-400 text-base text-right">{{formatNum(log.amount_used)}} {{std.unit}}</td>
                                                <td class="px-6 py-4">
                                                    <div class="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">{{log.purpose}}</div>
                                                    <div class="flex items-center gap-2 text-xs">
                                                        <img [src]="getAvatarUrl(log.user)" class="w-5 h-5 rounded-full object-cover">
                                                        <span class="text-slate-500 dark:text-slate-400 font-medium">{{log.user}}</span>
                                                    </div>
                                                </td>
                                                <td class="px-6 py-4 text-center">
                                                    @if(auth.canEditStandards()) {
                                                        <button (click)="deleteLog(log, std.id!)" class="w-8 h-8 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 transition opacity-0 group-hover:opacity-100" title="Xóa & Hoàn kho"><i class="fa-solid fa-trash-can"></i></button>
                                                    }
                                                </td>
                                            </tr>
                                        } @empty {
                                            <tr><td colspan="4" class="p-16 text-center text-slate-400 italic">Chưa có lịch sử sử dụng cho chuẩn này.</td></tr>
                                        }
                                    </tbody>
                                </table>
                            }
                        }

                        <!-- TAB: RELATED STANDARDS -->
                        @if(activeTab() === 'related') {
                            <!-- FEFO Banner -->
                            @if(relatedStandards().length > 0) {
                                <div class="px-6 py-3 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-800/30 flex items-center gap-2">
                                    <i class="fa-solid fa-triangle-exclamation text-amber-500 text-sm"></i>
                                    <p class="text-xs text-amber-700 dark:text-amber-400 font-medium">
                                        Danh sách được sắp xếp <strong>ưu tiên cấp trước (FEFO)</strong>: gần hết hạn &rarr; ít lượng. Lọ đầu tiên trong danh sách nên được cấp trước.
                                    </p>
                                </div>
                            }
                            <table class="w-full text-sm text-left">
                                <thead class="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800 sticky top-0 border-b border-slate-100 dark:border-slate-700">
                                    <tr>
                                        <th class="px-6 py-4 font-bold">Mã (ID)</th>
                                        <th class="px-6 py-4 font-bold">Lot Number</th>
                                        <th class="px-6 py-4 font-bold">Tồn kho</th>
                                        <th class="px-6 py-4 font-bold">Hạn dùng</th>
                                        <th class="px-6 py-4 font-bold text-center">Trạng thái</th>
                                        <th class="px-6 py-4 font-bold text-center w-16"></th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
                                    @for (rStd of relatedStandards(); track rStd.id; let idx = $index) {
                                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition cursor-pointer group" (click)="navigateToRelated(rStd.id!)">
                                            <td class="px-6 py-4">
                                                <div class="flex items-center gap-2">
                                                    <span class="font-bold text-slate-700 dark:text-slate-200">{{rStd.internal_id || 'N/A'}}</span>
                                                    @if(idx === 0 && canAssign(rStd)) {
                                                        <span class="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700/50 uppercase tracking-wide whitespace-nowrap">
                                                            <i class="fa-solid fa-star text-[8px]"></i> Ưu tiên
                                                        </span>
                                                    }
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 font-mono text-slate-600 dark:text-slate-300 text-xs">{{rStd.lot_number || '-'}}</td>
                                            <td class="px-6 py-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">{{formatNum(rStd.current_amount)}} {{rStd.unit}}</td>
                                            <td class="px-6 py-4 font-mono text-xs" [ngClass]="getExpiryClass(rStd.expiry_date)">{{rStd.expiry_date ? (rStd.expiry_date | date:'dd/MM/yyyy') : 'N/A'}}</td>
                                            <td class="px-6 py-4 text-center">
                                                <span class="px-2 py-1 rounded text-[10px] font-bold uppercase border" [ngClass]="getStandardStatus(rStd).class">{{getStandardStatus(rStd).label}}</span>
                                            </td>
                                            <td class="px-6 py-4 text-center text-slate-400 group-hover:text-indigo-500 transition"><i class="fa-solid fa-chevron-right"></i></td>
                                        </tr>
                                    } @empty {
                                        <tr><td colspan="6" class="p-16 text-center text-slate-400 italic">Không có lọ chuẩn nào khác cùng tên "{{std.name}}".</td></tr>
                                    }
                                </tbody>
                            </table>
                        }
                    </div>
                </div>

            </ng-container>
        }
    </div>

    <!-- Modals -->
    @if(showEditModal() && standard()) {
        <app-standards-form-modal [std]="standard()" [isOpen]="true" [allStandards]="allStandardsCache()" (closeModal)="onModalSaved()"></app-standards-form-modal>
    }
    @if(showPrintModal() && standard()) {
        <app-standards-print-modal [std]="standard()" [isOpen]="true" (closeModal)="showPrintModal.set(false)"></app-standards-print-modal>
    }
    @if(showPurchaseModal() && standard()) {
        <app-standards-purchase-modal [selectedStd]="standard()" [isOpen]="true" (closeModal)="showPurchaseModal.set(false)"></app-standards-purchase-modal>
    }
    <!-- COA PREVIEW MODAL -->
    <app-standards-coa-modal [previewUrl]="previewUrl()" [previewImgUrl]="previewImgUrl()" [previewType]="previewType()" [previewRawUrl]="previewRawUrl()" (closeModal)="closeCoaPreview()"></app-standards-coa-modal>

    <!-- ASSIGN/BORROW MODAL -->
    <app-standards-assign-modal
        [isOpen]="showAssignModal()"
        [std]="standard()"
        [isAssignMode]="isAssignMode()"
        [userList]="userList()"
        [isProcessing]="isProcessing()"
        [currentUserUid]="auth.currentUser()?.uid || ''"
        [currentUserName]="auth.currentUser()?.displayName || ''"
        (closeModal)="showAssignModal.set(false)"
        (confirm)="confirmAssign($event)">
    </app-standards-assign-modal>
    
    <!-- Hidden input for quick Drive upload -->
    <input id="quickDriveInput" #quickDriveInput type="file" class="hidden" accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx" (change)="handleQuickDriveUpload($event)">
  `
})
export class StandardDetailComponent implements OnInit, OnDestroy {
    route = inject(ActivatedRoute);
    router = inject(Router);
    stdService = inject(StandardService);
    firebaseService = inject(FirebaseService);
    auth = inject(AuthService);
    toast = inject(ToastService);
    state = inject(StateService);
    confirmation = inject(ConfirmationService);
    location = inject(Location);
    confirmationService = inject(ConfirmationService);
    sanitizer = inject(DomSanitizer);
    googleDriveService = inject(GoogleDriveService);
    notificationService = inject(NotificationService);

    Math = Math;
    formatNum = formatNum;
    getAvatarUrl = getAvatarUrl;
    getStandardStatus = getStandardStatus;
    getStorageInfo = getStorageInfo;
    getExpiryClass = getExpiryClass;
    getExpiryTimeLeft = getExpiryTimeLeft;
    canAssign = canAssign;

    standardId = signal<string>('');
    standard = signal<ReferenceStandard | null>(null);
    isLoading = signal(true);
    notFound = signal(false);
    
    usageLogs = signal<UsageLog[]>([]);
    loadingHistory = signal(false);
    isProcessing = signal(false);
    allStandardsCache = signal<ReferenceStandard[]>([]);
    
    activeTab = signal<'usage' | 'related'>('usage');
    
    // Modals state
    showEditModal = signal(false);
    showPrintModal = signal(false);
    showPurchaseModal = signal(false);
    showAssignModal = signal(false);
    
    isAssignMode = signal(true);
    userList = signal<UserProfile[]>([]);

    // CoA Preview state
    previewUrl = signal<SafeResourceUrl | null>(null);
    previewImgUrl = signal<string>('');
    previewType = signal<'iframe' | 'image'>('iframe');
    previewRawUrl = signal<string>('');

    isUploadingCoa = signal(false);

    private liveUnsub?: () => void;
    private routeSub: any;

    // Computed Properties
    statusInfo = computed(() => {
        const std = this.standard();
        if (!std) return { label: '', class: '' };
        return this.getStandardStatus(std);
    });

    storageInfo = computed(() => {
        const std = this.standard();
        if (!std) return [];
        return this.getStorageInfo(std.storage_condition);
    });

    expiryInfo = computed(() => {
        const std = this.standard();
        if (!std) return { timeLeftText: '', colorClass: '' };
        return {
            timeLeftText: this.getExpiryTimeLeft(std.expiry_date),
            colorClass: this.getExpiryClass(std.expiry_date)
        };
    });

    qrCodeUrl = computed(() => {
        const std = this.standard();
        if (!std) return '';
        const baseUrl = window.location.origin;
        return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(baseUrl + '/#/standards/' + std.id)}`;
    });

    relatedStandards = computed(() => {
        const std = this.standard();
        const all = this.allStandardsCache();
        if (!std || all.length === 0) return [];
        const related = all.filter(s => s.id !== std.id && s.name.toLowerCase() === std.name.toLowerCase());

        // Sắp xếp theo FEFO (First Expiry First Out):
        // 1. Lọ có thể dùng (canAssign) lên trước
        // 2. Cùng assignable: lọ gần hết hạn hơn lên trước
        // 3. Cùng hạn: lô ít lượng hơn lên trước
        return related.sort((a, b) => {
            const aOk = this.canAssign(a);
            const bOk = this.canAssign(b);
            if (aOk !== bOk) return aOk ? -1 : 1;

            const aExp = a.expiry_date ? new Date(a.expiry_date).getTime() : Infinity;
            const bExp = b.expiry_date ? new Date(b.expiry_date).getTime() : Infinity;
            if (aExp !== bExp) return aExp - bExp;

            return (a.current_amount || 0) - (b.current_amount || 0);
        });
    });

    /**
     * Trả về lọ cùng tên nên dùng trước lọ hiện tại (theo FEFO).
     * Dùng để hiển thị cảnh báo trong Action Shortcuts.
     */
    fefoWarningSibling = computed(() => {
        const std = this.standard();
        if (!std || !this.canAssign(std)) return null;

        const siblings = this.relatedStandards();
        const first = siblings.find(s => this.canAssign(s));
        if (!first) return null;

        // Kiểm tra xem first có nên dùng trước lọ hiện tại không
        const stdExp = std.expiry_date ? new Date(std.expiry_date).getTime() : Infinity;
        const firstExp = first.expiry_date ? new Date(first.expiry_date).getTime() : Infinity;

        if (firstExp < stdExp) return first;
        if (firstExp === stdExp && (first.current_amount || 0) < (std.current_amount || 0)) return first;
        return null;
    });

    ngOnInit() {
        // Subscribe to route params to handle navigation between related standards
        this.routeSub = this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.standardId.set(id);
                this.loadStandardData(id);
                // Active usage tab by default on navigation
                this.activeTab.set('usage');
            }
        });

        // Register global listener to update if data changes in background
        this.liveUnsub = this.stdService.listenToStandards(() => {
            if (this.standardId()) {
                this.refreshStandardFromCache(this.standardId());
                this.refreshAllStandards();
            }
        });
    }

    ngOnDestroy() {
        if (this.routeSub) this.routeSub.unsubscribe();
        if (this.liveUnsub) this.liveUnsub();
    }

    async loadStandardData(id: string) {
        this.isLoading.set(true);
        this.notFound.set(false);
        try {
            const std = await this.stdService.getStandardById(id);
            if (std) {
                this.standard.set(std);
                this.loadHistory(id);
                this.refreshAllStandards();
            } else {
                this.notFound.set(true);
            }
        } catch (error) {
            console.error('Failed to load standard details:', error);
            this.notFound.set(true);
        } finally {
            this.isLoading.set(false);
        }
    }

    async refreshStandardFromCache(id: string) {
        // Soft refresh when delta listener triggers
        const std = await this.stdService.getStandardById(id);
        if (std) this.standard.set(std);
    }

    refreshAllStandards() {
        this.allStandardsCache.set(this.stdService.getAllStandardsFromCache());
    }

    async loadHistory(id: string) {
        this.loadingHistory.set(true);
        try {
            const logs = await this.stdService.getUsageHistory(id);
            this.usageLogs.set(logs);
        } catch (error) {
            console.error('Failed to load history:', error);
        } finally {
            this.loadingHistory.set(false);
        }
    }

    // --- NAVIGATION & ACTIONS ---
    
    goBack() {
        this.router.navigate(['/standards']);
    }

    navigateToRelated(id: string) {
        this.router.navigate(['/standards', id]);
    }

    async openAssignModal(isAssign = true) {
        if (this.isProcessing() || !this.standard()) return;
        this.isAssignMode.set(isAssign);
        this.showAssignModal.set(true);
        
        if (isAssign && this.userList().length === 0) {
            try {
                const users = await this.firebaseService.getAllUsers();
                this.userList.set(users);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
    }

    async confirmAssign(data: {userId: string, userName: string, purpose: string, expectedAmount: number | null}) {
        const std = this.standard();
        
        if (!std || !data.userId || !data.purpose) {
            this.toast.show('Vui lòng điền đầy đủ thông tin bắt buộc (*)', 'error');
            return;
        }

        this.isProcessing.set(true);
        try {
            const request: StandardRequest = {
                standardId: std.id,
                standardName: std.name,
                lotNumber: std.lot_number,
                requestedBy: data.userId,
                requestedByName: data.userName,
                requestDate: Date.now(),
                purpose: data.purpose.trim(),
                expectedAmount: data.expectedAmount || 0,
                status: 'PENDING_APPROVAL',
                totalAmountUsed: 0
            };

            await this.stdService.createRequest(request, this.isAssignMode());
            
            this.toast.show(this.isAssignMode() ? 'Đã gán chuẩn thành công' : 'Đã gửi yêu cầu mượn chuẩn', 'success');
            this.showAssignModal.set(false);
            
            // Xử lý reload trạng thái
            if (this.standardId()) {
                this.loadStandardData(this.standardId());
            }
        } catch (error: any) {
            this.toast.show(error.message || 'Lỗi khi xử lý', 'error');
        } finally {
            this.isProcessing.set(false);
        }
    }

    goToReturn() {
        this.router.navigate(['/standard-requests']);
        this.toast.show('Chuyển đến trang Yêu cầu để hoàn trả', 'info');
    }

    openEditModal() {
        if (this.auth.canEditStandards() && this.standard()) {
            this.showEditModal.set(true);
        }
    }

    openPrintModal() {
        if (this.standard()) this.showPrintModal.set(true);
    }

    openPurchaseModal() {
        if (this.standard()) this.showPurchaseModal.set(true);
    }

    async requestCoa(std: ReferenceStandard) {
        if (this.isProcessing() || std.coa_requested_by) return;
        
        this.confirmation.confirm({
            message: `Bạn đang gửi thông báo yêu cầu Quản trị viên bổ sung chứng nhận phân tích (CoA) cho chuẩn "${std.name}". Bạn có chắc chắn không?`,
            confirmText: 'Gửi Yêu cầu',
            cancelText: 'Hủy'
        }).then(async (confirmed) => {
            if (!confirmed) return;
            
            this.isProcessing.set(true);
            try {
                // Optimistic UI update to prevent immediate double clicks
                const uid = this.auth.currentUser()?.uid;
                this.standard.update(s => s ? { ...s, coa_requested_by: uid } : s);
                
                await this.stdService.requestCoa(std);
                this.toast.show('Đã thông báo yêu cầu bổ sung CoA đến Quản trị viên.', 'success');
            } catch (e: any) {
                this.toast.show('Lỗi gửi yêu cầu: ' + e.message, 'error');
                // Revert on error
                this.standard.update(s => s ? { ...s, coa_requested_by: undefined } : s);
            } finally {
                this.isProcessing.set(false);
            }
        });
    }

    onModalSaved() {
        this.showEditModal.set(false);
        if (this.standardId()) {
            this.loadStandardData(this.standardId()); // Reload fresh data
        }
    }

    copyText(text: string | undefined) {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => this.toast.show('Đã copy: ' + text));
    }

    openCoaPreview(url: string) {
        if (!url) return;
        this.previewRawUrl.set(url);
        const cleanUrl = url.split('?')[0].toLowerCase();
        const isImage = /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/.test(cleanUrl);
        if (isImage) { 
            this.previewType.set('image'); 
            this.previewImgUrl.set(url); 
        } else { 
            this.previewType.set('iframe'); 
            this.previewUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url)); 
        }
    }

    closeCoaPreview() { 
        this.previewUrl.set(null); 
        this.previewImgUrl.set(''); 
    }



    async deleteLog(log: UsageLog, stdId: string) {
        if (!log.id) return;
        if (await this.confirmationService.confirm({ message: `Xóa lịch sử dụng ngày ${log.date}?`, confirmText: 'Xóa & Hoàn kho', isDangerous: true })) {
            try { 
                await this.stdService.deleteUsageLog(stdId, log.id); 
                this.toast.show('Đã xóa', 'success'); 
                await this.loadHistory(stdId); 
            } catch (e: any) { 
                this.toast.show('Lỗi: ' + e.message, 'error'); 
            }
        }
    }
    // --- Quick Upload CoA ---
    triggerQuickDriveUpload() {
        // XÁC THỰC TRƯỚC KHI MỞ FILE PICKER ĐỂ KHÔNG BỊ CHẶN POPUP
        this.googleDriveService.authenticateSync(
            () => {
                const input = document.querySelector('#quickDriveInput') as HTMLInputElement;
                if (input) {
                    input.click();
                } else {
                    this.toast.show('Không tìm thấy input upload', 'error');
                }
            },
            (err) => {
                this.toast.show('Lỗi đăng nhập Google: ' + err, 'error');
            }
        );
    }

    async handleQuickDriveUpload(event: any) {
        const file = event.target.files[0];
        if (!file) return;

        const std = this.standard();
        if (!std) return;

        try {
            this.isUploadingCoa.set(true);
            const fileName = GoogleDriveService.generateFileName(std.name, std.lot_number || '', file.name);
            this.toast.show(`Đang upload CoA cho "${std.name}"...`);

            const previewUrl = await this.googleDriveService.uploadFile(file, fileName);

            // Tìm tất cả các chuẩn cùng Tên và Số Lô từ Delta Sync cache
            const allStds = this.stdService.getAllStandardsFromCache();
            const siblings = allStds.filter(s => s.name === std.name && s.lot_number === std.lot_number && !s._isDeleted);
            
            const batch = writeBatch(this.firebaseService.db);
            for (const s of siblings) {
                if (s.id) {
                    const ref = doc(this.firebaseService.db, `artifacts/${this.firebaseService.APP_ID}/reference_standards`, s.id);
                    batch.update(ref, { certificate_ref: previewUrl, coa_requested_by: deleteField() });
                }
            }
            await batch.commit();

            // Nếu có ai đó yêu cầu CoA, thông báo lại cho họ
            if (std.coa_requested_by) {
                const admin = this.auth.currentUser();
                await this.notificationService.notify({
                    recipientUid: std.coa_requested_by,
                    senderUid: admin?.uid,
                    senderName: admin?.displayName || 'Quản trị viên',
                    type: 'SYSTEM_INFO', // Hoặc có thể thêm type 'COA_UPLOADED' nếu muốn
                    title: 'Đã cập nhật CoA',
                    message: `File CoA của chuẩn "${std.name}" đã được tải lên thành công.`,
                    targetId: std.id,
                    actionUrl: `/standards/${std.id}`
                });
            }

            // Cập nhật local signal cho view hiện tại
            this.standard.update(current => current ? { ...current, certificate_ref: previewUrl, coa_requested_by: undefined } : current);

            if (siblings.length > 1) {
                this.toast.show(`Upload thành công! Đã áp dụng CoA cho ${siblings.length} lọ chuẩn cùng lô.`);
            } else {
                this.toast.show(`Upload CoA thành công!`);
            }
        } catch (e: any) {
            console.error('Quick Drive upload error:', e);
            this.toast.show('Upload CoA lỗi: ' + (e.message || 'Không xác định'), 'error');
        } finally {
            this.isUploadingCoa.set(false);
            event.target.value = '';
        }
    }
}
