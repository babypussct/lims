
import { Component, inject, signal, computed, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StateService } from '../../core/services/state.service';
import { InventoryService } from './inventory.service';
import { InventoryItem } from '../../core/models/inventory.model';
import { Sop } from '../../core/models/sop.model';
import { Recipe } from '../../core/models/recipe.model'; // Import Recipe
import { CalculatorService } from '../../core/services/calculator.service';
import { RecipeService } from '../recipes/recipe.service'; // Import Service
import { cleanName, formatNum, UNIT_OPTIONS, generateSlug, formatSmartUnit, parseQuantityInput } from '../../shared/utils/utils';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { AuthService } from '../../core/services/auth.service';
import { LabelPrintComponent } from '../labels/label-print.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SkeletonComponent, LabelPrintComponent],
  template: `
    <div class="flex flex-col space-y-4 md:space-y-6 fade-in h-full relative">
      
      <!-- Statistics Card Row (Only show for List/Capacity tabs) -->
      @if (activeTab() !== 'labels') {
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 shrink-0 pt-4 px-4 md:pt-0 md:px-0">
              <div class="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4 relative overflow-hidden group border border-slate-200 active:scale-95 transition-all duration-200 h-20 md:h-24">
                  <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
                      <i class="fa-solid fa-boxes-stacked"></i>
                  </div>
                  <div>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0">Tổng Hóa chất</p>
                      @if(totalCount() === null) {
                          <app-skeleton width="60px" height="24px"></app-skeleton>
                      } @else {
                          <h5 class="font-black text-slate-700 text-xl">{{totalCount()}}</h5>
                      }
                  </div>
              </div>
          </div>
      }

      <!-- Main Content Card -->
      <div class="flex-1 bg-transparent md:bg-white rounded-none md:rounded-2xl shadow-none md:shadow-sm flex flex-col overflow-hidden border-0 md:border md:border-slate-200">
        <!-- Header Actions -->
        <div class="p-4 border-b border-slate-100 flex flex-col gap-4 shrink-0 bg-white sticky top-0 z-20 shadow-sm md:shadow-none">
            <!-- Mobile Tab Switcher -->
            <div class="flex p-1 bg-slate-100 rounded-xl">
                <button (click)="switchTab('list')" 
                   class="flex-1 text-xs font-bold uppercase tracking-wider py-2 rounded-lg transition active:scale-95"
                   [class]="activeTab() === 'list' ? 'text-white bg-slate-800 shadow-md' : 'text-slate-500 hover:text-slate-700'">
                   Danh sách
                </button>
                <button (click)="switchTab('capacity')" 
                   class="flex-1 text-xs font-bold uppercase tracking-wider py-2 rounded-lg transition active:scale-95"
                   [class]="activeTab() === 'capacity' ? 'text-white bg-slate-800 shadow-md' : 'text-slate-500 hover:text-slate-700'">
                   Năng lực
                </button>
                <button (click)="switchTab('labels')" 
                   class="flex-1 text-xs font-bold uppercase tracking-wider py-2 rounded-lg transition active:scale-95 flex items-center justify-center gap-1"
                   [class]="activeTab() === 'labels' ? 'text-white bg-slate-800 shadow-md' : 'text-slate-500 hover:text-slate-700'">
                   <i class="fa-solid fa-tag"></i> Tem
                </button>
            </div>
            
            @if(activeTab() === 'list') {
                <div class="flex gap-2">
                    <div class="relative flex-1">
                        <i class="fa-solid fa-search absolute left-3 top-3 text-slate-400 text-xs"></i>
                        <input [ngModel]="searchTerm()" (ngModelChange)="onSearchInput($event)" 
                               placeholder="Tìm kiếm..." 
                               class="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:border-fuchsia-500 outline-none transition w-full shadow-sm bg-slate-50 focus:bg-white font-bold text-slate-700">
                    </div>
                    <div class="w-1/3 md:w-48">
                        <select [ngModel]="filterType()" (ngModelChange)="onFilterChange($event)" class="w-full h-full border border-slate-200 rounded-xl px-2 text-xs outline-none text-slate-600 font-bold focus:border-fuchsia-500 shadow-sm bg-slate-50 focus:bg-white cursor-pointer transition">
                            <option value="all">Tất cả</option>
                            <option value="reagent">Hóa chất</option>
                            <option value="solvent">Dung môi</option>
                            <option value="standard">Chuẩn</option>
                            <option value="consumable">Vật tư</option>
                            <option value="kit">Kit</option>
                            <option value="low">Sắp hết</option>
                        </select>
                    </div>
                    <!-- Desktop Add Button (Hidden on Mobile) -->
                    @if (auth.canEditInventory()) {
                        <button (click)="openModal()" class="hidden md:flex bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase shadow-sm hover:bg-black transition items-center gap-2">
                            <i class="fa-solid fa-plus"></i> Thêm
                        </button>
                    }
                </div>
            }
        </div>

        <!-- LIST CONTENT -->
        @if (activeTab() === 'list') {
            <div class="flex-1 overflow-y-auto px-0 py-0 custom-scrollbar relative bg-slate-50/50">
                
                <!-- MOBILE CARD VIEW -->
                <div class="md:hidden p-4 space-y-3 pb-24">
                    @if(isInitialLoading()) {
                        @for(i of [1,2,3,4]; track i) {
                            <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
                                <div class="flex items-center gap-3">
                                    <app-skeleton width="40px" height="40px" shape="rect"></app-skeleton>
                                    <div class="flex-1 space-y-1">
                                        <app-skeleton width="70%" height="16px"></app-skeleton>
                                        <app-skeleton width="40%" height="12px"></app-skeleton>
                                    </div>
                                </div>
                            </div>
                        }
                    } @else {
                        @for (item of items(); track item.id) {
                            <div (click)="openModal(item)" class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 active:scale-98 transition-transform">
                                <div class="flex justify-between items-start mb-2">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0" [class]="getIconGradient(item)">
                                            <i class="fa-solid" [class]="getIcon(item.category)"></i>
                                        </div>
                                        <div>
                                            <h6 class="font-bold text-slate-800 text-sm leading-tight line-clamp-2">{{item.name}}</h6>
                                            <span class="text-[10px] text-slate-400 font-mono bg-slate-50 px-1.5 rounded border border-slate-100">{{item.id}}</span>
                                        </div>
                                    </div>
                                    @if(item.stock <= (item.threshold || 5)) {
                                        <i class="fa-solid fa-circle-exclamation text-orange-500 animate-pulse"></i>
                                    }
                                </div>
                                
                                <div class="flex items-end justify-between border-t border-slate-50 pt-3 mt-1">
                                    <div>
                                        <div class="text-[10px] font-bold text-slate-400 uppercase">Tồn kho</div>
                                        <div class="text-lg font-black text-slate-700 leading-none" [class.text-red-500]="item.stock <= 0">
                                            {{formatNum(item.stock)}} <span class="text-xs font-bold text-slate-400">{{item.unit}}</span>
                                        </div>
                                    </div>
                                    <div class="flex gap-2">
                                        <span class="text-[10px] font-bold uppercase bg-slate-100 text-slate-500 px-2 py-1 rounded">{{item.category}}</span>
                                    </div>
                                </div>
                            </div>
                        } @empty {
                            <div class="text-center py-10 text-slate-400 italic">Không tìm thấy dữ liệu.</div>
                        }
                        
                        @if (hasMore()) {
                            <button (click)="loadMore()" class="w-full py-3 text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-xl shadow-sm">Xem thêm...</button>
                        }
                    }
                </div>

                <!-- DESKTOP TABLE VIEW -->
                <table class="hidden md:table w-full text-left border-collapse align-middle relative">
                    <thead class="text-slate-500 text-[10px] font-bold uppercase bg-slate-50 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th class="px-4 py-2 pl-6 w-[40%]">Hóa chất / Vật tư</th>
                            <th class="px-4 py-2 border-l border-slate-100">Phân loại</th>
                            <th class="px-4 py-2 text-center border-l border-slate-100 w-20">ĐVT (Gốc)</th>
                            <th class="px-4 py-2 text-right border-l border-slate-100 w-32">Tồn kho (Gauge)</th>
                            @if (auth.canEditInventory()) {
                                <th class="px-4 py-2 text-right border-l border-slate-100 w-32">Nhập nhanh</th>
                            }
                            <th class="px-4 py-2 text-center w-12 border-l border-slate-100"></th>
                        </tr>
                    </thead>
                    <tbody class="text-sm text-slate-600">
                        @for (item of items(); track item.id) {
                            <tr class="bg-white hover:bg-blue-50/50 transition group cursor-pointer border-b border-slate-50" (click)="openModal(item)">
                                <td class="px-4 py-2 pl-6">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0" [class]="getIconGradient(item)">
                                            <i class="fa-solid text-xs" [class]="getIcon(item.category)"></i>
                                        </div>
                                        <div class="flex flex-col min-w-0 flex-1">
                                            <h6 class="mb-0 text-xs font-bold text-slate-700 leading-tight truncate">{{item.name || item.id}}</h6>
                                            <span class="text-[9px] text-slate-400 font-mono">{{item.id}}</span>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-4 py-2 border-l border-slate-50"><span class="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded">{{item.category}}</span></td>
                                <td class="px-4 py-2 text-center border-l border-slate-50"><span class="text-[10px] font-bold text-slate-500">{{item.unit}}</span></td>
                                <td class="px-4 py-2 text-right border-l border-slate-50">
                                    <div class="flex flex-col items-end w-full">
                                        <span class="font-mono font-bold text-sm tracking-tight" [class.text-red-600]="item.stock <= 0" [innerHTML]="formatSmartUnit(item.stock, item.unit)"></span>
                                        @let percent = getStockPercent(item);
                                        <div class="w-full h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                                            <div class="h-full rounded-full" [style.width.%]="percent" [class.bg-emerald-500]="percent > 40" [class.bg-orange-500]="percent <= 40 && percent > 10" [class.bg-red-500]="percent <= 10"></div>
                                        </div>
                                    </div>
                                </td>
                                @if (auth.canEditInventory()) {
                                    <td class="px-4 py-2 text-right border-l border-slate-50" (click)="$event.stopPropagation()">
                                        <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition duration-200">
                                            <input #quickInput type="text" [disabled]="isProcessing()" class="w-20 px-1 py-0.5 text-[10px] border border-slate-200 rounded text-center focus:border-fuchsia-500 outline-none font-bold text-slate-700 font-mono" [placeholder]="'+/- (' + item.unit + ')'" (keyup.enter)="quickUpdate(item, quickInput.value); quickInput.value=''">
                                            <button (click)="quickUpdate(item, quickInput.value); quickInput.value=''" class="w-6 h-6 flex items-center justify-center rounded bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"><i class="fa-solid fa-check text-[10px]"></i></button>
                                        </div>
                                    </td>
                                }
                                <td class="px-4 py-2 text-center border-l border-slate-50"><button (click)="openModal(item)" class="text-blue-600 hover:text-blue-800 transition px-1"><i class="fa-solid fa-pen text-xs"></i></button></td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        }

        <!-- CAPACITY TAB -->
        @if (activeTab() === 'capacity') {
            <div class="flex flex-col md:flex-row h-full overflow-hidden">
                <div class="w-full md:w-72 border-r border-slate-100 overflow-y-auto p-3 bg-slate-50/50 h-1/3 md:h-full shrink-0">
                    <h6 class="text-[10px] font-bold text-slate-400 uppercase pl-1 mb-2 sticky top-0 bg-slate-50/50 backdrop-blur-sm py-1 z-10">Chọn Quy trình</h6>
                    @for (sop of state.sops(); track sop.id) {
                        <div (click)="selectedSopForCap.set(sop)" 
                             class="p-2.5 rounded-lg mb-1.5 cursor-pointer transition flex items-center gap-3 hover:bg-white hover:shadow-sm active:scale-95 border"
                             [class]="selectedSopForCap()?.id === sop.id ? 'bg-white shadow-sm border-fuchsia-200 ring-1 ring-fuchsia-100' : 'border-transparent'">
                            <div>
                                <div class="text-[9px] font-bold text-slate-400 uppercase">{{sop.category}}</div>
                                <div class="text-xs font-bold text-slate-700 leading-tight line-clamp-1">{{sop.name}}</div>
                            </div>
                        </div>
                    }
                </div>
                <div class="flex-1 p-4 md:p-6 overflow-y-auto bg-white h-2/3 md:h-full relative pb-24 md:pb-6">
                    @if(capacityLoading()) {
                        <div class="absolute inset-0 bg-white/80 z-20 flex items-center justify-center flex-col">
                            <i class="fa-solid fa-spinner fa-spin text-2xl text-fuchsia-500 mb-2"></i>
                            <span class="text-xs font-bold text-slate-500">Đang tải dữ liệu kho...</span>
                        </div>
                    }

                    @if(selectedSopForCap(); as sop) {
                        <div class="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                            <div>
                                <h4 class="font-bold text-slate-800 text-lg">{{sop.name}}</h4>
                                <div class="flex gap-2 mt-1">
                                    <button (click)="capacityMode.set('marginal')" class="px-2 py-1 text-[10px] font-bold rounded border transition active:scale-95" [class]="capacityMode() === 'marginal' ? 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' : 'border-slate-200 text-slate-500'">1 Mẫu</button>
                                    <button (click)="capacityMode.set('standard')" class="px-2 py-1 text-[10px] font-bold rounded border transition active:scale-95" [class]="capacityMode() === 'standard' ? 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' : 'border-slate-200 text-slate-500'">Mẻ Chuẩn</button>
                                </div>
                            </div>
                            <div class="text-right bg-slate-50 p-2 rounded-lg border border-slate-100 w-full md:w-auto flex justify-between md:block items-center">
                                <div class="text-[10px] font-bold text-slate-400 uppercase">Năng lực tối đa</div>
                                <div class="text-xl md:text-2xl font-black text-fuchsia-600">{{(capacityResult()?.maxBatches || 0)}} <span class="text-xs text-slate-400 font-normal">mẻ</span></div>
                            </div>
                        </div>
                        
                        @if (capacityResult()?.limitingFactor) {
                           <div class="mb-4 bg-orange-50 border border-orange-100 rounded-lg p-3 flex items-start gap-2">
                              <i class="fa-solid fa-triangle-exclamation text-orange-500 mt-0.5 text-xs"></i>
                              <div>
                                 <div class="text-[10px] font-bold text-orange-800 uppercase">Bottleneck</div>
                                 <p class="text-xs text-orange-700 mt-0.5">Giới hạn bởi <b>{{resolveCapacityName(capacityResult()?.limitingFactor || '')}}</b>.</p>
                              </div>
                           </div>
                        }

                        <div class="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                           <table class="w-full text-xs text-left">
                              <thead class="bg-slate-50 text-[9px] text-slate-500 uppercase font-bold">
                                 <tr>
                                    <th class="px-4 py-2 border-b border-slate-100">Hóa chất</th>
                                    <th class="px-4 py-2 text-right border-b border-slate-100">Tồn kho</th>
                                    <th class="px-4 py-2 text-right border-b border-slate-100">Cần / Mẻ</th>
                                    <th class="px-4 py-2 text-center border-b border-slate-100">Mẻ</th>
                                 </tr>
                              </thead>
                              <tbody class="divide-y divide-slate-50">
                                 @for (row of capacityResult()?.details; track row.name) {
                                    <tr class="hover:bg-slate-50 transition">
                                       <td class="px-4 py-2 font-bold text-slate-700 border-r border-slate-50/50">{{resolveCapacityName(row.name)}}</td>
                                       <td class="px-4 py-2 text-right text-slate-500 font-mono border-r border-slate-50/50">{{formatNum(row.stock)}}</td>
                                       <td class="px-4 py-2 text-right text-slate-500 font-mono border-r border-slate-50/50">{{formatNum(row.need)}}</td>
                                       <td class="px-4 py-2 text-center font-bold font-mono" [class.text-red-500]="row.batches === (capacityResult()?.maxBatches ?? 0)">{{formatNum(row.batches)}}</td>
                                    </tr>
                                 }
                              </tbody>
                           </table>
                        </div>
                    } @else {
                        <div class="h-full flex items-center justify-center text-slate-300 flex-col"><i class="fa-solid fa-chart-pie text-4xl mb-2"></i><span class="text-xs font-bold">Chọn quy trình</span></div>
                    }
                </div>
            </div>
        }

        <!-- LABELS TAB -->
        @if (activeTab() === 'labels') {
            <app-label-print class="h-full block pb-20 md:pb-0"></app-label-print>
        }
      </div>

      <!-- MOBILE FAB (ADD BUTTON) -->
      @if (activeTab() === 'list' && auth.canEditInventory()) {
          <button (click)="openModal()" class="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-slate-900 text-white rounded-full shadow-lg shadow-slate-400 flex items-center justify-center z-30 transition-transform active:scale-90 animate-bounce-in">
              <i class="fa-solid fa-plus text-xl"></i>
          </button>
      }

      <!-- MODAL (Responsive Bottom Sheet) -->
      @defer (when showModal()) {
         @if (showModal()) {
            <div class="fixed inset-0 z-[99] flex items-end md:items-center justify-center bg-black/30 backdrop-blur-sm fade-in" (click)="closeModal()">
                <!-- Dynamic classes for Bottom Sheet on Mobile vs Center Modal on Desktop -->
                <div class="bg-white w-full md:max-w-2xl overflow-hidden flex flex-col animate-slide-up shadow-2xl
                            rounded-t-2xl md:rounded-2xl 
                            h-[85vh] md:h-auto md:max-h-[90vh]" 
                     (click)="$event.stopPropagation()">
                   
                   <div class="p-4 border-b border-slate-100 flex justify-between items-center shrink-0">
                      <div>
                          <h5 class="font-bold text-slate-800 text-base">{{ isEditing() ? 'Cập nhật' : 'Thêm mới' }}</h5>
                          <p class="text-[10px] text-slate-400">Thông tin chi tiết hóa chất</p>
                      </div>
                      <button (click)="closeModal()" class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition active:scale-90"><i class="fa-solid fa-times"></i></button>
                   </div>
                   
                   <div class="flex-1 overflow-y-auto p-5 md:p-6 bg-slate-50 custom-scrollbar">
                       <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
                           <!-- Form Controls -->
                           <div>
                               <label class="text-[10px] font-bold text-slate-500 uppercase ml-1 block mb-1">Tên Hóa chất</label>
                               <input formControlName="name" (input)="onNameChange($event)" class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-fuchsia-500 outline-none transition shadow-sm font-bold text-slate-700 bg-white" placeholder="Nhập tên hóa chất...">
                           </div>
                           
                           <div class="grid grid-cols-2 gap-4">
                               <div>
                                   <label class="text-[10px] font-bold text-slate-500 uppercase ml-1 block mb-1">Mã ID</label>
                                   <input formControlName="id" [readonly]="isEditing()" class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-600 outline-none shadow-sm bg-slate-100 focus:bg-white transition" placeholder="auto-gen">
                               </div>
                               <div>
                                   <label class="text-[10px] font-bold text-slate-500 uppercase ml-1 block mb-1">Phân loại</label>
                                   <!-- Updated Category Dropdown in Modal -->
                                   <select formControlName="category" class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none shadow-sm bg-white cursor-pointer h-[38px]">
                                       <option value="reagent">Hóa chất (General)</option>
                                       <option value="solvent">Dung môi (Solvent)</option>
                                       <option value="standard">Chất chuẩn (Standard)</option>
                                       <option value="consumable">Vật tư (Consumable)</option>
                                       <option value="kit">Kit xét nghiệm</option>
                                   </select>
                               </div>
                           </div>

                           <div class="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                               <div>
                                   <label class="text-[10px] font-bold text-slate-500 uppercase ml-1 block mb-1">Tồn kho</label>
                                   <input type="number" formControlName="stock" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-lg font-bold text-fuchsia-600 outline-none bg-slate-50 focus:bg-white transition text-center">
                               </div>
                               <div>
                                   <label class="text-[10px] font-bold text-slate-500 uppercase ml-1 block mb-1">Đơn vị (Gốc)</label>
                                   <select formControlName="unit" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none bg-slate-50 focus:bg-white transition h-[48px]">
                                       @for (opt of unitOptions; track opt.value) { <option [value]="opt.value">{{opt.label}}</option> }
                                   </select>
                               </div>
                           </div>
                           
                           <div class="grid grid-cols-2 gap-4">
                               <div>
                                   <label class="text-[10px] font-bold text-slate-500 uppercase ml-1 block mb-1">Vị trí</label>
                                   <input formControlName="location" class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none shadow-sm bg-white" placeholder="VD: Tủ A">
                               </div>
                               <div>
                                   <label class="text-[10px] font-bold text-slate-500 uppercase ml-1 block mb-1">Ngưỡng báo động</label>
                                   <input type="number" formControlName="threshold" class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none shadow-sm bg-white font-bold text-orange-500" placeholder="5">
                               </div>
                           </div>
                           
                           <div class="pt-2 border-t border-slate-200">
                               <label class="text-[10px] font-bold text-slate-700 uppercase ml-1 block mb-1">Lý do thay đổi <span class="text-red-500">*</span></label>
                               <input formControlName="reason" class="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none shadow-sm bg-yellow-50 focus:bg-white transition placeholder-slate-400" placeholder="VD: Nhập kho, Kiểm kê, Vỡ hỏng..." required>
                           </div>

                           <div class="pt-4 flex gap-3 pb-safe">
                               @if(isEditing()) {
                                   <button type="button" (click)="deleteItem($any(form.getRawValue()))" [disabled]="isProcessing()" class="flex-1 bg-red-50 text-red-600 py-3.5 rounded-xl font-bold text-xs shadow-sm hover:bg-red-100 transition active:scale-95 disabled:opacity-50">
                                       @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> } @else { Xóa }
                                   </button>
                               }
                               <button type="submit" [disabled]="isProcessing()" class="flex-[3] bg-slate-800 text-white py-3.5 rounded-xl font-bold text-xs shadow-md hover:shadow-lg hover:bg-black transition transform active:scale-95 disabled:opacity-50">
                                   @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> Đang lưu... } 
                                   @else { {{ isEditing() ? 'Lưu Thay Đổi' : 'Tạo Mới' }} }
                               </button>
                           </div>
                       </form>
                   </div>
                </div>
            </div>
         }
      }
    </div>
  `,
  styles: [`
    @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
    .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    .pb-safe { padding-bottom: env(safe-area-inset-bottom, 20px); }
  `]
})
export class InventoryComponent implements OnDestroy {
  state = inject(StateService);
  inventoryService = inject(InventoryService);
  recipeService = inject(RecipeService); // Inject RecipeService
  auth = inject(AuthService); 
  toast = inject(ToastService);
  calcService = inject(CalculatorService);
  confirmationService = inject(ConfirmationService);
  private fb: FormBuilder = inject(FormBuilder);

