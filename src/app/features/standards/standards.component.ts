
import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StateService } from '../../core/services/state.service';
import { StandardService, StandardsPage, ImportPreviewItem } from './standard.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { ReferenceStandard, UsageLog } from '../../core/models/standard.model';
import { formatNum, generateSlug, UNIT_OPTIONS } from '../../shared/utils/utils';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { AuthService } from '../../core/services/auth.service';

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
                           placeholder="Tìm kiếm chuẩn, mã số, số lô...">
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
          </div>

          <!-- Content Body -->
          <div class="flex-1 overflow-y-auto custom-scrollbar relative bg-slate-50/30">
             
             <!-- VIEW MODE: LIST (TABLE) -->
             @if (viewMode() === 'list') {
                 <div class="min-w-[900px] md:min-w-0"> 
                     <table class="w-full text-sm text-left relative">
                        <thead class="text-xs text-slate-400 font-bold uppercase bg-slate-50 sticky top-0 z-10 border-b border-slate-100 shadow-sm h-12">
                           <tr>
                              <th class="px-4 py-4 w-10 bg-slate-50 text-center"><input type="checkbox" [checked]="isAllSelected()" (change)="toggleAll()" class="w-4 h-4 accent-indigo-600 cursor-pointer"></th>
                              <th class="px-4 py-4 w-80 bg-slate-50">Tên Chuẩn / Vị trí</th>
                              <th class="px-4 py-4 hidden md:table-cell bg-slate-50">Thông tin (Lô / Code)</th>
                              <th class="px-4 py-4 text-center w-28 hidden lg:table-cell bg-slate-50">Bảo quản</th>
                              <th class="px-4 py-4 text-center w-32 hidden md:table-cell bg-slate-50">Hạn dùng</th>
                              <th class="px-4 py-4 text-right w-36 bg-slate-50">Tồn kho</th>
                              <th class="px-4 py-4 text-center w-24 bg-slate-50">Tác vụ</th>
                           </tr>
                        </thead>
                        <tbody class="bg-white">
                           @if (isLoading()) {
                                @for (i of [1,2,3,4,5]; track i) {
                                    <tr class="h-24">
                                        <td class="px-4"><app-skeleton width="16px" height="16px"></app-skeleton></td>
                                        <td class="px-4"><app-skeleton width="180px" height="14px"></app-skeleton></td>
                                        <td class="px-4 hidden md:table-cell"><app-skeleton width="80px" height="10px"></app-skeleton></td>
                                        <td class="px-4 hidden lg:table-cell text-center"><app-skeleton shape="circle" width="30px" height="30px" class="mx-auto"></app-skeleton></td>
                                        <td class="px-4 text-center hidden md:table-cell"><app-skeleton width="80px" height="20px" class="mx-auto"></app-skeleton></td>
                                        <td class="px-4 text-right"><app-skeleton width="60px" height="20px" class="ml-auto"></app-skeleton></td>
                                        <td class="px-4 text-center"><app-skeleton width="60px" height="30px" class="mx-auto"></app-skeleton></td>
                                    </tr>
                                }
                           } @else {
                               @for (std of items(); track std.id) {
                                  <tr class="hover:bg-slate-50 transition group h-24 border-b border-slate-50" [class.bg-indigo-50]="selectedIds().has(std.id)">
                                     <td class="px-4 py-3 text-center align-top pt-4">
                                         <input type="checkbox" [checked]="selectedIds().has(std.id)" (change)="toggleSelection(std.id)" class="w-4 h-4 accent-indigo-600 cursor-pointer">
                                     </td>
                                     <td class="px-4 py-3 align-top">
                                        <div class="flex flex-col gap-1">
                                            <div class="flex items-center gap-2">
                                                <span class="bg-indigo-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1" title="Vị trí lưu kho">
                                                    <i class="fa-solid fa-location-dot text-[8px]"></i>
                                                    {{std.location || std.internal_id || 'NO-LOC'}}
                                                </span>
                                            </div>
                                            <div class="font-bold text-slate-700 text-sm leading-snug hover:text-indigo-600 transition cursor-pointer flex items-center gap-2 whitespace-pre-wrap" (click)="openEditModal(std)">
                                                {{std.name}}
                                                @if(std.certificate_ref) {
                                                    <button (click)="openCoaPreview(std.certificate_ref, $event)" class="text-indigo-500 hover:text-indigo-700 transition" title="Xem CoA"><i class="fa-solid fa-file-pdf"></i></button>
                                                }
                                            </div>
                                        </div>
                                     </td>
                                     <td class="px-4 py-3 align-top hidden md:table-cell">
                                        <div class="grid grid-cols-1 gap-y-1 text-xs">
                                            <div class="flex items-center gap-1"><span class="text-[9px] font-bold text-slate-400 uppercase w-8">Lot:</span><span class="font-mono font-medium text-slate-700 select-all">{{std.lot_number || '-'}}</span></div>
                                            <div class="flex items-center gap-1"><span class="text-[9px] font-bold text-slate-400 uppercase w-8">Code:</span><span class="font-mono font-medium text-slate-700 select-all">{{std.product_code || '-'}}</span></div>
                                            <div class="flex items-center gap-1"><span class="text-[9px] font-bold text-slate-400 uppercase w-8">Pack:</span><span class="font-mono font-bold text-slate-600">{{std.pack_size || '-'}}</span></div>
                                        </div>
                                     </td>
                                     <td class="px-4 py-3 text-center align-top hidden lg:table-cell">
                                        @let sIcons = getStorageIcons(std.storage_condition);
                                        <div class="flex justify-center gap-1" [title]="std.storage_condition">
                                            @for (icon of sIcons; track $index) {
                                                <div class="w-7 h-7 rounded-lg flex items-center justify-center text-xs shadow-sm border" [ngClass]="[icon.bg, icon.border]"><i class="fa-solid" [ngClass]="[icon.icon, icon.color]"></i></div>
                                            }
                                        </div>
                                     </td>
                                     <td class="px-4 py-3 text-center align-top hidden md:table-cell">
                                        <div class="inline-flex flex-col items-center">
                                            <div class="font-mono font-bold text-xs" [class]="getExpiryClass(std.expiry_date)">{{std.expiry_date ? (std.expiry_date | date:'dd/MM/yyyy') : 'N/A'}}</div>
                                            <div class="text-[9px] font-bold mt-1 px-2 py-0.5 rounded border uppercase" [class]="getExpiryStatusClass(std.expiry_date)">{{ getExpiryStatus(std.expiry_date) }}</div>
                                        </div>
                                     </td>
                                     <td class="px-4 py-3 text-right align-top">
                                        <div class="font-black text-indigo-600 text-lg tracking-tight">{{formatNum(std.current_amount)}} <span class="text-xs font-bold text-slate-400">{{std.unit}}</span></div>
                                        <div class="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden relative">
                                            <div class="h-1.5 rounded-full transition-all duration-500" 
                                                 [style.width.%]="Math.min((std.current_amount / (std.initial_amount || 1)) * 100, 100)"
                                                 [class.bg-indigo-500]="(std.current_amount / (std.initial_amount || 1)) > 0.2"
                                                 [class.bg-red-500]="(std.current_amount / (std.initial_amount || 1)) <= 0.2">
                                            </div>
                                        </div>
                                     </td>
                                     <td class="px-4 py-3 text-center align-top">
                                        <div class="flex items-center justify-center gap-2">
                                           <button (click)="openWeighModal(std)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition shadow-sm" title="Cân chuẩn"><i class="fa-solid fa-weight-scale"></i></button>
                                           <button (click)="viewHistory(std)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-200 transition" title="Lịch sử"><i class="fa-solid fa-clock-rotate-left"></i></button>
                                        </div>
                                     </td>
                                  </tr>
                               } 
                               @if (items().length === 0) {
                                  <tr><td colspan="7" class="p-16 text-center text-slate-400 italic">Không tìm thấy dữ liệu.</td></tr>
                               }
                           }
                        </tbody>
                     </table>
                 </div>
             } 
             @else {
                 <div class="p-4">
                    @if (isLoading()) { 
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            @for(i of [1,2,3,4]; track i) { <app-skeleton height="200px"></app-skeleton> }
                        </div> 
                    } @else {
                        @if (items().length === 0) {
                            <div class="py-16 text-center text-slate-400 italic w-full">
                                <i class="fa-solid fa-box-open text-4xl mb-2 text-slate-300"></i>
                                <p>Không tìm thấy dữ liệu chuẩn phù hợp.</p>
                            </div>
                        } @else {
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                @for (std of items(); track std.id) {
                                    <div class="bg-white rounded-2xl p-4 border transition-all duration-200 flex flex-col relative group h-[280px]"
                                         [class.border-slate-200]="!selectedIds().has(std.id)"
                                         [class.border-indigo-400]="selectedIds().has(std.id)"
                                         [class.shadow-lg]="selectedIds().has(std.id)"
                                         [class.bg-indigo-50]="selectedIds().has(std.id)"
                                         (click)="toggleSelection(std.id)">
                                        
                                        <!-- Card Header: Status Bar -->
                                        <div class="w-full h-1.5 rounded-full mb-3 flex overflow-hidden bg-slate-100">
                                            <div class="h-full" [style.width.%]="100" [class]="getExpiryBarClass(std.expiry_date)"></div>
                                        </div>

                                        <div class="flex justify-between items-start mb-2">
                                            <span class="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border border-indigo-100 truncate max-w-[120px]">
                                                <i class="fa-solid fa-location-dot mr-1"></i> {{std.location || std.internal_id || 'NO-LOC'}}
                                            </span>
                                            <!-- Checkbox Overlay -->
                                            <input type="checkbox" [checked]="selectedIds().has(std.id)" class="w-5 h-5 accent-indigo-600 cursor-pointer">
                                        </div>

                                        <h3 (click)="$event.stopPropagation(); openEditModal(std)" class="font-bold text-slate-800 text-sm leading-snug mb-3 cursor-pointer hover:text-indigo-600 transition line-clamp-2 min-h-[2.5em]">
                                            {{std.name}}
                                        </h3>

                                        <div class="grid grid-cols-2 gap-y-1 gap-x-2 text-xs text-slate-500 mb-4 bg-slate-50/50 p-2 rounded-lg border border-slate-100/50">
                                            <div><span class="font-bold text-slate-400 text-[9px] uppercase block">Lot No.</span> <span class="font-mono text-slate-700">{{std.lot_number || '-'}}</span></div>
                                            <div><span class="font-bold text-slate-400 text-[9px] uppercase block">Pack Size</span> <span class="font-bold text-slate-600">{{std.pack_size || '-'}}</span></div>
                                            <div><span class="font-bold text-slate-400 text-[9px] uppercase block">Expiry</span> <span class="font-mono font-bold" [class]="getExpiryClass(std.expiry_date)">{{std.expiry_date ? (std.expiry_date | date:'dd/MM/yyyy') : '-'}}</span></div>
                                            <div><span class="font-bold text-slate-400 text-[9px] uppercase block">Purity</span> <span class="font-bold text-indigo-600">{{std.purity || '-'}}</span></div>
                                        </div>

                                        <div class="mt-auto pt-3 border-t border-slate-100 flex items-end justify-between gap-3">
                                            <div class="flex-1">
                                                <div class="flex justify-between items-end mb-1">
                                                    <span class="text-[9px] font-bold text-slate-400 uppercase">Tồn kho</span>
                                                    <span class="font-black text-indigo-600 text-base leading-none">{{formatNum(std.current_amount)}} <small class="text-xs font-bold text-slate-400">{{std.unit}}</small></span>
                                                </div>
                                                <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                    <div class="bg-indigo-500 h-1.5 rounded-full transition-all" [style.width.%]="(std.current_amount / (std.initial_amount || 1)) * 100"></div>
                                                </div>
                                            </div>
                                            <div class="flex gap-1">
                                                <button (click)="$event.stopPropagation(); openWeighModal(std)" class="w-8 h-8 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 transition flex items-center justify-center active:scale-95" title="Cân">
                                                    <i class="fa-solid fa-weight-scale text-xs"></i>
                                                </button>
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
                                        <input formControlName="certificate_ref" class="flex-1 border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-indigo-500 text-blue-600 underline" placeholder="Paste URL here...">
                                        <button type="button" (click)="uploadInput.click()" class="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap">
                                            <i class="fa-solid fa-cloud-arrow-up"></i> Upload
                                        </button>
                                        <input #uploadInput type="file" class="hidden" (change)="uploadCoaFile($event)">
                                    </div>
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

      <!-- NEW: IMPORT PREVIEW MODAL -->
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
  isImporting = signal(false); // Loading state for import commit

  viewMode = signal<'list' | 'grid'>('list');
  searchTerm = signal('');
  searchSubject = new Subject<string>();

  items = signal<ReferenceStandard[]>([]);
  lastDoc = signal<QueryDocumentSnapshot | null>(null);
  hasMore = signal(true);

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
      id: [''], name: ['', Validators.required], 
      product_code: [''], cas_number: [''], purity: [''], manufacturer: [''], pack_size: [''], lot_number: [''], 
      internal_id: [''], location: [''], storage_condition: [''],
      initial_amount: [0, Validators.required], current_amount: [0, Validators.required], unit: ['mg', Validators.required], 
      expiry_date: [''], received_date: [''], date_opened: [''], contract_ref: [''], certificate_ref: ['']
  });

  formatNum = formatNum;

  constructor() {
      this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe(term => {
          this.searchTerm.set(term); this.refreshData();
      });
  }

  ngOnInit() { this.refreshData(); }
  ngOnDestroy() { this.searchSubject.complete(); }

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

  isAllSelected() { return this.items().length > 0 && this.items().every(i => this.selectedIds().has(i.id)); }
  toggleAll() {
      if (this.isAllSelected()) this.selectedIds.set(new Set());
      else this.selectedIds.set(new Set(this.items().map(i => i.id)));
  }

  async refreshData() {
      this.isLoading.set(true); this.items.set([]); this.lastDoc.set(null); this.hasMore.set(true); this.selectedIds.set(new Set()); await this.loadMore(true);
  }

  async loadMore(isRefresh = false) {
      if (!this.hasMore() && !isRefresh) return;
      if (isRefresh) this.isLoading.set(true);
      try {
          const page = await this.stdService.getStandardsPage(20, this.lastDoc(), this.searchTerm());
          if (isRefresh) this.items.set(page.items); else this.items.update(c => [...c, ...page.items]);
          this.lastDoc.set(page.lastDoc); this.hasMore.set(page.hasMore);
      } finally { this.isLoading.set(false); }
  }

  onSearchInput(val: string) { this.searchSubject.next(val); }

  openAddModal() { this.isEditing.set(false); this.activeModalTab.set('general'); this.form.reset({ initial_amount: 0, current_amount: 0, unit: 'mg' }); this.showModal.set(true); }
  openEditModal(std: ReferenceStandard) { if (!this.auth.canEditStandards()) return; this.isEditing.set(true); this.activeModalTab.set('general'); this.form.patchValue(std as any); this.showModal.set(true); }
  closeModal() { this.showModal.set(false); }
  
  onNameChange(event: any) { 
      if (!this.isEditing()) { const lot = this.form.get('lot_number')?.value || ''; this.form.patchValue({ id: generateSlug(event.target.value + '_' + (lot || Date.now().toString())) }); } 
  }

  async saveStandard() {
      if (this.form.invalid) { this.toast.show('Vui lòng điền các trường bắt buộc (*)', 'error'); return; }
      const val = this.form.value;
      if (!val.id) val.id = generateSlug(val.name + '_' + Date.now());
      const std: ReferenceStandard = { ...val as any, name: val.name?.trim(), internal_id: val.internal_id?.toUpperCase().trim(), location: val.location?.trim() };
      try {
          if (this.isEditing()) await this.stdService.updateStandard(std); else await this.stdService.addStandard(std);
          this.toast.show(this.isEditing() ? 'Cập nhật thành công' : 'Tạo mới thành công'); this.closeModal(); this.refreshData();
      } catch (e: any) { this.toast.show('Lỗi: ' + e.message, 'error'); }
  }

  async deleteSelected() {
      const ids = Array.from(this.selectedIds());
      if (ids.length === 0) return;
      if (await this.confirmationService.confirm({ message: `Bạn có chắc muốn xóa ${ids.length} chuẩn đã chọn?`, confirmText: 'Xóa vĩnh viễn', isDangerous: true })) {
          try { await this.stdService.deleteSelectedStandards(ids); this.toast.show(`Đã xóa ${ids.length} mục.`, 'success'); this.refreshData(); } catch(e) { this.toast.show('Lỗi xóa', 'error'); }
      }
  }

  async deleteAll() {
      if (await this.confirmationService.confirm({ message: 'Reset toàn bộ dữ liệu Chuẩn? Hệ thống sẽ xóa sạch cả lịch sử dụng của từng chuẩn.\nHành động này không thể hoàn tác.', confirmText: 'Xóa Sạch', isDangerous: true })) {
          this.isLoading.set(true);
          try { 
              await this.stdService.deleteAllStandards(); 
              this.toast.show('Đã xóa toàn bộ dữ liệu và logs.', 'success'); 
              this.refreshData(); 
          } catch (e: any) { 
              this.toast.show('Lỗi xóa: ' + e.message, 'error'); 
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
          this.refreshData();
      } catch (e: any) {
          this.toast.show('Lỗi lưu import: ' + e.message, 'error');
      } finally {
          this.isImporting.set(false);
      }
  }

  async uploadCoaFile(event: any) {
      const file = event.target.files[0]; if (!file) return; this.isUploading.set(true);
      try { const url = await this.firebaseService.uploadFile('coa_files', file); this.form.patchValue({ certificate_ref: url }); this.toast.show('Upload COA thành công!'); } 
      catch (e) { this.toast.show('Lỗi Upload', 'error'); } finally { this.isUploading.set(false); event.target.value = ''; }
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

  getStorageIcons(condition: string | undefined): { icon: string, color: string, bg: string, border: string }[] {
      if (!condition) return [];
      const icons: { icon: string, color: string, bg: string, border: string }[] = [];
      const lower = condition.toLowerCase();
      if (lower.includes('ft') || lower.includes('tủ đông') || lower.includes('-20')) { icons.push({ icon: 'fa-snowflake', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' }); }
      if (lower.includes('ct') || lower.includes('tủ mát') || lower.includes('2-8')) { icons.push({ icon: 'fa-temperature-low', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' }); }
      if (lower.includes('rt') || lower.includes('tủ c') || lower.includes('thường')) { icons.push({ icon: 'fa-sun', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' }); }
      if (lower.includes('d:') || lower.match(/\\bd\\b/) || lower.includes('tối') || lower.includes('dark')) { icons.push({ icon: 'fa-moon', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' }); }
      return icons;
  }

  getExpiryClass(dateStr: string | undefined): string {
      if (!dateStr) return 'text-slate-400';
      const exp = new Date(dateStr); const today = new Date();
      if (exp < today) return 'text-red-600 line-through decoration-2'; 
      const diffMonths = (exp.getTime() - today.getTime()) / (1000 * 3600 * 24 * 30);
      if (diffMonths < 6) return 'text-orange-600'; return 'text-indigo-600'; 
  }

  openWeighModal(std: ReferenceStandard) { this.selectedStd.set(std); this.weighAmount.set(0); this.weighDate.set(new Date().toISOString().split('T')[0]); this.weighUser.set(this.state.currentUser()?.displayName || ''); this.weighUnit.set(std.unit); }
  async confirmWeigh() {
      const std = this.selectedStd(); const amount = this.weighAmount();
      if (!std || amount <= 0) return;
      try {
          await this.stdService.recordUsage(std.id, { date: this.weighDate(), user: this.weighUser() || 'Unknown', amount_used: amount, unit: this.weighUnit(), purpose: 'Cân mẫu', timestamp: Date.now() });
          this.toast.show('Đã cập nhật!'); this.selectedStd.set(null); this.refreshData(); 
      } catch (e: any) { this.toast.show('Lỗi: ' + e.message, 'error'); }
  }

  async viewHistory(std: ReferenceStandard) { this.historyStd.set(std); this.loadingHistory.set(true); try { const logs = await this.stdService.getUsageHistory(std.id); this.historyLogs.set(logs); } finally { this.loadingHistory.set(false); } }
  async deleteLog(log: UsageLog) {
      if (!this.historyStd() || !log.id) return;
      if (await this.confirmationService.confirm({ message: `Xóa lịch sử dụng ngày ${log.date}?`, confirmText: 'Xóa & Hoàn kho', isDangerous: true })) {
          try { await this.stdService.deleteUsageLog(this.historyStd()!.id, log.id); this.toast.show('Đã xóa', 'success'); await this.viewHistory(this.historyStd()!); this.refreshData(); } catch (e: any) { this.toast.show('Lỗi: ' + e.message, 'error'); }
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
