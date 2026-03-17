
import { Component, inject, input, output, effect, signal, computed, OnDestroy, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; 
import { StateService } from '../../../core/services/state.service';
import { AuthService } from '../../../core/services/auth.service';
import { InventoryService } from '../../inventory/inventory.service';
import { RecipeService } from '../../recipes/recipe.service';
import { SopService } from '../services/sop.service'; 
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { PrintService, PrintJob } from '../../../core/services/print.service';
import { Sop, CalculatedItem, CalculatedIngredient } from '../../../core/models/sop.model';
import { InventoryItem } from '../../../core/models/inventory.model';
import { Recipe } from '../../../core/models/recipe.model';
import { Request } from '../../../core/models/request.model';
import { CalculatorService } from '../../../core/services/calculator.service';
import { formatNum, cleanName, generateSlug, formatDate, naturalCompare } from '../../../shared/utils/utils';
import { startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { RecipeManagerComponent } from '../../recipes/recipe-manager.component';
import { QuickGenerateSampleModalComponent } from '../../../shared/components/quick-generate-sample-modal/quick-generate-sample-modal.component';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RecipeManagerComponent, QuickGenerateSampleModalComponent],
  template: `
    <div class="w-full max-w-[1920px] mx-auto pb-24 md:pb-6 fade-in h-full flex flex-col no-print px-4 md:px-6">
      
      @if (activeSop(); as currentSop) {
        <!-- VIEW: CALCULATOR FORM (RUNNER) -->
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 shrink-0 gap-4 pt-4">
           <div>
              <div class="flex items-center gap-2 mb-1.5">
                 <button (click)="clearSelection()" class="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-md shadow-sm active:scale-95">
                    <i class="fa-solid fa-arrow-left"></i> Thư viện
                 </button>
                 <span class="px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-sm border border-indigo-200 dark:border-indigo-800">
                    {{currentSop.category}}
                 </span>
              </div>
              <h2 class="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-200 tracking-tight leading-tight">{{currentSop.name}}</h2>
           </div>
        </div>

        <!-- Main Layout -->
        <div class="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-stretch flex-1 min-h-0">
            
            <!-- LEFT PANEL: INPUTS -->
            <div class="w-full lg:w-[400px] shrink-0 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col h-[600px] lg:h-full">
               <div class="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-3 shrink-0">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-blue-200 dark:shadow-blue-900/20 shadow-md">
                    <i class="fa-solid fa-sliders"></i>
                  </div>
                  <div><h3 class="font-bold text-slate-800 dark:text-slate-200 text-sm">Thông số Mẻ mẫu</h3></div>
               </div>

               <!-- Scrollable Inputs -->
               <div class="p-5 flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-6">
                   @if (form()) {
                       <form [formGroup]="form()" class="space-y-6">
                          <!-- 1. SAMPLE MANAGEMENT -->
                          <div class="bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-800/50">
                              <div class="flex justify-between items-center mb-2">
                                  <label class="text-[11px] font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wide flex items-center gap-2">
                                      <span>Danh sách Mã Mẫu</span>
                                      <button type="button" (click)="openQuickGenerateModal()" class="text-[10px] text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 px-2 py-1 rounded transition font-bold flex items-center gap-1 normal-case tracking-normal">
                                          <i class="fa-solid fa-wand-magic-sparkles"></i> Tạo nhanh
                                      </button>
                                  </label>
                                  <span class="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 rounded-md text-[11px] font-bold">{{sampleCount()}} mẫu</span>
                              </div>
                              <textarea [ngModel]="sampleListText()" (ngModelChange)="onSampleListChange($event)" [ngModelOptions]="{standalone: true}"
                                        class="w-full p-3 text-xs font-mono border border-blue-200 dark:border-blue-800/50 rounded-lg focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/30 outline-none bg-white dark:bg-slate-900 min-h-[80px] resize-y placeholder-blue-300/50 dark:placeholder-blue-700/50 text-slate-800 dark:text-slate-200"
                                        placeholder="Dán mã mẫu vào đây (mỗi mã 1 dòng)..."></textarea>
                              <p class="text-[9px] text-blue-400 dark:text-blue-500 mt-1 italic text-right">* Tự động cập nhật số lượng mẫu bên dưới.</p>
                          </div>

                          <!-- 2. TARGET SELECTION -->
                          @if (currentSop.targets && currentSop.targets.length > 0) {
                              <div class="border border-emerald-100 dark:border-emerald-800/50 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm transition-all duration-300">
                                  <button type="button" (click)="targetsOpen.set(!targetsOpen())" 
                                          class="w-full flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/10 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/20 transition text-emerald-800 dark:text-emerald-400 group">
                                      <div class="flex items-center gap-2">
                                          <div class="w-6 h-6 rounded bg-emerald-200 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xs">
                                              <i class="fa-solid fa-bullseye"></i>
                                          </div>
                                          <span class="text-xs font-bold uppercase tracking-wide">Chỉ tiêu ({{selectedTargets().size}}/{{currentSop.targets.length}})</span>
                                      </div>
                                      <i class="fa-solid fa-chevron-down text-emerald-600 dark:text-emerald-500 transition-transform duration-300" [class.rotate-180]="targetsOpen()"></i>
                                  </button>

                                  @if (targetsOpen()) {
                                      <div class="p-3 bg-white dark:bg-slate-800 animate-slide-down">
                                          <div class="flex gap-2 mb-3">
                                              <div class="relative flex-1">
                                                  <i class="fa-solid fa-search absolute left-2 top-2 text-slate-400 dark:text-slate-500 text-xs"></i>
                                                  <input [ngModel]="targetSearchTerm()" (ngModelChange)="targetSearchTerm.set($event)" [ngModelOptions]="{standalone: true}"
                                                         class="w-full pl-7 pr-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200" 
                                                         placeholder="Tìm chỉ tiêu...">
                                              </div>
                                              <button type="button" (click)="toggleAllTargets(currentSop.targets)" 
                                                      class="px-2 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-600 transition">
                                                  {{ isAllSelected(currentSop.targets) ? 'Bỏ chọn' : 'Chọn hết' }}
                                              </button>
                                          </div>

                                          <div class="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                                              @for (target of filteredTargets(); track target.id) {
                                                  <label class="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition group"
                                                         [class]="selectedTargets().has(target.id) ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800' : 'bg-white dark:bg-slate-800 border border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50'">
                                                      <input type="checkbox" [checked]="selectedTargets().has(target.id)" (change)="toggleTarget(target.id)" 
                                                             class="w-4 h-4 accent-emerald-600 rounded cursor-pointer">
                                                      <span class="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 truncate flex-1">{{target.name}}</span>
                                                      @if(target.lod) { <span class="text-[9px] text-slate-400 dark:text-slate-500 shrink-0 bg-white dark:bg-slate-800 px-1.5 rounded border border-slate-100 dark:border-slate-700">{{target.lod}}</span> }
                                                  </label>
                                              }
                                          </div>
                                      </div>
                                  }
                              </div>
                          }

                          <div class="h-px bg-slate-100 dark:bg-slate-700"></div>

                          <!-- 3. STANDARD INPUTS -->
                          <div class="space-y-4">
                              <div class="group">
                                 <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 ml-1">Ngày phân tích</label>
                                 <div class="relative">
                                    <input type="date" formControlName="analysisDate" class="[color-scheme:light] dark:[color-scheme:dark]"
                                           class="w-full pl-4 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition shadow-sm [color-scheme:light] dark:[color-scheme:dark]">
                                 </div>
                              </div>

                              @for (inp of currentSop.inputs; track inp.var) {
                                <div class="group">
                                   <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 ml-1">{{inp.label}}</label>
                                   @switch (inp.type) {
                                       @case ('checkbox') {
                                          <label class="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-500 transition">
                                            <span class="text-sm font-bold text-slate-700 dark:text-slate-200">Kích hoạt</span>
                                            <input type="checkbox" [formControlName]="inp.var" class="w-5 h-5 accent-blue-600 rounded cursor-pointer">
                                          </label>
                                       }
                                       @case ('select') {
                                          <div class="relative">
                                              <select [formControlName]="inp.var" class="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-400 transition shadow-sm appearance-none cursor-pointer">
                                                  @for (opt of inp.options; track opt.value) {
                                                      <option [value]="opt.value">{{opt.label}}</option>
                                                  }
                                              </select>
                                              <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><i class="fa-solid fa-chevron-down text-slate-400 dark:text-slate-500 text-xs"></i></div>
                                          </div>
                                       }
                                       @default {
                                          <div class="relative">
                                            <input type="number" [formControlName]="inp.var" [step]="inp.step || 1"
                                                   class="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-bold text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition shadow-sm"
                                                   [ngClass]="{'bg-blue-50 dark:bg-blue-900/20': inp.var === 'n_sample' && sampleListText().length > 0}"
                                                   [readonly]="inp.var === 'n_sample' && sampleListText().length > 0">
                                            @if(inp.unitLabel) { <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 dark:text-slate-500">{{inp.unitLabel}}</span> }
                                          </div>
                                       }
                                   }
                                </div>
                              }
                              
                              <div class="pt-4 mt-2 border-t border-slate-100 dark:border-slate-700">
                                 <div class="flex justify-between items-center mb-2 ml-1">
                                     <label class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Hệ số hao hụt</label>
                                     <div class="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                                         <button type="button" (click)="setMarginMode('auto')" 
                                                 class="px-2 py-1 text-[10px] font-bold rounded-md transition"
                                                 [class]="marginMode() === 'auto' ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'">
                                             Auto
                                         </button>
                                         <button type="button" (click)="setMarginMode('manual')" 
                                                 class="px-2 py-1 text-[10px] font-bold rounded-md transition"
                                                 [class]="marginMode() === 'manual' ? 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'">
                                             Tùy chỉnh
                                         </button>
                                     </div>
                                 </div>
                                 
                                 @if(marginMode() === 'auto') {
                                     <div class="w-full py-3 px-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/50 rounded-xl flex items-center gap-3 text-orange-800 dark:text-orange-400 animate-fade-in cursor-default" title="Sử dụng cấu hình định mức cho từng loại hóa chất">
                                         <div class="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center shrink-0">
                                             <i class="fa-solid fa-wand-magic-sparkles text-orange-500 dark:text-orange-400"></i>
                                         </div>
                                         <div>
                                             <div class="text-xs font-bold">Chế độ Tự động</div>
                                             <div class="text-[10px] opacity-80">Áp dụng theo từng loại hóa chất</div>
                                         </div>
                                     </div>
                                 } @else {
                                    <div class="relative group animate-fade-in">
                                       <input type="number" formControlName="safetyMargin" min="0" step="1"
                                              class="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-bold text-slate-700 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-800 focus:border-orange-500 dark:focus:border-orange-400 outline-none transition shadow-sm">
                                       <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 dark:text-slate-500">%</span>
                                    </div>
                                 }
                              </div>
                          </div>
                       </form>
                   }
               </div>

               <div class="p-5 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-3 shrink-0">
                  <!-- Action Buttons -->
                  @if (editingRequest()) {
                      <button (click)="saveEditedRequest(currentSop)" [disabled]="isProcessing()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2">
                          @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> } @else { <i class="fa-solid fa-save"></i> } Lưu Thay Đổi
                      </button>
                      <button (click)="cancelEdit()" [disabled]="isProcessing()" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold py-3.5 rounded-xl shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2 disabled:opacity-50">
                          <i class="fa-solid fa-times"></i> Hủy Chỉnh Sửa
                      </button>
                  } @else {
                      <button (click)="onPrintDraft(currentSop)" [disabled]="isProcessing()" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold py-3.5 rounded-xl shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2 disabled:opacity-50">
                          @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> } @else { <i class="fa-solid fa-print"></i> } In Nháp (Xem trước)
                      </button>
                      
                      <button (click)="sendRequest(currentSop)" [disabled]="isProcessing()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2">
                          <i class="fa-solid fa-paper-plane"></i> Gửi Yêu Cầu Duyệt
                      </button>
                      
                      @if(auth.canApprove()) {
                         <button (click)="approveAndCreatePrintJob(currentSop)" [disabled]="isProcessing()" class="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition hover:from-emerald-600 hover:to-teal-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> Đang xử lý... }
                            @else { <i class="fa-solid fa-check-double"></i> Duyệt & In Phiếu Ngay }
                         </button>
                      }
                  }
               </div>
            </div>

            <!-- RIGHT PANEL: RESULTS -->
            <div class="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col h-[600px] lg:h-full">
                <div class="bg-slate-50/50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between shrink-0">
                  <h3 class="font-black text-slate-800 dark:text-slate-200 text-base flex items-center gap-3">
                    <i class="fa-solid fa-flask-vial text-purple-600 dark:text-purple-400"></i> Bảng Dự Trù Hóa Chất
                  </h3>
                  @if(isLoadingInventory()) {
                      <div class="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800/50 animate-pulse">
                          <i class="fa-solid fa-circle-notch fa-spin text-blue-500 dark:text-blue-400 text-xs"></i>
                          <span class="text-xs text-blue-600 dark:text-blue-400 font-bold">Đang kiểm tra kho...</span>
                      </div>
                  } @else {
                      <span class="text-xs text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full border border-green-100 dark:border-green-800/50"><i class="fa-solid fa-check mr-1"></i>Đã đồng bộ kho</span>
                  }
                </div>
                
                <div class="lg:overflow-y-auto lg:flex-1 p-0 custom-scrollbar">
                   <table class="w-full text-sm text-left border-collapse">
                     <thead class="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase bg-slate-50 dark:bg-slate-800/80 sticky top-0 shadow-sm z-10">
                        <tr>
                          <th class="px-6 py-3 tracking-wider w-1/3">Hóa chất / Vật tư</th>
                          <th class="px-6 py-3 tracking-wider text-right hidden sm:table-cell">Công thức</th>
                          <th class="px-6 py-3 tracking-wider text-right hidden sm:table-cell">Định mức</th>
                          <th class="px-6 py-3 tracking-wider text-right hidden sm:table-cell">Tiêu hao</th>
                          <th class="px-6 py-3 tracking-wider text-right w-32">Tổng Cần</th>
                          <th class="px-6 py-3 tracking-wider text-center w-20">Đơn vị</th>
                        </tr>
                     </thead>
                     <tbody class="divide-y divide-slate-50 dark:divide-slate-700/50">
                        @for (item of calculatedItems(); track item.name) {
                              <tr class="group hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition duration-150" [ngClass]="{'bg-red-50 dark:bg-red-900/10': item.isMissing}">
                                <td class="px-6 py-4 align-top">
                                  <div class="flex flex-col">
                                      <span class="font-bold text-slate-700 dark:text-slate-300 text-sm group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                                          {{resolveName(item)}}
                                      </span>
                                      <div class="flex flex-wrap gap-1 mt-1">
                                          @if(item.isMissing) { 
                                              <span class="text-[10px] font-bold text-red-600 dark:text-red-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-red-200 dark:border-red-800/50"><i class="fa-solid fa-circle-xmark"></i> Không có trong kho</span> 
                                          }
                                          @if (item.displayWarning) { 
                                              <span class="text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded border border-orange-100 dark:border-orange-800/50"><i class="fa-solid fa-triangle-exclamation"></i> {{item.displayWarning}}</span> 
                                          }
                                      </div>
                                  </div>
                                </td>
                                <td class="px-6 py-4 text-right align-top hidden sm:table-cell">
                                  <code class="text-[10px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">{{item.formula}}</code>
                                </td>
                                <td class="px-6 py-4 text-right align-top hidden sm:table-cell">
                                  <span class="font-medium text-slate-600 dark:text-slate-400 text-sm tabular-nums">{{formatNum(item.baseQty || 0)}}</span>
                                </td>
                                <td class="px-6 py-4 text-right align-top hidden sm:table-cell">
                                  <span class="text-xs font-bold text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-md border border-orange-100 dark:border-orange-800/50">+{{item.appliedMargin || 0}}%</span>
                                </td>
                                <td class="px-6 py-4 text-right align-top">
                                  <span class="font-black text-blue-600 dark:text-blue-400 text-lg tabular-nums">{{formatNum(item.totalQty)}}</span>
                                </td>
                                <td class="px-6 py-4 text-center align-top"><span class="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{{item.unit}}</span></td>
                              </tr>
                              
                              @if (item.isComposite) {
                                 <tr class="bg-slate-50/50 dark:bg-slate-800/30">
                                    <td colspan="6" class="px-6 py-2 pb-4">
                                        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-sm ml-4">
                                            <div class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Thành phần</div>
                                            <div class="grid gap-2">
                                                @for (sub of item.breakdown; track sub.name) {
                                                    <div class="flex justify-between items-center text-xs border-b border-slate-50 dark:border-slate-700/50 last:border-0 pb-1" [ngClass]="{'text-red-500 dark:text-red-400': sub.isMissing}">
                                                        <div class="flex items-center gap-2">
                                                            <span class="font-medium" [ngClass]="{'text-slate-600 dark:text-slate-300': !sub.isMissing}">{{resolveName(sub)}}</span>
                                                            @if(sub.isMissing) { <i class="fa-solid fa-circle-exclamation text-[10px]" title="Không tìm thấy trong kho"></i> }
                                                            <span class="text-[10px] text-slate-400 dark:text-slate-500 italic">({{sub.amountPerUnit}} / {{item.unit}})</span>
                                                        </div>
                                                        <div class="flex items-center gap-3">
                                                            <span class="text-[10px] text-slate-400 dark:text-slate-500">Định mức: {{formatNum(sub.baseAmount || 0)}}</span>
                                                            <span class="text-[10px] font-bold text-orange-500 dark:text-orange-400">+{{sub.appliedMargin || 0}}%</span>
                                                            <div class="flex items-center gap-1"><span class="font-bold text-slate-700 dark:text-slate-300 font-mono">{{formatNum(sub.displayAmount)}}</span><span class="text-[10px] text-slate-500 dark:text-slate-400">{{sub.unit}}</span></div>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </td>
                                 </tr>
                              }
                        } @empty {
                            <tr><td colspan="4" class="p-10 text-center text-slate-400 dark:text-slate-500 italic">Chưa có dữ liệu tính toán.</td></tr>
                        }
                     </tbody>
                   </table>
                </div>
            </div>
        </div>
      } 
      @else {
        <!-- LIBRARY VIEW (Unchanged) -->
        <div class="flex flex-col flex-1 min-h-0 animate-fade-in relative">
            <div class="flex justify-between items-end border-b border-slate-200 dark:border-slate-700 mb-6 shrink-0 pt-4 px-1">
                <div class="flex gap-6">
                    <button (click)="libraryTab.set('sops')" 
                            class="pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide px-2"
                            [class]="libraryTab() === 'sops' ? 'border-blue-600 text-blue-700 dark:text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'">
                        <i class="fa-solid fa-file-lines"></i> Quy trình (SOPs)
                    </button>
                    @if(auth.canViewRecipes()) {
                        <button (click)="libraryTab.set('recipes')" 
                                class="pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 uppercase tracking-wide px-2"
                                [class]="libraryTab() === 'recipes' ? 'border-purple-600 text-purple-700 dark:text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'">
                            <i class="fa-solid fa-flask"></i> Công thức (Recipes)
                        </button>
                    }
                </div>
            </div>

            @if (libraryTab() === 'sops') {
                <div class="flex flex-col flex-1 min-h-0 animate-slide-up">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
                        <div class="relative flex-1 md:max-w-md">
                            <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                            <input type="text" [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)" 
                                   class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 shadow-sm transition" 
                                   placeholder="Tìm kiếm SOP...">
                        </div>
                        
                        @if(auth.canEditSop()) {
                            <div class="flex gap-2 self-end md:self-auto">
                                <button (click)="importFileInput.click()" class="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 px-4 py-2 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shrink-0 active:scale-95" title="Import SOP từ file JSON">
                                    <i class="fa-solid fa-file-import"></i> <span class="hidden md:inline">Import</span>
                                </button>
                                <input #importFileInput type="file" class="hidden" accept=".json" (change)="importSop($event)">

                                <button (click)="createNew()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 shrink-0 active:scale-95">
                                    <i class="fa-solid fa-plus"></i> <span class="hidden md:inline">Tạo mới</span>
                                </button>
                            </div>
                        }
                    </div>

                    <div class="overflow-y-auto pb-10 custom-scrollbar p-1 flex-1">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                            @for (sop of filteredSops(); track sop.id) {
                                <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300 group relative flex flex-col h-full min-h-[160px]"
                                     (click)="selectSop(sop)">
                                    <div class="flex justify-between items-start mb-2">
                                        <div class="flex items-center gap-2 flex-wrap">
                                            <span class="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600 truncate max-w-[120px]" [title]="sop.category">{{sop.category}}</span>
                                            @if(sop.version) { <span class="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-700">v{{sop.version}}</span> }
                                        </div>
                                        <button (click)="toggleMenu(sop.id, $event)" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition relative z-20 -mr-2 -mt-2"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                                        @if (activeMenuSopId() === sop.id) {
                                            <div class="absolute top-8 right-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-1 w-48 z-30 animate-slide-up overflow-hidden" (click)="$event.stopPropagation()">
                                                <button (click)="exportSop(sop, $event)" class="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition"><i class="fa-solid fa-download text-emerald-500 w-4"></i> Export JSON</button>
                                                @if(auth.canEditSop()) {
                                                    <button (click)="duplicateSop(sop, $event)" class="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition"><i class="fa-solid fa-copy text-purple-500 w-4"></i> Nhân bản</button>
                                                    <button (click)="editDirect(sop, $event)" class="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition"><i class="fa-solid fa-pen text-blue-500 w-4"></i> Chỉnh sửa</button>
                                                    <div class="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                                                    <button (click)="softDeleteSop(sop, $event)" class="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2 transition"><i class="fa-solid fa-box-archive w-4"></i> Lưu trữ</button>
                                                }
                                            </div>
                                        }
                                    </div>
                                    <h3 class="font-bold text-slate-700 dark:text-slate-200 text-lg leading-snug mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors pr-2 line-clamp-2">{{sop.name}}</h3>
                                    <div class="mt-auto pt-3 border-t border-slate-50 dark:border-slate-700/50 flex justify-between items-center text-xs text-slate-400 font-medium"><span>{{sop.consumables.length}} chất</span><span>{{formatDate(sop.lastModified)}}</span></div>
                                </div>
                            } @empty {
                                <div class="col-span-full py-20 text-center text-slate-400 italic flex flex-col items-center">
                                    <i class="fa-solid fa-folder-open text-4xl mb-3 text-slate-300 dark:text-slate-600"></i><p>Chưa có quy trình nào phù hợp.</p>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            }

            @if (libraryTab() === 'recipes') {
                <div class="flex-1 min-h-0 animate-slide-up">
                    <app-recipe-manager></app-recipe-manager>
                </div>
            }
        </div>
      }

      <!-- QUICK GENERATE MODAL -->
      @if (quickGenerateModalOpen()) {
          <app-quick-generate-sample-modal
              (close)="closeQuickGenerateModal()"
              (generated)="handleGeneratedSamples($event)">
          </app-quick-generate-sample-modal>
      }
    </div>
  `
})
export class CalculatorComponent implements OnDestroy {
  sopInput = input<Sop | null>(null, { alias: 'sop' }); 
  
