
import { Component, inject, signal, computed, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import { StandardService } from './standard.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { ReferenceStandard, UsageLog, ImportPreviewItem, ImportUsageLogPreviewItem, StandardRequest, PurchaseRequest } from '../../core/models/standard.model';
import { formatNum, generateSlug, UNIT_OPTIONS } from '../../shared/utils/utils';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService, UserProfile } from '../../core/services/auth.service';
import { Unsubscribe, onSnapshot, query, collection, where } from 'firebase/firestore';
import { GoogleDriveService } from '../../core/services/google-drive.service';

@Component({
  selector: 'app-standards',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SkeletonComponent],
  template: `
    <div class="flex flex-col space-y-2 md:space-y-3 fade-in h-full relative">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 shrink-0 bg-white dark:bg-slate-800 p-2 px-3 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm dark:shadow-none">
        <div>
            <h2 class="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/50 shadow-sm dark:shadow-none">
                    <i class="fa-solid fa-vial-circle-check text-xs"></i>
                </div>
                Quản lý Chuẩn Đối Chiếu
            </h2>
        </div>
        
        <div class="flex gap-2 items-center">
           @if(selectedIds().size > 0 && auth.canEditStandards()) {
                <button (click)="deleteSelected()" [disabled]="isProcessing()" class="px-3 py-1.5 bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-600 rounded-lg shadow-sm shadow-red-200 dark:shadow-none transition font-bold text-[11px] flex items-center gap-1.5 animate-bounce-in disabled:opacity-50">
                    @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> } @else { <i class="fa-solid fa-trash"></i> } Xóa {{selectedIds().size}} mục
                </button>
                <div class="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
           }

           @if(auth.canEditStandards()) {

             <button (click)="openAddModal()" class="px-3 py-1.5 bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 rounded-lg shadow-sm shadow-indigo-200 dark:shadow-none transition font-bold text-[11px] flex items-center gap-1.5">
                <i class="fa-solid fa-plus"></i> Thêm mới
             </button>
             <button (click)="autoZeroAllSdhet()" class="px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40 rounded-lg border border-orange-200 dark:border-orange-800/50 transition font-bold text-[11px] flex items-center gap-1.5" title="Tự động kiểm kho tất cả chuẩn SDHET">
                <i class="fa-solid fa-box-open"></i> Dọn kho SDHET
             </button>
             <button (click)="fileInput.click()" class="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg border border-emerald-200 dark:border-emerald-800/50 transition font-bold text-[11px] flex items-center gap-1.5" title="Import danh sách chuẩn">
                <i class="fa-solid fa-file-excel"></i> Import Chuẩn
             </button>
             <input #fileInput type="file" class="hidden" accept=".xlsx, .xlsm, .csv" (change)="handleFileSelect($event)">
             
             <button (click)="usageLogFileInput.click()" class="px-3 py-1.5 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/40 rounded-lg border border-teal-200 dark:border-teal-800/50 transition font-bold text-[11px] flex items-center gap-1.5" title="Import nhật ký sử dụng">
                <i class="fa-solid fa-book-open"></i> Import Nhật ký
             </button>
             <input #usageLogFileInput type="file" class="hidden" accept=".xlsx, .xlsm, .csv" (change)="handleUsageLogFileSelect($event)">
           }
        </div>
      </div>


      <!-- Main Content -->
      <div class="flex-1 min-h-0 overflow-hidden bg-white dark:bg-slate-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col relative">
          
          <!-- Omnibox Filters -->
          <div class="p-2 border-b border-slate-50 dark:border-slate-700 flex flex-col gap-2 bg-slate-50/30 dark:bg-slate-800/50">
             <div class="flex flex-col md:flex-row gap-2">
                 <div class="relative flex-1 group">
                    <i class="fa-solid fa-search absolute left-2.5 top-2 text-slate-400 dark:text-slate-500 text-xs group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors"></i>
                    <input type="text" [ngModel]="searchTerm()" (ngModelChange)="onSearchInput($event)" 
                           class="w-full pl-7 pr-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 transition shadow-sm dark:shadow-none placeholder-slate-400 dark:placeholder-slate-500"
                           placeholder="Tìm kiếm chuẩn, mã số, số lô... (Real-time)">
                 </div>
                 
                 <!-- SORT DROPDOWN -->
                 <div class="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 shadow-sm dark:shadow-none h-[30px]">
                     <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase whitespace-nowrap"><i class="fa-solid fa-arrow-down-short-wide mr-1"></i> Sắp xếp:</span>
                     <select [ngModel]="sortOption()" (ngModelChange)="onSortChange($event)" 
                             class="bg-transparent text-[11px] font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer border-none py-1 pr-1">
                         <option value="received_desc" class="dark:bg-slate-800">Ngày nhận (Mới nhất)</option>
                         <option value="updated_desc" class="dark:bg-slate-800">Mới cập nhật</option>
                         <option value="name_asc" class="dark:bg-slate-800">Tên (A-Z)</option>
                         <option value="name_desc" class="dark:bg-slate-800">Tên (Z-A)</option>
                         <option value="expiry_asc" class="dark:bg-slate-800">Hạn dùng (Gần nhất)</option>
                         <option value="expiry_desc" class="dark:bg-slate-800">Hạn dùng (Xa nhất)</option>
                     </select>
                 </div>

                 <div class="flex bg-slate-200/50 dark:bg-slate-700/50 p-0.5 rounded-lg shrink-0 h-[30px] self-start md:self-auto">
                    <button (click)="viewMode.set('list')" [class]="viewMode() === 'list' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'" class="w-7 h-full flex items-center justify-center rounded transition" title="Dạng Danh sách">
                        <i class="fa-solid fa-list text-[11px]"></i>
                    </button>
                    <button (click)="viewMode.set('grid')" [class]="viewMode() === 'grid' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'" class="w-7 h-full flex items-center justify-center rounded transition" title="Dạng Lưới (Thẻ)">
                        <i class="fa-solid fa-border-all text-[11px]"></i>
                    </button>
                 </div>
             </div>
             
             <!-- Search Stats -->
             <div class="flex justify-between items-center px-1">
                 <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500">
                     Hiển thị: {{visibleItems().length}} / {{filteredItems().length}} kết quả 
                     @if(searchTerm()) { <span class="text-indigo-500 dark:text-indigo-400">(Lọc theo "{{searchTerm()}}")</span> }
                 </span>
                 @if(isLoading()) { <span class="text-[9px] text-blue-500 dark:text-blue-400 flex items-center gap-1"><i class="fa-solid fa-sync fa-spin"></i> Đang đồng bộ...</span> }
             </div>
          </div>

          <!-- Content Body -->
          <div class="flex-1 min-h-0 overflow-auto custom-scrollbar relative bg-slate-50/30 dark:bg-slate-900/50">
             
             <!-- VIEW MODE: LIST (HIGH DENSITY TABLE) -->
             @if (viewMode() === 'list') {
                 <div class="min-w-[1000px]"> 
                     <table class="w-full text-sm text-left relative border-collapse">
                        <thead class="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase bg-slate-50 dark:bg-slate-800/80 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none h-12 tracking-wide">
                           <tr>
                              <th class="px-4 py-3 w-10 text-center"><input type="checkbox" [checked]="isAllSelected()" (change)="toggleAll()" class="w-4 h-4 accent-indigo-600 dark:accent-indigo-500 cursor-pointer"></th>
                              <th class="px-4 py-3 w-[25%]">Định danh & Vị trí</th>
                              <th class="px-4 py-3 w-[20%]">Thông tin Lô/SX</th>
                              <th class="px-4 py-3 w-[15%]">Tồn kho & Bảo quản</th>
                              <th class="px-4 py-3 w-[15%]">Hạn dùng & Hồ sơ</th>
                              <th class="px-4 py-3 w-[10%] text-center">Trạng thái</th>
                              <th class="px-4 py-3 w-[10%] text-center">Tác vụ</th>
                           </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
                           @if (isLoading() && allStandards().length === 0) {
                                @for (i of [1,2,3,4,5]; track i) {
                                    <tr class="h-24">
                                        <td class="px-4"><app-skeleton width="16px" height="16px"></app-skeleton></td>
                                        <td class="px-4 space-y-2"><app-skeleton width="80%" height="16px"></app-skeleton><app-skeleton width="40%" height="12px"></app-skeleton></td>
                                        <td class="px-4 space-y-2"><app-skeleton width="90%" height="12px"></app-skeleton><app-skeleton width="60%" height="12px"></app-skeleton></td>
                                        <td class="px-4 space-y-2"><app-skeleton width="50%" height="20px"></app-skeleton><app-skeleton width="100%" height="6px"></app-skeleton></td>
                                        <td class="px-4 space-y-2"><app-skeleton width="70%" height="14px"></app-skeleton><app-skeleton width="40%" height="10px"></app-skeleton></td>
                                        <td class="px-4 text-center"><app-skeleton width="80px" height="24px" class="mx-auto rounded-full"></app-skeleton></td>
                                        <td class="px-4 text-center"><app-skeleton width="60px" height="24px" class="mx-auto"></app-skeleton></td>
                                    </tr>
                                }
                           } @else {
                               @for (std of visibleItems(); track std.id) {
                                  <tr class="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 transition group h-24" [ngClass]="{'bg-indigo-50 dark:bg-indigo-900/30': selectedIds().has(std.id), 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0': std.status === 'DEPLETED' || std.current_amount <= 0}">
                                     <td class="px-4 py-3 text-center align-top pt-4">
                                         <input type="checkbox" [checked]="selectedIds().has(std.id)" (change)="toggleSelection(std.id)" class="w-4 h-4 accent-indigo-600 dark:accent-indigo-500 cursor-pointer">
                                     </td>
                                     <td class="px-4 py-3 align-top">
                                        <div class="flex flex-col h-full">
                                            <div class="font-bold text-slate-800 dark:text-slate-200 text-base mb-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer leading-snug break-words" (click)="openEditModal(std)" [title]="std.name">
                                                {{std.name}}
                                            </div>
                                            @if(std.chemical_name) { <div class="text-sm text-slate-500 dark:text-slate-400 italic mb-2 break-words" [title]="std.chemical_name">{{std.chemical_name}}</div> }
                                            <div class="flex flex-wrap gap-2 mt-auto">
                                                @if(std.internal_id) { <span class="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-black border border-indigo-100 dark:border-indigo-800/50 tracking-tight">{{std.internal_id}}</span> }
                                                @if(std.location) { <span class="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"><i class="fa-solid fa-location-dot text-[10px]"></i> {{std.location}}</span> }
                                            </div>
                                        </div>
                                     </td>
                                     <td class="px-4 py-3 align-top border-l border-slate-50 dark:border-slate-800">
                                        <div class="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 truncate" [title]="std.manufacturer">{{std.manufacturer || 'N/A'}}</div>
                                        <div class="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                                            <span class="font-bold text-slate-400 dark:text-slate-500">LOT:</span><span class="font-mono text-slate-700 dark:text-slate-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 hover:underline decoration-dotted" title="Click để copy" (click)="copyText(std.lot_number, $event)">{{std.lot_number || '-'}}</span>
                                            <span class="font-bold text-slate-400 dark:text-slate-500">CODE:</span><span class="font-mono text-slate-700 dark:text-slate-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 hover:underline decoration-dotted" title="Click để copy" (click)="copyText(std.product_code, $event)">{{std.product_code || '-'}}</span>
                                            @if(std.cas_number) { <span class="font-bold text-slate-400 dark:text-slate-500">CAS:</span><span class="font-mono text-slate-700 dark:text-slate-300">{{std.cas_number}}</span> }
                                        </div>
                                        <div class="mt-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px] flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                            @if(std.purity) { <span>Pur: <b class="text-slate-700 dark:text-slate-300">{{std.purity}}</b></span> }
                                            @if(std.pack_size) { <span>Pack: <b class="text-slate-700 dark:text-slate-300">{{std.pack_size}}</b></span> }
                                        </div>
                                     </td>
                                     <td class="px-4 py-3 align-top border-l border-slate-50 dark:border-slate-800">
                                        <div class="flex items-baseline justify-between mb-1"><span class="text-lg font-black text-emerald-600 dark:text-emerald-400 leading-none">{{formatNum(std.current_amount)}}</span><span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 ml-1">{{std.unit}}</span></div>
                                        <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-2 overflow-hidden relative"><div class="h-full rounded-full transition-all duration-500" [style.width.%]="Math.min((std.current_amount / (std.initial_amount || 1)) * 100, 100)" [class.bg-emerald-500]="(std.current_amount / (std.initial_amount || 1)) > 0.2" [class.bg-rose-500]="(std.current_amount / (std.initial_amount || 1)) <= 0.2"></div></div>
                                        <div class="flex flex-col gap-1 mt-1">
                                            @for (info of getStorageInfo(std.storage_condition); track $index) { <div class="px-1.5 py-0.5 rounded text-[9px] flex items-center gap-1.5 border w-fit" [ngClass]="[info.bg, info.border, info.color]"><i class="fa-solid" [ngClass]="info.icon"></i><span class="font-bold">{{info.text}}</span></div> }
                                        </div>
                                        @if(std.received_date) {
                                            <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
                                                <i class="fa-solid fa-calendar-check text-[9px] text-blue-400 dark:text-blue-500"></i>
                                                <span class="font-medium">Nhận: <b class="text-slate-700 dark:text-slate-300">{{std.received_date | date:'dd/MM/yyyy'}}</b></span>
                                            </div>
                                        }
                                     </td>
                                     <td class="px-4 py-3 align-top border-l border-slate-50 dark:border-slate-800">
                                        <div class="flex flex-col gap-0.5 mb-2">
                                            <div class="font-mono font-bold text-xs" [class]="getExpiryClass(std.expiry_date)">{{std.expiry_date ? (std.expiry_date | date:'dd/MM/yyyy') : 'N/A'}}</div>
                                            <div class="text-[10px] font-medium" [class]="getExpiryTimeClass(std.expiry_date)">{{ getExpiryTimeLeft(std.expiry_date) }}</div>
                                        </div>
                                        <div class="flex flex-col gap-1.5">
                                            @if(std.certificate_ref) { <button (click)="openCoaPreview(std.certificate_ref, $event)" class="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded border border-blue-100 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition w-fit"><i class="fa-solid fa-file-pdf"></i> CoA</button> }
                                            @else if(auth.currentUser()?.role === 'manager') { <button (click)="triggerQuickDriveUpload(std, $event)" [disabled]="quickUploadStdId() === std.id" class="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded border border-amber-200 dark:border-amber-800/50 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition w-fit" title="Upload CoA nhanh qua Google Drive">
                                                @if(quickUploadStdId() === std.id) { <i class="fa-solid fa-spinner fa-spin"></i> Đang upload... } @else { <i class="fa-brands fa-google-drive"></i> Upload CoA }
                                            </button> }
                                            @if(std.contract_ref) { <div class="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[120px] flex items-center gap-1" title="Hợp đồng"><i class="fa-solid fa-file-contract"></i> {{std.contract_ref}}</div> }
                                        </div>
                                     </td>
                                     <td class="px-4 py-3 align-top text-center border-l border-slate-50 dark:border-slate-800">
                                         <span class="inline-block px-2 py-1 rounded-md text-[10px] font-bold uppercase border tracking-wide whitespace-nowrap" [ngClass]="getStandardStatus(std).class">{{getStandardStatus(std).label}}</span>
                                         @if(std.status === 'IN_USE' && std.current_holder) {
                                             <div class="mt-2 text-[10px] text-slate-500 dark:text-slate-400">
                                                 <div class="font-bold">Người giữ:</div>
                                                 <div class="truncate max-w-[100px] mx-auto" [title]="std.current_holder">{{std.current_holder}}</div>
                                             </div>
                                         }
                                     </td>
                                     <td class="px-4 py-3 align-top text-center border-l border-slate-50 dark:border-slate-800">
                                        <div class="flex flex-col items-center gap-2">
                                           <div class="flex gap-1">
                                               @if (std.id === 'SDHET' || std.internal_id === 'SDHET') {
                                                   <button (click)="autoZeroStock(std)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-600 dark:bg-orange-500 text-white hover:bg-orange-700 dark:hover:bg-orange-600 shadow-md shadow-orange-200 dark:shadow-none transition active:scale-95" title="Trừ kho (Kiểm kho)"><i class="fa-solid fa-box-open text-xs"></i></button>
                                               }
                                               @if(canAssign(std)) {
                                                   @if(auth.canEditStandards()) {
                                                       <button (click)="openAssignModal(std, true)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 dark:hover:bg-emerald-600 shadow-md shadow-emerald-200 dark:shadow-none transition active:scale-95" title="Gán cho mượn"><i class="fa-solid fa-hand-holding-hand text-xs"></i></button>
                                                   } @else {
                                                       <button (click)="openAssignModal(std, false)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-md shadow-indigo-200 dark:shadow-none transition active:scale-95" title="Mượn chuẩn này"><i class="fa-solid fa-hand-holding-hand text-xs"></i></button>
                                                   }
                                               } @else if (std.status === 'IN_USE' && (auth.canEditStandards() || std.current_holder_uid === auth.currentUser()?.uid)) {
                                                   <button (click)="goToReturn(std)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-600 dark:bg-rose-500 text-white hover:bg-rose-700 dark:hover:bg-rose-600 shadow-md shadow-rose-200 dark:shadow-none transition active:scale-95" title="Trả chuẩn"><i class="fa-solid fa-rotate-left text-xs"></i></button>
                                               } @else if (std.status === 'DEPLETED' || std.current_amount <= 0) {
                                                   @if (std.restock_requested) {
                                                        <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed" title="Đã có người yêu cầu mua"><i class="fa-solid fa-cart-arrow-down text-xs"></i></button>
                                                   } @else {
                                                        <button (click)="openPurchaseRequestModal(std)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-500 dark:bg-amber-600 text-white hover:bg-amber-600 dark:hover:bg-amber-500 shadow-md shadow-amber-200 dark:shadow-none transition active:scale-95" title="Đề nghị mua"><i class="fa-solid fa-cart-plus text-xs"></i></button>
                                                   }
                                               }
                                               @if(auth.canEditStandards()) {
                                                   <button (click)="openPrintModal(std)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-900 dark:hover:bg-slate-600 shadow-md shadow-slate-200 dark:shadow-none transition active:scale-95" title="In nhãn"><i class="fa-solid fa-print text-xs"></i></button>
                                               }
                                           </div>
                                           <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                               <button (click)="viewHistory(std)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700" title="Lịch sử"><i class="fa-solid fa-clock-rotate-left text-[10px]"></i></button>
                                               @if(auth.canEditStandards()) { <button (click)="openEditModal(std)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition" title="Sửa"><i class="fa-solid fa-pen text-[10px]"></i></button> }
                                           </div>
                                        </div>
                                     </td>
                                  </tr>
                               } 
                               @if (visibleItems().length === 0) { <tr><td colspan="7" class="p-16 text-center text-slate-400 dark:text-slate-500 italic">Không tìm thấy dữ liệu.</td></tr> }
                           }
                        </tbody>
                     </table>
                 </div>
             } 
             @else {
                 <!-- VIEW MODE: GRID (DATA-RICH CARD) -->
                 <div class="p-4">
                    @if (isLoading() && allStandards().length === 0) { 
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            @for(i of [1,2,3,4]; track i) { <app-skeleton height="280px"></app-skeleton> }
                        </div> 
                    } @else {
                        @if (visibleItems().length === 0) {
                            <div class="py-16 text-center text-slate-400 dark:text-slate-500 italic w-full">
                                <i class="fa-solid fa-box-open text-4xl mb-2 text-slate-300 dark:text-slate-600"></i>
                                <p>Không tìm thấy dữ liệu chuẩn phù hợp.</p>
                            </div>
                        } @else {
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                                @for (std of visibleItems(); track std.id) {
                                    <div class="bg-white dark:bg-slate-800 rounded-2xl border transition-all duration-200 flex flex-col relative group h-full hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-none overflow-hidden"
                                         [ngClass]="{
                                             'border-slate-200 dark:border-slate-700': !selectedIds().has(std.id),
                                             'border-indigo-400 dark:border-indigo-500 shadow-md bg-indigo-50 dark:bg-indigo-900/30': selectedIds().has(std.id),
                                             'opacity-50 grayscale hover:opacity-100 hover:grayscale-0': std.status === 'DEPLETED' || std.current_amount <= 0
                                         }">
                                        
                                        <!-- Header: Status Bar -->
                                        <div class="w-full h-1.5 flex bg-slate-100 dark:bg-slate-700 shrink-0">
                                            <div class="h-full w-full" [class]="getExpiryBarClass(std.expiry_date)"></div>
                                        </div>

                                        <div class="p-4 flex flex-col h-full">
                                            <!-- Top: ID, Location & Checkbox -->
                                            <div class="flex justify-between items-start mb-3">
                                                <div class="flex flex-wrap gap-1.5 items-start pr-2">
                                                    <span class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border tracking-wide whitespace-nowrap shadow-sm dark:shadow-none" [ngClass]="getStandardStatus(std).class">
                                                        {{getStandardStatus(std).label}}
                                                    </span>
                                                    @if(std.internal_id) {
                                                        <span class="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2.5 py-1 rounded-md text-sm font-black uppercase tracking-wider border border-indigo-100 dark:border-indigo-800/50 shadow-sm dark:shadow-none whitespace-nowrap">
                                                            {{std.internal_id}}
                                                        </span>
                                                    }
                                                    @if(std.location) {
                                                        <span class="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-md text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-sm dark:shadow-none whitespace-nowrap">
                                                            <i class="fa-solid fa-location-dot text-[10px]"></i> {{std.location}}
                                                        </span>
                                                    }
                                                </div>
                                                <input type="checkbox" [checked]="selectedIds().has(std.id)" (change)="toggleSelection(std.id)" class="w-5 h-5 accent-indigo-600 dark:accent-indigo-500 cursor-pointer shrink-0 mt-0.5">
                                            </div>

                                            <!-- Identity -->
                                            <div class="mb-4 cursor-pointer" (click)="openEditModal(std)">
                                                <h3 class="font-bold text-slate-800 dark:text-slate-200 text-base leading-snug mb-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition break-words">{{std.name}}</h3>
                                                @if(std.chemical_name) { <p class="text-sm text-slate-500 dark:text-slate-400 italic font-medium break-words">{{std.chemical_name}}</p> }
                                            </div>

                                            <!-- Data Grid (Click to copy) -->
                                            <div class="grid grid-cols-2 gap-px bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-700 mb-4 text-[11px]">
                                                <div class="bg-white dark:bg-slate-800 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition cursor-pointer group/cell" (click)="copyText(std.lot_number, $event)" title="Copy Lot">
                                                    <div class="text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5 flex justify-between">Lot <i class="fa-regular fa-copy opacity-0 group-hover/cell:opacity-100"></i></div>
                                                    <div class="font-mono font-bold text-slate-700 dark:text-slate-300 truncate">{{std.lot_number || '-'}}</div>
                                                </div>
                                                <div class="bg-white dark:bg-slate-800 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition cursor-pointer group/cell" (click)="copyText(std.product_code, $event)" title="Copy Code">
                                                    <div class="text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5 flex justify-between">Code <i class="fa-regular fa-copy opacity-0 group-hover/cell:opacity-100"></i></div>
                                                    <div class="font-mono font-bold text-slate-700 dark:text-slate-300 truncate">{{std.product_code || '-'}}</div>
                                                </div>
                                                <div class="bg-white dark:bg-slate-800 p-2">
                                                    <div class="text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5">Mfg</div>
                                                    <div class="font-bold text-slate-700 dark:text-slate-300 truncate" [title]="std.manufacturer">{{std.manufacturer || '-'}}</div>
                                                </div>
                                                <div class="bg-white dark:bg-slate-800 p-2">
                                                    <div class="text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5">CAS</div>
                                                    <div class="font-mono font-bold text-slate-700 dark:text-slate-300 truncate">{{std.cas_number || '-'}}</div>
                                                </div>
                                            </div>

                                            <!-- Stock & Storage -->
                                            <div class="mt-auto">
                                                <div class="flex justify-between items-end mb-1">
                                                    <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Tồn kho</span>
                                                    <span class="font-black text-indigo-600 dark:text-indigo-400 text-lg leading-none">{{formatNum(std.current_amount)}} <small class="text-xs font-bold text-slate-400 dark:text-slate-500">{{std.unit}}</small></span>
                                                </div>
                                                <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden mb-3">
                                                    <div class="bg-indigo-500 h-1.5 rounded-full transition-all" [style.width.%]="(std.current_amount / (std.initial_amount || 1)) * 100"></div>
                                                </div>
                                                
                                                <!-- Storage Badges -->
                                                <div class="flex flex-wrap gap-1 mb-2 min-h-[22px]">
                                                    @for (info of getStorageInfo(std.storage_condition); track $index) {
                                                        <div class="px-1.5 py-0.5 rounded text-[9px] flex items-center gap-1 border" [ngClass]="[info.bg, info.border, info.color]">
                                                            <i class="fa-solid" [ngClass]="info.icon"></i>
                                                            <span class="font-bold">{{info.text}}</span>
                                                        </div>
                                                    }
                                                    @if(std.status === 'IN_USE' && std.current_holder) {
                                                        <div class="px-1.5 py-0.5 rounded text-[9px] flex items-center gap-1 border bg-blue-50 text-blue-600 border-blue-200" title="Người đang giữ">
                                                            <i class="fa-solid fa-user"></i>
                                                            <span class="font-bold truncate max-w-[80px]">{{std.current_holder}}</span>
                                                        </div>
                                                    }
                                                </div>
                                                @if(std.received_date) {
                                                    <div class="text-[10px] text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1">
                                                        <i class="fa-solid fa-calendar-check text-[9px] text-blue-400 dark:text-blue-500"></i>
                                                        <span class="font-medium">Nhận: <b class="text-slate-700 dark:text-slate-300">{{std.received_date | date:'dd/MM/yyyy'}}</b></span>
                                                    </div>
                                                }
                                            </div>

                                            <!-- Footer Actions -->
                                            <div class="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                                                <div class="flex flex-col">
                                                    <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Hết hạn</span>
                                                    <span class="text-xs font-bold" [class]="getExpiryTimeClass(std.expiry_date)">{{getExpiryTimeLeft(std.expiry_date) || 'N/A'}}</span>
                                                </div>
                                                
                                                <div class="flex gap-1">
                                                    @if(std.certificate_ref) {
                                                        <button (click)="$event.stopPropagation(); openCoaPreview(std.certificate_ref, $event)" class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition flex items-center justify-center" title="Xem CoA">
                                                            <i class="fa-solid fa-file-pdf text-xs"></i>
                                                        </button>
                                                    } @else if(auth.currentUser()?.role === 'manager') {
                                                        <button (click)="$event.stopPropagation(); triggerQuickDriveUpload(std, $event)" [disabled]="quickUploadStdId() === std.id" class="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition flex items-center justify-center" title="Upload CoA qua Google Drive">
                                                            @if(quickUploadStdId() === std.id) { <i class="fa-solid fa-spinner fa-spin text-xs"></i> } @else { <i class="fa-brands fa-google-drive text-xs"></i> }
                                                        </button>
                                                    }
                                                    <button (click)="$event.stopPropagation(); viewHistory(std)" class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center justify-center" title="Lịch sử">
                                                        <i class="fa-solid fa-clock-rotate-left text-xs"></i>
                                                    </button>
                                                    @if(auth.canEditStandards()) {
                                                        <button (click)="$event.stopPropagation(); openPrintModal(std)" class="w-8 h-8 rounded-lg bg-slate-800 dark:bg-slate-700 text-white border border-slate-700 dark:border-slate-600 hover:bg-slate-900 dark:hover:bg-slate-600 transition flex items-center justify-center" title="In nhãn">
                                                            <i class="fa-solid fa-print text-xs"></i>
                                                        </button>
                                                    }
                                                    @if (std.id === 'SDHET' || std.internal_id === 'SDHET') {
                                                        <button (click)="$event.stopPropagation(); autoZeroStock(std)" class="w-auto px-3 h-8 rounded-lg bg-orange-600 dark:bg-orange-500 text-white hover:bg-orange-700 dark:hover:bg-orange-600 shadow-md shadow-orange-200 dark:shadow-none transition flex items-center justify-center gap-1 font-bold text-xs active:scale-95" title="Trừ kho (Kiểm kho)">
                                                            <i class="fa-solid fa-box-open"></i> Trừ kho
                                                        </button>
                                                    }
                                                    @if(canAssign(std)) {
                                                        @if(auth.canEditStandards()) {
                                                            <button (click)="$event.stopPropagation(); openAssignModal(std, true)" class="w-auto px-3 h-8 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 dark:hover:bg-emerald-600 shadow-md shadow-emerald-200 dark:shadow-none transition flex items-center justify-center gap-1 font-bold text-xs active:scale-95" title="Gán cho mượn">
                                                                <i class="fa-solid fa-hand-holding-hand"></i> Gán
                                                            </button>
                                                        } @else {
                                                            <button (click)="$event.stopPropagation(); openAssignModal(std, false)" class="w-auto px-3 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-md shadow-indigo-200 dark:shadow-none transition flex items-center justify-center gap-1 font-bold text-xs active:scale-95" title="Mượn chuẩn này">
                                                                <i class="fa-solid fa-hand-holding-hand"></i> Mượn
                                                            </button>
                                                        }
                                                    } @else if (std.status === 'IN_USE' && (auth.canEditStandards() || std.current_holder_uid === auth.currentUser()?.uid)) {
                                                        <button (click)="$event.stopPropagation(); goToReturn(std)" class="w-auto px-3 h-8 rounded-lg bg-rose-600 dark:bg-rose-500 text-white hover:bg-rose-700 dark:hover:bg-rose-600 shadow-md shadow-rose-200 dark:shadow-none transition flex items-center justify-center gap-1 font-bold text-xs active:scale-95" title="Trả chuẩn">
                                                            <i class="fa-solid fa-rotate-left"></i> Trả chuẩn
                                                        </button>
                                                    } @else if (std.status === 'DEPLETED' || std.current_amount <= 0) {
                                                        @if (std.restock_requested) {
                                                            <button class="w-auto px-3 h-8 rounded-lg bg-slate-300 dark:bg-slate-700 text-slate-500 flex items-center justify-center gap-1 font-bold text-xs cursor-not-allowed" title="Đã có người yêu cầu mua">
                                                                <i class="fa-solid fa-cart-arrow-down"></i> Đã Y/C
                                                            </button>
                                                        } @else {
                                                            <button (click)="$event.stopPropagation(); openPurchaseRequestModal(std)" class="w-auto px-3 h-8 rounded-lg bg-amber-500 dark:bg-amber-600 text-white hover:bg-amber-600 dark:hover:bg-amber-500 shadow-md shadow-amber-200 dark:shadow-none transition flex items-center justify-center gap-1 font-bold text-xs active:scale-95" title="Đề nghị mua sắm">
                                                                <i class="fa-solid fa-cart-plus"></i> Đề nghị mua
                                                            </button>
                                                        }
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                    }
                 </div>
             }
             
             <!-- Hidden input for quick Drive upload from list/grid -->
             <input id="quickDriveInput" #quickDriveInput type="file" class="hidden" accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx" (change)="handleQuickDriveUpload($event)">

             @if (hasMore() && !isLoading()) {
                <div class="text-center p-4">
                    <button (click)="loadMore()" class="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition active:scale-95 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-4 py-2 rounded-full shadow-sm dark:shadow-none">
                        Xem thêm...
                    </button>
                </div>
             }
          </div>
      </div>

      <!-- ADD/EDIT MODAL (3 TABS) -->
      @if (showModal()) {
         <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                
                <!-- Modal Header -->
                <div class="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                    <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
                        <i class="fa-solid fa-flask-vial text-indigo-600"></i>
                        {{ isEditing() ? 'Cập nhật Chuẩn' : 'Thêm Chuẩn Mới' }}
                    </h3>
                    <button (click)="closeModal()" class="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 transition active:scale-95"><i class="fa-solid fa-times"></i></button>
                </div>

                <!-- Tabs Header (Removed) -->
                
                <div class="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white dark:bg-slate-900">
                    <form [formGroup]="form" class="space-y-8">
                        
                        <!-- SECTION 1: GENERAL INFO -->
                        <div class="space-y-4 fade-in">
                            <h4 class="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2 uppercase tracking-wide">1. Thông tin chung</h4>
                            <div>
                                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">Tên Chuẩn <span class="text-red-500 dark:text-red-400">*</span></label>
                                <input id="stdNameInput" formControlName="name" (input)="onNameChange($event)" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-sm font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500/50" placeholder="VD: Sulfadiazine Standard">
                            </div>
                            <!-- NEW: Chemical Name Field -->
                            <div>
                                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">Tên hóa học / Tên khác</label>
                                <input formControlName="chemical_name" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500/50 italic" placeholder="VD: N-(2-pyrimidinyl)benzenesulfonamide">
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div><label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Mã sản phẩm (Code)</label><input formControlName="product_code" class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800"></div>
                                <div><label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Số CAS</label><input formControlName="cas_number" class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800"></div>
                                <div><label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Hãng sản xuất</label><input formControlName="manufacturer" class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800"></div>
                                <div><label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Hàm lượng (Purity)</label><input formControlName="purity" class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800" placeholder="VD: 99.5%"></div>
                            </div>
                            <div class="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <div><label class="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase block mb-1">Quy cách (Pack Size)</label><input formControlName="pack_size" class="w-full bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800/50 rounded-lg p-2 text-sm font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500/50" placeholder="VD: 10mg"></div>
                                <div><label class="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase block mb-1">Số Lô (Lot No.)</label><input formControlName="lot_number" class="w-full bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800/50 rounded-lg p-2 text-sm font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500/50" placeholder="VD: BCBW1234"></div>
                            </div>
                        </div>

                        <!-- SECTION 2: STOCK & STORAGE -->
                        <div class="space-y-4 fade-in">
                            <h4 class="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2 uppercase tracking-wide">2. Kho & Bảo quản</h4>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Điều kiện bảo quản</label>
                                    <input formControlName="storage_condition" class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500" placeholder="VD: FT, CT, RT...">
                                </div>
                                <div>
                                    <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Vị trí (Location)</label>
                                    <input formControlName="location" class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500" placeholder="Tự động từ ĐK bảo quản (VD: Tủ A)">
                                </div>
                            </div>
                            
                            <div>
                                <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Mã Quản lý (Internal ID)</label>
                                <input formControlName="internal_id" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-sm font-bold font-mono text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 uppercase" placeholder="VD: AA01">
                            </div>
                            
                            <div class="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50 grid grid-cols-3 gap-4">
                                <div><label class="text-[10px] font-bold text-indigo-800 dark:text-indigo-400 uppercase block mb-1">Tồn đầu</label><input type="number" formControlName="initial_amount" class="w-full bg-white dark:bg-slate-800 border border-white dark:border-slate-700 rounded-lg p-2 text-center font-bold text-slate-800 dark:text-slate-200 outline-none"></div>
                                <div><label class="text-[10px] font-bold text-indigo-800 dark:text-indigo-400 uppercase block mb-1">Hiện tại</label><input type="number" formControlName="current_amount" class="w-full bg-white dark:bg-slate-800 border border-white dark:border-slate-700 rounded-lg p-2 text-center font-bold text-indigo-600 dark:text-indigo-400 outline-none text-lg"></div>
                                <div>
                                    <label class="text-[10px] font-bold text-indigo-800 dark:text-indigo-400 uppercase block mb-1">Đơn vị</label>
                                    <select formControlName="unit" class="w-full bg-white dark:bg-slate-800 border border-white dark:border-slate-700 rounded-lg p-2.5 text-center font-bold text-slate-800 dark:text-slate-200 outline-none h-[44px]">
                                        @for(u of unitOptions; track u.value){<option [value]="u.value">{{u.value}}</option>}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- SECTION 3: DOCS & EXPIRY -->
                        <div class="space-y-4 fade-in pb-4">
                            <h4 class="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2 uppercase tracking-wide">3. Hồ sơ & Hạn dùng</h4>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Ngày nhận (Received)</label>
                                    <input type="date" formControlName="received_date" class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm font-bold text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 [color-scheme:light] dark:[color-scheme:dark]">
                                </div>
                                <div>
                                    <label class="text-[10px] font-bold text-red-400 dark:text-red-500 uppercase block mb-1">Hạn sử dụng (Expiry)</label>
                                    <div class="flex items-center gap-2">
                                        <input type="date" formControlName="expiry_date" class="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg p-2 text-sm font-bold text-red-600 dark:text-red-400 outline-none focus:border-red-500 dark:focus:border-red-500 [color-scheme:light] dark:[color-scheme:dark]" (keydown.enter)="saveStandard(false)">
                                    </div>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div><label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Ngày mở nắp</label><input type="date" formControlName="date_opened" class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 [color-scheme:light] dark:[color-scheme:dark]"></div>
                                <div><label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Số Hợp đồng / Dự án</label><input formControlName="contract_ref" class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500"></div>
                            </div>
                            
                            <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
                                <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">COA File (Link/Upload)</label>
                                <div class="flex gap-2">
                                    <input formControlName="certificate_ref" (input)="sanitizeDriveLink($event)" class="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-blue-600 dark:text-blue-400 underline outline-none focus:border-indigo-500 dark:focus:border-indigo-500" placeholder="Paste URL here..." (keydown.enter)="saveStandard(false)">
                                    @if(auth.currentUser()?.role === 'manager') {
                                        <button type="button" (click)="uploadInput.click()" [disabled]="isUploading() || isDriveUploading()" class="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 px-3 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap disabled:opacity-50" title="Upload lên Firebase Storage">
                                            @if(isUploading()){ <i class="fa-solid fa-spinner fa-spin"></i> } @else { <i class="fa-solid fa-cloud-arrow-up"></i> Upload }
                                        </button>
                                        <input #uploadInput type="file" class="hidden" (change)="uploadCoaFile($event)">
                                        <button type="button" (click)="driveInput.click()" [disabled]="isDriveUploading() || isUploading()" class="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap disabled:opacity-50 border border-blue-200 dark:border-blue-800/50" title="Upload lên Google Drive (15GB free, tự đặt tên)">
                                            @if(isDriveUploading()){ <i class="fa-solid fa-spinner fa-spin"></i> Uploading... } @else { <i class="fa-brands fa-google-drive"></i> Drive }
                                        </button>
                                        <input #driveInput type="file" class="hidden" accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx" (change)="uploadCoaToDrive($event)">
                                    }
                                </div>
                                <p class="text-[9px] text-slate-400 dark:text-slate-500 mt-1 italic"><i class="fa-brands fa-google-drive mr-0.5"></i> Nút Drive: upload tự động lên Google Drive, đặt tên theo chuẩn, gán link preview. <span class="text-blue-500 dark:text-blue-400">15GB free!</span></p>
                            </div>
                        </div>

                    </form>
                </div>

                <!-- Footer Actions -->
                <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 shrink-0">
                    <button (click)="closeModal()" class="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold text-sm transition">Hủy bỏ</button>
                    @if(!isEditing()) {
                        <button (click)="saveStandard(true)" [disabled]="form.invalid || isProcessing()" class="px-5 py-2.5 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md dark:shadow-none transition disabled:opacity-50">
                            @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> } 
                            @else { <i class="fa-solid fa-plus"></i> Lưu & Thêm tiếp }
                        </button>
                    }
                    <button (click)="saveStandard(false)" [disabled]="form.invalid || isProcessing()" class="px-6 py-2.5 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-md dark:shadow-none transition disabled:opacity-50">
                        @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> Đang lưu... } 
                        @else { {{ isEditing() ? 'Lưu Thay Đổi' : 'Tạo Mới' }} }
                    </button>
                </div>
            </div>
         </div>
      }

      <!-- IMPORT PREVIEW MODAL -->
      @if (importPreviewData().length > 0) {
         <div class="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-7xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                
                <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center shrink-0">
                    <div>
                        <h3 class="font-black text-slate-800 dark:text-slate-200 text-lg flex items-center gap-2">
                            <i class="fa-solid fa-file-import text-emerald-600 dark:text-emerald-500"></i> Xác nhận Import
                        </h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Vui lòng kiểm tra kỹ ngày tháng trước khi lưu.</p>
                    </div>
                    <button (click)="cancelImport()" class="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition active:scale-95"><i class="fa-solid fa-times"></i></button>
                </div>

                <div class="flex-1 overflow-auto custom-scrollbar p-6">
                    <div class="mb-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800/50 rounded-lg p-3 flex gap-3 text-sm text-yellow-800 dark:text-yellow-500">
                        <i class="fa-solid fa-triangle-exclamation mt-0.5"></i>
                        <div>
                            <span class="font-bold">Lưu ý ngày tháng:</span> Hệ thống đang ép kiểu ngày tháng theo định dạng <b>dd/mm/yyyy</b> (Việt Nam).<br>
                            Ví dụ: Chuỗi <b>05/10/2024</b> sẽ được hiểu là ngày <b>5 tháng 10</b>. Hãy kiểm tra cột "Kết quả (Hệ thống hiểu)" bên dưới.
                        </div>
                    </div>

                    <table class="w-full text-xs text-left border-collapse border border-slate-200 dark:border-slate-700">
                        <thead class="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase sticky top-0">
                            <tr>
                                <th class="p-2 border border-slate-200 dark:border-slate-700">Tên Chuẩn</th>
                                <th class="p-2 border border-slate-200 dark:border-slate-700">Lô (Lot)</th>
                                <th class="p-2 border border-slate-200 dark:border-slate-700 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 w-32">Ngày nhận (Gốc)</th>
                                <th class="p-2 border border-slate-200 dark:border-slate-700 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 w-32">Kết quả (Hệ thống hiểu)</th>
                                <th class="p-2 border border-slate-200 dark:border-slate-700">Hạn dùng (Parsed)</th>
                            </tr>
                        </thead>
                        <tbody class="text-slate-700 dark:text-slate-300">
                            @for (item of importPreviewData().slice(0, 10); track $index) {
                                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td class="p-2 border border-slate-200 dark:border-slate-700 break-words" [title]="item.parsed.name">{{item.parsed.name}}</td>
                                    <td class="p-2 border border-slate-200 dark:border-slate-700 font-mono">{{item.parsed.lot_number}}</td>
                                    <td class="p-2 border border-slate-200 dark:border-slate-700 font-mono bg-red-50/30 dark:bg-red-900/10">{{item.raw['Ngày nhận (Gốc)']}}</td>
                                    <td class="p-2 border border-slate-200 dark:border-slate-700 font-bold font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-900/10">
                                        {{item.parsed.received_date ? (item.parsed.received_date | date:'dd/MM/yyyy') : '---'}}
                                    </td>
                                    <td class="p-2 border border-slate-200 dark:border-slate-700 font-mono">
                                        {{item.parsed.expiry_date ? (item.parsed.expiry_date | date:'dd/MM/yyyy') : '---'}}
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                    @if(importPreviewData().length > 10) {
                        <p class="text-center text-xs text-slate-400 dark:text-slate-500 mt-2 italic">... và {{importPreviewData().length - 10}} dòng khác.</p>
                    }
                </div>

                <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 shrink-0">
                    <button (click)="cancelImport()" class="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold text-sm transition">Hủy bỏ</button>
                    <button (click)="confirmImport()" [disabled]="isImporting()" class="px-6 py-2.5 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md dark:shadow-none transition disabled:opacity-50 flex items-center gap-2">
                        @if(isImporting()) { <i class="fa-solid fa-spinner fa-spin"></i> Đang lưu... }
                        @else { <i class="fa-solid fa-check"></i> Xác nhận Import }
                    </button>
                </div>
            </div>
         </div>
      }

      <!-- IMPORT USAGE LOG PREVIEW MODAL -->
      @if (importUsageLogPreviewData().length > 0) {
         <div class="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-7xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                
                <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center shrink-0">
                    <div>
                        <h3 class="font-black text-slate-800 dark:text-slate-200 text-lg flex items-center gap-2">
                            <i class="fa-solid fa-book-open text-teal-600 dark:text-teal-500"></i> Xác nhận Import Nhật ký
                        </h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Vui lòng kiểm tra dữ liệu trước khi lưu. Các dòng lỗi hoặc trùng lặp sẽ bị bỏ qua.</p>
                    </div>
                    <button (click)="cancelImport()" class="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition active:scale-95"><i class="fa-solid fa-times"></i></button>
                </div>

                <div class="flex-1 overflow-auto p-6 bg-white dark:bg-slate-900">
                    <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-500 p-4 rounded-xl text-sm flex items-start gap-3">
                        <i class="fa-solid fa-triangle-exclamation mt-0.5 text-amber-500 dark:text-amber-400"></i>
                        <div>
                            <strong>Lưu ý quan trọng:</strong>
                            <ul class="list-disc pl-5 mt-1 space-y-1 text-amber-700/80 dark:text-amber-400/80">
                                <li>Hệ thống sẽ tự động tìm kiếm chất chuẩn dựa trên <strong>Số nhận diện</strong> hoặc <strong>Tên + Số lô</strong>.</li>
                                <li>Nếu nhật ký (cùng ngày, người pha, lượng dùng) đã tồn tại, dòng đó sẽ bị bỏ qua (trùng lặp).</li>
                                <li>Lượng dùng sẽ được tự động trừ vào tồn kho hiện tại của chất chuẩn.</li>
                            </ul>
                        </div>
                    </div>

                    <table class="w-full text-sm text-left mt-4">
                        <thead>
                            <tr class="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-100 dark:bg-slate-800">
                                <th class="p-2 border border-slate-200 dark:border-slate-700 w-10 text-center">STT</th>
                                <th class="p-2 border border-slate-200 dark:border-slate-700">Chất chuẩn (Excel)</th>
                                <th class="p-2 border border-slate-200 dark:border-slate-700">Ngày pha</th>
                                <th class="p-2 border border-slate-200 dark:border-slate-700">Người pha</th>
                                <th class="p-2 border border-slate-200 dark:border-slate-700 text-right">Lượng dùng</th>
                                <th class="p-2 border border-slate-200 dark:border-slate-700">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody class="text-slate-700 dark:text-slate-300">
                            @for (item of importUsageLogPreviewData().slice(0, 15); track $index) {
                                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50" [ngClass]="{'bg-red-50 dark:bg-red-900/10': !item.isValid, 'bg-amber-50 dark:bg-amber-900/10': item.isDuplicate}">
                                    <td class="p-2 border border-slate-200 dark:border-slate-700 text-center text-slate-400 dark:text-slate-500">{{$index + 1}}</td>
                                    <td class="p-2 border border-slate-200 dark:border-slate-700">
                                        <div class="font-bold text-slate-700 dark:text-slate-200 break-words" [title]="item.raw['Tên']">{{item.raw['Tên']}}</div>
                                        <div class="text-xs text-slate-500 dark:text-slate-400 font-mono">Lô: {{item.raw['Lô']}}</div>
                                        @if(item.standard) {
                                            <div class="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1"><i class="fa-solid fa-check-circle"></i> Map: {{item.standard.internal_id || 'OK'}}</div>
                                        }
                                    </td>
                                    <td class="p-2 border border-slate-200 dark:border-slate-700 font-mono">{{item.raw['Ngày']}} <br> <span class="text-xs text-slate-400 dark:text-slate-500">{{item.log.date | date:'dd/MM/yyyy'}}</span></td>
                                    <td class="p-2 border border-slate-200 dark:border-slate-700">{{item.raw['Người']}}</td>
                                    <td class="p-2 border border-slate-200 dark:border-slate-700 text-right font-mono font-bold">
                                        {{item.raw['Lượng']}}
                                        @if(item.standard) { <span class="text-xs font-normal text-slate-500 dark:text-slate-400">{{item.standard.unit}}</span> }
                                    </td>
                                    <td class="p-2 border border-slate-200 dark:border-slate-700">
                                        @if(item.isValid && !item.isDuplicate) {
                                            <span class="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded text-xs font-bold"><i class="fa-solid fa-check"></i> Hợp lệ</span>
                                        } @else if (item.isDuplicate) {
                                            <span class="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded text-xs font-bold" title="Nhật ký này đã có trong hệ thống"><i class="fa-solid fa-copy"></i> Trùng lặp</span>
                                        } @else {
                                            <span class="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs font-bold" [title]="item.errorMessage"><i class="fa-solid fa-xmark"></i> Lỗi</span>
                                            <div class="text-[10px] text-red-500 dark:text-red-400 mt-1">{{item.errorMessage}}</div>
                                        }
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                    @if(importUsageLogPreviewData().length > 15) {
                        <p class="text-center text-xs text-slate-400 dark:text-slate-500 mt-2 italic">... và {{importUsageLogPreviewData().length - 15}} dòng khác.</p>
                    }
                </div>

                <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center shrink-0">
                    <div class="text-sm font-bold text-slate-600 dark:text-slate-400">
                        Tổng: {{importUsageLogPreviewData().length}} | 
                        <span class="text-emerald-600 dark:text-emerald-400">Hợp lệ: {{validUsageLogsCount()}}</span> | 
                        <span class="text-amber-600 dark:text-amber-400">Trùng: {{duplicateUsageLogsCount()}}</span> | 
                        <span class="text-red-500 dark:text-red-400">Lỗi: {{errorUsageLogsCount()}}</span>
                    </div>
                    <div class="flex gap-3">
                        <button (click)="cancelImport()" class="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold text-sm transition">Hủy bỏ</button>
                        <button (click)="confirmUsageLogImport()" [disabled]="isImporting() || validUsageLogsCount() === 0" class="px-6 py-2.5 bg-teal-600 dark:bg-teal-500 hover:bg-teal-700 dark:hover:bg-teal-600 text-white rounded-xl font-bold text-sm shadow-md dark:shadow-none transition disabled:opacity-50 flex items-center gap-2">
                            @if(isImporting()) { <i class="fa-solid fa-spinner fa-spin"></i> Đang lưu... }
                            @else { <i class="fa-solid fa-check"></i> Import Hợp lệ }
                        </button>
                    </div>
                </div>
            </div>
         </div>
      }

      <!-- History, COA Preview Modals... (No changes needed here) -->

      @if (showAssignModal() && selectedStd()) {
         <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
            <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-3xl flex overflow-hidden animate-bounce-in border border-slate-100 dark:border-slate-800">
                <!-- Left: Standard Info Summary -->
                <div class="hidden md:flex w-2/5 bg-slate-50 dark:bg-slate-800/50 p-8 flex-col border-r border-slate-100 dark:border-slate-800">
                    <div class="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
                        <i class="fa-solid fa-vial"></i>
                    </div>
                    
                    <h3 class="text-xl font-black text-slate-800 dark:text-slate-100 leading-tight mb-2Line line-clamp-2">{{selectedStd()?.name}}</h3>
                    <div class="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-6">Thông tin chuẩn mượn</div>

                    <div class="space-y-4">
                        <div class="flex flex-col">
                            <span class="text-[10px] font-bold text-slate-400 uppercase">Số Lô / Lot</span>
                            <span class="text-sm font-bold text-slate-700 dark:text-slate-200">{{selectedStd()?.lot_number || 'N/A'}}</span>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-[10px] font-bold text-slate-400 uppercase">Hạn dùng</span>
                            <span class="text-sm font-bold" [class]="getExpiryClass(selectedStd()?.expiry_date)">{{selectedStd()?.expiry_date || 'N/A'}}</span>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-[10px] font-bold text-slate-400 uppercase">Lượng tồn kho</span>
                            <span class="text-sm font-bold text-emerald-600">{{selectedStd()?.current_amount}} {{selectedStd()?.unit}}</span>
                        </div>
                        @if(selectedStd()?.internal_id) {
                            <div class="flex flex-col">
                                <span class="text-[10px] font-bold text-slate-400 uppercase">Mã quản lý</span>
                                <span class="text-sm font-bold text-slate-500">{{selectedStd()?.internal_id}}</span>
                            </div>
                        }
                    </div>

                    <div class="mt-auto pt-6 border-t border-slate-200 dark:border-slate-700">
                        <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                            <p class="text-[10px] text-blue-700 dark:text-blue-400 leading-relaxed font-medium">
                                <i class="fa-solid fa-circle-info mr-1"></i>
                                Vui lòng ghi lại nhật ký sử dụng sau khi pha xong để hệ thống trừ kho chính xác.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Right: Borrow Form -->
                <div class="flex-1 p-8 flex flex-col bg-white dark:bg-slate-900">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                            {{ isAssignMode() ? 'Gán cho nhân viên' : 'Mượn chuẩn sử dụng' }}
                        </h3>
                        <button (click)="showAssignModal.set(false)" class="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition"><i class="fa-solid fa-times"></i></button>
                    </div>

                    <div class="flex-1 space-y-5 overflow-y-auto pr-2 custom-scrollbar">
                        @if(isAssignMode()) {
                            <div>
                                <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Nhân viên tiếp nhận <span class="text-red-500">*</span></label>
                                <select [ngModel]="assignUserId()" (ngModelChange)="onAssignUserChange($event)" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none appearance-none">
                                    <option value="">-- Chọn nhân viên --</option>
                                    @for (user of userList(); track user.uid) {
                                        <option [value]="user.uid">{{user.displayName}} ({{user.email}})</option>
                                    }
                                </select>
                            </div>
                        }

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Ngày dự kiến trả</label>
                                <input type="date" [ngModel]="assignExpectedDate()" (ngModelChange)="assignExpectedDate.set($event)" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 outline-none [color-scheme:light] dark:[color-scheme:dark]">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Lượng dự kiến dùng ({{selectedStd()?.unit}})</label>
                                <input type="number" [ngModel]="assignExpectedAmount()" (ngModelChange)="assignExpectedAmount.set($event)" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 outline-none" placeholder="VD: 5">
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Mục đích sử dụng <span class="text-red-500">*</span></label>
                            <textarea [ngModel]="assignPurpose()" (ngModelChange)="assignPurpose.set($event)" rows="3" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none placeholder-slate-300" placeholder="Nhập mục đích sử dụng..."></textarea>
                            
                            <div class="flex flex-wrap gap-2 mt-2">
                                <button (click)="assignPurpose.set('Pha chuẩn máy')" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Pha chuẩn máy</button>
                                <button (click)="assignPurpose.set('Kiểm tra định kỳ')" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Kiểm tra định kỳ</button>
                                <button (click)="assignPurpose.set('Ngoại kiểm')" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Ngoại kiểm</button>
                                <button (click)="assignPurpose.set('Nghiên cứu phát triển')" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Nghiên cứu phát triển</button>
                                <button (click)="assignPurpose.set('Kiểm nghiệm mẫu')" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg transition border border-transparent hover:border-indigo-200"># Kiểm nghiệm mẫu</button>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button (click)="showAssignModal.set(false)" class="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition">Hủy bỏ</button>
                        <button (click)="confirmAssign()" [disabled]="!assignUserId() || !assignPurpose() || isProcessing()" class="px-8 py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-bold text-sm rounded-2xl hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-xl shadow-indigo-200 dark:shadow-none transition disabled:opacity-50 flex items-center gap-2">
                            @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> } @else { <i class="fa-solid fa-paper-plane text-xs"></i> Xác nhận mượn }
                        </button>
                    </div>
                </div>
            </div>
         </div>
      }

      @if (showPrintModal()) {
         <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
            <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl flex overflow-hidden animate-bounce-in max-h-[90vh]">
                <!-- Left: Settings -->
                <div class="w-1/2 p-8 border-r border-slate-100 dark:border-slate-800 overflow-y-auto custom-scrollbar flex flex-col">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                            <i class="fa-solid fa-print"></i>
                        </div>
                        <div>
                            <h3 class="font-black text-xl text-slate-800 dark:text-slate-100 leading-tight">In Nhãn Chuẩn</h3>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 break-words" [title]="selectedStd()?.name">{{selectedStd()?.name}}</p>
                        </div>
                    </div>
                    
                    <div class="space-y-6 flex-1">
                        <!-- Template Selection -->
                        <div>
                            <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Mẫu nhãn</label>
                            <div class="grid grid-cols-3 gap-2">
                                <button (click)="onTemplateChange('standard')" [ngClass]="{'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/30': printTemplate() === 'standard'}" class="p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                                    <div class="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">Tiêu chuẩn</div>
                                    <div class="text-[10px] text-slate-500 dark:text-slate-400">Thông tin cơ bản</div>
                                </button>
                                <button (click)="onTemplateChange('detailed')" [ngClass]="{'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/30': printTemplate() === 'detailed'}" class="p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                                    <div class="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">Chi tiết</div>
                                    <div class="text-[10px] text-slate-500 dark:text-slate-400">Đầy đủ thông tin</div>
                                </button>
                                <button (click)="onTemplateChange('qr')" [ngClass]="{'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/30': printTemplate() === 'qr'}" class="p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                                    <div class="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">Mã QR</div>
                                    <div class="text-[10px] text-slate-500 dark:text-slate-400">Kèm mã QR code</div>
                                </button>
                            </div>
                        </div>

                        <!-- Dimensions -->
                        <div>
                            <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Kích thước nhãn</label>
                            <select [ngModel]="printPaperSize()" (ngModelChange)="onPaperSizeChange($event)" class="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50 transition mb-3">
                                <option value="22x12">22 x 12 mm (Tem nhỏ)</option>
                                <option value="35x22">35 x 22 mm (Tem chuẩn)</option>
                                <option value="50x30">50 x 30 mm (Tem trung)</option>
                                <option value="70x50">70 x 50 mm (Tem lớn)</option>
                                <option value="custom">Tùy chỉnh...</option>
                            </select>
                            
                            @if (printPaperSize() === 'custom') {
                                <div class="grid grid-cols-3 gap-3">
                                    <div>
                                        <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Rộng (mm)</label>
                                        <input type="number" [ngModel]="printWidth()" (ngModelChange)="printWidth.set($event)" class="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50 transition">
                                    </div>
                                    <div>
                                        <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Cao (mm)</label>
                                        <input type="number" [ngModel]="printHeight()" (ngModelChange)="printHeight.set($event)" class="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50 transition">
                                    </div>
                                    <div>
                                        <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Cỡ chữ (pt)</label>
                                        <input type="number" [ngModel]="printFontSize()" (ngModelChange)="printFontSize.set($event)" class="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50 transition">
                                    </div>
                                </div>
                            }
                        </div>

                        <!-- Fields to Include -->
                        <div>
                            <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Thông tin hiển thị</label>
                            <div class="grid grid-cols-2 gap-y-3 gap-x-4">
                                <label class="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" [ngModel]="printIncludeName()" (ngModelChange)="printIncludeName.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600">
                                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition">Tên chuẩn</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" [ngModel]="printIncludeLot()" (ngModelChange)="printIncludeLot.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600">
                                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition">Số Lot</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" [ngModel]="printIncludePurity()" (ngModelChange)="printIncludePurity.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600">
                                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition">Độ tinh khiết</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" [ngModel]="printIncludeOpened()" (ngModelChange)="printIncludeOpened.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600">
                                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition">Ngày mở</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" [ngModel]="printIncludeExpiry()" (ngModelChange)="printIncludeExpiry.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600">
                                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition">Hạn sử dụng</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" [ngModel]="printIncludeStorage()" (ngModelChange)="printIncludeStorage.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600">
                                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition">Bảo quản</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" [ngModel]="printIncludeManufacturer()" (ngModelChange)="printIncludeManufacturer.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600">
                                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition">Nhà SX</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" [ngModel]="printIncludeCas()" (ngModelChange)="printIncludeCas.set($event)" class="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600">
                                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition">Số CAS</span>
                                </label>
                            </div>
                        </div>

                        <!-- Copies -->
                        <div>
                            <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Số bản in</label>
                            <div class="flex items-center gap-2 w-32">
                                <button (click)="printCopies.set(Math.max(1, printCopies() - 1))" class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition"><i class="fa-solid fa-minus text-xs"></i></button>
                                <input type="number" [ngModel]="printCopies()" (ngModelChange)="printCopies.set($event)" min="1" class="flex-1 w-full text-center border-none bg-transparent font-bold text-slate-800 dark:text-slate-200 focus:ring-0 p-0">
                                <button (click)="printCopies.set(printCopies() + 1)" class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition"><i class="fa-solid fa-plus text-xs"></i></button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex justify-between items-center mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <button (click)="showPrintModal.set(false)" class="px-5 py-2.5 text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition">Hủy bỏ</button>
                        <button (click)="printLabel()" class="px-8 py-2.5 bg-indigo-600 dark:bg-indigo-500 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none transition flex items-center gap-2">
                            <i class="fa-solid fa-print"></i> In {{printCopies()}} nhãn
                        </button>
                    </div>
                </div>

                <!-- Right: Preview -->
                <div class="w-1/2 bg-slate-50 dark:bg-slate-900/50 p-8 flex flex-col items-center justify-center relative">
                    <div class="absolute top-4 left-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <i class="fa-solid fa-eye"></i> Xem trước
                    </div>
                    
                    <!-- Preview Container (Scaled to fit) -->
                    <div class="bg-white shadow-sm border border-slate-200 flex flex-col justify-center text-black overflow-hidden relative"
                         [style.width.mm]="printWidth()"
                         [style.height.mm]="printHeight()"
                         [style.padding.mm]="2"
                         [style.transform]="'scale(' + getPreviewScale() + ')'"
                         style="transform-origin: center center; transition: all 0.3s ease;">
                         
                         <div [style.font-size.pt]="printFontSize()" style="line-height: 1.2; width: 100%; height: 100%;">
                            @if (printTemplate() === 'qr') {
                                <div style="display: flex; height: 100%; gap: 4px;">
                                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; overflow: hidden;">
                                        @if (printIncludeName()) { <div style="font-weight: bold; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" [style.font-size.pt]="printFontSize() + 2">{{selectedStd()?.name}}</div> }
                                        @if (printIncludeLot()) { <div style="display: flex; justify-content: space-between; margin-bottom: 1px;"><span>Lot: <span style="font-weight: bold;">{{selectedStd()?.lot_number || 'N/A'}}</span></span></div> }
                                        @if (printIncludePurity()) { <div style="display: flex; justify-content: space-between; margin-bottom: 1px;"><span>Pur: <span style="font-weight: bold;">{{selectedStd()?.purity || 'N/A'}}</span></span></div> }
                                        @if (printIncludeExpiry()) { <div style="display: flex; justify-content: space-between; margin-bottom: 1px;"><span>Exp: <span style="font-weight: bold;">{{selectedStd()?.expiry_date ? (selectedStd()?.expiry_date | date:'dd/MM/yyyy') : 'N/A'}}</span></span></div> }
                                    </div>
                                    <div style="width: 30%; display: flex; align-items: center; justify-content: center;">
                                        <img [src]="getQrCodeUrl(selectedStd())" style="width: 100%; height: auto; max-height: 100%;" />
                                    </div>
                                </div>
                            } @else {
                                <div style="display: flex; flex-direction: column; justify-content: center; height: 100%; overflow: hidden;">
                                    @if (printIncludeName()) { <div style="font-weight: bold; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" [style.font-size.pt]="printFontSize() + 2">{{selectedStd()?.name}}</div> }
                                    
                                    @if (printTemplate() === 'detailed') {
                                        @if (printIncludeCas() || printIncludeManufacturer()) {
                                            <div style="display: flex; justify-content: space-between; margin-bottom: 1px;">
                                                @if(printIncludeCas()) { <span>CAS: <span style="font-weight: bold;">{{selectedStd()?.cas_number || 'N/A'}}</span></span> }
                                                @if(printIncludeManufacturer()) { <span>Mfr: <span style="font-weight: bold;">{{selectedStd()?.manufacturer || 'N/A'}}</span></span> }
                                            </div>
                                        }
                                    }

                                    @if (printIncludeLot() || printIncludePurity()) {
                                        <div style="display: flex; justify-content: space-between; margin-bottom: 1px;">
                                            @if(printIncludeLot()) { <span>Lot: <span style="font-weight: bold;">{{selectedStd()?.lot_number || 'N/A'}}</span></span> }
                                            @if(printIncludePurity()) { <span>Pur: <span style="font-weight: bold;">{{selectedStd()?.purity || 'N/A'}}</span></span> }
                                        </div>
                                    }
                                    
                                    @if (printIncludeOpened() || printIncludeExpiry()) {
                                        <div style="display: flex; justify-content: space-between; margin-bottom: 1px;">
                                            @if(printIncludeOpened()) { <span>Opn: <span style="font-weight: bold;">{{selectedStd()?.date_opened ? (selectedStd()?.date_opened | date:'dd/MM/yy') : '__/__/__'}}</span></span> }
                                            @if(printIncludeExpiry()) { <span>Exp: <span style="font-weight: bold;">{{selectedStd()?.expiry_date ? (selectedStd()?.expiry_date | date:'dd/MM/yy') : 'N/A'}}</span></span> }
                                        </div>
                                    }

                                    @if (printIncludeStorage()) {
                                        <div style="display: flex; justify-content: space-between; margin-bottom: 1px;">
                                            <span>Store: <span style="font-weight: bold;">{{selectedStd()?.storage_condition || 'N/A'}}</span></span>
                                        </div>
                                    }
                                </div>
                            }
                         </div>
                    </div>
                    
                    <div class="mt-6 text-[10px] text-slate-400 dark:text-slate-500 text-center max-w-[250px]">
                        Bản xem trước mang tính tương đối. Kết quả in thực tế phụ thuộc vào máy in và trình duyệt.
                    </div>
                </div>
            </div>
         </div>
      }

      @if (historyStd()) {
         <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[85vh]">
               <div class="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center shrink-0">
                  <div><h3 class="font-bold text-slate-800 dark:text-slate-200 text-lg">Lịch sử sử dụng</h3><p class="text-xs text-slate-500 dark:text-slate-400 font-mono">{{historyStd()?.name}}</p></div>
                  <button (click)="historyStd.set(null)" class="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition"><i class="fa-solid fa-times text-xl"></i></button>
               </div>
               <div class="flex-1 overflow-y-auto p-0 custom-scrollbar">
                  <table class="w-full text-sm text-left"><thead class="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase sticky top-0 border-b border-slate-100 dark:border-slate-800 shadow-sm"><tr><th class="px-6 py-4 w-32">Thời gian</th><th class="px-6 py-4">Người thực hiện</th><th class="px-6 py-4">Mục đích</th><th class="px-6 py-4 text-right w-32">Lượng dùng</th>@if(state.isAdmin()){<th class="px-6 py-4 text-center w-24">Tác vụ</th>}</tr></thead><tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
                        @if (loadingHistory()) { <tr><td colspan="5" class="p-8 text-center text-slate-400 dark:text-slate-500"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải...</td></tr> } @else {
                            @for (log of historyLogs(); track log.id) { <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition group"> <td class="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono text-xs">{{ log.date | date:'dd/MM/yyyy' }}</td><td class="px-6 py-4"><div class="font-bold text-slate-700 dark:text-slate-300 text-xs">{{ log.user }}</div></td><td class="px-6 py-4"><div class="text-slate-600 dark:text-slate-400 text-xs italic line-clamp-2" [title]="log.purpose || ''">{{ log.purpose || 'N/A' }}</div></td><td class="px-6 py-4 text-right"><span class="font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded text-xs">-{{ formatNum(log.amount_used) }} <span class="text-[9px] text-slate-500 dark:text-slate-400">{{log.unit || historyStd()?.unit}}</span></span></td>@if(state.isAdmin()){<td class="px-6 py-4 text-center"><button (click)="deleteLog(log)" [disabled]="isProcessing()" class="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-2 disabled:opacity-50"><i class="fa-solid fa-trash"></i></button></td>}</tr> } @empty { <tr><td colspan="5" class="p-8 text-center text-slate-400 dark:text-slate-500 italic">Chưa có dữ liệu.</td></tr> }
                        }
                  </tbody></table>
               </div>
            </div>
         </div>
      }

      <!-- COA PREVIEW -->
      @if (previewUrl() || previewImgUrl()) {
          <div class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm fade-in" (click)="closeCoaPreview()">
              <div class="relative w-full max-w-7xl h-[85vh] bg-white dark:bg-slate-900 rounded-lg shadow-2xl overflow-hidden flex flex-col" (click)="$event.stopPropagation()">
                  <div class="bg-slate-900 dark:bg-slate-950 text-white p-3 flex justify-between items-center shrink-0"><span class="text-sm font-bold pl-2"><i class="fa-solid fa-file-pdf mr-2"></i> Preview Certificate of Analysis</span><div class="flex gap-3"><a [href]="previewRawUrl()" target="_blank" class="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded transition">Mở Tab mới</a><button (click)="closeCoaPreview()" class="text-white hover:text-red-400 transition"><i class="fa-solid fa-times text-lg"></i></button></div></div>
                  <div class="flex-1 bg-slate-100 dark:bg-slate-800 relative">
                      @if(previewType() === 'image') { <div class="w-full h-full flex items-center justify-center overflow-auto"><img [src]="previewImgUrl()" class="max-w-full max-h-full object-contain shadow-lg"></div> } 
                      @else { <iframe [src]="previewUrl()" class="w-full h-full border-none"></iframe> }
                  </div>
              </div>
          </div>
      }
      <!-- PURCHASE REQUEST MODAL -->
      @if (showPurchaseRequestModal()) {
         <div class="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up border border-amber-100 dark:border-amber-900/40">
               <div class="px-6 py-4 border-b border-amber-100 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-900/10 flex justify-between items-center">
                   <h3 class="font-black text-amber-800 dark:text-amber-500 text-lg flex items-center gap-2"><i class="fa-solid fa-cart-plus"></i> Đề nghị mua sắm</h3>
                   <button (click)="closePurchaseRequestModal()" class="text-slate-400 hover:text-red-500 rounded-full w-8 h-8 flex items-center justify-center border border-slate-200 dark:border-slate-700 transition"><i class="fa-solid fa-times"></i></button>
               </div>
               <form [formGroup]="purchaseForm" (ngSubmit)="submitPurchaseRequest()" class="p-6 flex flex-col gap-4">
                   <div class="text-sm border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-r text-amber-800 dark:text-amber-200">
                       Xin cấp mới: <span class="font-black truncate max-w-full block" [title]="selectedPurchaseStd()?.name">{{selectedPurchaseStd()?.name}}</span>
                       Code: <span class="font-mono font-bold">{{selectedPurchaseStd()?.product_code || 'N/A'}}</span>
                   </div>
                   
                   <div><label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Mức độ ưu tiên *</label><select formControlName="priority" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 dark:text-white"><option value="NORMAL">Bình thường</option><option value="HIGH">Khẩn cấp</option></select></div>
                   
                   <div><label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Số lượng dự kiến cần *</label><input type="text" formControlName="expectedAmount" placeholder="VD: 2 chai 10mg" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 dark:text-white"></div>
                   
                   <div><label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Hãng cần mua</label><input type="text" formControlName="preferred_manufacturer" placeholder="VD: Sigma Aldrich" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 dark:text-white"></div>
                   
                   <div><label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Cấp độ chuẩn (VD: ISO 17034)</label><input type="text" formControlName="required_level" placeholder="ISO 17034 / CRM / SRM..." class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 dark:text-white"></div>
                   
                   <div><label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Độ tinh khiết yêu cầu</label><input type="text" formControlName="required_purity" placeholder="VD: >= 99%" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 dark:text-white"></div>
                   
                   <div><label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Ghi chú / Lý do mua</label><textarea formControlName="notes" rows="2" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 dark:text-white" placeholder="Mục đích sử dụng..."></textarea></div>
                   
                   <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                       <button type="button" (click)="closePurchaseRequestModal()" class="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl font-bold text-sm transition">Hủy</button>
                       <button type="submit" [disabled]="purchaseForm.invalid || isProcessing()" class="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-xl font-bold text-sm shadow-md dark:shadow-none transition disabled:opacity-50 flex items-center gap-2"><i class="fa-solid fa-paper-plane text-xs"></i> Gửi yêu cầu</button>
                   </div>
               </form>
            </div>
         </div>
      }


    </div>
  `
})
export class StandardsComponent implements OnInit, OnDestroy {
  state = inject(StateService);
  auth = inject(AuthService);
  stdService = inject(StandardService);
  firebaseService = inject(FirebaseService); 
  toast = inject(ToastService);
  confirmationService = inject(ConfirmationService);
  sanitizer: DomSanitizer = inject(DomSanitizer); 
  router = inject(Router);
  private fb: FormBuilder = inject(FormBuilder);
  private googleDriveService = inject(GoogleDriveService);
  Math = Math;
  
