
import { Component, inject, signal, computed, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StateService } from '../../core/services/state.service';
import { StandardService } from './standard.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { ReferenceStandard, UsageLog } from '../../core/models/standard.model';
import { formatNum, generateSlug, UNIT_OPTIONS } from '../../shared/utils/utils';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

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
        
        <div class="flex gap-2">
           @if(state.isAdmin()) {
             <button (click)="openAddModal()" class="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition font-bold text-xs flex items-center gap-2">
                <i class="fa-solid fa-plus"></i> Thêm mới
             </button>
             <button (click)="deleteAll()" class="hidden md:flex px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl transition font-bold text-xs items-center gap-2">
                <i class="fa-solid fa-trash"></i> Reset
             </button>
           }
           <button (click)="fileInput.click()" class="px-5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition font-bold text-xs flex items-center gap-2">
              <i class="fa-solid fa-file-excel"></i> Import
           </button>
           <input #fileInput type="file" class="hidden" accept=".xlsx, .xlsm" (change)="handleImport($event)">
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 overflow-hidden bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col relative">
          
          <!-- Omnibox Filters -->
          <div class="p-5 border-b border-slate-50 flex flex-col gap-4 bg-slate-50/30">
             
             <!-- Search Input Area -->
             <div class="flex flex-col md:flex-row gap-4">
                 <div class="relative flex-1 group">
                    <i class="fa-solid fa-search absolute left-4 top-3.5 text-slate-400 text-sm group-focus-within:text-indigo-500 transition-colors"></i>
                    <input type="text" [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)" 
                           class="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition shadow-sm"
                           placeholder="Tìm kiếm thông minh (VD: Methanol loc:TủA exp:<30 cas:67-56-1)...">
                    
                    <!-- Search Syntax Hints -->
                    <div class="absolute right-3 top-3 hidden md:flex gap-2">
                        <span class="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 font-mono" title="Tìm theo vị trí">loc:A1</span>
                        <span class="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 font-mono" title="Tìm theo CAS">cas:50-00-0</span>
                        <span class="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 font-mono" title="Hết hạn trong X ngày">exp:<30</span>
                    </div>
                 </div>

                 <!-- View Mode Toggle -->
                 <div class="flex bg-slate-200/50 p-1 rounded-xl shrink-0 h-[46px] self-start md:self-auto">
                    <button (click)="switchViewMode('list')" [class]="viewMode() === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'" class="w-10 h-full flex items-center justify-center rounded-lg transition" title="Dạng Danh sách">
                        <i class="fa-solid fa-list"></i>
                    </button>
                    <button (click)="switchViewMode('grid')" [class]="viewMode() === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'" class="w-10 h-full flex items-center justify-center rounded-lg transition" title="Dạng Lưới (Thẻ)">
                        <i class="fa-solid fa-border-all"></i>
                    </button>
                 </div>
             </div>

             <!-- Quick Filters (Presets) -->
             <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                <button (click)="searchTerm.set('')" 
                        class="px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap border"
                        [class]="!searchTerm() ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">
                    Tất cả ({{filteredStandards().length}})
                </button>
                <button (click)="searchTerm.set('exp:<0')" 
                        class="px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap border"
                        [class]="searchTerm().includes('exp:<0') ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-red-50 hover:text-red-600'">
                    Đã hết hạn
                </button>
                <button (click)="searchTerm.set('exp:<180')" 
                        class="px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap border"
                        [class]="searchTerm().includes('exp:<180') && !searchTerm().includes('exp:<0') ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-slate-600 border-slate-200 hover:bg-orange-50 hover:text-orange-600'">
                    Sắp hết (6 tháng)
                </button>
             </div>
          </div>

          <!-- Content Body (Scroll Container) -->
          <div #scrollContainer class="flex-1 overflow-y-auto custom-scrollbar relative bg-slate-50/30 will-change-scroll" (scroll)="onScroll($event)">
             
             <!-- VIEW MODE: LIST (TABLE) -->
             @if (viewMode() === 'list') {
                 <div class="min-w-[800px] md:min-w-0"> <!-- Force width on mobile -->
                     <table class="w-full text-sm text-left relative">
                        <thead class="text-xs text-slate-400 font-bold uppercase bg-slate-50 sticky top-0 z-10 border-b border-slate-100 shadow-sm h-12">
                           <tr>
                              <th class="px-6 py-4 w-80 bg-slate-50">Tên & Vị trí</th>
                              <th class="px-6 py-4 hidden md:table-cell bg-slate-50">Thông tin Chi tiết</th>
                              <th class="px-6 py-4 text-center w-28 hidden lg:table-cell bg-slate-50">Bảo quản</th>
                              <th class="px-6 py-4 text-center w-32 hidden md:table-cell bg-slate-50">Hạn dùng</th>
                              <th class="px-6 py-4 text-right w-36 bg-slate-50">Tồn kho</th>
                              <th class="px-6 py-4 text-center w-32 bg-slate-50">Tác vụ</th>
                           </tr>
                        </thead>
                        <tbody class="bg-white">
                           @if (isLoading()) {
                                <!-- SKELETON ROWS -->
                                @for (i of [1,2,3,4,5]; track i) {
                                    <tr class="h-24">
                                        <td class="px-6 py-4">
                                            <app-skeleton width="60px" height="16px" class="mb-2 block"></app-skeleton>
                                            <app-skeleton width="180px" height="14px"></app-skeleton>
                                        </td>
                                        <td class="px-6 py-4 hidden md:table-cell">
                                            <div class="grid grid-cols-2 gap-2">
                                                <app-skeleton width="80px" height="10px"></app-skeleton>
                                                <app-skeleton width="80px" height="10px"></app-skeleton>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 hidden lg:table-cell flex justify-center"><app-skeleton shape="circle" width="30px" height="30px"></app-skeleton></td>
                                        <td class="px-6 py-4 text-center hidden md:table-cell"><app-skeleton width="80px" height="20px" class="inline-block"></app-skeleton></td>
                                        <td class="px-6 py-4 text-right"><app-skeleton width="60px" height="20px" class="ml-auto"></app-skeleton></td>
                                        <td class="px-6 py-4 text-center"><app-skeleton width="60px" height="30px" class="mx-auto"></app-skeleton></td>
                                    </tr>
                                }
                           } @else {
                               <!-- Top Spacer -->
                               <tr [style.height.px]="virtualData().topPadding"></tr>

                               @for (std of virtualData().items; track std.id) {
                                  <tr class="hover:bg-slate-50 transition group h-24 border-b border-slate-50">
                                     <!-- Col 1: Location & Name -->
                                     <td class="px-6 py-3 align-top">
                                        <div class="flex flex-col gap-1">
                                            <div class="flex items-center gap-2">
                                                <span class="bg-indigo-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1" title="Vị trí lưu kho">
                                                    <i class="fa-solid fa-location-dot text-[8px]"></i>
                                                    {{std.internal_id || 'NO-LOC'}}
                                                </span>
                                            </div>
                                            <div class="font-bold text-slate-700 text-sm leading-snug hover:text-indigo-600 transition cursor-pointer flex items-center gap-2 whitespace-pre-wrap" (click)="openEditModal(std)">
                                                {{std.name}}
                                                @if(std.certificate_ref) {
                                                    <button (click)="openCoaPreview(std.certificate_ref, $event)" 
                                                       class="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition shrink-0 ml-1" 
                                                       title="Xem trước CoA">
                                                        <i class="fa-solid fa-eye text-[10px]"></i>
                                                    </button>
                                                }
                                            </div>
                                        </div>
                                     </td>

                                     <!-- Col 2: Details -->
                                     <td class="px-6 py-3 align-top hidden md:table-cell">
                                        <div class="grid grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                            <div class="flex items-center gap-1"><span class="text-[9px] font-bold text-slate-400 uppercase w-10">Lot:</span><span class="font-mono font-medium text-slate-700 select-all">{{std.lot_number || '---'}}</span></div>
                                            <div class="flex items-center gap-1"><span class="text-[9px] font-bold text-slate-400 uppercase w-10">Code:</span><span class="font-mono font-medium text-slate-700 select-all">{{std.product_code || '---'}}</span></div>
                                            <div class="flex items-center gap-1"><span class="text-[9px] font-bold text-slate-400 uppercase w-10">CAS:</span><span class="font-mono font-medium text-slate-700 select-all">{{std.cas_number || '---'}}</span></div>
                                            <div class="flex items-center gap-1"><span class="text-[9px] font-bold text-slate-400 uppercase w-10">Purity:</span><span class="font-mono font-bold text-indigo-600 select-all">{{std.purity || '---'}}</span></div>
                                        </div>
                                     </td>

                                     <!-- Col 3: Storage -->
                                     <td class="px-6 py-3 text-center align-top hidden lg:table-cell">
                                        @let sIcons = getStorageIcons(std.storage_condition);
                                        <div class="flex justify-center gap-1" [title]="std.storage_condition">
                                            @for (icon of sIcons; track $index) {
                                                <div class="w-7 h-7 rounded-lg flex items-center justify-center text-xs shadow-sm border" [ngClass]="[icon.bg, icon.border]"><i class="fa-solid" [ngClass]="[icon.icon, icon.color]"></i></div>
                                            }
                                        </div>
                                     </td>

                                     <!-- Col 4: Expiry -->
                                     <td class="px-6 py-3 text-center align-top hidden md:table-cell">
                                        <div class="inline-flex flex-col items-center">
                                            <div class="font-mono font-bold text-xs" [class]="getExpiryClass(std.expiry_date)">{{std.expiry_date ? (std.expiry_date | date:'dd/MM/yyyy') : 'N/A'}}</div>
                                            <div class="text-[9px] font-bold mt-1 px-2 py-0.5 rounded border uppercase" [class]="getExpiryStatusClass(std.expiry_date)">{{ getExpiryStatus(std.expiry_date) }}</div>
                                        </div>
                                     </td>

                                     <!-- Col 5: Stock -->
                                     <td class="px-6 py-3 text-right align-top">
                                        <div class="font-black text-indigo-600 text-lg tracking-tight">{{formatNum(std.current_amount)}} <span class="text-xs font-bold text-slate-400">{{std.unit}}</span></div>
                                        <div class="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden"><div class="bg-indigo-500 h-1.5 rounded-full transition-all duration-500" [style.width.%]="(std.current_amount / (std.initial_amount || 1)) * 100"></div></div>
                                     </td>

                                     <!-- Col 6: Actions -->
                                     <td class="px-6 py-3 text-center align-top">
                                        <div class="flex items-center justify-center gap-2">
                                           <button (click)="openWeighModal(std)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition shadow-sm" title="Cân chuẩn"><i class="fa-solid fa-weight-scale"></i></button>
                                           <button (click)="viewHistory(std)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-200 transition" title="Lịch sử"><i class="fa-solid fa-clock-rotate-left"></i></button>
                                           @if(state.isAdmin()) { <button (click)="deleteStandard(std)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-500 hover:text-red-600 hover:bg-red-50 transition" title="Xóa"><i class="fa-solid fa-trash"></i></button> }
                                        </div>
                                     </td>
                                  </tr>
                               } 
                               @if (filteredStandards().length === 0) {
                                  <tr><td colspan="6" class="p-16 text-center text-slate-400 italic">Không tìm thấy dữ liệu chuẩn phù hợp.</td></tr>
                               }

                               <!-- Bottom Spacer -->
                               <tr [style.height.px]="virtualData().bottomPadding"></tr>
                           }
                        </tbody>
                     </table>
                 </div>
             } 
             
             <!-- VIEW MODE: GRID (CARDS) -->
             @else {
                 <div class="p-4 relative">
                    @if (isLoading()) {
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            @for (i of [1,2,3,4,5,6]; track i) {
                                <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-3 h-64">
                                    <app-skeleton width="100%" height="24px" shape="text"></app-skeleton>
                                    <app-skeleton width="100%" height="12px"></app-skeleton>
                                    <app-skeleton width="100%" height="40px" shape="rect"></app-skeleton>
                                </div>
                            }
                        </div>
                    } @else {
                        @if (filteredStandards().length === 0) {
                            <div class="py-16 text-center text-slate-400 italic w-full">
                                <i class="fa-solid fa-box-open text-4xl mb-2 text-slate-300"></i>
                                <p>Không tìm thấy dữ liệu chuẩn phù hợp.</p>
                            </div>
                        } @else {
                            <!-- Virtual Grid Container -->
                            <div [style.height.px]="virtualData().totalHeight" class="relative w-full">
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 absolute top-0 left-0 w-full"
                                     [style.transform]="'translateY(' + virtualData().topPadding + 'px)'">
                                    
                                    @for (std of virtualData().items; track std.id) {
                                        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all duration-200 flex flex-col relative group"
                                             style="height: 280px;"> <!-- Fixed Height for Grid Cards -->
                                            
                                            <!-- Card Header -->
                                            <div class="flex justify-between items-start mb-2">
                                                <span class="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border border-indigo-100">
                                                    <i class="fa-solid fa-location-dot mr-1"></i> {{std.internal_id || 'NO-LOC'}}
                                                </span>
                                                
                                                <div class="flex items-center gap-1">
                                                    @if(std.certificate_ref) {
                                                        <button (click)="openCoaPreview(std.certificate_ref, $event)" class="text-indigo-500 hover:text-indigo-700 p-1" title="Xem CoA">
                                                            <i class="fa-solid fa-file-contract"></i>
                                                        </button>
                                                    }
                                                    <div class="px-2 py-0.5 rounded text-[9px] font-bold uppercase border" [class]="getExpiryStatusClass(std.expiry_date)">
                                                        {{ getExpiryStatus(std.expiry_date) }}
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Title -->
                                            <h3 (click)="openEditModal(std)" class="font-bold text-slate-800 text-sm leading-snug mb-3 cursor-pointer hover:text-indigo-600 transition line-clamp-2 min-h-[2.5em]">
                                                {{std.name}}
                                            </h3>

                                            <!-- Details Grid -->
                                            <div class="grid grid-cols-2 gap-y-1 gap-x-2 text-xs text-slate-500 mb-4 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                                <div><span class="font-bold text-slate-400 text-[9px] uppercase block">Lot No.</span> <span class="font-mono text-slate-700">{{std.lot_number || '-'}}</span></div>
                                                <div><span class="font-bold text-slate-400 text-[9px] uppercase block">Code</span> <span class="font-mono text-slate-700">{{std.product_code || '-'}}</span></div>
                                                <div><span class="font-bold text-slate-400 text-[9px] uppercase block">CAS</span> <span class="font-mono text-slate-700">{{std.cas_number || '-'}}</span></div>
                                                <div><span class="font-bold text-slate-400 text-[9px] uppercase block">Purity</span> <span class="font-bold text-indigo-600">{{std.purity || '-'}}</span></div>
                                            </div>

                                            <!-- Stock & Actions -->
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
                                                    <button (click)="openWeighModal(std)" class="w-8 h-8 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 transition flex items-center justify-center active:scale-95" title="Cân">
                                                        <i class="fa-solid fa-weight-scale text-xs"></i>
                                                    </button>
                                                    <button (click)="viewHistory(std)" class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition flex items-center justify-center active:scale-95" title="Lịch sử">
                                                        <i class="fa-solid fa-clock-rotate-left text-xs"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <!-- Delete Hover (Desktop) -->
                                            @if(state.isAdmin()) {
                                                <button (click)="deleteStandard(std)" class="absolute top-2 right-2 w-6 h-6 bg-white/90 text-red-400 hover:text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-sm border border-slate-100">
                                                    <i class="fa-solid fa-trash text-[10px]"></i>
                                                </button>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                    }
                 </div>
             }
          </div>
      </div>

      <!-- COA PREVIEW MODAL -->
      @if (previewRawUrl()) {
        <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm fade-in" (click)="closeCoaPreview()">
            <div class="bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative animate-bounce-in" (click)="$event.stopPropagation()">
                <!-- Header -->
                <div class="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                    <h3 class="font-bold text-slate-700 flex items-center gap-2">
                        <i class="fa-solid fa-file-contract text-indigo-500"></i> 
                        Xem trước CoA @if(previewType() === 'image') { <span class="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded">Ảnh</span> }
                    </h3>
                    <div class="flex items-center gap-2">
                        <a [href]="previewRawUrl()" target="_blank" class="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded transition flex items-center gap-2 border border-transparent hover:border-blue-200">
                            <i class="fa-solid fa-external-link-alt"></i> Mở tab mới
                        </a>
                        <button (click)="closeCoaPreview()" class="w-8 h-8 rounded-full bg-slate-200 text-slate-500 hover:bg-red-500 hover:text-white transition flex items-center justify-center">
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </div>
                </div>
                <!-- Content -->
                <div class="flex-1 bg-slate-100 relative flex items-center justify-center overflow-hidden">
                    @if (previewType() === 'iframe' && previewUrl()) {
                        <iframe [src]="previewUrl()" class="w-full h-full border-none" allow="autoplay"></iframe>
                    } @else if (previewType() === 'image') {
                        <div class="w-full h-full overflow-auto flex items-center justify-center p-4 custom-scrollbar">
                            <img [src]="previewImgUrl()" class="max-w-full max-h-full object-contain shadow-md rounded border border-slate-200 bg-white">
                        </div>
                    }
                </div>
            </div>
        </div>
      }

      <!-- ... (OTHER MODALS kept same as before) ... -->
      @if (showModal()) {
         <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
               <div class="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                  <div>
                      <h3 class="font-black text-slate-800 text-lg uppercase tracking-wide flex items-center gap-2">
                          <i class="fa-solid fa-vial text-indigo-500"></i>
                          {{ isEditing() ? 'Cập nhật Thông tin' : 'Thêm mới Chuẩn' }}
                      </h3>
                      <p class="text-xs text-slate-400 mt-0.5">Nhập chính xác thông tin để quản lý kho hiệu quả.</p>
                  </div>
                  <button (click)="closeModal()" class="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 transition"><i class="fa-solid fa-times"></i></button>
               </div>
               <div class="flex-1 flex overflow-hidden">
                   <div class="w-48 bg-slate-50 border-r border-slate-100 flex flex-col p-2 space-y-1">
                       <button (click)="activeModalTab.set('general')" class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition flex items-center gap-3" [class]="activeModalTab() === 'general' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100'"><i class="fa-solid fa-circle-info"></i> Định danh</button>
                       <button (click)="activeModalTab.set('stock')" class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition flex items-center gap-3" [class]="activeModalTab() === 'stock' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100'"><i class="fa-solid fa-boxes-stacked"></i> Kho & Bảo quản</button>
                       <button (click)="activeModalTab.set('origin')" class="w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition flex items-center gap-3" [class]="activeModalTab() === 'origin' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100'"><i class="fa-solid fa-file-contract"></i> Nguồn gốc & CoA</button>
                   </div>
                   <div class="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar">
                       <form [formGroup]="form" (ngSubmit)="saveStandard()">
                           @if (activeModalTab() === 'general') {
                               <div class="space-y-5 fade-in">
                                   <div class="grid grid-cols-1 gap-5">
                                       <div class="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                           <label class="block text-xs font-bold text-indigo-800 uppercase mb-2">Tên Chuẩn <span class="text-red-500">*</span></label>
                                           <textarea formControlName="name" (input)="onNameChange($event)" rows="3" class="w-full border border-indigo-200 rounded-lg p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 placeholder-indigo-300 resize-none" placeholder="Nhập tên chuẩn (hỗ trợ xuống dòng)..."></textarea>
                                       </div>
                                       <div><label class="block text-xs font-bold text-slate-500 uppercase mb-2">Mã Quản lý / Vị trí lưu kho</label><input formControlName="internal_id" class="w-full border border-slate-300 rounded-lg p-3 text-sm font-mono text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="VD: Tủ A1 - Ngăn 2 (STD-001)"></div>
                                   </div>
                               </div>
                           }
                           @if (activeModalTab() === 'stock') {
                               <div class="space-y-5 fade-in">
                                   <div class="grid grid-cols-3 gap-5">
                                       <div><label class="block text-xs font-bold text-slate-500 uppercase mb-1">Lượng Ban đầu <span class="text-red-500">*</span></label><input type="number" formControlName="initial_amount" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"></div>
                                       <div><label class="block text-xs font-bold text-slate-500 uppercase mb-1">Lượng Hiện tại <span class="text-red-500">*</span></label><input type="number" formControlName="current_amount" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-bold text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500"></div>
                                       <div><label class="block text-xs font-bold text-slate-500 uppercase mb-1">Đơn vị <span class="text-red-500">*</span></label><select formControlName="unit" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none bg-white">@for (opt of unitOptions; track opt.value) { <option [value]="opt.value">{{opt.label}}</option> }</select></div>
                                   </div>
                                   <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-5">
                                       <div class="col-span-1 md:col-span-2"><label class="block text-xs font-bold text-slate-500 uppercase mb-1">Điều kiện bảo quản</label><input formControlName="storage_condition" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="VD: FT, CT, RT, d (trong tối)..."></div>
                                       <div><label class="block text-xs font-bold text-slate-500 uppercase mb-1">Hạn sử dụng</label><input type="date" formControlName="expiry_date" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"></div>
                                       <div><label class="block text-xs font-bold text-slate-500 uppercase mb-1">Ngày mở nắp</label><input type="date" formControlName="date_opened" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"></div>
                                   </div>
                               </div>
                           }
                           @if (activeModalTab() === 'origin') {
                               <div class="space-y-5 fade-in">
                                   <div class="grid grid-cols-2 gap-5">
                                       <div><label class="block text-xs font-bold text-slate-500 uppercase mb-1">Số Lô (Lot)</label><input formControlName="lot_number" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-mono"></div>
                                       <div><label class="block text-xs font-bold text-slate-500 uppercase mb-1">Mã Sản phẩm (Code)</label><input formControlName="product_code" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"></div>
                                       <div><label class="block text-xs font-bold text-slate-500 uppercase mb-1">CAS Number</label><input formControlName="cas_number" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-mono text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500"></div>
                                       <div><label class="block text-xs font-bold text-slate-500 uppercase mb-1">Độ tinh khiết (Purity)</label><input formControlName="purity" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-bold text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="VD: 99.8%"></div>
                                       <div class="col-span-2 border-t border-slate-100 pt-2"></div>
                                       <div><label class="block text-xs font-bold text-slate-500 uppercase mb-1">Nhà sản xuất (Hãng)</label><input formControlName="manufacturer" list="manufacturerOptions" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"><datalist id="manufacturerOptions">@for (man of uniqueManufacturers(); track man) { <option [value]="man"></option> }</datalist></div>
                                       <div><label class="block text-xs font-bold text-slate-500 uppercase mb-1">Quy cách</label><input formControlName="pack_size" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="VD: 100mg"></div>
                                       
                                       <!-- Upload Section -->
                                       <div class="col-span-2">
                                           <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Link CoA (Google Drive / Direct Link)</label>
                                           <div class="flex gap-2">
                                              <input formControlName="certificate_ref" placeholder="Paste link hoặc Upload file..." class="flex-1 border border-slate-300 rounded-lg p-2.5 text-sm text-blue-600 underline outline-none focus:ring-2 focus:ring-indigo-500">
                                              
                                              <!-- Upload Button -->
                                              <button type="button" (click)="coaFileInput.click()" [disabled]="isUploading()"
                                                      class="px-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 transition flex items-center gap-2 disabled:opacity-50">
                                                  @if(isUploading()) { <i class="fa-solid fa-spinner fa-spin"></i> } 
                                                  @else { <i class="fa-solid fa-cloud-arrow-up"></i> Upload }
                                              </button>
                                              <input #coaFileInput type="file" class="hidden" accept=".pdf, image/*" (change)="uploadCoaFile($event)">
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           }
                           <button type="submit" class="hidden"></button>
                       </form>
                   </div>
               </div>
               <div class="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                   <button type="button" (click)="closeModal()" class="px-5 py-2.5 text-slate-600 hover:bg-slate-200 rounded-xl font-bold text-sm transition">Hủy bỏ</button>
                   <button (click)="saveStandard()" [disabled]="form.invalid || isUploading()" class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50">{{ isEditing() ? 'Lưu Cập Nhật' : 'Tạo Mới' }}</button>
               </div>
            </div>
         </div>
      }
      
      @if (selectedStd()) {
         <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-bounce-in relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-2 bg-indigo-500"></div>
                <h3 class="font-black text-xl text-slate-800 mb-1">Cân chuẩn</h3>
                <p class="text-sm text-slate-500 mb-6">{{selectedStd()?.name}}</p>
                <div class="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 flex justify-between items-center"><span class="text-xs font-bold text-indigo-800 uppercase">Tồn kho hiện tại</span><span class="font-mono font-black text-xl text-indigo-600">{{formatNum(selectedStd()?.current_amount)}} <small>{{selectedStd()?.unit}}</small></span></div>
                <div class="space-y-4">
                    <div><label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Ngày pha chế</label><input type="date" [(ngModel)]="weighDate" class="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"></div>
                    <div><label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Người pha chế</label><input type="text" [(ngModel)]="weighUser" class="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"></div>
                    <div><label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Lượng cân ({{selectedStd()?.unit}})</label><input type="number" [(ngModel)]="weighAmount" class="w-full border-2 border-indigo-100 rounded-xl p-3 font-black text-2xl text-indigo-600 outline-none focus:border-indigo-500 text-center" placeholder="0.00" autofocus></div>
                </div>
                <div class="flex justify-end gap-3 mt-8">
                    <button (click)="selectedStd.set(null)" class="px-5 py-3 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-xl transition">Hủy bỏ</button>
                    <button (click)="confirmWeigh()" [disabled]="weighAmount() <= 0" class="px-8 py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition disabled:opacity-50">Xác nhận</button>
                </div>
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
                  <table class="w-full text-sm text-left">
                     <thead class="bg-slate-50 text-xs font-bold text-slate-500 uppercase sticky top-0 border-b border-slate-100 shadow-sm">
                        <tr><th class="px-6 py-4 w-32">Thời gian</th><th class="px-6 py-4">Người thực hiện</th><th class="px-6 py-4 text-right w-32">Lượng dùng</th>@if(state.isAdmin()) { <th class="px-6 py-4 text-center w-24">Tác vụ</th> }</tr>
                     </thead>
                     <tbody class="divide-y divide-slate-50">
                        @if (loadingHistory()) { <tr><td colspan="4" class="p-8 text-center text-slate-400"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải...</td></tr> } @else {
                            @for (log of historyLogs(); track log.id) {
                               <tr class="hover:bg-slate-50 transition group">
                                  @if (editingLogId() !== log.id) {
                                      <td class="px-6 py-4 text-slate-600 font-mono text-xs">{{ log.date | date:'dd/MM/yyyy' }}</td>
                                      <td class="px-6 py-4"><div class="font-bold text-slate-700 text-xs">{{ log.user }}</div></td>
                                      <td class="px-6 py-4 text-right"><span class="font-bold text-red-600 bg-red-50 px-2 py-1 rounded text-xs">-{{ formatNum(log.amount_used) }}</span></td>
                                      @if(state.isAdmin()) { <td class="px-6 py-4 text-center"><div class="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition"><button (click)="startEditLog(log)" class="w-7 h-7 flex items-center justify-center rounded bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition"><i class="fa-solid fa-pen text-[10px]"></i></button><button (click)="deleteLog(log)" class="w-7 h-7 flex items-center justify-center rounded bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"><i class="fa-solid fa-trash text-[10px]"></i></button></div></td> }
                                  } @else {
                                      <td class="px-4 py-2"><input type="date" [(ngModel)]="tempLog.date" class="w-full text-xs border rounded p-1"></td>
                                      <td class="px-4 py-2"><input type="text" [(ngModel)]="tempLog.user" class="w-full text-xs border rounded p-1"></td>
                                      <td class="px-4 py-2 text-right"><input type="number" [(ngModel)]="tempLog.amount_used" class="w-20 text-xs border rounded p-1 text-right font-bold"></td>
                                      <td class="px-4 py-2 text-center"><div class="flex justify-center gap-1"><button (click)="saveLogEdit()" class="text-green-600 hover:text-green-800 p-1"><i class="fa-solid fa-check"></i></button><button (click)="cancelLogEdit()" class="text-slate-400 hover:text-slate-600 p-1"><i class="fa-solid fa-times"></i></button></div></td>
                                  }
                               </tr>
                            } @empty { <tr><td colspan="4" class="p-8 text-center text-slate-400 italic">Chưa có dữ liệu.</td></tr> }
                        }
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      }
    </div>
  `
})
export class StandardsComponent implements OnInit, AfterViewInit, OnDestroy {
  state = inject(StateService);
  stdService = inject(StandardService);
  firebaseService = inject(FirebaseService); // Inject generic FirebaseService for upload
  toast = inject(ToastService);
  confirmationService = inject(ConfirmationService);
  sanitizer: DomSanitizer = inject(DomSanitizer); 
  private fb: FormBuilder = inject(FormBuilder);
  
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  isLoading = signal(true);
  isUploading = signal(false);

  // New State for View Mode
  viewMode = signal<'list' | 'grid'>('list');

  searchTerm = signal('');
  filterStatus = signal<'all' | 'warning' | 'expired'>('all'); // Deprecated but kept for UI binding
  activeModalTab = signal<'general' | 'stock' | 'origin'>('general');
  unitOptions = UNIT_OPTIONS;

  selectedStd = signal<ReferenceStandard | null>(null);
  weighAmount = signal<number>(0);
  weighUser = signal<string>('');
  weighDate = signal<string>('');
  
  historyStd = signal<ReferenceStandard | null>(null);
  historyLogs = signal<UsageLog[]>([]);
  loadingHistory = signal(false);
  editingLogId = signal<string | null>(null);
  tempLog: UsageLog = { date: '', user: '', amount_used: 0 };
  
  showModal = signal(false);
  isEditing = signal(false);
  
  // CoA Preview State
  previewUrl = signal<SafeResourceUrl | null>(null); // Iframe
  previewImgUrl = signal<string>(''); // Image
  previewType = signal<'iframe' | 'image'>('iframe');
  previewRawUrl = signal<string>('');

  // --- VIRTUAL SCROLL STATE ---
  scrollTop = signal(0);
  viewportHeight = signal(600); // Default, updated by resize observer
  gridColumns = signal(1); 
  private resizeObserver!: ResizeObserver;

  // Constants
  readonly LIST_ITEM_HEIGHT = 96; // Approximate row height in pixels (h-24)
  readonly GRID_ITEM_HEIGHT = 280 + 16; // Card height + gap (approx)

  form = this.fb.group({
      id: [''], 
      name: ['', Validators.required], 
      internal_id: [''], 
      product_code: [''], cas_number: [''], purity: [''],
      initial_amount: [0, Validators.required], current_amount: [0, Validators.required], unit: ['mg', Validators.required], 
      expiry_date: [''], received_date: [''], date_opened: [''], storage_condition: [''], 
      lot_number: [''], manufacturer: [''], pack_size: [''], contract_ref: [''], certificate_ref: ['']
  });

  formatNum = formatNum;

  ngOnInit() {
      if (this.state.standards().length > 0) {
          this.isLoading.set(false);
      } else {
          setTimeout(() => this.isLoading.set(false), 800);
      }
  }

  ngAfterViewInit() {
      if (this.scrollContainer) {
          // Initialize observer to update viewport dimensions
          this.resizeObserver = new ResizeObserver(entries => {
              for (const entry of entries) {
                  this.viewportHeight.set(entry.contentRect.height);
                  // Calculate grid columns approximately based on width
                  const width = entry.contentRect.width;
                  if (width >= 1280) this.gridColumns.set(4);      // xl
                  else if (width >= 1024) this.gridColumns.set(3); // lg
                  else if (width >= 768) this.gridColumns.set(2);  // md
                  else this.gridColumns.set(1);
              }
          });
          this.resizeObserver.observe(this.scrollContainer.nativeElement);
      }
  }

  ngOnDestroy() {
      if (this.resizeObserver) this.resizeObserver.disconnect();
  }

  onScroll(event: Event) {
      const target = event.target as HTMLElement;
      this.scrollTop.set(target.scrollTop);
  }

  switchViewMode(mode: 'list' | 'grid') {
      this.viewMode.set(mode);
      this.scrollTop.set(0); // Reset scroll to top
      if(this.scrollContainer) this.scrollContainer.nativeElement.scrollTop = 0;
  }

  // --- Preview Logic (Updated) ---
  openCoaPreview(url: string, event: Event) {
      event.stopPropagation();
      if (!url) return;
      
      this.previewRawUrl.set(url);
      
      // Smart Detection: Check extension (ignoring query params like ?alt=media)
      const cleanUrl = url.split('?')[0].toLowerCase();
      const isImage = /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/.test(cleanUrl);

      if (isImage) {
          this.previewType.set('image');
          this.previewImgUrl.set(url);
      } else {
          this.previewType.set('iframe');
          // Normalize for Embedding (Handle Drive Links)
          const embedUrl = this.normalizeToPreviewUrl(url);
          this.previewUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl));
      }
  }

  closeCoaPreview() {
      this.previewUrl.set(null);
      this.previewImgUrl.set('');
      this.previewRawUrl.set('');
  }

  private normalizeToPreviewUrl(url: string): string {
      if (url.includes('drive.google.com')) {
          let id = '';
          const matchId = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
          const matchOpen = url.match(/id=([a-zA-Z0-9_-]+)/);

          if (matchId && matchId[1]) id = matchId[1];
          else if (matchOpen && matchOpen[1]) id = matchOpen[1];

          if (id) {
              return `https://drive.google.com/file/d/${id}/preview`;
          }
      }
      return url;
  }

  // --- Upload Logic (New) ---
  async uploadCoaFile(event: any) {
      const file = event.target.files[0];
      if (!file) return;

      // Validation
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
          this.toast.show('File quá lớn (Max 10MB)', 'error');
          return;
      }

      this.isUploading.set(true);
      try {
          const url = await this.firebaseService.uploadFile('coa_files', file);
          this.form.patchValue({ certificate_ref: url });
          this.toast.show('Upload thành công!', 'success');
      } catch (e: any) {
          console.error(e);
          this.toast.show('Lỗi Upload: ' + e.message, 'error');
      } finally {
          this.isUploading.set(false);
          event.target.value = ''; // Reset input
      }
  }

  uniqueManufacturers = computed(() => {
      const stds = this.state.standards();
      const manufacturers = stds.map(s => s.manufacturer ? s.manufacturer.trim() : '').filter(m => m.length > 0) as string[];
      return [...new Set(manufacturers)].sort();
  });

  // OMNIBOX SEARCH & FILTER LOGIC
  filteredStandards = computed(() => {
    const rawTerm = this.searchTerm().trim().toLowerCase();
    
    // Default filter if empty (show all)
    let baseList = this.state.standards();
    
    if (!rawTerm) return baseList;

    // 1. Parsing the Search Term into Criteria
    const criteria = {
        general: [] as string[],
        loc: null as string | null,
        cas: null as string | null,
        exp: null as number | null // Days remaining (can be negative for expired)
    };

    // Split by spaces but respect tokens
    const parts = rawTerm.split(/\s+/);
    
    for (const part of parts) {
        if (part.startsWith('loc:')) {
            criteria.loc = part.substring(4);
        } else if (part.startsWith('cas:')) {
            criteria.cas = part.substring(4);
        } else if (part.startsWith('exp:<')) {
            const val = part.substring(5);
            const num = parseInt(val);
            if (!isNaN(num)) criteria.exp = num;
        } else {
            criteria.general.push(part);
        }
    }

    const today = new Date();
    today.setHours(0,0,0,0); // Normalize today

    return baseList.filter(std => {
       // A. Check Specific Token Criteria
       
       // Location (Internal ID)
       if (criteria.loc && !std.internal_id?.toLowerCase().includes(criteria.loc)) return false;

       // CAS Number
       if (criteria.cas && !std.cas_number?.toLowerCase().includes(criteria.cas)) return false;

       // Expiry Logic (Less than X days)
       if (criteria.exp !== null) {
           if (!std.expiry_date) return false; // No expiry date means can't evaluate
           const expDate = new Date(std.expiry_date);
           const diffTime = expDate.getTime() - today.getTime();
           const diffDays = diffTime / (1000 * 3600 * 24);
           
           // exp:<30 means "expires in less than 30 days" (including expired items which are negative)
           if (diffDays > criteria.exp) return false; 
       }

       // B. Check General Search Terms (Must match ALL general terms found)
       if (criteria.general.length > 0) {
           const fullText = (std.name + ' ' + (std.internal_id||'') + ' ' + (std.lot_number||'') + ' ' + (std.cas_number||'') + ' ' + (std.product_code||'')).toLowerCase();
           const matchesAllGeneral = criteria.general.every(term => fullText.includes(term));
           if (!matchesAllGeneral) return false;
       }

       return true;
    });
  });

  // --- VIRTUAL SCROLL COMPUTED ---
  virtualData = computed(() => {
      const items = this.filteredStandards();
      const mode = this.viewMode();
      const scrollTop = this.scrollTop();
      const viewportH = this.viewportHeight();
      
      let itemHeight = this.LIST_ITEM_HEIGHT;
      let cols = 1;

      if (mode === 'grid') {
          itemHeight = this.GRID_ITEM_HEIGHT;
          cols = this.gridColumns();
      }

      // Calculate total rows
      const totalRows = Math.ceil(items.length / cols);
      const totalHeight = totalRows * itemHeight;

      // Determine visible range
      const startRow = Math.floor(scrollTop / itemHeight);
      const visibleRows = Math.ceil(viewportH / itemHeight);
      
      // Buffer rows to smooth scrolling (2 above, 2 below)
      const renderStartRow = Math.max(0, startRow - 2);
      const renderEndRow = Math.min(totalRows, startRow + visibleRows + 2);

      const startIndex = renderStartRow * cols;
      const endIndex = Math.min(items.length, renderEndRow * cols);

      // Padding for top and bottom to simulate full height
      const topPadding = renderStartRow * itemHeight;
      const bottomPadding = (totalRows - renderEndRow) * itemHeight;

      return {
          items: items.slice(startIndex, endIndex),
          topPadding,
          bottomPadding,
          totalHeight
      };
  });

  async handleImport(event: any) {
     const file = event.target.files[0];
     if (file) { await this.stdService.importFromExcel(file); event.target.value = ''; }
  }

  async deleteAll() {
      if (await this.confirmationService.confirm({ message: 'Xóa toàn bộ dữ liệu Chuẩn?', confirmText: 'Xóa Sạch', isDangerous: true })) {
          try { await this.stdService.deleteAllStandards(); this.toast.show('Đã xóa toàn bộ.', 'success'); } 
          catch (e) { this.toast.show('Lỗi xóa dữ liệu', 'error'); }
      }
  }

  async deleteStandard(std: ReferenceStandard) {
      if (await this.confirmationService.confirm({message: 'Xóa chuẩn này?', confirmText: 'Xóa', isDangerous: true})) {
          try { await this.stdService.deleteStandard(std.id); this.toast.show('Đã xóa'); }
          catch (e) { this.toast.show('Lỗi', 'error'); }
      }
  }

  openAddModal() {
      this.isEditing.set(false);
      this.activeModalTab.set('general');
      this.form.reset({ initial_amount: 0, current_amount: 0, unit: 'mg' });
      this.showModal.set(true);
  }

  openEditModal(std: ReferenceStandard) {
      this.isEditing.set(true);
      this.activeModalTab.set('general');
      this.form.patchValue(std as any);
      this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); }

  onNameChange(event: any) {
      if (!this.isEditing()) {
          const name = event.target.value;
          const lot = this.form.get('lot_number')?.value || '';
          this.form.patchValue({ id: generateSlug(name + '_' + (lot || Date.now().toString())) });
      }
  }

  async saveStandard() {
      if (this.form.invalid) return;
      const val = this.form.value;
      if (!val.id) val.id = generateSlug(val.name + '_' + Date.now());
      
      const std: ReferenceStandard = { 
          ...val as any,
          name: val.name?.trim(), manufacturer: val.manufacturer?.trim(), lot_number: val.lot_number?.trim(),
          cas_number: val.cas_number?.trim(), internal_id: val.internal_id?.trim(), product_code: val.product_code?.trim()
      };

      try {
          if (this.isEditing()) await this.stdService.updateStandard(std);
          else await this.stdService.addStandard(std);
          this.toast.show(this.isEditing() ? 'Cập nhật thành công' : 'Tạo mới thành công');
          this.closeModal();
      } catch (e) { this.toast.show('Lỗi lưu dữ liệu', 'error'); }
  }

  async viewHistory(std: ReferenceStandard) { 
      this.historyStd.set(std);
      this.loadingHistory.set(true);
      this.cancelLogEdit(); 
      try { const logs = await this.stdService.getUsageHistory(std.id); this.historyLogs.set(logs); } 
      catch (e) { this.toast.show('Lỗi tải lịch sử', 'error'); } 
      finally { this.loadingHistory.set(false); }
  }

  startEditLog(log: UsageLog) { this.editingLogId.set(log.id || null); this.tempLog = { ...log }; }
  cancelLogEdit() { this.editingLogId.set(null); }

  async saveLogEdit() {
      if (!this.editingLogId() || !this.historyStd()) return;
      try { await this.stdService.updateUsageLog(this.historyStd()!.id, this.editingLogId()!, this.tempLog); this.toast.show('Đã cập nhật', 'success'); this.editingLogId.set(null); await this.viewHistory(this.historyStd()!); } 
      catch (e: any) { this.toast.show('Lỗi: ' + e.message, 'error'); }
  }

  async deleteLog(log: UsageLog) {
      if (!this.historyStd() || !log.id) return;
      if (await this.confirmationService.confirm({ message: `Xóa lịch sử dụng ngày ${log.date}?`, confirmText: 'Xóa & Hoàn kho', isDangerous: true })) {
          try { await this.stdService.deleteUsageLog(this.historyStd()!.id, log.id); this.toast.show('Đã xóa', 'success'); await this.viewHistory(this.historyStd()!); } 
          catch (e: any) { this.toast.show('Lỗi: ' + e.message, 'error'); }
      }
  }

  openWeighModal(std: ReferenceStandard) { 
      this.selectedStd.set(std); this.weighAmount.set(0); this.weighDate.set(new Date().toISOString().split('T')[0]); this.weighUser.set(this.state.currentUser()?.displayName || '');
  }

  async confirmWeigh() {
      const std = this.selectedStd(); const amount = this.weighAmount();
      if (!std || amount <= 0) return;
      if (amount > std.current_amount) { this.toast.show('Lượng cân vượt quá tồn kho!', 'error'); return; }
      try {
          await this.stdService.recordUsage(std.id, { date: this.weighDate(), user: this.weighUser() || 'Unknown', amount_used: amount, purpose: 'Cân mẫu', timestamp: Date.now() });
          this.toast.show('Đã cập nhật!'); this.selectedStd.set(null);
      } catch (e: any) { this.toast.show('Lỗi: ' + e.message, 'error'); }
  }

  getExpiryStatus(dateStr: string | undefined): string {
      if (!dateStr) return 'N/A';
      const exp = new Date(dateStr); const today = new Date();
      if (exp < today) return 'Hết hạn';
      const diffMonths = (exp.getTime() - today.getTime()) / (1000 * 3600 * 24 * 30);
      if (diffMonths < 6) return '< 6 Tháng';
      return 'Còn hạn';
  }
  
  getExpiryClass(dateStr: string | undefined): string {
      if (!dateStr) return 'text-slate-400';
      const exp = new Date(dateStr); const today = new Date();
      if (exp < today) return 'text-red-600 line-through';
      const diffMonths = (exp.getTime() - today.getTime()) / (1000 * 3600 * 24 * 30);
      if (diffMonths < 6) return 'text-orange-500';
      return 'text-emerald-600';
  }

  getExpiryStatusClass(dateStr: string | undefined): string {
      if (!dateStr) return 'border-slate-200 text-slate-400 bg-slate-50';
      const exp = new Date(dateStr); const today = new Date();
      if (exp < today) return 'border-red-200 text-red-600 bg-red-50';
      const diffMonths = (exp.getTime() - today.getTime()) / (1000 * 3600 * 24 * 30);
      if (diffMonths < 6) return 'border-orange-200 text-orange-600 bg-orange-50';
      return 'border-emerald-200 text-emerald-600 bg-emerald-50';
  }

  getStorageIcons(condition: string | undefined): { icon: string, bg: string, border: string, color: string }[] {
      const c = (condition || '').toLowerCase(); const icons: any[] = [];
      if (c.includes('ft') || c.includes('-20') || c.includes('âm')) icons.push({ icon: 'fa-snowflake', bg: 'bg-cyan-50', border: 'border-cyan-100', color: 'text-cyan-500' });
      else if (c.includes('ct') || c.includes('2-8') || c.includes('lạnh')) icons.push({ icon: 'fa-temperature-low', bg: 'bg-blue-50', border: 'border-blue-100', color: 'text-blue-500' });
      else icons.push({ icon: 'fa-temperature-half', bg: 'bg-orange-50', border: 'border-orange-100', color: 'text-orange-500' });
      if (c.includes('d') || c.includes('tối')) icons.push({ icon: 'fa-moon', bg: 'bg-purple-50', border: 'border-purple-100', color: 'text-purple-600' });
      return icons;
  }
}
