
import { Component, inject, signal, computed, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StateService } from '../../core/services/state.service';
import { InventoryService } from './inventory.service';
import { InventoryItem } from '../../core/models/inventory.model';
import { Sop } from '../../core/models/sop.model';
import { CalculatorService } from '../../core/services/calculator.service';
import { cleanName, formatNum, UNIT_OPTIONS, generateSlug } from '../../shared/utils/utils';
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
    <div class="flex flex-col space-y-4 md:space-y-6 fade-in h-full">
      
      <!-- Statistics Card Row (Only show for List/Capacity tabs) -->
      @if (activeTab() !== 'labels') {
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 shrink-0">
              <div class="bg-white rounded-2xl shadow-soft-xl p-4 flex items-center gap-4 relative overflow-hidden group border border-gray-100 active:scale-95 transition-all duration-200">
                  <div class="w-12 h-12 rounded-xl bg-gradient-soft flex items-center justify-center text-white shadow-soft-md group-hover:scale-110 transition-transform">
                      <i class="fa-solid fa-boxes-stacked"></i>
                  </div>
                  <div>
                      <p class="text-sm font-bold text-gray-400 mb-0">Tổng Hóa chất</p>
                      @if(totalCount() === null) {
                          <app-skeleton width="60px" height="24px"></app-skeleton>
                      } @else {
                          <h5 class="font-bold text-gray-700 text-xl">{{totalCount()}}</h5>
                      }
                  </div>
              </div>
          </div>
      }

      <!-- Main Content Card -->
      <div class="flex-1 bg-white rounded-2xl shadow-soft-xl flex flex-col overflow-hidden border border-gray-100">
        <!-- Header Actions -->
        <div class="p-4 md:p-5 pb-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 bg-white z-20">
            <div>
                <h6 class="font-bold text-gray-800 mb-1 flex items-center gap-2">
                    <i class="fa-solid fa-layer-group text-slate-400"></i>
                    Quản lý Kho
                    <span class="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full border border-gray-200 hidden md:inline-block">Module</span>
                </h6>
                <div class="flex gap-2">
                    <button (click)="switchTab('list')" 
                       class="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition active:scale-95"
                       [class]="activeTab() === 'list' ? 'text-fuchsia-600 bg-fuchsia-50 ring-1 ring-fuchsia-100' : 'text-gray-400 hover:text-gray-600 bg-gray-50'">
                       Danh sách
                    </button>
                    <button (click)="switchTab('capacity')" 
                       class="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition active:scale-95"
                       [class]="activeTab() === 'capacity' ? 'text-fuchsia-600 bg-fuchsia-50 ring-1 ring-fuchsia-100' : 'text-gray-400 hover:text-gray-600 bg-gray-50'">
                       Phân tích Năng lực
                    </button>
                    <!-- NEW TAB: Labels -->
                    <button (click)="switchTab('labels')" 
                       class="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition active:scale-95 flex items-center gap-1"
                       [class]="activeTab() === 'labels' ? 'text-fuchsia-600 bg-fuchsia-50 ring-1 ring-fuchsia-100' : 'text-gray-400 hover:text-gray-600 bg-gray-50'">
                       <i class="fa-solid fa-tag"></i> In Tem Nhãn
                    </button>
                </div>
            </div>
            
            @if(activeTab() === 'list') {
                <div class="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    <div class="relative flex-1 md:flex-none">
                        <i class="fa-solid fa-search absolute left-3 top-2.5 text-gray-400 text-xs"></i>
                        <input [ngModel]="searchTerm()" (ngModelChange)="onSearchInput($event)" 
                               placeholder="Tìm kiếm..." 
                               class="pl-8 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-fuchsia-500 outline-none transition w-full md:w-64 shadow-sm bg-gray-50 focus:bg-white">
                    </div>
                    <div class="flex gap-2">
                        <select [ngModel]="filterType()" (ngModelChange)="onFilterChange($event)" class="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none text-gray-600 font-bold focus:border-fuchsia-500 shadow-sm bg-gray-50 focus:bg-white cursor-pointer transition">
                            <option value="all">Tất cả</option>
                            <option value="reagent">Hóa chất</option>
                            <option value="consumable">Vật tư</option>
                            <option value="kit">Kit</option>
                            <option value="low">Sắp hết</option>
                        </select>
                        @if (auth.canEditInventory()) {
                            <button (click)="openModal()" class="bg-gradient-soft text-white w-10 md:w-auto md:px-4 py-2 rounded-xl text-xs font-bold uppercase shadow-soft-md hover:shadow-soft-xl transition transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center">
                                <i class="fa-solid fa-plus md:mr-2"></i> <span class="hidden md:inline">Thêm</span>
                            </button>
                        }
                    </div>
                </div>
            }
        </div>

        <!-- LIST TABLE (HYBRID RESPONSIVE) -->
        @if (activeTab() === 'list') {
            <div class="flex-1 overflow-y-auto px-0 py-0 custom-scrollbar relative bg-gray-50/50">
                <table class="w-full text-left border-collapse align-middle relative">
                    <!-- Header: Hidden on Mobile, Sticky on Desktop -->
                    <thead class="hidden md:table-header-group text-gray-500 text-[11px] font-bold uppercase bg-gray-50 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th class="px-4 py-3 pl-6 w-[40%]">Hóa chất / Vật tư</th>
                            <th class="px-4 py-3 border-l border-gray-200">Phân loại</th>
                            <th class="px-4 py-3 text-center border-l border-gray-200 w-24">ĐVT</th>
                            <th class="px-4 py-3 text-center border-l border-gray-200">Trạng thái</th>
                            <th class="px-4 py-3 text-right border-l border-gray-200">Tồn kho</th>
                            @if (auth.canEditInventory()) {
                                <th class="px-4 py-3 text-right border-l border-gray-200 w-32">Cập nhật nhanh</th>
                            }
                            <th class="px-4 py-3 text-center w-16 border-l border-gray-200"></th>
                        </tr>
                    </thead>
                    
                    <tbody class="text-sm text-gray-600 divide-y divide-gray-100 md:divide-none bg-transparent">
                        @if(isLoading()) {
                            @for(i of [1,2,3,4,5,6]; track i) {
                                <tr class="bg-white md:bg-transparent block md:table-row mb-3 md:mb-0 p-4 md:p-0 rounded-xl md:rounded-none border md:border-0 shadow-sm md:shadow-none">
                                    <td class="px-4 py-2 block md:table-cell"><app-skeleton width="100%" height="20px"></app-skeleton></td>
                                    <td class="px-4 py-2 hidden md:table-cell"><app-skeleton width="60%" height="16px"></app-skeleton></td>
                                    <td class="px-4 py-2 hidden md:table-cell"><app-skeleton width="40px" height="16px"></app-skeleton></td>
                                    <td class="px-4 py-2 hidden md:table-cell"><app-skeleton width="80px" height="16px"></app-skeleton></td>
                                    <td class="px-4 py-2 hidden md:table-cell"><app-skeleton width="50px" height="20px"></app-skeleton></td>
                                    <td class="px-4 py-2 hidden md:table-cell"></td>
                                </tr>
                            }
                        } @else {
                            @for (item of items(); track item.id) {
                                <!-- 
                                    HYBRID ROW: 
                                    - Mobile: Block (Card style), Rounded, Shadow, Spaced
                                    - Desktop: Table Row, Zebra Striping, Bordered Columns, Compact 
                                -->
                                <tr class="block md:table-row bg-white md:even:bg-gray-50/60 mb-3 md:mb-0 mx-3 md:mx-0 rounded-xl md:rounded-none border border-gray-100 md:border-0 md:border-b md:border-gray-100 shadow-sm md:shadow-none hover:bg-blue-50/50 transition group cursor-pointer" 
                                    (click)="openModal(item)">
                                    
                                    <!-- Name & Icon -->
                                    <td class="block md:table-cell px-4 py-3 pl-4 md:pl-6 border-b md:border-b-0 border-gray-50">
                                        <div class="flex items-center gap-3">
                                            <div class="w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0 transition-transform group-hover:scale-110"
                                                 [class]="getIconGradient(item)">
                                                <i class="fa-solid text-sm" [class]="getIcon(item.category)"></i>
                                            </div>
                                            <div class="flex flex-col min-w-0 flex-1">
                                                <div class="flex justify-between md:block">
                                                    <h6 class="mb-0 text-sm font-bold text-gray-700 leading-tight truncate pr-2 group-hover:text-blue-600 transition-colors">
                                                        {{item.name || item.id}}
                                                    </h6>
                                                    <!-- Mobile Only Stock Display (Top Right of Card) -->
                                                    <div class="md:hidden font-mono font-bold text-gray-800 text-sm">
                                                        {{formatNum(item.stock)}} <span class="text-xs text-gray-400 font-normal">{{item.unit}}</span>
                                                    </div>
                                                </div>
                                                <div class="flex items-center gap-2 mt-0.5">
                                                    <span class="text-[10px] text-gray-400 font-mono bg-gray-100 px-1.5 rounded border border-gray-200">{{item.id}}</span>
                                                    <!-- Mobile Status Dot -->
                                                    @if (item.stock <= 0) { 
                                                        <div class="md:hidden w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> 
                                                    } @else if (isLowStock(item)) { 
                                                        <div class="md:hidden w-2 h-2 rounded-full bg-orange-500"></div> 
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    <!-- Category -->
                                    <td class="block md:table-cell px-4 py-2 md:py-3 border-l-0 md:border-l border-gray-100">
                                        <div class="flex justify-between md:block">
                                            <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Phân loại</span>
                                            <span class="text-xs font-bold text-gray-500 uppercase">{{item.category}}</span>
                                        </div>
                                    </td>
                                    
                                    <!-- Unit -->
                                    <td class="block md:table-cell px-4 py-2 md:py-3 text-left md:text-center border-l-0 md:border-l border-gray-100">
                                        <div class="flex justify-between md:justify-center">
                                            <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Đơn vị</span>
                                            <span class="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">{{item.unit}}</span>
                                        </div>
                                    </td>
                                    
                                    <!-- Status (High Density Dots) -->
                                    <td class="block md:table-cell px-4 py-2 md:py-3 text-left md:text-center border-l-0 md:border-l border-gray-100">
                                        <div class="flex justify-between md:justify-center items-center h-full">
                                            <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Trạng thái</span>
                                            @if (item.stock <= 0) {
                                                <div class="flex items-center gap-2 text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-100 w-fit">
                                                    <div class="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div><span class="text-[10px] font-bold uppercase">Hết hàng</span>
                                                </div>
                                            } @else if (isLowStock(item)) {
                                                <div class="flex items-center gap-2 text-orange-600 bg-orange-50 px-2 py-1 rounded-full border border-orange-100 w-fit">
                                                    <div class="w-1.5 h-1.5 rounded-full bg-orange-500"></div><span class="text-[10px] font-bold uppercase">Sắp hết</span>
                                                </div>
                                            } @else {
                                                <div class="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 w-fit opacity-80">
                                                    <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div><span class="text-[10px] font-bold uppercase">Sẵn sàng</span>
                                                </div>
                                            }
                                        </div>
                                    </td>
                                    
                                    <!-- Stock (Desktop Only - Mobile handles in Name col) -->
                                    <td class="hidden md:table-cell px-4 py-3 text-right border-l border-gray-100 bg-white md:bg-transparent">
                                        <h6 class="font-bold text-gray-800 mb-0 font-mono text-sm tracking-tight" [class.text-red-500]="item.stock <= 0">
                                            {{formatNum(item.stock)}}
                                        </h6>
                                    </td>
                                    
                                    <!-- Quick Update -->
                                    @if (auth.canEditInventory()) {
                                        <td class="block md:table-cell px-4 py-2 md:py-3 text-right border-l-0 md:border-l border-gray-100" (click)="$event.stopPropagation()">
                                            <div class="flex items-center justify-between md:justify-end gap-2 h-full">
                                                <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Nhập/Xuất nhanh</span>
                                                <div class="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition duration-200">
                                                    <input #quickInput type="number" 
                                                           class="w-16 px-2 py-1 text-xs border border-gray-200 rounded-lg text-center focus:border-fuchsia-500 outline-none transition shadow-sm font-bold text-gray-700 bg-white font-mono" 
                                                           placeholder="+/-"
                                                           (keyup.enter)="quickUpdate(item, quickInput.value); quickInput.value=''">
                                                    <button (click)="quickUpdate(item, quickInput.value); quickInput.value=''" 
                                                            class="w-7 h-7 flex items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm active:scale-90">
                                                        <i class="fa-solid fa-check text-[10px]"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    }

                                    <!-- Actions -->
                                    <td class="hidden md:table-cell px-4 py-3 text-center border-l border-gray-100" (click)="$event.stopPropagation()">
                                        @if (auth.canEditInventory()) {
                                            <div class="opacity-0 group-hover:opacity-100 transition flex justify-center gap-1">
                                                <button (click)="openModal(item)" class="w-7 h-7 rounded bg-white border border-gray-200 text-blue-600 hover:border-blue-300 hover:text-blue-700 transition flex items-center justify-center shadow-sm">
                                                    <i class="fa-solid fa-pen text-[10px]"></i>
                                                </button>
                                                <button (click)="deleteItem(item)" class="w-7 h-7 rounded bg-white border border-gray-200 text-red-500 hover:border-red-300 hover:text-red-700 transition flex items-center justify-center shadow-sm">
                                                    <i class="fa-solid fa-trash text-[10px]"></i>
                                                </button>
                                            </div>
                                        }
                                    </td>
                                </tr>
                            } @empty {
                                <tr class="block md:table-row"><td colspan="7" class="p-10 text-center text-gray-400 italic">Không tìm thấy dữ liệu.</td></tr>
                            }
                        }
                    </tbody>
                </table>
                
                @if (hasMore() && !isLoading()) {
                    <div class="text-center p-4">
                        <button (click)="loadMore()" class="text-xs font-bold text-gray-500 hover:text-fuchsia-600 transition active:scale-95 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:shadow">
                            Xem thêm...
                        </button>
                    </div>
                }
            </div>
        }

        <!-- CAPACITY TAB -->
        @if (activeTab() === 'capacity') {
            <div class="flex flex-col md:flex-row h-full overflow-hidden">
                <div class="w-full md:w-72 border-r border-gray-100 overflow-y-auto p-4 bg-gray-50/50 h-1/3 md:h-full shrink-0">
                    <h6 class="text-xs font-bold text-gray-400 uppercase pl-2 mb-3 sticky top-0 bg-gray-50/50 backdrop-blur-sm py-1 z-10">Chọn Quy trình</h6>
                    @for (sop of state.sops(); track sop.id) {
                        <div (click)="selectedSopForCap.set(sop)" 
                             class="p-3 rounded-xl mb-2 cursor-pointer transition flex items-center gap-3 hover:bg-white hover:shadow-soft-sm active:scale-95 border"
                             [class]="selectedSopForCap()?.id === sop.id ? 'bg-white shadow-soft-md border-fuchsia-200 ring-1 ring-fuchsia-100' : 'border-transparent'">
                            <div>
                                <div class="text-[10px] font-bold text-gray-400 uppercase">{{sop.category}}</div>
                                <div class="text-sm font-bold text-gray-700 leading-tight line-clamp-1">{{sop.name}}</div>
                            </div>
                        </div>
                    }
                </div>
                <div class="flex-1 p-4 md:p-8 overflow-y-auto bg-white h-2/3 md:h-full relative">
                    @if(capacityLoading()) {
                        <div class="absolute inset-0 bg-white/80 z-20 flex items-center justify-center flex-col">
                            <i class="fa-solid fa-spinner fa-spin text-2xl text-fuchsia-500 mb-2"></i>
                            <span class="text-sm font-bold text-gray-500">Đang tải dữ liệu kho...</span>
                        </div>
                    }

                    @if(selectedSopForCap(); as sop) {
                        <div class="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                            <div>
                                <h4 class="font-bold text-gray-800 text-lg md:text-xl">{{sop.name}}</h4>
                                <div class="flex gap-2 mt-2">
                                    <button (click)="capacityMode.set('marginal')" class="px-3 py-1.5 text-xs font-bold rounded-lg border transition active:scale-95" [class]="capacityMode() === 'marginal' ? 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' : 'border-gray-200 text-gray-500'">1 Mẫu</button>
                                    <button (click)="capacityMode.set('standard')" class="px-3 py-1.5 text-xs font-bold rounded-lg border transition active:scale-95" [class]="capacityMode() === 'standard' ? 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' : 'border-gray-200 text-gray-500'">Mẻ Chuẩn</button>
                                </div>
                            </div>
                            <div class="text-right bg-gray-50 p-3 md:p-4 rounded-xl border border-gray-100 w-full md:w-auto flex justify-between md:block items-center">
                                <div class="text-xs font-bold text-gray-400 uppercase">Năng lực tối đa</div>
                                <div class="text-2xl md:text-3xl font-bold text-fuchsia-600">{{(capacityResult()?.maxBatches || 0)}} <span class="text-sm text-gray-400 font-normal">mẻ</span></div>
                            </div>
                        </div>
                        
                        @if (capacityResult()?.limitingFactor) {
                           <div class="mb-6 bg-orange-50 border border-orange-100 rounded-lg p-4 flex items-start gap-3 animate-bounce-in">
                              <i class="fa-solid fa-triangle-exclamation text-orange-500 mt-1"></i>
                              <div>
                                 <div class="text-xs font-bold text-orange-800 uppercase">Yếu tố giới hạn (Bottleneck)</div>
                                 <p class="text-sm text-orange-700 mt-1">
                                    Quy trình bị giới hạn bởi <b>{{resolveCapacityName(capacityResult()?.limitingFactor || '')}}</b>. 
                                    Vui lòng bổ sung kho để chạy thêm mẫu.
                                 </p>
                              </div>
                           </div>
                        }

                        <div class="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                           <table class="w-full text-sm text-left">
                              <thead class="bg-gray-50 text-[10px] text-gray-500 uppercase font-bold">
                                 <tr>
                                    <th class="px-4 py-3 border-b border-gray-100">Hóa chất</th>
                                    <th class="px-4 py-3 text-right border-b border-gray-100">Tồn kho</th>
                                    <th class="px-4 py-3 text-right border-b border-gray-100">Cần / Mẻ</th>
                                    <th class="px-4 py-3 text-center border-b border-gray-100">Đáp ứng (Mẻ)</th>
                                 </tr>
                              </thead>
                              <tbody class="divide-y divide-gray-50">
                                 @for (row of capacityResult()?.details; track row.name) {
                                    <tr class="hover:bg-gray-50 transition">
                                       <td class="px-4 py-3 font-bold text-gray-700 border-r border-gray-50/50">{{resolveCapacityName(row.name)}}</td>
                                       <td class="px-4 py-3 text-right text-gray-500 font-mono border-r border-gray-50/50">{{formatNum(row.stock)}}</td>
                                       <td class="px-4 py-3 text-right text-gray-500 font-mono border-r border-gray-50/50">{{formatNum(row.need)}}</td>
                                       <td class="px-4 py-3 text-center font-bold font-mono" 
                                           [class.text-red-500]="row.batches === (capacityResult()?.maxBatches ?? 0)"
                                           [class.text-fuchsia-600]="row.batches > (capacityResult()?.maxBatches ?? 0)">
                                          {{formatNum(row.batches)}}
                                       </td>
                                    </tr>
                                 }
                              </tbody>
                           </table>
                        </div>

                    } @else {
                        <div class="h-full flex items-center justify-center text-gray-300 flex-col">
                            <i class="fa-solid fa-chart-pie text-4xl mb-2"></i>
                            <span class="text-sm font-bold">Chọn quy trình để phân tích</span>
                        </div>
                    }
                </div>
            </div>
        }

        <!-- LABELS TAB -->
        @if (activeTab() === 'labels') {
            <app-label-print class="h-full block"></app-label-print>
        }
      </div>

      <!-- LAZY LOADED MODAL -->
      @defer (when showModal()) {
         @if (showModal()) {
            <div class="fixed inset-0 z-[99] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/30 backdrop-blur-sm fade-in" (click)="closeModal()">
                <div class="bg-white rounded-t-2xl md:rounded-2xl shadow-soft-xl w-full max-w-2xl overflow-hidden flex flex-col h-[85vh] md:h-auto md:max-h-[90vh] animate-slide-up" (click)="$event.stopPropagation()">
                   
                   <div class="p-5 border-b border-gray-100 flex justify-between items-center shrink-0">
                      <div>
                          <h5 class="font-bold text-gray-800 text-lg">{{ isEditing() ? 'Cập nhật' : 'Thêm mới' }}</h5>
                          <p class="text-xs text-gray-400">Thông tin chi tiết hóa chất</p>
                      </div>
                      <button (click)="closeModal()" class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition active:scale-90"><i class="fa-solid fa-times"></i></button>
                   </div>
                   
                   <div class="flex-1 overflow-y-auto p-5 md:p-6 bg-gray-50 custom-scrollbar">
                       <form [formGroup]="form" (ngSubmit)="save()" class="space-y-5">
                           <!-- Form Controls -->
                           <div>
                               <label class="text-xs font-bold text-gray-500 uppercase ml-1 block mb-1">Tên Hóa chất</label>
                               <input formControlName="name" (input)="onNameChange($event)" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-fuchsia-500 outline-none transition shadow-soft-sm font-bold text-gray-700 bg-white" placeholder="Nhập tên hóa chất...">
                           </div>
                           
                           <div class="grid grid-cols-2 gap-4">
                               <div>
                                   <label class="text-xs font-bold text-gray-500 uppercase ml-1 block mb-1">Mã ID</label>
                                   <input formControlName="id" [readonly]="isEditing()" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs font-mono text-gray-600 outline-none shadow-soft-sm bg-gray-100 focus:bg-white transition" placeholder="auto-gen">
                               </div>
                               <div>
                                   <label class="text-xs font-bold text-gray-500 uppercase ml-1 block mb-1">Phân loại</label>
                                   <select formControlName="category" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none shadow-soft-sm bg-white cursor-pointer">
                                       <option value="reagent">Hóa chất</option>
                                       <option value="consumable">Vật tư</option>
                                       <option value="kit">Kit</option>
                                   </select>
                               </div>
                           </div>

                           <div class="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                               <div>
                                   <label class="text-xs font-bold text-gray-500 uppercase ml-1 block mb-1">Tồn kho</label>
                                   <input type="number" formControlName="stock" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold text-fuchsia-600 outline-none bg-gray-50 focus:bg-white transition text-center">
                               </div>
                               <div>
                                   <label class="text-xs font-bold text-gray-500 uppercase ml-1 block mb-1">Đơn vị</label>
                                   <select formControlName="unit" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none bg-gray-50 focus:bg-white transition h-[52px]">
                                       @for (opt of unitOptions; track opt.value) { <option [value]="opt.value">{{opt.label}}</option> }
                                   </select>
                               </div>
                           </div>
                           
                           <div class="grid grid-cols-2 gap-4">
                               <div>
                                   <label class="text-xs font-bold text-gray-500 uppercase ml-1 block mb-1">Vị trí</label>
                                   <input formControlName="location" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none shadow-soft-sm bg-white" placeholder="VD: Tủ A">
                               </div>
                               <div>
                                   <label class="text-xs font-bold text-gray-500 uppercase ml-1 block mb-1">Ngưỡng báo động</label>
                                   <input type="number" formControlName="threshold" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none shadow-soft-sm bg-white font-bold text-orange-500" placeholder="5">
                               </div>
                           </div>
                           
                           <div class="pt-2 border-t border-gray-200">
                               <label class="text-xs font-bold text-slate-700 uppercase ml-1 block mb-1">Lý do thay đổi <span class="text-red-500">*</span></label>
                               <input formControlName="reason" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none shadow-soft-sm bg-yellow-50 focus:bg-white transition placeholder-slate-400" placeholder="VD: Nhập kho, Kiểm kê, Vỡ hỏng..." required>
                               <p class="text-[10px] text-slate-400 mt-1 italic">Yêu cầu bắt buộc để ghi nhật ký (Audit Trail).</p>
                           </div>

                           <div class="pt-4 flex gap-3">
                               @if(isEditing()) {
                                   <button type="button" (click)="deleteItem($any(form.getRawValue()))" class="flex-1 bg-red-50 text-red-600 py-3.5 rounded-xl font-bold text-sm shadow-sm hover:bg-red-100 transition active:scale-95">Xóa</button>
                               }
                               <button type="submit" [disabled]="isLoading()" class="flex-[3] bg-gradient-soft text-white py-3.5 rounded-xl font-bold text-sm shadow-soft-md hover:shadow-soft-xl transition transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50">
                                   {{ isEditing() ? 'Lưu Thay Đổi' : 'Tạo Mới' }}
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
  `]
})
export class InventoryComponent implements OnDestroy {
  state = inject(StateService);
  inventoryService = inject(InventoryService);
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
  isLoading = signal(true);
  
  // Decoupled from State
  totalCount = signal<number | null>(null);

  // Filters
  searchTerm = signal('');
  filterType = signal('all');
  searchSubject = new Subject<string>();
  
  selectedIds = signal<Set<string>>(new Set());

  // Capacity - Local Inventory Snapshot
  capacityInventoryMap = signal<Record<string, InventoryItem>>({}); 
  capacityLoading = signal(false);
  selectedSopForCap = signal<Sop | null>(null);
  capacityMode = signal<'marginal' | 'standard'>('marginal');
  
  capacityResult = computed(() => { 
      const s = this.selectedSopForCap(); 
      // Use the locally fetched map
      return s ? this.calcService.calculateCapacity(s, this.capacityMode(), this.capacityInventoryMap()) : null; 
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
          // Lazy load full inventory for capacity calculation
          this.capacityLoading.set(true);
          try {
              const allItems = await this.inventoryService.getAllInventory();
              const map: Record<string, InventoryItem> = {};
              allItems.forEach(i => map[i.id] = i);
              this.capacityInventoryMap.set(map);
          } catch(e) {
              console.error("Error loading full inventory for capacity", e);
          } finally {
              this.capacityLoading.set(false);
          }
      }
  }

  // Helpers
  formatNum = formatNum;
  getIcon(cat: string | undefined): string { return cat === 'reagent' ? 'fa-flask' : cat === 'consumable' ? 'fa-vial' : cat === 'kit' ? 'fa-box-open' : 'fa-cube'; }
  getIconGradient(item: InventoryItem): string {
      if (item.stock <= 0) return 'bg-gradient-to-tl from-red-600 to-rose-400';
      if (this.isLowStock(item)) return 'bg-gradient-to-tl from-orange-500 to-yellow-400';
      return 'bg-gradient-to-tl from-purple-700 to-pink-500';
  }
  isLowStock(item: InventoryItem) { return item.stock <= (item.threshold || 5); }
  
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
      this.isLoading.set(true);
      this.items.set([]);
      this.lastDoc.set(null);
      this.hasMore.set(true);
      this.selectedIds.set(new Set());
      await this.loadMore(true);
  }

  async loadMore(isRefresh = false) {
      if (!this.hasMore() && !isRefresh) return;
      this.isLoading.set(true);
      try {
          const page = await this.inventoryService.getInventoryPage(20, this.lastDoc(), this.filterType(), this.searchTerm());
          
          if (isRefresh) this.items.set(page.items);
          else this.items.update(c => [...c, ...page.items]);
          this.lastDoc.set(page.lastDoc);
          this.hasMore.set(page.hasMore);
      } finally { 
          this.isLoading.set(false); 
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
  closeModal() { this.showModal.set(false); }
  onNameChange(e: any) { if(!this.isEditing()) this.form.patchValue({ id: generateSlug(e.target.value) }); }
  
  async save() {
      if (this.form.invalid) {
          this.toast.show('Vui lòng nhập đầy đủ thông tin và Lý do thay đổi!', 'error');
          return;
      }
      this.isLoading.set(true);
      try { 
          const raw = this.form.getRawValue();
          const reason = raw.reason || ''; // FIX TS2345
          const { reason: _, ...itemData } = raw; 

          await this.inventoryService.upsertItem(itemData as any, !this.isEditing(), reason); 
          this.closeModal(); 
          this.refreshData(); 
          if(!this.isEditing()) this.loadTotalCount(); // Refresh count on add
      } catch (e: any) {
          if (e.code === 'resource-exhausted') {
             this.toast.show('Lỗi: Hết dung lượng lưu trữ (Quota).', 'error');
          } else {
             this.toast.show('Lỗi lưu kho: ' + (e.message || 'Unknown'), 'error');
          }
      } finally { 
          this.isLoading.set(false); 
      }
  }
  
  async deleteItem(item: InventoryItem) {
      this.closeModal(); 
      if(await this.confirmationService.confirm({ message: 'Xóa mục này? Hành động này cần được ghi nhận.', confirmText: 'Xác nhận Xóa', isDangerous: true })) {
          await this.inventoryService.deleteItem(item.id, 'Xóa thủ công');
          this.refreshData();
          this.loadTotalCount();
      }
  }
  
  async quickUpdate(item: InventoryItem, valStr: string) {
    const val = parseFloat(valStr);
    if (isNaN(val) || val === 0) return;

    try {
      const reason = val > 0 ? 'Nhập nhanh' : 'Xuất nhanh';
      await this.inventoryService.updateStock(item.id, item.stock, val, reason);
      const msg = val > 0 ? `Đã nhập +${val} ${item.unit}` : `Đã xuất ${val} ${item.unit}`;
      this.toast.show(msg, 'success');
      this.refreshData();
    } catch (e: any) {
      this.toast.show('Lỗi cập nhật kho', 'error');
    }
  }
  
  async zeroOutSelected() { /* ... */ }
}
