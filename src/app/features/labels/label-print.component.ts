
import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';
import { StateService } from '../../core/services/state.service';

type PrintMode = 'brother' | 'tomy_a4' | 'plain_a4';

interface TomyTemplate {
  id: string;
  name: string;
  cols: number;
  rows: number;
  cellW: number;
  cellH: number;
  marginTop: number;
  marginLeft: number;
  gapX: number;
  gapY: number;
}

const TOMY_TEMPLATES: TomyTemplate[] = [
  { id: 'tomy_145', name: 'Tomy 145 (65 tem - 38x21mm)', cols: 5, rows: 13, cellW: 38, cellH: 21, marginTop: 10, marginLeft: 5, gapX: 2, gapY: 2 },
  { id: 'tomy_149', name: 'Tomy 149 (21 tem - 70x42.5mm)', cols: 3, rows: 7, cellW: 70, cellH: 42.5, marginTop: 10, marginLeft: 5, gapX: 2, gapY: 2 },
  { id: 'tomy_144', name: 'Tomy 144 (30 tem - 67x28mm)', cols: 3, rows: 10, cellW: 67, cellH: 28, marginTop: 10, marginLeft: 5, gapX: 2, gapY: 2 },
  { id: 'tomy_109', name: 'Tomy 109 (100 tem - 22x14mm)', cols: 8, rows: 12, cellW: 22, cellH: 14, marginTop: 10, marginLeft: 5, gapX: 2, gapY: 2 },
];

interface LabelCell {
  subLabels: string[];
  isEmpty: boolean;
  index: number;
}

interface LabelPage {
  cells: LabelCell[];
  pageIndex: number;
}