  // Added 'labels' to type definition
  activeTab = signal<'list' | 'capacity' | 'labels'>('list');
  
  // Data & Pagination
  items = signal<InventoryItem[]>([]);
  lastDoc = signal<QueryDocumentSnapshot | null>(null);
  hasMore = signal(true);
  isInitialLoading = signal(true); 
  isProcessing = signal(false); 
  
  // Decoupled from State
  totalCount = signal<number | null>(null);

  // Filters
  searchTerm = signal('');
  filterType = signal('all');
  searchSubject = new Subject<string>();
  
  selectedIds = signal<Set<string>>(new Set());

  // Capacity - Local Inventory Snapshot
  capacityInventoryMap = signal<Record<string, InventoryItem>>({}); 
  capacityRecipeMap = signal<Record<string, Recipe>>({}); // New Signal for Recipes
  capacityLoading = signal(false);
  selectedSopForCap = signal<Sop | null>(null);
  capacityMode = signal<'marginal' | 'standard'>('marginal');
  
  capacityResult = computed(() => { 
      const s = this.selectedSopForCap(); 
      // Use the locally fetched maps
      return s ? this.calcService.calculateCapacity(
          s, 
          this.capacityMode(), 
          this.capacityInventoryMap(), 
          this.capacityRecipeMap() // Pass Recipe Map
      ) : null; 
  });

