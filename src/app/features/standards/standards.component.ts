
import { Component, inject, signal, computed, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import { StandardService } from './standard.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { ReferenceStandard, UsageLog, ImportPreviewItem, ImportUsageLogPreviewItem, StandardRequest, PurchaseRequest, CoaMatchItem } from '../../core/models/standard.model';
import { formatNum, generateSlug, UNIT_OPTIONS, calculateSimilarityScore } from '../../shared/utils/utils';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService, UserProfile } from '../../core/services/auth.service';
import { Unsubscribe, onSnapshot, query, collection, where } from 'firebase/firestore';
import { GoogleDriveService } from '../../core/services/google-drive.service';

import { StandardsFormModalComponent } from './components/standards-form-modal.component';
import { StandardsPrintModalComponent } from './components/standards-print-modal.component';
import { StandardsImportDataModalComponent, StandardsImportUsageModalComponent } from './components/standards-import-modal.component';
import { StandardsHistoryModalComponent } from './components/standards-history-modal.component';
import { StandardsPurchaseModalComponent } from './components/standards-purchase-modal.component';
import { StandardsCoaModalComponent } from './components/standards-coa-modal.component';
import { StandardsBulkCoaModalComponent } from './components/standards-bulk-coa-modal.component';

@Component({
  selector: 'app-standards',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SkeletonComponent, StandardsFormModalComponent, StandardsPrintModalComponent, StandardsImportDataModalComponent, StandardsImportUsageModalComponent, StandardsHistoryModalComponent, StandardsPurchaseModalComponent, StandardsCoaModalComponent, StandardsBulkCoaModalComponent],
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
             
             <!-- Drobdown or group for Bulk CoA -->
             <div class="relative group ml-1">
                 <button class="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg border border-blue-200 dark:border-blue-800/50 transition font-bold text-[11px] flex items-center gap-1.5">
                     <i class="fa-solid fa-cloud-arrow-up"></i> Upload CoA Hàng loạt <i class="fa-solid fa-caret-down"></i>
                 </button>
                 <div class="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden flex flex-col p-1">
                     <button (click)="bulkCoaFolderInput.click()" class="text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-2">
                         <i class="fa-solid fa-folder-open text-amber-500 w-4"></i> Từ Thư mục (Files/Folders)
                     </button>
                     <button (click)="bulkCoaFilesInput.click()" class="text-left px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-2">
                         <i class="fa-regular fa-images text-blue-500 w-4"></i> Chọn nhiều Files (PDF/IMG)
                     </button>
                 </div>
                 <input #bulkCoaFolderInput type="file" webkitdirectory directory multiple class="hidden" (change)="handleBulkCoaSelect($event)">
                 <input #bulkCoaFilesInput type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp" class="hidden" (change)="handleBulkCoaSelect($event)">
             </div>
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

      <!-- ADD/EDIT MODAL -->
      <app-standards-form-modal [isOpen]="showModal()" [std]="isEditing() ? selectedStd() : null" [allStandards]="allStandards()" (closeModal)="closeModal()"></app-standards-form-modal>

      <!-- IMPORT PREVIEW MODAL -->
      <app-standards-import-data-modal [data]="importPreviewData()" [isImporting]="isImporting()" (cancel)="cancelImport()" (confirm)="confirmImport()"></app-standards-import-data-modal>

      <!-- IMPORT USAGE LOG PREVIEW MODAL -->
      <app-standards-import-usage-modal [data]="importUsageLogPreviewData()" [validCount]="validUsageLogsCount()" [duplicateCount]="duplicateUsageLogsCount()" [errorCount]="errorUsageLogsCount()" [isImporting]="isImporting()" (cancel)="cancelImport()" (confirm)="confirmUsageLogImport()"></app-standards-import-usage-modal>

      <!-- BULK COA MODAL -->
      <app-standards-bulk-coa-modal [isOpen]="showBulkCoaModal()" [items]="bulkCoaItems()" [allStandards]="allStandards()" [isUploading]="isBulkUploading()" [uploadComplete]="bulkUploadComplete()" (cancel)="cancelBulkCoa()" (confirm)="confirmBulkCoaUpload()"></app-standards-bulk-coa-modal>

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

      <!-- PRINT MODAL -->
      <app-standards-print-modal [isOpen]="showPrintModal()" [std]="selectedStd()" (closeModal)="showPrintModal.set(false)"></app-standards-print-modal>

      <!-- HISTORY MODAL -->
      <app-standards-history-modal [historyStd]="historyStd()" [loadingHistory]="loadingHistory()" [historyLogs]="historyLogs()" [isProcessing]="isProcessing()" (closeModal)="historyStd.set(null)" (deleteLogEvent)="deleteLog($event)"></app-standards-history-modal>

      <!-- COA PREVIEW MODAL -->
      <app-standards-coa-modal [previewUrl]="previewUrl()" [previewImgUrl]="previewImgUrl()" [previewType]="previewType()" [previewRawUrl]="previewRawUrl()" (closeModal)="closeCoaPreview()"></app-standards-coa-modal>
      <!-- PURCHASE REQUEST MODAL -->
      <app-standards-purchase-modal [isOpen]="showPurchaseRequestModal()" [selectedStd]="selectedPurchaseStd()" (closeModal)="closePurchaseRequestModal()"></app-standards-purchase-modal>


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
  quickUploadStdId = signal<string>(''); // Track which std is being quick-uploaded
  private quickUploadStd: ReferenceStandard | null = null;
  isImporting = signal(false);
  isProcessing = signal(false); // Hardened UX State

  // Responsive view mode: mobile (touch device) defaults to grid, desktop defaults to list
  private mobileMediaQuery = window.matchMedia('(hover: none) and (pointer: coarse)');
  viewMode = signal<'list' | 'grid'>(this.mobileMediaQuery.matches ? 'grid' : 'list');
  private onMediaChange = (e: MediaQueryListEvent) => this.viewMode.set(e.matches ? 'grid' : 'list');
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

          // Inject search score if search term is active
          data = data.map(item => ({
              ...item,
              search_score: calculateSimilarityScore(term, item)
          }));
      }

      // 3. SORT
      const option = this.sortOption();
      return data.sort((a, b) => {
          // If searching, prioritize search score over fallback sort method
          if (term && (b as any).search_score !== (a as any).search_score) {
              return ((b as any).search_score || 0) - ((a as any).search_score || 0);
          }

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
    
  previewUrl = signal<SafeResourceUrl | null>(null);
  previewImgUrl = signal<string>('');
  previewType = signal<'iframe' | 'image'>('iframe');
  previewRawUrl = signal<string>('');

  // Bulk CoA Upload State
  bulkCoaItems = signal<CoaMatchItem[]>([]);
  showBulkCoaModal = signal(false);
  isBulkUploading = signal(false);
  bulkUploadComplete = signal(false);



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
      // Reactive view mode listener (updates on window resize / device rotation)
      this.mobileMediaQuery.addEventListener('change', this.onMediaChange);
      // Setup Real-time Listener (Load All)
      this.snapshotUnsub = this.stdService.listenToAllStandards((items) => {
          this.allStandards.set(items);
          this.isLoading.set(false);
      });
  }

  ngOnDestroy() { 
      this.searchSubject.complete(); 
      if (this.snapshotUnsub) this.snapshotUnsub();
      this.mobileMediaQuery.removeEventListener('change', this.onMediaChange);
  }

  // --- Purchase Requests Logic (Staff) ---
  openPurchaseRequestModal(std: ReferenceStandard) {
      if (this.isProcessing()) return;
      this.selectedPurchaseStd.set(std);
      this.showPurchaseRequestModal.set(true);
  }

  closePurchaseRequestModal() {
      this.showPurchaseRequestModal.set(false);
      this.selectedPurchaseStd.set(null);
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
      this.selectedStd.set(null);
      this.showModal.set(true); 
  }
  
  openEditModal(std: ReferenceStandard) { 
      if (!this.auth.canEditStandards()) return; 
      this.selectedStd.set(std);
      this.isEditing.set(true); 
      this.showModal.set(true); 
  }
  
  closeModal() { 
      if (!this.isProcessing()) {
          this.showModal.set(false); 
      }
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

  // --- Bulk CoA Match & Upload Logic ---
  handleBulkCoaSelect(event: any) {
     const files = event.target.files as FileList;
     if (!files || files.length === 0) return;
     
     const newItems: CoaMatchItem[] = [];
     const standards = this.allStandards();

     for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.name.toLowerCase().match(/\.(pdf|jpeg|jpg|png|webp|bmp|doc|docx)$/)) continue;

        const nameLower = file.name.toLowerCase();
        
        // Match logic: Generate suggested standards sorted by global similarity score
        const scoredStandards = standards.map(s => {
            let score = calculateSimilarityScore(nameLower, s);
            return { std: s, score };
        });

        // Top ones first, fallback to alphabetical on tie
        scoredStandards.sort((a, b) => b.score - a.score || (a.std.name || '').localeCompare(b.std.name || ''));
        const suggestedStandards = scoredStandards.map(ss => ss.std);
        
        // Define matched standard as top 1 IF the score is reasonably high enough 
        // (to avoid forcing a match when nothing is actually similar)
        let matched: ReferenceStandard | null = null;
        if (scoredStandards[0] && scoredStandards[0].score >= 80) { // arbitrary threshold for confident auto-match
            matched = scoredStandards[0].std;
        }

        newItems.push({
            file,
            fileName: file.name,
            matchedStandard: matched,
            suggestedStandards: suggestedStandards, // Feed sorted array to dropdown
            status: 'pending'
        });
     }
     
     if (newItems.length > 0) {
         this.bulkCoaItems.set(newItems);
         this.showBulkCoaModal.set(true);
         this.bulkUploadComplete.set(false);
     } else {
         this.toast.show('Không tìm thấy file tài liệu hợp lệ trong thư mục/số file đã chọn (yêu cầu .pdf, .jpg, v.v.)', 'error');
     }
     event.target.value = '';
  }

  cancelBulkCoa() {
      if (this.isBulkUploading()) return;
      this.showBulkCoaModal.set(false);
      this.bulkCoaItems.set([]);
  }

  async confirmBulkCoaUpload() {
      let items = this.bulkCoaItems();
      const toUpload = items.filter(i => i.matchedStandard && i.status !== 'success');
      if (toUpload.length === 0 || this.isBulkUploading()) return;
      
      this.isBulkUploading.set(true);
      this.bulkUploadComplete.set(false);

      try {
          for (const item of toUpload) {
              item.status = 'uploading';
              this.bulkCoaItems.set([...items]); // Trigger UI update
              
              const std = item.matchedStandard!;
              const fileName = GoogleDriveService.generateFileName(std.name, std.lot_number || '', item.file.name);
              
              try {
                  const previewUrl = await this.googleDriveService.uploadFile(item.file, fileName);
                  await this.stdService.quickUpdateField(std.id, { certificate_ref: previewUrl });
                  item.status = 'success';
              } catch(e: any) {
                  item.status = 'error';
                  item.uploadError = e.message || 'Lỗi kết nối';
              }
              this.bulkCoaItems.set([...items]); // Update progress for this file
          }
      } finally {
          this.isBulkUploading.set(false);
          this.bulkUploadComplete.set(true);
          this.toast.show('Hoàn tất quá trình tải lên CoA hàng loạt', 'success');
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
              expectedReturnDate: expectedDate ? new Date(expectedDate).getTime() : null,
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





  getQrCodeUrl(std: ReferenceStandard | null): string {
      if (!std) return '';
      return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(std.internal_id || std.id)}`;
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