  // ... imports and basic setup identical to previous ...
  private fb: FormBuilder = inject(FormBuilder);
  public state = inject(StateService);
  public auth = inject(AuthService);
  private invService = inject(InventoryService); 
  private recipeService = inject(RecipeService);
  private calcService = inject(CalculatorService);
  private sopService = inject(SopService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private toast = inject(ToastService);
  private confirmation = inject(ConfirmationService);
  private printService = inject(PrintService);
  
  activeSop = computed(() => this.sopInput() || this.state.selectedSop());
  libraryTab = signal<'sops' | 'recipes'>('sops');
  searchTerm = signal('');
  activeMenuSopId = signal<string | null>(null);
  isProcessing = signal(false);
  private currentFormSopId: string | null = null;
  localInventoryMap = signal<Record<string, InventoryItem>>({});
  localRecipeMap = signal<Record<string, Recipe>>({});
  isLoadingInventory = signal(false);
  sampleListText = signal('');
  sampleCount = signal(0);
  selectedTargets = signal<Set<string>>(new Set());
  targetsOpen = signal(false);
  targetSearchTerm = signal('');
  
  // Quick Generate Modal State
  quickGenerateModalOpen = signal(false);
  
  // Edit Request State
  editingRequest = signal<Request | null>(null);
  
  // SAFETY MARGIN MODE: 'auto' means use Config (-1), 'manual' uses explicit number
  marginMode = signal<'auto' | 'manual'>('auto');

  filteredSops = computed(() => {
      const term = this.searchTerm().toLowerCase();
      const allSops = this.state.sops().filter(s => !s.isArchived);
      const filtered = allSops.filter(s => s.name.toLowerCase().includes(term) || s.category.toLowerCase().includes(term));
      return filtered.sort((a, b) => {
          const catCompare = naturalCompare((a.category || '').toLowerCase(), (b.category || '').toLowerCase());
          if (catCompare !== 0) return catCompare;
          return naturalCompare(a.name, b.name);
      });
  });

  filteredTargets = computed(() => {
      const sop = this.activeSop();
      if (!sop || !sop.targets) return [];
      const term = this.targetSearchTerm().toLowerCase();
      if (!term) return sop.targets;
      return sop.targets.filter(t => t.name.toLowerCase().includes(term) || t.id.toLowerCase().includes(term));
  });

  form = signal<FormGroup>(this.fb.group({ safetyMargin: [10], analysisDate: [this.getTodayDate()] }));
  private formValueSub?: Subscription;
  calculatedItems = signal<CalculatedItem[]>([]);
  safetyMargin = signal<number>(10);
  formatNum = formatNum;
  formatDate = formatDate;

  editRequestIdSignal = signal<string | null>(null);

  constructor() {
    this.route.queryParams.subscribe(params => {
        this.editRequestIdSignal.set(params['editRequestId'] || null);
    });

    effect(() => {
        const editId = this.editRequestIdSignal();
        if (editId) {
            const reqs = this.state.approvedRequests();
            if (reqs.length > 0) { // Wait until loaded
                const req = reqs.find(r => r.id === editId);
                if (req) {
                    if (this.editingRequest()?.id !== req.id) {
                        this.editingRequest.set(req);
                        const sop = this.state.sops().find(s => s.id === req.sopId);
                        if (sop) {
                            this.currentFormSopId = null; // Force form re-init
                            this.state.selectedSop.set(sop);
                        } else {
                            this.toast.show('Không tìm thấy SOP của phiếu này.', 'error');
                        }
                    }
                } else {
                    if (this.editingRequest() !== null) {
                        this.editingRequest.set(null);
                        this.toast.show('Không tìm thấy phiếu yêu cầu.', 'error');
                    }
                }
            }
        } else {
            if (this.editingRequest() !== null) {
                this.editingRequest.set(null);
            }
        }
    }, { allowSignalWrites: true });

    effect(() => {
      const s = this.activeSop();
      if (s) {
        if (s.id === this.currentFormSopId) return;
        this.currentFormSopId = s.id;
        this.formValueSub?.unsubscribe();
        const controls: Record<string, any> = { safetyMargin: [10], analysisDate: [this.getTodayDate()] };
        s.inputs.forEach(i => { if (i.var !== 'safetyMargin') controls[i.var] = [i.default !== undefined ? i.default : 0]; });
        const newForm = this.fb.group(controls);
        
        const cached = this.state.cachedCalculatorState();
        const editingReq = this.editingRequest();
        
        if (editingReq && editingReq.sopId === s.id) {
            // Patch from request
            const patchData: any = {};
            if (editingReq.inputs) {
                Object.keys(editingReq.inputs).forEach(key => {
                    if (newForm.contains(key)) {
                        patchData[key] = editingReq.inputs[key];
                    }
                });
            }
            if (editingReq.margin !== undefined && editingReq.margin !== -1) {
                this.marginMode.set('manual');
                if (newForm.contains('safetyMargin')) {
                    patchData['safetyMargin'] = editingReq.margin;
                }
            } else {
                this.marginMode.set('auto');
            }
            if (editingReq.analysisDate && newForm.contains('analysisDate')) {
                patchData['analysisDate'] = editingReq.analysisDate;
            }
            newForm.patchValue(patchData);
            
            if (editingReq.sampleList) {
                const samplesStr = editingReq.sampleList.join('\n');
                this.sampleListText.set(samplesStr);
                this.sampleCount.set(editingReq.sampleList.length);
                if (newForm.contains('n_sample') && editingReq.sampleList.length > 0) {
                    newForm.patchValue({ n_sample: editingReq.sampleList.length });
                }
            } else {
                this.sampleListText.set('');
                this.sampleCount.set(0);
            }
            
            if (editingReq.targetIds) {
                this.selectedTargets.set(new Set(editingReq.targetIds));
            } else {
                this.selectedTargets.set(new Set());
            }
        } else {
            if (cached && cached.sopId === s.id) { 
                newForm.patchValue(cached.formValues); 
            }
            this.sampleListText.set('');
            this.sampleCount.set(0);
            this.selectedTargets.set(new Set());
            this.marginMode.set('auto');
        }
        
        this.form.set(newForm);
        this.localInventoryMap.set({}); this.localRecipeMap.set({});
        this.targetsOpen.set(false);
        this.targetSearchTerm.set('');
        
        this.runCalculation(s, newForm.value);
        this.fetchData(s);
        this.formValueSub = newForm.valueChanges.pipe(startWith(newForm.value), debounceTime(50)).subscribe(vals => {
             this.runCalculation(s, vals);
             const margin = Number(vals['safetyMargin']);
             this.safetyMargin.set(isNaN(margin) ? 0 : margin);
        });
      } else {
         this.currentFormSopId = null; this.calculatedItems.set([]); this.localInventoryMap.set({});
      }
    }, { allowSignalWrites: true });
  }
  
  ngOnDestroy(): void { this.formValueSub?.unsubscribe(); }
  getTodayDate(): string { return new Date().toISOString().split('T')[0]; }

  setMarginMode(mode: 'auto' | 'manual') {
      this.marginMode.set(mode);
      if (mode === 'manual') {
          // If switching to manual, default to 10 if not set
          const current = this.form().get('safetyMargin')?.value;
          if (!current) this.form().patchValue({ safetyMargin: 10 });
      }
      // Re-trigger calc
      this.runCalculation(this.activeSop()!, this.form().value);
  }

  onSampleListChange(val: string) {
      this.sampleListText.set(val);
      const lines = val.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      this.sampleCount.set(lines.length);
      if (this.form().contains('n_sample') && lines.length > 0) {
          this.form().patchValue({ n_sample: lines.length });
      }
  }

  toggleTarget(id: string) {
      this.selectedTargets.update(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  }

  isAllSelected(allTargets: any[]): boolean {
      if (!allTargets || allTargets.length === 0) return false;
      return this.selectedTargets().size === allTargets.length;
  }

  toggleAllTargets(allTargets: any[]) {
      if (this.isAllSelected(allTargets)) { this.selectedTargets.set(new Set()); } 
      else { this.selectedTargets.set(new Set(allTargets.map(t => t.id))); }
  }

  getPayloadData() {
      const rawSamples = this.sampleListText();
      const sampleList = rawSamples.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      const values = this.form().value;
      
      // Override margin if Auto
      const finalMargin = this.marginMode() === 'auto' ? -1 : (values.safetyMargin || 0);
      
      return { ...values, safetyMargin: finalMargin, sampleList: sampleList, targetIds: Array.from(this.selectedTargets()) };
  }

  async fetchData(sop: Sop) {
      this.isLoadingInventory.set(true);
      const neededInvIds = new Set<string>(); const neededRecipeIds = new Set<string>();
      sop.consumables.forEach(c => {
          if (c.type === 'shared_recipe' && c.recipeId) neededRecipeIds.add(c.recipeId);
          else if (c.type === 'simple' && c.name) neededInvIds.add(c.name);
          else if (c.type === 'composite' && c.ingredients) c.ingredients.forEach(i => neededInvIds.add(i.name));
      });
      try {
          const recipes = await this.recipeService.getRecipesByIds(Array.from(neededRecipeIds));
          const recMap: Record<string, Recipe> = {};
          recipes.forEach(r => { recMap[r.id] = r; r.ingredients.forEach(i => neededInvIds.add(i.name)); });
          const items = await this.invService.getItemsByIds(Array.from(neededInvIds));
          const invMap: Record<string, InventoryItem> = {};
          items.forEach(i => invMap[i.id] = i);
          if (this.activeSop()?.id !== sop.id) return;
          this.localRecipeMap.set(recMap);
          this.localInventoryMap.set(invMap); 
          this.runCalculation(sop, this.form().value);
      } catch(e) { console.warn("Fetch warning:", e); } finally { this.isLoadingInventory.set(false); }
  }

  resolveName(item: CalculatedItem | CalculatedIngredient): string { return item.displayName || item.name; }

  runCalculation(sop: Sop, values: any) {
     try {
         const safeValues = (values || {}) as Record<string, any>;
         
         // DETERMINE MARGIN
         let margin = 0;
         if (this.marginMode() === 'auto') {
             margin = -1; // Flag for Auto
         } else {
             margin = Number(safeValues['safetyMargin'] || 0);
             if (isNaN(margin)) margin = 0;
         }

         const results = this.calcService.calculateSopNeeds(
             sop, 
             safeValues, 
             margin, 
             this.localInventoryMap(), 
             this.localRecipeMap(),
             this.state.safetyConfig() // Pass config
         );
         this.calculatedItems.set(results);
     } catch(e) { console.error("Calculation Error", e); }
  }

  // ... (Other standard methods: toggleMenu, selectSop, createNew, editDirect, softDeleteSop, duplicateSop, exportSop, importSop) ...
  // Methods to reduce boilerplate in XML are omitted but assumed present as in original file, only changed methods shown below.
  
  toggleMenu(id: string, event: Event) { event.stopPropagation(); if (this.activeMenuSopId() === id) this.activeMenuSopId.set(null); else this.activeMenuSopId.set(id); }
  closeMenu() { this.activeMenuSopId.set(null); }
  selectSop(s: Sop) { this.state.selectedSop.set(s); }
  clearSelection() { 
      this.state.selectedSop.set(null); 
      this.state.cachedCalculatorState.set(null); 
      this.currentFormSopId = null; 
      if (this.editingRequest()) {
          this.router.navigate(['/calculator']);
      }
  }
  createNew() { this.state.editingSop.set(null); this.router.navigate(['/editor']); }
  editDirect(sop: Sop, event: Event) { event.stopPropagation(); this.closeMenu(); this.state.editingSop.set(sop); this.router.navigate(['/editor']); }
  
  async softDeleteSop(sop: Sop, event: Event) { /* ... same as original ... */ }
  async duplicateSop(sop: Sop, event: Event) { /* ... same as original ... */ }
  exportSop(sop: Sop, event: Event) { /* ... same as original ... */ }
  async importSop(event: any) { /* ... same as original ... */ }

  // --- UPDATED: PDF SUPPORT WITH PREVIEW ---
  onPrintDraft(sop: Sop) {
    if (this.isProcessing()) return;
    this.isProcessing.set(true); 
    
    try {
        const payload = this.getPayloadData();
        this.state.cachedCalculatorState.set({ sopId: sop.id, formValues: this.form().value });

        const job: PrintJob = {
          sop: sop, inputs: payload, margin: payload.safetyMargin, items: this.calculatedItems(),
          date: new Date(), user: (this.state.currentUser()?.displayName || 'Guest') + ' (Bản nháp)',
          analysisDate: payload.analysisDate, requestId: `DRAFT-${Date.now()}`
        };
        
        // OPEN PREVIEW INSTEAD OF DIRECT PRINT
        this.printService.openPreview([job]);

    } finally {
        this.isProcessing.set(false);
    }
  }

  async approveAndCreatePrintJob(sop: Sop) {
    if (!this.auth.canApprove()) return;
    if (this.isProcessing()) return;
    this.isProcessing.set(true);
    try {
        const payload = this.getPayloadData();
        const result = await this.state.directApproveAndPrint(sop, this.calculatedItems(), payload, this.localInventoryMap());
        if (result) {
            const job: PrintJob = {
              sop: sop, inputs: payload, margin: payload.safetyMargin, items: this.calculatedItems(),
              date: new Date(), user: this.state.currentUser()?.displayName, analysisDate: payload.analysisDate,
              requestId: result.logId 
            };
            this.printService.openPreview([job]); // UPDATED: Use Preview
        }
    } catch (e: any) { } finally {
        this.isProcessing.set(false);
    }
  }

  async sendRequest(sop: Sop) {
    if (this.isProcessing()) return;
    this.isProcessing.set(true);
    try {
        const payload = this.getPayloadData();
        await this.state.submitRequest(sop, this.calculatedItems(), payload, this.localInventoryMap());
    } finally {
        this.isProcessing.set(false);
    }
  }

  async saveEditedRequest(sop: Sop) {
      const req = this.editingRequest();
      if (!req) return;
      if (this.isProcessing()) return;
      this.isProcessing.set(true);
      try {
          const payload = this.getPayloadData();
          const success = await this.state.updateApprovedRequest(req, sop, this.calculatedItems(), payload, this.localInventoryMap());
          if (success) {
              this.router.navigate(['/requests']);
          }
      } finally {
          this.isProcessing.set(false);
      }
  }

  cancelEdit() {
      this.router.navigate(['/requests']);
  }

  // --- QUICK GENERATE MODAL HANDLERS ---
  openQuickGenerateModal() {
      this.quickGenerateModalOpen.set(true);
  }

  closeQuickGenerateModal() {
      this.quickGenerateModalOpen.set(false);
  }

  handleGeneratedSamples(samples: string[]) {
      const currentSamples = this.sampleListText();
      const newSamplesStr = samples.join('\n');
      const updatedSamples = currentSamples 
          ? `${currentSamples.trim()}\n${newSamplesStr}` 
          : newSamplesStr;
          
      this.onSampleListChange(updatedSamples);
      this.toast.show(`Đã thêm ${samples.length} mẫu vào danh sách.`, 'success');
      this.closeQuickGenerateModal();
  }
}