  // Modal
  showModal = signal(false);
  isEditing = signal(false);
  form = this.fb.group({
    id: ['', Validators.required], 
    name: ['', Validators.required], 
    category: ['reagent'], 
    stock: [0, [Validators.required, Validators.min(0)]],
    unit: ['ml', Validators.required], 
    threshold: [10], 
    location: [''], 
    supplier: [''], 
    notes: [''],
    reason: ['', Validators.required] 
  });
  
  unitOptions = UNIT_OPTIONS;

  constructor() {
      this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe(term => { this.searchTerm.set(term); this.refreshData(); });
      // Initial Load
      setTimeout(() => {
          this.refreshData();
          this.loadTotalCount();
      }, 100); 
  }
  ngOnDestroy() { this.searchSubject.complete(); }

  // --- TAB SWITCH LOGIC ---
  async switchTab(tab: 'list' | 'capacity' | 'labels') {
      this.activeTab.set(tab);
      if (tab === 'capacity' && Object.keys(this.capacityInventoryMap()).length === 0) {
          // Lazy load full inventory AND recipes for capacity calculation
          this.capacityLoading.set(true);
          try {
              // Fetch Both
              const [allItems, allRecipes] = await Promise.all([
                  this.inventoryService.getAllInventory(),
                  this.recipeService.getAllRecipes()
              ]);

              const invMap: Record<string, InventoryItem> = {};
              allItems.forEach(i => invMap[i.id] = i);
              this.capacityInventoryMap.set(invMap);

              const recMap: Record<string, Recipe> = {};
              allRecipes.forEach(r => recMap[r.id] = r);
              this.capacityRecipeMap.set(recMap);

          } catch(e) {
              console.error("Error loading full inventory for capacity", e);
          } finally {
              this.capacityLoading.set(false);
          }
      }
  }