  isLoading = signal(true);
  isUploading = signal(false);
  isDriveUploading = signal(false);
  quickUploadStdId = signal<string>(''); // Track which std is being quick-uploaded
  private quickUploadStd: ReferenceStandard | null = null;
  isImporting = signal(false);
  isProcessing = signal(false); // Hardened UX State

  viewMode = signal<'list' | 'grid'>('grid');
  searchTerm = signal('');
  sortOption = signal<string>('received_desc');
  searchSubject = new Subject<string>();

  // --- CHANGED: CLIENT-SIDE STATE ---
  allStandards = signal<ReferenceStandard[]>([]); // Holds ALL data from Firebase stream
  displayLimit = signal<number>(50); // Virtual scroll limit
  activeWidgetFilter = signal<'all' | 'expired' | 'expiring_soon' | 'low_stock'>('all');
  private snapshotUnsub?: Unsubscribe;

  // --- Purchase Requests State (Staff) ---
  showPurchaseRequestModal = signal(false);
  selectedPurchaseStd = signal<ReferenceStandard | null>(null);



  // Stats Computed
  stats = computed(() => {
      const data = this.allStandards();
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const thirtyDays = today + 30 * 24 * 60 * 60 * 1000;

      let expired = 0;
      let expiringSoon = 0;
      let lowStock = 0;

      data.forEach(item => {
          if ((item.current_amount / (item.initial_amount || 1)) <= 0.2) {
              lowStock++;
          }
          if (item.expiry_date) {
              const expDate = new Date(item.expiry_date).getTime();
              if (expDate < today) {
                  expired++;
              } else if (expDate <= thirtyDays) {
                  expiringSoon++;
              }
          }
      });

      return { expired, expiringSoon, lowStock, total: data.length };
  });

