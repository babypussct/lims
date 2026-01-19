
import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../inventory/inventory.service';
import { AuthService } from '../../core/services/auth.service';
import { InventoryItem } from '../../core/models/inventory.model';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { formatNum, UNIT_OPTIONS, parseQuantityInput } from '../../shared/utils/utils';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';

type CalcMode = 'molar' | 'dilution' | 'spiking' | 'serial' | 'mix';
type SystemMode = 'sandbox' | 'real';

interface MixItem {
    id: string; // for tracking
    name: string;
    stockConc: number;
    targetConc: number;
    invItem: InventoryItem | null; // Linked inventory item
}

@Component({
  selector: 'app-smart-prep',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col fade-in pb-10 font-sans text-slate-800">
        
        <!-- HEADER & MODE SWITCHER -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 shrink-0 relative overflow-hidden transition-all duration-500"
             [class.border-purple-200]="systemMode() === 'real'"
             [class.shadow-purple-100]="systemMode() === 'real'">
            
            @if(systemMode() === 'real') {
                <div class="absolute inset-0 bg-gradient-to-r from-purple-50 via-white to-white opacity-50 pointer-events-none"></div>
            }

            <div class="relative z-10">
                <h2 class="text-2xl font-black flex items-center gap-3 transition-colors"
                    [class.text-slate-800]="systemMode() === 'sandbox'"
                    [class.text-purple-700]="systemMode() === 'real'">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-colors"
                         [class.bg-slate-700]="systemMode() === 'sandbox'"
                         [class.bg-gradient-to-br]="systemMode() === 'sandbox' ? 'from-slate-600 to-slate-800' : 'from-purple-600 to-pink-600'">
                        <i class="fa-solid fa-flask-vial"></i>
                    </div>
                    Trạm Pha Chế
                </h2>
                <p class="text-xs font-bold mt-1 ml-1" 
                   [class.text-slate-400]="systemMode() === 'sandbox'"
                   [class.text-purple-500]="systemMode() === 'real'">
                   {{ systemMode() === 'sandbox' ? 'Chế độ Nháp (Sandbox)' : 'Chế độ Thực (Real) - Kết nối Kho' }}
                </p>
            </div>

            <div class="relative z-10 flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button (click)="setSystemMode('sandbox')" 
                        class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-2"
                        [class]="systemMode() === 'sandbox' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'">
                    <i class="fa-solid fa-calculator"></i> Nháp
                </button>
                <button (click)="setSystemMode('real')" 
                        class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-2"
                        [class]="systemMode() === 'real' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'"
                        [class.opacity-60]="!auth.canEditInventory() && systemMode() !== 'real'"
                        [title]="auth.canEditInventory() ? 'Chế độ Thực (Trừ kho)' : 'Yêu cầu quyền Sửa Kho (Inventory Edit)'">
                    <i class="fa-solid fa-link"></i> Kho
                    @if(!auth.canEditInventory()) { <i class="fa-solid fa-lock text-[9px]"></i> }
                </button>
            </div>
        </div>

        <div class="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 relative z-10">
            
            <!-- LEFT: INPUT PANEL -->
            <div class="w-full lg:w-5/12 bg-white rounded-3xl shadow-soft-xl border border-slate-100 flex flex-col overflow-hidden">
                
                <!-- Tab Navigation (Scrollable) -->
                <div class="flex border-b border-slate-100 overflow-x-auto no-scrollbar">
                    <button (click)="setCalcMode('molar')" class="flex-1 min-w-[80px] py-4 text-[10px] font-bold uppercase tracking-wider border-b-2 transition hover:bg-slate-50 whitespace-nowrap"
                            [class]="calcMode() === 'molar' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-400'">
                        Molar (Rắn)
                    </button>
                    <button (click)="setCalcMode('dilution')" class="flex-1 min-w-[80px] py-4 text-[10px] font-bold uppercase tracking-wider border-b-2 transition hover:bg-slate-50 whitespace-nowrap"
                            [class]="calcMode() === 'dilution' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400'">
                        Pha Loãng
                    </button>
                    <button (click)="setCalcMode('spiking')" class="flex-1 min-w-[80px] py-4 text-[10px] font-bold uppercase tracking-wider border-b-2 transition hover:bg-slate-50 whitespace-nowrap"
                            [class]="calcMode() === 'spiking' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400'">
                        Spiking
                    </button>
                    <button (click)="setCalcMode('serial')" class="flex-1 min-w-[80px] py-4 text-[10px] font-bold uppercase tracking-wider border-b-2 transition hover:bg-slate-50 whitespace-nowrap"
                            [class]="calcMode() === 'serial' ? 'border-fuchsia-500 text-fuchsia-600' : 'border-transparent text-slate-400'">
                        Dãy Chuẩn
                    </button>
                    <button (click)="setCalcMode('mix')" class="flex-1 min-w-[80px] py-4 text-[10px] font-bold uppercase tracking-wider border-b-2 transition hover:bg-slate-50 whitespace-nowrap"
                            [class]="calcMode() === 'mix' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-400'">
                        Pha Mix
                    </button>
                </div>

                <div class="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-6">
                    
                    <!-- GLOBAL CHEMICAL SELECTOR (For Single-Item Modes) -->
                    @if (systemMode() === 'real' && calcMode() !== 'mix') {
                        <div class="bg-purple-50 p-4 rounded-xl border border-purple-100 space-y-2 animate-slide-up">
                            <label class="text-[10px] font-bold text-purple-800 uppercase flex items-center gap-2">
                                <i class="fa-solid fa-search"></i> Chọn Hóa chất từ Kho
                            </label>
                            
                            @if (!selectedItem()) {
                                <div class="relative">
                                    <input [ngModel]="searchTerm()" (ngModelChange)="onSearch($event)" 
                                           placeholder="Nhập tên, mã số, hoặc công thức..." 
                                           class="w-full pl-4 pr-10 py-3 rounded-xl border-none ring-1 ring-purple-200 focus:ring-2 focus:ring-purple-500 outline-none text-sm font-bold text-slate-700 placeholder-purple-300 shadow-sm">
                                    
                                    @if (isSearching()) {
                                        <div class="absolute right-3 top-3 text-purple-500"><i class="fa-solid fa-circle-notch fa-spin"></i></div>
                                    }

                                    <!-- Dropdown -->
                                    @if (searchResults().length > 0) {
                                        <div class="absolute top-full left-0 w-full mt-1 bg-white rounded-xl shadow-xl border border-slate-100 max-h-60 overflow-y-auto z-50 custom-scrollbar">
                                            @for (item of searchResults(); track item.id) {
                                                <div (click)="selectGlobalItem(item)" class="p-3 hover:bg-purple-50 cursor-pointer border-b border-slate-50 last:border-0 group">
                                                    <div class="font-bold text-sm text-slate-700 group-hover:text-purple-700">{{item.name}}</div>
                                                    <div class="flex justify-between mt-1">
                                                        <span class="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">{{item.id}}</span>
                                                        <span class="text-[10px] font-bold" [class]="item.stock > 0 ? 'text-emerald-600' : 'text-red-500'">
                                                            Tồn: {{formatNum(item.stock)}} {{item.unit}}
                                                        </span>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    }
                                </div>
                            } @else {
                                <div class="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-purple-100 shadow-sm">
                                    <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs shrink-0">
                                        <i class="fa-solid fa-flask"></i>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="text-xs font-bold text-slate-700 truncate">{{selectedItem()?.name}}</div>
                                        <div class="text-[10px] text-slate-500">
                                            ID: {{selectedItem()?.id}} | Tồn: <b class="text-emerald-600">{{formatNum(selectedItem()?.stock)}} {{selectedItem()?.unit}}</b>
                                        </div>
                                    </div>
                                    <button (click)="clearSelection()" class="text-slate-400 hover:text-red-500 transition px-2"><i class="fa-solid fa-times"></i></button>
                                </div>
                            }
                        </div>
                    }

                    <!-- INPUT FORM AREA -->
                    <div class="space-y-5">
                        
                        <!-- 1. MOLAR -->
                        @if (calcMode() === 'molar') {
                            <div class="grid grid-cols-2 gap-4">
                                <div class="space-y-1">
                                    <label class="label">Phân tử lượng (MW)</label>
                                    <div class="input-group">
                                        <input type="number" [(ngModel)]="mw" class="input-field text-center" placeholder="0.00">
                                        <span class="unit">g/mol</span>
                                    </div>
                                </div>
                                <div class="space-y-1">
                                    <label class="label">Độ tinh khiết (%)</label>
                                    <div class="input-group">
                                        <input type="number" [(ngModel)]="purity" class="input-field text-center text-blue-600" placeholder="100">
                                        <span class="unit">%</span>
                                    </div>
                                </div>
                            </div>
                            <div class="h-px bg-slate-100"></div>
                            <div class="space-y-1">
                                <label class="label">Nồng độ mong muốn</label>
                                <div class="flex gap-2">
                                    <input type="number" [(ngModel)]="targetConc" class="input-field flex-1" placeholder="VD: 0.5">
                                    <select [(ngModel)]="targetConcUnit" class="input-select w-24"><option value="M">M</option><option value="mM">mM</option></select>
                                </div>
                            </div>
                            <div class="space-y-1">
                                <label class="label">Thể tích đích</label>
                                <div class="flex gap-2">
                                    <input type="number" [(ngModel)]="targetVol" class="input-field flex-1" placeholder="VD: 100">
                                    <select [(ngModel)]="targetVolUnit" class="input-select w-24"><option value="ml">mL</option><option value="l">L</option></select>
                                </div>
                            </div>
                        }

                        <!-- 2. DILUTION -->
                        @if (calcMode() === 'dilution') {
                            <div class="space-y-1">
                                <label class="label">Nồng độ gốc (Stock)</label>
                                <div class="flex gap-2">
                                    <input type="number" [(ngModel)]="stockConc" class="input-field flex-1 font-bold text-orange-600" placeholder="C1">
                                    <select [(ngModel)]="concUnit" class="input-select w-24"><option value="ppm">ppm</option><option value="M">M</option><option value="%">%</option></select>
                                </div>
                            </div>
                            <div class="space-y-1">
                                <label class="label">Nồng độ đích (Target)</label>
                                <div class="flex gap-2">
                                    <input type="number" [(ngModel)]="targetConc" class="input-field flex-1" placeholder="C2">
                                    <div class="w-24 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-500">{{concUnit()}}</div>
                                </div>
                            </div>
                            <div class="space-y-1">
                                <label class="label">Thể tích đích (V2)</label>
                                <div class="flex gap-2">
                                    <input type="number" [(ngModel)]="targetVol" class="input-field flex-1" placeholder="VD: 100">
                                    <select [(ngModel)]="targetVolUnit" class="input-select w-24"><option value="ml">mL</option><option value="l">L</option></select>
                                </div>
                            </div>
                        }

                        <!-- 3. SPIKING -->
                        @if (calcMode() === 'spiking') {
                             <div class="grid grid-cols-2 gap-4">
                                <div class="space-y-1">
                                    <label class="label">Nồng độ Chuẩn (Stock)</label>
                                    <input type="number" [(ngModel)]="stockConc" class="input-field text-center font-bold" placeholder="C_stock">
                                </div>
                                <div class="space-y-1">
                                    <label class="label">Nồng độ Thêm (Added)</label>
                                    <input type="number" [(ngModel)]="targetConc" class="input-field text-center" placeholder="C_added">
                                </div>
                             </div>
                             <div class="space-y-1">
                                <label class="label">Thể tích mẫu (V_sample)</label>
                                <div class="flex gap-2">
                                    <input type="number" [(ngModel)]="targetVol" class="input-field flex-1" placeholder="VD: 10">
                                    <select [(ngModel)]="targetVolUnit" class="input-select w-24"><option value="ml">mL</option><option value="l">L</option></select>
                                </div>
                             </div>
                        }

                        <!-- 4. SERIAL DILUTION (New) -->
                        @if (calcMode() === 'serial') {
                            <div class="space-y-1">
                                <label class="label">Nồng độ Gốc (Stock)</label>
                                <div class="flex gap-2">
                                    <input type="number" [(ngModel)]="stockConc" class="input-field flex-1 font-bold text-fuchsia-600" placeholder="VD: 1000">
                                    <select [(ngModel)]="concUnit" class="input-select w-24"><option value="ppm">ppm</option><option value="M">M</option><option value="%">%</option></select>
                                </div>
                            </div>
                            <div class="space-y-1">
                                <label class="label">Thể tích định mức mỗi điểm</label>
                                <div class="flex gap-2">
                                    <input type="number" [(ngModel)]="targetVol" class="input-field flex-1" placeholder="VD: 10 (cho mỗi bình)">
                                    <div class="w-24 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-500">mL</div>
                                </div>
                            </div>
                            <div class="space-y-1">
                                <label class="label">Các điểm chuẩn (Phân cách bằng dấu phẩy)</label>
                                <input type="text" [(ngModel)]="serialPointsStr" class="input-field border-2 border-fuchsia-100 focus:border-fuchsia-400" placeholder="VD: 5, 10, 20, 50, 100">
                                <p class="text-[9px] text-slate-400 mt-1 italic">Hệ thống sẽ tính lượng hút Stock cho từng điểm.</p>
                            </div>
                        }

                        <!-- 5. MIXER (New) -->
                        @if (calcMode() === 'mix') {
                            <div class="space-y-1">
                                <label class="label">Thể tích Tổng (Bình định mức)</label>
                                <div class="flex gap-2">
                                    <input type="number" [(ngModel)]="targetVol" class="input-field flex-1 text-center font-black text-indigo-600" placeholder="VD: 100">
                                    <div class="w-24 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-500">mL</div>
                                </div>
                            </div>
                            
                            <div class="h-px bg-slate-100 my-2"></div>
                            
                            <!-- Mix Rows -->
                            <div class="space-y-2">
                                <label class="label flex justify-between">
                                    <span>Thành phần</span>
                                    <button (click)="addMixRow()" class="text-indigo-600 hover:underline">+ Thêm chất</button>
                                </label>
                                @for (row of mixItems(); track row.id; let i = $index) {
                                    <div class="bg-slate-50 p-2 rounded-xl border border-slate-200 relative group">
                                        <!-- Remove Btn -->
                                        <button (click)="removeMixRow(i)" class="absolute -right-2 -top-2 w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition"><i class="fa-solid fa-times text-[10px]"></i></button>
                                        
                                        <!-- Name / Search -->
                                        <div class="mb-2 relative">
                                            @if(systemMode() === 'real' && !row.invItem) {
                                                <div class="flex gap-1">
                                                    <input placeholder="Tìm chất..." 
                                                           (input)="onSearchMix(i, $event)"
                                                           class="w-full text-xs p-2 rounded border border-indigo-200 outline-none focus:ring-1">
                                                </div>
                                                <!-- Dropdown for this row -->
                                                @if(activeMixSearchIndex() === i && searchResults().length > 0) {
                                                    <div class="absolute top-full left-0 w-full z-20 bg-white shadow-lg rounded-lg max-h-40 overflow-y-auto mt-1 border border-slate-100">
                                                        @for(res of searchResults(); track res.id) {
                                                            <div (click)="selectMixItem(i, res)" class="p-2 hover:bg-indigo-50 cursor-pointer text-xs border-b border-slate-50">
                                                                <div class="font-bold truncate">{{res.name}}</div>
                                                                <div class="text-[9px] text-slate-400">Ton: {{res.stock}} {{res.unit}}</div>
                                                            </div>
                                                        }
                                                    </div>
                                                }
                                            } @else if (row.invItem) {
                                                <div class="flex items-center justify-between bg-white px-2 py-1.5 rounded border border-indigo-100">
                                                    <span class="text-xs font-bold text-indigo-700 truncate">{{row.invItem.name}}</span>
                                                    <button (click)="clearMixItem(i)" class="text-slate-400 hover:text-red-500"><i class="fa-solid fa-rotate-left"></i></button>
                                                </div>
                                            } @else {
                                                <!-- Sandbox Input -->
                                                <input [(ngModel)]="row.name" class="w-full text-xs p-2 rounded border border-slate-200 font-bold bg-white" placeholder="Tên chất {{i+1}}">
                                            }
                                        </div>

                                        <!-- Concs -->
                                        <div class="flex gap-2">
                                            <input type="number" [(ngModel)]="row.stockConc" class="flex-1 min-w-0 p-1.5 text-xs border border-slate-200 rounded text-center" placeholder="Stock">
                                            <span class="text-slate-400 text-xs self-center">→</span>
                                            <input type="number" [(ngModel)]="row.targetConc" class="flex-1 min-w-0 p-1.5 text-xs border border-slate-200 rounded text-center" placeholder="Target">
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>

            <!-- RIGHT: RESULTS PANEL -->
            <div class="flex-1 flex flex-col gap-6">
                
                <!-- Result Card -->
                <div class="bg-white rounded-3xl shadow-soft-xl border border-slate-100 overflow-hidden relative flex-1 flex flex-col">
                    <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r transition-colors duration-500" 
                         [class.from-blue-500]="calcMode() === 'molar'" [class.to-cyan-400]="calcMode() === 'molar'"
                         [class.from-orange-500]="calcMode() === 'dilution'" [class.to-yellow-400]="calcMode() === 'dilution'"
                         [class.from-emerald-500]="calcMode() === 'spiking'" [class.to-green-400]="calcMode() === 'spiking'"
                         [class.from-fuchsia-500]="calcMode() === 'serial'" [class.to-pink-400]="calcMode() === 'serial'"
                         [class.from-indigo-500]="calcMode() === 'mix'" [class.to-purple-400]="calcMode() === 'mix'">
                    </div>

                    <div class="p-6 md:p-8 flex flex-col flex-1 overflow-y-auto custom-scrollbar">
                        <div class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 text-center">Kết quả tính toán</div>
                        
                        <!-- MODE: Single Value Results -->
                        @if (calcMode() === 'molar' || calcMode() === 'dilution' || calcMode() === 'spiking') {
                            <div class="text-center space-y-4">
                                <div class="relative inline-block">
                                    <h1 class="text-6xl md:text-7xl font-black tracking-tight text-slate-800 tabular-nums">
                                        {{ formatNum(resultValue()) }}
                                    </h1>
                                    <span class="absolute -right-12 top-2 text-xl font-bold text-slate-400">{{ resultUnit() }}</span>
                                </div>
                                <p class="text-sm font-medium text-slate-500 max-w-xs mx-auto leading-relaxed">
                                    {{ resultDescription() }}
                                </p>
                            </div>
                        }

                        <!-- MODE: Serial / Mix Results (Tables) -->
                        @if (calcMode() === 'serial') {
                            <div class="w-full">
                                <table class="w-full text-sm text-left">
                                    <thead class="text-xs text-fuchsia-600 bg-fuchsia-50 uppercase font-bold">
                                        <tr>
                                            <th class="px-4 py-2 rounded-l-lg">Điểm chuẩn</th>
                                            <th class="px-4 py-2 text-right">Hút Stock</th>
                                            <th class="px-4 py-2 text-right rounded-r-lg">Thêm DM</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100">
                                        @for (pt of serialResult(); track pt.point) {
                                            <tr>
                                                <td class="px-4 py-3 font-bold text-slate-700">{{pt.point}} {{concUnit()}}</td>
                                                <td class="px-4 py-3 text-right font-mono font-bold text-fuchsia-600">{{formatNum(pt.vStock)}} µL</td>
                                                <td class="px-4 py-3 text-right text-slate-500">{{formatNum(pt.vSolvent)}} mL</td>
                                            </tr>
                                        }
                                        <tr class="bg-slate-50 font-bold border-t border-slate-200">
                                            <td class="px-4 py-2 text-slate-500">TỔNG</td>
                                            <td class="px-4 py-2 text-right text-fuchsia-700">{{formatNum(serialTotalStock())}} µL</td>
                                            <td class="px-4 py-2 text-right"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        }

                        @if (calcMode() === 'mix') {
                            <div class="w-full">
                                <div class="mb-4 text-center">
                                    <span class="text-xs text-slate-400 uppercase font-bold">Tổng dung môi thêm:</span>
                                    <div class="text-2xl font-black text-indigo-600">{{formatNum(mixResult().solventVol)}} <span class="text-sm text-slate-400">mL</span></div>
                                </div>
                                <table class="w-full text-sm text-left">
                                    <thead class="text-xs text-indigo-600 bg-indigo-50 uppercase font-bold">
                                        <tr>
                                            <th class="px-3 py-2 rounded-l-lg">Chất</th>
                                            <th class="px-3 py-2 text-right rounded-r-lg">Lượng Hút</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100">
                                        @for (res of mixResult().details; track res.name) {
                                            <tr>
                                                <td class="px-3 py-2 font-bold text-slate-700 truncate max-w-[150px]">{{res.name}}</td>
                                                <td class="px-3 py-2 text-right font-mono font-bold text-indigo-600">{{formatNum(res.vStock)}} mL</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        }

                        <!-- STOCK BAR (Real Mode) -->
                        @if (systemMode() === 'real' && (selectedItem() || calcMode() === 'serial' || calcMode() === 'mix')) {
                            <div class="w-full max-w-sm mx-auto mt-6 bg-slate-50 rounded-xl p-4 border border-slate-100">
                                @if (calcMode() === 'mix') {
                                    <div class="text-xs font-bold text-slate-500 mb-2 uppercase">Trạng thái kho (Mix)</div>
                                    <div class="space-y-2">
                                        @for (status of mixStockStatus(); track status.name) {
                                            <div class="flex justify-between items-center text-[10px]">
                                                <span class="truncate max-w-[120px]">{{status.name}}</span>
                                                <span class="font-bold" [class]="status.ok ? 'text-emerald-600' : 'text-red-500'">
                                                    {{status.ok ? 'Đủ hàng' : 'Thiếu hàng'}}
                                                </span>
                                            </div>
                                        }
                                    </div>
                                } @else {
                                    <div class="flex justify-between text-xs font-bold mb-2">
                                        <span class="text-slate-500 uppercase">Tồn kho</span>
                                        <span [class]="canFulfill() ? 'text-emerald-600' : 'text-red-600'">
                                            {{ formatNum(selectedItem()?.stock || 0) }} {{ selectedItem()?.unit || ''}}
                                        </span>
                                    </div>
                                    <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                        <div class="h-full rounded-full transition-all duration-500"
                                             [style.width.%]="stockPercentage()"
                                             [class.bg-emerald-500]="canFulfill()"
                                             [class.bg-red-500]="!canFulfill()">
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                    </div>

                    <!-- Actions Footer -->
                    <div class="p-5 bg-slate-50 border-t border-slate-100 flex gap-3 shrink-0">
                        <button class="flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-3 rounded-xl shadow-sm hover:bg-slate-50 transition active:scale-95">
                            <i class="fa-solid fa-print mr-2"></i> In Nhãn
                        </button>
                        
                        @if (systemMode() === 'real') {
                            <button (click)="confirmTransaction()" 
                                    [disabled]="!canFulfill() || isProcessing()"
                                    class="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl shadow-md shadow-purple-200 hover:shadow-lg transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                                @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> } 
                                @else { <i class="fa-solid fa-boxes-packing mr-2"></i> Trừ kho }
                            </button>
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>
  `,
  styles: [`
    .label { @apply text-[10px] font-bold text-slate-500 uppercase block mb-1 tracking-wide; }
    .input-group { @apply flex items-center border border-slate-200 rounded-xl bg-slate-50 focus-within:bg-white focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition overflow-hidden; }
    .input-field { @apply w-full bg-transparent border-none p-3 text-sm font-bold text-slate-700 outline-none placeholder-slate-300; }
    .unit { @apply pr-3 text-xs font-bold text-slate-400 select-none; }
    .input-select { @apply bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none focus:border-blue-400 cursor-pointer; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class SmartPrepComponent {
  invService = inject(InventoryService);
  toast = inject(ToastService);
  confirmation = inject(ConfirmationService);
  auth = inject(AuthService);
  
  formatNum = formatNum;

  // --- STATE ---
  systemMode = signal<SystemMode>('sandbox');
  calcMode = signal<CalcMode>('molar');
  
  // Inputs: Single Modes
  mw = signal<number>(0);
  purity = signal<number>(100);
  stockConc = signal<number>(0);
  concUnit = signal<string>('M'); 
  targetConc = signal<number>(0);
  targetConcUnit = signal<string>('M');
  targetVol = signal<number>(0);
  targetVolUnit = signal<string>('ml');

  // Inputs: Serial
  serialPointsStr = signal<string>('');

  // Inputs: Mix
  mixItems = signal<MixItem[]>([{ id: '1', name: '', stockConc: 0, targetConc: 0, invItem: null }]);
  activeMixSearchIndex = signal<number | null>(null);

  // Real Mode State
  searchTerm = signal('');
  isSearching = signal(false);
  searchResults = signal<InventoryItem[]>([]);
  selectedItem = signal<InventoryItem | null>(null);
  isProcessing = signal(false);

  // Search Logic
  searchSubject = new Subject<{term: string, index?: number}>();

  constructor() {
      this.searchSubject.pipe(
          debounceTime(300),
          distinctUntilChanged((p, c) => p.term === c.term),
          switchMap(data => {
              if (!data.term.trim()) return of([]);
              this.isSearching.set(true);
              return this.invService.getInventoryPage(10, null, 'all', data.term).then(res => {
                  this.isSearching.set(false);
                  return res.items;
              });
          })
      ).subscribe(items => this.searchResults.set(items));

      // Auto-reset when switching modes
      effect(() => {
          if (this.systemMode() === 'sandbox') {
              this.clearSelection();
          }
      }, { allowSignalWrites: true });
  }

  setSystemMode(mode: SystemMode) { 
      if (mode === 'real') {
          if (!this.auth.canEditInventory()) {
              this.toast.show('Bạn cần quyền "Sửa Kho" để sử dụng chế độ Thực.', 'error');
              return;
          }
      }
      this.systemMode.set(mode); 
  }
  
  setCalcMode(mode: CalcMode) { this.calcMode.set(mode); }

  // --- SEARCH HANDLERS ---
  onSearch(term: string) { 
      this.searchTerm.set(term); 
      this.searchSubject.next({term}); 
  }
  
  selectGlobalItem(item: InventoryItem) {
      this.selectedItem.set(item);
      this.searchResults.set([]);
      this.searchTerm.set('');
  }

  onSearchMix(index: number, event: any) {
      this.activeMixSearchIndex.set(index);
      this.searchSubject.next({ term: event.target.value, index });
  }

  selectMixItem(index: number, item: InventoryItem) {
      this.mixItems.update(items => {
          const newItems = [...items];
          newItems[index] = { ...newItems[index], name: item.name, invItem: item };
          return newItems;
      });
      this.activeMixSearchIndex.set(null);
      this.searchResults.set([]);
  }

  clearSelection() {
      this.selectedItem.set(null);
      this.searchResults.set([]);
      this.searchTerm.set('');
  }

  // --- MIX ROW ACTIONS ---
  addMixRow() {
      this.mixItems.update(i => [...i, { id: Date.now().toString(), name: '', stockConc: 0, targetConc: 0, invItem: null }]);
  }
  removeMixRow(i: number) {
      this.mixItems.update(items => items.filter((_, idx) => idx !== i));
  }
  clearMixItem(i: number) {
      this.mixItems.update(items => {
          const newItems = [...items];
          newItems[i] = { ...newItems[i], name: '', invItem: null };
          return newItems;
      });
  }

  // --- CALCULATIONS ---

  resultValue = computed(() => {
      const mode = this.calcMode();
      if (mode === 'molar') {
          const C = this.targetConc(); 
          const V = this.getVolInLiters();
          const MW = this.mw();
          const P = this.purity() || 100;
          if (!MW) return 0;
          let mols = C * V;
          if (this.targetConcUnit() === 'mM') mols = mols / 1000;
          return mols * MW * (100 / P);
      }
      if (mode === 'dilution') {
          const C1 = this.stockConc();
          const C2 = this.targetConc();
          const V2 = this.targetVol();
          if (C1 === 0) return 0;
          return (C2 * V2) / C1;
      }
      if (mode === 'spiking') {
          const V_sample = this.targetVol();
          const C_add = this.targetConc();
          const C_stock = this.stockConc();
          if (C_stock === 0) return 0;
          return V_sample * (C_add / C_stock);
      }
      return 0;
  });

  serialResult = computed(() => {
      if (this.calcMode() !== 'serial') return [];
      const points = this.serialPointsStr().split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
      const C1 = this.stockConc();
      const V2 = this.targetVol(); // mL per point
      if (C1 <= 0 || V2 <= 0) return [];

      return points.map(C2 => {
          const v1_ul = (C2 * V2 / C1) * 1000; // Convert result to uL for easier reading
          const v1_ml = v1_ul / 1000;
          return { point: C2, vStock: v1_ul, vSolvent: V2 - v1_ml };
      });
  });

  serialTotalStock = computed(() => {
      return this.serialResult().reduce((sum, item) => sum + item.vStock, 0);
  });

  mixResult = computed(() => {
      if (this.calcMode() !== 'mix') return { details: [], solventVol: 0 };
      const V_total = this.targetVol();
      if (V_total <= 0) return { details: [], solventVol: 0 };

      let totalStockVol = 0;
      const details = this.mixItems().map(item => {
          if (item.stockConc <= 0) return { name: item.name || 'Unknown', vStock: 0 };
          const v = (item.targetConc * V_total) / item.stockConc;
          totalStockVol += v;
          return { name: item.name || 'Unknown', vStock: v };
      });

      return { details, solventVol: Math.max(0, V_total - totalStockVol) };
  });

  resultUnit = computed(() => {
      const mode = this.calcMode();
      if (mode === 'molar') return 'g';
      if (mode === 'dilution' || mode === 'spiking') return this.targetVolUnit(); 
      return '';
  });

  resultDescription = computed(() => {
      const res = this.formatNum(this.resultValue());
      const unit = this.resultUnit();
      const mode = this.calcMode();

      if (mode === 'molar') return `Cân chính xác ${res} ${unit} chất rắn, hòa tan và định mức đến ${this.targetVol()} ${this.targetVolUnit()}.`;
      if (mode === 'dilution') {
          const v2 = this.targetVol(); const v1 = this.resultValue();
          const solvent = v2 - v1;
          return `Hút ${res} ${unit} gốc, thêm ${this.formatNum(solvent)} ${unit} dung môi để đạt ${v2} ${unit}.`;
      }
      if (mode === 'spiking') return `Hút ${res} ${unit} chuẩn gốc thêm vào ${this.targetVol()} ${this.targetVolUnit()} mẫu.`;
      return '';
  });

  // --- HELPERS ---
  getVolInLiters(): number {
      const v = this.targetVol();
      return this.targetVolUnit() === 'ml' ? v / 1000 : v;
  }

  // --- VALIDATION & STOCK ---
  mixStockStatus = computed(() => {
      if (this.calcMode() !== 'mix') return [];
      const res = this.mixResult();
      return this.mixItems().map((item, idx) => {
          const required = res.details[idx]?.vStock || 0;
          // Assume mL for mix mode mostly
          const hasStock = item.invItem ? (item.invItem.stock >= required) : true;
          return { name: item.name || `Chất ${idx+1}`, ok: hasStock };
      });
  });

  stockPercentage = computed(() => {
      const item = this.selectedItem();
      if (!item) return 0;
      
      let required = 0;
      if (this.calcMode() === 'serial') required = this.serialTotalStock() / 1000; // uL to mL
      else required = this.resultValue();

      // Normalize simple units (assuming Calculator outputs 'g' or 'ml')
      if (this.resultUnit() === 'L' && item.unit === 'ml') required *= 1000;
      if (this.calcMode() === 'serial' && item.unit === 'ml') { /* handled above */ }
      
      if (item.stock <= 0) return 0;
      return Math.min((required / item.stock) * 100, 100);
  });

  canFulfill = computed(() => {
      const mode = this.calcMode();
      
      if (mode === 'mix') {
          if (this.systemMode() === 'sandbox') return true;
          const status = this.mixStockStatus();
          return status.length > 0 && status.every(s => s.ok);
      }

      const item = this.selectedItem();
      if (!item) return false;
      
      let required = 0;
      if (mode === 'serial') required = this.serialTotalStock() / 1000; // uL to mL
      else required = this.resultValue();

      if (this.resultUnit() === 'L' && item.unit === 'ml') required *= 1000;
      
      return item.stock >= required;
  });

  async confirmTransaction() {
      if (!this.auth.canEditInventory()) {
           this.toast.show('Truy cập bị từ chối.', 'error');
           return;
      }

      if (!this.canFulfill()) return;
      
      const mode = this.calcMode();
      
      // CONFIRMATION MSG
      let msg = '';
      if (mode === 'mix') {
          msg = `Xác nhận trừ kho cho ${this.mixItems().length} chất trong hỗn hợp?`;
      } else if (mode === 'serial') {
          const totalUl = this.serialTotalStock();
          msg = `Xác nhận trừ kho ${this.formatNum(totalUl)} µL (~${this.formatNum(totalUl/1000)} mL) của "${this.selectedItem()?.name}"?`;
      } else {
          msg = `Xác nhận trừ kho ${this.formatNum(this.resultValue())} ${this.resultUnit()} của "${this.selectedItem()?.name}"?`;
      }

      if (await this.confirmation.confirm({ message: msg, confirmText: 'Xác nhận & Trừ kho' })) {
          this.isProcessing.set(true);
          try {
              if (mode === 'mix') {
                  // Loop deduction for MIX
                  const details = this.mixResult().details;
                  for(let i=0; i<this.mixItems().length; i++) {
                      const mItem = this.mixItems()[i];
                      const amount = details[i].vStock; // mL
                      if (mItem.invItem && amount > 0) {
                          await this.invService.updateStock(mItem.invItem.id, mItem.invItem.stock, -amount, 'Pha Mix');
                      }
                  }
              } else {
                  // Single Item Deduction
                  const item = this.selectedItem()!;
                  let amount = (mode === 'serial') ? (this.serialTotalStock() / 1000) : this.resultValue();
                  // Normalize unit if needed
                  if (this.resultUnit() === 'L' && item.unit === 'ml') amount *= 1000;
                  
                  await this.invService.updateStock(item.id, item.stock, -amount, `Smart Prep: ${mode}`);
              }
              
              this.toast.show('Giao dịch thành công!', 'success');
              this.setSystemMode('sandbox');
          } catch (e: any) {
              this.toast.show('Lỗi: ' + e.message, 'error');
          } finally {
              this.isProcessing.set(false);
          }
      }
  }
}
