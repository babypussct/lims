import { Component, inject, signal, computed, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StateService } from '../../core/services/state.service';
import { StandardService } from './standard.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { ReferenceStandard, UsageLog, ImportPreviewItem } from '../../core/models/standard.model';
import { formatNum, generateSlug, UNIT_OPTIONS } from '../../shared/utils/utils';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { Unsubscribe } from 'firebase/firestore';

@Component({
  selector: 'app-standards',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SkeletonComponent],
  template: `
    <div class="max-w-full mx-auto space-y-5 pb-20 fade-in h-full flex flex-col relative">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div>
            <h2 class="text-xl font-black text-slate-800 flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm">
                    <i class="fa-solid fa-vial-circle-check"></i>
                </div>
                Quản lý Chuẩn Đối Chiếu
            </h2>
        </div>
        
        <div class="flex gap-2 items-center">
           @if(selectedIds().size > 0 && auth.canEditStandards()) {
                <button (click)="deleteSelected()" class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-xl shadow-lg shadow-red-200 transition font-bold text-xs flex items-center gap-2 animate-bounce-in">
                    <i class="fa-solid fa-trash"></i> Xóa {{selectedIds().size}} mục
                </button>
                <div class="h-6 w-px bg-slate-200 mx-1"></div>
           }

           @if(auth.canEditStandards()) {
             <button (click)="openAddModal()" class="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition font-bold text-xs flex items-center gap-2">
                <i class="fa-solid fa-plus"></i> Thêm mới
             </button>
             <button (click)="fileInput.click()" class="px-5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition font-bold text-xs flex items-center gap-2">
                <i class="fa-solid fa-file-excel"></i> Import
             </button>
             <input #fileInput type="file" class="hidden" accept=".xlsx, .xlsm" (change)="handleFileSelect($event)">
           }
           
           @if(state.isAdmin()) {
             <button (click)="deleteAll()" [disabled]="isLoading()" class="hidden md:flex px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl transition font-bold text-xs items-center gap-2 disabled:opacity-50" title="Xóa toàn bộ (Bao gồm Logs)">
                @if(isLoading()) { <i class="fa-solid fa-spinner fa-spin"></i> }
                @else { <i class="fa-solid fa-bomb"></i> }
             </button>
           }
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 overflow-hidden bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col relative">
          
          <!-- Omnibox Filters -->
          <div class="p-5 border-b border-slate-50 flex flex-col gap-4 bg-slate-50/30">
             <div class="flex flex-col md:flex-row gap-4">
                 <div class="relative flex-1 group">
                    <i class="fa-solid fa-search absolute left-4 top-3.5 text-slate-400 text-sm group-focus-within:text-indigo-500 transition-colors"></i>
                    <input type="text" [ngModel]="searchTerm()" (ngModelChange)="onSearchInput($event)" 
                           class="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition shadow-sm"
                           placeholder="Tìm kiếm chuẩn, mã số, số lô... (Real-time)">
                 </div>
                 
                 <!-- SORT DROPDOWN -->
                 <div class="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 shadow-sm h-[46px]">
                     <span class="text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap"><i class="fa-solid fa-arrow-down-short-wide mr-1"></i> Sắp xếp:</span>
                     <select [ngModel]="sortOption()" (ngModelChange)="onSortChange($event)" 
                             class="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer border-none py-2 pr-2">
                         <option value="received_desc">Ngày nhận (Mới nhất)</option>
                         <option value="updated_desc">Mới cập nhật</option>
                         <option value="name_asc">Tên (A-Z)</option>
                         <option value="name_desc">Tên (Z-A)</option>
                         <option value="expiry_asc">Hạn dùng (Gần nhất)</option>
                         <option value="expiry_desc">Hạn dùng (Xa nhất)</option>
                     </select>
                 </div>

                 <div class="flex bg-slate-200/50 p-1 rounded-xl shrink-0 h-[46px] self-start md:self-auto">
                    <button (click)="viewMode.set('list')" [class]="viewMode() === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'" class="w-10 h-full flex items-center justify-center rounded-lg transition" title="Dạng Danh sách">
                        <i class="fa-solid fa-list"></i>
                    </button>
                    <button (click)="viewMode.set('grid')" [class]="viewMode() === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'" class="w-10 h-full flex items-center justify-center rounded-lg transition" title="Dạng Lưới (Thẻ)">
                        <i class="fa-solid fa-border-all"></i>
                    </button>
                 </div>
             </div>
             
             <!-- Search Stats -->
             <div class="flex justify-between items-center px-1">
                 <span class="text-[10px] font-bold text-slate-400">
                     Hiển thị: {{visibleItems().length}} / {{filteredItems().length}} kết quả 
                     @if(searchTerm()) { <span class="text-indigo-500">(Lọc theo "{{searchTerm()}}")</span> }
                 </span>
                 @if(isLoading()) { <span class="text-[10px] text-blue-500 flex items-center gap-1"><i class="fa-solid fa-sync fa-spin"></i> Đang đồng bộ...</span> }
             </div>
          </div>

          <!-- Content Body -->
          <div class="flex-1 overflow-y-auto custom-scrollbar relative bg-slate-50/30">
             
             <!-- VIEW MODE: LIST (HIGH DENSITY TABLE) -->
             @if (viewMode() === 'list') {
                 <div class="min-w-[1000px]"> 
                     <table class="w-full text-sm text-left relative border-collapse">
                        <thead class="text-[11px] text-slate-500 font-bold uppercase bg-slate-50 sticky top-0 z-10 border-b border-slate-200 shadow-sm h-12 tracking-wide">
                           <tr>
                              <th class="px-4 py-3 w-10 text-center"><input type="checkbox" [checked]="isAllSelected()" (change)="toggleAll()" class="w-4 h-4 accent-indigo-600 cursor-pointer"></th>
                              <th class="px-4 py-3 w-[25%]">Định danh & Vị trí</th>
                              <th class="px-4 py-3 w-[20%]">Thông tin Lô/SX</th>
                              <th class="px-4 py-3 w-[15%]">Tồn kho & Bảo quản</th>
                              <th class="px-4 py-3 w-[15%]">Hạn dùng & Hồ sơ</th>
                              <th class="px-4 py-3 w-[10%] text-center">Trạng thái</th>
                              <th class="px-4 py-3 w-[10%] text-center">Tác vụ</th>
                           </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-slate-100">
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
                                  <tr class="hover:bg-indigo-50/30 transition group h-24" [class.bg-indigo-50]="selectedIds().has(std.id)">
                                     <td class="px-4 py-3 text-center align-top pt-4">
                                         <input type="checkbox" [checked]="selectedIds().has(std.id)" (change)="toggleSelection(std.id)" class="w-4 h-4 accent-indigo-600 cursor-pointer">
                                     </td>
                                     <td class="px-4 py-3 align-top">
                                        <div class="flex flex-col h-full">
                                            <div class="font-bold text-slate-800 text-sm mb-0.5 hover:text-indigo-600 transition cursor-pointer leading-snug line-clamp-2" (click)="openEditModal(std)" [title]="std.name">
                                                {{std.name}}
                                            </div>
                                            @if(std.chemical_name) { <div class="text-xs text-slate-500 italic mb-1.5 line-clamp-1" [title]="std.chemical_name">{{std.chemical_name}}</div> }
                                            <div class="flex flex-wrap gap-1.5 mt-auto">
                                                @if(std.internal_id) { <span class="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100 tracking-tight">{{std.internal_id}}</span> }
                                                @if(std.location) { <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200 flex items-center gap-1"><i class="fa-solid fa-location-dot text-[9px]"></i> {{std.location}}</span> }
                                            </div>
                                        </div>
                                     </td>
                                     <td class="px-4 py-3 align-top border-l border-slate-50">
                                        <div class="text-xs font-bold text-slate-700 mb-1.5 truncate" [title]="std.manufacturer">{{std.manufacturer || 'N/A'}}</div>
                                        <div class="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-[10px] text-slate-500">
                                            <span class="font-bold text-slate-400">LOT:</span><span class="font-mono text-slate-700 cursor-pointer hover:text-blue-600 hover:underline decoration-dotted" title="Click để copy" (click)="copyText(std.lot_number, $event)">{{std.lot_number || '-'}}</span>
                                            <span class="font-bold text-slate-400">CODE:</span><span class="font-mono text-slate-700 cursor-pointer hover:text-blue-600 hover:underline decoration-dotted" title="Click để copy" (click)="copyText(std.product_code, $event)">{{std.product_code || '-'}}</span>
                                            @if(std.cas_number) { <span class="font-bold text-slate-400">CAS:</span><span class="font-mono text-slate-700">{{std.cas_number}}</span> }
                                        </div>
                                        <div class="mt-2 pt-1 border-t border-slate-100 text-[10px] flex items-center gap-2 text-slate-500">
                                            @if(std.purity) { <span>Pur: <b class="text-slate-700">{{std.purity}}</b></span> }
                                            @if(std.pack_size) { <span>Pack: <b class="text-slate-700">{{std.pack_size}}</b></span> }
                                        </div>
                                     </td>
                                     <td class="px-4 py-3 align-top border-l border-slate-50">
                                        <div class="flex items-baseline justify-between mb-1"><span class="text-lg font-black text-indigo-600 leading-none">{{formatNum(std.current_amount)}}</span><span class="text-[10px] font-bold text-slate-400 ml-1">{{std.unit}}</span></div>
                                        <div class="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden relative"><div class="h-full rounded-full transition-all duration-500" [style.width.%]="Math.min((std.current_amount / (std.initial_amount || 1)) * 100, 100)" [class.bg-indigo-500]="(std.current_amount / (std.initial_amount || 1)) > 0.2" [class.bg-red-500]="(std.current_amount / (std.initial_amount || 1)) <= 0.2"></div></div>
                                        @let sInfo = getStorageInfo(std.storage_condition);
                                        <div class="flex flex-col gap-1 mt-1">
                                            @for (info of sInfo; track $index) { <div class="px-1.5 py-0.5 rounded text-[9px] flex items-center gap-1.5 border w-fit" [ngClass]="[info.bg, info.border, info.color]"><i class="fa-solid" [ngClass]="info.icon"></i><span class="font-bold">{{info.text}}</span></div> }
                                        </div>
                                     </td>
                                     <td class="px-4 py-3 align-top border-l border-slate-50">
                                        <div class="flex flex-col gap-0.5 mb-2">
                                            <div class="font-mono font-bold text-xs" [class]="getExpiryClass(std.expiry_date)">{{std.expiry_date ? (std.expiry_date | date:'dd/MM/yyyy') : 'N/A'}}</div>
                                            <div class="text-[10px] font-medium" [class]="getExpiryTimeClass(std.expiry_date)">{{ getExpiryTimeLeft(std.expiry_date) }}</div>
                                        </div>
                                        <div class="flex flex-col gap-1.5">
                                            @if(std.certificate_ref) { <button (click)="openCoaPreview(std.certificate_ref, $event)" class="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 hover:bg-blue-100 transition w-fit"><i class="fa-solid fa-file-pdf"></i> CoA</button> }
                                            @if(std.contract_ref) { <div class="text-[10px] text-slate-400 truncate max-w-[120px] flex items-center gap-1" title="Hợp đồng"><i class="fa-solid fa-file-contract"></i> {{std.contract_ref}}</div> }
                                        </div>
                                     </td>
                                     <td class="px-4 py-3 align-top text-center border-l border-slate-50">
                                         @let status = getStandardStatus(std);
                                         <span class="inline-block px-2 py-1 rounded-md text-[10px] font-bold uppercase border tracking-wide whitespace-nowrap" [ngClass]="status.class">{{status.label}}</span>
                                     </td>
                                     <td class="px-4 py-3 align-top text-center border-l border-slate-50">
                                        <div class="flex flex-col items-center gap-2">
                                           <button (click)="openWeighModal(std)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 transition active:scale-95" title="Cân chuẩn"><i class="fa-solid fa-weight-scale text-xs"></i></button>
                                           <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                               <button (click)="viewHistory(std)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition border border-slate-200" title="Lịch sử"><i class="fa-solid fa-clock-rotate-left text-[10px]"></i></button>
                                               @if(auth.canEditStandards()) { <button (click)="openEditModal(std)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 transition" title="Sửa"><i class="fa-solid fa-pen text-[10px]"></i></button> }
                                           </div>
                                        </div>
                                     </td>
                                  </tr>
                               } 
                               @if (visibleItems().length === 0) { <tr><td colspan="7" class="p-16 text-center text-slate-400 italic">Không tìm thấy dữ liệu.</td></tr> }
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
                            <div class="py-16 text-center text-slate-400 italic w-full">
                                <i class="fa-solid fa-box-open text-4xl mb-2 text-slate-300"></i>
                                <p>Không tìm thấy dữ liệu chuẩn phù hợp.</p>
                            </div>
                        } @else {
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                @for (std of visibleItems(); track std.id) {
                                    <div class="bg-white rounded-2xl border transition-all duration-200 flex flex-col relative group h-full hover:-translate-y-1 hover:shadow-lg overflow-hidden"
                                         [class.border-slate-200]="!selectedIds().has(std.id)"
                                         [class.border-indigo-400]="selectedIds().has(std.id)"
                                         [class.shadow-md]="selectedIds().has(std.id)"
                                         [class.bg-indigo-50]="selectedIds().has(std.id)">
                                        
                                        <!-- Header: Status Bar -->
                                        <div class="w-full h-1.5 flex bg-slate-100 shrink-0">
                                            <div class="h-full w-full" [class]="getExpiryBarClass(std.expiry_date)"></div>
                                        </div>

                                        <div class="p-4 flex flex-col h-full">
                                            <!-- Top: ID, Location & Checkbox -->
                                            <div class="flex justify-between items-start mb-3">
                                                <div class="flex flex-wrap gap-1.5 items-start pr-2">
                                                    @if(std.internal_id) {
                                                        <span class="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider border border-indigo-100 shadow-sm whitespace-nowrap">
                                                            {{std.internal_id}}
                                                        </span>
                                                    }
                                                    @if(std.location) {
                                                        <span class="bg-white text-slate-600 px-2 py-1 rounded text-[10px] font-bold border border-slate-200 flex items-center gap-1 shadow-sm whitespace-nowrap">
                                                            <i class="fa-solid fa-location-dot text-[9px]"></i> {{std.location}}
                                                        </span>
                                                    }
                                                </div>
                                                <input type="checkbox" [checked]="selectedIds().has(std.id)" (change)="toggleSelection(std.id)" class="w-5 h-5 accent-indigo-600 cursor-pointer shrink-0 mt-0.5">
                                            </div>

                                            <!-- Identity -->
                                            <div class="mb-4 cursor-pointer" (click)="openEditModal(std)">
                                                <h3 class="font-bold text-slate-800 text-sm leading-snug mb-1 hover:text-indigo-600 transition line-clamp-2 min-h-[2.5em]">{{std.name}}</h3>
                                                @if(std.chemical_name) { <p class="text-xs text-slate-500 italic line-clamp-1 font-medium">{{std.chemical_name}}</p> }
                                            </div>

                                            <!-- Data Grid (Click to copy) -->
                                            <div class="grid grid-cols-2 gap-px bg-slate-100 rounded-lg overflow-hidden border border-slate-100 mb-4 text-[10px]">
                                                <div class="bg-white p-2 hover:bg-blue-50 transition cursor-pointer group/cell" (click)="copyText(std.lot_number, $event)" title="Copy Lot">
                                                    <div class="text-slate-400 font-bold uppercase mb-0.5 flex justify-between">Lot <i class="fa-regular fa-copy opacity-0 group-hover/cell:opacity-100"></i></div>
                                                    <div class="font-mono font-bold text-slate-700 truncate">{{std.lot_number || '-'}}</div>
                                                </div>
                                                <div class="bg-white p-2 hover:bg-blue-50 transition cursor-pointer group/cell" (click)="copyText(std.product_code, $event)" title="Copy Code">
                                                    <div class="text-slate-400 font-bold uppercase mb-0.5 flex justify-between">Code <i class="fa-regular fa-copy opacity-0 group-hover/cell:opacity-100"></i></div>
                                                    <div class="font-mono font-bold text-slate-700 truncate">{{std.product_code || '-'}}</div>
                                                </div>
                                                <div class="bg-white p-2">
                                                    <div class="text-slate-400 font-bold uppercase mb-0.5">Mfg</div>
                                                    <div class="font-bold text-slate-700 truncate" [title]="std.manufacturer">{{std.manufacturer || '-'}}</div>
                                                </div>
                                                <div class="bg-white p-2">
                                                    <div class="text-slate-400 font-bold uppercase mb-0.5">CAS</div>
                                                    <div class="font-mono font-bold text-slate-700 truncate">{{std.cas_number || '-'}}</div>
                                                </div>
                                            </div>

                                            <!-- Stock & Storage -->
                                            <div class="mt-auto">
                                                <div class="flex justify-between items-end mb-1">
                                                    <span class="text-[9px] font-bold text-slate-400 uppercase">Tồn kho</span>
                                                    <span class="font-black text-indigo-600 text-lg leading-none">{{formatNum(std.current_amount)}} <small class="text-xs font-bold text-slate-400">{{std.unit}}</small></span>
                                                </div>
                                                <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mb-3">
                                                    <div class="bg-indigo-500 h-1.5 rounded-full transition-all" [style.width.%]="(std.current_amount / (std.initial_amount || 1)) * 100"></div>
                                                </div>
                                                
                                                <!-- Storage Badges -->
                                                <div class="flex flex-wrap gap-1 mb-4 min-h-[22px]">
                                                    @for (info of getStorageInfo(std.storage_condition); track $index) {
                                                        <div class="px-1.5 py-0.5 rounded text-[9px] flex items-center gap-1 border" [ngClass]="[info.bg, info.border, info.color]">
                                                            <i class="fa-solid" [ngClass]="info.icon"></i>
                                                            <span class="font-bold">{{info.text}}</span>
                                                        </div>
                                                    }
                                                </div>
                                            </div>

                                            <!-- Footer Actions -->
                                            <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                                                <div class="flex flex-col">
                                                    <span class="text-[9px] font-bold text-slate-400 uppercase">Hết hạn</span>
                                                    <span class="text-xs font-bold" [class]="getExpiryTimeClass(std.expiry_date)">{{getExpiryTimeLeft(std.expiry_date) || 'N/A'}}</span>
                                                </div>
                                                
                                                <div class="flex gap-1">
                                                    @if(std.certificate_ref) {
                                                        <button (click)="$event.stopPropagation(); openCoaPreview(std.certificate_ref, $event)" class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition flex items-center justify-center" title="Xem CoA">
                                                            <i class="fa-solid fa-file-pdf text-xs"></i>
                                                        </button>
                                                    }
                                                    <button (click)="$event.stopPropagation(); viewHistory(std)" class="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 transition flex items-center justify-center" title="Lịch sử">
                                                        <i class="fa-solid fa-clock-rotate-left text-xs"></i>
                                                    </button>
                                                    <button (click)="$event.stopPropagation(); openWeighModal(std)" class="w-auto px-3 h-8 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 transition flex items-center justify-center gap-1 font-bold text-xs active:scale-95">
                                                        <i class="fa-solid fa-weight-scale"></i> Cân
                                                    </button>
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
             
             @if (hasMore() && !isLoading()) {
                <div class="text-center p-4">
                    <button (click)="loadMore()" class="text-xs font-bold text-gray-500 hover:text-indigo-600 transition active:scale-95 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm">
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

                <!-- Tabs Header -->
                <div class="flex bg-white border-b border-slate-100 px-6 shrink-0">
                   <button (click)="activeModalTab.set('general')" class="py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide mr-4" [class]="activeModalTab() === 'general' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'">1. Thông tin chung</button>
                   <button (click)="activeModalTab.set('stock')" class="py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide mr-4" [class]="activeModalTab() === 'stock' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'">2. Kho & Bảo quản</button>
                   <button (click)="activeModalTab.set('docs')" class="py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide" [class]="activeModalTab() === 'docs' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'">3. Hồ sơ & Hạn dùng</button>
                </div>
                
                <div class="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white">
                    <form [formGroup]="form" class="space-y-6">
                        
                        <!-- TAB 1: GENERAL INFO -->
                        @if (activeModalTab() === 'general') {
                            <div class="space-y-4 fade-in">
                                <div>
                                    <label class="text-xs font-bold text-slate-700 uppercase block mb-1">Tên Chuẩn <span class="text-red-500">*</span></label>
                                    <input formControlName="name" (input)="onNameChange($event)" class="w-full border border-slate-300 rounded-lg p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500" placeholder="VD: Sulfadiazine Standard">
                                </div>
                                <!-- NEW: Chemical Name Field -->
                                <div>
                                    <label class="text-xs font-bold text-slate-700 uppercase block mb-1">Tên hóa học / Tên khác</label>
                                    <input formControlName="chemical_name" class="w-full border border-slate-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 italic text-slate-600" placeholder="VD: N-(2-pyrimidinyl)benzenesulfonamide">
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <div><label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Mã sản phẩm (Code)</label><input formControlName="product_code" class="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white"></div>
                                    <div><label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Số CAS</label><input formControlName="cas_number" class="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white"></div>
                                    <div><label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Hãng sản xuất</label><input formControlName="manufacturer" class="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white"></div>
                                    <div><label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Hàm lượng (Purity)</label><input formControlName="purity" class="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white" placeholder="VD: 99.5%"></div>
                                </div>
                                <div class="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                                    <div><label class="text-[10px] font-bold text-indigo-700 uppercase block mb-1">Quy cách (Pack Size)</label><input formControlName="pack_size" class="w-full border border-indigo-200 rounded-lg p-2 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 bg-white" placeholder="VD: 10mg"></div>
                                    <div><label class="text-[10px] font-bold text-indigo-700 uppercase block mb-1">Số Lô (Lot No.)</label><input formControlName="lot_number" class="w-full border border-indigo-200 rounded-lg p-2 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 bg-white" placeholder="VD: BCBW1234"></div>
                                </div>
                            </div>
                        }

                        <!-- TAB 2: STOCK & STORAGE -->
                        @if (activeModalTab() === 'stock') {
                            <div class="space-y-4 fade-in">
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Mã Quản lý (Internal ID)</label>
                                        <input formControlName="internal_id" (input)="onInternalIdChange($event)" class="w-full border border-slate-300 rounded-lg p-2 text-sm font-bold font-mono outline-none focus:border-indigo-500 uppercase" placeholder="VD: AA01">
                                    </div>
                                    <div>
                                        <label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Vị trí (Location)</label>
                                        <input formControlName="location" class="w-full border border-slate-300 rounded-lg p-2 text-sm outline-none focus:border-indigo-500 bg-slate-50" placeholder="Tự động từ mã ID (VD: Tủ A)">
                                    </div>
                                </div>
                                
                                <div class="bg-indigo-50 p-4 rounded-xl border border-indigo-100 grid grid-cols-3 gap-4">
                                    <div><label class="text-[10px] font-bold text-indigo-800 uppercase block mb-1">Tồn đầu</label><input type="number" formControlName="initial_amount" class="w-full border border-white rounded-lg p-2 text-center font-bold outline-none"></div>
                                    <div><label class="text-[10px] font-bold text-indigo-800 uppercase block mb-1">Hiện tại</label><input type="number" formControlName="current_amount" class="w-full border border-white rounded-lg p-2 text-center font-bold text-indigo-600 outline-none text-lg"></div>
                                    <div>
                                        <label class="text-[10px] font-bold text-indigo-800 uppercase block mb-1">Đơn vị</label>
                                        <select formControlName="unit" class="w-full border border-white rounded-lg p-2.5 text-center font-bold outline-none bg-white h-[44px]">
                                            @for(u of unitOptions; track u.value){<option [value]="u.value">{{u.value}}</option>}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Điều kiện bảo quản</label>
                                    <input formControlName="storage_condition" class="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-indigo-500" placeholder="VD: FT (Tủ đông), RT (Nhiệt độ phòng)...">
                                </div>
                            </div>
                        }

                        <!-- TAB 3: DOCS & EXPIRY -->
                        @if (activeModalTab() === 'docs') {
                            <div class="space-y-4 fade-in">
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Ngày nhận (Received)</label>
                                        <input type="date" formControlName="received_date" class="w-full border border-slate-200 rounded-lg p-2 text-sm font-bold outline-none focus:border-indigo-500">
                                    </div>
                                    <div>
                                        <label class="text-[10px] font-bold text-red-400 uppercase block mb-1">Hạn sử dụng (Expiry)</label>
                                        <div class="flex items-center gap-2">
                                            <input type="date" formControlName="expiry_date" class="w-full border border-red-200 rounded-lg p-2 text-sm font-bold text-red-600 outline-none focus:border-red-500 bg-red-50">
                                        </div>
                                    </div>
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div><label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Ngày mở nắp</label><input type="date" formControlName="date_opened" class="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-indigo-500"></div>
                                    <div><label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Số Hợp đồng / Dự án</label><input formControlName="contract_ref" class="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-indigo-500"></div>
                                </div>
                                
                                <div class="pt-2 border-t border-slate-100">
                                    <label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">COA File (Link/Upload)</label>
                                    <div class="flex gap-2">
                                        <input formControlName="certificate_ref" (input)="sanitizeDriveLink($event)" class="flex-1 border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-indigo-500 text-blue-600 underline" placeholder="Paste URL here...">
                                        <button type="button" (click)="uploadInput.click()" class="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap">
                                            <i class="fa-solid fa-cloud-arrow-up"></i> Upload
                                        </button>
                                        <input #uploadInput type="file" class="hidden" (change)="uploadCoaFile($event)">
                                    </div>
                                    <p class="text-[9px] text-slate-400 mt-1 italic">Hỗ trợ link Google Drive (tự động chuyển sang chế độ preview).</p>
                                </div>
                            </div>
                        }

                    </form>
                </div>

                <!-- Footer Actions -->
                <div class="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                    <button (click)="closeModal()" class="px-5 py-2.5 text-slate-600 hover:bg-slate-200 rounded-xl font-bold text-sm transition">Hủy bỏ</button>
                    <button (click)="saveStandard()" [disabled]="form.invalid" class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50">
                        {{ isEditing() ? 'Lưu Thay Đổi' : 'Tạo Mới' }}
                    </button>
                </div>
            </div>
         </div>
      }

      <!-- IMPORT PREVIEW MODAL -->
      @if (importPreviewData().length > 0) {
         <div class="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                
                <div class="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                    <div>
                        <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
                            <i class="fa-solid fa-file-import text-emerald-600"></i> Xác nhận Import
                        </h3>
                        <p class="text-xs text-slate-500 mt-1">Vui lòng kiểm tra kỹ ngày tháng trước khi lưu.</p>
                    </div>
                    <button (click)="cancelImport()" class="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 transition active:scale-95"><i class="fa-solid fa-times"></i></button>
                </div>

                <div class="flex-1 overflow-auto custom-scrollbar p-6">
                    <div class="mb-4 bg-yellow-50 border border-yellow-100 rounded-lg p-3 flex gap-3 text-sm text-yellow-800">
                        <i class="fa-solid fa-triangle-exclamation mt-0.5"></i>
                        <div>
                            <span class="font-bold">Lưu ý ngày tháng:</span> Hệ thống đang ép kiểu ngày tháng theo định dạng <b>dd/mm/yyyy</b> (Việt Nam).<br>
                            Ví dụ: Chuỗi <b>05/10/2024</b> sẽ được hiểu là ngày <b>5 tháng 10</b>. Hãy kiểm tra cột "Kết quả (Hệ thống hiểu)" bên dưới.
                        </div>
                    </div>

                    <table class="w-full text-xs text-left border-collapse border border-slate-200">
                        <thead class="bg-slate-100 text-slate-500 font-bold uppercase sticky top-0">
                            <tr>
                                <th class="p-2 border border-slate-200">Tên Chuẩn</th>
                                <th class="p-2 border border-slate-200">Lô (Lot)</th>
                                <th class="p-2 border border-slate-200 bg-red-50 text-red-700 w-32">Ngày nhận (Gốc)</th>
                                <th class="p-2 border border-slate-200 bg-emerald-50 text-emerald-700 w-32">Kết quả (Hệ thống hiểu)</th>
                                <th class="p-2 border border-slate-200">Hạn dùng (Parsed)</th>
                            </tr>
                        </thead>
                        <tbody>
                            @for (item of importPreviewData().slice(0, 10); track $index) {
                                <tr class="hover:bg-slate-50">
                                    <td class="p-2 border border-slate-200 truncate max-w-[200px]" [title]="item.parsed.name">{{item.parsed.name}}</td>
                                    <td class="p-2 border border-slate-200 font-mono">{{item.parsed.lot_number}}</td>
                                    <td class="p-2 border border-slate-200 font-mono bg-red-50/30">{{item.raw['Ngày nhận (Gốc)']}}</td>
                                    <td class="p-2 border border-slate-200 font-bold font-mono text-emerald-700 bg-emerald-50/30">
                                        {{item.parsed.received_date ? (item.parsed.received_date | date:'dd/MM/yyyy') : '---'}}
                                    </td>
                                    <td class="p-2 border border-slate-200 font-mono">
                                        {{item.parsed.expiry_date ? (item.parsed.expiry_date | date:'dd/MM/yyyy') : '---'}}
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                    @if(importPreviewData().length > 10) {
                        <p class="text-center text-xs text-slate-400 mt-2 italic">... và {{importPreviewData().length - 10}} dòng khác.</p>
                    }
                </div>

                <div class="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                    <button (click)="cancelImport()" class="px-5 py-2.5 text-slate-600 hover:bg-slate-200 rounded-xl font-bold text-sm transition">Hủy bỏ</button>
                    <button (click)="confirmImport()" [disabled]="isImporting()" class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50 flex items-center gap-2">
                        @if(isImporting()) { <i class="fa-solid fa-spinner fa-spin"></i> Đang lưu... }
                        @else { <i class="fa-solid fa-check"></i> Xác nhận Import }
                    </button>
                </div>
            </div>
         </div>
      }

      <!-- Weigh, History, COA Preview Modals... (No changes needed here) -->
      @if (selectedStd()) {
         <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-bounce-in relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-2 bg-indigo-500"></div>
                <h3 class="font-black text-xl text-slate-800 mb-1">Cân chuẩn</h3>
                <p class="text-sm text-slate-500 mb-6">{{selectedStd()?.name}}</p>
                <div class="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 flex justify-between items-center">
                    <span class="text-xs font-bold text-indigo-800 uppercase">Tồn kho hiện tại</span>
                    <span class="font-mono font-black text-xl text-indigo-600">{{formatNum(selectedStd()?.current_amount)}} <small>{{selectedStd()?.unit}}</small></span>
                </div>
                <div class="space-y-4">
                    <div><label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Ngày pha chế</label><input type="date" [(ngModel)]="weighDate" class="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"></div>
                    <div><label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Người pha chế</label><input type="text" [(ngModel)]="weighUser" class="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"></div>
                    <div class="grid grid-cols-3 gap-2">
                        <div class="col-span-2"><label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Lượng cân</label><input type="number" [(ngModel)]="weighAmount" class="w-full border-2 border-indigo-100 rounded-xl p-3 font-black text-2xl text-indigo-600 outline-none focus:border-indigo-500 text-center" placeholder="0.00" autofocus></div>
                        <div><label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Đơn vị</label><select [(ngModel)]="weighUnit" class="w-full h-[54px] border border-slate-200 bg-slate-50 rounded-xl px-2 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500">@for(u of unitOptions; track u.value){<option [value]="u.value">{{u.value}}</option>}</select></div>
                    </div>
                    @if(weighUnit() !== selectedStd()?.unit) { <div class="text-[10px] text-orange-600 bg-orange-50 p-2 rounded-lg border border-orange-100 flex items-center gap-2"><i class="fa-solid fa-calculator"></i><span>Tự động quy đổi từ <b>{{weighUnit()}}</b> sang <b>{{selectedStd()?.unit}}</b>.</span></div> }
                </div>
                <div class="flex justify-end gap-3 mt-8"><button (click)="selectedStd.set(null)" class="px-5 py-3 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-xl transition">Hủy bỏ</button><button (click)="confirmWeigh()" [disabled]="weighAmount() <= 0" class="px-8 py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition disabled:opacity-50">Xác nhận</button></div>
            </div>
         </div>
      }
      
      @if (historyStd()) {
         <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
            <div class="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]">
               <div class="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                  <div><h3 class="font-bold text-slate-800 text-lg">Lịch sử sử dụng</h3><p class="text-xs text-slate-500 font-mono">{{historyStd()?.name}}</p></div>
                  <button (click)="historyStd.set(null)" class="text-slate-400 hover:text-slate-600 transition"><i class="fa-solid fa-times text-xl"></i></button>
               </div>
               <div class="flex-1 overflow-y-auto p-0 custom-scrollbar">
                  <table class="w-full text-sm text-left"><thead class="bg-slate-50 text-xs font-bold text-slate-500 uppercase sticky top-0 border-b border-slate-100 shadow-sm"><tr><th class="px-6 py-4 w-32">Thời gian</th><th class="px-6 py-4">Người thực hiện</th><th class="px-6 py-4 text-right w-32">Lượng dùng</th>@if(state.isAdmin()){<th class="px-6 py-4 text-center w-24">Tác vụ</th>}</tr></thead><tbody class="divide-y divide-slate-50">
                        @if (loadingHistory()) { <tr><td colspan="4" class="p-8 text-center text-slate-400"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải...</td></tr> } @else {
                            @for (log of historyLogs(); track log.id) { <tr class="hover:bg-slate-50 transition group"> <td class="px-6 py-4 text-slate-600 font-mono text-xs">{{ log.date | date:'dd/MM/yyyy' }}</td><td class="px-6 py-4"><div class="font-bold text-slate-700 text-xs">{{ log.user }}</div></td><td class="px-6 py-4 text-right"><span class="font-bold text-red-600 bg-red-50 px-2 py-1 rounded text-xs">-{{ formatNum(log.amount_used) }} <span class="text-[9px] text-slate-500">{{log.unit || historyStd()?.unit}}</span></span></td>@if(state.isAdmin()){<td class="px-6 py-4 text-center"><button (click)="deleteLog(log)" class="text-red-500 hover:text-red-700 p-2"><i class="fa-solid fa-trash"></i></button></td>}</tr> } @empty { <tr><td colspan="4" class="p-8 text-center text-slate-400 italic">Chưa có dữ liệu.</td></tr> }
                        }
                  </tbody></table>
               </div>
            </div>
         </div>
      }

      <!-- COA PREVIEW -->
      @if (previewUrl() || previewImgUrl()) {
          <div class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm fade-in" (click)="closeCoaPreview()">
              <div class="relative w-full max-w-5xl h-[85vh] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col" (click)="$event.stopPropagation()">
                  <div class="bg-slate-900 text-white p-3 flex justify-between items-center shrink-0"><span class="text-sm font-bold pl-2"><i class="fa-solid fa-file-pdf mr-2"></i> Preview Certificate of Analysis</span><div class="flex gap-3"><a [href]="previewRawUrl()" target="_blank" class="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded transition">Mở Tab mới</a><button (click)="closeCoaPreview()" class="text-white hover:text-red-400 transition"><i class="fa-solid fa-times text-lg"></i></button></div></div>
                  <div class="flex-1 bg-slate-100 relative">
                      @if(previewType() === 'image') { <div class="w-full h-full flex items-center justify-center overflow-auto"><img [src]="previewImgUrl()" class="max-w-full max-h-full object-contain shadow-lg"></div> } 
                      @else { <iframe [src]="previewUrl()" class="w-full h-full border-none"></iframe> }
                  </div>
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
  private fb: FormBuilder = inject(FormBuilder);
  Math = Math;
  
  isLoading = signal(true);
  isUploading = signal(false);
  isImporting = signal(false);

  viewMode = signal<'list' | 'grid'>('grid');
  searchTerm = signal('');
  sortOption = signal<string>('received_desc');
  searchSubject = new Subject<string>();

  // --- CHANGED: CLIENT-SIDE STATE ---
  allStandards = signal<ReferenceStandard[]>([]); // Holds ALL data from Firebase stream
  displayLimit = signal<number>(50); // Virtual scroll limit
  private snapshotUnsub?: Unsubscribe;

  // Computed: Filter -> Sort -> Slice
  filteredItems = computed(() => {
      let data = this.allStandards();
      const term = this.searchTerm().trim().toLowerCase();
      
      // 1. FILTER
      if (term) {
          const normalize = (s: string | undefined) => s ? s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
          const normTerm = normalize(term);
          
          data = data.filter(item => {
              // Check ALL searchable fields substring
              const searchStr = `
                  ${normalize(item.name)} 
                  ${normalize(item.internal_id)} 
                  ${normalize(item.lot_number)} 
                  ${normalize(item.product_code)} 
                  ${normalize(item.cas_number)} 
                  ${normalize(item.chemical_name)}
                  ${normalize(item.location)}
                  ${normalize(item.manufacturer)}
              `;
              return searchStr.includes(normTerm);
          });
      }

      // 2. SORT
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
  activeModalTab = signal<'general' | 'stock' | 'docs'>('general');
  unitOptions = UNIT_OPTIONS;

  // Import Preview State
  importPreviewData = signal<ImportPreviewItem[]>([]);

  selectedStd = signal<ReferenceStandard | null>(null);
  weighAmount = signal<number>(0);
  weighUser = signal<string>('');
  weighDate = signal<string>('');
  weighUnit = signal<string>('mg');
  
  historyStd = signal<ReferenceStandard | null>(null);
  historyLogs = signal<UsageLog[]>([]);
  loadingHistory = signal(false);
  
  showModal = signal(false);
  isEditing = signal(false);
  
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
  }

  ngOnDestroy() { 
      this.searchSubject.complete(); 
      if (this.snapshotUnsub) this.snapshotUnsub();
  }

  onInternalIdChange(event: any) {
      const val = event.target.value.toUpperCase();
      if (val && val.length > 0 && !this.isEditing()) {
          const firstChar = val.charAt(0);
          if (firstChar.match(/[A-Z]/)) this.form.patchValue({ location: `Tủ ${firstChar}` });
      }
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

  openAddModal() { this.isEditing.set(false); this.activeModalTab.set('general'); this.form.reset({ initial_amount: 0, current_amount: 0, unit: 'mg' }); this.showModal.set(true); }
  
  openEditModal(std: ReferenceStandard) { 
      if (!this.auth.canEditStandards()) return; 
      this.isEditing.set(true); 
      this.activeModalTab.set('general'); 
      this.form.reset({ initial_amount: 0, current_amount: 0, unit: 'mg' }); 
      this.form.patchValue(std as any); 
      this.showModal.set(true); 
  }
  
  closeModal() { this.showModal.set(false); }
  
  onNameChange(event: any) { 
      if (!this.isEditing()) { const lot = this.form.get('lot_number')?.value || ''; this.form.patchValue({ id: generateSlug(event.target.value + '_' + (lot || Date.now().toString())) }); } 
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

  async saveStandard() {
      if (this.form.invalid) { this.toast.show('Vui lòng điền các trường bắt buộc (*)', 'error'); return; }
      const val = this.form.value;
      if (!val.id) val.id = generateSlug(val.name + '_' + Date.now());
      const std: ReferenceStandard = { ...val as any, name: val.name?.trim(), internal_id: val.internal_id?.toUpperCase().trim(), location: val.location?.trim() };
      try {
          if (this.isEditing()) await this.stdService.updateStandard(std); else await this.stdService.addStandard(std);
          this.toast.show(this.isEditing() ? 'Cập nhật thành công' : 'Tạo mới thành công'); this.closeModal(); 
      } catch (e: any) { this.toast.show('Lỗi: ' + e.message, 'error'); }
  }

  async deleteSelected() {
      const ids = Array.from(this.selectedIds());
      if (ids.length === 0) return;
      if (await this.confirmationService.confirm({ message: `Bạn có chắc muốn xóa vĩnh viễn ${ids.length} chuẩn đã chọn và TẤT CẢ lịch sử của chúng?`, confirmText: 'Xóa vĩnh viễn', isDangerous: true })) {
          this.isLoading.set(true);
          try { 
              await this.stdService.deleteSelectedStandards(ids); 
              this.toast.show(`Đã xóa ${ids.length} mục.`, 'success'); 
              this.selectedIds.set(new Set());
          } catch(e: any) { 
              this.toast.show('Lỗi xóa: ' + e.message, 'error'); 
          } finally {
              this.isLoading.set(false);
          }
      }
  }

  async deleteAll() {
      if (await this.confirmationService.confirm({ message: 'Reset toàn bộ dữ liệu Chuẩn? Hệ thống sẽ xóa sạch cả lịch sử dụng của từng chuẩn.\nHành động này không thể hoàn tác.', confirmText: 'Xóa Sạch', isDangerous: true })) {
          this.isLoading.set(true);
          try { 
              await this.stdService.deleteAllStandards(); 
              this.toast.show('Đã xóa toàn bộ dữ liệu và logs.', 'success'); 
          } catch (e: any) { 
              this.toast.show('Lỗi xóa: ' + e.message, 'error'); 
          } finally {
              this.isLoading.set(false);
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

  cancelImport() {
      this.importPreviewData.set([]);
  }

  async confirmImport() {
      if (this.importPreviewData().length === 0) return;
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

  async uploadCoaFile(event: any) {
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
      if (std.current_amount <= 0) return { label: 'Hết hàng', class: 'bg-slate-100 text-slate-500 border-slate-200' };
      
      if (!std.expiry_date) return { label: 'Chưa rõ hạn', class: 'bg-slate-50 text-slate-500 border-slate-200' };
      
      const exp = new Date(std.expiry_date);
      const today = new Date();
      if (exp < today) return { label: 'Hết hạn SD', class: 'bg-red-50 text-red-600 border-red-200' };
      
      const diffDays = (exp.getTime() - today.getTime()) / (1000 * 3600 * 24);
      if (diffDays < 180) return { label: 'Sắp hết hạn', class: 'bg-orange-50 text-orange-600 border-orange-200' };
      
      return { label: 'Đang sử dụng', class: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
  }

  copyText(text: string | undefined, event: Event) {
      event.stopPropagation();
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => this.toast.show('Đã copy: ' + text));
  }

  openWeighModal(std: ReferenceStandard) { this.selectedStd.set(std); this.weighAmount.set(0); this.weighDate.set(new Date().toISOString().split('T')[0]); this.weighUser.set(this.state.currentUser()?.displayName || ''); this.weighUnit.set(std.unit); }
  async confirmWeigh() {
      const std = this.selectedStd(); const amount = this.weighAmount();
      if (!std || amount <= 0) return;
      try {
          await this.stdService.recordUsage(std.id, { date: this.weighDate(), user: this.weighUser() || 'Unknown', amount_used: amount, unit: this.weighUnit(), purpose: 'Cân mẫu', timestamp: Date.now() });
          this.toast.show('Đã cập nhật!'); this.selectedStd.set(null); 
      } catch (e: any) { this.toast.show('Lỗi: ' + e.message, 'error'); }
  }

  async viewHistory(std: ReferenceStandard) { this.historyStd.set(std); this.loadingHistory.set(true); try { const logs = await this.stdService.getUsageHistory(std.id); this.historyLogs.set(logs); } finally { this.loadingHistory.set(false); } }
  async deleteLog(log: UsageLog) {
      if (!this.historyStd() || !log.id) return;
      if (await this.confirmationService.confirm({ message: `Xóa lịch sử dụng ngày ${log.date}?`, confirmText: 'Xóa & Hoàn kho', isDangerous: true })) {
          try { await this.stdService.deleteUsageLog(this.historyStd()!.id, log.id); this.toast.show('Đã xóa', 'success'); await this.viewHistory(this.historyStd()!); } catch (e: any) { this.toast.show('Lỗi: ' + e.message, 'error'); }
      }
  }

  openCoaPreview(url: string, event: Event) {
      event.stopPropagation(); if (!url) return; this.previewRawUrl.set(url);
      const cleanUrl = url.split('?')[0].toLowerCase();
      const isImage = /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/.test(cleanUrl);
      if (isImage) { this.previewType.set('image'); this.previewImgUrl.set(url); } else { this.previewType.set('iframe'); this.previewUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url)); }
  }
  closeCoaPreview() { this.previewUrl.set(null); this.previewImgUrl.set(''); }
}
