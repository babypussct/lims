
import { Component, inject, signal, computed, effect, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
import { PubchemService, GHS_DICTIONARY } from '../../core/services/pubchem.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SkeletonComponent, LabelPrintComponent],
  template: `
    <div class="flex flex-col space-y-4 md:space-y-6 fade-in h-full relative">
      
      <!-- Statistics Card Row (Only show for List/Capacity tabs) -->
      @if (activeTab() !== 'labels') {
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 shrink-0 pt-4 px-4 md:pt-0 md:px-0">
              <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none p-4 flex items-center gap-4 relative overflow-hidden group border border-slate-200 dark:border-slate-700 active:scale-95 transition-all duration-200 h-20 md:h-24">
                  <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none group-hover:scale-110 transition-transform">
                      <i class="fa-solid fa-boxes-stacked"></i>
                  </div>
                  <div>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0">Tổng Hóa chất</p>
                      @if(totalCount() === null) {
                          <app-skeleton width="60px" height="24px"></app-skeleton>
                      } @else {
                          <h5 class="font-black text-slate-700 dark:text-slate-100 text-xl">{{totalCount()}}</h5>
                      }
                  </div>
              </div>
          </div>
      }

      <!-- Main Content Card -->
      <div class="flex-1 bg-transparent md:bg-white md:dark:bg-slate-800 rounded-none md:rounded-2xl shadow-none md:shadow-sm dark:shadow-none flex flex-col overflow-hidden border-0 md:border md:border-slate-200 md:dark:border-slate-700">
        <!-- Header Actions -->
        <div class="p-4 border-b border-slate-100 dark:border-slate-700/50 flex flex-col gap-4 shrink-0 bg-white dark:bg-slate-800 sticky top-0 z-20 shadow-sm md:shadow-none dark:shadow-none">
            <!-- Mobile Tab Switcher -->
            <div class="flex p-1 bg-slate-100 dark:bg-slate-900/50 rounded-xl">
                <button (click)="switchTab('list')" 
                   class="flex-1 text-xs font-bold uppercase tracking-wider py-2 rounded-lg transition active:scale-95"
                   [class]="activeTab() === 'list' ? 'text-white bg-slate-800 dark:bg-slate-700 shadow-md dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
                   Danh sách
                </button>
                <button (click)="switchTab('capacity')" 
                   class="flex-1 text-xs font-bold uppercase tracking-wider py-2 rounded-lg transition active:scale-95"
                   [class]="activeTab() === 'capacity' ? 'text-white bg-slate-800 dark:bg-slate-700 shadow-md dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
                   Năng lực
                </button>
                <button (click)="switchTab('labels')" 
                   class="flex-1 text-xs font-bold uppercase tracking-wider py-2 rounded-lg transition active:scale-95 flex items-center justify-center gap-1"
                   [class]="activeTab() === 'labels' ? 'text-white bg-slate-800 dark:bg-slate-700 shadow-md dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
                   <i class="fa-solid fa-tag"></i> Tem
                </button>
            </div>
            
            @if(activeTab() === 'list') {
                <div class="flex gap-2">
                    <div class="relative flex-1">
                        <i class="fa-solid fa-search absolute left-3 top-3 text-slate-400 dark:text-slate-500 text-xs"></i>
                        <input [ngModel]="searchTerm()" (ngModelChange)="onSearchInput($event)" 
                               placeholder="Tìm kiếm..." 
                               class="pl-9 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-xs focus:border-fuchsia-500 dark:focus:border-fuchsia-500 outline-none transition w-full shadow-sm dark:shadow-none bg-slate-50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                    </div>
                    <div class="w-1/3 md:w-48">
                        <select [ngModel]="filterType()" (ngModelChange)="onFilterChange($event)" class="w-full h-full border border-slate-200 dark:border-slate-600 rounded-xl px-2 text-xs outline-none text-slate-600 dark:text-slate-300 font-bold focus:border-fuchsia-500 dark:focus:border-fuchsia-500 shadow-sm dark:shadow-none bg-slate-50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-800 cursor-pointer transition">
                            <option value="all">Tất cả</option>
                            @for(cat of state.categories(); track cat.id) {
                                <option [value]="cat.id">{{cat.name}}</option>
                            }
                            <option value="low">Sắp hết</option>
                        </select>
                    </div>
                    <!-- Desktop Add Button (Hidden on Mobile) -->
                    @if (auth.canEditInventory()) {
                        <button (click)="openModal()" class="hidden md:flex bg-slate-800 dark:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase shadow-sm dark:shadow-none hover:bg-black dark:hover:bg-slate-600 transition items-center gap-2">
                            <i class="fa-solid fa-plus"></i> Thêm
                        </button>
                    }
                </div>
            }
        </div>

        <!-- LIST CONTENT -->
        @if (activeTab() === 'list') {
            <div class="flex-1 overflow-y-auto px-0 py-0 custom-scrollbar relative bg-slate-50/50 dark:bg-slate-900/20">
                
                <!-- MOBILE CARD VIEW -->
                <div class="md:hidden p-4 space-y-3 pb-24">
                    @if(isInitialLoading()) {
                        @for(i of [1,2,3,4]; track i) {
                            <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-700 space-y-3">
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
                            <div (click)="openModal(item)" class="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 active:scale-98 transition-transform">
                                <div class="flex justify-between items-start mb-2">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm dark:shadow-none shrink-0" [class]="getIconGradient(item)">
                                            <i class="fa-solid" [class]="getIcon(item.category)"></i>
                                        </div>
                                        <div>
                                            <h6 class="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight line-clamp-2">{{item.name}}</h6>
                                            <span class="text-[10px] text-slate-400 dark:text-slate-500 font-mono bg-slate-50 dark:bg-slate-900/50 px-1.5 rounded border border-slate-100 dark:border-slate-700/50">{{item.id}}</span>
                                            @if(item.ghsWarnings && item.ghsWarnings.length > 0) {
                                                <div class="flex gap-1 mt-1">
                                                    @for(ghs of item.ghsWarnings; track ghs) {
                                                        @if(GHS_DICT[ghs]) {
                                                            <img [src]="GHS_DICT[ghs].iconUrl" class="w-4 h-4 opacity-70" [title]="GHS_DICT[ghs].label" />
                                                        }
                                                    }
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    @if(item.stock <= (item.threshold || 5)) {
                                        <i class="fa-solid fa-circle-exclamation text-orange-500 dark:text-orange-400 animate-pulse"></i>
                                    }
                                </div>
                                
                                <div class="flex items-end justify-between border-t border-slate-50 dark:border-slate-700/50 pt-3 mt-1">
                                    <div>
                                        <div class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Tồn kho</div>
                                        <div class="text-lg font-black text-slate-700 dark:text-slate-200 leading-none" [class.text-red-500]="item.stock <= 0" [class.dark:text-red-400]="item.stock <= 0">
                                            {{formatNum(item.stock)}} <span class="text-xs font-bold text-slate-400 dark:text-slate-500">{{item.unit}}</span>
                                        </div>
                                    </div>
                                    <div class="flex gap-2">
                                        <span class="text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-1 rounded">{{state.categoriesMap().get(item.category || '') || item.category}}</span>
                                    </div>
                                </div>
                            </div>
                        } @empty {
                            <div class="text-center py-10 text-slate-400 dark:text-slate-500 italic">Không tìm thấy dữ liệu.</div>
                        }
                        
                        @if (hasMore()) {
                            <button (click)="loadMore()" class="w-full py-3 text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm dark:shadow-none">Xem thêm...</button>
                        }
                    }
                </div>

                <!-- DESKTOP TABLE VIEW -->
                <table class="hidden md:table w-full text-left border-collapse align-middle relative">
                    <thead class="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 shadow-sm dark:shadow-none">
                        <tr>
                            <th class="px-4 py-2 pl-6 w-[40%]">Hóa chất / Vật tư</th>
                            <th class="px-4 py-2 border-l border-slate-100 dark:border-slate-700/50">Phân loại</th>
                            <th class="px-4 py-2 text-center border-l border-slate-100 dark:border-slate-700/50 w-20">ĐVT (Gốc)</th>
                            <th class="px-4 py-2 text-right border-l border-slate-100 dark:border-slate-700/50 w-32">Tồn kho (Gauge)</th>
                            @if (auth.canEditInventory()) {
                                <th class="px-4 py-2 text-right border-l border-slate-100 dark:border-slate-700/50 w-32">Nhập nhanh</th>
                            }
                            <th class="px-4 py-2 text-center w-12 border-l border-slate-100 dark:border-slate-700/50"></th>
                        </tr>
                    </thead>
                    <tbody class="text-sm text-slate-600 dark:text-slate-400">
                        @for (item of items(); track item.id) {
                            <tr class="bg-white dark:bg-slate-800 hover:bg-blue-50/50 dark:hover:bg-slate-700/30 transition group cursor-pointer border-b border-slate-50 dark:border-slate-700/50" (click)="openModal(item)">
                                <td class="px-4 py-2 pl-6">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm dark:shadow-none shrink-0" [class]="getIconGradient(item)">
                                            <i class="fa-solid text-xs" [class]="getIcon(item.category)"></i>
                                        </div>
                                        <div class="flex flex-col min-w-0 flex-1">
                                            <h6 class="mb-0 text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight truncate">{{item.name || item.id}}</h6>
                                            <div class="flex items-center gap-2 mt-0.5">
                                                <span class="text-[9px] text-slate-400 dark:text-slate-500 font-mono">{{item.id}}</span>
                                                @if(item.ghsWarnings && item.ghsWarnings.length > 0) {
                                                    <div class="flex gap-0.5 opacity-60">
                                                        @for(ghs of item.ghsWarnings; track ghs) {
                                                            @if(GHS_DICT[ghs]) {
                                                                <img [src]="GHS_DICT[ghs].iconUrl" class="w-[14px] h-[14px]" [title]="GHS_DICT[ghs].label" />
                                                            }
                                                        }
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-4 py-2 border-l border-slate-50 dark:border-slate-700/50"><span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">{{state.categoriesMap().get(item.category || '') || item.category}}</span></td>
                                <td class="px-4 py-2 text-center border-l border-slate-50 dark:border-slate-700/50"><span class="text-[10px] font-bold text-slate-500 dark:text-slate-400">{{item.unit}}</span></td>
                                <td class="px-4 py-2 text-right border-l border-slate-50 dark:border-slate-700/50">
                                    <div class="flex flex-col items-end w-full">
                                        <span class="font-mono font-bold text-sm tracking-tight" [class.text-red-600]="item.stock <= 0" [class.dark:text-red-400]="item.stock <= 0" [innerHTML]="formatSmartUnit(item.stock, item.unit)"></span>
                                        @let percent = getStockPercent(item);
                                        <div class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-1 overflow-hidden">
                                            <div class="h-full rounded-full" [style.width.%]="percent" [class.bg-emerald-500]="percent > 40" [class.bg-orange-500]="percent <= 40 && percent > 10" [class.bg-red-500]="percent <= 10"></div>
                                        </div>
                                    </div>
                                </td>
                                @if (auth.canEditInventory()) {
                                    <td class="px-4 py-2 text-right border-l border-slate-50 dark:border-slate-700/50" (click)="$event.stopPropagation()">
                                        <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition duration-200">
                                            <input #quickInput type="text" [disabled]="isProcessing()" class="w-20 px-1 py-0.5 text-[10px] border border-slate-200 dark:border-slate-600 rounded text-center focus:border-fuchsia-500 dark:focus:border-fuchsia-500 outline-none font-bold text-slate-700 dark:text-slate-300 font-mono bg-white dark:bg-slate-800" [placeholder]="'+/- (' + item.unit + ')'" (keyup.enter)="quickUpdate(item, quickInput.value); quickInput.value=''">
                                            <button (click)="quickUpdate(item, quickInput.value); quickInput.value=''" class="w-6 h-6 flex items-center justify-center rounded bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition shadow-sm dark:shadow-none"><i class="fa-solid fa-check text-[10px]"></i></button>
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
            <div class="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
                <div class="w-full md:w-72 border-r border-slate-100 dark:border-slate-700/50 overflow-y-auto p-3 bg-slate-50/50 dark:bg-slate-900/20 h-1/3 md:h-full shrink-0">
                    <h6 class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase pl-1 mb-2 sticky top-0 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm py-1 z-10">Chọn Quy trình</h6>
                    @for (sop of state.sops(); track sop.id) {
                        <div (click)="selectedSopForCap.set(sop)" 
                             class="p-2.5 rounded-lg mb-1.5 cursor-pointer transition flex items-center gap-3 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm dark:hover:shadow-none active:scale-95 border"
                             [class]="selectedSopForCap()?.id === sop.id ? 'bg-white dark:bg-slate-800 shadow-sm dark:shadow-none border-fuchsia-200 dark:border-fuchsia-500/30 ring-1 ring-fuchsia-100 dark:ring-fuchsia-500/20' : 'border-transparent'">
                            <div>
                                <div class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">{{state.categoriesMap().get(sop.category || '') || sop.category}}</div>
                                <div class="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight line-clamp-1">{{sop.name}}</div>
                            </div>
                        </div>
                    }
                </div>
                <div class="flex-1 p-4 md:p-6 overflow-y-auto bg-white dark:bg-slate-800 h-2/3 md:h-full relative pb-24 md:pb-6">
                    @if(capacityLoading()) {
                        <div class="absolute inset-0 bg-white/80 dark:bg-slate-800/80 z-20 flex items-center justify-center flex-col">
                            <i class="fa-solid fa-spinner fa-spin text-2xl text-fuchsia-500 dark:text-fuchsia-400 mb-2"></i>
                            <span class="text-xs font-bold text-slate-500 dark:text-slate-400">Đang tải dữ liệu kho...</span>
                        </div>
                    }

                    @if(selectedSopForCap(); as sop) {
                        <div class="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                            <div>
                                <h4 class="font-bold text-slate-800 dark:text-slate-100 text-lg">{{sop.name}}</h4>
                                <div class="flex gap-2 mt-1">
                                    <button (click)="capacityMode.set('marginal')" class="px-2 py-1 text-[10px] font-bold rounded border transition active:scale-95" [class]="capacityMode() === 'marginal' ? 'bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-800/50' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'">1 Mẫu</button>
                                    <button (click)="capacityMode.set('standard')" class="px-2 py-1 text-[10px] font-bold rounded border transition active:scale-95" [class]="capacityMode() === 'standard' ? 'bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-800/50' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'">Mẻ Chuẩn</button>
                                </div>
                            </div>
                            <div class="text-right bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700/50 w-full md:w-auto flex justify-between md:block items-center">
                                <div class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Năng lực tối đa</div>
                                <div class="text-xl md:text-2xl font-black text-fuchsia-600 dark:text-fuchsia-400">{{(capacityResult()?.maxBatches || 0)}} <span class="text-xs text-slate-400 dark:text-slate-500 font-normal">mẻ</span></div>
                            </div>
                        </div>
                        
                        @if (capacityResult()?.limitingFactor) {
                           <div class="mb-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-lg p-3 flex items-start gap-2">
                              <i class="fa-solid fa-triangle-exclamation text-orange-500 dark:text-orange-400 mt-0.5 text-xs"></i>
                              <div>
                                 <div class="text-[10px] font-bold text-orange-800 dark:text-orange-500 uppercase">Bottleneck</div>
                                 <p class="text-xs text-orange-700 dark:text-orange-400 mt-0.5">Giới hạn bởi <b class="dark:text-orange-300">{{resolveCapacityName(capacityResult()?.limitingFactor || '')}}</b>.</p>
                              </div>
                           </div>
                        }

                        <div class="border border-slate-100 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm dark:shadow-none">
                           <table class="w-full text-xs text-left">
                              <thead class="bg-slate-50 dark:bg-slate-900/50 text-[9px] text-slate-500 dark:text-slate-400 uppercase font-bold">
                                 <tr>
                                    <th class="px-4 py-2 border-b border-slate-100 dark:border-slate-700/50">Hóa chất</th>
                                    <th class="px-4 py-2 text-right border-b border-slate-100 dark:border-slate-700/50">Tồn kho</th>
                                    <th class="px-4 py-2 text-right border-b border-slate-100 dark:border-slate-700/50">Cần / Mẻ</th>
                                    <th class="px-4 py-2 text-center border-b border-slate-100 dark:border-slate-700/50">Mẻ</th>
                                 </tr>
                              </thead>
                              <tbody class="divide-y divide-slate-50 dark:divide-slate-700/50">
                                 @for (row of capacityResult()?.details; track row.name) {
                                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                                       <td class="px-4 py-2 font-bold text-slate-700 dark:text-slate-300 border-r border-slate-50/50 dark:border-slate-700/30">{{resolveCapacityName(row.name)}}</td>
                                       <td class="px-4 py-2 text-right text-slate-500 dark:text-slate-400 font-mono border-r border-slate-50/50 dark:border-slate-700/30">{{formatNum(row.stock)}}</td>
                                       <td class="px-4 py-2 text-right text-slate-500 dark:text-slate-400 font-mono border-r border-slate-50/50 dark:border-slate-700/30">{{formatNum(row.need)}}</td>
                                       <td class="px-4 py-2 text-center font-bold font-mono dark:text-slate-300" [class.text-red-500]="row.batches === (capacityResult()?.maxBatches ?? 0)" [class.dark:text-red-400]="row.batches === (capacityResult()?.maxBatches ?? 0)">{{formatNum(row.batches)}}</td>
                                    </tr>
                                 }
                              </tbody>
                           </table>
                        </div>
                    } @else {
                        <div class="h-full flex items-center justify-center text-slate-300 dark:text-slate-600 flex-col"><i class="fa-solid fa-chart-pie text-4xl mb-2"></i><span class="text-xs font-bold">Chọn quy trình</span></div>
                    }
                </div>
            </div>
        }

        <!-- LABELS TAB -->
        @if (activeTab() === 'labels') {
            <div class="flex-1 min-h-0 w-full relative">
                <app-label-print class="absolute inset-0 block"></app-label-print>
            </div>
        }
      </div>

      <!-- MOBILE FAB (ADD BUTTON) -->
      @if (activeTab() === 'list' && auth.canEditInventory()) {
          <button (click)="openModal()" class="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-slate-900 dark:bg-slate-700 text-white rounded-full shadow-lg shadow-slate-400 dark:shadow-none flex items-center justify-center z-30 transition-transform active:scale-90 animate-bounce-in">
              <i class="fa-solid fa-plus text-xl"></i>
          </button>
      }

      <!-- MODAL (Responsive Bottom Sheet) -->
      @defer (when showModal()) {
         @if (showModal()) {
            <div class="fixed inset-0 z-[99] flex items-end md:items-center justify-center bg-black/30 dark:bg-black/50 backdrop-blur-sm fade-in" (click)="closeModal()">
                <!-- Dynamic classes for Bottom Sheet on Mobile vs Center Modal on Desktop -->
                <div class="bg-white dark:bg-slate-800 w-full md:max-w-2xl overflow-hidden flex flex-col animate-slide-up shadow-2xl dark:shadow-none
                            rounded-t-2xl md:rounded-2xl 
                            h-[85vh] md:h-auto md:max-h-[90vh]" 
                     (click)="$event.stopPropagation()">
                   
                   <div class="p-4 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center shrink-0">
                      <div>
                          <h5 class="font-bold text-slate-800 dark:text-slate-100 text-base">{{ isEditing() ? 'Cập nhật' : 'Thêm mới' }}</h5>
                          <p class="text-[10px] text-slate-400 dark:text-slate-500">Thông tin chi tiết hóa chất</p>
                      </div>
                      <button (click)="closeModal()" class="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300 hover:text-slate-600 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-600 transition active:scale-90"><i class="fa-solid fa-times"></i></button>
                   </div>
                   
                   <div class="flex-1 overflow-y-auto p-5 md:p-6 bg-slate-50 dark:bg-slate-900/50 custom-scrollbar">
                       <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
                           <!-- Form Controls -->
                           <div>
                               <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 block mb-1">Tên Hóa chất</label>
                               <input formControlName="name" (input)="onNameChange($event)" class="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm focus:border-fuchsia-500 dark:focus:border-fuchsia-500 outline-none transition shadow-sm dark:shadow-none font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800" placeholder="Nhập tên hóa chất...">
                           </div>
                           
                           <div class="grid grid-cols-2 gap-4">
                               <div>
                                   <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 block mb-1">Mã ID</label>
                                   <input formControlName="id" [readonly]="isEditing()" class="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-600 dark:text-slate-400 outline-none shadow-sm dark:shadow-none bg-slate-100 dark:bg-slate-700/50 focus:bg-white dark:focus:bg-slate-800 transition" placeholder="auto-gen">
                               </div>
                               <div>
                                   <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 block mb-1">Phân loại</label>
                                   <!-- Updated Category Dropdown in Modal -->
                                   <select formControlName="category" class="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-xs outline-none shadow-sm dark:shadow-none bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer h-[38px]">
                                       <option value="" disabled>Chọn phân loại</option>
                                       @for(cat of state.categories(); track cat.id) {
                                           <option [value]="cat.id">{{cat.name}} ({{cat.id}})</option>
                                       }
                                   </select>
                               </div>
                           </div>

                           <!-- English Name & CAS -->
                           <div class="grid grid-cols-2 gap-4">
                               <div>
                                   <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 block mb-1">Tên Tiếng Anh</label>
                                   <input formControlName="englishName" class="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-xs outline-none bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm dark:shadow-none" placeholder="VD: Methanol">
                               </div>
                               <div>
                                   <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 block mb-1">Mã CAS Number</label>
                                   <input formControlName="casNumber" class="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-xs outline-none bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm dark:shadow-none" placeholder="VD: 67-56-1">
                               </div>
                           </div>
                           
                           <!-- GHS PubChem Auto-fetch -->
                           <div class="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-xl border border-yellow-200 dark:border-yellow-800/30 space-y-3">
                               <div class="flex justify-between items-center">
                                   <label class="text-[10px] font-bold text-yellow-800 dark:text-yellow-500 uppercase flex items-center gap-2">
                                       <i class="fa-solid fa-shield-virus"></i> Cảnh báo Hóa học
                                   </label>
                                   <button type="button" (click)="fetchPubChem()" [disabled]="isFetchingGhs()" class="text-[10px] bg-yellow-400 dark:bg-yellow-600/50 hover:bg-yellow-500 text-yellow-900 dark:text-yellow-100 px-3 py-1.5 rounded-lg border border-yellow-500 dark:border-none font-bold transition flex items-center gap-1 active:scale-95 disabled:opacity-50">
                                       @if(isFetchingGhs()) { <i class="fa-solid fa-spinner fa-spin"></i> Tra cứu... } 
                                       @else { <i class="fa-solid fa-bolt text-red-600 dark:text-red-400"></i> Auto GHS }
                                   </button>
                               </div>
                               
                               <div class="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                   @for(code of ghsKeys; track code) {
                                       <div (click)="toggleGhs(code)" 
                                            class="cursor-pointer border rounded-lg p-1.5 flex flex-col items-center text-center transition active:scale-95 bg-white dark:bg-slate-800 opacity-60 hover:opacity-100"
                                            [class]="form.get('ghsWarnings')?.value?.includes(code) ? '!border-red-500 ring-1 ring-red-200 dark:ring-red-900/50 !opacity-100 shadow-sm bg-red-50 dark:bg-red-900/20' : 'border-slate-200 dark:border-slate-700'">
                                           <img [src]="GHS_DICT[code]?.iconUrl" class="w-8 h-8 sm:w-10 sm:h-10 mb-1" [alt]="code" />
                                           <span class="text-[8px] font-bold text-slate-600 dark:text-slate-400 leading-tight w-full truncate" [title]="GHS_DICT[code]?.label">{{GHS_DICT[code]?.label}}</span>
                                       </div>
                                   }
                               </div>
                           </div>

                           <div class="grid grid-cols-2 gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm dark:shadow-none">
                               <div>
                                   <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 block mb-1">Tồn kho</label>
                                   <input type="number" formControlName="stock" class="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-lg font-bold text-fuchsia-600 dark:text-fuchsia-400 outline-none bg-slate-50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-800 transition text-center">
                               </div>
                               <div>
                                   <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 block mb-1">Đơn vị (Gốc)</label>
                                   <select formControlName="unit" class="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-xs outline-none bg-slate-50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-800 text-slate-700 dark:text-slate-200 transition h-[48px]">
                                       @for (opt of unitOptions; track opt.value) { <option [value]="opt.value">{{opt.label}}</option> }
                                   </select>
                               </div>
                           </div>
                           
                           <div class="grid grid-cols-2 gap-4">
                               <div>
                                   <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 block mb-1">Vị trí</label>
                                   <input formControlName="location" class="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-xs outline-none shadow-sm dark:shadow-none bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200" placeholder="VD: Tủ A">
                               </div>
                               <div>
                                   <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 block mb-1">Ngưỡng báo động</label>
                                   <input type="number" formControlName="threshold" class="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-xs outline-none shadow-sm dark:shadow-none bg-white dark:bg-slate-800 font-bold text-orange-500 dark:text-orange-400" placeholder="5">
                               </div>
                           </div>
                           
                           <!-- GS1 Data Fields -->
                           <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
                               <div>
                                   <label class="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase ml-1 block mb-1">GTIN (Mã SP)</label>
                                   <input formControlName="gtin" class="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-xs outline-none shadow-sm dark:shadow-none bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200" placeholder="VD: 04059081234567">
                               </div>
                               <div>
                                   <label class="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase ml-1 block mb-1">Số Lô (Lot/Batch)</label>
                                   <input formControlName="lotNumber" class="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-xs outline-none shadow-sm dark:shadow-none bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200" placeholder="VD: A12345678">
                               </div>
                               <div>
                                   <label class="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase ml-1 block mb-1">Hạn sử dụng</label>
                                   <input type="date" formControlName="expiryDate" class="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-xs outline-none shadow-sm dark:shadow-none bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                               </div>
                           </div>
                           
                           <div class="pt-2 border-t border-slate-200 dark:border-slate-700/50">
                               <label class="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase ml-1 block mb-1">Lý do thay đổi <span class="text-red-500 dark:text-red-400">*</span></label>
                               <input formControlName="reason" class="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-xs outline-none shadow-sm dark:shadow-none bg-yellow-50 dark:bg-yellow-900/20 focus:bg-white dark:focus:bg-slate-800 text-slate-700 dark:text-slate-200 transition placeholder-slate-400 dark:placeholder-slate-500" placeholder="VD: Nhập kho, Kiểm kê, Vỡ hỏng..." required>
                           </div>

                           <div class="pt-4 flex gap-3 pb-safe">
                               @if(isEditing()) {
                                   <button type="button" (click)="deleteItem($any(form.getRawValue()))" [disabled]="isProcessing()" class="flex-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-3.5 rounded-xl font-bold text-xs shadow-sm dark:shadow-none hover:bg-red-100 dark:hover:bg-red-900/40 transition active:scale-95 disabled:opacity-50">
                                       @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> } @else { Xóa }
                                   </button>
                               }
                               <button type="submit" [disabled]="isProcessing()" class="flex-[3] bg-slate-800 dark:bg-slate-700 text-white py-3.5 rounded-xl font-bold text-xs shadow-md dark:shadow-none hover:shadow-lg hover:bg-black dark:hover:bg-slate-600 transition transform active:scale-95 disabled:opacity-50">
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
export class InventoryComponent implements OnInit, OnDestroy {
  state = inject(StateService);
  inventoryService = inject(InventoryService);
  recipeService = inject(RecipeService); // Inject RecipeService
  auth = inject(AuthService); 
  pubchem = inject(PubchemService);
  toast = inject(ToastService);
  calcService = inject(CalculatorService);
  confirmationService = inject(ConfirmationService);
  route = inject(ActivatedRoute);
  private fb: FormBuilder = inject(FormBuilder);

  // Added 'labels' to type definition
  activeTab = signal<'list' | 'capacity' | 'labels'>('list');
  
  // Data & Pagination (Client-side filtering for instant UX)
  allItems = this.state.inventory; 
  displayLimit = signal(20);
  isInitialLoading = computed(() => this.allItems().length === 0); 
  isProcessing = signal(false); 

  filteredItems = computed(() => {
      let items = this.allItems();
      const term = this.searchTerm().toLowerCase().trim();
      const filter = this.filterType();

      // 1. Lọc theo Phân loại
      if (filter !== 'all') {
          if (filter === 'low') {
              items = items.filter(i => i.stock <= (i.threshold || 5));
          } else {
              items = items.filter(i => i.category === filter);
          }
      }

      // 2. Lọc theo Từ khóa (Tìm trên cả Tên và ID, bỏ qua dấu tiếng Việt)
      if (term) {
          const removeAccents = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          const normalizedTerm = removeAccents(term);
          
          items = items.filter(i => {
              const nameMatch = i.name ? removeAccents(i.name.toLowerCase()).includes(normalizedTerm) : false;
              const idMatch = i.id ? removeAccents(i.id.toLowerCase()).includes(normalizedTerm) : false;
              return nameMatch || idMatch;
          });
      }

      // 3. Sắp xếp mới nhất lên đầu
      return items.sort((a, b) => {
          const timeA = a.lastUpdated?.seconds || 0;
          const timeB = b.lastUpdated?.seconds || 0;
          return timeB - timeA;
      });
  });

  items = computed(() => this.filteredItems().slice(0, this.displayLimit()));
  hasMore = computed(() => this.displayLimit() < this.filteredItems().length);
  totalCount = computed(() => this.allItems().length);

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
  oldStock = signal(0); // Theo dõi tồn kho cũ để ghi log
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
    reason: ['', Validators.required],
    gtin: [''],
    lotNumber: [''],
    expiryDate: [''],
    casNumber: [''],
    englishName: [''],
    ghsWarnings: [[] as string[]]
  });
  
  unitOptions = UNIT_OPTIONS;
  isFetchingGhs = signal(false);
  get GHS_DICT() { return GHS_DICTIONARY; }
  get ghsKeys() { return Object.keys(GHS_DICTIONARY); }

  constructor() {
      this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(term => { 
          this.searchTerm.set(term); 
          this.displayLimit.set(20); // Reset trang khi tìm kiếm
      });
  }

  ngOnInit() {
      // Check query params for GS1 auto-fill
      this.route.queryParams.subscribe(params => {
          if (params['action'] === 'scan_gs1') {
              this.handleGs1Scan(params);
          } else if (params['search']) {
              this.searchTerm.set(params['search']);
          }
      });
  }

  ngOnDestroy() { this.searchSubject.complete(); }

  // --- GS1 Auto-fill Logic ---
  handleGs1Scan(params: any) {
      const gtin = params['gtin'];
      const lot = params['lot'];
      const exp = params['exp'];
      
      // Try to find existing item by GTIN
      let existingItem = null;
      if (gtin) {
          existingItem = this.allItems().find(i => i.gtin === gtin || i.ref_code === gtin);
      }
      
      if (existingItem) {
          // Found item, open edit modal
          this.openModal(existingItem);
          this.toast.show(`Tìm thấy hóa chất: ${existingItem.name}`, 'success');
      } else {
          // Not found, open create modal
          this.openModal();
          this.toast.show('Hóa chất mới, vui lòng nhập thông tin', 'info');
      }
      
      // Auto-fill form fields
      this.form.patchValue({
          gtin: gtin || '',
          lotNumber: lot || '',
          expiryDate: exp || '',
          reason: 'Nhập kho (Scan QR)'
      });
  }

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
  async refreshData() {
      // No-op: Data is automatically synchronized via StateService reactive cache.
      this.displayLimit.set(20);
      this.selectedIds.set(new Set());
  }

  loadMore() {
      this.displayLimit.update(l => l + 20);
  }

  onSearchInput(val: string) { this.searchSubject.next(val); }
  onFilterChange(val: string) { 
      this.filterType.set(val); 
      this.displayLimit.set(20); // Reset trang khi đổi bộ lọc
  }

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
        this.oldStock.set(item.stock);
        this.form.patchValue({ ...item, reason: '' }); 
        this.form.controls.id.disable(); 
    }
    else { 
        this.isEditing.set(false); 
        this.oldStock.set(0);
        this.form.reset({ category: 'reagent', stock: 0, unit: 'ml', threshold: 5, reason: 'Tạo mới', ghsWarnings: [] }); 
        this.form.controls.id.enable(); 
    }
  }
  closeModal() { 
      if (!this.isProcessing()) {
          this.showModal.set(false); 
      }
  }
  onNameChange(e: any) { if(!this.isEditing()) this.form.patchValue({ id: generateSlug(e.target.value) }); }
  
  // --- Pubchem Integration ---
  async fetchPubChem() {
      const cas = this.form.get('casNumber')?.value;
      const engName = this.form.get('englishName')?.value;
      const query = cas || engName;
      
      if (!query) {
          this.toast.show('Vui lòng nhập Tên Tiếng Anh hoặc mã CAS để tự động bắt GHS.', 'error');
          return;
      }
      
      this.isFetchingGhs.set(true);
      try {
          const warnings = await this.pubchem.fetchGHS(query);
          if (warnings.length > 0) {
              this.form.patchValue({ ghsWarnings: warnings });
              this.toast.show(`Thành công! Tìm thấy ${warnings.length} thẻ phân loại GHS từ PubChem.`, 'success');
          } else {
              this.toast.show('PubChem không có thẻ GHS cho hóa chất này.', 'info');
          }
      } catch (e) {
          this.toast.show('Lỗi kết nối PubChem.', 'error');
      } finally {
          this.isFetchingGhs.set(false);
      }
  }

  toggleGhs(code: string) {
      const current = this.form.get('ghsWarnings')?.value as string[] || [];
      if (current.includes(code)) {
          this.form.patchValue({ ghsWarnings: current.filter(c => c !== code) });
      } else {
          this.form.patchValue({ ghsWarnings: [...current, code] });
      }
  }
  
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
          await this.inventoryService.upsertItem(itemData as any, !this.isEditing(), reason, this.oldStock()); 
          this.toast.show(this.isEditing() ? 'Đã cập nhật' : 'Đã thêm mới', 'success');
          this.showModal.set(false); 
          this.refreshData(); 
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