  // Computed: Filter -> Sort -> Slice
  filteredItems = computed(() => {
      let data = [...this.allStandards()]; // Clone array to avoid in-place mutation issues
      const term = this.searchTerm().trim().toLowerCase();
      const widgetFilter = this.activeWidgetFilter();
      
      // 1. WIDGET FILTER
      if (widgetFilter !== 'all') {
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
          const thirtyDays = today + 30 * 24 * 60 * 60 * 1000;

          data = data.filter(item => {
              if (widgetFilter === 'low_stock') {
                  return (item.current_amount / (item.initial_amount || 1)) <= 0.2;
              }
              
              if (!item.expiry_date) return false;
              const expDate = new Date(item.expiry_date).getTime();
              
              if (widgetFilter === 'expired') {
                  return expDate < today;
              }
              if (widgetFilter === 'expiring_soon') {
                  return expDate >= today && expDate <= thirtyDays;
              }
              return true;
          });
      }

      // 2. SEARCH FILTER
      if (term) {
          const normalize = (s: any) => s ? String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
          const searchTerms = term.split('+').map(t => normalize(t.trim())).filter(t => t.length > 0);
          
          data = data.filter(item => {
              // Cover ALL information of the standard by concatenating all values
              // Additionally, format YYYY-MM-DD dates as DD/MM/YYYY so user can search exactly what they see
              const searchStr = Object.values(item)
                  .filter(val => val !== null && val !== undefined && typeof val !== 'object')
                  .map(val => {
                      let str = String(val);
                      if (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}/)) {
                          const parts = val.split('T')[0].split('-');
                          if (parts.length === 3) str += ` ${parts[2]}/${parts[1]}/${parts[0]}`;
                      }
                      return normalize(str);
                  })
                  .join(' ');
                  
              return searchTerms.every(t => searchStr.includes(t));
          });
      }

