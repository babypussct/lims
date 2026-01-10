
import { Component, inject, signal, effect, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { SopService } from '../services/sop.service';
import { StateService } from '../services/state.service';
import { ToastService } from '../services/toast.service';
import { CalculatorService } from '../services/calculator.service';
import { Sop, CalculatedItem } from '../models/sop.model';
import { UNIT_OPTIONS, formatNum } from '../utils/utils';
import { ConfirmationService } from '../services/confirmation.service';

@Component({
  selector: 'app-sop-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="h-full flex flex-col bg-slate-50 fade-in text-slate-800">
        
        <!-- Top Toolbar -->
        <div class="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-30">
            <div class="flex items-center gap-4">
                <button (click)="cancelEdit.emit()" class="text-slate-500 hover:text-slate-800 text-sm font-bold flex items-center gap-2 transition">
                    <i class="fa-solid fa-arrow-left"></i> <span class="hidden md:inline">Quay lại</span>
                </button>
                <div class="h-6 w-px bg-slate-200"></div>
                <div>
                   <h2 class="text-base font-bold text-slate-800 flex items-center gap-2 leading-none">
                       {{ form.get('name')?.value || 'Quy trình Mới' }}
                   </h2>
                   <div class="text-[10px] text-slate-400 font-mono mt-1 flex gap-2">
                      <span>ID: {{ form.get('id')?.value || 'Pending...' }}</span>
                      @if(currentVersion() > 1) { <span>v{{currentVersion()}}</span> }
                   </div>
                </div>
            </div>

            <div class="flex gap-2">
                @if(currentId()) {
                    <button (click)="deleteCurrent()" class="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-100 text-xs font-bold transition">
                        <i class="fa-solid fa-trash"></i> Xóa
                    </button>
                }
                <button (click)="save()"
                        class="px-4 py-1.5 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 text-sm font-bold transition flex items-center gap-2">
                    <i class="fa-solid fa-floppy-disk"></i> Lưu Quy Trình
                </button>
            </div>
        </div>

        <!-- Main Content Area (Split View) -->
        <div class="flex-1 flex overflow-hidden">
            
            <!-- LEFT: Editor Area (Tabs) -->
            <div class="flex-1 flex flex-col min-w-0 bg-slate-100">
                
                <!-- Tab Navigation -->
                <div class="flex bg-white border-b border-slate-200 px-4 gap-6 shrink-0">
                   <button (click)="currentTab.set('general')" 
                           class="py-3 text-sm font-bold border-b-2 transition flex items-center gap-2"
                           [class]="currentTab() === 'general' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'">
                       <span class="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] border border-slate-200"
                             [class.bg-blue-100]="currentTab() === 'general'" [class.text-blue-700]="currentTab() === 'general'">1</span>
                       Thông tin & Inputs
                   </button>
                   <button (click)="currentTab.set('logic')"
                           class="py-3 text-sm font-bold border-b-2 transition flex items-center gap-2"
                           [class]="currentTab() === 'logic' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-700'">
                       <span class="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] border border-slate-200"
                             [class.bg-purple-100]="currentTab() === 'logic'" [class.text-purple-700]="currentTab() === 'logic'">2</span>
                       Logic & Biến
                   </button>
                   <button (click)="currentTab.set('consumables')"
                           class="py-3 text-sm font-bold border-b-2 transition flex items-center gap-2"
                           [class]="currentTab() === 'consumables' ? 'border-orange-600 text-orange-700' : 'border-transparent text-slate-500 hover:text-slate-700'">
                       <span class="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] border border-slate-200"
                             [class.bg-orange-100]="currentTab() === 'consumables'" [class.text-orange-700]="currentTab() === 'consumables'">3</span>
                       Vật tư (Consumables)
                   </button>
                </div>

                <!-- Scrollable Form Area -->
                <div class="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                   <form [formGroup]="form" class="max-w-4xl mx-auto space-y-6">
                      
                      <!-- TAB 1: GENERAL & INPUTS -->
                      @if (currentTab() === 'general') {
                          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 fade-in">
                              <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                                  Thông tin cơ bản
                              </h3>
                              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                 <div class="col-span-1 md:col-span-2 space-y-1">
                                    <label class="text-xs font-bold text-slate-500 uppercase">Tên Quy trình <span class="text-red-500">*</span></label>
                                    <input formControlName="name" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" placeholder="VD: Phân tích Fipronil trên nền trứng">
                                 </div>
                                 <div class="space-y-1">
                                    <label class="text-xs font-bold text-slate-500 uppercase">Danh mục (Category) <span class="text-red-500">*</span></label>
                                    <input formControlName="category" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" placeholder="VD: GC-MS/MS, Elisa...">
                                 </div>
                                 <div class="space-y-1">
                                    <label class="text-xs font-bold text-slate-500 uppercase">Tài liệu tham chiếu</label>
                                    <input formControlName="ref" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" placeholder="VD: AOAC 2007.01">
                                 </div>
                              </div>
                          </div>

                          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 fade-in">
                             <div class="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                                <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider">
                                    Tham số đầu vào (Inputs)
                                </h3>
                                <button type="button" (click)="addInput()" class="text-xs bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-bold transition">
                                   + Thêm Input
                                </button>
                             </div>
                             
                             <div formArrayName="inputs" class="space-y-3">
                                @for (inp of inputs.controls; track inp; let i = $index) {
                                   <div [formGroupName]="i" class="flex gap-2 items-start p-3 bg-slate-50 rounded-lg border border-slate-200 group hover:border-blue-300 transition relative">
                                      <div class="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0 mt-0.5">
                                        {{i+1}}
                                      </div>
                                      
                                      <div class="grid grid-cols-2 md:grid-cols-12 gap-2 flex-1">
                                          <div class="col-span-2 md:col-span-3">
                                              <label class="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Tên Biến (Var)</label>
                                              <input formControlName="var" placeholder="n_sample" class="w-full p-2 text-xs border border-slate-300 rounded font-mono text-blue-700 focus:border-blue-500 outline-none bg-white">
                                          </div>
                                          <div class="col-span-2 md:col-span-4">
                                              <label class="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Nhãn hiển thị</label>
                                              <input formControlName="label" placeholder="VD: Số lượng mẫu" class="w-full p-2 text-xs border border-slate-300 rounded focus:border-blue-500 outline-none">
                                          </div>
                                          <div class="col-span-1 md:col-span-2">
                                              <label class="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Loại</label>
                                              <select formControlName="type" class="w-full p-2 text-xs border border-slate-300 rounded bg-white outline-none">
                                                  <option value="number">Số (Number)</option>
                                                  <option value="checkbox">Bật/Tắt</option>
                                              </select>
                                          </div>
                                          <div class="col-span-1 md:col-span-2">
                                              <label class="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Mặc định</label>
                                              <input formControlName="default" type="number" class="w-full p-2 text-xs border border-slate-300 rounded text-center outline-none font-bold">
                                          </div>
                                          <div class="col-span-1 md:col-span-1">
                                              <label class="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Đơn vị</label>
                                              <input formControlName="unitLabel" placeholder="g" class="w-full p-2 text-xs border border-slate-300 rounded text-center outline-none bg-white">
                                          </div>
                                      </div>

                                      <button type="button" (click)="inputs.removeAt(i)" class="absolute -top-2 -right-2 w-6 h-6 bg-white border border-red-200 text-red-500 hover:bg-red-50 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition">
                                          <i class="fa-solid fa-times text-xs"></i>
                                      </button>
                                   </div>
                                }
                             </div>
                             @if (inputs.length === 0) {
                                <div class="text-center py-6 bg-slate-50 border border-dashed border-slate-300 rounded-lg">
                                   <p class="text-xs text-slate-500">Chưa có tham số đầu vào.</p>
                                </div>
                             }
                          </div>
                      }

                      <!-- TAB 2: LOGIC & VARIABLES -->
                      @if (currentTab() === 'logic') {
                          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 fade-in">
                             <div class="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                                <div>
                                    <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider">
                                        Biến Trung Gian (Calculated Variables)
                                    </h3>
                                    <p class="text-[10px] text-slate-500">Dùng để tính toán các giá trị dùng chung (VD: Tổng thể tích dung môi).</p>
                                </div>
                                <button type="button" (click)="addVariable()" class="text-xs bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 px-3 py-1.5 rounded-lg font-bold transition">
                                   + Thêm Biến
                                </button>
                             </div>

                             <div formArrayName="variablesList" class="space-y-3">
                                @for (v of variablesList.controls; track v; let i = $index) {
                                   <div [formGroupName]="i" class="flex items-center gap-3 p-3 bg-purple-50/50 border border-purple-100 rounded-lg group hover:border-purple-300 transition">
                                      <div class="w-1/3">
                                         <label class="text-[9px] uppercase font-bold text-purple-400 block mb-0.5 ml-1">Tên Biến</label>
                                         <input formControlName="key" placeholder="total_vol" class="w-full p-2 text-sm border border-slate-300 rounded font-mono font-bold text-purple-800 focus:ring-1 focus:ring-purple-500 outline-none">
                                      </div>
                                      <div class="pb-2 pt-5 text-slate-400"><i class="fa-solid fa-equals"></i></div>
                                      <div class="flex-1">
                                         <label class="text-[9px] uppercase font-bold text-purple-400 block mb-0.5 ml-1">Công thức (JavaScript)</label>
                                         <input formControlName="formula" placeholder="(n_sample + n_qc) * 10" class="w-full p-2 text-sm border border-slate-300 rounded font-mono text-slate-700 focus:ring-1 focus:ring-purple-500 outline-none">
                                      </div>
                                      <div class="pt-5">
                                         <button type="button" (click)="variablesList.removeAt(i)" class="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-white rounded-full transition">
                                            <i class="fa-solid fa-trash-can"></i>
                                         </button>
                                      </div>
                                   </div>
                                }
                             </div>
                             @if (variablesList.length === 0) {
                                <div class="text-center py-8 bg-slate-50 border border-dashed border-slate-300 rounded-lg">
                                   <i class="fa-solid fa-calculator text-slate-300 text-2xl mb-2"></i>
                                   <p class="text-xs text-slate-500">Không có biến trung gian.</p>
                                </div>
                             }
                          </div>
                          
                          <!-- Cheat Sheet -->
                          <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-4 text-xs text-blue-800">
                             <h4 class="font-bold mb-2"><i class="fa-solid fa-lightbulb"></i> Hàm hỗ trợ (Chem Helper):</h4>
                             <ul class="space-y-1 font-mono">
                                <li>Chem.dilute(C_stock, C_target, V_target) <span class="text-slate-500">// Pha loãng</span></li>
                                <li>Chem.molarMass(Molarity, MW, Vol_L) <span class="text-slate-500">// Tính khối lượng từ Nồng độ mol</span></li>
                                <li>Math.max(a, b), Math.min(a, b), Math.round(n)</li>
                             </ul>
                          </div>
                      }

                      <!-- TAB 3: CONSUMABLES -->
                      @if (currentTab() === 'consumables') {
                          <div class="fade-in">
                             <div class="flex items-center justify-between mb-4">
                                <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                    Danh sách Vật tư & Hóa chất
                                    <span class="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded-full">{{consumables.length}}</span>
                                </h3>
                                <button type="button" (click)="addConsumable()" class="text-xs bg-slate-800 text-white hover:bg-slate-700 px-4 py-2 rounded-lg font-bold transition shadow-lg shadow-slate-300/50">
                                   + Thêm Dòng Mới
                                </button>
                             </div>

                             <div formArrayName="consumables" class="space-y-4">
                                @for (con of consumables.controls; track con; let i = $index) {
                                   <div [formGroupName]="i" class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden group transition hover:shadow-md hover:border-blue-300">
                                      <!-- Header Bar -->
                                      <div class="bg-slate-50 p-3 flex items-center gap-3 border-b border-slate-100">
                                         <div class="w-6 h-6 rounded bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold">{{i+1}}</div>
                                         
                                         <!-- Type Selector -->
                                         <select formControlName="type" class="text-[10px] font-bold uppercase bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-blue-500 cursor-pointer">
                                            <option value="simple">Đơn (Single)</option>
                                            <option value="composite">Hỗn hợp (Composite)</option>
                                         </select>

                                         <!-- Name Input -->
                                         <div class="flex-1 relative">
                                            <i class="fa-solid fa-tag absolute left-2 top-2 text-slate-300 text-xs"></i>
                                            <input formControlName="name" placeholder="Tên hiển thị trong bảng..." class="w-full pl-7 pr-3 py-1 bg-transparent border-none focus:ring-0 font-bold text-slate-700 placeholder-slate-400 text-sm">
                                         </div>

                                         <button type="button" (click)="consumables.removeAt(i)" class="text-slate-300 hover:text-red-600 px-2 transition" title="Xóa dòng này">
                                            <i class="fa-solid fa-trash"></i>
                                         </button>
                                      </div>

                                      <!-- Body -->
                                      <div class="p-4 grid gap-4">
                                         <!-- Row 1: Formula & Unit -->
                                         <div class="flex gap-3">
                                            <div class="flex-1">
                                               <label class="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Công thức tính tổng lượng</label>
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
                                         
                                         <!-- Row 2: Condition -->
                                         <div>
                                            <div class="flex items-center gap-2 mb-0.5">
                                               <label class="text-[9px] uppercase font-bold text-slate-400">Điều kiện áp dụng (Optional)</label>
                                            </div>
                                            <input formControlName="condition" placeholder="VD: use_b2 == true (Để trống nếu luôn dùng)" class="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono text-purple-600 focus:border-purple-500 outline-none">
                                         </div>

                                         <!-- COMPOSITE INGREDIENTS AREA -->
                                         @if (con.get('type')?.value === 'composite') {
                                            <div class="mt-2 bg-slate-50 rounded-lg border border-slate-200 p-3">
                                               <div class="flex justify-between items-center mb-2 border-b border-slate-200 pb-2">
                                                  <span class="text-xs font-bold text-slate-700 flex items-center gap-2">
                                                     <i class="fa-solid fa-layer-group text-blue-500"></i> Thành phần con
                                                  </span>
                                                  <button type="button" (click)="addIngredient(i)" class="text-[10px] bg-white border border-slate-300 hover:bg-blue-50 text-slate-600 px-2 py-1 rounded font-bold transition">
                                                     + Thêm chất
                                                  </button>
                                               </div>
                                               
                                               <div formArrayName="ingredients" class="space-y-2">
                                                  @for (ing of getIngredients(i).controls; track ing; let j = $index) {
                                                     <div [formGroupName]="j" class="flex gap-2 items-center">
                                                        <!-- Inventory Selector -->
                                                        <select formControlName="name" class="flex-1 border border-slate-300 rounded px-2 py-1.5 text-xs outline-none focus:border-blue-500 bg-white shadow-sm">
                                                            <option value="" disabled>-- Chọn từ kho --</option>
                                                            @for (item of state.inventory(); track item.id) {
                                                               <option [value]="item.id">{{item.name || item.id}} ({{item.unit}})</option>
                                                            }
                                                        </select>

                                                        <input formControlName="amount" type="number" placeholder="Lượng" class="w-16 border border-slate-300 rounded px-1 py-1.5 text-xs text-center outline-none focus:border-blue-500 font-bold">
                                                        
                                                        <select formControlName="unit" class="w-16 border border-slate-300 rounded px-1 py-1.5 text-xs text-center outline-none bg-white">
                                                            @for (opt of unitOptions; track opt.value) { <option [value]="opt.value">{{opt.value}}</option> }
                                                        </select>

                                                        <button type="button" (click)="getIngredients(i).removeAt(j)" class="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-red-500 transition rounded-full hover:bg-white">
                                                           <i class="fa-solid fa-times"></i>
                                                        </button>
                                                     </div>
                                                  }
                                                  @if (getIngredients(i).length === 0) {
                                                     <div class="text-center py-2 text-[10px] text-slate-400 italic">Chưa có thành phần nào.</div>
                                                  }
                                               </div>
                                            </div>
                                         }
                                      </div>
                                   </div>
                                }
                                @if (consumables.length === 0) {
                                   <div class="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                                      <i class="fa-solid fa-flask text-slate-300 text-4xl mb-3"></i>
                                      <p class="text-sm text-slate-500 font-medium">Danh sách vật tư đang trống.</p>
                                      <button type="button" (click)="addConsumable()" class="mt-3 text-blue-600 text-xs font-bold hover:underline">Thêm dòng đầu tiên</button>
                                   </div>
                                }
                             </div>
                          </div>
                      }
                   </form>
                </div>
            </div>

            <!-- RIGHT: Assistant & Preview Panel -->
            <div class="w-80 lg:w-96 bg-white border-l border-slate-200 flex flex-col shrink-0 shadow-xl z-20">
                
                <!-- Section 1: Variable Dictionary -->
                <div class="flex-1 flex flex-col overflow-hidden min-h-0 bg-slate-50">
                    <div class="p-3 border-b border-slate-200 bg-white shrink-0 flex items-center justify-between">
                        <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                           <i class="fa-solid fa-book-open text-blue-500"></i> Từ điển Biến
                        </h4>
                        <span class="text-[10px] text-slate-400">Click để copy</span>
                    </div>
                    
                    <div class="flex-1 overflow-y-auto p-3">
                        <div class="mb-4">
                           <div class="text-[10px] font-bold text-slate-400 mb-2 uppercase">Inputs (Đầu vào)</div>
                           <div class="flex flex-wrap gap-2">
                              @for (v of availableInputs(); track v) {
                                 <button (click)="copyToClipboard(v)" class="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition shadow-sm select-all">
                                    {{v}}
                                 </button>
                              }
                           </div>
                        </div>
                        
                        <div>
                           <div class="text-[10px] font-bold text-slate-400 mb-2 uppercase">Variables (Logic)</div>
                           <div class="flex flex-wrap gap-2">
                              @for (v of availableVars(); track v) {
                                 <button (click)="copyToClipboard(v)" class="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition shadow-sm">
                                    {{v}}
                                 </button>
                              }
                           </div>
                        </div>
                    </div>
                </div>

                <!-- Section 2: Live Preview -->
                <div class="h-1/2 flex flex-col border-t-4 border-slate-200 bg-white">
                    <div class="p-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                        <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                           <i class="fa-solid fa-eye text-emerald-500"></i> Xem trước Kết quả
                        </h4>
                        <span class="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">Auto-calc</span>
                    </div>

                    <div class="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                         @if (previewError()) {
                            <div class="p-3 bg-red-50 border border-red-100 rounded text-xs text-red-600 flex items-start gap-2">
                               <i class="fa-solid fa-circle-exclamation mt-0.5"></i> 
                               <div>
                                  <b>Lỗi công thức:</b><br>
                                  Vui lòng kiểm tra lại cú pháp hoặc tên biến.
                               </div>
                            </div>
                         } @else if (previewResults().length > 0) {
                             @for (item of previewResults(); track item.name) {
                                <div class="border-b border-slate-100 last:border-0 pb-2">
                                   <div class="flex justify-between items-start">
                                      <div class="font-medium text-xs text-slate-700 pr-2 break-words max-w-[180px]">
                                          {{resolveName(item.name)}}
                                      </div>
                                      <div class="font-bold text-sm text-blue-600 whitespace-nowrap">
                                          {{formatNum(item.stockNeed)}} <span class="text-[10px] text-slate-400">{{item.stockUnit}}</span>
                                      </div>
                                   </div>
                                   <div class="text-[9px] text-slate-400 font-mono mt-0.5 truncate">{{item.formula}}</div>
                                   
                                   @if(item.isComposite) {
                                      <div class="mt-1 pl-2 border-l border-slate-200">
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
                             <div class="text-center py-8 opacity-40">
                                <i class="fa-solid fa-calculator text-3xl mb-2 text-slate-300"></i>
                                <p class="text-xs text-slate-500">Nhập công thức để thấy kết quả</p>
                             </div>
                         }
                    </div>
                </div>

            </div>
        </div>
    </div>
  `
})
export class SopEditorComponent {
  state = inject(StateService);
  sopService = inject(SopService);
  toast = inject(ToastService);
  confirmationService = inject(ConfirmationService);
  calcService = inject(CalculatorService);
  fb: FormBuilder = inject(FormBuilder);
  
  sopToEdit = input<Sop | null>(null);
  sopSaved = output<Sop>();
  cancelEdit = output<void>();

  unitOptions = UNIT_OPTIONS;
  currentId = signal<string | null>(null);
  currentVersion = signal<number>(1);
  currentTab = signal<'general' | 'logic' | 'consumables'>('general');
  formatNum = formatNum;

  // Signals for Variable Assistant
  availableInputs = signal<string[]>([]);
  availableVars = signal<string[]>([]);

  // Preview Signals
  previewResults = signal<CalculatedItem[]>([]);
  previewError = signal<boolean>(false);

  form = this.fb.group({
    id: [''],
    category: ['', Validators.required],
    name: ['', Validators.required],
    ref: [''],
    inputs: this.fb.array([]),
    variablesList: this.fb.array([]),
    consumables: this.fb.array([])
  });

  constructor() {
    effect((onCleanup) => {
      const sop = this.sopToEdit();
      if (sop) {
        this.loadSop(sop);
      } else {
        this.createNew();
      }
      
      // Live Preview & Variable Dictionary Update
      const sub = this.form.valueChanges.subscribe(val => {
         this.updateDictionaries(val);
         this.runPreview(val);
      });
      onCleanup(() => sub.unsubscribe());
    });
  }

  get inputs() { return this.form.get('inputs') as FormArray; }
  get variablesList() { return this.form.get('variablesList') as FormArray; }
  get consumables() { return this.form.get('consumables') as FormArray; }
  
  getIngredients(conIndex: number): FormArray {
    return this.consumables.at(conIndex).get('ingredients') as FormArray;
  }

  // --- Logic ---

  createNew() {
    this.currentId.set(null);
    this.currentVersion.set(1);
    this.currentTab.set('general');
    this.form.reset({ id: '', category: '', name: '', ref: '' });
    this.inputs.clear();
    this.variablesList.clear();
    this.consumables.clear();
    
    this.addInputRaw('n_sample', 'Số lượng mẫu', 1, 'number', 1, 'mẫu');
    this.previewResults.set([]);
  }

  loadSop(sop: Sop) {
    this.currentId.set(sop.id);
    this.currentVersion.set(sop.version || 1);
    this.currentTab.set('general');
    this.form.patchValue({
      id: sop.id,
      category: sop.category,
      name: sop.name,
      ref: sop.ref
    });

    this.inputs.clear();
    sop.inputs.forEach(i => this.addInputRaw(i.var, i.label, i.default, i.type, i.step, i.unitLabel));

    this.variablesList.clear();
    if (sop.variables) {
      Object.entries(sop.variables).forEach(([k, v]) => {
         const g = this.fb.group({ key: [k, Validators.required], formula: [v, Validators.required] });
         this.variablesList.push(g);
      });
    }

    this.consumables.clear();
    sop.consumables.forEach(c => {
      const g = this.fb.group({
        name: [c.name || ''],
        formula: [c.formula || ''],
        unit: [c.unit || ''],
        type: [c.type || 'simple'],
        condition: [c.condition || ''],
        ingredients: this.fb.array([])
      });
      
      const ingArray = g.get('ingredients') as FormArray;
      if (c.ingredients) {
        c.ingredients.forEach(ing => {
          ingArray.push(this.fb.group({
             name: [ing.name, Validators.required],
             amount: [ing.amount, Validators.required],
             unit: [ing.unit, Validators.required]
          }));
        });
      }
      this.consumables.push(g);
    });
    
    // Initial Calc
    this.updateDictionaries(this.form.value);
    this.runPreview(this.form.value);
  }

  updateDictionaries(formVal: any) {
     const inps = (formVal.inputs || []).map((i: any) => i.var).filter((v: any) => !!v);
     const vars = (formVal.variablesList || []).map((v: any) => v.key).filter((k: any) => !!k);
     this.availableInputs.set(inps);
     this.availableVars.set(vars);
  }

  runPreview(formVal: any) {
    if (this.form.invalid) {
        // Just clear results, don't show huge error unless explicitly checking
        this.previewError.set(false); 
        this.previewResults.set([]);
        return;
    }

    try {
        const mockInputs: Record<string, any> = {};
        (formVal.inputs || []).forEach((i: any) => {
            if(i.var) mockInputs[i.var] = i.default;
        });

        const variables: Record<string, string> = {};
        (formVal.variablesList as any[]).forEach(v => {
           if (v.key && v.formula) variables[v.key] = v.formula;
        });

        const tempSop: Sop = {
           id: 'preview', category: 'p', name: 'P',
           inputs: formVal.inputs,
           variables: variables,
           consumables: (formVal.consumables as any[]).map((c: any) => ({
              name: c.name, formula: c.formula, unit: c.unit, type: c.type, condition: c.condition, ingredients: c.ingredients
           }))
        };

        const results = this.calcService.calculateSopNeeds(tempSop, mockInputs, 0); 
        this.previewResults.set(results);
        this.previewError.set(false);
    } catch (e) {
        this.previewError.set(true);
    }
  }

  resolveName(id: string): string {
     return this.state.inventoryMap()[id]?.name || id;
  }

  copyToClipboard(text: string) {
     navigator.clipboard.writeText(text);
     this.toast.show(`Đã copy "${text}"`);
  }

  // --- CRUD ---

  async save() {
    let formVal = this.form.value;
    if (!formVal.id) {
       const newId = `sop_${Date.now()}`;
       this.form.patchValue({ id: newId });
       formVal = this.form.value;
    }

    if (this.form.invalid) {
       this.form.markAllAsTouched();
       this.toast.show('Vui lòng kiểm tra các trường bắt buộc (Tên, Danh mục)!', 'error');
       return;
    }

    const variables: Record<string, string> = {};
    (formVal.variablesList as any[]).forEach(v => {
       if (v.key && v.formula) variables[v.key] = v.formula;
    });

    const sop: Sop = {
      id: formVal.id!,
      category: formVal.category!,
      name: formVal.name!,
      ref: formVal.ref || '',
      inputs: (formVal.inputs as any[]).map(i => ({...i})),
      variables: variables,
      consumables: (formVal.consumables as any[]).map((c: any) => ({
         name: c.name,
         formula: c.formula,
         unit: c.unit,
         type: c.type,
         condition: c.condition,
         ingredients: c.ingredients
      })),
      version: this.currentVersion() 
    };

    try {
      await this.sopService.saveSop(sop);
      this.toast.show('Đã lưu quy trình thành công!');
      this.sopSaved.emit(sop);
    } catch(e) {
      console.error(e);
      this.toast.show('Lỗi lưu SOP', 'error');
    }
  }

  async deleteCurrent() {
    const id = this.currentId();
    if (id) {
      const confirmed = await this.confirmationService.confirm({
        message: 'Xóa SOP này? (Lịch sử phiên bản cũ vẫn được giữ lại)',
        confirmText: 'Xóa',
        isDangerous: true
      });
      if (confirmed) {
        await this.sopService.deleteSop(id);
        this.toast.show('Đã xóa SOP');
        this.createNew();
        this.cancelEdit.emit();
      }
    }
  }

  // --- Form Helpers ---

  addInput() { this.addInputRaw('', '', 0, 'number', 1, ''); }
  private addInputRaw(v: string, l: string, d: any, t: 'number'|'checkbox', s: any, u: string | undefined) {
    this.inputs.push(this.fb.group({
      var: [v, Validators.required],
      label: [l, Validators.required],
      default: [d],
      type: [t || 'number'],
      step: [s || 1],
      unitLabel: [u || '']
    }));
  }

  addVariable() {
    this.variablesList.push(this.fb.group({ key: ['', Validators.required], formula: ['', Validators.required] }));
  }

  addConsumable() {
    this.consumables.push(this.fb.group({
      name: [''], formula: [''], unit: ['ml'], type: ['simple'], condition: [''],
      ingredients: this.fb.array([])
    }));
  }

  addIngredient(conIndex: number) {
    this.getIngredients(conIndex).push(this.fb.group({
      name: ['', Validators.required], amount: [0, Validators.required], unit: ['ml', Validators.required]
    }));
  }
}