  // Helpers
  formatNum = formatNum;
  formatSmartUnit = formatSmartUnit; 
  
  // Updated Icon Logic
  getIcon(cat: string | undefined): string { 
      if (!cat) return 'fa-flask';
      const c = cat.toLowerCase();
      if (c === 'solvent') return 'fa-droplet';
      if (c === 'standard') return 'fa-award'; // or fa-star
      if (c === 'reagent') return 'fa-flask';
      if (c === 'consumable') return 'fa-vial';
      if (c === 'kit') return 'fa-box-open';
      return 'fa-cube'; 
  }

  getIconGradient(item: InventoryItem): string {
      if (item.stock <= 0) return 'bg-gradient-to-tl from-red-600 to-rose-400';
      if (this.isLowStock(item)) return 'bg-gradient-to-tl from-orange-500 to-yellow-400';
      
      const c = (item.category || '').toLowerCase();
      if (c === 'solvent') return 'bg-gradient-to-tl from-cyan-600 to-blue-400';
      if (c === 'standard') return 'bg-gradient-to-tl from-amber-500 to-yellow-300';
      
      return 'bg-gradient-to-tl from-purple-700 to-pink-500';
  }

  isLowStock(item: InventoryItem) { return item.stock <= (item.threshold || 5); }
  
  // Stock Percentage for Gauge
  getStockPercent(item: InventoryItem): number {
      const safeLevel = (item.threshold || 5) * 3; // Assume 3x threshold is "Safe/Full"
      const ratio = item.stock / safeLevel;
      return Math.min(ratio * 100, 100);
  }
  
