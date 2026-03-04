
import { Component, inject, signal, computed, effect, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';
import { StateService } from '../../core/services/state.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import JsBarcode from 'jsbarcode';

type PrintMode = 'brother' | 'tomy_a4' | 'plain_a4';
type DisplayFormat = 'text' | 'barcode' | 'barcode_text';

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
  { id: 'tomy_145', name: 'Tomy 145 (65 tem - 38x21mm)', cols: 5, rows: 13, cellW: 38, cellH: 21, marginTop: 12, marginLeft: 10, gapX: 0, gapY: 0 },
  { id: 'tomy_149', name: 'Tomy 149 (21 tem - 70x42.5mm)', cols: 3, rows: 7, cellW: 70, cellH: 42.5, marginTop: 0, marginLeft: 0, gapX: 0, gapY: 0 },
  { id: 'tomy_144', name: 'Tomy 144 (30 tem - 67x28mm)', cols: 3, rows: 10, cellW: 67, cellH: 28, marginTop: 8.5, marginLeft: 4.5, gapX: 0, gapY: 0 },
  { id: 'tomy_109', name: 'Tomy 109 (96 tem - 22x14mm)', cols: 8, rows: 12, cellW: 22, cellH: 14, marginTop: 64.5, marginLeft: 17, gapX: 0, gapY: 0 },
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

                    <textarea [ngModel]="rawInput()" (ngModelChange)="onInputChanged($event)" 
                              class="w-full h-28 p-3 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-slate-400 outline-none resize-none shadow-inner bg-slate-50 focus:bg-white transition" 
                              placeholder="Paste mã vào đây hoặc lấy từ yêu cầu..."></textarea>
                    <div class="flex gap-2 mt-2 justify-end">
                        <button (click)="removeDuplicates()" class="text-[10px] text-slate-500 hover:bg-slate-100 px-2 py-1 rounded transition font-bold"><i class="fa-solid fa-filter"></i> Lọc trùng</button>
                        <button (click)="sortInput()" class="text-[10px] text-slate-500 hover:bg-slate-100 px-2 py-1 rounded transition font-bold"><i class="fa-solid fa-arrow-down-a-z"></i> Sắp xếp</button>
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
                                <optgroup label="Cuộn liên tục (Cắt tự do)">
                                    <option value="62">62mm (DK-22205)</option>
                                    <option value="29">29mm (1.1")</option>
                                    <option value="12">12mm (DK-22214)</option>
                                </optgroup>
                                <optgroup label="Kích thước cố định (Cắt theo trang)">
                                    <option value="29x90">29mm x 90mm (1.1" x 3.5")</option>
                                    <option value="29x42">29mm x 42mm (1.1" x 1.6")</option>
                                    <option value="32x32">32mm x 32mm (Vuông)</option>
                                    <option value="23x23">23mm x 23mm (DK-11221)</option>
                                </optgroup>
                            </select>

                            <div class="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <span class="label-mini">Chiều rộng cuộn</span>
                                    <input [value]="brotherWidth() + 'mm'" disabled class="input-std bg-slate-100 text-slate-500 text-center">
                                </div>
                                <div>
                                    @if (isBrotherFixed()) {
                                        <span class="label-mini">Chiều dài trang in</span>
                                        <input [value]="brotherPageHeight() + 'mm'" disabled class="input-std bg-slate-100 text-slate-500 text-center">
                                    } @else {
                                        <span class="label-mini">Chiều dài 1 tem</span>
                                        <div class="relative">
                                            <input type="number" [ngModel]="brotherLabelHeight()" (ngModelChange)="brotherLabelHeight.set($event)" class="input-std pr-8 text-center">
                                            <span class="absolute right-3 top-2 text-xs text-slate-400 font-bold">mm</span>
                                        </div>
                                    }
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <span class="label-mini">Số cột (Ngang)</span>
                                    <input type="number" [ngModel]="brotherCols()" (ngModelChange)="brotherCols.set($event)" class="input-std text-center">
                                </div>
                                @if (isBrotherFixed()) {
                                    <div>
                                        <span class="label-mini">Số tem / trang (Dọc)</span>
                                        <input type="number" [ngModel]="brotherRows()" (ngModelChange)="brotherRows.set($event)" class="input-std text-center">
                                    </div>
                                }
                            </div>

                            <div class="bg-blue-50 p-2 rounded border border-blue-100 mb-3 text-xs text-blue-800 flex flex-col gap-1">
                                <div><i class="fa-solid fa-circle-info"></i> <b>Tổng kết trang in:</b></div>
                                <div>- Kích thước 1 tem: <b>{{brotherWidth()}}mm x {{Math.round(actualBrotherLabelHeight() * 10) / 10}}mm</b></div>
                                <div>- Kích thước trang/cắt: <b>{{brotherWidth()}}mm x {{Math.round(actualBrotherPageHeight() * 10) / 10}}mm</b></div>
                            </div>

                            <div class="flex items-center justify-start mb-3">
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" [ngModel]="brotherShowCutLines()" (ngModelChange)="brotherShowCutLines.set($event)" class="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500">
                                    <span class="text-[10px] font-bold text-slate-600 uppercase">In viền chia tem (Cắt tay)</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label class="label-std">Định dạng & Mã vạch</label>
                            <select [ngModel]="displayFormat()" (ngModelChange)="displayFormat.set($event)" class="input-std mb-3 bg-slate-50">
                                <option value="text">Chỉ in Chữ (Text)</option>
                                <option value="barcode">Chỉ in Mã vạch (Barcode)</option>
                                <option value="barcode_text">Mã vạch + Chữ ở dưới</option>
                            </select>

                            @if (displayFormat() !== 'text') {
                                <div class="grid grid-cols-2 gap-3 mb-3 bg-slate-50 p-2 rounded border border-slate-200">
                                    <div>
                                        <span class="label-mini">Độ rộng vạch (px)</span>
                                        <input type="number" [ngModel]="barcodeWidth()" (ngModelChange)="barcodeWidth.set($event)" class="input-std text-center" min="1" max="4" step="0.5">
                                    </div>
                                    <div>
                                        <span class="label-mini">Chiều cao mã (px)</span>
                                        <input type="number" [ngModel]="barcodeHeight()" (ngModelChange)="barcodeHeight.set($event)" class="input-std text-center" min="10" max="100" step="5">
                                    </div>
                                </div>
                            }

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
                                    <div class="col-span-2 mt-2 pt-2 border-t border-slate-100">
                                        <label class="label-mini">Định dạng hiển thị</label>
                                        <select [ngModel]="displayFormat()" (ngModelChange)="displayFormat.set($event)" class="input-mini bg-slate-50 text-left">
                                            <option value="text">Chỉ in Chữ</option>
                                            <option value="barcode">Chỉ in Mã vạch</option>
                                            <option value="barcode_text">Mã vạch + Chữ</option>
                                        </select>
                                    </div>
                                    @if (displayFormat() !== 'text') {
                                        <div><label class="label-mini">Rộng vạch (px)</label><input type="number" [ngModel]="barcodeWidth()" (ngModelChange)="barcodeWidth.set($event)" class="input-mini" min="1" max="4" step="0.5"></div>
                                        <div><label class="label-mini">Cao mã (px)</label><input type="number" [ngModel]="barcodeHeight()" (ngModelChange)="barcodeHeight.set($event)" class="input-mini" min="10" max="100" step="5"></div>
                                    }
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
                                    <div class="col-span-2 mt-2 pt-2 border-t border-slate-100">
                                        <label class="label-mini">Định dạng hiển thị</label>
                                        <select [ngModel]="displayFormat()" (ngModelChange)="displayFormat.set($event)" class="input-mini bg-slate-50 text-left">
                                            <option value="text">Chỉ in Chữ</option>
                                            <option value="barcode">Chỉ in Mã vạch</option>
                                            <option value="barcode_text">Mã vạch + Chữ</option>
                                        </select>
                                    </div>
                                    @if (displayFormat() !== 'text') {
                                        <div><label class="label-mini">Rộng vạch (px)</label><input type="number" [ngModel]="barcodeWidth()" (ngModelChange)="barcodeWidth.set($event)" class="input-mini" min="1" max="4" step="0.5"></div>
                                        <div><label class="label-mini">Cao mã (px)</label><input type="number" [ngModel]="barcodeHeight()" (ngModelChange)="barcodeHeight.set($event)" class="input-mini" min="10" max="100" step="5"></div>
                                    }
                                    <div class="flex items-center justify-center pt-3 col-span-2">
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
                    <button (click)="printA4()" [disabled]="rawInputCount() === 0" 
                            class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 transition font-bold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group">
                        <i class="fa-solid fa-print text-lg group-hover:scale-110 transition-transform"></i> 
                        <span>In ngay (A4)</span>
                    </button>
                }
            </div>
        </div>

        <!-- RIGHT: Live Preview -->
        <div #previewContainer class="flex-1 bg-slate-200/50 md:overflow-auto p-8 flex justify-center items-start min-h-[500px] md:min-h-0 relative md:h-full">
            
            <!-- Zoom Controls -->
            <div class="absolute bottom-6 right-6 flex flex-col gap-2 bg-white p-2 rounded-xl shadow-lg border border-slate-200 z-30">
                <button (click)="adjustZoom(0.1)" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600" title="Phóng to"><i class="fa-solid fa-plus"></i></button>
                <span class="text-[10px] font-bold text-center text-slate-400">{{Math.round(zoomLevel() * 100)}}%</span>
                <button (click)="adjustZoom(-0.1)" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600" title="Thu nhỏ"><i class="fa-solid fa-minus"></i></button>
                <div class="h-px bg-slate-200 w-full my-1"></div>
                <button (click)="fitToScreen()" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-blue-600" title="Vừa màn hình"><i class="fa-solid fa-expand"></i></button>
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
                                @for (page of brotherPages(); track $index) {
                                    <div class="w-full relative overflow-hidden box-border"
                                         [style.height.mm]="actualBrotherPageHeight()"
                                         [class.border-b]="isBrotherFixed()"
                                         [class.border-dashed]="isBrotherFixed()"
                                         [class.border-slate-300]="isBrotherFixed()">
                                        
                                        <div class="w-full h-full grid"
                                             [style.grid-template-columns]="'repeat(' + brotherCols() + ', 1fr)'"
                                             [style.grid-template-rows]="'repeat(' + (page.length / brotherCols()) + ', 1fr)'">
                                            @for (label of page; track $index) {
                                                <div class="flex items-center justify-center overflow-hidden p-0.5 box-border"
                                                     [class.border-r]="brotherShowCutLines() && ($index % brotherCols() !== brotherCols() - 1)"
                                                     [class.border-b]="brotherShowCutLines() && (Math.floor($index / brotherCols()) !== (page.length / brotherCols()) - 1)"
                                                     [class.border-dashed]="brotherShowCutLines()"
                                                     [class.border-slate-300]="brotherShowCutLines()">
                                                    <div class="flex flex-col items-center justify-center w-full h-full overflow-hidden"
                                                         [class.vertical-text]="rotateText()">
                                                        @if (displayFormat() !== 'text' && label) {
                                                            <img [src]="generateBarcode(label)" class="max-w-full object-contain" [style.height.px]="barcodeHeight()" />
                                                        }
                                                        @if (displayFormat() !== 'barcode' && label) {
                                                            <span class="font-bold font-mono leading-none text-center overflow-hidden px-1"
                                                                  [class.mt-1]="displayFormat() === 'barcode_text'"
                                                                  style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; word-break: break-all;"
                                                                  [class.text-red-600]="label.length > 30"
                                                                  [style.font-size.pt]="fontSize()"
                                                                  [title]="label.length > 30 ? 'Cảnh báo: Mã quá dài có thể bị cắt khi in' : ''">
                                                                {{label}}
                                                            </span>
                                                        }
                                                    </div>
                                                </div>
                                            }
                                        </div>
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
                            <div class="grid content-start justify-start"
                                 [style.grid-template-columns]="'repeat(' + layoutDims().cols + ', ' + layoutDims().cellW + 'mm)'"
                                 [style.grid-template-rows]="'repeat(' + layoutDims().rows + ', ' + layoutDims().cellH + 'mm)'"
                                 [style.gap]="gapY() + 'mm ' + gapX() + 'mm'">
                                
                                @for (cell of page.cells; track cell.index) {
                                    <div class="relative flex flex-col overflow-hidden group cursor-default transition-colors w-full h-full box-border"
                                         [class.border]="printMode() === 'tomy_a4' || (printMode() === 'plain_a4' && showCutLines())"
                                         [class.border-slate-200]="printMode() === 'tomy_a4'"
                                         [class.border-slate-300]="printMode() === 'plain_a4' && showCutLines()"
                                         [class.border-dashed]="printMode() === 'plain_a4' && showCutLines()"
                                         [class.bg-slate-50]="cell.isEmpty"
                                         [class.opacity-40]="cell.isEmpty">
                                        
                                        @if(!cell.isEmpty) {
                                            <div class="absolute top-0.5 right-1 text-[6px] text-slate-200 select-none">{{cell.index + 1}}</div>
                                        }

                                        <!-- Content Stack -->
                                        @for (label of cell.subLabels; track $index; let last = $last) {
                                            <div class="flex-1 flex flex-col items-center justify-center w-full relative" 
                                                 [class.border-b]="!last" 
                                                 style="border-bottom-style: dashed; border-bottom-width: 1px; border-bottom-color: #cbd5e1;">
                                                <div class="w-full h-full flex flex-col items-center justify-center overflow-hidden p-0.5"
                                                     [class.vertical-text]="rotateText()">
                                                    @if (displayFormat() !== 'text' && label) {
                                                        <img [src]="generateBarcode(label)" class="max-w-full object-contain" [style.height.px]="barcodeHeight()" />
                                                    }
                                                    @if (displayFormat() !== 'barcode' && label) {
                                                        <span class="font-bold font-mono leading-none text-center overflow-hidden px-1"
                                                              [class.mt-1]="displayFormat() === 'barcode_text'"
                                                              style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; word-break: break-all;"
                                                              [class.text-red-600]="label.length > 30"
                                                              [style.font-size.pt]="fontSize()"
                                                              [style.font-family]="'Roboto Mono'"
                                                              [title]="label.length > 30 ? 'Cảnh báo: Mã quá dài có thể bị cắt khi in' : ''">
                                                            {{label}}
                                                        </span>
                                                    }
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
export class LabelPrintComponent implements AfterViewInit {
  Math = Math;
  toast = inject(ToastService);
  state = inject(StateService);

  @ViewChild('previewContainer') previewContainer!: ElementRef;

  // Core State
  printMode = signal<PrintMode>('tomy_a4');
  rawInput = signal('');
  zoomLevel = signal(1.0);
  
  // Input Debounce
  private inputSubject = new Subject<string>();

  // Fetch Data State
  fetchDate = signal<string>(new Date().toISOString().split('T')[0]);
  
  // Layout Config
  splitCount = signal<number>(1);
  fontSize = signal<number>(12);
  rotateText = signal<boolean>(false);
  displayFormat = signal<DisplayFormat>('text');
  barcodeWidth = signal<number>(1.5);
  barcodeHeight = signal<number>(30);
  
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
  brotherPaperType = signal<string>('62');
  brotherWidth = signal<number>(62);
  brotherLabelHeight = signal<number>(25); // For continuous
  brotherPageHeight = signal<number>(90); // For fixed
  brotherCols = signal<number>(1);
  brotherRows = signal<number>(1);
  brotherShowCutLines = signal<boolean>(false);

  isBrotherFixed = computed(() => ['29x90', '29x42', '32x32', '23x23'].includes(this.brotherPaperType()));

  actualBrotherPageHeight = computed(() => {
      if (this.isBrotherFixed()) return this.brotherPageHeight();
      const labels = this.parseInput(this.rawInput());
      const cols = Math.max(1, this.brotherCols());
      const rows = Math.max(1, Math.ceil(labels.length / cols));
      return this.brotherLabelHeight() * rows;
  });

  actualBrotherLabelHeight = computed(() => {
      if (this.isBrotherFixed()) return this.brotherPageHeight() / Math.max(1, this.brotherRows());
      return this.brotherLabelHeight();
  });

  // Computed
  rawInputCount = computed(() => this.parseInput(this.rawInput()).length);

  brotherPages = computed(() => {
      const labels = this.parseInput(this.rawInput());
      if (labels.length === 0) return [];
      const cols = Math.max(1, this.brotherCols());
      
      if (!this.isBrotherFixed()) {
          // Continuous roll: All labels in ONE single page
          const totalCells = Math.ceil(labels.length / cols) * cols;
          const page = [...labels];
          while (page.length < totalCells) page.push('');
          return [page];
      } else {
          // Fixed size: Split into multiple pages
          const rows = Math.max(1, this.brotherRows());
          const perPage = cols * rows;
          const pages: string[][] = [];
          for (let i = 0; i < labels.length; i += perPage) {
              const chunk = labels.slice(i, i + perPage);
              while (chunk.length < perPage) {
                  chunk.push(''); // Fill empty cells
              }
              pages.push(chunk);
          }
          return pages;
      }
  });

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
      // Setup Debounce for Input
      this.inputSubject.pipe(
          debounceTime(300),
          distinctUntilChanged()
      ).subscribe(val => {
          this.rawInput.set(val);
      });

      // Load saved config from localStorage
      this.loadProfile('tomy_a4'); // Load default profile first

      // Save config to localStorage whenever it changes
      effect(() => {
          this.saveCurrentProfile();
      });
  }

  ngAfterViewInit() {
      // Auto fit to screen on load
      setTimeout(() => this.fitToScreen(), 100);
  }

  // --- PROFILE MANAGEMENT ---
  private getProfileKey(mode: PrintMode): string {
      return `labelPrintConfig_${mode}`;
  }

  private loadProfile(mode: PrintMode) {
      const saved = localStorage.getItem(this.getProfileKey(mode));
      if (saved) {
          try {
              const config = JSON.parse(saved);
              // Common
              if (config.fontSize) this.fontSize.set(config.fontSize);
              if (config.rotateText !== undefined) this.rotateText.set(config.rotateText);
              if (config.splitCount) this.splitCount.set(config.splitCount);
              if (config.displayFormat) this.displayFormat.set(config.displayFormat);
              if (config.barcodeWidth) this.barcodeWidth.set(config.barcodeWidth);
              if (config.barcodeHeight) this.barcodeHeight.set(config.barcodeHeight);
              
              // Brother
              if (mode === 'brother') {
                  if (config.brotherPaperType) this.brotherPaperType.set(config.brotherPaperType);
                  if (config.brotherCols) this.brotherCols.set(config.brotherCols);
                  if (config.brotherRows) this.brotherRows.set(config.brotherRows);
                  if (config.brotherShowCutLines !== undefined) this.brotherShowCutLines.set(config.brotherShowCutLines);
                  if (config.brotherWidth) this.brotherWidth.set(config.brotherWidth);
                  if (config.brotherLabelHeight) this.brotherLabelHeight.set(config.brotherLabelHeight);
                  if (config.brotherPageHeight) this.brotherPageHeight.set(config.brotherPageHeight);
                  
                  // Migration from old brotherHeight
                  if (config.brotherHeight && !config.brotherLabelHeight && !config.brotherPageHeight) {
                      if (['29x90', '29x42', '32x32', '23x23'].includes(config.brotherPaperType)) {
                          this.brotherPageHeight.set(config.brotherHeight);
                      } else {
                          this.brotherLabelHeight.set(config.brotherHeight);
                      }
                  }
              }
              
              // Tomy
              if (mode === 'tomy_a4') {
                  if (config.selectedTomyId) this.selectedTomyId.set(config.selectedTomyId);
                  if (config.marginTop !== undefined) this.marginTop.set(config.marginTop);
                  if (config.marginLeft !== undefined) this.marginLeft.set(config.marginLeft);
                  if (config.gapX !== undefined) this.gapX.set(config.gapX);
                  if (config.gapY !== undefined) this.gapY.set(config.gapY);
              }
              
              // Plain A4
              if (mode === 'plain_a4') {
                  if (config.plainCols) this.plainCols.set(config.plainCols);
                  if (config.plainRows) this.plainRows.set(config.plainRows);
                  if (config.marginTop !== undefined) this.marginTop.set(config.marginTop);
                  if (config.marginLeft !== undefined) this.marginLeft.set(config.marginLeft);
                  if (config.gapX !== undefined) this.gapX.set(config.gapX);
                  if (config.gapY !== undefined) this.gapY.set(config.gapY);
                  if (config.showCutLines !== undefined) this.showCutLines.set(config.showCutLines);
              }
          } catch (e) {
              console.error(`Failed to load print config for ${mode}`, e);
          }
      } else {
          // Apply defaults if no profile exists
          this.applyDefaultsForMode(mode);
      }
  }

  private saveCurrentProfile() {
      const mode = this.printMode();
      const config: any = {
          fontSize: this.fontSize(),
          rotateText: this.rotateText(),
          splitCount: this.splitCount(),
          displayFormat: this.displayFormat(),
          barcodeWidth: this.barcodeWidth(),
          barcodeHeight: this.barcodeHeight()
      };

      if (mode === 'brother') {
          config.brotherPaperType = this.brotherPaperType();
          config.brotherCols = this.brotherCols();
          config.brotherRows = this.brotherRows();
          config.brotherShowCutLines = this.brotherShowCutLines();
          config.brotherWidth = this.brotherWidth();
          config.brotherLabelHeight = this.brotherLabelHeight();
          config.brotherPageHeight = this.brotherPageHeight();
      } else if (mode === 'tomy_a4') {
          config.selectedTomyId = this.selectedTomyId();
          config.marginTop = this.marginTop();
          config.marginLeft = this.marginLeft();
          config.gapX = this.gapX();
          config.gapY = this.gapY();
      } else if (mode === 'plain_a4') {
          config.plainCols = this.plainCols();
          config.plainRows = this.plainRows();
          config.marginTop = this.marginTop();
          config.marginLeft = this.marginLeft();
          config.gapX = this.gapX();
          config.gapY = this.gapY();
          config.showCutLines = this.showCutLines();
      }

      localStorage.setItem(this.getProfileKey(mode), JSON.stringify(config));
      // Also save the last used mode
      localStorage.setItem('labelPrintLastMode', mode);
  }

  private applyDefaultsForMode(mode: PrintMode) {
      if (mode === 'brother') {
          this.onBrotherPaperChange('62');
      } else if (mode === 'tomy_a4') {
          this.onTomyChange('tomy_145');
      } else if (mode === 'plain_a4') {
          this.marginTop.set(10);
          this.marginLeft.set(10);
          this.gapX.set(0);
          this.gapY.set(0);
          this.splitCount.set(1);
          this.rotateText.set(false);
          this.fontSize.set(10);
          this.plainCols.set(4);
          this.plainRows.set(10);
          this.showCutLines.set(true);
      }
  }

  setMode(mode: PrintMode) {
      if (this.printMode() === mode) return;
      
      // Save current profile before switching
      this.saveCurrentProfile();
      
      this.printMode.set(mode);
      
      // Load profile for new mode
      this.loadProfile(mode);
      
      // Reset view defaults
      setTimeout(() => this.fitToScreen(), 50);
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

  onBrotherPaperChange(type: string) {
      this.brotherPaperType.set(type);
      if (type === '62') {
          this.brotherWidth.set(62);
          this.brotherLabelHeight.set(25);
          this.fontSize.set(16);
          this.rotateText.set(false);
          this.brotherCols.set(1);
          this.brotherRows.set(1);
      } else if (type === '29') {
          this.brotherWidth.set(29);
          this.brotherLabelHeight.set(15);
          this.fontSize.set(10);
          this.rotateText.set(false);
          this.brotherCols.set(1);
          this.brotherRows.set(1);
      } else if (type === '29x90') {
          this.brotherWidth.set(29);
          this.brotherPageHeight.set(90);
          this.fontSize.set(10);
          this.rotateText.set(false);
          this.brotherCols.set(1);
          this.brotherRows.set(6); // 6 labels of 15mm
      } else if (type === '29x42') {
          this.brotherWidth.set(29);
          this.brotherPageHeight.set(42);
          this.fontSize.set(10);
          this.rotateText.set(false);
          this.brotherCols.set(1);
          this.brotherRows.set(3); // 3 labels of 14mm
      } else if (type === '32x32') {
          this.brotherWidth.set(32);
          this.brotherPageHeight.set(32);
          this.fontSize.set(10);
          this.rotateText.set(false);
          this.brotherCols.set(1);
          this.brotherRows.set(1);
      } else if (type === '23x23') {
          this.brotherWidth.set(23);
          this.brotherPageHeight.set(23);
          this.fontSize.set(10);
          this.rotateText.set(false);
          this.brotherCols.set(1);
          this.brotherRows.set(1);
      } else if (type === '12') {
          this.brotherWidth.set(12);
          this.brotherLabelHeight.set(30);
          this.fontSize.set(10);
          this.rotateText.set(true);
          this.brotherCols.set(1);
          this.brotherRows.set(1);
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

  onInputChanged(val: string) {
      this.inputSubject.next(val);
  }

  updateInput(val: string) { this.rawInput.set(val); }
  clearInput() { 
      this.rawInput.set(''); 
      this.inputSubject.next('');
  }
  
  removeDuplicates() {
      const labels = this.parseInput(this.rawInput());
      const unique = [...new Set(labels)];
      const newVal = unique.join('\n');
      this.rawInput.set(newVal);
      this.inputSubject.next(newVal);
      this.toast.show(`Đã lọc bỏ ${labels.length - unique.length} mã trùng lặp`, 'success');
  }

  sortInput() {
      const labels = this.parseInput(this.rawInput());
      const sorted = labels.sort((a, b) => a.localeCompare(b));
      const newVal = sorted.join('\n');
      this.rawInput.set(newVal);
      this.inputSubject.next(newVal);
      this.toast.show('Đã sắp xếp danh sách A-Z', 'success');
  }

  addExample() {
      const ex = Array.from({length: 15}, (_, i) => `STD-${(i+1).toString().padStart(3,'0')}`).join('\n');
      this.rawInput.set(ex);
      this.inputSubject.next(ex);
  }

  adjustZoom(delta: number) {
      this.zoomLevel.update(z => Math.max(0.3, Math.min(3.0, z + delta)));
  }

  fitToScreen() {
      if (!this.previewContainer) return;
      
      const containerWidth = this.previewContainer.nativeElement.clientWidth - 64; // 64px padding
      const mode = this.printMode();
      
      let targetWidthMM = 210; // A4 width
      if (mode === 'brother') {
          targetWidthMM = this.brotherWidth();
      }
      
      // Convert mm to pixels (approximate 1mm = 3.78px)
      const targetWidthPx = targetWidthMM * 3.78;
      
      if (targetWidthPx > 0) {
          // Calculate zoom to fit width (with a max of 2.0)
          const newZoom = Math.min(2.0, Math.max(0.3, containerWidth / targetWidthPx));
          // Round to 1 decimal place
          this.zoomLevel.set(Math.round(newZoom * 10) / 10);
      }
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

  generateBarcode(text: string): string {
      if (!text) return '';
      try {
          const canvas = document.createElement('canvas');
          JsBarcode(canvas, text, {
              format: "CODE128",
              width: this.barcodeWidth(),
              height: this.barcodeHeight(),
              displayValue: false,
              margin: 0,
              background: "transparent"
          });
          return canvas.toDataURL('image/png');
      } catch (e) {
          console.error('Barcode error:', e);
          return '';
      }
  }

  // --- BROTHER PRINTING LOGIC (Direct Window Print) ---
  printBrother() {
      const pages = this.brotherPages();
      if (pages.length === 0) return;

      const w = this.brotherWidth();
      const h = this.actualBrotherPageHeight();
      const fs = this.fontSize() || 16;
      const rotate = this.rotateText();
      const cols = Math.max(1, this.brotherCols());
      const rows = this.isBrotherFixed() ? Math.max(1, this.brotherRows()) : Math.max(1, Math.ceil(pages[0].length / cols));
      const showCut = this.brotherShowCutLines();

      // Create a dedicated print window to isolate styles
      const printWindow = window.open('', '_blank', 'width=400,height=600');
      if (!printWindow) {
          this.toast.show('Trình duyệt chặn Pop-up. Hãy cho phép để in.', 'error');
          return;
      }

      const css = `
        @page { size: ${w}mm ${h}mm; margin: 0; }
        body { margin: 0; padding: 0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; background: white; color: black; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        * { box-sizing: border-box; }
        .page-container {
            width: ${w}mm;
            height: ${h}mm;
            page-break-inside: avoid;
            overflow: hidden;
            position: relative;
            display: grid;
            grid-template-columns: repeat(${cols}, 1fr);
            grid-template-rows: repeat(${rows}, 1fr);
        }
        .page-container:not(:last-child) {
            page-break-after: always;
        }
        .cell {
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 2px;
        }
        ${showCut ? `
        .cell {
            border-right: 1px dashed #cbd5e1;
            border-bottom: 1px dashed #cbd5e1;
        }
        .cell:nth-child(${cols}n) { border-right: none; }
        .cell:nth-last-child(-n+${cols}) { border-bottom: none; }
        ` : ''}
        .label-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            overflow: hidden;
            ${rotate ? 'writing-mode: vertical-rl; text-orientation: mixed; transform: rotate(180deg);' : ''}
        }
        .label-text {
            font-size: ${fs}pt;
            font-weight: bold;
            text-align: center;
            line-height: 1;
            word-break: break-all;
            width: 100%;
        }
        @media print {
            @page { size: ${w}mm ${h}mm; margin: 0; }
            body { margin: 0; }
        }
      `;

      let htmlContent = `<html><head><title>Brother Print</title><style>${css}</style></head><body>`;
      
      pages.forEach(page => {
          htmlContent += `<div class="page-container">`;
          page.forEach(label => {
              htmlContent += `<div class="cell"><div class="label-content">`;
              if (label) {
                  if (this.displayFormat() !== 'text') {
                      const barcodeSrc = this.generateBarcode(label);
                      htmlContent += `<img src="${barcodeSrc}" style="height: ${this.barcodeHeight()}px; max-width: 100%; object-fit: contain;" />`;
                  }
                  if (this.displayFormat() !== 'barcode') {
                      htmlContent += `<div class="label-text" style="${this.displayFormat() === 'barcode_text' ? 'margin-top: 2px;' : ''}">${label}</div>`;
                  }
              }
              htmlContent += `</div></div>`;
          });
          htmlContent += `</div>`;
      });

      htmlContent += `</body></html>`;

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load then print
      setTimeout(() => {
          printWindow.focus();
          printWindow.print();
      }, 500);
  }

  // --- A4 PRINTING LOGIC (Direct Window Print) ---
  printA4() {
      const pages = this.pages();
      const validPages = pages.filter((p, i) => i === 0 || p.cells.some(c => !c.isEmpty && c.index !== -1));
      
      if (this.rawInputCount() === 0 && this.skippedCells() === 0) return;

      const dims = this.layoutDims();
      const isPlain = this.printMode() === 'plain_a4';
      const showCut = isPlain && this.showCutLines();

      const printWindow = window.open('', '_blank', 'width=800,height=1000');
      if (!printWindow) {
          this.toast.show('Trình duyệt chặn Pop-up. Hãy cho phép để in.', 'error');
          return;
      }

      const css = `
        @page { size: A4 portrait; margin: 0; }
        body { margin: 0; padding: 0; font-family: 'Roboto Mono', monospace; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        * { box-sizing: border-box; }
        .page {
            width: 210mm;
            height: 297mm;
            padding-top: ${this.marginTop()}mm;
            padding-left: ${this.marginLeft()}mm;
            padding-right: ${this.marginLeft()}mm;
            padding-bottom: ${this.marginTop()}mm;
            page-break-after: always;
            page-break-inside: avoid;
            position: relative;
            overflow: hidden;
            background: white;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(${dims.cols}, ${dims.cellW}mm);
            grid-template-rows: repeat(${dims.rows}, ${dims.cellH}mm);
            gap: ${this.gapY()}mm ${this.gapX()}mm;
            align-content: start;
            justify-content: start;
        }
        .cell {
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            ${showCut ? 'border: 1px dashed #cbd5e1;' : ''}
        }
        .sub-label {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            padding: 0.5mm;
            overflow: hidden;
        }
        .sub-label:not(:last-child) {
            border-bottom: 1px dashed #cbd5e1;
        }
        .label-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        .text {
            font-size: ${this.fontSize()}pt;
            font-weight: bold;
            text-align: center;
            line-height: 1;
            word-break: break-all;
            width: 100%;
        }
        .vertical {
            writing-mode: vertical-rl;
            text-orientation: mixed;
            transform: rotate(180deg);
        }
        @media print {
            @page { margin: 0; }
            body { margin: 0; }
        }
      `;

      let htmlContent = `<html><head><title>Print A4 Labels</title><style>${css}</style></head><body>`;
      
      validPages.forEach(page => {
          htmlContent += `<div class="page"><div class="grid">`;
          page.cells.forEach(cell => {
              if (cell.isEmpty) {
                  htmlContent += `<div class="cell" style="opacity: 0;"></div>`;
              } else {
                  htmlContent += `<div class="cell">`;
                  cell.subLabels.forEach((label, idx) => {
                      const isLast = idx === cell.subLabels.length - 1;
                      htmlContent += `
                        <div class="sub-label" ${!isLast ? '' : 'style="border-bottom: none;"'}>
                            <div class="label-content ${this.rotateText() ? 'vertical' : ''}">
                      `;
                      if (label) {
                          if (this.displayFormat() !== 'text') {
                              const barcodeSrc = this.generateBarcode(label);
                              htmlContent += `<img src="${barcodeSrc}" style="height: ${this.barcodeHeight()}px; max-width: 100%; object-fit: contain;" />`;
                          }
                          if (this.displayFormat() !== 'barcode') {
                              htmlContent += `<span class="text" style="${this.displayFormat() === 'barcode_text' ? 'margin-top: 2px;' : ''}">${label}</span>`;
                          }
                      }
                      htmlContent += `</div></div>`;
                  });
                  htmlContent += `</div>`;
              }
          });
          htmlContent += `</div></div>`;
      });

      htmlContent += `</body></html>`;

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      setTimeout(() => {
          printWindow.focus();
          printWindow.print();
      }, 500);
  }
}