      // 3. SORT
      const option = this.sortOption();
      return data.sort((a, b) => {
          switch (option) {
              case 'name_asc': return (a.name || '').localeCompare(b.name || '');
              case 'name_desc': return (b.name || '').localeCompare(a.name || '');
              case 'received_desc': return (b.received_date || '').localeCompare(a.received_date || '');
              case 'expiry_asc': return (a.expiry_date || '9999').localeCompare(b.expiry_date || '9999');
              case 'expiry_desc': return (b.expiry_date || '').localeCompare(a.expiry_date || '');
              case 'updated_desc': 
                  const ta = (a.lastUpdated?.seconds || 0);
                  const tb = (b.lastUpdated?.seconds || 0);
                  return tb - ta;
              default: return (b.received_date || '').localeCompare(a.received_date || '');
          }
      });
  });

  // Display subset for DOM performance
  visibleItems = computed(() => {
      return this.filteredItems().slice(0, this.displayLimit());
  });

  hasMore = computed(() => this.visibleItems().length < this.filteredItems().length);

  selectedIds = signal<Set<string>>(new Set());
  unitOptions = UNIT_OPTIONS;

  // Import Preview State
  importPreviewData = signal<ImportPreviewItem[]>([]);
  importUsageLogPreviewData = signal<ImportUsageLogPreviewItem[]>([]);
  validUsageLogsCount = computed(() => this.importUsageLogPreviewData().filter(i => i.isValid && !i.isDuplicate).length);
  duplicateUsageLogsCount = computed(() => this.importUsageLogPreviewData().filter(i => i.isDuplicate).length);
  errorUsageLogsCount = computed(() => this.importUsageLogPreviewData().filter(i => !i.isValid && !i.isDuplicate).length);

  selectedStd = signal<ReferenceStandard | null>(null);

  historyStd = signal<ReferenceStandard | null>(null);
  historyLogs = signal<UsageLog[]>([]);
  loadingHistory = signal(false);
  
  showModal = signal(false);
  isEditing = signal(false);
  
  showAssignModal = signal(false);
  isAssignMode = signal(true);
  assignUserId = signal('');
  assignUserName = signal('');
  assignPurpose = signal('');
  assignExpectedDate = signal('');
  assignExpectedAmount = signal<number | null>(null);
  userList = signal<UserProfile[]>([]);
  
  showPrintModal = signal(false);
  printPaperSize = signal<'22x12' | '35x22' | '50x30' | '70x50' | 'custom'>('35x22');
  printWidth = signal(35);
  printHeight = signal(22);
  printFontSize = signal(8);
  printTemplate = signal<'standard' | 'detailed' | 'qr'>('standard');
  printCopies = signal<number>(1);
  printIncludeName = signal<boolean>(true);
  printIncludeLot = signal<boolean>(true);
  printIncludePurity = signal<boolean>(true);
  printIncludeOpened = signal<boolean>(true);
  printIncludeExpiry = signal<boolean>(true);
  printIncludeStorage = signal<boolean>(false);
  printIncludeManufacturer = signal<boolean>(false);
  printIncludeCas = signal<boolean>(false);
  
  previewUrl = signal<SafeResourceUrl | null>(null);
  previewImgUrl = signal<string>('');
  previewType = signal<'iframe' | 'image'>('iframe');
  previewRawUrl = signal<string>('');

  form = this.fb.group({
      id: [''], name: ['', Validators.required], chemical_name: [''],
      product_code: [''], cas_number: [''], purity: [''], manufacturer: [''], pack_size: [''], lot_number: [''], 
      internal_id: [''], location: [''], storage_condition: [''],
      initial_amount: [0, [Validators.required, Validators.min(0)]],
      current_amount: [0, [Validators.required, Validators.min(0)]],
      unit: ['mg', Validators.required],
      expiry_date: [''], received_date: [''], date_opened: [''], contract_ref: [''], certificate_ref: ['']
  });

  purchaseForm = this.fb.group({
      priority: ['NORMAL', Validators.required],
      expectedAmount: ['', Validators.required],
      preferred_manufacturer: [''],
      required_level: [''],
      required_purity: [''],
      notes: ['']
  });

  formatNum = formatNum;

  constructor() {
      this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(term => {
          this.searchTerm.set(term); 
          // Reset pagination on search
          this.displayLimit.set(50);
      });
  }

  ngOnInit() { 
      this.isLoading.set(true);
      // Setup Real-time Listener (Load All)
      this.snapshotUnsub = this.stdService.listenToAllStandards((items) => {
          this.allStandards.set(items);
          this.isLoading.set(false);
      });



      // Auto-fill Location based on Storage Condition
      this.form.get('storage_condition')?.valueChanges.subscribe(val => {
          if (!val) return;
          const lower = val.toLowerCase();
          let loc = '';
          if (lower.includes('ft') || lower.includes('đông') || lower.includes('-20')) loc = 'Tủ A';
          else if (lower.includes('ct') || lower.includes('mát') || lower.includes('2-8')) loc = 'Tủ B';
          else if (lower.includes('rt') || lower.includes('thường')) loc = 'Tủ C';
          
          if (loc && this.form.get('location')?.value !== loc) {
              this.form.patchValue({ location: loc });
          }
      });
  }

  ngOnDestroy() { 
      this.searchSubject.complete(); 
      if (this.snapshotUnsub) this.snapshotUnsub();
  }

  // --- Purchase Requests Logic (Staff) ---
  openPurchaseRequestModal(std: ReferenceStandard) {
      if (this.isProcessing()) return;
      this.selectedPurchaseStd.set(std);
      this.purchaseForm.reset({ priority: 'NORMAL' });
      this.showPurchaseRequestModal.set(true);
  }

  closePurchaseRequestModal() {
      this.showPurchaseRequestModal.set(false);
      this.selectedPurchaseStd.set(null);
  }

  async submitPurchaseRequest() {
      if (this.purchaseForm.invalid || this.isProcessing()) return;
      
      const std = this.selectedPurchaseStd();
      const user = this.auth.currentUser();
      
      if (!std || !user) return;

      this.isProcessing.set(true);
      try {
          const req: PurchaseRequest = {
              standardId: std.id,
              standardName: std.name,
              product_code: std.cas_number || std.internal_id || '',
              requestDate: Date.now(),
              status: 'PENDING',
              requestedBy: user.uid,
              requestedByName: user?.displayName || user?.email || 'Unknown',
              priority: this.purchaseForm.value.priority as any,
              expectedAmount: this.purchaseForm.value.expectedAmount || '',
              preferred_manufacturer: this.purchaseForm.value.preferred_manufacturer || '',
              required_level: this.purchaseForm.value.required_level || '',
              required_purity: this.purchaseForm.value.required_purity || '',
              notes: this.purchaseForm.value.notes || ''
          };
          await this.stdService.createPurchaseRequest(req);
          this.toast.show('Đã gửi yêu cầu mua sắm', 'success');
          this.closePurchaseRequestModal();
      } catch (e: any) {
          this.toast.show('Lỗi: ' + e.message, 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }

  onInternalIdChange(event: any) {
      // Logic removed as per user request (Internal ID is manual, Location is based on Storage Condition)
  }

  toggleSelection(id: string) {
      this.selectedIds.update(set => {
          const newSet = new Set(set);
          if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
          return newSet;
      });
  }

  isAllSelected() { return this.visibleItems().length > 0 && this.visibleItems().every(i => this.selectedIds().has(i.id)); }
  toggleAll() {
      if (this.isAllSelected()) this.selectedIds.set(new Set());
      else this.selectedIds.set(new Set(this.visibleItems().map(i => i.id)));
  }

  refreshData() {
      // Just reset the view limit, data is live synced
      this.displayLimit.set(50);
  }

  loadMore() {
      // Increase visible limit
      this.displayLimit.update(l => l + 50);
  }

  onSearchInput(val: string) { this.searchSubject.next(val); }
  onSortChange(val: string) { this.sortOption.set(val); }

  openAddModal() { 
      this.isEditing.set(false); 
      this.form.reset({ initial_amount: 0, current_amount: 0, unit: 'mg' }); 
      this.showModal.set(true); 
      setTimeout(() => document.getElementById('stdNameInput')?.focus(), 100);
  }
  
  openEditModal(std: ReferenceStandard) { 
      if (!this.auth.canEditStandards()) return; 
      this.isEditing.set(true); 
      this.form.reset({ initial_amount: 0, current_amount: 0, unit: 'mg' }); 
      this.form.patchValue(std as any); 
      this.showModal.set(true); 
  }
  
  closeModal() { 
      if (!this.isProcessing()) {
          this.showModal.set(false); 
      }
  }
  
  onNameChange(event: any) { 
      if (!this.isEditing()) { const lot = this.form.get('lot_number')?.value || ''; this.form.patchValue({ id: generateSlug(event.target.value + '_' + (lot || Date.now().toString())) }); } 
  }

  async autoZeroAllSdhet() {
      const targets = this.allStandards().filter(s => (s.id === 'SDHET' || s.internal_id === 'SDHET') && s.current_amount > 0);
      if (targets.length === 0) {
          this.toast.show('Không có chuẩn SDHET nào cần trừ kho.', 'info');
          return;
      }

      this.isProcessing.set(true);
      try {
          for (const std of targets) {
              if (await this.confirmationService.confirm({ message: `Bạn có muốn tự động xuất toàn bộ tồn kho (${std.current_amount} ${std.unit}) của chuẩn [${std.name} - Lô: ${std.lot_number || 'N/A'}] với lý do KIỂM KHO?`, confirmText: 'Trừ kho', cancelText: 'Bỏ qua' })) {
                  const log: UsageLog = {
                      id: '',
                      date: new Date().toISOString().split('T')[0],
                      timestamp: Date.now(),
                      user: 'HỆ THỐNG',
                      amount_used: std.current_amount,
                      unit: std.unit || 'mg',
                      purpose: 'KIỂM KHO'
                  };
                  await this.stdService.recordUsage(std.id!, log);
                  this.toast.show(`Đã trừ kho: ${std.name}`, 'success');
              }
          }
          this.toast.show('Đã duyệt xong danh sách SDHET.', 'success');
      } catch (e: any) {
          this.toast.show('Lỗi: ' + e.message, 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }

  async autoZeroStock(std: ReferenceStandard) {
      if (this.isProcessing() || std.current_amount <= 0) return;
      if (await this.confirmationService.confirm({ message: `Bạn có chắc chắn muốn xuất toàn bộ lượng tồn kho còn lại (${std.current_amount} ${std.unit}) của chuẩn này với lý do KIỂM KHO?`, confirmText: 'Xác nhận trừ kho' })) {
          this.isProcessing.set(true);
          try {
              const log: UsageLog = {
                  id: '',
                  date: new Date().toISOString().split('T')[0],
                  timestamp: Date.now(),
                  user: 'HỆ THỐNG',
                  amount_used: std.current_amount,
                  unit: std.unit || 'mg',
                  purpose: 'KIỂM KHO'
              };
              await this.stdService.recordUsage(std.id!, log);
              this.toast.show('Đã trừ kho thành công', 'success');
          } catch(e: any) {
              this.toast.show('Lỗi trừ kho: ' + e.message, 'error');
          } finally {
              this.isProcessing.set(false);
          }
      }
  }

  sanitizeDriveLink(event: any) {
      const val = event.target.value;
      if (!val) return;

      // Auto-fix Google Drive links (robust)
      if (val.includes('drive.google.com') && val.includes('/view')) {
          const newVal = val.replace('/view', '/preview');
          // Use emitEvent: false to prevent circular triggers
          this.form.patchValue({ certificate_ref: newVal }, { emitEvent: false });
      }
  }

  // --- HARDENED: Save ---
  async saveStandard(keepOpen = false) {
      if (this.isProcessing()) return;
      if (this.form.invalid) { this.toast.show('Vui lòng điền các trường bắt buộc (*)', 'error'); return; }
      
      const val = this.form.value;

      // Validate Internal ID uniqueness (Warning only, do not block)
      if (val.internal_id && val.internal_id !== 'SDHET') {
          const existing = this.allStandards().find(s => 
              s.internal_id?.toLowerCase() === val.internal_id?.toLowerCase() && 
              s.id !== this.form.get('id')?.value
          );
          if (existing) {
              this.toast.show(`Cảnh báo: Mã quản lý ${val.internal_id} đã tồn tại ở chuẩn "${existing.name}".`, 'info');
              // Proceeding anyway because blocking breaks updates for reused internal_ids
          }
      }

      this.isProcessing.set(true);
      try {
          // Auto-sync current_amount with initial_amount if current is 0 and initial > 0 (for new items)
          if (!this.isEditing() && (val.initial_amount || 0) > 0 && (val.current_amount || 0) === 0) {
              val.current_amount = val.initial_amount;
          }

          if (!val.id) val.id = generateSlug(val.name + '_' + Date.now());
          const std: ReferenceStandard = { ...val as any, name: val.name?.trim(), internal_id: val.internal_id?.toUpperCase().trim(), location: val.location?.trim() };
      
          if (this.isEditing()) {
              await this.stdService.updateStandard(std);
              this.toast.show('Cập nhật chuẩn thành công!', 'success');
          } else {
              await this.stdService.addStandard(std);
              this.toast.show('Thêm chuẩn mới thành công!', 'success');
          }
          
          if (keepOpen && !this.isEditing()) {
              // Reset form but keep some useful defaults for the next item
              this.form.reset({
                  initial_amount: 0,
                  current_amount: 0,
                  unit: val.unit || 'mg',
                  storage_condition: val.storage_condition,
                  location: val.location,
                  manufacturer: val.manufacturer,
                  received_date: val.received_date
              });
              // Focus first element
              setTimeout(() => document.getElementById('stdNameInput')?.focus(), 100);
          } else {
              this.showModal.set(false); // Force close
          }
      } catch (e: any) { 
          this.toast.show('Lỗi: ' + e.message, 'error'); 
      } finally {
          this.isProcessing.set(false);
      }
  }

  // --- HARDENED: Bulk Delete ---
  async deleteSelected() {
      if (this.isProcessing()) return;
      const ids = Array.from(this.selectedIds());
      if (ids.length === 0) return;
      
      if (await this.confirmationService.confirm({ message: `Bạn có chắc muốn xóa vĩnh viễn ${ids.length} chuẩn đã chọn và TẤT CẢ lịch sử của chúng?`, confirmText: 'Xóa vĩnh viễn', isDangerous: true })) {
          this.isProcessing.set(true);
          try { 
              await this.stdService.deleteSelectedStandards(ids); 
              this.toast.show(`Đã xóa ${ids.length} mục.`, 'success'); 
              this.selectedIds.set(new Set());
          } catch(e: any) { 
              this.toast.show('Lỗi xóa: ' + e.message, 'error'); 
          } finally {
              this.isProcessing.set(false);
          }
      }
  }

  // --- NEW IMPORT LOGIC ---
  async handleFileSelect(event: any) {
     const file = event.target.files[0];
     if (!file) return;
     this.isLoading.set(true);
     try {
         const data = await this.stdService.parseExcelData(file);
         this.importPreviewData.set(data);
         this.toast.show(`Đã đọc ${data.length} dòng. Vui lòng kiểm tra ngày tháng.`);
     } catch (e: any) {
         this.toast.show('Lỗi đọc file: ' + e.message, 'error');
     } finally {
         this.isLoading.set(false);
         event.target.value = ''; // Reset input
     }
  }

  async handleUsageLogFileSelect(event: any) {
     const file = event.target.files[0];
     if (!file) return;
     this.isLoading.set(true);
     try {
         const data = await this.stdService.parseUsageLogExcelData(file);
         this.importUsageLogPreviewData.set(data);
         this.toast.show(`Đã đọc ${data.length} dòng nhật ký.`);
     } catch (e: any) {
         this.toast.show('Lỗi đọc file: ' + e.message, 'error');
     } finally {
         this.isLoading.set(false);
         event.target.value = ''; // Reset input
     }
  }

  cancelImport() {
      this.importPreviewData.set([]);
      this.importUsageLogPreviewData.set([]);
  }

  // --- HARDENED: Confirm Import ---
  async confirmImport() {
      if (this.importPreviewData().length === 0 || this.isImporting()) return;
      this.isImporting.set(true);
      try {
          await this.stdService.saveImportedData(this.importPreviewData());
          this.toast.show('Import thành công!', 'success');
          this.importPreviewData.set([]);
      } catch (e: any) {
          this.toast.show('Lỗi lưu import: ' + e.message, 'error');
      } finally {
          this.isImporting.set(false);
      }
  }

  async confirmUsageLogImport() {
      if (this.importUsageLogPreviewData().length === 0 || this.isImporting()) return;
      this.isImporting.set(true);
      try {
          await this.stdService.saveImportedUsageLogs(this.importUsageLogPreviewData());
          this.toast.show('Import nhật ký thành công!', 'success');
          this.importUsageLogPreviewData.set([]);
      } catch (e: any) {
          this.toast.show('Lỗi lưu import nhật ký: ' + e.message, 'error');
      } finally {
          this.isImporting.set(false);
      }
  }

  async uploadCoaFile(event: any) {
      if (this.isUploading()) return;
      const file = event.target.files[0];
      if (!file) return;
      this.isUploading.set(true);
      try {
          const url = await this.firebaseService.uploadFile('coa', file);
          this.form.patchValue({ certificate_ref: url });
          this.toast.show('Upload COA thành công!');
      } catch (e: any) { 
          this.toast.show('Upload lỗi: ' + (e.message || 'Unknown'), 'error'); 
      } finally { 
          this.isUploading.set(false);
          event.target.value = ''; // CRITICAL: Reset input to allow re-upload
      }
  }

  // --- Google Drive Upload ---
  async uploadCoaToDrive(event: any) {
      if (this.isDriveUploading()) return;
      const file = event.target.files[0];
      if (!file) return;

      this.isDriveUploading.set(true);
      try {
          // Auto-generate filename from form data
          const stdName = this.form.value.name || 'Unknown';
          const lotNum = this.form.value.lot_number || 'NoLot';
          const fileName = GoogleDriveService.generateFileName(stdName, lotNum, file.name);

          this.toast.show(`Đang upload "${fileName}" lên Google Drive...`);
          const previewUrl = await this.googleDriveService.uploadFile(file, fileName);
          this.form.patchValue({ certificate_ref: previewUrl });
          this.toast.show(`Upload Drive thành công! File: ${fileName}`);
      } catch (e: any) {
          console.error('Drive upload error:', e);
          this.toast.show('Upload Drive lỗi: ' + (e.message || 'Không xác định'), 'error');
      } finally {
          this.isDriveUploading.set(false);
          event.target.value = ''; // Reset input to allow re-upload
      }
  }

  // --- Quick Drive Upload (from list/grid view) ---
  triggerQuickDriveUpload(std: ReferenceStandard, event: Event) {
      event.stopPropagation();
      this.quickUploadStd = std;
      // Find and click the hidden file input
      const input = document.querySelector('#quickDriveInput') as HTMLInputElement;
      if (!input) {
          // Fallback: try by ref
          const inputs = document.querySelectorAll('input[type="file"][accept]');
          const driveInput = Array.from(inputs).find(el => (el as HTMLInputElement).accept.includes('.pdf')) as HTMLInputElement;
          if (driveInput && driveInput.classList.contains('hidden')) {
              driveInput.click();
              return;
          }
          this.toast.show('Không tìm thấy input upload', 'error');
          return;
      }
      input.click();
  }

  async handleQuickDriveUpload(event: any) {
      const file = event.target.files[0];
      const std = this.quickUploadStd;
      if (!file || !std) {
          event.target.value = '';
          return;
      }

      this.quickUploadStdId.set(std.id);
      try {
          const fileName = GoogleDriveService.generateFileName(std.name, std.lot_number || '', file.name);
          this.toast.show(`Đang upload CoA cho "${std.name}"...`);

          const previewUrl = await this.googleDriveService.uploadFile(file, fileName);

          // Update Firestore directly (partial update)
          await this.stdService.quickUpdateField(std.id, { certificate_ref: previewUrl });
          this.toast.show(`Upload CoA thành công! ${fileName}`);
      } catch (e: any) {
          console.error('Quick Drive upload error:', e);
          this.toast.show('Upload CoA lỗi: ' + (e.message || 'Không xác định'), 'error');
      } finally {
          this.quickUploadStdId.set('');
          this.quickUploadStd = null;
          event.target.value = '';
      }
  }

  // --- Helpers ---
  getExpiryBarClass(dateStr: string | undefined): string {
      if (!dateStr) return 'bg-slate-300';
      const exp = new Date(dateStr); const today = new Date();
      if (exp < today) return 'bg-red-500';
      const diffDays = (exp.getTime() - today.getTime()) / (1000 * 3600 * 24);
      if (diffDays < 180) return 'bg-orange-500'; return 'bg-emerald-500';
  }

  getExpiryStatus(dateStr: string | undefined): string {
      if (!dateStr) return 'N/A';
      const exp = new Date(dateStr); const today = new Date();
      if (exp < today) return 'Hết hạn';
      const diffMonths = (exp.getTime() - today.getTime()) / (1000 * 3600 * 24 * 30);
      if (diffMonths < 6) return '< 6 Tháng'; return 'Còn hạn';
  }
  
  getExpiryStatusClass(dateStr: string | undefined): string {
      if (!dateStr) return 'border-slate-200 text-slate-400 bg-slate-50';
      const exp = new Date(dateStr); const today = new Date();
      if (exp < today) return 'border-red-200 text-red-600 bg-red-50';
      const diffMonths = (exp.getTime() - today.getTime()) / (1000 * 3600 * 24 * 30);
      if (diffMonths < 6) return 'border-orange-200 text-orange-600 bg-orange-50';
      return 'border-emerald-200 text-emerald-600 bg-emerald-50';
  }

  // NEW: Detail Mapping for Storage Conditions
  getStorageInfo(condition: string | undefined): { icon: string, color: string, bg: string, border: string, text: string }[] {
      if (!condition) return [];
      const items: { icon: string, color: string, bg: string, border: string, text: string }[] = [];
      const lower = condition.toLowerCase();
      
      // Freezer (FT / -20)
      if (lower.includes('ft') || lower.includes('tủ đông') || lower.includes('-20')) { 
          items.push({ icon: 'fa-snowflake', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', text: 'Tủ đông (-20°C)' }); 
      }
      // Deep Freeze (DF / -80 / -70)
      if (lower.includes('df') || lower.includes('-80') || lower.includes('-70')) { 
          items.push({ icon: 'fa-icicles', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', text: 'Đông sâu (-70°C)' }); 
      }
      // Cool (CT / 2-8)
      if (lower.includes('ct') || lower.includes('tủ mát') || lower.includes('2-8')) { 
          items.push({ icon: 'fa-temperature-low', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'Tủ mát (2-8°C)' }); 
      }
      // Room Temp (RT)
      if (lower.includes('rt') || lower.includes('tủ c') || lower.includes('thường')) { 
          items.push({ icon: 'fa-sun', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', text: 'Nhiệt độ phòng' }); 
      }
      // Dark (D)
      if (lower.includes('d:') || lower.match(/\bd\b/) || lower.includes('tối') || lower.includes('dark')) { 
          items.push({ icon: 'fa-moon', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200', text: 'Tránh ánh sáng' }); 
      }
      
      // Fallback if no keywords matched but text exists
      if (items.length === 0 && condition.trim().length > 0) {
          items.push({ icon: 'fa-box', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', text: condition });
      }

      return items;
  }

  getExpiryClass(dateStr: string | undefined): string {
      if (!dateStr) return 'text-slate-400';
      const exp = new Date(dateStr); const today = new Date();
      if (exp < today) return 'text-red-600 line-through decoration-2'; 
      const diffMonths = (exp.getTime() - today.getTime()) / (1000 * 3600 * 24 * 30);
      if (diffMonths < 6) return 'text-orange-600'; return 'text-indigo-600'; 
  }

  // --- NEW HELPERS FOR HIGH DENSITY TABLE ---
  
  getExpiryTimeClass(dateStr: string | undefined): string {
      if (!dateStr) return 'text-slate-400 italic';
      const exp = new Date(dateStr); const today = new Date();
      const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) return 'text-red-600 font-bold';
      if (diffDays < 180) return 'text-orange-600 font-bold';
      return 'text-emerald-600 font-bold';
  }

  getExpiryTimeLeft(dateStr: string | undefined): string {
      if (!dateStr) return '';
      const exp = new Date(dateStr);
      const now = new Date();
      const diffTime = exp.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return `Đã hết hạn ${Math.abs(diffDays)} ngày`;
      if (diffDays === 0) return 'Hết hạn hôm nay';
      return `Còn ${diffDays} ngày`;
  }

  getStandardStatus(std: ReferenceStandard): { label: string, class: string } {
      if (std.status === 'IN_USE') return { label: 'Đang dùng', class: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50' };
      if (std.status === 'DEPLETED' || std.current_amount <= 0) return { label: 'Sử dụng hết', class: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' };
      
      if (!std.expiry_date) return { label: 'Chưa rõ hạn', class: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50' };
      
      const exp = new Date(std.expiry_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (exp < today) return { label: 'Hết hạn SD', class: 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50' };
      
      const diffDays = (exp.getTime() - today.getTime()) / (1000 * 3600 * 24);
      if (diffDays < 180) return { label: 'Sắp hết hạn', class: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50' };
      
      if ((std.current_amount / (std.initial_amount || 1)) <= 0.2) return { label: 'Sắp hết hàng', class: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50' };

      return { label: 'Sẵn sàng', class: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50' };
  }

  canAssign(std: ReferenceStandard): boolean {
      if (std.status === 'IN_USE') return false;
      if (std.status === 'DEPLETED' || std.current_amount <= 0) return false;
      
      if (std.expiry_date) {
          const expDate = new Date(std.expiry_date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (expDate < today) return false;
      }
      return true;
  }

  copyText(text: string | undefined, event: Event) {
      event.stopPropagation();
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => this.toast.show('Đã copy: ' + text));
  }

  goToReturn(std: ReferenceStandard) {
      if (!std.current_request_id) {
          this.toast.show('Không tìm thấy yêu cầu mượn chuẩn này', 'error');
          return;
      }
      this.toast.show('Chuyển đến trang Yêu cầu để trả chuẩn');
      this.router.navigate(['/standard-requests']);
  }

   async openAssignModal(std: ReferenceStandard, isAssign = true) {
      if (this.isProcessing()) return;
      this.selectedStd.set(std);
      this.isAssignMode.set(isAssign);
      
      if (isAssign) {
          this.assignUserId.set('');
          this.assignUserName.set('');
      } else {
          const user = this.auth.currentUser();
          this.assignUserId.set(user?.uid || '');
          this.assignUserName.set(user?.displayName || user?.email || 'Unknown');
      }
      
      this.assignPurpose.set('');
      this.assignExpectedDate.set('');
      this.assignExpectedAmount.set(null);
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

  onAssignUserChange(userId: string) {
      this.assignUserId.set(userId);
      const user = this.userList().find(u => u.uid === userId);
      this.assignUserName.set(user ? user.displayName || '' : '');
  }

  async confirmAssign() {
      const std = this.selectedStd();
      const userId = this.assignUserId();
      const userName = this.assignUserName();
      const purpose = this.assignPurpose().trim();
      const expectedDate = this.assignExpectedDate();
      const expectedAmount = this.assignExpectedAmount();
      
      if (!std || !userId || !purpose) {
          this.toast.show('Vui lòng điền đầy đủ thông tin bắt buộc (*)', 'error');
          return;
      }

      this.isProcessing.set(true);
      try {
          const request: StandardRequest = {
              standardId: std.id!,
              standardName: std.name,
              lotNumber: std.lot_number,
              requestedBy: userId,
              requestedByName: userName,
              requestDate: Date.now(),
              purpose: purpose,
              expectedReturnDate: expectedDate ? new Date(expectedDate).getTime() : undefined,
              expectedAmount: expectedAmount || 0,
              status: 'PENDING_APPROVAL',
              totalAmountUsed: 0
          };

          // If it's "Assign Mode", it implies an admin is giving it to someone, 
          // but we still follow the request workflow for tracking.
          await this.stdService.createRequest(request, this.isAssignMode());
          
          if (this.isAssignMode()) {
              // Automatically dispense if assigning directly
              await this.stdService.dispenseStandard(request.id!, std.id!, this.auth.currentUser()?.uid || '', this.auth.currentUser()?.displayName || 'QTV', true);
              this.toast.show('Đã gán chuẩn thành công', 'success');
          } else {
              this.toast.show('Đã gửi yêu cầu mượn chuẩn', 'success');
          }
          
          this.showAssignModal.set(false);
      } catch (error: any) {
          this.toast.show(error.message || 'Lỗi khi xử lý', 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }

  openPrintModal(std: ReferenceStandard) {
      this.selectedStd.set(std);
      this.showPrintModal.set(true);
  }

  onPaperSizeChange(size: string) {
      this.printPaperSize.set(size as any);
      switch(size) {
          case '22x12': this.printWidth.set(22); this.printHeight.set(12); this.printFontSize.set(6); break;
          case '35x22': this.printWidth.set(35); this.printHeight.set(22); this.printFontSize.set(8); break;
          case '50x30': this.printWidth.set(50); this.printHeight.set(30); this.printFontSize.set(10); break;
          case '70x50': this.printWidth.set(70); this.printHeight.set(50); this.printFontSize.set(12); break;
      }
  }

  onTemplateChange(template: 'standard' | 'detailed' | 'qr') {
      this.printTemplate.set(template);
      if (template === 'detailed') {
          this.printIncludeCas.set(true);
          this.printIncludeManufacturer.set(true);
          this.printIncludeStorage.set(true);
      } else if (template === 'standard') {
          this.printIncludeCas.set(false);
          this.printIncludeManufacturer.set(false);
          this.printIncludeStorage.set(false);
      }
  }

  getQrCodeUrl(std: ReferenceStandard | null): string {
      if (!std) return '';
      return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(std.internal_id || std.id)}`;
  }

  getPreviewScale(): number {
      const width = this.printWidth();
      const height = this.printHeight();
      // Assuming preview area is roughly 300x300px
      // 1mm is approx 3.78px
      const widthPx = width * 3.78;
      const heightPx = height * 3.78;
      const maxDim = Math.max(widthPx, heightPx);
      if (maxDim > 280) {
          return 280 / maxDim;
      }
      return 1;
  }

  printLabel() {
      const std = this.selectedStd();
      if (!std) return;
      
      const width = this.printWidth();
      const height = this.printHeight();
      const fontSize = this.printFontSize();
      const copies = this.printCopies();
      const template = this.printTemplate();
      
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
          this.toast.show('Vui lòng cho phép popup để in nhãn', 'error');
          return;
      }
      
      // Generate label content based on selected fields
      const generateLabelContent = () => {
          let content = '';
          if (template === 'qr') {
              content += `
                  <div style="display: flex; height: 100%; gap: 4px;">
                      <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; overflow: hidden;">
                          ${this.printIncludeName() ? `<div class="title">${std.name}</div>` : ''}
                          ${this.printIncludeLot() ? `<div class="row"><span>Lot: <span class="bold">${std.lot_number || 'N/A'}</span></span></div>` : ''}
                          ${this.printIncludePurity() ? `<div class="row"><span>Pur: <span class="bold">${std.purity || 'N/A'}</span></span></div>` : ''}
                          ${this.printIncludeExpiry() ? `<div class="row"><span>Exp: <span class="bold">${std.expiry_date ? new Date(std.expiry_date).toLocaleDateString('vi-VN') : 'N/A'}</span></span></div>` : ''}
                      </div>
                      <div style="width: 30%; display: flex; align-items: center; justify-content: center;">
                          <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(std.internal_id || std.id)}" style="width: 100%; height: auto; max-height: 100%;" />
                      </div>
                  </div>
              `;
          } else {
              content += `<div style="display: flex; flex-direction: column; justify-content: center; height: 100%; overflow: hidden;">`;
              if (this.printIncludeName()) {
                  content += `<div class="title">${std.name}</div>`;
              }
              
              if (template === 'detailed') {
                  if (this.printIncludeCas() || this.printIncludeManufacturer()) {
                      content += `<div class="row">`;
                      if (this.printIncludeCas()) content += `<span>CAS: <span class="bold">${std.cas_number || 'N/A'}</span></span>`;
                      if (this.printIncludeManufacturer()) content += `<span>Mfr: <span class="bold">${std.manufacturer || 'N/A'}</span></span>`;
                      content += `</div>`;
                  }
              }

              if (this.printIncludeLot() || this.printIncludePurity()) {
                  content += `<div class="row">`;
                  if (this.printIncludeLot()) content += `<span>Lot: <span class="bold">${std.lot_number || 'N/A'}</span></span>`;
                  if (this.printIncludePurity()) content += `<span>Pur: <span class="bold">${std.purity || 'N/A'}</span></span>`;
                  content += `</div>`;
              }
              
              if (this.printIncludeOpened() || this.printIncludeExpiry()) {
                  content += `<div class="row">`;
                  if (this.printIncludeOpened()) content += `<span>Opn: <span class="bold">${std.date_opened ? new Date(std.date_opened).toLocaleDateString('vi-VN') : '__/__/__'}</span></span>`;
                  if (this.printIncludeExpiry()) content += `<span>Exp: <span class="bold">${std.expiry_date ? new Date(std.expiry_date).toLocaleDateString('vi-VN') : 'N/A'}</span></span>`;
                  content += `</div>`;
              }

              if (this.printIncludeStorage()) {
                  content += `<div class="row"><span>Store: <span class="bold">${std.storage_condition || 'N/A'}</span></span></div>`;
              }
              content += `</div>`;
          }
          return content;
      };

      const labelHtml = `
          <div class="label-container">
              <div class="label-content">
                  ${generateLabelContent()}
              </div>
          </div>
      `;

      let allLabelsHtml = '';
      for (let i = 0; i < copies; i++) {
          allLabelsHtml += labelHtml;
      }

      const html = `
          <!DOCTYPE html>
          <html>
          <head>
              <title>Print Label</title>
              <style>
                  @page { size: ${width}mm ${height}mm; margin: 0; }
                  body { 
                      margin: 0; 
                      padding: 0;
                      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                  }
                  .label-container {
                      width: ${width}mm; 
                      height: ${height}mm; 
                      padding: 2mm;
                      box-sizing: border-box;
                      page-break-after: always;
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                  }
                  .label-container:last-child {
                      page-break-after: auto;
                  }
                  .label-content {
                      font-size: ${fontSize}pt;
                      line-height: 1.2;
                      width: 100%;
                      height: 100%;
                  }
                  .title { font-weight: bold; font-size: ${fontSize + 2}pt; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                  .row { display: flex; justify-content: space-between; margin-bottom: 1px; }
                  .bold { font-weight: bold; }
              </style>
          </head>
          <body>
              ${allLabelsHtml}
              <script>
                  window.onload = () => { 
                      setTimeout(() => {
                          window.print(); 
                          window.close(); 
                      }, 500); // Wait for QR code image to load
                  }
              </script>
          </body>
          </html>
      `;
      
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      this.showPrintModal.set(false);
  }

  async viewHistory(std: ReferenceStandard) { 
      this.historyStd.set(std); 
      this.loadingHistory.set(true); 
      try { 
          const logs = await this.stdService.getUsageHistory(std.id); 
          this.historyLogs.set(logs); 
      } finally { 
          this.loadingHistory.set(false); 
      } 
  }

  async deleteLog(log: UsageLog) {
      if (this.isProcessing()) return;
      if (!this.historyStd() || !log.id) return;
      
      if (await this.confirmationService.confirm({ message: `Xóa lịch sử dụng ngày ${log.date}?`, confirmText: 'Xóa & Hoàn kho', isDangerous: true })) {
          this.isProcessing.set(true);
          try { 
              await this.stdService.deleteUsageLog(this.historyStd()!.id, log.id); 
              this.toast.show('Đã xóa', 'success'); 
              await this.viewHistory(this.historyStd()!); 
          } catch (e: any) { 
              this.toast.show('Lỗi: ' + e.message, 'error'); 
          } finally {
              this.isProcessing.set(false);
          }
      }
  }

  openCoaPreview(url: string, event: Event) {
      event.stopPropagation(); 
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
}
