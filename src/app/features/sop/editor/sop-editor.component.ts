
import { Component, inject, signal, effect, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormArray, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SopService } from '../services/sop.service';
import { StateService } from '../../../core/services/state.service';
import { ToastService } from '../../../core/services/toast.service';
import { CalculatorService } from '../../../core/services/calculator.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { InventoryService } from '../../inventory/inventory.service';
import { Sop, CalculatedItem } from '../../../core/models/sop.model';
import { UNIT_OPTIONS, formatNum, formatDate } from '../../../shared/utils/utils';
import { debounceTime } from 'rxjs/operators';

// 1. Updated Standard Dictionary with common variables from NAFI6 SOPs
const STANDARD_VARS = [
    // Common Variables (Biến tính toán)
    { value: 'total_n', label: 'Biến: Tổng số mẫu (n_sample + n_qc)' },
    { value: 'total_vol_solvent', label: 'Biến: Tổng thể tích dung môi (mL)' },
    { value: 'v_extract', label: 'Biến: Thể tích dịch chiết (mL)' },
    // ... (Keep existing Standard Vars if needed or import)
];

@Component({
  selector: 'app-sop-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="h-full flex flex-col bg-slate-100 fade-in text-slate-800 relative">
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
                       
                       <!-- Editable Version Input -->
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
                @if(currentId()) { 
                    <button (click)="viewHistory()" class="px-3 py-1.5 text-slate-500 hover:bg-slate-100 rounded border border-slate-200 text-xs font-bold transition flex items-center gap-2" title="Xem lịch sử phiên bản">
                        <i class="fa-solid fa-clock-rotate-left"></i> <span class="hidden md:inline">Lịch sử</span>
                    </button>
                    <button (click)="deleteCurrent()" [disabled]="isLoading()" class="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-100 text-xs font-bold transition disabled:opacity-50 disabled:cursor-not-allowed">
                        <i class="fa-solid fa-trash"></i> Xóa
                    </button> 
                }
                <button (click)="save()" [disabled]="isLoading()" class="px-4 py-1.5 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 text-sm font-bold transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    @if(isLoading()) { <i class="fa-solid fa-spinner fa-spin"></i> }
                    @else { <i class="fa-solid fa-floppy-disk"></i> }
                    <span>Lưu Quy Trình</span>
                </button>
            </div>
        </div>

        <!-- Split View Layout -->
        <div class="flex-1 flex overflow-hidden relative">
            @if(isLoading()) {
                <div class="absolute inset-0 bg-white/50 z-50 cursor-wait"></div>
            }
            
            <!-- LEFT COLUMN: Editor (Scrollable) -->
            <div class="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden border-r border-slate-200">
                <!-- Tabs -->
                <div class="flex bg-white border-b border-slate-200 px-4 gap-6 shrink-0">
                   <button (click)="currentTab.set('general')" class="py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide" 
                           [class]="currentTab() === 'general' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'">
                       <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] border" 
                             [class]="currentTab() === 'general' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-slate-100 border-slate-200'">1</span> 
                       Thông tin & Inputs
                   </button>
                   <button (click)="currentTab.set('logic')" class="py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide" 
                           [class]="currentTab() === 'logic' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-700'">
                       <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] border" 
                             [class]="currentTab() === 'logic' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-slate-100 border-slate-200'">2</span> 
                       Logic & Biến
                   </button>
                   <button (click)="currentTab.set('consumables')" class="py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide" 
                           [class]="currentTab() === 'consumables' ? 'border-orange-600 text-orange-700' : 'border-transparent text-slate-500 hover:text-slate-700'">
                       <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] border" 
                             [class]="currentTab() === 'consumables' ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-slate-100 border-slate-200'">3</span> 
                       Vật tư (Consumables)
                   </button>
                </div>

                <!-- Form Content -->
                <div class="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                   <form [formGroup]="form" class="max-w-3xl mx-auto space-y-6">
                      <!-- SHARED DATALIST FOR ALL VARIABLE INPUTS -->
                      <datalist id="dynamicVariables">
                          @for (core of CORE_INPUTS; track core.var) { <option [value]="core.var">{{core.label}} (Bắt buộc)</option> }
                          @for (std of standardVars; track std.value) { <option [value]="std.value">{{std.label}}</option> }
                          @for (custom of customUserVars(); track custom.value) { <option [value]="custom.value">{{custom.label}}</option> }
                      </datalist>

                      <datalist id="inventoryList">
                          @for (item of state.inventory(); track item.id) {
                              <option [value]="item.id">{{item.name}} ({{item.unit}})</option>
                          }
                      </datalist>

                      <!-- TAB 1: GENERAL -->
                      @if (currentTab() === 'general') {
                          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 fade-in">
                              <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Thông tin cơ bản</h3>
                              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                 <div class="col-span-1 md:col-span-2 space-y-1">
                                     <label class="text-xs font-bold text-slate-500 uppercase">Tên Quy trình <span class="text-red-500">*</span></label>
                                     <input formControlName="name" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" placeholder="VD: Phân tích Fipronil">
                                 </div>
                                 <div class="space-y-1">
                                     <label class="text-xs font-bold text-slate-500 uppercase">Danh mục (Category) <span class="text-red-500">*</span></label>
                                     <input formControlName="category" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" placeholder="VD: GC-MS/MS">
                                 </div>
                                 <div class="space-y-1">
                                     <label class="text-xs font-bold text-slate-500 uppercase">Tài liệu tham chiếu</label>
                                     <input formControlName="ref" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" placeholder="VD: AOAC 2007.01">
                                 </div>
                              </div>
                          </div>

                          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 fade-in">
                             <div class="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                                 <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider">Tham số đầu vào (Inputs)</h3>
                                 <button type="button" (click)="addInput()" class="text-xs bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-bold transition">+ Thêm Input</button>
                             </div>
                             <div formArrayName="inputs" class="space-y-3">
                                @for (inp of inputs.controls; track inp; let i = $index) {
                                   @let isCore = isCoreVar(inp.get('var')?.value);
                                   <div [formGroupName]="i" class="flex gap-2 items-start p-3 bg-slate-50 rounded-lg border border-slate-200 group hover:border-blue-300 transition relative">
                                      <div class="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                                           [class]="isCore ? 'bg-blue-100 text-blue-600 border-blue-200' : 'bg-white text-slate-400'">{{i+1}}</div>
                                      <div class="grid grid-cols-2 md:grid-cols-12 gap-2 flex-1">
                                          <div class="col-span-2 md:col-span-3">
                                              <label class="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Tên Biến @if(isCore) { <i class="fa-solid fa-lock text-[8px] text-orange-400"></i> }</label>
                                              <input formControlName="var" list="dynamicVariables" [readonly]="isCore" [class.bg-slate-100]="isCore" [class.cursor-not-allowed]="isCore" class="w-full p-2 text-xs border border-slate-300 rounded font-mono text-blue-700 focus:border-blue-500 outline-none bg-white">
                                          </div>
                                          <div class="col-span-2 md:col-span-4"><label class="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Nhãn hiển thị</label><input formControlName="label" class="w-full p-2 text-xs border border-slate-300 rounded focus:border-blue-500 outline-none"></div>
                                          <div class="col-span-1 md:col-span-2"><label class="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Loại</label><select formControlName="type" class="w-full p-2 text-xs border border-slate-300 rounded bg-white outline-none"><option value="number">Số</option><option value="checkbox">Bật/Tắt</option></select></div>
                                          <div class="col-span-1 md:col-span-2"><label class="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Mặc định</label><input formControlName="default" type="number" class="w-full p-2 text-xs border border-slate-300 rounded text-center outline-none font-bold"></div>
                                          <div class="col-span-1 md:col-span-1"><label class="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Đơn vị</label><input formControlName="unitLabel" class="w-full p-2 text-xs border border-slate-300 rounded text-center outline-none bg-white"></div>
                                      </div>
                                      @if(!isCore) { <button type="button" (click)="inputs.removeAt(i)" class="absolute -top-2 -right-2 w-6 h-6 bg-white border border-red-200 text-red-500 hover:bg-red-50 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition"><i class="fa-solid fa-times text-xs"></i></button> }
                                   </div>
                                }
                             </div>
                          </div>
                      }
                      
                      <!-- TAB 2: LOGIC -->
                      @if (currentTab() === 'logic') {
                          <!-- (Same logic UI as previous) -->
                          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 fade-in">
                             <div class="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                                 <div><h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider">Biến Trung Gian</h3><p class="text-[10px] text-slate-500">Dùng để tính toán các giá trị dùng chung.</p></div>
                                 <button type="button" (click)="addVariable()" class="text-xs bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 px-3 py-1.5 rounded-lg font-bold transition">+ Thêm Biến</button>
                             </div>
                             <div formArrayName="variablesList" class="space-y-3">
                                @for (v of variablesList.controls; track v; let i = $index) {
                                   <div [formGroupName]="i" class="flex items-center gap-3 p-3 bg-purple-50/50 border border-purple-100 rounded-lg group hover:border-purple-300 transition">
                                      <div class="w-1/3"><label class="text-[9px] uppercase font-bold text-purple-400 block mb-0.5 ml-1">Tên Biến</label><input formControlName="key" list="dynamicVariables" class="w-full p-2 text-sm border border-slate-300 rounded font-mono font-bold text-purple-800 focus:ring-1 focus:ring-purple-500 outline-none"></div>
                                      <div class="pb-2 pt-5 text-slate-400"><i class="fa-solid fa-equals"></i></div>
                                      <div class="flex-1"><label class="text-[9px] uppercase font-bold text-purple-400 block mb-0.5 ml-1">Công thức</label><input formControlName="formula" class="w-full p-2 text-sm border border-slate-300 rounded font-mono text-slate-700 focus:ring-1 focus:ring-purple-500 outline-none"></div>
                                      <div class="pt-5"><button type="button" (click)="variablesList.removeAt(i)" class="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-white rounded-full transition"><i class="fa-solid fa-trash-can"></i></button></div>
                                   </div>
                                }
                             </div>
                          </div>
                      }
                      
                      <!-- TAB 3: CONSUMABLES -->
                      @if (currentTab() === 'consumables') {
                          <!-- (Same consumables UI as previous) -->
                          <div class="fade-in">
                             <div class="flex items-center justify-between mb-4">
                                 <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                     Danh sách Vật tư <span class="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded-full">{{consumables.length}}</span>
                                 </h3>
                                 <button type="button" (click)="addConsumable()" class="text-xs bg-slate-800 text-white hover:bg-slate-700 px-4 py-2 rounded-lg font-bold transition shadow-lg shadow-slate-300/50">+ Thêm Dòng</button>
                             </div>
                             <div formArrayName="consumables" class="space-y-4">
                                @for (con of consumables.controls; track con; let i = $index) {
                                   <div [formGroupName]="i" class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden group transition hover:shadow-md hover:border-blue-300 relative">
                                      <div class="bg-slate-50 p-3 flex items-center gap-3 border-b border-slate-100">
                                         <div class="w-6 h-6 rounded bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold">{{i+1}}</div>
                                         <select formControlName="type" class="text-[10px] font-bold uppercase bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-blue-500 cursor-pointer">
                                             <option value="simple">Đơn</option>
                                             <option value="composite">Hỗn hợp</option>
                                         </select>
                                         <div class="flex-1 relative group/input">
                                             <i class="fa-solid fa-magnifying-glass absolute left-2 top-2 text-slate-300 text-xs"></i>
                                             <input formControlName="name" list="inventoryList" (change)="onConsumableNameChange(i, $event)"
                                                    placeholder="Nhập tên hoặc chọn từ kho..." 
                                                    class="w-full pl-7 pr-3 py-1 bg-transparent border-none focus:ring-0 font-bold text-slate-700 placeholder-slate-400 text-sm">
                                             @if(isMissingInventory(con.get('name')?.value)) {
                                                 <div class="absolute right-0 top-0 bottom-0 flex items-center pr-2">
                                                     <button type="button" (click)="quickCreateInventory(con.get('name')?.value)" 
                                                             class="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded border border-red-200 hover:bg-red-200 transition font-bold"
                                                             title="Mã này chưa có trong kho. Click để tạo nhanh!">
                                                         <i class="fa-solid fa-plus-circle"></i> Tạo trong Kho
                                                     </button>
                                                 </div>
                                             }
                                         </div>
                                         <button type="button" (click)="consumables.removeAt(i)" class="text-slate-300 hover:text-red-600 px-2 transition"><i class="fa-solid fa-trash"></i></button>
                                      </div>
                                      <div class="p-4 grid gap-4">
                                         <div class="flex gap-3">
                                            <div class="flex-1">
                                                <label class="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Công thức tổng</label>
                                                <div class="relative">
                                                    <input formControlName="formula" placeholder="VD: total_vol * 0.5" class="w-full pl-3 pr-8 py-2 text-sm border border-slate-300 rounded-lg font-mono text-blue-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none">
                                                    <span class="absolute right-3 top-2.5 text-slate-400 text-xs"><i class="fa-solid fa-calculator"></i></span>
                                                </div>
                                            </div>
                                            <div class="w-24">
                                                <label class="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Đơn vị</label>
                                                <select formControlName="unit" class="w-full py-2 pl-2 pr-6 text-sm border border-slate-300 rounded-lg outline-none bg-white appearance-none">
                                                    @for (opt of unitOptions; track opt.value) { <option [value]="opt.value">{{opt.value}}</option> }
                                                </select>
                                            </div>
                                         </div>
                                         
                                         <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                             <div>
                                                 <div class="flex items-center gap-2 mb-0.5"><label class="text-[9px] uppercase font-bold text-slate-400">Ghi chú / Mô tả (Base Note)</label></div>
                                                 <input formControlName="base_note" placeholder="VD: 99.9% trong dung môi" class="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-medium text-slate-600 focus:border-blue-500 outline-none">
                                             </div>
                                             <div>
                                                 <div class="flex items-center gap-2 mb-0.5"><label class="text-[9px] uppercase font-bold text-slate-400">Điều kiện (Optional)</label></div>
                                                 <input formControlName="condition" placeholder="VD: use_b2 == true" class="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono text-purple-600 focus:border-purple-500 outline-none">
                                             </div>
                                         </div>

                                         @if (con.get('type')?.value === 'composite') {
                                            <div class="mt-2 bg-slate-50 rounded-lg border border-slate-200 p-3">
                                               <div class="flex justify-between items-center mb-2 border-b border-slate-200 pb-2">
                                                   <span class="text-xs font-bold text-slate-700 flex items-center gap-2"><i class="fa-solid fa-layer-group text-blue-500"></i> Thành phần con</span>
                                                   <button type="button" (click)="addIngredient(i)" class="text-[10px] bg-white border border-slate-300 hover:bg-blue-50 text-slate-600 px-2 py-1 rounded font-bold transition">+ Thêm chất</button>
                                               </div>
                                               <div formArrayName="ingredients" class="space-y-2">
                                                  @for (ing of getIngredients(i).controls; track ing; let j = $index) {
                                                     <div [formGroupName]="j" class="flex gap-2 items-center">
                                                        <select formControlName="name" (change)="onIngredientNameChange(i, j, $event)" class="flex-1 border border-slate-300 rounded px-2 py-1.5 text-xs outline-none focus:border-blue-500 bg-white shadow-sm">
                                                            <option value="" disabled>-- Chọn từ kho --</option>
                                                            @for (item of state.inventory(); track item.id) { <option [value]="item.id">{{item.name}} ({{item.unit}})</option> }
                                                        </select>
                                                        <input formControlName="amount" type="number" placeholder="Lượng" class="w-16 border border-slate-300 rounded px-1 py-1.5 text-xs text-center outline-none focus:border-blue-500 font-bold">
                                                        <select formControlName="unit" class="w-16 border border-slate-300 rounded px-1 py-1.5 text-xs text-center outline-none bg-white">
                                                            @for (opt of unitOptions; track opt.value) { <option [value]="opt.value">{{opt.value}}</option> }
                                                        </select>
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

            <!-- RIGHT COLUMN: Assistant & Live Preview -->
            <!-- ... (Keeping existing template for Assistant) ... -->
            <div class="w-96 bg-white border-l border-slate-200 flex flex-col shrink-0 shadow-xl z-20">
                <!-- Preview Code is mostly same, just checking bindings -->
                <div class="h-1/3 flex flex-col overflow-hidden min-h-0 bg-slate-50 border-b border-slate-200">
                    <div class="p-3 border-b border-slate-200 bg-white shrink-0 flex items-center justify-between">
                        <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2"><i class="fa-solid fa-book-open text-blue-500"></i> Từ điển Biến</h4>
                        <span class="text-[10px] text-slate-400">Click để chèn</span>
                    </div>
                    <div class="flex-1 overflow-y-auto p-3">
                        <div class="mb-4">
                           <div class="text-[10px] font-bold text-slate-400 mb-2 uppercase">Inputs (Đầu vào)</div>
                           <div class="flex flex-wrap gap-2">
                              @for (v of availableInputs(); track v) { 
                                  <button (click)="insertVariable(v)" class="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition shadow-sm">{{v}}</button> 
                              }
                           </div>
                        </div>
                        <div>
                           <div class="text-[10px] font-bold text-slate-400 mb-2 uppercase">Variables (Logic)</div>
                           <div class="flex flex-wrap gap-2">
                              @for (v of availableVars(); track v) { 
                                  <button (click)="insertVariable(v)" class="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition shadow-sm">{{v}}</button> 
                              }
                           </div>
                        </div>
                    </div>
                </div>

                <!-- Live Preview -->
                <div class="flex-1 flex flex-col bg-white">
                    <div class="p-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                        <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                            <i class="fa-solid fa-eye text-emerald-500"></i> Xem trước Kết quả
                        </h4>
                        <span class="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">Auto-calc</span>
                    </div>
                    <div class="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                         @if (previewError()) { 
                             <div class="p-3 bg-red-50 border border-red-100 rounded text-xs text-red-600 flex items-start gap-2 animate-bounce-in">
                                 <i class="fa-solid fa-circle-exclamation mt-0.5"></i>
                                 <div><b>Lỗi công thức:</b><br>Vui lòng kiểm tra cú pháp JS.</div>
                             </div>
                         } 
                         @else if (previewResults().length > 0) {
                             @for (item of previewResults(); track item.name) {
                                <div class="border-b border-slate-100 last:border-0 pb-2">
                                   <div class="flex justify-between items-start">
                                      <div class="font-medium text-xs text-slate-700 pr-2 break-words max-w-[180px]">{{resolveName(item.name)}}</div>
                                      <div class="font-bold text-sm text-blue-600 whitespace-nowrap">{{formatNum(item.stockNeed)}} <span class="text-[10px] text-slate-400">{{item.stockUnit}}</span></div>
                                   </div>
                                   @if(item.isComposite) {
                                      <div class="mt-1 pl-2 border-l-2 border-slate-100 ml-1">
                                         @for(sub of item.breakdown; track sub.name) {
                                             <div class="flex justify-between text-[10px]">
                                                 <span class="text-slate-500">{{resolveName(sub.name)}}</span>
                                                 <span class="font-bold text-slate-700">{{formatNum(sub.totalNeed)}} {{sub.stockUnit}}</span>
                                             </div>
                                         }
                                      </div>
                                   }
                                </div>
                             }
                         } @else {
                             <div class="text-center py-8 opacity-40"><i class="fa-solid fa-calculator text-3xl mb-2 text-slate-300"></i><p class="text-xs text-slate-500">Nhập công thức để xem kết quả</p></div>
                         }
                    </div>
                </div>
            </div>
        </div>

        <!-- History Modal (Same as before) -->
        @if (showHistoryModal()) {
            <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
                    <div class="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 class="font-bold text-slate-800">Lịch sử Phiên bản</h3>
                        <button (click)="showHistoryModal.set(false)" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-times"></i></button>
                    </div>
                    <div class="flex-1 overflow-y-auto p-2">
                        @for(v of historyItems(); track v.version) {
                            <div class="p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition rounded-lg">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <span class="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold mb-1">v{{v.version}}</span>
                                        <div class="text-sm font-medium text-slate-700">{{v.name}}</div>
                                        <div class="text-[10px] text-slate-400 mt-1">
                                            Archived: {{formatDate(v.archivedAt)}}
                                        </div>
                                    </div>
                                    <div class="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-mono">
                                        {{v.consumables.length}} items
                                    </div>
                                </div>
                            </div>
                        } @empty {
                            <div class="p-8 text-center text-slate-400 italic text-sm">Chưa có lịch sử phiên bản nào.</div>
                        }
                    </div>
                </div>
            </div>
        }
    </div>
  `
})
export class SopEditorComponent {
  state = inject(StateService);
  sopService = inject(SopService);
  invService = inject(InventoryService); // For Quick Create
  toast = inject(ToastService);
  confirmationService = inject(ConfirmationService);
  calcService = inject(CalculatorService);
  router: Router = inject(Router);
  fb: FormBuilder = inject(FormBuilder);
  
  // OUTPUTS REMOVED - using State
  // INPUTS REMOVED - using State

  sopSaved = output<Sop>();
  cancelEdit = output<void>();

  unitOptions = UNIT_OPTIONS;
  standardVars = STANDARD_VARS; // Expose to template
  
  currentId = signal<string | null>(null);
  currentVersion = signal<number>(1);
  currentTab = signal<'general' | 'logic' | 'consumables'>('general');
  formatNum = formatNum;
  formatDate = formatDate;
  isLoading = signal(false);
  
  // History State
  showHistoryModal = signal(false);
  historyItems = signal<Sop[]>([]);
  
  availableInputs = signal<string[]>([]);
  availableVars = signal<string[]>([]);
  
  // Computed list for Dynamic User Vars (Real-time updates)
  customUserVars = signal<{value: string, label: string}[]>([]);

  previewResults = signal<CalculatedItem[]>([]);
  previewError = signal<boolean>(false);
  activeInput = signal<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // Mandatory Inputs Configuration
  readonly CORE_INPUTS = [
      { var: 'n_sample', label: 'Số lượng mẫu', type: 'number', default: 1, step: 1, unitLabel: 'mẫu' },
      { var: 'n_qc', label: 'Số lượng QC', type: 'number', default: 8, step: 1, unitLabel: 'mẫu' },
      { var: 'w_sample', label: 'Khối lượng mẫu', type: 'number', default: 10, step: 0.1, unitLabel: 'g' }
  ];

  form = this.fb.group({
    id: [''], category: ['', Validators.required], name: ['', Validators.required], ref: [''],
    version: [1, [Validators.required, Validators.min(1)]],
    inputs: this.fb.array([]), variablesList: this.fb.array([]), consumables: this.fb.array([])
  });

  constructor() {
    effect((onCleanup) => {
      // LISTEN TO STATE
      const sop = this.state.editingSop();
      
      if (sop) {
          if (sop.id) {
              this.loadSop(sop); 
          } else {
              this.loadSop(sop); // Loading a copy
              this.currentId.set(null); 
              this.currentVersion.set(1); 
              this.form.patchValue({ id: '', version: 1 }); 
          }
      } else {
          this.createNew();
      }
      
      const sub = this.form.valueChanges.pipe(debounceTime(300)).subscribe(val => { 
          this.updateDictionaries(val); 
          this.runPreview(val); 
      });
      onCleanup(() => sub.unsubscribe());
    });
  }

  get inputs() { return this.form.get('inputs') as FormArray; }
  get variablesList() { return this.form.get('variablesList') as FormArray; }
  get consumables() { return this.form.get('consumables') as FormArray; }
  getIngredients(conIndex: number): FormArray { return this.consumables.at(conIndex).get('ingredients') as FormArray; }

  // --- Logic for Reverse Edit / Sync ---

  isMissingInventory(id: string): boolean {
      if (!id || id.trim() === '') return false;
      return !this.state.inventoryMap()[id];
  }

  async quickCreateInventory(id: string) {
      if (!id) return;
      const confirmed = await this.confirmationService.confirm({
          message: `Hóa chất/Vật tư mã "${id}" chưa có trong kho. Bạn muốn tạo nhanh không?`,
          confirmText: 'Tạo Nhanh',
          isDangerous: false
      });
      if (confirmed) {
          this.isLoading.set(true);
          try {
              // Create basic item
              await this.invService.upsertItem({
                  id: id,
                  name: id, // Default name = ID
                  category: 'reagent',
                  stock: 0,
                  unit: 'ml', // Default unit
                  threshold: 10
              }, true);
              this.toast.show(`Đã tạo "${id}" trong kho. Vui lòng cập nhật chi tiết sau.`, 'success');
          } catch (e) {
              this.toast.show('Lỗi tạo nhanh', 'error');
          } finally {
              this.isLoading.set(false);
          }
      }
  }

  // Auto-fill Unit when user selects from Inventory (SOP -> Inventory Sync Logic for Unit)
  onConsumableNameChange(index: number, event: any) {
      const val = event.target.value;
      const inventoryItem = this.state.inventoryMap()[val];
      if (inventoryItem) {
          this.consumables.at(index).patchValue({ unit: inventoryItem.unit });
      }
  }

  onIngredientNameChange(conIndex: number, ingIndex: number, event: any) {
      const val = event.target.value; // For <select>, value is the bound value (ID)
      const inventoryItem = this.state.inventoryMap()[val];
      if (inventoryItem) {
          this.getIngredients(conIndex).at(ingIndex).patchValue({ unit: inventoryItem.unit });
      }
  }

  // --- Focus Tracking & Insertion ---
  onFocusIn(event: FocusEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        this.activeInput.set(target as any);
    }
  }

  insertVariable(text: string) {
    const el = this.activeInput();
    if (el) {
        const start = el.selectionStart || 0;
        const end = el.selectionEnd || 0;
        const val = el.value;
        const newVal = val.substring(0, start) + text + val.substring(end);
        el.value = newVal;
        el.selectionStart = el.selectionEnd = start + text.length;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.focus();
    } else {
        navigator.clipboard.writeText(text);
        this.toast.show(`Đã copy "${text}" (Chọn ô nhập để chèn trực tiếp)`);
    }
  }

  isCoreVar(varName: string): boolean {
      return ['n_sample', 'n_qc', 'w_sample'].includes(varName);
  }

  createNew() {
    this.currentId.set(null); this.currentVersion.set(1); this.currentTab.set('general');
    this.form.reset({ id: '', category: '', name: '', ref: '', version: 1 });
    this.inputs.clear(); 
    this.variablesList.clear(); 
    this.consumables.clear();
    
    // Add Mandatory Inputs automatically
    this.CORE_INPUTS.forEach(ci => {
        this.addInputRaw(ci.var, ci.label, ci.default, ci.type as any, ci.step, ci.unitLabel);
    });
    
    this.previewResults.set([]);
  }

  loadSop(sop: Sop) {
    if (sop.id) this.currentId.set(sop.id);
    this.currentVersion.set(sop.version || 1); 
    this.currentTab.set('general');
    this.form.patchValue({ 
        id: sop.id, 
        category: sop.category, 
        name: sop.name, 
        ref: sop.ref,
        version: sop.version || 1 
    });
    
    this.inputs.clear(); 
    
    // 1. Load existing inputs
    const loadedVars = new Set<string>();
    sop.inputs.forEach(i => {
        this.addInputRaw(i.var, i.label, i.default, i.type, i.step, i.unitLabel);
        loadedVars.add(i.var);
    });

    // 2. Ensure Core Inputs exist (if missing from old data)
    this.CORE_INPUTS.forEach(ci => {
        if (!loadedVars.has(ci.var)) {
            this.addInputRaw(ci.var, ci.label, ci.default, ci.type as any, ci.step, ci.unitLabel);
        }
    });

    this.variablesList.clear();
    if (sop.variables) Object.entries(sop.variables).forEach(([k, v]) => this.variablesList.push(this.fb.group({ key: [k, Validators.required], formula: [v, Validators.required] })));
    this.consumables.clear();
    sop.consumables.forEach(c => {
      // Added base_note: [c.base_note || '']
      const g = this.fb.group({ name: [c.name || ''], base_note: [c.base_note || ''], formula: [c.formula || ''], unit: [c.unit || ''], type: [c.type || 'simple'], condition: [c.condition || ''], ingredients: this.fb.array([]) });
      if (c.ingredients) c.ingredients.forEach(ing => (g.get('ingredients') as FormArray).push(this.fb.group({ name: [ing.name, Validators.required], amount: [ing.amount, Validators.required], unit: [ing.unit, Validators.required] })));
      this.consumables.push(g);
    });
    this.updateDictionaries(this.form.value); this.runPreview(this.form.value);
  }

  updateDictionaries(formVal: any) {
     // Helper for unique filter
     const seen = new Set<string>();
     
     // 1. Inputs defined by user
     const inps = (formVal.inputs || [])
        .map((i: any) => ({ value: i.var, label: i.label || 'Input' }))
        .filter((i: any) => !!i.value && !this.isCoreVar(i.value)); // Exclude core to avoid dupes

     // 2. Calculated variables defined by user
     const calcVars = (formVal.variablesList || [])
        .map((v: any) => ({ value: v.key, label: 'Biến tính toán' }))
        .filter((v: any) => !!v.value);

     // Combine & Deduplicate
     const combined = [...inps, ...calcVars].filter(item => {
         if (seen.has(item.value)) return false;
         seen.add(item.value);
         return true;
     });

     this.customUserVars.set(combined);

     // Update legacy signals for sidebar assistant
     this.availableInputs.set((formVal.inputs || []).map((i: any) => i.var).filter((v: any) => !!v));
     this.availableVars.set((formVal.variablesList || []).map((v: any) => v.key).filter((k: any) => !!k));
  }

  runPreview(formVal: any) {
    try {
        const mockInputs: Record<string, any> = {};
        (formVal.inputs || []).forEach((i: any) => { if(i.var) mockInputs[i.var] = i.default; });
        
        const variables: Record<string, string> = {};
        (formVal.variablesList as any[]).forEach(v => { if (v.key && v.formula) variables[v.key] = v.formula; });
        
        const tempSop: Sop = { 
            id: 'preview', category: 'p', name: 'P', 
            inputs: formVal.inputs, 
            variables: variables, 
            consumables: (formVal.consumables as any[]).map(c => ({
                ...c,
                ingredients: c.ingredients || []
            }))
        };
        
        const results = this.calcService.calculateSopNeeds(tempSop, mockInputs, 0); 
        this.previewResults.set(results); 
        this.previewError.set(false);
    } catch (e) { 
        this.previewError.set(true); 
    }
  }

  resolveName(id: string): string { return this.state.inventoryMap()[id]?.name || id; }

  async save() {
    this.isLoading.set(true);
    let formVal = this.form.value;
    if (!formVal.id) { this.form.patchValue({ id: `sop_${Date.now()}` }); formVal = this.form.value; }
    
    if (this.form.invalid) { 
        this.form.markAllAsTouched(); 
        this.toast.show('Kiểm tra các trường bắt buộc!', 'error'); 
        this.isLoading.set(false);
        return; 
    }
    
    const variables: Record<string, string> = {};
    (formVal.variablesList as any[]).forEach(v => { if (v.key && v.formula) variables[v.key] = v.formula; });
    
    const sop: Sop = {
      id: formVal.id!, category: formVal.category!, name: formVal.name!, ref: formVal.ref || '',
      inputs: (formVal.inputs as any[]).map(i => ({...i})), variables: variables,
      // Include base_note in saved object
      consumables: (formVal.consumables as any[]).map((c: any) => ({ 
          name: c.name, base_note: c.base_note, formula: c.formula, unit: c.unit, type: c.type, 
          condition: c.condition, ingredients: c.ingredients 
      })),
      version: formVal.version || this.currentVersion() // Use form value for version
    };
    
    try { 
        await this.sopService.saveSop(sop); 
        this.toast.show('Đã lưu quy trình thành công!'); 
        this.state.selectedSop.set(sop); // Set active
        this.state.editingSop.set(null); // Clear editing state
        this.router.navigate(['/calculator']); // Go to calculator
    } catch(e) { 
        this.toast.show('Lỗi lưu SOP', 'error'); 
    } finally {
        this.isLoading.set(false);
    }
  }

  goBack() {
      this.state.editingSop.set(null);
      this.router.navigate(['/calculator']);
  }

  async viewHistory() {
      const id = this.currentId();
      if (!id) return;
      this.isLoading.set(true);
      try {
          const items = await this.sopService.getSopHistory(id);
          this.historyItems.set(items);
          this.showHistoryModal.set(true);
      } catch (e) {
          this.toast.show('Lỗi tải lịch sử', 'error');
      } finally {
          this.isLoading.set(false);
      }
  }

  async deleteCurrent() {
    if (this.currentId()) {
        const confirmed = await this.confirmationService.confirm({ message: 'Xóa SOP này?', confirmText: 'Xóa', isDangerous: true });
        if (confirmed) {
            this.isLoading.set(true);
            try {
                await this.sopService.deleteSop(this.currentId()!); 
                this.toast.show('Đã xóa SOP'); 
                this.createNew(); 
                this.goBack();
            } finally {
                this.isLoading.set(false);
            }
        }
    }
  }

  addInput() { this.addInputRaw('', '', 0, 'number', 1, ''); }
  private addInputRaw(v: string, l: string, d: any, t: 'number'|'checkbox', s: any, u: string | undefined) { this.inputs.push(this.fb.group({ var: [v, Validators.required], label: [l, Validators.required], default: [d], type: [t], step: [s], unitLabel: [u] })); }
  addVariable() { this.variablesList.push(this.fb.group({ key: ['', Validators.required], formula: ['', Validators.required] })); }
  // Added base_note: [''] to new consumables
  addConsumable() { this.consumables.push(this.fb.group({ name: [''], base_note: [''], formula: [''], unit: ['ml'], type: ['simple'], condition: [''], ingredients: this.fb.array([]) })); }
  addIngredient(conIndex: number) { this.getIngredients(conIndex).push(this.fb.group({ name: ['', Validators.required], amount: [0, Validators.required], unit: ['ml', Validators.required] })); }
}