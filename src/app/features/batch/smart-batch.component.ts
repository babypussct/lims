
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

interface ProposedBatch {
    id: string; 
    name: string; // Display Name
    sop: Sop;
    targets: SopTarget[];
    samples: Set<string>; 
    sampleCount: number;
    inputValues: Record<string, any>; 
    safetyMargin: number;
    resourceImpact: CalculatedItem[];
    status: 'ready' | 'missing_stock' | 'processed';
    score?: number; // Debug info
    tags?: string[]; // "Stock OK", "Best Match"
    alternativeSops?: Sop[]; 
}

interface SplitState {
    sourceBatchIndex: number;
    sourceSopName: string;
    availableSamples: string[];
    selectedSamples: Set<string>;
    targetSopId: string | null;
    showAllSops: boolean;
}

@Component({
  selector: 'app-smart-batch',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col fade-in pb-10 relative font-sans text-slate-800">
        <!-- HEADER -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 shrink-0">
            <div>
                <h2 class="text-2xl font-black flex items-center gap-3 text-slate-800">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg">
                        <i class="fa-solid fa-wand-magic-sparkles"></i>
                    </div>
                    Chạy Mẻ Thông Minh (AI Smart Batch)
                </h2>
                <p class="text-xs font-medium text-slate-500 mt-1 ml-1">Tự động tối ưu hóa chất và kiểm tra tồn kho.</p>
            </div>
            
            <div class="flex gap-2">
                @if(step() === 2) {
                    <button (click)="reset()" class="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50 transition">
                        <i class="fa-solid fa-rotate-left mr-1"></i> Quay lại
                    </button>
                    <button (click)="executeAll()" [disabled]="isProcessing() || hasCriticalMissing()" 
                            class="px-6 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-bold text-xs shadow-md transition hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                        @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> Xử lý... }
                        @else { <i class="fa-solid fa-check-double"></i> Duyệt & Xem Phiếu }
                    </button>
                }
            </div>
        </div>

        <div class="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-hidden">
            
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
                <div class="w-full lg:w-2/3 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 animate-fade-in pb-20">
                    
                    <div class="relative w-full shadow-sm">
                        <i class="fa-solid fa-search absolute left-3 top-2.5 text-slate-400 text-xs"></i>
                        <input [ngModel]="sampleSearchTerm()" (ngModelChange)="sampleSearchTerm.set($event)"
                               class="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white"
                               placeholder="Tìm vị trí mẫu (VD: A05)...">
                    </div>

                    @if (unmappedTargets().length > 0) {
                        <div class="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                            <i class="fa-solid fa-circle-exclamation text-red-500 mt-0.5"></i>
                            <div>
                                <h4 class="text-sm font-bold text-red-800 mb-1">Cảnh báo: Chỉ tiêu chưa được xử lý</h4>
                                <div class="text-xs text-red-600 mb-2">Các chỉ tiêu sau đây không nằm trong bất kỳ SOP nào phù hợp:</div>
                                <div class="flex flex-wrap gap-1">
                                    @for(t of unmappedTargets(); track t) {
                                        <span class="bg-white px-2 py-0.5 rounded text-[10px] font-bold text-red-600 border border-red-100">{{t}}</span>
                                    }
                                </div>
                            </div>
                        </div>
                    }

                    @for (batch of batches(); track batch.id; let batchIdx = $index) {
                        <div class="bg-white border border-slate-200 rounded-2xl shadow-sm transition-all duration-300 relative overflow-hidden group"
                             [class.ring-2]="matchesSearch(batch)"
                             [class.ring-blue-400]="matchesSearch(batch)"
                             [class.opacity-40]="sampleSearchTerm() && !matchesSearch(batch)">
                             
                            <!-- Status Stripe -->
                            <div class="absolute left-0 top-0 bottom-0 w-1" 
                                 [class.bg-emerald-500]="batch.status === 'ready'" 
                                 [class.bg-red-500]="batch.status === 'missing_stock'"></div>

                            <!-- Header -->
                            <div class="p-5 pb-3">
                                <div class="flex justify-between items-start mb-2 pl-2">
                                    <div>
                                        <div class="flex items-center gap-2 mb-0.5">
                                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{batch.sop.category}}</span>
                                            <!-- Smart Tags -->
                                            @if(batch.tags) {
                                                @for(tag of batch.tags; track tag) {
                                                    <span class="text-[9px] px-1.5 py-0.5 rounded font-bold border" 
                                                          [class.bg-emerald-100]="tag === 'Stock OK'" [class.text-emerald-700]="tag === 'Stock OK'" [class.border-emerald-200]="tag === 'Stock OK'"
                                                          [class.bg-blue-100]="tag === 'Efficient'" [class.text-blue-700]="tag === 'Efficient'" [class.border-blue-200]="tag === 'Efficient'">
                                                        {{tag}}
                                                    </span>
                                                }
                                            }
                                            @if(batch.status === 'missing_stock') {
                                                <span class="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold border border-red-200">Thiếu hàng</span>
                                            }
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <h3 class="text-lg font-bold text-slate-800">
                                                {{batch.name}} <span class="text-slate-400 text-sm font-normal">({{batch.sop.name}})</span>
                                            </h3>
                                            @if(batch.alternativeSops && batch.alternativeSops.length > 0) {
                                                <span (click)="openSplitModal(batchIdx)" 
                                                      class="cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm hover:scale-105 transition flex items-center gap-1">
                                                    <i class="fa-solid fa-shuffle"></i> +{{batch.alternativeSops.length}} lựa chọn
                                                </span>
                                            }
                                        </div>
                                        <div class="mt-1.5 text-xs font-mono font-bold text-slate-600 bg-slate-100/70 p-1.5 rounded-lg border border-slate-200 w-fit max-w-full flex items-start gap-2">
                                            <i class="fa-solid fa-vial text-slate-400 mt-0.5 shrink-0"></i>
                                            <span class="break-words leading-tight">{{ formatSampleList(batch.samples) }}</span>
                                        </div>
                                    </div>
                                    <div class="flex flex-col items-end gap-1">
                                        <button (click)="openSplitModal(batchIdx)" class="text-xs px-3 py-1.5 rounded-lg border font-bold transition flex items-center gap-1 active:scale-95 bg-slate-100 text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-600">
                                            <i class="fa-solid fa-gear"></i> Tùy chỉnh
                                        </button>
                                        <div class="text-lg font-black text-slate-700 mt-1">{{batch.samples.size}} <span class="text-xs font-normal text-slate-400">mẫu</span></div>
                                    </div>
                                </div>
                                <div class="flex flex-wrap gap-1.5 mb-3 pl-2">
                                    @for(t of batch.targets; track t.id) {
                                        <span class="px-2 py-1 bg-teal-50 text-teal-700 rounded-md text-[10px] font-bold border border-teal-100">{{t.name}}</span>
                                    }
                                </div>
                            </div>

                            <!-- PARAMETER TUNING (DYNAMIC) -->
                            <div class="px-5 py-3 bg-slate-50 border-y border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-3">
                                
                                <!-- DYNAMIC INPUTS (Excluding n_sample) -->
                                @for (inp of batch.sop.inputs; track inp.var) {
                                    @if(inp.var !== 'n_sample' && inp.var !== 'safetyMargin') {
                                        <div class="group">
                                            <label class="text-[9px] font-bold text-slate-400 uppercase block mb-1 truncate" [title]="inp.label">{{inp.label}}</label>
                                            
                                            @switch (inp.type) {
                                                @case ('select') {
                                                    <select [ngModel]="batch.inputValues[inp.var]" 
                                                            (ngModelChange)="updateBatchInput(batchIdx, inp.var, $event)"
                                                            class="w-full bg-white border border-slate-200 rounded-lg px-1 py-1 text-xs font-bold text-slate-700 outline-none focus:border-teal-500 cursor-pointer h-[26px]">
                                                        @for (opt of inp.options; track opt.value) {
                                                            <option [value]="opt.value">{{opt.label}}</option>
                                                        }
                                                    </select>
                                                }
                                                @case ('checkbox') {
                                                    <div class="flex items-center h-[26px]">
                                                        <label class="flex items-center gap-2 cursor-pointer">
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
                                                               class="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 text-center outline-none focus:border-teal-500 transition h-[26px]">
                                                        @if(inp.unitLabel) {
                                                            <span class="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] text-slate-400 font-bold pointer-events-none">{{inp.unitLabel}}</span>
                                                        }
                                                    </div>
                                                }
                                            }
                                        </div>
                                    }
                                }

                                <!-- Safety Margin (Always Last) -->
                                <div>
                                    <label class="text-[9px] font-bold text-slate-400 uppercase block mb-1">Hao hụt (%)</label>
                                    @if(batch.safetyMargin === -1) {
                                        <div (click)="setBatchMarginManual(batchIdx)" 
                                             class="w-full bg-orange-50 border border-orange-200 text-orange-700 text-[10px] font-bold py-1.5 px-2 rounded-lg cursor-pointer text-center flex items-center justify-center gap-1 hover:bg-orange-100 transition shadow-sm h-[26px]">
                                            <i class="fa-solid fa-wand-magic-sparkles"></i> Auto
                                        </div>
                                    } @else {
                                        <input type="number" 
                                               [ngModel]="batch.safetyMargin" 
                                               (ngModelChange)="updateBatchMargin(batchIdx, $event)"
                                               class="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 text-center outline-none focus:border-orange-500 transition h-[26px]">
                                    }
                                </div>
                            </div>

                            <!-- Expandable Sample List -->
                            <details class="group/acc border-b border-slate-100" [open]="matchesSearch(batch)">
                                <summary class="flex justify-between items-center px-5 py-2 bg-white cursor-pointer hover:bg-slate-50 transition text-[10px] font-bold text-slate-500 list-none uppercase tracking-wide">
                                    <span><i class="fa-solid fa-vial mr-1"></i> Danh sách mẫu ({{batch.samples.size}})</span>
                                    <i class="fa-solid fa-chevron-down transition-transform group-open/acc:rotate-180"></i>
                                </summary>
                                <div class="p-3 bg-slate-50/30 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                    @for(s of batch.samples; track s) {
                                        <div class="bg-white border border-slate-200 rounded px-2 py-1 text-[10px] font-mono font-bold text-slate-700 text-center truncate shadow-sm">
                                            {{s}}
                                        </div>
                                    }
                                </div>
                            </details>

                            <!-- Resource Summary -->
                            <div class="bg-white p-5 pt-3">
                                <div class="text-[10px] font-bold text-slate-400 uppercase mb-2">Dự trù (Real-time)</div>
                                <div class="space-y-1">
                                    @for(item of batch.resourceImpact; track item.name) {
                                        @if(!item.isComposite) {
                                            <div class="flex justify-between text-xs border-b border-slate-50 last:border-0 pb-1">
                                                <span class="text-slate-600 truncate max-w-[200px]" [class.text-red-600]="item.isMissing">{{item.displayName || item.name}}</span>
                                                <span class="font-mono font-bold text-slate-700">{{formatNum(item.stockNeed)}} {{item.stockUnit}}</span>
                                            </div>
                                        } @else {
                                            <div class="text-xs font-bold text-slate-700 mt-1 mb-0.5">{{item.displayName}}</div>
                                            @for(sub of item.breakdown; track sub.name) {
                                                <div class="flex justify-between text-xs pl-2 border-l-2 border-slate-100 mb-0.5">
                                                    <span class="text-slate-500 truncate max-w-[200px]" [class.text-red-600]="sub.isMissing">{{sub.displayName || sub.name}}</span>
                                                    <span class="font-mono font-bold text-slate-600">{{formatNum(sub.totalNeed)}} {{sub.stockUnit}}</span>
                                                </div>
                                            }
                                        }
                                    }
                                </div>
                            </div>
                        </div>
                    }
                </div>

                <!-- Right: Summary & Action -->
                <div class="w-full lg:w-1/3 flex flex-col gap-4 h-fit sticky top-4">
                    <div class="bg-slate-800 text-white rounded-2xl p-6 shadow-xl flex flex-col">
                        <h4 class="font-bold text-lg mb-4 flex items-center gap-2">
                            <i class="fa-solid fa-clipboard-check text-teal-400"></i> Tổng hợp Kế hoạch
                        </h4>
                        <div class="space-y-4 mb-6">
                            <div class="flex justify-between border-b border-slate-700 pb-2">
                                <span class="text-slate-400 text-sm">Tổng mẫu</span>
                                <span class="font-bold text-xl">{{totalUniqueSamples()}}</span>
                            </div>
                            <div class="flex justify-between border-b border-slate-700 pb-2">
                                <span class="text-slate-400 text-sm">Số mẻ (Batches)</span>
                                <span class="font-bold text-xl text-teal-400">{{batches().length}}</span>
                            </div>
                        </div>
                        <div class="mt-auto">
                            <button (click)="executeAll()" [disabled]="isProcessing() || hasCriticalMissing()" 
                                    class="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white font-black uppercase rounded-xl shadow-lg shadow-teal-900/20 transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                                @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> Đang xử lý... }
                                @else { Duyệt & Xem Phiếu }
                            </button>
                        </div>
                    </div>
                    @if (missingStockSummary().length > 0) {
                        <div class="bg-red-50 border border-red-100 rounded-2xl p-5 shadow-sm animate-slide-up">
                            <h4 class="font-bold text-red-800 text-sm mb-3 flex items-center gap-2">
                                <i class="fa-solid fa-cart-shopping"></i> Dự trù Mua sắm
                            </h4>
                            <div class="overflow-hidden rounded-xl border border-red-100">
                                <table class="w-full text-xs text-left">
                                    <thead class="bg-red-100/50 text-red-800 uppercase font-bold">
                                        <tr><th class="px-3 py-2">Hóa chất</th><th class="px-3 py-2 text-right">Thiếu hụt</th></tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-red-50">
                                        @for (item of missingStockSummary(); track item.name) {
                                            <tr>
                                                <td class="px-3 py-2 font-medium text-slate-700 truncate max-w-[120px]">{{item.name}}</td>
                                                <td class="px-3 py-2 text-right font-bold text-red-600 font-mono">-{{formatNum(item.missing)}} {{item.unit}}</td>
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

        <!-- Group Modal -->
        @if (showGroupModal()) {
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
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

        <!-- Split Modal -->
        @if (showSplitModal()) {
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col h-[90vh] animate-slide-up">
                    <div class="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                        <div><h3 class="font-black text-slate-800 text-lg flex items-center gap-2"><i class="fa-solid fa-shuffle text-blue-600"></i> Phân chia Mẻ & Đổi Quy trình</h3></div>
                        <button (click)="showSplitModal.set(false)" class="text-slate-400 hover:text-red-500 transition"><i class="fa-solid fa-times text-xl"></i></button>
                    </div>
                    <div class="bg-white p-3 border-b border-slate-100 flex items-center justify-between gap-4 shrink-0">
                        <div class="flex gap-2">
                            <button (click)="moveAllToNew()" class="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition">Chuyển Hết</button>
                            <button (click)="moveAllToSource()" class="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition">Trả Lại Hết</button>
                        </div>
                        
                        <!-- Toggle All SOPs -->
                        <label class="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                            <input type="checkbox" [checked]="splitState().showAllSops" (change)="toggleShowAllSops()" class="w-4 h-4 accent-blue-600 rounded">
                            Hiển thị tất cả SOP (Kể cả không khớp chỉ tiêu)
                        </label>
                    </div>
                    <div class="flex-1 flex overflow-hidden bg-slate-100 p-4 gap-4">
                        <div class="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div class="p-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center"><div class="font-bold text-slate-700 text-xs uppercase">Mẻ Hiện tại</div><span class="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">{{ splitState().availableSamples.length - splitState().selectedSamples.size }} mẫu</span></div>
                            <div class="flex-1 overflow-y-auto custom-scrollbar p-2">
                                <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    @for(sample of splitState().availableSamples; track sample) {
                                        @if (!splitState().selectedSamples.has(sample)) {
                                            <div (click)="moveSample(sample)" class="p-2 rounded border border-slate-100 bg-slate-50 hover:bg-blue-50 cursor-pointer transition text-center group"><span class="font-mono font-bold text-xs text-slate-700 group-hover:text-blue-700">{{sample}}</span></div>
                                        }
                                    }
                                </div>
                            </div>
                        </div>
                        <div class="flex-1 flex flex-col bg-white rounded-xl border border-blue-200 shadow-sm overflow-hidden ring-1 ring-blue-100">
                            <div class="p-3 bg-blue-50 border-b border-blue-100 flex justify-between items-center"><div class="font-bold text-blue-800 text-xs uppercase">Mẻ Mới</div><span class="bg-blue-200 text-blue-800 px-2 py-0.5 rounded text-[10px] font-bold">{{ splitState().selectedSamples.size }} mẫu</span></div>
                            <div class="flex-1 overflow-y-auto custom-scrollbar p-2 bg-blue-50/30">
                                <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    @for(sample of splitState().availableSamples; track sample) {
                                        @if (splitState().selectedSamples.has(sample)) {
                                            <div (click)="moveSample(sample)" class="p-2 rounded border border-blue-200 bg-white hover:bg-red-50 cursor-pointer transition text-center group shadow-sm"><span class="font-mono font-bold text-xs text-blue-700 group-hover:text-red-600">{{sample}}</span></div>
                                        }
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="p-4 bg-white border-t border-slate-200 shrink-0 flex flex-col gap-4">
                        <div class="flex flex-col md:flex-row gap-4 items-start">
                            <div class="flex-1 w-full"><label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Quy trình cho Mẻ Mới</label><div class="flex gap-2"><select [ngModel]="splitState().targetSopId" (ngModelChange)="updateSplitTarget($event)" class="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none cursor-pointer"><option [value]="null" disabled>-- Chọn SOP phù hợp --</option>@for(sop of candidateSops(); track sop.id) {<option [value]="sop.id">{{sop.name}}</option>}</select></div></div>
                            <div class="w-full md:w-auto flex justify-end items-end h-full pt-6"><button (click)="executeSplit()" class="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-md transition transform active:scale-95 flex items-center gap-2"><i class="fa-solid fa-check"></i> Xác nhận Tách Mẻ</button></div>
                        </div>
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
  unmappedTargets = signal<string[]>([]);
  isProcessing = signal(false);
  isEditingName = signal<number | null>(null);
  
  private inventoryCache: Record<string, InventoryItem> = {};
  private recipeCache: Record<string, Recipe> = {};
  
  sampleSearchTerm = signal('');
  showSplitModal = signal(false);
  splitState = signal<SplitState>({ sourceBatchIndex: -1, sourceSopName: '', availableSamples: [], selectedSamples: new Set<string>(), targetSopId: null, showAllSops: false });
  showGroupModal = signal(false);
  availableGroups = signal<TargetGroup[]>([]);
  currentBlockIndexForGroupImport = signal<number>(-1);

  // --- COMPUTED ---
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
                      if (!summary.has(sub.name)) { summary.set(sub.name, { name: sub.displayName || sub.name, unit: sub.stockUnit, missing: 0, currentStock: current }); } 
                  } 
              } else { 
                  const current = ledger[item.name] || 0; 
                  const remaining = current - item.stockNeed; 
                  ledger[item.name] = remaining; 
                  if (!summary.has(item.name)) { summary.set(item.name, { name: item.displayName || item.name, unit: item.stockUnit, missing: 0, currentStock: current }); } 
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
  
  candidateSops = computed(() => { 
      const s = this.splitState(); 
      if (s.sourceBatchIndex < 0) return []; 
      const sourceBatch = this.batches()[s.sourceBatchIndex]; 
      const allSops = this.state.sops().filter(sop => !sop.isArchived && sop.id !== sourceBatch.sop.id); 
      if (s.showAllSops) return allSops; 
      
      const samplesToMove = s.selectedSamples; 
      let requiredTargetIds: Set<string>; 
      
      if (samplesToMove.size === 0) { 
          requiredTargetIds = new Set(sourceBatch.targets.map(t => t.id)); 
      } else { 
          requiredTargetIds = this.getRequiredTargetsForSamples(samplesToMove); 
      } 
      
      return allSops.filter(sop => { 
          if (!sop.targets) return false; 
          const sopTargetIds = new Set(sop.targets.map(t => t.id)); 
          for (const id of Array.from(requiredTargetIds)) { 
              if (!sopTargetIds.has(id)) return false; 
          } 
          return true; 
      }); 
  });

  // --- METHODS ---

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

  // --- SMART ANALYZE LOGIC ---
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

          const proposed: ProposedBatch[] = [];
          const allSops = this.state.sops().filter(s => !s.isArchived);
          const unmapped: string[] = [];

          // 2. Map Blocks to Requirements
          const sampleRequirements = new Map<string, Set<string>>();
          for (const block of this.blocks()) {
              const samples = block.rawSamples.split('\n').map(s => s.trim()).filter(s => s);
              if (samples.length === 0 || block.selectedTargets.size === 0) continue;
              for (const s of samples) {
                  if (!sampleRequirements.has(s)) sampleRequirements.set(s, new Set());
                  const reqs = sampleRequirements.get(s)!;
                  block.selectedTargets.forEach(t => reqs.add(t));
              }
          }

          // 3. Cluster Samples by Requirement
          const targetGroups = new Map<string, {targets: Set<string>, samples: Set<string>}>();
          sampleRequirements.forEach((reqs, sample) => {
              if (reqs.size === 0) return;
              const key = Array.from(reqs).sort().join('|');
              if (!targetGroups.has(key)) targetGroups.set(key, { targets: reqs, samples: new Set() });
              targetGroups.get(key)!.samples.add(sample);
          });

          // 4. Match SOPs (Recursive & Weighted Scoring)
          targetGroups.forEach((group, key) => {
              let currentReqTargets = Array.from(group.targets);
              let loopCount = 0;
              const maxLoops = 10;

              while (currentReqTargets.length > 0 && loopCount < maxLoops) {
                  loopCount++;

                  // CALCULATE SCORES for Candidates
                  const candidates = allSops.map(sop => {
                      if (!sop.targets) return null;
                      const sopTargetIds = new Set(sop.targets.map(t => t.id));
                      const matching = currentReqTargets.filter(id => sopTargetIds.has(id));
                      if (matching.length === 0) return null;

                      // STOCK CHECK (Heuristic: Just check simple items exist)
                      let stockScore = 0;
                      let missingItems = 0;
                      sop.consumables.forEach(c => {
                          if (c.type === 'simple' && !this.inventoryCache[c.name]) missingItems++;
                          if (c.type === 'simple' && this.inventoryCache[c.name]?.stock > 0) stockScore += 1;
                      });

                      // WEIGHTED SCORE CALCULATION
                      // Coverage: +10 per target
                      // Stock: +5 if stock exists (simple check)
                      // Efficiency: -1 per consumable (prefer simpler SOPs)
                      const score = (matching.length * 10) + (stockScore * 5) - (sop.consumables.length);

                      return {
                          sop,
                          matchedIds: matching,
                          score: score,
                          efficiency: sop.consumables.length,
                          hasStock: missingItems === 0
                      };
                  }).filter(x => x !== null) as {sop: Sop, matchedIds: string[], score: number, hasStock: boolean}[];

                  if (candidates.length === 0) {
                      currentReqTargets.forEach(t => {
                          const tName = this.allAvailableTargets().find(x => x.id === t)?.name || t;
                          if (!unmapped.includes(tName)) unmapped.push(tName);
                      });
                      break;
                  }

                  // Pick Best Candidate (Highest Score)
                  candidates.sort((a, b) => b.score - a.score);
                  const bestFit = candidates[0];
                  const alternatives = candidates.slice(1).map(c => c.sop);

                  // 5. NO AUTO-SPLIT (Reverted per request)
                  const inputs: Record<string, any> = {};
                  bestFit.sop.inputs.forEach(i => inputs[i.var] = i.default);
                  inputs['n_sample'] = group.samples.size;

                  const needs = this.calculator.calculateSopNeeds(
                      bestFit.sop, inputs, -1, this.inventoryCache, this.recipeCache, this.state.safetyConfig()
                  );

                  const coveredSet = new Set(bestFit.matchedIds);
                  const batchTargets = (bestFit.sop.targets || []).filter(t => coveredSet.has(t.id));
                  
                  const batchId = `batch_${Date.now()}_${proposed.length}`;

                  proposed.push({
                      id: batchId,
                      name: bestFit.sop.name, // Simple Name
                      sop: bestFit.sop,
                      targets: batchTargets,
                      samples: group.samples,
                      sampleCount: group.samples.size,
                      inputValues: inputs,
                      safetyMargin: -1, // Auto
                      resourceImpact: needs,
                      status: 'ready',
                      alternativeSops: alternatives,
                      score: bestFit.score,
                      tags: bestFit.hasStock ? ['Stock OK'] : []
                  });

                  // Remove covered targets
                  currentReqTargets = currentReqTargets.filter(t => !coveredSet.has(t));
              }
          });

          this.batches.set(proposed);
          this.unmappedTargets.set(unmapped);
          this.validateGlobalStock();
          this.step.set(2);

      } catch (e: any) {
          this.toast.show('Lỗi phân tích: ' + e.message, 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }

  getRequiredTargetsForSamples(samples: Set<string>): Set<string> {
      const required = new Set<string>();
      for (const block of this.blocks()) {
          const blockSamples = block.rawSamples.split('\n').map(s => s.trim()).filter(s => s);
          const blockSampleSet = new Set(blockSamples);
          for (const s of Array.from(samples)) {
              if (blockSampleSet.has(s)) {
                  block.selectedTargets.forEach(t => required.add(t));
              }
          }
      }
      return required;
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

  recalculateBatch(index: number) {
      this.batches.update(current => {
          const next = [...current];
          const batch = { ...next[index] };
          batch.inputValues['n_sample'] = batch.samples.size; 
          batch.resourceImpact = this.calculator.calculateSopNeeds(
              batch.sop, batch.inputValues, batch.safetyMargin, this.inventoryCache, this.recipeCache, this.state.safetyConfig()
          );
          batch.sampleCount = batch.samples.size;
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
          // Don't auto-recalc here to avoid lag, user triggers update explicitly or we debounce?
          // Actually, let's auto recalc for UX
          batch.resourceImpact = this.calculator.calculateSopNeeds(
              batch.sop, batch.inputValues, batch.safetyMargin, this.inventoryCache, this.recipeCache, this.state.safetyConfig()
          );
          next[index] = batch;
          return next;
      });
      this.validateGlobalStock();
  }

  private validateGlobalStock() {
      const ledger: Record<string, number> = {};
      Object.entries(this.inventoryCache).forEach(([k, v]) => ledger[k] = v.stock);
      
      this.batches.update(current => {
          return current.map(batch => {
              const needs = batch.resourceImpact;
              let isMissing = false;
              needs.forEach(item => {
                  if (item.isComposite) {
                      item.breakdown.forEach(sub => {
                          const available = ledger[sub.name] || 0;
                          if (available < sub.totalNeed) isMissing = true;
                          if (ledger[sub.name] !== undefined) ledger[sub.name] -= sub.totalNeed;
                      });
                  } else {
                      const available = ledger[item.name] || 0;
                      if (available < item.stockNeed) isMissing = true;
                      if (ledger[item.name] !== undefined) ledger[item.name] -= item.stockNeed;
                  }
              });
              return { ...batch, status: isMissing ? 'missing_stock' : 'ready' };
          });
      });
  }

  // --- SPLIT LOGIC ---
  openSplitModal(batchIndex: number) {
      const batch = this.batches()[batchIndex];
      this.splitState.set({
          sourceBatchIndex: batchIndex,
          sourceSopName: batch.sop.name,
          availableSamples: Array.from(batch.samples).sort(),
          selectedSamples: new Set<string>(),
          targetSopId: null,
          showAllSops: false
      });
      this.showSplitModal.set(true);
  }
  toggleShowAllSops() { this.splitState.update(s => ({ ...s, showAllSops: !s.showAllSops })); }
  moveSample(sample: string) { this.splitState.update(s => { const newSet = new Set(s.selectedSamples); if (newSet.has(sample)) newSet.delete(sample); else newSet.add(sample); return { ...s, selectedSamples: newSet }; }); }
  moveAllToNew() { this.splitState.update(s => ({ ...s, selectedSamples: new Set(s.availableSamples) })); }
  moveAllToSource() { this.splitState.update(s => ({ ...s, selectedSamples: new Set() })); }
  updateSplitTarget(sopId: string | null) { this.splitState.update(s => ({ ...s, targetSopId: sopId })); }

  missingTargetsInSplit(): {id: string, name: string}[] {
      const s = this.splitState();
      if (!s.targetSopId) return [];
      const targetSop = this.state.sops().find(x => x.id === s.targetSopId);
      if (!targetSop || !targetSop.targets) return [];
      const sopTargetIds = new Set(targetSop.targets.map(t => t.id));
      const reqTargets = this.getRequiredTargetsForSamples(s.selectedSamples);
      const missing: {id: string, name: string}[] = [];
      reqTargets.forEach(reqId => {
          if (!sopTargetIds.has(reqId)) {
              const tName = this.allAvailableTargets().find(x => x.id === reqId)?.name || reqId;
              missing.push({ id: reqId, name: tName });
          }
      });
      return missing;
  }

  async executeSplit() {
      const state = this.splitState();
      const sourceBatch = this.batches()[state.sourceBatchIndex];
      const samplesToMove = state.selectedSamples;
      const targetSop = this.state.sops().find(s => s.id === state.targetSopId);

      if (!targetSop || samplesToMove.size === 0) return;

      const missing = this.missingTargetsInSplit();
      if (missing.length > 0) {
          const confirmed = await this.confirmation.confirm({
              message: `CẢNH BÁO: Quy trình mới không hỗ trợ ${missing.length} chỉ tiêu (VD: ${missing[0].name}).\nCác chỉ tiêu này sẽ bị loại bỏ khỏi mẻ mới.`,
              confirmText: 'Chấp nhận & Tiếp tục', isDangerous: true
          });
          if (!confirmed) return;
      }

      // 1. Create New Batch
      const newSamples = new Set(samplesToMove);
      const newInputs: Record<string, any> = {};
      targetSop.inputs.forEach(i => newInputs[i.var] = i.default);
      // Copy compatible inputs
      if (sourceBatch.inputValues) {
          Object.keys(newInputs).forEach(key => { if (sourceBatch.inputValues[key] !== undefined) newInputs[key] = sourceBatch.inputValues[key]; });
      }
      newInputs['n_sample'] = newSamples.size;
      
      const reqsForNew = this.getRequiredTargetsForSamples(newSamples);
      const finalNewTargets = (targetSop.targets || []).filter(t => reqsForNew.has(t.id));
      
      const newNeeds = this.calculator.calculateSopNeeds(targetSop, newInputs, sourceBatch.safetyMargin, this.inventoryCache, this.recipeCache, this.state.safetyConfig());
      
      const newBatch: ProposedBatch = {
          id: `batch_split_${Date.now()}_${Math.floor(Math.random()*1000)}`, // Added random suffix to prevent ID collision
          name: targetSop.name + ' (Tách)',
          sop: targetSop, targets: finalNewTargets, samples: newSamples, sampleCount: newSamples.size,
          inputValues: newInputs, safetyMargin: sourceBatch.safetyMargin, resourceImpact: newNeeds, status: 'ready'
      };

      // 2. Update Source
      const remainingSamples = new Set(Array.from(sourceBatch.samples).filter(s => !samplesToMove.has(s)));
      this.batches.update(current => {
          const next = [...current];
          if (remainingSamples.size === 0) {
              next.splice(state.sourceBatchIndex, 1);
          } else {
              const reqsForSource = this.getRequiredTargetsForSamples(remainingSamples);
              const finalSourceTargets = (sourceBatch.sop.targets || []).filter(t => reqsForSource.has(t.id));
              const updatedSource = { ...sourceBatch, samples: remainingSamples, sampleCount: remainingSamples.size, targets: finalSourceTargets };
              updatedSource.inputValues = { ...updatedSource.inputValues, n_sample: remainingSamples.size };
              updatedSource.resourceImpact = this.calculator.calculateSopNeeds(updatedSource.sop, updatedSource.inputValues, updatedSource.safetyMargin, this.inventoryCache, this.recipeCache, this.state.safetyConfig());
              next[state.sourceBatchIndex] = updatedSource;
          }
          next.push(newBatch);
          return next;
      });

      this.validateGlobalStock();
      this.showSplitModal.set(false);
      this.toast.show('Đã tách mẻ thành công.', 'success');
  }

  reset() { this.step.set(1); this.batches.set([]); this.unmappedTargets.set([]); }

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