  // Resolve name specifically for capacity tab using local map
  resolveCapacityName(id: string): string {
    const item = this.capacityInventoryMap()[id];
    return item ? (item.name || item.id) : id;
  }

  // Data Loading
  async loadTotalCount() {
      const count = await this.inventoryService.getInventoryCount();
      this.totalCount.set(count);
  }

  async refreshData() {
      this.isInitialLoading.set(true);
      this.items.set([]);
      this.lastDoc.set(null);
      this.hasMore.set(true);
      this.selectedIds.set(new Set());
      await this.loadMore(true);
  }

  async loadMore(isRefresh = false) {
      if (!this.hasMore() && !isRefresh) return;
      this.isInitialLoading.set(true);
      try {
          const page = await this.inventoryService.getInventoryPage(20, this.lastDoc(), this.filterType(), this.searchTerm());
          
          if (isRefresh) this.items.set(page.items);
          else this.items.update(c => [...c, ...page.items]);
          this.lastDoc.set(page.lastDoc);
          this.hasMore.set(page.hasMore);
      } finally { 
          this.isInitialLoading.set(false); 
      }
  }

  onSearchInput(val: string) { this.searchSubject.next(val); }
  onFilterChange(val: string) { this.filterType.set(val); this.refreshData(); }

  // Actions
  toggleSelection(id: string) { this.selectedIds.update(c => { const n = new Set(c); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  
  openModal(item?: InventoryItem) {
    if (!this.auth.canEditInventory()) {
        this.toast.show('Bạn không có quyền sửa kho.', 'error');
        return;
    }
    this.showModal.set(true);
    if(item) { 
        this.isEditing.set(true); 
        this.form.patchValue({ ...item, reason: '' }); 
        this.form.controls.id.disable(); 
    }
    else { 
        this.isEditing.set(false); 
        this.form.reset({ category: 'reagent', stock: 0, unit: 'ml', threshold: 5, reason: 'Tạo mới' }); 
        this.form.controls.id.enable(); 
    }
  }
  closeModal() { 
      if (!this.isProcessing()) {
          this.showModal.set(false); 
      }
  }
  onNameChange(e: any) { if(!this.isEditing()) this.form.patchValue({ id: generateSlug(e.target.value) }); }
  
  // --- HARDENED UX: Save Item ---
  async save() {
      if (this.isProcessing()) return; 
      if (this.form.invalid) {
          this.toast.show('Vui lòng nhập đầy đủ thông tin và Lý do thay đổi!', 'error');
          return;
      }
      this.isProcessing.set(true); 
      try { 
          const raw = this.form.getRawValue();
          const reason = raw.reason || ''; 
          const { reason: _, ...itemData } = raw; 
          await this.inventoryService.upsertItem(itemData as any, !this.isEditing(), reason); 
          this.toast.show(this.isEditing() ? 'Đã cập nhật' : 'Đã thêm mới', 'success');
          this.showModal.set(false); 
          this.refreshData(); 
          if(!this.isEditing()) this.loadTotalCount(); 
      } catch (e: any) {
          if (e.code === 'resource-exhausted') {
             this.toast.show('Lỗi: Hết dung lượng lưu trữ (Quota).', 'error');
          } else {
             this.toast.show('Lỗi lưu kho: ' + (e.message || 'Unknown'), 'error');
          }
      } finally { 
          this.isProcessing.set(false); 
      }
  }
  
  // --- HARDENED UX: Delete Item ---
  async deleteItem(item: InventoryItem) {
      if (this.isProcessing()) return; 
      if(await this.confirmationService.confirm({ message: 'Xóa mục này? Hành động này cần được ghi nhận.', confirmText: 'Xác nhận Xóa', isDangerous: true })) {
          this.isProcessing.set(true); 
          try {
              await this.inventoryService.deleteItem(item.id, 'Xóa thủ công');
              this.toast.show('Đã xóa thành công', 'success');
              this.showModal.set(false);
              this.refreshData();
              this.loadTotalCount();
          } catch (e: any) {
              this.toast.show('Lỗi xóa: ' + e.message, 'error');
          } finally {
              this.isProcessing.set(false); 
          }
      }
  }
  
  // --- HARDENED UX: Quick Update ---
  async quickUpdate(item: InventoryItem, valStr: string) {
    if (this.isProcessing()) return; 
    const val = parseQuantityInput(valStr, item.unit); 
    if (val === null) {
        this.toast.show(`Lỗi: Đơn vị không khớp hoặc định dạng sai. Yêu cầu nhập theo (${item.unit}) hoặc quy đổi tương đương.`, 'error');
        return;
    }
    if (val === 0) return;
    this.isProcessing.set(true); 
    try {
      const reason = val > 0 ? 'Nhập nhanh' : 'Xuất nhanh';
      await this.inventoryService.updateStock(item.id, item.stock, val, reason);
      const msg = val > 0 ? `Đã nhập +${val} ${item.unit}` : `Đã xuất ${val} ${item.unit}`;
      this.toast.show(msg, 'success');
      this.refreshData();
    } catch (e: any) {
      this.toast.show('Lỗi cập nhật kho: ' + e.message, 'error');
    } finally {
      this.isProcessing.set(false); 
    }
  }
}