@Component({
  selector: 'app-label-print',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col md:flex-row bg-slate-100 fade-in font-sans text-slate-800 overflow-y-auto md:overflow-hidden">
        
        <!-- LEFT: Controls & Config -->
        <div class="w-full md:w-[420px] flex flex-col bg-white border-r border-slate-200 z-20 shrink-0 shadow-xl md:h-full relative">
            
            <!-- 1. Header & Mode Selection -->
            <div class="p-5 border-b border-slate-100 bg-slate-50 shrink-0">
                <h2 class="text-xl font-black text-slate-800 flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-lg shadow-slate-200">
                        <i class="fa-solid fa-print"></i>
                    </div>
                    In Tem & Nhãn
                </h2>
                
                <!-- Mode Selector Cards -->
                <div class="grid grid-cols-3 gap-2">
                    <button (click)="setMode('brother')" 
                            class="flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all relative overflow-hidden"
                            [class]="printMode() === 'brother' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 bg-white text-slate-500 hover:border-red-200'">
                        <i class="fa-solid fa-tape text-xl mb-1"></i>
                        <span class="text-[10px] font-bold uppercase text-center leading-tight mt-1">Máy in<br>Brother</span>
                        @if(printMode() === 'brother') { <div class="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-bl-lg"></div> }
                    </button>

                    <button (click)="setMode('tomy_a4')" 
                            class="flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all relative overflow-hidden"
                            [class]="printMode() === 'tomy_a4' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-200'">
                        <i class="fa-solid fa-file-lines text-xl mb-1"></i>
                        <span class="text-[10px] font-bold uppercase text-center leading-tight mt-1">Decal A4<br>(Tomy)</span>
                        @if(printMode() === 'tomy_a4') { <div class="absolute top-0 right-0 w-3 h-3 bg-indigo-500 rounded-bl-lg"></div> }
                    </button>

                    <button (click)="setMode('plain_a4')" 
                            class="flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all relative overflow-hidden"
                            [class]="printMode() === 'plain_a4' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-500 hover:border-emerald-200'">
                        <i class="fa-solid fa-scissors text-xl mb-1"></i>
                        <span class="text-[10px] font-bold uppercase text-center leading-tight mt-1">A4 Trơn<br>(Cắt tay)</span>
                        @if(printMode() === 'plain_a4') { <div class="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-bl-lg"></div> }
                    </button>
                </div>
            </div>

            <div class="flex-1 md:overflow-y-auto p-5 space-y-6 custom-scrollbar">
                
                <!-- 2. Data Input -->
                <div>
                    <div class="flex justify-between items-center mb-2">
                        <label class="text-xs font-bold text-slate-700 uppercase flex items-center gap-2">
                            <i class="fa-solid fa-keyboard text-slate-400"></i> Dữ liệu (1 mã / dòng)
                        </label>
                        <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold border border-slate-200">{{rawInputCount()}} tem</span>
                    </div>
                    
                    <!-- Fetch from Requests -->
                    <div class="flex gap-2 mb-2 bg-blue-50 p-2 rounded-lg border border-blue-100">
                        <input type="date" [ngModel]="fetchDate()" (ngModelChange)="fetchDate.set($event)" class="input-std py-1.5 text-xs flex-1 bg-white">
                        <button (click)="fetchFromRequests()" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1 whitespace-nowrap">
                            <i class="fa-solid fa-cloud-arrow-down"></i> Lấy mẫu
                        </button>
                    </div>

                    <textarea [ngModel]="rawInput()" (ngModelChange)="updateInput($event)" 
                              class="w-full h-28 p-3 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-slate-400 outline-none resize-none shadow-inner bg-slate-50 focus:bg-white transition" 
                              placeholder="Paste mã vào đây hoặc lấy từ yêu cầu..."></textarea>
                    <div class="flex gap-2 mt-2 justify-end">
                        <button (click)="clearInput()" class="text-[10px] text-red-500 hover:bg-red-50 px-2 py-1 rounded transition font-bold"><i class="fa-solid fa-trash"></i> Xóa</button>
                        <button (click)="addExample()" class="text-[10px] text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition font-bold">+ Mẫu thử</button>
                    </div>
                </div>

                <div class="h-px bg-slate-100 w-full"></div>

                <!-- 3. BROTHER SPECIFIC CONFIG -->
                @if (printMode() === 'brother') {
                    <div class="space-y-4 animate-bounce-in">
                        <div class="flex items-center gap-2 bg-red-50 p-3 rounded-lg border border-red-100 text-red-800 text-xs">
                            <i class="fa-solid fa-triangle-exclamation"></i>
                            <span class="font-medium">Lưu ý: Chọn đúng khổ giấy trong hộp thoại in.</span>
                        </div>

                        <div>
                            <label class="label-std">Loại Giấy (Brother)</label>
                            <select [ngModel]="brotherPaperType()" (ngModelChange)="onBrotherPaperChange($event)" class="input-std mb-3 bg-slate-50">
                                <option value="62">62mm (DK-22205) - Cắt tự do</option>
                                <option value="12">12mm (DK-22214) - Cắt tự do</option>
                                <option value="23x23">23mm x 23mm (DK-11221) - Cố định</option>
                            </select>

                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <span class="label-mini">Chiều rộng</span>
                                    <input [value]="brotherWidth() + 'mm'" disabled class="input-std bg-slate-100 text-slate-500 text-center">
                                </div>
                                <div>
                                    <span class="label-mini">Chiều dài (Cắt)</span>
                                    <div class="relative">
                                        <input type="number" [ngModel]="brotherHeight()" (ngModelChange)="brotherHeight.set($event)" [disabled]="brotherPaperType() === '23x23'" class="input-std pr-8 text-center disabled:bg-slate-100 disabled:text-slate-500">
                                        <span class="absolute right-3 top-2 text-xs text-slate-400 font-bold">mm</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label class="label-std">Cỡ chữ & Định dạng</label>
                            <div class="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <span class="label-mini">Font Size (pt)</span>
                                    <input type="number" [ngModel]="fontSize()" (ngModelChange)="fontSize.set($event)" class="input-std">
                                </div>
                                <div>
                                    <span class="label-mini">Xoay ngang</span>
                                    <button (click)="rotateText.set(!rotateText())" class="input-std text-left flex justify-between items-center" [class.bg-blue-50]="rotateText()">
                                        <span>{{rotateText() ? 'Có (-90°)' : 'Không'}}</span>
                                        <i class="fa-solid fa-rotate-right text-xs"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                <!-- 4. TOMY A4 SPECIFIC CONFIG -->
                @if (printMode() === 'tomy_a4') {
                    <div class="space-y-4 animate-bounce-in">
                        <!-- Template Selection -->
                        <div>
                            <label class="label-std">Mẫu giấy Decal (Tomy)</label>
                            <select [ngModel]="selectedTomyId()" (ngModelChange)="onTomyChange($event)" class="input-std mb-2 bg-slate-50">
                                @for (tmpl of tomyTemplates; track tmpl.id) {
                                    <option [value]="tmpl.id">{{tmpl.name}}</option>
                                }
                            </select>
                            <div class="text-[10px] text-slate-500 bg-indigo-50 p-2 rounded border border-indigo-100 flex items-start gap-2">
                                <i class="fa-solid fa-circle-info mt-0.5 text-indigo-400"></i>
                                <span>Hệ thống tự động căn lề theo mẫu giấy bế sẵn. Bạn chỉ cần nạp giấy vào máy in A4 thông thường.</span>
                            </div>
                        </div>

                        <!-- Split Settings -->
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <label class="label-std mb-0">Chia nhỏ Tem (Split)</label>
                                <span class="text-[9px] text-slate-400">In nhiều mã vào 1 ô tem</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="grid grid-cols-5 gap-1 flex-1">
                                    @for (n of [1, 2, 3, 4, 5]; track n) {
                                        <button (click)="splitCount.set(n)" 
                                                class="py-1.5 rounded border text-xs font-bold transition"
                                                [class]="splitCount() === n ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'">
                                            {{n}}
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>

                        <!-- Calibration -->
                        <div>
                            <button (click)="showAdvanced.set(!showAdvanced())" class="flex items-center justify-between w-full text-xs font-bold text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                <span><i class="fa-solid fa-ruler-combined mr-1"></i> Căn chỉnh lề (mm)</span>
                                <i class="fa-solid" [class]="showAdvanced() ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
                            </button>
                            
                            @if (showAdvanced()) {
                                <div class="mt-2 grid grid-cols-2 gap-3 bg-white p-3 border border-slate-100 rounded-lg shadow-sm">
                                    <div><label class="label-mini">Top</label><input type="number" [ngModel]="marginTop()" (ngModelChange)="marginTop.set($event)" class="input-mini"></div>
                                    <div><label class="label-mini">Left</label><input type="number" [ngModel]="marginLeft()" (ngModelChange)="marginLeft.set($event)" class="input-mini"></div>
                                    <div><label class="label-mini">Gap X</label><input type="number" [ngModel]="gapX()" (ngModelChange)="gapX.set($event)" class="input-mini"></div>
                                    <div><label class="label-mini">Gap Y</label><input type="number" [ngModel]="gapY()" (ngModelChange)="gapY.set($event)" class="input-mini"></div>
                                    <div><label class="label-mini">Bỏ qua (Tem)</label><input type="number" [ngModel]="skippedCells()" (ngModelChange)="skippedCells.set($event)" class="input-mini text-orange-600"></div>
                                    <div><label class="label-mini">Font Size</label><input type="number" [ngModel]="fontSize()" (ngModelChange)="fontSize.set($event)" class="input-mini"></div>
                                </div>
                            }
                        </div>
                    </div>
                }

                <!-- 5. PLAIN A4 SPECIFIC CONFIG -->
                @if (printMode() === 'plain_a4') {
                    <div class="space-y-4 animate-bounce-in">
                        <div class="text-[10px] text-slate-500 bg-emerald-50 p-2 rounded border border-emerald-100 flex items-start gap-2">
                            <i class="fa-solid fa-scissors mt-0.5 text-emerald-500"></i>
                            <span>In trên giấy Decal A4 nguyên tờ. Hệ thống sẽ tự chia lưới và in viền mờ để bạn tự cắt.</span>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="label-mini">Số cột (Ngang)</label>
                                <input type="number" [ngModel]="plainCols()" (ngModelChange)="plainCols.set($event)" class="input-std text-center">
                            </div>
                            <div>
                                <label class="label-mini">Số hàng (Dọc)</label>
                                <input type="number" [ngModel]="plainRows()" (ngModelChange)="plainRows.set($event)" class="input-std text-center">
                            </div>
                        </div>

                        <!-- Split Settings -->
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <label class="label-std mb-0">Chia nhỏ Tem (Split)</label>
                                <span class="text-[9px] text-slate-400">In nhiều mã vào 1 ô tem</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="grid grid-cols-5 gap-1 flex-1">
                                    @for (n of [1, 2, 3, 4, 5]; track n) {
                                        <button (click)="splitCount.set(n)" 
                                                class="py-1.5 rounded border text-xs font-bold transition"
                                                [class]="splitCount() === n ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'">
                                            {{n}}
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>

                        <!-- Calibration -->
                        <div>
                            <button (click)="showAdvanced.set(!showAdvanced())" class="flex items-center justify-between w-full text-xs font-bold text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                <span><i class="fa-solid fa-ruler-combined mr-1"></i> Căn chỉnh & Viền</span>
                                <i class="fa-solid" [class]="showAdvanced() ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
                            </button>
                            
                            @if (showAdvanced()) {
                                <div class="mt-2 grid grid-cols-2 gap-3 bg-white p-3 border border-slate-100 rounded-lg shadow-sm">
                                    <div><label class="label-mini">Lề trên/dưới (mm)</label><input type="number" [ngModel]="marginTop()" (ngModelChange)="marginTop.set($event)" class="input-mini"></div>
                                    <div><label class="label-mini">Lề trái/phải (mm)</label><input type="number" [ngModel]="marginLeft()" (ngModelChange)="marginLeft.set($event)" class="input-mini"></div>
                                    <div><label class="label-mini">Khoảng cách X</label><input type="number" [ngModel]="gapX()" (ngModelChange)="gapX.set($event)" class="input-mini"></div>
                                    <div><label class="label-mini">Khoảng cách Y</label><input type="number" [ngModel]="gapY()" (ngModelChange)="gapY.set($event)" class="input-mini"></div>
                                    <div><label class="label-mini">Font Size</label><input type="number" [ngModel]="fontSize()" (ngModelChange)="fontSize.set($event)" class="input-mini"></div>
                                    <div class="flex items-center justify-center pt-3">
                                        <label class="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" [ngModel]="showCutLines()" (ngModelChange)="showCutLines.set($event)" class="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500">
                                            <span class="text-[10px] font-bold text-slate-600 uppercase">In viền cắt</span>
                                        </label>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                }
            </div>

            <!-- Footer Action -->
            <div class="p-5 border-t border-slate-200 bg-white shrink-0 sticky bottom-0 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                @if (printMode() === 'brother') {
                    <button (click)="printBrother()" [disabled]="rawInputCount() === 0" 
                            class="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-200 transition font-bold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group">
                        <i class="fa-solid fa-print text-lg group-hover:scale-110 transition-transform"></i> 
                        <span>In ngay (Brother)</span>
                    </button>
                } @else {
                    <button (click)="generateImagePdf()" [disabled]="rawInputCount() === 0 || isProcessing()" 
                            class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 transition font-bold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group">
                        @if(isProcessing()) {
                            <i class="fa-solid fa-spinner fa-spin text-lg"></i> <span>Đang tạo PDF...</span>
                        } @else {
                            <i class="fa-solid fa-file-pdf text-lg group-hover:-translate-y-1 transition-transform"></i> 
                            <span>Tải PDF (A4)</span>
                        }
                    </button>
                }
            </div>
        </div>

        <!-- RIGHT: Live Preview -->
        <div class="flex-1 bg-slate-200/50 md:overflow-auto p-8 flex justify-center items-start min-h-[500px] md:min-h-0 relative md:h-full">
            
            <!-- Zoom Controls -->
            <div class="absolute bottom-6 right-6 flex flex-col gap-2 bg-white p-2 rounded-xl shadow-lg border border-slate-200 z-30">
                <button (click)="adjustZoom(0.1)" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600"><i class="fa-solid fa-plus"></i></button>
                <span class="text-[10px] font-bold text-center text-slate-400">{{Math.round(zoomLevel() * 100)}}%</span>
                <button (click)="adjustZoom(-0.1)" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600"><i class="fa-solid fa-minus"></i></button>
            </div>

            <!-- Preview Wrapper -->
            <div class="space-y-10 pb-20 w-fit mx-auto origin-top transform transition-transform duration-300" 
                 [style.transform]="'scale(' + zoomLevel() + ')'">
                
                <!-- A. BROTHER PREVIEW -->
                @if (printMode() === 'brother') {
                    <div class="flex flex-col gap-1 items-center">
                        <div class="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Mô phỏng cuộn in ({{brotherWidth()}}mm)</div>
                        <div class="bg-slate-300 p-2 pb-10 rounded-t-lg shadow-inner">
                            <!-- Continuous Strip Simulation -->
                            <div id="brother-preview-strip" class="bg-white shadow-xl flex flex-col items-center"
                                 [style.width.mm]="brotherWidth()" [style.min-height.mm]="100">
                                @for (label of parseInput(rawInput()); track $index) {
                                    <div class="w-full border-b border-dashed border-slate-300 relative flex items-center justify-center overflow-hidden"
                                         [style.height.mm]="brotherHeight()">
                                        
                                        <span class="font-bold font-mono leading-none whitespace-nowrap"
                                              [class.vertical-text]="rotateText()"
                                              [style.font-size.pt]="fontSize()">
                                            {{label}}
                                        </span>

                                        <!-- Cut Line Visual -->
                                        @if (brotherPaperType() !== '23x23') {
                                            <div class="absolute bottom-0 left-0 w-full h-[1px] bg-red-200 opacity-50"></div>
                                        }
                                    </div>
                                }
                                @if (rawInputCount() === 0) {
                                    <div class="h-[50mm] w-full flex items-center justify-center text-slate-300 text-[10px] italic">Trống</div>
                                }
                            </div>
                        </div>
                        <div class="h-4 bg-slate-800 rounded-b-lg shadow-lg" [style.width.mm]="brotherWidth() + 8"></div> <!-- Printer Slot Visual -->
                    </div>
                }

                <!-- B. TOMY A4 & PLAIN A4 PREVIEW -->
                @if (printMode() === 'tomy_a4' || printMode() === 'plain_a4') {
                    @for (page of pages(); track page.pageIndex) {
                        <div id="label-page-{{page.pageIndex}}" 
                             class="bg-white shadow-2xl relative transition-all duration-300 box-border overflow-hidden ring-1 ring-slate-900/5" 
                             [style.width.mm]="layoutDims().pageW"
                             [style.height.mm]="layoutDims().pageH"
                             style="padding-top: {{marginTop()}}mm; padding-left: {{marginLeft()}}mm; padding-right: {{marginLeft()}}mm; padding-bottom: {{marginTop()}}mm;">
                            
                            <!-- The Grid -->
                            <div class="grid content-start h-full"
                                 [style.grid-template-columns]="'repeat(' + layoutDims().cols + ', minmax(0, 1fr))'"
                                 [style.gap]="gapY() + 'mm ' + gapX() + 'mm'">
                                
                                @for (cell of page.cells; track cell.index) {
                                    <div class="relative flex flex-col overflow-hidden group cursor-default transition-colors"
                                         [class.border]="printMode() === 'tomy_a4' || (printMode() === 'plain_a4' && showCutLines())"
                                         [class.border-slate-200]="printMode() === 'tomy_a4'"
                                         [class.border-slate-300]="printMode() === 'plain_a4' && showCutLines()"
                                         [class.border-dashed]="printMode() === 'plain_a4' && showCutLines()"
                                         [class.bg-slate-50]="cell.isEmpty"
                                         [class.opacity-40]="cell.isEmpty"
                                         [style.width.mm]="layoutDims().cellW"
                                         [style.height.mm]="layoutDims().cellH">
                                        
                                        @if(!cell.isEmpty) {
                                            <div class="absolute top-0.5 right-1 text-[6px] text-slate-200 select-none">{{cell.index + 1}}</div>
                                        }

                                        <!-- Content Stack -->
                                        @for (label of cell.subLabels; track $index; let last = $last) {
                                            <div class="flex-1 flex flex-col items-center justify-center w-full relative" 
                                                 [class.border-b]="!last" 
                                                 style="border-bottom-style: dashed; border-bottom-width: 1px; border-bottom-color: #cbd5e1;">
                                                <div class="w-full h-full flex items-center justify-center overflow-hidden p-0.5">
                                                    <span class="font-bold leading-none break-all text-center block"
                                                          [class.vertical-text]="rotateText()"
                                                          [style.font-size.pt]="fontSize()"
                                                          [style.font-family]="'Roboto Mono'">
                                                        {{label}}
                                                    </span>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                }
                            </div>

                            <div class="absolute bottom-2 left-0 w-full text-center pointer-events-none">
                                <span class="bg-slate-100/90 text-slate-400 text-[8px] font-bold px-2 py-0.5 rounded border border-slate-200 shadow-sm">
                                    Page {{page.pageIndex + 1}} (A4)
                                </span>
                            </div>
                        </div>
                    }
                }
            </div>
        </div>
    </div>
  `,
  styles: [`
    .label-std { display: block; font-size: 11px; font-weight: 800; color: #334155; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.5px; }
    .label-mini { display: block; font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 2px; }
    .input-std { width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px; font-size: 13px; font-weight: 600; color: #1e293b; outline: none; transition: all; }
    .input-std:focus { border-color: #3b82f6; ring: 2px; ring-color: #bfdbfe; }
    .input-mini { width: 100%; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 4px; font-size: 11px; font-weight: 700; text-align: center; outline: none; }
    .input-mini:focus { background-color: white; border-color: #3b82f6; }
    
    .vertical-text {
        writing-mode: vertical-rl;
        text-orientation: mixed;
        transform: rotate(180deg); 
    }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
  `]
})
export class LabelPrintComponent {
  Math = Math;
  toast = inject(ToastService);
  state = inject(StateService);

  // Core State
  printMode = signal<PrintMode>('tomy_a4');
  rawInput = signal('');
  isProcessing = signal(false);
  zoomLevel = signal(1.0);
  
  // Fetch Data State
  fetchDate = signal<string>(new Date().toISOString().split('T')[0]);
  
  // Layout Config
  splitCount = signal<number>(1);
  fontSize = signal<number>(12);
  rotateText = signal<boolean>(false);
  
  // Tomy Config
  tomyTemplates = TOMY_TEMPLATES;
  selectedTomyId = signal<string>('tomy_145');
  
  // Plain A4 Config
  plainCols = signal<number>(4);
  plainRows = signal<number>(10);
  showCutLines = signal<boolean>(true);
  
  // Sheet Calibration (A4/A5)
  marginTop = signal<number>(10); 
  marginLeft = signal<number>(5); 
  gapX = signal<number>(2);
  gapY = signal<number>(2);
  skippedCells = signal<number>(0);
  showAdvanced = signal(false);

  // Brother Config
  brotherPaperType = signal<'62' | '12' | '23x23'>('62');
  brotherWidth = signal<number>(62);
  brotherHeight = signal<number>(25); // Default length per label

  // Computed
  rawInputCount = computed(() => this.parseInput(this.rawInput()).length);

  layoutDims = computed(() => {
      const mode = this.printMode();

      if (mode === 'tomy_a4') {
          const tmpl = this.tomyTemplates.find(t => t.id === this.selectedTomyId()) || this.tomyTemplates[0];
          return { pageW: 210, pageH: 297, cellW: tmpl.cellW, cellH: tmpl.cellH, cols: tmpl.cols, rows: tmpl.rows }; 
      } else if (mode === 'plain_a4') {
          const c = this.plainCols();
          const r = this.plainRows();
          const w = (210 - this.marginLeft() * 2 - this.gapX() * (c - 1)) / c;
          const h = (297 - this.marginTop() * 2 - this.gapY() * (r - 1)) / r;
          return { pageW: 210, pageH: 297, cellW: w, cellH: h, cols: c, rows: r };
      }
      return { pageW: 0, pageH: 0, cellW: 0, cellH: 0, cols: 0, rows: 0 };
  });

  constructor() {
      // Auto-defaults when switching input count or mode
      effect(() => {
          const mode = this.printMode();
          if (mode === 'brother') {
              this.fontSize.set(16);
              this.rotateText.set(false);
          } else {
              // Sheet defaults
              const split = this.splitCount();
              this.fontSize.set(split === 1 ? 10 : split === 2 ? 8 : 6);
          }
      }, { allowSignalWrites: true });
  }

  setMode(mode: PrintMode) {
      this.printMode.set(mode);
      // Reset view defaults
      this.zoomLevel.set(mode === 'brother' ? 1.5 : 1.0);
      if (mode === 'brother') {
          this.onBrotherPaperChange(this.brotherPaperType());
      } else if (mode === 'tomy_a4') {
          this.onTomyChange(this.selectedTomyId());
      } else if (mode === 'plain_a4') {
          this.marginTop.set(10);
          this.marginLeft.set(10);
          this.gapX.set(0);
          this.gapY.set(0);
          this.splitCount.set(1);
          this.rotateText.set(false);
          this.fontSize.set(10);
      }
  }

  onTomyChange(id: string) {
      this.selectedTomyId.set(id);
      const tmpl = this.tomyTemplates.find(t => t.id === id);
      if (tmpl) {
          this.marginTop.set(tmpl.marginTop);
          this.marginLeft.set(tmpl.marginLeft);
          this.gapX.set(tmpl.gapX);
          this.gapY.set(tmpl.gapY);
          this.splitCount.set(1);
          this.rotateText.set(false);
      }
  }

  onBrotherPaperChange(type: '62' | '12' | '23x23') {
      this.brotherPaperType.set(type);
      if (type === '62') {
          this.brotherWidth.set(62);
          this.brotherHeight.set(25);
          this.fontSize.set(16);
          this.rotateText.set(false);
      } else if (type === '12') {
          this.brotherWidth.set(12);
          this.brotherHeight.set(30);
          this.fontSize.set(10);
          this.rotateText.set(true); // Thường in dọc trên cuộn 12mm
      } else if (type === '23x23') {
          this.brotherWidth.set(23);
          this.brotherHeight.set(23);
          this.fontSize.set(10);
          this.rotateText.set(false);
      }
  }

  fetchFromRequests() {
      const targetDate = this.fetchDate();
      if (!targetDate) return;

      const approvedReqs = this.state.approvedRequests();
      const samples = new Set<string>();

      approvedReqs.forEach(req => {
          // Lấy ngày phân tích hoặc ngày duyệt
          let reqDateStr = '';
          if (req.analysisDate) {
              reqDateStr = req.analysisDate;
          } else {
              const ts = req.approvedAt || req.timestamp;
              const d = (ts && typeof ts.toDate === 'function') ? ts.toDate() : new Date(ts);
              reqDateStr = d.toISOString().split('T')[0];
          }

          if (reqDateStr === targetDate && req.sampleList && req.sampleList.length > 0) {
              req.sampleList.forEach(s => samples.add(s));
          }
      });

      if (samples.size === 0) {
          this.toast.show(`Không tìm thấy mẫu nào trong các yêu cầu đã duyệt ngày ${targetDate}`, 'info');
          return;
      }

      const currentInput = this.rawInput().trim();
      const newSamples = Array.from(samples).join('\n');
      
      if (currentInput) {
          this.rawInput.set(currentInput + '\n' + newSamples);
      } else {
          this.rawInput.set(newSamples);
      }
      
      this.toast.show(`Đã thêm ${samples.size} mã mẫu từ ngày ${targetDate}`, 'success');
  }

  updateInput(val: string) { this.rawInput.set(val); }
  clearInput() { this.rawInput.set(''); }
  
  addExample() {
      const ex = Array.from({length: 15}, (_, i) => `STD-${(i+1).toString().padStart(3,'0')}`).join('\n');
      this.rawInput.set(ex);
  }

  adjustZoom(delta: number) {
      this.zoomLevel.update(z => Math.max(0.5, Math.min(2.5, z + delta)));
  }

  parseInput(text: string): string[] {
      return text.split(/[\n,;]+/).map(s => s.trim()).filter(s => s !== '');
  }

  // --- SHEET LOGIC ---
  pages = computed<LabelPage[]>(() => {
      if (this.printMode() === 'brother') return [];

      const rawIds = this.parseInput(this.rawInput());
      const split = this.splitCount();
      const skipped = this.skippedCells();
      
      // Calculate cells per page based on layout
      const dims = this.layoutDims();
      const cols = dims.cols || 1;
      const rows = dims.rows || 1;
      const CELLS_PER_PAGE = cols * rows;
      
      const allCells: LabelCell[] = [];
      let globalCellIndex = 0;

      // Fill Skipped
      for(let i=0; i<skipped; i++) {
          allCells.push({ subLabels: [], isEmpty: true, index: globalCellIndex++ });
      }

      // Fill Data
      let currentSub: string[] = [];
      for(const id of rawIds) {
          currentSub.push(id);
          if(currentSub.length === split) {
              allCells.push({ subLabels: [...currentSub], isEmpty: false, index: globalCellIndex++ });
              currentSub = [];
          }
      }
      if(currentSub.length > 0) {
          allCells.push({ subLabels: [...currentSub], isEmpty: false, index: globalCellIndex++ });
      }

      // Pagination
      const pages: LabelPage[] = [];
      for (let i = 0; i < allCells.length; i += CELLS_PER_PAGE) {
          const pageCells = allCells.slice(i, i + CELLS_PER_PAGE);
          while(pageCells.length < CELLS_PER_PAGE) {
              pageCells.push({ subLabels: [], isEmpty: true, index: -1 });
          }
          pages.push({ cells: pageCells, pageIndex: pages.length });
      }
      
      if (pages.length === 0 && rawIds.length === 0) {
           const emptyCells = Array(CELLS_PER_PAGE).fill(null).map((_, idx) => ({ 
               subLabels: [], isEmpty: true, index: idx < skipped ? idx : -1 
           }));
           pages.push({ cells: emptyCells, pageIndex: 0 });
      }

      return pages;
  });

  // --- BROTHER PRINTING LOGIC (Direct Window Print) ---
  printBrother() {
      const labels = this.parseInput(this.rawInput());
      if (labels.length === 0) return;

      const w = this.brotherWidth();
      const h = this.brotherHeight();
      const fs = this.fontSize();
      const rotate = this.rotateText();
      const isFixed = this.brotherPaperType() === '23x23';

      // Create a dedicated print window to isolate styles
      const printWindow = window.open('', '_blank', 'width=400,height=600');
      if (!printWindow) {
          this.toast.show('Trình duyệt chặn Pop-up. Hãy cho phép để in.', 'error');
          return;
      }

      const css = `
        @page { size: ${w}mm ${isFixed ? h + 'mm' : 'auto'}; margin: 0; }
        body { margin: 0; padding: 0; font-family: 'Roboto Mono', monospace; }
        .label-container {
            width: ${w}mm;
            height: ${h}mm;
            display: flex;
            align-items: center;
            justify-content: center;
            ${!isFixed ? 'border-bottom: 1px dashed #ccc;' : ''}
            page-break-after: always;
            box-sizing: border-box;
            overflow: hidden;
            position: relative;
        }
        .label-text {
            font-size: ${fs}pt;
            font-weight: bold;
            text-align: center;
            line-height: 1;
            word-break: break-all;
            padding: 1mm;
            ${rotate ? 'writing-mode: vertical-rl; transform: rotate(180deg);' : ''}
        }
        @media print {
            .label-container { border-bottom: none; }
        }
      `;

      let htmlContent = `<html><head><title>Brother Print</title><style>${css}</style></head><body>`;
      
      labels.forEach(label => {
          htmlContent += `<div class="label-container"><div class="label-text">${label}</div></div>`;
      });

      htmlContent += `</body></html>`;

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load then print
      printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
          // Optional: printWindow.close();
      };
  }

  // --- SHEET PDF GENERATION (A4) ---
  async generateImagePdf() {
      const pages = this.pages();
      const validPages = pages.filter((p, i) => i === 0 || p.cells.some(c => !c.isEmpty && c.index !== -1));
      
      if (this.rawInputCount() === 0 && this.skippedCells() === 0) return;

      this.isProcessing.set(true);
      this.toast.show('Đang tạo PDF chất lượng cao...', 'info');
      await new Promise(resolve => setTimeout(resolve, 150));

      try {
          // Dynamic imports fix ESM issues
          const { jsPDF } = await import('jspdf');
          const html2canvas = (await import('html2canvas')).default;

          let format = 'a4';
          let orientation: 'p' | 'l' = 'p';
          
          // PDF Dimensions (mm)
          let pdfW = 210; let pdfH = 297; // A4 Portrait

          const doc = new jsPDF(orientation, 'mm', format);

          for (let i = 0; i < validPages.length; i++) {
              const elementId = `label-page-${validPages[i].pageIndex}`;
              const element = document.getElementById(elementId);
              if (!element) continue;

              const canvas = await html2canvas(element, {
                  scale: 3, // 3x scale for crisp text
                  useCORS: true,
                  logging: false,
                  backgroundColor: '#ffffff'
              });

              const imgData = canvas.toDataURL('image/jpeg', 0.95);
              if (i > 0) doc.addPage();
              doc.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH);
          }

          const filename = `Labels_A4_Tomy_${new Date().toISOString().slice(0,10)}.pdf`;
          doc.save(filename);
          this.toast.show('Tạo PDF thành công!', 'success');

      } catch (e: any) {
          console.error(e);
          this.toast.show('Lỗi tạo PDF: ' + e.message, 'error');
      } finally {
          this.isProcessing.set(false);
      }
  }
}
