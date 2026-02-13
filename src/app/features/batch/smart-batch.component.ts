
import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../core/services/state.service';
import { AuthService } from '../../core/services/auth.service';
import { CalculatorService } from '../../core/services/calculator.service';
import { RecipeService } from '../recipes/recipe.service';
import { TargetService } from '../targets/target.service'; 
import { InventoryService } from '../inventory/inventory.service';
import { Sop, SopTarget, CalculatedItem, TargetGroup } from '../../core/models/sop.model';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { PrintService, PrintJob } from '../../core/services/print.service';
import { formatNum, generateSlug, formatSampleList } from '../../shared/utils/utils';
import { InventoryItem } from '../../core/models/inventory.model';
import { Recipe } from '../../core/models/recipe.model';

// --- DATA MODELS ---

interface JobBlock {
    id: number;
    name: string;
    rawSamples: string;
    selectedTargets: Set<string>;
    targetSearch: string;
    isCollapsed: boolean;
}

interface AnalysisTask {
    sample: string;
    targetId: string;
    targetName: string;
    covered: boolean;
}

interface ProposedBatch {
    id: string; 
    name: string; 
    sop: Sop;
    targets: SopTarget[]; 
    samples: Set<string>; 
    sampleCount: number;
    tasks: AnalysisTask[]; // TRACKING TASKS (Task-Based Logic)
    inputValues: Record<string, any>; 
    safetyMargin: number;
    resourceImpact: CalculatedItem[];
    status: 'ready' | 'missing_stock' | 'processed';
    tags?: string[]; 
    isExpanded?: boolean; 
}

// Wizard State for Split Modal
interface SplitWizardState {
    step: 1 | 2 | 3;
    sourceBatchIndex: number;
    sourceBatchName: string;
    availableSamples: string[]; // From Source
    selectedSamples: Set<string>; // Step 1 Output
    
    availableTargets: SopTarget[]; // From Source (What source was doing)
    selectedTargets: Set<string>; // Step 2 Output (What we want new batch to do)
    
    selectedSopId: string | null; // Step 3 Output
}

