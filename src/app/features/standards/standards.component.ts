
import { Component, inject, signal, computed, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StateService } from '../../core/services/state.service';
import { StandardService, StandardsPage } from './standard.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { ReferenceStandard, UsageLog } from '../../core/models/standard.model';
import { formatNum, generateSlug, UNIT_OPTIONS } from '../../shared/utils/utils';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { QueryDocumentSnapshot } from 'firebase/firestore';

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
                    <input type="text" [ngModel]="searchTerm()" (ngModelChange)="onSearchInput($event)" 
                           class="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition shadow-sm"
                           placeholder="Tìm theo tên hóa chất (Hệ thống tự chuyển thành ID)...">
                 </div>

                 <!-- View Mode Toggle -->
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
                 <div class="min-w-[800px] md:min-w-0"> 
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
                                @for (i of [1,2,3,4,5]; track i) {
                                    <tr class="h-24">
                                        <td class="px-6 py-4"><app-skeleton width="180px" height="14px"></app-skeleton></td>
                                        <td class="px-6 py-4 hidden md:table-cell"><app-skeleton width="80px" height="10px"></app-skeleton></td>
                                        <td class="px-6 py-4 hidden lg:table-cell text-center"><app-skeleton shape="circle" width="30px" height="30px" class="mx-auto"></app-skeleton></td>
                                        <td class="px-6 py-4 text-center hidden md:table-cell"><app-skeleton width="80px" height="20px" class="mx-auto"></app-skeleton></td>
                                        <td class="px-6 py-4 text-right"><app-skeleton width="60px" height="20px" class="ml-auto"></app-skeleton></td>
                                        <td class="px-6 py-4 text-center"><app-skeleton width="60px" height="30px" class="mx-auto"></app-skeleton></td>
                                    </tr>
                                }
                           } @else {
                               @for (std of items(); track std.id) {
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
                               @if (items().length === 0) {
                                  <tr><td colspan="6" class="p-16 text-center text-slate-400 italic">Không tìm thấy dữ liệu chuẩn phù hợp.</td></tr>
                               }
                           }
                        </tbody>
                     </table>
                 </div>
             } 
             <!-- ... (GRID VIEW CODE remains same, omitted for brevity but preserved in implementation) ... -->
             @else {
                 <div class="p-4">
                    <!-- Same Grid as before -->
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
                                    <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all duration-200 flex flex-col relative group h-[280px]">
                                        <!-- Card Header -->
                                        <div class="flex justify-between items-start mb-2">
                                            <span class="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border border-indigo-100">
                                                <i class="fa-solid fa-location-dot mr-1"></i> {{std.internal_id || 'NO-LOC'}}
                                            </span>
                                            <div class="flex items-center gap-1">
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

      <!-- ... (COA PREVIEW and ADD MODAL preserved) ... -->
      
      <!-- WEIGH MODAL (Updated with Unit Conversion) -->
      @if (selectedStd()) {
         <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-bounce-in relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-2 bg-indigo-500"></div>
                <h3 class="font-black text-xl text-slate-800 mb-1">Cân chuẩn</h3>
                <p class="text-sm text-slate-500 mb-6">{{selectedStd()?.name}}</p>
                
                <!-- Stock Display -->
                <div class="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 flex justify-between items-center">
                    <span class="text-xs font-bold text-indigo-800 uppercase">Tồn kho hiện tại</span>
                    <span class="font-mono font-black text-xl text-indigo-600">{{formatNum(selectedStd()?.current_amount)}} <small>{{selectedStd()?.unit}}</small></span>
                </div>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Ngày pha chế</label>
                        <input type="date" [(ngModel)]="weighDate" class="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Người pha chế</label>
                        <input type="text" [(ngModel)]="weighUser" class="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500">
                    </div>
                    
                    <!-- Weighing Amount with Unit Selector -->
                    <div class="grid grid-cols-3 gap-2">
                        <div class="col-span-2">
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Lượng cân</label>
                            <input type="number" [(ngModel)]="weighAmount" class="w-full border-2 border-indigo-100 rounded-xl p-3 font-black text-2xl text-indigo-600 outline-none focus:border-indigo-500 text-center" placeholder="0.00" autofocus>
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Đơn vị</label>
                            <select [(ngModel)]="weighUnit" class="w-full h-[54px] border border-slate-200 bg-slate-50 rounded-xl px-2 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500">
                                @for(u of unitOptions; track u.value) {
                                    <option [value]="u.value">{{u.value}}</option>
                                }
                            </select>
                        </div>
                    </div>
                    
                    <!-- Conversion Hint -->
                    @if(weighUnit() !== selectedStd()?.unit) {
                        <div class="text-[10px] text-orange-600 bg-orange-50 p-2 rounded-lg border border-orange-100 flex items-center gap-2">
                            <i class="fa-solid fa-calculator"></i>
                            <span>Hệ thống sẽ tự động quy đổi từ <b>{{weighUnit()}}</b> sang <b>{{selectedStd()?.unit}}</b> khi lưu.</span>
                        </div>
                    }
                </div>
                
                <div class="flex justify-end gap-3 mt-8">
                    <button (click)="selectedStd.set(null)" class="px-5 py-3 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-xl transition">Hủy bỏ</button>
                    <button (click)="confirmWeigh()" [disabled]="weighAmount() <= 0" class="px-8 py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition disabled:opacity-50">Xác nhận</button>
                </div>
            </div>
         </div>
      }
      
      <!-- History Modal (Includes Unit column now) -->
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
                                      <td class="px-6 py-4 text-right">
                                          <span class="font-bold text-red-600 bg-red-50 px-2 py-1 rounded text-xs">
                                              -{{ formatNum(log.amount_used) }} <span class="text-[9px] text-slate-500">{{log.unit || historyStd()?.unit}}</span>
                                          </span>
                                      </td>
                                      @if(state.isAdmin()) { <td class="px-6 py-4 text-center"><div class="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition"><button (click)="startEditLog(log)" class="w-7 h-7 flex items-center justify-center rounded bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition"><i class="fa-solid fa-pen text-[10px]"></i></button><button (click)="deleteLog(log)" class="w-7 h-7 flex items-center justify-center rounded bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"><i class="fa-solid fa-trash text-[10px]"></i></button></div></td> }
                                  } @else {
                                      <td class="px-4 py-2"><input type="date" [(ngModel)]="tempLog.date" class="w-full text-xs border rounded p-1"></td>
                                      <td class="px-4 py-2"><input type="text" [(ngModel)]="tempLog.user" class="w-full text-xs border rounded p-1"></td>
                                      <td class="px-4 py-2 text-right">
                                          <div class="flex gap-1">
                                              <input type="number" [(ngModel)]="tempLog.amount_used" class="w-16 text-xs border rounded p-1 text-right font-bold">
                                              <select [(ngModel)]="tempLog.unit" class="w-14 text-[10px] border rounded">@for(u of unitOptions; track u.value){<option [value]="u.value">{{u.value}}</option>}</select>
                                          </div>
                                      </td>
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
export class StandardsComponent implements OnInit, OnDestroy {
  // ... (Injections same as before)
  state = inject(StateService);
  stdService = inject(StandardService);
  firebaseService = inject(FirebaseService); 
  toast = inject(ToastService);
  confirmationService = inject(ConfirmationService);
  sanitizer: DomSanitizer = inject(DomSanitizer); 
  private fb: FormBuilder = inject(FormBuilder);
  
  isLoading = signal(true);
  isUploading = signal(false);

  viewMode = signal<'list' | 'grid'>('list');
  searchTerm = signal('');
  searchSubject = new Subject<string>();

  items = signal<ReferenceStandard[]>([]);
  lastDoc = signal<QueryDocumentSnapshot | null>(null);
  hasMore = signal(true);

  activeModalTab = signal<'general' | 'stock' | 'origin'>('general');
  unitOptions = UNIT_OPTIONS;

  selectedStd = signal<ReferenceStandard | null>(null);
  weighAmount = signal<number>(0);
  weighUser = signal<string>('');
  weighDate = signal<string>('');
  weighUnit = signal<string>('mg'); // NEW: Signal for selected unit
  
  historyStd = signal<ReferenceStandard | null>(null);
  historyLogs = signal<UsageLog[]>([]);
  loadingHistory = signal(false);
  editingLogId = signal<string | null>(null);
  tempLog: UsageLog = { date: '', user: '', amount_used: 0, unit: 'mg' }; // Added unit
  
  showModal = signal(false);
  isEditing = signal(false);
  
  previewUrl = signal<SafeResourceUrl | null>(null);
  previewImgUrl = signal<string>('');
  previewType = signal<'iframe' | 'image'>('iframe');
  previewRawUrl = signal<string>('');

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

  constructor() {
      // Improved Debounce for Search (Simulating fuzzy search via generateSlug handled in Service)
      this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe(term => {
          // If searching by Name, the service will convert it to a slug-like query
          const slugTerm = generateSlug(term);
          this.searchTerm.set(slugTerm); 
          this.refreshData();
      });
  }

  ngOnInit() {
      this.refreshData();
  }

  ngOnDestroy() { this.searchSubject.complete(); }

  // --- Data Loading ---
  async refreshData() {
      this.isLoading.set(true);
      this.items.set([]);
      this.lastDoc.set(null);
      this.hasMore.set(true);
      await this.loadMore(true);
  }

  async loadMore(isRefresh = false) {
      if (!this.hasMore() && !isRefresh) return;
      if (isRefresh) this.isLoading.set(true);

      try {
          const page = await this.stdService.getStandardsPage(20, this.lastDoc(), this.searchTerm());
          
          if (isRefresh) this.items.set(page.items);
          else this.items.update(c => [...c, ...page.items]);
          
          this.lastDoc.set(page.lastDoc);
          this.hasMore.set(page.hasMore);
      } catch (e) {
          console.error(e);
          this.toast.show('Lỗi tải dữ liệu', 'error');
      } finally {
          this.isLoading.set(false);
      }
  }

  onSearchInput(val: string) { this.searchSubject.next(val); }

  // --- Preview Logic (Same as before) ---
  openCoaPreview(url: string, event: Event) {
      event.stopPropagation();
      if (!url) return;
      this.previewRawUrl.set(url);
      const cleanUrl = url.split('?')[0].toLowerCase();
      const isImage = /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/.test(cleanUrl);
      if (isImage) { this.previewType.set('image'); this.previewImgUrl.set(url); } 
      else { this.previewType.set('iframe'); const embedUrl = this.normalizeToPreviewUrl(url); this.previewUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl)); }
  }
  closeCoaPreview() { this.previewUrl.set(null); this.previewImgUrl.set(''); this.previewRawUrl.set(''); }
  private normalizeToPreviewUrl(url: string): string {
      if (url.includes('drive.google.com')) {
          let id = '';
          const matchId = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
          const matchOpen = url.match(/id=([a-zA-Z0-9_-]+)/);
          if (matchId && matchId[1]) id = matchId[1];
          else if (matchOpen && matchOpen[1]) id = matchOpen[1];
          if (id) return `https://drive.google.com/file/d/${id}/preview`;
      }
      return url;
  }

  // --- Upload Logic (Same as before) ---
  async uploadCoaFile(event: any) {
      const file = event.target.files[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) { this.toast.show('File quá lớn (Max 10MB)', 'error'); return; }
      this.isUploading.set(true);
      try {
          const url = await this.firebaseService.uploadFile('coa_files', file);
          this.form.patchValue({ certificate_ref: url });
          this.toast.show('Upload thành công!', 'success');
      } catch (e: any) { this.toast.show('Lỗi Upload', 'error'); } 
      finally { this.isUploading.set(false); event.target.value = ''; }
  }

  async handleImport(event: any) {
     const file = event.target.files[0];
     if (file) { try { await this.stdService.importFromExcel(file); this.refreshData(); } finally { event.target.value = ''; } }
  }

  async deleteAll() {
      if (await this.confirmationService.confirm({ message: 'Xóa toàn bộ dữ liệu Chuẩn?', confirmText: 'Xóa Sạch', isDangerous: true })) {
          try { await this.stdService.deleteAllStandards(); this.toast.show('Đã xóa toàn bộ.', 'success'); this.refreshData(); } 
          catch (e) { this.toast.show('Lỗi xóa dữ liệu', 'error'); }
      }
  }

  async deleteStandard(std: ReferenceStandard) {
      if (await this.confirmationService.confirm({message: 'Xóa chuẩn này?', confirmText: 'Xóa', isDangerous: true})) {
          try { await this.stdService.deleteStandard(std.id); this.toast.show('Đã xóa'); this.refreshData(); }
          catch (e) { this.toast.show('Lỗi', 'error'); }
      }
  }

  // --- Modal Logic ---
  openAddModal() { this.isEditing.set(false); this.activeModalTab.set('general'); this.form.reset({ initial_amount: 0, current_amount: 0, unit: 'mg' }); this.showModal.set(true); }
  openEditModal(std: ReferenceStandard) { this.isEditing.set(true); this.activeModalTab.set('general'); this.form.patchValue(std as any); this.showModal.set(true); }
  closeModal() { this.showModal.set(false); }
  onNameChange(event: any) { if (!this.isEditing()) { const lot = this.form.get('lot_number')?.value || ''; this.form.patchValue({ id: generateSlug(event.target.value + '_' + (lot || Date.now().toString())) }); } }

  async saveStandard() {
      if (this.form.invalid) return;
      const val = this.form.value;
      if (!val.id) val.id = generateSlug(val.name + '_' + Date.now());
      const std: ReferenceStandard = { ...val as any, name: val.name?.trim(), manufacturer: val.manufacturer?.trim(), lot_number: val.lot_number?.trim(), cas_number: val.cas_number?.trim(), internal_id: val.internal_id?.trim(), product_code: val.product_code?.trim() };
      try {
          if (this.isEditing()) await this.stdService.updateStandard(std);
          else await this.stdService.addStandard(std);
          this.toast.show(this.isEditing() ? 'Cập nhật thành công' : 'Tạo mới thành công'); this.closeModal(); this.refreshData();
      } catch (e) { this.toast.show('Lỗi lưu dữ liệu', 'error'); }
  }

  // --- Logs & Weighing (UPDATED FOR UNIT CONVERSION) ---
  async viewHistory(std: ReferenceStandard) { 
      this.historyStd.set(std); this.loadingHistory.set(true); this.cancelLogEdit(); 
      try { const logs = await this.stdService.getUsageHistory(std.id); this.historyLogs.set(logs); } 
      catch (e) { this.toast.show('Lỗi tải lịch sử', 'error'); } 
      finally { this.loadingHistory.set(false); }
  }

  startEditLog(log: UsageLog) { this.editingLogId.set(log.id || null); this.tempLog = { ...log }; }
  cancelLogEdit() { this.editingLogId.set(null); }

  async saveLogEdit() {
      if (!this.editingLogId() || !this.historyStd()) return;
      try { await this.stdService.updateUsageLog(this.historyStd()!.id, this.editingLogId()!, this.tempLog); this.toast.show('Đã cập nhật', 'success'); this.editingLogId.set(null); await this.viewHistory(this.historyStd()!); this.refreshData(); } 
      catch (e: any) { this.toast.show('Lỗi: ' + e.message, 'error'); }
  }

  async deleteLog(log: UsageLog) {
      if (!this.historyStd() || !log.id) return;
      if (await this.confirmationService.confirm({ message: `Xóa lịch sử dụng ngày ${log.date}?`, confirmText: 'Xóa & Hoàn kho', isDangerous: true })) {
          try { await this.stdService.deleteUsageLog(this.historyStd()!.id, log.id); this.toast.show('Đã xóa', 'success'); await this.viewHistory(this.historyStd()!); this.refreshData(); } 
          catch (e: any) { this.toast.show('Lỗi: ' + e.message, 'error'); }
      }
  }

  openWeighModal(std: ReferenceStandard) { 
      this.selectedStd.set(std); 
      this.weighAmount.set(0); 
      this.weighDate.set(new Date().toISOString().split('T')[0]); 
      this.weighUser.set(this.state.currentUser()?.displayName || '');
      this.weighUnit.set(std.unit); // Default to stock unit
  }

  async confirmWeigh() {
      const std = this.selectedStd(); const amount = this.weighAmount();
      if (!std || amount <= 0) return;
      // Note: We don't check amount > current here because units might differ. Service will check after conversion.
      try {
          await this.stdService.recordUsage(std.id, { 
              date: this.weighDate(), 
              user: this.weighUser() || 'Unknown', 
              amount_used: amount, 
              unit: this.weighUnit(), // Pass the selected unit
              purpose: 'Cân mẫu', 
              timestamp: Date.now() 
          });
          this.toast.show('Đã cập nhật!'); 
          this.selectedStd.set(null);
          this.refreshData(); 
      } catch (e: any) { this.toast.show('Lỗi: ' + e.message, 'error'); }
  }

  // --- Display Helpers ---
  getExpiryStatus(dateStr: string | undefined): string {
      if (!dateStr) return 'N/A';
      const exp = new Date(dateStr); const today = new Date();
      if (exp < today) return 'Hết hạn';
      const diffMonths = (exp.getTime() - today.getTime()) / (1000 * 3600 * 24 * 30);
      if (diffMonths < 6) return '< 6 Tháng';
      return 'Còn hạn';
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
      if (diffMonths < 6) return 'text-orange-600'; 
      return 'text-indigo-600'; 
  }
}
