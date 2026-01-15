
import { Component, inject, signal, effect, input, output, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SopService } from '../services/sop.service';
import { StateService } from '../../../core/services/state.service';
import { ToastService } from '../../../core/services/toast.service';
import { CalculatorService } from '../../../core/services/calculator.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { InventoryService } from '../../inventory/inventory.service';
import { RecipeService } from '../../recipes/recipe.service'; 
import { Sop, CalculatedItem } from '../../../core/models/sop.model';
import { InventoryItem } from '../../../core/models/inventory.model';
import { Recipe } from '../../../core/models/recipe.model';
import { UNIT_OPTIONS, formatNum, formatDate, generateSlug } from '../../../shared/utils/utils';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject, of } from 'rxjs';

const STANDARD_VARS = [
    { value: 'total_n', label: 'Biến: Tổng số mẫu (n_sample + n_qc)' },
    { value: 'total_vol_solvent', label: 'Biến: Tổng thể tích dung môi (mL)' },
    { value: 'v_extract', label: 'Biến: Thể tích dịch chiết (mL)' }
];

@Component({
  selector: 'app-sop-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="h-full flex flex-col bg-slate-100 fade-in text-slate-800 relative" (click)="closeSearchDropdown()">
        <!-- Toolbar -->
        <div class="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-30">
            <div class="flex items-center gap-4">
                <button (click)="goBack()" [disabled]="isLoading()" class="text-slate-500 hover:text-slate-800 text-sm font-bold flex items-center gap-2 transition disabled:opacity-50">
                    <i class="fa-solid fa-arrow-left"></i> <span class="hidden md:inline">Quay lại</span>
                </button>
                <div class="h-6 w-px bg-slate-200"></div>
                <div>
                   <h2 class="text-base font-bold text-slate-800 flex items-center gap-2 leading-none">
                       {{ form.get('name')?.value || 'Quy trình Mới' }}
                   </h2>
                   <div class="text-[10px] text-slate-400 font-mono mt-1 flex items-center gap-3">
                       <span>ID: {{ form.get('id')?.value || 'Pending...' }}</span>
                       <div class="flex items-center bg-slate-100 rounded px-1.5 py-0.5 border border-slate-200 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100 transition-all">
                           <span class="text-slate-500 font-bold mr-1">v</span>
                           <input type="number" [formControl]="form.controls.version" 
                                  class="bg-transparent w-8 text-[10px] font-bold text-blue-700 outline-none text-center" 
                                  min="1">
                       </div>
                   </div>
                </div>
            </div>
            <div class="flex gap-2">
                <button (click)="save()" [disabled]="isLoading()" class="px-4 py-1.5 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 text-sm font-bold transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    @if(isLoading()) { <i class="fa-solid fa-spinner fa-spin"></i> }
                    @else { <i class="fa-solid fa-floppy-disk"></i> }
                    <span>Lưu Quy Trình</span>
                </button>
            </div>
        </div>

        <!-- Split View Layout -->
        <div class="flex-1 flex overflow-hidden relative">
            @if(isLoading()) { <div class="absolute inset-0 bg-white/50 z-50 cursor-wait"></div> }
            
            <!-- LEFT COLUMN: Editor -->
            <div class="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden border-r border-slate-200">
                <!-- Tabs -->
                <div class="flex bg-white border-b border-slate-200 px-4 gap-6 shrink-0">
                   <button (click)="currentTab.set('general')" class="py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide" [class]="currentTab() === 'general' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'">Thông tin</button>
                   <button (click)="currentTab.set('logic')" class="py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide" [class]="currentTab() === 'logic' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-700'">Logic</button>
                   <button (click)="currentTab.set('consumables')" class="py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide" [class]="currentTab() === 'consumables' ? 'border-orange-600 text-orange-700' : 'border-transparent text-slate-500 hover:text-slate-700'">Vật tư (Consumables)</button>
                </div>

                <div class="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                   <form [formGroup]="form" class="max-w-3xl mx-auto space-y-6">
                      
                      <!-- TAB 1: GENERAL INFO -->
                      @if (currentTab() === 'general') {
                          <div class="space-y-6 fade-in">
                              <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                                  <div>
                                      <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Tên Quy Trình <span class="text-red-500">*</span></label>
                                      <input formControlName="name" class="w-full border border-slate-300 rounded-lg p-3 text-sm font-bold outline-none focus:border-blue-500 transition">
                                  </div>
                                  <div class="grid grid-cols-2 gap-4">
                                      <div>
                                          <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Danh mục (Category) <span class="text-red-500">*</span></label>
                                          <input formControlName="category" class="w-full border border-slate-300 rounded-lg p-3 text-sm outline-none focus:border-blue-500 transition" placeholder="VD: NAFI6 H-9.21">
                                      </div>
                                      <div>
                                          <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Tài liệu tham chiếu (Ref)</label>
                                          <input formControlName="ref" class="w-full border border-slate-300 rounded-lg p-3 text-sm outline-none focus:border-blue-500 transition" placeholder="VD: AOAC 2007.01">
                                      </div>
                                  </div>
                              </div>

                              <!-- INPUTS CONFIG -->
                              <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                                  <div class="flex justify-between items-center mb-4">
                                      <h3 class="font-bold text-slate-800 text-sm uppercase">Đầu vào (Inputs)</h3>
                                      <button type="button" (click)="addInput()" class="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-bold text-slate-600 transition">+ Thêm Input</button>
                                  </div>
                                  
                                  <div formArrayName="inputs" class="space-y-3">
                                      @for (inp of inputs.controls; track inp; let i = $index) {
                                          <div [formGroupName]="i" class="flex gap-2 items-start p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                                              <div class="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2">
                                                  <div><label class="text-[9px] font-bold text-slate-400 uppercase">Biến (Var)</label><input formControlName="var" class="w-full border border-slate-300 rounded px-2 py-1.5 text-xs font-mono font-bold text-blue-600 outline-none"></div>
                                                  <div><label class="text-[9px] font-bold text-slate-400 uppercase">Nhãn (Label)</label><input formControlName="label" class="w-full border border-slate-300 rounded px-2 py-1.5 text-xs font-bold text-slate-700 outline-none"></div>
                                                  <div><label class="text-[9px] font-bold text-slate-400 uppercase">Kiểu</label>
                                                      <select formControlName="type" class="w-full border border-slate-300 rounded px-2 py-1.5 text-xs outline-none bg-white">
                                                          <option value="number">Số (Number)</option>
                                                          <option value="checkbox">Checkbox</option>
                                                      </select>
                                                  </div>
                                                  <div><label class="text-[9px] font-bold text-slate-400 uppercase">Mặc định</label><input formControlName="default" class="w-full border border-slate-300 rounded px-2 py-1.5 text-xs font-bold outline-none"></div>
                                              </div>
                                              <button type="button" (click)="inputs.removeAt(i)" class="mt-4 text-slate-300 hover:text-red-500 transition px-2"><i class="fa-solid fa-trash"></i></button>
                                          </div>
                                      }
                                  </div>
                              </div>
                          </div>
                      }

                      <!-- TAB 2: LOGIC -->
                      @if (currentTab() === 'logic') {
                          <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 fade-in">
                              <div class="flex justify-between items-center mb-4">
                                  <h3 class="font-bold text-slate-800 text-sm uppercase flex items-center gap-2">
                                      <i class="fa-solid fa-calculator text-purple-500"></i> Biến Trung Gian (Variables)
                                  </h3>
                                  <button type="button" (click)="addVariable()" class="text-xs bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-1.5 rounded-lg font-bold transition">+ Thêm Biến</button>
                              </div>
                              <p class="text-xs text-slate-500 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                  <i class="fa-solid fa-circle-info mr-1"></i> Định nghĩa các công thức toán học dùng chung. 
                                  Dùng các biến input (VD: <code>n_sample</code>) hoặc các biến khác.
                              </p>

                              <div formArrayName="variablesList" class="space-y-3">
                                  @for (v of variablesList.controls; track v; let i = $index) {
                                      <div [formGroupName]="i" class="flex gap-2 items-center p-3 border border-purple-100 bg-purple-50/30 rounded-xl relative group">
                                          <div class="w-1/3">
                                              <label class="text-[9px] font-bold text-purple-400 uppercase mb-1 block">Tên Biến</label>
                                              <input formControlName="key" list="std_vars" placeholder="VD: total_vol" class="w-full border border-purple-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-purple-700 outline-none focus:bg-white transition">
                                              <datalist id="std_vars">
                                                  @for(std of standardVars; track std.value) { <option [value]="std.value">{{std.label}}</option> }
                                              </datalist>
                                          </div>
                                          <div class="flex items-center justify-center pt-4 text-purple-300"><i class="fa-solid fa-equals"></i></div>
                                          <div class="flex-1">
                                              <label class="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Công thức (JavaScript Math)</label>
                                              <input formControlName="formula" placeholder="VD: n_sample * 10" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 outline-none focus:border-purple-500 focus:bg-white transition">
                                          </div>
                                          <button type="button" (click)="variablesList.removeAt(i)" class="mt-4 w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 transition rounded-full hover:bg-white"><i class="fa-solid fa-trash"></i></button>
                                      </div>
                                  }
                              </div>
                          </div>
                      }
                      
                      <!-- TAB 3: CONSUMABLES -->
                      @if (currentTab() === 'consumables') {
                          <div class="fade-in pb-32">
                             <div class="flex items-center justify-between mb-4">
                                 <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                     Danh sách Vật tư <span class="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded-full">{{consumables.length}}</span>
                                 </h3>
                                 <button type="button" (click)="addConsumable()" class="text-xs bg-slate-800 text-white hover:bg-slate-700 px-4 py-2 rounded-lg font-bold transition">+ Thêm Dòng</button>
                             </div>
                             
                             <div formArrayName="consumables" class="space-y-4">
                                @for (con of consumables.controls; track con; let i = $index) {
                                   @let conType = con.get('type')?.value;
                                   <div [formGroupName]="i" class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-visible group transition hover:shadow-md hover:border-blue-300 relative z-0" [style.zIndex]="200-i">
                                      <div class="bg-slate-50 p-3 flex items-center gap-3 border-b border-slate-100">
                                         <div class="w-6 h-6 rounded bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold">{{i+1}}</div>
                                         <select formControlName="type" (change)="onTypeChange(i)" class="text-[10px] font-bold uppercase bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-blue-500 cursor-pointer w-32">
                                             <option value="simple">Hóa chất đơn</option>
                                             <option value="shared_recipe">Công thức (Thư viện)</option>
                                             <option value="composite">Hỗn hợp (Nhập tay)</option>
                                         </select>
                                         
                                         <div class="flex-1 relative group/input">
                                             @if(conType === 'simple' || conType === 'shared_recipe') {
                                                 <i class="fa-solid fa-magnifying-glass absolute left-2 top-2 text-slate-300 text-xs"></i>
                                                 <input formControlName="_displayName" 
                                                        (input)="onSearchInput($event, i, false)"
                                                        (focus)="onSearchFocus(i, false)"
                                                        autocomplete="off"
                                                        [placeholder]="conType === 'simple' ? 'Tìm trong kho...' : 'Tìm trong thư viện công thức...'" 
                                                        class="w-full pl-7 pr-3 py-1 bg-transparent border-none focus:ring-0 font-bold text-slate-700 placeholder-slate-400 text-sm">
                                                 
                                                 <!-- Hidden Fields -->
                                                 <input formControlName="name" type="hidden"> 
                                                 <input formControlName="recipeId" type="hidden">

                                                 <!-- Dropdown Results -->
                                                 @if(activeSearch?.index === i && !activeSearch?.isIngredient && searchResults().length > 0) {
                                                     <div class="absolute top-full left-0 w-full bg-white border border-slate-200 rounded-lg shadow-xl mt-1 max-h-64 overflow-y-auto z-50 custom-scrollbar" (click)="$event.stopPropagation()">
                                                         @for (item of searchResults(); track item.id) {
                                                             <div (click)="selectItem(item, i, false)" class="px-3 py-2.5 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0 flex justify-between items-start group/item transition-colors">
                                                                 <div class="flex-1 min-w-0 pr-2">
                                                                     <div class="text-xs font-bold text-slate-700 group-hover/item:text-blue-700 truncate leading-snug">{{item.name}}</div>
                                                                     
                                                                     <!-- CONTEXT BADGES -->
                                                                     <div class="flex flex-wrap gap-1.5 mt-1">
                                                                         <span class="text-[9px] text-slate-400 font-mono bg-slate-100 px-1 rounded border border-slate-200">ID: {{item.id}}</span>
                                                                         @if(item.supplier || item.manufacturer) {
                                                                             <span class="text-[9px] text-slate-500 flex items-center gap-1">
                                                                                 <i class="fa-solid fa-industry text-[8px]"></i> {{item.supplier || item.manufacturer}}
                                                                             </span>
                                                                         }
                                                                         @if(item.category) {
                                                                              <span class="text-[9px] text-slate-400 uppercase font-bold">{{item.category}}</span>
                                                                         }
                                                                     </div>
                                                                 </div>
                                                                 
                                                                 @if (conType === 'simple') {
                                                                    <div class="text-right shrink-0">
                                                                        <div class="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 mb-0.5">{{item.unit}}</div>
                                                                        @if(item.stock !== undefined) {
                                                                            <div class="text-[9px] font-mono font-bold" [class.text-red-500]="item.stock <= 0" [class.text-emerald-600]="item.stock > 0">
                                                                                Ton: {{formatNum(item.stock)}}
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                 }
                                                             </div>
                                                         }
                                                     </div>
                                                 }
                                             } @else {
                                                 <div class="flex items-center gap-2">
                                                     <span class="text-[10px] font-bold text-slate-400 uppercase">Tên hỗn hợp:</span>
                                                     <input formControlName="_displayName" (change)="updateCompositeId(i)" placeholder="VD: Hỗn hợp đệm A" 
                                                            class="flex-1 bg-transparent border-none focus:ring-0 font-bold text-slate-700 text-sm placeholder-slate-300">
                                                     <div class="text-[10px] text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded">ID: {{ con.get('name')?.value }}</div>
                                                 </div>
                                             }
                                         </div>
                                         <button type="button" (click)="consumables.removeAt(i)" class="text-slate-300 hover:text-red-600 px-2 transition"><i class="fa-solid fa-trash"></i></button>
                                      </div>
                                      
                                      <div class="p-4 grid gap-4 relative">
                                         <!-- Formula & Unit Row -->
                                         <div class="flex gap-3 items-end">
                                            <div class="flex-1">
                                                <label class="text-[9px] uppercase font-bold text-slate-400 block mb-1">Công thức (Tính trên 1 mẫu)</label>
                                                <div class="relative">
                                                    <input formControlName="formula" class="w-full pl-3 pr-8 py-2 text-sm border border-slate-300 rounded-lg font-mono text-blue-700 focus:border-blue-500 outline-none bg-slate-50 focus:bg-white transition" placeholder="VD: 10 * n_sample">
                                                    <span class="absolute right-3 top-2.5 text-slate-400 text-xs"><i class="fa-solid fa-calculator"></i></span>
                                                </div>
                                            </div>
                                            <div class="w-24">
                                                <label class="text-[9px] uppercase font-bold text-slate-400 block mb-1">Đơn vị</label>
                                                <select formControlName="unit" class="w-full py-2 pl-2 pr-6 text-sm border border-slate-300 rounded-lg outline-none bg-white appearance-none cursor-pointer h-[38px]">
                                                    @for (opt of unitOptions; track opt.value) { <option [value]="opt.value">{{opt.value}}</option> }
                                                </select>
                                            </div>
                                         </div>
                                         
                                         <!-- Base Note & Condition Row (New Layout) -->
                                         <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                             <div class="relative">
                                                 <label class="text-[9px] uppercase font-bold text-slate-400 block mb-1">Ghi chú (Note)</label>
                                                 <div class="relative">
                                                     <i class="fa-regular fa-note-sticky absolute left-3 top-2.5 text-slate-400 text-xs"></i>
                                                     <input formControlName="base_note" placeholder="VD: Cân chính xác, pha trong tủ hút..." 
                                                            class="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200 transition">
                                                 </div>
                                             </div>
                                             <div class="relative">
                                                 <label class="text-[9px] uppercase font-bold text-slate-400 block mb-1">Điều kiện (Conditional)</label>
                                                 <div class="relative">
                                                     <i class="fa-solid fa-code-branch absolute left-3 top-2.5 text-slate-400 text-xs"></i>
                                                     <input formControlName="condition" placeholder="VD: !use_b2 (chỉ hiện khi biến use_b2 = false)" 
                                                            class="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg font-mono text-slate-600 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-200 transition">
                                                 </div>
                                             </div>
                                         </div>

                                         <!-- Ingredients (Composite Only) -->
                                         @if (conType === 'composite') {
                                            <div class="mt-2 bg-slate-50 rounded-lg border border-slate-200 p-3 relative z-10">
                                               <div class="flex justify-between items-center mb-2 border-b border-slate-200 pb-2">
                                                   <span class="text-xs font-bold text-slate-700 flex items-center gap-2"><i class="fa-solid fa-layer-group text-blue-500"></i> Thành phần con</span>
                                                   <button type="button" (click)="addIngredient(i)" class="text-[10px] bg-white border border-slate-300 hover:bg-blue-50 text-slate-600 px-2 py-1 rounded font-bold transition">+ Thêm chất</button>
                                               </div>
                                               <div formArrayName="ingredients" class="space-y-2">
                                                  @for (ing of getIngredients(i).controls; track ing; let j = $index) {
                                                     <div [formGroupName]="j" class="flex gap-2 items-center relative" [style.zIndex]="100-j">
                                                        <div class="flex-1 relative">
                                                            <input formControlName="_displayName" (input)="onSearchInput($event, i, true, j)" (focus)="onSearchFocus(i, true, j)" autocomplete="off" placeholder="Chọn từ kho..." class="w-full border border-slate-300 rounded px-2 py-1.5 text-xs outline-none focus:border-blue-500 bg-white shadow-sm font-bold text-slate-700">
                                                            <input formControlName="name" type="hidden">
                                                            @if(activeSearch?.index === i && activeSearch?.isIngredient && activeSearch?.subIndex === j && searchResults().length > 0) {
                                                                <div class="absolute top-full left-0 w-full bg-white border border-slate-200 rounded-lg shadow-xl mt-1 max-h-48 overflow-y-auto z-50 custom-scrollbar" (click)="$event.stopPropagation()">
                                                                    @for (item of searchResults(); track item.id) { 
                                                                        <div (click)="selectItem(item, i, true, j)" class="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-slate-50 flex justify-between items-center group/item transition-colors">
                                                                            <div class="flex-1 min-w-0 pr-2">
                                                                                <div class="text-xs font-bold text-slate-700 truncate group-hover/item:text-blue-700">{{item.name}}</div>
                                                                                <div class="flex gap-2 mt-0.5">
                                                                                    <span class="text-[9px] text-slate-400 font-mono">ID: {{item.id}}</span>
                                                                                    @if(item.supplier) { <span class="text-[9px] text-slate-500">{{item.supplier}}</span> }
                                                                                </div>
                                                                            </div>
                                                                            <div class="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">{{item.unit}}</div>
                                                                        </div> 
                                                                    }
                                                                </div>
                                                            }
                                                        </div>
                                                        <input formControlName="amount" type="number" placeholder="Lượng" class="w-16 border border-slate-300 rounded px-1 py-1.5 text-xs text-center outline-none font-bold">
                                                        <select formControlName="unit" class="w-16 border border-slate-300 rounded px-1 py-1.5 text-xs text-center outline-none bg-white">@for (opt of unitOptions; track opt.value) { <option [value]="opt.value">{{opt.value}}</option> }</select>
                                                        <button type="button" (click)="getIngredients(i).removeAt(j)" class="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-red-500 transition rounded-full hover:bg-white"><i class="fa-solid fa-times"></i></button>
                                                     </div>
                                                  }
                                               </div>
                                            </div>
                                         }
                                      </div>
                                   </div>
                                }
                             </div>
                          </div>
                      }
                   </form>
                </div>
            </div>
            <!-- RIGHT COLUMN: Preview (Simplified for brevity, logic same) -->
            <div class="w-96 bg-white border-l border-slate-200 flex flex-col shrink-0 shadow-xl z-20">
                <div class="p-3 border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-600">Xem trước Kết quả</div>
                <div class="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                     @for (item of previewResults(); track item.name) {
                        <div class="border-b border-slate-100 last:border-0 pb-2">
                           <div class="flex justify-between items-start">
                              <div class="font-medium text-xs text-slate-700 pr-2">{{ item.displayName || item.name }}</div>
                              <div class="font-bold text-sm text-blue-600 whitespace-nowrap">{{formatNum(item.stockNeed)}} <span class="text-[10px] text-slate-400">{{item.stockUnit}}</span></div>
                           </div>
                           @if(item.isComposite) {
                              <div class="mt-1 pl-2 border-l-2 border-slate-100 ml-1">
                                 @for(sub of item.breakdown; track sub.name) {
                                     <div class="flex justify-between text-[10px]">
                                         <span class="text-slate-500">{{sub.displayName || sub.name}}</span>
                                         <span class="font-bold text-slate-700">{{formatNum(sub.totalNeed)}} {{sub.stockUnit}}</span>
                                     </div>
                                 }
                              </div>
                           }
                        </div>
                     }
                </div>
            </div>
        </div>
    </div>
  `
})
export class SopEditorComponent implements OnDestroy {
  // Services & State
  state = inject(StateService);
  sopService = inject(SopService);
  invService = inject(InventoryService);
  recipeService = inject(RecipeService); 
  toast = inject(ToastService);
  confirmationService = inject(ConfirmationService);
  calcService = inject(CalculatorService);
  router: Router = inject(Router);
  fb: FormBuilder = inject(FormBuilder);
  
  // Helpers
  unitOptions = UNIT_OPTIONS;
  formatNum = formatNum;
  standardVars = STANDARD_VARS;
  
  // State Signals
  currentId = signal<string | null>(null);
  currentVersion = signal<number>(1);
  currentTab = signal<'general' | 'logic' | 'consumables'>('general');
  isLoading = signal(false);
  previewResults = signal<CalculatedItem[]>([]);
  
  // SEARCH STATE
  searchSubject = new Subject<string>();
  searchResults = signal<any[]>([]); // Can be InventoryItem or Recipe
  activeSearch: { index: number, isIngredient: boolean, subIndex?: number } | null = null;

  readonly CORE_INPUTS = [{ var: 'n_sample', label: 'Số lượng mẫu', type: 'number', default: 1, step: 1, unitLabel: 'mẫu' }, { var: 'n_qc', label: 'Số lượng QC', type: 'number', default: 8, step: 1, unitLabel: 'mẫu' }, { var: 'w_sample', label: 'Khối lượng mẫu', type: 'number', default: 10, step: 0.1, unitLabel: 'g' }];

  form = this.fb.group({
    id: [''], category: ['', Validators.required], name: ['', Validators.required], ref: [''],
    version: [1, [Validators.required, Validators.min(1)]],
    inputs: this.fb.array([]), variablesList: this.fb.array([]), consumables: this.fb.array([])
  });

  constructor() {
    effect((onCleanup) => {
      const sop = this.state.editingSop();
      if (sop) { 
          if (sop.id) this.loadSop(sop); 
          else { 
              this.loadSop(sop); 
              this.currentId.set(null); 
              this.currentVersion.set(1); 
              this.form.patchValue({ id: '', version: 1 }); 
          } 
      } else { 
          this.createNew(); 
      }
      const sub = this.form.valueChanges.pipe(debounceTime(300)).subscribe(val => { this.runPreview(val); });
      onCleanup(() => sub.unsubscribe());
    }, { allowSignalWrites: true }); // FIX NG0600: Allow writes to signals within effect

    // Unified Search Listener
    this.searchSubject.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term => {
            if (!term || term.trim().length < 1 || !this.activeSearch) return of([]);
            const index = this.activeSearch.index;
            const conType = this.consumables.at(index).get('type')?.value;
            
            // Determine search source based on type
            if (!this.activeSearch.isIngredient && conType === 'shared_recipe') {
                // Search Recipes with error handling
                return this.recipeService.getAllRecipes()
                    .then(all => all.filter(r => r.name.toLowerCase().includes(term.toLowerCase())))
                    .catch(e => {
                        console.warn('Recipe search failed:', e);
                        return [];
                    });
            } else {
                // Search Inventory (Simple items or Composite ingredients)
                // Note: Returns InventoryItem[] which has stock, supplier, etc.
                return this.invService.getInventoryPage(10, null, 'all', term).then(res => res.items);
            }
        })
    ).subscribe(items => {
        this.searchResults.set(items);
    });
  }

  ngOnDestroy() { this.searchSubject.complete(); }

  // --- Strict Mode Form Logic ---
  onTypeChange(index: number) {
      const con = this.consumables.at(index);
      con.patchValue({ name: '', _displayName: '', recipeId: '' });
  }

  updateCompositeId(index: number) {
      const con = this.consumables.at(index);
      const display = con.get('_displayName')?.value;
      if (display) con.patchValue({ name: 'mix_' + generateSlug(display) });
  }

  onSearchInput(event: any, index: number, isIngredient: boolean, subIndex?: number) {
      this.activeSearch = { index, isIngredient, subIndex };
      this.searchSubject.next(event.target.value);
  }

  onSearchFocus(index: number, isIngredient: boolean, subIndex?: number) {
      this.activeSearch = { index, isIngredient, subIndex };
      const control = isIngredient ? this.getIngredients(index).at(subIndex!).get('_displayName') : this.consumables.at(index).get('_displayName');
      const val = control?.value || '';
      if(val) this.searchSubject.next(val);
  }

  selectItem(item: any, index: number, isIngredient: boolean, subIndex?: number) {
      // Item can be InventoryItem or Recipe
      if (isIngredient) {
          const control = this.getIngredients(index).at(subIndex!);
          control.patchValue({ name: item.id, unit: item.unit, _displayName: item.name }); 
      } else {
          const control = this.consumables.at(index);
          const type = control.get('type')?.value;
          
          if (type === 'shared_recipe') {
              // It's a Recipe
              control.patchValue({ 
                  name: item.id, // Use recipe ID as consumable name/ID for tracking
                  recipeId: item.id, 
                  unit: item.baseUnit, 
                  _displayName: item.name 
              });
          } else {
              // It's Inventory Item
              control.patchValue({ name: item.id, unit: item.unit, _displayName: item.name });
          }
      }
      this.closeSearchDropdown();
  }

  closeSearchDropdown() { this.searchResults.set([]); this.activeSearch = null; }

  // --- Getters & Form Manipulation ---
  get inputs() { return this.form.get('inputs') as FormArray; }
  get variablesList() { return this.form.get('variablesList') as FormArray; }
  get consumables() { return this.form.get('consumables') as FormArray; }
  getIngredients(conIndex: number): FormArray { return this.consumables.at(conIndex).get('ingredients') as FormArray; }

  createNew() {
    this.currentId.set(null); this.currentVersion.set(1); this.currentTab.set('general');
    this.form.reset({ id: '', category: '', name: '', ref: '', version: 1 });
    this.inputs.clear(); this.variablesList.clear(); this.consumables.clear();
    this.CORE_INPUTS.forEach(ci => { this.addInputRaw(ci.var, ci.label, ci.default, ci.type as any, ci.step, ci.unitLabel); });
    this.previewResults.set([]);
  }

  loadSop(sop: Sop) {
    if (sop.id) this.currentId.set(sop.id);
    this.currentVersion.set(sop.version || 1); 
    this.currentTab.set('general');
    this.form.patchValue({ id: sop.id, category: sop.category, name: sop.name, ref: sop.ref, version: sop.version || 1 });
    
    this.inputs.clear(); 
    const loadedVars = new Set<string>();
    sop.inputs.forEach(i => { this.addInputRaw(i.var, i.label, i.default, i.type, i.step, i.unitLabel); loadedVars.add(i.var); });
    this.CORE_INPUTS.forEach(ci => { if (!loadedVars.has(ci.var)) { this.addInputRaw(ci.var, ci.label, ci.default, ci.type as any, ci.step, ci.unitLabel); } });

    this.variablesList.clear();
    if (sop.variables) Object.entries(sop.variables).forEach(([k, v]) => this.variablesList.push(this.fb.group({ key: [k, Validators.required], formula: [v, Validators.required] })));
    
    this.consumables.clear();
    sop.consumables.forEach(c => {
      const g = this.fb.group({ 
          name: [c.name || ''], 
          recipeId: [c.recipeId || ''],
          _displayName: [c._displayName || c.name || ''], 
          base_note: [c.base_note || ''], formula: [c.formula || ''], unit: [c.unit || ''], type: [c.type || 'simple'], condition: [c.condition || ''], ingredients: this.fb.array([]) 
      });
      if (c.ingredients) c.ingredients.forEach(ing => (g.get('ingredients') as FormArray).push(this.fb.group({ name: [ing.name, Validators.required], _displayName: [ing._displayName || ing.name, Validators.required], amount: [ing.amount, Validators.required], unit: [ing.unit, Validators.required] })));
      this.consumables.push(g);
    });
    this.runPreview(this.form.value);
  }

  // --- Preview & Save ---
  runPreview(formVal: any) {
    try {
        const mockInputs: Record<string, any> = {};
        (formVal.inputs || []).forEach((i: any) => { if(i.var) mockInputs[i.var] = i.default; });
        const variables: Record<string, string> = {};
        (formVal.variablesList as any[]).forEach(v => { if (v.key && v.formula) variables[v.key] = v.formula; });
        
        const tempSop: Sop = { 
            id: 'preview', category: 'p', name: 'P', 
            inputs: formVal.inputs, variables: variables, 
            consumables: (formVal.consumables as any[]).map(c => ({ 
                ...c, name: c.name || '', recipeId: c.recipeId, ingredients: c.ingredients || [] 
            }))
        };
        // Note: Preview won't expand Shared Recipes because we can't do async fetch here easily without lagging the UI. 
        // Just calculating basic math for preview.
        const results = this.calcService.calculateSopNeeds(tempSop, mockInputs, 0); 
        this.previewResults.set(results); 
    } catch (e) { }
  }

  async save() {
    this.isLoading.set(true);
    let formVal = this.form.value;
    if (!formVal.id) { this.form.patchValue({ id: `sop_${Date.now()}` }); formVal = this.form.value; }
    
    if (this.form.invalid) { this.form.markAllAsTouched(); this.toast.show('Kiểm tra các trường bắt buộc!', 'error'); this.isLoading.set(false); return; }
    
    const invalidConsumable = (formVal.consumables as any[]).find((c: any) => !c.name || c.name.trim() === '');
    if (invalidConsumable) { this.toast.show('Một số hóa chất chưa chọn ID hợp lệ!', 'error'); this.currentTab.set('consumables'); this.isLoading.set(false); return; }

    const variables: Record<string, string> = {};
    (formVal.variablesList as any[]).forEach(v => { if (v.key && v.formula) variables[v.key] = v.formula; });
    
    const sop: Sop = {
      id: formVal.id!, category: formVal.category!, name: formVal.name!, ref: formVal.ref || '',
      inputs: (formVal.inputs as any[]).map(i => ({...i})), variables: variables,
      consumables: (formVal.consumables as any[]).map((c: any) => {
          return { 
              name: c.name, recipeId: c.recipeId, _displayName: c._displayName, 
              base_note: c.base_note, formula: c.formula, unit: c.unit, type: c.type, 
              condition: c.condition, 
              ingredients: (c.ingredients || []).map((ing: any) => ({ name: ing.name, amount: ing.amount, unit: ing.unit, _displayName: ing._displayName }))
          };
      }),
      version: formVal.version || this.currentVersion() 
    };
    
    try { await this.sopService.saveSop(sop); this.toast.show('Đã lưu quy trình thành công!'); this.state.selectedSop.set(sop); this.state.editingSop.set(null); this.router.navigate(['/calculator']); } catch(e: any) { this.toast.show('Lỗi lưu SOP: ' + (e.message || 'Unknown'), 'error'); } finally { this.isLoading.set(false); }
  }

  goBack() { this.state.editingSop.set(null); this.router.navigate(['/calculator']); }
  
  // Helper methods
  addInput() { this.addInputRaw('', '', 0, 'number', 1, ''); }
  private addInputRaw(v: string, l: string, d: any, t: 'number'|'checkbox', s: any, u: string | undefined) { this.inputs.push(this.fb.group({ var: [v, Validators.required], label: [l, Validators.required], default: [d], type: [t], step: [s], unitLabel: [u] })); }
  
  addVariable() { this.variablesList.push(this.fb.group({ key: ['', Validators.required], formula: ['', Validators.required] })); }

  addConsumable() { this.consumables.push(this.fb.group({ name: [''], _displayName: [''], recipeId: [''], base_note: [''], formula: [''], unit: ['ml'], type: ['simple'], condition: [''], ingredients: this.fb.array([]) })); }
  addIngredient(conIndex: number) { this.getIngredients(conIndex).push(this.fb.group({ name: ['', Validators.required], _displayName: ['', Validators.required], amount: [0, Validators.required], unit: ['ml', Validators.required] })); }
}