@Component({
  selector: 'app-smart-batch',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col fade-in pb-0 relative font-sans text-slate-800">
        <!-- HEADER -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 shrink-0">
            <div>
                <h2 class="text-2xl font-black flex items-center gap-3 text-slate-800">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg">
                        <i class="fa-solid fa-wand-magic-sparkles"></i>
                    </div>
                    Chạy Mẻ Thông Minh (Smart Batch)
                </h2>
                <p class="text-xs font-medium text-slate-500 mt-1 ml-1">Tự động ghép SOP theo chỉ tiêu & tối ưu hóa chất.</p>
            </div>
            
            <div class="flex gap-2">
                @if(step() === 2) {
                    <button (click)="reset()" class="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50 transition">
                        <i class="fa-solid fa-rotate-left mr-1"></i> Quay lại
                    </button>
                    <!-- Approve button moved to Coverage Bar -->
                }
            </div>
        </div>

        <div class="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-hidden relative mb-14">
            
            <!-- STEP 1: JOB BUILDER -->
            @if(step() === 1) {
                <!-- Left: Blocks List -->
                <div class="flex-1 flex flex-col min-h-0 bg-transparent gap-4">
                    <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                        
                        @for (block of blocks(); track block.id; let i = $index) {
                            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-slide-up transition-all hover:shadow-md group">
                                <!-- Block Header -->
                                <div class="bg-slate-50/50 p-3 flex justify-between items-center border-b border-slate-100 cursor-pointer" 
                                     (click)="toggleBlockCollapse(i)">
                                    <div class="flex items-center gap-3">
                                        <div class="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">{{i + 1}}</div>
                                        @if(isEditingName() === block.id) {
                                            <input [ngModel]="block.name" (ngModelChange)="updateBlockName(i, $event)" 
                                                   (blur)="isEditingName.set(null)" (keyup.enter)="isEditingName.set(null)" (click)="$event.stopPropagation()"
                                                   class="font-bold text-sm bg-white border border-slate-300 rounded px-2 py-1 outline-none focus:border-teal-500" autofocus>
                                        } @else {
                                            <h3 class="font-bold text-slate-700 text-sm flex items-center gap-2" (dblclick)="isEditingName.set(block.id)">
                                                {{block.name}} <i class="fa-solid fa-pen text-[10px] text-slate-300 opacity-0 group-hover:opacity-100"></i>
                                            </h3>
                                        }
                                        <span class="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
                                            {{ countSamples(block.rawSamples) }} mẫu • {{ block.selectedTargets.size }} chỉ tiêu
                                        </span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <button (click)="duplicateBlock(i); $event.stopPropagation()" class="w-8 h-8 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition" title="Nhân bản">
                                            <i class="fa-regular fa-clone"></i>
                                        </button>
                                        <button (click)="removeBlock(i); $event.stopPropagation()" class="w-8 h-8 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition" title="Xóa">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                        <i class="fa-solid fa-chevron-down text-slate-400 text-xs transition-transform duration-300 ml-2" [class.rotate-180]="block.isCollapsed"></i>
                                    </div>
                                </div>

                                <!-- Block Body -->
                                @if(!block.isCollapsed) {
                                    <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <!-- Sample Input -->
                                        <div>
                                            <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Danh sách mẫu</label>
                                            <textarea [ngModel]="block.rawSamples" (ngModelChange)="updateBlockSamples(i, $event)"
                                                      class="w-full h-40 p-3 text-sm font-mono border border-slate-200 rounded-xl focus:border-teal-500 focus:ring-1 focus:ring-teal-200 outline-none resize-none bg-slate-50 focus:bg-white transition"
                                                      placeholder="A01&#10;A02&#10;..."></textarea>
                                        </div>

                                        <!-- Target Selector -->
                                        <div class="flex flex-col h-40">
                                            <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Chỉ tiêu kiểm nghiệm</label>
                                            <div class="flex gap-2 mb-2">
                                                <div class="relative flex-1">
                                                    <i class="fa-solid fa-search absolute left-2.5 top-2.5 text-slate-400 text-xs"></i>
                                                    <input [ngModel]="block.targetSearch" (ngModelChange)="updateBlockSearch(i, $event)"
                                                           class="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-teal-500 transition"
                                                           placeholder="Tìm chỉ tiêu...">
                                                </div>
                                                <button (click)="openGroupModal(i)" class="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition flex items-center gap-1 text-[10px] font-bold" title="Chọn từ Bộ chỉ tiêu">
                                                    <i class="fa-solid fa-layer-group"></i> Groups
                                                </button>
                                                <button (click)="selectAllTargets(i)" class="px-2 py-1.5 bg-teal-50 text-teal-700 rounded-lg border border-teal-100 hover:bg-teal-100 transition" title="Chọn tất cả">
                                                    <i class="fa-solid fa-check-double text-xs"></i>
                                                </button>
                                                <button (click)="deselectAllTargets(i)" class="px-2 py-1.5 bg-slate-50 text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-100 transition" title="Bỏ chọn tất cả">
                                                    <i class="fa-solid fa-xmark text-xs"></i>
                                                </button>
                                            </div>
                                            
                                            <div class="flex-1 border border-slate-200 rounded-xl overflow-y-auto custom-scrollbar p-1 bg-white">
                                                @for (t of getFilteredTargets(block); track t.uniqueKey) {
                                                    <label class="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded cursor-pointer group"
                                                           [class.bg-teal-50]="block.selectedTargets.has(t.uniqueKey)">
                                                        <input type="checkbox" 
                                                               [checked]="block.selectedTargets.has(t.uniqueKey)" 
                                                               (change)="toggleBlockTarget(i, t.uniqueKey)" 
                                                               class="w-3.5 h-3.5 accent-teal-600 rounded cursor-pointer">
                                                        <div class="flex-1 min-w-0">
                                                            <div class="text-xs font-bold text-slate-700 truncate group-hover:text-teal-700">{{t.name}}</div>
                                                        </div>
                                                    </label>
                                                }
                                                @if(getFilteredTargets(block).length === 0) {
                                                    <div class="text-center py-4 text-slate-400 text-[10px] italic">Không tìm thấy.</div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        }

                        <button (click)="addBlock()" class="w-full py-3 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold text-sm hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 transition flex items-center justify-center gap-2">
                            <i class="fa-solid fa-plus-circle"></i> Thêm Nhóm Mẫu Mới
                        </button>
                    </div>
                </div>

                <!-- Right: Summary Dashboard -->
                <div class="w-full lg:w-80 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-fit sticky top-0">
                    <h4 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <i class="fa-solid fa-chart-pie text-teal-500"></i> Cấu hình Phân tích
                    </h4>
                    
                    <div class="space-y-4 mb-6">
                        <div class="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span class="text-xs text-slate-500 font-bold">Tổng mẫu (Unique)</span>
                            <span class="text-lg font-black text-slate-800">{{ totalUniqueSamples() }}</span>
                        </div>
                        <div class="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span class="text-xs text-slate-500 font-bold">Tổng chỉ tiêu</span>
                            <span class="text-lg font-black text-slate-800">{{ totalUniqueTargets() }}</span>
                        </div>
                    </div>

                    <div class="pt-4 border-t border-slate-100">
                        <button (click)="analyzePlan()" [disabled]="totalUniqueSamples() === 0 || totalUniqueTargets() === 0 || isProcessing()"
                                class="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group">
                            @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> Xử lý... }
                            @else { <span>Phân tích & Lập Kế hoạch</span> <i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i> }
                        </button>
                    </div>
                </div>
            }

            <!-- STEP 2: REVIEW PLAN -->
            @if(step() === 2) {
                <!-- Left: Batches -->
                <div class="w-full lg:w-2/3 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 animate-fade-in pb-10">
                    
                    <div class="relative w-full shadow-sm">
                        <i class="fa-solid fa-search absolute left-3 top-2.5 text-slate-400 text-xs"></i>
                        <input [ngModel]="sampleSearchTerm()" (ngModelChange)="sampleSearchTerm.set($event)"
                               class="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white"
                               placeholder="Tìm vị trí mẫu (VD: A05)...">
                    </div>

                    @if (unmappedTasks().length > 0) {
                        <div class="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                            <i class="fa-solid fa-circle-exclamation text-red-500 mt-0.5"></i>
                            <div>
                                <h4 class="text-sm font-bold text-red-800 mb-1">Cảnh báo: Không tìm thấy Quy trình (SOP)</h4>
                                <div class="text-xs text-red-600 mb-2">Các yêu cầu sau không thể thực hiện do không có SOP phù hợp trong hệ thống:</div>
                                <div class="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                                    @for(task of unmappedTasks(); track task.sample + task.targetId) {
                                        <span class="bg-white px-2 py-1 rounded text-[10px] font-bold text-red-600 border border-red-100 flex items-center gap-1">
                                            {{task.sample}} <i class="fa-solid fa-arrow-right text-[8px] text-red-300"></i> {{task.targetName}}
                                        </span>
                                    }
                                </div>
                            </div>
                        </div>
                    }

                    @for (batch of batches(); track batch.id; let batchIdx = $index) {
                        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 group"
                             [class.border-l-4]="true"
                             [class.border-l-emerald-500]="batch.status === 'ready' && !batch.name.includes('(Tách)')"
                             [class.border-l-red-500]="batch.status === 'missing_stock'"
                             [class.border-l-yellow-400]="batch.name.includes('(Tách)') && batch.status !== 'missing_stock'"
                             [class.ring-2]="matchesSearch(batch)"
                             [class.ring-blue-400]="matchesSearch(batch)"
                             [class.opacity-40]="sampleSearchTerm() && !matchesSearch(batch)">

                            <!-- Header Section -->
                            <div class="p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition" (click)="toggleBatchDetails(batchIdx)">
                                <!-- Top Row: Category & Status Badges -->
                                <div class="flex justify-between items-start mb-2">
                                    <div class="flex items-center gap-2">
                                        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{{batch.sop.category}}</span>
                                        
                                        @if(batch.status === 'missing_stock') {
                                            <span class="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold border border-red-200 flex items-center gap-1">
                                                <i class="fa-solid fa-triangle-exclamation"></i> Thiếu hàng
                                            </span>
                                        }
                                        @if(batch.name.includes('(Tách)')) {
                                             <span class="text-[9px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-bold border border-yellow-200 animate-pulse flex items-center gap-1">
                                                <i class="fa-solid fa-star text-[8px]"></i> Mới tách
                                            </span>
                                        }
                                    </div>
                                    
                                    <!-- Action Buttons -->
                                    <div class="flex gap-2">
                                         <button (click)="openSplitModal(batchIdx); $event.stopPropagation()" class="text-xs px-2 py-1.5 rounded bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 transition shadow-sm active:scale-95 flex items-center gap-1" title="Tách mẻ này">
                                            <i class="fa-solid fa-shuffle"></i> <span class="hidden sm:inline">Tách</span>
                                        </button>
                                        <button class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 transition" title="Mở rộng / Thu gọn">
                                            <i class="fa-solid fa-chevron-down transition-transform duration-300" [class.rotate-180]="batch.isExpanded"></i>
                                        </button>
                                    </div>
                                </div>

                                <!-- Main Title & Sample Range -->
                                <div class="mb-3">
                                    <h3 class="text-base font-bold text-slate-800 leading-tight mb-2">
                                        {{batch.name}} <span class="text-slate-400 font-normal text-xs">({{batch.sop.name}})</span>
                                    </h3>
                                    
                                    <!-- Consolidated Sample Display -->
                                    <div class="flex items-center gap-2 group/tooltip relative w-fit max-w-full" (click)="$event.stopPropagation()">
                                        <div class="bg-indigo-50 text-indigo-700 px-2 py-1.5 rounded text-xs font-mono font-bold border border-indigo-100 flex items-center gap-2 cursor-help shadow-sm truncate max-w-full">
                                            <span class="bg-white px-1.5 rounded text-[10px] shadow-sm text-slate-500 border border-slate-100 shrink-0">{{batch.samples.size}} mẫu</span>
                                            <span class="truncate">{{ formatSampleList(batch.samples) }}</span>
                                        </div>
                                        <!-- Hover Tooltip for full list -->
                                        <div class="absolute left-0 top-full mt-2 w-64 bg-slate-800 text-white text-[10px] p-3 rounded-xl shadow-xl opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition z-20 hidden group-hover/tooltip:block border border-slate-700">
                                            <div class="font-bold border-b border-slate-600 pb-1 mb-1 text-slate-300 uppercase tracking-wider">Danh sách chi tiết</div>
                                            <div class="font-mono leading-relaxed break-words text-slate-200">{{ getFullSampleString(batch.samples) }}</div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Tags (Targets) -->
                                <div class="flex flex-wrap gap-1">
                                    @for(t of batch.targets; track t.id) {
                                        <span class="px-1.5 py-0.5 bg-slate-50 text-slate-500 rounded text-[9px] border border-slate-200 font-bold">{{t.name}}</span>
                                    }
                                </div>
                            </div>

                            <!-- Controls (Gray Block - Always Visible) -->
                            <div class="bg-slate-50 p-3 border-b border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-3">
                                <!-- DYNAMIC INPUTS -->
                                @for (inp of batch.sop.inputs; track inp.var) {
                                    @if(inp.var !== 'n_sample' && inp.var !== 'safetyMargin') {
                                        <div class="group">
                                            <label class="text-[9px] font-bold text-slate-400 uppercase block mb-1 truncate" [title]="inp.label">{{inp.label}}</label>
                                            @switch (inp.type) {
                                                @case ('select') {
                                                    <select [ngModel]="batch.inputValues[inp.var]" 
                                                            (ngModelChange)="updateBatchInput(batchIdx, inp.var, $event)"
                                                            class="w-full bg-white border border-slate-200 rounded-lg px-1 py-1 text-xs font-bold text-slate-700 outline-none focus:border-teal-500 cursor-pointer h-8 shadow-sm">
                                                        @for (opt of inp.options; track opt.value) {
                                                            <option [value]="opt.value">{{opt.label}}</option>
                                                        }
                                                    </select>
                                                }
                                                @case ('checkbox') {
                                                    <div class="flex items-center h-8 bg-white border border-slate-200 rounded-lg px-2">
                                                        <label class="flex items-center gap-2 cursor-pointer w-full">
                                                            <input type="checkbox" 
                                                                   [ngModel]="batch.inputValues[inp.var]" 
                                                                   (ngModelChange)="updateBatchInput(batchIdx, inp.var, $event)"
                                                                   class="w-4 h-4 accent-teal-600 rounded">
                                                            <span class="text-xs font-bold text-slate-700">{{batch.inputValues[inp.var] ? 'Bật' : 'Tắt'}}</span>
                                                        </label>
                                                    </div>
                                                }
                                                @default {
                                                    <div class="relative">
                                                        <input type="number" 
                                                               [ngModel]="batch.inputValues[inp.var]" 
                                                               (ngModelChange)="updateBatchInput(batchIdx, inp.var, $event)"
                                                               [step]="inp.step || 1"
                                                               class="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 text-center outline-none focus:border-teal-500 transition h-8 shadow-sm">
                                                        @if(inp.unitLabel) {
                                                            <span class="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] text-slate-400 font-bold pointer-events-none">{{inp.unitLabel}}</span>
                                                        }
                                                    </div>
                                                }
                                            }
                                        </div>
                                    }
                                }
                                <!-- Safety Margin -->
                                <div>
                                    <label class="text-[9px] font-bold text-slate-400 uppercase block mb-1">Hao hụt (%)</label>
                                    @if(batch.safetyMargin === -1) {
                                        <div (click)="setBatchMarginManual(batchIdx)" 
                                             class="w-full bg-orange-50 border border-orange-200 text-orange-700 text-[10px] font-bold py-1.5 px-2 rounded-lg cursor-pointer text-center flex items-center justify-center gap-1 hover:bg-orange-100 transition shadow-sm h-8">
                                            <i class="fa-solid fa-wand-magic-sparkles"></i> Auto
                                        </div>
                                    } @else {
                                        <input type="number" 
                                               [ngModel]="batch.safetyMargin" 
                                               (ngModelChange)="updateBatchMargin(batchIdx, $event)"
                                               class="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 text-center outline-none focus:border-orange-500 transition h-8 shadow-sm">
                                    }
                                </div>
                            </div>

                            <!-- Resource Table (ACCORDION) -->
                            @if (batch.isExpanded) {
                                <div class="w-full bg-white animate-slide-down">
                                    <table class="w-full text-xs text-left border-collapse">
                                        <thead class="bg-white text-slate-400 border-b border-slate-50">
                                            <tr>
                                                <th class="px-5 py-2 font-bold uppercase text-[9px] tracking-wider">Hóa chất / Vật tư</th>
                                                <th class="px-5 py-2 font-bold uppercase text-[9px] text-right tracking-wider">Lượng cần</th>
                                                <th class="px-5 py-2 w-20"></th> <!-- Action Column -->
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-slate-50">
                                            @for(item of batch.resourceImpact; track item.name) {
                                                <!-- Parent Item -->
                                                <tr class="hover:bg-slate-50 transition group/row">
                                                    <td class="px-5 py-2 align-middle">
                                                        <div class="truncate max-w-[200px] font-medium text-slate-700 text-xs" [title]="item.displayName || item.name" [class.text-red-600]="item.isMissing">
                                                            {{item.displayName || item.name}}
                                                            @if(item.isComposite) { <span class="text-[9px] text-slate-400 italic font-normal ml-1">(Mix)</span> }
                                                        </div>
                                                    </td>
                                                    <td class="px-5 py-2 text-right font-mono font-bold text-slate-600 text-xs">
                                                        {{formatNum(item.stockNeed)}} <span class="text-[9px] text-slate-400 font-normal">{{item.stockUnit}}</span>
                                                    </td>
                                                    <td class="px-5 py-2 text-right">
                                                        @if(item.isMissing && !item.isComposite) {
                                                            <button (click)="openQuickImport(item)" class="text-[9px] bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 rounded font-bold border border-red-100 flex items-center gap-1 transition ml-auto">
                                                                <i class="fa-solid fa-bolt"></i> Bù kho
                                                            </button>
                                                        }
                                                    </td>
                                                </tr>
                                                <!-- Sub Items -->
                                                @if(item.isComposite) {
                                                    @for(sub of item.breakdown; track sub.name) {
                                                        <tr class="bg-slate-50/30">
                                                            <td class="px-5 py-1 pl-8 align-middle">
                                                                <div class="truncate max-w-[180px] text-[10px] text-slate-500 flex items-center gap-1.5" [class.text-red-500]="sub.isMissing">
                                                                    <div class="w-1 h-1 rounded-full bg-slate-300"></div> {{sub.displayName || sub.name}}
                                                                </div>
                                                            </td>
                                                            <td class="px-5 py-1 text-right font-mono text-[10px] text-slate-500">
                                                                {{formatNum(sub.totalNeed)}} {{sub.stockUnit}}
                                                            </td>
                                                            <td class="px-5 py-1 text-right">
                                                                @if(sub.isMissing) {
                                                                    <button (click)="openQuickImport(sub)" class="text-[9px] bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 rounded font-bold border border-red-100 flex items-center gap-1 transition ml-auto">
                                                                        <i class="fa-solid fa-bolt"></i> Bù
                                                                    </button>
                                                                }
                                                            </td>
                                                        </tr>
                                                    }
                                                }
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            } @else {
                                <!-- SUMMARY VIEW (When collapsed) -->
                                <div class="px-4 py-2 bg-white flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 transition" (click)="toggleBatchDetails(batchIdx)">
                                    @let missingCount = getMissingCount(batch);
                                    @let totalItems = countTotalItems(batch);
                                    
                                    @if(missingCount > 0) {
                                        <div class="text-red-600 font-bold flex items-center gap-2">
                                            <i class="fa-solid fa-circle-xmark"></i> Thiếu {{missingCount}} hóa chất
                                        </div>
                                    } @else {
                                        <div class="text-emerald-600 font-bold flex items-center gap-2">
                                            <i class="fa-solid fa-circle-check"></i> Đủ {{totalItems}}/{{totalItems}} hóa chất
                                        </div>
                                    }
                                    <div class="text-slate-400 text-[10px] font-medium flex items-center gap-1">
                                        Xem chi tiết <i class="fa-solid fa-angle-down"></i>
                                    </div>
                                </div>
                            }
                        </div>
                    }
                </div>

                <!-- Right: Summary & Action -->
                <div class="w-full lg:w-1/3 flex flex-col gap-4 h-fit sticky top-4">
                    <!-- Stock Summary -->
                    @if (missingStockSummary().length > 0) {
                        <div class="bg-red-50 border border-red-100 rounded-2xl p-5 shadow-sm animate-slide-up">
                            <h4 class="font-bold text-red-800 text-sm mb-3 flex items-center gap-2">
                                <i class="fa-solid fa-cart-shopping"></i> Dự trù Mua sắm
                            </h4>
                            <div class="overflow-hidden rounded-xl border border-red-100">
                                <table class="w-full text-xs text-left">
                                    <thead class="bg-red-100/50 text-red-800 uppercase font-bold">
                                        <tr><th class="px-3 py-2">Hóa chất</th><th class="px-3 py-2 text-right">Thiếu hụt</th><th class="px-2 w-10"></th></tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-red-50">
                                        @for (item of missingStockSummary(); track item.name) {
                                            <tr>
                                                <td class="px-3 py-2 font-medium text-slate-700 truncate max-w-[120px]">{{item.name}}</td>
                                                <td class="px-3 py-2 text-right font-bold text-red-600 font-mono">-{{formatNum(item.missing)}} {{item.unit}}</td>
                                                <td class="px-2 py-1 text-center">
                                                    <button (click)="openQuickImport(item)" class="text-red-500 hover:bg-red-50 w-6 h-6 rounded flex items-center justify-center transition" title="Nhập nhanh">
                                                        <i class="fa-solid fa-plus-circle"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }
                </div>
            }
        </div>

        <!-- NEW: Coverage Status Bar (Bottom Sticky) -->
        @if(step() === 2) {
            <div class="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40 transition-transform duration-300">
                <div class="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    
                    <!-- Metrics -->
                    <div class="flex items-center gap-6 text-sm flex-1">
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                                 [class]="coverageMetrics().isFullyCovered ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600 animate-pulse'">
                                <i class="fa-solid" [class]="coverageMetrics().isFullyCovered ? 'fa-check' : 'fa-triangle-exclamation'"></i>
                            </div>
                            <div>
                                <div class="font-bold" [class]="coverageMetrics().isFullyCovered ? 'text-green-700' : 'text-red-700'">
                                    {{ coverageMetrics().isFullyCovered ? 'Đã phủ kín toàn bộ yêu cầu' : 'Cảnh báo: Chưa phủ hết yêu cầu!' }}
                                </div>
                                <div class="text-xs text-slate-500">
                                    Thiếu <b>{{coverageMetrics().missingCount}}</b> chỉ tiêu/mẫu. 
                                    @if(coverageMetrics().duplicateCount > 0) { <span class="text-orange-600 ml-1">(Trùng lặp: {{coverageMetrics().duplicateCount}})</span> }
                                </div>
                            </div>
                        </div>
                        
                        @if(!coverageMetrics().isFullyCovered) {
                            <div class="hidden md:block text-xs bg-red-50 text-red-700 px-3 py-1.5 rounded-lg border border-red-100">
                                <i class="fa-solid fa-circle-info mr-1"></i> Kiểm tra các mẫu: {{ coverageMetrics().missingSampleNames }}
                            </div>
                        }
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-3">
                        @if(!coverageMetrics().isFullyCovered) {
                            <button (click)="fixCoverage()" class="px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold text-xs transition shadow-sm">
                                <i class="fa-solid fa-wand-magic-sparkles"></i> Tự động sửa
                            </button>
                        }
                        
                        <button (click)="executeAll()" 
                                [disabled]="isProcessing() || batches().length === 0 || hasCriticalMissing() || !coverageMetrics().isFullyCovered" 
                                class="px-8 py-3 bg-slate-900 text-white hover:bg-black rounded-xl font-bold text-sm shadow-lg transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                            @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> Xử lý... }
                            @else { <i class="fa-solid fa-paper-plane"></i> Duyệt & In Phiếu }
                        </button>
                    </div>
                </div>
            </div>
        }

        <!-- Group Modal (Unchanged) -->
        @if (showGroupModal()) {
            <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
                <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh] animate-slide-up">
                    <div class="px-5 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                        <h3 class="font-black text-slate-800 text-lg">Chọn Bộ Chỉ tiêu (Groups)</h3>
                        <button (click)="showGroupModal.set(false)" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-times text-lg"></i></button>
                    </div>
                    <div class="flex-1 overflow-y-auto p-2 custom-scrollbar">
                        @if (availableGroups().length === 0) {
                            <div class="p-8 text-center text-slate-400 italic text-sm"><i class="fa-solid fa-spinner fa-spin mb-2 text-xl"></i><br>Đang tải hoặc chưa có bộ chỉ tiêu nào.</div>
                        } @else {
                            @for(g of availableGroups(); track g.id) {
                                <div (click)="importGroup(g)" class="p-4 border-b border-slate-50 hover:bg-indigo-50 cursor-pointer transition group">
                                    <div class="font-bold text-slate-700 text-sm group-hover:text-indigo-700">{{g.name}}</div>
                                    <div class="text-[10px] text-slate-500 mt-1 flex justify-between"><span>{{g.targets.length}} chỉ tiêu</span></div>
                                </div>
                            }
                        }
                    </div>
                </div>
            </div>
        }

        <!-- REVERSE LOGIC SPLIT MODAL (3-STEP WIZARD) -->
        @if (showSplitModal()) {
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col h-[85vh] animate-slide-up">
                    
                    <!-- Header -->
                    <div class="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                        <div>
                            <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
                                <i class="fa-solid fa-shuffle text-blue-600"></i> Phân tách & Chuyển Mẻ
                            </h3>
                            <p class="text-xs text-slate-500 mt-0.5">Nguồn: <b>{{splitState().sourceBatchName}}</b></p>
                        </div>
                        <button (click)="showSplitModal.set(false)" class="text-slate-400 hover:text-red-500 transition"><i class="fa-solid fa-times text-xl"></i></button>
                    </div>

                    <!-- Steps Indicator -->
                    <div class="flex border-b border-slate-100 bg-white">
                        <div class="flex-1 py-3 text-center text-xs font-bold border-b-2 transition-colors" [class]="splitState().step >= 1 ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-300'">1. Chọn Mẫu</div>
                        <div class="flex-1 py-3 text-center text-xs font-bold border-b-2 transition-colors" [class]="splitState().step >= 2 ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-300'">2. Chọn Chỉ tiêu</div>
                        <div class="flex-1 py-3 text-center text-xs font-bold border-b-2 transition-colors" [class]="splitState().step >= 3 ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-300'">3. Chọn Quy trình Mới</div>
                    </div>

                    <!-- Wizard Content -->
                    <div class="flex-1 overflow-hidden bg-slate-50 relative p-6">
                        
                        <!-- STEP 1: SELECT SAMPLES -->
                        @if (splitState().step === 1) {
                            <div class="h-full flex flex-col gap-3 animate-fade-in">
                                <div class="flex justify-between items-center mb-2">
                                    <h4 class="text-sm font-bold text-slate-700 uppercase">Chọn mẫu cần chuyển đi</h4>
                                    <div class="text-xs space-x-2">
                                        <button (click)="splitSelectAllSamples()" class="text-blue-600 hover:underline font-bold">Chọn hết</button>
                                        <button (click)="splitDeselectAllSamples()" class="text-slate-400 hover:text-slate-600">Bỏ chọn</button>
                                    </div>
                                </div>
                                <div class="flex-1 overflow-y-auto custom-scrollbar bg-white rounded-xl border border-slate-200 p-4">
                                    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                        @for(sample of splitState().availableSamples; track sample) {
                                            <div (click)="toggleSplitSample(sample)" 
                                                 class="p-2 rounded-lg border cursor-pointer text-center transition select-none"
                                                 [class]="splitState().selectedSamples.has(sample) ? 'bg-blue-600 border-blue-600 text-white shadow-md transform scale-105' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-blue-50'">
                                                <span class="text-xs font-mono font-bold">{{sample}}</span>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        }

                        <!-- STEP 2: SELECT TARGETS -->
                        @if (splitState().step === 2) {
                            <div class="h-full flex flex-col gap-3 animate-fade-in">
                                <div class="flex justify-between items-center mb-2">
                                    <h4 class="text-sm font-bold text-slate-700 uppercase">Chọn chỉ tiêu cần thực hiện</h4>
                                    <div class="text-xs space-x-2">
                                        <button (click)="splitSelectAllTargets()" class="text-blue-600 hover:underline font-bold">Chọn hết</button>
                                        <button (click)="splitDeselectAllTargets()" class="text-slate-400 hover:text-slate-600">Bỏ chọn</button>
                                    </div>
                                </div>
                                <div class="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800 mb-2">
                                    <i class="fa-solid fa-circle-info mr-1"></i>
                                    Các mẫu đã chọn ({{splitState().selectedSamples.size}}) sẽ được chuyển sang mẻ mới để làm các chỉ tiêu này.
                                    Hệ thống đã tự động chọn các chỉ tiêu liên quan.
                                </div>
                                <div class="flex-1 overflow-y-auto custom-scrollbar bg-white rounded-xl border border-slate-200 p-2">
                                    @for(t of splitState().availableTargets; track t.id) {
                                        <label class="flex items-center gap-3 p-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 cursor-pointer">
                                            <input type="checkbox" 
                                                   [checked]="splitState().selectedTargets.has(t.id)" 
                                                   (change)="toggleSplitTarget(t.id)"
                                                   class="w-4 h-4 accent-blue-600 rounded">
                                            <span class="text-sm font-bold text-slate-700">{{t.name}}</span>
                                        </label>
                                    }
                                </div>
                            </div>
                        }

                        <!-- STEP 3: SELECT SOP -->
                        @if (splitState().step === 3) {
                            <div class="h-full flex flex-col gap-3 animate-fade-in">
                                <h4 class="text-sm font-bold text-slate-700 uppercase mb-2">Đề xuất Quy trình (SOP) phù hợp</h4>
                                <div class="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                                    @for(sop of filteredSopsForSplit(); track sop.id) {
                                        <div (click)="selectSplitSop(sop.id)" 
                                             class="p-4 rounded-xl border cursor-pointer transition flex justify-between items-center group relative overflow-hidden"
                                             [class]="splitState().selectedSopId === sop.id ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'">
                                            
                                            <!-- Selection Indicator -->
                                            @if(splitState().selectedSopId === sop.id) {
                                                <div class="absolute top-0 right-0 w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-bl-xl"><i class="fa-solid fa-check text-sm"></i></div>
                                            }

                                            <div>
                                                <div class="font-bold text-slate-800 group-hover:text-blue-700">{{sop.name}}</div>
                                                <div class="text-xs text-slate-500 mt-1">{{sop.category}}</div>
                                            </div>
                                            <div class="text-right mr-6">
                                                <div class="text-[10px] font-bold uppercase text-slate-400">Độ phủ</div>
                                                <div class="text-lg font-black text-emerald-600">100%</div>
                                            </div>
                                        </div>
                                    }
                                    @if(filteredSopsForSplit().length === 0) {
                                        <div class="p-8 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                                            <i class="fa-solid fa-filter-circle-xmark text-2xl mb-2"></i>
                                            <p class="text-sm">Không tìm thấy SOP nào phủ hết các chỉ tiêu đã chọn.</p>
                                            <button (click)="prevSplitStep()" class="text-blue-600 font-bold hover:underline mt-2 text-xs">Quay lại chọn ít chỉ tiêu hơn</button>
                                        </div>
                                    }
                                </div>
                            </div>
                        }

                    </div>

                    <!-- Footer Buttons -->
                    <div class="p-4 bg-white border-t border-slate-200 flex justify-between items-center shrink-0">
                        @if (splitState().step > 1) {
                            <button (click)="prevSplitStep()" class="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-sm transition">
                                <i class="fa-solid fa-arrow-left mr-1"></i> Quay lại
                            </button>
                        } @else {
                            <div></div>
                        }

                        @if (splitState().step < 3) {
                            <button (click)="nextSplitStep()" 
                                    [disabled]="(splitState().step === 1 && splitState().selectedSamples.size === 0) || (splitState().step === 2 && splitState().selectedTargets.size === 0)"
                                    class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed">
                                Tiếp tục <i class="fa-solid fa-arrow-right ml-1"></i>
                            </button>
                        } @else {
                            <button (click)="executeSplit()" 
                                    [disabled]="!splitState().selectedSopId"
                                    class="px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-md transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                                <i class="fa-solid fa-check mr-1"></i> Hoàn tất Tách Mẻ
                            </button>
                        }
                    </div>
                </div>
            </div>
        }

        <!-- QUICK IMPORT MODAL -->
        @if (showQuickImport()) {
            <div class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
                <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-bounce-in">
                    <div class="p-5 border-b border-slate-100 flex justify-between items-start">
                        <div>
                            <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
                                <i class="fa-solid fa-bolt text-yellow-500"></i> Nhập Kho Nhanh
                            </h3>
                            <p class="text-xs text-slate-500 mt-1">Bù hàng cho mẻ phân tích</p>
                        </div>
                        <button (click)="showQuickImport.set(false)" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-times"></i></button>
                    </div>
                    
                    <div class="p-5 space-y-4">
                        <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <div class="text-xs font-bold text-slate-500 uppercase mb-1">Hóa chất</div>
                            <div class="font-bold text-slate-800 text-sm truncate">{{quickImportState().name}}</div>
                            <div class="flex justify-between mt-2 pt-2 border-t border-slate-200">
                                <div class="text-[10px]">Tồn: <b class="text-slate-700">{{formatNum(quickImportState().currentStock)}}</b></div>
                                <div class="text-[10px]">Thiếu: <b class="text-red-600">-{{formatNum(quickImportState().missingAmount)}}</b></div>
                            </div>
                        </div>

                        <div>
                            <label class="text-xs font-bold text-slate-700 uppercase block mb-1">Số lượng thực nhập</label>
                            <div class="relative">
                                <input type="number" [(ngModel)]="quickImportInput" class="w-full pl-4 pr-12 py-3 border border-slate-300 rounded-xl text-lg font-bold text-emerald-600 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" placeholder="0" autofocus>
                                <span class="absolute right-4 top-3.5 text-xs font-bold text-slate-400">{{quickImportState().unit}}</span>
                            </div>
                            <p class="text-[10px] text-slate-400 mt-1 italic">* Nhập trực tiếp theo đơn vị gốc ({{quickImportState().unit}})</p>
                        </div>
                    </div>

                    <div class="p-5 border-t border-slate-100 flex gap-3">
                        <button (click)="showQuickImport.set(false)" class="flex-1 py-3 text-slate-500 font-bold text-xs bg-slate-100 hover:bg-slate-200 rounded-xl transition">Hủy</button>
                        <button (click)="submitQuickImport()" [disabled]="quickImportInput <= 0 || isProcessing()" class="flex-[2] py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50">
                            Xác nhận Nhập
                        </button>
                    </div>
                </div>
            </div>
        }
    </div>
  `
})
export class SmartBatchComponent {
  state = inject(StateService);
  auth = inject(AuthService);
  calculator = inject(CalculatorService);
  recipeService = inject(RecipeService);
  targetService = inject(TargetService); 
  invService = inject(InventoryService);
  toast = inject(ToastService);
  confirmation = inject(ConfirmationService);
  printService = inject(PrintService);
  formatNum = formatNum;
  formatSampleList = formatSampleList;

  step = signal<number>(1);
  blocks = signal<JobBlock[]>([ { id: Date.now(), name: 'Nhóm Mẫu #1', rawSamples: '', selectedTargets: new Set<string>(), targetSearch: '', isCollapsed: false } ]);
  batches = signal<ProposedBatch[]>([]);
  unmappedTasks = signal<AnalysisTask[]>([]);
  isProcessing = signal(false);
  isEditingName = signal<number | null>(null);
  
  private inventoryCache: Record<string, InventoryItem> = {};
  private recipeCache: Record<string, Recipe> = {};
  
  sampleSearchTerm = signal('');
  
  // --- SPLIT WIZARD STATE ---
  showSplitModal = signal(false);
  splitState = signal<SplitWizardState>({ 
      step: 1,
      sourceBatchIndex: -1,
      sourceBatchName: '',
      availableSamples: [],
      selectedSamples: new Set(),
      availableTargets: [],
      selectedTargets: new Set(),
      selectedSopId: null
  });

  showGroupModal = signal(false);
  availableGroups = signal<TargetGroup[]>([]);
  currentBlockIndexForGroupImport = signal<number>(-1);

  // --- QUICK IMPORT STATE ---
  showQuickImport = signal(false);
  quickImportState = signal<{id: string, name: string, unit: string, currentStock: number, missingAmount: number}>({
      id: '', name: '', unit: '', currentStock: 0, missingAmount: 0
  });
  quickImportInput = 0;

  // --- COMPUTED: GENERAL ---
  allAvailableTargets = computed(() => { const targets = new Map<string, {id: string, name: string, uniqueKey: string}>(); this.state.sops().forEach(sop => { if (sop.targets) { sop.targets.forEach(t => { if (t.id && t.name) { targets.set(t.id, { id: t.id, name: t.name, uniqueKey: t.id }); } }); } }); return Array.from(targets.values()).sort((a,b) => a.name.localeCompare(b.name)); });
  
  totalUniqueSamples = computed(() => { const allSamples = new Set<string>(); this.blocks().forEach(b => { const samples = b.rawSamples.split('\n').map(s => s.trim()).filter(s => s); samples.forEach(s => allSamples.add(s)); }); return allSamples.size; });
  
  totalUniqueTargets = computed(() => { const allTargets = new Set<string>(); this.blocks().forEach(b => { b.selectedTargets.forEach(t => allTargets.add(t)); }); return allTargets.size; });
  
  hasCriticalMissing = computed(() => this.batches().some(b => b.status === 'missing_stock'));
  
  missingStockSummary = computed(() => { 
      const summary = new Map<string, any>(); 
      const ledger: Record<string, number> = {}; 
      Object.values(this.state.inventoryMap()).forEach((i: InventoryItem) => ledger[i.id] = i.stock); 
      for (const batch of this.batches()) { 
          for (const item of batch.resourceImpact) { 
              if (item.isComposite) { 
                  for (const sub of item.breakdown) { 
                      const current = ledger[sub.name] || 0; 
                      const remaining = current - sub.totalNeed; 
                      ledger[sub.name] = remaining; 
                      if (!summary.has(sub.name)) { summary.set(sub.name, { id: sub.name, name: sub.displayName || sub.name, unit: sub.stockUnit, missing: 0, currentStock: current }); } 
                  } 
              } else { 
                  const current = ledger[item.name] || 0; 
                  const remaining = current - item.stockNeed; 
                  ledger[item.name] = remaining; 
                  if (!summary.has(item.name)) { summary.set(item.name, { id: item.name, name: item.displayName || item.name, unit: item.stockUnit, missing: 0, currentStock: current }); } 
              } 
          } 
      } 
      const result: any[] = []; 
      summary.forEach((val, key) => { 
          const finalBalance = ledger[key]; 
          if (finalBalance < 0) { val.missing = Math.abs(finalBalance); result.push(val); } 
      }); 
      return result.sort((a,b) => b.missing - a.missing); 
  });

  // --- COMPUTED: COVERAGE STATUS BAR (Global Safety Net) ---
  coverageMetrics = computed(() => {
      // 1. Calculate Needs from Blocks (Input)
      const neededTasks = new Set<string>(); // "Sample|TargetID"
      const sampleNames: Record<string, string> = {}; // Helper for displaying names if sample ID is obscure (not used here but good practice)
      
      this.blocks().forEach(block => {
          const samples = block.rawSamples.split('\n').map(s => s.trim()).filter(s => s);
          samples.forEach(s => {
              block.selectedTargets.forEach(tId => {
                  neededTasks.add(`${s}|${tId}`);
              });
          });
      });

      // 2. Calculate Coverage from Batches (Output)
      const coveredTasks = new Set<string>();
      const duplicateTasks = new Set<string>();
      let dupCount = 0;

      this.batches().forEach(batch => {
          // Use tasks directly if available (Task-Based)
          if (batch.tasks && batch.tasks.length > 0) {
              batch.tasks.forEach(t => {
                  const key = `${t.sample}|${t.targetId}`;
                  if (coveredTasks.has(key)) {
                      duplicateTasks.add(key);
                      dupCount++;
                  }
                  coveredTasks.add(key);
              });
          } else {
              // Fallback for legacy structure (should not happen with new logic)
              const targetIds = batch.targets.map(t => t.id);
              batch.samples.forEach(s => {
                  targetIds.forEach(tId => {
                      const key = `${s}|${tId}`;
                      if (coveredTasks.has(key)) {
                          duplicateTasks.add(key);
                          dupCount++;
                      }
                      coveredTasks.add(key);
                  });
              });
          }
      });

      // 3. Diff
      const missingTasks: string[] = [];
      const missingSamples = new Set<string>();
      neededTasks.forEach(key => {
          if (!coveredTasks.has(key)) {
              missingTasks.push(key);
              const s = key.split('|')[0];
              missingSamples.add(s);
          }
      });

      // 4. Return Report
      return {
          isFullyCovered: missingTasks.length === 0,
          missingCount: missingTasks.length,
          duplicateCount: dupCount,
          missingSampleNames: Array.from(missingSamples).slice(0, 3).join(', ') + (missingSamples.size > 3 ? '...' : '')
      };
  });

  // --- COMPUTED: SPLIT WIZARD LOGIC ---
  filteredSopsForSplit = computed(() => {
      const s = this.splitState();
      // Only active in Step 3
      if (s.step !== 3) return [];

      const allSops = this.state.sops().filter(sop => !sop.isArchived);
      const reqTargets = s.selectedTargets;

      if (reqTargets.size === 0) return []; // Should not happen due to validation

      // Filter Logic: SOP must cover ALL selected targets (100% match of requirement)
      // Note: SOP can do *more* targets, but must cover *at least* the requested ones.
      return allSops.filter(sop => {
          if (!sop.targets) return false;
          const sopTargetIds = new Set(sop.targets.map(t => t.id));
          
          for (const reqId of Array.from(reqTargets)) {
              if (!sopTargetIds.has(reqId)) return false; // Missing one -> Invalid
          }
          return true;
      });
  });

  // --- METHODS ---

  getFullSampleString(samples: Set<string>): string {
      return Array.from(samples).sort().join(', ');
  }

  // ... Block management helpers ...
  addBlock() {
      this.blocks.update(b => [...b, { id: Date.now(), name: `Nhóm Mẫu #${b.length + 1}`, rawSamples: '', selectedTargets: new Set<string>(), targetSearch: '', isCollapsed: false }]);
  }
  removeBlock(index: number) { this.blocks.update(b => b.filter((_, i) => i !== index)); }
  duplicateBlock(index: number) {
      const src = this.blocks()[index];
      const newBlock = { ...src, id: Date.now(), name: src.name + ' (Copy)', selectedTargets: new Set(src.selectedTargets) };
      this.blocks.update(b => { const n = [...b]; n.splice(index + 1, 0, newBlock); return n; });
  }
  toggleBlockCollapse(index: number) { 
      this.blocks.update(b => { const n = [...b]; n[index] = { ...n[index], isCollapsed: !n[index].isCollapsed }; return n; }); 
  }
  updateBlockName(index: number, val: string) { this.blocks.update(b => { const n = [...b]; n[index] = { ...n[index], name: val }; return n; }); }
  updateBlockSamples(index: number, val: string) { this.blocks.update(b => { const n = [...b]; n[index] = { ...n[index], rawSamples: val }; return n; }); }
  updateBlockSearch(index: number, val: string) { this.blocks.update(b => { const n = [...b]; n[index] = { ...n[index], targetSearch: val }; return n; }); }
  
  countSamples(raw: string): number { return raw.split('\n').filter(s => s.trim()).length; }
  
  getFilteredTargets(block: JobBlock) {
      const term = block.targetSearch.toLowerCase().trim();
      const all = this.allAvailableTargets();
      if (!term) return all;
      return all.filter(t => t.name.toLowerCase().includes(term) || t.id.toLowerCase().includes(term));
  }
  
  toggleBlockTarget(index: number, targetId: string) {
      this.blocks.update(b => {
          const n = [...b]; const set = new Set(n[index].selectedTargets);
          if (set.has(targetId)) set.delete(targetId); else set.add(targetId);
          n[index] = { ...n[index], selectedTargets: set }; return n;
      });
  }
  selectAllTargets(index: number) {
      this.blocks.update(b => {
          const n = [...b]; const filtered = this.getFilteredTargets(n[index]);
          const set = new Set(n[index].selectedTargets);
          filtered.forEach(t => set.add(t.uniqueKey));
          n[index] = { ...n[index], selectedTargets: set }; return n;
      });
  }
  deselectAllTargets(index: number) {
      this.blocks.update(b => { const n = [...b]; n[index] = { ...n[index], selectedTargets: new Set() }; return n; });
  }

  // --- GROUP MODAL ---
  async openGroupModal(blockIndex: number) {
      this.currentBlockIndexForGroupImport.set(blockIndex);
      if (this.availableGroups().length === 0) {
          try { const groups = await this.targetService.getAllGroups(); this.availableGroups.set(groups); } catch(e) {}
      }
      this.showGroupModal.set(true);
  }
  importGroup(g: TargetGroup) {
      const idx = this.currentBlockIndexForGroupImport();
      if (idx >= 0) {
          this.blocks.update(b => {
              const n = [...b]; const set = new Set(n[idx].selectedTargets);
              g.targets.forEach(t => set.add(t.id));
              n[idx] = { ...n[idx], selectedTargets: set }; return n;
          });
          this.toast.show(`Đã thêm ${g.targets.length} chỉ tiêu.`, 'success');
      }
      this.showGroupModal.set(false);
  }

  // --- REWRITTEN: TARGET-CENTRIC GREEDY ALGORITHM (WEIGHTED) ---
  async analyzePlan() {
      this.isProcessing.set(true);
      try {
          // 1. Prefetch Data
          const [inv, recipes] = await Promise.all([
              this.invService.getAllInventory(),
              this.recipeService.getAllRecipes()
          ]);
          this.inventoryCache = {}; inv.forEach(i => this.inventoryCache[i.id] = i);
          this.recipeCache = {}; recipes.forEach(r => this.recipeCache[r.id] = r);

          const batches: ProposedBatch[] = [];
          const sops = this.state.sops().filter(s => !s.isArchived);

          // 2. Flatten User Request -> "Analysis Tasks"
          const allTasks: AnalysisTask[] = [];
          
          for (const block of this.blocks()) {
              const samples = block.rawSamples.split('\n').map(s => s.trim()).filter(s => s);
              if (samples.length === 0 || block.selectedTargets.size === 0) continue;
              
              for (const sample of samples) {
                  for (const targetId of block.selectedTargets) {
                      const tName = this.allAvailableTargets().find(t => t.id === targetId)?.name || targetId;
                      allTasks.push({
                          sample,
                          targetId,
                          targetName: tName,
                          covered: false
                      });
                  }
              }
          }

          // 3. Greedy Loop with Weighted Scoring
          let remainingTasks = allTasks.filter(t => !t.covered);
          let iterationLimit = 0;
          const MAX_ITERATIONS = 50;

          while (remainingTasks.length > 0 && iterationLimit < MAX_ITERATIONS) {
              iterationLimit++;

              const candidates = sops.map(sop => {
                  if (!sop.targets || sop.targets.length === 0) return null;
                  const sopTargetIds = new Set(sop.targets.map(t => t.id));
                  
                  // Filter tasks that this SOP can cover
                  const coverableTasks = remainingTasks.filter(t => sopTargetIds.has(t.targetId));
                  if (coverableTasks.length === 0) return null;

                  // --- WEIGHTED SCORING SYSTEM ---
                  let score = 0;

                  // 1. Coverage Score (+10 per task)
                  score += coverableTasks.length * 10;

                  // 2. Completeness Bonus (+5 per sample fully covered)
                  // Reward if this SOP clears ALL remaining targets for a specific sample
                  const involvedSamples = new Set(coverableTasks.map(t => t.sample));
                  involvedSamples.forEach(s => {
                      const tasksForSample = remainingTasks.filter(t => t.sample === s);
                      const coveredForSample = coverableTasks.filter(t => t.sample === s);
                      if (tasksForSample.length === coveredForSample.length) {
                          score += 5; 
                      }
                  });

                  // 3. Stock Penalty (-20 per missing item)
                  let missingStockCount = 0;
                  sop.consumables.forEach(c => {
                      if (c.type === 'simple' && !this.inventoryCache[c.name]) missingStockCount++;
                  });
                  score -= (missingStockCount * 20);

                  // 4. Efficiency Penalty (-1 per extraneous capability)
                  // If SOP covers 50 targets but we only need 1, it's wasteful (maybe)
                  const extraneous = sop.targets.length - new Set(coverableTasks.map(t => t.targetId)).size;
                  score -= (extraneous * 1);

                  return { sop, coverableTasks, score };
              }).filter(c => c !== null);

              if (candidates.length === 0) break;

              // Pick Winner
              candidates.sort((a, b) => b!.score - a!.score);
              const bestFit = candidates[0]!;

              // Construct Batch
              const batchSamples = new Set(bestFit.coverableTasks.map(t => t.sample));
              const batchTargetIds = new Set(bestFit.coverableTasks.map(t => t.targetId));
              // Only include targets relevant to the tasks being covered
              const batchTargets = (bestFit.sop.targets || []).filter(t => batchTargetIds.has(t.id));

              // Calculate Resources
              const inputs: Record<string, any> = {};
              bestFit.sop.inputs.forEach(i => inputs[i.var] = i.default);
              inputs['n_sample'] = batchSamples.size;

              const needs = this.calculator.calculateSopNeeds(
                  bestFit.sop, inputs, -1, this.inventoryCache, this.recipeCache, this.state.safetyConfig()
              );

              const batchId = `batch_${Date.now()}_${batches.length}`;
              
              batches.push({
                  id: batchId,
                  name: bestFit.sop.name,
                  sop: bestFit.sop,
                  targets: batchTargets,
                  samples: batchSamples,
                  sampleCount: batchSamples.size,
                  tasks: bestFit.coverableTasks, // Save granular task info for future splits
                  inputValues: inputs,
                  safetyMargin: -1, // Auto
                  resourceImpact: needs,
                  status: 'ready',
                  tags: ['Auto-Optimized'],
                  isExpanded: false // Collapsed by default
              });

              // Mark tasks as covered
              const coveredSet = new Set(bestFit.coverableTasks); 
              remainingTasks = remainingTasks.filter(t => !coveredSet.has(t));
          }

          this.batches.set(batches);
          this.unmappedTasks.set(remainingTasks);
          
          this.validateGlobalStock();
          this.step.set(2);

      } catch (e: any) {
          this.toast.show('Lỗi phân tích: ' + e.message, 'error');
          console.error(e);
      } finally {
          this.isProcessing.set(false);
      }
  }

  matchesSearch(batch: ProposedBatch): boolean {
      if (!this.sampleSearchTerm()) return false;
      const term = this.sampleSearchTerm().toLowerCase();
      for (const s of Array.from(batch.samples)) {
          if (s.toLowerCase().includes(term)) return true;
      }
      return false;
  }

  // --- BATCH MODIFICATION ---
  setBatchMarginManual(index: number) { this.updateBatchMargin(index, 10); }
  
  updateBatchMargin(index: number, val: number) {
      this.batches.update(current => {
          const next = [...current];
          let finalVal = Number(val);
          if (isNaN(finalVal)) finalVal = 0;
          const batch = { ...next[index], safetyMargin: finalVal };
          batch.resourceImpact = this.calculator.calculateSopNeeds(
              batch.sop, batch.inputValues, batch.safetyMargin, this.inventoryCache, this.recipeCache, this.state.safetyConfig()
          );
          next[index] = batch;
          return next;
      });
      this.validateGlobalStock();
  }

  updateBatchInput(index: number, key: string, val: any) {
      this.batches.update(current => {
          const next = [...current];
          const batch = { ...next[index] };
          batch.inputValues = { ...batch.inputValues, [key]: val };
          batch.resourceImpact = this.calculator.calculateSopNeeds(
              batch.sop, batch.inputValues, batch.safetyMargin, this.inventoryCache, this.recipeCache, this.state.safetyConfig()
          );
          next[index] = batch;
          return next;
      });
      this.validateGlobalStock();
  }

  toggleBatchDetails(index: number) {
      this.batches.update(current => {
          const next = [...current];
          next[index] = { ...next[index], isExpanded: !next[index].isExpanded };
          return next;
      });
  }

  // Helpers for summary view
  getMissingCount(batch: ProposedBatch): number {
      let count = 0;
      batch.resourceImpact.forEach(item => {
          if (item.isComposite) {
              item.breakdown.forEach(sub => { if (sub.isMissing) count++; });
          } else {
              if (item.isMissing) count++;
          }
      });
      return count;
  }

  countTotalItems(batch: ProposedBatch): number {
      let count = 0;
      batch.resourceImpact.forEach(item => {
          if (item.isComposite) count += item.breakdown.length;
          else count++;
      });
      return count;
  }

  private validateGlobalStock() {
      const ledger: Record<string, number> = {};
      Object.entries(this.inventoryCache).forEach(([k, v]) => ledger[k] = v.stock);
      
      this.batches.update(current => {
          return current.map(batch => {
              const needs = batch.resourceImpact;
              let isMissing = false;
              
              // We need to map over needs and update isMissing flags on a deep copy or in place if mutable
              // Since signals update is immutable, we map and return new structure if changes
              const updatedNeeds = needs.map(item => {
                  let newItem = { ...item };
                  
                  if (newItem.isComposite) {
                      const newBreakdown = newItem.breakdown.map(sub => {
                          const available = ledger[sub.name] || 0;
                          const subMissing = available < sub.totalNeed;
                          if (subMissing) isMissing = true;
                          if (ledger[sub.name] !== undefined) ledger[sub.name] -= sub.totalNeed;
                          return { ...sub, isMissing: subMissing };
                      });
                      newItem.breakdown = newBreakdown;
                  } else {
                      const available = ledger[newItem.name] || 0;
                      const itemMissing = available < newItem.stockNeed;
                      if (itemMissing) isMissing = true;
                      if (ledger[newItem.name] !== undefined) ledger[newItem.name] -= newItem.stockNeed;
                      newItem.isMissing = itemMissing;
                  }
                  return newItem;
              });
              
              // Auto-expand if critical error, otherwise respect user choice or default
              const newStatus = isMissing ? 'missing_stock' : 'ready';
              const shouldExpand = isMissing ? true : (batch.isExpanded || false);

              return { ...batch, resourceImpact: updatedNeeds, status: newStatus, isExpanded: shouldExpand };
          });
      });
  }

  // --- SPLIT WIZARD LOGIC ---
  
  openSplitModal(batchIndex: number) {
      const batch = this.batches()[batchIndex];
      this.splitState.set({
          step: 1,
          sourceBatchIndex: batchIndex,
          sourceBatchName: batch.name,
          availableSamples: Array.from(batch.samples).sort(),
          selectedSamples: new Set<string>(),
          
          availableTargets: batch.targets, // Targets the source batch was covering
          selectedTargets: new Set<string>(batch.targets.map(t => t.id)), // Default select all
          
          selectedSopId: null
      });
      this.showSplitModal.set(true);
  }

  // Step 1 Helpers
  toggleSplitSample(sample: string) {
      this.splitState.update(s => {
          const newSet = new Set(s.selectedSamples);
          if (newSet.has(sample)) newSet.delete(sample); else newSet.add(sample);
          return { ...s, selectedSamples: newSet };
      });
  }
  splitSelectAllSamples() {
      this.splitState.update(s => ({ ...s, selectedSamples: new Set(s.availableSamples) }));
  }
  splitDeselectAllSamples() {
      this.splitState.update(s => ({ ...s, selectedSamples: new Set() }));
  }

  // Step 2 Helpers
  toggleSplitTarget(id: string) {
      this.splitState.update(s => {
          const newSet = new Set(s.selectedTargets);
          if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
          return { ...s, selectedTargets: newSet };
      });
  }
  splitSelectAllTargets() {
      this.splitState.update(s => ({ ...s, selectedTargets: new Set(s.availableTargets.map(t => t.id)) }));
  }
  splitDeselectAllTargets() {
      this.splitState.update(s => ({ ...s, selectedTargets: new Set() }));
  }

  // Step 3 Helpers
  selectSplitSop(id: string) {
      this.splitState.update(s => ({ ...s, selectedSopId: id }));
  }

  // Navigation
  nextSplitStep() {
      this.splitState.update(s => {
          if (s.step === 1) {
              if (s.selectedSamples.size === 0) return s; 
              
              // STICKY TARGET LOGIC: Pre-select targets relevant to the selected samples
              const sourceBatch = this.batches()[s.sourceBatchIndex];
              const relevantTargets = new Set<string>();
              
              if (sourceBatch.tasks) {
                  sourceBatch.tasks.forEach(t => {
                      if (s.selectedSamples.has(t.sample)) {
                          relevantTargets.add(t.targetId);
                      }
                  });
              } else {
                  // Fallback for batches without tasks (legacy)
                  s.availableTargets.forEach(t => relevantTargets.add(t.id));
              }
              
              return { ...s, step: 2, selectedTargets: relevantTargets };
          }
          if (s.step === 2 && s.selectedTargets.size === 0) return s; // Guard
          return { ...s, step: (s.step + 1) as any };
      });
  }
  prevSplitStep() {
      this.splitState.update(s => {
          if (s.step === 1) return s;
          return { ...s, step: (s.step - 1) as any };
      });
  }

  // Helper to re-generate batch metadata from a list of tasks
  private recalculateBatchMetadata(tasks: AnalysisTask[], sop: Sop, originalBatch: ProposedBatch): Partial<ProposedBatch> {
      const uniqueSamples = new Set(tasks.map(t => t.sample));
      const uniqueTargetIds = new Set(tasks.map(t => t.targetId));
      const batchTargets = (sop.targets || []).filter(t => uniqueTargetIds.has(t.id));
      
      const newInputs = { ...originalBatch.inputValues };
      // Try to reset n_sample based on new size, but keep other manual inputs
      newInputs['n_sample'] = uniqueSamples.size;

      // Recalculate resource impact using calculator service
      // Note: We need inventory/recipe cache which should be available
      const needs = this.calculator.calculateSopNeeds(
          sop, newInputs, originalBatch.safetyMargin, this.inventoryCache, this.recipeCache, this.state.safetyConfig()
      );

      return {
          samples: uniqueSamples,
          sampleCount: uniqueSamples.size,
          targets: batchTargets,
          tasks: tasks,
          inputValues: newInputs,
          resourceImpact: needs
      };
  }

  // Execute
  async executeSplit() {
      const state = this.splitState();
      if (!state.selectedSopId) return;

      const sourceBatch = this.batches()[state.sourceBatchIndex];
      const targetSop = this.state.sops().find(s => s.id === state.selectedSopId);
      
      if (!targetSop) return;

      // 1. Identify TASKS to Move (Intersection of Selected Samples & Selected Targets)
      // Logic: Move specific AnalysisTasks. If Sample L01 is selected, and Target A is selected, move (L01, A).
      // Keep (L01, B) in old batch if B wasn't selected.
      
      let tasksToMove: AnalysisTask[] = [];
      let tasksToKeep: AnalysisTask[] = [];

      if (sourceBatch.tasks) {
          sourceBatch.tasks.forEach(t => {
              if (state.selectedSamples.has(t.sample) && state.selectedTargets.has(t.targetId)) {
                  tasksToMove.push(t);
              } else {
                  tasksToKeep.push(t);
              }
          });
      } else {
          // Fallback: Artificial task creation if source lacks them
          state.selectedSamples.forEach(s => {
              state.selectedTargets.forEach(tid => {
                  const tName = state.availableTargets.find(t => t.id === tid)?.name || tid;
                  tasksToMove.push({ sample: s, targetId: tid, targetName: tName, covered: true });
              });
          });
          // For legacy, we just clear the source if all samples moved, hard to reconstruct exact 'keep' without original tasks
          // Assuming source is valid Task-Based from now on.
      }

      if (tasksToMove.length === 0) return;

      // 2. Create New Batch
      // Metadata calculation for new batch
      const uniqueSamplesNew = new Set(tasksToMove.map(t => t.sample));
      const uniqueTargetIdsNew = new Set(tasksToMove.map(t => t.targetId));
      const newBatchTargets = (targetSop.targets || []).filter(t => uniqueTargetIdsNew.has(t.id));
      
      const newInputs: Record<string, any> = {};
      targetSop.inputs.forEach(i => newInputs[i.var] = i.default);
      Object.keys(newInputs).forEach(k => {
          if (sourceBatch.inputValues[k] !== undefined) newInputs[k] = sourceBatch.inputValues[k];
      });
      newInputs['n_sample'] = uniqueSamplesNew.size;

      const newNeeds = this.calculator.calculateSopNeeds(targetSop, newInputs, sourceBatch.safetyMargin, this.inventoryCache, this.recipeCache, this.state.safetyConfig());

      const newBatch: ProposedBatch = {
          id: `batch_split_${Date.now()}_${Math.floor(Math.random()*1000)}`,
          name: targetSop.name + ' (Tách)',
          sop: targetSop,
          targets: newBatchTargets,
          samples: uniqueSamplesNew,
          sampleCount: uniqueSamplesNew.size,
          tasks: tasksToMove,
          inputValues: newInputs,
          safetyMargin: sourceBatch.safetyMargin,
          resourceImpact: newNeeds,
          status: 'ready',
          isExpanded: false
      };

      // 3. Update Source Batch
      this.batches.update(current => {
          const next = [...current];
          
          if (tasksToKeep.length === 0) {
              // Source completely drained
              next.splice(state.sourceBatchIndex, 1);
          } else {
              // Recalculate source based on remaining tasks
              const updatedMeta = this.recalculateBatchMetadata(tasksToKeep, sourceBatch.sop, sourceBatch);
              
              next[state.sourceBatchIndex] = {
                  ...sourceBatch,
                  ...updatedMeta
              };
          }
          next.push(newBatch);
          return next;
      });

      this.validateGlobalStock();
      this.showSplitModal.set(false);
      this.toast.show('Đã tách mẻ thành công.', 'success');
  }

  // --- QUICK IMPORT LOGIC ---
  async openQuickImport(item: CalculatedItem | any) {
      if (!this.auth.canEditInventory()) {
          this.toast.show('Bạn không có quyền sửa kho.', 'error');
          return;
      }
      
      this.isProcessing.set(true);
      try {
          // FIX: Determine correct Inventory ID
          // Summary Item: id=InventoryID, name=DisplayName
          // CalculatedItem: name=InventoryID, displayName=DisplayName
          // We use the ID if available, otherwise name.
          const targetId = item.id || item.name;

          // FETCH FRESH DATA directly from Firestore to ensure accuracy
          const freshItems = await this.invService.getItemsByIds([targetId]);
          const freshStock = freshItems.length > 0 ? freshItems[0].stock : 0;
          
          // Update the local cache with this fresh value immediately
          if (freshItems.length > 0) {
              this.inventoryCache[targetId] = freshItems[0];
          }

          // Calculate missing based on FRESH stock
          // If item comes from summary (has .missing), we can try to use it as a hint, 
          // or re-calculate total need.
          let missingAmount = 0;
          
          if (item.missing !== undefined) {
              // Re-calculate Total Need for this specific Item across all batches to be accurate against fresh stock
              let totalNeed = 0;
              for (const b of this.batches()) {
                  b.resourceImpact.forEach(ri => {
                      if (ri.isComposite) {
                          ri.breakdown.forEach(sub => { if(sub.name === targetId) totalNeed += sub.totalNeed; });
                      } else {
                          if (ri.name === targetId) totalNeed += ri.stockNeed;
                      }
                  });
              }
              missingAmount = Math.max(0, totalNeed - freshStock);
          } else {
              // Single item context
              const needed = item.totalNeed || item.stockNeed || 0;
              missingAmount = Math.max(0, needed - freshStock);
          }

          this.quickImportState.set({
              id: targetId,
              name: item.displayName || item.name, // Display Name
              unit: item.stockUnit || item.unit,
              currentStock: freshStock,
              missingAmount: missingAmount
          });
          this.quickImportInput = 0;
          this.showQuickImport.set(true);
      } catch (e: any) {
          this.toast.show('Lỗi tải dữ liệu kho: ' + e.message, 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }

  async submitQuickImport() {
      if (this.isProcessing()) return;
      const state = this.quickImportState();
      const amount = this.quickImportInput;
      
      if (amount <= 0) return;

      this.isProcessing.set(true);
      try {
          // Use Base Unit directly as per requirement
          await this.invService.updateStock(state.id, state.currentStock, amount, 'Bù hàng (Smart Batch)');
          
          // Update Local Cache to reflect new stock immediately
          const newItem = { ...this.inventoryCache[state.id] };
          if (!newItem.id) {
              // Handle case where item didn't exist in cache (phantom item) - Reload
              const freshItem = (await this.invService.getItemsByIds([state.id]))[0];
              if (freshItem) this.inventoryCache[state.id] = freshItem;
          } else {
              newItem.stock += amount;
              this.inventoryCache[state.id] = newItem;
          }

          this.toast.show(`Đã nhập +${formatNum(amount)} ${state.unit}`, 'success');
          this.showQuickImport.set(false);
          
          // Re-validate Batches
          this.validateGlobalStock();

      } catch (e: any) {
          this.toast.show('Lỗi nhập kho: ' + e.message, 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }

  // --- Auto-Fix Logic (Simple Re-run) ---
  fixCoverage() {
      // In a complex system, this would identify exactly what is missing and run a targeted greedy search.
      // For now, we will simply reset and let the user re-analyze, as the greedy algorithm is deterministic and fast.
      // OR better: Just show a toast guiding them.
      this.toast.show('Đang tính toán lại để phủ kín các mẫu còn thiếu...', 'info');
      // To implement true "Partial Re-run", we would need to pass `missingTasks` to analyzePlan. 
      // Current implementation clears existing batches on analyzePlan. 
      // We will leave the "Fix" button as a visual cue or trigger a Reset -> Re-Analyze flow for now.
      this.step.set(1); // Go back to config to let them add/adjust blocks.
  }

  reset() { this.step.set(1); this.batches.set([]); this.unmappedTasks.set([]); }

  async executeAll() {
      if (!this.auth.canApprove()) {
          this.toast.show('Bạn không có quyền duyệt.', 'error');
          return;
      }
      this.validateGlobalStock();
      if (this.hasCriticalMissing()) {
          this.toast.show('Kho không đủ đáp ứng. Vui lòng kiểm tra lại.', 'error');
          return;
      }
      
      if (await this.confirmation.confirm({ message: `Xác nhận tạo ${this.batches().length} phiếu yêu cầu và trừ kho ngay lập tức?`, confirmText: 'Duyệt & Xem Phiếu' })) {
          this.isProcessing.set(true);
          const inventoryMap = this.state.inventoryMap();
          const jobs: PrintJob[] = [];
          
          try {
              for (const batch of this.batches()) {
                  const finalInputs = { 
                      ...batch.inputValues, 
                      safetyMargin: Number(batch.safetyMargin), 
                      sampleList: Array.from(batch.samples),
                      targetIds: batch.targets.map(t => t.id)
                  };
                  const res = await this.state.directApproveAndPrint(batch.sop, batch.resourceImpact, finalInputs, inventoryMap);
                  if (res) {
                      jobs.push({
                          sop: batch.sop, inputs: finalInputs, margin: batch.safetyMargin, items: batch.resourceImpact,
                          date: new Date(), user: this.state.getCurrentUserName(), requestId: res.logId
                      });
                  }
              }
              
              if (jobs.length > 0) {
                  this.printService.openPreview(jobs);
                  this.toast.show('Hoàn tất! Đang mở xem trước.', 'success');
                  this.reset();
                  this.blocks.set([{ id: Date.now(), name: 'Nhóm Mẫu #1', rawSamples: '', selectedTargets: new Set<string>(), targetSearch: '', isCollapsed: false }]);
              }
          } catch (e: any) {
              this.toast.show('Lỗi xử lý: ' + e.message, 'error');
          } finally {
              this.isProcessing.set(false);
          }
      }
  }
}
